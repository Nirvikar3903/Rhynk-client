import { baseApi } from './baseApi'
import { setSession, clearSession } from '../slices/auth.slice'
import { parseRegisterResponse, parseSessionResponse } from '../parsers/auth.parsers'
import { getDeviceId } from './deviceId'

// deviceType is always WEB since this is a web client (see
// .claude/rules/06-auth-security.md). /auth/refresh isn't an endpoint here —
// baseApi's baseQueryWithReauth calls it directly and automatically on a 401
// (see store/api/baseApi.js), so there's nothing for the UI to trigger.

// Every /auth endpoint in docs/AUTH_MODULE.md §4 is a POST — there is no
// documented GET/query endpoint (e.g. no "GET /auth/me"), so this slice is
// mutation-only. Don't add a builder.query here without a real endpoint to
// back it — see .claude/rules/06-auth-security.md ("don't invent a different
// auth flow shape; match this one").
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Payload confirmed directly by the team as { username, email, password,
    // name } — note docs/AUTH_MODULE.md §4.1 only lists { username, email,
    // password } (no `name`); that doc is stale on this point, this is the
    // real contract. `username` is derived client-side from the email (see
    // SignUpContainer) since the current design has no dedicated username
    // field.
    register: builder.mutation({
      query: ({ username, email, password, name }) => ({
        url: '/auth/register',
        method: 'POST',
        body: { username, email, password, name },
      }),
      transformResponse: parseRegisterResponse,
    }),

    verifyOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: { email, otp, deviceId: getDeviceId(), deviceType: 'WEB' },
      }),
      transformResponse: parseSessionResponse,
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled
        dispatch(setSession(data))
      },
    }),

    login: builder.mutation({
      query: ({ email, password }) => ({
        url: '/auth/login',
        method: 'POST',
        body: { email, password, deviceId: getDeviceId(), deviceType: 'WEB' },
      }),
      transformResponse: parseSessionResponse,
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled
        dispatch(setSession(data))
      },
    }),

    resendOtp: builder.mutation({
      query: ({ email }) => ({
        url: '/auth/resend-otp',
        method: 'POST',
        body: { email },
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
        body: { deviceId: getDeviceId() },
      }),
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        await queryFulfilled
        dispatch(clearSession())
      },
    }),
  }),
})

export const {
  useRegisterMutation,
  useVerifyOtpMutation,
  useLoginMutation,
  useResendOtpMutation,
  useLogoutMutation,
} = authApi
