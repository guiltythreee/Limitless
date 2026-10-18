# Bookkeys EPUB support — verification report

Final state of the EPUB work, with what was verified, what was fixed, and what this
environment could not check. Every claim below is backed by the test suite in
`tools/typing/tests` or is marked explicitly as unverified.

## 1. What changed

- `tools/typing/bookkeys.html` — all application changes (EPUB region, wiring, copy,
  the two inlined libraries). `tools/typing/index.html` (the Limitless iframe shell) is
  untouched: it embeds `bookkeys.html` as a plain same-origin iframe, and the app
  contains no cross-frame code, so the framed case reduces to the standalone case.
- `tools/typing/epubjs.LICENSE.txt` — full license text for the epub.js/FuturePress
  code. JSZip's own MIT/GPLv3 notice is preserved inline inside its `<script>` block.
- `tools/typing/tests/` — the test suite (see §6). The standalone vendor files
  (`epub.min.js`, `jszip.min.js`) were deleted after inlining: each library now lives
  in exactly one place, inside the page, next to the already-embedded pdf.js.

## 2. Content model

Both formats feed one model: an ordered list of *sections*, each an array of blocks
`{t: "h" | "p", text}`.

- PDF: text items → visual lines (heading heuristics, hyphen re-joining, column
  handling) → blocks → one section per page (existing behaviour, unchanged).
- EPUB: spine items in spine order → XHTML walk (headings/paragraphs, list items,
  table cells; scripts, styles, svgs and the nav document excluded) → blocks packed
  into sections of about 900 characters. A block is never cut in half, so no word or
  sentence lands across a section boundary. There are no fake pages.
- Chapters: PDFs from "Chapter N" headings or even chunks; EPUBs from the book's own
  table of contents — NCX or EPUB3 nav, including `#anchor` entries, resolved to the
  section that holds that heading. The UI says "Section" instead of "Page" for EPUBs.

## 3. Libraries and offline guarantees

- JSZip 3.10.1 and epub.js 0.3.93 are inlined as `<script id="jszip-lib">` and
  `<script id="epubjs-lib">` under the page's CSP. No CDN, no runtime fetch, no
  service worker. epub.js opens buffers with `replacements: "none"`, so it creates no
  blob URLs and touches no network path.
- Parsing happens in the page from local bytes only. Nothing about a user's book
  leaves the machine.

## 4. Identity, duplicates, anti-abuse

- An EPUB's identity is a double FNV-style hash of the file bytes → game key
  `"f:"+hash`. Renaming the file keeps progress; two different books with the same
  title stay separate. PDFs keep the pdf.js fingerprint (existing behaviour).
- Re-importing identical bytes yields the same key, so the finished-page record is
  shared and a repeat finish shows "No XP, you finished this page before." — the
  saved XP total does not move (verified end-to-end in `app-boot.test.mjs`).
- All XP rules are shared and format-blind: the existing `pageXp`/`chapterXp`/
  `bookXp` formulas and caps, once-only reward ids (`payable`), the 30 ms/char
  anti-paste guard, and `isBook` gating so sample and pasted text never pay.

## 5. Failure handling

- Not a zip, missing container, missing package file → friendly "not a valid EPUB,
  or it is damaged" style errors (same wording pattern as PDFs).
- One missing or malformed spine item is skipped; the rest of the book imports.
- Image-only chapters and chapters with no text are skipped; a book with no readable
  text at all reports the empty-book message instead of pretending to have pages.
- Unicode: NFC normalization, ligature and smart-punctuation folding, CJK and emoji
  kept, surrogate pairs typed as one box.

## 6. Tests — 64 total, all passing on Node v24.21.0

Run: `cd tools/typing/tests && npm install && npm test` (only devDependency: jsdom;
EPUB fixtures are built in memory, no binary fixtures in the repo).

| File | Tests | Covers |
| --- | --- | --- |
| `blocks.test.mjs` | 20 | PDF regression: line extraction, heading detection, hyphen re-join, page packing, chapter detection, levels, accuracy rounding, XP formulas and caps, streaks, reward ids, pay-once, text signatures. |
| `epub-pure.test.mjs` | 23 | Pure EPUB helpers: byte hashing, TOC href resolution (`../`, fragments, queries, escapes), spine lookup, XHTML→blocks walking (lists, tables, `<br>`, skipped subtrees, image-only pages, parser-error documents, anchor ids), section packing, long-paragraph splitting, chapter lists, friendly error mapping. |
| `epub-jsdom.test.mjs` | 17 | The real epub.js + JSZip running in jsdom against synthetic EPUBs: section-per-chapter, spine order over file order, long chapters split with every character preserved, unicode end to end, broken/missing files, TOC anchors, subfolder NCX, EPUB3 nav, duplicate-import hashes, `book.destroy()` on success and failure paths. |
| `app-boot.test.mjs` | 4 | The whole page booting in jsdom: sample typing earns 0 XP and writes no book record; an EPUB imported through the real file input pays XP once into `localStorage["bookkeys:game"]`; finishing the same section again pays nothing and the total does not move; a one-page PDF built byte-by-byte inside the test imports through the same input (showing "Page", not "Section") and typing it pays XP. |

## 7. Bugs the tests found and fixed

Both were real app bugs, found by the suite and fixed in `bookkeys.html`:

1. **Nested lists lost their own words.** An `<li>` (or `<div>`) containing a
   sub-list dropped its direct text during the XHTML walk. The container branch now
   keeps the element's own text nodes (`epubLeadText`) before descending.
2. **Table-of-contents titles never reached the UI.** `book.opened` resolves before
   epub.js finishes loading navigation, so chapter labels and `#anchor` maps were
   always empty. A new `epubWaitNav` waits for navigation (capped at 2.5 s, since a
   broken nav document never settles; the rejection is swallowed) before parsing.

Other failures during development were test/fixture bugs (spine order in the fixture
builder, close-after-target packing expectations, wrong signature guesses in helper
tests); those were fixed on the test side to match the app's documented semantics.

## 8. What this environment could NOT verify (honest gaps)

- **Real browser / Electron run.** No GUI browser exists here. Everything ran headless
  in jsdom, which needed shims for APIs every real browser has (canvas rasterizing,
  `structuredClone`, `TextDecoder`/`TextEncoder`, `ReadableStream`, `Blob.arrayBuffer`)
  and a hand-stepped clock in place of waiting out the anti-paste guard. A manual smoke
  test in a real browser is still recommended: open `index.html`, import a real EPUB,
  type, reload, check resume and the chapter panel.
- **The iframe shell in a live browser** was not booted; see §1 for why the case
  reduces to the verified standalone one.
- **Real-store EPUB variety.** Fixtures are synthetic (NCX, nav, anchors, subfolders,
  broken files). DRM-protected or exotic books were not tested; epub.js 0.3.93 is the
  same parser many readers use, but real-world coverage is a manual step.
- **PDF visual rendering** is untouched and untested here; only text extraction and
  the typing flow were exercised (plus the offline helper suite).

## 9. Final results

- `node --test` in `tools/typing/tests`: **64 tests, 64 pass, 0 fail, 0 skipped.**
- Two commits on `main` (checkpoint `77b79be` + this report's commit); nothing pushed.
- `bookkeys.html` is 5,464,369 bytes with both libraries embedded.
- Known cosmetic note: malformed chapter documents make epub.js's content hooks log
  "No Element Provided" in the test output; the app's per-item catch turns those into
  skipped items, so it is noise, not a failure.
