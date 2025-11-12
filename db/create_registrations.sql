-- Create a `registrations` table to mirror your spreadsheet columns
-- Run this in Supabase SQL editor (or via psql). This file does NOT enable RLS
-- by default so you can import data easily; see notes below about securing access.

create table if not exists public.registrations (
  submission_id text,
  respondent_id text,
  submitted_at timestamptz,
  first_name text,
  last_name text,
  email_address text,
  phone_number text,
  date_of_birth date,
  participating_solo boolean,
  looking_for_teammates boolean,
  teammates text,
  school text,
  grade text,
  city text,
  parent_name text,
  parent_email text,
  parent_phone text,
  created_at timestamptz default now()
);

-- Example: index on email to make lookup fast
create index if not exists registrations_email_idx on public.registrations(lower(email_address));

-- NOTES:
-- 1) Import your CSV (export from Google Sheets) into this table using the Supabase
--    table editor or the CSV import feature in the dashboard.
-- 2) Once imported, you'll want to link rows to authenticated users. One approach is
--    to match the user's email_address to the auth email on sign-in and then copy fields
--    into the `profiles` table (which is what the dashboard reads).
-- 3) Security: right now this table has no Row Level Security (RLS). For production,
--    consider creating an RPC that only returns the caller's row (server-side) or enable
--    RLS and write a policy allowing select where lower(email_address) = lower(current_setting('jwt.claims.email', true)).
