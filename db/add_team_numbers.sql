-- Run once in Supabase SQL Editor. Adds permanent team numbers to teams and solo participants.
CREATE SEQUENCE IF NOT EXISTS public.team_number_seq START WITH 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS team_number integer;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS team_number integer;

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

CREATE OR REPLACE FUNCTION public.create_profile_for_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, team_number)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data ->> 'name', ''), nextval('public.team_number_seq'))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

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
GRANT EXECUTE ON FUNCTION public.create_team(text, text[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.join_team(text) TO authenticated;
