# MT202 manual question-quality review — 13 November 2026

## Scope of this pass

This pass manually reviewed seven high-signal distractor cases and the associated metadata. It is a targeted correction pass, not completion of the full 522-question subject-matter audit.

## Durable question revisions

### Chapter 1, Q18 — metallic bonding

- Rebalanced the options to contrast localized electrons, delocalized metallic electrons, ionic transfer and covalent pairs.
- Preserved answer key **(b)** and retained the existing explanation.

### Chapter 2, Q53 — FCC/BCC interplanar spacing and ductility

- Rewrote all four options as comparable statements about the misconception that equal interplanar spacing implies equal ductility or equal packing.
- Preserved answer key **(a)** and the existing numerical premise.
- Kept the explanation's distinction between FCC's four close-packed {111} planes and BCC's lack of a truly close-packed plane.

### Chapter 4, Q39 — overheating versus burning

- Rewrote the options to distinguish recoverable heating below the local effective solidus from grain-boundary liquation, bulk melting and rapid quenching.
- Preserved answer key **(a)**.
- Clarified the effective-solidus test in the explanation and removed unrelated misconception tags.
- Updated difficulty to 2 and reasoning skills to `distinguish` / `classify`.

### Chapter 5, Q15 — theoretical versus actual shear strength

- Removed explanatory prose from the correct option and made all four options comparable numerical ranges.
- Preserved answer key **(b)**.
- Expanded the explanation to contrast the measured range (G/10³ to G/10⁵) with theoretical estimates (G/30 and G/(2π)) and connect the strength gap to dislocation motion.
- Updated the editorial quality total to 89.

### Chapter 3, Q3 — homogeneous nucleation

- Rebalanced the options to distinguish bulk nucleation, foreign-surface nucleation and the associated undercooling/barrier effects.
- Preserved answer key **(a)**.
- Rewrote the explanation to make the interfacial-energy reason for substantial homogeneous undercooling explicit.
- Updated difficulty to 2, reasoning skills to `distinguish` / `apply`, and removed an unrelated temperature/heat-treatment misconception tag.
- Added a durable overlay using a fingerprint independently checked against the pinned source commit.

### Chapter 5, Q5 — self-interstitial

- Rebuilt the four options so they distinguish a vacancy, substitutional impurity, self-interstitial and interstitial impurity.
- Removed the original answer's giveaway wording about high strain energy and low concentration from the option itself.
- Preserved answer key **(c)**.
- Expanded the explanation to define each competing defect and explain why a self-interstitial has high formation energy and low equilibrium concentration.
- Updated the editorial assessment to difficulty 2 and reasoning skills `distinguish` / `classify`.

### Chapter 3, Q41 — interdendritic sponginess

- Rebalanced the four options around gas porosity, macro-shrinkage, interdendritic shrinkage and oxide-film defects.
- Preserved answer key **(c)**.
- Rewrote the explanation to distinguish the mechanisms and their different remedies.
- Removed unrelated misconception tags and added `shrinkage_vs_gas_porosity_confusion`.
- Updated the editorial assessment to difficulty 2 and reasoning skills `classify` / `distinguish`.

All seven revisions update the durable `content-revisions/mt202.json` overlay and the generated chapter output. The deployed mirrors for Chapters 1–5 were synchronized and checked byte-for-byte against the generated chapter files. The original pinned source fingerprints were retained.

## Metadata corrections

Chapter 5 Q4–Q6 all assess point defects. Their primary curriculum topic was corrected from 5.1 (classification of defects) to 5.2 (point defects and vacancy concentration), with 5.1 retained as a related topic. Their supporting references were aligned to Chapter 5, topic 5.2.

The revised question quality totals are now 88 (Q3), 88 (Q5), 89 (Q15), 88 (Q18), 88 (Q39) and 89 (Q41); Q53 retains its existing total of 92. These remain editorial rubric scores, not empirically calibrated item statistics.

## Validation performed

- Exact deployed-mirror equality confirmed for MT202 Chapters 1–5.
- Updated question options confirmed to match their durable overlay records.
- Metadata registry still contains 522 records.
- Heuristic follow-up queue regenerated from the current nine chapter JSON files: **474 flagged questions** — 141 High, 250 Medium, 83 Review. These are triage prompts, not confirmed defects.
- A pre-edit backup branch was created: `backup/mt202-before-manual-distractor-revisions-2026-11-13`.

## Remaining audit findings

A mechanical comparison of each record's primary curriculum topic against the chapter prefix of its first learning-objective ID identifies **40 remaining mismatches** after the Q4–Q6 corrections:

| Chapter | Records to inspect |
|---|---:|
| Ch 1 | 3 |
| Ch 2 | 1 |
| Ch 3 | 3 |
| Ch 5 | 10 |
| Ch 6 | 9 |
| Ch 7 | 1 |
| Ch 8 | 7 |
| Ch 9 | 6 |
| **Total** | **40** |

The comparison is not itself proof of incorrect mapping: some questions intentionally assess multiple topics, and Chapter 9 is a revision mix. Each record needs inspection against its actual stem/statements and the topic catalogue.

The metadata registry currently marks all 522 questions approved. The editorial score distribution is concentrated (274 records score 81 and 146 score 91), so score calibration and independent faculty review remain open. Approval is provisional and must not be read as external validation.

The original Markdown question bank and solution folder are external to this repository. Exact original-to-revised classification therefore remains unavailable until those source files are supplied or connected.

## Next work

1. Inspect the remaining topic/objective mapping cases individually; correct only confirmed errors.
2. Continue manual review of high-risk options, structured statements, numerical calculations and explanation-to-answer alignment.
3. Calibrate the quality rubric against a representative expert-reviewed sample.
4. Reconcile the branch with current `main` before integration.

No merge or production deployment was performed.


## Follow-up mapping audit — 14 November 2026

The 40-case topic/objective comparison above was manually inspected in a follow-up pass. Its count is a historical snapshot, not the current open count. Thirty-two records received targeted mapping/objective corrections; eight were retained because the topic/objective distinction is legitimate or reflects a broader catalogue-boundary issue. The detailed question-by-question rationale and validation are recorded in `reports/mt202-mapping-audit-2026-11-14.md`.

The updated metadata still contains 522 unique records. A remote parity check found no unresolved topic, related-topic or objective references and no quality-total arithmetic errors. The repository Node validator and CI must be rerun on the updated branch before integration. This mapping pass does not close the separate 474-question content-quality follow-up queue or the source-provenance limitation.


## High-priority distractor follow-up — 14 November 2026

A further distractor pass revised 14 questions in Chapters 4–9. Answer keys were preserved, existing source fingerprints were retained, generated chapter outputs matched their deployed mirrors byte-for-byte, and the heuristic queue was regenerated. Current queue: 474 flagged questions — 127 High, 264 Medium, 83 Review. See `reports/mt202-high-priority-distractor-review-2026-11-14.md` for the affected questions and validation details.


## Numerical distractor follow-up — 14 November 2026

Four additional items were clarified after the initial 14-question distractor pass: Ch 5 Q34, Ch 6 Q17, Ch 6 Q24 and Ch 9 Q24. The latest total is 18 questions with distractor-balance edits. Answer keys were preserved. The current heuristic queue is 473 flags (123 High, 267 Medium, 83 Review). The 392-record revision overlay has 392 unique targets, all overlay update fields match generated chapter outputs, and all nine deployed mirrors match their generated files byte-for-byte. Full CI has not yet rerun on these latest commits.
