# Bookkeys TypeScript migration workspace

This is an isolated Next.js/React/TypeScript source project. It is deliberately separate from the active application at `tools/typing/`.

## Safety boundary

- Do not import, move, or rewrite production Bookkeys logic until the remaining browser parity gates are complete.
- Do not change the active `tools/typing/index.html` or `tools/typing/bookkeys.html` route.
- Do not change localStorage keys, the `bookkeys-lib` IndexedDB v1 schema, backup v1 format, or shared theme integration.
- Book files and artwork must remain local to the user's browser.
- Keep native browser Back/Forward and touch/trackpad navigation browser-owned.
- The static export is intended for a future parallel preview at `/tools/typing-next-preview/`; it is not wired into production.

## Commands

- `npm install`
- `npm run typecheck`
- `npm run build`

The first scaffold intentionally contains no Bookkeys reader, persistence, import, typing, reward, or settings implementation.

## First extraction checkpoint

The first isolated extraction now lives under `src/lib/bookkeys/`:

- `blocks.mjs` — original text normalization, PDF text block/page shaping, chapter detection and requirement classification, local rank/XP helpers, streak helpers, and achievement catalogue.
- `epub.mjs` — original EPUB TOC/path helpers, DOM-to-block extraction, paragraph splitting, section packing, chapter mapping, and EPUB error handling. Chapter normalization is imported from `blocks.mjs` so PDF and EPUB use the same chapter rules.
- `tests/bookkeys-pure.test.mjs` — deterministic parity checks for normalization, text pagination, chapter boundaries, XP/rank calculations, streaks, signatures, EPUB identity, TOC/path handling, block splitting and section mapping.

These modules are not yet imported by the active production reader. The original HTML remains the runtime source until the remaining subsystems are migrated and the complete parity gate passes.

### Second extraction checkpoint: IndexedDB adapter

`src/lib/bookkeys/database.mjs` now isolates the existing `bookkeys-lib` v1 IndexedDB contract behind `createBookkeysDatabase(indexedDBImpl)`. It preserves the `meta` store (`keyPath: id`), `files` store (out-of-line keys), and the existing `all`, `file`, `setFile`, `delFile`, `add`, `put`, and `del` operations. The injectable IndexedDB implementation lets tests exercise the real adapter without touching a user's browser data.

`tests/bookkeys-database.test.mjs` uses `fake-indexeddb` to check paired metadata/blob writes, metadata updates, artwork/file operations, deletion of both library records, and the unavailable-IndexedDB failure path. This adapter is still isolated from production.
