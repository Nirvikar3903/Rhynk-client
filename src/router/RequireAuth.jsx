// import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
// import { selectIsAuthenticated } from 'store/slices/auth.slice'

// Guards any nested route behind a valid session — redirects to /login
// instead of rendering the protected page when not authenticated. Built
// alongside /home, the first protected route (see .claude/workflows/create-page.md).
//
// TEMPORARILY DISABLED: auth state only lives in Redux (no persistence yet —
// see [[06-auth-security]]/[[05-state-data-layer]] token-refresh notes), so a
// page refresh resets isAuthenticated and bounces straight to /login. Restore
// the check below once token persistence/refresh-on-load is implemented.
const RequireAuth = () => {
  // const isAuthenticated = useSelector(selectIsAuthenticated)
  // return isAuthenticated ? <Outlet /> : <Navigate replace to="/login" />
  return <Outlet />
}

export default RequireAuth
