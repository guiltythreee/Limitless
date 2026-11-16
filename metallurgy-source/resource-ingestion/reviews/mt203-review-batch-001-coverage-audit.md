# MT203 review batch 001 — lesson coverage audit

Status: **source audit plus implementation record**  
Compared source: `MT203 – PST 2026(1).pdf`, PDF pages 36, 102, 154, 178 and 212  
Existing lesson source: `app/data/lessons-mt203.ts`  
Course structure source: `app/courses/manifests/mt203.ts`

The audit itself did not modify course data. A separately recorded, isolated-branch lesson patch now implements the T8, T9, T10 and T11 additions below; no question, manifest, topic count, learner-progress record or deployment asset was modified.

## Executive result

| PDF page | Existing topic | Coverage finding | Recommended action |
|---:|---|---|---|
| 36 | T4 — Molecular Weight & Distribution | **Already covered.** The source's Mn, Mw and Mz equations match the existing lesson's equations. | No new theory. Record the source's lowercase (n_i) notation as a notation variant if desired; keep the current (N_i) convention intact. |
| 102 | T8 — Industrial Polymers | **Partly covered.** The specific silicone-based TPU reaction scheme was absent. | Added a concise, source-linked description of the visible reactants and conditions to T8. No repeat-unit reconstruction or catalyst/stoichiometry inference. |
| 154 | T10 — Mechanical, Viscoelastic & Physical Properties | **Principle covered; data not covered.** T10 already explains solution–diffusion and (P=D\times S). The comparative polymer/permeant table is absent. | Add the original table as a visual/reference asset under T10. Do not transcribe numeric values into lesson prose until units and footnotes are independently verified. |
| 178 | T11 — Compounding & Processing | **Process principle covered; equipment details not covered.** | Added the additional hardware, heating/cooling and instrument-panel labels to T11. Existing screw-zone explanation retained without duplication. |
| 212 | T9 — Blends, Composites, Reactions & Degradation | **Partly covered.** The resin-identification codes were absent. | Added the seven-row source-faithful resin-code table to T9, preserving `V` and `OTHER` exactly as printed. |

## Detailed findings

### Page 36 → T4

The source gives:

- (M_n = \frac{\sum n_i M_i}{\sum n_i} = \frac{\sum w_i}{\sum (w_i/M_i)})
- (M_w = \frac{\sum n_i M_i^2}{\sum n_i M_i} = \frac{\sum w_i M_i}{\sum w_i})
- (M_z = \frac{\sum n_i M_i^3}{\sum n_i M_i^2} = \frac{\sum w_i M_i^2}{\sum w_i M_i})

The existing T4 lesson already contains the number-, weight- and z-average equations, PDI, the ordering (M_n \le M_v \le M_w \le M_z), measurement methods and a worked numerical. It also states the weight-fraction forms (M_w=\sum w_iM_i) and (1/M_n=\sum w_i/M_i).

**Small source distinction:** the slide uses lowercase (n_i) for moles of molecules, while T4 uses uppercase (N_i) for number of chains. The mathematical role is the same in the displayed average, but the symbols should not be silently swapped. No new equation or section is justified.

### Page 102 → T8

The source slide is titled “Silicone based TPU”. Its visible labels identify H₁₂MDI, PTMG, a PDMS-based diol segment, 1,4-BD, THF/DMAC and T-12, with a silicone-containing TPU structure shown as the product.

T8 already covers:
- silicone as a polymer with a Si–O backbone;
- thermoplastic elastomers as melt-processable materials;
- TPU as an example of a thermoplastic elastomer.

What is new is the particular silicone-containing TPU formulation/reaction scheme. The original slide is the most reliable representation of its chemical connectivity.

**Recommended minimal addition:** one image/reference entry, captioned “Silicone-based TPU reaction scheme (source PDF p. 102)”. Keep the reactant labels in alt text or a short caption only if the diagram asset itself remains accessible. Do not infer T-12's identity or reaction stoichiometry from this slide.

### Page 154 → T10

T10 already explains permeability using the solution–diffusion model and the relation (P=D\times S), including qualitative effects of crystallinity, cross-linking, polarity and temperature relative to (T_g).

The source table adds comparative values for LDPE, cis-1,4-polybutadiene, poly(ethyl methacrylate), amorphous PET, poly(vinylidene chloride) and cellulose against several permeants at 25°C.

**Important limits:** the table headings show (P\times10^{13}), (P_0\times10^7) and (ΔE), but this page does not explain the complete units or footnotes (a) and (b). Do not normalize units, expand the footnotes, or use the extracted OCR values as validated data.

**Recommended minimal addition:** retain the source table as a high-resolution visual reference linked from T10's permeability section. If a typed table is later needed, first recover the referenced footnotes and unit definitions from the original source material.

### Page 178 → T11

T11 already describes:
- the feed, compression and metering zones;
- the flow path from hopper through screen pack/breaker plate and die;
- extrusion, compounding and common extrusion defects.

The source diagram additionally labels the thrust bearing, transmission, speed variator/gear box, motor, hopper, cooling system, heating system, screw, screen, breaker plate, pressure-control valve, gate assembly, front support, die/takeoff and an instrument panel for motor power, head pressure, screw speed, die temperature and barrel temperature (B1–B3).

**Recommended minimal addition:** add the source diagram as a visual reference in T11. It supplies hardware identification and control-panel context not represented by the current text. Do not create a second explanation of the three screw zones.

### Page 212 → T9

T9 already explains mechanical recycling of thermoplastics and the limitation that thermosets cannot be remelted. It does not list the resin-identification numbers.

The slide labels are:

| Resin code | Label shown on source slide |
|---:|---|
| 1 | PETE — Polyethylene Terephthalate |
| 2 | HDPE — High Density Polyethylene |
| 3 | V — Vinyl |
| 4 | LDPE — Low Density Polyethylene |
| 5 | PP — Polypropylene |
| 6 | PS — Polystyrene |
| 7 | OTHER |

**Recommended minimal addition:** a seven-row reference table in T9, explicitly introduced as the resin-identification labels shown in the lecture slide. Preserve `V` as printed; do not silently replace it with `PVC` or another abbreviation. The slide does not enumerate the materials included in “OTHER”, so do not add examples.

## Implementation record\n\nCommitted to the isolated branch `feat/study-resource-ingestion-foundation` in `app/data/lessons-mt203.ts`: T8 silicone-based TPU example, T9 resin-code table, T10 permeability data table (with unit/footnote caveat), and T11 extruder hardware/control details. No questions or course manifest entries changed. The T9 section syntax was repaired after CI caught an invalid insertion; the review-test assertion was also corrected to match the validator's explicit error text. Implementation commits: `d536be7c63ea9c7448c2e415d318c5144e3c3ce3`, `982839a48ff6587767ea8142103a314f119769c8`, `0acc9b50855882432bcc1282e917b38222c00d85` and `c962b141d99d086d6a47e8971249e23039d66405`.\n\n## Proposed patch scope

If approved, the smallest useful lesson update is:

1. **T8:** one source-linked image reference for page 102.
2. **T10:** one source-linked table image reference for page 154.
3. **T11:** one source-linked diagram reference for page 178.
4. **T9:** one short seven-row resin-identification table transcribed from page 212.
5. **T4:** no lesson change; optionally add a brief notation note only if the course owner wants the source's (n_i) notation recorded.

No new topic, module, question, question ID, difficulty level or MCQ parameter is needed. The existing MCQ quality standard remains unchanged.

## Decision state

- Source pages inspected directly: 5.
- Existing topic destinations confirmed: 5.
- Topics with substantive new content/reference: T8, T9, T10, T11.
- Topic already substantively covered: T4.
- Proposed lesson changes applied: 4 topic additions (T8–T11 as applicable).
- Question bank changes: 0.
- Approvals recorded: 0.
