-- Add new roles to the enum
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'landlord';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'service_provider';

-- Create houses table for landlords
CREATE TABLE public.houses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  landlord_id UUID NOT NULL,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  distance NUMERIC NOT NULL,
  rent NUMERIC NOT NULL,
  deposit NUMERIC NOT NULL,
  house_type TEXT NOT NULL,
  water TEXT NOT NULL,
  wifi TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create services table for service providers
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  contact_number TEXT NOT NULL,
  availability TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- RLS policies for houses
CREATE POLICY "Anyone can view houses"
  ON public.houses
  FOR SELECT
  USING (true);

CREATE POLICY "Approved landlords can insert houses"
  ON public.houses
  FOR INSERT
  WITH CHECK (auth.uid() = landlord_id AND is_approved(auth.uid()));

CREATE POLICY "Approved landlords can update their houses"
  ON public.houses
  FOR UPDATE
  USING (auth.uid() = landlord_id AND is_approved(auth.uid()));

CREATE POLICY "Approved landlords can delete their houses"
  ON public.houses
  FOR DELETE
  USING (auth.uid() = landlord_id AND is_approved(auth.uid()));

-- RLS policies for services
CREATE POLICY "Anyone can view services"
  ON public.services
  FOR SELECT
  USING (true);

CREATE POLICY "Approved service providers can insert services"
  ON public.services
  FOR INSERT
  WITH CHECK (auth.uid() = provider_id AND is_approved(auth.uid()));

CREATE POLICY "Approved service providers can update their services"
  ON public.services
  FOR UPDATE
  USING (auth.uid() = provider_id AND is_approved(auth.uid()));

CREATE POLICY "Approved service providers can delete their services"
  ON public.services
  FOR DELETE
  USING (auth.uid() = provider_id AND is_approved(auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_houses_updated_at
  BEFORE UPDATE ON public.houses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();