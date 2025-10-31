-- Add indexes to improve query performance for analytics
-- Index on views column for sorting by most viewed
CREATE INDEX IF NOT EXISTS idx_products_views ON products(views DESC);
CREATE INDEX IF NOT EXISTS idx_houses_views ON houses(views DESC);
CREATE INDEX IF NOT EXISTS idx_services_views ON services(views DESC);

-- Index on likes column for sorting by most liked
CREATE INDEX IF NOT EXISTS idx_products_likes ON products(likes DESC);
CREATE INDEX IF NOT EXISTS idx_houses_likes ON houses(likes DESC);
CREATE INDEX IF NOT EXISTS idx_services_likes ON services(likes DESC);

-- Composite indexes for better performance on seller/landlord/provider queries
CREATE INDEX IF NOT EXISTS idx_products_seller_created ON products(seller_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_houses_landlord_created ON houses(landlord_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_services_provider_created ON services(provider_id, created_at DESC);