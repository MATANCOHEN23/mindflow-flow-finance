
-- Enable RLS on all tables
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for demo/development access (allows all operations)
-- Note: In production, these should be more restrictive

-- Contacts policies
CREATE POLICY "Enable read access for all users" ON contacts
  FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON contacts
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON contacts
  FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON contacts
  FOR DELETE USING (true);

-- Deals policies
CREATE POLICY "Enable all operations for deals" ON deals
  FOR ALL USING (true);

-- Payments policies
CREATE POLICY "Enable all operations for payments" ON payments
  FOR ALL USING (true);

-- Events policies
CREATE POLICY "Enable all operations for events" ON events
  FOR ALL USING (true);

-- Tasks policies
CREATE POLICY "Enable all operations for tasks" ON tasks
  FOR ALL USING (true);

-- Add missing indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deals_contact_id ON deals(contact_id);
CREATE INDEX IF NOT EXISTS idx_payments_deal_id ON payments(deal_id);
CREATE INDEX IF NOT EXISTS idx_events_deal_id ON events(deal_id);
CREATE INDEX IF NOT EXISTS idx_tasks_related_id ON tasks(related_id);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON deals(created_at);
