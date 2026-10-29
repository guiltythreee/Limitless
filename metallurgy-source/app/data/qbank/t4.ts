import type { TopicSource } from "../../mt203/types";

/**
 * MT203 — Topic 4: Molecular Weight & Distribution
 * Source: Module 1 §3 + supplement. 30 questions, numerically heavy.
 */
const T4: TopicSource = {
  id: "t4",
  module: "m1",
  title: "Molecular Weight & Distribution",
  subtitle: "Topic 4 · Mn, Mw, Mz, PDI, Carothers, and how each technique sees MW",
  subs: [
    { id: "T4.1", title: "Why polymer MW is an average" },
    { id: "T4.2", title: "Mn, Mw, Mz, Mv and PDI" },
    { id: "T4.3", title: "Techniques: osmometry, scattering, viscometry, GPC" },
    { id: "T4.4", title: "Carothers & stoichiometric imbalance" },
    { id: "T4.5", title: "Sensitivity of each average" },
  ],
  questions: [
    {
      id: "t4-01",
      type: "concept",
      diff: 2,
      text: "Why is there no single 'molecular weight' of a polymer sample?",
      options: [
        { label: "a", text: "Chains grow and terminate stochastically, producing a distribution of molecular weights rather than one value for the sample." },
        { label: "b", text: "Purification is always incomplete, so a sample can never be assigned a molecular weight even with an ideal method." },
        { label: "c", text: "Measurement error is the only reason for different values; a perfectly measured polymer would contain identical chain lengths." },
        { label: "d", text: "All polymer molecules have the same molecular weight, but different instruments report different values because of calibration." }
      ],
      answer: "a",
      why: "Random initiation/termination (radical) or random coupling (step-growth) gives a **distribution** of chain lengths. Different physical properties respond to different averages, so Mn, Mw, Mz and Mv are all reported.",
      concept: "MWD: Mn < Mv < Mw < Mz",
      tags: ["revision"],
    },
    {
      id: "t4-02",
      type: "numerical",
      diff: 3,
      text: "A PS sample contains 1 chain of MW 20,000 g/mol and 3 chains of MW 10,000 g/mol. Its $M_n$, $M_w$ and PDI are:",
      options: [
        { label: "a", text: "Mn = 12,500; Mw = 16,000; PDI = 1.28" },
        { label: "b", text: "Mn = 12,500; Mw = 14,000; PDI = 1.12" },
        { label: "c", text: "Mn = 15,000; Mw = 15,000; PDI = 1.00" },
        { label: "d", text: "Mn = 14,000; Mw = 12,500; PDI = 0.89" }
      ],
      answer: "b",
      why: "$M_n = \\frac{1(20000)+3(10000)}{4} = \\frac{50000}{4} = \\mathbf{12{,}500}$. $M_w = \\frac{1(20000)^2+3(10000)^2}{1(20000)+3(10000)} = \\frac{7\\times10^8}{5\\times10^4} = \\mathbf{14{,}000}$. PDI $= 14000/12500 = \\mathbf{1.12}$.",
      distractors: {
        d: "Mn and Mw swapped — Mn is the number-average (linear in Mi), Mw is weight-weighted.",
        a: "Mw would be 16,000 only if the heavy chain counted twice.",
      },
      concept: "$M_n=\\sum N_iM_i/\\sum N_i$ · $M_w=\\sum N_iM_i^2/\\sum N_iM_i$",
      tags: ["numeric", "formula"],
    },
    {
      id: "t4-03",
      type: "recall",
      diff: 1,
      text: "Which average molecular weight is obtained from membrane osmometry?",
      options: [
        { label: "a", text: "Mw (weight average)" },
        { label: "b", text: "Mn (number average)" },
        { label: "c", text: "Mv (viscosity average)" },
        { label: "d", text: "Mz (z average)" }
      ],
      answer: "b",
      why: "Osmometry measures a **colligative** property (number of particles) → $M_n$. Light scattering → $M_w$; ultracentrifugation (equilibrium) → $M_z$; viscometry → $M_v$.",
      tags: ["revision"],
    },
    {
      id: "t4-04",
      type: "match",
      diff: 2,
      text: "Match each technique with the average it yields.",
      tableRows: [
        ["1", "Membrane osmometry", "", "(i) Mw"],
        ["2", "Light scattering (Zimm)", "", "(ii) Mz"],
        ["3", "Ultracentrifugation (sedimentation equilibrium)", "", "(iii) Mn"],
        ["4", "Solution viscometry", "", "(iv) Mv"],
      ],
      options: [
        { label: "a", text: "1-iv, 2-iii, 3-ii, 4-i" },
        { label: "b", text: "1-iii, 2-i, 3-ii, 4-iv" },
        { label: "c", text: "1-iii, 2-ii, 3-i, 4-iv" },
        { label: "d", text: "1-i, 2-iii, 3-iv, 4-ii" }
      ],
      answer: "b",
      why: "Osmometry (colligative) → Mn · light scattering (intensity ∝ mass) → Mw · sedimentation equilibrium (mass × distance) → Mz · viscometry → Mv.",
      tags: ["revision"],
    },
    {
      id: "t4-05",
      type: "concept",
      diff: 3,
      text: "A polymer has PDI = 1.00 exactly. What does this imply?",
      options: [
        { label: "a", text: "Mn equals the monomer MW." },
        { label: "b", text: "All chains have identical MW (monodisperse)." },
        { label: "c", text: "The sample failed to polymerize." },
        { label: "d", text: "The sample is a step-growth polymer." }
      ],
      answer: "b",
      why: "PDI $= M_w/M_n = 1$ only when every chain weighs the same — a **monodisperse** distribution. Practically only living anionic polymerization approaches this (PDI ≈ 1.02–1.1); step-growth Flory gives 2; broad radical gives 2–10.",
      concept: "PDI = 1 ideal · ≈1.05 living · 2 step-growth · ≫2 branched/radical",
      tags: ["confused"],
    },
    {
      id: "t4-06",
      type: "numerical",
      diff: 4,
      text: "A step-growth polymerization reaches p = 0.999. The PDI of the product (stoichiometric) is closest to:",
      options: [
        { label: "a", text: "1.5" },
        { label: "b", text: "2.0" },
        { label: "c", text: "1.0" },
        { label: "d", text: "4.0" }
      ],
      answer: "b",
      why: "At any high conversion, step-growth chains approach the **most-probable (Flory) distribution** whose limiting $M_w/M_n = 2$ — conversion sets the *average* MW, not the shape.",
      distractors: {
        c: "PDI = 1 requires living systems, not step-growth.",
        d: "PDI = 4 would imply strong branching or multi-site catalysis.",
      },
      concept: "Flory most-probable distribution: PDI → 2",
      tags: ["confused"],
    },
    {
      id: "t4-07",
      type: "apply",
      diff: 3,
      text: "Osmometry gives Mn = 40,000 and light scattering gives Mw = 160,000. The most defensible statement is:",
      options: [
        { label: "a", text: "The measurements cannot both be correct, because every molecular-weight average must have the same numerical value." },
        { label: "b", text: "The distribution is broad: Mw/Mn = 4, consistent with a mixture of chains spanning a wide range of molecular weights." },
        { label: "c", text: "The sample must be contaminated with monomer, because any trace impurity forces Mw to exceed Mn by exactly fourfold." },
        { label: "d", text: "The polymer is monodisperse, since agreement of two analytical methods is enough to establish a single chain length." }
      ],
      answer: "b",
      why: "PDI $= 160000/40000 = 4$. Since $M_w$ always exceeds $M_n$ for any distribution, a factor-4 gap means a **broad MWD** — typical of high-conversion radical or branched polymers, not an error.",
      distractors: {
        d: "Monodisperse would need PDI ≈ 1.",
        c: "Free monomer would pull Mn down but Mw barely — it could widen the gap, but PDI 4 alone tells you the distribution is broad regardless of cause.",
      },
      concept: "PDI = Mw/Mn = breadth of MWD",
      tags: ["revision"],
    },
    {
      id: "t4-08",
      type: "concept",
      diff: 3,
      text: "Mn is far more sensitive than Mw to a trace of low-molecular-weight material. Why?",
      options: [
        { label: "a", text: "Mn counts each molecule equally, so many small molecules can shift the number average even when they contribute little mass." },
        { label: "b", text: "Mw ignores short chains completely by definition, so adding any low-mass material has no effect on the weight average." },
        { label: "c", text: "Both averages respond identically to a small-molecule impurity because each uses the same weighting of chain number and mass." },
        { label: "d", text: "Low-molecular-weight species scatter more light per gram, so they dominate light-scattering measurements of Mw." }
      ],
      answer: "a",
      why: "$M_n$ weights each *chain* equally: 1 wt% of M = 500 chains in an Mn = 50,000 polymer nearly **halves** Mn (→ ~25,000). $M_w$ weights by mass², so the same 1 wt% changes Mw by < 1% (50,000 → 49,505).",
      concept: "colligative averages see numbers; scattering sees mass",
      tags: ["confused", "numeric"],
    },
    {
      id: "t4-09",
      type: "numerical",
      diff: 4,
      text: "A polymer of Mn = 50,000 g/mol is blended with 1 wt% of an oligomer of M = 500 g/mol. The new Mn (weight-fraction formula $1/M_n = \\sum w_i/M_i$) is approximately:",
      options: [
        { label: "a", text: "25,000" },
        { label: "b", text: "49,500" },
        { label: "c", text: "5,000" },
        { label: "d", text: "45,000" }
      ],
      answer: "a",
      why: "$\\frac{1}{M_n} = \\frac{0.99}{50000} + \\frac{0.01}{500} = 1.98\\times10^{-5} + 2.0\\times10^{-5} = 3.98\\times10^{-5}$ → $M_n \\approx \\mathbf{25{,}000}$ — the trace oligomer **halves** the number-average.",
      distractors: {
        b: "49,500 is the new *Mw* (≈ unchanged) — the classic mix-up.",
        c: "5,000 would need ~10 wt% oligomer.",
      },
      concept: "$1/M_n = \\sum w_i/M_i$",
      tags: ["numeric", "formula", "confused"],
    },
    {
      id: "t4-10",
      type: "recall",
      diff: 1,
      text: "PDI (polydispersity index) is defined as:",
      options: [
        { label: "a", text: "Mv / Mn" },
        { label: "b", text: "Mw / Mn" },
        { label: "c", text: "Mz / Mw" },
        { label: "d", text: "Mn / Mw" }
      ],
      answer: "b",
      why: "$\\text{PDI} = M_w/M_n \\ge 1$ always (equals 1 only for monodisperse). The older symbol $\\bar{X}_w/\\bar{X}_n$ is equivalent.",
      tags: ["revision"],
    },
    {
      id: "t4-11",
      type: "numerical",
      diff: 3,
      text: "The number-average DP of a polyamide (repeat unit M = 113 g/mol) with Mn = 33,900 g/mol is:",
      options: [
        { label: "a", text: "300" },
        { label: "b", text: "113" },
        { label: "c", text: "30" },
        { label: "d", text: "3,000" }
      ],
      answer: "a",
      why: "$DP_n = M_n/M_{repeat} = 33900/113 = \\mathbf{300}$.",
      distractors: {
        c: "30 corresponds to Mn = 3,390.",
      },
      concept: "$DP = M_n / M_{repeat}$",
      tags: ["numeric", "formula"],
    },
    {
      id: "t4-12",
      type: "graph",
      diff: 3,
      text: "GPC/SEC traces show: peak A narrow & symmetric; peak B broad with a low-MW tail; peak C broad bimodal. Which PDI ordering is correct?",
      tableRows: [
        ["Peak", "A", "B", "C"],
        ["Relative width at half-height", "narrow", "medium", "very broad"],
      ],
      options: [
        { label: "a", text: "PDI: A < B < C" },
        { label: "b", text: "Cannot be inferred from peak shape" },
        { label: "c", text: "PDI: C < B < A" },
        { label: "d", text: "PDI: A = B = C" }
      ],
      answer: "a",
      why: "GPC separates by hydrodynamic volume — **peak width maps directly to MWD breadth**. Narrow symmetric (A) = low PDI; broad (B) higher; bimodal (C) mixes two populations → highest PDI.",
      concept: "SEC: elution volume ↔ MW; width ↔ PDI",
      tags: ["confused"],
    },
    {
      id: "t4-13",
      type: "compare",
      diff: 2,
      text: "Which statement correctly contrasts Mv with Mn and Mw?",
      options: [
        { label: "a", text: "Mv is a viscosity-weighted average, commonly between Mn and Mw for a typical molecular-weight distribution." },
        { label: "b", text: "Mv always equals Mn because both averages count each polymer molecule once, independent of its hydrodynamic volume." },
        { label: "c", text: "Mv is defined only for cross-linked polymers, where individual chains cannot be separated for molecular-weight analysis." },
        { label: "d", text: "Mv must exceed Mw for every polymer because viscosity is more sensitive to short chains than to long chains." }
      ],
      answer: "a",
      why: "$M_v$ arises from $[\\eta] = KM^a$ with $0.5\\le a\\le 0.8$; the exponent pulls it **between Mn and Mw, closer to Mw** for typical a ≈ 0.7.",
      distractors: {
        d: "Mz is the average that exceeds Mw.",
      },
      tags: ["confused"],
    },
    {
      id: "t4-14",
      type: "numerical",
      diff: 4,
      text: "Mark–Houwink constants for a polymer–solvent pair: K = 1.0 × 10⁻⁴ dL/g, a = 2/3. If the intrinsic viscosity is [η] = 1.0 dL/g, the viscosity-average MW is:",
      options: [
        { label: "a", text: "10,000" },
        { label: "b", text: "100,000" },
        { label: "c", text: "10,000,000" },
        { label: "d", text: "1,000,000" }
      ],
      answer: "d",
      why: "$[\\eta] = KM_v^{a}$ → $M_v = ([\\eta]/K)^{1/a} = (1.0/10^{-4})^{3/2} = (10^4)^{3/2} = 10^{6} = \\mathbf{1{,}000{,}000}$ g/mol.",
      distractors: {
        a: "10⁴ gives [η] = 10⁻⁴ × 100 = 0.01, a hundred-fold too low.",
        b: "10⁵ gives [η] = 10⁻⁴ × 10^2.5 ≈ 0.032.",
        c: "10⁷ gives [η] = 10⁻⁴ × 10^3.5 ≈ 31.6.",
      },
      concept: "$[\\eta]=KM^a$ → $M=([\\eta]/K)^{1/a}$",
      tags: ["numeric", "formula"],
    },
    {
      id: "t4-15",
      type: "concept",
      diff: 2,
      text: "Why does viscosity-average molecular weight depend on solvent quality?",
      options: [
        { label: "a", text: "Viscosity-average molecular weight is solvent-independent; solvent quality affects only instrument calibration." },
        { label: "b", text: "It is a noisy estimate, so solvent quality changes measurement scatter but never changes the value of Mv." },
        { label: "c", text: "Good solvents cleave covalent bonds and reduce the true chain molecular weight during viscosity measurement." },
        { label: "d", text: "Solvent quality changes coil expansion and intrinsic viscosity, so the Mark–Houwink estimate of Mv changes." }
      ],
      answer: "d",
      why: "In a **good solvent** chains swell → larger hydrodynamic volume → higher [η]. The Mark–Houwink K, a must be re-measured for every solvent and temperature; a ranges 0.5 (theta solvent) to 0.8 (good).",
      concept: "theta solvent: unperturbed coil, a = 0.5",
      tags: ["confused"],
    },
    {
      id: "t4-16",
      type: "statement",
      diff: 3,
      text: "Which statement(s) about the different MW averages is/are correct?",
      statements: [
        { num: 1, text: "Mn ≤ Mw ≤ Mz always, for any distribution." },
        { num: 2, text: "Mn is most affected by low-MW fractions; Mz most by high-MW fractions." },
        { num: 3, text: "Mechanical properties (toughness, melt strength) correlate better with Mw/Mz than with Mn." },
        { num: 4, text: "Osmometry gives Mz because it measures mass." },
      ],
      options: [
        { label: "a", text: "1 and 3 only" },
        { label: "b", text: "2 and 4 only" },
        { label: "c", text: "1, 2, 3 and 4" },
        { label: "d", text: "1, 2 and 3 only" }
      ],
      answer: "d",
      why: "1–3 are the defining sensitivity rules. Item 4 is false — osmometry measures a colligative property (particle count) → **Mn**, not Mz.",
      distractors: {
        c: "Item 4 confuses osmometry (Mn) with sedimentation-equilibrium (Mz).",
      },
      tags: ["confused"],
    },
    {
      id: "t4-17",
      type: "recall",
      diff: 1,
      text: "For a step-growth polymerization at high conversion, the most-probable distribution gives:",
      options: [
        { label: "a", text: "PDI → 0" },
        { label: "b", text: "PDI → 1" },
        { label: "c", text: "PDI → 4" },
        { label: "d", text: "PDI → 2" }
      ],
      answer: "d",
      why: "The **Flory most-probable distribution** (equal reactivity, random coupling) has the limiting value $M_w/M_n = 2$ — the theoretical floor for step-growth without fractionation.",
      tags: ["revision"],
    },
    {
      id: "t4-18",
      type: "numerical",
      diff: 3,
      text: "A polymer has Mw = 300,000 and Mn = 50,000. If the weight-average DP is 1,500 (repeat unit 200 g/mol), the number-average DP is:",
      options: [
        { label: "a", text: "250" },
        { label: "b", text: "750" },
        { label: "c", text: "3,000" },
        { label: "d", text: "125" }
      ],
      answer: "a",
      why: "$DP_n = M_n/M_{repeat} = 50000/200 = \\mathbf{250}$. (Check: $DP_w = M_w/200 = 1500$ ✓, and $DP_w/DP_n = PDI = 6$ ✓.)",
      distractors: {
        b: "750 is half of DPw — an arithmetic slip.",
      },
      concept: "$DP_n = M_n/M_{repeat}$; PDI is the same for DP and M",
      tags: ["numeric", "formula"],
    },
    {
      id: "t4-19",
      type: "apply",
      diff: 3,
      text: "A fibre must have maximum tensile strength and minimal brittleness. Which MW strategy?",
      options: [
        { label: "a", text: "Use very high Mw for entanglement and tie chains, while controlling orientation and defects to limit brittleness." },
        { label: "b", text: "Ignore molecular weight because fibre strength depends only on drawing speed and is unaffected by chain entanglement." },
        { label: "c", text: "Minimize Mn to make chains mobile, since short oligomers carry more tensile load than long entangled chains." },
        { label: "d", text: "Use low-MW monodisperse oligomers so chains can slide freely, eliminating brittle fracture under tensile load." }
      ],
      answer: "a",
      why: "Tensile strength rises with chain length (more entanglements transfer load) until a plateau — but very low Mn fractions act as defects. Industrial fibres target high Mw with controlled, narrow-enough MWD.",
      distractors: {
        c: "Low Mn gives waxy, weak material with no entanglement network.",
      },
      concept: "entanglement plateau governs mechanical usefulness",
      tags: ["revision"],
    },
    {
      id: "t4-20",
      type: "assertreason",
      diff: 3,
      assertion: "Light scattering gives a higher average MW than osmometry for the same sample.",
      reason: "Light scattering intensity is weighted by the square of chain mass, so heavy chains dominate; osmometry counts particles equally.",
      options: [
        { label: "a", text: "A is false, R is true" },
        { label: "b", text: "A is true, R is false" },
        { label: "c", text: "Both A and R are true, but R is NOT the correct explanation of A" },
        { label: "d", text: "Both A and R are true, and R is the correct explanation of A" }
      ],
      answer: "d",
      why: "The weightings are exactly as R describes — scattering ∝ mass² vs colligative ∝ count — which mathematically guarantees $M_w \\ge M_n$ (a Cauchy–Schwarz inequality on the distribution).",
      concept: "the averaging weight defines the average",
      tags: ["confused"],
    },
    {
      id: "t4-21",
      type: "numerical",
      diff: 4,
      text: "Two monodisperse fractions (each PDI = 1) of Mn = 20,000 (5 g) and Mn = 80,000 (5 g) are blended. The blend's Mn and Mw are:",
      options: [
        { label: "a", text: "Mn = 50,000; Mw = 50,000" },
        { label: "b", text: "Mn = 25,000; Mw = 80,000" },
        { label: "c", text: "Mn = 32,000; Mw = 40,000" },
        { label: "d", text: "Mn = 40,000; Mw = 32,000" }
      ],
      answer: "c",
      why: "Equal **masses**: $M_n = 1/(0.5/20000 + 0.5/80000) = 1/(2.5\\times10^{-5}+6.25\\times10^{-6}) = 1/(3.125\\times10^{-5}) = \\mathbf{32{,}000}$. $M_w = 0.5(20000)+0.5(80000) = \\mathbf{40{,}000}$ (mass-weighted arithmetic mean for monodisperse fractions).",
      distractors: {
        a: "50,000 is the simple arithmetic mean — valid only for mass-weighted Mw of equal masses, not Mn.",
        d: "Mn and Mw swapped.",
      },
      concept: "$1/M_n=\\sum w_i/M_i$ · $M_w=\\sum w_iM_i$",
      tags: ["numeric", "formula"],
    },
    {
      id: "t4-22",
      type: "concept",
      diff: 2,
      text: "What does a GPC/SEC instrument actually measure, and how is MW obtained?",
      options: [
        { label: "a", text: "It counts individual polymer particles electronically as they pass through a detector, giving a direct molecule count." },
        { label: "b", text: "It weighs polymer as it exits the column, so no calibration or reference standards are needed to assign molecular weight." },
        { label: "c", text: "SEC separates chains by hydrodynamic volume; calibration with standards then gives a relative molecular weight." },
        { label: "d", text: "It measures osmotic pressure between a polymer solution and pure solvent, then calculates molecular weight from that." }
      ],
      answer: "c",
      why: "SEC separates on **coil size** (hydrodynamic volume), not mass. Calibration with narrow-PS standards gives PS-equivalent MW; absolute MW needs in-line light scattering or viscometry.",
      concept: "SEC = relative technique (Mark–Houwink correction needed)",
      tags: ["confused"],
    },
    {
      id: "t4-23",
      type: "recall",
      diff: 1,
      text: "In viscometry, reduced viscosity ηsp/c is extrapolated to zero concentration to obtain:",
      options: [
        { label: "a", text: "Crystallinity, estimated from the mass fraction of ordered domains in the polymer specimen after cooling." },
        { label: "b", text: "Number-average molecular weight, obtained by counting chains rather than measuring their hydrodynamic volume." },
        { label: "c", text: "Intrinsic viscosity [η], the limiting reduced viscosity as concentration approaches zero in a specified solvent and temperature." },
        { label: "d", text: "A rate constant, inferred from the slope of viscosity against concentration during the dilute-solution measurement." }
      ],
      answer: "c",
      why: "$\\eta_{sp}/c$ vs $c$ → intercept at $c\\to0$ = **intrinsic viscosity** [η], then $[\\eta]=KM_v^a$ gives $M_v$.",
      tags: ["revision"],
    },
    {
      id: "t4-24",
      type: "higher",
      diff: 4,
      text: "A rubber is made by cross-linking chains of Mn = 200,000. Before cross-linking, which average best predicts the number of chain ends per gram (relevant for end-group analyses and cross-link density)?",
      options: [
        { label: "a", text: "No average is relevant; the number of chain ends per gram is independent of the length of the polymer chains." },
        { label: "b", text: "Mz, the z-average, is best because its weighting emphasizes the largest chains and therefore counts their ends most accurately." },
        { label: "c", text: "Mw is best because weighting by chain mass determines the number of chain ends present in a fixed mass of sample." },
        { label: "d", text: "Mn is best because chain count per gram scales with 1/Mn; for linear chains, each molecule has two ends." }
      ],
      answer: "d",
      why: "End groups per gram $= 2\\rho/M_n$ (2 per linear chain). Since each chain contributes exactly 2 ends regardless of length, counting chains = the **number-average**. Short chains contribute disproportionately many ends — exactly what Mn captures.",
      concept: "any per-chain quantity is governed by Mn",
      tags: ["confused"],
    },
    {
      id: "t4-25",
      type: "compare",
      diff: 2,
      text: "GPC vs osmometry for routine MW determination — which pairing is correct?",
      options: [
        { label: "a", text: "GPC measures only Mz, while osmometry provides the complete molecular-weight distribution and every average." },
        { label: "b", text: "Osmometry gives the entire molecular-weight distribution; GPC measures a single absolute molecular weight directly." },
        { label: "c", text: "GPC rapidly gives a calibrated relative distribution and its averages; osmometry mainly gives the number-average MW." },
        { label: "d", text: "Both methods measure absolute molecular weight directly without calibration, standards or assumptions about solution behaviour." }
      ],
      answer: "c",
      why: "SEC's advantage is the **full chromatogram** (all averages, PDI, bimodality) in one run; its limitation is calibration-relative MW. Osmometry is **absolute** for Mn but single-point and limited by membrane solute retention.",
      tags: ["revision"],
    },
    {
      id: "t4-26",
      type: "numerical",
      diff: 3,
      text: "A free-radical polymerization has kinetic chain length ν = 500 with termination solely by combination. The DP̄ is:",
      options: [
        { label: "a", text: "500" },
        { label: "b", text: "2,000" },
        { label: "c", text: "250" },
        { label: "d", text: "1,000" }
      ],
      answer: "d",
      why: "**Combination** joins two kinetic chains: $\\overline{DP} = 2\\nu = 2\\times500 = \\mathbf{1000}$. Disproportionation would give 500.",
      distractors: {
        a: "500 is the disproportionation result.",
      },
      concept: "$\\overline{DP}=2\\nu$ (combination), $\\nu$ (disproportionation)",
      tags: ["numeric", "formula"],
    },
    {
      id: "t4-27",
      type: "graph",
      diff: 3,
      text: "A cumulative weight-fraction curve rises steeply then plateaus; the 50% point is called:",
      options: [
        { label: "a", text: "M_n — number-average molecular weight, based on the number of chains." },
        { label: "b", text: "M_w — weight-average molecular weight, weighted by each chain's mass." },
        { label: "c", text: "M_50 — weight-median molecular weight; half the mass lies on either side." },
        { label: "d", text: "M_p — most-probable molecular weight at the peak of the distribution." }
      ],
      answer: "c",
      why: "The 50% point on a cumulative weight-fraction curve is the weight-median molecular weight, M_50: half the sample mass lies below it and half above it. M_p is the mode of the differential distribution, while M_n and M_w are different averages.",
      tags: ["confused"],
    },
    {
      id: "t4-28",
      type: "statement",
      diff: 2,
      text: "Which statement(s) about Carothers' equation is/are correct?",
      statements: [
        { num: 1, text: "Xn = 1/(1 − p) applies to stoichiometrically balanced step-growth systems." },
        { num: 2, text: "It shows that 99% conversion gives Xn = 100." },
        { num: 3, text: "With an imbalance ratio r, Xmax = (1 + r)/(1 − r)." },
        { num: 4, text: "It applies to chain-growth polymerization." },
      ],
      options: [
        { label: "a", text: "4 only" },
        { label: "b", text: "2 and 3 only" },
        { label: "c", text: "1, 2 and 3 only" },
        { label: "d", text: "1, 2, 3 and 4" }
      ],
      answer: "c",
      why: "1–3 correct (0.99 → 100; imbalance cap (1+r)/(1−r)). Item 4 false — Carothers describes **step-growth** only; chain-growth kinetics use Rp and ν.",
      distractors: {
        d: "Item 4 mixes the two mechanism families.",
      },
      tags: ["confused"],
    },
    {
      id: "t4-29",
      type: "apply",
      diff: 4,
      text: "Gel-permeation chromatography of a branched PE sample gives a lower MW than light scattering. The best explanation:",
      options: [
        { label: "a", text: "Light scattering overestimates every branched polymer because the optical detector responds to branch points, not mass." },
        { label: "b", text: "Branching lowers the actual molecular weight because each branch removes repeat units from the polymer backbone." },
        { label: "c", text: "Branched coils are more compact; a linear-chain calibration therefore assigns them an artificially low apparent MW." },
        { label: "d", text: "A lower SEC result proves the light-scattering detector failed and that the branching structure is irrelevant." }
      ],
      answer: "c",
      why: "SEC separates by **hydrodynamic volume**. A branched coil is compact for its mass → it elutes at a volume the calibration assigns to a *lower* MW linear chain → SEC (relative) under-reports. Absolute LS sees the true mass and disagrees — the diagnostic signature of branching.",
      concept: "relative MW techniques assume linear standards",
      tags: ["confused"],
    },
    {
      id: "t4-30",
      type: "numerical",
      diff: 4,
      text: "A polymer sample: 60 mol% chains of MW 10,000 and 40 mol% of MW 40,000. Mn and Mw are:",
      options: [
        { label: "a", text: "Mn = 22,000; Mw = 22,000" },
        { label: "b", text: "Mn = 31,800; Mw = 22,000" },
        { label: "c", text: "Mn = 22,000; Mw = 31,800" },
        { label: "d", text: "Mn = 25,000; Mw = 25,000" }
      ],
      answer: "c",
      why: "$M_n = 0.6(10{,}000)+0.4(40{,}000) = 6{,}000+16{,}000 = \\mathbf{22{,}000}$. $M_w = \\frac{\\sum N_iM_i^2}{\\sum N_iM_i} = \\frac{0.6(10^8)+0.4(1.6\\times10^9)}{22{,}000} = \\frac{7.0\\times10^8}{22{,}000} \\approx \\mathbf{31{,}800}$.",
      distractors: {
        b: "Mn and Mw are swapped - the number-average is the simple mole-fraction mean.",
        d: "25,000 is the unweighted arithmetic mean, valid for neither average here.",
        a: "Mw = Mn would require monodisperse chains.",
      },
      concept: "convert number→weight fractions before computing Mw",
      tags: ["numeric", "formula"],
    },
  ],
};

export default T4;
