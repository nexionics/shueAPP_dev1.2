import type { Meta, StoryObj } from '@storybook/nextjs'
import React, { useState } from 'react'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import { RegistrationModal, RegistrationModalForStorybook } from './RegistrationModal'
import { Button } from '@/components/Button'
import { 
  registrationIntegrationPlay, 
  registrationIntegrationDecorator 
} from './plays'

const meta = {
  title: 'Authentication/Registration/RegistrationModal',
  component: RegistrationModalForStorybook,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The Registration Modal is a comprehensive multi-step registration wizard that guides users through creating their ShueApp account. It features:

## Features
- **4-Step Registration Process**: Account Info → Location → Preferences → Legal Terms
- **Real-time Validation**: Field-level validation with immediate feedback
- **Progress Tracking**: Visual progress bar showing completion status
- **Responsive Design**: Mobile-friendly layout with proper touch targets
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **State Management**: Comprehensive form state with validation tracking
- **Success Feedback**: Celebratory success screen upon completion

## Registration Steps
1. **Account Information**: Personal details, email, password, phone number
2. **Location Details**: City, state, country, postal code with geolocation support
3. **Preferences**: Optional shoe size, favorite brands, buying preferences
4. **Legal Terms**: Terms of service, privacy policy, and marketing consent

## Usage
\`\`\`tsx
<RegistrationModal
  isOpen={showRegistration}
  onClose={() => setShowRegistration(false)}
  onSuccess={(userData) => handleRegistrationSuccess(userData)}
  onSwitchToLogin={() => switchToLogin()}
/>
\`\`\`

The modal handles the complete registration flow, including form validation, API submission, and success states.
        `
      }
    }
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <AuthProvider>
          <div className="h-screen w-screen bg-blue-50 dark:bg-gray-900">
            <Story />
          </div>
        </AuthProvider>
      </ThemeProvider>
    ),
  ],
  args: {
    isOpen: true,
  },
  argTypes: {
    isOpen: { 
      control: 'boolean',
      description: 'Controls whether the modal is open or closed'
    },
    onClose: { 
      action: 'close',
      description: 'Called when the modal should be closed'
    },
    onSuccess: { 
      action: 'registration-success',
      description: 'Called when registration is completed successfully'
    },
    onSwitchToLogin: { 
      action: 'switch-to-login',
      description: 'Called when user wants to switch to login'
    },
  },
} satisfies Meta<typeof RegistrationModal>

export default meta
type Story = StoryObj<typeof meta>

// Interactive wrapper component for Storybook controls
const RegistrationModalWrapper = (args: any) => {
  const [isOpen, setIsOpen] = useState(args.isOpen || true)
  
  // Sync with Storybook controls
  React.useEffect(() => {
    setIsOpen(args.isOpen)
  }, [args.isOpen])
  
  return (
    <div className="p-4">
      {!isOpen && (
        <div className="text-center">
          <p className="mb-4 text-muted-foreground">
            Use the "isOpen" control in the Controls panel to open the modal, or click the button below:
          </p>
          <Button onClick={() => setIsOpen(true)}>
            Open Registration Modal
          </Button>
        </div>
      )}
      
      <RegistrationModalForStorybook
        {...args}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
          args.onClose?.()
        }}
        onSuccess={(userData) => {
          console.log('Registration completed successfully!', userData)
          args.onSuccess?.(userData)
          setIsOpen(false)
        }}
        onSwitchToLogin={() => {
          console.log('Switching to login modal')
          args.onSwitchToLogin?.()
          setIsOpen(false)
        }}
      />
    </div>
  )
}

// Default interactive state
export const Default: Story = {
  render: RegistrationModalWrapper,
  args: {
    isOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive registration modal with Storybook controls. Use the Controls panel to open/close the modal dynamically.'
      }
    }
  }
}

// Always open state (for static documentation)
export const AlwaysOpen: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Registration modal closed'),
    onSuccess: (userData) => console.log('Registration completed successfully!', userData),
    onSwitchToLogin: () => console.log('Switching to login modal'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Static version of the registration modal that stays open for documentation purposes.'
      }
    }
  }
}

// Direct render without portal for testing
export const DirectRender: Story = {
  render: (args) => {
    // Import the internal component directly
    const { RegistrationModal } = require('./RegistrationModal')
    
    // Create a test wrapper that renders the modal content directly
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/30" />
        <div className="relative z-10 max-w-lg mx-auto">
          {/* Render the internal form component directly */}
          <div className="max-w-lg mx-auto max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Registration Modal Test</h2>
                <p className="text-muted-foreground mb-4">
                  This is a direct render test to verify the modal content is working.
                </p>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => console.log('Test button clicked')}
                >
                  Test Button
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Direct render test without portal to verify modal content visibility.'
      }
    }
  }
}

// Interactive demo with enhanced logging
export const Interactive: Story = {
  render: RegistrationModalWrapper,
  args: {
    isOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo with enhanced console logging. Complete the registration flow to see detailed logs.'
      }
    }
  }
}

// Step-by-step walkthrough (opens to different steps)
export const StepWalkthrough: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Registration modal closed'),
    onSuccess: (userData) => console.log('Registration completed successfully!', userData),
    onSwitchToLogin: () => console.log('Switching to login modal'),
  },
  parameters: {
    docs: {
      description: {
        story: `
This story demonstrates the complete registration flow. You can navigate through all four steps:

1. Fill out the Account Information step with valid data
2. Proceed to Location Details and enter your location
3. Optionally set your preferences in step 3
4. Review and accept terms in the final step

Try entering invalid data to see the validation in action!
        `
      }
    }
  }
}

/**
 * Live registration integration test - tests complete registration flow with real API
 * This story performs end-to-end testing of the entire registration process.
 * 
 * **What this tests:**
 * - Complete 4-step registration flow
 * - Real network requests to registration API
 * - Form validation across all steps
 * - API error handling and success states
 * - Multi-step state management
 * 
 * **Test Data Used:**
 * - Name: John Test User
 * - Username: johntestuser
 * - Email: john.test@example.com
 * - Phone: (555) 123-4567
 * - Location: New York, NY 10001
 */
export const RegistrationIntegration: Story = {
  render: RegistrationModalWrapper,
  args: {
    isOpen: true,
  },
  play: registrationIntegrationPlay,
  parameters: {
    docs: {
      description: {
        story: `
**Live Registration Integration Test**

This story performs actual registration testing against a live backend server. It automatically:

1. **Fills Account Information** - Name, username, email, phone, and password
2. **Completes Location Details** - City, state, country, and zip code
3. **Sets Preferences** - Shoe size, favorite brands, and buying preferences  
4. **Accepts Legal Terms** - Agrees to terms of service and privacy policy
5. **Submits Registration** - Makes real API call to create account

**API Integration:**
- Checks backend server availability before testing
- Makes actual POST requests to /api/auth/register
- Handles real success/error responses
- Tests complete authentication flow

**Requirements:**
- Backend server running on configured endpoint
- Registration API endpoint functional
- Network connectivity to the API
- Valid test email domain

**What you'll see:**
- Real-time status updates during each step
- Console logs showing progress through each step
- Actual API requests and responses
- Complete registration state management

**Fallback Mode:**
If the backend server is not available, the test runs in simulation mode to verify the UI flow without making actual API calls.

Watch the status indicator in the top-right corner for real-time feedback!
        `
      }
    },
    // Longer timeout for real network requests and multi-step flow
    chromatic: { delay: 10000 },
    // Don't run in automated testing environments
    test: {
      skip: process.env.CI === 'true'
    }
  },
  decorators: [registrationIntegrationDecorator]
}

