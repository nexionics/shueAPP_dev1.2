export interface SizeEntry {
  size: string
  price: number
  quantity: number
}

export interface ListingFormData {
  title: string
  description: string
  brand: string
  model: string
  colorway: string
  condition: string
  sizes: SizeEntry[]
  images: File[]
  listingType: 'sale' | 'trade' | 'auction'
  location: string
  minBid?: number
  buyNowPrice?: number
  auctionDuration?: number
  // ISO 8601 strings for auction scheduling (required when listingType === 'auction')
  startTime?: string
  endTime?: string
}

export const CONDITIONS = [
  { value: 'new', label: 'New with Box' },
  { value: 'new-no-box', label: 'New without Box' },
  { value: 'used-excellent', label: 'Used - Excellent' },
  { value: 'used-good', label: 'Used - Good' },
  { value: 'used-fair', label: 'Used - Fair' }
]

export const SHOE_SIZES = [
  '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5',
  '10', '10.5', '11', '11.5', '12', '12.5', '13', '13.5', '14'
]
