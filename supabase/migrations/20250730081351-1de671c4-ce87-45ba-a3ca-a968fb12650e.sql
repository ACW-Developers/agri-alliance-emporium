-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart_items table
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(session_id, product_id)
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (ecommerce site)
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);

-- Cart policies for session-based access
CREATE POLICY "Cart items are viewable by session" ON public.cart_items FOR SELECT USING (true);
CREATE POLICY "Cart items can be inserted by anyone" ON public.cart_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Cart items can be updated by anyone" ON public.cart_items FOR UPDATE USING (true);
CREATE POLICY "Cart items can be deleted by anyone" ON public.cart_items FOR DELETE USING (true);

-- Order policies
CREATE POLICY "Orders can be created by anyone" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Orders are viewable by everyone" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Order items can be created by anyone" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Order items are viewable by everyone" ON public.order_items FOR SELECT USING (true);

-- Insert sample categories
INSERT INTO public.categories (name, description, image_url) VALUES
('Vegetables', 'Fresh local vegetables including African greens', '/placeholder.svg'),
('Fruits', 'Fresh seasonal fruits', '/placeholder.svg'),
('Grains', 'Locally grown grains and cereals', '/placeholder.svg'),
('Herbs & Spices', 'Traditional herbs and spices', '/placeholder.svg');

-- Insert sample products (African greens and other vegetables)
INSERT INTO public.products (category_id, name, description, price, image_url, stock_quantity) VALUES
((SELECT id FROM public.categories WHERE name = 'Vegetables'), 'Managu (African Nightshade)', 'Fresh organic Managu leaves, rich in vitamins and minerals', 2.50, '/placeholder.svg', 50),
((SELECT id FROM public.categories WHERE name = 'Vegetables'), 'Sukuma Wiki (Collard Greens)', 'Traditional leafy green vegetable, perfect for healthy meals', 2.00, '/placeholder.svg', 45),
((SELECT id FROM public.categories WHERE name = 'Vegetables'), 'Saga (Spider Plant)', 'Nutritious indigenous vegetable with unique flavor', 3.00, '/placeholder.svg', 30),
((SELECT id FROM public.categories WHERE name = 'Vegetables'), 'Sucha (Cowpea Leaves)', 'Young tender cowpea leaves, high in protein', 2.75, '/placeholder.svg', 35),
((SELECT id FROM public.categories WHERE name = 'Vegetables'), 'Kunde (Black-eyed Pea Leaves)', 'Fresh kunde leaves, traditional African vegetable', 2.25, '/placeholder.svg', 40),
((SELECT id FROM public.categories WHERE name = 'Vegetables'), 'Mrenda (Jute Mallow)', 'Slimy vegetable perfect for traditional dishes', 2.80, '/placeholder.svg', 25),
((SELECT id FROM public.categories WHERE name = 'Vegetables'), 'Terere (Amaranth)', 'Nutritious green leafy vegetable', 2.60, '/placeholder.svg', 38),
((SELECT id FROM public.categories WHERE name = 'Fruits'), 'Passion Fruit', 'Sweet and tangy tropical fruit', 5.00, '/placeholder.svg', 60),
((SELECT id FROM public.categories WHERE name = 'Fruits'), 'Avocado', 'Creamy and nutritious avocados', 4.50, '/placeholder.svg', 55),
((SELECT id FROM public.categories WHERE name = 'Grains'), 'Millet', 'Organic millet grains', 8.00, '/placeholder.svg', 20),
((SELECT id FROM public.categories WHERE name = 'Grains'), 'Sorghum', 'Traditional sorghum grains', 7.50, '/placeholder.svg', 18),
((SELECT id FROM public.categories WHERE name = 'Herbs & Spices'), 'Dhania (Coriander)', 'Fresh coriander leaves', 1.50, '/placeholder.svg', 70),
((SELECT id FROM public.categories WHERE name = 'Herbs & Spices'), 'Mint', 'Fresh mint leaves', 1.75, '/placeholder.svg', 65);