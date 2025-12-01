'use client'

import React, { useState } from 'react'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { FAVORITE_BRANDS } from './types'
import { Check, X } from 'lucide-react'

export interface FavoriteBrandsSelectProps {
  value: string[]
  onChange: (value: string[]) => void
  onBlur?: () => void
  disabled?: boolean
  className?: string
  'data-testid'?: string
  maxSelections?: number
}

export const FavoriteBrandsSelect: React.FC<FavoriteBrandsSelectProps> = ({
  value,
  onChange,
  onBlur,
  disabled = false,
  className = '',
  'data-testid': dataTestId,
  maxSelections = 5
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleBrandToggle = (brand: string) => {
    if (value.includes(brand)) {
      // Remove brand
      onChange(value.filter(b => b !== brand))
    } else {
      // Add brand (if under limit)
      if (value.length < maxSelections) {
        onChange([...value, brand])
      }
    }
  }

  const handleRemoveBrand = (brandToRemove: string) => {
    onChange(value.filter(b => b !== brandToRemove))
  }

  return (
    <div className={`space-y-2 ${className}`} data-testid={dataTestId}>
      {/* Selected Brands Display */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((brand) => (
            <Badge
              key={brand}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              {brand}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemoveBrand(brand)}
                  className="ml-1 hover:text-destructive"
                  aria-label={`Remove ${brand}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}

      {/* Brand Selection Dropdown */}
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          onBlur={onBlur}
          disabled={disabled}
          className="w-full justify-between text-left"
        >
          {value.length === 0 
            ? 'Select favorite brands' 
            : `${value.length} brand${value.length === 1 ? '' : 's'} selected`
          }
          <span className="text-xs text-muted-foreground ml-2">
            (Max {maxSelections})
          </span>
        </Button>

        {isOpen && !disabled && (
          <div className="absolute top-full left-0 right-0 z-50 bg-background border border-border rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
            <div className="p-2 space-y-1">
              {FAVORITE_BRANDS.map((brand) => {
                const isSelected = value.includes(brand)
                const canSelect = !isSelected && value.length < maxSelections
                
                return (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => handleBrandToggle(brand)}
                    disabled={!isSelected && !canSelect}
                    className={`w-full text-left px-3 py-2 rounded-sm text-sm transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : canSelect
                        ? 'hover:bg-muted'
                        : 'text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    <span>{brand}</span>
                    {isSelected && <Check className="h-4 w-4" />}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Helper Text */}
      <p className="text-xs text-muted-foreground">
        Select up to {maxSelections} brands that you're interested in
      </p>
    </div>
  )
}