# Chapter 9: Conditional Expectation — Detailed Solutions

**Book:** Introduction to Probability, Second Edition  
**Authors:** Joseph K. Blitzstein and Jessica Hwang

> Source transcription from the supplied chapter-solution PDF. The solution numbering and worked reasoning are retained. Mathematical notation should be checked against the original source if a character appears ambiguous.

```text
INTRODUCTION TO PROBABILITY


                                Detailed Solutions
                       Chapter 9 – Conditional Expectation


                          Complete worked solutions to Exercises 1–60




Scope. This volume follows Section 9.9 of the supplied chapter and retains the original numbering and subparts.
Conditional expectation is treated as an updated weighted average; the law of total expectation (Adam’s law),
the law of total variance (Eve’s law), and conditional independence are used explicitly. Exponential variables
use rate parameters.


Introduction to Probability                       Chapter 9: Conditional Expectation


Contents
Conditional expectation given an event                                            2

Conditional expectation given a random variable                                   5

Mixed practice                                                                   10




                                              1


Introduction to Probability                                                      Chapter 9: Conditional Expectation


Conditional expectation given an event
Exercise 1
Let J be the randomly chosen route, uniform on {1, 2, 3}. By Adam’s law,

                                                        µ1 + µ2 + µ3
                                                 ET =                .
                                                             3

For the variance, Eve’s law gives
                                                                                      3
                                                                 σ12 + σ22 + σ32   1X
                    Var(T ) = E[Var(T | J)] + Var(E[T | J]) =                    +       (µj − µ̄)2 ,
                                                                       3           3 j=1

where µ̄ = (µ1 + µ2 + µ3 )/3. Thus the average of the three conditional variances alone is not generally the total
variance; the variability between route means must also be included.


Exercise 2
For independent Poisson variables, conditional on their sum, one component is Binomial:
                                                                 
                                                             10
                            X | (X + Y = 30) ∼ Bin 30,              = Bin(30, 0.2).
                                                          10 + 40

Therefore E(X | X + Y = 30) = 6.


Exercise 3
Given that exactly 5 of the 35 people have the disease, the five affected people form a uniformly selected subset.
The number of affected women is Hypergeometric with population size 35, 21 women, and sample size 5. Its mean
is
                                                     21
                                                   5     = 3.
                                                     35


Exercise 4
For X ∼ Pois(λ), conditioning on X ≥ 1 removes only the zero term. Hence

                                                           EX         λ
                                       E(X | X ≥ 1) =            =         .
                                                         1 − e−λ   1 − e−λ

Also E[X 2 ] = λ2 + λ, so
                                                                λ2 + λ
                                             E(X 2 | X ≥ 1) =           .
                                                                1 − e−λ
Subtracting the squared conditional mean gives

                                                            λ        λ2 e−λ
                                     Var(X | X ≥ 1) =            −             .
                                                         1 − e−λ   (1 − e−λ )2


Exercise 5
Each roll succeeds (is at least m) with probability (21 − m)/20, so the expected number of rolls is 20/(21 − m).
Given success, the final face is uniform on m, m + 1, . . . , 20, with mean (m + 20)/2. The net payoff is the final face
minus the number of rolls, so
                                                      m + 20           20
                                            G(m) =                −         .
                                                            2        21 − m

Checking the integers m = 1, . . . , 20 gives the maximum at m = 15 , with G(15) = 17.5 − 20/6 = 85/6 ≈ 14.167
dollars.


                                                           2


Introduction to Probability                                                                   Chapter 9: Conditional Expectation


Exercise 6
(a) The conditional density is f (x | X < 1) = λe−λx /(1 − e−λ ) on (0, 1). Thus

                                                                        1 − (1 + λ)e−λ
                                             E(X | X < 1) =                            .
                                                                          λ(1 − e−λ )

(b) By memorylessness, E(X | X ≥ 1) = 1 + 1/λ. Apply total expectation:
                                                                        
                               1                                       1
                                 = (1 − e−λ )E(X | X < 1) + e−λ 1 +        ,
                               λ                                       λ

which rearranges to the same expression.


Exercise 7
Acceptance occurs when V ≤ 4b. For 0 ≤ b ≤ 1/4,
                                                               Z 4b
                                             E[payoff] =              (v − b)dv = 4b2 .
                                                                0

For b ≥ 1/4, every value is accepted and the expected payoff is E(V − b) = 1/2 − b. Therefore
                                                         (
                                                             4b2 ,    0 ≤ b ≤ 1/4,
                                                g(b) =
                                                             1/2 − b, b ≥ 1/4.


The first branch increases and the second decreases, so the optimal bid is b = 1/4 million dollars.


Exercise 8
Fix the random threshold at t. If t lies strictly between the two envelope amounts, the strategy always selects the
larger amount: it switches when the opened amount is the smaller one and keeps it when the opened amount is the
larger one. If t is outside the interval between the amounts, the rule either always switches or always keeps, which
has success probability 1/2 by the initially random choice. Hence the conditional success probability is at least
1/2, and it is 1 whenever the threshold separates the two amounts. For two i.i.d. positive amounts that are not
almost surely equal, an independent continuous T ∼ Expo(1) has a strictly positive probability of falling between
them. Averaging over T therefore gives a success probability strictly greater than 1/2. (If the two amounts are
equal almost surely, there is no larger envelope to select.)


Exercise 9
Let U be the opened amount and V the other amount; both are independent Uniform(0, 1). The probability of
sticking is U . (a) Success occurs by sticking when U > V and by switching when U < V :
                                     Z 1Z u                    Z 1Z 1
                                                                                              1 1  2
                          P(win) =               u dv du +                  (1 − u) dv du =    + =   .
                                        0   0                   0       u                     3 3  3

(b) The received amount has conditional mean U 2 + (1 − U )V . Thus

                                                                                      1 1  7
                              E[amount] = E(U 2 ) + E(1 − U )E(V ) =                   + =    .
                                                                                      3 4  12


Exercise 10
                                        P
For i.i.d. Uniform(0, 1) signals, V =       Xi . (a) EV = n/2. (b) Given X1 = x1 , the remaining signals retain mean
1/2, so
                                                                                  n−1
                                                E(V | X1 = x1 ) = x1 +                .
                                                                                   2



                                                                    3


Introduction to Probability                                                         Chapter 9: Conditional Expectation


(c) Bidder i bids xi + (n − 1)/2, so bidder 1 wins exactly when X1 is the largest signal. Conditional on X1 = x1
and winning, each other signal is independent Uniform(0, x1 ), of mean x1 /2. Therefore

                                                                n−1      n+1
                                 E(V | X1 = x1 , win) = x1 +        x1 =     x1 .
                                                                 2        2

For x1 < 1, this is below the unconditional-on-winning-information estimate in (b), because winning reveals that
all competing signals were unusually low (the winner’s curse).


Exercise 11
Let q = 1 − p. Use states 0 (no useful final H) and H (the most recent flip is H). (a) For the pattern HT, if
e0 , eH are expected remaining flips, then e0 = 1 + peH + qe0 and eH = 1 + peH . Solving gives eH = 1/q and
e0 = 1/p + 1/q = 1/(pq) . (b) For HH, e0 = 1 + peH + qe0 and eH = 1 + qe0 (an H completes, a T resets). Solving
yields e0 = (1 + p)/p2 . (c) Average these expressions over p ∼ Beta(a, b). Since a, b > 2,

                                                       a+b−1 a+b−1
                                           ENHT =           +      ,
                                                        a−1   b−1

                                              (a + b − 1)(a + b − 2) a + b − 1
                                   ENHH =                           +          .
                                                  (a − 1)(a − 2)       a−1


Exercise 12
The first run is H with probability p and then has Geometric(q) length, mean 1/q; it is T with probability q and
then has mean 1/p. Hence
                                                       p q
                                                 EL1 = + .
                                                       q    p
The second run is T after an initial H, or H after an initial T. Its conditional mean is 1/p or 1/q, respectively, so

                                                       1   1
                                                EL2 = p + q = 2.
                                                       p   q


Exercise 13
Given first roll k, each additional roll succeeds if it is at least k, with probability (7 − k)/6. The expected number
of additional rolls is 6/(7 − k). Averaging over k = 1, . . . , 6 gives

                                       6
                                   1X 6     1 1 1 1 1  49
                                         =1+ + + + + =    .
                                   6 7−k    2 3 4 5 6  20
                                     k=1



Exercise 14
(a) Let e0 be the expected time from no trailing 1, and e1 the expected time given the last roll is 1. Then
e0 = 1 + e1 /6 + 5e0 /6 and e1 = 1 + e1 /6 + 4e0 /6. Solving gives e0 = 36 rolls. (b) For two consecutive 1s,
e0 = 1 + e1 /6 + 5e0 /6 and e1 = 1 + 5e0 /6. Hence e0 = 42 rolls. (c) Let an be the mean time to obtain n
consecutive copies of some face, with the face not specified in advance. After an n-run has occurred, one more roll
finishes the (n + 1)-run with probability 1/6. If it differs (probability 5/6), that roll establishes a new candidate
face and the process is in the same state as immediately after the first roll of a fresh (n + 1)-run. Thus
                                                    5
                                     an+1 = an + 1 + (an+1 − 1),          a1 = 1.
                                                    6
Rearranging gives an+1 = 6an + 1, so

                                            6n − 1              67 − 1
                                     an =          ,     a7 =          = 55, 987.
                                               5                   5

                                                          4


Introduction to Probability                                                       Chapter 9: Conditional Expectation


Conditional expectation given a random variable
Exercise 15
By exchangeability of (X1 , X2 ), E(X1 | X̄) = E(X2 | X̄). Their sum is 2X̄, so each conditional mean is X̄.
Therefore
                                   E(w1 X1 + w2 X2 | X̄) = (w1 + w2 )X̄ = X̄ .


Exercise 16
For k ≤ n, exchangeability gives E(Xi | Sn ) = Sn /n for every i ≤ n, so E(Sk | Sn ) = kSn /n. For k ≥ n, write
Sk = Sn + (Xn+1 + · · · + Xk ); the extra terms are independent of Sn and have mean zero. Hence

                                                             min(k, n)
                                             E(Sk | Sn ) =             Sn .
                                                                n


Exercise 17
For each roommate pair, the indicator that both take the course has mean p2 , so EX = np2 . Conditional on
N , the N successful students form a uniformly chosen subset of 2n. A particular pair is entirely included with
probability N (N − 1)/[2n(2n − 1)]. Therefore

                                                      N (N − 1)    N (N − 1)
                                      E(X | N ) = n              =           .
                                                      2n(2n − 1)   2(2n − 1)


Exercise 18
Expand the conditional square and use the fact that conditional expectation is linear and E(Y | X) is fixed when
conditioning on X:
                        E[(Y − E(Y | X))2 | X] = E(Y 2 | X) − 2E(Y | X)2 + E(Y | X)2
                                                   = E(Y 2 | X) − E(Y | X)2 .
This is the conditional variance identity.


Exercise 19
For a bivariate standard Normal pair with correlation ρ, define V = Y − ρX. Then Cov(X, V ) = ρ − ρ = 0; joint
Normality implies independence, and V ∼ N (0, 1 − ρ2 ). Similarly W = X − ρY is independent of Y . (a) The
best linear predictor slope is ρ in either direction because both marginal variances are 1. (b)–(c) The requested
decompositions are Y = ρX + V and X = ρY + W . (d) Taking conditional expectations,

                                        E(Y | X) = ρX,         E(X | Y ) = ρY.

(e) With equal marginal variances the two regression slopes are both ρ. In the general unequal-variance case the
slope for predicting Y from X is Cov(X, Y )/ Var(X), while the reverse slope is Cov(X, Y )/ Var(Y ); they are not
generally reciprocals. The regression direction changes the denominator.


Exercise 20
For X ∼ Mult5 (n; p1 , . . . , p5 ), conditional on X2 = k, the remaining n − k trials are allocated among the other
four categories with renormalized probabilities. Thus
                                                                            
                                                                        p1
                                             X1 | X2 = k ∼ Bin n − k,          ,
                                                                      1 − p2

so its conditional mean and variance are (n − k)p1 /(1 − p2 ) and (n − k)p1 (1 − p1 − p2 )/(1 − p2 )2 . Similarly,

                                                              n − X2 − X3
                                        E(X1 | X2 + X3 ) =                 p1 .
                                                               1 − p2 − p3


                                                          5


Introduction to Probability                                                         Chapter 9: Conditional Expectation


Exercise 21
(a) E(Y | IA ) is the two-valued random variable equal to E(Y | A) when IA = 1, and equal to E(Y | Ac ) when
IA = 0. (b) By restricting the expectation sum to outcomes in A,
                                 X                      X
                      E(Y IA ) =   yP(Y = y, A) = P(A)     yP(Y = y | A) = P(A)E(Y | A).
                                  y                            y

Therefore E(Y | A) = E(Y IA )/P(A). (c) Split Y = Y IA + Y IAc and apply (b) to both terms. This gives
EY = E(Y | A)P(A) + E(Y | Ac )P(Ac ).


Exercise 22
Apply Adam’s law to the indicator IA :
                                                                   Z ∞
                           P(A) = E(IA ) = E{E(IA | X)} =                P(A | X = x)fX (x)dx.
                                                                   −∞

This is the stated continuous version of total probability.


Exercise 23
(a) By definition, W = Y − E(Y | X). Thus E(W | X) = 0, and Adam’s law gives EW = 0 . (b) Since
W | X ∼ N (0, X 2 ), its conditional variance is X 2 and its conditional mean is zero. Eve’s law gives

                                               Var(W ) = E(X 2 ) = 1.


Exercise 24
Let I indicate which coin was chosen. Then X | I = j ∼ Bin(n, pj ). Hence

                                                          n(p1 + p2 )
                                                 EX =                 ,
                                                              2

                                          n                                 n2 (p1 − p2 )2
                               Var(X) =     [p1 (1 − p1 ) + p2 (1 − p2 )] +                .
                                          2                                       4
The first term is expected conditional variance; the second is variance between the two possible coin-specific means.


Exercise 25
Given current wealth Xj , the next wealth is (1 + f )Xj with probability p and (1 − f )Xj with probability 1 − p.
Therefore
                      E(Xj+1 | Xj ) = Xj [p(1 + f ) + (1 − p)(1 − f )] = Xj [1 + f (2p − 1)].
Iterating expectations from X0 = x0 gives

                                            E(Xn ) = x0 [1 + f (2p − 1)]n .


Exercise 26
Let S be total tickets sold. This is a compound Poisson sum with rate parameter λ1 and mark K ∼ Pois(λ2 ).
Hence
                               ES = λ1 λ2 ,   Var(S) = λ1 E(K 2 ) = λ1 (λ2 + λ22 ).




                                                           6


Introduction to Probability                                                          Chapter 9: Conditional Expectation


Exercise 27
Let the party length be T = 240 minutes and the arrival process have rate r = λ/T . Conditional on at least one
arrival, the survival function of the first arrival time A is

                                                           e−rt − e−λ
                                   P(A > t | N ≥ 1) =                 ,      0 ≤ t ≤ T.
                                                            1 − e−λ
Integrating this survival function gives

                                                                T     T
                                             E(A | N ≥ 1) =       − λ   .
                                                                λ  e −1

By time reversal, the expected last-arrival time after 8:00 pm is T − EA, namely

                                                       T     T
                                                  T−     + λ   .
                                                       λ  e −1

For T = 240 and λ = 20, these are approximately 12 and 228 minutes after 8:00 pm, i.e. 8:12 pm and 11:48 pm.


Exercise 28
                                               b = E(θ2 ) and
(a) If θb is unbiased conditional on θ, then E(θθ)

                                  E(θb − θ)2 = E(θb2 ) − E(θ2 ) = Var(θ)
                                                                      b − Var(θ) .

(b) If θb = E(θ | X), then conditioning on X gives E[(θb − θ)2 | X] = Var(θ | X). Averaging and using Eve’s law,

                                            E(θb − θ)2 = Var(θ) − Var(θ).
                                                                      b

(c) If both properties hold, the two displayed expressions must agree, forcing the squared error to be zero. Thus
θb = θ almost surely: observing X reveals θ perfectly.


Exercise 29
If E(Y | X) = c, then EY = c by Adam’s law and

                                           E(XY ) = E{XE(Y | X)} = cEX.

Consequently Cov(X, Y ) = 0 .


Exercise 30
Take X = Z and Y = Z 2 , where Z ∼ N (0, 1). Then Cov(X, Y ) = EZ 3 − EZEZ 2 = 0, but E(Y | X) = X 2 is
nonconstant.


Exercise 31
Let N be the number of emails through the first non-spam email. Then N ∼ Geom(p) on 1, 2, . . ., and X is a sum
of N independent Expo(λ) waiting times. Thus

                                                             1    1
                                                EX = EN        =    .
                                                             λ   pλ

Using the conditional variance formula gives Var(X) = 1/(p2 λ2 ) . For the MGF,
                                                "         N #
                                                      λ                pλ
                                   MX (t) = E                     =          ,   t < pλ.
                                                     λ−t              pλ − t

So X ∼ Expo(pλ) .


                                                            7


Introduction to Probability                                                        Chapter 9: Conditional Expectation


Exercise 32
Let C be one customer’s spend. It is zero with probability 1 − p and, with probability p, has the purchase amount
(mean µ, variance σ 2 ). Hence
                                   EC = pµ,       Var(C) = pσ 2 + p(1 − p)µ2 .
(b) There are N ∼ Pois(8λ) customers. The compound Poisson mean and variance are

                                     ER = 8λpµ,         Var(R) = 8λp(σ 2 + µ2 ).

(c) By thinning, the number of purchasers is Pois(8λp); summing their independent purchase amounts gives the
same two expressions.


Exercise 33
Each malfunction interval has mean 1/λ. A malfunction is unrepairable with probability 1 − p, independently each
time. The number of intervals until that event is Geometric(1 − p) on 1, 2, . . ., with mean 1/(1 − p). Therefore

                                                                         1
                                       E(time until replacement) =             .
                                                                      λ(1 − p)


Exercise 34
Let Nj be the number of rolls until the first occurrence of face j. Then ENj = 6, so there are five nonterminal
rolls on average. Conditional on a roll not being j, its mean is the average of the other five faces, (21 − j)/5.
Consequently
                                                    21 − j
                                            ETj = 5        + j = 21.
                                                       5
Thus E(T1 ) = E(T6 ) = 21. Student A has the correct conclusion but an invalid conditioning step: given Nj , the
earlier rolls are known not to equal j, so their mean is not 3.5. Student B correctly notices the final roll but
incorrectly claims the preterminal sums have the same expectation. They are 20 for the target-1 die and 15 for the
target-6 die; adding the terminal 1 or 6 makes both totals 21.


Exercise 35
Use the chapter’s convention that N ∼ Geom(s) counts failures before the first success, so P (N = n) = s(1 − s)n
for n = 0, 1, . . .. Given N , T | N ∼ Bin(N, p). Adam’s and Eve’s laws give

                                                               p(1 − s)
                                             ET = pEN =                 ,
                                                                  s

                                     Var(T ) = E[Var(T | N )] + Var(E[T | N ])
                                                        1−s       1−s
                                             = p(1 − p)       + p2 2
                                                          s         s
                                                p(1 − s)[s + p(1 − s)]
                                             =                         .
                                                          s2
The probability generating function is

                                                  s                     s/A
        GT (z) = E[(1 − p + pz)N ] =                           =                   ,        A = s + p(1 − s).
                                       1 − (1 − s)(1 − p + pz)   1 − (p(1 − s)/A)z

This is the PGF of a Geometric distribution on 0, 1, . . . with success parameter s/A = s/[s + p(1 − s)] . Therefore
                          
                   s
 T ∼ Geom                    under the same failures-before-success convention. Its MGF is
              s + p(1 − s)

                                                               s
                                         MT (t) =                             .
                                                    1 − (1 − s)(1 − p + pet )



                                                           8


Introduction to Probability                                                                     Chapter 9: Conditional Expectation


Exercise 36
Conditionally on λ, the MGF of Y is exp(λ(et − 1)). Average over λ ∼ Gamma(r0 , b0 ):
                                                                r0
                                                         b0
                                         MY (t) =                    .
                                                     b0 + 1 − et

This is the MGF of the negative-binomial distribution with shape r0 and success parameter b0 /(b0 + 1) (counting
failures before r0 successes). Thus Y ∼ NBin(r0 , b0 /(b0 + 1)) .


Exercise 37
(a) Unconditionally, each bootstrap draw has the same distribution as a randomly selected Xi , so E(Xj∗ ) = µ and
Var(Xj∗ ) = σ 2 . (b) Given the data, the bootstrap draws are i.i.d. from the empirical distribution. Therefore
                                                                                                   n
                                                                                               1 X
                       E(X̄ ∗ | X1 , . . . , Xn ) = X̄,       Var(X̄ ∗ | X1 , . . . , Xn ) =          (Xi − X̄)2 .
                                                                                               n2 i=1

(c) Since EX̄ = µ and E[n−1        (Xi − X̄)2 ] = (n − 1)σ 2 /n,
                                  P


                                                                                2n − 1 2
                                             EX̄ ∗ = µ,          Var(X̄ ∗ ) =         σ .
                                                                                  n2

(d) The original sample mean has variance σ 2 /n, which is smaller for n ≥ 2. The bootstrap resampling adds
another source of variability on top of the original random sample.


Exercise 38
Since (T1 , T2 ) is independent of (I1 , I2 ),
                                                           EC = p1 µ1 + p2 µ2 .
Also
                                      E(C 2 ) = p1 (σ12 + µ21 ) + p2 (σ22 + µ22 ) + 2p12 µ1 µ2 .
Thus
                           Var(C) = p1 (σ12 + µ21 ) + p2 (σ22 + µ22 ) + 2p12 µ1 µ2 − (p1 µ1 + p2 µ2 )2 .


Exercise 39
(a) Conditional on the volatility regime, the mean is zero and the variance is σ12 or σ22 . Eve’s law gives

                                                          Var(X) = pσ12 + qσ22 .

Expanding Cov(X, X) from X = I1 X1 + I2 X2 gives the same result because the regime indicators are mutually
exclusive and the Xj are centered and independent of them. (b) The fourth moment is 3(pσ14 + qσ24 ). Therefore

                                                  3(pσ14 + qσ24 )       3pq(σ12 − σ22 )2
                                   Kurt(X) =                      − 3 =                  > 0.
                                                  (pσ12 + qσ22 )2        (pσ12 + qσ22 )2


Exercise 40
Let A = E(Y | X1 ) and B = E(Y | X1 , X2 ). Adam’s law with extra conditioning gives E(B | X1 ) = A. Eve’s law
then gives
                           Var(B) = E[Var(B | X1 )] + Var(E(B | X1 )) ≥ Var(A).
If Y is independent of X1 , then A = EY and the lower bound is zero. If Y = h(X2 ) and is fully determined by X2 ,
then B = Y and Var(B) = Var(Y ), the largest possible value.




                                                                    9


Introduction to Probability                                                           Chapter 9: Conditional Expectation


Exercise 41
Write G = E(Y | X). Since G is a function of X,

                           E(Y | G) = E{E(Y | X) | G} = E(G | G) = G = E(Y | X).


Exercise 42
Let S = E(Z | X). Since S is a function of X,

                                           E(Z | S, X) = E(Z | X) = S.

Also E(Z | S) = E{E(Z | X) | S} = E(S | S) = S. Thus P(Z = 1 | S, X) = P(Z = 1 | S); because Z is binary, this
establishes Z ⊥ X | S.


Exercise 43
(a) Expand the definition and pull out conditional-measurable terms:

                                  Cov(X, Y | Z) = E(XY | Z) − E(X | Z)E(Y | Z).

(b) Taking expectations in (a),

                              E{Cov(X, Y | Z)} = E(XY ) − E[E(X | Z)E(Y | Z)].

Meanwhile Cov(E(X | Z), E(Y | Z)) equals the latter product expectation minus EXEY . Adding the two terms
leaves E(XY ) − EXEY = Cov(X, Y ), proving the law of total covariance.


Mixed practice
Exercise 44
(a) The first k dinners must select k distinct people. For k ≤ n,

                                                       n(n − 1) · · · (n − k + 1)
                                      P(no repeat) =                              ;
                                                                   nk

for k > n the probability
                    Pn is zero. (b) The number of dinners until everyone has paid is the coupon-collector time,
with mean nHn = n j=1 1/j. (c) In each dinner, Alice pays with probability 1/n, Bob with probability 1/n, and
the two categories are mutually exclusive. Over k independent dinners, the covariance of their counts is

                                                                    k
                                              Cov(NA , NB ) = −        .
                                                                    n2


Exercise 45
Poisson thinning splits the dinners into independent counts: Alice-paid dinners A ∼ Pois(λ/n) and dinners paid by
others F ∼ Pois(λ(1 − 1/n)). Thus their correlation is 0 . For i.i.d. dinner costs C ∼ Gamma(a, b) (rate b), the
total cost is compound Poisson:

                                         a                                 a(a + 1)
                                   ES = λ ,      Var(S) = λE(C 2 ) = λ              .
                                         b                                    b2


Exercise 46
(a) A compound Poisson sum of N ∼ Pois(λ) page counts with K ∼ Pois(µ) has mean λµ . (b) Its variance is
λE(K 2 ) = λ(µ + µ2 ) . (c) Poisson thinning gives independent liked and disliked book counts with laws Pois(λp)
and Pois(λ(1 − p)). Therefore, conditional on exactly d dislikes, the number liked is still Pois(λp) .


                                                          10


Introduction to Probability                                                        Chapter 9: Conditional Expectation


Exercise 47
(a) Nt ∼ Pois(λt), so ENt = Var(Nt ) = λt. (b) If K ∼ Bin(n, p) is the passenger count on one bus, then EK = np
and EK 2 = np(1 − p) + n2 p2 . The compound Poisson formulas give

                                  EXt = λtnp,       Var(Xt ) = λt[np(1 − p) + n2 p2 ].

(c) Full buses are a thinned Poisson process with rate λpn , and non-full buses have rate λ(1 − pn ), independently.
Thus the requested probability is
                                                 (λtpn )a [λt(1 − pn )]b
                                            e−λt                         .
                                                    a!          b!

Exercise 48
(a) Given Paul’s time T = t, the events Aj are independent, each with probability F (t). Unconditionally they
share the random probability F (T ), so they are generally dependent (indeed positively correlated when F (T )
is nonconstant). (b) By exchangeability, each of the n other runners has probability 1/2 of beating Paul, so
 EN = n/2 . (c) N | T = t ∼ Bin(n, F (t)). (d) Since F (T ) ∼ Unif(0, 1),

                                                                                         n(n + 2)
                    Var(N ) = E[nF (T )(1 − F (T ))] + Var(nF (T )) = n/6 + n2 /12 =              .
                                                                                            12

Exercise 49
(a) Conditional on exactly n arrivals in eight hours, each arrival is uniform over the period. The number in the
first two hours is Bin(n, 1/4) . (b) By independent Poisson thinning, legitimate and spam counts are independent.
Given s spams, the legitimate count is still Pois(8λp) . (c) With N ∼ Pois(8λ) and reading times of mean µ and
variance σ 2 , the compound Poisson total has

                                        ER = 8λµ,        Var(R) = 8λ(σ 2 + µ2 ).


Exercise 50
(a) With λ ∼ Expo(1) and N | λ ∼ Pois(λ), Adam’s law and Eve’s law give

                                       EN = 1,       Var(N ) = Eλ + Var(λ) = 2.
                                                             2                             2
(b) A Log-Normal claim amount C has m1 = EC = eµ+σ /2 and m2 = EC 2 = e2µ+2σ . For the total S,

                           ES = m1 ,      Var(S) = EN Var(C) + Var(N )m21 = m2 + m21 .

(c) Mixing Poisson(λ) with an Exp(1) rate gives P(N = n) = 2−(n+1) , so N is Geometric on 0, 1, . . . with parameter
1/2. (d) The posterior density is proportional to λn e−2λ , hence λ | (N = n) ∼ Gamma(n + 1, 2) .


Exercise 51
(a) By memorylessness, Xi | Xi > ci has mean ci + 1/λi . Thus
                                                                                 1    1   1
                         E(X1 + X2 + X3 | X1 > 1, X2 > 2, X3 > 3) = 6 +             +    + .
                                                                                 λ1   λ2  λ3
(b) The minimum of X2 , X3 is exponential with rate λ2 + λ3 , independent of X1 . Therefore
                                                                          λ1
                                     P(X1 = min(X1 , X2 , X3 )) =                 .
                                                                     λ1 + λ2 + λ3
(c) For three i.i.d. Expo(1) variables, FM (t) = (1 − e−t )3 for t > 0, so

                                          fM (t) = 3e−t (1 − e−t )2 ,   t > 0.
This is the maximum order statistic of three exponentials rather than one of the basic named families introduced
earlier.


                                                           11


Introduction to Probability                                                               Chapter 9: Conditional Expectation


Exercise 52
(a) The completion time is a 50–50 mixture of Expo(λ1 ) and Expo(λ2 ). Hence
                                                                             2
                               1 1      1                  1   1     1 1     1
                        ET =         +       , Var(T ) = 2 + 2 −           +       .
                               2 λ1     λ2                λ1   λ2    4 λ1    λ2
(b) If both people work independently, the completion time is X = min(T1 , T2 ) ∼ Expo(λ1 + λ2 ). By memoryless-
ness,
                                                               1
                                     E(X | X > 24) = 24 +           hours.
                                                            λ1 + λ2


Exercise 53
Write Y = µ + ε, where µ ∼ N (100, 225) and the independent measurement error ε ∼ N (0, 25). Then

                         EY = 100,       Var(Y ) = 225 + 25 = 250,                Y ∼ N (100, 250).

Also Cov(µ, Y ) = Var(µ) = 225 .


Exercise 54
Conditioning on twin type, the means are zero in both cases. For identical twins, E(X1 X2 ) = σ 2 ; for fraternal
twins it is ρσ 2 . Averaging the two equally likely cases gives

                                                                     1+ρ 2
                                               Cov(X1 , X2 ) =          σ .
                                                                      2


Exercise 55
If j numbers are still missing, the number K selected from those missing numbers in tomorrow’s draw has the
hypergeometric distribution K ∼ HGeom(j, 35 − j, 5) (there are j missing and 35 − j already seen):
                                           j 35−j
                                                 
                                              k     5−k
                                     pj,k =        35
                                                          ,   k = 0, 1, . . . , min(5, j).
                                                   5
                                               P
Condition on K. The recursion is aj = 1 +          k pj,k aj−k , with a0 = 0. Isolating the k = 0 term gives

                                                   Pmin(5,j)
                                              1+     k=1     pj,k aj−k
                                      aj =                             ,        a0 = 0.
                                                      1 − pj,0


Exercise 56
(a) Given p, the number of games through the first Vishy win has mean 1/p. Averaging over p ∼ Beta(a, b),

                                                                a+b−1
                                                   E(1/p) =           .
                                                                 a−1

(b) The comparison quantity is 1 + EG = (a + b)/a for G ∼ Geom(a/(a + b)) counting failures. Their difference is
b/[a(a−1)] > 0. The Bayesian waiting time is larger because the same unknown p is shared across games: conditional
independence becomes positive unconditional dependence, and the convexity of 1/p yields E(1/p) > 1/Ep. (c)
Seven wins and three losses update the prior to p | data ∼ Beta(a + 7, b + 3) .


Exercise 57
(a) The Bernoulli likelihood for observed x1 , . . . , xn is proportional to pk (1 − p)n−k , where k =
                                                                                                              P
                                                                                                                  xi . With a
Uniform(0, 1) prior, the posterior is

                                      p | x1 , . . . , xn ∼ Beta(k + 1, n − k + 1),


                                                               12


Introduction to Probability                                                              Chapter 9: Conditional Expectation


which depends on the data only through k. (b) By conditioning on p,

                                                                                                      k+1
                    P(Xn+1 = 1 | X1 + · · · + Xn = k) = E(p | X1 + · · · + Xn = k) =                      .
                                                                                                      n+2


Exercise 58
With a Uniform prior, the posterior after a wins in j games is Beta(a+1, j −a+1). (a) The total X is Beta-Binomial
with parameters (n, 1, 1), so it is uniform on {0, . . . , n}. Hence

                                                   n                      n(n + 2)
                                          EX =       ,         Var(X) =            .
                                                   2                         12

(b) Given a wins in the first j games, the posterior predictive win probability for game j + 1 is

                                                                               a+1
                                         P(Xj+1 = 1 | first j games) =             .
                                                                               j+2

(c) The uniform Beta-Binomial PMF is P(X = k) = 1/(n + 1), k = 0, . . . , n. (d) The first two shots are one
hit and one miss. They therefore give the same Beta(2, 2) posterior as one success and one failure under the
Uniform-prior model. The remaining 98 shots have a Beta-Binomial(98, 2, 2) count. Exactly 50 total hits requires
49 hits in those 98 shots:                           
                                                     98 B(51, 51)        50
                               P(exactly 50 hits) =                =         .
                                                     49 B(2, 2)         333


Exercise 59
For X | p ∼ Bin(n, p) and p ∼ Beta(a, b), total expectation and variance give

                                            a                            nab(a + b + n)
                                EX = n         ,          Var(X) =                          .
                                           a+b                         (a + b)2 (a + b + 1)

The second term in Eve’s law accounts for uncertainty in the common success probability.


Exercise 60
For a city with nj voters and a Uniform prior pj ∼ Beta(1, 1), integrating out pj gives the Beta-Binomial(nj , 1, 1)
law, uniform on 0, 1, . . . , nj . Given X1 = k1 , conjugacy gives

                                      p1 | (X1 = k1 ) ∼ Beta(k1 + 1, n1 − k1 + 1).

Independence across cities and the uniform marginal for each city yield

                                                         m                                      m
                                n                        X nj (nj + 2)        s + 2n            X
                         EX =     ,      Var(X) =                         =          ,   s=           n2j .
                                2                        j=1
                                                                  12            12              j=1




                                                                13
```
