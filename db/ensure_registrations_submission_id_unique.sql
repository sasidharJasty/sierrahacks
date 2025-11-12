-- Ensure a unique index on registrations.submission_id for safe ON CONFLICT upserts
-- This uses CREATE UNIQUE INDEX IF NOT EXISTS which is safe to run multiple times.
CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_submission_id ON registrations(submission_id);

-- Optionally, if you want to enforce non-null submission_id, you can add
-- ALTER TABLE registrations ALTER COLUMN submission_id SET NOT NULL;
-- but be careful: if you have rows without submission_id, this will fail.
