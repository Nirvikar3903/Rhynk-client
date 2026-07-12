# Create Page Workflow

## Pattern

`Page` (route-level, `src/pages/`) → feature component(s) from
`src/features/<name>/components/` → shared UI from `src/components/`. There
is no separate "container" layer in this repo's target structure (unlike
Redux-style container/component split) — a page composes feature components
directly, and feature components use feature hooks for data (see
[[01-architecture]]).

## Router — React Router v7, not v6

`react-router-dom` is `^7.18.1`. v7's data APIs (loaders, actions,
`createBrowserRouter`) are available but nothing in this repo uses them yet
— there's no `src/router/` at all today. Decide once, when the first real
route is added, whether routing goes through a `<Routes>`/`<Route>` tree
(closer to v6 style, still supported in v7) or the newer data-router APIs —
don't mix both patterns across the app.

## Template

```jsx
// src/pages/ConversationsPage.jsx
import ConversationList from 'features/conversations/components/ConversationList'
import AppLayout from 'layouts/AppLayout'

const ConversationsPage = () => {
  return (
    <AppLayout>
      <ConversationList />
    </AppLayout>
  )
}

export default ConversationsPage
```

`ConversationList` itself owns its data-fetching via a feature hook (see
[[create-hook]]) — the page stays purely compositional.

## Route registration (once `src/router/` exists)

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
- [ ] Auth-gated pages check `useAuthStore` (or equivalent), not a
      component-local `isLoggedIn` flag.
