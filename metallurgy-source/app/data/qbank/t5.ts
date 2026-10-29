import type { TopicSource } from "../../mt203/types";

/**
 * MT203 — Topic 5: Polymer Crystallinity
 * Source: Module 3 §2 + Module 1 §4. 20 questions.
 */
const T5: TopicSource = {
  id: "t5",
  module: "m1",
  title: "Polymer Crystallinity",
  subtitle: "Topic 5 · chain regularity, lamellae, spherulites and degree of crystallinity",
  subs: [
    { id: "T5.1", title: "Requirements: regularity, stereochemistry, no defects" },
    { id: "T5.2", title: "Morphology: chain folding, lamellae, spherulites" },
    { id: "T5.3", title: "Measuring crystallinity (density, DSC, XRD)" },
    { id: "T5.4", title: "Crystallinity vs properties" },
  ],
  questions: [
    {
      id: "t5-01",
      type: "recall",
      diff: 1,
      text: "The essential structural requirement for a polymer to crystallize is:",
      options: [
        { label: "a", text: "High molecular weight only" },
        { label: "b", text: "Cross-linking" },
        { label: "c", text: "Regular, repeating chain structure — linear, stereoregular and free of random defects" },
        { label: "d", text: "The presence of benzene rings" }
      ],
      answer: "c",
      why: "Crystallization needs the chains to **pack into a repeating lattice** — possible only if the chain is linear (or lightly branched), stereoregular and not randomly copolymerized. MW only matters above a minimum.",
      distractors: {
        b: "Cross-linking actually *hinders* crystallization by locking in disorder.",
      },
      tags: ["revision"],
    },
    {
      id: "t5-02",
      type: "numerical",
      diff: 3,
      text: "Amorphous PE has $\\rho_a = 0.855$ g/cm³ and fully crystalline PE $\\rho_c = 1.000$ g/cm³. A sample of density $\\rho = 0.930$ g/cm³ has a degree of crystallinity of:",
      options: [
        { label: "a", text: "31%" },
        { label: "b", text: "70%" },
        { label: "c", text: "52%" },
        { label: "d", text: "43%" }
      ],
      answer: "c",
      why: "$X = \\dfrac{\\rho - \\rho_a}{\\rho_c - \\rho_a} = \\dfrac{0.930-0.855}{1.000-0.855} = \\dfrac{0.075}{0.145} = \\mathbf{0.517} \\approx 52\\%$.",
      distractors: {
        a: "31% would need $\\rho = 0.900$.",
        b: "70% would need $\\rho \\approx 0.957$ (HDPE territory).",
      },
      concept: "$X = (\\rho-\\rho_a)/(\\rho_c-\\rho_a)$",
      tags: ["numeric", "formula"],
    },
    {
      id: "t5-03",
      type: "numerical",
      diff: 3,
      text: "A PET sample gives a DSC melting endotherm $\\Delta H_m = 42$ J/g. Taking $\\Delta H_m^\\circ = 140$ J/g for 100% crystalline PET, the crystallinity is:",
      options: [
        { label: "a", text: "20%" },
        { label: "b", text: "42%" },
        { label: "c", text: "30%" },
        { label: "d", text: "10%" }
      ],
      answer: "c",
      why: "$X = \\Delta H_m/\\Delta H_m^\\circ = 42/140 = \\mathbf{0.30} = 30\\%$.",
      distractors: {
        d: "10% would need $\\Delta H_m = 14$ J/g.",
      },
      concept: "$X = \\Delta H_m / \\Delta H_m^\\circ$",
      tags: ["numeric", "formula"],
    },
    {
      id: "t5-04",
      type: "concept",
      diff: 2,
      text: "Why is atactic polystyrene completely amorphous?",
      options: [
        { label: "a", text: "High molecular weight prevents all chain rearrangement, even when the chain stereochemistry is regular." },
        { label: "b", text: "Ordinary styrene polymerization forms permanent covalent cross-links that prevent phenyl groups from packing." },
        { label: "c", text: "It lacks the aromatic double bonds required for any polymer chain to form a crystalline lattice." },
        { label: "d", text: "Random phenyl placement disrupts regular chain packing, preventing the long-range order needed for crystallization." }
      ],
      answer: "d",
      why: "The bulky phenyl groups are placed **randomly** (atactic) along the chain, so no repeating lattice can form — the polymer is transparent and amorphous. Isotactic PS, by contrast, is crystalline.",
      distractors: {
        a: "MW has no bearing on atacticity.",
      },
      concept: "stereoregularity is a prerequisite for crystallinity",
      tags: ["confused"],
    },
    {
      id: "t5-05",
      type: "compare",
      diff: 2,
      text: "Which set correctly contrasts HDPE with LDPE?",
      options: [
        { label: "a", text: "Both are amorphous." },
        { label: "b", text: "HDPE: branched, lower crystallinity; LDPE: linear, higher crystallinity." },
        { label: "c", text: "HDPE: thermoset; LDPE: thermoplastic." },
        { label: "d", text: "HDPE: linear, ~70–80% crystalline, ρ ≈ 0.95, Tm ≈ 135 °C. LDPE: branched, ~40–50% crystalline, ρ ≈ 0.92, Tm ≈ 115 °C." }
      ],
      answer: "d",
      why: "Linear HDPE packs efficiently → **higher crystallinity, density and Tm**. Branches in LDPE disrupt packing → lower on all three.",
      distractors: {
        b: "Reversed — branching lowers crystallinity, and HDPE is the linear one.",
      },
      concept: "branching ↓ crystallinity ↓ density ↓ Tm",
      tags: ["confused"],
    },
    {
      id: "t5-06",
      type: "statement",
      diff: 2,
      text: "Which statement(s) about spherulites is/are correct?",
      statements: [
        { num: 1, text: "They are spherical aggregates of chain-folded lamellae, radiating from a nucleation centre." },
        { num: 2, text: "Under crossed polarizers they show a Maltese-cross pattern." },
        { num: 3, text: "Amorphous polymer regions fill the space between lamellae and spherulites." },
        { num: 4, text: "A polymer is either 100% crystalline or 100% amorphous." },
      ],
      options: [
        { label: "a", text: "1, 2, 3 and 4" },
        { label: "b", text: "4 only" },
        { label: "c", text: "1, 2 and 3 only" },
        { label: "d", text: "2 and 4 only" }
      ],
      answer: "c",
      why: "1–3 describe real morphology. Item 4 is false — **semi-crystalline** polymers always contain both phases: crystallites embedded in an amorphous matrix.",
      distractors: {
        a: "Item 4 ignores the coexistence of phases, which is what makes 'semi-crystalline' the correct term.",
      },
      tags: ["confused"],
    },
    {
      id: "t5-07",
      type: "concept",
      diff: 2,
      text: "Why does rapidly quenching a polymer melt give lower crystallinity than slow cooling?",
      options: [
        { label: "a", text: "Quenching destroys the polymer chains." },
        { label: "b", text: "Quenching removes heat too fast for crystallites to nucleate and grow; chains are frozen in a disordered state below Tg." },
        { label: "c", text: "Quenching raises the melting point." },
        { label: "d", text: "Quenching has no effect on crystallinity." }
      ],
      answer: "b",
      why: "Crystallization is **kinetically controlled**: it needs time as well as a temperature between Tg and Tm. Fast cooling traps the amorphous state; slow cooling lets lamellae grow.",
      concept: "crystallinity = kinetic (cooling rate) outcome",
      tags: ["confused"],
    },
    {
      id: "t5-08",
      type: "apply",
      diff: 3,
      text: "A clear, transparent container is required. Which material choice and processing logic is best?",
      options: [
        { label: "a", text: "Amorphous PET (rapidly quenched) or an amorphous polymer such as PS/PMMA — crystallites scatter light and reduce clarity." },
        { label: "b", text: "Slowly cooled HDPE — high crystallinity gives the best clarity." },
        { label: "c", text: "A cross-linked thermoset." },
        { label: "d", text: "Any polymer, since clarity is independent of crystallinity." }
      ],
      answer: "a",
      why: "Crystallites are optically anisotropic and **scatter light** → opaque/translucent. Transparency therefore requires an amorphous state (quenched PET, PS, PMMA, PC).",
      distractors: {
        b: "HDPE's large spherulites scatter strongly — it is the classic *opaque* polymer.",
      },
      concept: "crystallinity ↔ opacity",
      tags: ["revision"],
    },
    {
      id: "t5-09",
      type: "match",
      diff: 2,
      text: "Match each morphology term with its correct description.",
      tableRows: [
        ["1", "Lamella", "", "(i) thin, chain-folded crystalline sheet"],
        ["2", "Spherulite", "", "(ii) spherical aggregate of lamellae growing from a nucleus"],
        ["3", "Tie molecule", "", "(iii) chain segment connecting two lamellae/regions"],
        ["4", "Amorphous halo", "", "(iv) broad XRD feature of disordered regions"],
      ],
      options: [
        { label: "a", text: "1-i, 2-ii, 3-iii, 4-iv" },
        { label: "b", text: "1-ii, 2-i, 3-iv, 4-iii" },
        { label: "c", text: "1-iii, 2-iv, 3-i, 4-ii" },
        { label: "d", text: "1-i, 2-ii, 3-iv, 4-iii" }
      ],
      answer: "a",
      why: "Lamella = folded chain crystal sheet · spherulite = radiating aggregate · tie molecule = inter-lamellar connector · amorphous halo = broad XRD scattering from disordered chains.",
      tags: ["revision"],
    },
    {
      id: "t5-10",
      type: "graph",
      diff: 3,
      text: "A DSC heating scan shows: (i) a small step change in heat capacity at 70 °C, (ii) a broad exotherm at 130 °C, (iii) a large endotherm at 255 °C. A quenched PET sample is being tested. The events are:",
      options: [
        { label: "a", text: "(i) Tg, (ii) cold crystallization, (iii) Tm" },
        { label: "b", text: "(i) cold crystallization, (ii) Tg, (iii) Tm" },
        { label: "c", text: "(i) Tm, (ii) Tg, (iii) decomposition" },
        { label: "d", text: "(i) cross-linking, (ii) melting, (iii) Tg" }
      ],
      answer: "a",
      why: "On heating a **quenched (amorphous)** PET: the step at ~70 °C is **Tg**; the exotherm above Tg is **cold crystallization** (chains gain mobility and crystallize); the ~255 °C endotherm is **Tm**.",
      distractors: {
        c: "Tm never occurs below Tg — the ordering is physically fixed.",
      },
      concept: "DSC events: Tg (step) < cold-cryst (exo) < Tm (endo)",
      tags: ["confused"],
    },
    {
      id: "t5-11",
      type: "concept",
      diff: 3,
      text: "Why does copolymerizing ethylene with a small amount of 1-hexene (LLDPE) lower crystallinity relative to HDPE?",
      options: [
        { label: "a", text: "1-Hexene is a plasticizer that evaporates." },
        { label: "b", text: "The butyl branches are defects that interrupt the regular lattice and lower the lamellar perfection and thickness." },
        { label: "c", text: "Copolymerization increases chain length." },
        { label: "d", text: "It does not lower crystallinity." }
      ],
      answer: "b",
      why: "Comonomer units act as **lattice defects**: the regular chain sequence is interrupted, so thinner, less perfect lamellae form → lower crystallinity and Tm, but better toughness and clarity.",
      concept: "defects (branches/comonomers) ↓ crystallinity",
      tags: ["revision"],
    },
    {
      id: "t5-12",
      type: "recall",
      diff: 1,
      text: "In wide-angle X-ray diffraction, a semi-crystalline polymer shows:",
      options: [
        { label: "a", text: "No scattering at all" },
        { label: "b", text: "Only sharp peaks" },
        { label: "c", text: "Only a broad halo" },
        { label: "d", text: "Sharp crystalline peaks superimposed on a broad amorphous halo" }
      ],
      answer: "d",
      why: "Sharp **Bragg peaks** come from the periodic crystallites; the **broad halo** comes from disordered amorphous regions. Their relative areas estimate crystallinity.",
      tags: ["revision"],
    },
    {
      id: "t5-13",
      type: "concept",
      diff: 3,
      text: "Crystallites raise a polymer's stiffness and strength up to the Tm but do not dissolve the material in solvent. This is because they act as:",
      options: [
        { label: "a", text: "Plasticizers increase chain mobility and lower stiffness, but they do not stop the base polymer dissolving in solvents." },
        { label: "b", text: "Rigid fillers remain insoluble and load-bearing even above the polymer's melting point." },
        { label: "c", text: "Permanent covalent cross-links cannot be broken by heating or ordinary solvents, unlike reversible crystalline domains." },
        { label: "d", text: "Physical cross-links: crystalline domains anchor chains but melt reversibly at Tm." }
      ],
      answer: "d",
      why: "Crystalline domains anchor the chains like **physical cross-links** — reversible with temperature (melt atTm), unlike covalent cross-links.",
      concept: "crystallites: thermoreversible physical cross-links",
      tags: ["confused"],
    },
    {
      id: "t5-14",
      type: "apply",
      diff: 4,
      text: "A moulder wants faster cycle times and a tougher (less brittle) semi-crystalline moulding. The best additive strategy is:",
      options: [
        { label: "a", text: "Add a cross-linker." },
        { label: "b", text: "Add a nucleating agent: many nuclei form at once → many small spherulites → faster crystallization and better toughness." },
        { label: "c", text: "Add a plasticizer to lower crystallinity." },
        { label: "d", text: "Slow the cooling to grow large spherulites." }
      ],
      answer: "b",
      why: "A **nucleating agent** multiplies nucleation sites → many fine spherulites → shorter cycle time, improved toughness and (often) clarity. Large spherulites, by contrast, are brittle.",
      concept: "spherulite size ∝ 1/nucleation density; large spherulites = brittle",
      tags: ["confused"],
    },
    {
      id: "t5-15",
      type: "assertreason",
      diff: 3,
      assertion: "Increasing crystallinity raises a polymer's density.",
      reason: "Crystalline packing places chains closer together than the disordered amorphous arrangement.",
      options: [
        { label: "a", text: "A is true, R is false" },
        { label: "b", text: "Both A and R are true, and R is the correct explanation of A" },
        { label: "c", text: "Both A and R are true, but R is NOT the correct explanation of A" },
        { label: "d", text: "A is false, R is true" }
      ],
      answer: "b",
      why: "Denser packing in crystallites (e.g. PE $\\rho_c = 1.00$ vs $\\rho_a = 0.855$) directly raises the sample density — the same physical fact behind the density method for measuring crystallinity.",
      concept: "$\\rho_c > \\rho_a$",
      tags: ["revision"],
    },
    {
      id: "t5-16",
      type: "statement",
      diff: 3,
      text: "Classify as semi-crystalline or amorphous. Which statement is correct?",
      statements: [
        { num: 1, text: "HDPE, isotactic PP, PET and nylon 6,6 are typically semi-crystalline." },
        { num: 2, text: "Atactic PS, PMMA and polycarbonate are typically amorphous." },
        { num: 3, text: "Amorphous polymers are usually transparent; semi-crystalline ones are usually opaque." },
        { num: 4, text: "No polymer can ever be 100% crystalline." },
      ],
      options: [
        { label: "a", text: "1, 2, 3 and 4" },
        { label: "b", text: "4 only" },
        { label: "c", text: "2 and 4 only" },
        { label: "d", text: "1, 2 and 3 only" }
      ],
      answer: "a",
      why: "All four are true: the listed crystalline/amorphous pairs, the transparency correlation, and the fact that chain entanglements and defects always leave an amorphous fraction — no bulk polymer is 100% crystalline.",
      tags: ["revision"],
    },
    {
      id: "t5-17",
      type: "concept",
      diff: 3,
      text: "PET drink bottles are transparent but PET fibres are strong and semi-crystalline. Why the difference?",
      options: [
        { label: "a", text: "Bottles are cross-linked during moulding, while fibres are made from a chemically different grade of PET." },
        { label: "b", text: "Rapid quenching leaves bottles largely amorphous and clear; drawing fibres aligns chains and promotes crystallinity." },
        { label: "c", text: "Bottles and fibres are made from distinct polymers, one amorphous and one inherently crystalline." },
        { label: "d", text: "Fibres contain no PET; they use a different polyester selected only for its lower density." }
      ],
      answer: "b",
      why: "**Same chemistry, different processing**: quench → amorphous (clarity, toughness for bottles); draw → oriented crystallites (high modulus/strength for fibres).",
      concept: "orientation-induced crystallization (draw ratio)",
      tags: ["confused"],
    },
    {
      id: "t5-18",
      type: "sequence",
      diff: 2,
      text: "Order the crystallization process from melt, earliest first: (1) growth of chain-folded lamellae (2) primary nucleation (3) formation of spherulites (4) secondary crystallization / perfection",
      options: [
        { label: "a", text: "2 → 1 → 3 → 4" },
        { label: "b", text: "3 → 2 → 1 → 4" },
        { label: "c", text: "1 → 2 → 3 → 4" },
        { label: "d", text: "2 → 3 → 1 → 4" }
      ],
      answer: "a",
      why: "A stable **nucleus** must form first (**2**); lamellae then grow from it (**1**); radiating stacks create **spherulites** (**3**); further slow **secondary crystallization/perfection** continues after the main growth (**4**).",
      tags: ["revision"],
    },
    {
      id: "t5-19",
      type: "compare",
      diff: 3,
      text: "The 'fringed micelle' vs 'chain-folded lamella' models differ in that:",
      options: [
        { label: "a", text: "The two models depict the same chain arrangement and differ only in terminology used by different researchers." },
        { label: "b", text: "Fringed-micelle applies to thermosets, while chain-folded lamellae form only in cross-linked polymers." },
        { label: "c", text: "Chain-folded lamellae need long side chains to tie adjacent crystals; linear chains cannot fold back on themselves." },
        { label: "d", text: "Fringed-micelle chains span several crystallites; in lamellae, chains fold back repeatedly within thin crystals." }
      ],
      answer: "d",
      why: "The **fringed-micelle** model imagined one chain crossing many small crystallites; electron microscopy of single crystals proved **chain folding** — chains fold back and forth within a thin (~10 nm) lamella.",
      tags: ["confused"],
    },
    {
      id: "t5-20",
      type: "higher",
      diff: 4,
      text: "Plotting tensile modulus vs %crystallinity for PE gives a steep rise up to ~60% then a plateau. The plateau is best explained by:",
      options: [
        { label: "a", text: "The plateau is a plotting artifact; modulus is unrelated to morphology and should not depend on crystallinity." },
        { label: "b", text: "Crystallinity has no effect on modulus; the initial increase must instead come from changes in molecular weight." },
        { label: "c", text: "Once tie molecules constrain the amorphous phase, adding crystallites yields diminishing stiffness gains." },
        { label: "d", text: "Polyethylene cannot crystallize above about 60%, so the measured modulus has no physical route to increase further." }
      ],
      answer: "c",
      why: "Stiffness depends on the **load-bearing crystalline network and the tie molecules bridging it**. Once the amorphous phase is highly constrained, extra crystallinity gives diminishing returns — the plateau.",
      concept: "tie molecules transmit load between lamellae",
      tags: ["confused"],
    },
  ],
};

export default T5;
