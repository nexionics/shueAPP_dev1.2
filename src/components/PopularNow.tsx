"use client"

import React, { useEffect, useState, useRef } from 'react'
import { getMostPopular } from '../api/sneakers'
import { ItemCard } from './ItemCard'

type Product = any

export default function PopularNow() {
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac

    let mounted = true
    setLoading(true)
    getMostPopular(8, ac.signal)
      .then((res) => {
        if (!mounted) return
        if (res && Array.isArray(res.data)) setItems(res.data as Product[])
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        console.error('getMostPopular failed', err)
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
      ac.abort()
    }
  }, [])

  if (loading && items.length === 0) {
    return <p className="text-sm text-muted-foreground">Loading popular items…</p>
  }

  if (!items || items.length === 0) {
    return <p className="text-sm text-muted-foreground">No popular items right now.</p>
  }

  return (
    <>
      {items.map((p: Product) => (
        <ItemCard key={p.id || p.styleID || p.slug || p._id} product={p} />
      ))}
    </>
  )
}
