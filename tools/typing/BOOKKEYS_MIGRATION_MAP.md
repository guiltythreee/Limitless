# Bookkeys Node.js / TypeScript migration map

Date: 2026-11-02
Repository: `guiltythreee/Limitless`
Working branch: `work/bookkeys-node-migration-20261102`
Base: current `main` at branch creation
Preserved Bookkeys source blob: `310da8014c6c1ca9c80a75bce89b4ff1b2aa1e28`

## 1. Current safety status

- This branch was created from current `main`, not from the stale audit branch.
- The old `audit/bookkeys-preservation-migration-20261102` branch is 632 commits behind current main and 17 commits ahead; do not use it as the implementation base.
- The original `tools/typing/bookkeys.html` source blob on current main is still exactly `310da8014c6c1ca9c80a75bce89b4ff1b2aa1e28`.
- No Bookkeys application source, assets, storage keys, IndexedDB schema, active route, or Cloudflare deployment settings have been changed on this branch.
- Current production route remains `tools/typing/index.html` with a same-origin iframe loading `bookkeys.html`.
- Current main includes the site-wide `limitless.site.theme` session theme integration. The Bookkeys shell synchronizes the theme and shared background into the iframe. This integration must be preserved.

## 2. Regression baseline

A fresh run on the previous audit branch passed **91 tests, 0 failures, 0 skipped** using Node 20.9.0 and npm 10.1.0. The test source was the same preserved Bookkeys blob recorded above.

This is a historical baseline, not yet a fresh result on this branch. The current main branch already contains a Bookkeys regression workflow at `.github/workflows/test-bookkeys.yml`, configured for Node 22 and triggered by relevant pull requests and pushes to main. Run the current suite on this branch before any extraction and record its exact result.

The suite uses `tools/typing/tests/package.json` and `npm test` (`node --test`). It exercises actual Bookkeys source and includes import, EPUB, PDF, typing/XP, Required/Optional sections, persistence, backup merging, settings/theme, navigation and browser History API behaviour.

## 3. Hosting and architecture constraints

- Cloudflare project: `limitless`.
- Production branch: `main`.
- Production URL: https://limitless.beyondthelimits.workers.dev/
- Deployment type: Workers static assets.
- Deploy command observed in production: `npx wrangler deploy`.
- The production build scans and deploys static assets from the repository root.
- Do not add a guessed Wrangler config, Worker entrypoint, backend server, or change Cloudflare settings.

The repository already uses a static-export pattern for Next.js applications. A separate Next.js/React/TypeScript Bookkeys source project can be built with Node.js and exported into a nested static directory. A Node.js server is not required for production hosting. Keep the existing Bookkeys route active while the replacement is developed and verified in parallel.

## 4. Existing application boundary

- Active shell: `tools/typing/index.html`.
- Active reader: `tools/typing/bookkeys.html`, loaded through a same-origin iframe.
- The shell has a restrictive Content Security Policy and handles shared site theme/background synchronization.
- Bookkeys includes offline resources and locally bundled PDF.js, JSZip 3.10.1, epub.js 0.3.93, fonts and artwork.
- EPUB reading is performed from local file bytes; do not introduce CDN/runtime network dependencies.
- Browser Back/Forward is implemented through History API and `popstate`. Native touch/trackpad gestures must remain browser-owned; do not add custom swipe interception.

## 5. Persistence contract already identified

### localStorage keys and families

| Key | Purpose |
|---|---|
| `bookkeys:settings` | Settings object; all fields, defaults and merge rules must be preserved |
| `bookkeys:size` | Legacy reading-size fallback |
| `bookkeys:game` | XP, levels, ranks, achievements, streaks, rewards and per-book progress |
| `bookkeys:shelves` | User-created library shelves |
| `bookkeys:<book-key>` | Per-book reading position |
| `bookkeys:lib:<library-id>` | Saved library-book position |
| `bookkeys:chap:<book-key>` | Chapter segmentation and Required/Optional choices; schema marker v3 |
| `bookkeys:chap:lib:<library-id>` | Chapter record for a saved library book (`S.key = lib:<id>`) |
| `bookkeys:draft:<book-key>:<page-index>` | In-progress typing text, timing and accuracy; newest eight drafts per book retained |
| `bookkeys:bgdef1`, `bookkeys:bgdef2` | Background preferences; exact mapping still to be confirmed |

Backup export includes every localStorage key beginning `bookkeys:`, but not IndexedDB file blobs. Envelope: `{ app: "bookkeys", v: 1, exportedAt, keys }`. Import validates and merges; it does not simply replace all data. Preserve v1 backup compatibility and all existing merge semantics.

The shell theme is now site-wide and session-scoped under `limitless.site.theme`; do not restore the older independent Bookkeys theme key as the active theme source.

### IndexedDB

Database: `bookkeys-lib`, version 1.

- `meta`: object store with keyPath `id`, containing library-book metadata.
- `files`: object store keyed by library id, containing original local file blobs.
- `files` also stores custom theme artwork under `art:gothic` and `art:garden`.

Library add/delete updates metadata and blobs together. Book files and artwork must remain browser-local; never upload books or process them remotely.

## 6. Required inventory work before extraction

Completed:
1. All 34 settings fields, defaults and primitive types.
2. Settings UI control mapping, exact range constraints and full source catalogue counts/names: 34 themes, 27 backgrounds, 26 accent swatches, 10 typefaces, 22 text-color swatches and 7 cursor-color choices.
3. IndexedDB version-1 stores, key definitions, lack of indexes, library metadata fields, artwork keys and transaction boundaries.
4. localStorage record schemas for book positions, shelves, chapter segmentation, typing drafts and the game/progression object.
5. Current automated regression run: **98 passed, 0 failed, 0 skipped**, Node.js 22. Run 41462586271. The tested application/test tree is unchanged by subsequent documentation-only commits.

Recorded in `tools/typing/BOOKKEYS_PERSISTENCE_INVENTORY.md` and `tools/typing/BOOKKEYS_TEST_BASELINE.md`.

Still required:
1. Complete the detailed source call-site audit and add any missed legacy key/merge paths. The settings, chapter, draft, shelf, game and position record schemas are now documented.
2. Finish real-browser parity checks for EPUB/PDF import, IndexedDB add/open/delete and reload persistence, backup/restore, offline assets, CSP, browser Back/Forward and custom artwork.
3. Resolve the Bookkeys route's theme-control distinction: the visible in-app Morning/Evening/Night button changes scene backgrounds, while the outer shell's site-wide theme navbar is hidden. The live baseline documents this; preserve both behaviours and provide an unambiguous shared theme control in the eventual cutover.
4. Only after those checks, design and start the isolated Next.js/React/TypeScript extraction on a parallel static route.

Do not start component extraction until the remaining inventory and live-browser baseline are complete.

## 7. Migration sequence

1. Complete the persistence and settings inventories.
2. Establish current automated and real-browser baselines.
3. Create a separate Next.js/React/TypeScript source project using Node.js tooling.
4. Export it to a temporary nested static route; leave `tools/typing/` active and unchanged.
5. Extract one subsystem at a time, preserving the existing contracts and adding parity tests.
6. Run the full regression suite after each checkpoint. Commit/backup each passing checkpoint before proceeding.
7. Verify the parallel route on Cloudflare preview.
8. Only after complete feature parity, prepare a separately reviewed cutover and tested rollback.

## 8. Non-negotiable preservation rules

- No rebuild-from-scratch and no unnecessary rewrites of working logic.
- No deleting original resources before verified replacements exist.
- No storage-key renames, IndexedDB schema/version changes, or backup-format changes without a tested lossless compatibility plan.
- No remote book uploads, CDN dependencies, or loss of offline reading.
- No production Cloudflare configuration changes during migration.
- No active-route cutover before full parity.
- Preserve current shared theme integration and native browser navigation.
