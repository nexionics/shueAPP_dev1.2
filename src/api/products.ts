import type { Product } from '@/lib/data';
import { fetchJson, getApiBaseUrl, type ApiResponse } from './http';

type JsonObject = Record<string, unknown>;

function isObject(v: unknown): v is JsonObject {
  return typeof v === 'object' && v !== null;
}

function toNumber(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function mapBackendProductToUi(p: unknown): Product {
  const obj: JsonObject = isObject(p) ? p : {};

  const images: string[] = Array.isArray(obj.images)
    ? (obj.images as unknown[])
        .map((i) => {
          if (typeof i === 'string') return i;
          if (isObject(i) && typeof i.url === 'string') return i.url;
          return null;
        })
        .filter((v): v is string => typeof v === 'string' && v.length > 0)
    : [];

  const sizes: { size: string; price: number }[] = Array.isArray(obj.sizes)
    ? (obj.sizes as unknown[]).map((s) => {
        if (!isObject(s)) return { size: '', price: 0 };
        const size = typeof s.size === 'string' ? s.size : String(s.size ?? '');
        const price =
          s.priceCents != null ? toNumber(s.priceCents) / 100 : toNumber(s.price);
        return { size, price };
      })
    : [];

  return {
    id:
      (typeof obj.id === 'string' && obj.id) ||
      (typeof obj.productId === 'string' && obj.productId) ||
      String(obj.styleID ?? obj.styleId ?? ''),
    name: (typeof obj.name === 'string' && obj.name) || (typeof obj.title === 'string' && obj.title) || '',
    brand: (typeof obj.brand === 'string' && obj.brand) || '',
    colorway: (typeof obj.colorway === 'string' && obj.colorway) || '',
    releaseDate: obj.releaseDate ? String(obj.releaseDate) : new Date().toISOString(),
    retailPrice:
      obj.retailPriceCents != null
        ? toNumber(obj.retailPriceCents) / 100
        : toNumber(obj.retailPrice),
    images,
    sizes,
    category: String(obj.category ?? ''),
    condition: String(obj.condition ?? ''),
    sellerId: (typeof obj.sellerId === 'string' && obj.sellerId) || (isObject(obj.seller) && typeof obj.seller.id === 'string' ? obj.seller.id : ''),
    styleID:
      typeof obj.styleID === 'string'
        ? obj.styleID
        : typeof obj.styleId === 'string'
          ? obj.styleId
          : undefined,
    description: (typeof obj.description === 'string' && obj.description) || '',
  };
}

export type InventorySort = 'relevance' | 'price-asc' | 'price-desc';

export interface InventoryProductsParams {
  q?: string;
  brand?: string;
  color?: string;
  priceMin?: number;
  priceMax?: number;
  sort?: InventorySort;
  lat?: number;
  lng?: number;
  radiusMiles?: number;
  limit?: number;
  offset?: number;
}

export async function fetchInventoryProducts(params: InventoryProductsParams = {}): Promise<Product[]> {
  const base = getApiBaseUrl();
  const qs = new URLSearchParams();
  if (params.q) qs.set('q', params.q);
  if (params.brand) qs.set('brand', params.brand);
  if (params.color) qs.set('color', params.color);
  if (typeof params.priceMin === 'number') qs.set('priceMin', String(params.priceMin));
  if (typeof params.priceMax === 'number') qs.set('priceMax', String(params.priceMax));
  if (params.sort) qs.set('sort', params.sort);
  if (typeof params.lat === 'number') qs.set('lat', String(params.lat));
  if (typeof params.lng === 'number') qs.set('lng', String(params.lng));
  if (typeof params.radiusMiles === 'number') qs.set('radiusMiles', String(params.radiusMiles));
  if (typeof params.limit === 'number') qs.set('limit', String(params.limit));
  if (typeof params.offset === 'number') qs.set('offset', String(params.offset));

  const url = `${base}/api/inventory/products${qs.size ? `?${qs.toString()}` : ''}`;
  const payload = await fetchJson<ApiResponse<unknown>>(url);
  if (!payload || (payload as ApiResponse<unknown>).success !== true) {
    throw new Error('Invalid API response');
  }

  const data = (payload as ApiResponse<unknown> as { data?: unknown }).data;
  if (!Array.isArray(data)) throw new Error('Invalid API response');

  return (data as unknown[]).map(mapBackendProductToUi);
}

export async function fetchPopularProducts(limit: number = 50): Promise<Product[]> {
  const base = getApiBaseUrl();
  const url = `${base}/api/inventory/popular?limit=${limit}`;

  const payload = await fetchJson<ApiResponse<unknown>>(url);
  if (!payload || (payload as ApiResponse<unknown>).success !== true) {
    throw new Error('Invalid API response');
  }

  const data = (payload as ApiResponse<unknown> as { data?: unknown }).data;
  if (!Array.isArray(data)) throw new Error('Invalid API response');

  return (data as unknown[]).map(mapBackendProductToUi);
}
