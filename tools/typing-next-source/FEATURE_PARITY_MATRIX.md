# Bookkeys feature parity matrix

This inventory compares the preserved legacy feature groups in
`tools/typing/BOOKKEYS_MIGRATION_MAP.md` with the isolated TypeScript preview.
It is a source-level implementation inventory, not a claim that real-world
browser parity has been accepted.

Status meanings:

- **Implemented** — the preview has the corresponding workflow and automated coverage.
- **Partial** — the core workflow exists, but one or more legacy behaviours are not represented.
- **Missing** — the legacy feature group is not yet present in the preview.
- **Manual gate** — automation exists only for a fixture or desktop Chromium; real user data/hardware remains unverified.

| Legacy feature group | TypeScript preview status | Current evidence / remaining work |
|---|---|---|
| Home and library | Partial | Local library, Continue reading, sample passage, shelf create/rename/delete and PDF/EPUB import are present. Exact legacy card actions, cover artwork, search/sort and every shelf interaction still need a side-by-side check. |
| PDF / EPUB import | Partial | Local PDF text extraction and EPUB section parsing are implemented. Fixture-based PDF and EPUB browser tests pass; representative long, malformed, unusual, image-only and real-world files remain a manual gate. |
| Reading and typing | Partial | Text display, typing, page/section navigation, draft recovery, saved position, required-section progress and sample mode are implemented. Legacy typing metrics, feedback detail, paste/drop handling, page lifecycle saves and all keyboard interactions still need a complete inventory. |
| Chapter management | Partial | TOC-derived headings, required/optional choices, defaults, add/remove, persistence and progress are covered. Full editing/reordering parity and unusual TOC structures remain to be checked. |
| Progress and achievements | Partial | Existing legacy progress remains stored; the preview shows required-section completion and shared Limitless EXP. The legacy statistics, streak UI, achievement collection and Hall of Fame are not yet surfaced. |
| Rewards and EXP | Implemented for shared EXP | Verified page/chapter/book evidence enters the LSR-1 ledger. The preview reads the global registered-module total, refreshes on same-tab and cross-tab reward updates, and excludes legacy `bookkeys:game.xp`. Legacy Bookkeys XP remains in storage for compatibility, not as global EXP. |
| Settings and appearance | Partial | Dark/light theme, reading text size, line spacing and completion-celebration preference persist. Legacy background presets, custom artwork, offline fonts, exact `bgdef1`/`bgdef2` mapping and all settings controls remain to be inventoried. |
| Backup and restore | Partial | Backup v1 export/import and merge are implemented and a browser round-trip passes. Existing populated user backups and conflict-heavy merges need testing with real copies. IndexedDB book files/artwork are intentionally excluded, as in the legacy format. |
| IndexedDB library | Partial | The preview opens the existing `bookkeys-lib` v1 database and retains the `meta` and `files` stores. Automated database contract tests pass; opening, editing and removing a representative pre-existing populated library is still a manual gate. |
| Browser navigation | Implemented for covered flows | Browser Back/Forward, in-app history state and Alt+Left/Alt+Right are present. Native touch/trackpad gestures are not intercepted. Test on real mobile browsers and hardware remains a manual gate. |
| Offline and resilience | Partial | Book files remain local and the static preview builds. Legacy offline fonts/artwork, worker loading, blocked storage, quota/save-failure retry, online/offline transitions and production CSP still need acceptance tests. |
| Mobile layout | Partial | A 390 px Chromium viewport regression verifies no horizontal overflow. Real Android/iOS browser testing, orientation changes and touch behaviour remain manual gates. |

## Next implementation priorities

1. Port the legacy progress/achievement surface without treating legacy module XP as global EXP.
2. Complete the exact settings/background/custom-artwork inventory before adding appearance controls; do not guess what the old background keys mean.
3. Finish the library and chapter-editor action inventory, then implement only confirmed missing actions.
4. Run the existing-data acceptance tests against copies of real IndexedDB and backup data.
5. Complete real-browser/mobile/offline/CSP acceptance before any production cutover.

## Non-negotiable boundary

The TypeScript preview remains isolated at `/tools/typing-next-preview/`.
The production route and original standalone `bookkeys.html` remain unchanged.
No user library data is uploaded to a server, and no production cutover is
authorized by a passing build or fixture-based test suite.
