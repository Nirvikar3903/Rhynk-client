# Figma Integration Workflow

## No design system extracted yet, and no theme object written yet

There is no Figma file reference anywhere in `docs/`. MUI is installed (see
[[00-overview]], [[04-ui-styling]]) but `src/theme/` exists as an empty
folder, with no `createTheme()` call in it yet. Design tokens pulled from
Figma belong in that theme object, not in CSS custom properties — this is an
MUI project, not Tailwind's CSS-first `@theme` block approach.

## If a Figma file becomes available

A Figma MCP integration may be available in-session (tools like
`get_design_context`, `get_variable_defs`, `get_screenshot`, `use_figma`) —
check for it before hand-transcribing colors/spacing from a screenshot.
When it is available, prefer `get_variable_defs` to pull Figma's actual
design variables (colors, spacing, type scale) rather than eyeballing pixel
values off a rendered frame.

## Mapping Figma tokens into this stack

```javascript
// src/theme/index.js
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: { main: '#6C5CE7' }, // from Figma's primary/500 or equivalent
    error: { main: '#E74C3C' },
  },
  shape: { borderRadius: 8 }, // from Figma's corner-radius token
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif', // from Figma's type scale
  },
})

export default theme
```

MUI's theme covers palette, typography, spacing, and shape in one JS object —
there's no separate config file to keep in sync, and no build-time CSS
generation step the way Tailwind's `@theme` block has.

## Component mapping

Figma components map onto the MUI wrapper components described in
[[create-mui-component]] (`src/components/mui/`), styled via the `sx` prop
and the shared theme — not onto Radix primitives or `cva` variants (that was
the retired shadcn-era pattern). When translating a Figma component:

1. Identify which `@mui/material` primitive it's built from (Button,
   TextField, Dialog, etc.) — MUI ships most common primitives already; a
   genuinely custom shape is a `styled()` component on top of `Box`, not a
   from-scratch element.
2. Express Figma's variant set (size, intent/color) as props on the MUI
   wrapper (`variant`, `color`, `size`), forwarded into the underlying MUI
   component's own variant system — not as one-off `sx` overrides scattered
   through call sites.

## Checklist

- [ ] Confirm `<ThemeProvider theme={theme}>` wraps the app before assuming
      any theme token will render — the theme object itself doesn't exist
      yet (see [[04-ui-styling]]).
- [ ] Pull real values via Figma tooling where available rather than
      estimating from a screenshot.
- [ ] Map to an existing MUI primitive first; flag (don't silently design
      around) any case that genuinely needs a non-MUI building block.
