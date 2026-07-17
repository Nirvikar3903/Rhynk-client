// Every /auth success response is wrapped { success, message, data } by the
// live server — docs/AUTH_MODULE.md's payload tables describe the inner
// `data` shape only, not this envelope. Error responses are flat
// { success, message, code } instead, so error handling (`err?.data?.code`
// in the containers) doesn't need this unwrap.

// POST /auth/register response — data: { email, userId, isVerified }
export const parseRegisterResponse = (response) => {
  if (!response?.data) return null
  return {
    userId: response.data.userId,
    email: response.data.email,
    isVerified: Boolean(response.data.isVerified),
  }
}

// POST /auth/login, /auth/verify-otp response — data: { accessToken, refreshToken, user }
export const parseSessionResponse = (response) => {
  if (!response?.data) return null
  const { accessToken, refreshToken, user } = response.data
  return { accessToken, refreshToken, user }
}

// POST /auth/refresh response — data: { accessToken, refreshToken } (rotated pair, no user)
export const parseTokensResponse = (response) => {
  if (!response?.data) return null
  const { accessToken, refreshToken } = response.data
  return { accessToken, refreshToken }
}

// POST /auth/forgot-password/verify response — data: { resetToken }, needed by
// the following /auth/forgot-password/reset call. Not directly confirmed
// against a real OTP (no live inbox to complete one) — this follows the same
// { data: {...} } envelope every other endpoint uses; adjust here first if
// the real field name/shape turns out to differ.
export const parseResetTokenResponse = (response) => {
  if (!response?.data) return null
  return { resetToken: response.data.resetToken }
}
