import type { TopicSource } from "../../mt203/types";

/**
 * MT203 — Topic 9: Polymer Blends, Composites & Degradation
 * Source: Module 2 §6–7. 35 questions.
 */
const T9: TopicSource = {
  id: "t9",
  module: "m2",
  title: "Blends, Composites & Degradation",
  subtitle: "Topic 9 · mixing rules, compatibilization and how polymers fail",
  subs: [
    { id: "T9.1", title: "Blend miscibility and thermodynamics" },
    { id: "T9.2", title: "Mixing rules and compatibilization" },
    { id: "T9.3", title: "Rubber toughening" },
    { id: "T9.4", title: "Reinforcement and composites" },
    { id: "T9.5", title: "Polymer modification" },
    { id: "T9.6", title: "Degradation and stabilization" },
    { id: "T9.7", title: "Biodegradable and sustainable polymers" },
  ],
  questions: [
    {
      id: "t9-01",
      type: "recall",
      diff: 1,
      text: "For a homogeneous polymer blend at a given composition to be locally stable against small composition fluctuations, the Gibbs free energy of mixing must satisfy:",
      options: [
        { label: "a", text: "$\\Delta S_{mix} = 0$" },
        { label: "b", text: "$\\Delta G_{mix} > 0$" },
        { label: "c", text: "$\\Delta G_{mix} < 0$ and $\\partial^2\\Delta G/\\partial\\phi^2 > 0$" },
        { label: "d", text: "$\\Delta H_{mix} = 0$ only" }
      ],
      answer: "c",
      why: "A negative $\\Delta G_{mix}$ makes mixing favourable relative to the unmixed state, while positive curvature ($\\partial^2\\Delta G/\\partial\\phi^2>0$) indicates local stability against small composition fluctuations. This curvature condition is local; global single-phase miscibility requires the free-energy curve to remain below the phase-separated common-tangent construction over the relevant composition range.",
      concept: "$\\Delta G = \\Delta H - T\\Delta S$ + curvature condition",
      tags: ["revision"],
    },
    {
      id: "t9-02",
      type: "concept",
      diff: 3,
      text: "Why are most pairs of polymers immiscible even when the corresponding small molecules would mix?",
      options: [
        {
            label: "a",
            text: "They have identical solubility parameters.",
        },
        {
            label: "b",
            text: "The entropy of mixing is very small because each molecule is huge, so a slightly unfavourable ΔH is enough to cause phase separation.",
        },
        {
            label: "c",
            text: "Polymers are chemically inert.",
        },
        {
            label: "d",
            text: "They are always cross-linked.",
        }
      ],
      answer: "b",
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
        {
            label: "a",
            text: "A hydrogen-bond donor blended with a hydrogen-bond acceptor, such as poly(vinyl phenol) with PMMA, whose carbonyl groups accept hydrogen bonds.",
        },
        {
            label: "b",
            text: "Two highly cross-linked networks",
        },
        {
            label: "c",
            text: "A non-polar polyolefin blended with a polar polyamide",
        },
        {
            label: "d",
            text: "Two polymers of very different solubility parameters",
        }
      ],
      answer: "a",
      why: "**Specific interactions** (hydrogen bonding, donor–acceptor interactions or strong dipolar interactions) can make the enthalpy of mixing sufficiently favourable to offset the small entropy of mixing. Poly(vinyl phenol)/PMMA is a classic hydrogen-bonding example; two already cross-linked networks cannot mix at the molecular level.",
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
        { label: "b", text: "0.96 g/cm³" },
        { label: "c", text: "0.99 g/cm³" },
        { label: "d", text: "0.90 g/cm³" }
      ],
      answer: "b",
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
      text: "Assume continuous, aligned glass fibres, perfect fibre–matrix bonding and loading parallel to the fibres. Using the parallel (Voigt) rule $E = \\phi_fE_f + \\phi_mE_m$, estimate the modulus for 40 vol% glass fibre ($E_f = 70$ GPa) in nylon ($E_m = 3$ GPa):",
      options: [
        { label: "a", text: "36.5 GPa" },
        { label: "b", text: "70 GPa" },
        { label: "c", text: "14.8 GPa" },
        { label: "d", text: "29.8 GPa" }
      ],
      answer: "d",
      why: "$E = 0.4(70) + 0.6(3) = 28 + 1.8 = \\mathbf{29.8}$ GPa — the **upper (Voigt) bound** for continuous aligned reinforcement.",
      distractors: {
        c: "14.8 GPa would need 20 vol% fibre.",
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
        {
            label: "a",
            text: "Cross-links the interface covalently in all cases.",
        },
        {
            label: "b",
            text: "Raises the melting point of both phases.",
        },
        {
            label: "c",
            text: "Acts as a surfactant — one block is miscible with A and the other with B, anchoring the two phases and stabilizing the interface.",
        },
        {
            label: "d",
            text: "Dissolves completely in A.",
        }
      ],
      answer: "c",
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
        {
            label: "a",
            text: "raising the Tg of PS",
        },
        {
            label: "b",
            text: "initiating crazing and shear yielding that absorb impact energy",
        },
        {
            label: "c",
            text: "increasing the crystallinity of PS",
        },
        {
            label: "d",
            text: "dissolving in the PS matrix",
        }
      ],
      answer: "b",
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
        ["1", "Thermal", "", "(i) heat-induced bond breakdown or elimination (e.g. PVC dehydrochlorination: HCl loss and polyene formation)"],
        ["2", "Photo-oxidative", "", "(ii) UV + O₂ via radical chain reactions"],
        ["3", "Hydrolytic", "", "(iii) water attack on ester/amide bonds"],
        ["4", "Mechanical", "", "(iv) repeated stressing/abrasion during processing"],
      ],
      options: [
        { label: "a", text: "1-i, 2-ii, 3-iii, 4-iv" },
        { label: "b", text: "1-iii, 2-iv, 3-i, 4-ii" },
        { label: "c", text: "1-i, 2-ii, 3-iv, 4-iii" },
        { label: "d", text: "1-ii, 2-i, 3-iv, 4-iii" }
      ],
      answer: "a",
      why: "Thermal degradation includes heat-induced bond breakdown and elimination reactions. In PVC, the characteristic early process is dehydrochlorination: HCl is eliminated and conjugated polyene sequences form; it should not be described simply as ordinary backbone chain scission. Photo-oxidative degradation involves UV and oxygen-driven radical reactions; hydrolysis attacks susceptible ester/amide bonds; mechanical degradation arises from repeated stress or abrasion.",
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
        { label: "b", text: "4 only" },
        { label: "c", text: "1, 2 and 3 only" },
        { label: "d", text: "1, 2, 3 and 4" }
      ],
      answer: "c",
      why: "1–3 correct. Item 4 is false: although PE has no intrinsic chromophore, trace **carbonyls or catalyst residues** absorb UV and initiate chain scission/cross-linking — hence outdoor polyolefins still need stabilizers.",
      distractors: {
        d: "Item 4 ignores the trace chromophores that make polyolefins photo-degradable.",
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
        {
            label: "a",
            text: "Both are UV absorbers.",
        },
        {
            label: "b",
            text: "Neither is used in polymers.",
        },
        {
            label: "c",
            text: "Primary (hindered phenols/amines) scavenge free radicals; secondary (phosphites/thioethers) decompose hydroperoxides non-radically.",
        },
        {
            label: "d",
            text: "Primary decompose hydroperoxides; secondary scavenge radicals.",
        }
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
        {
            label: "a",
            text: "PVC oxidizes only in water.",
        },
        {
            label: "b",
            text: "Allylic/tertiary C–Cl sites zip off as HCl (dehydrochlorination), the liberated HCl autocatalyzes further degradation, and polyene sequences discolour the polymer. Metal soaps (Ca/Zn) or organotins remove HCl and repair labile sites.",
        },
        {
            label: "c",
            text: "PVC depolymerizes at room temperature.",
        },
        {
            label: "d",
            text: "PVC needs no stabilizer.",
        }
      ],
      answer: "b",
      why: "PVC undergoes dehydrochlorination at labile sites: HCl is eliminated and the resulting conjugated polyene sequences cause discoloration. The liberated HCl can accelerate further degradation. Stabilizer mechanisms vary: some systems neutralize or scavenge HCl, while others also replace or passivate labile chlorine sites. The exact mechanism depends on the stabilizer package.",
      concept: "HCl autocatalysis ⇒ PVC needs thermal stabilizers",
      tags: ["confused"],
    },
    {
      id: "t9-12",
      type: "recall",
      diff: 1,
      text: "HALS (hindered amine light stabilizers) work mainly by:",
      options: [
        { label: "a", text: "scavenging free radicals (via nitroxyl radicals) and regenerating themselves" },
        { label: "b", text: "absorbing UV and releasing heat" },
        { label: "c", text: "acting as a plasticizer" },
        { label: "d", text: "cross-linking the surface" }
      ],
      answer: "a",
      why: "**HALS** are radical scavengers: the amine oxidizes to a nitroxyl radical that traps alkyl radicals, and the cycle regenerates the active species — making HALS unusually efficient per molecule.",
      concept: "HALS = regenerative radical trap · UV absorber = dissipates light",
      tags: ["confused"],
    },
    {
      id: "t9-13",
      type: "apply",
      diff: 4,
      text: "An outdoor rigid-PVC window profile must survive extrusion heat and years of sunlight. Which additive package best addresses both thermal degradation and UV exposure?",
      options: [
        {
            label: "a",
            text: "A Ca/Zn heat stabilizer plus processing lubricant, but no absorber/HALS component for long-term exposure to sunlight.",
        },
        {
            label: "b",
            text: "A UV absorber/HALS package and lubricant, but no heat stabilizer to reduce dehydrochlorination during hot extrusion.",
        },
        {
            label: "c",
            text: "TiO₂ pigment, impact modifier and plasticizer, but no dedicated package for both thermal and UV degradation.",
        },
        {
            label: "d",
            text: "A compatible thermal stabilizer, UV absorber/HALS package and processing lubricant selected for the PVC formulation.",
        }
      ],
      answer: "d",
      why: "The formulation faces two distinct threats: heat-induced PVC dehydrochlorination during processing and photo-oxidation under sunlight. A compatible thermal stabilizer and UV package address both; lubricants support processing.",
      concept: "Build additive packages around the degradation mechanisms the product must resist.",
      tags: [
        "revision"
      ],
      distractors: {
        a: "This addresses processing heat but leaves the outdoor UV threat unaddressed.",
        b: "This addresses sunlight but leaves PVC vulnerable during hot processing.",
        c: "Pigment and impact modification can help other properties but do not replace both stabilizer systems.",
      },
    },
    {
      id: "t9-14",
      type: "concept",
      diff: 2,
      text: "Which pair contains hydrolysable ester linkages and can undergo hydrolytic chain scission under suitable conditions?",
      options: [
        {
            label: "a",
            text: "PLA and PET (both contain ester bonds)",
        },
        {
            label: "b",
            text: "PTFE",
        },
        {
            label: "c",
            text: "PE and PP (only C–C bonds)",
        },
        {
            label: "d",
            text: "PS and PMMA",
        }
      ],
      answer: "a",
      why: "**Ester linkages** can undergo hydrolysis, especially under acidic, alkaline or enzymatic conditions. PLA is designed for hydrolytic/biological breakdown under suitable conditions; PET also contains ester bonds but is generally much more hydrolysis-resistant. C–C backbone polymers such as PE, PP and PS do not undergo backbone hydrolysis.",
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
        { label: "b", text: "1, 2 and 3 only" },
        { label: "c", text: "4 only" },
        { label: "d", text: "1 and 2 only" }
      ],
      answer: "d",
      why: "Statements 1 and 2 are correct: mineral fillers such as CaCO₃ and talc often reduce cost and increase stiffness, while glass fibres can raise modulus and HDT. Statement 3 is too broad: a silane's organic functionality must be compatible or reactive with the polymer matrix; a generic silane does not automatically couple hydrophilic glass to every non-polar polymer. Statement 4 is false because rigid fillers generally raise, not lower, modulus.",
      distractors: {
        a: "Includes statement 3, whose broad claim about silane coupling to any non-polar matrix is not justified, and statement 4, which reverses the usual stiffness effect of rigid fillers.",
        b: "Includes statement 3, which needs a matrix-compatible organofunctional silane rather than a generic coupling-agent claim.",
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
        { label: "a", text: "A is false, R is true" },
        { label: "b", text: "Both A and R are true, but R is NOT the correct explanation of A" },
        { label: "c", text: "Both A and R are true, and R is the correct explanation of A" },
        { label: "d", text: "A is true, R is false" }
      ],
      answer: "c",
      why: "HDT is a **stiffness-under-load** test. Stiff fibres raise the composite modulus (Voigt bound), so the bar deflects less at a given temperature — the direct mechanism behind the higher HDT.",
      concept: "HDT ∝ composite stiffness",
      tags: ["revision"],
    },
    {
      id: "t9-18",
      type: "recall",
      diff: 1,
      text: "Which of these polymers is designed to be biodegradable under suitable industrial composting or controlled biodegradation conditions?",
      options: [
        {
            label: "a",
            text: "Polyethylene",
        },
        {
            label: "b",
            text: "Polystyrene",
        },
        {
            label: "c",
            text: "Poly(vinyl chloride)",
        },
        {
            label: "d",
            text: "Poly(lactic acid) (PLA)",
        }
      ],
      answer: "d",
      why: "**PLA** has a hydrolysable **ester backbone** and can be biodegraded under suitable industrial composting or controlled conditions. It does not necessarily break down rapidly in ordinary soil, freshwater or marine environments; PE, PS and PVC are generally persistent in those conditions.",
      tags: ["revision"],
    },
    {
      id: "t9-19",
      type: "sequence",
      diff: 3,
      text: "Order the stages of microbial biodegradation of a polymer: (1) bio-fragmentation into oligomers (2) biodeterioration at the surface (3) mineralization to CO₂/H₂O/biomass (4) assimilation into the microbial cell",
      options: [
        { label: "a", text: "2 → 1 → 4 → 3" },
        { label: "b", text: "4 → 1 → 2 → 3" },
        { label: "c", text: "2 → 4 → 1 → 3" },
        { label: "d", text: "1 → 2 → 3 → 4" }
      ],
      answer: "a",
      why: "**Biodeterioration** (surface colonization/attack) → **biofragmentation** (depolymerization to oligomers/monomers) → **assimilation** (uptake into cells) → **mineralization** (CO₂, H₂O, biomass).",
      tags: ["revision"],
    },
    {
      id: "t9-20",
      type: "concept",
      diff: 3,
      text: "Why can blending a small amount of a *hydrophilic* polymer into a *hydrophobic* commodity plastic accelerate its physical disintegration in a moist environment?",
      options: [
        {
            label: "a",
            text: "The hydrophilic domains absorb water and swell, building internal stress and letting micro-organisms/enzymes access the interface, fragmenting the matrix.",
        },
        {
            label: "b",
            text: "The blend raises the melting point.",
        },
        {
            label: "c",
            text: "It has no effect.",
        },
        {
            label: "d",
            text: "Hydrophilic polymers emit UV radiation.",
        }
      ],
      answer: "a",
      why: "A water-loving phase absorbs water and swells, creating **internal pathways and stresses** that can fragment the hydrophobic matrix and expose more surface area. This can accelerate disintegration, but it does not prove that the polyolefin itself has been biodegraded or mineralized; persistent fragments may remain.",
      concept: "degradation design: create hydrolysable/internal-stress pathways",
      tags: ["confused"],
    },
    {
      id: "t9-21",
      type: "concept",
      diff: 2,
      text: "The Flory–Huggins interaction parameter χ determines miscibility. Which statement is correct?",
      options: [
        {
            label: "a",
            text: "χ is independent of temperature.",
        },
        {
            label: "b",
            text: "Miscibility requires χ > 10.",
        },
        {
            label: "c",
            text: "For polymers of comparable chain length N, miscibility requires χ below a critical value that scales approximately as 1/N, so high-MW pairs are harder to mix than low-MW ones.",
        },
        {
            label: "d",
            text: "χ is always zero.",
        }
      ],
      answer: "c",
      why: "Within the simple binary Flory–Huggins lattice model, the critical interaction parameter is $\\chi_c=\\tfrac12(1/\\sqrt{N_1}+1/\\sqrt{N_2})^2$. For comparable chain lengths it scales approximately as $1/N$, so the entropy-of-mixing contribution becomes small as chain length increases. This is a model result; specific interactions, composition dependence of χ and real blend morphology can affect observed miscibility.",
      concept: "$\\chi_c \\propto 1/N$",
      tags: ["confused"],
    },
    {
      id: "t9-22",
      type: "apply",
      diff: 3,
      text: "A rigid PVC pipe formulation must be opacified, toughened cheaply and protected from UV in a tropical climate. A plausible additive package is:",
      options: [
        {
            label: "a",
            text: "A peroxide only",
        },
        {
            label: "b",
            text: "Plasticizer only",
        },
        {
            label: "c",
            text: "Glass fibre only",
        },
        {
            label: "d",
            text: "Surface-treated rutile TiO₂ (opacity + UV screening) + impact modifier (e.g. CPE/ACR) + PVC thermal stabilizer and processing lubricant",
        }
      ],
      answer: "d",
      why: "**Surface-treated rutile TiO₂** provides opacity and helps screen UV; an **impact modifier** toughens rigid PVC; the **thermal stabilizer** protects against dehydrochlorination during processing; a suitable lubricant supports extrusion.",
      concept: "formulation = base resin + threat-matched additives",
      tags: ["revision"],
    },
    {
      id: "t9-23",
      type: "compare",
      diff: 2,
      text: "Chain scission vs cross-linking during degradation — which pairing is correct?",
      options: [
        {
            label: "a",
            text: "They are identical processes.",
        },
        {
            label: "b",
            text: "Scission builds networks; cross-linking shortens chains.",
        },
        {
            label: "c",
            text: "Both increase solubility.",
        },
        {
            label: "d",
            text: "Scission shortens chains (MW and toughness fall); cross-linking builds a brittle network (hardening, reduced solubility). Both often occur together, one dominating.",
        }
      ],
      answer: "d",
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
        {
            label: "a",
            text: "EVOH improves clarity.",
        },
        {
            label: "b",
            text: "PET gives strength/clarity, while the thin EVOH layer provides a much better O₂ barrier to extend shelf life; PET protects the moisture-sensitive EVOH.",
        },
        {
            label: "c",
            text: "PET alone cannot hold carbonation.",
        },
        {
            label: "d",
            text: "EVOH is cheaper than PET.",
        }
      ],
      answer: "b",
      why: "PET supplies structural strength and clarity; EVOH provides a strong oxygen barrier, especially under dry conditions, but its barrier performance falls as moisture uptake increases. A practical multilayer design therefore needs moisture-protective outer layers and, where the polymers are not directly compatible, suitable tie layers to maintain adhesion. The exact layer arrangement depends on the package and service environment.",
      concept: "multilayer = function per layer, not just cost",
      tags: ["confused"],
    },
    {
      id: "t9-25",
      type: "apply",
      diff: 3,
      text: "An EVA copolymer is reformulated with a higher vinyl-acetate content. Based on the lecture's polymer-modification examples, which trend is expected?",
      options: [
        { label: "a", text: "The material becomes progressively softer and more flexible." },
        { label: "b", text: "It must become a highly cross-linked thermoset." },
        { label: "c", text: "Its backbone changes into polyethylene oxide." },
        { label: "d", text: "Its molecular weight must become exactly twice as large." }
      ],
      answer: "a",
      why: "The lecture uses EVA to show that **copolymer composition can tune properties**: increasing vinyl-acetate content shifts the material from semi-rigid toward softer, more flexible behaviour.",
      distractors: {
        b: "Changing comonomer composition is not the same as introducing a dense covalent network.",
        c: "Adding vinyl-acetate units does not replace the backbone with polyethylene oxide.",
        d: "Comonomer content alone does not prescribe an exact doubling of molecular weight."
      },
      concept: "Copolymer composition is a polymer-modification variable.",
      tags: ["revision"]
    },
    {
      id: "t9-26",
      type: "compare",
      diff: 3,
      text: "Which description correctly distinguishes grafting from physical blending as a polymer-modification route?",
      options: [
        { label: "a", text: "Grafting is simply remelting two polymers together, while blending always forms covalent bonds." },
        { label: "b", text: "Grafting attaches side chains to an existing polymer backbone; physical blending mixes polymers without covalently attaching the components." },
        { label: "c", text: "Both terms mean that the original polymer chains are completely depolymerized to monomers." },
        { label: "d", text: "Grafting can only occur between two inorganic fillers." }
      ],
      answer: "b",
      why: "The lesson defines **grafting** as attaching side chains to an existing backbone. Physical blending combines polymer phases without requiring covalent attachment; a graft/block copolymer may instead act as a compatibilizer.",
      distractors: {
        a: "This reverses the definitions: blending does not inherently create covalent bonds.",
        c: "Neither process requires complete depolymerization to monomers.",
        d: "The lecture's example, maleic-anhydride-grafted PP, is a polymer-backbone modification."
      },
      concept: "Grafting changes chain architecture; blending combines polymer phases.",
      tags: ["confused"]
    },
    {
      id: "t9-27",
      type: "apply",
      diff: 4,
      text: "A polyethylene component must resist creep and solvent swelling at elevated service temperature. Cross-linking is introduced. Which trade-off should the designer expect?",
      options: [
        { label: "a", text: "Lower network connectivity and easier melt flow during every heating cycle." },
        { label: "b", text: "Guaranteed improvement in transparency with no effect on processing." },
        { label: "c", text: "Improved dimensional/thermal and solvent resistance, but loss of ordinary thermoplastic remelt-reprocessability." },
        { label: "d", text: "Complete removal of all chain entanglements without formation of covalent bridges." }
      ],
      answer: "c",
      why: "The lesson states that cross-linking introduces covalent bridges, improving **use-temperature, creep and solvent resistance**. Once a permanent network forms, the material cannot be reprocessed by ordinary thermoplastic melting.",
      distractors: {
        a: "Cross-linking restricts chain motion; it does not make the network flow like an uncross-linked melt.",
        b: "Transparency is not the stated design consequence, and cross-linking changes processing behaviour.",
        d: "Cross-linking creates covalent bridges between chains; it does not remove entanglements as described."
      },
      concept: "Cross-link density trades reprocessability for network stability.",
      tags: ["confused"]
    },
    {
      id: "t9-28",
      type: "apply",
      diff: 3,
      text: "A manufacturer must recover material from two waste streams: one is a remouldable thermoplastic and the other is a cured thermoset. Which route best follows the lecture's recycling distinction?",
      options: [
        { label: "a", text: "Remelt both materials repeatedly because both contain polymer chains." },
        { label: "b", text: "Use mechanical remelting only for the thermoset and chemical recycling only for the thermoplastic." },
        { label: "c", text: "Neither material can be recovered in any form." },
        { label: "d", text: "Remelt and reprocess the thermoplastic; consider chemical breakdown or use the thermoset as a ground filler." }
      ],
      answer: "d",
      why: "Thermoplastics can be **remelted and mechanically reprocessed**. A cured thermoset cannot be remelted into its original flowable state; the lesson lists grinding for filler use and chemical routes such as glycolysis or solvolysis.",
      distractors: {
        a: "A cured thermoset has a permanent network and decomposes rather than flowing on reheating.",
        b: "This reverses the main routes described in the lesson.",
        c: "The lesson explicitly identifies mechanical and chemical recovery options."
      },
      concept: "Thermoplastic mechanical recycling vs thermoset recovery.",
      tags: ["revision"]
    },
    {
      "id": "t9-29",
      "type": "match",
      "diff": 2,
      "text": "Match each matrix-based composite abbreviation with the matrix material identified in the lecture.",
      "tableRows": [
        [
          "1",
          "Composite",
          "",
          "(i) two or more chemically distinct, insoluble phases with a recognizable interface"
        ],
        [
          "2",
          "MMC",
          "",
          "(ii) metal matrix"
        ],
        [
          "3",
          "CMC",
          "",
          "(iii) ceramic matrix"
        ],
        [
          "4",
          "PMC / OMC",
          "",
          "(iv) polymer or organic matrix"
        ]
      ],
      "options": [
        {
          "label": "a",
          "text": "1–ii, 2–i, 3–iii, 4–iv"
        },
        {
          "label": "b",
          "text": "1–i, 2–iii, 3–ii, 4–iv"
        },
        {
          "label": "c",
          "text": "1–iv, 2–ii, 3–i, 4–iii"
        },
        {
          "label": "d",
          "text": "1–i, 2–ii, 3–iii, 4–iv"
        }
      ],
      "answer": "d",
      "why": "The lecture defines a composite as two or more chemically distinct, insoluble phases with a recognizable interface. It classifies composites by matrix as metal-matrix (MMC), ceramic-matrix (CMC) and polymer-matrix (PMC), also called organic-matrix composites (OMC).",
      "distractors": {
        "a": "This assigns the metal matrix to the composite definition and reverses the ceramic and polymer matrix classes.",
        "b": "This assigns the composite definition correctly but swaps the metal and ceramic matrix abbreviations.",
        "c": "This assigns the polymer matrix to the composite definition and misplaces the other three matches."
      },
      "concept": "Composite definition and matrix-based classification of MMC, CMC and PMC/OMC",
      "tags": [
        "reviewed",
        "revision"
      ],
      "qsLevel": 2,
      "sub": "T9.4",
      "misconceptions": {
        "a": {
          "tag": "misassigned-composite-definition",
          "kind": "conceptual"
        },
        "b": {
          "tag": "swapped-metal-and-ceramic-matrix",
          "kind": "conceptual"
        },
        "c": {
          "tag": "misidentified-polymer-matrix",
          "kind": "conceptual"
        }
      },
      "qsScore": 94
    },
    {
      "id": "t9-30",
      "type": "concept",
      "diff": 3,
      "text": "For a fibre-reinforced polymer composite intended to carry tensile load along one direction, which design choice follows the lecture's guidance?",
      "options": [
        {
          "label": "a",
          "text": "Use long, high-aspect-ratio fibres, a suitable fibre amount, a strong interface and alignment parallel to the applied load."
        },
        {
          "label": "b",
          "text": "Use short, low-aspect-ratio fibres, a weak interface and orientation perpendicular to the applied load."
        },
        {
          "label": "c",
          "text": "Use long fibres with a weak interface so the matrix prevents load transfer into the reinforcement."
        },
        {
          "label": "d",
          "text": "Use large-diameter fibres with random orientation so surface imperfections carry more of the applied load."
        }
      ],
      "answer": "a",
      "why": "The lecture identifies length, diameter, orientation, amount, constituent properties, bonding and manufacturing method as design factors. A large aspect ratio improves strength, long fibres reduce the relative influence of their ends, and long fibres parallel to the applied load give the greatest strength in the stated direction.",
      "distractors": {
        "b": "Short fibres and perpendicular alignment do not follow the source's stated preference for long, load-parallel reinforcement.",
        "c": "A weak interface obstructs the transfer of load from the matrix into the reinforcing fibres.",
        "d": "The slide links smaller fibre diameter with fewer surface flaws and identifies parallel orientation as the strongest direction."
      },
      "concept": "FRP design factors: aspect ratio, fibre length, interface and orientation",
      "tags": [
        "reviewed",
        "revision"
      ],
      "qsLevel": 3,
      "sub": "T9.4",
      "misconceptions": {
        "b": {
          "tag": "reversed-fibre-length-and-orientation",
          "kind": "conceptual"
        },
        "c": {
          "tag": "misunderstood-load-transfer",
          "kind": "conceptual"
        },
        "d": {
          "tag": "misread-diameter-and-orientation-effects",
          "kind": "conceptual"
        }
      },
      "qsScore": 93
    },
    {
      "id": "t9-31",
      "type": "concept",
      "diff": 2,
      "text": "Which statement matches the lecture's description of polymer degradation and the term aging?",
      "options": [
        {
          "label": "a",
          "text": "It is a change in molecular weight caused by heat during processing, while tensile strength, colour and shape remain unchanged."
        },
        {
          "label": "b",
          "text": "It is a reversible change in specimen shape during loading that disappears when the applied force is removed after unloading."
        },
        {
          "label": "c",
          "text": "It is a change in properties such as tensile strength, colour or shape under environmental factors; these changes are termed aging."
        },
        {
          "label": "d",
          "text": "It is a change limited to biological breakdown and is generally beneficial during ordinary product service and storage."
        }
      ],
      "answer": "c",
      "why": "The lecture defines degradation as a change in properties such as tensile strength, colour and shape under environmental factors including heat, light and chemicals. It states that these property changes are often termed aging; they are usually undesirable, although biodegradation or deliberate molecular-weight reduction can be desirable.",
      "distractors": {
        "a": "The source definition includes several product properties and environmental factors, not molecular weight during processing alone.",
        "b": "This describes recoverable mechanical deformation, rather than the environmental property changes called aging.",
        "d": "The lecture includes cracking and chemical disintegration as undesirable forms, alongside selected desirable degradation."
      },
      "concept": "Definition of polymer degradation and the lecture's use of aging",
      "tags": [
        "reviewed",
        "revision"
      ],
      "qsLevel": 2,
      "sub": "T9.6",
      "misconceptions": {
        "a": {
          "tag": "narrowed-degradation-to-molecular-weight",
          "kind": "conceptual"
        },
        "b": {
          "tag": "confused-with-elastic-deformation",
          "kind": "conceptual"
        },
        "d": {
          "tag": "confused-degradation-with-biodegradation-only",
          "kind": "conceptual"
        }
      },
      "qsScore": 92
    },
    {
      "id": "t9-32",
      "type": "graph",
      "diff": 3,
      "text": "The lecture's degradation graph plots molecular weight, strength and mass against time. Which sequence matches the order in which the three plotted quantities decline?",
      "options": [
        {
          "label": "a",
          "text": "Strength decreases first, followed by molecular weight, and mass declines after both."
        },
        {
          "label": "b",
          "text": "Molecular weight decreases first, strength decreases next, and mass declines last."
        },
        {
          "label": "c",
          "text": "Mass decreases first, strength decreases next, and molecular weight declines after both."
        },
        {
          "label": "d",
          "text": "Molecular weight and mass decrease together before the strength curve begins to fall."
        }
      ],
      "answer": "b",
      "why": "On the p.208 graph, the molecular-weight curve falls first, the strength curve follows, and the mass curve declines last. This is a reading of the source's qualitative plot, not a universal kinetic law for every polymer.",
      "distractors": {
        "a": "The plotted molecular-weight curve begins to fall before the strength curve in the lecture figure.",
        "c": "The mass curve is the last of the three curves to show its major decline in the source graph.",
        "d": "The graph shows separated declines rather than molecular weight and mass falling together."
      },
      "concept": "Qualitative order of molecular-weight, strength and mass decline in the source graph",
      "tags": [
        "reviewed",
        "revision"
      ],
      "qsLevel": 3,
      "sub": "T9.6",
      "misconceptions": {
        "a": {
          "tag": "reversed-molecular-weight-and-strength-order",
          "kind": "observation"
        },
        "c": {
          "tag": "misread-mass-curve-position",
          "kind": "observation"
        },
        "d": {
          "tag": "merged-distinct-curve-onsets",
          "kind": "observation"
        }
      },
      "qsScore": 94
    },
    {
      "id": "t9-33",
      "type": "match",
      "diff": 2,
      "text": "Match the four degradation categories with the examples printed under each heading on the lecture slide.",
      "tableRows": [
        [
          "1",
          "Photoinduced",
          "",
          "(i) depolymerization"
        ],
        [
          "2",
          "Thermal",
          "",
          "(ii) microorganisms"
        ],
        [
          "3",
          "Chemical",
          "",
          "(iii) light, UV, gamma and IR"
        ],
        [
          "4",
          "Biological",
          "",
          "(iv) pyrolysis, hydrogenation, grafting, ozonolysis and oxidation"
        ]
      ],
      "options": [
        {
          "label": "a",
          "text": "1–iv, 2–iii, 3–i, 4–ii"
        },
        {
          "label": "b",
          "text": "1–ii, 2–iv, 3–iii, 4–i"
        },
        {
          "label": "c",
          "text": "1–iii, 2–iv, 3–ii, 4–i"
        },
        {
          "label": "d",
          "text": "1–iii, 2–ii, 3–iv, 4–i"
        }
      ],
      "answer": "c",
      "why": "The p.209 slide lists photoinduced degradation with light, UV, gamma and IR; thermal degradation with pyrolysis, hydrogenation, grafting, ozonolysis and oxidation; chemical degradation with depolymerization; and biological degradation with microorganisms. The categories and examples here reproduce the slide as printed.",
      "distractors": {
        "a": "This places the chemical and biological examples under the wrong source headings and misassigns photoinduced degradation.",
        "b": "This assigns depolymerization to photoinduced degradation and places the radiation examples under chemical degradation.",
        "d": "This assigns the thermal examples to chemical degradation and the chemical example to the thermal heading."
      },
      "concept": "Source-listed examples for photoinduced, thermal, chemical and biological degradation",
      "tags": [
        "reviewed",
        "revision"
      ],
      "qsLevel": 2,
      "sub": "T9.6",
      "misconceptions": {
        "a": {
          "tag": "swapped-chemical-and-biological-examples",
          "kind": "observation"
        },
        "b": {
          "tag": "misassigned-photoinduced-examples",
          "kind": "observation"
        },
        "d": {
          "tag": "swapped-thermal-and-chemical-examples",
          "kind": "observation"
        }
      },
      "qsScore": 93
    },
    {
      "id": "t9-34",
      "type": "concept",
      "diff": 3,
      "text": "Which statement correctly combines the biodegradation mechanisms and the relative hydrolysis susceptibility order shown in the lecture?",
      "options": [
        {
          "label": "a",
          "text": "The slide lists enzymatic degradation and hydrolysis; the printed order is anhydride > ester > carbonate, with homogeneous and heterogeneous degradation also named."
        },
        {
          "label": "b",
          "text": "The slide lists oxidation and photolysis; the printed order is carbonate > ester > anhydride, with surface-limited degradation named."
        },
        {
          "label": "c",
          "text": "The slide lists chain scission and cross-linking; the printed order is ester > carbonate > anhydride, with thermal and chemical degradation named."
        },
        {
          "label": "d",
          "text": "The slide lists microbial growth; the printed order is anhydride > carbonate > ester, with homogeneous degradation excluded."
        }
      ],
      "answer": "a",
      "why": "Page 210 lists enzymatic degradation and hydrolysis. It states that hydrolysis depends on main-chain structure and prints the order anhydride > ester > carbonate; it also names homogeneous and heterogeneous degradation and notes the importance for biomedical applications.",
      "distractors": {
        "b": "Oxidation and photolysis are not the two mechanisms listed on the biodegradation slide, and the order is reversed.",
        "c": "The listed mechanism pair is enzymatic degradation and hydrolysis, not the stated chain-scission/cross-linking pair.",
        "d": "The source names both homogeneous and heterogeneous degradation and does not restrict the mechanism to microbial growth."
      },
      "concept": "Biodegradation mechanisms and the source's hydrolysis susceptibility order",
      "tags": [
        "reviewed",
        "revision"
      ],
      "qsLevel": 3,
      "sub": "T9.7",
      "misconceptions": {
        "b": {
          "tag": "confused-with-photo-thermal-degradation",
          "kind": "conceptual"
        },
        "c": {
          "tag": "confused-with-general-degradation-mechanisms",
          "kind": "conceptual"
        },
        "d": {
          "tag": "omitted-enzymatic-and-hydrolysis-modes",
          "kind": "conceptual"
        }
      },
      "qsScore": 92
    },
    {
      "id": "t9-35",
      "type": "concept",
      "diff": 2,
      "text": "Which statement accurately describes the recycling routes and the 1988 SPI coding system as presented in the lecture?",
      "options": [
        {
          "label": "a",
          "text": "The SPI system is a mandatory process standard prescribing chemical depolymerization for every polymer container and specifying its recycling route."
        },
        {
          "label": "b",
          "text": "The 1988 SPI system is a voluntary plastic-container resin-code system; the lecture separately lists incineration, mechanical recycling and innovative reuse."
        },
        {
          "label": "c",
          "text": "The SPI codes identify mechanical-strength grades for polymer products and replace the need to identify the resin family during sorting."
        },
        {
          "label": "d",
          "text": "The lecture lists remoulding as a chemical route and depolymerization as a mechanical remelting operation, with innovative reuse outside that route."
        }
      ],
      "answer": "b",
      "why": "The slide attributes a voluntary plastic-container coding system to the Society of the Plastics Industry in 1988. It separately lists incineration of combustible polymers, mechanical recycling by remoulding, blending or depolymerization, and finding innovative uses for used polymers. The code-3 wording differs between the source table and following chart, so this item does not rely on that disputed label.",
      "distractors": {
        "a": "The source calls the SPI system voluntary and does not describe it as a mandatory processing standard.",
        "c": "The table identifies plastic types by resin code rather than assigning mechanical-strength grades.",
        "d": "The slide groups remoulding and blending with mechanical recycling and lists depolymerization in that same route."
      },
      "concept": "1988 voluntary SPI resin coding and the lecture's listed recycling routes",
      "tags": [
        "reviewed",
        "revision"
      ],
      "qsLevel": 2,
      "sub": "T9.7",
      "misconceptions": {
        "a": {
          "tag": "misread-voluntary-coding-as-mandatory",
          "kind": "conceptual"
        },
        "c": {
          "tag": "confused-resin-identification-with-property-grading",
          "kind": "conceptual"
        },
        "d": {
          "tag": "reversed-recycling-route-classification",
          "kind": "conceptual"
        }
      },
      "qsScore": 92
    },
  ],
};

export default T9;
