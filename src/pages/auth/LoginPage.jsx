import { Box, Typography } from '@mui/material'
import AuthLayout from 'layouts/AuthLayout'
import LoginContainer from 'features/containers/auth/LoginContainer'

const LoginPage = () => (
  <AuthLayout>
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Typography color="primary.main" sx={{ letterSpacing: '-0.02em' }} variant="h1">
        Rhynk
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="body1">
        Elevating every conversation through sound.
      </Typography>
    </Box>
    <LoginContainer />
  </AuthLayout>
)

export default LoginPage
