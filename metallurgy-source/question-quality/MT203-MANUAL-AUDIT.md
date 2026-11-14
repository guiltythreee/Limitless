# MT203 manual question-quality audit

**Status:** In progress  
**Scope:** 286 questions across 11 topics in `app/data/qbank/t1.ts` through `t11.ts`  
**Branch:** `mcq-qs-validator`  
**Audit rule:** Findings are recorded; source questions and answer keys are not changed by this audit.

## Why this audit exists

The shared quality-engine CI passing is not equivalent to an academic review. The current core validator primarily checks record structure: ID, stem presence, explanation presence, declared difficulty, option count, unique option IDs, nonempty option text, and the number of options marked correct. It does not independently establish scientific correctness, answer uniqueness, distractor plausibility, explanation validity, or appropriate difficulty.

The MT203 profile currently registers only the `single-choice` format. The source bank also contains numerical, assertion-reason, match, sequence, and graph question types. The MT203 adapter maps these types, but a format mapping is not itself a format-specific quality review.

## Sampled manual review

These are real source records, not synthetic test fixtures.

| Question | Review | Findings |
|---|---|---|
| T1-02 — polyethylene repeat unit | Pass with wording note | Correct chemistry and answer. “Permanently irreversible” is too absolute; prefer saying the monomer C=C bond is consumed in addition polymerization and is not retained in the repeat unit. |
| T1-06 — monomers and repeat units | Pass | Correct distinction between degree of polymerization of a chain and total monomer feed. |
| T1-07 — number-average DP | Pass | (56{,}000/28=2{,}000); calculation and units are correct. |
| T1-14 — PVA assertion–reason | Content pass; adapter issue | The chemistry is sound: vinyl alcohol tautomerizes and PVA is made by hydrolysis of PVAc. However, the adapter's assertion/reason fallback joins the statements with a literal backslash-n sequence rather than an actual newline. |
| T2-03 — free-radical rate | Pass | Steady-state expression gives (100(5)\sqrt{10^{-2}/10^6}=0.05\;\mathrm{mol\,L^{-1}\,s^{-1}}), matching option C. |
| T3-05 — emulsion polymerization | Pass | Compartmentalization correctly explains how high rate and high molecular weight can coexist. Explanation is concise but scientifically appropriate for this level. |
| T4-02 — (M_n), (M_w), PDI | Pass | (M_n=12{,}500\), (M_w=14{,}000\), PDI (=1.12); option C is correct. |
| T5-10 — DSC of quenched PET | Pass with distractor note | Step/exotherm/endotherm assignments are correct: (T_g), cold crystallization, (T_m). Only one distractor has an explicit misconception explanation in the source record. |
| T7-12 — wool felting assertion–reason | Pass with precision note | The intended scales/friction/agitation mechanism is correct. The wording could distinguish the wool-fibre cuticle scales from the keratin fibre material more precisely. |
| T8-29 — autoclave-rated labware | Pass | PP is a defensible first choice, and the grade-specific qualification correctly avoids implying that every PP grade tolerates repeated autoclaving. |
| T9-16 — axial composite modulus | Pass | Voigt rule gives (230(0.60)+3.5(0.40)=139.4\;\mathrm{GPa}), matching option B after rounding. |
| T10-12 — Maxwell relaxation time | Pass | (	au=\eta/E=10^9/10^6=1{,}000\;\mathrm{s}), matching option C. |
| T11-08 — injection moulding sequence | Pass | The simplified cycle order is clamping, filling, packing/holding, cooling/plastication, ejection: option C. |

## Confirmed engineering findings

1. **Assertion–reason adapter separator bug:** `adapters/mt203.mjs` uses a literal escaped separator in the fallback stem. The normalized stem contains the characters `\\n`, not a line break. The current unit test expects that same literal sequence, so it locks in the bug instead of detecting it.
2. **Incomplete format-profile coverage:** `profiles/mt203.mjs` registers only `single-choice`, while the adapter maps numerical, assertion-reason, match, sequence, and graph records as well. These formats need their own profiles and rule sets before the shared engine can be said to validate them adequately.
3. **Synthetic adapter fixture is not a bank audit:** the MT203 adapter test validates a small constructed example and checks type mapping. It does not prove all 286 real records have passed substantive review.
4. **Distractor/explanation coverage needs a dedicated check:** sampled questions such as T5-10 do not provide a misconception explanation for every incorrect option. This should be reported as a review issue, not automatically treated as a scientific error.

## Audit limits and next work

This is a sampled manual review, not yet a certification of all 286 questions. The reviewed records are mostly sound, but the sample cannot establish the quality of unsampled records. Continue topic-by-topic, prioritizing numerical answer recomputation, assertion–reason logic, graph/data interpretation, ambiguous stems, and distractor/explanation completeness.

No source question, answer key, stable ID, learner attempt, or UI has been modified by this audit.
