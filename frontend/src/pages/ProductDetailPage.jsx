import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, ArrowLeft, Tag, ChevronLeft, ChevronRight, Package } from 'lucide-react'
import { productsApi } from '../api/productsApi'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { formatCurrency, safeArray } from '../utils'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import Breadcrumb from '../components/ui/Breadcrumb'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { isLoggedIn } = useAuth()
  const { pushAlert } = useUI()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imgIdx, setImgIdx] = useState(0)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    setLoading(true)
    productsApi.getById(id)
      .then((res) => setProduct(res.data))
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Package className="w-14 h-14 text-ink-700 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-ink-300 mb-2">Product not found</h2>
        <Button variant="secondary" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4" /> Back to shop
        </Button>
      </div>
    )
  }

  const { name, brand, price, salePrice, category, imageUrls } = product
  const images = safeArray(imageUrls)
  const displayPrice = salePrice ?? price
  const hasDiscount = salePrice && salePrice < price
  const discount = hasDiscount ? Math.round(((price - salePrice) / price) * 100) : null

  const [adding, setAdding] = useState(false)

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      pushAlert('Please log in to add items to cart', 'warning')
      navigate('/login')
      return
    }
    setAdding(true)
    try {
      await addItem(product, qty)
      pushAlert(`${qty}× "${name}" added to cart`, 'success')
    } catch {
      pushAlert('Failed to add item. Please try again.', 'error')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: 'Shop', to: '/' },
            { label: category, to: `/?category=${encodeURIComponent(category)}` },
            { label: name },
          ]}
        />
      </div>

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-ink-500 hover:text-ink-200 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Image gallery */}
        <div className="space-y-3">
          <div className="relative aspect-square bg-ink-900 rounded-2xl overflow-hidden border border-ink-800">
            {images.length > 0 ? (
              <img
                src={images[imgIdx]}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = `https://placehold.co/600x600/1a1a24/888?text=${encodeURIComponent(name)}` }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Tag className="w-16 h-16 text-ink-700" />
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-ink-950/60 backdrop-blur-sm text-ink-300 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-ink-950/60 backdrop-blur-sm text-ink-300 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${i === imgIdx ? 'bg-brand-400' : 'bg-ink-600'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                    i === imgIdx ? 'border-brand-500' : 'border-ink-800 hover:border-ink-600'
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge bg-ink-800 border-ink-700 text-ink-400">{category}</span>
              <span className="text-sm text-ink-500 font-mono">{brand}</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-ink-50 leading-tight">
              {name}
            </h1>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-brand-400">
              {formatCurrency(displayPrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xl text-ink-600 line-through">{formatCurrency(price)}</span>
                <span className="badge bg-brand-500/10 border-brand-500/20 text-brand-400">
                  -{discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* Quantity */}
          <div>
            <p className="text-sm font-medium text-ink-300 mb-2">Quantity</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-xl bg-ink-800 border border-ink-700 text-ink-300 hover:text-white hover:bg-ink-700 transition-colors text-lg font-medium"
              >
                −
              </button>
              <span className="w-10 text-center font-mono font-semibold text-ink-100">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-9 h-9 rounded-xl bg-ink-800 border border-ink-700 text-ink-300 hover:text-white hover:bg-ink-700 transition-colors text-lg font-medium"
              >
                +
              </button>
            </div>
          </div>

          <Button size="lg" className="w-full sm:w-auto" onClick={handleAddToCart} loading={adding}>
            <ShoppingCart className="w-5 h-5" />
            Add to cart — {formatCurrency(displayPrice * qty)}
          </Button>

          {/* Details card */}
          <div className="card p-5 space-y-3">
            <h3 className="text-sm font-semibold text-ink-300 uppercase tracking-wider">Details</h3>
            <dl className="space-y-2">
              {[
                ['Brand', brand],
                ['Category', category],
                ['SKU', `#${id}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <dt className="text-ink-500">{k}</dt>
                  <dd className="text-ink-200 font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}