import type { TopicSource } from "../../mt203/types";

/**
 * MT203 — Topic 7: Polymer Chemistry of Proteins
 * Source: Module 1 §5. 16 questions.
 */
const T7: TopicSource = {
  id: "t7",
  module: "m1",
  title: "Polymer Chemistry of Proteins",
  subtitle: "Topic 7 · natural polyamides: structure levels, collagen, keratin, fibroin",
  subs: [
    { id: "T7.1", title: "Amino acids & the peptide bond" },
    { id: "T7.2", title: "Primary → quaternary structure" },
    { id: "T7.3", title: "Collagen, keratin, fibroin, gelatin" },
    { id: "T7.4", title: "Denaturation, cross-linking, uses" },
  ],
  questions: [
    {
      id: "t7-01",
      type: "recall",
      diff: 1,
      text: "Proteins are natural polymers whose repeat linkage is the:",
      options: [
        { label: "a", text: "Ester linkage (–CO–O–), formed from carboxyl and hydroxyl groups during polyester chain growth." },
        { label: "b", text: "Amide or peptide linkage (–CO–NH–), formed when amino-acid carboxyl and amino groups join." },
        { label: "c", text: "Carbon–carbon single bond (–C–C–), the principal backbone linkage in common vinyl addition polymers." },
        { label: "d", text: "Ether linkage (–C–O–C–), the principal repeat linkage in polyethers and many polysaccharides." }
      ],
      answer: "b",
      why: "Amino acids condense head-to-tail to give the **amide (peptide) linkage** — chemically the same bond as in nylon, which is why proteins are natural polyamides.",
      tags: ["revision"],
    },
    {
      id: "t7-02",
      type: "match",
      diff: 2,
      text: "Match each level of protein structure with its description.",
      tableRows: [
        ["1", "Primary", "", "(i) amino-acid sequence"],
        ["2", "Secondary", "", "(ii) α-helix / β-sheet, held by H-bonds"],
        ["3", "Tertiary", "", "(iii) overall 3-D fold of one chain"],
        ["4", "Quaternary", "", "(iv) assembly of several folded chains"],
      ],
      options: [
        { label: "a", text: "1-i, 2-ii, 3-iv, 4-iii" },
        { label: "b", text: "1-i, 2-ii, 3-iii, 4-iv" },
        { label: "c", text: "1-iii, 2-iv, 3-i, 4-ii" },
        { label: "d", text: "1-ii, 2-i, 3-iv, 4-iii" }
      ],
      answer: "b",
      why: "Sequence (primary) → local H-bonded patterns (secondary) → whole-chain 3-D fold (tertiary) → multi-subunit assembly (quaternary).",
      tags: ["revision"],
    },
    {
      id: "t7-03",
      type: "concept",
      diff: 2,
      text: "In the α-helix, the structure is stabilized by:",
      options: [
        { label: "a", text: "Covalent cross-links between side chains at each turn, which make the helical backbone rigid under load." },
        { label: "b", text: "Intrachain hydrogen bonds join a residue's C=O group to the N–H group four residues ahead along the chain." },
        { label: "c", text: "Disulfide bridges between cysteine side chains connect the helix into a fixed covalent structure." },
        { label: "d", text: "Van der Waals attractions alone stabilize it, without directional hydrogen bonds between backbone groups." }
      ],
      answer: "b",
      why: "The helix repeats every **3.6 residues**, held by intra-chain H-bonds from the backbone $\\text{C}{=}\\text{O}$ to the $\\text{N–H}$ four residues along — H-bonds, not covalent links.",
      concept: "α-helix: intrachain H-bonds, 3.6 residues/turn",
      tags: ["revision"],
    },
    {
      id: "t7-04",
      type: "compare",
      diff: 2,
      text: "Which statement correctly contrasts the α-helix and the β-sheet?",
      options: [
        { label: "a", text: "Both structures are stabilized mainly by disulfide cross-links between side chains, rather than backbone hydrogen bonding." },
        { label: "b", text: "β-sheets occur only in collagen, while α-helices occur only in synthetic polymers and not in natural proteins." },
        { label: "c", text: "An α-helix has a coiled backbone with intrachain H-bonds; β-sheets align extended strands with interstrand H-bonds." },
        { label: "d", text: "An α-helix uses interchain hydrogen bonds exclusively, while a β-sheet uses only intrachain bonds along one strand." }
      ],
      answer: "c",
      why: "The helix coils with H-bonds *within* one chain; the sheet is a flat arrangement of *adjacent* chains H-bonded across. Silk fibroin is the classic β-sheet protein; keratin is largely α-helical.",
      concept: "helix = intra · sheet = inter",
      tags: ["confused"],
    },
    {
      id: "t7-05",
      type: "concept",
      diff: 2,
      text: "Collagen is a fibrous protein built as:",
      options: [
        { label: "a", text: "A stacked β-sheet architecture in which extended strands create the characteristic load-bearing structure of collagen." },
        { label: "b", text: "A single α-helix, like α-keratin, with intrachain hydrogen bonds stabilizing the whole collagen fibre." },
        { label: "c", text: "A triple helix of three chains, stabilized by glycine-rich repeats and hydroxyproline." },
        { label: "d", text: "A random-coil chain lacking an ordered secondary structure, held together mainly by nonspecific entanglement." }
      ],
      answer: "c",
      why: "Three left-handed helices wind into a **triple helix** whose tight packing needs the small residue **glycine** every third position; proline/hydroxyproline stiffen it. Hydrogen bonds (via water) stabilize the triple helix.",
      concept: "Gly-X-Y repeat; glycine is mandatory in position 1",
      tags: ["revision"],
    },
    {
      id: "t7-06",
      type: "recall",
      diff: 1,
      text: "The chemical bond responsible for setting and permanent waving of hair (keratin) is the:",
      options: [
        { label: "a", text: "Hydrogen bonds between peptide groups, which stabilize secondary structure but do not permanently set the hair shape." },
        { label: "b", text: "Peptide bonds joining amino acids in the backbone, which are not the bonds rearranged during a permanent wave." },
        { label: "c", text: "Disulfide (–S–S–) cross-links between cysteine residues, which can be reduced and re-formed after reshaping." },
        { label: "d", text: "Ionic salt bridges between charged side chains, which are disrupted by pH but are not the principal perm-setting bonds." }
      ],
      answer: "c",
      why: "**Disulfide bridges** between cysteine residues (→ cystine) cross-link keratin. Waving reduces S–S to –SH, reshapes, then re-oxidizes into new S–S pairs.",
      tags: ["revision"],
    },
    {
      id: "t7-07",
      type: "concept",
      diff: 3,
      text: "Explain chemically what happens during a 'permanent wave'.",
      options: [
        { label: "a", text: "Heat alone melts the keratin fibre and reforms disulfide bridges without a reducing or oxidizing step." },
        { label: "b", text: "Peptide bonds in the protein backbone are broken and rebuilt, changing primary structure during the perming process." },
        { label: "c", text: "Reduction cleaves disulfide bonds to thiols; after reshaping, oxidation forms new disulfide cross-links." },
        { label: "d", text: "Water adds across disulfide bonds, while evaporation removes oxygen and locks in the new coil geometry." }
      ],
      answer: "c",
      why: "Reduce (–S–S– → 2 –SH) → shape → oxidize (2 –SH → new –S–S–). Because the **primary structure (peptide bonds) is untouched**, the change is permanent but reversible by the same chemistry.",
      concept: "reduce → reshape → reoxidize",
      tags: ["confused"],
    },
    {
      id: "t7-08",
      type: "recall",
      diff: 1,
      text: "Silk fibroin's outstanding tensile strength comes from its:",
      options: [
        { label: "a", text: "Antiparallel β-sheet crystallites pack fibroin chains closely and provide strong intermolecular hydrogen bonding." },
        { label: "b", text: "Disulfide cross-links form a dense covalent network throughout fibroin, as they do in many keratin-rich fibres." },
        { label: "c", text: "Random-coil segments dominate the load-bearing structure, allowing the chains to stretch without ordered packing." },
        { label: "d", text: "A collagen-like triple helix aligns three chains into a rope, which is the defining structure of silk fibroin." }
      ],
      answer: "a",
      why: "Fibroin's chains lie in **antiparallel β-sheets** with dense inter-chain H-bonding, giving high axial strength with limited elasticity (contrast the α-helical, extensible wool).",
      tags: ["revision"],
    },
    {
      id: "t7-09",
      type: "concept",
      diff: 2,
      text: "Denaturation of a protein by heat or acid destroys:",
      options: [
        { label: "a", text: "All covalent bonds" },
        { label: "b", text: "The secondary and tertiary structure, leaving the primary sequence intact" },
        { label: "c", text: "Nothing — it is only a physical change in shape with no chemical meaning" },
        { label: "d", text: "The primary structure" }
      ],
      answer: "b",
      why: "Denaturation unfolds the chain by breaking **H-bonds and other non-covalent interactions** (and sometimes S–S); the peptide-bond sequence is not hydrolysed. Hence boiled egg white is insoluble but chemically still protein.",
      concept: "denaturation = loss of conformation, not of sequence",
      tags: ["confused"],
    },
    {
      id: "t7-10",
      type: "apply",
      diff: 3,
      text: "Gelatin is produced from collagen by:",
      options: [
        { label: "a", text: "Heat alone melts the hair fibre and permanently reforms disulfide bridges without a chemical redox step." },
        { label: "b", text: "Peptide bonds in the protein backbone are severed and rebuilt during perming, changing its primary structure." },
        { label: "c", text: "Disulfide bonds are oxidized first; a reducing agent then locks the reshaped fibre into its new conformation." },
        { label: "d", text: "Reduction cleaves disulfides to thiols; after the fibre is reshaped, oxidation forms new disulfide cross-links." }
      ],
      answer: "d",
      why: "**Partial** breakdown of collagen gives soluble gelatin chains. On cooling they associate into junction zones → a **thermoreversible physical gel** (melts on re-heating) — the basis of jellies and photographic coatings.",
      concept: "physical gel: heat-reversible network",
      tags: ["confused"],
    },
    {
      id: "t7-11",
      type: "statement",
      diff: 2,
      text: "Which statement(s) about protein-based materials is/are correct?",
      statements: [
        { num: 1, text: "Casein from milk was historically used with formaldehyde to make 'galalith' buttons." },
        { num: 2, text: "Zein from maize is a hydrophobic protein used in coatings and films." },
        { num: 3, text: "Formaldehyde cross-links proteins by reacting with amino (–NH₂) groups, hardening them (as in leather tanning)." },
        { num: 4, text: "Proteins contain no nitrogen." },
      ],
      options: [
        { label: "a", text: "4 only" },
        { label: "b", text: "1, 2, 3 and 4" },
        { label: "c", text: "2 and 4 only" },
        { label: "d", text: "1, 2 and 3 only" }
      ],
      answer: "d",
      why: "1–3 correct. Item 4 is false — the **amide nitrogen** of every peptide bond makes nitrogen a defining element of protein composition.",
      distractors: {
        b: "Item 4 denies the amide linkage itself.",
      },
      tags: ["revision"],
    },
    {
      id: "t7-12",
      type: "assertreason",
      diff: 3,
      assertion: "Wool garments shrink irreversibly and 'felt' when washed in hot soapy water with agitation.",
      reason: "The external scales of the wool (α-keratin) fibres interlock, and heat plus moisture allow the fibres to stretch and entangle permanently.",
      options: [
        { label: "a", text: "A is true, R is false" },
        { label: "b", text: "Both A and R are true, but R is NOT the correct explanation of A" },
        { label: "c", text: "A is false, R is true" },
        { label: "d", text: "Both A and R are true, and R is the correct explanation of A" }
      ],
      answer: "d",
      why: "The **scales** give direction-dependent friction; agitation + heat/moisture let fibres slip, entangle and lock — an irreversible densification (the reason for shrink-proof chemical treatments).",
      concept: "felting: scales + mobility",
      tags: ["revision"],
    },
    {
      id: "t7-13",
      type: "concept",
      diff: 2,
      text: "Why are proteins classified as condensation polymers?",
      options: [
        { label: "a", text: "Their backbones form by opening carbon–carbon double bonds in an ethylene-like monomer without eliminating a small molecule." },
        { label: "b", text: "They are made from only two monomers; the number of distinct monomers, rather than bond chemistry, defines condensation." },
        { label: "c", text: "They contain double bonds along the backbone, and each double bond releases oxygen when the chains join together." },
        { label: "d", text: "Peptide links form by joining amino and carboxyl groups with loss of a small molecule, conventionally water." }
      ],
      answer: "d",
      why: "Bond formation is $\\text{–COOH} + \\text{H}_2\\text{N–} \\rightarrow \\text{–CO–NH–} + \\text{H}_2\\text{O}$ — a **condensation** producing water, exactly like nylon formation.",
      concept: "amide formation = condensation + H₂O",
      tags: ["revision"],
    },
    {
      id: "t7-14",
      type: "numerical",
      diff: 3,
      text: "A polypeptide contains 100 amino-acid residues. Taking the average residue molar mass as 110 g/mol, its approximate molecular weight is:",
      options: [
        { label: "a", text: "11,000 g/mol" },
        { label: "b", text: "5,500 g/mol" },
        { label: "c", text: "1,100 g/mol" },
        { label: "d", text: "110,000 g/mol" }
      ],
      answer: "a",
      why: "$M \\approx 100 \\times 110 = \\mathbf{11{,}000}$ g/mol (11 kDa) — the standard residue-mass estimate for protein MW.",
      distractors: {
        c: "1,100 g/mol corresponds to only 10 residues.",
      },
      concept: "$M_{protein} \\approx n_{residues}\\times110$ Da",
      tags: ["numeric"],
    },
    {
      id: "t7-15",
      type: "apply",
      diff: 3,
      text: "To harden a water-soluble protein into a durable, insoluble plastic (as in early casein buttons), the correct treatment is:",
      options: [
        { label: "a", text: "Cross-link protein chains, for example with formaldehyde, to form an insoluble three-dimensional network." },
        { label: "b", text: "Add a low-molecular-weight plasticizer to loosen chain packing and soften the protein without creating a network." },
        { label: "c", text: "Dissolve the protein in excess water so hydration permanently converts the soluble chains into an insoluble solid." },
        { label: "d", text: "Cool it below its glass transition so the flexible protein chains become permanently insoluble without reaction." }
      ],
      answer: "a",
      why: "**Formaldehyde bridges amino groups** into methylene cross-links, turning soluble protein into a thermoset network insoluble in water — the chemistry of galalith and of leather tanning.",
      concept: "protein cross-linking → insolubility & hardness",
      tags: ["revision"],
    },
        {
      "id": "t7-16",
      "type": "higher",
      "diff": 4,
      "text": "Collagen from cold-water fish commonly has a lower denaturation temperature than collagen from warm-water species. Which material-chemistry explanation best fits this trend?",
      "options": [
        {
          "label": "a",
          "text": "Lower imino-acid/hydroxyproline content and less stabilising water-mediated interaction can reduce cold-adapted collagen stability."
        },
        {
          "label": "b",
          "text": "Hydroxyproline destabilises the triple helix, so removing it normally raises the denaturation temperature."
        },
        {
          "label": "c",
          "text": "A lower denaturation temperature reflects fewer peptide bonds, even when the triple-helix sequence is otherwise identical."
        },
        {
          "label": "d",
          "text": "Denaturation temperature is fixed by water’s boiling point; amino-acid composition and water bridges do not matter."
        }
      ],
      "answer": "a",
      "why": "Collagen stability depends on sequence and composition, including proline/hydroxyproline content and water-mediated interactions. Cold-adapted fish collagen commonly has less thermal stabilisation, so it can denature at a lower temperature.",
      "distractors": {
        "c": "A lower denaturation temperature does not imply missing peptide bonds; collagen’s primary linkage is still the peptide bond.",
        "b": "Hydroxyproline generally contributes to collagen triple-helix stability rather than universally disrupting it.",
        "d": "Protein denaturation temperature depends on molecular sequence and interactions, not simply the boiling point of the solvent."
      },
      "concept": "composition and thermal stability of protein materials",
      "tags": [
        "reviewed"
      ]
    },
  ],
};

export default T7;
