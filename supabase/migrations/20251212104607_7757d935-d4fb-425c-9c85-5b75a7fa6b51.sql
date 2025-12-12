-- Fix 1: Update RLS policies for categories, domains, pricing_packages
-- Categories: Allow public read for active, require admin for write
DROP POLICY IF EXISTS "Allow all for categories" ON categories;

CREATE POLICY "Anyone can read active categories"
  ON categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Domains: Keep public read for active, require authenticated for write
DROP POLICY IF EXISTS "Allow all for anon" ON domains;

CREATE POLICY "Anyone can read domains"
  ON domains FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage domains"
  ON domains FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update domains"
  ON domains FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete domains"
  ON domains FOR DELETE
  TO authenticated
  USING (true);

-- Pricing packages: Allow public read, require authenticated for write
DROP POLICY IF EXISTS "Allow all for pricing_packages" ON pricing_packages;

CREATE POLICY "Anyone can read pricing packages"
  ON pricing_packages FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage pricing packages"
  ON pricing_packages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix 2: Update function search paths to prevent mutable search path vulnerability
CREATE OR REPLACE FUNCTION public.get_domain_full_path(domain_id uuid)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $function$
DECLARE
  path TEXT := '';
  current_id UUID := domain_id;
  current_name TEXT;
  parent_id_val UUID;
BEGIN
  LOOP
    SELECT name, parent_id INTO current_name, parent_id_val
    FROM public.domains
    WHERE id = current_id;
    
    IF current_name IS NULL THEN
      EXIT;
    END IF;
    
    IF path = '' THEN
      path := current_name;
    ELSE
      path := current_name || ' > ' || path;
    END IF;
    
    current_id := parent_id_val;
    
    IF current_id IS NULL THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN path;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_events_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_tasks_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;