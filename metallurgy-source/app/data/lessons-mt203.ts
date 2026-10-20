// MT203 — Polymer Science and Technology: condensed lesson theory.
// Eleven topics mapped to the four official modules (Fundamentals, Industrial
// Polymers, Properties, Compounding & Processing) plus the Quiz-1 supplement.
// Kept in the bundle (small); the question JSON lives in public/data and loads
// on demand. Prose uses the same markdown dialect as MT202: $inline KaTeX$,
// $$display KaTeX$$, **bold**, *italic*, tables, and :::warning / :::takeaway
// / :::definition / :::example semantic containers.

export type Section = { h: string; p: string };
export type Formula = { name: string; expr: string; note?: string; vars?: string[] };

export type Lesson = {
  id: string;
  num: number; // module number it belongs to (1–4)
  title: string;
  subtitle: string;
  aim: string;
  sections: Section[];
  formulas: Formula[];
  memorise: string[];
};

export const LESSONS: Record<string, Lesson> = {
  // ===================================================== MODULE 1
  t1: {
    id: "t1",
    num: 1,
    title: "Fundamentals, Classification & Architecture",
    subtitle: "Topic 1 · what a polymer is and how it is named and shaped",
    aim: "Move fluently between a monomer, its repeat unit, its chain topology and its commercial name — this topic supplies the vocabulary every later question assumes.",
    sections: [
      {
        h: "What a polymer is",
        p: "A **polymer** (Greek *poly* = many, *meres* = parts) is a macromolecule built by repeatedly linking small molecules called **monomers**. The unit left behind in the chain is the **repeat unit** (constitutional repeat unit, CRU); the number of repeat units in one chain is the **degree of polymerization**, $DP$.\n\n$$ M_n \\approx DP \\times M_{repeat} $$\n\nA synthetic polymer *sample* is never a single chain length — it is a distribution of chain lengths, which is why every molecular weight is a statistical average (Topic 4).\n\n:::warning Exam trap\nThe repeat unit is **not** the monomer. Ethylene $CH_2{=}CH_2$ becomes the repeat unit $\\text{–}CH_2\\text{–}CH_2\\text{–}$ (two carbons, four hydrogens); styrene's repeat unit keeps the pendant phenyl ring. Count atoms on the *repeat unit*, never on the monomer name.\n:::\n\n:::takeaway Milestones (memorise)\nCelluloid 1868 (Hyatt) · **Bakelite 1909 (Baekeland) — first fully synthetic polymer** · Staudinger's macromolecular hypothesis 1920s · Carothers' nylon & step-growth theory 1930s · **Ziegler–Natta stereospecific catalysis 1950s (Nobel)** — enabled tacticity control.\n:::",
      },
      {
        h: "Classification — the seven axes",
        p: "A single polymer belongs to several classes at once; an exam question always names its *axis*.\n\n| Basis | Categories | Examples |\n|---|---|---|\n| Origin | natural / semi-synthetic / synthetic | cellulose, rubber / cellulose acetate / PE, nylon |\n| Structure | linear / branched / cross-linked | HDPE / LDPE / vulcanized rubber |\n| Thermal behaviour | thermoplastic / thermosetting | PE, PP, PVC / phenolics, epoxies |\n| Line of growth | homopolymer / copolymer | PS / SBR, ABS |\n| Molecular arrangement | amorphous / (semi)crystalline | atactic PS / HDPE, PP |\n| Mode of polymerization | addition (chain) / condensation (step) | PE, PVC / nylon 6,6, PET |\n| End use | plastics, elastomers, fibres, adhesives, coatings | PP / NR, SBR / nylon, PET / epoxy / alkyd |\n\n:::warning Exam trap\nWhether a polymer acts as a plastic, fibre or elastomer depends on the **balance of intermolecular forces, chain flexibility and crystallinity** — *not* on its chemical family. Nylon can be a fibre *or* an engineering plastic depending on grade and orientation.\n:::",
      },
      {
        h: "Nomenclature",
        p: "Three naming systems coexist:\n- **Source-based (common):** *poly* + monomer name — polyethylene, polystyrene, poly(vinyl chloride). Parentheses wrap multi-word monomer names: poly(vinyl **acetate**), not polyvinylacetate.\n- **Structure-based (IUPAC):** name the CRU — polystyrene is poly(1-phenylethylene). Rigorous but rare in industry.\n- **Trade names / abbreviations:** PE, PP, PVC, PET, PMMA, PTFE, PC, ABS, SBR, NBR, EPDM.\n\n**Copolymer connectives** encode the sequence — learn these exactly:\n- `co` → random: poly(styrene-**co**-butadiene) = SBR\n- `alt` → alternating: poly(styrene-**alt**-maleic anhydride)\n- `block` → block: poly(styrene-**block**-butadiene) = SBS\n- `graft` → graft: poly(styrene-**graft**-butadiene) = HIPS\n\n:::takeaway Nylon numbering\nNylon **6,6** = two monomers each with **6** carbons (hexamethylenediamine + adipic acid). Nylon **6** = one monomer with **6** carbons (caprolactam, ring-opening). Nylon **6,10** = diamine of 6 + diacid of 10.\n:::",
      },
      {
        h: "Molecular architecture",
        p: "Three ideas must never be confused:\n\n**Topology (how chains connect)** — *linear* (HDPE), *branched* (LDPE: branches stop chains packing → lower crystallinity and density), *cross-linked/network* (lightly = elastomers; densely = thermosets). Star, comb and dendrimer architectures come from multifunctional initiators.\n\n**Configuration (fixed by bonding — needs bond breakage to change)**\n- **Tacticity** (vinyl polymers): *isotactic* (all substituents one side), *syndiotactic* (alternating), *atactic* (random). Isotactic PP is crystalline and rigid; atactic PP is amorphous and tacky.\n- **Cis/trans geometry** in diene polymers: natural rubber = *cis*-1,4-polyisoprene (flexible, elastomeric); gutta-percha = *trans*-1,4-polyisoprene (crystalline, rigid).\n\n**Conformation (rotation about single bonds — changes freely, no bond breaking)** — random coil, extended zig-zag, helix.\n\n:::warning Exam trap\nTacticity is **configuration**; a coiled chain is **conformation**. Changing conformation costs no bond energy; changing configuration does.\n:::",
      },
      {
        h: "Copolymer architectures",
        p: "| Type | Arrangement | Example |\n|---|---|---|\n| Random | –A–B–B–A–A–B– | SBR |\n| Alternating | –A–B–A–B–A–B– | styrene–maleic anhydride |\n| Block | –AAAA–BBBB– | SBS thermoplastic elastomer |\n| Graft | backbone A with B side-chains | HIPS, ABS |\n\nA **thermoplastic elastomer** like SBS works because the hard polystyrene end-blocks aggregate into glassy domains that act as *physical* cross-links anchoring a rubbery mid-block — no chemical vulcanization needed, so it can be re-melted.",
      },
    ],
    formulas: [
      { name: "Degree of polymerization (from Mw)", expr: "DP = \\frac{M}{M_{repeat}}", vars: ["M — molar mass of the chain", "M_repeat — molar mass of one repeat unit"], note: "number-average DP uses Mn" },
      { name: "Number-average MW", expr: "M_n = \\frac{\\sum N_i M_i}{\\sum N_i}", vars: ["N_i — number of chains (or moles) of species i", "M_i — molar mass of species i"], note: "sensitive to low-MW chains" },
    ],
    memorise: [
      "Repeat unit ≠ monomer — count atoms on the repeat unit.",
      "Bakelite 1909 = first fully synthetic polymer; Ziegler–Natta 1950s = tacticity control.",
      "Isotactic/crystalline · atactic/amorphous — tacticity sets crystallinity.",
      "cis-1,4 = natural rubber (elastomeric) · trans-1,4 = gutta-percha (rigid).",
      "Nylon 6,6 = two 6-carbon monomers; nylon 6 = caprolactam ring-opening.",
      "co = random, alt = alternating, block = block, graft = graft.",
    ],
  },

  t2: {
    id: "t2",
    num: 1,
    title: "Polymerization Mechanisms",
    subtitle: "Topic 2 · chain-growth vs step-growth, and the four reactive centres",
    aim: "Explain *why* chain-growth gives high MW instantly while step-growth needs >98% conversion — the single most examined distinction in the course.",
    sections: [
      {
        h: "Two orthogonal classifications",
        p: "Do not conflate them:\n\n- **Carothers'** (chemical): *addition* (no small molecule lost) vs *condensation* (small molecule — H₂O, HCl, MeOH — eliminated).\n- **Mechanistic** (rigorous): *chain-growth* vs *step-growth*.\n\nThey usually line up, but not always: **polyurethanes** are an *addition* reaction (–NCO + –OH, nothing eliminated) that proceeds by a **step-growth** mechanism. Ring-opening polymerization is also addition by chemistry but can follow either mechanism.",
      },
      {
        h: "Chain (addition) polymerization",
        p: "Monomer adds **one unit at a time** to a growing **reactive centre** at the chain end. High-MW polymer appears almost **instantly**; monomer concentration then falls steadily as chains keep consuming it.\n\n**Stages:**\n1. **Initiator decomposes** to radicals: $\\text{BPO} \\rightarrow 2\\,\\text{RO}^{\\bullet}$ (or AIBN → 2 radicals + N₂).\n2. **Initiation:** $\\text{R}^{\\bullet} + \\text{CH}_2{=}\\text{CHX} \\rightarrow \\text{R–CH}_2\\text{–}\\dot{\\text{C}}\\text{HX}$\n3. **Propagation:** the active end adds thousands of monomers in fractions of a second.\n4. **Chain transfer:** the radical is passed to another molecule (monomer, solvent, polymer, deliberate agent) — **stops one chain, starts another**; lowers MW *without* slowing the overall reaction.\n5. **Termination:** *combination* (two radicals couple → one dead chain, MW roughly doubles) or *disproportionation* (H transfer → one saturated + one unsaturated chain end).\n\n:::warning Exam trap\nIonic and coordination systems often have **no bimolecular termination** — they can be **living** polymerizations (used to make block copolymers like SBS).\n:::",
      },
      {
        h: "The four reactive centres",
        p: "| Mechanism | Centre | Typical monomers | Notes |\n|---|---|---|---|\n| Free-radical | $\\text{R}^{\\bullet}$ | ethylene, styrene, vinyl acetate, vinyl chloride, acrylates | most important; tolerant of functional groups and water |\n| Cationic | carbocation $+$ | isobutylene, vinyl ethers | strong Lewis/Brønsted acid co-catalyst; sensitive to trace water |\n| Anionic | carbanion $-$ | styrene, dienes, methacrylates | can be **living** → block copolymers |\n| Coordination (Ziegler–Natta / metallocene) | metal–carbon bond | ethylene, propylene | gives **stereoregular** (isotactic/syndiotactic) + linear chains |\n\n**Regiochemistry matters:** head-to-tail addition is the normal outcome because it places the radical on the more substituted (more stable) carbon. Head-to-head defects weaken the chain.",
      },
      {
        h: "Step (condensation) polymerization",
        p: "Any two species carrying mutually reactive end groups can react — monomer–monomer, monomer–oligomer, **oligomer–oligomer**. This is why molecular weight builds up **slowly** and only shoots up at very high conversion.\n\n**Carothers' equation** captures it:\n\n$$ DP = \\frac{1}{1-p} $$\n\n| p | DP |\n|---|---|\n| 0.50 | 2 |\n| 0.90 | 10 |\n| 0.98 | 50 |\n| 0.99 | 100 |\n| 0.999 | 1000 |\n\nSo **useful MW needs p > 98%** — and needs an exact **stoichiometric balance** of functional groups.\n\n**Functionality** decides topology: bifunctional monomers → linear; functionality > 2 (glycerol, trifunctional phenol) → branched/cross-linked, with a sudden **gel point** where the mass becomes one infinite network.\n\n:::takeaway Typical step-growth polymers\nPolyesters (PET), polyamides (nylon 6,6), polycarbonates, polyurethanes, phenol-/urea-/melamine-formaldehyde resins, polyimides, polysulfones.\n:::",
      },
      {
        h: "Kinetics of free-radical polymerization",
        p: "Under the steady-state assumption (radical concentration constant):\n\n$$ R_p = k_p[M]\\sqrt{\\frac{f k_d [I]}{k_t}} $$\n\n- $R_p$ — rate of polymerization\n- $k_p, k_t, k_d$ — propagation, termination, initiator-decomposition rate constants\n- $[M], [I]$ — monomer, initiator concentrations\n- $f$ — initiator efficiency (typically 0.3–0.8; not every radical fragment successfully starts a chain)\n\n**Consequences:** $R_p \\propto [M]$ and $R_p \\propto [I]^{1/2}$. The **half-power** in $[I]$ is the signature of bimolecular termination.\n\n**Kinetic chain length** $\\nu = R_p / R_t$. For **combination**, $\\overline{DP} = 2\\nu$; for **disproportionation**, $\\overline{DP} = \\nu$.\n\n**Degree of polymerization** $\\overline{DP}_n = k_p[M] / \\big( f k_d k_t [I] \\big)^{1/2}$ — so **more initiator → faster but lower MW**.\n\n:::warning The gel (Trommsdorff) effect\nIn bulk polymerization, viscosity rises so much that two long chains can no longer find each other to terminate — but small monomers still diffuse to the active end. Termination stalls while propagation continues: $[M^{\\bullet}]$ spikes, rate and MW surge, and heat can run away. This autoacceleration is the **Trommsdorff or gel effect**.\n:::",
      },
      {
        h: "Ring-opening polymerization (ROP)",
        p: "Driven by **relief of ring strain**; no small molecule is eliminated (so it is *addition* by chemistry). Examples: ε-caprolactam → **nylon 6**; ethylene oxide; propylene oxide; ε-caprolactone. The mechanism may be ionic or coordination.",
      },
    ],
    formulas: [
      { name: "Carothers' equation", expr: "DP = \\frac{1}{1-p}", vars: ["p — extent (fraction) of reaction"], note: "step-growth; useful MW needs p > 0.98" },
      { name: "Carothers (two functional groups)", expr: "DP = \\frac{1+r}{1+r-2rp}", vars: ["r — molar ratio of the less abundant to the more abundant functional group (r ≤ 1)", "p — extent of reaction"], note: "r < 1 caps DP even at p = 1: DP = (1+r)/(1−r)" },
      { name: "Steady-state rate", expr: "R_p = k_p[M]\\sqrt{\\frac{f k_d [I]}{k_t}}", vars: ["k_p — propagation constant", "k_t — termination constant", "k_d — initiator decomposition constant", "[M], [I] — monomer, initiator concentrations", "f — initiator efficiency"], note: "R_p ∝ [M][I]^{1/2}" },
      { name: "Kinetic chain length", expr: "\\nu = \\frac{R_p}{R_t}", note: "DP̄ = 2ν (combination), DP̄ = ν (disproportionation)" },
      { name: "Number-average DP (radical)", expr: "\\overline{DP}_n = \\frac{k_p [M]}{\\big(f k_d k_t [I]\\big)^{1/2}}", note: "more initiator → lower MW" },
    ],
    memorise: [
      "Chain-growth: high MW instantly · step-growth: MW only near p → 1.",
      "DP = 1/(1−p): p = 0.99 → DP 100; p = 0.999 → DP 1000.",
      "R_p ∝ [M][I]^{1/2} — the ½ power means bimolecular termination.",
      "Combination → DP̄ = 2ν · disproportionation → DP̄ = ν.",
      "More initiator = faster + LOWER molecular weight.",
      "Gel effect = termination starved by viscosity → autoacceleration.",
      "Ionic/coordination can be living (no termination) → block copolymers.",
    ],
  },

  t3: {
    id: "t3",
    num: 1,
    title: "Polymerization Techniques",
    subtitle: "Topic 3 · bulk, solution, suspension, emulsion, melt polycondensation",
    aim: "Choose a technique from a scenario and justify it — the exam tests *why*, not just *which*.",
    sections: [
      {
        h: "Technique ≠ mechanism",
        p: "Bulk, solution, suspension and emulsion are **process choices layered on top of** a chosen mechanism. Free-radical PVC is mostly made by **suspension** polymerization; PS latex by **emulsion**; nylon 6,6 by **melt polycondensation**. Always separate 'what chemistry' from 'how it is carried out'.",
      },
      {
        h: "The four classical techniques",
        p: "| Technique | Recipe | Advantages | Limitations |\n|---|---|---|---|\n| **Bulk (mass)** | monomer + initiator only, no solvent | highest purity, simple, high reactor yield | poor heat removal, viscosity climbs, **runaway / gel-effect risk** |\n| **Solution** | monomer dissolved in solvent | good heat + viscosity control | solvent must be removed; **chain transfer to solvent lowers MW** |\n| **Suspension** | monomer droplets in water; initiator is **monomer-soluble** | easy heat control; polymer isolated as **beads/pearls** | needs suspending agent; batch process |\n| **Emulsion** | monomer emulsified in water with **surfactant**; initiator is **water-soluble** | very high MW at high rate, low viscosity throughout, good heat control | surfactant residues must be removed |\n\n:::warning Exam trap — suspension vs emulsion\n**Suspension:** droplets 30–300 µm, *no* micelles, monomer-soluble initiator, physical dispersion. **Emulsion:** micelles present, particles 0.01–1 µm, water-soluble initiator (e.g. persulfate), true heterogeneous **nucleation inside micelles**. Emulsion gives **both** higher rate *and* higher MW simultaneously — impossible in bulk.\n:::",
      },
      {
        h: "Melt polycondensation — the fifth technique",
        p: "The monomer/oligomer melt itself is the reaction medium: no solvent, so **no chain transfer** and no solvent-removal cost. Used for **PET** and **nylon 6,6**.\n\nBecause step-growth needs p > 98% and any water left behind drives the equilibrium *backwards*, the whole art is **removing the condensate**:\n- high temperature (> 300 °C),\n- progressively high vacuum (< 1 mbar),\n- thin-film / wiped-film evaporators or thin-film reactors to give water a short diffusion path,\n- sometimes a final solid-state polymerization (SSP) step below Tm to raise MW without viscous melt handling.\n\n:::takeaway\nMelt polycondensation = step-growth + vacuum + heat. If a question mentions vacuum and condensate removal, it is this technique.\n:::",
      },
    ],
    formulas: [
      { name: "Emulsion vs suspension initiator", expr: "\\text{Suspension: } I \\in \\text{monomer} \\qquad \\text{Emulsion: } I \\in \\text{water}", note: "the fastest way to tell them apart in an exam" },
    ],
    memorise: [
      "Bulk = pure but hot; Solution = controlled but MW drops (chain transfer).",
      "Suspension = beads, monomer-soluble initiator, no micelles.",
      "Emulsion = micelles, water-soluble initiator, high MW *and* high rate.",
      "Melt polycondensation = vacuum + heat, used for PET and nylon 6,6.",
      "Water left in a step-growth melt pushes the equilibrium backwards.",
    ],
  },

  t4: {
    id: "t4",
    num: 1,
    title: "Molecular Weight & Distribution",
    subtitle: "Topic 4 · Mn, Mw, Mz, Mv, PDI and how each is measured",
    aim: "Compute every average from a table of fractions, rank them, and pick the right experimental method for each — a guaranteed numerical source.",
    sections: [
      {
        h: "Why averages",
        p: "A polymer sample is a **mixture of chain lengths**, so MW is a statistical average and the spread is a **molecular-weight distribution (MWD)**. Each average weights the distribution differently:\n\n$$ M_n = \\frac{\\sum N_i M_i}{\\sum N_i} \\qquad M_w = \\frac{\\sum N_i M_i^2}{\\sum N_i M_i} \\qquad M_z = \\frac{\\sum N_i M_i^3}{\\sum N_i M_i^2} $$\n\n| Average | Sensitive to | Typical method |\n|---|---|---|\n| $M_n$ — number-average | **low-MW** chains (they are numerous) | osmometry, end-group analysis |\n| $M_w$ — weight-average | **high-MW** chains | light scattering |\n| $M_z$ — z-average | very large chains | ultracentrifugation |\n| $M_v$ — viscosity-average | chains dominating solution viscosity | dilute-solution viscometry |\n\nFor any real distribution: **$M_n \\le M_v \\le M_w \\le M_z$**.\n\n:::takeaway The physical meaning\n$M_n$ counts *chains*, so a few tiny chains drag it down. $M_w$ weighs by *mass*, so a few huge chains dominate. That is why $M_w/M_n$ measures breadth.\n:::",
      },
      {
        h: "Polydispersity",
        p: "$$ \\text{PDI} = \\frac{M_w}{M_n} \\ge 1 $$\n\n- **PDI = 1** only for a perfectly **monodisperse** sample — approached by proteins and by living/controlled polymerizations (no termination → all chains start together and grow equally).\n- **Step-growth** at high conversion → the **most-probable (Flory) distribution** with a theoretical limiting **PDI = 2**.\n- **Free-radical** → **PDI ≈ 2–5** (broad).\n- **Branching** (LDPE) broadens it further; commercial PDI can exceed 10–20.",
      },
      {
        h: "Worked example — the template for every MW numerical",
        p: "A sample contains 1 mol of chains at 10,000 g/mol and 1 mol at 100,000 g/mol. Find Mn, Mw, PDI.\n\n$$ M_n = \\frac{1(10{,}000) + 1(100{,}000)}{1 + 1} = \\frac{110{,}000}{2} = 55{,}000 $$\n\n$$ M_w = \\frac{1(10{,}000)^2 + 1(100{,}000)^2}{1(10{,}000) + 1(100{,}000)} = \\frac{10^8 + 10^{10}}{110{,}000} = 91{,}818 $$\n\n$$ \\text{PDI} = \\frac{91{,}818}{55{,}000} = 1.67 $$\n\n:::warning Method check\n$M_n = 55{,}000$ vs $M_w = 91{,}818$ — indeed $M_n < M_w$, and PDI > 1 as it must be. Always sanity-check the ordering.\n:::\n\nA common variant gives **weight fractions** $w_i$ instead of mole numbers — then $M_w = \\sum w_i M_i$ and $1/M_n = \\sum w_i / M_i$.",
      },
      {
        h: "Measurement methods",
        p: "| Method | Gives | Principle |\n|---|---|---|\n| End-group analysis | $M_n$ | titrate/UV/NMR chain ends — only at moderate MW, needs known end groups |\n| Membrane osmometry | $M_n$ | colligative property: $\\pi/c \\to RT/M_n$ |\n| Ebulliometry / cryoscopy | $M_n$ | boiling-point elevation / freezing-point depression |\n| Light scattering | $M_w$ (+ size/shape) | excess scattered intensity ∝ mass |\n| Dilute-solution viscometry | $M_v$ | Mark–Houwink: $[\\eta] = K M_v^{a}$ |\n| **GPC / SEC** | full MWD ($M_n, M_w, M_z$, PDI) | separates by hydrodynamic volume — the modern standard |\n| Ultracentrifugation | $M_z$ + shape | sedimentation equilibrium/velocity |\n\n:::warning Exam trap\nColligative methods (osmometry, ebulliometry, cryoscopy) depend only on *particle number*, so they sense **low-MW** species → they give $M_n$. Light scattering depends on mass squared → high-MW species → $M_w$.\n:::",
      },
      {
        h: "MW and distribution vs properties",
        p: "- Tensile strength, toughness, melt viscosity and softening behaviour **rise with $M_n$ then plateau** — the plateau is the **entanglement plateau**.\n- Below a **critical entanglement MW** the chains slip past each other and the material is waxy/weak.\n- **Melt viscosity** $\\eta \\propto M_w^{3.4}$ above the critical entanglement MW.\n- A **broad** MWD improves *processability* (more shear thinning, easier flow) but costs some mechanical uniformity.",
      },
    ],
    formulas: [
      { name: "Number-average MW", expr: "M_n = \\frac{\\sum N_i M_i}{\\sum N_i}", note: "colligative methods; sensitive to low MW" },
      { name: "Weight-average MW", expr: "M_w = \\frac{\\sum N_i M_i^2}{\\sum N_i M_i}", note: "light scattering; sensitive to high MW" },
      { name: "Z-average MW", expr: "M_z = \\frac{\\sum N_i M_i^3}{\\sum N_i M_i^2}", note: "ultracentrifugation" },
      { name: "Polydispersity index", expr: "\\text{PDI} = \\frac{M_w}{M_n}", note: "= 1 monodisperse; → 2 step-growth; 2–5 free-radical" },
      { name: "Mark–Houwink equation", expr: "[\\eta] = K M_v^{a}", vars: ["[\\eta] — intrinsic viscosity", "K, a — polymer–solvent constants (0.5 < a < 1)"], note: "gives Mv" },
      { name: "Melt viscosity", expr: "\\eta \\propto M_w^{3.4}", note: "above the critical entanglement molecular weight" },
    ],
    memorise: [
      "Mn ≤ Mv ≤ Mw ≤ Mz — always.",
      "PDI = Mw/Mn · = 1 monodisperse, = 2 step-growth limit, 2–5 free-radical.",
      "Colligative → Mn · light scattering → Mw · viscometry → Mv · GPC → everything.",
      "η ∝ Mw^3.4 above the entanglement MW.",
      "Mn counts chains (low-MW sensitive); Mw weights by mass (high-MW sensitive).",
    ],
  },

  t5: {
    id: "t5",
    num: 1,
    title: "Polymer Crystallinity",
    subtitle: "Topic 5 · what can crystallize, how it looks, and what it changes",
    aim: "Predict whether a given polymer crystallizes and how crystallinity shifts every property a question can ask about.",
    sections: [
      {
        h: "Never 100% crystalline",
        p: "Long entangled chains cannot fold perfectly, so crystallizable polymers are **semi-crystalline**: crystalline regions (lamellae) embedded in amorphous material. Degree of crystallinity is measured by:\n- **X-ray diffraction** — sharp crystalline reflections superimposed on a broad amorphous halo,\n- **density** — crystalline regions pack tighter,\n- **DSC** — heat of fusion relative to a 100%-crystalline reference.",
      },
      {
        h: "Structural requirements for crystallizability",
        p: "1. **Regularity** — a chemically regular backbone. Irregular copolymers and atactic vinyl polymers generally *cannot* crystallize.\n2. **Chain flexibility** — chains must fold into a lattice; bulky stiff side groups hinder it.\n3. **Interchain forces** — strong secondary bonding (H-bonding in nylons, dipoles in PVC/PVDC) packs chains tighter.\n4. **Stereoregularity & linearity** — isotactic/syndiotactic, unbranched chains crystallize far more readily.\n\n:::takeaway Canonical comparisons\nIsotactic PP (crystalline, rigid) vs atactic PP (amorphous, tacky). **HDPE (linear, ~80% crystalline, dense) vs LDPE (branched, ~50%, less dense).**\n:::",
      },
      {
        h: "Morphology",
        p: "On cooling from melt or solution:\n1. Chains fold back and forth into thin **lamellae** (chain-folded crystals, ~10 nm thick).\n2. Lamellae radiate outward from a nucleation site into spherical **spherulites** — the dominant bulk morphology in PE, PP and nylon.\n3. Under a **polarizing microscope** spherulites show the characteristic **Maltese-cross** pattern.\n\nThe **lamellar fold period** and **spherulite size** control clarity: spherulites large enough to scatter visible light make the part hazy.",
      },
      {
        h: "Effect of crystallinity on properties",
        p: "| Property | Effect of increasing crystallinity |\n|---|---|\n| Density | **increases** (tighter packing) |\n| Stiffness & tensile strength | **increase** |\n| Toughness / elongation at break | **decrease** (more brittle) |\n| Optical clarity | **decreases** — crystallites scatter light |\n| Solvent & gas resistance | **improves**; permeability falls |\n| Melting behaviour | a sharp **Tm** appears (in addition to Tg) |\n\n**Orientation** (drawing/stretching) aligns both amorphous tie molecules and crystallites along the draw direction, raising strength and modulus *anisotropically* — the basis of fibres and BOPP film.",
      },
    ],
    formulas: [
      { name: "Degree of crystallinity (density)", expr: "x_c = \\frac{\\rho_c (\\rho_s - \\rho_a)}{\\rho_s (\\rho_c - \\rho_a)}", vars: ["\\rho_s — measured semicrystalline density", "\\rho_c — fully crystalline density", "\\rho_a — amorphous density"], note: "mass-fraction form; volume-fraction variant also appears" },
    ],
    memorise: [
      "Crystallinity needs: regularity + flexibility + strong interchain forces + stereoregularity.",
      "Lamellae → spherulites → Maltese cross under polarized light.",
      "↑ crystallinity → ↑density, ↑stiffness, ↑strength, ↑chemical resistance, ↓clarity, ↓toughness.",
      "HDPE vs LDPE = linear vs branched; the density difference is crystallinity.",
    ],
  },

  t6: {
    id: "t6",
    num: 1,
    title: "Thermal Transitions — Tg, Tm, HDT",
    subtitle: "Topic 6 · the glass transition, melting point and service temperature",
    aim: "Rank Tg across a set of polymers from structure alone, and separate the three transitions that students constantly blur.",
    sections: [
      {
        h: "The glass transition, Tg",
        p: "A **second-order-like** transition in the **amorphous** regions where large-scale **segmental (backbone) motion** is frozen below Tg and enabled above it.\n\n- **Below Tg:** hard, glassy, brittle.\n- **Above Tg (amorphous):** soft, rubbery → eventually viscous and flowable.\n- Detected as a **step** (not a peak) in specific volume, $C_p$ or modulus — by **DSC, dilatometry or DMA**.\n\n**Three theories:** *free-volume* (Tg = the temperature where fractional free volume falls to a critical value), *kinetic* (Tg is not a true thermodynamic transition — it depends on heating/cooling rate), *Gibbs–DiMarzio equilibrium* (an underlying true second-order transition at equilibrium cooling rates).",
      },
      {
        h: "Factors that raise or lower Tg",
        p: "| Factor | Effect on Tg | Why |\n|---|---|---|\n| Flexible backbone (Si–O, aliphatic) | **lowers** | easier segmental rotation |\n| Rigid backbone (aromatic rings) | **raises** | rotation is restricted |\n| Bulky/stiff side groups | **raises** | steric hindrance |\n| Strong H-bonding / polar groups | **raises** | higher cohesive energy density |\n| ↑ Molecular weight | **raises**, then plateaus | fewer chain ends per unit mass |\n| Cross-linking | **raises** | restricts segmental motion |\n| Plasticizer added | **lowers** | increases free volume |\n| ↑ Crystallinity | raises the effective Tg of the amorphous fraction | crystallites restrain neighbouring amorphous chains |\n| Copolymerization | intermediate Tg | often via the Fox equation |\n\n:::takeaway The Fox equation\n$$ \\frac{1}{T_g} = \\frac{w_1}{T_{g1}} + \\frac{w_2}{T_{g2}} $$\n(with $T_g$ in **kelvin**, $w_i$ weight fractions) — a copolymer's Tg sits **between** the two homopolymer values.\n:::\n\n:::warning The universal rule\n**More free volume and more mobility ⇒ lower Tg. Anything that restricts segmental motion ⇒ higher Tg.** Every factor above is an instance of this one sentence.\n:::",
      },
      {
        h: "Melting point, Tm",
        p: "A **true first-order** thermodynamic transition, shown only by **semi-crystalline** polymers, where crystalline order is lost.\n\n$T_m$ rises with: stronger intermolecular bonding, more regular/symmetric chains, greater chain stiffness, and (weakly) higher MW up to a plateau. **Copolymerization with a non-crystallizing comonomer depresses Tm** — the polymer analogue of freezing-point depression.\n\n**Empirical relation:**\n$$ \\frac{T_g}{T_m} \\approx 0.5\\text{–}0.7 \\ \\text{(symmetric, flexible)} \\qquad 0.75\\text{–}0.85 \\ \\text{(bulky/polar substituents)} $$\n(both in kelvin).\n\n:::takeaway Which transitions exist\n- **Amorphous polymer:** only **Tg**.\n- **Semi-crystalline:** **both** Tg (amorphous fraction) *and* Tm (crystalline fraction).\n- **Thermoset (cured):** neither a conventional Tm nor easy flow — it degrades instead.\n:::",
      },
      {
        h: "Heat-distortion temperature (HDT)",
        p: "An **engineering** (not thermodynamic) measure: the temperature at which a standard bar deflects a specified amount under a fixed bending stress. It correlates with, but is **not identical to**, Tg (amorphous) or Tm (semi-crystalline). HDT is what a datasheet quotes for **maximum service temperature under load**.\n\nFor an amorphous plastic, HDT < Tg because the material softens under load before the free Tg is reached.",
      },
      {
        h: "Free-volume numbers worth knowing",
        p: "At Tg the **critical fractional free volume** is roughly 0.025 (2.5%). Below Tg the free volume is frozen; above it, free volume grows with $\\alpha_f$, the expansion coefficient. Plasticizers raise the free volume at a given temperature, so less heating is needed to reach the critical value — hence a lower Tg.",
      },
    ],
    formulas: [
      { name: "Tg / Tm rule of thumb", expr: "\\frac{T_g}{T_m} \\approx 0.5\\text{–}0.7", note: "0.75–0.85 for bulky/polar substituents; both in kelvin" },
      { name: "Fox equation", expr: "\\frac{1}{T_g} = \\frac{w_1}{T_{g1}} + \\frac{w_2}{T_{g2}}", vars: ["w_i — weight fractions", "T_g in kelvin"], note: "copolymer Tg lies between the homopolymer values" },
      { name: "WLF shift factor", expr: "\\log a_T = \\frac{-C_1 (T - T_{ref})}{C_2 + (T - T_{ref})}", vars: ["C_1 \\approx 17.4, C_2 \\approx 51.6 \\text{ K when } T_{ref} = T_g"], note: "valid Tg to Tg + 100 K; free-volume based" },
    ],
    memorise: [
      "Tg = amorphous segmental motion · Tm = loss of crystalline order (first-order).",
      "↑ free volume / ↑ mobility ⇒ ↓ Tg · restricted motion ⇒ ↑ Tg.",
      "Tg rises with MW then plateaus; plasticizer lowers it; cross-linking raises it.",
      "Tg/Tm ≈ 0.5–0.7 (K) · Fox: 1/Tg = w1/Tg1 + w2/Tg2 (K).",
      "Amorphous → only Tg · semi-crystalline → Tg and Tm · cured thermoset → neither.",
      "HDT is an engineering load-deflection temperature, below Tg for amorphous plastics.",
    ],
  },

  t7: {
    id: "t7",
    num: 1,
    title: "Proteins — Natural Polymers",
    subtitle: "Topic 7 · amino acids, peptide bonds and the four structure levels",
    aim: "Treat proteins as the reference case of a perfectly regular, monodisperse step-growth copolymer, and answer the four-levels questions precisely.",
    sections: [
      {
        h: "Proteins as step-growth copolymers",
        p: "Proteins are **condensation (step-growth) copolymers of 20 different α-amino acids**, joined by **peptide (amide) bonds** formed between the carboxyl group of one amino acid and the amino group of the next, with **loss of water**.\n\n$$ n\\,\\text{amino acids} \\rightarrow \\text{polypeptide} + (n-1)\\,\\text{H}_2\\text{O} $$\n\nTwo properties make them the ideal reference:\n- a **defined, ordered monomer sequence** (unlike a random synthetic copolymer),\n- they are essentially **monodisperse** (PDI ≈ 1) — one gene, one chain length.",
      },
      {
        h: "The four levels of structure",
        p: "| Level | What it is | Stabilized by |\n|---|---|---|\n| **Primary** | linear sequence of residues along the chain | **covalent peptide bonds** |\n| **Secondary** | local folding: **α-helix, β-sheet** | **H-bonds** between backbone N–H and C=O |\n| **Tertiary** | overall 3-D fold of one polypeptide | H-bonds, **disulfide –S–S– bridges**, ionic, hydrophobic |\n| **Quaternary** | assembly of several subunits into a complex | same interactions as tertiary, **between subunits** |\n\n:::takeaway Natural fibre analogy\nSilk is largely **β-sheet** (high strength/modulus along the fibre); wool is largely **α-helix**. Collagen is a triple helix. These are natural counterparts of oriented synthetic fibres — ordered secondary structure gives high axial strength.\n:::\n\n:::warning Denaturation\nHeat or extreme pH destroys **secondary and tertiary** structure but **not** the covalent **primary** backbone. This is the natural analogue of a melting/glass transition: order is lost, the chain is not cut.\n:::",
      },
    ],
    formulas: [
      { name: "Peptide bond formation", expr: "\\text{–COOH} + \\text{H}_2\\text{N–} \\rightarrow \\text{–CO–NH–} + \\text{H}_2\\text{O}", note: "a condensation (step-growth) linkage" },
    ],
    memorise: [
      "Primary = peptide bonds (covalent) · Secondary = H-bonds (helix, sheet) · Tertiary = 3-D fold incl. disulfide bridges · Quaternary = subunit assembly.",
      "Silk ≈ β-sheet · wool ≈ α-helix · collagen = triple helix.",
      "Denaturation breaks secondary/tertiary structure, NOT the primary backbone.",
      "Proteins are essentially monodisperse (PDI ≈ 1).",
    ],
  },

  // ===================================================== MODULE 2
  t8: {
    id: "t8",
    num: 2,
    title: "Industrial Polymers — Thermoplastics, Thermosets, Elastomers",
    subtitle: "Topic 8 · the commercial polymer survey and material selection",
    aim: "Match polymer to application on a stated property requirement, and distinguish the commonly confused pairs (HDPE/LDPE, PC/PMMA, NR/SBR).",
    sections: [
      {
        h: "Selection starts from the property profile",
        p: "| End-use | Key properties needed | Representative polymers |\n|---|---|---|\n| Packaging film | flexibility, clarity/barrier, low cost, heat-sealability | LDPE, LLDPE, PP, PET, PVDC |\n| Structural parts | high stiffness & strength, dimensional stability, creep resistance | PC, nylon, POM, glass-filled PP/PA |\n| Under-hood automotive | high-temperature stability, oil resistance | PPS, PA66, PBT, fluoropolymers |\n| Seals, gaskets, tyres | high elasticity, resilience, abrasion resistance | NR, SBR, NBR, EPDM, silicone |\n| Electrical insulation | high dielectric strength, flame resistance | PE, PVC, PTFE, epoxy, silicone |\n\nThe **same base chemistry** can be moved across the property space via MW, copolymerization, blending, plasticization, reinforcement or cross-linking — from a soft elastomer to a rigid engineering plastic.",
      },
      {
        h: "Commodity thermoplastics",
        p: "| Polymer | Key features | Typical applications |\n|---|---|---|\n| **PE** (LDPE/LLDPE/HDPE) | tough; flexible→semi-rigid with density; excellent chemical resistance; low cost | films, bags, bottles, pipes |\n| **PP** | stiffer and higher HDT than PE; superb fatigue/**living hinge** resistance | automotive parts, packaging, ropes, living hinges |\n| **PVC** | inherently rigid; **plasticizable** to fully flexible; self-extinguishing | rigid: pipes, window profiles · flexible: cables, flooring, footwear |\n| **PS** / HIPS / EPS | clear & brittle (GPPS); rubber-toughened (HIPS); foamed (EPS) | disposable ware, packaging, insulation |\n\n:::takeaway Why PVC is special\nPVC is amorphous but has a **high Tg ≈ 80 °C** from its polar C–Cl dipoles, so unplasticized PVC is rigid at room temperature. Adding a **phthalate plasticizer** drops Tg below room temperature and makes it flexible — one chemistry covering both pipes and cable sheath.\n:::",
      },
      {
        h: "Engineering thermoplastics",
        p: "| Polymer | Key features | Applications |\n|---|---|---|\n| **Nylon 6 / 6,6 (PA)** | high strength, toughness, wear resistance; **moisture-absorbing** (amide H-bonding; hydrolysis over time) | gears, bearings, fibres, automotive |\n| **PC** | extremely high impact strength, optical clarity, high HDT | safety glazing, CDs, helmets, housings |\n| **POM (polyacetal)** | high stiffness, low friction, excellent fatigue & dimensional stability | gears, precision parts, plumbing fittings |\n| **PPO/HIPS blends** | high HDT, dimensional stability, good electricals | electronic housings |\n| **PSU / PPS / PEEK** | excellent thermal & chemical resistance at continuous high temperature | aerospace, medical, oil & gas |\n| **PET / PBT** | high strength, dimensional stability; PET has good barrier | bottles, fibres, connectors |\n\n:::warning Confusable pairs\n- **PC vs PMMA:** both transparent, but PC is **tough** (high impact) while PMMA is **brittle**.\n- **HDPE vs LDPE:** linear vs branched; HDPE denser, stiffer, higher Tm.\n- **Nylon vs PET:** both semi-crystalline polycondensates — nylon has **amide** H-bonds (hygroscopic), PET has **ester** groups (better barrier, less moisture uptake).\n:::",
      },
      {
        h: "Thermosets",
        p: "Processed as low-MW flowable **prepolymers** that undergo **irreversible curing (cross-linking)** into a rigid, infusible, insoluble 3-D network. Once cured they **cannot be remelted** — excess heat causes chemical degradation, not flow.\n\n| Resin | Chemistry / cure | Applications |\n|---|---|---|\n| **Phenol–formaldehyde** (phenolics, Bakelite) | phenol + formaldehyde condensation; heat/acid/base cure | electrical fittings, laminates, adhesives |\n| **Urea-/Melamine-formaldehyde** | urea or melamine + formaldehyde | particleboard adhesives, tableware, Formica laminates |\n| **Unsaturated polyester** | polyester backbone with C=C, cross-linked with **styrene** via free radicals | boat hulls, tanks, panels |\n| **Epoxy** | epoxide rings cured by **amine or anhydride** hardeners | adhesives, coatings, composite matrices, encapsulation |\n| **Polyurethane (thermoset)** | polyol + diisocyanate | rigid/flexible foams, coatings, elastomers |\n\n:::takeaway Cross-link density is the lever\nLightly cross-linked ⇒ flexible/rubbery. Densely cross-linked (fully cured phenolic) ⇒ hard, rigid, brittle.\n:::",
      },
      {
        h: "Elastomers",
        p: "An elastomer is a **lightly cross-linked, amorphous** polymer used **well above its Tg**, so segments are mobile while sparse cross-links block permanent flow — giving **entropic rubber elasticity** and huge, nearly fully reversible strain.\n\n**Natural rubber (NR)** = *cis*-1,4-polyisoprene from *Hevea brasiliensis* latex. Its regular cis structure allows **strain-induced crystallization** on stretching → excellent green strength, tack and tear resistance, but poor oil/ozone/heat resistance. Raw NR is tacky and uncross-linked — it **must be vulcanized**.\n\n| Rubber | Monomers | Key property | Use |\n|---|---|---|---|\n| **SBR** | styrene + butadiene | abrasion resistance, cheaper than NR | tyre treads, footwear |\n| **NBR** | acrylonitrile + butadiene | **oil/fuel resistance** (rises with nitrile %) | fuel hoses, seals |\n| **BR** | butadiene | high resilience, low-T flexibility | tyre sidewalls |\n| **IIR (butyl)** | isobutylene + small isoprene | very low gas permeability | inner tubes, innerliners |\n| **EPDM** | ethylene + propylene + diene | outstanding ozone/weather/heat | seals, roofing |\n| **CR (Neoprene)** | chloroprene | oil, flame & weather resistance | wetsuits, hoses |\n| **Silicone** | dimethylsiloxane (**Si–O** backbone) | widest service-temperature range | seals, medical, extreme T |\n\n**Thermoplastic elastomers (TPEs)** get rubber elasticity from **physical** cross-links (hard microdomains) instead of chemical ones, so they are melt-processable: styrenic block copolymers (**SBS, SEBS**), TPO/TPV (dynamically vulcanized PP+EPDM), TPU.",
      },
    ],
    formulas: [],
    memorise: [
      "PVC: rigid alone, flexible with plasticizer (phthalate) — Tg drops below RT.",
      "PC tough & clear · PMMA clear & brittle · don't swap them.",
      "Nylon = amide H-bonds (hygroscopic) · PET = ester (better barrier).",
      "NR = cis-1,4-polyisoprene, needs vulcanization; strain-induced crystallization.",
      "NBR = oil-resistant (nitrile content controls it) · IIR = low gas permeability · EPDM = weather/ozone.",
      "Silicone = Si–O backbone → widest service-temperature range.",
      "Elastomer = amorphous + lightly cross-linked + used well above Tg.",
    ],
  },

  t9: {
    id: "t9",
    num: 2,
    title: "Blends, Composites, Reactions & Degradation",
    subtitle: "Topic 9 · compatibilization, reinforcement, modification and breakdown",
    aim: "Explain why most blends need a compatibilizer, apply the rule of mixtures, and match a degradation mechanism to its stabilizer.",
    sections: [
      {
        h: "Blends and alloys",
        p: "Blending combines properties **without new monomer synthesis** — e.g. rubber-toughening brittle PS (**HIPS**), or **PC/ABS** for impact + processability.\n\nMost polymer pairs are **thermodynamically immiscible** and form a two-phase morphology. A **compatibilizer** — usually a block or graft copolymer whose segments are miscible in each phase —:\n- lowers interfacial tension,\n- promotes a fine, stable dispersion,\n- improves adhesion between phases.\n\nMaleic-anhydride-grafted PP is the classic compatibilizer/coupling agent.",
      },
      {
        h: "Reinforced polymers (composites)",
        p: "| Reinforcement | Examples | Effect |\n|---|---|---|\n| Fibrous (short/long/continuous) | glass, carbon, aramid (Kevlar) | large ↑ in modulus/strength **along the fibre**; anisotropic |\n| Particulate fillers | CaCO₃, talc, mica, carbon black, silica | moderate ↑ stiffness, cost reduction; carbon black/silica **reinforce rubber** |\n| Nano-reinforcement | nanoclay, CNTs, nano-silica | big gains at very low loading; improved barrier & flame resistance |\n\n**Rule of mixtures** gives the bounds for a two-phase composite:\n$$ E_c = E_f V_f + E_m V_m \\quad \\text{(isostrain, upper bound — fibres parallel to load)} $$\n$$ \\frac{1}{E_c} = \\frac{V_f}{E_f} + \\frac{V_m}{E_m} \\quad \\text{(isostress, lower bound — fibres perpendicular)} $$\n\nPerformance depends on **fibre orientation, aspect ratio, fibre–matrix adhesion** (often via a **silane** coupling/sizing agent) and **fibre volume fraction**.",
      },
      {
        h: "Polymer modification",
        p: "Post-synthesis tuning without a new monomer:\n- **Copolymerization** — adjust Tg, crystallinity, reactivity. **EVA** spans semi-rigid to soft as vinyl-acetate content rises.\n- **Grafting** — attach side chains to an existing backbone (maleic-anhydride-grafted PP as compatibilizer).\n- **Cross-linking** — introduce covalent bridges after polymerization (vulcanization; peroxide or radiation cross-linking of PE) → higher use-temperature, creep and solvent resistance, but **no longer reprocessable**.\n- **Chain reactions on the backbone** — hydrolysis, esterification, halogenation, sulfonation. E.g. **PVA is made by hydrolysis of polyvinyl acetate** (PVA itself cannot be polymerized from a hypothetical 'vinyl alcohol' monomer, which does not exist stably).",
      },
      {
        h: "Degradation and stabilizers",
        p: "Degradation = any process that **reduces MW or alters chemical structure** undesirably — during processing, storage or service.\n\n| Type | Mechanism | Countermeasure |\n|---|---|---|\n| **Thermal** | chain scission or **unzipping** (depolymerization) at high T | heat stabilizers; avoid excess T/residence time |\n| **Mechanical (shear)** | chain scission from high shear in extrusion/milling | optimized screw design and processing |\n| **Oxidative** | reaction with O₂, **autocatalytic** via hydroperoxides | **antioxidants** (hindered phenols = chain-breaking; phosphites = hydroperoxide decomposers) |\n| **Photo (UV)** | UV cleaves bonds / generates radicals (Norrish reactions), accelerated by O₂ | **UV absorbers, HALS, carbon black** |\n| **Radiation** | γ-rays/e-beam cause scission *and/or* cross-linking | radiation-resistant additives; or exploit deliberately |\n| **Hydrolytic** | water attacks hydrolyzable **ester / amide** linkages | moisture control, end-capping |\n| **Ultrasonic** | cavitation-induced shear in solution | mainly a laboratory phenomenon |\n\n:::takeaway\n**PVC releases HCl on thermal degradation** (dehydrochlorination) — hence it needs **HCl scavengers/heat stabilizers** (legacy: Pb/Ca–Zn; modern: organotin, Ca–Zn).\n\nDegradation is not always bad: it is exploited in **biodegradable polymers**, in **recycling** (chemical/mechanical breakdown), and in photodegradable mulch films.\n:::",
      },
      {
        h: "Biodegradable and sustainable polymers",
        p: "Designed to be broken down by microorganisms after use:\n- **PLA (polylactic acid)** — from fermented plant starch; hydrolytic + enzymatic degradation; compostable packaging, 3-D printing, sutures.\n- **PHA / PHB** — microbially produced polyesters; fully biodegradable in soil and marine environments.\n- **Starch-based blends** and **PCL (polycaprolactone)** — slow-degrading polyesters.\n\nRecycling distinction:\n- **Thermoplastics** can be remelted and reprocessed → mechanical recycling.\n- **Thermosets** cannot be remelted → only ground as fillers, or broken down **chemically** (glycolysis, solvolysis) or used for energy recovery.",
      },
    ],
    formulas: [
      { name: "Rule of mixtures (upper, isostrain)", expr: "E_c = E_f V_f + E_m V_m", note: "fibres parallel to load" },
      { name: "Rule of mixtures (lower, isostress)", expr: "\\frac{1}{E_c} = \\frac{V_f}{E_f} + \\frac{V_m}{E_m}", note: "fibres perpendicular to load" },
    ],
    memorise: [
      "Most blends are immiscible → need a compatibilizer (block/graft copolymer).",
      "Rule of mixtures: parallel = upper bound; perpendicular = lower bound.",
      "PVA comes from hydrolysis of polyvinyl acetate.",
      "Antioxidants: hindered phenols (chain-breaking) + phosphites (hydroperoxide decomposing).",
      "UV → UV absorbers / HALS / carbon black.",
      "PVC releases HCl on heating → needs heat stabilizers.",
      "Thermoplastics recycle by remelting; thermosets need chemical/energy recovery.",
      "PLA and PHA/PHB are the canonical biodegradable polymers.",
    ],
  },

  // ===================================================== MODULE 3
  t10: {
    id: "t10",
    num: 3,
    title: "Mechanical, Viscoelastic & Physical Properties",
    subtitle: "Topic 10 · viscoelasticity, stress–strain, fracture, creep, rheology, transport",
    aim: "Read a stress–strain curve and a creep curve, pick the right spring–dashpot model, and predict how transport and electrical properties follow from structure.",
    sections: [
      {
        h: "Viscoelasticity",
        p: "Polymers respond with **both elastic (instant, recoverable) and viscous (time-dependent, dissipative)** character, because segmental motion needs **finite time**.\n\n| Model | Construction | Predicts well | Fails at |\n|---|---|---|---|\n| **Maxwell** | spring + dashpot in **series** | **stress relaxation** (σ decays at constant ε) | gives unrealistic unbounded creep |\n| **Voigt–Kelvin** | spring + dashpot in **parallel** | **creep** (retarded approach to equilibrium strain) | no instantaneous elasticity, no stress relaxation |\n| **Burgers (4-parameter)** | Maxwell + Voigt in series | full creep: instantaneous + retarded + flow | still a simplification |\n| **Generalized Maxwell/Voigt spectra** | many elements, each with its own τ | real, broad relaxation behaviour | many parameters |\n\n**Relaxation time** $\\tau = \\eta / E$ (Maxwell). **Retardation time** $\\tau = \\eta / E$ for the Kelvin element.\n\n**Deborah number** — $De = \\tau_{material} / t_{observation}$:\n- $De \\gg 1$ — relaxation slow vs the test ⇒ **solid-like / glassy**\n- $De \\ll 1$ — relaxation fast vs the test ⇒ **liquid-like / rubbery**\n\n:::takeaway\nThe **same polymer** is glassy in a fast impact test and rubbery in a slow creep test. De is the reason.\n:::\n\n**Boltzmann superposition** — the response to a sequence of stress increments is the **linear sum** of the individual responses, each shifted to its own application time. This is the basis of **linear viscoelasticity**.\n\n**Time–temperature superposition (TTS)** — for a thermorheologically simple amorphous polymer, raising temperature is equivalent to stretching the timescale. Data at several temperatures shift horizontally along log-time onto one **master curve**, spanning many more decades than measurable at one temperature. The shift factor is given by the **WLF equation** (below Tg + ~100 K) or an Arrhenius form above it.",
      },
      {
        h: "Stress–strain behaviour",
        p: "Read off five quantities: **initial (Young's) modulus** (slope of the initial linear region), **yield stress** (onset of plastic deformation, often with necking), **ultimate tensile strength**, **elongation at break**, and the **area under the curve** = **toughness** (total energy absorbed to break).\n\n| Behaviour | Curve | Examples |\n|---|---|---|\n| **Brittle** | steep & linear, breaks at low strain, no yield | PS, PMMA (below Tg), thermosets |\n| **Ductile** | linear → yield point → plateau (**cold drawing / necking**) → break | PE, PP, nylon |\n| **Elastomeric** | low initial modulus, huge recoverable strain, **J-shaped** (strain hardening at high strain) | NR, SBR, silicone |\n\n:::takeaway\nCompression gives a **higher apparent strength** than tension for the same polymer — tensile loading opens flaws/crazes (stress concentrators) while compression closes them.\n:::",
      },
      {
        h: "Fracture",
        p: "Classified as **brittle** (crack propagates with little plastic deformation — typical below Tg, at high strain rate, or with notches) or **ductile** (extensive drawing precedes fracture).\n\n**Crazing** — planar micro-voided, **fibril-bridged** defects perpendicular to the applied stress; a precursor to brittle fracture in glassy polymers (PS, PMMA). Crazes bear load via oriented fibrils before a crack runs through them. Crazing is *not* cracking: crazes have mass.\n\n**Shear yielding** — localized plastic flow along planes of **maximum shear (~45°)**, dissipating energy with little volume change; associated with **tough** behaviour and promoted by rubber toughening (HIPS, ABS).\n\n**LEFM / Griffith** — fracture occurs when the stress intensity $K$ reaches the critical **fracture toughness** $K_{IC}$; equivalently the energy release rate reaches $G_{IC}$. $K_{IC}$ is a **material property**. Notch sensitivity, low temperature, high strain rate and **thick sections (plane strain)** all promote brittle fracture.",
      },
      {
        h: "Creep, relaxation, hardness, impact",
        p: "**Creep** — the time-dependent increase in strain under **constant stress**. Three stages: (1) instantaneous elastic strain, (2) **primary/retarded** region of decelerating strain rate, (3) **secondary (steady-state)** region of near-constant rate, sometimes followed by **tertiary** creep to rupture. Creep worsens with higher T, higher stress and proximity to Tg — critical for pipes and fasteners.\n\n**Stress relaxation** — strain held constant, stress **decays** as segments rearrange. Governs **gasket and seal design** (a relaxed seal loses clamping force).\n\n**Hardness** — resistance to localized surface indentation, loosely correlated with modulus and yield strength. **Shore A** (soft elastomers), **Shore D** (rigid plastics / hard rubbers), **Rockwell** (rigid engineering plastics).\n\n**Impact** — resistance to sudden, high-rate fracture, governed by the ability to absorb energy by plastic deformation / crack-tip blunting. Tests: **Izod** and **Charpy** notched pendulum tests, and **falling-dart** tests for films/sheets. Impact strength falls sharply **below Tg** (brittle–ductile transition).",
      },
      {
        h: "Improving mechanical properties",
        p: "| Method | Mechanism | Example |\n|---|---|---|\n| ↑ Molecular weight | more entanglements resist slippage | UHMWPE |\n| Copolymerization / blending | second phase dissipates energy | HIPS, ABS |\n| ↑ Crystallinity | crystallites act as physical cross-links | drawn PET/PP |\n| Orientation (drawing) | aligns chains along draw direction | nylon & PET fibres, BOPP |\n| Cross-linking | restricts slippage, ↑ creep resistance | PEX pipe, vulcanized rubber |\n| Fibre/particulate reinforcement | load transfer to stiffer phase | glass/carbon-fibre composites |\n| Plasticization | ↑ free volume, ↓ Tg, ↓ stiffness | flexible PVC |\n| Nucleating agents | finer spherulites, ↑ clarity & stiffness | nucleated PP |",
      },
      {
        h: "Rheology",
        p: "Rheology = flow and deformation. Polymer melts are classic **non-Newtonian** fluids.\n\n| Type | Viscosity vs shear rate | Example |\n|---|---|---|\n| **Newtonian** | constant | water, low-MW oils (and melts only at very low shear) |\n| **Shear-thinning (pseudoplastic)** | decreases with shear rate | **most polymer melts & concentrated solutions** |\n| **Shear-thickening (dilatant)** | increases with shear rate | highly filled suspensions |\n| **Bingham plastic** | solid until a yield stress, then flows | filled compounds, pastes |\n\n**Why melts shear-thin:** at rest, long chains are randomly coiled and heavily entangled (high viscosity). As shear rises, chains **disentangle, align and slide** more easily, lowering apparent viscosity. This is exactly what lets injection-moulding melts rush through narrow gates under high shear yet resist sagging at rest.\n\nPractical consequences:\n- Melt viscosity governs extrusion output, mould filling, and **die swell / melt fracture** defects.\n- $\\eta \\propto M_w^{3.4}$ above the critical entanglement MW.\n- **Melt flow index (MFI/MFR)** — a single-point industrial measure of melt viscosity under standard low-shear conditions, used for QC and grade selection.",
      },
      {
        h: "Permeability, electrical, optical, flammability",
        p: "**Permeability** — transport through a non-porous polymer by a **solution–diffusion** mechanism: dissolve at the high-pressure face, diffuse down the gradient, desorb at the low side.\n$$ P = D \\times S $$\n($D$ diffusivity, $S$ solubility coefficient.) $P$ **falls** with ↑ crystallinity (crystallites are impermeable and raise tortuosity), ↑ cross-link density, ↑ polarity/H-bonding, and **below Tg**.\n\n**Electrical** — most unfilled polymers are excellent insulators (no free carriers). **Dielectric strength** = maximum field before breakdown; **volume/surface resistivity**; **dielectric constant & dissipation factor** govern capacitor/high-frequency suitability and are influenced by polarity and by relaxations tied to Tg. Conductivity comes from conductive fillers (carbon black, metal fibres) or **intrinsically conducting polymers**.\n\n**Optical** — amorphous polymers (PMMA, PC, PS) are **clear** (no crystallites to scatter); semi-crystalline ones are **translucent to opaque** (spherulites scatter where refractive index differs). **Birefringence** arises from processing-induced **orientation** — a defect to minimize in optical mouldings.\n\n**Flammability** — governed by the **limiting oxygen index (LOI)** (minimum % O₂ in an O₂/N₂ mix that sustains combustion), heat release rate, and smoke/toxic-gas generation. Aromatic, highly cross-linked, and **halogen-, phosphorus- or nitrogen-containing** polymers (PVC, PTFE, phenolics) are inherently more flame-resistant; PE, PP and PS need **flame retardants** (halogenated, phosphorus-based, or intumescent/aluminium trihydrate).",
      },
    ],
    formulas: [
      { name: "Maxwell relaxation time", expr: "\\tau = \\frac{\\eta}{E}", vars: ["\\eta — dashpot viscosity", "E — spring modulus"], note: "stress decay σ(t) = σ₀ exp(−t/τ)" },
      { name: "Deborah number", expr: "De = \\frac{\\tau_{relax}}{t_{obs}}", note: "De ≫ 1 solid-like · De ≪ 1 liquid-like" },
      { name: "Stress relaxation (Maxwell)", expr: "\\sigma(t) = \\sigma_0 e^{-t/\\tau}", note: "constant strain" },
      { name: "Kelvin–Voigt creep", expr: "\\varepsilon(t) = \\frac{\\sigma_0}{E}\\left(1 - e^{-t/\\tau}\\right)", note: "retarded elasticity; τ = η/E" },
      { name: "WLF equation", expr: "\\log a_T = \\frac{-C_1 (T - T_{ref})}{C_2 + (T - T_{ref})}", vars: ["C_1 \\approx 17.4, C_2 \\approx 51.6\\ \\text{K for } T_{ref}=T_g"], note: "Tg to Tg + 100 K" },
      { name: "Permeability", expr: "P = D \\times S", vars: ["D — diffusivity", "S — solubility coefficient"], note: "solution–diffusion model" },
      { name: "Stress intensity", expr: "K = Y\\sigma\\sqrt{\\pi a}", vars: ["Y — geometry factor", "\\sigma — applied stress", "a — crack length"], note: "fracture when K = K_IC" },
      { name: "Melt viscosity scaling", expr: "\\eta \\propto M_w^{3.4}", note: "above the entanglement MW" },
    ],
    memorise: [
      "Maxwell (series) = stress relaxation · Voigt–Kelvin (parallel) = creep.",
      "τ = η/E · De = τ/t_obs · De ≫ 1 ⇒ glassy.",
      "TTS: higher T ≡ longer time; master curve via WLF below Tg + 100 K.",
      "Toughness = area under the stress–strain curve.",
      "Crazing (fibril-bridged, mass-bearing) vs shear yielding (45°, no volume change).",
      "Compression > tension apparent strength — tension opens flaws.",
      "Most melts are shear-thinning; η ∝ Mw^3.4; MFI is a QC number.",
      "P = D × S · ↓ with ↑ crystallinity, cross-linking, polarity, and below Tg.",
      "Amorphous ⇒ clear · semi-crystalline ⇒ hazy/opaque.",
      "LOI = minimum % O₂ that sustains combustion.",
    ],
  },

  // ===================================================== MODULE 4
  t11: {
    id: "t11",
    num: 4,
    title: "Compounding & Processing",
    subtitle: "Topic 11 · additives, plastics processing, fibre spinning, rubber technology",
    aim: "Select a processing route for a described part and justify it, and match each additive class to its function.",
    sections: [
      {
        h: "Compounding — the additives",
        p: "Few polymers are used neat; almost all commercial plastics are compounded.\n\n| Additive class | Function | Examples |\n|---|---|---|\n| **Plasticizers** | ↑ free volume & mobility → lower Tg, ↑ flexibility | phthalates, adipates (flexible PVC) |\n| **Fillers / reinforcements** | reduce cost and/or ↑ stiffness & strength | CaCO₃, talc, glass fibre, carbon fibre |\n| **Antioxidants** | interrupt oxidative chain reactions | hindered phenols, phosphites |\n| **UV / light stabilizers** | absorb or quench UV, scavenge radicals | UV absorbers, HALS, carbon black |\n| **Flame retardants** | interrupt combustion (gas-phase radical scavenging, char, heat absorption) | halogenated, phosphorus, aluminium trihydrate |\n| **Colorants** | colour / opacity | pigments, dyes |\n| **Antistatic agents** | lower surface resistivity to bleed off static | ethoxylated amines, conductive fillers |\n| **Lubricants / processing aids** | reduce melt friction and wall adhesion | waxes, fatty-acid esters, silicones |\n| **Impact modifiers** | rubbery phase absorbs energy | core–shell acrylic, MBS |\n\n:::takeaway\n**Plasticizer lowers Tg; impact modifier adds a rubbery phase to absorb energy; nucleating agent refines spherulites.** These three are constantly interchanged in exams — keep them distinct.\n:::",
      },
      {
        h: "Plastics processing",
        p: "| Process | Principle | Typical products |\n|---|---|---|\n| **Extrusion** | screw forces melt continuously through a shaping die | pipe, sheet, film, profiles, cable coating, pelletizing |\n| **Injection moulding** | melt injected under high pressure into a closed, cooled mould, then ejected | complex, precision, high-volume parts |\n| **Blow moulding** | hot parison/preform inflated with air against a mould wall | bottles, containers, fuel tanks |\n| **Rotational moulding** | powder rotated on two axes while heated, coating the inner wall | large hollow parts: tanks, kayaks |\n| **Thermoforming** | heated sheet formed over/into a mould by vacuum, pressure or force | trays, cups, large panels |\n| **Compression / transfer moulding** | material placed in a heated mould and cured under pressure (compression) or fed from a pot (transfer) | thermoset electricals, rubber parts |\n| **Casting** | liquid resin poured and cured in place, no pressure | acrylic sheet, cast nylon, encapsulation |\n| **Calendering** | melt passed through heated rolls into sheet | PVC film, flooring, rubber sheeting |\n\n**Extrusion** is also the standard **compounding** method — twin-screw melt-mixing of polymer with additives before pelletizing.\n\n:::takeaway Choosing the process\nContinuous profile (pipe, film) → **extrusion** · complex 3-D part in high volume → **injection moulding** · hollow bottle → **blow moulding** · large hollow tank → **rotational moulding** · sheet packaging tray → **thermoforming** · thermoset part → **compression/transfer**.\n:::",
      },
      {
        h: "Fibre technology",
        p: "Spinning converts polymer into fine continuous filaments with a very high aspect ratio and — critically — high **molecular orientation** along the fibre axis (introduced/enhanced by **drawing**), which is what gives fibres their axial strength and modulus.\n\n| Method | Principle | Suited to | Examples |\n|---|---|---|---|\n| **Melt spinning** | melt extruded through a spinneret, solidified in air | polymers that melt cleanly without decomposing | PET, nylon, PP |\n| **Dry spinning** | solution extruded into a heated chamber; solvent evaporates | decompose at/below Tm but soluble in a volatile solvent | cellulose acetate, some acrylics, spandex |\n| **Wet spinning** | solution extruded into a coagulating (non-solvent) bath | decompose on melting; use non-volatile solvents | viscose rayon, acrylics, aramids |\n\n**Post-spinning operations:**\n- **Drawing** — stretch to several times the original length, uncoiling and aligning chains parallel to the axis → dramatic ↑ in strength and modulus, plus strain-induced crystallization.\n- **Heat setting (annealing)** — stabilizes the drawn, oriented structure and relieves residual stress so the fibre keeps its dimensions.\n- **Texturing** — imparts crimp/bulk/stretch (e.g. false-twist) for better fabric hand.\n\n:::takeaway The spinning decision rule\nDoes it melt without decomposing?\n- **Yes** → melt spinning (cheapest, PET/nylon).\n- **No, but soluble in a volatile solvent** → dry spinning.\n- **No, and needs a high-boiling solvent** → wet spinning.\n:::",
      },
      {
        h: "Elastomer (rubber) technology",
        p: "**Mastication** — mechanical shearing of raw rubber on a two-roll mill or internal mixer **breaks some chains**, lowering MW and viscosity so the stock can be worked and compounded.\n\n| Ingredient | Function | Examples |\n|---|---|---|\n| **Vulcanizing (curing) agent** | forms cross-links between chains | **sulfur** (most common), peroxides, metal oxides |\n| **Accelerators** | speed up and control cure; improve cross-link type | sulfenamides, thiazoles, thiurams |\n| **Activators** | enhance accelerator efficiency | **zinc oxide + stearic acid** |\n| **Reinforcing fillers** | ↑ strength, modulus, abrasion & tear resistance | **carbon black**, precipitated silica |\n| **Antidegradants** | protect against oxidative & ozone ageing | hindered phenols, p-phenylenediamines, waxes |\n| **Plasticizers / oils** | ease processing, adjust hardness & low-T flexibility | paraffinic/naphthenic oils |\n\n**Vulcanization** forms a sparse 3-D network of covalent (usually sulfur) cross-links, converting tacky, weak raw rubber into a strong, elastic, dimensionally stable material with good recovery and much better heat, solvent and permanent-set resistance. The classic sulfur system forms **mono-, di- and polysulfidic** cross-links — their balance controls heat resistance, dynamic properties and ageing.\n\n:::takeaway Cross-link density is THE variable\n- Too little (undercure) ⇒ poor strength and elastic recovery.\n- Too much (overcure) ⇒ excessive stiffness, low elongation, poor fatigue life.\n:::\n\n**Rubber processing:** compression moulding (charge in an open heated mould, closed under pressure), transfer moulding (compound forced from a pot — better for complex geometry/inserts), **injection moulding of rubber** (mould is **heated**, so the compound cures inside — faster cycles), extrusion of continuous profiles followed by steam/hot-air/salt-bath curing, and **calendering** to make sheet or coat tyre cord.",
      },
    ],
    formulas: [],
    memorise: [
      "Plasticizer ↓ Tg · impact modifier = rubbery energy-absorbing phase · nucleating agent refines spherulites.",
      "Continuous profile → extrusion · complex high-volume 3-D → injection · bottle → blow · large hollow → rotational · sheet tray → thermoforming · thermoset → compression/transfer.",
      "Melt if possible → melt spin · decomposes + volatile solvent → dry spin · decomposes + high-boiling solvent → wet spin.",
      "Drawing = alignment → strength; heat setting fixes dimensions.",
      "Mastication lowers MW/viscosity so rubber can be compounded.",
      "Sulfur + accelerator + ZnO/stearic acid = the classic vulcanization system.",
      "Undercure ⇒ weak · overcure ⇒ stiff and brittle. Cross-link density is the lever.",
      "Carbon black and silica are the reinforcing fillers; they also provide UV protection.",
    ],
  },
};

export const TOPIC_IDS = Object.keys(LESSONS);
