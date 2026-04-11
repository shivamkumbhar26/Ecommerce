import ProductCard from './ProductCard'
import { PackageOpen } from 'lucide-react'
import EmptyState from '../ui/EmptyState'

function ProductSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-ink-800" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-ink-800 rounded w-1/3" />
        <div className="h-5 bg-ink-800 rounded w-4/5" />
        <div className="h-4 bg-ink-800 rounded w-2/5" />
      </div>
    </div>
  )
}

export default function ProductGrid({ products = [], loading = false, emptyMessage = 'No products found' }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!products.length) {
    return (
      <EmptyState
        icon={PackageOpen}
        title="No products found"
        description={emptyMessage}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}