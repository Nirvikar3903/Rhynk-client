# 10 — Task Discipline (do the task, not adjacent tasks)

This rule exists because both assistants (Claude Code and Antigravity) have
been observed doing more than what was asked — refactoring untouched code,
renaming things nobody asked to rename, "improving" adjacent files, or
inventing facts about the codebase instead of checking them. This rule is the
explicit guardrail against that.

## Do exactly what was asked, nothing adjacent

- If the task is "fix bug X" or "add component Y", the diff should touch only
  what fixing X or adding Y requires — not a drive-by refactor of the
  surrounding file, not a rename of a variable you noticed on the way, not a
  cleanup of unrelated code in the same file.
- Don't add abstractions, config, error handling, or edge-case handling for
  situations the task didn't ask about "while you're in there." A one-off
  fix doesn't need a helper function; a single form doesn't need a generic
  form-builder.
- Don't touch files outside the ones the task implies. If a change seems to
  require editing a file that wasn't obviously in scope, say so and ask
  before doing it, rather than silently expanding the diff.
- If you notice an unrelated bug, inconsistency, or improvement opportunity
  while working, mention it in your final response — don't fix it
  unprompted in the same change.

## Don't fabricate — verify against the actual repo

- Never assert that a file, function, endpoint, dependency, or config exists
  (or behaves a certain way) without having actually read it in this repo.
  This repo especially punishes guessing: per [[00-overview]] the scaffold is
  mostly empty folders, and per the PRD-vs-`package.json` table the assumed
  stack (Tailwind, TanStack Query, TypeScript, Zustand) is frequently *wrong*
  for what's actually installed.
- If a rule file or doc describes a target/planned state (theme not created,
  store not wired, socket layer unwired, etc. — see [[01-architecture]],
  [[05-state-data-layer]], [[07-realtime-sockets]]), don't treat that
  planned state as already implemented. Check the actual file before
  building on top of it.

## When the task is ambiguous, ask — don't guess bigger

- If a request could reasonably mean a small change or a large one (e.g.
  "add auth" could mean one endpoint or the whole flow), default to the
  smaller, literal interpretation and confirm before expanding, rather than
  building the maximal version nobody asked for.
- Silence on a topic is not permission to make a decision about it. If the
  task doesn't mention styling, testing, or a particular library, don't
  introduce one speculatively — follow [[00-overview]]'s stack table for
  what's already decided, and ask if something genuinely isn't covered.

## Apply this the same way in both assistants

Since `.claude/rules/` and `.antigravity/rules/` are kept byte-identical
(see [[00-overview]]), this file applies equally to Claude Code and
Antigravity — neither gets a pass to be more "helpful" by doing extra,
unrequested work.
