# MT203 source-to-lesson cross-topic audit — checkpoint 002

Status: **active; cross-topic reconciliation in progress, not yet frozen**  
Source: `MT203 – PST 2026(1).pdf` (212 pages; SHA-256 `ba86baeb56d8bae0a0cd875cd1e4b63eac5cf11cb502d9e84e5ed52cc1f6e546`)  
Course authority: `app/courses/manifests/mt203.ts`, `app/data/qbank/meta.ts`  
Lesson authority: `app/data/lessons-mt203.ts`  
Branch: `feat/study-resource-ingestion-foundation`

## Purpose and limits

This is a concept-level crosswalk of the lecture's page sequence to the existing 11 topics. It is not a claim that every figure/table on every page has been visually transcribed. The full 2,449-record page index remains the extraction locator; individual record IDs are retained there. A page can map to multiple topics. Extraction text alone is not approval of a scientific claim.

The existing syllabus structure remains four modules and eleven topics. The existing 305 questions and learner progress remain unchanged. No questions are added in this checkpoint.

## Cross-topic page mapping

| Source pages | Main source subject | Existing destination | Current reconciliation |
|---|---|---|---|
| 1–4 | Course identity, outcomes, assessment and syllabus | Course/module metadata; not a lesson topic | Administrative source. Verify against manifest, not add as lesson theory. |
| 5–16 | Polymer definition, classification, thermoplastic/thermoset/elastomer, architecture, crystallinity, crosslinking, tacticity, homopolymer/copolymer | T1 Fundamentals, Classification & Architecture; T5 Crystallinity | Core concepts represented in T1/T5. The source slides pp. 5–16 have been visually checked. The p. 16 SBR comparison is now added: increasing styrene content raises tensile strength and lowers elongation and abrasion resistance. Earlier slide concepts on classification, architecture, crosslinking and tacticity are already represented. |
| 17–20 | Step-growth and chain-growth polymerization | T2 Polymerization Mechanisms | Core mechanism distinction represented. Source-specific examples and exact slide claims still need final coverage check. |
| 21–32 | Solution, bulk, suspension, emulsion, micelles and melt polycondensation | T3 Polymerization Techniques | Main techniques and contrasts represented. Pages 28–30 have now been visually checked and the lecture's surfactant classes, surface-tension role, CMC and micelle structure/continuous phase are added. Page 31's particle-growth diagrams remain image-level evidence; no unsupported kinetic stages were inferred. |
| 33 | Thermoplastic versus thermosetting comparison | T1; T8 | Overlap/recap slide. Avoid duplicate content; check if any distinct comparison is missing. |
| 34–48 | Molecular weight, Mn/Mw, worked calculations, DP, MWD/PDI, property effects and determination methods | T4 Molecular Weight & Distribution | Core formulas and methods represented. The source's four-entity worked example from pp. 37–41 was missing and has now been added; source arithmetic/notation errors are explicitly flagged. Page 48 is figure-only and needs visual inspection before claiming the methods slide is fully captured. |
| 49 | Crystalline versus amorphous polymer examples | T5 Polymer Crystallinity | p. 49 visually checked and the source's crystalline/amorphous example lists and comparison properties have been added to T5. The printed “Modified Polyphenylene Oxide (POM)” name/acronym mismatch is flagged. |
| 50 | Functionality and functional-group examples | T2 Polymerization Mechanisms | p. 50 visually checked; the source table's functional-group counts and mono-/bi-/trifunctional examples have been added to T2. Chemical formula typography was not reconstructed where unnecessary. |
| 51–55 | Commodity polymer repeat-unit examples; nylon/polyamide examples | T8 Industrial Polymers | Named repeat-unit examples and nylon 6,6 / 6,10 lecture examples added. Structural diagrams remain source-derived labels, not reconstructed connectivity. |
| 56–63 | Structure–property design inputs, molecular weight, mechanical response, viscoelasticity, modulus and Tg/Tm | T5 and T6 | Core framework represented. Check the full source plots and the distinction between static and dynamic mechanical testing. |
| 64–68 | Tg structure comparisons, Tg factors and transition-related property changes | T6 Thermal Transitions | Representative Tg values and source ambiguity on p. 64 recorded. Page 67 long-alkyl-side-chain table remains unresolved pending image/table verification. |
| 69 | Nitrile rubber composition, polarity/immiscibility and applications | T8 Industrial Polymers | Core NBR information already represented; verify no distinct slide-specific application detail is omitted. |
| 70–79 | Biomedical biopolymers, protein structure, recombinant protein and spider-silk production | T7 Proteins — Natural Polymers | Biomedical examples, protein structure details, C16/ADF4 and p. 79 diagram transcription added. Diagram steps kept at the level explicitly labelled. |
| 80–109 | Commodity/engineering polymers, polyolefins, polyurethane, epoxy, melamine formaldehyde and TPEs | T8 Industrial Polymers | Source-specific content added in topic batches. Remaining figures and reaction schemes must be checked for exact labels/conditions before final freeze. |
| 110–114 | Composite definition, matrix classes, fibre/matrix roles, aspect ratio, fibre length and orientation | T9 Blends, Composites, Reactions & Degradation | Added. Page 112 printed fibre-diameter unit anomaly (10–150 mm) remains explicitly flagged. |
| 115–154 | Mechanical, viscoelastic, physical and transport properties; test methods and permeability | T10 Mechanical / Viscoelastic / Physical Properties | Source-specific additions and audit recorded. Multiple slide-level unit, label, endpoint and footnote ambiguities remain flagged; do not normalize without confirmation. |
| 155–206 | Natural rubber latex, compounding, cure systems, rheology, rubber processing, extrusion and mixing | T11 Compounding & Processing | Source-supported additions and visual checks added. Some figure-heavy process slides still need a page-by-page completeness check. |
| 207–212 | Degradation, aging, biodegradation, recycling and resin identification codes | T9 Blends, Composites, Reactions & Degradation | Added. Source category grouping and the p. 211/p. 212 code-3 wording difference are explicitly retained/flagged. |

## Newly recovered T4 source example — pp. 37–41

Visual inspection confirms the lecture's four-entity table:

| Entity | Count, nᵢ | Weight of each, Mᵢ (g) | Total weight (g) |
|---|---:|---:|---:|
| Poly-1 | 2 | 10 | 20 |
| Poly-2 | 4 | 20 | 80 |
| Poly-3 | 6 | 100 | 600 |
| Poly-4 | 3 | 250 | 750 |
| Total | 15 | — | 1,450 |

The lesson now includes the source example:
- (M_n = 1450/15 = 96.67\,g).
- (M_w = \sum w_iM_i = 171.93\,g).

Source anomalies preserved as warnings:
- p. 38 prints ((2/25)\times10=1.33), while its stated number fraction is (2/15); the displayed result 1.33 corresponds to (2/15).
- p. 41 contains an intermediate subscript inconsistency, using repeated (M_1) where the general summation uses (M_i).

The lesson retains grams because that is the unit printed on the source slide; it does not invent a more specific molar-mass unit.

## Explicit open audit items

1. **T1:** pp. 5–16 visually checked and the distinct p. 16 SBR composition trend added. Reconcile remaining slide labels and ensure no unique example is omitted.
2. **T2 / T3:** p. 50 functionality examples and p. 28–30 emulsion/micelle details are integrated. Remaining T3 figure checks: pp. 22–27 and p. 31 particle-growth diagrams.
3. **T4:** inspect p. 48's determination-of-molecular-weight diagram; confirm source example transcription against all pages 37–41. (The numerical worked example has been added.)
5. **T5 / T6:** p. 67 visually inspected. The slide states that increasing side-chain length decreases Tg, but the table is clipped at the bottom and some displayed values do not follow a simple monotonic sequence. No table values have been added; the exact table remains unresolved pending a complete source slide.
6. **T8:** complete figure-by-figure check of the industrial polymer and reaction slides, especially where structural schemes carry more information than extracted text.
7. **T10:** retain all existing source anomaly flags for p. 115–154 until the exact slide/units/footnotes can be verified.
8. **T11:** finish the figure/label check for compounding and processing diagrams pp. 155–206.
9. Reconcile the audit with all existing batch review documents and confirm every material lesson addition has a source-page citation.

## Freeze criteria

The coverage map is not ready to freeze until every meaningful source concept has:
- a destination topic/subtopic;
- an evidence pointer to a lesson section or an explicit missing/unclear status;
- a source page and, where available, source record IDs;
- an explicit decision on duplicate/overlap;
- a visual verification flag for diagrams, equations, tables and OCR exceptions.

Only after this freeze should the assessment blueprint be created. Question counts must be derived from learning objectives and existing question coverage, not the 2,449 extraction-record total.
