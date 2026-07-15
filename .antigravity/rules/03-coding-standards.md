# 03 — Coding Standards

## Plain JS/JSX — no TypeScript

Despite the PRD specifying TypeScript 5.x for the frontend (§6.1), this repo
is plain JavaScript: `App.jsx`/`main.jsx`, no `tsconfig.json`, no `.ts`/`.tsx`
files anywhere. The `@types/react` and `@types/react-dom` devDependencies are
present only for editor intellisense on the JS files, not evidence of a
planned TypeScript migration — don't introduce `.ts`/`.tsx` files without
confirming that's actually wanted; it would require adding a TS toolchain
that doesn't exist today.

## ESLint — actual config, not the PRD's assumptions

`eslint.config.js` is a flat config covering `**/*.{js,jsx}` only, extending:

- `@eslint/js` recommended
- `eslint-plugin-react-hooks` recommended (flat)
- `eslint-plugin-react-refresh` (vite preset)
- browser globals

There is **no** `eslint-plugin-react` (no prop-types/JSX-specific linting
beyond hooks rules), no import-order plugin, no accessibility (`jsx-a11y`)
plugin. Don't assume any of these are enforced — if you want import ordering
or a11y linting enforced, that's a deliberate addition to `eslint.config.js`,
not something already configured.

`dist` is the only global ignore.

## Import order (convention, not lint-enforced today)

1. React / React-related imports
2. Third-party libraries
3. Internal absolute imports (once aliasing exists — see [[01-architecture]])
4. Relative imports (only when no absolute alias applies)

```javascript
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from 'app/store/auth.store'
```

## Component style

- Function components only, no class components.
- Props destructured in the function signature, not accessed via `props.x`
  inside the body.
- `React` default import is currently used explicitly in `App.jsx`
  (`import React from 'react'`) even though the new JSX transform (Vite +
  `@vitejs/plugin-react`) doesn't require it — follow whatever the surrounding
  file already does rather than mixing both styles in the same PR.
