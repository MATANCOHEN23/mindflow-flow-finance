-- הוספת שדות חדשים לטבלת payments
ALTER TABLE public.payments 
  ADD COLUMN IF NOT EXISTS due_date DATE,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue'));