import type { Meta, StoryObj } from '@storybook/nextjs'
import { ThemeProvider } from '@/components/ThemeProvider'
import { PhoneVerificationStep } from './PhoneVerificationStep'

const meta: Meta<typeof PhoneVerificationStep> = {
  title: 'Authentication/Registration/PhoneVerificationStep',
  component: PhoneVerificationStep,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The Phone Verification Step component handles phone number verification during registration. It features:

- **6-Digit Code Input**: Formatted input for verification codes
- **Multiple Methods**: Support for SMS and voice call verification
- **Timer-based Resend**: Prevents spam with countdown timer
- **Method Switching**: Users can switch between SMS and call
- **Real-time Validation**: Instant feedback on code format
- **Success State**: Clear confirmation when verified
- **Error Handling**: Helpful error messages for failed attempts
- **Accessibility**: Proper ARIA labels, keyboard navigation, and screen reader support
        `
      }
    }
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div className="max-w-md mx-auto p-4">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    onVerify: { action: 'verify' },
    onResendCode: { action: 'resend-code' },
    onBack: { action: 'back' },
    onMethodChange: { action: 'method-change' },
    isLoading: { control: 'boolean' },
    isVerified: { control: 'boolean' },
    error: { control: 'text' },
    timeRemaining: { control: { type: 'number', min: 0, max: 300 } },
    phoneNumber: { control: 'text' },
    method: { control: { type: 'select', options: ['sms', 'call'] } },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    phoneNumber: '5551234567',
    onVerify: (code) => console.log('Verifying code:', code),
    onResendCode: () => console.log('Resending code'),
    onBack: () => console.log('Going back'),
    onMethodChange: (method) => console.log('Method changed to:', method),
    isLoading: false,
    isVerified: false,
    error: '',
    timeRemaining: 45,
    method: 'sms',
  },
}

export const SMSMethod: Story = {
  args: {
    phoneNumber: '(555) 987-6543',
    onVerify: (code) => console.log('Verifying code:', code),
    onResendCode: () => console.log('Resending SMS code'),
    onBack: () => console.log('Going back'),
    onMethodChange: (method) => console.log('Method changed to:', method),
    isLoading: false,
    isVerified: false,
    error: '',
    timeRemaining: 120,
    method: 'sms',
  },
}

export const CallMethod: Story = {
  args: {
    phoneNumber: '5551234567',
    onVerify: (code) => console.log('Verifying code:', code),
    onResendCode: () => console.log('Resending call'),
    onBack: () => console.log('Going back'),
    onMethodChange: (method) => console.log('Method changed to:', method),
    isLoading: false,
    isVerified: false,
    error: '',
    timeRemaining: 90,
    method: 'call',
  },
}

export const CanResend: Story = {
  args: {
    phoneNumber: '(555) 123-4567',
    onVerify: (code) => console.log('Verifying code:', code),
    onResendCode: () => console.log('Resending code'),
    onBack: () => console.log('Going back'),
    onMethodChange: (method) => console.log('Method changed to:', method),
    isLoading: false,
    isVerified: false,
    error: '',
    timeRemaining: 0,
    method: 'sms',
  },
}

export const WithError: Story = {
  args: {
    phoneNumber: '5551234567',
    onVerify: (code) => console.log('Verifying code:', code),
    onResendCode: () => console.log('Resending code'),
    onBack: () => console.log('Going back'),
    onMethodChange: (method) => console.log('Method changed to:', method),
    isLoading: false,
    isVerified: false,
    error: 'Invalid verification code. Please try again.',
    timeRemaining: 30,
    method: 'sms',
  },
}

export const ExpiredCode: Story = {
  args: {
    phoneNumber: '(555) 987-6543',
    onVerify: (code) => console.log('Verifying code:', code),
    onResendCode: () => console.log('Resending code'),
    onBack: () => console.log('Going back'),
    onMethodChange: (method) => console.log('Method changed to:', method),
    isLoading: false,
    isVerified: false,
    error: 'Verification code has expired. Please request a new one.',
    timeRemaining: 0,
    method: 'call',
  },
}

export const Loading: Story = {
  args: {
    phoneNumber: '5551234567',
    onVerify: (code) => console.log('Verifying code:', code),
    onResendCode: () => console.log('Resending code'),
    onBack: () => console.log('Going back'),
    onMethodChange: (method) => console.log('Method changed to:', method),
    isLoading: true,
    isVerified: false,
    error: '',
    timeRemaining: 60,
    method: 'sms',
  },
}

export const Verified: Story = {
  args: {
    phoneNumber: '5551234567',
    onVerify: (code) => console.log('Continuing after verification'),
    onResendCode: () => console.log('Resending code'),
    onBack: () => console.log('Going back'),
    onMethodChange: (method) => console.log('Method changed to:', method),
    isLoading: false,
    isVerified: true,
    error: '',
    timeRemaining: 0,
    method: 'sms',
  },
}

export const InternationalNumber: Story = {
  args: {
    phoneNumber: '+44 20 7946 0958',
    onVerify: (code) => console.log('Verifying code:', code),
    onResendCode: () => console.log('Resending code'),
    onBack: () => console.log('Going back'),
    onMethodChange: (method) => console.log('Method changed to:', method),
    isLoading: false,
    isVerified: false,
    error: '',
    timeRemaining: 75,
    method: 'sms',
  },
}

export const WithoutMethodSwitch: Story = {
  args: {
    phoneNumber: '5551234567',
    onVerify: (code) => console.log('Verifying code:', code),
    onResendCode: () => console.log('Resending code'),
    onBack: () => console.log('Going back'),
    // No onMethodChange prop - hides method selector
    isLoading: false,
    isVerified: false,
    error: '',
    timeRemaining: 90,
    method: 'sms',
  },
}