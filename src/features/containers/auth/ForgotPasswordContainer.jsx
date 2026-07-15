import { useState } from 'react'
import { toast } from 'sonner'
import ForgotPasswordModal from 'components/auth/ForgotPasswordModal'

// No forgot/reset-password endpoint exists in the documented auth contract
// (.claude/rules/06-auth-security.md lists only 6 endpoints, none of them
// this) — submission is stubbed with a toast until a real endpoint is
// confirmed, same pattern as phone login / Google sign-in elsewhere.
const ForgotPasswordContainer = ({ open, onClose }) => {
  const [identity, setIdentity] = useState('')

  const handleClose = () => {
    setIdentity('')
    onClose()
  }

  const handleSubmit = () => {
    toast.info("Password reset isn't available yet — check back soon.")
    handleClose()
  }

  return (
    <ForgotPasswordModal
      identity={identity}
      onClose={handleClose}
      onIdentityChange={setIdentity}
      onSubmit={handleSubmit}
      open={open}
    />
  )
}

export default ForgotPasswordContainer
