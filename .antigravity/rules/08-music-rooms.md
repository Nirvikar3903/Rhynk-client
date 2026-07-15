# 08 — Music Rooms (the product's differentiator)

## Nothing built yet

No `features/music-room/` directory exists. This rule captures the design
already committed to in `docs/Rhynk_Music_Provider_Strategy_Detailed.pdf` and
`docs/rhynk_lld.pdf` §4/§6 so the first implementation matches it rather than
re-deriving the approach from scratch.

## Dual-provider adapter pattern

Every music engine (JioSaavn primary, YouTube IFrame fallback) implements the
same interface so the sync engine is written once, independent of the
underlying source:

```
providers/MusicProvider.js       // abstract base: load, play, pause, seekTo,
                                  // getCurrentTime, onStateChange
                                  // + createMusicProvider(type) factory
providers/JioSaavnProvider.js    // wraps native <audio>, fetches stream URL
                                  // from the server proxy — NEVER call the
                                  // unofficial JioSaavn API directly from
                                  // the client
providers/YouTubeProvider.js     // wraps the YouTube IFrame Player API
```

The client **never** calls JioSaavn directly — it hits the server's own
`/api/music/stream/:trackId` (or equivalent) proxy, which returns a stream
URL. This is deliberate: it keeps the unofficial-API dependency swappable
server-side without any client change, and per PRD §10.1 it also means Rhynk
pays zero bandwidth cost for audio (the client plays the stream URL directly
from JioSaavn's/YouTube's own CDN, not through Rhynk's servers).

Fallback trigger (MVP scope, per the Music Provider Strategy doc §7): offer
the YouTube fallback if JioSaavn is unavailable **before** a room starts.
Mid-session provider hot-swap is explicitly out of scope for MVP — if
JioSaavn fails mid-room, the room fails and users reconnect/restart with the
fallback. Don't build mid-session hot-swap as a "nice to have" — it's
deferred to Phase 4 on purpose.

## NTP-style sync algorithm (client side)

```
t1 = Date.now()
emit room:sync_request { t1 }
on room:sync_response { t1, server_time, position_ms, is_playing }:
  offset = (Date.now() - t1) / 2
  seek to position_ms + offset
```

- Re-run this every 30 seconds to correct clock drift — don't sync once on
  join and stop.
- On receiving a `room:state`/sync broadcast mid-playback, only correct
  (seek) if the observed drift exceeds an audible threshold (~1.5s per the
  Music Provider doc's own `useRoomSync` sketch) — don't seek on every tiny
  sub-threshold discrepancy, that itself causes audible stutter.
- Target: sync offset under 500ms at all times (PRD §2.1, §14.1). Redis is
  the server-side source of truth for `position_ms` during a live room —
  the client should never try to derive playback position from anything
  other than the server's sync responses/broadcasts.

## DJ-only controls

`room:play/pause/seek/skip` and `room:queue_remove` are DJ-only. The server
rejects these from non-DJ sockets — but per the LLD, this must be **enforced
server-side, not just hidden client-side**. Still hide the controls in the
UI for non-DJ members (bad UX to show a control that will just error), but
don't treat client-side hiding as the actual security boundary — a rejected
DJ-only event from the server is an expected, handleable case, not a bug.
