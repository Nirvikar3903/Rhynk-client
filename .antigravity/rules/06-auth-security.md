# 06 — Auth & Security (client contract)

The server-side auth module is the **one fully-implemented, documented**
backend module (`docs/AUTH_MODULE.md`) — treat it as the source of truth for
exactly what the client must send and handle. Don't invent a different auth
flow shape; match this one.

## The 6 endpoints, base prefix `/auth`

| Endpoint | Body | Success | Key errors |
|---|---|---|---|
| `POST /auth/register` | `{ username, email, password }` | `201 { email, userId, isVerified: false }` | `EMAIL_TAKEN` 409, `OTP_COOLDOWN` 429 |
| `POST /auth/verify-otp` | `{ email, otp: "^[0-9]{6}$", deviceId, deviceType: IOS\|ANDROID\|WEB }` | `200 { accessToken, refreshToken, user }` | `OTP_INVALID` 400, `USER_NOT_FOUND` 404 |
| `POST /auth/login` | `{ email, password, deviceId, deviceType }` | `200 { accessToken, refreshToken, user }` | `INVALID_CREDENTIALS` 401, `EMAIL_NOT_VERIFIED` 403 |
| `POST /auth/resend-otp` | `{ email }` | `200 { success: true }` | `USER_NOT_FOUND` 404, `OTP_COOLDOWN` 429 |
| `POST /auth/refresh` | `{ refreshToken, deviceId }` | `200 { accessToken, refreshToken }` | `REFRESH_INVALID` 401, `REFRESH_LOCKED` 409, `SESSION_REVOKED` 401 |
| `POST /auth/logout` | `{ deviceId }` + `Authorization: Bearer <accessToken>` | `200 { success: true }` | — |

Note the client sends `deviceType` as one of `IOS | ANDROID | WEB` — this is a
web client, so always `WEB`. `deviceId` is **client-generated** (a stable
UUID-like string persisted locally, e.g. `localStorage`) — it is not returned
by the server, the client must create and keep track of it itself, and pass
the *same* `deviceId` on every subsequent login/refresh/logout call from that
browser/device.

## Token lifecycle the client must implement

- Access token: 15 min lifetime, sent as `Authorization: Bearer <token>` on
  every authenticated request.
- Refresh token: 7 day lifetime, single-use — every successful
  `/auth/refresh` call **rotates** it; the old refresh token becomes invalid
  immediately. The client must overwrite its stored refresh token with the
  new one from every refresh response, never reuse an old one.
- `REFRESH_LOCKED` (409) means another refresh for the same token is already
  in flight — the client should back off and retry shortly, not treat it as
  a hard failure.
- `SESSION_REVOKED` (401) from `/auth/refresh` means token-reuse was detected
  server-side and **every device's session was invalidated** — this must
  force a full client-side logout (clear tokens, redirect to login), not just
  a silent retry.

## Where this plugs into the store

See [[05-state-data-layer]] for the RTK Query pattern: `baseApi`'s
`prepareHeaders` attaches the access token from the `auth` slice on every
request, and a wrapped base query (`baseQueryWithReauth`) catches `401`,
attempts one `/auth/refresh`, and only then retries — with the
`SESSION_REVOKED`/failed-refresh case dispatching `clearSession` and
escalating to a full logout rather than looping.

## Known server-side gaps — don't paper over them client-side

Per `docs/AUTH_MODULE.md` §7, the server has known gaps: `resend-otp` has no
IP rate limit (only a 30s per-email cooldown), `logout` trusts `deviceId`
from the request body without ownership verification, OTP is a
`Math.random()` 6-digit code with no brute-force lockout beyond a 60s TTL and
the shared IP rate limit. These are server-side issues to potentially fix in
that repo — don't try to compensate for them with client-only mitigations
(e.g. client-side rate limiting) that a modified client could simply bypass.

## E2E encryption — not yet decided

PRD §16 Q1 is an open question: `libsodium` vs. `@signalapp/signal-protocol`
for E2E message encryption. No encryption code exists in this client repo
yet. Don't start building message encryption against an assumed library
without confirming which one was chosen.
