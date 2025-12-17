/**
 * Seller API wrapper
 */

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_BASE = `${API_ORIGIN.replace(/\/$/, '')}/api`;

export interface Seller {
  id: string;
  name: string;
  username: string;
  avatar?: string | null;
  rating: number;
  totalSales: number;
  location?: string;
  joinedDate?: string;
  verified: boolean;
  bio?: string;
  specialties?: string[];
}

export interface SellerListResponse {
  success: boolean;
  data: Seller[];
  count: number;
}

export interface ErrorResponse {
  success: false;
  error: string;
}

export async function getTopSellers(limit: number = 6, signal?: AbortSignal): Promise<SellerListResponse | ErrorResponse> {
  try {
    const params = new URLSearchParams();
    params.append('limit', String(limit));

    const response = await fetch(`${API_BASE}/sellers/top?${params}`, { signal });
    const result = await response.json();
    return result;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { success: false, error: 'Request cancelled' };
    }
    return { success: false, error: 'Failed to fetch top sellers' };
  }
}
