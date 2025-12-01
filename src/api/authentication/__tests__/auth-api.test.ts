/**
 * Authentication API Tests
 * 
 * Tests for the main AuthAPI class including login, register, logout, and other core functions
 */

import { AuthAPI, TokenManager } from '../index';
import type { LoginRequest, RegisterRequest, ChangePasswordRequest } from '../types';

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

describe('AuthAPI', () => {
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

  describe('login', () => {
    it('should successfully log in a user', async () => {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockResponse = {
        success: true,
        message: 'Login successful',
        user: {
          userId: '123',
          email: 'test@example.com',
          username: 'testuser',
          firstName: 'Test',
          lastName: 'User',
          role: 'USER'
        },
        token: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: '2023-12-31T23:59:59.000Z'
      };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await AuthAPI.login(loginData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(loginData)
        }
      );

      expect(result).toEqual(mockResponse);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessToken', 'mock-access-token');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('refreshToken', 'mock-refresh-token');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockResponse.user));
    });

    it('should handle login failure', async () => {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const mockResponse = {
        success: false,
        message: 'Invalid email or password'
      };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await AuthAPI.login(loginData);

      expect(result).toEqual(mockResponse);
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await AuthAPI.login(loginData);

      expect(result).toEqual({
        success: false,
        message: 'Network error occurred during login'
      });
    });
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      const registerData: RegisterRequest = {
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

      const mockResponse = {
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
        token: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
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
        json: () => Promise.resolve(mockResponse)
      });

      const result = await AuthAPI.register(registerData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(registerData)
        }
      );

      expect(result).toEqual(mockResponse);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessToken', 'mock-access-token');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('refreshToken', 'mock-refresh-token');
    });

    it('should handle registration validation errors', async () => {
      const registerData: RegisterRequest = {
        fullName: 'John Doe',
        username: 'johndoe',
        email: 'invalid-email',
        phoneNumber: '+1234567890',
        password: 'weak',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        zipCode: '10001',
        agreeToTerms: true,
        marketingOptIn: false,
        allowLocationPermission: true
      };

      const mockResponse = {
        success: false,
        error: 'Invalid email format',
        canSell: false
      };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await AuthAPI.register(registerData);

      expect(result).toEqual(mockResponse);
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should successfully log out a user', async () => {
      mockLocalStorage.getItem.mockReturnValue('mock-refresh-token');

      const mockResponse = {
        success: true,
        message: 'Logged out successfully'
      };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await AuthAPI.logout();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/logout',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ refreshToken: 'mock-refresh-token' })
        }
      );

      expect(result).toEqual(mockResponse);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('accessToken');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user');
    });

    it('should handle logout without refresh token', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = await AuthAPI.logout();

      expect(mockFetch).not.toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        message: 'Logged out successfully'
      });
      expect(mockLocalStorage.removeItem).toHaveBeenCalledTimes(3);
    });
  });

  describe('changePassword', () => {
    it('should successfully change password', async () => {
      const passwordData: ChangePasswordRequest = {
        currentPassword: 'oldpass123',
        newPassword: 'newpass456',
        confirmPassword: 'newpass456'
      };

      const mockResponse = {
        success: true,
        message: 'Password changed successfully'
      };

      mockLocalStorage.getItem.mockReturnValue('mock-access-token');
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await AuthAPI.changePassword(passwordData);

      expect(result).toEqual(mockResponse);
    });

    it('should handle incorrect current password', async () => {
      const passwordData: ChangePasswordRequest = {
        currentPassword: 'wrongpass',
        newPassword: 'newpass456',
        confirmPassword: 'newpass456'
      };

      const mockResponse = {
        success: false,
        message: 'Current password is incorrect'
      };

      mockLocalStorage.getItem.mockReturnValue('mock-access-token');
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await AuthAPI.changePassword(passwordData);

      expect(result).toEqual(mockResponse);
    });
  });

  describe('forgotPassword', () => {
    it('should successfully request password reset', async () => {
      const mockResponse = {
        success: true,
        message: 'Password reset email sent'
      };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await AuthAPI.forgotPassword('test@example.com');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/forgot-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: 'test@example.com' })
        }
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe('resetPassword', () => {
    it('should successfully reset password', async () => {
      const resetData = {
        token: 'reset-token',
        newPassword: 'newpass123',
        confirmPassword: 'newpass123'
      };

      const mockResponse = {
        success: true,
        message: 'Password reset successfully'
      };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await AuthAPI.resetPassword(resetData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/reset-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(resetData)
        }
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe('getProfile', () => {
    it('should successfully get user profile', async () => {
      const mockResponse = {
        success: true,
        user: {
          id: '123',
          email: 'test@example.com',
          username: 'testuser',
          fullName: 'Test User',
          firstName: 'Test',
          lastName: 'User',
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

      mockLocalStorage.getItem.mockReturnValue('mock-access-token');
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await AuthAPI.getProfile();

      expect(result).toEqual(mockResponse);
    });
  });

  describe('getVerificationStatus', () => {
    it('should successfully get verification status', async () => {
      const mockResponse = {
        success: true,
        verificationStatus: {
          email: true,
          phone: false,
          identity: false
        }
      };

      mockLocalStorage.getItem.mockReturnValue('mock-access-token');
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await AuthAPI.getVerificationStatus();

      expect(result).toEqual(mockResponse);
    });
  });
});