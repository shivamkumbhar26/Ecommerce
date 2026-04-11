import { useEffect, useState } from 'react'
import { ShoppingBag, Package } from 'lucide-react'
import { ordersApi } from '../api/ordersApi'
import { formatCurrency, formatDate, safeArray } from '../utils'
import { DELIVERY_STATUS_COLORS, DELIVERY_STATUS_LABELS } from '../constants'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import Badge from '../components/ui/Badge'
import OrderStatusTimeline from '../components/product/OrderStatusTimeline'

function OrderCard({ order }) {
  const { id, items, totalAmount, deliveryStatus, paid, createdAt, orderDate, transactionId } = order
  const statusColor = DELIVERY_STATUS_COLORS[deliveryStatus] || 'bg-ink-800 text-ink-400 border-ink-700'
  const statusLabel = DELIVERY_STATUS_LABELS[deliveryStatus] || deliveryStatus

  return (
    <div className="card p-5 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs text-ink-500 font-mono mb-1">Order #{id}</p>
          <p className="text-xs text-ink-600">{formatDate(orderDate || createdAt)}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={statusColor}>{statusLabel}</Badge>
          <Badge className={paid
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
          }>
            {paid ? 'Paid' : 'Unpaid'}
          </Badge>
        </div>
      </div>

      {/* Status timeline */}
      {paid && (
        <div className="py-2 overflow-x-auto">
          <OrderStatusTimeline status={deliveryStatus} isPaid={paid} />
        </div>
      )}

      {/* Items */}
      <div className="space-y-2">
        {safeArray(items).map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-ink-400">
              {item.productName || item.name || `Item ${i + 1}`}
              {item.quantity ? ` × ${item.quantity}` : ''}
            </span>
            {item.price && (
              <span className="text-ink-300">{formatCurrency(item.price * (item.quantity || 1))}</span>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-ink-800 pt-3 flex justify-between items-center">
        <span className="text-sm text-ink-500">Total</span>
        <span className="text-lg font-bold text-brand-400">{formatCurrency(totalAmount)}</span>
      </div>
    </div>
  )
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    ordersApi.getMyOrders()
      .then((res) => setOrders(safeArray(res.data)))
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-brand-400" />
        </div>
        <h1 className="font-display text-3xl font-bold text-ink-50">My Orders</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : error ? (
        <div className="text-center py-20 text-ink-500">{error}</div>
      ) : !orders.length ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="When you place an order, it will appear here."
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}