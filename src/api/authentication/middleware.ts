/**
 * Authentication Middleware
 * 
 * This module provides middleware functions for handling authentication,
 * token refresh, and request interceptors.
 */

// API Configuration
const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const API_BASE = `${API_ORIGIN.replace(/\/$/, '')}/api`

// Types
export interface RequestConfig extends RequestInit {
  url: string;
  skipAuth?: boolean;
  retryOnAuthFailure?: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: Record<string, unknown> | null;
  token: string | null;
}

// Authentication Middleware Class
export class AuthMiddleware {
  private static refreshPromise: Promise<boolean> | null = null;

  /**
   * Check if we're in a browser environment
   */
  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  /**
   * Get access token from storage
   */
  private static getAccessToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('accessToken');
  }

  /**
   * Get refresh token from storage
   */
  private static getRefreshToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('refreshToken');
  }

  /**
   * Store new access token
   */
  private static storeAccessToken(token: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem('accessToken', token);
  }

  /**
   * Clear authentication data
   */
  private static clearAuthData(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  /**
   * Refresh access token
   */
  private static async refreshAccessToken(): Promise<boolean> {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this._performTokenRefresh();
    const result = await this.refreshPromise;
    this.refreshPromise = null;
    
    return result;
  }

  /**
   * Perform the actual token refresh
   */
  private static async _performTokenRefresh(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        return false;
      }

      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const result = await response.json();

      if (result.success && result.token) {
        this.storeAccessToken(result.token);
        return true;
      }

      // Refresh failed, clear auth data
      this.clearAuthData();
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearAuthData();
      return false;
    }
  }

  /**
   * Request interceptor that adds authentication headers and handles token refresh
   */
  static async requestInterceptor(config: RequestConfig): Promise<Response> {
    const { url, skipAuth = false, retryOnAuthFailure = true, ...requestConfig } = config;
    
    // Add authentication header if not skipped and token is available
    if (!skipAuth) {
      const token = this.getAccessToken();
      if (token) {
        requestConfig.headers = {
          ...requestConfig.headers,
          'Authorization': `Bearer ${token}`,
        };
      }
    }

    // Add default Content-Type if not specified
    const headers = new Headers(requestConfig.headers);
    
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    
    requestConfig.headers = headers;

    // Make the request
    let response = await fetch(`${API_BASE}${url}`, requestConfig);

    // Handle 401 Unauthorized - attempt token refresh and retry
    if (response.status === 401 && !skipAuth && retryOnAuthFailure) {
      const refreshSuccess = await this.refreshAccessToken();
      
      if (refreshSuccess) {
        // Retry request with new token
        const newToken = this.getAccessToken();
        if (newToken) {
          const headers = new Headers(requestConfig.headers);
          headers.set('Authorization', `Bearer ${newToken}`);
          requestConfig.headers = headers;
          response = await fetch(`${API_BASE}${url}`, requestConfig);
        }
      }
    }

    return response;
  }

  /**
   * Simplified authenticated request helper
   */
  static async authenticatedRequest<T>(
    url: string,
    options: Omit<RequestConfig, 'url'> = {}
  ): Promise<T> {
    const response = await this.requestInterceptor({ url, ...options });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  /**
   * Check if current token is expired (basic check without validation)
   */
  static isTokenExpired(token: string): boolean {
    try {
      // Decode JWT payload (this is not a security check, just for UX)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp < now;
    } catch {
      return true; // If we can't parse it, consider it expired
    }
  }

  /**
   * Get authentication state
   */
  static getAuthState(): AuthState {
    const token = this.getAccessToken();
    const userString = this.isBrowser() ? localStorage.getItem('user') : null;
    const user = userString ? JSON.parse(userString) : null;

    return {
      isAuthenticated: !!(token && user && !this.isTokenExpired(token)),
      isLoading: false,
      user,
      token
    };
  }

  /**
   * Setup automatic token refresh before expiration
   */
  static setupAutoRefresh(): void {
    if (!this.isBrowser()) return;

    const checkAndRefresh = () => {
      const token = this.getAccessToken();
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const now = Date.now() / 1000;
          const timeUntilExpiry = payload.exp - now;
          
          // Refresh token if it expires in the next 5 minutes (300 seconds)
          if (timeUntilExpiry < 300 && timeUntilExpiry > 0) {
            this.refreshAccessToken().catch(console.error);
          }
        } catch (error) {
          console.error('Error checking token expiry:', error);
        }
      }
    };

    // Check every minute
    setInterval(checkAndRefresh, 60 * 1000);
    
    // Check immediately
    checkAndRefresh();
  }

  /**
   * Logout and clear all authentication data
   */
  static async logout(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken();
      
      // Clear local data first
      this.clearAuthData();
      
      // Notify server (best effort)
      if (refreshToken) {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        }).catch(console.error); // Don't throw on logout API failure
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Ensure local data is cleared even if API call fails
      this.clearAuthData();
    }
  }
}

/**
 * Higher-order function to create API methods with automatic authentication
 */
export function createAuthenticatedAPI<T extends (...args: unknown[]) => Promise<unknown>>(
  apiMethod: T
): T {
  return (async (...args: unknown[]) => {
    try {
      return await apiMethod(...args);
    } catch (error) {
      // If it's an auth error and we haven't already tried refreshing
      if (error instanceof Error && error.message.includes('401')) {
        const refreshSuccess = await AuthMiddleware['refreshAccessToken']();
        if (refreshSuccess) {
          // Retry the original request
          return await apiMethod(...args);
        }
      }
      throw error;
    }
  }) as T;
}

/**
 * Auth guard for protecting routes/components
 */
export class AuthGuard {
  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return AuthMiddleware.getAuthState().isAuthenticated;
  }

  /**
   * Redirect to login if not authenticated
   */
  static requireAuth(redirectUrl = '/login'): boolean {
    if (!this.isAuthenticated()) {
      if (typeof window !== 'undefined') {
        window.location.href = redirectUrl;
      }
      return false;
    }
    return true;
  }

  /**
   * Get user from storage if authenticated
   */
  static getUser(): Record<string, unknown> | null {
    if (!this.isAuthenticated()) {
      return null;
    }
    
    const userString = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    return userString ? JSON.parse(userString) : null;
  }

  /**
   * Check if user has specific role
   */
  static hasRole(role: string): boolean {
    const user = this.getUser();
    return typeof user?.role === 'string' && user.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  static hasAnyRole(roles: string[]): boolean {
    const user = this.getUser();
    return typeof user?.role === 'string' && roles.includes(user.role);
  }
}

// Export instances for direct use
export const authMiddleware = AuthMiddleware;
export const authGuard = AuthGuard;