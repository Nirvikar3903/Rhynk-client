import { baseApi } from './baseApi'
import { setSession, clearSession } from '../slices/auth.slice'
import { parseRegisterResponse, parseSessionResponse, parseResetTokenResponse } from '../parsers/auth.parsers'
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
    // { username, email, password } — matches docs/AUTH_MODULE.md §4.1
    // exactly. There's no `name` field; the user types their own username
    // directly (see SignUpForm/SignUpContainer) rather than one being
    // derived client-side.
    register: builder.mutation({
      query: ({ username, email, password }) => ({
        url: '/auth/register',
        method: 'POST',
        body: { username, email, password },
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

    // Not part of docs/AUTH_MODULE.md's 6-endpoint contract — a separate
    // forgot-password flow confirmed directly by the team. Request takes
    // { username, email } (no phone, despite ForgotPasswordModal's original
    // "Email or Phone" mock copy — see .claude/rules/06-auth-security.md's
    // "don't invent a different auth flow shape" for why the field was
    // narrowed to match).
    forgotPasswordRequest: builder.mutation({
      query: ({ username, email }) => ({
        url: '/auth/forgot-password/request',
        method: 'POST',
        body: { username, email },
      }),
    }),

    // Returns the resetToken the following reset call needs — see the
    // caveat on parseResetTokenResponse.
    forgotPasswordVerify: builder.mutation({
      query: ({ email, otp }) => ({
        url: '/auth/forgot-password/verify',
        method: 'POST',
        body: { email, otp },
      }),
      transformResponse: parseResetTokenResponse,
    }),

    forgotPasswordReset: builder.mutation({
      query: ({ email, resetToken, newPassword }) => ({
        url: '/auth/forgot-password/reset',
        method: 'POST',
        body: { email, resetToken, newPassword },
      }),
    }),
  }),
})

export const {
  useRegisterMutation,
  useVerifyOtpMutation,
  useLoginMutation,
  useResendOtpMutation,
  useLogoutMutation,
  useForgotPasswordRequestMutation,
  useForgotPasswordVerifyMutation,
  useForgotPasswordResetMutation,
} = authApi
