-- Allow anyone to view which users are promoted (read-only access to promoted status)
CREATE POLICY "Anyone can view promoted users" 
ON public.user_roles 
FOR SELECT 
USING (promoted = true);