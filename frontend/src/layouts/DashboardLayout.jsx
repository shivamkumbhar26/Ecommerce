import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, Users, LogOut, UserCog,
  Truck, ShoppingBag, ClipboardList, Menu, X, History
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { ROLES } from '../constants'
import { AlertStack } from '../components/ui/Alert'
import { FullPageSpinner } from '../components/ui/Spinner'
import { getInitials } from '../utils'

const adminNav = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Product Management', icon: Package },
  { to: '/admin/employees', label: 'Employee Management', icon: UserCog },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
]

const employeeNav = [
  { to: '/employee', label: 'Order Management', icon: ClipboardList, end: true },
  { to: '/employee/my-orders', label: 'My Past Orders', icon: History },
]

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const { loading, alerts, dismissAlert, pushAlert } = useUI()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isAdmin = user?.role === ROLES.ADMIN
  const nav = isAdmin ? adminNav : employeeNav

  const handleLogout = () => {
    logout()
    pushAlert('Logged out', 'info')
    navigate('/login')
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-ink-800">
        <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center">
          <ShoppingBag className="w-4 h-4 text-white" />
        </div>
        <span className="font-display text-lg font-bold text-ink-50">
          Shop<span className="text-brand-400">Arc</span>
        </span>
      </div>

      {/* Role badge */}
      <div className="px-4 py-4 border-b border-ink-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-500/20 text-brand-400 font-mono text-sm font-bold flex items-center justify-center flex-shrink-0">
            {getInitials(user?.fullName || user?.email)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink-100 truncate">
              {user?.fullName || user?.email}
            </p>
            <p className="text-xs text-ink-500 truncate">
              {isAdmin ? 'Administrator' : 'Employee'}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
                  : 'text-ink-400 hover:text-ink-100 hover:bg-ink-800'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-ink-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-ink-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen flex bg-ink-950 noise-bg">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 flex-shrink-0 bg-ink-900 border-r border-ink-800">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-10 w-60 bg-ink-900 border-r border-ink-800 flex flex-col animate-slide-up">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 h-14 bg-ink-900 border-b border-ink-800">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-ink-400 hover:text-ink-100 hover:bg-ink-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-display font-semibold text-ink-100">
            {isAdmin ? 'Admin Panel' : 'Employee Portal'}
          </span>
        </div>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      {loading && <FullPageSpinner />}
      <AlertStack alerts={alerts} onDismiss={dismissAlert} />
    </div>
  )
}