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

## Findings and next implementation work

1. The current OCR selection rule (OCR character count > native character count) is too permissive. Add word-count and mean-confidence diagnostics, plus a conservative quality gate. Low-confidence pages must remain explicit exceptions; do not silently treat them as reliable text.
2. Keep equations, chemical formulae, units, table cells, and diagram labels in a higher-risk review class even when OCR confidence is high.
3. The current review packet still asks the user to inspect every candidate. This conflicts with the project's stated objective of reviewing exceptions rather than rechecking all extracted material. Introduce a risk-based exception queue while preserving page links, source hashes, and unverified status.
4. Preserve the distinction between image assets and soft masks. The real-PDF pilot confirms the image-number mapping strategy for all 721 genuine image entries.
5. Do not automatically modify lessons, question banks, learner progress, or generate questions. Any proposed content additions remain separately reviewable.

## Reproducibility

Audit outputs were generated locally from the Library source PDF. The source PDF and extracted assets are intentionally not added to Git. The current code's automated CI passing status is recorded separately; this audit is a real-document diagnostic, not a replacement for automated tests or human validation.
