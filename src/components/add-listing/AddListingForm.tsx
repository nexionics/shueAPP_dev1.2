"use client"
import React, { useState, useEffect } from 'react'
import type { ListingFormData } from './types'
import { BasicInfoCard } from './BasicInfoCard'
import { SizesPricingCard } from './SizesPricingCard'
import { ImagesUploadCard } from './ImagesUploadCard'
import { ListingTypeCard } from './ListingTypeCard'
import { LocationCard } from './LocationCard'
import { Button } from '@/components/Button'
import { ArrowLeft } from 'lucide-react'
import { CONDITIONS, SHOE_SIZES } from './types'
import { getApiBaseUrl } from '@/api/http'
import { TokenManager } from '@/api/authentication'

const defaultForm: ListingFormData = {
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
}

type RouterLike = { push: (p: string) => void; back: () => void }

export const AddListingForm = ({
  router,
  isAuthenticated,
  isInitializing
}: {
  router: RouterLike
  isAuthenticated: boolean
  isInitializing: boolean
}) => {
  const [formData, setFormData] = useState<ListingFormData>(defaultForm)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // lifecycle redirect moved to page component for better control in Storybook/tests

  const handleChange = (field: keyof ListingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handleSizeChange = (index: number, field: any, value: any) => {
    const copy = [...formData.sizes]
    copy[index] = { ...copy[index], [field]: value }
    setFormData(prev => ({ ...prev, sizes: copy }))
  }

  const addSize = () => setFormData(prev => ({ ...prev, sizes: [...prev.sizes, { size: '', price: 0, quantity: 1 }] }))
  const removeSize = (index: number) => setFormData(prev => ({ ...prev, sizes: prev.sizes.filter((_, i) => i !== index) }))

  const handleUpload = (files: File[]) => setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }))
  const removeImage = (index: number) => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required'
    if (!formData.model.trim()) newErrors.model = 'Model is required'
    if (!formData.condition) newErrors.condition = 'Condition is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (formData.images.length === 0) newErrors.images = 'At least one image is required'
    const validSizes = formData.sizes.filter(s => s.size && s.price > 0)
    if (validSizes.length === 0) newErrors.sizes = 'At least one size with price is required'
    if (formData.listingType === 'auction') {
      if (!formData.minBid || formData.minBid <= 0) newErrors.minBid = 'Minimum bid is required'
      if (!formData.auctionDuration || formData.auctionDuration <= 0) newErrors.auctionDuration = 'Auction duration is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    try {
      const base = getApiBaseUrl()
      const url = `${base}/api/inventory/new/items`

      const fd = new FormData()
      fd.set('title', formData.title)
      fd.set('description', formData.description || '')
      fd.set('brand', formData.brand)
      fd.set('model', formData.model)
      fd.set('colorway', formData.colorway || '')
      fd.set('condition', formData.condition)
      fd.set('listingType', formData.listingType)
      fd.set('location', formData.location)
      fd.set('sizes', JSON.stringify(formData.sizes))

      if (formData.listingType === 'auction') {
        if (formData.minBid != null) fd.set('minBid', String(formData.minBid))
        if (formData.buyNowPrice != null) fd.set('buyNowPrice', String(formData.buyNowPrice))
        if (formData.auctionDuration != null) fd.set('auctionDuration', String(formData.auctionDuration))
        if (formData.startTime) fd.set('startTime', formData.startTime)
        if (formData.endTime) fd.set('endTime', formData.endTime)
      } else {
        if (formData.buyNowPrice != null) fd.set('buyNowPrice', String(formData.buyNowPrice))
      }

      for (const img of formData.images) {
        fd.append('images', img)
      }

      const token = TokenManager.getAccessToken()
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: fd
      })

      const json: any = await res.json().catch(() => null)
      if (!res.ok || !json?.success) {
        const msg = json?.error || json?.message || `Request failed (${res.status})`
        throw new Error(msg)
      }

      router.push('/inventory')
    } catch {
      setErrors(prev => ({ ...prev, submit: 'Failed to create listing' }))
    } finally { setIsLoading(false) }
  }

  if (isInitializing) return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Loading...</h1>
        <p className="text-muted-foreground">Checking authentication status...</p>
      </div>
    </div>
  )

  if (!isAuthenticated) return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Authentication Required</h1>
        <p className="text-muted-foreground">Please log in to create a listing.</p>
        <Button onClick={() => router.push('/')}>Go to Login</Button>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Listing</h1>
          <p className="text-muted-foreground">List your sneakers for sale, trade, or auction</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <BasicInfoCard {...formData} onChange={handleChange} conditions={CONDITIONS} />
        <SizesPricingCard sizes={formData.sizes} onChangeSize={handleSizeChange} addSize={addSize} removeSize={removeSize} sizesOptions={SHOE_SIZES} />
        <ImagesUploadCard images={formData.images} onUpload={handleUpload} onRemove={removeImage} />
        <ListingTypeCard listingType={formData.listingType} minBid={formData.minBid} buyNowPrice={formData.buyNowPrice} auctionDuration={formData.auctionDuration} onChange={handleChange} />
        <LocationCard location={formData.location} onChange={handleChange} />

        {errors.submit && (<div className="bg-red-50 border border-red-200 rounded-lg p-4"><p className="text-sm text-red-600">{errors.submit}</p></div>)}

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isLoading}>{isLoading ? 'Creating Listing...' : 'Create Listing'}</Button>
        </div>
      </form>
    </div>
  )
}

export default AddListingForm
