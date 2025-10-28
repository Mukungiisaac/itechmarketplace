-- Insert new service categories
INSERT INTO categories (name, description, sort_order) VALUES
  ('Tech & Digital Services', 'Software, web development, and digital solutions', 100),
  ('Academic Support', 'Tutoring, assignment help, and study resources', 101),
  ('Personal Care & Lifestyle', 'Beauty, wellness, and personal services', 102),
  ('Transport & Logistics', 'Delivery, moving, and transportation services', 103),
  ('Entertainment and Events', 'DJ services, event planning, and entertainment', 104),
  ('Wellness & Support', 'Mental health, counseling, and wellness services', 105),
  ('Financial Services', 'Money management, loans, and financial advice', 106),
  ('Creative & Innovation Services', 'Design, content creation, and innovation', 107)
ON CONFLICT DO NOTHING;