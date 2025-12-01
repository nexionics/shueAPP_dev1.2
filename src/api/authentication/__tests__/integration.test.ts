/**
 * Integration Tests for Authentication API
 * 
 * End-to-end tests that verify the complete authentication flow
 */
import { AuthAPI, TokenManager } from '../index';
import { VerificationAPI } from '../verification';
import type { RegisterRequest, LoginRequest } from '../types';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Complete Registration and Verification Flow', () => {
    it('should complete full user registration and verification process', async () => {
      // Step 1: Register user
      const registrationData: RegisterRequest = {
        fullName: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        phoneNumber: '+1234567890',
        password: 'SecurePass123!',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        zipCode: '10001',
        agreeToTerms: true,
        marketingOptIn: false,
        allowLocationPermission: true
      };

      const registrationResponse = {
        success: true,
        message: 'Registration successful',
        user: {
          userId: '123',
          email: 'john@example.com',
          username: 'johndoe',
          firstName: 'John',
          lastName: 'Doe',
          role: 'USER'
        },
        token: 'access-token-123',
        refreshToken: 'refresh-token-123',
        canSell: false,
        verificationStatus: {
          email: false,
          phone: false
        },
        requiresVerification: {
          email: true,
          phone: true,
          seller: false
        }
      };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(registrationResponse)
      });

      const registerResult = await AuthAPI.register(registrationData);

      expect(registerResult.success).toBe(true);
      expect(registerResult.user).toBeDefined();
      expect(registerResult.requiresVerification?.email).toBe(true);
      expect(registerResult.requiresVerification?.phone).toBe(true);

      // Verify tokens are stored
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessToken', 'access-token-123');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('refreshToken', 'refresh-token-123');

      // Step 2: Verify email
      const emailVerificationResponse = {
        success: true,
        message: 'Email verified successfully'
      };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(emailVerificationResponse)
      });

      const emailResult = await VerificationAPI.verifyEmail('email-verification-token');

      expect(emailResult.success).toBe(true);

      // Step 3: Verify phone
      const phoneVerificationResponse = {
        success: true,
        message: 'Phone verified successfully'
      };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(phoneVerificationResponse)
      });

      const phoneResult = await VerificationAPI.verifyPhone('123', '123456');

      expect(phoneResult.success).toBe(true);

      // Step 4: Check final verification status
      const verificationStatusResponse = {
        success: true,
        verificationStatus: {
          email: true,
          phone: true,
          identity: false
        }
      };

      mockLocalStorage.getItem.mockReturnValue('access-token-123');
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(verificationStatusResponse)
      });

      const statusResult = await VerificationAPI.getVerificationStatus();

      expect(statusResult.success).toBe(true);
      expect(statusResult.verificationStatus?.email).toBe(true);
      expect(statusResult.verificationStatus?.phone).toBe(true);
    });
  });

  describe('Login and Token Management Flow', () => {
    it('should handle login, token validation, and refresh flow', async () => {
      // Step 1: Login
      const loginData: LoginRequest = {
        email: 'john@example.com',
        password: 'SecurePass123!'
      };

      const loginResponse = {
        success: true,
        message: 'Login successful',
        user: {
          userId: '123',
          email: 'john@example.com',
          username: 'johndoe',
          firstName: 'John',
          lastName: 'Doe',
          role: 'USER'
        },
        token: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresAt: '2023-12-31T23:59:59.000Z'
      };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(loginResponse)
      });

      const loginResult = await AuthAPI.login(loginData);

      expect(loginResult.success).toBe(true);
      expect(loginResult.user).toBeDefined();
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessToken', 'new-access-token');

      // Step 2: Validate token
      const validationResponse = {
        success: true,
        user: loginResponse.user,
        verificationStatus: {
          email: true,
          phone: true
        }
      };

      mockLocalStorage.getItem.mockReturnValue('new-access-token');
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(validationResponse)
      });

      const validationResult = await TokenManager.validateToken();

      expect(validationResult.success).toBe(true);
      expect(validationResult.valid).toBe(true);
      expect(validationResult.user).toEqual(loginResponse.user);

      // Step 3: Simulate token refresh
      const refreshResponse = {
        success: true,
        token: 'refreshed-access-token',
        expiresAt: '2023-12-31T23:59:59.000Z'
      };

      mockLocalStorage.getItem.mockReturnValue('new-refresh-token');
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(refreshResponse)
      });

      const refreshResult = await TokenManager.refreshAccessToken();

      expect(refreshResult.success).toBe(true);
      expect(refreshResult.token).toBe('refreshed-access-token');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessToken', 'refreshed-access-token');
    });
  });

  describe('Password Management Flow', () => {
    it('should handle forgot password and reset flow', async () => {
      // Step 1: Request password reset
      const forgotPasswordResponse = {
        success: true,
        message: 'Password reset email sent'
      };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(forgotPasswordResponse)
      });

      const forgotResult = await AuthAPI.forgotPassword('john@example.com');

      expect(forgotResult.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/forgot-password',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'john@example.com' })
        })
      );

      // Step 2: Reset password with token
      const resetPasswordData = {
        token: 'reset-token-123',
        newPassword: 'NewSecurePass456!',
        confirmPassword: 'NewSecurePass456!'
      };

      const resetPasswordResponse = {
        success: true,
        message: 'Password reset successfully'
      };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(resetPasswordResponse)
      });

      const resetResult = await AuthAPI.resetPassword(resetPasswordData);

      expect(resetResult.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/reset-password',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(resetPasswordData)
        })
      );

      // Step 3: Login with new password
      const newLoginData: LoginRequest = {
        email: 'john@example.com',
        password: 'NewSecurePass456!'
      };

      const newLoginResponse = {
        success: true,
        message: 'Login successful',
        user: {
          userId: '123',
          email: 'john@example.com',
          username: 'johndoe',
          firstName: 'John',
          lastName: 'Doe',
          role: 'USER'
        },
        token: 'post-reset-token',
        refreshToken: 'post-reset-refresh-token'
      };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(newLoginResponse)
      });

      const newLoginResult = await AuthAPI.login(newLoginData);

      expect(newLoginResult.success).toBe(true);
    });
  });

  describe('Profile and Account Management Flow', () => {
    it('should handle profile retrieval and password change', async () => {
      // Setup authenticated state
      mockLocalStorage.getItem.mockReturnValue('valid-access-token');

      // Step 1: Get profile
      const profileResponse = {
        success: true,
        user: {
          id: '123',
          email: 'john@example.com',
          username: 'johndoe',
          fullName: 'John Doe',
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '+1234567890',
          role: 'USER',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          zipCode: '10001',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z'
        },
        verificationStatus: {
          email: true,
          phone: true
        },
        canSell: true
      };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(profileResponse)
      });

      const profileResult = await AuthAPI.getProfile();

      expect(profileResult.success).toBe(true);
      expect(profileResult.user).toBeDefined();
      expect(profileResult.canSell).toBe(true);

      // Step 2: Change password
      const changePasswordData = {
        currentPassword: 'NewSecurePass456!',
        newPassword: 'AnotherSecurePass789!',
        confirmPassword: 'AnotherSecurePass789!'
      };

      const changePasswordResponse = {
        success: true,
        message: 'Password changed successfully'
      };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(changePasswordResponse)
      });

      const changeResult = await AuthAPI.changePassword(changePasswordData);

      expect(changeResult.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/change-password'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(changePasswordData)
        })
      );
    });
  });

  describe('Logout Flow', () => {
    it('should handle complete logout process', async () => {
      // Setup authenticated state
      mockLocalStorage.getItem.mockReturnValue('refresh-token-123');

      const logoutResponse = {
        success: true,
        message: 'Logged out successfully'
      };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(logoutResponse)
      });

      const logoutResult = await AuthAPI.logout();

      expect(logoutResult.success).toBe(true);

      // Verify all auth data is cleared
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('accessToken');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user');

      // Verify logout endpoint was called
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/logout',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ refreshToken: 'refresh-token-123' })
        })
      );

      // Verify user is no longer logged in
      mockLocalStorage.getItem.mockReturnValue(null);
      const isLoggedIn = TokenManager.isLoggedIn();
      expect(isLoggedIn).toBe(false);
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle network errors gracefully across all operations', async () => {
      // Test login network error
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const loginResult = await AuthAPI.login({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(loginResult.success).toBe(false);
      expect(loginResult.message).toBe('Network error occurred during login');

      // Test registration network error
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const registerResult = await AuthAPI.register({
        fullName: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        phoneNumber: '+1234567890',
        password: 'password123',
        city: 'City',
        state: 'State',
        country: 'Country',
        zipCode: '12345',
        agreeToTerms: true,
        marketingOptIn: false,
        allowLocationPermission: true
      });

      expect(registerResult.success).toBe(false);
      expect(registerResult.message).toBe('Network error occurred during registration');

      // Test verification network error
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const verifyResult = await VerificationAPI.verifyEmail('token');

      expect(verifyResult.success).toBe(false);
      expect(verifyResult.error).toBe('Network error occurred during email verification');
    });

    it('should handle authentication failures and validation errors', async () => {
      // Test invalid login credentials
      const invalidLoginResponse = {
        success: false,
        message: 'Invalid email or password'
      };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(invalidLoginResponse)
      });

      const loginResult = await AuthAPI.login({
        email: 'wrong@example.com',
        password: 'wrongpassword'
      });

      expect(loginResult.success).toBe(false);
      expect(loginResult.message).toBe('Invalid email or password');

      // Test registration validation error
      const validationErrorResponse = {
        success: false,
        error: 'Email already registered',
        canSell: false
      };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(validationErrorResponse)
      });

      const registerResult = await AuthAPI.register({
        fullName: 'Existing User',
        username: 'existinguser',
        email: 'existing@example.com',
        phoneNumber: '+1234567890',
        password: 'password123',
        city: 'City',
        state: 'State',
        country: 'Country',
        zipCode: '12345',
        agreeToTerms: true,
        marketingOptIn: false,
        allowLocationPermission: true
      });

      expect(registerResult.success).toBe(false);
      expect(registerResult.error).toBe('Email already registered');
    });
  });
});