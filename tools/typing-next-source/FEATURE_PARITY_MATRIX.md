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
| Home and library | Substantially implemented; targeted acceptance remains | Verified: local IndexedDB library, Continue reading, sample passage, shelf create/rename/delete, title/author search, title sorting, Recent last-12 view, per-card author/section/progress, move/remove, multi-file import and drag/drop. EPUB 3 cover extraction already existed in the importer; app wiring now passes cover data through, stores it in existing `meta.cover`, backfills older entries on open, and renders validated local data-URL thumbnails. The original shelf-tab row and keyboard model are restored: tabs use roving focus with ArrowLeft/ArrowRight and Home/End. E2E coverage exercises keyboard navigation. Remaining acceptance: PDF/TXT batch and drag/drop are not separately covered; verify shelf tabs on narrow screens. |
| PDF / EPUB / TXT / paste import | Partial | Local PDF text extraction, EPUB section parsing, TXT import and paste-text-to-library creation are implemented. Fixture-based PDF and EPUB browser tests pass; representative long, malformed, unusual, image-only and real-world files remain a manual gate. |
| Reading and typing | Partial | Text display, typing, page/section navigation, draft recovery, saved position, required-section progress and sample mode are implemented. Key-event accuracy now counts inserted characters, ignores deletions, counts retyped characters and persists its counters in drafts; multi-character paste and dropped text are blocked. The reader now ignores intermediate IME composition input and commits the final composed value once; a passing Playwright regression verifies the draft and single-count behaviour. Real IME engines, candidate selection, mobile keyboards and remaining hardware/browser edge cases still need acceptance. |
| Chapter management | Core and inline editing implemented; acceptance pending | Verified: EPUB TOC-derived headings, PDF heading/bookmark detection, even-section fallback, required/optional choices, defaults, add/remove, Go to selected chapter, Detect again, Split evenly, persistence/progress and now inline title editing with autofocus, Enter-to-save and Escape-to-cancel. E2E coverage exercises the inline edit flow. The legacy Stop looking action should be reassessed against the current detection architecture before deciding whether it remains relevant. |
| Progress and achievements | Partial | The preview restores the original 60 achievement definitions and now updates eligible-page counters, daily/consecutive-day streaks, session records, WPM/accuracy bests, perfect pages, best accuracy runs, flawless chapters and long-book milestones. Key-event accuracy follows legacy insertion/deletion/retyping rules and drives accuracy-based achievements. It awards achievements only when a new threshold is crossed and preserves existing timestamps; older saves are not retroactively unlocked. IME/composition and hardware-specific input edge cases remain to be checked. |
| Rewards and EXP | Implemented for shared EXP | Verified page/chapter/book evidence enters the LSR-1 ledger. The preview reads the global registered-module total, refreshes on same-tab and cross-tab reward updates, and excludes legacy `bookkeys:game.xp`. Legacy Bookkeys XP remains in storage for compatibility, not as global EXP. |
| Settings and appearance | Substantially implemented; runtime acceptance pending | Source comparison confirms the catalogues match: 33 theme palettes (11 base plus 22 generated), 26 accent choices, 22 text colours, 7 cursor colours, 10 reader fonts and all 27 background entries in original order. Controls and range limits/steps are represented, including all 16 letter effects, mistake feedback, particles, sounds, motion modes, cursor shapes/blink modes and backup/restore. Match colors to background remains in both original Theme and Background placements; centered reading remains in Typing. Custom text colour, contrast warning, Gothic/Garden artwork, 22 canvas scenes, three photos/portrait crops, Time of Day, reduced motion, one-time background migrations and offline fonts have browser coverage. The original Theme decoration On/Off two-chip control is now restored with the original `deco=on|off` persistence values. Runtime side-by-side acceptance of visual/audio side effects remains; do not rebuild catalogues or tabs. All 22 WOFF2 declarations match; fonts cover Latin, with system fallback for other scripts. |
| Backup and restore | Partial | Backup v1 export/import and merge are implemented and a browser round-trip passes. Replace restore now snapshots existing keys and rolls back overwritten/new keys if a storage write fails. Existing populated user backups and conflict-heavy merges still need testing with real copies. IndexedDB book files/artwork are intentionally excluded, as in the legacy format. |
| IndexedDB library | Partial | The preview opens the existing `bookkeys-lib` v1 database and retains the `meta` and `files` stores. Automated database contract tests pass, and an end-to-end fixture opens a pre-populated v1 metadata/file store without upgrading it. Opening, editing and removing a real user's populated library remains a manual gate. |
| Browser navigation | Implemented for covered flows | Browser Back/Forward, in-app history state and Alt+Left/Alt+Right are present. Native touch/trackpad gestures are not intercepted. Test on real mobile browsers and hardware remains a manual gate. |
| Offline and resilience | Partial | Book files remain local and the static preview builds. Legacy offline fonts/artwork, worker loading, blocked storage, quota/save-failure retry, online/offline transitions and production CSP still need acceptance tests. |
| Mobile layout | Partial | A 390 px Chromium viewport regression verifies no horizontal overflow. Real Android/iOS browser testing, orientation changes and touch behaviour remain manual gates. |

## Extracted legacy settings contract

The preserved original source defines these defaults in `bookkeys:settings`; unknown extension fields must continue to survive every write:

| Group | Legacy fields and defaults |
|---|---|
| Theme | `skin=auto`, `accent=theme`, `accentCustom=#E11D48`, `fontColor=theme`, `fontColorCustom=#FF8A00`, `bgMatch=true`, `deco=on` |
| Background | `bg=pic-morning`, `bgDensity=1`, `bgAnim=true` unless the OS requests reduced motion, `backdrop=0`, `picVeil=0`, `picBlur=0` |
| Typography | `font=newsreader`, `size=20`, `lineH=1.7`, `spacing=0`, `punct=simplify`, `lglow=true` |
| Typing | `tfx=none`, `fxInt=1`, `efx=flash`, `sparks=off`, `sound=off`, `volume=50`, `errSound=true`, `centered=false`, `celebrate=true`, `motion=system` |
| Cursor | `cstyle=block`, `cblink=blink`, `csmooth=true`, `cglow=false`, `ccolor=accent` |

The legacy settings UI is divided into Theme, Background, Font, Typing, Cursor and Data tabs. Its background catalogue includes No Background, Time of Day, three photo scenes and the original animated canvas scenes. The preview retains a separate quick dark/light shell toggle and theme palettes; it must not reinterpret legacy `bg` as the shell theme. The original settings tab locations and defaults are part of parity, not merely the presence of equivalent controls.

## Next implementation and acceptance priorities

The previously listed cover, inline chapter-title, shelf-tab keyboard and Decorative Details gaps have been implemented in this branch. The EPUB cover path uses the existing importer result and IndexedDB v1 `meta.cover` field; the inline editor has autofocus, Enter-to-save and Escape-to-cancel; the original two-chip decoration control persists `deco=on|off`. Focused browser coverage now exercises cover persistence, chapter editing, shelf keyboard navigation and the decoration control. Keep these implementations; do not rebuild them.

1. Complete source-by-source, side-by-side runtime acceptance of settings visual and audio side effects. Preserve the original artwork, backgrounds, typography, layout, control locations, ranges and defaults; do not simplify or replace the visual system.
2. Test representative real-world PDFs, EPUBs and TXT files, including long, malformed, unusual and image-only documents. Check EPUBs with absent, unsupported and oversized covers, and confirm that reimporting never loses an existing supported cover or other metadata.
3. Run a backup-first acceptance against a real populated IndexedDB v1 library. Verify old metadata, files, progress, shelf assignments, cover backfill, open/reopen, move/remove and no database version upgrade.
4. Test populated backup exports and conflict-heavy merge/replace restores, including rollback after simulated storage write failures.
5. Verify real Japanese, Chinese and Indic IMEs, composition candidate selection, mobile keyboards and hardware keyboard behaviour against the legacy reader.
6. Complete real-device mobile, offline, CSP, blocked-storage and quota/save-failure acceptance before any production cutover. Reassess the legacy Stop looking action against the current detection architecture rather than restoring it blindly.

The migration remains isolated. Passing CI or fixture-based tests does not authorize production cutover.

## Visual fidelity requirement

The preview must not simplify or replace the original reader's visual identity to make the migration easier. Preserve the original background catalogue, procedural/canvas effects, photographs and their responsive crops, artwork, typography, colour/palette behaviour, overlays, and motion controls. CSS gradients are not acceptable substitutes for an original procedural effect or supplied artwork. Implement visual settings from the legacy source semantics, and keep unknown settings fields lossless. Any missing visual behaviour remains a parity gap until implemented and checked side by side; a passing type-check or generic scene test does not close that gap.

## Non-negotiable boundary

The TypeScript preview remains isolated at `/tools/typing-next-preview/`.
The production route and original standalone `bookkeys.html` remain unchanged.
No user library data is uploaded to a server, and no production cutover is
authorized by a passing build or fixture-based test suite.
