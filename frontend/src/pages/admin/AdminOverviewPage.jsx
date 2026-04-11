import { useEffect, useState } from 'react'
import { Package, Users, ShoppingBag, TrendingUp } from 'lucide-react'
import { productsApi } from '../../api/productsApi'
import { ordersApi } from '../../api/ordersApi'
import { usersApi } from '../../api/usersApi'
import { formatCurrency, safeArray } from '../../utils'
import Spinner from '../../components/ui/Spinner'
import StatCard from '../../components/ui/StatCard'

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      productsApi.getAll(0, 1),
      ordersApi.getAll(),
      usersApi.getAll(),
    ]).then(([prodRes, ordersRes, usersRes]) => {
      const products = prodRes.status === 'fulfilled'
        ? (prodRes.value.data?.totalElements ?? safeArray(prodRes.value.data).length)
        : '—'
      const orders = ordersRes.status === 'fulfilled' ? safeArray(ordersRes.value.data) : []
      const users = usersRes.status === 'fulfilled' ? safeArray(usersRes.value.data) : []
      const revenue = orders.filter((o) => o.isPaid).reduce((s, o) => s + (o.totalAmount || 0), 0)

      setStats({ products, orders: orders.length, users: users.length, revenue })
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink-50 mb-1">Dashboard</h1>
        <p className="text-ink-500 text-sm">Welcome back, admin. Here's what's happening.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Total Products" value={stats?.products ?? '—'} color="brand" />
        <StatCard icon={ShoppingBag} label="Total Orders" value={stats?.orders ?? '—'} color="sky" />
        <StatCard icon={Users} label="Registered Users" value={stats?.users ?? '—'} color="yellow" />
        <StatCard
          icon={TrendingUp}
          label="Total Revenue"
          value={stats?.revenue != null ? formatCurrency(stats.revenue) : '—'}
          sub="From paid orders"
          color="emerald"
        />
      </div>

      {/* Quick links */}
      <div>
        <h2 className="font-display text-xl font-semibold text-ink-100 mb-4">Quick actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { to: '/admin/products', label: 'Manage Products', icon: Package, desc: 'Add, edit or remove products' },
            { to: '/admin/users', label: 'Manage Users', icon: Users, desc: 'View users and promote to employee' },
            { to: '/admin/orders', label: 'View Orders', icon: ShoppingBag, desc: 'Monitor all customer orders' },
          ].map(({ to, label, icon: Icon, desc }) => (
            <a
              key={to}
              href={to}
              className="card p-4 hover:border-ink-600 hover:shadow-card-hover transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-ink-800 group-hover:bg-brand-500/10 flex items-center justify-center mb-3 transition-colors">
                <Icon className="w-4 h-4 text-ink-400 group-hover:text-brand-400 transition-colors" />
              </div>
              <p className="font-medium text-ink-200 group-hover:text-ink-50 text-sm transition-colors">{label}</p>
              <p className="text-xs text-ink-600 mt-0.5">{desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}