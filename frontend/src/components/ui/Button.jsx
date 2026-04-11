import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger:
    'inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-body font-medium text-sm rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed',
}

const sizes = {
  sm: 'text-xs px-3 py-1.5',
  md: '',
  lg: 'text-base px-6 py-3',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
}