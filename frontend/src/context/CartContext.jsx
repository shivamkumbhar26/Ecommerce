import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import { cartApi } from '../api/cartApi'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  // Backend cart item shape: { productId, name, price, quantity }
  // We normalise it into the same shape for the UI

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn) { setItems([]); return }
    setLoading(true)
    try {
      const res = await cartApi.getCart()
      setItems(Array.isArray(res.data) ? res.data : [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [isLoggedIn])

  // Load cart from backend on login
  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  // Add item — calls backend, then refreshes cart
  const addItem = useCallback(async (product, quantity = 1) => {
    await cartApi.addToCart(
      product.id,
      product.name,
      product.salePrice ?? product.price,
      quantity
    )
    await fetchCart()
  }, [fetchCart])

  // Remove item — optimistic update + backend call
  const removeItem = useCallback(async (productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
    try {
      await cartApi.removeFromCart(productId)
    } catch {
      await fetchCart() // revert on error
    }
  }, [fetchCart])

  // Update quantity — optimistic update + backend call
  const updateQuantity = useCallback(async (productId, quantity) => {
    if (quantity < 1) return
    setItems((prev) =>
      prev.map((i) => i.productId === productId ? { ...i, quantity } : i)
    )
    try {
      await cartApi.updateQuantity(productId, quantity)
    } catch {
      await fetchCart() // revert on error
    }
  }, [fetchCart])

  // Clear cart after successful checkout
  const clearCart = useCallback(async () => {
    setItems([])
    try {
      await cartApi.clearCart()
    } catch {
      // checkout already succeeded, ignore clear error
    }
  }, [])

  const cartCount = useMemo(
    () => items.reduce((sum, i) => sum + (i.quantity || 0), 0),
    [items]
  )

  const cartTotal = useMemo(
    () => items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0),
    [items]
  )

  const value = useMemo(
    () => ({ items, loading, addItem, removeItem, updateQuantity, clearCart, cartCount, cartTotal, fetchCart }),
    [items, loading, addItem, removeItem, updateQuantity, clearCart, cartCount, cartTotal, fetchCart]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
