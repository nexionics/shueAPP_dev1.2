# Authentication API Test Suite

Comprehensive testing suite for the ShueApp Frontend Authentication API, ensuring reliable and secure user authentication flows.

## Overview

This test suite covers all aspects of the authentication system including user registration, login, token management, verification processes, and security middleware. The tests are built with **Vitest** and provide extensive coverage of both unit and integration scenarios.

## Test Structure

```
src/api/authentication/__tests__/
├── auth-api.test.ts          # Core authentication API tests
├── token-manager.test.ts     # JWT token management tests  
├── verification-api.test.ts  # Email/phone/seller verification tests
├── middleware.test.ts        # Authentication middleware tests
├── integration.test.ts       # End-to-end integration tests
├── test-runner.ts           # Test runner utilities
└── README.md               # This documentation
```

## Test Coverage

### 🔐 Core Authentication (`auth-api.test.ts`)
- **User Registration**: Account creation with validation
- **User Login**: Authentication with email/password
- **Password Management**: Forgot/reset/change password flows
- **Profile Management**: User profile retrieval and updates
- **Logout**: Session termination and cleanup
- **Error Handling**: Network errors, validation failures

### 🎫 Token Management (`token-manager.test.ts`)
- **Token Storage**: Local storage management
- **Token Validation**: JWT token verification
- **Token Refresh**: Automatic token renewal
- **Token Cleanup**: Logout token removal
- **Authentication State**: Login status checks

### ✅ Verification API (`verification-api.test.ts`)
- **Email Verification**: Email confirmation flows
- **Phone Verification**: SMS verification processes
- **Seller Verification**: Seller account verification
- **Verification Status**: Status checking and monitoring
- **Dual Endpoint Support**: New and legacy endpoint compatibility

### 🛡️ Middleware (`middleware.test.ts`)
- **Request Interceptors**: Automatic token attachment
- **Authentication Guards**: Role-based access control
- **Token Refresh Logic**: Automatic 401 retry with refresh
- **Error Handling**: Request/response error management
- **Protected Routes**: Route protection mechanisms

### 🔄 Integration Tests (`integration.test.ts`)
- **Complete Registration Flow**: End-to-end user onboarding
- **Login and Token Flow**: Full authentication lifecycle
- **Password Management Flow**: Complete password reset process
- **Profile Management Flow**: User profile operations
- **Error Handling Integration**: Cross-component error scenarios

## Running Tests

### Prerequisites

Ensure you have the required dependencies installed:

```bash
npm install vitest @vitest/ui jsdom @types/jest
```

### Basic Test Commands

```bash
# Run all authentication tests
npm run test src/api/authentication

# Run specific test file
npm run test src/api/authentication/__tests__/auth-api.test.ts

# Run tests in watch mode
npm run test src/api/authentication --watch

# Run tests with coverage
npm run test src/api/authentication --coverage
```

### Using the Test Runner

```bash
# Run all tests with detailed reporting
npx tsx src/api/authentication/__tests__/test-runner.ts all

# Run tests with coverage
npx tsx src/api/authentication/__tests__/test-runner.ts coverage

# Run in watch mode
npx tsx src/api/authentication/__tests__/test-runner.ts watch

# Validate test environment
npx tsx src/api/authentication/__tests__/test-runner.ts validate

# Show test statistics
npx tsx src/api/authentication/__tests__/test-runner.ts stats
```

## Test Configuration

### Vitest Setup

The tests use Vitest with the following configuration:

```typescript
// vitest.config.ts (recommended)
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

### Mock Configuration

All tests use comprehensive mocking for:

- **localStorage**: Complete storage API simulation
- **fetch**: HTTP request/response mocking
- **JWT tokens**: Token generation and validation
- **Network requests**: API endpoint simulation

## Test Scenarios

### Authentication Flow Tests

1. **Registration Process**
   ```typescript
   // Test user registration with all required fields
   const result = await AuthAPI.register({
     fullName: 'John Doe',
     username: 'johndoe',
     email: 'john@example.com',
     // ... other fields
   });
   ```

2. **Login Process**
   ```typescript
   // Test user login with valid credentials
   const result = await AuthAPI.login({
     email: 'john@example.com',
     password: 'securePassword123'
   });
   ```

3. **Token Management**
   ```typescript
   // Test token validation and refresh
   const isValid = await TokenManager.validateToken();
   const newToken = await TokenManager.refreshAccessToken();
   ```

### Error Handling Tests

- **Network Failures**: Simulated connection errors
- **Invalid Credentials**: Wrong email/password combinations  
- **Expired Tokens**: Token expiration scenarios
- **Validation Errors**: Invalid input data handling
- **Server Errors**: 500/503 error responses

### Security Tests

- **CSRF Protection**: Request token validation
- **XSS Prevention**: Input sanitization checks
- **Authentication Bypass**: Unauthorized access attempts
- **Token Security**: JWT manipulation detection

## Mock Data

### User Test Data

```typescript
const testUser = {
  userId: '123',
  email: 'test@example.com',
  username: 'testuser',
  firstName: 'Test',
  lastName: 'User',
  role: 'USER'
};
```

### Token Test Data

```typescript
const testTokens = {
  accessToken: 'eyJhbGciOiJIUzI1NiIs...',
  refreshToken: 'eyJhbGciOiJIUzI1NiIs...',
  expiresAt: '2023-12-31T23:59:59.000Z'
};
```

## Assertions and Expectations

### Success Scenarios

```typescript
// Successful operations
expect(result.success).toBe(true);
expect(result.user).toBeDefined();
expect(result.token).toBeTruthy();

// Token storage
expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', token);

// API calls
expect(fetch).toHaveBeenCalledWith(expectedUrl, expectedOptions);
```

### Error Scenarios

```typescript
// Failed operations
expect(result.success).toBe(false);
expect(result.error).toBeDefined();

// Error messages
expect(result.message).toBe('Invalid credentials');

// Token cleanup
expect(localStorage.removeItem).toHaveBeenCalledWith('accessToken');
```

## Best Practices

### Test Organization

1. **Descriptive Test Names**: Use clear, descriptive test descriptions
2. **Setup and Teardown**: Proper mock setup and cleanup
3. **Isolated Tests**: Each test should be independent
4. **Realistic Scenarios**: Test real-world usage patterns

### Mock Management

1. **Consistent Mocking**: Use same mock patterns across tests
2. **Mock Cleanup**: Clear mocks between tests
3. **Realistic Responses**: Use realistic API response data
4. **Error Simulation**: Test various error conditions

### Coverage Goals

- **Statements**: > 90%
- **Branches**: > 85%
- **Functions**: > 90%
- **Lines**: > 90%

## Debugging Tests

### Common Issues

1. **Mock Not Working**
   ```typescript
   // Ensure proper mock setup
   vi.clearAllMocks();
   mockFetch.mockResolvedValueOnce({...});
   ```

2. **LocalStorage Issues**
   ```typescript
   // Verify localStorage mock
   expect(mockLocalStorage.setItem).toHaveBeenCalled();
   ```

3. **Async Test Problems**
   ```typescript
   // Use proper async/await
   await expect(AuthAPI.login(data)).resolves.toEqual(expected);
   ```

### Debug Commands

```bash
# Run single test with verbose output
npm run test -- --reporter=verbose auth-api.test.ts

# Debug specific test case
npm run test -- --grep "should login successfully"

# Run tests with debug logging
DEBUG=1 npm run test
```

## Contributing

### Adding New Tests

1. Follow the existing test structure
2. Include both success and error scenarios
3. Add comprehensive mocking
4. Update this documentation

### Test Naming Convention

```typescript
describe('AuthAPI', () => {
  describe('login', () => {
    it('should login successfully with valid credentials', () => {
      // Test implementation
    });

    it('should handle invalid credentials error', () => {
      // Test implementation
    });
  });
});
```

## Integration with CI/CD

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Authentication Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:auth
      - run: npm run test:auth:coverage
```

### Coverage Reports

Tests generate coverage reports in multiple formats:
- **HTML**: `coverage/lcov-report/index.html`
- **LCOV**: `coverage/lcov.info`
- **JSON**: `coverage/coverage-final.json`

## Performance Considerations

- **Test Speed**: All tests complete in < 30 seconds
- **Memory Usage**: Efficient mock cleanup prevents leaks
- **Parallel Execution**: Tests can run in parallel safely
- **Resource Cleanup**: Proper cleanup after each test

## Security Testing

The test suite includes security-focused scenarios:

- **Input Validation**: SQL injection and XSS prevention
- **Authentication Bypass**: Unauthorized access attempts
- **Token Security**: JWT manipulation and expiration
- **CSRF Protection**: Cross-site request forgery prevention

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run all authentication tests
npm run test src/api/authentication

# 3. View coverage report
npm run test src/api/authentication --coverage
open coverage/lcov-report/index.html
```

For detailed test results and reporting, use the test runner:

```bash
npx tsx src/api/authentication/__tests__/test-runner.ts all
```

This comprehensive test suite ensures the ShueApp authentication system is robust, secure, and reliable across all user flows and edge cases.