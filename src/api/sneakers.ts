export type Product = {
  styleID?: string
  id?: string
  name?: string
  shoeName?: string
  brand?: string
  retailPrice?: number
  thumbnail?: string
  imageLinks?: string[]
  images?: string[]
  releaseDate?: string
  resellLinks?: Record<string, string>
  lowestResellPrice?: Record<string, number>
  [key: string]: unknown
}

export type SearchResponse = { success: boolean; data: Product[]; count?: number; query?: string; limit?: number }
export type DetailsResponse = { success: boolean; data: Product }

// Standardize on NEXT_PUBLIC_API_URL which should be the server origin (e.g. http://localhost:3001)
const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE || process.env.REACT_APP_API_BASE || 'http://localhost:3001'
const BASE = `${API_ORIGIN.replace(/\/$/, '')}/api`

async function handleJsonResponse(res: Response) {
  const json: unknown = await res.json().catch(() => ({}))
  if (!res.ok) throw { status: res.status, body: json }
  if (json && typeof json === 'object' && (json as { success?: unknown }).success === false) {
    throw { status: 200, body: json }
  }
  return json
}

type JsonObject = Record<string, unknown>

function isObject(v: unknown): v is JsonObject {
  return typeof v === 'object' && v !== null
}

function normalizeProduct(p: unknown): Product {
  const obj: JsonObject = isObject(p) ? p : {}

  const style = isObject(obj.style) ? obj.style : undefined
  const styleIdFromStyle = style && typeof style.id === 'string' ? style.id : undefined

  const id =
    (typeof obj.id === 'string' && obj.id) ||
    (typeof obj.styleID === 'string' && obj.styleID) ||
    (typeof obj.styleId === 'string' && obj.styleId) ||
    styleIdFromStyle ||
    String(obj.id ?? obj.styleID ?? Math.random())

  const name =
    (typeof obj.name === 'string' && obj.name) ||
    (typeof obj.shoeName === 'string' && obj.shoeName) ||
    (typeof obj.title === 'string' && obj.title) ||
    ''

  const brand = (typeof obj.brand === 'string' && obj.brand) || ''
  const colorway = (typeof obj.colorway === 'string' && obj.colorway) || (typeof obj.color === 'string' && obj.color) || ''
  const releaseDate = (typeof obj.releaseDate === 'string' && obj.releaseDate) || (typeof obj.release_date === 'string' && obj.release_date) || ''
  const retailPrice = toNumber(obj.retailPrice ?? obj.retail_price ?? obj.retail ?? 0) || 0

  const images: string[] = Array.isArray(obj.images)
    ? (obj.images as unknown[]).filter((x): x is string => typeof x === 'string')
    : Array.isArray(obj.imageLinks)
      ? (obj.imageLinks as unknown[]).filter((x): x is string => typeof x === 'string')
      : typeof obj.thumbnail === 'string'
        ? [obj.thumbnail]
        : []

  // Normalize sizes into { size: string, price: number }[]
  let sizes: { size: string; price: number }[] = []
  if (Array.isArray(obj.sizes) && obj.sizes.length) {
    sizes = (obj.sizes as unknown[]).map((s) => {
      if (typeof s === 'number') return { size: 'One Size', price: s }
      if (typeof s === 'string') {
        const parsed = Number(s.replace(/[^0-9.-]+/g, ''))
        return { size: 'One Size', price: Number.isFinite(parsed) ? parsed : 0 }
      }
      if (!isObject(s)) return { size: 'One Size', price: 0 }
      const sizeLabel = (typeof s.size === 'string' && s.size) || (typeof s.label === 'string' && s.label) || 'One Size'
      const priceVal = toNumber(s.price ?? s.amount ?? 0)
      return { size: sizeLabel, price: Number.isFinite(priceVal) ? priceVal : 0 }
    })
  } else if (obj.lowestResellPrice && typeof obj.lowestResellPrice === 'object') {
    try {
      sizes = Object.entries(obj.lowestResellPrice as Record<string, unknown>).map(([k, v]) => ({ size: String(k), price: toNumber(v) || 0 }))
    } catch {
      sizes = []
    }
  } else {
    sizes = []
  }

  return {
    id,
    name,
    brand,
    colorway,
    releaseDate,
    retailPrice,
    images,
    thumbnail: (typeof obj.thumbnail === 'string' && obj.thumbnail) || images[0] || '',
    sizes,
    category: (typeof obj.category === 'string' && obj.category) || 'sneaker',
    condition: (typeof obj.condition === 'string' && obj.condition) || 'new',
    sellerId:
      (typeof obj.sellerId === 'string' && obj.sellerId) ||
      (typeof obj.seller === 'string' && obj.seller) ||
      (typeof obj.seller_id === 'string' && obj.seller_id) ||
      'unknown',
    styleID:
      typeof obj.styleID === 'string'
        ? obj.styleID
        : typeof obj.styleId === 'string'
          ? obj.styleId
          : undefined,
    description: (typeof obj.description === 'string' && obj.description) || (typeof obj.desc === 'string' && obj.desc) || '',
    resellLinks: isObject(obj.resellLinks)
      ? (obj.resellLinks as Record<string, string>)
      : isObject(obj.resell_links)
        ? (obj.resell_links as Record<string, string>)
        : undefined
  }
}

function toNumber(v: unknown): number {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

export async function searchProducts(q: string, limit = 20, signal?: AbortSignal) {
  const url = `${BASE}/inventory/search?q=${encodeURIComponent(q)}&limit=${limit}`
  const res = await fetch(url, { cache: 'no-store', ...(signal ? { signal } : undefined) })
  const json = await handleJsonResponse(res)
  if (isObject(json) && Array.isArray(json.data)) {
    json.data = (json.data as unknown[]).map((p) => normalizeProduct(p))
  }
  return json as SearchResponse
}

export async function getMostPopular(limit = 20, signal?: AbortSignal) {
  const url = `${BASE}/inventory/popular?limit=${limit}`
  const res = await fetch(url, { cache: 'no-store', ...(signal ? { signal } : undefined) })
  const json = await handleJsonResponse(res)
  if (isObject(json) && Array.isArray(json.data)) {
    json.data = (json.data as unknown[]).map((p) => normalizeProduct(p))
  }
  return json as SearchResponse
}

export async function getProductDetails(styleId: string, signal?: AbortSignal) {
  const url = `${BASE}/inventory/${encodeURIComponent(styleId)}`
  const res = await fetch(url, { cache: 'no-store', ...(signal ? { signal } : undefined) })
  const json = await handleJsonResponse(res)
  if (json && json.data) {
    json.data = normalizeProduct(json.data)
  }
  return json as DetailsResponse
}

export async function sneakerHealth(signal?: AbortSignal) {
  const url = `${BASE}/inventory/health`
  const res = await fetch(url, { cache: 'no-store', ...(signal ? { signal } : undefined) })
  return handleJsonResponse(res)
}
