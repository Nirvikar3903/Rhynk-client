import { useState } from 'react'
import { toast } from 'sonner'
import SignUpForm from 'components/auth/SignUpForm'
import VerifyOtpContainer from 'features/containers/auth/VerifyOtpContainer'
import { useRegisterMutation } from 'store/api/auth.apislice'

// Phone signup is designed but not wired — commented out in SignUpForm,
// not removed, until the backend supports a phone-based flow.
const SignUpContainer = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [verifyingEmail, setVerifyingEmail] = useState(null)
  const [register, { isLoading }] = useRegisterMutation()

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
        onEmailChange={setEmail}
        onGoogleSignUp={handleGoogleSignUp}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
        onToggleShowPassword={() => setShowPassword((prev) => !prev)}
        onUsernameChange={setUsername}
        password={password}
        showPassword={showPassword}
        username={username}
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
