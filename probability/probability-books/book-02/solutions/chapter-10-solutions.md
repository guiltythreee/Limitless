# Chapter 10: Inequalities and Limit Theorems — Detailed Solutions

**Book:** Introduction to Probability, Second Edition  
**Authors:** Joseph K. Blitzstein and Jessica Hwang

> Source transcription from the supplied chapter-solution PDF. The solution numbering and worked reasoning are retained. Mathematical notation should be checked against the original source if a character appears ambiguous.

```text
INTRODUCTION TO PROBABILITY


                               Detailed Solutions
               Chapter 10 – Inequalities and Limit Theorems


                          Complete worked solutions to Exercises 1–39




Scope. This volume follows Section 10.7 of the supplied chapter and retains the exercise numbering and
subparts. The solutions distinguish exact identities and bounds from normal approximations and limiting
statements. The book’s convention for Geom(p) is the number of failures before the first success, with support
0, 1, 2, . . ..


Introduction to Probability       Chapter 10: Inequalities and Limit Theorems


Contents
Inequalities                                                               2

LLN and CLT                                                                7

Mixed practice                                                             9




                              1


Introduction to Probability                                                    Chapter 10: Inequalities and Limit Theorems


Inequalities
Exercise 1
         = 1 if the ith sampled person supports the policy and 0 otherwise. Then Ii ∼ Bern(p) independently and
Write Ii P
           n
pb = n−1 i=1 Ii . Hence
                                                              p(1 − p)     1
                                      Ebp = p,     Var(bp) =           ≤     .
                                                                  n       4n
Chebyshev’s inequality gives
                                                           Var(bp)     1
                                            p − p| > c) ≤
                                         P(|b                      ≤      .
                                                             c2      4nc2


Exercise 2
The sample mean has variance Var(X̄n ) = σ 2 /n. We want P(|X̄n − µ| < 2σ) ≥ 0.99. By Chebyshev,

                                                                       σ 2 /n    1
                                         P(|X̄n − µ| ≥ 2σ) ≤                  =    .
                                                                       (2σ)2    4n

It is enough that 1/(4n) ≤ 0.01, or n ≥ 25. Thus the requested specific sample size is

                                                          n = 25.


Exercise 3
                           p       p
Apply Cauchy–Schwarz to     X/Y and Y /X:

                                           1 = (E1)2 ≤ E(X/Y ) E(Y /X).

Equality in Cauchy–Schwarz requires the two random variables to be proportional almost surely, which here
requires X/Y to be constant almost surely. The question excludes that case. Therefore

                                                  E(X/Y ) E(Y /X) > 1.


Exercise 4
Choose an index uniformly from {1, . . . , n} and let X equal the corresponding aj . Equivalently, if some values
repeat, assign each distinct value probability equal to its multiplicity divided by n. Then
                                              n                                     n
                                           1X                                 1X
                                    EX =         aj ,          E log X =            log aj .
                                           n j=1                              n j=1

Since log is concave, Jensen’s inequality gives
                                                                                   
                                            n                            n
                                           1X                           1X
                                                   log aj ≤ log               aj  .
                                           n j=1                       n j=1

Exponentiating both sides proves
                                                         1/n
                                                  n                       n
                                                  Y                    1X
                                                       aj        ≤         aj .
                                                  j=1
                                                                       n j=1




                                                               2


Introduction to Probability                                                   Chapter 10: Inequalities and Limit Theorems


Exercise 5
Let q = 1 − p. Under the book’s convention, X ∼ Geom(p) has P(X = k) = pq k , k ≥ 0. (a) Its entropy is
                                                  ∞
                                                  X
                                       H(X) = −         pq k log2 (pq k )
                                                  k=0
                                                                ∞
                                                                              !
                                                                X
                                              = − log2 p −            kpq k       log2 q
                                                                k=0
                                                                q
                                              = − log2 p −        log2 q .
                                                                p

The sum in parentheses is EX = q/p.
                                                                                                  P
(b) Let pk = P(X = xk ) and let W take value pk with probability pk . Then E(log2 W ) =             k pk log2 pk = −H(X).
By concavity of the logarithm,
                                                                              !
                                                                        X
                                −H(X) = E log2 W ≤ log2 EW = log2          p2k .
                                                                                      k

                                                  2
                                            P
For independent copies X, Y , P(X = Y ) =      k pk . Exponentiating yields


                                                P(X = Y ) ≥ 2−H(X) .


Exercise 6
Let Z = (X − µ)2 ≥ 0. Since z 7→ z 2 is convex, Jensen gives

                                        E(X − µ)4 = E(Z 2 ) ≥ (EZ)2 = σ 4 .

For σ 2 > 0, excess kurtosis is E(X − µ)4 /σ 4 − 3, and therefore

                                           excess kurtosis ≥ 1 − 3 = −2.


Exercise 7
The answers are listed with the reason for each comparison.
 (a) ≤ . Jensen for the concave logarithm gives E log X ≤ log EX.

(b) ≤ . Cauchy–Schwarz gives (EX)2 ≤ E(X 2 ); X > 0.

(c) = . The identity sin2 X + cos2 X = 1 holds pointwise.
                                      p
(d) ≤ . Cauchy–Schwarz gives E|X| ≤ E(X 2 ).

 (e) ≤ . Markov applied to X 3 gives P(X > c) ≤ E(X 3 )/c3 .
 (f) = . Since X, Y are identically distributed, swapping them shows P(X ≤ Y ) = P(X ≥ Y ), including any tie
     probability.
                                           p
 (g) ≤ . Cauchy–Schwarz gives E(XY ) ≤ E(X 2 )E(Y 2 ).

(h) ≤ . If X + Y > 10, at least one of X, Y must exceed 5.

 (i) ≤ . Since min(X, Y ) ≤ X and min(X, Y ) ≤ Y , its expectation is at most both EX and EY .

 (j) ≥ . Independence and identical distribution give E(X/Y ) = EX E(1/Y ). Jensen for 1/y gives E(1/Y ) ≥
     1/EY , so this is at least EX/EY .
(k) ≥ . Independence gives the right side as (EX 2 )2 + EX 2 , while the left side is EX 4 + EX 2 . Jensen gives
    EX 4 ≥ (EX 2 )2 .
 (l) = . By symmetry, the two expectations are equal; the two fractions add to 1, so each expectation is 1/2.


                                                            3


Introduction to Probability                                            Chapter 10: Inequalities and Limit Theorems


Exercise 8
(a) ≥ . Two dice total 9 in four ordered ways and total 10 in three, so the probabilities are 4/36 and 3/36.

(b) ≥ . For 20 flips the probability is P(Bin(20, 1/2) ≥ 13) = 0.1316 . . .. For 2000 flips, Hoeffding’s inequality
                                             2
    bounds the probability by e−2(2000)(0.15) = e−90 , which is far smaller.
                                                  √       √
(c) ≤ . The square-root function is concave, so E X ≤ EX.

(d) ? . Sine is not globally convex or concave; the comparison can go either way.

(e) ≥ . The event {X > 2, Y > 2} is contained in {X + Y > 4}. Independence makes its probability
    P(X > 2)P(Y > 2).
 (f) = . Expanding and using identical distributions gives E(X + Y )2 = 2E(X 2 ) + 2(EX)2 .


Exercise 9
(a) ≤ . Jensen for the convex function e−x gives e−EX ≤ E(e−X ).
(b) = . The pair (X, Y ) has the same distribution as (Y, X).

(c) ≤ . The event X > Y + 3 is contained in X > Y − 3.

(d) ≥ . Cauchy–Schwarz gives (EXY )2 ≤ (EX 2 )(EY 2 ) = (EX 2 )2 , and Jensen gives EX 4 ≥ (EX 2 )2 .

(e) ≥ . The law of total variance states Var(Y ) = E[Var(Y | X)] + Var(E[Y | X]).

 (f) ≤ . Markov and the triangle inequality give P(|X + Y | > 3) ≤ E|X + Y |/3 ≤ 2E|X|/3 ≤ E|X|.


Exercise 10
(a) ≤ . Cauchy–Schwarz gives (EXY )2 ≤ E(X 2 )E(Y 2 ).

(b) ≤ . If |X +Y | > 2, then (X +Y )4 > 16. Markov gives the stronger bound P(|X +Y | > 2) ≤ E[(X +Y )4 ]/16 ≤
    E[(X + Y )4 ]/10.
(c) ≤ . Jensen for the concave logarithm gives E log(X + 3) ≤ log E(X + 3).

(d) ≥ . Both x2 and ex are increasing on x > 0, so their covariance is nonnegative. One direct proof uses an
    independent copy X ′ : 2 Cov(f (X), g(X)) = E[(f (X) − f (X ′ ))(g(X) − g(X ′ ))] ≥ 0.
(e) ? . The joint probability P(X = 1, Y = 1) can be either larger or smaller than P(X = 1)P(Y = 1) when
    dependence is unrestricted. Since {X = 1, Y = 1} ⊆ {X + Y = 2}, this alone does not determine the
    comparison with the product of the marginals.
 (f) ≤ . If X + Y = 2 and both variables are positive, at least one of them is at least 1. Thus {X + Y = 2} ⊆
     {X ≥ 1} ∪ {Y ≥ 1}.


Exercise 11
                                                               √
(a) ≤ . Cauchy–Schwarz applied to X and X 2 gives EX 3 ≤            EX 2 EX 4 .

(b) ≤ . Markov applied to (X + Y )4 gives P(|X + Y | > 2) ≤ E[(X + Y )4 ]/16.
                                                  √         √
(c) ≤ . Jensen for the concave square root gives E X + 3 ≤ EX + 3.
(d) = . The trigonometric identity is pointwise.
(e) = . The random variables X + 3 and X generate the same information, so conditioning on either is equivalent.

 (f) ≥ . By total expectation, E[E(Y 2 | X)] = E(Y 2 ) ≥ (EY )2 .




                                                        4


Introduction to Probability                                         Chapter 10: Inequalities and Limit Theorems


Exercise 12
(a) ≤ . Markov gives P(X + Y > 2) ≤ E(X + Y )/2.

(b) ≥ . Since Y > 0, the event X > 3 implies X + Y > 3.

(c) ? . Cosine is not globally convex or concave.

(d) ≤ . The function x1/3 is concave on x > 0; apply Jensen.

(e) ? . The function (x, y) 7→ xy has no global convexity or concavity that would impose this comparison.
 (f) = . Apply the law of total expectation to each term: E[E(X | Y )] + E[E(Y | X)] = EX + EY .


Exercise 13
(a) ≥ . Jensen for the exponential gives EeX+Y ≥ eEX+EY = e2EX .
                                           p
(b) ≤ . Cauchy–Schwarz gives E(X 2 eX ) ≤ E(X 4 )E(e2X ).
(c) = . The information in 3X or 2X is exactly the information in X, so both conditional expectations equal X.
(d) = . The defining property of conditional expectation gives E[X 7 Y ] = E[X 7 E(Y | X)].

(e) ≥ . Pointwise AM–GM gives X/Y + Y /X ≥ 2.

 (f) ≤ . Since X, Y are independent and identically distributed, Var(X − Y ) = 2 Var(X). Chebyshev gives
     P(|X − Y | > 2) ≤ 2 Var(X)/4 = Var(X)/2.


Exercise 14
Here X, Y are i.i.d. Gamma(1/2, 1/2), with the second parameter interpreted as a rate, and Z ∼ N (0, 1).
(a) = . By exchangeability and continuity, P(X < Y ) = 1/2.

(b) ? . The marginals of X and Z 2 agree, but their dependence is unspecified. If X = Z 2 , the probability is 1; if
    they are independent, it is 0.
(c) < . Since X, Y > 0, the threshold 1/(X 1/4 + Y 1/4 ) is strictly positive. The event implies Z > 0, so its
    probability is at most 1/2 < 1.
(d) = . The ratio X/(X + Y ) is independent of X + Y and has mean 1/2. Also X + Y ∼ Gamma(1, 1/2), so
    E[(X + Y )2 ] = 8. Thus the left side is 4. On the right, EX = 1 and EX 2 = 3, also giving 4.
                                              p
(e) ≤ . Cauchy–Schwarz gives E(X 2 Z 2 ) ≤ E(X 4 )E(Z 4 ). Since Z is standard Normal, EZ 4 = 3 = EX 2 .

 (f) ≥ . For this Gamma law, EX = 1, EX 2 = 3, EX 3 = 15, and EX 4 = 105. Independence gives

                               E(X + 2Y )4 = 105 + 8(15)(1) + 24(3)(3)
                                               + 32(1)(15) + 16(105) = 2601 > 34 = 81.


Exercise 15
(a) ≤ . Since X 2 + Y 2 + Z 2 has mean 3, Markov gives its probability of exceeding 6 at most 1/2.

(b) ≥ . P(X 2 < 1) = 2Φ(1) − 1 ≈ 0.6827 > 2/3.

(c) ≥ . By symmetry, the three expected ratios E[X 2 /(X 2 + Y 2 + Z 2 )] are equal and sum to 1. Each is 1/3 ≥ 1/4.
(d) = . The probability integral transform gives Φ(X) ∼ Unif(0, 1), whose variance is 1/12. The three terms are
    independent, so the variance of their sum is 3/12 = 1/4.
(e) = . By symmetry of the standard Normal, Ee−X = EeX = e1/2 .
                                        √            √
(f) ≤ . Cauchy–Schwarz gives E(|X|eX ) ≤ EX 2 Ee2X = Ee2X .




                                                         5


Introduction to Probability                                          Chapter 10: Inequalities and Limit Theorems


Exercise 16
(a) ≥ . Markov gives P(X > 3) ≤ EX/3 = 1/3, hence F (3) ≥ 2/3.

(b) ≤ . If each of X, Y, Z is at most 3, then their sum is at most 9. Thus {X ≤ 3, Y ≤ 3, Z ≤ 3} ⊆ {X+Y +Z ≤ 9};
    independence gives the left probability as F (3)3 .
(c) = . The four ratios of the squared variables to their sum add to 1 and have equal expectations by symmetry,
    so each expectation is 1/4.
(d) ≤ . Independence gives E(XY ZW ) = (EX)4 = 1. Jensen gives E(X 4 ) ≥ (EX)4 = 1.

(e) ≤ . The law of total variance gives Var(Y ) = E Var(Y | X) + Var(E(Y | X)).
 (f) = . Cov(X + Y, X − Y ) = Var(X) − Var(Y ) = 0 because X, Y are identically distributed.


Exercise 17
(a) = . For three i.i.d. continuous variables, all six strict orderings are equally likely, so P(X < Y < Z) = 1/6.

(b) ≤ . Markov gives P(X > 1) ≤ EX.

(c) ≤ . Put r = (X 2 + 1)/(X 2 + 2). The finite sum is smaller than the infinite geometric sum 1/(1 − r) = X 2 + 2.
    If the finite sum exceeds 3, then X 2 + 2 > 3, so X 2 > 1. Thus the first event is contained in the second.
                                                     √            √
(d) ≤ . Jensen for the concave square root gives E X 2 + Y 2 ≤ EX 2 + EY 2 .

(e) ≥ . Conditional variance is nonnegative, while Var(X 2 | X) = 0 because X 2 is known when X is known.
 (f) = . Independence gives Var(X − 2Y + 3Z) = (1 + 4 + 9) Var(X) = 14 Var(X).


Exercise 18
(a) ≤ . For i.i.d. discrete variables, ties may occur. The six strict orderings have equal probabilities and together
    have probability at most 1, so each has probability at most 1/6.
(b) ≤ . Markov gives P(X + Y + Z > n) ≤ E(X + Y + Z)/n = 3np/n = 3p.
                                                                        2
(c) = . For integer X ≤ 2, the truncated series is strictly below eX +1 ≤ e5 . For integer X ≥ 3, even its first
    four terms exceed e5 . Hence the series exceeds e5 exactly when X > 2.
(d) = . The Binomial MGF gives EeX = (1 − p + pe)n .

(e) ≤ . Var(X + Y ) = 2np(1 − p) ≤ n/2.
 (f) = . Given X + Y = n, the conditional distribution is X | (X + Y = n) ∼ Bin(n, 1/2), with mean n/2.


Exercise 19
(a) = . The variable X + Y − Z + W is Normal with mean 2c and variance 4c2 . Therefore P(X + Y ≤ Z − W ) =
    Φ(−1).
(b) > . Let A = X 4 − Y 8 and B = Z 4 − W 8 . They are i.i.d. continuous random variables, so P(A ≤ B) = 1/2 >
    Φ(−1).
(c) ? . Since X ∼ N (c, c2 ), E(X − c)2 = c2 ; the comparison with c changes at c = 1.

(d) ≤ . A centered Normal variable has zero third moment, so E(X − c)3 = 0 < c.

(e) = . E(X 2 ) = 2c2 and EX = c, so E( 14 X 2 + X) = c2 /2 + c.
 (f) = . The Normal MGF gives log E(eX ) = c + c2 /2.




                                                         6


Introduction to Probability                                            Chapter 10: Inequalities and Limit Theorems


Exercise 20
 (a) ≥ . For identically distributed integer-valued variables, P(X ≤ Y ) = 21 + 12 P(X = Y ) ≥ 1/2.

(b) > . X + Y ∼ Pois(2λ), so P(X + Y ≤ 1) = e−2λ (1 + 2λ) > 3e−2λ because λ > 1.
 (c) > . Independence and the Poisson MGF give EeX+Y = exp(2λ(e − 1)) > e2λ .
(d) = . The conditional law is X | (X + Y = 4) ∼ Bin(4, 1/2), whose mean is 2.
 (e) = . The same conditional Binomial law has variance 4(1/2)(1/2) = 1.
 (f) = . E(X 2 − Y ) = λ2 + λ − λ = λ2 .


LLN and CLT
Exercise 21
By the strong law of large numbers,
                                   n                    n
                               1X                   1X
                                     Xi −→ 2,             Yi −→ 3      almost surely.
                               n i=1                n i=1

On the probability-one event where both convergences hold, the denominator tends to the nonzero number 3. The
ratio therefore converges almost surely to 2/3:

                                            X1 + · · · + Xn   2
                                                            →       a.s.
                                            Y1 + · · · + Yn   3

No independence between the two sequences is needed. The SLLN is applied separately to each i.i.d. sequence,
and the intersection of two probability-one events still has probability one.


Exercise 22
(a) A Uniform(0, 1) variable has mean 1/2 and variance 1/12. Thus EX = 60/2 = 30 and Var(X) = 60/12 = 5.
The CLT says that the sum is approximately

                                                  X ≈ N (30, 5).

(b) Since X is integer-valued, X > 17 is X ≥ 18. With a continuity correction,
                                                               
                                            17.5 − 30        12.5
                        P(X > 17) ≈ 1 − Φ      √        =Φ √        = Φ(5.59 . . .) ≈ 1 .
                                                 5              5
The normal tail is already negligible at more than five standard deviations above the mean.


Exercise 23
(a) For Vn ∼ χ2n , EVn = n and Var(Vn ) = 2n. Standardization gives

                                       1                       Vn − n
                                 an = √ ,         bn = n,       √     ⇒ N (0, 1).
                                       2n                         2n
                                          p
(b) Write a Student-tn variable as Tn = Z/ Vn /n, where Z ∼ N (0, 1) is independent of Vn . Then

                                                  Tn2        Z2
                                                        =          .
                                                n + Tn2   Z 2 + Vn

Now Z 2 ∼ χ21 and Vn ∼ χ2n independently. The ratio of two independent chi-square variables divided by their sum
has a Beta law, so
                                             Tn2
                                                                
                                                             1 n
                                                   ∼  Beta    ,    .
                                           n + Tn2           2 2


                                                         7


Introduction to Probability                                                       Chapter 10: Inequalities and Limit Theorems


Exercise 24
A Student-tm variable with m ≥ 3 has mean 0 and variance m/(m − 2). The i.i.d. variables therefore have finite
variance, so the CLT applies to their sum:
                                               T + · · · + Tn
                                               p1             ⇒ N (0, 1).
                                                nm/(m − 2)

Thus one valid choice is
                                                      r
                                                          m−2
                                               an =           ,           bn = 0.
                                                           mn


Exercise 25
(a) If X ∼ Expo(3) (rate 3) and Y = eX , then
                                                3   3                                            3
                             EY = MX (1) =         = ,             EY 2 = MX (2) =                  = 3.
                                               3−1  2                                           3−2
Therefore
                                                                               2
                                               3                               3    3
                                      EY =       ,      Var(Y ) = 3 −              = .
                                               2                               2    4

(b) The CLT gives, for large n,
                                                                         
                                                                   3 3
                                                     Ȳn ≈ N        ,         .
                                                                   2 4n


Exercise 26
(a) A Pois(n) variable is the sum of n independent Pois(1) variables. Each summand has mean and variance 1.
The CLT therefore gives
                                       N ∼ Pois(n) ≈ N (n, n) (n large).

(b) Apply the continuity correction at the mean:
                                                                                                     
                                                                                      1              1
                       P(N = n) = P(n − 1/2 < N < n + 1/2) ≈ Φ                        √         −Φ − √    .
                                                                                      2 n           2 n

For large n, the interval is narrow and the Normal density is nearly constant at its center, so this is approximately
                                                               1
                                                           √       .
                                                               2πn

But exactly P(N = n) = e−n nn /n!. Equating the two approximations gives

                                     e−n nn    1                          √            n n
                                            ≈√     ,               n! ≈       2πn               ,
                                       n!      2πn                                     e

which is Stirling’s formula.


Exercise 27
(a) For Xj ∼ Pois(λ), MXj (t) = exp(λ(et − 1)). Independence gives
                                               n
                                               Y                                
                                  MX̄n (t) =         MXj (t/n) = exp nλ(et/n − 1) .
                                               j=1


(b) Since n(et/n − 1) → t,
                                                      MX̄n (t) −→ eλt .

This is the MGF of the constant random variable λ, as expected from the law of large numbers.


                                                               8


Introduction to Probability                                              Chapter 10: Inequalities and Limit Theorems


Exercise 28
                  √
Let Zn = (Xn − n)/ n, where Xn ∼ Pois(n). Its MGF is
                                                    √         √ 
                                 MZn (t) = exp n(et/ n − 1) − t n .
                                             √
Using eu = 1 + u + u2 /2 + O(u3 ) with u = t/ n, the exponent becomes

                                         t2                √     t2
                                                      
                                   t
                             n √ +          + O(n−3/2 ) − t n =     + O(n−1/2 ).
                                    n 2n                          2
                   2
Thus MZn (t) → et /2 in a neighborhood of zero, which is the MGF of a standard Normal variable. Hence

                                                   Xn − n
                                                    √     ⇒ N (0, 1).
                                                      n


Exercise 29
Let Ij = 1 if the jth confidence interval covers its corresponding fixed parameter θj , and 0 otherwise. By the
definition of a 95% confidence interval, EIj = P(Ij = 1) = 0.95. The independent interval constructions make these
indicators i.i.d. Bernoulli(0.95). The SLLN gives
                                             n
                                         1X
                                               Ij −→ 0.95        almost surely.
                                         n j=1


Exercise 30
(a) With half the fortune invested, an up day multiplies wealth by 1 + 0.7/2 = 1.35, and a down day multiplies it
by 1 − 0.5/2 = 0.75. The daily log multipliers are i.i.d. and equally likely. By the SLLN,
                         1     Yn    1           1           1
                           log     −→ log(1.35) + log(0.75) = log(1.0125) > 0             a.s.
                         n     100   2           2           2

Therefore Yn → ∞ almost surely.
(b) If fraction α is invested, the two daily factors are 1 + 0.7α and 1 − 0.5α. Thus

                                             1                1
                                    g(α) =     log(1 + 0.7α) + log(1 − 0.5α).
                                             2                2

For 0 ≤ α ≤ 1, differentiate:                                               
                                        ′      1            0.7      0.5
                                       g (α) =                   −                .
                                               2         1 + 0.7α 1 − 0.5α
The unique critical point solves 0.7(1 − 0.5α) = 0.5(1 + 0.7α), hence α = 2/7. Also

                                                     0.72          0.52
                                                                          
                                               1
                                  g ′′ (α) = −               +               < 0,
                                               2 (1 + 0.7α)2   (1 − 0.5α)2

so this is the unique maximum. The SLLN applied to daily log returns proves n−1 log Yn → g(α) almost surely.


Mixed practice
Exercise 31
Let A be the number of votes for candidate A. Then A ∼ Bin(n, 1/2) and a tie occurs when A = n/2. (a) The
continuity-corrected Normal approximation is

                                  P(A = n/2) ≈ P(n/2 − 1/2 < N < n/2 + 1/2),

where N ∼ N (n/2, n/4). Hence
                                                               √
                                                 P(tie) ≈ 2Φ(1/ n) − 1.


                                                             9


Introduction to Probability                                          Chapter 10: Inequalities and Limit Theorems


                                √                         √
(b) For small x, Φ(x) = 1/2 + x/ 2π + o(x). Taking x = 1/ n gives
                                                    r
                                          √             2       1
                                    2Φ(1/ n) − 1 ≈         =p        .
                                                       πn     (π/2)n

Thus c = π/2.


Exercise 32
(a) Each play multiplies wealth by 3 with probability 1/3 and by 1/3 with probability 2/3. Its mean multiplier is
3(1/3) + (1/3)(2/3) = 11/9. Independence gives

                                EXn = (11/9)n ,    EX1 = 11/9,      EX2 = (11/9)2 .

(b) Since 11/9 > 1, EXn → ∞.
(c) Each game is a success (tripling) with probability 1/3, so the SLLN gives

                                           Yn /n → 1/3    almost surely.

(d) The wealth is Xn = 3Yn 3−(n−Yn ) = 32Yn −n . Therefore
                                                   
                              1              Yn                1
                                log Xn = 2       − 1 log 3 −→ − log 3 < 0       a.s.
                              n               n                3

Thus Xn → 0 almost surely, even though its expectation diverges.


Exercise 33
(a) Since T2 = E(T1 | R), conditional Jensen for the square gives

                                (T2 − θ)2 = {E(T1 − θ | R)}2 ≤ E{(T1 − θ)2 | R}.

Taking expectations gives E(T2 − θ)2 ≤ E(T1 − θ)2 . The inequality is strict because P(T1 ̸= T2 ) > 0; equivalently,
the conditional variance Var(T1 | R) is positive with positive probability.
(b) By the tower property, ET2 = ET1 , so the two estimators have the same bias. Eve’s law gives

                      Var(T1 ) = E Var(T1 | R) + Var(E(T1 | R)) = E Var(T1 | R) + Var(T2 ).

The first term is strictly positive under the stated nontriviality condition. Equal bias and smaller variance imply
smaller MSE for T2 .
             Pn
(c) Let S = j=1 Xj . Conditional on S, exchangeability makes the conditional expectations of all Xj equal, and
their sum is S. Therefore
                                            T2 = E(X1 | S) = S/n = X̄n .

If Var(Xj ) = σ 2 > 0, then MSE(T1 ) = σ 2 and MSE(T2 ) = σ 2 /n, which is strictly smaller for n ≥ 2. The fixed
T1 = X1 does not converge to θ for a nondegenerate distribution, whereas T2 = X̄n → θ almost surely by the
SLLN.


Exercise 34
Let S = X1 + · · · + Xn ∼ Pois(nλ) and θ = e−λ . (a) Using independence and the Poisson MGF,
                                              h         in
                              ETn = Ee−X̄n = Ee−X1 /n = exp{nλ(e−1/n − 1)}.

Since e−1/n > 1 − 1/n, this is greater than e−λ = θ. Thus Tn is biased upward (for finite n).
(b) The SLLN gives X̄n → λ almost surely. Continuity of the exponential gives Tn = e−X̄n → e−λ = θ almost
surely, so the estimator is consistent.
(c) Each indicator I(Xj = 0) has expectation e−λ , hence W = n−1 j I(Xj = 0) is unbiased. Given S = s,
                                                                     P
X1 ∼ Bin(s, 1/n), so
                                        P(X1 = 0 | S = s) = (1 − 1/n)s .


                                                         10


Introduction to Probability                                           Chapter 10: Inequalities and Limit Theorems


By symmetry,
                                            f = E(W | S) = (1 − 1/n)S .
                                            W

Since S ∼ Pois(nλ),
                               f = E(1 − 1/n)S = exp{nλ((1 − 1/n) − 1)} = e−λ = θ,
                              EW
so W
   f is also unbiased.
(d) Eve’s law gives

                 Var(W ) = E Var(W | S) + Var(E(W | S)) = E Var(W | S) + Var(W
                                                                             f ) ≥ Var(W
                                                                                       f ).

Thus conditioning on the total number of typos cannot increase variance. For n ≥ 2 and λ > 0, the inequality is
strict: when S = 2, there is positive conditional probability that the two typos fall on the same page or on different
pages, so W is not determined by S.


Exercise 35
(a) Because the sequence is i.i.d. Bernoulli(p) and p is known, the past provides no information about the next bit.
Predict 1 if p > 1/2, predict 0 if p < 1/2, and either value if p = 1/2. The probability of a correct prediction on
every step is
                                                   max(p, 1 − p).

(b) For p > 1/2, the observed proportion of ones eventually exceeds 1/2 almost surely by the SLLN, so the strategy
eventually predicts 1. For p < 1/2, it eventually predicts 0. The next bit is independent of the past, so the limiting
probability of a correct prediction is
                                                    max(p, 1 − p).

For p = 1/2, every prediction has success probability exactly 1/2, so the same formula applies.
(c) A deterministic adversary that knows the rule can choose each next bit to be the opposite of the strategy’s
prediction based on the preceding history. This recursive construction makes every prediction wrong.


Exercise 36
(a) Since X 2 , Y 2 are independent χ21 variables,

                                R2 = X 2 + Y 2 ∼ χ22 = Gamma(1, 1/2) = Expo(1/2),

where the Gamma and Exponential parametrizations use a rate of 1/2.
(b) The density of W = R2 is fW (w) = 21 e−w/2 for w > 0. With w = r2 and dw/dr = 2r,

                                                           2
                                             fR (r) = re−r /2 ,    r > 0,

the Rayleigh density.
(c) X − 2Y ∼ N (0, 1 + 4) = N (0, 5). Hence
                                                            √          √
                                    P(X > 2Y + 3) = 1 − Φ(3/ 5) = Φ(−3/ 5).

(d)
                      Cov(R2 , X) = Cov(X 2 + Y 2 , X) = EX 3 + E(XY 2 ) − E(X 2 + Y 2 )EX = 0.
They are not independent, however: R2 < 1 implies |X| < 1. Both events {R2 < 1} and {|X| ≥ 1} have positive
probability, but they are disjoint; independent events with positive probabilities cannot be disjoint. Thus zero
covariance does not imply independence here.




                                                          11


Introduction to Probability                                               Chapter 10: Inequalities and Limit Theorems


Exercise 37
(a) The probability integral transform gives Φ(Z1 ) ∼ Unif(0, 1). Therefore

                                               X = − log Φ(Z1 ) ∼ Expo(1).

(b) R = (Z12 + · · · + Zn2 )1/2 has the chi distribution with density
                                                     1               2
                                    fR (r) =                 rn−1 e−r /2 ,          r > 0.
                                               2n/2−1 Γ(n/2)

Consequently, the requested integral (not evaluated) is
                                                            Z ∞
                                                  1                             2
                                     EY =                         e−r rn−1 e−r /2 dr.
                                            2n/2−1 Γ(n/2)     0


(c) The pair (X1 , X2 ) is jointly Normal because it is a linear transformation of (Z1 , Z2 ). Its covariance is

                                     Cov(3Z1 − 2Z2 , 4Z1 + 6Z2 ) = 12 − 12 = 0.

For jointly Normal variables, zero covariance implies independence. Thus X1 and X2 are independent.


Exercise 38
The ratio is Wn = X1 /(X1 + · · · + Xn ). (a) By exchangeability, each Xj /(X1 + · · · + Xn ) has the same expectation.
Since these n ratios sum to 1,
                                                    EWn = 1/n.

(b) Rewrite
                                                               X1
                                               nWn =                        .
                                                       (X1 + · · · + Xn )/n
The SLLN makes the denominator converge almost surely to µ, so

                                            nWn −→ X1 /µ almost surely.

(c) For Xj ∼ Expo(λ), X1 ∼ Gamma(1, λ) and X2 +· · ·+Xn ∼ Gamma(n−1, λ) independently. The Gamma–Beta
relationship gives
                       Wn ∼ Beta(1, n − 1), fWn (w) = (n − 1)(1 − w)n−2 , 0 < w < 1,
for n ≥ 2. For n = 1, W1 = 1 deterministically.


Exercise 39
(a) Each Xj exceeds or equals 1 with probability e−1 . Therefore the number of failures before the first such
observation is
                              N − 1 ∼ Geom(e−1 ),      EN = 1 + (e − 1) = e.

(b) The i.i.d. Expo(1) variables are the interarrival times of a rate-one Poisson process. The number of arrivals by
time 10 is Poisson(10), and this is M − 1. Hence

                                          M − 1 ∼ Pois(10),         EM = 11.

(c) The sum Sn = X1 + · · · + Xn has a Gamma(n, 1) distribution. Dividing by n gives

                                                                          nn n−1 −nx
                          X̄n ∼ Gamma(n, rate n),           fX̄n (x) =        x e    , x > 0.
                                                                         Γ(n)

Its mean is 1 and variance is 1/n. By the CLT, for large n,

                                                    X̄n ≈ N (1, 1/n).



                                                            12
```
