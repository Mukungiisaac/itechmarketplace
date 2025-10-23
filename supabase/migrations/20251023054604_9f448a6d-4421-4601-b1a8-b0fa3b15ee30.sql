-- Remove subcategory columns from all tables
ALTER TABLE public.houses DROP COLUMN IF EXISTS subcategory_id;
ALTER TABLE public.products DROP COLUMN IF EXISTS subcategory_id;
ALTER TABLE public.services DROP COLUMN IF EXISTS subcategory_id;

-- Drop the subcategories table
DROP TABLE IF EXISTS public.subcategories;