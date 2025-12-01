"use client"

import { useState } from "react"
import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { MapPin, Shield, Clock, Star, Navigation, Phone } from "lucide-react"

interface SafeLocation {
  id: string
  name: string
  type: 'coffee_shop' | 'mall' | 'police_station' | 'public_space' | 'store'
  address: string
  distance: number
  rating: number
  hours: string
  features: string[]
  description: string
  phone?: string
  verified: boolean
}

// Mock data for safe meeting locations
const mockSafeLocations: SafeLocation[] = [
  {
    id: "1",
    name: "Starbucks - Times Square",
    type: "coffee_shop",
    address: "1585 Broadway, New York, NY 10036",
    distance: 0.3,
    rating: 4.2,
    hours: "5:00 AM - 11:00 PM",
    features: ["Security Cameras", "Well Lit", "High Traffic", "WiFi"],
    description: "Busy Starbucks location with excellent visibility and security cameras throughout.",
    phone: "(212) 944-6690",
    verified: true
  },
  {
    id: "2",
    name: "Apple Store - Fifth Avenue",
    type: "store",
    address: "767 5th Ave, New York, NY 10153",
    distance: 0.5,
    rating: 4.8,
    hours: "8:00 AM - 10:00 PM",
    features: ["High Security", "Security Guards", "Cameras", "Public Space"],
    description: "Iconic Apple Store with 24/7 security presence and high foot traffic.",
    phone: "(212) 336-1440",
    verified: true
  },
  {
    id: "3",
    name: "Bryant Park",
    type: "public_space",
    address: "Bryant Park, New York, NY 10018",
    distance: 0.7,
    rating: 4.5,
    hours: "6:00 AM - 10:00 PM",
    features: ["Park Security", "Well Lit", "Open Space", "Events"],
    description: "Beautiful public park with regular security patrols and good lighting.",
    verified: true
  },
  {
    id: "4",
    name: "Herald Square Macy's",
    type: "mall",
    address: "151 W 34th St, New York, NY 10001",
    distance: 0.9,
    rating: 4.1,
    hours: "10:00 AM - 10:00 PM",
    features: ["Security Guards", "Cameras", "Indoor", "High Traffic"],
    description: "Large department store with comprehensive security and climate control.",
    phone: "(212) 695-4400",
    verified: true
  },
  {
    id: "5",
    name: "NYPD Midtown South Precinct",
    type: "police_station",
    address: "357 W 35th St, New York, NY 10001",
    distance: 1.1,
    rating: 4.9,
    hours: "24 Hours",
    features: ["Police Station", "Maximum Security", "Safe Zone"],
    description: "Police precinct offering the highest level of security for transactions.",
    phone: "(212) 239-9811",
    verified: true
  },
  {
    id: "6",
    name: "McDonald's - Penn Station",
    type: "coffee_shop",
    address: "2 Penn Plaza, New York, NY 10121",
    distance: 1.2,
    rating: 3.8,
    hours: "24 Hours",
    features: ["24/7 Open", "Security Cameras", "High Traffic"],
    description: "24-hour McDonald's with constant foot traffic and security presence.",
    phone: "(212) 736-3943",
    verified: false
  }
]

const locationTypeIcons = {
  coffee_shop: "☕",
  mall: "🏬",
  police_station: "🚔",
  public_space: "🏞️",
  store: "🏪"
}

const locationTypeColors = {
  coffee_shop: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  mall: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  police_station: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  public_space: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  store: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
}

export function SafeLocationsList() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  const handleGetDirections = (locationId: string) => {
    const location = mockSafeLocations.find(loc => loc.id === locationId)
    if (location) {
      // In a real app, this would open maps with directions
      console.log("Getting directions to:", location.name)
    }
  }

  const handleCallLocation = (phone: string) => {
    window.open(`tel:${phone}`, '_self')
  }

  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto">
      {mockSafeLocations.map((location) => (
        <div
          key={location.id}
          className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
            selectedLocation === location.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => setSelectedLocation(selectedLocation === location.id ? null : location.id)}
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-sm">{location.name}</h3>
                  {location.verified && (
                    <Badge variant="secondary" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${locationTypeColors[location.type]}`}
                  >
                    {locationTypeIcons[location.type]} {location.type.replace('_', ' ')}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                    <span>{location.rating}</span>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{location.distance} mi</span>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mb-2">{location.address}</p>
                
                <div className="flex items-center text-xs text-muted-foreground mb-2">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{location.hours}</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {location.features.slice(0, 3).map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {location.features.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{location.features.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {selectedLocation === location.id && (
              <div className="pt-3 border-t space-y-3">
                <p className="text-xs text-muted-foreground">{location.description}</p>
                
                <div className="text-xs text-muted-foreground">
                  <p><strong>All Features:</strong> {location.features.join(', ')}</p>
                  {location.phone && (
                    <p><strong>Phone:</strong> {location.phone}</p>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleGetDirections(location.id)
                    }}
                    className="flex-1"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Directions
                  </Button>
                  {location.phone && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCallLocation(location.phone!)
                      }}
                      className="flex-1"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      
      {mockSafeLocations.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No safe locations found in your area</p>
          <p className="text-sm">Try expanding your search radius</p>
        </div>
      )}
    </div>
  )
}
