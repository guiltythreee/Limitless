# Lectern (PDF reading, notes, attachments) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename the Book Tracker to Lectern and add a PDF reading view with highlights, markers, colour note blocks linked to problems, and attachments, all stored on the device.

**Architecture:** Pure logic (annotation shapes, positions, backup merging) lives in DOM-free `.mjs` modules tested in Node. A small IndexedDB wrapper stores book files, annotations and attachments. A viewer draws PDF pages with pdf.js (canvas plus text layer) and an overlay layer on top positioned in page fractions (0 to 1), so annotations stay in place at any zoom.

**Tech Stack:** Plain ES modules, vendored pdf.js 4.10.38 (already in `vendor/`), IndexedDB, `fake-indexeddb` (test-only), Playwright (manual browser checks).

**Spec:** `docs/superpowers/specs/2026-11-25-lectern-design.md`

## Global Constraints

- Plain static files, ES modules, no build step; `index.html` stays a minimal shell, the page is built in JS.
- Libraries are copied into `vendor/`; nothing loads from the internet.
- Keep the localStorage key `limitless.bookTracker.v1` so existing books and ticks survive the rename.
- Everything stays on the device; no uploads, no Supabase.
- Tests live in `tools/lectern/tests/test-*.mjs` (deploy ignores `**/test-*.mjs`).
- Attachment limit: 25 MB per file (`26214400` bytes).
- Annotation positions are fractions of the page (0 to 1), never pixels.
- Colours: yellow, green, blue, pink, orange, purple.
- Commit and push to a branch as soon as each task works, before the next task begins.
- Commit messages end with the two attribution lines given by the session reminder.

## Review Focus

- A PDF that is password-protected or damaged: Lectern shows a clear message and the rest of the tool keeps working.
- The same PDF added twice: it reuses the existing book (matched by fingerprint) instead of duplicating notes.
- Window resize or zoom: every highlight, marker and note stays on the same spot of the page.
- Deleting a book removes its PDF, annotations and attachments from storage.
- IndexedDB unavailable (private window, blocked): problem tracking still works; reading shows a message instead of crashing.
- A note linked to a problem that is later removed from the outline: the note stays and shows as "problem no longer in outline".

---

### Task 1: Rename Book Tracker to Lectern

**Files:**
- Move: `tools/book-tracker/` to `tools/lectern/` (use `git mv`)
- Create: `tools/book-tracker/index.html` (redirect page to `/tools/lectern/`)
- Modify: `tools.js` (card name, desc, href), `index.html` (sidebar link and label), `.github/workflows/test-book-tracker.yml` (rename to `test-lectern.yml`, update paths), `tools/lectern/index.html` and `tracker.js` (title and heading text "Lectern")
- Test: `tools/lectern/tests/test-lectern-rename.mjs`

**Interfaces:**
- Produces: all later tasks work under `tools/lectern/`. The tool's page entry is `tools/lectern/tracker.js`.

- [ ] **Step 1: Write the failing test** `test-lectern-rename.mjs` using `node:fs`: asserts `tools/lectern/index.html` exists and contains `<title>Lectern`; `tools/book-tracker/index.html` exists and contains `/tools/lectern/`; `tools.js` contains `href: "tools/lectern/"` and no `tools/book-tracker/`; `index.html` contains `tools/lectern/`; the localStorage key string `limitless.bookTracker.v1` is still in `tools/lectern/tracker.js`.
- [ ] **Step 2: Run** `node tools/lectern/tests/test-lectern-rename.mjs` (before the move it cannot find the folder). Expected: FAIL.
- [ ] **Step 3: Do the rename** with `git mv`, add the redirect page (meta refresh plus `location.replace`), update the card text ("Lectern", read your books, mark them, note them, track the problems), the sidebar label, the workflow (name `Lectern Tests`, paths `tools/lectern/**`, test commands use the new path), and the visible title and heading.
- [ ] **Step 4: Run** both existing test files and the new one at their new paths. Expected: all three print "passed".
- [ ] **Step 5: Commit** on a new branch `feature/lectern` (also add the spec and this plan) and push.

### Task 2: Annotation logic (`annotations.mjs`)

**Files:**
- Create: `tools/lectern/annotations.mjs`
- Test: `tools/lectern/tests/test-annotations.mjs`

**Interfaces:**
- Produces:
  - `COLORS: readonly string[]` (the six names above, in that order) and `COLOR_HEX: Record<string,string>`
  - `type Annotation = { id, bookId, kind: 'highlight'|'marker'|'note', page: number, color, x, y, w, h, rects: {x,y,w,h}[], text: string, label: string, problemKey: string|null, attachmentIds: string[], created: number, updated: number }`
  - `newId(): string`
  - `createHighlight({bookId,page,rects,text,color}): Annotation`
  - `createMarker({bookId,page,x,y,label}): Annotation`
  - `createNote({bookId,page,x,y,color}): Annotation` (default `w: 0.22`, `h: 0.12`, `text: ''`)
  - `updateAnnotation(a: Annotation, patch: Partial<Annotation>): Annotation` (clamps so `0<=x`, `x+w<=1`, `0<=y`, `y+h<=1`, `w>=0.05`, `h>=0.04`; keeps `id`, `bookId`, `kind`; sets `updated`)
  - `rectsFromSelection(clientRects: {left,top,width,height}[], pageBox: {left,top,width,height}): {x,y,w,h}[]` (fractions; drops rects under 1 px wide; merges rects on the same line that touch)
  - `annotationsForPage(list, page): Annotation[]`, `notesForProblem(list, problemKey): Annotation[]`
  - `sanitizeAnnotation(raw: unknown): Annotation | null` (null when `id`, `bookId`, `kind` or `page` is invalid; unknown colour becomes `yellow`)
  - `mergeAnnotations(existing: Annotation[], incoming: Annotation[]): Annotation[]` (same `id`: the one with the larger `updated` wins)
  - `MAX_ATTACHMENT_BYTES = 26214400`

- [ ] **Step 1: Write failing tests**, one per behaviour above, with these assertions: `createNote` defaults; `updateAnnotation(note,{x:0.95})` gives `x === 0.78` (so it stays inside the page); `updateAnnotation(note,{w:0})` gives `w === 0.05`; `rectsFromSelection` on a pageBox of 600x800 with a client rect `{left:60,top:80,width:300,height:16}` gives `[{x:0.1,y:0.1,w:0.5,h:0.02}]`; two touching rects on one line merge into one; zero-width rect is dropped; `sanitizeAnnotation({id:'a'})` is `null`; `notesForProblem` returns only `kind==='note'` with that key; `mergeAnnotations` picks the newer; `MAX_ATTACHMENT_BYTES === 26214400`.
- [ ] **Step 2: Run** `node tools/lectern/tests/test-annotations.mjs`. Expected: FAIL (module missing).
- [ ] **Step 3: Implement** the module per the signatures above.
- [ ] **Step 4: Run** the test. Expected: `annotations: all tests passed`.
- [ ] **Step 5: Commit and push.**

### Task 3: Storage (`store.mjs`)

**Files:**
- Create: `tools/lectern/store.mjs`, `tools/lectern/tests/package.json` (devDependency `fake-indexeddb`)
- Test: `tools/lectern/tests/test-store.mjs`
- Modify: `.github/workflows/test-lectern.yml` (add `npm ci` in `tools/lectern/tests` and the new test)

**Interfaces:**
- Consumes: `Annotation`, `MAX_ATTACHMENT_BYTES` from `annotations.mjs`.
- Produces: `openStore(factory: IDBFactory = globalThis.indexedDB): Promise<Store>`; rejects with `Error` whose `code === 'no-storage'` when `factory` is missing. `Store` methods (all async):
  - `putFile(bookId, { fingerprint, name, data: ArrayBuffer })`, `getFile(bookId): { fingerprint, name, data } | undefined`, `findBookByFingerprint(fingerprint): string | undefined`
  - `putAnnotation(a)`, `listAnnotations(bookId): Annotation[]`, `deleteAnnotation(id)` (also deletes that annotation's attachments)
  - `putAttachment({ id, annotationId, name, type, blob })` (throws `Error` with `code === 'too-large'` above the limit), `getAttachment(id)`, `listAttachments(annotationId)`, `deleteAttachment(id)`
  - `deleteBook(bookId)` (file, annotations, attachments)

- [ ] **Step 1: Write failing tests** using `fake-indexeddb/auto`'s `IDBFactory`: put and get a file round-trips bytes; `findBookByFingerprint` finds it; annotations list per book only; `deleteAnnotation` removes its attachments; `putAttachment` with `size = MAX_ATTACHMENT_BYTES + 1` rejects with code `too-large`; `deleteBook` leaves nothing for that book in any store; `openStore(undefined)` rejects with code `no-storage`.
- [ ] **Step 2: Run** `cd tools/lectern/tests && npm ci && node test-store.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement** with database name `lectern`, stores `files` (key `bookId`), `annotations` (key `id`, index `bookId`), `attachments` (key `id`, index `annotationId`).
- [ ] **Step 4: Run** the test. Expected: `store: all tests passed`.
- [ ] **Step 5: Commit and push.**

### Task 4: Reading view (open, pages, zoom)

**Files:**
- Create: `tools/lectern/viewer.js`, `tools/lectern/lectern.css` (rename `book-tracker.css`)
- Modify: `tools/lectern/tracker.js` (a "Read" button per book; adding a PDF stores it with `putFile`; reuses an existing book with the same fingerprint), `tools/lectern/pdf-read.mjs` (export the fingerprint from the pdf.js document)
- Test: `tools/lectern/tests/test-viewer-math.mjs` for the pure helper below

**Interfaces:**
- Consumes: `openStore`, `Store`.
- Produces:
  - `viewer-math.mjs`: `fitScale(pageWidth: number, hostWidth: number, zoom: number): number` (`zoom` 1 means fit width; clamp zoom to 0.5..4)
  - `openViewer(host: HTMLElement, opts: { bookId: string, store: Store, pdfjs: object, getProblems: () => ProblemRef[] }): Promise<{ destroy(): void, goTo(page: number): void }>` where `ProblemRef = { key: string, label: string }`. Each page is a wrapper `div.lc-page[data-page]` holding the canvas, a text layer, and an empty `div.lc-overlay` (filled by tasks 5 and 6). Pages render lazily when scrolled near.

- [ ] **Step 1: Write the failing test** `fitScale(600, 900, 1) === 1.5`, `fitScale(600, 900, 2) === 3`, zoom above 4 clamps to 4.
- [ ] **Step 2: Run** it. Expected: FAIL.
- [ ] **Step 3: Implement** `viewer-math.mjs`, then `viewer.js` (canvas render, `pdfjs.TextLayer` for selectable text, page number box, zoom buttons, re-render on resize), and the tracker changes. A password-protected or damaged PDF shows the message "This PDF cannot be opened" and keeps the tracker usable. If `openStore` rejects with `no-storage`, the Read button shows "Reading needs browser storage, which is blocked here".
- [ ] **Step 4: Verify in a real browser** with Playwright (chromium is installed): serve the repo root (`npx serve .`), open `/tools/lectern/`, choose the generated test PDF, click Read. Expected: page 1 canvas has non-zero size, text layer contains the text "Contents", zoom in changes canvas width, a password-protected PDF shows the message. Also run the earlier tests.
- [ ] **Step 5: Commit and push.**

### Task 5: Highlights and markers

**Files:**
- Create: `tools/lectern/overlay.js`
- Modify: `tools/lectern/viewer.js`, `tools/lectern/lectern.css`
- Test: uses `test-annotations.mjs` (already covers the logic); browser check by Playwright

**Interfaces:**
- Consumes: `createHighlight`, `createMarker`, `rectsFromSelection`, `updateAnnotation`, `annotationsForPage`, `COLORS`; `Store.putAnnotation`, `listAnnotations`, `deleteAnnotation`.
- Produces: `mountOverlay(pageEl: HTMLElement, ctx: { bookId, page, store, getAnnotations: () => Annotation[], onChange: () => void }): { render(): void }`. A toolbar (colour dots plus "Marker" mode) on the viewer. Selecting text and clicking a colour creates a highlight; Marker mode plus a click creates a marker at that fraction; clicking a highlight or marker offers "Delete" (and a colour change for highlights).

- [ ] **Step 1: Implement** overlay drawing from fractions (`left: x*100%` etc.), selection capture, marker and highlight create and delete, persisted through the store, reloaded on open.
- [ ] **Step 2: Verify in a real browser**: select a line, click yellow, reload the page and reopen the book. Expected: the highlight is still there with the same text; resize the window and zoom to 2x. Expected: it covers the same words (compare its bounding box to the matching text span before and after). Add a marker and delete it.
- [ ] **Step 3: Commit and push.**

### Task 6: Note blocks and problem links

**Files:**
- Modify: `tools/lectern/overlay.js`, `tools/lectern/viewer.js`, `tools/lectern/tracker.js`, `tools/lectern/lectern.css`
- Test: add cases to `test-annotations.mjs` for problem-link helpers below

**Interfaces:**
- Consumes: `createNote`, `updateAnnotation`, `notesForProblem`, `COLORS`.
- Produces: in `annotations.mjs`, `describeProblemLink(note: Annotation, problemKeys: Set<string>): { linked: boolean, label: string }` (`label` is `'No problem'` when `problemKey` is null, the key's label part when it is in the set, and `'Problem no longer in outline'` otherwise). Note block UI: "Note" mode plus a click creates a note at that spot; blocks have a title bar (drag to move), resize handle, six colour dots, a problem picker (from `getProblems()`), a delete button, and collapse to a coloured tab. The tracker's problem chips show a small count badge for linked notes; clicking it opens the Read view at the first linked note's page.

- [ ] **Step 1: Write failing tests** for `describeProblemLink` (three outcomes above).
- [ ] **Step 2: Run** it. Expected: FAIL.
- [ ] **Step 3: Implement** the helper, the note blocks and the tracker badge.
- [ ] **Step 4: Verify in a real browser**: create two notes in different colours on one page, move and resize one, link one to a problem, reload. Expected: both persist with colour, position and text; the problem chip shows a badge of 1; removing that problem from the outline leaves the note showing "Problem no longer in outline".
- [ ] **Step 5: Commit and push.**

### Task 7: Attachments

**Files:**
- Modify: `tools/lectern/overlay.js`, `tools/lectern/lectern.css`
- Test: browser check; store limits are already tested in Task 3

**Interfaces:**
- Consumes: `Store.putAttachment`, `getAttachment`, `listAttachments`, `deleteAttachment`, `MAX_ATTACHMENT_BYTES`.
- Produces: an "Attach" button on each note block (file picker, plus paste of an image from the clipboard). Images show as thumbnails (click to enlarge); other files show as a name with "Open" (opens through an object URL) and "Remove". Files over 25 MB are refused with "Too large (limit 25 MB)".

- [ ] **Step 1: Implement** attach, list, open, remove, and the size message; revoke object URLs on close.
- [ ] **Step 2: Verify in a real browser**: attach a PNG, a PDF and a txt file to one note, reload. Expected: all three are listed, the image thumbnail renders, "Open" opens the txt with its original content; a 26 MB file is refused; deleting the note removes its attachments (check with `store.listAttachments`).
- [ ] **Step 3: Commit and push.**

### Task 8: Backup and restore

**Files:**
- Create: `tools/lectern/backup.mjs`
- Modify: `tools/lectern/tracker.js` (Export and Import buttons use it)
- Test: `tools/lectern/tests/test-backup.mjs`

**Interfaces:**
- Consumes: `sanitizeState` (from `books.mjs`), `sanitizeAnnotation`, `mergeAnnotations`.
- Produces: `buildBackup(state, annotations: Annotation[], fingerprints: Record<string,string>, attachments: {id, annotationId, name, type, dataBase64}[] = []): object` (version 2, includes the attachments given) and `readBackup(raw: unknown): { state, annotations: Annotation[], fingerprints, attachments }`. Version 1 backups (no annotations) still import. `fingerprints` maps `bookId` to the PDF fingerprint, so re-adding the same PDF reattaches notes.

- [ ] **Step 1: Write failing tests**: a v1 backup reads back with empty annotations; `buildBackup` then `readBackup` round-trips a note and its fingerprint; an annotation with a bad `kind` is dropped; attachments are excluded unless passed in.
- [ ] **Step 2: Run** it. Expected: FAIL.
- [ ] **Step 3: Implement** the module and wire Export (checkbox "include attachments") and Import in the tracker. On import, annotations are merged with `mergeAnnotations`; notes for a book whose PDF is not stored yet wait until that PDF is added (matched by fingerprint).
- [ ] **Step 4: Run** all test files. Expected: every file prints "passed". Verify in a browser: export, clear site data, import, add the same PDF, open it. Expected: highlights and notes are back.
- [ ] **Step 5: Commit, push, and merge only after the owner approves.**

---

EPUB reading (spec stage 6) is a separate plan, written after this one ships, because it adds a new library (epub.js) and a different position model.
