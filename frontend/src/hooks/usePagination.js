import { useState, useCallback } from 'react'

export function usePagination(initialPage = 0) {
  const [page, setPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  const nextPage = useCallback(() => setPage((p) => p + 1), [])
  const prevPage = useCallback(() => setPage((p) => Math.max(0, p - 1)), [])
  const goToPage = useCallback((p) => setPage(p), [])
  const reset = useCallback(() => setPage(0), [])

  return {
    page,
    totalPages,
    totalElements,
    setTotalPages,
    setTotalElements,
    nextPage,
    prevPage,
    goToPage,
    reset,
    isFirst: page === 0,
    isLast: page >= totalPages - 1,
  }
}