# 11 — Modal Flow Pattern (CommonModal + folded containers)

Multi-step modal flows (forgot-password: request → verify → reset; signup:
register → OTP verify) follow a specific shape, established in
`components/common/CommonModal.jsx`, `features/containers/auth/LoginContainer.jsx`,
and `features/containers/auth/SignUpContainer.jsx`. Follow this shape for any
new modal flow rather than re-deriving a container-per-modal structure from
scratch — this rule exists because the original forgot-password/signup-OTP
implementation had grown a dedicated container file per modal step
(`ForgotPasswordContainer.jsx`, `VerifyOtpContainer.jsx`), each with exactly
one caller, which was pure indirection.

## Shared modal chrome lives in `CommonModal`, not per-modal

`components/common/CommonModal.jsx` owns the Dialog chrome every auth modal
needs: paper styling, the close `IconButton`, the icon-avatar `Box`,
heading/subheading `Typography`, the `<form>` wrapper, and the CTA
`AppButtonComponent`. A specific modal (`ForgotPasswordModal`,
`ResetPasswordModal`, `OtpVerificationModal`, and any new one) does **not**
duplicate that markup — it renders `<CommonModal>`, passing:

- `icon`, `heading`, `subheading` (a string or a node — e.g.
  `OtpVerificationModal` builds a `"Sent to {destination} Edit"` node with an
  embedded `Link` and passes that as `subheading`)
- `ctaLabel`/`ctaLoading`/`ctaDisabled`/`ctaIcon` for the CTA button
- `children` — its own fields/inputs, built by the specific modal, not by
  `CommonModal`
- `footer` (optional) — a divider/link/trust-note block rendered after the
  CTA button
- `formSx`/`ctaSx` (optional escape hatches) when a modal's layout genuinely
  needs different spacing/alignment on the shared form wrapper or CTA button
  (e.g. `OtpVerificationModal` centers its content and uses a larger gap,
  where the other two stretch-align their fields)

Each specific modal keeps its own external prop contract (`open`, `onClose`,
`email`, `onEmailChange`, `otp`, …) — callers don't need to know `CommonModal`
exists.

## Don't create a dedicated container file per single-purpose modal flow

If a modal flow's state/logic (form fields, RTK Query mutations, step
sequencing, timers) has exactly one caller, that state lives directly in the
**caller's** container — not in a separate container file rendered by the
caller. Concretely:

- `LoginContainer` owns the entire forgot-password flow (`step`, `email`,
  `otp`, `resetToken`, `newPassword`, the three
  `useForgotPasswordRequest/Verify/ResetMutation` hooks) and renders
  `ForgotPasswordModal`, `OtpVerificationModal`, and `ResetPasswordModal`
  directly, gating each modal's `open` prop on `step`. There is no
  `ForgotPasswordContainer.jsx`.
- `SignUpContainer` owns the OTP-verification step (`otp`,
  `resendSecondsRemaining`, the resend-cooldown timer,
  `useVerifyOtpMutation`/`useResendOtpMutation`) and renders
  `OtpVerificationModal` directly. There is no `VerifyOtpContainer.jsx`.

Only pull a flow's logic out into its own container file if it has more than
one real caller today (not a hypothetical future one — see
[[10-task-discipline]] on not designing for hypothetical requirements).

## What still gets its own component file

The fold above is about **containers** (state/logic), not **modal
components** (props-only UI). A modal used by more than one flow — e.g.
`OtpVerificationModal` in `components/common/` (reused by both the signup
flow and the forgot-password flow) — still gets its own dumb, props-only
component file per [[01-architecture]]'s components-vs-containers split; it
just never holds its own RTK Query calls, timers, or `useState` beyond
purely-presentational concerns (e.g. it takes `otp`/`onOtpChange` as props,
it doesn't own `otp` itself).
