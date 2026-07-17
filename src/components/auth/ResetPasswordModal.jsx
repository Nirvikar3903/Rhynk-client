import { Box, Typography, IconButton, InputAdornment } from '@mui/material'
import LockResetIcon from '@mui/icons-material/LockReset'
import MailIcon from '@mui/icons-material/Mail'
import LockIcon from '@mui/icons-material/Lock'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import AppTextFieldComponent from 'components/mui/AppTextFieldComponent'
import CommonModal from 'components/common/CommonModal'

// Final step of the forgot-password flow — POST /auth/forgot-password/reset
// takes { email, resetToken, newPassword }. resetToken comes from the
// previous verify step (LoginContainer), not from anything typed here, so
// this modal only ever asks for the two fields the user actually provides.
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
  return (
    <CommonModal
      ctaLabel="Reset password"
      ctaLoading={isSubmitting}
      heading="Set a new password."
      icon={<LockResetIcon />}
      onClose={onClose}
      onSubmit={onSubmit}
      open={open}
      subheading="Choose a new password for your account."
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

      <Box sx={{ width: '100%' }}>
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
    </CommonModal>
  )
}

export default ResetPasswordModal
