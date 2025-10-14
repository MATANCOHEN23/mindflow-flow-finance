-- ================================================================
-- Phase 1: תיקון דף התשלומים והוספת תמיכה בתשלום ישיר מלקוח
-- ================================================================

-- 1. הוסף שדה contact_id לטבלת payments
-- זה מאפשר לקשר תשלום ישירות ללקוח (בלי עסקה)
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL;

-- 2. צור אינדקס לחיפוש מהיר של תשלומים לפי לקוח
CREATE INDEX IF NOT EXISTS idx_payments_contact_id ON payments(contact_id);

-- 3. הוסף הערה לטבלה (לתיעוד)
COMMENT ON COLUMN payments.contact_id IS 'קישור ישיר ללקוח - משמש כאשר התשלום לא קשור לעסקה ספציפית';

-- 4. וודא שלפחות אחד מהשדות (deal_id או contact_id) מלא
-- (אופציונלי - אם אתה רוצה אכיפה ברמת מסד הנתונים)
-- ALTER TABLE payments 
-- ADD CONSTRAINT check_payment_has_relation 
-- CHECK (deal_id IS NOT NULL OR contact_id IS NOT NULL);

-- ================================================================
-- בדיקות
-- ================================================================

-- בדוק שהשדה נוסף בהצלחה
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'payments' AND column_name = 'contact_id';

-- הצג דוגמת תשלומים (לבדוק שהטבלה עובדת)
SELECT id, deal_id, contact_id, amount, payment_date
FROM payments
LIMIT 5;
