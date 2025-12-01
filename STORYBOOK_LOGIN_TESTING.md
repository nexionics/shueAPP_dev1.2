# Storybook for Login Functionality Testing

This guide explains how to use Storybook to validate the behavior of your ShueApp authentication components.

## 🎯 What is Storybook?

Storybook is a powerful tool for developing and testing UI components in isolation. For login functionality, it provides:

- **Visual Testing**: See how your login components look in different states
- **Interactive Testing**: Manually test user interactions and form submissions
- **Accessibility Testing**: Validate keyboard navigation and screen reader compatibility
- **Responsive Testing**: Check how components behave on different screen sizes
- **Documentation**: Living documentation of component behavior and use cases

## 🚀 Getting Started

### Running Storybook

```bash
cd frontend
npm run storybook
```

This will start Storybook on `http://localhost:6006` where you can interact with your login components.

## 📱 Available Login Stories

### LoginModal Stories

Navigate to `Authentication > LoginModal` in the Storybook sidebar to find these stories:

#### 1. **Default**
- Shows the login modal in its normal state
- Test form validation by entering different email/password combinations
- Try submitting empty forms to see validation messages

#### 2. **Closed** 
- Demonstrates the modal when `isOpen={false}`
- Useful for testing conditional rendering logic

#### 3. **Mobile**
- Shows how the modal appears on mobile devices
- Tests responsive design and touch interactions

#### 4. **Dark Theme**
- Tests the modal appearance in dark mode
- Validates color contrast and theming

### UserMenu Stories

Navigate to `Authentication > UserMenu` to find:

#### 1. **Authenticated**
- Shows logged-in user menu with avatar, name, and dropdown
- Click the avatar to test dropdown functionality

#### 2. **Without Avatar**
- Tests fallback behavior when user has no profile image
- Shows initials instead of avatar image

#### 3. **Long Name**
- Tests text truncation with very long names and emails
- Validates layout doesn't break with overflow text

#### 4. **Not Authenticated**
- Shows component behavior when no user is logged in
- Should render nothing (component returns null)

## 🧪 Testing Scenarios

### Manual Testing Checklist

Use this checklist while interacting with the stories:

#### LoginModal Testing:
- [ ] **Form Validation**
  - Enter invalid email formats
  - Leave fields empty and submit
  - Check error messages display correctly
  
- [ ] **User Interactions**
  - Tab through form fields (keyboard navigation)
  - Press Enter to submit form
  - Click Cancel to close modal
  - Try to close modal by clicking outside (if enabled)

- [ ] **Visual States**
  - Loading state during form submission
  - Error state with error messages
  - Success state (form clears and modal closes)

- [ ] **Responsive Design**
  - Switch to mobile viewport
  - Check modal positioning and size
  - Test touch interactions on mobile

- [ ] **Accessibility**
  - Navigate using only keyboard (Tab, Enter, Escape)
  - Check focus indicators are visible
  - Verify form labels and ARIA attributes

#### UserMenu Testing:
- [ ] **Dropdown Functionality**
  - Click avatar to open menu
  - Click outside to close menu
  - Navigate menu items with keyboard
  
- [ ] **User Information Display**
  - Verify name and email display correctly
  - Check avatar image loads properly
  - Test initials fallback for missing avatars

- [ ] **Menu Actions**
  - Test logout functionality
  - Check Profile and Settings menu items
  - Verify proper spacing and icons

## 🎮 Interactive Features

### Controls Panel
Use the Controls panel in Storybook to:
- Toggle `isOpen` property for LoginModal
- Change user data for UserMenu
- Test different component states dynamically

### Actions Tab
Monitor component events in the Actions tab:
- Login form submissions
- Modal open/close events  
- Logout button clicks
- Menu item selections

### Accessibility Tab
Use the built-in A11y addon to:
- Check color contrast ratios
- Validate ARIA labels and roles
- Test keyboard navigation paths
- Identify accessibility violations

## 🔧 Advanced Testing Patterns

### Testing Error States

To test error handling:
1. Open the LoginModal Default story
2. Enter `error@test.com` as email (triggers mock error)
3. Submit form to see error message display
4. Verify error styling and user feedback

### Testing Loading States

While Storybook doesn't include interactive loading stories due to complexity with auth context mocking, you can:
1. Modify the story code to set `isLoading: true`
2. See how the form looks during submission
3. Verify buttons are disabled and spinner shows

### Responsive Breakpoint Testing

Use Storybook's viewport toolbar to test:
- Desktop (1200px+)
- Tablet (768px - 1199px) 
- Mobile (< 768px)
- Custom breakpoints

## 📝 Writing New Stories

### Adding a New LoginModal Story

```typescript
export const MyNewStory: Story = {
  args: {
    isOpen: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Description of what this story tests'
      }
    }
  }
}
```

### Adding Interactive Behavior

```typescript
export const InteractiveStory: Story = {
  args: {
    isOpen: true
  },
  play: async ({ canvasElement }) => {
    // Note: play functions require @storybook/test package
    // which may need additional setup in this project
  }
}
```

## 🚨 Common Issues & Solutions

### Context Provider Issues
If components break due to missing context:
1. Wrap component in appropriate provider (like MockAuthProvider in UserMenu stories)
2. Mock required context values
3. Provide default implementations for context methods

### Import Errors
If you see module import errors:
1. Check that all required Storybook addons are installed
2. Verify your `tsconfig.json` includes proper path mapping
3. Ensure `@storybook/nextjs-vite` is used for Next.js projects

### Styling Issues  
If components don't look right:
1. Make sure Tailwind CSS is properly configured for Storybook
2. Check that your `main.ts` includes the correct static directories
3. Import global CSS files in `.storybook/preview.ts`

## 📊 Benefits of Storybook Testing

### For Developers:
- **Component Isolation**: Test components without full app context
- **Visual Regression**: Catch UI changes before they reach production
- **Documentation**: Self-documenting component behavior
- **Debugging**: Easier to debug component issues in isolation

### For QA/Testing:
- **Manual Testing**: Comprehensive manual testing scenarios
- **Edge Cases**: Test boundary conditions and error states
- **Cross-browser**: Test components across different browsers
- **Accessibility**: Built-in accessibility testing tools

### For Design/Product:
- **Design Review**: Visual review of component implementations
- **User Flows**: Test complete user interaction flows
- **Responsive Design**: Validate mobile and desktop layouts
- **Brand Consistency**: Ensure consistent styling across components

## 🔗 Next Steps

1. **Run Storybook** and familiarize yourself with the existing stories
2. **Test each story** using the manual testing checklist above
3. **Add new stories** for additional component states or edge cases
4. **Integrate with CI/CD** for automated visual regression testing
5. **Share with team** for collaborative component development and review

## 📚 Additional Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Storybook Testing Handbook](https://storybook.js.org/tutorials/ui-testing-handbook/)
- [Accessibility in Storybook](https://storybook.js.org/docs/writing-tests/accessibility-testing)
- [Visual Testing with Storybook](https://storybook.js.org/docs/writing-tests/visual-testing)