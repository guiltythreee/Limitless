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
| 156 | 17 | 214 | 66.0 | Exception-prone diagram labels |
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

## Runtime audit correction

A code-path inspection found that the first implementation placed Tesseract's `tsv` config argument before the `--psm 3` options. That ordering is invalid for the Tesseract CLI and could turn a successful plain-text OCR attempt into a page-level failure when confidence parsing ran.

The ingestion code now builds the invocation as `tesseract <image> stdout --psm 3 tsv`, with a unit test locking the argument order. The corrected command was executed successfully against the source PDF's page 35 and returned a TSV header plus word-level confidence rows. The full JavaScript ingestion command still needs a fresh end-to-end run against the source PDF after this correction; CI runs the automated ingestion tests, not this 212-page source PDF.

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

All seven renders were produced successfully as PNG files. This validates the PDF renderer, page selection targets, and output mode against the source. It is a manual Poppler spot check, not yet a full execution of the JavaScript ingestion CLI; the latter still needs to be run end-to-end and its manifest/packet inspected.

## Remaining work

1. Run the current JavaScript ingestion CLI end-to-end against this exact PDF and inspect the generated manifest, preview plan, record counts, and review packet. Do not claim end-to-end completion until this succeeds.
2. Validate the new confidence gate on additional lecture PDFs before treating its thresholds as calibrated defaults.
3. Improve diagram/figure understanding and figure-to-topic relevance; page mapping alone does not interpret an image.
4. Improve risk rules for chemical formulae, units, table cells, and diagram labels, which can remain high-risk even when OCR confidence is high.
5. Keep the image/soft-mask distinction and source-page mapping intact.
6. Do not automatically modify lessons, question banks, learner progress, or generate questions. Any proposed content additions remain separately reviewable.

## Reproducibility

Audit outputs were generated locally from the Library source PDF. The source PDF and extracted assets are intentionally not added to Git. The current code's automated CI passing status is recorded separately; this audit is a real-document diagnostic, not a replacement for automated tests or human validation.
