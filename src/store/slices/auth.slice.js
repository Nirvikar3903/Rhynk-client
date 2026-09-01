import { createSlice } from '@reduxjs/toolkit'

const savedToken = localStorage.getItem('rhynk_access_token')
const savedRefreshToken = localStorage.getItem('rhynk_refresh_token')
let savedUser = null
try {
  savedUser = JSON.parse(localStorage.getItem('rhynk_user') || 'null')
} catch {
  savedUser = null
}

const initialState = {
  user: savedUser,
  accessToken: savedToken || null,
  refreshToken: savedRefreshToken || null,
  isAuthenticated: Boolean(savedToken),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.isAuthenticated = true
      if (action.payload.accessToken) {
        localStorage.setItem('rhynk_access_token', action.payload.accessToken)
      }
      if (action.payload.refreshToken) {
        localStorage.setItem('rhynk_refresh_token', action.payload.refreshToken)
      }
      if (action.payload.user) {
        localStorage.setItem('rhynk_user', JSON.stringify(action.payload.user))
      }
    },
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      if (action.payload.accessToken) {
        localStorage.setItem('rhynk_access_token', action.payload.accessToken)
      }
      if (action.payload.refreshToken) {
        localStorage.setItem('rhynk_refresh_token', action.payload.refreshToken)
      }
    },
    clearSession: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      localStorage.removeItem('rhynk_access_token')
      localStorage.removeItem('rhynk_refresh_token')
      localStorage.removeItem('rhynk_user')
    },
  },
})

export const { setSession, setTokens, clearSession } = authSlice.actions
export const selectUser = (state) => state.auth.user
export const selectAccessToken = (state) => state.auth.accessToken
export const selectRefreshToken = (state) => state.auth.refreshToken
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated

export const selectCurrentUserId = (state) => {
  const user = state.auth.user
  if (user?.id) return user.id
  if (user?.userId) return user.userId
  if (user?._id) return user._id

  const token = state.auth.accessToken || localStorage.getItem('rhynk_access_token')
  if (token) {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      )
      const parsed = JSON.parse(jsonPayload)
      return parsed.id || parsed.userId || parsed.sub || parsed.user?.id || null
    } catch {
      // Ignored
    }
  }
  return null
}

export default authSlice.reducer
