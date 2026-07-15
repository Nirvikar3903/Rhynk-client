# 09 — Git, Env & Workflow

## Environment variables

No `.env` or `.env.example` exists in this repo yet. Vite only exposes
variables prefixed `VITE_` to client code (via `import.meta.env.VITE_*`) — any
env var without that prefix silently won't reach the browser bundle. At
minimum, once the API/socket layers are wired up, this repo will need:

- `VITE_API_URL` — REST base URL (server on port 4000 locally per PRD §6.2)
- `VITE_SOCKET_URL` — Socket.IO gateway URL (same origin as the API in the
  current single-process backend design, per HLD §2)

Add a `.env.example` alongside the first feature that actually needs one of
these — don't add speculative env vars for features that don't exist yet.

## Git

- Single commit so far (`a27741b`). No CI/CD configured in this repo (GitHub
  Actions is mentioned in the PRD at the whole-project level, §6.4, but
  nothing is wired up here).
- `.gitignore` already excludes `node_modules`, `dist`, `dist-ssr`, editor
  dirs, logs — standard Vite template ignores. If a `.env` is added, make
  sure it's covered (it currently isn't listed explicitly, though `*.local`
  would catch `.env.local` specifically — a bare `.env` is not currently
  ignored, add it before ever creating one).

## No Docker

Per the PRD (§6.3), all databases are cloud-hosted (Supabase, Atlas, Upstash)
and Docker is explicitly not used in this project. There's nothing for the
client repo to containerize either way — don't introduce a `Dockerfile` for
local dev.

## Dev scripts (from `package.json`)

```
npm run dev       # vite dev server
npm run build     # vite build
npm run lint      # eslint .
npm run preview   # vite preview (serves the production build locally)
```

No test runner is configured (no Vitest/Jest, no test script). If tests are
introduced, add the runner and script deliberately rather than assuming one
is already wired up.
