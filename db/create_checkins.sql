-- Create checkins table to record meal checkoffs by admins
create table if not exists public.checkins (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  check_date date not null default current_date,
  breakfast boolean default false,
  lunch boolean default false,
  dinner boolean default false,
  dietary_restrictions text,
  checked_by text,
  checked_at timestamptz default now()
);

create index if not exists checkins_user_id_idx on public.checkins(user_id);
create index if not exists checkins_date_idx on public.checkins(check_date);
