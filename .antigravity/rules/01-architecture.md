# 01 — Architecture & Project Structure

## Target structure — as already scaffolded on disk

The LLD's own client tree (§1.2) sketches a `features/<name>/components/,
hooks/` shape and a `store/` folder without prescribing its internals. In
practice the scaffolding already committed to this repo took a slightly
different, more explicit split — **components (dumb UI) vs. containers
(business logic)** — and that's the structure to keep building against
rather than re-deriving the LLD's literal layout from scratch:

```
client/
├── src/
│   ├── store/
│   │   ├── api/          RTK Query endpoints — one file per feature (*.apislice.js)
│   │   ├── parsers/      pure functions transforming API responses (*.parsers.js)
│   │   ├── slices/       plain Redux slices for client state (*.slice.js)
│   │   └── index.js      configureStore — combines all slices + RTK Query middleware
│   ├── features/
│   │   └── containers/   one folder per backend module — business logic, RTK Query
│   │                     hooks, Redux connections: auth, conversations, messages,
│   │                     music-rooms, songs, stories, calls, notifications, profile, groups
│   ├── components/       dumb, props-only UI, organized the same way as containers:
│   │   ├── auth/ calls/ conversations/ groups/ messages/ music-rooms/
│   │   ├── notifications/ profile/ songs/ stories/
│   │   ├── common/       cross-feature dumb primitives (buttons, modals, avatars)
│   │   └── mui/          MUI wrapper components — see [[04-ui-styling]], [[create-mui-component]]
│   ├── layouts/           AppLayout, AuthLayout
│   ├── pages/             route-level components, minimal logic, delegate to containers
│   ├── router/            routing configuration
│   ├── hooks/             cross-feature custom hooks (.hook.js or use*.js — see [[02-naming]])
│   ├── schemas/            form/validation schemas, once a form library is chosen (see [[create-form]])
│   ├── theme/              MUI theme object (createTheme) — see [[04-ui-styling]]
│   ├── config/             app-level config/constants
│   └── assets/
└── vite.config.js
```

This supersedes the LLD's literal `features/<name>/components/, hooks/`
per-feature nesting — here, `components/<domain>/` and
`features/containers/<domain>/` are siblings, not nested inside one another.
Domain folder names mirror the backend's `server/src/modules/*` (LLD §1) —
watch for the `music-room` (singular, LLD) vs. `music-rooms` (plural, this
repo's actual folder and the server's plural DB table) naming drift called
out in [[02-naming]].

## Actual current status

The folder skeleton above already exists (`store/{api,parsers,slices}`,
`features/containers/*`, `components/*`, `layouts/`, `pages/`, `router/`,
`hooks/`, `schemas/`, `theme/`, `config/`) but almost every folder in it is
still **empty** — no real components, containers, slices, or API endpoints
have been written yet, and `App.jsx`/`main.jsx` are still the unmodified
create-vite placeholders. Don't assume a folder having been created means
anything inside it works — check for actual files before building on top of
an assumed pattern.

## Absolute imports — not yet configured

Imports like `features/containers/auth/...` or `components/mui/AppButtonComponent`
**will not resolve today** — there is no `resolve.alias` in `vite.config.js`
and no `jsconfig.json`/`tsconfig.json`. Before writing the first absolute
import, set up the alias (Vite `resolve.alias: { '@': '/src' }` is the
idiomatic Vite pattern, or bare `src`-relative to match the LLD's own import
style more literally) and confirm ESLint doesn't flag it as unresolved.
Don't write code that assumes an alias exists without adding it in the same
change.

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

## Module boundaries

- **`components/<domain>/`** — pure, props-based UI. No `fetch`/RTK Query
  hook calls, no `useSelector`/`useDispatch`. Receives data and callbacks
  from the matching container.
- **`components/mui/`** — MUI primitive wrappers (see [[04-ui-styling]]).
  Dependencies: MUI components only.
- **`components/common/`** — cross-domain dumb primitives (buttons, modals,
  avatars) not specific to one feature.
- **`features/containers/<domain>/`** — business logic, state management,
  API calls via the RTK Query hooks generated from
  `store/api/<domain>.apislice.js`, Redux connections via
  `store/slices/<domain>.slice.js`. Pattern: Page → Container → Components.
  Socket.IO event names/handlers for a domain live here (or in a future
  `app/socket.js`), not in `store/api/` — RTK Query is REST-only.
- **`store/api/<domain>.apislice.js`** — one file per domain, injected into
  the shared base API (see [[05-state-data-layer]]).
- **`store/parsers/`** — pure functions transforming raw API responses;
  no dependencies.
- **`store/slices/`** — plain Redux slices for cross-cutting client state
  (auth session, presence, UI) that more than one domain needs to read.
- **`pages/`** — route-level, minimal logic, delegate to a container.
