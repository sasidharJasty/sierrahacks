-- Sierra Hacks: one-shot Supabase setup
-- Run this whole file in Supabase Dashboard → SQL Editor → New query.
-- It is safe to re-run. Make one organizer after it runs with:
-- UPDATE public.profiles SET is_admin = true WHERE lower(email) = lower('organizer@example.com');

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SEQUENCE IF NOT EXISTS public.team_number_seq START WITH 1;

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS school text,
  ADD COLUMN IF NOT EXISTS age integer,
  ADD COLUMN IF NOT EXISTS grade text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS phone_number text,
  ADD COLUMN IF NOT EXISTS dob date,
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS teammates text,
  ADD COLUMN IF NOT EXISTS team_members text,
  ADD COLUMN IF NOT EXISTS parent_name text,
  ADD COLUMN IF NOT EXISTS parent_email text,
  ADD COLUMN IF NOT EXISTS parent_phone text,
  ADD COLUMN IF NOT EXISTS submission_id text,
  ADD COLUMN IF NOT EXISTS respondent_id text,
  ADD COLUMN IF NOT EXISTS participating_solo boolean,
  ADD COLUMN IF NOT EXISTS looking_for_teammates boolean,
  ADD COLUMN IF NOT EXISTS is_vegetarian boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS allergies text,
  ADD COLUMN IF NOT EXISTS allergy text,
  ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS breakfast_received boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS lunch_received boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS dinner_received boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS website_workshop boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS python_workshop boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS ai_ml_workshop boolean NOT NULL DEFAULT false;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS team_number integer;

CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles (lower(email));

CREATE OR REPLACE FUNCTION public.create_profile_for_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, team_number)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data ->> 'name', ''), nextval('public.team_number_seq'))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_sierrahacks ON auth.users;
CREATE TRIGGER on_auth_user_created_sierrahacks
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_profile_for_new_user();


CREATE OR REPLACE FUNCTION public.is_event_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT COALESCE((SELECT is_admin FROM public.profiles WHERE id = auth.uid()), false); $$;

GRANT EXECUTE ON FUNCTION public.is_event_admin() TO authenticated;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles: users read self" ON public.profiles;
CREATE POLICY "profiles: users read self" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_event_admin());
DROP POLICY IF EXISTS "profiles: users insert self" ON public.profiles;
CREATE POLICY "profiles: users insert self" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());
DROP POLICY IF EXISTS "profiles: users update self" ON public.profiles;
CREATE POLICY "profiles: users update self" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_event_admin())
  WITH CHECK (id = auth.uid() OR public.is_event_admin());

CREATE TABLE IF NOT EXISTS public.registrations (
  submission_id text PRIMARY KEY,
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
  luma_guest_id text,
  approval_status text,
  checked_in_at timestamptz,
  luma_qr_code_url text,
  ticket_name text,
  team_status text,
  is_vegetarian boolean,
  allergies text,
  form_responses jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS luma_guest_id text,
  ADD COLUMN IF NOT EXISTS approval_status text,
  ADD COLUMN IF NOT EXISTS checked_in_at timestamptz,
  ADD COLUMN IF NOT EXISTS luma_qr_code_url text,
  ADD COLUMN IF NOT EXISTS ticket_name text,
  ADD COLUMN IF NOT EXISTS team_status text,
  ADD COLUMN IF NOT EXISTS is_vegetarian boolean,
  ADD COLUMN IF NOT EXISTS allergies text,
  ADD COLUMN IF NOT EXISTS form_responses jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS registrations_email_idx ON public.registrations (lower(email_address));
CREATE UNIQUE INDEX IF NOT EXISTS registrations_submission_id_key ON public.registrations (submission_id);

-- When a participant signs in with the same email used in the CSV/Luma import,
-- hydrate blank profile fields from that registration automatically.
CREATE OR REPLACE FUNCTION public.hydrate_profile_from_registration()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE r public.registrations%ROWTYPE;
BEGIN
  IF NEW.email IS NULL THEN RETURN NEW; END IF;
  SELECT * INTO r FROM public.registrations WHERE lower(email_address) = lower(NEW.email) ORDER BY submitted_at DESC NULLS LAST LIMIT 1;
  IF NOT FOUND THEN RETURN NEW; END IF;
  NEW.name := COALESCE(NULLIF(NEW.name, ''), concat_ws(' ', r.first_name, r.last_name));
  NEW.first_name := COALESCE(NULLIF(NEW.first_name, ''), r.first_name); NEW.last_name := COALESCE(NULLIF(NEW.last_name, ''), r.last_name);
  NEW.school := COALESCE(NULLIF(NEW.school, ''), r.school); NEW.grade := COALESCE(NULLIF(NEW.grade, ''), r.grade);
  NEW.phone_number := COALESCE(NULLIF(NEW.phone_number, ''), r.phone_number); NEW.phone := COALESCE(NULLIF(NEW.phone, ''), r.phone_number);
  NEW.date_of_birth := COALESCE(NEW.date_of_birth, r.date_of_birth); NEW.dob := COALESCE(NEW.dob, r.date_of_birth);
  NEW.city := COALESCE(NULLIF(NEW.city, ''), r.city); NEW.teammates := COALESCE(NULLIF(NEW.teammates, ''), r.teammates); NEW.team_members := COALESCE(NULLIF(NEW.team_members, ''), r.teammates);
  NEW.parent_name := COALESCE(NULLIF(NEW.parent_name, ''), r.parent_name); NEW.parent_email := COALESCE(NULLIF(NEW.parent_email, ''), r.parent_email); NEW.parent_phone := COALESCE(NULLIF(NEW.parent_phone, ''), r.parent_phone);
  NEW.submission_id := COALESCE(NULLIF(NEW.submission_id, ''), r.submission_id); NEW.respondent_id := COALESCE(NULLIF(NEW.respondent_id, ''), r.respondent_id);
  NEW.participating_solo := COALESCE(NEW.participating_solo, r.participating_solo); NEW.looking_for_teammates := COALESCE(NEW.looking_for_teammates, r.looking_for_teammates);
  NEW.allergies := COALESCE(NULLIF(NEW.allergies, ''), r.allergies); NEW.allergy := COALESCE(NULLIF(NEW.allergy, ''), r.allergies);
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS hydrate_profile_from_registration_sierrahacks ON public.profiles;
CREATE TRIGGER hydrate_profile_from_registration_sierrahacks BEFORE INSERT OR UPDATE OF email ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.hydrate_profile_from_registration();
CREATE UNIQUE INDEX IF NOT EXISTS registrations_luma_guest_id_key ON public.registrations (luma_guest_id) WHERE luma_guest_id IS NOT NULL;

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "registrations: user reads own" ON public.registrations;
CREATE POLICY "registrations: user reads own" ON public.registrations FOR SELECT TO authenticated
  USING (lower(email_address) = lower(COALESCE(auth.jwt() ->> 'email', '')) OR public.is_event_admin());

CREATE TABLE IF NOT EXISTS public.connection_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at timestamptz NOT NULL DEFAULT now(),
  responded_at timestamptz,
  CONSTRAINT connection_requests_different_people CHECK (requester_id <> recipient_id)
);
CREATE UNIQUE INDEX IF NOT EXISTS connection_requests_pair_key ON public.connection_requests (requester_id, recipient_id);
ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "connection requests: participants view theirs" ON public.connection_requests;
CREATE POLICY "connection requests: participants view theirs" ON public.connection_requests FOR SELECT TO authenticated
  USING (auth.uid() = requester_id OR auth.uid() = recipient_id);
DROP POLICY IF EXISTS "connection requests: sender creates" ON public.connection_requests;
CREATE POLICY "connection requests: sender creates" ON public.connection_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = requester_id);
DROP POLICY IF EXISTS "connection requests: recipient responds" ON public.connection_requests;
CREATE POLICY "connection requests: recipient responds" ON public.connection_requests FOR UPDATE TO authenticated
  USING (auth.uid() = recipient_id) WITH CHECK (auth.uid() = recipient_id);

-- Safe attendee view used by participant browsing and participant QR scans.
CREATE OR REPLACE VIEW public.participant_directory AS
SELECT
  p.id AS profile_id,
  r.submission_id,
  COALESCE(NULLIF(p.name, ''), concat_ws(' ', r.first_name, r.last_name)) AS name,
  COALESCE(NULLIF(p.school, ''), r.school) AS school,
  COALESCE(NULLIF(p.grade, ''), r.grade) AS grade,
  COALESCE(p.participating_solo, r.participating_solo) AS participating_solo,
  COALESCE(p.looking_for_teammates, r.looking_for_teammates) AS looking_for_teammates,
  COALESCE(p.is_vegetarian, r.is_vegetarian) AS is_vegetarian,
  r.team_status,
  r.ticket_name
FROM public.registrations r
LEFT JOIN public.profiles p ON lower(p.email) = lower(r.email_address)
WHERE COALESCE(r.approval_status, 'approved') = 'approved';
GRANT SELECT ON public.participant_directory TO authenticated;

CREATE TABLE IF NOT EXISTS public.checkins (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  check_date date NOT NULL DEFAULT current_date,
  breakfast boolean NOT NULL DEFAULT false,
  lunch boolean NOT NULL DEFAULT false,
  dinner boolean NOT NULL DEFAULT false,
  dietary_restrictions text,
  checked_by text,
  checked_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS checkins_user_date_idx ON public.checkins (user_id, check_date);
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "checkins: organizers manage" ON public.checkins;
CREATE POLICY "checkins: organizers manage" ON public.checkins FOR ALL TO authenticated
  USING (public.is_event_admin()) WITH CHECK (public.is_event_admin());

CREATE TABLE IF NOT EXISTS public.judging_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_title text NOT NULL,
  comments text,
  judge_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  judge_email text,
  judge_name text,
  innovation_score numeric NOT NULL CHECK (innovation_score BETWEEN 0 AND 10),
  technical_score numeric NOT NULL CHECK (technical_score BETWEEN 0 AND 10),
  design_score numeric NOT NULL CHECK (design_score BETWEEN 0 AND 10),
  relevance_score numeric NOT NULL CHECK (relevance_score BETWEEN 0 AND 10),
  presentation_score numeric NOT NULL CHECK (presentation_score BETWEEN 0 AND 10),
  total_score numeric NOT NULL CHECK (total_score BETWEEN 0 AND 100),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS judging_scores_created_at_idx ON public.judging_scores (created_at DESC);
ALTER TABLE public.judging_scores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "judging scores: organizers manage" ON public.judging_scores;
CREATE POLICY "judging scores: organizers manage" ON public.judging_scores FOR ALL TO authenticated
  USING (public.is_event_admin()) WITH CHECK (public.is_event_admin());

CREATE TABLE IF NOT EXISTS public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE CHECK (char_length(trim(name)) BETWEEN 2 AND 80),
  lead_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  join_code text NOT NULL UNIQUE DEFAULT upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
  tracks text[] NOT NULL DEFAULT '{}',
  team_number integer UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS team_number integer;

-- Organizers control these options from the Teams dashboard. Teams may select
-- several tracks, but each team has only one row in judging_queue and is judged once.
CREATE TABLE IF NOT EXISTS public.competition_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE CHECK (char_length(trim(name)) BETWEEN 2 AND 80),
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO public.competition_tracks (name, sort_order) VALUES
  ('AI for Good', 10), ('Developer Tools', 20), ('Education', 30), ('Open Innovation', 40)
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.team_members (
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('lead', 'member')),
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (team_id, profile_id),
  UNIQUE (profile_id)
);

-- Bring existing records into the number sequence. A person without a team is
-- treated as a solo team until they join one.
UPDATE public.teams SET team_number = nextval('public.team_number_seq') WHERE team_number IS NULL;
UPDATE public.profiles p SET team_number = t.team_number
FROM public.team_members tm JOIN public.teams t ON t.id = tm.team_id
WHERE tm.profile_id = p.id AND p.team_number IS DISTINCT FROM t.team_number;
UPDATE public.profiles SET team_number = nextval('public.team_number_seq') WHERE team_number IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS teams_team_number_key ON public.teams (team_number);
DROP INDEX IF EXISTS public.profiles_team_number_key;
CREATE INDEX IF NOT EXISTS profiles_team_number_idx ON public.profiles (team_number);
SELECT setval('public.team_number_seq', GREATEST(
  COALESCE((SELECT MAX(team_number) FROM public.teams), 0),
  COALESCE((SELECT MAX(team_number) FROM public.profiles), 0), 1
));

CREATE TABLE IF NOT EXISTS public.judging_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL UNIQUE REFERENCES public.teams(id) ON DELETE CASCADE,
  room_number smallint NOT NULL DEFAULT 1 CHECK (room_number BETWEEN 1 AND 3),
  status text NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'presenting', 'done', 'skipped')),
  position integer NOT NULL DEFAULT 0,
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.judging_queue ADD COLUMN IF NOT EXISTS room_number smallint NOT NULL DEFAULT 1 CHECK (room_number BETWEEN 1 AND 3);
CREATE INDEX IF NOT EXISTS judging_queue_order_idx ON public.judging_queue (room_number, status, position);
CREATE UNIQUE INDEX IF NOT EXISTS judging_queue_one_presenting_team_per_room
  ON public.judging_queue (room_number) WHERE status = 'presenting';

CREATE TABLE IF NOT EXISTS public.judging_rooms (
  room_number smallint PRIMARY KEY CHECK (room_number BETWEEN 1 AND 3),
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true
);
INSERT INTO public.judging_rooms (room_number, name, is_active) VALUES
  (1, 'Room 8', true), (2, 'Room 7', true), (3, 'Room 6', true)
ON CONFLICT (room_number) DO UPDATE SET name = EXCLUDED.name, is_active = true;

CREATE OR REPLACE FUNCTION public.is_team_lead(p_team_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.teams WHERE id = p_team_id AND lead_id = auth.uid()); $$;
GRANT EXECUTE ON FUNCTION public.is_team_lead(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.create_team(p_name text, p_tracks text[] DEFAULT '{}')
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_team_id uuid; v_position integer;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'You must be signed in.'; END IF;
  IF EXISTS (SELECT 1 FROM public.team_members WHERE profile_id = auth.uid()) THEN RAISE EXCEPTION 'You are already in a team.'; END IF;
  INSERT INTO public.teams (name, lead_id, tracks, team_number)
  VALUES (trim(p_name), auth.uid(), COALESCE(p_tracks, '{}'), nextval('public.team_number_seq')) RETURNING id INTO v_team_id;
  INSERT INTO public.team_members (team_id, profile_id, role) VALUES (v_team_id, auth.uid(), 'lead');
  UPDATE public.profiles SET team_number = (SELECT team_number FROM public.teams WHERE id = v_team_id) WHERE id = auth.uid();
  SELECT COALESCE(MAX(position), 0) + 1 INTO v_position FROM public.judging_queue;
  INSERT INTO public.judging_queue (team_id, position) VALUES (v_team_id, v_position);
  RETURN v_team_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.create_team(text, text[]) TO authenticated;

CREATE OR REPLACE FUNCTION public.join_team(p_join_code text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_team_id uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'You must be signed in.'; END IF;
  IF EXISTS (SELECT 1 FROM public.team_members WHERE profile_id = auth.uid()) THEN RAISE EXCEPTION 'You are already in a team.'; END IF;
  SELECT id INTO v_team_id FROM public.teams WHERE join_code = upper(trim(p_join_code));
  IF v_team_id IS NULL THEN RAISE EXCEPTION 'That team code was not found.'; END IF;
  INSERT INTO public.team_members (team_id, profile_id) VALUES (v_team_id, auth.uid());
  UPDATE public.profiles SET team_number = (SELECT team_number FROM public.teams WHERE id = v_team_id) WHERE id = auth.uid();
  RETURN v_team_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.join_team(text) TO authenticated;

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.judging_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.judging_rooms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "teams: members and admins read" ON public.teams;
CREATE POLICY "teams: members and admins read" ON public.teams FOR SELECT TO authenticated
  USING (public.is_event_admin() OR EXISTS (SELECT 1 FROM public.team_members tm WHERE tm.team_id = id AND tm.profile_id = auth.uid()));
DROP POLICY IF EXISTS "teams: leaders update" ON public.teams;
CREATE POLICY "teams: leaders update" ON public.teams FOR UPDATE TO authenticated
  USING (public.is_event_admin() OR lead_id = auth.uid()) WITH CHECK (public.is_event_admin() OR lead_id = auth.uid());

DROP POLICY IF EXISTS "competition tracks: signed in read" ON public.competition_tracks;
CREATE POLICY "competition tracks: signed in read" ON public.competition_tracks FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "competition tracks: organizers manage" ON public.competition_tracks;
CREATE POLICY "competition tracks: organizers manage" ON public.competition_tracks FOR ALL TO authenticated
  USING (public.is_event_admin()) WITH CHECK (public.is_event_admin());

DROP POLICY IF EXISTS "team members: roster access" ON public.team_members;
CREATE POLICY "team members: roster access" ON public.team_members FOR SELECT TO authenticated
  USING (public.is_event_admin() OR profile_id = auth.uid() OR public.is_team_lead(team_id));
DROP POLICY IF EXISTS "team members: leave team" ON public.team_members;
CREATE POLICY "team members: leave team" ON public.team_members FOR DELETE TO authenticated
  USING ((profile_id = auth.uid() AND role = 'member') OR public.is_event_admin());

DROP POLICY IF EXISTS "judging queue: public read" ON public.judging_queue;
CREATE POLICY "judging queue: public read" ON public.judging_queue FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "judging queue: organizers manage" ON public.judging_queue;
CREATE POLICY "judging queue: organizers manage" ON public.judging_queue FOR ALL TO authenticated
  USING (public.is_event_admin()) WITH CHECK (public.is_event_admin());
DROP POLICY IF EXISTS "judging rooms: public read" ON public.judging_rooms;
CREATE POLICY "judging rooms: public read" ON public.judging_rooms FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "judging rooms: organizers manage" ON public.judging_rooms;
CREATE POLICY "judging rooms: organizers manage" ON public.judging_rooms FOR ALL TO authenticated
  USING (public.is_event_admin()) WITH CHECK (public.is_event_admin());

-- This view is intentionally limited to public judging information: no participant names or contact details.
DROP VIEW IF EXISTS public.judging_order;
CREATE VIEW public.judging_order AS
SELECT q.id, q.team_id, t.name AS team_name, t.tracks, q.room_number, q.status, q.position, q.started_at, q.completed_at
FROM public.judging_queue q JOIN public.teams t ON t.id = q.team_id;
GRANT SELECT ON public.judging_order TO anon, authenticated;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'judging_queue') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.judging_queue;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'judging_rooms') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.judging_rooms;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.presentation_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name text NOT NULL CHECK (char_length(trim(team_name)) > 0),
  project_name text,
  status text NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'presenting', 'done', 'skipped')),
  position integer NOT NULL DEFAULT 0,
  estimated_minutes integer CHECK (estimated_minutes IS NULL OR estimated_minutes BETWEEN 1 AND 60),
  created_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz
);
CREATE INDEX IF NOT EXISTS presentation_queue_order_idx ON public.presentation_queue (status, position, created_at);
ALTER TABLE public.presentation_queue ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "presentation queue: public read" ON public.presentation_queue;
CREATE POLICY "presentation queue: public read" ON public.presentation_queue FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "presentation queue: organizers manage" ON public.presentation_queue;
CREATE POLICY "presentation queue: organizers manage" ON public.presentation_queue FOR ALL TO authenticated
  USING (public.is_event_admin()) WITH CHECK (public.is_event_admin());

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'presentation_queue'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.presentation_queue;
  END IF;
END $$;

-- Explicit PostgREST privileges. Row-level security policies above still decide
-- which rows each signed-in user or public visitor may access.
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT SELECT ON public.judging_queue, public.judging_rooms, public.judging_order, public.presentation_queue TO anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT ALL PRIVILEGES ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT ALL PRIVILEGES ON SEQUENCES TO service_role;
