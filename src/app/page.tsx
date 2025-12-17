"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/Button"
import { LoginModal } from "@/components/auth/LoginModal"
import { useAuth } from "@/contexts/AuthContext"
import { ArrowRight, Sparkles, Shield, Users, LogIn } from "lucide-react"

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-24 bg-gradient-to-b from-primary/5 via-secondary/5 to-transparent">
        <div className="space-y-6">
          <div className="relative inline-block">
            <h1 className="text-6xl font-bold tracking-tight sm:text-8xl bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={() => !isAuthenticated && setShowLoginModal(true)}>
              ShueAPP
            </h1>
            {isAuthenticated && (
              <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4">
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-lg">
                  Welcome, {user?.name?.split(' ')[0]}!
                </div>
              </div>
            )}
          </div>
          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            The Ultimate Sneaker Marketplace
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Buy, sell, and trade authentic sneakers with confidence. Join thousands of sneakerheads worldwide.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
          <Button size="lg" className="text-lg px-8 py-6" asChild>
            <Link href="/explore">
              <Sparkles className="mr-3 h-5 w-5" />
              Explore Sneakers
              <ArrowRight className="ml-3 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
            <Link href="/seller">
              Start Selling
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Authentic Guarantee</h3>
              <p className="text-muted-foreground">
                Every sneaker is verified for authenticity by our expert team before reaching you.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Trusted Community</h3>
              <p className="text-muted-foreground">
                Connect with verified sellers and buyers in our secure marketplace environment.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Unique Experience</h3>
              <p className="text-muted-foreground">
                Discover sneakers in our innovative floating orb interface and advanced search features.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="text-center space-y-8">
          <h2 className="text-4xl font-bold">Ready to Start Your Sneaker Journey?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join our community and discover the future of sneaker trading.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/explore">
                Explore Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
              <Link href="/requests">
                View Requests
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  )
}
