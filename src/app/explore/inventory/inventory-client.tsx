"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { ItemCard } from '@/components/ItemCard'
import type { Product } from '@/lib/data'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { fetchInventoryProducts, type InventorySort } from '@/api/products'
import MapView from '@/components/Map/Map'
import { fetchGeoInventoryItems, type GeoInventoryItem } from '@/api/inventory-items'
import ClusteredPoints from '@/components/Map/ClusteredPoints'
import type { Map as MapboxMap } from 'mapbox-gl'
import Image from 'next/image'
import { getTopSellers, type Seller as TopSeller } from '@/api/sellers'

type MapboxMarkerComponent = React.ComponentType<{
  coordinates: [number, number]
  anchor?: string
  children?: React.ReactNode
}>

export default function InventoryClient() {
  const RADIUS_MILES = 300

  const [query, setQuery] = useState('')
  const [view, setView] = useState<'grid' | 'map'>('grid')
  const [brand, setBrand] = useState('all')
  const [color, setColor] = useState('all')
  const [priceMin, setPriceMin] = useState<number | ''>('')
  const [priceMax, setPriceMax] = useState<number | ''>('')
  const [sort, setSort] = useState<InventorySort>('relevance')

  const [useRadiusFilter, setUseRadiusFilter] = useState(true)

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [locationReady, setLocationReady] = useState(false)

  const [geoItems, setGeoItems] = useState<GeoInventoryItem[]>([])
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)
  const [MarkerComponent, setMarkerComponent] = useState<MapboxMarkerComponent | null>(null)
  const [map, setMap] = useState<MapboxMap | null>(null)

  const [activeItemId, setActiveItemId] = useState<string | null>(null)
  const [activeClusterIds, setActiveClusterIds] = useState<string[] | null>(null)
  const [panelHover, setPanelHover] = useState(false)
  const [panelPinned, setPanelPinned] = useState(false)
  const closeTimerRef = React.useRef<number | null>(null)

  const [sellerRanks, setSellerRanks] = useState<Map<string, number>>(() => new Map())

  useEffect(() => {
    const controller = new AbortController()

    ;(async () => {
      const res = await getTopSellers(100, controller.signal)
      if (!res || res.success !== true) return

      const list = Array.isArray(res.data) ? (res.data as TopSeller[]) : []
      const rankMap = new Map<string, number>()
      for (let i = 0; i < list.length; i++) {
        const s = list[i]
        if (s && typeof s.id === 'string' && s.id) rankMap.set(s.id, i + 1)
      }
      setSellerRanks(rankMap)
    })().catch(() => {
      // ignore; rank will be unavailable
    })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    return () => {
      if (closeTimerRef.current != null) window.clearTimeout(closeTimerRef.current)
    }
  }, [])

  useEffect(() => {
    let mounted = true

    async function loadMarker() {
      try {
        const mod = await import('react-mapbox-gl')
        const Marker = (mod as unknown as { Marker?: MapboxMarkerComponent }).Marker
        if (mounted && Marker) setMarkerComponent(() => Marker)
      } catch {
        // ignore: map will still render, but markers won't
      }
    }

    loadMarker()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    setLocationError(null)
    setLocationReady(false)

    if (!('geolocation' in navigator)) {
      setLocationError('Geolocation is not available in this browser.')
      setLocationReady(true)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setUseRadiusFilter(true)
        setLocationReady(true)
      },
      (err) => {
        setUserLocation(null)
        setLocationError(err?.message || 'Location permission denied.')
        setLocationReady(true)
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60_000 }
    )
  }, [])

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const loc = userLocation && useRadiusFilter ? userLocation : null

        // Fetch server-filtered results for the current filter state.
        // Keep limit modest for UX; increase if needed.
        const data = await fetchInventoryProducts({
          q: query.trim() ? query.trim() : undefined,
          brand: brand !== 'all' ? brand : undefined,
          color: color !== 'all' ? color : undefined,
          priceMin: priceMin === '' ? undefined : priceMin,
          priceMax: priceMax === '' ? undefined : priceMax,
          sort,
          lat: loc?.lat,
          lng: loc?.lng,
          radiusMiles: loc ? RADIUS_MILES : undefined,
          limit: 200,
          offset: 0
        })

        if (!controller.signal.aborted) setProducts(data)
      } catch (e: unknown) {
        if (controller.signal.aborted) return
        const msg = (() => {
          if (e && typeof e === 'object') {
            const maybeMessage = (e as { message?: unknown }).message
            if (typeof maybeMessage === 'string' && maybeMessage.length) return maybeMessage
            const maybeBody = (e as { body?: unknown }).body
            if (maybeBody && typeof maybeBody === 'object') {
              const maybeError = (maybeBody as { error?: unknown }).error
              if (typeof maybeError === 'string' && maybeError.length) return maybeError
            }
          }
          return 'Failed to load inventory'
        })()
        setError(msg)
        setProducts([])
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    })()

    return () => controller.abort()
  }, [query, brand, color, priceMin, priceMax, sort, userLocation, useRadiusFilter])

  useEffect(() => {
    if (view !== 'map') return
    const controller = new AbortController()

    ;(async () => {
      setGeoLoading(true)
      setGeoError(null)
      try {
        const loc = userLocation && useRadiusFilter ? userLocation : null
        const items = await fetchGeoInventoryItems({
          lat: loc?.lat,
          lng: loc?.lng,
          radiusMiles: loc ? RADIUS_MILES : undefined,
          q: query.trim() ? query.trim() : undefined,
          brand: brand !== 'all' ? brand : undefined,
          color: color !== 'all' ? color : undefined,
          priceMin: priceMin === '' ? undefined : priceMin,
          priceMax: priceMax === '' ? undefined : priceMax,
          limit: 500,
          offset: 0
        })
        if (!controller.signal.aborted) setGeoItems(items)
      } catch (e: unknown) {
        if (controller.signal.aborted) return
        const msg = e instanceof Error ? e.message : 'Failed to load map inventory'
        setGeoError(msg)
        setGeoItems([])
      } finally {
        if (!controller.signal.aborted) setGeoLoading(false)
      }
    })()

    return () => controller.abort()
  }, [view, userLocation, useRadiusFilter, query, brand, color, priceMin, priceMax])

  const brands = useMemo(() => {
    const set = new Set<string>()
    products.forEach(p => set.add(p.brand))
    return Array.from(set).sort()
  }, [products])

  const colors = useMemo(() => {
    const set = new Set<string>()
    products.forEach(p => set.add(p.colorway))
    return Array.from(set).sort()
  }, [products])

  const filtered = products

  const geoItemById = useMemo(() => {
    const m = new Map<string, GeoInventoryItem>()
    geoItems.forEach((it) => m.set(it.id, it))
    return m
  }, [geoItems])

  const activeItem = activeItemId ? geoItemById.get(activeItemId) ?? null : null
  const activeSellerRank = activeItem?.seller?.id ? sellerRanks.get(activeItem.seller.id) ?? null : null

  const mapCenter = useMemo<[number, number]>(() => {
    if (userLocation) return [userLocation.lng, userLocation.lat]
    if (geoItems.length) return [geoItems[0].longitude, geoItems[0].latitude]
    return [-122.4194, 37.7749]
  }, [userLocation, geoItems])

  const mapZoom = useMemo(() => {
    if (userLocation && useRadiusFilter) return [9]
    if (userLocation && !useRadiusFilter) return [4]
    return [4]
  }, [userLocation, useRadiusFilter])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-3">
        <Input placeholder="Search by name, brand, color..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="input w-48" value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="all">All brands</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select className="input w-48" value={color} onChange={(e) => setColor(e.target.value)}>
          <option value="all">All colors</option>
          {colors.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex items-center gap-2">
          <input type="number" placeholder="min" className="input w-24" value={priceMin} onChange={(e) => setPriceMin(e.target.value === '' ? '' : Number(e.target.value))} />
          <input type="number" placeholder="max" className="input w-24" value={priceMax} onChange={(e) => setPriceMax(e.target.value === '' ? '' : Number(e.target.value))} />
        </div>
        <select
          className="input w-48"
          value={sort}
          onChange={(e) => {
            const v = e.target.value
            if (v === 'relevance' || v === 'price-asc' || v === 'price-desc') setSort(v)
          }}
        >
          <option value="relevance">Relevance</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
        </select>
        <div className="ml-auto flex items-center gap-2">
          <Button
            onClick={() => setUseRadiusFilter((v) => !v)}
            variant={useRadiusFilter ? 'default' : 'outline'}
            disabled={!userLocation}
            title={!userLocation ? 'Enable location to filter by radius' : undefined}
          >
            Nearby
          </Button>
          <Button onClick={() => setView(view === 'grid' ? 'map' : 'grid')} variant="outline">{view === 'grid' ? 'Map View' : 'Grid View'}</Button>
          <Button onClick={() => { setQuery(''); setBrand('all'); setColor('all'); setPriceMin(''); setPriceMax(''); setSort('relevance') }} variant="ghost">Reset</Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        {!locationReady
          ? 'Getting your location…'
          : locationError
            ? `Location: ${locationError}`
            : userLocation && useRadiusFilter
              ? `Showing inventory within ${RADIUS_MILES} miles`
              : 'Showing inventory'}
        {loading ? ' • Loading…' : error ? ` • Error: ${error}` : ` • ${filtered.length} results`}
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(p => (
            <ItemCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        // Map view
        <div className="w-full h-[520px] rounded-lg overflow-hidden border bg-background">
          <MapView
            center={mapCenter}
            zoom={mapZoom}
            containerStyle={{ width: '100%', height: '100%' }}
            onStyleLoad={(m) => setMap(m as MapboxMap)}
          >
            {geoLoading || geoError ? (
              <div className="absolute left-3 top-3 z-10 rounded bg-background/90 px-3 py-2 text-sm text-muted-foreground border">
                {geoLoading ? 'Loading map…' : `Error: ${geoError}`}
              </div>
            ) : null}

            {MarkerComponent && userLocation ? (
              (() => {
                const Marker = MarkerComponent
                return (
                  <Marker coordinates={[userLocation.lng, userLocation.lat]} anchor="center">
                    <div className="h-4 w-4 rounded-full bg-primary border-2 border-background shadow" title="You" />
                  </Marker>
                )
              })()
            ) : null}

            <ClusteredPoints
              map={map}
              items={geoItems.map((it) => ({
                id: it.id,
                longitude: it.longitude,
                latitude: it.latitude,
                label: it.product?.name || it.productId,
              }))}
              onPointHover={(id) => {
                if (panelPinned) return
                if (closeTimerRef.current != null) {
                  window.clearTimeout(closeTimerRef.current)
                  closeTimerRef.current = null
                }
                setActiveClusterIds(null)
                setActiveItemId(id)
              }}
              onPointLeave={() => {
                if (panelPinned) return
                if (closeTimerRef.current != null) window.clearTimeout(closeTimerRef.current)
                closeTimerRef.current = window.setTimeout(() => {
                  if (!panelHover && !panelPinned) {
                    setActiveItemId(null)
                    setActiveClusterIds(null)
                  }
                }, 180)
              }}
              onPointOpen={(id) => {
                if (closeTimerRef.current != null) {
                  window.clearTimeout(closeTimerRef.current)
                  closeTimerRef.current = null
                }
                setPanelPinned(true)
                setActiveClusterIds(null)
                setActiveItemId(id)
              }}
              onClusterHover={(ids) => {
                if (panelPinned) return
                if (closeTimerRef.current != null) {
                  window.clearTimeout(closeTimerRef.current)
                  closeTimerRef.current = null
                }
                setActiveItemId(null)
                setActiveClusterIds(ids)
              }}
              onClusterLeave={() => {
                if (panelPinned) return
                if (closeTimerRef.current != null) window.clearTimeout(closeTimerRef.current)
                closeTimerRef.current = window.setTimeout(() => {
                  if (!panelHover && !panelPinned) {
                    setActiveItemId(null)
                    setActiveClusterIds(null)
                  }
                }, 180)
              }}
              onClusterOpen={(ids) => {
                // clicking cluster should also open panel with items
                if (closeTimerRef.current != null) {
                  window.clearTimeout(closeTimerRef.current)
                  closeTimerRef.current = null
                }
                setPanelPinned(true)
                setActiveItemId(null)
                setActiveClusterIds(ids)
              }}
            />

            <div
              className={
                'absolute top-0 right-0 h-full w-80 max-w-[90%] border-l bg-background/95 backdrop-blur-sm transition-transform duration-200 ' +
                  (activeItem || (activeClusterIds && activeClusterIds.length > 0) ? 'translate-x-0' : 'translate-x-full')
              }
              onMouseEnter={() => {
                if (closeTimerRef.current != null) {
                  window.clearTimeout(closeTimerRef.current)
                  closeTimerRef.current = null
                }
                setPanelHover(true)
              }}
              onMouseLeave={() => {
                setPanelHover(false)
                if (panelPinned) return
                setActiveItemId(null)
                setActiveClusterIds(null)
              }}
            >
              <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
                <div className="text-sm text-muted-foreground truncate">Details</div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setPanelPinned(false)
                    setPanelHover(false)
                    setActiveItemId(null)
                    setActiveClusterIds(null)
                  }}
                >
                  Close
                </Button>
              </div>
              {activeClusterIds && activeClusterIds.length > 0 ? (
                <div className="h-[calc(100%-52px)] p-4 overflow-auto">
                  <div className="text-sm text-muted-foreground mb-1">Cluster items</div>
                  <div className="font-semibold leading-tight mb-2">{activeClusterIds.length} items</div>
                  <div className="flex flex-col gap-3">
                    {activeClusterIds.map((id) => {
                      const it = geoItemById.get(id)
                      if (!it) return null
                      return (
                        <div key={id} className="w-full border rounded p-3 bg-background flex gap-3">
                          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded bg-muted">
                            <Image src={it.product?.thumbnail || '/placeholder-image.svg'} alt={it.product?.name || ''} fill className="object-cover" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold truncate">{it.product?.name || it.productId}</div>
                            <div className="text-sm text-muted-foreground mt-1">Size: <span className="text-foreground">{it.size}</span></div>
                            {typeof it.sellingPrice === 'number' ? <div className="text-sm text-muted-foreground mt-1">Price: <span className="text-foreground">${it.sellingPrice.toFixed(2)}</span></div> : null}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : activeItem ? (
                <div className="h-[calc(100%-52px)] p-4 overflow-auto">
                  <div className="text-sm text-muted-foreground mb-1">Inventory item</div>
                  { (activeItem.product?.thumbnail || activeItem.product?.images?.[0]) && (
                    <div className="relative w-full h-40 mb-4 overflow-hidden rounded bg-muted">
                      <Image
                        src={activeItem.product?.thumbnail || activeItem.product?.images?.[0] || '/placeholder-image.svg'}
                        alt={activeItem.product?.name || activeItem.productId}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="font-semibold leading-tight">{activeItem.product?.name || activeItem.productId}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Size: <span className="text-foreground">{activeItem.size}</span>
                    {typeof activeItem.sellingPrice === 'number' ? (
                      <>
                        {' '}• Price: <span className="text-foreground">${activeItem.sellingPrice.toFixed(2)}</span>
                      </>
                    ) : null}
                  </div>
                  {activeItem.location ? (
                    <div className="text-sm text-muted-foreground mt-1">
                      Location: <span className="text-foreground">{activeItem.location}</span>
                    </div>
                  ) : null}
                  {typeof activeItem.distanceMiles === 'number' ? (
                    <div className="text-sm text-muted-foreground mt-1">
                      Distance: <span className="text-foreground">{activeItem.distanceMiles.toFixed(1)} mi</span>
                    </div>
                  ) : null}

                  <div className="mt-4 border-t pt-4">
                    <div className="text-sm text-muted-foreground mb-2">Seller</div>
                    {activeItem.seller ? (
                      <div className="flex items-start gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full border bg-background">
                          <Image
                            src={activeItem.seller.avatar || '/placeholder-avatar.svg'}
                            alt={activeItem.seller.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{activeItem.seller.name}</div>
                          <div className="text-sm text-muted-foreground truncate">@{activeItem.seller.username}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Rating: <span className="text-foreground">{activeItem.seller.rating}</span>
                            {' '}• Sales: <span className="text-foreground">{activeItem.seller.totalSales}</span>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Rank: <span className="text-foreground">{activeSellerRank ? `#${activeSellerRank}` : '—'}</span>
                            {activeItem.seller.verified ? <span className="ml-2 text-foreground">Verified</span> : null}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">No seller info available.</div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </MapView>
        </div>
      )}
    </div>
  )
}
