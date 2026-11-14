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

On 15 November 2026, current `main` is `fd32ab485da9977efbb7046b37b752701af214f3` and the migration branch head is `a361a61d423aa2e6103505398f4d949aedeb57cb`. GitHub compares the migration branch as 155 commits ahead and 24 behind current `main`. The 67-file PR diff contains only the isolated Bookkeys preview/migration additions and the migration-specific workflow `.github/workflows/bookkeys-next-scaffold.yml`; no existing Limitless application files are modified by this PR. GitHub currently reports the PR as mergeable, but it remains a draft.

The 24 commits now on `main` since the PR's shared base include recent Limitless work across Codeforces/competition, Math Trainer, Metallurgy, Probability/studies, site navigation and favicon assets. The migration branch does not contain those commits, but the current PR diff remains limited to 67 added Bookkeys/migration files. The PR base pointer was refreshed to current `main` (`fd32ab485da9977efbb7046b37b752701af214f3`) on 15 November 2026. GitHub now reports the PR as mergeable; its diff remains additions-only. Keep it draft and do not merge or deploy until manual data/device acceptance is complete. No production reader files are part of the PR diff.

## Verified in CI

The latest successful current-main migration workflow is [43649399229](https://github.com/guiltythreee/Limitless/actions/runs/43649399229), with the separate legacy regression workflow [43649399234](https://github.com/guiltythreee/Limitless/actions/runs/43649399234). Both completed successfully on code commit `a361a61d423aa2e6103505398f4d949aedeb57cb`.

- **116/116 TypeScript tests passed**, including first-time restore sanitization for malformed progress counters and replace-restore rollback under storage quota pressure.
- **99/99 legacy preservation tests passed** against the original standalone HTML implementation. The archived 91-test baseline and current branch's 99/99 result are recorded in `tools/typing/BOOKKEYS_TEST_BASELINE.md`.
- TypeScript type-check passed.
- Next.js static production build passed.
- Chromium browser regression suite: **25/25 passed**:
  1. Import an EPUB, type a page, persist progress and reward records, reload, reopen, export a backup, import it into a fresh browser context and restore settings.
  2. Change theme, accent, custom text colour and reader settings; verify persistence, legacy background preferences, Gothic/Garden artwork on the home and reader surfaces, and the correct palette-driven shell theme after reload.
  3. Import a PDF, extract readable text and complete a page.
  4. Use the reader at a 390 px phone viewport and verify no horizontal overflow.
  5. Navigate to a second section, reload, use Continue reading and restore both the saved position and unfinished typing draft.
  6. Type the sample passage and verify that no XP, reward ledger or book progress is written.
  7. Load the legacy `bookkeys:size` setting when the newer settings object has no size.
  8. Remove a local book file and library entry while retaining completed typing progress.
  9. Add/remove chapter headings, persist both legacy chapter keys and restore edits after reload.
  10. Verify the shared Limitless EXP display aggregates Probability, Metallurgy and Bookkeys ledgers, updates when another tab awards EXP, and excludes legacy `bookkeys:game.xp`.
  11. Open a pre-populated `bookkeys-lib` IndexedDB v1 library with existing metadata and a local EPUB blob, then confirm the schema remains v1 and restore saved Gothic artwork from the existing `files` store.
  12. Paste plain text, create a local TXT-backed book, type a page, reload and restore its draft/progress.
  13. Open the Akashic Archive and verify existing achievement timestamps and saved records remain unchanged.
  14. Simulate IME composition start, intermediate composing input, composition end and a possible final input event; verify the committed character is counted once, saved in the draft, and does not prematurely write page progress.
  15. Verify the original 22 procedural canvas scenes, the visual background tile catalogue, and the three photo backgrounds with both desktop and portrait crops.
  16. Verify Time of Day switching, reduced-motion behaviour, photo text-backdrop minimum, and background control persistence.
  17. Verify the legacy `bgdef1`/`bgdef2` migrations run once, preserve the expected photo/veil defaults and do not replay over later user choices.
  18. Verify the centered-reading preference is in the original Typing tab and changes the reader layout, then persists after reload.
  19. Verify original background palettes, theme tiles, accent swatches and background-colour matching in the original Theme tab.
  20. Load all ten selectable reader fonts from embedded offline WOFF2 faces and confirm no external font requests are made.

Additional browser coverage in the latest run verifies EPUB cover extraction and persistence in IndexedDB v1, library thumbnail rendering, inline chapter-title editing with focus and Enter-to-save, Continue reading after reload, the two-chip Theme decoration control, and the corrected chapter-editing/settings interactions. The latest run also confirms that importing a book directly marks it as opened for Continue reading/Recent, while multi-file imports that are not opened do not change their opened timestamp.

PDF, EPUB and plain-text/TXT imports are supported, including a paste-text workflow that stores text as a local TXT-backed book. Existing Gothic and Garden artwork data is read from the original IndexedDB keys; uploaded images are validated, resized to at most 1600 × 900 and stored in those same keys. The original 22 procedural canvas scene definitions are restored, along with the 27-entry original background tile catalogue, three photographic scenes with desktop/portrait crops, Time of Day mode, density/animation controls, backdrop/veil/blur controls and the exact one-time `bgdef1`/`bgdef2` migrations. Photo backgrounds retain a minimum 70% reader text backdrop. The original 34 settings fields and defaults remain lossless, including unknown extension fields.

The preview contains all six settings tabs (Theme, Background, Font, Typing, Cursor and Data). The legacy control placements now match: background-colour matching is in Theme; centered reading is in Typing; the Font tab includes the live contrast ratio warning. Gothic/Garden uploads continue to work as selectable reader backgrounds and now also decorate the library home when their matching decorative theme is active.

The original source contains 22 static WOFF2 `@font-face` declarations: ten selectable reader families and two decorative display families with their legacy weights/styles. All 22 definitions match the preview exactly. The browser test loads all ten selectable families locally without external font requests. Font files cover Latin glyphs; non-Latin scripts use system fallback fonts, as in the original subset.

The library also displays persisted Bookkeys page, chapter, book, word and character counters. The Akashic Archive updates core counters only after eligible typing: words, characters, pages, daily and consecutive-day streaks, session bests, WPM/accuracy records, perfect pages, consecutive accuracy runs, flawless chapters and 100-page-book milestones. New achievement timestamps are written only when a user crosses a threshold; existing records are preserved and old thresholds are not backfilled. Typing accuracy tracks key events rather than only the final text: inserted characters count, deletions do not, and retyped characters count again. Drafts retain those counters, and multi-character paste/drop input is blocked. Synthetic IME composition lifecycle is covered by a passing browser regression. Real Japanese/Chinese/Indic IMEs, composition candidate selection, mobile keyboards and hardware-specific keyboard acceptance remain open.

A populated IndexedDB v1 fixture opens in-browser without a version upgrade; actual user libraries still require a backup-first manual acceptance run. The Bookkeys header displays global Limitless EXP from the canonical LSR-1 source registry, including awards from other disciplines and updates from other tabs. Legacy `bookkeys:game.xp` is retained for data compatibility but is never counted as global EXP. The shared LSR-1 reward policy is mirrored inside this isolated Next.js project because the Next build boundary cannot import files outside the project root. A parity test compares its award calculations and ledger sanitization with the canonical `shared/rewards.mjs` implementation.

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
