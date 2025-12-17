import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card'
import { Input } from '@/components/Input'
import { MapPin } from 'lucide-react'
import type { ListingFormData } from './types'

type Props = Pick<ListingFormData, 'location'> & {
  onChange: (field: keyof ListingFormData, value: any) => void
}

export const LocationCard = ({ location, onChange }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" />Location</CardTitle>
        <CardDescription>Specify your nearest safe location for meetups</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <label htmlFor="add-listing-location" className="text-sm font-medium mb-2 block">Nearest Safe Location *</label>
          <Input id="add-listing-location" placeholder="e.g., Starbucks on Main St, Police Station, Mall Food Court" value={location} onChange={(e) => onChange('location', e.target.value)} />
          <p className="text-xs text-gray-500 mt-1">Choose a public, well-lit location for safe transactions</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default LocationCard
