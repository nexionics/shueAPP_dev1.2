'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Button } from '@/components/Button'
import { Progress } from '@/components/ui/progress'
import { RegistrationFormData, FormValidationState, RegistrationStep } from './types'
import { validateField, isStepValid } from './validation'
import { useFormik } from 'formik'
import { registrationSchema } from './schema'
import { AccountInfoStep } from './AccountInfoStep'
import { LocationInfoStep } from './LocationInfoStep'
import { PreferencesStep } from './PreferencesStep'
import { LegalStep } from './LegalStep'
import { IdentityVerificationStep } from './IdentityVerificationStep'
import { CheckCircle, X, ArrowLeft, ArrowRight } from 'lucide-react'
import { asModal } from '@/components/hoc'
import { register } from '@/api/authentication'
import { verifySeller, verifySellerMultipart } from '@/api/authentication/verification'

interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (userData: RegistrationFormData) => void
  onSwitchToLogin?: () => void
}

const STEP_TITLES = {
  1: 'Account Information',
  2: 'Location Details',
  3: 'Preferences',
  4: 'Identity Verification',
  5: 'Terms & Privacy'
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
  ,
  idFront: undefined,
  idBack: undefined,
  idParsed: undefined
}

const RegistrationForm: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToLogin
}) => {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const formik = useFormik<RegistrationFormData>({
    initialValues: initialFormData,
    validationSchema: registrationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      setIsLoading(true)
      try {
        // Run legacy field-level validation to compute a shaped validationState
        const finalValidation = {} as FormValidationState
        Object.keys(values).forEach(key => {
          const field = key as keyof RegistrationFormData
          finalValidation[field] = validateField(field, (values as any)[field], values)
        })

        // If any step invalid, navigate to first invalid and bail
        const allStepsValid = [1, 2, 3, 4].every(step => isStepValid(step, values, finalValidation))
        if (!allStepsValid) {
          for (let step = 1; step <= 4; step++) {
            if (!isStepValid(step, values, finalValidation)) {
              setCurrentStep(step as RegistrationStep)
              break
            }
          }
          return
        }

        const result = await register(values)
        if (result.success) {
          // If user registered as a seller, immediately submit seller verification data
          const wantsToSell = values.buyingPreference === 'selling' || values.buyingPreference === 'both'
          if (wantsToSell) {
            try {
              // Build multipart form data. Convert data URLs to blobs where necessary.
              const fd = new FormData()
              fd.append('fullName', values.fullName)
              fd.append('email', values.email)
              fd.append('phoneNumber', values.phoneNumber)
              if (values.idParsed) fd.append('idParsed', JSON.stringify(values.idParsed))

              const dataURLtoBlob = (dataUrl: string | undefined, filename = 'image.jpg') => {
                if (!dataUrl) return null
                // If it's already a File-ish string (unlikely), try to skip; otherwise convert data URL
                if (dataUrl.startsWith('data:')) {
                  const arr = dataUrl.split(',')
                  const mimeMatch = arr[0].match(/:(.*?);/)
                  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg'
                  const bstr = atob(arr[1])
                  let n = bstr.length
                  const u8arr = new Uint8Array(n)
                  while (n--) {
                    u8arr[n] = bstr.charCodeAt(n)
                  }
                  return new File([u8arr], filename, { type: mime })
                }
                return null
              }

              const frontFile = dataURLtoBlob(values.idFront, 'id-front.jpg')
              const backFile = dataURLtoBlob(values.idBack, 'id-back.jpg')
              if (frontFile) fd.append('idFront', frontFile)
              if (backFile) fd.append('idBack', backFile)

              // Fire-and-forget multipart verification; log if it fails
              verifySellerMultipart(fd).then(res => {
                if (!res.success) console.warn('Seller verification initiation failed', res)
              }).catch(err => console.error('Seller verification (multipart) error', err))
            } catch (err) {
              console.error('Failed to initiate seller verification (multipart):', err)
            }
          }

          setRegistrationSuccess(true)
          setTimeout(() => {
            onSuccess?.(values)
            handleClose()
          }, 2000)
        } else {
          console.error('Registration failed:', result.message || result.error)
          throw new Error(result.message || result.error || 'Registration failed')
        }
      } catch (error) {
        console.error('Registration failed:', error)
      } finally {
        setIsLoading(false)
      }
    }
  })

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1)
      formik.resetForm()
      setRegistrationSuccess(false)
      setIsLoading(false)
    }
  }, [isOpen])

  // Save form data to localStorage for recovery
  useEffect(() => {
    if (isOpen) {
      localStorage.setItem('shueapp_full_registration_draft', JSON.stringify(formik.values))
    }
  }, [formik.values, isOpen])

  // Load draft data on mount
  useEffect(() => {
    if (isOpen) {
      const draft = localStorage.getItem('shueapp_full_registration_draft')
      if (draft) {
        try {
          const draftData = JSON.parse(draft)
          formik.setValues(prev => ({ ...prev, ...draftData }))
        } catch (error) {
          console.warn('Failed to load registration draft:', error)
        }
      }
    }
  }, [isOpen])

  const handleFieldChange = useCallback((field: keyof RegistrationFormData, value: any) => {
    // Formik handles value + validation
    formik.setFieldValue(field as string, value)
  }, [formik])

  const handleFieldBlur = useCallback((field: keyof RegistrationFormData, value?: any) => {
    if (value !== undefined) {
      formik.setFieldValue(field as string, value)
    }
    formik.setFieldTouched(field as string, true)
    formik.validateField(field as string)
  }, [formik])

  const handleNext = useCallback(() => {
    const wantsToSell = formik.values.buyingPreference === 'selling' || formik.values.buyingPreference === 'both'
    const maxStep = wantsToSell ? 5 : 4
    if (currentStep < maxStep) {
      setCurrentStep(prev => (prev + 1) as RegistrationStep)
    } else {
      formik.submitForm()
    }
  }, [currentStep, formik])

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => (prev - 1) as RegistrationStep)
    }
  }, [currentStep])

  const handleSubmitRegistration = async () => {
    // keep compatibility for any external callers; simply delegate to formik
    await formik.submitForm()
  }

  const handleClose = useCallback(() => {
    if (!isLoading) {
      // Clear draft data when explicitly closing
      localStorage.removeItem('shueapp_full_registration_draft')
      onClose()
    }
  }, [isLoading, onClose])

  const getProgressPercentage = () => {
    const wantsToSell = formik.values.buyingPreference === 'selling' || formik.values.buyingPreference === 'both'
    const total = wantsToSell ? 5 : 4
    return (currentStep / total) * 100
  }

  // Derive a FormValidationState shape from Formik errors/touched for legacy steps
  const derivedValidationState = useMemo(() => {
    const vs = {} as FormValidationState
    ;(Object.keys(initialFormData) as Array<keyof RegistrationFormData>).forEach(k => {
      const error = (formik.errors as any)[k]
      const touched = (formik.touched as any)[k]
      vs[k] = {
        isValid: !error,
        error: error as string | undefined,
        isRequired: true,
        hasBeenTouched: !!touched
      }
    })
    return vs
  }, [formik.errors, formik.touched, formik.values])

  const renderCurrentStep = () => {
    const stepProps = {
      formData: formik.values,
      validationState: derivedValidationState,
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
        // If user wants to sell, step 4 is identity verification
        if (formik.values.buyingPreference === 'selling' || formik.values.buyingPreference === 'both') {
          return <IdentityVerificationStep {...stepProps} />
        }
        return <LegalStep {...stepProps} />
      case 5:
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
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
        <div className="text-center py-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to ShueApp!</h2>
          <p className="text-muted-foreground mb-6">
            Your account has been created successfully. You can now start exploring our sneaker marketplace!
          </p>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              A verification email has been sent to <strong>{formik.values.email}</strong>
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
    <div className="max-w-lg mx-auto max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
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
            {(() => {
              const wantsToSell = formik.values.buyingPreference === 'selling' || formik.values.buyingPreference === 'both'
              const labels = wantsToSell ? ['Account Info', 'Location', 'Preferences', 'Identity', 'Terms'] : ['Account Info', 'Location', 'Preferences', 'Terms']
              return labels.map((l, i) => <span key={i}>{l}</span>)
            })()}
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

export const RegistrationModal = asModal(RegistrationForm, {
  closeOnOutsideClick: true,
  closeOnEscape: true,
  containerClassName: 'fixed inset-0 z-50 flex items-center justify-center p-4',
  backdropClassName: 'fixed inset-0 z-40 bg-black/30',
  portalTarget: null // Explicitly use document.body
})

// Export a Storybook-friendly version for testing
export const RegistrationModalForStorybook = (props: RegistrationModalProps) => {
  if (!props.isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 z-40 bg-black/30" />
      <div className="relative z-50">
        <RegistrationForm {...props} />
      </div>
    </div>
  )
}

// Export additional components for testing and stories
export { AccountInfoStep, LocationInfoStep, PreferencesStep, IdentityVerificationStep, LegalStep }
export type { RegistrationModalProps }