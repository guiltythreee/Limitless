# Bookkeys TypeScript migration workspace

This is an isolated Next.js/React/TypeScript source project, separate from the active application at `tools/typing/`.

## Current migration checkpoint

- Mainline migration branch: `work/bookkeys-typescript-mainline-20261107`
- Current compatibility-validation branch: `work/bookkeys-ime-compatibility-20261107`
- Legacy migration and feature checkpoints are retained on named backup branches; do not delete them during consolidation.
- The original standalone reader remains at `tools/typing/bookkeys.html`; the production shell remains at `tools/typing/index.html`.
- The latest documented CI checkpoint passes 107 TypeScript unit tests, 14 Playwright browser regressions, TypeScript type-checking and the Next.js static production build.
- CI also reruns the current original 98-test preservation suite from `tools/typing/tests` against the untouched standalone Bookkeys implementation. The archived 91-test baseline and current 98/98 result are recorded in `tools/typing/BOOKKEYS_TEST_BASELINE.md`.
- The browser regressions cover PDF/EPUB/TXT import, pasted-text book creation, typing and draft persistence, reward persistence, backup export/import, browser history, reading-position recovery, theme/settings persistence, phone-width overflow, non-rewarding sample practice, legacy settings fallback, safe book removal, chapter editing, cross-tab global EXP refresh, reading-stat summaries, a populated IndexedDB v1 fixture and synthetic IME composition lifecycle.
- The TypeScript reader uses the shared LSR-1 Bookkeys reward adapter and evidence bridge. Its local policy mirror is checked against canonical `shared/rewards.mjs`; tests cover persisted awards, milestones, idempotency, invalid evidence and daily repeat caps. The Bookkeys header reads the shared Limitless LSR-1 total and excludes legacy module-specific XP.
- Existing Gothic and Garden artwork stored under `art:gothic` and `art:garden` is loaded from IndexedDB and selectable as a reader background. The original reader's full 34-field settings contract has been inventoried, but the React settings UI still exposes only a subset.

## Safety boundary

- This project is an isolated migration preview, not the production reader. It is not wired into the live `/tools/typing/` route.
- Do not rewrite production Bookkeys until the remaining parity and real-data acceptance gates are complete.
- Do not change `tools/typing/index.html` or `tools/typing/bookkeys.html` as part of this migration.
- Preserve localStorage keys, `bookkeys-lib` IndexedDB v1, backup v1 and shared theme integration.
- Book files and artwork remain browser-local; reward records store only verified page fingerprints and character counts, never book text.
- Keep browser Back/Forward and native touch/trackpad navigation browser-owned.
- A passing build or fixture-based test suite does not authorize production cutover.

## Commands

- `npm install`
- `npm test`
- `npm run typecheck`
- `npm run build`
- `npm run e2e`

Extract one subsystem at a time with parity tests against the existing application. PDF/EPUB rendering, local data continuity, real input hardware and reader interaction still require manual acceptance before production cutover.
