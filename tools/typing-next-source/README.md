# Bookkeys TypeScript migration workspace

This is an isolated Next.js/React/TypeScript source project. It is deliberately separate from the active application at `tools/typing/`.

## Safety boundary

- Do not import, move, or rewrite production Bookkeys logic until the remaining browser parity gates are complete.
- Do not change the active `tools/typing/index.html` or `tools/typing/bookkeys.html` route.
- Do not change localStorage keys, the `bookkeys-lib` IndexedDB v1 schema, backup v1 format, or shared theme integration.
- Book files and artwork must remain local to the user's browser.
- Keep native browser Back/Forward and touch/trackpad navigation browser-owned.
- The static export is intended for a future parallel preview at `/tools/typing-next-preview/`; it is not wired into production.

## Commands

- `npm install`
- `npm run typecheck`
- `npm run build`

The first scaffold intentionally contains no Bookkeys reader, persistence, import, typing, reward, or settings implementation.
