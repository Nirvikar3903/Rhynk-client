# 04 — UI & Styling

## MUI (Material-UI) — the decided UI library, installed

The team has confirmed **MUI** as the UI library for this client — not
Tailwind CSS/shadcn-ui. `@mui/material`, `@mui/icons-material`,
`@emotion/react`, `@emotion/styled` are installed; the entire Tailwind/Radix/
shadcn dependency set (`@tailwindcss/vite`, `tailwindcss`, `@radix-ui/react-*`,
`class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`) has been
removed from `package.json` — there's nothing left to accidentally build
against.

Installed doesn't mean implemented: there's no theme object, no
`<ThemeProvider>`/`<CssBaseline>` wrapping the app, and `src/components/mui/`
is still empty — see below.

## Styling — SX prop, not Tailwind classes

All custom styling goes through MUI's `sx` prop (or `styled()` for reusable
style-heavy components) — not `className` + Tailwind utilities, not inline
`style` objects.

```jsx
// ✅ Correct
import { Box, Card, Typography } from '@mui/material'

const RoomMemberCard = ({ member, isDj }) => (
  <Card
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      p: 1.5,
      borderRadius: 2,
      border: isDj ? '2px solid' : '1px solid',
      borderColor: isDj ? 'primary.main' : 'divider',
    }}
  >
    <Typography variant="body2" sx={{ fontWeight: isDj ? 600 : 400 }}>
      {member.displayName}
    </Typography>
  </Card>
)

// ❌ Avoid — Tailwind classes, no longer the styling approach
const RoomMemberCard = ({ member }) => (
  <div className="flex items-center gap-2 rounded-lg border p-3">...</div>
)
```

## Theme

`src/theme/` exists as a folder but is empty — the theme object hasn't been
created yet. When it is:

```javascript
// src/theme/index.js
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: { main: '#6C5CE7' }, // placeholder — align with actual brand color once defined
    background: { default: '#0F0F1A' }, // Rhynk skews toward a dark, music-app aesthetic per the PRD's own screenshots — confirm before assuming light-mode-first
  },
  shape: { borderRadius: 8 },
})

export default theme
```

Wrap the app once in `main.jsx`/`App.jsx` with `<ThemeProvider theme={theme}>`
+ `<CssBaseline />` — neither exists yet.

## MUI wrapper components — `src/components/mui/`

`src/components/mui/` already exists as an empty folder (see
[[01-architecture]]) — the convention is to wrap every MUI primitive the app
actually uses (Button, TextField, Card, Dialog, …) rather than importing
`@mui/material` components directly all over the codebase, so theme-level
behavior (loading states, consistent `sx` defaults) has one place to live.
See [[create-mui-component]] for the concrete template and naming
(`AppButtonComponent.jsx`, PascalCase + `Component` suffix, per
[[02-naming]]).

## Toasts

`react-toastify` is installed for toast notifications (`sonner` was removed —
this repo previously used it, but the team switched) — keep using
`react-toastify` (it's independent of the UI library choice) rather than
reaching for MUI's `Snackbar`/`Alert` for transient notifications. The app
root (`App.jsx`) renders a single `<ToastContainer />`; containers just
`import { toast } from 'react-toastify'` and call `toast.success`/
`toast.error`/`toast.info`. Use it for surfacing `OTP_INVALID`,
`SESSION_REVOKED`, etc. from the auth API — see [[06-auth-security]].

## Icons

`@mui/icons-material` is installed — use it for consistency with MUI's
theming (icons pick up `color`/`sx` the same way MUI components do).
`lucide-react` (the shadcn-era icon set) has been removed — there's no
second icon library to accidentally reach for.

## Responsive design — MUI breakpoints

Use MUI's breakpoint object (`xs`, `sm`, `md`, `lg`, `xl`) inside `sx`, not
Tailwind's `sm:`/`md:` class prefixes:

```jsx
<Box
  sx={{
    p: { xs: 2, sm: 3, md: 4 },
    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
    display: 'grid',
    gap: 2,
  }}
>
  {/* ... */}
</Box>
```
