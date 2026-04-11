import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'

const config = {
  success: {
    icon: CheckCircle,
    classes: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
    iconClass: 'text-emerald-400',
  },
  error: {
    icon: AlertCircle,
    classes: 'bg-red-500/10 border-red-500/20 text-red-300',
    iconClass: 'text-red-400',
  },
  warning: {
    icon: AlertTriangle,
    classes: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300',
    iconClass: 'text-yellow-400',
  },
  info: {
    icon: Info,
    classes: 'bg-brand-500/10 border-brand-500/20 text-brand-300',
    iconClass: 'text-brand-400',
  },
}

export function Alert({ message, type = 'info', onDismiss }) {
  const { icon: Icon, classes, iconClass } = config[type] || config.info
  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm animate-slide-down ${classes}`}
    >
      <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${iconClass}`} />
      <p className="flex-1">{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="flex-shrink-0 opacity-60 hover:opacity-100">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

// Toast stack mounted globally
export function AlertStack({ alerts, onDismiss }) {
  if (!alerts?.length) return null
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 w-80 max-w-[calc(100vw-3rem)]">
      {alerts.map((a) => (
        <Alert key={a.id} message={a.message} type={a.type} onDismiss={() => onDismiss(a.id)} />
      ))}
    </div>
  )
}