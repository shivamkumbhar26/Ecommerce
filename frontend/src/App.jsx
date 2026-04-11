import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { UIProvider } from './context/UIContext'
import AppRoutes from './routes/AppRoutes'
import ErrorBoundary from './components/ui/ErrorBoundary'

export default function App() {
  return (
    <ErrorBoundary>
      <UIProvider>
        <AuthProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </AuthProvider>
      </UIProvider>
    </ErrorBoundary>
  )
}