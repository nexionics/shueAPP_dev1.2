/**
 * Authentication API Client
 * 
 * This module provides a comprehensive interface to the backend authentication service.
 * It includes all auth endpoints, token management, and utility functions.
 */

// Import types from local types file
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  ChangePasswordRequest,
  JWTUserPayload,
  UserVerificationStatus,
  ApiResponse,
  TokenRefreshResponse,
  ValidationResponse,
  ProfileResponse,
  VerificationStatusResponse
} from './types';

// API Configuration
const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const API_BASE = `${API_ORIGIN.replace(/\/$/, '')}/api`
const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  VALIDATE: '/auth/validate',
  VERIFY: '/auth/verify',
  CHANGE_PASSWORD: '/auth/change-password',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify/email',
  VERIFY_EMAIL_LEGACY: '/auth/verify-email',
  VERIFY_PHONE: '/auth/verify/phone',
  VERIFY_PHONE_LEGACY: '/auth/verify-phone',
  VERIFY_PHONE_INITIATE: '/auth/verify/phone/initiate',
  RESEND_EMAIL: '/auth/verify/email/resend',
  RESEND_PHONE: '/auth/verify/phone/resend',
  RESEND_LEGACY: '/auth/resend-verification',
  PROFILE: '/auth/profile',
  VERIFICATION_STATUS: '/auth/user/verification-status',
  SELLER_VERIFY: '/auth/seller/verify',
  SELLER_STATUS: '/auth/seller/verification-status',
  UPDATE_PREFERENCES: '/auth/user/update-verification-preferences',
  HEALTH: '/auth/health'
} as const;

// Local Storage Keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user'
} as const;

// Re-export types from types.ts
export type {
  ApiResponse,
  TokenRefreshResponse,
  ValidationResponse,
  ProfileResponse,
  VerificationStatusResponse
} from './types';

// Utility Functions
class AuthUtils {
  /**
   * Check if we're in a browser environment
   */
  static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  /**
   * Make authenticated API request with automatic token refresh
   */
  static async makeAuthenticatedRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!API_BASE) {
      throw new Error('NEXT_PUBLIC_API_URL environment variable is not configured');
    }
    
    const token = TokenManager.getAccessToken();
    
    if (!token) {
      throw new Error('No access token available');
    }

    const response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    // If token expired, try to refresh and retry
    if (response.status === 401) {
      const refreshResult = await TokenManager.refreshAccessToken();
      if (refreshResult.success) {
        // Retry with new token
        const newToken = TokenManager.getAccessToken();
        if (!API_BASE) {
          throw new Error('NEXT_PUBLIC_API_URL environment variable is not configured');
        }
        return await fetch(`${API_BASE}${url}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${newToken}`,
            ...options.headers,
          },
        }).then(res => res.json());
      } else {
        throw new Error('Authentication failed');
      }
    }

    return await response.json();
  }

  /**
   * Make regular API request
   */
  static async makeRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!API_BASE) {
      throw new Error('NEXT_PUBLIC_API_URL environment variable is not configured');
    }
    
    const response = await fetch(`${API_BASE}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    return await response.json();
  }
}

// Token Management
export class TokenManager {
  /**
   * Get stored access token
   */
  static getAccessToken(): string | null {
    if (!AuthUtils.isBrowser()) return null;
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Get stored refresh token
   */
  static getRefreshToken(): string | null {
    if (!AuthUtils.isBrowser()) return null;
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Get stored user data
   */
  static getStoredUser(): JWTUserPayload | null {
    if (!AuthUtils.isBrowser()) return null;
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Store authentication data
   */
  static storeAuthData(token: string, refreshToken: string, user: JWTUserPayload): void {
    if (!AuthUtils.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  /**
   * Clear all authentication data
   */
  static clearAuthData(): void {
    if (!AuthUtils.isBrowser()) return;
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  /**
   * Check if user is logged in
   */
  static isLoggedIn(): boolean {
    if (!AuthUtils.isBrowser()) return false;
    const token = this.getAccessToken();
    const user = this.getStoredUser();
    return !!(token && user);
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshAccessToken(): Promise<TokenRefreshResponse> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        return { success: false, message: 'No refresh token available' };
      }

      const result = await AuthUtils.makeRequest<TokenRefreshResponse>(
        AUTH_ENDPOINTS.REFRESH,
        {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        }
      );

      if (result.success && result.token) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, result.token);
        return { success: true, token: result.token, expiresAt: result.expiresAt };
      }

      return { success: false, message: result.message || 'Token refresh failed' };
    } catch (error) {
      console.error('Token refresh error:', error);
      return { success: false, message: 'Network error during token refresh' };
    }
  }

  /**
   * Validate current access token
   */
  static async validateToken(): Promise<ValidationResponse> {
    try {
      const token = this.getAccessToken();
      if (!token) {
        return { success: false, valid: false, message: 'No access token found' };
      }

      const result = await AuthUtils.makeAuthenticatedRequest<ValidationResponse>(
        AUTH_ENDPOINTS.VALIDATE
      );

      if (result.success) {
        return { success: true, valid: true, user: result.user, verificationStatus: result.verificationStatus };
      }

      return { success: false, valid: false, message: result.message || 'Token validation failed' };
    } catch (error) {
      console.error('Token validation error:', error);
      return { success: false, valid: false, message: 'Token validation failed' };
    }
  }
}

// Authentication API
export class AuthAPI {
  /**
   * Login user with email and password
   */
  static async login(loginData: LoginRequest): Promise<LoginResponse> {
    try {
      const result = await AuthUtils.makeRequest<LoginResponse>(
        AUTH_ENDPOINTS.LOGIN,
        {
          method: 'POST',
          body: JSON.stringify(loginData),
        }
      );

      if (result.success && result.token && result.refreshToken && result.user) {
        TokenManager.storeAuthData(result.token, result.refreshToken, result.user);
      }

      return result;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error occurred during login'
      };
    }
  }

  /**
   * Register a new user
   */
  static async register(registrationData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const result = await AuthUtils.makeRequest<RegisterResponse>(
        AUTH_ENDPOINTS.REGISTER,
        {
          method: 'POST',
          body: JSON.stringify(registrationData),
        }
      );

      if (result.success && result.token && result.refreshToken && result.user) {
        TokenManager.storeAuthData(result.token, result.refreshToken, result.user);
      }

      return result;
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Network error occurred during registration',
        canSell: false
      };
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const refreshToken = TokenManager.getRefreshToken();
      
      // Clear local storage first
      TokenManager.clearAuthData();

      // Call logout endpoint to invalidate refresh token on server
      if (refreshToken) {
        const result = await AuthUtils.makeRequest<{ success: boolean; message: string }>(
          AUTH_ENDPOINTS.LOGOUT,
          {
            method: 'POST',
            body: JSON.stringify({ refreshToken }),
          }
        );
        return result;
      }

      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      console.error('Logout error:', error);
      // Even if server call fails, we cleared local storage
      return { success: true, message: 'Logged out locally' };
    }
  }

  /**
   * Change user password
   */
  static async changePassword(passwordData: ChangePasswordRequest): Promise<{ success: boolean; message: string }> {
    try {
      const result = await AuthUtils.makeAuthenticatedRequest<{ success: boolean; message: string }>(
        AUTH_ENDPOINTS.CHANGE_PASSWORD,
        {
          method: 'POST',
          body: JSON.stringify(passwordData),
        }
      );

      return result;
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: 'Network error occurred while changing password'
      };
    }
  }

  /**
   * Request password reset
   */
  static async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const result = await AuthUtils.makeRequest<{ success: boolean; message: string }>(
        AUTH_ENDPOINTS.FORGOT_PASSWORD,
        {
          method: 'POST',
          body: JSON.stringify({ email }),
        }
      );

      return result;
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        message: 'Network error occurred during password reset request'
      };
    }
  }

  /**
   * Reset password using token
   */
  static async resetPassword(resetData: ResetPasswordRequest): Promise<{ success: boolean; message: string }> {
    try {
      const result = await AuthUtils.makeRequest<{ success: boolean; message: string }>(
        AUTH_ENDPOINTS.RESET_PASSWORD,
        {
          method: 'POST',
          body: JSON.stringify(resetData),
        }
      );

      return result;
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: 'Network error occurred during password reset'
      };
    }
  }

  /**
   * Get user profile
   */
  static async getProfile(): Promise<ProfileResponse> {
    try {
      const result = await AuthUtils.makeAuthenticatedRequest<ProfileResponse>(
        AUTH_ENDPOINTS.PROFILE
      );

      return result;
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        message: 'Network error occurred while fetching profile'
      };
    }
  }

  /**
   * Get user verification status
   */
  static async getVerificationStatus(): Promise<VerificationStatusResponse> {
    try {
      const result = await AuthUtils.makeAuthenticatedRequest<VerificationStatusResponse>(
        AUTH_ENDPOINTS.VERIFICATION_STATUS
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
}

// Export individual functions for backward compatibility
export const {
  login,
  register,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
  getProfile,
  getVerificationStatus
} = AuthAPI;

export const {
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  storeAuthData,
  clearAuthData,
  isLoggedIn,
  refreshAccessToken,
  validateToken
} = TokenManager;

// Export utilities
export { checkServerHealth, checkAuthHealth, getApiConfig } from './utils';