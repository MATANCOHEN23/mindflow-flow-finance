-- ================================================================
-- Phase 2: מבנה תחומים היררכי - Domains Structure
-- ================================================================

-- 1. צור טבלת domains (תחומים/כובעים)
CREATE TABLE IF NOT EXISTS domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES domains(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  level INT NOT NULL CHECK (level >= 1 AND level <= 5),
  pricing_type TEXT CHECK (pricing_type IN ('percentage', 'fixed', 'full')),
  pricing_value DECIMAL(10,2),
  pricing_notes TEXT,
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. צור טבלת contact_domains (קישור לקוח-תחום)
CREATE TABLE IF NOT EXISTS contact_domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  domain_id UUID REFERENCES domains(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  joined_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  custom_pricing JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(contact_id, domain_id)
);

-- 3. הוסף domain_id לטבלת deals
ALTER TABLE deals 
ADD COLUMN IF NOT EXISTS domain_id UUID REFERENCES domains(id) ON DELETE SET NULL;

-- 4. צור אינדקסים לביצועים
CREATE INDEX IF NOT EXISTS idx_domains_parent_id ON domains(parent_id);
CREATE INDEX IF NOT EXISTS idx_domains_level ON domains(level);
CREATE INDEX IF NOT EXISTS idx_contact_domains_contact_id ON contact_domains(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_domains_domain_id ON contact_domains(domain_id);
CREATE INDEX IF NOT EXISTS idx_deals_domain_id ON deals(domain_id);

-- 5. כבה RLS (לפיתוח)
ALTER TABLE domains DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_domains DISABLE ROW LEVEL SECURITY;

-- 6. תן הרשאות
GRANT ALL ON domains TO anon;
GRANT ALL ON contact_domains TO anon;

-- ================================================================
-- הכנס תחומים בסיסיים של וסיפי נתן
-- ================================================================

-- רמה 1: כובעים ראשיים
INSERT INTO domains (name, icon, level, order_index) VALUES
('פסיכולוג', '🧠', 1, 1),
('מאמן כדורסל', '🏀', 1, 2),
('יזם', '💼', 1, 3)
ON CONFLICT DO NOTHING;

-- רמה 2: תתי תחומים - פסיכולוג
WITH psychologist AS (SELECT id FROM domains WHERE name = 'פסיכולוג' AND level = 1)
INSERT INTO domains (parent_id, name, level, pricing_type, order_index) 
SELECT 
  psychologist.id,
  t.name,
  2,
  'full',
  t.order_index
FROM psychologist, (VALUES
  ('טיפולים פרטיים', 1),
  ('ליווי קבוצות', 2),
  ('הרצאות', 3),
  ('סדנאות', 4)
) AS t(name, order_index)
ON CONFLICT DO NOTHING;

-- רמה 2: תתי תחומים - מאמן כדורסל
WITH basketball AS (SELECT id FROM domains WHERE name = 'מאמן כדורסל' AND level = 1)
INSERT INTO domains (parent_id, name, level, order_index) 
SELECT 
  basketball.id,
  t.name,
  2,
  t.order_index
FROM basketball, (VALUES
  ('שגרה', 1),
  ('קייטנות', 2),
  ('פרויקט מצוינות', 3)
) AS t(name, order_index)
ON CONFLICT DO NOTHING;

-- רמה 3: פירוט שגרה - מיקומים
WITH routine AS (
  SELECT d.id FROM domains d
  JOIN domains p ON d.parent_id = p.id
  WHERE p.name = 'מאמן כדורסל' AND d.name = 'שגרה'
)
INSERT INTO domains (parent_id, name, level, order_index) 
SELECT 
  routine.id,
  t.name,
  3,
  t.order_index
FROM routine, (VALUES
  ('נווה עוז', 1),
  ('אמיר', 2),
  ('בנות', 3)
) AS t(name, order_index)
ON CONFLICT DO NOTHING;

-- רמה 4: קבוצות נווה עוז
WITH neve_oz AS (
  SELECT d.id FROM domains d
  JOIN domains p ON d.parent_id = p.id
  JOIN domains pp ON p.parent_id = pp.id
  WHERE pp.name = 'מאמן כדורסל' AND p.name = 'שגרה' AND d.name = 'נווה עוז'
)
INSERT INTO domains (parent_id, name, level, pricing_type, pricing_value, order_index) 
SELECT 
  neve_oz.id,
  t.name,
  4,
  'percentage',
  t.percentage,
  t.order_index
FROM neve_oz, (VALUES
  ('צהרון', 30, 1),
  ('א׳-ב׳', 30, 2),
  ('ג׳-ד׳', 30, 3),
  ('ה׳-ו׳', 30, 4),
  ('גן', 30, 5),
  ('פעם בשבוע', 30, 6)
) AS t(name, percentage, order_index)
ON CONFLICT DO NOTHING;

-- רמה 4: קבוצות אמיר
WITH amir AS (
  SELECT d.id FROM domains d
  JOIN domains p ON d.parent_id = p.id
  JOIN domains pp ON p.parent_id = pp.id
  WHERE pp.name = 'מאמן כדורסל' AND p.name = 'שגרה' AND d.name = 'אמיר'
)
INSERT INTO domains (parent_id, name, level, pricing_type, pricing_value, order_index) 
SELECT 
  amir.id,
  t.name,
  4,
  'percentage',
  30,
  t.order_index
FROM amir, (VALUES
  ('א׳-ב׳', 1),
  ('ג׳-ו׳', 2),
  ('פעם בשבוע', 3)
) AS t(name, order_index)
ON CONFLICT DO NOTHING;

-- רמה 4: קבוצות בנות
WITH girls AS (
  SELECT d.id FROM domains d
  JOIN domains p ON d.parent_id = p.id
  JOIN domains pp ON p.parent_id = pp.id
  WHERE pp.name = 'מאמן כדורסל' AND p.name = 'שגרה' AND d.name = 'בנות'
)
INSERT INTO domains (parent_id, name, level, pricing_type, pricing_value, order_index) 
SELECT 
  girls.id,
  t.name,
  4,
  'percentage',
  30,
  t.order_index
FROM girls, (VALUES
  ('א׳-ב׳', 1),
  ('ג׳-ו׳', 2),
  ('פעם בשבוע', 3)
) AS t(name, order_index)
ON CONFLICT DO NOTHING;

-- רמה 3: סוגי קייטנות
WITH camps AS (
  SELECT d.id FROM domains d
  JOIN domains p ON d.parent_id = p.id
  WHERE p.name = 'מאמן כדורסל' AND d.name = 'קייטנות'
)
INSERT INTO domains (parent_id, name, level, pricing_type, pricing_value, order_index) 
SELECT 
  camps.id,
  t.name,
  3,
  t.pricing_type,
  t.pricing_value,
  t.order_index
FROM camps, (VALUES
  ('שכיר', 'percentage', 25, 1),
  ('פרטיות', 'full', 100, 2)
) AS t(name, pricing_type, pricing_value, order_index)
ON CONFLICT DO NOTHING;

-- ================================================================
-- פונקציות עזר
-- ================================================================

-- פונקציה לקבלת כל ההיררכיה של תחום
CREATE OR REPLACE FUNCTION get_domain_hierarchy(domain_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  level INT,
  full_path TEXT
) AS $$
WITH RECURSIVE domain_tree AS (
  -- רמה ראשונה
  SELECT 
    d.id,
    d.name,
    d.level,
    d.name::TEXT as full_path,
    d.parent_id
  FROM domains d
  WHERE d.id = domain_id
  
  UNION ALL
  
  -- רמות הבאות
  SELECT 
    d.id,
    d.name,
    d.level,
    dt.full_path || ' > ' || d.name,
    d.parent_id
  FROM domains d
  INNER JOIN domain_tree dt ON d.parent_id = dt.id
)
SELECT id, name, level, full_path
FROM domain_tree
ORDER BY level;
$$ LANGUAGE SQL;

-- ================================================================
-- בדיקות
-- ================================================================

-- הצג את כל ההיררכיה
SELECT 
  d1.name as level_1,
  d2.name as level_2,
  d3.name as level_3,
  d4.name as level_4,
  d4.pricing_type,
  d4.pricing_value
FROM domains d1
LEFT JOIN domains d2 ON d2.parent_id = d1.id
LEFT JOIN domains d3 ON d3.parent_id = d2.id
LEFT JOIN domains d4 ON d4.parent_id = d3.id
WHERE d1.level = 1
ORDER BY d1.order_index, d2.order_index, d3.order_index, d4.order_index;

-- ספירת תחומים לפי רמות
SELECT level, COUNT(*) as count
FROM domains
GROUP BY level
ORDER BY level;
