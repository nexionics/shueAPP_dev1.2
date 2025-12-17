import { Metadata } from 'next'
import SponsoredProductsContainer from '@/components/explore/SponsoredProductsContainer'

export const metadata: Metadata = {
  title: 'Sponsored Products | ShueApp',
  description: 'Discover sponsored products on ShueApp',
}

export default function SponsorPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Sponsored Products</h1>
          <p className="text-lg text-muted-foreground">
            Discover exclusive sponsored products from our trusted partners
          </p>
        </div>

        <SponsoredProductsContainer />
      </div>
    </div>
  )
}