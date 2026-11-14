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
| Home and library | Partial — specific legacy gaps identified | Existing work already includes local IndexedDB library, Continue reading, sample passage, shelf create/rename/delete, title/author search, recent/title sorting, and safe removal from inside the reader. Direct comparison with the preserved 5.47 MB legacy source found additional home/library behaviour not yet represented: a dedicated Recent tab (last 12 opened books), per-book cover thumbnails, per-card author/page/progress presentation, per-card move-to-shelf and remove actions, multi-file PDF/EPUB import, drag-and-drop import, and arrow/Home/End keyboard navigation across shelf tabs. The legacy PDF/EPUB import flow also extracts/stores cover and author metadata. The migration currently has a single-file PDF/EPUB/TXT picker and a simpler book grid. Preserve existing migration search/sort features while restoring these missing legacy actions. |
| PDF / EPUB / TXT / paste import | Partial | Local PDF text extraction, EPUB section parsing, TXT import and paste-text-to-library creation are implemented. Fixture-based PDF and EPUB browser tests pass; representative long, malformed, unusual, image-only and real-world files remain a manual gate. |
| Reading and typing | Partial | Text display, typing, page/section navigation, draft recovery, saved position, required-section progress and sample mode are implemented. Key-event accuracy now counts inserted characters, ignores deletions, counts retyped characters and persists its counters in drafts; multi-character paste and dropped text are blocked. The reader now ignores intermediate IME composition input and commits the final composed value once; a passing Playwright regression verifies the draft and single-count behaviour. Real IME engines, candidate selection, mobile keyboards and remaining hardware/browser edge cases still need acceptance. |
| Chapter management | Partial — specific legacy gaps identified | Existing work already includes EPUB TOC-derived headings, PDF heading/bookmark-based detection, even-section fallback, required/optional choices, defaults, add/rename/remove, persistence and progress. Direct comparison with the original chapter dialog found missing actions: Go to a selected chapter, manually Detect again, Split in even sections, and the inline chapter-title editing/focus workflow. The legacy also exposes a Stop looking action while asynchronous detection is running; assess whether this remains relevant to the new import/detection architecture before porting. The migration's add/rename/remove and bulk requirement actions are already present. |
| Progress and achievements | Partial | The preview restores the original 60 achievement definitions and now updates eligible-page counters, daily/consecutive-day streaks, session records, WPM/accuracy bests, perfect pages, best accuracy runs, flawless chapters and long-book milestones. Key-event accuracy follows legacy insertion/deletion/retyping rules and drives accuracy-based achievements. It awards achievements only when a new threshold is crossed and preserves existing timestamps; older saves are not retroactively unlocked. IME/composition and hardware-specific input edge cases remain to be checked. |
| Rewards and EXP | Implemented for shared EXP | Verified page/chapter/book evidence enters the LSR-1 ledger. The preview reads the global registered-module total, refreshes on same-tab and cross-tab reward updates, and excludes legacy `bookkeys:game.xp`. Legacy Bookkeys XP remains in storage for compatibility, not as global EXP. |
| Settings and appearance | Substantially implemented; manual visual acceptance pending | A direct comparison against the preserved original source confirms that the settings catalogues match: 33 theme palettes (11 base plus 22 generated), 26 accent choices, 22 text colours, 7 cursor colours, 10 reader fonts and all 27 background entries, in the same order. All original setting controls are present, including the exact range limits/steps for background intensity, text backdrop, picture dimming/blur, font size, line height, letter spacing, effect intensity and volume; all 16 letter effects, mistake feedback, particles, sounds, motion modes, cursor shapes/blink modes and data backup/restore are represented. The original has Match colors to background in both Theme and Background; the preview preserves both placements. Centered reading remains in Typing. Custom text colour, contrast warning, theme palettes, Gothic/Garden artwork, all 22 canvas scenes, three photos and portrait crops, Time of Day, reduced motion, one-time background migrations and embedded offline fonts have dedicated browser coverage. Theme decoration is represented as an equivalent on/off checkbox rather than the original two-chip control. The remaining settings work is runtime side-by-side acceptance of every setting's actual visual/audio side effect, not rebuilding missing tabs or catalogues. The 22 WOFF2 declarations match the original; fonts cover Latin, with system fallback for other scripts. |
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

## Next implementation priorities

1. Restore the identified legacy library actions: Recent tab (last 12), cover thumbnails and author metadata, per-book progress display, move/remove card actions, multi-file import, drag-and-drop, and shelf-tab keyboard navigation. Preserve the migration's existing search and sort controls.
2. Restore the identified chapter-dialog actions: Go to chapter, Detect again, Split in even sections, and inline title editing/focus. Reassess Stop looking against the new detection architecture.
3. Complete runtime side-by-side acceptance of settings visual/audio effects; the catalogues, defaults and range definitions have now been compared against the original source.
4. Verify real Japanese/Chinese/Indic IMEs, composition candidate selection, mobile keyboards and hardware keyboard behaviour against the legacy reader.
5. Test representative real-world PDFs/EPUBs, real IndexedDB v1 libraries and backup files, then complete real-browser/mobile/offline/CSP acceptance before production cutover.

## Visual fidelity requirement

The preview must not simplify or replace the original reader's visual identity to make the migration easier. Preserve the original background catalogue, procedural/canvas effects, photographs and their responsive crops, artwork, typography, colour/palette behaviour, overlays, and motion controls. CSS gradients are not acceptable substitutes for an original procedural effect or supplied artwork. Implement visual settings from the legacy source semantics, and keep unknown settings fields lossless. Any missing visual behaviour remains a parity gap until implemented and checked side by side; a passing type-check or generic scene test does not close that gap.

## Non-negotiable boundary

The TypeScript preview remains isolated at `/tools/typing-next-preview/`.
The production route and original standalone `bookkeys.html` remain unchanged.
No user library data is uploaded to a server, and no production cutover is
authorized by a passing build or fixture-based test suite.
