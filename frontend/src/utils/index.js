export const formatCurrency = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount)

export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr))
}

export const getErrorMessage = (err) =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  err?.message ||
  'An unexpected error occurred'

export const truncate = (str, n = 60) =>
  str && str.length > n ? str.slice(0, n - 1) + '…' : str

export const generatePaymentId = () =>
  'PAY-' + Math.random().toString(36).substring(2, 10).toUpperCase()

export const safeArray = (val) => (Array.isArray(val) ? val : [])

export const getInitials = (name = '') =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

export const classNames = (...classes) => classes.filter(Boolean).join(' ')