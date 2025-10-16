-- Update the admin email check function
CREATE OR REPLACE FUNCTION public.handle_admin_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if this is the admin email (updated to new email)
  IF NEW.email = 'itechstudios86@gmail.com' THEN
    -- Update the user_roles to set admin as approved
    UPDATE public.user_roles
    SET approved = true, approved_at = NOW()
    WHERE user_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$function$;