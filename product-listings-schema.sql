
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

ALTER TABLE seller_locations ADD COLUMN IF NOT EXISTS is_sponsored BOOLEAN DEFAULT false;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS seller_id TEXT UNIQUE;

CREATE OR REPLACE FUNCTION generate_seller_id()
RETURNS TEXT AS $$
DECLARE
  new_id TEXT;
  id_exists BOOLEAN;
BEGIN
  LOOP
    new_id := 'S' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 7));
    
    SELECT EXISTS(SELECT 1 FROM profiles WHERE seller_id = new_id) INTO id_exists;
    
    IF NOT id_exists THEN
      RETURN new_id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_seller_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.seller_id IS NULL THEN
    NEW.seller_id := generate_seller_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_seller_id ON profiles;
CREATE TRIGGER trigger_set_seller_id
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_seller_id();

CREATE TABLE IF NOT EXISTS legacy_seller_map (
  legacy_id TEXT PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE legacy_seller_map ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view legacy seller mappings"
  ON legacy_seller_map
  FOR SELECT
  USING (true);

CREATE TABLE IF NOT EXISTS product_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  style_id TEXT, -- from Sneaks API or other shoe databases
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  colorway TEXT,
  images TEXT[],
  sizes JSONB NOT NULL, -- [{size: "10", price: 150}, ...]
  retail_price NUMERIC,
  release_date DATE,
  category TEXT,
  condition TEXT DEFAULT 'New',
  description TEXT,
  status TEXT DEFAULT 'active', -- active, sold, inactive
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE product_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active listings"
  ON product_listings
  FOR SELECT
  USING (status = 'active');

CREATE POLICY "Sellers can insert their own listings"
  ON product_listings
  FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own listings"
  ON product_listings
  FOR UPDATE
  USING (auth.uid() = seller_id)
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete their own listings"
  ON product_listings
  FOR DELETE
  USING (auth.uid() = seller_id);

CREATE OR REPLACE FUNCTION update_product_listing_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_product_listing_timestamp ON product_listings;
CREATE TRIGGER trigger_update_product_listing_timestamp
  BEFORE UPDATE ON product_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_product_listing_timestamp();

CREATE TABLE IF NOT EXISTS listing_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES product_listings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- nullable for anonymous views
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE listing_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view listing views"
  ON listing_views
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert listing views"
  ON listing_views
  FOR INSERT
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS listing_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES product_listings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(listing_id, user_id)
);

ALTER TABLE listing_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view favorites"
  ON listing_favorites
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own favorites"
  ON listing_favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON listing_favorites
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS listing_bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES product_listings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  bid_amount NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE listing_bids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view bids"
  ON listing_bids
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own bids"
  ON listing_bids
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS listing_raffle_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES product_listings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(listing_id, user_id)
);

ALTER TABLE listing_raffle_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view raffle entries"
  ON listing_raffle_entries
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own raffle entries"
  ON listing_raffle_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_product_listings_seller_id ON product_listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_product_listings_status ON product_listings(status);
CREATE INDEX IF NOT EXISTS idx_product_listings_style_id ON product_listings(style_id);
CREATE INDEX IF NOT EXISTS idx_listing_views_listing_id ON listing_views(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_views_viewed_at ON listing_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_listing_favorites_listing_id ON listing_favorites(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_bids_listing_id ON listing_bids(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_raffle_entries_listing_id ON listing_raffle_entries(listing_id);

CREATE OR REPLACE FUNCTION calculate_popularity_score(
  p_listing_id UUID,
  p_days_back INTEGER DEFAULT 7
)
RETURNS NUMERIC AS $$
DECLARE
  views_count INTEGER;
  favorites_count INTEGER;
  bids_count INTEGER;
  raffle_entries_count INTEGER;
  score NUMERIC;
BEGIN
  SELECT COUNT(*) INTO views_count
  FROM listing_views
  WHERE listing_id = p_listing_id
    AND viewed_at >= NOW() - (p_days_back || ' days')::INTERVAL;
  
  SELECT COUNT(*) INTO favorites_count
  FROM listing_favorites
  WHERE listing_id = p_listing_id
    AND created_at >= NOW() - (p_days_back || ' days')::INTERVAL;
  
  SELECT COUNT(*) INTO bids_count
  FROM listing_bids
  WHERE listing_id = p_listing_id
    AND created_at >= NOW() - (p_days_back || ' days')::INTERVAL;
  
  SELECT COUNT(*) INTO raffle_entries_count
  FROM listing_raffle_entries
  WHERE listing_id = p_listing_id
    AND created_at >= NOW() - (p_days_back || ' days')::INTERVAL;
  
  score := (views_count * 1) + (favorites_count * 2) + (bids_count * 3) + (raffle_entries_count * 2);
  
  RETURN score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE VIEW popular_listings AS
SELECT 
  pl.*,
  p.name as seller_name,
  p.seller_id as seller_display_id,
  p.rating as seller_rating,
  sl.zipcode,
  sl.lat,
  sl.lng,
  sl.is_sponsored,
  calculate_popularity_score(pl.id, 7) as popularity_score
FROM product_listings pl
JOIN profiles p ON pl.seller_id = p.id
LEFT JOIN seller_locations sl ON pl.seller_id = sl.user_id
WHERE pl.status = 'active'
  AND (sl.location_enabled = true OR sl.location_enabled IS NULL)
ORDER BY popularity_score DESC;

CREATE OR REPLACE FUNCTION get_top_listings_for_seller(
  p_seller_id UUID,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  brand TEXT,
  colorway TEXT,
  images TEXT[],
  sizes JSONB,
  retail_price NUMERIC,
  popularity_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pl.id,
    pl.name,
    pl.brand,
    pl.colorway,
    pl.images,
    pl.sizes,
    pl.retail_price,
    calculate_popularity_score(pl.id, 7) as popularity_score
  FROM product_listings pl
  WHERE pl.seller_id = p_seller_id
    AND pl.status = 'active'
  ORDER BY popularity_score DESC, pl.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_seller_inventory_counts()
RETURNS TABLE (
  seller_id UUID,
  inventory_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pl.seller_id,
    COUNT(*) as inventory_count
  FROM product_listings pl
  WHERE pl.status = 'active'
  GROUP BY pl.seller_id;
END;
$$ LANGUAGE plpgsql;
