import React from 'react'
import { Product, formatPrice } from '@/lib/data'

export function ItemBrand({ brand }: { brand?: string }) {
  return <div className="text-sm text-muted-foreground">{brand ?? 'Unknown Brand'}</div>
}

export function ItemTitle({ name }: { name?: string }) {
  return (
    <h3 className="font-semibold line-clamp-2 group-hover:text-primary">{name ?? 'Untitled'}</h3>
  )
}

export function ItemColorway({ colorway }: { colorway?: string }) {
  return <div className="text-sm text-muted-foreground">{colorway ?? ''}</div>
}

export function ItemMeta({ hasPrices, minPrice, maxPrice, sizesLength }: { hasPrices: boolean; minPrice?: number; maxPrice?: number; sizesLength: number }) {
  return (
    <div className="flex items-center justify-between">
      <div className="font-bold">
        {hasPrices
          ? (minPrice === maxPrice
              ? formatPrice(minPrice as number)
              : `${formatPrice(minPrice as number)} - ${formatPrice(maxPrice as number)}`)
          : 'Unavailable'}
      </div>
      <div className="text-xs text-muted-foreground">
        {sizesLength} {sizesLength === 1 ? 'size' : 'sizes'}
      </div>
    </div>
  )
}

export function DefaultItemDetails({ product }: { product: Product }) {
  // Accept multiple possible shapes for sizes (API may return numbers, strings, objects, or lowestResellPrice map)
  let sizes: any[] = []
  if (Array.isArray((product as any).sizes) && (product as any).sizes.length) {
    sizes = (product as any).sizes
  } else if ((product as any).lowestResellPrice && typeof (product as any).lowestResellPrice === 'object') {
    sizes = Object.entries((product as any).lowestResellPrice).map(([k, v]) => ({ size: String(k), price: Number(v) || 0 }))
  } else {
    sizes = []
  }

  const numericPrices = sizes
    .map(s => {
      if (s == null) return NaN
      if (typeof s === 'number') return s
      if (typeof s === 'string') return Number(s.replace(/[^0-9.-]+/g, ''))
      if (typeof s.price === 'number') return s.price
      return Number(s?.price ?? s?.amount ?? NaN)
    })
    .filter((p) => Number.isFinite(p))

  const hasPrices = numericPrices.length > 0
  const minPrice = hasPrices ? Math.min(...numericPrices) : undefined
  const maxPrice = hasPrices ? Math.max(...numericPrices) : undefined

  const name = (product as any).name || (product as any).shoeName || (product as any).title || (product as any).styleID || 'Untitled'
  const brand = (product as any).brand || (product as any).maker || 'Unknown Brand'
  const colorway = (product as any).colorway || (product as any).color || ''

  return (
    <div>
      <ItemBrand brand={brand} />
      <ItemTitle name={name} />
      <ItemColorway colorway={colorway} />
      <ItemMeta hasPrices={hasPrices} minPrice={minPrice} maxPrice={maxPrice} sizesLength={sizes.length} />
    </div>
  )
}

export default DefaultItemDetails
