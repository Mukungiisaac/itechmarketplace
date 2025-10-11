-- Add approval status to user_roles table
ALTER TABLE public.user_roles 
ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id);

-- Create function to check if user is approved
CREATE OR REPLACE FUNCTION public.is_approved(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND approved = true
  )
$$;

-- Update products RLS policy to require approval
DROP POLICY IF EXISTS "Sellers can insert their own products" ON public.products;
CREATE POLICY "Approved sellers can insert products"
ON public.products
FOR INSERT
WITH CHECK (
  auth.uid() = seller_id 
  AND public.is_approved(auth.uid())
);

DROP POLICY IF EXISTS "Sellers can update their own products" ON public.products;
CREATE POLICY "Approved sellers can update products"
ON public.products
FOR UPDATE
USING (
  auth.uid() = seller_id 
  AND public.is_approved(auth.uid())
);

DROP POLICY IF EXISTS "Sellers can delete their own products" ON public.products;
CREATE POLICY "Approved sellers can delete products"
ON public.products
FOR DELETE
USING (
  auth.uid() = seller_id 
  AND public.is_approved(auth.uid())
);

-- Create RLS policies for admin to manage user_roles
CREATE POLICY "Admins can view all user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update user roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create admin user auto-approval trigger
CREATE OR REPLACE FUNCTION public.handle_admin_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if this is the admin email
  IF NEW.email = 'itechstudio@gmail.com' THEN
    -- Update the user_roles to set admin as approved
    UPDATE public.user_roles
    SET approved = true, approved_at = NOW()
    WHERE user_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_admin
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_admin_user();