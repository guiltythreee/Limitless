# Chapter 8: Transformations — Detailed Solutions

**Book:** Introduction to Probability, Second Edition  
**Authors:** Joseph K. Blitzstein and Jessica Hwang

> Source transcription from the supplied chapter-solution PDF. The solution numbering and worked reasoning are retained. Mathematical notation should be checked against the original source if a character appears ambiguous.

```text
INTRODUCTION TO PROBABILITY


                               Detailed Solutions
                              Chapter 8 – Transformations


                          Complete worked solutions to Exercises 1–54




Scope and conventions. This volume follows Section 8.9 of the supplied chapter and retains its numbering.
For continuous transformations, inverse branches are all included and Jacobians are written in absolute value.
Gamma distributions use the rate parameterization, as in the source text. In Exercise 54, the geometric count
is the number of failures before a success, so it has support 0, 1, 2, . . ..


Introduction to Probability       Chapter 8: Transformations


Contents
Change of variables                                       2

Convolutions                                              5

Beta and Gamma                                            6

Order statistics                                          9

Mixed practice                                           10




                              1


Introduction to Probability                                                                        Chapter 8: Transformations


Change of variables
Exercise 1
Let Y = e−X . Since X ∼ Expo(1), its support is x > 0, so 0 < Y < 1. The inverse is x = − log y, with
|dx/dy| = 1/y. Therefore
                                                  1
                              fY (y) = e−(− log y) = 1,    0 < y < 1.
                                                  y
Thus Y ∼ Unif(0, 1).


Exercise 2
For Y = X 7 , the transformation is increasing on x > 0. Its inverse is x = y 1/7 and dx/dy = (1/7)y −6/7 . Hence

                                                          λ −6/7 −λy1/7
                                               fY (y) =     y   e       ,       y > 0,
                                                          7

and fY (y) = 0 otherwise.


Exercise 3
The map g(z) = z 3 is strictly increasing on R. With z = y 1/3 and dz/dy = (1/3)|y|−2/3 ,

                                                                |y|2/3
                                                                      
                                                 1
                                     fZ 3 (y) = √ |y|−2/3 exp −          ,               y ̸= 0.
                                               3 2π               2

The density is zero outside the real support; its value at the single point 0 is immaterial.


Exercise 4
For Y = Z 4 and y > 0, the equation z 4 = y has two roots z = ±y 1/4 . Each inverse branch contributes ϕ(z)/(4y 3/4 ).
By symmetry of ϕ,
                                                               ϕ(y 1/4 )
                                                    fY (y) =             ,   y > 0,
                                                                2y 3/4

with density zero for y ≤ 0. The two branches are both necessary because z 7→ z 4 is not one-to-one.


Exercise 5
For Y = |Z|, each y > 0 has preimages z = y and z = −y. Thus

                                          fY (y) = ϕ(y) + ϕ(−y) = 2ϕ(y),              y > 0.
                                         p           2
So Y is half-normal, with density            2/π e−y /2 on y > 0.


Exercise 6
                                     √
(a) Y = U 2 . For 0 < y < 1, u =         y, hence

                                                             1
                                                  fU 2 (y) = √ ,         0 < y < 1.
                                                            2 y
          √
(b) Y =       U . The inverse is u = y 2 , with derivative 2y, giving

                                                    f√U (y) = 2y,       0 < y < 1.

Both densities are zero outside their displayed supports.


                                                                   2


Introduction to Probability                                                                                Chapter 8: Transformations


Exercise 7
For U ∼ Unif(0, π/2) and Y = sin U , the inverse is u = arcsin y and du/dy = (1 − y 2 )−1/2 . Since fU = 2/π,
                                                              2
                                              fY (y) =      p       ,        0 < y < 1.
                                                           π 1 − y2


Exercise 8
(a) If X is uniform on {0, 1, . . . , n}, then X 2 has support {02 , 12 , . . . , n2 }, with
                                                              1
                                          P(X 2 = k 2 ) =        ,           k = 0, 1, . . . , n.
                                                             n+1
(b) If X is uniform on {−n, . . . , n}, then zero has one preimage and each k 2 , k ≥ 1, has two preimages:
                                                 1                                   2
                               P(X 2 = 0) =           ,     P(X 2 = k 2 ) =               , k = 1, . . . , n.
                                               2n + 1                              2n + 1


Exercise 9
Take the affine transformation Y = a + (b − a)X. If X = 0, then Y = a; if X = 1, then Y = b. Therefore
P(Y = a) = 1 − p and P(Y = b) = p, as required.


Exercise 10
The indicator Y = I(X is odd) is Bernoulli. Its probability difference is
                                                             ∞
                                                             X                  λk
                               P(Y = 0) − P(Y = 1) =              (−1)k e−λ        = e−λ e−λ = e−2λ .
                                                                                k!
                                                             k=0

Together with the probabilities summing to one,

                                                        1 − e−2λ                         1 + e−2λ
                                      P(Y = 1) =                 ,       P(Y = 0) =               .
                                                            2                                2

Exercise 11
For v > 0, 1/T ≤ v is equivalent to T < 0 or T ≥ 1/v. Hence FV (v) = FT (0) + 1 − FT (1/v). At v = 0, the event is
T < 0, giving FT (0). For v < 0, the event is 1/v ≤ T < 0, giving FT (0) − FT (1/v). Thus the stated piecewise
identity follows (for a continuous T , endpoint choices do not matter).


Exercise 12
(a) A standard Cauchy CDF is FT (t) = 21 + π −1 arctan t and FT (0) = 1/2. For v > 0,
                                                  1                  1    1
                                       F1/T (v) =   + 1 − FT (1/v) = + arctan v,
                                                  2                  2 π
using arctan v + arctan(1/v) = π/2. The same expression follows for v < 0 from the third branch in Exercise 11.
Differentiating gives f (v) = 1/[π(1 + v 2 )]. (b) The ratio Y /X has the same distribution as X/Y by exchangeability
of i.i.d. (X, Y ); moreover, 1/T = Y /X. This is the requested symmetry proof.


Exercise 13
For t ∈ R,                                                   Z ∞
                                                                               t                      et
                                                    t
                               FT (t) = P(X ≤ e Y ) =              (1 − e−λe y )λe−λy dy =                 .
                                                              0                                     1 + et
Differentiating,
                                                                 et
                                                  fT (t) =               ,     t ∈ R,
                                                              (1 + et )2
which is the standard Logistic density.


                                                                     3


Introduction to Probability                                                                     Chapter 8: Transformations


Exercise 14
Write D = ad − bc ̸= 0. The inverse transformation is
                                               dt − bw                 −ct + aw
                                        x=             ,         y=             ,
                                                  D                       D
and the absolute Jacobian determinant is 1/|D|. Therefore
                                                                                       
                                                   1                 dt − bw −ct + aw
                               fT,W (t, w) =             fX,Y               ,               .
                                               |ad − bc|                D       D

For T = X + Y , W = X − Y , D = −2, and the inverse is x = (t + w)/2, y = (t − w)/2, giving the expression in
the question.


Exercise 15
In polar coordinates x = r cos θ, y = r sin θ, the Jacobian is r. Spherical symmetry gives

                                    fR,Θ (r, θ) = rg(r2 ),       r > 0, 0 ≤ θ < 2π.

This factors into a function of r times the constant 1/(2π), so Θ ∼ Unif(0, 2π) and R is independent of Θ. The
radial density is fR (r) = 2πrg(r2 ). (b) Uniformity on the unit disk means g(s) = 1/π for 0 < s < 1. Hence
                                                                                                             2
fR,Θ (r, θ) = r/π on 0 < r < 1, and zero otherwise. (c) For independent standard Normals, g(r2 ) = (2π)−1 e−r /2 .
Thus
                                                   r −r2 /2
                                    fR,Θ (r, θ) =    e      , r > 0, 0 ≤ θ < 2π.
                                                  2π
                                                2
Consequently R is Rayleigh with density re−r /2 , independent of the uniform angle.


Exercise 16
For (T, W ) = (X + Y, X − Y ), the inverse has determinant magnitude 1/2. The joint density is
                                                           
                                           1    t+w       t−w       1 −(t2 +w2 )/4
                            fT,W (t, w) = ϕ            ϕ         =    e            .
                                           2      2        2       4π

This factors into the product of two N (0, 2) densities. Therefore T, W are independent and each is N (0, 2).


Exercise 17
                                        √
For S = R2 , the derivative dr/ds = 1/(2 s). Applying it to the joint density in Exercise 15(c),
                                                     1 −s/2
                                   fS,Θ (s, θ) =       e    ,     s > 0, 0 ≤ θ < 2π.
                                                    4π
Thus S ∼ Expo(1/2), Θ ∼ Unif(0, 2π), and they are independent.


Exercise 18
The transformation (x, y) 7→ (x, t = x/y) has inverse y = x/t. Its absolute Jacobian is x/t2 . Therefore

                                                                 x
                                     fT,X (t, x) = fX (x)fY (x/t) 2 ,       t, x > 0.
                                                                 t

Integrating out x gives
                                               Z ∞
                                                                   x
                                    fT (t) =         fX (x)fY (x/t) 2 dx,      t > 0.
                                               0                   t




                                                             4


Introduction to Probability                                                                       Chapter 8: Transformations


Exercise 19
The inverse map is x = tw/(1 + w), y = t/(1 + w), with Jacobian t/(1 + w)2 . Since X, Y are independent
exponentials,
                                                          t
                                fT,W (t, w) = λ2 e−λt          , t, w > 0.
                                                      (1 + w)2
This factors as
                                                                                1
                                      fT (t) = λ2 te−λt ,        fW (w) =            .
                                                                            (1 + w)2

The factors integrate to one, so T and W are independent. T ∼ Gamma(2, λ); W has the ratio density shown.


Convolutions
Exercise 20
For T = U + X, convolve the uniform density on (0, 1) with the exponential density. The integration range is
0 < u < min(t, 1):                                        
                                                                −t
                                   Z min(t,1)             1 − e ,
                                                                       0 < t < 1,
                                               −(t−u)
                          fT (t) =            e       du = (e − 1)e−t , t ≥ 1,
                                    0                     
                                                            0,          t ≤ 0.
                                                          


Exercise 21
For t ≥ 0, the density of X − Y is                    Z ∞
                                                                               1 −t
                                           fL (t) =         e−(y+t) e−y dy =     e .
                                                      0                        2
                                                            1 −|t|
By symmetry fL (t) = 12 et for t < 0. Thus fL (t) =           e    , the Laplace(0, 1) density.
                                                            2


Exercise 22
It is enough to prove the result for independent standard Normals Z1 , Z2 . Their convolution is
                                                        Z ∞
                                                      1         2      2
                                       fZ1 +Z2 (t) =        e−[x +(t−x) ]/2 dx.
                                                     2π −∞
                                                                             2      √
Complete the square: x2 + (t − x)2 = 2(x − t/2)2 + t2 /2. The integral is e−t /4 /(2 π), the N (0, 2) density. Scaling
and shifting gives X + Y ∼ N (µ1 + µ2 , 2σ 2 ).


Exercise 23
Jacobno’s argument omits the infinitesimal width corresponding to a change in y = t/x. The correct formula
contains the Jacobian factor 1/x. (a) By conditioning on X = x,
                                                 Z ∞
                                        FT (t) =     fX (x)FY (t/x)dx.
                                                           0

Differentiating under the integral gives
                                                Z ∞
                                                                     1
                                     fT (t) =          fX (x)fY (t/x) dx,        t > 0.
                                                  0                  x

(b) Let A = log X, B = log Y . Then log T = A + B. The density of A is ea fX (ea ) and similarly for B. Convolution
gives                                         Z        ∞
                                     flog T (s) =           ea fX (ea )es−a fY (es−a )da.
                                                      −∞

Set t = es and use fT (t) = flog T (log t)/t. With x = ea , da = dx/x, the same integral with factor 1/x results.


                                                                5


Introduction to Probability                                                          Chapter 8: Transformations


Exercise 24
There are k + 1 pairs (x, y) with x + y = k when 0 ≤ k ≤ n, and 2n − k + 1 pairs when n < k ≤ 2n. Each ordered
pair has probability (n + 1)−2 . Thus
                                         
                                                         2
                                         (k + 1)/(n + 1) ,
                                                                0 ≤ k ≤ n,
                                                              2
                               P(T = k) = (2n − k + 1)/(n + 1) , n < k ≤ 2n,
                                         
                                           0,                    otherwise.
                                         



Exercise 25
(a) Linearity and independence give EW = 0 and Var(W ) = Var(X) + Var(Y ) = 1/6. (b) Swapping X and Y
                                                                          d
changes W to −W without changing the joint distribution; hence W = −W . (c) Convolution yields

                                         fW (w) = 1 − |w|,    −1 < w < 1,
                                                                                             R1
and zero elsewhere. (d) The density is symmetric, so its mean is zero. Its second moment is 2 0 w2 (1−w)dw = 1/6,
                                                                                                  d
verifying the variance. (e) X + Y − 1 has the same triangular density 1 − |w| on (−1, 1). Thus W = (X + Y ) − 1:
it is the Triangle(0, 2) law shifted left by one.


Exercise 26
The event X + Y ≤ t is the portion of the unit square below the line x + y = t. Its area gives
                                             
                                             
                                               0,               t ≤ 0,
                                             t2 /2,
                                             
                                                                 0 < t ≤ 1,
                                    FT (t) =
                                             
                                             
                                               1 − (2 − t)2 /2, 1 < t < 2,
                                                1,               t ≥ 2.
                                             

The last nontrivial expression is one minus the upper-right triangle’s area.


Exercise 27
Let S = X + Y , whose density is s on (0, 1) and 2 − s on (1, 2). Then
                                                     Z min(2,w)
                                          fW (w) =                 fS (s)ds.
                                                      max(0,w−1)

Evaluating the integral on the three ranges gives
                                              2
                                             
                                             w /2,                   0 < w < 1,
                                             −w2 + 3w − 3/2,
                                             
                                                                      1 ≤ w < 2,
                                    fW (w) =
                                             
                                             
                                              (3 − w)2 /2,           2 ≤ w < 3,
                                               0,                     otherwise.
                                             


The density is symmetric about 3/2 and integrates to one.


Beta and Gamma
Exercise 28
For U = 1 − B, the inverse is b = 1 − u with absolute derivative one. Substitution in the Beta density shows
U ∼ Beta(b, a). A story proof: if B is the proportion of total pseudo-count assigned to successes, 1 − B is the
corresponding failure proportion; swapping success and failure swaps the two shape parameters. This is precisely
the conjugate-prior symmetry for Binomial success and failure counts.



                                                         6


Introduction to Probability                                                                     Chapter 8: Transformations


Exercise 29
(a) Convolution. For integer a, b,
                                                                 Z t
                                                 λa λb e−λt
                                 fX+Y (t) =                            xa−1 (t − x)b−1 dx.
                                              (a − 1)!(b − 1)!    0

                     a+b−1
The beta integral is t     (a − 1)!(b − 1)!/(a + b − 1)!, giving the Gamma(a + b, λ) density. (b) MGF. MX (s) =
(λ/(λ − s))a , MY (s) = (λ/(λ − s))b . Their product is (λ/(λ − s))a+b . (c) Story. An integer-shape Gamma is the
waiting time for the indicated number of events in a rate-λ Poisson process. Waiting for a arrivals and then the
next b takes the time to the (a + b)th arrival.


Exercise 30
The Beta integral gives, for integer k ≥ 1,
                                      B(a + k, b)          a(a + 1) · · · (a + k − 1)
                          E(B k ) =               =                                          .
                                       B(a, b)      (a + b)(a + b + 1) · · · (a + b + k − 1)

In particular EB = a/(a + b) and EB 2 = a(a + 1)/[(a + b)(a + b + 1)]. Subtracting the square of the mean yields

                                                                  ab
                                            Var(B) =                           .
                                                       (a + b)2 (a + b + 1)


Exercise 31
Let S = X + Y and B = X/(X + Y ). For independent Gamma variables with common rate, the change of variables
gives independent S ∼ Gamma(a + b, λ) and B ∼ Beta(a, b). Since X/Y = B/(1 − B) is a function of B alone, it
is independent of S. Therefore the answer is yes.


Exercise 32
Write V = (X/m)/(Y /n), where X, Y are independent Gamma variables with shapes m/2, n/2 and common rate
1/2. Then
                                             mV        X
                                                   =       .
                                           n + mV    X +Y
By the Gamma–Beta relationship, this is Beta(m/2, n/2) .


Exercise 33
Over two hours, X | λ ∼ Pois(2λ). The likelihood for X = 2 is proportional to λ2 e−2λ . Multiplying by the prior
density 3e−3λ gives a kernel λ2 e−5λ . Thus

                                                                                   53 2 −5λ
                              λ | (X = 2) ∼ Gamma(3, 5),         f (λ | X = 2) =      λ e   .
                                                                                   2!


Exercise 34
(a) Take X = 1 and let Y equal 1 or 3 with probability 1/2 each. Then
                                                   
                                  X         1 1 1         3         EX       1
                            E            =       +      = ,                 = .
                                X +Y        2 2 4         8       E(X + Y )  3
They differ. (b) If X, Y are i.i.d., exchangeability gives E[X/(X + Y )] = E[Y /(X + Y )]. The two terms sum to
one, so the first is 1/2. Also EX/E(X + Y ) = 1/2. Hence equality holds. (c) Put S = X + Y , B = X/S. The
common-rate Gamma–Beta decomposition makes B independent of S. Therefore
                                             c 
                                               X                   E(X c )
                                          E            = E(B c ) =         ,
                                               S                   E(S c )
where the last equality follows from X c = B c S c and independence.


                                                            7


Introduction to Probability                                                                       Chapter 8: Transformations


Exercise 35
Since T = X 1/γ and X ∼ Expo(λ),
                                                      Γ(1 + 1/γ)                   Γ(1 + 2/γ)
                              E(T ) = E(X 1/γ ) =                ,     E(T 2 ) =              .
                                                         λ1/γ                         λ2/γ
Thus
                                                      Γ(1 + 2/γ) − Γ(1 + 1/γ)2
                                        Var(T ) =                              .
                                                                λ2/γ


Exercise 36
(a) If λ1 = λ2 , then T1 , T2 are i.i.d. exponential. The common-rate Gamma–Beta result shows T1 /(T1 + T2 ) is
independent of T1 + T2 . Since T1 /T2 is a function of that ratio, it is independent of the sum. (b) For independent
exponentials,
                                                    Z ∞
                                                                                 λ1
                                      P(T1 < T2 ) =     λ1 e−λ1 t e−λ2 t dt =         .
                                                     0                        λ1 + λ2
(c) The time until the first clerk finishes is min(T1 , T2 ) ∼ Expo(λ1 + λ2 ), so its mean is 1/(λ1 + λ2 ). The first
clerk is the left one with probability λ1 /(λ1 + λ2 ) and then has a fresh service time of mean 1/λ1 ; similarly for the
right. Total expected time is

                                     1         λ1   1       λ2   1       3
                                          +            +            =         .
                                  λ1 + λ2   λ1 + λ2 λ1   λ1 + λ2 λ2   λ1 + λ2


Exercise 37
In a rate-λ Poisson process, X = N (t) counts arrivals by time t, while Y is the waiting time to the jth arrival. The
event X ≥ j occurs exactly when the jth arrival has happened by time t, i.e. Y ≤ t. Therefore the probabilities
agree.


Exercise 38
Conditionally on Fred’s stay being t, the number of arrivals is Pois(λt). Mix over T ∼ Expo(λ2 ):
                                           Z ∞
                                                    (λt)k                   λ2 λk
                              P(N = k) =       e−λt       λ2 e−λ2 t dt =              .
                                            0         k!                 (λ + λ2 )k+1
This is Geometric on 0, 1, . . . with success parameter λ2 /(λ + λ2 ).


Exercise 39
(a) For p ∼ Beta(a, b),
                                                              a(a + 1)b(b + 1)
                              E[p2 (1 − p)2 ] =                                            .
                                                  (a + b)(a + b + 1)(a + b + 2)(a + b + 3)
(b) The Bernoulli likelihood is p6 (1 − p)4 , so the order of the observed outcomes does not matter; only the counts
matter. (c) A uniform Beta(1, 1) prior updates to p | data ∼ Beta(7, 5) . (d) Given p, the two game indicators are
independent. Without conditioning on p, their covariance is Var(p) > 0, so they are positively correlated. (e) The
match is undecided before game 5 exactly when the first four games split 2–2. Its posterior predictive probability is

                                                                    7·8·5·6           28
                                   6E[p2 (1 − p)2 | data] = 6                       =    .
                                                                  12 · 13 · 14 · 15   91


Exercise 40
After n successes in n trials, the posterior is p | data ∼ Beta(n + 1, 1). Therefore
                                                             Z 1
                                c(r) = P(p ≥ r | data) =           (n + 1)pn dp = 1 − rn+1 .
                                                              r



                                                             8


Introduction to Probability                                                             Chapter 8: Transformations


Order statistics
Exercise 41
For n independent Uniform(0, 1) points, B is the jth order statistic. The event B ≤ p means at least j of the
points lie at or below p. Their count is Bin(n, p), so P(B ≤ p) = P(X ≥ j).


Exercise 42
With probability one there are no ties among i.i.d. continuous variables. Exactly one of X, Y, Z is the smallest.
The three events are disjoint and their union has probability one, so their probabilities sum to one.


Exercise 43
Let B be the jth order statistic of n independent Uniform(0, 1) variables. Its density is
                                                          n!
                                        fB (t) =                    tj−1 (1 − t)n−j .
                                                   (j − 1)!(n − j)!
The integral on the left is P(B ≤ x). By the story inPExercise
                                                              41, this is the probability that at least j of n
                                                       n
independent Bernoulli(x) trials are successes, namely k=j nk xk (1 − x)n−k . This proves the identity without
integrating.


Exercise 44
Let Ui = F (Xi ). Strict increase of F makes the ordering of the Ui identical to that of the Xi , and the probability
integral transform gives i.i.d. Uniform(0, 1) variables. Since U(j) ∼ Beta(j, n − j + 1), set u = F (x) and use
du/dx = f (x):
                                                  n!
                               fX(j) (x) =                  F (x)j−1 [1 − F (x)]n−j f (x).
                                           (j − 1)!(n − j)!


Exercise 45
(a) For t > 0, FM (t) = [1 − e−λt ]2 , so
                                                fM (t) = 2λ(e−λt − e−2λt ).
The convolution density of X + Y /2, where X ∼ Expo(λ) and Y /2 ∼ Expo(2λ) independently, is the same
expression. Hence the laws agree. (b) The maximum is the smaller of two independent exponentials’ survival
times; equivalently, its CDF is the square above. The memoryless property gives an independent waiting time for
the second completion after the first, with rate λ, while the first completion is Expo(2λ). Their sum is distributed
as Expo(2λ) + Expo(λ), which has the same law as X + Y /2 with suitable independent exponential variables.


Exercise 46
(a) In the discrete case, P(M = x) includes the probability of a tie at x, so the formula 2F (x)f (x) double-counts
the tie mass and is not correct. The correct identity is P(M = x) = F (x)2 − F (x− )2 . (b) The possible pairs (M, L)
and their probabilities are
                                                         L=0 L=1
                                               M =0       1/4     0
                                               M =1       1/2    1/4
Thus M ∼ Bern(3/4) and L ∼ Bern(1/4).


Exercise 47
For x ≤ y,
                                            P(Mn ≤ x, Mn+1 ≤ y) = F (x)n F (y).
For x > y, the second event implies the first, so the joint CDF equals F (y)n+1 . Hence
                                                         (
                                                          F (x)n F (y), x ≤ y,
                                    FMn ,Mn+1 (x, y) =
                                                          F (y)n+1 ,    x > y.

                                                              9


Introduction to Probability                                                                      Chapter 8: Transformations


Exercise 48
For x < y, choose i − 1 observations below x, one in dx at x, j − i − 1 between x and y, one in dy at y, and n − j
above y. The multinomial coefficient gives

                                              n!
          fX(i) ,X(j) (x, y) =                                F (x)i−1 [F (y) − F (x)]j−i−1 [1 − F (y)]n−j f (x)f (y),
                                 (i − 1)!(j − i − 1)!(n − j)!

for x < y, and zero otherwise.


Exercise 49
                                                             2
Let T = min(X, Y ) = (X + Y − |X − Y |)/2. For i.i.d.
                                                    √ N (0, σ ) variables, S = X + Y and D = X − Y are
                                 2
independent, with S, D ∼ N (0, 2σ ). Also E|D| = 2σ/ π. Hence
                                                          1         σ
                                                    ET = − E|D| = − √ .
                                                          2          π
For the variance, Var(|D|) = 2σ 2 − 4σ 2 /π, so
                                                   1
                                       Var(T ) =     {Var(S) + Var(|D|)} = σ 2 (1 − 1/π).
                                                   4
With σ = 8, this gives the two stated answers.


Exercise 50
Among n + 1 i.i.d. continuous observations, the rank of Ynew is uniform on 1, . . . , n + 1. It lies between Y(j) and
Y(k) exactly when its rank is one of j + 1, . . . , k. Thus

                                                                             k−j
                                                P(Ynew ∈ [Y(j) , Y(k) ]) =       .
                                                                             n+1

For n = 99, choose k − j = 95, e.g. the interval [Y(2) , Y(97) ], whose coverage is 95/100 = 0.95.


Exercise 51
Let n = 2m + 1 and let c be a median of the parent distribution, so F (c) = 1/2 (for continuous F ). The sample
median X(m+1) is at most c exactly when at least m + 1 observations are at most c. This count is Bin(2m + 1, 1/2),
whose symmetry gives probability 1/2. Thus c is a median of the sample-median distribution.


Mixed practice
Exercise 52
        − log Uj , P(Xj > x) = P(Uj < e−x ) = e−x for x > 0, so Xj ∼ Expo(1). Then S =
                                                                                                        P
For Xj =Q                                                                                                   Xj ∼ Gamma(n, 1)
and P = Uj = e−S . Transforming s = − log p gives

                                                         (− log p)n−1
                                              fP (p) =                ,   0 < p < 1.
                                                           (n − 1)!


Exercise 53
(a) There are 115 − 6 + 1 = 110 possible starting positions. Each specified CATCAT block has probability (p2 p1 p3 )2 .
By linearity of expectation,
                                                  EN = 110p21 p22 p23 .
Overlaps do not change this expectation. (b) Ignore all letters except A and C. The first of these is A with
probability p1 /(p1 + p2 ). (c) The prior for p2 is Beta(1, 1). The three letters CAT contain one C and two non-C
letters, so the posterior is Beta(2, 3). The predictive probability that the next letter is C is its posterior mean,
 2/5 .


                                                                10


Introduction to Probability                                                            Chapter 8: Transformations


Exercise 54
Let G be the number of failures before one success. Its MGF is
                                            X                           p
                                   MG (t) =     p(1 − p)k etk =                 .
                                                                  1 − (1 − p)et
                                              k≥0

                                                                                             p
The number X of failures before r successes is a sum of r independent copies of G. For Yp = 1−p X,
                                                                        r
                                                           p
                                        MYp (t) =                             .
                                                  1 − (1 − p)etp/(1−p)

As p → 0, (1 − p)etp/(1−p) = 1 + p(t − 1) + o(p), so the bracket tends to (1 − t)−1 for t < 1. Therefore
MYp (t) → (1 − t)−r , the MGF of Gamma(r, 1) , with density y r−1 e−y /(r − 1)! for y > 0. Intuitively, when success
is rare, the waiting time for each success is approximately exponential after scaling by the success probability; the
total waiting time for r successes is therefore approximately a sum of r independent exponentials, i.e. Gamma(r, 1).




                                                         11
```
