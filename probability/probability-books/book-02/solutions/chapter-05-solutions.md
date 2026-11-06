# Chapter 5: Continuous Random Variables — Detailed Solutions

**Book:** Introduction to Probability, Second Edition  
**Authors:** Joseph K. Blitzstein and Jessica Hwang

> Source transcription from the supplied chapter-solution PDF. The solution numbering and worked reasoning are retained. Mathematical notation should be checked against the original source if a character appears ambiguous.

```text
INTRODUCTION TO PROBABILITY


                            Detailed Solutions
               Chapter 5 – Continuous Random Variables


                       Complete worked solutions to Exercises 1–62




Scope. Solutions follow the exercise section in the uploaded Chapter 5 PDF. They use the chapter’s
PDF/CDF, Uniform, Normal, and Exponential notation, with LOTUS and conditioning where appropriate.
Numerical values are approximations. In Exercise 54(b), the requested empirical percentage cannot be
calculated because no country-population dataset is included in the supplied material.


Introduction to Probability                   Chapter 5: Continuous Random Variables


Contents
PDFs and CDFs                                                                     2

Uniform and universality of the Uniform                                           3

Normal                                                                            5

Exponential                                                                       8

Mixed practice                                                                   11




                                          1


Introduction to Probability                                                                 Chapter 5: Continuous Random Variables


PDFs and CDFs
Exercise 1
                                              2
The Rayleigh CDF is F (x) = 1 − e−x /2 for x > 0. Therefore

                                        P(1 < X < 3) = F (3) − F (1) = e−1/2 − e−9/2 .

                                    2
The j/4 quantile solves 1 − e−qj /2 = j/4, so
                                                         p
                                                  qj =       −2 log(1 − j/4),        j = 1, 2, 3.
                      p                           √                         √
In particular, q1 =       −2 log(3/4), q2 =           2 log 2, and q3 =          2 log 4.


Exercise 2
(a) For example, a waiting time uniformly distributed over an interval of length 1/2 has density f (x) = 2 on that
interval, which is greater than 1. This is a valid density because its area is 1.
                                                                 R              R
(b) If f (x) > 1 throughout an interval I of length L, then 1 = R f (x) dx ≥ I f (x) dx > L. Thus L < 1.


Exercise 3
(a) Since F ′ = f ,
                                                                                    d
                                                    g(x) = 2F (x)f (x) =              F (x)2 .
                                                                                   dx
It is nonnegative, and its integral is F (∞)2 − F (−∞)2 = 1. Hence it is a valid PDF.
(b) The function f (−x) is the density of −X and integrates to 1 by substitution. The function f (x) also integrates
to 1. Their equal-weight mixture h(x) = 21 f (−x) + 12 f (x) is therefore nonnegative and integrates to 1.


Exercise 4
For c with P(X > c) = 1 − F (c) > 0, conditioning gives
                                                               
                                                               0,
                                                                               x ≤ c,
                                FX|X>c (x) = P(X ≤ x | X > c) = F (x) − F (c)
                                                                             , x > c.
                                                                   1 − F (c)
                                                               

Differentiating,
                                                                        f (x)
                                                    fX|X>c (x) =                I(x > c).
                                                                      1 − F (c)
                          R∞
It is nonnegative and      c
                               f (x)/(1 − F (c)) dx = [1 − F (c)]/[1 − F (c)] = 1, so it is a valid PDF.


Exercise 5
Let A = πR2 , where R ∼ Unif(0, 1). (a) By LOTUS,
                                                         Z 1
                                                                           π                              π2
                               EA = πE(R2 ) = π                  r2 dr =     ,       EA2 = π 2 E(R4 ) =      .
                                                             0             3                              5

Thus Var(A) = π 2 (1/5 − 1/9) = 4π 2 /45.
(b) For 0 ≤ a ≤ π,                                                  p
                                                                p
                                                  FA (a) = P R ≤ a/π = a/π.
                                        p                                                              √
The complete CDF is 0 for a < 0,            a/π for 0 ≤ a ≤ π, and 1 for a ≥ π. Therefore fA (a) = 1/(2 πa),           0 < a < π,
and zero elsewhere.



                                                                       2


Introduction to Probability                                                               Chapter 5: Continuous Random Variables


Exercise 6
The probabilities below are for the central interval [µ − kσ, µ + kσ], for k = 1, 2, 3.
                                               √
(a) Uniform(0, √1). Here µ = 1/2 and σ = 1/ 12. The one-standard-deviation interval lies inside (0, 1) and has
length 2σ = 1/ 3. The two- and three-standard-deviation intervals cover the whole support. Thus
                                      √
                   P(|X − µ| ≤ σ) = 1/ 3 ≈ 0.5774,                 P(|X − µ| ≤ 2σ) = P(|X − µ| ≤ 3σ) = 1.

(b) Expo(1). Mean and standard deviation are both 1. The central intervals truncate at zero, so their probabilities
are P(0 ≤ X ≤ 1+k) = 1−e−(1+k) . Hence the three values are 1 − e−2 ≈ 0.8647,                        1 − e−3 ≈ 0.9502,   1 − e−4 ≈ 0.9817.
(c) Expo(1/2). Here µ = σ = 2. The k-standard-deviation interval truncates to [0, 2(1 + k)], so the same three
probabilities result. In fact this rule applies to every Expo(λ): its mean and standard deviation are both 1/λ,
making the upper endpoint (1 + k)/λ, and the probability is always 1 − e−(1+k) . The standardised probabilities do
not depend on the rate, although the exponential distribution is not symmetric.


Exercise 7
                                √
On (0, 1), F (x) = (2/π) sin−1 ( x) is increasing, with limits 0 and 1 at the endpoints; extended by 0 and 1 outside
this interval it is a valid CDF. Differentiating,

                                                               1
                                            f (x) =       p                ,   0 < x < 1,
                                                      π       x(1 − x)

and zero elsewhere. The density diverges at the endpoints, but these are integrable singularities: the area under
the density is still F (1) − F (0) = 1. A PDF need not be bounded by 1.


Exercise 8
(a) Integrating 12x2 (1 − x),
                                                   
                                                   0,
                                                             x ≤ 0,
                                                        3  4
                                            F (x) = 4x − 3x , 0 < x < 1,
                                                   
                                                     1,       x ≥ 1.
                                                   


(b) P(0 < X < 1/2) = 4(1/2)3 − 3(1/2)4 = 5/16.
(c)
                                    Z 1                                              Z 1
                                                               3                                             2
                          EX = 12         (x3 − x4 ) dx =        ,       EX 2 = 12         (x4 − x5 ) dx =     .
                                     0                         5                      0                      5

Thus Var(X) = 2/5 − (3/5)2 = 1/25.


Exercise 9
Integrating the Cauchy density,
                                          Z x
                                                  dt        1  1
                                F (x) =                2)
                                                          =   + arctan x ,                       x ∈ R.
                                           −∞ π(1 +  t      2  π


Uniform and universality of the Uniform
Exercise 10
(a) A uniform point in (0, 8) lands in (0, 2)∪(3, 7) with probability equal to total length divided by 8: (2 + 4)/8 = 3/4.

(b) Conditioning on 3 < U < 7 restricts the uniform distribution to that interval, so U | (3 < U < 7) ∼ Unif(3, 7).




                                                                     3


Introduction to Probability                                                             Chapter 5: Continuous Random Variables


Exercise 11
(a) For U ∼ Unif(−1, 1), symmetry gives EU = 0, and
                                                   Z 1                                       Z 1
                                               1                    1                    1                   1
                          Var(U ) = EU 2 =               u2 du =      ,        EU 4 =              u4 du =     .
                                               2    −1              3                    2    −1             5

(b) Let V = U 2 . For 0 < v < 1,
                                                                  √
                                                   √       √     2 v √
                                       FV (v) = P(− v < U < v) =    = v.
                                                                  2
                             √                                                           √
Thus FV (v) = 0 for v ≤ 0, v for 0 < v < 1, and 1 for v ≥ 1. Its density is fV (v) = 1/(2 v),                      0 < v < 1. This
is not uniform on (0, 1): its density is larger near zero.


Exercise 12
Let the break point be U ∼ Unif(0, 1) and let L = max(U, 1 − U ). Its support is [1/2, 1]. For 1/2 ≤ x ≤ 1,

                                         FL (x) = P(1 − x ≤ U ≤ x) = 2x − 1.

Thus FL (x) = 0 for x < 1/2, 2x − 1 on [1/2, 1], and 1 for x > 1. The PDF is 2 on (1/2, 1), so L ∼ Unif(1/2, 1) and
 EL = 3/4.


Exercise 13
Let B be the break point. The shorter piece is X = min(B, 1 − B) ∈ (0, 1/2) and the longer piece is Y = 1 − X.
For 0 ≤ r ≤ 1,
                                              X                 r
                                        R=      ≤ r ⇐⇒ X ≤          .
                                              Y               1+r
Since P(X ≤ x) = 2x for 0 ≤ x ≤ 1/2,

                                                2r                           2
                                   FR (r) =        ,         fR (r) =              ,    0 < r < 1.
                                               1+r                        (1 + r)2

The mean is                                          Z 1
                                                                r
                                         ER = 2                       dr = 2 log 2 − 1.
                                                         0   (1 + r)2
But                                                           Z 1
                                                                        1
                                          E(1/R) = 2                          dr = ∞,
                                                               0    r(1 + r)2
because the integrand behaves like 2/r near zero. Thus ER = 2 log 2 − 1,                       E(1/R) = ∞.


Exercise 14
For X = max(U1 , . . . , Un ) and 0 < x < 1,

                              FX (x) = P(U1 ≤ x, . . . , Un ≤ x) = xn ,                fX (x) = nxn−1 .
                  Z 1
                                        n
Therefore EX =          x nxn−1 dx =       .
                    0                  n+1


Exercise 15
If U ∼ Unif(0, 1), then X = − log U/λ has, for x ≥ 0,

                                        P(X ≤ x) = P(U ≥ e−λx ) = 1 − e−λx .

          1
Thus X = − log U ∼ Expo(λ).
          λ

                                                                    4


Introduction to Probability                                                                Chapter 5: Continuous Random Variables


Exercise 16
                                                                     Z 1       2
                                                                              u   2
(a) Since U is uniform, an integral for the second moment is E(X ) =     log         du.
                                                                      0      1−u
(b) The transformation u 7→ 1 − u changes log(u/(1 − u)) to its negative. Since U and 1 − U have the same
distribution, X and −X have the same distribution. Its mean exists by the finite second moment and symmetry,
so EX = 0.


Exercise 17
The inverse-CDF construction gives X = − log(1 − U ) . Indeed, for x > 0, P(X ≤ x) = P(U ≤ 1 − e−x ) = 1 − e−x ,
and the CDF is zero for x ≤ 0. Thus X ∼ Expo(1).


Exercise 18
(a) Integrating the Pareto density,
                                                             (
                                                                 0,           x < 1,
                                                   F (x) =
                                                                 1 − x−a ,    x ≥ 1.

It is nondecreasing and right-continuous, with limits 0 and 1; the PDF is nonnegative and integrates to 1.
(b) Solve U = 1 − X −a for X. If U ∼ Unif(0, 1), then X = (1 − U )−1/a has the Pareto(a) distribution.
Independent Uniform draws give independent Pareto draws by applying this transformation separately.


Normal
Exercise 19
If Z ∼ N (0, 1), then Y = 1 + 2Z is Normal with mean 1 and variance 22 = 4: Y = 1 + 2Z ∼ N (1, 4).


Exercise 20
                                                                                  √
(a) Starting from the standard Normal CDF and substituting t =                        2u,
                                                                              √
                           1   1
                                      Z z
                                               2             1   1
                                                                         Z z/ 2
                                                                                       2         1 1      √
                  Φ(z) =     +√             e−t /2 dt =        +√                 e−u du =        + erf(z/ 2).
                           2    2π     0                     2    π       0                      2 2
                       2
(b) The integrand e−x is even, so changing the lower and upper limits shows erf(−z) = − erf(z).


Exercise 21
                                                                 2
For the standard Normal density ϕ(x) = (2π)−1/2 e−x /2 ,

                                      ϕ′ (x) = −xϕ(x),               ϕ′′ (x) = (x2 − 1)ϕ(x).

Since ϕ(x) > 0, the second derivative changes sign at x = ±1. Thus the inflection points are −1, 1 . A location-scale
transform Y = µ + σZ maps them to µ − σ, µ + σ.


Exercise 22
The measurement error has variance 0.04, so its standard deviation is 0.2 m. Being within 0.4 m is the event
|ϵ| < 2(0.2). Hence
                            P(|ϵ| < 0.4) = Φ(2) − Φ(−2) = 2Φ(2) − 1 ≈ 0.9545.




                                                                     5


Introduction to Probability                                                 Chapter 5: Continuous Random Variables


Exercise 23
Let the noise be N ∼ N (0, σ 2 ). If Alice sends 1, Bob is correct when 1 + N > 1/2, i.e. N > −1/2, with probability
Φ(1/(2σ)). If Alice sends 0, Bob is correct when N ≤ 1/2, with the same probability. Therefore
                                                                  
                                                                    1
                                                 P(correct) = Φ        .
                                                                   2σ

As σ → 0, this tends to 1; as σ → ∞, it tends to 1/2. Small noise rarely changes the encoded bit, while very large
noise overwhelms the signal.


Exercise 24
A continuous Normal variable assigns probability zero to every single point. Therefore P(T = 0) = 0. Being
centred at the due date does not give positive probability to that exact instant.


Exercise 25
Using the convention N (mean, variance), independence gives X − Y ∼ N (a − c, b + d). Hence
                                                                       
                                                                  c−a
                                 P(X < Y ) = P(X − Y < 0) = Φ √           .
                                                                   b+d

If X, Y are i.i.d., this becomes Φ(0) = 1/2, as symmetry requires.


Exercise 26
Let W and C denote Walter’s and Carl’s travel times. They are independent with W ∼ N (w, σ 2 ) and C ∼ N (c, 4σ 2 ).
(a) W − C ∼ N (w − c, 5σ 2 ), so Carl arrives first when W − C > 0:
                                                                 
                                                             w−c
                                             P(C < W ) = Φ √        .
                                                               5σ

(b) This probability exceeds 1/2 exactly when its Normal argument is positive, which is equivalent to c < w.
(c) Walter is on time with probability Φ(10/σ). Carl is on time with probability Φ((w + 10 − c)/(2σ)). Since Φ is
increasing, Carl is more likely to be on time iff
                                       w + 10 − c   10
                                                  >    ⇐⇒ c < w − 10.
                                          2σ        σ

Exercise 27
The standard Normal density is symmetric and strictly decreases as |z| increases away from 0. Among intervals of
a fixed length, the interval centred at zero therefore captures the greatest area under the density. The interval
(−1, 1) is centred at zero and has length 2. Any interval shorter than 2 has strictly less probability than (−1, 1),
even when optimally centred. So no such shorter interval can have probability at least 68%.


Exercise 28
The stated result says P(|Y − µ| < 1.96σ) ≈ 0.95. Rearranging the event,
                                           Y − 1.96σ < µ < Y + 1.96σ.

Thus an approximately 95% confidence interval is (a(Y ), b(Y )) = (Y − 1.96σ, Y + 1.96σ).


Exercise 29
(a) If Y = |X|, then for y < 0, FY (y) = 0. For y ≥ 0,
                                                                                          
                                                                 y−µ                −y − µ
                              FY (y) = P(−y ≤ X ≤ y) = Φ                   −Φ                    .
                                                                  σ                   σ


                                                         6


Introduction to Probability                                               Chapter 5: Continuous Random Variables


This is the CDF everywhere when combined with the zero branch for y < 0.
(b) Differentiating for y > 0,
                                                             
                                            1     y−µ        y+µ
                                   fY (y) =    ϕ        +ϕ          ,        y > 0,
                                            σ      σ          σ

and fY (y) = 0 for y < 0.
(c) The right-hand limit at zero is 2ϕ(µ/σ)/σ, while the left-hand density is zero, so the displayed version of the
PDF is discontinuous at zero. This is not a problem: changing a density at a single point does not change any
probability, since probabilities are integrals.


Exercise 30
Conditional on S = 1, SZ = Z ∼ N (0, 1); conditional on S = −1, SZ = −Z, which also has the standard
Normal distribution by symmetry. A mixture of these identical distributions is still standard Normal. Therefore
SZ ∼ N (0, 1).


Exercise 31
The probability integral transform says that if Z has continuous CDF Φ, then U = Φ(Z) ∼ Unif(0, 1). To see it
directly, for 0 < u < 1,
                                      P(Φ(Z) ≤ u) = P(Z ≤ Φ−1 (u)) = u.

Consequently, E[Φ(Z)] = 1/2.


Exercise 32
(a) Since X = Z 2 ,
                                  P(1 ≤ X ≤ 4) = P(1 ≤ |Z| ≤ 2) = 2{Φ(2) − Φ(1)}.

Using the familiar approximations Φ(1) ≈ 0.84 and Φ(2) ≈ 0.975 gives P(1 ≤ X ≤ 4) ≈ 2(0.975 − 0.84) = 0.27.
(b) On {Z > t} with t > 0, Z/t > 1, so I(Z > t) ≤ (Z/t)I(Z > t). Taking expectations,

                                                         1 ∞
                                                           Z
                                         1                                 ϕ(t)
                             1 − Φ(t) ≤ E[ZI(Z > t)] =          zϕ(z) dz =      ,
                                         t                t t               t

where ϕ′ (z) = −zϕ(z). Rearranging yields Mills’ lower bound Φ(t) ≥ 1 − ϕ(t)/t.


Exercise 33
                                                                    Z ∞
(a) Using the standard Normal PDF, one expression is EZ 4 =               z 4 ϕ(z) dz. Using the PDF g of W = Z 2 ,
                                                                    −∞
                            Z ∞
another is EZ 4 = EW 2 =          w2 g(w) dw. Both integrals equal 3, the fourth moment of the standard Normal.
                              0

(b) By linearity and the result of Exercise 31, E(Z 2 + Z + Φ(Z)) = 1 + 0 + 1/2 = 3/2.


Exercise 34
Here X = ZI(Z > 0). Using the half-normal integrals,
                              Z ∞                                    Z ∞
                                                1               2                          1
                       EX =        zϕ(z) dz = √ ,            EX =          z 2 ϕ(z) dz =     .
                               0                2π                   0                     2

                      1   1   π−1
Therefore Var(X) =      −   =     .
                      2 2π     2π




                                                         7


Introduction to Probability                                                       Chapter 5: Continuous Random Variables


Exercise 35
By LOTUS and the fact that the maximum is zero for z ≤ c,
                                                Z ∞
                              E max(Z − c, 0) =      (z − c)ϕ(z) dz
                                                Zc ∞
                                              =      zϕ(z) dz − c{1 − Φ(c)}
                                                         c

                                                    = ϕ(c) − c{1 − Φ(c)}.
                             √
At c = 0 this gives ϕ(0) = 1/ 2π, as required.


Exponential
Exercise 36
Let the remaining service times of Bob and Claire be independent Expo(λ) variables; this follows from memoryless-
ness. Alice begins service when the first of them finishes. The remaining service time of the other customer is
again Expo(λ), independent of Alice’s own Expo(λ) service time.
(a) Alice is last exactly when her service time exceeds the other customer’s remaining time. Two i.i.d. continuous
random variables are equally likely to be larger, so P(Alice is last) = 1/2.
(b) The time until the first of Bob and Claire finishes is the minimum of two independent Expo(λ) variables,
hence has mean 1/(2λ). Alice’s own service time has mean 1/λ. Thus the expected time from her arrival until she
finishes is 1/(2λ) + 1/λ = 3/(2λ).


Exercise 37
(a) The median t1/2 solves 1 − e−λt1/2 = 1/2, so t1/2 = log 2/λ.
(b) By memorylessness,

                                                         e−λt − e−λ(t+ϵ)
                            P(t ≤ T ≤ t + ϵ | T > t) =                   = 1 − e−λϵ ≈ λϵ .
                                                              e−λt
This is independent of t.
(c) The minimum L has survival function
                                                          n
                                                          Y
                                            P(L > t) =           e−λt = e−nλt .
                                                         i=1

Thus L ∼ Expo(nλ) and
                                       EL = 1/(nλ),          Var(L) = 1/(n2 λ2 ).

(d) By memorylessness, the gaps between successive ordered decay times are independent exponentials with rates
nλ, (n − 1)λ, . . . , λ. The maximum is their sum. Therefore

                                                n                                 n
                                             1X1                           1 X 1
                                     EM =            ,       Var(M ) =                .
                                             λ j=1 j                       λ2 j=1 j 2


Exercise 38
An offer X ∼ Expo(1/12000) qualifies if X ≥ 18000, with probability e−18000/12000 = e−3/2 . The number of offers
is geometric, so E(offers) = e3/2 . By the memoryless property, conditional on an offer being at least 18000, its
expected excess over 18000 is still 12000. Hence E(accepted offer) = 18000 + 12000 = $30, 000.




                                                             8


Introduction to Probability                                                   Chapter 5: Continuous Random Variables


Exercise 39
The expected maximum of three i.i.d. Exponential variables with rate λ is H3 /λ, where H3 = 1 + 1/2 + 1/3.
This follows by decomposing the ordered sample into independent exponential spacings with rates 3λ, 2λ, λ. Since
                                                            
                                                        1 1
1/λ = 12000 dollars, E(max(X1 , X2 , X3 )) = 12000 1 + +       = $22, 000.
                                                        2 3


Exercise 40
(a) An arrival at a random time is more likely to fall inside a long inter-bus interval. If X is a generic interarrival
time, the interval containing a random time has length-biased mean E(X 2 )/EX. For X ∼ Expo(1/10), EX = 10
and EX 2 = 2(10)2 = 200, so E(observed interval) = 20 minutes.
(b) The random arrival is uniformly located within its containing interval, so its expected residual wait is
E(X 2 )/(2EX). This can be much larger than EX. For example, let an interarrival time equal 1 minute with
probability 0.99 and 901 minutes with probability 0.01. Its mean is 10 minutes, but
                            EX 2     0.99(1)2 + 0.01(901)2
                                  =                        ≈ 405.95 minutes > 60.
                            2EX                20
Rare, very long gaps dominate the intervals in which random arrivals occur.


Exercise 41
(a) Route 1 interarrival times are Exponential, so memorylessness implies that after already waiting 20 minutes
the expected additional wait is still 1/λ1 minutes.
(b) Consider the combined sequence of Route 1 and Route 2 arrivals. Each next arrival is from Route 1 with
probability λ1 /(λ1 + λ2 ). For at least n Route 1 buses to pass before the first Route 2 bus, the first n arrivals in
                                                                                                 n
                                                                                             λ1
the combined process must all be Route 1. Hence P(N1 ≥ n before first Route 2) =                      .
                                                                                          λ1 + λ2
(c) With equal rates, Fred’s and Gretchen’s waiting times are independent Expo(λ) variables. The time until both
have caught a bus is their maximum:
                                                                             1  1  1    3
                         E max(T1 , T2 ) = ET1 + ET2 − E min(T1 , T2 ) =       + −   =    .
                                                                             λ λ 2λ    2λ

Exercise 42
The day index is X = ⌊365T ⌋, where T ∼ Expo(1/5). For k = 0, 1, . . .,
                                                                     
                                                  k          k+1
                                  P(X = k) = P       ≤T <
                                                 365          365
                                                   = e−k/(5·365) − e−(k+1)/(5·365) .

Thus P(X = k) = q k (1 − q),      q = e−1/1825 ,   k = 0, 1, . . . . This is the Geometric distribution counting failures
before the first success, with success probability 1 − e−1/1825 .


Exercise 43
(a) Trials occur at 0, ∆t, 2∆t, . . .. If G is the number of failures before the first success, then the first success
occurs at time T = G∆t.
(b) For t ≥ 0, T > t requires all trials at times 0, ∆t, . . . , ⌊t/∆t⌋∆t to fail. Therefore

                          P(T > t) = (1 − λ∆t)⌊t/∆t⌋+1 ,         FT (t) = 1 − (1 − λ∆t)⌊t/∆t⌋+1 .

For t < 0, the CDF is zero.
(c) For fixed t > 0, as ∆t → 0 the exponent is asymptotic to t/∆t, and
                                              (1 − λ∆t)⌊t/∆t⌋+1 −→ e−λt .
Hence FT (t) → 1 − e−λt for t ≥ 0, the CDF of Expo(λ). At t = 0 the limit is also zero.


                                                             9


Introduction to Probability                                                           Chapter 5: Continuous Random Variables


Exercise 44
(a) The Laplace density is 12 e−|x| . On the positive half-line it is half the Expo(1) density; on the negative half-line
it is its reflection. The graph is symmetric about zero, with an exponential tail on each side.
(b) Let Y = SX, where X ∼ Expo(1) and S = ±1 with equal probabilities independently. For y < 0,
FY (y) = 12 P(X ≥ −y) = 12 ey . For y ≥ 0, FY (y) = 12 + 12 P(X ≤ y) = 1 − 21 e−y . Differentiating on either
side gives fY (y) = 12 e−|y| ,   y ∈ R, which is exactly the Laplace PDF.


Exercise 45
In 0.1 hour, the number of emails is N ∼ Pois(20 · 0.1) = Pois(2). The third email has not arrived by time 0.1
exactly when N ≤ 2. Thus, without integration,

                                                                                      22
                                                                                          
                                                                        −2
                                 P(T > 0.1) = P(N ≤ 2) = e                       1+2+          = 5e−2 .
                                                                                      2


Exercise 46
(a) For a small time interval [t, t + dt], conditioning on survival to t gives

                                                              F (t + dt) − F (t)     f (t)
                          P(t ≤ T < t + dt | T ≥ t) =                            ≈           dt = h(t)dt.
                                                                   1 − F (t)       1 − F (t)

Thus h(t) is the instantaneous conditional death rate (probability per unit time) among those who have survived
to time t; this is why it is called the hazard.
(b) For an Exponential lifetime, f (t) = λe−λt and 1 − F (t) = e−λt , so h(t) = λ. Conversely, if h(t) = λ is constant,
the survival function S(t) = 1 − F (t) satisfies S ′ (t) = −f (t) = −λS(t) with S(0) = 1. Solving gives S(t) = e−λt
and therefore T ∼ Expo(λ).


Exercise 47
Let S(t) = 1 − F (t) be the survival function. By definition h(t) = f (t)/S(t) and S ′ (t) = −f (t), so

                                                   d             S ′ (t)
                                                      log S(t) =         = −h(t).
                                                   dt            S(t)

Integrating from 0 to t and using S(0) = 1 gives
                                             Z t                                 Z t        
                              log S(t) = −         h(s) ds,      F (t) = 1 − exp −    h(s) ds .
                                              0                                            0


Since f (t) = h(t)S(t),
                                                               Z t        
                                              f (t) = h(t) exp −    h(s) ds .
                                                                             0



Exercise 48
For X ∼ Expo(λ),                                                 Z ∞
                                                    EX 3 = λ            x3 e−λx dx.
                                                                  0

Integrate by parts once with u = x2 and dv = λxe−λx dx, for which v = −(x + 1/λ)e−λx . Boundary terms vanish,
giving                                 Z ∞
                                                                2        2
                                  3
                               EX = 2      (x2 + x/λ)e−λx dx = EX 2 + 2 EX.
                                        0                       λ        λ

Since EX = 1/λ and EX 2 = Var(X) + (EX)2 = 2/λ2 , EX 3 = 6/λ3 .




                                                                   10


Introduction to Probability                                              Chapter 5: Continuous Random Variables


Exercise 49
(a) Let G = − log X for X ∼ Expo(1). Then

                                                                           −y
                            FG (y) = P(− log X ≤ y) = P(X ≥ e−y ) = e−e         ,   y ∈ R.

(b) For fixed x and sufficiently large n,

                                   P(Mn − log n ≤ x) = P(Mn ≤ x + log n)
                                                                      n
                                                     = 1 − e−(x+log n)
                                                                n
                                                            e−x
                                                       
                                                                          −x
                                                     = 1−          −→ e−e .
                                                             n

This is the Gumbel CDF from (a), proving convergence in distribution.


Mixed practice
Exercise 50
If X, Y are i.i.d., swapping their labels does not change their joint distribution. The event {X < Y } is transformed
by this swap into {Y < X}, so the probabilities are equal. Independence alone or identical marginal distributions
alone do not guarantee this swap symmetry. For example, dependent variables with X = Y have both probabilities
zero, while non-identically distributed independent variables can favour one ordering over the other.


Exercise 51
(a) Since 0 ≤ X ≤ 1, we have X 2 ≤ X almost surely. Hence

                                Var(X) = EX 2 − µ2 ≤ µ − µ2 = µ(1 − µ) ≤ 1/4 .

Also Var(X) ≥ 0, proving 0 ≤ Var(X) ≤ µ − µ2 ≤ 1/4.
(b) Equality Var(X) = 1/4 forces µ = 1/2 and E(X − X 2 ) = 0. Since X − X 2 ≥ 0, it must be zero almost surely,
so X ∈ {0, 1} almost surely. The mean 1/2 then forces equal masses at 0 and 1. The unique distribution is
 X ∼ Bern(1/2).


Exercise 52
(a) Using the Rayleigh density,
                             Z ∞               √ Z ∞ 2          √
                                       2                             1  p
                      EX =       x2 e−x /2 dx = 2π   x ϕ(x) dx = 2π · =   π/2.
                               0                   0                 2

The last integral is half of EZ 2 = 1 by symmetry for Z ∼ N (0, 1).
(b) By LOTUS and u = x2 /2, du = x dx,
                                 Z ∞                  Z ∞
                                        3 −x2 /2
                             2
                          EX =         x e       dx =     2ue−u du = 2EV = 2 ,
                                       0                   0

where V ∼ Expo(1).


Exercise 53
Write T −θ = (T −ET )+(ET −θ). Squaring and taking expectations, the cross term vanishes because E(T −ET ) = 0.
Therefore
                                  MSE(T ) = E[(T − θ)2 ]
                                                = E[(T − ET )2 ] + (ET − θ)2
                                                = Var(T ) + b(T )2 .


                                                         11


Introduction to Probability                                                                Chapter 5: Continuous Random Variables


Exercise 54
(a)–(b) Benford’s law predicts a first-digit-1 proportion of log10 2 ≈ 0.3010 , or about 30.1%. The requested
empirical proportion requires the actual country-population list; that dataset is not contained in the uploaded
chapter, so a data-based percentage or comparison cannot be computed from the supplied source alone.
(c) Normalize the density:
                                                        Z 10
                                                               dx
                                           1=c                    = c loge 10,      c = 1/ ln 10.
                                                         1      x
For Y = aX with a > 0, the change-of-variable formula gives

                                                               1           c
                                               fY (y) =          fX (y/a) = ,      a ≤ y ≤ 10a,
                                                               a           y

and zero otherwise. The 1/y form is preserved, although the support shifts to [a, 10a].
(d) The first digit is j exactly when j ≤ X < j + 1. Thus
                                                 Z j+1                                                    
                                                               c      ln((j + 1)/j)                  j+1
                              P(D = j) =                         dx =               = log10                    ,
                                                    j          x          ln 10                       j

which is Benford’s law for j = 1, . . . , 9.


Exercise 55
(a) Since Xj ∼ N (0, 4), P(Xj > 4) = 1 − Φ(2). The first such index is geometric, so EJ = 1/[1 − Φ(2)].
(b) Since X has density f ,
                                             Z ∞                  Z ∞
                                       g(X)        g(x)
                                     E        =          f (x) dx =     g(x) dx = 1.
                                       f (X)    −∞ f (x)             −∞


(c) If X has continuous strictly increasing CDF F , then W = F (X) ∼ Unif(0, 1) by the probability integral
transform. Therefore EW = 1/2, Var(W ) = 1/12.


Exercise 56
                                                                        Z ∞
(a) By LOTUS, an integral expression is E[Z 2 Φ(Z)] =                            z 2 Φ(z)ϕ(z) dz.
                                                                           −∞

(b) Since Φ is strictly increasing and Φ(Z) ∼ Unif(0, 1), P(Φ(Z) < 2/3) = 2/3.
(c) The six possible orderings of three i.i.d. continuous random variables are equally likely. Exactly one is
X < Y < Z, so P(X < Y < Z) = 1/6.


Exercise 57
(a) Let U = Φ(Z) ∼ Unif(0, 1). Since W = U 2 ,
                                          
                                          0,
                                            w ≤ 0,
                                            √                                         1
                            FW (w) =      w, 0 < w < 1,                      fW (w) = √ , 0 < w < 1.
                                                                                    2 w
                                       1,    w ≥ 1,
                                     


(b) Two valid integral expressions are
                                          Z 1                                            Z ∞
                                 3                  3   1                           3
                           E(W ) =              w       √      dw    and     E(W ) =            [Φ(z)]6 ϕ(z) dz.
                                           0            2 w                                −∞


(c) Move all random variables to one side. The variable X + 2Y − 2Z is Normal with mean 0 and variance
1 + 4 + 4 = 9. Therefore P(X + 2Y < 2Z + 3) = Φ(3/3) = Φ(1).


                                                                        12


Introduction to Probability                                                     Chapter 5: Continuous Random Variables


Exercise 58
                                                           Z ∞
                                                                                      √
(a) Since Y = Z for Z > 0 and zero otherwise, EY =               zϕ(z) dz (equal to 1/ 2π).
                                                            0

(b) Yi = 0 exactly when Zi ≤ 0, with probability 1/2. Thus N is geometric, counting trials through the first zero,
and EN = 2.
                                                                                   (
                                                                                     0,      y < 0,
(c) For y < 0, FY (y) = 0. For y ≥ 0, the event Y ≤ y is simply Z ≤ y, so FY (y) =                   There is an
                                                                                     Φ(y), y ≥ 0.
atom of size 1/2 at zero.


Exercise 59
(a) The three arcs as an unlabelled collection have total length 2π, so their average length (averaging over the
three arcs) is 2π/3. But the arc containing a fixed point is not a uniformly selected arc: longer arcs are more likely
to contain that fixed point. This is a length-bias effect, so the symmetry argument does not apply to L.
(b) The counterclockwise piece L1 is the distance from (1, 0) to the first of the three independent uniform points
encountered counterclockwise. The three forward angular distances are i.i.d. Unif(0, 2π), and L1 is their minimum.
For 0 ≤ ℓ ≤ 2π,
                                                   3                           2
                                                  ℓ                  3          ℓ
                             FL1 (ℓ) = 1 − 1 −         , fL1 (ℓ) =         1−        .
                                                 2π                 2π         2π
The expected minimum of three uniforms on (0, 2π) is EL1 = 2π/4 = π/2.

(c) The clockwise piece has the same distribution and mean. Since L = L1 + L2 , EL = π.


Exercise 60
(a) For each j ≥ 3, among the three i.i.d. continuous values Xj−2 , Xj−1 , Xj , each is equally likely to be largest.
Thus P(Aj ) = 1/3. Summing indicators gives E(best-in-recent-memory jumpers) = (n − 2)/3.
(b) P(A3 ) = P(A4 ) = 1/3. Both events occur when X4 > X3 and X3 is larger than both X1 , X2 . Among the 24
equally likely relative orderings of four observations, the two bottom observations may appear in either order, while
the top two must be X3 , X4 . Hence P(A3 ∩ A4 ) = 2/24 = 1/12. This differs from 1/9 = (1/3)2 , so the events are
not independent.


Exercise 61
Apply the probability integral transform to the guests’ i.i.d. continuous arrival times. Their transformed arrival
times are i.i.d. Uniform(0, 1). Let U, V be Tyrion’s and Cersei’s transformed arrival times. The party is fun exactly
between these two times, an interval of length |U − V |.
(a) Each of the n other guests independently arrives in that interval with conditional probability |U − V |. Since
E|U − V | = 1/3 for two independent Uniform(0, 1) variables, E(other guests arriving at fun times) = n/3.
(b) Let A and B be the events that Jaime and Robert, respectively, arrive during this interval. Then
                                               1                                           1
                   P(A) = P(B) = E|U − V | = , P(A ∩ B) = E|U − V |2 = E(U − V )2 = .
                                               3                                           6
Since 1/6 ̸= (1/3)2 = 1/9, they are not independent.
(c) The two events share the same random interval, which creates dependence: a wider fun interval makes both
events more likely. Conditional on the arrival times of everyone except Jaime and Robert, the interval is fixed and
their independent arrival times make the events conditionally independent.


Exercise 62
(a) Index the years by j = 1, . . . , 100. Year 1 is both a record high and a record low. For j ≥ 2, it is either a record
high or a record low (not both), each with probability 1/j. Thus
                                                                      100
                                                                      X   1
                     E(# record-high or record-low years) = 1 + 2               = 2H100 − 1 ≈ 9.3748.
                                                                      j=2
                                                                            j


                                                           13


Introduction to Probability                                              Chapter 5: Continuous Random Variables


(b) For a fixed j, the event that year j is a record low and year j + 1 is a record high means that, among the first
j + 1 observations, year j is the minimum and year j + 1 is the maximum. All relative orderings are equally likely,
so this has probability 1/[j(j + 1)]. Summing over the 100 possible record-low years,

                                                              100
                                                              X        1         1    100
                        E(such consecutive record pairs) =                  =1−     =     .
                                                               j=1
                                                                   j(j + 1)     101   101


(c) N > n means none of years 2102 through 2100+n has a new record high; equivalently, the first year’s rainfall
is the largest among the first n + 1 observations. By symmetry, P(N > n) = 1/(n + 1), n = 1, 2, . . . . Using
P(N = n) = P(N > n − 1) − P(N > n), P(N = n) = 1/[n(n + 1)],            n ≥ 1.
(d) The tail-sum formula gives
                                            ∞                  ∞
                                            X                  X     1
                                     EN =         P(N > n) =             = ∞.
                                            n=0                n=0
                                                                   n + 1
The next record high occurs almost surely, but its waiting time has infinite mean.




                                                         14
```
