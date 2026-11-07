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
| Home and library | Partial | Local library, Continue reading, sample passage, shelf create/rename/delete, title/author search and recent/title sorting are present. Exact legacy card actions, cover artwork and every shelf interaction still need a side-by-side check. |
| PDF / EPUB / TXT / paste import | Partial | Local PDF text extraction, EPUB section parsing, TXT import and paste-text-to-library creation are implemented. Fixture-based PDF and EPUB browser tests pass; representative long, malformed, unusual, image-only and real-world files remain a manual gate. |
| Reading and typing | Partial | Text display, typing, page/section navigation, draft recovery, saved position, required-section progress and sample mode are implemented. Key-event accuracy now counts inserted characters, ignores deletions, counts retyped characters and persists its counters in drafts; multi-character paste and dropped text are blocked. The reader now ignores intermediate IME composition input and commits the final composed value once; a passing Playwright regression verifies the draft and single-count behaviour. Real IME engines, candidate selection, mobile keyboards and remaining hardware/browser edge cases still need acceptance. |
| Chapter management | Partial | TOC-derived headings, required/optional choices, defaults, add/rename/remove, persistence and progress are covered. Reordering is not a legacy action; unusual TOC structures and real-world books remain to be checked. |
| Progress and achievements | Partial | The preview restores the original 60 achievement definitions and now updates eligible-page counters, daily/consecutive-day streaks, session records, WPM/accuracy bests, perfect pages, best accuracy runs, flawless chapters and long-book milestones. Key-event accuracy follows legacy insertion/deletion/retyping rules and drives accuracy-based achievements. It awards achievements only when a new threshold is crossed and preserves existing timestamps; older saves are not retroactively unlocked. IME/composition and hardware-specific input edge cases remain to be checked. |
| Rewards and EXP | Implemented for shared EXP | Verified page/chapter/book evidence enters the LSR-1 ledger. The preview reads the global registered-module total, refreshes on same-tab and cross-tab reward updates, and excludes legacy `bookkeys:game.xp`. Legacy Bookkeys XP remains in storage for compatibility, not as global EXP. |
| Settings and appearance | Partial | Dark/light theme, reading text size, line spacing and completion-celebration persist. There are 24 scene presets, three original photo presets with desktop/mobile crops, 13 reduced-motion-aware CSS motion effects, and local Gothic/Garden artwork upload/removal. The original source's exact 34-field settings schema and defaults are now inventoried. Original procedural canvas effects, exact `bgdef1`/`bgdef2` migration behaviour, backdrop/veil/blur, palette matching, theme/font controls, typing effects/sound, cursor controls, offline fonts and remaining settings still need parity work. |
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

The legacy settings UI is divided into Theme, Background, Font, Typing, Cursor and Data tabs. Its background catalogue includes No Background, Time of Day, three photo scenes and the original animated canvas scenes. The TypeScript preview currently has a separate dark/light shell theme and a smaller reader-scene selector; it must not reinterpret legacy `bg` as the shell theme.

## Next implementation priorities

1. Match the remaining procedural canvas effects and legacy `bgdef1`/`bgdef2`, backdrop/veil/blur and palette settings without changing saved keys.
2. Verify IME/composition input and hardware keyboard behaviour against the legacy reader.
3. Finish the library and chapter-editor action inventory, then implement only confirmed missing actions.
4. Run the existing-data acceptance tests against copies of real IndexedDB and backup data.
5. Complete real-browser/mobile/offline/CSP acceptance before any production cutover.

## Non-negotiable boundary

The TypeScript preview remains isolated at `/tools/typing-next-preview/`.
The production route and original standalone `bookkeys.html` remain unchanged.
No user library data is uploaded to a server, and no production cutover is
authorized by a passing build or fixture-based test suite.
