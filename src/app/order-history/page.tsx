"use client"
import React from 'react'
import { getProducts, formatDate } from '@/lib/data'
import { ItemCard } from '@/components/ItemCard'

export default function OrderHistoryPage() {
  const orders = getProducts().slice(0, 8)

  return (
    <main>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4">Order History</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {orders.map(o => (
            <div key={o.id}>
              <ItemCard product={o} />
              <div className="mt-2 text-sm text-muted-foreground">Ordered: {formatDate(o.releaseDate || new Date().toISOString())}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
