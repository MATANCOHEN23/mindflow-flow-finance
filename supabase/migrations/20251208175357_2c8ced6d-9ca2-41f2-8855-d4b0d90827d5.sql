-- מחיקת דומיינים שלא באפיון
DELETE FROM domains WHERE name IN ('שחקן מועדון', 'מטופל ילדים');

-- עדכון חוסן בתנועה ל-65%
UPDATE domains SET pricing_type = 'percentage', pricing_value = 65, pricing_notes = '65% מ-285₪ = 185₪' WHERE name = 'חוסן בתנועה' AND parent_id IS NULL;

-- הוספת תת-דומיינים לכדורסל
INSERT INTO domains (name, parent_id, level, pricing_type, pricing_value, pricing_notes, order_index, is_active)
SELECT 'נווה עוז גנים', id, 2, 'percentage', 45, '45% מההכנסות', 1, true FROM domains WHERE name = 'מאמן כדורסל' AND parent_id IS NULL
ON CONFLICT DO NOTHING;

INSERT INTO domains (name, parent_id, level, pricing_type, pricing_value, pricing_notes, order_index, is_active)
SELECT 'נווה עוז מרכז (<140K)', id, 2, 'percentage', 34, '34% עד 140,000₪ גביה', 2, true FROM domains WHERE name = 'מאמן כדורסל' AND parent_id IS NULL
ON CONFLICT DO NOTHING;

INSERT INTO domains (name, parent_id, level, pricing_type, pricing_value, pricing_notes, order_index, is_active)
SELECT 'נווה עוז מרכז (>140K)', id, 2, 'percentage', 37, '37% מעל 140,000₪ גביה', 3, true FROM domains WHERE name = 'מאמן כדורסל' AND parent_id IS NULL
ON CONFLICT DO NOTHING;

INSERT INTO domains (name, parent_id, level, pricing_type, pricing_value, pricing_notes, order_index, is_active)
SELECT 'אמיר', id, 2, 'percentage', 38, '38% מההכנסות (בניכוי מאמנים)', 4, true FROM domains WHERE name = 'מאמן כדורסל' AND parent_id IS NULL
ON CONFLICT DO NOTHING;

INSERT INTO domains (name, parent_id, level, pricing_type, pricing_value, pricing_notes, order_index, is_active)
SELECT 'בנות', id, 2, 'percentage', 50, '50% מההכנסות', 5, true FROM domains WHERE name = 'מאמן כדורסל' AND parent_id IS NULL
ON CONFLICT DO NOTHING;

INSERT INTO domains (name, parent_id, level, pricing_type, pricing_value, pricing_notes, order_index, is_active)
SELECT 'מחלקת נוער (פסיכולוג)', id, 2, 'fixed', 2500, '2,500₪ קבוע', 6, true FROM domains WHERE name = 'מאמן כדורסל' AND parent_id IS NULL
ON CONFLICT DO NOTHING;