import { useEffect, useState } from 'react'
import { Truck, Package, CheckCircle2, ArrowRight, RefreshCw } from 'lucide-react'
import { ordersApi } from '../../api/ordersApi'
import { useUI } from '../../context/UIContext'
import { useAsync } from '../../hooks/useAsync'
import { formatCurrency, formatDate, safeArray } from '../../utils'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'

// Match exactly what your backend accepts
const DELIVERY_STATUS = {
  ASSIGNED: 'ASSIGNED',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
}

const STATUS_COLORS = {
  ASSIGNED:  'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  SHIPPED:   'bg-brand-500/10 text-brand-400 border-brand-500/20',
  DELIVERED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

// What button to show for each current status
const STATUS_FLOW = {
  ASSIGNED: { next: 'SHIPPED',    label: 'Mark Shipped',    icon: Truck },
  SHIPPED:  { next: 'DELIVERED',  label: 'Mark Delivered',  icon: CheckCircle2 },
}

function DeliveryCard({ order, onUpdateStatus, updating }) {
  const { id, items, totalAmount, deliveryStatus, createdAt } = order
  const flow = STATUS_FLOW[deliveryStatus]
  const isDelivered = deliveryStatus === DELIVERY_STATUS.DELIVERED

  return (
    <div className={`card p-5 space-y-4 animate-fade-in ${isDelivered ? 'opacity-60' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs text-ink-500 font-mono mb-1">Order #{id}</p>
          <p className="text-xs text-ink-600">{formatDate(createdAt)}</p>
        </div>
        <Badge className={STATUS_COLORS[deliveryStatus] || 'bg-ink-800 text-ink-400 border-ink-700'}>
          {deliveryStatus}
        </Badge>
      </div>

      {/* Items */}
      <div className="bg-ink-800/50 rounded-xl p-3 space-y-1.5">
        {safeArray(items).slice(0, 3).map((item, i) => (
          <div key={i} className="flex justify-between text-xs">
            <span className="text-ink-400 truncate">
              {item.productName || item.name || `Item ${i + 1}`}
              {item.quantity ? ` × ${item.quantity}` : ''}
            </span>
          </div>
        ))}
        {safeArray(items).length > 3 && (
          <p className="text-xs text-ink-600">+{safeArray(items).length - 3} more</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-lg font-bold text-brand-400">{formatCurrency(totalAmount)}</span>

        {!isDelivered && flow && (
          <Button
            size="sm"
            loading={updating === id}
            disabled={Boolean(updating && updating !== id)}
            onClick={() => onUpdateStatus(id, flow.next)}
          >
            <flow.icon className="w-3.5 h-3.5" />
            {flow.label}
          </Button>
        )}

        {isDelivered && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4" /> Completed
          </div>
        )}
      </div>
    </div>
  )
}

export default function EmployeeDeliveriesPage() {
  const { pushAlert } = useUI()
  const { run } = useAsync()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  const load = () => {
    setLoading(true)
    ordersApi.getAssigned()          // GET /api/orders/employee/tasks
      .then((r) => setOrders(safeArray(r.data)))
      .catch(() => pushAlert('Failed to load tasks', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdating(orderId)
    try {
      // PATCH /api/orders/update-status/{orderId}?status=SHIPPED
      await run(() => ordersApi.updateStatus(orderId, newStatus))
      pushAlert(
        newStatus === 'DELIVERED' ? '🎉 Order delivered!' : 'Status updated to Shipped',
        'success'
      )
      load()
    } catch {
      pushAlert('Failed to update status', 'error')
    } finally {
      setUpdating(null)
    }
  }

  const active    = orders.filter((o) => o.deliveryStatus !== DELIVERY_STATUS.DELIVERED)
  const delivered = orders.filter((o) => o.deliveryStatus === DELIVERY_STATUS.DELIVERED)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-50">My Tasks</h1>
          <p className="text-sm text-ink-500 mt-0.5">
            {active.length} active · {delivered.length} delivered
          </p>
        </div>
        <button
          onClick={load}
          className="p-2 rounded-xl text-ink-400 hover:text-ink-100 hover:bg-ink-800 border border-ink-800 transition-colors"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Status flow legend */}
      <div className="flex items-center gap-2 text-xs flex-wrap">
        {Object.keys(STATUS_COLORS).map((s, i, arr) => (
          <span key={s} className="flex items-center gap-2">
            <span className={`badge border ${STATUS_COLORS[s]}`}>{s}</span>
            {i < arr.length - 1 && <ArrowRight className="w-3 h-3 text-ink-700" />}
          </span>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : !orders.length ? (
        <EmptyState icon={Truck} title="No tasks assigned" description="Your assigned orders will appear here." />
      ) : (
        <div className="space-y-6">
          {active.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-ink-300 uppercase tracking-wider mb-3">
                Active ({active.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {active.map((o) => (
                  <DeliveryCard key={o.id} order={o} onUpdateStatus={handleUpdateStatus} updating={updating} />
                ))}
              </div>
            </div>
          )}
          {delivered.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-ink-300 uppercase tracking-wider mb-3">
                Completed ({delivered.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {delivered.map((o) => (
                  <DeliveryCard key={o.id} order={o} onUpdateStatus={handleUpdateStatus} updating={updating} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}