import React, { useEffect, useMemo, useState } from 'react'
import Map from './Map'
import ClusteredPoints from './ClusteredPoints'
import { fetchJson, getApiBaseUrl } from '@/api/http'
import type { Map as MapboxMap } from 'mapbox-gl'

export default {
  title: 'Components/Map',
  component: Map,
}

export const Default = () => (
  <div style={{ width: '100%', height: '100%', minHeight: 700 }}>
    <Map containerStyle={{ width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', left: 8, top: 8, background: 'white', padding: 8, borderRadius: 4 }}>Map loaded</div>
    </Map>
  </div>
)

export const CenteredOnSF = () => (
  <div style={{ width: '100%', height: '100%', minHeight: 700 }}>
    <Map center={[-122.4194, 37.7749]} zoom={[11]} containerStyle={{ width: '100%', height: '100%' }} />
  </div>
)

export const Fullscreen = () => (
  <div style={{ width: '100vw', height: '100vh' }}>
    <Map containerStyle={{ width: '100%', height: '100%' }} />
  </div>
)
Fullscreen.parameters = { layout: 'fullscreen' }

type GeoItem = {
  id: string
  productId: string
  size: string
  location: string | null
  latitude: number
  longitude: number
  sellingPrice: number | null
  product: { id: string; name: string; brand?: string | null; thumbnail?: string | null } | null
}

type GeoItemsApiResponse = {
  success: true
  data: GeoItem[]
  count: number
  offset: number
  limit: number
}

function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message
  if (typeof e !== 'object' || e === null) return 'Failed to load geo points'

  const maybeBody = (e as Record<string, unknown>).body
  if (typeof maybeBody === 'object' && maybeBody !== null) {
    const body = maybeBody as Record<string, unknown>
    const msg = body.error ?? body.message
    if (typeof msg === 'string' && msg.length) return msg
  }

  const msg = (e as Record<string, unknown>).message
  if (typeof msg === 'string' && msg.length) return msg

  return 'Failed to load geo points'
}

export const InventoryItemGeoFromDB = () => {
  const [items, setItems] = useState<GeoItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [map, setMap] = useState<MapboxMap | null>(null)

  useEffect(() => {
    let mounted = true

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const base = getApiBaseUrl()
        const res = await fetchJson<GeoItemsApiResponse>(`${base}/api/inventory/items/geo?limit=200`)
        if (!mounted) return
        setItems(res.data)
      } catch (e: unknown) {
        if (!mounted) return
        setItems([])
        setError(getErrorMessage(e))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [])

  const center = useMemo<[number, number]>(() => {
    if (!items.length) return [-122.4194, 37.7749]
    const first = items[0]
    return [first.longitude, first.latitude]
  }, [items])

  return (
    <div style={{ width: 900, height: 520 }}>
      <Map
        center={center}
        zoom={[9]}
        containerStyle={{ width: '100%', height: '100%' }}
        onStyleLoad={(m) => setMap(m as MapboxMap)}
      >
        <div className="absolute left-2 top-2 max-w-[420px] rounded-md border bg-background p-2 text-foreground">
          <div className="font-semibold mb-1">Inventory item geo points</div>
          {loading ? (
            <div>Loading…</div>
          ) : error ? (
            <div className="text-destructive">Error: {error}</div>
          ) : items.length === 0 ? (
            <div>No inventory items with geo found.</div>
          ) : (
            <div>{items.length} points loaded</div>
          )}
          <div className="text-xs text-muted-foreground mt-1">
            API: {getApiBaseUrl()}/api/inventory/items/geo
          </div>
        </div>

        <ClusteredPoints
          map={map}
          items={items.map((it) => ({
            id: it.id,
            longitude: it.longitude,
            latitude: it.latitude,
            label: it.product?.name || it.productId,
          }))}
        />
      </Map>
    </div>
  )
}
