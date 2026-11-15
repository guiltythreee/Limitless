# MT203 T10 lesson-to-source coverage audit

**Course:** MT203 — Polymer Science and Technology  
**Source:** `MT203 – PST 2026(1).pdf` (212 pages)  
**Source SHA-256:** `ba86baeb56d8bae0a0cd875cd1e4b63eac5cf11cb502d9e84e5ed52cc1f6e546`  
**Lesson source:** `metallurgy-source/app/data/lessons-mt203.ts`, topic `t10`  
**Audit scope:** lecture pages 123–154 compared with the current T10 lesson text  
**Status vocabulary:** covered · partially covered · missing · needs source-image verification

The lesson is evaluated against the supplied lecture, not against a generalized polymer-science syllabus. A broad concept mention is not treated as full coverage of a source-specific test method, specimen, diagram, standard or numerical procedure. No lesson or question-bank edits are included in this audit commit.

## Coverage matrix

| PDF pages | Source content | Existing T10 lesson coverage | Status | Finding |
|---:|---|---|---|---|
| 123–124 | Importance of mechanical properties; short-term, long-term and surface-property classifications; dependence on temperature, humidity, time, loading mode and loading rate | Lesson discusses mechanical properties and several dependencies across stress–strain, creep and impact, but does not preserve the lecture's short-/long-term/surface classification | partially covered | The classification is a distinct lecture framing and should be added if retaining the source's structure. |
| 125–126 | Definitions: stress, strain, gauge length, percentage elongation, elongation at yield/break, yield point/strength, proportional limit, tensile modulus and secant modulus | Lesson defines engineering stress/strain and distinguishes tensile/Young's and secant modulus; omits gauge length as a named term, proportional limit, yield-point definition and several elongation terms | partially covered | The core quantities exist, but not the lecture's complete terminology set. Preserve the lecture's distinction between yield point and yield strength. |
| 127–129 | Typical tensile stress–strain curve labelled A–F; molecular sequence: bond bending/stretching, elastic region, chain straightening, yield/necking, plateau/cold drawing, strain hardening, chain slippage/orientation and break; recoverable versus irreversible deformation | Lesson describes brittle/ductile/elastomeric curve families and key curve metrics, but not the lecture's A–F molecular-stage explanation or the source's stated sequence | partially covered | Source-specific diagram and mechanism narrative are absent. Page 127 image is essential for mapping A–F correctly. |
| 130–131 | Tensile-property significance and definitions of tensile strength, tensile modulus, elongation at yield and elongation at break | Lesson includes tensile strength, modulus and elongation in its tensile section | covered | Core definitions are present, although the detailed test setup and formula sequence are separate below. |
| 132 | Tensile standards: ASTM D638, IS-8453, JIS-7113, ISO-1184, BS-2782; dumb-bell specimen; ISO/DIS 527 Type 1 broad-waisted specimen drawing and dimensions | Lesson names ASTM D638 but not the other standards, dumb-bell specimen type or drawing dimensions | partially covered | Source-specific specimen geometry and standard list are not covered. The slide image must remain the authority for dimensions. |
| 133–134 | Universal testing machine; tensile strength, yield strength, break strength, tensile modulus and elongation formulae, with N and mm-based units | Lesson includes engineering stress/strain and an illustrative calculation; omits the source's full formula set for yield and break and the UTM illustration | partially covered | Existing worked example is useful but does not replace the lecture's test outputs. |
| 135–137 | Brittle/plastic and elastomer tensile response; microstructural deformation diagrams; temperature and strain-rate effects on thermoplastic stress–strain response | Lesson gives generic brittle, ductile and elastomeric curves, but does not include the source's temperature/strain-rate plot and its stated trends | partially covered | p137 explicitly states decreasing temperature or increasing strain rate increases modulus and tensile strength while decreasing percentage elongation. |
| 138–139 | Flexural properties; three-point and four-point loading systems; flexural strength and flexural modulus; rectangular-bar specimens; combined tensile/compressive stresses | No dedicated flexural section in the current lesson | missing | This is a substantial missing mechanical-test method, not covered by the generic tensile section. |
| 140–142 | Flexural standards ASTM D790, JIS-7203-1982, BS-2782; specimen form; test setup; crosshead-rate relation R = Zl²/(6d); deflection relation D = rl²/(6d) | No flexural standards, specimen/test procedure or formulae in lesson | missing | The formulas and symbols should be transcribed exactly from the slide before any lesson addition. |
| 143–144 | Impact definition and toughness relationship; impact modifiers; ASTM D256 A/B, ASTM D1822, JIS K-7111 and 7112; pendulum, Izod and Charpy tests | Lesson explains impact resistance, toughness and Izod/Charpy/falling-dart tests; omits the lecture's standards and its exact method classification | partially covered | Main concept is covered, source-specific standards and method taxonomy are not. |
| 145–147 | Izod and Charpy specimen diagrams/dimensions; Izod vertical clamping and striking-edge orientation; Charpy horizontal simply-supported specimen; reporting units and acceptance condition | Lesson names Izod and Charpy but not specimen dimensions, fixture orientation, complete-break acceptance or source reporting units | partially covered | Visual diagrams contain examinable distinctions. p145 specimen drawing is essential; do not infer dimensions from OCR. |
| 148 | Creep under constant load; initial rapid strain followed by continuing time-dependent deformation; long-term service relevance | Lesson defines creep and its primary/secondary/tertiary stages and applications | covered | Lesson is more detailed than the slide while retaining the same core definition. |
| 149–150 | Stress relaxation under fixed deformation; load required to maintain strain changes with time; creep/relaxation plot; definitions of stress-optical sensitivity and stress concentration | Lesson defines stress relaxation and now includes the source's stress-optical sensitivity and stress-concentration definitions (added in commit 068d84f) | covered | The two additional definitions were added source-faithfully; the p149 graph remains a visual reference. |
| 151 | Mechanical recycling of thermosets by grinding/particulation; thermoplastics by remelting/extrusion/pelletization; chemical recycling into monomers, fuels and energy | T10 lesson does not cover recycling; the source maps this slide to T9 | cross-topic / T9 | Do not duplicate into T10 solely because it follows the mechanical-property section. Audit against T9. |
| 152 | Permeability definition; absorption, diffusion and desorption; factors including solubility/diffusivity, chain packing, side-group complexity, polarity, crystallinity, orientation, fillers, humidity and plasticization | Lesson explains solution–diffusion and now includes the explicit absorption–diffusion–desorption sequence and all factors listed on p. 152 | covered | The p. 152 factors are listed without assigning directions the slide does not provide. |
| 153 | Permeability coefficient P definition and equation; solubility coefficient S definition; P = D × S; units for P, D and S | Lesson includes P = D × S and now records the units explicitly shown for P, D and S on the source slide | partially covered | **Updated after visual inspection:** p. 153 explicitly supplies units for $P$, $D$ and $S$. The lesson now records $P$ in $\\text{cm}^3\\cdot\\text{cm}/(\\text{cm}^2\\cdot\\text{s}\\cdot\\text{Pa})$, $D$ in $\\text{cm}^2/\\text{s}$, and $S$ in $\\text{cm}^3(\\text{STP})/(\\text{cm}^3\\text{ polymer}\\cdot\\text{Pa})$. The p. 154 table still leaves the units/scaling convention of $P_0\\times10^7$ and the units of $\\Delta E$ unexplained; superscript footnotes $a$ and $b$ are not defined on that slide. |
| 154 | Table 4.5, permeability in polymers at 25 °C; polymer/permeant rows; P, P₀ and ΔE columns; superscript markers on amorphous PET and PVDC | Lesson transcribes the table and warns against dimensional calculations, but does not reconcile the table headings with p153's unit definitions or explain the slide's superscript markers | needs source-image verification | p154 image is legible. p153 gives base units for P, D and S; confirm the scaling factors and the meaning of the superscripts before removing the qualification. |

## Summary

- **Covered:** pages 130–131 and 148.
- **Partially covered:** pages 123–129, 132–137, 143–144.
- **Missing:** pages 138–142 (flexural properties and test method).
- **Needs source-image verification:** page 154 (table scaling/footnotes and exact transcription).
- **Cross-topic / T9:** page 151.

The largest confirmed lesson gap is the entire flexural-properties test sequence (pages 138–142). The next major gap is the lecture-specific tensile and impact test specimen/method detail. The existing T10 lesson's conceptual overview does not fully represent these source sections.

## Visual checks performed for this audit

Rendered and inspected pages 127, 132, 133, 138, 141, 145, 149, 152, 153 and 154:
- p127: A–F tensile stress–strain curve and labels.
- p132: dumb-bell tensile specimen, gauge marks and dimensions.
- p133: universal testing machine images.
- p138: three-point and four-point flexural loading descriptions.
- p141: flexural test setup, bending stresses and four-point loading diagram.
- p145: Izod and Charpy specimen geometry and notch position.
- p149: creep and stress-relaxation plot.
- p152: permeability stages and source-listed factors.
- p153: P and S definitions, P = D × S and units.
- p154: permeability table at 25 °C.

The page images are authoritative for diagram layout and small labels. This sample does not constitute a full visual audit of every page in the PDF.

## Recommended lesson revision sequence (not applied)

1. Add a source-faithful flexural section: three-/four-point bending, rectangular specimen, standards and formulae (pp. 138–142).
2. Expand tensile testing with the source's named specimen, standards, yield/break formulae and A–F deformation sequence (pp. 127–137).
3. Add the Izod/Charpy specimen and fixture distinctions plus source standards (pp. 143–147).
4. Add stress-optical sensitivity and stress concentration definitions (p. 150).
5. The p. 153 units for $P$, $D$ and $S$ have now been incorporated. The p. 154 $P_0$ scaling, $\\Delta E$ units and superscript footnotes remain unresolved (pp. 152–154).
6. Keep p151 in the T9 audit, not duplicated into T10.

## Scope and safety boundary

- No lesson text has been edited.
- No question-bank content, IDs, counts, difficulty metadata or taxonomy has been edited.
- No learner progress or generated exports have been changed.
- No extracted candidate has been approved by this lesson audit.
- Question authoring remains gated until T9 is reconciled and all confirmed lesson gaps are reviewed.


## Follow-up lesson changes

- T10 now includes the two p. 150 definitions: stress-optical sensitivity and stress concentration.
- T10 now lists all p. 152 permeability factors without inventing directional effects.
- T10 now records the p. 153 units for $P$, $D$ and $S$. The p. 154 $P_0$ scaling, $\\Delta E$ units and superscript footnotes remain unresolved.
- Lesson update commit: `068d84f70d9577d74c45b770f1ca4f51a480be10`.
