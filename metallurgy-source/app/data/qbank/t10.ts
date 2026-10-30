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
    { id: "T10.1", title: "Stress–strain behaviour & modulus" },
    { id: "T10.2", title: "Impact, hardness & toughness" },
    { id: "T10.3", title: "Creep, relaxation, hysteresis" },
    { id: "T10.4", title: "Maxwell, Voigt and the Deborah number" },
    { id: "T10.5", title: "TTS, WLF, permeability & solubility parameters" },
  ],
  questions: [
        {
      "id": "t10-01",
      "type": "recall",
      "diff": 1,
      "text": "For a polymer specimen in the initial linear-elastic region, Young's modulus is:",
      "options": [
        {
            "label": "a",
            "text": "The compliance, strain divided by stress, taken in the initial linear region and reported in reciprocal-pressure units."
        },
        {
            "label": "b",
            "text": "The area under the stress–strain curve up to fracture, representing energy absorbed per unit volume."
        },
        {
            "label": "c",
            "text": "The slope of the initial linear-elastic stress–strain curve, given by stress change divided by strain change."
        },
        {
            "label": "d",
            "text": "Engineering stress, force divided by original cross-sectional area, with no division by the measured strain."
        }
      ],
      "answer": "c",
      "why": "Young's modulus is the initial elastic slope of stress against strain. Compliance is its reciprocal; engineering stress is not a modulus; the area under the curve measures energy absorption per unit volume.",
      "distractors": {
        "a": "This is compliance, the reciprocal of Young's modulus.",
        "d": "This is engineering stress, not stress divided by strain.",
        "b": "This is the energy absorbed to fracture per unit volume (toughness), not the elastic slope."
      },
      "tags": [
        "revision"
      ]
    },
    {
      id: "t10-02",
      type: "numerical",
      diff: 2,
      text: "A specimen of cross-section 20 mm² carries a tensile force of 600 N and extends 0.5% of its original length. Its Young's modulus is:",
      options: [
        { label: "a", text: "1.2 GPa" },
        { label: "b", text: "30 GPa" },
        { label: "c", text: "12 GPa" },
        { label: "d", text: "6 GPa" }
      ],
      answer: "d",
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
        { label: "a", text: "80%" },
        { label: "b", text: "400%" },
        { label: "c", text: "500%" },
        { label: "d", text: "200%" }
      ],
      answer: "b",
      why: "$\\varepsilon_b = \\dfrac{L_b - L_0}{L_0}\\times100 = \\dfrac{250-50}{50}\\times100 = \\mathbf{400\\%}$.",
      distractors: {
        c: "500% would be the ratio $L_b/L_0$, i.e. forgetting to subtract $L_0$.",
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
        { label: "a", text: "A is brittle and breaks at small strain; B yields and deforms ductilely; C shows large, reversible elastomeric extension." },
        { label: "b", text: "A is a rubbery elastomer with large reversible strain; B is also elastomeric, and C fractures with little extension." },
        { label: "c", text: "A is a ductile thermoplastic with necking; B extends elastically like rubber; C snaps with the low strain of a brittle glass." },
        { label: "d", text: "A yields and draws plastically; B is a brittle glass with almost no elongation; C stretches reversibly like a rubber." }
      ],
      answer: "a",
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
        { label: "a", text: "Thermal softening above Tm melts the sample uniformly before chains begin to align in the draw direction." },
        { label: "b", text: "Chemical cross-linking under tensile stress locks chains into a network, reducing strain while preserving thermoplastic flow." },
        { label: "c", text: "The polymer melts and recrystallizes under zero stress, producing a sample with no molecular orientation." },
        { label: "d", text: "A neck forms and propagates as chains slide and align along the draw direction, strengthening the oriented material." }
      ],
      answer: "d",
      why: "Beyond yield, a **neck** forms and extends: chains become **oriented** along the stress axis, stiffening and strengthening the drawn region. The same mechanism produces strong fibres and biaxially oriented films.",
      concept: "drawing = orientation-induced strengthening",
      tags: ["revision"],
    },
        {
      "id": "t10-06",
      "type": "recall",
      "diff": 1,
      "text": "Which test is designed to compare the impact energy absorbed by notched polymer specimens under a pendulum strike?",
      "options": [
        {
            "label": "a",
            "text": "A fracture-toughness test, using a pre-cracked specimen to determine a critical stress-intensity factor."
        },
        {
            "label": "b",
            "text": "A flexural test, using the maximum bending stress measured during a three-point loading cycle."
        },
        {
            "label": "c",
            "text": "Use a notched Izod or Charpy pendulum to measure impact energy absorbed during fracture."
        },
        {
            "label": "d",
            "text": "A tensile test, using the area under the engineering stress–strain curve from a slow uniaxial pull."
        }
      ],
      "answer": "c",
      "why": "Izod and Charpy pendulum tests measure impact energy absorbed by breaking a notched specimen. Tensile and flexural tests use different loading modes; fracture-toughness tests measure a different fracture parameter under specified conditions.",
      "distractors": {
        "d": "The area under a tensile stress–strain curve is work per unit volume, but it is not the notched pendulum impact result.",
        "b": "Flexural testing applies bending and reports a flexural response rather than pendulum impact energy.",
        "a": "Fracture toughness uses a crack geometry and fracture-mechanics criterion, not the simple pendulum energy measure."
      },
      "tags": [
        "revision"
      ]
    },
    {
      id: "t10-07",
      type: "concept",
      diff: 3,
      text: "Why does impact strength usually fall as test temperature decreases?",
      options: [
        { label: "a", text: "Crystallinity always rises on cooling, making every polymer brittle regardless of its glass-transition temperature." },
        { label: "b", text: "The notch becomes sharper on cooling, concentrating stress and causing fracture at a lower energy input." },
        { label: "c", text: "Below Tg, low segmental mobility suppresses crazing and shear yielding, so the polymer dissipates less impact energy." },
        { label: "d", text: "Impact energy is temperature-independent because cracks propagate only through covalent bond rupture." }
      ],
      answer: "c",
      why: "Toughness depends on **dissipative mechanisms needing chain mobility**. Cooling toward and below Tg freezes that mobility → brittle behaviour and low impact energy (the classic ductile–brittle transition).",
      concept: "impact toughness ∝ available chain mobility",
      tags: ["revision"],
    },
    {
      id: "t10-08",
      type: "concept",
      diff: 2,
      text: "Creep is:",
      options: [
        { label: "a", text: "Elastic recovery: the reversible strain that disappears promptly when the applied load is removed from a specimen." },
        { label: "b", text: "Creep: the time-dependent increase in strain while a constant stress or load is maintained on the specimen." },
        { label: "c", text: "Hysteresis loss: the energy dissipated per cycle, represented by the area enclosed by loading and unloading curves." },
        { label: "d", text: "Stress relaxation: the gradual decrease in stress while a specimen is held at a fixed strain over time." }
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
        { label: "a", text: "Creep holds strain fixed while stress decays; stress relaxation holds stress fixed while strain grows with time." },
        { label: "b", text: "Both tests hold stress fixed, but creep measures stress loss while relaxation measures accumulated strain under that load." },
        { label: "c", text: "Creep holds stress fixed and tracks increasing strain; stress relaxation holds strain fixed and tracks decreasing stress." },
        { label: "d", text: "Both tests hold strain fixed, but creep measures the growing strain and relaxation measures only the initial modulus." }
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
        { label: "a", text: "Viscoelastic lag creates a loading–unloading loop; the loop area is the energy dissipated as heat per cycle." },
        { label: "b", text: "Cyclic stress melts the specimen during every cycle, and latent heat creates the enclosed area in the curve." },
        { label: "c", text: "The cycle creates energy as chains stretch, so the energy returned during unloading exceeds the work supplied on loading." },
        { label: "d", text: "The sample recovers exactly along the loading path, so both curves coincide and no energy is lost per cycle." }
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
        { label: "a", text: "1-iii, 2-iv, 3-i, 4-ii" },
        { label: "b", text: "1-ii, 2-i, 3-iv, 4-iii" },
        { label: "c", text: "1-i, 2-ii, 3-iv, 4-iii" },
        { label: "d", text: "1-i, 2-ii, 3-iii, 4-iv" }
      ],
      answer: "d",
      why: "**Maxwell** (series) relaxes stress; **Voigt** (parallel) shows delayed creep; **Burgers** (four elements) predicts both with irreversible flow; ideal spring/dashpot are the elastic/viscous extremes.",
      tags: ["revision"],
    },
    {
      id: "t10-12",
      type: "numerical",
      diff: 3,
      text: "A Maxwell element has spring modulus $E = 1.0\\times10^{6}$ Pa and dashpot viscosity $\\eta = 1.0\\times10^{9}$ Pa·s. Its relaxation time $\\tau$ is:",
      options: [
        { label: "a", text: "$10^{15}$ s" },
        { label: "b", text: "0.001 s" },
        { label: "c", text: "1 s" },
        { label: "d", text: "1,000 s" }
      ],
      answer: "d",
      why: "$\\tau = \\eta/E = 10^{9}/10^{6} = \\mathbf{1000}$ s. Physically, the sample relaxes a large fraction of its stress in about $\\tau$.",
      distractors: {
        b: "0.001 s is $E/\\eta$, the reciprocal.",
        a: "$10^{15}$ multiplies rather than divides.",
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
        { label: "a", text: "Strain rises toward σ/E as ε(t) = (σ/E)(1 − e^(−t/τ)), with the retardation time τ = η/E." },
        { label: "b", text: "Strain stays zero because a dashpot in parallel prevents the spring from extending under sustained stress." },
        { label: "c", text: "Strain jumps instantly to σ/E and stays constant because the spring carries the full load at once." },
        { label: "d", text: "Strain decays exponentially to zero under constant stress, as it would for a Maxwell element in stress relaxation." }
      ],
      answer: "a",
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
        { label: "a", text: "It equals the glass-transition temperature expressed as a dimensionless ratio of two relaxation properties." },
        { label: "b", text: "It directly measures crystallinity, so larger values always mean a more crystalline polymer structure." },
        { label: "c", text: "It is a fixed material constant that stays the same regardless of the test duration or measurement conditions." },
        { label: "d", text: "It compares relaxation time with observation time: De ≫ 1 looks glassy, De ≈ 1 viscoelastic, and De ≪ 1 relaxed/flowing." }
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
        { label: "a", text: "Time–temperature superposition applies only to metals because polymers have no activated molecular relaxation." },
        { label: "b", text: "Higher temperature speeds molecular relaxation, making short-time hot data equivalent to longer-time cool data." },
        { label: "c", text: "Temperature does not change molecular motion in polymers, so a test at one temperature predicts all others directly." },
        { label: "d", text: "All polymers have nearly identical Tg values, so the same master curve applies without horizontal shifting." }
      ],
      answer: "b",
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
        { label: "a", text: "2 and 4 only" },
        { label: "b", text: "1, 2 and 3 only" },
        { label: "c", text: "4 only" },
        { label: "d", text: "1, 2, 3 and 4" }
      ],
      answer: "b",
      why: "1–3 define viscoelasticity. Item 4 is false — at low temperature polymers are **glassy solids** (high modulus, brittle), not liquids; they are viscous near/above Tg.",
      distractors: {
        d: "Item 4 inverts the low-temperature state — the glassy-rubbery-viscous sequence is exactly reversed.",
      },
      tags: ["confused"],
    },
    {
      id: "t10-17",
      type: "graph",
      diff: 3,
      text: "A plot of tensile creep strain vs time is drawn at three temperatures: 20 °C (flat after a short rise), 60 °C (slow continuing rise), 90 °C (strain still rising steeply). The most defensible reading is:",
      options: [
        { label: "a", text: "The polymer's Tm is around 20 °C, so the flat response at that temperature is a melting plateau." },
        { label: "b", text: "The specimen is metallic; polymer viscoelasticity cannot produce a continuing increase in strain under load." },
        { label: "c", text: "The rising strain suggests approaching Tg: little creep at 20 °C, but much greater mobility and creep at 90 °C." },
        { label: "d", text: "Temperature has no effect on creep, so all three curves should have the same slope after the initial rise." }
      ],
      answer: "c",
      why: "Increasing creep rate with temperature is the **signature of approaching/above Tg**: below Tg segments are frozen (little creep); above, they rearrange and the material creeps. These curves are the basis of the deformation-mechanism map for viscoelastic polymers.",
      concept: "creep ∝ chain mobility (temperature)",
      tags: ["confused"],
    },
    {
      id: "t10-18",
      type: "recall",
      diff: 1,
      text: "The solubility parameter δ is used to:",
      options: [
        { label: "a", text: "Compare cohesive-energy-density parameters: closer δ values usually suggest better solubility or blend compatibility." },
        { label: "b", text: "Use molecular weight and heat of fusion to estimate melting point, independent of polymer–solvent interactions." },
        { label: "c", text: "Use repeat-unit volume and mass to estimate density and infer packing, rather than solvent compatibility." },
        { label: "d", text: "Use chain length alone to determine solubility, because δ is a direct measure of molecular weight." }
      ],
      answer: "a",
      why: "**δ = (cohesive energy density)^½**. 'Like dissolves like': the closer the δ values, the better the solubility/compatibility — the fastest rule of thumb in polymer formulation.",
      concept: "$\\delta = (\\Delta E_{vap}/V)^{1/2}$",
      tags: ["revision"],
    },
    {
      id: "t10-19",
      type: "apply",
      diff: 3,
      text: "A polyolefin (δ ≈ 16 (J/cm³)^½) seal must be printed with solvent-based ink. Which solvent family is most compatible?",
      options: [
        { label: "a", text: "Hexane or heptane (δ ≈ 15–16), close to the polyolefin's solubility parameter and non-polar character." },
        { label: "b", text: "Formamide (δ ≈ 39), far more polar than the polyolefin and a poor match for its surface." },
        { label: "c", text: "Ethanol (δ ≈ 26), appreciably more polar than the polyolefin and a weaker solvent match." },
        { label: "d", text: "Water (δ ≈ 48), whose strong hydrogen bonding is incompatible with the non-polar polyolefin surface." }
      ],
      answer: "a",
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
        { label: "a", text: "Rubber elasticity resembles metal elasticity: dislocations move back after unloading, independent of chain entropy." },
        { label: "b", text: "The restoring force comes mainly from bond enthalpy, with chains returning to the shape of minimum bond length." },
        { label: "c", text: "Stretching restricts chain conformations and lowers entropy; recoil is favoured as chains return toward a coil state." },
        { label: "d", text: "Large changes in covalent bond lengths supply nearly all the strain, while conformational entropy stays constant." }
      ],
      answer: "c",
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
        { label: "a", text: "3.7 MPa" },
        { label: "b", text: "5.0 MPa" },
        { label: "c", text: "0.05 MPa" },
        { label: "d", text: "1.85 MPa" }
      ],
      answer: "d",
      why: "$\\sigma = 5\\,e^{-100/100} = 5\\times0.37 = \\mathbf{1.85}$ MPa — at one relaxation time the stress has fallen to ~37% of its initial value.",
      distractors: {
        a: "3.7 MPa would correspond to 74% — a factor-of-two slip.",
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
        { label: "a", text: "Both A and R are true, but R is NOT the correct explanation of A" },
        { label: "b", text: "A is false, R is true" },
        { label: "c", text: "A is true, R is false" },
        { label: "d", text: "Both A and R are true, and R is the correct explanation of A" }
      ],
      answer: "d",
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
        { label: "a", text: "The peak disappears because segmental motion stops completely before the sample reaches its glass transition." },
        { label: "b", text: "The peak moves toward absolute zero because faster loading lowers the amount of energy stored in the polymer." },
        { label: "c", text: "At higher frequency, segments have less time to relax, so the tan-δ peak shifts to a higher temperature." },
        { label: "d", text: "Peak temperature stays fixed because Tg is a thermodynamic transition independent of test time and frequency." }
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
        { label: "a", text: "$6\\times10^{-6}$" },
        { label: "b", text: "$6\\times10^{-10}$" },
        { label: "c", text: "$1.5\\times10^{-6}$" },
        { label: "d", text: "$6\\times10^{-12}$" }
      ],
      answer: "b",
      why: "$P = (2\\times10^{-8})(3\\times10^{-2}) = 6\\times10^{-10}$ cm³(STP)·cm/(cm²·s·atm) $\\approx$ 0.6 Barrer.",
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
        { label: "a", text: "Crystalline domains absorb the permeant into their ordered lattices, trapping molecules before they cross the film." },
        { label: "b", text: "Crystals and aligned chains are dense, low-mobility regions that lengthen diffusion paths and reduce permeation." },
        { label: "c", text: "Crystallinity increases interchain spacing, giving diffusing molecules more vacant sites to move through the polymer." },
        { label: "d", text: "Chain orientation increases free volume and opens straight channels, so penetrants move through the film more easily." }
      ],
      answer: "b",
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
        { label: "a", text: "1, 2 and 3 only" },
        { label: "b", text: "1, 2, 3 and 4" },
        { label: "c", text: "4 only" },
        { label: "d", text: "1 and 4 only" }
      ],
      answer: "a",
      why: "1–3 correct. Item 4 is false — rigid fillers generally **raise stiffness but reduce** impact toughness (unless coupled/elastomer-coated specially), the classic stiffness–toughness trade-off.",
      distractors: {
        b: "Item 4 ignores the stiffness–toughness trade-off.",
      },
      tags: ["confused"],
    },
    {
      id: "t10-27",
      type: "apply",
      diff: 4,
      text: "A component must survive a 1000-hour static load at 50 °C without exceeding 2% strain. The most relevant test and reasoning are:",
      options: [
        { label: "a", text: "Use short-term tensile modulus alone, since the initial elastic strain fixes the total strain at every later time." },
        { label: "b", text: "Use long-term creep data or a validated time–temperature-superposition master curve to estimate strain at 1000 h." },
        { label: "c", text: "Use melt-flow index alone, since a short high-temperature flow test directly predicts 1000-hour strain at 50 °C." },
        { label: "d", text: "Use impact energy, because a single rapid fracture test reproduces the same time-dependent deformation as a static load." }
      ],
      answer: "b",
      why: "Viscoelastic strain **accumulates with time**; a short modulus test cannot capture it. Design therefore uses **long-term creep data** or a **TTS master curve** (validated by the WLF/Arrhenius shift) to extrapolate to 1000 h at 50 °C.",
      concept: "creep design needs time-based data, not instantaneous modulus",
      tags: ["confused"],
    },
        {
      "id": "t10-28",
      "type": "higher",
      "diff": 4,
      "text": "A tyre compound is tuned for high hysteretic grip, while a vibration isolator must limit heat build-up. Which measurement most directly quantifies energy dissipated per deformation cycle?",
      "options": [
        {
            "label": "a",
            "text": "The area enclosed by the cyclic stress–strain loop, representing dissipated work per unit volume for each cycle."
        },
        {
            "label": "b",
            "text": "The storage modulus $E'$, which measures the in-phase elastic component and energy stored during oscillation."
        },
        {
            "label": "c",
            "text": "The long-time static compliance, relating creep strain to applied stress after a sustained load rather than cyclic loss."
        },
        {
            "label": "d",
            "text": "The monotonic tensile strength, which is the maximum stress reached before the material fails in a tensile test."
        }
      ],
      "answer": "a",
      "why": "The hysteresis-loop area is the work dissipated per unit volume in one loading–unloading cycle. Storage modulus describes the elastic component; tensile strength and static compliance do not directly measure cyclic energy loss.",
      "distractors": {
        "b": "Storage modulus describes energy stored elastically, not the loop's dissipated area.",
        "d": "Tensile strength is a failure stress, not a measure of cyclic hysteresis.",
        "c": "Static compliance describes time-dependent deformation under load, not energy dissipated per cycle."
      },
      "concept": "Hysteresis-loop area measures dissipated energy per cycle.",
      "tags": [
        "confused"
      ]
    },
  ],
};

export default T10;
