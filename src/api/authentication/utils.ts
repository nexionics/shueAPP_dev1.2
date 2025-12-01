/**
 * API Utility Functions
 * 
 * Common utilities for API operations including health checks,
 * server availability, and other shared functionality.
 */

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Check if the backend server is available and responding
 * @returns Promise<boolean> - true if server is healthy, false otherwise
 */
export const checkServerHealth = async (): Promise<boolean> => {
  if (!API_BASE_URL) {
    console.warn('NEXT_PUBLIC_API_URL is not configured')
    return false
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/health`)
    return response.ok
  } catch {
    return false
  }
}

/**
 * Check authentication API health specifically
 * @returns Promise<boolean> - true if auth service is healthy, false otherwise
 */
export const checkAuthHealth = async (): Promise<boolean> => {
  if (!API_BASE_URL) {
    console.warn('NEXT_PUBLIC_API_URL is not configured')
    return false
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/health`)
    return response.ok
  } catch {
    return false
  }
}

/**
 * Get API configuration details
 */
export const getApiConfig = () => ({
  baseUrl: API_BASE_URL,
  authUrl: API_BASE_URL ? `${API_BASE_URL}/api/auth` : undefined,
  healthEndpoint: API_BASE_URL ? `${API_BASE_URL}/health` : undefined,
  authHealthEndpoint: API_BASE_URL ? `${API_BASE_URL}/api/auth/health` : undefined
})