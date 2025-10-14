-- Add foreign key constraints with CASCADE DELETE for posts
-- This ensures when a user is deleted, their posts are also deleted

-- Add foreign key for houses table
ALTER TABLE public.houses
DROP CONSTRAINT IF EXISTS houses_landlord_id_fkey,
ADD CONSTRAINT houses_landlord_id_fkey 
  FOREIGN KEY (landlord_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Add foreign key for products table
ALTER TABLE public.products
DROP CONSTRAINT IF EXISTS products_seller_id_fkey,
ADD CONSTRAINT products_seller_id_fkey 
  FOREIGN KEY (seller_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Add foreign key for services table
ALTER TABLE public.services
DROP CONSTRAINT IF EXISTS services_provider_id_fkey,
ADD CONSTRAINT services_provider_id_fkey 
  FOREIGN KEY (provider_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Add RLS policy for admins to delete user roles
CREATE POLICY "Admins can delete user roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));