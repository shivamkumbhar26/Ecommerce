import api from './axiosConfig'

export const ordersApi = {
  // User: checkout with paymentId in body
  checkout: (paymentId) =>
    api.post('/api/orders/checkout', { paymentId }),

  // User: get their own orders
  getMyOrders: () => api.get('/api/orders/my'),

  // Admin: get all orders
  getAll: () => api.get('/api/admin/orders'),

  // Employee: get tasks assigned to them (backend uses Principal)
  getAssigned: () => api.get('/api/orders/employee/tasks'),

  // Employee/Admin: update delivery status via query param
  updateStatus: (orderId, status) =>
    api.patch(`/api/orders/update-status/${orderId}?status=${status}`),
}