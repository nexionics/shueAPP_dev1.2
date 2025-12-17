import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card'
import { Select } from '@/components/Select'
import { Input } from '@/components/Input'
import { DollarSign } from 'lucide-react'
import type { ListingFormData } from './types'

type Props = Pick<ListingFormData, 'listingType' | 'minBid' | 'buyNowPrice' | 'auctionDuration' | 'startTime' | 'endTime'> & {
  onChange: (field: keyof ListingFormData, value: any) => void
}

export const ListingTypeCard = ({ listingType, minBid, buyNowPrice, auctionDuration, startTime, endTime, onChange }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5" />Listing Type</CardTitle>
        <CardDescription>Choose how you want to list your sneaker</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: 'sale', label: 'For Sale', description: 'Sell at a fixed price' },
            { value: 'trade', label: 'For Trade', description: 'Trade for other items' },
            { value: 'auction', label: 'Auction', description: 'Let buyers bid' }
          ].map(type => (
            <div
              key={type.value}
              data-testid={`listing-type-${type.value}`}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${listingType === type.value ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
              onClick={() => onChange('listingType', type.value)}
            >
              <h3 className="font-medium">{type.label}</h3>
              <p className="text-sm text-gray-600 mt-1">{type.description}</p>
            </div>
          ))}
        </div>

        {listingType === 'auction' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="add-listing-min-bid" className="text-sm font-medium mb-2 block">Minimum Bid ($) *</label>
                <Input id="add-listing-min-bid" type="number" placeholder="0" value={minBid || ''} onChange={(e) => onChange('minBid', parseFloat(e.target.value) || 0)} />
              </div>
              <div>
                <label htmlFor="add-listing-auction-duration" className="text-sm font-medium mb-2 block">Auction Duration (days) *</label>
                <Select id="add-listing-auction-duration" value={auctionDuration?.toString() || ''} onChange={(e) => onChange('auctionDuration', parseInt(e.target.value))}>
                  <option value="">Select duration</option>
                  <option value="1">1 day</option>
                  <option value="3">3 days</option>
                  <option value="7">7 days</option>
                  <option value="10">10 days</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="add-listing-auction-start" className="text-sm font-medium mb-2 block">Auction Start (local)</label>
                <input
                  type="datetime-local"
                  id="add-listing-auction-start"
                  value={startTime || ''}
                  onChange={(e) => onChange('startTime', e.target.value)}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div>
                <label htmlFor="add-listing-auction-end" className="text-sm font-medium mb-2 block">Auction End (local)</label>
                <input
                  type="datetime-local"
                  id="add-listing-auction-end"
                  value={endTime || ''}
                  onChange={(e) => onChange('endTime', e.target.value)}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label htmlFor="add-listing-buy-now-price" className="text-sm font-medium mb-2 block">Buy Now Price ($)</label>
              <Input id="add-listing-buy-now-price" type="number" placeholder="Optional - allows instant purchase" value={buyNowPrice || ''} onChange={(e) => onChange('buyNowPrice', parseFloat(e.target.value) || undefined)} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default ListingTypeCard
