# Create Component Workflow

## Where it goes

- Cross-feature dumb UI primitive → `src/components/` (see [[01-architecture]]).
- Feature-scoped UI → `src/features/<name>/components/`.
- shadcn-style wrapper around a Radix primitive → `src/components/ui/` (see
  [[create-shadcn-component]] instead — that's a distinct, more constrained
  pattern from a plain feature component).

## Naming

PascalCase, `.jsx`, file name matches the default export (see [[02-naming]]).
No `Component` suffix convention in this repo — just `MessageBubble.jsx`, not
`MessageBubbleComponent.jsx`.

## No PropTypes — not installed

Unlike prop-types-based React codebases, `prop-types` is **not** a dependency
here. Don't add `Component.propTypes = {...}` blocks — either rely on plain
JS destructuring with sane defaults, or if runtime prop validation is
genuinely wanted, that's a deliberate `npm install prop-types` decision to
raise first, not something to add ad hoc in one component.

## Template

```jsx
// src/features/conversations/components/MessageBubble.jsx
import { memo } from 'react'
import { cn } from 'lib/utils' // see create-shadcn-component — cn() helper

const MessageBubble = ({ message, isOwn = false, onReact }) => {
  return (
    <div
      className={cn(
        'max-w-[70%] rounded-2xl px-4 py-2 text-sm',
        isOwn ? 'ml-auto bg-primary text-primary-foreground' : 'bg-muted',
      )}
    >
      <p>{message.content.text}</p>
      {onReact && (
        <button onClick={() => onReact(message._id)} className="text-xs opacity-60">
          react
        </button>
      )}
    </div>
  )
}

export default memo(MessageBubble)
```

## Checklist

- [ ] Function component, hooks only — no class components.
- [ ] Props destructured in the signature, sensible defaults inline.
- [ ] Pure UI — no `fetch`/RTK Query hook calls, no `useSelector`/`useDispatch`,
      inside a component meant to live in `components/` (feature components
      *may* reach into their own feature's hooks — see [[01-architecture]]
      module boundaries).
- [ ] Styling via Tailwind utility classes (`className`), not inline `style`
      objects — this is a Tailwind v4 project, not MUI's `sx` prop.
- [ ] Wrap in `memo()` only if it's rendered in a list or receives stable
      props — don't cargo-cult it onto every component.
- [ ] No test file expected by default — no test runner is configured yet
      (see [[09-git-env-workflow]]); don't invent a `__tests__/` convention
      without confirming a runner (Vitest, most likely, given Vite) is being
      added first.
