# 00 — Overview

These are the standing project rules for the Rhynk **client** repo. They exist so
that **Claude Code** (`.claude/rules/`) and **Antigravity** (`.antigravity/rules/`)
behave consistently — same architecture, same naming, same conventions — no
matter which assistant is driving a given change. The two rule sets are kept
byte-identical in content; only tool-specific wiring (e.g. `CLAUDE.md`) differs.

## What this repo is

The web frontend for Rhynk, a chat + social-music application ("Every Chat Has
a Rhythm"): messaging, music rooms with synchronized playback, calls, stories,
media sharing. This repo is **client-only** — it was split out of the original
`project-14(Rhynk)` monorepo into its own repo (see the single commit
`a27741b Initializing seperate Client Repo setup`). The backend lives in a
sibling repo (`project-14(Rhynk)` locally / `Rhynk` server repo) and is **not**
checked out here — don't go looking for `server/` in this tree.

Full product context: `docs/Rhynk_PRD_v2.2.pdf`, `docs/rhynk_hld.pdf`,
`docs/rhynk_lld.pdf`, `docs/rhynk_database_design.pdf`,
`docs/Rhynk_Music_Provider_Strategy_Detailed.pdf`, `docs/AUTH_MODULE.md`,
`docs/schema.prisma`.

## Tech stack — verified against `package.json`, not assumed from the PRD

The PRD (`docs/Rhynk_PRD_v2.2.pdf` §6.1) describes a *planned* stack. The stack
actually installed in this repo has already drifted from it in several places.
Trust `package.json` over the PRD:

| Concern | PRD says | Actually installed |
|---|---|---|
| React | 18 | **19** (`^19.2.7`) |
| Router | React Router v6 | **React Router v7** (`^7.18.1`) |
| Server state / caching | TanStack Query v5 | **RTK Query** (team decision) — `@reduxjs/toolkit ^2.12.0` + `react-redux ^9.3.0` installed; `axios` is present but not yet wired to anything |
| Type checking | TypeScript 5.x everywhere | **plain JS/JSX** — `@types/react*` present but no `.ts`/`.tsx` files, no `tsconfig.json` |
| Styling | Tailwind CSS 3.x + shadcn/ui | **MUI (Material-UI)** — team decision, supersedes the PRD's Tailwind/shadcn mention entirely. `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled` installed. SX-prop-based styling, a shared `src/theme/index.js` theme object (not yet created), wrapper components under `src/components/mui/` (currently empty) |
| Global state / server state | Zustand 4.x + TanStack Query | **Redux Toolkit + RTK Query** — team decision, supersedes both the PRD and the `package.json` snapshot below. `zustand` has been removed |
| Realtime | Socket.IO client 4.x | matches — `socket.io-client ^4.8.3`, installed but **unwired** (no `src/app/socket.js` yet) |
| Toasts | not specified | `sonner` is installed |

Don't silently "correct" code back to what the PRD says — if a PRD-vs-reality
mismatch matters for what you're building, flag it and ask, don't guess.

**State management — decided and now installed:** the team has confirmed
Redux Toolkit (with RTK Query for server state, plus a `store/parsers/` layer
for response shaping) as the actual state-management approach for this
client — not Zustand (removed from `dependencies`), and not TanStack Query,
despite the PRD naming it. `@reduxjs/toolkit` and `react-redux` are
installed; the actual `configureStore` call, base API, and first slice still
need to be written (see [[05-state-data-layer]]) — installation isn't
implementation.

## Current implementation status (verify before trusting stale docs)

This repo is a **bare `create-vite` React scaffold** with a handful of
dependencies pre-installed and nothing built on top of them yet:

- The feature-first folder skeleton (`src/features/containers/<domain>/`,
  `src/components/<domain>/`, `src/store/{api,parsers,slices}/`, `src/router/`,
  `src/layouts/`, `src/pages/`, `src/hooks/`, `src/schemas/`, `src/theme/`,
  `src/config/`) has been scaffolded — but almost every one of those folders is
  still **empty**. `src/App.jsx`/`main.jsx` are still the unmodified
  create-vite placeholders and `index.css` is 0 bytes.
- No path aliases configured — no `resolve.alias` in `vite.config.js`, no
  `jsconfig.json`. Absolute imports (`features/...`, `components/...`) will
  **not resolve** until this is set up.
- `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`
  are installed, but `src/theme/` and `src/components/mui/` are still empty
  — no theme object, no `<ThemeProvider>`/`<CssBaseline>` wrapping the app,
  no wrapper components yet (see [[04-ui-styling]]).
- No `.env` / `.env.example` in the repo yet — no `VITE_*` variables defined.

**Always check actual file contents before assuming a feature or convention is
in place** — this is an early-stage repo and this rule set describes the
*target* architecture (from the LLD) alongside the *actual* current state;
don't conflate the two.

## Deep-dive docs (read these, don't re-derive from scratch)

- `docs/AUTH_MODULE.md` — the full, already-implemented server auth flow: 6
  endpoints, JWT access(15m)/refresh(7d) pair, Redis session keys, device-based
  multi-session model. The client auth feature must match this contract
  exactly (see [[06-auth-security]]).
- `docs/rhynk_lld.pdf` §1.2 — the intended `client/src/` feature-first layout,
  WebSocket event contracts, the three hardest engineering problems (music
  sync, refresh-token rotation, message-cursor pagination).
- `docs/Rhynk_Music_Provider_Strategy_Detailed.pdf` — the dual music-provider
  adapter (JioSaavn primary, YouTube IFrame fallback) with concrete file paths
  and code sketches under `client/src/features/music-room/providers/`.
- `docs/schema.prisma` — the backend's Postgres schema; useful for knowing
  exactly what shape of data the REST API returns.

These docs are dated July 2026 — re-verify against actual server behavior
(via `docs/AUTH_MODULE.md` for auth, or by asking) for anything load-bearing.

## Rule file index

- [[01-architecture]] — planned feature-first structure vs. current scaffold, absolute imports, dev/backend ports
- [[02-naming]] — files, components, hooks, feature folders, the client/server naming mismatch to watch for
- [[03-coding-standards]] — JS/JSX only, ESLint flat config, import order
- [[04-ui-styling]] — MUI (Material-UI), SX styling, theme, toasts
- [[05-state-data-layer]] — Redux Toolkit + RTK Query + parsers (not Zustand/TanStack Query), store folder shape
- [[06-auth-security]] — client contract for the 6 auth endpoints, token lifecycle, device IDs
- [[07-realtime-sockets]] — Socket.IO client wiring, message/room/call event contracts
- [[08-music-rooms]] — provider adapter pattern, NTP-style client sync algorithm
- [[09-git-env-workflow]] — env vars (`VITE_*`), git hygiene, no Docker, dev scripts
