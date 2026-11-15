# Study Resource Ingestion (foundation)

A repository-only, human-in-the-loop pipeline for turning lecture PDFs into traceable review material.

## Safety boundary

- This package writes only to an explicitly supplied output directory.
- It never edits course lessons, question banks, progress stores, generated exports, or deployment assets.
- It does not generate questions.
- Extracted text is source evidence, not approved teaching content. Every candidate remains `needs-review`.
- Source page numbers and a SHA-256 fingerprint are retained for traceability.

## Requirements

Node.js 22+ and Poppler command-line tools:
- `pdfinfo`
- `pdftotext`
- `pdfimages` (optional; used to inventory and extract embedded images)
- `pdftoppm` and `tesseract` (optional; enable OCR fallback for sparse/scanned pages)

On Debian/Ubuntu, install Poppler with `sudo apt-get install poppler-utils`. On Windows, install Poppler and ensure its `bin` directory is on PATH.

## Run

From `metallurgy-source/`:

```bash
node resource-ingestion/ingest.mjs --input ./resources/lecture.pdf --out ./resource-ingestion/output/lecture-2026 --course MT203 --topic T11
```

Optional mapping hints: `--subtopic "Single-screw extrusion"`, `--source-label "PST lecture 2026"`.

The output directory contains:
- `source-manifest.json`: source identity, hash, extraction tools, page count and image inventory.
- `knowledge-records.json`: page-scoped text blocks and conservative candidate classifications.
- `review-packet.md`: human review checklist and page-linked candidate inventory.
- `assets/`: extracted embedded PDF images, when Poppler's `pdfimages` is available.

## Extraction semantics

The first adapter uses Poppler's layout-preserving text extraction. Pages with fewer than 24 non-whitespace native-text characters are treated as sparse. When both `pdftoppm` and `tesseract` are installed, those pages are rendered at 220 DPI and OCR is used only when it returns more text than native extraction. The selected extraction method is recorded per page and in the source manifest. If either optional dependency is missing, OCR is skipped without failing ingestion.

Text is segmented into paragraphs, likely headings, equations and table-like rows. These are triage heuristics, not semantic validation. The pipeline does not validate equations or claim to understand diagrams. Image assets are extracted separately and linked to their source page when page metadata can be determined; otherwise they remain in the source image inventory for manual matching.

The next stages can add OCR and richer table/figure interpretation behind the same adapter contract. Do not promote records into lessons until a reviewer confirms their content, mapping, and source fidelity.
