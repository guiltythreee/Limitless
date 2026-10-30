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
        { label: "a", text: "Reclaiming used polymer by sorting, washing, remelting and pelletizing it for a second use." },
        { label: "b", text: "Mixing a base polymer with pigments, fillers or stabilizers to produce a formulation ready for shaping." },
        { label: "c", text: "Curing a thermoset after shaping by creating a covalent network throughout the finished part." },
        { label: "d", text: "Reacting small molecules in a polymerization reactor to create the base resin before any additives are introduced." }
      ],
      answer: "b",
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
        { label: "a", text: "1-iv, 2-iii, 3-i, 4-ii" },
        { label: "b", text: "1-ii, 2-i, 3-iv, 4-iii" },
        { label: "c", text: "1-i, 2-ii, 3-iv, 4-iii" },
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
        { label: "a", text: "Internal lubricants mix more readily with the melt and reduce interchain friction; external lubricants reduce metal–polymer friction." },
        { label: "b", text: "They are identical to plasticizers in every formulation, with the same compatibility, mobility and final-part effects." },
        { label: "c", text: "Internal lubricants always raise melt viscosity, while external lubricants dissolve fully and improve chain mixing." },
        { label: "d", text: "External lubricants are always gases at processing temperature, whereas internal lubricants are solid powders." }
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
        { label: "a", text: "An early commercial polymer grade made before compounding and additive selection became standard practice." },
        { label: "b", text: "A reactive chemical that initiates covalent cross-linking shortly before a thermoset cures." },
        { label: "c", text: "A visible moulded-part defect caused by poor dispersion of pigments or fillers during processing." },
        { label: "d", text: "A concentrated blend of pigment or additives in a carrier resin, fed into base polymer at a controlled let-down ratio." }
      ],
      answer: "d",
      why: "**Masterbatches** deliver colorants/additives uniformly at low dose: a concentrated dispersion is let down into the bulk resin at the machine, ensuring good dispersion and cleaner handling.",
      tags: ["revision"],
    },
    {
      id: "t11-05",
      type: "concept",
      diff: 3,
      text: "Why must hygroscopic polymers such as PET, nylon, PC and POM be thoroughly dried before melt processing?",
      options: [
        { label: "a", text: "Drying is unnecessary: absorbed water simply flashes off as steam and leaves molecular chains unchanged." },
        { label: "b", text: "Moisture can hydrolyse chains in the melt, lowering molecular weight and causing splay or silver streaks." },
        { label: "c", text: "Water acts as a universal chain extender, increasing molecular weight and melt strength during processing." },
        { label: "d", text: "Drying mainly controls colour; moisture cannot change molecular weight or cause surface defects in a melt." }
      ],
      answer: "b",
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
        { label: "a", text: "PP" },
        { label: "b", text: "PS" },
        { label: "c", text: "PVC" },
        { label: "d", text: "PET" }
      ],
      answer: "c",
      why: "1 PET · 2 HDPE · 3 PVC · 4 LDPE · 5 PP · 6 PS · 7 other. The triangle code is for **sorting in recycling**. ",
      tags: ["revision"],
    },
        {
      "id": "t11-07",
      "type": "apply",
      "diff": 3,
      "text": "A recycler wants to separate PET from HDPE using a water sink–float tank. Which outcome is expected at room temperature?",
      "options": [
        {
            "label": "a",
            "text": "PET sinks while HDPE floats; PET is about 1.33 g/cm³ and HDPE is typically around 0.95 g/cm³."
        },
        {
            "label": "b",
            "text": "Both float because many common packaging polymers have densities below water, so the materials cannot be separated by this method."
        },
        {
            "label": "c",
            "text": "Both sink because PET and HDPE are assumed to have densities above water's 1.0 g/cm³ reference value."
        },
        {
            "label": "d",
            "text": "PET floats while HDPE sinks, because the more crystalline PET fraction is assumed to have the lower density in the tank."
        }
      ],
      "answer": "a",
      "why": "Typical PET has density around 1.33–1.40 g/cm³ and sinks in water; typical HDPE is around 0.94–0.97 g/cm³ and floats. Actual recycled streams can contain additives or contaminants, so industrial sorting may combine sink–float with other methods.",
      "distractors": {
        "d": "This reverses the typical densities of PET and HDPE.",
        "c": "Typical HDPE has density below 1 g/cm³, so it floats in clean water.",
        "b": "Some common plastics, including PET and PVC, are denser than water."
      },
      "concept": "Density-based sink–float separation; use measured polymer densities rather than a blanket rule about plastics.",
      "tags": [
        "revision"
      ]
    },
        {
      "id": "t11-08",
      "type": "sequence",
      "diff": 2,
      "text": "Order the major stages of an injection-moulding cycle: (1) injection/filling, (2) clamping, (3) cooling and plastication for the next shot, (4) ejection, (5) packing/holding.",
      "options": [
        {
            "label": "a",
            "text": "2 → 1 → 3 → 5 → 4"
        },
        {
            "label": "b",
            "text": "1 → 2 → 5 → 3 → 4"
        },
        {
            "label": "c",
            "text": "2 → 5 → 1 → 3 → 4"
        },
        {
            "label": "d",
            "text": "2 → 1 → 5 → 3 → 4"
        }
      ],
      "answer": "d",
      "why": "The mould is clamped, the melt fills the cavity, packing/holding compensates for shrinkage, cooling solidifies the part while the next shot is prepared, and the part is then ejected.",
      "distractors": {
        "b": "Injection cannot precede closing and clamping the mould.",
        "a": "Packing/holding follows filling; it is not delayed until after the cooling/plastication stage in the simplified cycle shown.",
        "c": "The cavity must be filled before packing/holding pressure is applied."
      },
      "tags": [
        "revision"
      ]
    },
    {
      id: "t11-09",
      type: "recall",
      diff: 1,
      text: "A single-screw extruder has, in order along the barrel:",
      options: [
        { label: "a", text: "Melting → ejection → cooling: the screw melts pellets after the die and cools the polymer inside the barrel." },
        { label: "b", text: "Feed → compression (melting) → metering (pumping): solids convey, melt and compact, then the melt is pressurized." },
        { label: "c", text: "Metering → feed → compression: pellets are pumped first, then introduced, and finally compacted for melting." },
        { label: "d", text: "Feed only: a single-screw extruder has no compression or metering zones along the barrel." }
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
        { label: "a", text: "Take-up stretches the bubble axially, while inflation stretches it circumferentially, aligning chains in both directions." },
        { label: "b", text: "Only transverse stretching is applied; machine-direction drawing is avoided to prevent chain orientation." },
        { label: "c", text: "The bubble remains unstretched; biaxial orientation comes only from cooling the melt rapidly below Tg." },
        { label: "d", text: "Chemical cross-linking during extrusion aligns chains equally in both directions and replaces the need for stretching." }
      ],
      answer: "a",
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
        { label: "a", text: "A chemical cross-linker is added in the mould to convert PET into a thermoset during bottle shaping." },
        { label: "b", text: "PET is poured into a bottle-shaped mould and cooled, without making a preform or stretching the polymer." },
        { label: "c", text: "The bottle is shaped by compressing a solid charge between mould halves, with no melt flow or orientation step." },
        { label: "d", text: "The preform is heated near/above Tg, then stretched axially and blown radially to induce biaxial orientation and crystallization." }
      ],
      answer: "d",
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
        { label: "a", text: "Blow moulding makes only flat sheet; compression moulding makes continuous films; extrusion makes hollow bottles in a closed mould." },
        { label: "b", text: "Compression moulding makes PET beverage bottles; extrusion makes discrete gears; blow moulding makes continuous solid pipe." },
        { label: "c", text: "Calendering makes solid rods; extrusion makes closed hollow tanks directly; compression moulding is used mainly for long fibres." },
        { label: "d", text: "Compression makes many thermoset parts; extrusion makes continuous pipes/profiles; blow moulding makes hollow containers; calendering makes sheet." }
      ],
      answer: "d",
      why: "Each process matches its product form: **compression** for thermoset charge shapes, **extrusion** for continuous profiles/pipes, **blow** for hollow articles, **calendering** for sheet/film.",
      tags: ["revision"],
    },
        {
      "id": "t11-13",
      "type": "concept",
      "diff": 2,
      "text": "Which product brief is best matched to rotational moulding?",
      "options": [
        {
            "label": "a",
            "text": "A thin-walled hollow bottle formed rapidly from a hot parison inside a closed mould."
        },
        {
            "label": "b",
            "text": "A long pipe profile with a fixed cross-section produced continuously from a die."
        },
        {
            "label": "c",
            "text": "A high-volume small gear needing tight dimensional tolerances and rapid cycle times."
        },
        {
            "label": "d",
            "text": "A large hollow tank or kayak made in a heated rotating mould."
        }
      ],
      "answer": "d",
      "why": "Rotational moulding distributes polymer powder over the inside of a heated rotating mould and is well suited to large hollow parts with relatively low tooling pressure and long cycle times.",
      "distractors": {
        "c": "This favours high-volume injection moulding, which supports tighter detail and faster cycles.",
        "b": "This describes extrusion through a profile or pipe die.",
        "a": "This describes blow moulding of a parison."
      },
      "concept": "Rotational moulding: large hollow parts, low mould pressure and relatively long cycle times.",
      "tags": [
        "revision"
      ]
    },
        {
      "id": "t11-14",
      "type": "concept",
      "diff": 3,
      "text": "Which combination best describes products made by pultrusion and filament winding?",
      "options": [
        {
            "label": "a",
            "text": "Fibre-reinforced laminate sheets cut from prepreg, with finite panel dimensions and chosen ply orientations."
        },
        {
            "label": "b",
            "text": "Short-fibre thermoplastic parts made by injection moulding, with fibre orientation changing through the part."
        },
        {
            "label": "c",
            "text": "Continuous fibre-reinforced profiles by pultrusion and hollow, mandrel-wound structures by filament winding."
        },
        {
            "label": "d",
            "text": "Unreinforced polymer sheets made by calendering and discrete hollow parts formed by blow moulding."
        }
      ],
      "answer": "c",
      "why": "Pultrusion continuously pulls impregnated fibres through a die to make constant-section profiles; filament winding lays continuous resin-wet fibres around a mandrel for pipes, tanks and pressure vessels.",
      "distractors": {
        "b": "Injection moulding usually uses dispersed or short fibres and produces finite parts.",
        "a": "Prepreg lay-up makes laminates with finite panel geometry; it is not pultrusion or filament winding.",
        "d": "Calendering and blow moulding are polymer-shaping processes, but not the two continuous-fibre composite routes described."
      },
      "concept": "Pultrusion: constant-section profiles; filament winding: mandrel-wound hollow structures.",
      "tags": [
        "revision"
      ]
    },
    {
      id: "t11-15",
      type: "numerical",
      diff: 3,
      text: "A polyethylene grade has $\\text{MFI} = 2$ g/10 min (190 °C, 2.16 kg). If another grade has MFI = 20 g/10 min, what can be said about the second grade?",
      options: [
        { label: "a", text: "The higher-MFI grade usually has higher molecular weight and melt strength because chains move less readily through the die." },
        { label: "b", text: "At the same test conditions, higher MFI means easier melt flow and usually lower apparent viscosity and molecular weight." },
        { label: "c", text: "The higher-MFI grade must have identical viscosity and molecular weight; the index only reflects sample density." },
        { label: "d", text: "The higher-MFI grade necessarily has greater density, since melt flow uniquely determines packing and crystallinity." }
      ],
      answer: "b",
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
        { label: "a", text: "Crystalline regions lock chains into denser packing, adding crystallization shrinkage to thermal contraction." },
        { label: "b", text: "They absorb more water than amorphous polymers, and water loss during cooling causes most mould shrinkage." },
        { label: "c", text: "Semicrystalline chains always form covalent cross-links as they cool, making every part shrink uniformly." },
        { label: "d", text: "Crystallization adds a density increase during cooling, on top of the ordinary thermal contraction of the melt." }
      ],
      answer: "a",
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
        { label: "a", text: "1, 2, 3 and 4" },
        { label: "b", text: "1, 2 and 3 only" },
        { label: "c", text: "4 only" },
        { label: "d", text: "2 and 4 only" }
      ],
      answer: "b",
      why: "1–3 are correct diagnostics. Item 4 is false — a **short shot** is *incomplete* filling (too little material / poor flow), not excess.",
      distractors: {
        a: "Item 4 reverses the meaning of 'short'.",
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
        { label: "a", text: "A is true, R is false" },
        { label: "b", text: "Both A and R are true, but R is NOT the correct explanation of A" },
        { label: "c", text: "Both A and R are true, and R is the correct explanation of A" },
        { label: "d", text: "A is false, R is true" }
      ],
      answer: "c",
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
        { label: "a", text: "Filament winding, laying continuous reinforcement around a rotating mandrel to make hollow composite structures." },
        { label: "b", text: "Compression moulding a thermoset charge, with long cure times and one shaped part produced per heated cavity." },
        { label: "c", text: "Manual hand lay-up of glass-reinforced polyester, laminating each cup individually before room-temperature curing." },
        { label: "d", text: "High-speed multi-cavity thin-wall injection moulding of PP or PS, using short cycles to meet high daily output." }
      ],
      answer: "d",
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
        { label: "a", text: "Blow moulding inflates a hot parison inside a closed mould to make hollow containers rather than continuous pipe." },
        { label: "b", text: "Extrusion pushes melt continuously through an annular pipe die, sizing and cooling it downstream in a long run." },
        { label: "c", text: "Injection moulding fills a closed cavity with a measured shot and produces discrete parts, not a continuous pipe." },
        { label: "d", text: "Rotational moulding heats powder in a rotating closed mould, making hollow parts one cycle at a time." }
      ],
      answer: "b",
      why: "**Extrusion** is a continuous process ideally suited to constant-cross-section forms — pipe, profile, sheet, filament, cable coating. Injection moulding is cyclic (discrete parts).",
      tags: ["revision"],
    },
    {
      id: "t11-21",
      type: "compare",
      diff: 2,
      text: "Injection moulding vs compression moulding — which pairing is correct?",
      options: [
        { label: "a", text: "Injection is restricted to thermosets, while compression moulding is reserved for thermoplastics and uncured elastomers." },
        { label: "b", text: "Compression moulding is continuous: resin flows through a die and cools downstream rather than curing in a mould." },
        { label: "c", text: "Injection forces melt into a closed cavity; compression presses a measured charge in a heated mould, often for thermosets." },
        { label: "d", text: "Both processes operate without applied pressure because the polymer fills the cavity under its own weight." }
      ],
      answer: "c",
      why: "**Injection** fills a closed cavity under high pressure (rapid, precise, thermoplastics). **Compression** places a charge in an open heated cavity and presses it shut (thermosets and composites, since curing is irreversible).",
      tags: ["revision"],
    },
    {
      id: "t11-22",
      type: "concept",
      diff: 3,
      text: "Thermoforming (vacuum forming) is best described as:",
      options: [
        { label: "a", text: "Mixing fillers, pigments and stabilizers into a resin before it is shaped into the final article." },
        { label: "b", text: "Curing a thermoset inside a closed mould by maintaining pressure while a covalent network develops." },
        { label: "c", text: "Heating a thermoplastic sheet until soft, then drawing it against a mould by vacuum or pressure." },
        { label: "d", text: "Forcing molten polymer through spinneret holes and drawing the emerging filaments into fibres." }
      ],
      answer: "c",
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
        { label: "a", text: "2 and 4 only" },
        { label: "b", text: "1, 2, 3 and 4" },
        { label: "c", text: "1, 2 and 3 only" },
        { label: "d", text: "4 only" }
      ],
      answer: "c",
      why: "1–3 are correct. Item 4 is wrong — spinning forms **filaments/fibres** through a spinneret; hollow fibres are a special case, not the general rule.",
      tags: ["revision"],
    },
        {
      "id": "t11-24",
      "type": "apply",
      "diff": 3,
      "text": "A complex phenolic electrical connector has thin ribs and a metal insert. The preheated thermoset charge must flow into a closed, heated cavity around the insert. Which process best fits the requirement?",
      "options": [
        {
            "label": "a",
            "text": "Transfer moulding: force a preheated charge from a pot into a closed, heated cavity."
        },
        {
            "label": "b",
            "text": "Blow moulding, where a softened parison expands against the wall of a hollow mould."
        },
        {
            "label": "c",
            "text": "Thermoplastic injection moulding, where a melt is cooled and remelted on the next production cycle."
        },
        {
            "label": "d",
            "text": "Compression moulding, where the charge is placed directly in the cavity and compressed to fill it."
        }
      ],
      "answer": "a",
      "why": "Transfer moulding forces a preheated thermoset charge from a transfer pot into a closed heated cavity, supporting complex features and insert encapsulation. Compression moulding is a plausible alternative for simpler geometries, but the stated charge-transfer requirement identifies transfer moulding.",
      "distractors": {
        "d": "Compression moulding places the charge directly in the cavity rather than transferring it from a pot through a sprue.",
        "c": "A cured thermoset does not remelt like a thermoplastic during a later cycle.",
        "b": "Blow moulding uses an expandable parison to form hollow parts, not a thermoset charge around a metal insert."
      },
      "concept": "Transfer moulding is useful for complex thermoset parts with inserts and restricted flow paths.",
      "tags": [
        "revision"
      ]
    },
    {
      id: "t11-25",
      type: "concept",
      diff: 3,
      text: "Why does annealing a moulded semi-crystalline part often increase its crystallinity and reduce internal stress?",
      options: [
        { label: "a", text: "Annealing adds covalent cross-links that block crystallization and preserve the original moulded-in orientation." },
        { label: "b", text: "Holding a semicrystalline part above Tg permits secondary crystallization and chain relaxation, reducing residual stress." },
        { label: "c", text: "Annealing irreversibly cures the thermoplastic into a thermoset network, eliminating the need for later remelting." },
        { label: "d", text: "Annealing changes surface gloss only; below melting it cannot change polymer morphology or residual stress." }
      ],
      answer: "b",
      why: "Above Tg the chains are mobile: secondary crystallization increases crystallinity and perfection, while stress relaxation removes residual orientation from filling. Both improve dimensional stability (at the cost of cycle time).",
      concept: "annealing: crystallize further + relax internal stress",
      tags: ["confused"],
    },
        {
      "id": "t11-26",
      "type": "higher",
      "diff": 4,
      "text": "A product needs aligned glass fibres, a constant cross-section and continuous length. Which process best matches all three requirements?",
      "options": [
        {
            "label": "a",
            "text": "Pultrusion pulls continuous reinforced fibres through a heated die to make aligned, constant-section profiles."
        },
        {
            "label": "b",
            "text": "Filament winding lays continuous fibres onto a rotating mandrel to make hollow or closed-section parts such as vessels."
        },
        {
            "label": "c",
            "text": "Resin-transfer moulding fills a fibre preform inside a closed mould with resin to produce a discrete composite component."
        },
        {
            "label": "d",
            "text": "Compression moulding presses a fibre-bearing charge inside a closed cavity, producing a finite-length shaped component."
        }
      ],
      "answer": "a",
      "why": "Pultrusion continuously pulls aligned reinforcement through a heated die, making long profiles with a constant cross-section. The other processes can use continuous fibres but generally produce mandrel-wound or mould-defined discrete parts.",
      "distractors": {
        "b": "Filament winding is well suited to hollow or closed-section parts such as pressure vessels, not arbitrary constant-section profiles.",
        "c": "Resin-transfer moulding uses a closed mould to produce a discrete component.",
        "d": "Compression moulding produces finite mouldings rather than an uninterrupted profile of arbitrary length."
      },
      "concept": "Pultrusion produces continuous aligned-fibre profiles with constant cross-section.",
      "tags": [
        "confused"
      ]
    },
  ],
};

export default T11;
