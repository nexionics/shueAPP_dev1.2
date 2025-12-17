'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AuthAPI, TokenManager } from '@/api/authentication'
import type { JWTUserPayload } from '@/api/authentication/types'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  username?: string
  firstName?: string
  lastName?: string
  role?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  isInitializing: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper function to convert JWTUserPayload to User interface
function mapJWTUserToUser(jwtUser: JWTUserPayload): User {
  return {
    id: jwtUser.userId,
    name: `${jwtUser.firstName} ${jwtUser.lastName}`,
    email: jwtUser.email,
    username: jwtUser.username,
    firstName: jwtUser.firstName,
    lastName: jwtUser.lastName,
    role: jwtUser.role,
    avatar: '/placeholder-avatar.svg' // Default avatar
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    // Check if user is already logged in on app start
    const initAuth = async () => {
      try {
        const storedUser = TokenManager.getStoredUser()
        const isLoggedIn = TokenManager.isLoggedIn()
        
        if (isLoggedIn && storedUser) {
          // Validate the stored token
          const validation = await TokenManager.validateToken()
          if (validation.success && validation.valid && validation.user) {
            setUser(mapJWTUserToUser(validation.user))
          } else {
            // Token is invalid, clear storage
            TokenManager.clearAuthData()
          }
        } else if (storedUser) {
          // User data exists but no token, clear storage
          TokenManager.clearAuthData()
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        // Clear any corrupted data
        TokenManager.clearAuthData()
      } finally {
        setIsInitializing(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const result = await AuthAPI.login({ email, password })
      
      if (result.success && result.user) {
        const mappedUser = mapJWTUserToUser(result.user)
        setUser(mappedUser)
      } else {
        throw new Error(result.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      // Re-throw the error so the LoginModal can handle it
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await AuthAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
      // Continue with logout even if server call fails
    } finally {
      setUser(null)
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      isLoading,
      isInitializing
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
