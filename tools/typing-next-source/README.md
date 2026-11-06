# Bookkeys TypeScript migration workspace

This is an isolated Next.js/React/TypeScript source project, separate from the active application at `tools/typing/`.

## Current migration checkpoint

- Mainline migration branch: `work/bookkeys-typescript-mainline-20261107`
- Legacy migration branch retained as a backup: `work/bookkeys-typescript-migration-20261107`
- The mainline branch is based directly on the latest `main` checkpoint and contains the migration workspace as an additive change.
- The original standalone reader remains at `tools/typing/bookkeys.html`; the production shell remains at `tools/typing/index.html`.
- The earlier migration checkpoint passed persistence tests, TypeScript type-checking and the static production build in GitHub Actions.

## Safety boundary

- Do not rewrite production Bookkeys until browser parity gates are complete.
- Do not change `tools/typing/index.html` or `tools/typing/bookkeys.html` as part of this migration.
- Preserve localStorage keys, `bookkeys-lib` IndexedDB v1, backup v1 and shared theme integration.
- Book files and artwork remain browser-local.
- Keep browser Back/Forward and native touch/trackpad navigation browser-owned.
- Future preview path: `/tools/typing-next-preview/`; not wired into production.

## Commands

- `npm install`
- `npm test`
- `npm run typecheck`
- `npm run build`

Extract one subsystem at a time with parity tests against the existing application. A successful build is necessary but not sufficient for production cutover; PDF/EPUB rendering, local data continuity and reader interaction still require browser regression checks.
