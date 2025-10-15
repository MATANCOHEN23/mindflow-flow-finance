-- Phase 7: Cleanup phantom "לא צוין" contacts
-- Delete contact_domains relationships first (to avoid foreign key constraints)
DELETE FROM contact_domains 
WHERE contact_id IN (
  SELECT id FROM contacts WHERE first_name = 'לא צוין'
);

-- Delete the contacts themselves
DELETE FROM contacts WHERE first_name = 'לא צוין';

-- Verify cleanup
SELECT COUNT(*) as remaining_unnamed_contacts FROM contacts WHERE first_name = 'לא צוין';