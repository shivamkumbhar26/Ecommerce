import { createContext, useContext, useState, useCallback, useMemo } from 'react'

const UIContext = createContext(null)

export function UIProvider({ children }) {
  const [loading, setLoading] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [modal, setModal] = useState(null) // { component, props }

  const showLoader = useCallback(() => setLoading(true), [])
  const hideLoader = useCallback(() => setLoading(false), [])

  const pushAlert = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now()
    setAlerts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id))
    }, duration)
  }, [])

  const dismissAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const openModal = useCallback((component, props = {}) => {
    setModal({ component, props })
  }, [])

  const closeModal = useCallback(() => setModal(null), [])

  const value = useMemo(
    () => ({
      loading, showLoader, hideLoader,
      alerts, pushAlert, dismissAlert,
      modal, openModal, closeModal,
    }),
    [loading, alerts, modal, showLoader, hideLoader, pushAlert, dismissAlert, openModal, closeModal]
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export const useUI = () => {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within UIProvider')
  return ctx
}