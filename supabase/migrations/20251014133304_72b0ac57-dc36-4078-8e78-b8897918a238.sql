-- Add promoted column to user_roles table
ALTER TABLE public.user_roles
ADD COLUMN promoted boolean DEFAULT false;

-- Add promoted_at and promoted_by columns for audit trail
ALTER TABLE public.user_roles
ADD COLUMN promoted_at timestamp with time zone,
ADD COLUMN promoted_by uuid REFERENCES auth.users(id);