# MT203 real-PDF ingestion audit

Date: 2026-11-15
Source: `MT203 – PST 2026(1).pdf`
Source file SHA-256: audit performed against the Library file (9,508,248 bytes); source PDF is not committed to this repository.
PDF metadata title: `MT255 – Polymer Science and Technology`
Page count: 212

## Results

- Native layout-preserving extraction produced 65,879 non-whitespace characters.
- 19 pages fell below the current 24-character sparse-page threshold.
- All 19 sparse pages were rendered at 220 DPI and OCR-tested successfully.
- OCR produced more characters than native extraction on all 19 pages, so the current implementation would select OCR for all 19.
- The image inventory contained 721 genuine `image` rows.
- `pdfimages -png` extracted 759 files: 721 genuine images plus 38 soft-mask files.
- All 721 genuine image entries matched their original PDF image numbers and source pages; image-bearing content appeared on 118 of 212 pages.

## OCR diagnostic sample

Mean word confidence is from Tesseract TSV output. It is a routing signal, not a guarantee of semantic or scientific accuracy.

| PDF page | Native chars | OCR chars | Mean word confidence | Assessment |
|---:|---:|---:|---:|---|
| 31 | 0 | 311 | 85.1 | Strong OCR candidate |
| 35 | 23 | 66 | 41.2 | Exception: noisy OCR |
| 45 | 0 | 379 | 83.4 | Strong OCR candidate |
| 49 | 0 | 679 | 95.2 | Strong OCR candidate |
| 50 | 13 | 649 | 79.3 | OCR candidate; inspect table symbols |
| 63 | 20 | 189 | 69.6 | OCR candidate; inspect equations |
| 72 | 16 | 584 | 84.4 | Strong OCR candidate |
| 102 | 16 | 219 | 38.8 | Exception: formula-heavy, noisy OCR |
| 141 | 13 | 91 | 96.1 | Strong OCR candidate |
| 145 | 13 | 47 | 94.0 | Strong OCR candidate |
| 152 | 12 | 415 | 95.6 | Strong OCR candidate |
| 153 | 3 | 365 | 85.0 | OCR candidate; inspect equation/units |
| 154 | 0 | 456 | 84.1 | OCR candidate; inspect table values |
| 156 | 17 | 214 | 66.0 | OCR candidate; inspect diagram labels |
| 171 | 21 | 162 | 50.4 | Exception: noisy diagram labels |
| 178 | 19 | 304 | 59.6 | Exception: machinery diagram labels |
| 194 | 19 | 55 | 95.2 | Strong OCR candidate |
| 201 | 16 | 308 | 83.3 | OCR candidate; inspect diagram labels |
| 212 | 16 | 194 | 60.2 | Exception: recycling diagram labels |

## Implemented on the isolated feature branch

The audit exposed a weakness in character-count-only OCR selection. The ingestion pipeline now records Tesseract TSV word counts, mean word confidence, low-confidence word counts, and a quality status.

The conservative OCR quality gate marks a page as a routine OCR candidate only when:
- OCR yields more non-whitespace characters than native extraction;
- at least 5 words are recognized;
- mean word confidence is at least 65; and
- no more than 35% of recognized words have confidence below 40.

The real-PDF measurements classify 14 of the 19 sparse pages as routine OCR candidates and 5 as review-required exceptions (pages 35, 102, 171, 178 and 212). OCR text is still retained for exception pages when it improves on native extraction, but the page and its records are flagged for focused review.

The review packet now prioritizes exception records (low-confidence OCR, equations and table rows) rather than dumping every candidate into the main checklist. Routine records and page-mapped visual references remain available in the complete JSON inventory. Routine means lower extraction risk, not verified teaching content: every record remains unapproved until an explicit review decision. Image references are separately triaged so hundreds of figures do not flood the text exception queue.

OCR failures are now captured as page-level exceptions rather than aborting the entire PDF ingestion run.

A second real-source audit exposed over-triage from treating every wide-gap line as a table exception: side-by-side comparison slides (for example, homopolymer vs copolymer) were entering the same queue as actual data tables. The classifier now uses page-level table context (table captions and known column-header patterns) before assigning table candidates high-priority status. Comparison slides remain in the record inventory and still trigger a source-page preview, but no longer flood the exception queue. Captioned OCR tables, including the permeability table on page 154, are now explicitly routed to focused review.

## Runtime audit correction

A code-path inspection found that the first implementation placed Tesseract's `tsv` config argument before the `--psm 3` options. That ordering is invalid for the Tesseract CLI and could turn a successful plain-text OCR attempt into a page-level failure when confidence parsing ran.

The ingestion code now builds the invocation as `tesseract <image> stdout --psm 3 tsv`, with a unit test locking the argument order. The corrected command was executed successfully against source PDF page 35 and returned the TSV header plus word-level confidence rows. The full JavaScript ingestion CLI has now also completed end-to-end against the exact 212-page source PDF; its output was inspected independently of CI (see the run results below).

The source-page preview planner also now selects pages with equation/table candidates, embedded figure references, or extraction exceptions. Since the PDF has figure assets on 118 pages, the preview set will include at least those 118 pages; these are optional visual references, not 118 mandatory manual approvals.

## Source-page preview spot check

The seven high-risk/reference pages identified during the earlier visual audit were rendered directly from this same PDF with Poppler at 120 DPI using the same single-page PNG output mode intended by the preview implementation:

| PDF page | Visual content confirmed |
|---:|---|
| 36 | Number-, weight-, and z-average molecular-weight equations and variable definitions |
| 152 | Polymer permeability definition, transport stages, and influencing factors |
| 153 | Permeability coefficient, solubility coefficient, and the relation `P = D·S` with units |
| 154 | Permeability data table; individual values still require visual verification before reuse |
| 178 | Single-screw extruder diagram and component labels |
| 194 | Blown-film extrusion diagram |
| 201 | Injection-moulding machine and mould/cross-section diagrams |

All seven renders were produced successfully as PNG files. This initial spot check validated the PDF renderer and selected page targets.

## Latest JavaScript CLI end-to-end run

The committed `ingest.mjs` at code commit `5b2beffcdbb416c910209e0ee092fa989c9566c7` was run locally against the exact source PDF. The source file in the saved validation snapshot was independently compared with the Git blob at that commit; the blob SHA matched exactly (`86760a8191fe3be446b6cafbf3f0637a5865d277`). The PDF's SHA-256 matched the recorded source hash.

Command (run from the isolated working environment):

```bash
node resource-ingestion/ingest.mjs \
  --input "MT203 – PST 2026(1).pdf" \
  --out "./resource-ingestion/output/mt203-pst-2026" \
  --course MT203 \
  --topic "Polymer Science and Technology"
```

Observed result:

| Output/check | Result |
|---|---:|
| PDF pages | 212 |
| Knowledge records | 2,449 |
| Unique record IDs | 2,449 |
| Sparse pages processed by OCR | 19 |
| OCR candidates | 14 |
| OCR review-required pages | 5 (35, 102, 171, 178, 212) |
| OCR command/page failures | 0 |
| Genuine image references mapped | 721 |
| Distinct pages containing mapped images | 118 |
| Extracted image files | 759 (721 images + 38 soft masks) |
| Source-page previews planned | 157 |
| Source-page previews generated | 157 |
| Preview failures or missing preview files | 0 |

The generated `source-manifest.json`, `knowledge-records.json`, and `review-packet.md` were parsed and checked. Every record remains `needs-review` with `confidence: unverified`; manifest approval status is `unreviewed`. Record IDs are unique, all image references resolve to existing assets, all 158 preview paths resolve, all five OCR exception pages appear in the preview plan, and the seven high-risk pages (36, 152, 153, 154, 178, 194, 201) are included. The page-36 molecular-weight equations, page-154 permeability table, page-178 single-screw extruder, and page-201 injection-moulding diagrams were visually opened and checked against the original PDF.

The contextual table-triage change reduced the focused exception queue from 413 records across 77 pages on the first run to 269 records across 39 pages on the latest run (144 fewer records, about 35%), without removing any source records. Ambiguous comparison layouts remain tagged as table candidates in the complete inventory and continue to receive page previews; they are simply not all promoted to high-priority exceptions. The page-154 OCR table is now a table candidate and an exception.

The review CLI was also smoke-tested against the real 2,449-record inventory with an empty decision set. It emitted all three review artifacts, proposed zero additions, rejected zero records, and correctly retained all 2,449 IDs as unreviewed. The patch remained `proposed-not-applied` with every safety flag false. No approval/rejection decisions were invented for the user.

The generated output is a local validation artifact and is intentionally not committed to the repository: it contains 759 extracted image files and 158 page renders. The source PDF is also not committed. No lesson, question bank, learner progress, production export, or deployed asset was modified.

This closes the full-PDF CLI execution milestone. It does not approve extracted content or calibrate the OCR thresholds for other lecture PDFs.

## Remaining work

1. Validate the OCR confidence gate on additional lecture PDFs before treating its thresholds as calibrated defaults.
2. Improve diagram/figure understanding and figure-to-topic relevance; page mapping alone does not interpret an image.
3. Improve risk rules for chemical formulae, units, table cells, and diagram labels, which can remain high-risk even when OCR confidence is high.
4. Keep the image/soft-mask distinction and source-page mapping intact.
5. Do not automatically modify lessons, question banks, learner progress, or generate questions. Any proposed content additions remain separately reviewable.

## Reproducibility

Audit outputs were generated locally from the Library source PDF. The source PDF and extracted assets are intentionally not added to Git. The current code's automated CI passing status is recorded separately; this audit is a real-document diagnostic, not a replacement for automated tests or human validation.


## Additional local renderer and image-mapping validation

A second direct Poppler validation was run against the exact source PDF after the previous spot check:

- The image inventory has 759 sequential entries numbered 0–758, comprising 721 `image` rows and 38 `smask` rows.
- `pdfimages -png` produced 759 sequentially named files. Matching the filename sequence to the inventory mapped all 721 genuine image files to their source pages and left exactly the 38 soft-mask files unmapped as independent figure records.
- The 721 genuine image rows occur on 118 distinct pages.
- The 120-DPI, single-page preview operation was run for all 118 figure-bearing pages. All 118 PNGs were produced with no per-page renderer failures. Combined preview size was 39.7 MiB.
- The direct renderer-only preview check was split across two local execution windows because the first command window reached its execution limit after 85 pages. The remaining 33 pages completed in 14.9 seconds. This renderer-only check is distinct from the later full JavaScript CLI run, which generated 158 previews.
- The independent `pdfimages -png` extraction completed in 23.7 seconds.

These direct Poppler checks validate source image numbering, soft-mask exclusion, page coverage, and preview output volume. The separate full JavaScript CLI execution described above completed successfully and validated OCR orchestration, record creation, manifest writing, preview generation, and review-packet assembly. The saved snapshot preserves its source files and outputs.
