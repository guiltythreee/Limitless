# MT203 full-bank coverage review 001

**Review date:** 16 November 2026  
**Course:** MT203 — Polymer Science and Technology  
**Current source:** `MT203 – PST 2026(2).pdf` (212 pages)  
**Repository branch:** `feat/study-resource-ingestion-foundation`  
**Status:** T9–T11 source audit complete; 39 gap questions implemented; 344-question bank validated.

## 1. Executive result

The current bank contains **344 question records across 11 topics**. Ten source-grounded T1–T8 gap questions and 29 T9–T11 gap questions have been added. The six IDs missed by a preliminary regex scan were already present with quoted TypeScript keys; no restoration or duplicate records remain.

T9–T11 were checked against the supplied 212-page lecture PDF and the current lesson text. All 29 identified direct-assessment gaps have now been addressed with live questions and mapped to the existing subtopic taxonomy.

## 2. Verified question inventory

| Topic | Questions | Coverage area |
|---|---:|---|
| T1 | 34 | Fundamentals, classification and architecture |
| T2 | 36 | Polymerization mechanisms |
| T3 | 24 | Polymerization techniques |
| T4 | 32 | Molecular weight and distribution |
| T5 | 20 | Polymer crystallinity |
| T6 | 23 | Thermal transitions |
| T7 | 17 | Polymer chemistry of proteins |
| T8 | 32 | Industrial polymers |
| T9 | 35 | Blends, composites, modification and degradation |
| T10 | 45 | Mechanical, viscoelastic and physical properties |
| T11 | 46 | Compounding and processing |
| **Total** | **344** | **11 topics / 4 modules** |

### Structural reconciliation

The six IDs that the first regex missed were already in the question arrays using quoted object keys:
- `t1-11` — cis/trans polyisoprene configuration and packing.
- `t1-27` — semi-synthetic polymer classification.
- `t2-01` — chain-growth versus step-growth molecular-weight development.
- `t2-15` — Trommsdorff (gel) effect.
- `t2-32` — emulsion compartmentalization; primary subtopic T3.3.
- `t3-21` — thin-film/wiped-film arrangement in melt polycondensation.

No restoration or duplicate records remain. Ten source-gap additions remain live:
`t1-33`, `t1-34`, `t3-23`, `t3-24`, `t4-31`, `t4-32`, `t6-23`, `t7-17`, `t8-31`, `t8-32`.

A key-format-independent scan and the import-based validator find 344 IDs, 344 unique IDs, sequential numbering in each topic, 344 primary mappings, no missing mappings and no orphan mappings. Topic metadata, course manifest and content-lock all specify 344. The full CI suite passed on commit `67c2c7efe848813ae5beeb6ade1875ecc97668f6`.

## 3. Coverage review by topic group

### T1–T8

The previous objective crosswalk remains the baseline for T1–T8. Ten source-grounded gaps were added and mapped:
- T1: SBR styrene-content/property trend; functionality classification.
- T3: solution-polymer isolation; surfactant class/example mapping.
- T4: ultracentrifugation submethods and the p.48 molecular-weight method/measurement branches.
- T6: structure-to-Tg source comparison.
- T7: recombinant spider-silk production sequence.
- T8: silicone-based TPU scheme components; natural-rubber latex coagulation and ammonia preservation.

T2 and T5 did not receive a new source-gap item in that crosswalk. The T6-06 polyethylene Tg discrepancy remains flagged: the question is approximately −120 °C while source p.65 prints −20 °C. It has not been silently changed.

**Scope qualification:** this pass did not repeat the page-by-page T1–T8 source extraction. The prior T1–T8 crosswalk and its recorded source anomalies remain the basis for that group; this review directly re-opened the current 2026(2) PDF for T9–T11.

### T9 — seven implemented additions

The 35-question bank now assesses blend miscibility, compatibilization, rubber toughening, rule-of-mixtures reasoning, polymer modification and selected degradation/recycling ideas. The seven additions directly assess the lecture-specific composite definition/classification, FRP design factors, degradation definition and graph, the four source-listed categories, biodegradation hierarchy and recycling/coding context.

Live IDs: `t9-29` through `t9-35`. Source pages: 110–114 and 207–212.

### T10 — nine implemented additions

The 45-question bank now assesses stress–strain classes, modulus, toughness, creep, relaxation, viscoelastic models, TTS/WLF, rheology and selected transport/optical/flame properties. The nine additions directly assess the lecture's property classification and tensile terminology, A–F molecular deformation sequence, tensile standards/specimen, temperature/strain-rate effect, flexural methods, Izod/Charpy setup, stress-optical sensitivity/stress concentration and three-stage permeability mechanism.

Live IDs: `t10-37` through `t10-45`. Source pages: 122–150 and 152–154.

### T11 — thirteen implemented additions

The 46-question bank now assesses compounding fundamentals, additives, drying, MFI, shrinkage, core processing routes, fibre spinning, mastication, curatives and scorch/processability concepts. The thirteen additions directly assess processing as structure control, extruder classification/specifications, screw types/heating, twin-screw comparison, extrusion product/material table, blown-film versus blow moulding, compression/injection details, extrusion swell and surface defects, two-roll mill sequence, Tokita–White regions, ODR curve and plasticizer compatibility.

Live IDs: `t11-34` through `t11-46`. Source pages: 158–173 and 174–206.

## 4. Implemented gap additions

| Topic | Implemented count | Live ID range | Main objective clusters |
|---|---:|---|---|
| T1–T8 | 10 | t1-33, t1-34, t3-23, t3-24, t4-31, t4-32, t6-23, t7-17, t8-31, t8-32 | SBR composition; functionality; solution isolation; surfactants; molecular-weight methods; Tg structure trend; spider-silk production; TPU chemistry; latex coagulation |
| T9 | 7 | t9-29–t9-35 | composites; FRP design; degradation/aging; graph reading; degradation categories; biodegradation; recycling |
| T10 | 9 | t10-37–t10-45 | property classification; tensile definitions/sequence/standards; temperature-rate effect; flexural; impact; stress optics; permeability |
| T11 | 13 | t11-34–t11-46 | processing structure; extrusion equipment; twin screw; applications; moulding; extrusion defects; mill mixing; ODR; plasticizer compatibility |
| **T9–T11 subtotal** | **29** | — | — |
| **Full-bank total** | **39** | — | — |

All 39 additions are live, have the listed IDs and have primary mappings in `subtopic-map.ts`. Each passed the focused MCQ-QS v1.0 regression.

## 5. Source anomaly register

The following source details are deliberately not normalized:
- T4 p.48 method-to-average chart inconsistencies.
- T5 p.49 source label “Modified Polyphenylene Oxide (POM)”.
- T6 p.65 polyethylene Tg mismatch with t6-06.
- T9 p.112 printed fibre-diameter range 10–150 mm.
- T9 p.209 examples placed under the source's “Thermal degradation” heading.
- T9 pp.211–212 code 3 printed as “V or PVC” then “V”.
- T10 p.142 outer-fibre strain limit 0.05 mm/min while the symbol is defined in mm/mm.
- T11 p.163 Vamac listed in two curative rows.
- T11 p.191 power-consumption comparison is internally difficult to interpret.

Any question that depends on an ambiguous or inconsistent source detail must either reproduce the source wording explicitly or be excluded from numerical assessment until clarified.

## 6. Preservation and next gate

- Existing question IDs were not renumbered.
- The six quoted-key records were already present; duplicate copies from a transient repair attempt were removed.
- Ten newly added T1–T8 gap questions remain intact.
- Learner-progress storage and answer history were not modified.
- T9–T11 now contain 126 live questions, including the 29 source-gap additions.
- PR #246 remains draft/open/unmerged; no deployment was performed.

**Next gate:** independent academic review of the 29 new T9–T11 items and the source anomalies, followed by PR review. The counts, mappings, course manifest/content-lock, focused MCQ-QS gate, answer-key balance/sequence tests, migration tests and production build are already synchronized and passing.


## Historical 313-question CI checkpoint — before T9–T11 additions

Validated on the duplicate-free 313-question source commit `95f573d349c4d56c120934acbff1eec1acca7d94`:
- MT203 source validation: 313 questions across 11 topics; all checks passed.
- Course registry and content-lock validation: passed.
- MT203 progress tests: 47 passed, 0 failed.
- Migration assertions: 123 passed, 0 failed.
- Question renderer: 90 passed, 0 failed.
- Answer-key balance: A=78, B=79, C=78, D=78; global spread 1; maximum topic spread 1.
- Answer-sequence regression: all 313 questions passed.
- MCQ-QS v1.0 focused gate: all eight new T1–T8 additions passed, scores 92–95, no errors or heuristic warnings.
- Production build: compiled successfully.

A backup branch `backup/mt203-313-stable-20261116` was created at this successful source commit. PR #246 remains draft/open/unmerged; no deployment was performed.


## 7. Final implementation and CI result

The 29 T9–T11 additions are live:
- T9: `t9-29`–`t9-35`, scores 92–94.
- T10: `t10-37`–`t10-45`, scores 92–94.
- T11: `t11-34`–`t11-46`, scores 92–94.

Validated on current branch head `67c2c7efe848813ae5beeb6ade1875ecc97668f6`:
- MT203 source validator: 344 questions across 11 topics; passed.
- Course registry/content-lock: passed.
- MT203 progress tests: 47 passed.
- Migration assertions: 123 passed.
- Question renderer: 90 passed.
- Answer-key balance: A=86, B=86, C=86, D=86; global spread 0; maximum topic spread 1.
- Answer-sequence regression: all 344 passed.
- MCQ-QS v1.0 focused gate: all 39 new questions passed, no rule errors or heuristic warnings.
- Production build: successful.

Backup: `backup/mt203-344-stable-20261116`. PR #246 remains draft/open/unmerged; no deployment was performed.


## 8. Final source-to-answer-key review

Before the final green run, the match-table items were checked against their row definitions rather than relying only on the MCQ-QS structure checks. The corrected keys preserve the intended answer-position balance. T9-29 now assesses both the composite definition and matrix classes; T10-42 includes fixture, specimen and scope; T10-43 includes both impact-test setup and reporting; T11-38 uses the source's product/material pairs; and T11-40 tests the thermoplastic/thermoset heating distinction in addition to the compression sequence.

The focused regression locks the expected answer key for all 39 T1–T11 additions. Final validation is on commit `67c2c7efe848813ae5beeb6ade1875ecc97668f6`.


## 9. Current-head reconciliation — 344 questions, 16 November 2026

A final source reconciliation found two additional T1–T8 questions that were already included in the current metadata and course manifest but absent from the earlier 342-question summary: `t4-32` (p.48 end-group/colligative molecular-weight methods) and `t8-32` (natural-rubber latex coagulation and ammonia preservation). Both are present in the live topic arrays, have primary mappings (`T4.3`, `T8.4`) and are asserted by the focused MCQ-QS regression.

The authoritative current inventory is therefore:

| Topic | Count |
|---|---:|
| T1 | 34 |
| T2 | 36 |
| T3 | 24 |
| T4 | 32 |
| T5 | 20 |
| T6 | 23 |
| T7 | 17 |
| T8 | 32 |
| T9 | 35 |
| T10 | 45 |
| T11 | 46 |
| **Total** | **344** |

This is 39 additions over the 305-question baseline: ten in T1–T8 and 29 in T9–T11. T1–T8 now contain 218 questions; T9–T11 contain 126. No existing IDs were renumbered or overwritten.

### Current-head CI

All five relevant GitHub Actions workflows passed on `67c2c7efe848813ae5beeb6ade1875ecc97668f6`:
- Source validator: 344 questions across 11 topics; all checks passed.
- Course registry/content-lock: passed.
- MT203 progress tests: 47 passed, 0 failed.
- Migration assertions: 123 passed, 0 failed.
- Question renderer: 90 passed, 0 failed.
- Answer-key balance: A=86, B=86, C=86, D=86; spread 0 globally, maximum spread 1 per topic.
- Answer-sequence regression: 344 passed; maximum run 3; rolling-window and repeated-pattern checks passed.
- MCQ-QS v1.0 focused gate: all 39 additions passed, scores 92–95, no errors or heuristic warnings.
- Production build: workflow completed successfully.

The validated 344-question qbank source is preserved on `backup/mt203-344-stable-20261116`. PR #246 remains draft/open/unmerged; no deployment was performed.
