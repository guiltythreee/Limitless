# Real-source validation: MT203 Polymer Science and Technology

**Validation status:** source-PDF diagnostics and selected-page inspection completed; latest JavaScript CLI end-to-end validation remains pending after an OCR invocation fix  
**Course mapping:** MT203 (confirmed by the user; the source filename is a legacy naming error)  
**Source filename:** `MT203 – PST 2026(1).pdf`  
**Source SHA-256:** `ba86baeb56d8bae0a0cd875cd1e4b63eac5cf11cb502d9e84e5ed52cc1f6e546`  
**PDF metadata title:** `MT255 – Polymer Science and Technology` (legacy embedded metadata; not used as the course mapping)  
**Pages:** 212

## Extraction checks

- Poppler reported 212 pages; text extraction returned 212 page segments.
- 19 pages fell below the native-text threshold. Direct Poppler/Tesseract diagnostics were run against all 19 sparse pages and produced OCR text for each.
- These direct diagnostics are not evidence that the repository's JavaScript ingestion CLI completed successfully: a later code-path audit found an invalid argument order in its TSV-confidence invocation. That invocation has been corrected and covered by a unit test; a fresh end-to-end CLI run on this PDF remains pending.
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

## Findings and limits

1. **Image-to-page mapping:** selected image-heavy pages map correctly when extracted file numbers are matched to PDF image numbers. This also avoids soft-mask entries shifting subsequent associations.
2. **OCR fallback:** useful for image-backed slides with sparse native text, but OCR output must remain unverified. Numerical tables and mathematical notation need visual checking.
3. **Equation fidelity:** text extraction alone is insufficient for the molecular-weight equations on page 36. The current pipeline retains the source page number but does not yet create a full-page visual proof for text-native pages. A future review-packet improvement should provide page renders for equation/table candidates that cannot be safely represented as text.
4. **Table interpretation:** the permeability table on page 154 is available as an extracted image. Its OCR text should be treated as a search aid, not as a verified data transcription.
5. **Course mapping:** use MT203 as explicitly confirmed by the user. The filename and embedded metadata are not authoritative for this source's course assignment.

## Acceptance decision

**Pass for manual source inspection, source identity, and selected page/image traceability. Pending final acceptance of the current JavaScript ingestion CLI. Not approved for automatic content promotion.**

All extracted records remain unverified and require reviewer approval. No lesson, question bank, learner progress, or production content was changed during this validation. The latest preview planner now schedules 120-DPI page renders for equation/table candidates, embedded-figure pages, and extraction exceptions; the resulting preview files and review packet still require a fresh end-to-end run before their actual output is accepted.
