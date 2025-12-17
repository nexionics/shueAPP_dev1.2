"use client"
import React from 'react'
import { getProducts, getSellers, getAuctions } from '@/lib/data'

export default function AdminPanelPage() {
  const products = getProducts()
  const sellers = getSellers()
  const auctions = getAuctions()

  return (
    <main>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-white rounded shadow-sm">
            <h2 className="font-semibold">Products</h2>
            <div className="text-2xl mt-2">{products.length}</div>
          </div>
          <div className="p-4 bg-white rounded shadow-sm">
            <h2 className="font-semibold">Sellers</h2>
            <div className="text-2xl mt-2">{sellers.length}</div>
          </div>
          <div className="p-4 bg-white rounded shadow-sm">
            <h2 className="font-semibold">Active Auctions</h2>
            <div className="text-2xl mt-2">{auctions.filter(a => a.status === 'active').length}</div>
          </div>
        </div>

        <section className="mt-6 p-4 bg-white rounded shadow-sm">
          <h3 className="font-semibold">Quick Actions</h3>
          <div className="mt-4 flex gap-3">
            <button className="px-3 py-2 border rounded">Approve Listings</button>
            <button className="px-3 py-2 border rounded">Manage Users</button>
            <button className="px-3 py-2 border rounded">Review Sponsors</button>
          </div>
        </section>
      </div>
    </main>
  )
}
