"""Issue a public certificate from a CSR; TLS private keys stay on the VM.

Requires: python -m pip install acme
Keep --state outside the repository: it contains the ACME account key.
"""
import argparse
import datetime
import json
import re
from pathlib import Path

import josepy
from acme import challenges, client, messages
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['prepare', 'complete'])
    parser.add_argument('--state', required=True, type=Path)
    parser.add_argument('--csr', type=Path)
    parser.add_argument('--name', default='monitoring')
    args = parser.parse_args()
    if not re.fullmatch(r'[a-z0-9-]+', args.name):
        parser.error('--name must use lowercase letters, digits, or hyphens')
    args.state.mkdir(parents=True, exist_ok=True)
    key_path = args.state / 'account-key.pem'
    if not key_path.exists():
        key = rsa.generate_private_key(public_exponent=65537, key_size=3072)
        key_path.write_bytes(key.private_bytes(serialization.Encoding.PEM,
                             serialization.PrivateFormat.PKCS8,
                             serialization.NoEncryption()))
    key = josepy.JWKRSA(key=serialization.load_pem_private_key(key_path.read_bytes(), None))
    net = client.ClientNetwork(key, user_agent='docsite-lan-csr', timeout=15)
    directory = messages.Directory.from_json(
        net.get('https://acme-v02.api.letsencrypt.org/directory').json())
    acme = client.ClientV2(directory, net)
    account_path = args.state / 'account.json'
    if account_path.exists():
        net.account = messages.RegistrationResource.json_loads(account_path.read_text())
    else:
        account = acme.new_account(messages.NewRegistration.from_data(
            terms_of_service_agreed=True))
        account_path.write_text(account.json_dumps(), encoding='utf-8')
    order_path = args.state / f'{args.name}-order.json'
    if args.action == 'prepare':
        if not args.csr:
            parser.error('--csr is required for prepare')
        csr = args.csr.read_bytes()
        if order_path.exists():
            order = messages.OrderResource.json_loads(order_path.read_text())
            if order.csr_pem != csr:
                raise SystemExit('Existing order belongs to a different CSR; use another state directory.')
        else:
            order = acme.new_order(csr)
            order_path.write_text(order.json_dumps(), encoding='utf-8')
        records = []
        for auth in order.authorizations:
            if auth.body.status == messages.STATUS_VALID:
                continue
            challenge = next(ch for ch in auth.body.challenges
                             if isinstance(ch.chall, challenges.DNS01))
            records.append({'name': challenge.chall.validation_domain_name(auth.body.identifier.value),
                            'type': 'TXT', 'value': challenge.chall.validation(key)})
        print(json.dumps({'dns_records': records, 'expires': str(order.body.expires)}, indent=2))
    else:
        order = messages.OrderResource.json_loads(order_path.read_text())
        for auth in order.authorizations:
            current, _ = acme.poll(auth)
            if current.body.status == messages.STATUS_VALID:
                continue
            challenge = next(ch for ch in current.body.challenges
                             if isinstance(ch.chall, challenges.DNS01))
            acme.answer_challenge(challenge, challenge.chall.response(key))
        order = acme.poll_and_finalize(order, deadline=datetime.datetime.now() + datetime.timedelta(seconds=50))
        order_path.write_text(order.json_dumps(), encoding='utf-8')
        certificate_path = args.state / f'{args.name}-fullchain.pem'
        certificate_path.write_text(order.fullchain_pem, encoding='ascii')
        print(f'Certificate saved: {certificate_path}')


if __name__ == '__main__':
    main()
