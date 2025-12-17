import React from 'react'
import { Star } from 'lucide-react'
import { ItemCard } from '@/components/ItemCard'
import { Product } from '@/lib/data'

interface Props {
  products: Product[]
  loading?: boolean
  error?: string | null
}

export default function SponsoredProductsSection({ products, loading = false, error = null }: Props) {
  if (loading) {
    return (
      <section className="space-y-6 px-4">
        <div className="flex items-center justify-center space-x-2">
          <Star className="h-6 w-6 text-yellow-500" />
          <h2 className="text-3xl font-bold">Sponsored Products</h2>
          <Star className="h-6 w-6 text-yellow-500" />
        </div>
        <p className="text-sm text-muted-foreground text-center">Loading sponsored products…</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="space-y-6 px-4">
        <div className="flex items-center justify-center space-x-2">
          <Star className="h-6 w-6 text-yellow-500" />
          <h2 className="text-3xl font-bold">Sponsored Products</h2>
          <Star className="h-6 w-6 text-yellow-500" />
        </div>
        <p className="text-sm text-red-500 text-center">Error loading sponsored products: {error}</p>
      </section>
    )
  }

  if (!products || products.length === 0) {
    return (
      <section className="space-y-6 px-4">
        <div className="flex items-center justify-center space-x-2">
          <Star className="h-6 w-6 text-yellow-500" />
          <h2 className="text-3xl font-bold">Sponsored Products</h2>
          <Star className="h-6 w-6 text-yellow-500" />
        </div>
        <p className="text-sm text-muted-foreground text-center">No sponsored products available.</p>
      </section>
    )
  }

  return (
    <section className="space-y-6 px-4">
      <div className="flex items-center justify-center space-x-2">
        <Star className="h-6 w-6 text-yellow-500" />
        <h2 className="text-3xl font-bold">Sponsored Products</h2>
        <Star className="h-6 w-6 text-yellow-500" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-6">
        {products.slice(0, 4).map((product: Product) => (
          <div key={product.id} className="relative">
            <div className="absolute top-2 left-2 z-10 bg-yellow-500 text-black rounded px-2 py-1 text-xs">Sponsored</div>
            <ItemCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}
