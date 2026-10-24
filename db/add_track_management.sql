-- Run this once in Supabase SQL Editor to let organizers manage team track options.
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

ALTER TABLE public.competition_tracks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "competition tracks: signed in read" ON public.competition_tracks;
CREATE POLICY "competition tracks: signed in read" ON public.competition_tracks
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "competition tracks: organizers manage" ON public.competition_tracks;
CREATE POLICY "competition tracks: organizers manage" ON public.competition_tracks
  FOR ALL TO authenticated
  USING (public.is_event_admin()) WITH CHECK (public.is_event_admin());
