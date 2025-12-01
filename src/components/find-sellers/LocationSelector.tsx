"use client"

import { useState } from "react"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { MapPin, Search, Target } from "lucide-react"

interface LocationSelectorProps {
  onLocationChange?: (location: { lat: number; lng: number; address: string }) => void
}

export function LocationSelector({ onLocationChange }: LocationSelectorProps) {
  const [address, setAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleGetCurrentLocation = () => {
    setIsLoading(true)
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          
          // In a real app, you'd use a geocoding service to get the address
          // For now, we'll use a placeholder
          const mockAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          setAddress(mockAddress)
          
          onLocationChange?.({
            lat: latitude,
            lng: longitude,
            address: mockAddress
          })
          
          setIsLoading(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLoading(false)
        }
      )
    } else {
      console.error("Geolocation is not supported by this browser.")
      setIsLoading(false)
    }
  }

  const handleAddressSearch = () => {
    if (!address.trim()) return
    
    setIsLoading(true)
    
    // In a real app, you'd use a geocoding service like Google Maps API
    // For now, we'll simulate with mock coordinates
    setTimeout(() => {
      const mockCoords = {
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.0060 + (Math.random() - 0.5) * 0.1,
        address: address
      }
      
      onLocationChange?.(mockCoords)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <div className="flex-1">
          <Input
            placeholder="Enter your address or zip code"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddressSearch()}
          />
        </div>
        <Button 
          onClick={handleAddressSearch}
          disabled={isLoading || !address.trim()}
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
      
      <div className="flex items-center justify-center">
        <Button
          variant="outline"
          onClick={handleGetCurrentLocation}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          <Target className="h-4 w-4 mr-2" />
          {isLoading ? "Getting Location..." : "Use Current Location"}
        </Button>
      </div>
      
      {address && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>Current location: {address}</span>
        </div>
      )}
    </div>
  )
}
