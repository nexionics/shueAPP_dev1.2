# LoginModal - Container/Presentation Pattern Stories

This document describes the Storybook stories for the LoginModal component, which demonstrates the Container/Presentation pattern implementation.

## 📋 Available Stories

### Container Component Stories

These stories test the complete LoginModalContainer component with full authentication logic:

#### 1. **ContainerSuccessfulLogin**
- **Purpose**: Tests successful authentication flow
- **Credentials**: `test@shueapp.com` / `password123`
- **Expected Result**: User is authenticated and auth status shows "Authenticated: Yes"

#### 2. **ContainerFailedLogin** 
- **Purpose**: Tests error handling for invalid credentials
- **Credentials**: Any email/password combination
- **Expected Result**: Error message appears, user remains unauthenticated

#### 3. **ContainerSlowLogin**
- **Purpose**: Tests loading states during API delays
- **Credentials**: `slow@shueapp.com` / `password123`
- **Expected Result**: Loading spinner shows for 3 seconds, then successful login

#### 4. **ContainerNetworkError**
- **Purpose**: Tests network error handling
- **Credentials**: Any email/password combination  
- **Expected Result**: Network error message appears, modal stays open for retry

#### 5. **ComparisonDemo**
- **Purpose**: Side-by-side comparison of Container vs Pure components
- **Container credentials**: `test@shueapp.com` / `password123`
- **Pure credentials**: `demo@example.com` / `demo123`

### Pure Component Stories

These stories test the LoginModalPure component in isolation with different UI states:

- **PureDefault**: Clean form with no data or errors
- **PurePreFilled**: Form with pre-filled email and password
- **PureWithError**: Form showing error state
- **PureLoading**: Form in loading/submitting state  
- **PureNetworkError**: Form showing network error message

## 🎯 How to Test Interactions

### Manual Testing Steps

1. **Open Storybook**: Navigate to `http://localhost:6006`
2. **Select Story**: Choose any Container story from the sidebar
3. **Follow Instructions**: Each story includes detailed test instructions in the docs panel
4. **Interact**: Click buttons, fill forms, observe state changes
5. **Verify Results**: Check authentication status and error messages

### Key Testing Scenarios

```bash
# Start Storybook
npm run storybook

# Navigate to Authentication/LoginModal/Container in the sidebar
# Try each story and follow the manual test instructions
```

## 🏗️ Architecture Benefits

### Container/Presentation Pattern

**Container Component (`LoginModalContainer`)**:
- Manages authentication state
- Handles API calls  
- Manages form state
- Provides error handling
- Connects to authentication context

**Pure Component (`LoginModalPure`)**:
- Only handles UI rendering
- Receives all data via props
- No side effects or API calls
- Easily testable in isolation
- Reusable with different data sources

### Testing Benefits

1. **Isolated UI Testing**: Pure component can be tested with any state combination
2. **Integration Testing**: Container component tests full user workflows  
3. **Error Simulation**: Easy to mock different API responses
4. **Loading States**: Simple to test loading and async behaviors
5. **Visual Regression**: Consistent UI states for visual testing

## 🔧 Development Workflow

### Adding New Stories

1. **Pure Component Story**: Test new UI states by adding props to `PureComponentDemo`
2. **Container Story**: Test new business logic by mocking `AuthAPI.login`
3. **Integration Story**: Combine both for end-to-end scenarios

### Example: Adding a "Password Reset" Story

```typescript
export const ContainerPasswordReset: ContainerStory = {
  args: {
    scenario: 'Container - Password Reset Flow'
  },
  decorators: [(Story) => {
    // Mock password reset API
    AuthAPI.resetPassword = async () => ({ success: true })
    return <Story />
  }]
}
```

## 📚 Related Files

- **Component**: `/src/components/auth/login-modal.tsx`
- **Stories**: `/src/stories/LoginModal.stories.tsx`  
- **Context**: `/src/contexts/auth-context.tsx`
- **API**: `/src/api/authentication/`

## 🚀 Next Steps

1. Add automated visual regression tests
2. Create interaction tests with Testing Library
3. Add accessibility testing scenarios
4. Implement error boundary testing
5. Add mobile responsive testing stories