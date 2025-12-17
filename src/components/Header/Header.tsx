"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/Button"
import { ThemeToggle } from "../ThemeToggle"
import { LoginModalPortal } from "../auth/LoginModalPortal"
import { UserMenu } from "../auth/UserMenu"
import { LogoSection } from './LogoSection'
import { NavLinks } from './NavLinks'
import { Actions } from './Actions'
import { useAuth } from "@/contexts/AuthContext"
import { LogIn } from "lucide-react"

export function Header() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { isAuthenticated } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
      <div className="container flex h-14 items-center">
        <LogoSection isAuthenticated={isAuthenticated} onOpenLogin={() => setShowLoginModal(true)} />
        <NavLinks />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/" className="flex items-center space-x-2 md:hidden">
              <span className="font-bold">ShueApp</span>
            </Link>
          </div>
          <Actions isAuthenticated={isAuthenticated} onOpenLogin={() => setShowLoginModal(true)} />
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
