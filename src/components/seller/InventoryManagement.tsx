'use client'

import { Card, CardContent } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/Dialog'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Package,
  DollarSign,
  Star
} from 'lucide-react'

// Mock inventory data - would come from API in real app
const inventoryItems = [
  {
    id: "1",
    name: "Air Jordan 1 Retro High OG",
    brand: "Jordan",
    colorway: "Chicago",
    size: "9.5",
    condition: "New",
    purchasePrice: 160,
    currentPrice: 2400,
    status: "listed",
    listingType: "auction",
    images: ["/images/aj1-chicago-1.jpg"],
    dateAdded: "2024-02-10",
    views: 156,
    watchers: 23
  },
  {
    id: "2",
    name: "Nike Dunk Low",
    brand: "Nike",
    colorway: "Panda",
    size: "10",
    condition: "New",
    purchasePrice: 100,
    currentPrice: 125,
    status: "listed",
    listingType: "buy-now",
    images: ["/images/dunk-panda-1.jpg"],
    dateAdded: "2024-02-12",
    views: 89,
    watchers: 12
  },
  {
    id: "3",
    name: "Travis Scott x Air Jordan 1 Low",
    brand: "Jordan",
    colorway: "Mocha",
    size: "11",
    condition: "New",
    purchasePrice: 130,
    currentPrice: 1900,
    status: "in-auction",
    listingType: "auction",
    images: ["/images/ts-aj1-low-1.jpg"],
    dateAdded: "2024-02-08",
    views: 234,
    watchers: 45
  },
  {
    id: "4",
    name: "Yeezy Boost 350 V2",
    brand: "Adidas",
    colorway: "Zebra",
    size: "9",
    condition: "New",
    purchasePrice: 220,
    currentPrice: 325,
    status: "draft",
    listingType: null,
    images: ["/images/yeezy-zebra-1.jpg"],
    dateAdded: "2024-02-14",
    views: 0,
    watchers: 0
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'listed': return 'bg-green-100 text-green-800'
    case 'in-auction': return 'bg-blue-100 text-blue-800'
    case 'sold': return 'bg-gray-100 text-gray-800'
    case 'draft': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getListingTypeIcon = (type: string | null) => {
  switch (type) {
    case 'auction': return '🔨'
    case 'buy-now': return '💰'
    case 'raffle': return '🎟️'
    default: return '📦'
  }
}


export default function InventoryManagement() {

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Inventory Management</h2>
          <p className="text-muted-foreground">Manage your sneaker collection and listings</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Add a new sneaker to your inventory
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">Product form will be implemented here</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{inventoryItems.length}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Listed Items</p>
                <p className="text-2xl font-bold">
                  {inventoryItems.filter(item => item.status === 'listed' || item.status === 'in-auction').length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">
                  ${inventoryItems.reduce((sum, item) => sum + item.currentPrice, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Potential Profit</p>
                <p className="text-2xl font-bold text-green-600">
                  ${inventoryItems.reduce((sum, item) => sum + (item.currentPrice - item.purchasePrice), 0).toLocaleString()}
                </p>
              </div>
              <Star className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventoryItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-square bg-gray-100 relative">
              <div className="absolute top-2 left-2">
                <Badge className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </div>
              <div className="absolute top-2 right-2">
                <span className="text-lg">{getListingTypeIcon(item.listingType)}</span>
              </div>
              {/* Placeholder for image */}
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <Package className="h-16 w-16" />
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-2">
                <div>
                  <h3 className="font-semibold text-sm">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">{item.brand} • {item.colorway}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Size {item.size}</span>
                  <Badge variant="outline" className="text-xs">{item.condition}</Badge>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Purchase:</span>
                    <span>${item.purchasePrice}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>Current:</span>
                    <span className="text-green-600">${item.currentPrice}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Profit:</span>
                    <span className="text-green-600">
                      +${item.currentPrice - item.purchasePrice} ({Math.round(((item.currentPrice - item.purchasePrice) / item.purchasePrice) * 100)}%)
                    </span>
                  </div>
                </div>

                {item.status !== 'draft' && (
                  <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                    <span>{item.views} views</span>
                    <span>{item.watchers} watchers</span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
