# Image and RLS Issues - Fixes Required

## Issues Identified

### 1. Profiles RLS Blocking Anonymous Access
**Problem:** The `profiles` table has a restrictive RLS policy that only allows users to view their own profile:
```sql
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
```

This prevents the `popular_listings` view from working for anonymous users because it joins the profiles table to get seller names and ratings.

**Impact:** 
- The `SponsoredProducts` component query will fail silently for anonymous users
- The app falls back to JSON data from `getHomeSectionsWithRealData()`
- Map components may also fail to show seller information

**Fix:** Run `fix-profiles-rls.sql` in Supabase SQL Editor to add a public read policy:
```sql
CREATE POLICY "Public can view seller profiles" ON profiles
  FOR SELECT TO anon, authenticated
  USING (true);
```

### 2. Missing Image Files
**Problem:** 
- The `public/images/` directory doesn't exist
- Products reference image paths like `/images/aj1-chicago-1.jpg` that don't exist
- The fallback placeholder `/placeholder-shoe.jpg` also doesn't exist

**Impact:**
- All shoe images will show as broken/missing
- Next.js Image component will show error placeholders

**Solutions:**

#### Option A: Create Placeholder Images (Quick Fix)
1. Create placeholder images in `public/images/` directory
2. Create `public/placeholder-shoe.jpg` for fallback
3. This allows the UI to render without broken images

#### Option B: Integrate Sneaks API for Real Images (Proper Solution)
1. Use the existing `sneaks-api` service to fetch real shoe images
2. During seeding/migration, enrich product_listings with real image URLs
3. Update `next.config.ts` to allow remote image domains:
```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**.stockx.com',
    },
    {
      protocol: 'https',
      hostname: '**.goat.com',
    },
    // Add other domains as needed
  ],
}
```

#### Option C: Both (Recommended)
- Implement Option A immediately for fallback safety
- Implement Option B as the proper long-term solution

## Verification Steps

### Check if Database is Set Up
1. Go to Supabase SQL Editor
2. Run: `SELECT COUNT(*) FROM product_listings;`
3. If returns 0 or error, the migration hasn't been run yet

### Check if RLS is Blocking
1. In Supabase SQL Editor, run:
```sql
SELECT * FROM popular_listings WHERE is_sponsored = true LIMIT 1;
```
2. If this returns data, RLS is working
3. If error or no data, run `fix-profiles-rls.sql`

### Check Image Rendering
1. Open browser dev tools Network tab
2. Navigate to explore page
3. Look for 404 errors on `/images/*` or `/_next/image/*`
4. If seeing 404s, images need to be added

## Next Steps

1. **Immediate:** Run `fix-profiles-rls.sql` in Supabase
2. **Short-term:** Create placeholder images or use sneaks-api
3. **Verify:** Test that sponsored products load from database
4. **Long-term:** Enrich all product listings with real images from sneaks-api
