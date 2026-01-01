-- JC Invest Database Schema
-- Run this in your Supabase SQL Editor

-- =====================================================
-- PROPERTIES TABLE
-- Stores property listings and their details
-- =====================================================
CREATE TABLE IF NOT EXISTS properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic info
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT,
    property_type TEXT DEFAULT 'Leilighet', -- Leilighet, Enebolig, Rekkehus, etc.
    
    -- Size and rooms
    sqm INTEGER,
    bedrooms INTEGER,
    bathrooms INTEGER,
    floor INTEGER,
    build_year INTEGER,
    
    -- Pricing
    purchase_price BIGINT,
    current_value BIGINT,
    price_per_sqm INTEGER,
    
    -- Rental info
    monthly_rent INTEGER,
    is_rented BOOLEAN DEFAULT false,
    tenant_name TEXT,
    lease_end_date DATE,
    
    -- Status
    status TEXT DEFAULT 'active', -- active, sold, watching
    is_sold BOOLEAN DEFAULT false,
    sold_date DATE,
    sold_price BIGINT,
    
    -- Scores (1-10)
    score_location DECIMAL(3,1),
    score_standard DECIMAL(3,1),
    score_layout DECIMAL(3,1),
    score_view DECIMAL(3,1),
    
    -- Media
    image_url TEXT,
    finn_url TEXT,
    
    -- Metadata
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- WATCHLISTS TABLE
-- User-created lists for tracking properties
-- =====================================================
CREATE TABLE IF NOT EXISTS watchlists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    is_premium BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- WATCHLIST_ITEMS TABLE
-- Junction table linking properties to watchlists
-- =====================================================
CREATE TABLE IF NOT EXISTS watchlist_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    watchlist_id UUID REFERENCES watchlists(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    
    notes TEXT,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(watchlist_id, property_id)
);

-- =====================================================
-- WATCHLIST_FOLLOWERS TABLE
-- Tracks who follows which public watchlists
-- =====================================================
CREATE TABLE IF NOT EXISTS watchlist_followers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    watchlist_id UUID REFERENCES watchlists(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    followed_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(watchlist_id, user_id)
);

-- =====================================================
-- NOTIFICATIONS TABLE
-- User notifications for property updates
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    type TEXT NOT NULL, -- new_listing, sold, price_change, inactive, transaction
    title TEXT NOT NULL,
    message TEXT,
    
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    property_address TEXT,
    
    old_price BIGINT,
    new_price BIGINT,
    
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SAVED_CALCULATIONS TABLE
-- Stores saved rental calculator settings
-- =====================================================
CREATE TABLE IF NOT EXISTS saved_calculations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    
    name TEXT NOT NULL,
    
    -- Calculator inputs
    purchase_price BIGINT,
    down_payment_percent DECIMAL(5,2),
    interest_rate DECIMAL(5,2),
    loan_term_years INTEGER,
    monthly_rent INTEGER,
    monthly_common_costs INTEGER,
    monthly_maintenance INTEGER,
    annual_insurance INTEGER,
    vacancy_rate_percent DECIMAL(5,2),
    internet_tv INTEGER,
    tax_rate DECIMAL(5,2),
    
    -- Calculated results (cached)
    gross_yield DECIMAL(5,2),
    net_yield DECIMAL(5,2),
    cash_on_cash DECIMAL(5,2),
    monthly_cash_flow INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES for performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_watchlists_user_id ON watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_items_watchlist_id ON watchlist_items(watchlist_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_calculations ENABLE ROW LEVEL SECURITY;

-- Properties: Users can only see their own properties
CREATE POLICY "Users can view own properties" ON properties
    FOR SELECT USING (auth.uid() = user_id);
    
CREATE POLICY "Users can insert own properties" ON properties
    FOR INSERT WITH CHECK (auth.uid() = user_id);
    
CREATE POLICY "Users can update own properties" ON properties
    FOR UPDATE USING (auth.uid() = user_id);
    
CREATE POLICY "Users can delete own properties" ON properties
    FOR DELETE USING (auth.uid() = user_id);

-- Watchlists: Users can see own + public watchlists
CREATE POLICY "Users can view own or public watchlists" ON watchlists
    FOR SELECT USING (auth.uid() = user_id OR is_public = true);
    
CREATE POLICY "Users can insert own watchlists" ON watchlists
    FOR INSERT WITH CHECK (auth.uid() = user_id);
    
CREATE POLICY "Users can update own watchlists" ON watchlists
    FOR UPDATE USING (auth.uid() = user_id);
    
CREATE POLICY "Users can delete own watchlists" ON watchlists
    FOR DELETE USING (auth.uid() = user_id);

-- Watchlist items: Users can manage items in their own watchlists
CREATE POLICY "Users can view watchlist items" ON watchlist_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM watchlists 
            WHERE id = watchlist_items.watchlist_id 
            AND (user_id = auth.uid() OR is_public = true)
        )
    );

CREATE POLICY "Users can insert watchlist items" ON watchlist_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM watchlists 
            WHERE id = watchlist_items.watchlist_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete watchlist items" ON watchlist_items
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM watchlists 
            WHERE id = watchlist_items.watchlist_id 
            AND user_id = auth.uid()
        )
    );

-- Notifications: Users can only see their own
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);
    
CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);
    
CREATE POLICY "Users can delete own notifications" ON notifications
    FOR DELETE USING (auth.uid() = user_id);

-- Saved calculations: Users can only manage their own
CREATE POLICY "Users can view own calculations" ON saved_calculations
    FOR SELECT USING (auth.uid() = user_id);
    
CREATE POLICY "Users can insert own calculations" ON saved_calculations
    FOR INSERT WITH CHECK (auth.uid() = user_id);
    
CREATE POLICY "Users can update own calculations" ON saved_calculations
    FOR UPDATE USING (auth.uid() = user_id);
    
CREATE POLICY "Users can delete own calculations" ON saved_calculations
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- UPDATED_AT TRIGGER
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_watchlists_updated_at
    BEFORE UPDATE ON watchlists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_calculations_updated_at
    BEFORE UPDATE ON saved_calculations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
