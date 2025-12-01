'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/Button'
import { Progress } from '@/components/ui/progress'
import { RegistrationFormData, FormValidationState, RegistrationStep } from './types'
import { validateField, isStepValid } from './validation'
import { AccountInfoStep } from './AccountInfoStep'
import { LocationInfoStep } from './LocationInfoStep'
import { PreferencesStep } from './PreferencesStep'
import { LegalStep } from './LegalStep'
import { CheckCircle, X, ArrowLeft } from 'lucide-react'
import { asModal } from '@/components/hoc'

export interface UnifiedRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (userData: RegistrationFormData) => void
  onSwitchToLogin?: () => void
}

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

const UnifiedRegistrationForm: React.FC<UnifiedRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToLogin
}) => {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData)
  const [validationState, setValidationState] = useState<FormValidationState>({} as FormValidationState)

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1)
      setFormData(initialFormData)
      setValidationState({} as FormValidationState)
      setRegistrationSuccess(false)
      setIsLoading(false)
    }
  }, [isOpen])

  // Save form data to localStorage for recovery
  useEffect(() => {
    if (isOpen && !registrationSuccess) {
      localStorage.setItem('shueapp_unified_registration_draft', JSON.stringify(formData))
    }
  }, [formData, isOpen, registrationSuccess])

  // Load draft data on mount
  useEffect(() => {
    if (isOpen) {
      const draft = localStorage.getItem('shueapp_unified_registration_draft')
      if (draft) {
        try {
          const draftData = JSON.parse(draft)
          setFormData(prev => ({ ...prev, ...draftData }))
        } catch (error) {
          console.warn('Failed to load registration draft:', error)
        }
      }
    }
  }, [isOpen])

  const handleFieldChange = useCallback((field: keyof RegistrationFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  const handleFieldBlur = useCallback((field: keyof RegistrationFormData) => {
    const validation = validateField(field, formData[field], formData)
    setValidationState(prev => ({
      ...prev,
      [field]: validation
    }))
  }, [formData])

  const handleNext = useCallback(() => {
    if (currentStep < 4) {
      setCurrentStep(prev => (prev + 1) as RegistrationStep)
    } else {
      handleSubmitRegistration()
    }
  }, [currentStep])

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => (prev - 1) as RegistrationStep)
    }
  }, [currentStep])

  const handleSubmitRegistration = async () => {
    setIsLoading(true)
    
    try {
      // Validate all required fields one more time
      const finalValidation = {} as FormValidationState
      Object.keys(formData).forEach(key => {
        const field = key as keyof RegistrationFormData
        finalValidation[field] = validateField(field, formData[field], formData)
      })
      
      setValidationState(finalValidation)
      
      // Check if all steps are valid
      const allStepsValid = [1, 2, 3, 4].every(step => 
        isStepValid(step, formData, finalValidation)
      )
      
      if (!allStepsValid) {
        // Find first invalid step and go there
        for (let step = 1; step <= 4; step++) {
          if (!isStepValid(step, formData, finalValidation)) {
            setCurrentStep(step as RegistrationStep)
            break
          }
        }
        return
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Success!
      setRegistrationSuccess(true)
      
      // Call success callback after a short delay
      setTimeout(() => {
        onSuccess?.(formData)
        handleClose()
      }, 2000)
      
    } catch (error) {
      console.error('Registration failed:', error)
      // Handle registration error here
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = useCallback(() => {
    if (!isLoading) {
      // Clear draft data when explicitly closing
      localStorage.removeItem('shueapp_unified_registration_draft')
      onClose()
    }
  }, [isLoading, onClose])

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

  if (!isOpen) {
    return null
  }

  if (registrationSuccess) {
    return (
      <div className="max-w-md mx-auto bg-background rounded-lg shadow-lg p-8">
        <div className="text-center py-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to ShueApp!</h2>
          <p className="text-muted-foreground mb-6">
            Your account has been created successfully. You can now start exploring our sneaker marketplace!
          </p>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              A verification email has been sent to <strong>{formData.email}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Please verify your email to access all features.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto max-h-[90vh] overflow-y-auto bg-background rounded-lg shadow-lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
            <p className="text-sm text-muted-foreground">Step {currentStep} of 4: {STEP_TITLES[currentStep]}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Account Info</span>
            <span>Location</span>
            <span>Preferences</span>
            <span>Terms</span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {renderCurrentStep()}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Button
                variant="link"
                className="p-0 h-auto text-primary"
                onClick={onSwitchToLogin}
                disabled={isLoading}
              >
                Sign In
              </Button>
            </p>
            
            {currentStep > 1 && (
              <div className="flex items-center text-muted-foreground">
                <ArrowLeft className="h-3 w-3 mr-1" />
                <Button
                  variant="link"
                  className="p-0 h-auto text-muted-foreground hover:text-foreground"
                  onClick={handlePrevious}
                  disabled={isLoading}
                >
                  Previous Step
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const UnifiedRegistrationModal = asModal(UnifiedRegistrationForm, {
  closeOnOutsideClick: true,
  closeOnEscape: true,
  containerClassName: 'fixed inset-0 z-50 flex items-center justify-center p-4'
})

// Export individual step components for testing and stories
export { AccountInfoStep, LocationInfoStep, PreferencesStep, LegalStep }
export type { UnifiedRegistrationModalProps }