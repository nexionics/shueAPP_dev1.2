'use client'

import React, { useState } from 'react'
import { Button } from '@/components/Button'
import { RegistrationStepProps } from './types'
import { Shield, FileText, Mail, ChevronLeft, AlertCircle, Check, ExternalLink, X } from 'lucide-react'

interface LegalStepProps extends RegistrationStepProps {}

export const LegalStep: React.FC<LegalStepProps> = ({
  formData,
  validationState,
  onFieldChange,
  onFieldBlur,
  onNext,
  onPrevious,
  isLoading = false
}) => {
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

  const handleToggleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = e.target.checked
    onFieldChange(field, checked)

    // Ensure blur is triggered after click
    setTimeout(() => {
      onFieldBlur(field, checked)
    }, 0)
  }

  const getFieldError = (field: keyof typeof formData) => {
    const validation = validationState[field]
    return validation?.hasBeenTouched && !validation?.isValid ? validation.error : undefined
  }

  const isFieldValid = (field: keyof typeof formData) => {
    const validation = validationState[field]
    return validation?.hasBeenTouched && validation?.isValid
  }

  const canProceed = validationState.agreeToTerms?.isValid

  const handleSubmit = () => {
    // This will be the final step that triggers registration
    onNext()
  }
  console.log({isLoading, canProceed})
  // TEMPORARY DEBUG LOGGING
  // eslint-disable-next-line no-console
  console.log('[LegalStep] Render', {
    agreeToTerms: formData.agreeToTerms,
    validationAgree: validationState.agreeToTerms
  })
  console.log('[LegalStep] Debugging Validation', {
    agreeToTerms: formData.agreeToTerms,
    validationAgree: validationState.agreeToTerms,
    canProceed,
  });

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Terms & Privacy</h2>
        <p className="text-muted-foreground mt-2">
          Please review and accept our terms to complete your registration
        </p>
      </div>

      {/* Legal Documents Section */}
      <div className="space-y-4">
        {/* Terms of Service */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-primary mt-1" />
            <div className="flex-1">
              <h3 className="font-medium text-foreground">Terms of Service</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Our terms outline your rights and responsibilities when using ShueApp's marketplace platform.
              </p>
              <Button
                type="button"
                variant="link"
                onClick={() => setShowTerms(true)}
                className="p-0 h-auto mt-2 text-primary"
                disabled={isLoading}
              >
                Read Terms of Service
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* Privacy Policy */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-primary mt-1" />
            <div className="flex-1">
              <h3 className="font-medium text-foreground">Privacy Policy</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Learn how we collect, use, and protect your personal information and marketplace data.
              </p>
              <Button
                type="button"
                variant="link"
                onClick={() => setShowPrivacy(true)}
                className="p-0 h-auto mt-2 text-primary"
                disabled={isLoading}
              >
                Read Privacy Policy
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Agreement Checkboxes */}
      <div className="space-y-4">
        {/* Required: Terms Agreement */}
        <div className="border border-border rounded-lg p-4">
          <label className="flex items-start space-x-3 cursor-pointer">
            <div className="relative mt-1">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={handleToggleChange('agreeToTerms')}
                disabled={isLoading}
                className={`rounded border-border text-primary focus:ring-primary ${
                  getFieldError('agreeToTerms') ? 'border-red-500' : ''
                }`}
                data-testid="agreeToTerms-checkbox"
              />
              {isFieldValid('agreeToTerms') && (
                <Check className="absolute -top-1 -right-1 h-4 w-4 text-green-500 pointer-events-none" />
              )}
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium text-foreground">
                I agree to the Terms of Service and Privacy Policy <span className="text-red-500">*</span>
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                Required to use ShueApp's marketplace and services
              </p>
            </div>
          </label>
          {getFieldError('agreeToTerms') && (
            <p className="text-red-500 text-xs mt-2 flex items-center ml-7">
              <AlertCircle className="h-3 w-3 mr-1" />
              {getFieldError('agreeToTerms')}
            </p>
          )}
        </div>

        {/* Optional: Marketing Communications */}
        <div className="border border-border rounded-lg p-4">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.marketingOptIn}
              onChange={handleToggleChange('marketingOptIn')}
              disabled={isLoading}
              className="mt-1 rounded border-border text-primary focus:ring-primary"
              data-testid="marketingOptIn-checkbox"
            />
            <div className="flex-1">
              <span className="text-sm font-medium text-foreground">
                I'd like to receive promotional emails and updates
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                Stay informed about new sneaker drops, marketplace features, and exclusive offers. You can unsubscribe at any time.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Key Points Summary */}
      <div className="bg-muted/50 p-4 rounded-lg border">
        <h3 className="font-medium text-foreground mb-3 flex items-center">
          <Shield className="h-4 w-4 mr-2" />
          Key Points
        </h3>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li className="flex items-start space-x-2">
            <span className="text-primary mt-1">•</span>
            <span>Your data is encrypted and securely stored</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-primary mt-1">•</span>
            <span>We never share your personal information with third parties for marketing</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-primary mt-1">•</span>
            <span>You can delete your account and data at any time</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-primary mt-1">•</span>
            <span>Marketing emails are optional and can be disabled in settings</span>
          </li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={isLoading}
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        
        <Button
          onClick={handleSubmit}
          disabled={!canProceed || isLoading}
          className="min-w-[140px] bg-green-600 hover:bg-green-700"
          data-testid="complete-registration"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Creating Account...
            </div>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Complete Registration
            </>
          )}
        </Button>
      </div>

      {/* Terms of Service Modal */}
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />

      {/* Privacy Policy Modal */}
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </div>
  )
}

// Terms Modal Component
const TermsModalContent: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Terms of Service</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="prose prose-sm max-w-none">
        <h3>1. Acceptance of Terms</h3>
        <p>By accessing and using ShueApp, you accept and agree to be bound by the terms and provision of this agreement.</p>
        
        <h3>2. Marketplace Rules</h3>
        <p>All users must follow our marketplace guidelines when buying or selling sneakers. This includes accurate descriptions, authentic products, and fair pricing.</p>
        
        <h3>3. User Responsibilities</h3>
        <p>You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.</p>
        
        <h3>4. Prohibited Activities</h3>
        <p>Users may not engage in fraudulent activities, sell counterfeit products, or violate intellectual property rights.</p>
        
        <h3>5. Limitation of Liability</h3>
        <p>ShueApp is not liable for disputes between buyers and sellers, though we provide dispute resolution support.</p>
        
        <p className="text-xs text-muted-foreground mt-4">
          Last updated: November 30, 2025
        </p>
      </div>
    </div>
  </div>
)

const TermsModal = TermsModalContent
// Privacy Modal Component  
const PrivacyModalContent: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Privacy Policy</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="prose prose-sm max-w-none">
        <h3>Information We Collect</h3>
        <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
        
        <h3>How We Use Your Information</h3>
        <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
        
        <h3>Information Sharing</h3>
        <p>We do not sell or rent your personal information to third parties. We may share your information in certain limited circumstances as outlined in this policy.</p>
        
        <h3>Data Security</h3>
        <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
        
        <h3>Your Rights</h3>
        <p>You have the right to access, update, or delete your personal information. You can also opt out of certain communications from us.</p>
        
        <p className="text-xs text-muted-foreground mt-4">
          Last updated: November 30, 2025
        </p>
      </div>
    </div>
  </div>
)

const PrivacyModal = PrivacyModalContent