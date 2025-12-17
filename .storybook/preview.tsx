import type { Preview } from '@storybook/nextjs'
import React, { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from '../src/contexts/AuthContext'
import { ThemeProvider } from '../src/components/ThemeProvider'
import { checkServerHealth } from '../src/api/authentication'
import '../src/app/globals.css'

// Status indicator component
const StoryStatusWrapper = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [serverError, setServerError] = useState<string | null>(null)
  const [lastCheck, setLastCheck] = useState<Date>(new Date())

  useEffect(() => {
    const checkServer = async () => {
      try {
        setServerStatus('checking')
        setServerError(null)
        
        const isHealthy = await checkServerHealth()
        setServerStatus(isHealthy ? 'online' : 'offline')
        setLastCheck(new Date())
        
        if (!isHealthy) {
          setServerError('Server health check failed - server may be down or unreachable')
        }
      } catch (error) {
        setServerStatus('offline')
        setLastCheck(new Date())
        
        // Capture detailed error information
        let errorMessage = 'Unknown error occurred'
        if (error instanceof Error) {
          errorMessage = error.message
        } else if (typeof error === 'string') {
          errorMessage = error
        }
        
        // Check for common network errors
        if (errorMessage.includes('fetch')) {
          errorMessage = 'Network error - unable to reach server'
        } else if (errorMessage.includes('CORS')) {
          errorMessage = 'CORS error - server may not allow cross-origin requests'
        } else if (errorMessage.includes('timeout')) {
          errorMessage = 'Request timeout - server is taking too long to respond'
        }
        
        setServerError(errorMessage)
      }
    }
    
    checkServer()
    // Check server status every 30 seconds
    const interval = setInterval(checkServer, 30000)
    return () => clearInterval(interval)
  }, [])

  const getServerStatusColor = () => {
    switch (serverStatus) {
      case 'online': return '#28a745'
      case 'offline': return '#dc3545'
      case 'checking': return '#ffc107'
    }
  }

  const getServerStatusText = () => {
    switch (serverStatus) {
      case 'online': return '🟢 Server Online'
      case 'offline': return '🔴 Server Offline'
      case 'checking': return '🟡 Checking...'
    }
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Status Bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10000,
        background: 'rgba(248, 249, 250, 0.95)',
        borderBottom: '1px solid #dee2e6',
        padding: '8px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1 }}>
          {/* Server Status */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            color: getServerStatusColor(),
            fontWeight: 500
          }}>
            {getServerStatusText()}
          </div>
          
          {/* Server Error Display */}
          {serverError && (
            <div style={{
              background: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '12px',
              color: '#721c24',
              maxWidth: '300px',
              cursor: 'help'
            }} title={`Last checked: ${lastCheck.toLocaleTimeString()}\nError: ${serverError}`}>
              ⚠️ {serverError}
            </div>
          )}
          
          {/* Auth Status */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            color: isAuthenticated ? '#28a745' : '#6c757d'
          }}>
            {isLoading ? (
              <>🔄 Loading...</>
            ) : isAuthenticated ? (
              <>👤 Logged in as {user?.firstName || user?.email || 'User'}</>
            ) : (
              <>🚫 Not authenticated</>
            )}
          </div>
        </div>
        
        {/* Environment Info */}
        <div style={{ 
          fontSize: '12px', 
          color: '#6c757d',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0
        }}>
          <span>API: {process.env.NEXT_PUBLIC_API_URL || 'Not configured'}</span>
          <span>•</span>
          <span title={`Last server check: ${lastCheck.toLocaleString()}`}>
            Updated: {lastCheck.toLocaleTimeString()}
          </span>
        </div>
      </div>
      
      {/* Story Content */}
      <div style={{ paddingTop: '48px' }}>
        {children}
      </div>
    </div>
  )
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StoryStatusWrapper>
            <Story />
          </StoryStatusWrapper>
        </ThemeProvider>
      </AuthProvider>
    ),
  ],
};

export default preview;