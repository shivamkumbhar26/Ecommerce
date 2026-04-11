import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scrolls to top of the page on every route change.
 * Place this once inside BrowserRouter.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}