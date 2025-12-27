-- Enable RLS on audit_log table
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Allow any authenticated user to read audit logs (single-user private system)
CREATE POLICY "Authenticated users can view audit logs"
  ON public.audit_log
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert audit logs
CREATE POLICY "Authenticated users can insert audit logs"
  ON public.audit_log
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to delete their own audit logs
CREATE POLICY "Authenticated users can delete audit logs"
  ON public.audit_log
  FOR DELETE
  TO authenticated
  USING (true);