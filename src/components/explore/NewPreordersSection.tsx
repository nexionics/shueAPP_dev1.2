import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Button } from '@/components/Button'
import { formatPrice } from '@/lib/data'

interface Preorder {
  id: string
  productName: string
  brand: string
  colorway: string
  images: string[]
  retailPrice: number
  preorderPrice: number
  releaseDate: string
  preorderStartDate: string
  preorderEndDate: string
  status: string
  availableSizes: string[]
  totalOrders: number
  maxOrders: number
  sellerId: string
  description: string
  features: string[]
  depositRequired: number
  shippingDate: string
}

interface Props { newPreorders: Preorder[] }

export default function NewPreordersSection({ newPreorders }: Props) {
  return (
    <section className="space-y-6 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-3xl font-bold">New Preorders</CardTitle>
        </div>
        <Button variant="ghost">See all</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {newPreorders.map((preorder) => (
          <Card key={preorder.id} className="cursor-pointer hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm line-clamp-2">{preorder.productName}</CardTitle>
              <div className="text-xs text-muted-foreground">{preorder.brand}</div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs">Retail:</span>
                  <span className="text-xs line-through text-muted-foreground">{formatPrice(preorder.retailPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs">Preorder:</span>
                  <span className="text-sm font-bold">{formatPrice(preorder.preorderPrice)}</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">{preorder.totalOrders}/{preorder.maxOrders} ordered</div>
              <div className="text-xs text-muted-foreground">Ships: {new Date(preorder.shippingDate).toLocaleDateString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
