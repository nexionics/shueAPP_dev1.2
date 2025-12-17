import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Button } from '@/components/Button'
import { Gavel } from 'lucide-react'
import { formatPrice, getTimeRemaining } from '@/lib/data'

interface Auction {
  id: string
  productId: string
  sellerId: string
  startingBid: number
  currentBid: number
  buyNowPrice: number
  startDate: string
  endDate: string
  status: string
  bidCount: number
  watchers: number
  size: string
  condition: string
  description: string
}

interface Props { activeAuctions: Auction[] }

export default function LiveAuctionsSection({ activeAuctions }: Props) {
  return (
    <section className="space-y-6 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Gavel className="h-6 w-6" />
          <h2 className="text-3xl font-bold">Live Auctions</h2>
        </div>
        <Button variant="ghost">See all</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {activeAuctions.map((auction) => (
          <Card key={auction.id} className="cursor-pointer hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Auction #{auction.id}</CardTitle>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <span>{getTimeRemaining(auction.endDate)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">Size {auction.size}</div>
              <div className="space-y-1">
                <div className="text-lg font-bold">{formatPrice(auction.currentBid)}</div>
                <div className="text-xs text-muted-foreground">
                  {auction.bidCount} bids • {auction.watchers} watching
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
