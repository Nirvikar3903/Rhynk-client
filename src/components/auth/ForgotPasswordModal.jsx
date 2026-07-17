import { Box, Typography, Divider, Link, InputAdornment } from '@mui/material'
import LockResetIcon from '@mui/icons-material/LockReset'
import MailIcon from '@mui/icons-material/Mail'
import SendIcon from '@mui/icons-material/Send'
import AppTextFieldComponent from 'components/mui/AppTextFieldComponent'
import CommonModal from 'components/common/CommonModal'

// POST /auth/forgot-password/request takes { email } only — no username, no
// phone path (narrowed to match the real contract, confirmed against the
// live server — see .claude/rules/06-auth-security.md "don't invent a
// different auth flow shape; match this one").
const ForgotPasswordModal = ({ open, onClose, email, onEmailChange, onSubmit, isSubmitting = false }) => {
  return (
    <CommonModal
      ctaIcon={<SendIcon fontSize="small" />}
      ctaLabel="Send reset code"
      ctaLoading={isSubmitting}
      footer={
        <>
          <Divider sx={{ width: '100%', mt: 3 }} />
          <Typography color="text.secondary" sx={{ textAlign: 'center', width: '100%', mt: 3 }} variant="caption">
            Still having trouble?{' '}
            <Link href="#" sx={{ fontWeight: 700 }} underline="hover">
              Contact Support
            </Link>
          </Typography>
        </>
      }
      heading="Reset your password."
      icon={<LockResetIcon />}
      onClose={onClose}
      onSubmit={onSubmit}
      open={open}
      subheading="We'll send a reset code to your registered email."
    >
      <Box sx={{ width: '100%' }}>
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
    </CommonModal>
  )
}

export default ForgotPasswordModal
