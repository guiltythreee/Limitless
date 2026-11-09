# MT201 material expansion — source audit and question plan

Date: 2026-11-10
Branch: feat/mt201-material-expansion-20261110

## Objective

Expand the existing MT201 archive using the newly supplied lecture notes, derivations, worked solutions, and diagrams. Preserve all existing 289 questions, their IDs, the `mm-mt201-v1` progress keys, bookmarks, attempt history, reward records, and the timed Exam Simulator.

The standalone `MT201_Thermodynamics_MCQ_Bank.html` is an earlier independent presentation. The live Limitless MT201 archive is the canonical integration target: `metallurgy-source/public/data/mt201/`, mirrored to `metallurgy/data/mt201/`.

## Existing live baseline

- 14 chapters, 289 questions.
- Chapter distribution: ch01 15, ch02 8, ch03 20, ch04 20, ch05 26, ch06 26, ch07 14, ch08 28, ch09 27, ch10 27, ch11 28, ch12 22, ch13 12, ch14 16.
- All 289 current questions have a non-empty detailed solution.
- Six question types already supported: direct (A), statement (B), assertion–reason (C), match (D), numerical (E), true/false (F).
- Exam Simulator draws randomly from all topics declared by the MT201 manifest. New topics must therefore be added to the manifest and loader registry, not hard-coded into the exam.

## Supplied source inventory and intended coverage

| Material | Source-derived scope to assess and cover |
|---|---|
| TM-6.pdf | Solution definitions and composition units; mole/atom/weight fractions; partial molar quantities; molar and partial molar Gibbs energy; Gibbs–Duhem equation; Raoult's and Henry's laws; activity/solution non-ideality; solidification partitioning, Scheil assumptions and microsegregation |
| TM-7.pdf | Sieverts' law for diatomic gases dissolved in metals; pressure dependence; solubility calculations and unit conversions; metallurgical applications and limits |
| RegularSolutionModel.pdf | Statistical bond model; A–A, B–B and A–B bond energies; coordination number; regular-solution enthalpy and ideal configurational entropy |
| FloryModel and Subregularsolutions.pdf | Flory–Huggins entropy correction for polymer chain length and volume fractions; interaction parameter; asymmetric subregular solution behavior and activity coefficients |
| Subregular solution Model-Discussion.pdf | Composition-dependent asymmetric interaction parameter; boundary limits; symmetric versus asymmetric enthalpy and miscibility-gap shape |
| Spinodal.pdf | Local stability from first/second derivatives; metastability and instability; spinodal points; critical point and regular-solution curvature |
| G_behindphasediargrams.pdf | Gibbs-energy construction behind binary isomorphous phase diagrams; pure-component reference line and phase free-energy curves; common-tangent/equilibrium interpretation |
| G_XtoT_X.pdf | Cu–Ni ideal-solution G–X curves at 1420, 1500, 1580 and 1660 K; solid/liquid free energies; temperature-dependent phase stability and reading the corresponding phase diagram |
| partial_molar_excess_gibbs_component_B_derivation.pdf | Derivation of component B partial molar excess Gibbs energy by product/chain rules, compared with component A |
| Solutions_MidSem2026.pdf | Variable heat-capacity energy balance and final temperature; heat transfer and entropy generation; third-law/configurational entropy; reaction Gibbs energy and equilibrium constant; Ellingham-line intersection; Landauer limit; electrochemical work; fugacity |
| ElectrchemicalThermodynamics.pdf | Reversible cells; galvanic/concentration cells; cell notation and polarity; Gibbs energy–EMF relation; Nernst equation; temperature coefficient/entropy relation; electrolytes, electrochemical potential and Wagner transport concepts |
| Kinetics.pdf | Thermodynamics versus kinetics; homogeneous/heterogeneous reactions; rate laws, order and molecularity; integrated rate laws and half-life; Arrhenius equation and activation energy; experimental order determination; collision and transition-state theory |
| HEA_ppt.pdf | High-entropy alloy definition and configurational entropy; entropy/enthalpy competition in ΔGmix; empirical phase-stability rules; short-range order; four core effects including sluggish diffusion where explicitly supported |

## Planned additions

Keep existing chapters ch01–ch14 and all their question IDs unchanged. Add three clearly scoped chapters:

- ch15 — Electrochemical Thermodynamics
- ch16 — Metallurgical Kinetics
- ch17 — High-Entropy Alloys

Also add targeted new questions to ch04–ch13 where the uploaded materials provide deeper coverage than the current bank: variable heat-capacity numericals; partial molar/Gibbs–Duhem/activities; regular, subregular and Flory–Huggins derivations; G–X/T–X and phase-stability calculations; Ellingham/reduction; Sieverts' law and solubility conversions.

The additions should be deliberately mixed:
- direct conceptual discrimination;
- statement and assertion–reason questions;
- derivation/interpretation questions;
- numerical MCQs with complete working, units and a final answer;
- multi-step exam-style numericals where the existing UI supports a single best answer (e.g. final calculated value or conclusion).

Do not create duplicate paraphrases of existing questions. Use distinct question IDs within each chapter and update index/manifest counts from actual validated files.

## Source-quality safeguards

1. Every new question must map to at least one supplied source and a specific topic/page or derivation.
2. Every numerical must state sufficient data, use consistent standard units, show the governing equation, substitutions, unit conversion and final result.
3. Do not copy incorrect or ambiguous claims from worked notes without flagging them. In particular:
   - The mid-semester solution's fuel-cell paragraph correctly begins with ΔG < 0, but later contains a contradictory sentence claiming a spontaneous fuel-cell reaction has ΔG > 0. Use the consistent relation ΔG = -TΔS_universe and flag the source typo in the audit.
   - The spinodal notes use the phrase “convex downward” while also giving d²G/dX² > 0 for stable curvature. Avoid relying on that contradictory shape label; test stability using the derivative sign and explain the mathematical convention clearly.
4. Distinguish source-derived material from any necessary standard thermodynamic identity used to resolve an obvious source typo. Do not silently add topics unsupported by the supplied notes.
5. Preserve original question text/answers unless a separate, fingerprint-guarded authored revision is explicitly made.
6. Preserve both canonical source JSON and deployed mirror JSON; update regression tests and quality validation for the expanded question count and all chapter IDs.
7. Build and run the MT201 regression, question-quality validation, and relevant Metallurgy tests before proposing merge or deployment. No live deployment until checks pass.

## Implementation notes

- The MT201 exam already builds its random pool from the manifest topics; avoid changing answer recording, grading, timer, progress, or storage behavior.
- Existing question IDs are `chNN-qN`; additions must append to the corresponding chapter and keep existing numbers stable.
- Extend the durable MT201 content-revision pipeline to support additive authored questions, so re-running the legacy bank sync cannot erase the new material.
- Keep the generated `metallurgy-source/public/data/mt201/` and `metallurgy/data/mt201/` copies byte-equivalent at the parsed JSON level.
