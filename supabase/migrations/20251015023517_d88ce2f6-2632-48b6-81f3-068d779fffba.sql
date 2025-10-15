-- 1) ניקוי כפילויות תחומים
WITH duplicates AS (
  SELECT id, name, parent_id, level,
         ROW_NUMBER() OVER (
           PARTITION BY lower(trim(name)), coalesce(parent_id::text, ''), level 
           ORDER BY created_at ASC
         ) AS rn
  FROM public.domains
)
DELETE FROM public.domains 
WHERE id IN (SELECT id FROM duplicates WHERE rn > 1);

-- 2) יצירת אינדקס ייחודי למניעת כפילויות עתידיות
CREATE UNIQUE INDEX IF NOT EXISTS domains_unique_name_parent_level
ON public.domains (lower(trim(name)), coalesce(parent_id::text, ''), level);

-- 3) תיקון constraint של workflow_stage לערכים בפועל
ALTER TABLE public.deals DROP CONSTRAINT IF EXISTS deals_workflow_stage_check;
ALTER TABLE public.deals
  ADD CONSTRAINT deals_workflow_stage_check
  CHECK (workflow_stage IN ('lead', 'booked', 'done'));