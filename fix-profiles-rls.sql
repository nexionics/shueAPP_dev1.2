
CREATE POLICY "Public can view seller profiles" ON profiles
  FOR SELECT TO anon, authenticated
  USING (true);
