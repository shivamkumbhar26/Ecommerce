import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Request interceptor — attach Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle 401
// Only force logout if the user actually had a token (expired session).
// A 401 on a public endpoint (e.g. /api/products before login) should NOT
// wipe a freshly saved token and redirect back to /login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error.config?.url?.includes('/api/auth/')
    if (error.response?.status === 401 && !isAuthEndpoint) {
      const token = localStorage.getItem('token')
      if (token) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api