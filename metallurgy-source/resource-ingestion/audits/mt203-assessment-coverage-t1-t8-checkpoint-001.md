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
