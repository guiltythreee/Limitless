# Lectern — design

Lectern is the renamed Book Tracker (`tools/book-tracker/` becomes `tools/lectern/`). It keeps the problem tracking
that exists today and adds a reading view with highlights, markers, colour note blocks and attachments.

## Intent and why

The owner reads several books and solves their problems. Today the tracker only lists problems. They want to read the
book itself in the same place, mark things as they read, and keep their own notes where they happened, so that nothing
has to be searched for later. Notes made while solving should be seen next to that problem, and notes made while
reading should be seen on the page.

## Goals

- Read a PDF inside Lectern (stage 1) and an EPUB (stage 2).
- Highlight text in several colours.
- Drop a marker at any spot to come back to.
- Place many note blocks anywhere on a page; each has its own colour, can be moved, resized, edited and deleted.
- Link a note to a problem; the problem list shows that problem's notes, and the page shows the same notes.
- Attach screenshots, PDFs and text files to a note (about 25 MB per file).
- Everything stays on the device. Nothing is uploaded.

## Non-goals

- No cloud sync or Supabase in this work.
- No editing or re-saving the PDF itself (annotations live beside it, not inside it).
- No OCR for scanned books.
- No multi-device syncing of book files.

## Anti-goals (failure even if it "works")

- Losing the owner's existing books or ticks when the tool is renamed or upgraded.
- Notes that drift off their spot when the window is resized or zoomed.
- Pages that are slow to turn on a phone.

## Constraints

- Plain static files, ES modules, minimal HTML (`index.html` is a shell; the page is built in JS). Same as today.
- No build step. Libraries are copied into `vendor/`.
- Existing localStorage key `limitless.bookTracker.v1` is kept so current data survives the rename.
- The repo's deploy ignores `**/*.test.*`, `**/test-*.mjs`; new tests follow the `tests/test-*.mjs` pattern.
- Node-testable logic is kept free of the DOM (as `books.mjs` and `detect.mjs` are).

## Approaches considered

1. **pdf.js canvas + text layer, with our own overlay layer (chosen).** pdf.js (already in `vendor/`) draws the page and
   gives a transparent, selectable text layer. A second layer on top holds highlights, markers and note blocks, all
   positioned in page-relative units, so they stay put at any zoom. Trade-off: we write the overlay ourselves, but we
   control every behaviour and it works the same on phone and desktop.
2. **The browser's built-in PDF viewer in an iframe.** Quick, but a page cannot read selections or place anything on
   top of it. Rejected: it cannot do highlights or notes.
3. **Notes in a side panel only (no placing on the page).** Simplest, but the owner asked for notes "anywhere", seen
   while reading. Rejected as the main design; the side panel is still used as a list of all notes.

For ebooks (stage 2): use **epub.js**, which renders a reflowing book and gives each position a stable address
(a CFI) plus built-in highlights. Reflowing text cannot hold x/y positions, so on ebooks a note pins to a text position.

## Decisions

Stated by the owner:
- Name: **Lectern**. ("Anvil" is reserved for a future metallurgy tools section.)
- Many note blocks, any colour, placed anywhere, visible while reading or solving.
- Attachments: screenshots, PDF, txt and similar.
- Order: PDF first, then ebooks.

The builder's calls (mine, open to change):
- **Where things are stored.** Book files and attachments go in IndexedDB (database `lectern`). Problem ticks and book
  outlines stay in localStorage as today. Annotations (highlights, markers, notes) go in IndexedDB too, one record each.
- **Positions.** A PDF annotation is stored as page number plus position as a fraction of the page (0 to 1), so zoom
  and window size do not matter. A highlight stores its text and its line rectangles.
- **Backup.** Export writes ticks, outlines and all annotations (not the book files or attachments, which are large).
  Each book is recognised by its PDF fingerprint, so re-adding the same PDF re-attaches its notes. Attachments are
  exported only if the owner chooses "include attachments" (they are base64 in the JSON).
- **Attachment limit.** About 25 MB per file; larger files are refused with a clear message.
- **Linking a note to a problem.** By the same problem key the tracker already uses (chapter, section, label), so it
  survives outline edits.
- **Rename.** `tools/book-tracker/` moves to `tools/lectern/`. The old URL keeps working through a small redirect page.
  The hub card and the home sidebar are renamed.

## Stages

1. Rename to Lectern (no behaviour change, tests green, redirect from the old URL).
2. PDF reading view: open a stored PDF, page navigation, zoom.
3. Highlights and markers.
4. Note blocks (colour, move, resize, edit, delete) and linking to problems; notes shown in the problem list.
5. Attachments.
6. EPUB reading with the same features.

Each stage is committed and pushed to a branch as soon as it works, before the next begins.

## Left to the builder

- Exact look of the reading view (use the existing gold theme from `theme.css`).
- Note block default size and the colour palette (suggest 6 colours).
- How a note is collapsed when it covers text (suggest: collapse to a small coloured tab).
