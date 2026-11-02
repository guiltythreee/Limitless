# Bookkeys regression baseline — historical reference

Date: 2026-11-02
Repository: `guiltythreee/Limitless`

## Previous verified result

**91 tests passed, 0 failed, 0 skipped.**

This result was obtained on the previous audit branch, against the preserved Bookkeys source blob `310da8014c6c1ca9c80a75bce89b4ff1b2aa1e28`.

| Item | Value |
|---|---|
| Previous branch | `audit/bookkeys-preservation-migration-20261102` |
| Test commit | `91fddd202b77806fc6c6d91dcd841f06dd3f56b5` |
| Node.js | `v20.9.0` |
| npm | `10.1.0` |
| Install | `npm ci` |
| Test | `npm test` in `tools/typing/tests` |
| GitHub Actions | https://github.com/guiltythreee/Limitless/actions/runs/41458291727 |
| Result | success |
| Duration | 8,875.876 ms |

TAP summary:

```text
1..91
# tests 91
# suites 0
# pass 91
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 8875.876051
```

## Important qualification

This is a historical reference, **not a fresh test result for** `work/bookkeys-node-migration-20261102`. Current main has since evolved, including shared theme integration and a newer regression workflow configured for Node 22.

Before any migration code is changed, run the current test package on the new working branch and replace this note with the exact current result. Do not claim that the 91-test result verifies later main-branch changes.

## Coverage in the previous baseline

- Sample typing, EPUB import, PDF import and typing XP.
- Completion rewards and duplicate-completion protection.
- Required/Optional defaults, manual choices, reload persistence and all-optional books.
- Settings, theme switching, home navigation and loader entry points.
- Paste/drop restrictions and draft-save failure handling.
- Backup validation and merge behaviour.
- Unreadable-page handling.
- PDF text normalization, line extraction, block reconstruction and chapter helpers.
- EPUB archive validation, hashes, navigation documents, TOC/NCX/EPUB3 handling, anchors, relative paths, XHTML extraction, Unicode, malformed/missing files, section packing and ordering.
- Native browser-owned touch/trackpad gestures, History API, Back/Forward, dialogs and keyboard navigation.

The suite is a compatibility guard, not proof of full real-browser/device parity or a completed migration.
