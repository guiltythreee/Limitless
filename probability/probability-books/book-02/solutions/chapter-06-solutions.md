# Chapter 6: Moments — Detailed Solutions

**Book:** Introduction to Probability, Second Edition  
**Authors:** Joseph K. Blitzstein and Jessica Hwang

> Source transcription from the supplied chapter-solution PDF. The solution numbering and worked reasoning are retained. Mathematical notation should be checked against the original source if a character appears ambiguous.

```text
INTRODUCTION TO PROBABILITY


                               Detailed Solutions
                                   Chapter 6 – Moments


                         Complete worked solutions to Exercises 1–26




Scope. This volume follows Section 6.10 of the supplied chapter. It retains the exercise numbering and
uses the chapter’s definitions of median, mode, skewness, moments, and moment generating functions. The
Geometric distribution is taken to count failures before the first success, consistent with the chapter’s mean
q/p and variance q/p2 .


Introduction to Probability              Chapter 6: Moments


Contents
Means, medians, modes, and moments                       2

Moment generating functions                              4




                                     1


Introduction to Probability                                                                      Chapter 6: Moments


Means, medians, modes, and moments
Exercise 1
For U ∼ Unif(a, b), the CDF on [a, b] is F (u) = (u − a)/(b − a). The median m solves F (m) = 1/2, so

                                                           a+b
                                                      m=       .
                                                            2

The density is constant, 1/(b − a), throughout the support. Hence every u ∈ [a, b] maximizes the density: every
point of the support is a mode (there is no unique mode).


Exercise 2
For X ∼ Expo(λ), F (x) = 1 − e−λx for x ≥ 0. Solving F (m) = 1/2 gives e−λm = 1/2, hence

                                                            log 2
                                                      m=          .
                                                              λ

The density f (x) = λe−λx decreases on [0, ∞), so its maximum is at the left endpoint. The unique mode is 0 .


Exercise 3
The Pareto CDF is F (x) = 0 for x < 1 and F (x) = 1 − x−a for x ≥ 1. The median satisfies 1 − m−a = 1/2, giving

                                                      m = 21/a .

Since f (x) = ax−(a+1) is strictly decreasing for x ≥ 1, the mode is 1 .


Exercise 4
For X ∼ Bin(n, p), EX = np and the mode rule is that if (n + 1)p is an integer r, the two modes are r − 1, r;
otherwise the unique mode is ⌊(n + 1)p⌋.
(a) With n = 5, p = 1/3, the mean is 5/3. The probabilities at 0, 1, 2, 3, 4, 5 are respectively
                                             32 80 80 40 10 1
                                               ,   ,   ,   ,   ,    .
                                            243 243 243 243 243 243
Thus P (X ≤ 1) = 112/243 < 1/2 whereas P (X ≤ 2) = 192/243 > 1/2. The median is uniquely 2. Since
(n + 1)p = 2, the modes are 1 and 2 (their probabilities tie). The mean 5/3 lies between the two modes and is
below the median.
(b) With n = 6, p = 1/3, the mean is 2. We have
                                               256  1                        496  1
                                 P (X ≤ 1) =       < ,         P (X ≤ 2) =       > ,
                                               729  2                        729  2
so the unique median is 2. Here (n + 1)p = 7/3, so the unique mode is ⌊7/3⌋ = 2. Mean, median, and mode all
equal 2.


Exercise 5
For J ∼ Discrete Unif{1, . . . , n}, every support point has the same probability 1/n. Therefore every j ∈ {1, . . . , n}
is a mode. A median is any m for which at least half the mass is at or below m and at least half is at or above m.

                           If n is odd: m = (n + 1)/2. If n is even: m ∈ [n/2, n/2 + 1].

For even n, the interval between the two central support points consists entirely of medians.




                                                           2


Introduction to Probability                                                                   Chapter 6: Moments


Exercise 6
Let R be rainfall on a randomly selected calendar day and let A = {R > 0} be the event that the day is rainy.
By assumption P (A) < 1/2 and P (R = 0) > 1/2.
For the all-days distribution, 0 is the mode because it has probability greater than 1/2, and 0 is also the median.
Its mean is
                             ER = P (A)E(R | A) + P (Ac )E(R | Ac ) = P (A)E(R | A),
since R = 0 on Ac . Thus the all-days mean is the rainy-day mean multiplied by the fraction of days that are rainy.
For the rainy-day distribution, R | A is strictly positive. Its mean, median, and mode summarize the positive-
rainfall amounts only; in particular its median and mode are positive (for a continuous rainfall model, the
mode is a maximizer of the conditional density). Conditioning removes the large mass at zero, so the rainy-day
median/mode answer a different question from their all-days counterparts. The all-days mean measures rainfall
averaged over the entire year, including dry days.


Exercise 7
Ignoring the positive normalizing constant, the Beta density is f (x) ∝ xa−1 (1 − x)b−1 for 0 < x < 1. Its log is

                                   ℓ(x) = (a − 1) log x + (b − 1) log(1 − x) + C.

Differentiating,
                                                     a−1    b−1
                                              ℓ′ (x) =    −     .
                                                       x    1−x
The stationary point solves (a − 1)(1 − x) = (b − 1)x, so

                                                           a−1
                                                xmode =         .
                                                          a+b−2

For a, b > 1, this lies in (0, 1) and ℓ′′ (x) = −(a − 1)/x2 − (b − 1)/(1 − x)2 < 0, proving it is the unique maximum.


Exercise 8
For Beta(3, 1), the density is f (x) = 3x2 on (0, 1), so F (x) = x3 . The median solves m3 = 1/2:

                                                    m = 2−1/3 .


Exercise 9
Let Y = eX with X ∼ N (µ, σ 2 ).
(a) Correct. A strictly increasing continuous transformation preserves quantiles. Specifically, P (Y ≤ eµ ) =
P (X ≤ µ) = 1/2, hence the median is eµ .
(b) Incorrect. A mode is defined by maximizing a density, and density heights change under transformations
because of the Jacobian. The Log-Normal density is
                                                     (log y − µ)2
                                                                 
                                          1
                               fY (y) =   √ exp −                   , y > 0.
                                        yσ 2π            2σ 2
                                                                                                         2
Differentiating its log gives −1/y − (log y − µ)/(σ 2 y) = 0, so log y = µ − σ 2 . Thus the mode is eµ−σ , not eµ .
(c) Incorrect. It repeats the same mistaken assumption that maximizing the original density is unchanged by a
                                                                                                            2
monotone transformation. The factor 1/y in the transformed density changes the maximizer. The mode is eµ−σ ,
not µ.


Exercise 10
Let c be the center of symmetry. Since the distribution is continuous and symmetric about c, equal probability
lies on each side of c, so c is a median. Symmetry and existence of the mean give

                                             EX − c = E(X − c) = 0,


                                                          3


Introduction to Probability                                                                       Chapter 6: Moments


so the mean is also c. Finally, symmetry makes the density at c − u equal to that at c + u. If the unique mode
were not c, its reflected point would be a distinct mode, contradicting uniqueness. Thus the mode is c as well.
Hence mean = median = mode = c .


Exercise 11
Write skewness as γX = E[(X − µ)3 ]/σ 3 .
(a) For Z = (X − µ)/σ, standardizing makes its mean 0 and variance 1, and E(Z 3 ) = E[(X − µ)3 ]/σ 3 = γX .
Thus skewness is invariant under positive affine standardization. Since Z̄n = (X̄n − µ)/σ, the same argument
proves that Z̄n and X̄n have the same skewness.
                                                      Pn
(b) By (a), take EXj = 0 and Var(Xj ) = 1. Let Sn = j=1 Xj . In the expansion of Sn3 , terms with a variable
to the first power and independent of the rest have expectation zero. The only surviving terms are Xj3 , giving
E(Sn3 ) = nγ. Also Var(Sn ) = n. Therefore
                                                                nγ     γ
                                               Skew(Sn ) =       3/2
                                                                     =√ .
                                                               n        n
                                                           √
Scaling by 1/n does not change skewness, so Skew(X̄n ) = γ/ n.
(c) The skewness tends to zero as n grows, so the sample mean becomes less skewed. This is consistent with the
Central Limit Theorem, which says that the standardized sample mean approaches a standard Normal distribution
under the usual i.i.d. finite-variance assumptions. A vanishing skewness alone is not a proof of Normality.


Exercise 12
(a) For any real numbers x1 , . . . , xn , Cauchy–Schwarz gives
                                                         2
                                                    n            n
                                                 1 X          1X 2
                                                      xj  ≤      x .
                                                 n j=1        n j=1 j

Consequently T1 ≤ T2 for every sample. Equality holds exactly when all Xj are equal. For n ≥ 2 and σ 2 > 0,
independent Normal observations are almost surely not all equal; hence P (T1 < T2 ) = 1 . (For n = 1, the two
estimators are identical and this probability is zero.)
(b) Since X̄n ∼ N (c, σ 2 /n),

                                                              σ2                          σ2
                                   E(T1 ) = E(X̄n2 ) = c2 +      ,          Bias(T1 ) =      .
                                                              n                           n

Also E(Xj2 ) = c2 + σ 2 , so E(T2 ) = c2 + σ 2 and Bias(T2 ) = σ 2 .


Moment generating functions
Exercise 13
                                                                            P6
The two die rolls are independent. For one fair die, MX (t) = 61                   kt
                                                                              k=1 e . Therefore

                                                     t                    2
                                                     e + e2t + · · · + e6t
                                         MX+Y (t) =                           .
                                                             6


Exercise 14
                                 R 1 tu
For U ∼ Unif(0, 1), MU (t) =      0
                                    e du = (et − 1)/t for t ̸= 0, with MU (0) = 1. Independence yields

                                             t   60
                                             e −1
                                   MX (t) =           ,           t ̸= 0,        MX (0) = 1.
                                                t


                                                              4


Introduction to Probability                                                                     Chapter 6: Moments


Exercise 15
(a) By independence and the given MGF of a squared standard Normal,

                               MW (t) = MX 2 (t)MY 2 (t) = (1 − 2t)−1 ,              t < 1/2.

(b) This is the MGF of χ22 , equivalently Gamma(1, scale 2) or Expo(1/2) (rate 1/2).


Exercise 16
For E ∼ Expo(1), the raw moments are E(E k ) = k!. Thus EE = 1, Var(E) = 2 − 1 = 1, and

                        E[(E − 1)3 ] = E(E 3 ) − 3E(E 2 ) + 3E(E) − 1 = 6 − 6 + 3 − 1 = 2.

The skewness is therefore 2. Since λX ∼ Expo(1) and skewness is unchanged by positive scaling, Skew(X) = 2
for every λ > 0. Its positivity reflects the long right tail of waiting times.


Exercise 17
(a) Since EX̄n = µ and Var(X̄n ) = σ 2 /n,

                                                                       n σ2
                                      EZn = 0,            Var(Zn ) =        = 1.
                                                                       σ2 n
             √
(b) Let s = t n/σ. Independence gives
                                                   
                                      t Xn                 √
                                                                       n
                                                    
                                                         −tµ n/σ      t
                     MZn (t) = E exp   √    (Xj − µ) = e          M   √      .
                                     σ n                           σ n
                                                   j=1



Exercise 18
For the failures-before-success convention, MX (t) = p/(1 − qet ) where q = 1 − p. Differentiate:

                                  ′               pqet          ′′         pqet (1 + qet )
                                 MX (t) =                  ,   MX  (t) =                   .
                                               (1 − qet )2                  (1 − qet )3

At t = 0, EX = M ′ (0) = q/p and EX 2 = M ′′ (0) = q(1 + q)/p2 . Hence

                                                                              q
                                          Var(X) = EX 2 − (EX)2 =                .
                                                                              p2


Exercise 19
For independent X, Y ∼ Pois(λ),

                                   MX+2Y (t) = exp{λ(et − 1) + λ(e2t − 1)}.

A Poisson(θ) MGF has the form exp{θ(et − 1)}. The additional e2t term cannot be absorbed into a constant
multiple of et − 1. Therefore X + 2Y is not Poisson (for λ > 0).


Exercise 20
For X ∼ Pois(λ), M (t) = exp{λ(et − 1)}. Thus the cumulant generating function is
                                                                              ∞ j
                                                                              X t
                                     g(t) = log M (t) = λ(et − 1) = λ                     .
                                                                              j=1
                                                                                     j!

                                  j
                        P
Comparing with g(t) =     j≥1 cj t /j! gives    cj = λ for every j ≥ 1.


                                                               5


Introduction to Probability                                                                              Chapter 6: Moments


Exercise 21
With pn = λ/n,                                     n
                                           λ t                t
                              MXn (t) = 1 + (e − 1)    −→ eλ(e −1) = MPois(λ) (t).
                                           n
The limit is the Poisson(λ) MGF, so the MGFs converge to that of X (in a neighborhood of zero), establishing
the claimed Poisson limit.


Exercise 22
(a) The indicators are independent Bernoulli(pj ) variables. Therefore

                                          n
                                          Y                      n
                                                               Y
                                             (1 − pj ) + pj et =    1 + pj (et − 1) .
                                                                                 
                               MX (t) =
                                          j=1                              j=1


(b) For small pj , approximate each factor by 1 + pj (et − 1) ≈ exp{pj (et − 1)}. The product becomes
                                                    
                                             X               t              X
                       MX (t) ≈ exp (et − 1)      pj = eλ(e −1) ,         λ=      pj = EX.
                                                    
                                                     j                                   j


This is the MGF of a Poisson(λ) variable. A large collection of independent rare-event indicators is therefore
approximated by a Poisson count.


Exercise 23
For U ∼ Unif(0, 1), MU (t) = (et − 1)/t. Independence gives
                                                                     t   2
                                                                     e −1
                                                MU1 +U2 (t) =                .
                                                                        t

For the stated triangular density,
                                              Z 1               Z 2
                                  MT (t) =          xetx dx +           (2 − x)etx dx
                                                0                   1
                                                                                       2
                                                e − 1 e2t − 2et + 1
                                                t
                                                                                  t
                                                                                  e −1
                                          =          +              =                     ,
                                                  t         t2                       t

where the expression at t = 0 is understood by continuity. The MGFs agree, so the distributions agree. Hence
U1 + U2 has the stated Triangle distribution.


Exercise 24
For X, Y i.i.d. Expo(1), MX (t) = 1/(1 − t) for t < 1. Therefore
                                                                  1            1
                        MX−Y (t) = MX (t)MY (−t) =                         =        ,         |t| < 1.
                                                            (1 − t)(1 + t)   1 − t2

For the proposed Laplace density,
                     Z ∞
                                         1 ∞ −(1−t)x      1 0 (1+t)x
                                           Z                Z
                             1                                              1
                          etx e−|x| dx =      e      dx +       e    dx =        .
                      −∞     2           2  0             2  −∞           1 − t2

The MGFs match near zero, proving X − Y ∼ Laplace(0, 1) .




                                                                6


Introduction to Probability                                                            Chapter 6: Moments


Exercise 25
The folded Normal density is fY (y) = 2ϕ(y) for y ≥ 0. Hence the MGF may be written directly as
                                                      Z ∞
                                         MY (t) = 2         ety ϕ(y) dy.
                                                      0


Using Y = |Z| and the standard Normal density of Z gives the alternative expression
                                                    Z ∞
                                         MY (t) =          et|z| ϕ(z) dz.
                                                      −∞


Splitting the second integral at zero and substituting z 7→ −z on the negative half-line shows that the two
expressions are identical. They are intentionally left as unsimplified integrals.


Exercise 26
(a) By the standard Normal density,
                                                    Z ∞
                                              Z
                                      E[Φ(Z)e ] =           Φ(z)ez ϕ(z) dz.
                                                      −∞


(b) Since Φ(Z) ∼ Unif(0, 1) by the probability integral transform, E[Φ(Z)] = 1/2 . Also the Normal MGF gives
 E(eZ ) = MZ (1) = e1/2 .




                                                       7
```
