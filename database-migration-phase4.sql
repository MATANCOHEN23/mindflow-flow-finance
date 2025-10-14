-- Phase 4: Events System Migration
-- הוספת מערכת אירועים למערכת MindFlow CRM

-- יצירת טבלת events
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME,
  location TEXT,
  participants_count INT DEFAULT 0,
  staff_assigned TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  extras JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- יצירת אינדקסים לביצועים
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_deal_id ON events(deal_id);
CREATE INDEX IF NOT EXISTS idx_events_contact_id ON events(contact_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

-- כיבוי RLS לפיתוח
ALTER TABLE events DISABLE ROW LEVEL SECURITY;

-- מתן הרשאות ל-anon
GRANT ALL ON events TO anon;

-- הערה: רוץ קובץ זה ב-Supabase SQL Editor