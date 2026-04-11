export default function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className={`${sizes[size]} ${className}`}>
      <svg
        className="animate-spin w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-20"
          cx="12" cy="12" r="10"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className="opacity-80 text-brand-500"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    </div>
  )
}

export function FullPageSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm text-ink-400 animate-pulse-soft">Loading…</p>
      </div>
    </div>
  )
}