import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  { label, error, hint, className = '', icon: Icon, ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-ink-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500">
            <Icon className="w-4 h-4" />
          </span>
        )}
        <input
          ref={ref}
          className={`input-field ${Icon ? 'pl-10' : ''} ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-ink-500">{hint}</p>}
    </div>
  )
})

export default Input