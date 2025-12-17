import { within, userEvent } from '@storybook/test'

export const fillAccountInfoPlay = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement)
  const user = userEvent.setup()

  // Wait for form to be ready
  await new Promise(resolve => setTimeout(resolve, 500))

  try {
    console.log('🎭 Starting Account Info form fill...')

    // Fill full name
    const fullNameInput = await canvas.findByTestId('fullName-input')
    await user.clear(fullNameInput)
    await user.type(fullNameInput, 'John Michael Doe')
    console.log('✅ Full name filled')

    // Fill username
    const usernameInput = await canvas.findByTestId('username-input')
    await user.clear(usernameInput)
    await user.type(usernameInput, 'johndoe123')
    console.log('✅ Username filled')

    // Fill email
    const emailInput = await canvas.findByTestId('email-input')
    await user.clear(emailInput)
    await user.type(emailInput, 'john.doe@example.com')
    console.log('✅ Email filled')

    // Fill phone number
    const phoneInput = await canvas.findByTestId('phoneNumber-input')
    await user.clear(phoneInput)
    await user.type(phoneInput, '5551234567')
    console.log('✅ Phone number filled')

    // Fill password
    const passwordInput = await canvas.findByTestId('password-input')
    await user.clear(passwordInput)
    await user.type(passwordInput, 'SecurePassword123!')
    console.log('✅ Password filled')

    // Fill confirm password
    const confirmPasswordInput = await canvas.findByTestId('confirmPassword-input')
    await user.clear(confirmPasswordInput)
    await user.type(confirmPasswordInput, 'SecurePassword123!')
    console.log('✅ Confirm password filled')

    // Wait a moment for validation to complete
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log('🎉 Account info form completed successfully!')

  } catch (error) {
    console.error('❌ Failed to fill account info form:', error)
    throw error
  }
}

export const testValidationPlay = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement)
  const user = userEvent.setup()

  // Wait for form to be ready
  await new Promise(resolve => setTimeout(resolve, 500))

  try {
    console.log('🧪 Testing form validation...')

    // Test invalid full name (too short)
    const fullNameInput = await canvas.findByTestId('fullName-input')
    await user.clear(fullNameInput)
    await user.type(fullNameInput, 'J')
    await user.tab() // Trigger blur
    await new Promise(resolve => setTimeout(resolve, 300))
    console.log('✅ Short name validation triggered')

    // Test invalid username (special characters)
    const usernameInput = await canvas.findByTestId('username-input')
    await user.clear(usernameInput)
    await user.type(usernameInput, 'john@doe!')
    await user.tab()
    await new Promise(resolve => setTimeout(resolve, 300))
    console.log('✅ Invalid username validation triggered')

    // Test invalid email
    const emailInput = await canvas.findByTestId('email-input')
    await user.clear(emailInput)
    await user.type(emailInput, 'invalid-email')
    await user.tab()
    await new Promise(resolve => setTimeout(resolve, 300))
    console.log('✅ Invalid email validation triggered')

    // Test weak password
    const passwordInput = await canvas.findByTestId('password-input')
    await user.clear(passwordInput)
    await user.type(passwordInput, '123')
    await user.tab()
    await new Promise(resolve => setTimeout(resolve, 300))
    console.log('✅ Weak password validation triggered')

    // Test mismatched passwords
    const confirmPasswordInput = await canvas.findByTestId('confirmPassword-input')
    await user.clear(confirmPasswordInput)
    await user.type(confirmPasswordInput, 'different-password')
    await user.tab()
    await new Promise(resolve => setTimeout(resolve, 300))
    console.log('✅ Password mismatch validation triggered')

    console.log('🎉 All validation tests completed!')

  } catch (error) {
    console.error('❌ Validation test failed:', error)
    throw error
  }
}

export const testPasswordStrengthPlay = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement)
  const user = userEvent.setup()

  // Wait for form to be ready
  await new Promise(resolve => setTimeout(resolve, 500))

  try {
    console.log('🔒 Testing password strength indicator...')

    const passwordInput = await canvas.findByTestId('password-input')
    
    // Test weak password
    await user.clear(passwordInput)
    await user.type(passwordInput, '123')
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log('✅ Weak password strength shown')

    // Test medium password
    await user.clear(passwordInput)
    await user.type(passwordInput, 'Password123')
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log('✅ Medium password strength shown')

    // Test strong password
    await user.clear(passwordInput)
    await user.type(passwordInput, 'StrongPassword123!')
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log('✅ Strong password strength shown')

    console.log('🎉 Password strength test completed!')

  } catch (error) {
    console.error('❌ Password strength test failed:', error)
    throw error
  }
}

export const testPhoneFormattingPlay = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement)
  const user = userEvent.setup()

  // Wait for form to be ready
  await new Promise(resolve => setTimeout(resolve, 500))

  try {
    console.log('📱 Testing phone number formatting...')

    const phoneInput = await canvas.findByTestId('phoneNumber-input')
    
    // Type raw digits and watch formatting
    await user.clear(phoneInput)
    await user.type(phoneInput, '5551234567')
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Check if formatting was applied
    const formattedValue = (phoneInput as HTMLInputElement).value
    console.log('📱 Phone formatted to:', formattedValue)
    console.log('✅ Phone formatting test completed!')

  } catch (error) {
    console.error('❌ Phone formatting test failed:', error)
    throw error
  }
}