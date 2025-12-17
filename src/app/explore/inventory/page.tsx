import React from 'react'
import InventoryClient from './inventory-client'

export default  function InventoryPage() {
  return (
    <main>
      <h1 className="text-3xl font-bold mb-4">Explore Inventory</h1>
      <p className="text-sm text-muted-foreground mb-6">Filter and find the perfect pair — search by brand, color, price and more.</p>
      <InventoryClient />
    </main>
  )
}
