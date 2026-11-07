# Bookkeys TypeScript scaffold checkpoint

Date: 2026-11-02
Branch: `work/bookkeys-node-migration-20261102`
Source directory: `tools/typing-next-source/`
Parallel URL reserved for later: `/tools/typing-next-preview/`

## What exists

- Next.js App Router + React + TypeScript source project.
- Static export configuration with a dedicated future preview base path.
- Minimal migration-sandbox landing page; no Bookkeys feature implementation.
- Node.js 22 CI workflow running dependency installation, TypeScript checking and static production build.

## Verified compile checkpoint

Workflow: [Bookkeys TypeScript Scaffold run 8](https://github.com/guiltythreee/Limitless/actions/runs/41474687293)

- Node.js: 22.23.4
- npm: 10.9.9
- Next.js resolved by CI: 16.4.4
- TypeScript check: PASS
- Next.js production static build: PASS
- Static routes prerendered: `/` and `/_not-found`
- Build output: static export
- Workflow result: success

The successful scaffold was committed before any follow-on changes. The TypeScript JSX mode was aligned with Next.js 16's generated `react-jsx` setting. The final scaffold configuration passed a second complete type-check and static build. The existing Bookkeys regression suite also passed again on the same PR head: [run 545](https://github.com/guiltythreee/Limitless/actions/runs/41474687420).

## Strict boundary

This is only a compiling project shell. It contains no reader, PDF/EPUB import, IndexedDB, localStorage, backup, typing, EXP/rewards, chapter segmentation, settings, themes, or offline implementation.

The active production application at `tools/typing/` remains untouched. The future preview path is not wired into the production route. No Cloudflare configuration or deployment settings were changed.

## Next work

1. Complete the remaining browser parity checks: deletion, backup restore/merge, offline resources, CSP, browser navigation and custom artwork.
2. Build a subsystem-by-subsystem extraction plan tied to the source inventory and existing 98-test suite.
3. Implement the first subsystem only after its contract and parity tests are explicit; keep the original implementation as rollback.

## Extraction checkpoint — 2026-11-07

The isolated workspace now contains the first two pure helper modules (`blocks.mjs` and `epub.mjs`) plus 14 focused parity tests. The module source is copied from the preserved production source and does not replace or modify it.

CI on the current PR head passed:
- Extracted Bookkeys helper tests.
- TypeScript type-check.
- Next.js static export build.
- Existing production Bookkeys regression suite: 98/98 passing.

The extraction remains non-production. Do not switch the active reader until persistence, PDF/EPUB import, typing state, chapter editing, settings/themes, backups, achievements/rewards and offline behaviour have each passed parity checks, followed by a rollback review.
