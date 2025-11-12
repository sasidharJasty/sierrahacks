-- Add extra profile columns used by registrations mapping
alter table if exists public.profiles
  add column if not exists phone_number text,
  add column if not exists date_of_birth date,
  add column if not exists participating_solo boolean,
  add column if not exists looking_for_teammates boolean,
  add column if not exists teammates text,
  add column if not exists city text,
  add column if not exists parent_name text,
  add column if not exists parent_email text,
  add column if not exists parent_phone text;

create index if not exists profiles_email_idx on public.profiles(lower(email));
