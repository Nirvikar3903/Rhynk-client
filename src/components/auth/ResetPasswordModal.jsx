import { Box, Dialog, IconButton, Typography, InputAdornment, alpha } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import LockResetIcon from '@mui/icons-material/LockReset'
import MailIcon from '@mui/icons-material/Mail'
import LockIcon from '@mui/icons-material/Lock'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import AppButtonComponent from 'components/mui/AppButtonComponent'
import AppTextFieldComponent from 'components/mui/AppTextFieldComponent'

// Final step of the forgot-password flow — POST /auth/forgot-password/reset
// takes { email, resetToken, newPassword }. resetToken comes from the
// previous verify step (ForgotPasswordContainer), not from anything typed
// here, so this modal only ever asks for the two fields the user actually
// provides.
const ResetPasswordModal = ({
  open,
  onClose,
  email,
  onEmailChange,
  newPassword,
  onNewPasswordChange,
  showNewPassword,
  onToggleShowNewPassword,
  onSubmit,
  isSubmitting = false,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      onClose={onClose}
      open={open}
      slotProps={{
        paper: {
          sx: {
            position: 'relative',
            borderRadius: 2,
            p: { xs: 3, sm: 4 },
            bgcolor: (t) => alpha(t.palette.background.paper, 0.95),
            backdropFilter: 'blur(12px)',
          },
        },
      }}
    >
      <IconButton
        aria-label="Close"
        onClick={onClose}
        size="small"
        sx={{ position: 'absolute', top: 12, right: 12 }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <LockResetIcon />
        </Box>

        <Typography sx={{ textAlign: 'center', letterSpacing: '-0.02em', mb: 1 }} variant="h2">
          Set a new password.
        </Typography>
        <Typography color="text.secondary" sx={{ textAlign: 'center', maxWidth: 320, mb: 4 }} variant="body1">
          Choose a new password for your account.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}
        >
          <Box>
            <Typography color="text.secondary" component="label" sx={{ mb: 0.5, display: 'block' }} variant="body2">
              Email
            </Typography>
            <AppTextFieldComponent
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="e.g. name@company.com"
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
              value={email}
            />
          </Box>

          <Box>
            <Typography color="text.secondary" component="label" sx={{ mb: 0.5, display: 'block' }} variant="body2">
              New Password
            </Typography>
            <AppTextFieldComponent
              onChange={(e) => onNewPasswordChange(e.target.value)}
              placeholder="At least 8 characters"
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
                      <IconButton edge="end" onClick={onToggleShowNewPassword} size="small">
                        {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
            />
          </Box>

          <AppButtonComponent fullWidth loading={isSubmitting} size="large" type="submit">
            Reset password
          </AppButtonComponent>
        </Box>
      </Box>
    </Dialog>
  )
}

export default ResetPasswordModal
