# Create Hook Workflow

## Where it goes

`src/hooks/` — this repo doesn't nest a `hooks/` folder inside each feature;
all hooks (cross-cutting and feature-scoped alike) live flat in
`src/hooks/`, disambiguated by name (per [[01-architecture]],
[[02-naming]]).

## Naming

camelCase, `use` prefix, plain `.js` (see [[02-naming]]) — e.g.
`useConversations.js`, `useRoomSync.js` (the Music Provider Strategy doc's
own precedent, see [[08-music-rooms]]).

## Stack this hook is built on

Redux Toolkit + RTK Query (see [[05-state-data-layer]]) — **not** Zustand,
**not** hand-rolled fetch-on-mount `useState`/`useEffect`. RTK Query already
generates data-fetching hooks per endpoint (`useGetConversationsQuery`, etc.
— see [[create-api-service]]), so a feature hook is usually a thin
composition layer over those, plus `useSelector`/`useDispatch` for slice
state (see [[create-redux-slice]]) — not a reimplementation of what RTK
Query already gives you.

## Template — composing an RTK Query hook

```javascript
// src/hooks/useConversations.js
import { useGetConversationsQuery } from 'store/api/conversations.apislice'

const useConversations = () => {
  const { data: conversations = [], isLoading, error, refetch } = useGetConversationsQuery()
  return { conversations, isLoading, error, refresh: refetch }
}

export default useConversations
```

If the RTK Query hook alone is enough (no extra derived logic), call it
directly from the component — don't add a wrapper hook that does nothing but
rename the return values.

## Template — composing slice state + dispatch

```javascript
// src/hooks/useAuthSession.js
import { useSelector, useDispatch } from 'react-redux'
import { setSession, clearSession, selectUser, selectIsAuthenticated } from 'store/slices/auth.slice'

const useAuthSession = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const login = (user, accessToken) => dispatch(setSession({ user, accessToken }))
  const logout = () => dispatch(clearSession())

  return { user, isAuthenticated, login, logout }
}

export default useAuthSession
```

## Checklist

- [ ] Doesn't duplicate what an RTK Query hook already provides
      (`isLoading`, `error`, caching, refetch) — compose it, don't
      reimplement it.
- [ ] Uses memoized selectors (`selectUser`, not an inline
      `(state) => state.auth.user` repeated everywhere) exported from the
      relevant `*.slice.js`.
- [ ] Cleans up subscriptions (socket listeners, timers) in a `useEffect`
      return function — relevant for anything touching Socket.IO (see
      [[07-realtime-sockets]]); RTK Query subscriptions clean themselves up
      automatically and don't need this.
- [ ] Doesn't reach across domains — a messages hook shouldn't import from
      the music-rooms container, and vice versa.
