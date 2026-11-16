# MT203 T9–T11 source-to-lesson reconciliation

**Course:** MT203 — Polymer Science and Technology  
**Source:** user-provided 212-page MT203 lecture PDF; SHA-256 `ba86baeb56d8bae0a0cd875cd1e4b63eac5cf11cb502d9e84e5ed52cc1f6e546`.  
**Branch:** `feat/study-resource-ingestion-foundation`  
**Status:** reconciliation plan only; no lesson or question-bank edits.

## Audit records reconciled

- T9, source pages 207–212: `audits/mt203-t9-lesson-source-coverage.md`
- T10, source pages 123–154: `audits/mt203-t10-lesson-source-coverage.md`
- T11, source pages 174–206: `audits/mt203-t11-lesson-source-coverage.md`

These audits cover selected topic ranges, not the entire course PDF. T9's earlier source ranges (including blends, composites and modification material) are not re-audited by its pages 207–212 report. Existing lesson material outside each audited range must not be treated as unsupported merely because it is absent from that range.

## Consolidated change register

### T9 — degradation, biodegradation and recycling (pp. 207–212)

**Add or clarify from the lecture:**
1. Define degradation as a change in polymer/product properties under environmental influences; include *aging* and the lecture's desirable/undesirable distinction (p. 207).
2. Preserve the historical statement and qualitative plot showing molecular weight, strength and mass decreasing with time (p. 208).
3. Present the lecture's four categories—photoinduced, thermal, chemical and biological—separately from the lesson's existing more detailed mechanism table (p. 209). The slide's examples under “thermal” require subject-matter review before any explanatory reclassification; do not silently rewrite the source list.
4. Add the biodegradation mechanism structure: enzymatic degradation, hydrolysis, anhydride > ester > carbonate, homogeneous and heterogeneous degradation, and the biomedical-application statement (p. 210).
5. Add the recycling routes listed on p. 211: making polymers degradable, incinerating combustible polymers, remolding, blending, depolymerization and finding innovative uses for used polymers. Include the 1988 SPI voluntary Plastic Container Coding System context.
6. Preserve the p. 211/p. 212 code-3 difference: table says “V or PVC”; visual chart says “V”. Do not collapse this into a single source claim.

**Keep distinct:** Existing lesson content on compatibilization, rule of mixtures, polymer modification, stabilizer chemistry and biodegradable-polymer examples is not assessed by pp. 207–212. Do not delete or rewrite it on the basis of this audit.

### T10 — mechanical, impact, flexural and permeability properties (pp. 123–154)

**Highest-priority missing section:**
1. Add flexural properties and test methods from pp. 138–142: three-/four-point loading, rectangular specimen, standards and source equations. Transcribe symbols and formulae from the inspected slide images; do not reconstruct them from memory.

**Next source-specific expansions:**
2. Tensile terminology and deformation sequence (pp. 123–129): short-/long-term/surface classification; gauge length, elongation at yield/break, yield point/strength, proportional limit; A–F curve and molecular deformation sequence.
3. Tensile standards/specimen/test outputs (pp. 132–134): full standards list, dumb-bell/ISO specimen, UTM and yield/break formulae.
4. Temperature and strain-rate trends (pp. 135–137).
5. Impact test standards and exact Izod/Charpy specimen, fixture and reporting details (pp. 143–147).
6. Stress-optical sensitivity and stress concentration (pp. 149–150).
7. Permeability stage sequence and complete factor list (p. 152).

**Mandatory correction before any T10 edit:** p. 153 explicitly gives base units for P, D and S and states P = D × S. The existing lesson's blanket statement that the source does not provide unit definitions is inaccurate. However, p. 154's scaled table headings and superscript markers still need a deliberate reconciliation with those base units. Do not remove the lesson's qualification until the scaling factors and markers have been checked against the page image.

**Keep in T9:** p. 151 is a recycling slide and was correctly marked cross-topic in the T10 audit. Do not duplicate it into T10.

### T11 — polymer processing (pp. 174–206)

**Highest-priority missing sections:**
1. Screw variants and heating methods (pp. 183–184): general-purpose, PVC, nylon, two-stage/vented and segmented screws; electric/fluid/steam heating and electric-heater subtypes.
2. Four mill-processibility regions (p. 206), which are absent from the current lesson.

**Next source-specific expansions:**
3. Twin-screw arrangements and lecture-specific co-/counter-rotating comparisons (pp. 188–191).
4. Distinct blown-film extrusion line and labelled components (pp. 193–195); do not conflate it with parison blow moulding.
5. Compression-moulding sequence, flash removal and source's thermoplastic/thermoset heating distinction (pp. 196–198), retaining the source-specific qualification.
6. Plunger versus reciprocating rotating-screw injection systems and sprue/runner/gate/multi-cavity terminology (pp. 199–200).
7. Full ordered mill-mixing procedure and four-region behaviour (pp. 202–205), preserving the slide's sequence and values as lecture-specific procedure.
8. Consider process–structure framing, batch/continuous taxonomy, nominal screw specifications, and full extrusion applications/material matrix (pp. 174, 177, 181–182).

**Already substantially represented:** basic extrusion flow and components, feed/compression/metering zones, extrudate swell, shark-skin/bambooing and core milling principles. Avoid rewriting these sections unnecessarily.

## Recommended implementation order

1. **Resolve source transcription items first:** T10 p. 154 table scale/footnotes; T10 p. 140–142 flexural equations; T11 p. 188–191 comparison table; T11 p. 205 procedure values; T9 p. 209 thermal-example wording. Each should be checked against the original rendered slide before editing.
2. **Draft narrowly scoped lesson patches** in the existing T9/T10/T11 topic blocks. Preserve topic IDs, topic order, course manifest and section organization unless the source itself requires a small subsection.
3. **Keep source statements and explanatory additions distinguishable.** Do not silently replace unusual lecture wording with textbook convention. Where a source statement appears ambiguous or questionable, quote/record it and add a review note rather than correcting it without evidence.
4. **Review the full diff before commit.** Confirm no changes to qbank IDs/counts/difficulty/taxonomy, learner progress, exports, or unrelated courses.
5. **Run focused lesson/type/build checks and the full relevant regression suite.** Report check status for the exact resulting commit; do not inherit pass status from older commits.
6. Only after lesson content is approved and stable should question-bank coverage and question creation resume.

## Scope safeguards

- Do not change the existing 305 MT203 questions during lesson reconciliation.
- Do not generate questions from unreviewed extracted records.
- Do not modify MT202 Physical Metallurgy or MT203 course/topic taxonomy.
- Do not merge PR #246 or deploy without explicit instruction.
- Preserve all source references and the existing ingestion validation backup.

## Current Git checkpoint

T9 audit commit: `71924883bd59da2285c18b4e9f4fc6191d7b50aa`.  
PR #246 remains draft/open/unmerged. The T9 audit commit had zero check-runs when checked; it is not claimed as CI-verified.
