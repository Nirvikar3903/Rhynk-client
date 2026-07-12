# Figma Integration Workflow

## No design system extracted yet, and no MUI theme to target

There is no Figma file reference anywhere in `docs/`, and — unlike an
MUI-based app — this repo has no `createTheme()`/theme object to map design
tokens onto. Tailwind v4 is CSS-first (see [[04-ui-styling]]): design tokens
belong in the entry stylesheet (`src/index.css`, currently empty) as CSS
custom properties inside an `@theme` block, not a JS theme file.

## If a Figma file becomes available

A Figma MCP integration may be available in-session (tools like
`get_design_context`, `get_variable_defs`, `get_screenshot`, `use_figma`) —
check for it before hand-transcribing colors/spacing from a screenshot.
When it is available, prefer `get_variable_defs` to pull Figma's actual
design variables (colors, spacing, type scale) rather than eyeballing pixel
values off a rendered frame.

## Mapping Figma tokens into this stack

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.7 0.15 280); /* from Figma's primary/500 or equivalent */
  --color-destructive: oklch(0.6 0.2 25);
  --radius: 0.5rem;
}
```

Tailwind v4 auto-generates utility classes (`bg-primary`, `rounded-[--radius]`,
etc.) from `@theme` variables — there's no separate `tailwind.config.js`
`theme.extend.colors` block to maintain in parallel, unlike a v3 project.

## Component mapping

Figma components map onto the shadcn-style wrapper components described in
[[create-shadcn-component]] (`src/components/ui/`), driven by `cva` variants
— not onto MUI `styleOverrides`/`sx` the way an MUI-based design-token
pipeline would. When translating a Figma component:

1. Identify which Radix primitive it wraps (button, dialog, dropdown, etc.)
   — only the primitives already in `package.json` are available without a
   new install (see [[create-shadcn-component]]).
2. Express Figma's variant set (size, intent/color) as `cva` variants, not
   as one-off conditional Tailwind classes scattered through the component.

## Checklist

- [ ] Confirm `src/index.css` actually has `@import "tailwindcss";` before
      assuming any theme token will render (see [[04-ui-styling]] — it
      doesn't today).
- [ ] Pull real values via Figma tooling where available rather than
      estimating from a screenshot.
- [ ] Map to existing installed Radix primitives first; flag (don't
      silently add) any new `@radix-ui/react-*` package a Figma component
      would require.
