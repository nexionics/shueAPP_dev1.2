import type { Meta, StoryObj } from '@storybook/nextjs'
import { ThemeProvider } from '@/components/ThemeProvider'
import { LocationInfoStep } from './LocationInfoStep'
import { RegistrationFormData, FieldValidation } from './types'

const meta: Meta<typeof LocationInfoStep> = {
  title: 'Authentication/Registration/LocationInfoStep',
  component: LocationInfoStep,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The Location Info Step component is the second step in the registration process where users provide their location information. It features:

- **City Input**: User's city with validation
- **State/Province Select**: Dropdown with state/province options
- **Country Select**: Country selection dropdown
- **Zip/Postal Code**: Postal code validation
- **Location Permission**: Optional location access toggle
- **Smart Validation**: Real-time location validation
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

// Mock data helpers
const createMockFormData = (overrides: Partial<RegistrationFormData> = {}): RegistrationFormData => ({
  fullName: 'John Doe',
  username: 'johndoe123',
  email: 'john.doe@example.com',
  phoneNumber: '(555) 123-4567',
  password: 'SecurePass123!',
  confirmPassword: 'SecurePass123!',
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
    onPrevious: () => console.log('Previous clicked'),
    onFieldChange: (field, value) => console.log('Field changed:', field, value),
    onFieldBlur: (field) => console.log('Field blurred:', field),
    isLoading: false,
  },
}

export const WithPartialLocation: Story = {
  args: {
    formData: createMockFormData({
      city: 'New York',
      state: 'NY',
      country: 'US',
    }),
    validationState: createMockValidationState({
      city: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
      state: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
      country: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
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
    formData: createMockFormData({
      city: '',
      state: '',
      country: '',
      zipCode: 'invalid',
    }),
    validationState: createMockValidationState({
      city: { 
        isValid: false, 
        hasBeenTouched: true, 
        error: 'City is required', 
        isRequired: true 
      },
      state: { 
        isValid: false, 
        hasBeenTouched: true, 
        error: 'State/Province is required', 
        isRequired: true 
      },
      country: { 
        isValid: false, 
        hasBeenTouched: true, 
        error: 'Country is required', 
        isRequired: true 
      },
      zipCode: { 
        isValid: false, 
        hasBeenTouched: true, 
        error: 'Please enter a valid postal code', 
        isRequired: true 
      },
    }),
    onNext: () => console.log('Next clicked'),
    onPrevious: () => console.log('Previous clicked'),
    onFieldChange: (field, value) => console.log('Field changed:', field, value),
    onFieldBlur: (field) => console.log('Field blurred:', field),
    isLoading: false,
  },
}

export const WithCompleteLocation: Story = {
  args: {
    formData: createMockFormData({
      city: 'New York',
      state: 'NY',
      country: 'US',
      zipCode: '10001',
      allowLocationPermission: true,
    }),
    validationState: createMockValidationState({
      city: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
      state: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
      country: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
      zipCode: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
      allowLocationPermission: { isValid: true, hasBeenTouched: true, error: '', isRequired: false },
    }),
    onNext: () => console.log('Next clicked'),
    onPrevious: () => console.log('Previous clicked'),
    onFieldChange: (field, value) => console.log('Field changed:', field, value),
    onFieldBlur: (field) => console.log('Field blurred:', field),
    isLoading: false,
  },
}

export const InternationalLocation: Story = {
  args: {
    formData: createMockFormData({
      city: 'London',
      state: 'England',
      country: 'GB',
      zipCode: 'SW1A 1AA',
      allowLocationPermission: false,
    }),
    validationState: createMockValidationState({
      city: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
      state: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
      country: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
      zipCode: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
      allowLocationPermission: { isValid: true, hasBeenTouched: false, error: '', isRequired: false },
    }),
    onNext: () => console.log('Next clicked'),
    onPrevious: () => console.log('Previous clicked'),
    onFieldChange: (field, value) => console.log('Field changed:', field, value),
    onFieldBlur: (field) => console.log('Field blurred:', field),
    isLoading: false,
  },
}

export const Loading: Story = {
  args: {
    formData: createMockFormData({
      city: 'New York',
      state: 'NY',
      country: 'US',
      zipCode: '10001',
      allowLocationPermission: true,
    }),
    validationState: createMockValidationState({
      city: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
      state: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
      country: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
      zipCode: { isValid: true, hasBeenTouched: true, error: '', isRequired: true },
      allowLocationPermission: { isValid: true, hasBeenTouched: true, error: '', isRequired: false },
    }),
    onNext: () => console.log('Next clicked'),
    onPrevious: () => console.log('Previous clicked'),
    onFieldChange: (field, value) => console.log('Field changed:', field, value),
    onFieldBlur: (field) => console.log('Field blurred:', field),
    isLoading: true,
  },
}