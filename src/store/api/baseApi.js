import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setTokens, clearSession } from '../slices/auth.slice'
import { parseTokensResponse } from '../parsers/auth.parsers'
import { getDeviceId } from './deviceId'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken
    if (token) headers.set('authorization', `Bearer ${token}`)
    return headers
  },
})

// REFRESH_LOCKED (409) means another refresh for this token is already in
// flight server-side — back off and retry rather than treat it as a hard
// failure (docs/AUTH_MODULE.md / .claude/rules/06-auth-security.md).
const REFRESH_LOCK_RETRY_DELAY_MS = 300
const REFRESH_LOCK_MAX_ATTEMPTS = 3
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Serializes concurrent refresh attempts — if several queries 401 around the
// same time, they all await this single in-flight call instead of each
// firing their own /auth/refresh (which would race against the server's
// single-use refresh token rotation).
let refreshPromise = null

const requestRefresh = async (api, extraOptions) => {
  const { refreshToken } = api.getState().auth

  for (let attempt = 1; attempt <= REFRESH_LOCK_MAX_ATTEMPTS; attempt += 1) {
    const result = await rawBaseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
        body: { refreshToken, deviceId: getDeviceId() },
      },
      api,
      extraOptions,
    )

    if (result.error?.status === 409 && attempt < REFRESH_LOCK_MAX_ATTEMPTS) {
      await wait(REFRESH_LOCK_RETRY_DELAY_MS * attempt)
      continue
    }

    return result
  }

  return { error: { status: 'REFRESH_LOCK_EXHAUSTED' } }
}

// Wraps every request: on a 401, attempts one /auth/refresh, then retries
// the original request with the rotated access token. SESSION_REVOKED (or
// any other failed refresh) clears the session instead of retrying in a
// loop — see .claude/rules/06-auth-security.md. There's no protected route
// (or route guard reading selectIsAuthenticated) yet, so today this just
// resets `auth` state; once one exists it'll redirect to /login on its own.
const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions)

  if (result.error?.status !== 401 || args?.url === '/auth/refresh') {
    return result
  }

  if (!api.getState().auth.refreshToken) {
    api.dispatch(clearSession())
    return result
  }

  refreshPromise ??= requestRefresh(api, extraOptions).finally(() => {
    refreshPromise = null
  })
  const refreshResult = await refreshPromise
  const tokens = parseTokensResponse(refreshResult.data)

  if (!tokens?.accessToken) {
    api.dispatch(clearSession())
    return result
  }

  api.dispatch(setTokens(tokens))
  return rawBaseQuery(args, api, extraOptions)
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Conversation', 'Message', 'MusicRoom', 'Song', 'Playlist', 'Notification'],
  endpoints: () => ({}),
})
