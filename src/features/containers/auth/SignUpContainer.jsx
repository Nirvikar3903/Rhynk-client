import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import SignUpForm from 'components/auth/SignUpForm'
import OtpVerificationModal from 'components/common/OtpVerificationModal'
import {
  useRegisterMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useGoogleLoginMutation,
} from 'store/api/auth.apislice'

const RESEND_COOLDOWN_SECONDS = 60

// Client-side UX countdown only — docs/AUTH_MODULE.md §7 notes a 30s
// per-email cooldown enforced server-side, so this is intentionally the
// longer of the two; it's not a substitute for that server-side enforcement
// (see .claude/rules/06-auth-security.md).
const maskEmail = (email) => {
  const [local, domain] = email.split('@')
  if (!domain) return email
  const visible = local.slice(0, 2)
  const hidden = '•'.repeat(Math.max(local.length - visible.length, 3))
  return `${visible}${hidden}@${domain}`
}

// Phone signup is designed but not wired — commented out in SignUpForm,
// not removed, until the backend supports a phone-based flow.
const SignUpContainer = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [register, { isLoading }] = useRegisterMutation()
  const [googleLogin, { isLoading: isGoogleLoggingIn }] = useGoogleLoginMutation()

  // OTP verification step, opened once registration succeeds. Renders as a
  // modal over the signup screen rather than a route of its own.
  const [verifyingEmail, setVerifyingEmail] = useState(null)
  const [otp, setOtp] = useState('')
  const [resendSecondsRemaining, setResendSecondsRemaining] = useState(RESEND_COOLDOWN_SECONDS)
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation()
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation()

  const isOtpOpen = Boolean(verifyingEmail)

  // The modal stays mounted across opens (only `isOtpOpen` toggles the
  // Dialog), so state from a previous attempt needs clearing on the open
  // transition. Adjusted during render (React's documented alternative to an
  // effect that only exists to sync state off a prop change) rather than in
  // a useEffect.
  const [wasOtpOpen, setWasOtpOpen] = useState(isOtpOpen)
  if (isOtpOpen !== wasOtpOpen) {
    setWasOtpOpen(isOtpOpen)
    if (isOtpOpen) {
      setOtp('')
      setResendSecondsRemaining(RESEND_COOLDOWN_SECONDS)
    }
  }

  useEffect(() => {
    if (!isOtpOpen || resendSecondsRemaining <= 0) return undefined
    const timer = setInterval(() => {
      setResendSecondsRemaining((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [isOtpOpen, resendSecondsRemaining])

  const handleSubmit = async () => {
    try {
      const result = await register({ username, email, password }).unwrap()
      toast.success(`Account created for ${result.email} — check your inbox for the verification code.`)
      setVerifyingEmail(result.email)
      setUsername('')
      setEmail('')
      setPassword('')
      setShowPassword(false)
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
      toast.success('Welcome to Rhynk!')
      navigate('/home')
    } catch (err) {
      toast.error(
        err?.data?.error?.message ||
        err?.data?.message ||
        err?.data?.code ||
        'Google sign-up failed. Please try again.'
      )
    }
  }

  const handleGoogleError = () => {
    toast.error('Google sign-up was cancelled or failed.')
  }

  const handleVerifyOtpSubmit = async () => {
    try {
      await verifyOtp({ email: verifyingEmail, otp }).unwrap()
      toast.success('Account verified! You can now log in.')
      setVerifyingEmail(null)
      navigate('/login')
    } catch (err) {
      toast.error(err?.data?.error?.message || err?.data?.message || err?.data?.code || 'Invalid or expired code. Please try again.')
    }
  }

  const handleResendOtp = async () => {
    try {
      await resendOtp({ email: verifyingEmail }).unwrap()
      setResendSecondsRemaining(RESEND_COOLDOWN_SECONDS)
      toast.success('A new code has been sent.')
    } catch (err) {
      toast.error(err?.data?.error?.message || err?.data?.message || err?.data?.code || 'Could not resend the code. Please try again.')
    }
  }

  return (
    <>
      <SignUpForm
        email={email}
        isSubmitting={isLoading || isGoogleLoggingIn}
        onEmailChange={setEmail}
        onGoogleError={handleGoogleError}
        onGoogleSuccess={handleGoogleSuccess}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
        onToggleShowPassword={() => setShowPassword((prev) => !prev)}
        onUsernameChange={setUsername}
        password={password}
        showPassword={showPassword}
        username={username}
      />
      <OtpVerificationModal
        destination={verifyingEmail ? maskEmail(verifyingEmail) : ''}
        isResending={isResending}
        isSubmitting={isVerifying}
        onClose={() => setVerifyingEmail(null)}
        onEditDestination={() => setVerifyingEmail(null)}
        onOtpChange={setOtp}
        onResend={handleResendOtp}
        onSubmit={handleVerifyOtpSubmit}
        open={isOtpOpen}
        otp={otp}
        resendSecondsRemaining={resendSecondsRemaining}
      />
    </>
  )
}

export default SignUpContainer
