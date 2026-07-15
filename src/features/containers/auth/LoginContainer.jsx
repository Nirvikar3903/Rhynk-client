import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import LoginForm from 'components/auth/LoginForm'
import ForgotPasswordContainer from 'features/containers/auth/ForgotPasswordContainer'
import { useLoginMutation } from 'store/api/auth.apislice'

// Phone login is designed but not wired — commented out in LoginForm, not
// removed, until the backend supports a phone-based flow. Same pattern as
// the phone-signup gap in SignUpContainer.
const LoginContainer = () => {
  const navigate = useNavigate()
  const [identity, setIdentity] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)
  const [login, { isLoading }] = useLoginMutation()

  const handleSubmit = async () => {
    try {
      await login({ email: identity, password }).unwrap()
      toast.success('Welcome back!')
      navigate('/home')
    } catch (err) {
      toast.error(err?.data?.code ?? 'Something went wrong. Please try again.')
    }
  }

  const handleGoogleLogin = () => {
    toast.info('Google sign-in is not implemented yet.')
  }

  return (
    <>
      <LoginForm
        identity={identity}
        isSubmitting={isLoading}
        onForgotPassword={() => setIsForgotPasswordOpen(true)}
        onGoogleLogin={handleGoogleLogin}
        onIdentityChange={setIdentity}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
        onToggleShowPassword={() => setShowPassword((prev) => !prev)}
        password={password}
        showPassword={showPassword}
      />
      <ForgotPasswordContainer onClose={() => setIsForgotPasswordOpen(false)} open={isForgotPasswordOpen} />
    </>
  )
}

export default LoginContainer
