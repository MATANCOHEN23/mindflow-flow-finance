-- Fix function search_path mutable issue for set_updated_at function
-- This prevents potential search_path hijacking attacks

CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
begin
  new.updated_at = now();
  return new;
end $function$;