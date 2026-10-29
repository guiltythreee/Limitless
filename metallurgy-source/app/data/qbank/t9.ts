import type { TopicSource } from "../../mt203/types";

/**
 * MT203 — Topic 9: Polymer Blends, Composites & Degradation
 * Source: Module 2 §6–7. 24 questions.
 */
const T9: TopicSource = {
  id: "t9",
  module: "m2",
  title: "Blends, Composites & Degradation",
  subtitle: "Topic 9 · mixing rules, compatibilization and how polymers fail",
  subs: [
    { id: "T9.1", title: "Miscibility: thermodynamics & the χ parameter" },
    { id: "T9.2", title: "Mixing rules & compatibilizers" },
    { id: "T9.3", title: "Rubber toughening & composites" },
    { id: "T9.4", title: "Degradation routes & stabilization" },
  ],
  questions: [
    {
      id: "t9-01",
      type: "recall",
      diff: 1,
      text: "For two polymers to form a miscible (single-phase) blend, the Gibbs free energy of mixing must satisfy:",
      options: [
        { label: "a", text: "$\\Delta H_{mix} = 0$ only" },
        { label: "b", text: "$\\Delta G_{mix} > 0$" },
        { label: "c", text: "$\\Delta G_{mix} < 0$ and $\\partial^2\\Delta G/\\partial\\phi^2 > 0$" },
        { label: "d", text: "$\\Delta S_{mix} = 0$" }
      ],
      answer: "c",
      why: "Mixing is spontaneous when **ΔG < 0**, and the mixture must also be stable against phase separation (second derivative positive — the curvature condition of the Flory–Huggins free-energy curve).",
      concept: "$\\Delta G = \\Delta H - T\\Delta S$ + curvature condition",
      tags: ["revision"],
    },
    {
      id: "t9-02",
      type: "concept",
      diff: 3,
      text: "Why are most pairs of polymers immiscible even when the corresponding small molecules would mix?",
      options: [
        { label: "a", text: "They have matching solubility parameters, so every pair with identical δ values is miscible at any molecular weight." },
        { label: "b", text: "They are always covalently cross-linked, which stops solvent molecules from mixing with either polymer." },
        { label: "c", text: "They are chemically inert, so the enthalpy of mixing is exactly zero for every pair of polymer chains." },
        { label: "d", text: "Their mixing entropy is small at high chain length, so slight unfavorable enthalpy can drive phase separation." }
      ],
      answer: "d",
      why: "For polymer chains the combinatorial **entropy of mixing is tiny** (∝ 1/N per molecule). A very small positive ΔH therefore dominates, giving $\\Delta G > 0$ and immiscibility — which is why miscibility usually needs specific favourable interactions.",
      concept: "Flory–Huggins: χ must be very small for polymer miscibility",
      tags: ["confused"],
    },
    {
      id: "t9-03",
      type: "concept",
      diff: 3,
      text: "Which situation is most likely to give a *miscible* polymer blend?",
      options: [
        { label: "a", text: "Two highly cross-linked networks" },
        { label: "b", text: "Two polymers of very different solubility parameters" },
        { label: "c", text: "A non-polar polyolefin blended with a polar polyamide" },
        { label: "d", text: "A H-bond-donating polymer blended with an H-bond-accepting polymer (e.g. PS with PPO, or a polymer with itself)" }
      ],
      answer: "d",
      why: "**Specific interactions** (H-bonding, donor–acceptor, dipole) make ΔH negative or ~0, letting the small entropy term win. PS/PPO and PVC/PCL are classic miscible pairs; two networks cannot mix at all.",
      concept: "miscibility usually needs attractive specific interactions",
      tags: ["confused"],
    },
    {
      id: "t9-04",
      type: "numerical",
      diff: 3,
      text: "A blend is 70 wt% PE ($\\rho = 0.92$ g/cm³) and 30 wt% PS ($\\rho = 1.05$ g/cm³). Using $1/\\rho = \\sum w_i/\\rho_i$, the blend density is:",
      options: [
        { label: "a", text: "1.02 g/cm³" },
        { label: "b", text: "0.99 g/cm³" },
        { label: "c", text: "0.90 g/cm³" },
        { label: "d", text: "0.96 g/cm³" }
      ],
      answer: "d",
      why: "$\\dfrac{1}{\\rho} = \\dfrac{0.70}{0.92} + \\dfrac{0.30}{1.05} = 0.7609 + 0.2857 = 1.0466$ → $\\rho = \\mathbf{0.956} \\approx 0.96$ g/cm³.",
      distractors: {
        a: "1.02 is the arithmetic (volume-ignoring) mean — the density rule is reciprocal.",
      },
      concept: "$1/\\rho_{blend} = \\sum w_i/\\rho_i$",
      tags: ["numeric", "formula"],
    },
    {
      id: "t9-05",
      type: "numerical",
      diff: 3,
      text: "A compatibilized blend follows the parallel (Voigt) modulus rule $E = \\phi_1E_1 + \\phi_2E_2$. For 40 vol% glass fibre ($E_f = 70$ GPa) in nylon ($E_m = 3$ GPa), the composite modulus is:",
      options: [
        { label: "a", text: "36.5 GPa" },
        { label: "b", text: "14.8 GPa" },
        { label: "c", text: "70 GPa" },
        { label: "d", text: "29.8 GPa" }
      ],
      answer: "d",
      why: "$E = 0.4(70) + 0.6(3) = 28 + 1.8 = \\mathbf{29.8}$ GPa — the **upper (Voigt) bound** for continuous aligned reinforcement.",
      distractors: {
        b: "14.8 GPa would need 20 vol% fibre.",
      },
      concept: "Voigt (parallel): $E = \\sum\\phi_iE_i$",
      tags: ["numeric", "formula"],
    },
    {
      id: "t9-06",
      type: "concept",
      diff: 3,
      text: "A block or graft copolymer added to an immiscible A/B blend improves mechanical properties because it:",
      options: [
        { label: "a", text: "Acts as a surfactant — one block is miscible with A and the other with B, anchoring the two phases and stabilizing the interface." },
        { label: "b", text: "Dissolves completely in A." },
        { label: "c", text: "Raises the melting point of both phases." },
        { label: "d", text: "Cross-links the interface covalently in all cases." }
      ],
      answer: "a",
      why: "A **compatibilizer** is an interfacial emulsifier: it reduces interfacial tension, stabilizes the morphology and transmits stress across the phase boundary, giving much tougher blends (e.g. maleic-anhydride-grafted PO in PA blends).",
      concept: "block/graft copolymer = polymeric surfactant",
      tags: ["confused"],
    },
    {
      id: "t9-07",
      type: "recall",
      diff: 2,
      text: "In HIPS (high-impact polystyrene), the polybutadiene rubber particles improve toughness mainly by:",
      options: [
        { label: "a", text: "initiating crazing and shear yielding that absorb impact energy" },
        { label: "b", text: "increasing the crystallinity of PS" },
        { label: "c", text: "dissolving in the PS matrix" },
        { label: "d", text: "raising the Tg of PS" }
      ],
      answer: "a",
      why: "Rubber particles act as **stress concentrators**: they initiate many small crazes and shear bands throughout the matrix, absorbing far more energy than a single catastrophic crack.",
      concept: "rubber toughening: multiple crazing/shear yielding",
      tags: ["revision"],
    },
    {
      id: "t9-08",
      type: "match",
      diff: 2,
      text: "Match each degradation route with its cause.",
      tableRows: [
        ["1", "Thermal", "", "(i) heat, with scission of the weakest bonds (e.g. PVC → HCl)"],
        ["2", "Photo-oxidative", "", "(ii) UV + O₂ via radical chain reactions"],
        ["3", "Hydrolytic", "", "(iii) water attack on ester/amide bonds"],
        ["4", "Mechanical", "", "(iv) repeated stressing/abrasion during processing"],
      ],
      options: [
        { label: "a", text: "1-i, 2-ii, 3-iv, 4-iii" },
        { label: "b", text: "1-i, 2-ii, 3-iii, 4-iv" },
        { label: "c", text: "1-iii, 2-iv, 3-i, 4-ii" },
        { label: "d", text: "1-ii, 2-i, 3-iv, 4-iii" }
      ],
      answer: "b",
      why: "Thermal → bond scission (PVC dehydrochlorination); photo-oxidative → UV + oxygen radicals; hydrolytic → ester/amide hydrolysis; mechanical → processing stresses.",
      tags: ["revision"],
    },
    {
      id: "t9-09",
      type: "statement",
      diff: 3,
      text: "Which statement(s) about photo-oxidation of polymers is/are correct?",
      statements: [
        { num: 1, text: "The Norrish reactions describe the photochemistry of the carbonyl (C=O) chromophore." },
        { num: 2, text: "Photo-oxidation proceeds by a radical chain mechanism." },
        { num: 3, text: "UV absorbers and HALS are used to slow it down." },
        { num: 4, text: "Saturated polyolefins are completely immune to UV attack." },
      ],
      options: [
        { label: "a", text: "1 and 4 only" },
        { label: "b", text: "1, 2 and 3 only" },
        { label: "c", text: "1, 2, 3 and 4" },
        { label: "d", text: "4 only" }
      ],
      answer: "b",
      why: "1–3 correct. Item 4 is false: although PE has no intrinsic chromophore, trace **carbonyls or catalyst residues** absorb UV and initiate chain scission/cross-linking — hence outdoor polyolefins still need stabilizers.",
      distractors: {
        c: "Item 4 ignores the trace chromophores that make polyolefins photo-degradable.",
      },
      concept: "chromophore (C=O) + O₂ → radical photo-oxidation",
      tags: ["confused"],
    },
    {
      id: "t9-10",
      type: "compare",
      diff: 3,
      text: "Primary vs secondary antioxidants: which pairing is correct?",
      options: [
        { label: "a", text: "Neither is used in polymers." },
        { label: "b", text: "Both are UV absorbers." },
        { label: "c", text: "Primary (hindered phenols/amines) scavenge free radicals; secondary (phosphites/thioethers) decompose hydroperoxides non-radically." },
        { label: "d", text: "Primary decompose hydroperoxides; secondary scavenge radicals." }
      ],
      answer: "c",
      why: "**Primary antioxidants** trap peroxyl/radical species; **secondary antioxidants** convert hydroperoxides (ROOH) into non-radical alcohols, removing the source of new radicals. They are used together for synergy.",
      concept: "primary = radical trap · secondary = peroxide decomposer",
      tags: ["confused"],
    },
    {
      id: "t9-11",
      type: "concept",
      diff: 3,
      text: "Why is PVC especially prone to thermal degradation, and how is it stabilized?",
      options: [
        { label: "a", text: "PVC depolymerizes rapidly toward vinyl chloride at room temperature, so refrigeration is needed to keep it stable." },
        { label: "b", text: "PVC's main thermal failure is oxidation by water alone, so excluding moisture removes the need for heat stabilizers." },
        { label: "c", text: "PVC can be melt-processed without stabilizers because its backbone has no thermally labile bonds." },
        { label: "d", text: "Labile sites release autocatalytic HCl; calcium/zinc soaps or organotins suppress dehydrochlorination." }
      ],
      answer: "d",
      why: "**Dehydrochlorination** destroys a labile C–Cl bond, releasing HCl that catalyses the next loss — a self-accelerating 'unzipping' that forms coloured polyenes. **Thermal stabilizers** (organotin, mixed-metal soaps) substitute the labile chlorine and mop up HCl.",
      concept: "HCl autcatalysis ⇒ PVC needs thermal stabilizers",
      tags: ["confused"],
    },
    {
      id: "t9-12",
      type: "recall",
      diff: 1,
      text: "HALS (hindered amine light stabilizers) work mainly by:",
      options: [
        { label: "a", text: "acting as a plasticizer" },
        { label: "b", text: "cross-linking the surface" },
        { label: "c", text: "scavenging free radicals (via nitroxyl radicals) and regenerating themselves" },
        { label: "d", text: "absorbing UV and releasing heat" }
      ],
      answer: "c",
      why: "**HALS** are radical scavengers: the amine oxidizes to a nitroxyl radical that traps alkyl radicals, and the cycle regenerates the active species — making HALS unusually efficient per molecule.",
      concept: "HALS = regenerative radical trap · UV absorber = dissipates light",
      tags: ["confused"],
    },
        {
      "id": "t9-13",
      "type": "apply",
      "diff": 4,
      "text": "An outdoor rigid-PVC window profile must survive extrusion heat and years of sunlight. Which additive package best addresses both thermal degradation and UV exposure?",
      "options": [
        {
          "label": "a",
          "text": "TiO₂ pigment, impact modifier and plasticizer, but no dedicated package for both thermal and UV degradation."
        },
        {
          "label": "b",
          "text": "A Ca/Zn heat stabilizer plus processing lubricant, but no absorber/HALS component for long-term exposure to sunlight."
        },
        {
          "label": "c",
          "text": "A compatible thermal stabilizer, UV absorber/HALS package and processing lubricant selected for the PVC formulation."
        },
        {
          "label": "d",
          "text": "A UV absorber/HALS package and lubricant, but no heat stabilizer to reduce dehydrochlorination during hot extrusion."
        }
      ],
      "answer": "c",
      "why": "The formulation faces two distinct threats: heat-induced PVC dehydrochlorination during processing and photo-oxidation under sunlight. A compatible thermal stabilizer and UV package address both; lubricants support processing.",
      "distractors": {
        "b": "This addresses processing heat but leaves the outdoor UV threat unaddressed.",
        "d": "This addresses sunlight but leaves PVC vulnerable during hot processing.",
        "a": "Pigment and impact modification can help other properties but do not replace both stabilizer systems."
      },
      "concept": "Build additive packages around the degradation mechanisms the product must resist.",
      "tags": [
        "revision"
      ]
    },
    {
      id: "t9-14",
      type: "concept",
      diff: 2,
      text: "Which pair of polymers is most susceptible to hydrolytic degradation during long-term implant or marine exposure?",
      options: [
        { label: "a", text: "PS and PMMA" },
        { label: "b", text: "PLA and PET (both contain ester bonds)" },
        { label: "c", text: "PTFE" },
        { label: "d", text: "PE and PP (only C–C bonds)" }
      ],
      answer: "b",
      why: "**Ester bonds** hydrolyse (especially under acid/base or enzymatic catalysis), so polyesters — including biodegradable **PLA/PCL/PHB** and conventional **PET** — degrade hydrolytically. C–C backbone polymers (PE, PP, PS, PTFE) cannot be hydrolysed.",
      concept: "hydrolysable groups: ester, amide, carbonate, urethane",
      tags: ["revision"],
    },
    {
      id: "t9-15",
      type: "statement",
      diff: 2,
      text: "Which statement(s) about fillers and reinforcements is/are correct?",
      statements: [
        { num: 1, text: "CaCO₃ and talc are cheap fillers that lower cost and often raise stiffness." },
        { num: 2, text: "Glass fibre raises modulus and HDT substantially." },
        { num: 3, text: "A coupling agent (e.g. a silane) improves the bonding between hydrophilic glass and a non-polar polymer." },
        { num: 4, text: "Fillers normally lower the modulus." },
      ],
      options: [
        { label: "a", text: "1, 2, 3 and 4" },
        { label: "b", text: "4 only" },
        { label: "c", text: "1, 2 and 3 only" },
        { label: "d", text: "1 and 4 only" }
      ],
      answer: "c",
      why: "1–3 correct. Item 4 is false — rigid fillers/reinforcements **raise** modulus; they may reduce ductility and impact toughness, but not stiffness.",
      distractors: {
        a: "Item 4 confuses modulus (stiffness) with toughness.",
      },
      tags: ["confused"],
    },
    {
      id: "t9-16",
      type: "numerical",
      diff: 4,
      text: "A unidirectional carbon-fibre/epoxy ply: $E_f = 230$ GPa at $V_f = 0.60$; $E_m = 3.5$ GPa. The axial (Voigt) composite modulus is:",
      options: [
        { label: "a", text: "69 GPa" },
        { label: "b", text: "139 GPa" },
        { label: "c", text: "230 GPa" },
        { label: "d", text: "8.6 GPa" }
      ],
      answer: "b",
      why: "$E = 230(0.60) + 3.5(0.40) = 138 + 1.4 = \\mathbf{139.4}$ GPa — the fibre dominates axially, which is why aligned-fibre composites are so stiff along the fibre.",
      distractors: {
        a: "69 GPa is the 50/50 arithmetic intuition, ignoring the volume fractions.",
        d: "8.6 GPa resembles the transverse (Reuss) bound, where the soft matrix dominates.",
      },
      concept: "axial: Voigt bound · transverse: Reuss bound",
      tags: ["numeric", "formula"],
    },
    {
      id: "t9-17",
      type: "assertreason",
      diff: 3,
      assertion: "Adding 30% glass fibre to nylon increases its heat-deflection temperature.",
      reason: "Glass fibres are much stiffer than the matrix and bear a large share of the load, so the composite resists deflection to higher temperature.",
      options: [
        { label: "a", text: "Both A and R are true, but R is NOT the correct explanation of A" },
        { label: "b", text: "Both A and R are true, and R is the correct explanation of A" },
        { label: "c", text: "A is true, R is false" },
        { label: "d", text: "A is false, R is true" }
      ],
      answer: "b",
      why: "HDT is a **stiffness-under-load** test. Stiff fibres raise the composite modulus (Voigt bound), so the bar deflects less at a given temperature — the direct mechanism behind the higher HDT.",
      concept: "HDT ∝ composite stiffness",
      tags: ["revision"],
    },
    {
      id: "t9-18",
      type: "recall",
      diff: 1,
      text: "Which of these polymers is *biodegradable* by design?",
      options: [
        { label: "a", text: "Polyethylene" },
        { label: "b", text: "Poly(vinyl chloride)" },
        { label: "c", text: "Poly(lactic acid) (PLA)" },
        { label: "d", text: "Polystyrene" }
      ],
      answer: "c",
      why: "**PLA** (like PHB, PHBV, PCL and PBS) has a hydrolysable **ester backbone** that microorganisms/enzymes can ultimately break down. PE, PS and PVC have all-carbon backbones and persist for centuries.",
      tags: ["revision"],
    },
    {
      id: "t9-19",
      type: "sequence",
      diff: 3,
      text: "Order the stages of microbial biodegradation of a polymer: (1) bio-fragmentation into oligomers (2) biodeterioration at the surface (3) mineralization to CO₂/H₂O/biomass (4) assimilation into the microbial cell",
      options: [
        { label: "a", text: "4 → 1 → 2 → 3" },
        { label: "b", text: "1 → 2 → 3 → 4" },
        { label: "c", text: "2 → 4 → 1 → 3" },
        { label: "d", text: "2 → 1 → 4 → 3" }
      ],
      answer: "d",
      why: "**Biodeterioration** (surface colonization/attack) → **biofragmentation** (depolymerization to oligomers/monomers) → **assimilation** (uptake into cells) → **mineralization** (CO₂, H₂O, biomass).",
      tags: ["revision"],
    },
    {
      id: "t9-20",
      type: "concept",
      diff: 3,
      text: "Why does blending a small amount of a *hydrophilic* polymer into a *hydrophobic* commodity plastic often accelerate its environmental degradation?",
      options: [
        { label: "a", text: "A dispersed hydrophilic phase cannot change transport or stress in the hydrophobic matrix, so degradation stays unchanged." },
        { label: "b", text: "Hydrophilic domains absorb water, swell and create stress/pathways that promote fragmentation at interfaces." },
        { label: "c", text: "The additive catalyses cleavage of the hydrophobic backbone even without water, oxygen, light or biological activity." },
        { label: "d", text: "The blend becomes one dense, fully miscible phase with less exposed surface, accelerating complete mineralization." }
      ],
      answer: "b",
      why: "A water-loving phase creates **internal pathways and stresses** that fragment the hydrophobic matrix and expose surface area — the practical basis of 'pro-oxidant'/starch-blended degradable polyolefins (with the caveat that fragments may persist).",
      concept: "degradation design: create hydrolysable/internal-stress pathways",
      tags: ["confused"],
    },
    {
      id: "t9-21",
      type: "concept",
      diff: 2,
      text: "The Flory–Huggins interaction parameter χ determines miscibility. Which statement is correct?",
      options: [
        { label: "a", text: "As chain length rises, the critical χ approaches zero, so slight unfavorable enthalpy can cause phase separation." },
        { label: "b", text: "χ is purely entropic and remains constant with temperature, regardless of solvent quality or composition." },
        { label: "c", text: "Every polymer pair is miscible only when χ equals exactly zero, irrespective of chain length or structure." },
        { label: "d", text: "Large positive χ values favour mixing because they lower the free-energy penalty for keeping two polymers together." }
      ],
      answer: "a",
      why: "The critical $\\chi_c \\approx 0.5(1/\\sqrt{N_1} + 1/\\sqrt{N_2})^2$ shrinks toward zero as chain lengths grow — the mathematical reason **high-MW polymer pairs almost never mix** unless χ is slightly negative (specific interactions).",
      concept: "$\\chi_c \\propto 1/N$",
      tags: ["confused"],
    },
    {
      id: "t9-22",
      type: "apply",
      diff: 3,
      text: "A rigid PVC pipe formulation must be opacified, toughened cheaply and protected from UV in a tropical climate. A plausible additive package is:",
      options: [
        { label: "a", text: "Rutile TiO₂ supplies opacity and UV screening, an impact modifier adds toughness, and a heat stabilizer protects processing." },
        { label: "b", text: "A peroxide alone provides white colour and stabilizes the PVC backbone against sunlight and processing heat." },
        { label: "c", text: "Glass fibre alone gives opacity and low-cost impact toughness while preventing UV-driven discoloration outdoors." },
        { label: "d", text: "A plasticizer alone toughens rigid PVC and acts as a UV barrier, so a separate heat stabilizer is unnecessary." }
      ],
      answer: "a",
      why: "**TiO₂** provides opacity and screens UV; an **impact modifier** toughens rigid PVC; the **thermal stabilizer** guards PVC's weak point; antistatic aids handling. This is a realistic co-additive package.",
      concept: "formulation = base resin + threat-matched additives",
      tags: ["revision"],
    },
    {
      id: "t9-23",
      type: "compare",
      diff: 2,
      text: "Chain scission vs cross-linking during degradation — which pairing is correct?",
      options: [
        { label: "a", text: "Scission shortens chains and lowers MW/toughness; cross-linking joins chains into a network and can reduce solubility." },
        { label: "b", text: "Scission builds a permanent network, while cross-linking cleaves the backbone and rapidly lowers molecular weight." },
        { label: "c", text: "They are two names for the same reaction, with no systematic difference in molecular weight or gel formation." },
        { label: "d", text: "Both processes usually increase solubility because they remove constraints on motion between neighbouring chains." }
      ],
      answer: "a",
      why: "**Scission** lowers MW (embrittlement, tackiness); **cross-linking** raises network density (stiffening, insolubility). Which one dominates decides whether aged PE, for example, embrittles by scission or hardens by cross-linking.",
      concept: "two competing degradation outcomes",
      tags: ["confused"],
    },
    {
      id: "t9-24",
      type: "higher",
      diff: 4,
      text: "A bottle maker switches from monolayer PET to a PET/EVOH/PET multilayer structure. The functional reason is:",
      options: [
        { label: "a", text: "PET provides structure and clarity; the EVOH core supplies a strong oxygen barrier protected by PET outer layers." },
        { label: "b", text: "PET alone cannot retain carbonation at normal packaging pressures, so EVOH is added mainly as a carbon-dioxide barrier." },
        { label: "c", text: "EVOH is chosen because it is cheaper than PET and can replace the structural layer without losing stiffness." },
        { label: "d", text: "EVOH forms the scratch-resistant outer surface and provides clarity, while PET supplies the main oxygen barrier." }
      ],
      answer: "a",
      why: "Each layer contributes a property: **PET** = structure, clarity, moisture barrier; **EVOH** = excellent O₂ barrier (but moisture-sensitive); a tie layer or careful structure protects it. This is the standard multilayer barrier design logic.",
      concept: "multilayer = function per layer, not just cost",
      tags: ["confused"],
    },
  ],
};

export default T9;
