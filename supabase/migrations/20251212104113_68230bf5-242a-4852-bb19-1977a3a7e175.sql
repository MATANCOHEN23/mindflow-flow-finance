-- Fix 1: Recreate views with SECURITY INVOKER (not SECURITY DEFINER)
-- Drop and recreate views to remove SECURITY DEFINER property

DROP VIEW IF EXISTS public.deals_by_stage;
CREATE VIEW public.deals_by_stage WITH (security_invoker = true) AS
SELECT workflow_stage,
    count(*) AS deal_count,
    sum(amount_total) AS total_value,
    avg(amount_total) AS avg_value
FROM deals
GROUP BY workflow_stage
ORDER BY count(*) DESC;

DROP VIEW IF EXISTS public.monthly_performance;
CREATE VIEW public.monthly_performance WITH (security_invoker = true) AS
SELECT date_trunc('month'::text, (p.payment_date)::timestamp with time zone) AS month,
    count(DISTINCT de.contact_id) AS active_clients,
    count(DISTINCT p.deal_id) AS deals_paid,
    sum(p.amount) AS total_revenue,
    count(p.id) AS payment_count
FROM payments p
JOIN deals de ON p.deal_id = de.id
GROUP BY date_trunc('month'::text, (p.payment_date)::timestamp with time zone)
ORDER BY date_trunc('month'::text, (p.payment_date)::timestamp with time zone) DESC;

DROP VIEW IF EXISTS public.revenue_by_domain;
CREATE VIEW public.revenue_by_domain WITH (security_invoker = true) AS
SELECT d.id AS domain_id,
    d.name AS domain_name,
    d.icon AS domain_icon,
    COALESCE(sum(p.amount), 0::numeric) AS total_revenue,
    count(DISTINCT cd.contact_id) AS client_count,
    count(DISTINCT de.id) AS deal_count
FROM domains d
LEFT JOIN contact_domains cd ON d.id = cd.domain_id
LEFT JOIN deals de ON cd.contact_id = de.contact_id AND de.domain_id = d.id
LEFT JOIN payments p ON de.id = p.deal_id
WHERE d.is_active = true
GROUP BY d.id, d.name, d.icon
ORDER BY COALESCE(sum(p.amount), 0::numeric) DESC;

DROP VIEW IF EXISTS public.client_growth;
CREATE VIEW public.client_growth WITH (security_invoker = true) AS
SELECT date_trunc('month'::text, created_at) AS month,
    count(*) AS new_clients,
    sum(count(*)) OVER (ORDER BY date_trunc('month'::text, created_at)) AS cumulative_clients
FROM contacts
GROUP BY date_trunc('month'::text, created_at)
ORDER BY date_trunc('month'::text, created_at);

-- Fix 2: Update RLS policy on contacts to require authentication
DROP POLICY IF EXISTS "Enable all operations for contacts" ON public.contacts;

CREATE POLICY "Authenticated users can read contacts"
ON public.contacts FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert contacts"
ON public.contacts FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update contacts"
ON public.contacts FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete contacts"
ON public.contacts FOR DELETE
TO authenticated
USING (true);