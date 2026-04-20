import { Navigate, Outlet } from 'react-router-dom'
import { PATHS } from './paths'

export const ProtectedRoute = () => {
  const token = localStorage.getItem('admin_token')
  if (!token) return <Navigate to={PATHS.ADMIN_LOGIN} replace />
  return <Outlet />
}
