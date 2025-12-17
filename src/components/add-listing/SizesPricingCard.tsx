import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Select } from '@/components/Select'
import { Ruler, X, Plus } from 'lucide-react'
import type { SizeEntry } from './types'

type Props = {
  sizes: SizeEntry[]
  onChangeSize: (index: number, field: keyof SizeEntry, value: any) => void
  addSize: () => void
  removeSize: (index: number) => void
  sizesOptions: string[]
}

export const SizesPricingCard = ({ sizes, onChangeSize, addSize, removeSize, sizesOptions }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Ruler className="h-5 w-5" />Sizes & Pricing</CardTitle>
        <CardDescription>Add available sizes with their respective prices and quantities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sizes.map((s, idx) => (
          <div key={idx} className="flex gap-4 items-end">
            <div className="flex-1">
              <label htmlFor={`add-listing-size-${idx}`} className="text-sm font-medium mb-2 block">Size</label>
              <Select id={`add-listing-size-${idx}`} value={s.size} onChange={(e) => onChangeSize(idx, 'size', e.target.value)}>
                <option value="">Select size</option>
                {sizesOptions.map(sz => <option key={sz} value={sz}>US {sz}</option>)}
              </Select>
            </div>
            <div className="flex-1">
              <label htmlFor={`add-listing-price-${idx}`} className="text-sm font-medium mb-2 block">Price ($)</label>
              <Input id={`add-listing-price-${idx}`} type="number" placeholder="0" value={s.price || ''} onChange={(e) => onChangeSize(idx, 'price', parseFloat(e.target.value) || 0)} />
            </div>
            <div className="flex-1">
              <label htmlFor={`add-listing-quantity-${idx}`} className="text-sm font-medium mb-2 block">Quantity</label>
              <Input id={`add-listing-quantity-${idx}`} type="number" min="1" value={s.quantity} onChange={(e) => onChangeSize(idx, 'quantity', parseInt(e.target.value) || 1)} />
            </div>
            {sizes.length > 1 && (
              <Button type="button" variant="outline" size="icon" onClick={() => removeSize(idx)}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}

        <Button type="button" variant="outline" onClick={addSize}>
          <Plus className="h-4 w-4 mr-2" />Add Size
        </Button>
      </CardContent>
    </Card>
  )
}

export default SizesPricingCard
