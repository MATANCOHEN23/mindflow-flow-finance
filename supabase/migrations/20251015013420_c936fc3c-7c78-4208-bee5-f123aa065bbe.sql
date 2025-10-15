-- Phase: הוספת domains ותיקון workflow_stage

-- ============================================
-- שלב 1: הוספת domains ברירת מחדל עם היררכיה
-- ============================================

-- רמה 1: תחומים ראשיים
INSERT INTO domains (name, icon, level, parent_id, is_active, order_index, pricing_type, pricing_value) 
VALUES
  ('פסיכולוג', '🧠', 1, NULL, true, 1, 'fixed', 300),
  ('מאמן כדורסל', '🏀', 1, NULL, true, 2, 'fixed', 250),
  ('יזם', '💼', 1, NULL, true, 3, 'fixed', 500)
ON CONFLICT DO NOTHING;

-- רמה 2: תת-תחומים לפסיכולוג
WITH psych AS (SELECT id FROM domains WHERE name = 'פסיכולוג' AND level = 1 LIMIT 1)
INSERT INTO domains (name, icon, level, parent_id, is_active, order_index, pricing_type, pricing_value)
SELECT 'מטופל פרטי', '👤', 2, psych.id, true, 1, 'percentage', 100 FROM psych
UNION ALL
SELECT 'מטופל קבוצתי', '👥', 2, psych.id, true, 2, 'percentage', 80 FROM psych
UNION ALL
SELECT 'מטופל ילדים', '👶', 2, psych.id, true, 3, 'fixed', 250 FROM psych
ON CONFLICT DO NOTHING;

-- רמה 2: תת-תחומים לכדורסל
WITH basketball AS (SELECT id FROM domains WHERE name = 'מאמן כדורסל' AND level = 1 LIMIT 1)
INSERT INTO domains (name, icon, level, parent_id, is_active, order_index, pricing_type, pricing_value)
SELECT 'שחקן מועדון', '⚽', 2, basketball.id, true, 1, 'fixed', 200 FROM basketball
UNION ALL
SELECT 'שחקן נבחרת', '🏆', 2, basketball.id, true, 2, 'fixed', 350 FROM basketball
UNION ALL
SELECT 'כושר פיזי', '💪', 2, basketball.id, true, 3, 'fixed', 150 FROM basketball
ON CONFLICT DO NOTHING;

-- רמה 2: תת-תחומים ליזם
WITH entrepreneur AS (SELECT id FROM domains WHERE name = 'יזם' AND level = 1 LIMIT 1)
INSERT INTO domains (name, icon, level, parent_id, is_active, order_index, pricing_type, pricing_value)
SELECT 'אירועי יום הולדת', '🎂', 2, entrepreneur.id, true, 1, 'fixed', 2000 FROM entrepreneur
UNION ALL
SELECT 'סדנאות בית ספר', '🎓', 2, entrepreneur.id, true, 2, 'fixed', 3500 FROM entrepreneur
ON CONFLICT DO NOTHING;

-- רמה 3: תת-תת-תחומים (דוגמא ליום הולדת)
WITH birthday AS (SELECT id FROM domains WHERE name = 'אירועי יום הולדת' AND level = 2 LIMIT 1)
INSERT INTO domains (name, icon, level, parent_id, is_active, order_index, pricing_type, pricing_value)
SELECT 'חבילה בסיסית', '📦', 3, birthday.id, true, 1, 'fixed', 1500 FROM birthday
WHERE EXISTS (SELECT 1 FROM birthday)
UNION ALL
SELECT 'חבילה פרימיום', '⭐', 3, birthday.id, true, 2, 'fixed', 2500 FROM birthday
WHERE EXISTS (SELECT 1 FROM birthday)
UNION ALL
SELECT 'חבילת VIP', '👑', 3, birthday.id, true, 3, 'fixed', 4000 FROM birthday
WHERE EXISTS (SELECT 1 FROM birthday)
ON CONFLICT DO NOTHING;

-- ============================================
-- שלב 2: תיקון workflow_stage_check constraint
-- ============================================

-- הסרת constraint ישן
ALTER TABLE deals DROP CONSTRAINT IF EXISTS deals_workflow_stage_check;

-- הוספת constraint חדש עם כל הערכים הרלוונטיים
ALTER TABLE deals ADD CONSTRAINT deals_workflow_stage_check 
CHECK (workflow_stage IN (
  'lead', 'contacted', 'qualified', 'proposal', 
  'negotiation', 'won', 'lost', 'active', 'completed',
  'booked', 'in_progress', 'pending'
));

-- הערה: בוצעו שני שדרוגים במיגרציה זו
COMMENT ON TABLE domains IS 'Updated with hierarchical domain structure (3 levels)';
COMMENT ON TABLE deals IS 'Updated workflow_stage constraint to include all valid stages';