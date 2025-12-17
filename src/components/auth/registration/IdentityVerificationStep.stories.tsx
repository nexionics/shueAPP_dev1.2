import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import { IdentityVerificationStep } from './IdentityVerificationStep'
import { RegistrationFormData, FormValidationState } from './types'

const meta = {
  title: 'Authentication/Registration/IdentityVerificationStep',
  component: IdentityVerificationStep,
  decorators: [(Story) => (
    <ThemeProvider>
      <AuthProvider>
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
          <Story />
        </div>
      </AuthProvider>
    </ThemeProvider>
  )]
} satisfies Meta<typeof IdentityVerificationStep>

export default meta
type Story = StoryObj<typeof meta>

const baseForm: RegistrationFormData = {
  fullName: 'Test Seller',
  username: 'testseller',
  email: 'seller@example.com',
  phoneNumber: '(555) 555-5555',
  password: 'Password123!',
  confirmPassword: 'Password123!',
  city: 'Test City',
  state: 'TS',
  country: 'Testland',
  zipCode: '12345',
  allowLocationPermission: false,
  agreeToTerms: false,
  marketingOptIn: false,
  shoeSize: '10',
  favoriteBrands: ['Nike'],
  buyingPreference: 'selling',
  idFront: undefined,
  idBack: undefined,
  idParsed: undefined
}

const emptyValidation: FormValidationState = (Object.keys(baseForm) as Array<keyof RegistrationFormData>).reduce((acc, k) => {
  acc[k] = { isValid: true, isRequired: false, hasBeenTouched: false }
  return acc
}, {} as any)

export const Default: Story = {
  render: () => (
    <IdentityVerificationStep
      formData={baseForm}
      validationState={emptyValidation}
      onFieldChange={() => {}}
      onFieldBlur={() => {}}
      onNext={() => console.log('Next')}
      onPrevious={() => console.log('Previous')}
    />
  )
}

const sampleSVG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='380'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='24' fill='%23666'>Sample ID</text></svg>"

export const WithUploads: Story = {
  render: () => (
    <IdentityVerificationStep
      formData={{ ...baseForm, idFront: sampleSVG, idBack: sampleSVG }}
      validationState={emptyValidation}
      onFieldChange={(f, v) => console.log('field change', f, v)}
      onFieldBlur={() => {}}
      onNext={() => console.log('Next')}
      onPrevious={() => console.log('Previous')}
    />
  )
}

export const WithParsedData: Story = {
  render: () => (
    <IdentityVerificationStep
      formData={{ ...baseForm, idFront: sampleSVG, idParsed: { fullName: 'John Doe', dob: '1990-01-01', licenseNumber: 'ABC123' } }}
      validationState={emptyValidation}
      onFieldChange={(f, v) => console.log('field change', f, v)}
      onFieldBlur={() => {}}
      onNext={() => console.log('Next')}
      onPrevious={() => console.log('Previous')}
    />
  )
}
