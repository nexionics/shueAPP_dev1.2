import { Button } from "@/components/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card"
import { Badge } from "@/components/Badge"
import { ItemCard } from "@/components/ItemCard"
import { SellerCard } from "@/components/seller-card"
import { getHomeSectionsWithRealData, formatPrice, getTimeRemaining, Product } from "@/lib/data"
import { ArrowRight, Clock, Users, Gavel, Ticket, Package, Star, TrendingUp } from "lucide-react"
import { ExploreClient } from "./explore-client"

export default function ExplorePage() {
  const sections = getHomeSectionsWithRealData()

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Client-side floating orbs and search */}
      <ExploreClient sections={sections} />

      {/* Main Content */}
      <div className="relative z-10 space-y-12 bg-background/80 backdrop-blur-sm">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-16 bg-gradient-to-b from-primary/5 to-transparent">
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Explore Sneakers
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover authentic sneakers floating in our digital universe. Search, explore, and find your perfect pair.
          </p>
        </section>

        {/* Sponsored Products */}
        <section className="space-y-6 px-4">
          <div className="flex items-center justify-center space-x-2">
            <Star className="h-6 w-6 text-yellow-500" />
            <h2 className="text-3xl font-bold">Sponsored Products</h2>
            <Star className="h-6 w-6 text-yellow-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sections.featuredProducts.slice(0, 4).map((product: Product) => (
              <div key={product.id} className="relative">
                <Badge className="absolute top-2 left-2 z-10 bg-yellow-500 text-black">
                  Sponsored
                </Badge>
                <ItemCard product={product} />
              </div>
            ))}
          </div>
        </section>

        {/* Popular Products */}
        <section className="space-y-6 px-4">
          <div className="flex items-center justify-center space-x-2">
            <TrendingUp className="h-6 w-6" />
            <h2 className="text-3xl font-bold">Popular Right Now</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sections.featuredProducts.slice(4, 8).map((product: Product) => (
              <ItemCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Top Sellers */}
        <section className="space-y-6 px-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Top Sellers</h2>
            <Button variant="ghost">
              See all <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.topSellers.map((seller) => (
              <SellerCard key={seller.id} seller={seller} />
            ))}
          </div>
        </section>

        {/* Active Auctions */}
        <section className="space-y-6 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Gavel className="h-6 w-6" />
              <h2 className="text-3xl font-bold">Live Auctions</h2>
            </div>
            <Button variant="ghost">
              See all <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sections.activeAuctions.map((auction) => (
              <Card key={auction.id} className="cursor-pointer hover:shadow-lg transition-all">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Auction #{auction.id}</CardTitle>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{getTimeRemaining(auction.endDate)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm text-muted-foreground">Size {auction.size}</div>
                  <div className="space-y-1">
                    <div className="text-lg font-bold">{formatPrice(auction.currentBid)}</div>
                    <div className="text-xs text-muted-foreground">
                      {auction.bidCount} bids • {auction.watchers} watching
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Active Raffles */}
        <section className="space-y-6 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Ticket className="h-6 w-6" />
              <h2 className="text-3xl font-bold">Active Raffles</h2>
            </div>
            <Button variant="ghost">
              See all <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sections.activeRaffles.map((raffle) => (
              <Card key={raffle.id} className="cursor-pointer hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="text-lg">{raffle.productName}</CardTitle>
                  <div className="text-sm text-muted-foreground">{raffle.brand}</div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Entry Price:</span>
                    <span className="font-bold">{formatPrice(raffle.entryPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Entries:</span>
                    <span className="text-sm">{raffle.totalEntries}/{raffle.maxEntries}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(raffle.totalEntries / raffle.maxEntries) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Ends {getTimeRemaining(raffle.endDate)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* New Preorders */}
        <section className="space-y-6 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="h-6 w-6" />
              <h2 className="text-3xl font-bold">New Preorders</h2>
            </div>
            <Button variant="ghost">
              See all <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sections.newPreorders.map((preorder) => (
              <Card key={preorder.id} className="cursor-pointer hover:shadow-lg transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm line-clamp-2">{preorder.productName}</CardTitle>
                  <div className="text-xs text-muted-foreground">{preorder.brand}</div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-xs">Retail:</span>
                      <span className="text-xs line-through text-muted-foreground">
                        {formatPrice(preorder.retailPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs">Preorder:</span>
                      <span className="text-sm font-bold">{formatPrice(preorder.preorderPrice)}</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {preorder.totalOrders}/{preorder.maxOrders} ordered
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Ships: {new Date(preorder.shippingDate).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Requests */}
        <section className="space-y-6 px-4 pb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6" />
              <h2 className="text-3xl font-bold">Recent Requests</h2>
            </div>
            <Button variant="ghost">
              See all <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.recentRequests.map((request) => (
              <Card key={request.id} className="cursor-pointer hover:shadow-lg transition-all">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold line-clamp-1">{request.productName}</h3>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Size {request.size}</span>
                      <span className="font-bold">{formatPrice(request.maxPrice)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      by {request.requesterName} • {request.location}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {request.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
