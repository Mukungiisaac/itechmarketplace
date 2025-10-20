-- Add likes column to products, houses, and services tables
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS likes integer NOT NULL DEFAULT 0;
ALTER TABLE public.houses ADD COLUMN IF NOT EXISTS likes integer NOT NULL DEFAULT 0;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS likes integer NOT NULL DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_likes ON public.products(likes);
CREATE INDEX IF NOT EXISTS idx_houses_likes ON public.houses(likes);
CREATE INDEX IF NOT EXISTS idx_services_likes ON public.services(likes);