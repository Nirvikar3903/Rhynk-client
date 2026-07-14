// POST /auth/register response — { email, userId, isVerified }
export const parseRegisterResponse = (response) => {
  if (!response) return null
  return {
    userId: response.userId,
    email: response.email,
    isVerified: Boolean(response.isVerified),
  }
}
