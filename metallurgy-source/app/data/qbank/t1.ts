import type { TopicSource } from "../../mt203/types";

/**
 * MT203 — Topic 1: Fundamentals, Classification & Architecture
 * Source: Module 1 §1, §3, §4 (+ supplement). 32 questions.
 */
const T1: TopicSource = {
  id: "t1",
  module: "m1",
  title: "Fundamentals, Classification & Architecture",
  subtitle: "Topic 1 · what a polymer is, how it is classified, named and shaped",
  subs: [
    { id: "T1.1", title: "Monomers, repeat units, DP, functionality" },
    { id: "T1.2", title: "Classification — the seven axes" },
    { id: "T1.3", title: "Nomenclature & copolymer connectives" },
    { id: "T1.4", title: "Topology, configuration, conformation" },
    { id: "T1.5", title: "Copolymer architectures & thermoplastic elastomers" },
  ],
  questions: [
    {
      id: "t1-01",
      type: "recall",
      diff: 1,
      text: "A polymer is a macromolecule built by chemically linking many small molecules called:",
      options: [
        { label: "a", text: "repeat units" },
        { label: "b", text: "ions" },
        { label: "c", text: "monomers" },
        { label: "d", text: "oligomers" }
      ],
      answer: "c",
      why: "**Monomers** are the small reactive molecules that link together; the unit left behind in the chain is the *repeat unit*.",
      distractors: {
        a: "A repeat unit is what remains *inside* the chain after polymerization — not the starting molecule.",
        d: "Oligomers are short polymers (a few repeat units), not the building blocks.",
      },
      concept: "poly (many) + meres (parts)",
      tags: ["revision"],
    },
    {
      id: "t1-02",
      type: "concept",
      diff: 2,
      text: "Why is the repeat unit of polyethylene written as $\\text{–CH}_2\\text{–CH}_2\\text{–}$ rather than $\\text{CH}_2{=}\\text{CH}_2$?",
      options: [
        { label: "a", text: "The formula is a convention — the structure is not known exactly." },
        { label: "b", text: "The double bond is only temporarily broken during polymerization." },
        { label: "c", text: "The double bond opens and two backbone single-bonded carbons remain in the chain." },
        { label: "d", text: "Polyethylene actually retains one double bond per repeat unit." }
      ],
      answer: "c",
      why: "Addition polymerization **opens the $\\pi$ bond** of $C{=}C$: each monomer carbon forms a new $\\sigma$ bond to its neighbours, leaving a saturated $\\text{–CH}_2\\text{–CH}_2\\text{–}$ repeat unit.",
      distractors: {
        d: "The product is saturated — no $C{=}C$ remains (that is why PE is chemically inert).",
        b: "The change is permanent and irreversible; the bond does not re-form.",
      },
      concept: "count atoms on the *repeat unit*, not the monomer",
      tags: ["confused"],
    },
    {
      id: "t1-03",
      type: "recall",
      diff: 1,
      text: "Which was the **first fully synthetic polymer** to be produced commercially?",
      options: [
        { label: "a", text: "Polyethylene (1933)" },
        { label: "b", text: "Bakelite (phenol–formaldehyde, 1909)" },
        { label: "c", text: "Nylon 6,6 (1935)" },
        { label: "d", text: "Celluloid (cellulose nitrate, 1868)" }
      ],
      answer: "b",
      why: "**Bakelite (1909, Baekeland)** was the first wholly man-made polymer — made entirely from synthetic small molecules, not from a natural polymer backbone.",
      distractors: {
        d: "Celluloid is **semi-synthetic**: it modifies natural cellulose.",
        c: "Nylon came more than two decades after Bakelite.",
      },
      tags: ["revision"],
    },
    {
      id: "t1-04",
      type: "compare",
      diff: 2,
      text: "Which pairing correctly links tacticity to expected crystallinity?",
      options: [
        { label: "a", text: "Both are always crystalline" },
        { label: "b", text: "Both are always amorphous" },
        { label: "c", text: "Isotactic → crystalline; atactic → amorphous" },
        { label: "d", text: "Isotactic → amorphous; atactic → crystalline" }
      ],
      answer: "c",
      why: "**Isotactic** chains have all substituents on one side, so they pack into a lattice → **crystalline, rigid**. **Atactic** chains have random substituent placement → no regular packing → **amorphous, tacky**.",
      distractors: {
        d: "Exactly reversed — regularity, not irregularity, is what enables packing.",
        a: "Atactic vinyl polymers cannot pack regularly at all.",
      },
      concept: "tacticity = configuration; regularity controls crystallizability",
      tags: ["confused"],
    },
    {
      id: "t1-05",
      type: "recall",
      diff: 1,
      text: "Nylon 6,6 gets its name because:",
      options: [
        { label: "a", text: "The material was first commercialized in 1966, so the two sixes record the year it entered industrial production." },
        { label: "b", text: "Each nylon macromolecule contains exactly six repeat units, and the second six records the number of chains in a batch." },
        { label: "c", text: "The diamine and diacid each contain six carbon atoms: hexamethylenediamine and adipic acid." },
        { label: "d", text: "Its melting point is 66 °C, with the two digits repeated to distinguish the grade from other nylons." }
      ],
      answer: "c",
      why: "The two numbers give the **carbon counts of the two monomers**: hexamethylene**diamine** (6 C) + **adipic** acid (6 C). Nylon 6,10 = diamine of 6 C + diacid of 10 C.",
      distractors: {
        b: "The numbers never refer to chain length — chains contain thousands of units.",
      },
      tags: ["revision"],
    },
    {
      id: "t1-06",
      type: "statement",
      diff: 2,
      text: "Which statement(s) about the relationship between monomer and repeat unit is/are correct?",
      statements: [
        { num: 1, text: "The repeat unit is the structural unit that repeats along the chain backbone." },
        { num: 2, text: "For addition polymers the repeat unit usually contains the same atoms as the monomer." },
        { num: 3, text: "For condensation polymers the repeat unit is *smaller* than the monomer because a small molecule is lost." },
        { num: 4, text: "The degree of polymerization equals the number of monomer molecules originally present." },
      ],
      options: [
        { label: "a", text: "1, 2 and 3 only" },
        { label: "b", text: "2, 3 and 4 only" },
        { label: "c", text: "1 and 4 only" },
        { label: "d", text: "1, 2, 3 and 4" }
      ],
      answer: "a",
      why: "Items 1–3 are correct. Item 4 is wrong: **DP = number of repeat units in one chain**, not the total number of monomers charged to the reactor.",
      distractors: {
        d: "Item 4 confuses DP of *one chain* with the total monomer feed.",
      },
      tags: ["confused"],
    },
    {
      id: "t1-07",
      type: "numerical",
      diff: 2,
      text: "Polyethylene chains have a number-average molecular weight $M_n = 56{,}000$ g/mol. Taking the repeat unit $\\text{–CH}_2\\text{–CH}_2\\text{–}$ ($M = 28$ g/mol), the number-average degree of polymerization is:",
      options: [
        { label: "a", text: "200" },
        { label: "b", text: "28{,}000" },
        { label: "c", text: "2{,}000" },
        { label: "d", text: "560" }
      ],
      answer: "c",
      why: "$DP_n = M_n / M_{repeat} = 56{,}000 / 28 = \\mathbf{2{,}000}$.",
      distractors: {
        a: "200 would need $M_n = 5{,}600$ — off by a factor of ten.",
        d: "560 divides by 100, not by 28.",
      },
      concept: "$DP = M / M_{repeat}$",
      tags: ["numeric", "formula"],
    },
    {
      id: "t1-08",
      type: "match",
      diff: 1,
      text: "Match each classification basis with its correct set of categories.",
      tableRows: [
        ["1", "Origin", "", "(i) thermoplastic / thermosetting"],
        ["2", "Thermal behaviour", "", "(ii) natural / semi-synthetic / synthetic"],
        ["3", "Molecular arrangement", "", "(iii) linear / branched / cross-linked"],
        ["4", "Structure (topology)", "", "(iv) amorphous / (semi)crystalline"],
      ],
      options: [
        { label: "a", text: "1-ii, 2-i, 3-iv, 4-iii" },
        { label: "b", text: "1-i, 2-ii, 3-iii, 4-iv" },
        { label: "c", text: "1-ii, 2-i, 3-iii, 4-iv" },
        { label: "d", text: "1-iv, 2-iii, 3-i, 4-ii" },
      ],
      answer: "a",
      why: "Origin → natural/semi-synthetic/synthetic; thermal → thermoplastic/thermosetting; arrangement → amorphous/crystalline; topology → linear/branched/cross-linked. Only (a) matches all four.",
      distractors: {
        c: "Swaps 3 and 4: topology is linear/branched/cross-linked, arrangement is amorphous/crystalline.",
      },
      tags: ["revision"],
    },
    {
      id: "t1-09",
      type: "concept",
      diff: 2,
      text: "Why does LDPE have lower density and lower crystallinity than HDPE?",
      options: [
        { label: "a", text: "LDPE's long branches prevent chains from packing closely." },
        { label: "b", text: "LDPE has stronger intermolecular forces." },
        { label: "c", text: "LDPE has a higher molecular weight." },
        { label: "d", text: "LDPE is a thermoset with cross-links." }
      ],
      answer: "a",
      why: "LDPE's **branches** sterically block close packing → less crystalline → lower density. HDPE is essentially **linear** and packs efficiently (≈80% crystalline).",
      distractors: {
        d: "LDPE is a thermoplastic; branching ≠ cross-linking.",
        c: "Density here is set by packing, not by chain length.",
      },
      concept: "linear → HDPE (dense) · branched → LDPE (less dense)",
      tags: ["confused"],
    },
    {
      id: "t1-10",
      type: "recall",
      diff: 1,
      text: "The configuration of a polymer chain can only be changed by:",
      options: [
        { label: "a", text: "Dissolving a polymer may change its shape or conformation, but does not change its chain configuration by itself." },
        { label: "b", text: "Rotation about single bonds changes chain conformation, while the covalent configuration remains unchanged." },
        { label: "c", text: "Breaking and reforming covalent bonds can alter stereochemical configuration or the arrangement around a double bond." },
        { label: "d", text: "Changing temperature may alter conformation or phase, but does not change configuration unless a chemical reaction occurs." }
      ],
      answer: "c",
      why: "**Configuration** (tacticity, cis/trans geometry) is fixed by bonding — altering it needs bond breakage. Rotations about single bonds change **conformation** only.",
      distractors: {
        b: "That changes conformation, which is freely interconvertible.",
      },
      concept: "configuration ≠ conformation",
      tags: ["confused"],
    },
        {
      "id": "t1-11",
      "type": "concept",
      "diff": 3,
      "text": "Which structural explanation best accounts for natural rubber being flexible while gutta-percha is more rigid and crystalline, despite both being polyisoprene?",
      "options": [
        {
          "label": "a",
          "text": "The cis and trans forms have different repeat-unit compositions and molar masses, which alone determine the crystallinity difference."
        },
        {
          "label": "b",
          "text": "The cis geometry introduces kinks that hinder regular packing, whereas straighter trans chains can pack into crystallites."
        },
        {
          "label": "c",
          "text": "Gutta-percha's rigidity is caused by a higher covalent cross-link density, while chain geometry has little effect on packing."
        },
        {
          "label": "d",
          "text": "The cis geometry lets the chain pack in a more regular arrangement, while trans geometry introduces kinks that inhibit crystallization."
        }
      ],
      "answer": "b",
      "why": "Both are polyisoprene. The cis/trans geometry at the double bond changes chain shape and packing: cis chains are more kinked and pack less regularly; trans chains are straighter and more readily crystallize.",
      "distractors": {
        "d": "This reverses the effect of cis/trans geometry on chain packing.",
        "a": "The polymers share the same repeat-unit chemistry; the stereogeometry differs.",
        "c": "Crystallinity follows chain geometry and packing, not a higher cross-link density as stated."
      },
      "concept": "Same repeat-unit chemistry, different cis/trans configuration and chain packing.",
      "tags": [
        "confused"
      ]
    },
    {
      id: "t1-12",
      type: "recall",
      diff: 1,
      text: "The copolymer connective `co` denotes which sequence arrangement?",
      options: [
        { label: "a", text: "Block" },
        { label: "b", text: "Alternating" },
        { label: "c", text: "Random" },
        { label: "d", text: "Graft" }
      ],
      answer: "c",
      why: "`co` = **random** (e.g. SBR = styrene-*co*-butadiene). `alt` = alternating, `block` = block, `graft` = graft.",
      distractors: {
        b: "Alternating uses `alt`.",
        a: "Block uses `block`.",
      },
      tags: ["revision"],
    },
    {
      id: "t1-13",
      type: "apply",
      diff: 3,
      text: "A container must be remoulded repeatedly after use. Which polymer class is required?",
      options: [
        { label: "a", text: "Heavily cross-linked elastomer" },
        { label: "b", text: "Thermoplastic polymer" },
        { label: "c", text: "Any of these — all remelt" },
        { label: "d", text: "Thermosetting polymer" }
      ],
      answer: "b",
      why: "Only **thermoplastics** consist of separate chains held by secondary forces — they soften on heating and can be remoulded any number of times.",
      distractors: {
        d: "Thermosets cure into an infinite network: heat degrades them, it does not flow them.",
      },
      concept: "thermoplastic = reprocessable · thermoset = one-shot",
      tags: ["revision"],
    },
    {
      id: "t1-14",
      type: "assertreason",
      diff: 2,
      assertion: "Poly(vinyl alcohol) cannot be made by direct polymerization of its monomer, vinyl alcohol.",
      reason: "Vinyl alcohol tautomerizes to acetaldehyde, so PVA is instead produced by hydrolysis of polyvinyl acetate.",
      options: [
        { label: "a", text: "A is true, R is false" },
        { label: "b", text: "Both A and R are true, but R is NOT the correct explanation of A" },
        { label: "c", text: "Both A and R are true, and R is the correct explanation of A" },
        { label: "d", text: "A is false, R is true" }
      ],
      answer: "c",
      why: "Vinyl alcohol's enol form spontaneously **tautomerizes** to the more stable aldehyde, so the monomer does not exist stably. Hence the industrial route: **hydrolyse (alcoholize) PVAc → PVA**.",
      concept: "enol ↔ keto tautomerism",
      tags: ["confused"],
    },
    {
      id: "t1-15",
      type: "sequence",
      diff: 2,
      text: "Order these milestones chronologically, earliest first: (1) Ziegler–Natta stereospecific catalysis (2) Bakelite commercialized (3) Staudinger's macromolecular hypothesis (4) Carothers' nylon & step-growth theory (5) Celluloid (Hyatt)",
      options: [
        { label: "a", text: "2 → 5 → 3 → 1 → 4" },
        { label: "b", text: "5 → 2 → 3 → 4 → 1" },
        { label: "c", text: "5 → 3 → 2 → 4 → 1" },
        { label: "d", text: "5 → 2 → 4 → 3 → 1" }
      ],
      answer: "b",
      why: "Celluloid **1868** → Bakelite **1909** → Staudinger's hypothesis **1920s** → Carothers' nylon work **1930s** → Ziegler–Natta **1950s**.",
      distractors: {
        c: "Staudinger (1920s) came after Bakelite (1909), not before.",
        d: "Carothers (1930s) came after Staudinger (1920s).",
      },
      tags: ["revision"],
    },
    {
      id: "t1-16",
      type: "match",
      diff: 2,
      text: "Match each polymer abbreviation with its full name.",
      tableRows: [
        ["1", "POM", "", "(i) polyethylene terephthalate"],
        ["2", "PET", "", "(ii) polyoxymethylene (polyacetal)"],
        ["3", "PMMA", "", "(iii) polytetrafluoroethylene"],
        ["4", "PTFE", "", "(iv) poly(methyl methacrylate)"],
      ],
      options: [
        { label: "a", text: "1-iv, 2-iii, 3-ii, 4-i" },
        { label: "b", text: "1-ii, 2-i, 3-iv, 4-iii" },
        { label: "c", text: "1-ii, 2-iv, 3-i, 4-iii" },
        { label: "d", text: "1-i, 2-ii, 3-iii, 4-iv" }
      ],
      answer: "b",
      why: "POM = polyoxymethylene (polyacetal) · PET = polyethylene terephthalate · PMMA = poly(methyl methacrylate) · PTFE = polytetrafluoroethylene.",
      tags: ["revision"],
    },
    {
      id: "t1-17",
      type: "statement",
      diff: 2,
      text: "Which statement(s) about elastomers is/are correct?",
      statements: [
        { num: 1, text: "An elastomer is used well above its glass-transition temperature." },
        { num: 2, text: "It is lightly cross-linked so chains cannot slide past each other permanently." },
        { num: 3, text: "It must be (semi)crystalline to be elastic." },
        { num: 4, text: "Large strains are essentially recoverable because elasticity is entropic in origin." },
      ],
      options: [
        { label: "a", text: "2 and 3 only" },
        { label: "b", text: "1, 2 and 4 only" },
        { label: "c", text: "1, 2, 3 and 4" },
        { label: "d", text: "3 and 4 only" }
      ],
      answer: "b",
      why: "1, 2 and 4 define an elastomer. Item 3 is false — elastomers are **amorphous**; crystallinity would make them rigid (that is exactly why *trans*-polyisoprene is rigid).",
      distractors: {
        c: "Item 3 inverts the requirement: amorphous + lightly cross-linked + above Tg.",
      },
      tags: ["confused"],
    },
    {
      id: "t1-18",
      type: "concept",
      diff: 3,
      text: "Why does raising the functionality of monomers above two lead to cross-linked (network) polymers in step-growth polymerization?",
      options: [
        { label: "a", text: "Trifunctional monomers release more small molecules, and that by-product alone causes a polymer to become a cross-linked network." },
        { label: "b", text: "Each extra reactive group can connect another chain segment, enabling branching and eventually a three-dimensional network." },
        { label: "c", text: "Trifunctional monomers always react faster than bifunctional ones, so rate alone explains the gel and cross-link formation." },
        { label: "d", text: "Covalent cross-linking occurs only in chain-growth systems; step-growth monomers with functionality above two remain linear." }
      ],
      answer: "b",
      why: "Functionality = number of reactive groups per monomer. With **f > 2**, some units are branch points; beyond the **gel point** the branches connect into one infinite network.",
      distractors: {
        a: "More condensate does not cross-link anything — cross-linking is covalent branching.",
      },
      concept: "f = 2 → linear · f > 2 → branched/network · gel point",
      tags: ["confused"],
    },
    {
      id: "t1-19",
      type: "recall",
      diff: 1,
      text: "Degree of polymerization (DP) is defined as the number of:",
      options: [
        { label: "a", text: "functional groups per repeat unit" },
        { label: "b", text: "repeat units in one polymer chain" },
        { label: "c", text: "chains in one mole of polymer" },
        { label: "d", text: "monomer molecules in the whole sample" }
      ],
      answer: "b",
      why: "**DP = repeat units per chain**; $M \\approx DP \\times M_{repeat}$.",
      distractors: {
        d: "The sample contains many chains, each with its own DP.",
      },
      tags: ["revision"],
    },
    {
      id: "t1-20",
      type: "compare",
      diff: 2,
      text: "Distinguish a *branched* polymer from a *cross-linked* polymer.",
      options: [
        { label: "a", text: "Branching and cross-linking are both side chains on one molecule; neither connects two separate polymer chains." },
        { label: "b", text: "Branches are intermolecular attractions between chains, while cross-links are weak intramolecular side chains." },
        { label: "c", text: "The terms describe the same architecture; both mean a polymer with more than one linear chain segment." },
        { label: "d", text: "A branch extends from one backbone; a cross-link forms a covalent bridge between separate chains." }
      ],
      answer: "d",
      why: "**Branching** = a side-chain growing from one backbone (LDPE). **Cross-linking** = a covalent bridge joining two *separate* chains, forming a 3-D network (vulcanized rubber, thermosets).",
      distractors: {
        b: "Branches are covalent too — they are made during polymerization.",
      },
      concept: "topology: linear / branched / cross-linked",
      tags: ["confused"],
    },
    {
      id: "t1-21",
      type: "numerical",
      diff: 2,
      text: "Nylon 6 has the repeat unit $\\text{–[NH(CH}_2\\text{)}_5\\text{CO]}\\text{–}$ ($M_{repeat} = 113$ g/mol). A nylon 6 sample with $M_n = 22{,}600$ g/mol has $DP_n$:",
      options: [
        { label: "a", text: "50" },
        { label: "b", text: "1{,}130" },
        { label: "c", text: "113" },
        { label: "d", text: "200" }
      ],
      answer: "d",
      why: "$DP_n = 22{,}600 / 113 = \\mathbf{200}$.",
      distractors: {
        a: "50 corresponds to $M_n = 5{,}650$.",
        c: "113 is the repeat-unit mass itself, not the ratio.",
      },
      concept: "$DP = M_n / M_{repeat}$",
      tags: ["numeric", "formula"],
    },
    {
      id: "t1-22",
      type: "graph",
      diff: 3,
      text: "A property-vs-DP plot gives: DP 20 → brittle waxy solid; DP 100 → weak solid; DP 400 → useful mechanical properties; DP 2000 → properties change very little further. What does the plateau above DP ≈ 400 indicate?",
      tableRows: [
        ["DP", "20", "100", "400", "2000"],
        ["Tensile strength (MPa)", "5", "25", "45", "47"],
      ],
      options: [
        { label: "a", text: "Crystallization becomes complete at DP ≈ 400, so all chains above that length must have identical structure and properties." },
        { label: "b", text: "The apparent plateau is most likely an instrument artefact, because all mechanical properties keep rising linearly with DP." },
        { label: "c", text: "Polymerization stops at DP 400 in every sample, leaving no possibility for the average chain length to rise further." },
        { label: "d", text: "Once chains are sufficiently long and entangled, extra repeat units produce diminishing changes in bulk mechanical properties." }
      ],
      answer: "d",
      why: "Above a **critical chain length**, added units contribute negligibly to the entanglement network — strength, Tg and viscosity level off (the entanglement plateau).",
      distractors: {
        a: "Crystallinity saturates too, but the plateau is a chain-length (entanglement) effect present in amorphous polymers as well.",
      },
      concept: "useful-DP-range graph (supplement)",
      tags: ["confused"],
    },
    {
      id: "t1-23",
      type: "apply",
      diff: 3,
      text: "An engineering component must survive repeated solvent exposure without dissolving or swelling. Which architecture is most appropriate?",
      options: [
        { label: "a", text: "Linear thermoplastic" },
        { label: "b", text: "Branched thermoplastic" },
        { label: "c", text: "Linear polymer of very low MW" },
        { label: "d", text: "Cross-linked (network) polymer" }
      ],
      answer: "d",
      why: "A covalent **network** cannot dissolve — solvent can at most swell it. Linear chains (a, c, d) can be solvated and separated, dissolving fully if low enough in MW.",
      concept: "cross-linking → solvent resistance",
      tags: ["revision"],
    },
    {
      id: "t1-24",
      type: "match",
      diff: 1,
      text: "Classify each polymer by its thermal behaviour.",
      tableRows: [
        ["1", "Polyethylene", "", "(i) thermosetting"],
        ["2", "Bakelite (phenolic)", "", "(ii) elastomer"],
        ["3", "Vulcanized natural rubber", "", "(iii) thermoplastic"],
        ["4", "Epoxy (fully cured)", "", "(iv) thermoplastic elastomer"],
      ],
      options: [
        { label: "a", text: "1-ii, 2-i, 3-iii, 4-iv" },
        { label: "b", text: "1-i, 2-iii, 3-iv, 4-ii" },
        { label: "c", text: "1-iii, 2-ii, 3-i, 4-i" },
        { label: "d", text: "1-iii, 2-i, 3-ii, 4-i" }
      ],
      answer: "d",
      why: "PE remelts → thermoplastic. Bakelite and cured epoxy are infusible networks → thermosets. Vulcanized NR is a lightly cross-linked amorphous elastomer.",
      distractors: {
        b: "Bakelite is not a thermoplastic — that is the defining contrast with PE.",
      },
      tags: ["revision"],
    },
    {
      id: "t1-25",
      type: "concept",
      diff: 2,
      text: "Why is a *thermoplastic elastomer* like SBS reprocessable even though it behaves like a vulcanized rubber in service?",
      options: [
        { label: "a", text: "Its cross-links are physical (glassy PS domains) that disassemble on heating." },
        { label: "b", text: "It contains no cross-links of any kind — the rubbery behaviour is an illusion." },
        { label: "c", text: "It has chemical cross-links that break at low temperature." },
        { label: "d", text: "It slowly reverts to a liquid at body temperature." }
      ],
      answer: "a",
      why: "In SBS the hard **polystyrene end-blocks** aggregate into glassy domains that act as *physical* cross-links. Heating above the PS Tg dissociates them → flowable → remouldable. No covalent vulcanization.",
      distractors: {
        b: "The domains are real physical cross-links — that is why it recovers strain.",
      },
      concept: "TPE: physical, not chemical, cross-links",
      tags: ["confused"],
    },
    {
      id: "t1-26",
      type: "higher",
      diff: 4,
      text: "Poly(vinyl acetate) is saponified to PVA, which is then blended with starch for a biodegradable film. In the PAIR of operations, the chemistry of each step is:",
      options: [
        { label: "a", text: "Hydrolysis (saponification), then physical blending of PVA with starch." },
        { label: "b", text: "Addition polymerization, then condensation polymerization with starch as a comonomer." },
        { label: "c", text: "Condensation polymerization, then a second condensation reaction between PVA and starch." },
        { label: "d", text: "Radical chain scission, then addition polymerization that grafts starch onto the PVA backbone." }
      ],
      answer: "a",
      why: "Saponifying PVAc converts its acetate ester groups to hydroxyl groups by hydrolysis; blending the resulting PVA with starch is a physical mixing step, not a second polymerization. The listed pair is therefore hydrolysis followed by physical blending.",
      distractors: {
        d: "PVAc formation eliminates nothing — it is addition, not condensation.",
      },
      concept: "polymer-analogous reactions vs polymerization",
      tags: ["confused"],
    },
        {
      "id": "t1-27",
      "type": "recall",
      "diff": 1,
      "text": "A polymer is classified as semi-synthetic when it is produced by:",
      "options": [
        {
          "label": "a",
          "text": "chemically modifying a naturally occurring polymer backbone."
        },
        {
          "label": "b",
          "text": "using a natural polymer without chemically changing its structure."
        },
        {
          "label": "c",
          "text": "physically blending natural and synthetic polymers without chemically modifying either."
        },
        {
          "label": "d",
          "text": "polymerizing synthetic monomers without a natural-polymer precursor."
        }
      ],
      "answer": "a",
      "why": "Semi-synthetic polymers are made by chemically modifying a natural polymer, as in cellulose acetate or cellulose nitrate. A physical blend does not make either component semi-synthetic.",
      "distractors": {
        "b": "That remains a natural polymer in its unmodified form.",
        "d": "That describes a fully synthetic polymer.",
        "c": "That describes a polymer blend rather than a chemically modified natural polymer."
      },
      "tags": [
        "revision"
      ]
    },
    {
      id: "t1-28",
      type: "statement",
      diff: 3,
      text: "Which statement(s) about polymer molecular architecture is/are correct?",
      statements: [
        { num: 1, text: "Star and comb architectures arise from multifunctional initiators or grafting." },
        { num: 2, text: "Dendrimers are perfectly branched, monodisperse tree-like macromolecules." },
        { num: 3, text: "A change of conformation requires breaking covalent bonds." },
        { num: 4, text: "Cis/trans isomerism in polyisoprene is a configurational difference." },
      ],
      options: [
        { label: "a", text: "1, 2, 3 and 4" },
        { label: "b", text: "3 and 4 only" },
        { label: "c", text: "2 and 3 only" },
        { label: "d", text: "1, 2 and 4 only" }
      ],
      answer: "d",
      why: "1, 2, 4 correct. Item 3 is false — **conformation** changes by bond rotation with no bond breakage; it is *configuration* that needs bonds broken.",
      distractors: {
        a: "Item 3 is the classic configuration/conformation mix-up.",
      },
      concept: "configuration = fixed by bonding · conformation = rotation",
      tags: ["confused"],
    },
    {
      id: "t1-29",
      type: "compare",
      diff: 2,
      text: "How does an *alternating* copolymer differ from a *random* copolymer?",
      options: [
        { label: "a", text: "Alternating is cross-linked; random is linear." },
        { label: "b", text: "There is no difference — the terms are interchangeable." },
        { label: "c", text: "Alternating has more A than B; random has equal amounts." },
        { label: "d", text: "Alternating: strict –A–B–A–B–; random: A and B in statistically irregular sequence." }
      ],
      answer: "d",
      why: "**Alternating** (…*alt*…) has a fixed A/B alternation; **random** (*co*) has irregular, statistically governed sequencing — the same overall composition, different order.",
      tags: ["revision"],
    },
    {
      id: "t1-30",
      type: "numerical",
      diff: 3,
      text: "A copolymer sample is 40 mol% monomer A ($M_A = 100$ g/mol) and 60 mol% monomer B ($M_B = 50$ g/mol). Its repeat-unit molar mass is:",
      options: [
        { label: "a", text: "70 g/mol" },
        { label: "b", text: "65 g/mol" },
        { label: "c", text: "75 g/mol" },
        { label: "d", text: "50 g/mol" }
      ],
      answer: "a",
      why: "Mole-fraction average: $M = 0.40(100) + 0.60(50) = 40 + 30 = \\mathbf{70}$ g/mol.",
      distractors: {
        c: "75 would need 50/50 weighting: 0.5(100)+0.5(50) = 75.",
        d: "50 is just $M_B$.",
      },
      concept: "$M_{repeat} = \\sum x_i M_i$",
      tags: ["numeric", "formula"],
    },
    {
      id: "t1-31",
      type: "concept",
      diff: 2,
      text: "Why can the *same* base polymer be sold both as a rigid engineering plastic and as a soft elastomer?",
      options: [
        { label: "a", text: "Formulation and morphology can be tuned with plasticizer, reinforcement, crystallinity and cross-linking to change stiffness and elasticity." },
        { label: "b", text: "Suppliers use different test definitions for stiffness, so the apparent rigid-plastic and elastomer grades are mechanically identical." },
        { label: "c", text: "The two products must have different repeat-unit chemistry, because one polymer backbone cannot be formulated across different properties." },
        { label: "d", text: "A single polymer chemistry cannot be made rigid or elastomeric; its properties remain fixed after the monomer has been chosen." }
      ],
      answer: "a",
      why: "The **balance** of intermolecular forces, chain flexibility, crystallinity and cross-link density decides the end use. The same chemistry can be moved across the plastic–elastomer space by compounding and structure control.",
      concept: "property requirements drive polymer utilization (Module 2 §1)",
      tags: ["revision"],
    },
    {
      id: "t1-32",
      type: "higher",
      diff: 4,
      text: "A resin cures irreversibly into an infusible network, then a second batch of the *same* formulation is kept below cure temperature and remoulded. The explanation is:",
      options: [
        { label: "a", text: "The batches must be different polymers, because a single formulation cannot be processed both before and after it cures." },
        { label: "b", text: "Cure is reversible below 100 °C, so the first batch can be remoulded once the cross-links cool and contract." },
        { label: "c", text: "Both batches are fully cured thermosets; the second can be remoulded because its molecular weight is lower." },
        { label: "d", text: "The first batch has cured into a network; the second remains an uncured, flowable prepolymer until its cure reaction proceeds." }
      ],
      answer: "d",
      why: "Thermoset systems are processed as **low-MW flowable prepolymers**; the irreversible cross-linking happens *during* cure. Before cure the material flows like a thermoplastic; after cure it never does again.",
      concept: "prepolymer → cure → network (one-way door)",
      tags: ["confused"],
    },
  ],
};

export default T1;
