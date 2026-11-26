import csv
import unittest
from pathlib import Path
from clean_leads import normalize, clean_rows

BASE = dict(lead_id='L01', source='ads', date='2026-11-01', status='qualified')


class CleanTests(unittest.TestCase):
    def test_valid(self):
        self.assertEqual(normalize(BASE), (BASE, None))

    def test_normalized(self):
        self.assertEqual(normalize(dict(BASE, lead_id=' l01 ', source=' ADS ')), (BASE, None))

    def test_missing_field(self):
        self.assertEqual(normalize({'lead_id': 'L01'})[1], 'schema')

    def test_null(self):
        self.assertEqual(normalize(dict(BASE, source=None))[1], 'type')

    def test_empty_source(self):
        self.assertEqual(normalize(dict(BASE, source=''))[1], 'source')

    def test_bad_status(self):
        self.assertEqual(normalize(dict(BASE, status='unknown'))[1], 'status')

    def test_bad_id(self):
        self.assertEqual(normalize(dict(BASE, lead_id='bad'))[1], 'lead_id')

    def test_bad_date(self):
        for value in ('2026-02-30', '20261101', '2026-11-1'):
            with self.subTest(value=value):
                self.assertEqual(normalize(dict(BASE, date=value))[1], 'date')

    def test_duplicate(self):
        records, report = clean_rows([BASE, BASE])
        self.assertEqual(records, [BASE])
        self.assertEqual(report[1]['result'], 'duplicate')

    def test_conflict(self):
        records, report = clean_rows([BASE, dict(BASE, source='email')])
        self.assertEqual(records, [BASE])
        self.assertEqual(report[1]['result'], 'review')

    def test_fixture(self):
        root = Path(__file__).resolve().parent
        with (root / 'leads-raw.csv').open(encoding='utf-8-sig', newline='') as f:
            records, report = clean_rows(csv.DictReader(f))
        with (root / 'leads-clean.csv').open(encoding='utf-8-sig', newline='') as f:
            self.assertEqual(records, list(csv.DictReader(f)))
        self.assertEqual(len(report), 11)
        self.assertEqual([r['result'] for r in report[-3:]], ['duplicate', 'invalid', 'invalid'])


if __name__ == '__main__':
    unittest.main()
