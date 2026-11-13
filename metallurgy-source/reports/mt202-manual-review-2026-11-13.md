# MT202 manual question-quality review — 13 November 2026

## Scope of this pass

This pass manually reviewed two high-signal distractor cases and the associated metadata. It is a targeted correction pass, not completion of the full 522-question subject-matter audit.

## Durable question revisions

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

Both revisions update the durable `content-revisions/mt202.json` overlay and the generated chapter output. The deployed mirrors for Chapters 3 and 5 were synchronized. The original pinned source fingerprints were retained.

## Metadata corrections

Chapter 5 Q4–Q6 all assess point defects. Their primary curriculum topic was corrected from 5.1 (classification of defects) to 5.2 (point defects and vacancy concentration), with 5.1 retained as a related topic. Their supporting references were aligned to Chapter 5, topic 5.2.

The two revised question quality totals are now 88 (Q5) and 89 (Q41). These remain editorial rubric scores, not empirically calibrated item statistics.

## Validation performed

- Exact deployed-mirror equality confirmed for MT202 Chapters 3 and 5.
- Updated question options confirmed to match their durable overlay records.
- Metadata registry still contains 522 records.
- Heuristic follow-up queue regenerated from the current nine chapter JSON files: **474 flagged questions** — 146 High, 248 Medium, 80 Review. These are triage prompts, not confirmed defects.
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

The metadata registry currently marks all 522 questions approved. The editorial score distribution is concentrated (277 records score 81 and 146 score 91), so score calibration and independent faculty review remain open. Approval is provisional and must not be read as external validation.

The original Markdown question bank and solution folder are external to this repository. Exact original-to-revised classification therefore remains unavailable until those source files are supplied or connected.

## Next work

1. Inspect the remaining topic/objective mapping cases individually; correct only confirmed errors.
2. Continue manual review of high-risk options, structured statements, numerical calculations and explanation-to-answer alignment.
3. Calibrate the quality rubric against a representative expert-reviewed sample.
4. Reconcile the branch with current `main` before integration.

No merge or production deployment was performed.
