'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Textarea } from '@/components/TextArea'
import { Select } from '@/components/Select'
import { Badge } from '@/components/Badge'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Upload, 
  X, 
  Plus,
  MapPin,
  DollarSign,
  Package,
  Ruler,
  ArrowLeft,
  ImageIcon
} from 'lucide-react'

interface ListingFormData {
  title: string
  description: string
  brand: string
  model: string
  colorway: string
  condition: string
  sizes: { size: string; price: number; quantity: number }[]
  images: File[]
  listingType: 'sale' | 'trade' | 'auction'
  location: string
  minBid?: number
  buyNowPrice?: number
  auctionDuration?: number
}

const SHOE_SIZES = [
  '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', 
  '10', '10.5', '11', '11.5', '12', '12.5', '13', '13.5', '14'
]

const CONDITIONS = [
  { value: 'new', label: 'New with Box' },
  { value: 'new-no-box', label: 'New without Box' },
  { value: 'used-excellent', label: 'Used - Excellent' },
  { value: 'used-good', label: 'Used - Good' },
  { value: 'used-fair', label: 'Used - Fair' }
]

export default function AddListingPage() {
  const router = useRouter()
  const { isAuthenticated, isInitializing } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState<ListingFormData>({
    title: '',
    description: '',
    brand: '',
    model: '',
    colorway: '',
    condition: '',
    sizes: [{ size: '', price: 0, quantity: 1 }],
    images: [],
    listingType: 'sale',
    location: '',
    minBid: undefined,
    buyNowPrice: undefined,
    auctionDuration: undefined
  })

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, isInitializing, router])

  const handleInputChange = (field: keyof ListingFormData, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSizeChange = (index: number, field: 'size' | 'price' | 'quantity', value: string | number) => {
    const newSizes = [...formData.sizes]
    newSizes[index] = { ...newSizes[index], [field]: value }
    setFormData(prev => ({ ...prev, sizes: newSizes }))
  }

  const addSize = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, { size: '', price: 0, quantity: 1 }]
    }))
  }

  const removeSize = (index: number) => {
    if (formData.sizes.length > 1) {
      setFormData(prev => ({
        ...prev,
        sizes: prev.sizes.filter((_, i) => i !== index)
      }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + formData.images.length > 10) {
      setErrors(prev => ({ ...prev, images: 'Maximum 10 images allowed' }))
      return
    }
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }))
    setErrors(prev => ({ ...prev, images: '' }))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required'
    if (!formData.model.trim()) newErrors.model = 'Model is required'
    if (!formData.condition) newErrors.condition = 'Condition is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (formData.images.length === 0) newErrors.images = 'At least one image is required'
    
    const validSizes = formData.sizes.filter(s => s.size && s.price > 0)
    if (validSizes.length === 0) {
      newErrors.sizes = 'At least one size with price is required'
    }

    if (formData.listingType === 'auction') {
      if (!formData.minBid || formData.minBid <= 0) {
        newErrors.minBid = 'Minimum bid is required for auctions'
      }
      if (!formData.auctionDuration || formData.auctionDuration <= 0) {
        newErrors.auctionDuration = 'Auction duration is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Listing data:', formData)
      
      router.push('/seller')
    } catch {
      setErrors(prev => ({ ...prev, submit: 'Failed to create listing. Please try again.' }))
    } finally {
      setIsLoading(false)
    }
  }

  if (isInitializing) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Loading...</h1>
          <p className="text-muted-foreground">Checking authentication status...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Authentication Required</h1>
          <p className="text-muted-foreground">Please log in to create a listing.</p>
          <Button onClick={() => router.push('/')}>Go to Login</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Listing</h1>
          <p className="text-muted-foreground">List your sneakers for sale, trade, or auction</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Provide the essential details about your sneaker
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title *</label>
                <Input
                  placeholder="e.g., Air Jordan 1 Chicago 2015"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
                {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Brand *</label>
                <Input
                  placeholder="e.g., Nike, Adidas, Jordan"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                />
                {errors.brand && <p className="text-sm text-red-500 mt-1">{errors.brand}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Model *</label>
                <Input
                  placeholder="e.g., Air Jordan 1 High"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                />
                {errors.model && <p className="text-sm text-red-500 mt-1">{errors.model}</p>}
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Colorway</label>
                <Input
                  placeholder="e.g., Chicago, Bred, Royal"
                  value={formData.colorway}
                  onChange={(e) => handleInputChange('colorway', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                placeholder="Describe the condition, any flaws, or additional details..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Condition *</label>
              <Select
                value={formData.condition}
                onChange={(e) => handleInputChange('condition', e.target.value)}
              >
                <option value="">Select condition</option>
                {CONDITIONS.map(condition => (
                  <option key={condition.value} value={condition.value}>
                    {condition.label}
                  </option>
                ))}
              </Select>
              {errors.condition && <p className="text-sm text-red-500 mt-1">{errors.condition}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="h-5 w-5" />
              Sizes & Pricing
            </CardTitle>
            <CardDescription>
              Add available sizes with their respective prices and quantities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.sizes.map((sizeData, index) => (
              <div key={index} className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Size</label>
                  <Select
                    value={sizeData.size}
                    onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                  >
                    <option value="">Select size</option>
                    {SHOE_SIZES.map(size => (
                      <option key={size} value={size}>US {size}</option>
                    ))}
                  </Select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Price ($)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={sizeData.price || ''}
                    onChange={(e) => handleSizeChange(index, 'price', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Quantity</label>
                  <Input
                    type="number"
                    min="1"
                    value={sizeData.quantity}
                    onChange={(e) => handleSizeChange(index, 'quantity', parseInt(e.target.value) || 1)}
                  />
                </div>
                {formData.sizes.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeSize(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addSize}>
              <Plus className="h-4 w-4 mr-2" />
              Add Size
            </Button>
            {errors.sizes && <p className="text-sm text-red-500">{errors.sizes}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Images
            </CardTitle>
            <CardDescription>
              Upload up to 10 images of your sneaker (first image will be the main photo)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Click to upload images or drag and drop</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB each</p>
              </label>
            </div>
            
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    {index === 0 && (
                      <Badge className="absolute bottom-1 left-1 text-xs">Main</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
            {errors.images && <p className="text-sm text-red-500">{errors.images}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Listing Type
            </CardTitle>
            <CardDescription>
              Choose how you want to list your sneaker
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: 'sale', label: 'For Sale', description: 'Sell at a fixed price' },
                { value: 'trade', label: 'For Trade', description: 'Trade for other items' },
                { value: 'auction', label: 'Auction', description: 'Let buyers bid' }
              ].map((type) => (
                <div
                  key={type.value}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    formData.listingType === type.value
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleInputChange('listingType', type.value)}
                >
                  <h3 className="font-medium">{type.label}</h3>
                  <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                </div>
              ))}
            </div>

            {formData.listingType === 'auction' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Minimum Bid ($) *</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.minBid || ''}
                    onChange={(e) => handleInputChange('minBid', parseFloat(e.target.value) || 0)}
                  />
                  {errors.minBid && <p className="text-sm text-red-500 mt-1">{errors.minBid}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Auction Duration (days) *</label>
                  <Select
                    value={formData.auctionDuration?.toString() || ''}
                    onChange={(e) => handleInputChange('auctionDuration', parseInt(e.target.value))}
                  >
                    <option value="">Select duration</option>
                    <option value="1">1 day</option>
                    <option value="3">3 days</option>
                    <option value="7">7 days</option>
                    <option value="10">10 days</option>
                  </Select>
                  {errors.auctionDuration && <p className="text-sm text-red-500 mt-1">{errors.auctionDuration}</p>}
                </div>
              </div>
            )}

            {formData.listingType === 'auction' && (
              <div>
                <label className="text-sm font-medium mb-2 block">Buy Now Price ($)</label>
                <Input
                  type="number"
                  placeholder="Optional - allows instant purchase"
                  value={formData.buyNowPrice || ''}
                  onChange={(e) => handleInputChange('buyNowPrice', parseFloat(e.target.value) || undefined)}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location
            </CardTitle>
            <CardDescription>
              Specify your nearest safe location for meetups
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <label className="text-sm font-medium mb-2 block">Nearest Safe Location *</label>
              <Input
                placeholder="e.g., Starbucks on Main St, Police Station, Mall Food Court"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Choose a public, well-lit location for safe transactions
              </p>
              {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location}</p>}
            </div>
          </CardContent>
        </Card>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Listing...' : 'Create Listing'}
          </Button>
        </div>
      </form>
    </div>
  )
}
