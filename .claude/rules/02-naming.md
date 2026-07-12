# 02 — Naming Conventions

## Components

- PascalCase, `.jsx` extension: `LoginForm.jsx`, `MusicRoomPlayer.jsx`.
- One component per file; file name matches the default export name.

## Hooks

- camelCase, prefixed `use`, plain `.js` (no JSX inside a hook file unless it
  returns nothing that needs it): `useAuthSession.js`, `useRoomSync.js`. The
  Music Provider Strategy doc's own sketch (`useRoomSync.js` under
  `features/music-room/`) is the concrete precedent to follow.

## Feature folders — match the backend module names, watch for mismatches

Feature folder names should match `server/src/modules/*` from the LLD 1:1. Per
the LLD's own client tree (§1.2), the canonical set is:

```
auth, conversations, messages, music-room, songs, stories, calls, notifications, profile
```

**Careful:** the LLD's client-side folder is singular `music-room/` (see the
Music Provider Strategy doc's own file paths,
`client/src/features/musicRoom/providers/...` in camelCase form, and the LLD's
`music-room` in kebab-case) while the **server's** Prisma model and route
prefix are plural — `music_rooms` table, `music-rooms.routes.js`,
`/conversations/:id/room` endpoint. Don't let the plural/singular server
naming leak into the client folder name, and don't assume the two docs
themselves agree — the Music Provider doc uses `MusicRoom` (camelCase,
no hyphen) in its file paths while the LLD folder listing uses `music-room`
(kebab-case). Pick one convention (kebab-case folders, to match the rest of
the LLD's feature list) and apply it consistently rather than importing
whichever casing a given source doc happens to use.

## Redux store files (`src/store/`)

Matches the team's actual Redux Toolkit setup (`store/api/`, `store/parsers/`,
`store/slices/`, `store/index.js` — see [[01-architecture]],
[[05-state-data-layer]]):

- **RTK Query endpoints**: camelCase domain + `.apislice.js` suffix —
  `auth.apislice.js`, `conversations.apislice.js`, `musicRoom.apislice.js`.
- **Parsers**: camelCase domain + `.parsers.js` suffix — `auth.parsers.js`,
  `conversations.parsers.js`. One parser file per domain, pure functions only.
- **Slices**: camelCase domain + `.slice.js` suffix — `auth.slice.js`,
  `presence.slice.js`. Exports named action creators + selectors, default
  export is the reducer.

Don't create `<domain>.store.js` files or anything Zustand-shaped — that
naming belonged to a state-management approach this project isn't using
(see [[00-overview]]).

## Provider adapters (music room only)

Per the Music Provider Strategy doc's own naming, keep these exact names when
implementing:

```
providers/MusicProvider.js       // base class + createMusicProvider(type) factory
providers/JioSaavnProvider.js
providers/YouTubeProvider.js
```

## Assets

- `src/assets/` for anything bundled by Vite; static, unprocessed files go in
  `public/` per Vite convention — don't put fonts/icons meant to be served
  as-is into `src/assets/` expecting Vite to leave them untouched.
