# Limitless metallurgy question-bank quality audit — 2026-10-28

> **Snapshot status (2026-10-30):** This audit was generated before the current MT203 question-quality pass. The MT201/MT202 findings remain the relevant portion of this report. Its MT203 distribution and heuristic tables are historical and are superseded by `docs/MT203-authored-revisions-2026-10-28.md` and the current MT203 regression workflow. The accompanying CSV now contains MT201/MT202 follow-up items only. The MT201/MT202 runner no longer applies or rebalances MT203.
## Scope and limitations
This report is generated locally from the checked-out repository after applying the authored revisions. Heuristic counts are review indicators, not proof of scientific correctness. All 59 MT201/MT202 authored targets carry fingerprints pinned to GitHub main commit b7359a6113a5888d3cf3c88cb5ce25cc716d89e4 (2026-10-28). Mismatched stems/options stop the apply before any write. MT201/MT202 external authoring banks are not stored in the repository, so durable override files are installed and applied by the sync scripts.
## Authored revisions
Applied 59 authored replacements: MT201 12 and MT202 47. Stable question IDs and question types are preserved. MT203 is maintained independently.
### Applied IDs

MT201 ch11 Q3, MT201 ch11 Q6, MT201 ch11 Q11, MT201 ch11 Q14, MT201 ch01 Q10, MT201 ch14 Q1, MT201 ch14 Q9, MT201 ch14 Q10, MT201 ch09 Q2, MT201 ch09 Q19, MT201 ch09 Q20, MT201 ch14 Q6, MT202 ch01 Q1, MT202 ch03 Q1, MT202 ch03 Q17, MT202 ch06 Q4, MT202 ch06 Q10, MT202 ch06 Q16, MT202 ch06 Q32, MT202 ch04 Q1, MT202 ch04 Q2, MT202 ch05 Q4, MT202 ch06 Q33, MT202 ch06 Q34, MT202 ch07 Q1, MT202 ch07 Q6, MT202 ch07 Q20, MT202 ch07 Q21, MT202 ch07 Q23, MT202 ch06 Q13, MT202 ch06 Q23, MT202 ch07 Q29, MT202 ch08 Q8, MT202 ch08 Q18, MT202 ch08 Q29, MT202 ch09 Q8, MT202 ch01 Q17, MT202 ch01 Q28, MT202 ch01 Q35, MT202 ch02 Q5, MT202 ch02 Q45, MT202 ch03 Q25, MT202 ch04 Q33, MT202 ch05 Q45, MT202 ch05 Q54, MT202 ch05 Q60, MT202 ch09 Q48, MT202 ch03 Q45, MT202 ch08 Q48, MT202 ch05 Q33, MT202 ch07 Q17, MT202 ch03 Q44, MT202 ch04 Q10, MT202 ch04 Q24, MT202 ch04 Q45, MT202 ch03 Q48, MT202 ch07 Q3, MT202 ch07 Q16, MT202 ch07 Q40

## Four-option answer-key distribution
### MT201 — pre-run versus after

| Chapter | A before | A after | B before | B after | C before | C after | D before | D after |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| ch01 | 5 | 4 | 6 | 4 | 3 | 3 | 0 | 3 |
| ch02 | 4 | 2 | 2 | 2 | 1 | 2 | 0 | 1 |
| ch03 | 6 | 5 | 11 | 5 | 3 | 5 | 0 | 5 |
| ch04 | 7 | 5 | 11 | 5 | 0 | 4 | 0 | 4 |
| ch05 | 13 | 6 | 10 | 7 | 2 | 6 | 0 | 6 |
| ch06 | 10 | 7 | 13 | 6 | 2 | 6 | 0 | 6 |
| ch07 | 5 | 3 | 6 | 3 | 0 | 3 | 1 | 3 |
| ch08 | 18 | 6 | 9 | 7 | 0 | 7 | 0 | 7 |
| ch09 | 22 | 7 | 3 | 7 | 0 | 6 | 1 | 6 |
| ch10 | 23 | 7 | 3 | 6 | 0 | 6 | 0 | 7 |
| ch11 | 25 | 7 | 2 | 7 | 0 | 6 | 0 | 7 |
| ch12 | 20 | 5 | 1 | 6 | 0 | 5 | 0 | 5 |
| ch13 | 10 | 3 | 1 | 3 | 0 | 3 | 0 | 2 |
| ch14 | 15 | 3 | 0 | 4 | 0 | 4 | 0 | 4 |
| **Total** | **183** | **70** | **78** | **72** | **11** | **66** | **2** | **66** |

### MT202 — pre-run versus after

| Chapter | A before | A after | B before | B after | C before | C after | D before | D after |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| ch01 | 21 | 8 | 8 | 9 | 3 | 8 | 1 | 8 |
| ch02 | 23 | 13 | 18 | 13 | 10 | 13 | 1 | 13 |
| ch03 | 41 | 17 | 16 | 17 | 10 | 18 | 3 | 18 |
| ch04 | 33 | 12 | 11 | 12 | 2 | 12 | 1 | 11 |
| ch05 | 38 | 17 | 21 | 17 | 5 | 17 | 4 | 17 |
| ch06 | 31 | 14 | 15 | 14 | 6 | 14 | 5 | 15 |
| ch07 | 34 | 14 | 16 | 15 | 5 | 15 | 4 | 15 |
| ch08 | 30 | 14 | 15 | 14 | 6 | 14 | 4 | 13 |
| ch09 | 44 | 17 | 13 | 17 | 6 | 17 | 5 | 17 |
| **Total** | **295** | **126** | **133** | **128** | **53** | **128** | **28** | **127** |

### MT203 by topic — pre-run versus after

| Topic | A before | A after | B before | B after | C before | C after | D before | D after |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| T1 | 13 | 8 | 15 | 8 | 4 | 8 | 0 | 8 |
| T2 | 15 | 9 | 15 | 9 | 5 | 9 | 1 | 9 |
| T3 | 9 | 5 | 11 | 6 | 2 | 5 | 0 | 6 |
| T4 | 15 | 8 | 11 | 7 | 3 | 8 | 1 | 7 |
| T5 | 12 | 6 | 6 | 5 | 2 | 5 | 0 | 4 |
| T6 | 13 | 6 | 7 | 6 | 2 | 5 | 0 | 5 |
| T7 | 5 | 4 | 11 | 4 | 0 | 4 | 0 | 4 |
| T8 | 11 | 8 | 19 | 7 | 0 | 8 | 0 | 7 |
| T9 | 17 | 7 | 7 | 6 | 0 | 6 | 0 | 5 |
| T10 | 16 | 7 | 10 | 7 | 2 | 7 | 0 | 7 |
| T11 | 24 | 7 | 2 | 7 | 0 | 6 | 0 | 6 |

### MT203 total

| A before | A after | B before | B after | C before | C after | D before | D after |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 150 | 75 | 114 | 72 | 20 | 71 | 2 | 68 |

### Combined total

| A | B | C | D |
|---:|---:|---:|---:|
| 271 | 272 | 265 | 261 |

## Mechanical guessing-cue scan

| Heuristic | Count |
|---|---:|
| P1-P2-P3-pattern-code-reference | 104 |
| absolute-word-candidate | 310 |
| correct-option-over-2x-shortest | 461 |
| correct-option-uniquely-longest | 464 |
| duplicate-stem-groups | 3 |
| option-letter-reference | 11 |
| option-over-2x-shortest | 501 |
| structured-item-review-candidate | 378 |
| unique-longest-option | 807 |

These automated signals are not all defects. Longer answers may need longer explanations; absolute words may be justified; structured question types are expected. The next manual pass should inspect each flagged item in context.
## Follow-up queue

The accompanying CSV lists exact question IDs, severity, evidence and recommended review actions for the questions triggered by the heuristics. These are review signals rather than confirmed defects. It does not reliably detect semantic irrelevance or every science error; those still need subject-matter review.

Priority themes: remove answer-length/specificity cues; recheck all/none choices and absolute language; inspect explanations containing P1/P2/P3 strategy codes; review statement-combination items for implausible statements; resolve duplicate stems; and manually inspect unrelated-topic distractors and all numerical/data-based solutions.
