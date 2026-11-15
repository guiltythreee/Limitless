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
- `pdfimages` (optional; used only to inventory embedded images)

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

The first adapter uses Poppler's layout-preserving text extraction. It segments pages, paragraphs, likely headings, equations and table-like rows. It does not claim to understand diagrams or validate equations. Image assets are extracted separately and linked to their source page when page metadata can be determined; otherwise they remain in the source image inventory for manual matching.

The next stages can add OCR and richer table/figure interpretation behind the same adapter contract. Do not promote records into lessons until a reviewer confirms their content, mapping, and source fidelity.
