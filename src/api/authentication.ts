/**
 * Authentication API - Main Export
 * 
 * This is the main entry point for the authentication API.
 * It provides a comprehensive interface to all authentication functionality.
 */

export { checkServerHealth } from './authentication/utils';

// Core API classes and functions
export { AuthAPI, TokenManager } from './authentication/index';
export { VerificationAPI } from './authentication/verification';

// Individual API functions for convenience
export {
  login,
  register,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
  getProfile,
  getVerificationStatus,
  // Token management
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  storeAuthData,
  clearAuthData,
  isLoggedIn,
  refreshAccessToken,
  validateToken
} from './authentication/index';

// Verification functions
export {
  verifyEmail,
  verifyPhone,
  initiatePhoneVerification,
  resendEmailVerification,
  resendPhoneVerification,
  resendVerification,
  verifySeller,
  getSellerVerificationStatus
} from './authentication/verification';

// Backward compatibility exports
export { loginUser } from './authentication/login';
export { registerUser, getUserProfile } from './authentication/register';
export { 
  logoutUser,
  getAuthState,
  setupAutoRefresh,
  isAuthenticated,
  requireAuth,
  getUser,
  hasRole,
  hasAnyRole
} from './authentication/logout';

// Middleware exports
export { AuthMiddleware, AuthGuard, createAuthenticatedAPI } from './authentication/middleware';

// Types (with fallbacks)
export type {
  // Core types
  JWTUserPayload,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UserVerificationStatus,
  
  // Frontend-specific types
  ApiResponse,
  TokenRefreshResponse,
  ValidationResponse,
  ProfileResponse,
  VerificationStatusResponse,
  RequestConfig,
  AuthState,
  SellerVerificationResponse,
  SellerVerificationStatusResponse,
  
  // Error types
  AuthError,
  NetworkError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  
  // Configuration types
  AuthConfig,
  OAuthProvider,
  OAuthConfig,
  
  // Form types
  LoginFormData,
  RegisterFormData,
  PasswordChangeFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  
  // Storage types
  StoredUserData
} from './authentication/types';

// Constants
export const AUTH_ENDPOINTS = {
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
  VERIFY_PHONE: '/auth/verify/phone',
  PROFILE: '/auth/profile',
  VERIFICATION_STATUS: '/auth/user/verification-status',
  SELLER_VERIFY: '/auth/seller/verify',
  HEALTH: '/auth/health'
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user'
} as const;

// Default configuration
export const DEFAULT_AUTH_CONFIG = {
  apiBaseUrl: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '') + '/api',
  tokenStorageKey: 'accessToken',
  refreshTokenStorageKey: 'refreshToken',
  userStorageKey: 'user',
  autoRefresh: true,
  refreshThreshold: 300 // 5 minutes
} as const;