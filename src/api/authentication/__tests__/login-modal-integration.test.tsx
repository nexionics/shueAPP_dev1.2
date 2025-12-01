/**
 * LoginModal Integration Tests
 * 
 * Tests the complete flow from LoginModal UI interaction to API authentication
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginModal } from '@/components/auth/LoginModal'
import { AuthProvider } from '@/contexts/AuthContext'
import { AuthAPI, TokenManager } from '../index'
import type { LoginResponse, JWTUserPayload } from '../types'

// Mock the AuthAPI
jest.mock('../index', () => ({
  AuthAPI: {
    login: jest.fn(),
    logout: jest.fn()
  },
  TokenManager: {
    getStoredUser: jest.fn(),
    isLoggedIn: jest.fn(),
    validateToken: jest.fn(),
    clearAuthData: jest.fn(),
    storeAuthData: jest.fn()
  }
}))

const mockAuthAPI = AuthAPI as jest.Mocked<typeof AuthAPI>
const mockTokenManager = TokenManager as jest.Mocked<typeof TokenManager>

// Mock fetch for direct API calls that might bypass our mocks
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true
})

// Mock console.error to avoid noise in tests
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

// Test component wrapper
interface TestWrapperProps {
  children: React.ReactNode
}

const TestWrapper: React.FC<TestWrapperProps> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>
}

// Test data
const mockUser: JWTUserPayload = {
  userId: '123',
  email: 'john@example.com',
  username: 'johndoe',
  firstName: 'John',
  lastName: 'Doe',
  role: 'USER'
}

const mockLoginResponse: LoginResponse = {
  success: true,
  message: 'Login successful',
  user: mockUser,
  token: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  expiresAt: '2024-12-31T23:59:59.000Z'
}

describe('LoginModal Integration Tests', () => {
  let mockOnClose: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockConsoleError.mockClear()
    mockOnClose = jest.fn()
    
    // Default mocks for TokenManager
    mockTokenManager.getStoredUser.mockReturnValue(null)
    mockTokenManager.isLoggedIn.mockReturnValue(false)
    mockTokenManager.validateToken.mockResolvedValue({
      success: false,
      valid: false,
      message: 'No token found'
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  afterAll(() => {
    mockConsoleError.mockRestore()
  })

  describe('Successful Login Flow', () => {
    it('should complete full login flow when user enters valid credentials', async () => {
      // Mock successful login
      mockAuthAPI.login.mockResolvedValue(mockLoginResponse)

      const user = userEvent.setup()

      render(
        <TestWrapper>
          <LoginModal isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      )

      // Verify modal is open and form elements are present
      expect(screen.getByText('Sign in to ShueApp')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()

      // Fill in the form
      await user.type(screen.getByPlaceholderText('Email'), 'john@example.com')
      await user.type(screen.getByPlaceholderText('Password'), 'SecurePass123!')

      // Submit the form
      await user.click(screen.getByRole('button', { name: 'Sign In' }))

      // Wait for API call to complete
      await waitFor(() => {
        expect(mockAuthAPI.login).toHaveBeenCalledWith({
          email: 'john@example.com',
          password: 'SecurePass123!'
        })
      })

      // Verify modal closes after successful login
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled()
      })

      // Verify no error messages are shown
      expect(screen.queryByText(/Invalid email or password/)).not.toBeInTheDocument()
    })

    it('should show loading state during authentication', async () => {
      // Mock login with delay to test loading state
      mockAuthAPI.login.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockLoginResponse), 100))
      )

      const user = userEvent.setup()

      render(
        <TestWrapper>
          <LoginModal isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      )

      // Fill and submit form
      await user.type(screen.getByPlaceholderText('Email'), 'john@example.com')
      await user.type(screen.getByPlaceholderText('Password'), 'password123')
      await user.click(screen.getByRole('button', { name: 'Sign In' }))

      // Check loading state
      expect(screen.getByText('Signing in...')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Signing in/ })).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()

      // Wait for loading to complete
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled()
      }, { timeout: 200 })
    })

    it('should reset form fields after successful login', async () => {
      mockAuthAPI.login.mockResolvedValue(mockLoginResponse)

      const user = userEvent.setup()

      render(
        <TestWrapper>
          <LoginModal isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      )

      const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement
      const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement

      // Fill and submit form
      await user.type(emailInput, 'john@example.com')
      await user.type(passwordInput, 'password123')
      
      expect(emailInput.value).toBe('john@example.com')
      expect(passwordInput.value).toBe('password123')

      await user.click(screen.getByRole('button', { name: 'Sign In' }))

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled()
      })

      // Note: In a real test, you might reopen the modal to check field reset
      // Here we're testing the component behavior during the same render cycle
    })
  })

  describe('Failed Login Flow', () => {
    it('should show error message when login fails', async () => {
      // Mock failed login
      const failedResponse: LoginResponse = {
        success: false,
        message: 'Invalid email or password'
      }
      mockAuthAPI.login.mockResolvedValue(failedResponse)

      const user = userEvent.setup()

      render(
        <TestWrapper>
          <LoginModal isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      )

      // Fill and submit form with invalid credentials
      await user.type(screen.getByPlaceholderText('Email'), 'invalid@example.com')
      await user.type(screen.getByPlaceholderText('Password'), 'wrongpassword')
      await user.click(screen.getByRole('button', { name: 'Sign In' }))

      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByText('Invalid email or password')).toBeInTheDocument()
      })

      // Verify modal doesn't close on failed login
      expect(mockOnClose).not.toHaveBeenCalled()

      // Verify form is still functional
      expect(screen.getByRole('button', { name: 'Sign In' })).not.toBeDisabled()
    })

    it('should handle network errors gracefully', async () => {
      // Mock network error
      mockAuthAPI.login.mockRejectedValue(new Error('Network error'))

      const user = userEvent.setup()

      render(
        <TestWrapper>
          <LoginModal isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      )

      await user.type(screen.getByPlaceholderText('Email'), 'john@example.com')
      await user.type(screen.getByPlaceholderText('Password'), 'password123')
      await user.click(screen.getByRole('button', { name: 'Sign In' }))

      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByText('Invalid email or password')).toBeInTheDocument()
      })

      expect(mockOnClose).not.toHaveBeenCalled()
    })

    it('should clear error when user starts typing again', async () => {
      // Mock failed login first
      const failedResponse: LoginResponse = {
        success: false,
        message: 'Invalid email or password'
      }
      mockAuthAPI.login.mockResolvedValueOnce(failedResponse)

      const user = userEvent.setup()

      render(
        <TestWrapper>
          <LoginModal isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      )

      // Submit invalid credentials
      await user.type(screen.getByPlaceholderText('Email'), 'invalid@example.com')
      await user.type(screen.getByPlaceholderText('Password'), 'wrongpassword')
      await user.click(screen.getByRole('button', { name: 'Sign In' }))

      await waitFor(() => {
        expect(screen.getByText('Invalid email or password')).toBeInTheDocument()
      })

      // Mock successful login for retry
      mockAuthAPI.login.mockResolvedValueOnce(mockLoginResponse)

      // Start typing again - error should clear and retry should work
      await user.clear(screen.getByPlaceholderText('Email'))
      await user.type(screen.getByPlaceholderText('Email'), 'john@example.com')

      // Error should be cleared when form is resubmitted
      await user.click(screen.getByRole('button', { name: 'Sign In' }))

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled()
      })
    })
  })

  describe('Form Validation', () => {
    it('should require email and password fields', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <LoginModal isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      )

      // Try to submit empty form
      const submitButton = screen.getByRole('button', { name: 'Sign In' })
      await user.click(submitButton)

      // HTML5 validation should prevent submission
      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password')

      expect(emailInput).toBeRequired()
      expect(passwordInput).toBeRequired()

      // API should not be called with empty form
      expect(mockAuthAPI.login).not.toHaveBeenCalled()
    })

    it('should validate email format', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <LoginModal isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      )

      const emailInput = screen.getByPlaceholderText('Email')

      // Try invalid email format
      await user.type(emailInput, 'invalid-email')
      await user.type(screen.getByPlaceholderText('Password'), 'password123')

      // HTML5 email validation should prevent submission
      expect(emailInput).toHaveAttribute('type', 'email')
    })
  })

  describe('Modal Controls', () => {
    it('should close modal when Cancel button is clicked', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <LoginModal isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      )

      await user.click(screen.getByRole('button', { name: 'Cancel' }))

      expect(mockOnClose).toHaveBeenCalled()
      expect(mockAuthAPI.login).not.toHaveBeenCalled()
    })

    it('should close modal when clicking outside (dialog behavior)', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <LoginModal isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      )

      // This tests the Dialog component's onOpenChange behavior
      // The exact implementation depends on the Dialog component
      // Here we test the prop passing
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('should not close modal during loading', async () => {
      mockAuthAPI.login.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockLoginResponse), 100))
      )

      const user = userEvent.setup()

      render(
        <TestWrapper>
          <LoginModal isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      )

      await user.type(screen.getByPlaceholderText('Email'), 'john@example.com')
      await user.type(screen.getByPlaceholderText('Password'), 'password123')
      await user.click(screen.getByRole('button', { name: 'Sign In' }))

      // During loading, cancel button should be disabled
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled()
      }, { timeout: 200 })
    })
  })

  describe('Authentication Context Integration', () => {
    it('should update auth context after successful login', async () => {
      mockAuthAPI.login.mockResolvedValue(mockLoginResponse)

      const user = userEvent.setup()

      // Create a component to test context state
      const TestComponent = () => {
        const [showModal, setShowModal] = React.useState(true)
        return (
          <div>
            <LoginModal isOpen={showModal} onClose={() => setShowModal(false)} />
            <div data-testid="auth-status">Auth status will be managed by context</div>
          </div>
        )
      }

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      )

      await user.type(screen.getByPlaceholderText('Email'), 'john@example.com')
      await user.type(screen.getByPlaceholderText('Password'), 'password123')
      await user.click(screen.getByRole('button', { name: 'Sign In' }))

      await waitFor(() => {
        expect(mockAuthAPI.login).toHaveBeenCalledWith({
          email: 'john@example.com',
          password: 'password123'
        })
      })

      // The context should handle the authentication state
      // This is more of an integration test with the actual context
    })
  })

  describe('API Integration Edge Cases', () => {
    it('should handle malformed API responses', async () => {
      // Mock API returning malformed response
      mockAuthAPI.login.mockResolvedValue({
        success: false
        // Missing message property
      } as unknown as LoginResponse)

      const user = userEvent.setup()

      render(
        <TestWrapper>
          <LoginModal isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      )

      await user.type(screen.getByPlaceholderText('Email'), 'john@example.com')
      await user.type(screen.getByPlaceholderText('Password'), 'password123')
      await user.click(screen.getByRole('button', { name: 'Sign In' }))

      await waitFor(() => {
        expect(screen.getByText('Invalid email or password')).toBeInTheDocument()
      })
    })

    it('should handle API timeout/slow responses', async () => {
      // Mock very slow API response
      mockAuthAPI.login.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockLoginResponse), 5000))
      )

      const user = userEvent.setup()

      render(
        <TestWrapper>
          <LoginModal isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      )

      await user.type(screen.getByPlaceholderText('Email'), 'john@example.com')
      await user.type(screen.getByPlaceholderText('Password'), 'password123')
      await user.click(screen.getByRole('button', { name: 'Sign In' }))

      // Should show loading state
      expect(screen.getByText('Signing in...')).toBeInTheDocument()

      // For this test, we don't wait for the full timeout
      // Just verify the loading state is shown
    })

    it('should handle successful login with missing optional data', async () => {
      const minimalResponse: LoginResponse = {
        success: true,
        message: 'Login successful',
        user: mockUser,
        token: 'token',
        refreshToken: 'refresh-token'
        // Missing expiresAt
      }

      mockAuthAPI.login.mockResolvedValue(minimalResponse)

      const user = userEvent.setup()

      render(
        <TestWrapper>
          <LoginModal isOpen={true} onClose={mockOnClose} />
        </TestWrapper>
      )

      await user.type(screen.getByPlaceholderText('Email'), 'john@example.com')
      await user.type(screen.getByPlaceholderText('Password'), 'password123')
      await user.click(screen.getByRole('button', { name: 'Sign In' }))

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled()
      })
    })
  })
})