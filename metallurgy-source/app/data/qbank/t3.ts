import type { TopicSource } from "../../mt203/types";

/**
 * MT203 — Topic 3: Polymerization Techniques
 * Source: Module 1 §2.3 + supplement (melt polycondensation). 22 questions.
 */
const T3: TopicSource = {
  id: "t3",
  module: "m1",
  title: "Polymerization Techniques",
  subtitle: "Topic 3 · bulk, solution, suspension, emulsion, melt polycondensation",
  subs: [
    { id: "T3.1", title: "Technique ≠ mechanism" },
    { id: "T3.2", title: "Bulk & solution polymerization" },
    { id: "T3.3", title: "Suspension vs emulsion" },
    { id: "T3.4", title: "Melt polycondensation" },
  ],
  questions: [
    {
      id: "t3-01",
      type: "recall",
      diff: 1,
      text: "In suspension polymerization the initiator is:",
      options: [
        { label: "a", text: "Monomer-soluble" },
        { label: "b", text: "Insoluble in both" },
        { label: "c", text: "Water-soluble" },
        { label: "d", text: "There is no initiator" }
      ],
      answer: "a",
      why: "Suspension polymerization disperses **monomer droplets** in water; the initiator dissolves in the monomer droplet, where polymerization occurs. This is the fastest way to tell suspension from emulsion.",
      distractors: {
        c: "A water-soluble initiator defines *emulsion* polymerization.",
      },
      concept: "suspension: I ∈ monomer · emulsion: I ∈ water",
      tags: ["confused"],
    },
    {
      id: "t3-02",
      type: "concept",
      diff: 2,
      text: "Why does solution polymerization typically give lower molecular weight than bulk polymerization of the same monomer?",
      options: [
        { label: "a", text: "Chain transfer to solvent stops chains early, and the dilution reduces propagation rate." },
        { label: "b", text: "Solvent lowers the monomer concentration." },
        { label: "c", text: "Solvent prevents initiation entirely." },
        { label: "d", text: "It does not — solution always gives higher MW." }
      ],
      answer: "a",
      why: "Two effects: (i) **chain transfer to solvent** — the radical is quenched by solvent, capping chains early; (ii) dilution lowers $[M]$, reducing $R_p$ and the time chains live before termination relative to transfer events.",
      distractors: {
        d: "Solution's hallmark limitation is *lower* MW — bulk gives the highest (but worst heat control).",
      },
      concept: "transfer to solvent: lower MW, better thermal control",
      tags: ["confused"],
    },
    {
      id: "t3-03",
      type: "match",
      diff: 1,
      text: "Match each technique with its defining feature.",
      tableRows: [
        ["1", "Bulk", "", "(i) monomer droplets in water; beads product"],
        ["2", "Solution", "", "(ii) monomer + initiator only; purest product"],
        ["3", "Suspension", "", "(iii) micelles; water-soluble initiator; latex"],
        ["4", "Emulsion", "", "(iv) solvent controls viscosity; MW may drop"],
      ],
      options: [
        { label: "a", text: "1-ii, 2-iv, 3-i, 4-iii" },
        { label: "b", text: "1-iv, 2-i, 3-ii, 4-iii" },
        { label: "c", text: "1-i, 2-ii, 3-iii, 4-iv" },
        { label: "d", text: "1-ii, 2-iii, 3-i, 4-iv" }
      ],
      answer: "a",
      why: "Bulk = pure monomer + initiator. Solution = solvent dilution. Suspension = droplets → beads. Emulsion = micelles + water-soluble initiator → latex.",
      tags: ["revision"],
    },
    {
      id: "t3-04",
      type: "compare",
      diff: 2,
      text: "Suspension vs emulsion polymerization — which statement is correct?",
      options: [
        { label: "a", text: "Suspension requires surfactant above CMC; emulsion does not." },
        { label: "b", text: "They are the same process under different names." },
        { label: "c", text: "Suspension: droplets 30–300 µm, no micelles, monomer-soluble initiator. Emulsion: micelles present, particles 0.01–1 µm, water-soluble initiator, nucleation inside micelles." },
        { label: "d", text: "Emulsion uses monomer-soluble initiator; suspension uses water-soluble." }
      ],
      answer: "c",
      why: "Every listed difference is a genuine discriminator: **micelles** and **water-soluble initiator** (emulsion) vs **plain droplets** and **monomer-soluble initiator** (suspension).",
      distractors: {
        d: "Exactly reversed.",
        a: "Emulsion needs surfactant above CMC to form micelles; suspension uses a suspending agent, not micelle-forming surfactant.",
      },
      concept: "the suspension/emulsion contrast is heavily examined",
      tags: ["confused"],
    },
    {
      id: "t3-05",
      type: "concept",
      diff: 3,
      text: "Why can emulsion polymerization achieve high rate *and* high molecular weight simultaneously, unlike bulk polymerization?",
      options: [
        { label: "a", text: "Surfactant increases activation energy, slowing propagation while making each individual polymer chain much longer." },
        { label: "b", text: "Water removes reaction heat and permits more initiator, which alone explains both high rate and high molecular weight." },
        { label: "c", text: "Particles compartmentalize radicals: many particles react simultaneously, while limited termination lets chains grow long." },
        { label: "d", text: "Emulsion is simply bulk polymerization diluted with water, so rate and molecular weight follow the same trade-off." }
      ],
      answer: "c",
      why: "**Compartmentalization** decouples rate from MW: rate scales with the number of particles, while the isolated-radical condition inside each particle suppresses termination → both rate and MW rise together. In bulk, anything that raises rate also raises termination.",
      concept: "compartmentalization effect",
      tags: ["confused"],
    },
    {
      id: "t3-06",
      type: "recall",
      diff: 1,
      text: "Which technique is the industrial standard for PET and nylon 6,6?",
      options: [
        { label: "a", text: "Suspension polymerization" },
        { label: "b", text: "Solution polymerization" },
        { label: "c", text: "Melt polycondensation" },
        { label: "d", text: "Emulsion polymerization" }
      ],
      answer: "c",
      why: "**Melt polycondensation** — the monomer melt is the reaction medium; no solvent means no chain transfer and no solvent-removal cost.",
      tags: ["revision"],
    },
    {
      id: "t3-07",
      type: "concept",
      diff: 3,
      text: "Why is high vacuum (< 1 mbar) essential in the late stages of melt polycondensation?",
      options: [
        { label: "a", text: "Vacuum prevents oxidation of the initiator." },
        { label: "b", text: "Vacuum lowers the melting point of the polymer." },
        { label: "c", text: "Removing the condensate (water) shifts the step-growth equilibrium forward toward high MW." },
        { label: "d", text: "Vacuum increases the monomer concentration." }
      ],
      answer: "c",
      why: "Condensation is an equilibrium: leftover water drives the reverse (hydrolysis) reaction. Vacuum **pulls the condensate out**, shifting equilibrium toward high-DP polymer — the entire art of reaching $p > 99.5\\%$.",
      concept: "Le Chatelier: remove condensate → high conversion",
      tags: ["confused"],
    },
    {
      id: "t3-08",
      type: "statement",
      diff: 2,
      text: "Which statement(s) about bulk (mass) polymerization is/are correct?",
      statements: [
        { num: 1, text: "It gives the purest product because no solvent or suspending agent is present." },
        { num: 2, text: "Heat removal becomes difficult as viscosity rises." },
        { num: 3, text: "The gel effect can cause thermal runaway." },
        { num: 4, text: "It is the preferred industrial route for all monomers." },
      ],
      options: [
        { label: "a", text: "2 and 3 only" },
        { label: "b", text: "4 only" },
        { label: "c", text: "1, 2, 3 and 4" },
        { label: "d", text: "1, 2 and 3 only" }
      ],
      answer: "d",
      why: "1–3 are bulk's defining trade-offs. Item 4 is false — thermally sensitive monomers (vinyl chloride, acrylates) go to suspension/emulsion precisely because bulk's heat removal is poor.",
      distractors: {
        c: "Item 4 ignores the heat-removal limitation that drives technique choice.",
      },
      tags: ["revision"],
    },
    {
      id: "t3-09",
      type: "apply",
      diff: 3,
      text: "PVC must be produced as clean, porous beads for downstream compounding. Which process?",
      options: [
        { label: "a", text: "Solution polymerization" },
        { label: "b", text: "Suspension polymerization" },
        { label: "c", text: "Emulsion polymerization" },
        { label: "d", text: "Bulk polymerization" }
      ],
      answer: "b",
      why: "≈80% of commercial PVC comes from **suspension** polymerization — the monomer droplets solidify into porous **beads/pearls** ideal for absorbing plasticizers during compounding.",
      distractors: {
        c: "Emulsion gives a fine latex that must be coagulated — used only for paste/plastisol grades.",
      },
      concept: "suspension → beads (PVC, PS)",
      tags: ["revision"],
    },
    {
      id: "t3-10",
      type: "recall",
      diff: 1,
      text: "In emulsion polymerization, particle nucleation occurs:",
      options: [
        { label: "a", text: "On the reactor wall" },
        { label: "b", text: "Inside surfactant micelles" },
        { label: "c", text: "In monomer droplets, as in suspension" },
        { label: "d", text: "In the aqueous phase only" }
      ],
      answer: "b",
      why: "Below the CMC surfactant forms micelles; above it, monomer-swollen **micelles** become the loci of nucleation and particle growth — the classical micellar nucleation model.",
      tags: ["revision"],
    },
    {
      id: "t3-11",
      type: "numerical",
      diff: 3,
      text: "Melt polycondensation of PET needs $DP_n = 100$. The required conversion (stoichiometric) is:",
      options: [
        { label: "a", text: "98%" },
        { label: "b", text: "99.9%" },
        { label: "c", text: "90%" },
        { label: "d", text: "99%" }
      ],
      answer: "d",
      why: "$p = 1 - 1/DP = 1 - 0.01 = 0.99$ → **99%** — which is why condensate removal (vacuum, thin-film reactors, SSP) dominates process design.",
      distractors: {
        a: "98% gives DP = 50 only.",
      },
      concept: "$p = 1 - 1/DP_n$",
      tags: ["numeric", "formula"],
    },
    {
      id: "t3-12",
      type: "concept",
      diff: 2,
      text: "What is solid-state polymerization (SSP) and why is it used for PET bottle grade?",
      options: [
        { label: "a", text: "Grinding finished polymer increases its surface area for sale but leaves chain length and end-group chemistry unchanged." },
        { label: "b", text: "PET is polymerized inside a solid catalyst lattice that supplies repeating sites for each new chain segment." },
        { label: "c", text: "A purification wash removes residual monomer and ends all condensation reactions before the pellets are dried." },
        { label: "d", text: "Dry PET chips are heated below Tm under vacuum or inert gas so end groups keep reacting and volatiles are removed." }
      ],
      answer: "d",
      why: "Above $T_g$, below $T_m$, chain ends still diffuse and react. SSP raises intrinsic viscosity to bottle grade while avoiding the melt's extreme viscosity and degradation at > 280 °C.",
      concept: "SSP: below Tm, above Tg",
      tags: ["revision"],
    },
    {
      id: "t3-13",
      type: "compare",
      diff: 2,
      text: "Which combination correctly pairs a technique with its principal industrial product?",
      options: [
        { label: "a", text: "Bulk → nylon; Suspension → epoxy; Emulsion → PTFE; Solution → PET" },
        { label: "b", text: "All products are made by emulsion" },
        { label: "c", text: "Bulk → PET; Suspension → LDPE; Emulsion → nylon fibres; Solution → PVC beads" },
        { label: "d", text: "Bulk → LDPE film; Suspension → PS beads; Emulsion → SBR latex; Melt polycondensation → PET" }
      ],
      answer: "d",
      why: "LDPE is made by high-pressure **bulk/mass** polymerization; PS and PVC as **suspension** beads; SBR as an **emulsion** latex; PET by **melt polycondensation** — all correct.",
      distractors: {
        c: "PET is not bulk-polymerized; nylon fibres are not emulsion products.",
      },
      tags: ["revision"],
    },
    {
      id: "t3-14",
      type: "assertreason",
      diff: 3,
      assertion: "Emulsion polymerization gives higher molecular weight than suspension polymerization at the same conversion rate.",
      reason: "Radical compartmentalization in emulsion particles suppresses bimolecular termination.",
      options: [
        { label: "a", text: "Both A and R are true, and R is the correct explanation of A" },
        { label: "b", text: "A is false, R is true" },
        { label: "c", text: "Both A and R are true, but R is NOT the correct explanation of A" },
        { label: "d", text: "A is true, R is false" }
      ],
      answer: "a",
      why: "One-radical-per-particle isolation means chains grow long before meeting a partner to terminate — exactly the compartmentalization mechanism described in R.",
      tags: ["confused"],
    },
    {
      id: "t3-15",
      type: "concept",
      diff: 2,
      text: "Why is melt polycondensation described as 'the fifth technique' rather than a separate mechanism?",
      options: [
        { label: "a", text: "Melt polycondensation is step-growth chemistry run without solvent; the melt is the medium, not a new mechanism." },
        { label: "b", text: "It is a ring-opening mechanism because cyclic monomers open, regardless of whether the process uses a melt." },
        { label: "c", text: "It combines all four classical techniques in one reactor, so each monomer passes through every process environment." },
        { label: "d", text: "It relies on a unique catalyst mechanism not used in other step-growth polymerization processes." }
      ],
      answer: "a",
      why: "Bulk/solution/suspension/emulsion/melt are **techniques** — how the reaction is run. The chemistry (step-growth polycondensation here) is chosen separately. Melt = no solvent, condensate removed by heat and vacuum.",
      concept: "technique vs mechanism — always separate them",
      tags: ["confused"],
    },
    {
      id: "t3-16",
      type: "recall",
      diff: 1,
      text: "Product form from suspension polymerization is:",
      options: [
        { label: "a", text: "Beads or pearls" },
        { label: "b", text: "Continuous film" },
        { label: "c", text: "Fibres" },
        { label: "d", text: "Fine latex particles" }
      ],
      answer: "a",
      why: "Each monomer droplet polymerizes into a solid particle → **beads/pearls** (PVC, PS). Latex is the emulsion product.",
      tags: ["revision"],
    },
    {
      id: "t3-17",
      type: "apply",
      diff: 4,
      text: "A process must produce a polymer with the narrowest possible MWD and no solvent residues, at modest scale. Best choice?",
      options: [
        { label: "a", text: "Bulk free-radical with high initiator" },
        { label: "b", text: "Emulsion with surfactant" },
        { label: "c", text: "Living anionic polymerization in bulk (no termination → uniform chains)" },
        { label: "d", text: "Solution with chain-transfer agent" }
      ],
      answer: "c",
      why: "**Living anionic** polymerization (fast initiation, no termination) produces nearly all chains at the same rate → the narrowest MWD attainable (PDI ≈ 1.05–1.2), and running it in bulk avoids solvent residues.",
      distractors: {
        b: "Emulsion adds surfactant residues and broadens particle/chain distributions.",
        d: "A chain-transfer agent deliberately *broadens* and lowers MW.",
      },
      concept: "living polymerization = narrowest distribution",
      tags: ["revision"],
    },
    {
      id: "t3-18",
      type: "graph",
      diff: 3,
      text: "Conversion-vs-time curves show: Curve A reaches 80% conversion in 1 h with a violent exotherm spike near 60%; Curve B reaches 80% smoothly over 4 h with a modest temperature rise. Identify the techniques.",
      tableRows: [
        ["t (h)", "0.25", "0.5", "1", "2", "4"],
        ["Curve A: X", "15%", "45%", "80%", "92%", "96%"],
        ["Curve B: X", "8%", "18%", "35%", "58%", "80%"],
      ],
      options: [
        { label: "a", text: "A = solution, B = bulk" },
        { label: "b", text: "A = bulk, B = solution (or suspension with heat removal)" },
        { label: "c", text: "Both are emulsion" },
        { label: "d", text: "A = suspension, B = bulk" }
      ],
      answer: "b",
      why: "Curve A's fast, exotherm-prone profile is the **bulk** signature (poor heat removal, gel-effect spike). Curve B's moderated, steady profile matches solvent/droplet heat control (solution or suspension).",
      distractors: {
        a: "Reversed — solution's dilution *slows* the reaction relative to bulk.",
      },
      concept: "heat-removal signature of each technique",
      tags: ["confused"],
    },
    {
      id: "t3-19",
      type: "statement",
      diff: 2,
      text: "Which statement(s) about the choice of polymerization technique is/are correct?",
      statements: [
        { num: 1, text: "The technique is chosen after the mechanism, based on heat removal, product form and cost." },
        { num: 2, text: "Free-radical PVC is mostly suspension-polymerized." },
        { num: 3, text: "Emulsion polymerization requires a surfactant above its CMC." },
        { num: 4, text: "Technique selection cannot change the molecular weight distribution." },
      ],
      options: [
        { label: "a", text: "2 and 3 only" },
        { label: "b", text: "1, 2 and 3 only" },
        { label: "c", text: "1, 2, 3 and 4" },
        { label: "d", text: "4 only" }
      ],
      answer: "b",
      why: "1–3 correct. Item 4 false — technique strongly affects MWD: emulsion compartmentalization broadens it; living/bulk systems narrow it; chain transfer in solution shifts it.",
      distractors: {
        c: "Item 4 denies a real process–structure link.",
      },
      tags: ["confused"],
    },
    {
      id: "t3-20",
      type: "higher",
      diff: 4,
      text: "A reactor produces polystyrene as 0.5 mm aqueous dispersion particles using potassium persulfate initiator and sodium lauryl sulfate surfactant. The process is:",
      options: [
        { label: "a", text: "Dispersion polymerization — identical to suspension" },
        { label: "b", text: "Precipitation polymerization in bulk" },
        { label: "c", text: "Suspension polymerization (persulfate is monomer-soluble)" },
        { label: "d", text: "Emulsion polymerization (water-soluble persulfate initiator, surfactant micelles, sub-micron particles)" }
      ],
      answer: "d",
      why: "Three signatures: **persulfate** (water-soluble) initiator, **surfactant** present, and particles **below 1 µm** — all hallmarks of emulsion polymerization. Suspensions have larger droplets (30–300 µm), no micelles, and monomer-soluble initiators.",
      concept: "diagnose technique from initiator solubility + particle size",
      tags: ["confused"],
    },
        {
      "id": "t3-21",
      "type": "recall",
      "diff": 2,
      "text": "In high-viscosity melt polycondensation, which equipment is particularly useful for creating a thin melt film and a short diffusion path for removing water or another condensate under vacuum?",
      "options": [
        {
          "label": "a",
          "text": "A deep, completely filled stirred vessel with no exposed melt surface"
        },
        {
          "label": "b",
          "text": "A wiped-film or thin-film evaporator"
        },
        {
          "label": "c",
          "text": "A cooling conveyor operated at atmospheric pressure after the reaction is complete"
        },
        {
          "label": "d",
          "text": "A pelletiser after the melt has already been solidified"
        }
      ],
      "answer": "b",
      "why": "A wiped-film or thin-film evaporator spreads the viscous melt over a large exposed area, shortening the path for condensate diffusion and improving removal under reduced pressure.",
      "distractors": {
        "d": "Pelletising shapes the polymer after reaction and does not create a short diffusion path for condensate in the melt.",
        "a": "A deep, completely filled vessel has a lower melt surface-area-to-volume ratio and a longer removal path.",
        "c": "Cooling after reaction cannot remove condensate from the viscous reacting melt to drive polycondensation forward."
      },
      "concept": "mass transfer in melt polycondensation",
      "tags": [
        "reviewed"
      ]
    },
    {
      id: "t3-22",
      type: "compare",
      diff: 3,
      text: "Chain transfer agent vs initiator: their roles in a radical process are:",
      options: [
        { label: "a", text: "Both generate radicals that stop the process completely once they react with a growing chain." },
        { label: "b", text: "Initiators create radicals; transfer agents move a radical to another molecule and limit chain length." },
        { label: "c", text: "Both mainly start new chains, so increasing either one raises rate and molecular weight together." },
        { label: "d", text: "Transfer agents initiate chains, while initiators primarily transfer the active site to control molecular weight." }
      ],
      answer: "b",
      why: "Two distinct knobs: **initiator** controls how many chains start (rate + MW); **transfer agent** controls how long each chain lives (MW only, ~unchanged rate). Industrial MW control often uses both.",
      tags: ["revision"],
    },
  ],
};

export default T3;
