import type { TopicSource } from "../../mt203/types";

/**
 * MT203 — Topic 2: Polymerization Mechanisms
 * Source: Module 1 §2 + supplement (melt polycondensation lives in t3).
 * 36 questions.
 */
const T2: TopicSource = {
  id: "t2",
  module: "m1",
  title: "Polymerization Mechanisms",
  subtitle: "Topic 2 · chain-growth vs step-growth; radical, ionic and coordination routes",
  subs: [
    { id: "T2.1", title: "Addition vs condensation; chain vs step" },
    { id: "T2.2", title: "Initiation, propagation, termination, chain transfer" },
    { id: "T2.3", title: "Cationic, anionic, coordination polymerization" },
    { id: "T2.4", title: "Carothers equation & step-growth kinetics" },
    { id: "T2.5", title: "Free-radical kinetics, $R_p$, gel effect" },
    { id: "T2.6", title: "Ring-opening polymerization" },
  ],
  questions: [
        {
      "id": "t2-01",
      "type": "compare",
      "diff": 2,
      "text": "Why can a chain-growth polymerisation reach high molecular mass at relatively low monomer conversion, while a conventional step-growth polymerisation usually requires conversion close to unity?",
      "options": [
        {
          "label": "a",
          "text": "An active chain-growth centre can add many units before termination; step growth needs near-complete functional-group conversion for high mass."
        },
        {
          "label": "b",
          "text": "Chain growth has no termination under any conditions, while step growth terminates only by releasing a small molecule."
        },
        {
          "label": "c",
          "text": "The difference is mainly solvent choice; at identical solvent and temperature both mechanisms show the same mass-versus-conversion profile."
        },
        {
          "label": "d",
          "text": "Step growth builds high-mass chains at its first reaction step, while chain growth adds one unit per active centre."
        }
      ],
      "answer": "a",
      "why": "An active chain-growth centre can add many monomer units before that chain terminates. In step growth, monomers, dimers and longer species can react with one another, so high molecular mass requires almost complete consumption of functional groups.",
      "distractors": {
        "d": "This reverses the normal conversion dependence: step growth does not make high-mass chains at its first reaction step.",
        "b": "Chain growth can terminate, and step growth need not release a small molecule; those features do not define the mass-versus-conversion contrast.",
        "c": "The mechanistic distinction remains even when solvent and temperature are matched; it is not only a process-condition effect."
      },
      "concept": "molecular-mass development in chain-growth versus step-growth polymerisation",
      "tags": [
        "revision",
        "mechanism",
        "reviewed"
      ]
    },
    {
      id: "t2-02",
      type: "recall",
      diff: 1,
      text: "In free-radical polymerization, the step that generates the first reactive species is:",
      options: [
        { label: "a", text: "Initiation" },
        { label: "b", text: "Propagation" },
        { label: "c", text: "Chain transfer" },
        { label: "d", text: "Termination" }
      ],
      answer: "a",
      why: "**Initiation** = thermal/photolytic/redox decomposition of initiator (BPO, AIBN) into radicals, which then add to a monomer double bond.",
      tags: ["revision"],
    },
    {
      id: "t2-03",
      type: "numerical",
      diff: 3,
      text: "Free-radical polymerization has $k_p = 100$ L/(mol·s), $k_t = 10^{6}$ L/(mol·s), $f k_d[I] = 10^{-2}$ s⁻¹ and $[M] = 5$ mol/L. The steady-state rate $R_p$ is:",
      options: [
        { label: "a", text: "0.05 mol/(L·s)" },
        { label: "b", text: "0.005 mol/(L·s)" },
        { label: "c", text: "5 mol/(L·s)" },
        { label: "d", text: "0.5 mol/(L·s)" }
      ],
      answer: "a",
      why: "$R_p = k_p[M]\\sqrt{\\dfrac{f k_d [I]}{k_t}} = 100 \\times 5 \\times \\sqrt{\\dfrac{10^{-2}}{10^{6}}} = 500 \\times \\sqrt{10^{-8}} = 500 \\times 10^{-4} = \\mathbf{0.05}$ mol/(L·s).",
      distractors: {
        b: "0.005 forgets the factor of 10 from $k_p[M] = 500$.",
        d: "0.5 would need the initiator flux ten times higher.",
        c: "5 ignores the square root on the initiator term entirely.",
      },
      concept: "$R_p = k_p[M](fk_d[I]/k_t)^{1/2}$",
      tags: ["numeric", "formula"],
    },
    {
      id: "t2-04",
      type: "concept",
      diff: 3,
      text: "Why does the observed rate depend on $[I]^{1/2}$ rather than $[I]$ in free-radical polymerization?",
      options: [
        { label: "a", text: "Half of the initiator is wasted in every run, so the measured rate becomes proportional to its square root." },
        { label: "b", text: "Initiator decomposes through exactly two sequential reactions, mathematically forcing a square-root dependence." },
        { label: "c", text: "Bimolecular termination gives a steady-state radical concentration proportional to √[I], so Rp scales as √[I]." },
        { label: "d", text: "Termination is monomolecular, so radical concentration and polymerization rate become independent of initiator." }
      ],
      answer: "c",
      why: "Steady state: $R_i = R_t = 2k_t[M^\\bullet]^2$ → $[M^\\bullet] = (R_i/2k_t)^{1/2} \\propto [I]^{1/2}$. The **½-power is the signature of bimolecular termination**.",
      distractors: {
        a: "Efficiency $f$ enters linearly, not as a square root.",
      },
      concept: "$[M^\\bullet]_{ss} = (fk_d[I]/k_t)^{1/2}$",
      tags: ["confused"],
    },
    {
      id: "t2-05",
      type: "concept",
      diff: 2,
      text: "Chain transfer stops one growing chain but the overall rate of polymerization is barely affected. Why?",
      options: [
        { label: "a", text: "Transfer slows monomer addition at the radical, so each propagation step adds less mass to the chain." },
        { label: "b", text: "Transfer destroys all radicals irreversibly, so polymerization stops as soon as the first transfer event occurs." },
        { label: "c", text: "The radical moves to another molecule; one chain stops, but a new radical can continue propagation with little rate change." },
        { label: "d", text: "Transfer occurs only after termination has already removed every active chain from the reaction mixture." }
      ],
      answer: "c",
      why: "The active centre moves, it does not vanish: count of propagating radicals stays ~constant (rate unchanged) while **chain length — and hence MW — drops**.",
      concept: "transfer: lower MW, same rate",
      tags: ["confused"],
    },
    {
      id: "t2-06",
      type: "compare",
      diff: 2,
      text: "Termination by combination vs disproportionation — which pairing is correct?",
      options: [
        { label: "a", text: "Combination gives DP̄ = ν, while disproportionation gives DP̄ = 2ν because each radical forms a separate chain." },
        { label: "b", text: "Combination joins two radicals into one chain (DP̄ = 2ν); disproportionation ends chains separately (DP̄ = ν)." },
        { label: "c", text: "Both termination pathways join two radical-bearing chains into one longer chain, giving the same average DP." },
        { label: "d", text: "Both termination pathways leave two separate dead chains, so DP̄ equals the kinetic-chain length in each case." }
      ],
      answer: "b",
      why: "**Combination** joins two kinetic chains end-to-end → each dead chain holds two kinetic-chain lengths ($\\overline{DP} = 2\\nu$). **Disproportionation** ends each chain separately ($\\overline{DP} = \\nu$).",
      distractors: {
        a: "Exactly reversed.",
      },
      concept: "$\\nu = R_p/R_t$; DP̄ = 2ν (combination) or ν (disproportionation)",
      tags: ["confused", "formula"],
    },
    {
      id: "t2-07",
      type: "recall",
      diff: 1,
      text: "Which monomer is classically polymerized by a **cationic** mechanism?",
      options: [
        { label: "a", text: "Ethylene (Ziegler–Natta)" },
        { label: "b", text: "Isobutylene" },
        { label: "c", text: "Acrylonitrile" },
        { label: "d", text: "Styrene" }
      ],
      answer: "b",
      why: "**Isobutylene** (and vinyl ethers) carry electron-donating groups that stabilize a carbocation → cationic polymerization with Lewis-acid co-catalysts.",
      distractors: {
        a: "Ethylene with Ziegler–Natta is coordination polymerization.",
      },
      tags: ["revision"],
    },
    {
      id: "t2-08",
      type: "concept",
      diff: 3,
      text: "Why can anionic polymerization produce *living* polymers (no termination), enabling block copolymers like SBS?",
      options: [
        { label: "a", text: "Trace water destroys the anion, so a living chain can survive only if the reactor is deliberately kept wet." },
        { label: "b", text: "Living behaviour requires coordination catalysts, because ionic chains always terminate by radical combination." },
        { label: "c", text: "Carbanions terminate rapidly by combination under normal conditions, so block copolymers require a new initiator at each stage." },
        { label: "d", text: "With impurities and termination suppressed, the carbanion remains active and can resume growth when more monomer is added." }
      ],
      answer: "d",
      why: "The **carbanion has no termination partner** in rigorously purified systems: chains start together, all grow while monomer lasts, and stop only when monomer is gone. Adding a second monomer then extends every chain → **block** copolymers.",
      distractors: {
        a: "Impurities *do* kill livingness — that is why anionic systems need ultra-pure reagents.",
      },
      concept: "living = no termination + fast initiation",
      tags: ["confused"],
    },
    {
      id: "t2-09",
      type: "match",
      diff: 1,
      text: "Match each mechanism with its reactive centre and typical monomer.",
      tableRows: [
        ["1", "Free-radical", "", "(i) carbocation; isobutylene"],
        ["2", "Cationic", "", "(ii) metal–carbon bond; propylene (stereoregular)"],
        ["3", "Anionic", "", "(iii) radical; vinyl acetate"],
        ["4", "Coordination", "", "(iv) carbanion; styrene (living)"],
      ],
      options: [
        { label: "a", text: "1-i, 2-iii, 3-ii, 4-iv" },
        { label: "b", text: "1-iii, 2-i, 3-iv, 4-ii" },
        { label: "c", text: "1-iv, 2-iii, 3-i, 4-ii" },
        { label: "d", text: "1-iii, 2-iv, 3-i, 4-ii" }
      ],
      answer: "b",
      why: "Radical → vinyl acetate; cation → isobutylene; anion → styrene; coordination (Ziegler–Natta) → stereoregular polypropylene via a metal–carbon bond.",
      tags: ["revision"],
    },
    {
      id: "t2-10",
      type: "numerical",
      diff: 2,
      text: "Using Carothers' equation, the number-average degree of polymerization at 99% conversion ($p = 0.99$) in a stoichiometric step-growth system is:",
      options: [
        { label: "a", text: "100" },
        { label: "b", text: "1000" },
        { label: "c", text: "50" },
        { label: "d", text: "10" }
      ],
      answer: "a",
      why: "$DP = \\dfrac{1}{1-p} = \\dfrac{1}{0.01} = \\mathbf{100}$.",
      distractors: {
        c: "50 corresponds to $p = 0.98$.",
        b: "1000 requires $p = 0.999$.",
      },
      concept: "$DP_n = 1/(1-p)$",
      tags: ["numeric", "formula"],
    },
    {
      id: "t2-11",
      type: "concept",
      diff: 2,
      text: "Why does step-growth polymerization require exact stoichiometric balance of functional groups to reach high MW?",
      options: [
        { label: "a", text: "Excess of one group caps every chain with unreactive ends, limiting DP." },
        { label: "b", text: "It does not — any stoichiometry reaches high MW." },
        { label: "c", text: "Imbalance slows the reaction tenfold." },
        { label: "d", text: "Imbalance causes side reactions that destroy the polymer." }
      ],
      answer: "a",
      why: "Chains can only grow while **both** end-group types are available. An excess of one kind converts all ends to that unreactive type and growth stops at $DP = (1+r)/(1-r)$ — the stoichiometric ratio $r$ caps MW.",
      concept: "$DP = (1+r)/(1-r-2rp) \\to (1+r)/(1-r)$ at $p=1$",
      tags: ["confused", "formula"],
    },
    {
      id: "t2-12",
      type: "statement",
      diff: 3,
      text: "Which statement(s) about the classification of polymerizations is/are correct?",
      statements: [
        { num: 1, text: "Addition vs condensation is a *chemical* classification (small molecule lost or not)." },
        { num: 2, text: "Chain-growth vs step-growth is a *mechanistic* classification." },
        { num: 3, text: "Polyurethane formation is an addition reaction that proceeds by a step-growth mechanism." },
        { num: 4, text: "All condensation polymerizations are step-growth." },
      ],
      options: [
        { label: "a", text: "1, 2 and 3 only" },
        { label: "b", text: "2 and 4 only" },
        { label: "c", text: "4 only" },
        { label: "d", text: "1, 2, 3 and 4" }
      ],
      answer: "a",
      why: "1–3 correct. Item 4 is false: polyurethane (–NCO + –OH, nothing eliminated = *addition*) proceeds **step-growth**; conversely some ring-opening additions are chain-growth. The two axes are independent.",
      distractors: {
        d: "Item 4 collapses the two orthogonal classifications — exactly the trap.",
      },
      concept: "two independent axes: chemistry × mechanism",
      tags: ["confused"],
    },
    {
      id: "t2-13",
      type: "sequence",
      diff: 1,
      text: "Order the stages of free-radical polymerization: (1) propagation (2) initiator decomposition (3) termination (4) initiation (5) chain transfer (possible at any point)",
      options: [
        { label: "a", text: "2 → 4 → 1 → 5 → 3" },
        { label: "b", text: "1 → 2 → 4 → 3 → 5" },
        { label: "c", text: "2 → 4 → 3 → 1 → 5" },
        { label: "d", text: "4 → 2 → 1 → 3 → 5" }
      ],
      answer: "a",
      why: "Initiator first decomposes (**2**), the radical adds to monomer (**4** initiation), chains then propagate (**1**); transfer (**5**) may redirect the radical any time; chains end by termination (**3**).",
      tags: ["revision"],
    },
    {
      id: "t2-14",
      type: "numerical",
      diff: 3,
      text: "A step-growth polymerization uses a diacid and a diamine with a molar ratio $r = 0.995$ (less/more abundant group). The maximum $DP$ at full conversion of the limiting group is:",
      options: [
        { label: "a", text: "399" },
        { label: "b", text: "100" },
        { label: "c", text: "200" },
        { label: "d", text: "1000" }
      ],
      answer: "a",
      why: "$DP_{max} = \\dfrac{1+r}{1-r} = \\dfrac{1.995}{0.005} = \\mathbf{399}$.",
      distractors: {
        b: "100 is the $r = 1$ case of *nothing*… no — 100 is $1/(1-p)$ at $p = 0.99$; here the cap is stoichiometric.",
        d: "1000 would need $r \\approx 0.998$.",
      },
      concept: "$DP_{max} = (1+r)/(1-r)$",
      tags: ["numeric", "formula"],
    },
        {
      "id": "t2-15",
      "type": "concept",
      "diff": 3,
      "text": "During bulk free-radical polymerisation, the rate rises sharply at high conversion as the mixture becomes very viscous. Which mechanism best explains the Trommsdorff (gel) effect?",
      "options": [
        {
          "label": "a",
          "text": "Termination becomes diffusion-limited before propagation is suppressed as much, so radicals accumulate and the rate accelerates."
        },
        {
          "label": "b",
          "text": "Higher viscosity makes radical collisions more frequent, increasing termination before propagation."
        },
        {
          "label": "c",
          "text": "A permanent cross-linked gel forms at a fixed conversion and catalyses further chain growth."
        },
        {
          "label": "d",
          "text": "Initiator efficiency rises with conversion, increasing radical generation regardless of diffusion."
        }
      ],
      "answer": "a",
      "why": "As viscosity rises, termination becomes diffusion-limited before propagation is suppressed to the same extent. Radicals accumulate, causing autoacceleration and potentially a dangerous exotherm.",
      "distractors": {
        "c": "A macroscopic cross-linked network and a fixed gel point are not required for the Trommsdorff autoacceleration.",
        "b": "Rising viscosity tends to restrict diffusion-controlled termination rather than making radical collisions more frequent.",
        "d": "The defining feedback is a change in termination/propagation mobility, not a universal increase in initiator efficiency."
      },
      "concept": "diffusion-limited termination and Trommsdorff autoacceleration",
      "tags": [
        "reviewed"
      ]
    },
    {
      id: "t2-16",
      type: "numerical",
      diff: 3,
      text: "If the initiator concentration is quadrupled ($[I] \\to 4[I]$) in a free-radical polymerization, $R_p$ becomes:",
      options: [
        { label: "a", text: "4 times larger" },
        { label: "b", text: "2 times larger" },
        { label: "c", text: "Half as large" },
        { label: "d", text: "Unchanged" }
      ],
      answer: "b",
      why: "$R_p \\propto [I]^{1/2}$ → $4^{1/2} = 2$. **Rate doubles** when initiator quadruples.",
      distractors: {
        a: "Linear dependence would hold only without bimolecular termination.",
        c: "More initiator never slows the reaction (it lowers MW instead).",
      },
      concept: "$R_p \\propto [M][I]^{1/2}$",
      tags: ["numeric", "formula"],
    },
    {
      id: "t2-17",
      type: "concept",
      diff: 3,
      text: "Increasing initiator concentration makes the polymerization faster but yields *lower* molecular weight. Why?",
      options: [
        { label: "a", text: "Initiator fragments dilute the polymer chains, lowering their measured molecular weight without changing chain count." },
        { label: "b", text: "Initiator concentration does not affect molecular weight because propagation alone fixes the final chain length." },
        { label: "c", text: "More initiator creates more radicals and growing chains, so monomer is shared among more chains and average MW falls." },
        { label: "d", text: "Initiator slows propagation by consuming monomer before chains can form, reducing rate as molecular weight falls." }
      ],
      answer: "c",
      why: "$\\overline{DP}_n = k_p[M]/(fk_dk_t[I])^{1/2} \\propto [I]^{-1/2}$. More radicals → more chains started simultaneously → each consumes fewer monomers before terminating.",
      concept: "$\\overline{DP}_n \\propto [I]^{-1/2}$",
      tags: ["confused", "formula"],
    },
    {
      id: "t2-18",
      type: "compare",
      diff: 2,
      text: "Head-to-tail vs head-to-head addition in vinyl polymerization:",
      options: [
        { label: "a", text: "Head-to-head dominates because placing substituents next to each other reduces steric repulsion during addition." },
        { label: "b", text: "Head-to-tail dominates because addition leaves the radical on the more substituted carbon, stabilizing the growing chain end." },
        { label: "c", text: "Head-to-tail addition occurs only in ionic polymerization; radical chains cannot add vinyl monomers in that arrangement." },
        { label: "d", text: "Both arrangements occur equally often because the two carbon atoms of a substituted vinyl monomer are equivalent." }
      ],
      answer: "b",
      why: "The propagating radical is most stable on the **substituted carbon**; adding the next monomer so the radical lands there gives the regular **head-to-tail** sequence.",
      tags: ["revision"],
    },
    {
      id: "t2-19",
      type: "recall",
      diff: 1,
      text: "AIBN decomposes to radicals with the simultaneous release of:",
      options: [
        { label: "a", text: "CO₂" },
        { label: "b", text: "N₂" },
        { label: "c", text: "O₂" },
        { label: "d", text: "H₂O" }
      ],
      answer: "b",
      why: "Azobisisobutyronitrile loses **N₂**, leaving two cyano-stabilized carbon radicals.",
      tags: ["revision"],
    },
    {
      id: "t2-20",
      type: "match",
      diff: 2,
      text: "Match each term with its correct description.",
      tableRows: [
        ["1", "Initiator efficiency f", "", "(i) two radicals couple into one chain"],
        ["2", "Combination", "", "(ii) fraction of fragments that actually start chains (typically 0.3–0.8)"],
        ["3", "Disproportionation", "", "(iii) H transfer gives saturated + unsaturated chain ends"],
        ["4", "Chain transfer agent", "", "(iv) deliberately added molecule that limits MW"],
      ],
      options: [
        { label: "a", text: "1-iv, 2-i, 3-ii, 4-iii" },
        { label: "b", text: "1-ii, 2-iii, 3-i, 4-iv" },
        { label: "c", text: "1-ii, 2-i, 3-iii, 4-iv" },
        { label: "d", text: "1-i, 2-ii, 3-iv, 4-iii" }
      ],
      answer: "c",
      why: "f = fraction of radicals that start chains; combination = coupling; disproportionation = H-transfer ending; transfer agent = MW control.",
      tags: ["revision"],
    },
    {
      id: "t2-21",
      type: "assertreason",
      diff: 3,
      assertion: "In Ziegler–Natta polymerization of propylene, the polymer is isotactic.",
      reason: "The monomer coordinates at the metal centre of the catalyst in a fixed orientation before insertion into the metal–carbon bond.",
      options: [
        { label: "a", text: "Both A and R are true, but R is NOT the correct explanation of A" },
        { label: "b", text: "Both A and R are true, and R is the correct explanation of A" },
        { label: "c", text: "A is false, R is true" },
        { label: "d", text: "A is true, R is false" }
      ],
      answer: "b",
      why: "**Site-controlled insertion** places every methyl group on the same side of the chain → **isotactic** polymer. Stereospecificity is a direct consequence of the coordination geometry.",
      concept: "stereospecific coordination insertion",
      tags: ["revision"],
    },
    {
      id: "t2-22",
      type: "numerical",
      diff: 4,
      text: "Kinetic chain length $\\nu = 1000$. Termination is 60% by combination and 40% by disproportionation. The overall $\\overline{DP}_n$ is:",
      options: [
        { label: "a", text: "1200" },
        { label: "b", text: "1000" },
        { label: "c", text: "1400" },
        { label: "d", text: "1600" }
      ],
      answer: "c",
      why: "Contribution-weighted average: $\\overline{DP} = 0.6(2\\nu) + 0.4(\\nu) = 1.2\\nu + 0.4\\nu = 1.6 \\times 1000 = \\mathbf{1400}$.",
      distractors: {
        a: "1200 counts only the combination fraction's doubling.",
        b: "1000 is the disproportionation-only result.",
      },
      concept: "$\\overline{DP} = f_{comb}\\cdot 2\\nu + f_{dis}\\cdot \\nu$",
      tags: ["numeric", "formula"],
    },
    {
      id: "t2-23",
      type: "concept",
      diff: 2,
      text: "Why is free-radical polymerization the most widely used industrial mechanism?",
      options: [
        { label: "a", text: "It requires no initiator or thermal control, so all monomers can be polymerized in an ordinary open vessel." },
        { label: "b", text: "It is the only mechanism that produces stereoregular polymers and guarantees the highest molecular weight for any monomer." },
        { label: "c", text: "It is more sensitive than ionic polymerization to water and polar functional groups, making it easy to purify and control." },
        { label: "d", text: "It accepts many monomers and functional groups, uses practical initiators, and tolerates more process variation than ionic routes." }
      ],
      answer: "d",
      why: "Radicals are **chemically tolerant** (unlike ionic systems, they survive trace impurities and water) and can run in bulk, solution, suspension or emulsion — ideal for commodity production.",
      distractors: {
        b: "Stereoregularity requires *coordination* catalysts — precisely what radical polymerization cannot do.",
      },
      tags: ["revision"],
    },
    {
      id: "t2-24",
      type: "recall",
      diff: 1,
      text: "Ring-opening polymerization of ε-caprolactam produces:",
      options: [
        { label: "a", text: "Polystyrene" },
        { label: "b", text: "PET" },
        { label: "c", text: "Nylon 6" },
        { label: "d", text: "Nylon 6,6" }
      ],
      answer: "c",
      why: "ε-Caprolactam (6 carbons, one monomer) opens to **nylon 6** — an *addition* reaction by chemistry (nothing eliminated), driven by relief of ring strain.",
      distractors: {
        d: "Nylon 6,6 is a step-growth polycondensation of two different monomers.",
      },
      tags: ["revision"],
    },
    {
      id: "t2-25",
      type: "graph",
      diff: 3,
      text: "Two curves of MW vs conversion are shown: curve A rises steeply only near p → 1; curve B is high from the start. Identify the mechanisms.",
      tableRows: [
        ["p (conversion)", "0.5", "0.9", "0.98", "0.999"],
        ["Curve A: DP", "2", "10", "50", "1000"],
        ["Curve B: DP", "~2000", "~2100", "~2200", "~2300"],
      ],
      options: [
        { label: "a", text: "Both are chain-growth" },
        { label: "b", text: "A = chain-growth, B = step-growth" },
        { label: "c", text: "Both are step-growth at different stoichiometries" },
        { label: "d", text: "A = step-growth, B = chain-growth" }
      ],
      answer: "d",
      why: "Curve A follows Carothers exactly ($DP = 1/(1-p)$: 2, 10, 50, 1000) → **step-growth**. Curve B shows high MW from low conversion → **chain-growth**.",
      distractors: {
        b: "Reversed — the 1/(1−p) signature belongs to step-growth.",
      },
      concept: "MW-vs-conversion profile diagnostic",
      tags: ["confused"],
    },
    {
      id: "t2-26",
      type: "statement",
      diff: 2,
      text: "Which statement(s) about ionic polymerization is/are correct?",
      statements: [
        { num: 1, text: "Cationic polymerization is typically initiated by Lewis or Brønsted acids." },
        { num: 2, text: "Anionic systems can be living if rigorously free of impurities." },
        { num: 3, text: "Both cationic and anionic polymerization usually show a bimolecular termination step like radical systems." },
        { num: 4, text: "Electron-withdrawing groups on the monomer favour anionic propagation." },
      ],
      options: [
        { label: "a", text: "1 and 2 only" },
        { label: "b", text: "1, 2, 3 and 4" },
        { label: "c", text: "1, 2 and 4 only" },
        { label: "d", text: "3 and 4 only" }
      ],
      answer: "c",
      why: "1, 2, 4 correct. Item 3 false — ionic systems often **lack** bimolecular termination entirely (that is what makes living anionic polymerization possible).",
      distractors: {
        b: "Item 3 projects radical-kinetics intuition onto ionic systems — the classic error.",
      },
      tags: ["confused"],
    },
    {
      id: "t2-27",
      type: "apply",
      diff: 4,
      text: "A lab needs an A–B–A block copolymer with perfectly equal PS block lengths. Which route is required?",
      options: [
        { label: "a", text: "Use conventional free-radical polymerization with equal feed ratios; termination timing will equalize the two PS blocks." },
        { label: "b", text: "Use step-growth polymerization with balanced functional groups; that automatically creates a linear A–B–A sequence." },
        { label: "c", text: "Use cationic initiation with BF₃, which guarantees equal PS blocks by terminating both ends at the same time." },
        { label: "d", text: "Use a living route and a difunctional initiator to grow the central B block from both ends, then add styrene to cap both ends." }
      ],
      answer: "d",
      why: "**Living** chains (no termination) grow every block from the same start time with the same rate → equal-length blocks. A difunctional initiator grows the mid-block outward in both directions, then styrene caps the ends → **SBS**.",
      distractors: {
        a: "Radical chains start/terminate stochastically — block lengths would be broadly distributed.",
      },
      concept: "living + sequential monomer addition = block copolymers",
      tags: ["revision"],
    },
    {
      id: "t2-28",
      type: "numerical",
      diff: 3,
      text: "In a step-growth polymerization, what conversion is needed to reach $DP_n = 200$ (stoichiometric)?",
      options: [
        { label: "a", text: "90%" },
        { label: "b", text: "99.5%" },
        { label: "c", text: "99%" },
        { label: "d", text: "95%" }
      ],
      answer: "b",
      why: "$p = 1 - 1/DP = 1 - 1/200 = 1 - 0.005 = 0.995$ → **99.5%**.",
      distractors: {
        c: "99% gives DP = 100 only.",
      },
      concept: "$p = 1 - 1/DP_n$",
      tags: ["numeric", "formula"],
    },
    {
      id: "t2-29",
      type: "concept",
      diff: 3,
      text: "Coordination (metallocene) catalysts differ from Ziegler–Natta catalysts chiefly in that:",
      options: [
        { label: "a", text: "Ziegler–Natta catalysts are living systems that prevent every termination event and always produce monodisperse chains." },
        { label: "b", text: "Metallocenes often act as single-site catalysts, giving more uniform active sites, narrower MWD and better comonomer control." },
        { label: "c", text: "Metallocenes cannot polymerize ethylene because their active sites are too crowded for small olefin molecules." },
        { label: "d", text: "Metallocenes work only by anionic initiation, unlike the coordination-insertion mechanism of Ziegler–Natta catalysts." }
      ],
      answer: "b",
      why: "One crystallographically uniform **single site** = uniform chains → **narrow MWD** (PDI ≈ 2) and controlled tacticity. Multi-site Ziegler–Natta gives broader distributions.",
      tags: ["revision"],
    },
    {
      id: "t2-30",
      type: "higher",
      diff: 4,
      text: "A polycondensation reaches p = 0.995 with perfect stoichiometry. A competitor claims their batch reaches DP 400 at p = 0.99 using a slight stoichiometric imbalance. Both statements are:",
      options: [
        { label: "a", text: "Both wrong" },
        { label: "b", text: "First wrong, second correct" },
        { label: "c", text: "Both correct — the first gives DP 200 at perfect balance, the second needs r such that (1+r)/(1−2r+...)…, achievable only with r ≈ 0.995" },
        { label: "d", text: "First is correct (DP = 200); the second is impossible — imbalance can only *lower* DP below the balanced value at the same p" }
      ],
      answer: "d",
      why: "Case 1: $DP = 1/(1-0.995) = 200$ ✓. Case 2: at $p = 0.99$ with balance, $DP = 100$; any imbalance ($r < 1$) reduces it further via $DP = (1+r)/(1+r-2rp)$. $DP = 400$ at $p = 0.99$ is **unattainable**.",
      distractors: {
        c: "Stoichiometric imbalance can never increase DP — it is a cap, not a boost.",
      },
      concept: "$DP = (1+r)/(1+r-2rp)$; $r \\le 1$ always reduces DP",
      tags: ["numeric", "confused"],
    },
    {
      id: "t2-31",
      type: "recall",
      diff: 1,
      text: "Which initiator is activated by **redox** chemistry (low-temperature initiation)?",
      options: [
        { label: "a", text: "Thermal azo decomposition alone" },
        { label: "b", text: "Benzoyl peroxide" },
        { label: "c", text: "A peroxide/Fe²⁺ redox pair" },
        { label: "d", text: "AIBN at 60 °C" }
      ],
      answer: "c",
      why: "**Redox initiation** (e.g. peroxide + Fe²⁺) generates radicals at low temperature — essential for emulsion polymerization at moderate temperatures.",
      tags: ["revision"],
    },
        {
      "id": "t2-32",
      "type": "apply",
      "diff": 3,
      "text": "In an emulsion polymerisation, adding surfactant above the critical micelle concentration increases the number of polymer particles and raises the overall rate. Which conclusion is most defensible?",
      "options": [
        {
          "label": "a",
          "text": "Surfactant always acts as a chain-transfer agent, so both rate and molecular mass must fall."
        },
        {
          "label": "b",
          "text": "Micelles act only as heat sinks; when temperature is controlled, their number cannot affect the rate."
        },
        {
          "label": "c",
          "text": "Every particle holds many radicals throughout the reaction, guaranteeing faster termination and shorter chains."
        },
        {
          "label": "d",
          "text": "More particles create more reaction loci, while compartmentalisation can limit intraparticle termination; molecular mass need not rise monotonically."
        }
      ],
      "answer": "d",
      "why": "Emulsion polymerisation can combine high rate with relatively high molecular mass because many particles react concurrently and compartmentalisation limits intraparticle termination. Particle number, radical entry and surfactant level make the molecular-mass trend condition-dependent.",
      "distractors": {
        "a": "Surfactant can change particle nucleation and stabilisation; it is not necessarily a chain-transfer agent.",
        "b": "Micelles and particle number alter where reactions occur and therefore can affect the polymerisation rate.",
        "c": "Compartmentalisation tends to limit the simultaneous presence of radicals in each particle; many radicals per particle would promote termination."
      },
      "concept": "particle compartmentalisation and emulsion kinetics",
      "tags": [
        "reviewed"
      ]
    },
    {
      id: "t2-33",
      type: "compare",
      diff: 2,
      text: "Condensation (Carothers) vs addition polymerization — which statement is correct?",
      options: [
        { label: "a", text: "Condensation requires an initiator; addition does not." },
        { label: "b", text: "Addition always gives higher MW." },
        { label: "c", text: "Condensation releases a small molecule (H₂O, HCl…); addition does not." },
        { label: "d", text: "Condensation is always chain-growth." }
      ],
      answer: "c",
      why: "That is the definition of the **chemical** classification: loss of a small molecule (condensation) vs net addition across a double bond or ring (addition).",
      distractors: {
        d: "Most condensations are step-growth, but polyurethane addition is step-growth too — the axes differ.",
      },
      tags: ["revision"],
    },
    {
      id: "t2-34",
      type: "numerical",
      diff: 4,
      text: "A reactor runs free-radical polymerization. Doubling $[M]$ and halving $[I]$ changes $R_p$ by the factor:",
      options: [
        { label: "a", text: "1" },
        { label: "b", text: "2" },
        { label: "c", text: "4" },
        { label: "d", text: "√2" }
      ],
      answer: "d",
      why: "$R_p \\propto [M][I]^{1/2}$ → $2 \\times (1/2)^{1/2} = 2/\\sqrt{2} = \\mathbf{\\sqrt{2}} \\approx 1.41$.",
      distractors: {
        b: "2 ignores the square-root dependence on initiator.",
      },
      concept: "$R_p \\propto [M][I]^{1/2}$",
      tags: ["numeric", "formula"],
    },
    {
      id: "t2-35",
      type: "assertreason",
      diff: 3,
      assertion: "Bulk polymerization of a viscous monomer may show dangerous runaway if not agitated and cooled.",
      reason: "The gel (Trommsdorff) effect causes autoacceleration as viscosity rises, and the reaction is exothermic.",
      options: [
        { label: "a", text: "Both A and R are true, but R is NOT the correct explanation of A" },
        { label: "b", text: "A is true, R is false" },
        { label: "c", text: "A is false, R is true" },
        { label: "d", text: "Both A and R are true, and R is the correct explanation of A" }
      ],
      answer: "d",
      why: "Autoacceleration (viscosity-limited termination) plus the ~80–100 kJ/mol heat of polymerization with poor heat transfer in bulk = **thermal runaway risk**. Exactly why industrially sensitive monomers are suspension- or solution-polymerized.",
      tags: ["confused"],
    },
    {
      id: "t2-36",
      type: "higher",
      diff: 4,
      text: "A polymer sample shows PDI = 2.0 with all chains having two hydroxyl end groups (confirmed by NMR). The most likely synthesis is:",
      options: [
        { label: "a", text: "Free-radical termination by combination is the most likely route because it creates two hydroxyl ends on every chain." },
        { label: "b", text: "Ziegler–Natta coordination usually produces hydroxyl-terminated chains in a perfectly uniform distribution." },
        { label: "c", text: "Living anionic polymerization typically leaves two hydroxyl end groups on every chain without a separate termination step." },
        { label: "d", text: "High-conversion step-growth polyester/polyamide synthesis commonly gives PDI near 2 and two functional end groups per chain." }
      ],
      answer: "d",
      why: "The **most-probable (Flory) distribution** from equal-reactivity step-growth has $M_w/M_n = 2$ and, being built from A–A/B–B type monomers, carries two functional end groups per chain. Living systems give PDI ≈ 1.",
      concept: "Flory distribution: PDI → 2 for step-growth",
      tags: ["confused"],
    },
  ],
};

export default T2;
