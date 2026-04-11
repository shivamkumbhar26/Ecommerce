import { useEffect, useState } from 'react'
import { ShoppingBag, Search } from 'lucide-react'
import { ordersApi } from '../../api/ordersApi'
import { formatCurrency, formatDate, safeArray } from '../../utils'
import { DELIVERY_STATUS_COLORS, DELIVERY_STATUS_LABELS } from '../../constants'
import Spinner from '../../components/ui/Spinner'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    ordersApi.getAll()
      .then((r) => setOrders(safeArray(r.data)))
      .finally(() => setLoading(false))
  }, [])

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase()
    return (
      !q ||
      String(o.id).includes(q) ||
      o.userEmail?.toLowerCase().includes(q) ||
      o.assignedTo?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-50">Orders</h1>
          <p className="text-sm text-ink-500 mt-0.5">Monitor all customer orders</p>
        </div>
        <div className="badge bg-ink-800 border-ink-700 text-ink-400 text-sm">{orders.length} total</div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by ID, email…"
          className="input-field pl-10"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : !filtered.length ? (
        <EmptyState icon={ShoppingBag} title="No orders found" />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-800">
                  {['Order', 'Customer', 'Total', 'Payment', 'Status', 'Assigned To', 'Date'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-ink-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-800/60">
                {filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-ink-800/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-ink-400 text-xs">#{o.id}</td>
                    <td className="px-4 py-3 text-ink-200 max-w-[140px] truncate">{o.userEmail}</td>
                    <td className="px-4 py-3 font-semibold text-brand-400 whitespace-nowrap">
                      {formatCurrency(o.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={o.paid
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }>
                        {o.paid ? 'Paid' : 'Pending'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={DELIVERY_STATUS_COLORS[o.deliveryStatus] || 'bg-ink-700/50 text-ink-400 border-ink-700'}>
                        {DELIVERY_STATUS_LABELS[o.deliveryStatus] || o.deliveryStatus || '—'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-ink-400 text-xs">{o.assignedTo || '—'}</td>
                    <td className="px-4 py-3 text-ink-500 text-xs whitespace-nowrap">{formatDate(o.orderDate || o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}