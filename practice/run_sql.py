# Python 3; thư viện chuẩn, không cần pip. Chạy từ bất kỳ thư mục nào.
from pathlib import Path
import sqlite3
root = Path(__file__).resolve().parent
with sqlite3.connect(":memory:") as db:
    db.executescript((root / "setup.sql").read_text(encoding="utf-8"))
    for query in (root / "queries.sql").read_text(encoding="utf-8").split(";"):
        if "SELECT" not in query: continue
        cur = db.execute(query)
        print([c[0] for c in cur.description])
        for row in cur: print(row)
        print()
