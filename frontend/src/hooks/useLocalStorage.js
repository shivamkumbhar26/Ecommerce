import { useState, useCallback } from 'react'

/**
 * useState that persists to localStorage.
 * Handles JSON serialization and parse errors gracefully.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        if (valueToStore === null || valueToStore === undefined) {
          localStorage.removeItem(key)
        } else {
          localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (err) {
        console.error(`useLocalStorage error for key "${key}":`, err)
      }
    },
    [key, storedValue]
  )

  const remove = useCallback(() => {
    localStorage.removeItem(key)
    setStoredValue(initialValue)
  }, [key, initialValue])

  return [storedValue, setValue, remove]
}