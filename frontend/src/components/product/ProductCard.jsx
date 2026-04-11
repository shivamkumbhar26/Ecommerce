import { ShoppingCart, Star, Tag } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useUI } from '../../context/UIContext'
import { formatCurrency, truncate } from '../../utils'
import { useNavigate } from 'react-router-dom'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const { isLoggedIn } = useAuth()
  const { pushAlert } = useUI()
  const navigate = useNavigate()

  const { id, name, brand, price, salePrice, category, imageUrls } = product
  const displayPrice = salePrice ?? price
  const hasDiscount = salePrice && salePrice < price
  const discount = hasDiscount
    ? Math.round(((price - salePrice) / price) * 100)
    : null

  const primaryImage =
    Array.isArray(imageUrls) && imageUrls.length > 0
      ? imageUrls[0]
      : null

  const handleAddToCart = (e) => {
    e.stopPropagation()
    if (!isLoggedIn) {
      pushAlert('Please log in to add items to cart', 'warning')
      navigate('/login')
      return
    }
    addItem(product)
    pushAlert(`"${name}" added to cart`, 'success')
  }

  return (
    <div
      className="card group cursor-pointer overflow-hidden hover:shadow-card-hover hover:border-ink-700 transition-all duration-300 animate-fade-in"
      onClick={() => navigate(`/products/${id}`)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-ink-800 overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.src = `https://placehold.co/400x300/1a1a24/888?text=${encodeURIComponent(name)}` }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Tag className="w-10 h-10 text-ink-700" />
          </div>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 px-2 py-0.5 bg-brand-500 text-white text-xs font-mono font-medium rounded-lg">
            -{discount}%
          </div>
        )}

        {/* Category */}
        <div className="absolute top-3 right-3 px-2 py-0.5 bg-ink-950/70 backdrop-blur-sm text-ink-400 text-xs rounded-lg">
          {category}
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-xs text-ink-500 font-mono uppercase tracking-wider mb-1">{brand}</p>
        <h3 className="font-display text-base font-semibold text-ink-100 leading-snug mb-3">
          {truncate(name, 48)}
        </h3>

        {/* Price row */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-brand-400">
              {formatCurrency(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-ink-600 line-through">
                {formatCurrency(price)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 hover:bg-brand-500 hover:text-white border border-brand-500/20 hover:border-brand-500 transition-all duration-200 active:scale-95"
            title="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}