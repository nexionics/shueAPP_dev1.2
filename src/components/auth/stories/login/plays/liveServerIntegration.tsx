import { within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { checkServerHealth } from '@/api/authentication'

// Test configuration
const TEST_CONFIG = {
  get API_URL() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) {
      throw new Error('NEXT_PUBLIC_API_URL environment variable is not configured')
    }
    return apiUrl
  },
  TEST_CREDENTIALS: {
    valid: {
      email: 'test@shueapp.com',
      password: 'password123'
    }
  }
}

export const liveServerIntegrationPlay = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement)
  const user = userEvent.setup()

  // Step 1: Check if live server is available
  console.log('🔍 Checking live server availability...')
  const serverAvailable = await checkServerHealth()
  
  if (!serverAvailable) {
    console.log('❌ Live server is not available. Skipping live integration test.')
    console.log('💡 To run this test:')
    console.log('   1. Start your backend server')
    console.log('   2. Ensure test credentials exist')
    console.log('   3. Check NEXT_PUBLIC_API_URL environment variable')
    
    // Show message in the UI
    const statusDiv = document.createElement('div')
    statusDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #fff3cd;
      border: 2px solid #ffc107;
      border-radius: 8px;
      padding: 16px;
      max-width: 300px;
      z-index: 9999;
      font-family: system-ui;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `
    statusDiv.innerHTML = `
      <strong style="color: #856404;">⚠️ Live Server Test</strong><br>
      <span style="color: #856404;">Backend server not available</span><br>
      <small style="color: #6c757d;">Check console for details</small>
    `
    document.body.appendChild(statusDiv)
    
    setTimeout(() => {
      if (statusDiv.parentNode) {
        statusDiv.parentNode.removeChild(statusDiv)
      }
    }, 5000)
    
    return
  }

  console.log('✅ Live server is available! Running integration test...')
  console.log(`📍 API Endpoint: ${TEST_CONFIG.API_URL}`)
  
  // Show server status in UI
  const statusDiv = document.createElement('div')
  statusDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #d1edff;
    border: 2px solid #0d6efd;
    border-radius: 8px;
    padding: 16px;
    max-width: 300px;
    z-index: 9999;
    font-family: system-ui;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `
  statusDiv.innerHTML = `
    <strong style="color: #084298;">🌐 Live Server Test</strong><br>
    <span style="color: #084298;">Connecting to real API...</span><br>
    <small style="color: #6c757d;">${TEST_CONFIG.API_URL}</small>
  `
  document.body.appendChild(statusDiv)

  try {
    // Step 2: Open login modal
    console.log('📂 Opening login modal...')
    const openButton = canvas.getByText('Open Login Modal (Container)')
    await user.click(openButton)

    // Step 3: Wait for modal and fill form with test credentials
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('📝 Filling login form with test credentials...')
    const emailInput = await canvas.findByTestId('email-input')
    const passwordInput = await canvas.findByTestId('password-input')
    
    await user.clear(emailInput)
    await user.type(emailInput, TEST_CONFIG.TEST_CREDENTIALS.valid.email)
    
    await user.clear(passwordInput)
    await user.type(passwordInput, TEST_CONFIG.TEST_CREDENTIALS.valid.password)
    
    console.log(`📧 Email: ${TEST_CONFIG.TEST_CREDENTIALS.valid.email}`)
    console.log('🔐 Password: [PROTECTED]')

    // Update status
    statusDiv.innerHTML = `
      <strong style="color: #084298;">🌐 Live Server Test</strong><br>
      <span style="color: #084298;">Submitting credentials...</span><br>
      <small style="color: #6c757d;">Real API request in progress</small>
    `

    // Step 4: Submit form and wait for real API response
    console.log('🚀 Submitting form to live server...')
    const submitButton = canvas.getByRole('button', { name: /sign in/i })
    await user.click(submitButton)

    // Step 5: Wait for authentication to complete
    console.log('⏳ Waiting for authentication response...')
    await new Promise(resolve => setTimeout(resolve, 3000)) // Give time for real API call
    
    // Step 6: Verify successful authentication by checking for tokens
    try {
      // Check if access token is stored (using correct storage keys)
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')
      const user = localStorage.getItem('user')
      
      if (!accessToken) {
        throw new Error('No access token found in localStorage after login')
      }
      
      console.log('✅ Access token found:', accessToken.substring(0, 20) + '...')
      
      if (refreshToken) {
        console.log('✅ Refresh token found:', refreshToken.substring(0, 20) + '...')
      }
      
      if (user) {
        try {
          const userData = JSON.parse(user)
          console.log('✅ User data found:', userData.email || userData.username || 'Unknown user')
        } catch {
          console.log('✅ User data found (raw):', user.substring(0, 50) + '...')
        }
      }
      
      // Verify token is valid JWT format (has 3 parts separated by dots)
      const tokenParts = accessToken.split('.')
      if (tokenParts.length !== 3) {
        throw new Error('Access token is not a valid JWT format')
      }
      
      console.log('🎉 Live authentication successful!')
      console.log('✅ Valid JWT tokens are stored in localStorage')
      
    } catch (error) {
      console.error('❌ Authentication verification failed:', error)
      
      // Check for error messages in the UI
      const errorElements = canvas.queryAllByText(/error|invalid|failed/i)
      if (errorElements.length > 0) {
        console.log('📋 Error messages found in UI:', errorElements.map(el => el.textContent))
      }
      
      // Log current localStorage state for debugging (using correct keys)
      console.log('📋 Current localStorage state:')
      console.log('  - accessToken:', localStorage.getItem('accessToken') ? 'Present' : 'Missing')
      console.log('  - refreshToken:', localStorage.getItem('refreshToken') ? 'Present' : 'Missing')
      console.log('  - user:', localStorage.getItem('user') ? 'Present' : 'Missing')
      
      // Also check for alternative key formats in case there's inconsistency
      console.log('📋 Alternative key formats:')
      console.log('  - access_token:', localStorage.getItem('access_token') ? 'Present' : 'Missing')
      console.log('  - refresh_token:', localStorage.getItem('refresh_token') ? 'Present' : 'Missing')
      
      throw error
    }
    
  } catch (error) {
    console.error('💥 Live server integration test failed:', error)
    throw error
  } finally {
    // Clean up status div after delay
    setTimeout(() => {
      if (statusDiv.parentNode) {
        statusDiv.parentNode.removeChild(statusDiv)
      }
    }, 8000)
  }
}

export const liveServerIntegrationDecorator = (Story: any) => {
  // Use the REAL AuthAPI (no mocking) for live integration
  // This means actual network calls will be made
  return <Story />
}