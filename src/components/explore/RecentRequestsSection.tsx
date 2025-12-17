import React from 'react'
import { Card, CardContent } from '@/components/Card'
import { Users } from 'lucide-react'
import { formatPrice } from '@/lib/data'

interface RequestItem {
  id: string
  productName: string
  brand: string
  size: string
  maxPrice: number
  requesterId: string
  requesterName: string
  createdDate: string
  status: string
  description: string
  location: string
}

interface Props { recentRequests: RequestItem[] }

export default function RecentRequestsSection({ recentRequests }: Props) {
  return (
    <section className="space-y-6 px-4 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6" />
          <h2 className="text-3xl font-bold">Recent Requests</h2>
        </div>
        <div />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentRequests.map((request) => (
          <Card key={request.id} className="cursor-pointer hover:shadow-lg transition-all">
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold line-clamp-1">{request.productName}</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Size {request.size}</span>
                  <span className="font-bold">{formatPrice(request.maxPrice)}</span>
                </div>
                <div className="text-xs text-muted-foreground">by {request.requesterName} • {request.location}</div>
                <p className="text-xs text-muted-foreground line-clamp-2">{request.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
