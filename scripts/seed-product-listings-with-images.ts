/**
 * Enhanced migration script to seed product_listings with real images from sneaks-api
 * 
 * This script:
 * 1. Creates test user accounts for legacy sellers (1-6)
 * 2. Maps legacy seller IDs to Supabase profile UUIDs
 * 3. Fetches real shoe images from sneaks-api
 * 4. Migrates products from JSON to product_listings table with real images
 * 
 * Run with: npx tsx scripts/seed-product-listings-with-images.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'
import productsData from '../data/products.json'
import { sneaksService } from '../src/lib/sneaks-service'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const testSellers = [
  { legacyId: '1', email: 'seller1@test.shueapp.com', name: 'Jordan Collector', password: 'TestPass123!' },
  { legacyId: '2', email: 'seller2@test.shueapp.com', name: 'Nike Enthusiast', password: 'TestPass123!' },
  { legacyId: '3', email: 'seller3@test.shueapp.com', name: 'Yeezy Expert', password: 'TestPass123!' },
  { legacyId: '4', email: 'seller4@test.shueapp.com', name: 'Sneaker Vault', password: 'TestPass123!' },
  { legacyId: '5', email: 'seller5@test.shueapp.com', name: 'Kicks Paradise', password: 'TestPass123!' },
  { legacyId: '6', email: 'seller6@test.shueapp.com', name: 'Sole Supplier', password: 'TestPass123!' }
]

interface LegacySellerMap {
  [legacyId: string]: string
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function fetchRealImages(productName: string, brand: string, colorway: string): Promise<string[]> {
  try {
    const searchQuery = `${brand} ${productName} ${colorway}`.trim()
    console.log(`  🔍 Searching for: ${searchQuery}`)
    
    const results = await sneaksService.searchProducts(searchQuery, 1)
    
    if (results.length > 0) {
      const product = results[0]
      
      const images: string[] = []
      
      if (product.thumbnail) {
        images.push(product.thumbnail)
        console.log(`  ✓ Found thumbnail: ${product.thumbnail.substring(0, 60)}...`)
      }
      
      if (product.imageLinks && product.imageLinks.length > 0) {
        images.push(...product.imageLinks.slice(0, 2)) // Add up to 2 more images
        console.log(`  ✓ Found ${product.imageLinks.length} additional images`)
      }
      
      if (images.length > 0) {
        return images
      }
    }
    
    console.log(`  ⚠ No images found for ${productName}`)
    return []
  } catch (error) {
    console.error(`  ✗ Error fetching images for ${productName}:`, error instanceof Error ? error.message : 'Unknown error')
    return []
  }
}

async function createTestUsers(): Promise<LegacySellerMap> {
  console.log('Creating test seller accounts...')
  const sellerMap: LegacySellerMap = {}

  for (const seller of testSellers) {
    try {
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', seller.email)
        .single()

      if (existingUser) {
        console.log(`✓ User ${seller.email} already exists (${existingUser.id})`)
        sellerMap[seller.legacyId] = existingUser.id
        continue
      }

      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: seller.email,
        password: seller.password,
        email_confirm: true,
        user_metadata: {
          name: seller.name
        }
      })

      if (authError) {
        console.error(`✗ Failed to create auth user ${seller.email}:`, authError.message)
        continue
      }

      if (!authData.user) {
        console.error(`✗ No user data returned for ${seller.email}`)
        continue
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email: seller.email,
          name: seller.name,
          rating: Math.random() * 2 + 3
        })
        .select()
        .single()

      if (profileError) {
        console.error(`✗ Failed to create profile for ${seller.email}:`, profileError.message)
        continue
      }

      console.log(`✓ Created user ${seller.email} (${authData.user.id})`)
      sellerMap[seller.legacyId] = authData.user.id

      const { error: mapError } = await supabase
        .from('legacy_seller_map')
        .insert({
          legacy_id: seller.legacyId,
          profile_id: authData.user.id
        })

      if (mapError) {
        console.error(`✗ Failed to create legacy mapping for ${seller.legacyId}:`, mapError.message)
      } else {
        console.log(`✓ Mapped legacy ID ${seller.legacyId} to ${authData.user.id}`)
      }

    } catch (error) {
      console.error(`✗ Error creating user ${seller.email}:`, error)
    }
  }

  return sellerMap
}

async function migrateProductsWithImages(sellerMap: LegacySellerMap) {
  console.log('\nMigrating products with real images from sneaks-api...')
  console.log('Note: Adding delays between API calls to avoid rate limiting\n')
  
  let successCount = 0
  let skipCount = 0
  let errorCount = 0
  let imagesFoundCount = 0

  for (let i = 0; i < productsData.length; i++) {
    const product = productsData[i]
    
    try {
      const sellerId = sellerMap[product.sellerId]
      
      if (!sellerId) {
        console.warn(`⚠ Skipping product ${product.id} - no seller mapping for legacy ID ${product.sellerId}`)
        skipCount++
        continue
      }

      const { data: existing } = await supabase
        .from('product_listings')
        .select('id')
        .eq('seller_id', sellerId)
        .eq('name', product.name)
        .eq('colorway', product.colorway)
        .single()

      if (existing) {
        console.log(`⊘ Product already exists: ${product.name} (${product.colorway})`)
        skipCount++
        continue
      }

      console.log(`\n[${i + 1}/${productsData.length}] Processing: ${product.name} (${product.colorway})`)
      
      const realImages = await fetchRealImages(product.name, product.brand, product.colorway)
      
      const imagesToUse = realImages.length > 0 ? realImages : product.images
      
      if (realImages.length > 0) {
        imagesFoundCount++
      }

      const { error } = await supabase
        .from('product_listings')
        .insert({
          seller_id: sellerId,
          style_id: null,
          name: product.name,
          brand: product.brand,
          colorway: product.colorway,
          images: imagesToUse,
          sizes: product.sizes,
          retail_price: product.retailPrice,
          release_date: product.releaseDate,
          category: product.category,
          condition: product.condition,
          description: null,
          status: 'active'
        })

      if (error) {
        console.error(`✗ Failed to insert ${product.name}:`, error.message)
        errorCount++
      } else {
        console.log(`✓ Migrated: ${product.name} (${product.colorway}) - ${realImages.length > 0 ? 'with real images' : 'with fallback images'}`)
        successCount++
      }

      if (i < productsData.length - 1) {
        await delay(2000)
      }

    } catch (error) {
      console.error(`✗ Error migrating product ${product.id}:`, error)
      errorCount++
    }
  }

  console.log('\n=== Migration Summary ===')
  console.log(`✓ Successfully migrated: ${successCount} products`)
  console.log(`✓ Products with real images: ${imagesFoundCount}`)
  console.log(`⊘ Skipped (already exist): ${skipCount} products`)
  console.log(`✗ Failed: ${errorCount} products`)
}

async function createTestSellerLocations(sellerMap: LegacySellerMap) {
  console.log('\nCreating test seller locations...')
  
  const testLocations = [
    { legacyId: '1', zipcode: '10001', lat: 40.7506, lng: -73.9971 }, // NYC
    { legacyId: '2', zipcode: '90210', lat: 34.0901, lng: -118.4065 }, // Beverly Hills
    { legacyId: '3', zipcode: '60614', lat: 41.9217, lng: -87.6532 }, // Chicago
    { legacyId: '4', zipcode: '33139', lat: 25.7907, lng: -80.1300 }, // Miami Beach
    { legacyId: '5', zipcode: '30303', lat: 33.7490, lng: -84.3880 }, // Atlanta
    { legacyId: '6', zipcode: '94102', lat: 37.7799, lng: -122.4193 } // San Francisco
  ]

  for (const location of testLocations) {
    const sellerId = sellerMap[location.legacyId]
    if (!sellerId) continue

    try {
      const { data: existing } = await supabase
        .from('seller_locations')
        .select('user_id')
        .eq('user_id', sellerId)
        .single()

      if (existing) {
        console.log(`⊘ Location already exists for seller ${location.legacyId}`)
        continue
      }

      const { error } = await supabase
        .from('seller_locations')
        .insert({
          user_id: sellerId,
          zipcode: location.zipcode,
          lat: location.lat,
          lng: location.lng,
          location_enabled: true,
          is_sponsored: location.legacyId === '1'
        })

      if (error) {
        console.error(`✗ Failed to create location for seller ${location.legacyId}:`, error.message)
      } else {
        console.log(`✓ Created location for seller ${location.legacyId} at ZIP ${location.zipcode}${location.legacyId === '1' ? ' (SPONSORED)' : ''}`)
      }
    } catch (error) {
      console.error(`✗ Error creating location for seller ${location.legacyId}:`, error)
    }
  }
}

async function main() {
  console.log('=== Product Listings Migration Script (with Real Images) ===\n')
  
  try {
    const sellerMap = await createTestUsers()
    
    if (Object.keys(sellerMap).length === 0) {
      console.error('\n✗ No sellers were created or mapped. Cannot proceed with migration.')
      process.exit(1)
    }

    await createTestSellerLocations(sellerMap)

    await migrateProductsWithImages(sellerMap)

    console.log('\n=== Migration Complete ===')
    console.log('\nTest seller credentials:')
    testSellers.forEach(seller => {
      console.log(`  ${seller.email} / ${seller.password}`)
    })
    console.log('\nNext steps:')
    console.log('1. Check the explore page to see products with real images')
    console.log('2. Verify sponsored products are showing correctly')
    console.log('3. Check the find-sellers map to see locations with inventory counts')

  } catch (error) {
    console.error('\n✗ Migration failed:', error)
    process.exit(1)
  }
}

main()
