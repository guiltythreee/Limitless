# MT202 high-priority distractor review — 14 November 2026

## Scope

Reviewed the first high-priority heuristic findings and selected 14 questions where a conspicuously longer correct option could reveal the key without testing the intended concept. The edits rebalance option specificity and length; they do not change the tested concept or answer key.

## Questions revised

- Chapter 4: Q32 (coring), Q38 (burning)
- Chapter 5: Q48 (twin boundary)
- Chapter 6: Q15 (Schmid's-law angle)
- Chapter 7: Q11 (strain-hardening relation), Q14 (Hall–Petch coefficient)
- Chapter 8: Q3 (interstitial diffusion), Q11 (Fick's first-law sign), Q27 (diffusion activation energy), Q32 (diffusion-path rate order)
- Chapter 9: Q10 (rimming steel), Q12 (burning), Q30 (Shockley partials/stacking-fault ribbon), Q36 (Hall–Petch coefficient)

## Preservation and validation

- All 14 answer keys are unchanged from the pre-edit backup.
- Existing source fingerprints in the durable revision overlay are unchanged.
- Overlay option updates match the generated chapter JSON.
- All six affected generated chapter files match their deployed mirrors byte-for-byte.
- Chapter counts, question IDs and order were not changed.
- The heuristic queue was regenerated with the repository script's logic and committed. Total flagged questions remain 474; severity counts changed from High 141 / Medium 250 / Review 83 to High 127 / Medium 264 / Review 83.

The High-to-Medium shift reflects removal of the combined severe correct-answer-length cues on these edited items; it is not a claim that 14 questions are now defect-free. Remaining flags must be inspected in context. The four duplicate-stem pairs identified by the heuristic were also inspected: the paired questions are distinct revision/practice variants with different statement wording or answer ordering, so they were retained rather than mechanically deleted.

## Remaining work

- Continue manual inspection of the remaining 127 High findings, prioritising numerical calculations, answer-key validity, assertion–reason logic and explanation-to-option alignment.
- Review Medium and Review flags contextually; do not pad distractors merely to equalise character counts.
- Calibrate the quality rubric and difficulty ratings against expert review and student performance.
- Obtain the external Markdown source bank and solutions for exact original-to-revised classification.
- Run the full repository CI and production static-export checks after the latest changes and after rebasing onto current main.

No question IDs, answer keys, progress records, storage schemas or production deployment were changed by this pass.


## Numerical distractor clarification — additional pass

Four further high-priority items were revised:

- Ch 5 Q34: clarified that the intended answer is the order-of-magnitude (Gb^2) scaling for line energy per unit length; replaced a potentially defensible alternate coefficient with dimensionally distinct distractors and added a units check.
- Ch 6 Q17: balanced options for the Schmid-factor range and maximum.
- Ch 6 Q24: balanced options for the zero-resolved-shear condition.
- Ch 9 Q24: balanced options for the Hume–Rothery atomic-size criterion.

The answer keys were preserved. The durable overlay remains at 392 unique targets; all 392 overlay updates match the generated chapter JSON, and all nine deployed chapter mirrors are byte-identical to their generated source files. The refreshed heuristic queue now contains 473 flags: 123 High, 267 Medium and 83 Review. The remaining flags still require contextual review.


## Heuristic refinement — structured duplicate detection

The audit script previously compared only normalized question stems. That incorrectly treated generic structured stems as duplicates even when their statements or assertion–reason content differed. The detector now compares the normalized stem together with statements, match-table content and assertion/reason text. The four previously flagged pairs were inspected and are distinct practice/revision variants, so they are no longer classified as duplicates.

The queue was regenerated after the script change: **473 flags — 119 High, 271 Medium, 83 Review**. This refinement removes false duplicate signals; it does not reduce the number of questions requiring contextual review.


## Current branch follow-up — 14 November 2026

The cumulative distractor-balance pass now covers **56 questions** across Chapters 1–9. It preserves the existing answer keys and uses fingerprint-guarded durable overlay records. The overlay now contains **418 unique targets**; all overlay updates match generated chapter JSON and all nine deployed mirrors match their generated files byte-for-byte.

The queue currently contains **465 flags — 50 High, 292 Medium and 123 Review**. The audit script now excludes option-length bias signals for standardized two-option True/False and four-option Assertion–Reason response formats, including common wording variants. It also compares structured content when identifying duplicate stems. These changes reduce false-positive severity; the remaining flags still need contextual review.


## Latest verified follow-up — first manual batch, 14 November 2026

The first 10 questions in the current High-priority queue were inspected and revised:

- Ch 2 Q22
- Ch 3 Q35 and Q38
- Ch 4 Q26, Q27, Q31, Q35, Q36 and Q42
- Ch 5 Q18

The edits reduce conspicuous correct-option length cues while retaining the assessed concepts and all 10 answer keys. The existing 418-target durable overlay was updated in place; no new question IDs, chapter counts or progress records were introduced. Generated chapter JSON and deployed mirrors were updated together.

The queue was regenerated using the committed audit script's rules. It now contains **464 flags — 28 High, 307 Medium and 129 Review** (previous committed queue: 465 flags — 38 High, 300 Medium and 127 Review). The reduction in High findings is a triage change, not independent proof that the questions are defect-free. Remaining High items still require contextual subject review.

Earlier severity totals in this report are historical snapshots. The latest authoritative severity counts are the ones in this section and the regenerated CSV.


## Latest verified follow-up — second manual batch, 14 November 2026

A second set of 10 questions was inspected and revised:

- Ch 5 Q19, Q28, Q37, Q40, Q43 and Q44
- Ch 6 Q22, Q25, Q30 and Q35

The edits shorten overlong keyed options and make distractors more parallel while retaining the tested dislocation, stacking-fault, Burgers-vector, Frank–Read, pile-up, Schmid-factor, twinning and upper-yield concepts. All 10 answer keys were preserved. The existing durable overlay was updated in place; generated chapter JSON and deployed mirrors were updated together.

The regenerated queue now contains **463 flags — 18 High, 312 Medium and 133 Review** (immediately before this batch: 464 flags — 28 High, 307 Medium and 129 Review). These are heuristic triage counts, not confirmed defect counts. The remaining 18 High findings should be manually inspected next.


## Latest verified follow-up — third manual batch, 14 November 2026

A third set of 10 questions was inspected and revised:

- Ch 6 Q40, Q49, Q52 and Q57
- Ch 7 Q5, Q9, Q32 and Q36
- Ch 8 Q12 and Q15

The option wording was made more parallel while preserving the intended metallurgy concepts and all answer keys. A substantive explanation defect was also found in **Ch 7 Q9**: its answer key and key explanation identified option A, but the detailed explanation incorrectly concluded that option C was correct. The detailed explanation and concise explanation have now been aligned with option A and the Hall–Petch effect.

The existing overlay was updated in place and the generated chapter JSON / deployed mirrors were updated together. The queue now contains **463 flags — 9 High, 320 Medium and 134 Review** (before this batch: 463 flags — 18 High, 312 Medium and 133 Review). The High count fell by nine; the total remained constant because several option-length flags moved into lower-severity categories. This is a triage result, not a claim that the remaining flags are all confirmed defects.
