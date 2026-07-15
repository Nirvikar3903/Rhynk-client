import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { selectIsAuthenticated } from 'store/slices/auth.slice'

// Guards any nested route behind a valid session — redirects to /login
// instead of rendering the protected page when not authenticated. Built
// alongside /home, the first protected route (see .claude/workflows/create-page.md).
const RequireAuth = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate replace to="/login" />
}

export default RequireAuth
