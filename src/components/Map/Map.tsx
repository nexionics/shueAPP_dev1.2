"use client"

import React, { useEffect, useState } from 'react'

type Props = {
  center?: [number, number]
  zoom?: number[]
  style?: string
  containerStyle?: React.CSSProperties
  children?: React.ReactNode
  accessToken?: string
  onStyleLoad?: (map: unknown) => void
}

type MapboxMapComponent = React.ComponentType<{
  style: string
  containerStyle: React.CSSProperties
  center: [number, number]
  zoom: number[]
  children?: React.ReactNode
  onStyleLoad?: (map: unknown) => void
}>

export default function Map({
  center = [-73.985664, 40.748514],
  zoom = [12],
  style = 'mapbox://styles/mapbox/streets-v11',
  containerStyle = { width: '100%', height: '100%' },
  children,
  accessToken,
  onStyleLoad,
}: Props) {
  const [MapComponent, setMapComponent] = useState<MapboxMapComponent | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const token = accessToken || process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

  useEffect(() => {
    let mounted = true

    async function load() {
      if (typeof window === 'undefined') return

      if (!token) return

      setLoadError(null)

      // Dynamically import to avoid SSR errors and to keep Storybook safe
      const mod = await import('react-mapbox-gl')
      const mapFactory = (mod as unknown as { default?: unknown }).default ?? mod

      // The factory returns a React component when called with options
      const Component = (mapFactory as (opts: { accessToken: string }) => MapboxMapComponent)({ accessToken: token })

      if (mounted) setMapComponent(() => Component)
    }

    load().catch(() => {
      setLoadError('Failed to load map runtime (react-mapbox-gl/mapbox-gl).')
    })

    return () => {
      mounted = false
    }
  }, [token])

  if (!token) {
    return (
      <div
        style={{
          ...containerStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 12,
          textAlign: 'center'
        }}
        className="text-sm text-muted-foreground"
      >
        Missing Mapbox token: set <code>NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code>
      </div>
    )
  }

  if (!MapComponent) {
    return (
      <div
        style={{
          ...containerStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 12,
          textAlign: 'center'
        }}
      >
        {loadError || 'Map loading...'}
      </div>
    )
  }

  const C = MapComponent

  return (
    <C style={style} containerStyle={containerStyle} center={center} zoom={zoom} onStyleLoad={onStyleLoad}>
      {children}
    </C>
  )
}
