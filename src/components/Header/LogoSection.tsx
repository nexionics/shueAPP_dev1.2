import Link from 'next/link'
import { Button } from '@/components/Button'
import { LogIn } from 'lucide-react'
import type { FC } from 'react'

export interface LogoSectionProps {
  isAuthenticated?: boolean
  onOpenLogin?: () => void
}

export const LogoSection: FC<LogoSectionProps> = ({ isAuthenticated, onOpenLogin }) => {
  return (
    <div className="mr-4 hidden md:flex items-center">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <span className="hidden font-bold sm:inline-block">ShueApp</span>
      </Link>

      {!isAuthenticated && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenLogin}
          className="ml-2 text-xs"
        >
          <LogIn className="mr-1 h-3 w-3" />
          Login
        </Button>
      )}
    </div>
  )
}

export default LogoSection
