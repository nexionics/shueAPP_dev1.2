import { fetchJson, getApiBaseUrl, type ApiResponse } from './http';

type JsonObject = Record<string, unknown>;

function isObject(v: unknown): v is JsonObject {
  return typeof v === 'object' && v !== null;
}

function toNumber(v: unknown): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export type GeoInventoryItem = {
  id: string;
  productId: string;
  size: string;
  location: string | null;
  latitude: number;
  longitude: number;
  distanceMiles: number | null;
  sellingPrice: number | null;
  product: { id: string; name: string; brand?: string | null; thumbnail?: string | null } | null;
  seller: {
    id: string;
    username: string;
    name: string;
    avatar: string | null;
    verified: boolean;
    rating: number;
    totalSales: number;
    joinedDate: string;
  } | null;
};

export interface GeoInventoryItemsParams {
  lat?: number;
  lng?: number;
  radiusMiles?: number;
  q?: string;
  brand?: string;
  color?: string;
  priceMin?: number;
  priceMax?: number;
  limit?: number;
  offset?: number;
}

function mapGeoItem(it: unknown): GeoInventoryItem | null {
  if (!isObject(it)) return null;
  const id = typeof it.id === 'string' ? it.id : '';
  const productId = typeof it.productId === 'string' ? it.productId : '';
  const size = typeof it.size === 'string' ? it.size : '';
  const location = typeof it.location === 'string' ? it.location : it.location == null ? null : String(it.location);
  const latitude = toNumber(it.latitude);
  const longitude = toNumber(it.longitude);
  if (!id || !productId || latitude === null || longitude === null) return null;

  const distanceMiles = toNumber(it.distanceMiles);
  const sellingPrice = toNumber(it.sellingPrice);

  const productRaw = it.product;
  const product = isObject(productRaw)
    ? {
        id: typeof productRaw.id === 'string' ? productRaw.id : '',
        name: typeof productRaw.name === 'string' ? productRaw.name : '',
        brand: typeof productRaw.brand === 'string' ? productRaw.brand : null,
        thumbnail: typeof productRaw.thumbnail === 'string' ? productRaw.thumbnail : null,
      }
    : null;

  const sellerRaw = (it as JsonObject).seller;
  const seller = isObject(sellerRaw)
    ? {
        id: typeof sellerRaw.id === 'string' ? sellerRaw.id : '',
        username: typeof sellerRaw.username === 'string' ? sellerRaw.username : '',
        name: typeof sellerRaw.name === 'string' ? sellerRaw.name : '',
        avatar: typeof sellerRaw.avatar === 'string' ? sellerRaw.avatar : null,
        verified: Boolean(sellerRaw.verified),
        rating: toNumber(sellerRaw.rating) ?? 4.5,
        totalSales: toNumber(sellerRaw.totalSales) ?? 0,
        joinedDate: sellerRaw.joinedDate ? String(sellerRaw.joinedDate) : new Date().toISOString(),
      }
    : null;

  return {
    id,
    productId,
    size,
    location,
    latitude,
    longitude,
    distanceMiles,
    sellingPrice,
    product,
    seller,
  };
}

export async function fetchGeoInventoryItems(params: GeoInventoryItemsParams = {}): Promise<GeoInventoryItem[]> {
  const base = getApiBaseUrl();
  const qs = new URLSearchParams();
  if (typeof params.lat === 'number') qs.set('lat', String(params.lat));
  if (typeof params.lng === 'number') qs.set('lng', String(params.lng));
  if (typeof params.radiusMiles === 'number') qs.set('radiusMiles', String(params.radiusMiles));
  if (typeof params.q === 'string' && params.q.trim().length) qs.set('q', params.q.trim());
  if (typeof params.brand === 'string' && params.brand.trim().length) qs.set('brand', params.brand.trim());
  if (typeof params.color === 'string' && params.color.trim().length) qs.set('color', params.color.trim());
  if (typeof params.priceMin === 'number') qs.set('priceMin', String(params.priceMin));
  if (typeof params.priceMax === 'number') qs.set('priceMax', String(params.priceMax));
  if (typeof params.limit === 'number') qs.set('limit', String(params.limit));
  if (typeof params.offset === 'number') qs.set('offset', String(params.offset));

  const url = `${base}/api/inventory/items/geo${qs.size ? `?${qs.toString()}` : ''}`;
  const payload = await fetchJson<ApiResponse<unknown>>(url);
  if (!payload || (payload as ApiResponse<unknown>).success !== true) throw new Error('Invalid API response');

  const data = (payload as { data?: unknown }).data;
  if (!Array.isArray(data)) throw new Error('Invalid API response');

  return (data as unknown[]).map(mapGeoItem).filter((v): v is GeoInventoryItem => v !== null);
}
