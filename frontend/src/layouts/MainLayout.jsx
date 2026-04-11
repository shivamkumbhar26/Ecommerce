import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useUI } from '../context/UIContext'
import { FullPageSpinner } from '../components/ui/Spinner'
import { AlertStack } from '../components/ui/Alert'

export default function MainLayout() {
  const { loading, alerts, dismissAlert } = useUI()

  return (
    <div className="min-h-screen flex flex-col noise-bg">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {loading && <FullPageSpinner />}
      <AlertStack alerts={alerts} onDismiss={dismissAlert} />
    </div>
  )
}