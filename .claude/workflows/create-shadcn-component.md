# Create shadcn/ui-style Component Workflow

(Replaces an MUI-wrapper workflow — this repo has no MUI dependency at all.
The installed stack — Radix primitives, `class-variance-authority`, `clsx`,
`tailwind-merge`, `lucide-react` — is the classic shadcn/ui dependency set,
per [[04-ui-styling]].)

## Prerequisite — this doesn't exist yet

There is no `components.json`, no `src/components/ui/`, and no `cn()`
helper in the repo yet (see [[00-overview]], [[04-ui-styling]]). Before the
first shadcn-style component:

1. Confirm the Tailwind v4 entry stylesheet is actually wired up
   (`src/index.css` is currently empty — see [[04-ui-styling]]).
2. Create `src/lib/utils.js` with the standard `cn()` helper:

```javascript
// src/lib/utils.js
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
```

3. Either run the shadcn CLI (`npx shadcn@latest init`, once path aliasing
   exists — see [[01-architecture]]) to scaffold `components.json` and
   generate components against this repo's actual Tailwind v4 setup, or
   hand-write wrappers following the shape below if the CLI isn't wanted.

## Template — hand-written wrapper (if not using the CLI)

```jsx
// src/components/ui/button.jsx
import { cva } from 'class-variance-authority'
import { cn } from 'lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input hover:bg-accent',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

const Button = ({ className, variant, size, ...props }) => (
  <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
)

export default Button
```

Every Radix primitive already installed (`avatar`, `dialog`,
`dropdown-menu`, `label`, `toast`, `tooltip`) gets this same treatment: wrap
the unstyled Radix primitive, expose `cva`-driven variants, merge incoming
`className` with `cn()`.

## Checklist

- [ ] Lives in `src/components/ui/`, not scattered per-feature — this is the
      shared design-system layer.
- [ ] Uses `cva` for variants, `cn()` for class merging — don't hand-roll
      conditional className string concatenation.
- [ ] Wraps a Radix primitive already in `package.json` — if a needed
      primitive isn't installed (e.g. `@radix-ui/react-select`), that's an
      explicit `npm install` to call out, not something to fake with plain
      HTML.
- [ ] `sonner` (already installed) is the toast system — don't build on top
      of `@radix-ui/react-toast` directly for app-level toasts; that
      primitive is present but `sonner` is the intended toast API per
      [[04-ui-styling]].
