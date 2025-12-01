'use client'

import { useEffect, useState, ComponentType } from 'react'
import { createPortal } from 'react-dom'

export interface ModalProps {
  /**
   * Handler called when the modal should be closed
   */
  onClose: () => void
}

export interface AsModalOptions {
  /**
   * The target element or selector where the modal should be rendered.
   * If not provided, defaults to document.body.
   * Can be:
   * - A CSS selector string (e.g., '#modal-root', '.modal-container')
   * - An HTML element
   * - null/undefined (will render to document.body)
   */
  portalTarget?: string | HTMLElement | null
  
  /**
   * Whether clicking outside the modal content should close it
   * @default true
   */
  closeOnOutsideClick?: boolean
  
  /**
   * Whether pressing the Escape key should close the modal
   * @default true
   */
  closeOnEscape?: boolean
  
  /**
   * Whether to prevent body scroll when modal is open
   * @default true
   */
  preventBodyScroll?: boolean
  
  /**
   * Custom backdrop/overlay className
   */
  backdropClassName?: string
  
  /**
   * Custom modal container className
   */
  containerClassName?: string
}

export interface AsModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean
  
  /**
   * Handler called when the modal should be closed
   */
  onClose: () => void
  
  /**
   * Override options for this specific modal instance
   */
  modalOptions?: Partial<AsModalOptions>
}

/**
 * Higher-Order Component that wraps a component to render it as a modal using createPortal
 * 
 * @param WrappedComponent - The component to be rendered as a modal
 * @param options - Configuration options for the modal behavior
 * @returns A new component that renders the wrapped component in a modal
 * 
 * @example
 * ```tsx
 * const MyModalComponent = ({ onClose, title, content }) => (
 *   <div>
 *     <h2>{title}</h2>
 *     <p>{content}</p>
 *     <button onClick={onClose}>Close</button>
 *   </div>
 * );
 * 
 * const MyModal = asModal(MyModalComponent, {
 *   containerClassName: 'custom-modal-container',
 *   closeOnOutsideClick: true
 * });
 * 
 * // Usage
 * <MyModal 
 *   isOpen={isModalOpen} 
 *   onClose={handleClose}
 *   title="My Modal"
 *   content="Modal content here"
 * />
 * ```
 */
export function asModal<T extends ModalProps>(
  WrappedComponent: ComponentType<T>,
  defaultOptions: AsModalOptions = {}
) {
  const defaultModalOptions: Required<AsModalOptions> = {
    portalTarget: null,
    closeOnOutsideClick: true,
    closeOnEscape: true,
    preventBodyScroll: true,
    backdropClassName: 'fixed inset-0 z-50 bg-black bg-opacity-50',
    containerClassName: 'fixed inset-0 z-50 flex items-center justify-center p-4',
    ...defaultOptions
  }

  return function ModalComponent(
    props: Omit<T, 'onClose'> & AsModalProps
  ) {
    const { isOpen, onClose, modalOptions = {}, ...componentProps } = props
    const [mountElement, setMountElement] = useState<HTMLElement | null>(null)
    
    // Merge default options with instance options
    const options = { ...defaultModalOptions, ...modalOptions }

    useEffect(() => {
      // Only run on client side
      if (typeof window === 'undefined') return

      let targetElement: HTMLElement | null = null

      if (!options.portalTarget) {
        // Default to document.body if no target is specified
        targetElement = document.body
      } else if (typeof options.portalTarget === 'string') {
        // If it's a string, treat it as a CSS selector
        targetElement = document.querySelector(options.portalTarget) as HTMLElement
        
        if (!targetElement) {
          console.warn(
            `asModal: Could not find element with selector "${options.portalTarget}". Falling back to document.body.`
          )
          targetElement = document.body
        }
      } else if (options.portalTarget instanceof HTMLElement) {
        // If it's already an HTMLElement, use it directly
        targetElement = options.portalTarget
      } else {
        // Fallback to document.body for any other case
        targetElement = document.body
      }

      setMountElement(targetElement)
    }, [options.portalTarget])

    useEffect(() => {
      if (!isOpen) return

      // Handle Escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && options.closeOnEscape) {
          onClose()
        }
      }

      // Handle body scroll prevention
      if (options.preventBodyScroll) {
        const originalOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        
        return () => {
          document.body.style.overflow = originalOverflow
        }
      }

      if (options.closeOnEscape) {
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
      }
    }, [isOpen, onClose, options.closeOnEscape, options.preventBodyScroll])

    // Don't render anything on server side or if mount element is not ready
    if (typeof window === 'undefined' || !mountElement) {
      return null
    }

    // Only render if modal is open
    if (!isOpen) {
      return null
    }

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget && options.closeOnOutsideClick) {
        onClose()
      }
    }

    const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
      // Prevent backdrop click when clicking on modal content
      e.stopPropagation()
    }

    // Create the modal content
    const modalContent = (
      <div className={options.containerClassName} onClick={handleBackdropClick}>
        {/* Backdrop */}
        <div className={options.backdropClassName} />
        
        {/* Modal content wrapper */}
        <div className="relative z-10" onClick={handleContentClick}>
          <WrappedComponent 
            {...(componentProps as T)} 
            onClose={onClose}
          />
        </div>
      </div>
    )

    // Use createPortal to render the modal at the specified location
    return createPortal(modalContent, mountElement)
  }
}

export default asModal