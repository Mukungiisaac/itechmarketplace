-- Add index on provider_id for faster service queries
CREATE INDEX IF NOT EXISTS idx_services_provider_id ON public.services(provider_id);

-- Add index on category_id as well since we're joining
CREATE INDEX IF NOT EXISTS idx_services_category_id ON public.services(category_id);

-- Add composite index for the common query pattern
CREATE INDEX IF NOT EXISTS idx_services_provider_created ON public.services(provider_id, created_at DESC);