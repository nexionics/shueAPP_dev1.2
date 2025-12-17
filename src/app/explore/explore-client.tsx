'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { ItemCard } from "@/components/ItemCard"
import { formatPrice, Product } from "@/lib/data"
import { Search, Star, TrendingUp } from "lucide-react"
import Image from "next/image"
import { searchProducts } from '@/api/sneakers'

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
  
  const searchAbortRef = useRef<AbortController | null>(null)

  // useEffect(() => {
  //   // Initialize floating orbs based on images found in /public/bubbles
  //   if (typeof window === 'undefined') return

  //   const extensions = ['png', 'jpg', 'jpeg', 'webp', 'avif']
  //   const maxCandidates = 12
  //   const maxBubbles = 6

  //   // Try both naming conventions: `bubble{n}.{ext}` and `{n}.{ext}`
  //   const candidatePaths: string[] = []
  //   for (let i = 1; i <= maxCandidates; i++) {
  //     for (const ext of extensions) {
  //       candidatePaths.push(`/bubbles/bubble${i}.${ext}`)
  //       candidatePaths.push(`/bubbles/${i}.${ext}`)
  //     }
  //   }

  //   const checkImage = (url: string) =>
  //     new Promise<boolean>((resolve) => {
  //       // Use a DOM-created <img> element rather than `new Image()` because
  //       // the file imports `Image` from `next/image` which shadows the global
  //       // Image constructor in this module scope.
  //       const img = typeof document !== 'undefined' ? document.createElement('img') : null
  //       if (!img) return resolve(false)
  //       img.onload = () => resolve(true)
  //       img.onerror = () => resolve(false)
  //       img.src = url
  //     })

  //   ;(async () => {
  //     const results = await Promise.all(
  //       candidatePaths.map(async (p) => ({ p, ok: await checkImage(p) }))
  //     )

  //     const available = results.filter(r => r.ok).map(r => r.p)
  //     const chosen = available.slice(0, maxBubbles)

  //     // If no bubble images found, fall back to featured products
  //     if (chosen.length === 0 && sections && sections.featuredProducts?.length) {
  //       const orbs: FloatingOrb[] = sections.featuredProducts.slice(0, 6).map((product: Product) => ({
  //         id: product.id,
  //         product,
  //         x: Math.random() * (window.innerWidth - 200),
  //         y: Math.random() * (window.innerHeight - 200) + 100,
  //         size: 80 + Math.random() * 40,
  //         velocity: {
  //           x: (Math.random() - 0.5) * 2,
  //           y: (Math.random() - 0.5) * 2
  //         },
  //         rotation: Math.random() * 360,
  //         rotationSpeed: (Math.random() - 0.5) * 2
  //       }))
  //       setFloatingOrbs(orbs)
  //       return
  //     }

  //     const orbs: FloatingOrb[] = chosen.map((path, idx) => {
  //       const fakeProduct: Product = {
  //         id: `bubble-${idx}-${path}`,
  //         name: path.split('/').pop() || `bubble-${idx}`,
  //         brand: 'Bubbles',
  //         colorway: 'Gradient',
  //         releaseDate: new Date().toISOString(),
  //         retailPrice: 0,
  //         images: [path],
  //         sizes: [{ size: 'One Size', price: 0 }],
  //         category: 'bubble',
  //         condition: 'new',
  //         sellerId: 'system'
  //       }

  //       return {
  //         id: fakeProduct.id,
  //         product: fakeProduct,
  //         x: Math.random() * (window.innerWidth - 200),
  //         y: Math.random() * (window.innerHeight - 200) + 100,
  //         size: 80 + Math.random() * 40,
  //         velocity: {
  //           x: (Math.random() - 0.5) * 2,
  //           y: (Math.random() - 0.5) * 2
  //         },
  //         rotation: Math.random() * 360,
  //         rotationSpeed: (Math.random() - 0.5) * 2
  //       }
  //     })

  //     setFloatingOrbs(orbs)
  //   })()
  // }, [sections])

  // useEffect(() => {
  //   if (typeof window === 'undefined') return

  //   const animateOrbs = () => {
  //     setFloatingOrbs(prevOrbs => 
  //       prevOrbs.map(orb => {
  //         let newX = orb.x + orb.velocity.x
  //         let newY = orb.y + orb.velocity.y
  //         let newVelX = orb.velocity.x
  //         let newVelY = orb.velocity.y

  //         if (newX <= 0 || newX >= window.innerWidth - orb.size) {
  //           newVelX = -newVelX
  //           newX = Math.max(0, Math.min(window.innerWidth - orb.size, newX))
  //         }
  //         if (newY <= 100 || newY >= window.innerHeight - orb.size) {
  //           newVelY = -newVelY
  //           newY = Math.max(100, Math.min(window.innerHeight - orb.size, newY))
  //         }

  //         return {
  //           ...orb,
  //           x: newX,
  //           y: newY,
  //           velocity: { x: newVelX, y: newVelY },
  //           rotation: orb.rotation + orb.rotationSpeed
  //         }
  //       })
  //     )
  //   }

  //   const interval = setInterval(animateOrbs, 50)
  //   return () => clearInterval(interval)
  // }, [])

  // // Previously fetched trending here — removed because Popular items are now rendered
  // // under the server-side "Popular Right Now" section. Keep the state available
  // // in case we reintroduce client-driven features.

  // // Debounced remote search using the Sneakers API
  // useEffect(() => {
  //   if (typeof window === 'undefined') return

  //   // if empty, clear results and skip (also abort any in-flight search)
  //   if (!searchQuery.trim()) {
  //     setSearchResults([])
  //     setIsSearching(false)
  //     if (searchAbortRef.current) {
  //       searchAbortRef.current.abort()
  //       searchAbortRef.current = null
  //     }
  //     return
  //   }

  //   setIsSearching(true)
  //   const timer = setTimeout(() => {
  //     ;(async () => {
  //       // Abort any previous in-flight fetch before starting a new one
  //       if (searchAbortRef.current) {
  //         searchAbortRef.current.abort()
  //         searchAbortRef.current = null
  //       }

  //       const controller = new AbortController()
  //       searchAbortRef.current = controller

  //       try {
  //         const res = await searchProducts(searchQuery, 12, controller.signal)
  //         if (res && Array.isArray(res.data)) {
  //           // Keep types compatible with existing ItemCard which expects Product from lib/data
  //           setSearchResults(res.data as any)
  //         } else {
  //           setSearchResults([])
  //         }
  //       } catch (err: any) {
  //         // If the request was aborted, silently ignore
  //         if (err && err.name === 'AbortError') {
  //           return
  //         }
  //         console.error('Remote search failed:', err)
  //         // fallback: try local featuredProducts search as graceful degradation
  //         try {
  //           const allProducts = sections?.featuredProducts || []
  //           const results = allProducts.filter((product: Product) => 
  //             (product.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
  //             (product.brand || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
  //             (product.colorway || '').toLowerCase().includes(searchQuery.toLowerCase())
  //           ).slice(0, 12)
  //           setSearchResults(results)
  //         } catch (e) {
  //           setSearchResults([])
  //         }
  //       } finally {
  //         setIsSearching(false)
  //         // clear ref if this controller is still current
  //         if (searchAbortRef.current === controller) searchAbortRef.current = null
  //       }
  //     })()
  //   }, 350)

  //   return () => {
  //     clearTimeout(timer)
  //     if (searchAbortRef.current) {
  //       searchAbortRef.current.abort()
  //       searchAbortRef.current = null
  //     }
  //   }
  // }, [searchQuery, sections])

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
      {/* <div className="fixed inset-0 pointer-events-none z-0">
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
                src={orb.product.images[0] || (orb.product as any).thumbnail || "/placeholder-shoe.svg"}
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
      </div> */}


    </>
  )
}
