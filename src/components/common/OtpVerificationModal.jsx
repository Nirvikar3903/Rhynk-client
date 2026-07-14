import { Box, Dialog, IconButton, Typography, Divider, Link, alpha } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import LockIcon from '@mui/icons-material/Lock'
import AppButtonComponent from 'components/mui/AppButtonComponent'
import OtpInputGroup from 'components/common/OtpInputGroup'

// Generic OTP-entry modal — not auth-specific. Any flow that needs a 6-digit
// code confirmed (signup email verification today; phone verification or a
// login 2FA step later) opens this with its own copy/destination/handlers
// rather than forking a near-identical modal per flow.
const OtpVerificationModal = ({
  open,
  onClose,
  title = 'Enter the code',
  destination,
  onEditDestination,
  otpLength = 6,
  otp,
  onOtpChange,
  onSubmit,
  isSubmitting = false,
  resendSecondsRemaining = 0,
  onResend,
  isResending = false,
  trustNote = 'Trusted by millions of music lovers',
}) => {
  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit()
  }

  const isComplete = otp.length === otpLength

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
            bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <LockIcon />
        </Box>

        <Typography sx={{ textAlign: 'center', letterSpacing: '-0.02em', mb: 1 }} variant="h2">
          {title}
        </Typography>

        {destination && (
          <Typography color="text.secondary" sx={{ textAlign: 'center', mb: 4 }} variant="body1">
            Sent to {destination}
            {onEditDestination && (
              <Link
                component="button"
                onClick={onEditDestination}
                sx={{ fontWeight: 700, ml: 0.5 }}
                type="button"
                underline="hover"
              >
                Edit
              </Link>
            )}
          </Typography>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
        >
          <OtpInputGroup disabled={isSubmitting} length={otpLength} onChange={onOtpChange} value={otp} />

          {onResend && (
            <Typography color="text.secondary" variant="body2">
              {resendSecondsRemaining > 0 ? (
                <>
                  Resend code in{' '}
                  <Box component="span" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    0:{String(resendSecondsRemaining).padStart(2, '0')}
                  </Box>
                </>
              ) : (
                <Link component="button" disabled={isResending} onClick={onResend} sx={{ fontWeight: 700 }} type="button" underline="hover">
                  Resend Code
                </Link>
              )}
            </Typography>
          )}

          <AppButtonComponent disabled={!isComplete} fullWidth loading={isSubmitting} size="large" sx={{ mt: -1 }} type="submit">
            Verify
          </AppButtonComponent>

          {trustNote && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <Divider sx={{ flex: 1 }} />
              <Typography color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, whiteSpace: 'nowrap' }} variant="caption">
                {trustNote}
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>
          )}
        </Box>
      </Box>
    </Dialog>
  )
}

export default OtpVerificationModal
