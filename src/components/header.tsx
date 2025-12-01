"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/Button"
import { ThemeToggle } from "./ThemeToggle"
import { LoginModalPortal } from "./auth/LoginModalPortal"
import { UserMenu } from "./auth/UserMenu"
import { useAuth } from "@/contexts/AuthContext"
import { LogIn } from "lucide-react"

export function Header() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { isAuthenticated } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              ShueApp
            </span>
            {!isAuthenticated && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowLoginModal(true)}
                className="ml-2 text-xs"
              >
                <LogIn className="mr-1 h-3 w-3" />
                Login
              </Button>
            )}
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/explore"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Explore
            </Link>
            <Link
              href="/find-sellers"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Find Sellers
            </Link>
            <Link
              href="/requests"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Requests
            </Link>
            <Link
              href="/seller"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Sell
            </Link>
            <Link
              href="/settings"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Settings
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/" className="flex items-center space-x-2 md:hidden">
              <span className="font-bold">ShueApp</span>
              {!isAuthenticated && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowLoginModal(true)}
                  className="ml-2 text-xs"
                >
                  <LogIn className="mr-1 h-3 w-3" />
                  Login
                </Button>
              )}
            </Link>
          </div>
          <nav className="flex items-center space-x-2">
            {isAuthenticated && <UserMenu />}
            <ThemeToggle />
          </nav>
        </div>
      </div>
      <LoginModalPortal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        portalTarget="#modal-root"
      />
    </header>
  )
}
