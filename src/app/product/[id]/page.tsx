import React from "react"
import ProductPDP from "@/components/ProductPDP"
import { getProductDetails } from "@/api/sneakers"
import { useEffect, useState } from 'react'


type ProductLike = {
  id?: string
  name?: string
  images?: string[]
  imageLinks?: string[]
  retailPrice?: number
  description?: string
}

async function getLiveProduct(id: string) {
  const res = await getProductDetails(id)
  if (!res || res.success !== true || !res.data) return null
  return res.data as unknown as ProductLike
}

export default function Page({ params }: { params: { id: string } }) {
    const id = params.id
    const [product, setProduct] = useState<ProductLike | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      const fetchProduct = async () => {
        try {
          const productData = await getLiveProduct(id)
          setProduct(productData)
        } catch (error) {
          console.error('Failed to fetch product:', error)
          setProduct(null)
        } finally {
          setLoading(false)
        }
      }

      fetchProduct()
    }, [id])

    if (loading) {
      return (
        <main className="container py-8">
          <div>Loading...</div>
        </main>
      )
    }



  const mapped = {
    id: product.id || id,
    title: product.name,
    subtitle: `${product.retailPrice ? '$' + product.retailPrice : ''}`,
    description: product.description || `A beautiful pair — ${product.name} — ready for its next home.`,
    images: product.images || product.imageLinks || [],
    price: product.retailPrice || 0,
    currency: '$',
    currentBid: Math.round((product.retailPrice || 0) * 1.2),
    // For demo: add auction timing for some items
    auctionStart: product.id === '1' ? new Date(Date.now() - 1000 * 60 * 60).toISOString() : product.id === '2' ? new Date(Date.now() + 1000 * 60 * 60).toISOString() : undefined,
    auctionEnd: product.id === '1' ? new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString() : product.id === '2' ? new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString() : undefined,
  }

  return (
    <main className="container py-8">
      <ProductPDP product={mapped} />
    </main>
  )
}
