-- Run after create_registrations.sql and alter_profiles_add_registration_columns.sql.
-- It keeps private contact information out of the participant directory.

ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS luma_guest_id text,
  ADD COLUMN IF NOT EXISTS approval_status text,
  ADD COLUMN IF NOT EXISTS checked_in_at timestamptz,
  ADD COLUMN IF NOT EXISTS luma_qr_code_url text,
  ADD COLUMN IF NOT EXISTS ticket_name text,
  ADD COLUMN IF NOT EXISTS team_status text,
  ADD COLUMN IF NOT EXISTS form_responses jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE UNIQUE INDEX IF NOT EXISTS registrations_luma_guest_id_key
  ON public.registrations (luma_guest_id) WHERE luma_guest_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.connection_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at timestamptz NOT NULL DEFAULT now(),
  responded_at timestamptz,
  CONSTRAINT connection_requests_different_people CHECK (requester_id <> recipient_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS connection_requests_pair_key
  ON public.connection_requests (requester_id, recipient_id);

-- This is the only attendee data participants need to browse. It deliberately omits
-- email, phone, parent/guardian fields, raw Luma check-in links, and teammate names.
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

ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "participants can view their connection requests" ON public.connection_requests;
CREATE POLICY "participants can view their connection requests"
  ON public.connection_requests FOR SELECT TO authenticated
  USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

DROP POLICY IF EXISTS "participants can send connection requests" ON public.connection_requests;
CREATE POLICY "participants can send connection requests"
  ON public.connection_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = requester_id);

DROP POLICY IF EXISTS "recipients can respond to connection requests" ON public.connection_requests;
CREATE POLICY "recipients can respond to connection requests"
  ON public.connection_requests FOR UPDATE TO authenticated
  USING (auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = recipient_id);

-- Directory access uses a view over registrations. Keep this policy read-only and
-- limited to signed-in participants.
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authenticated users can browse approved registrations" ON public.registrations;
CREATE POLICY "authenticated users can browse approved registrations"
  ON public.registrations FOR SELECT TO authenticated
  USING (COALESCE(approval_status, 'approved') = 'approved');
