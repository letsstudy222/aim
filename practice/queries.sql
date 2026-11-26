-- Chạy từng câu sau setup.sql.
-- Q1
SELECT lead_id, source FROM leads WHERE status = 'qualified' ORDER BY lead_id;

-- Q2
SELECT source, COUNT(*) AS leads FROM leads GROUP BY source ORDER BY source;

-- Q3
SELECT l.source, COUNT(DISTINCT l.lead_id) AS leads, COUNT(DISTINCT o.lead_id) AS buyers, COALESCE(SUM(o.revenue_vnd),0) AS revenue_vnd FROM leads l LEFT JOIN orders o ON o.lead_id=l.lead_id GROUP BY l.source ORDER BY l.source;

-- Q4
SELECT COUNT(*) AS joined_rows, COUNT(DISTINCT l.lead_id) AS distinct_leads FROM leads l LEFT JOIN orders o ON o.lead_id=l.lead_id;
