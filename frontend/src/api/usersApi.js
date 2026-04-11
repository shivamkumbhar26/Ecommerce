import api from './axiosConfig'

export const usersApi = {
  getAll: () => api.get('/api/admin/users'),

  promote: (userId) => api.patch(`/api/admin/users/${userId}/promote`),

  delete: (userId) => api.delete(`/api/admin/users/${userId}`),
}

export const adminApi = {
  // Add a new employee (Admin only)
  addEmployee: (data) => api.post('/api/admin/add-employee', data),

  // Get all employees
  getEmployees: () => api.get('/api/admin/employees'),
}