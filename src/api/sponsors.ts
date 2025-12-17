/**
 * Sponsor API wrapper
 * Provides typed functions for interacting with the Sponsor API endpoints
 */

import { Product } from '@/lib/data'

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const API_BASE = `${API_ORIGIN.replace(/\/$/, '')}/api`

export interface SponsorMetadata {
  creative?: string;
  campaign?: string;
  [key: string]: unknown;
}

export interface Sponsor {
  id: number;
  productId: string;
  startsAt: string | null;
  endsAt: string | null;
  priority: number;
  metadata: SponsorMetadata;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSponsorRequest {
  productId: string;
  startsAt?: string;
  endsAt?: string | null;
  priority?: number;
  metadata?: SponsorMetadata;
  isActive?: boolean;
}

export interface UpdateSponsorRequest {
  productId?: string;
  startsAt?: string;
  endsAt?: string | null;
  priority?: number;
  metadata?: SponsorMetadata;
  isActive?: boolean;
}

export interface SponsorListResponse {
  success: boolean;
  data: Sponsor[];
  count: number;
}

export interface SponsorResponse {
  success: boolean;
  data: Sponsor;
}

export interface SponsoredProductsResponse {
  success: boolean;
  data: Product[]; // Using Product type from lib/data
  count: number;
}

export interface ErrorResponse {
  success: false;
  error: string;
}

/**
 * Create a new sponsor
 */
export async function createSponsor(
  sponsorData: CreateSponsorRequest,
  signal?: AbortSignal
): Promise<SponsorResponse | ErrorResponse> {
  try {
    const response = await fetch(`${API_BASE}/sponsors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sponsorData),
      signal,
    });

    const result = await response.json();
    return result;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { success: false, error: 'Request cancelled' };
    }
    return { success: false, error: 'Failed to create sponsor' };
  }
}

/**
 * List sponsors with optional filtering
 */
export async function listSponsors(
  filters: {
    productId?: string;
    activeOnly?: boolean;
    limit?: number;
  } = {},
  signal?: AbortSignal
): Promise<SponsorListResponse | ErrorResponse> {
  try {
    const params = new URLSearchParams();

    if (filters.productId) params.append('productId', filters.productId);
    if (filters.activeOnly !== undefined) params.append('activeOnly', filters.activeOnly.toString());
    if (filters.limit !== undefined) params.append('limit', filters.limit.toString());

    const response = await fetch(`${API_BASE}/sponsors?${params}`, { signal });
    const result = await response.json();
    return result;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { success: false, error: 'Request cancelled' };
    }
    return { success: false, error: 'Failed to list sponsors' };
  }
}

/**
 * Get sponsors for a specific product
 */
export async function getSponsorsForProduct(
  productId: string,
  signal?: AbortSignal
): Promise<SponsorListResponse | ErrorResponse> {
  try {
    const response = await fetch(`${API_BASE}/sponsors/${productId}`, { signal });
    const result = await response.json();
    return result;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { success: false, error: 'Request cancelled' };
    }
    return { success: false, error: 'Failed to get sponsors for product' };
  }
}

/**
 * Get all sponsored products
 */
export async function getSponsoredProducts(
  signal?: AbortSignal
): Promise<SponsoredProductsResponse | ErrorResponse> {
  try {
    const response = await fetch(`${API_BASE}/sponsors/products`, { signal });
    const result = await response.json();
    return result;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { success: false, error: 'Request cancelled' };
    }
    return { success: false, error: 'Failed to get sponsored products' };
  }
}

/**
 * Update an existing sponsor
 */
export async function updateSponsor(
  sponsorId: number,
  updateData: UpdateSponsorRequest,
  signal?: AbortSignal
): Promise<SponsorResponse | ErrorResponse> {
  try {
    const response = await fetch(`${API_BASE}/sponsors/${sponsorId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
      signal,
    });

    const result = await response.json();
    return result;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { success: false, error: 'Request cancelled' };
    }
    return { success: false, error: 'Failed to update sponsor' };
  }
}

/**
 * Delete (soft delete) a sponsor
 */
export async function deleteSponsor(
  sponsorId: number,
  signal?: AbortSignal
): Promise<DeleteSponsorResponse | ErrorResponse> {
  try {
    const response = await fetch(`${API_BASE}/sponsors/${sponsorId}`, {
      method: 'DELETE',
      signal,
    });

    const result = await response.json();
    return result;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { success: false, error: 'Request cancelled' };
    }
    return { success: false, error: 'Failed to delete sponsor' };
  }
}

/**
 * Normalize sponsor data (defensive programming)
 */
export function normalizeSponsor(sponsor: unknown): Sponsor | null {
  if (!sponsor || typeof sponsor !== 'object') return null;

  const s = sponsor as Record<string, unknown>;

  return {
    id: typeof s.id === 'number' ? s.id : 0,
    productId: typeof s.productId === 'string' ? s.productId : '',
    startsAt: typeof s.startsAt === 'string' ? s.startsAt : null,
    endsAt: typeof s.endsAt === 'string' ? s.endsAt : null,
    priority: typeof s.priority === 'number' ? s.priority : 0,
    metadata: (s.metadata && typeof s.metadata === 'object') ? s.metadata as SponsorMetadata : {},
    isActive: s.isActive !== false, // default true
    createdAt: typeof s.createdAt === 'string' ? s.createdAt : new Date().toISOString(),
    updatedAt: typeof s.updatedAt === 'string' ? s.updatedAt : new Date().toISOString(),
  };
}

/**
 * Normalize sponsor list response
 */
export function normalizeSponsorList(response: unknown): Sponsor[] {
  if (!response || typeof response !== 'object') return [];

  const r = response as Record<string, unknown>;
  if (!Array.isArray(r.data)) return [];

  return r.data
    .map(normalizeSponsor)
    .filter((sponsor): sponsor is Sponsor => sponsor !== null);
}