/**
 * Login API Functions
 * 
 * This module provides login-specific API functions.
 * It re-exports functions from the centralized authentication API for backward compatibility.
 */

import { AuthAPI, TokenManager } from './index';
import type { LoginRequest, LoginResponse } from './types';

// Re-export main functions for backward compatibility
export const loginUser = AuthAPI.login;
export const getAccessToken = TokenManager.getAccessToken;
export const getRefreshToken = TokenManager.getRefreshToken;
export const getStoredUser = TokenManager.getStoredUser;
export const refreshAccessToken = TokenManager.refreshAccessToken;
export const validateToken = TokenManager.validateToken;

// Additional login-specific utilities
export { TokenManager, AuthAPI };
export type { LoginRequest, LoginResponse };