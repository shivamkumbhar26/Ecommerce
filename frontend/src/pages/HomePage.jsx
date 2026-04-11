import { useState, useEffect, useCallback } from 'react'
import { Search, SlidersHorizontal, X, Zap } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { productsApi } from '../api/productsApi'
import { useDebounce } from '../hooks/useDebounce'
import { usePagination } from '../hooks/usePagination'
import { CATEGORIES, PAGE_SIZE } from '../constants'
import { safeArray } from '../utils'
import ProductGrid from '../components/product/ProductGrid'
import Pagination from '../components/ui/Pagination'

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero({ onSearch }) {
  const [q, setQ] = useState('')

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && q.trim()) onSearch(q.trim())
  }

  return (
    <section className="relative overflow-hidden bg-ink-900 border-b border-ink-800">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-brand-600/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            New arrivals every week
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-ink-50 leading-[1.1] mb-5">
            Discover
            <span className="block text-brand-400">premium products</span>
          </h1>
          <p className="text-ink-400 text-lg mb-8 leading-relaxed">
            Curated selection of the finest goods — electronics, fashion, books and more,
            delivered straight to your door.
          </p>

          {/* Search bar */}
          <div className="flex gap-3 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-500" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search products, brands…"
                className="w-full pl-12 pr-4 py-3.5 bg-ink-800 border border-ink-700 rounded-2xl text-ink-100 placeholder:text-ink-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-sm"
              />
            </div>
            <button
              onClick={() => q.trim() && onSearch(q.trim())}
              className="btn-primary px-6 py-3.5 text-sm rounded-2xl"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Category pills ────────────────────────────────────────────────────────────
function CategoryFilter({ active, onSelect }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
          !active
            ? 'bg-brand-500 border-brand-500 text-white'
            : 'bg-transparent border-ink-700 text-ink-400 hover:border-ink-500 hover:text-ink-200'
        }`}
      >
        All
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
            active === cat
              ? 'bg-brand-500 border-brand-500 text-white'
              : 'bg-transparent border-ink-700 text-ink-400 hover:border-ink-500 hover:text-ink-200'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || null)

  const debouncedSearch = useDebounce(searchQuery, 500)
  const pagination = usePagination(0)

  const fetchProducts = useCallback(async (query, category, page) => {
    setLoading(true)
    try {
      let res
      if (query) {
        res = await productsApi.search(query, page, PAGE_SIZE)
      } else if (category) {
        res = await productsApi.getByCategory(category, page, PAGE_SIZE)
      } else {
        res = await productsApi.getAll(page, PAGE_SIZE)
      }

      // Support both paginated { content, totalPages } and plain array responses
      const data = res.data
      if (Array.isArray(data)) {
        setProducts(data)
        pagination.setTotalPages(1)
        pagination.setTotalElements(data.length)
      } else {
        setProducts(safeArray(data.content))
        pagination.setTotalPages(data.totalPages ?? 1)
        pagination.setTotalElements(data.totalElements ?? 0)
      }
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, []) // eslint-disable-line

  useEffect(() => {
    fetchProducts(debouncedSearch, activeCategory, pagination.page)
  }, [debouncedSearch, activeCategory, pagination.page]) // eslint-disable-line

  const handleSearch = (q) => {
    setSearchQuery(q)
    setActiveCategory(null)
    pagination.reset()
    setSearchParams(q ? { q } : {})
  }

  const handleCategory = (cat) => {
    setActiveCategory(cat)
    setSearchQuery('')
    pagination.reset()
    setSearchParams(cat ? { category: cat } : {})
  }

  const clearFilters = () => {
    setSearchQuery('')
    setActiveCategory(null)
    pagination.reset()
    setSearchParams({})
  }

  const hasFilter = searchQuery || activeCategory

  return (
    <div>
      <Hero onSearch={handleSearch} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-2 text-ink-500 flex-shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-medium">Filter</span>
          </div>

          <CategoryFilter active={activeCategory} onSelect={handleCategory} />

          {hasFilter && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-300 transition-colors ml-auto flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>

        {/* Active filter label */}
        {hasFilter && (
          <div className="mb-5 text-sm text-ink-400">
            {searchQuery && (
              <span>
                Results for <span className="text-brand-400 font-medium">"{searchQuery}"</span>
              </span>
            )}
            {activeCategory && (
              <span>
                Category: <span className="text-brand-400 font-medium">{activeCategory}</span>
              </span>
            )}
            {!loading && (
              <span className="ml-2 text-ink-600">
                ({pagination.totalElements} items)
              </span>
            )}
          </div>
        )}

        <ProductGrid products={products} loading={loading} />

        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPrev={pagination.prevPage}
          onNext={pagination.nextPage}
          onPage={pagination.goToPage}
        />
      </div>
    </div>
  )
}