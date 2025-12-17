import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card'
import { Input } from '@/components/Input'
import { Textarea } from '@/components/TextArea'
import { Select } from '@/components/Select'
import { Package } from 'lucide-react'
import type { ListingFormData } from './types'

type Props = Pick<ListingFormData, 'title' | 'brand' | 'model' | 'colorway' | 'description' | 'condition'> & {
  onChange: (field: keyof ListingFormData, value: any) => void
  conditions: { value: string; label: string }[]
}

export const BasicInfoCard = ({ title, brand, model, colorway, description, condition, onChange, conditions }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Basic Information
        </CardTitle>
        <CardDescription>Provide the essential details about your sneaker</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="add-listing-title" className="text-sm font-medium mb-2 block">Title *</label>
            <Input id="add-listing-title" placeholder="e.g., Air Jordan 1 Chicago 2015" value={title} onChange={(e) => onChange('title', e.target.value)} />
          </div>
          <div>
            <label htmlFor="add-listing-brand" className="text-sm font-medium mb-2 block">Brand *</label>
            <Input id="add-listing-brand" placeholder="e.g., Nike, Adidas, Jordan" value={brand} onChange={(e) => onChange('brand', e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="add-listing-model" className="text-sm font-medium mb-2 block">Model *</label>
            <Input id="add-listing-model" placeholder="e.g., Air Jordan 1 High" value={model} onChange={(e) => onChange('model', e.target.value)} />
          </div>
          <div>
            <label htmlFor="add-listing-colorway" className="text-sm font-medium mb-2 block">Colorway</label>
            <Input id="add-listing-colorway" placeholder="e.g., Chicago, Bred, Royal" value={colorway} onChange={(e) => onChange('colorway', e.target.value)} />
          </div>
        </div>

        <div>
          <label htmlFor="add-listing-description" className="text-sm font-medium mb-2 block">Description</label>
          <Textarea id="add-listing-description" placeholder="Describe the condition, any flaws, or additional details..." value={description} onChange={(e) => onChange('description', e.target.value)} rows={4} />
        </div>

        <div>
          <label htmlFor="add-listing-condition" className="text-sm font-medium mb-2 block">Condition *</label>
          <Select id="add-listing-condition" value={condition} onChange={(e) => onChange('condition', e.target.value)}>
            <option value="">Select condition</option>
            {conditions.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}

export default BasicInfoCard
