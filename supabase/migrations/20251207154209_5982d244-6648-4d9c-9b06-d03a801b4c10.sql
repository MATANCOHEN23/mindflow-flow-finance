-- ================================================================
-- Phase 1: Create Categories Table for Dynamic Category Management
-- ================================================================

-- 1. Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,           -- System key (birthday, therapy, etc.)
  name_he TEXT NOT NULL,               -- Hebrew display name
  icon TEXT,                           -- Emoji icon
  color TEXT DEFAULT '#6B7280',        -- HEX color for UI
  is_active BOOLEAN DEFAULT true,      -- Soft delete flag
  order_index INTEGER DEFAULT 0,       -- Display order
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS with public access policy
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for categories" ON public.categories
  FOR ALL USING (true);

-- 3. Insert initial categories based on current system
INSERT INTO public.categories (name, name_he, icon, color, order_index) VALUES
  ('birthday', 'ימי הולדת', '🎂', '#FF6B9D', 1),
  ('therapy', 'טיפול', '🧠', '#0891B2', 2),
  ('basketball', 'כדורסל', '🏀', '#F59E0B', 3),
  ('workshop', 'סדנאות', '🎓', '#10B981', 4),
  ('resilience', 'חוסן בתנועה', '💪', '#EF4444', 5),
  ('excellence', 'פרויקט מצוינות', '🏆', '#D4AF37', 6);

-- 4. Create indexes for categories table
CREATE INDEX IF NOT EXISTS idx_categories_name ON public.categories(name);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_order ON public.categories(order_index);

-- 5. Add category_id foreign key to deals table
ALTER TABLE public.deals 
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

-- 6. Create index on deals.category_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_deals_category_id ON public.deals(category_id);

-- 7. Migrate existing deals.category text values to category_id
UPDATE public.deals d
SET category_id = c.id
FROM public.categories c
WHERE d.category = c.name AND d.category_id IS NULL;

-- ================================================================
-- Phase 2: Add "חוסן בתנועה" Domain with 3 Sub-groups
-- ================================================================

-- Insert main domain "חוסן בתנועה"
INSERT INTO public.domains (name, icon, level, order_index, is_active, pricing_type, pricing_notes)
VALUES ('חוסן בתנועה', '💪', 1, 4, true, 'fixed', 'חוג כושר ותנועה לגילאים שונים')
ON CONFLICT DO NOTHING;

-- Get the ID of the new domain and insert sub-domains
DO $$
DECLARE
  resilience_id UUID;
BEGIN
  SELECT id INTO resilience_id FROM public.domains WHERE name = 'חוסן בתנועה' AND level = 1;
  
  IF resilience_id IS NOT NULL THEN
    -- Sub-group 1: גילאי 3-5
    INSERT INTO public.domains (name, icon, level, parent_id, order_index, is_active, pricing_type, pricing_value, pricing_notes)
    VALUES ('גילאי 3-5', '👶', 2, resilience_id, 1, true, 'fixed', 150, 'קבוצת גילאי 3-5')
    ON CONFLICT DO NOTHING;
    
    -- Sub-group 2: חובה וכיתה א'
    INSERT INTO public.domains (name, icon, level, parent_id, order_index, is_active, pricing_type, pricing_value, pricing_notes)
    VALUES ('חובה וכיתה א', '📚', 2, resilience_id, 2, true, 'fixed', 180, 'קבוצת חובה וכיתה א')
    ON CONFLICT DO NOTHING;
    
    -- Sub-group 3: כיתות ב-ד
    INSERT INTO public.domains (name, icon, level, parent_id, order_index, is_active, pricing_type, pricing_value, pricing_notes)
    VALUES ('כיתות ב-ד', '🎒', 2, resilience_id, 3, true, 'fixed', 200, 'קבוצת כיתות ב-ד')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ================================================================
-- Phase 3: Update Basketball School Pricing Structure (Maccabi Agreement)
-- ================================================================

-- Update pricing for basketball sub-domains based on agreement
-- מרכז בית ספר אמיר - 38%
UPDATE public.domains 
SET pricing_type = 'percentage', 
    pricing_value = 38, 
    pricing_notes = 'הסכם מכבי פ"ת - 38% מההכנסות (בניכוי מאמנים)'
WHERE name LIKE '%אמיר%' AND level = 2;

-- גני ילדים נווה עוז - 45%
UPDATE public.domains 
SET pricing_type = 'percentage', 
    pricing_value = 45, 
    pricing_notes = 'הסכם מכבי פ"ת - 45% מההכנסות'
WHERE name LIKE '%גנים%' OR name LIKE '%גני ילדים%' AND level = 2;

-- מרכז נווה עוז - 34%/37% (tiered pricing - using base 34%)
UPDATE public.domains 
SET pricing_type = 'percentage', 
    pricing_value = 34, 
    pricing_notes = 'הסכם מכבי פ"ת - 34% עד 140K, 37% מעל'
WHERE name LIKE '%נווה עוז%' AND name NOT LIKE '%גנים%' AND level = 2;

-- פרויקט מצוינות - 60%
UPDATE public.domains 
SET pricing_type = 'percentage', 
    pricing_value = 60, 
    pricing_notes = 'פרויקט מצוינות - 60% מתן, 40% מועדון. 280₪/חודש לשחקן'
WHERE name = 'פרויקט מצוינות';

-- ================================================================
-- Phase 4: Add Private Session Pricing Packages
-- ================================================================

-- Update private therapy/training domain with package pricing
UPDATE public.domains 
SET pricing_notes = 'מפגש בודד: 350₪ | 5 מפגשים: 1,500₪ | 10 מפגשים: 2,750₪'
WHERE name = 'מטופל פרטי' OR name = 'טיפולים פרטיים';

-- Create pricing packages table for session-based pricing
CREATE TABLE IF NOT EXISTS public.pricing_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id UUID REFERENCES public.domains(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_he TEXT NOT NULL,
  sessions_count INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  price_per_session DECIMAL(10,2) GENERATED ALWAYS AS (price / sessions_count) STORED,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pricing_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for pricing_packages" ON public.pricing_packages
  FOR ALL USING (true);

-- Insert standard pricing packages
INSERT INTO public.pricing_packages (domain_id, name, name_he, sessions_count, price)
SELECT d.id, 'single', 'מפגש בודד', 1, 350
FROM public.domains d WHERE d.name = 'מטופל פרטי' OR d.name = 'טיפולים פרטיים'
LIMIT 1;

INSERT INTO public.pricing_packages (domain_id, name, name_he, sessions_count, price)
SELECT d.id, 'pack5', 'חבילת 5 מפגשים', 5, 1500
FROM public.domains d WHERE d.name = 'מטופל פרטי' OR d.name = 'טיפולים פרטיים'
LIMIT 1;

INSERT INTO public.pricing_packages (domain_id, name, name_he, sessions_count, price)
SELECT d.id, 'pack10', 'חבילת 10 מפגשים', 10, 2750
FROM public.domains d WHERE d.name = 'מטופל פרטי' OR d.name = 'טיפולים פרטיים'
LIMIT 1;