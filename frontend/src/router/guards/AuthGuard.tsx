import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { ROUTES } from '@/router/routes'

export default function AuthGuard() {
  const token = useAuthStore((s) => s.accessToken)
  const location = useLocation()
  if (!token) return <Navigate to={`${ROUTES.LOGIN}?next=${encodeURIComponent(location.pathname + location.search)}`} replace />
  return <Outlet />
}
