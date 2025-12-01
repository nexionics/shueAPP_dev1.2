import { FindSellersMap } from "@/components/find-sellers/find-sellers-map"
import { LocationSelector } from "@/components/find-sellers/location-selector"
import { SafeLocationsList } from "@/components/find-sellers/safe-locations-list"
import { NearbySellersList } from "@/components/find-sellers/nearby-sellers-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs"
import { MapPin, Shield, Users } from "lucide-react"

export default function FindSellersPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Find Sellers Near You</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Connect with verified sellers in your area and discover safe meeting locations for secure transactions.
        </p>
      </div>

      {/* Location Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Your Location</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LocationSelector />
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Section */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Sellers Map</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[520px] p-0">
              <FindSellersMap />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Tabs defaultValue="sellers" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sellers">Nearby Sellers</TabsTrigger>
              <TabsTrigger value="locations">Safe Locations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sellers" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Users className="h-4 w-4" />
                    <span>Sellers Near You</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <NearbySellersList />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="locations" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Shield className="h-4 w-4" />
                    <span>Safe Meeting Spots</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <SafeLocationsList />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Safety Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Safety Guidelines</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Meet in Public</h3>
              <p className="text-sm text-muted-foreground">
                Always meet in well-lit, public places with security cameras and foot traffic.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Bring a Friend</h3>
              <p className="text-sm text-muted-foreground">
                Consider bringing a trusted friend or family member to the meetup.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Verify Authenticity</h3>
              <p className="text-sm text-muted-foreground">
                Inspect items carefully and use authentication apps when possible.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Cash Transactions</h3>
              <p className="text-sm text-muted-foreground">
                Use secure payment methods and avoid carrying large amounts of cash.
              </p>
            </div>
            <div className="space-y-2">
            <h3 className="font-semibold">Trust Your Instincts</h3>
            <p className="text-sm text-muted-foreground">
              If something feels off, don&apos;t hesitate to cancel or reschedule.
            </p>
            </div>
            <div className="space-y-2">
            <h3 className="font-semibold">Share Your Plans</h3>
            <p className="text-sm text-muted-foreground">
              Let someone know where you&apos;re going and when you expect to return.
            </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
