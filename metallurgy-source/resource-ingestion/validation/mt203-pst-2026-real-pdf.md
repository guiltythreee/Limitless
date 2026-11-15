# Real-source validation: MT203 Polymer Science and Technology

**Validation status:** latest committed JavaScript ingestion CLI completed end-to-end against this source PDF; generated outputs inspected; content remains unapproved  
**Course mapping:** MT203 (confirmed by the user; the source filename is a legacy naming error)  
**Source filename:** `MT203 – PST 2026(1).pdf`  
**Source SHA-256:** `ba86baeb56d8bae0a0cd875cd1e4b63eac5cf11cb502d9e84e5ed52cc1f6e546`  
**PDF metadata title:** `MT255 – Polymer Science and Technology` (legacy embedded metadata; not used as the course mapping)  
**Pages:** 212

## Extraction checks

- Poppler reported 212 pages; text extraction returned 212 page segments.
- 19 pages fell below the native-text threshold. Direct Poppler/Tesseract diagnostics were run against all 19 sparse pages and produced OCR text for each.
- The corrected Tesseract TSV invocation is covered by a unit test and was exercised by the complete JavaScript ingestion CLI run described below.
- 759 image files were extracted and matched to the PDF image inventory by PDF image number.
- The image inventory contained 721 image entries and 38 soft-mask entries. Soft masks are not treated as independent figure records.
- The pipeline's image-number matching was checked against selected pages below.

OCR character counts are only extraction diagnostics. They are not a measure of transcription accuracy.

## Selected page-level inspection

| PDF page | Source material | Validation result |
|---:|---|---|
| 36 | Number-, weight- and z-average molecular-weight equations | Native text contains equation symbols and terms, but layout linearization does not preserve the full fraction structure reliably. OCR also confuses subscripts and superscripts. **Requires visual verification against the source page before reuse.** |
| 152 | Permeability definition, three transport stages, influencing factors | Full-slide image extracted as PDF image 695 and matched to page 152. OCR text is readable and broadly preserves the listed stages and factors. |
| 153 | Permeability coefficient, solubility coefficient, relation (P = D\cdot S), units | Full-slide image extracted as PDF image 696 and matched to page 153. OCR recovers the main definitions and relation, but superscripts and unit exponents are error-prone. |
| 154 | Permeability data table | Full-slide image extracted as PDF image 697 and matched to page 154. OCR recovers many row labels and values, but several subscripts, exponents and table cells are ambiguous. **Do not use OCR text as authoritative numerical data.** |
| 178 | Single-screw extruder diagram | Diagram extracted as PDF image 721 and matched to page 178. Labels and major components are present in the extracted asset. |
| 194 | Blown-film extrusion diagram | Diagram extracted as PDF image 734 and matched to page 194. Major stages and labels are retained. |
| 201 | Injection-moulding diagrams | Main illustration extracted as image 742 and second diagram as image 743; image 744 is its soft mask. All are associated with page 201; the soft mask is not a separate figure candidate. |

## Latest full-pipeline execution

The committed JavaScript CLI was run end-to-end against this exact PDF after the Tesseract TSV argument-order correction.

- Source SHA-256 matched the value above.
- 212 pages processed; 2,449 knowledge records created with unique IDs.
- 19 sparse pages processed by OCR; 14 passed the pilot quality gate and 5 were marked review-required (35, 102, 171, 178, 212).
- No OCR command/page failures occurred.
- 721 genuine image records were mapped to 118 source pages. The 759 extracted files comprise 721 images and 38 soft masks.
- 158 source-page previews were generated; all planned previews exist and no preview failed.
- Context-aware table triage reduced the focused exception queue from 413 records across 77 pages to 269 records across 39 pages, without deleting or suppressing source records. The page-154 OCR permeability table is now flagged as a table candidate and exception.
- The generated manifest, record inventory and review packet were parsed and inspected. Every record remains unapproved; the manifest approval status is `unreviewed`.
- Preview images for pages 36, 154, 178 and 201 were visually inspected against the original PDF, covering equations, a numerical table, a single-screw extruder and injection-moulding diagrams.

The review CLI was also run against the real inventory with an empty decision list. It generated `review-results.json`, `proposed-content-patch.json`, and `proposed-content-patch.md`; the patch had zero additions and zero rejections, all 2,449 record IDs remained unreviewed, and the patch safety flags confirmed no changes were applied. This was a smoke test only; no content decisions were made on the user's behalf.

The full output directory is a local validation artifact and was not committed to Git. The original PDF and extracted assets were not added to the repository.

## Findings and limits

1. **Image-to-page mapping:** selected image-heavy pages map correctly when extracted file numbers are matched to PDF image numbers. This also avoids soft-mask entries shifting subsequent associations.
2. **OCR fallback:** useful for image-backed slides with sparse native text, but OCR output must remain unverified. Numerical tables and mathematical notation need visual checking.
3. **Equation fidelity:** text extraction alone is insufficient for the molecular-weight equations on page 36. The current pipeline retains the source page number but does not yet create a full-page visual proof for text-native pages. A future review-packet improvement should provide page renders for equation/table candidates that cannot be safely represented as text.
4. **Table interpretation:** the permeability table on page 154 is available as an extracted image. Its OCR text should be treated as a search aid, not as a verified data transcription.
5. **Course mapping:** use MT203 as explicitly confirmed by the user. The filename and embedded metadata are not authoritative for this source's course assignment.

## Acceptance decision

**Pass for source intake, traceability, and end-to-end execution of the current JavaScript CLI. Not approved for automatic content promotion.**

All extracted records remain unverified and require reviewer approval. No lesson, question bank, learner progress, or production content was changed during this validation. The generated preview files and review packet were inspected for completeness and source-page linkage. OCR thresholds remain pilot heuristics and require validation on other lecture PDFs.


## Additional local renderer and image-mapping check

A follow-up direct Poppler run against the exact source PDF confirmed:

- 759 extracted image files correspond to 759 sequential inventory entries (0–758).
- 721 genuine images map to their original source pages; 38 soft masks are correctly excluded from independent figure records.
- The genuine images occur on 118 distinct pages.
- All 118 selected 120-DPI page previews were rendered successfully as PNGs, with a combined size of 39.7 MiB.
- Image extraction took 23.7 seconds. Preview rendering was completed in two execution windows; the remaining 33 pages took 14.9 seconds after the first window stopped at 85 pages. No uninterrupted total runtime is asserted.

This direct Poppler check is supplemental to the successful full JavaScript CLI run documented above. It validates the renderer and image-mapping behavior independently; it does not supersede or contradict the saved CLI run.
