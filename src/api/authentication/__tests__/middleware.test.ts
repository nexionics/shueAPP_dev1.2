/**
 * Authentication Middleware Tests
 * 
 * Tests for the AuthMiddleware class including request interceptors, auto-refresh, and auth guards
 */

import { AuthMiddleware, AuthGuard } from '../middleware';

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
      localStorage: mockLocalStorage,
      location: {
        href: ''
      }
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

// Mock atob for JWT decoding
global.atob = jest.fn((str: string) => {
  // Simple mock for JWT payload
  if (str === 'eyJleHAiOjE3MDM5NzEyMDB9') { // Mock payload with exp: 1703971200
    return '{"exp":1703971200}'; // Dec 30, 2023
  }
  return JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }); // 1 hour from now
});

describe('AuthMiddleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();
    
    // Mock Date.now to return consistent time
    jest.spyOn(Date, 'now').mockReturnValue(1703884800000); // Dec 29, 2023
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('requestInterceptor', () => {
    it('should make request with authentication headers', async () => {
      mockLocalStorage.getItem.mockReturnValue('mock-access-token');
      
      const mockResponse = { 
        ok: true,
        json: () => Promise.resolve({ success: true, data: 'test' })
      };
      mockFetch.mockResolvedValueOnce(mockResponse);

      const response = await AuthMiddleware.requestInterceptor({
        url: '/test',
        method: 'GET'
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.any(Headers)
        })
      );

      const callArgs = mockFetch.mock.calls[0];
      const headers = callArgs[1].headers as Headers;
      expect(headers.get('Authorization')).toBe('Bearer mock-access-token');
      expect(headers.get('Content-Type')).toBe('application/json');
    });

    it('should skip authentication when skipAuth is true', async () => {
      const mockResponse = { 
        ok: true,
        json: () => Promise.resolve({ success: true })
      };
      mockFetch.mockResolvedValueOnce(mockResponse);

      const response = await AuthMiddleware.requestInterceptor({
        url: '/public',
        method: 'GET',
        skipAuth: true
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/public',
        expect.objectContaining({
          method: 'GET'
        })
      );

      const callArgs = mockFetch.mock.calls[0];
      const headers = callArgs[1].headers as Headers;
      expect(headers.get('Authorization')).toBeNull();
    });

    it('should handle 401 errors and retry with refreshed token', async () => {
      const refreshTokenResponse = {
        success: true,
        token: 'new-access-token'
      };

      const unauthorizedResponse = { status: 401, ok: false };
      const successResponse = { 
        ok: true,
        json: () => Promise.resolve({ success: true, data: 'test' })
      };

      mockLocalStorage.getItem
        .mockReturnValueOnce('old-access-token') // First call for Authorization header
        .mockReturnValueOnce('mock-refresh-token') // For refresh request
        .mockReturnValueOnce('new-access-token'); // For retry request

      mockFetch
        .mockResolvedValueOnce(unauthorizedResponse) // Initial request fails
        .mockResolvedValueOnce({ json: () => Promise.resolve(refreshTokenResponse) }) // Refresh succeeds
        .mockResolvedValueOnce(successResponse); // Retry succeeds

      const response = await AuthMiddleware.requestInterceptor({
        url: '/protected',
        method: 'GET'
      });

      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessToken', 'new-access-token');
    });

    it('should not retry when skipAuth is true', async () => {
      const unauthorizedResponse = { status: 401, ok: false };

      mockFetch.mockResolvedValueOnce(unauthorizedResponse);

      const response = await AuthMiddleware.requestInterceptor({
        url: '/public',
        method: 'GET',
        skipAuth: true
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(response).toBe(unauthorizedResponse);
    });

    it('should not retry when retryOnAuthFailure is false', async () => {
      const unauthorizedResponse = { status: 401, ok: false };

      mockLocalStorage.getItem.mockReturnValue('mock-access-token');
      mockFetch.mockResolvedValueOnce(unauthorizedResponse);

      const response = await AuthMiddleware.requestInterceptor({
        url: '/test',
        method: 'GET',
        retryOnAuthFailure: false
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(response).toBe(unauthorizedResponse);
    });
  });

  describe('authenticatedRequest', () => {
    it('should make authenticated request and return JSON data', async () => {
      const mockData = { success: true, user: { id: '123' } };
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockData)
      };

      mockLocalStorage.getItem.mockReturnValue('mock-access-token');
      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await AuthMiddleware.authenticatedRequest('/user/profile');

      expect(result).toEqual(mockData);
    });

    it('should throw error for non-ok responses', async () => {
      const mockResponse = {
        ok: false,
        status: 400
      };

      mockLocalStorage.getItem.mockReturnValue('mock-access-token');
      mockFetch.mockResolvedValueOnce(mockResponse);

      await expect(AuthMiddleware.authenticatedRequest('/user/profile'))
        .rejects.toThrow('HTTP error! status: 400');
    });
  });

  describe('getAuthState', () => {
    it('should return authenticated state when token and user exist', () => {
      const mockUser = { userId: '123', email: 'test@example.com' };
      
      mockLocalStorage.getItem
        .mockReturnValueOnce('mock-access-token')
        .mockReturnValueOnce(JSON.stringify(mockUser));

      const authState = AuthMiddleware.getAuthState();

      expect(authState).toEqual({
        isAuthenticated: true,
        isLoading: false,
        user: mockUser,
        token: 'mock-access-token'
      });
    });

    it('should return unauthenticated state when token is missing', () => {
      mockLocalStorage.getItem
        .mockReturnValueOnce(null) // No token
        .mockReturnValueOnce(JSON.stringify({ userId: '123' }));

      const authState = AuthMiddleware.getAuthState();

      expect(authState).toEqual({
        isAuthenticated: false,
        isLoading: false,
        user: { userId: '123' },
        token: null
      });
    });

    it('should return unauthenticated state when token is expired', () => {
      const expiredToken = 'header.eyJleHAiOjE3MDM5NzEyMDB9.signature'; // Expired token
      const mockUser = { userId: '123', email: 'test@example.com' };
      
      mockLocalStorage.getItem
        .mockReturnValueOnce(expiredToken)
        .mockReturnValueOnce(JSON.stringify(mockUser));

      const authState = AuthMiddleware.getAuthState();

      expect(authState).toEqual({
        isAuthenticated: false,
        isLoading: false,
        user: mockUser,
        token: expiredToken
      });
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for valid token', () => {
      const validToken = 'header.eyJleHAiOjk5OTk5OTk5OTl9.signature'; // Far future exp
      
      const isExpired = AuthMiddleware.isTokenExpired(validToken);

      expect(isExpired).toBe(false);
    });

    it('should return true for expired token', () => {
      const expiredToken = 'header.eyJleHAiOjE3MDM5NzEyMDB9.signature'; // Past exp
      
      const isExpired = AuthMiddleware.isTokenExpired(expiredToken);

      expect(isExpired).toBe(true);
    });

    it('should return true for malformed token', () => {
      const malformedToken = 'invalid-token';
      
      const isExpired = AuthMiddleware.isTokenExpired(malformedToken);

      expect(isExpired).toBe(true);
    });
  });

  describe('logout', () => {
    it('should clear auth data and call logout endpoint', async () => {
      const mockResponse = {
        success: true,
        message: 'Logged out successfully'
      };

      mockLocalStorage.getItem.mockReturnValue('mock-refresh-token');
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      await AuthMiddleware.logout();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('accessToken');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user');

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
    });

    it('should clear auth data even if logout endpoint fails', async () => {
      mockLocalStorage.getItem.mockReturnValue('mock-refresh-token');
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await AuthMiddleware.logout();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledTimes(3);
    });
  });
});

describe('AuthGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockClear();
  });

  describe('isAuthenticated', () => {
    it('should return true when user is authenticated', () => {
      const mockUser = { userId: '123', email: 'test@example.com' };
      
      mockLocalStorage.getItem
        .mockReturnValueOnce('valid-token')
        .mockReturnValueOnce(JSON.stringify(mockUser));

      const result = AuthGuard.isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false when user is not authenticated', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = AuthGuard.isAuthenticated();

      expect(result).toBe(false);
    });
  });

  describe('requireAuth', () => {
    it('should return true if user is authenticated', () => {
      const mockUser = { userId: '123', email: 'test@example.com' };
      
      mockLocalStorage.getItem
        .mockReturnValueOnce('valid-token')
        .mockReturnValueOnce(JSON.stringify(mockUser));

      const result = AuthGuard.requireAuth();

      expect(result).toBe(true);
    });

    it('should redirect to login if user is not authenticated', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = AuthGuard.requireAuth();

      expect(result).toBe(false);
      expect(global.window.location.href).toBe('/login');
    });

    it('should redirect to custom URL if specified', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = AuthGuard.requireAuth('/custom-login');

      expect(result).toBe(false);
      expect(global.window.location.href).toBe('/custom-login');
    });
  });

  describe('getUser', () => {
    it('should return user if authenticated', () => {
      const mockUser = { userId: '123', email: 'test@example.com' };
      
      mockLocalStorage.getItem
        .mockReturnValueOnce('valid-token')
        .mockReturnValueOnce(JSON.stringify(mockUser))
        .mockReturnValueOnce(JSON.stringify(mockUser));

      const user = AuthGuard.getUser();

      expect(user).toEqual(mockUser);
    });

    it('should return null if not authenticated', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const user = AuthGuard.getUser();

      expect(user).toBeNull();
    });
  });

  describe('hasRole', () => {
    it('should return true if user has the specified role', () => {
      const mockUser = { userId: '123', email: 'test@example.com', role: 'ADMIN' };
      
      mockLocalStorage.getItem
        .mockReturnValueOnce('valid-token')
        .mockReturnValueOnce(JSON.stringify(mockUser))
        .mockReturnValueOnce(JSON.stringify(mockUser));

      const hasRole = AuthGuard.hasRole('ADMIN');

      expect(hasRole).toBe(true);
    });

    it('should return false if user does not have the specified role', () => {
      const mockUser = { userId: '123', email: 'test@example.com', role: 'USER' };
      
      mockLocalStorage.getItem
        .mockReturnValueOnce('valid-token')
        .mockReturnValueOnce(JSON.stringify(mockUser))
        .mockReturnValueOnce(JSON.stringify(mockUser));

      const hasRole = AuthGuard.hasRole('ADMIN');

      expect(hasRole).toBe(false);
    });

    it('should return false if user role is not a string', () => {
      const mockUser = { userId: '123', email: 'test@example.com', role: null };
      
      mockLocalStorage.getItem
        .mockReturnValueOnce('valid-token')
        .mockReturnValueOnce(JSON.stringify(mockUser))
        .mockReturnValueOnce(JSON.stringify(mockUser));

      const hasRole = AuthGuard.hasRole('ADMIN');

      expect(hasRole).toBe(false);
    });
  });

  describe('hasAnyRole', () => {
    it('should return true if user has any of the specified roles', () => {
      const mockUser = { userId: '123', email: 'test@example.com', role: 'MODERATOR' };
      
      mockLocalStorage.getItem
        .mockReturnValueOnce('valid-token')
        .mockReturnValueOnce(JSON.stringify(mockUser))
        .mockReturnValueOnce(JSON.stringify(mockUser));

      const hasAnyRole = AuthGuard.hasAnyRole(['ADMIN', 'MODERATOR']);

      expect(hasAnyRole).toBe(true);
    });

    it('should return false if user does not have any of the specified roles', () => {
      const mockUser = { userId: '123', email: 'test@example.com', role: 'USER' };
      
      mockLocalStorage.getItem
        .mockReturnValueOnce('valid-token')
        .mockReturnValueOnce(JSON.stringify(mockUser))
        .mockReturnValueOnce(JSON.stringify(mockUser));

      const hasAnyRole = AuthGuard.hasAnyRole(['ADMIN', 'MODERATOR']);

      expect(hasAnyRole).toBe(false);
    });
  });
});