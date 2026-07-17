import { useState } from 'react'
import { toast } from 'sonner'
import ForgotPasswordModal from 'components/auth/ForgotPasswordModal'
import OtpVerificationModal from 'components/common/OtpVerificationModal'
import ResetPasswordModal from 'components/auth/ResetPasswordModal'
import {
  useForgotPasswordRequestMutation,
  useForgotPasswordVerifyMutation,
  useForgotPasswordResetMutation,
} from 'store/api/auth.apislice'

// Three-step flow, each step its own modal (never more than one open at
// once): request (username + email) → the generic OTP modal reused as-is
// from signup → set a new password. The resetToken powering the final step
// comes from the verify response, not from anything the user types.
const ForgotPasswordContainer = ({ open, onClose }) => {
  const [step, setStep] = useState('request')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [resetToken, setResetToken] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [requestReset, { isLoading: isRequesting }] = useForgotPasswordRequestMutation()
  const [verifyReset, { isLoading: isVerifying }] = useForgotPasswordVerifyMutation()
  const [resetPassword, { isLoading: isResetting }] = useForgotPasswordResetMutation()

  const resetState = () => {
    setStep('request')
    setUsername('')
    setEmail('')
    setOtp('')
    setResetToken(null)
    setNewPassword('')
    setShowNewPassword(false)
  }

  const handleFullClose = () => {
    resetState()
    onClose()
  }

  const handleRequestSubmit = async () => {
    try {
      await requestReset({ username, email }).unwrap()
      toast.success('A reset code has been sent to your email.')
      setStep('verify')
    } catch (err) {
      toast.error(err?.data?.code ?? 'Something went wrong. Please try again.')
    }
  }

  const handleVerifySubmit = async () => {
    try {
      const result = await verifyReset({ email, otp }).unwrap()
      setResetToken(result?.resetToken ?? null)
      setStep('reset')
    } catch (err) {
      toast.error(err?.data?.code ?? 'Invalid or expired code. Please try again.')
    }
  }

  const handleResetSubmit = async () => {
    try {
      await resetPassword({ email, resetToken, newPassword }).unwrap()
      toast.success('Password reset — you can now log in with your new password.')
      handleFullClose()
    } catch (err) {
      toast.error(err?.data?.code ?? 'Something went wrong. Please try again.')
    }
  }

  return (
    <>
      <ForgotPasswordModal
        email={email}
        isSubmitting={isRequesting}
        onClose={handleFullClose}
        onEmailChange={setEmail}
        onSubmit={handleRequestSubmit}
        onUsernameChange={setUsername}
        open={open && step === 'request'}
        username={username}
      />
      <OtpVerificationModal
        destination={email}
        isSubmitting={isVerifying}
        onClose={handleFullClose}
        onEditDestination={() => setStep('request')}
        onOtpChange={setOtp}
        onSubmit={handleVerifySubmit}
        open={open && step === 'verify'}
        otp={otp}
        title="Reset your password."
        trustNote={null}
      />
      <ResetPasswordModal
        email={email}
        isSubmitting={isResetting}
        newPassword={newPassword}
        onClose={handleFullClose}
        onEmailChange={setEmail}
        onNewPasswordChange={setNewPassword}
        onSubmit={handleResetSubmit}
        onToggleShowNewPassword={() => setShowNewPassword((prev) => !prev)}
        open={open && step === 'reset'}
        showNewPassword={showNewPassword}
      />
    </>
  )
}

export default ForgotPasswordContainer
