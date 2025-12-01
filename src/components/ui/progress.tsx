'use client'

import React from 'react'

interface ProgressProps {
  value: number
  className?: string
  max?: number
}

export const Progress: React.FC<ProgressProps> = ({ 
  value, 
  className = '', 
  max = 100 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  return (
    <div className={`w-full bg-muted rounded-full overflow-hidden ${className}`}>
      <div 
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      />
    </div>
  )
}