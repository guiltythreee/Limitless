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
