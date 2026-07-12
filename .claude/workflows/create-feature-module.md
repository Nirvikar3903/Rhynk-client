# Create Feature Module Workflow

Scaffolding a new feature module is a recurring task since **none** of the
nine planned features exist yet — see [[00-overview]], [[01-architecture]].

## When to use this

Starting the first real slice of a feature named in the LLD's client tree
(§1.2): `auth, conversations, messages, music-room, songs, stories, calls,
notifications, profile`. `auth` should be first — every other feature
assumes a logged-in user (mirrors the backend's own build-order rationale,
PRD §8.3: "Auth before Users").

## Structure to create (only what's actually needed — don't scaffold empty stubs)

```
src/features/<name>/
├── components/     # feature-scoped UI (see [[create-component]])
└── hooks/          # feature-scoped hooks composing RTK Query + slice state (see [[create-hook]])
```

REST calls and state for the feature live in `src/store/`, not inside the
feature folder (see [[01-architecture]] — this repo centralizes RTK Query
endpoints under `store/api/` rather than a per-feature `api.js`):

```
src/store/
├── api/<name>.apislice.js      # RTK Query endpoints (see [[create-api-service]])
├── parsers/<name>.parsers.js   # only if a response needs real transforming (see [[create-parser]])
└── slices/<name>.slice.js      # only if the feature owns client state (see [[create-redux-slice]])
```

Don't create every one of these up front with empty placeholder files — add
each as the feature actually needs it. A feature that's pure realtime (e.g.
an early `presence` slice) might have no `*.apislice.js` at all; a feature
whose responses need no transformation doesn't need a `*.parsers.js`.

## Cross-cutting pieces that live outside the feature folder

- `src/store/api/baseApi.js` — the shared RTK Query base, created once,
  every feature's `*.apislice.js` injects into it (see
  [[create-api-service]]).
- `src/store/index.js` — `configureStore`, combines every slice + the RTK
  Query middleware (see [[create-redux-slice]]).
- Socket.IO connection/listener wiring → `src/app/socket.js` (see
  [[07-realtime-sockets]]) — one shared connection, not one per feature.
- Route-level composition → `src/pages/` (see [[create-page]]).

## Naming check before creating the folder

Double-check the folder name against [[02-naming]]'s callout: the LLD's own
docs are inconsistent between `music-room` (kebab-case, LLD folder listing)
and `MusicRoom`/`musicRoom` (the Music Provider Strategy doc's own file
paths). Pick kebab-case for the folder name itself, consistent with every
other feature in the LLD's list, and don't let a copy-pasted code sketch's
casing override that.

## Checklist

- [ ] Feature folder name matches the backend module name it corresponds to
      (helps cross-referencing `docs/AUTH_MODULE.md`-style deep-dives per
      feature as they get written).
- [ ] REST endpoints go in `store/api/<name>.apislice.js`, injected into the
      shared `baseApi` — not a fresh `axios`/`fetch` call inline anywhere
      (see [[create-api-service]]).
- [ ] Any socket event names used match the LLD §7 / PRD §10.4/§11.5 tables
      exactly (see [[07-realtime-sockets]]) — don't invent slightly
      different event names.
- [ ] If the feature needs client-owned state (not server data — that's RTK
      Query's job), it's a `store/slices/<name>.slice.js`, registered in
      `store/index.js` (see [[create-redux-slice]]).
