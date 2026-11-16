import type { TopicSource } from "../../mt203/types";

/**
 * MT203 — Topic 10: Mechanical & Viscoelastic Properties
 * Source: Module 3 §1, §4 + Module 2 §5. 45 questions.
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
        ["3", "Burgers (4 elements)", "", "(iii) creep with instantaneous elasticity, retarded elasticity and permanent viscous flow"],
        ["4", "Ideal spring / dashpot", "", "(iv) purely elastic / purely viscous limits"],
      ],
      options: [
        { label: "a", text: "1-i, 2-ii, 3-iii, 4-iv" },
        { label: "b", text: "1-ii, 2-i, 3-iv, 4-iii" },
        { label: "c", text: "1-iii, 2-iv, 3-i, 4-ii" },
        { label: "d", text: "1-i, 2-ii, 3-iv, 4-iii" }
      ],
      answer: "a",
      why: "**Maxwell** (series) predicts stress relaxation and creep with instantaneous elastic strain plus viscous flow; **Voigt/Kelvin** (parallel) predicts retarded elastic creep with no instantaneous strain; **Burgers** combines Maxwell and Kelvin elements to represent instantaneous elasticity, delayed elasticity and long-term viscous flow in creep. The ideal spring and dashpot are the purely elastic and purely viscous limits.",
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
      why: "The Deborah number compares the material relaxation time with the observation time. If $De\\gg1$, the material cannot relax appreciably during the experiment and appears solid-like; if $De\\ll1$, it relaxes within the observation time and appears more fluid-like. Whether that relaxed response is rubbery or terminally viscous depends on the material's relaxation spectrum and temperature.",
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
      why: "Time–temperature superposition uses the fact that increasing temperature generally accelerates molecular relaxation. For many amorphous polymers, the WLF relation is useful near and above Tg, while Arrhenius-type shifts are often used sufficiently below Tg or for secondary processes. The appropriate relation and reference temperature must be validated for the material and temperature range before extrapolating long-term behaviour.",
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
      text: "Using only the Hildebrand solubility-parameter match as a first screening criterion, which solvent family is most compatible with a polyolefin surface (δ ≈ 16 (J/cm³)^½)?",
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
      why: "The non-polar aliphatic hydrocarbon has a Hildebrand parameter closest to the stated polyolefin value, so it is the best match under this simplified screening criterion. This does not prove that the solvent will dissolve the solid polymer or provide a durable ink bond under ordinary printing conditions. Polyolefin surfaces are often corona- or flame-treated to improve ink adhesion.",
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
      why: "Increasing molecular weight generally increases entanglement density and the number of load-bearing chain connections, which can improve impact strength and resistance to crack growth until an entanglement-related plateau is approached. The trend is not universal across all grades: crystallinity, phase morphology, defects, temperature and loading rate also influence toughness.",
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
    },
    {
      "id": "t10-37",
      "type": "match",
      "diff": 2,
      "text": "Match each mechanical-property group with the measurement description given in the lecture.",
      "tableRows": [
        [
          "1",
          "Short-term",
          "",
          "(i) time-dependent deformation or stress decay"
        ],
        [
          "2",
          "Long-term",
          "",
          "(ii) constant-rate stress or strain tests"
        ],
        [
          "3",
          "Surface",
          "",
          "(iii) surface-related mechanical behaviour"
        ]
      ],
      "options": [
        {
          "label": "a",
          "text": "1–iii, 2–ii, 3–i"
        },
        {
          "label": "b",
          "text": "1–i, 2–iii, 3–ii"
        },
        {
          "label": "c",
          "text": "1–ii, 2–i, 3–iii"
        },
        {
          "label": "d",
          "text": "1–i, 2–ii, 3–iii"
        }
      ],
      "answer": "c",
      "why": "The slide classifies plastics mechanical properties as short-term, long-term and surface properties. Short-term properties are measured at a constant rate of stress or strain in modes such as tension, compression, flexure and shear. Long-term properties measure deformation or stress decay with time, including creep and stress relaxation.",
      "distractors": {
        "a": "This assigns the surface category to short-term and reverses the time-dependent and constant-rate groups.",
        "b": "This assigns time-dependent behaviour to short-term and the surface category to long-term.",
        "d": "This assigns time-dependent measurements to short-term and constant-rate tests to long-term."
      },
      "concept": "Short-term, long-term and surface mechanical-property classification",
      "tags": [
        "reviewed",
        "revision"
      ],
      "qsLevel": 2,
      "sub": "T10.1",
      "misconceptions": {
        "a": {
          "tag": "misclassified-surface-properties",
          "kind": "conceptual"
        },
        "b": {
          "tag": "misassigned-property-measurement-groups",
          "kind": "conceptual"
        },
        "d": {
          "tag": "swapped-short-and-long-term-properties",
          "kind": "conceptual"
        }
      },
      "qsScore": 93
    },
    {
      "id": "t10-38",
      "type": "match",
      "diff": 2,
      "text": "Match each tensile-test term with the definition printed in the lecture.",
      "tableRows": [
        [
          "1",
          "Gauge length",
          "",
          "(i) original distance between the two marks on the test piece"
        ],
        [
          "2",
          "Yield point",
          "",
          "(ii) first point where strain increases without an increase in stress"
        ],
        [
          "3",
          "Proportional limit",
          "",
          "(iii) greatest stress sustained without deviation from stress–strain proportionality"
        ],
        [
          "4",
          "Secant modulus",
          "",
          "(iv) total stress divided by corresponding strain at a selected point"
        ]
      ],
      "options": [
        {
          "label": "a",
          "text": "1–i, 2–ii, 3–iii, 4–iv"
        },
        {
          "label": "b",
          "text": "1–ii, 2–i, 3–iv, 4–iii"
        },
        {
          "label": "c",
          "text": "1–iii, 2–iv, 3–i, 4–ii"
        },
        {
          "label": "d",
          "text": "1–iv, 2–iii, 3–ii, 4–i"
        }
      ],
      "answer": "a",
      "why": "Gauge length is the original marked length over which elongation is measured. The slide defines yield point as the first point where strain increases without an increase in stress, proportional limit as the greatest stress retaining proportionality, and secant modulus as stress divided by corresponding strain at a selected point.",
      "distractors": {
        "b": "This assigns the gauge-length definition to yield point and exchanges the proportional-limit and secant-modulus definitions.",
        "c": "This assigns the proportional-limit definition to gauge length and misplaces the other three terms.",
        "d": "This reverses the source definitions for gauge length, yield point and secant modulus."
      },
      "concept": "Lecture definitions of gauge length, yield point, proportional limit and secant modulus",
      "tags": [
        "reviewed",
        "revision"
      ],
      "qsLevel": 2,
      "sub": "T10.1",
      "misconceptions": {
        "b": {
          "tag": "swapped-gauge-and-yield-definitions",
          "kind": "conceptual"
        },
        "c": {
          "tag": "confused-stress-limit-with-measurement-length",
          "kind": "conceptual"
        },
        "d": {
          "tag": "reversed-tensile-terminology",
          "kind": "conceptual"
        }
      },
      "qsScore": 92
    },
    {
      "id": "t10-39",
      "type": "sequence",
      "diff": 3,
      "text": "Which ordered description matches the A–F molecular deformation stages in the lecture's tensile stress–strain curve?",
      "options": [
        {
          "label": "a",
          "text": "A–B: chain slippage; A–C: fracture; C–D: instantaneous recovery; D–E: elastic bending; E–F: cross-link formation."
        },
        {
          "label": "b",
          "text": "A–B: necking; A–C: viscous flow; C–D: bond rupture; D–E: proportional elasticity; E–F: immediate recovery."
        },
        {
          "label": "c",
          "text": "A–B: molecular orientation; A–C: yielding; C–D: fracture; D–E: bond bending; E–F: elastic recovery."
        },
        {
          "label": "d",
          "text": "A–B: bond bending and stretching; A–C: recoverable elastic response to the proportionality limit; C–D: straightening without slippage; D–E: deformation without increased stress; E–F: slippage/orientation and failure."
        }
      ],
      "answer": "d",
      "why": "The source describes A–B as near-instantaneous bond bending and stretching, A–C as the recoverable elastic region up to the proportionality limit, C–D as molecular straightening without slippage, D–E as deformation without increased stress, and E–F as slippage and orientation followed by failure at F.",
      "distractors": {
        "a": "This places molecular slippage at the start and fracture before the proportionality limit, reversing the source sequence.",
        "b": "This moves necking and viscous flow into early regions and assigns immediate recovery to the final stage.",
        "c": "This places orientation before the elastic and straightening regions and misassigns fracture to C–D."
      },
      "concept": "A–F tensile deformation sequence from bond response to chain slippage and failure",
      "tags": [
        "reviewed",
        "revision"
      ],
      "qsLevel": 3,
      "sub": "T10.1",
      "misconceptions": {
        "a": {
          "tag": "reversed-early-and-late-deformation-stages",
          "kind": "observation"
        },
        "b": {
          "tag": "misplaced-necking-and-viscous-flow",
          "kind": "observation"
        },
        "c": {
          "tag": "misordered-orientation-and-fracture",
          "kind": "observation"
        }
      },
      "qsScore": 93
    },
    {
      "id": "t10-40",
      "type": "recall",
      "diff": 2,
      "text": "Which combination matches the lecture's tensile-test standard, specimen and testing equipment?",
      "options": [
        {
          "label": "a",
          "text": "ASTM D790; rectangular flexural bar; pendulum impact tester for tensile loading."
        },
        {
          "label": "b",
          "text": "ASTM D256; notched Izod specimen; universal testing machine used only for impact testing."
        },
        {
          "label": "c",
          "text": "ASTM D638; rectangular beam specimen; a three-point loading fixture used for tensile strength."
        },
        {
          "label": "d",
          "text": "ASTM D638 with the listed IS/JIS/ISO/BS standards; a dumb-bell specimen tested on a universal testing machine."
        }
      ],
      "answer": "d",
      "why": "The lecture lists ASTM D638, IS-8453, JIS-7113, ISO-1184 and BS-2782 for tensile properties. It shows a dumb-bell-shaped specimen and a universal testing machine for tension or compression testing.",
      "distractors": {
        "a": "ASTM D790 and a rectangular bar belong to the flexural-property section rather than the tensile test.",
        "b": "ASTM D256 and a notched specimen are listed for pendulum impact testing, not tensile testing.",
        "c": "The lecture shows a dumb-bell specimen and does not describe tensile testing with a three-point flexural fixture."
      },
      "concept": "Tensile-test standards, dumb-bell specimen and universal testing machine",
      "tags": [
        "reviewed",
        "revision"
      ],
      "qsLevel": 2,
      "sub": "T10.1",
      "misconceptions": {
        "a": {
          "tag": "confused-with-flexural-testing",
          "kind": "conceptual"
        },
        "b": {
          "tag": "confused-with-impact-testing",
          "kind": "conceptual"
        },
        "c": {
          "tag": "confused-with-flexural-fixture",
          "kind": "conceptual"
        }
      },
      "qsScore": 94
    },
    {
      "id": "t10-41",
      "type": "graph",
      "diff": 3,
      "text": "For the PMMA stress–strain plot in the lecture, what is the stated effect of decreasing temperature and increasing strain rate?",
      "options": [
        {
          "label": "a",
          "text": "Decreasing temperature lowers modulus and tensile strength while increasing elongation; faster loading reverses those changes."
        },
        {
          "label": "b",
          "text": "Decreasing temperature raises modulus and tensile strength while lowering percentage elongation; increasing strain rate has the same stated effects."
        },
        {
          "label": "c",
          "text": "Decreasing temperature raises elongation while lowering tensile strength; increasing strain rate produces a softer response."
        },
        {
          "label": "d",
          "text": "Decreasing temperature changes modulus but leaves tensile strength and elongation unchanged; strain rate affects only failure time."
        }
      ],
      "answer": "b",
      "why": "The p.137 slide states that decreasing temperature increases modulus and tensile strength and decreases percentage elongation. It states that increasing strain rate produces the same effects as decreasing temperature for the plotted thermoplastic response.",
      "distractors": {
        "a": "This reverses the three directions stated beside the lecture's temperature-dependent PMMA plot.",
        "c": "The source states that decreasing temperature lowers elongation and raises tensile strength, not the reverse.",
        "d": "The slide lists changes in all three plotted properties rather than modulus alone."
      },
      "concept": "Temperature and strain-rate effects on thermoplastic tensile response",
      "tags": [
        "reviewed",
        "revision"
      ],
      "qsLevel": 3,
      "sub": "T10.1",
      "misconceptions": {
        "a": {
          "tag": "reversed-temperature-property-trends",
          "kind": "observation"
        },
        "c": {
          "tag": "reversed-strength-and-elongation-trends",
          "kind": "observation"
        },
        "d": {
          "tag": "missed-multiple-property-effects",
          "kind": "observation"
        }
      },
      "qsScore": 94
    },
    {
      "id": "t10-42",
      "type": "match",
      "diff": 2,
      "text": "Match the flexural test arrangement with the loading description in the lecture.",
      "tableRows": [
        [
          "1",
          "Three-point loading",
          "",
          "(i) one central load on a simply supported beam"
        ],
        [
          "2",
          "Four-point loading",
          "",
          "(ii) two equal loads spaced from adjacent supports"
        ],
        [
          "3",
          "Test specimen",
          "",
          "(iii) rectangular bar cut from sheet, plate or moulded shape"
        ],
        [
          "4",
          "General scope",
          "",
          "(iv) rigid and semi-rigid materials; flexible materials when they break or fail in the outer fibre"
        ]
      ],
      "options": [
        {
          "label": "a",
          "text": "1–i, 2–ii, 3–iii, 4–iv"
        },
        {
          "label": "b",
          "text": "1–ii, 2–i, 3–iv, 4–iii"
        },
        {
          "label": "c",
          "text": "1–i, 2–iii, 3–ii, 4–iv"
        },
        {
          "label": "d",
          "text": "1–iii, 2–ii, 3–i, 4–iv"
        }
      ],
      "answer": "a",
      "why": "The lecture describes three-point loading as a central load on a simply supported beam and four-point loading as two equal loads spaced from adjacent supports. It uses rectangular bars and states that the methods generally apply to rigid and semi-rigid materials; flexible materials are assessable when they break or fail in the outer fibre. Listed standards include ASTM D790, JIS-7203-1982 and BS-2782.",
      "distractors": {
        "b": "This exchanges the central and two-load arrangements and misassigns specimen form and material scope.",
        "c": "This assigns the rectangular specimen description to four-point loading and swaps the two loading methods.",
        "d": "This assigns the specimen form to three-point loading and places the central-load description under the specimen row."
      },
      "concept": "Flexural loading methods, specimen form, scope and listed test standards",
      "tags": [
        "reviewed",
        "revision"
      ],
      "qsLevel": 2,
      "sub": "T10.2",
      "misconceptions": {
        "b": {
          "tag": "swapped-three-and-four-point-tests",
          "kind": "conceptual"
        },
        "c": {
          "tag": "misassigned-flexural-specimen",
          "kind": "conceptual"
        },
        "d": {
          "tag": "confused-loading-method-with-specimen",
          "kind": "conceptual"
        }
      },
      "qsScore": 93
    },
    {
      "id": "t10-43",
      "type": "match",
      "diff": 2,
      "text": "Match each pendulum impact method with the specimen position and reporting detail stated in the lecture.",
      "tableRows": [
        [
          "1",
          "Izod",
          "",
          "(i) specimen clamped with notch facing the striker; energy read directly from the scale in in-lb or ft-lb"
        ],
        [
          "2",
          "Charpy",
          "",
          "(ii) specimen horizontal and supported at both ends; complete breaks accepted; result per thickness in ft-lb/in"
        ]
      ],
      "options": [
        {
          "label": "a",
          "text": "1–ii, 2–i"
        },
        {
          "label": "b",
          "text": "1–i, 2–ii"
        },
        {
          "label": "c",
          "text": "1–i, 2–i"
        },
        {
          "label": "d",
          "text": "1–ii, 2–ii"
        }
      ],
      "answer": "b",
      "why": "For Izod, the specimen is clamped with its notched end facing the striking edge, and the impact value is read directly from the scale in in-lb or ft-lb. For Charpy, the specimen is mounted horizontally and supported at both ends; only complete breaks are accepted, and the result is reported per specimen thickness in ft-lb/in. of notch for notched specimens and ft-lb/in. for unnotched specimens.",
      "distractors": {
        "a": "This exchanges the Izod clamping arrangement and the horizontal Charpy support arrangement.",
        "c": "This assigns the same orientation to both tests and omits the Charpy support condition.",
        "d": "This reverses both specimen arrangements described in the source for the two pendulum impact methods."
      },
      "concept": "Izod and Charpy specimen orientation, support and result reporting",
      "tags": [
        "reviewed",
        "revision"
      ],
      "qsLevel": 2,
      "sub": "T10.2",
      "misconceptions": {
        "a": {
          "tag": "swapped-izod-charpy-setups",
          "kind": "conceptual"
        },
        "c": {
          "tag": "missed-distinct-specimen-position",
          "kind": "conceptual"
        },
        "d": {
          "tag": "reversed-impact-test-fixtures",
          "kind": "conceptual"
        }
      },
      "qsScore": 93
    },
    {
      "id": "t10-44",
      "type": "match",
      "diff": 2,
      "text": "Match each stress-related term with the definition given on the lecture slide.",
      "tableRows": [
        [
          "1",
          "Stress-optical sensitivity",
          "",
          "(i) magnification of applied stress near a notch, crack, void or inclusion"
        ],
        [
          "2",
          "Stress concentration",
          "",
          "(ii) double refraction of light when a material is under stress"
        ]
      ],
      "options": [
        {
          "label": "a",
          "text": "1–i, 2–ii"
        },
        {
          "label": "b",
          "text": "1–i, 2–i"
        },
        {
          "label": "c",
          "text": "1–ii, 2–ii"
        },
        {
          "label": "d",
          "text": "1–ii, 2–i"
        }
      ],
      "answer": "d",
      "why": "Stress-optical sensitivity is the ability of a material to exhibit double refraction of light when placed under stress. Stress concentration is the magnification of applied stress near a notch, crack, void, inclusion or other stress raiser.",
      "distractors": {
        "a": "This assigns double refraction to stress concentration and notch-related magnification to optical sensitivity.",
        "b": "This gives the double-refraction definition to both terms and does not distinguish stress raisers.",
        "c": "This assigns the same stress-raiser definition to both terms and omits the optical response."
      },
      "concept": "Stress-optical sensitivity versus stress concentration",
      "tags": [
        "reviewed",
        "revision"
      ],
      "qsLevel": 2,
      "sub": "T10.3",
      "misconceptions": {
        "a": {
          "tag": "swapped-optical-and-concentration-definitions",
          "kind": "conceptual"
        },
        "b": {
          "tag": "collapsed-distinct-stress-terms",
          "kind": "conceptual"
        },
        "c": {
          "tag": "confused-light-response-with-stress-raiser",
          "kind": "conceptual"
        }
      },
      "qsScore": 92
    },
    {
      "id": "t10-45",
      "type": "sequence",
      "diff": 2,
      "text": "Which sequence gives the three stages of gas or vapour permeability through a polymer, in the order shown in the lecture?",
      "options": [
        {
          "label": "a",
          "text": "Diffusion through the polymer → absorption into the polymer → desorption from the far surface."
        },
        {
          "label": "b",
          "text": "Desorption from the polymer surface → absorption into the polymer → diffusion through the polymer."
        },
        {
          "label": "c",
          "text": "Absorption into the polymer → diffusion through the polymer → desorption from the surface and removal."
        },
        {
          "label": "d",
          "text": "Absorption into the polymer → desorption from the surface → diffusion through the polymer."
        }
      ],
      "answer": "c",
      "why": "The lecture lists absorption of the permeating species into the polymer, diffusion through the polymer, and desorption from the surface followed by removal. It identifies solubility and diffusivity, chain packing, side-group complexity, polarity, crystallinity, orientation, fillers, humidity and plasticization as factors.",
      "distractors": {
        "a": "This places diffusion before absorption and therefore reverses the first two stages in the source sequence.",
        "b": "This begins with desorption before the species has entered or crossed the polymer.",
        "d": "This places desorption before diffusion through the polymer, reversing the final two stages."
      },
      "concept": "Absorption, diffusion and desorption stages of polymer permeability",
      "tags": [
        "reviewed",
        "revision"
      ],
      "qsLevel": 2,
      "sub": "T10.8",
      "misconceptions": {
        "a": {
          "tag": "reversed-absorption-and-diffusion",
          "kind": "observation"
        },
        "b": {
          "tag": "desorption-before-permeation",
          "kind": "observation"
        },
        "d": {
          "tag": "reversed-diffusion-and-desorption",
          "kind": "observation"
        }
      },
      "qsScore": 92
    },
  ],
};

export default T10;
