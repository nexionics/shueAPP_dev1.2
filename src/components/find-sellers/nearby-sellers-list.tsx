"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, MessageCircle, Shield, Clock, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface NearbySeller {
  id: string
  name: string
  username: string
  avatar?: string
  rating: number | null
  totalSales: number
  distance: number
  verified: boolean
  lastActive: string
  specialties: string[]
  location: string
  responseTime: string
}

// Mock data for nearby sellers
const mockNearbySellers: NearbySeller[] = [
  {
    id: "1",
    name: "Alex Chen",
    username: "SneakerKing23",
    avatar: "/avatars/alex.jpg",
    rating: 4.8,
    totalSales: 547,
    distance: 0.8,
    verified: true,
    lastActive: "2 hours ago",
    specialties: ["Jordan", "Nike", "Yeezy"],
    location: "Manhattan, NY",
    responseTime: "Usually responds within 1 hour"
  },
  {
    id: "2",
    name: "Maria Rodriguez",
    username: "KickCollector",
    avatar: "/avatars/maria.jpg",
    rating: 4.6,
    totalSales: 312,
    distance: 1.2,
    verified: true,
    lastActive: "30 minutes ago",
    specialties: ["Nike", "Adidas", "New Balance"],
    location: "Brooklyn, NY",
    responseTime: "Usually responds within 30 minutes"
  },
  {
    id: "3",
    name: "Jordan Smith",
    username: "UrbanSoles",
    avatar: "/avatars/jordan.jpg",
    rating: 4.3,
    totalSales: 89,
    distance: 2.1,
    verified: false,
    lastActive: "1 day ago",
    specialties: ["Jordan", "Converse"],
    location: "Queens, NY",
    responseTime: "Usually responds within 4 hours"
  },
  {
    id: "4",
    name: "Sarah Kim",
    username: "SneakerSarah",
    avatar: "/avatars/sarah.jpg",
    rating: 4.9,
    totalSales: 823,
    distance: 2.8,
    verified: true,
    lastActive: "Online now",
    specialties: ["Yeezy", "Off-White", "Travis Scott"],
    location: "Manhattan, NY",
    responseTime: "Usually responds immediately"
  },
  {
    id: "5",
    name: "Mike Johnson",
    username: "RetroMike",
    avatar: "/avatars/mike.jpg",
    rating: 4.4,
    totalSales: 156,
    distance: 3.5,
    verified: false,
    lastActive: "4 hours ago",
    specialties: ["Retro Jordan", "Vintage Nike"],
    location: "Bronx, NY",
    responseTime: "Usually responds within 2 hours"
  }
]

export function NearbySellersList() {
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null)
  const [sellers, setSellers] = useState<NearbySeller[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadNearbySellers()
  }, [])

  const loadNearbySellers = async () => {
    try {
      const { data, error } = await supabase
        .from('seller_locations')
        .select(`
          user_id,
          zipcode,
          profiles!inner (
            id,
            name,
            email,
            rating
          )
        `)
        .eq('location_enabled', true)

      if (error) {
        console.error('Error loading nearby sellers:', error)
        setIsLoading(false)
        return
      }

      if (data) {
        const nearbySellers: NearbySeller[] = data.map((seller) => {
          const profile = Array.isArray(seller.profiles) ? seller.profiles[0] : seller.profiles
          return {
            id: seller.user_id,
            name: profile?.name || 'Anonymous Seller',
            username: profile?.email?.split('@')[0] || 'user',
            avatar: undefined,
            rating: profile?.rating,
            totalSales: 0,
            distance: 0,
            verified: false,
            lastActive: 'Recently active',
            specialties: ['Sneakers'],
            location: `ZIP ${seller.zipcode}`,
            responseTime: 'Usually responds within a few hours'
          }
        })
        setSellers(nearbySellers)
      }
    } catch (error) {
      console.error('Error loading nearby sellers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleContactSeller = (sellerId: string) => {
    console.log("Contacting seller:", sellerId)
  }

  const handleViewProfile = (sellerId: string) => {
    console.log("Viewing profile:", sellerId)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto">
      {sellers.map((seller) => (
        <div
          key={seller.id}
          className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
            selectedSeller === seller.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => setSelectedSeller(selectedSeller === seller.id ? null : seller.id)}
        >
          <div className="flex items-start space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={seller.avatar} alt={seller.name} />
              <AvatarFallback>{seller.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-sm truncate">{seller.name}</h3>
                {seller.verified && (
                  <Badge variant="secondary" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground mb-1">@{seller.username}</p>
              
              <div className="flex items-center space-x-3 text-xs text-muted-foreground mb-2">
                <div className="flex items-center">
                  <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                  <span>{seller.rating}</span>
                </div>
                <span>•</span>
                <span>{seller.totalSales} sales</span>
                <span>•</span>
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{seller.distance} mi</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-2">
                {seller.specialties.slice(0, 2).map((specialty) => (
                  <Badge key={specialty} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
                {seller.specialties.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{seller.specialties.length - 2}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>Active {seller.lastActive}</span>
              </div>
            </div>
          </div>
          
          {selectedSeller === seller.id && (
            <div className="mt-4 pt-4 border-t space-y-3">
              <div className="text-xs text-muted-foreground">
                <p><strong>Location:</strong> {seller.location}</p>
                <p><strong>Response Time:</strong> {seller.responseTime}</p>
                <p><strong>Specializes in:</strong> {seller.specialties.join(', ')}</p>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleContactSeller(seller.id)
                  }}
                  className="flex-1"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewProfile(seller.id)
                  }}
                  className="flex-1"
                >
                  View Profile
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
      
      {mockNearbySellers.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No sellers found in your area</p>
          <p className="text-sm">Try expanding your search radius</p>
        </div>
      )}
    </div>
  )
}
