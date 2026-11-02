# Bookkeys preservation-first migration audit

Date: 2026-11-02

## Scope and safety

- Audit branch: `audit/bookkeys-preservation-migration-20261102`
- Base: `fix/bookkeys-native-browser-navigation`
- Base commit: `6a9a1723e0689c8748424f3ec9287f6d6de5efdc`
- Audited source: `tools/typing/bookkeys.html`
- Source blob: `310da8014c6c1ca9c80a75bce89b4ff1b2aa1e28`
- Git tree reports source size: 5,472,293 bytes.
- No application code, assets, live routes, or deployment configuration changed in this audit.

## Findings: why the HTML file is large

The file is a self-contained offline application. The main size contributors are embedded resources, not just application logic.

Approximate section sizes measured from the source (line-based byte estimates; Git blob size is authoritative):

| Section | Approx. size |
|---|---:|
| Embedded offline fonts | 640 KB |
| Embedded photographs/decorative images | 2,829 KB |
| PDF.js and embedded worker | 1,407 KB |
| JSZip | 98 KB |
| epub.js | 224 KB |
| Application CSS | 48 KB |
| Bookkeys application script | 225 KB |

The image section is the largest contributor. PDF.js plus its worker is the next largest. The fonts are another significant contributor. JSZip and epub.js are embedded to preserve offline EPUB support. These are not disposable code blocks.

## Existing architecture

- `tools/typing/index.html` is a Limitless shell that embeds Bookkeys in a same-origin iframe.
- The shell currently owns its own theme bootstrap and loads the shared `theme.css`.
- Bookkeys itself is a standalone HTML document with its own markup, styles, application script, embedded fonts, images, JSZip, epub.js, PDF.js, and PDF worker.
- The existing Limitless codebase includes Next.js 16, React 19, TypeScript 5.9, and Node.js tooling under `metallurgy-source`. This is a viable integration target, but the actual deployment/routing relationship must be mapped before moving the app.
- A separate Node test package exists at `tools/typing/tests`; its current regression workflow runs on PRs affecting `tools/typing/**` and `shared/**`.

## Existing preservation coverage

The repository already has Bookkeys-specific regression tests and a verification report. Coverage includes:

- PDF text normalization, visual-line extraction, paragraph/block reconstruction, page segmentation, chapter detection, and XP calculations.
- EPUB byte identity/hash, TOC/NCX/EPUB3 navigation, relative and anchored links, XHTML extraction, spine ordering, section packing, Unicode, malformed or missing files, and synthetic EPUB end-to-end reading.
- Required/optional section classification, including acknowledgements, author's notes, introductions, appendices, indexes, glossaries, and publisher/author matter.
- Required/optional choices persisted across reloads and reward/completion handling.
- Browser-owned trackpad/touch navigation, history/popstate, Back/Forward, dialog closure, and keyboard navigation.
- Whole-app boot tests for PDF and EPUB import, typing, XP, persistence, backups, unreadable pages, save failures, theme switching, settings, and home navigation.

The existing verification report states 86 tests passed at the time it was written. Re-run the current suite on this branch before migration; do not assume the historical count is still current.

## Non-negotiable behaviour and guarantees

1. PDF and EPUB imports continue to work, including offline/local-file operation.
2. JSZip, epub.js, PDF.js, and the PDF worker remain available without a CDN or network dependency unless an equivalent local/offline arrangement is verified first.
3. Book contents remain local; do not introduce upload or remote processing.
4. Existing content extraction, ordering, chapters, section boundaries, Unicode handling, and error messages remain equivalent.
5. Existing Required/Optional defaults, manual overrides, persistence, completion, XP, rewards, and duplicate-import behaviour remain equivalent.
6. Typing, progress, library, settings, theme, backups, and restore behaviour remain equivalent.
7. Native browser Back/Forward and touch/trackpad navigation remain browser-owned; do not reintroduce custom swipe interception.
8. Preserve the current shell/iframe behaviour until a replacement has passed explicit same-origin, routing, and navigation tests.
9. Preserve all existing visual assets and reading-font choices initially. Asset optimization or lazy loading is a separate measured change, not a prerequisite for migration.
10. Keep a recoverable copy of the original standalone app and retain Git history. Do not delete or replace it during the migration until parity is demonstrated.

## Safe migration sequence

### Phase 0 — baseline (this audit branch)
- Freeze the audited source blob and branch base.
- Run the existing regression suite and record its exact result.
- Inventory all UI screens, controls, settings, IndexedDB/local storage records, import paths, dialogs, keyboard shortcuts, and shell interactions.
- Record current offline/CSP and browser behaviour.

### Phase 1 — architecture mapping
- Map the existing app into UI, domain logic, PDF adapter, EPUB adapter, persistence, assets/fonts, and shell integration.
- Identify reusable pure functions and tests that can be moved without changing behaviour.
- Map the target Next.js app entry point, build/deployment path, and shared theme contracts.
- No production code migration until this map is reviewed.

### Phase 2 — low-risk extraction
- Extract pure logic and adapters incrementally while keeping the original HTML as the active implementation.
- Keep the original source as a compatibility harness while the new modules are introduced.
- Run old and new tests after each extraction; save/commit each compiling, passing checkpoint.

### Phase 3 — parallel implementation
- Build the React/TypeScript interface around the preserved domain logic.
- Keep the original Bookkeys available as a fallback route/implementation.
- Do not change data formats or storage keys without an explicit, tested migration plan.

### Phase 4 — parity and cutover
- Run automated tests plus real-browser tests for PDF/EPUB imports, offline operation, IndexedDB, themes, dialogs, keyboard navigation, touch/trackpad navigation, and history.
- Compare representative real books, including books with front/back matter and acknowledgements.
- Cut over only after all parity checks pass. Keep rollback available.

## Open questions to resolve before implementation

- Which Next.js application is the canonical deployment target, and how are the separate source directories assembled/deployed?
- Is the standalone Bookkeys shell currently served from the same origin and path in every deployment?
- Which exact IndexedDB database/store names and localStorage keys are relied upon by the live app and existing backups?
- Which assets are intentionally embedded for offline guarantees, and which can safely become local static assets without breaking offline use?
- What browser/device matrix is available for real touch, trackpad, file-picker, and IndexedDB verification?

## Current decision

Proceed with a preservation-first migration into the existing Limitless Next.js/React/TypeScript architecture only after baseline tests and the above inventory are complete. Do not rewrite the application, redesign the UI, remove offline support, alter persisted data, or replace the active implementation as part of the initial migration.
