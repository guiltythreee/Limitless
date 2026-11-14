# Bookkeys TypeScript migration workspace

This is an isolated Next.js/React/TypeScript source project, separate from the active application at `tools/typing/`.

## Current migration checkpoint

- Active current-main reconciliation branch: `work/bookkeys-current-main-reconciliation-20261114`, tracked by draft PR [#166](https://github.com/guiltythreee/Limitless/pull/166).
- Latest PR head: `24ed311b2ec1f9d8346eea4bfe48c436b63a6dbf`; latest code fix preserves the legacy game-record shape during backup merge when no local record exists.
- Latest GitHub Actions validation on that head: migration workflow passed (legacy preservation, persistence, type-check, static build and Chromium browser regressions); separate Bookkeys regression workflow passed.
- The PR validation history includes **99/99 legacy preservation tests** and **26/26 Chromium browser tests**. The current run confirms the two workflows succeeded on the latest head.
- PR #166 currently contains 67 added files and is 173 commits ahead / 31 behind current `main`. The diff is isolated to Bookkeys migration/preview files and migration-specific workflow/docs; production application files are not modified.
- The original standalone reader remains at `tools/typing/bookkeys.html`; the production shell remains at `tools/typing/index.html`.
- The preview remains isolated at `/tools/typing-next-preview/`. No production cutover or deployment has been performed.
- External Vercel status is failing due to a build-rate-limit response; the GitHub migration and regression workflows themselves passed.

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


## Automated continuation checkpoint — 15 November 2026

- Latest commit: `a90e8e4c611343abc0cd450d4ea2c5ae88a06008`.
- Both Bookkeys GitHub Actions workflows passed on this exact commit: regression run [43655018469](https://github.com/guiltythreee/Limitless/actions/runs/43655018469) and TypeScript migration run [43655018457](https://github.com/guiltythreee/Limitless/actions/runs/43655018457).
- The migration workflow passed persistence tests, type-check, static export build and Chromium browser regressions.
- Added a populated legacy IndexedDB v1 fixture covering metadata extension fields, original file bytes and artwork retention.
- Current `main` head is `7b73fed7e3aef13a20e34bac8c83443906c9f3ef`. The branch is 181 commits ahead / 49 behind; path comparison found no overlap between the 67 Bookkeys PR files and the 105 paths changed on `main` since the PR base.
- Vercel's separate status remains a build-rate-limit failure; GitHub Actions are green.
- The user prefers not to perform a separate manual test pass and will report defects encountered during ordinary use. Continue automated verification. This is not authorization to deploy or cut over the production reader.

