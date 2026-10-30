import type { TopicSource } from "../../mt203/types";

/**
 * MT203 — Topic 11: Compounding & Processing
 * Source: Module 4. 26 questions.
 */
const T11: TopicSource = {
  id: "t11",
  module: "m4",
  title: "Compounding & Processing",
  subtitle: "Topic 11 · additives, formulation and the shaping processes",
  subs: [
    { id: "T11.1", title: "Compounding: additives & their functions" },
    { id: "T11.2", title: "Drying, MFI and shrinkage" },
    { id: "T11.3", title: "Extrusion, injection, blow, calender, rotational" },
    { id: "T11.4", title: "Thermoset & composite processes" },
    { id: "T11.5", title: "Common moulding defects" },
  ],
  questions: [
    {
      id: "t11-01",
      type: "recall",
      diff: 1,
      text: "Compounding is the process of:",
      options: [
        {
            label: "a",
            text: "recycling the polymer",
        },
        {
            label: "b",
            text: "polymerizing the monomer",
        },
        {
            label: "c",
            text: "mixing the base polymer with additives (fillers, plasticizers, stabilizers, colorants) to make a usable formulation",
        },
        {
            label: "d",
            text: "cross-linking the product",
        }
      ],
      answer: "c",
      why: "**Compounding** turns a raw polymer into a processable, serviceable formulation by intimately mixing additives — usually in an extruder — before shaping.",
      tags: ["revision"],
    },
    {
      id: "t11-02",
      type: "match",
      diff: 2,
      text: "Match each additive with its function.",
      tableRows: [
        ["1", "Plasticizer", "", "(i) increases flexibility, lowers Tg"],
        ["2", "Lubricant", "", "(ii) reduces friction/melt viscosity, aids release"],
        ["3", "Thermal stabilizer", "", "(iii) prevents degradation during processing (e.g. HCl scavenger for PVC)"],
        ["4", "Coupling agent", "", "(iv) bonds filler to matrix (e.g. silane on glass)"],
      ],
      options: [
        { label: "a", text: "1-i, 2-ii, 3-iv, 4-iii" },
        { label: "b", text: "1-iv, 2-iii, 3-i, 4-ii" },
        { label: "c", text: "1-ii, 2-i, 3-iv, 4-iii" },
        { label: "d", text: "1-i, 2-ii, 3-iii, 4-iv" }
      ],
      answer: "d",
      why: "Plasticizer → flexibility; lubricant → processing/release; thermal stabilizer → degradation protection; coupling agent → filler–matrix adhesion.",
      tags: ["revision"],
    },
    {
      id: "t11-03",
      type: "concept",
      diff: 2,
      text: "An *internal* lubricant differs from an *external* lubricant in that the internal lubricant:",
      options: [
        {
            label: "a",
            text: "is compatible with the melt and lowers its viscosity; the external lubricant is incompatible and migrates to the surface to aid release.",
        },
        {
            label: "b",
            text: "is a solid at processing temperature",
        },
        {
            label: "c",
            text: "always increases viscosity",
        },
        {
            label: "d",
            text: "is the same as a plasticizer in all respects",
        }
      ],
      answer: "a",
      why: "**Internal** lubricants reduce inter-chain friction (lower melt viscosity); **external** ones exude to the metal interface, reducing sticking and aiding demoulding.",
      concept: "internal: chain friction · external: metal release",
      tags: ["confused"],
    },
    {
      id: "t11-04",
      type: "recall",
      diff: 1,
      text: "A masterbatch is:",
      options: [
        {
            label: "a",
            text: "a moulding defect",
        },
        {
            label: "b",
            text: "a concentrated additive/pigment blend in a carrier resin, diluted into the base polymer during processing",
        },
        {
            label: "c",
            text: "a type of cross-linker",
        },
        {
            label: "d",
            text: "the first polymer ever made",
        }
      ],
      answer: "b",
      why: "**Masterbatches** deliver colorants/additives uniformly at low dose: a concentrated dispersion is let down into the bulk resin at the machine, ensuring good dispersion and cleaner handling.",
      tags: ["revision"],
    },
    {
      id: "t11-05",
      type: "concept",
      diff: 3,
      text: "Why must hygroscopic polymers such as PET, nylon, PC and POM be thoroughly dried before melt processing?",
      options: [
        {
            label: "a",
            text: "There is no need to dry them.",
        },
        {
            label: "b",
            text: "Drying improves colour only.",
        },
        {
            label: "c",
            text: "Water acts as a cross-linker.",
        },
        {
            label: "d",
            text: "Moisture causes hydrolytic chain scission at melt temperature — lowering MW and mechanical properties — and produces surface defects (splay/silver streaks).",
        }
      ],
      answer: "d",
      why: "At melt temperature, absorbed water **hydrolyses ester/amide/carbonate linkages**, dropping molecular weight (an intrinsic-viscosity loss for PET) and causing silver-streak **splay**. Hence dried hoppers and dryers are mandatory.",
      concept: "hygroscopic + hot + hydrolysable bond = MW loss",
      tags: ["confused"],
    },
    {
      id: "t11-06",
      type: "recall",
      diff: 1,
      text: "In the SPI resin-identification code, code 3 denotes:",
      options: [
        { label: "a", text: "PVC" },
        { label: "b", text: "PS" },
        { label: "c", text: "PET" },
        { label: "d", text: "PP" }
      ],
      answer: "a",
      why: "1 PET · 2 HDPE · 3 PVC · 4 LDPE · 5 PP · 6 PS · 7 other. The triangle code is for **sorting in recycling**. ",
      tags: ["revision"],
    },
    {
      id: "t11-07",
      type: "apply",
      diff: 3,
      text: "A recycler wants to separate PET from HDPE using a water sink–float tank. Which outcome is expected at room temperature?",
      options: [
        {
            label: "a",
            text: "PET sinks while HDPE floats; PET is about 1.33 g/cm³ and HDPE is typically around 0.95 g/cm³.",
        },
        {
            label: "b",
            text: "Both float because many common packaging polymers have densities below water, so the materials cannot be separated by this method.",
        },
        {
            label: "c",
            text: "PET floats while HDPE sinks, because the more crystalline PET fraction is assumed to have the lower density in the tank.",
        },
        {
            label: "d",
            text: "Both sink because PET and HDPE are assumed to have densities above water's 1.0 g/cm³ reference value.",
        }
      ],
      answer: "a",
      why: "Typical PET has density around 1.33–1.40 g/cm³ and sinks in water; typical HDPE is around 0.94–0.97 g/cm³ and floats. Actual recycled streams can contain additives or contaminants, so industrial sorting may combine sink–float with other methods.",
      concept: "Density-based sink–float separation; use measured polymer densities rather than a blanket rule about plastics.",
      tags: [
        "revision"
      ],
      distractors: {
        c: "This reverses the typical densities of PET and HDPE.",
        d: "Typical HDPE has density below 1 g/cm³, so it floats in clean water.",
        b: "Some common plastics, including PET and PVC, are denser than water.",
      },
    },
    {
      id: "t11-08",
      type: "sequence",
      diff: 2,
      text: "Order the major stages of an injection-moulding cycle: (1) injection/filling, (2) clamping, (3) cooling and plastication for the next shot, (4) ejection, (5) packing/holding.",
      options: [
        {
            label: "a",
            text: "2 → 1 → 3 → 5 → 4",
        },
        {
            label: "b",
            text: "2 → 5 → 1 → 3 → 4",
        },
        {
            label: "c",
            text: "2 → 1 → 5 → 3 → 4",
        },
        {
            label: "d",
            text: "1 → 2 → 5 → 3 → 4",
        }
      ],
      answer: "c",
      why: "The mould is clamped, the melt fills the cavity, packing/holding compensates for shrinkage, cooling solidifies the part while the next shot is prepared, and the part is then ejected.",
      tags: [
        "revision"
      ],
      distractors: {
        d: "Injection cannot precede closing and clamping the mould.",
        a: "Packing/holding follows filling; it is not delayed until after the cooling/plastication stage in the simplified cycle shown.",
        b: "The cavity must be filled before packing/holding pressure is applied.",
      },
    },
    {
      id: "t11-09",
      type: "recall",
      diff: 1,
      text: "A single-screw extruder has, in order along the barrel:",
      options: [
        {
            label: "a",
            text: "metering → feed → compression",
        },
        {
            label: "b",
            text: "feed → compression (melting) → metering (pumping) zones",
        },
        {
            label: "c",
            text: "only a feed zone",
        },
        {
            label: "d",
            text: "melting → ejection → cooling",
        }
      ],
      answer: "b",
      why: "Polymer enters the **feed** zone, is compacted and melted in the **compression** zone (decreasing channel depth), then pumped uniformly by the **metering** zone into the die.",
      tags: ["revision"],
    },
    {
      id: "t11-10",
      type: "concept",
      diff: 3,
      text: "In blown-film extrusion of LDPE, why is biaxial orientation important?",
      options: [
        {
            label: "a",
            text: "It prevents the film from cooling.",
        },
        {
            label: "b",
            text: "The bubble is drawn up (machine direction) and inflated (transverse direction), orienting chains in both directions and giving balanced stiffness, strength and toughness.",
        },
        {
            label: "c",
            text: "It is done to add colour.",
        },
        {
            label: "d",
            text: "It removes all crystallinity.",
        }
      ],
      answer: "b",
      why: "**Biaxial drawing** (take-up + blow-up ratio) aligns chains in two directions, improving tensile strength, puncture resistance and optical properties — the standard reason grocery-bag films perform well in all directions.",
      concept: "biaxial orientation → balanced properties",
      tags: ["revision"],
    },
    {
      id: "t11-11",
      type: "concept",
      diff: 3,
      text: "A PET bottle is produced by *injection stretch blow moulding*. The critical processing features are:",
      options: [
        {
            label: "a",
            text: "A moulded preform is heated to just above Tg and simultaneously stretched axially and blown radially — a *strain-induced* crystallizing step that gives strength and clarity.",
        },
        {
            label: "b",
            text: "PET is poured as a melt into a bottle-shaped mould.",
        },
        {
            label: "c",
            text: "The bottle is compression-moulded.",
        },
        {
            label: "d",
            text: "PET is cross-linked chemically inside the mould.",
        }
      ],
      answer: "a",
      why: "Two-stage **injection → stretch blow**: the amorphous preform is conditioned above Tg, then **stretch-blown**. The biaxial strain induces crystallites (strain-induced crystallization) that strengthen the wall while keeping it transparent.",
      concept: "stretch blow: orientation + strain-induced crystallization",
      tags: ["confused"],
    },
    {
      id: "t11-12",
      type: "compare",
      diff: 2,
      text: "Which process is correctly paired with its typical product?",
      options: [
        {
            label: "a",
            text: "Compression moulding → PET bottles; Extrusion → gears; Blow moulding → pipes",
        },
        {
            label: "b",
            text: "Compression moulding → thermoset parts (e.g. SMC panels); Extrusion → pipes/profiles; Blow moulding → hollow bottles; Calendering → PVC sheet/film",
        },
        {
            label: "c",
            text: "Calendering → solid rods; Extrusion → hollow tanks",
        },
        {
            label: "d",
            text: "Blow moulding → flat sheet only",
        }
      ],
      answer: "b",
      why: "Each process matches its product form: **compression** for thermoset charge shapes, **extrusion** for continuous profiles/pipes, **blow** for hollow articles, **calendering** for sheet/film.",
      tags: ["revision"],
    },
    {
      id: "t11-13",
      type: "concept",
      diff: 2,
      text: "Which product brief is best matched to rotational moulding?",
      options: [
        {
            label: "a",
            text: "A thin-walled hollow bottle formed rapidly from a hot parison inside a closed mould.",
        },
        {
            label: "b",
            text: "A high-volume small gear needing tight dimensional tolerances and rapid cycle times.",
        },
        {
            label: "c",
            text: "A long pipe profile with a fixed cross-section produced continuously from a die.",
        },
        {
            label: "d",
            text: "A large hollow tank or kayak made in a heated rotating mould.",
        }
      ],
      answer: "d",
      why: "Rotational moulding distributes polymer powder over the inside of a heated rotating mould and is well suited to large hollow parts with relatively low tooling pressure and long cycle times.",
      tags: [
        "revision"
      ],
      distractors: {
        b: "This favours high-volume injection moulding, which supports tighter detail and faster cycles.",
        c: "This describes extrusion through a profile or pipe die.",
        a: "This describes blow moulding of a parison.",
      },
      concept: "Rotational moulding: large hollow parts, low mould pressure and relatively long cycle times.",
    },
    {
      id: "t11-14",
      type: "concept",
      diff: 3,
      text: "Which combination best describes products made by pultrusion and filament winding?",
      options: [
        {
            label: "a",
            text: "Fibre-reinforced laminate sheets cut from prepreg, with finite panel dimensions and chosen ply orientations.",
        },
        {
            label: "b",
            text: "Short-fibre thermoplastic parts made by injection moulding, with fibre orientation changing through the part.",
        },
        {
            label: "c",
            text: "Unreinforced polymer sheets made by calendering and discrete hollow parts formed by blow moulding.",
        },
        {
            label: "d",
            text: "Continuous fibre-reinforced profiles by pultrusion and hollow, mandrel-wound structures by filament winding.",
        }
      ],
      answer: "d",
      why: "Pultrusion continuously pulls impregnated fibres through a die to make constant-section profiles; filament winding lays continuous resin-wet fibres around a mandrel for pipes, tanks and pressure vessels.",
      tags: [
        "revision"
      ],
      distractors: {
        b: "Injection moulding usually uses dispersed or short fibres and produces finite parts.",
        a: "Prepreg lay-up makes laminates with finite panel geometry; it is not pultrusion or filament winding.",
        c: "Calendering and blow moulding are polymer-shaping processes, but not the two continuous-fibre composite routes described.",
      },
      concept: "Pultrusion: constant-section profiles; filament winding: mandrel-wound hollow structures.",
    },
    {
      id: "t11-15",
      type: "numerical",
      diff: 3,
      text: "A polyethylene grade has $\\text{MFI} = 2$ g/10 min (190 °C, 2.16 kg). If another grade has MFI = 20 g/10 min, what can be said about the second grade?",
      options: [
        { label: "a", text: "It has lower melt viscosity and lower molecular weight — it flows more easily but is likely less tough." },
        { label: "b", text: "Its density is necessarily higher." },
        { label: "c", text: "It has higher molecular weight and toughness." },
        { label: "d", text: "It has identical properties." }
      ],
      answer: "a",
      why: "**MFI measures melt flow**: higher MFI ⇔ lower melt viscosity ⇔ lower MW (and generally lower toughness but easier processing). It is a fast indirect processability/MW indicator.",
      concept: "MFI ↑ ⇔ MW ↓ · viscosity ↓",
      tags: ["confused"],
    },
    {
      id: "t11-16",
      type: "concept",
      diff: 3,
      text: "Why do semi-crystalline polymers generally shrink more on moulding than amorphous ones?",
      options: [
        {
            label: "a",
            text: "They are always cross-linked.",
        },
        {
            label: "b",
            text: "They do not shrink at all.",
        },
        {
            label: "c",
            text: "Cooling from the melt crystallizes the chains into a denser packing, adding crystallization shrinkage on top of thermal contraction (typically 1.5–3% vs 0.4–0.8%).",
        },
        {
            label: "d",
            text: "They contain more water.",
        }
      ],
      answer: "c",
      why: "Two contributions: **thermal contraction** (all polymers) + **density increase on crystallization** (semi-crystalline only). Moulds must therefore be dimensioned with the resin's shrinkage in mind.",
      concept: "semi-crystalline: thermal + crystallization shrinkage",
      tags: ["confused"],
    },
    {
      id: "t11-17",
      type: "statement",
      diff: 3,
      text: "Which statement(s) about common moulding defects is/are correct?",
      statements: [
        { num: 1, text: "Splay/silver streaks on a moulding usually point to insufficient drying." },
        { num: 2, text: "Weld (knit) lines form where two flow fronts meet and are often weak." },
        { num: 3, text: "Sink marks arise from thicker sections shrinking and pulling the surface in." },
        { num: 4, text: "Short shot means more material was injected than needed." },
      ],
      options: [
        { label: "a", text: "4 only" },
        { label: "b", text: "1, 2, 3 and 4" },
        { label: "c", text: "1, 2 and 3 only" },
        { label: "d", text: "2 and 4 only" }
      ],
      answer: "c",
      why: "1–3 are correct diagnostics. Item 4 is false — a **short shot** is *incomplete* filling (too little material / poor flow), not excess.",
      distractors: {
        b: "Item 4 reverses the meaning of 'short'.",
      },
      tags: ["confused"],
    },
    {
      id: "t11-18",
      type: "assertreason",
      diff: 3,
      assertion: "PET preforms must be dried to below about 50 ppm moisture before stretch blow moulding.",
      reason: "Residual moisture hydrolyses the polyester at melt temperature, reducing intrinsic viscosity (molecular weight) and producing splay.",
      options: [
        { label: "a", text: "A is false, R is true" },
        { label: "b", text: "Both A and R are true, and R is the correct explanation of A" },
        { label: "c", text: "Both A and R are true, but R is NOT the correct explanation of A" },
        { label: "d", text: "A is true, R is false" }
      ],
      answer: "b",
      why: "PET's **ester bonds hydrolyse** in the melt, so water is destructive: each water molecule cuts a chain, dropping IV and mechanical strength. Drying to ~50 ppm plus a dry hopper is standard practice, and explains the correlation in R.",
      concept: "hydrolysis is why hygroscopic polyesters must be dried",
      tags: ["revision"],
    },
    {
      id: "t11-19",
      type: "apply",
      diff: 4,
      text: "A plant must make 200,000 thin-walled yoghurt cups per day at minimum cost. The most appropriate process is:",
      options: [
        {
            label: "a",
            text: "Hand lay-up of glass-reinforced polyester.",
        },
        {
            label: "b",
            text: "Compression moulding of thermosets.",
        },
        {
            label: "c",
            text: "High-speed thin-wall injection moulding (multi-cavity, fast cycling) using PP or PS.",
        },
        {
            label: "d",
            text: "Filament winding.",
        }
      ],
      answer: "c",
      why: "**Thin-wall injection moulding** with high-cavitation tooling, fast cooling and PP/PS gives the required output at the lowest unit cost; the other processes are far too slow (or suited to other product forms entirely).",
      concept: "process choice = product form + volume + cost",
      tags: ["confused"],
    },
    {
      id: "t11-20",
      type: "apply",
      diff: 3,
      text: "To make a continuous pipe in a single long run, the process is:",
      options: [
        {
            label: "a",
            text: "Blow moulding",
        },
        {
            label: "b",
            text: "Injection moulding",
        },
        {
            label: "c",
            text: "Rotational moulding",
        },
        {
            label: "d",
            text: "Extrusion with an annular/pipe die",
        }
      ],
      answer: "d",
      why: "**Extrusion** is a continuous process ideally suited to constant-cross-section forms — pipe, profile, sheet, filament, cable coating. Injection moulding is cyclic (discrete parts).",
      tags: ["revision"],
    },
    {
      id: "t11-21",
      type: "compare",
      diff: 2,
      text: "Injection moulding vs compression moulding — which pairing is correct?",
      options: [
        {
            label: "a",
            text: "Injection is only for thermosets; compression only for thermoplastics.",
        },
        {
            label: "b",
            text: "Injection: molten polymer forced into a closed mould (fast, thermoplastics; also RRIM/RIM for some thermosets). Compression: a measured charge is squeezed in a heated mould (classic thermosets, SMC/BMC).",
        },
        {
            label: "c",
            text: "Compression moulding is a continuous process.",
        },
        {
            label: "d",
            text: "Both require no pressure.",
        }
      ],
      answer: "b",
      why: "**Injection** fills a closed cavity under high pressure (rapid, precise, thermoplastics). **Compression** places a charge in an open heated cavity and presses it shut (thermosets and composites, since curing is irreversible).",
      tags: ["revision"],
    },
    {
      id: "t11-22",
      type: "concept",
      diff: 3,
      text: "Thermoforming (vacuum forming) is best described as:",
      options: [
        {
            label: "a",
            text: "curing a thermoset in a mould",
        },
        {
            label: "b",
            text: "heating a thermoplastic sheet until soft, then drawing it against a mould with vacuum/pressure and trimming",
        },
        {
            label: "c",
            text: "spinning fibres from a melt",
        },
        {
            label: "d",
            text: "compounding additives into a resin",
        }
      ],
      answer: "b",
      why: "**Thermoforming** shapes an already-extruded sheet by softening and vacuum/pressure drawing it onto a former — used for packaging trays, fridge liners and signage. It is a *secondary* forming process, not a polymerization or compounding one.",
      tags: ["revision"],
    },
    {
      id: "t11-23",
      type: "statement",
      diff: 2,
      text: "Which statement(s) about fibre spinning is/are correct?",
      statements: [
        { num: 1, text: "Melt spinning extrudes a thermoplastic melt through a spinneret (PET, PP, nylon)." },
        { num: 2, text: "Solution (dry/wet) spinning is used for polymers that degrade or cannot melt, e.g. acrylic, rayon." },
        { num: 3, text: "Drawn fibres are stronger than undrawn ones because of chain orientation." },
        { num: 4, text: "Spinning produces only hollow tubes, never fibres." },
      ],
      options: [
        { label: "a", text: "1, 2 and 3 only" },
        { label: "b", text: "4 only" },
        { label: "c", text: "2 and 4 only" },
        { label: "d", text: "1, 2, 3 and 4" }
      ],
      answer: "a",
      why: "1–3 are correct. Item 4 is wrong — spinning forms **filaments/fibres** through a spinneret; hollow fibres are a special case, not the general rule.",
      tags: ["revision"],
    },
    {
      id: "t11-24",
      type: "apply",
      diff: 3,
      text: "A complex phenolic electrical connector has thin ribs and a metal insert. The preheated thermoset charge must flow into a closed, heated cavity around the insert. Which process best fits the requirement?",
      options: [
        {
            label: "a",
            text: "Compression moulding, where the charge is placed directly in the cavity and compressed to fill it.",
        },
        {
            label: "b",
            text: "Thermoplastic injection moulding, where a melt is cooled and remelted on the next production cycle.",
        },
        {
            label: "c",
            text: "Transfer moulding: force a preheated charge from a pot into a closed, heated cavity.",
        },
        {
            label: "d",
            text: "Blow moulding, where a softened parison expands against the wall of a hollow mould.",
        }
      ],
      answer: "c",
      why: "Transfer moulding forces a preheated thermoset charge from a transfer pot into a closed heated cavity, supporting complex features and insert encapsulation. Compression moulding is a plausible alternative for simpler geometries, but the stated charge-transfer requirement identifies transfer moulding.",
      concept: "Transfer moulding is useful for complex thermoset parts with inserts and restricted flow paths.",
      tags: [
        "revision"
      ],
      distractors: {
        a: "Compression moulding places the charge directly in the cavity rather than transferring it from a pot through a sprue.",
        b: "A cured thermoset does not remelt like a thermoplastic during a later cycle.",
        d: "Blow moulding uses an expandable parison to form hollow parts, not a thermoset charge around a metal insert.",
      },
    },
    {
      id: "t11-25",
      type: "concept",
      diff: 3,
      text: "Why does annealing a moulded semi-crystalline part often increase its crystallinity and reduce internal stress?",
      options: [
        { label: "a", text: "Annealing adds cross-links." },
        { label: "b", text: "Annealing converts it to a thermoset." },
        { label: "c", text: "Annealing has no effect." },
        { label: "d", text: "Holding the part at a temperature between Tg and Tm allows molecular rearrangement (secondary crystallization) and relaxation of moulded-in orientation, relieving residual stress." }
      ],
      answer: "d",
      why: "Above Tg the chains are mobile: secondary crystallization increases crystallinity and perfection, while stress relaxation removes residual orientation from filling. Both improve dimensional stability (at the cost of cycle time).",
      concept: "annealing: crystallize further + relax internal stress",
      tags: ["confused"],
    },
    {
      id: "t11-26",
      type: "higher",
      diff: 4,
      text: "A product needs aligned glass fibres, a constant cross-section and continuous length. Which process best matches all three requirements?",
      options: [
        {
            label: "a",
            text: "Pultrusion pulls continuous reinforced fibres through a heated die to make aligned, constant-section profiles.",
        },
        {
            label: "b",
            text: "Compression moulding presses a fibre-bearing charge inside a closed cavity, producing a finite-length shaped component.",
        },
        {
            label: "c",
            text: "Filament winding lays continuous fibres onto a rotating mandrel to make hollow or closed-section parts such as vessels.",
        },
        {
            label: "d",
            text: "Resin-transfer moulding fills a fibre preform inside a closed mould with resin to produce a discrete composite component.",
        }
      ],
      answer: "a",
      why: "Pultrusion continuously pulls aligned reinforcement through a heated die, making long profiles with a constant cross-section. The other processes can use continuous fibres but generally produce mandrel-wound or mould-defined discrete parts.",
      concept: "Pultrusion produces continuous aligned-fibre profiles with constant cross-section.",
      tags: [
        "confused"
      ],
      distractors: {
        c: "Filament winding is well suited to hollow or closed-section parts such as pressure vessels, not arbitrary constant-section profiles.",
        d: "Resin-transfer moulding uses a closed mould to produce a discrete component.",
        b: "Compression moulding produces finite mouldings rather than an uninterrupted profile of arbitrary length.",
      },
    },
  ],
};

export default T11;
