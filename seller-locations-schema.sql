ALTER TABLE profiles ADD COLUMN IF NOT EXISTS rating NUMERIC CHECK (rating >= 0 AND rating <= 5);

CREATE TABLE IF NOT EXISTS seller_locations (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  zipcode TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  location_enabled BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE seller_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view enabled seller locations"
  ON seller_locations
  FOR SELECT
  USING (location_enabled = true);

CREATE POLICY "Owner can insert their location"
  ON seller_locations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner can update their location"
  ON seller_locations
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner can delete their location"
  ON seller_locations
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION handle_seller_location_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_seller_locations_updated_at ON seller_locations;
CREATE TRIGGER set_seller_locations_updated_at
  BEFORE UPDATE ON seller_locations
  FOR EACH ROW
  EXECUTE FUNCTION handle_seller_location_updated_at();
