import api from './axiosConfig'

export const cartApi = {
  getCart: () => api.get('/api/cart/view'),

  addToCart: (productId, name, price, quantity = 1) =>
    api.post('/api/cart/add', { productId, name, price, quantity }),

  removeFromCart: (productId) =>
    api.delete(`/api/cart/remove/${productId}`),

  updateQuantity: (productId, quantity) =>
    api.put(`/api/cart/update/${productId}`, { quantity }),

  clearCart: () => api.delete('/api/cart/clear'),
}