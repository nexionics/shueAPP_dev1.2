import type { Meta, StoryObj } from '@storybook/nextjs'
import { ThemeProvider } from '@/components/ThemeProvider'
import { PreferencesStep } from './PreferencesStep'
import { RegistrationFormData, FieldValidation } from './types'

const meta: Meta<typeof PreferencesStep> = {
  title: 'Authentication/Registration/PreferencesStep',
  component: PreferencesStep,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The Preferences Step component is the third step in the registration process where users set their shopping preferences. It features:

- **Shoe Size Selection**: Dropdown with standard shoe sizes
- **Favorite Brands**: Multi-select for preferred sneaker brands
- **Buying Preference**: Choice between buying, selling, or both
- **Optional Fields**: All preferences are optional for flexibility
- **Smart Defaults**: Sensible default values for better UX
- **Validation**: Optional field validation with helpful feedback
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
  city: 'New York',
  state: 'NY',
  country: 'US',
  zipCode: '10001',
  allowLocationPermission: true,
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

export const WithBasicPreferences: Story = {
  args: {
    formData: createMockFormData({
      shoeSize: '10',
      buyingPreference: 'buying',
    }),
    validationState: createMockValidationState({
      shoeSize: { isValid: true, hasBeenTouched: true, error: '', isRequired: false },
      buyingPreference: { isValid: true, hasBeenTouched: true, error: '', isRequired: false },
    }),
    onNext: () => console.log('Next clicked'),
    onPrevious: () => console.log('Previous clicked'),
    onFieldChange: (field, value) => console.log('Field changed:', field, value),
    onFieldBlur: (field) => console.log('Field blurred:', field),
    isLoading: false,
  },
}

export const WithFavoriteBrands: Story = {
  args: {
    formData: createMockFormData({
      shoeSize: '9.5',
      favoriteBrands: ['Nike', 'Adidas', 'Jordan'],
      buyingPreference: 'both',
    }),
    validationState: createMockValidationState({
      shoeSize: { isValid: true, hasBeenTouched: true, error: '', isRequired: false },
      favoriteBrands: { isValid: true, hasBeenTouched: true, error: '', isRequired: false },
      buyingPreference: { isValid: true, hasBeenTouched: true, error: '', isRequired: false },
    }),
    onNext: () => console.log('Next clicked'),
    onPrevious: () => console.log('Previous clicked'),
    onFieldChange: (field, value) => console.log('Field changed:', field, value),
    onFieldBlur: (field) => console.log('Field blurred:', field),
    isLoading: false,
  },
}

export const SellerFocused: Story = {
  args: {
    formData: createMockFormData({
      shoeSize: '11',
      favoriteBrands: ['Off-White', 'Travis Scott', 'Supreme', 'Yeezy'],
      buyingPreference: 'selling',
    }),
    validationState: createMockValidationState({
      shoeSize: { isValid: true, hasBeenTouched: true, error: '', isRequired: false },
      favoriteBrands: { isValid: true, hasBeenTouched: true, error: '', isRequired: false },
      buyingPreference: { isValid: true, hasBeenTouched: true, error: '', isRequired: false },
    }),
    onNext: () => console.log('Next clicked'),
    onPrevious: () => console.log('Previous clicked'),
    onFieldChange: (field, value) => console.log('Field changed:', field, value),
    onFieldBlur: (field) => console.log('Field blurred:', field),
    isLoading: false,
  },
}

export const AllPreferencesSet: Story = {
  args: {
    formData: createMockFormData({
      shoeSize: '8.5',
      favoriteBrands: ['Nike', 'Adidas', 'New Balance', 'Converse', 'Vans'],
      buyingPreference: 'both',
    }),
    validationState: createMockValidationState({
      shoeSize: { isValid: true, hasBeenTouched: true, error: '', isRequired: false },
      favoriteBrands: { isValid: true, hasBeenTouched: true, error: '', isRequired: false },
      buyingPreference: { isValid: true, hasBeenTouched: true, error: '', isRequired: false },
    }),
    onNext: () => console.log('Next clicked'),
    onPrevious: () => console.log('Previous clicked'),
    onFieldChange: (field, value) => console.log('Field changed:', field, value),
    onFieldBlur: (field) => console.log('Field blurred:', field),
    isLoading: false,
  },
}

export const SkippingPreferences: Story = {
  args: {
    formData: createMockFormData({
      // All preference fields empty to show "skip" functionality
    }),
    validationState: createMockValidationState(),
    onNext: () => console.log('Next clicked (skipping preferences)'),
    onPrevious: () => console.log('Previous clicked'),
    onFieldChange: (field, value) => console.log('Field changed:', field, value),
    onFieldBlur: (field) => console.log('Field blurred:', field),
    isLoading: false,
  },
}

export const Loading: Story = {
  args: {
    formData: createMockFormData({
      shoeSize: '10',
      favoriteBrands: ['Nike', 'Jordan'],
      buyingPreference: 'buying',
    }),
    validationState: createMockValidationState({
      shoeSize: { isValid: true, hasBeenTouched: true, error: '', isRequired: false },
      favoriteBrands: { isValid: true, hasBeenTouched: true, error: '', isRequired: false },
      buyingPreference: { isValid: true, hasBeenTouched: true, error: '', isRequired: false },
    }),
    onNext: () => console.log('Next clicked'),
    onPrevious: () => console.log('Previous clicked'),
    onFieldChange: (field, value) => console.log('Field changed:', field, value),
    onFieldBlur: (field) => console.log('Field blurred:', field),
    isLoading: true,
  },
}