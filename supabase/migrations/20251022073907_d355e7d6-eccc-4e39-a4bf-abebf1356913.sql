-- Remove the old category column from services table since we now use category_id
ALTER TABLE public.services DROP COLUMN IF EXISTS category;