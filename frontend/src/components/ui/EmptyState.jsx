export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-ink-800 border border-ink-700 flex items-center justify-center mb-5">
          <Icon className="w-8 h-8 text-ink-500" />
        </div>
      )}
      <h3 className="font-display text-xl font-semibold text-ink-200 mb-2">{title}</h3>
      {description && <p className="text-sm text-ink-500 max-w-xs">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}