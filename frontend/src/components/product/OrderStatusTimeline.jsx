import { CheckCircle2, Truck, PackageCheck, ShoppingBag } from 'lucide-react'

const STEPS = [
  { key: 'PLACED',    label: 'Order Placed', icon: ShoppingBag  },
  { key: 'ASSIGNED',  label: 'Assigned',     icon: PackageCheck },
  { key: 'SHIPPED',   label: 'Shipped',      icon: Truck        },
  { key: 'DELIVERED', label: 'Delivered',    icon: CheckCircle2 },
]

const STATUS_INDEX = {
  PLACED:    0,
  ASSIGNED:  1,
  SHIPPED:   2,
  DELIVERED: 3,
}

export default function OrderStatusTimeline({ status, isPaid, paid }) {
  const isActuallyPaid = isPaid ?? paid ?? false
  const currentIndex = !isActuallyPaid ? 0 : (STATUS_INDEX[status] ?? 1)

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const isComplete = i < currentIndex
        const isCurrent  = i === currentIndex
        const Icon = step.icon

        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                isComplete
                  ? 'bg-emerald-500 border-emerald-500'
                  : isCurrent
                  ? 'bg-brand-500/15 border-brand-500'
                  : 'bg-ink-800 border-ink-700'
              }`}>
                {isComplete
                  ? <CheckCircle2 className="w-4 h-4 text-white" />
                  : <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-brand-400' : 'text-ink-600'}`} />
                }
              </div>
              <span className={`text-[10px] font-medium whitespace-nowrap ${
                isComplete ? 'text-emerald-400' : isCurrent ? 'text-brand-400' : 'text-ink-600'
              }`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-4 transition-all ${
                i < currentIndex ? 'bg-emerald-500/60' : 'bg-ink-800'
              }`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
