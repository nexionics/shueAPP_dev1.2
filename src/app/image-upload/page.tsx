"use client"
import React, { useState } from 'react'
import { ImagesUploadCard } from '@/components/add-listing/ImagesUploadCard'

export default function ImageUploadPage() {
  const [images, setImages] = useState<File[]>([])

  const handleUpload = (files: File[]) => setImages(prev => [...prev, ...files])
  const handleRemove = (index: number) => setImages(prev => prev.filter((_, i) => i !== index))

  return (
    <main>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4">Image Upload</h1>
        <div className="max-w-3xl">
          <ImagesUploadCard images={images} onUpload={handleUpload} onRemove={handleRemove} />
        </div>
      </div>
    </main>
  )
}
