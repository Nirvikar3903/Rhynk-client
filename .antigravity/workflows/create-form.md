# Create Form Workflow

## No form library installed — open decision, don't assume one

Neither `react-hook-form` nor a schema-validation library (`yup`/`zod`) is
in `package.json`. This is an open decision, same category as the TanStack
Query gap in [[05-state-data-layer]] — don't silently pick one mid-feature.

- If a form library gets added, `react-hook-form` + a schema-validation
  library (`yup` or `zod`) is the natural pairing with MUI's `<Controller>`
  pattern (wrap each MUI input in a `Controller`, driven by a
  `yupResolver`/`zodResolver` schema).
- Until then, plain controlled components with local `useState` and MUI form
  primitives is the fallback — shown below.

## Template — plain controlled form (current default)

```jsx
// src/components/auth/LoginForm.jsx
import { useState } from 'react'
import { Box, TextField, Typography } from '@mui/material'
import { AppButtonComponent } from 'components/mui'

const LoginForm = ({ onSubmit, isSubmitting = false }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await onSubmit({ email, password })
    } catch (err) {
      // Map server error codes from docs/AUTH_MODULE.md — INVALID_CREDENTIALS,
      // EMAIL_NOT_VERIFIED, etc. — to user-facing copy here, not a generic message.
      setError(err?.response?.data?.code ?? 'UNKNOWN_ERROR')
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
      />
      <TextField
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
      />
      {error && (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      )}
      <AppButtonComponent type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </AppButtonComponent>
    </Box>
  )
}

export default LoginForm
```

## Auth forms specifically must match the server contract exactly

Login/register/OTP forms are not free-form — their fields are dictated by
`docs/AUTH_MODULE.md` (see [[06-auth-security]]): e.g. `verify-otp` needs
`email`, a 6-digit `otp`, `deviceId`, and `deviceType: 'WEB'` — don't design
a login form's fields independently of that contract.

## Checklist

- [ ] Client-side validation (required fields, email format) is a UX nicety
      — the server's Fastify JSON-schema validation (AJV) is the actual
      source of truth for what's accepted; don't over-invest in duplicating
      every server-side rule client-side before a form library is even
      chosen.
- [ ] Error messages map server error `code`s (see `docs/AUTH_MODULE.md`
      §6 error-code table) to copy — don't show raw error objects to users.
- [ ] Submit button disabled while in flight; no double-submit.
