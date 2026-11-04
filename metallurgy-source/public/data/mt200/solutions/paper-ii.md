MT200 · TESTING OF MATERIALS
                                   Model Solutions and Marking Scheme: Paper II
                               Companion to Practice Paper II (100 marks, 3 hours)


## General marking conventions
   • Accept any correct alternative method. Award the mark for the idea, not the exact wording.
   • In numericals, award method marks even if the final number is wrong (error carried forward). Deduct
       0.5 mark for missing or wrong units, once per question.
   • For derivations, each line must follow from the previous one. A formula stated without derivation
       earns only the final-line mark.

 Section                 Questions and marks                                                             Total
   A · Derivations              A1 (6), A2 (5), A3 (5), A4 (6), A5 (6), A6 (6), A7 (4), A8 (4), A9 (4)      46
      B · Theory                                          B1 to B8 (4 each)                                 32
   C · Numericals                                       C1 (8), C2 (7), C3 (7)                              22
        Total                                                                                               100
      D · Bonus                                             D1 (4), D2 (4)                                  +8


## SECTION A · DERIVATIONS

A1 Torsion formula                                                                                                 [6]

 Assumptions. (1) Homogeneous, linear-elastic shaft of uniform circular cross-section. (2) Plane
 cross-sections stay plane and radii stay straight (no warping). (3) Small twist. (4) Pure torque at the
 ends. Assumption (2) holds only for circular sections, because only they have axial symmetry;
 non-circular sections warp (planes do not stay plane), so the simple formula fails.
 Geometry. Over length L, one end twists by θ relative to the other. A point at radius r moves along an
 arc rθ, so the shear strain of a longitudinal fibre is:
\(\gamma=\dfrac{r\theta}{L}\) (small angle), so \(\tau=G\gamma=\dfrac{Gr\theta}{L}\), linear in \(r\).
 Equilibrium. The torque is the moment of the shear stress over the section:
\[T=\int_A r\tau\,dA=\frac{G\theta}{L}\int_A r^2\,dA=\frac{G\theta J}{L},\qquad J=\int_A r^2\,dA\]\[\therefore\quad \frac{G\theta}{L}=\frac{T}{J},\qquad \frac{\tau}{r}=\frac{T}{J}=\frac{G\theta}{L}.\]
 J. Solid: \(J=\int_0^R r^2(2\pi r\,dr)=\pi R^4/2=\pi d^4/32\). Hollow: \(J=\pi(d_o^4-d_i^4)/32\). The maximum stress is at the surface, \(\tau_{\max}=T(d/2)/(\pi d^4/32)=16T/(\pi d^3)\). The angle of twist is \(\theta=TL/(GJ)\).

 Marking scheme                                                                                             Marks
 Assumptions stated, with the reason they hold only for circular sections                                           1
 Shear strain γ = rθ/L                                                                                              1
 τ = Gγ, linear in r                                                                                                1
 Equilibrium T = ∫rτ dA leading to J                                                                                1
 τ/r = T/J = Gθ/L                                                                                                   1
                                              3
 J for solid and hollow, and τmax = 16T/(πd )                                                                       1

A2 $G=\dfrac{E}{2(1+\nu)}$                                                                                                [5]

 Step 1. Pure shear τ on the faces of a square element is equivalent (Mohr's circle) to tension σ1 = +τ
 and compression σ3 = −τ on planes at 45°, that is, along the diagonals.
 Step 2. Along the diagonal in the tension direction, by Hooke's law:
\[\varepsilon_d=\frac{\sigma_1-\nu\sigma_3}{E}=\frac{\tau+\nu\tau}{E}=\frac{\tau(1+\nu)}{E}.\]
 Step 3. Geometry of a sheared square of side a. The top edge moves γa sideways, so the diagonal
 vector (a, a) becomes (a + γa, a). Its length is:
\[a\sqrt{(1+\gamma)^2+1}=a\sqrt{2+2\gamma+\gamma^2}\approx\sqrt{2}a\left(1+\frac{\gamma}{2}\right),\quad \therefore\ \varepsilon_d=\frac{\gamma}{2}.\]
 Equating: γ/2 = τ(1 + ν)/E, so G = τ/γ = E/[2(1 + ν)].


MT200 Testing of Materials · Paper II Solutions and Marking Scheme                                               Page 1

 Marking scheme                                                                                       Marks
 Pure shear equivalent to ±τ on 45° planes                                                                   1
 εd = τ(1 + ν)/E from Hooke's law                                                                            1
 Diagonal length of the sheared square                                                                       1
 Result εd = γ/2                                                                                             1
 Equating and obtaining G = E/[2(1 + ν)]                                                                     1

A3 Stresses on an oblique plane; Schmid's law                                                                [5]

 An oblique plane whose normal makes angle φ with the axis has area A/cosφ. The axial force P resolves
 into P cosφ normal to the plane and P sinφ along it:
\[\sigma_n=\frac{P\cos\phi}{A/\cos\phi}=\sigma\cos^2\phi,\qquad \tau=\frac{P\sin\phi}{A/\cos\phi}=\sigma\sin\phi\cos\phi=\frac{\sigma}{2}\sin2\phi.\]
 The shear stress is largest at φ = 45°, where τmax = σ/2. This is the basis of the Tresca criterion (σy =
 2τy) and of the 45° shear lips on tensile fractures.
 Schmid's law. Let the slip-plane normal make angle φ, and the slip direction make angle λ, with the
 axis. The force along the slip direction is P cosλ, and the area of the slip plane is A/cosφ:
\[\tau_r=\frac{P\cos\lambda\cos\phi}{A}=\sigma\cos\phi\cos\lambda.\]
 The Schmid factor cosφ cosλ has a maximum of 0.5 (φ = λ = 45°). Slip starts when τr reaches the
 critical resolved shear stress, so σy = τCRSS/(cosφ cosλ). A single crystal's yield stress therefore depends
 on orientation (lowest at a Schmid factor of 0.5, highest when the axis is nearly parallel or perpendicular
 to the slip plane), unlike an isotropic polycrystal.

 Marking scheme                                                                                       Marks
 Area of the oblique plane A/cosφ; force components                                                          1
            2
 σn = σcos φ and τ = (σ/2) sin2φ                                                                             1
 Maximum shear σ/2 at 45°                                                                                    1
 Schmid law derived with φ and λ                                                                             1
 Maximum factor 0.5, and the orientation-dependence implication                                              1

A4 Charpy energy                                                                                             [6]

 Take the effective mass m at distance R from the pivot, released from angle α measured from the
 downward vertical. The height of the centre of mass above the lowest point is h1 = R(1 − cosα). After
 breaking the specimen the pendulum rises to angle β on the far side, so h2 = R(1 − cosβ). By energy
 conservation, the absorbed energy is the loss of potential energy:
\[E=mg(h_1-h_2)=mgR(\cos\beta-\cos\alpha).\]
 Striking velocity. At the lowest point all of the initial potential energy is kinetic: ½mv2 = mgR(1 −
 cosα), so v = √[2gR(1 − cosα)] (about 5 to 5.5 m/s in standard machines).
 Friction and windage. Bearing friction and air drag remove some energy. The loss is measured by a
 free swing without a specimen (the pendulum should reach α on the other side, that is, β = α, giving E
 = 0). Any shortfall is subtracted from the reading. Capacity. The largest energy the machine can read
 is when the pendulum stops at the bottom (β = 0): Emax = mgR(1 − cosα). The standard asks for
 absorbed energy of at most about 80% of this, because near capacity the pendulum loses too much
 speed for the test to be a clean, high-rate fracture, and the reading becomes inaccurate (the hammer's
 residual energy is small, and the scale becomes crowded).

 Marking scheme                                                                                       Marks
 Energy conservation set-up with heights h1 and h2                                                           1
 h = R(1 − cos angle) for both                                                                               1
 $E=mgR(\cos\beta-\cos\alpha)$                                                                                        1
 Striking velocity                                                                                           1
 Friction and windage correction by a free swing                                                             1
 Capacity mgR(1 − cosα) and the 80% rule with a reason                                                       1



MT200 Testing of Materials · Paper II Solutions and Marking Scheme                                      Page 2

A5 Fatigue: parameters, Goodman, Basquin                                                                        [6]

 (i) The fatigue parameters are:
\[\sigma_a=\frac{\sigma_{\max}-\sigma_{\min}}{2}=\frac{\Delta\sigma}{2},\qquad \sigma_m=\frac{\sigma_{\max}+\sigma_{\min}}{2},\qquad \Delta\sigma=\sigma_{\max}-\sigma_{\min},\qquad R=\frac{\sigma_{\min}}{\sigma_{\max}}.\]
 (ii) Goodman. On a σ –σ plot, the fully reversed endurance limit σ lies on the σ axis (σ = 0), and
                      a m                                            e             a        m
 the UTS on the σ axis (σ = 0), because a static load at the UTS fails at once. The straight line joining
                  m      a
 these intercepts is:
\[\frac{\sigma_a}{\sigma_e}+\frac{\sigma_m}{\sigma_{UTS}}=1,\qquad \text{with safety factor }n:\quad \frac{\sigma_a}{\sigma_e}+\frac{\sigma_m}{\sigma_{UTS}}=\frac{1}{n}.\]
 With σa = σmax(1 − R)/2 and σm = σmax(1 + R)/2:
\[\sigma_{\max}=\frac{1}{n\left[\dfrac{1-R}{2\sigma_e}+\dfrac{1+R}{2\sigma_{UTS}}\right]}.\]
 (iii) Basquin. Over the finite-life region, \(\log\sigma_a\) is linear in \(\log N\). For points \((N_1,\sigma_1)\) and \((N_2,\sigma_2)\):
\[\sigma_a=\sigma_f'(2N)^b,\qquad b=\frac{\log(\sigma_1/\sigma_2)}{\log(N_1/N_2)}\]
(the exponent is negative, typically −0.05 to −0.12).
 (iv) Gerber uses a parabola, \[\frac{\sigma_a}{\sigma_e}+\left(\frac{\sigma_m}{\sigma_{UTS}}\right)^2=1,\] and fits ductile-metal data best (less conservative).
 Soderberg uses the yield strength in place of the UTS, and is the most conservative. Goodman (linear)
 lies between them and is the usual design choice.

 Marking scheme                                                                                          Marks
 Definitions of σa, σm, Δσ and R                                                                                1
 Goodman line from the two intercepts                                                                           1
 Inclusion of the safety factor n                                                                               1
 Allowable σmax in terms of R                                                                                   1
 Basquin exponent b from two points                                                                             1
 Gerber and Soderberg compared with Goodman                                                                     1

A6 Creep: Arrhenius, activation energy, Larson–Miller                                                           [6]
 (i) The creep-rate law is:
\[\dot{\varepsilon}=A\sigma^n\exp\left(-\frac{Q}{RT}\right).\]
Here Q is the activation energy of the rate-controlling process (self-diffusion for pure metals), and A and n are constants of the material and mechanism.
 (ii) At constant σ, take the ratio of rates at T1 and T2 and take logs:
\[\ln\left(\frac{\dot{\varepsilon}_2}{\dot{\varepsilon}_1}\right)=\frac{Q}{R}\left(\frac{1}{T_1}-\frac{1}{T_2}\right),\qquad Q=\frac{R\ln(\text{ratio})}{1/T_1-1/T_2}.\]
 (iii) Monkman–Grant:
\[\dot{\varepsilon}_{ss}\,t_r=C_{MG},\qquad t_r=\frac{C_{MG}}{A\sigma^n}\exp\left(\frac{Q}{RT}\right).\]
At fixed stress, \(\ln t_r=\ln C'(\sigma)+Q/(RT)\). Rearranging, \(T(\ln t_r-\ln C')=Q/R\), which is constant at a given stress. Writing \(C=-\log_{10}C'\) (found empirically, about 20 for \(t_r\) in hours):
\[\mathrm{LMP}=T(C+\log_{10}t_r)=f(\sigma),\]
a function of stress only.
 Use. Short, high-temperature tests give the LMP at a stress, and the same LMP predicts long rupture
 times at lower temperatures (or the allowable temperature for a given life). Limits. It assumes the
 same mechanism and the same value of Q throughout, and fails if the microstructure changes
 (precipitate coarsening, phase changes, oxidation) or the mechanism changes across the temperature
 range; C is not universal.

 Marking scheme                                                                                          Marks
 Arrhenius creep-rate law                                                                                       1
 Q from two temperatures at the same stress                                                                     1
 Monkman–Grant relation used to link tr to the creep rate                                                       1
 Derivation of T(C + log tr) as a function of stress only                                                       2
 Use for extrapolation, and its limits                                                                          1

A7 True fracture strain and ductility measures                                                                  [4]

 With volume constancy in the neck, \(A_fL_f=A_0L_0\). The true fracture strain is \(\varepsilon_f=\ln(L_f/L_0)=\ln(A_0/A_f)\). With \(RA=(A_0-A_f)/A_0\), we get \(A_f/A_0=1-RA\), so:
\[\varepsilon_f=\ln\left(\frac{1}{1-RA}\right).\]
 (The assumption is constant volume in the necked region, and that the fracture-surface diameter
 reflects the neck.) Gauge-length dependence. Elongation has two parts: a uniform part, eu, and a



MT200 Testing of Materials · Paper II Solutions and Marking Scheme                                         Page 3

 localised necking part that is roughly proportional to √A0 (neck size) spread over L0. So e = eu +
 β√A0/L0: a longer gauge length dilutes the neck and lowers %EL. RA compares only the cross-section at
 the neck with the original one, so it does not depend on L0, and it reflects local ductility (the
 neck-fracture strain) directly.

 Marking scheme                                                                                         Marks
 Volume constancy in the neck                                                                               1
 ε = ln(A /A ) = ln[1/(1 − RA)]                                                                             1
  f       0   f
 Barba's law explains why %EL depends on L                                                                  1
                                                 0
 %RA independent of L and a better measure of local ductility                                               1
                         0


A8 Generalised Hooke's law and bulk modulus                                                                [4]

\[\varepsilon_x=\frac{\sigma_x-\nu(\sigma_y+\sigma_z)}{E},\]\nand cyclic permutations for \(\varepsilon_y\) and \(\varepsilon_z\).
 Adding the three, for small strains, the volumetric strain is Δ = εx + εy + εz:
\[\Delta=\varepsilon_x+\varepsilon_y+\varepsilon_z=\frac{(1-2\nu)(\sigma_x+\sigma_y+\sigma_z)}{E}.\]
 For hydrostatic pressure p, σx = σy = σz = −p, so Δ = −3(1 − 2ν)p/E and K = −p/Δ = E/[3(1 − 2ν)]. K
 must be positive (a body cannot expand when compressed), so 1 − 2ν > 0, that is, ν < 0.5. At ν = 0.5, K
 → ∞ (incompressible, as for rubber). Plastic flow conserves volume, which is equivalent to an effective ν
 = 0.5, and this is exactly the volume-constancy assumption behind σT = σe(1 + εe).

 Marking scheme                                                                                         Marks
 Generalised Hooke's law                                                                                    1
 Volumetric strain = (1 − 2ν)Σσ/E                                                                           1
 K = E/[3(1 − 2ν)]                                                                                          1
 ν ≤ 0.5 from K > 0, and the link to the volume-constancy assumption                                        1

A9 Rule of mixtures                                                                                        [4]

 (i) Parallel loading (isostrain). Fibres and matrix stretch equally: \(\varepsilon_f=\varepsilon_m=\varepsilon_c\). The load is shared:
\[\sigma_cA_c=\sigma_fA_f+\sigma_mA_m.\]
For fibres running the full length, area fractions equal volume fractions, so \(\sigma_c=V_f\sigma_f+V_m\sigma_m\). Dividing by strain and using \(\sigma=E\varepsilon\):
\[E_c=V_fE_f+V_mE_m\quad\text{(upper bound)},\qquad \frac{P_f}{P_c}=\frac{V_fE_f}{V_fE_f+V_mE_m}.\]
(ii) Transverse loading (isostress). Both carry the same stress: \(\sigma_f=\sigma_m=\sigma\). Extensions add, so \(\varepsilon_c=V_f\varepsilon_f+V_m\varepsilon_m=\sigma\left(\frac{V_f}{E_f}+\frac{V_m}{E_m}\right)\). Since \(\varepsilon_c=\sigma/E_c\):
\[\frac{1}{E_c}=\frac{V_f}{E_f}+\frac{V_m}{E_m}\quad\text{(lower bound)}.\]

 Marking scheme                                                                                         Marks
 Isostrain condition and load sharing                                                                       1
 Ec = VfEf + VmEm, and the fibre load fraction                                                              1
 Isostress condition and strains adding                                                                     1
 1/Ec = Vf/Ef + Vm/Em                                                                                       1


## SECTION B · HARD CONCEPTUAL AND THEORY QUESTIONS

B1 Levels of structure and structure sensitivity                                                           [4]

 Levels and examples. Atomic (bonding and electron arrangement) sets melting point, modulus,
 thermal expansion. Crystal (FCC, BCC, HCP and the slip systems) sets ductility and anisotropy. Micro
 (grains, phases, precipitates, dislocations) sets yield strength, hardness, toughness. Macro (pores,
 inclusions, cracks, weld defects, surface finish) sets fracture and fatigue initiation. Mega (component or
 structure scale, joints, size effects) governs whether the design as a whole performs.
 Structure-insensitive properties (modulus E, density, melting point, thermal expansion) depend
 mainly on bonding and crystal structure, so they barely change with processing. Structure-sensitive
 ones (yield strength, hardness, ductility, toughness, fatigue strength) change strongly with grain size,



MT200 Testing of Materials · Paper II Solutions and Marking Scheme                                       Page 4

 dislocation density and phases.
 Same composition, different structure. (1) A steel quenched to martensite is many times harder
 than the same steel annealed to ferrite plus pearlite. (2) Grain refinement raises yield strength by the
                                   −1/2
 Hall–Petch relation σy = σ0 + k d      ; cold work raises the dislocation density and strength, while E is
 unchanged.

 Marking scheme                                                                                       Marks
 Five levels, each with a property or feature                                                                 2
 Structure-sensitive vs structure-insensitive properties, with examples                                       1
 Two examples of the same composition giving different properties                                             1

B2 Classes of materials                                                                                       [4]

 Metals have metallic bonding (a non-directional electron cloud), so dislocations move easily: moderate
 E, good ductility, high density, good conductivity. Ceramics have ionic and covalent bonds (strong,
 directional), giving very high E, hardness and melting point, but poor ductility, because dislocations
 barely move, and poor tensile strength, because flaws act as cracks. Polymers have strong covalent
 bonds along chains but weak secondary bonds between them: low E, low density, low melting point, and
 deformation by chain sliding or uncoiling.
 Composites combine constituents to get properties neither has alone, such as the high specific
 stiffness and strength of fibres with the toughness and shape-forming of a matrix (for example glass or
 carbon fibres in epoxy).
 Rubber is non-linear because its elasticity is entropic: coiled chains are pulled straight, which lowers
 entropy; the curve stiffens as chains align, so it becomes almost linear only near failure. A polymer's E
 is time- and temperature-dependent because chain motion is thermally activated and takes time
 (viscoelasticity): it is stiffer when loaded fast or cold, and softer or creeping when slow or warm,
 especially near the glass-transition temperature.

 Marking scheme                                                                                       Marks
 Bonding linked to properties for metals, ceramics and polymers                                               2
 Composites: what they achieve                                                                                1
 Rubber non-linearity and viscoelastic dependence of polymer modulus                                          1

B3 Tensile specimen and standards                                                                             [4]

 Shape. A specimen with plain parallel sides would fail at the grips, where gripping forces create stress
 concentrations. Wide shoulders keep the stress at the grips low, and generous fillets avoid stress
 concentration at the transition, so the failure occurs in the reduced gauge section where the stress is
 uniform. Standards (ASTM E8, ISO 6892) fix specimen dimensions and the gauge length (ISO uses
 proportional lengths L0 = 5.65√A0 ≈ 5d; ASTM E8 uses 4d for round bars), so that results from different
 laboratories are comparable.
 Gauge length and %EL. The elongation includes a uniform part and a localised necking part, so a
 longer gauge dilutes the neck and gives a lower %EL. %EL must therefore be quoted with its gauge
 length, and compared only between similar specimens. Other controlled variables: strain rate (yield
 strength rises with rate), temperature, axial alignment (bending adds spurious stress; self-aligning grips
 are used), grip method, and surface finish.

 Marking scheme                                                                                       Marks
 Reason for the shoulder and fillet shape (avoid grip failure and stress concentration)                       1
 What standards fix (dimensions, gauge length) and why (comparability)                                        1
 Effect of gauge length on %EL                                                                                1
 Other controlled variables (rate, temperature, alignment)                                                    1

B4 Yield-point phenomenon and yield definitions                                                               [4]

 Mechanism. In low-carbon steel, interstitial C and N atoms segregate to dislocation cores and form
 Cottrell atmospheres, which lower the energy of the dislocation and pin it. A higher stress (the upper


MT200 Testing of Materials · Paper II Solutions and Marking Scheme                                      Page 5

 yield point) is needed to tear dislocations free. Once free, they move under a lower stress (the lower
 yield point). Plastic deformation then spreads as Lüders bands (localised bands of yielded material) at
 roughly constant stress, giving a yield-point elongation of about 1 to 2%. After strain ageing (waiting for
 solute to diffuse back), the yield point returns.
 No sharp yield. Use the 0.2% offset method: draw a line parallel to the elastic slope, starting from
 0.002 strain, and read the stress where it meets the curve.
 Definitions. Proportional limit is where the curve stops being linear (Hooke's law ends). The elastic
 limit is the largest stress that leaves no permanent set. The yield strength is the practical, defined
 stress for a stated small plastic strain (offset). Usually proportional limit ≤ elastic limit ≤ yield strength,
 but they are very close for many metals.

 Marking scheme                                                                                           Marks
 Cottrell atmospheres and the upper/lower yield                                                                1
 Lüders bands and the yield-point elongation                                                                   1
 0.2% offset method                                                                                            1
 Proportional limit, elastic limit and yield strength distinguished                                            1

B5 Torsion testing                                                                                            [4]

 Why torsion. The specimen is in pure shear with a nearly uniform stress state, and neither necking nor
 barrelling limits the strain, so very large plastic strains are reached. It gives G, the shear yield strength,
 and the shear (rupture) strength τf = 16Tf/(πd3) (this elastic formula overestimates once the section is
 plastic, and is called the modulus of rupture). It is also used for studying hot working and for testing
 brittle materials.
 Specimen. A round bar with a reduced, parallel gauge section, or a thin-walled tube (nearly uniform
 shear stress across the wall). It must be circular because only then do plane sections stay plane, so the
 stress and strain formulas hold. Non-circular sections warp.
 Fracture. At a point on the surface under pure shear τ, the principal stresses are +τ (tension) and −τ
 (compression) at 45° to the axis. Ductile metals are weaker in shear than in tension, so they fail by
 shear along the plane of maximum shear stress, which is transverse (perpendicular to the axis), giving a
 flat fracture. Brittle materials are weaker in tension, so they fail on the plane of maximum principal
 tensile stress, which is the 45° helix.

 Marking scheme                                                                                           Marks
 Advantages of torsion (pure shear, large strain, properties obtained)                                         1
 Specimen types, and why circular sections are needed                                                          1
 Stress state at a surface point (±τ at 45°)                                                                   1
 Ductile flat (transverse shear) fracture vs brittle 45° helical (tensile) fracture                            1

B6 Impact testing and DBTT                                                                                    [4]

 Significance. The impact test measures the energy a notched specimen absorbs when broken at a
 high strain rate. It shows notch sensitivity and the temperature dependence of toughness (the DBTT).
 The result is comparative, and does not give a design value like KIC.
 Charpy vs Izod. Charpy: the specimen is a simply supported beam, the notch faces away from the
 hammer, and the hammer strikes the middle (behind the notch). Izod: the specimen is a cantilever
 gripped vertically, the notch faces the hammer, and the hammer strikes above the notch.
 Factors raising the DBTT: a sharper notch or thicker section (more triaxial constraint), a higher strain
 rate, coarse grains, higher C and P contents, embrittling precipitates, and irradiation. Lowering it: fine
 grains, Ni and Mn additions, and low C and P. Criteria: the mid-point between upper and lower shelf
 energy, a fixed energy (for example 27 J), or the temperature at which the fracture surface is 50%
 fibrous (FATT).
 FCC metals. Their yield stress depends only weakly on temperature (planar dislocation cores), so it
 never crosses the cleavage stress, so they stay ductile down to low temperatures. In BCC metals, σy
 rises steeply at low T and crosses the nearly temperature-independent cleavage stress.



MT200 Testing of Materials · Paper II Solutions and Marking Scheme                                          Page 6

 Marking scheme                                                                                        Marks
 Significance of the test                                                                                      1
 Charpy vs Izod distinguished by support, notch and striking point                                             1
 Factors affecting the DBTT                                                                                    1
 DBTT criteria, and why FCC metals show none                                                                   1

B7 Fatigue                                                                                                 [4]

 Stages. (1) Initiation: at the surface, cyclic slip builds persistent slip bands with intrusions and
 extrusions, from which micro-cracks start (often at stress raisers, inclusions or surface flaws). (2)
 Propagation: the crack grows perpendicular to the tensile stress, each cycle advancing it by a small
 step; this leaves striations (microscopic) and beach marks (macroscopic, from load changes). (3) Final
 fracture: when the remaining section cannot carry the load, the fracture is sudden, brittle-looking or
 ductile, and the rough final zone contrasts with the smooth beach-marked zone.
 Influences. Notches, keyways and sharp changes of section shorten life (stress concentration); a rough
 surface does likewise. A polished surface, compressive residual stress (shot peening, surface hardening)
 and avoiding corrosion (corrosion fatigue removes the endurance limit) lengthen life. Tensile residual
 stress and a large mean stress are harmful.
 S–N. Steels show a true endurance limit (a horizontal plateau, thought to be due to interstitial pinning
 of dislocations), while non-ferrous alloys do not, so a fatigue strength at a stated life (for example, 108
 cycles) is used. High-cycle fatigue (above about 104 to 105 cycles, stress elastic, stress-controlled)
 differs from low-cycle fatigue (plastic strain each cycle, strain-controlled, Coffin–Manson relation).

 Marking scheme                                                                                        Marks
 Three stages described                                                                                        1
 Fracture-surface features: striations, beach marks, persistent slip bands                                     1
 Effects of stress raisers, finish, residual stress and corrosion                                              1
 Endurance limit vs fatigue strength; HCF vs LCF                                                               1

B8 Creep                                                                                                   [4]

 Mechanisms. At high stress: dislocation glide and climb (climb over obstacles by vacancy diffusion,
 power-law creep, n ≈ 3 to 8). At low stress and high temperature: diffusional creep, in which vacancies
 flow through the grains (Nabarro–Herring) or along grain boundaries (Coble, favoured by fine grains),
 and grain-boundary sliding, which nucleates cavities.
 Temperature. Creep needs thermally activated diffusion, which becomes appreciable at about 0.4 Tm
 (absolute), and this is why creep matters for turbines and boilers but not for steel at room temperature.
 Stages. Primary: the rate falls as strain hardening builds up. Secondary (steady state): hardening and
 recovery balance, so the rate is constant and minimum. Tertiary: the rate accelerates due to necking,
 voids and cavities, and microstructural degradation, ending in rupture.
 Design. Use alloys with high melting point and strong obstacles: solid-solution and precipitate
 strengthening (γ′ in Ni superalloys), oxide dispersion strengthening, large grains, directionally solidified
 or single-crystal blades (which remove the transverse boundaries where sliding and cavities start), and
 protective coatings.

 Marking scheme                                                                                        Marks
 Dislocation, diffusional and grain-boundary sliding mechanisms                                                2
 0.4 Tm and the three stages with reasons                                                                      1
 Materials design against creep                                                                                1


## SECTION C · NUMERICALS AND DATA ANALYSIS

C1 Solid and hollow shafts in torsion                                                                      [8]

 (a) Solid. J = πd4/32 = π(0.030)4/32 = 7.95 × 10−8 m4.



MT200 Testing of Materials · Paper II Solutions and Marking Scheme                                       Page 7

        τmax = 16T/(πd3) = 16(400)/[π(0.03)3] = 75.5 MPa
        θ = TL/(GJ) = 400(1.0)/[80 × 109 × 7.95 × 10−8] = 0.0629 rad = 3.60°
 (b) Hollow (do = 30 mm, di = 20 mm). J = π(0.034 − 0.024)/32 = 6.38 × 10−8 m4.
        τmax = T(do/2)/J = 400(0.015)/(6.38 × 10−8) = 94.0 MPa θ = 0.0784 rad = 4.49°
 Mass ratio = (302 − 202)/302 = 0.556 (a 44% saving), and the torsional stiffness (∝ J) ratio = 0.802 (a
 20% loss). So the hollow shaft is much more efficient per unit mass because material near the axis
 carries little stress. The inner surface stress is only 62.7 MPa.
 (c) Yield and fully plastic torque. τy = 350/√3 = 202 MPa. The outer fibre yields when:
        Ty = τy πd3/16 = 202.1 × 106 × 5.30 × 10−6 = 1071 N·m
 For an elastic–perfectly plastic material, when the whole section is at τy: Tp = ∫0R τy r(2πr dr) =
        3
 2πτyR /3 = 1428 N·m. The ratio Tp/Ty = 4/3, so the section carries one-third more torque than the
 first-yield value.

 Marking scheme                                                                                           Marks
 (a) J, τmax = 75.5 MPa                                                                                         2
 (a) Angle of twist 0.0629 rad = 3.6°                                                                           1
 (b) Hollow J and τmax = 94 MPa                                                                                 1
 (b) Angle of twist 4.49°                                                                                       1
 (b) Mass and stiffness comparison (0.556 and 0.802)                                                            1
 (c) Yield torque 1071 N·m and fully plastic torque 1428 N·m (ratio 4/3)                                        2

C2 Charpy energy and DBTT                                                                                       [7]

 (a) E = mgR(cosβ − cosα) = 20(9.81)(0.80)[cos100° − cos140°] = 156.96 × [−0.1736 + 0.7660] =
 93.0 J. Machine capacity = mgR(1 − cosα) = 156.96 × 1.766 = 277.2 J. The specimen absorbed
 93.0/277.2 = 34% of capacity, which is below 80%, so the test is valid.
 (b) h1 = 0.80(1 − cos140°) = 1.413 m, so v = √(2gh1) = √(2 × 9.81 × 1.413) = 5.26 m/s.
 (c) 93.0 J / 0.80 cm2 = 116 J/cm2.
 (d) The upper shelf is about 108 J and the lower shelf is 5 J. (i) Mid-point energy = (5 + 108)/2 = 56.5
 J. This lies between −20 °C (45 J) and 0 °C (85 J): T = −20 + 20(56.5 − 45)/(85 − 45) = −14 °C. (ii) 27 J
 criterion: between −40 °C (18 J) and −20 °C (45 J): T = −40 + 20(27 − 18)/(45 − 18) = −33 °C.
 The two differ because they define different points on the transition curve: the 27 J criterion picks a
 point low on the curve (where the material is still fairly brittle), while the mid-point criterion sits half
 way between the shelves, so it is higher. The choice matters, since a component that is safe by one
 criterion may not be by the other. The transition is gradual, so any single number is a convention.

 Marking scheme                                                                                           Marks
 (a) Energy absorbed 93.0 J                                                                                     1
 (a) Capacity 277 J and the 80% check                                                                           1
 (b) Striking velocity 5.26 m/s                                                                                 1
 (c) Energy per unit area 116 J/cm2                                                                             1
 (d) Mid-point DBTT (about −14 °C)                                                                              1
 (d) 27 J DBTT (about −33 °C)                                                                                   1
 (d) Reason the two criteria differ                                                                             1

C3 Goodman fatigue check and creep activation energy                                                            [7]

 (i) Goodman. σa = (400 − 100)/2 = 150 MPa; σm = (400 + 100)/2 = 250 MPa.
        σa/σe + σm/σUTS = 150/250 + 250/600 = 0.600 + 0.417 = 1.017 > 1
 The point lies just outside the Goodman line, so infinite life is not guaranteed. The safety factor is n =
 1/1.017 = 0.98 (below 1, by a small margin). With R = 0.25: σa = 0.375σmax and σm = 0.625σmax, so
 σmax[0.375/250 + 0.625/600] = 1, that is σmax(0.001500 + 0.001042) = 1:
        σmax,allowed = 393 MPa (σa = 148 MPa, σm = 246 MPa)


MT200 Testing of Materials · Paper II Solutions and Marking Scheme                                          Page 8

 (ii) Creep. The ratio of rates is 1.5 × 10−7/1.0 × 10−8 = 15, and 1/873 − 1/923 = 6.205 × 10−5 K−1:
         Q = R ln 15/(6.205 × 10−5) = 8.314 × 2.708/(6.205 × 10−5) = 3.63 × 105 J/mol = 363 kJ/mol
 At 973 K: ln(rate     /rate     ) = (Q/R)(1/923 − 1/973) = 43,650 × 5.568 × 10−5 = 2.43, so the rate is
                   973       923
 11.4 × 1.5 × 10 = 1.70 × 10−6 s−1. Time to 1% strain = 0.01/(1.70 × 10−6) = 5.87 × 103 s = about
                  −7

 1.6 h (steady-state only; primary creep is ignored).

 Marking scheme                                                                                   Marks
 (i) σ , σ    and the Goodman evaluation (1.017)                                                        1
     a    m
 (i) Conclusion and safety factor (about 0.98)                                                          1
 (i) Allowable σ        at R = 0.25 (about 393 MPa)                                                     2
                  max
 (ii) Activation energy about 363 kJ/mol                                                                2
 (ii) Rate at 973 K and time to 1% strain                                                               1


## SECTION D · BONUS

D1 Glass-fibre composite                                                                               [4]

 Isostrain: Ec = 0.3(70) + 0.7(3) = 21 + 2.1 = 23.1 GPa. Isostress: 1/Ec = 0.3/70 + 0.7/3 = 0.004286 +
 0.23333 = 0.23762, so Ec = 4.21 GPa. Fibre load fraction (isostrain) = 21/23.1 = 90.9%, although the
 fibres are only 30% by volume, because they are so much stiffer. The isostrain bound applies to loading
 along the fibres and the isostress bound to loading across them, so the composite is strongly
 anisotropic (a 5.5:1 stiffness ratio).

 Marking scheme                                                                                   Marks
 Isostrain modulus 23.1 GPa                                                                             1
 Isostress modulus 4.21 GPa                                                                             1
 Fibre load fraction 90.9%                                                                              1
 Correct assignment of the bounds to the two loading directions                                         1

D2 Ductility numbers from a tensile test                                                               [4]

 A0 = π(12.5)2/4 = 122.7 mm2; Af = π(8.0)2/4 = 50.27 mm2. %EL = (62.5 − 50)/50 = 25%. %RA =
 (122.7 − 50.27)/122.7 = 59.0%. εf = ln(A0/Af) = ln(2.441) = 0.893. σf (true) = 41,000/50.27 = 816
 MPa (the engineering fracture stress is only 334 MPa).
 Gauge length. The neck extension is a fixed length that does not depend on L0, so spreading the same
 neck extension over a longer gauge length (62.5 mm instead of 50 mm) gives a smaller percentage. So
 %EL is smaller for the longer gauge (for example, a total extension of 12.5 mm over 62.5 mm gives
 20%, if the extension were unchanged), while %RA is unchanged.

 Marking scheme                                                                                   Marks
 %EL = 25% and %RA = 59.0%                                                                              1
 True fracture strain 0.893                                                                             1
 True fracture stress 816 MPa                                                                           1
 Gauge-length explanation                                                                               1

---

End of solutions.




MT200 Testing of Materials · Paper II Solutions and Marking Scheme                                   Page 9
