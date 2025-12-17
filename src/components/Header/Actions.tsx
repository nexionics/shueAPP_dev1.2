import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/Button'
import { UserMenu } from '@/components/auth/UserMenu'
import type { FC } from 'react'

export interface ActionsProps {
  isAuthenticated?: boolean
  onOpenLogin?: () => void
}

export const Actions: FC<ActionsProps> = ({ isAuthenticated, onOpenLogin }) => {
  return (
    <nav className="flex items-center space-x-2 p-4">
      {isAuthenticated ? (
        <UserMenu />
      ) : (
        <Button variant="ghost" size="sm" onClick={onOpenLogin} className="ml-2 text-xs">
          Login
        </Button>
      )}
      <ThemeToggle />
    </nav>
  )
}

export default Actions
