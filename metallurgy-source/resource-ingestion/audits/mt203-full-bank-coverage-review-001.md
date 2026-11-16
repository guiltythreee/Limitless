# MT203 full-bank coverage review 001

**Review date:** 16 November 2026  
**Course:** MT203 — Polymer Science and Technology  
**Current source:** `MT203 – PST 2026(2).pdf` (212 pages)  
**Repository branch:** `feat/study-resource-ingestion-foundation`  
**Status:** T9–T11 source audit complete; full-bank inventory reconciled; 29 further T9–T11 items proposed, not inserted.

## 1. Executive result

The current bank contains **313 actual question records across 11 topics**. The T1–T8 source-gap work added eight new questions. A separate integrity pass then recovered six earlier baseline records that had been missing from the arrays while still being counted in metadata and the primary subtopic map. The bank now has sequential IDs and one primary subtopic mapping for every live question.

T9–T11 have been checked against the supplied 212-page lecture PDF and the current lesson text. This review identifies **29 remaining direct-assessment gaps** across those topics. These are proposed items, not yet live questions. If accepted, the bank would rise to 342.

## 2. Verified question inventory

| Topic | Questions | Coverage area |
|---|---:|---|
| T1 | 34 | Fundamentals, classification and architecture |
| T2 | 36 | Polymerization mechanisms |
| T3 | 24 | Polymerization techniques |
| T4 | 31 | Molecular weight and distribution |
| T5 | 20 | Polymer crystallinity |
| T6 | 23 | Thermal transitions |
| T7 | 17 | Polymer chemistry of proteins |
| T8 | 31 | Industrial polymers |
| T9 | 28 | Blends, composites, modification and degradation |
| T10 | 36 | Mechanical, viscoelastic and physical properties |
| T11 | 33 | Compounding and processing |
| **Total** | **313** | **11 topics / 4 modules** |

### Structural reconciliation

The six restored original IDs are:
- `t1-11` — cis/trans polyisoprene configuration and packing.
- `t1-27` — semi-synthetic polymer classification.
- `t2-01` — chain-growth versus step-growth molecular-weight development.
- `t2-15` — Trommsdorff (gel) effect.
- `t2-32` — emulsion compartmentalization; primary subtopic T3.3.
- `t3-21` — thin-film/wiped-film arrangement in melt polycondensation.

The eight source-gap additions remain:
`t1-33`, `t1-34`, `t3-23`, `t3-24`, `t4-31`, `t6-23`, `t7-17`, `t8-31`.

Direct array inspection after restoration found 313 IDs, 313 unique IDs, sequential numbering in each topic, 313 primary mappings, no missing mappings and no orphan mappings. The topic metadata and course content-lock both specify 313. The CI validator is being rerun on the repaired commit; do not treat the earlier green run as validation of the corrected head.

## 3. Coverage review by topic group

### T1–T8

The previous objective crosswalk remains the baseline for T1–T8. Eight source-grounded gaps were added and mapped:
- T1: SBR styrene-content/property trend; functionality classification.
- T3: solution-polymer isolation; surfactant class/example mapping.
- T4: ultracentrifugation submethods on the source chart.
- T6: structure-to-Tg source comparison.
- T7: recombinant spider-silk production sequence.
- T8: silicone-based TPU scheme components.

T2 and T5 did not receive a new source-gap item in that crosswalk. The six restored IDs above are baseline restoration, not additional newly discovered gaps. The T6-06 polyethylene Tg discrepancy remains flagged: the question is approximately −120 °C while source p.65 prints −20 °C. It has not been silently changed.

**Scope qualification:** this pass did not repeat the page-by-page T1–T8 source extraction. The prior T1–T8 crosswalk and its recorded source anomalies remain the basis for that group; this review directly re-opened the current 2026(2) PDF for T9–T11.

### T9 — seven remaining gaps

The 28-question bank already assesses blend miscibility, compatibilization, rubber toughening, rule-of-mixtures reasoning, polymer modification and selected degradation/recycling ideas. It still lacks direct items for the lecture-specific composite definition/classification, FRP design factors, degradation definition/aging graph, the four source-listed categories, biodegradation hierarchy and the full recycling/coding context.

Proposed IDs: `t9-29` through `t9-35`. Source pages: 110–114 and 207–212.

### T10 — nine remaining gaps

The 36-question bank already assesses stress–strain classes, modulus, toughness, creep, relaxation, viscoelastic models, TTS/WLF, rheology and selected transport/optical/flame properties. It lacks direct assessment of the lecture's property classification and tensile terminology, its A–F molecular deformation sequence, tensile standards/specimen, the plotted temperature/strain-rate effect, flexural methods, Izod/Charpy setup, stress-optical sensitivity/stress concentration and the three-stage permeability mechanism.

Proposed IDs: `t10-37` through `t10-45`. Source pages: 122–150 and 152–154.

### T11 — thirteen remaining gaps

The 33-question bank already assesses compounding fundamentals, additives, drying, MFI, shrinkage, core processing routes, fibre spinning, mastication, curatives and scorch/processability concepts. It lacks direct assessment of processing as structure control, extruder classification/specifications, screw types/heating, twin-screw comparison, the extrusion product/material table, blown-film versus blow moulding, compression/injection details, extrusion swell and surface defects, the two-roll mill sequence, Tokita–White regions, the ODR curve and plasticizer compatibility.

Proposed IDs: `t11-34` through `t11-46`. Source pages: 158–173 and 174–206.

## 4. Proposed minimum additions

| Topic | Proposed count | Provisional ID range | Main objective clusters |
|---|---:|---|---|
| T9 | 7 | t9-29–t9-35 | composites; FRP design; degradation/aging; graph reading; categories; biodegradation; recycling |
| T10 | 9 | t10-37–t10-45 | property classification; tensile definitions/sequence/standards; temperature-rate effect; flexural; impact; stress optics; permeability |
| T11 | 13 | t11-34–t11-46 | processing structure; extrusion equipment; twin screw; applications; moulding; extrusion defects; mill mixing; ODR; plasticizer compatibility |
| **Total** | **29** | — | — |

These are provisional planning labels. No IDs have been reserved and no new T9–T11 items have been added to the live bank.

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
- Six missing baseline records were restored to their original sequential positions.
- Eight newly added T1–T8 gap questions remain intact.
- Learner-progress storage and answer history were not modified.
- T9–T11 remain at 97 live questions until the 29 proposed additions pass source review and MCQ-QS v1.0.
- PR #246 remains draft/open/unmerged; no deployment was performed.

**Next gate:** author and independently review the 29 T9–T11 questions, then update topic counts, source mappings, course manifest/content-lock and focused regression tests together. Re-run the full source validator, MCQ-QS gate, answer-key balance/sequence checks, migration tests and production build before considering merge.
