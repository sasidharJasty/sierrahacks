-- Live demo/presentation queue. Run after the profile migration.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS breakfast_received boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS lunch_received boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS dinner_received boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.is_event_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT is_admin FROM public.profiles WHERE id = auth.uid()), false);
$$;

GRANT EXECUTE ON FUNCTION public.is_event_admin() TO authenticated;

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

CREATE INDEX IF NOT EXISTS presentation_queue_order_idx
  ON public.presentation_queue (status, position, created_at);

ALTER TABLE public.presentation_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone can view presentation queue" ON public.presentation_queue;
CREATE POLICY "anyone can view presentation queue"
  ON public.presentation_queue FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "organizers can manage presentation queue" ON public.presentation_queue;
CREATE POLICY "organizers can manage presentation queue"
  ON public.presentation_queue FOR ALL TO authenticated
  USING (public.is_event_admin())
  WITH CHECK (public.is_event_admin());

-- Required for browser subscriptions used by the organizer controls and display view.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'presentation_queue'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.presentation_queue;
  END IF;
END $$;
