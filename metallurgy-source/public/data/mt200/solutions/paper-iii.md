MT200 · TESTING OF MATERIALS
                                   Model Solutions and Marking Scheme: Paper III
                     Companion to Practice Paper III (Modules 1 to 3; 100 marks, 3 hours)


## General marking conventions
   • Accept any correct alternative method. Award the mark for the idea, not the exact wording.
   • In numericals, award method marks even if the final number is wrong (error carried forward). Deduct
       0.5 mark for missing or wrong units, once per question.
   • For derivations, each line must follow from the previous one. A formula stated without derivation
       earns only the final-line mark.
   • Accept answers within about ±2% of the values shown, unless the data were read from a graph.

 Section                Questions and marks                                                              Total
   A · Derivations              A1 (7), A2 (5), A3 (5), A4 (6), A5 (5), A6 (5), A7 (4), A8 (3), A9 (4)      44
      B · Theory                                          B1 to B8 (4 each)                                 32
   C · Numericals                                        C1 (8), C2 (8), C3 (8)                             24
         Total                                                                                              100
      D · Bonus                                             D1 (4), D2 (4)                                  +8


## SECTION A · DERIVATIONS

A1 Modulus and theoretical strength from the bond                                                                  [7]

 (i) Equilibrium and stiffness. The force is dU/dr = mA r−(m+1) − nB r−(n+1). At equilibrium this is
 zero:
        mA r0−(m+1) = nB r0−(n+1) ⇒ r0n−m = nB/(mA) ⇒ r0 = [nB/(mA)]1/(n−m)
 The second derivative is d2U/dr2 = −m(m+1)A r−(m+2) + n(n+1)B r−(n+2). Using B r0−n = (m/n) A r0−m
 to eliminate B at r0:
        S0 = −m(m+1)A r0−(m+2) + (n+1)m A r0−(m+2) = m(n − m) A r0−(m+2)
 The bond energy is U0 = −A r0−m + B r0−n = −A r0−m(1 − m/n) = −A r0−m(n − m)/n, so A r0−m(n − m)
 = n|U0|. Hence:
        S0 = m n |U0| / r02
 (ii) For a small extension Δr of a bond, F = S0Δr. The stress is F/r02 and the strain is Δr/r0, so E =
 (S0Δr/r02)/(Δr/r0) = S0/r0 = m n|U0|/r03. So E is the bond energy per unit atomic volume (times mn). A
 deep well means a high bond energy, and it also means a high melting point (thermal energy needed to
 loosen the bonds). So high melting point goes with high E.
 (iii) Theoretical strength. For small x, σ ≈ σth(2πx/λ). Hooke's law for a strain x/r0 gives σ = Ex/r0, so
 σth = Eλ/(2πr0). The work to separate the planes is ∫0λ/2 σ dx = σthλ/π, and this must equal the energy of
 the two new surfaces, 2γ, so λ = 2πγ/σth. Substituting:
        σth = E(2πγ/σth)/(2πr0) = Eγ/(σth r0) ⇒ σth = √(Eγ/r0)
 (iv) σth = √(200 × 109 × 1/0.25 × 10−9) = 2.83 × 1010 Pa ≈ 28 GPa, roughly E/7. Compared with a
 yield strength of 250 MPa, that is more than 100 times higher. Real crystals yield far below the ideal
 because plastic flow occurs by dislocation glide (one row of bonds at a time), and fracture starts at
 flaws, and not by the simultaneous separation of whole planes. Only defect-free whiskers approach σth.




MT200 Testing of Materials · Paper III Solutions and Marking Scheme                                              Page 1

 Marking scheme                                                                                                 Marks
 Equilibrium spacing r0                                                                                             1
                                                                             −(m+2)
 Second derivative and elimination of B to get S0 = m(n − m)A r0                                                    1
 S0 = mn|U0|/r02                                                                                                    1
 E = S0/r0 and the link between E, bond energy and melting point                                                    1
 Sinusoidal law and small-x Hooke's law giving σ           = Eλ/(2πr )                                              1
                                                      th            0
 Work of separation = 2γ leading to σ         = √(Eγ/r )                                                            1
                                         th           0
 Value about 28 GPa, the gap to real strength, and its cause (dislocations and flaws)                               1

A2 Brinell vs Meyer hardness                                                                                       [5]
                                                                         2               2          2    2
 Meyer hardness is the mean contact pressure: pm = P/(πd /4) = 4P/(πd ). With s = √(D − d ) the Brinell
 number is BHN = 2P/[πD(D − s)]. The ratio is:
        BHN/pm = [2P/(πD(D − s))]·[πd2/(4P)] = d2/[2D(D − s)]
 Since d2 = D2 − s2 = (D − s)(D + s), this becomes (D + s)/(2D) = ½[1 + √(1 − (d/D)2)].
 d/D                             0.25                             0.375                      0.50
         BHN / Meyer                          0.984                              0.964                  0.933

 BHN is always slightly smaller than the Meyer value, because the curved area is larger than the
 projected area, and the gap grows with d/D (up to about 7% at d/D = 0.5). The Meyer hardness is the
 more fundamental measure: it is the mean pressure the material sustains in plastic flow (about 3σy
 when fully plastic) and it has a direct physical meaning. BHN is a convention that has stayed because of
 its long history and practical use.

 Marking scheme                                                                                                 Marks
                             2
 Meyer hardness as 4P/(πd )                                                                                         1
 Setting up the ratio                                                                                               1
 Using d2 = (D − s)(D + s) to get ½[1 + √(1 − (d/D)2)]                                                              1
 Values 0.984, 0.964, 0.933                                                                                         1
 Meyer is the physically meaningful mean pressure, and BHN is a convention                                          1

A3 Vickers geometry: d ≈ 7h                                                                                        [5]

 The square base has side a. The faces make 68° with the axis (half of 136°). Half the side is a/2 = h tan
 68°, so a = 2h tan 68° = 4.95h. The diagonal is:
        d = √2 a = 2√2 tan 68° · h = 7.00 h
 Projected area = a2 = d2/2 = 24.5 h2. Surface area = d2/(2 sin 68°) = d2/1.8544 = 26.4 h2. So HV =
 P/(26.4h2) using the surface area.
 Thickness rule. The plastic zone under an indenter extends to several times the depth. If the
 specimen is thin, the hard support (anvil) restricts the flow and raises the reading. A thickness of 1.5d =
 10.5h is at least about ten times the depth, which keeps the deformed zone clear of the back face.
 (Brinell's standard rule is at least 8 times the depth, for the same reason.)

 Marking scheme                                                                                                 Marks
 Half-side a/2 = h tan 68° and a = 4.95h                                                                            1
 d = √2 a = 7.0h                                                                                                    1
                     2           2
 Projected area d /2 = 24.5h                                                                                        1
                 2                   2
 Surface area d /1.8544 = 26.4h                                                                                     1
 Thickness 1.5d ≈ 10h justified by the size of the plastic zone                                                     1

A4 Friction hill in compression                                                                                    [6]

 Assumptions. Thin disc; axisymmetric flow; Coulomb friction τ = μσz at the platens; σz and σr uniform
 through the height; hoop stress equal to σr; and flow (Tresca or von Mises with axisymmetry) gives σz −
 σr = σ0.


MT200 Testing of Materials · Paper III Solutions and Marking Scheme                                              Page 2

 (i) Force balance on a ring of thickness dr at radius r, height h, per unit angle: the radial forces are (σr
 + dσ )(r + dr)h − σ r h − σ h dr (from the hoop component), and the friction on top and bottom faces
      r              r       r
 gives 2τ r dr. Balancing, and dropping second-order terms:
        h dσr + 2μσz dr = 0 ⇒ dσz/dr = dσr/dr = −2μσz/h (since σz − σr = σ0 is constant)
 (ii) Integrate: σz = C exp(−2μr/h). At the free edge r = a, σr = 0, so σz = σ0, giving C = σ0exp(2μa/h):
        σz(r) = σ0 exp[2μ(a − r)/h] (the "friction hill": highest at the centre)
 (iii) With k = 2μ/h, the mean pressure is pavg = (2/a2)∫0a σz r dr:
        pavg = σ0 · 2(eka − ka − 1)/(ka)2 ≈ σ0(1 + ka/3) = σ0(1 + 2μa/3h) (small ka)
 (The small-ka result follows by expanding ek(a−r) ≈ 1 + k(a − r): (2/a2)[a2/2 + ka3/6] = 1 + ka/3.)
 (iv) The measured pressure exceeds the true flow stress by a factor that grows with a/h (a squat, wide
 specimen) and with μ. So specimens should not be too squat (a moderate d:h, as in the 2:3 rule, keeps
 the error small), and a good lubricant (low μ) keeps the stress nearly uniform and the flow stress
 correct. (There is also a limit where the friction stress reaches the shear yield stress k, and the surface
 sticks instead of sliding.)

 Marking scheme                                                                                        Marks
 Assumptions stated, and radial force balance on a ring element                                                1
 Result dσz/dr = −2μσz/h using σz − σr = σ0                                                                    1
 Integration with the free-edge condition to get σz(r)                                                         1
 Mean pressure integral (exact form)                                                                           1
 Small-ka result 1 + 2μa/3h                                                                                    1
 Implications for specimen proportions and lubrication                                                         1

A5 Rebound and the coefficient of restitution                                                               [5]
                                                                                                  2
 The hammer reaches the specimen at v1 = √(2gh0) and leaves at v2 = e v1. It rises to hr = v2 /2g =
 e2v12/2g:
        hr = e2 h0     fraction dissipated = (mgh0 − mghr)/mgh0 = 1 − e2
 Link to hardness. If e = 1 the collision is perfectly elastic and the hammer returns to full height. If
 plastic flow occurs, energy is used in plastic work and lost (as well as some as heat and sound), so e
 drops. In a harder material (higher yield strength) the same impact produces less plastic deformation,
 so less energy is dissipated and hr is higher. So hr is an indirect measure of hardness.
 Limitation. Rebound depends also on the elastic modulus and damping (rubber has a high rebound but
 is soft), as well as surface finish and support, so it can rank materials only within a similar family (for
 example, steels), and the apparatus must be vertical on a horizontal, rigid surface.

 Marking scheme                                                                                        Marks
 v2 = e v1 and v1 = √(2gh0)                                                                                    1
        2
 hr = e h0                                                                                                     1
                            2
 Fraction dissipated 1 − e                                                                                     1
 Link to hardness: plastic work dissipation vs yield strength                                                  1
 Limitation: depends on E and damping too, valid only within a family of materials                             1

A6 Necking for the Voce law                                                                                 [5]

 Differentiate: dσT/dεT = (σs − σ0) exp(−ε/εc)/εc = (σs − σT)/εc. The Considère criterion dσT/dεT = σT
 gives:
        (σs − σu)/εc = σu ⇒ σu = σs/(1 + εc)
 Then σs − σu = σsεc/(1 + εc) = (σs − σ0) exp(−εu/εc), so:
        εu = εc ln[(σs − σ0)(1 + εc)/(σsεc)] σUTS = σue−εu
 Numbers. σu = 600/1.5 = 400 MPa. εu = 0.5 ln[400 × 1.5/(600 × 0.5)] = 0.5 ln 2 = 0.347
 (engineering strain e0.347 − 1 = 41.4%). σUTS = 400e−0.347 = 283 MPa. (Check: σ(0.347) = 600 −
 400e−0.693 = 400 MPa ✓.)


MT200 Testing of Materials · Paper III Solutions and Marking Scheme                                      Page 3

 Comparison. For Hollomon (unbounded power law), εu = n regardless of the stress level, and the
 stress keeps rising. The Voce law saturates at σs (dislocation storage balanced by dynamic recovery), so
 necking is set by how fast the stress approaches σs. Voce is better for large strains and for metals with
 strong recovery (for example, FCC metals at large deformation), and Hollomon for moderate strains.

 Marking scheme                                                                                      Marks
 Differentiation of the Voce law                                                                            1
 Considère criterion giving σ = σ /(1 + ε )                                                                 1
                               u     s       c
 Necking strain ε expression                                                                                1
                   u
 Numerical values 400 MPa, 0.347 and 283 MPa                                                                1
 Comparison with Hollomon (unbounded vs saturating)                                                         1

A7 Machine compliance                                                                                       [4]

 The specimen and machine act as springs in series. The specimen stiffness is ks = AE/L. For a load F,
 the crosshead displacement is δ = F/ks + F/km. The apparent modulus, using stress F/A and strain δ/L,
 is:
        Eapp = (F/A)/(δ/L) = E/(1 + ks/km) = E/(1 + AE/(Lkm))
 Numbers. A = π(10)2/4 = 78.5 mm2; ks = 78.5 × 200,000/50 = 314 kN/mm; ks/km = 3.14, so Eapp =
 200/4.14 = 48 GPa, less than a quarter of the true value.
 Consequences. The elastic slope (E), the yield strain and any elastic strain read from the crosshead
 are wrong, and the strain at fracture and the area under the curve (toughness) include the elastic
 deflection of the machine. Stress (load/area) is unaffected. The 0.2% offset yield stress is essentially
 unaffected if the compliance is linear, since the offset line is drawn parallel to the apparent elastic
 slope. The remedy is to use an extensometer on the gauge section. (This is also why apparent moduli
 from crosshead data are low.)

 Marking scheme                                                                                      Marks
 Series-spring model                                                                                        1
 Eapp = E/(1 + AE/(Lkm))                                                                                    1
 Numerical value about 48 GPa                                                                               1
 Which quantities are corrupted and which are not, and the remedy (extensometer)                            1

A8 Meyer's index and the strain-hardening exponent                                                          [3]

 The mean pressure is pm = 4P/(πd2) = Cσr = C K (0.2 d/D)n. Solving for the load:
        P = (π/4)d2 C K 0.2n D−n dn = k d2+n ⇒ m = 2 + n
 m = 2 means n = 0: a perfectly plastic material with a constant flow stress. The mean pressure is then
 independent of the indentation size (P ∝ d2, so the hardness is independent of the load). Annealed
 metals with strong hardening give m up to about 2.5, and heavily cold-worked ones give m close to 2.

 Marking scheme                                                                                      Marks
 Mean pressure related to the flow stress at εr = 0.2 d/D                                                   1
 Substituting Hollomon to get P ∝ d2+n                                                                      1
 m = 2 corresponds to no strain hardening and load-independent hardness                                     1

A9 Error propagation                                                                                        [4]

 Vickers: HV = 1.8544 P/d2, so ln HV = const − 2 ln d and δHV/HV = −2 δd/d.
 Brinell: BHN = 2P/[πD(D − s)], s = √(D2 − d2). Then δBHN/BHN = δs/(D − s), and since ds/dd = −d/s:
        δBHN/BHN = −[d/(s(D − s))] δd = −[d2/(s(D − s))] (δd/d)
 Numbers. D = 10, d = 4.0: s = 9.165, D − s = 0.835, so d/(s(D − s)) = 0.523 mm−1. With δd = 0.05
 mm, δBHN/BHN = 2.6% (in the direction opposite to the error in d). The factor d2/(s(D − s)) is 2.09
 here, and tends to 2 for small d/D, so both tests double the relative error in d, since hardness varies as
 1/d2 (area).



MT200 Testing of Materials · Paper III Solutions and Marking Scheme                                    Page 4

 Sensitivity. The more sensitive test in practice is the one with the smaller impression, because a fixed
 reading error is a larger fraction of d. For a microhardness Vickers impression of d ≈ 50 µm, a 1 µm
 error is 2%, giving a 4% error in HV, whereas a Brinell impression of several millimetres has a tiny
 relative error in d.

 Marking scheme                                                                                      Marks
 Vickers: δHV/HV = −2δd/d                                                                                 1
 Brinell error formula derived through s                                                                  2
 Numerical value 2.6% and the sensitivity comment (small d is more sensitive)                             1


## SECTION B · HARD CONCEPTUAL AND THEORY QUESTIONS

B1 Slip systems and ductility                                                                             [4]

 Counts. FCC has 4 close-packed {111} planes × 3 ⟨110⟩ directions = 12 slip systems. BCC has no
 close-packed plane, and slip occurs on {110}, {112} and {123} planes along ⟨111⟩: 48 possible
 systems (12 on {110}). HCP has 3 systems on the basal plane (1 plane × 3 close-packed directions),
 plus prismatic and pyramidal systems that need higher stress.
 FCC has many close-packed systems with a short Burgers vector and a planar dislocation core, so the
 Peierls stress is low and nearly independent of temperature, so FCC metals stay ductile and workable
 even when cold. BCC has a non-planar screw dislocation core, which must be thermally activated to
 move, so the yield stress rises steeply as temperature falls (strongly temperature and rate dependent),
 and this is why BCC steels show a ductile-to-brittle transition. HCP with c/a near or above the ideal has
 only three basal systems (two independent), so limited slip is available, and non-basal slip or twinning is
 needed for further deformation, so Zn and Mg are often brittle at room temperature.
 Von Mises criterion. A polycrystal needs five independent slip systems for a grain to make an
 arbitrary shape change and remain compatible with its neighbours. FCC and BCC satisfy this, and
 basal-only HCP does not.

 Marking scheme                                                                                      Marks
 Slip system counts for FCC, BCC and HCP                                                                  1
 FCC ductility: close-packed, low Peierls stress                                                          1
 BCC temperature dependence via the non-planar screw core; HCP brittleness from few basal systems         1
 Five independent systems (von Mises) and its consequence                                                 1

B2 Potential well, modulus, melting point and expansion                                                   [4]

 The interatomic potential well has a depth (the bond energy) and a curvature at the minimum.
 Modulus is set by the curvature (A1: E = S0/r0), so a narrow, steep well gives a high E. Melting point
 is set by the well depth, since the atoms must gain enough thermal energy to escape the bonds, so a
 deep well gives a high Tm. Thermal expansion arises from the asymmetry of the well: as atoms
 vibrate with more energy, the mean spacing increases because the well is steeper on the compressive
 side. A deep, steep, more symmetric well restricts this growth, so materials with high Tm and high E
 have low α (roughly α·Tm is about constant).
 Classes. Steel (metallic bonding, non-directional, E ≈ 200 GPa); alumina (strong ionic-covalent bonds,
 directional, E ≈ 380 GPa); polymers (strong covalent bonds along the chain but weak van der Waals or
 hydrogen bonds between chains, and deformation mostly happens by uncoiling or sliding of chains, so E
 ≈ 1 to 3 GPa).

 Marking scheme                                                                                      Marks
 Modulus from the curvature at the well minimum                                                           1
 Melting point from the depth of the well                                                                 1
 Thermal expansion from the asymmetry of the well, and the correlation between the three                  1
 Contrast of steel, alumina and polymers through bonding                                                  1

B3 Strengthening mechanisms                                                                               [4]


MT200 Testing of Materials · Paper III Solutions and Marking Scheme                                    Page 5

 Mechanism              Relation                              Physical origin
                                                              Grain boundaries block dislocations, which pile up; a
 Grain refinement       σy = σ0 + k d−1/2 (Hall–Petch)
                                                              smaller d means a shorter pile-up and more boundary
                                                              Solute atoms strain the lattice and interact with the strain
 Solid solution         Δσ ∝ c1/2 (or c)
                                                              fields of dislocations
                                                              Dislocation density ρ grows with strain, and dislocations
 Strain hardening       τ = τ + αGb√ρ (Taylor)
                               0                              obstruct each other
 Precipitation or                                             Dislocations must bow around (or cut) particles; a smaller
                        Δτ ≈ Gb/L (Orowan)
 dispersion                                                   spacing L means a higher stress

 Toughness. Solid solution, strain hardening and precipitation restrict dislocation motion, so they
 reduce ductility and usually toughness. Grain refinement is the exception: a fine grain size raises the
 yield strength and also the toughness and lowers the ductile-to-brittle transition temperature, because
 more grain boundaries deflect cracks and a smaller pile-up produces lower stress concentration at
 boundaries.

 Marking scheme                                                                                                    Marks
 Hall–Petch, with its origin                                                                                              1
 Solid solution and strain hardening (Taylor), with their origins                                                         1
 Precipitation (Orowan), with its origin                                                                                  1
 Grain refinement identified as the mechanism that also improves toughness, with a reason                                 1

B4 Parameters from a tensile test; elastic vs plastic                                                                  [4]

 Strength: proportional limit (end of linearity); elastic limit (largest stress with no permanent set); yield
 strength (stress at yield point, or at 0.2% offset); UTS (maximum load ÷ A0); fracture strength (load at
 rupture ÷ A0); true fracture stress (load ÷ final area). Stiffness and energy: Young's modulus E
 (slope), resilience σy2/2E, toughness (area under the curve), and the hardening parameters n and K.
 Ductility: %EL, %RA, uniform elongation and true fracture strain ln(A0/Af).
 Elastic vs plastic. Elastic deformation is the stretching of atomic bonds, is recoverable, is roughly
 linear and reversible, stores energy, and has ν ≈ 0.3 with a small volume change. Plastic deformation is
 the glide of dislocations across planes (bond breaking and re-forming), which is permanent, non-linear,
 dissipates energy as heat and stored defects, and conserves volume (ν = 0.5).
 Why yield strength is used in design. A ductile component that has yielded is permanently
 deformed and has effectively failed, well before the UTS, so σy sets the working stress. UTS matters for
 brittle materials, forming operations and as a check. A low yield ratio (σy/σu) means a large reserve of
 strain hardening (high n, good uniform elongation and formability), and a ratio close to 1 (for example
 cold-worked metals) means little reserve and low ductility.

 Marking scheme                                                                                                    Marks
 Strength and ductility parameters with how they are read from the curve                                                  2
 Elastic vs plastic contrasted at the atomic level                                                                        1
 Why σy is the design parameter, and the meaning of the yield ratio                                                       1

B5 Necking and the true stress–strain curve                                                                            [4]

 No single equation. After necking the deformation is not uniform along the gauge length: strain
 concentrates in the neck while the rest of the specimen unloads elastically. So one length or area can
 no longer represent the specimen, and stress and strain must be measured locally (the instantaneous
 neck diameter, with ε = 2 ln(d0/d)).
 Stress state. The neck's curvature adds radial and hoop tension in its interior, making the state
 triaxial. The mean axial stress (load ÷ neck area) therefore overestimates the flow stress. The
 Bridgman correction is σflow = σavg/[(1 + 2R/a) ln(1 + a/2R)], where a is the smallest neck radius and
 R is the radius of curvature of the neck profile. Both a and R must be measured continuously during the
 test (from photographs or a profile gauge).




MT200 Testing of Materials · Paper III Solutions and Marking Scheme                                                  Page 6

 Cup-and-cone fracture. (1) Voids nucleate at inclusions and second-phase particles in the centre of
 the neck, where triaxiality is highest. (2) The voids grow and coalesce into a central, flat, fibrous crack
 perpendicular to the axis. (3) Near the surface, where the stress is more nearly uniaxial, the crack turns
 to about 45° and shears, forming the shear lip (the cone).

 Marking scheme                                                                                          Marks
 Non-uniform deformation: no single equation, and local measurement of the neck                               1
 Triaxial stress in the neck                                                                                  1
 Bridgman correction and the quantities to be measured                                                        1
 The three stages of cup-and-cone fracture                                                                    1

B6 Tension vs compression; brittle materials                                                                 [4]

 Flaw argument. A pre-existing flaw perpendicular to a tensile stress opens and concentrates stress at
 its tip (Griffith), so a brittle solid fails at a low stress and the crack runs straight across, giving a flat
 fracture perpendicular to the axis. Under compression such flaws close and cannot propagate directly.
 Cracks grow only from the flaws inclined to the load, as stable wing cracks parallel to the load, and
 failure needs a much higher stress. So the compressive strength is 3 to 10 times the tensile strength.
 Fracture plane. Failure in compression is governed by shear on an inclined plane and the normal
 stress across it. In the Coulomb–Mohr form τ = c + σn tan φf, the compressive normal stress increases
 the shear resistance by friction, so the plane with the critical combination lies at more than 45° from the
 axis (typically 50° to 65°) and not at the plane of maximum shear.
 Tension vs compression for a ductile metal. Tension: a dog-bone specimen, gripped, with an
 extensometer, ending in necking and cup-and-cone fracture. Compression: a short cylinder between
 platens, with friction and barrelling, with no necking or a defined UTS, and with cracking only at large
 strain. The true stress–strain curves agree up to the onset of necking, and compression can reach much
 higher strains.

 Marking scheme                                                                                          Marks
 Flaw behaviour in tension vs compression                                                                     1
 Why the compressive strength is several times larger                                                         1
 Coulomb–Mohr criterion and the fracture angle above 45°                                                      1
 Comparison of method and outcomes of the two tests for a ductile metal                                       1

B7 Hardness–strength correlation                                                                             [4]

 Constraint. Under an indenter the plastic zone is enclosed by a large elastic region, which prevents
 free lateral flow (like an expanding cavity). The material can only flow if the mean contact pressure is
 well above the uniaxial yield stress, and slip-line and cavity-expansion analyses give pm ≈ 2.8 to 3 σ, so
 H ≈ 3σ.
 Representative strain. The strain varies throughout the deformed region, but the indentation
 behaves as if the whole zone is at one representative strain of about 8% (Tabor, εr ≈ 0.2 d/D for a
 sphere and a constant for pyramids such as Vickers). So H ≈ 3σ8% and not 3σy. The two are equal only
 for a non-hardening metal, whereas hardness overstates σy for a hardening one.
 Limitations. (1) The factor depends on strain hardening, so the same factor does not hold for annealed
 and cold-worked metals (see C3(a)). (2) It fails for brittle ceramics (cracking, densification), for polymers
 (viscoelastic) and where the elastic strain is large (hard materials with a high H/E ratio).
 Pile-up and sink-in. Cold-worked (low n) metals bulge up around the indenter (pile-up), whereas
 annealed (high n) metals sink in. In an instrumented test based on the depth, ignoring pile-up
 underestimates the contact area, and so overestimates H and E. In optical measurements, the diagonal
 of the residual impression is measured directly, so it matters less, but pile-up blurs the edges.




MT200 Testing of Materials · Paper III Solutions and Marking Scheme                                        Page 7

 Marking scheme                                                                                   Marks
 Constraint factor of about 3 explained                                                                   1
 Representative strain and the use of σ8% in place of σy                                                  1
 Two limitations of H ≈ 3σ                                                                                1
 Pile-up and sink-in and their effect on results                                                          1

B8 Microhardness and nanoindentation                                                                     [4]

 Microhardness. Loads from grams up to about 1 kgf (typically 50 to 1000 gf), with a Vickers or Knoop
 diamond, and the indentation is measured under a microscope. The surface must be flat, polished and
 etched or lightly re-polished to remove the work-hardened layer; the specimen must be thick enough (≥
 1.5 d) and mounted rigidly. Indents must be well spaced (roughly 2.5 to 3 diagonals apart, and from any
 edge or another phase boundary) to avoid overlapping strain fields.
 Indentation size effect. At low loads the measured hardness rises as the indent gets smaller (for
 example, the Nix–Gao relation H = H0√(1 + h*/h)). It is due to geometrically necessary dislocations
 needed to accommodate the shape of a small indent, plus surface effects and elastic recovery. So
 microhardness numbers must always be quoted with the load used.
 Nanoindentation. A Berkovich (three-sided) diamond tip is loaded and unloaded while the load P and
 displacement h are recorded continuously. The hardness is H = Pmax/Ac, where the contact area Ac is
 obtained from the contact depth through a calibrated tip-area function (no optical measurement of the
 impression is needed). The modulus follows from the initial slope S = dP/dh of the unloading curve: Er =
 (√π/2β) S/√Ac (Oliver–Pharr), where Er is the reduced modulus that includes the indenter's elasticity.

 Marking scheme                                                                                   Marks
 Microhardness loads, specimen preparation and spacing rules                                              1
 Indentation size effect and why the load must be quoted                                                  1
 Nanoindentation: continuous load–displacement recording and H = Pmax/Ac                                  1
 Modulus from the unloading slope                                                                         1


## SECTION C · NUMERICALS AND DATA ANALYSIS

C1 Crystal-structure calculations                                                                        [8]

 (a) APF. FCC: 4 atoms per cell; atoms touch along the face diagonal, so 4R = √2 a, giving R = √2a/4.
 APF = 4(4πR3/3)/a3 = (16π/3)(√2/4)3 = π/(3√2) = 0.740. BCC: 2 atoms per cell; atoms touch along the
 body diagonal, so 4R = √3 a, giving R = √3a/4. APF = 2(4πR3/3)/a3 = (8π/3)(√3/4)3 = π√3/8 = 0.680.
 (b) Density ρ = nA/(VcNA). Cu (FCC, n = 4): a3 = (0.3615 × 10−7 cm)3 = 4.724 × 10−23 cm3; ρ = 4 ×
 63.55/(4.724 × 10−23 × 6.022 × 1023) = 8.94 g/cm3. Fe (BCC, n = 2): a3 = (0.2866 × 10−7)3 = 2.354
 × 10−23 cm3; ρ = 2 × 55.85/(2.354 × 10−23 × 6.022 × 1023) = 7.88 g/cm3. (Both are within 1% of the
 measured values, 8.96 and 7.87 g/cm3.)
 (c) Planar density. FCC (111): a hexagonally packed layer with atom spacing a/√2, so the planar
 density = 4/(√3 a2) = 4/(√3 × 0.36152) = 17.7 atoms/nm2. BCC (110): a rectangle of a × a√2 with 2
 atoms (1 centre + 4 corners × ¼): 2/(√2 a2) = 1.414/0.28662 = 17.2 atoms/nm2.
 Slip. Both are the most densely packed planes of their lattices, and are where slip is easiest. But FCC
 (111) is a genuinely close-packed plane (6 nearest neighbours in the plane, 3 close-packed directions),
 whereas BCC (110) has only 4 in-plane nearest neighbours and 2 close-packed ⟨111⟩ directions, and its
 packing is much less "smooth". Higher planar density means lower Peierls stress, but the BCC
 advantage is not enough to make it as easy to slip as FCC. This is consistent with FCC being softer and
 more ductile at the same bond strength, and BCC having more systems but a higher lattice friction.




MT200 Testing of Materials · Paper III Solutions and Marking Scheme                                    Page 8

 Marking scheme                                                                                                    Marks
 (a) FCC atomic packing factor 0.74 with the touching condition                                                        1
 (a) BCC atomic packing factor 0.68 with the touching condition                                                        1
 (b) Copper density 8.94 g/cm3                                                                                       1.5
 (b) Iron density 7.88 g/cm3                                                                                         1.5
                                                  2
 (c) Planar densities 17.7 and 17.2 atoms/nm with the atom counts                                                      2
 (c) Comment on slip (close-packed plane and directions, Peierls stress)                                               1

C2 Analysing tension data                                                                                             [8]

 e (%)                σ (MPa)                σ = σ (1 + e)       ε = ln(1 + e)   ln σ               ln ε
                        e                     T       e           T                 T                   T
           2                  358                 365.2               0.0198             5.900              −3.922
           5                  416                 436.8               0.0488             6.080              −3.020
         10                   454                 499.4               0.0953             6.214              −2.351
         15                   469                 539.4               0.1398             6.291              −1.967
         18                   473                 558.1               0.1655             6.324              −1.799
                                 n
 (b) Taking logs of σT = KεT gives ln σT = ln K + n ln εT, a straight line. A least-squares fit gives a slope
 n = 0.20 and an intercept ln K = 6.68, that is K ≈ 800 MPa.
 (c) Necking begins when εT = n = 0.20, that is at an engineering strain eu = e0.20 − 1 = 22.1%. The
 engineering UTS is:
         σUTS = K(n/e)n = 800(0.2/2.718)0.2 = 800 × 0.593 = 475 MPa
 (d) Energy per unit volume up to necking = K nn+1/(n + 1) = 800 × 0.21.2/1.2 = 96.6 MJ/m3 (plastic
 part; the small elastic part is extra). The 18% point (εT = 0.166 < 0.20) is still before necking, so the
 power law and the conversion formulas are valid for all five points. The stress is flattening (469 to 473
 MPa), and is close to the UTS of 475 MPa, which is consistent with the approach to necking.

 Marking scheme                                                                                                    Marks
 (a) True stress and strain for all points                                                                             2
 (b) Log–log method used                                                                                               1
 (b) n ≈ 0.20 and K ≈ 800 MPa                                                                                          2
 (c) εu = n and eu = 22.1%                                                                                             1
 (c) UTS ≈ 475 MPa                                                                                                     1
                             3
 (d) Energy about 97 MJ/m and the check that 18% is before necking                                                     1

C3 Hardness calculations                                                                                              [8]

 (a) BHN = 2P/[πD(D − √(D2 − d2))]; Meyer = 4P/(πd2).
 P (kgf)                    d (mm)                    d/D                  BHN (kgf/mm2)         Meyer (kgf/mm2)
           1000                      3.50                    0.35                100.7                     103.9
           2000                      4.80                    0.48                103.7                     110.5

 Both d/D values lie inside 0.25 to 0.5, so the tests are valid. Meyer's index is m = ln(P2/P1)/ln(d2/d1) = ln
 2/ln(4.80/3.50) = 0.693/0.316 = 2.19, so n = m − 2 ≈ 0.19. Since m > 2, the hardness rises with the
 load (larger, more heavily strained impression), as the increase from 100.7 to 103.7 shows. An
 exponent of about 0.2 is typical of a moderately hardening metal.
 (b) d = (48 + 50)/2 = 49 µm = 0.049 mm. HV = 1.8544 × 0.1/(0.049)2 = 77.2 kgf/mm2. δHV/HV = 2 ×
 1/49 = ±4.1% (about ±3.2 HV).
 (c) HRC 55: e = (100 − 55) × 0.002 = 0.090 mm. HRB 90: e = (130 − 90) × 0.002 = 0.080 mm. One
 Rockwell unit corresponds to a depth difference of 0.002 mm = 2 µm, which is why the testing machine
 and the minor load must be very stable.




MT200 Testing of Materials · Paper III Solutions and Marking Scheme                                                 Page 9

 Marking scheme                                                                                        Marks
 (a) BHN and Meyer hardness for both tests, and the d/D check                                                 2
 (a) Meyer's index m = 2.19                                                                                   1
 (a) n ≈ 0.19 with interpretation                                                                             1
                          2
 (b) HV = 77.2 kgf/mm                                                                                         1
 (b) Uncertainty ±4.1%                                                                                        1
 (c) Depths 0.090 mm and 0.080 mm                                                                             1
 (c) One Rockwell unit = 2 µm                                                                                 1


## SECTION D · BONUS

D1 Friction raising the compressive force                                                                     [4]
                                                                                                 0.1
 Start (a = 10 mm, h = 30 mm): ka = 2μa/h = 2(0.15)(10)/30 = 0.100. Then pavg/σ0 = 2(e     − 0.1 −
                                                         2
 1)/0.01 = 1.0342, so pavg = 310 MPa, and F = 310 × π(10) = 97.5 kN (the frictionless force would be
 94.2 kN).
 Half height (h = 15 mm): constant volume gives a = 10√(30/15) = 14.14 mm. ka = 2(0.15)(14.14)/15
 = 0.283, so pavg/σ0 = 2(e0.283 − 1.283)/0.0800 = 1.101, and pavg = 330 MPa. F = 330.4 × π(14.14)2 =
 207.6 kN. The frictionless force is 300 × 628.3 = 188.5 kN, so friction adds 10.1%. The penalty grows
 as the disc gets squatter, which is why lubrication is essential in forging and compression testing.

 Marking scheme                                                                                        Marks
 Start: ka = 0.1, pavg = 310 MPa                                                                              1
 Start: F = 97.5 kN                                                                                           1
 Half height: a = 14.14 mm, ka = 0.283, pavg = 330 MPa                                                        1
 Force 207.6 kN vs 188.5 kN, giving +10.1%                                                                    1

D2 Specific properties and a beam index                                                                       [4]

 Material                     E/ρ (GPa per g/cm³)          σy/ρ (MPa per g/cm³)   E1/2/ρ (GPa1/2 per g/cm³)
            Steel                        26.8                             51                  1.85
        6061-T6 Al                       25.6                         102                     3.08
         Ti-6Al-4V                       25.7                         199                     2.41
    CFRP (along fibres)                  84.4                         938                     7.26

 Beam index. For a square-section beam of side b and length L, the stiffness is S ∝ EI/L = E b4/(12L3)
                                                                                             3

 (up to a load-case constant), so b = (12SL3/E)1/4 for a required S. The mass is m = ρb2L ∝
 ρL(SL3)1/2/E1/2. To minimise mass at a given stiffness, maximise E1/2/ρ.
 Ranking. (i) Light stiff tie (E/ρ): CFRP is far ahead, and steel, Ti and Al are almost equal (about 26),
 because E and ρ scale together with the bonding. (ii) Light strong tie (σy/ρ): CFRP > Ti > Al > steel. (iii)
 Light stiff beam (E1/2/ρ): CFRP > Al > Ti > steel. Aluminium beats steel and titanium as a beam because
 a thicker section of a light material stiffens the beam more cheaply than raising E does.

 Marking scheme                                                                                        Marks
 Table of the three indices computed correctly                                                                2
 Beam index derived                                                                                           1
 Rankings and the comment                                                                                     1

---

End of solutions.




MT200 Testing of Materials · Paper III Solutions and Marking Scheme                                     Page 10
