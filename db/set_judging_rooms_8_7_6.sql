-- Safe migration for an existing Sierra Hacks database.
-- Internal room keys remain 1, 2, and 3 so existing queue assignments are preserved.
INSERT INTO public.judging_rooms (room_number, name, is_active) VALUES
  (1, 'Room 8', true),
  (2, 'Room 7', true),
  (3, 'Room 6', true)
ON CONFLICT (room_number) DO UPDATE
SET name = EXCLUDED.name,
    is_active = true;
