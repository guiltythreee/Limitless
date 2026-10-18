// Condensed lesson theory for MT202, one entry per chapter. Kept in the
// bundle (small); the 387 quiz questions live in public/data and load on
// demand. Content is derived from the MT202 modules / condensed notes.

export type Section = { h: string; p: string };
export type Formula = { name: string; expr: string; note?: string; vars?: string[] };

export type Lesson = {
  id: string;
  title: string;
  subtitle: string;
  aim: string;
  sections: Section[];
  formulas: Formula[];
  memorise: string[];
};

export const LESSONS: Record<string, Lesson> = {
  ch01: {
    id: "ch01",
    title: "Atomic Structure and Interatomic Bonding",
    subtitle: "Chapter 1 · 30 questions",
    aim: "Know why atoms bond the way they do — every macroscopic property in this course traces back to the shape of the interatomic energy curve.",
    sections: [
      {
        h: "Branches of metallurgy",
        p: "**Physical metallurgy** — how the physical/mechanical properties of metals and alloys are controlled by composition, mechanical treatment and heat treatment; the *microstructure–property correlation*.\n**Extractive (process) metallurgy** — obtaining metals from ores.\n**Mechanical metallurgy** — behaviour under applied loads.\n\n:::warning Exam trap (P1)\nOre extraction is **never** physical metallurgy — that is extractive metallurgy.\n:::",
      },
      {
        h: "Atomic number, mass and shells",
        p: "*Z* = number of protons (defines the element). *A* = protons + neutrons (mass number).\n\nMaximum electrons in shell *n*:\n\n$$ N_{\\max} = 2n^2 $$\n\n→ 2, 8, 18, 32 for n = 1…4.\n\n**Four quantum numbers:**\n- **n** — shell energy level\n- **l** — subshell shape (l = 0, 1, 2, 3 → s, p, d, f)\n- **mₗ** — orbital orientation\n- **mₛ** — spin (±½)\n\n**Pauli exclusion:** a quantum state holds at most two electrons, of opposite spin.\nThe famous exception: **4s fills before 3d** — this single fact is why the transition metals (Fe, Ti, Cr, Mn) exist as a distinct family with variable valence.",
      },
      {
        h: "The four bond types",
        p: "| Bond | Mechanism | Energy (kJ/mol) | Character |\n|---|---|---|---|\n| Ionic | electron transfer, Coulomb attraction | 600–1500 | hard, brittle, insulator |\n| Covalent | shared localised electron pairs | 200–1000 | strongly directional (diamond) |\n| Metallic | shared *delocalised* electron gas | 70–850 | conducting, ductile, lustrous |\n| Van der Waals | induced-dipole attraction | 1–10 | weak, secondary, low-T only |\n\nMetallic bonding is **non-directional** — ion cores can slide past one another without breaking a specific bond. That is the origin of ductility, not any 'heat treatment' argument.\n\n:::warning Exam trap (P3)\nBonding energy is **potential energy**, never thermal.\n:::",
      },
      {
        h: "The interatomic energy curve E(r)",
        p: "The interatomic energy balances a long-range attraction against a steep short-range repulsion:\n\n$$ E(r) = -\\frac{A}{r^{m}} + \\frac{B}{r^{n}}, \\qquad n > m $$\n\n(the repulsive wall rises more steeply as r → 0 precisely because **n > m**).\n\nAt **r₀** (equilibrium spacing): net force zero, i.e. **dE/dr = 0** — but the attractive and repulsive forces are each *finite*, only their *sum* vanishes.\n\nThree links to engineering properties:\n- **Curvature at r₀ → elastic modulus** (stiff well = stiff material)\n- **Asymmetry of the well → thermal expansion** (added energy makes the atom oscillate about a *larger* average spacing)\n- **Depth E₀ → bond energy → melting point**\n\n:::takeaway Key takeaway\nr₀ fixes the *atomic diameter* — it does **not** fix coordination number.\n:::\n\n:::warning Exam trap (P1/P3)\nThe three links above are the course's favourite P1/P3 source: depth of the well gives the melting point; nothing here fixes the coordination number.\n:::",
      },
    ],
    formulas: [
      { name: "Shell capacity", expr: "N_{\\max} = 2n^2", vars: ["n — principal quantum number (shell number)"], note: "n = 3 → 18 electrons" },
      { name: "Interatomic energy", expr: "E(r) = -\\frac{A}{r^{m}} + \\frac{B}{r^{n}}", vars: ["r — interatomic separation", "A, m — attraction constants", "B, n — repulsion constants (n > m)"], note: "equilibrium at r₀, where dE/dr = 0" },
      { name: "Force", expr: "F = -\\frac{dE}{dr}", vars: ["E — interaction energy", "r — interatomic separation"], note: "zero at r₀; each component force is finite there" },
    ],
    memorise: [
      "Bond energies: vdW 1–10 < metallic 70–850 < covalent 200–1000 < ionic 600–1500 kJ/mol.",
      "l = 0, 1, 2, 3 → s, p, d, f (memorise cold — recurs all course).",
      "4s before 3d → transition metals, variable valence.",
      "Curvature → modulus · Asymmetry → thermal expansion · Depth → melting point.",
    ],
  },

  ch02: {
    id: "ch02",
    title: "Structure of Metals",
    subtitle: "Chapter 2 · 48 questions",
    aim: "Crystal structures, close-packing, Miller indices and diffraction — the geometric skeleton every later chapter hangs on.",
    sections: [
      {
        h: "Crystalline vs amorphous",
        p: "A **crystal** has long-range periodic order; an **amorphous** solid has only short-range order. Metals crystallise because the metallic bond is non-directional — nothing resists the atoms packing into the most efficient arrangement. The repeating unit is the **unit cell**; the array of cell corners is the **lattice**.",
      },
      {
        h: "BCC, FCC, HCP — the master table",
        p: "| Property | BCC | FCC | HCP |\n|---|---|---|---|\n| Atoms per cell | 2 | 4 | 6 |\n| Coordination number | 8 | 12 | 12 |\n| Atomic packing factor | 0.68 | 0.74 | 0.74 |\n| Close-packed planes | none true | {111} | (0001) |\n| c/a ideal | — | — | 1.633 |\n| Examples | α-Fe, Cr, W, Mo | γ-Fe, Cu, Al, Au | Ti, Zn, Mg, Co |\n\nAtomic-radius relations: $r_{\\mathrm{BCC}} = \\frac{\\sqrt{3}}{4}a$, $r_{\\mathrm{FCC}} = \\frac{\\sqrt{2}}{4}a$, HCP $a = 2r$.\nFCC and HCP share APF 0.74 — the two densest packings, differing only in stacking sequence (ABCABC vs ABAB).",
      },
      {
        h: "Polymorphism (allotropy)",
        p: "The same element changes structure with temperature. For iron: **α-Fe (BCC) → γ-Fe (FCC, above 912 °C) → δ-Fe (BCC, above 1394 °C)**. Carbon's far higher solubility in FCC γ-iron (2.11 wt%) than in BCC α-iron (0.02 wt%) is the entire basis of steel heat treatment.",
      },
      {
        h: "Miller indices",
        p: "**Directions [uvw]** — intercept-free vector components in units of the edge; negative components get a bar.\n**Planes (hkl)** — take intercepts, reciprocate, clear fractions. Key planes: (100) face, (110) diagonal, (111) octahedral close-packed plane in FCC. (001)-type planes of HCP need the four-index (hkil) system with i = −(h+k).\n\n**Interplanar spacing** (cubic):\n\n$$ d_{hkl} = \\frac{a}{\\sqrt{h^2 + k^2 + l^2}} $$\n\n:::takeaway\nFor cubic systems, larger $(h^2+k^2+l^2)$ means smaller $d_{hkl}$; higher-order reflections correspond to the same family.\n:::",
      },
      {
        h: "X-ray diffraction — Bragg's law",
        p: "$$ n\\lambda = 2d\\sin\\theta $$\n\nParallel rays reflected from successive planes interfere constructively only at specific angles θ — measuring θ (for known λ) gives d, hence the lattice parameter. This is how the structures above were proven, and how phases are identified experimentally.",
      },
      {
        h: "Void sites",
        p: "FCC has 6 octahedral voids per cell (r_void/r_atom = 0.414) and 8 tetrahedral voids (0.225). BCC has only *distorted octahedral* sites (0.155) — small enough that carbon's presence there strains the lattice hard, which is why BCC α-iron dissolves almost no carbon (0.02 wt%) while FCC γ-iron dissolves 2.11 wt%.",
      },
    ],
    formulas: [
      { name: "BCC radius", expr: "r = \\frac{\\sqrt{3}}{4}a", vars: ["r — atomic radius", "a — lattice parameter"], note: "atoms touch along body diagonal" },
      { name: "FCC radius", expr: "r = \\frac{\\sqrt{2}}{4}a", vars: ["r — atomic radius", "a — lattice parameter"], note: "atoms touch along face diagonal: $\\sqrt{2}\\,a = 4r$" },
      { name: "Packing factor", expr: "APF = \\frac{(\\text{atoms/cell})\\,\\times\\,V_{\\text{atom}}}{V_{\\text{cell}}}", note: "0.68 BCC, 0.74 FCC/HCP" },
      { name: "Plane spacing", expr: "d_{hkl} = \\frac{a}{\\sqrt{h^2+k^2+l^2}}", vars: ["a — cubic lattice parameter", "h,k,l — Miller indices"], note: "cubic only" },
      { name: "Bragg's law", expr: "n\\lambda = 2d\\sin\\theta", vars: ["n — order (integer)", "\\lambda — wavelength", "d — interplanar spacing", "\\theta — Bragg angle"], note: "constructive diffraction condition" },
    ],
    memorise: [
      "BCC/FCC/HCP: 2·4·6 atoms, CN 8·12·12, APF 0.68·0.74·0.74.",
      "FCC close-packed planes {111}; HCP (0001); BCC has NO true close-packed plane.",
      "α-Fe BCC → 912 °C → γ-Fe FCC → 1394 °C → δ-Fe BCC.",
      "Carbon solubility in γ-Fe ≈ 2.11 wt% vs α-Fe ≈ 0.02 wt% — the key to all steel heat treatment.",
      "nλ = 2d sinθ; d_hkl = a/√(h²+k²+l²).",
    ],
  },

  ch03: {
    id: "ch03",
    title: "Solidification of Metals",
    subtitle: "Chapter 3 · 53 questions",
    aim: "Nucleation → growth → casting structure. This chapter is dense with P3 (latent heat = bonding energy) traps — read the energy sections twice.",
    sections: [
      {
        h: "Cooling curves and latent heat",
        p: "Pure metal: temperature falls, then **arrests** at Tm while liquid → solid, then falls again. The plateau exists because solidification *releases* latent heat of fusion, which balances heat loss.\n\n:::warning Exam trap (P3)\nThat latent heat is the extra **bonding (potential) energy** released when atoms fall into the deeper energy wells of the solid. It is NOT 'kinetic energy gained', and the plateau is NOT 'atoms moving slower'. The thermal energy of the atoms is unchanged during the arrest.\n:::",
      },
      {
        h: "Nucleation",
        p: "A growing embryo balances two terms:\n$$ \\Delta G = \\frac{4}{3}\\pi r^3 \\Delta G_v + 4\\pi r^2 \\gamma $$\n\n$$ r^* = -\\frac{2\\gamma}{\\Delta G_v}, \\qquad \\Delta G^* = \\frac{16\\pi\\gamma^3}{3(\\Delta G_v)^2} $$\n\n:::note Sign convention\n$\\Delta G_v$ is the *signed* volume free-energy change, negative below $T_m$: the volume term drives the transformation and the surface term opposes it. With that sign, $r^* = -2\\gamma/\\Delta G_v > 0$; written with the magnitude it is $r^* = 2\\gamma/|\\Delta G_v|$. Larger supercooling makes $\\Delta G_v$ more negative, so $r^*$ falls.\n:::\n\n- **Homogeneous** nucleation needs huge supercooling (~0.2 Tm) — rare in practice.\n- **Heterogeneous** nucleation on mould walls, oxides, inoculants: same physics but the substrate replaces part of the new surface, collapsing $\\Delta G^*$. Practically all solidification is heterogeneous — that is why castings have coarse grains unless inoculated.",
      },
      {
        h: "Growth",
        p: "Below Tm the driving force pushes the solid/liquid interface forward.\n- **Planar growth** — pure metals, high gradient: smooth front.\n- **Cellular / dendritic growth** — alloys: solute is rejected at the interface, creating **constitutional supercooling** ahead of the front; the planar front breaks into cells, then dendrites with primary arms, secondary arms and arm spacing set by cooling rate (faster cooling → finer arms → finer segregation).",
      },
      {
        h: "Cast structure of an ingot",
        p: "Three zones, outside inward:\n1. **Chill zone** — fine equiaxed grains at the cold mould wall (rapid nucleation).\n2. **Columnar zone** — elongated grains growing along the thermal gradient, competitive growth.\n3. **Equiaxed centre** — grains nucleated in the undercooled bulk liquid.\nFaster cooling, inoculation and mechanical agitation shrink the columnar zone and enlarge the equiaxed zone.",
      },
      {
        h: "Segregation and homogenisation",
        p: "Dendritic growth rejects solute → **coring** (microsegregation: dendrite arms solute-rich, centres solute-poor). Coring is removed by **diffusion annealing (homogenisation)** at high temperature — which itself calls on Chapter 8's diffusion equations.",
      },
    ],
    formulas: [
      { name: "Nucleation balance", expr: "\\Delta G = \\frac{4}{3}\\pi r^3 \\Delta G_v + 4\\pi r^2 \\gamma", vars: ["\\Delta G — total free-energy change of the embryo", "r — radius of the embryo", "\\Delta G_v — volume free-energy change per unit volume (negative below $T_m$)", "\\gamma — surface energy per unit area"], note: "volume term drives the transformation; surface term opposes it" },
      { name: "Critical radius", expr: "r^* = -\\frac{2\\gamma}{\\Delta G_v}", vars: ["r^* — critical (nucleus) radius", "\\gamma — solid/liquid surface energy", "\\Delta G_v — volume free-energy change per unit volume (negative below $T_m$)"], note: "larger supercooling makes $\\Delta G_v$ more negative → smaller $r^*$; with the magnitude, $r^* = 2\\gamma/|\\Delta G_v|$" },
      { name: "Barrier height", expr: "\\Delta G^* = \\frac{16\\pi\\gamma^3}{3(\\Delta G_v)^2}", note: "homogeneous ≫ heterogeneous" },
      { name: "Bulk driving force", expr: "\\Delta G_v \\approx \\frac{\\Delta H_f \\cdot \\Delta T}{T_m}", vars: ["\\Delta H_f — latent heat of fusion", "\\Delta T — supercooling", "T_m — melting temperature (absolute)"], note: "ΔT = supercooling" },
    ],
    memorise: [
      "Latent heat of fusion = bonding (potential) energy released. [P3, appears every quiz]",
      "Cooling-curve plateau = heat release balancing heat loss; temperature stays at Tm.",
      "r* = 2γ/ΔG_v; more supercooling → smaller critical nucleus → more nuclei → finer grains.",
      "Zones: chill → columnar → equiaxed; columnar grows along the temperature gradient.",
      "Dendrite arm spacing ∝ cooling rate (faster → finer).",
    ],
  },

  ch04: {
    id: "ch04",
    title: "Constitution of Alloys and Alloy Solidification",
    subtitle: "Chapter 4 · 42 questions",
    aim: "Read any phase diagram cold: phases, tie lines, lever rule, invariant reactions — plus what actually happens as an alloy of each class solidifies.",
    sections: [
      {
        h: "Phases, microconstituents, solubility",
        p: "A **phase** is a homogeneous portion of the system with one composition and one structure. A **microconstituent** is any structurally distinct feature seen in a micrograph (e.g. pearlite, proeutectoid α). Complete solubility needs the **Hume–Rothery** conditions: same crystal structure, similar electronegativity, similar size (within ~15%), and (for FCC) similar valence.\n**Substitutional** solute atoms sit on lattice sites; **interstitial** ones (C, N, H) sit in voids.",
      },
      {
        h: "The Gibbs phase rule (condensed)",
        p: "$$ P + F = C + 1 $$\n\n(constant pressure; $C$ = components, $P$ = phases, $F$ = degrees of freedom).\n\n- **$P = 1$ → $F = 1$** (temperature free to vary)\n- **$P = 2$ → $F = 1$** (pick T, compositions fixed by the tie line)\n- **$P = 3$ → $F = 0$** (invariant point — fixed composition *and* fixed temperature)\n\n:::definition Gibbs phase rule (condensed)\nAt constant pressure, the number of independent intensive variables is $F = C - P + 1$.\n:::",
      },
      {
        h: "Isomorphous diagrams (Cu–Ni)",
        p: "Complete liquid + complete solid solubility. Above the **liquidus** all liquid; below the **solidus** all solid; between them, two phases whose compositions read off the tie line at that temperature.\n\n**Lever rule:** for overall $C_0$ in the $\\alpha+L$ region:\n\n$$ W_\\alpha = \\frac{C_L - C_0}{C_L - C_\\alpha}, \\qquad W_L = \\frac{C_0 - C_\\alpha}{C_L - C_\\alpha} $$\n\nThe lever is always *opposite-side arm / total tie line*.\n\n:::warning Non-equilibrium\nReal castings solidify with **coring** (non-equilibrium); the effective solidus is lowered and a eutectic can appear even in an alloy that equilibrium says is single-phase.\n:::",
      },
      {
        h: "Invariant reactions",
        p: "| Reaction | Type | Diagram feature | Example |\n|---|---|---|---|\n| L → α + β | Eutectic | V (down) | Pb–Sn at 61.9 wt% Sn, 183 °C |\n| γ → α + β | Eutectoid | V from solid | Fe–C at 0.76 wt% C, 727 °C |\n| L + α → β | Peritectic | Λ (up) | Cu–Zn |\n| α + β → γ | Peritectoid | Λ from solids | — |\n| L → solid (same comp) | Congruent | liquidus = solidus minimum/maximum | — |\n\n*Mnemonic:* eutectic/eutectoid — **one thing splits into two** (L→ or γ→ both solids); peritectic/peritectoid — **two things combine into one** (L + α → β).",
      },
      {
        h: "Solidification of eutectic alloys",
        p: "Off-eutectic alloys first precipitate **proeutectoid** α (or β) while the liquid enriches toward the eutectic composition; the remaining liquid then transforms isothermally to the **eutectic microconstituent** (lamellar α + β). Exactly eutectic composition: L → α + β directly at T_E, entirely isothermal, giving the characteristic plate/lamellar structure. Pb–Sn phase diagram values to know: eutectic 61.9 wt% Sn, 183 °C; α max solubility 19.2 wt% Sn; β side 97.5 wt% Sn.",
      },
    ],
    formulas: [
      { name: "Phase rule (condensed)", expr: "P + F = C + 1", vars: ["P — number of phases", "F — degrees of freedom", "C — number of components"], note: "constant pressure" },
      { name: "Lever rule", expr: "W_\\alpha = \\frac{C_L - C_0}{C_L - C_\\alpha}", vars: ["C_0 — overall composition", "C_L — composition of liquid phase", "C_\\alpha — composition of $\\alpha$ phase"], note: "take the arm opposite the phase you want; divide by total tie line" },
      { name: "Tie line", expr: "W_\\text{phase1} + W_\\text{phase2} = 1", note: "endpoints give phase compositions at that T, not C₀" },
    ],
    memorise: [
      "Lever rule: take the arm on the OPPOSITE side of the phase you want; divide by total tie-line length.",
      "Eutectic L→α+β (Pb–Sn 61.9 wt% Sn, 183 °C); eutectoid γ→α+β (Fe–C 0.76 wt% C, 727 °C).",
      "P + F = C + 1: invariant point → F = 0 (fixed T and composition).",
      "Proeutectoid phase forms BETWEEN liquidus/solidus and the invariant line; eutectic forms isothermally at T_E.",
    ],
  },

  ch05: {
    id: "ch05",
    title: "Crystal Defects",
    subtitle: "Chapter 5 · 50 questions",
    aim: "Point defects, dislocations, interfaces. Defects are not accidents — they are the mechanism behind diffusion, strengthening and almost every property you will study.",
    sections: [
      {
        h: "Vacancies",
        p: "Vacancies make diffusion and creep possible. Their equilibrium concentration rises exponentially with temperature:\n\n$$ C_v = N \\exp\\left(-\\frac{Q_v}{RT}\\right) $$\n\nwhere $N$ is the total number of lattice sites, $Q_v$ the vacancy formation energy, $R$ the gas constant and $T$ absolute temperature.\n\n:::takeaway\nVacancies exist at **all** temperatures above 0 K; the number increases sharply with T.\n:::",
      },
      {
        h: "Dislocation density",
        p: "A practical measure of cold work:\n\n$$ \\rho = \\frac{\\text{total line length}}{\\text{volume}} \\quad (\\text{cm/cm}^3) $$\n\nTypical values: annealed $10^6$–$10^8\\,\\text{cm/cm}^3$; heavily cold-worked up to $10^{12}\\,\\text{cm/cm}^3$.\n\n:::definition Dislocation\nA line defect separating slipped from unslipped crystal regions.\n:::",
      },
      {
        h: "Interfaces",
        p: "Ranked by energy and misorientation:\n- **Surface (external)** — highest energy per area; drives sintering and grain growth.\n- **Grain boundary** — high-angle (>~15°) boundaries: large misorientation, high energy, fast-diffusion paths and obstacles to slip; low-angle boundaries ≈ an array of dislocations (tilt = edge array, twist = screw array).\n- **Twin boundary** — coherent, low energy; mirror-image lattice across the plane. Annealing twins are common in FCC metals (Cu, austenite).\n- **Stacking fault** — a local break in the ABC stacking sequence; wide in low stacking-fault-energy metals (brass, austenitic steels).",
      },
    ],
    formulas: [
      { name: "Equilibrium vacancies", expr: "C_v = N \\exp\\left(-\\frac{Q_v}{RT}\\right)", vars: ["N — total lattice sites per unit volume", "Q_v — vacancy formation energy", "R — universal gas constant", "T — absolute temperature"], note: "rises exponentially with T" },
      { name: "Dislocation density", expr: "\\rho = \\frac{L}{V}", vars: ["L — total dislocation line length", "V — volume"], note: "$10^6$ annealed → $10^{12}$ heavily cold-worked ($\\text{cm/cm}^3$)" },
      { name: "Low-angle boundary", expr: "\\theta \\approx \\frac{b}{D}", vars: ["\\theta — misorientation angle (radians)", "b — Burgers vector magnitude", "D — spacing between dislocations"], note: "tilt and twist walls" },
    ],
    memorise: [
      "Edge: b ⊥ line, extra half-plane. Screw: b ∥ line, spiral ramp.",
      "C_v = N exp(−Qv/RT) — vacancies exist at ALL temperatures above 0 K, more at high T.",
      "Schottky = vacancy pair (charge balance in ionic solids); Frenkel = interstitial + vacancy.",
      "Strain field of a dislocation = why it interacts with solutes/other dislocations = why metals can be strengthened.",
      "High-angle grain boundaries: high energy, fast diffusion, block slip.",
    ],
  },

  ch06: {
    id: "ch06",
    title: "Plastic Deformation",
    subtitle: "Chapter 6 · 38 questions",
    aim: "Slip systems, the Schmid factor, single vs polycrystal behaviour, twinning and cold work — deformation is dislocations moving on specific planes in specific directions.",
    sections: [
      {
        h: "Slip systems",
        p: "Plastic deformation = dislocation glide along **slip planes** (densest planes) in **slip directions** (densest directions).\n- **FCC** — {111}⟨110⟩: 4 planes × 3 directions = **12 systems**; ductile (Cu, Al, austenite).\n- **BCC** — {110}⟨111⟩: **48 systems** in total; many systems active but slip is thermally sensitive → brittle at low temperature (α-Fe below DBTT).\n- **HCP** — (0001)⟨11-20⟩: essentially **1 basal system**, fewest independent systems → poor ductility (Zn, Mg, Ti).\nThe more independent slip systems, the more ways a constrained grain can accommodate its neighbours → more ductile.",
      },
      {
        h: "Resolved shear stress — Schmid's law",
        p: "Apply tensile stress $\\sigma$ along the bar; only a component resolves onto the slip system:\n\n$$ \\tau_R = \\sigma \\cos\\phi \\cos\\lambda $$\n\n($\\phi$ = angle between applied stress and slip-plane normal; $\\lambda$ = angle between applied stress and slip direction)\n\n$$ m = \\cos\\phi \\cos\\lambda \\quad (m \\le 0.5) $$\n\nSlip starts when $\\tau_R$ reaches the **critical resolved shear stress $\\tau_{\\text{crss}}$** — a material constant, independent of crystal orientation.\n\n:::takeaway\nHarder orientations have smaller $m$; orientation alone does not change $\\tau_{\\text{crss}}$.\n:::",
      },
      {
        h: "Single crystals vs polycrystals",
        p: "Single crystal: deformation on the easiest system first; three **stages** of work hardening (I easy glide, II linear hardening with many active systems, III dynamic recovery).\nPolycrystal: grains constrain each other; a grain cannot change shape without its neighbours agreeing → **von Mises criterion**: at least **5 independent slip systems** must operate for homogeneous deformation. Grain boundaries block slip (pile-ups) — the seed of Hall–Petch in Ch 7.",
      },
      {
        h: "Twinning",
        p: "Twinning = uniform shear creating a **mirror-image** lattice region. Contrast with slip:\n| | Slip | Twinning |\n|---|---|---|\n| Magnitude | many interatomic spacings | fraction of one spacing |\n| Plane selection | only certain planes | any plane |\n| Result | no reorientation of lattice | lattice reoriented (mirror) |\n| Dominant in | FCC at all T | HCP (Mg, Zn), BCC at low T, and during high-rate/low-T deformation |\nTwinning often *activates* additional slip systems — it is a ductility rescue mechanism in HCP metals.",
      },
      {
        h: "Cold work",
        p: "%CW = (A₀ − A_d)/A₀ × 100 (tensile) or (t₀ − t_d)/t₀ × 100 (sheet).\nConsequences of cold work: ↑ dislocation density → ↑ strength & hardness, ↓ ductility, unchanged density, anisotropy from **texture** (preferred grain orientation), residual stresses.\nRecovery → **recrystallisation** (new strain-free grains at a characteristic T, finer with more prior cold work) → grain growth. Cold-worked metals below recrystallisation temperature retain the hardened structure indefinitely.",
      },
    ],
    formulas: [
      { name: "Schmid's law", expr: "\\tau_R = \\sigma\\cos\\phi\\cos\\lambda", vars: ["\\tau_R — resolved shear stress", "\\sigma — applied tensile stress", "\\phi — angle: stress–slip plane normal", "\\lambda — angle: stress–slip direction"], note: "$m = \\cos\\phi\\cos\\lambda \\le 0.5$ (max at $\\phi=\\lambda=45°$)" },
      { name: "Slip criterion", expr: "\\tau_R = \\tau_{\\text{crss}}", vars: ["\\tau_{\\text{crss}} — critical resolved shear stress (material constant)"], note: "$\\tau_{\\text{crss}}$ is orientation-independent" },
      { name: "Percent cold work", expr: "\\%CW = \\left(\\frac{A_0 - A_d}{A_0}\\right)\\times 100", vars: ["A_0 — original cross-sectional area", "A_d — area after deformation"], note: "also $\\%CW = (t_0-t_d)/t_0\\times 100$ for sheets" },
      { name: "von Mises", expr: "\\ge 5\\,\\text{independent slip systems}", note: "required for homogeneous deformation of a polycrystal" },
    ],
    memorise: [
      "FCC 12 systems {111}⟨110⟩ · BCC 48 {110}⟨111⟩ · HCP 1 basal (0001)⟨11-20⟩.",
      "τ_R = σ cosφ cosλ; max Schmid factor 0.5 at φ = λ = 45°.",
      "τ_crss is a material constant — orientation only changes the σ needed to reach it.",
      "Twinning: mirror image, fraction-of-spacing shear, dominates in HCP and at low T/high rate.",
      "More prior cold work → lower recrystallisation temperature → finer new grains.",
    ],
  },

  ch07: {
    id: "ch07",
    title: "Strengthening Mechanisms",
    subtitle: "Chapter 7 · 40 questions",
    aim: "Four ways to stop dislocations: grain boundaries, solutes, old dislocations, precipitates. Every commercial alloy is one of these, or a combination.",
    sections: [
      {
        h: "The common principle",
        p: "Strength = resistance to dislocation motion. Anything that **impedes glide** — a boundary, a solute atom's strain field, a tangle of other dislocations, a hard particle — raises the stress needed to deform. Each mechanism trades some ductility for strength.",
      },
      {
        h: "Grain-boundary strengthening — Hall–Petch",
        p: "A slip **pile-up** at a grain boundary concentrates stress on the next grain; shorter piles (smaller grains) transmit less stress, so more applied stress is needed to continue deformation:\n**σ_y = σ_0 + k_y · d^(−1/2)** (d = grain diameter).\nFiner grains → stronger AND (uniquely among strengthening methods) still reasonably tough. This is the only mechanism that improves strength without sacrificing ductility badly.",
      },
      {
        h: "Solid-solution strengthening",
        p: "Solute atoms create local strain fields (size mismatch) and modulus mismatch that interact with dislocation strain fields, pinning them.\n**Substitutional** — bigger/smaller atom strains the lattice; effectiveness grows with size difference and concentration.\n**Interstitial** — C, N in α-Fe: very strong per atom because the distortion is large (yield-point phenomena in mild steel come from C/N locking dislocations — strain ageing).\nGeneral rule: the greater the size/electronegativity/valence difference, the greater the strengthening (but beyond Hume–Rothery limits you get brittle intermetallics instead of a solution).",
      },
      {
        h: "Strain (work) hardening",
        p: "Cold work multiplies dislocations; they tangle, form walls and pile-ups, and each new dislocation needs ever more stress to move through the forest:\n**τ ∝ Gb√ρ** — flow stress rises with the square root of dislocation density ρ.\nThe stored strain energy is exactly the driving force for the recovery/recrystallisation of Ch 6.",
      },
      {
        h: "Precipitation & dispersion hardening",
        p: "Heat-treatable alloys (Al–Cu) are solution treated, quenched and **aged**: a fine, dense dispersion of particles forces dislocations either to cut through (coherent, ordered **GP zones → θ″ → θ′**) or to **bow between** particles (**Orowan looping**, incoherent θ and dispersion-hardened systems).\n**Overageing**: prolonged/hot ageing coarsens particles (Ostwald ripening) → spacing increases → strength falls. Peak hardness sits between underaged and overaged.\nDispersion hardening (e.g. thoria in TD-nickel, oxide in ODS alloys) works the same way but the particles are insoluble — the dispersion survives high temperatures where precipitates would dissolve.",
      },
      {
        h: "Summary table",
        p: "| Mechanism | Obstacle | Key equation | Special feature |\n|---|---|---|---|\n| Grain refinement | boundaries | σ_y = σ₀ + k d^(−1/2) | keeps toughness |\n| Solid solution | solute strain fields | — | C/N in Fe = yield point |\n| Strain hardening | dislocation forest | τ ∝ Gb√ρ | undone by anneal |\n| Precipitation | particles | Orowan / cutting | overageing coarsens |",
      },
    ],
    formulas: [
      { name: "Hall–Petch", expr: "\\sigma_y = \\sigma_0 + k_y\\, d^{-1/2}", vars: ["\\sigma_y — yield strength", "\\sigma_0 — friction stress", "k_y — strengthening coefficient", "d — grain diameter"], note: "finer grains → higher yield strength" },
      { name: "Taylor relation", expr: "\\tau \\propto G b \\sqrt{\\rho}", vars: ["\\tau — flow stress", "G — shear modulus", "b — Burgers vector magnitude", "\\rho — dislocation density"], note: "\\rho = dislocation density" },
      { name: "Orowan", expr: "\\tau \\approx \\frac{G b}{\\lambda}", vars: ["\\tau — shear stress", "G — shear modulus", "b — Burgers vector", "\\lambda — spacing between particles"], note: "dislocation loops around hard, incoherent particles" },
    ],
    memorise: [
      "σ_y = σ₀ + k_y d^(−1/2) — smaller grain = stronger, the only 'free lunch' mechanism.",
      "τ ∝ Gb√ρ — cold work works by multiplying dislocations.",
      "Underage → peak → overage: coarsening of precipitates explains the fall after peak hardness.",
      "Cutting for coherent particles; Orowan looping for hard incoherent particles.",
      "C/N interstitials in α-Fe → strain ageing / yield point.",
    ],
  },

  ch08: {
    id: "ch08",
    title: "Diffusion",
    subtitle: "Chapter 8 · 36 questions",
    aim: "Fick's laws, the two classic solutions, and the Arrhenius dependence of D on temperature — the engine behind heat treatment, carburising, creep and sintering.",
    sections: [
      {
        h: "Mechanisms",
        p: "**Vacancy diffusion** — atoms swap with adjacent vacancies; the dominant mechanism for self-diffusion and substitutional solutes (Cu in Cu–Ni). Rate set by vacancy concentration × jump frequency — both rise with temperature.\n**Interstitial diffusion** — small atoms (C, N, H, O) hop void-to-void without needing vacancies; much faster (e.g. C in γ-Fe). Grain boundaries and dislocations are **short-circuit paths** — faster than lattice diffusion.",
      },
      {
        h: "Fick's first law (steady state)",
        p: "**J = −D · dC/dx**  [mol·m⁻²·s⁻¹ or atoms·cm⁻²·s⁻¹]\nFlux ∝ concentration gradient; the minus sign means diffusion down the gradient. Used for steady permeation through a membrane: J = D(C₂ − C₁)/x.",
      },
      {
        h: "Fick's second law (transient)",
        p: "$$ \\frac{\\partial C}{\\partial t} = D\\, \\frac{\\partial^2 C}{\\partial x^2} $$\n\nTwo solutions to know cold:\n\n**Carburising** (fixed initial $C_0$, surface held at $C_s$, $x>0$):\n$$ C(x,t) = C_s - (C_s - C_0)\\,\\operatorname{erf}\\left(\\frac{x}{2\\sqrt{Dt}}\\right) $$\n\n**Constant source / decarburising form** appears as the complement; the **penetration depth** scales as $\\sqrt{Dt}$ — quadruple the time to go twice as deep. The master variable is always $x/(2\\sqrt{Dt})$.",
      },
      {
        h: "The diffusion coefficient",
        p: "$$ D = D_0 \\exp\\left(-\\frac{Q_d}{RT}\\right) $$\n\n$D_0$ = pre-exponential; $Q_d$ = activation energy. Plotting $\\ln D$ vs $1/T$ gives a straight line of slope $-Q_d/R$.\n\n:::note\nInterstitial diffusion (e.g. C in $\\gamma$-Fe) has a lower $Q_d$ and runs far faster than substitutional (vacancy) diffusion.\n:::",
      },
      {
        h: "Driving forces & effects",
        p: "Concentration gradients are the common driving force, but diffusion also runs down **activity** gradients and under **stress** and **electric** gradients.\n**Kirkendall effect** — when D_A ≠ D_B, the lattice planes themselves drift (marker movement); proves the vacancy mechanism rather than direct exchange.\nPractical consequences: carburising/decarburising of steels, homogenisation of cored castings, sintering of powders, creep by vacancy migration.",
      },
    ],
    formulas: [
      { name: "Fick's first law", expr: "J = -D\\,\\frac{dC}{dx}", vars: ["J — flux (atoms/area/time)", "D — diffusion coefficient", "dC/dx — concentration gradient"], note: "steady state; flux down the gradient" },
      { name: "Fick's second law", expr: "\\frac{\\partial C}{\\partial t} = D\\,\\frac{\\partial^2 C}{\\partial x^2}", vars: ["C — concentration (function of x,t)", "D — diffusion coefficient", "t — time"], note: "time-dependent profiles" },
      { name: "Carburising solution", expr: "C(x,t) = C_s - (C_s - C_0)\\,\\operatorname{erf}\\left(\\frac{x}{2\\sqrt{Dt}}\\right)", vars: ["C_s — surface concentration", "C_0 — initial bulk concentration", "x — distance from surface", "t — time", "D — diffusion coefficient"], note: "master variable $\\eta = x/(2\\sqrt{Dt})$" },
      { name: "Arrhenius", expr: "D = D_0\\exp\\left(-\\frac{Q_d}{RT}\\right)", vars: ["D_0 — pre-exponential factor", "Q_d — activation energy", "R — gas constant", "T — absolute temperature"], note: "$\\ln D \\propto -Q_d/R$ at constant $D_0$" },
    ],
    memorise: [
      "Penetration depth ∝ √Dt: 4× time → 2× depth.",
      "Carburising: C = Cs − (Cs − C₀)·erf(x/2√Dt); decarburising flips the sign.",
      "D = D₀ exp(−Qd/RT): doubling T far more effective than extending time.",
      "Interstitial diffusion (C in Fe) is much faster than vacancy/substitutional diffusion.",
      "Grain boundaries = fast paths; Kirkendall effect proves the vacancy mechanism.",
    ],
  },
};

// Ch09 has no theory lesson — it is the revision mix, run as an exam.
export const EXAM_CHAPTER_ID = "ch09";
