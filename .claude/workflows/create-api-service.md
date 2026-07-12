# Create API Service Workflow (RTK Query)

## One `*.apislice.js` per feature, injected into a shared base API

Per [[01-architecture]] and [[05-state-data-layer]]: `src/store/api/baseApi.js`
is created once (`createApi` + `fetchBaseQuery`, auth header attached via
`prepareHeaders` reading the `auth` slice). Every feature injects its own
endpoints into it via `injectEndpoints` — this is what makes it a *shared
base*, not a per-feature axios instance.

## Template

```javascript
// src/store/api/baseApi.js — created once
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

Components/hooks consume the generated `use*Query`/`use*Mutation` hooks
directly — don't add another custom hook layer just to re-wrap them unless
there's real logic beyond calling the hook (see [[create-hook]]).

## Verify the base path before hardcoding it

The PRD's API design section (§11) uses `/api/v1/...` while the
currently-implemented server auth routes in `docs/AUTH_MODULE.md` are bare
`/auth/...` — the two docs disagree on the prefix. Check the live server's
actual route registration for a given feature before hardcoding either
prefix into `VITE_API_URL` or a `query: () => '/...'` path.

## Cache invalidation

Use `providesTags` on queries, `invalidatesTags` on mutations that affect
that data — this is what replaces manual "refetch after create/update" logic.
Keep tags specific (`{ type: 'Conversation', id }` for a single item) once
more than a whole-list invalidation is needed; don't reach for
over-broad tags that cause unrelated queries to refetch.

## Cursor pagination (messages)

For the message-history endpoint specifically (LLD §2, §11.3): the server's
compound cursor (`{ created_at, _id }`) must be passed through and returned
as-is — RTK Query's `serializeQueryArgs`/`merge` options can model
"append next page" caching, but don't reconstruct or guess a cursor
client-side. Confirm the actual query-param wire format against the live
server rather than guessing — the PRD doesn't fully specify it.

## Parsers

See [[create-parser]] for when a `transformResponse` earns a dedicated
parser function vs. staying inline.
