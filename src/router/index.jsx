import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import RequireAuth from 'router/RequireAuth'

const LandingPage = lazy(() => import('pages/LandingPage'))
const SignUpPage = lazy(() => import('pages/auth/SignUpPage'))
const LoginPage = lazy(() => import('pages/auth/LoginPage'))
const HomePage = lazy(() => import('pages/HomePage'))
const NewGroupPage = lazy(() => import('pages/groups/NewGroupPage'))

const AppRouter = () => (
  <Suspense fallback={null}>
    <Routes>
      <Route element={<LandingPage />} path="/" />
      <Route element={<SignUpPage />} path="/signup" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<RequireAuth />}>
        <Route element={<HomePage />} path="/home" />
        <Route element={<NewGroupPage />} path="/groups/new" />
      </Route>
    </Routes>
  </Suspense>
)

export default AppRouter
