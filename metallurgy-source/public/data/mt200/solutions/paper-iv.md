MT200 · TESTING OF MATERIALS
                        Model Solutions and Marking Scheme: Paper IV (Exam Format)
                                   Companion to Practice Paper IV (100 marks)


 Marking conventions
  • Accept any correct method. In numericals, award method marks even if the final number is wrong
     (error carried forward). Deduct 0.5 mark for missing or wrong units, once per question.
  • Curve readings are accepted within about ±3% of the values shown. If a student reads slightly
     differently but reasons correctly from their own reading, award full method marks.
  • In Section D, a correct conclusion with no numbers earns at most half of the marks for that part.

 Section                                                                                               Marks
                                   A · Statement evaluation (10 × 2)                                         20
                                           B · Matching (4 × 5)                                              20
                                  C · Empirical relations (C1 10, C2 10)                                     20
                                      D · Applied problems (5 × 8)                                           40
                                                   Total                                                     100


 HOW TO ATTACK AN APPLIED (Q4-TYPE) PROBLEM
 These problems look hard because the scenario is unfamiliar, but the solution is always the same four
 moves. Practise saying them in this order.
  1. Turn the situation into a strain (or a stress). This is the only creative step. The table below
     gives the usual ways.
  2. Read the curve at that strain. Write the reading down with units (for example, "at 0.40% the
     shaft carries about 330 MPa").
  3. Compare with the landmarks of the curve. Where does the curve first bend (yield)? Where
     does it end (fracture)? For a brittle material only the fracture strain matters. For a ductile one,
     yielding is allowed but fracture is not.
  4. Conclude in one sentence with the numbers. "The ring must stretch 0.40%, but it fractures at
     0.32%, so it cracks."

 Situation                            Strain or stress to compute                                 Used in
 Press or shrink fit                  $\varepsilon = \dfrac{\text{difference in diameters}}{\text{original diameter}}$                  D1
 Wire or sheet bent around a
                                      $\varepsilon_{\max} = \dfrac{t/2}{R_n}$          D2
 radius
 Rolling, forging, drawing            $e = \dfrac{h_0-h}{h_0}, \quad \varepsilon_T = \ln\left(\dfrac{h_0}{h}\right)$                              D3
 Bolt tightened by turning the nut    $\varepsilon = \dfrac{N p}{L_g}$                         D4
 Rod held rigid while heated          $\varepsilon = \alpha\Delta T$                                                     (extra practice)
 Hanging or lifting a load            $\sigma = \dfrac{W}{A}$ (stress, not strain)                                (extra practice)
 Deep water or fluid pressure         $\sigma = p = \rho g h$ (then consider stress concentration)            Aug 2026 quiz Q2

 Traps that cost marks. (1) Comparing a strain with a stress. (2) Forgetting where the curve ends. (3) Using
 engineering values after necking. (4) Mixing ksi, MPa and kgf/mm2 ($1\,\mathrm{ksi}=6.895\,\mathrm{MPa}$, $1\,\mathrm{kgf/mm^2}=9.81\,\mathrm{MPa}$). (5)
 Stopping after the reading without deciding. (6) Not stating an assumption. Assumption to state in press-fit
 problems: each part is taken to absorb the whole diametral mismatch separately, which is the simple, conservative
 method used at this level. A stricter analysis lets the two parts share the mismatch according to their stiffness and
 geometry (Lamé), which lowers each strain.


## SECTION A · STATEMENT EVALUATION (2 marks per set, no partial credit)




MT200 Testing of Materials · Paper IV Solutions and Marking Scheme                                                 Page 1

 Set        Ans.         Reasoning (the false statements are in bold)
   A1          (1)       A true: E is set by bonding. B true. C true: $\varepsilon=C\sigma$ with $C=1/E$, in $\mathrm{m^2/N}$. D false: elastic
                         deformation is bond stretching with no dislocation glide; glide is what makes deformation
                         plastic.
   A2          (2)       A true: $\sigma_T=\sigma_e(1+e)$. B true: $\ln(1+e)$ < e. C true: after the UTS the area loss outweighs
                         hardening for the engineering curve only. D false: valid only up to necking.
   A3          (1)       A true. B true: U = $\dfrac{\sigma_y^2}{2E}$, so a lower E gives more. C false: a strong but brittle ceramic has
                         tiny toughness; toughness needs strength and ductility. D true: $\mathrm{J/m^3}$ = $\mathrm{N\cdot m/m^3}$ = $\mathrm{Pa}$$. 
   A4          (1)       A true. B false: slender specimens buckle; a short cylinder (d : h ≈ 2 : 3) is used. C false: no
                         necking in compression; stress keeps rising as the area grows. D true: hoop tension on the
                         bulged surface.
   A5          (2)       A false: hardness is a response that depends on strength, ductility, hardening and the test
                         used, so it is not fundamental. B true. C false: metals crowd into 4 to 6 on Mohs. D true.
   A6          (1)       A false: Brinell uses the curved (spherical cap) surface area. B true: similar impressions. C
                         true: reversed depth scale. D true.
   A7          (2)       A true. B true. C false: annealing above the recrystallisation temperature removes the
                         cold-work strengthening. D true.
   A8          (1)       A true: ductile-to-brittle transition of BCC steels. B true: FCC has no transition. C true. D false:
                         a notch raises the triaxiality and promotes brittle fracture.
   A9          (1)       A true: 6.895. B true: 200 × 9.81 = 1962 MPa$.  C true. D false: the two differ by a factor of
                         9.81.
  A10          (1)       A true. B false: %EL depends on the gauge length because the neck is localised. C true. D
                         false: %RA is measured at the neck and is independent of the gauge length.
 Tip for this format: mark each statement T or F first, then pick the choice that matches your pattern. Look for
 absolute words ("always", "independent", "only"), which are usually the trap, and for a swapped cause and effect.


## SECTION B · MATCHING (1 mark per correct pair)
 Set                 a                       b                   c                      d                     e
                                    1/2                   3                                           −1
    B1 · units            (ii) $\mathrm{MPa}\cdot\mathrm{m}^{1/2}$               (v) J/m               (iv) MPa             (iii) $\mathrm{Pa}$                  (i) J
                                                                                            (iv) energy to
   B2 · terms        (ii) compression            (i) tension      (iii) elastic slope                           (v) little plasticity
                                                                                                 yield
                                                                     (v) 120° cone,          (i) rhombic
    B3 · tests           (iii) 10 mm ball    (ii) 136° pyramid                                                     (iv) rebound
                                                                         150 kgf               diamond
                                                                                            (v) 150 to 170        (iv) 0.01 to 0.1
  B4 · modulus             (ii) 70 $\mathrm{GPa}$           (i) 200 $\mathrm{GPa}$           (iii) 300 $\mathrm{GPa}$
                                                                                                 $\mathrm{GPa}$                    $\mathrm{GPa}$

 Unit drill (this is where matching questions are usually lost). Work each unit out from its
 definition instead of memorising it:
 Quantity                        Definition                      SI unit                    Note
 Stress, strength,                                                                          $1\,\mathrm{ksi}=6.895\,\mathrm{MPa}$; 1 kgf/mm2 =
                                 force / area                    N/m2 = $\mathrm{Pa}$
 modulus, hardness                                                                          9.81 MPa
 Strain                          length / length                 m/m (no unit)              often quoted in %
                                                                  2             −1
 Compliance                      1/E                             m /N = $\mathrm{Pa}$                  large for flexible materials
                                 energy / volume =
 Toughness, resilience                                           $\mathrm{J/m^3}$ = $\mathrm{Pa}$                  same dimensions as stress
                                 (N·m)/m3
 Charpy (impact) energy          energy                          N·m = J                    per unit area it would be J/m2
 Strain rate                     (m/m) / s                       $\mathrm{s^{-1}}$                        written m/m/s in the midsem
                                                                          1/2
 Fracture toughness              stress × √length                $\mathrm{MPa}\cdot\mathrm{m}^{1/2}$                      not the same as toughness
               n
 K in σ = Kε                     ε and n are dimensionless       MPa                        n has no unit
 Poisson's ratio, Meyer's
                                 ratios or exponents             none
 index m, n




MT200 Testing of Materials · Paper IV Solutions and Marking Scheme                                                              Page 2

 Marking scheme                                                                                      Marks
 B1: five correct pairs (1 mark each)                                                                       5

 Marking scheme                                                                                      Marks
 B2: five correct pairs                                                                                     5

 Marking scheme                                                                                      Marks
 B3: five correct pairs                                                                                     5

 Marking scheme                                                                                      Marks
 B4: five correct pairs                                                                                     5


## SECTION C · EMPIRICAL RELATIONS FROM DATA

C1 Tensile strength versus BHN for steels                                                                 [10]

 Method. Convert every hardness to BHN using the table (linear interpolation where the reading lies
 between rows), convert ksi to MPa (× 6.895), and divide.
 No.                  UTS (ksi)           UTS (MPa)            Hardness       BHN          UTS/BHN
         1                    58                  400                HRB 68         120           3.33
         2                    75                  517                HRB 80         146           3.55
         3                    91                  627                HRB 90         180           3.49
         4                   108                  745                HRB 97         220           3.38
         5                   126                  869                HRC 25         253           3.43
         6                   141                  972                HRC 30         286           3.40
         7                   178                 1227                HRC 38         353           3.47
         8                   208                 1434                HRC 45         421           3.41

 Examples of interpolation: HRB 80 lies between HRB 78 (140) and 85 (160), so BHN = 140 + (2/7)(20) =
 145.7. HRC 38 lies between HRC 35 (327) and 40 (371), so BHN = 327 + (3/5)(44) = 353.4.




        k (least squares through the origin) = ΣBHN·UTS / ΣBHN2 = 3.43; mean of the ratios = 3.43
        UTS (MPa) ≈ 3.4 × BHN (the classic value is 3.45)
 Estimate for HRC 33. BHN = 286 + (3/5)(41) = 311. UTS ≈ 3.43 × 311 = 1065 MPa (about 154 ksi).
 Range and limits. The data cover BHN of about 120 to 420 (HRB 68 to HRC 45), that is UTS of about
 400 to 1450 MPa, so the relation should be trusted only inside that range. It cannot be extended to
 every metal because hardness is set by the flow stress at a representative strain of about 8%, while the
 UTS depends on how much the metal hardens beyond that. So the factor changes with the
 strain-hardening behaviour, and aluminium or copper alloys (see C2) and heavily cold-worked metals
 give different factors. It is also unreliable for very hard steels (above about HRC 50), where the indenter


MT200 Testing of Materials · Paper IV Solutions and Marking Scheme                                       Page 3

 and the cracking of the material distort the reading.

 Marking scheme                                                                                           Marks
 (a) Correct BHN for all 8 grades (interpolation shown for at least one)                                         2
 (a) ksi to MPa                                                                                                  1
 (b) Ratios UTS/BHN computed                                                                                     1
 (b) Plot with the best line through the origin                                                                  2
 (c) k between 3.3 and 3.6, with the relation written                                                            1
 (c) HRC 33 converted to BHN and UTS estimated (about 1065 MPa)                                                  1
 (d) Range of validity stated                                                                                    1
 (d) Reason it does not extend to all metals (strain hardening)                                                  1

C2 Tensile strength versus Vickers hardness for aluminium alloys                                                [10]

 HV               30             45               60            85          100         125         150
   UTS (MPa)           110            165              225           315          370         460         545
      UTS/HV           3.67           3.67             3.75          3.71     3.70        3.68        3.63




 (a) Through the origin: k = 3.67, so UTS ≈ 3.67 × HV. With an intercept the best line is UTS = 3.64 HV
 + 3.7. The intercept is only 3.7 MPa, which is under 4% of the smallest UTS (110 MPa), so it does not
 matter and the simpler line through the origin is preferred (zero hardness should mean zero strength).
 (b) H (MPa) = 9.81 × HV, so UTS = (3.67/9.81) H = 0.374 H, that is H ≈ 2.7 × UTS. This is a little
 below the constraint factor of about 3 because H is about 3 times the flow stress at 8% strain, and for
 these alloys the UTS lies a little above that flow stress.
 (c) The steel factor was about 3.43 (with BHN) and the aluminium factor is about 3.67 (with HV). The
 difference is modest but real. One physical reason: UTS/H depends on strain hardening, that is, on how
 far the UTS lies above the flow stress at about 8% strain that the hardness measures. (Another valid
 reason is that HV and BHN are not identical scales.) A single factor should never be transferred between
 alloy families.
 (d) UTS ≈ 3.67 × 110 = 404 MPa$.  The point lies inside the data range (HV 30 to 150), and the ratios
 vary only between 3.63 and 3.75, so the prediction is good to about ±2 to 3%, that is, about 400 to 412
 MPa$. 

 Marking scheme                                                                                           Marks
 (a) Ratios computed, line through the origin (k ≈ 3.67)                                                         2
 (a) Line with intercept and the comment                                                                         2
 (b) Conversion to MPa, c ≈ 0.374, 1/c ≈ 2.7 and comparison with 3                                               3
 (c) Comparison with steels and one valid reason                                                                 2
 (d) Prediction about 404 MPa with a confidence statement                                                        1




MT200 Testing of Materials · Paper IV Solutions and Marking Scheme                                          Page 4

## SECTION D · APPLIED STRESS–STRAIN PROBLEMS

D1 Ring on a shaft                                                                                                      [8]

 (a) Strains. Ring (bore stretched, tension): $\varepsilon = \dfrac{50.20-50.00}{50.00}=0.40\\%$. Shaft (squeezed,
 compression; the curve is taken as the same in compression): ε = 0.20/50.20 = 0.40%.
 (b) Reading. The ring curve ends (fracture) at 0.32%, at about 385 MPa$.  The ring must stretch to
 0.40%, which is beyond that, so the ring cracks. It is brittle, so it has no plastic strain to spare. The
 shaft at 0.40% carries about 330 MPa$.  It has passed its yield (300 MPa at 0.15%), so it deforms
 plastically, but its curve continues past 1%, so it is nowhere near fracture. Conclusion: the ring fails,
 the shaft survives (with slight yielding).
 (c) Shrink fit. Bore needed = 50.20 + 0.04 = 50.24 mm, so the strain is 0.24/50.00 = 0.48%. ΔT =
                  −6
 0.0048/(11 × 10 ) = 436 K, that is, heat the ring to about 456 °C (from 20 °C). Because the ring is
 free to expand, it takes no stress. This is why shrink fits work with brittle rings.
 (d) Cooling the shaft. Contraction = 12 × 10−6 × 216 × 50.20 = 0.130 mm, but 0.24 mm is needed.
 So no, cooling alone is not enough. A combination works: with the shaft cooled, the ring needs to supply
 only 0.24 − 0.130 = 0.110 mm, which needs ΔT = 0.110/(50 × 11 × 10−6) ≈ 200 K.
 Note on the method: the simple check gives each part the whole mismatch. A stricter Lamé analysis shares it, which
 lowers the ring's strain, but the conclusion for a very brittle ring at 0.40% against 0.32% is still that it is at serious
 risk, and the marking scheme follows the simple method.

 Marking scheme                                                                                                    Marks
 (a) Both strains 0.40% (with the correct base diameter)                                                                 2
 (b) Ring: fracture strain 0.32% is below 0.40%, so it cracks                                                          1.5
 (b) Shaft: about 330 MPa, yielded but not fractured                                                                   1.5
 (c) ΔT ≈ 436 K with the required bore 50.24 mm                                                                          2
 (d) Contraction 0.130 mm is less than 0.24 mm, so no                                                                    1

D2 Wire on a mandrel                                                                                                    [8]

 (a) Radius of the wire's neutral axis: $R_c=40/2+2/2=21\\,\mathrm{mm}$. Outer-fibre strain: $\varepsilon=(d/2)/R_c=1/21=
 4.76%.
 (b) Between 4% (1200 MPa) and 6% (1270 MPa): σ ≈ 1227 MPa$.  The elastic limit is about 900 MPa (at
 0.45%), and the wire fractures at 9%, so the wire has yielded but not fractured.
 (c) Elastic recovery = 1227/200,000 = 0.61%, so the permanent strain is 4.76 − 0.61 = 4.15%. This is
 why a bent wire springs back a little but keeps most of its new shape.
 (d) Fracture at ε = 9%: $R_c=1/0.09$ = 11.1 mm, so the mandrel radius is 10.1 mm, and the smallest
 mandrel diameter is 20.2 mm (about 10 wire diameters).
 (e) Fully elastic needs ε ≤ 0.45%: $R_c=1/0.0045$ = 222 mm, so the mandrel radius is 221 mm and the
 diameter is 442 mm (about 220 wire diameters). So elastic bending needs a very large radius. In other
 words, forming a wire into a tight coil always plastically deforms it. A coil spring works elastically
 because its wire is stressed in torsion, not because the wire was never bent, and only the thinnest wires
 can be bent elastically to small radii.

 Marking scheme                                                                                                    Marks
 (a) Rc = 21 mm and ε = 4.76%                                                                                            2
 (b) σ ≈ 1230 MPa read correctly, with the decision that it yielded but did not fracture                                 2
 (c) Springback 0.61% and permanent strain 4.15%                                                                         1
 (d) Smallest mandrel about 20.2 mm                                                                                      1
 (e) About 442 mm and the meaning of the result                                                                          2

D3 Cold rolling                                                                                                         [8]

 (a) Reduction = $(5.0-3.2)/5.0=36\\%$. True strain $\\varepsilon=\\ln(5.0/3.2)=0.446$.
 (b) $n=\\dfrac{\\ln(646/426)}{\\ln(0.40/0.10)}=0.30$. $K=426/0.10^{0.30}=850\\,\\mathrm{MPa}$.


MT200 Testing of Materials · Paper IV Solutions and Marking Scheme                                                    Page 5

 (c) The strip has been strained to $\\varepsilon=0.446$, so on reloading it starts to flow at about the stress it
 reached: $\sigma=850\times0.446^{0.30}$ = 667 MPa$. 
 (d) Necking begins where $\dfrac{d\sigma}{d\varepsilon}=\sigma$. For the power law, $\dfrac{d\sigma}{d\varepsilon}=\dfrac{n\sigma}{\varepsilon}$ = 0.30 × 667/0.446 = 449 MPa,
 which is less than σ = 667 MPa$.  So the necking condition is already satisfied at the moment of
 yielding: the strip has no uniform elongation and necks straight away. Equivalent statement: the
 prior strain (0.446) is larger than n (0.30).
                                   n
 (e) Annealed: UTS = K(n/e) = 439 MPa, so BHN ≈ 439/3.45 = 127. Rolled: UTS ≈ yield ≈ 667 MPa, so
 BHN ≈ 193. Rolling raises the hardness by about 50%.
                                                                            −0.30
 (f) Some uniform ductility remains only if $\varepsilon<n=0.30$: $h/h_0=e^{-0.30}=0.741$, so the largest reduction
 is 26%. Above this, further rolling leaves the strip with no uniform elongation.

 Marking scheme                                                                                             Marks
 (a) 36% and 0.446                                                                                              1
 (b) n = 0.30 and K = 850 MPa                                                                                   1
 (c) Flow stress ≈ 667 MPa as the yield strength                                                                2
 (d) Considère check: dσ/dε below σ, so no uniform elongation (or prior strain greater than n)                  2
 (e) BHN ≈ 127 and ≈ 193                                                                                        1
 (f) About 26%                                                                                                  1

D4 Tightening a bolt by turns                                                                                  [8]

 (a) A quarter turn advances the nut 1.75/4 = 0.4375 mm. Strain = 0.4375/50 = 0.875%.
 (b) Between 0.8% (1000 MPa) and 1.0% (1030 MPa): σ ≈ 1011 MPa$.  Preload F = $\sigma A=1011\times84.3$ =
 85.2 kN.
 (c) The elastic limit is about 900 MPa (0.45%), so the bolt is in the plastic range. Its fracture strain is
 9%, so it will not fracture.
 (d) At 120° the advance is 1.75/3 = 0.5833 mm, so ε = 1.17% and σ ≈ 1042 MPa, giving F = 87.8 kN,
 which is only +3.0% (a 33% larger turn). If the bolt stayed perfectly elastic, force would be proportional
 to strain, and a 33% larger turn would give +33%. In the plastic range the curve is nearly flat, so the
 preload is insensitive to how far the nut is turned, and errors from friction, thread condition and turning
 accuracy hardly change it. That is why torque-turn and yield-controlled tightening are used: they reach
 close to the full strength of the bolt with a small scatter in preload.
 (e) Fracture strain 9%: stretch = 0.09 × 50 = 4.5 mm, so turns = 4.5/1.75 = 2.57 turns. (This is an
 idealised upper bound. A real bolt necks in the threads long before, so the practical margin is smaller.)

 Marking scheme                                                                                             Marks
 (a) 0.4375 mm and 0.875%                                                                                       2
 (b) σ ≈ 1011 MPa and F ≈ 85.2 kN                                                                               2
 (c) Plastic range, no fracture                                                                                 1
 (d) F ≈ 87.8 kN (+3.0%) against +33% for an elastic bolt, with the explanation                                 2
 (e) About 2.6 turns                                                                                            1

D5 Choosing a material from its curve                                                                          [8]

                                                           Fracture strain     Resilience        Toughness
        E ($\mathrm{GPa}$)        Yield (MPa)        UTS (MPa)
                                                           (%)                 (MJ/m³)           (MJ/m³)
  A         200             1800               2000                   6              8.10            106.7
  B         200              300               450                   30              0.23            119.3
  C         375         none (brittle)         300                   0.08            0.12             0.1
  D          69              250               380                   20              0.45             68.1

 Method. E is read from the zoom: for A, 1800/0.009 = 200 $\mathrm{GPa}$; for B, 300/0.0015 = 200 $\mathrm{GPa}$; for C,
 300/0.0008 = 375 $\mathrm{GPa}$; for D, 250/0.0036 = 69 $\mathrm{GPa}$$.  Resilience = $\dfrac{\sigma_y^2}{2E}$ (for the brittle C, σf2/2E).
 Toughness is found with trapezoids between the vertices. For example, for A: 0.5(0.009)(1800) +



MT200 Testing of Materials · Paper IV Solutions and Marking Scheme                                           Page 6

 ½(1800 + 1950)(0.021) + ½(1950 + 2000)(0.030) ≈ 8.1 + 39.4 + 59.3 ≈ 107 $\mathrm{MJ/m^3}$.
 (c) Choices. (i) Spring: A. Its resilience is 8.1 $\mathrm{MJ/m^3}$, about 18 times that of the next best, because
 the yield strength is very high while E is unchanged. (ii) Crane hook: B. It has the highest toughness
                  3
 (about 119 MJ/m ), a fracture strain of 30% and a clear yield plateau at 300 MPa, so it deforms visibly
 and gives warning before it fails. A is stronger but has only 6% ductility. (iii) Cutting-tool insert: C. It
 has the highest stiffness (375 $\mathrm{GPa}$) and, as a ceramic, high hardness and wear resistance. Its brittleness
 is tolerable because it is loaded mostly in compression and held rigidly.

 Marking scheme                                                                                       Marks
 (a) E, yield, UTS and fracture strain for all four (0.75 each)                                            3
 (b) Resilience for all four                                                                              1.5
 (b) Toughness by trapezoids for all four                                                                 1.5
 (c) Spring: A, hook: B, insert: C, each with a reason                                                     2

---

End of solutions.




MT200 Testing of Materials · Paper IV Solutions and Marking Scheme                                      Page 7
