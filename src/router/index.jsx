import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

const SignUpPage = lazy(() => import('pages/auth/SignUpPage'))

const AppRouter = () => (
  <Suspense fallback={null}>
    <Routes>
      <Route element={<Navigate replace to="/signup" />} path="/" />
      <Route element={<SignUpPage />} path="/signup" />
    </Routes>
  </Suspense>
)

export default AppRouter
