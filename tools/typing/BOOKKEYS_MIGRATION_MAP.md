# Bookkeys preservation-first migration map

> Historical preservation audit from 2026-11-02. The original standalone implementation and its storage/hosting contract remain the reference baseline. For the current TypeScript workspace and acceptance status, see `tools/typing-next-source/BOOKKEYS_MIGRATION_STATUS.md`.

Date: 2026-11-02  
Repository: `guiltythreee/Limitless`  
Branch: `audit/bookkeys-preservation-migration-20261102`  
Previous checkpoint: `298e6d0331161c01b217cba0597133a0ce146e3c`  
Preserved source blob: `310da8014c6c1ca9c80a75bce89b4ff1b2aa1e28`  
Original `bookkeys.html` size: 5,472,293 bytes

## 1. Current safety status

- The original Bookkeys application is still active and unchanged.
- No production code, images, fonts, routes, storage keys, IndexedDB records, CSP, or Cloudflare settings have been modified.
- This migration branch is not the production branch; Cloudflare production deploys `main`.
- Compared with checkpoint `298e6d0`, this branch is five commits ahead. The only changed paths are:
  - `.github/workflows/test-bookkeys.yml` (added)
  - `tools/typing/BOOKKEYS_TEST_BASELINE.md` (added)
  - `tools/typing/BOOKKEYS_MIGRATION_MAP.md` (updated)
- No Bookkeys application source or asset files have changed.

## 2. Fresh automated baseline — passed

A dedicated GitHub Actions workflow now runs the existing suite on this migration branch and on pull requests touching Bookkeys.

Latest run on the current branch head:

- [Run 41460871991](https://github.com/guiltythreee/Limitless/actions/runs/41460871991) — **success**
- Node.js 20.9.0; npm 10.1.0
- Commands: `npm ci`, then `npm test` in `tools/typing/tests`
- Result: **91 passed, 0 failed, 0 skipped**
- Test execution: 8,875.876 ms

The initial fresh run is recorded in [`BOOKKEYS_TEST_BASELINE.md`](BOOKKEYS_TEST_BASELINE.md). The tests read the original `bookkeys.html` directly; the app has not been rewritten or substituted with a test mock.

Coverage includes PDF/EPUB parsing and import flows, typing and XP, duplicate completion, required/optional sections, persistence, backup merging, settings/theme controls, chapter navigation, and browser History API behaviour.

## 3. Actual production hosting and deployment path — confirmed

Read-only inspection of the Cloudflare account confirmed:

| Setting | Observed value |
|---|---|
| Cloudflare project | `limitless` |
| Repository | `guiltythreee/Limitless` |
| Production branch | `main` |
| Production URL | https://limitless.beyondthelimits.workers.dev/ |
| Deployment type | Workers static assets |
| Root directory | `/` |
| Build command | None |
| Deploy command | `npx wrangler deploy` |
| Explicit output directory | None |
| Build cache | Enabled |

The individual production build log was inspected:

- Build: `5681729f-b81f-4366-8ed5-81d62ad9692c`
- Commit: `b4681dc80d2f1a2a617a722ed7f0cf0b1d00dc3e`
- Wrangler: `4.156.1`
- Working directory: repository root
- Assets scanned: 718
- Changed assets uploaded: 13
- Result: successful

Relevant log lines:

```text
Executing user deploy command: npx wrangler deploy
wrangler 4.156.1
Building list of assets...
Read 718 files from the assets directory /opt/buildhome/repo
Starting asset upload...
Found 13 new or modified static assets to upload.
```

The checked-in repository tree has no Wrangler config, Worker entrypoint, or root `package.json`. Nevertheless, the observed production build successfully deployed static assets from the repository root. Do not add a guessed Wrangler config or change Cloudflare settings.

### Existing Next.js static-export pattern

- `probability-source`: Next.js static export, production `basePath: "/probability"`; GitHub Actions builds `out/` and syncs it into `probability/`.
- `metallurgy-source`: Next.js static export, production `basePath: "/metallurgy"`; its README documents copying `out/` into `metallurgy/`.
- Cloudflare then deploys the repository root as static assets.

**Architecture implication:** Bookkeys can be developed as a separate Next.js/React/TypeScript project, built with Node.js, and statically exported into a nested repository directory. Cloudflare can serve that directory through its existing root-asset deployment. A Node.js server or new Worker backend is not required for this migration.

## 4. Current Bookkeys route and security boundary

- Active route: `tools/typing/index.html`.
- The shell embeds `tools/typing/bookkeys.html` in a same-origin iframe.
- The shell's CSP currently allows same-origin frames/scripts/styles, data images/fonts, and blob workers; it denies other sources by default.
- The shell stores its theme separately under `limitless.typing.v1.theme`.
- The app includes offline resources, including embedded PDF.js, JSZip 3.10.1, epub.js 0.3.93, fonts and artwork.
- EPUB parsing works from local bytes; the verification report documents no CDN or runtime fetch dependency for EPUB reading.
- Browser Back/Forward uses History API and `popstate`. The NAV tests explicitly require native browser-owned touch/trackpad gestures; do not add custom swipe interception.

Any parallel app must be tested against the existing same-origin, CSP, worker, offline and navigation constraints before the active route is changed.

## 5. Persistence contract to preserve

### localStorage

The original app uses `load(key)` / `store(key, value)` wrappers. Confirmed keys and families:

| Key | Purpose |
|---|---|
| `bookkeys:settings` | User settings object; preserve every field, default and merge rule |
| `bookkeys:size` | Legacy reading-size fallback |
| `bookkeys:game` | XP, levels, ranks, achievements, streaks, reward IDs and per-book progress |
| `bookkeys:shelves` | User-created library shelves |
| `bookkeys:<book-key>` | Per-book current position |
| `bookkeys:lib:<library-id>` | Saved library-book position |
| `bookkeys:chap:<book-key>` | Chapter segmentation and Required/Optional choices; schema marker currently v3 |
| `bookkeys:chap:lib:<library-id>` | Legacy/library chapter lookup path |
| `bookkeys:draft:<book-key>:<page-index>` | In-progress typing text, timing and accuracy state; newest eight drafts per book retained |
| `bookkeys:bgdef1`, `bookkeys:bgdef2` | Background preferences/defaults; exact UI mapping still needs confirmation |

The backup export includes all localStorage keys beginning `bookkeys:`, but does not include IndexedDB library blobs. Its JSON envelope is `{ app: "bookkeys", v: 1, exportedAt, keys }`. Import validates and merges rather than replacing. Existing game, settings, shelf and chapter merge semantics must remain lossless.

**Open inventory item:** the exact individual fields and defaults inside `bookkeys:settings` still need to be extracted and documented before migration.

### IndexedDB

Database: `bookkeys-lib`, version 1.

- `meta`: object store with keyPath `id`, containing library-book metadata.
- `files`: object store keyed by library id, containing original local file blobs.
- Custom theme artwork is also stored in `files` under `art:gothic` and `art:garden`.

Adding/deleting library items updates metadata and file blobs together. Library rendering reads metadata; opening a saved item retrieves the original local file. These records remain browser-local; no book upload or remote processing is permitted.

**Open inventory item:** exact metadata fields, indexes, transaction boundaries and upgrade behaviour still need a source-level inventory.

## 6. UI and feature inventory anchors

The original document contains 117 element IDs. Main feature groups include:

- Home/library: `home`, `homeContinue`, `homeSample`, `shelfBooks`, `openLibrary`, shelf create/rename/delete.
- Import: `openLoader`, `pdfInput`, `libInput`, `ldPaste`, `ldSample`, status and cancel controls.
- Reading/typing: `bookText`, `sink`, previous/next, page counters, typing metrics, plain-flow and size controls.
- Chapters: `chapBtn`, `chapters`, `chList`, `chAllReq`, `chAllOpt`, `chDefaults`, `chEven`, `chRedo`, `chAdd`, save/cancel.
- Progress/rewards: HUD, Hall of Fame and achievement controls.
- Settings: settings panel, controls, save/discard confirmation and reset controls.
- Data safety: backup export/import and save-failure warning/retry.
- Visual preferences: themes, background settings, offline fonts/images and custom artwork.

The app also handles keyboard composition, paste/drop, page lifecycle saves, resize/orientation, online/offline events, dialogs and browser history.

## 7. Known verification gaps

The 91-test suite is a strong automated compatibility guard, but it does not prove every real-browser behaviour.

The existing verification report explicitly leaves these items for real-browser/manual verification:

- IndexedDB library add/open/delete, original file blobs and custom artwork (not available in jsdom).
- Real EPUB variety and DRM-protected/exotic files.
- PDF visual rendering.
- Live iframe shell behaviour and top-level navigation under the CSP.
- Actual touch/trackpad behaviour on hardware.
- Offline use and worker loading in the production browser environment.

These are mandatory parity checks, not optional cleanup.

## 8. Migration strategy

1. Finish the exact settings and IndexedDB schema inventory.
2. Run a read-only real-browser baseline against the current production Bookkeys route, including EPUB/PDF import, IndexedDB library, reload/resume, backup/restore, offline resources, CSP and browser Back/Forward.
3. Design a separate Next.js/React/TypeScript source project using Node.js for build tooling.
4. Export to a temporary nested route, leaving `tools/typing/` untouched and active.
5. Extract one subsystem at a time. Re-run all 91 tests and add parity tests for any newly covered storage/browser behaviour.
6. Test the parallel route on a Cloudflare preview deployment.
7. Only after full parity, prepare a separately reviewed cutover. Retain a recoverable original implementation and a tested rollback path.

### Non-negotiable preservation rules

- No rebuilding from scratch and no unnecessary rewrites of working logic.
- No deleting original resources before verified replacements exist.
- No storage-key renames, IndexedDB schema/version changes or backup-format changes without a tested compatibility/migration plan.
- No remote book uploads, CDN dependencies or loss of offline reading.
- No changes to production Cloudflare settings during this migration.
- No active-route cutover until the parallel app passes feature parity.
- Commit and verify each passing checkpoint before adding the next change.


## 9. TypeScript migration continuation — 2026-11-07

The current isolated implementation lives on `work/bookkeys-typescript-mainline-20261107` in `tools/typing-next-source/`. The original production reader and route remain unchanged. Current migration CI runs the 98-test legacy suite, 87 TypeScript unit tests, TypeScript type-check, static build, and seven Playwright browser regressions. The latest fully successful combined run is [42304561361](https://github.com/guiltythreee/Limitless/actions/runs/42302665616). The migration remains a preview-only implementation; the remaining acceptance gates are recorded in `tools/typing-next-source/BOOKKEYS_MIGRATION_STATUS.md`.
