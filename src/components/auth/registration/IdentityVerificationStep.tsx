'use client'

import React, { useState } from 'react'
import IDCapture from '@/components/IDCapture'
import { RegistrationStepProps } from './types'
import { Button } from '@/components/Button'

interface IdentityVerificationStepProps extends RegistrationStepProps {}

export const IdentityVerificationStep: React.FC<IdentityVerificationStepProps> = ({
  formData,
  validationState,
  onFieldChange,
  onFieldBlur,
  onNext,
  onPrevious,
  isLoading
}) => {
  const [whichSide, setWhichSide] = useState<'front' | 'back'>('front')

  const handleCapture = (dataUrl: string, scanResult?: any) => {
    if (whichSide === 'front') {
      onFieldChange('idFront', dataUrl)
      if (scanResult?.parsed) onFieldChange('idParsed', scanResult.parsed)
    } else {
      onFieldChange('idBack', dataUrl)
    }
  }

  const handleUpload = (field: 'idFront' | 'idBack') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      onFieldChange(field, result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Identity Verification</h2>
        <p className="text-muted-foreground mt-2">Upload or capture photos of your government ID. We recommend capturing both front and back if available.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="mb-2 font-medium">Front Side</div>
          {formData.idFront ? (
            <img src={formData.idFront} alt="ID Front" className="w-full border rounded" />
          ) : (
            <div className="border rounded p-2">
              <IDCapture side="front" instructions="Capture the front side of your ID" onCapture={handleCapture} />
            </div>
          )}
          <div className="mt-2">
            <input type="file" accept="image/*" onChange={handleUpload('idFront')} />
          </div>
        </div>

        <div>
          <div className="mb-2 font-medium">Back Side</div>
          {formData.idBack ? (
            <img src={formData.idBack} alt="ID Back" className="w-full border rounded" />
          ) : (
            <div className="border rounded p-2">
              <IDCapture side="back" instructions="Capture the back side of your ID (barcode/QR may be on this side)" onCapture={handleCapture} />
            </div>
          )}
          <div className="mt-2">
            <input type="file" accept="image/*" onChange={handleUpload('idBack')} />
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onPrevious} disabled={isLoading}>Previous</Button>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => { onFieldChange('idFront', undefined); onFieldChange('idBack', undefined) }} disabled={isLoading}>Clear</Button>
          <Button onClick={onNext} disabled={isLoading}>Continue</Button>
        </div>
      </div>
    </div>
  )
}
