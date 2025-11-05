'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Package, 
  Gavel, 
  Ticket, 
  TrendingUp, 
  Eye, 
  DollarSign,
  Plus
} from 'lucide-react'
import InventoryManagement from '@/components/seller/inventory-management'
import AuctionManagement from '@/components/seller/auction-management'
import { SellerLocationSettings } from '@/components/seller/seller-location-settings'

// Mock seller data - in real app this would come from auth/API
const currentSeller = {
  id: "1",
  name: "SneakerKing",
  username: "sneakerking",
  rating: 4.9,
  totalSales: 1247,
  verified: true
}

// Mock data - in real app this would come from API
const sellerStats = {
  totalListings: 24,
  activeAuctions: 3,
  activeRaffles: 2,
  totalRevenue: 45680,
  monthlyRevenue: 8920,
  watchers: 156,
  pendingOrders: 5
}

const recentActivity = [
  { id: 1, type: 'auction', item: 'Air Jordan 1 Chicago', action: 'New bid received', time: '2 hours ago', amount: '$2,150' },
  { id: 2, type: 'sale', item: 'Nike Dunk Panda', action: 'Item sold', time: '4 hours ago', amount: '$125' },
  { id: 3, type: 'raffle', item: 'Travis Scott Dunk', action: 'Raffle entry', time: '6 hours ago', amount: '$15' },
  { id: 4, type: 'listing', item: 'Yeezy 350 Zebra', action: 'Listed for auction', time: '1 day ago', amount: '$280' }
]

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {currentSeller.name}</p>
        </div>
        <div className="flex items-center gap-2">
          {currentSeller.verified && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Verified Seller
            </Badge>
          )}
          <Badge variant="outline">
            ⭐ {currentSeller.rating} ({currentSeller.totalSales} sales)
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sellerStats.totalListings}</div>
            <p className="text-xs text-muted-foreground">Active inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${sellerStats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Auctions</CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sellerStats.activeAuctions}</div>
            <p className="text-xs text-muted-foreground">Ending this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Watchers</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sellerStats.watchers}</div>
            <p className="text-xs text-muted-foreground">Following your listings</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="auctions">Auctions</TabsTrigger>
          <TabsTrigger value="raffles">Raffles</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your sneaker listings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/add-listing">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Listing
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Gavel className="mr-2 h-4 w-4" />
                  Create Auction
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Ticket className="mr-2 h-4 w-4" />
                  Launch Raffle
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates on your listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{activity.item}</p>
                        <p className="text-xs text-muted-foreground">{activity.action}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{activity.amount}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Seller Location Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SellerLocationSettings />
          </div>
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryManagement />
        </TabsContent>

        <TabsContent value="auctions">
          <AuctionManagement />
        </TabsContent>

        <TabsContent value="raffles">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Raffle Management</CardTitle>
                <CardDescription>Launch and manage sneaker raffles</CardDescription>
              </div>
              <Button>
                <Ticket className="mr-2 h-4 w-4" />
                Create Raffle
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Raffle management interface will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Sales Analytics</CardTitle>
              <CardDescription>Track your performance and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Analytics dashboard will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
