import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

/**
 * Reusable metric card for dashboards.
 *
 * @param {string}   label     - Metric name
 * @param {string}   value     - Primary value to display
 * @param {string}   [sub]     - Secondary/sub-label text
 * @param {ReactNode} [icon]   - Lucide icon component
 * @param {string}   [color]   - Accent colour: 'brand' | 'emerald' | 'yellow' | 'sky' | 'red'
 * @param {number}   [trend]   - Percentage change (+/-). Omit to hide trend indicator.
 */
export default function StatCard({ label, value, sub, icon: Icon, color = 'brand', trend }) {
  const colorMap = {
    brand:   'bg-brand-500/10   text-brand-400   border-brand-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    yellow:  'bg-yellow-500/10  text-yellow-400  border-yellow-500/20',
    sky:     'bg-sky-500/10     text-sky-400     border-sky-500/20',
    red:     'bg-red-500/10     text-red-400     border-red-500/20',
  }

  const trendPositive = trend > 0
  const trendNeutral  = trend === 0 || trend == null
  const TrendIcon = trendNeutral ? Minus : trendPositive ? TrendingUp : TrendingDown
  const trendColor = trendNeutral
    ? 'text-ink-500'
    : trendPositive
    ? 'text-emerald-400'
    : 'text-red-400'

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        {Icon && (
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${colorMap[color] ?? colorMap.brand}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        {trend != null && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>

      <div>
        <p className="text-2xl font-bold text-ink-50 leading-none mb-1.5">{value}</p>
        <p className="text-sm font-medium text-ink-300">{label}</p>
        {sub && <p className="text-xs text-ink-600 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}