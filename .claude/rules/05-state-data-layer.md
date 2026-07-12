# 05 — State & Data Layer (Redux Toolkit + RTK Query)

## Decided approach — not yet installed

The team has confirmed **Redux Toolkit** (global/client state) + **RTK
Query** (server state — caching, pagination, invalidation) + a
**`store/parsers/`** layer (response transformation) as the actual
state-management architecture for this client. This supersedes both:

- the PRD's mention of TanStack Query (§6.1), and
- the `zustand ^5.0.14` dependency currently sitting in `package.json`
  unused (see [[00-overview]]).

**Neither `@reduxjs/toolkit` nor `react-redux` is installed yet.** Installing
them (and removing `zustand` once the migration is actually done — don't
remove it preemptively if anything still depends on it) is a prerequisite
before writing the first slice or API endpoint. Don't write Redux code
against a store that doesn't exist yet without calling out that the install
step comes first.

## Folder shape (`src/store/`)

```
store/
├── api/          RTK Query endpoints, one file per feature — *.apislice.js
├── parsers/      pure functions transforming raw API responses — *.parsers.js
├── slices/       plain Redux slices for client state — *.slice.js
└── index.js      configureStore — combines all slices + RTK Query middleware
```

See [[02-naming]] for the exact file-naming convention.

## Base API setup (create once, inject into per-feature)

```javascript
// src/store/api/baseApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken
      if (token) headers.set('authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['User', 'Conversation', 'Message', 'MusicRoom', 'Song', 'Playlist', 'Notification'],
  endpoints: () => ({}),
})
```

`axios` is already installed (`^1.18.1`) but RTK Query's own
`fetchBaseQuery` (native `fetch`) is the standard pairing and is shown above
as the default. If a reason emerges to route through axios instead (e.g. to
reuse interceptor logic that's easier to express with axios), that's a
`baseQuery: axiosBaseQuery(...)` swap in this one file — don't mix the two
HTTP clients across different feature `*.apislice.js` files.

## Per-feature endpoint file

```javascript
// src/store/api/conversations.apislice.js
import { baseApi } from './baseApi'
import { parseConversationsResponse } from 'store/parsers/conversations.parsers'

export const conversationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => '/conversations',
      transformResponse: parseConversationsResponse,
      providesTags: ['Conversation'],
    }),
    createConversation: builder.mutation({
      query: (body) => ({ url: '/conversations', method: 'POST', body }),
      invalidatesTags: ['Conversation'],
    }),
  }),
})

export const { useGetConversationsQuery, useCreateConversationMutation } = conversationsApi
```

## Verify the base path before hardcoding it

The PRD's API design section (§11) uses `/api/v1/...` while the
currently-implemented server auth routes in `docs/AUTH_MODULE.md` are bare
`/auth/...` — the two docs disagree on the prefix. Check the live server's
actual route registration for a given feature before hardcoding either
prefix into `VITE_API_URL` or a `query: () => '/...'` path.

## Parsers — when they earn their keep

A parser is a **pure function**, called via `transformResponse`, that
reshapes a raw server response into what the app actually wants to consume.
Add one when there's real transformation to do (flattening a nested payload,
computing a derived field, normalizing an array into a lookup map) — for an
endpoint whose response is already exactly what components need, skip the
indirection rather than adding a pass-through parser for consistency's sake.

```javascript
// src/store/parsers/conversations.parsers.js
export const parseConversationsResponse = (response) => {
  if (!response?.data) return []
  return response.data.map((c) => ({
    id: c.id,
    type: c.type,
    name: c.name,
    lastMessageAt: c.lastMessage?.createdAt ?? null,
  }))
}
```

## Slices — plain client state, not a server-response cache

```javascript
// src/store/slices/auth.slice.js
import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, accessToken: null, isAuthenticated: false },
  reducers: {
    setSession: (state, action) => {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.isAuthenticated = true
    },
    clearSession: (state) => {
      state.user = null
      state.accessToken = null
      state.isAuthenticated = false
    },
  },
})

export const { setSession, clearSession } = authSlice.actions
export const selectUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export default authSlice.reducer
```

Server-derived data (conversations, messages, songs) belongs in RTK Query's
own cache, not duplicated into a slice — slices are for auth session,
presence, and other genuinely client-owned state (per the same
"if this changed 10x/second and a refresh lost it, would anyone care"
framing the backend's own DB-design doc uses for its Postgres/Mongo/Redis
split — apply the same test here for Redux-cache vs. RTK-Query-cache vs.
component-local `useState`).

## Store assembly

```javascript
// src/store/index.js
import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from './api/baseApi'
import authReducer from './slices/auth.slice'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})
```

## Token refresh on 401

RTK Query supports a wrapped base query that retries once on 401 (a
`baseQueryWithReauth` pattern) — implement this around `/auth/refresh` (see
[[06-auth-security]]) rather than handling 401s ad hoc in individual
components. `SESSION_REVOKED`/a failed refresh must dispatch `clearSession`
and redirect to login, not retry in a loop.

## Cursor pagination (messages)

Per LLD §2 and §11.3, message history uses a compound cursor
(`{ created_at, _id }`), never `_id` alone. RTK Query's own pagination
patterns (`serializeQueryArgs` / merging pages in `merge`) can model this,
but pass through exactly the cursor shape the server returns — don't
reconstruct or guess a cursor client-side.
