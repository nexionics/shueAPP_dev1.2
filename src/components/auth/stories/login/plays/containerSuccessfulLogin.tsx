import { within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthAPI } from '@/api/authentication'

export const containerSuccessfulLoginPlay = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement)
  const user = userEvent.setup()

  // Step 1: Click the "Open Login Modal" button
  const openButton = canvas.getByText('Open Login Modal (Container)')
  await user.click(openButton)

  // Step 2: Wait for modal to appear and log what's available
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Step 3: Find form inputs using reliable selectors for our basic HTML structure
  const emailInput = await canvas.findByTestId('email-input')
  const passwordInput = await canvas.findByTestId('password-input')
  
  console.log('Found email input:', emailInput.tagName, (emailInput as HTMLInputElement).type)
  console.log('Found password input:', passwordInput.tagName, (passwordInput as HTMLInputElement).type)

  // Step 4: Fill in the form
  await user.clear(emailInput)
  await user.type(emailInput, 'test@shueapp.com')
  
  await user.clear(passwordInput)
  await user.type(passwordInput, 'password123')
}

export const containerSuccessfulLoginDecorator = (Story: any) => {
  // Mock successful login
  AuthAPI.login = async () => ({
    success: true,
    message: 'Login successful',
    user: {
      userId: '123',
      email: 'test@shueapp.com',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      role: 'USER'
    },
    token: 'mock-access-token',
    refreshToken: 'mock-refresh-token'
  })
  return <Story />
}