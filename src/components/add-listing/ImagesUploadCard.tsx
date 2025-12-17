import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card'
import { Upload, X, ImageIcon } from 'lucide-react'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import type { ListingFormData } from './types'

type Props = Pick<ListingFormData, 'images'> & {
  onUpload: (files: File[]) => void
  onRemove: (index: number) => void
}

export const ImagesUploadCard = ({ images, onUpload, onRemove }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    onUpload(files)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" />Images</CardTitle>
        <CardDescription>Upload up to 10 images of your sneaker (first image will be the main photo)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input aria-label="Images" type="file" multiple accept="image/*" onChange={handleChange} className="hidden" id="image-upload-story" />
          <label htmlFor="image-upload-story" className="cursor-pointer">
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">Click to upload images or drag and drop</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB each</p>
          </label>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((file, i) => (
              <div key={i} className="relative">
                <img src={URL.createObjectURL(file)} alt={`Upload ${i + 1}`} className="w-full h-24 object-cover rounded-lg" />
                <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6" onClick={() => onRemove(i)}>
                  <X className="h-3 w-3" />
                </Button>
                {i === 0 && (<Badge className="absolute bottom-1 left-1 text-xs">Main</Badge>)}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ImagesUploadCard
