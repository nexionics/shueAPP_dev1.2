export interface RegistrationFormData {
  // Core Account Information (Required)
  fullName: string
  username: string
  email: string
  phoneNumber: string
  password: string
  confirmPassword: string

  // Location Information (Required)
  city: string
  state: string
  country: string
  zipCode: string
  allowLocationPermission: boolean

  // Legal Requirements (Required)
  agreeToTerms: boolean
  marketingOptIn: boolean

  // Optional Fields
  shoeSize?: string
  favoriteBrands?: string[]
  buyingPreference?: 'buying' | 'selling' | 'both'
  // Identity verification (optional fields used when user is registering as a seller)
  idFront?: string // data URL or uploaded file reference
  idBack?: string
  idParsed?: Record<string, string>
}

export interface FieldValidation {
  isValid: boolean
  error?: string
  isRequired: boolean
  hasBeenTouched: boolean
}

export type FormValidationState = {
  [K in keyof RegistrationFormData]: FieldValidation
}

export interface RegistrationStepProps {
  formData: RegistrationFormData
  validationState: FormValidationState
  onFieldChange: (field: keyof RegistrationFormData, value: any) => void
  // Accept optional value to allow immediate validation against a newly provided value
  onFieldBlur: (field: keyof RegistrationFormData, value?: any) => void
  onNext: () => void
  onPrevious: () => void
  isLoading?: boolean
}

export type RegistrationStep = 1 | 2 | 3 | 4 | 5

export interface RegistrationState {
  currentStep: RegistrationStep
  formData: RegistrationFormData
  validationState: FormValidationState
  isLoading: boolean
  error?: string
  isSubmitting: boolean
}

// API Response Types
export interface RegistrationSuccessResponse {
  success: boolean
  message: string
  user: {
    id: string
    email: string
    username: string
    fullName: string
    phoneNumber: string
    city: string
    state: string
    country: string
    zipCode: string
    allowLocationPermission: boolean
    marketingOptIn: boolean
    shoeSize?: string
    favoriteBrands?: string[]
    buyingPreference?: string
    createdAt: string
    updatedAt: string
  }
  token: string
  canSell: boolean
  requiresVerification: {
    email: boolean
    phone: boolean
    seller: boolean
  }
  verificationStatus: {
    email: boolean
    phone: boolean
  }
}

export interface RegistrationErrorResponse {
  success: boolean
  error: string
  canSell: boolean
}

export const SHOE_SIZES = [
  '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', 
  '11', '11.5', '12', '12.5', '13', '14', '15'
] as const

export const FAVORITE_BRANDS = [
  'Nike', 'Adidas', 'Jordan', 'Puma', 'New Balance', 
  'Converse', 'Vans', 'Reebok', 'Under Armour', 'ASICS'
] as const

export const BUYING_PREFERENCES = [
  { value: 'buying', label: 'Primarily Buying' },
  { value: 'selling', label: 'Primarily Selling' },
  { value: 'both', label: 'Both Buying and Selling' }
] as const