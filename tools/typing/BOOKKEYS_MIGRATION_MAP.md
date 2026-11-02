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


## Phase 0 status update — 2026-11-02

### Fresh regression baseline: complete

The original Bookkeys implementation passed a fresh run of the complete test package:

- GitHub Actions run: [41458291727](https://github.com/guiltythreee/Limitless/actions/runs/41458291727)
- Node.js: 20.9.0; npm: 10.1.0
- Command: `npm ci` followed by `npm test` in `tools/typing/tests`
- Result: **91 passed, 0 failed, 0 skipped**
- Duration: 8,875.876 ms
- Preserved Bookkeys source blob: `310da8014c6c1ca9c80a75bce89b4ff1b2aa1e28`

The result is recorded in `tools/typing/BOOKKEYS_TEST_BASELINE.md`. A dedicated workflow is now present at `.github/workflows/test-bookkeys.yml`, covering Bookkeys changes on this migration branch and pull requests.

The baseline report commit also completed the same regression workflow successfully (run [41458435375](https://github.com/guiltythreee/Limitless/actions/runs/41458435375)).

### Deployment architecture findings

A read-only inspection of the Cloudflare dashboard confirmed:

- Cloudflare Workers & Pages project: `limitless`
- Connected repository: `guiltythreee/Limitless`
- Production branch: `main`
- Production URL: `https://limitless.beyondthelimits.workers.dev/`
- Deployment type shown in the dashboard: static assets
- The latest Ready deployment observed during inspection was associated with the Probability learning-goals merge; a subsequent generated Probability build was still in progress at that moment.

Repository inspection confirms the root Limitless hub is still a static HTML site. Bookkeys is served from `tools/typing/index.html`, which embeds the unchanged `bookkeys.html` through a same-origin iframe.

The two existing Next.js projects demonstrate the repository's static-export pattern:

- `probability-source` uses Next.js static export with production `basePath: "/probability"`; `.github/workflows/build-probability.yml` builds it and syncs `out/` into `probability/` on `main`.
- `metallurgy-source` uses Next.js static export with production `basePath: "/metallurgy"`; its README documents copying `out/` into `metallurgy/`.

**Still unresolved:** the Cloudflare dashboard's build-settings page was not reached during the read-only inspection, so the authoritative root directory, build command, and output directory are not yet confirmed. Do not assume a monorepo build command or alter the production build settings. Verify those settings before choosing the final Bookkeys export/copy strategy.

### Safety and branch delta

Compared with the previous checkpoint `298e6d0`, this branch is exactly two commits ahead. The only added files are:

- `.github/workflows/test-bookkeys.yml`
- `tools/typing/BOOKKEYS_TEST_BASELINE.md`

No Bookkeys application code, assets, active routes, local storage keys, IndexedDB schema, or deployment settings were changed.

### Updated gate status

1. Fresh automated baseline — **complete**.
2. Confirm Cloudflare build root/command/output directory — **open**.
3. Complete exact settings-field and IndexedDB metadata inventory — **open**.
4. Verify live CSP, iframe, worker and offline behaviour — **open**.
5. Review target module layout before any extraction — **not started**.

No production-code migration is authorized by this checkpoint. Keep the standalone implementation active until all remaining gates are closed and the parallel replacement passes feature parity.


## Cloudflare build-settings follow-up — 2026-11-02

A second read-only dashboard inspection reached the project's Builds configuration and recorded:

| Setting | Observed value |
|---|---|
| Project | `limitless` |
| Git repository | `guiltythreee/Limitless` |
| Production branch | `main` |
| Root directory | `/` |
| Build command | None |
| Build output directory | No explicit value shown |
| Deploy command | `npx wrangler deploy` |
| Build cache | Enabled |
| Include paths | `*` |
| Exclude paths | `node_modules/**`, `.git/` |
| Disable builds | Off |
| Environment variables/secrets | None shown |
| Deploy hooks | None shown |

The Git tree at this checkpoint was also checked recursively. It contains no `wrangler.toml`, `wrangler.json`, `wrangler.jsonc`, Worker entrypoint, or root `package.json`. The only package manifests are the two discipline Next.js sources and the Bookkeys test package.

**Deployment blocker:** the dashboard's configured deploy command (`npx wrangler deploy`) does not have an evident Wrangler configuration or Worker entrypoint in the checked-in tree, while the dashboard reports a Ready production deployment. The actual deployment/build logs and static asset upload mechanism must be reconciled before changing or relying on this pipeline. Do not add a guessed Wrangler config, change the deploy command, or alter Cloudflare settings as part of Bookkeys migration.

The latest read-only dashboard view showed the production project as a static-assets deployment at `https://limitless.beyondthelimits.workers.dev/`. It was not modified. The Bookkeys migration branch itself is not the production branch and has not been deployed.

### Verification after documentation checkpoint

The Bookkeys regression workflow also passed on the updated map commit:

- Run: [41459248116](https://github.com/guiltythreee/Limitless/actions/runs/41459248116)
- Result: success.

### Revised next gate

Inspect the latest Cloudflare deployment's build/deploy logs and confirm exactly how the root static files are uploaded and served. Only after that should we choose the parallel Bookkeys static-export destination and cutover strategy.


## Cloudflare production build-log follow-up — deployment path confirmed

The individual build page was opened successfully in a read-only inspection. This resolves the earlier uncertainty about how the production static assets are published.

### Observed production build

| Field | Observed value |
|---|---|
| Build ID | `5681729f-b81f-4366-8ed5-81d62ad9692c` |
| Production service | `limitless` |
| Branch | `main` |
| Commit | `b4681dc80d2f1a2a617a722ed7f0cf0b1d00dc3e` |
| Trigger | `github-actions[bot]` |
| Wrangler | `4.156.1` |
| Build command | None |
| Deploy command | `npx wrangler deploy` |
| Working directory | Repository root (`/`) |
| Assets directory in build container | `/opt/buildhome/repo` |
| Files scanned | 718 |
| New/modified assets uploaded | 13 |
| Duration | 1m 38s |
| Result | Successful |

Relevant log evidence:

```text
No build output detected to cache. Skipping.
No dependencies detected to cache. Skipping.
Executing user deploy command: npx wrangler deploy
The following package was not found and will be installed: wrangler@4.156.1
wrangler 4.156.1
Building list of assets...
Read 718 files from the assets directory /opt/buildhome/repo
Starting asset upload...
Found 13 new or modified static assets to upload. Proceeding with upload...
```

### Correct interpretation

The earlier concern about the missing checked-in Wrangler config is resolved for this production deployment: Wrangler 4.156.1 successfully deployed static assets from the repository root without a checked-in Wrangler config or root package manifest.

The Cloudflare build output directory is effectively the repository root, not a Next.js `out/` folder. Discipline build workflows first generate their static exports and place the generated files into their deployed subdirectories; the subsequent Cloudflare deployment scans the root and uploads changed assets.

This matches the repository's existing pattern:

- Probability: Next.js static export → `probability/` → root asset deployment.
- Metallurgy: Next.js static export → `metallurgy/` → root asset deployment.
- Bookkeys today: standalone shell and iframe application under `tools/typing/`.

### Bookkeys migration implication

The safest parallel implementation is a new Next.js/React/TypeScript source project (built with Node.js) that exports static files into a separate nested directory under the repository root. Cloudflare's existing root-asset deployment can then serve that parallel route without changing the active `tools/typing/` URL.

Keep the current shell, iframe, original HTML, assets, local storage and IndexedDB untouched while the parallel app is developed and tested. Only after feature parity should a separately reviewed cutover move the new export to the existing Bookkeys path. Do not add a Worker backend or change Cloudflare settings merely to support this migration.

The exact temporary route and final export destination must be chosen after the remaining storage/UI inventory and URL/CSP checks. This is an architecture direction, not authorization to cut over.

### Remaining gates

1. Exact settings-field and IndexedDB metadata inventory.
2. Real-browser verification of the current same-origin iframe, CSP, worker loading, offline use, and native navigation.
3. Final source/module layout and temporary parallel route.
4. Only then begin incremental extraction, with the 91-test suite as the compatibility guard.
