"""Mây: xử lý CSV giả lập, Python 3.10+, không cần pip hoặc mạng."""
import csv
import re
from datetime import date
from pathlib import Path

FIELDS = ('lead_id', 'source', 'date', 'status')
SOURCES = {'ads', 'email', 'organic'}
STATUSES = {'new', 'qualified', 'lost'}


def normalize(row):
    """Trả về (bản ghi chuẩn hóa, lý do lỗi hoặc None)."""
    if not isinstance(row, dict) or set(row) != set(FIELDS):
        return None, 'schema'
    if any(not isinstance(row[k], str) for k in FIELDS):
        return None, 'type'
    clean = {k: row[k].strip() for k in FIELDS}
    clean['lead_id'] = clean['lead_id'].upper()
    for k in ('source', 'status'):
        clean[k] = clean[k].lower()
    if not re.fullmatch(r'L[0-9]{2,6}', clean['lead_id']):
        return None, 'lead_id'
    if clean['source'] not in SOURCES:
        return None, 'source'
    if clean['status'] not in STATUSES:
        return None, 'status'
    try:
        if date.fromisoformat(clean['date']).isoformat() != clean['date']:
            return None, 'date'
    except ValueError:
        return None, 'date'
    return clean, None


def clean_rows(rows):
    """Giữ bản hợp lệ đầu tiên; đưa xung đột vào hàng đợi duyệt, không ghi đè."""
    accepted, report = {}, []
    for line, row in enumerate(rows, start=2):
        record, error = normalize(row)
        if error:
            report.append({'line': line, 'result': 'invalid', 'reason': error})
            continue
        key = record['lead_id']
        if key in accepted:
            same = accepted[key] == record
            report.append({'line': line, 'result': 'duplicate' if same else 'review',
                           'reason': 'same_record' if same else 'conflict'})
            continue
        accepted[key] = record
        report.append({'line': line, 'result': 'accepted', 'reason': ''})
    return list(accepted.values()), report


def main():
    root = Path(__file__).resolve().parent
    with (root / 'leads-raw.csv').open(encoding='utf-8-sig', newline='') as f:
        reader = csv.DictReader(f)
        if tuple(reader.fieldnames or ()) != FIELDS:
            raise ValueError('Sai tiêu đề CSV')
        records, report = clean_rows(reader)
    # Ghi kết quả mới, không ghi đè file nguồn hoặc file đáp án.
    for name, fields, rows in [('my-leads-clean.csv', FIELDS, records),
                               ('my-clean-report.csv', ('line', 'result', 'reason'), report)]:
        with (root / name).open('w', encoding='utf-8-sig', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fields)
            writer.writeheader()
            writer.writerows(rows)
    print(f'Input: {len(report)} | accepted: {len(records)} | excluded: {len(report)-len(records)}')
    print('Đã tạo my-leads-clean.csv và my-clean-report.csv; chỉ dùng dữ liệu giả lập.')


if __name__ == '__main__':
    main()
