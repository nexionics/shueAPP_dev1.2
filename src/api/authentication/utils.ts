/**
 * API Utility Functions
 * 
 * Common utilities for API operations including health checks,
 * server availability, and other shared functionality.
 */

// API Configuration
const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const API_BASE = `${API_ORIGIN.replace(/\/$/, '')}/api`

/**
 * Check if the backend server is available and responding
 * @returns Promise<boolean> - true if server is healthy, false otherwise
 */
export const checkServerHealth = async (): Promise<boolean> => {
  if (!API_ORIGIN) {
    console.warn('NEXT_PUBLIC_API_URL is not configured')
    return false
  }
  
  try {
    const response = await fetch(`${API_ORIGIN.replace(/\/$/, '')}/health`)
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
  if (!API_ORIGIN) {
    console.warn('NEXT_PUBLIC_API_URL is not configured')
    return false
  }
  
  try {
    const response = await fetch(`${API_BASE}/auth/health`)
    return response.ok
  } catch {
    return false
  }
}

/**
 * Get API configuration details
 */
export const getApiConfig = () => ({
  baseUrl: API_ORIGIN,
  authUrl: `${API_BASE}/auth`,
  healthEndpoint: `${API_ORIGIN.replace(/\/$/, '')}/health`,
  authHealthEndpoint: `${API_BASE}/auth/health`
})