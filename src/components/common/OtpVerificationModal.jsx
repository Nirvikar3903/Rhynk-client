import { Box, Typography, Divider, Link } from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import OtpInputGroup from 'components/common/OtpInputGroup'
import CommonModal from 'components/common/CommonModal'

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
  const isComplete = otp.length === otpLength

  return (
    <CommonModal
      ctaDisabled={!isComplete}
      ctaLabel="Verify"
      ctaLoading={isSubmitting}
      ctaSx={{ mt: -1 }}
      footer={
        trustNote && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', mt: 4 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, whiteSpace: 'nowrap' }} variant="caption">
              {trustNote}
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>
        )
      }
      formSx={{ alignItems: 'center', gap: 4 }}
      heading={title}
      icon={<LockIcon />}
      onClose={onClose}
      onSubmit={onSubmit}
      open={open}
      subheading={
        destination && (
          <>
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
          </>
        )
      }
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
    </CommonModal>
  )
}

export default OtpVerificationModal
