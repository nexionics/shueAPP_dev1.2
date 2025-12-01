/**
 * Token Manager Tests
 * 
 * Tests for the TokenManager class including storage, validation, and refresh functionality
 */
import { TokenManager } from '../index';

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

// Mock window object
if (typeof window === 'undefined') {
  Object.defineProperty(global, 'window', {
    value: {
      localStorage: mockLocalStorage
    },
    writable: true,
    configurable: true
  });
} else {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
    configurable: true
  });
}

describe('TokenManager', () => {
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

  describe('getAccessToken', () => {
    it('should return access token from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('mock-access-token');

      const token = TokenManager.getAccessToken();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('accessToken');
      expect(token).toBe('mock-access-token');
    });

    it('should return null if no token exists', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const token = TokenManager.getAccessToken();

      expect(token).toBeNull();
    });
  });

  describe('getRefreshToken', () => {
    it('should return refresh token from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('mock-refresh-token');

      const token = TokenManager.getRefreshToken();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('refreshToken');
      expect(token).toBe('mock-refresh-token');
    });

    it('should return null if no refresh token exists', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const token = TokenManager.getRefreshToken();

      expect(token).toBeNull();
    });
  });

  describe('getStoredUser', () => {
    it('should return parsed user object from localStorage', () => {
      const mockUser = {
        userId: '123',
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER'
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

      const user = TokenManager.getStoredUser();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('user');
      expect(user).toEqual(mockUser);
    });

    it('should return null if no user data exists', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const user = TokenManager.getStoredUser();

      expect(user).toBeNull();
    });

    it('should return null if user data is invalid JSON', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json');

      expect(() => TokenManager.getStoredUser()).toThrow();
    });
  });

  describe('storeAuthData', () => {
    it('should store authentication data in localStorage', () => {
      const token = 'mock-access-token';
      const refreshToken = 'mock-refresh-token';
      const user = {
        userId: '123',
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER'
      };

      TokenManager.storeAuthData(token, refreshToken, user);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessToken', token);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('refreshToken', refreshToken);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(user));
    });
  });

  describe('clearAuthData', () => {
    it('should remove all authentication data from localStorage', () => {
      TokenManager.clearAuthData();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('accessToken');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user');
    });
  });

  describe('isLoggedIn', () => {
    it('should return true if both token and user exist', () => {
      mockLocalStorage.getItem
        .mockReturnValueOnce('mock-access-token') // accessToken
        .mockReturnValueOnce(JSON.stringify({ userId: '123' })); // user

      const result = TokenManager.isLoggedIn();

      expect(result).toBe(true);
    });

    it('should return false if token is missing', () => {
      mockLocalStorage.getItem
        .mockReturnValueOnce(null) // accessToken
        .mockReturnValueOnce(JSON.stringify({ userId: '123' })); // user

      const result = TokenManager.isLoggedIn();

      expect(result).toBe(false);
    });

    it('should return false if user is missing', () => {
      mockLocalStorage.getItem
        .mockReturnValueOnce('mock-access-token') // accessToken
        .mockReturnValueOnce(null); // user

      const result = TokenManager.isLoggedIn();

      expect(result).toBe(false);
    });

    it('should return false if both token and user are missing', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = TokenManager.isLoggedIn();

      expect(result).toBe(false);
    });
  });

  describe('refreshAccessToken', () => {
    it('should successfully refresh access token', async () => {
      const mockResponse = {
        success: true,
        token: 'new-access-token',
        expiresAt: '2023-12-31T23:59:59.000Z'
      };

      mockLocalStorage.getItem.mockReturnValue('mock-refresh-token');
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await TokenManager.refreshAccessToken();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/refresh',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ refreshToken: 'mock-refresh-token' })
        }
      );

      expect(result).toEqual({
        success: true,
        token: 'new-access-token',
        expiresAt: '2023-12-31T23:59:59.000Z'
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessToken', 'new-access-token');
    });

    it('should handle refresh failure', async () => {
      const mockResponse = {
        success: false,
        message: 'Refresh token expired'
      };

      mockLocalStorage.getItem.mockReturnValue('expired-refresh-token');
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await TokenManager.refreshAccessToken();

      expect(result).toEqual({
        success: false,
        message: 'Refresh token expired'
      });

      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });

    it('should handle missing refresh token', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = await TokenManager.refreshAccessToken();

      expect(result).toEqual({
        success: false,
        message: 'No refresh token available'
      });

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      mockLocalStorage.getItem.mockReturnValue('mock-refresh-token');
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await TokenManager.refreshAccessToken();

      expect(result).toEqual({
        success: false,
        message: 'Network error during token refresh'
      });
    });
  });

  describe('validateToken', () => {
    it('should successfully validate token', async () => {
      const mockResponse = {
        success: true,
        user: {
          userId: '123',
          email: 'test@example.com',
          username: 'testuser',
          firstName: 'Test',
          lastName: 'User',
          role: 'USER'
        },
        verificationStatus: {
          email: true,
          phone: true
        }
      };

      mockLocalStorage.getItem.mockReturnValue('valid-access-token');
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await TokenManager.validateToken();

      expect(result).toEqual({
        success: true,
        valid: true,
        user: mockResponse.user,
        verificationStatus: mockResponse.verificationStatus
      });
    });

    it('should handle invalid token', async () => {
      const mockResponse = {
        success: false,
        message: 'Token expired'
      };

      mockLocalStorage.getItem.mockReturnValue('invalid-access-token');
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await TokenManager.validateToken();

      expect(result).toEqual({
        success: false,
        valid: false,
        message: 'Token expired'
      });
    });

    it('should handle missing token', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = await TokenManager.validateToken();

      expect(result).toEqual({
        success: false,
        valid: false,
        message: 'No access token found'
      });

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should handle network errors during validation', async () => {
      mockLocalStorage.getItem.mockReturnValue('valid-access-token');
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await TokenManager.validateToken();

      expect(result).toEqual({
        success: false,
        valid: false,
        message: 'Token validation failed'
      });
    });
  });
});