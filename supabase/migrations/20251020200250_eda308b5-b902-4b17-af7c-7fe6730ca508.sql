-- Change price columns to text to support ranges like "300-400"
ALTER TABLE products ALTER COLUMN price TYPE text USING price::text;
ALTER TABLE services ALTER COLUMN price TYPE text USING price::text;
ALTER TABLE houses ALTER COLUMN rent TYPE text USING rent::text;
ALTER TABLE houses ALTER COLUMN deposit TYPE text USING deposit::text;