import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/Card"
import { Badge } from "@/components/Badge"
import { Star, MapPin, CheckCircle } from "lucide-react"
import { Seller } from "@/lib/data"

interface SellerCardProps {
  seller: Seller
}

export function SellerCard({ seller }: SellerCardProps) {
  return (
    <Link href={`/s/${seller.id}`}>
      <Card className="group cursor-pointer transition-all hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <Image
                src={seller.avatar || "/placeholder-avatar.svg"}
                alt={seller.name}
                width={60}
                height={60}
                className="rounded-full object-cover"
              />
              {seller.verified && (
                <CheckCircle className="absolute -bottom-1 -right-1 h-5 w-5 text-blue-500 bg-white rounded-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold truncate group-hover:text-primary">
                  {seller.name}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">@{seller.username}</p>
              <div className="flex items-center space-x-1 mt-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{seller.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({seller.totalSales} sales)
                </span>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{seller.location}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {seller.specialties.slice(0, 2).map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
                {seller.specialties.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{seller.specialties.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
