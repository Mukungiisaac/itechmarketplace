-- Add foreign key constraints to profiles table instead of auth.users
-- This allows PostgREST to join with profiles table for embedded resources

-- Update products table
ALTER TABLE public.products
DROP CONSTRAINT IF EXISTS products_seller_id_fkey;

ALTER TABLE public.products
ADD CONSTRAINT products_seller_id_fkey 
  FOREIGN KEY (seller_id) 
  REFERENCES public.profiles(id) 
  ON DELETE CASCADE;

-- Update houses table
ALTER TABLE public.houses
DROP CONSTRAINT IF EXISTS houses_landlord_id_fkey;

ALTER TABLE public.houses
ADD CONSTRAINT houses_landlord_id_fkey 
  FOREIGN KEY (landlord_id) 
  REFERENCES public.profiles(id) 
  ON DELETE CASCADE;

-- Update services table
ALTER TABLE public.services
DROP CONSTRAINT IF EXISTS services_provider_id_fkey;

ALTER TABLE public.services
ADD CONSTRAINT services_provider_id_fkey 
  FOREIGN KEY (provider_id) 
  REFERENCES public.profiles(id) 
  ON DELETE CASCADE;