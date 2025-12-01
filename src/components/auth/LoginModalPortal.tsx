'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { LoginModal, LoginModalProps } from './LoginModal'

export interface LoginModalPortalProps extends LoginModalProps {
  /**
   * The target element or selector where the modal should be rendered.
   * If not provided, defaults to document.body (root of the project).
   * Can be:
   * - A CSS selector string (e.g., '#modal-root', '.modal-container')
   * - An HTML element
   * - null/undefined (will render to document.body)
   */
  portalTarget?: string | HTMLElement | null
}

export function LoginModalPortal({
  portalTarget,
  ...loginModalProps
}: LoginModalPortalProps) {
  const [mountElement, setMountElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    let targetElement: HTMLElement | null = null

    if (!portalTarget) {
      // Default to document.body if no target is specified
      targetElement = document.body
    } else if (typeof portalTarget === 'string') {
      // If it's a string, treat it as a CSS selector
      targetElement = document.querySelector(portalTarget) as HTMLElement
      
      if (!targetElement) {
        console.warn(`LoginModalPortal: Could not find element with selector "${portalTarget}". Falling back to document.body.`)
        targetElement = document.body
      }
    } else if (portalTarget instanceof HTMLElement) {
      // If it's already an HTMLElement, use it directly
      targetElement = portalTarget
    } else {
      // Fallback to document.body for any other case
      targetElement = document.body
    }

    setMountElement(targetElement)
  }, [portalTarget])

  // Don't render anything on server side or if mount element is not ready
  if (typeof window === 'undefined' || !mountElement) {
    return null
  }

  // Only render the modal content if it's open
  if (!loginModalProps.isOpen) {
    return null
  }

  // Create the modal backdrop and content
  const modalContent = (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={loginModalProps.onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-10" />
      
      {/* Modal content wrapper */}
      <div className="relative z-10">
        <LoginModal {...loginModalProps} />
      </div>
    </div>
  )

  // Use createPortal to render the modal at the specified location
  return createPortal(modalContent, mountElement)
}

// Export both the portal version and re-export the original for convenience
export { LoginModal } from './LoginModal'
export type { LoginModalProps } from './LoginModal'