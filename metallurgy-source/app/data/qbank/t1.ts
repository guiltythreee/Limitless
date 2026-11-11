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
        { label: "a", text: "monomers" },
        { label: "b", text: "repeat units" },
        { label: "c", text: "oligomers" },
        { label: "d", text: "ions" }
      ],
      answer: "a",
      why: "**Monomers** are the small reactive molecules that link together; the unit left behind in the chain is the *repeat unit*.",
      distractors: {
        b: "A repeat unit is what remains *inside* the chain after polymerization — not the starting molecule.",
        c: "Oligomers are short polymers (a few repeat units), not the building blocks.",
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
        { label: "a", text: "The double bond is only temporarily broken during polymerization." },
        { label: "b", text: "The formula is a convention — the structure is not known exactly." },
        { label: "c", text: "The double bond opens and two backbone single-bonded carbons remain in the chain." },
        { label: "d", text: "Polyethylene actually retains one double bond per repeat unit." }
      ],
      answer: "c",
      why: "Addition polymerization **opens the $\\pi$ bond** of $C{=}C$: each monomer carbon forms a new $\\sigma$ bond to its neighbours, leaving a saturated $\\text{–CH}_2\\text{–CH}_2\\text{–}$ repeat unit.",
      distractors: {
        d: "The product is saturated — no $C{=}C$ remains (that is why PE is chemically inert).",
        a: "The change is permanent and irreversible; the bond does not re-form.",
      },
      concept: "count atoms on the *repeat unit*, not the monomer",
      tags: ["confused"],
    },
    {
      id: "t1-03",
      type: "recall",
      diff: 1,
      text: "Which material is generally credited as the first fully synthetic polymer to be produced commercially?",
      options: [
        { label: "a", text: "Nylon 6,6 (1935)" },
        { label: "b", text: "Celluloid (cellulose nitrate, 1868)" },
        { label: "c", text: "Polyethylene (1933)" },
        { label: "d", text: "Bakelite (phenol–formaldehyde, 1909)" }
      ],
      answer: "d",
      why: "**Bakelite (1909, Baekeland)** was the first wholly man-made polymer — made entirely from synthetic small molecules, not from a natural polymer backbone.",
      distractors: {
        b: "Celluloid is **semi-synthetic**: it modifies natural cellulose.",
        a: "Nylon came more than two decades after Bakelite.",
      },
      tags: ["revision"],
    },
    {
      id: "t1-04",
      type: "compare",
      diff: 2,
      text: "For a typical vinyl polymer, which tacticity–morphology pairing is most likely?",
      options: [
        { label: "a", text: "Atactic chains are generally more crystallizable than isotactic chains." },
        { label: "b", text: "Isotactic chains are often crystallizable, whereas atactic chains are generally less able to crystallize." },
        { label: "c", text: "Tacticity has no influence on chain packing or crystallization." },
        { label: "d", text: "Isotactic and atactic chains must have identical crystallinity if their repeat units are identical." }
      ],
      answer: "b",
      why: "**Isotactic** chains have a regular stereochemical arrangement that can support close packing and crystallization. **Atactic** chains have irregular substituent placement, which usually disrupts regular packing. This is a tendency, not a guarantee: crystallinity also depends on chain structure and processing.",
      distractors: {
        a: "This reverses the usual effect: stereoregularity generally makes packing easier.",
        c: "Tacticity changes chain regularity and can strongly affect crystallizability.",
        d: "Identical repeat-unit chemistry does not imply identical stereoregularity or morphology."
      },
      concept: "tacticity = configurational regularity; regularity influences crystallizability",
      tags: ["confused"],
    },
    {
      id: "t1-05",
      type: "recall",
      diff: 1,
      text: "Nylon 6,6 gets its name because:",
      options: [
        { label: "a", text: "The diamine contains six carbon atoms, while the diacid contains ten, as in Nylon 6,10." },
        { label: "b", text: "The two numbers give the number of amide groups in each repeat unit." },
        { label: "c", text: "The diamine and the diacid used to make it each contain six carbon atoms." },
        { label: "d", text: "The two numbers specify the degree of polymerization of the finished nylon." }
      ],
      answer: "c",
      why: "The two numbers give the **carbon counts of the two monomers**: hexamethylenediamine has six carbon atoms, and adipic acid also has six. In Nylon 6,10, the diamine has six carbon atoms and the diacid has ten.",
      distractors: {
        a: "That is the monomer carbon-count pattern for Nylon 6,10, not Nylon 6,6.",
        b: "The numbers identify the carbon counts of the monomers, not the number of amide links.",
        d: "They do not specify chain length; a nylon chain contains many repeat units."
      },
      tags: ["revision"],
    },
    {
      id: "t1-06",
      type: "statement",
      diff: 2,
      text: "Which statement(s) about the relationship between monomers and repeat units is/are correct?",
      statements: [
        { num: 1, text: "The repeat unit is the structural unit that repeats along the polymer chain." },
        { num: 2, text: "In addition polymerization, the repeat unit usually contains the same atoms as the monomer." },
        { num: 3, text: "In condensation polymerization, the repeat structure contains monomer residues after loss of small molecule(s), such as water, where applicable." },
        { num: 4, text: "The degree of polymerization equals the total number of monomer molecules originally charged to the reactor." },
      ],
      options: [
        { label: "a", text: "1 and 4 only" },
        { label: "b", text: "1, 2 and 3 only" },
        { label: "c", text: "1, 2, 3 and 4" },
        { label: "d", text: "2, 3 and 4 only" }
      ],
      answer: "b",
      why: "Statements 1–3 are correct. Statement 4 is false: **DP describes the number of repeat units in an individual chain**, not the total monomer feed to the reactor.",
      distractors: {
        a: "Statement 2 is also correct for ordinary addition polymerization.",
        c: "Statement 4 confuses the DP of one chain with the total monomer feed.",
        d: "Statement 1 is also correct: it is the defining description of a repeat unit."
      },
      tags: ["confused"],
    },
    {
      id: "t1-07",
      type: "numerical",
      diff: 2,
      text: "Polyethylene chains have a number-average molecular weight $M_n = 56{,}000$ g/mol. Taking the repeat unit $\\text{–CH}_2\\text{–CH}_2\\text{–}$ ($M = 28$ g/mol), the number-average degree of polymerization is:",
      options: [
        { label: "a", text: "2.0 × 10³" },
        { label: "b", text: "2.8 × 10⁴" },
        { label: "c", text: "2.0 × 10²" },
        { label: "d", text: "5.6 × 10²" }
      ],
      answer: "a",
      why: "$DP_n = M_n / M_{repeat} = 56{,}000 / 28 = \\mathbf{2{,}000}$.",
      distractors: {
        c: "200 would need $M_n = 5{,}600$ — off by a factor of ten.",
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
        ["3", "Morphology (solid-state order)", "", "(iii) linear / branched / cross-linked"],
        ["4", "Molecular topology", "", "(iv) amorphous / (semi)crystalline"],
      ],
      options: [
        { label: "a", text: "1-ii, 2-i, 3-iv, 4-iii" },
        { label: "b", text: "1-i, 2-ii, 3-iii, 4-iv" },
        { label: "c", text: "1-ii, 2-i, 3-iii, 4-iv" },
        { label: "d", text: "1-iv, 2-iii, 3-i, 4-ii" },
      ],
      answer: "a",
      why: "Origin → natural/semi-synthetic/synthetic; thermal behaviour → thermoplastic/thermosetting; morphology → amorphous or (semi)crystalline; topology → linear/branched/cross-linked. These are different classification axes.",
      distractors: {
        c: "This swaps morphology and topology: amorphous/crystalline describes solid-state order, while linear/branched/cross-linked describes chain architecture.",
        b: "This mismatches the origin and thermal-behaviour categories as well as the two structural categories.",
        d: "This assigns each classification basis to an unrelated category set."
      },
      tags: ["revision"],
    },
    {
      id: "t1-09",
      type: "concept",
      diff: 2,
      text: "Why does LDPE have lower density and lower crystallinity than HDPE?",
      options: [
        { label: "a", text: "LDPE is a thermoset with cross-links." },
        { label: "b", text: "LDPE has a higher molecular weight." },
        { label: "c", text: "LDPE has stronger intermolecular forces." },
        { label: "d", text: "LDPE's long branches prevent chains from packing closely." }
      ],
      answer: "d",
      why: "LDPE's **branches** sterically block close packing → less crystalline → lower density. HDPE is essentially **linear** and packs efficiently (≈80% crystalline).",
      distractors: {
        a: "LDPE is a thermoplastic; branching ≠ cross-linking.",
        b: "Density here is set by packing, not by chain length.",
      },
      concept: "linear → HDPE (dense) · branched → LDPE (less dense)",
      tags: ["confused"],
    },
    {
      id: "t1-10",
      type: "concept",
      diff: 2,
      text: "Which change can alter a polymer's configurational stereochemistry rather than merely changing its conformation?",
      options: [
        { label: "a", text: "Rotation about a backbone carbon–carbon single bond." },
        { label: "b", text: "Heating the polymer above its glass-transition temperature." },
        { label: "c", text: "A chemical reaction that changes stereochemistry through covalent bond breaking and/or formation." },
        { label: "d", text: "Dissolving the polymer in a solvent without chemically reacting it." }
      ],
      answer: "c",
      why: "**Configuration** (for example, tacticity or cis/trans geometry) is fixed by the covalent structure and cannot normally change by simple bond rotation. Changing it requires a chemical process that alters the relevant bonding. Rotation about single bonds, heating, or dissolution can change **conformation** without changing configuration.",
      distractors: {
        a: "Single-bond rotation changes conformation, not configurational stereochemistry.",
        b: "Heating can increase segmental mobility and change conformation, but does not by itself change configuration.",
        d: "Dissolution changes the polymer's environment and conformation, not its covalent configuration."
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
      text: "In source-based copolymer nomenclature, what does the connective -co- indicate?",
      options: [
        { label: "a", text: "The monomer units follow a random sequence specifically." },
        { label: "b", text: "The monomer units alternate in a regular A–B sequence." },
        { label: "c", text: "The chain contains long blocks of each monomer." },
        { label: "d", text: "The copolymer sequence is unspecified or not stated." }
      ],
      answer: "d",
      why: "The connective **-co-** indicates a copolymer with an unspecified sequence arrangement. More specific connectives identify architectures such as **-ran-** (random) and **-alt-** (alternating); block copolymers are designated with **-block-**.",
      distractors: {
        a: "Random sequence is specified more narrowly by -ran-; -co- alone does not assert randomness.",
        b: "Alternating sequence is designated by -alt-.",
        c: "Block architecture requires a block descriptor; -co- alone does not specify it."
      },
      tags: ["revision"],
    },
    {
      id: "t1-13",
      type: "apply",
      diff: 3,
      text: "A reusable container must be softened by heating, reshaped by melt processing, and solidified by cooling after each use, without a curing reaction. Which polymer class is designed for this repeated processing route?",
      options: [
        { label: "a", text: "Thermoplastic polymer" },
        { label: "b", text: "Fully cured thermosetting polymer" },
        { label: "c", text: "Covalently vulcanized elastomer" },
        { label: "d", text: "Uncured thermosetting resin that forms an irreversible network during its first cure" }
      ],
      answer: "a",
      why: "A **thermoplastic** softens when heated and solidifies on cooling without undergoing an irreversible network-forming cure. This permits repeated melt processing, provided the processing temperature and conditions do not cause significant degradation.",
      distractors: {
        b: "A fully cured thermoset has a permanent covalent network; it does not melt and flow on reheating.",
        c: "Conventional vulcanization creates covalent cross-links that prevent the rubber from being remelted like a thermoplastic.",
        d: "An uncured thermosetting resin can flow during its initial shaping step, but curing creates an irreversible network; it cannot be repeatedly remelted after cure."
      },
      concept: "thermoplastic = melt-reprocessable · cured thermoset = infusible network",
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
        { label: "b", text: "Both A and R are true, and R is the correct explanation of A" },
        { label: "c", text: "Both A and R are true, but R is NOT the correct explanation of A" },
        { label: "d", text: "A is false, R is true" }
      ],
      answer: "b",
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
        { label: "b", text: "5 → 2 → 4 → 3 → 1" },
        { label: "c", text: "5 → 2 → 3 → 4 → 1" },
        { label: "d", text: "5 → 3 → 2 → 4 → 1" }
      ],
      answer: "c",
      why: "Celluloid **1868** → Bakelite **1909** → Staudinger's hypothesis **1920s** → Carothers' nylon work **1930s** → Ziegler–Natta **1950s**.",
      distractors: {
        d: "Staudinger (1920s) came after Bakelite (1909), not before.",
        b: "Carothers (1930s) came after Staudinger (1920s).",
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
        { label: "a", text: "1-i, 2-ii, 3-iii, 4-iv" },
        { label: "b", text: "1-ii, 2-iv, 3-i, 4-iii" },
        { label: "c", text: "1-ii, 2-i, 3-iv, 4-iii" },
        { label: "d", text: "1-iv, 2-iii, 3-ii, 4-i" }
      ],
      answer: "c",
      why: "POM = polyoxymethylene (polyacetal) · PET = polyethylene terephthalate · PMMA = poly(methyl methacrylate) · PTFE = polytetrafluoroethylene.",
      tags: ["revision"],
    },
    {
      id: "t1-17",
      type: "statement",
      diff: 2,
      text: "Which statement(s) about conventional, lightly cross-linked elastomers is/are correct?",
      statements: [
        { num: 1, text: "They are used in a rubbery state, typically well above their glass-transition temperature." },
        { num: 2, text: "Sparse cross-links help prevent permanent chain slippage under large deformation." },
        { num: 3, text: "They must be semicrystalline to recover after deformation." },
        { num: 4, text: "Their large-strain elastic recovery is substantially entropic in origin." },
      ],
      options: [
        { label: "a", text: "3 and 4 only" },
        { label: "b", text: "1, 2, 3 and 4" },
        { label: "c", text: "2 and 3 only" },
        { label: "d", text: "1, 2 and 4 only" }
      ],
      answer: "d",
      why: "Statements 1, 2 and 4 describe the usual behaviour of a conventional elastomer: it is in a rubbery state above Tg, sparse network junctions limit irreversible flow, and entropy drives much of its elastic recovery. Statement 3 is false: conventional elastomers are generally predominantly amorphous in service; crystallinity is not a requirement for elasticity.",
      distractors: {
        a: "Statement 1 is also correct for a conventional elastomer in its rubbery operating range, and statement 2 describes the role of network junctions.",
        b: "Statement 3 is false: crystallinity is not required for elastomeric recovery.",
        c: "Statement 1 is also correct, while statement 3 is false."
      },
      tags: ["confused"],
    },
    {
      id: "t1-18",
      type: "concept",
      diff: 3,
      text: "Why can step-growth polymerization of monomers with functionality greater than two produce a three-dimensional network?",
      options: [
        { label: "a", text: "A monomer with more than two reactive groups can connect multiple growth paths; at sufficient conversion and suitable stoichiometry, branching can reach the gel point and form a network." },
        { label: "b", text: "Any monomer with functionality greater than two forms a network immediately, even at very low conversion." },
        { label: "c", text: "Monomers with functionality greater than two react faster, and the higher reaction rate alone creates cross-links." },
        { label: "d", text: "The small molecules released during condensation physically glue otherwise linear chains into a network." }
      ],
      answer: "a",
      why: "Functionality is the number of reactive groups per monomer. Functionality above two permits branching. A macroscopic network forms only when conversion, stoichiometric balance and functionality allow the branched structures to reach the **gel point**; functionality above two does not guarantee an immediate network at every conversion.",
      distractors: {
        b: "Network formation is not instantaneous; sufficient reaction progress is needed to reach the gel point.",
        c: "The network arises from multifunctional covalent connectivity, not simply from a faster reaction rate.",
        d: "Condensation by-products do not glue the chains together; covalent bonds between multifunctional units create the network."
      },
      concept: "functionality > 2 enables branching; gelation depends on conversion and stoichiometry",
      tags: ["confused"],
    },
    {
      id: "t1-19",
      type: "recall",
      diff: 1,
      text: "Degree of polymerization (DP) is defined as the number of:",
      options: [
        { label: "a", text: "monomer molecules in the whole sample" },
        { label: "b", text: "chains in one mole of polymer" },
        { label: "c", text: "repeat units in one polymer chain" },
        { label: "d", text: "functional groups per repeat unit" }
      ],
      answer: "c",
      why: "**DP = repeat units per chain**; $M \\approx DP \\times M_{repeat}$.",
      distractors: {
        a: "The sample contains many chains, each with its own DP.",
      },
      tags: ["revision"],
    },
    {
      id: "t1-20",
      type: "compare",
      diff: 2,
      text: "Distinguish a *branched* polymer from a *cross-linked* polymer.",
      options: [
        { label: "a", text: "A branch extends from one backbone; a cross-link forms a covalent bridge between separate chains." },
        { label: "b", text: "Branching and cross-linking are both side chains on one molecule; neither connects two separate polymer chains." },
        { label: "c", text: "Branches are intermolecular attractions between chains, while cross-links are weak intramolecular side chains." },
        { label: "d", text: "The terms describe the same architecture; both mean a polymer with more than one linear chain segment." }
      ],
      answer: "a",
      why: "**Branching** = a side-chain growing from one backbone (LDPE). **Cross-linking** = a covalent bridge joining two *separate* chains, forming a 3-D network (vulcanized rubber, thermosets).",
      distractors: {
        c: "Branches are covalent too — they are made during polymerization.",
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
        { label: "a", text: "113" },
        { label: "b", text: "200" },
        { label: "c", text: "50" },
        { label: "d", text: "1{,}130" }
      ],
      answer: "b",
      why: "$DP_n = 22{,}600 / 113 = \\mathbf{200}$.",
      distractors: {
        c: "50 corresponds to $M_n = 5{,}650$.",
        a: "113 is the repeat-unit mass itself, not the ratio.",
      },
      concept: "$DP = M_n / M_{repeat}$",
      tags: ["numeric", "formula"],
    },
    {
      id: "t1-22",
      type: "graph",
      diff: 3,
      text: "A tensile-strength-versus-DP plot for one polymer gives: DP 20 → 5 MPa; DP 100 → 25 MPa; DP 400 → 45 MPa; DP 2000 → 47 MPa. What does the small increase from DP 400 to DP 2000 indicate for this material?",
      tableRows: [
        ["DP", "20", "100", "400", "2000"],
        ["Tensile strength (MPa)", "5", "25", "45", "47"],
      ],
      options: [
        { label: "a", text: "Polymerization must stop at DP 400, so longer chains cannot be produced." },
        { label: "b", text: "Tensile strength is approaching a plateau in this range, so increasing chain length further gives only a small additional strength increase." },
        { label: "c", text: "All chains become completely crystalline at DP 400, fixing the tensile strength thereafter." },
        { label: "d", text: "The data prove that tensile strength must decrease whenever DP exceeds 400." }
      ],
      answer: "b",
      why: "The data show **diminishing returns in tensile strength** as DP increases from 400 to 2000. The plot establishes a tensile-strength plateau for this sample, but it does not by itself identify the mechanism. Chain entanglement and more effective load transfer are possible explanations; other properties, such as melt viscosity, need not show the same plateau.",
      distractors: {
        a: "The plotted property approaches a plateau; that does not mean polymerization is unable to produce longer chains.",
        c: "The data contain no crystallinity measurement, and the strength plateau does not prove complete crystallization.",
        d: "The strength rises slightly from 45 MPa to 47 MPa; it does not decrease."
      },
      concept: "property-specific diminishing returns with increasing degree of polymerization",
      tags: ["confused"],
    },
    {
      id: "t1-23",
      type: "apply",
      diff: 3,
      text: "An engineering component must resist dissolving during repeated solvent exposure; limited swelling is acceptable. Which polymer architecture is most appropriate?",
      options: [
        { label: "a", text: "High-molecular-weight linear thermoplastic" },
        { label: "b", text: "Highly crystalline linear thermoplastic" },
        { label: "c", text: "Covalently cross-linked polymer network" },
        { label: "d", text: "Uncross-linked branched thermoplastic" }
      ],
      answer: "c",
      why: "A covalently cross-linked network cannot dissolve into separate chains because its chains are joined into one macroscopic structure. It may **swell** as solvent enters the network, so the stem correctly allows limited swelling. Uncross-linked thermoplastics can dissolve in suitable solvents.",
      distractors: {
        a: "Low-molecular-weight linear chains are generally easier, not harder, to dissolve once a compatible solvent is present.",
        b: "Without permanent network junctions, compatible solvent molecules can separate and solvate the chains.",
        d: "Branching alone does not create a permanent network; an uncross-linked branched polymer can still dissolve."
      },
      concept: "covalent network → insoluble but potentially swellable",
      tags: ["revision"],
    },
    {
      id: "t1-24",
      type: "match",
      diff: 2,
      text: "Match each polymer example with its most characteristic broad material class.",
      tableRows: [
        ["1", "Polyethylene", "", "(i) thermosetting polymer"],
        ["2", "Bakelite (phenolic resin)", "", "(ii) elastomer"],
        ["3", "Vulcanized natural rubber", "", "(iii) thermoplastic"],
        ["4", "Styrene–butadiene–styrene (SBS)", "", "(iv) thermoplastic elastomer"],
      ],
      options: [
        { label: "a", text: "1-iii, 2-i, 3-ii, 4-iv" },
        { label: "b", text: "1-i, 2-iii, 3-iv, 4-ii" },
        { label: "c", text: "1-ii, 2-i, 3-iii, 4-iv" },
        { label: "d", text: "1-iii, 2-ii, 3-i, 4-iv" }
      ],
      answer: "a",
      why: "Polyethylene is a **thermoplastic**; cured Bakelite is a **thermoset**; vulcanized natural rubber is a covalently cross-linked **elastomer**; and SBS is a **thermoplastic elastomer** whose physical polystyrene domains act as reversible junctions.",
      distractors: {
        b: "This assigns polyethylene to thermoset and vulcanized rubber to thermoplastic elastomer.",
        c: "This incorrectly classifies polyethylene as an elastomer and vulcanized rubber as a thermoplastic.",
        d: "This swaps the classifications of Bakelite and vulcanized natural rubber."
      },
      tags: ["revision"],
    },
    {
      id: "t1-25",
      type: "concept",
      diff: 2,
      text: "Why is a *thermoplastic elastomer* like SBS reprocessable even though it behaves like a vulcanized rubber in service?",
      options: [
        { label: "a", text: "It has chemical cross-links that break at low temperature." },
        { label: "b", text: "It contains no cross-links of any kind — the rubbery behaviour is an illusion." },
        { label: "c", text: "It slowly reverts to a liquid at body temperature." },
        { label: "d", text: "Its cross-links are physical (glassy PS domains) that disassemble on heating." }
      ],
      answer: "d",
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
      text: "Poly(vinyl acetate) is saponified to PVA, which is then blended with starch for a biodegradable film. Which pair correctly identifies the chemistry of the two operations?",
      options: [
        { label: "a", text: "Condensation polymerization, followed by a second condensation reaction between PVA and starch." },
        { label: "b", text: "Addition polymerization, followed by copolymerization of PVA with starch." },
        { label: "c", text: "Radical chain scission, followed by covalent graft polymerization of starch onto PVA." },
        { label: "d", text: "Hydrolysis (saponification), followed by physical blending of PVA with starch." }
      ],
      answer: "d",
      why: "Saponification converts acetate ester groups on PVAc into hydroxyl groups by **hydrolysis**. Blending PVA with starch is a physical mixing operation unless a separate chemical reaction is specified.",
      distractors: {
        a: "Neither operation is a new condensation polymerization: the first modifies existing PVAc chains, and the second is stated as blending.",
        b: "The PVAc-to-PVA conversion is not addition polymerization, and blending does not make starch a comonomer.",
        c: "The described conversion is not radical chain scission, and no grafting reaction is specified."
      },
      concept: "polymer-analogous reaction vs polymerization vs physical blending",
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
            "text": "physically blending natural and synthetic polymers without chemically modifying either."
        },
        {
            "label": "b",
            "text": "using a natural polymer without chemically changing its structure."
        },
        {
            "label": "c",
            "text": "chemically modifying a naturally occurring polymer backbone."
        },
        {
            "label": "d",
            "text": "polymerizing synthetic monomers without a natural-polymer precursor."
        }
      ],
      "answer": "c",
      "why": "Semi-synthetic polymers are made by chemically modifying a natural polymer, as in cellulose acetate or cellulose nitrate. A physical blend does not make either component semi-synthetic.",
      "distractors": {
        "b": "That remains a natural polymer in its unmodified form.",
        "d": "That describes a fully synthetic polymer.",
        "a": "That describes a polymer blend rather than a chemically modified natural polymer."
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
        { label: "b", text: "2 and 3 only" },
        { label: "c", text: "3 and 4 only" },
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
        { label: "b", text: "Alternating: strict –A–B–A–B–; random: A and B in statistically irregular sequence." },
        { label: "c", text: "Alternating has more A than B; random has equal amounts." },
        { label: "d", text: "There is no difference — the terms are interchangeable." }
      ],
      answer: "b",
      why: "**Alternating** (…*alt*…) has a fixed A/B alternation; **random** (*co*) has irregular, statistically governed sequencing — the same overall composition, different order.",
      tags: ["revision"],
    },
    {
      id: "t1-30",
      type: "numerical",
      diff: 3,
      text: "A binary addition copolymer contains 40 mol% monomer A ($M_A = 100$ g/mol) and 60 mol% monomer B ($M_B = 50$ g/mol). Assuming no small molecule is eliminated during polymerization, the average molar mass per incorporated repeat-unit residue is:",
      options: [
        { label: "a", text: "70 g/mol" },
        { label: "b", text: "65 g/mol" },
        { label: "c", text: "75 g/mol" },
        { label: "d", text: "50 g/mol" }
      ],
      answer: "a",
      why: "For this addition copolymer, the incorporated residues retain the monomer atoms. The composition-weighted average is $M = 0.40(100) + 0.60(50) = 40 + 30 = \\mathbf{70}$ g/mol per incorporated residue.",
      distractors: {
        b: "65 g/mol does not follow from the stated mole fractions and molar masses.",
        c: "75 g/mol is the equal-mole average: 0.50(100) + 0.50(50).",
        d: "50 g/mol is only the molar mass of monomer B and ignores monomer A."
      },
      concept: "$\\overline{M}_{residue} = \\sum x_i M_i$ for addition copolymerization",
      tags: ["numeric", "formula"],
    },
    {
      id: "t1-31",
      type: "concept",
      diff: 2,
      text: "Why can the *same* base polymer be sold both as a rigid engineering plastic and as a soft elastomer?",
      options: [
        { label: "a", text: "The two products must have different repeat-unit chemistry, because one polymer backbone cannot be formulated across different properties." },
        { label: "b", text: "A single polymer chemistry cannot be made rigid or elastomeric; its properties remain fixed after the monomer has been chosen." },
        { label: "c", text: "Suppliers use different test definitions for stiffness, so the apparent rigid-plastic and elastomer grades are mechanically identical." },
        { label: "d", text: "Formulation and morphology can be tuned with plasticizer, reinforcement, crystallinity and cross-linking to change stiffness and elasticity." }
      ],
      answer: "d",
      why: "The **balance** of intermolecular forces, chain flexibility, crystallinity and cross-link density decides the end use. The same chemistry can be moved across the plastic–elastomer space by compounding and structure control.",
      concept: "property requirements drive polymer utilization (Module 2 §1)",
      tags: ["revision"],
    },
    {
      id: "t1-32",
      type: "higher",
      diff: 4,
      text: "Two specimens are made from the same thermosetting resin formulation. Specimen X has completed its cure and is infusible; specimen Y is still an uncured, flowable prepolymer that can be shaped before cure. Why can Y be shaped while X cannot be remelted?",
      options: [
        { label: "a", text: "The specimens must have different repeat-unit chemistry, because a thermoset cannot be processed before curing." },
        { label: "b", text: "Curing converts the flowable prepolymer into a permanent network; before cure, the resin can flow, but after cure it cannot be remelted." },
        { label: "c", text: "Both specimens are fully cured thermosets; specimen Y flows because it has a lower molecular weight." },
        { label: "d", text: "Covalent cross-links contract on cooling and become reversible when the cured resin is reheated." }
      ],
      answer: "b",
      why: "Thermosetting systems are commonly shaped while they are still **uncured, flowable resins or prepolymers**. The cure reaction then forms a covalently connected network. Once fully cured, the material does not melt and flow on reheating; excessive heat eventually causes degradation.",
      distractors: {
        a: "The same formulation can be processable before cure and infusible after cure; the chemical state changes during curing.",
        c: "The key distinction is the extent of cure and network formation, not merely molecular weight.",
        d: "Conventional thermoset cross-links are not reversible simply by cooling and reheating."
      },
      concept: "flowable prepolymer → irreversible cure → infusible network",
      tags: ["confused"],
    },
  ],
};

export default T1;
