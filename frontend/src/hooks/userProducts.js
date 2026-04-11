import { useState, useEffect, useCallback } from 'react'
import { productsApi } from '../api/productsApi'
import { safeArray } from '../utils'
import { PAGE_SIZE } from '../constants'

/**
 * Reusable hook for fetching products with search, category filter, and pagination.
 * Handles loading state, error state, and paginated responses automatically.
 */
export function useProducts({ query = '', category = '', page = 0, size = PAGE_SIZE } = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let res
      if (query) {
        res = await productsApi.search(query, page, size)
      } else if (category) {
        res = await productsApi.getByCategory(category, page, size)
      } else {
        res = await productsApi.getAll(page, size)
      }

      const data = res.data
      if (Array.isArray(data)) {
        setProducts(data)
        setTotalPages(1)
        setTotalElements(data.length)
      } else {
        setProducts(safeArray(data.content))
        setTotalPages(data.totalPages ?? 1)
        setTotalElements(data.totalElements ?? 0)
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load products')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [query, category, page, size])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { products, loading, error, totalPages, totalElements, refetch: fetch }
}