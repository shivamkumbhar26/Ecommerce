import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

const Select = forwardRef(function Select(
  { label, error, options = [], className = '', placeholder = 'Select…', ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-ink-300">{label}</label>}
      <div className="relative">
        <select
          ref={ref}
          className={`input-field appearance-none pr-10 ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
          } ${className}`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
})

export default Select