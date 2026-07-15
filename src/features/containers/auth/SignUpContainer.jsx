import { useState } from 'react'
import { toast } from 'sonner'
import SignUpForm from 'components/auth/SignUpForm'
import VerifyOtpContainer from 'features/containers/auth/VerifyOtpContainer'
import { useRegisterMutation } from 'store/api/auth.apislice'

// The confirmed /auth/register payload has no dedicated username field in
// this design (just name/email/password) but the API requires one — derive
// a reasonable default from the email's local part. Revisit once real
// backend testing confirms whether this heuristic is acceptable or a
// username field/availability check needs to be added to the UI.
const deriveUsername = (email) => email.split('@')[0]?.toLowerCase().replace(/[^a-z0-9_]/g, '') ?? ''

// Phone signup is designed but not wired — commented out in SignUpForm,
// not removed, until the backend supports a phone-based flow.
const SignUpContainer = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [verifyingEmail, setVerifyingEmail] = useState(null)
  const [register, { isLoading }] = useRegisterMutation()

  const handleSubmit = async () => {
    try {
      const result = await register({
        username: deriveUsername(email),
        email,
        password,
        name,
      }).unwrap()
      toast.success(`Account created for ${result.email} — check your inbox for the verification code.`)
      setVerifyingEmail(result.email)
      setName('')
      setEmail('')
      setPassword('')
      setShowPassword(false)
    } catch (err) {
      toast.error(err?.data?.code ?? 'Something went wrong. Please try again.')
    }
  }

  const handleGoogleSignUp = () => {
    toast.info('Google sign-up is not implemented yet.')
  }

  return (
    <>
      <SignUpForm
        email={email}
        isSubmitting={isLoading}
        name={name}
        onEmailChange={setEmail}
        onGoogleSignUp={handleGoogleSignUp}
        onNameChange={setName}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
        onToggleShowPassword={() => setShowPassword((prev) => !prev)}
        password={password}
        showPassword={showPassword}
      />
      <VerifyOtpContainer
        email={verifyingEmail}
        onClose={() => setVerifyingEmail(null)}
        onVerified={() => setVerifyingEmail(null)}
        open={Boolean(verifyingEmail)}
      />
    </>
  )
}

export default SignUpContainer
