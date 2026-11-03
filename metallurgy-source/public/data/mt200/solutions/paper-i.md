MT200 · TESTING OF MATERIALS
                                       Model Solutions and Marking Scheme
                       Companion to the Rigorous Practice Paper (100 marks, 3 hours)


## General marking conventions
  • Accept any correct alternative method. Award the mark for the idea, not for the exact wording.
  • In numericals, award method marks even if the final number is wrong (error carried forward). Deduct
      0.5 mark for missing or wrong units, once per question.
  • For derivations, each line must follow from the previous one. A formula stated without derivation
      earns only the final-line mark.
  • Numbers in C1 are approximate readings of graphs, so accept answers within about ±5% of the
     values shown.

## Summary of marks
 Section                Questions and marks                                                               Total
   A · Derivations              A1 (6), A2 (6), A3 (4), A4 (7), A5 (6), A6 (8), A7 (4), A8 (4), A9 (3)         48
      B · Theory                                     B1 to B7 (4 each), B8 (2)                                 30
   C · Numericals                                      C1 (8), C2 (8), C3 (6)                                  22
        Total                                                                                                 100
      D · Bonus                                             D1 (4), D2 (4)                                     +8

 Notes: the standard Knoop constant is 14.229. Your handwritten notes appear to read 14.8, so please recheck that
 line. In A5, the estimate σuεr is always an upper bound on toughness (it is only accurate for near-perfectly plastic
 behaviour).


## SECTION A · DERIVATIONS

A1 True strain as ln(L/L₀) and additivity                                                                           [6]

 Divide the elongation L0 → L into many small steps L0 → L1 → L2 → … → L. Measure each step's strain
 against the length at the start of that step:
        δεi = (Li − Li−1)/Li−1, εT = Σ δεi = (L1−L0)/L0 + (L2−L1)/L1 + …
 Let the steps shrink to zero, so that each term becomes dL/L and the sum becomes an integral:
        εT = ∫L0L dL/L = ln L − ln L0 = ln(L/L0)
 Additivity. ln(L2/L0) = ln(L1/L0) + ln(L2/L1), so true strains of successive steps add exactly. Engineering
 strain fails this: (L2−L0)/L0 ≠ (L1−L0)/L0 + (L2−L1)/L1, because the second step is measured on a
 different base length.
 Example. 100 → 110 mm: e = 10%, εT = ln 1.1 = 0.0953. 110 → 121 mm: e = 10% (on 110 mm), εT =
 ln 1.1 = 0.0953. True strains sum to 0.1906 = ln 1.21, which is the true strain of the whole 100 → 121
 process. Engineering step strains sum to 20%, but the overall engineering strain is 21%. So they are not
 additive.

 Marking scheme                                                                                                Marks
 Incremental strains defined against the current length (series written)                                             1
 Limit to the integral ∫dL/L                                                                                         1
 Evaluation: εT = ln(L/L0)                                                                                           1
 Additivity of ln shown algebraically, and failure for engineering strain explained                                  1
 Numerical example: true strains 0.0953 + 0.0953 = ln 1.21                                                           1
 Numerical example: engineering 10% + 10% = 20% ≠ 21%                                                                1

A2 Engineering ↔ true stress and strain                                                                             [6]

 Volume constancy (plastic flow, no voids): A0L0 = AL, so A = A0L0/L = A0/(1 + εe), because L/L0 = 1 +
 εe.


MT200 Testing of Materials · Solutions and Marking Scheme                                                         Page 1

        σT = F/A = F(1 + εe)/A0 = σe(1 + εe)
        εT = ln(L/L0) = ln(1 + εe)
 Invert the strain relation: 1 + εe = eεT. Substitute into the stress relation:
        σT = σe · eεT
 Validity. Only up to the onset of necking (the UTS). The derivation assumes the strain is uniform along
 the whole gauge length, so that one L and one A describe the specimen. After necking, the deformation
 localises, so the gauge-length extension no longer represents what happens in the neck, and A must be
 measured directly at the neck. (It also assumes negligible elastic volume change and no void
 formation.)

 Marking scheme                                                                                               Marks
 Volume constancy gives A = A /(1 + ε )                                                                           1
                                  0       e
 σ = σ (1 + ε )                                                                                                   1
  T     e      e
 ε = ln(1 + ε )                                                                                                   1
  T            e
 Inversion and substitution giving σT = σe eεT                                                                    1
 Validity limit stated: valid up to necking only                                                                  1
 Reason: uniform deformation assumption fails once strain localises; area must be measured at the                 1
 neck

A3 True stress and strain in compression                                                                         [4]

 Volume constancy: A·h = A0h0, so A = A0h0/h. Let e = (h0 − h)/h0 be the (positive) compressive
 engineering strain.
        σT = P/A = P h/(A0h0) = σe(1 − e)          εT = ln(h/h0) = ln(1 − e) < 0, magnitude |εT| = ln(h0/h)
 Why the difference. In tension the area shrinks, so P/A exceeds P/A0: σT > σe. In compression the
 area grows, so P/A is smaller than P/A0: σT < σe. The ratio h/h0 is below 1, so its logarithm is negative;
 this is why compressive strain is negative by convention. In practice the magnitudes of both σ and ε are
 plotted, and |εT| = −ln(1 − e) is larger than e.

 Marking scheme                                                                                               Marks
 A = A0h0/h from volume constancy                                                                                 1
 σT = P h/(A0h0) = σe(1 − e)                                                                                      1
 εT = ln(h/h0), with the correct sign or magnitude                                                                1
 Area shrinks in tension and grows in compression, and the sign of the log explained                              1

A4 Considère criterion and UTS                                                                                   [7]

 The load is P = σTA. Necking starts at maximum load, where dP = 0:
        dP = A dσT + σT dA = 0 ⇒ dσT/σT = −dA/A
 Volume constancy gives dA/A = −dL/L = −dεT. Hence:
        dσT/dεT = σT      (Considère criterion)
 With σT = KεT : dσT/dεT = nKεTn−1. Setting this equal to KεTn gives εT = n. The engineering UTS is the
                   n

 maximum load divided by the original area. Using A0/A = eεT:
        σUTS = Pmax/A0 = σT·(A/A0) = Knn e−n = K(n/e)n
 Physical meaning. Strain hardening raises the stress a section can carry (dσT/dεT), while the shrinking
 area lowers the load it can carry (σT per unit strain). While hardening wins, any slightly thinner section
 hardens more and the strain spreads out (stable). At dσT/dεT = σT the two effects balance. Beyond this,
 a thin section cannot harden fast enough to compensate for its area loss, so strain concentrates there
 and a neck forms.




MT200 Testing of Materials · Solutions and Marking Scheme                                                      Page 2

 Marking scheme                                                                                       Marks
 P = σTA and dP = 0 at maximum load                                                                        1
 Differentiation: A dσT + σT dA = 0                                                                        1
 Volume constancy: dA/A = −dεT, giving dσT/dεT = σT                                                        1
 Hollomon substitution gives εT = n                                                                        1
                                −ε
 σ      = σ ·A/A = σ e                                                                                     1
  UTS      T    0           T
                        n
 Final result K(n/e)                                                                                       1
 Physical explanation: hardening rate vs geometric area loss                                               1

A5 Toughness up to necking and resilience                                                                  [6]

 Equality of areas. Since σT = σe(1 + e) and dεT = de/(1 + e), we get σT dεT = σe de. So the area under
 the engineering curve equals ∫σTdεT (work per unit volume). Up to necking (εT = n):
         W = ∫0n Kεn dε = K nn+1/(n + 1) (plastic part; add σy2/2E for the elastic part)
 Resilience. The elastic area is a triangle: Ur = ½ σyεy. With εy = σy/E this gives Ur = σy2/2E.
 Quality of σuεr. The engineering stress never exceeds σu, so the rectangle σuεr is always an upper
 bound on the area. The size of the overestimate depends on the curve shape: a brittle solid (a straight
 line to fracture) has area ½σuεr, so the estimate is out by a factor of 2; a parabolic-hardening metal has
 area about ⅔σuεr; a nearly perfectly plastic metal has area close to σuεr, so the estimate is good. A
 better rule for ductile metals is about ½(σy + σu)εr.

 Marking scheme                                                                                       Marks
 Showing σTdεT = σede (areas equal)                                                                        1
                    n
 Integration of Kε                                                                                         1
 Limits (ε = n) and result K nn+1/(n+1)                                                                    1
 Elastic triangle ½σyεy                                                                                    1
                                     2
 Substitution εy = σy/E gives σy /2E                                                                       1
 Discussion: upper bound, with the factors for brittle, parabolic and plastic cases                        1

A6 Brinell hardness formula                                                                                [8]

 (a) Area of the spherical cap. Let the ball radius be R = D/2. A ring at polar angle θ (from the vertical
 axis through the centre) has radius R sinθ and arc width R dθ:
         dA = 2π(R sinθ)(R dθ) = 2πR2 sinθ dθ ⇒ A = 2πR2(1 − cosθ0)
 The cap height is h = R − R cosθ0 = R(1 − cosθ0), so A = 2πRh = πDh.
 (b) Geometry. In the right triangle with hypotenuse R, one side R − h and the other d/2:
         (D/2 − h)2 + (d/2)2 = (D/2)2 ⇒ h = [D − √(D2 − d2)]/2
 (The smaller root is taken, since h < D/2 for a shallow impression.) Substituting into BHN = P/A =
 P/(πDh):
         BHN = 2P / [πD(D − √(D2 − d2))]
 (c) Why the curved area. Brinell hardness is defined as load per unit contact (surface) area, which is
 the area the material actually resists over. The projected area πd2/4 gives the mean contact pressure
 instead (Meyer hardness), which is a different quantity. The two differ by the ratio of curved to flat area,
 which grows as d/D increases.




MT200 Testing of Materials · Solutions and Marking Scheme                                               Page 3

 Marking scheme                                                                                        Marks
                             2
 Ring element dA = 2πR sinθ dθ                                                                               1
                         2
 Integration to A = 2πR (1 − cosθ0)                                                                          1
 A = πDh using h = R(1 − cosθ0)                                                                              1
 Geometry equation relating h, D and d                                                                       1
 Solving for h with the correct root                                                                         1
                                               2    2
 Final formula BHN = P/A = 2P/[πD(D − √(D − d ))]                                                            1
 Definition based on contact surface area                                                                    1
 Contrast with projected-area (Meyer) hardness                                                               1

A7 Geometric similarity of the Brinell test                                                                  [4]
                                                                                                   2     2
 Let φ be the angle subtended at the ball's centre by the impression. Then sin(φ/2) = d/D, so √(D − d )
 = D cos(φ/2), and h = (D/2)(1 − cos(φ/2)). Hence:
        A = πDh = (πD2/2)(1 − cos(φ/2)) ⇒ BHN = 2P / [πD2(1 − cos(φ/2))] = (P/D2) · f(φ)
 Since φ is fixed by d/D, two tests with the same P/D2 and the same d/D give the same BHN. Equal d/D
 also means geometrically similar impressions with the same representative strain (about 0.2 d/D), so
 the material is deformed to the same degree. This is why standard tests fix P/D2 (30 for steels, lower for
 softer metals).
 Valid range. If d/D < 0.25 the impression is tiny, so reading errors in d and surface roughness
 dominate. If d/D > 0.5 the ball approaches a hemisphere, the ball itself flattens, material piles up at the
 rim, and the edge and thickness effects of the specimen matter; both break the similarity assumption.

 Marking scheme                                                                                        Marks
 sin(φ/2) = d/D and h expressed through φ                                                                    1
                2
 BHN = 2P/[πD (1 − cos(φ/2))]                                                                                1
           2
 Same P/D and same d/D give the same BHN, with the similarity and representative strain argument             1
 Reasons for both limits of d/D                                                                              1

A8 Vickers formula and the 136° angle                                                                        [4]

 The base is a square with diagonal d, so its side is a = d/√2. The angle between opposite faces is 136°,
 so each face makes 68° with the axis. In the isosceles triangle forming one face, the slant height is s =
 (a/2)/sin 68°. Area of one face = ½ a s = a2/(4 sin 68°). Four faces:
        A = 4 · a2/(4 sin 68°) = a2/sin 68° = d2/(2 sin 68°) = d2/1.8544
        HV = P/A = 1.8544 P/d2 (P in kgf, d in mm gives kgf/mm2)
 Why 136°. For a Brinell impression with d/D = 0.375 (the middle of the recommended 0.25 to 0.5),
 sin(φ/2) = 0.375, so φ ≈ 44.05°. The tangents to the ball at the rim of the impression then meet at 180°
 − 44.05° ≈ 136°. So Vickers is designed to give nearly the same number as Brinell in that range, and
 because the shape is a pyramid, all impressions are geometrically similar, so HV is nearly independent
 of load.

 Marking scheme                                                                                        Marks
 Face geometry: side a = d/√2 and slant height using 68°                                                     1
                        2                 2
 Area of four faces = d /(2 sin 68°) = d /1.8544                                                             1
                         2
 HV = P/A = 1.8544P/d                                                                                        1
 136° from tangents at d/D = 0.375, matching Brinell                                                         1

A9 Knoop constant                                                                                            [3]

 Let the long diagonal be l, the short diagonal w and the depth t. The long edges (172.5°) and short
 edges (130°) give:
        t = l / (2 tan 86.25°) = l/30.5 ⇒ w = 2t tan 65° ≈ 0.1406 l (so l/w ≈ 7.11)
        Aproj = ½ l w = l2 tan(β/2)/(2 tan(α/2)) = 0.07028 l2 ⇒ HK = P/Aproj = 14.229 P/l2



MT200 Testing of Materials · Solutions and Marking Scheme                                               Page 4

 Knoop hardness uses the projected area (unlike Vickers, which uses surface area). The impression
 depth is only about l/30, roughly a third of a Vickers depth for the same diagonal, so it samples a
 shallow layer. The long diagonal is easy to measure, the indent is narrow, so many indents fit in a small
 region (case-depth profiles, coatings), and the small stress under the indenter reduces cracking in
 brittle materials.

 Marking scheme                                                                                             Marks
 Depth t and short diagonal w from the edge angles (l/w ≈ 7.11)                                                 1
                                       2
 Projected area = ½ l w = 0.07028 l                                                                             1
 HK = 14.229 P/l2, with a correct reason for suitability for thin layers or brittle materials                   1


## SECTION B · HARD CONCEPTUAL AND THEORY QUESTIONS

B1 Stiffness vs strength                                                                                       [4]

 Definitions (sketch: σ–ε curves). Stiffness is the slope E, the resistance to elastic deformation.
 Strength is the stress at which yielding or fracture occurs. Resilience is the elastic energy per unit
 volume (σy2/2E). Toughness is the total energy absorbed up to fracture (the whole area). Brittleness is
 fracture with little or no plasticity.
 Same E, different strength. E is set by the stiffness of the interatomic bond, so it barely changes
 with microstructure. Strength depends on defects. A metal yields by dislocation glide at a modest
 stress, while a ceramic (with almost immobile dislocations) can withstand very high stress in
 compression. But ceramics fail in tension at a low stress because pre-existing flaws grow (Griffith, σf ∝
 E/√c), so the two materials are not equally strong, and ceramics have far lower toughness.
 The quoted statement. It is true only in a limited sense: ceramics are very stiff and very hard, with
 high compressive strength. It is not a general law, because stiffness does not imply strength (for
 example, tensile strength of glass is low despite E ≈ 70 GPa), and a stiff brittle solid has low toughness.

 Marking scheme                                                                                             Marks
 Correct definitions of stiffness, strength, toughness, resilience and brittleness (with sketches)              2
 E is set by bonding and strength by defects and microstructure, with a Griffith or flaw argument for           1
 ceramics
 Critical comment on the statement (limited truth, not general)                                                 1

B2 Strain hardening and the true vs engineering curve                                                          [4]

 Plastic flow multiplies dislocations (Frank–Read sources). Moving dislocations intersect, form jogs and
 locks, and tangle, so the mobile ones face more obstacles. The flow stress rises with dislocation density
 ρ, as τ = τ0 + αGb√ρ (Taylor). So strength goes up.
 Ductility drops because the hardening capacity is being used up. The uniform strain equals n, and
 heavily cold-worked material has small n, so necking (localised, unstable flow) starts early and the
 remaining strain to fracture is small.
 The true stress uses the instantaneous (shrinking) area, and the material keeps hardening, so σT keeps
 rising. The engineering stress uses the original area. After the UTS the loss of load-bearing area
 outpaces hardening, so the load and σe fall (geometric softening).

 Marking scheme                                                                                             Marks
 Dislocation multiplication and interaction raise flow stress (Taylor relation or equivalent)                   2
 Ductility reduction: hardening capacity is used up (n small, so early necking)                                 1
 True stress keeps rising because the area is instantaneous; the engineering curve falls due to area loss       1
 after the UTS

B3 Compression specimen, barrelling and cracking                                                               [4]

 Two reasons. (1) A slender tensile-type specimen buckles (Euler instability) before it can be tested to
 a useful strain, so the data would reflect geometry and not the material. (2) Friction at the platen faces
 restrains lateral flow at the ends, which makes the specimen bulge (barrel) and gives non-uniform,


MT200 Testing of Materials · Solutions and Marking Scheme                                                    Page 5

 triaxial stress.
 Ratio. A short cylinder (h/d about 1.5, that is d : h ≈ 2 : 3) is short enough to avoid buckling but long
 enough that the friction-affected end zones do not dominate the whole specimen, leaving a uniform
 middle region.
 Lubrication. MoS2 has a layered structure with weak bonds between layers, so it shears easily and
 reduces the friction coefficient at the platen faces. The ends flow outward more freely and barrelling is
 reduced. A liquid film would be squeezed out at high pressure and can allow the specimen to slip and
 shoot out of the machine.
 Cracks. The bulging surface is stretched circumferentially (hoop tension), so the outer barrelled surface
 has a tensile component even though the overall load is compressive. Cracks initiate there, not in the
 interior.

 Marking scheme                                                                                         Marks
 Buckling as a reason for a different specimen                                                               1
 Friction and barrelling; d : h ratio rationale (avoid buckling and avoid friction domination)               1
 Solid lubricant mechanism; why liquids are avoided                                                          1
 Cracks start at the barrel surface because of hoop tension                                                  1

B4 Strength vs hardness; rebound and indentation                                                             [4]

 Strength vs hardness. Strength is the resistance of the loaded body as a whole to deformation or
 fracture. Hardness is resistance to localised plastic deformation at a point (indentation, scratching).
 Mohs. It is an ordinal scale (talc to diamond) based on which mineral scratches which. Most
 engineering metals fall into a narrow 4 to 6 range, so the scale cannot discriminate between them, and
 the numbers do not scale linearly with a physical property.
 Energy argument. Impact energy = energy used in plastic deformation + losses + energy returned. In
 rebound, a harder material deforms less plastically, so more energy returns as rebound. In indentation,
 for the same load, a higher yield strength means less plastic flow and a smaller impression, so a higher
 hardness number.
 Limitations. Rebound depends on elastic properties too (rubber rebounds well but is soft), so
 comparisons are valid only within a material family, and the test is sensitive to surface finish and
 orientation. Indentation is destructive and is affected by surface preparation, and the numbers of
 different methods are not directly interchangeable.

 Marking scheme                                                                                         Marks
 Strength (bulk) vs hardness (local resistance)                                                              1
 Mohs is ordinal and metals cluster in the 4 to 6 range                                                      1
 Common energy argument for rebound and indentation (plastic work lost vs returned; yield strength vs        1
 impression size)
 One valid limitation each for rebound and indentation                                                       1

B5 Rockwell testing                                                                                          [4]

 (a) The minor load (10 kgf) seats the indenter firmly, breaks through surface films and roughness, takes
 up the play in the machine, and establishes a repeatable zero. Without it, surface and backlash errors
 would be added to the measured depth.
 (b) The permanent depth e (measured under the minor load after the major load is removed) is smaller
 for harder materials. The scale is defined as HR = N − e/(0.002 mm), with N = 100 for the
 diamond-cone scales (A, C) and N = 130 for the ball scales (B). So a smaller depth gives a larger
 number.
 (c) Scale A: diamond cone (120°), 60 kgf (cemented carbides, thin hard sheet). Scale B: 1/16-inch steel
 ball, 100 kgf (soft materials such as Al, Cu and brass, and mild steel). Scale C: diamond cone (120°),
 150 kgf (hardened steels).
 (d) Rockwell gives a direct dial reading in seconds, needs no microscope and little operator skill, so it
 suits production. Vickers has a single continuous scale over a wide hardness range, works with small


MT200 Testing of Materials · Solutions and Marking Scheme                                                Page 6

 loads, thin sections and microhardness, and is nearly load-independent, so it suits research.

 Marking scheme                                                                                                Marks
 (a) Minor load: seating, film and backlash removal, zero reference                                                   1
 (b) Depth-based reversed scale, with HR = N − e/0.002 mm                                                             1
 (c) Indenter, major load and typical material for A, B and C                                                         1
 (d) Industry (speed and direct reading) vs research (continuous scale, small loads)                                  1

B6 Rockwell B procedure for a soft material                                                                           [4]

 Set the small needle to the red mark. This applies the minor load (10 kgf) and sets the zero
 reference for depth; the red mark is where the setting must sit for the B scale. Apply the major load
 (100 kgf) and wait. A soft material keeps flowing (creeps) under load; the wait lets the indentation
 stabilise so the reading is repeatable. Read the outer scale after the load is removed. The reading
 is taken with the minor load still applied, on the red (B) scale, and it gives HRB from the permanent
 depth increase.
 Dwell too short. The ball has not yet fully penetrated, so the depth is under-recorded and the material
 looks harder than it is (a higher HRB), and the results scatter from test to test. (The notes use 30 s for
 soft materials. Standards specify a much shorter hold of a few seconds for most tests and a longer hold
 only for materials that creep noticeably.)

 Marking scheme                                                                                                Marks
 Minor-load setting and zero reference                                                                                1
 Major load and dwell purpose (creep of soft material)                                                                1
 Reading the correct scale after unloading, and what the reading represents                                           1
 Effect of too short a dwell: under-recorded depth, false high hardness and scatter                                   1

B7 Comparison of hardness tests                                                                                       [4]

 Test       Indenter               Load               Measured              Suitable for         Limitations
            Hardened steel (or                                              Soft to medium       Large impression,
                                   500 to 3000        Diameter d, then
 Brinell    WC) ball, D = 10                                                metals, castings,    ball deforms on hard
                                   kgf                load/curved area
            mm                                                              coarse structures    steels, slow
                                                                            All metals, thin     Needs a polished
            136° diamond           1 to 100 kgf       Two diagonals,
 Vickers                                                                    sections,            surface and a
            pyramid                (micro: grams)     load/surface area
                                                                            microstructure       microscope, slower
                                                                                                 Scales not
                            10 kgf minor +
          120° diamond cone                                                                      comparable, less
 Rockwell                   60/100/150 kgf            Depth difference      Production testing
          or 1/16" ball                                                                          precise on thin or
                            major
                                                                                                 curved parts
                                                                            Thin layers,         Microscope needed,
            Elongated rhombic                         Long diagonal,
 Knoop                             Grams to 1 kgf                           coatings, brittle    small sample
            diamond                                   load/projected area
                                                                            materials            volume

 Brinell on very hard steels. The ball itself deforms flat (a steel ball is only about 450 to 650 HB),
 which changes the contact geometry and invalidates the formula. The impression is also very shallow
 with a small d, so the relative error in reading d is large, and d/D falls below the valid range.

 Marking scheme                                                                                                Marks
 Correct comparison across the four tests (indenter, load, measurement, materials)                                    2
 Limitations correctly listed                                                                                         1
 Brinell on very hard steels: ball deformation and small d/D or reading error                                         1

B8 UTS ≈ 3.45 × BHN                                                                                                   [2]

 A Brinell impression samples the material at a representative strain of about 8% (0.2 d/D), and hardness
 is roughly three times the flow stress at that strain. So HB tracks the flow stress at about 8% strain.
 UTS/σ8% is roughly constant for steels of similar hardening behaviour, so a fixed factor works. For



MT200 Testing of Materials · Solutions and Marking Scheme                                                        Page 7

 strongly work-hardening alloys (large n), UTS is much larger than the 8% flow stress, so UTS/BHN is
 higher; for heavily cold-worked material (n → 0), UTS ≈ σ , so the ratio is lower. This is what your C1
                                                          8%
 data show, so a single factor cannot cover them all.

 Marking scheme                                                                                            Marks
 Representative strain and hardness ≈ 3 × flow stress at that strain                                               1
 Failure explained through different UTS/flow-stress ratios (n dependence)                                         1


## SECTION C · NUMERICALS AND DATA ANALYSIS

C1 UTS–hardness conversion for the cold-rolled nickel alloy                                                       [8]

 Cold reduction (%)         0                  10               30               50              70
           BHN                     220                270              325             405               445
        UTS (MPa)                  620                690              820             1020              1060
        UTS/BHN                   2.82                2.56             2.52            2.52              2.38

 (a) The ratios run from 2.38 to 2.82, with a mean of 2.56. A least-squares fit through the origin
 (physically sensible: zero hardness should mean zero strength) gives:
        k = Σ(BHN·UTS)/Σ(BHN2) ≈ 2.50 ⇒ UTS (MPa) ≈ 2.5 × BHN
 The fit through the origin is preferred over a plain mean of the ratios because it weights the harder
 samples (larger, more accurate readings) more. Both methods give about 2.5 to 2.6.
 (b) UTS/BHN = (UTS/σ8%) × (σ8%/BHN). The second factor is roughly constant (hardness ≈ constant ×
 flow stress at about 8% strain). The first factor depends on strain hardening: for the annealed alloy
 (high n) the UTS lies well above the 8% flow stress, so the ratio is highest (2.82). As cold work exhausts
 hardening (n → 0), UTS approaches σ8%, so the ratio falls (2.38 at 70%).
 (c) The ratio varies by about +10% / −7% about the mean, so a single factor predicts UTS to roughly
 ±10%. That is acceptable for quick estimates or screening, but not for design. It would be better to use
 a state-dependent factor (for example, a lower k for heavily worked material) or a direct tension test.

 Marking scheme                                                                                            Marks
 Ratios UTS/BHN computed for all rows                                                                              2
 A single factor k obtained by a valid method (least-squares or mean), value about 2.5 to 2.6                      2
 Justification of the fitting method                                                                               1
 (b) Ratio changes with cold work because of the n dependence                                                      2
 (c) Scatter interpreted as about ±10% reliability, with a limitation stated                                       1

C2 Hollow balls at 7 km depth                                                                                     [8]

 (a) p = ρgh = 1100 × 9.81 × 7000 = 7.55 × 107 Pa = 75.5 MPa = 10.96 ksi.
 (b) a = 1/8 in, b = 2.5 in, so (a/b)3 = 0.053 = 1.25 × 10−4:
        |σθ| = 3p / [2(1 − (a/b)3)] = 1.5002 p = 113.3 MPa = 16.4 ksi (compressive)
 (c) The pressure alone (10.96 ksi) is below all three yield strengths, which wrongly suggests every ball
 is safe. The cavity is a stress concentrator (factor ≈ 1.5), and the local state at the cavity wall is
 equibiaxial compression: σθ = σφ = −16.4 ksi and σr = 0 (free surface). Tresca: max|σ1 − σ3| = 16.4 ksi.
 Von Mises: σeq = 16.4 ksi. Both give the same value here.
 Ball                           Yield (ksi)                  Equivalent stress (ksi)    Safety factor
              A                               30                        16.4                      1.83
              B                               25                        16.4                      1.52
              C                               17                        16.4                      1.03

 Balls A and B stay elastic. Ball C is only just below yield (safety factor about 1.03), so on these figures it
 does not yield, but it is the critical one. Any imperfection, such as an off-centre or non-spherical cavity,
 or a slightly higher pressure than computed, would push it into yielding first, so C is the ball that would
 deform or fail. (Yielding here begins locally at the cavity wall; whole-ball collapse would need much


MT200 Testing of Materials · Solutions and Marking Scheme                                                       Page 8

 more pressure.)
 (d) Ductility is irrelevant: the question concerns the onset of yielding, and ductility describes what
 happens after yield. UTS is also irrelevant, as none of the balls is near fracture. Young's modulus and
 specific gravity (self-weight, sinking speed, tiny elastic shrinkage) do not enter the stress at the cavity
 wall either.

 Marking scheme                                                                                             Marks
 (a) Pressure computed correctly (MPa and ksi)                                                                  1
 (b) Correct use of the formula and value about 16.4 ksi                                                        2
 (c) State of stress at the cavity wall and the equivalent stress by Tresca or von Mises                        1
 (c) Comparison of all three balls with yield strength (safety factors)                                         1
 (c) Conclusion: C is critical or marginal, with a reasoned statement                                           1
 Explains why pressure alone is misleading (stress concentration at the cavity)                                 1
 (d) Ductility, UTS, E and SG identified as irrelevant with reasons                                             1

C3 Compression data: true and engineering curves                                                               [6]

 A0 = π(15.5)2/4 = 188.7 mm2; h0 = 22.5 mm. Force = kgf × 9.81; σe = F/A0; εe = ΔL/h0. Assuming
 volume constancy (uniform, barrel-free deformation): σT = σe(1 − εe), |εT| = −ln(1 − εe).
 Pt     Load (kgf)      ΔL (mm)       F (N)           σe (MPa)          εe (%)       σT (MPa)      εT (%)
  1          386           0.02           3787              20.1           0.089           20.1       0.089
  2          964           0.04           9457              50.1           0.178           50.0       0.178
  3         1925           0.08          18884              100.1          0.356           99.7       0.356
  4         2885           0.13          28302              150.0          0.578           149.1      0.579
  5         3847           0.18          37739              200.0          0.800           198.4      0.803
  6         4809           0.24          47176              250.0          1.067           247.4      1.072
  7         5670           0.33          55623              294.8          1.467           290.5      1.478
  8         6732           0.75          66041              350.0          3.333           338.3      3.390
  9         7694           1.49          75478              400.0          6.622           373.5      6.852
  10        8656           2.65          84915              450.0          11.778          397.0      12.531

 (c) Plot. Plot σe vs εe and σT vs εT (both in %). The two curves coincide at small strain and separate
 above about 1.5%, with the true curve lying below the engineering one, by about 12% at point 10 (397
 vs 450 MPa), because the area grows in compression. The engineering curve keeps rising, with no
 maximum.
 (d) Yield and hardening. The initial slope is about 26 GPa (this is low for a metal and typically
 includes machine compliance in extensometer-based readings). The 0.2% offset line with E ≈ 26 GPa
 meets the curve between points 6 and 7, so σy ≈ 270 MPa. True plastic strain εp = εT − σT/E: points 7 to
 10 give 0.36%, 2.09%, 5.42%, 11.0%. Fitting ln σT vs ln εp:
        n ≈ 0.09, K ≈ 490 MPa (local exponents between consecutive points: 0.087, 0.104, 0.086)
 Friction check. Friction and barrelling would make the measured load, and hence the computed
 stress, rise above the true value at large strain, so the local n would climb. The local n stays flat at
 about 0.09, so the data show no sign of a friction effect, and the power-law fit holds. (A single-point
 conclusion is limited, since barrelling also means the true area is larger than A0h0/h, so any true stress
 computed this way is a slight overestimate.)




MT200 Testing of Materials · Solutions and Marking Scheme                                                    Page 9

 Marking scheme                                                                                              Marks
 (a) Correct conversion of loads and engineering values (table)                                                  1
 (b) True stress and strain computed with the stated assumption of volume constancy                              1
 (c) Both curves plotted on the same axes, correctly labelled, true below engineering                            1
 (d) Yield about 270 MPa by 0.2% offset (accept 250 to 290)                                                      1
 (d) Power-law fit with plastic strain, n about 0.09 to 0.10 (accept 0.08 to 0.18 if total strain was used       1
 and stated)
 (d) Friction comment based on whether local n rises at large strain                                             1


## SECTION D · BONUS

D1 Brinell vs Vickers on the same scale                                                                         [4]

 Brinell. BHN = 2 × 3000 / [π × 10 × (10 − √(100 − 18.49))] = 6000 / (31.42 × 0.9717) ≈ 196.5
 kgf/mm2. d/D = 0.43, which is inside 0.25 to 0.5, so the test is valid. UTS ≈ 3.45 × 196.5 ≈ 678 MPa.
 Vickers. Mean d = 0.685 mm: HV = 1.8544 × 50/0.6852 ≈ 197.6 kgf/mm2. Using d = 0.69 mm as in
 your notes gives 194.7 kgf/mm2, which is 1910 N/mm2 (=MPa) after multiplying by 9.81.
 The numbers differ in unit convention only. Vickers and Brinell are traditionally quoted in kgf/mm2
 (numerically similar, since both are load per contact area), and multiplying by 9.81 converts to N/mm2
 = MPa. The close agreement (196.5 vs 197.6) reflects the 136° design.

 Marking scheme                                                                                              Marks
 Brinell computed correctly, with the validity check on d/D                                                    1.5
 UTS estimated                                                                                                 0.5
 Vickers computed with the mean diagonal                                                                         1
                        2          2
 Units and the kgf/mm to N/mm conversion explained; agreement of values noted                                    1

D2 Charpy, DBTT, fatigue and creep                                                                              [4]

 Charpy. It measures the energy absorbed by a notched bar at a high strain rate (pendulum, E = mg(h1
 − h2)). The notch produces triaxial constraint and the result depends on notch shape, specimen size
 and temperature, so it is a comparative notch-toughness value, not a material constant like KIC.
 DBTT. In BCC metals, the yield stress rises steeply at low temperature (screw dislocation cores are
 non-planar, so glide has a strong thermal component), while the cleavage stress barely changes. Below
 the temperature where σy exceeds the cleavage stress, fracture is by brittle cleavage. In FCC metals
 the yield stress is only weakly temperature-dependent, so there is no crossover and they remain
 ductile.
 Fatigue. In an S–N curve (stress amplitude vs log N), steels show a horizontal plateau, the endurance
 limit (roughly 106 to 107 cycles); non-ferrous metals have no true limit, so a fatigue strength at a stated
 life (for example, 108 cycles) is quoted. Creep. Primary creep (decreasing rate), secondary (steady,
 minimum rate from a balance of hardening and recovery), tertiary (accelerating rate from necking and
 voids), then rupture. The minimum creep rate governs the strain accumulated over the design life, so it
 is the design parameter.

 Marking scheme                                                                                              Marks
 Charpy: notch, high strain rate, and why it is not fracture toughness                                           1
 DBTT explained by temperature dependence of σy in BCC vs FCC                                                    1
 S–N curve with the endurance limit labelled                                                                     1
 Three stages of creep and why the minimum creep rate is a design parameter                                      1

---

End of solutions.




MT200 Testing of Materials · Solutions and Marking Scheme                                                    Page 10
