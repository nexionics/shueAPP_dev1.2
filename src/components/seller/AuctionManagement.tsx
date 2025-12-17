'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { 
  Gavel, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  Calendar
} from 'lucide-react'

// Mock auction data based on the existing auctions.json structure
const sellerAuctions = [
  {
    id: "1",
    productName: "Air Jordan 1 Retro High OG Chicago",
    brand: "Jordan",
    colorway: "Chicago",
    size: "9.5",
    condition: "New",
    startingBid: 1800,
    currentBid: 2150,
    buyNowPrice: 2500,
    startDate: "2024-02-10T10:00:00Z",
    endDate: "2024-02-17T22:00:00Z",
    status: "active",
    bidCount: 12,
    watchers: 45,
    description: "Deadstock Air Jordan 1 Chicago. Never worn, original box included.",
    timeRemaining: "2 days 14 hours"
  },
  {
    id: "2",
    productName: "Travis Scott x Air Jordan 1 Low",
    brand: "Jordan",
    colorway: "Mocha",
    size: "10",
    condition: "New",
    startingBid: 1500,
    currentBid: 1750,
    buyNowPrice: 2000,
    startDate: "2024-02-12T14:00:00Z",
    endDate: "2024-02-19T20:00:00Z",
    status: "active",
    bidCount: 8,
    watchers: 32,
    description: "Travis Scott x Air Jordan 1 Low in pristine condition. All accessories included.",
    timeRemaining: "4 days 8 hours"
  },
  {
    id: "3",
    productName: "Off-White x Nike Air Force 1",
    brand: "Nike",
    colorway: "White",
    size: "9",
    condition: "New",
    startingBid: 2200,
    currentBid: 2650,
    buyNowPrice: 3100,
    startDate: "2024-02-08T16:00:00Z",
    endDate: "2024-02-15T18:00:00Z",
    status: "ended",
    bidCount: 18,
    watchers: 67,
    description: "Off-White x Nike Air Force 1 - The Ten collection. Museum quality.",
    finalPrice: 2650,
    winner: "user_12345"
  },
  {
    id: "4",
    productName: "Yeezy Boost 350 V2 Zebra",
    brand: "Adidas",
    colorway: "Zebra",
    size: "10.5",
    condition: "New",
    startingBid: 280,
    currentBid: 315,
    buyNowPrice: 350,
    startDate: "2024-02-14T12:00:00Z",
    endDate: "2024-02-21T15:00:00Z",
    status: "active",
    bidCount: 6,
    watchers: 23,
    description: "Yeezy Boost 350 V2 Zebra restock. Authentic with receipt.",
    timeRemaining: "6 days 3 hours"
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800'
    case 'ended': return 'bg-gray-100 text-gray-800'
    case 'draft': return 'bg-yellow-100 text-yellow-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}


export default function AuctionManagement() {

  const activeAuctions = sellerAuctions.filter(auction => auction.status === 'active')
  const endedAuctions = sellerAuctions.filter(auction => auction.status === 'ended')
  const totalRevenue = endedAuctions.reduce((sum, auction) => sum + (auction.finalPrice || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Auction Management</h2>
          <p className="text-muted-foreground">Create and manage your sneaker auctions</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Auction
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Auctions</p>
                <p className="text-2xl font-bold">{activeAuctions.length}</p>
              </div>
              <Gavel className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bids</p>
                <p className="text-2xl font-bold">
                  {sellerAuctions.reduce((sum, auction) => sum + auction.bidCount, 0)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Watchers</p>
                <p className="text-2xl font-bold">
                  {sellerAuctions.reduce((sum, auction) => sum + auction.watchers, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Auction Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${totalRevenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Auctions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sellerAuctions.map((auction) => (
          <Card key={auction.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{auction.productName}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {auction.brand} • {auction.colorway} • Size {auction.size}
                  </p>
                </div>
                <Badge className={getStatusColor(auction.status)}>
                  {auction.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Pricing Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Starting Bid</p>
                  <p className="text-sm font-medium">${auction.startingBid}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {auction.status === 'ended' ? 'Final Price' : 'Current Bid'}
                  </p>
                  <p className="text-sm font-bold text-green-600">
                    ${auction.status === 'ended' ? auction.finalPrice : auction.currentBid}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Buy Now</p>
                  <p className="text-sm font-medium">${auction.buyNowPrice}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Bids</p>
                  <p className="text-sm font-medium">{auction.bidCount}</p>
                </div>
              </div>

              {/* Time and Activity */}
              <div className="space-y-2">
                {auction.status === 'active' && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Ends in:</span>
                    <span className="font-medium text-orange-600">{auction.timeRemaining}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{auction.watchers} watchers</span>
                </div>

                {auction.status === 'ended' && auction.winner && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Won by:</span>
                    <span className="font-medium">{auction.winner}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {auction.description}
              </p>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                {auction.status === 'active' && (
                  <>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </>
                )}
                {auction.status === 'ended' && (
                  <Button size="sm" variant="outline" className="flex-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    Relist
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
