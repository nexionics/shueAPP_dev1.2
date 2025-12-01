'use client'

import React, { useState } from 'react'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { RegistrationStepProps } from './types'
import { validateField, getPasswordStrength, formatPhoneNumber } from './validation'
import { Eye, EyeOff, User, Mail, Phone, Lock, Check, AlertCircle } from 'lucide-react'

interface AccountInfoStepProps extends RegistrationStepProps {}

export const AccountInfoStep: React.FC<AccountInfoStepProps> = ({
  formData,
  validationState,
  onFieldChange,
  onFieldBlur,
  onNext,
  isLoading = false
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleFieldChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = e.target.value
    
    // Format phone number on change
    if (field === 'phoneNumber') {
      value = formatPhoneNumber(value)
    }
    
    onFieldChange(field, value)
  }

  const handleFieldBlur = (field: keyof typeof formData) => () => {
    onFieldBlur(field)
  }

  const getFieldError = (field: keyof typeof formData) => {
    const validation = validationState[field]
    return validation?.hasBeenTouched && !validation?.isValid ? validation.error : undefined
  }

  const isFieldValid = (field: keyof typeof formData) => {
    const validation = validationState[field]
    return validation?.hasBeenTouched && validation?.isValid
  }

  const passwordStrength = getPasswordStrength(formData.password)
  
  const canProceed = [
    'fullName', 'username', 'email', 'phoneNumber', 'password', 'confirmPassword'
  ].every(field => validationState[field as keyof typeof formData]?.isValid)

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Create Your Account</h2>
        <p className="text-muted-foreground mt-2">
          Enter your personal information to get started
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="fullName"
              data-testid="fullName-input"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleFieldChange('fullName')}
              onBlur={handleFieldBlur('fullName')}
              className={`pl-10 pr-10 ${
                getFieldError('fullName') 
                  ? 'border-red-500 focus:border-red-500' 
                  : isFieldValid('fullName') 
                  ? 'border-green-500 focus:border-green-500' 
                  : ''
              }`}
              aria-describedby={getFieldError('fullName') ? 'fullName-error' : undefined}
              disabled={isLoading}
              autoComplete="name"
              maxLength={100}
            />
            {isFieldValid('fullName') && (
              <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
            )}
          </div>
          {getFieldError('fullName') && (
            <p id="fullName-error" className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {getFieldError('fullName')}
            </p>
          )}
        </div>

        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
            Username <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="username"
              data-testid="username-input"
              type="text"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleFieldChange('username')}
              onBlur={handleFieldBlur('username')}
              className={`pl-10 pr-10 ${
                getFieldError('username') 
                  ? 'border-red-500 focus:border-red-500' 
                  : isFieldValid('username') 
                  ? 'border-green-500 focus:border-green-500' 
                  : ''
              }`}
              aria-describedby={getFieldError('username') ? 'username-error' : undefined}
              disabled={isLoading}
              autoComplete="username"
              maxLength={30}
            />
            {isFieldValid('username') && (
              <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
            )}
          </div>
          {getFieldError('username') && (
            <p id="username-error" className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {getFieldError('username')}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Letters, numbers, and underscores only
          </p>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="email"
              data-testid="email-input"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleFieldChange('email')}
              onBlur={handleFieldBlur('email')}
              className={`pl-10 pr-10 ${
                getFieldError('email') 
                  ? 'border-red-500 focus:border-red-500' 
                  : isFieldValid('email') 
                  ? 'border-green-500 focus:border-green-500' 
                  : ''
              }`}
              aria-describedby={getFieldError('email') ? 'email-error' : undefined}
              disabled={isLoading}
              autoComplete="email"
            />
            {isFieldValid('email') && (
              <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
            )}
          </div>
          {getFieldError('email') && (
            <p id="email-error" className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {getFieldError('email')}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-foreground mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="phoneNumber"
              data-testid="phoneNumber-input"
              type="tel"
              placeholder="(555) 123-4567"
              value={formData.phoneNumber}
              onChange={handleFieldChange('phoneNumber')}
              onBlur={handleFieldBlur('phoneNumber')}
              className={`pl-10 pr-10 ${
                getFieldError('phoneNumber') 
                  ? 'border-red-500 focus:border-red-500' 
                  : isFieldValid('phoneNumber') 
                  ? 'border-green-500 focus:border-green-500' 
                  : ''
              }`}
              aria-describedby={getFieldError('phoneNumber') ? 'phoneNumber-error' : undefined}
              disabled={isLoading}
              autoComplete="tel"
            />
            {isFieldValid('phoneNumber') && (
              <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
            )}
          </div>
          {getFieldError('phoneNumber') && (
            <p id="phoneNumber-error" className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {getFieldError('phoneNumber')}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="password"
              data-testid="password-input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleFieldChange('password')}
              onBlur={handleFieldBlur('password')}
              className={`pl-10 pr-10 ${
                getFieldError('password') 
                  ? 'border-red-500 focus:border-red-500' 
                  : isFieldValid('password') 
                  ? 'border-green-500 focus:border-green-500' 
                  : ''
              }`}
              aria-describedby="password-error password-strength"
              disabled={isLoading}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground">Password strength:</span>
                <span className={`text-xs font-medium ${passwordStrength.color}`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    passwordStrength.score < 3 
                      ? 'bg-red-500' 
                      : passwordStrength.score < 5 
                      ? 'bg-yellow-500' 
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                />
              </div>
            </div>
          )}
          
          {getFieldError('password') && (
            <p id="password-error" className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {getFieldError('password')}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="confirmPassword"
              data-testid="confirmPassword-input"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleFieldChange('confirmPassword')}
              onBlur={handleFieldBlur('confirmPassword')}
              className={`pl-10 pr-10 ${
                getFieldError('confirmPassword') 
                  ? 'border-red-500 focus:border-red-500' 
                  : isFieldValid('confirmPassword') 
                  ? 'border-green-500 focus:border-green-500' 
                  : ''
              }`}
              aria-describedby={getFieldError('confirmPassword') ? 'confirmPassword-error' : undefined}
              disabled={isLoading}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {getFieldError('confirmPassword') && (
            <p id="confirmPassword-error" className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {getFieldError('confirmPassword')}
            </p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={onNext}
          disabled={!canProceed || isLoading}
          className="min-w-[120px]"
          data-testid="account-info-next"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Processing...
            </div>
          ) : (
            'Continue'
          )}
        </Button>
      </div>
    </div>
  )
}