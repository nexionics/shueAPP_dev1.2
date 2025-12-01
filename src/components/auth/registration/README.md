# Registration System

A comprehensive, accessible, and user-friendly multi-step registration system for ShueApp's sneaker marketplace.

## Overview

The registration system consists of a 4-step wizard that guides users through creating their ShueApp account with proper validation, error handling, and success feedback.

## Architecture

```
src/components/auth/registration/
├── RegistrationModal.tsx          # Main modal component
├── AccountInfoStep.tsx            # Step 1: Personal account info
├── LocationInfoStep.tsx           # Step 2: Location details
├── PreferencesStep.tsx           # Step 3: Optional preferences
├── LegalStep.tsx                 # Step 4: Terms and privacy
├── components/
│   ├── CountrySelect.tsx         # Country dropdown
│   ├── StateSelect.tsx          # State/province dropdown
│   └── FavoriteBrandsSelect.tsx # Multi-select for brands
├── types.ts                     # TypeScript interfaces
├── validation.ts               # Validation utilities
├── index.ts                   # Public exports
└── *.stories.tsx             # Storybook documentation
```

## Registration Flow

### Step 1: Account Information
- **Full Name**: Real name validation (2-100 characters)
- **Username**: Unique identifier (3-30 characters, alphanumeric + underscores)
- **Email**: Valid email format with availability checking
- **Phone Number**: Formatted US phone number with validation
- **Password**: Strong password requirements with real-time feedback
- **Confirm Password**: Matching password validation

### Step 2: Location Details
- **Country**: Dropdown with all countries
- **State/Province**: Dynamic dropdown based on selected country
- **City**: Text input with validation
- **ZIP/Postal Code**: Format validation
- **Location Permission**: Optional geolocation for auto-fill

### Step 3: Preferences (Optional)
- **Shoe Size**: Dropdown with common sizes
- **Favorite Brands**: Multi-select with popular sneaker brands
- **Buying Preference**: Radio buttons (buying/selling/both)

### Step 4: Terms & Privacy
- **Terms of Service**: Required agreement with modal preview
- **Privacy Policy**: Required agreement with modal preview
- **Marketing Opt-in**: Optional promotional emails consent

## Usage

### Basic Implementation

```tsx
import { RegistrationModal } from '@/components/auth/registration'

function App() {
  const [showRegistration, setShowRegistration] = useState(false)

  const handleRegistrationSuccess = (userData: RegistrationFormData) => {
    console.log('New user registered:', userData)
    // Handle post-registration logic
  }

  return (
    <RegistrationModal
      isOpen={showRegistration}
      onClose={() => setShowRegistration(false)}
      onSuccess={handleRegistrationSuccess}
      onSwitchToLogin={() => switchToLogin()}
    />
  )
}
```

### Individual Step Usage

```tsx
import { AccountInfoStep } from '@/components/auth/registration'

function CustomRegistration() {
  return (
    <AccountInfoStep
      formData={formData}
      validationState={validationState}
      onFieldChange={handleFieldChange}
      onFieldBlur={handleFieldBlur}
      onNext={handleNext}
      onPrevious={handlePrevious}
      isLoading={isLoading}
    />
  )
}
```

## Validation

The system includes comprehensive validation with real-time feedback:

### Built-in Validators
- **Email**: RFC compliant email format
- **Password**: Minimum 8 characters with uppercase, lowercase, number, special char
- **Phone**: US format with automatic formatting
- **Required Fields**: All required fields validated on blur and submit
- **Optional Fields**: Preferences are validated but not required

### Custom Validation

```tsx
import { validateField } from '@/components/auth/registration'

const validation = validateField('email', 'user@example.com', formData)
// Returns: { isValid: boolean, error?: string, isRequired: boolean, hasBeenTouched: boolean }
```

## Features

### 🔒 Security
- Password strength meter with real-time feedback
- Input sanitization to prevent XSS
- Form validation on both client and server
- Secure data handling practices

### ♿ Accessibility
- WCAG 2.1 AA compliant
- Full keyboard navigation support
- Screen reader friendly with proper ARIA labels
- High contrast mode support
- Focus management between steps

### 📱 Mobile-Friendly
- Responsive design for all screen sizes
- Touch-optimized form controls
- Mobile keyboard optimization
- Smooth animations and transitions

### 🎨 Customization
- Full Tailwind CSS theming support
- Dark/light mode compatibility
- Customizable validation rules
- Extensible step system

## API Integration

### Registration Endpoint

```tsx
// Expected API structure
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "username": "johndoe123",
  "email": "john@example.com",
  "phoneNumber": "+1 (555) 123-4567",
  "password": "SecurePass123!",
  "city": "New York",
  "state": "NY",
  "country": "United States",
  "zipCode": "10001",
  "agreeToTerms": true,
  "marketingOptIn": false,
  "shoeSize": "10",
  "favoriteBrands": ["Nike", "Adidas"],
  "buyingPreference": "both"
}

// Success Response (201)
{
  "success": true,
  "user": { ... },
  "message": "Account created successfully"
}

// Validation Error (400)
{
  "success": false,
  "errors": {
    "email": "Email already exists",
    "username": "Username is taken"
  }
}
```

## Testing

### Storybook Stories
Each component has comprehensive Storybook documentation:
- Default states
- Validation error states
- Loading states
- Success states
- Interactive demos

### Running Stories
```bash
npm run storybook
```

Navigate to:
- `Auth/Registration/RegistrationModal` - Complete registration flow
- `Auth/Registration/AccountInfoStep` - Account information step
- `Auth/Registration/LocationInfoStep` - Location details step
- `Auth/Registration/PreferencesStep` - Optional preferences step
- `Auth/Registration/LegalStep` - Terms and privacy step

### Unit Testing
```bash
npm test -- registration
```

## Best Practices

### Form State Management
- Use controlled components for all inputs
- Validate on blur for better UX
- Show validation errors only after user interaction
- Clear errors when user starts correcting them

### Performance
- Debounce validation for expensive checks
- Lazy load geolocation data
- Optimize re-renders with proper memoization
- Use React.memo for step components

### Error Handling
- Graceful degradation for optional features
- Clear, actionable error messages
- Retry mechanisms for network failures
- Fallbacks for unsupported browsers

## Customization

### Adding New Validation Rules

```tsx
import { validateField } from './validation'

// Extend validation for new fields
const customValidateField = (field: string, value: any, formData: any) => {
  if (field === 'customField') {
    return {
      isValid: value.length > 0,
      error: value.length === 0 ? 'Custom field is required' : undefined,
      isRequired: true,
      hasBeenTouched: true
    }
  }
  return validateField(field, value, formData)
}
```

### Adding New Steps

1. Create new step component following existing patterns
2. Add step to `RegistrationModal` switch statement
3. Update progress calculation
4. Add validation rules for new fields
5. Update TypeScript interfaces

## Troubleshooting

### Common Issues

**Validation not triggering**
- Ensure `onFieldBlur` is called on input blur
- Check that field names match exactly in validation

**Styles not applying**
- Verify Tailwind CSS classes are available
- Check theme provider is wrapping components

**Step navigation broken**
- Validate that all required fields pass validation
- Check `isStepValid` function for step requirements

### Debug Mode

Enable debug logging:
```tsx
<RegistrationModal
  isOpen={true}
  debugMode={true} // Shows validation state in console
  {...otherProps}
/>
```

## Contributing

1. Follow existing component patterns
2. Add comprehensive Storybook stories
3. Include proper TypeScript types
4. Write unit tests for new features
5. Update documentation

## License

This registration system is part of ShueApp's frontend codebase.