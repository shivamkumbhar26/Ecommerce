import api from './axiosConfig'

export const productsApi = {
  getAll: (page = 0, size = 12) =>
    api.get('/api/products/all', { params: { page, size } }),

  getById: (id) => api.get(`/api/products/${id}`),

  search: (query, page = 0, size = 12) =>
    api.get('/api/products/search', { params: { query, page, size } }),

  getByCategory: (category, page = 0, size = 12) =>
    api.get(`/api/products/category/${encodeURIComponent(category)}`, {
      params: { page, size },
    }),

  create: (data) => api.post('/api/admin/products/add', data),

  update: (id, data) => api.put(`/api/admin/products/${id}`, data),

  delete: (id) => api.delete(`/api/products/${id}`),
}