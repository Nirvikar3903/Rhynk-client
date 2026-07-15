# Create Component Workflow

## Where it goes

- Cross-feature dumb UI primitive → `src/components/<domain>/` (see [[01-architecture]]).
- Feature-scoped UI (business logic, RTK Query, Redux) → `src/features/containers/<domain>/`.
- MUI wrapper around a `@mui/material` primitive → `src/components/mui/` (see
  [[create-mui-component]] instead — that's a distinct, more constrained
  pattern from a plain feature component).

## Naming

PascalCase, `.jsx`, file name matches the default export (see [[02-naming]]).
No `Component` suffix convention in this repo — just `MessageBubble.jsx`, not
`MessageBubbleComponent.jsx`.

## No PropTypes — not installed

`prop-types` is **not** a dependency here. Don't add `Component.propTypes =
{...}` blocks — either rely on plain JS destructuring with sane defaults, or
if runtime prop validation is genuinely wanted, that's a deliberate
`npm install prop-types` decision to raise first, not something to add ad hoc
in one component.

## Template

```jsx
// src/components/messages/MessageBubble.jsx
import { memo } from 'react'
import { Box, Typography } from '@mui/material'

const MessageBubble = ({ message, isOwn = false, onReact }) => {
  return (
    <Box
      sx={{
        maxWidth: '70%',
        ml: isOwn ? 'auto' : 0,
        borderRadius: 3,
        px: 2,
        py: 1,
        bgcolor: isOwn ? 'primary.main' : 'action.hover',
        color: isOwn ? 'primary.contrastText' : 'text.primary',
      }}
    >
      <Typography variant="body2">{message.content.text}</Typography>
      {onReact && (
        <Typography
          component="button"
          onClick={() => onReact(message._id)}
          variant="caption"
          sx={{ opacity: 0.6, border: 0, bgcolor: 'transparent', cursor: 'pointer' }}
        >
          react
        </Typography>
      )}
    </Box>
  )
}

export default memo(MessageBubble)
```

## Checklist

- [ ] Function component, hooks only — no class components.
- [ ] Props destructured in the signature, sensible defaults inline.
- [ ] Pure UI — no `fetch`/RTK Query hook calls, no `useSelector`/`useDispatch`
      inside a component meant to live in `components/<domain>/` (the
      matching container in `features/containers/<domain>/` owns that — see
      [[01-architecture]] module boundaries).
- [ ] Styling via MUI's `sx` prop, not Tailwind `className` or inline `style`
      objects — see [[04-ui-styling]].
- [ ] Wrap in `memo()` only if it's rendered in a list or receives stable
      props — don't cargo-cult it onto every component.
- [ ] No test file expected by default — no test runner is configured yet
      (see [[09-git-env-workflow]]); don't invent a `__tests__/` convention
      without confirming a runner (Vitest, most likely, given Vite) is being
      added first.
