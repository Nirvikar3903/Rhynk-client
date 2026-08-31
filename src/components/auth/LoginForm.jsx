import { Box, Paper, Typography, IconButton, InputAdornment, Divider, Link, alpha } from '@mui/material'
// import Button from '@mui/material/Button' // only needed by the commented-out phone/email toggle below
import { motion } from 'framer-motion'
import ChatIcon from '@mui/icons-material/Chat'
import GraphicEqIcon from '@mui/icons-material/GraphicEq'
// import CallIcon from '@mui/icons-material/Call' // only needed by the commented-out phone/email toggle below
import MailIcon from '@mui/icons-material/Mail'
import LockIcon from '@mui/icons-material/Lock'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import AppButtonComponent from 'components/mui/AppButtonComponent'
import AppTextFieldComponent from 'components/mui/AppTextFieldComponent'
import GoogleAuthButton from 'components/auth/GoogleAuthButton'

// Phone login is designed but not wired — POST /auth/login (docs/AUTH_MODULE.md)
// is email-only today. Kept here, commented, rather than deleted, so it's a
// quick re-enable once the backend supports a phone-based flow. Same pattern
// as the phone-signup gap in SignUpForm.
// const CONTACT_METHODS = [
//   { value: 'phone', label: 'Phone' },
//   { value: 'email', label: 'Email' },
// ]

// Staggered delays match the source design's waveform-bounce animation.
const WAVEFORM_BAR_DELAYS = [0.1, 0.3, 0.5, 0.2, 0.4]

const LoginForm = ({
  identity,
  onIdentityChange,
  password,
  onPasswordChange,
  showPassword,
  onToggleShowPassword,
  onSubmit,
  isSubmitting = false,
  onGoogleSuccess,
  onGoogleError,
  onForgotPassword,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          p: { xs: 3, sm: 4, md: 6 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: (t) => alpha(t.palette.background.paper, 0.7),
          backdropFilter: 'blur(12px)',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.25, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: 44 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChatIcon fontSize="small" />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.5, height: 32, px: 1 }}>
              {WAVEFORM_BAR_DELAYS.map((delay, index) => (
                <Box
                  animate={{ height: [8, 24, 8] }}
                  component={motion.div}
                  key={index}
                  sx={{ width: 3, borderRadius: 9999, bgcolor: 'primary.main' }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay }}
                />
              ))}
            </Box>

            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: (t) => alpha(t.palette.success.main, 0.15),
                color: 'success.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <GraphicEqIcon fontSize="small" />
            </Box>
          </Box>

          <Typography sx={{ textAlign: 'center', lineHeight: 1.3, letterSpacing: '-0.02em' }} variant="h2">
            Welcome back.
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2.5 }}
        >
          {/* Phone/Email toggle — commented out, not removed, until phone login
              is actually supported server-side. See the CONTACT_METHODS
              comment above for how this plugged in.
          <Box
            sx={{
              display: 'flex',
              p: 0.5,
              borderRadius: 2,
              bgcolor: 'action.hover',
            }}
          >
            {CONTACT_METHODS.map((option) => (
              <Button
                disableElevation
                key={option.value}
                onClick={() => onContactMethodChange(option.value)}
                sx={{
                  flex: 1,
                  borderRadius: 1.5,
                  py: 1,
                  bgcolor: contactMethod === option.value ? 'background.paper' : 'transparent',
                  color: contactMethod === option.value ? 'primary.main' : 'text.secondary',
                  boxShadow: contactMethod === option.value ? 1 : 0,
                  '&:hover': {
                    bgcolor: contactMethod === option.value ? 'background.paper' : 'transparent',
                  },
                }}
              >
                {option.label}
              </Button>
            ))}
          </Box>
          */}

          <Box>
            <Typography color="text.secondary" component="label" sx={{ mb: 0.5, display: 'block' }} variant="body2">
              Email Address
            </Typography>
            <AppTextFieldComponent
              onChange={(e) => onIdentityChange(e.target.value)}
              placeholder="name@company.com"
              required
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
              type="email"
              value={identity}
            />
          </Box>

          <Box>
            <Typography color="text.secondary" component="label" sx={{ mb: 0.5, display: 'block' }} variant="body2">
              Password
            </Typography>
            <AppTextFieldComponent
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="••••••••"
              required
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={onToggleShowPassword} size="small">
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              type={showPassword ? 'text' : 'password'}
              value={password}
            />
            <Link
              component="button"
              onClick={onForgotPassword}
              sx={{ display: 'block', mt: 0.75, textAlign: 'right', width: '100%', fontWeight: 500 }}
              type="button"
              underline="hover"
              variant="caption"
            >
              Forgot password?
            </Link>
          </Box>

          <AppButtonComponent fullWidth loading={isSubmitting} size="large" type="submit">
            Log in
          </AppButtonComponent>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }} variant="caption">
              or continue with
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>

          <GoogleAuthButton
            label="Sign in with Google"
            onError={onGoogleError}
            onSuccess={onGoogleSuccess}
            text="signin_with"
          />
        </Box>
      </Paper>

      <Typography color="text.secondary" sx={{ mt: 4, textAlign: 'center' }} variant="body2">
        New here?{' '}
        <Link href="/signup" sx={{ fontWeight: 700 }} underline="hover">
          Sign up.
        </Link>
      </Typography>
    </>
  )
}

export default LoginForm
