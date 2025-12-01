# LoginModalPortal Component

The `LoginModalPortal` component is a wrapper around the `LoginModal` that uses React Portals to render the modal at a specific location in the DOM tree, rather than where the component is declared.

## Features

- **Flexible Positioning**: Render the modal at any DOM element or CSS selector
- **Default Fallback**: Automatically falls back to `document.body` if no target is specified
- **Server-Side Safe**: Handles SSR gracefully by only rendering on the client side
- **Full LoginModal API**: Supports all props from the original `LoginModal` component

## Usage

### Basic Usage (Render at Root)

```tsx
import { LoginModalPortal } from '@/components/auth/LoginModalPortal'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>
        Open Login Modal
      </button>
      
      {/* Modal will render at document.body by default */}
      <LoginModalPortal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onLoginSuccess={() => console.log('Login successful!')}
      />
    </div>
  )
}
```

### Render at Specific Element

```tsx
import { LoginModalPortal } from '@/components/auth/LoginModalPortal'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>
        Open Login Modal
      </button>
      
      {/* Modal will render at the element with id="modal-root" */}
      <LoginModalPortal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        portalTarget="#modal-root"
      />
      
      {/* Custom target container */}
      <div id="custom-portal-target">
        {/* Modal can also render here */}
      </div>
      
      <LoginModalPortal
        isOpen={anotherModalOpen}
        onClose={() => setAnotherModalOpen(false)}
        portalTarget="#custom-portal-target"
      />
    </div>
  )
}
```

### Using with Element Reference

```tsx
import { useRef } from 'react'
import { LoginModalPortal } from '@/components/auth/LoginModalPortal'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)
  const modalContainerRef = useRef<HTMLDivElement>(null)
  
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>
        Open Login Modal
      </button>
      
      <div ref={modalContainerRef} className="relative">
        {/* Other content */}
      </div>
      
      {/* Modal will render inside the referenced div */}
      <LoginModalPortal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        portalTarget={modalContainerRef.current}
      />
    </div>
  )
}
```

## Props

### LoginModalPortalProps

All props from `LoginModalProps` plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `portalTarget` | `string \| HTMLElement \| null` | `undefined` | Target location for the portal. Can be a CSS selector, HTMLElement, or null/undefined for document.body |

### Inherited from LoginModalProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | `boolean` | ✅ | Controls modal visibility |
| `onClose` | `() => void` | ✅ | Called when modal should close |
| `onLoginSuccess` | `() => void` | ❌ | Called after successful login |

## Portal Target Options

### 1. CSS Selector (string)
```tsx
portalTarget="#modal-root"           // ID selector
portalTarget=".modal-container"      // Class selector
portalTarget="[data-modal='login']"  // Attribute selector
```

### 2. HTMLElement
```tsx
portalTarget={document.getElementById('modal-root')}
portalTarget={modalContainerRef.current}
```

### 3. Default (undefined/null)
```tsx
// Both render to document.body
portalTarget={undefined}
// or simply omit the prop
```

## Modal Root Setup

The layout already includes a dedicated modal root:

```tsx
// In src/app/layout.tsx
<div id="modal-root"></div>
```

This provides a clean separation between your app content and modal overlays.

## Error Handling

- If a CSS selector doesn't match any element, the component logs a warning and falls back to `document.body`
- Server-side rendering is handled gracefully - the portal only renders on the client side
- Invalid `portalTarget` types default to `document.body`

## Best Practices

1. **Use the Modal Root**: For most cases, use `portalTarget="#modal-root"` to keep modals organized
2. **Conditional Rendering**: Only render the portal when the modal needs to be shown
3. **Cleanup**: The portal automatically handles cleanup when the component unmounts
4. **Accessibility**: The portal maintains all accessibility features of the original LoginModal

## Examples

See `LoginModalPortalExample.tsx` for working examples of different portal configurations.