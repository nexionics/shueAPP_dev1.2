'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Mail, Clock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'

interface EmailVerificationStepProps {
  email: string
  onVerify: (code: string) => void
  onResendCode: () => void
  onBack: () => void
  isLoading?: boolean
  isVerified?: boolean
  error?: string
  timeRemaining?: number
}

export const EmailVerificationStep: React.FC<EmailVerificationStepProps> = ({
  email,
  onVerify,
  onResendCode,
  onBack,
  isLoading = false,
  isVerified = false,
  error = '',
  timeRemaining = 0
}) => {
  const [verificationCode, setVerificationCode] = useState('')
  const [timer, setTimer] = useState(timeRemaining)

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (verificationCode.length === 6) {
      onVerify(verificationCode)
    }
  }

  const handleResend = () => {
    setTimer(60) // Reset timer to 60 seconds
    onResendCode()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isVerified) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Email Verified!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Your email address has been successfully verified.
          </p>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
            <span className="text-green-800 dark:text-green-200 text-sm">
              {email} is now verified and ready to use.
            </span>
          </div>
        </div>

        {/* Continue Button */}
        <Button 
          onClick={() => onVerify(verificationCode)}
          className="w-full"
          disabled={isLoading}
        >
          Continue
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Verify Your Email
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          We've sent a 6-digit verification code to
        </p>
        <p className="font-medium text-gray-900 dark:text-white text-sm">
          {email}
        </p>
      </div>

      {/* Verification Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Enter 6-digit code"
            value={verificationCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6)
              setVerificationCode(value)
            }}
            maxLength={6}
            className={`text-center text-lg tracking-widest ${
              error ? 'border-red-300 dark:border-red-700' : ''
            }`}
            disabled={isLoading}
          />
          
          {error && (
            <div className="mt-2 flex items-center text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {error}
            </div>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={verificationCode.length !== 6 || isLoading}
        >
          {isLoading ? (
            <div className="flex items-center">
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Verifying...
            </div>
          ) : (
            'Verify Email'
          )}
        </Button>
      </form>

      {/* Resend Code */}
      <div className="text-center space-y-3">
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Didn't receive the code?
        </p>
        
        {timer > 0 ? (
          <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            Resend available in {formatTime(timer)}
          </div>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isLoading}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Resend Code
          </button>
        )}
      </div>

      {/* Back Button */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
          className="w-full"
        >
          Back to Registration
        </Button>
      </div>
    </div>
  )
}