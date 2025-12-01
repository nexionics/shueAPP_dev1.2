/**
 * Registration API Functions
 * 
 * This module provides registration-specific API functions.
 * It re-exports functions from the centralized authentication API and verification API.
 */

import { AuthAPI } from './index';
import { VerificationAPI } from './verification';
import type { RegisterRequest, RegisterResponse } from './types';

// Re-export main registration function
export const registerUser = AuthAPI.register;

// Re-export verification functions for backward compatibility
export const verifyEmail = VerificationAPI.verifyEmail;
export const verifyPhone = VerificationAPI.verifyPhone;
export const resendVerification = VerificationAPI.resendVerification;

// Re-export profile function
export const getUserProfile = AuthAPI.getProfile;

// Export additional functions from verification API
export const {
  initiatePhoneVerification,
  resendEmailVerification,
  resendPhoneVerification,
  getVerificationStatus,
  verifySeller,
  getSellerVerificationStatus
} = VerificationAPI;

// Export types
export type { RegisterRequest, RegisterResponse };