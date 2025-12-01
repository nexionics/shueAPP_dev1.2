import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/Card"
import { Product, formatPrice } from "@/lib/data"

interface ItemCardProps {
  product: Product
}

export function ItemCard({ product }: ItemCardProps) {
  const minPrice = Math.min(...product.sizes.map(s => s.price))
  const maxPrice = Math.max(...product.sizes.map(s => s.price))
  
  return (
    <Link href={`/p/${product.id}`}>
      <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={product.images[0] || "/placeholder-shoe.jpg"}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">{product.brand}</div>
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary">
              {product.name}
            </h3>
            <div className="text-sm text-muted-foreground">{product.colorway}</div>
            <div className="flex items-center justify-between">
              <div className="font-bold">
                {minPrice === maxPrice 
                  ? formatPrice(minPrice)
                  : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
                }
              </div>
              <div className="text-xs text-muted-foreground">
                {product.sizes.length} sizes
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
