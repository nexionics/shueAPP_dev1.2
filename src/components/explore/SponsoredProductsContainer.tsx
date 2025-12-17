"use client"

import React, { useEffect, useState, useRef } from 'react'
import SponsoredProductsSection from './SponsoredProductsSection'
import { getSponsoredProducts, ErrorResponse } from '@/api/sponsors'
import { Product } from '@/lib/data'

export default function SponsoredProductsContainer() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac

    let mounted = true
    setLoading(true)
    setError(null)

    getSponsoredProducts(ac.signal)
      .then((res) => {
        if (!mounted) return
        if (res.success && Array.isArray(res.data)) {
          setProducts(res.data.slice(0, 4)) // Limit to 4 sponsored products
        } else {
          setError('Failed to load sponsored products')
        }
      })
      .catch((err) => {
        if (!mounted) return
        if (err.name === 'AbortError') return
        console.error('getSponsoredProducts failed', err)
        setError('Network error occurred')
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
      ac.abort()
    }
  }, [])

  return <SponsoredProductsSection products={products} loading={loading} error={error} />
}