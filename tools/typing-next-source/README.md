# Bookkeys TypeScript migration workspace

This is an isolated Next.js/React/TypeScript source project, separate from the active application at `tools/typing/`.

## Current migration checkpoint

- Mainline migration branch: `work/bookkeys-typescript-mainline-20261107`
- Legacy migration branch retained as a backup: `work/bookkeys-typescript-migration-20261107`
- The mainline branch is based directly on the latest `main` checkpoint and contains the migration workspace as an additive change.
- The original standalone reader remains at `tools/typing/bookkeys.html`; the production shell remains at `tools/typing/index.html`.
- The current CI checkpoint passes 78 unit tests, 4 Playwright browser regressions, TypeScript type-checking and the Next.js static production build.
- The TypeScript reader now uses the shared LSR-1 Bookkeys reward adapter and evidence bridge. Its local policy mirror is checked against the canonical `shared/rewards.mjs` implementation by parity tests. Adapter tests cover persisted awards, idempotency, invalid evidence and daily repeat caps. Browser regressions exercise PDF/EPUB import, typing progress across reloads, reward persistence, backup export, browser Back/Forward, theme switching, reader settings and phone-width overflow.

## Safety boundary

- Do not rewrite production Bookkeys until browser parity gates are complete.
- Do not change `tools/typing/index.html` or `tools/typing/bookkeys.html` as part of this migration.
- Preserve localStorage keys, `bookkeys-lib` IndexedDB v1, backup v1 and shared theme integration.
- Book files and artwork remain browser-local; reward records store only verified page fingerprints and character counts, never book text.
- Keep browser Back/Forward and native touch/trackpad navigation browser-owned.
- Future preview path: `/tools/typing-next-preview/`; not wired into production.

## Commands

- `npm install`
- `npm test`
- `npm run typecheck`
- `npm run build`

Extract one subsystem at a time with parity tests against the existing application. A successful build is necessary but not sufficient for production cutover; PDF/EPUB rendering, local data continuity and reader interaction still require browser regression checks.
