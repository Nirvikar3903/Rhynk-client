import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { selectIsAuthenticated, selectAccessToken } from 'store/slices/auth.slice'

// Guards protected routes behind valid auth — redirects to /login if token is missing
const RequireAuth = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const accessToken = useSelector(selectAccessToken)
  const token = accessToken || localStorage.getItem('rhynk_access_token')

  if (!isAuthenticated && !token) {
    return <Navigate replace to="/login" />
  }

  return <Outlet />
}

export default RequireAuth
