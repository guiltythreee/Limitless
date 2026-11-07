# Bookkeys migration status

## Current state

The TypeScript/React reader is an isolated migration implementation. It is not the production reader and is not wired into the live /tools/typing/ route.

- Active migration branch: work/bookkeys-typescript-mainline-20261107
- Preserved migration backup: work/bookkeys-typescript-migration-20261107
- The migration branch was reconciled with the latest main deployment workflow and is kept additive.
- Production tools/typing/index.html and tools/typing/bookkeys.html are unchanged.

## Verified in CI

The latest successful workflow run [42379353637](https://github.com/guiltythreee/Limitless/actions/runs/42379353637) includes:

- 107 TypeScript tests covering IndexedDB v1 compatibility, PDF/EPUB parsing, chapters, reading sessions, key-event accuracy, archive counters/achievements, backup rollback safety, shelves and reward logic.
- The current 98-test legacy suite in tools/typing/tests is also rerun in CI against the preserved standalone HTML implementation. The archived 91-test baseline and current 98/98 result are recorded in tools/typing/BOOKKEYS_TEST_BASELINE.md.
- TypeScript type-check.
- Next.js static production build.
- 13 Playwright browser regressions:
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

PDF, EPUB and plain-text/TXT imports are supported, including a paste-text workflow that stores text as a local TXT-backed book. Existing Gothic and Garden artwork data is read from the original IndexedDB keys and can be selected as the reader background; the exact `bgdef1`/`bgdef2` mapping and artwork upload controls remain open. The reader now offers 24 scene presets, three original photo presets with desktop/mobile crops and 13 reduced-motion-aware CSS scene animations. It supports local Gothic/Garden artwork upload/removal; uploaded images are validated, resized to at most 1600 × 900 and stored in the existing IndexedDB artwork keys. Original procedural canvas effects and the legacy backdrop/veil/blur/palette controls remain incomplete. The library also displays persisted Bookkeys page, chapter, book, word and character counters. The Akashic Archive now updates core counters only after eligible typing: words, characters, pages, daily and consecutive-day streaks, session bests, WPM/accuracy records, perfect pages, consecutive accuracy runs, flawless chapters and 100-page-book milestones. New achievement timestamps are written only when a user crosses a threshold; existing records are preserved and old thresholds are not backfilled. Typing accuracy now tracks key events rather than only the final text: inserted characters count, deletions do not, and retyped characters count again. Drafts retain those counters, and multi-character paste/drop input is blocked. IME/composition and hardware-specific keyboard acceptance remain open. A populated IndexedDB v1 fixture is now opened in-browser without a version upgrade; actual user libraries still require a backup-first manual acceptance run. The Bookkeys header displays global Limitless EXP from the canonical LSR-1 source registry, including awards from other disciplines and updates from other tabs. Legacy `bookkeys:game.xp` is retained for data compatibility but is never counted as global EXP. The shared LSR-1 reward policy is mirrored inside this isolated Next.js project because the Next build boundary cannot import files outside the project root. A parity test compares its award calculations and ledger sanitization with the canonical shared/rewards.mjs implementation.

## Safety and data compatibility

- The original Bookkeys HTML reader remains untouched.
- The migration opens the existing bookkeys-lib IndexedDB v1 database and keeps its existing store names and version.
- Existing Bookkeys localStorage keys, per-book/library reading-position keys, both chapter-record lookup paths, the legacy bookkeys:size fallback and backup v1 formats are retained. The sample passage is typable but excluded from XP, rewards and saved book progress.
- Original PDF/EPUB files and artwork remain browser-local; the reward ledger stores only page fingerprints and character counts, not book text.
- The TypeScript preview does not sync original book files to the cloud.
- Removing a book deletes its local library file/metadata but intentionally retains the progress ledger and backup data.
- No production cutover or live deployment has been performed.

## Remaining acceptance gates

- Match the remaining original canvas scene effects and legacy backdrop/veil/blur/palette controls.
- Verify IME/composition input and hardware-specific keyboard behaviour against the legacy reader.
- Complete a side-by-side inventory of every legacy Bookkeys screen, action, setting and keyboard interaction; port anything not represented in the new reader.
- Test representative real-world PDFs and EPUBs, including long books, unusual chapter structures, malformed files and scanned/image-only PDFs.
- Verify opening representative real user IndexedDB libraries and existing backup files without data loss.
- Test on real mobile browsers, not only a desktop Chromium viewport.
- Deploy a separate preview route and complete manual acceptance before considering production cutover.

A successful build and the automated tests are necessary, but do not by themselves authorize replacing the standalone production reader.
