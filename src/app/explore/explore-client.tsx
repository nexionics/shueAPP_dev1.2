'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { ItemCard } from "@/components/ItemCard"
import { formatPrice, Product } from "@/lib/data"
import { Search, Star, TrendingUp } from "lucide-react"
import Image from "next/image"

interface FloatingOrb {
  id: string
  product: Product
  x: number
  y: number
  size: number
  velocity: { x: number; y: number }
  rotation: number
  rotationSpeed: number
}

interface ExploreClientProps {
  sections: {
    featuredProducts: Product[]
    topSellers: {
      id: string
      name: string
      username: string
      avatar: string
      rating: number
      totalSales: number
      location: string
      joinedDate: string
      verified: boolean
      bio: string
      specialties: string[]
    }[]
    activeAuctions: {
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
    }[]
    activeRaffles: {
      id: string
      productName: string
      brand: string
      images: string[]
      retailPrice: number
      entryPrice: number
      totalEntries: number
      maxEntries: number
      startDate: string
      endDate: string
      drawDate: string
      status: string
      sizes: string[]
      description: string
      rules: string[]
      winner?: string
    }[]
    newPreorders: {
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
    }[]
    recentRequests: {
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
    }[]
  }
}

export function ExploreClient({ sections }: ExploreClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [floatingOrbs, setFloatingOrbs] = useState<FloatingOrb[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    if (sections && typeof window !== 'undefined') {
      const orbs: FloatingOrb[] = sections.featuredProducts.slice(0, 8).map((product: Product) => ({
        id: product.id,
        product,
        x: Math.random() * (window.innerWidth - 200),
        y: Math.random() * (window.innerHeight - 200) + 100,
        size: 80 + Math.random() * 40,
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2
        },
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2
      }))
      setFloatingOrbs(orbs)
    }
  }, [sections])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const animateOrbs = () => {
      setFloatingOrbs(prevOrbs => 
        prevOrbs.map(orb => {
          let newX = orb.x + orb.velocity.x
          let newY = orb.y + orb.velocity.y
          let newVelX = orb.velocity.x
          let newVelY = orb.velocity.y

          if (newX <= 0 || newX >= window.innerWidth - orb.size) {
            newVelX = -newVelX
            newX = Math.max(0, Math.min(window.innerWidth - orb.size, newX))
          }
          if (newY <= 100 || newY >= window.innerHeight - orb.size) {
            newVelY = -newVelY
            newY = Math.max(100, Math.min(window.innerHeight - orb.size, newY))
          }

          return {
            ...orb,
            x: newX,
            y: newY,
            velocity: { x: newVelX, y: newVelY },
            rotation: orb.rotation + orb.rotationSpeed
          }
        })
      )
    }

    const interval = setInterval(animateOrbs, 50)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const allProducts = sections?.featuredProducts || []
      const results = allProducts.filter((product: Product) => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase()) ||
        product.colorway.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 12)
      setSearchResults(results)
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const categories = [
    { id: 'all', label: 'All', icon: Star },
    { id: 'jordan', label: 'Jordan', icon: TrendingUp },
    { id: 'nike', label: 'Nike', icon: TrendingUp },
    { id: 'adidas', label: 'Adidas', icon: TrendingUp },
    { id: 'yeezy', label: 'Yeezy', icon: TrendingUp }
  ]

  return (
    <>
      {/* Floating Orbs Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {floatingOrbs.map((orb) => (
          <div
            key={orb.id}
            className="absolute pointer-events-auto cursor-pointer group"
            style={{
              left: orb.x,
              top: orb.y,
              width: orb.size,
              height: orb.size,
              transform: `rotate(${orb.rotation}deg)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <div className="relative w-full h-full rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110 bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm border border-white/20">
              <Image
                src={orb.product.images[0] || "/placeholder-shoe.jpg"}
                alt={orb.product.name}
                fill
                className="object-cover rounded-full"
              />
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-white text-center p-2">
                  <div className="text-xs font-semibold truncate">{orb.product.name}</div>
                  <div className="text-xs opacity-80">Size {orb.product.sizes[0]?.size}</div>
                  <div className="text-xs font-bold">{formatPrice(orb.product.sizes[0]?.price || 0)}</div>
                  <div className="text-xs opacity-60">ID: {orb.product.sellerId}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Category Section */}
      <div className="relative z-10 pt-32">
        <div className="text-center space-y-6 px-4">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for sneakers..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  handleSearch(e.target.value)
                }}
                className="pl-12 pr-4 py-6 text-lg rounded-full border-2 border-primary/20 focus:border-primary/50 bg-background/80 backdrop-blur-sm"
              />
            </div>
            {isSearching && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              </div>
            )}
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="rounded-full"
              >
                <category.icon className="w-4 h-4 mr-2" />
                {category.label}
              </Button>
            ))}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-6 mt-12">
              <h2 className="text-3xl font-bold">Search Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map((product) => (
                  <ItemCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
