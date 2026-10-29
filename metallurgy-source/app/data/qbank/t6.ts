import type { TopicSource } from "../../mt203/types";

/**
 * MT203 — Topic 6: Thermal Transitions (Tg, Tm, HDT)
 * Source: Module 3 §3 + Module 2 §5. 22 questions.
 */
const T6: TopicSource = {
  id: "t6",
  module: "m1",
  title: "Thermal Transitions: Tg, Tm & HDT",
  subtitle: "Topic 6 · why amorphous and crystalline regions soften differently",
  subs: [
    { id: "T6.1", title: "Tg: the glass transition" },
    { id: "T6.2", title: "Tm: first-order melting" },
    { id: "T6.3", title: "Factors affecting Tg and Tm" },
    { id: "T6.4", title: "HDT, Vicat and the service window" },
    { id: "T6.5", title: "Copolymers, plasticizers, Fox & Fox–Flory" },
  ],
  questions: [
    {
      id: "t6-01",
      type: "recall",
      diff: 1,
      text: "The glass-transition temperature Tg is the temperature at which:",
      options: [
        { label: "a", text: "Cross-links form" },
        { label: "b", text: "Amorphous regions change from a glassy, brittle state to a rubbery, leathery state" },
        { label: "c", text: "The polymer decomposes" },
        { label: "d", text: "Crystalline regions melt" }
      ],
      answer: "b",
      why: "**Tg** marks the onset of large-scale segmental motion in the amorphous phase: below Tg the chain segments are frozen (glass), above Tg they move (rubber). It involves no latent heat — a second-order-like transition.",
      distractors: {
        d: "Crystalline regions melt at **Tm**, which is always higher than Tg.",
      },
      tags: ["revision"],
    },
    {
      id: "t6-02",
      type: "compare",
      diff: 2,
      text: "Which statement correctly contrasts Tg and Tm?",
      options: [
        { label: "a", text: "Tm is a true first-order transition (latent heat, crystallites melt); Tg is a kinetic, second-order-like transition of the amorphous phase (no latent heat)." },
        { label: "b", text: "Both involve latent heat." },
        { label: "c", text: "Tg is first-order; Tm is second-order." },
        { label: "d", text: "Tg applies only to semi-crystalline polymers." }
      ],
      answer: "a",
      why: "Melting is **thermodynamic** (sharp, latent heat $\\Delta H_m$, only in semi-crystalline polymers). Glass transition is **kinetic** (a step in Cp, depends on cooling/heating rate, exists in all amorphous material).",
      distractors: {
        b: "Tg shows a step in heat capacity, not an endotherm.",
      },
      concept: "Tm: endotherm · Tg: Cp step",
      tags: ["confused"],
    },
    {
      id: "t6-03",
      type: "concept",
      diff: 3,
      text: "Which change would raise a polymer's Tg?",
      options: [
        { label: "a", text: "Introducing bulky side groups and stronger intermolecular interactions (e.g. H-bonding) that stiffen the chain" },
        { label: "b", text: "Lowering the molecular weight" },
        { label: "c", text: "Increasing free volume" },
        { label: "d", text: "Adding a plasticizer" }
      ],
      answer: "a",
      why: "Anything that **restricts segmental motion** raises Tg: bulky/stiff backbones, polar groups, H-bonding, cross-linking and higher MW. Plasticizers and free volume *lower* Tg.",
      concept: "Tg ↑ with chain stiffness, forces, cross-linking, MW",
      tags: ["revision"],
    },
    {
      id: "t6-04",
      type: "numerical",
      diff: 3,
      text: "Using the Fox equation, the Tg of a 50/50 (wt) blend of polymer A (Tg = 100 °C = 373 K) and polymer B (Tg = 200 °C = 473 K) is:",
      options: [
        { label: "a", text: "144 °C" },
        { label: "b", text: "150 °C" },
        { label: "c", text: "100 °C" },
        { label: "d", text: "123 °C" }
      ],
      answer: "a",
      why: "$\\dfrac{1}{T_g} = \\dfrac{w_A}{T_{gA}} + \\dfrac{w_B}{T_{gB}} = \\dfrac{0.5}{373} + \\dfrac{0.5}{473} = 0.001340 + 0.001057 = 0.002398$ → $T_g = 417$ K $= \\mathbf{144}$ °C.",
      distractors: {
        b: "150 °C is the simple arithmetic mean — the Fox equation is harmonic, so the result is lower.",
      },
      concept: "$1/T_g = \\sum w_i/T_{gi}$ (Fox)",
      tags: ["numeric", "formula"],
    },
    {
      id: "t6-05",
      type: "numerical",
      diff: 4,
      text: "By the Fox–Flory relation $T_g = T_g^\\infty - K/M_n$, with $T_g^\\infty = 373$ K and $K = 1.0\\times10^{5}$ K·g/mol, find Tg for $M_n = 10{,}000$ g/mol.",
      options: [
        { label: "a", text: "90 °C" },
        { label: "b", text: "87 °C" },
        { label: "c", text: "100 °C" },
        { label: "d", text: "98 °C" }
      ],
      answer: "a",
      why: "$T_g = 373 - \\dfrac{1.0\\times10^5}{10{,}000} = 373 - 10 = 363$ K $= \\mathbf{90}$ °C.",
      distractors: {
        c: "100 °C is the $\\infty$-MW limit; finite chains always have a lower Tg.",
        d: "98 °C corresponds to $M_n = 50{,}000$.",
      },
      concept: "$T_g = T_g^\\infty - K/M_n$ (free volume from chain ends)",
      tags: ["numeric", "formula"],
    },
    {
      id: "t6-06",
      type: "recall",
      diff: 1,
      text: "Which polymer has the lowest Tg?",
      options: [
        { label: "a", text: "Poly(vinyl chloride) (~80 °C)" },
        { label: "b", text: "Polystyrene (~100 °C)" },
        { label: "c", text: "Polyethylene (~ −120 °C)" },
        { label: "d", text: "Poly(methyl methacrylate) (~105 °C)" }
      ],
      answer: "c",
      why: "**Polyethylene** has the most flexible backbone (no side groups, only C–C and C–H) → Tg ≈ −120 °C. Bulky side groups (phenyl, methyl, Cl) raise Tg.",
      tags: ["revision"],
    },
    {
      id: "t6-07",
      type: "concept",
      diff: 2,
      text: "How does a plasticizer lower a polymer's Tg?",
      options: [
        { label: "a", text: "By raising the melting point." },
        { label: "b", text: "By forming cross-links." },
        { label: "c", text: "By increasing free volume — small molecules sit between chains, spacing them apart and easing segmental motion." },
        { label: "d", text: "By increasing crystallinity." }
      ],
      answer: "c",
      why: "Plasticizer molecules **shield inter-chain attractions and add free volume**, so segments move at lower temperature → Tg and HDT fall and flexibility rises (the PVC ↔ plasticized-PVC contrast).",
      distractors: {
        d: "Plasticizers usually *lower* crystallinity too.",
      },
      concept: "free volume ↑ → Tg ↓",
      tags: ["revision"],
    },
    {
      id: "t6-08",
      type: "match",
      diff: 2,
      text: "In dynamic mechanical analysis, match each quantity with its meaning.",
      tableRows: [
        ["1", "E′ (storage modulus)", "", "(i) elastic energy stored, in phase"],
        ["2", "E″ (loss modulus)", "", "(ii) energy dissipated as heat, out of phase"],
        ["3", "tan δ", "", "(iii) E″/E′, damping; peaks at Tg"],
        ["4", "Tg from DMA", "", "(iv) temperature of the tan-δ peak"],
      ],
      options: [
        { label: "a", text: "1-ii, 2-i, 3-iv, 4-iii" },
        { label: "b", text: "1-i, 2-ii, 3-iii, 4-iv" },
        { label: "c", text: "1-iii, 2-iv, 3-i, 4-ii" },
        { label: "d", text: "1-i, 2-ii, 3-iv, 4-iii" }
      ],
      answer: "b",
      why: "E′ = elastic/in-phase, E″ = viscous/out-of-phase, tan δ = E″/E′ = damping, and the **tan-δ maximum defines Tg** by DMA.",
      tags: ["revision"],
    },
    {
      id: "t6-09",
      type: "graph",
      diff: 3,
      text: "A DSC heating curve of a semi-crystalline sample shows a step at 60 °C, a small exotherm at 120 °C and a large endotherm at 250 °C. Identify the events.",
      options: [
        { label: "a", text: "All three are melting events" },
        { label: "b", text: "Tg at 60 °C, cold crystallization at 120 °C, Tm at 250 °C" },
        { label: "c", text: "Tg at 60 °C, Tm at 120 °C, degradation at 250 °C" },
        { label: "d", text: "Tm at 60 °C, Tg at 120 °C, decomposition at 250 °C" }
      ],
      answer: "b",
      why: "Step (change in Cp) = **Tg**; exotherm = **cold crystallization** of amorphous chains that gained mobility; large endotherm = **Tm** of the crystallites.",
      concept: "read DSC: step = Tg · exo = crystallization · endo = Tm",
      tags: ["confused"],
    },
    {
      id: "t6-10",
      type: "statement",
      diff: 2,
      text: "Which statement(s) about factors affecting Tg is/are correct?",
      statements: [
        { num: 1, text: "Cross-linking raises Tg because it restricts segmental motion." },
        { num: 2, text: "Increasing molecular weight raises Tg (Fox–Flory), the effect saturating at high MW." },
        { num: 3, text: "Bulky side groups generally raise Tg." },
        { num: 4, text: "Adding a plasticizer raises Tg." },
      ],
      options: [
        { label: "a", text: "1 and 4 only" },
        { label: "b", text: "4 only" },
        { label: "c", text: "1, 2 and 3 only" },
        { label: "d", text: "1, 2, 3 and 4" }
      ],
      answer: "c",
      why: "1–3 correct. Item 4 is false — plasticizers **lower** Tg (more free volume).",
      distractors: {
        d: "Item 4 reverses the plasticizer effect, one of the most examined points.",
      },
      tags: ["confused"],
    },
    {
      id: "t6-11",
      type: "assertreason",
      diff: 3,
      assertion: "Cross-linking raises the glass-transition temperature of a polymer.",
      reason: "Covalent cross-links tie chains together and restrict the segmental motion that the glass transition requires.",
      options: [
        { label: "a", text: "A is false, R is true" },
        { label: "b", text: "A is true, R is false" },
        { label: "c", text: "Both A and R are true, and R is the correct explanation of A" },
        { label: "d", text: "Both A and R are true, but R is NOT the correct explanation of A" }
      ],
      answer: "c",
      why: "Cross-links reduce the number of conformations and **restrict segmental mobility**, so a higher temperature is needed to mobilize the chains — the direct cause of the Tg rise.",
      concept: "cross-link density ↑ → Tg ↑",
      tags: ["revision"],
    },
    {
      id: "t6-12",
      type: "apply",
      diff: 3,
      text: "A part must remain dimensionally stable under load at 90 °C. Which is the safest choice?",
      options: [
        { label: "a", text: "Glass-fibre-reinforced semi-crystalline polymer such as PA66-GF (Tm ~ 265 °C, reinforced)" },
        { label: "b", text: "Atactic polystyrene (Tg ≈ 100 °C but brittle)" },
        { label: "c", text: "Unplasticized PVC (Tg ≈ 80 °C)" },
        { label: "d", text: "Plasticized PVC" }
      ],
      answer: "a",
      why: "Service temperature must sit well below the relevant transition. A **reinforced semi-crystalline** polymer retains modulus up to near its high Tm; its crystallites plus fibres bear load. Unplasticized PVC (Tg 80 °C) is above its glass transition at 90 °C → softens.",
      distractors: {
        c: "At 90 °C unplasticized PVC is already past Tg → it creeps.",
        d: "Plasticizer moves Tg well below 90 °C — worst choice.",
      },
      concept: "service T < Tg (amorphous) or < Tm (crystalline)",
      tags: ["revision"],
    },
    {
      id: "t6-13",
      type: "concept",
      diff: 3,
      text: "Why is the experimentally measured Tg of a polymer dependent on the cooling rate?",
      options: [
        { label: "a", text: "Because Tg is a kinetic phenomenon — segments need time to rearrange, so a faster quench freezes them at a higher temperature." },
        { label: "b", text: "Because the polymer degrades on cooling." },
        { label: "c", text: "It is actually rate-independent." },
        { label: "d", text: "Because Tm also changes." }
      ],
      answer: "a",
      why: "Unlike melting, the glass transition is **relaxation-limited**: at a faster cooling/heating rate the system is further from equilibrium, so Tg appears higher. DSC values are therefore quoted at a standard rate (e.g. 10 K/min).",
      concept: "Tg is rate-dependent; Tm is not",
      tags: ["confused"],
    },
    {
      id: "t6-14",
      type: "recall",
      diff: 2,
      text: "The heat-deflection temperature (HDT) of a plastic is:",
      options: [
        { label: "a", text: "The temperature at which it melts completely" },
        { label: "b", text: "The temperature of 5% weight loss" },
        { label: "c", text: "The glass-transition temperature" },
        { label: "d", text: "The temperature at which a standard bar deflects a fixed amount under a specified bending load" }
      ],
      answer: "d",
      why: "**HDT** is a *stiffness* (mechanical) measure under load, not a thermodynamic transition — hence reinforcing or crystallizing a polymer raises HDT even if Tg is unchanged.",
      tags: ["revision"],
    },
    {
      id: "t6-15",
      type: "compare",
      diff: 2,
      text: "Which statement contrasts HDT and Vicat softening temperature correctly?",
      options: [
        { label: "a", text: "HDT requires melting of the sample." },
        { label: "b", text: "Vicat is always lower than Tg." },
        { label: "c", text: "They are measured identically." },
        { label: "d", text: "HDT is measured in bending under a fixed load; Vicat is the temperature at which a rounded needle penetrates a set depth under a fixed load." }
      ],
      answer: "d",
      why: "Both are **empirical load-deflection tests** at their own standard conditions: HDT (heat deflection) in three-point bending; Vicat in needle penetration. Neither is a fundamental transition.",
      tags: ["revision"],
    },
    {
      id: "t6-16",
      type: "concept",
      diff: 3,
      text: "A semi-crystalline polymer such as polypropylene can be used far above its Tg (−10 °C) up to near its Tm (~165 °C). Why?",
      options: [
        { label: "a", text: "It contains no amorphous phase." },
        { label: "b", text: "Its Tg is actually 165 °C." },
        { label: "c", text: "Polypropylene is a thermoset." },
        { label: "d", text: "Its crystallites remain rigid and act as physical cross-links, holding the material together above Tg." }
      ],
      answer: "d",
      why: "Above Tg only the **amorphous** fraction softens; the surrounding crystallites stay intact until Tm, so the material keeps its shape and much of its modulus — the basis of engineering use of PE, PP and nylons above their Tg.",
      concept: "semi-crystalline: service window extends to Tm, not Tg",
      tags: ["confused"],
    },
    {
      id: "t6-17",
      type: "numerical",
      diff: 3,
      text: "As a rough rule, $T_g \\approx \\tfrac{2}{3} T_m$ (both in kelvin). For a polymer with $T_m = 540$ K, the estimated Tg is about:",
      options: [
        { label: "a", text: "540 K" },
        { label: "b", text: "270 K" },
        { label: "c", text: "360 K" },
        { label: "d", text: "180 K" }
      ],
      answer: "c",
      why: "$T_g \\approx \\tfrac{2}{3}\\times540 = \\mathbf{360}$ K ($\\approx 87$ °C), which is a reasonable estimate for many polymers (PET: Tm 538 K, Tg ~ 342 K).",
      distractors: {
        b: "270 K would use the ½ rule, a poorer fit for polar/aromatic chains.",
      },
      concept: "$T_g \\approx \\tfrac{1}{2}$–$\\tfrac{2}{3} T_m$ (rough rule; many exceptions)",
      tags: ["numeric"],
    },
    {
      id: "t6-18",
      type: "concept",
      diff: 2,
      text: "In free-volume theory, the glass transition occurs when the fractional free volume falls to about:",
      options: [
        { label: "a", text: "10%" },
        { label: "b", text: "2.5%" },
        { label: "c", text: "0.01%" },
        { label: "d", text: "50%" }
      ],
      answer: "b",
      why: "The **iso-free-volume** concept: all polymers reach Tg when their fractional free volume drops to a universal value of roughly **0.025** — the point where segmental motion effectively freezes out.",
      concept: "free-volume fraction at Tg ≈ 0.025 (WLF)",
      tags: ["revision"],
    },
    {
      id: "t6-19",
      type: "statement",
      diff: 3,
      text: "Which statement(s) about Tm is/are correct?",
      statements: [
        { num: 1, text: "High chain symmetry and regularity raise Tm (e.g. PTFE, HDPE)." },
        { num: 2, text: "Strong intermolecular forces (H-bonding in nylons) raise Tm." },
        { num: 3, text: "Random copolymerization generally lowers Tm." },
        { num: 4, text: "Tm is independent of crystal thickness and perfection." },
      ],
      options: [
        { label: "a", text: "1, 2, 3 and 4" },
        { label: "b", text: "1, 2 and 3 only" },
        { label: "c", text: "4 only" },
        { label: "d", text: "2 and 4 only" }
      ],
      answer: "b",
      why: "1–3 are correct. Item 4 is false — **thinner, more defective crystals melt lower** (nylon 6,6 ~ 265 °C vs branched PE ~ 105 °C reflects both regularity and lamellar thickness).",
      distractors: {
        a: "Item 4 ignores crystal perfection, which sets the measured Tm.",
      },
      tags: ["confused"],
    },
    {
      id: "t6-20",
      type: "apply",
      diff: 4,
      text: "An engineer must raise the HDT of a polypropylene housing from 90 °C to > 140 °C without changing the polymer. The most effective route is:",
      options: [
        { label: "a", text: "Lower the molecular weight." },
        { label: "b", text: "Add a plasticizer." },
        { label: "c", text: "Quench the moulding faster." },
        { label: "d", text: "Add 30% glass fibre: the stiff fibres bear load and raise the deflection temperature, also raising crystallinity via nucleation." }
      ],
      answer: "d",
      why: "**HDT is a stiffness test**: glass fibres (and other reinforcements/fillers) raise the modulus and carry load at high temperature — the standard way to lift HDT dramatically. Nucleation from the filler also helps.",
      distractors: {
        b: "Plasticizer lowers HDT.",
        c: "Faster quenching lowers crystallinity → could reduce HDT.",
      },
      concept: "reinforcement/filler ↗ HDT",
      tags: ["confused"],
    },
    {
      id: "t6-21",
      type: "concept",
      diff: 2,
      text: "A random copolymer has a single Tg intermediate between those of its two homopolymers because:",
      options: [
        { label: "a", text: "Tg is always the arithmetic mean." },
        { label: "b", text: "Copolymerization raises crystallinity." },
        { label: "c", text: "Two Tgs always merge into a sum." },
        { label: "d", text: "The chains are chemically bonded into one molecule, giving a single averaged amorphous phase." }
      ],
      answer: "d",
      why: "In a **random** copolymer the two units share one chain, so there is one amorphous environment → **one Tg** between the homopolymer values. (A *block* or *immiscible blend* instead shows two Tgs — a key miscibility test.)",
      concept: "random copolymer: 1 Tg · immiscible blend: 2 Tgs",
      tags: ["confused"],
    },
    {
      id: "t6-22",
      type: "higher",
      diff: 4,
      text: "A clear PET bottle (Tg 69 °C, Tm 265 °C) must not distort in a 60 °C hot-fill process; a competitor uses hot-fill PET with higher crystallinity. The reasoning is:",
      options: [
        { label: "a", text: "PET's Tg is 265 °C." },
        { label: "b", text: "Crystallinity lowers the HDT." },
        { label: "c", text: "The bottle walls are cross-linked during filling." },
        { label: "d", text: "Amorphous PET softens just above Tg (~69 °C) so 60 °C is marginal; crystallizing the bottle (heat-setting) raises the effective stiffness and HDT, letting it survive hot fill." }
      ],
      answer: "d",
      why: "Because Tg (69 °C) is close to the fill temperature, an **amorphous** bottle is dimensionally marginal. **Heat-setting** the preform develops crystallites that act as physical cross-links and raise the HDT, while keeping the bottle transparent (small crystallites).",
      concept: "crystallinity ⇒ higher HDT above Tg",
      tags: ["confused"],
    },
  ],
};

export default T6;
