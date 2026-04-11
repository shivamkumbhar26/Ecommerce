import { useEffect, useState } from 'react'
import { ShoppingBag, Package, History } from 'lucide-react'
import { ordersApi } from '../../api/ordersApi'
import { formatCurrency, formatDate, safeArray } from '../../utils'
import { DELIVERY_STATUS_COLORS, DELIVERY_STATUS_LABELS } from '../../constants'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Badge from '../../components/ui/Badge'
import OrderStatusTimeline from '../../components/product/OrderStatusTimeline'

function OrderCard({ order }) {
  const { id, items, totalAmount, deliveryStatus, paid, orderDate, createdAt, transactionId } = order
  const statusColor = DELIVERY_STATUS_COLORS[deliveryStatus] || 'bg-ink-800 text-ink-400 border-ink-700'
  const statusLabel = DELIVERY_STATUS_LABELS[deliveryStatus] || deliveryStatus || '—'

  return (
    <div className="card p-5 space-y-4 animate-fade-in">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs text-ink-500 font-mono mb-1">Order #{id}</p>
          <p className="text-xs text-ink-600">{formatDate(orderDate || createdAt)}</p>
          {transactionId && (
            <p className="text-xs text-ink-700 font-mono mt-0.5">{transactionId}</p>
          )}
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

      {paid && deliveryStatus && (
        <div className="py-1 overflow-x-auto">
          <OrderStatusTimeline status={deliveryStatus} paid={paid} />
        </div>
      )}

      <div className="space-y-2">
        {safeArray(items).map((item, i) => (
          <div key={i} className="flex items-center justify-between text-sm gap-3">
            <div className="flex items-center gap-2 min-w-0">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-7 h-7 rounded-lg object-cover flex-shrink-0 bg-ink-800"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              )}
              <span className="text-ink-400 truncate">
                {item.name || `Item ${i + 1}`}
                {item.quantity ? ` × ${item.quantity}` : ''}
              </span>
            </div>
            {item.price && (
              <span className="text-ink-300 flex-shrink-0">
                {formatCurrency(item.price * (item.quantity || 1))}
              </span>
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

export default function EmployeePastOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [hasOrders, setHasOrders] = useState(null) // null = unknown, true/false = resolved

  useEffect(() => {
    ordersApi.getMyOrders()
      .then((res) => {
        const data = safeArray(res.data)
        setOrders(data)
        setHasOrders(data.length > 0)
      })
      .catch(() => {
        // If 403/404 or no orders endpoint for employee, treat as no orders
        setHasOrders(false)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
          <History className="w-5 h-5 text-brand-400" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-50">My Past Orders</h1>
          <p className="text-sm text-ink-500 mt-0.5">
            Orders you placed before becoming an employee
          </p>
        </div>
      </div>

      {!hasOrders ? (
        <EmptyState
          icon={Package}
          title="No past orders"
          description="You have no order history from your previous account activity."
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