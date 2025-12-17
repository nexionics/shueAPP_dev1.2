import { Button } from "@/components/Button"
import { getHomeSectionsWithRealData, Product } from "@/lib/data"
import PopularNow from '@/components/PopularNow'
import HeroSection from '@/components/explore/HeroSection'
import SponsoredProductsContainer from '@/components/explore/SponsoredProductsContainer'
import PopularProductsSection from '@/components/explore/PopularProductsSection'
import TopSellersSection from '@/components/explore/TopSellersSection'
import LiveAuctionsSection from '@/components/explore/LiveAuctionsSection'
import ActiveRafflesSection from '@/components/explore/ActiveRafflesSection'
import NewPreordersSection from '@/components/explore/NewPreordersSection'
import RecentRequestsSection from '@/components/explore/RecentRequestsSection'

export default function ExplorePage() {
  const sections = getHomeSectionsWithRealData()

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Main Content */}
      <div className="relative z-10 space-y-12 bg-background/80 backdrop-blur-sm">
        <HeroSection />

        <SponsoredProductsContainer />

        <PopularProductsSection products={sections.featuredProducts} />

        <TopSellersSection topSellers={sections.topSellers} />

        <LiveAuctionsSection activeAuctions={sections.activeAuctions} />

        <ActiveRafflesSection activeRaffles={sections.activeRaffles} />

        <NewPreordersSection newPreorders={sections.newPreorders} />

        <RecentRequestsSection recentRequests={sections.recentRequests} />
      </div>
    </div>
  )
}
