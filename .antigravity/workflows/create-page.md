# Create Page Workflow

## Pattern

`Page` (route-level, `src/pages/`) → container from
`src/features/containers/<domain>/` → dumb UI from `src/components/<domain>/`
and `src/components/mui/`. This repo **does** use a container/component
split (see [[01-architecture]]) — a page composes one or more containers,
and each container owns its own data-fetching (RTK Query hooks, Redux) while
delegating rendering to plain components.

## Router — React Router v7, not v6

`react-router-dom` is `^7.18.1`. v7's data APIs (loaders, actions,
`createBrowserRouter`) are available. `src/router/` already exists as a
folder but is currently empty — nothing in this repo uses either routing
style yet. Decide once, when the first real route is added, whether routing
goes through a `<Routes>`/`<Route>` tree (closer to v6 style, still supported
in v7) or the newer data-router APIs — don't mix both patterns across the
app.

## Template

```jsx
// src/pages/ConversationsPage.jsx
import ConversationListContainer from 'features/containers/conversations/ConversationListContainer'
import AppLayout from 'layouts/AppLayout'

const ConversationsPage = () => {
  return (
    <AppLayout>
      <ConversationListContainer />
    </AppLayout>
  )
}

export default ConversationsPage
```

`ConversationListContainer` owns its data-fetching (via RTK Query / a hook
from `src/hooks/` — see [[create-hook]]) and renders the dumb components
from `src/components/conversations/` — the page itself stays purely
compositional.

## Route registration (`src/router/` already exists, but is empty)

```jsx
// src/router/index.jsx
import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'

const ConversationsPage = lazy(() => import('pages/ConversationsPage'))
const LoginPage = lazy(() => import('pages/LoginPage'))

const AppRouter = () => (
  <Suspense fallback={<div>Loading…</div>}>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/conversations" element={<ConversationsPage />} />
    </Routes>
  </Suspense>
)

export default AppRouter
```

Route guarding (redirect to `/login` when not authenticated) reads
`selectIsAuthenticated` from the `auth` slice (see [[create-hook]],
[[create-redux-slice]], [[06-auth-security]]) via `useSelector` — there's no
such guard component yet, build it alongside the first protected route
rather than speculatively.

## Checklist

- [ ] Page component itself has no business logic — it composes.
- [ ] Lazy-load pages once there's more than a couple of routes (`lazy()` +
      `Suspense`), matching the pattern above.
- [ ] Auth-gated pages check `useAuthSession`'s `isAuthenticated` (see
      [[create-hook]]), not a component-local `isLoggedIn` flag.
