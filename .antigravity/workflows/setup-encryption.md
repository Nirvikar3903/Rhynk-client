# Setup Encryption Workflow

## This is about E2E message encryption, not field-level PII encryption

Rhynk's encryption need is fundamentally different from a financial-data app
encrypting SSNs/PAN numbers in Redux Persist: PRD §12.1 requires end-to-end
encrypted 1:1 messages (Signal Protocol), with the encrypted payload carried
in Mongo's `messages.encrypted_payload` field (see `docs/schema.prisma` /
`docs/rhynk_lld.pdf`). `crypto-js` is **not** installed in this repo — don't
add generic AES field-encryption utilities modeled on a different app's
compliance needs (PAN/Aadhaar-style masking has no equivalent in Rhynk).

## The actual open question — don't pick a library unilaterally

PRD §16 Q1 is explicitly unresolved: **libsodium** (simpler) vs.
**`@signalapp/signal-protocol`** (standard, matches WhatsApp/Signal's actual
protocol) for E2E encryption, owned by "Tech Lead," due "Phase 1b start."
Nothing in this client repo implements either today. Before writing any
encryption code:

1. Confirm which library was actually chosen (check with the team / look for
   a decision recorded elsewhere — don't infer it from a dependency that
   happens to be installed, since neither is in `package.json` yet).
2. Only then scaffold `src/features/messages/crypto.js` (or similar) around
   that specific library's actual key-exchange and encrypt/decrypt API —
   libsodium and Signal Protocol have meaningfully different session/ratchet
   models, not a shared drop-in interface.

## What's actually specified, regardless of library choice

- Encryption/decryption happens **client-side** — the server only ever
  relays `encrypted_payload`, per the "E2E" framing in the PRD; the server
  must not be able to read message content.
- **Group message keys rotate on every member join/leave** (PRD §12.1) —
  this is a harder requirement than 1:1 and has real implications for
  whichever library is chosen (Signal Protocol's "sender keys" model handles
  this natively; a naive libsodium implementation would need this built by
  hand).
- Refresh tokens are a **separate** concern from message encryption — they
  are handled server-side in Redis (see [[06-auth-security]]), not something
  this client-side crypto layer touches.

## Don't build this speculatively

No message-send flow exists yet in this repo (see [[00-overview]]). Wiring
up E2E encryption makes sense as part of building the `messages` feature's
send/receive path (see [[create-feature-module]]), once the library
decision above is actually made — not as a standalone utility file built
ahead of the feature that needs it.
