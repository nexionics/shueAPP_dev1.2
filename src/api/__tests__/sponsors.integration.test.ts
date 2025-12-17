/**
 * Integration tests for Sponsor API
 * These tests call the real backend routes (no fetch mocks) and therefore
 * require the backend to be running at the URL configured by the API wrapper
 * (default: http://localhost:3001).
 */
import { getSponsoredProducts, listSponsors, getSponsorsForProduct } from '../sponsors'

jest.setTimeout(30000)

describe('Sponsors API - Integration', () => {
  it('getSponsoredProducts should return success and an array of products', async () => {
    const res = await getSponsoredProducts()
    expect(res).toHaveProperty('success')

    if (!res.success) {
      // Fail the test with the backend-provided error message for easier debugging
      throw new Error(`Backend error (getSponsoredProducts): ${(res as any).error || 'unknown'}`)
    }

    expect(Array.isArray(res.data)).toBe(true)
    expect(typeof res.count).toBe('number')
  })

  it('listSponsors should return success and a sponsors array', async () => {
    const res = await listSponsors({}, undefined)
    expect(res).toHaveProperty('success')

    if (!res.success) {
      throw new Error(`Backend error (listSponsors): ${(res as any).error || 'unknown'}`)
    }

    expect(Array.isArray(res.data)).toBe(true)
  })

  it('getSponsorsForProduct should return sponsors for an existing product (if any)', async () => {
    const productsRes = await getSponsoredProducts()
    if (!productsRes.success) {
      throw new Error(`Backend error (getSponsoredProducts pre-check): ${(productsRes as any).error || 'unknown'}`)
    }

    const products = productsRes.data
    if (!Array.isArray(products) || products.length === 0) {
      // No sponsored products to query against — mark as skipped by returning early.
      // Jest does not have a built-in skip at runtime, so we exit the test gracefully.
      // This still counts as a passing test in CI but indicates no data was available.
      console.warn('No sponsored products available; skipping getSponsorsForProduct assertion.')
      return
    }

    const productId = products[0].id
    const sponsorsRes = await getSponsorsForProduct(productId)
    if (!sponsorsRes.success) {
      throw new Error(`Backend error (getSponsorsForProduct): ${(sponsorsRes as any).error || 'unknown'}`)
    }

    expect(Array.isArray(sponsorsRes.data)).toBe(true)
  })
})
