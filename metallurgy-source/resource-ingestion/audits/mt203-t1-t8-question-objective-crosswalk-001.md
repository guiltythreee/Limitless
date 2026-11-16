# MT203 T1–T8 question-to-objective crosswalk — checkpoint 001

Date: 16 November 2026  
Branch: `feat/study-resource-ingestion-foundation`  
Source: `MT203 – PST 2026(1).pdf` (212 pages; SHA-256 `ba86baeb56d8bae0a0cd875cd1e4b63eac5cf11cb502d9e84e5ed52cc1f6e546`)  
Live question sources: `app/data/qbank/t1.ts` through `t8.ts`  
Primary mapping: `app/data/qbank/subtopic-map.ts`

## Scope and method

This checkpoint enumerates every live question ID in T1–T8, captures its stem/type/difficulty, and groups it under the existing primary subtopic mapping. It does not create or rename syllabus topics. It is a question-to-existing-subtopic crosswalk, paired with the source-page inventory and the separately recorded source-specific gap register. It is not a claim that a subtopic is fully mastered merely because one or more questions are assigned to it.

**Verified inventory:** 208 question objects across eight topics. Each object has one primary subtopic assignment in the live map. Cross-topic primary assignments are retained where explicitly approved by the validator:
- `t2-32 → T3.3` (emulsion-polymerization technique)
- `t3-22 → T2.2` (chain-transfer agent vs initiator)
- `t4-26 → T2.5` (radical kinetic chain length)

## Topic crosswalk

### T1 — T1 | pp. 5–16; cross-topic p.50 functionality; industrial classification revisit pp.80–96

#### T1.1 — Monomers, repeat units, DP, functionality (8 questions)

- `t1-01` [recall, D1] A polymer is a macromolecule built by chemically linking many small molecules called:
- `t1-02` [concept, D2] Why is the repeat unit of polyethylene written as $\\text{–CH}_2\\text{–CH}_2\\text{–}$ rather than $\\text{CH}_2{=}\\text{CH}_2$?
- `t1-06` [statement, D2] Which statement(s) about the relationship between monomers and repeat units is/are correct?
- `t1-07` [numerical, D2] Polyethylene chains have a number-average molecular weight $M_n = 56{,}000$ g/mol. Taking the repeat unit $\\text{–CH}_2\\text{–CH}_2\\text{–}$ ($M = 28$ g
- `t1-18` [concept, D3] Why can step-growth polymerization of monomers with functionality greater than two produce a three-dimensional network?
- `t1-19` [recall, D1] For an individual linear polymer chain, degree of polymerization (DP) is the number of:
- `t1-21` [numerical, D2] Nylon 6 has the repeat unit $\\text{–[NH(CH}_2\\text{)}_5\\text{CO]}\\text{–}$ ($M_{repeat} = 113$ g/mol). A nylon 6 sample with $M_n = 22{,}600$ g/mol has
- `t1-22` [graph, D3] A tensile-strength-versus-DP plot for one polymer gives: DP 20 → 5 MPa; DP 100 → 25 MPa; DP 400 → 45 MPa; DP 2000 → 47 MPa. What does the small increase fr

#### T1.2 — Classification — the seven axes (8 questions)

- `t1-08` [match, D1] Match each classification basis with its correct set of categories.
- `t1-09` [concept, D2] Why does LDPE have lower density and lower crystallinity than HDPE?
- `t1-13` [apply, D3] A reusable container must be softened by heating, reshaped by melt processing, and solidified by cooling after each use, without a curing reaction. Which p
- `t1-17` [statement, D2] Which statement(s) about conventional, lightly cross-linked elastomers is/are correct?
- `t1-24` [match, D2] Match each polymer example with its most characteristic broad material class.
- `t1-27` [recall, D1] A polymer is classified as semi-synthetic when it is produced by:
- `t1-31` [concept, D2] Why can polyurethane chemistry be formulated into products ranging from rigid plastics to soft elastomers and foams?
- `t1-32` [higher, D4] Two specimens are made from the same thermosetting resin formulation. Specimen X has completed its cure and is infusible; specimen Y is still an uncured, f

#### T1.3 — Nomenclature & copolymer connectives (3 questions)

- `t1-05` [recall, D1] Nylon 6,6 gets its name because:
- `t1-12` [recall, D1] In source-based copolymer nomenclature, what does the connective -co- indicate?
- `t1-16` [match, D2] Match each polymer abbreviation with its full name.

#### T1.4 — Topology, configuration, conformation (6 questions)

- `t1-04` [compare, D2] For a typical vinyl polymer, which tacticity–morphology pairing is most likely?
- `t1-10` [concept, D2] Which change can alter a polymer's configurational stereochemistry rather than merely changing its conformation?
- `t1-11` [concept, D3] Which structural explanation best accounts for natural rubber being flexible while gutta-percha is more rigid and crystalline, despite both being polyisopr
- `t1-20` [compare, D2] Distinguish a *branched* polymer from a *cross-linked* polymer.
- `t1-23` [apply, D3] An engineering component must resist dissolving during repeated solvent exposure; limited swelling is acceptable. Which polymer architecture is most approp
- `t1-28` [statement, D3] Which statement(s) about polymer molecular architecture is/are correct?

#### T1.5 — Copolymer architectures & thermoplastic elastomers (3 questions)

- `t1-25` [concept, D2] Why is a *thermoplastic elastomer* like SBS reprocessable even though it behaves like a vulcanized rubber in service?
- `t1-29` [compare, D2] How does an *alternating* copolymer differ from a *random* copolymer?
- `t1-30` [numerical, D3] A binary addition copolymer contains 40 mol% monomer A ($M_A = 100$ g/mol) and 60 mol% monomer B ($M_B = 50$ g/mol). Assuming no small molecule is eliminat

#### T1.6 — Historical development of synthetic polymers (2 questions)

- `t1-03` [recall, D1] Which polymer is the phenol–formaldehyde resin developed by Leo Baekeland and commercialised under the name Bakelite?
- `t1-15` [sequence, D2] Order these milestones chronologically, earliest first: (1) Ziegler–Natta stereospecific catalysis (2) Bakelite commercialized (3) Staudinger's macromolecu

#### T1.7 — Polymer-analogous reactions and modification (2 questions)

- `t1-14` [assertreason, D2] A is true, R is false
- `t1-26` [higher, D4] Poly(vinyl acetate) is saponified to PVA, which is then blended with starch for a biodegradable film. Which pair correctly identifies the chemistry of the 

### T2 — T2 | pp. 17–20; cross-topic p.50 functionality and pp.51–55 nylon/polyamide synthesis

#### T2.1 — Addition vs condensation; chain vs step (3 questions)

- `t2-01` [compare, D2] Why can a chain-growth polymerisation reach high molecular mass at relatively low monomer conversion, while a conventional step-growth polymerisation usual
- `t2-12` [statement, D3] Which statement(s) about the classification of polymerizations is/are correct?
- `t2-33` [compare, D2] Condensation (Carothers) vs addition polymerization — which statement is correct?

#### T2.2 — Initiation, propagation, termination, chain transfer (9 questions)

- `t2-02` [recall, D1] In free-radical polymerization, the step that generates the first reactive species is:
- `t2-05` [concept, D2] Chain transfer stops one growing chain but the overall rate of polymerization is barely affected. Why?
- `t2-06` [compare, D2] Termination by combination vs disproportionation — which pairing is correct?
- `t2-13` [sequence, D1] Order the core stages of free-radical polymerization: (1) propagation (2) initiator decomposition (3) termination (4) initiation. Chain transfer may occur 
- `t2-18` [compare, D2] Head-to-tail vs head-to-head addition in vinyl polymerization:
- `t2-19` [recall, D1] AIBN decomposes to radicals with the simultaneous release of:
- `t2-20` [match, D2] Match each term with its correct description.
- `t2-31` [recall, D1] Which initiator is activated by **redox** chemistry (low-temperature initiation)?
- `t2-35` [assertreason, D3] A is false, R is true

#### T2.3 — Cationic, anionic, coordination polymerization (7 questions)

- `t2-07` [recall, D1] Which monomer is a standard example of cationic chain-growth polymerization?
- `t2-08` [concept, D3] Why can anionic polymerization produce *living* polymers (no termination), enabling block copolymers like SBS?
- `t2-09` [match, D1] Match each mechanism with its reactive centre and typical monomer.
- `t2-21` [assertreason, D3] Both A and R are true, but R is NOT the correct explanation of A
- `t2-26` [statement, D2] Which statement(s) about ionic polymerization is/are correct?
- `t2-27` [apply, D4] A lab needs an A–B–A block copolymer with narrow, approximately matched PS end-block lengths. Which route is most suitable?
- `t2-29` [concept, D3] Coordination (metallocene) catalysts differ from Ziegler–Natta catalysts chiefly in that:

#### T2.4 — Carothers equation & step-growth kinetics (6 questions)

- `t2-10` [numerical, D2] Using Carothers' equation, the number-average degree of polymerization at 99% conversion ($p = 0.99$) in a stoichiometric step-growth system is:
- `t2-11` [concept, D2] Why does step-growth polymerization require exact stoichiometric balance of functional groups to reach high MW?
- `t2-14` [numerical, D3] A step-growth polymerization uses a diacid and a diamine with a molar ratio $r = 0.995$ (less/more abundant group). The maximum $DP$ at full conversion of 
- `t2-28` [numerical, D3] In a step-growth polymerization, what conversion is needed to reach $DP_n = 200$ (stoichiometric)?
- `t2-30` [higher, D4] A polycondensation reaches p = 0.995 with perfect stoichiometry. A competitor claims their batch reaches DP 400 at p = 0.99 using a slight stoichiometric i
- `t2-36` [higher, D4] A polymer sample has PDI close to 2, and NMR confirms two hydroxyl end groups per chain. Which synthesis could plausibly produce this result?

#### T2.5 — Free-radical kinetics, $R_p$, gel effect (9 questions)

- `t2-03` [numerical, D3] Free-radical polymerization has $k_p = 100$ L/(mol·s), $k_t = 10^{6}$ L/(mol·s), $f k_d[I] = 10^{-2}$ s⁻¹ and $[M] = 5$ mol/L. The steady-state rate $R_p$ 
- `t2-04` [concept, D3] Why does the observed rate depend on $[I]^{1/2}$ rather than $[I]$ in free-radical polymerization?
- `t2-15` [concept, D3] During bulk free-radical polymerisation, the rate rises sharply at high conversion as the mixture becomes very viscous. Which mechanism best explains the T
- `t2-16` [numerical, D3] If the initiator concentration is quadrupled ($[I] \\to 4[I]$) in a free-radical polymerization, $R_p$ becomes:
- `t2-17` [concept, D3] Increasing initiator concentration makes the polymerization faster but yields *lower* molecular weight. Why?
- `t2-22` [numerical, D4] The kinetic chain length is $\\nu = 1000$ repeat units per radical chain. Of termination events, 60% occur by combination and 40% by disproportionation. Wh
- `t2-23` [concept, D2] Why is free-radical polymerization the most widely used industrial mechanism?
- `t2-25` [graph, D3] A schematic plot shows two molecular-weight-versus-conversion trends: curve A rises steeply only near p → 1; curve B is already high at low conversion. Ide
- `t2-34` [numerical, D4] A reactor runs free-radical polymerization. Doubling $[M]$ and halving $[I]$ changes $R_p$ by the factor:

#### T2.6 — Ring-opening polymerization (1 questions)

- `t2-24` [recall, D1] Ring-opening polymerization of ε-caprolactam produces:

### T3 — T3 | pp. 21–33

#### T3.1 — Technique ≠ mechanism (4 questions)

- `t3-03` [match, D1] Match each technique with its defining feature.
- `t3-13` [compare, D2] Which combination correctly pairs a technique with its principal industrial product?
- `t3-15` [concept, D2] Why is melt polycondensation described as 'the fifth technique' rather than a separate mechanism?
- `t3-19` [statement, D2] Which statement(s) about the choice of polymerization technique is/are correct?

#### T3.2 — Bulk & solution polymerization (4 questions)

- `t3-02` [concept, D2] In a solvent that can participate in chain transfer, why can solution polymerization give lower molecular weight than bulk polymerization of the same monom
- `t3-08` [statement, D2] Which statement(s) about bulk (mass) polymerization is/are correct?
- `t3-17` [apply, D4] A process must produce a polymer with a narrow molecular-weight distribution and avoid solvent residues, at modest scale. Which route is the best fit?
- `t3-18` [graph, D3] Conversion-vs-time curves show: Curve A reaches 80% conversion in 1 h with a violent exotherm spike near 60%; Curve B reaches 80% smoothly over 4 h with a 

#### T3.3 — Suspension vs emulsion (7 questions)

- `t3-01` [recall, D1] In suspension polymerization the initiator is:
- `t3-04` [compare, D2] Suspension vs emulsion polymerization — which statement is correct?
- `t3-05` [concept, D3] Why can emulsion polymerization achieve high rate *and* high molecular weight simultaneously, unlike bulk polymerization?
- `t3-09` [apply, D3] PVC must be produced as clean, porous beads for downstream compounding. Which process?
- `t3-10` [recall, D1] In the classical micellar model of emulsion polymerization, particle nucleation occurs:
- `t3-16` [recall, D1] Product form from suspension polymerization is:
- `t3-20` [higher, D4] A reactor produces polystyrene as 0.5 μm aqueous dispersion particles using potassium persulfate initiator and sodium lauryl sulfate surfactant. The proces

#### T3.4 — Melt polycondensation (6 questions)

- `t3-06` [recall, D1] Which polymerization technique is commonly used to produce PET and nylon 6,6 by condensation polymerization?
- `t3-07` [concept, D3] Why is reduced pressure (often high vacuum) useful in the late stages of melt polycondensation?
- `t3-11` [numerical, D3] Melt polycondensation of PET needs $DP_n = 100$. The required conversion (stoichiometric) is:
- `t3-12` [concept, D2] What is solid-state polymerization (SSP) and why is it used for PET bottle grade?
- `t3-14` [assertreason, D3] Both A and R are true, but R is NOT the correct explanation of A
- `t3-21` [recall, D2] In high-viscosity melt polycondensation, which equipment is particularly useful for creating a thin melt film and a short diffusion path for removing water

### T4 — T4 | pp. 34–49

#### T4.1 — Why polymer MW is an average (1 questions)

- `t4-01` [concept, D2] Why is there no single 'molecular weight' of a polymer sample?

#### T4.2 — Mn, Mw, Mz, Mv and PDI (12 questions)

- `t4-02` [numerical, D3] A PS sample contains 1 chain of MW 20,000 g/mol and 3 chains of MW 10,000 g/mol. Its $M_n$, $M_w$ and PDI are:
- `t4-05` [concept, D3] A polymer has PDI = 1.00 exactly. What does this imply?
- `t4-07` [apply, D3] Osmometry gives Mn = 40,000 and light scattering gives Mw = 160,000. The most defensible statement is:
- `t4-10` [recall, D1] PDI (polydispersity index) is defined as:
- `t4-11` [numerical, D3] The number-average DP of a polyamide (repeat unit M = 113 g/mol) with Mn = 33,900 g/mol is:
- `t4-13` [compare, D2] Which statement correctly contrasts Mv with Mn and Mw?
- `t4-16` [statement, D3] Which statement(s) about the different MW averages is/are correct?
- `t4-18` [numerical, D3] A polymer has Mw = 300,000 and Mn = 50,000. If the weight-average DP is 1,500 (repeat unit 200 g/mol), the number-average DP is:
- `t4-20` [assertreason, D3] Both A and R are true, and R is the correct explanation of A
- `t4-21` [numerical, D4] Two monodisperse fractions (each PDI = 1) of Mn = 20,000 (5 g) and Mn = 80,000 (5 g) are blended. The blend's Mn and Mw are:
- `t4-24` [higher, D4] A rubber is made by cross-linking chains of Mn = 200,000. Before cross-linking, which average best predicts the number of chain ends per gram (relevant for
- `t4-30` [numerical, D4] A polymer sample: 60 mol% chains of MW 10,000 and 40 mol% of MW 40,000. Mn and Mw are:

#### T4.3 — Techniques: osmometry, scattering, viscometry, GPC (10 questions)

- `t4-03` [recall, D1] Which average molecular weight is obtained from membrane osmometry?
- `t4-04` [match, D2] Match each technique with the average it yields.
- `t4-12` [graph, D3] Three GPC/SEC traces are described only by their relative peak widths at half-height: A is narrow and symmetric, B is broader with a low-MW tail, and C is 
- `t4-14` [numerical, D4] Mark–Houwink constants for a polymer–solvent pair: K = 1.0 × 10⁻⁴ dL/g, a = 2/3. If the intrinsic viscosity is [η] = 1.0 dL/g, the viscosity-average MW is:
- `t4-15` [concept, D2] Why does viscosity-average molecular weight depend on solvent quality?
- `t4-22` [concept, D2] What does a GPC/SEC instrument actually measure, and how is MW obtained?
- `t4-23` [recall, D1] In viscometry, reduced viscosity ηsp/c is extrapolated to zero concentration to obtain:
- `t4-25` [compare, D2] GPC vs osmometry for routine MW determination — which pairing is correct?
- `t4-27` [graph, D3] A cumulative weight-fraction curve rises steeply then plateaus; the 50% point is called:
- `t4-29` [apply, D4] Gel-permeation chromatography of a branched PE sample gives a lower MW than light scattering. The best explanation:

#### T4.4 — Carothers & stoichiometric imbalance (3 questions)

- `t4-06` [numerical, D4] A step-growth polymerization reaches p = 0.999. The PDI of the product (stoichiometric) is closest to:
- `t4-17` [recall, D1] For a step-growth polymerization at high conversion, the most-probable distribution gives:
- `t4-28` [statement, D2] Which statement(s) about Carothers' equation is/are correct?

#### T4.5 — Sensitivity of each average (3 questions)

- `t4-08` [concept, D3] Mn is far more sensitive than Mw to a trace of low-molecular-weight material. Why?
- `t4-09` [numerical, D4] A polymer of Mn = 50,000 g/mol is blended with 1 wt% of an oligomer of M = 500 g/mol. The new Mn (weight-fraction formula $1/M_n = \\sum w_i/M_i$) is appro
- `t4-19` [apply, D3] A fibre must have maximum tensile strength and minimal brittleness. Which MW strategy?

### T5 — T5 | pp. 5–16, p.49, p.122

#### T5.1 — Requirements: regularity, stereochemistry, no defects (5 questions)

- `t5-01` [recall, D1] The essential structural requirement for a polymer to crystallize is:
- `t5-04` [concept, D2] Why is atactic polystyrene completely amorphous?
- `t5-05` [compare, D2] Which set correctly contrasts HDPE with LDPE?
- `t5-11` [concept, D3] Why does copolymerizing ethylene with a small amount of 1-hexene (LLDPE) lower crystallinity relative to HDPE?
- `t5-16` [statement, D3] Classify as semi-crystalline or amorphous. Which statement is correct?

#### T5.2 — Morphology: chain folding, lamellae, spherulites (4 questions)

- `t5-06` [statement, D2] Which statement(s) about spherulites is/are correct?
- `t5-09` [match, D2] Match each morphology term with its correct description.
- `t5-18` [sequence, D2] Order the crystallization process from melt, earliest first: (1) growth of chain-folded lamellae (2) primary nucleation (3) formation of spherulites (4) se
- `t5-19` [compare, D3] The 'fringed micelle' vs 'chain-folded lamella' models differ in that:

#### T5.3 — Measuring crystallinity (density, DSC, XRD) (5 questions)

- `t5-02` [numerical, D3] Amorphous PE has $\\rho_a = 0.855$ g/cm³ and fully crystalline PE $\\rho_c = 1.000$ g/cm³. A sample has density $\\rho = 0.930$ g/cm³. What is its mass fra
- `t5-03` [numerical, D3] For this calculation, use $\\Delta H_m^\\circ = 140$ J/g as the stated reference enthalpy for 100% crystalline PET. A sample gives a DSC melting endotherm 
- `t5-10` [graph, D3] A DSC heating scan shows: (i) a small step change in heat capacity at 70 °C, (ii) a broad exotherm at 130 °C, (iii) a large endotherm at 255 °C. A quenched
- `t5-12` [recall, D1] In wide-angle X-ray diffraction, a semi-crystalline polymer shows:
- `t5-15` [assertreason, D3] A is true, R is false

#### T5.4 — Crystallinity vs properties (6 questions)

- `t5-07` [concept, D2] Why does rapidly quenching a polymer melt give lower crystallinity than slow cooling?
- `t5-08` [apply, D3] A clear, transparent container is required. Which material choice and processing logic is best?
- `t5-13` [concept, D3] Below the melting temperature, crystalline domains can make a semi-crystalline polymer more resistant to solvent penetration without making it permanently 
- `t5-14` [apply, D4] A moulder wants faster cycle times and a tougher (less brittle) semi-crystalline moulding. The best additive strategy is:
- `t5-17` [concept, D3] PET drink bottles are transparent but PET fibres are strong and semi-crystalline. Why the difference?
- `t5-20` [higher, D4] A plot of tensile modulus against polyethylene crystallinity rises steeply up to about 60% crystallinity and then approaches a plateau. What conclusion is 

### T6 — T6 | pp. 61–69

#### T6.1 — Tg: the glass transition (2 questions)

- `t6-01` [recall, D1] The glass-transition temperature Tg is the temperature at which:
- `t6-13` [concept, D3] Why is the experimentally measured Tg of a polymer dependent on the cooling rate?

#### T6.2 — Tm: first-order melting (3 questions)

- `t6-02` [compare, D2] Which statement correctly contrasts Tg and Tm?
- `t6-09` [graph, D3] A DSC heating curve of a semi-crystalline sample shows a step at 60 °C, a small exotherm at 120 °C and a large endotherm at 250 °C. Identify the events.
- `t6-19` [statement, D3] Which statement(s) about Tm is/are correct?

#### T6.3 — Factors affecting Tg and Tm (5 questions)

- `t6-03` [concept, D3] Which change would raise a polymer's Tg?
- `t6-06` [recall, D1] Which polymer has the lowest Tg?
- `t6-10` [statement, D2] Which statement(s) about factors affecting Tg is/are correct?
- `t6-11` [assertreason, D3] A is true, R is false
- `t6-17` [numerical, D3] As a rough rule, $T_g \\approx \\tfrac{2}{3} T_m$ (both in kelvin). For a polymer with $T_m = 540$ K, the estimated Tg is about:

#### T6.4 — HDT, Vicat and the service window (6 questions)

- `t6-12` [apply, D3] A part must remain dimensionally stable under load at 90 °C. Which is the safest choice?
- `t6-14` [recall, D2] The heat-deflection temperature (HDT) of a plastic is:
- `t6-15` [compare, D2] Which statement contrasts HDT and Vicat softening temperature correctly?
- `t6-16` [concept, D3] A semi-crystalline polymer such as polypropylene can be used far above its Tg (−10 °C) up to near its Tm (~165 °C). Why?
- `t6-20` [apply, D4] An engineer must raise the HDT of a polypropylene housing from 90 °C to > 140 °C without changing the polymer. The most effective route is:
- `t6-22` [higher, D4] A clear PET bottle (Tg 69 °C, Tm 265 °C) must not distort in a 60 °C hot-fill process; a competitor uses hot-fill PET with higher crystallinity. The reason

#### T6.5 — Copolymers, plasticizers, Fox & Fox–Flory (4 questions)

- `t6-04` [numerical, D3] Using the Fox equation, estimate the Tg of a fully miscible 50/50 (wt) blend of polymer A (Tg = 100 °C = 373 K) and polymer B (Tg = 200 °C = 473 K):
- `t6-05` [numerical, D4] By the Fox–Flory relation $T_g = T_g^\\infty - K/M_n$, with $T_g^\\infty = 373$ K and $K = 1.0\\times10^{5}$ K·g/mol, find Tg for $M_n = 10{,}000$ g/mol.
- `t6-07` [concept, D2] How does a plasticizer lower a polymer's Tg?
- `t6-21` [concept, D2] A homogeneous random copolymer commonly shows one Tg between those of its two homopolymers. What best explains this typical behaviour?

#### T6.6 — Thermal-transition measurement and DMA (1 questions)

- `t6-08` [match, D2] In dynamic mechanical analysis, match each quantity with its meaning.

#### T6.7 — Free-volume theory (1 questions)

- `t6-18` [concept, D2] In free-volume theory, the glass transition occurs when the fractional free volume falls to about:

### T7 — T7 | pp. 70–79

#### T7.1 — Amino acids & the peptide bond (3 questions)

- `t7-01` [recall, D1] Proteins are natural polymers whose repeat linkage is the:
- `t7-13` [concept, D2] Why are proteins classified as condensation polymers?
- `t7-14` [numerical, D3] A polypeptide contains 100 amino-acid residues. Taking the average residue molar mass as 110 g/mol, its approximate molecular weight is:

#### T7.2 — Primary → quaternary structure (3 questions)

- `t7-02` [match, D2] Match each level of protein structure with its description.
- `t7-03` [concept, D2] In the α-helix, the structure is stabilized by:
- `t7-04` [compare, D2] Which statement correctly contrasts the α-helix and the β-sheet?

#### T7.3 — Collagen, keratin, fibroin, gelatin (7 questions)

- `t7-05` [concept, D2] Collagen is a fibrous protein built as:
- `t7-06` [recall, D1] The chemical bond responsible for setting and permanent waving of hair (keratin) is the:
- `t7-07` [concept, D3] Explain chemically what happens during a 'permanent wave'.
- `t7-08` [recall, D1] Silk fibroin's outstanding tensile strength comes from its:
- `t7-10` [apply, D3] Gelatin is produced from collagen by:
- `t7-12` [assertreason, D3] Both A and R are true, and R is the correct explanation of A
- `t7-16` [higher, D4] Collagen from cold-water fish commonly has a lower denaturation temperature than collagen from warm-water species. Which material-chemistry explanation bes

#### T7.4 — Denaturation, cross-linking, uses (3 questions)

- `t7-09` [concept, D2] Denaturation of a protein by heat or acid primarily disrupts:
- `t7-11` [statement, D2] Which statement(s) about protein-based materials is/are correct?
- `t7-15` [apply, D3] To harden a water-soluble protein into a durable, insoluble plastic (as in early casein buttons), the correct treatment is:

### T8 — T8 | pp. 50–60, 80–109, 155–157

#### T8.1 — Polyolefins (PE, PP) (2 questions)

- `t8-01` [recall, D1] LDPE is industrially produced by:
- `t8-02` [concept, D2] Polypropylene is frequently used for integral living hinges in moulded containers. Which feature most directly supports repeated flexing of a properly desi

#### T8.2 — Vinyl & styrenic polymers (PVC, PS, ABS) (5 questions)

- `t8-03` [recall, D1] The largest single application of PVC is in:
- `t8-04` [compare, D2] Which sequence lists the three styrenic materials from most brittle to toughest?
- `t8-05` [concept, D2] Which three monomer components give ABS (acrylonitrile–butadiene–styrene) its name?
- `t8-16` [recall, D1] SBR, the workhorse tyre rubber, is a copolymer of:
- `t8-27` [higher, D4] ABS outperforms HIPS primarily because adding acrylonitrile to the rubber-grafted styrene system:

#### T8.3 — Engineering plastics (PA, PET, PC, POM, PMMA, PTFE) (7 questions)

- `t8-07` [recall, D1] Which polymer is famously used as a non-stick coating and is therefore processed by sintering or paste extrusion rather than conventional melt-flow process
- `t8-08` [concept, D3] Nylon 6,6 is strong because of H-bonding between chains, yet it absorbs water. Why is moisture a design problem?
- `t8-12` [statement, D2] Which statement(s) about silicone polymers is/are correct?
- `t8-13` [recall, D1] The precursor polymer for most carbon fibre is:
- `t8-20` [concept, D2] Why is polycarbonate widely used for transparent structural parts although PMMA is slightly clearer?
- `t8-25` [compare, D3] Why is PTFE fundamentally harder to process by conventional melt extrusion than polyethylene?
- `t8-26` [recall, D1] Which property combination makes polyoxymethylene (POM, acetal) especially useful for precision gears and bearings?

#### T8.4 — Thermosets & rubbers (PF, UF, epoxy, SBR, EPDM) (4 questions)

- `t8-10` [concept, D2] How do two-part epoxy adhesives cure?
- `t8-11` [compare, D3] Phenol–formaldehyde resins: novolac vs resol. Which statement is correct?
- `t8-17` [concept, D3] Why is EPDM rubber usually more resistant to ozone cracking and outdoor weathering than natural rubber?
- `t8-22` [statement, D3] Which statement(s) about thermosetting industrial polymers is/are correct?

#### T8.5 — Application-driven selection (10 questions)

- `t8-06` [apply, D3] A transparent, impact-resistant window for a machine guard is required. Best choice:
- `t8-09` [match, D2] Match each polymer with its classic application.
- `t8-14` [apply, D4] Among the listed candidates, which is the most defensible choice for a semi-rigid automotive fuel line that must limit swelling and hydrocarbon permeation 
- `t8-15` [compare, D2] Which pairing of polymer and gas-barrier behaviour is correct?
- `t8-19` [apply, D3] A connector needs continuous 200 °C electrical insulation, excellent dielectric performance and chemical inertness. The sleeve carries little sustained mec
- `t8-23` [concept, D2] Why is PMMA preferred over PS for outdoor signage?
- `t8-24` [apply, D4] A housing must be flame-retardant, dimensionally stable and mouldable at high precision. The best matrix choice is:
- `t8-28` [statement, D2] Which statement(s) about commodity vs engineering plastics is/are correct?
- `t8-29` [apply, D3] A reusable transparent labware container must tolerate repeated steam sterilisation at 121 °C and maintain useful impact resistance. Which candidate is the
- `t8-30` [higher, D4] A disposable lid for a hot takeaway beverage needs low cost, stiffness and enough heat resistance for brief contact near 90–95 °C. Clarity is desirable but

#### T8.6 — Monomer–polymer identification and polymer origin (2 questions)

- `t8-18` [match, D1] Match each monomer with the polymer it forms.
- `t8-21` [recall, D1] Which polymer is a semi-synthetic material derived from a natural polymer?

## Source-alignment decisions and gaps

The following are the source-based findings established by the companion assessment audit. They are not inferred solely from subtopic counts.

| Topic | Source objective / page | Current question coverage | Decision |
|---|---|---|---|
| T1 | SBR styrene-content/property trend, p.16 | No direct item among T1's 32 questions. | Confirmed gap: add one focused question on tensile strength increasing and elongation/abrasion resistance decreasing as styrene content rises. |
| T2 | Monomer functionality table, p.50 | Existing T2 questions cover chain/step mechanisms and kinetics; no direct count/classify item for the named mono-, bi- and trifunctional examples. | Confirmed gap: one source-faithful functionality classification/application item. |
| T3 | Solution polymerization isolation and uses, pp.22–23 | Existing items cover chain transfer, solvent effects and process selection; no direct isolation sequence/use-case question. | Confirmed gap: assess evaporation or precipitation in a non-solvent, removal of solvent traces and the source's solution-form adhesive/coating uses. |
| T3 | Surfactant classes and micelle system, pp.28–30 | CMC, micelles, emulsion/suspension and particle nucleation are assessed; explicit classification of anionic/cationic/non-ionic examples is not directly tested. | Partial coverage: consider one classification item only if the lesson objectives require the named examples. Avoid another generic CMC item. |
| T4 | Method-to-average chart, p.48 | Membrane osmometry, light scattering, sedimentation-equilibrium, viscometry and SEC/GPC are covered. End-group analysis, cryoscopy, ebulliometry, vapour-phase osmometry and sedimentation-velocity lack direct items in the prompt scan. | Partial coverage: decide whether a concise method-to-average discrimination item is warranted; do not conflate sedimentation velocity and equilibrium. |
| T5 | Named crystalline/amorphous examples and properties, p.49 | Representative PE/PP/PET/nylon, PS/PMMA/PC examples and morphology/property relations are tested. | Representative coverage. Do not add one recall question per polymer name. Preserve the slide's printed “Modified Polyphenylene Oxide (POM)” mismatch as a source issue. |
| T6 | Named Tg/structure comparisons and side-chain trend, pp.64–67 | General factors, Fox/Fox–Flory, DSC/DMA, HDT/Vicat and one broad lowest-Tg item are tested. The named structural comparisons and linear-alkyl-side-chain trend are not directly assessed as source examples. | Partial coverage: one comparative/application question may cover the main structural factors. Avoid memorising every table value. |
| T6 | Polyethylene Tg, p.65 versus question t6-06 | Lecture and reconciled lesson print −20 °C; t6-06 states approximately −120 °C. | Source discrepancy unresolved. Do not silently alter the question until its origin is reviewed. |
| T7 | Recombinant spider-silk production and product forms, pp.78–79 | Existing items cover fibroin β-sheet structure and protein chemistry; no direct recombinant production sequence or product-form item. | Confirmed gap: one integrated item based strictly on the source diagram and listed forms. |
| T8 | Silicone-based TPU scheme, p.102 | General silicone polymer item exists; no direct identification of the p.102 scheme's labelled components. | Confirmed gap: one component-identification item using only H12MDI, PTMG, PDMS, 1,4-BD, THF/DMAC and T-12 labels. |

## Coverage interpretation

- Question counts are not a proxy for source completeness: T1.1 has eight mapped questions but still does not assess the T2/T8 cross-topic functionality table on p.50.
- Some source topics have cross-topic content. Preserve the existing primary subtopic mapping and record secondary source links separately rather than moving questions between topics.
- Existing bank items sometimes use external technical context in their explanations. New source-aligned items must distinguish what the lecture explicitly states from any extension.
- The source map is a page-navigation inventory. Pages and diagrams marked as visual-critical remain subject to the visual review safeguards in the companion audit.
- T9–T11 are outside this T1–T8 crosswalk; their prior 97-question comparison remains a separate audit.

## Authoring gate

Do not add questions until:
1. The six confirmed gaps and partial-coverage decisions above are reconciled with the full lesson text.
2. The T6 polyethylene value discrepancy is resolved by tracing the question's source.
3. The question-quality standard is applied to each proposed item, including distractor rationales and source page traceability.
4. New question IDs, metadata counts, primary mappings and learner-progress compatibility are validated together.

No question-bank content, IDs, metadata, lesson text, exports, or learner progress were modified by this crosswalk.


## Follow-up after eight live question additions — 16 November 2026

Checkpoint 001 recorded the original 208 questions in T1–T8. Eight source-grounded items have since been added and mapped, bringing the current T1–T8 inventory to **216 questions**.

| New ID | Primary subtopic | Objective |
|---|---|---|
| `t1-33` | T1.5 | SBR styrene-content trend across tensile strength, elongation and abrasion resistance |
| `t1-34` | T1.1 | Source p.50 functionality classification: glycine, lactic acid and malic acid |
| `t3-23` | T3.2 | Solution-polymer isolation routes and residual-solvent limitation |
| `t3-24` | T3.3 | Anionic, cationic and non-ionic surfactant examples |
| `t4-31` | T4.3 | Sedimentation-velocity and sedimentation-equilibrium methods listed on p.48 |
| `t6-23` | T6.3 | Source examples linking structure and Tg across pp.64–67 |
| `t7-17` | T7.4 | Recombinant spider-silk production sequence from p.79 |
| `t8-31` | T8.4 | Silicone-based TPU component labels from p.102 |

The original 208-question crosswalk remains as the baseline snapshot; this extension records the additions without rewriting the earlier audit evidence. The six confirmed source gaps and the two partial-coverage objectives now have direct assessment items. The T6-06 polyethylene value discrepancy remains flagged and was not changed.


## Current T1–T8 inventory correction — 16 November 2026

The earlier follow-up recorded 216 questions after the first eight additions. Two additional source-grounded items have since been added:
- `t4-32 → T4.3`: p.48 method-chart mapping for end-group analysis, cryoscopy, ebulliometry and osmometry.
- `t8-32 → T8.4`: pp.155–157 natural-rubber latex coagulation and ammonia preservation.

The current T1–T8 inventory is **218 questions**, not 216. The complete MT203 bank is 344 questions across 11 topics. These are additions to the existing subtopics; no syllabus topic or subtopic was created.
