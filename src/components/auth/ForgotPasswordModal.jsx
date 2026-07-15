import { Box, Dialog, IconButton, Typography, Divider, Link, InputAdornment, alpha } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import LockResetIcon from '@mui/icons-material/LockReset'
import MailIcon from '@mui/icons-material/Mail'
import SendIcon from '@mui/icons-material/Send'
import AppButtonComponent from 'components/mui/AppButtonComponent'
import AppTextFieldComponent from 'components/mui/AppTextFieldComponent'

// No forgot/reset-password endpoint exists in the documented auth contract
// (.claude/rules/06-auth-security.md lists only 6 endpoints, none of them
// this) — built to match the visual design, submission stubbed via a toast
// in ForgotPasswordContainer until a real endpoint is confirmed.
const ForgotPasswordModal = ({ open, onClose, identity, onIdentityChange, onSubmit, isSubmitting = false }) => {
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
          Reset your password.
        </Typography>
        <Typography color="text.secondary" sx={{ textAlign: 'center', maxWidth: 320, mb: 4 }} variant="body1">
          We&apos;ll send a reset code to your registered email or phone.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}
        >
          <Box>
            <Typography color="text.secondary" component="label" sx={{ mb: 0.5, display: 'block' }} variant="body2">
              Email or Phone
            </Typography>
            <AppTextFieldComponent
              onChange={(e) => onIdentityChange(e.target.value)}
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
              type="text"
              value={identity}
            />
          </Box>

          <AppButtonComponent endIcon={<SendIcon fontSize="small" />} fullWidth loading={isSubmitting} size="large" type="submit">
            Send reset code
          </AppButtonComponent>

          <Divider />

          <Typography color="text.secondary" sx={{ textAlign: 'center' }} variant="caption">
            Still having trouble?{' '}
            <Link href="#" sx={{ fontWeight: 700 }} underline="hover">
              Contact Support
            </Link>
          </Typography>
        </Box>
      </Box>
    </Dialog>
  )
}

export default ForgotPasswordModal
