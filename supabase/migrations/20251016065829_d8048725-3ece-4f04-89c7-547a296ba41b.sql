-- Create table for contact/advertiser submissions
CREATE TABLE public.contact_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  phone_number text NOT NULL,
  what_to_advertise text NOT NULL,
  products_or_services text NOT NULL,
  additional_details text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'pending'
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can submit contact forms
CREATE POLICY "Anyone can submit contact forms"
ON public.contact_submissions
FOR INSERT
WITH CHECK (true);

-- Policy: Admins can view all submissions
CREATE POLICY "Admins can view all submissions"
ON public.contact_submissions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Admins can update submissions (e.g., change status)
CREATE POLICY "Admins can update submissions"
ON public.contact_submissions
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));