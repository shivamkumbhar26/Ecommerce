import { useState, useCallback } from 'react'

export function useAsync() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const run = useCallback(async (asyncFn) => {
    setLoading(true)
    setError(null)
    try {
      const result = await asyncFn()
      return result
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Something went wrong'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, run }
}