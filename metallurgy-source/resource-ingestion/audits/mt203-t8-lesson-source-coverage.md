# MT203 T8 lesson-to-source coverage audit

**Course:** MT203 — Polymer Science and Technology  
**Source:** `MT203 – PST 2026(1).pdf` (212 pages)  
**Source SHA-256:** `ba86baeb56d8bae0a0cd875cd1e4b63eac5cf11cb502d9e84e5ed52cc1f6e546`  
**Lesson source:** `metallurgy-source/app/data/lessons-mt203.ts`, topic `t8`  
**Audit scope:** lecture pages 80–109, cross-checked against the existing T8 lesson and related T7 material  
**Status:** targeted source-to-lesson reconciliation; not a full visual audit of every slide

## Page-level coverage

| PDF page(s) | Source content | Lesson coverage after update | Status |
|---:|---|---|---|
| 80–81 | Polymer advantages, environmental disadvantage, everyday uses | Advantages and biodegradation/waste limitation added; use categories recorded | covered |
| 82 | Application map: transportation, food packaging, electronics, medical supplies, clothing, construction, manufactured goods; polymer labels | Category list and labels added without asserting uncertain one-to-one placements | covered qualitatively |
| 83 | Plastics' electrical/thermal insulation and broad unreactivity statements | Added with a qualification that these are broad slide statements, not universal specifications | covered |
| 84–85 | Branched vs lined-up chains; reaction conditions, monomer type and additives as property controls | Added the slide's LDPE/HDPE comparison and listed property-control factors | covered |
| 86 | Polyolefin, engineering, natural and high-performance polymer families | Added named classes and examples | covered |
| 87–91 | PE definition/use/catalyst; PE grades; branching/density; LLDPE density, comonomers and comparison with LDPE | Added lecture-specific classifications, catalyst, density range, comonomers and reported property comparison | covered |
| 92 | Heading: “Specific Thermoplastic Properties and its comparisons” | No readable body content in extracted source | needs source-image verification |
| 93 | Monomer/repeat-unit examples: PE, PP, PS, PVC, PTFE | Added monomer/polymer pairs | covered |
| 94 | PET, nylon 6,6, Kevlar and spandex monomers/linkages | Added reactants and ester/amide/urethane linkage labels | covered |
| 95 | Natural polymers: natural rubber, cellulose, protein and DNA structures | Cross-topic content is represented in T7 for natural rubber/protein and relevant course material; confirm full structural detail during T7/T8 final pass | partially covered |
| 96 | Vinyl-polymer nomenclature table: monomer names, polymer names and IUPAC names | Common monomer/polymer pairs added; original IUPAC column retained as a visual reference because small bracket placement/punctuation is not reliably transcribed | partially covered |
| 97–99 | TPU forms/components, history, polyol classes, chain extenders, one-/two-pot and prepolymer synthesis | Added source-specific text and historical examples | covered |
| 100 | TPU segmented structure: polyol soft segment, di-isocyanate hard segment, chain extender and urethane linkage | Added the soft-/hard-segment distinction and source labels from the diagram | covered |
| 101–103 | Two-pot PTMC–PEO–PPO–PEO–PTMC PECUU scheme; silicone-based TPU; one-pot PCL–PEC–PDMS TPU scheme with printed conditions | p. 101 reagents/sequence, p. 102 labelled reactants/solvent/catalyst, and p. 103 MDI/macrodiol/BD, conditions and final label transcribed cautiously | covered at scheme-label level |
| 104–107 | Thermoset family survey; epoxy functionality/network, bisphenol-A/epichlorohydrin prepolymer and diamine hardener; melamine-formaldehyde network | Added named systems, depicted functionality, advantages and reactants; no missing cure conditions inferred | covered |
| 108–109 | TPE definition, TPV curing note and six TPE categories | Added definition, melt processability, TPV note and category abbreviations | covered |

## Important source-faithfulness notes

1. The p. 82 application diagram places several polymer abbreviations around application categories. The lesson records the listed categories and labels without inventing uncertain one-to-one mappings.
2. The LLDPE density range **0.915–0.925 g cm⁻³** and property comparison with LDPE are lecture-reported values, not universal specifications for every grade.
3. The p. 96 IUPAC names are retained as a source visual because exact bracket placement and punctuation are not fully reliable at the available image resolution.
4. p. 101 and p. 103 are chemistry-scheme pages. Do not infer unlabelled reaction conditions, catalyst identity or stoichiometry.
5. The lecture's historical statements on p. 97–98 are preserved as claims made by the slide, not independently verified history.

## Changes recorded

- T8 lecture additions for pages 80–109: commit `3dae1ab143e7a7a69e3a8800a6dffec86588a7ea`.
- Additional p. 82 and p. 84–85 coverage: commit `5bdbcf3da717142c014a0ba13f87e5068e07b593`.
- p. 96 nomenclature coverage note: commit `20dad236e487fc3a781836acf9d89759b628e4b1`.

## Remaining review

- Pages 92, 100, 101, 102 and 103 have now been visually inspected; p. 92 remains title-only, while the TPU diagrams are transcribed at the label/process level.
- Revisit p. 95 structural detail against the T7 lesson and topic map.
- Review the complete T8 content for overlap with T1, T2, T6, T7 and T9 before freezing coverage.
- Do not generate new questions until all topic-level source coverage is frozen.
- Existing question IDs, question counts, taxonomy and learner progress remain unchanged.


### Visual TPU scheme follow-up

Pages 100–103 were rendered and inspected at higher resolution. The lesson now records:
- p. 100: polyol soft segment; di-isocyanate hard segment (crystallising or non-crystallising); chain extender; urethane linkage.
- p. 101: two-pot PTMC–PEO–PPO–PEO–PTMC-based PECUU scheme; cyclic carbonate extension of the PEO–PPO–PEO macrodiol, followed by OCN(CH₂)₄NCO and H₂N(CH₂)₄NH₂.
- p. 102: H₁₂MDI, PTMG, PDMS and 1,4-BD; THF/DMAC and catalyst label T-12. The catalyst identity is not expanded.
- p. 103: MDI, macrodiol and BD; 60 °C, N₂ atmosphere, 6 h; DBTL (0.1 wt%) in dry THF; final labels SPU backbone and PCL–PEC–b–PDMS.

The scheme transcription is source-label level, not a reconstructed reaction protocol.
