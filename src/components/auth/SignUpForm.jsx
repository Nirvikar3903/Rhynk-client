import { Box, Paper, Typography, IconButton, InputAdornment, Divider, Link, alpha } from '@mui/material'
// import Button from '@mui/material/Button' // only needed by the commented-out phone/email toggle below
import MicIcon from '@mui/icons-material/Mic'
import GraphicEqIcon from '@mui/icons-material/GraphicEq'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import AppButtonComponent from 'components/mui/AppButtonComponent'
import AppTextFieldComponent from 'components/mui/AppTextFieldComponent'
import PasswordStrengthMeter from 'components/common/PasswordStrengthMeter'

// Phone signup is designed but not wired — POST /auth/register (see
// docs/AUTH_MODULE.md / the real payload the team confirmed) is email-only
// today. Kept here, commented, rather than deleted, so it's a quick re-enable
// once the backend supports a phone-based flow.
// const CONTACT_METHODS = [
//   { value: 'phone', label: 'Phone' },
//   { value: 'email', label: 'Email' },
// ]

const GoogleIcon = () => (
  <svg height="20" viewBox="0 0 24 24" width="20">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
)

const SignUpForm = ({
  username,
  onUsernameChange,
  email,
  onEmailChange,
  password,
  onPasswordChange,
  showPassword,
  onToggleShowPassword,
  onSubmit,
  isSubmitting = false,
  onGoogleSignUp,
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
        p: { xs: 3, sm: 4, md: 8 },
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
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              boxShadow: 3,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'rotate(-6deg)',
            }}
          >
            <MicIcon fontSize="small" />
          </Box>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              boxShadow: 3,
              bgcolor: 'background.paper',
              color: 'primary.main',
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'rotate(6deg)',
            }}
          >
            <GraphicEqIcon fontSize="small" />
          </Box>
        </Box>
        <Typography
          sx={{ textAlign: 'center', lineHeight: 1.3, letterSpacing: '-0.02em' }}
          variant="h2"
        >
          Create your account.
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ textAlign: 'center', maxWidth: 280, lineHeight: 1.5 }}
          variant="body2"
        >
          Join Rhynk to experience music together in high-fidelity rooms.
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2.5 }}
      >
        {/* Phone/Email toggle — commented out, not removed, until phone signup
            is actually supported server-side. See the CONTACT_METHODS comment
            above for how this plugged in.
        <Box
          sx={{
            display: 'flex',
            p: 0.5,
            borderRadius: 9999,
            bgcolor: 'action.hover',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {CONTACT_METHODS.map((option) => (
            <Button
              key={option.value}
              disableElevation
              onClick={() => onContactMethodChange(option.value)}
              sx={{
                flex: 1,
                borderRadius: 9999,
                py: 1,
                textTransform: 'none',
                fontWeight: 500,
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

        <AppTextFieldComponent
          label="Username"
          onChange={(e) => onUsernameChange(e.target.value)}
          placeholder="jordan_rivera"
          required
          type="text"
          value={username}
        />

        <AppTextFieldComponent
          label="Email Address"
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="you@example.com"
          required
          type="email"
          value={email}
        />

        <Box>
          <AppTextFieldComponent
            label="Password"
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="At least 8 characters"
            required
            slotProps={{
              input: {
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
          <PasswordStrengthMeter password={password} />
        </Box>

        <AppButtonComponent fullWidth loading={isSubmitting} size="large" type="submit">
          Continue
        </AppButtonComponent>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Divider sx={{ flex: 1 }} />
          <Typography color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }} variant="caption">
            or
          </Typography>
          <Divider sx={{ flex: 1 }} />
        </Box>

        <AppButtonComponent
          color="inherit"
          fullWidth
          onClick={onGoogleSignUp}
          size="large"
          startIcon={<GoogleIcon />}
          sx={{ color: 'text.primary', borderColor: 'divider' }}
          type="button"
          variant="outlined"
        >
          Sign up with Google
        </AppButtonComponent>
      </Box>

      <Typography color="text.secondary" sx={{ mt: 4 }} variant="body2">
        Already have an account?{' '}
        <Link href="/login" sx={{ fontWeight: 700 }} underline="hover">
          Log in.
        </Link>
      </Typography>
    </Paper>

    <Typography
      color="text.secondary"
      component="p"
      sx={{ textAlign: 'center', mt: 3, px: 2, lineHeight: 1.6 }}
      variant="caption"
    >
      By clicking &quot;Continue&quot;, you agree to Rhynk&apos;s{' '}
      <Link href="/terms" underline="hover">
        Terms of Service
      </Link>{' '}
      and{' '}
      <Link href="/privacy" underline="hover">
        Privacy Policy
      </Link>
      .
    </Typography>
    </>
  )
}

export default SignUpForm
