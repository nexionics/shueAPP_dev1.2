"use client"
import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getProducts, formatPrice } from '@/lib/data'
import { ItemCard } from '@/components/ItemCard'

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()

  const recentPurchases = getProducts().slice(0, 4)

  return (
    <main>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="col-span-1 p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold">Profile</h2>
            {!isAuthenticated && <p className="text-muted-foreground">Not signed in</p>}
            {isAuthenticated && user && (
              <div className="mt-4 space-y-2">
                <p><strong>Name:</strong> {user.firstName || user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role || 'buyer'}</p>
              </div>
            )}
          </section>

          <section className="md:col-span-2 p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold">Recent Purchases</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentPurchases.map(p => (
                <div key={p.id} className="max-w-xs">
                  <ItemCard product={p} />
                  <div className="pt-2 text-sm text-muted-foreground">Approx. {formatPrice(p.retailPrice)}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
