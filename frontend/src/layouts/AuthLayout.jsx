import { Outlet, Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useUI } from '../context/UIContext'
import { AlertStack } from '../components/ui/Alert'

export default function AuthLayout() {
  const { alerts, dismissAlert } = useUI()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-ink-950 noise-bg">
      {/* Background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-10 h-10 rounded-2xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-2xl font-bold text-ink-50">
            Shop<span className="text-brand-400">Arc</span>
          </span>
        </Link>

        <Outlet />
      </div>

      <AlertStack alerts={alerts} onDismiss={dismissAlert} />
    </div>
  )
}