'use client'

import { useState } from 'react'
import { LoginModalPortal } from './LoginModalPortal'

/**
 * Example component demonstrating different ways to use LoginModalPortal
 */
export function LoginModalPortalExample() {
  const [showModalAtRoot, setShowModalAtRoot] = useState(false)
  const [showModalAtCustomTarget, setShowModalAtCustomTarget] = useState(false)

  const handleLoginSuccess = () => {
    console.log('Login successful!')
  }

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold">LoginModalPortal Examples</h3>
      
      <div className="space-y-2">
        <button
          onClick={() => setShowModalAtRoot(true)}
          className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Open Modal at Root (Default)
        </button>
        
        <button
          onClick={() => setShowModalAtCustomTarget(true)}
          className="block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Open Modal at #modal-root
        </button>
      </div>

      {/* Custom portal target example */}
      <div 
        id="custom-modal-target" 
        className="relative min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg p-4"
      >
        <p className="text-sm text-gray-600">Custom portal target area</p>
      </div>

      {/* Modal rendered at document.body (default) */}
      <LoginModalPortal
        isOpen={showModalAtRoot}
        onClose={() => setShowModalAtRoot(false)}
        onLoginSuccess={handleLoginSuccess}
        // portalTarget not specified, so it will render to document.body
      />

      {/* Modal rendered at #modal-root */}
      <LoginModalPortal
        isOpen={showModalAtCustomTarget}
        onClose={() => setShowModalAtCustomTarget(false)}
        onLoginSuccess={handleLoginSuccess}
        portalTarget="#modal-root"
      />
    </div>
  )
}