-- Dữ liệu giả lập, chỉ chạy trên cơ sở dữ liệu luyện tập mới.
PRAGMA foreign_keys=ON;
CREATE TABLE leads (lead_id TEXT PRIMARY KEY, source TEXT NOT NULL, date TEXT NOT NULL, status TEXT NOT NULL);
CREATE TABLE orders (order_id TEXT PRIMARY KEY, lead_id TEXT NOT NULL REFERENCES leads(lead_id), revenue_vnd INTEGER NOT NULL CHECK(revenue_vnd>=0));
INSERT INTO leads VALUES ('L01', 'ads', '2026-11-01', 'qualified');
INSERT INTO leads VALUES ('L02', 'email', '2026-11-01', 'new');
INSERT INTO leads VALUES ('L03', 'ads', '2026-11-02', 'qualified');
INSERT INTO leads VALUES ('L04', 'organic', '2026-11-02', 'lost');
INSERT INTO leads VALUES ('L05', 'email', '2026-11-03', 'qualified');
INSERT INTO leads VALUES ('L06', 'ads', '2026-11-03', 'new');
INSERT INTO leads VALUES ('L07', 'organic', '2026-11-04', 'qualified');
INSERT INTO leads VALUES ('L08', 'email', '2026-11-04', 'lost');
INSERT INTO orders VALUES ('O01', 'L01', 300000);
INSERT INTO orders VALUES ('O02', 'L01', 200000);
INSERT INTO orders VALUES ('O03', 'L05', 400000);
INSERT INTO orders VALUES ('O04', 'L07', 250000);
