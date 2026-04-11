import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isLoggedIn, user } = useAuth()
  const location = useLocation()

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to role-appropriate home
    const roleHome = {
      ROLE_ADMIN: '/admin',
      ROLE_EMPLOYEE: '/employee',
      ROLE_USER: '/',
    }
    return <Navigate to={roleHome[user?.role] || '/'} replace />
  }

  return children
}