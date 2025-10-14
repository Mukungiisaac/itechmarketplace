-- Allow anyone to view public profile information (needed for displaying seller/landlord/provider contact info)
CREATE POLICY "Anyone can view public profiles"
ON public.profiles
FOR SELECT
USING (true);