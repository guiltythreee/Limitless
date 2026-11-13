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
