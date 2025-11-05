'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { MapPin, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { createClient } from '@/lib/supabase/client'

interface SellerLocationData {
  zipcode: string | null
  lat: number | null
  lng: number | null
  location_enabled: boolean
}

export function SellerLocationSettings() {
  const { user } = useAuth()
  const [locationEnabled, setLocationEnabled] = useState(false)
  const [zipcode, setZipcode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (user?.id) {
      loadSellerLocation()
    }
  }, [user?.id])

  const loadSellerLocation = async () => {
    if (!user?.id) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('seller_locations')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading seller location:', error)
        return
      }

      if (data) {
        setLocationEnabled(data.location_enabled)
        setZipcode(data.zipcode || '')
      }
    } catch (error) {
      console.error('Error loading seller location:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const geocodeZipcode = async (zip: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      const response = await fetch(`https://api.zippopotam.us/us/${zip}`)
      if (!response.ok) {
        return null
      }
      const data = await response.json()
      if (data.places && data.places.length > 0) {
        return {
          lat: parseFloat(data.places[0].latitude),
          lng: parseFloat(data.places[0].longitude)
        }
      }
      return null
    } catch (error) {
      console.error('Geocoding error:', error)
      return null
    }
  }

  const validateZipcode = (zip: string): boolean => {
    return /^\d{5}$/.test(zip)
  }

  const handleSave = async () => {
    if (!user?.id) {
      setMessage({ type: 'error', text: 'You must be logged in to save location settings' })
      return
    }

    if (locationEnabled && !zipcode) {
      setMessage({ type: 'error', text: 'Please enter a ZIP code' })
      return
    }

    if (locationEnabled && !validateZipcode(zipcode)) {
      setMessage({ type: 'error', text: 'Please enter a valid 5-digit ZIP code' })
      return
    }

    setIsSaving(true)
    setMessage(null)

    try {
      let lat: number | null = null
      let lng: number | null = null

      if (locationEnabled && zipcode) {
        const coords = await geocodeZipcode(zipcode)
        if (!coords) {
          setMessage({ type: 'error', text: 'Invalid ZIP code or geocoding failed. Please try again.' })
          setIsSaving(false)
          return
        }
        lat = coords.lat
        lng = coords.lng
      }

      const { error } = await supabase
        .from('seller_locations')
        .upsert({
          user_id: user.id,
          zipcode: locationEnabled ? zipcode : null,
          lat,
          lng,
          location_enabled: locationEnabled
        })

      if (error) {
        console.error('Error saving seller location:', error)
        setMessage({ type: 'error', text: 'Failed to save location settings. Please try again.' })
      } else {
        setMessage({ type: 'success', text: 'Location settings saved successfully!' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      console.error('Error saving seller location:', error)
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleChange = (checked: boolean) => {
    setLocationEnabled(checked)
    if (!checked) {
      setMessage(null)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Seller Location</span>
          </CardTitle>
          <CardDescription>Share your location with buyers on the Find Sellers map</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Seller Location</span>
        </CardTitle>
        <CardDescription>Share your location with buyers on the Find Sellers map</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label htmlFor="location-enabled" className="text-base">
              Share my location
            </Label>
            <p className="text-sm text-muted-foreground">
              Allow buyers to find you on the map
            </p>
          </div>
          <Switch
            id="location-enabled"
            checked={locationEnabled}
            onCheckedChange={handleToggleChange}
            disabled={isSaving}
          />
        </div>

        {locationEnabled && (
          <div className="space-y-2">
            <Label htmlFor="zipcode">ZIP Code</Label>
            <Input
              id="zipcode"
              type="text"
              placeholder="Enter your 5-digit ZIP code"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              maxLength={5}
              disabled={isSaving}
            />
            <p className="text-xs text-muted-foreground">
              Your exact address won&apos;t be shared. Only your general area will be visible to buyers.
            </p>
          </div>
        )}

        {message && (
          <div className={`flex items-center space-x-2 text-sm p-3 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
              : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Location Settings'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
