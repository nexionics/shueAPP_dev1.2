"use client"
import React, { useState } from 'react'
import { getProducts, formatPrice } from '@/lib/data'

export default function CartPage() {
  const items = getProducts().slice(0, 3)
  const [cart, setCart] = useState(items.map(p => ({ ...p, qty: 1 })))

  const subtotal = cart.reduce((s, c) => s + (c.retailPrice ?? 0) * c.qty, 0)

  return (
    <main>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-4 p-4 bg-white rounded shadow-sm">
                <img src={item.images[0] || item.thumbnail || '/placeholder-shoe.svg'} alt={item.name} width={80} height={80} />
                <div className="flex-1">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-muted-foreground">{formatPrice(item.retailPrice)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-2 py-1 border rounded">-</button>
                  <span>{item.qty}</span>
                  <button className="px-2 py-1 border rounded">+</button>
                </div>
              </div>
            ))}
          </div>

          <aside className="p-4 bg-white rounded shadow-sm">
            <h2 className="text-lg font-bold">Summary</h2>
            <div className="mt-4">Subtotal: <strong>{formatPrice(subtotal)}</strong></div>
            <div className="mt-6">
              <button className="w-full px-4 py-2 bg-black text-white rounded">Proceed to Checkout</button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
