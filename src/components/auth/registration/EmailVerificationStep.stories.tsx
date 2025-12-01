import type { Meta, StoryObj } from '@storybook/nextjs'
import { ThemeProvider } from '@/components/ThemeProvider'
import { EmailVerificationStep } from './EmailVerificationStep'

const meta: Meta<typeof EmailVerificationStep> = {
  title: 'Authentication/Registration/EmailVerificationStep',
  component: EmailVerificationStep,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The Email Verification Step component handles email verification during registration. It features:

- **6-Digit Code Input**: Formatted input for verification codes
- **Timer-based Resend**: Prevents spam with countdown timer
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
    isLoading: { control: 'boolean' },
    isVerified: { control: 'boolean' },
    error: { control: 'text' },
    timeRemaining: { control: { type: 'number', min: 0, max: 300 } },
    email: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    email: 'john.doe@example.com',
    onVerify: (code) => console.log('Verifying code:', code),
    onResendCode: () => console.log('Resending code'),
    onBack: () => console.log('Going back'),
    isLoading: false,
    isVerified: false,
    error: '',
    timeRemaining: 45,
  },
}

export const WithCountdown: Story = {
  args: {
    email: 'user@shueapp.com',
    onVerify: (code) => console.log('Verifying code:', code),
    onResendCode: () => console.log('Resending code'),
    onBack: () => console.log('Going back'),
    isLoading: false,
    isVerified: false,
    error: '',
    timeRemaining: 120,
  },
}

export const CanResend: Story = {
  args: {
    email: 'test@example.com',
    onVerify: (code) => console.log('Verifying code:', code),
    onResendCode: () => console.log('Resending code'),
    onBack: () => console.log('Going back'),
    isLoading: false,
    isVerified: false,
    error: '',
    timeRemaining: 0,
  },
}

export const WithError: Story = {
  args: {
    email: 'john.doe@example.com',
    onVerify: (code) => console.log('Verifying code:', code),
    onResendCode: () => console.log('Resending code'),
    onBack: () => console.log('Going back'),
    isLoading: false,
    isVerified: false,
    error: 'Invalid verification code. Please try again.',
    timeRemaining: 30,
  },
}

export const ExpiredCode: Story = {
  args: {
    email: 'user@shueapp.com',
    onVerify: (code) => console.log('Verifying code:', code),
    onResendCode: () => console.log('Resending code'),
    onBack: () => console.log('Going back'),
    isLoading: false,
    isVerified: false,
    error: 'Verification code has expired. Please request a new one.',
    timeRemaining: 0,
  },
}

export const Loading: Story = {
  args: {
    email: 'john.doe@example.com',
    onVerify: (code) => console.log('Verifying code:', code),
    onResendCode: () => console.log('Resending code'),
    onBack: () => console.log('Going back'),
    isLoading: true,
    isVerified: false,
    error: '',
    timeRemaining: 60,
  },
}

export const Verified: Story = {
  args: {
    email: 'john.doe@example.com',
    onVerify: (code) => console.log('Continuing after verification'),
    onResendCode: () => console.log('Resending code'),
    onBack: () => console.log('Going back'),
    isLoading: false,
    isVerified: true,
    error: '',
    timeRemaining: 0,
  },
}

export const LongEmail: Story = {
  args: {
    email: 'john.doe.with.a.very.long.email@verylongdomainname.example.com',
    onVerify: (code) => console.log('Verifying code:', code),
    onResendCode: () => console.log('Resending code'),
    onBack: () => console.log('Going back'),
    isLoading: false,
    isVerified: false,
    error: '',
    timeRemaining: 90,
  },
}