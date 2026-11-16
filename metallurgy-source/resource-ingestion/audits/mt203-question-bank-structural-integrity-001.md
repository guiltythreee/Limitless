# MT203 question-bank structural integrity snapshot

Date: 16 November 2026  
Branch: `feat/study-resource-ingestion-foundation`  
Scope: static source inspection of all 11 live question files, metadata and primary subtopic map. This is not a substitute for executing the repository's Node validator and regression suite.

## Results

| Check | Result |
|---|---:|
| Question IDs detected across T1–T11 | 305 |
| Unique IDs | 305 |
| Sequential IDs within each topic | PASS |
| Metadata total | 305 |
| Actual topic counts match metadata | PASS |
| Primary subtopic mappings | 305 |
| Unique mapped IDs | 305 |
| Missing/unexpected/duplicate mapping IDs | 0 |
| Question type values within registered set | PASS |
| Difficulty values restricted to 1–4 | PASS |

## Topic count parity

| Topic | Actual | Metadata |
|---|---:|---:|
| T1 | 32 | 32 |
| T2 | 36 | 36 |
| T3 | 22 | 22 |
| T4 | 30 | 30 |
| T5 | 20 | 20 |
| T6 | 22 | 22 |
| T7 | 16 | 16 |
| T8 | 30 | 30 |
| T9 | 28 | 28 |
| T10 | 36 | 36 |
| T11 | 33 | 33 |
| **Total** | **305** | **305** |

## Bank-wide question format distribution

| Format | Count |
|---|---:|
| apply | 37 |
| assertreason | 11 |
| compare | 30 |
| concept | 78 |
| graph | 9 |
| higher | 14 |
| match | 15 |
| numerical | 36 |
| recall | 46 |
| sequence | 5 |
| statement | 24 |
| **Total** | **305** |

## Bank-wide difficulty distribution

| Difficulty | Count |
|---|---:|
| 1 | 48 |
| 2 | 97 |
| 3 | 122 |
| 4 | 38 |
| **Total** | **305** |

## Interpretation and limits

- Every live question file contains its expected sequential ID range, with no missing or duplicate IDs found by this static scan.
- All 305 question IDs have exactly one primary subtopic-map entry; no missing, unexpected or duplicate mapping keys were found.
- Detected question types are within the registered type vocabulary, and detected difficulty values are 1–4.
- This inspection does **not** execute the TypeScript imports, validate option/answer/distractor structures, verify question explanations, run migration regressions, or build the application.
- The repository's authoritative checks remain `scripts/validate-mt203.mjs`, `scripts/test-mt203-migration.mjs`, the shared question-quality suite, and the Metallurgy regression workflow.

## Next

1. Run the authoritative MT203 validator and migration tests in GitHub Actions or a local checkout.
2. Complete the full objective-to-question crosswalk for T1–T8.
3. Review the source mismatch in T6-06 (PE Tg: question −120 °C vs lecture −20 °C) before editing the question.
4. Only after review, propose the exact question additions and corrections. Do not change the existing 305 IDs or learner progress during the audit.


## Follow-up structural verification after eight question additions — 16 November 2026

The checkpoint above was a 305-question baseline. Eight source-grounded questions have now been added with matching metadata and primary subtopic mappings.

| Topic | Baseline | Current |
|---|---:|---:|
| T1 | 32 | 34 |
| T2 | 36 | 36 |
| T3 | 22 | 24 |
| T4 | 30 | 31 |
| T5 | 20 | 20 |
| T6 | 22 | 23 |
| T7 | 16 | 17 |
| T8 | 30 | 31 |
| T9 | 28 | 28 |
| T10 | 36 | 36 |
| T11 | 33 | 33 |
| **Total** | **305** | **313** |

New IDs: `t1-33`, `t1-34`, `t3-23`, `t3-24`, `t4-31`, `t6-23`, `t7-17`, `t8-31`. Each is sequential within its topic and has one primary mapping. The metadata total is 313. The registry manifest and content-lock are updated in the same change set. Automated confirmation passed on commit `8b7c102d00038f172486b46a840e3c3d5f78a1b7`: MT203 validation reports 313 questions; course manifest/content-lock validation passes; MT203 unit and migration tests pass; question renderer tests pass; answer-key balance and sequence tests pass; all eight additions pass MCQ-QS v1.0 without errors or heuristic warnings; production build succeeds.
