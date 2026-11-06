# Bookkeys migration status

## Current state

The TypeScript/React reader is an isolated migration implementation. It is not the production reader and is not wired into the live /tools/typing/ route.

- Active migration branch: work/bookkeys-typescript-mainline-20261107
- Preserved migration backup: work/bookkeys-typescript-migration-20261107
- The migration branch was reconciled with the latest main deployment workflow and is kept additive.
- Production tools/typing/index.html and tools/typing/bookkeys.html are unchanged.

## Verified in CI

The latest successful workflow run includes:

- 79 unit tests covering IndexedDB v1 compatibility, PDF/EPUB parsing, chapters, reading sessions, backups, shelves and reward logic.
- TypeScript type-check.
- Next.js static production build.
- 4 Playwright browser regressions:
  1. Import an EPUB, type a page, persist progress and reward records, reload, reopen, export a backup, import it into a fresh browser context and restore settings.
  2. Import a PDF, extract readable text and complete a page.
  3. Switch themes and change reader settings, then verify persistence after reload.
  4. Use the reader at a 390 px phone viewport and verify no horizontal overflow.

The shared LSR-1 reward policy is mirrored inside this isolated Next.js project because the Next build boundary cannot import files outside the project root. A parity test compares its award calculations and ledger sanitization with the canonical shared/rewards.mjs implementation.

## Safety and data compatibility

- The original Bookkeys HTML reader remains untouched.
- The migration opens the existing bookkeys-lib IndexedDB v1 database and keeps its existing store names and version.
- Existing Bookkeys localStorage keys and backup v1 formats are retained.
- Original PDF/EPUB files and artwork remain browser-local; the reward ledger stores only page fingerprints and character counts, not book text.
- The TypeScript preview does not sync original book files to the cloud.
- No production cutover or live deployment has been performed.

## Remaining acceptance gates

- Complete a side-by-side inventory of every legacy Bookkeys screen, action, setting and keyboard interaction; port anything not represented in the new reader.
- Test representative real-world PDFs and EPUBs, including long books, unusual chapter structures, malformed files and scanned/image-only PDFs.
- Verify opening an existing user's populated IndexedDB library and existing backup files without data loss.
- Test on real mobile browsers, not only a desktop Chromium viewport.
- Deploy a separate preview route and complete manual acceptance before considering production cutover.

A successful build and the automated tests are necessary, but do not by themselves authorize replacing the standalone production reader.
