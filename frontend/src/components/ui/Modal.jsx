import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm animate-fade-in" />

      {/* Panel */}
      <div
        className={`relative w-full ${sizes[size]} card shadow-modal animate-scale-in`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-800">
          <h2 className="font-display text-lg font-semibold text-ink-50">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-400 hover:text-ink-100 hover:bg-ink-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}