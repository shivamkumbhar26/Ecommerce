import { forwardRef } from 'react'

const Textarea = forwardRef(function Textarea(
  { label, error, hint, rows = 4, className = '', ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-ink-300">{label}</label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`input-field resize-none leading-relaxed ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-ink-500">{hint}</p>}
    </div>
  )
})

export default Textarea