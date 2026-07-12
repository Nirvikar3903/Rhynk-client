# Create MUI Wrapper Component Workflow

(Replaces the old shadcn/ui-style component workflow — MUI is the decided
and now-installed UI library per [[04-ui-styling]], not the Radix/shadcn
stack that used to sit in `package.json`.)

## Prerequisite — theme/provider wiring, not the install itself

`@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`
are installed. What's still missing before the first MUI wrapper component:

1. A theme object at `src/theme/index.js` (see [[04-ui-styling]]) — doesn't
   exist yet.
2. `<ThemeProvider theme={theme}>` + `<CssBaseline />` wrapping the app in
   `main.jsx`/`App.jsx` — MUI components render but ignore the app's
   intended palette/typography without it.

## Where it goes and naming

- **Location**: `src/components/mui/`
- **Naming**: PascalCase with a `Component` suffix — `AppButtonComponent.jsx`,
  `AppTextFieldComponent.jsx` (see [[02-naming]]) — distinct from plain
  feature components, which take no suffix (see [[create-component]]).
- **Pattern**: one wrapper per MUI primitive actually used in the app, not a
  wrapper-per-usage — reuse `AppButtonComponent` everywhere a button is
  needed rather than writing bespoke `sx` at each call site.

## Template

```jsx
// src/components/mui/AppButtonComponent.jsx
import { memo } from 'react'
import { Button as MuiButton } from '@mui/material'

const AppButtonComponent = ({
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  children,
  sx = {},
  ...props
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      disabled={disabled || loading}
      sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 500, ...sx }}
      {...props}
    >
      {loading ? 'Loading…' : children}
    </MuiButton>
  )
}

export default memo(AppButtonComponent)
```

## Checklist

- [ ] Lives in `src/components/mui/`, not scattered per-feature — this is the
      shared design-system layer.
- [ ] Styling via the `sx` prop only — no Tailwind `className`, no
      `class-variance-authority` variants (that's the retired shadcn
      pattern).
- [ ] Accepts and merges an incoming `sx` prop rather than overriding it
      outright, so call sites can still make one-off adjustments.
- [ ] Wrap in `memo()` when the component is likely to render in a list
      (message bubbles, room member cards) — don't cargo-cult it onto every
      wrapper.
- [ ] Export it from `src/components/mui/index.js` (barrel file) once more
      than a couple of wrappers exist, so call sites can
      `import { AppButtonComponent, AppTextFieldComponent } from 'components/mui'`.
- [ ] No test file expected by default — no test runner is configured yet
      (see [[09-git-env-workflow]]).
