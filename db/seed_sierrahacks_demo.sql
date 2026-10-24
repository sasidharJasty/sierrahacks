-- SIERRA HACKS DEMO SEED VERSION 5 - clean empty-auth compatible seed.
-- Development-only seed data. Run reset_and_setup_sierrahacks.sql first.
-- Creates 12 confirmed Supabase Auth users. Every demo account uses password: DemoPass123!
-- Demo accounts use the @demo.sierrahacks.local domain and can be removed safely later.

-- Multiple participants on the same team intentionally share a team number.
DROP INDEX IF EXISTS public.profiles_team_number_key;
CREATE INDEX IF NOT EXISTS profiles_team_number_idx ON public.profiles (team_number);

-- Compatibility upgrade for installations created before multi-room judging.
ALTER TABLE public.judging_queue
  ADD COLUMN IF NOT EXISTS room_number smallint NOT NULL DEFAULT 1 CHECK (room_number BETWEEN 1 AND 3);
CREATE TABLE IF NOT EXISTS public.judging_rooms (
  room_number smallint PRIMARY KEY CHECK (room_number BETWEEN 1 AND 3),
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true
);
INSERT INTO public.judging_rooms (room_number, name, is_active) VALUES
  (1, 'Room 1', true), (2, 'Room 2', true), (3, 'Room 3', true)
ON CONFLICT (room_number) DO NOTHING;
DROP VIEW IF EXISTS public.judging_order;
CREATE VIEW public.judging_order AS
SELECT q.id, q.team_id, t.name AS team_name, t.tracks, q.room_number, q.status, q.position, q.started_at, q.completed_at
FROM public.judging_queue q JOIN public.teams t ON t.id = q.team_id;
GRANT SELECT ON public.judging_order TO anon, authenticated;

DO $$
DECLARE
  demo_user record;
  t_horizon uuid; t_crafters uuid; t_signal uuid; t_bloom uuid; t_lighthouse uuid; t_pixel uuid;
BEGIN
  -- Remove prior demo teams first, including interrupted/renamed seed runs,
  -- before cascading deletion from auth.users reaches their profiles.
  DELETE FROM public.teams t
  WHERE t.name IN ('Team Horizon', 'Code Crafters', 'Signal Stack', 'Binary Bloom', 'Lighthouse Labs', 'Pixel Pioneers')
     OR t.lead_id IN (SELECT id FROM public.profiles WHERE email LIKE '%@demo.sierrahacks.local')
     OR EXISTS (
       SELECT 1 FROM public.team_members tm JOIN public.profiles prof ON prof.id = tm.profile_id
       WHERE tm.team_id = t.id AND prof.email LIKE '%@demo.sierrahacks.local'
     );
  DELETE FROM auth.users WHERE email LIKE '%@demo.sierrahacks.local';

  INSERT INTO public.registrations (submission_id, first_name, last_name, email_address, school, grade, approval_status, participating_solo, looking_for_teammates, is_vegetarian, allergies, form_responses)
  SELECT 'demo-' || lower(replace(first_name || '-' || last_name, ' ', '-')), first_name, last_name, email, 'Demo High School', grade, 'approved', true, true, vegetarian, allergies, jsonb_build_object('source', 'demo seed', 'project_interest', interest)
  FROM (VALUES
    ('Maya','Chen','maya.chen@demo.sierrahacks.local','11',true,'Peanuts','AI for Good'),
    ('Leo','Rivera','leo.rivera@demo.sierrahacks.local','11',false,null,'AI for Good'),
    ('Zara','Patel','zara.patel@demo.sierrahacks.local','10',true,'Gluten','Developer Tools'),
    ('Noah','Kim','noah.kim@demo.sierrahacks.local','10',false,null,'Developer Tools'),
    ('Avery','Johnson','avery.johnson@demo.sierrahacks.local','12',false,null,'Education'),
    ('Ethan','Brown','ethan.brown@demo.sierrahacks.local','12',true,'Dairy','Education'),
    ('Sofia','Garcia','sofia.garcia@demo.sierrahacks.local','11',true,null,'Open Innovation'),
    ('Miles','Davis','miles.davis@demo.sierrahacks.local','11',false,null,'Open Innovation'),
    ('Ivy','Wilson','ivy.wilson@demo.sierrahacks.local','9',false,null,'AI for Good'),
    ('Owen','Taylor','owen.taylor@demo.sierrahacks.local','9',true,'Sesame','AI for Good'),
    ('Nina','Martin','nina.martin@demo.sierrahacks.local','10',false,null,'Developer Tools'),
    ('Kai','Anderson','kai.anderson@demo.sierrahacks.local','10',false,null,'Developer Tools')
  ) AS demo(first_name, last_name, email, grade, vegetarian, allergies, interest)
  ON CONFLICT (submission_id) DO UPDATE SET school = EXCLUDED.school, grade = EXCLUDED.grade, approval_status = EXCLUDED.approval_status, is_vegetarian = EXCLUDED.is_vegetarian, allergies = EXCLUDED.allergies, form_responses = EXCLUDED.form_responses;

  FOR demo_user IN SELECT * FROM (VALUES
    ('10000000-0000-0000-0000-000000000001'::uuid,'maya.chen@demo.sierrahacks.local','Maya Chen','11',true,'Peanuts'),
    ('10000000-0000-0000-0000-000000000002'::uuid,'leo.rivera@demo.sierrahacks.local','Leo Rivera','11',false,null),
    ('10000000-0000-0000-0000-000000000003'::uuid,'zara.patel@demo.sierrahacks.local','Zara Patel','10',true,'Gluten'),
    ('10000000-0000-0000-0000-000000000004'::uuid,'noah.kim@demo.sierrahacks.local','Noah Kim','10',false,null),
    ('10000000-0000-0000-0000-000000000005'::uuid,'avery.johnson@demo.sierrahacks.local','Avery Johnson','12',false,null),
    ('10000000-0000-0000-0000-000000000006'::uuid,'ethan.brown@demo.sierrahacks.local','Ethan Brown','12',true,'Dairy'),
    ('10000000-0000-0000-0000-000000000007'::uuid,'sofia.garcia@demo.sierrahacks.local','Sofia Garcia','11',true,null),
    ('10000000-0000-0000-0000-000000000008'::uuid,'miles.davis@demo.sierrahacks.local','Miles Davis','11',false,null),
    ('10000000-0000-0000-0000-000000000009'::uuid,'ivy.wilson@demo.sierrahacks.local','Ivy Wilson','9',false,null),
    ('10000000-0000-0000-0000-000000000010'::uuid,'owen.taylor@demo.sierrahacks.local','Owen Taylor','9',true,'Sesame'),
    ('10000000-0000-0000-0000-000000000011'::uuid,'nina.martin@demo.sierrahacks.local','Nina Martin','10',false,null),
    ('10000000-0000-0000-0000-000000000012'::uuid,'kai.anderson@demo.sierrahacks.local','Kai Anderson','10',false,null)
  ) AS demo(id,email,name,grade,vegetarian,allergies) LOOP
    INSERT INTO auth.users (instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at)
    VALUES ('00000000-0000-0000-0000-000000000000'::uuid,demo_user.id,'authenticated','authenticated',demo_user.email,crypt('DemoPass123!', gen_salt('bf')),now(),jsonb_build_object('provider','email','providers',jsonb_build_array('email')),jsonb_build_object('name',demo_user.name),now(),now())
    ON CONFLICT (id) DO UPDATE SET email_confirmed_at = EXCLUDED.email_confirmed_at;
    INSERT INTO auth.identities (id,user_id,identity_data,provider,provider_id,created_at,updated_at)
    VALUES (demo_user.id,demo_user.id,jsonb_build_object('sub',demo_user.id::text,'email',demo_user.email,'email_verified',true),'email',demo_user.email,now(),now())
    ON CONFLICT (provider,provider_id) DO NOTHING;
    UPDATE public.profiles SET name=demo_user.name, school='Demo High School', grade=demo_user.grade, is_admin=(demo_user.id = '10000000-0000-0000-0000-000000000001'), is_vegetarian=demo_user.vegetarian, allergies=demo_user.allergies,
      breakfast_received=(demo_user.id IN ('10000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000003')),
      lunch_received=(demo_user.id IN ('10000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000004'))
    WHERE id=demo_user.id;
  END LOOP;

  INSERT INTO public.teams (name,lead_id,tracks) VALUES ('Team Horizon','10000000-0000-0000-0000-000000000001',ARRAY['AI for Good']) RETURNING id INTO t_horizon;
  INSERT INTO public.teams (name,lead_id,tracks) VALUES ('Code Crafters','10000000-0000-0000-0000-000000000003',ARRAY['Developer Tools']) RETURNING id INTO t_crafters;
  INSERT INTO public.teams (name,lead_id,tracks) VALUES ('Signal Stack','10000000-0000-0000-0000-000000000005',ARRAY['Education']) RETURNING id INTO t_signal;
  INSERT INTO public.teams (name,lead_id,tracks) VALUES ('Binary Bloom','10000000-0000-0000-0000-000000000007',ARRAY['Open Innovation']) RETURNING id INTO t_bloom;
  INSERT INTO public.teams (name,lead_id,tracks) VALUES ('Lighthouse Labs','10000000-0000-0000-0000-000000000009',ARRAY['AI for Good']) RETURNING id INTO t_lighthouse;
  INSERT INTO public.teams (name,lead_id,tracks) VALUES ('Pixel Pioneers','10000000-0000-0000-0000-000000000011',ARRAY['Developer Tools']) RETURNING id INTO t_pixel;

  INSERT INTO public.team_members (team_id,profile_id,role) VALUES
    (t_horizon,'10000000-0000-0000-0000-000000000001','lead'),(t_horizon,'10000000-0000-0000-0000-000000000002','member'),
    (t_crafters,'10000000-0000-0000-0000-000000000003','lead'),(t_crafters,'10000000-0000-0000-0000-000000000004','member'),
    (t_signal,'10000000-0000-0000-0000-000000000005','lead'),(t_signal,'10000000-0000-0000-0000-000000000006','member'),
    (t_bloom,'10000000-0000-0000-0000-000000000007','lead'),(t_bloom,'10000000-0000-0000-0000-000000000008','member'),
    (t_lighthouse,'10000000-0000-0000-0000-000000000009','lead'),(t_lighthouse,'10000000-0000-0000-0000-000000000010','member'),
    (t_pixel,'10000000-0000-0000-0000-000000000011','lead'),(t_pixel,'10000000-0000-0000-0000-000000000012','member');

  UPDATE public.teams SET team_number = nextval('public.team_number_seq')
  WHERE id IN (t_horizon, t_crafters, t_signal, t_bloom, t_lighthouse, t_pixel);
  UPDATE public.profiles p SET team_number = t.team_number
  FROM public.team_members tm JOIN public.teams t ON t.id = tm.team_id
  WHERE tm.profile_id = p.id AND tm.team_id IN (t_horizon, t_crafters, t_signal, t_bloom, t_lighthouse, t_pixel);

  INSERT INTO public.judging_queue (team_id,room_number,status,position,started_at) VALUES
    (t_horizon,1,'presenting',1,now()),(t_signal,2,'presenting',1,now()),(t_lighthouse,3,'presenting',1,now()),
    (t_crafters,1,'waiting',2,null),(t_bloom,2,'waiting',2,null),(t_pixel,3,'waiting',2,null);
END $$;
