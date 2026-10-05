#!/usr/bin/env python3
"""Read Kuma and Glances, publish only an explicit selection of telemetry."""
import argparse
import base64
import concurrent.futures
import datetime as dt
import json
import math
import os
import pathlib
import re
import tempfile
import urllib.request


def now():
    return dt.datetime.now(dt.timezone.utc).isoformat()


def number(value):
    return value if isinstance(value, (int, float)) and math.isfinite(value) else None


def request(url, headers=None):
    req = urllib.request.Request(url, headers=headers or {})
    with urllib.request.urlopen(req, timeout=12) as response:
        body = response.read(8_000_001)
        if len(body) > 8_000_000:
            raise ValueError('Response exceeds limit')
        return body


def kuma_metrics(raw):
    monitors = {}
    allowed = {'monitor_status', 'monitor_response_time', 'monitor_uptime_ratio',
               'monitor_cert_days_remaining', 'monitor_cert_is_valid'}
    for line in raw.splitlines():
        match = re.fullmatch(r'(\w+)\{(.*)\}\s+([^\s]+)(?:\s+\d+)?', line)
        if not match or match[1] not in allowed:
            continue
        labels = {k: json.loads('"' + v + '"') for k, v in
                  re.findall(r'(\w+)="((?:\\.|[^"\\])*)"', match[2])}
        ident = labels.get('monitor_id')
        if not ident:
            continue
        try:
            value = number(float(match[3]))
        except ValueError:
            continue
        monitor = monitors.setdefault(ident, {'id': ident, 'name': labels.get('monitor_name', 'Servicio'),
                                              'type': labels.get('monitor_type'), 'status': None,
                                              'responseMs': None, 'uptime24h': None,
                                              'certificateDays': None, 'certificateValid': None})
        field = {'monitor_status': 'status', 'monitor_response_time': 'responseMs',
                 'monitor_cert_days_remaining': 'certificateDays',
                 'monitor_cert_is_valid': 'certificateValid'}.get(match[1])
        if field:
            monitor[field] = None if field == 'responseMs' and value is not None and value < 0 else value
        elif labels.get('window') == '1d':
            monitor['uptime24h'] = None if value is None else value * 100
    if not monitors:
        raise ValueError('No monitor metrics received')
    return sorted(monitors.values(), key=lambda item: item['name'])


def glances_metrics(data):
    if not isinstance(data.get('mem'), dict) or not isinstance(data.get('cpu'), dict):
        raise ValueError('Missing essential Glances plugins')
    cpu, mem = data['cpu'], data['mem']
    filesystems, seen = [], set()
    for item in data.get('fs', []):
        mount = item.get('mnt_point', '')
        if not mount.startswith('/host/datos'):
            continue
        device = item.get('device_name')
        if device in seen:
            continue
        seen.add(device)
        filesystems.append({'name': 'Datos de la plataforma', 'type': item.get('fs_type'),
                            **{k: number(item.get(k)) for k in ['size', 'used', 'free', 'percent']}})
    network = [{'name': item.get('interface_name'),
                'receiveBytesSec': number(item.get('bytes_recv_rate_per_sec')),
                'sendBytesSec': number(item.get('bytes_sent_rate_per_sec'))}
               for item in data.get('network', [])
               if not re.match(r'^(lo|veth|br-|docker)', item.get('interface_name', ''))]
    containers = [{'name': item.get('name'), 'status': item.get('status'),
                   'cpuPercent': number(item.get('cpu_percent')),
                   'memoryBytes': number(item.get('memory_usage')),
                   'memoryLimitBytes': number(item.get('memory_limit'))}
                  for item in data.get('containers', [])]
    diskio = [{'name': item.get('disk_name'),
               'readBytesSec': number(item.get('read_bytes_rate_per_sec')),
               'writeBytesSec': number(item.get('write_bytes_rate_per_sec'))}
              for item in data.get('diskio', []) if re.fullmatch(r'(sd[a-z]+|vd[a-z]+|nvme\d+n\d+)', item.get('disk_name', ''))]
    return {'cpu': {k: number(cpu.get(k)) for k in ['total', 'user', 'system', 'iowait', 'cpucore']},
            'memory': {k: number(mem.get(k)) for k in ['total', 'available', 'used', 'percent']},
            'swap': {k: number(data.get('memswap', {}).get(k)) for k in ['total', 'used', 'percent']},
            'load': {k: number(data.get('load', {}).get(k)) for k in ['min1', 'min5', 'min15']},
            'uptime': data.get('uptime'), 'filesystems': filesystems, 'network': network,
            'diskio': diskio, 'containers': containers,
            'processes': {k: number(data.get('processcount', {}).get(k)) for k in ['total', 'running', 'sleeping', 'thread']},
            'sensors': [{k: item.get(k) for k in ['label', 'type', 'value', 'unit']}
                        for item in data.get('sensors', [])],
            'version': data.get('version')}


def atomic_json(path, data, mode):
    path = pathlib.Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, temporary = tempfile.mkstemp(dir=path.parent, prefix='.collect-')
    try:
        with os.fdopen(fd, 'w', encoding='utf-8') as output:
            json.dump(data, output, ensure_ascii=False, allow_nan=False, separators=(',', ':'))
        os.chmod(temporary, mode)
        os.replace(temporary, path)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


def collect(config, previous=None):
    previous = previous or {}
    timestamp = now()
    result = {'schemaVersion': 1, 'generatedAt': timestamp, 'refreshSeconds': 60,
              'staleAfterSeconds': 180, 'host': 'moodlenewen', 'sources': {},
              'history': previous.get('history', [])}
    credentials = config['kuma']
    auth = base64.b64encode((credentials['username'] + ':' + credentials['password']).encode()).decode()

    def kuma():
        return kuma_metrics(request(credentials['url'], {'Authorization': 'Basic ' + auth}).decode())

    def glances():
        return glances_metrics(json.loads(request(config['glancesUrl'])))

    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
        jobs = {name: pool.submit(fn) for name, fn in [('kuma', kuma), ('glances', glances)]}
        for name, job in jobs.items():
            try:
                result['sources'][name] = {'available': True, 'updatedAt': timestamp, 'data': job.result()}
            except Exception as error:
                old = previous.get('sources', {}).get(name, {})
                result['sources'][name] = {'available': False, 'updatedAt': old.get('updatedAt'),
                                          'data': old.get('data'), 'error': 'Fuente no disponible'}
                # No response bodies, URLs, credentials or exception text in public output/logs.
                print(f'{name}: {type(error).__name__}', flush=True)
    resources = result['sources']['glances']
    if resources['available']:
        result['history'].append({'time': timestamp, 'cpu': resources['data']['cpu']['total'],
                                  'memory': resources['data']['memory']['percent']})
    cutoff = (dt.datetime.now(dt.timezone.utc) - dt.timedelta(hours=24)).isoformat()
    result['history'] = [item for item in result['history'] if item['time'] > cutoff][-1440:]
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', required=True)
    parser.add_argument('--output', required=True)
    parser.add_argument('--state', required=True)
    args = parser.parse_args()
    config = json.loads(pathlib.Path(args.config).read_text())
    try:
        previous = json.loads(pathlib.Path(args.state).read_text())
    except (OSError, ValueError):
        previous = {}
    result = collect(config, previous)
    atomic_json(args.state, result, 0o600)
    atomic_json(args.output, result, 0o644)


if __name__ == '__main__':
    main()
