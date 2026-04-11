import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, onPrev, onNext, onPage }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i
    if (page <= 3) return i
    if (page >= totalPages - 4) return totalPages - 7 + i
    return page - 3 + i
  })

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        onClick={onPrev}
        disabled={page === 0}
        className="p-2 rounded-lg text-ink-400 hover:text-ink-100 hover:bg-ink-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors ${
            p === page
              ? 'bg-brand-500 text-white'
              : 'text-ink-400 hover:text-ink-100 hover:bg-ink-800'
          }`}
        >
          {p + 1}
        </button>
      ))}

      <button
        onClick={onNext}
        disabled={page >= totalPages - 1}
        className="p-2 rounded-lg text-ink-400 hover:text-ink-100 hover:bg-ink-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}