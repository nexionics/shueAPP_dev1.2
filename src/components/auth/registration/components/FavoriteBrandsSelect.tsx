'use client'

import React from 'react'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { Select } from '@/components/Select'
import { X, Plus } from 'lucide-react'

interface FavoriteBrandsSelectProps {
  value: string[]
  onChange: (value: string[]) => void
  onBlur?: () => void
  disabled?: boolean
  error?: string
  className?: string
  maxSelections?: number
}

const POPULAR_BRANDS = [
  'Nike',
  'Adidas',
  'Jordan',
  'Puma',
  'New Balance',
  'Converse',
  'Vans',
  'Reebok',
  'ASICS',
  'Under Armour',
  'Yeezy',
  'Off-White',
  'Balenciaga',
  'Golden Goose',
  'Common Projects',
  'Allbirds',
  'On Running',
  'Hoka',
  'Brooks',
  'Saucony'
]

export const FavoriteBrandsSelect: React.FC<FavoriteBrandsSelectProps> = ({
  value,
  onChange,
  onBlur,
  disabled = false,
  error,
  maxSelections = 5
}) => {
  const handleAddBrand = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brand = e.target.value
    if (brand && !value.includes(brand) && value.length < maxSelections) {
      onChange([...value, brand])
    }
    // Reset select to placeholder
    e.target.value = ''
  }

  const handleRemoveBrand = (brandToRemove: string) => {
    onChange(value.filter(brand => brand !== brandToRemove))
  }

  const availableBrands = POPULAR_BRANDS.filter(brand => !value.includes(brand))
  const canAddMore = value.length < maxSelections

  return (
    <div>
      {/* Selected Brands */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {value.map((brand) => (
            <Badge
              key={brand}
              variant="secondary"
              className="flex items-center gap-1 text-sm py-1 px-2"
            >
              {brand}
              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveBrand(brand)}
                  className="h-auto p-0 ml-1 hover:bg-transparent"
                  data-testid={`remove-brand-${brand}`}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </Badge>
          ))}
        </div>
      )}

      {/* Add Brand Dropdown */}
      {canAddMore && !disabled && (
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
          <Select
            onChange={handleAddBrand}
            onBlur={onBlur}
            disabled={disabled}
            className={`pl-10 ${error ? 'border-red-500' : ''}`}
            data-testid="brands-select"
            defaultValue=""
          >
            <option value="" disabled>
              {value.length === 0 
                ? 'Select your favorite brands' 
                : `Add another brand (${maxSelections - value.length} left)`
              }
            </option>
            {availableBrands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </Select>
        </div>
      )}

      {/* Max selection message */}
      {value.length >= maxSelections && (
        <p className="text-xs text-muted-foreground mt-2">
          Maximum {maxSelections} brands selected. Remove a brand to add another.
        </p>
      )}

      {/* Empty state */}
      {value.length === 0 && disabled && (
        <div className="text-sm text-muted-foreground py-2">
          No favorite brands selected
        </div>
      )}

      {error && (
        <p className="text-red-500 text-xs mt-2">{error}</p>
      )}
    </div>
  )
}