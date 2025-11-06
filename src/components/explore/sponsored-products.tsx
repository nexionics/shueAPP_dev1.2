import { Badge } from "@/components/ui/badge"
import { ItemCard } from "@/components/item-card"
import { Star } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Product } from "@/lib/data"

export async function SponsoredProducts() {
  const supabase = await createServerSupabaseClient()
  
  let sponsoredProducts: Product[] = []

  try {
    const { data: sponsoredListings, error } = await supabase
      .from('popular_listings')
      .select('*')
      .eq('is_sponsored', true)
      .limit(4)

    if (!error && sponsoredListings && sponsoredListings.length > 0) {
      sponsoredProducts = sponsoredListings.map(listing => ({
        id: listing.id,
        name: listing.name,
        brand: listing.brand,
        colorway: listing.colorway || '',
        releaseDate: listing.release_date || '',
        retailPrice: listing.retail_price || 0,
        images: listing.images,
        sizes: listing.sizes,
        category: listing.category || 'Lifestyle',
        condition: listing.condition,
        sellerId: listing.seller_id,
        styleID: listing.style_id || undefined,
        description: listing.description || undefined
      }))
    }
  } catch (error) {
    console.error('Error fetching sponsored products:', error)
  }

  if (sponsoredProducts.length === 0) {
    const { getHomeSectionsWithRealData } = await import('@/lib/data')
    const sections = getHomeSectionsWithRealData()
    sponsoredProducts = sections.featuredProducts.slice(0, 4)
  }

  return (
    <section className="space-y-6 px-4">
      <div className="flex items-center justify-center space-x-2">
        <Star className="h-6 w-6 text-yellow-500" />
        <h2 className="text-3xl font-bold">Sponsored Products</h2>
        <Star className="h-6 w-6 text-yellow-500" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sponsoredProducts.map((product: Product) => (
          <div key={product.id} className="relative">
            <Badge className="absolute top-2 left-2 z-10 bg-yellow-500 text-black">
              Sponsored
            </Badge>
            <ItemCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}
