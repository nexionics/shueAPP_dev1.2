import React from 'react'
import { TrendingUp } from 'lucide-react'
import { ItemCard } from '@/components/ItemCard'
import { Product } from '@/lib/data'
import PopularNow from '../PopularNow'

interface Props { products: Product[] }

export default function PopularProductsSection({ products }: Props) {
  return (
    <section className="space-y-6 px-4">
      <div className="flex items-center justify-center space-x-2">
        <TrendingUp className="h-6 w-6" />
        <h2 className="text-3xl font-bold">Popular Right Now</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-6">
       <PopularNow />
      </div>
    </section>
  )
}
