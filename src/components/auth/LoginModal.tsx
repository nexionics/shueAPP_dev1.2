'use client'

import { useState, useCallback, useEffect } from 'react'
import { useAuth } from "@/contexts/AuthContext"
import { Button } from '@/components/Button'
import { Progress } from '@/components/ui/progress'
import { RegistrationFormData, FormValidationState, RegistrationStep } from './registration/types'
import { validateField, isStepValid } from './registration/validation'
import { AccountInfoStep } from './registration/AccountInfoStep'
import { LocationInfoStep } from './registration/LocationInfoStep'
import { PreferencesStep } from './registration/PreferencesStep'
import { LegalStep } from './registration/LegalStep'
import { CheckCircle, X, ArrowLeft, ArrowRight } from 'lucide-react'
import { register } from '@/api/authentication'

type AuthMode = 'login' | 'register'

const STEP_TITLES = {
  1: 'Account Information',
  2: 'Location Details', 
  3: 'Preferences',
  4: 'Terms & Privacy'
}

const initialFormData: RegistrationFormData = {
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
  buyingPreference: undefined
}

// Registration Form Component - embedded version
interface RegistrationFormProps {
  onClose: () => void
  onSwitchToLogin: () => void
  onSuccess?: (userData: RegistrationFormData) => void
}

function RegistrationForm({ onClose, onSwitchToLogin, onSuccess }: RegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData)
  const [validationState, setValidationState] = useState<FormValidationState>({} as FormValidationState)

  const handleFieldChange = useCallback((field: keyof RegistrationFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  // Accept optional value to validate against the latest input (useful when validating immediately after change)
  const handleFieldBlur = useCallback((field: keyof RegistrationFormData, value?: any) => {
    const val = value !== undefined ? value : formData[field]
    // Validate using a snapshot of formData with the potentially updated field value
    const validation = validateField(field, val, { ...formData, [field]: val })
    // TEMP LOG: help debugging why some fields aren't validating (remove in prod)
    // eslint-disable-next-line no-console
    console.log('[Registration] validateField', { field, val, validation })
    setValidationState(prev => ({
      ...prev,
      [field]: validation
    }))
  }, [formData])

  const handleNext = useCallback(async () => {
    if (currentStep < 4) {
      // Validate current step before proceeding
      const fieldsToValidate = getFieldsForStep(currentStep)
      const finalValidation = {} as FormValidationState
      
      fieldsToValidate.forEach(field => {
        finalValidation[field] = validateField(field, formData[field], formData)
      })
      
      setValidationState(finalValidation)
      
      if (isStepValid(currentStep, formData, finalValidation)) {
        setCurrentStep(prev => prev + 1)
      }
    } else {
      // Final step - submit registration
      await handleSubmitRegistration()
    }
  }, [currentStep, formData])

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }, [currentStep])

  const handleSubmitRegistration = async () => {
    setIsLoading(true)
    try {
      // Call the actual registration API
      const result = await register(formData)
      
      if (result.success) {
        setRegistrationSuccess(true)
        setTimeout(() => {
          onSuccess?.(formData)
          onClose()
        }, 2000)
      } else {
        // Handle registration error
        console.error('Registration failed:', result.message || result.error)
        // You could add error state here to display to user
        throw new Error(result.message || result.error || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration failed:', error)
      // You could add error handling UI here
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const getFieldsForStep = (step: RegistrationStep): (keyof RegistrationFormData)[] => {
    switch (step) {
      case 1:
        return ['fullName', 'username', 'email', 'phoneNumber', 'password', 'confirmPassword']
      case 2:
        return ['city', 'state', 'country', 'zipCode']
      case 3:
        return []
      case 4:
        return ['agreeToTerms']
      default:
        return []
    }
  }

  const getProgressPercentage = () => {
    return (currentStep / 4) * 100
  }

  const renderCurrentStep = () => {
    const stepProps = {
      formData,
      validationState,
      onFieldChange: handleFieldChange,
      onFieldBlur: handleFieldBlur,
      onNext: handleNext,
      onPrevious: handlePrevious,
      isLoading
    }

    switch (currentStep) {
      case 1:
        return <AccountInfoStep {...stepProps} />
      case 2:
        return <LocationInfoStep {...stepProps} />
      case 3:
        return <PreferencesStep {...stepProps} />
      case 4:
        return <LegalStep {...stepProps} />
      default:
        return null
    }
  }

  if (registrationSuccess) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to ShueApp!</h2>
        <p className="text-gray-600 mb-6">
          Your account has been created successfully. You can now start exploring our sneaker marketplace!
        </p>
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            A verification email has been sent to <strong>{formData.email}</strong>
          </p>
          <p className="text-sm text-gray-600">
            Please verify your email to access all features.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-sm text-gray-600">Step {currentStep} of 4: {STEP_TITLES[currentStep]}</p>
        </div>
        <button
          onClick={onClose}
          disabled={isLoading}
          className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Progress</span>
          <span>{Math.round(getProgressPercentage())}%</span>
        </div>
        <Progress value={getProgressPercentage()} className="h-2" />
      </div>

      {/* Current Step Content */}
      <div className="mb-6">
        {renderCurrentStep()}
      </div>

      {/* Footer */}
      <div className="pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              disabled={isLoading}
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline focus:outline-none focus:underline disabled:text-gray-400"
            >
              Sign In
            </button>
          </p>
          
          {currentStep > 1 && (
            <div className="flex items-center text-gray-500">
              <ArrowLeft className="h-3 w-3 mr-1" />
              <button
                onClick={handlePrevious}
                disabled={isLoading}
                className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                Back to Step {currentStep - 1}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Pure LoginModal component - only handles UI rendering
export interface LoginModalPureProps {
  isOpen: boolean
  onClose: () => void
  email: string
  password: string
  error: string
  isLoading: boolean
  mode: AuthMode
  onEmailChange: (email: string) => void
  onPasswordChange: (password: string) => void
  onSubmit: (e: React.FormEvent) => void
  onSwitchToRegister: () => void
  onSwitchToLogin: () => void
}

export function LoginModalPure({
  isOpen,
  onClose,
  email,
  password,
  error,
  isLoading,
  mode,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onSwitchToRegister,
  onSwitchToLogin
}: LoginModalPureProps) {
  if (!isOpen) return null

  // If in register mode, show the registration form
  if (mode === 'register') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
        <div 
          className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <RegistrationForm
            onClose={onClose}
            onSwitchToLogin={onSwitchToLogin}
          />
        </div>
      </div>
    )
  }

  // Login mode - show login form
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Sign in to ShueApp</h2>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                data-testid="email-input"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onEmailChange(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                data-testid="password-input"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onPasswordChange(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>
          
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3" role="alert">
              {error}
            </div>
          )}
          
          <div className="flex gap-3 pt-2">
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
            
            <button 
              type="button" 
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
        
        {/* Registration Link */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              disabled={isLoading}
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline focus:outline-none focus:underline disabled:text-gray-400"
            >
              Create one here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

// Container component - handles state and business logic
export interface LoginModalContainerProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess?: () => void
}

export function LoginModalContainer({ 
  isOpen, 
  onClose, 
  onLoginSuccess 
}: LoginModalContainerProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState<AuthMode>('login')
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      await login(email, password)
      
      // Reset form state
      setEmail('')
      setPassword('')
      setError('')
      
      // Call success callback if provided
      onLoginSuccess?.()
      
      // Close modal
      onClose()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid email or password'
      setError(errorMessage)
    }
  }

  const handleClose = () => {
    // Reset form state when closing
    setEmail('')
    setPassword('')
    setError('')
    setMode('login')
    onClose()
  }

  const handleSwitchToRegister = () => {
    setError('')
    setMode('register')
  }

  const handleSwitchToLogin = () => {
    setError('')
    setMode('login')
  }

  return (
    <LoginModalPure
      isOpen={isOpen}
      onClose={handleClose}
      email={email}
      password={password}
      error={error}
      isLoading={isLoading}
      mode={mode}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      onSwitchToRegister={handleSwitchToRegister}
      onSwitchToLogin={handleSwitchToLogin}
    />
  )
}

// Default export for backward compatibility
export interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess?: () => void
}

export function LoginModal(props: LoginModalProps) {
  return <LoginModalContainer {...props} />
}

// Named exports for specific use cases
export { LoginModalContainer as LoginModalWithLogic }
export { LoginModalPure as LoginModalPresentation }
