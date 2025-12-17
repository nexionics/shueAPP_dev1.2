"use client"

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Supercluster from 'supercluster'
import type { Feature, FeatureCollection, Point } from 'geojson'
import type { Map as MapboxMap } from 'mapbox-gl'

export type ClusterablePoint = {
  id: string
  longitude: number
  latitude: number
  label?: string
}

type InventoryPointProps = { id: string; label: string }

type ClusterProps = {
  cluster: true
  cluster_id: number
  point_count: number
  point_count_abbreviated: string | number
}

type MapboxMarkerComponent = React.ComponentType<{
  coordinates: [number, number]
  anchor?: string
  children?: React.ReactNode
}>

function asFeatureCollection(items: ClusterablePoint[]): FeatureCollection<Point, InventoryPointProps> {
  return {
    type: 'FeatureCollection' as const,
    features: items.map((it) => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [it.longitude, it.latitude]
      },
      properties: {
        id: it.id,
        label: it.label || it.id
      }
    }))
  }
}

export default function ClusteredPoints({
  items,
  map,
  clusterRadius = 60,
  maxZoom = 12,
  onPointHover,
  onPointLeave,
  onPointOpen,
  onClusterHover,
  onClusterLeave,
  onClusterOpen,
}: {
  items: ClusterablePoint[]
  map: MapboxMap | null
  clusterRadius?: number
  maxZoom?: number
  onPointHover?: (id: string) => void
  onPointLeave?: () => void
  onPointOpen?: (id: string) => void
  onClusterHover?: (ids: string[]) => void
  onClusterLeave?: () => void
  onClusterOpen?: (ids: string[]) => void
}) {
  const [MarkerComponent, setMarkerComponent] = useState<MapboxMarkerComponent | null>(null)

  const isTouchDevice = useMemo(() => {
    if (typeof window === 'undefined') return false
    const nav = window.navigator
    if (typeof nav?.maxTouchPoints === 'number' && nav.maxTouchPoints > 0) return true
    try {
      return window.matchMedia?.('(pointer: coarse)')?.matches ?? false
    } catch {
      return false
    }
  }, [])

  const lastTapRef = useRef<{ key: string; time: number } | null>(null)
  const longPressTimerRef = useRef<number | null>(null)
  const didLongPressRef = useRef(false)

  const clearLongPress = () => {
    if (longPressTimerRef.current != null) {
      window.clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
  }

  const startLongPress = (fn: () => void) => {
    clearLongPress()
    didLongPressRef.current = false
    longPressTimerRef.current = window.setTimeout(() => {
      didLongPressRef.current = true
      fn()
    }, 420)
  }

  const handleTouchTap = (key: string, fn: () => void) => {
    if (didLongPressRef.current) return
    const now = Date.now()
    const last = lastTapRef.current
    if (last && last.key === key && now - last.time < 260) {
      lastTapRef.current = null
      fn()
      return
    }
    lastTapRef.current = { key, time: now }
  }

  useEffect(() => {
    let mounted = true
    import('react-mapbox-gl')
      .then((mod) => {
        const Marker = (mod as unknown as { Marker?: MapboxMarkerComponent }).Marker
        if (mounted && Marker) setMarkerComponent(() => Marker)
      })
      .catch(() => {
        // markers won't render if react-mapbox-gl can't load
      })

    return () => {
      mounted = false
    }
  }, [])

  const points = useMemo<Feature<Point, InventoryPointProps>[]>(() => {
    return asFeatureCollection(items).features as Feature<Point, InventoryPointProps>[]
  }, [items])

  const clusterIndex = useMemo(() => {
    const index = new Supercluster<InventoryPointProps, ClusterProps>({
      radius: clusterRadius,
      maxZoom,
    })
    index.load(points)
    return index
  }, [points, clusterRadius, maxZoom])

  const [rendered, setRendered] = useState<Array<Feature<Point, InventoryPointProps | ClusterProps>>>([])

  useEffect(() => {
    if (!map) return

    const update = () => {
      const b = map.getBounds()
      if (!b) return
      const bbox: [number, number, number, number] = [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()]
      const z = Math.round(map.getZoom())
      const clusters = clusterIndex.getClusters(bbox, z) as Array<Feature<Point, InventoryPointProps | ClusterProps>>
      setRendered(clusters)
    }

    update()
    map.on('moveend', update)
    map.on('zoomend', update)
    return () => {
      map.off('moveend', update)
      map.off('zoomend', update)
    }
  }, [map, clusterIndex])

  if (!MarkerComponent) return null
  const Marker = MarkerComponent

  const openCluster = (clusterId: number) => {
    try {
      const leaves = clusterIndex.getLeaves(clusterId, 1000, 0) as Feature<Point, InventoryPointProps>[]
      const ids = leaves.map((l) => (l.properties as InventoryPointProps).id)
      if (ids.length) onClusterOpen?.(ids)
    } catch {
      // ignore
    }
  }

  const hoverCluster = (clusterId: number) => {
    try {
      const leaves = clusterIndex.getLeaves(clusterId, 1000, 0) as Feature<Point, InventoryPointProps>[]
      const ids = leaves.map((l) => (l.properties as InventoryPointProps).id)
      if (ids.length) onClusterHover?.(ids)
    } catch {
      // ignore
    }
  }

  return (
    <>
      {rendered.map((f) => {
        const [lng, lat] = f.geometry.coordinates as [number, number]
        const props = (f.properties || {}) as Partial<InventoryPointProps & ClusterProps>
        const isCluster = props.cluster === true && typeof props.cluster_id === 'number'

        if (isCluster) {
          const count = props.point_count_abbreviated ?? props.point_count ?? ''
          const clusterId = props.cluster_id!
          return (
            <Marker key={`cluster-${clusterId}`} coordinates={[lng, lat]} anchor="center">
              <button
                type="button"
                className="min-w-6 h-6 px-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow"
                onClick={() => {
                  if (isTouchDevice) return

                  openCluster(clusterId)
                  if (!map) return
                  const expansionZoom = clusterIndex.getClusterExpansionZoom(clusterId)
                  map.easeTo({ center: [lng, lat], zoom: expansionZoom })
                }}
                onMouseEnter={() => {
                  if (isTouchDevice) return
                  hoverCluster(clusterId)
                }}
                onMouseLeave={() => {
                  if (isTouchDevice) return
                  if (onClusterLeave) onClusterLeave()
                }}
                onTouchStart={() => {
                  if (!isTouchDevice) return
                  startLongPress(() => {
                    openCluster(clusterId)
                    if (!map) return
                    const expansionZoom = clusterIndex.getClusterExpansionZoom(clusterId)
                    map.easeTo({ center: [lng, lat], zoom: expansionZoom })
                  })
                }}
                onTouchMove={() => {
                  if (!isTouchDevice) return
                  clearLongPress()
                }}
                onTouchEnd={() => {
                  if (!isTouchDevice) return
                  clearLongPress()
                  handleTouchTap(`cluster:${clusterId}`, () => {
                    openCluster(clusterId)
                    if (!map) return
                    const expansionZoom = clusterIndex.getClusterExpansionZoom(clusterId)
                    map.easeTo({ center: [lng, lat], zoom: expansionZoom })
                  })
                }}
                onTouchCancel={() => {
                  if (!isTouchDevice) return
                  clearLongPress()
                }}
                title="Zoom in / show items"
              >
                {count}
              </button>
            </Marker>
          )
        }

        const label = (props.label as string) || 'Point'
        return (
          <Marker key={`point-${(props.id as string) || `${lng}-${lat}`}`} coordinates={[lng, lat]} anchor="bottom">
            <div
              className="h-3.5 w-3.5 rounded-full bg-destructive border-2 border-background shadow"
              title={label}
              onMouseEnter={() => {
                if (isTouchDevice) return
                const id = typeof props.id === 'string' ? props.id : ''
                if (id) onPointHover?.(id)
              }}
              onMouseLeave={() => {
                if (isTouchDevice) return
                onPointLeave?.()
              }}
              onClick={() => {
                const id = typeof props.id === 'string' ? props.id : ''
                if (!id) return

                if (isTouchDevice) return
                onPointOpen?.(id)
              }}
              onTouchStart={() => {
                if (!isTouchDevice) return
                const id = typeof props.id === 'string' ? props.id : ''
                if (!id) return
                startLongPress(() => onPointOpen?.(id))
              }}
              onTouchMove={() => {
                if (!isTouchDevice) return
                clearLongPress()
              }}
              onTouchEnd={() => {
                if (!isTouchDevice) return
                const id = typeof props.id === 'string' ? props.id : ''
                if (!id) return
                clearLongPress()
                handleTouchTap(`point:${id}`, () => onPointOpen?.(id))
              }}
              onTouchCancel={() => {
                if (!isTouchDevice) return
                clearLongPress()
              }}
            />
          </Marker>
        )
      })}
    </>
  )
}
