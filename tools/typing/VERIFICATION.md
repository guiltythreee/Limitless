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

## 6. Tests — 86 total, all passing on Node v24.21.0

Run: `cd tools/typing/tests && npm install && npm test` (only devDependency: jsdom;
EPUB fixtures are built in memory, no binary fixtures in the repo).

| File | Tests | Covers |
| --- | --- | --- |
| `blocks.test.mjs` | 20 | PDF regression: line extraction, heading detection, hyphen re-join, page packing, chapter detection, levels, accuracy rounding, XP formulas and caps, streaks, reward ids, pay-once, text signatures. |
| `epub-pure.test.mjs` | 23 | Pure EPUB helpers: byte hashing, TOC href resolution (`../`, fragments, queries, escapes), spine lookup, XHTML→blocks walking (lists, tables, `<br>`, skipped subtrees, image-only pages, parser-error documents, anchor ids), section packing, long-paragraph splitting, chapter lists, friendly error mapping. |
| `epub-jsdom.test.mjs` | 17 | The real epub.js + JSZip running in jsdom against synthetic EPUBs: section-per-chapter, spine order over file order, long chapters split with every character preserved, unicode end to end, broken/missing files, TOC anchors, subfolder NCX, EPUB3 nav, duplicate-import hashes, `book.destroy()` on success and failure paths. |
| `sections.test.mjs` | 10 | Pure required/optional classification: front and back matter optional, real chapters (incl. `12. Kalidasa`, `I. The Palace`, bare `IV`/`12`) required, articles ignored, whole words only, untitled sections required, `defaultReq`, `withRequirements` keeping a reader's choice, and `tidyChapters`/`evenChapters` carrying the flag. |
| `nav.test.mjs` | 9 | Pure swipe helpers: left→right is back, right→left is forward only when there is somewhere to go, vertical/diagonal drags and short drags ignored, sideways must clearly beat vertical, conservative threshold, and `homeHref` for the shell link / standalone `tools/typing` / nowhere. |
| `app-boot.test.mjs` | 7 | The whole page booting in jsdom: sample typing earns 0 XP and writes no book record; an EPUB imported through the real file input pays XP once into `localStorage["bookkeys:game"]`; finishing the same section again pays nothing and the total does not move; a one-page PDF built byte-by-byte inside the test imports through the same input (showing "Page", not "Section") and typing it pays XP; front matter defaults to optional and the book completes after typing only its required chapters; a Required/Optional change is saved, restored on reopen, and pays nothing again; an all-optional book is handled explicitly, still pays page XP (once), and pays no book bonus. |

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
- **The IndexedDB library path** (`addFiles`/`openLibBook` for EPUBs: validate, store
  as `fmt:"epub"`, dedupe by content hash, cover thumbnail) cannot run under jsdom
  (no IndexedDB, and `epubCoverOf` needs a real image decode). It was reviewed by
  inspection — the EPUB branch mirrors the existing PDF branch, and its failure paths
  only ever skip a file with a friendly reason — but it was not executed here.
- **Real-store EPUB variety.** Fixtures are synthetic (NCX, nav, anchors, subfolders,
  broken files). DRM-protected or exotic books were not tested; epub.js 0.3.93 is the
  same parser many readers use, but real-world coverage is a manual step.
- **PDF visual rendering** is untouched and untested here; only text extraction and
  the typing flow were exercised (plus the offline helper suite).

## 9. Final results

- `node --test` in `tools/typing/tests`: **86 tests, 86 pass, 0 fail, 0 skipped** (64 from
  the EPUB work plus 22 for the required/optional and swipe work in §10–§13).
- Two commits on `main` (checkpoint `77b79be` + this report's commit); nothing pushed.
- `bookkeys.html` is 5,464,390 bytes at the EPUB checkpoint; the required/optional and
  swipe work in §10 grew it further (see §13).
- Known cosmetic note: malformed chapter documents make epub.js's content hooks log
  "No Element Provided" in the test output; the app's per-item catch turns those into
  skipped items, so it is noise, not a failure.

## 10. Required chapters and optional sections

Bookkeys detects chapters as before; each section now also carries a `req` flag
(required / optional) that says whether it must be typed to *finish the book*.

- **Defaults.** A pure classifier (`sectionRequired`, `SECTION_OPTIONAL`,
  `sectionBody`, `defaultReq`) treats front and back matter as optional — cover, title
  page, copyright, contents, dedication, epigraph, foreword, preface, introduction,
  prologue, epilogue, afterword, appendix/appendices, glossary, bibliography,
  references, sources, endnotes/notes/footnotes, index, acknowledgements, author's
  note, about the author, colophon, translator's/editor's note, and so on — and every
  other heading, including numbered ones (`1. Kalidasa`, `12. Rosa`) and Roman-numeral
  parts (`I. The Palace`), as required. A leading numbering is stripped before the name
  is matched, so `12. Notes` is still back matter, and a leading "the/a/an" is ignored,
  so `The Index` is too. Untitled sections (an even split) and the synthetic
  `Beginning` entry are handled explicitly: an even split is required, `Beginning` is
  front matter. These are defaults, never rules.
- **Controls.** Each row in the Chapters panel has a Required/Optional toggle
  (`aria-pressed`, dashed border and dimmed text on optional rows); the toolbar label
  appends " (optional)" for the current section and a compact `12/45 required` count;
  the panel shows `12/45 required chapters completed · N optional sections` (or, when
  nothing is required, "Every section is optional, so nothing is required to finish
  this book. XP still counts for every page you type."). Bulk buttons **All required**,
  **All optional** and **Use defaults** re-classify the whole list at once. `Go`,
  `Remove`, `Add chapter at this page`, `Split in even sections` and `Detect again`
  are unchanged.
- **Completion and rewards.** `requiredRanges()` yields the page ranges inside required
  chapters and `gameProgress` completes the book when every one of those ranges is
  typed or empty; optional pages are free to skip and never lower the required
  percentage. With no chapter list yet the whole book still counts, so behaviour before
  detection is unchanged. **Zero required sections is handled explicitly**: the book
  never reports itself complete and pays no book bonus (the anti-farming decision),
  while page and chapter XP keep working. Reward amounts and formulas are unchanged
  (`bookXp` still follows every page typed); reward ids are keyed by start page / book
  key, so flipping a section's status can never pay twice, and a repeat finish of an
  optional section still shows "No XP, you finished this page before."
- **Persistence.** The saved chapter record goes from `CHAP_VER` 2 to 3 and stores
  `req` per entry. On load, records with `v === 2`, `v === 3` or `src === "edited"` are
  accepted; missing flags are back-filled from the heading with the same defaults, then
  re-saved. Older data therefore behaves exactly as before until the reader changes
  something. The backup import/merge path keeps `req` too.

## 11. Two-finger swipe to the Limitless homepage

- `swipeIntent(dx, dy, i, max)` is the whole decision and is pure: a mostly-vertical
  drag is a scroll; a drag shorter than `SWIPE_MIN` (110 px, conservative) is ignored;
  left→right is **back**; right→left is **forward only when there is somewhere to go**.
- `navBackOrLeave()` walks back through Bookkeys' own history first, then closes an open
  panel, and only then leaves; the trackpad wheel handler now uses the same rule, so
  touch and trackpad behave alike. Forward stays `navForward()`.
- `leaveForHome()` reads the shell's own "Back to Limitless" link when the page is
  framed (`index.html`'s `a.brand`/`.nav-links a`, resolved by `homeHref`), falls back
  to the site root (`../../`) only when the page is served from `/tools/typing/`, and
  does nothing at all in a bare copy — it never throws. It targets `window.top`, so in
  the iframe it navigates the whole shell.
- Guarding: two touches **exactly**, not inside an input/textarea/select/contenteditable
  (so typing, clicking and text selection cannot trigger it), horizontal travel must be
  at least 1.5× the vertical, and `preventDefault()` is called only once a swipe is
  committed, to stop the browser also acting on the drag. No swipe starts from a single
  finger, so one-finger scroll, pinch-zoom and reader gestures are untouched.

## 12. What §10–§11 did NOT verify (honest gaps)

- **Real touchscreen or trackpad.** jsdom has no touch events and no trackpad; the
  gesture *decision* is covered purely (`nav.test.mjs`) but the DOM listeners, the
  `preventDefault` timing and the actual gesture on glass were not exercised here. A
  manual pass on a phone is required.
- **The iframe shell / limit of cross-origin.** `leaveForHome`'s parent-link read only
  works same-origin (which `index.html` is). The shell itself was not booted in a live
  browser here, so the framed exit is verified by inspection of `index.html`'s markup
  and by the pure `homeHref` tests, not end-to-end.
- **`window.top` navigation under CSP/sandbox.** The shell's CSP does not sandbox the
  iframe, so a top-level navigation is allowed; this was reasoned, not run.
- **Chapter classification against real books.** The keyword list is deliberately
  conservative; unusual front-matter headings that are not on it default to required
  and can be switched off by hand, or by **Use defaults** after renaming.

## 13. Files changed by §10–§11 (not committed, not pushed)

- `tools/typing/bookkeys.html` — the classifier, the `req` flag and its persistence,
  required-only completion, the panel controls and progress line, and the swipe/exit
  code (region `/*NAV-START*/`…`/*NAV-END*/`).
- `tools/typing/tests/sections.test.mjs`, `tools/typing/tests/nav.test.mjs` — new pure
  suites.
- `tools/typing/tests/app-boot.test.mjs` — three whole-page tests.
- `tools/typing/tests/helpers.mjs` — `helperSource()` now also extracts the NAV region.
- Recoverable backups (outside the repo, nothing overwritten):
  `C:\Users\DELL\bookkeys-backups\` — `bookkeys-baseline-20261018.html` (before any
  change), `bookkeys-ch1-required-sections-*.html` and `bookkeys-ch2-swipe-*.html`.
