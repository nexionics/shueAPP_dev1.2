/**
 * Test script to verify sneaks-api functionality and image URLs
 */

import { sneaksService } from '../src/lib/sneaks-service'

async function testSneaksAPI() {
  console.log('=== Testing Sneaks API ===\n')

  try {
    console.log('Test 1: Searching for "Air Jordan 1 Chicago"...')
    const aj1Results = await sneaksService.searchProducts('Air Jordan 1 Chicago', 1)
    if (aj1Results.length > 0) {
      const product = aj1Results[0]
      console.log('✓ Found:', product.shoeName)
      console.log('  Brand:', product.brand)
      console.log('  Style ID:', product.styleID)
      console.log('  Colorway:', product.colorway)
      console.log('  Retail Price:', product.retailPrice)
      console.log('  Image Links:', product.imageLinks?.length || 0, 'images')
      if (product.imageLinks && product.imageLinks.length > 0) {
        console.log('  First Image:', product.imageLinks[0])
      }
      console.log('  Thumbnail:', product.thumbnail)
    } else {
      console.log('✗ No results found')
    }

    console.log('\n---\n')

    console.log('Test 2: Searching for "Nike Dunk Panda"...')
    const dunkResults = await sneaksService.searchProducts('Nike Dunk Panda', 1)
    if (dunkResults.length > 0) {
      const product = dunkResults[0]
      console.log('✓ Found:', product.shoeName)
      console.log('  Image Links:', product.imageLinks?.length || 0, 'images')
      if (product.imageLinks && product.imageLinks.length > 0) {
        console.log('  First Image:', product.imageLinks[0])
      }
    } else {
      console.log('✗ No results found')
    }

    console.log('\n---\n')

    console.log('Test 3: Getting most popular shoes...')
    const popular = await sneaksService.getMostPopular(3)
    console.log(`✓ Found ${popular.length} popular shoes:`)
    popular.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.shoeName}`)
      console.log(`     Images: ${product.imageLinks?.length || 0}`)
      if (product.imageLinks && product.imageLinks.length > 0) {
        console.log(`     First Image: ${product.imageLinks[0]}`)
      }
    })

    console.log('\n=== Test Complete ===')
    console.log('\nImage URL Patterns Found:')
    const allImages = [
      ...aj1Results.flatMap(p => p.imageLinks || []),
      ...dunkResults.flatMap(p => p.imageLinks || []),
      ...popular.flatMap(p => p.imageLinks || [])
    ]
    
    const domains = new Set(allImages.map(url => {
      try {
        return new URL(url).hostname
      } catch {
        return 'invalid'
      }
    }))
    
    console.log('Domains found:', Array.from(domains).join(', '))

  } catch (error) {
    console.error('✗ Error testing Sneaks API:', error)
  }
}

testSneaksAPI()
