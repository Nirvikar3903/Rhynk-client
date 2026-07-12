# 01 — Architecture & Project Structure

## Target structure — LLD §1.2 layout, adapted for the team's Redux Toolkit decision

The LLD's own client tree (§1.2) sketches a `store/ (auth, presence,
notifications)` folder without prescribing its internals — that's since been
decided as **Redux Toolkit + RTK Query**, not Zustand (see [[00-overview]]),
with a concrete internal shape matching the `api/ · parsers/ · slices/`
split:

```
client/
├── src/
│   ├── app/             socket.js (Socket.IO connection/listener setup)
│   ├── store/
│   │   ├── api/          RTK Query endpoints — one file per feature (*.apislice.js)
│   │   ├── parsers/      pure functions transforming API responses (*.parsers.js)
│   │   ├── slices/       plain Redux slices for client state (*.slice.js)
│   │   └── index.js      configureStore — combines all slices + RTK Query middleware
│   ├── features/         one folder per backend module:
│   │                     auth, conversations, messages, music-room,
│   │                     songs, stories, calls, notifications, profile
│   │                     — each with components/, hooks/ (api calls live in store/api/, not per-feature)
│   ├── components/       shared dumb UI primitives (includes components/ui/ — see create-shadcn-component)
│   ├── layouts/          AppLayout, AuthLayout
│   ├── pages/            route-level containers
│   └── styles/           Tailwind entrypoint
└── vite.config.js
```

Feature folders mirror the backend's `server/src/modules/*` 1:1 so a given
feature's client and server code are easy to reason about together (LLD §1).
Unlike the LLD's literal `api.js`-per-feature suggestion, this repo
centralizes RTK Query endpoints under `store/api/` (still one file per
feature — `auth.apislice.js`, `conversations.apislice.js`, etc.) because RTK
Query's `injectEndpoints` pattern needs a single shared `createApi()` base to
inject into (see [[05-state-data-layer]]) — a feature folder's own `api.js`
would fragment that.

## Actual current structure

```
src/
├── App.jsx      unmodified create-vite placeholder
├── main.jsx     createRoot + StrictMode, renders <App />
├── index.css    0 bytes — empty
└── assets/
```

None of `app/`, `features/`, `components/`, `layouts/`, `pages/`, `styles/`
exist yet. When starting the first real feature (almost certainly `auth`,
since every other feature depends on being logged in), create the structure
incrementally — don't scaffold all nine feature folders up front with empty
files.

## Absolute imports — not yet configured

The target structure implies imports like `features/auth/api` or
`components/Button`. **This will not resolve today** — there is no
`resolve.alias` in `vite.config.js` and no `jsconfig.json`/`tsconfig.json`.
Before writing the first absolute import, set up the alias (Vite
`resolve.alias: { '@': '/src' }` is the idiomatic Vite pattern, or bare
`src`-relative if matching the LLD's own import style more literally) and
confirm ESLint doesn't flag it as unresolved. Don't write code that assumes an
alias exists without adding it in the same change.

## Client ↔ server boundary

- Backend is Fastify + Socket.IO on port **4000** (PRD §6.2/§7.2), single
  process, not real microservices (HLD §2) — the client talks to one origin
  for both REST and the WebSocket gateway.
- Vite dev server defaults to its own port (5173 unless configured) — a dev
  proxy or full `VITE_API_URL`/`VITE_SOCKET_URL` env vars will be needed since
  nothing is proxied today (see [[09-git-env-workflow]]).
- REST endpoints are prefixed `/api/v1` per PRD §11 (or bare `/auth/*` per the
  currently-implemented server routes in `docs/AUTH_MODULE.md` — **the two
  docs disagree on the prefix**; check the live server's actual route
  registration before hardcoding a base path in the API client).

## Module boundaries (once features exist)

- **`features/<name>/components/`** — feature-scoped UI, can hold local state
  (form inputs, toggles) but data fetching/mutations go through the RTK Query
  hooks generated from `store/api/<name>.apislice.js`, not inline
  `fetch`/`axios` calls in a component body.
- **`features/<name>/hooks/`** — feature-scoped hooks composing RTK Query
  hooks and `useSelector`/`useDispatch` against `store/slices/<name>.slice.js`;
  this is the seam a component depends on, not the raw store.
- **`store/api/<name>.apislice.js`** — one file per feature, injected into the
  shared base API (see [[05-state-data-layer]]). Socket.IO event
  names/handlers for that feature still live in `features/<name>/hooks/` or
  `app/socket.js`, not here — RTK Query is REST-only.
- **`components/`** (top-level, not per-feature) — cross-feature dumb
  primitives only (buttons, modals, avatars). If a component only makes sense
  inside one feature, it belongs in that feature's `components/`, not here.
- **`store/slices/`** — plain Redux slices for cross-cutting client state
  (auth session, presence, UI) that more than one feature needs to read —
  the Redux Toolkit equivalent of what the LLD called `app/store/`.
