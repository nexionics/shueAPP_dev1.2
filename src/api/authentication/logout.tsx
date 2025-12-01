/**
 * Logout and Authentication State API Functions
 * 
 * This module provides logout-specific API functions and authentication state management.
 * It re-exports functions from the centralized authentication API and middleware.
 */

import { AuthAPI, TokenManager } from './index';
import { AuthMiddleware, AuthGuard } from './middleware';
import type { ChangePasswordRequest } from './types';

// Re-export main logout function
export const logoutUser = AuthAPI.logout;

// Re-export token management functions
export const isLoggedIn = TokenManager.isLoggedIn;
export const clearAuthData = TokenManager.clearAuthData;

// Re-export password change function with simplified interface
export async function changePassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<{ success: boolean; message: string }> {
  const passwordData: ChangePasswordRequest = {
    currentPassword,
    newPassword,
    confirmPassword
  };
  return AuthAPI.changePassword(passwordData);
}

// Re-export middleware functions for authentication state
export const getAuthState = AuthMiddleware.getAuthState;
export const setupAutoRefresh = AuthMiddleware.setupAutoRefresh;

// Re-export auth guard functions
export const isAuthenticated = AuthGuard.isAuthenticated;
export const requireAuth = AuthGuard.requireAuth;
export const getUser = AuthGuard.getUser;
export const hasRole = AuthGuard.hasRole;
export const hasAnyRole = AuthGuard.hasAnyRole;

// Export types
export type { ChangePasswordRequest };