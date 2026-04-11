import { useState, useEffect, useCallback } from 'react'
import { ordersApi } from '../api/ordersApi'
import { safeArray } from '../utils'

/**
 * Fetches orders depending on the caller's role.
 * mode: 'my' | 'all' | 'assigned'
 */
export function useOrders(mode = 'my') {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let res
      if (mode === 'all') res = await ordersApi.getAll()
      else if (mode === 'assigned') res = await ordersApi.getAssigned()
      else res = await ordersApi.getMyOrders()

      setOrders(safeArray(res.data))
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [mode])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { orders, loading, error, refetch: fetch }
}