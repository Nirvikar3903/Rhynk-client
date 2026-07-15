# Create Parser Workflow

## Where it goes

`src/store/parsers/<domain>.parsers.js` — pure functions that transform a
raw server response into the shape the app actually wants, wired into RTK
Query via `transformResponse` (see [[create-api-service]],
[[05-state-data-layer]]).

## Naming

kebab/camelCase domain + `.parsers.js` suffix (see [[02-naming]]):
`conversations.parsers.js`, `messages.parsers.js`. One file per domain, not
one file per endpoint.

## When a parser earns its keep — and when it doesn't

Add a parser when there's real transformation to do: flattening a nested
envelope (`{ data: [...] }` → `[...]`), computing a derived field, coercing
types, normalizing an array into a lookup map. **Skip it** for an endpoint
whose response is already exactly what components need — a pass-through
`parseXResponse = (r) => r.data` for every single endpoint "for consistency"
adds a layer with no payoff. This mirrors the DB-design doc's own framing for
"does this data need its own home" — apply the same instinct to whether a
transform earns its own function.

## Template

```javascript
// src/store/parsers/conversations.parsers.js

export const parseConversationsResponse = (response) => {
  if (!response?.data) return []

  return response.data.map((conversation) => ({
    id: conversation.id,
    type: conversation.type,
    name: conversation.name,
    avatarUrl: conversation.avatarUrl,
    lastMessageAt: conversation.lastMessage?.createdAt ?? null,
    unreadCount: conversation.unreadCount ?? 0,
  }))
}

export const parseConversationDetailResponse = (response) => {
  if (!response?.data) return null

  return {
    id: response.data.id,
    type: response.data.type,
    name: response.data.name,
    members: response.data.members?.map((m) => ({
      userId: m.userId,
      role: m.role,
      username: m.username,
    })) ?? [],
  }
}
```

## Don't reinvent field-casing transforms that don't apply here

Some React/Redux codebases run every API parser through a generic
`snake_case → camelCase` conversion because their backend returns
snake_case JSON. Rhynk's server is Fastify + Prisma/Mongoose returning
already-camelCase fields (see `docs/schema.prisma` field names) — don't add
a generic case-conversion utility "just in case"; if a specific endpoint
genuinely returns snake_case (verify against the live response, don't
assume), handle that field-by-field in that endpoint's own parser.

## Checklist

- [ ] Pure function — no API calls, no Redux dispatch, no side effects.
- [ ] Handles a missing/malformed response gracefully (return `[]`/`null`,
      don't throw) so a transient bad response doesn't crash the component
      tree.
- [ ] Only exists where it does real transformation work — see above.
- [ ] Wired in via `transformResponse` on the relevant RTK Query endpoint
      (see [[create-api-service]]), not called manually inside a component.
