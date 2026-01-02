-- Market Properties Table
-- For storing scraped/collected property data from the market
-- Run this in Supabase SQL Editor AFTER the main schema.sql

-- =====================================================
-- MARKET PROPERTIES TABLE
-- Stores properties scraped from Finn.no and other sources
-- =====================================================
CREATE TABLE IF NOT EXISTS market_properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- External identifiers
    finncode TEXT UNIQUE,
    source TEXT DEFAULT 'finn.no',
    
    -- Basic info
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT,
    property_type TEXT DEFAULT 'Leilighet',
    
    -- Size and rooms
    sqm INTEGER,
    bedrooms INTEGER,
    bathrooms INTEGER,
    floor INTEGER,
    build_year INTEGER,
    
    -- Pricing
    price BIGINT,
    price_per_sqm INTEGER,
    
    -- Status
    status TEXT DEFAULT 'active', -- active, sold, inactive
    is_sold BOOLEAN DEFAULT false,
    sold_date DATE,
    sold_price BIGINT,
    
    -- Media
    image_url TEXT,
    finn_url TEXT,
    
    -- Scraping metadata
    scraped_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    published_date DATE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- COMPARABLE SALES TABLE
-- For tracking recent sales in specific areas
-- =====================================================
CREATE TABLE IF NOT EXISTS comparable_sales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- External identifiers
    finncode TEXT,
    source TEXT DEFAULT 'finn.no',
    
    -- Location
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT,
    area_name TEXT, -- e.g., "Grünerløkka", "Frogner"
    
    -- Property details
    property_type TEXT DEFAULT 'Leilighet',
    sqm INTEGER,
    bedrooms INTEGER,
    floor INTEGER,
    build_year INTEGER,
    
    -- Sale info
    sold_price BIGINT NOT NULL,
    price_per_sqm INTEGER,
    sold_date DATE NOT NULL,
    
    -- Condition
    condition TEXT, -- 'Møblert', 'Umøblert', 'Delvis møblert'
    
    -- Media
    image_url TEXT,
    finn_url TEXT,
    
    -- Metadata
    scraped_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- RENTAL LISTINGS TABLE
-- For tracking rental market prices
-- =====================================================
CREATE TABLE IF NOT EXISTS rental_listings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    finncode TEXT UNIQUE,
    source TEXT DEFAULT 'finn.no',
    
    -- Location
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT,
    area_name TEXT,
    
    -- Property details
    property_type TEXT DEFAULT 'Leilighet',
    sqm INTEGER,
    bedrooms INTEGER,
    
    -- Rental info
    monthly_rent INTEGER NOT NULL,
    rent_per_sqm INTEGER,
    is_furnished BOOLEAN DEFAULT false,
    
    -- Media
    image_url TEXT,
    finn_url TEXT,
    
    -- Status
    status TEXT DEFAULT 'active',
    
    -- Metadata
    scraped_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- AREA STATISTICS TABLE
-- Aggregated stats per area for map analysis
-- =====================================================
CREATE TABLE IF NOT EXISTS area_statistics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    city TEXT NOT NULL,
    area_name TEXT NOT NULL,
    postal_code TEXT,
    
    -- Sale stats
    avg_price_per_sqm INTEGER,
    median_price_per_sqm INTEGER,
    total_sales_count INTEGER DEFAULT 0,
    
    -- By property type
    avg_price_leilighet INTEGER,
    avg_price_enebolig INTEGER,
    avg_price_rekkehus INTEGER,
    
    -- By bedrooms
    avg_price_1_room INTEGER,
    avg_price_2_room INTEGER,
    avg_price_3_room INTEGER,
    avg_price_4plus_room INTEGER,
    
    -- Rental stats
    avg_rent_per_sqm INTEGER,
    avg_rent_furnished INTEGER,
    avg_rent_unfurnished INTEGER,
    total_rentals_count INTEGER DEFAULT 0,
    
    -- Time period
    period_start DATE,
    period_end DATE,
    
    -- Metadata
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(city, area_name, period_start, period_end)
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_market_properties_city ON market_properties(city);
CREATE INDEX IF NOT EXISTS idx_market_properties_finncode ON market_properties(finncode);
CREATE INDEX IF NOT EXISTS idx_market_properties_price ON market_properties(price);
CREATE INDEX IF NOT EXISTS idx_comparable_sales_city ON comparable_sales(city);
CREATE INDEX IF NOT EXISTS idx_comparable_sales_area ON comparable_sales(area_name);
CREATE INDEX IF NOT EXISTS idx_comparable_sales_sold_date ON comparable_sales(sold_date);
CREATE INDEX IF NOT EXISTS idx_rental_listings_city ON rental_listings(city);
CREATE INDEX IF NOT EXISTS idx_area_statistics_city ON area_statistics(city, area_name);

-- =====================================================
-- PUBLIC ACCESS FOR MARKET DATA
-- These tables can be read by anyone (no auth required)
-- =====================================================
ALTER TABLE market_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparable_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE area_statistics ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY "Authenticated users can view market properties" ON market_properties
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view comparable sales" ON comparable_sales
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view rental listings" ON rental_listings
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view area statistics" ON area_statistics
    FOR SELECT TO authenticated USING (true);

-- Allow service role (n8n) to insert/update
CREATE POLICY "Service role can manage market properties" ON market_properties
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role can manage comparable sales" ON comparable_sales
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role can manage rental listings" ON rental_listings
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role can manage area statistics" ON area_statistics
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =====================================================
-- UPDATED_AT TRIGGERS
-- =====================================================
CREATE TRIGGER update_market_properties_updated_at
    BEFORE UPDATE ON market_properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_area_statistics_updated_at
    BEFORE UPDATE ON area_statistics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
