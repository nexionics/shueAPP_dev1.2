import type { Meta, StoryObj } from '@storybook/nextjs'
import { ThemeProvider } from '@/components/ThemeProvider'
import { LegalStep } from './LegalStep'
import { RegistrationFormData, FieldValidation } from './types'

const meta: Meta<typeof LegalStep> = {
  title: 'Authentication/Registration/LegalStep',
  component: LegalStep,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The Legal Step component is the final step in the registration process where users must agree to terms of service and privacy policy. It features:

- **Required Terms Agreement**: Users must accept terms and privacy policy to proceed
- **Optional Marketing Opt-in**: Choice to receive promotional communications
- **Document Previews**: Modal dialogs to view full terms and privacy policy
- **Key Points Summary**: Highlights important privacy and data protection points
- **Validation**: Real-time validation with visual feedback
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
    onPrevious: { action: 'previous' },
    onFieldChange: { action: 'field-changed' },
    onFieldBlur: { action: 'field-blurred' },
    isLoading: { control: 'boolean' },
    formData: { control: 'object' },
    validationState: { control: 'object' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Mock data - create minimal valid form data
const createMockFormData = (overrides: Partial<RegistrationFormData> = {}): RegistrationFormData => ({
  fullName: 'John Doe',
  username: 'johndoe',
  email: 'john@example.com',
  phoneNumber: '(555) 123-4567',
  password: 'SecurePass123!',
  confirmPassword: 'SecurePass123!',
  city: 'New York',
  state: 'NY',
  country: 'US',
  zipCode: '10001',
  allowLocationPermission: false,
  agreeToTerms: false,
  marketingOptIn: false,
  shoeSize: '',
  favoriteBrands: [],
  buyingPreference: undefined,
  ...overrides
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
    onPrevious: () => console.log('Previous clicked'),
    onFieldChange: (field, value) => console.log('Field changed:', field, value),
    onFieldBlur: (field) => console.log('Field blurred:', field),
    isLoading: false,
  },
}

export const WithValidInput: Story = {
  args: {
    formData: createMockFormData({ agreeToTerms: true, marketingOptIn: true }),
    validationState: createMockValidationState({
      agreeToTerms: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
      marketingOptIn: { isValid: true, hasBeenTouched: true, error: '', isRequired: false }
    }),
    onNext: () => console.log('Next clicked'),
    onPrevious: () => console.log('Previous clicked'),
    onFieldChange: (field, value) => console.log('Field changed:', field, value),
    onFieldBlur: (field) => console.log('Field blurred:', field),
    isLoading: false,
  },
}

export const WithValidationErrors: Story = {
  args: {
    formData: createMockFormData(),
    validationState: createMockValidationState({
      agreeToTerms: { isValid: false, hasBeenTouched: true, error: 'You must agree to the terms to continue', isRequired: true }
    }),
    onNext: () => console.log('Next clicked'),
    onPrevious: () => console.log('Previous clicked'),
    onFieldChange: (field, value) => console.log('Field changed:', field, value),
    onFieldBlur: (field) => console.log('Field blurred:', field),
    isLoading: false,
  },
}

export const LoadingState: Story = {
  args: {
    formData: createMockFormData({ agreeToTerms: true, marketingOptIn: true }),
    validationState: createMockValidationState({
      agreeToTerms: { isValid: true, hasBeenTouched: true, error: '', isRequired: true }
    }),
    onNext: () => console.log('Next clicked'),
    onPrevious: () => console.log('Previous clicked'),
    onFieldChange: (field, value) => console.log('Field changed:', field, value),
    onFieldBlur: (field) => console.log('Field blurred:', field),
    isLoading: true,
  },
}

export const OnlyMarketingOptIn: Story = {
  args: {
    formData: createMockFormData({ agreeToTerms: true, marketingOptIn: false }),
    validationState: createMockValidationState({
      agreeToTerms: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
      marketingOptIn: { isValid: true, hasBeenTouched: false, error: '', isRequired: false }
    }),
    onNext: () => console.log('Next clicked'),
    onPrevious: () => console.log('Previous clicked'),
    onFieldChange: (field, value) => console.log('Field changed:', field, value),
    onFieldBlur: (field) => console.log('Field blurred:', field),
    isLoading: false,
  },
}