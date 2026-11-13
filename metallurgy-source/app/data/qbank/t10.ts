import type { TopicSource } from "../../mt203/types";

/**
 * MT203 — Topic 10: Mechanical & Viscoelastic Properties
 * Source: Module 3 §1, §4 + Module 2 §5. 28 questions.
 */
const T10: TopicSource = {
  id: "t10",
  module: "m3",
  title: "Mechanical & Viscoelastic Properties",
  subtitle: "Topic 10 · stress–strain, creep, relaxation, models and time–temperature behaviour",
  subs: [
    { id: "T10.1", title: "Stress–strain behaviour and modulus" },
    { id: "T10.2", title: "Fracture, impact and toughness" },
    { id: "T10.3", title: "Creep, relaxation and hardness" },
    { id: "T10.4", title: "Viscoelastic models, hysteresis and Deborah number" },
    { id: "T10.5", title: "Time–temperature superposition and WLF" },
    { id: "T10.6", title: "Mechanical-property improvement" },
    { id: "T10.7", title: "Rheology" },
    { id: "T10.8", title: "Permeability, electrical, optical and flammability properties" },
  ],
  questions: [
    {
      id: "t10-01",
      type: "recall",
      diff: 1,
      text: "For a polymer specimen in the initial linear-elastic region, Young's modulus is:",
      options: [
        {
            label: "a",
            text: "The compliance, strain divided by stress, taken in the initial linear region and reported in reciprocal-pressure units.",
        },
        {
            label: "b",
            text: "Engineering stress, force divided by original cross-sectional area, with no division by the measured strain.",
        },
        {
            label: "c",
            text: "The area under the stress–strain curve up to fracture, representing energy absorbed per unit volume.",
        },
        {
            label: "d",
            text: "The slope of the initial linear-elastic stress–strain curve, given by stress change divided by strain change.",
        }
      ],
      answer: "d",
      why: "Young's modulus is the initial elastic slope of stress against strain. Compliance is its reciprocal; engineering stress is not a modulus; the area under the curve measures energy absorption per unit volume.",
      tags: [
        "revision"
      ],
      distractors: {
        a: "This is compliance, the reciprocal of Young's modulus.",
        b: "This is engineering stress, not stress divided by strain.",
        c: "This is the energy absorbed to fracture per unit volume (toughness), not the elastic slope.",
      },
    },
    {
      id: "t10-02",
      type: "numerical",
      diff: 2,
      text: "A specimen of cross-section 20 mm² carries a tensile force of 600 N and extends 0.5% of its original length. Its Young's modulus is:",
      options: [
        { label: "a", text: "1.2 GPa" },
        { label: "b", text: "12 GPa" },
        { label: "c", text: "6 GPa" },
        { label: "d", text: "30 GPa" }
      ],
      answer: "c",
      why: "$\\sigma = F/A = 600/20 = 30$ MPa. $\\varepsilon = 0.005$. $E = 30/0.005 = 6000$ MPa $= \\mathbf{6}$ GPa.",
      distractors: {
        a: "1.2 GPa uses $\\varepsilon = 2.5\\%$ by mistake.",
      },
      concept: "$\\sigma = F/A$ · $\\varepsilon = \\Delta L/L$ · $E = \\sigma/\\varepsilon$",
      tags: ["numeric", "formula"],
    },
    {
      id: "t10-03",
      type: "numerical",
      diff: 2,
      text: "A specimen of original length 50 mm breaks at a length of 250 mm. Its elongation at break is:",
      options: [
        { label: "a", text: "400%" },
        { label: "b", text: "200%" },
        { label: "c", text: "80%" },
        { label: "d", text: "500%" }
      ],
      answer: "a",
      why: "$\\varepsilon_b = \\dfrac{L_b - L_0}{L_0}\\times100 = \\dfrac{250-50}{50}\\times100 = \\mathbf{400\\%}$.",
      distractors: {
        d: "500% would be the ratio $L_b/L_0$, i.e. forgetting to subtract $L_0$.",
      },
      concept: "$\\varepsilon_b = (L_b-L_0)/L_0$",
      tags: ["numeric", "formula"],
    },
    {
      id: "t10-04",
      type: "graph",
      diff: 3,
      text: "Three stress–strain curves: A — steep, linear, breaks at 2% strain; B — yields at ~8% then draws to 400% strain; C — low modulus, huge recoverable strain to 700%. Identify them.",
      options: [
        { label: "a", text: "A = elastomer, B = brittle, C = ductile" },
        { label: "b", text: "All three are elastomers" },
        { label: "c", text: "A = brittle (e.g. PS), B = ductile (e.g. nylon), C = elastomer (e.g. rubber)" },
        { label: "d", text: "A = ductile, B = elastomer, C = brittle" }
      ],
      answer: "c",
      why: "**Brittle** = high modulus, tiny strain, no yielding (A); **ductile** = yields then cold-draws to large strain (B); **elastomer** = low modulus, very large *recoverable* strain via entropy elasticity (C).",
      concept: "shape of the curve identifies the class",
      tags: ["confused"],
    },
    {
      id: "t10-05",
      type: "concept",
      diff: 3,
      text: "What is 'cold drawing' in a semi-crystalline polymer?",
      options: [
        {
            label: "a",
            text: "Chemical cross-linking under stress",
        },
        {
            label: "b",
            text: "Thermal softening above Tm",
        },
        {
            label: "c",
            text: "The polymer melts and recrystallizes.",
        },
        {
            label: "d",
            text: "A neck forms and propagates as chains slide and orient along the draw direction; the crystallites align, raising strength in that direction.",
        }
      ],
      answer: "d",
      why: "Beyond yield, a **neck** forms and extends: chains become **oriented** along the stress axis, stiffening and strengthening the drawn region. The same mechanism produces strong fibres and biaxially oriented films.",
      concept: "drawing = orientation-induced strengthening",
      tags: ["revision"],
    },
    {
      id: "t10-06",
      type: "recall",
      diff: 1,
      text: "Which test is designed to compare the impact energy absorbed by notched polymer specimens under a pendulum strike?",
      options: [
        {
            label: "a",
            text: "Use a notched Izod or Charpy pendulum to measure impact energy absorbed during fracture.",
        },
        {
            label: "b",
            text: "A fracture-toughness test, using a pre-cracked specimen to determine a critical stress-intensity factor.",
        },
        {
            label: "c",
            text: "A tensile test, using the area under the engineering stress–strain curve from a slow uniaxial pull.",
        },
        {
            label: "d",
            text: "A flexural test, using the maximum bending stress measured during a three-point loading cycle.",
        }
      ],
      answer: "a",
      why: "Izod and Charpy pendulum tests measure impact energy absorbed by breaking a notched specimen. Tensile and flexural tests use different loading modes; fracture-toughness tests measure a different fracture parameter under specified conditions.",
      tags: [
        "revision"
      ],
      distractors: {
        c: "The area under a tensile stress–strain curve is work per unit volume, but it is not the notched pendulum impact result.",
        d: "Flexural testing applies bending and reports a flexural response rather than pendulum impact energy.",
        b: "Fracture toughness uses a crack geometry and fracture-mechanics criterion, not the simple pendulum energy measure.",
      },
    },
    {
      id: "t10-07",
      type: "concept",
      diff: 3,
      text: "Why does impact strength usually fall as test temperature decreases?",
      options: [
        { label: "a", text: "The polymer becomes more crystalline on cooling." },
        { label: "b", text: "The notch becomes sharper." },
        { label: "c", text: "Impact energy is temperature-independent." },
        { label: "d", text: "Below Tg the amorphous phase has little segmental mobility, so energy-absorbing mechanisms (crazing/shear yielding) cannot operate and the material behaves brittlely." }
      ],
      answer: "d",
      why: "Toughness depends on **dissipative mechanisms that need chain mobility**. Cooling toward and below Tg restricts segmental motion, so crazing and shear yielding become less extensive and less energy is dissipated before fracture; impact energy commonly falls.",
      concept: "impact toughness ∝ available chain mobility",
      tags: ["revision"],
    },
    {
      id: "t10-08",
      type: "concept",
      diff: 2,
      text: "Creep is:",
      options: [
        {
            label: "a",
            text: "the area of the hysteresis loop",
        },
        {
            label: "b",
            text: "gradual strain increase under constant applied load",
        },
        {
            label: "c",
            text: "reversible elastic recovery",
        },
        {
            label: "d",
            text: "gradual stress decrease under constant strain",
        }
      ],
      answer: "b",
      why: "**Creep** = time-dependent deformation at constant stress (strain grows, possibly to rupture). **Stress relaxation** is the constant-strain counterpart (stress decays).",
      distractors: {
        d: "That defines stress relaxation.",
      },
      tags: ["revision"],
    },
    {
      id: "t10-09",
      type: "compare",
      diff: 2,
      text: "Creep vs stress relaxation: which pairing of conditions is correct?",
      options: [
        {
            label: "a",
            text: "Both hold strain constant.",
        },
        {
            label: "b",
            text: "Both hold stress constant.",
        },
        {
            label: "c",
            text: "Creep: constant stress, strain increases. Stress relaxation: constant strain, stress decreases.",
        },
        {
            label: "d",
            text: "Creep: constant strain; relaxation: constant stress.",
        }
      ],
      answer: "c",
      why: "Two faces of **viscoelasticity**: hold σ (creep → measure ε(t)) or hold ε (relaxation → measure σ(t)). Both reflect molecular rearrangement over time.",
      tags: ["revision"],
    },
    {
      id: "t10-10",
      type: "concept",
      diff: 3,
      text: "In dynamic loading, hysteresis is observed because:",
      options: [
        {
            label: "a",
            text: "The stress response lags the strain (viscoelastic damping), so the loading and unloading curves form a loop whose area is the energy dissipated as heat per cycle.",
        },
        {
            label: "b",
            text: "The loading and unloading curves coincide.",
        },
        {
            label: "c",
            text: "The sample melts.",
        },
        {
            label: "d",
            text: "Energy is created in the cycle.",
        }
      ],
      answer: "a",
      why: "The **phase lag** between stress and strain produces a hysteresis loop; its **area = energy dissipated per cycle** — valuable for vibration damping, but a source of self-heating and fatigue in tyres.",
      concept: "hysteresis area = heat dissipated per cycle",
      tags: ["confused"],
    },
    {
      id: "t10-11",
      type: "match",
      diff: 2,
      text: "Match each viscoelastic model with its behaviour.",
      tableRows: [
        ["1", "Maxwell (spring + dashpot in series)", "", "(i) stress relaxation, finite relaxation time"],
        ["2", "Voigt/Kelvin (spring + dashpot in parallel)", "", "(ii) retarded elastic creep, no instantaneous elasticity"],
        ["3", "Burgers (4 elements)", "", "(iii) both creep and relaxation, with permanent flow"],
        ["4", "Ideal spring / dashpot", "", "(iv) purely elastic / purely viscous limits"],
      ],
      options: [
        { label: "a", text: "1-i, 2-ii, 3-iii, 4-iv" },
        { label: "b", text: "1-ii, 2-i, 3-iv, 4-iii" },
        { label: "c", text: "1-iii, 2-iv, 3-i, 4-ii" },
        { label: "d", text: "1-i, 2-ii, 3-iv, 4-iii" }
      ],
      answer: "a",
      why: "**Maxwell** (series) relaxes stress; **Voigt** (parallel) shows delayed creep; **Burgers** (four elements) predicts both with irreversible flow; ideal spring/dashpot are the elastic/viscous extremes.",
      tags: ["revision"],
    },
    {
      id: "t10-12",
      type: "numerical",
      diff: 3,
      text: "A Maxwell element has spring modulus $E = 1.0\\times10^{6}$ Pa and dashpot viscosity $\\eta = 1.0\\times10^{9}$ Pa·s. Its relaxation time $\\tau$ is:",
      options: [
        { label: "a", text: "1 s" },
        { label: "b", text: "0.001 s" },
        { label: "c", text: "1,000 s" },
        { label: "d", text: "$10^{15}$ s" }
      ],
      answer: "c",
      why: "$\\tau = \\eta/E = 10^{9}/10^{6} = \\mathbf{1000}$ s. Physically, the sample relaxes a large fraction of its stress in about $\\tau$.",
      distractors: {
        b: "0.001 s is $E/\\eta$, the reciprocal.",
        d: "$10^{15}$ multiplies rather than divides.",
      },
      concept: "$\\tau = \\eta/E$ (Maxwell)",
      tags: ["numeric", "formula"],
    },
    {
      id: "t10-13",
      type: "concept",
      diff: 3,
      text: "In a Voigt (Kelvin) element under constant stress, the strain is:",
      options: [
        {
            label: "a",
            text: "exponentially decaying",
        },
        {
            label: "b",
            text: "time-dependent and retarded: $\\varepsilon(t) = \\dfrac{\\sigma}{E}(1 - e^{-t/\\tau})$",
        },
        {
            label: "c",
            text: "instantaneous and constant",
        },
        {
            label: "d",
            text: "always zero",
        }
      ],
      answer: "b",
      why: "Because the dashpot is in **parallel** with the spring, strain cannot be instantaneous: it approaches the equilibrium value $\\sigma/E$ exponentially with time constant $\\tau = \\eta/E$ — ideal for describing creep (retardation), not relaxation.",
      concept: "Voigt: retarded creep · Maxwell: stress relaxation",
      tags: ["confused"],
    },
    {
      id: "t10-14",
      type: "concept",
      diff: 3,
      text: "The Deborah number $De = \\tau_{relaxation}/\\tau_{observation}$ tells us that:",
      options: [
        {
            label: "a",
            text: "It is a fixed material property.",
        },
        {
            label: "b",
            text: "It measures crystallinity.",
        },
        {
            label: "c",
            text: "It equals the glass-transition temperature.",
        },
        {
            label: "d",
            text: "The same material behaves glassy ($De \\gg 1$), rubbery or viscous ($De \\ll 1$) depending on the timescale of observation.",
        }
      ],
      answer: "d",
      why: "**Time–temperature equivalence in one number**: if the material relaxes much slower than the experiment ($De \\gg 1$) it looks solid/glassy; if much faster ($De \\ll 1$) it flows like a liquid — 'the mountains flow' (long observation time).",
      concept: "De = relaxation time / observation time",
      tags: ["confused"],
    },
    {
      id: "t10-15",
      type: "concept",
      diff: 3,
      text: "Time–temperature superposition shifts creep or relaxation data measured at different temperatures onto a single master curve because:",
      options: [
        {
            label: "a",
            text: "Raising the temperature speeds up molecular relaxation rates — so a high-temperature short-time test is equivalent to a low-temperature long-time test.",
        },
        {
            label: "b",
            text: "It only works for metals.",
        },
        {
            label: "c",
            text: "All polymers have identical Tg.",
        },
        {
            label: "d",
            text: "Temperature does not change molecular motion in polymers.",
        }
      ],
      answer: "a",
      why: "**TTS** exploits the equivalence of temperature and time: a shift factor $a_T$ (WLF above Tg, Arrhenius below) moves each isotherm horizontally. It is how a 20-year creep life is predicted from short lab tests.",
      concept: "shift factor $a_T$; WLF above Tg, Arrhenius below",
      tags: ["confused"],
    },
    {
      id: "t10-16",
      type: "statement",
      diff: 2,
      text: "Which statement(s) about the viscoelastic response of polymers is/are correct?",
      statements: [
        { num: 1, text: "The measured modulus generally decreases as temperature increases." },
        { num: 2, text: "The response depends on the rate (frequency) of loading." },
        { num: 3, text: "Polymer behaviour is time- and temperature-dependent — viscoelastic." },
        { num: 4, text: "At very low temperatures all polymers are highly viscous liquids." },
      ],
      options: [
        { label: "a", text: "1, 2, 3 and 4" },
        { label: "b", text: "4 only" },
        { label: "c", text: "2 and 4 only" },
        { label: "d", text: "1, 2 and 3 only" }
      ],
      answer: "d",
      why: "1–3 define viscoelasticity. Item 4 is false — at low temperature polymers are **glassy solids** (high modulus, brittle), not liquids; they are viscous near/above Tg.",
      distractors: {
        a: "Item 4 inverts the low-temperature state — the glassy-rubbery-viscous sequence is exactly reversed.",
      },
      tags: ["confused"],
    },
    {
      id: "t10-17",
      type: "graph",
      diff: 3,
      text: "A plot of tensile creep strain vs time is drawn at three temperatures: 20 °C (flat after a short rise), 60 °C (slow continuing rise), 90 °C (strain still rising steeply). The most defensible reading is:",
      options: [
        { label: "a", text: "Temperature does not affect creep." },
        { label: "b", text: "The polymer's Tm is 20 °C." },
        { label: "c", text: "Creep becomes much more pronounced as temperature rises; this is consistent with approaching or exceeding Tg, although the curves alone do not determine Tg precisely." },
        { label: "d", text: "The material is a metal." }
      ],
      answer: "c",
      why: "The strong increase in creep with temperature is consistent with increasing segmental mobility as the polymer approaches or passes through Tg. The plotted temperatures show the trend, but a precise Tg would require a separate thermal or dynamic-mechanical measurement.",
      concept: "creep ∝ chain mobility (temperature)",
      tags: ["confused"],
    },
    {
      id: "t10-18",
      type: "recall",
      diff: 1,
      text: "The solubility parameter δ is used to:",
      options: [
        {
            label: "a",
            text: "measure molecular weight",
        },
        {
            label: "b",
            text: "predict whether a polymer dissolves in (or swells in) a given solvent, and whether blends are compatible",
        },
        {
            label: "c",
            text: "calculate the melting point",
        },
        {
            label: "d",
            text: "find the density",
        }
      ],
      answer: "b",
      why: "**δ = (cohesive energy density)^½**. Similar Hildebrand δ values suggest better solubility or compatibility, especially for non-polar systems. For strongly polar or hydrogen-bonding materials, Hansen parameters or specific-interaction analysis is more reliable than a single δ value.",
      concept: "$\\delta = (\\Delta E_{vap}/V)^{1/2}$",
      tags: ["revision"],
    },
    {
      id: "t10-19",
      type: "apply",
      diff: 3,
      text: "A polyolefin (δ ≈ 16 (J/cm³)^½) seal must be printed with solvent-based ink. Which solvent family is most compatible?",
      options: [
        {
            label: "a",
            text: "Water (δ ≈ 48)",
        },
        {
            label: "b",
            text: "An aliphatic hydrocarbon such as hexane/heptane (δ ≈ 15–16)",
        },
        {
            label: "c",
            text: "Ethanol (δ ≈ 26)",
        },
        {
            label: "d",
            text: "Formamide (δ ≈ 39)",
        }
      ],
      answer: "b",
      why: "Matching δ is the rule: the **non-polar aliphatic hydrocarbon** matches the polyolefin. (In practice polyolefin surfaces are also corona/flame treated to add polar groups for adhesion.)",
      concept: "δ match → solubility/wetting/adhesion",
      tags: ["revision"],
    },
    {
      id: "t10-20",
      type: "concept",
      diff: 2,
      text: "Elastomer elasticity is described as *entropic* because:",
      options: [
        {
            label: "a",
            text: "It is identical to metal elasticity.",
        },
        {
            label: "b",
            text: "Bond lengths change on stretching.",
        },
        {
            label: "c",
            text: "The enthalpy dominates.",
        },
        {
            label: "d",
            text: "Stretching aligns chains into fewer conformations (lower entropy); on release, the drive back to maximum entropy restores the original shape.",
        }
      ],
      answer: "d",
      why: "**Entropy elasticity**: rubber resists deformation because stretching reduces the number of possible chain conformations; the restoring force is $\\propto T$ (unlike metals, where bond stretching is enthalpy-dominated).",
      concept: "rubber force ∝ T; metal force ∝ bond strain",
      tags: ["confused"],
    },
    {
      id: "t10-21",
      type: "numerical",
      diff: 4,
      text: "In the Maxwell model the stress decays as $\\sigma(t) = \\sigma_0e^{-t/\\tau}$ with $\\sigma_0 = 5$ MPa and $\\tau = 100$ s. The stress remaining at $t = 100$ s ($e^{-1} \\approx 0.37$) is:",
      options: [
        { label: "a", text: "1.85 MPa" },
        { label: "b", text: "5.0 MPa" },
        { label: "c", text: "3.7 MPa" },
        { label: "d", text: "0.05 MPa" }
      ],
      answer: "a",
      why: "$\\sigma = 5\\,e^{-100/100} = 5\\times0.37 = \\mathbf{1.85}$ MPa — at one relaxation time the stress has fallen to ~37% of its initial value.",
      distractors: {
        c: "3.7 MPa would correspond to 74% — a factor-of-two slip.",
      },
      concept: "$\\sigma(t) = \\sigma_0e^{-t/\\tau}$",
      tags: ["numeric", "formula"],
    },
    {
      id: "t10-22",
      type: "assertreason",
      diff: 3,
      assertion: "Increasing the molecular weight of a thermoplastic generally raises its impact strength and toughness.",
      reason: "Longer chains form more entanglements and tie molecules, which must be broken or pulled out before crack growth can proceed.",
      options: [
        { label: "a", text: "A is false, R is true" },
        { label: "b", text: "Both A and R are true, and R is the correct explanation of A" },
        { label: "c", text: "A is true, R is false" },
        { label: "d", text: "Both A and R are true, but R is NOT the correct explanation of A" }
      ],
      answer: "b",
      why: "**Entanglement density scales with MW**: a growing crack must break or disentangle many load-bearing chains, absorbing far more energy. Toughness therefore rises with MW until the entanglement plateau.",
      concept: "toughness ↑ with MW (entanglement network)",
      tags: ["revision"],
    },
    {
      id: "t10-23",
      type: "concept",
      diff: 3,
      text: "Driving the glass transition with changing frequency in DMA shows that, at higher frequency, the tan-δ peak:",
      options: [
        {
            label: "a",
            text: "stays at exactly the same temperature",
        },
        {
            label: "b",
            text: "moves to absolute zero",
        },
        {
            label: "c",
            text: "moves to higher temperature (the polymer has less time to relax, so a higher temperature is needed)",
        },
        {
            label: "d",
            text: "disappears",
        }
      ],
      answer: "c",
      why: "The glass transition is **frequency-dependent**: at high frequency the segments cannot keep up (short observation time), so Tg shifts **upward** — the same physics as the rate-dependence of DSC Tg.",
      concept: "higher frequency ≡ shorter time ≡ higher apparent Tg",
      tags: ["confused"],
    },
    {
      id: "t10-24",
      type: "numerical",
      diff: 4,
      text: "Permeability P = D × S. If the diffusion coefficient $D = 2\\times10^{-8}$ cm²/s and the solubility coefficient $S = 3\\times10^{-2}$ cm³(STP)/(cm³·atm), then P is:",
      options: [
        { label: "a", text: "$6\\times10^{-12}$" },
        { label: "b", text: "$6\\times10^{-10}$" },
        { label: "c", text: "$1.5\\times10^{-6}$" },
        { label: "d", text: "$6\\times10^{-6}$" }
      ],
      answer: "b",
      why: "$P = (2\\times10^{-8})(3\\times10^{-2}) = 6\\times10^{-10}$ cm³(STP)·cm/(cm²·s·atm). Since $1$ atm $= 76$ cmHg and $1$ Barrer $=10^{-10}$ cm³(STP)·cm/(cm²·s·cmHg), this is approximately $0.079$ Barrer.",
      distractors: {
        c: "$1.5\\times10^{-6}$ divides D by S instead of multiplying.",
      },
      concept: "$P = D\\times S$",
      tags: ["numeric", "formula"],
    },
    {
      id: "t10-25",
      type: "concept",
      diff: 2,
      text: "Why does barrier performance improve as a polymer becomes more crystalline and oriented?",
      options: [
        {
            label: "a",
            text: "Orientation destroys the polymer.",
        },
        {
            label: "b",
            text: "Crystallinity increases free volume.",
        },
        {
            label: "c",
            text: "Crystallites absorb the permeant.",
        },
        {
            label: "d",
            text: "Crystallites and aligned chains are dense, low-mobility regions, so the tortuous path for a diffusing molecule becomes much longer and permeation drops.",
        }
      ],
      answer: "d",
      why: "Diffusion needs **free volume**. Crystallites exclude the permeant and force a **tortuous path**, while orientation tightens the chain packing — hence oriented PET/PP films and HDPE give much better barriers than their amorphous forms.",
      concept: "permeation ∝ free volume; crystallites add tortuosity",
      tags: ["revision"],
    },
    {
      id: "t10-26",
      type: "statement",
      diff: 2,
      text: "Which statement(s) about impact modifiers and toughness is/are correct?",
      statements: [
        { num: 1, text: "Rubber particles toughen a glassy matrix by initiating crazing and shear yielding." },
        { num: 2, text: "Impact strength is measured on notched bars to reveal notch sensitivity." },
        { num: 3, text: "Below Tg, toughness falls sharply for an amorphous polymer." },
        { num: 4, text: "Adding rigid filler always increases impact toughness." },
      ],
      options: [
        { label: "a", text: "1 and 4 only" },
        { label: "b", text: "4 only" },
        { label: "c", text: "1, 2 and 3 only" },
        { label: "d", text: "1, 2, 3 and 4" }
      ],
      answer: "c",
      why: "1–3 correct. Item 4 is false — rigid fillers generally **raise stiffness but reduce** impact toughness (unless coupled/elastomer-coated specially), the classic stiffness–toughness trade-off.",
      distractors: {
        d: "Item 4 ignores the stiffness–toughness trade-off.",
      },
      tags: ["confused"],
    },
    {
      id: "t10-27",
      type: "apply",
      diff: 4,
      text: "A component must survive a 1000-hour static load at 50 °C without exceeding 2% strain. The most relevant test and reasoning are:",
      options: [
        {
            label: "a",
            text: "Impact test — since creep is an impact phenomenon.",
        },
        {
            label: "b",
            text: "Long-term creep (isochronous) testing and/or a TTS master curve, because viscoelastic strain grows with time and temperature and short tests underestimate long-term deformation.",
        },
        {
            label: "c",
            text: "Short-term tensile modulus — because creep is proportional to modulus at all times.",
        },
        {
            label: "d",
            text: "Melt-flow index — it directly predicts creep.",
        }
      ],
      answer: "b",
      why: "Viscoelastic strain **accumulates with time**; a short modulus test cannot capture it. Design therefore uses **long-term creep data** or a **TTS master curve** (validated by the WLF/Arrhenius shift) to extrapolate to 1000 h at 50 °C.",
      concept: "creep design needs time-based data, not instantaneous modulus",
      tags: ["confused"],
    },
    {
      id: "t10-28",
      type: "higher",
      diff: 4,
      text: "A tyre compound is tuned for high hysteretic grip, while a vibration isolator must limit heat build-up. Which measurement most directly quantifies energy dissipated per deformation cycle?",
      options: [
        {
            label: "a",
            text: "The area enclosed by the cyclic stress–strain loop, representing dissipated work per unit volume for each cycle.",
        },
        {
            label: "b",
            text: "The monotonic tensile strength, which is the maximum stress reached before the material fails in a tensile test.",
        },
        {
            label: "c",
            text: "The long-time static compliance, relating creep strain to applied stress after a sustained load rather than cyclic loss.",
        },
        {
            label: "d",
            text: "The storage modulus $E'$, which measures the in-phase elastic component and energy stored during oscillation.",
        }
      ],
      answer: "a",
      why: "The hysteresis-loop area is the work dissipated per unit volume in one loading–unloading cycle. Storage modulus describes the elastic component; tensile strength and static compliance do not directly measure cyclic energy loss.",
      concept: "Hysteresis-loop area measures dissipated energy per cycle.",
      tags: [
        "confused"
      ],
      distractors: {
        d: "Storage modulus describes energy stored elastically, not the loop's dissipated area.",
        b: "Tensile strength is a failure stress, not a measure of cyclic hysteresis.",
        c: "Static compliance describes time-dependent deformation under load, not energy dissipated per cycle.",
      },
    },
    {
      id: "t10-29",
      type: "concept",
      diff: 3,
      text: "A glassy polymer under tensile stress develops a planar region containing microvoids bridged by oriented fibrils. What is this feature?",
      options: [
        { label: "a", text: "A craze" },
        { label: "b", text: "A fully open crack with no material bridging its faces" },
        { label: "c", text: "A crystalline spherulite" },
        { label: "d", text: "A shear band with no volume change" }
      ],
      answer: "a",
      why: "A **craze** is a microvoided, fibril-bridged region that forms roughly perpendicular to tensile stress. It can carry load through the oriented fibrils and may precede crack propagation.",
      distractors: {
        b: "A crack is an open fracture discontinuity; a craze still contains load-bearing fibrils.",
        c: "A spherulite is a crystalline morphology, not a tensile damage zone.",
        d: "Shear yielding is localized plastic flow along maximum-shear planes, not a microvoid/fibril structure."
      },
      concept: "Crazing is not the same as cracking.",
      tags: ["confused"]
    },
    {
      id: "t10-30",
      type: "apply",
      diff: 3,
      text: "A notched amorphous polymer part is tested at a lower temperature and a higher loading rate than before. Which fracture trend is most likely?",
      options: [
        { label: "a", text: "A more brittle response, because segmental rearrangement has less time and mobility and the notch concentrates stress." },
        { label: "b", text: "A more ductile response, because lower temperature always increases chain mobility." },
        { label: "c", text: "No change, because fracture is independent of temperature and loading rate." },
        { label: "d", text: "The notch removes the local stress concentration." }
      ],
      answer: "a",
      why: "Lower temperature and higher strain rate reduce the time available for segmental rearrangement. A notch further concentrates stress, so brittle crack propagation becomes more likely.",
      distractors: {
        b: "Lower temperature generally reduces segmental mobility rather than increasing it.",
        c: "The lecture explicitly identifies temperature, strain rate and notches as factors affecting brittle fracture.",
        d: "A notch is a stress concentrator; it does not remove one."
      },
      concept: "Lower temperature + higher strain rate + notch → brittle-fracture tendency.",
      tags: ["revision"]
    },
    {
      id: "t10-31",
      type: "numerical",
      diff: 4,
      text: "For a cracked polymer specimen, use K = Yσ√(πa). Let Y = 1, applied stress σ = 50 MPa and crack length a = 1.0 mm. If K_IC = 3.0 MPa√m, what is the best conclusion?",
      options: [
        { label: "a", text: "K ≈ 50 MPa√m, so fracture is certain." },
        { label: "b", text: "K ≈ 5.0 MPa√m, so K is above K_IC." },
        { label: "c", text: "K ≈ 2.8 MPa√m, so the applied stress intensity is below K_IC." },
        { label: "d", text: "K = 0 because the crack length is given in millimetres." }
      ],
      answer: "c",
      why: "Convert crack length: a = 0.001 m. Then K = 50√(π × 0.001) = **2.80 MPa√m**. Since 2.80 < 3.0 MPa√m, this simplified criterion predicts that the critical stress intensity has not yet been reached.",
      distractors: {
        a: "This omits the square-root crack-length factor.",
        b: "This does not follow from substituting a = 0.001 m into the stated equation.",
        d: "The crack length must be converted to metres; it is not set to zero."
      },
      concept: "K = Yσ√(πa); fracture criterion K ≥ K_IC.",
      tags: ["numeric", "formula"]
    },
    {
      id: "t10-32",
      type: "apply",
      diff: 2,
      text: "A laboratory must measure the indentation resistance of a soft elastomer and a rigid engineering-plastic specimen. Which pairing is most appropriate from the lecture's hardness methods?",
      options: [
        { label: "a", text: "Rockwell for the soft elastomer only; Shore A for every rigid plastic." },
        { label: "b", text: "Izod for the elastomer; Charpy for the rigid plastic." },
        { label: "c", text: "Shore A for the soft elastomer; Shore D or Rockwell for the rigid plastic." },
        { label: "d", text: "Melt-flow index for both, because MFI is a surface-indentation test." }
      ],
      answer: "c",
      why: "The lesson associates **Shore A** with soft elastomers, **Shore D** with rigid plastics/hard rubbers, and **Rockwell** with rigid engineering plastics.",
      distractors: {
        a: "This reverses the usual Shore A and Shore D applications.",
        b: "Izod and Charpy are impact tests, not indentation-hardness tests.",
        d: "MFI measures melt flow under specified conditions, not surface hardness."
      },
      concept: "Hardness method selection: Shore A / Shore D / Rockwell.",
      tags: ["revision"]
    },
    {
      id: "t10-33",
      type: "compare",
      diff: 3,
      text: "A polymer melt shows lower apparent viscosity when shear rate is increased. A separate sample shows viscosity decreasing with time while held at a constant shear rate. Which interpretation is correct?",
      options: [
        { label: "a", text: "The first is thixotropic; the second is pseudoplastic." },
        { label: "b", text: "Both are necessarily Newtonian." },
        { label: "c", text: "The first is dilatant; the second is rheopectic." },
        { label: "d", text: "The first is pseudoplastic (shear-thinning); the second is thixotropic." }
      ],
      answer: "d",
      why: "Pseudoplasticity is **shear-rate dependent**: viscosity falls as shear rate rises. Thixotropy is **time dependent**: viscosity falls with time at constant shear.",
      distractors: {
        a: "This reverses the shear-rate and time-dependent definitions.",
        b: "A Newtonian fluid has constant viscosity at fixed conditions, not the described changes.",
        c: "Dilatancy and rheopexy describe thickening, not thinning."
      },
      concept: "Pseudoplastic = shear-rate dependence; thixotropic = time dependence.",
      tags: ["confused"]
    },
    {
      id: "t10-34",
      type: "concept",
      diff: 3,
      text: "A concentrated suspension resists flow until a minimum stress is exceeded, then flows. Which rheological model best describes this behaviour?",
      options: [
        { label: "a", text: "Newtonian fluid" },
        { label: "b", text: "Pseudoplastic fluid with no yield stress" },
        { label: "c", text: "Rheopectic fluid" },
        { label: "d", text: "Bingham plastic" }
      ],
      answer: "d",
      why: "A **Bingham plastic** behaves like a rigid body below a yield stress and flows after that threshold is exceeded.",
      distractors: {
        a: "A Newtonian fluid flows at any nonzero shear stress and has constant viscosity at fixed conditions.",
        b: "Shear-thinning describes viscosity falling with shear rate; it does not by itself specify a yield-stress threshold.",
        c: "Rheopexy is time-dependent viscosity increase under constant shear."
      },
      concept: "Bingham plastic: finite yield stress before flow.",
      tags: ["revision"]
    },
    {
      id: "t10-35",
      type: "apply",
      diff: 3,
      text: "An insulating polymer component must withstand a specified electric field without dielectric breakdown. Which property is the direct design criterion?",
      options: [
        { label: "a", text: "Elongation at break" },
        { label: "b", text: "Dielectric strength" },
        { label: "c", text: "Melt-flow index" },
        { label: "d", text: "Limiting oxygen index" }
      ],
      answer: "b",
      why: "The lesson defines **dielectric strength** as the maximum electric field a material can withstand before breakdown. Resistivity and dielectric constant are also electrical properties, but they answer different design questions.",
      distractors: {
        a: "Elongation at break measures tensile deformation before failure.",
        c: "MFI is a melt-processing quality/flow measure.",
        d: "LOI measures the oxygen concentration needed to sustain combustion."
      },
      concept: "Dielectric strength = electric field at breakdown.",
      tags: ["revision"]
    },
    {
      id: "t10-36",
      type: "statement",
      diff: 3,
      text: "Which statements about optical and flammability behaviour of polymers are correct?",
      statements: [
        { num: 1, text: "Amorphous polymers such as PMMA can be optically clear because they lack crystallites that scatter light." },
        { num: 2, text: "Spherulites in semi-crystalline polymers can scatter light and reduce transparency." },
        { num: 3, text: "Birefringence can arise from processing-induced molecular orientation." },
        { num: 4, text: "Limiting oxygen index is the minimum oxygen concentration in an oxygen/nitrogen mixture that sustains combustion." }
      ],
      options: [
        { label: "a", text: "1 and 2 only" },
        { label: "b", text: "1, 2, 3 and 4" },
        { label: "c", text: "1, 2 and 3 only" },
        { label: "d", text: "2, 3 and 4 only" }
      ],
      answer: "b",
      why: "All four statements match the lesson: amorphous polymers can be clear; crystalline spherulites scatter light; orientation can cause birefringence; and **LOI** is the minimum oxygen percentage that sustains combustion.",
      distractors: {
        a: "Statements 3 and 4 are also correct.",
        c: "Statement 4 is also correct and defines LOI.",
        d: "Statement 1 is also correct for suitable amorphous polymers."
      },
      concept: "Optical clarity / scattering / birefringence; LOI definition.",
      tags: ["revision"]
    }
  ],
};

export default T10;
