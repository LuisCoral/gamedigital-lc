import { Routes, Route, useLocation } from 'react-router-dom'
import SnowEffect from './components/SnowEffect'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import AdminLogin from './pages/AdminLogin'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminProductsPage from './pages/AdminProductsPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <>
      {!isAdmin && <SnowEffect />}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/juego/:slug" element={<ProductDetails />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/productos"
        element={
          <ProtectedRoute>
            <AdminProductsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
    </>
  )
}

export default App
