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

## Human review and patch proposal

Create a decisions JSON file. Each decision must reference an existing record ID and use `approved`, `corrected`, or `rejected`. Approved/corrected records require a destination: `theory`, `illustration`, `worked-example`, or `reference`. Corrected records also require `correctedText`. Rejected records may include a `reviewerNote`.

Example:

```json
[
  { "recordId": "src-…", "status": "approved", "destination": "theory" },
  { "recordId": "src-…", "status": "corrected", "destination": "worked-example", "correctedText": "Verified wording from the source page." },
  { "recordId": "src-…", "status": "rejected", "reviewerNote": "Duplicate fragment" }
]
```

Run from `metallurgy-source/`:

```bash
node resource-ingestion/review.mjs --manifest ./resource-ingestion/output/lecture-2026/source-manifest.json --records ./resource-ingestion/output/lecture-2026/knowledge-records.json --decisions ./resource-ingestion/review-decisions.json --out ./resource-ingestion/output/lecture-2026/review
```

The command emits `review-results.json`, `proposed-content-patch.json`, and `proposed-content-patch.md`. These are proposals only. The tool does not edit course files, question banks, learner progress, or deployment assets. A separate human review and implementation step is required before any proposed addition is applied.

## Extraction semantics

The first adapter uses Poppler's layout-preserving text extraction. Pages with fewer than 24 non-whitespace native-text characters are treated as sparse. When both `pdftoppm` and `tesseract` are installed, those pages are rendered at 220 DPI and OCR is selected when it returns more text than native extraction. OCR output is separately quality-gated: a routine candidate needs at least 5 recognized words, mean Tesseract word confidence of at least 65, and no more than 35% of words below confidence 40. OCR can still be retained when it adds text but fails this gate; such pages are explicitly marked `review-required` and their records enter the exception queue. These thresholds are conservative pilot heuristics, not calibrated accuracy guarantees. The selected extraction method and quality diagnostics are recorded per page in the source manifest. If either optional dependency is missing, OCR is skipped without failing ingestion.

Text is segmented into paragraphs, likely headings, equations and table-like rows. These are triage heuristics, not semantic validation. The pipeline does not validate equations or claim to understand diagrams. Image assets are extracted separately and linked to their source page when page metadata can be determined; otherwise they remain in the source image inventory for manual matching.

OCR fallback and the human review/proposed-patch stage are implemented. Rich table/figure interpretation and applying approved patches remain separate future work. Do not promote records into lessons until a reviewer confirms their content, mapping, and source fidelity.


## Source page previews

Ingestion renders a focused set of original PDF pages at 120 DPI for visual verification. Selection includes pages with equation/table candidates, embedded figure references, and extraction/OCR exceptions. Previews are saved under `assets/pages/` and listed in `source-manifest.json` and `review-packet.md`. A preview is a review aid only; it does not validate extracted text or approve a record. If `pdftoppm` is unavailable, ingestion continues and records the skipped status in the manifest.
