-- Add profile columns used by the importer and UI. These statements use IF NOT EXISTS
-- so they are safe to run multiple times.
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS phone_number text,
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS teammates text,
  ADD COLUMN IF NOT EXISTS parent_name text,
  ADD COLUMN IF NOT EXISTS parent_email text,
  ADD COLUMN IF NOT EXISTS parent_phone text,
  ADD COLUMN IF NOT EXISTS submission_id text,
  ADD COLUMN IF NOT EXISTS respondent_id text,
  ADD COLUMN IF NOT EXISTS is_vegetarian boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS allergies text,
  ADD COLUMN IF NOT EXISTS participating_solo boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS looking_for_teammates boolean DEFAULT false;

-- Depending on your desired constraints, you may also want to create an index on email
-- if you plan to frequently query profiles by email during imports.
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
