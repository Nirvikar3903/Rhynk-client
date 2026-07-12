# Create Redux Slice Workflow

(This replaced a Zustand-store workflow after the team confirmed **Redux
Toolkit**, not Zustand, is the state-management approach — see
[[00-overview]], [[05-state-data-layer]]. `@reduxjs/toolkit` and
`react-redux` aren't installed yet; that's a prerequisite before the first
slice.)

## Where it goes

`src/store/slices/<domain>.slice.js` — plain Redux Toolkit slice for
client-owned state (auth session, presence, UI). Server-derived data
(conversations, messages, songs) belongs in RTK Query's cache instead — see
[[create-api-service]] — not duplicated into a slice.

## Naming

camelCase domain + `.slice.js` (see [[02-naming]]): `auth.slice.js`,
`presence.slice.js`. Named exports for actions + selectors, default export
for the reducer.

## Template

```javascript
// src/store/slices/presence.slice.js
import { createSlice } from '@reduxjs/toolkit'

const presenceSlice = createSlice({
  name: 'presence',
  initialState: { onlineUserIds: [] },
  reducers: {
    setOnline: (state, action) => {
      if (!state.onlineUserIds.includes(action.payload)) {
        state.onlineUserIds.push(action.payload)
      }
    },
    setOffline: (state, action) => {
      state.onlineUserIds = state.onlineUserIds.filter((id) => id !== action.payload)
    },
  },
})

export const { setOnline, setOffline } = presenceSlice.actions
export const selectIsOnline = (userId) => (state) => state.presence.onlineUserIds.includes(userId)
export default presenceSlice.reducer
```

Dispatched from `presence:update` socket events (see
[[07-realtime-sockets]]), not from a REST poll.

## Register in the store

```javascript
// src/store/index.js
import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from './api/baseApi'
import authReducer from './slices/auth.slice'
import presenceReducer from './slices/presence.slice'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    presence: presenceReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})
```

## Persistence

No `redux-persist` is installed. If a slice needs to survive a page reload
(the auth session, most obviously — access token, current user), that's an
explicit `npm install redux-persist` decision to raise, same as any other
dependency addition — don't hand-roll a `localStorage` sync effect as a
workaround, and don't add `redux-persist` speculatively for slices that
don't need it yet.

## Checklist

- [ ] Uses `createSlice` — reducers mutate `state` directly (Immer handles
      immutability under the hood), don't hand-write spread-heavy immutable
      updates.
- [ ] Selectors are plain functions (`(state) => state.domain.field`) —
      reach for `createSelector` (memoized) only once a derived computation
      is actually expensive or a component re-render regresses; don't wrap
      every trivial field-access selector in `createSelector` by default.
- [ ] Loading/error flags for a slice's *own* async actions (if any) — but
      loading/error for anything fetched from the server belongs to RTK
      Query's own `isLoading`/`error`, not duplicated into slice state.
