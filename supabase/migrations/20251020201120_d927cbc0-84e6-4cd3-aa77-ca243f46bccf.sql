-- Add views column to products table
ALTER TABLE public.products
ADD COLUMN views integer NOT NULL DEFAULT 0;

-- Add views column to houses table
ALTER TABLE public.houses
ADD COLUMN views integer NOT NULL DEFAULT 0;

-- Add views column to services table
ALTER TABLE public.services
ADD COLUMN views integer NOT NULL DEFAULT 0;

-- Create index for better performance when querying by views
CREATE INDEX idx_products_views ON public.products(views DESC);
CREATE INDEX idx_houses_views ON public.houses(views DESC);
CREATE INDEX idx_services_views ON public.services(views DESC);