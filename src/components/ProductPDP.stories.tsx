import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import ProductPDP from './ProductPDP'
import { fetchInventoryProducts } from '@/api/products'
import type { Product as UiProduct } from '@/lib/data'

const meta: Meta<typeof ProductPDP> = {
  title: 'Components/ProductPDP',
  component: ProductPDP,
}

export default meta

const sampleProduct = {
  id: 'demo-ppd-1',
  title: 'Air Demo Jordan 1 Retro High OG',
  subtitle: 'Legendary colorway — limited drop',
  description:
    'Bold, loud, and unapologetic. These kicks define moments — clean leather, crisp stitching, and a story in every scuff.',
  images: ['/bubbles/1.webp', '/bubbles/2.webp'],
  price: 250,
  currency: '$',
}

export const Default: StoryObj<typeof ProductPDP> = {
  args: {
    product: sampleProduct,
  },
}

export const HighBid: StoryObj<typeof ProductPDP> = {
  args: {
    product: {
      ...sampleProduct,
      id: 'auction-high-bid',
      currentBid: 1200,
      auctionStart: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      auctionEnd: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
    },
  },
}

export const AuctionLive: StoryObj<typeof ProductPDP> = {
  args: {
    product: {
      ...sampleProduct,
      id: 'auction-live',
      currentBid: 450,
      auctionStart: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      auctionEnd: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
    },
  },
}

export const AuctionUpcoming: StoryObj<typeof ProductPDP> = {
  args: {
    product: {
      ...sampleProduct,
      id: 'auction-upcoming',
      currentBid: undefined,
      auctionStart: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
      auctionEnd: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    },
  },
}

export const Raffle: StoryObj<typeof ProductPDP> = {
  args: {
    product: {
      ...sampleProduct,
      id: 'raffle-1',
      raffle: {
        ticketPrice: 10,
        currency: '$',
        endsAt: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
      },
    },
  },
}

function mapUiProductToPdp(p: UiProduct) {
  const price =
    (typeof p.retailPrice === 'number' && Number.isFinite(p.retailPrice) ? p.retailPrice : null) ??
    (Array.isArray(p.sizes) && p.sizes.length && typeof p.sizes[0].price === 'number' ? p.sizes[0].price : 0)

  return {
    id: p.id,
    title: p.name,
    subtitle: [p.brand, p.colorway].filter(Boolean).join(' • '),
    description: p.description || `A beautiful pair — ${p.name} — ready for its next home.`,
    images: Array.isArray(p.images) ? p.images : [],
    price,
    currency: '$',
    // live backend inventory products don't currently include auction/raffle fields
  }
}

function LiveBackendPdp() {
  const [state, setState] = React.useState<
    | { status: 'loading' }
    | { status: 'error'; error: string }
    | { status: 'ready'; product: ReturnType<typeof mapUiProductToPdp> }
  >({ status: 'loading' })

  React.useEffect(() => {
    const controller = new AbortController()

    ;(async () => {
      try {
        const products = await fetchInventoryProducts({ limit: 1, offset: 0 })
        const first = products?.[0]
        if (!first) {
          setState({
            status: 'error',
            error: 'No products returned from backend. Seed the DB (backend/scripts/seed-products.ts) and ensure the API is running at NEXT_PUBLIC_API_URL or http://localhost:3001.'
          })
          return
        }
        if (!controller.signal.aborted) setState({ status: 'ready', product: mapUiProductToPdp(first) })
      } catch (e: unknown) {
        if (controller.signal.aborted) return
        const msg = e instanceof Error ? e.message : 'Failed to fetch live product from backend'
        setState({ status: 'error', error: msg })
      }
    })()

    return () => controller.abort()
  }, [])

  if (state.status === 'loading') {
    return <div className="p-6 text-sm text-muted-foreground">Loading live product…</div>
  }

  if (state.status === 'error') {
    return (
      <div className="p-6">
        <div className="text-sm font-semibold mb-2">Live PDP failed to load</div>
        <pre className="text-xs whitespace-pre-wrap text-muted-foreground">{state.error}</pre>
      </div>
    )
  }

  return <ProductPDP product={state.product} />
}

export const LiveFromBackend: StoryObj<typeof ProductPDP> = {
  render: () => <LiveBackendPdp />,
}
