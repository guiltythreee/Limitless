# Bookkeys regression baseline — current branch verification

Date: 2026-11-02
Repository: `guiltythreee/Limitless`
Working branch: `work/bookkeys-node-migration-20261102`

## Current verified result

<badge>PASS</badge> **98 tests passed, 0 failed, 0 skipped.**

The current Bookkeys regression workflow ran against commit `60cb8b8531f40a0fb65840cb9fc5e588be7c8b7d`. The subsequent commits on this branch changed migration documentation only; no Bookkeys application source or test files changed after the tested commit.

| Item | Value |
|---|---|
| Node.js configured | `22` |
| Install | `npm ci` |
| Test | `npm test` in `tools/typing/tests` |
| GitHub Actions run | https://github.com/guiltythreee/Limitless/actions/runs/41462586271 |
| Workflow | Bookkeys Regression Tests |
| Job | `test` — success |
| Test count | 98 |
| Passed | 98 |
| Failed | 0 |
| Skipped | 0 |
| Duration | 9,143.193 ms |

TAP summary:

```text
# tests 98
# pass 98
# fail 0
# skipped 0
# duration_ms 9143.193306
```

## What this verifies

The existing suite runs against the preserved Bookkeys application source and covers app boot, PDF/EPUB import, EPUB parsing, typing and XP, rewards, Required/Optional chapter handling, persistence, backup merging, settings/theme, navigation, History API and browser-owned gestures.

## Limits

This is an automated regression result. It does not prove full real-browser/device parity, IndexedDB library behaviour on actual browsers, offline operation in all deployment conditions, or successful migration. Those are separate gates.

The active Bookkeys source, assets, route, storage formats, IndexedDB schema and Cloudflare deployment settings remain unchanged.
