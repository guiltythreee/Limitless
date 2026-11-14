# MT202 primary-topic and learning-objective mapping audit — 14 November 2026

## Scope

Inspected the 40 records previously flagged by comparing each primary curriculum topic with the topic prefix of the first mapped learning objective. The comparison is a review heuristic, not a validity rule: the primary topic can differ from the first objective where the question intentionally spans topics or the objective taxonomy is broader than the topic label.

## Result

- 32 question records received targeted metadata corrections.
- 8 records were retained after inspection because the topic/objective difference is intentional or reflects a taxonomy-boundary issue.
- All 522 question IDs remain present and unique.
- Every primary topic, related-topic ID and learning-objective ID resolves against the catalogue.
- Every quality total still equals the sum of its seven rubric dimensions.
- The 474-question heuristic quality queue is unchanged (141 High, 250 Medium, 83 Review); these are separate question-content review signals.

## Corrections

| Questions | Correction | Reason |
|---|---|---|
| ch01-q33 | Primary topic 1.4 → 1.5; 1.4 retained as related | Assertion–reason item tests potential-well depth, cohesive energy, melting point and elastic modulus. |
| ch01-q34 | Primary topic 1.3 → 1.2; 1.3 retained as related | Direct subshell-capacity calculation, mapped to the shell/subshell capacity objective. |
| ch02-q37 | Primary topic 2.4 → 2.3; 2.4 retained as related | Interplanar spacing and interpretation of crystallographic plane families, not a density calculation. |
| ch03-q67 | Primary topic 3.15 → 3.2; 3.15 retained as related | Heterogeneous nucleation shape-factor calculation. |
| ch03-q68 | Primary topic 3.2 → 3.5; 3.2 retained as related | Cooling-rate effect on dendrite refinement and primary dendrite-arm spacing. |
| ch05-q26, q27 | Primary topic 5.4 → 5.7; 5.4 retained as related | Items directly assess cross-slip and vacancy-mediated climb. |
| ch05-q52 | Primary topic 5.2 → 5.4; 5.2 retained as related | Mixed-dislocation character and Burgers-vector orientation. |
| ch05-q57 | Primary topic 5.1 → 5.5; 5.1 retained as related | Burgers-vector invariance along a mixed dislocation and Burgers-circuit interpretation. |
| ch05-q61 | Primary topic 5.7 → 5.6; 5.7 retained as related | Dislocation line-tension/strain-energy relation and Burgers-vector calculation. |
| ch05-q62, q63 | Primary topic 5.7 → 5.8; 5.7 retained as related | Slip-system geometry and Burgers-vector relations in FCC, BCC and HCP, matching the specific mapped objectives. |
| ch05-q70 | First objective changed to MT202-5.3.2 | Peierls–Nabarro lattice friction and theoretical-versus-actual strength are a better objective match than the Orowan/dislocation-density objective. |
| ch06-q44, q47 | Primary topic 6.3/6.2 → 6.4 | HCP c/a ratio, accessible deformation modes and twinning-related HCP behaviour; mapped objective 6.4.4. |
| ch06-q49, q53, q56, q57 | Primary topic aligned to 6.5 | These items assess the chapter's mapped objectives on work-hardening stages, skin passing/stretcher strains, deformation textures and temperature-sensitive BCC/FCC slip. Related topic 6.2 retained where relevant. |
| ch07-q58 | Primary topic 7.1 → 7.5; 7.1 retained as related | The item specifically tests stacking-fault energy, cross-slip and dynamic recovery. |
| ch08-q31 | Primary topic 8.5 → 8.4; 8.5 retained as related | General diffusion-coefficient factors and temperature sensitivity. |
| ch08-q39 | Primary topic 8.6 → 8.1; 8.6 retained as related | Vacancy formation plus migration contribution to substitutional diffusion activation energy. |
| ch08-q40–q44 | Primary topic 8.6 → 8.5; 8.6 retained as related | Kirkendall effect and lattice/grain-boundary/pipe diffusion paths. |
| ch09-q18 | First objective links corrected to 4.1.1, 4.5.1, 5.2.1 and 5.8.1 | This is an explicitly cross-topic confusable-pairs revision item; the prior first objective on edge/screw dislocations was unrelated to the first pair. |
| ch09-q49 | Primary topic 4.7 → 4.8; 4.7 retained as related | Directly tests overheating versus burning and the effective local solidus. |
| ch09-q52 | Primary topic 4.5 → 4.4; 4.5 retained as related | Lever-rule phase-fraction calculation. |
| ch09-q53 | Primary topic 2.2 → 6.2; 2.2 retained as related | Compares FCC/BCC/HCP slip systems; the former topic described crystal structures rather than the assessed slip concept. |
| ch09-q70 | Primary topic 6.1 → 7.5; 6.1 retained as related | Cold work, stored energy, recovery and recrystallisation are the central tested concepts. |

## Retained differences

The following eight records were not changed solely to force topic-prefix equality:

- **ch01-q7:** Pauli exclusion is explicitly covered by objective 1.2.4, while the primary topic 1.3 groups orbital filling and electron occupancy. Both labels are defensible.
- **ch03-q56:** Constitutional supercooling is a dedicated topic 3.14, while objective 3.5.3 describes the same mechanism under dendritic solidification.
- **ch05-q68 and ch05-q69:** Orowan relation and dislocation density sit under the broader dislocation-mechanics topic 5.7, while the current objective catalogue places them in objective 5.8.5. This is a catalogue-boundary inconsistency; do not silently rename either without a wider taxonomy decision.
- **ch06-q4:** Slip is the primary topic 6.2; objective 6.1.2 explicitly defines slip as dislocation-mediated shear. This is a reasonable cross-topic objective.
- **ch06-q41:** Cross-slip is a slip mechanism (topic 6.2); objective 6.5.8 describes its relation to recovery and strain hardening. The topic and objective are complementary.
- **ch06-q52:** Springback is the elastic recovery component of deformation (topic 6.1); objective 6.5.5 explicitly covers springback after unloading. Both are appropriate.
- **ch09-q56:** A multi-operation heat-treatment matching question spans homogenisation, solution treatment, ageing and annealing. Primary topic 4.7 and related topics 3.11, 7.4 and 7.5 preserve its mixed scope; a single objective-prefix comparison is insufficient.

## Validation and limitations

A remote structural parity check against the topic catalogue found no unresolved or unknown primary-topic IDs, related-topic IDs or learning-objective IDs. It also found 522 records, 522 unique IDs and no quality-total arithmetic errors. This is not a substitute for running the repository's Node validator and CI after the metadata commit.

The audit does not establish that all question content is scientifically correct. The 474 heuristic flags still require manual triage, especially numerical calculations, answer-key correctness, explanation alignment, structured-item logic and distractor plausibility. The original Markdown source bank is still external to this repository, so exact retained/lightly edited/substantially rewritten/replaced classification remains blocked.

No generated question JSON, deployed mirror, question ID, order, progress store or production deployment was changed in this mapping-only pass.
