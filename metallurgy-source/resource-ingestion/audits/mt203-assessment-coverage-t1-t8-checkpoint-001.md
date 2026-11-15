# MT203 assessment coverage — targeted T1–T8 verification checkpoint 001

Date: 16 November 2026  
Branch: `feat/study-resource-ingestion-foundation`  
Source: `MT203 – PST 2026(2).pdf` (212 pages)  
Source SHA-256: `ba86baeb56d8bae0a0cd875cd1e4b63eac5cf11cb502d9e84e5ed52cc1f6e546`  
Compared with: `app/data/qbank/t1.ts`, `t3.ts`, `t4.ts`, `t5.ts`, `t7.ts` and the reconciled MT203 lesson.

## Purpose and limits

This checkpoint advances the preliminary T1–T8 assessment scan by checking exact question-file wording for five high-priority source objectives. It is a targeted prompt/explanation scan, not yet a complete objective-to-question crosswalk for T1–T8. No questions, IDs, counts, metadata, taxonomy, lesson text or learner data were changed.

The uploaded `(2)` PDF is byte-identical to the source previously audited: 9,508,248 bytes and the same SHA-256. The MT203 course identity remains Polymer Science and Technology; the legacy PDF metadata title does not remap the course.

## Verified targeted findings

| Topic | Source objective | Existing question-file evidence | Finding |
|---|---|---|---|
| T1 | p.16 SBR composition trend: increasing styrene content raises tensile strength and lowers elongation and abrasion resistance | Exact scan of all T1 source lines found no SBR/styrene-content/abrasion-trend prompt. Existing questions cover architecture, copolymers and elastomers generally. | **Confirmed assessment gap** — one focused source-aligned item is justified; avoid a generic SBR definition duplicate. |
| T3 | pp.22–23 solution-polymerization solvent removal, precipitation in a non-solvent, difficulty removing final solvent traces, and solution-form uses | T3 assesses chain transfer to solvent, technique selection and solution-vs-other process distinctions. Exact scan found no question testing the source's isolation sequence or its stated adhesive/coating use cases. | **Confirmed assessment gap** — assess separation/isolation and use-case reasoning, not another generic solvent/heat-transfer item. |
| T3 | pp.28–30 surfactant classes, CMC, micelle structure and aqueous emulsion system | T3 directly assesses micelles, CMC, surfactant-stabilized particles and emulsion-vs-suspension distinctions. | **Covered at concept level** — detailed coverage of all three surfactant classes still needs a full crosswalk before declaring exhaustive. |
| T4 | Molecular-weight determination methods and which average each method yields | T4 directly maps membrane osmometry to (M_n), light scattering to (M_w), sedimentation-equilibrium analysis to (M_z), viscometry to (M_v), and tests SEC/GPC calibration and limitations. | **Strong coverage** — the targeted scan did not find a direct sedimentation-velocity method item from the source p.48 method chart. Verify whether the reconciled lesson treats it distinctly before deciding whether a question is needed. |
| T5 | p.49 named crystalline and amorphous polymer examples and comparison properties | T5 directly tests typical semi-crystalline examples (HDPE, isotactic PP, PET, nylon 6,6) and amorphous examples (atactic PS, PMMA, PC), alongside morphology/property relationships. | **Representative examples covered** — not every polymer in the slide's lists is individually assessed; do not create one recall item per name without an objective-based reason. |
| T7 | pp.78–79 recombinant spider-silk production/application sequence | T7 assesses silk fibroin structure and mechanical strength, but exact scan found no recombinant spider-silk/ADF4 production or application prompt. | **Confirmed assessment gap** — a single integrated process/application item may be warranted after exact slide transcription. |

## Source-specific safeguards

- T1: preserve the lecture's exact directional claim for SBR; do not generalize it to all copolymers.
- T3: preserve the lecture's separation routes and stated limitations; do not imply that precipitation is the only isolation method.
- T4: the p.48 chart distinguishes sedimentation velocity and sedimentation equilibrium. Do not conflate the two or assign an average without checking the exact method.
- T5: the p.49 slide contains a printed polymer-name/acronym mismatch for modified polyphenylene oxide; preserve/flag the source wording rather than silently correcting it.
- T7: do not infer recombinant host, genetic construct, process conditions or application details beyond the p.78–79 source visuals/text.

## Next audit work

1. Complete exact question-to-objective crosswalks for T1–T8, including every native question format and explanation, not only keyword hits.
2. Inspect the relevant source visuals for T4 p.48 and T7 pp.78–79 before authoring any new item.
3. Reconcile T1–T8 with the existing T9–T11 assessment audit and all 305 live question IDs.
4. Run whole-bank checks for unique IDs, count parity, native formats, subtopic assignments, difficulty distribution, correct-option balance and answer-sequence patterns.
5. Only after the full audit, propose the exact number and content of new questions. Preserve all 305 existing questions and learner progress until a separately reviewed patch is approved.

## Current decision

- Confirmed targeted gaps: T1 SBR trend; T3 solution-polymer isolation/use cases; T7 recombinant spider-silk production/application.
- Follow-up verification: T4 sedimentation velocity; full T3 surfactant-class coverage; exact T7 source visual transcription.
- No question generation or question-bank edits performed.
- This checkpoint does not close the T1–T8 assessment audit.


## Visual-source verification addendum

The original PDF images for pages 48, 78 and 79 were rendered and inspected after the targeted question scan.

### T4 — page 48 determination-method chart

The chart explicitly groups methods by average:

- **Number-average molecular weight (Mn):** end-group analysis; colligative properties — cryoscopy (freezing-point depression), ebulliometry (boiling-point elevation), vapour-phase osmometry and membrane osmometry; GPC.
- **Viscosity-average molecular weight (Mv):** dilute-solution viscosity measurements — relative, specific, reduced, inherent and intrinsic viscosity.
- **Weight-average molecular weight (Mw):** ultracentrifugation by sedimentation-velocity and sedimentation-equilibrium methods; light scattering; GPC.

The T4 question-file scan directly tests membrane osmometry, light scattering, sedimentation-equilibrium analysis, solution viscometry and SEC/GPC. It does not show direct questions for end-group analysis, cryoscopy, ebulliometry, vapour-phase osmometry or sedimentation-velocity. These are **confirmed method-level assessment gaps** relative to the p.48 chart, subject to the final complete crosswalk. Do not write a single rote list question if distinct method-to-average discrimination can be tested more meaningfully.

### T7 — pages 78–79 recombinant spider-silk source

Page 78 identifies recombinant spider-silk protein C16/ADF4 (45 kDa), 16 repeats of a C16 module, and the printed sequence `GTSAGTSAGTSA`. It lists no toxicity, no immuno-reactivity, slow biodegradation and good mechanical properties. The diagram shows a dragline/core-shell structure and crystalline regions in an amorphous matrix.

Page 79 shows the production sequence: spider genetic information → plasmid carrying genetic information → *E. coli* → fermentation → protein. It also shows possible product forms: fiber, film, foam, hydrogel, particles, non-wovens and capsules.

The T7 question file tests silk-fibroin structure/mechanical strength but contains no direct prompt on this recombinant production route or the listed product forms. The gap is now visually confirmed. Any future question must stay within the diagram; do not infer cloning vectors, host engineering steps, fermentation conditions or purification details absent from the slide.


## Targeted T2, T6 and T8 verification — checkpoint 002

The exact question prompts and answer explanations in `t2.ts`, `t6.ts` and `t8.ts` were compared with the relevant lecture pages and the reconciled lesson. This remains an assessment audit only.

| Topic | Source objective | Existing assessment evidence | Finding |
|---|---|---|---|
| T2 | p.50 monomer functionality table: identify/count reactive groups and classify examples as mono-, bi- or trifunctional | Existing T2 questions assess Carothers stoichiometric balance, DP limits and step-growth generally. None directly tests the lecture's named functionality examples or asks the learner to count groups in a structure. | **Confirmed source-specific assessment gap.** A question should test group counting/classification (e.g. glycine/lactic acid/malic acid or the diacid/diol/diamine examples), without assuming unfamiliar chemistry beyond the slide. |
| T6 | pp.64–66 Tg values and the structural factors illustrated by named polymers: intermolecular forces, substituent size, backbone stiffness | Existing T6 includes generic factors, one broad “lowest Tg” recall item and Fox/Fox–Flory calculations. It does not directly assess the lecture's complete named comparisons or distinguish the source's four structural examples. | **Partial coverage.** Consider one structure-to-Tg comparison item rather than multiple isolated value-recall questions. |
| T6 | Source-value consistency for polyethylene Tg | Existing question `t6-06` gives polyethylene as approximately −120 °C. The lecture p.65 table and reconciled lesson give **−20 °C**. | **Source mismatch requiring review.** Do not silently change either value. Preserve the lecture's printed −20 °C as the source claim and decide separately whether the bank's −120 °C is an external reference value or a transcription error. No question edit made. |
| T6 | p.67 effect of increasing long linear alkyl side-chain length on Tg | Existing questions assess broad side-group/flexibility effects, but none directly tests the lecture's specific side-chain-length trend or representative vinyl-polymer series. | **Partial coverage.** Can be combined with the p.64–66 structural comparison objective if the stem remains unambiguous. |
| T8 | p.102 silicone-based TPU scheme: identify H12MDI, PTMG, PDMS-based diol and 1,4-BD, plus printed THF/DMAC and T-12 labels | T8 contains a general silicone-polymer question and broad polyurethane/thermoset material, but no direct question on the p.102 silicone-based TPU reactants or scheme. | **Confirmed source-specific assessment gap.** The scheme can support a reactant/component-identification or sequence question. Do not expand T-12, infer catalyst identity, or invent stoichiometry. |

### Source transcription safeguards

- **T2 p.50:** the slide's functionality is based on the number of reactive groups shown: acetic acid and benzoic acid are monofunctional; phthalic acid is bifunctional; ethyl alcohol and benzyl alcohol are monofunctional; ethylene glycol is bifunctional; aniline is monofunctional; hexyl diamine is bifunctional; methyl isocyanate is monofunctional; toluene diisocyanate is bifunctional; glycine and lactic acid are bifunctional; malic acid is trifunctional. Use the source's classifications; do not infer reaction pathways from the table.
- **T6 pp.64–66:** the lecture prints PVA 85 °C, poly(4-vinylpyridine) 142 °C, polyethylene −20 °C, polypropylene 5 °C, polystyrene 100 °C, poly(2-vinylnaphthalene) 151 °C, aliphatic polyester −63 °C, PET 80 °C and polybenzimidazole 429 °C. The p.64 polystyrene structure drawing contains a nitrogen label, which conflicts with the printed polymer name; retain the named/value pair only with this source ambiguity flagged.
- **T6 p.67:** the slide states that increasing the length of a linear alkyl side chain decreases Tg. Its table has crowded/overlapping structure labels; do not create a structure-identification numerical item from illegible row associations.
- **T8 p.102:** the visible labels are H12MDI, PTMG, PDMS, 1,4-BD, THF/DMAC and T-12. The output is titled “Silicone based TPU”. The slide does not provide explicit stoichiometric ratios or an expanded catalyst name.

## Revised targeted gap register

Confirmed source-specific assessment gaps from the targeted checks now include:
- T1: SBR styrene-content/property trend.
- T2: direct functionality counting/classification from the p.50 table.
- T3: solution-polymer isolation/use cases.
- T4: selected molecular-weight measurement methods from p.48.
- T7: recombinant spider-silk production/application sequence.
- T8: silicone-based TPU scheme at p.102.

Partial coverage / source reconciliation items:
- T3 surfactant classes and micelle details.
- T5 named crystalline/amorphous polymer examples.
- T6 named Tg/structure comparisons and side-chain-length trend.
- T6-06 polyethylene Tg value mismatch (bank −120 °C versus lecture −20 °C).
- T4 sedimentation-velocity and remaining method-level mapping.

No question-bank content, question IDs, counts, taxonomy, metadata, learner progress or lesson content was changed. The full T1–T8 audit remains open.
