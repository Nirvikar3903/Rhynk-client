# Comparison: "Welcome to Markdown.md" reference doc vs. Rhynk's own rules/workflows

`Welcome to Markdown.md` documents a **different, already-built app** — an
"inXits Customer App" (mutual funds / SIP / STP / SWP / KYC / portfolio /
insurance, with a native-app wrapper: `isNative()`, `osType`, `deviceInfo`).
It is not Rhynk and was never meant to describe this repo. This note is a
side-by-side check of where its patterns line up with `.claude/rules/` +
`.claude/workflows/`, and where they don't — so it can be used as a *general
RTK Query / MUI-theme reference* without silently importing that other app's
decisions (redux-persist, encryption, native checks, Myriad Pro font, etc.)
into Rhynk.

No other files were changed to produce this note.

## 1. RTK Query setup

| Aspect | Reference doc | Rhynk rules | Verdict |
|---|---|---|---|
| Single shared `baseApi`, feature slices via `injectEndpoints` | Yes | Yes — [[05-state-data-layer]] | **Matches** |
| `*.apislice.js` / `*.parsers.js` / `*.slice.js` naming, `store/{api,parsers,slices}/` folders | Yes | Yes — [[01-architecture]], [[02-naming]] | **Matches** |
| `baseUrl` env var name | `VITE_API_BASE_URL` | `VITE_API_URL` — [[09-git-env-workflow]] | **Different name** — don't copy the reference's var name in verbatim |
| Auth header injection | Yes (in `baseQueryWithAuth`) | Yes, via `prepareHeaders` reading `auth` slice | **Matches** |
| 401 handling | Silent refresh → retry original request, else logout/redirect | Same intent — `baseQueryWithReauth` pattern described in [[05-state-data-layer]], with `SESSION_REVOKED` → `clearSession` + redirect ([[06-auth-security]]) | **Matches conceptually** — neither is implemented yet in Rhynk (`store/index.js` is still empty) |
| Request/response **encryption** toggle (`VITE_ENABLE_ENCRYPTION`, `decryptPayload`) | Yes, wired into `transformResponse`/`transformErrorResponse` | **Not decided** — [[06-auth-security]]: "E2E encryption — not yet decided... No encryption code exists in this client repo yet" | **Does not apply** — don't add a `decryptPayload`/`utils/encryption.utils` pattern until the PRD §16 Q1 library choice is actually made |
| "API History" debug panel + call logging | Yes | Not mentioned anywhere in Rhynk's rules | **Not part of Rhynk** — a reference-app-specific feature |
| `tagTypes` list | ~29 tags across a large finance-app surface | 7 tags: `User, Conversation, Message, MusicRoom, Song, Playlist, Notification` — [[05-state-data-layer]] | **Matches in pattern, differs in content** (expected — different domain) |
| `redux-persist` (`persistStore`, `<PersistGate>`) | Yes, wraps the whole store | **Not installed** — checked `package.json`, no `redux-persist` dependency; Rhynk's `store/index.js` example in [[05-state-data-layer]] is a plain `configureStore` with no persistence layer | **Does not apply** — don't add `PersistGate`/`persistStore` scaffolding unless the team decides to persist Redux state (auth session persistence is currently unspecified beyond "store the tokens somewhere") |
| Naming quirk: `insurance.slice.js` is actually an API slice despite `.slice.js` suffix | Called out as a known inconsistency in that codebase | Rhynk's [[02-naming]] is explicit and consistent: API endpoint files are always `*.apislice.js`, plain Redux slices are always `*.slice.js` — no overlap | **Rhynk avoids this problem by convention** — don't reintroduce it |

## 2. Theme setup (dark/light)

| Aspect | Reference doc | Rhynk rules / current code | Verdict |
|---|---|---|---|
| `createDynamicTheme(isDarkMode)` factory, `palette.custom.*` tokens | Yes | Yes — this is the exact pattern already implemented in [src/theme/index.js](../src/theme/index.js) (built directly off an earlier version of this same reference pattern) | **Matches** |
| `hooks/useTheme.hook.js` reading/writing a Redux `theme` slice, syncing `localStorage` | Yes, backed by `user.slice.js` (`selectTheme`/`setTheme`/`toggleTheme`) | **Doesn't exist yet.** Not mentioned in any `.claude/rules/` file; [[05-state-data-layer]]'s only slice example is `auth.slice.js`. Nothing prevents adding one — it fits the "client-owned state" test in [[05-state-data-layer]] — but it isn't currently documented or built. | **Gap, not a conflict** — reasonable to add, per the earlier discussion in this conversation |
| `AppHOC.jsx` wrapping `<ThemeProvider>` + `<SafeAreaViewComponent>` + `<Toaster>` | Yes, a dedicated top-level HOC file | Rhynk's [[04-ui-styling]] only requires wrapping `main.jsx`/`App.jsx` directly with `<ThemeProvider>` + `<CssBaseline />` — no `AppHOC.jsx` concept anywhere in [[01-architecture]]'s planned structure (which has `layouts/` — `AppLayout`, `AuthLayout` — instead) | **Not required by Rhynk's rules** — an `AppHOC.jsx` is an optional organizational choice, not something to copy in just because the reference does it this way |
| `<SafeAreaViewComponent>`, `isNative()`, `osType`, `deviceInfo` | Used throughout (native/hybrid app concerns — safe-area insets, platform checks) | Rhynk is a **pure Vite web app** — no native wrapper (Capacitor/React Native/etc.) mentioned anywhere in the PRD/HLD/rules | **Does not apply at all** — don't introduce safe-area or native-platform handling |
| `<CssBaseline />` | Not mentioned in the reference's `AppHOC` example | Explicitly required by [[04-ui-styling]] | **Rhynk requires something the reference omits** — add it regardless of what the reference shows |

## 3. Page → Container → Component flow

| Aspect | Reference doc | Rhynk rules | Verdict |
|---|---|---|---|
| Page = thin, route-level, delegates to a container | Yes | Yes — [[01-architecture]] `pages/` description | **Matches** |
| Container = business logic, RTK Query hooks, composes components | Yes, in flat `src/containers/<feature>/` | Yes, but nested one level deeper: `src/features/containers/<domain>/` — see [[01-architecture]] | **Same responsibility split, different folder depth/name** — don't collapse Rhynk's `features/containers/` into a flat `containers/` to match the reference; that's a deliberate structural choice already made for this repo |
| Component = dumb, prop-driven, styling passed in via `sx`/`*Props` | Yes | Yes — [[01-architecture]] module boundaries ("no `fetch`/RTK Query hook calls, no `useSelector`/`useDispatch`" in `components/<domain>/`) | **Matches** |
| `components/common/` for cross-feature reusable primitives | Yes | Yes — [[01-architecture]] lists `components/common/` explicitly | **Matches** |
| "Pages aren't always this thin" (containers sometimes own tab-switching directly) | Called out as an accepted exception | Not addressed either way in Rhynk's rules | **Not a conflict** — reasonable flexibility to inherit |

## 4. MUI icons & fonts

| Aspect | Reference doc | Rhynk rules | Verdict |
|---|---|---|---|
| `@mui/icons-material`, imported per-icon, no wrapper/registry | Yes | Compatible — [[04-ui-styling]] just says to use `@mui/icons-material`; doesn't mandate a wrapper for icons specifically | **Matches** |
| Font family | `Myriad Pro, -apple-system, BlinkMacSystemFont, system-ui, sans-serif` | **Inter, Manrope, -apple-system, BlinkMacSystemFont, system-ui, sans-serif** — per `DESIGN.md` and already implemented in [src/theme/index.js](../src/theme/index.js) | **Different on purpose** — Rhynk's brand typography is Inter, not Myriad Pro. Do not copy the reference's font stack into Rhynk. |
| No bundled font file / `@font-face` | True in the reference app | Also true today in Rhynk (nothing added to `index.html`/`index.css` yet) | **Same current gap** — if pixel-perfect Inter is needed later, a font file + `@font-face` (or a `<link>`) still needs to be added |

## Bottom line

The reference doc is a **good structural template** for RTK Query wiring and
the MUI dynamic-theme factory pattern — Rhynk's own rules already converge on
the same shape for those two things. It should **not** be treated as
authoritative for: the `VITE_API_BASE_URL` env var name, encryption/decryption
wiring, `redux-persist`, an `AppHOC.jsx`/`SafeAreaViewComponent` file, native
platform checks, the flat `containers/` folder depth, or the Myriad Pro font
— those are specific to the other ("inXits") app and either conflict with or
are simply undecided in Rhynk's actual rule set.
