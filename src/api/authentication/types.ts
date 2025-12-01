/**
 * Authentication Types
 * 
 * This module provides all authentication-related TypeScript types.
 * It re-exports types from shared-types and defines frontend-specific types.
 */

// Frontend authentication types
// Note: These types are defined locally since shared-types package may not be available

// Frontend-specific types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface TokenRefreshResponse {
  success: boolean;
  token?: string;
  expiresAt?: string;
  message?: string;
}

export interface ValidationResponse {
  success: boolean;
  valid?: boolean;
  user?: JWTUserPayload;
  verificationStatus?: UserVerificationStatus;
  message?: string;
}

export interface ProfileResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    username: string;
    fullName: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
    exactAddress?: string;
    shoeSize?: string;
    favoriteBrands?: string[];
    buyingPreference?: string;
    oauthProvider?: string;
    createdAt: string;
    updatedAt: string;
  };
  verificationStatus?: UserVerificationStatus;
  canSell?: boolean;
  message?: string;
}

export interface VerificationStatusResponse {
  success: boolean;
  verificationStatus?: UserVerificationStatus;
  message?: string;
}

export interface RequestConfig extends RequestInit {
  url: string;
  skipAuth?: boolean;
  retryOnAuthFailure?: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: JWTUserPayload | null;
  token: string | null;
}

export interface SellerVerificationResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface SellerVerificationStatusResponse {
  success: boolean;
  status?: {
    verified: boolean;
    pending: boolean;
    rejected: boolean;
    reason?: string;
  };
  message?: string;
  error?: string;
}

// Authentication error types
export interface AuthError {
  code: string;
  message: string;
  details?: unknown;
}

export interface NetworkError extends AuthError {
  code: 'NETWORK_ERROR';
  message: string;
  originalError?: Error;
}

export interface ValidationError extends AuthError {
  code: 'VALIDATION_ERROR';
  message: string;
  field?: string;
}

export interface AuthenticationError extends AuthError {
  code: 'AUTHENTICATION_ERROR';
  message: string;
}

export interface AuthorizationError extends AuthError {
  code: 'AUTHORIZATION_ERROR';
  message: string;
  requiredRole?: string;
}

// Auth provider configuration
export interface AuthConfig {
  apiBaseUrl: string;
  tokenStorageKey: string;
  refreshTokenStorageKey: string;
  userStorageKey: string;
  autoRefresh: boolean;
  refreshThreshold: number; // seconds before expiry to trigger refresh
}

// OAuth provider types
export type OAuthProvider = 'google' | 'apple' | 'facebook';

export interface OAuthConfig {
  provider: OAuthProvider;
  clientId: string;
  redirectUri: string;
  scope?: string[];
}

// Verification types
export interface VerificationCode {
  code: string;
  expiresAt: Date;
  attempts: number;
  maxAttempts: number;
}

export interface VerificationState {
  email: {
    verified: boolean;
    pending: boolean;
    token?: string;
  };
  phone: {
    verified: boolean;
    pending: boolean;
    code?: VerificationCode;
  };
  seller: {
    verified: boolean;
    pending: boolean;
    documents?: string[];
  };
}

// Form validation types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  exactAddress?: string;
  agreeToTerms: boolean;
  marketingOptIn: boolean;
  shoeSize?: string;
  favoriteBrands?: string[];
  buyingPreference?: 'buying' | 'selling' | 'both';
  allowLocationPermission: boolean;
}

export interface PasswordChangeFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Local storage types
export interface StoredUserData {
  userId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// Fallback types if shared-types is not available
export interface JWTUserPayload {
  userId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface UserVerificationStatus {
  email: boolean;
  phone: boolean;
  identity?: boolean;
  stripeConnect?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: JWTUserPayload;
  token?: string;
  refreshToken?: string;
  expiresAt?: string;
}

export interface RegisterRequest {
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password?: string;
  oauthProvider?: OAuthProvider;
  oauthId?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  exactAddress?: string;
  allowLocationPermission: boolean;
  agreeToTerms: boolean;
  marketingOptIn: boolean;
  shoeSize?: string;
  favoriteBrands?: string[];
  buyingPreference?: 'buying' | 'selling' | 'both';
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  error?: string;
  user?: JWTUserPayload;
  token?: string;
  refreshToken?: string;
  verificationStatus?: UserVerificationStatus;
  canSell: boolean;
  requiresVerification?: {
    email: boolean;
    phone: boolean;
    seller: boolean;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface EmailVerificationRequest {
  token: string;
}

export interface PhoneVerificationRequest {
  userId: string;
  verificationCode: string;
}

export interface PhoneVerificationInitRequest {
  phoneNumber: string;
}

export interface ResendVerificationRequest {
  email?: string;
  phoneNumber?: string;
  type: 'email' | 'phone';
}

export interface SellerVerificationRequest {
  userId: string;
  fullLegalName: string;
  address: string;
  dateOfBirth: string;
  ssnLast4?: string;
  nationalIdNumber?: string;
  governmentIdScan?: string;
  stripeAccountId?: string;
}