import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useUI } from '../context/UIContext'
import { ordersApi } from '../api/ordersApi'
import { formatCurrency } from '../utils'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import PaymentModal from '../components/cart/PaymentModal'
import Spinner from '../components/ui/Spinner'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, cartTotal, loading } = useCart()
  const { pushAlert } = useUI()
  const navigate = useNavigate()
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  // Payment unchanged — send paymentId to backend
  const handlePaymentSuccess = async (paymentId) => {
    setPaymentOpen(false)
    setCheckoutLoading(true)
    try {
      await ordersApi.checkout(paymentId)
      await clearCart()
      pushAlert('Order placed successfully! 🎉', 'success')
      navigate('/orders')
    } catch (err) {
      pushAlert(
        err?.response?.data?.message || 'Checkout failed. Please try again.',
        'error'
      )
    } finally {
      setCheckoutLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Browse our products and add something you love."
          action={<Link to="/" className="btn-primary">Continue shopping</Link>}
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold text-ink-50 mb-8">
        Shopping Cart
        <span className="ml-3 text-lg font-body font-normal text-ink-500">
          ({items.length} {items.length === 1 ? 'item' : 'items'})
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Item list */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            // Backend shape: { productId, name, price, quantity }
            <div key={item.productId} className="card p-4 flex gap-4 items-start animate-fade-in">
              {/* Icon placeholder (backend doesn't return image in cart) */}
              <div className="w-20 h-20 flex-shrink-0 rounded-xl bg-ink-800 border border-ink-700 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-ink-600" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-ink-100 truncate">{item.name}</h3>
                <p className="text-sm text-brand-400 font-semibold mt-1">
                  {formatCurrency(item.price)}
                </p>
              </div>

              {/* Qty + remove */}
              <div className="flex flex-col items-end gap-3 flex-shrink-0">
                <button
                  onClick={() => removeItem(item.productId)}
                  className="p-1.5 rounded-lg text-ink-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-7 h-7 rounded-lg bg-ink-800 border border-ink-700 flex items-center justify-center text-ink-300 hover:text-white disabled:opacity-30 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-mono text-ink-100">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-ink-800 border border-ink-700 flex items-center justify-center text-ink-300 hover:text-white transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-sm font-semibold text-ink-200">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-display text-xl font-semibold text-ink-100 mb-5">Order Summary</h2>

            <div className="space-y-3 mb-5">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-ink-400 truncate mr-2">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-ink-200 flex-shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-ink-800 pt-4 mb-5">
              <div className="flex justify-between">
                <span className="font-semibold text-ink-100">Total</span>
                <span className="text-xl font-bold text-brand-400">{formatCurrency(cartTotal)}</span>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              loading={checkoutLoading}
              onClick={() => setPaymentOpen(true)}
            >
              Proceed to checkout <ArrowRight className="w-4 h-4" />
            </Button>

            <button
              onClick={clearCart}
              className="mt-3 w-full text-sm text-ink-600 hover:text-red-400 transition-colors py-1"
            >
              Clear cart
            </button>
          </div>
        </div>
      </div>

      {/* Payment modal — unchanged */}
      <PaymentModal
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        total={cartTotal}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  )
}