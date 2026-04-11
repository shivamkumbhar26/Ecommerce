export const ROLES = {
  USER: 'ROLE_USER',
  ADMIN: 'ROLE_ADMIN',
  EMPLOYEE: 'ROLE_EMPLOYEE',
}

// Must match backend DeliveryStatus enum exactly
export const DELIVERY_STATUS = {
  ASSIGNED:  'ASSIGNED',
  SHIPPED:   'SHIPPED',
  DELIVERED: 'DELIVERED',
}

export const DELIVERY_STATUS_LABELS = {
  ASSIGNED:  'Assigned',
  SHIPPED:   'Shipped',
  DELIVERED: 'Delivered',
}

export const DELIVERY_STATUS_COLORS = {
  ASSIGNED:  'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  SHIPPED:   'bg-brand-500/10 text-brand-400 border-brand-500/20',
  DELIVERED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

export const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports',
  'Beauty',
  'Toys',
  'Automotive',
]

export const ROLE_REDIRECT = {
  ROLE_USER:     '/',
  ROLE_ADMIN:    '/admin',
  ROLE_EMPLOYEE: '/employee',
}

export const PAGE_SIZE = 12