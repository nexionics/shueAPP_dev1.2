import type { Meta, StoryObj } from '@storybook/nextjs'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AccountInfoStep } from './AccountInfoStep'
import { RegistrationFormData, FieldValidation } from './types'

const meta: Meta<typeof AccountInfoStep> = {
  title: 'Authentication/Registration/AccountInfoStep',
  component: AccountInfoStep,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The Account Info Step component is the first step in the registration process where users enter their basic account information. It features:

- **Full Name Input**: User's full legal name with validation
- **Username Input**: Unique username with real-time availability checking
- **Email Address**: Valid email format validation
- **Phone Number**: Formatted phone number input with validation
- **Password Fields**: Secure password with strength indicator and confirmation
- **Real-time Validation**: Instant feedback on field validation
- **Security Features**: Password visibility toggle and strength meter
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
    onNext: { action: 'next' },
    onFieldChange: { action: 'field-changed' },
    onFieldBlur: { action: 'field-blurred' },
    isLoading: { control: 'boolean' },
    formData: { control: 'object' },
    validationState: { control: 'object' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Mock data helpers
const createMockFormData = (overrides: Partial<RegistrationFormData> = {}): RegistrationFormData => ({
  fullName: '',
  username: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  city: '',
  state: '',
  country: '',
  zipCode: '',
  allowLocationPermission: false,
  agreeToTerms: false,
  marketingOptIn: false,
  shoeSize: '',
  favoriteBrands: [],
  buyingPreference: 'buying',
  ...overrides,
})

const createMockValidationState = (overrides: Partial<Record<keyof RegistrationFormData, FieldValidation>> = {}) => {
  const defaultValidation: FieldValidation = { isValid: true, hasBeenTouched: false, error: '', isRequired: false }
  const keys: (keyof RegistrationFormData)[] = [
    'fullName', 'username', 'email', 'phoneNumber', 'password', 'confirmPassword',
    'city', 'state', 'country', 'zipCode', 'allowLocationPermission',
    'agreeToTerms', 'marketingOptIn', 'shoeSize', 'favoriteBrands', 'buyingPreference'
  ]
  
  const validationState = {} as Record<keyof RegistrationFormData, FieldValidation>
  keys.forEach(key => {
    validationState[key] = { ...defaultValidation, ...overrides[key] }
  })
  
  return validationState
}

// Stories
export const Default: Story = {
  args: {
    formData: createMockFormData(),
    validationState: createMockValidationState(),
    onNext: () => console.log('Next clicked'),
    onFieldChange: (field, value) => console.log('Field changed:', field, value),
    onFieldBlur: (field) => console.log('Field blurred:', field),
    isLoading: false,
  },
}

export const WithPartialInput: Story = {
  args: {
    formData: createMockFormData({
      fullName: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      phoneNumber: '(555) 123-4567',
    }),
    validationState: createMockValidationState({
      fullName: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
      username: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
      email: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
      phoneNumber: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
    }),
    onNext: () => console.log('Next clicked'),
    onFieldChange: (field, value) => console.log('Field changed:', field, value),
    onFieldBlur: (field) => console.log('Field blurred:', field),
    isLoading: false,
  },
}

export const WithValidationErrors: Story = {
  args: {
    formData: createMockFormData({
      fullName: 'J',
      username: 'jo',
      email: 'invalid-email',
      phoneNumber: '123',
      password: 'weak',
      confirmPassword: 'different',
    }),
    validationState: createMockValidationState({
      fullName: { 
        isValid: false, 
        hasBeenTouched: true, 
        error: 'Full name must be at least 2 characters', 
        isRequired: true 
      },
      username: { 
        isValid: false, 
        hasBeenTouched: true, 
        error: 'Username must be at least 3 characters', 
        isRequired: true 
      },
      email: { 
        isValid: false, 
        hasBeenTouched: true, 
        error: 'Please enter a valid email address', 
        isRequired: true 
      },
      phoneNumber: { 
        isValid: false, 
        hasBeenTouched: true, 
        error: 'Please enter a valid phone number', 
        isRequired: true 
      },
      password: { 
        isValid: false, 
        hasBeenTouched: true, 
        error: 'Password must be at least 8 characters', 
        isRequired: true 
      },
      confirmPassword: { 
        isValid: false, 
        hasBeenTouched: true, 
        error: 'Passwords do not match', 
        isRequired: true 
      },
    }),
    onNext: () => console.log('Next clicked'),
    onFieldChange: (field, value) => console.log('Field changed:', field, value),
    onFieldBlur: (field) => console.log('Field blurred:', field),
    isLoading: false,
  },
}

export const WithValidInput: Story = {
  args: {
    formData: createMockFormData({
      fullName: 'John Doe',
      username: 'johndoe123',
      email: 'john.doe@example.com',
      phoneNumber: '(555) 123-4567',
      password: 'SecurePass123!',
      confirmPassword: 'SecurePass123!',
    }),
    validationState: createMockValidationState({
      fullName: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
      username: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
      email: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
      phoneNumber: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
      password: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
      confirmPassword: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
    }),
    onNext: () => console.log('Next clicked'),
    onFieldChange: (field, value) => console.log('Field changed:', field, value),
    onFieldBlur: (field) => console.log('Field blurred:', field),
    isLoading: false,
  },
}

export const Loading: Story = {
  args: {
    formData: createMockFormData({
      fullName: 'John Doe',
      username: 'johndoe123',
      email: 'john.doe@example.com',
      phoneNumber: '(555) 123-4567',
      password: 'SecurePass123!',
      confirmPassword: 'SecurePass123!',
    }),
    validationState: createMockValidationState({
      fullName: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
      username: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
      email: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
      phoneNumber: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
      password: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
      confirmPassword: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
    }),
    onNext: () => console.log('Next clicked'),
    onFieldChange: (field, value) => console.log('Field changed:', field, value),
    onFieldBlur: (field) => console.log('Field blurred:', field),
    isLoading: true,
  },
}