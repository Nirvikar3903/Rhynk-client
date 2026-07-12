# 04 — UI & Styling

## Tailwind CSS v4 — CSS-first, not the v3 setup the PRD describes

`@tailwindcss/vite` is registered as a Vite plugin (`vite.config.js`). Tailwind
v4 does **not** use a `tailwind.config.js` / `postcss.config.js` pair the way
v3 does — there is none in this repo, and there shouldn't need to be one for
basic usage. Instead, Tailwind is enabled per-stylesheet via
`@import "tailwindcss";` in a CSS file that gets loaded.

**Known gap right now:** `src/index.css` is 0 bytes. It is never populated
with `@import "tailwindcss";`, so despite the plugin being registered,
Tailwind utility classes currently do nothing anywhere in the app (e.g.
`App.jsx`'s `text-3xl font-bold underline` renders unstyled). This must be
fixed (add the import to `index.css`, confirm `main.jsx` imports that CSS
file) before any Tailwind class will visibly work — verify this is still true
before assuming Tailwind "just works" because the plugin is present.

If v4-style theme customization is needed later, it goes in CSS via `@theme`
blocks in the same entry stylesheet, not in a JS config file.

## shadcn/ui — primitives installed, CLI scaffolding not run yet

The dependency set matches a shadcn/ui setup: `@radix-ui/react-*` primitives
(avatar, dialog, dropdown-menu, label, toast, tooltip), `class-variance-authority`,
`clsx`, `tailwind-merge`, `lucide-react`. However:

- No `components.json` (the shadcn CLI's config file) exists.
- No `src/components/ui/` directory exists.
- No `cn()` utility (the typical `clsx` + `tailwind-merge` merge helper) has
  been created yet.

Before building shadcn-style wrapper components, either run the shadcn CLI
init (needs the Tailwind v4 + alias setup from [[01-architecture]] in place
first) or hand-write the `cn()` helper and per-component wrappers consistent
with shadcn's usual output shape (a thin wrapper around each Radix primitive
using `cva` for variants). Don't invent a different UI pattern in parallel —
the installed deps signal the intended one.

## Toasts

`sonner` is installed for toast notifications — use it rather than adding
another toast library or hand-rolling one, once notifications are needed
(e.g. surfacing `OTP_INVALID`, `SESSION_REVOKED`, etc. from the auth API —
see [[06-auth-security]]).

## Icons

`lucide-react` is the icon set already installed — prefer it over adding a
second icon library.
