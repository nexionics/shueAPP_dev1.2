# Add Listing API Contract

Last updated: 2025-12-10

This document describes the data produced by the Add Listing form in the frontend and the expected server-side processing required to create a listing. Use this as the contract between frontend and backend teams.

## Endpoint
- URL: `POST /api/listings`
- Auth: `Authorization: Bearer <JWT>` required
- Content-Type: `multipart/form-data` (for image uploads) or `application/json` (if images are already hosted)

## Top-level payload (JSON shape)
- `title` (string) — required
- `description` (string) — optional
- `brand` (string) — required
- `model` (string) — required
- `colorway` (string) — optional
- `condition` (enum) — one of: `new`, `new-no-box`, `used-excellent`, `used-good`, `used-fair`
- `sizes` (array) — see Sizes section
- `listingType` (enum) — one of: `sale`, `trade`, `auction`
- `location` (string) — required (public meetup location)
- `minBid` (number) — required when `listingType === 'auction'`
- `buyNowPrice` (number) — optional
- `auctionDuration` (number, days) — required when `listingType === 'auction'`
- `metadata` (object) — optional free-form key/value for extensibility
- `idempotencyKey` (string) — optional, used to deduplicate retries

### Sizes array item shape
- `size` (string) — required (e.g. "9", "10.5")
- `price` (number) — required when selling/trading; recommended to send as dollars (server converts to cents)
- `quantity` (integer >= 1)

Recommendation: store money in integer cents on the server. Frontend may send dollars; server should convert and validate.

## Images
- Field name (multipart): `images[]` (preserve order; index 0 = primary image)
- Alternative (JSON-only): `imageUrls[]` — array of already-hosted image URLs
- Limits: max 10 images, max 10 MB per file
- Accept: `image/jpeg`, `image/png`, `image/webp` (validate MIME and magic bytes server-side)

Server-side image processing responsibilities:
- Validate file size and type
- Generate thumbnails (e.g., 400px max) and optionally compressed variants
- Store images in object storage (S3/Blob) with unique keys, serve via CDN
- Return public CDN URLs in the API response

## Multipart example (curl)
```
curl -X POST "https://api.example.com/api/listings" \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=Air Jordan 1 Chicago" \
  -F "brand=Nike" \
  -F "model=AJ1" \
  -F "condition=used-excellent" \
  -F "location=Starbucks Main St" \
  -F "listingType=sale" \
  -F "sizes[0][size]=9" \
  -F "sizes[0][price]=200" \
  -F "sizes[0][quantity]=1" \
  -F "images[]=@/path/to/img1.jpg" \
  -F "images[]=@/path/to/img2.jpg"
```

## JSON-only example
```
{
  "title": "Air Jordan 1 Chicago 2015",
  "brand": "Nike",
  "model": "Air Jordan 1 High",
  "condition": "used-excellent",
  "sizes": [{"size": "9","price": 200,"quantity": 1}],
  "listingType": "sale",
  "location": "Starbucks on Main St",
  "buyNowPrice": 250
}
```

## Validation rules (server-side)
- Authenticate the user (401 if missing/invalid).
- `title`: required, min length 3, max 200
- `brand`, `model`: required, max 100
- `description`: optional, max 2000
- `condition`: must be one of the allowed enums
- `sizes`: must contain at least one item; each item must have a non-empty `size`, numeric `price` (>=0), `quantity` integer >=1
- For `listingType === 'auction'`: `minBid` > 0 and `auctionDuration` >= 1 day required
- `location`: required, sanitize content and max length 200
- Images: enforce max count and per-file size; validate MIME and content

Return `400` with structured `{ errors: { field: message } }` for validation failures.

## Security & operational considerations
- Require `Authorization` header
- Rate-limit create operations per user/IP
- Sanitize text fields to avoid XSS
- Scan images for malware (optional)
- Use idempotency keys to deduplicate retries

## Storage & model recommendations
- Use object storage (S3/Blob) for images. Keys example: `listings/{listingId}/{uuid}-orig.jpg` and `...-thumb.jpg`.
- DB schema (high-level):
  - `listings` (id, userId, title, brand, model, colorway, condition, listingType, location, minBid, buyNowPrice, auctionDuration, createdAt, updatedAt)
  - `sizes` (listingId, size, priceCents, quantity)
  - `images` (listingId, url, thumbnailUrl, orderIndex, isPrimary)

## Server processing workflow
1. Authenticate user and get `userId`.
2. Validate payload.
3. If images provided, validate and upload to object store; generate thumbnails.
4. Convert money values to cents.
5. Create DB listing record and related `sizes` and `images` rows in a transaction.
6. If auction: set auction end time and starting bid.
7. Emit events (indexing, notifications).
8. Return `201 Created` with listing metadata and image URLs.

## Response examples
- Success (`201`):
```
{
  "id": "uuid",
  "status": "created",
  "listingUrl": "/seller/{id}",
  "images": [{"url":"https://cdn...","thumbnail":"...","order":0}],
  "createdAt": "2025-12-10T12:34:56Z"
}
```

- Validation error (`400`):
```
{ "errors": { "title": "Title is required", "sizes": "At least one size" } }
```

- Auth error (`401`):
```
{ "error": "Unauthorized" }
```

## Idempotency & retries
- Accept `Idempotency-Key` header or `idempotencyKey` payload field. Repeated requests with same key should not create duplicate listings.

## Transactions & atomicity
- Prefer storing listing in `pending` state if images are processed asynchronously, or perform image upload first and then DB insert in a transaction.

## Testing recommendations
- Unit tests for validation rules
- Integration tests with a test object store (or in-memory mock)
- Storybook scenarios already prepared for UI states

## TypeScript interfaces (frontend)
```ts
interface SizeItem { size: string; price: number; quantity: number }
interface ListingPayload {
  title: string
  description?: string
  brand: string
  model: string
  colorway?: string
  condition: 'new'|'new-no-box'|'used-excellent'|'used-good'|'used-fair'
  sizes: SizeItem[]
  listingType: 'sale'|'trade'|'auction'
  location: string
  minBid?: number
  buyNowPrice?: number
  auctionDuration?: number
  metadata?: Record<string, any>
  idempotencyKey?: string
}
```

## Next steps / Implementation options
- Provide a Next.js API route scaffold (`/api/listings`) with multer/s3 example.
- Provide direct-to-S3 signed URL flow to upload images from the browser (recommended for large files).
- Add server-side background worker to generate thumbnails and update DB asynchronously.

If you'd like, I can scaffold an Express/Next.js handler and utilities for image upload, validation, and DB insertion.
