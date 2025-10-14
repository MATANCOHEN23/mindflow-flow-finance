-- Phase 6: Reports & Insights Migration
-- הוספת Views לדוחות ותובנות עסקיות

-- View: הכנסות לפי תחום
CREATE OR REPLACE VIEW revenue_by_domain AS
SELECT 
  d.id as domain_id,
  d.name as domain_name,
  d.icon as domain_icon,
  COALESCE(SUM(p.amount), 0) as total_revenue,
  COUNT(DISTINCT cd.contact_id) as client_count,
  COUNT(DISTINCT de.id) as deal_count
FROM domains d
LEFT JOIN contact_domains cd ON d.id = cd.domain_id
LEFT JOIN deals de ON cd.contact_id = de.contact_id AND de.domain_id = d.id
LEFT JOIN payments p ON de.id = p.deal_id
WHERE d.is_active = TRUE
GROUP BY d.id, d.name, d.icon
ORDER BY total_revenue DESC;

-- View: צמיחת לקוחות לאורך זמן
CREATE OR REPLACE VIEW client_growth AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as new_clients,
  SUM(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', created_at)) as cumulative_clients
FROM contacts
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month;

-- View: עסקאות לפי שלב
CREATE OR REPLACE VIEW deals_by_stage AS
SELECT 
  workflow_stage,
  COUNT(*) as deal_count,
  SUM(amount_total) as total_value,
  AVG(amount_total) as avg_value
FROM deals
GROUP BY workflow_stage
ORDER BY deal_count DESC;

-- View: ביצועים חודשיים
CREATE OR REPLACE VIEW monthly_performance AS
SELECT 
  DATE_TRUNC('month', p.payment_date) as month,
  COUNT(DISTINCT p.contact_id) as active_clients,
  COUNT(DISTINCT p.deal_id) as deals_paid,
  SUM(p.amount) as total_revenue,
  COUNT(p.id) as payment_count
FROM payments p
GROUP BY DATE_TRUNC('month', p.payment_date)
ORDER BY month DESC;

-- הערה: רוץ קובץ זה ב-Supabase SQL Editor