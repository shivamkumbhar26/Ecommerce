import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

/**
 * Breadcrumb navigation component.
 *
 * Usage:
 *   <Breadcrumb items={[
 *     { label: 'Home', to: '/' },
 *     { label: 'Electronics', to: '/?category=Electronics' },
 *     { label: 'iPhone 15 Pro' },   // no `to` = current page (not linked)
 *   ]} />
 */
export default function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm flex-wrap">
      <Link
        to="/"
        className="text-ink-500 hover:text-ink-300 transition-colors flex-shrink-0"
        aria-label="Home"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={i} className="flex items-center gap-1">
            <ChevronRight className="w-3.5 h-3.5 text-ink-700 flex-shrink-0" />
            {isLast || !item.to ? (
              <span
                className={`${
                  isLast ? 'text-ink-200 font-medium' : 'text-ink-500'
                } truncate max-w-[160px]`}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.to}
                className="text-ink-500 hover:text-ink-300 transition-colors truncate max-w-[160px]"
              >
                {item.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}