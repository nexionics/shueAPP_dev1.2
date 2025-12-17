"use client"

import React, { useEffect } from 'react'
import AddListingForm from '@/components/add-listing/AddListingForm'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function AddListingPage() {
  const router = useRouter()
  const { isAuthenticated, isInitializing } = useAuth()

  // Redirect here (moved from AddListingForm) so Storybook can control rendering
  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.push('/')
    }
  }, [isInitializing, isAuthenticated, router])

  return <AddListingForm router={router} isAuthenticated={isAuthenticated} isInitializing={isInitializing} />
}
