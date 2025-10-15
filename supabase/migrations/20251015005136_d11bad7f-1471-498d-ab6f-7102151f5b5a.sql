-- Phase 8: תיקון workflow_stage constraint
-- הסרת constraint ישן והוספת ערכים נוספים

-- הסרת constraint ישן
ALTER TABLE deals DROP CONSTRAINT IF EXISTS deals_workflow_stage_check;

-- הוספת constraint חדש עם ערכים מורחבים
ALTER TABLE deals ADD CONSTRAINT deals_workflow_stage_check 
CHECK (workflow_stage IN ('lead', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost', 'active', 'completed'));