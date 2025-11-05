"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Shield, Users } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface MapLocation {
  id: string
  type: 'seller' | 'safe-location'
  name: string
  lat: number
  lng: number
  rating?: number
  verified?: boolean
  description?: string
  address: string
}

// Mock data for demonstration
const mockLocations: MapLocation[] = [
  {
    id: "seller-1",
    type: "seller",
    name: "SneakerKing23",
    lat: 40.7589,
    lng: -73.9851,
    rating: 4.8,
    verified: true,
    description: "Verified seller with 500+ transactions",
    address: "Times Square Area, NYC"
  },
  {
    id: "seller-2",
    type: "seller",
    name: "KickCollector",
    lat: 40.7505,
    lng: -73.9934,
    rating: 4.6,
    verified: true,
    description: "Specializes in Jordan and Nike",
    address: "Chelsea, NYC"
  },
  {
    id: "seller-3",
    type: "seller",
    name: "UrbanSoles",
    lat: 40.7282,
    lng: -73.7949,
    rating: 4.3,
    verified: false,
    description: "New seller with great prices",
    address: "Queens, NYC"
  },
  {
    id: "safe-1",
    type: "safe-location",
    name: "Starbucks - 42nd Street",
    lat: 40.7580,
    lng: -73.9855,
    description: "Well-lit, busy location with security cameras",
    address: "1585 Broadway, New York, NY"
  },
  {
    id: "safe-2",
    type: "safe-location",
    name: "Apple Store - Fifth Avenue",
    lat: 40.7637,
    lng: -73.9723,
    description: "High security, public location",
    address: "767 5th Ave, New York, NY"
  },
  {
    id: "safe-3",
    type: "safe-location",
    name: "Bryant Park",
    lat: 40.7536,
    lng: -73.9832,
    description: "Public park with good lighting and foot traffic",
    address: "Bryant Park, New York, NY"
  }
]

export function FindSellersMap() {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null)
  const [showSellers, setShowSellers] = useState(true)
  const [showSafeLocations, setShowSafeLocations] = useState(true)
  const [sellerLocations, setSellerLocations] = useState<MapLocation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadSellerLocations()
  }, [])

  const loadSellerLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('seller_locations')
        .select(`
          user_id,
          zipcode,
          lat,
          lng,
          profiles!inner (
            id,
            name,
            rating
          )
        `)
        .eq('location_enabled', true)
        .not('lat', 'is', null)
        .not('lng', 'is', null)

      if (error) {
        console.error('Error loading seller locations:', error)
        setIsLoading(false)
        return
      }

      if (data) {
        const sellers: MapLocation[] = data.map((seller) => {
          const profile = Array.isArray(seller.profiles) ? seller.profiles[0] : seller.profiles
          return {
            id: seller.user_id,
            type: 'seller' as const,
            name: profile?.name || 'Anonymous Seller',
            lat: seller.lat!,
            lng: seller.lng!,
            rating: profile?.rating || undefined,
            verified: false,
            description: `Seller in ${seller.zipcode}`,
            address: `ZIP ${seller.zipcode}`
          }
        })
        setSellerLocations(sellers)
      }
    } catch (error) {
      console.error('Error loading seller locations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const safeLocations = mockLocations.filter(loc => loc.type === 'safe-location')
  const allLocations = [...sellerLocations, ...safeLocations]

  const filteredLocations = allLocations.filter(location => {
    if (location.type === 'seller' && !showSellers) return false
    if (location.type === 'safe-location' && !showSafeLocations) return false
    return true
  })

  return (
    <div className="relative w-full h-full bg-muted rounded-lg overflow-hidden">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <div className="bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="show-sellers"
                checked={showSellers}
                onChange={(e) => setShowSellers(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="show-sellers" className="text-sm font-medium flex items-center">
                <Users className="h-4 w-4 mr-1 text-blue-500" />
                Sellers
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="show-safe-locations"
                checked={showSafeLocations}
                onChange={(e) => setShowSafeLocations(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="show-safe-locations" className="text-sm font-medium flex items-center">
                <Shield className="h-4 w-4 mr-1 text-green-500" />
                Safe Locations
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Mock Map Area */}
      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 relative">
        {/* Map Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }} />
        </div>

        {/* Location Markers */}
        {filteredLocations.map((location) => (
          <div
            key={location.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              left: `${((location.lng + 74) * 1000) % 100}%`,
              top: `${((location.lat - 40.7) * 2000) % 100}%`
            }}
            onClick={() => setSelectedLocation(location)}
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110
              ${location.type === 'seller' 
                ? 'bg-blue-500 text-white' 
                : 'bg-green-500 text-white'
              }
              ${selectedLocation?.id === location.id ? 'ring-4 ring-white ring-opacity-50' : ''}
            `}>
              {location.type === 'seller' ? (
                <Users className="h-4 w-4" />
              ) : (
                <Shield className="h-4 w-4" />
              )}
            </div>
            
            {location.verified && location.type === 'seller' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-white">
                <Star className="h-2 w-2 text-white m-0.5" />
              </div>
            )}
          </div>
        ))}

        {/* Center Map Indicator */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg">
            <div className="w-full h-full bg-red-500 rounded-full animate-ping opacity-75"></div>
          </div>
        </div>
      </div>

      {/* Location Details Panel */}
      {selectedLocation && (
        <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold">{selectedLocation.name}</h3>
                {selectedLocation.verified && (
                  <Badge variant="secondary" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {selectedLocation.rating && (
                  <Badge variant="outline" className="text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    {selectedLocation.rating}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                {selectedLocation.address}
              </p>
              {selectedLocation.description && (
                <p className="text-sm">{selectedLocation.description}</p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedLocation(null)}
            >
              Close
            </Button>
          </div>
          
          <div className="flex space-x-2 mt-3">
            <Button size="sm" className="flex-1">
              <MapPin className="h-4 w-4 mr-2" />
              Get Directions
            </Button>
            {selectedLocation.type === 'seller' && (
              <Button size="sm" variant="outline" className="flex-1">
                View Profile
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Map Attribution */}
      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
        Interactive Map View
      </div>
    </div>
  )
}
