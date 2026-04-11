import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  ShoppingCart, LogOut, User, LayoutDashboard, UserCog,
  Truck, Menu, X, Package, ShoppingBag
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useUI } from '../../context/UIContext'
import { ROLES } from '../../constants'
import { getInitials } from '../../utils'

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth()
  const { cartCount } = useCart()
  const { pushAlert } = useUI()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    pushAlert('Logged out successfully', 'info')
    navigate('/login')
    setMobileOpen(false)
  }

  const NavLink = ({ to, children, onClick }) => {
    const active = location.pathname === to
    return (
      <Link
        to={to}
        onClick={() => { setMobileOpen(false); onClick?.() }}
        className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
          active
            ? 'text-brand-400 bg-brand-500/10'
            : 'text-ink-400 hover:text-ink-100 hover:bg-ink-800'
        }`}
      >
        {children}
      </Link>
    )
  }

  const userLinks = () => {
    if (!isLoggedIn) return (
      <>
        <NavLink to="/login"><User className="w-4 h-4" />Login</NavLink>
        <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary text-sm px-4 py-2">
          Register
        </Link>
      </>
    )

    const links = [
      <NavLink key="home" to="/"><Package className="w-4 h-4" />Shop</NavLink>,
    ]

    if (user?.role === ROLES.USER || user?.role === ROLES.ADMIN) {
      links.push(
        <NavLink key="orders" to="/orders">
          <ShoppingBag className="w-4 h-4" />Orders
        </NavLink>
      )
    }
    if (user?.role === ROLES.ADMIN) {
      links.push(
        <NavLink key="admin" to="/admin">
          <LayoutDashboard className="w-4 h-4" />Admin Panel
        </NavLink>,
        <NavLink key="admin-products" to="/admin/products">
          <Package className="w-4 h-4" />Products
        </NavLink>,
        <NavLink key="admin-employees" to="/admin/employees">
          <UserCog className="w-4 h-4" />Employees
        </NavLink>
      )
    }
    if (user?.role === ROLES.EMPLOYEE) {
      links.push(
        <NavLink key="employee" to="/employee">
          <Truck className="w-4 h-4" />Order Management
        </NavLink>
      )
    }

    return links
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-ink-950/90 backdrop-blur-md border-b border-ink-800/60">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg group-hover:bg-brand-400 transition-colors">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-ink-50 tracking-tight">
              Shop<span className="text-brand-400">Arc</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {userLinks()}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            {isLoggedIn && user?.role !== ROLES.EMPLOYEE && (
              <Link
                to="/cart"
                className="relative p-2.5 rounded-xl text-ink-400 hover:text-ink-100 hover:bg-ink-800 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-brand-500 text-white text-[10px] font-mono font-bold rounded-full flex items-center justify-center px-1 animate-scale-in">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* User avatar / logout */}
            {isLoggedIn && (
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-ink-800 border border-ink-700">
                  <div className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 text-xs font-mono font-bold flex items-center justify-center">
                    {getInitials(user?.fullName || user?.email)}
                  </div>
                  <span className="text-sm text-ink-300 max-w-[120px] truncate">
                    {user?.fullName || user?.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl text-ink-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2.5 rounded-xl text-ink-400 hover:text-ink-100 hover:bg-ink-800 transition-colors"
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-ink-800 py-3 pb-4 space-y-1 animate-slide-down">
            {userLinks()}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-sm font-medium px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />Logout
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}