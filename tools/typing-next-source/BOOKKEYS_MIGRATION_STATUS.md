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

On 15 November 2026, the current `main` head is `4de0591c2a9c2f1aaed18f4eda5fd0f06a474ab3` and the migration branch head is `15f21a78f254995e040339419993b009ec648e5f`. GitHub compares the migration branch as 167 commits ahead and 28 behind current `main`. The PR diff remains 67 added files, all isolated Bookkeys preview/migration files plus `.github/workflows/bookkeys-next-scaffold.yml`; no existing Limitless application files are modified by this PR. The comparison is additions-only relative to the shared base. Keep the PR draft; do not merge or deploy until manual data/device acceptance is complete.

The 28 commits now on `main` since the PR's shared base include ongoing Limitless work across Codeforces/competition, Math Trainer, Metallurgy, Probability/studies, site navigation and favicon assets. The migration branch does not contain those commits. Its 67-file diff remains limited to the isolated Bookkeys migration and preview. No production reader files are part of the PR diff.

## Verified in CI

The latest migration workflow runs are [43649888531](https://github.com/guiltythreee/Limitless/actions/runs/43649888531) and [43649892709](https://github.com/guiltythreee/Limitless/actions/runs/43649892709). Both completed successfully on code commit `15f21a78f254995e040339419993b009ec648e5f`. The separate legacy regression workflow [43649892724](https://github.com/guiltythreee/Limitless/actions/runs/43649892724) also completed successfully on the same commit.

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
