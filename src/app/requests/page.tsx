import React from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card"
import { Button } from "@/components/Button"
import { Badge } from "@/components/Badge"
import { 
  Users, 
  MapPin, 
  Calendar, 
  DollarSign,
  MessageCircle,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react"
import { getRequests, Request, formatPrice } from "@/lib/data"

function getStatusColor(status: string) {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'fulfilled':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'expired':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'active':
      return <Clock className="h-3 w-3" />
    case 'fulfilled':
      return <CheckCircle className="h-3 w-3" />
    case 'expired':
      return <XCircle className="h-3 w-3" />
    default:
      return <Clock className="h-3 w-3" />
  }
}

function getTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}

function getPlaceholderImage(productName: string, brand: string) {
  const brandLower = brand.toLowerCase()
  const productLower = productName.toLowerCase()
  
  if (brandLower.includes('jordan') || productLower.includes('jordan')) {
    return '/placeholder-jordan.jpg'
  } else if (brandLower.includes('nike') || productLower.includes('nike')) {
    return '/placeholder-nike.jpg'
  } else if (brandLower.includes('adidas') || productLower.includes('yeezy')) {
    return '/placeholder-adidas.jpg'
  } else if (brandLower.includes('new balance')) {
    return '/placeholder-newbalance.jpg'
  } else {
    return '/placeholder-shoe.jpg'
  }
}

function getMockReleaseDate(productName: string) {
  const productLower = productName.toLowerCase()
  
  if (productLower.includes('travis scott')) {
    return '2023-07-21'
  } else if (productLower.includes('black cat')) {
    return '2024-02-17'
  } else if (productLower.includes('yeezy')) {
    return '2023-12-02'
  } else if (productLower.includes('off-white')) {
    return '2023-10-13'
  } else if (productLower.includes('fragment')) {
    return '2024-01-12'
  } else {
    return '2023-11-15'
  }
}

export default async function RequestsPage() {
  const requests = getRequests()
  const activeRequests = requests.filter((request: Request) => request.status === 'active')
  const fulfilledRequests = requests.filter((request: Request) => request.status === 'fulfilled')
  const expiredRequests = requests.filter((request: Request) => request.status === 'expired')

  const getShoeImage = (productName: string, brand: string) => {
    const productLower = productName.toLowerCase()
    
    if (productLower.includes('travis scott') && productLower.includes('dunk')) {
      return 'https://images.stockx.com/images/Nike-Dunk-Low-Travis-Scott.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1627495005'
    } else if (productLower.includes('black cat')) {
      return 'https://images.stockx.com/images/Air-Jordan-4-Retro-Black-Cat-2020.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1609372857'
    } else if (productLower.includes('off-white') && productLower.includes('blazer')) {
      return 'https://images.stockx.com/images/Nike-Blazer-Mid-Off-White-All-Hallows-Eve.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1538080256'
    } else if (productLower.includes('yeezy') && productLower.includes('700')) {
      return 'https://images.stockx.com/images/Adidas-Yeezy-Boost-700-Wave-Runner.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1606325289'
    } else if (productLower.includes('fragment') && productLower.includes('travis scott')) {
      return 'https://images.stockx.com/images/Air-Jordan-1-Low-Fragment-Travis-Scott.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1627495005'
    } else if (productLower.includes('patta') && productLower.includes('air max')) {
      return 'https://images.stockx.com/images/Nike-Air-Max-1-Patta-Waves-Noise-Aqua.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1606325289'
    } else if (productLower.includes('bad bunny')) {
      return 'https://images.stockx.com/images/Adidas-Forum-Low-Bad-Bunny-Pink.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1606325289'
    } else {
      return getPlaceholderImage(productName, brand)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Users className="h-8 w-8" />
          <h1 className="text-4xl font-bold">Shoe Requests</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Browse popular shoe requests from the community. Find what people are looking for and make offers to sell.
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">{activeRequests.length} Active Requests</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">{fulfilledRequests.length} Fulfilled</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">{expiredRequests.length} Expired</span>
          </div>
        </div>
      </div>

      {/* Active Requests */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-green-700">Active Requests</h2>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {activeRequests.length} requests
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeRequests.map((request: Request) => (
            <Card key={request.id} className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg line-clamp-2">{request.productName}</CardTitle>
                    <div className="text-sm text-muted-foreground">{request.brand}</div>
                  </div>
                  <Badge className={getStatusColor(request.status)}>
                    {getStatusIcon(request.status)}
                    <span className="ml-1 capitalize">{request.status}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Shoe Image */}
                <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={getShoeImage(request.productName, request.brand)}
                    alt={request.productName}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Size</div>
                    <div className="font-semibold">US {request.size}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Max Offer</div>
                    <div className="font-bold text-lg text-green-600">{formatPrice(request.maxPrice)}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Release: {new Date(getMockReleaseDate(request.productName)).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{request.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Posted {getTimeAgo(request.createdDate)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Request Details</div>
                  <p className="text-sm line-clamp-3">{request.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-muted-foreground">
                    by {request.requesterName}
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Contact
                    </Button>
                    <Button size="sm">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Make Offer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Fulfilled Requests */}
      {fulfilledRequests.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-blue-700">Recently Fulfilled</h2>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {fulfilledRequests.length} fulfilled
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {fulfilledRequests.map((request: Request) => (
              <Card key={request.id} className="border-l-4 border-l-blue-500 opacity-75">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm line-clamp-1">{request.productName}</h3>
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusIcon(request.status)}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Size {request.size}</span>
                      <span className="font-bold text-blue-600">{formatPrice(request.maxPrice)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Fulfilled {getTimeAgo(request.createdDate)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Expired Requests */}
      {expiredRequests.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-700">Expired Requests</h2>
            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
              {expiredRequests.length} expired
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {expiredRequests.map((request: Request) => (
              <Card key={request.id} className="border-l-4 border-l-gray-400 opacity-60">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm line-clamp-1">{request.productName}</h3>
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusIcon(request.status)}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Size {request.size}</span>
                      <span className="font-bold text-gray-600">{formatPrice(request.maxPrice)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Expired {getTimeAgo(request.createdDate)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
