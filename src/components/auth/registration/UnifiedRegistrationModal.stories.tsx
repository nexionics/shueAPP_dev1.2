import type { Meta, StoryObj } from '@storybook/react'
import { UnifiedRegistrationModal } from './UnifiedRegistrationModal'
import { useState } from 'react'
import { Button } from '@/components/Button'

const meta: Meta<typeof UnifiedRegistrationModal> = {
  title: 'Auth/Registration/UnifiedRegistrationModal',
  component: UnifiedRegistrationModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The Unified Registration Modal is a complete, multi-step registration flow that combines all registration steps into a single modal component using the asModal HOC. This provides a seamless user experience with portal-based rendering.

## Features

- **4-Step Registration Flow**: Account Info → Location → Preferences → Terms
- **Portal-based Rendering**: Uses asModal HOC for flexible placement
- **Form Persistence**: Automatically saves and restores draft data
- **Progressive Validation**: Real-time validation with visual feedback
- **Responsive Design**: Works on all screen sizes
- **Accessibility**: Full keyboard navigation and screen reader support

## Usage

\`\`\`tsx
<UnifiedRegistrationModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSuccess={(userData) => console.log('Registration successful:', userData)}
  onSwitchToLogin={() => switchToLoginModal()}
/>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the modal is currently open'
    },
    onClose: {
      action: 'closed',
      description: 'Called when the modal should be closed'
    },
    onSuccess: {
      action: 'success',
      description: 'Called when registration is completed successfully'
    },
    onSwitchToLogin: {
      action: 'switch-to-login',
      description: 'Called when user wants to switch to login'
    }
  }
}

export default meta
type Story = StoryObj<typeof UnifiedRegistrationModal>

// Interactive wrapper component for Storybook
const RegistrationModalWrapper = (args: any) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)}>
        Open Registration Modal
      </Button>
      
      <UnifiedRegistrationModal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={(userData) => {
          console.log('Registration successful:', userData)
          args.onSuccess?.(userData)
          setIsOpen(false)
        }}
        onSwitchToLogin={() => {
          console.log('Switch to login requested')
          args.onSwitchToLogin?.()
          setIsOpen(false)
        }}
      />
    </div>
  )
}

export const Default: Story = {
  render: RegistrationModalWrapper,
  args: {}
}

export const AlwaysOpen: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Close requested'),
    onSuccess: (userData) => console.log('Success:', userData),
    onSwitchToLogin: () => console.log('Switch to login')
  }
}

// Individual step demonstrations
export const Step1_AccountInfo: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Close requested')
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the account information step (Step 1 of 4) with form fields for basic user details.'
      }
    }
  }
}

export const WithCustomPortalTarget: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false)
    
    return (
      <div className="p-4">
        <div id="custom-portal" className="min-h-screen bg-gray-50 p-8">
          <h2 className="text-xl mb-4">Custom Portal Target Area</h2>
          <Button onClick={() => setIsOpen(true)}>
            Open Modal in Custom Location
          </Button>
        </div>
        
        <UnifiedRegistrationModal
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          modalOptions={{
            portalTarget: '#custom-portal'
          }}
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates rendering the modal in a custom portal target using the modalOptions prop.'
      }
    }
  }
}

export const MobileFriendly: Story = {
  render: RegistrationModalWrapper,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Shows how the modal adapts to mobile screen sizes with responsive design.'
      }
    }
  }
}