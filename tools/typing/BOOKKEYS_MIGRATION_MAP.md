# Bookkeys migration map — Phase 0 findings

Date: 2026-11-02
Branch: `audit/bookkeys-preservation-migration-20261102`
Audit base: `6a9a1723e0689c8748424f3ec9287f6d6de5efdc`
Preserved Bookkeys source blob: `310da8014c6c1ca9c80a75bce89b4ff1b2aa1e28`

## Safety status

- This document is an inspection-only checkpoint.
- No Bookkeys application code, assets, storage formats, routes, or deployment configuration have been changed.
- The source blob above is the exact original implementation being mapped.
- Do not start extraction or replace the iframe until the test baseline and deployment target are verified.

## Confirmed repository/deployment shape

1. The repository root is a static HTML/CSS/JS hub. Its `index.html` loads `theme.css` and `hub-theme.css`; the hub links out to independently served discipline directories.
2. Bookkeys is currently served from `tools/typing/index.html`. That page is a shell with a same-origin iframe pointing to `bookkeys.html`.
3. The shell's Content Security Policy is restrictive and currently permits same-origin frames/scripts/styles, data images/fonts, and blob workers. Any replacement must explicitly preserve the required security and worker behaviour.
4. The Next.js application inspected in this repository is `metallurgy-source`. Its `next.config.ts` sets `output: "export"`, `trailingSlash: true`, and production `basePath: "/metallurgy"`. Its README says the generated `out/` contents are copied to the root repository's `metallurgy/` directory.
5. The deployed Probability output is present under `probability/` as a generated Next.js static export (for example, `probability/index.html` references `/probability/_next/static/...`). It is not a package directory at `probability/package.json`.
6. No root `package.json`, `probability/package.json`, `vercel.json`, or Wrangler configuration was found at the inspected paths. This is not proof that no deployment automation exists; the complete repository/workflow inventory is still required.

**Architecture implication:** `metallurgy-source` is not automatically the canonical host for all of Limitless. It is a source project that exports to a static subdirectory. Bookkeys must be integrated according to the actual static-site deployment pipeline and URL layout, not by assuming that adding a Next.js route to this project will replace the current Bookkeys URL.

## Bookkeys persistence contract recovered from the original source

### localStorage

The application uses browser-local storage through small `load(key)` and `store(key, value)` wrappers. Confirmed keys/patterns:

| Key or pattern | Purpose / preservation requirement |
|---|---|
| `bookkeys:settings` | User settings object; preserve every setting and its existing defaults/merge behaviour |
| `bookkeys:size` | Legacy reading-size setting; still read as a fallback when the newer settings object has no size |
| `bookkeys:game` | XP, levels, ranks, achievements, streak/reward and per-book learning progress |
| `bookkeys:shelves` | User-created library shelves |
| `bookkeys:<book-key>` | Per-book current page/section position |
| `bookkeys:lib:<library-id>` | Saved library-book position used by the library display |
| `bookkeys:chap:<book-key>` | Chapter/section segmentation and Required/Optional choices; current schema marker is version 3 |
| `bookkeys:chap:lib:<library-id>` | Legacy/library chapter lookup path used when rendering saved chapter names |
| `bookkeys:draft:<book-key>:<page-index>` | In-progress typing draft, including typed text and timing/accuracy counters; newest eight drafts per book are retained |
| `bookkeys:bgdef1`, `bookkeys:bgdef2` | Existing background-related preferences/defaults; preserve until their exact UI mapping is verified |

The app's backup export scans **all** localStorage entries whose keys start with `bookkeys:`; it does not export the IndexedDB library blobs. The JSON envelope is `{ app: "bookkeys", v: 1, exportedAt, keys }`. Import validates this envelope and merges rather than replacing: existing entries are generally kept, with special merge logic for game/settings/shelves/chapter data. A migration must preserve this contract or provide a tested, lossless import path for existing v1 backups.

The shell separately stores its theme at `limitless.typing.v1.theme` (values `dark` or `light`). This key is outside the `bookkeys:` backup namespace.

The embedded epub.js bundle contains a localForage implementation and localStorage fallback code. This is bundled third-party code; do not infer that Bookkeys itself owns a separate localForage database without further call-site evidence.

### IndexedDB

Bookkeys opens database `bookkeys-lib`, version `1`, with these stores:

- `meta` — object store with keyPath `id`, holding library-book metadata.
- `files` — object store keyed by library id, holding the original local file blobs.
- The same database also stores custom theme artwork under file keys `art:gothic` and `art:garden`.

Library add/delete operations update metadata and file blobs together. Library rendering reads metadata; opening a saved library book retrieves its file from the `files` store. Artwork is loaded from IndexedDB and applied locally. These records must remain browser-local; no upload or remote book processing is acceptable.

## UI and behaviour inventory anchors

The original document contains 117 element IDs. Key screens/panels and controls include:

- Home/library: `home`, `homeContinue`, `homeSample`, `shelfBooks`, `openLibrary`, shelf create/rename/delete controls.
- Import: `openLoader`, `pdfInput`, `libInput`, `ldPaste`, `ldSample`, loader status/cancel controls.
- Reading/typing: `bookText`, `sink`, `prev`, `next`, page counters, typing metrics, plain-flow toggle and size controls.
- Chapter segmentation: `chapBtn`, `chapters`, `chList`, `chAllReq`, `chAllOpt`, `chDefaults`, `chEven`, `chRedo`, `chAdd`, save/cancel controls.
- Progress/rewards: HUD, `openHall`, Hall of Fame and achievement controls.
- Settings: `settings`, settings controls, save/discard confirmation, reset controls.
- Data safety: backup export/import controls and save-failure warning/retry.
- Visual preferences: embedded offline fonts/images, custom artwork records, theme/background settings.

The app also implements keyboard/input composition handling, file drag/drop, paste, visibility/page lifecycle saves, resize/orientation handling, online/offline events, dialogs, and history navigation. Native browser Back/Forward is implemented through History API state and `popstate`; the NAV region explicitly delegates touch/trackpad gesture navigation to the browser. Do not add custom swipe interception.

## Regression suite discovered

- Test package: `tools/typing/tests/package.json`
- Runner: Node's built-in `node --test`
- Package command: `npm test`
- Dependency: `jsdom` (dev dependency)
- `helpers.mjs` extracts the actual pure helper regions and embedded JSZip/epub.js bundles from the original HTML.
- `blocks.test.mjs` covers PDF/text shaping, chapter helpers, XP and reward calculations.
- `sections.test.mjs` covers Required/Optional classification and chapter-list defaults.
- `app-boot.test.mjs` boots the actual page in jsdom and exercises sample typing, EPUB import, XP/persistence and PDF import.
- The audit describes broader EPUB, navigation and persistence coverage; inspect all discovered test files before editing their harness.

The prior audit's 86-pass figure is historical only. **A fresh `npm test` result has not been obtained in this environment.** Do not claim it passes until executed against this exact branch/source blob in Node 20.9+.

## Next gates — still required before production-code migration

1. Run the full existing test package and save its exact test count, failures, Node version and command output.
2. Inspect the complete deployment workflow and the generated Probability/Metallurgy output process. Identify the authoritative production root and how `tools/typing/` is published.
3. Verify the CSP, same-origin iframe path, service/offline behaviour, and worker loading in the actual deployment.
4. Complete the screen/control/settings inventory and map every settings field and every IndexedDB metadata field.
5. Only then propose the target module layout. Keep the existing static app as the active fallback while extracting logic and building the parallel UI.

## Migration rule

No storage key rename, IndexedDB database/store/version change, backup schema change, remote book upload, CDN dependency, original asset removal, or active-route cutover without a separate explicit compatibility plan and tests. Save/commit each compiling, passing checkpoint before adding the next change.
