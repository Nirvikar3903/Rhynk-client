# 07 — Realtime (Socket.IO)

## Current state

`socket.io-client` (`^4.8.3`) is installed but completely unwired — there is
no `src/app/socket.js`, no connection setup, no event listeners anywhere in
`src/`. Treat any mention of "the socket layer" in other docs as aspirational
until this file exists.

## Connection contract (from `docs/rhynk_lld.pdf` §7)

- JWT is verified **once**, at socket handshake (send the current access
  token, same one used for REST auth — see [[06-auth-security]]).
- Per-event authorization is **not** implied by a successful handshake —
  the server re-checks conversation membership (and DJ status, for music-room
  control events) on every single relevant event. The client should expect
  and gracefully handle a server-side rejection of an individual event even
  on an authenticated, connected socket — e.g. after being removed from a
  conversation mid-session.
- If the access token expires while a socket is connected, reconnect logic
  needs to refresh the token first (via the same refresh flow as the REST
  client) — don't just let the socket silently fail auth on reconnect.

## Event namespaces to implement

| Namespace | Key events |
|---|---|
| Messaging | `message:send/new/edit/delete/read/react`, `typing:start/stop/update`, `presence:update` |
| Music Room | `room:join`, `room:state`, `room:sync_request/response`, `room:play/pause/seek/skip` (DJ-only, rejected server-side for non-DJ), `room:queue_add/remove`, `room:dj_changed`, `room:member_join/leave`, `room:song_ended` |
| Calls | `call:initiate/incoming/accept/decline/offer/answer/ice_candidate/end/ended` — server only relays SDP/ICE, never decodes or stores media |

Full payload shapes: PRD §10.4 (music room) and §11.5 (messaging) — match
those exactly rather than inventing a slightly different payload shape.

## Message ordering

Message history uses a compound cursor (`{ created_at, _id }`), never `_id`
alone — see [[05-state-data-layer]]. This matters for the socket side too:
a `message:new` event arriving over the socket and a paginated REST fetch of
the same conversation must be reconciled by this same cursor logic, not by
naive array concatenation, to avoid duplicate or out-of-order messages when
both paths are in flight around the same time.
