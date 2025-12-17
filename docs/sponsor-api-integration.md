# Frontend Integration Guide: Sponsor API

This guide provides detailed instructions for frontend developers on how to integrate with the Sponsor API endpoints.

## Overview

The Sponsor API allows managing sponsored products in the ShueApp platform. Sponsors are used to promote specific products with configurable priority, timing, and metadata.

## Base URL

All endpoints are prefixed with `/api/sponsors`.

## Authentication

All requests require proper authentication headers as per the application's authentication system.

## API Endpoints

### 1. Create a Sponsor

**Endpoint:** `POST /api/sponsors`

**Purpose:** Create a new sponsored product entry.

**Request Body:**
```typescript
interface CreateSponsorRequest {
  productId: string;        // Required: Product ID to sponsor
  startsAt?: string;        // Optional: ISO date string when sponsorship starts
  endsAt?: string | null;   // Optional: ISO date string when sponsorship ends
  priority?: number;        // Optional: Display priority (default: 0)
  metadata?: Record<string, any>; // Optional: Additional sponsor data
  isActive?: boolean;       // Optional: Whether sponsor is active (default: true)
}
```

**Example Request:**
```javascript
const response = await fetch('/api/sponsors', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-token'
  },
  body: JSON.stringify({
    productId: "product-uuid-123",
    startsAt: "2025-12-03T10:00:00.000Z",
    priority: 5,
    metadata: {
      creative: "banner_ad",
      campaign: "holiday_sale"
    }
  })
});

const result = await response.json();
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "productId": "product-uuid-123",
    "startsAt": "2025-12-03T10:00:00.000Z",
    "endsAt": null,
    "priority": 5,
    "metadata": {
      "creative": "banner_ad",
      "campaign": "holiday_sale"
    },
    "isActive": true,
    "createdAt": "2025-12-03T09:00:00.000Z",
    "updatedAt": "2025-12-03T09:00:00.000Z"
  }
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "error": "productId is required"
}
```

### 2. List Sponsors

**Endpoint:** `GET /api/sponsors`

**Purpose:** Retrieve a list of sponsors with optional filtering.

**Query Parameters:**
- `productId` (string): Filter by specific product ID
- `activeOnly` (string): Set to "true" to get only active sponsors
- `limit` (string): Maximum number of results (default: 100)

**Example Requests:**
```javascript
// Get all sponsors
const response = await fetch('/api/sponsors');

// Get only active sponsors
const response = await fetch('/api/sponsors?activeOnly=true');

// Get sponsors for specific product
const response = await fetch('/api/sponsors?productId=product-uuid-123&activeOnly=true');

// Limit results
const response = await fetch('/api/sponsors?limit=10');
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "productId": "product-uuid-123",
      "startsAt": "2025-12-03T10:00:00.000Z",
      "endsAt": null,
      "priority": 5,
      "metadata": { "creative": "banner_ad" },
      "isActive": true,
      "createdAt": "2025-12-03T09:00:00.000Z",
      "updatedAt": "2025-12-03T09:00:00.000Z"
    }
  ],
  "count": 1
}
```

### 3. Get Sponsors for a Product

**Endpoint:** `GET /api/sponsors/:productId`

**Purpose:** Get all sponsors for a specific product.

**Path Parameters:**
- `productId` (string): The product ID to get sponsors for

**Example Request:**
```javascript
const productId = "product-uuid-123";
const response = await fetch(`/api/sponsors/${productId}`);
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "productId": "product-uuid-123",
      "startsAt": "2025-12-03T10:00:00.000Z",
      "priority": 5,
      "metadata": { "creative": "banner_ad" },
      "isActive": true
    }
  ]
}
```

### 4. Get Sponsored Products

**Endpoint:** `GET /api/sponsors/products`

**Purpose:** Retrieve all products that currently have active sponsors.

**Example Request:**
```javascript
const response = await fetch('/api/sponsors/products');
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "product-uuid-123",
      "name": "Air Jordan 1",
      "category": "SNEAKERS",
      "brand": "Nike",
      "styleID": "555088-063",
      "condition": "NEW",
      "colorway": "Black/White",
      "retailPrice": 170,
      "releaseDate": "2023-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

### 5. Update a Sponsor

**Endpoint:** `PATCH /api/sponsors/:id`

**Purpose:** Update an existing sponsor's properties.

**Path Parameters:**
- `id` (string): The sponsor ID to update

**Request Body:** Same as create, but all fields are optional.

**Example Request:**
```javascript
const sponsorId = 1;
const response = await fetch(`/api/sponsors/${sponsorId}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-token'
  },
  body: JSON.stringify({
    priority: 10,
    metadata: {
      creative: "updated_banner",
      campaign: "holiday_sale"
    }
  })
});
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "productId": "product-uuid-123",
    "priority": 10,
    "metadata": {
      "creative": "updated_banner",
      "campaign": "holiday_sale"
    },
    "updatedAt": "2025-12-03T10:00:00.000Z"
  }
}
```

### 6. Delete a Sponsor

**Endpoint:** `DELETE /api/sponsors/:id`

**Purpose:** Soft delete a sponsor (mark as inactive).

**Path Parameters:**
- `id` (string): The sponsor ID to delete

**Example Request:**
```javascript
const sponsorId = 1;
const response = await fetch(`/api/sponsors/${sponsorId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer your-token'
  }
});
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "isActive": false,
    "updatedAt": "2025-12-03T10:00:00.000Z"
  }
}
```

## Frontend Integration Patterns

### Managing Sponsor State

```javascript
class SponsorManager {
  async createSponsor(sponsorData) {
    try {
      const response = await fetch('/api/sponsors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(sponsorData)
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        this.sponsors.push(result.data);
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to create sponsor:', error);
      throw error;
    }
  }

  async loadSponsoredProducts() {
    try {
      const response = await fetch('/api/sponsors/products');
      const result = await response.json();

      if (result.success) {
        this.sponsoredProducts = result.data;
        return result.data;
      }
    } catch (error) {
      console.error('Failed to load sponsored products:', error);
    }
  }

  async updateSponsorPriority(sponsorId, newPriority) {
    try {
      const response = await fetch(`/api/sponsors/${sponsorId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({ priority: newPriority })
      });

      const result = await response.json();

      if (result.success) {
        // Update local sponsor
        const sponsor = this.sponsors.find(s => s.id === sponsorId);
        if (sponsor) {
          sponsor.priority = newPriority;
        }
      }
    } catch (error) {
      console.error('Failed to update sponsor:', error);
    }
  }
}
```

### React Hook Example

```javascript
import { useState, useEffect } from 'react';

function useSponsors() {
  const [sponsors, setSponsors] = useState([]);
  const [sponsoredProducts, setSponsoredProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSponsors = async (filters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`/api/sponsors?${queryParams}`);
      const result = await response.json();

      if (result.success) {
        setSponsors(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch sponsors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSponsoredProducts = async () => {
    try {
      const response = await fetch('/api/sponsors/products');
      const result = await response.json();

      if (result.success) {
        setSponsoredProducts(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch sponsored products:', error);
    }
  };

  const createSponsor = async (sponsorData) => {
    try {
      const response = await fetch('/api/sponsors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(sponsorData)
      });

      const result = await response.json();

      if (result.success) {
        setSponsors(prev => [...prev, result.data]);
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to create sponsor:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchSponsoredProducts();
  }, []);

  return {
    sponsors,
    sponsoredProducts,
    loading,
    fetchSponsors,
    fetchSponsoredProducts,
    createSponsor
  };
}
```

## Error Handling

All endpoints return errors in the following format:
```json
{
  "success": false,
  "error": "Error message"
}
```

Common error scenarios:
- 400: Invalid request data (missing required fields)
- 404: Resource not found
- 500: Server error

Always check `response.ok` and `result.success` before processing data.

## Best Practices

1. **Caching:** Cache sponsored products data since it changes infrequently
2. **Real-time Updates:** Consider WebSocket connections for live sponsor updates
3. **Validation:** Validate sponsor data on the frontend before sending requests
4. **Error Boundaries:** Wrap sponsor-related UI components in error boundaries
5. **Loading States:** Show loading indicators during API calls
6. **Optimistic Updates:** Update UI immediately, then sync with server response

## Data Types

```typescript
interface Sponsor {
  id: number;
  productId: string;
  startsAt: string | null;
  endsAt: string | null;
  priority: number;
  metadata: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  styleID: string;
  condition: string;
  colorway: string;
  retailPrice: number;
  releaseDate: string;
}
```