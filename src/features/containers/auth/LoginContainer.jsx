import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import LoginForm from 'components/auth/LoginForm'
import ForgotPasswordModal from 'components/auth/ForgotPasswordModal'
import OtpVerificationModal from 'components/common/OtpVerificationModal'
import ResetPasswordModal from 'components/auth/ResetPasswordModal'
import {
  useLoginMutation,
  useGoogleLoginMutation,
  useForgotPasswordRequestMutation,
  useForgotPasswordVerifyMutation,
  useForgotPasswordResetMutation,
} from 'store/api/auth.apislice'

// Phone login is designed but not wired — commented out in LoginForm, not
// removed, until the backend supports a phone-based flow. Same pattern as
// the phone-signup gap in SignUpContainer.
const LoginContainer = () => {
  const navigate = useNavigate()
  const [identity, setIdentity] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [login, { isLoading }] = useLoginMutation()
  const [googleLogin, { isLoading: isGoogleLoggingIn }] = useGoogleLoginMutation()

  // Forgot-password flow: three steps, each its own modal (never more than
  // one open at once): request (email only) → the generic OTP modal reused
  // as-is from signup → set a new password. The resetToken powering the
  // final step comes from the verify response, not from anything the user
  // types.
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)
  const [step, setStep] = useState('request')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [resetToken, setResetToken] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [requestReset, { isLoading: isRequesting }] = useForgotPasswordRequestMutation()
  const [verifyReset, { isLoading: isVerifying }] = useForgotPasswordVerifyMutation()
  const [resetPassword, { isLoading: isResetting }] = useForgotPasswordResetMutation()

  const handleSubmit = async () => {
    try {
      await login({ email: identity, password }).unwrap()
      toast.success('Welcome back!')
      navigate('/home')
    } catch (err) {
      toast.error(err?.data?.error?.message || err?.data?.message || err?.data?.code || 'Something went wrong. Please try again.')
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      if (!credentialResponse?.credential) {
        toast.error('Google credential not received. Please try again.')
        return
      }
      await googleLogin({ idToken: credentialResponse.credential }).unwrap()
      toast.success('Welcome back!')
      navigate('/home')
    } catch (err) {
      toast.error(
        err?.data?.error?.message ||
        err?.data?.message ||
        err?.data?.code ||
        'Google sign-in failed. Please try again.'
      )
    }
  }

  const handleGoogleError = () => {
    toast.error('Google sign-in was cancelled or failed.')
  }

  const resetForgotPasswordState = () => {
    setStep('request')
    setEmail('')
    setOtp('')
    setResetToken(null)
    setNewPassword('')
    setShowNewPassword(false)
  }

  const handleForgotPasswordClose = () => {
    resetForgotPasswordState()
    setIsForgotPasswordOpen(false)
  }

  const handleRequestSubmit = async () => {
    try {
      await requestReset({ email }).unwrap()
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
      handleForgotPasswordClose()
    } catch (err) {
      toast.error(err?.data?.code ?? 'Something went wrong. Please try again.')
    }
  }

  return (
    <>
      <LoginForm
        identity={identity}
        isSubmitting={isLoading || isGoogleLoggingIn}
        onForgotPassword={() => setIsForgotPasswordOpen(true)}
        onGoogleError={handleGoogleError}
        onGoogleSuccess={handleGoogleSuccess}
        onIdentityChange={setIdentity}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
        onToggleShowPassword={() => setShowPassword((prev) => !prev)}
        password={password}
        showPassword={showPassword}
      />
      <ForgotPasswordModal
        email={email}
        isSubmitting={isRequesting}
        onClose={handleForgotPasswordClose}
        onEmailChange={setEmail}
        onSubmit={handleRequestSubmit}
        open={isForgotPasswordOpen && step === 'request'}
      />
      <OtpVerificationModal
        destination={email}
        isSubmitting={isVerifying}
        onClose={handleForgotPasswordClose}
        onEditDestination={() => setStep('request')}
        onOtpChange={setOtp}
        onSubmit={handleVerifySubmit}
        open={isForgotPasswordOpen && step === 'verify'}
        otp={otp}
        title="Reset your password."
        trustNote={null}
      />
      <ResetPasswordModal
        email={email}
        isSubmitting={isResetting}
        newPassword={newPassword}
        onClose={handleForgotPasswordClose}
        onEmailChange={setEmail}
        onNewPasswordChange={setNewPassword}
        onSubmit={handleResetSubmit}
        onToggleShowNewPassword={() => setShowNewPassword((prev) => !prev)}
        open={isForgotPasswordOpen && step === 'reset'}
        showNewPassword={showNewPassword}
      />
    </>
  )
}

export default LoginContainer
