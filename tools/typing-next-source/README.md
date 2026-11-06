# Bookkeys TypeScript migration workspace

This is an isolated Next.js/React/TypeScript source project, separate from the active application at `tools/typing/`.

## Safety boundary

- Do not rewrite production Bookkeys until browser parity gates are complete.
- Do not change `tools/typing/index.html` or `tools/typing/bookkeys.html`.
- Preserve localStorage keys, `bookkeys-lib` IndexedDB v1, backup v1 and shared theme integration.
- Book files and artwork remain browser-local.
- Keep browser Back/Forward and native touch/trackpad navigation browser-owned.
- Future preview path: `/tools/typing-next-preview/`; not wired into production.

## Commands

- `npm install`
- `npm run typecheck`
- `npm run build`

Extract one subsystem at a time with parity tests against the existing application.
