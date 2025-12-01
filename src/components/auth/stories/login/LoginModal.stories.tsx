import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { 
  LoginModal,
  LoginModalContainer, 
  LoginModalPure,
  LoginModalPureProps,
  LoginModalContainerProps 
} from '@/components/auth/LoginModal'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { 
  containerSuccessfulLoginPlay, 
  containerSuccessfulLoginDecorator,
  liveServerIntegrationPlay, 
  liveServerIntegrationDecorator 
} from './plays'



// Authentication Status Display Component
const AuthStatus = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  
  return (
    <div style={{ 
      marginTop: '20px', 
      padding: '15px', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      backgroundColor: isAuthenticated ? '#e8f5e8' : '#f5f5f5'
    }}>
      <h4>Authentication Status</h4>
      <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
      <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
      {user && (
        <div>
          <p><strong>User:</strong> {user.name} ({user.email})</p>
          <button 
            onClick={logout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

// Interactive Container Demo Component
const InteractiveContainerDemo = ({ scenario }: { scenario: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div style={{ width: '400px' }}>
      <button 
        onClick={() => setIsModalOpen(true)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Open Login Modal (Container)
      </button>
      
      <LoginModalContainer 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false)
          console.log('modal-closed')
        }}
        onLoginSuccess={() => {
          console.log('login-success')
        }}
      />
      
      <AuthStatus />
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Test Scenario:</strong> {scenario}</p>
        <p><strong>Component:</strong> LoginModalContainer (with auth logic)</p>
      </div>
    </div>
  )
}

// Pure Component Demo (for testing UI states)
const PureComponentDemo = (props: Partial<LoginModalPureProps> & { scenario: string }) => {
  const [email, setEmail] = useState(props.email || '')
  const [password, setPassword] = useState(props.password || '')
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Pure component form submitted:', { email, password })
    // Simulate some action based on the scenario
    if (props.scenario?.includes('Error')) {
      console.log('Simulating error state')
    } else {
      console.log('Simulating success state')
      setIsOpen(false)
    }
  }

  return (
    <div style={{ width: '400px' }}>
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Open Login Modal (Pure)
      </button>
      
      <LoginModalPure
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        email={email}
        password={password}
        error={props.error || ''}
        isLoading={props.isLoading || false}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
      />
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Test Scenario:</strong> {props.scenario}</p>
        <p><strong>Component:</strong> LoginModalPure (UI only)</p>
        <p><strong>Current State:</strong></p>
        <ul style={{ marginLeft: '20px' }}>
          <li>Email: {email}</li>
          <li>Password: {'*'.repeat(password.length)}</li>
          <li>Error: {props.error || 'None'}</li>
          <li>Loading: {props.isLoading ? 'Yes' : 'No'}</li>
        </ul>
      </div>
    </div>
  )
}

// Wrapper to provide AuthContext for container stories
const ContainerWithProvider = ({ scenario, ...props }: LoginModalContainerProps & { scenario?: string }) => {
  return (
    <AuthProvider>
      <InteractiveContainerDemo scenario={scenario || 'Default'} />
    </AuthProvider>
  )
}

// Meta configurations
const containerMeta: Meta<typeof ContainerWithProvider> = {
  title: 'Authentication/LoginModal/Container',
  component: ContainerWithProvider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'LoginModalContainer - Handles authentication logic and state management. Connects to the authentication context and manages form state internally.'
      }
    }
  },
  argTypes: {
    scenario: {
      control: 'text',
      description: 'Description of the test scenario'
    }
  }
}

const pureMeta: Meta<typeof PureComponentDemo> = {
  title: 'Authentication/LoginModal/Pure',
  component: PureComponentDemo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'LoginModalPure - Pure UI component that only handles rendering. All state and logic must be provided via props.'
      }
    }
  },
  argTypes: {
    scenario: {
      control: 'text',
      description: 'Description of the test scenario'
    },
    email: {
      control: 'text',
      description: 'Email input value'
    },
    password: {
      control: 'text',
      description: 'Password input value'
    },
    error: {
      control: 'text',
      description: 'Error message to display'
    },
    isLoading: {
      control: 'boolean',
      description: 'Loading state'
    }
  }
}

export default containerMeta
type ContainerStory = StoryObj<typeof containerMeta>
type PureStory = StoryObj<typeof pureMeta>

// Container Component Stories
/**
 * Interactive login with successful authentication using the container component.
 * 
 * **Test Credentials:**
 * - Email: test@shueapp.com
 * - Password: password123
 */
export const ContainerSuccessfulLogin: ContainerStory = {
  args: {
    scenario: 'Container - Successful Login (test@shueapp.com / password123)'
  },
  play: containerSuccessfulLoginPlay,
  parameters: {
    docs: {
      description: {
        story: `
**Automated Play Function:**
This story automatically:
1. Clicks "Open Login Modal (Container)" button
2. Fills in credentials: test@shueapp.com / password123  
3. Clicks "Sign In" button
4. Verifies "Authentication Status" shows "Authenticated: Yes"
5. Verifies user info displays as "Test User"

Watch the automation run, or click "Rerun" to see it again.
        `
      }
    }
  },
  decorators: [containerSuccessfulLoginDecorator]
}

/**
 * Live server integration test - connects to real backend API
 * This story uses the actual authentication service to perform real login.
 * 
 * **Prerequisites:**
 * - Backend server must be running on configured endpoint
 * - Test credentials must exist in the database
 * 
 * **Test Credentials:**
 * - Email: test@shueapp.com
 * - Password: password123
 * 
 * **What this tests:**
 * - Real network requests to authentication API
 * - Actual token management and storage
 * - Live server response handling
 * - Complete authentication flow
 */
export const LiveServerIntegration: ContainerStory = {
  args: {
    scenario: 'Live Server Integration - Real API Connection'
  },
  play: liveServerIntegrationPlay,
  parameters: {
    docs: {
      description: {
        story: `
**Live Server Integration Test**

This story performs actual authentication against a live backend server. Unlike other stories that use mocked responses, this one:

1. **Checks server availability** - Verifies the backend is running
2. **Makes real API calls** - Uses actual network requests
3. **Handles real responses** - Processes live server data
4. **Manages real tokens** - Stores actual JWT tokens
5. **Tests complete flow** - Full authentication cycle

**Requirements:**
- Backend server running on configured endpoint
- Test user account with valid credentials
- Network connectivity to the API

**What you'll see:**
- Real-time status updates during the test
- Console logs showing each step
- Actual authentication state changes
- Live token storage and management

**Troubleshooting:**
- Check that your backend server is running
- Verify NEXT_PUBLIC_API_URL environment variable
- Ensure test credentials exist in the database
- Check network connectivity and CORS settings

Watch the status indicator in the top-right corner for real-time feedback!
        `
      }
    },
    // Longer timeout for real network requests
    chromatic: { delay: 5000 },
    // Don't run in automated testing environments
    test: {
      skip: process.env.CI === 'true'
    }
  },
  decorators: [liveServerIntegrationDecorator]
}
