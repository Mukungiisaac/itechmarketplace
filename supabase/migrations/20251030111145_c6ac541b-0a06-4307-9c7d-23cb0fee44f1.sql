-- Add new categories
INSERT INTO categories (name, description, sort_order) VALUES
  ('Snacks', 'Snacks, quick bites, and food items', 20),
  ('Restaurant', 'Restaurant services, catering, and food services', 113),
  ('Other Products', 'Other products not listed in categories', 999),
  ('Other Services', 'Other services not listed in categories', 1000)
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order;