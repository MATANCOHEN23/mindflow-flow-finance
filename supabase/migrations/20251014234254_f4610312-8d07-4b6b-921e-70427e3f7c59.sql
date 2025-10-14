-- שלב 1: הפעלת RLS על כל הטבלאות הראשיות
-- זה קריטי לאבטחה - ללא RLS כל המידע חשוף לכולם!

-- הפעלת RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- יצירת policies בסיסיות - גישה לכולם (בהמשך ניתן להגביל לפי משתמש)
-- contacts policies
CREATE POLICY "Enable all operations for contacts" 
ON contacts FOR ALL 
USING (true)
WITH CHECK (true);

-- deals policies
CREATE POLICY "Enable all operations for deals" 
ON deals FOR ALL 
USING (true)
WITH CHECK (true);

-- payments policies
CREATE POLICY "Enable all operations for payments" 
ON payments FOR ALL 
USING (true)
WITH CHECK (true);

-- events policies
CREATE POLICY "Enable all operations for events" 
ON events FOR ALL 
USING (true)
WITH CHECK (true);

-- tasks policies
CREATE POLICY "Enable all operations for tasks" 
ON tasks FOR ALL 
USING (true)
WITH CHECK (true);