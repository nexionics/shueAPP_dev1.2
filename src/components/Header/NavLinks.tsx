import Link from 'next/link'
import type { FC } from 'react'

export const NavLinks: FC = () => {
  return (
    <nav className="flex items-center space-x-6 text-sm font-medium p-4">
      <Link href="/explore" className="transition-colors hover:text-foreground/80 text-foreground/60">Explore</Link>
      <Link href="/find-sellers" className="transition-colors hover:text-foreground/80 text-foreground/60">Find Sellers</Link>
      <Link href="/requests" className="transition-colors hover:text-foreground/80 text-foreground/60">Requests</Link>
      <Link href="/seller" className="transition-colors hover:text-foreground/80 text-foreground/60">Sell</Link>
      <Link href="/settings" className="transition-colors hover:text-foreground/80 text-foreground/60">Settings</Link>
    </nav>
  )
}

export default NavLinks
