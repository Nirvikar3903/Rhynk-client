import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import OtpVerificationModal from 'components/common/OtpVerificationModal'
import { useVerifyOtpMutation, useResendOtpMutation } from 'store/api/auth.apislice'

const RESEND_COOLDOWN_SECONDS = 30

// Matches the confirmed 30s per-email cooldown docs/AUTH_MODULE.md §7 notes
// server-side — this timer is purely a UX countdown, not a substitute for
// that server-side enforcement (see .claude/rules/06-auth-security.md).
const maskEmail = (email) => {
  const [local, domain] = email.split('@')
  if (!domain) return email
  const visible = local.slice(0, 2)
  const hidden = '•'.repeat(Math.max(local.length - visible.length, 3))
  return `${visible}${hidden}@${domain}`
}

// Renders as a modal over whatever screen opened it (signup today) rather
// than a route of its own — `open`/`email` are owned by the caller.
const VerifyOtpContainer = ({ open, email, onClose, onVerified }) => {
  const [otp, setOtp] = useState('')
  const [resendSecondsRemaining, setResendSecondsRemaining] = useState(RESEND_COOLDOWN_SECONDS)
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation()
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation()

  // The modal stays mounted across opens (only `open` toggles the Dialog),
  // so state from a previous attempt needs clearing on the open transition.
  // Adjusted during render (React's documented alternative to an effect that
  // only exists to sync state off a prop change) rather than in a useEffect.
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setOtp('')
      setResendSecondsRemaining(RESEND_COOLDOWN_SECONDS)
    }
  }

  useEffect(() => {
    if (!open || resendSecondsRemaining <= 0) return undefined
    const timer = setInterval(() => {
      setResendSecondsRemaining((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [open, resendSecondsRemaining])

  const handleSubmit = async () => {
    try {
      await verifyOtp({ email, otp }).unwrap()
      toast.success('Account verified! You can now log in.')
      onVerified?.()
    } catch (err) {
      toast.error(err?.data?.code ?? 'Invalid or expired code. Please try again.')
    }
  }

  const handleResend = async () => {
    try {
      await resendOtp({ email }).unwrap()
      setResendSecondsRemaining(RESEND_COOLDOWN_SECONDS)
      toast.success('A new code has been sent.')
    } catch (err) {
      toast.error(err?.data?.code ?? 'Could not resend the code. Please try again.')
    }
  }

  return (
    <OtpVerificationModal
      destination={email ? maskEmail(email) : ''}
      isResending={isResending}
      isSubmitting={isVerifying}
      onClose={onClose}
      onEditDestination={onClose}
      onOtpChange={setOtp}
      onResend={handleResend}
      onSubmit={handleSubmit}
      open={open}
      otp={otp}
      resendSecondsRemaining={resendSecondsRemaining}
    />
  )
}

export default VerifyOtpContainer
