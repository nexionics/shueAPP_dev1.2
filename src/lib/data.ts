import productsData from '../../data/products.json'
import sellersData from '../../data/sellers.json'
import requestsData from '../../data/requests.json'
import auctionsData from '../../data/auctions.json'
import rafflesData from '../../data/raffles.json'
import preordersData from '../../data/preorders.json'

// Types
export interface Product {
  id: string
  name: string
  brand: string
  colorway: string
  releaseDate: string
  retailPrice: number
  images: string[]
  sizes: { size: string; price: number }[]
  category: string
  condition: string
  sellerId: string
  styleID?: string
  description?: string
  resellLinks?: {
    stockX?: string
    goat?: string
    flightClub?: string
    stadiumGoods?: string
  }
}

export interface Seller {
  id: string
  name: string
  username: string
  avatar: string
  rating: number
  totalSales: number
  location: string
  joinedDate: string
  verified: boolean
  bio: string
  specialties: string[]
}

export interface Request {
  id: string
  productName: string
  brand: string
  size: string
  maxPrice: number
  requesterId: string
  requesterName: string
  createdDate: string
  status: string
  description: string
  location: string
}

export interface Auction {
  id: string
  productId: string
  sellerId: string
  startingBid: number
  currentBid: number
  buyNowPrice: number
  startDate: string
  endDate: string
  status: string
  bidCount: number
  watchers: number
  size: string
  condition: string
  description: string
}

export interface Raffle {
  id: string
  productName: string
  brand: string
  images: string[]
  retailPrice: number
  entryPrice: number
  totalEntries: number
  maxEntries: number
  startDate: string
  endDate: string
  drawDate: string
  status: string
  sizes: string[]
  description: string
  rules: string[]
  winner?: string
}

export interface Preorder {
  id: string
  productName: string
  brand: string
  colorway: string
  images: string[]
  retailPrice: number
  preorderPrice: number
  releaseDate: string
  preorderStartDate: string
  preorderEndDate: string
  status: string
  availableSizes: string[]
  totalOrders: number
  maxOrders: number
  sellerId: string
  description: string
  features: string[]
  depositRequired: number
  shippingDate: string
}

export interface SearchFilters {
  brand?: string
  size?: string
  priceMin?: number
  priceMax?: number
  distanceKm?: number
}

export interface HomeSections {
  featuredProducts: Product[]
  topSellers: Seller[]
  activeAuctions: Auction[]
  activeRaffles: Raffle[]
  newPreorders: Preorder[]
  recentRequests: Request[]
}

// Data access functions
export function getProducts(): Product[] {
  return productsData as Product[]
}

// Server-side: fetch products from backend API when available.
// Falls back to static `products.json` if the API is unreachable.
export async function getProductsFromApi(limit: number = 50): Promise<Product[]> {
  try {
    const { fetchPopularProducts } = await import('@/api/products');
    return await fetchPopularProducts(limit);
  } catch (err) {
    // On failure, return the bundled static products for a graceful fallback
    // (useful during local dev when backend isn't running)
    // eslint-disable-next-line no-console
    console.warn('getProductsFromApi failed, falling back to static data:', err);
    return productsData as Product[];
  }
}

export function getSellers(): Seller[] {
  return sellersData as Seller[]
}

export function getRequests(): Request[] {
  return requestsData as Request[]
}

export function getAuctions(): Auction[] {
  return auctionsData as Auction[]
}

export function getRaffles(): Raffle[] {
  return rafflesData as Raffle[]
}

export function getPreorders(): Preorder[] {
  return preordersData as Preorder[]
}

// Helper functions
export function getProduct(id: string): Product | undefined {
  return getProducts().find(product => product.id === id)
}

export function getSeller(id: string): Seller | undefined {
  return getSellers().find(seller => seller.id === id)
}

export function getAuctionsForProduct(productId: string): Auction[] {
  return getAuctions().filter(auction => auction.productId === productId)
}

export function getProductsBySeller(sellerId: string): Product[] {
  return getProducts().filter(product => product.sellerId === sellerId)
}

export function getAuctionsBySeller(sellerId: string): Auction[] {
  return getAuctions().filter(auction => auction.sellerId === sellerId)
}

export function getPreordersBySeller(sellerId: string): Preorder[] {
  return getPreorders().filter(preorder => preorder.sellerId === sellerId)
}

export function searchProducts(filters: SearchFilters): Product[] {
  let products = getProducts()

  if (filters.brand) {
    products = products.filter(product => 
      product.brand.toLowerCase().includes(filters.brand!.toLowerCase())
    )
  }

  if (filters.size) {
    products = products.filter(product =>
      product.sizes.some(sizeOption => sizeOption.size === filters.size)
    )
  }

  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    products = products.filter(product => {
      const minPrice = Math.min(...product.sizes.map(s => s.price))
      const maxPrice = Math.max(...product.sizes.map(s => s.price))
      
      if (filters.priceMin !== undefined && maxPrice < filters.priceMin) {
        return false
      }
      
      if (filters.priceMax !== undefined && minPrice > filters.priceMax) {
        return false
      }
      
      return true
    })
  }

  return products
}

export function getHomeSections(): HomeSections {
  const products = getProducts()
  const sellers = getSellers()
  const auctions = getAuctions()
  const raffles = getRaffles()
  const preorders = getPreorders()
  const requests = getRequests()

  return {
    featuredProducts: products.slice(0, 6),
    topSellers: sellers
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6),
    activeAuctions: auctions
      .filter(auction => auction.status === 'active')
      .slice(0, 4),
    activeRaffles: raffles
      .filter(raffle => raffle.status === 'active')
      .slice(0, 3),
    newPreorders: preorders
      .filter(preorder => preorder.status === 'active')
      .slice(0, 4),
    recentRequests: requests
      .filter(request => request.status === 'active')
      .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
      .slice(0, 5)
  }
}

// Function to get home sections with expanded product data
export function getHomeSectionsWithRealData(): HomeSections {
  const products = getProducts()
  const sellers = getSellers()
  const auctions = getAuctions()
  const raffles = getRaffles()
  const preorders = getPreorders()
  const requests = getRequests()

  return {
    featuredProducts: products.slice(0, 12), // More products for floating orbs
    topSellers: sellers
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6),
    activeAuctions: auctions
      .filter(auction => auction.status === 'active')
      .slice(0, 4),
    activeRaffles: raffles
      .filter(raffle => raffle.status === 'active')
      .slice(0, 3),
    newPreorders: preorders
      .filter(preorder => preorder.status === 'active')
      .slice(0, 4),
    recentRequests: requests
      .filter(request => request.status === 'active')
      .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
      .slice(0, 5)
  }
}

// Function to search local sneaker data
export function searchLocalSneakers(keyword: string, limit: number = 10): Product[] {
  const products = getProducts()
  const results = products.filter(product => 
    product.name.toLowerCase().includes(keyword.toLowerCase()) ||
    product.brand.toLowerCase().includes(keyword.toLowerCase()) ||
    product.colorway.toLowerCase().includes(keyword.toLowerCase())
  )
  return results.slice(0, limit)
}

export function getActiveRequests(): Request[] {
  return getRequests().filter(request => request.status === 'active')
}

export function getActiveAuctions(): Auction[] {
  return getAuctions().filter(auction => auction.status === 'active')
}

export function getActiveRaffles(): Raffle[] {
  return getRaffles().filter(raffle => raffle.status === 'active')
}

export function getActivePreorders(): Preorder[] {
  return getPreorders().filter(preorder => preorder.status === 'active')
}

// Utility functions
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function getTimeRemaining(endDate: string): string {
  const now = new Date().getTime()
  const end = new Date(endDate).getTime()
  const difference = end - now

  if (difference <= 0) {
    return 'Ended'
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) {
    return `${days}d ${hours}h`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}
