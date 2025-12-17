"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/Button'
import { SellerCard } from '@/components/SellerCard'
import { getTopSellers, type Seller as ApiSeller } from '@/api/sellers'

interface Seller extends ApiSeller {}

interface Props { topSellers?: Seller[] }

export default function TopSellersSection({ topSellers: initialSellers }: Props) {
  const [sellers, setSellers] = useState<Seller[]>(initialSellers ?? [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let controller = new AbortController()

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await getTopSellers(6, controller.signal)
        if ('success' in res && res.success) {
          setSellers(res.data)
        } else {
          setError((res as any).error || 'Failed to load top sellers')
        }
      } catch (err) {
        setError('Failed to load top sellers')
      } finally {
        setLoading(false)
      }
    }

    load()

    return () => controller.abort()
  }, [])

  return (
    <section className="space-y-6 px-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Top Sellers</h2>
        <Button variant="ghost">See all</Button>
      </div>

      {loading && <div className="text-sm text-muted-foreground">Loading top sellers…</div>}
      {error && <div className="text-sm text-destructive">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sellers.map((seller) => (
          <SellerCard key={seller.id} seller={seller} />
        ))}
      </div>
    </section>
  )
}
