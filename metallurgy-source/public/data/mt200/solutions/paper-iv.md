# Paper IV — Model solutions and marking guidance

Companion to the exam-format Practice Paper IV (100 marks). These are the source-derived model answers and core working. The original marking scheme accepts equivalent correct methods; numerical curve readings are approximate (about ±3%). Deduct 0.5 mark once per question for missing/wrong units. In Section D, a conclusion without supporting numbers earns at most half the marks.

## How to approach the applied problems

1. Convert the physical situation into strain or stress.
2. Read the relevant stress–strain curve at that value and record the reading with units.
3. Compare with yield and fracture landmarks. Yielding may be acceptable for a ductile part; fracture is not.
4. State the conclusion with numbers.

Common conversions:
- Press/shrink fit: strain = diametral mismatch / original diameter.
- Wire bent around a radius: outer-fibre strain = (half thickness) / neutral-axis radius.
- Rolling: engineering reduction = (h₀ − h)/h₀; true strain magnitude = ln(h₀/h).
- Bolt turn: strain = (turns × thread pitch) / grip length.
- Heating: ε = αΔT.
- Pressure: p = ρgh, then account for stress concentration where applicable.

## Section A — Statement evaluation

| Set | Correct option | Key reasoning |
|---|---:|---|
| A1 | 1 | E is bond-controlled and relatively structure-insensitive; yield strength is structure-sensitive; compliance is 1/E in Pa⁻¹. Elastic deformation is bond stretching, not dislocation glide. |
| A2 | 2 | Before necking, σT = σe(1+e) and ln(1+e) < e. After necking engineering stress falls while true stress can rise. The conversion fails after uniform deformation ends. |
| A3 | 1 | Resilience = σy²/(2E); lower E stores more elastic energy at equal yield stress. Strength alone does not guarantee toughness. Energy density has units J/m³ = Pa. |
| A4 | 1 | Platen friction causes barrelling; slender specimens buckle; compression has no tensile-style necking; hoop tension can initiate cracks at the barrel surface. |
| A5 | 2 | Hardness is a test-dependent response, not a fundamental constant. H is roughly proportional to flow stress; rebound hardness reflects energy dissipated plastically. Mohs scale poorly resolves engineering metals. |
| A6 | 1 | Brinell uses curved spherical-cap area, not projected area. Vickers is geometrically similar; Rockwell reads depth (less depth means harder); minor load seats the indenter. |
| A7 | 2 | Cold work raises strength/hardness but barely changes E; grain refinement strengthens; recrystallisation removes cold-work strengthening; solute misfit impedes dislocations. |
| A8 | 1 | BCC steels can show a DBTT; FCC metals generally remain ductile; higher strain rate promotes brittle response. A notch raises, not lowers, triaxiality. |
| A9 | 1 | 1 ksi ≈ 6.895 MPa; 200 kgf/mm² ≈ 1962 MPa; strain rate is s⁻¹; hardness values differ by factor 9.81 between these units. |
| A10 | 1 | Shoulders move failure into gauge length; %EL depends on gauge length; 0.2% offset is parallel to elastic slope; %RA is measured locally and is gauge-length independent. |

## Section B — Matching

- **B1 (quantities and SI units):** fracture toughness → MPa·m¹ᐟ²; modulus of resilience → J/m³; strength coefficient K → MPa; compliance → Pa⁻¹; Charpy impact energy → J.
- **B2 (terms):** malleability → deformation in compression into sheets; ductility → plastic deformation in tension; stiffness → elastic slope; resilience → elastic energy density up to yield; brittleness → fracture with little/no plastic deformation.
- **B3 (hardness tests):** Brinell → 10 mm ball and impression diameter; Vickers → 136° pyramid; Rockwell C → 120° diamond cone with 10 kgf minor/150 kgf major load; Knoop → elongated rhombic diamond; Shore scleroscope → rebound height.
- **B4 (Young's modulus):** aluminium ≈ 70 GPa; steel ≈ 200 GPa; molybdenum ≈ 300 GPa; grey cast iron ≈ 150–170 GPa; rubber ≈ 0.01–0.1 GPa.

Useful units: stress/strength/modulus/hardness are Pa; strain is dimensionless; compliance is Pa⁻¹; toughness/resilience are J/m³; impact energy is J; strain rate is s⁻¹; fracture toughness is MPa·m¹ᐟ²; K in σ=Kεⁿ has units of stress.

## Section C — Empirical relations

### C1. Steel UTS versus Brinell hardness

Convert ksi to MPa (×6.895) and interpolate hardness conversions. The supplied data reduce to:

| Grade | UTS (MPa) | Hardness | BHN | UTS/BHN |
|---:|---:|---|---:|---:|
| 1 | 400 | HRB 68 | 120 | 3.33 |
| 2 | 517 | HRB 80 | 146 | 3.55 |
| 3 | 627 | HRB 90 | 180 | 3.49 |
| 4 | 745 | HRB 97 | 220 | 3.38 |
| 5 | 869 | HRC 25 | 253 | 3.43 |
| 6 | 972 | HRC 30 | 286 | 3.40 |
| 7 | 1227 | HRC 38 | 353 | 3.47 |
| 8 | 1434 | HRC 45 | 421 | 3.41 |

Least-squares fit through origin: k = Σ(BHN·UTS)/Σ(BHN²) ≈ 3.43. Thus UTS (MPa) ≈ 3.4 × BHN (classic approximate value 3.45). HRC 33 interpolates to BHN ≈ 311, giving UTS ≈ 3.43×311 ≈ **1065 MPa** (about 154 ksi). Trust the relation only within the supplied range (BHN ≈120–420; UTS ≈400–1450 MPa). It does not transfer universally because hardness samples flow stress at a representative strain (~8%), whereas UTS depends on subsequent strain hardening; very hard steels can also distort/crack under the indenter.

### C2. Aluminium UTS versus Vickers hardness

| HV (kgf/mm²) | 30 | 45 | 60 | 85 | 100 | 125 | 150 |
|---|---:|---:|---:|---:|---:|---:|---:|
| UTS (MPa) | 110 | 165 | 225 | 315 | 370 | 460 | 545 |
| UTS/HV | 3.67 | 3.67 | 3.75 | 3.71 | 3.70 | 3.68 | 3.63 |

Through-origin fit: **UTS ≈ 3.67 HV**. With intercept: UTS ≈ 3.64 HV + 3.7 MPa; the small intercept is negligible, so the origin fit is preferred. Since H(MPa)=9.81HV, UTS ≈ 0.374H, or H ≈ 2.7×UTS. The factor differs modestly from steel (~3.43) because strain-hardening behaviour and hardness scale differ. At HV=110, UTS ≈ **404 MPa**; interpolation is within the data range and expected accuracy is about ±2–3%.

## Section D — Applied problems

### D1. Ring on a shaft
- Ring strain: (50.20−50.00)/50.00 = **0.40%**. Shaft compressive strain: 0.20/50.20 ≈ **0.40%**.
- Ring curve fractures at 0.32% (~385 MPa), below imposed 0.40%: **ring cracks**. Shaft is about 330 MPa at 0.40%; it has yielded (yield ~300 MPa at 0.15%) but its curve continues beyond 1%, so it survives.
- Heated ring needs bore 50.24 mm: strain = 0.24/50 = 0.48%; ΔT = 0.0048/(11×10⁻⁶) ≈ **436 K**, to about 456 °C from 20 °C.
- Cooling shaft from 20 °C to −196 °C contracts it by 12×10⁻⁶×216×50.20 ≈ **0.130 mm**, less than 0.24 mm needed: cooling alone is insufficient. Combining cooling with ring heating leaves ~0.110 mm expansion, requiring about 200 K.

### D2. Wire on a mandrel
- Neutral-axis radius = 40/2 + 2/2 = 21 mm; outer strain = 1/21 = **4.76%**.
- Curve reading at 4.76%: ~**1227 MPa**. It exceeds elastic limit (~900 MPa at 0.45%) but is below fracture strain (~9%): yielded, not fractured.
- Elastic recovery = 1227/200,000 = **0.61%**; permanent strain ≈ **4.15%**.
- At fracture strain 9%, neutral-axis radius = 1/0.09 = 11.1 mm; mandrel radius ≈10.1 mm; minimum mandrel diameter ≈ **20.2 mm**.
- Fully elastic bending requires ε≤0.45%: neutral-axis radius ≈222 mm; mandrel diameter ≈ **442 mm**. Tight wire forming is plastic; a coil spring operates elastically in torsion.

### D3. Cold rolling
- Reduction = (5.0−3.2)/5.0 = **36%**; true strain = ln(5.0/3.2) = **0.446**.
- From marked curve points: n = ln(646/426)/ln(0.40/0.10) ≈ **0.30**; K ≈ **850 MPa**.
- Flow stress at ε=0.446: σ=850(0.446)^0.30 ≈ **667 MPa**.
- dσ/dε = nσ/ε ≈ 0.30×667/0.446 ≈ 449 MPa, below σ≈667 MPa: the strip has no uniform elongation on reloading; prior strain 0.446 exceeds n=0.30.
- Annealed UTS ≈ K(n/e)^n ≈439 MPa, BHN≈127. Rolled BHN≈667/3.45≈193, about 50% higher.
- Uniform ductility remains only while prior strain <n=0.30; h/h₀=e⁻⁰·³≈0.741, so maximum reduction ≈ **26%**.

### D4. Tightening a bolt
- Quarter-turn advance =1.75/4=0.4375 mm; strain=0.4375/50=**0.875%**.
- Curve stress ≈**1011 MPa**; preload =1011×84.3≈**85.2 kN**.
- Above elastic limit (~900 MPa at 0.45%) but below fracture strain (~9%): plastic, not fractured.
- At 120°: advance=1.75/3=0.5833 mm; strain≈1.17%; stress≈1042 MPa; preload≈**87.8 kN**, only +3% despite 33% more turn. In the plastic plateau, preload is less sensitive to turn/friction variation than in a perfectly elastic bolt.
- Idealised fracture stretch=0.09×50=4.5 mm; turns=4.5/1.75≈**2.57 turns** (real bolts neck at threads earlier).

### D5. Choosing a material from its curve

| Material | E (GPa) | Yield (MPa) | UTS (MPa) | Fracture strain | Resilience (MJ/m³) | Toughness (MJ/m³) |
|---|---:|---:|---:|---:|---:|---:|
| A | 200 | 1800 | 2000 | 6% | 8.10 | 106.7 |
| B | 200 | 300 | 450 | 30% | 0.23 | 119.3 |
| C | 375 | none (brittle) | 300 | 0.08% | 0.12 | 0.1 |
| D | 69 | 250 | 380 | 20% | 0.45 | 68.1 |

Resilience is σy²/(2E) (for brittle C, use σf²/(2E)); toughness is area under the curve, evaluated by trapezoids. Choose **A for a spring** (highest resilience), **B for a crane hook** (highest toughness and large warning deformation), and **C for a cutting-tool insert** (highest stiffness and ceramic hardness/wear resistance; brittle loading is manageable in compression).

END OF PAPER IV SOLUTIONS
