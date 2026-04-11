import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import ProtectedRoute from './ProtectedRoute'
import ScrollToTop from '../components/ui/ScrollToTop'
import { ROLES } from '../constants'

// Pages
import HomePage from '../pages/HomePage'
import ProductDetailPage from '../pages/ProductDetailPage'
import CartPage from '../pages/CartPage'
import OrdersPage from '../pages/OrdersPage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import NotFoundPage from '../pages/NotFoundPage'

// Admin pages
import AdminOverviewPage from '../pages/admin/AdminOverviewPage'
import AdminProductsPage from '../pages/admin/AdminProductsPage'
import AdminUsersPage from '../pages/admin/AdminUsersPage'
import AdminOrdersPage from '../pages/admin/AdminOrdersPage'
import AdminEmployeesPage from '../pages/admin/AdminEmployeesPage'

// Employee pages
import EmployeeDeliveriesPage from '../pages/employee/EmployeeDeliveriesPage'
import EmployeePastOrdersPage from '../pages/employee/EmployeePastOrdersPage'

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Main public/user routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.ADMIN]}>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.ADMIN]}>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Admin dashboard */}
      <Route
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminOverviewPage />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route path="/admin/employees" element={<AdminEmployeesPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
      </Route>

      {/* Employee dashboard */}
      <Route
        element={
          <ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/employee" element={<EmployeeDeliveriesPage />} />
        <Route path="/employee/my-orders" element={<EmployeePastOrdersPage />} />
      </Route>

      {/* Fallback */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
    </>
  )
}