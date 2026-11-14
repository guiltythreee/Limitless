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
- PR #166 starts directly from current `main` at `f37f99f` and selectively imports the Bookkeys migration files; it does not merge the stale histories of PR #111 or PR #144.
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

## Verified in CI

The latest successful current-main workflow run [43616767485](https://github.com/guiltythreee/Limitless/actions/runs/43616767485) includes:

- 107 TypeScript tests covering IndexedDB v1 compatibility, PDF/EPUB parsing, chapters, reading sessions, key-event accuracy, archive counters/achievements, backup rollback safety, shelves and reward logic.
- The current 98-test legacy suite in tools/typing/tests is also rerun in CI against the preserved standalone HTML implementation. The archived 91-test baseline and current 98/98 result are recorded in tools/typing/BOOKKEYS_TEST_BASELINE.md.
- TypeScript type-check.
- Next.js static production build.
- 18 Playwright browser regressions:
  1. Import an EPUB, type a page, persist progress and reward records, reload, reopen, export a backup, import it into a fresh browser context and restore settings.
  2. Import a PDF, extract readable text and complete a page.
  3. Switch themes and change reader settings, then verify persistence after reload.
  4. Use the reader at a 390 px phone viewport and verify no horizontal overflow.
  5. Navigate to a second section, reload, use Continue reading and restore both the saved position and unfinished typing draft.
  6. Type the sample passage and verify that no XP, reward ledger or book progress is written.
  7. Load the legacy bookkeys:size setting when the newer settings object has no size.
  8. Remove a local book file and library entry while retaining completed typing progress.
  9. Add/remove chapter headings, persist both legacy chapter keys and restore edits after reload.
  10. Verify the shared Limitless EXP display aggregates Probability, Metallurgy and Bookkeys ledgers, updates when another tab awards EXP, and excludes legacy `bookkeys:game.xp`.
  11. Open a pre-populated `bookkeys-lib` IndexedDB v1 library with existing metadata and a local EPUB blob, then confirm the schema remains v1 and restore a saved Gothic artwork background from the existing `files` store.
  12. Paste plain text, create a local TXT-backed book, type a page, reload and restore its draft/progress.
  13. Open the Akashic Archive and verify existing achievement timestamps and saved records remain unchanged.
  14. Simulate IME composition start, intermediate composing input, composition end and a possible final input event; verify the committed character is counted once, saved in the draft, and does not prematurely write page progress.
  15. Verify the original 22 procedural canvas scenes, the visual background tile catalogue, and the three photo backgrounds with both desktop and portrait crops.
  16. Verify Time of Day switching, reduced-motion behaviour, photo text-backdrop minimum, and background control persistence.
  17. Verify the legacy `bgdef1`/`bgdef2` migrations run once, preserve the expected photo/veil defaults and do not replay over later user choices.
  18. Verify the custom artwork remains applied to the reader text surface after reload.

PDF, EPUB and plain-text/TXT imports are supported, including a paste-text workflow that stores text as a local TXT-backed book. Existing Gothic and Garden artwork data is read from the original IndexedDB keys; uploaded images are validated, resized to at most 1600 × 900 and stored in those same keys. The original 22 procedural canvas scene definitions are restored, along with the 27-entry original background tile catalogue, three photographic scenes with desktop/portrait crops, Time of Day mode, density/animation controls, backdrop/veil/blur controls and the exact one-time `bgdef1`/`bgdef2` migrations. Photo backgrounds retain a minimum 70% reader text backdrop. The original 34 settings fields and defaults remain lossless, including unknown extension fields. The current settings navigation is still a reduced Appearance/Data interface; the original six tabs (Theme, Background, Font, Typing, Cursor and Data), background-matched palettes, full typography controls, typing effects/sound and cursor controls remain to be restored. The library also displays persisted Bookkeys page, chapter, book, word and character counters. The Akashic Archive now updates core counters only after eligible typing: words, characters, pages, daily and consecutive-day streaks, session bests, WPM/accuracy records, perfect pages, consecutive accuracy runs, flawless chapters and 100-page-book milestones. New achievement timestamps are written only when a user crosses a threshold; existing records are preserved and old thresholds are not backfilled. Typing accuracy now tracks key events rather than only the final text: inserted characters count, deletions do not, and retyped characters count again. Drafts retain those counters, and multi-character paste/drop input is blocked. Synthetic IME composition lifecycle is now covered by a passing browser regression. Real Japanese/Chinese/Indic IMEs, composition candidate selection, mobile keyboards and hardware-specific keyboard acceptance remain open. A populated IndexedDB v1 fixture is now opened in-browser without a version upgrade; actual user libraries still require a backup-first manual acceptance run. The Bookkeys header displays global Limitless EXP from the canonical LSR-1 source registry, including awards from other disciplines and updates from other tabs. Legacy `bookkeys:game.xp` is retained for data compatibility but is never counted as global EXP. The shared LSR-1 reward policy is mirrored inside this isolated Next.js project because the Next build boundary cannot import files outside the project root. A parity test compares its award calculations and ledger sanitization with the canonical shared/rewards.mjs implementation.

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

- Restore the original six-tab settings navigation and implement the exact Theme/accent/background palette matching, Font, Typing and Cursor controls; do not expose controls that do not work.
- Verify real Japanese/Chinese/Indic IMEs, composition candidate selection, mobile keyboards and hardware-specific keyboard behaviour against the legacy reader; synthetic composition lifecycle automation now passes.
- Complete a side-by-side inventory of every legacy Bookkeys screen, action, setting and keyboard interaction; port anything not represented in the new reader.
- Test representative real-world PDFs and EPUBs, including long books, unusual chapter structures, malformed files and scanned/image-only PDFs.
- Verify opening representative real user IndexedDB libraries and existing backup files without data loss.
- Test on real mobile browsers, not only a desktop Chromium viewport.
- Complete manual acceptance in the isolated preview before considering production cutover.

A successful build and the automated tests are necessary, but do not by themselves authorize replacing the standalone production reader.
