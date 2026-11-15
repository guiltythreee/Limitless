# MT203 T10 source-to-lesson audit — lecture pages 115–154

Status: **topic-level review completed; full 212-page programme remains active**  
Source: `MT203 – PST 2026(1).pdf`  
Source SHA-256: `ba86baeb56d8bae0a0cd875cd1e4b63eac5cf11cb502d9e84e5ed52cc1f6e546`  
Destination: Module 3, T10 — Mechanical, Viscoelastic & Physical Properties  
Lesson: `app/data/lessons-mt203.ts`  
Branch: `feat/study-resource-ingestion-foundation`

## Scope and method

Reviewed the source text for PDF pages 115–154 against the current T10 lesson. This is a source-to-lesson coverage check, not approval of all 2,449 extracted records. The lecture PDF's page numbering was checked against the PDF page sequence. Source wording and anomalies are preserved where relevant; no unsupported correction or unit conversion was made.

## Page-level reconciliation

| PDF page(s) | Source content | Existing lesson coverage / action | Status |
|---|---|---|---|
| 115–117 | Rheology definition; Newtonian and non-Newtonian flow; Newtonian examples | T10 Rheology already distinguishes Newtonian/non-Newtonian behaviour; added the lecture's listed Newtonian examples. | Covered |
| 118 | Pseudoplastic shear thinning; examples | T10 distinguishes shear-rate dependence from thixotropy; added lecture examples: lava, ketchup, whipped cream, blood, paint and nail polish. | Covered |
| 119 | Dilatant shear thickening; starch/wheat-powder example | T10 already covers shear thickening; added the lecture's water + corn starch / wheat powder example. | Covered |
| 120 | Thixotropy, time-dependent shear thinning | T10 already distinguishes time-dependent viscosity decrease at fixed shear rate. | Covered |
| 121 | Bingham plastic; chocolate, toothpaste, mayonnaise | T10 already defines yield-stress behaviour; added all three lecture examples. | Covered |
| 122 | Strain-induced crystallization; stretching above Tg | Added a source-linked section with the lecture's definition and stated condition. No polymer examples or numerical limits are supplied on this slide. | Covered |
| 123–124 | Importance and classification of mechanical properties; short-term, long-term and surface properties | T10 includes short-term / long-term classification and engineering property context. | Covered |
| 125–126 | Stress, strain, gauge length, elongation, yield, proportional limit, Young's and secant modulus | T10 includes the definitions and distinguishes tangent and secant modulus. | Covered |
| 127–129 | Typical tensile stress–strain curve and molecular deformation stages | T10 records A–B, A–C, C–D, D–E and E–F text. The source discrepancy remains flagged: p. 127 plot labels E “break”, while p. 129 prose describes failure at F. | Covered with source ambiguity |
| 130–134 | Tensile properties, standards, dumb-bell specimen, testing machine and equations | T10 includes tensile strength, modulus, elongation, listed standards, specimen type and formulae in N and mm². | Covered |
| 135 | Brittle and plastic tensile responses | T10 includes brittle, ductile and elastomeric curve interpretation. | Covered |
| 136 | Elastomer response: kinked cross-linked chains straighten but remain cross-linked; reversible deformation | Added the lecture's schematic description and reversibility statement. | Covered |
| 137 | Temperature and strain-rate effects | T10 includes the three stated trends and preserves the slide's “semicrystalline polymer: PMMA (Plexiglas)” label exactly as printed. | Covered with source wording preserved |
| 138–142 | Flexural testing, strength/modulus, standards, specimen, three-/four-point loading and equations | T10 includes these details and preserves the source inconsistency between the 0.05 mm/min sentence and the stated strain unit mm/mm. | Covered with source ambiguity |
| 143–147 | Impact strength, Izod/Charpy methods, specimens and procedures | T10 includes the source's general J/m unit separately from the ft-lb-based pendulum test readings/reporting. | Covered; units kept source-specific |
| 148–150 | Creep, stress relaxation, stress-optical sensitivity and stress concentration | T10 includes definitions and engineering relevance. | Covered |
| 151 | Mechanical and chemical recycling routes | This page belongs to T9 (Blends, Composites, Modification & Degradation), not T10. Do not duplicate it into T10. | Correctly routed to T9 |
| 152–154 | Permeability; factors; solution–diffusion and table | T10 contains P = D × S, source-listed factors, the page 154 table and explicit warnings about undefined scale/footnote notation. | Covered with source ambiguity |

## Explicit source limitations retained

1. **Tensile curve, p. 127 vs p. 129:** plot and prose disagree on whether E or F is the failure point. The lesson preserves the prose sequence and flags the mismatch.
2. **Flexural equations, p. 142:** the sentence states 0.05 mm/min for the outer-fibre strain limit, while the variable definition gives strain in mm/mm. No conversion or correction is assumed.
3. **Temperature/strain-rate slide, p. 137:** “semicrystalline polymer: PMMA (Plexiglas)” is retained verbatim as the source label; it is not corrected from outside convention.
4. **Impact units, pp. 143, 146–147:** the slide gives J/m generally but gives in-lb/ft-lb scale readings and ft-lb/in reporting for the pendulum procedures. These remain separate source statements.
5. **Permeability table, p. 154:** columns are printed as P × 10^13, P₀ × 10^7 and ΔE. The scaling convention, P₀ definition, ΔE units/meaning and superscript footnotes a/b are not defined on the slide. Do not use the table for dimensional calculations or infer the missing footnotes.

## Changes made during this audit

- Added source-specific strain-induced crystallization description from p. 122.
- Added the p. 136 elastomer response diagram's reversible chain-straightening description.
- Added the p. 117–121 rheology examples and Bingham-plastic examples.
- Kept p. 151 recycling assigned to T9.
- No question-bank files, question IDs, learner progress or metadata counts were changed.

## Remaining programme work

This audit closes the current T10 source-page batch only. It does **not** close the full source-to-course programme. The remaining work is to complete/verify the other topic batches, consolidate the complete concept inventory, identify any cross-topic duplicates, freeze lesson coverage, and then build the assessment blueprint before adding questions.
