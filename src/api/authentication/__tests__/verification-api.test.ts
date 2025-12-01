/**
 * Verification API Tests
 * 
 * Tests for the VerificationAPI class including email, phone, and seller verification
 */
import { VerificationAPI } from '../verification';

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

describe('VerificationAPI', () => {
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

  describe('verifyEmail', () => {
    it('should successfully verify email with new endpoint', async () => {
      const mockResponse = {
        success: true,
        message: 'Email verified successfully'
      };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await VerificationAPI.verifyEmail('verification-token-123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/verify/email',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token: 'verification-token-123' })
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should fallback to legacy endpoint if new endpoint fails', async () => {
      const failureResponse = {
        success: false,
        error: 'Invalid token'
      };

      const successResponse = {
        success: true,
        message: 'Email verified successfully'
      };

      mockFetch
        .mockResolvedValueOnce({
          json: () => Promise.resolve(failureResponse)
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve(successResponse)
        });

      const result = await VerificationAPI.verifyEmail('verification-token-123');

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenNthCalledWith(
        1,
        'http://localhost:3001/api/auth/verify/email',
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenNthCalledWith(
        2,
        'http://localhost:3001/api/auth/verify-email',
        expect.any(Object)
      );

      expect(result).toEqual(successResponse);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await VerificationAPI.verifyEmail('verification-token-123');

      expect(result).toEqual({
        success: false,
        error: 'Network error occurred during email verification'
      });
    });
  });

  describe('verifyPhone', () => {
    it('should successfully verify phone with new endpoint', async () => {
      const mockResponse = {
        success: true,
        message: 'Phone verified successfully'
      };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await VerificationAPI.verifyPhone('user-123', '123456');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/verify/phone',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: 'user-123',
            verificationCode: '123456'
          })
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should fallback to legacy endpoint if new endpoint fails', async () => {
      const failureResponse = {
        success: false,
        error: 'Invalid code'
      };

      const successResponse = {
        success: true,
        message: 'Phone verified successfully'
      };

      mockFetch
        .mockResolvedValueOnce({
          json: () => Promise.resolve(failureResponse)
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve(successResponse)
        });

      const result = await VerificationAPI.verifyPhone('user-123', '123456');

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual(successResponse);
    });

    it('should handle invalid verification code', async () => {
      const mockResponse = {
        success: false,
        error: 'Invalid verification code'
      };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await VerificationAPI.verifyPhone('user-123', '000000');

      expect(result).toEqual(mockResponse);
    });
  });

  describe('initiatePhoneVerification', () => {
    it('should successfully initiate phone verification', async () => {
      const mockResponse = {
        success: true,
        message: 'Verification code sent'
      };

      mockLocalStorage.getItem.mockReturnValue('mock-access-token');
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await VerificationAPI.initiatePhoneVerification('+1234567890');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/verify/phone/initiate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-access-token'
          },
          body: JSON.stringify({ phoneNumber: '+1234567890' })
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle phone verification initiation without token', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: false })
      });

      const result = await VerificationAPI.initiatePhoneVerification('+1234567890');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/verify/phone/initiate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ phoneNumber: '+1234567890' })
        }
      );
    });
  });

  describe('resendEmailVerification', () => {
    it('should successfully resend email verification', async () => {
      const mockResponse = {
        success: true,
        message: 'Verification email sent'
      };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await VerificationAPI.resendEmailVerification('test@example.com');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/verify/email/resend',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: 'test@example.com',
            type: 'email'
          })
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should fallback to legacy endpoint', async () => {
      const failureResponse = {
        success: false,
        error: 'Endpoint not found'
      };

      const successResponse = {
        success: true,
        message: 'Verification email sent'
      };

      mockFetch
        .mockResolvedValueOnce({
          json: () => Promise.resolve(failureResponse)
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve(successResponse)
        });

      const result = await VerificationAPI.resendEmailVerification('test@example.com');

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual(successResponse);
    });
  });

  describe('resendPhoneVerification', () => {
    it('should successfully resend phone verification', async () => {
      const mockResponse = {
        success: true,
        message: 'Verification code sent'
      };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await VerificationAPI.resendPhoneVerification('+1234567890');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/verify/phone/resend',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            phoneNumber: '+1234567890',
            type: 'phone'
          })
        }
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe('resendVerification', () => {
    it('should resend email verification when type is email', async () => {
      const mockResponse = {
        success: true,
        message: 'Verification email sent'
      };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await VerificationAPI.resendVerification('email', 'test@example.com');

      expect(result).toEqual(mockResponse);
    });

    it('should resend phone verification when type is phone', async () => {
      const mockResponse = {
        success: true,
        message: 'Verification code sent'
      };

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await VerificationAPI.resendVerification('phone', '+1234567890');

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

      const result = await VerificationAPI.getVerificationStatus();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/user/verification-status',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-access-token'
          }
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle unauthorized access', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({
          success: false,
          message: 'Unauthorized'
        })
      });

      const result = await VerificationAPI.getVerificationStatus();

      expect(result.success).toBe(false);
    });
  });

  describe('verifySeller', () => {
    it('should successfully initiate seller verification', async () => {
      const mockSellerData = {
        fullLegalName: 'John Doe',
        address: '123 Main St, City, State 12345',
        dateOfBirth: '1990-01-01',
        ssnLast4: '1234'
      };

      const mockResponse = {
        success: true,
        message: 'Seller verification submitted'
      };

      mockLocalStorage.getItem.mockReturnValue('mock-access-token');
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await VerificationAPI.verifySeller(mockSellerData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/seller/verify',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-access-token'
          },
          body: JSON.stringify(mockSellerData)
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle seller verification errors', async () => {
      const mockSellerData = {
        fullLegalName: 'John Doe'
        // Missing required fields
      };

      const mockResponse = {
        success: false,
        error: 'Missing required fields'
      };

      mockLocalStorage.getItem.mockReturnValue('mock-access-token');
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await VerificationAPI.verifySeller(mockSellerData);

      expect(result).toEqual(mockResponse);
    });
  });

  describe('getSellerVerificationStatus', () => {
    it('should successfully get seller verification status', async () => {
      const mockResponse = {
        success: true,
        status: {
          verified: false,
          pending: true,
          rejected: false,
          reason: null
        }
      };

      mockLocalStorage.getItem.mockReturnValue('mock-access-token');
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await VerificationAPI.getSellerVerificationStatus('user-123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/seller/verification-status/user-123',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-access-token'
          }
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle network errors', async () => {
      mockLocalStorage.getItem.mockReturnValue('mock-access-token');
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await VerificationAPI.getSellerVerificationStatus('user-123');

      expect(result).toEqual({
        success: false,
        error: 'Network error occurred while fetching seller verification status'
      });
    });
  });
});