import importlib.util
import pathlib
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('collector', pathlib.Path(__file__).with_name('collect.py'))
collector = importlib.util.module_from_spec(spec)
spec.loader.exec_module(collector)


class CollectorTests(unittest.TestCase):
    def test_metrics_keep_only_public_fields_and_window(self):
        raw = '\n'.join([
            'monitor_status{monitor_id="1",monitor_name="Moodle",monitor_url="private",monitor_type="http"} 1',
            'monitor_uptime_ratio{monitor_id="1",monitor_name="Moodle",window="1d"} 0.99',
            'monitor_uptime_ratio{monitor_id="1",window="30d"} 0.50',
            'monitor_response_time{monitor_id="1"} NaN',
            'process_cpu_seconds_total 30'])
        result = collector.kuma_metrics(raw)
        self.assertEqual(result[0]['uptime24h'], 99)
        self.assertIsNone(result[0]['responseMs'])
        self.assertNotIn('private', str(result))

    def test_glances_omits_commands_and_deduplicates_host_disk(self):
        raw = {'cpu': {'total': 5}, 'mem': {'percent': 10}, 'processlist': [{'cmdline': 'PASSWORD'}],
               'containers': [{'name': 'moodle', 'command': 'SECRET', 'cpu_percent': 1}],
               'fs': [{'device_name': 'disk', 'mnt_point': '/etc/hosts'},
                      {'device_name': 'disk', 'mnt_point': '/host/datos', 'percent': 40},
                      {'device_name': 'disk', 'mnt_point': '/host/datos/subdir', 'percent': 40}],
               'network': [{'interface_name': 'lo'}, {'interface_name': 'ens18', 'bytes_recv_rate_per_sec': 123}]}
        result = collector.glances_metrics(raw)
        self.assertEqual(len(result['filesystems']), 1)
        self.assertEqual(result['network'][0]['receiveBytesSec'], 123)
        self.assertNotIn('SECRET', str(result))
        self.assertNotIn('PASSWORD', str(result))

    def test_failed_sources_preserve_old_timestamp_and_flag_unavailable(self):
        previous = {'sources': {'kuma': {'updatedAt': '2026-01-01T00:00:00Z', 'data': [{'status': 1}]}}}
        with patch.object(collector, 'request', side_effect=OSError('secret URL')):
            result = collector.collect({'kuma': {'username': 'u', 'password': 'secret', 'url': 'private'}, 'glancesUrl': 'private'}, previous)
        self.assertFalse(result['sources']['kuma']['available'])
        self.assertEqual(result['sources']['kuma']['updatedAt'], '2026-01-01T00:00:00Z')
        self.assertNotIn('secret', str(result))
        self.assertIsNone(result['sources']['glances']['data'])

    def test_empty_metrics_are_failure_not_green(self):
        with self.assertRaises(ValueError):
            collector.kuma_metrics('# no metrics')

    def test_failed_probe_has_no_negative_latency(self):
        monitor = collector.kuma_metrics('monitor_response_time{monitor_id="1"} -1')[0]
        self.assertIsNone(monitor['responseMs'])


if __name__ == '__main__':
    unittest.main()
