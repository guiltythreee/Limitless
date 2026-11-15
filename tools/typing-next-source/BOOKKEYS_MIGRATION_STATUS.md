# Bookkeys migration status

## Repository audit: migration tracks

Two Bookkeys migration tracks exist and must remain distinguishable:

- **PR #111 — preservation-first extraction scaffold:** based on current `main`; extracts original text/chapter/XP logic, EPUB helpers, IndexedDB v1 adapter and localStorage/backup helpers into modules. It is an additive, isolated scaffold with 23 focused tests and the original 98-test suite. It explicitly leaves PDF/EPUB orchestration, library UI, typing/drafts, chapter editor, settings/theme rendering, backup envelope and full reward merge on the production implementation.
- **PR #144 — advanced TypeScript/React preview:** based on `work/bookkeys-typescript-mainline-20261107`; includes the fuller reader implementation and the later IME compatibility regression. Its latest documented checkpoint is 107 TypeScript tests, 14 Playwright browser regressions, type-check and static build, plus the 98-test legacy preservation suite. This is the more advanced preview track, but it is still isolated and not a production cutover.
- The numerous `backup/bookkeys-*` branches preserve subsystem checkpoints (backup/restore, rewards, data safety, empty-page history, EPUB/PDF importers, IME, legacy settings, local reader preview, main-shelf safety, PDF chapter parity and PDF runtime). Do not delete or force-update these while reconciling branches.
- PR #111 and PR #144 are both unmerged. PR #144 is the current feature-validation track; PR #111 remains a separate extraction baseline. Do not merge both blindly or assume the scaffold is equivalent to the preview.

## Current state

The TypeScript/React reader is an isolated migration implementation. It is not the production reader and is not wired into the live /tools/typing/ route.

- Active current-main reconciliation branch: `work/bookkeys-current-main-reconciliation-20261114` (draft PR #166).
- PR #166 was created against `main` at the earlier base checkpoint `cba5655aa60ddac0dc64273079566f7ff1205b75` and selectively imports the Bookkeys migration files; it does not merge the stale histories of PR #111 or PR #144. Current `main` has since advanced, so the PR must be evaluated against the latest base before integration.
- PR #144's advanced migration and IME work, PR #111's preservation-first extraction scaffold, and all `backup/bookkeys-*` recovery branches remain intact.
- The current preview is isolated at `/tools/typing-next-preview/`.
- Production `tools/typing/index.html` and `tools/typing/bookkeys.html` are unchanged.

## Reconciliation warning against current main

A fresh GitHub compare on 14 November 2026 shows substantial divergence from the repository's current `main`:

| Branch | Commits ahead of current main | Commits behind current main |
|---|---:|---:|
| `work/bookkeys-typescript-mainline-20261107` | 224 | 224 |
| `work/bookkeys-ime-compatibility-20261107` | 245 | 224 |
| `work/bookkeys-migration-rebased-20261107` | 35 | 224 |

These branches were built from an earlier repository checkpoint. The earlier note that the migration was reconciled with the deployment workflow does **not** mean it is current with today's `main`. Do not merge PR #111 or PR #144 directly. First preserve the existing branch heads, identify the exact Bookkeys-only commits and file changes, then replay/reconcile those changes onto a fresh branch from current `main`. Resolve conflicts without reverting unrelated Limitless changes, rerun all Bookkeys and repository checks, and keep the preview isolated until manual acceptance. The named `backup/bookkeys-*` branches are recovery points and must remain untouched during this process.

## Latest branch comparison

Live GitHub verification on 15 November 2026:

- Current `main` head: `4de0591c2a9c2f1aaed18f4eda5fd0f06a474ab3`.
- PR #166 head: `24ed311b2ec1f9d8346eea4bfe48c436b63a6dbf`.
- The branch is **173 commits ahead and 31 behind** current `main`.
- The PR diff contains **67 added files**, limited to the isolated Bookkeys preview/migration workspace, its migration-specific workflow, and migration documentation. No existing Limitless application files are modified by the PR.
- The original production reader files `tools/typing/index.html` and `tools/typing/bookkeys.html` remain outside the PR diff.
- The PR remains a draft. Its divergence from `main` is not permission to merge or deploy; review the isolated file diff and complete the real-data/device acceptance gates first.

## Verified in CI

The latest migration workflow run [43651080579](https://github.com/guiltythreee/Limitless/actions/runs/43651080579) and Bookkeys regression run [43651080585](https://github.com/guiltythreee/Limitless/actions/runs/43651080585) both completed successfully on PR head `24ed311b2ec1f9d8346eea4bfe48c436b63a6dbf` (15 November 2026). The migration workflow completed legacy preservation tests, dependency installation, persistence tests, type-check, static export build, Chromium installation and browser regressions. The separate regression workflow also passed.

- **99/99 legacy preservation tests passed** against the original standalone HTML implementation.
- The TypeScript persistence test suite passed.
- TypeScript type-check passed.
- Next.js static production build passed.
- Chromium browser regression suite: **26/26 passed** in both migration runs. This includes the regression proving that a backup without valid Bookkeys appearance choices does not clear the site-wide theme override.
- Both workflow runs completed all verification steps successfully; no failed or skipped verification steps were reported.

The browser suite covers EPUB/PDF/TXT import, progress and draft persistence, backup round-trip, legacy IndexedDB v1 opening without schema upgrade, settings/theme/background/font parity, achievement preservation, IME composition lifecycle, mobile-width layout, and the latest theme-override regression. Synthetic IME coverage is not a substitute for real Japanese/Chinese/Indic IMEs or physical-device testing.

The latest source hardening also includes finite timestamp and completion-counter validation, sanitization of page-history arrays during backup restore/merge, rollback of partially applied backup replacement (including cleanup under storage quota pressure), and conditional clearing of the site-wide theme override only when a valid Bookkeys appearance choice is imported.


## Safety and data compatibility

- The original Bookkeys HTML reader remains untouched.
- The default Library shelf retains the legacy ID `main`; existing books assigned to that shelf remain visible, and it cannot be deleted.
- The migration opens the existing bookkeys-lib IndexedDB v1 database and keeps its existing store names and version.
- Existing Bookkeys localStorage keys, per-book/library reading-position keys, both chapter-record lookup paths, the legacy bookkeys:size fallback and backup v1 formats are retained. The sample passage is typable but excluded from XP, rewards and saved book progress.
- Original PDF/EPUB files and artwork remain browser-local; the reward ledger stores only page fingerprints and character counts, not book text.
- The TypeScript preview does not sync original book files to the cloud.
- Removing a book deletes its local library file/metadata but intentionally retains the progress ledger and backup data.
- No production cutover or live deployment has been performed.

## Remaining acceptance gates

The following are genuinely outstanding; implemented features and passing fixture-based checks are not repeated here:

- Validate backup import against representative copies of actual legacy user backups, including multiple books, divergent progress, custom chapter selections, draft timestamps, settings extensions and older v1 envelopes. Do this with copies only; never experiment on the user's only live database.
- Open representative real user IndexedDB v1 libraries in a separate browser profile after exporting a backup. Confirm metadata, original file blobs, artwork and saved progress. Automated coverage currently uses a populated synthetic v1 fixture.
- Test representative real-world PDFs and EPUBs: long books, unusual chapter structures, malformed archives and scanned/image-only PDFs.
- Complete visual and audio side-by-side acceptance for all settings, including narrow-screen shelf tabs. Do not rebuild the original catalogues or tabs.
- Verify real Japanese/Chinese/Indic IMEs, composition candidate selection, mobile keyboards and hardware-specific keyboard behaviour. Synthetic IME lifecycle coverage passes, but it is not a substitute for real input methods.
- Test on real Android/iOS browsers, including orientation changes and touch/trackpad navigation. The 390 px Chromium viewport test is only a desktop-browser emulation.
- Complete manual acceptance in the isolated preview before considering any production cutover.

**Production boundary:** the standalone production reader remains untouched. The preview is not wired into the live `/tools/typing/` route. No production deployment or data migration has been performed. Automated green checks do not authorize cutover.


## Automated continuation checkpoint — 15 November 2026

- Latest branch commit: `a90e8e4c611343abc0cd450d4ea2c5ae88a06008`.
- Both workflows passed on this exact head:
  - Bookkeys Regression Tests: [43655018469](https://github.com/guiltythreee/Limitless/actions/runs/43655018469).
  - Bookkeys TypeScript Migration: [43655018457](https://github.com/guiltythreee/Limitless/actions/runs/43655018457).
- The migration workflow completed legacy preservation tests, persistence tests, TypeScript type-check, static export build and Chromium browser regressions.
- Added a populated-v1 IndexedDB regression fixture: seeds an existing `bookkeys-lib` v1 database with legacy metadata extensions, original file bytes and artwork, then verifies the adapter opens and adds another book without upgrading or losing existing records.
- Current `main` head: `7b73fed7e3aef13a20e34bac8c83443906c9f3ef`.
- The branch is 181 commits ahead / 49 behind current `main`. A path-level comparison of the 67 Bookkeys PR files against the 105 files changed on `main` since the PR base found **zero overlapping paths**. The PR remains additive and isolated; do not merge solely on that basis.
- Vercel still reports a build-rate-limit failure. It is separate from the two passing GitHub Actions workflows.

The user does not plan a separate manual acceptance/testing pass and will report issues encountered during ordinary use. Continue using automated regression, type-check, build and browser checks as the primary verification. This does not convert synthetic fixtures into proof of compatibility with every real-world file, device or input method, and does not authorize production cutover or deployment.

## User-directed acceptance scope update — 15 November 2026

The user has confirmed that there is no existing Bookkeys database/library data to migrate or preserve. Therefore:

- Do not treat inspection or migration of a real pre-existing user IndexedDB database as a release blocker.
- Do not require importing real-user backup files or running a one-off database migration. There is no source dataset for that work.
- Keep the existing IndexedDB v1/localStorage compatibility code and automated fixtures where they support the reader's normal local-first operation; this is not a request to remove storage safeguards or change the storage contract.
- Continue validating fresh-library creation, local file import, progress persistence, backup/restore, and automated regression behavior.
- Real-device/IME edge cases can be handled through automated coverage where feasible and issues reported during ordinary use; do not claim they have been physically verified.

Visual acceptance remains a separate requirement. The current preview must be checked against the live /tools/typing/ reader, not inferred from a passing build or source inventory. In particular compare the actual library landing view, artwork/background layers, reader typography and overlays, settings tab layout and appearance controls at desktop and narrow widths. Preserve the original visual result; do not simplify the UI to fit the migration.

Latest verified CI head at this checkpoint: 4185987df09f0cb2dd74060ac75dbe07fb3daadd. Bookkeys TypeScript Migration and Bookkeys Regression Tests both completed successfully (15 November 2026). The migration run includes the legacy preservation suite, persistence tests, type-check, static export and Chromium browser regressions. This verifies code/build behavior, not live visual equivalence.

## PR scope audit correction — 15 November 2026

A fresh PR inventory audit found that PR #166 currently reports 259 changed files. The list includes unrelated Competition, Metallurgy, Probability, shared study infrastructure and generated static output in addition to the 67 Bookkeys migration files. The earlier statement that the PR contains only isolated Bookkeys files is not accurate for the current PR file inventory.

The current main-to-branch compare and the PR changed-file inventory report different scopes. Treat this discrepancy as unresolved. Do not merge PR #166 or use its mergeable flag as approval. First construct/review a clean integration change containing only the intended Bookkeys files, then run the full relevant CI and verify its preview. Preserve all unrelated work and recovery branches.

At this checkpoint, main-to-branch compare reports 204 commits ahead and 22 behind. The PR's recorded base SHA is older than current main. This is another reason to reconcile against the current main head before integration.

The latest Cloudflare preview deployment comment points to commit 4185987df09f0cb2dd74060ac75dbe07fb3daadd and reports Build: Success and Deployment: Success. The documentation-only commit 27f67ef478f1a942234f21fafd871fa11d7cbfd8 does not itself change the preview application. A direct live visual comparison has not yet been completed; passing CI and deployment status are not visual proof.

## Isolated preview deployment

The clean integration branch `work/bookkeys-clean-main-integration-20261115` is included in the dedicated Bookkeys preview workflow trigger. Its preview must be validated at the Bookkeys route `/tools/typing-next-preview/`; the repository-wide Cloudflare branch preview is not a substitute for this dedicated reader preview. Production remains unchanged until explicit release approval.
