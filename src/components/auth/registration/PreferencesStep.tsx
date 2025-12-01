'use client'

import React from 'react'
import { Button } from '@/components/Button'
import { Select } from '@/components/Select'
import { RegistrationStepProps, SHOE_SIZES, BUYING_PREFERENCES } from './types'
import { FavoriteBrandsSelect } from './FavoriteBrandsSelect'
import { Shirt, Heart, ShoppingCart, ChevronLeft, Info } from 'lucide-react'

interface PreferencesStepProps extends RegistrationStepProps {}

export const PreferencesStep: React.FC<PreferencesStepProps> = ({
  formData,
  validationState,
  onFieldChange,
  onFieldBlur,
  onNext,
  onPrevious,
  isLoading = false
}) => {
  const handleSelectChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFieldChange(field, e.target.value || undefined)
  }

  const handleBrandsChange = (brands: string[]) => {
    onFieldChange('favoriteBrands', brands)
  }

  const handlePreferenceChange = (value: string) => {
    onFieldChange('buyingPreference', value as 'buying' | 'selling' | 'both')
  }

  // All fields in this step are optional, so always allow proceeding
  const canProceed = true

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Personalize Your Experience</h2>
        <p className="text-muted-foreground mt-2">
          Help us customize the marketplace for your preferences (all optional)
        </p>
      </div>

      {/* Optional Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-800 dark:text-blue-200">Optional Preferences</p>
            <p className="text-blue-700 dark:text-blue-300 mt-1">
              These preferences help us show you more relevant sneakers and recommendations. You can always change them later in your profile settings.
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Shoe Size */}
        <div>
          <label htmlFor="shoeSize" className="block text-sm font-medium text-foreground mb-2">
            <div className="flex items-center space-x-2">
              <Shirt className="h-4 w-4" />
              <span>Your Shoe Size</span>
            </div>
          </label>
          <Select
            value={formData.shoeSize || ''}
            onChange={handleSelectChange('shoeSize')}
            disabled={isLoading}
            data-testid="shoeSize-select"
          >
            <option value="">Select your size</option>
            {SHOE_SIZES.map((size) => (
              <option key={size} value={size}>
                US {size}
              </option>
            ))}
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Help us show you sneakers in your size first
          </p>
        </div>

        {/* Favorite Brands */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Favorite Brands</span>
            </div>
          </label>
          <FavoriteBrandsSelect
            value={formData.favoriteBrands || []}
            onChange={handleBrandsChange}
            disabled={isLoading}
            data-testid="favoriteBrands-select"
            maxSelections={5}
          />
        </div>

        {/* Buying Preference */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4" />
              <span>Marketplace Activity</span>
            </div>
          </label>
          <div className="space-y-3">
            {BUYING_PREFERENCES.map((preference) => (
              <label
                key={preference.value}
                className="flex items-start space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="buyingPreference"
                  value={preference.value}
                  checked={formData.buyingPreference === preference.value}
                  onChange={() => handlePreferenceChange(preference.value)}
                  disabled={isLoading}
                  className="mt-1 text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <div className="font-medium text-foreground">{preference.label}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {preference.value === 'buying' && 'Focus on finding and purchasing sneakers'}
                    {preference.value === 'selling' && 'Focus on listing and selling your sneakers'}
                    {preference.value === 'both' && 'Interested in both buying and selling sneakers'}
                  </div>
                </div>
              </label>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            This helps us show you the most relevant marketplace features
          </p>
        </div>
      </div>

      {/* Preview Section */}
      {(formData.shoeSize || formData.favoriteBrands?.length || formData.buyingPreference) && (
        <div className="bg-muted/50 p-4 rounded-lg border">
          <h3 className="font-medium text-foreground mb-3">Your Preferences Summary</h3>
          <div className="space-y-2 text-sm">
            {formData.shoeSize && (
              <div className="flex items-center space-x-2">
                <Shirt className="h-4 w-4 text-muted-foreground" />
                <span>Size: US {formData.shoeSize}</span>
              </div>
            )}
            {formData.favoriteBrands && formData.favoriteBrands.length > 0 && (
              <div className="flex items-start space-x-2">
                <Heart className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>Favorite brands: {formData.favoriteBrands.join(', ')}</span>
              </div>
            )}
            {formData.buyingPreference && (
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                <span>
                  Activity: {BUYING_PREFERENCES.find(p => p.value === formData.buyingPreference)?.label}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

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
          data-testid="preferences-next"
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