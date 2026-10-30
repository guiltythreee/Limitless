import type { TopicSource } from "../../mt203/types";

/**
 * MT203 — Topic 8: Industrial Polymers
 * Source: Module 2 §1–4. 30 questions.
 */
const T8: TopicSource = {
  id: "t8",
  module: "m2",
  title: "Industrial Polymers",
  subtitle: "Topic 8 · commodity plastics, engineering plastics, rubbers and their selection",
  subs: [
    { id: "T8.1", title: "Polyolefins (PE, PP)" },
    { id: "T8.2", title: "Vinyl & styrenic polymers (PVC, PS, ABS)" },
    { id: "T8.3", title: "Engineering plastics (PA, PET, PC, POM, PMMA, PTFE)" },
    { id: "T8.4", title: "Thermosets & rubbers (PF, UF, epoxy, SBR, EPDM)" },
    { id: "T8.5", title: "Application-driven selection" },
  ],
  questions: [
    {
      id: "t8-01",
      type: "recall",
      diff: 1,
      text: "LDPE is industrially produced by:",
      options: [
        {
            label: "a",
            text: "Melt polycondensation",
        },
        {
            label: "b",
            text: "High-pressure free-radical polymerization giving branched chains",
        },
        {
            label: "c",
            text: "Ziegler–Natta low-pressure polymerization",
        },
        {
            label: "d",
            text: "Anionic living polymerization",
        }
      ],
      answer: "b",
      why: "LDPE is made by **high-pressure (150–300 MPa) free-radical** polymerization; the harsh conditions produce long-chain branching. HDPE uses low-pressure coordination catalysts and comes out linear.",
      tags: ["revision"],
    },
    {
      id: "t8-02",
      type: "concept",
      diff: 2,
      text: "Polypropylene is frequently used for integral living hinges in moulded containers. Which feature most directly supports repeated flexing of a properly designed hinge?",
      options: [
        {
            label: "a",
            text: "Its high modulus prevents local strain from developing in the hinge region.",
        },
        {
            label: "b",
            text: "A permanent thermoset network suppresses molecular motion during each flex cycle.",
        },
        {
            label: "c",
            text: "Its glass-transition temperature is above service temperature, so the hinge remains glassy during flexing.",
        },
        {
            label: "d",
            text: "Good flex-fatigue resistance, combined with a thin and suitably oriented hinge section, supports repeated bending.",
        }
      ],
      answer: "d",
      why: "A well-designed polypropylene hinge can survive repeated bending because the material has good flex-fatigue resistance and processing can orient chains across the hinge. Geometry and moulding conditions still matter.",
      tags: [
        "reviewed"
      ],
      distractors: {
        c: "PP’s glass-transition temperature is below typical use temperature; a glassy hinge would be less able to flex repeatedly.",
        a: "A hinge necessarily develops local bending strain, so modulus alone does not explain repeated-flexure life.",
        b: "Polypropylene is a thermoplastic; a permanent thermoset network does not explain its living-hinge performance.",
      },
      concept: "living hinges and flex fatigue",
    },
    {
      id: "t8-03",
      type: "recall",
      diff: 1,
      text: "The largest single application of PVC is in:",
      options: [
        { label: "a", text: "food packaging film" },
        { label: "b", text: "tyres" },
        { label: "c", text: "rigid pipes, profiles and window frames, plus plasticized cable insulation" },
        { label: "d", text: "textile fibres" }
      ],
      answer: "c",
      why: "**Rigid, unplasticized PVC** dominates pipes, profiles and window frames; with plasticizer it becomes flexible **cable insulation**, hoses and flooring. PVC's chlorine content also gives it inherent flame resistance.",
      tags: ["revision"],
    },
    {
      id: "t8-04",
      type: "compare",
      diff: 2,
      text: "Which sequence lists the three styrenic materials from most brittle to toughest?",
      options: [
        {
            label: "a",
            text: "All are equally brittle",
        },
        {
            label: "b",
            text: "ABS → HIPS → GPPS",
        },
        {
            label: "c",
            text: "HIPS → GPPS → ABS",
        },
        {
            label: "d",
            text: "GPPS → HIPS → ABS",
        }
      ],
      answer: "d",
      why: "**GPPS** (general-purpose PS) is glass-clear but brittle; **HIPS** adds polybutadiene rubber particles to absorb energy; **ABS** adds acrylonitrile (heat/chemical resistance) to the butadiene-toughened styrene system → the toughest of the three.",
      concept: "PS → HIPS → ABS = escalating toughness",
      tags: ["revision"],
    },
    {
      id: "t8-05",
      type: "concept",
      diff: 2,
      text: "Which three monomers form ABS (acrylonitrile–butadiene–styrene) terpolymer?",
      options: [
        {
            label: "a",
            text: "Acrylamide, butadiene and styrene",
        },
        {
            label: "b",
            text: "Acrylonitrile, styrene and methyl methacrylate",
        },
        {
            label: "c",
            text: "Acrylonitrile, butadiene and styrene",
        },
        {
            label: "d",
            text: "Acrylonitrile, butadiene and ethylene",
        }
      ],
      answer: "c",
      why: "ABS is named from its three monomer components: acrylonitrile, butadiene and styrene. Acrylonitrile contributes chemical resistance, butadiene provides rubber toughening, and styrene supports processability and rigidity.",
      tags: [
        "reviewed"
      ],
      distractors: {
        d: "Ethylene replaces styrene and does not give the ABS terpolymer composition.",
        a: "Acrylamide replaces acrylonitrile; it is not the monomer trio represented by ABS.",
        b: "Methyl methacrylate belongs to acrylic polymer chemistry, not the butadiene-containing ABS monomer set.",
      },
      concept: "ABS composition and component roles",
    },
    {
      id: "t8-06",
      type: "apply",
      diff: 3,
      text: "A transparent, impact-resistant window for a machine guard is required. Best choice:",
      options: [
        {
            label: "a",
            text: "Untreated PMMA",
        },
        {
            label: "b",
            text: "HDPE",
        },
        {
            label: "c",
            text: "Polycarbonate (PC)",
        },
        {
            label: "d",
            text: "GPPS",
        }
      ],
      answer: "c",
      why: "**Polycarbonate** combines high optical clarity with outstanding impact strength (its notched Izod is ~600–900 J/m) — the standard for machine guards, safety goggles and helmet visors. PMMA is clearer but far more brittle.",
      distractors: {
        d: "GPPS is clear but extremely brittle — it shatters.",
        a: "PMMA has excellent optics but poor impact resistance.",
      },
      concept: "transparency + toughness → PC",
      tags: ["revision"],
    },
    {
      id: "t8-07",
      type: "recall",
      diff: 1,
      text: "Which polymer is famously used as a non-stick coating and is therefore processed by sintering or paste extrusion rather than melting?",
      options: [
        {
            label: "a",
            text: "Polytetrafluoroethylene (PTFE)",
        },
        {
            label: "b",
            text: "Polyethylene",
        },
        {
            label: "c",
            text: "Polystyrene",
        },
        {
            label: "d",
            text: "Nylon 6",
        }
      ],
      answer: "a",
      why: "**PTFE** has an extremely high melt viscosity (strong C–F bonds, rigid rod-like chains) so it does not flow even above its ~327 °C Tm. It is consolidated by **compression sintering**, or made into tape by **paste extrusion**.",
      concept: "PTFE: no true melt processing",
      tags: ["revision"],
    },
    {
      id: "t8-08",
      type: "concept",
      diff: 3,
      text: "Nylon 6,6 is strong because of H-bonding between chains, yet it absorbs water. Why is moisture a design problem?",
      options: [
        {
            label: "a",
            text: "Water increases crystallinity.",
        },
        {
            label: "b",
            text: "Water hydrolyses the amide bonds immediately.",
        },
        {
            label: "c",
            text: "Water hydrogen-bonds to the amide groups, acting as a plasticizer — lowering Tg and stiffness and changing dimensions (moisture conditioning is required).",
        },
        {
            label: "d",
            text: "It does not affect properties.",
        }
      ],
      answer: "c",
      why: "Absorbed water competes for the **amide H-bonds** and plasticizes the amorphous phase: Tg drops below room temperature, parts swell and stiffness falls. Nylons must be dried before processing and conditioned in service.",
      concept: "amide H-bonding: strength + moisture sensitivity (two edges of one sword)",
      tags: ["confused"],
    },
    {
      id: "t8-09",
      type: "match",
      diff: 2,
      text: "Match each polymer with its classic application.",
      tableRows: [
        ["1", "PMMA", "", "(i) non-stick cookware coating"],
        ["2", "PTFE", "", "(ii) optical lenses, aircraft canopies, signs"],
        ["3", "POM (acetal)", "", "(iii) precision gears, low-friction parts"],
        ["4", "PC", "", "(iv) safety goggles, helmet visors"],
      ],
      options: [
        { label: "a", text: "1-ii, 2-i, 3-iv, 4-iii" },
        { label: "b", text: "1-ii, 2-i, 3-iii, 4-iv" },
        { label: "c", text: "1-i, 2-ii, 3-iv, 4-iii" },
        { label: "d", text: "1-iv, 2-iii, 3-i, 4-ii" }
      ],
      answer: "b",
      why: "PMMA → optical/glazing; PTFE → non-stick; POM → precision low-friction parts (its crystallinity gives high stiffness and lubricity); PC → impact-resistant transparent parts.",
      tags: ["revision"],
    },
    {
      id: "t8-10",
      type: "concept",
      diff: 2,
      text: "How do two-part epoxy adhesives cure?",
      options: [
        {
            label: "a",
            text: "By oxidation in air",
        },
        {
            label: "b",
            text: "By cooling from the melt",
        },
        {
            label: "c",
            text: "By evaporation of a solvent",
        },
        {
            label: "d",
            text: "By a room-temperature addition reaction between the epoxy resin and a hardener (amine/anhydride), forming a cross-linked network",
        }
      ],
      answer: "d",
      why: "Epoxide rings open and react with **amine hydrogens** (or anhydrides at high T) to build a 3-D thermoset network. No volatiles are released, giving low shrinkage and excellent adhesion.",
      tags: ["revision"],
    },
    {
      id: "t8-11",
      type: "compare",
      diff: 3,
      text: "Phenol–formaldehyde resins: novolac vs resol. Which statement is correct?",
      options: [
        { label: "a", text: "Both are thermoplastics." },
        { label: "b", text: "Novolac is self-curing; resol needs a hardener." },
        { label: "c", text: "Novolac is made with acid catalyst and excess phenol; it is thermoplastic until cross-linked with hexamethylenetetramine. Resol is made with base and excess formaldehyde and is self-curing." },
        { label: "d", text: "They contain no cross-links ever." }
      ],
      answer: "c",
      why: "**Novolac** (acid catalyst, phenol-rich) is a stable thermoplastic prepolymer needing added **hexamine** to cure; **resol** (base, formaldehyde-rich) carries reactive methylol groups and cures on heating without a separate hardener.",
      concept: "novolac + hexamine · resol self-curing",
      tags: ["confused"],
    },
    {
      id: "t8-12",
      type: "statement",
      diff: 2,
      text: "Which statement(s) about silicone polymers is/are correct?",
      statements: [
        { num: 1, text: "Their backbone is a flexible Si–O chain, not C–C." },
        { num: 2, text: "They tolerate a very wide temperature range and are chemically inert." },
        { num: 3, text: "They are used in sealants, medical implants and release coatings." },
        { num: 4, text: "They are highly polar and dissolve readily in water." },
      ],
      options: [
        { label: "a", text: "1, 2 and 3 only" },
        { label: "b", text: "2 and 4 only" },
        { label: "c", text: "4 only" },
        { label: "d", text: "1, 2, 3 and 4" }
      ],
      answer: "a",
      why: "1–3 are the defining silicone properties. Item 4 is false — the organic substituents make silicones **hydrophobic** and water-repellent, not water-soluble.",
      distractors: {
        d: "Item 4 inverts silicone's most familiar surface property.",
      },
      tags: ["confused"],
    },
    {
      id: "t8-13",
      type: "recall",
      diff: 1,
      text: "The precursor polymer for most carbon fibre is:",
      options: [
        {
            label: "a",
            text: "Cellulose",
        },
        {
            label: "b",
            text: "Polyethylene",
        },
        {
            label: "c",
            text: "PTFE",
        },
        {
            label: "d",
            text: "Polyacrylonitrile (PAN)",
        }
      ],
      answer: "d",
      why: "**PAN** fibres are stabilized (oxidative) then carbonized at high temperature; the oriented ladder structure converts to strong graphitic carbon fibre. Pitch is the secondary precursor.",
      tags: ["revision"],
    },
    {
      id: "t8-14",
      type: "apply",
      diff: 4,
      text: "Among the listed candidates, which is the most defensible choice for a semi-rigid automotive fuel line that must limit swelling and hydrocarbon permeation from petrol?",
      options: [
        {
            label: "a",
            text: "Unmodified LDPE, because low density reliably predicts hydrocarbon sorption and barrier performance.",
        },
        {
            label: "b",
            text: "Plasticised PVC, because flexibility alone ensures low petrol swelling and low fuel permeation throughout service.",
        },
        {
            label: "c",
            text: "A qualified fuel-line grade of polyamide 11 or 12, selected for the specific fuel blend and service conditions.",
        },
        {
            label: "d",
            text: "Natural rubber, because its unsaturated hydrocarbon backbone is resistant to prolonged petrol exposure.",
        }
      ],
      answer: "c",
      why: "Fuel-line grades of PA11/PA12 are used where hydrocarbon resistance and low permeation are needed, but the final choice must be validated for the fuel blend, temperature, pressure and applicable specification.",
      concept: "fuel-line material selection",
      tags: [
        "reviewed"
      ],
      distractors: {
        b: "Plasticiser can be extracted by some fuels, and flexibility alone does not guarantee low hydrocarbon permeation.",
        d: "Natural rubber can swell in hydrocarbon fuels; non-polarity alone does not ensure fuel resistance.",
        a: "Density alone is not a reliable predictor of sorption and permeation for the finished fuel-line grade.",
      },
    },
    {
      id: "t8-15",
      type: "compare",
      diff: 2,
      text: "Which pairing of polymer and gas-barrier behaviour is correct?",
      options: [
        {
            label: "a",
            text: "Nylon: poor O₂ barrier",
        },
        {
            label: "b",
            text: "PET: good O₂ barrier for bottles; EVOH: excellent O₂ barrier (used in multilayer films); PE: poor O₂ barrier but good moisture barrier",
        },
        {
            label: "c",
            text: "PE: excellent O₂ barrier; EVOH: poor O₂ barrier",
        },
        {
            label: "d",
            text: "All polymers have identical barrier properties",
        }
      ],
      answer: "b",
      why: "**Polar, H-bonded polymers (EVOH, PET, nylon)** impede non-polar O₂; **non-polar polyolefins (PE, PP)** are good moisture barriers but poor O₂ barriers. Multilayer structures combine both.",
      concept: "polar ⇒ O₂ barrier · non-polar ⇒ moisture barrier",
      tags: ["confused"],
    },
    {
      id: "t8-16",
      type: "recall",
      diff: 1,
      text: "SBR, the workhorse tyre rubber, is a copolymer of:",
      options: [
        {
            label: "a",
            text: "Vinyl chloride and acetate",
        },
        {
            label: "b",
            text: "Styrene and butadiene",
        },
        {
            label: "c",
            text: "Phenol and formaldehyde",
        },
        {
            label: "d",
            text: "Ethylene and propylene",
        }
      ],
      answer: "b",
      why: "**S**tyrene–**B**utadiene **R**ubber, made by emulsion copolymerization, largely replaced natural rubber in tyre treads because its properties can be tuned.",
      tags: ["revision"],
    },
    {
      id: "t8-17",
      type: "concept",
      diff: 3,
      text: "Why is EPDM rubber usually more resistant to ozone cracking and outdoor weathering than natural rubber?",
      options: [
        {
            label: "a",
            text: "EPDM has more carbon–carbon double bonds in its main chain, so ozone attack is distributed over more sites.",
        },
        {
            label: "b",
            text: "EPDM has a largely saturated main chain; the diene unsaturation is mainly pendant and is used for curing, leaving fewer main-chain sites vulnerable to ozone attack.",
        },
        {
            label: "c",
            text: "Its weather resistance comes only from sulphur crosslinks; the backbone chemistry is irrelevant.",
        },
        {
            label: "d",
            text: "EPDM contains chlorine atoms that form a protective barrier against ultraviolet radiation.",
        }
      ],
      answer: "b",
      why: "EPDM’s backbone is largely saturated, unlike natural rubber’s unsaturated polyisoprene backbone. Its residual diene unsaturation is mainly used for crosslinking, so the main chain has fewer sites for ozone attack.",
      concept: "backbone chemistry and ozone resistance",
      tags: [
        "reviewed",
        "revision"
      ],
      distractors: {
        a: "Natural rubber has unsaturation in its backbone; EPDM was designed so the main chain is largely saturated.",
        c: "Cure chemistry affects network structure, but it does not replace the key backbone-unsaturation explanation.",
        d: "EPDM is not a chlorinated polymer; this is not the source of its weathering resistance.",
      },
    },
    {
      id: "t8-18",
      type: "match",
      diff: 1,
      text: "Match each monomer with the polymer it forms.",
      tableRows: [
        ["1", "Vinyl chloride", "", "(i) polypropylene"],
        ["2", "Propylene", "", "(ii) poly(vinyl chloride)"],
        ["3", "Methyl methacrylate", "", "(iii) poly(methyl methacrylate)"],
        ["4", "Terephthalic acid + ethylene glycol", "", "(iv) PET"],
      ],
      options: [
        { label: "a", text: "1-i, 2-ii, 3-iv, 4-iii" },
        { label: "b", text: "1-ii, 2-i, 3-iv, 4-iii" },
        { label: "c", text: "1-iii, 2-iv, 3-i, 4-ii" },
        { label: "d", text: "1-ii, 2-i, 3-iii, 4-iv" }
      ],
      answer: "d",
      why: "VC → PVC; propylene → PP; MMA → PMMA; terephthalic acid + ethylene glycol → PET (a step-growth polyester).",
      tags: ["revision"],
    },
    {
      id: "t8-19",
      type: "apply",
      diff: 3,
      text: "A connector needs continuous 200 °C electrical insulation, excellent dielectric performance and chemical inertness. The sleeve carries little sustained mechanical load, and a fluoropolymer is acceptable. Which material is the most defensible choice among these options?",
      options: [
        {
            label: "a",
            text: "PTFE, whose high service-temperature capability, dielectric properties and chemical resistance suit the specified lightly loaded sleeve.",
        },
        {
            label: "b",
            text: "Plasticised PVC, because plasticiser addition raises its continuous-use temperature above 200 °C.",
        },
        {
            label: "c",
            text: "Polypropylene, because its low density alone guarantees stable dielectric behaviour at 200 °C.",
        },
        {
            label: "d",
            text: "General-purpose polystyrene, because its glassy state prevents deformation at elevated temperature.",
        }
      ],
      answer: "a",
      why: "PTFE is a strong candidate for a lightly loaded high-temperature electrical sleeve because it combines useful high-temperature service capability, dielectric properties and chemical inertness. Grade and design limits must still be checked.",
      tags: [
        "reviewed",
        "revision"
      ],
      distractors: {
        c: "Low density does not guarantee 200 °C dimensional or dielectric performance; PP is not the right continuous-temperature choice here.",
        d: "General-purpose PS cannot retain the required performance at 200 °C.",
        b: "Plasticiser does not raise PVC’s continuous-use temperature to the specified level; it often lowers stiffness and heat resistance.",
      },
      concept: "high-temperature electrical insulation",
    },
    {
      id: "t8-20",
      type: "concept",
      diff: 2,
      text: "Why is polycarbonate widely used for transparent structural parts although PMMA is slightly clearer?",
      options: [
        {
            label: "a",
            text: "PC is more scratch-resistant than PMMA.",
        },
        {
            label: "b",
            text: "PC combines good clarity with very high toughness and a high Tg (~150 °C), giving transparency plus impact and heat resistance.",
        },
        {
            label: "c",
            text: "PC is a thermoset.",
        },
        {
            label: "d",
            text: "PC is cheaper in all respects.",
        }
      ],
      answer: "b",
      why: "The **balance** is the point: PC's clarity is close to PMMA's, but its impact strength is many times higher and its Tg (~150 °C) allows hot/structural use. (PMMA wins on UV stability and scratch resistance — hence PC is often hard-coated.)",
      tags: ["revision"],
    },
    {
      id: "t8-21",
      type: "recall",
      diff: 1,
      text: "Which polymer is a semi-synthetic material derived from a natural polymer?",
      options: [
        {
            label: "a",
            text: "Cellulose acetate",
        },
        {
            label: "b",
            text: "Polyethylene",
        },
        {
            label: "c",
            text: "Nylon 6,6",
        },
        {
            label: "d",
            text: "Polystyrene",
        }
      ],
      answer: "a",
      why: "**Cellulose acetate** is made by acetylating natural cellulose — a natural backbone with a chemical modification, hence *semi-synthetic*. (Cellophane is regenerated cellulose; rayon is regenerated cellulose fibre.)",
      tags: ["revision"],
    },
    {
      id: "t8-22",
      type: "statement",
      diff: 3,
      text: "Which statement(s) about thermosetting industrial polymers is/are correct?",
      statements: [
        { num: 1, text: "Epoxy, phenolic, unsaturated polyester and melamine–formaldehyde are thermosets." },
        { num: 2, text: "They are processed from low-viscosity prepolymers and then cured irreversibly." },
        { num: 3, text: "They cannot be remelted or remoulded." },
        { num: 4, text: "They are inherently more recyclable than thermoplastics." },
      ],
      options: [
        { label: "a", text: "2 and 4 only" },
        { label: "b", text: "4 only" },
        { label: "c", text: "1, 2 and 3 only" },
        { label: "d", text: "1, 2, 3 and 4" }
      ],
      answer: "c",
      why: "1–3 correct. Item 4 is false — the **highly cross-linked network** makes thermosets hard to recycle (they cannot be remelted), unlike thermoplastics.",
      distractors: {
        d: "Item 4 reverses a central sustainability drawback of thermosets.",
      },
      tags: ["revision"],
    },
    {
      id: "t8-23",
      type: "concept",
      diff: 2,
      text: "Why is PMMA preferred over PS for outdoor signage?",
      options: [
        {
            label: "a",
            text: "PMMA is cheaper.",
        },
        {
            label: "b",
            text: "PS is transparent; PMMA is opaque.",
        },
        {
            label: "c",
            text: "PMMA is a thermoset.",
        },
        {
            label: "d",
            text: "PMMA has much better UV and weather resistance, resisting yellowing and embrittlement.",
        }
      ],
      answer: "d",
      why: "**PMMA's C–C backbone has no UV-absorbing aromatic groups or residual unsaturation** to trigger photodegradation, so it stays clear for years; PS yellows and crazes outdoors.",
      concept: "aromatic groups ⇒ UV sensitivity",
      tags: ["revision"],
    },
    {
      id: "t8-24",
      type: "apply",
      diff: 4,
      text: "A housing must be flame-retardant, dimensionally stable and mouldable at high precision. The best matrix choice is:",
      options: [
        {
            label: "a",
            text: "Glass-filled PBT or PA with a flame-retardant package",
        },
        {
            label: "b",
            text: "Natural rubber",
        },
        {
            label: "c",
            text: "Plasticized PVC",
        },
        {
            label: "d",
            text: "Unfilled LDPE",
        }
      ],
      answer: "a",
      why: "Semi-crystalline engineering polyesters/polyamides give **precision moulding, stiffness and heat resistance**; glass fibre raises modulus/HDT and FR additives (or inherently FR chemistry) meet flammability specs.",
      concept: "engineering plastic + reinforcement + FR",
      tags: ["revision"],
    },
    {
      id: "t8-25",
      type: "compare",
      diff: 3,
      text: "Why does PTFE's melting behaviour make it fundamentally harder to process than polyethylene?",
      options: [
        {
            label: "a",
            text: "PTFE has an extremely high melt viscosity (rigid, strongly bonded chains resist flow), so it does not form a true melt — hence sintering/paste extrusion instead of melt processing.",
        },
        {
            label: "b",
            text: "PE is processed only by sintering.",
        },
        {
            label: "c",
            text: "PTFE has a lower Tm than PE.",
        },
        {
            label: "d",
            text: "PTFE is a thermoset.",
        }
      ],
      answer: "a",
      why: "Strong C–F bonds and a very high chain stiffness give PTFE a melt viscosity ~10¹⁰ Pa·s, many orders above normal polymers; the 'melt' does not flow → **compression sintering** or **paste extrusion**.",
      concept: "processability is governed by melt viscosity, not just Tm",
      tags: ["confused"],
    },
    {
      id: "t8-26",
      type: "recall",
      diff: 1,
      text: "Which property combination makes polyoxymethylene (POM, acetal) especially useful for precision gears and bearings?",
      options: [
        {
            label: "a",
            text: "High gas permeability in selective membranes where molecular diffusion is the design goal.",
        },
        {
            label: "b",
            text: "Optical clarity and low birefringence for precision transparent lenses.",
        },
        {
            label: "c",
            text: "Stiffness, dimensional stability, low friction and useful fatigue/wear performance in moving parts.",
        },
        {
            label: "d",
            text: "Very low modulus and weak wear performance for soft shock-absorbing components.",
        }
      ],
      answer: "c",
      why: "POM is widely used in precision mechanical components because it combines stiffness, dimensional stability, low friction and wear/fatigue performance. Actual performance still depends on grade, load, temperature and lubrication.",
      tags: [
        "reviewed"
      ],
      distractors: {
        b: "Optical clarity is not the primary reason POM is selected for gears and bearings.",
        a: "High gas permeability is unrelated to the common low-friction precision-part use of POM.",
        d: "POM is a relatively stiff engineering thermoplastic, not a soft elastomer selected for low-modulus shock absorption.",
      },
      concept: "engineering applications of POM",
    },
    {
      id: "t8-27",
      type: "higher",
      diff: 4,
      text: "ABS outperforms HIPS primarily because adding acrylonitrile to the rubber-grafted styrene system:",
      options: [
        {
            label: "a",
            text: "removes the rubber phase.",
        },
        {
            label: "b",
            text: "increases chemical resistance, heat resistance and stiffness (higher Tg) while retaining rubber toughening, so ABS resists both impact and aggressive service conditions.",
        },
        {
            label: "c",
            text: "lowers its Tg below room temperature.",
        },
        {
            label: "d",
            text: "makes it transparent.",
        }
      ],
      answer: "b",
      why: "The **nitrile groups are polar**, raising cohesive energy, modulus, chemical and heat resistance; the polybutadiene phase still provides toughening. The combination is what makes ABS the dominant engineering thermoplastic (appliance and automotive trim, toys).",
      concept: "copolymer composition tunes the properties of ABS",
      tags: ["revision"],
    },
    {
      id: "t8-28",
      type: "statement",
      diff: 2,
      text: "Which statement(s) about commodity vs engineering plastics is/are correct?",
      statements: [
        { num: 1, text: "Commodity plastics (PE, PP, PVC, PS) are produced in very large volumes at low cost." },
        { num: 2, text: "Engineering plastics (PC, POM, PA, PBT) cost more but give superior mechanical and thermal performance." },
        { num: 3, text: "High-performance polymers (PEEK, PTFE, PI) serve extreme temperature/chemical conditions." },
        { num: 4, text: "All plastics have identical property profiles." },
      ],
      options: [
        { label: "a", text: "1, 2 and 3 only" },
        { label: "b", text: "4 only" },
        { label: "c", text: "1, 2, 3 and 4" },
        { label: "d", text: "1 and 4 only" }
      ],
      answer: "a",
      why: "1–3 describe the commodity/engineering/high-performance tiers; item 4 is obviously false — selection exists precisely because properties differ enormously.",
      tags: ["revision"],
    },
    {
      id: "t8-29",
      type: "apply",
      diff: 3,
      text: "A reusable transparent labware container must tolerate repeated steam sterilisation at 121 °C and maintain useful impact resistance. Which candidate is the most defensible first choice, provided the exact grade is rated for repeated autoclave cycles?",
      options: [
        {
            label: "a",
            text: "A high-clarity, autoclave-rated polypropylene grade, selected for repeated 121 °C steam exposure.",
        },
        {
            label: "b",
            text: "Plasticised PVC, because plasticiser makes the polymer more resistant to steam and heat.",
        },
        {
            label: "c",
            text: "General-purpose polystyrene, because its transparency ensures resistance to steam-induced distortion.",
        },
        {
            label: "d",
            text: "PETG, because ease of thermoforming guarantees suitability for repeated autoclave cycles.",
        }
      ],
      answer: "a",
      why: "Autoclave-rated polypropylene grades are commonly used for reusable labware because PP can tolerate 121 °C steam when the grade and design are appropriate. The explicit grade qualification matters; not every PP formulation is suitable for repeated cycles.",
      tags: [
        "reviewed",
        "revision"
      ],
      distractors: {
        c: "Optical clarity does not ensure steam resistance, and general-purpose PS is brittle and unsuitable for repeated autoclaving.",
        b: "Plasticisers do not make PVC the default choice for repeated 121 °C steam cycles.",
        d: "Thermoformability and clarity do not establish hydrothermal stability during repeated autoclaving.",
      },
      concept: "grade-qualified polymer selection for autoclave service",
    },
    {
      id: "t8-30",
      type: "higher",
      diff: 4,
      text: "A disposable lid for a hot takeaway beverage needs low cost, stiffness and enough heat resistance for brief contact near 90–95 °C. Clarity is desirable but secondary. Which option is the most defensible commodity choice?",
      options: [
        {
            label: "a",
            text: "PETG: clear and formable, although clarity alone does not ensure heat performance or lowest cost.",
        },
        {
            label: "b",
            text: "General-purpose PS: clear and cheap, but relatively brittle and prone to distortion in hot service.",
        },
        {
            label: "c",
            text: "LDPE: flexible and economical, but its low stiffness makes hot-lid dimensional control difficult.",
        },
        {
            label: "d",
            text: "A suitable food-contact PP grade: low cost, useful stiffness and resistance to brief contact near 90–95 °C.",
        }
      ],
      answer: "d",
      why: "A suitable polypropylene grade is a common low-cost choice for hot beverage lids because it can retain useful stiffness and heat resistance around this service range. The grade, wall geometry, loading and food-contact requirements still need validation.",
      concept: "thermoplastic selection for hot beverage packaging",
      tags: [
        "reviewed"
      ],
      distractors: {
        b: "General-purpose polystyrene is clear and economical but comparatively brittle and vulnerable to deformation in hot service.",
        c: "Low-density polyethylene is flexible and relatively soft, so it is less suitable when lid stiffness and hot dimensional control matter.",
        a: "PETG clarity does not by itself establish adequate hot-contact performance, and it is not typically the lowest-cost commodity choice.",
      },
    },
  ],
};

export default T8;
