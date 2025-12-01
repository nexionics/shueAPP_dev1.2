'use client'

import React, { createContext, useContext, useState, useRef, useEffect } from 'react'
import { Button } from './Button'
import { ChevronDown, Check } from 'lucide-react'

interface SelectContextType {
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  disabled?: boolean
}

const SelectContext = createContext<SelectContextType | null>(null)

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  disabled?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  'data-testid'?: string
}

interface SelectTriggerProps {
  children: React.ReactNode
  className?: string
  onBlur?: () => void
}

interface SelectContentProps {
  children: React.ReactNode
  className?: string
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
  disabled?: boolean
}

interface SelectValueProps {
  placeholder?: string
  children?: React.ReactNode
}

export function Select({ 
  value = '', 
  onValueChange, 
  children, 
  disabled = false, 
  open: controlledOpen,
  onOpenChange,
  'data-testid': testId
}: SelectProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  
  const setOpen = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }

  const contextValue = {
    value,
    onValueChange: onValueChange || (() => {}),
    open,
    setOpen,
    disabled
  }

  return (
    <SelectContext.Provider value={contextValue}>
      <div className="relative" data-testid={testId}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

Select.Trigger = function SelectTrigger({ children, className = '', onBlur }: SelectTriggerProps) {
  const context = useContext(SelectContext)
  if (!context) throw new Error('SelectTrigger must be used within Select')
  
  const { open, setOpen, disabled } = context
  
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => !disabled && setOpen(!open)}
      onBlur={onBlur}
      disabled={disabled}
      className={`w-full justify-between ${className}`}
      aria-expanded={open}
      aria-haspopup="listbox"
    >
      {children}
    </Button>
  )
}

Select.Content = function SelectContent({ children, className = '' }: SelectContentProps) {
  const context = useContext(SelectContext)
  if (!context) throw new Error('SelectContent must be used within Select')
  
  const { open, setOpen } = context
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, setOpen])

  if (!open) return null

  return (
    <div
      ref={contentRef}
      className={`absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-md max-h-60 overflow-y-auto ${className}`}
      role="listbox"
    >
      {children}
    </div>
  )
}

Select.Item = function SelectItem({ value, children, disabled = false }: SelectItemProps) {
  const context = useContext(SelectContext)
  if (!context) throw new Error('SelectItem must be used within Select')
  
  const { value: selectedValue, onValueChange, setOpen } = context
  const isSelected = selectedValue === value

  const handleClick = () => {
    if (!disabled) {
      onValueChange(value)
      setOpen(false)
    }
  }

  return (
    <div
      className={`
        px-3 py-2 text-sm cursor-pointer hover:bg-muted transition-colors
        flex items-center justify-between
        ${isSelected ? 'bg-muted font-medium' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onClick={handleClick}
      role="option"
      aria-selected={isSelected}
    >
      <span>{children}</span>
      {isSelected && <Check className="h-4 w-4" />}
    </div>
  )
}

Select.Value = function SelectValue({ placeholder, children }: SelectValueProps) {
  const context = useContext(SelectContext)
  if (!context) throw new Error('SelectValue must be used within Select')
  
  const { value } = context

  if (children) {
    return <>{children}</>
  }

  return (
    <span className={value ? 'text-foreground' : 'text-muted-foreground'}>
      {value || placeholder}
    </span>
  )
}