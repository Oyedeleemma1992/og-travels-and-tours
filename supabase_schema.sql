-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Vacation Packages Table
CREATE TABLE IF NOT EXISTS vacation_packages (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    image TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    overview TEXT,
    highlights TEXT[] DEFAULT '{}',
    inclusions TEXT[] DEFAULT '{}',
    exclusions TEXT[] DEFAULT '{}',
    price TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    image TEXT,
    date TEXT,
    author TEXT,
    category TEXT,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Customer Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name TEXT NOT NULL,
    text TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Flight Bookings Table
CREATE TABLE IF NOT EXISTS flight_bookings (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    departure TEXT,
    arrival TEXT,
    date TEXT,
    passengers INTEGER DEFAULT 1,
    class TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Hotel Reservations Table
CREATE TABLE IF NOT EXISTS hotel_reservations (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    destination TEXT,
    check_in TEXT,
    check_out TEXT,
    guests INTEGER DEFAULT 1,
    room_type TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Admission Enquiries Table
CREATE TABLE IF NOT EXISTS admission_enquiries (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    country_of_interest TEXT,
    program_of_interest TEXT,
    previous_education TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE vacation_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE flight_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admission_enquiries ENABLE ROW LEVEL SECURITY;

-- Policies for public reading (packages, blogs, reviews)
CREATE POLICY "Allow public read access on vacation_packages" ON vacation_packages FOR SELECT USING (true);
CREATE POLICY "Allow public read access on blog_posts" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Allow public read access on reviews" ON reviews FOR SELECT USING (true);

-- Policies for public inserting (enquiries, bookings, reviews)
CREATE POLICY "Allow public insert on reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on flight_bookings" ON flight_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on hotel_reservations" ON hotel_reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on admission_enquiries" ON admission_enquiries FOR INSERT WITH CHECK (true);

-- Admin policies (Assuming authenticated users are admins)
-- Note: In a production app, you might want an "is_admin" boolean or role-based check.
CREATE POLICY "Allow authenticated full access on vacation_packages" ON vacation_packages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access on blog_posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access on reviews" ON reviews FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access on flight_bookings" ON flight_bookings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access on hotel_reservations" ON hotel_reservations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access on admission_enquiries" ON admission_enquiries FOR ALL USING (auth.role() = 'authenticated');

-- Create a storage bucket for uploaded images
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update images" ON storage.objects FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete images" ON storage.objects FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
