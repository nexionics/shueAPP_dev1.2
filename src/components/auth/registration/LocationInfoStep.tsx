'use client'

import React from 'react'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { RegistrationStepProps } from './types'
import { CountrySelect } from './CountrySelect'
import { StateSelect } from './StateSelect'
import { MapPin, Globe, Building, Hash, Check, AlertCircle, ChevronLeft } from 'lucide-react'

interface LocationInfoStepProps extends RegistrationStepProps {}

export const LocationInfoStep: React.FC<LocationInfoStepProps> = ({
  formData,
  validationState,
  onFieldChange,
  onFieldBlur,
  onNext,
  onPrevious,
  isLoading = false
}) => {
  const handleFieldChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onFieldChange(field, e.target.value)
  }

  const handleSelectChange = (field: keyof typeof formData) => (value: string) => {
    onFieldChange(field, value)
    // Validate immediately against the selected value
    onFieldBlur(field, value)
  }

  const handleFieldBlur = (field: keyof typeof formData) => (
    e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<any>
  ) => {
    // For inputs, use the event target value; for other controls the parent snapshot will be used
    const val = (e?.target as HTMLInputElement)?.value
    onFieldBlur(field, val)
  }

  const handleToggleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onFieldChange(field, e.target.checked)
    // validate boolean toggle immediately
    onFieldBlur(field, e.target.checked)
  }

  const getFieldError = (field: keyof typeof formData) => {
    const validation = validationState[field]
    return validation?.hasBeenTouched && !validation?.isValid ? validation.error : undefined
  }

  const isFieldValid = (field: keyof typeof formData) => {
    const validation = validationState[field]
    return validation?.hasBeenTouched && validation?.isValid
  }

  const canProceed = [
    'city', 'state', 'country', 'zipCode'
  ].every(field => validationState[field as keyof typeof formData]?.isValid)

  const requestLocationPermission = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.')
      return
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        })
      })

      // In a real app, you would reverse geocode the coordinates to get the address
      // For now, just enable the location permission toggle
      onFieldChange('allowLocationPermission', true)
      alert(`Location detected: ${position.coords.latitude}, ${position.coords.longitude}. You can now auto-fill location details when available.`)
    } catch (error) {
      console.error('Error getting location:', error)
      alert('Unable to get your location. You can still enter your address manually.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Location Information</h2>
        <p className="text-muted-foreground mt-2">
          Help us provide you with location-based services and shipping options
        </p>
      </div>

      {/* Location Permission */}
      <div className="bg-muted/50 p-4 rounded-lg border">
        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-primary mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-foreground">Location Services</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Allow location access for better marketplace recommendations and faster checkout
            </p>
            <div className="flex items-center space-x-4 mt-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.allowLocationPermission}
                  onChange={handleToggleChange('allowLocationPermission')}
                  disabled={isLoading}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm">Allow location access</span>
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={requestLocationPermission}
                disabled={isLoading}
              >
                Detect Location
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* City */}
        <div className="md:col-span-1">
          <label htmlFor="city" className="block text-sm font-medium text-foreground mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="city"
              data-testid="city-input"
              type="text"
              placeholder="Enter your city"
              value={formData.city}
              onChange={handleFieldChange('city')}
              onBlur={handleFieldBlur('city')}
              className={`pl-10 pr-10 ${
                getFieldError('city') 
                  ? 'border-red-500 focus:border-red-500' 
                  : isFieldValid('city') 
                  ? 'border-green-500 focus:border-green-500' 
                  : ''
              }`}
              aria-describedby={getFieldError('city') ? 'city-error' : undefined}
              disabled={isLoading}
              autoComplete="address-level2"
            />
            {isFieldValid('city') && (
              <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
            )}
          </div>
          {getFieldError('city') && (
            <p id="city-error" className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {getFieldError('city')}
            </p>
          )}
        </div>

        {/* State */}
        <div className="md:col-span-1">
          <label htmlFor="state" className="block text-sm font-medium text-foreground mb-2">
            State/Province <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <StateSelect
              value={formData.state}
              onChange={handleSelectChange('state')}
              onBlur={handleFieldBlur('state')}
              disabled={isLoading}
              data-testid="state-select"
              className={`${
                getFieldError('state') 
                  ? 'border-red-500 focus:border-red-500' 
                  : isFieldValid('state') 
                  ? 'border-green-500 focus:border-green-500' 
                  : ''
              }`}
            />
            {isFieldValid('state') && (
              <Check className="absolute right-8 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4 pointer-events-none z-10" />
            )}
          </div>
          {getFieldError('state') && (
            <p id="state-error" className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {getFieldError('state')}
            </p>
          )}
        </div>

        {/* Country */}
        <div className="md:col-span-1">
          <label htmlFor="country" className="block text-sm font-medium text-foreground mb-2">
            Country <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <CountrySelect
              value={formData.country}
              onChange={handleSelectChange('country')}
              onBlur={handleFieldBlur('country')}
              disabled={isLoading}
              data-testid="country-select"
              className={`${
                getFieldError('country') 
                  ? 'border-red-500 focus:border-red-500' 
                  : isFieldValid('country') 
                  ? 'border-green-500 focus:border-green-500' 
                  : ''
              }`}
            />
            {isFieldValid('country') && (
              <Check className="absolute right-8 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4 pointer-events-none z-10" />
            )}
          </div>
          {getFieldError('country') && (
            <p id="country-error" className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {getFieldError('country')}
            </p>
          )}
        </div>

        {/* ZIP Code */}
        <div className="md:col-span-1">
          <label htmlFor="zipCode" className="block text-sm font-medium text-foreground mb-2">
            ZIP/Postal Code <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="zipCode"
              data-testid="zipCode-input"
              type="text"
              placeholder="Enter ZIP/Postal code"
              value={formData.zipCode}
              onChange={handleFieldChange('zipCode')}
              onBlur={handleFieldBlur('zipCode')}
              className={`pl-10 pr-10 ${
                getFieldError('zipCode') 
                  ? 'border-red-500 focus:border-red-500' 
                  : isFieldValid('zipCode') 
                  ? 'border-green-500 focus:border-green-500' 
                  : ''
              }`}
              aria-describedby={getFieldError('zipCode') ? 'zipCode-error' : undefined}
              disabled={isLoading}
              autoComplete="postal-code"
            />
            {isFieldValid('zipCode') && (
              <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
            )}
          </div>
          {getFieldError('zipCode') && (
            <p id="zipCode-error" className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {getFieldError('zipCode')}
            </p>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-800 dark:text-blue-200">Why do we need your location?</p>
            <ul className="text-blue-700 dark:text-blue-300 mt-1 space-y-1">
              <li>• Find nearby sellers and events</li>
              <li>• Calculate accurate shipping costs</li>
              <li>• Show relevant marketplace listings</li>
              <li>• Comply with local regulations</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={isLoading}
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!canProceed || isLoading}
          className="min-w-[120px]"
          data-testid="location-info-next"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Processing...
            </div>
          ) : (
            'Continue'
          )}
        </Button>
      </div>
    </div>
  )
}