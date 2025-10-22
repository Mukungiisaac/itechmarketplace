-- Create categories table
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  icon text,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create subcategories table
CREATE TABLE public.subcategories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(category_id, name)
);

-- Add category and subcategory columns to existing tables
ALTER TABLE public.products ADD COLUMN category_id uuid REFERENCES public.categories(id);
ALTER TABLE public.products ADD COLUMN subcategory_id uuid REFERENCES public.subcategories(id);

ALTER TABLE public.services ADD COLUMN category_id uuid REFERENCES public.categories(id);
ALTER TABLE public.services ADD COLUMN subcategory_id uuid REFERENCES public.subcategories(id);

ALTER TABLE public.houses ADD COLUMN category_id uuid REFERENCES public.categories(id);
ALTER TABLE public.houses ADD COLUMN subcategory_id uuid REFERENCES public.subcategories(id);

-- Enable RLS on new tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

-- Create policies for categories (public read)
CREATE POLICY "Anyone can view categories"
ON public.categories FOR SELECT
USING (true);

CREATE POLICY "Anyone can view subcategories"
ON public.subcategories FOR SELECT
USING (true);

-- Insert main categories
INSERT INTO public.categories (name, description, sort_order) VALUES
('Electronics & Gadgets', 'Phones, laptops, and tech accessories for students', 1),
('Fashion & Apparel', 'Clothing, shoes, bags, and campus wear', 2),
('Food & Drinks', 'Meals, snacks, and beverages', 3),
('Hostels & Accommodation', 'Housing listings and roommate search', 4),
('Services', 'Student services and skills', 5),
('Books & Stationery', 'Textbooks and school supplies', 6),
('Furniture & Home Items', 'Dorm and hostel essentials', 7),
('Health & Personal Care', 'Toiletries, skincare, and fitness', 8),
('Transport & Mobility', 'Bikes, cars, and delivery services', 9),
('Entertainment & Hobbies', 'Gaming, music, and art', 10),
('Deals & Campus Hustles', 'Second-hand items and special offers', 11),
('Repair & Maintenance', 'Fix and repair services', 12),
('Baby & Family Essentials', 'Baby care and family items', 13),
('Campus Events & Ads', 'Events, clubs, and announcements', 14);

-- Insert subcategories for Electronics & Gadgets
INSERT INTO public.subcategories (category_id, name, sort_order)
SELECT c.id, s.subcategory, s.sort_order 
FROM public.categories c, 
(VALUES 
  ('Phones & Tablets', 1),
  ('Laptops & Accessories', 2),
  ('Headphones & Speakers', 3),
  ('Smartwatches', 4),
  ('Chargers & Powerbanks', 5),
  ('Printers & Scanners', 6)
) AS s(subcategory, sort_order)
WHERE c.name = 'Electronics & Gadgets';

-- Insert subcategories for Fashion & Apparel
INSERT INTO public.subcategories (category_id, name, sort_order)
SELECT c.id, s.subcategory, s.sort_order 
FROM public.categories c,
(VALUES
  ('Men''s Clothing', 1),
  ('Women''s Clothing', 2),
  ('Shoes & Sneakers', 3),
  ('Bags & Backpacks', 4),
  ('Watches & Jewelry', 5),
  ('Campus Wear', 6)
) AS s(subcategory, sort_order)
WHERE c.name = 'Fashion & Apparel';

-- Insert subcategories for Food & Drinks
INSERT INTO public.subcategories (category_id, name, sort_order)
SELECT c.id, s.subcategory, s.sort_order 
FROM public.categories c,
(VALUES
  ('Ready Meals', 1),
  ('Snacks & Drinks', 2),
  ('Home-Cooked Meals', 3),
  ('Groceries', 4),
  ('Water & Beverages', 5),
  ('Delivery Services', 6)
) AS s(subcategory, sort_order)
WHERE c.name = 'Food & Drinks';

-- Insert subcategories for Hostels & Accommodation
INSERT INTO public.subcategories (category_id, name, sort_order)
SELECT c.id, s.subcategory, s.sort_order 
FROM public.categories c,
(VALUES
  ('Hostel Listings', 1),
  ('Roommate Search', 2),
  ('Short-term Rentals', 3),
  ('Furniture & Bedding', 4)
) AS s(subcategory, sort_order)
WHERE c.name = 'Hostels & Accommodation';

-- Insert subcategories for Services
INSERT INTO public.subcategories (category_id, name, sort_order)
SELECT c.id, s.subcategory, s.sort_order 
FROM public.categories c,
(VALUES
  ('Printing & Photocopy', 1),
  ('Graphic Design', 2),
  ('Web Development', 3),
  ('Photography & Video', 4),
  ('Hairdressing & Beauty', 5),
  ('Laundry & Cleaning', 6),
  ('Academic Writing & Typing', 7),
  ('Tutoring Services', 8)
) AS s(subcategory, sort_order)
WHERE c.name = 'Services';

-- Insert subcategories for Books & Stationery
INSERT INTO public.subcategories (category_id, name, sort_order)
SELECT c.id, s.subcategory, s.sort_order 
FROM public.categories c,
(VALUES
  ('Textbooks', 1),
  ('Notebooks & Files', 2),
  ('Pens & Calculators', 3),
  ('Art & Design Supplies', 4),
  ('Printing Papers', 5)
) AS s(subcategory, sort_order)
WHERE c.name = 'Books & Stationery';

-- Insert subcategories for Furniture & Home Items
INSERT INTO public.subcategories (category_id, name, sort_order)
SELECT c.id, s.subcategory, s.sort_order 
FROM public.categories c,
(VALUES
  ('Chairs, Tables, Desks', 1),
  ('Mattresses & Beddings', 2),
  ('Kitchenware & Utensils', 3),
  ('Curtains & Décor', 4)
) AS s(subcategory, sort_order)
WHERE c.name = 'Furniture & Home Items';

-- Insert subcategories for Health & Personal Care
INSERT INTO public.subcategories (category_id, name, sort_order)
SELECT c.id, s.subcategory, s.sort_order 
FROM public.categories c,
(VALUES
  ('Toiletries', 1),
  ('Skincare & Cosmetics', 2),
  ('Sanitary Products', 3),
  ('Medicine & First Aid', 4),
  ('Fitness & Gym Gear', 5)
) AS s(subcategory, sort_order)
WHERE c.name = 'Health & Personal Care';

-- Insert subcategories for Transport & Mobility
INSERT INTO public.subcategories (category_id, name, sort_order)
SELECT c.id, s.subcategory, s.sort_order 
FROM public.categories c,
(VALUES
  ('Bicycles & Scooters', 1),
  ('Motorbikes', 2),
  ('Car Rentals', 3),
  ('Delivery & Errand Services', 4)
) AS s(subcategory, sort_order)
WHERE c.name = 'Transport & Mobility';

-- Insert subcategories for Entertainment & Hobbies
INSERT INTO public.subcategories (category_id, name, sort_order)
SELECT c.id, s.subcategory, s.sort_order 
FROM public.categories c,
(VALUES
  ('Gaming & Consoles', 1),
  ('Musical Instruments', 2),
  ('Movies, Series & Books', 3),
  ('Art & Crafts', 4),
  ('Event Tickets', 5)
) AS s(subcategory, sort_order)
WHERE c.name = 'Entertainment & Hobbies';

-- Insert subcategories for Deals & Campus Hustles
INSERT INTO public.subcategories (category_id, name, sort_order)
SELECT c.id, s.subcategory, s.sort_order 
FROM public.categories c,
(VALUES
  ('Second-hand Items', 1),
  ('Limited Offers', 2),
  ('Clearance Sales', 3),
  ('Student-to-Student Deals', 4)
) AS s(subcategory, sort_order)
WHERE c.name = 'Deals & Campus Hustles';

-- Insert subcategories for Repair & Maintenance
INSERT INTO public.subcategories (category_id, name, sort_order)
SELECT c.id, s.subcategory, s.sort_order 
FROM public.categories c,
(VALUES
  ('Phone Repair', 1),
  ('Laptop Repair', 2),
  ('Electricals & Plumbing', 3),
  ('Tailoring & Fixing', 4)
) AS s(subcategory, sort_order)
WHERE c.name = 'Repair & Maintenance';

-- Insert subcategories for Baby & Family Essentials
INSERT INTO public.subcategories (category_id, name, sort_order)
SELECT c.id, s.subcategory, s.sort_order 
FROM public.categories c,
(VALUES
  ('Baby Clothes', 1),
  ('Toys & Supplies', 2),
  ('Diapers & Care Items', 3)
) AS s(subcategory, sort_order)
WHERE c.name = 'Baby & Family Essentials';

-- Insert subcategories for Campus Events & Ads
INSERT INTO public.subcategories (category_id, name, sort_order)
SELECT c.id, s.subcategory, s.sort_order 
FROM public.categories c,
(VALUES
  ('Upcoming Events', 1),
  ('Student Clubs', 2),
  ('Campaigns & Promotions', 3),
  ('Announcements', 4)
) AS s(subcategory, sort_order)
WHERE c.name = 'Campus Events & Ads';