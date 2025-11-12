-- Attempt to create a primary key on registrations.submission_id if one doesn't exist.
-- WARNING: This will fail if submission_id contains duplicates or NULLs.
-- Run this after you've imported and validated your CSV data.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.registrations'::regclass AND contype = 'p'
  ) THEN
    ALTER TABLE public.registrations ADD PRIMARY KEY (submission_id);
  END IF;
EXCEPTION WHEN others THEN
  RAISE NOTICE 'Could not add primary key on submission_id: %', SQLERRM;
END
$$;

-- If this script prints a notice about failure, inspect duplicates with:
-- SELECT submission_id, count(*) FROM public.registrations GROUP BY submission_id HAVING count(*) > 1;
