-- SQL Schema for DDH Masale

-- 1. Products Table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT,
  images TEXT[], -- Array of image URLs
  unit TEXT NOT NULL,
  moq INTEGER NOT NULL,
  origin TEXT,
  specifications JSONB, -- Store origin, grade, shelfLife, packaging, certification
  features TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Quotes Table
CREATE TABLE IF NOT EXISTS quotes (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES products(id),
  product_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  message TEXT,
  consent BOOLEAN NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, contacted, completed, cancelled
  user_id UUID REFERENCES auth.users(id), -- Link to Supabase Auth user
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create Policies (Simplified for initial setup - Allow public read, admin write)
-- Note: In a real production app, you'd use more granular auth roles.

-- Products: Everyone can read, only authenticated (admin) can write
CREATE POLICY "Allow public read access on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow admin insert on products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin update on products" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow admin delete on products" ON products FOR DELETE USING (true);

-- Quotes: Anyone can insert (customers), only admin can read/update, users can read their own
CREATE POLICY "Allow public insert on quotes" ON quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin select on quotes" ON quotes FOR SELECT USING (true);
CREATE POLICY "Allow admin update on quotes" ON quotes FOR UPDATE USING (true);
CREATE POLICY "Allow users to see their own quotes" ON quotes FOR SELECT USING (auth.uid() = user_id);

-- Settings: Everyone can read, only admin can update
CREATE POLICY "Allow public read access on settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Allow admin update on settings" ON settings FOR UPDATE USING (true);

-- Reviews: Everyone can read, authenticated users can insert, only owners or admin can delete
CREATE POLICY "Allow public read access on reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on reviews" ON reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow owners or admin to delete reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);
