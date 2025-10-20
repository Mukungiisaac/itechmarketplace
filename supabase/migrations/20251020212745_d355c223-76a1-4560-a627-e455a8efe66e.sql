-- Enable realtime for products, houses, and services tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.houses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.services;