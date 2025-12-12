-- Fix RLS policies for deals table
DROP POLICY IF EXISTS "Enable all operations for deals" ON deals;

CREATE POLICY "Authenticated users can view deals"
  ON deals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert deals"
  ON deals FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update deals"
  ON deals FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete deals"
  ON deals FOR DELETE
  TO authenticated
  USING (true);

-- Fix RLS policies for payments table
DROP POLICY IF EXISTS "Enable all operations for payments" ON payments;

CREATE POLICY "Authenticated users can view payments"
  ON payments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete payments"
  ON payments FOR DELETE
  TO authenticated
  USING (true);

-- Fix RLS policies for events table
DROP POLICY IF EXISTS "Enable all operations for events" ON events;

CREATE POLICY "Authenticated users can view events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update events"
  ON events FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete events"
  ON events FOR DELETE
  TO authenticated
  USING (true);

-- Fix RLS policies for tasks table
DROP POLICY IF EXISTS "Enable all operations for tasks" ON tasks;

CREATE POLICY "Authenticated users can view tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (true);

-- Fix RLS policies for contact_domains table
DROP POLICY IF EXISTS "Allow all for contact_domains" ON contact_domains;

CREATE POLICY "Authenticated users can view contact_domains"
  ON contact_domains FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert contact_domains"
  ON contact_domains FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update contact_domains"
  ON contact_domains FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete contact_domains"
  ON contact_domains FOR DELETE
  TO authenticated
  USING (true);