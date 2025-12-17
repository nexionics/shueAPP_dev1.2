# Sneakers API Integration Guide

This document explains how the frontend can integrate with the backend Sneakers API. It includes endpoints, TypeScript types, example fetch helpers, UI/UX recommendations, caching and error handling guidance, and local testing notes.

## Base URL

- Local dev example: `http://localhost:3001/api` (adjust for your environment)

## Endpoints

- `GET /api/sneakers/search?q=<term>&limit=<n>`
  - Returns search results.
  - Response shape: `{ success: boolean, data: Product[], count?: number, query?: string, limit?: number }`

- `GET /api/sneakers/popular?limit=<n>`
  - Returns trending/popular products.
  - Response shape: `{ success: boolean, data: Product[], count?: number, limit?: number }`

- `GET /api/sneakers/:styleId`
  - Returns detailed product information for a style ID.
  - Response shape: `{ success: boolean, data: Product }`

- `GET /api/sneakers/health`
  - Returns provider/service health: `{ success: boolean, healthy: boolean, message: string, timestamp?: string }`

## Recommended TypeScript Types

Add these types in your frontend project (adjust field names to match UI needs):

```ts
export type Product = {
  styleID: string;
  shoeName?: string;
  brand?: string;
  retailPrice?: number;
  thumbnail?: string;
  imageLinks?: string[];
  releaseDate?: string;
  resellLinks?: Record<string, string>;
  lowestResellPrice?: Record<string, number>;
  [key: string]: any;
};

export type SearchResponse = { success: boolean; data: Product[]; count?: number; query?: string; limit?: number };
export type DetailsResponse = { success: boolean; data: Product };
```

## Client fetch helper (TypeScript)

Create a small wrapper `/api/sneakers.ts` to centralize requests and error handling.

```ts
const BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3001/api';

async function handleJsonResponse(res: Response) {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, body: json };
  if (json && json.success === false) throw { status: 200, body: json };
  return json;
}

export async function searchProducts(q: string, limit = 20) {
  const url = `${BASE}/sneakers/search?q=${encodeURIComponent(q)}&limit=${limit}`;
  const res = await fetch(url);
  return handleJsonResponse(res) as Promise<SearchResponse>;
}

export async function getMostPopular(limit = 20) {
  const url = `${BASE}/sneakers/popular?limit=${limit}`;
  const res = await fetch(url);
  return handleJsonResponse(res) as Promise<SearchResponse>;
}

export async function getProductDetails(styleId: string) {
  const url = `${BASE}/sneakers/${encodeURIComponent(styleId)}`;
  const res = await fetch(url);
  return handleJsonResponse(res) as Promise<DetailsResponse>;
}

export async function sneakerHealth() {
  const url = `${BASE}/sneakers/health`;
  const res = await fetch(url);
  return handleJsonResponse(res);
}
```

## UI/UX Recommendations

- Search: debounce user input (300–500ms) to avoid rate limiting; show loading and empty states.
- Images: prefer `thumbnail`, fallback to `imageLinks[0]`, or use a placeholder; lazy-load images.
- Details: use `styleID` as canonical ID; allow user to retry on network errors.
- Pagination/Load more: backend supports `limit`; implement client-side paging or server-side changes if needed.

## Caching & Performance

- Use a client-side cache (React Query or SWR) with stale-while-revalidate (TTL 2–5 minutes).
- Cache keys: e.g., `['sneakers', 'search', q, limit]`.
- Cancel outstanding requests on new search input.

## Error Handling & Retries

- Treat non-2xx responses and `{ success: false }` as errors.
- Implement exponential backoff with jitter for `429`/`503` (retry 1–3 times).
- Show friendly messages for partial data (backend may return aggregated results when some scrapers fail).

## Rate Limiting & Politeness

- Backend has rate limiting (fastify rate-limit). Debounce UI requests and avoid tight loops.

- Start the backend and confirm CORS configuration allows the frontend origin.

## Testing & QA

- Manual checks:
  - `curl "http://localhost:3001/api/sneakers/search?q=Jordan&limit=5"`
  - `curl "http://localhost:3001/api/sneakers/popular?limit=5"`
  - `curl "http://localhost:3001/api/sneakers/FV5029-010"`

- Automated: use Playwright/Cypress for end-to-end flows (search → open details).
- Backend writes JSON request/response records to `test-results/` — use those files to inspect raw responses.

Render loading, error, empty states and link to `/sneakers/:styleId` for details.

## Frontend Integration Checklist

- [ ] Add typed API wrapper (`src/lib/api/sneakers.ts`).
- [ ] Implement debounced search input and results list component.
- [ ] Implement details view using `getProductDetails`.
- [ ] Use caching library (React Query or SWR).
- [ ] Add retry/backoff for server errors and handle `success === false` responses.
- [ ] Validate responses visually against backend `test-results/` JSON files.

## Next Steps I Can Help With

- Generate a ready-to-drop React component (search + results + details).
- Provide React Query hooks and example components.
- Create a Postman/Insomnia collection for the sneakers endpoints.

If you'd like a specific code component or collection, tell me which option and I'll generate it.
