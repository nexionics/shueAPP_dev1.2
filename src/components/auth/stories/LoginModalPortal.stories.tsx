import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { LoginModalPortal, LoginModalPortalProps } from '@/components/auth/LoginModalPortal'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'

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

// Portal Target Display Component
const PortalTargetInfo = ({ portalTarget }: { portalTarget?: string | HTMLElement | null }) => {
  let targetDescription = 'document.body (default)'
  
  if (typeof portalTarget === 'string') {
    targetDescription = `CSS Selector: "${portalTarget}"`
  } else if (portalTarget instanceof HTMLElement) {
    targetDescription = `HTMLElement: ${portalTarget.tagName}${portalTarget.id ? `#${portalTarget.id}` : ''}${portalTarget.className ? `.${portalTarget.className}` : ''}`
  }

  return (
    <div style={{ 
      marginTop: '10px', 
      padding: '10px', 
      border: '1px dashed #999', 
      borderRadius: '4px',
      fontSize: '12px',
      backgroundColor: '#f8f9fa'
    }}>
      <strong>Portal Target:</strong> {targetDescription}
    </div>
  )
}

// Interactive Portal Demo Component
const InteractivePortalDemo = ({ 
  portalTarget, 
  scenario 
}: { 
  portalTarget?: string | HTMLElement | null
  scenario: string 
}) => {
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
          fontSize: '16px',
          marginBottom: '10px'
        }}
      >
        Open Login Modal Portal
      </button>

      {/* Custom portal target example */}
      {typeof portalTarget === 'string' && portalTarget === '#custom-portal-target' && (
        <div 
          id="custom-portal-target" 
          style={{
            position: 'relative',
            minHeight: '100px',
            border: '2px dashed #28a745',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            backgroundColor: '#f8fff8'
          }}
        >
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            Custom Portal Target Area - Modal will render here
          </p>
        </div>
      )}
      
      <LoginModalPortal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false)
          console.log('portal-modal-closed')
        }}
        onLoginSuccess={() => {
          console.log('portal-login-success')
        }}
        portalTarget={portalTarget}
      />
      
      <AuthStatus />
      <PortalTargetInfo portalTarget={portalTarget} />
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Test Scenario:</strong> {scenario}</p>
        <p><strong>Component:</strong> LoginModalPortal</p>
        <p><strong>Features:</strong></p>
        <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
          <li>Uses React Portal for flexible positioning</li>
          <li>Maintains full LoginModal functionality</li>
          <li>SSR safe implementation</li>
          <li>Automatic fallback to document.body</li>
        </ul>
      </div>
    </div>
  )
}

// Wrapper to provide AuthContext
const PortalWithProvider = ({ 
  portalTarget, 
  scenario, 
  ...props 
}: LoginModalPortalProps & { scenario?: string }) => {
  return (
    <AuthProvider>
      <InteractivePortalDemo 
        portalTarget={portalTarget} 
        scenario={scenario || 'Default Portal'} 
      />
    </AuthProvider>
  )
}

// Meta configuration
const meta: Meta<typeof PortalWithProvider> = {
  title: 'Authentication/LoginModal/Portal',
  component: PortalWithProvider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
LoginModalPortal - A wrapper component that uses React Portals to render the LoginModal at a specific DOM location.

**Key Features:**
- Flexible portal targeting via CSS selectors or element references
- Automatic fallback to document.body if target not found
- Server-side rendering safe
- Full LoginModal API compatibility
- Proper z-index and backdrop handling

**Portal Target Options:**
- CSS Selector string (e.g., "#modal-root", ".modal-container")
- HTMLElement reference
- null/undefined (defaults to document.body)
        `
      }
    }
  },
  argTypes: {
    portalTarget: {
      control: 'text',
      description: 'CSS selector or element reference for portal target'
    },
    scenario: {
      control: 'text',
      description: 'Description of the test scenario'
    },
    isOpen: {
      table: { disable: true }
    },
    onClose: {
      table: { disable: true }
    },
    onLoginSuccess: {
      table: { disable: true }
    }
  }
}

export default meta

type Story = StoryObj<typeof PortalWithProvider>

// Default story - renders to document.body
export const DefaultPortal: Story = {
  args: {
    scenario: 'Default portal rendering to document.body'
  },
  parameters: {
    docs: {
      description: {
        story: 'Default behavior when no portalTarget is specified. The modal renders to document.body.'
      }
    }
  }
}

// Modal root story
export const ModalRootPortal: Story = {
  args: {
    portalTarget: '#modal-root',
    scenario: 'Portal targeting the dedicated modal root element'
  },
  parameters: {
    docs: {
      description: {
        story: 'Renders the modal to the dedicated #modal-root element for better organization.'
      }
    }
  }
}

// Custom target story
export const CustomTargetPortal: Story = {
  args: {
    portalTarget: '#custom-portal-target',
    scenario: 'Portal targeting a custom container element'
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates rendering to a custom target element. The green dashed area shows where the modal will appear.'
      }
    }
  }
}

// Fallback behavior story
export const FallbackPortal: Story = {
  args: {
    portalTarget: '#non-existent-element',
    scenario: 'Portal with invalid target - should fallback to document.body'
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows fallback behavior when the specified target element does not exist. Check browser console for warning message.'
      }
    }
  }
}

// Class selector story
export const ClassSelectorPortal: Story = {
  args: {
    portalTarget: '.portal-container',
    scenario: 'Portal targeting via CSS class selector'
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates using a CSS class selector as the portal target.'
      }
    }
  },
  decorators: [
    (Story) => (
      <div>
        <div className="portal-container" style={{
          border: '2px dashed #6f42c1',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
          backgroundColor: '#f8f7ff'
        }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            Portal Container (.portal-container) - Modal will render here
          </p>
        </div>
        <Story />
      </div>
    )
  ]
}