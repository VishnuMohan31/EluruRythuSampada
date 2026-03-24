import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@context/AuthContext'

// Layouts
import PublicLayout from '@components/layout/PublicLayout'
import AdminLayout from '@components/layout/AdminLayout'
import SuperAdminLayout from '@components/layout/SuperAdminLayout'

// Public Pages
import HomePage from '@pages/public/HomePage'
import ProductsPage from '@pages/public/ProductsPage'
import ProductDetailPage from '@pages/public/ProductDetailPage'
import AboutPage from '@pages/public/AboutPage'
import TermsPage from '@pages/public/TermsPage'
import PrivacyPage from '@pages/public/PrivacyPage'
import DisclaimerPage from '@pages/public/DisclaimerPage'

// Auth Pages
import AdminLogin from '@pages/admin/AdminLogin'
import SuperAdminLogin from '@pages/super-admin/SuperAdminLogin'

// Admin Pages
import AdminDashboard from '@pages/admin/AdminDashboard'
import ManageSuperAdmins from '@pages/admin/ManageSuperAdmins'
import AdminReports from '@pages/admin/Reports'
import AdminProfile from '@pages/admin/Profile'

// Super Admin Pages
import SuperAdminDashboard from '@pages/super-admin/SuperAdminDashboard'
import ManageFarmers from '@pages/super-admin/ManageFarmers'
import ManageProducts from '@pages/super-admin/ManageProducts'
import ManageCategories from '@pages/super-admin/ManageCategories'
import SuperAdminReports from '@pages/super-admin/Reports'
import SuperAdminProfile from '@pages/super-admin/Profile'

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated()) {
    return <Navigate to={requiredRole === 'admin' ? '/admin/login' : '/super-admin/login'} replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/disclaimer" element={<DisclaimerPage />} />
      </Route>

      {/* Admin Auth */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="super-admins" element={<ManageSuperAdmins />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* Super Admin Auth */}
      <Route path="/super-admin/login" element={<SuperAdminLogin />} />

      {/* Super Admin Routes */}
      <Route
        path="/super-admin/*"
        element={
          <ProtectedRoute requiredRole="super_admin">
            <SuperAdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<SuperAdminDashboard />} />
        <Route path="farmers" element={<ManageFarmers />} />
        <Route path="products" element={<ManageProducts />} />
        <Route path="categories" element={<ManageCategories />} />
        <Route path="reports" element={<SuperAdminReports />} />
        <Route path="profile" element={<SuperAdminProfile />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
