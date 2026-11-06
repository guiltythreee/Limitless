# Bookkeys fresh regression baseline

Date: 2026-11-02

## Result

**PASS — 91 tests passed, 0 failed.**

This is a fresh execution of the existing Bookkeys test package against the preserved standalone implementation. It replaces the earlier historical 86-pass figure as the current baseline.

The 91-test count below is the archived 2026-11-02 baseline. The current main branch has since grown the same legacy suite to 98 tests; migration CI passed all 98 on 2026-11-06 (latest run 42305018680).

## Exact execution

| Item | Value |
|---|---|
| Repository | `guiltythreee/Limitless` |
| Branch | `audit/bookkeys-preservation-migration-20261102` |
| Test commit | `91fddd202b77806fc6c6d91dcd841f06dd3f56b5` |
| Preserved Bookkeys source blob | `310da8014c6c1ca9c80a75bce89b4ff1b2aa1e28` |
| Working directory | `tools/typing/tests` |
| Node.js | `v20.9.0` |
| npm | `10.1.0` |
| Install command | `npm ci` |
| Test command | `npm test` (`node --test`) |
| GitHub Actions run | [41458291727](https://github.com/guiltythreee/Limitless/actions/runs/41458291727) |
| Workflow result | `success` |
| Test duration | 8,875.876 ms |

## TAP summary

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

Dependency installation added 39 packages and reported 0 vulnerabilities.

## Coverage exercised by this baseline

The existing suite includes whole-app jsdom boot tests and focused helper/adapter tests for:

- Sample typing, EPUB import, PDF import, and typing XP.
- Completion rewards and duplicate-completion protection.
- Required/Optional defaults, manual choices, reload persistence, and all-optional books.
- Settings, theme switching, home navigation, and loader entry points.
- Paste/drop restrictions and draft-save failure handling.
- Backup validation and merge behaviour.
- Unreadable-page handling.
- PDF text normalization, line extraction, block reconstruction, and chapter helpers.
- EPUB archive validation, hashes, navigation documents, TOC/NCX/EPUB3 handling, anchors, relative paths, XHTML extraction, Unicode, malformed/missing files, section packing, and ordering.
- Native browser-owned touch/trackpad gestures, History API, Back/Forward, dialogs, and keyboard navigation.

## Interpretation and limits

- This establishes a passing automated baseline for the original implementation and its current test harness.
- It does **not** establish full real-browser/device parity, offline behaviour under every deployment condition, or a successful migration. Those remain separate verification gates.
- The original Bookkeys HTML, assets, routes, storage formats, and active implementation were not modified to obtain this result.
- Keep this baseline and test workflow in place throughout extraction. Re-run the full suite after every migration checkpoint.
