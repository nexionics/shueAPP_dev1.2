import { RegistrationFormData, FieldValidation } from './types'

export const validateField = (
  field: keyof RegistrationFormData, 
  value: any, 
  formData: RegistrationFormData
): FieldValidation => {
  const baseValidation: FieldValidation = {
    isValid: false,
    isRequired: true,
    hasBeenTouched: true
  }

  switch (field) {
    case 'fullName':
      if (!value || typeof value !== 'string') {
        return { ...baseValidation, error: 'Full name is required' }
      }
      if (value.length < 2) {
        return { ...baseValidation, error: 'Full name must be at least 2 characters' }
      }
      if (value.length > 100) {
        return { ...baseValidation, error: 'Full name must be less than 100 characters' }
      }
      // Check for malicious patterns
      if (/[<>{}[\]\\\/]/.test(value)) {
        return { ...baseValidation, error: 'Full name contains invalid characters' }
      }
      return { ...baseValidation, isValid: true }

    case 'username':
      if (!value || typeof value !== 'string') {
        return { ...baseValidation, error: 'Username is required' }
      }
      if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        return { ...baseValidation, error: 'Username can only contain letters, numbers, and underscores' }
      }
      if (value.length < 3) {
        return { ...baseValidation, error: 'Username must be at least 3 characters' }
      }
      if (value.length > 30) {
        return { ...baseValidation, error: 'Username must be less than 30 characters' }
      }
      return { ...baseValidation, isValid: true }

    case 'email':
      if (!value || typeof value !== 'string') {
        return { ...baseValidation, error: 'Email is required' }
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return { ...baseValidation, error: 'Please enter a valid email address' }
      }
      return { ...baseValidation, isValid: true }

    case 'phoneNumber':
      if (!value || typeof value !== 'string') {
        return { ...baseValidation, error: 'Phone number is required' }
      }
      // Remove all non-digits for validation
      const phoneDigits = value.replace(/\D/g, '')
      if (phoneDigits.length < 10) {
        return { ...baseValidation, error: 'Please enter a valid phone number' }
      }
      return { ...baseValidation, isValid: true }

    case 'password':
      if (!value || typeof value !== 'string') {
        return { ...baseValidation, error: 'Password is required' }
      }
      if (value.length < 8) {
        return { ...baseValidation, error: 'Password must be at least 8 characters' }
      }
      if (!/(?=.*[a-z])/.test(value)) {
        return { ...baseValidation, error: 'Password must contain at least one lowercase letter' }
      }
      if (!/(?=.*[A-Z])/.test(value)) {
        return { ...baseValidation, error: 'Password must contain at least one uppercase letter' }
      }
      if (!/(?=.*\d)/.test(value)) {
        return { ...baseValidation, error: 'Password must contain at least one number' }
      }
      if (!/(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(value)) {
        return { ...baseValidation, error: 'Password must contain at least one special character' }
      }
      return { ...baseValidation, isValid: true }

    case 'confirmPassword':
      if (!value || typeof value !== 'string') {
        return { ...baseValidation, error: 'Please confirm your password' }
      }
      if (value !== formData.password) {
        return { ...baseValidation, error: 'Passwords do not match' }
      }
      return { ...baseValidation, isValid: true }

    case 'city':
      if (!value || typeof value !== 'string') {
        return { ...baseValidation, error: 'City is required' }
      }
      if (value.trim().length === 0) {
        return { ...baseValidation, error: 'City is required' }
      }
      return { ...baseValidation, isValid: true }

    case 'state':
      if (!value || typeof value !== 'string') {
        return { ...baseValidation, error: 'State is required' }
      }
      if (value.trim().length === 0) {
        return { ...baseValidation, error: 'State is required' }
      }
      return { ...baseValidation, isValid: true }

    case 'country':
      if (!value || typeof value !== 'string') {
        return { ...baseValidation, error: 'Country is required' }
      }
      if (value.trim().length === 0) {
        return { ...baseValidation, error: 'Country is required' }
      }
      return { ...baseValidation, isValid: true }

    case 'zipCode':
      if (!value || typeof value !== 'string') {
        return { ...baseValidation, error: 'ZIP/Postal code is required' }
      }
      if (value.trim().length === 0) {
        return { ...baseValidation, error: 'ZIP/Postal code is required' }
      }
      return { ...baseValidation, isValid: true }

    case 'agreeToTerms':
      if (!value) {
        return { ...baseValidation, error: 'You must agree to the terms and conditions to continue' }
      }
      return { ...baseValidation, isValid: true }

    // Optional fields
    case 'allowLocationPermission':
    case 'marketingOptIn':
      return { ...baseValidation, isValid: true, isRequired: false }

    case 'shoeSize':
    case 'favoriteBrands':
    case 'buyingPreference':
      return { ...baseValidation, isValid: true, isRequired: false }

    default:
      return baseValidation
  }
}

export const getPasswordStrength = (password: string): {
  score: number
  label: string
  color: string
} => {
  if (!password) {
    return { score: 0, label: 'Enter a password', color: 'text-gray-400' }
  }

  let score = 0
  
  // Length check
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  
  // Character variety checks
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score += 1

  if (score < 3) {
    return { score, label: 'Weak', color: 'text-red-500' }
  } else if (score < 5) {
    return { score, label: 'Medium', color: 'text-yellow-500' }
  } else {
    return { score, label: 'Strong', color: 'text-green-500' }
  }
}

export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digits
  const phoneNumber = value.replace(/\D/g, '')
  
  // Format as (XXX) XXX-XXXX for US numbers
  if (phoneNumber.length === 0) return ''
  if (phoneNumber.length <= 3) return phoneNumber
  if (phoneNumber.length <= 6) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
}

export const isStepValid = (
  step: number, 
  formData: RegistrationFormData, 
  validationState: any
): boolean => {
  switch (step) {
    case 1: // Account Info
      return ['fullName', 'username', 'email', 'phoneNumber', 'password', 'confirmPassword']
        .every(field => validationState[field]?.isValid)
    
    case 2: // Location Info
      return ['city', 'state', 'country', 'zipCode']
        .every(field => validationState[field]?.isValid)
    
    case 3: // Preferences (all optional)
      return true
    
    case 4: // Legal
      return validationState.agreeToTerms?.isValid
    
    default:
      return false
  }
}