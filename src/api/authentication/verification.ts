/**
 * Verification API Client
 * 
 * This module handles all verification-related operations including email, phone, and seller verification.
 */

import type {
  PhoneVerificationRequest,
  UserVerificationStatus
} from './types';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const VERIFICATION_ENDPOINTS = {
  VERIFY_EMAIL: '/auth/verify/email',
  VERIFY_EMAIL_LEGACY: '/auth/verify-email',
  VERIFY_PHONE: '/auth/verify/phone',
  VERIFY_PHONE_LEGACY: '/auth/verify-phone',
  VERIFY_PHONE_INITIATE: '/auth/verify/phone/initiate',
  RESEND_EMAIL: '/auth/verify/email/resend',
  RESEND_PHONE: '/auth/verify/phone/resend',
  RESEND_LEGACY: '/auth/resend-verification',
  SELLER_VERIFY: '/auth/seller/verify',
  SELLER_STATUS: '/auth/seller/verification-status',
  VERIFICATION_STATUS: '/auth/user/verification-status'
} as const;

// Utility Functions
class VerificationUtils {
  /**
   * Check if we're in a browser environment
   */
  static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  /**
   * Get access token from storage
   */
  static getAccessToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('accessToken');
  }

  /**
   * Make authenticated API request
   */
  static async makeAuthenticatedRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAccessToken();
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });

    return await response.json();
  }

  /**
   * Make regular API request
   */
  static async makeRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    return await response.json();
  }
}

// Verification API
export class VerificationAPI {
  /**
   * Verify email using verification token
   */
  static async verifyEmail(token: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      // Try new endpoint first, fallback to legacy
      let result = await VerificationUtils.makeRequest<{ success: boolean; message?: string; error?: string }>(
        VERIFICATION_ENDPOINTS.VERIFY_EMAIL,
        {
          method: 'POST',
          body: JSON.stringify({ token }),
        }
      );

      // If new endpoint fails, try legacy endpoint
      if (!result.success) {
        result = await VerificationUtils.makeRequest<{ success: boolean; message?: string; error?: string }>(
          VERIFICATION_ENDPOINTS.VERIFY_EMAIL_LEGACY,
          {
            method: 'POST',
            body: JSON.stringify({ token }),
          }
        );
      }

      return result;
    } catch (error) {
      console.error('Email verification error:', error);
      return {
        success: false,
        error: 'Network error occurred during email verification'
      };
    }
  }

  /**
   * Verify phone using verification code
   */
  static async verifyPhone(userId: string, verificationCode: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const phoneVerificationData: PhoneVerificationRequest = {
        userId,
        verificationCode
      };

      // Try new endpoint first, fallback to legacy
      let result = await VerificationUtils.makeRequest<{ success: boolean; message?: string; error?: string }>(
        VERIFICATION_ENDPOINTS.VERIFY_PHONE,
        {
          method: 'POST',
          body: JSON.stringify(phoneVerificationData),
        }
      );

      // If new endpoint fails, try legacy endpoint
      if (!result.success) {
        result = await VerificationUtils.makeRequest<{ success: boolean; message?: string; error?: string }>(
          VERIFICATION_ENDPOINTS.VERIFY_PHONE_LEGACY,
          {
            method: 'POST',
            body: JSON.stringify(phoneVerificationData),
          }
        );
      }

      return result;
    } catch (error) {
      console.error('Phone verification error:', error);
      return {
        success: false,
        error: 'Network error occurred during phone verification'
      };
    }
  }

  /**
   * Initiate phone verification (send SMS code)
   */
  static async initiatePhoneVerification(phoneNumber: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const result = await VerificationUtils.makeAuthenticatedRequest<{ success: boolean; message?: string; error?: string }>(
        VERIFICATION_ENDPOINTS.VERIFY_PHONE_INITIATE,
        {
          method: 'POST',
          body: JSON.stringify({ phoneNumber }),
        }
      );

      return result;
    } catch (error) {
      console.error('Phone verification initiate error:', error);
      return {
        success: false,
        error: 'Network error occurred while initiating phone verification'
      };
    }
  }

  /**
   * Resend email verification
   */
  static async resendEmailVerification(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      // Try new endpoint first
      let result = await VerificationUtils.makeRequest<{ success: boolean; message?: string; error?: string }>(
        VERIFICATION_ENDPOINTS.RESEND_EMAIL,
        {
          method: 'POST',
          body: JSON.stringify({ email, type: 'email' }),
        }
      );

      // If new endpoint fails, try legacy endpoint
      if (!result.success) {
        result = await VerificationUtils.makeRequest<{ success: boolean; message?: string; error?: string }>(
          VERIFICATION_ENDPOINTS.RESEND_LEGACY,
          {
            method: 'POST',
            body: JSON.stringify({ email, type: 'email' }),
          }
        );
      }

      return result;
    } catch (error) {
      console.error('Resend email verification error:', error);
      return {
        success: false,
        error: 'Network error occurred while resending email verification'
      };
    }
  }

  /**
   * Resend phone verification
   */
  static async resendPhoneVerification(phoneNumber: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      // Try new endpoint first
      let result = await VerificationUtils.makeRequest<{ success: boolean; message?: string; error?: string }>(
        VERIFICATION_ENDPOINTS.RESEND_PHONE,
        {
          method: 'POST',
          body: JSON.stringify({ phoneNumber, type: 'phone' }),
        }
      );

      // If new endpoint fails, try legacy endpoint
      if (!result.success) {
        result = await VerificationUtils.makeRequest<{ success: boolean; message?: string; error?: string }>(
          VERIFICATION_ENDPOINTS.RESEND_LEGACY,
          {
            method: 'POST',
            body: JSON.stringify({ phoneNumber, type: 'phone' }),
          }
        );
      }

      return result;
    } catch (error) {
      console.error('Resend phone verification error:', error);
      return {
        success: false,
        error: 'Network error occurred while resending phone verification'
      };
    }
  }

  /**
   * Resend verification (generic)
   */
  static async resendVerification(
    type: 'email' | 'phone',
    emailOrPhone: string
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    if (type === 'email') {
      return this.resendEmailVerification(emailOrPhone);
    } else {
      return this.resendPhoneVerification(emailOrPhone);
    }
  }

  /**
   * Get user verification status
   */
  static async getVerificationStatus(): Promise<{ success: boolean; verificationStatus?: UserVerificationStatus; message?: string }> {
    try {
      const result = await VerificationUtils.makeAuthenticatedRequest<{ success: boolean; verificationStatus?: UserVerificationStatus; message?: string }>(
        VERIFICATION_ENDPOINTS.VERIFICATION_STATUS
      );

      return result;
    } catch (error) {
      console.error('Get verification status error:', error);
      return {
        success: false,
        message: 'Network error occurred while fetching verification status'
      };
    }
  }

  /**
   * Verify seller (start seller verification process)
   */
  static async verifySeller(sellerData: Record<string, unknown>): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const result = await VerificationUtils.makeAuthenticatedRequest<{ success: boolean; message?: string; error?: string }>(
        VERIFICATION_ENDPOINTS.SELLER_VERIFY,
        {
          method: 'POST',
          body: JSON.stringify(sellerData),
        }
      );

      return result;
    } catch (error) {
      console.error('Seller verification error:', error);
      return {
        success: false,
        error: 'Network error occurred during seller verification'
      };
    }
  }

  /**
   * Get seller verification status
   */
  static async getSellerVerificationStatus(userId: string): Promise<{ success: boolean; status?: Record<string, unknown>; message?: string; error?: string }> {
    try {
      const result = await VerificationUtils.makeAuthenticatedRequest<{ success: boolean; status?: Record<string, unknown>; message?: string; error?: string }>(
        `${VERIFICATION_ENDPOINTS.SELLER_STATUS}/${userId}`
      );

      return result;
    } catch (error) {
      console.error('Get seller verification status error:', error);
      return {
        success: false,
        error: 'Network error occurred while fetching seller verification status'
      };
    }
  }
}

// Export individual functions for backward compatibility
export const {
  verifyEmail,
  verifyPhone,
  initiatePhoneVerification,
  resendEmailVerification,
  resendPhoneVerification,
  resendVerification,
  getVerificationStatus,
  verifySeller,
  getSellerVerificationStatus
} = VerificationAPI;