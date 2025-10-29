-- Add/update categories that should be in services
INSERT INTO categories (name, description, sort_order) VALUES
  ('Health & Personal Care', 'Healthcare, wellness, and personal care services', 108),
  ('Transport & Mobility', 'Transportation, delivery, and mobility services', 109),
  ('Entertainment & Hobbies', 'Entertainment, events, and hobby-related services', 110),
  ('Repair and Maintenance', 'Repair, maintenance, and handyman services', 111),
  ('Campus Events', 'Campus events, announcements, and activities', 112)
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order;