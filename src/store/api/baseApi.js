import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setTokens, clearSession } from '../slices/auth.slice'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.accessToken || localStorage.getItem('rhynk_access_token')
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error?.status === 401 && args?.url !== '/auth/refresh') {
    const refreshToken =
      api.getState().auth?.refreshToken || localStorage.getItem('rhynk_refresh_token')

    if (refreshToken) {
      const refreshResult = await rawBaseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions,
      )

      const newAccessToken =
        refreshResult.data?.data?.accessToken || refreshResult.data?.accessToken
      const newRefreshToken =
        refreshResult.data?.data?.refreshToken ||
        refreshResult.data?.refreshToken ||
        refreshToken

      if (newAccessToken) {
        api.dispatch(setTokens({ accessToken: newAccessToken, refreshToken: newRefreshToken }))
        // Retry the original failed request seamlessly
        result = await rawBaseQuery(args, api, extraOptions)
      } else {
        api.dispatch(clearSession())
      }
    } else {
      api.dispatch(clearSession())
    }
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Conversation', 'Message', 'MusicRoom', 'Song', 'Playlist', 'Notification'],
  endpoints: () => ({}),
})
