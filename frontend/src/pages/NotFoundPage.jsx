import { Link } from 'react-router-dom'
import { Home, Compass } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      {/* Decorative number */}
      <div className="relative mb-8">
        <span className="font-display text-[10rem] font-bold text-ink-900 leading-none select-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <Compass className="w-16 h-16 text-brand-500 animate-spin-slow" />
        </div>
      </div>

      <h1 className="font-display text-3xl font-bold text-ink-100 mb-3">
        Page not found
      </h1>
      <p className="text-ink-500 max-w-md mb-8">
        The page you're looking for doesn't exist or may have been moved.
        Let's get you back on track.
      </p>

      <Link to="/" className="btn-primary">
        <Home className="w-4 h-4" />
        Back to home
      </Link>
    </div>
  )
}