-- Phase 3: Add domain_id to deals table and update related functionality

-- Add domain_id column to deals table
ALTER TABLE deals 
ADD COLUMN IF NOT EXISTS domain_id uuid REFERENCES domains(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_deals_domain_id ON deals(domain_id);
CREATE INDEX IF NOT EXISTS idx_deals_contact_id ON deals(contact_id);

-- Add comment
COMMENT ON COLUMN deals.domain_id IS 'Reference to the domain this deal belongs to';
