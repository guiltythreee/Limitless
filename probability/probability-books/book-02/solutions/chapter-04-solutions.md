# Chapter 4: Expectation — Detailed Solutions

**Book:** Introduction to Probability, Second Edition  
**Authors:** Joseph K. Blitzstein and Jessica Hwang

> Source transcription from the supplied chapter-solution PDF. The solution numbering and worked reasoning are retained. Mathematical notation should be checked against the original source if a character appears ambiguous.

```text
INTRODUCTION TO PROBABILITY


                             Detailed Solutions
                               Chapter 4 – Expectation


                        Complete worked solutions to Exercises 1–92




Scope. These solutions follow the exercise section in the uploaded Chapter 4 PDF. They use the chapter’s
expectation, variance, named-distribution, LOTUS, and indicator-variable methods. Numerical values are
rounded and marked as approximations.


Introduction to Probability       Chapter 4: Expectation


Contents
Expectations and variances                            2

Named distributions                                   5

Indicator random variables                            7

LOTUS                                                12

Poisson approximation                                13

Existence                                            15

Mixed practice                                       15




                              1


Introduction to Probability                                                                              Chapter 4: Expectation


Expectations and variances
Exercise 1
After one minute the number N of amoebas is 0, 1, or 2, each with probability 1/3. Hence
                                           0+1+2                                    0+1+4  5
                                  EN =           = 1,                   E(N 2 ) =         = .
                                             3                                        3    3

                        5       2
Therefore Var(N ) =       − 12 = .
                        3       3

Exercise 2
Write D = 365 + I, where I ∼ Bern(1/4) indicates a leap year. Thus

                       ED = 365 + 14 = 365.25 days ,                 Var(D) = Var(I) = 14 43 = 16
                                                                                               3
                                                                                                  days2 .


Exercise 3
(a) For a fair die, EX = (1 + 2 + 3 + 4 + 5 + 6)/6 = 7/2 .                   (b) By linearity, for four rolls S = X1 + · · · + X4 ,
 ES = 4(7/2) = 14 . Independence is not needed for this expectation.


Exercise 4
Use backward induction. With only one roll remaining, its expected value is 7/2. With two rolls available, after
the first roll x one should stop when x ≥ 7/2 and otherwise reroll. Thus the value of having two rolls is
                                                               
                                       1 7 7 7                        17
                                  V2 =      + + +4+5+6 =                 = 4.25.
                                       6 2 2 2                         4

With three rolls available, after the first roll stop if it is at least V2 ; otherwise use the optimal two-roll strategy.
Since the first roll is an integer, continue after 1, 2, 3, 4 and stop after 5, 6. The optimal expected winnings are
                                                                     
                                                  1            17        14
                                          V3 =            4·      +5+6 =    dollars.
                                                  6            4          3


Exercise 5
For X ∼ Unif{1, . . . , n},
                                     n                                        n
                                   1X    n+1                        2 1X 2  (n + 1)(2n + 1)
                              EX =    k=     ,                   EX =   k =                 .
                                   n      2                           n            6
                                    k=1                                      k=1


Subtracting the square of the mean gives Var(X) = (n2 − 1)/12.


Exercise 6
Let T be the number of games in the best-of-seven match. The series ends after 4, 5, 6, or 7 games. Counting fair
win/loss sequences gives

                         P(T = 4) = 18 ,    P(T = 5) = 41 ,                      5
                                                                     P(T = 6) = 16 ,                   5
                                                                                           P(T = 7) = 16 .

For example, to end at game 6, after five games one team must lead 3–2 (probability 20/32), and that team must
win game 6 (probability 1/2). Consequently,

                                           93                      557                     263
                                   ET =       ,           ET 2 =       ,       Var(T ) =       .
                                           16                       16                     256



                                                                    2


Introduction to Probability                                                                            Chapter 4: Expectation


Exercise 7
(a) The family is selected uniformly, then a child uniformly within it. The rank probabilities are
                                          3    5 1    2 1    37
                               P(R = 1) =    +     +       =    ,
                                          10 10 2 10 3       60
                                          5 1   2 1    19                   2 1   4
                               P(R = 2) =     +      =    ,     P(R = 3) =      =    .
                                          10 2 10 3    60                  10 3   60

Then ER = (37 + 38 + 12)/60 = 29/20 and ER2 = (37 + 76 + 36)/60 = 149/60. Hence Var(R) = 457/1200.
(b) There are 30 + 100 + 60 = 190 children. Exactly 100 are firstborn, 70 secondborn, and 20 thirdborn, so
                                                                    
                                                           10 7 2
                                        P(R = 1, 2, 3) =     , ,       .
                                                           19 19 19

Thus ER = (10 + 14 + 6)/19 = 30/19, ER2 = (10 + 28 + 18)/19 = 56/19, and Var(R) = 164/361.


Exercise 8
(a) There are ten cities in total and the total population is 20 million. Choosing a city uniformly, its expected
population is the arithmetic mean: 20/10 = 2 million.
(b) The regional totals do not determine the city-level allocation, so they do not determine its variance. For
example, North’s 3 million could be split equally among its four cities or concentrated almost entirely in one city;
both allocations have the same regional total but different sums of squared city populations, and therefore different
variances.
(c) The probability of selecting a particular city is 1/(4 · 4) in North, 1/(4 · 3) in East, 1/(4 · 2) in South, and 1/4
in West. The conditional average city populations within the regions are 3/4, 4/3, 5/2, 8 million. Therefore
                                                                       
                                                1          3 4 5                151
                           E(city population) =             + + +8          =       ≈ 3.146 million.
                                                4          4 3 2                48

(d) This selection method gives a large probability to a city in a region with very few cities. In particular, the
single western city is selected with probability 1/4 and has 8 million residents. This size-bias raises the mean.


Exercise 9
Measure money in thousands of dollars. (a) Walking away gives X = 16 deterministically, so EX = 16 and
Var(X) = 0.
(b) The lifeline makes the 10th answer correct with probability 1/2. The outcomes are 1 with probability 1/2, 32
with probability 3/8, and 64 with probability 1/8. Thus

                                          EX = 12 + 38 (32) + 18 (64) = 20.5,

                                  Var(X) = 12 + 38 (322 ) + 18 (642 ) − (20.5)2 = 476.25.
                                                                    

(c) Without the lifeline on question 10, the outcome is 1 with probability 3/4, 32 with probability 1/8, and 64
with probability 1/8. Hence

                      EX = 34 + 18 (32) + 18 (64) = 12.75,      Var(X) = 640.75 − (12.75)2 = 478.1875.

Option (b) has the largest expected value; option (a) has the smallest variance (zero).


Exercise 10
The game lasts n rounds with probability 2−n . If the payoff is n, its fair value is
                                                X n               1/2
                                                           =              = 2.
                                                      2n       (1 − 1/2)2
                                                n≥1


For payoff n2 , use          2 n                  3
                      P
                        n≥1 n x = x(1 + x)/(1 − x) at x = 1/2:           E(payoff) = 6.


                                                                 3


Introduction to Probability                                                                   Chapter 4: Expectation


Exercise 11
With 31 = 1 + 2 + 4 + 8 + 16, Martin can make at most five bets. If he sees a Head within these five tosses, the
accumulated losses are recovered and he finishes exactly 1 dollar ahead. This happens with probability 31/32. If
all five tosses are Tails (probability 1/32), he loses all 31 dollars. Therefore

                                                     31       1
                                            EW =        (1) + (−31) = 0.
                                                     32      32
The strategy does not create positive expected winnings; its rare bankruptcy outcome offsets the frequent one-dollar
gain.


Exercise 12
Pair the values k and −k. Their contributions to the expectation cancel because their probabilities are equal. The
value 0 contributes nothing. Hence EX = 0.


Exercise 13
Yes. Let Y = 1 deterministically, and let X = 0 with probability 0.99 and X = 10001 with probability 0.01. Then
P(Y > X) = 0.99, while EX = 100.01 > 100EY = 100. The rare, very large value of X makes its mean large even
though Y exceeds it 99% of the time.


Exercise 14
Put L = − log(1 − p), so the normalizing constant is c = 1/L. The generating series gives
                                 X            p                   X             p
                         EX = c      pk =          ,     EX 2 = c   kpk =             .
                                          (1 − p)L                         (1 − p)2 L
                                   k≥1                                  k≥1

Therefore
                                                   p(L − p)
                                     Var(X) =                 ,   L = − log(1 − p).
                                                  (1 − p)2 L2


Exercise 15
(a) If B guesses j, the expected payment is jpj . Thus an optimal guess is any maximizer of jpj .
                   P100
(b) Let H100 = j=1 1/j and set pj = qj = 1/(jH100 ) for both players. If A chooses j, B’s probability of guessing
it is qj , so A’s expected payment to B is jqj = 1/H100 , independent of j. Conversely, if B guesses j, the expected
earnings are jpj = 1/H100 , also independent of j. Neither player can improve by changing unilaterally.
(c) B’s expected earnings are
                                         100
                                         X                 1
                                               pj jqj =        ≈ 0.1928 dollars.
                                         j=1
                                                          H100

This value is independent of A’s distribution as long as B keeps the equilibrium strategy qj = 1/(jH100 ).


Exercise 16
(a) The dean averages the 18 course sizes: s̄ = (16 · 10 + 2 · 100)/18 = 20 . Students weight a course in proportion
to its enrollment, so their mean experienced size is
                                           16(10)(10) + 2(100)(100)
                                                                    = 60 .
                                               16(10) + 2(100)
Large courses are encountered by many more students, explaining the discrepancy.
                                                              P 2 P                              P
(b) For course sizes s1 , . . . , sm > 0, the student mean is   si / si , while the dean mean is   si /m. The difference
is nonnegative because                      P 2
                                                            m s2i − ( si )2
                                                    P          P      P
                                               s       si
                                            P i −         =         P          ≥ 0,
                                               si     m          m si
by (si − s̄)2 ≥ 0. Equality holds exactly when all class sizes are equal.
    P


                                                              4


Introduction to Probability                                                                  Chapter 4: Expectation


Exercise 17
                   j
            P
Let mj =      k≥0 k nk .   (a) A uniformly selected family has size k with probability nk /m0 , so its mean size is
 m1 /m0 .
(b) A uniformly selected child belongs to a size-k family with probability knk /m1 . The expected family size is
therefore m2 /m1 .
(c) Since m0 m2 ≥ m21 (Cauchy–Schwarz), m2 /m1 ≥ m1 /m0 . Children are more likely to come from large families
because those families contribute more children. Thus children born in an era with small average family size can
nonetheless come from larger families than children born in an era with a higher family-level average: this is the
size-bias behind the puzzle.


Named distributions
Exercise 18
The first toss gives either H or T; after that, we wait for the first occurrence of the opposite result. The additional
waiting time is Geom(1/2) with mean 2. Including the first toss, ET = 1 + 2 = 3.


Exercise 19
For X ∼ Geom(p) on 1, 2, . . ., let q = 1 − p. For real x,
                                                      (
                                                        0,       x < 1,
                                            FX (x) =         ⌊x⌋
                                                        1 − q , x ≥ 1.

For p = 1/2, the CDF is a step function with jumps 1/2, 1/4, 1/8, . . . at 1, 2, 3, . . ..


Exercise 20
(a) Impossible: if X ≥ Y almost surely, then Y ≤ 100 almost surely because X ≤ 100. A Poisson random variable
has positive probability of exceeding 100.
                                                                      P                  P
(b) Possible. Generate 100 independent Ui ∼ Unif(0, 1) and put X =      I(Ui ≤ 0.9), Y =    I(Ui ≤ 0.5). Then
X ∼ Bin(100, 0.9), Y ∼ Bin(100, 0.5), and term-by-term X ≥ Y .
(c) Impossible because X ≤ Y almost surely would imply EX ≤ EY , but 90 > 50.


Exercise 21
(a) Pointwise, V + W = X + Y . Therefore EV + EW = n/2 + (n + 1)/2 = n + 1/2.
(b) Pointwise, W − V = |X − Y |, so the equality follows immediately on taking expectations.
(c) Since n − X ∼ Bin(n, 1/2), its variance is n/4. Alternatively, Var(n − X) = Var(X) because adding a constant
and changing sign do not change variance, and Var(X) = n(1/2)(1/2) = n/4.


Exercise 22
The rate is 20 × 5 = 100 drops per minute. In 3 seconds, or 1/20 minute, the mean count is 5. A Poisson model is
appropriate for independent, rare arrivals at a constant rate, so N ∼ Pois(5). Thus P(N = 0) = e−5 ≈ 0.00674.


Exercise 23
Condition on Alice’s 50 friends. Bob’s sample is a uniform subset of size 50 from 1000 people. The number X of
mutual friends is
                                                                                   50
                     X ∼ Hypergeom(N = 1000, K = 50, n = 50),          EX = 50         = 2.5.
                                                                                 1000
                                           
                           50     950       1000
Its PMF is P(X = k) =                    /         for feasible k (in particular 0 ≤ k ≤ 50).
                            k    50 − k      50


                                                             5


Introduction to Probability                                                                        Chapter 4: Expectation


Exercise 24
Imagine an infinite Bernoulli sequence. Let Y be the number of failures before the rth success. Among the first n
trials, X < r exactly when the rth success has not yet occurred. That is equivalent to having more than n − r
failures before the rth success. Hence P(X < r) = P(Y > n − r).


Exercise 25
Group the games into consecutive pairs. A pair decides the match exactly when both games are won by the same
player, an event with probability p2 + (1 − p)2 . These pairs are independent. The number of pairs until a decisive
                                                                                         2
pair is geometric with this parameter, and each pair uses two games. Thus ET = 2                 .
                                                                                    p + (1 − p)2


Exercise 26
(a) A simultaneous success on a given trial has probability p1 p2 . The waiting time is Geom(p1 p2 ), so its mean is
 1/(p1 p2 ) .
(b) At least one success on a trial has probability p1 + p2 − p1 p2 . The waiting time is geometric, with mean
 1/(p1 + p2 − p1 p2 ) .
(c) If p1 = p2 = p, the probability that both first successes occur at trial k is p2 (1 − p)2(k−1) . Summing,
                                                                p2         p
                                       P(TN = TP ) =                  2
                                                                        =     .
                                                           1 − (1 − p)    2−p
                                                                                           1−p
By symmetry, the two strict orderings have equal probability, so P(TN < TP ) =                 .
                                                                                           2−p


Exercise 27
The claim is false for λ > 0. If X = Y , then T = 2X is always even, so P(T = 1) = 0. But a Pois(2λ) variable has
positive probability of equaling 1. The fact that the sum of independent Poisson variables is Poisson cannot be
applied to dependent variables.


Exercise 28
The t treasure locations form a uniform t-subset of {1, . . . , n}. If X = k, location k must contain treasure and the
other t − 1 treasure locations must be among the first k − 1 locations. Hence
                                                      k−1
                                                            
                                                           t−1
                                           P(X = k) =       n
                                                                  ,   k = t, . . . , n.
                                                            t

                                                                                                    t(n + 1)
This is the maximum of a simple random sample without replacement; its mean is EX =                          .
                                                                                                      t+1

Exercise 29
For X ∼ Geom(p), f (k) = p(1 − p)k−1 on positive integers. Therefore
                                  X                                  p2         p
                       E[f (X)] =    p(1 − p)k−1 p(1 − p)k−1 =               =     .
                                                                1 − (1 − p)2   2−p
                                     k≥1


Exercise 30
(a) For X ∼ Pois(λ),
                                              X                λk
                               E[Xg(X)] =           kg(k)e−λ
                                                               k!
                                              k≥1
                                                 X                 λk−1
                                            =λ         g(k)e−λ             = λE[g(X + 1)] .
                                                                  (k − 1)!
                                                 k≥1


                                                               6


Introduction to Probability                                                                               Chapter 4: Expectation


(b) Take g(x) = x2 . Then

                            EX 3 = λE(X + 1)2 = λ(EX 2 + 2EX + 1) = λ3 + 3λ2 + λ .


Exercise 31
(a) The PMF is
                                                                                        λk
                          P(X = 0) = p + (1 − p)e−λ ,      P(X = k) = (1 − p)e−λ           , k ≥ 1.
                                                                                        k!
(b) If I ∼ Bern(p) is independent of Y ∼ Pois(λ), then (1 − I)Y is zero whenever I = 1, and otherwise equals Y ,
exactly the stated mixture.
(c) Directly from the PMF or from the representation, EX = (1 − p)λ.
(d) Since EX 2 = (1 − p)(λ2 + λ),
                                           Var(X) = (1 − p)λ + p(1 − p)λ2 .


Exercise 32
Let S(j) = P(X ≥ j) = 1 − F (j − 1) for integer-valued X. The memoryless property says

                                S(j + k) = S(j)S(k) = {1 − F (j − 1)}{1 − F (k − 1)}.

Subtracting adjacent tails also gives pj+k = pj S(k) = pk S(j). The geometric distribution has this property: for
X ∼ Geom(p), S(j) = q j−1 for j ≥ 1, and S(j + k − 1) = S(j)S(k) (equivalently, the remaining waiting time after
any number of failures is still geometric).


Exercise 33
Choose w = 1, b = n, and r = 1. There is one white ball and n black balls. In a random ordering, the white ball is
equally likely to be in any of the n + 1 positions, so the number of black balls before it is uniform on {0, 1, . . . , n}.
The Negative Hypergeometric PMF confirms this:
                                                 x n−x
                                                         
                                                 0     0        1
                                  P(X = x) =        n+1
                                                           =       , x = 0, . . . , n.
                                                     1
                                                              n + 1


Indicator random variables
Exercise 34
For each box i, let Ii = 1 if it is empty. A particular ball avoids box i with probability 1 − 1/n, independently
across the k balls, so EIi = (1 − 1/n)k . By linearity,
                                                                   k
                                                                  1
                                           E(empty boxes) = n 1 −      .
                                                                  n


Exercise 35
            50
              
There are   2  pairs of people. Each pair shares a birthday with probability 1/365, so the expected number of
                   
                    50
matching pairs is       /365 = 1225/365 ≈ 3.356.
                     2
For each calendar day, let Id indicate that at least two people are born on that day. The number born on a fixed
day is Bin(50, 1/365), hence
                                                                "            50                       49 #
                                                                        364               1        364
                    E(days with at least two births) = 365 1 −                      − 50                         .
                                                                        365              365       365



                                                            7


Introduction to Probability                                                                     Chapter 4: Expectation


Exercise 36
I12 and I34 are independent because they depend on disjoint pairs of independent birthdays. Also,
                                                                 1
                     P(I12 = 1, I13 = 1) = P(B1 = B2 = B3 ) =        = P(I12 = 1)P(I13 = 1),
                                                                3652
so I12 and I13 are independent as well. In fact, any two distinct pair indicators are independent. But the whole
collection is not mutually independent: I12 = I13 = 1 forces I23 = 1, while P(I23 = 1) = 1/365 < 1.


Exercise 37
Let X be the total number of bags received by the first three students. Each of the 20 bags goes to one of these
students with probability 3/20, so EX = 20(3/20) = 3 . For each student i, the probability of receiving at least
one bag is 1 − (19/20)20 . Thus

                      E(students receiving at least one bag) = 20 1 − (19/20)20 ≈ 12.83.
                                                                               



Exercise 38
Let Ii indicate that person i draws their own name. By symmetry, P(Ii = 1) = 1/n. The number of fixed points is
     Pn
X = i=1 Ii , so EX = n(1/n) = 1.


Exercise 39
For each population member i, let Ii indicate inclusion in both samples. Independence of the researchers’ samples
                                                P                          m n     mn
gives P(Ii = 1) = (m/N )(n/N ). The overlap is     Ii , hence E|A ∩ B| = N      =     .
                                                                           NN      N

Exercise 40
There are n − 2 possible starting positions for an occurrence of HTH. For each one, the probability of HTH is
(1/2)3 = 1/8. Indicators and linearity give E(# occurrences) = (n − 2)/8 for n ≥ 3 (and zero for n < 3). Overlap
causes no difficulty for expectation.


Exercise 41
There are 51 adjacent pairs. For any specified pair, the probability that both cards are red is
                                                  26 25      25
                                                         =      .
                                                  52 51     102
Thus the expected number of adjacent red-red pairs is 51 · 25/102 = 25/2 = 12.5.


Exercise 42
For each toy type i, let Ii indicate that it has appeared at least once in the first t draws. Its probability of appearing
                                                                          "              t #
                                                                                        1
is 1 − (1 − 1/n)t . Summing over the n types, E(distinct types) = n 1 − 1 −                    .
                                                                                       n


Exercise 43
For floor j, let Ij indicate that at least one of the k passengers chooses it. Then EIj = 1 − (1 − pj )k .
(a) With equal probabilities pj = 1/(n − 1) over floors 2, . . . , n,
                                                        "                   k #
                                                                   1
                                       E(stops) = (n − 1) 1 − 1 −                   .
                                                                  n−1

                              n
                              X
(b) In general, E(stops) =      [1 − (1 − pj )k ].
                              j=2



                                                            8


Introduction to Probability                                                                  Chapter 4: Expectation


Exercise 44
There are initially 200 free ends. Each step joins two ends and reduces the number of free ends by two, so exactly
100 steps are required. Hence the expected number of steps is 100 .
When there are r pieces remaining, there are 2r free ends. After choosing one end, exactly one of the other
2r − 1 ends belongs to the same piece, so the probability that this step closes a loop is 1/(2r − 1). Summing loop
indicators over r = 100, 99, . . . , 1 gives
                                                          100
                                                         X       1
                                              E(loops) =             .
                                                         r=1
                                                              2r − 1


Exercise 45
For an outcome belonging to exactly k of the events, the indicators satisfy
                                  I(A1 ∩ · · · ∩ An ) ≥ I(A1 ) + · · · + I(An ) − n + 1.
If k = n, both sides equal 1; if k ≤ n − 1, the right side is nonpositive and the inequality still holds. Taking
expectations yields
                                                           n
                                                           X
                                     P(A1 ∩ · · · ∩ An ) ≥   P(Aj ) − n + 1.
                                                                   j=1



Exercise 46
The expected number of failures (non-aces) before the first of four aces in a random ordering of 48 non-aces and 4
aces is 48/(4 + 1) = 9.6 . Equivalently, the 48 non-aces are symmetrically distributed among the five gaps before,
between, and after the four aces; each gap has mean 48/5. The gap between the first and second ace therefore also
has expected length 9.6 .


Exercise 47
(a) Without feedback, the guess at any given position cannot use information about the card at that position. That
card is uniform over the 52-card deck, so each prediction is correct with probability 1/52. Thus EX = 52/52 = 1 ,
regardless of the guessing strategy.
(b) Fix an order of the 52 cards, and use the strategy described. There are at least j correct predictions exactly
when the first j named cards appear in the deck in that same relative order. Among their j! equally likely relative
orders, one is increasing, so P(X ≥ j) = 1/j!. The tail-sum identity gives
                                                  52
                                                  X  1
                                           EX =              ≈ e − 1 ≈ 1.71828.
                                                  j=1
                                                        j!

(c) With complete feedback and a non-stupid strategy, at each position one of the as-yet-unrevealed cards is named.
There are successively 52, 51, . . ., 1 cards remaining, and the probability of a correct guess at that position is the
reciprocal of the number remaining. Hence
                                                        1          1
                                           EX = 1 +       + ··· +    = H52 .
                                                        2         52

Exercise 48
           Pn
Write X = i=1 Ii , where Ii indicates that draw i is white. Then EIi = p = w/N , and for i ̸= j, E(Ii Ij ) =
w(w − 1)/(N (N − 1)). Therefore
                                                           w(w − 1)
                                     EX 2 = np + n(n − 1)            .
                                                           N (N − 1)
Subtracting (np)2 and simplifying gives
                                                 N −n                    w
                                     Var(X) =         npq,          p=     , q = 1 − p.
                                                 N −1                    N
This also follows by expanding the variance of the sum and using the negative covariance between distinct draws.


                                                               9


Introduction to Probability                                                                   Chapter 4: Expectation


Exercise 49
                                                                                                              Pn
Let Ij indicate that prize j is selected. Every prize has inclusion probability k/n. The total value is S =     j=1 jIj ,
so
                                                      n
                                                     X    k    k(n + 1)
                                              ES =       j =            .
                                                     j=1
                                                          n        2


Exercise 50
There are 10
             
            2 = 45 pairs of chords. For any two chords, consider their four endpoints in circular order. There are
three ways to pair four endpoints; exactly one pairing gives intersecting chords, and symmetry makes the three
pairings equally likely. Thus a given pair intersects with probability 1/3, and E(intersecting pairs) = 45/3 = 15.


Exercise 51
For a specified location, the number of stored phone numbers is Bin(k, 1/n). Summing its category probabilities
over all n locations gives

                                       E(empty) = n(1 − 1/n)k ,
                                  E(exactly one) = k(1 − 1/n)k−1 ,
                              E(more than one) = n − n(1 − 1/n)k − k(1 − 1/n)k−1 .

These three expected counts add to n, because every location belongs to exactly one of the three categories.


Exercise 52
                                                                                         Pn
Let Ii indicate that toss i differs from toss i − 1. The number of runs is R = 1 +         i=2 Ii .   Since P(Ii = 1) =
p(1 − p) + (1 − p)p = 2p(1 − p),
                                            ER = 1 + 2(n − 1)p(1 − p).


Exercise 53
Let Ai = I(tosses i, i + 1 are both H), i = 1, 2, 3. Then X = A1 + A2 + A3 , and each Ai is Bernoulli with success
probability p2 . Adjacent terms have covariance p3 − p4 = p3 (1 − p), while A1 and A3 are independent. Therefore

                       EX = 3p2 ,    Var(X) = 3p2 (1 − p2 ) + 4p3 (1 − p) = 3p2 + 4p3 − 7p4 .


Exercise 54
(a) A uniformly selected sample position contains each population member with probability 1/N . Thus EWj = ȳ
for every j, and by linearity EW̄ = ȳ.
                                                                        PN
(b) If Ii indicates that population member i is sampled, then W̄ = (1/n) i=1 Ii yi . Since P(Ii = 1) = n/N ,
                                                         N
                                                      1X n
                                              EW̄ =        yi = ȳ.
                                                      n i=1 N


Exercise 55
(a) For each pair of positions i < j, let Iij indicate that the larger number appears before the smaller one. By symme-
                                                                                                   
                                                                                                   n
try, EIij = 1/2. The number of inversions is the sum of these indicators, so E(inversions) =          /2 = n(n − 1)/4.
                                                                                                   2
(b) Every inversion must be corrected by an adjacent swap, and one comparison can make at most one such swap.
Hence comparisons C satisfy C ≥ (number of inversions), giving EC ≥ n(n − 1)/4. At most n − 1 sweeps occur,
and the numbers of comparisons per sweep are at most n − 1, n − 2, . . . , 1, so C ≤ n(n − 1)/2. Therefore

                                             n(n − 1)        n(n − 1)
                                                      ≤ EC ≤          .
                                                4               2

                                                          10


Introduction to Probability                                                                        Chapter 4: Expectation


In particular, the expected number of comparisons is of order n2 .


Exercise 56
(a) There are n − 6 possible starting positions for seven consecutive successes (if n ≥ 7). Each has probability p7 .
By indicators, E(7-success streaks) = (n − 6)p7 for n ≥ 7 (zero otherwise).
(b) Divide the shots into disjoint blocks of seven. Each block is all successes with probability p7 . The number G of
blocks until the first all-success block is geometric with mean 1/p7 . The first run of seven successes occurs no later
than the end of that block, so X ≤ 7G. Thus EX ≤ 7/p7 .


Exercise 57
(a) Before the first red, every draw is a failure with success probability r. The number of failures has geometric
mean (1 − r)/r.
(b) Green appears before the first red exactly when the first draw among the red/green subsequence is green,
which has probability g/(r + g). Similarly, blue appears before red with probability b/(r + b). By indicators,
                                                g     b
 E(distinct non-red colors before first red) =    +      .
                                               r+g r+b
(c) If NR ∼ Bin(n, r) is the number of red draws, then

                                                              1 − (1 − r)n − nr(1 − r)n−1
                                  P(NR ≥ 2 | NR ≥ 1) =                                    .
                                                                      1 − (1 − r)n


Exercise 58
For X > n, the first candidate C1 must be the best among the first n + 1 candidates. By symmetry this has
probability 1/(n + 1). The tail-sum formula gives
                                               ∞                        ∞
                                               X                        X    1
                                       EX =          P(X > n) =                 = ∞.
                                               n=0                      n=0
                                                                            n+1

The interviewer waits an infinite expected time, even though a better candidate eventually appears with probability
one.


Exercise 59
(a) P(X ≤ 22) is the chance of a match among 22 people, which is below 1/2. P(X ≤ 23) is the chance of a match
among 23 people, which is above 1/2. Since X is integer-valued and its CDF is strictly increasing over its support,
23 is its unique median.
                                                   P366
(b) For 1 ≤ j ≤ 366, let Ij = I(X ≥ j). Then X = j=1 Ij . We have p1 = p2 = 1, and for j ≥ 3,
                                                                     j−2
                                                                     Y               
                                                                               i
                                          pj = P(X ≥ j) =                  1−             .
                                                                     i=1
                                                                              365

                   366
                   X
Therefore EX =           pj .
                   j=1

(c) Numerically, EX ≈ 24.6166 people.
(d) Since Ii Ij = Ij for i < j,
                                             366
                                             X              366
                                                            X                   366
                                                                                X
                                    EX 2 =         pj + 2         (j − 1)pj =       (2j − 1)pj .
                                             j=1            j=2                 j=1

Thus
                                                                     2
                                            366
                                            X                 X366
                                   Var(X) =     (2j − 1)pj −      pj  ≈ 148.6403.
                                              j=1                       j=1



                                                                   11


Introduction to Probability                                                                            Chapter 4: Expectation


Exercise 60
Let the n tagged elk be the successes and the N − n untagged elk be failures in a random ordering. The sample
ends at the mth tagged elk. If X = x, the mth tagged elk is at position m + x. Choose the m − 1 earlier tagged
elk from the preceding m + x − 1 positions and the remaining n − m tagged elk from the later positions:

                                                 m+x−1
                                                             N −m−x
                                                  m−1
                                 P(X = x) =                 N
                                                                 n−m    ,   x = 0, . . . , N − n.
                                                            n


                                                                                                     m(N + 1)
Since Y = m + X is the position of the mth success in a random permutation, EY =                              .
                                                                                                      n+1
For a fixed sample size r = EY , the expected number of tagged elk is rn/N , namely

                                       n m(N + 1)    n(N + 1)
                                                  =m           < m (n < N ),
                                       N n+1         N (n + 1)

so it is strictly less than m.


LOTUS
Exercise 61
For X ∼ Pois(λ),
                                                      ∞                         ∞
                                                      X               λk       X
                                            E(X!) =         k!e−λ        = e−λ   λk .
                                                                      k!
                                                      k=0                       k=0

The geometric series converges exactly when 0 ≤ λ < 1. Thus E(X!) = e−λ /(1 − λ) (0 ≤ λ < 1), and the
expectation is infinite for λ ≥ 1.


Exercise 62
Using the Poisson probability generating function,
                                                         ∞
                                                         X (2λ)k
                                          E(2X ) = e−λ                  = e−λ e2λ = eλ ,
                                                                 k!
                                                         k=0

which is finite for every finite λ ≥ 0.


Exercise 63
Let X ∼ Geom(p) on 1, 2, . . . and q = 1 − p. Then
                                                X                 X
                                       E(2X ) =    pq k−1 2k = 2p   (2q)k .
                                                      k≥1                    k≥0


This is finite iff 2q < 1, or p > 1/2, and then E(2X ) = 2p/(2p − 1).
For the reciprocal power,
                                                            pX           p
                                             E(2−X ) =         (q/2)k =     ,
                                                            2           1+p
                                                             k≥0

which is finite for every 0 < p ≤ 1.


Exercise 64
For X ∼ Geom(p),                                      X                        X
                                          E(etX ) =         petk q k−1 = pet       (qet )k .
                                                      k≥1                      k≥0




                                                                 12


Introduction to Probability                                                               Chapter 4: Expectation


Therefore
                                                       pet
                                       MX (t) =                    if (1 − p)et < 1.
                                                  1 − (1 − p)et

For 0 < p < 1 this means t < − log(1 − p); for larger or equal t the expectation diverges. If p = 1, then X = 1 and
MX (t) = et for every real t.


Exercise 65
Write Y = 1 + X with X ∼ Pois(λ). (a) Since EX = Var(X) = λ,

                              E(Y 2 ) = Var(Y ) + (EY )2 = λ + (1 + λ)2 = λ2 + 3λ + 1.
                                    R1 k
(b) By LOTUS and 1/(k + 1) =         0
                                       t dt,

                                    1        X    λk       e−λ X λj   1 − e−λ
                              E        = e−λ             =          =         ,
                                  X +1         k!(k + 1)    λ    j!      λ
                                                k≥0                   j≥1

with limiting value 1 at λ = 0.


Exercise 66
Let θ = e−3λ . (a) The Poisson generating function gives

                                               E(e−3X ) = exp{λ(e−3 − 1)}.

So the bias of T = e−3X is exp{λ(e−3 − 1)} − e−3λ , which is generally nonzero.
(b) Similarly, E[(−2)X ] = exp{λ(−2 − 1)} = e−3λ = θ, so g(X) = (−2)X is unbiased.
(c) This estimator is unreasonable numerically: it is negative for odd X and has large magnitude for large X,
although 0 < θ ≤ 1. Define h(X) = I(X is even), which clips the estimator to the interval [0, 1]. If X is odd, then
|h − θ| = θ < 2X + θ = |g − θ|. If X = 0, both estimators equal 1; if X is positive and even, then h = 1 while
g = 2X ≥ 4, so |h − θ| = 1 − θ < 2X − θ = |g − θ|. Thus h is never worse and is strictly better whenever X ≥ 1.


Poisson approximation
Exercise 67
The seating arrangements for Contracts and Torts differ by a uniform random permutation of the 100 seats. No
repeated seat means this permutation has no fixed points. By inclusion–exclusion, the exact probability is the
derangement probability
                                                        100
                                                        X   (−1)k
                                          P(X = 0) =              .
                                                              k!
                                                             k=0

The number of fixed points is approximately Pois(1), so

                                                                              2
                                       P(X = 0) ≈ e−1 ,         P(X ≥ 2) ≈ 1 − .
                                                                              e

Exercise 68
(a) If Ii indicates that person i selects their own name, then P(Ii = 1) = 1/n. Thus EX = 1.
(b) For a fixed unordered pair {A, B}, the probability of the two-cycle A 7→ B, B 7→ A is 1/[n(n − 1)]. Summing
over n2 pairs gives 1/2 .
       

(c) The number of fixed points in a random permutation is approximately Pois(1) for large n. In particular,
 P(X = 0) → e−1 .



                                                           13


Introduction to Probability                                                                Chapter 4: Expectation


Exercise 69
Count colliding pairs of sample positions. There are 1000
                                                          
                                                        2   pairs, and a specified pair chooses the same person with
probability 10−6 . The expected number of collisions is
                                                  1000
                                                      
                                                    2
                                            λ=           = 0.4995 ≈ 0.5.
                                                   106
The number of collision pairs is approximately Poisson, giving P(at least one repeated person) ≈ 1 − e−0.4995 ≈ 0.393.


Exercise 70
(a) The number of winners is Bin(107 , 10−7 ), which is well approximated by Pois(1) .
(b) Conditional on your having won, let W ∼ Pois(1) be the number of other winners. If there are W + 1 winners,
your chance of receiving the prize is 1/(W + 1). Hence
                                  1          X       1
                             E         = e−1               = e−1 (e − 1) = 1 − e−1 .
                               W +1              k!(k + 1)
                                             k≥0



Exercise 71
For each pair of the 90 people, the probability that they share both their own birthdays and their mothers’
birthdays is approximately 1/3652 . The expected number of matching pairs is
                                                90
                                                  
                                                         902      1
                                          λ= 22 ≈              =    .
                                               365    2 · 3602   32
The number of such pairs is approximately Poisson with this small mean, so 1 − e−λ ≈ λ. The requested simple
fraction is P(at least one such pair) ≈ 1/32.


Exercise 72
(a) For n people, the number who share your birthday is approximately Pois(n/365). Set the probability of zero
matches equal to 1/2: e−n/365 = 1/2, giving n ≈ 365 log 2 ≈ 253.
(b) There are approximately 365 · 24 = 8760 equally likely birthday-hour categories. The number of matching pairs
                                                                                          p
is approximately Poisson with mean n2 /8760. Solving e−n(n−1)/(2·8760) = 1/2 gives n ≈ 2(8760) log 2 ≈ 110.2,
                                      

so about 111 people.
(c) The number of possible pairs grows quadratically in the number
                                                              √     of people. Dividing the number of categories
by 24 therefore multiplies the required group size by roughly 24, not by 24.
(d) Using an indicator for each triplet, the Poisson mean is λ1 = 100                             −λ1
                                                                          2
                                                                   3 /365 ≈ 1.2137, giving 1 − e      ≈ 0.703 .
Alternatively, the number of people born on a fixed day is approximately Pois(100/365). The expected number of
days with at least three birthdays is
                                    "                                2 !#
                                           −100/365      100 1 100
                           λ2 = 365 1 − e            1+      +               ≈ 1.0201.
                                                         365 2 365

A Poisson approximation for the number of such days gives probability 1 − e−λ2 ≈ 0.639 . The day-based
approximation is closer to the stated 0.64 value.


Exercise 73
(a) Let K be the number of first-round pairs that are repeated in round two. For each of the 50 first-round
pairs, its two members are paired together in the second round with probability 1/99. Since each repeated pair
contributes two people to X, EX = 2EK = 2 · 50/99 = 100/99.
(b) X is always even, whereas a Poisson random variable can take odd values. Thus X is not well approximated
by a Poisson distribution for its full distribution.
(c) The repeated-pair count K is approximately Pois(50/99). Consequently,
                                                                           50 −50/99
                                 P(X = 0) ≈ e−50/99 ,       P(X = 2) ≈        e      .
                                                                           99

                                                         14


Introduction to Probability                                                                 Chapter 4: Expectation


Existence
Exercise 74
(a) For each of the 11 movies, the probability Alice and Bob both select it is (5/11)2 . Thus

                                    E(common movies) = 11(5/11)2 = 25/11.

(b) Each person names 52 = 10 distinct movie pairs. Across 111 people there are 1110 pair-occurrences, spread
                        

over 11
       
      2 = 55 possible pairs. Their average count is 1110/55 ≈ 20.18, so at least one pair is named by at least
 21 people.


Exercise 75
Choose a square with a uniformly random rotation. Each of its four corners is then uniformly distributed around the
circumference, so each corner is red with probability 2/3. The expected number of red corners is 4(2/3) = 8/3 > 2.
If every inscribed square had at most two red corners, the expectation could not exceed 2. Therefore some rotation
has at least three red corners.


Exercise 76
Choose two distinct students uniformly at random. For any one problem, at most 35 students got it wrong, so the
probability both chosen students got it wrong is at most
                                                   35 34   1190
                                                         =      .
                                                  100 99   9900
The expected number of problems missed by both is at most 8(1190/9900) = 0.9617 < 1. This count is a
nonnegative integer, so at least one pair has count zero. Those two students collectively solved every problem.


Exercise 77
Take a honeycomb tiling and translate it uniformly at random.
                                                          √     For any fixed point, the probability it lies inside
the inscribed circle of its hexagon is the area ratio π/(2 3) > 0.9. Put one coin at the center of each hexagon
containing at least one of the ten designated points. The expected number of covered points exceeds 10(0.9) = 9.
Since the number covered is an integer between 0 and 10, some translation covers all ten points; at most ten coins
are used, and no coins are stacked.


Exercise 78
Choose m binary strings independently and uniformly from the 2n possible strings. Fix a choice of k coordinate
positions and a target k-bit pattern. A random string matches that pattern with probability 2−k , so the probability
none of the m strings matches it is (1 − 2−k )m . There are nk 2k position-pattern constraints. By the union bound,
the probability that at least one constraint fails is at most
                                               
                                                 n k
                                                     2 (1 − 2−k )m < 1.
                                                 k

Thus there is positive probability that none fails, proving that a k-complete set of size at most m exists.


Mixed practice
Exercise 79
(a) With replacement, each guess is correct with probability 1/m, so the number of guesses is geometric and
 EG = m.
(b) Without replacement, the correct password has a uniformly random position among the m guesses. Hence
 EG = (m + 1)/2.



                                                         15


Introduction to Probability                                                                            Chapter 4: Expectation


(c) For m > 1, m > (m + 1)/2. Replacing a wrong guess prevents it from being repeated, so sampling without
replacement cannot waste attempts on already-tried passwords.
(d) With replacement, for n attempts maximum,
                                             k−1                                                       n−1
                             1            1                                                           1
                 P(Gn = k) =           1−            , k = 1, . . . , n − 1;    P(Gn = n) =        1−            .
                             m            m                                                           m
The last mass includes both success on attempt n and no success in the first n attempts. Without replacement, if
n ≤ m,
                         P(Gn = k) = 1/m (k < n),       P(Gn = n) = (m − n + 1)/m.
If n > m, the distribution is uniform on 1, . . . , m and zero thereafter.


Exercise 80
A roll is acceptable if it is at least m, which happens with probability p = (21 − m)/20. Thus the number of rolls
N is geometric:
                                                        1      20
                                                  EN = =            .
                                                        p    21 − m
                                                             ∞ √                               k−1
                                                        √
                                                                                     
                                                             X                           m−1          21 − m
For the second part, LOTUS gives the convergent series E N =     k                                           .
                                                                                          20            20
                                                                               k=1



Exercise 81
(a) Arrange all 360 people, then remove the order within each team and the order of the 120 teams:
                                                                        360!
                                               # partitions =                    .
                                                                    (3!)120 120!

(b) For a fixed married couple, the other two members of the first person’s team are a uniform sample of size
two from the other 359 people. The spouse is included with probability 2/359. A team of three cannot contain
two distinct married couples, so indicators over the 180 couples count the desired teams. The expectation is
        2    360
 180 ·     =     .
       359   359

Exercise 82
(a) There are 4 · 6n−1 rolls, each with probability 6−n of all dice showing six. The expected number of all-six
outcomes is 4 · 6n−1 /6n = 2/3.

(b) The number of occurrences is approximately Pois(2/3), so the probability of at least one is 1 − e−2/3 ≈ 0.4866.
(c) The first configuration is uniform over all 6n outcomes. The transition rule (stay put with probability 6/7,
otherwise refresh to an independent uniform configuration) preserves the uniform distribution. Therefore every roll
has marginal probability 6−n of all sixes. Linearity of expectation shows that the expected count remains 2/3 ,
even though successive configurations are now dependent.


Exercise 83
(a) Give each of the five people the required 10 dollars first. The remaining 50 dollars are distributed as five
                                                
                                                54
nonnegative integers, giving by stars and bars       = 316251 allocations.
                                                 4
(b) By symmetry, each person has the same expected amount, and the five amounts sum to 100. Thus the first
person’s expected amount is 20 dollars.
(c) Write zi = xi − 10, so the five nonnegative zi sum to 50. The total number of allocations is 54
                                                                                                   
                                                                                                 4 = 316251. For
A2 , fix z1 = t and require z2 ≥ t + 1. Stars and bars gives
                                          24          
                                         X     52 − 2t                      1300
                                  #A2 =                  = 152100, P(A2 ) =       .
                                         t=0
                                                  3                         2703


                                                               16


Introduction to Probability                                                                                       Chapter 4: Expectation


By symmetry P(A3 ) = 1300/2703. For both A2 , A3 , require z2 , z3 ≥ t + 1 after fixing z1 = t:
                                              16          
                                              X    51 − 3t                                                 49
                              #(A2 ∩ A3 ) =                       = 97461,            P(A2 ∩ A3 ) =           .
                                               t=0
                                                         3                                                159

But (1300/2703)2 ̸= 49/159; hence A2 and A3 are not independent.


Exercise 84
Each song is equally likely to come from any of the 50 albums, independently. (a) The number from Joe’s favorite
                                             
                                              11
album is X ∼ Bin(11, 1/50), P(X = k) =             (1/50)k (49/50)11−k .
                                               k
(b) The probability all 11 songs are from different albums is
                                                         50 · 49 · · · 40
                                                                          .
                                                              5011
Thus
                                                                                           (50)11
                                          P(some album repeated) = 1 −                            .
                                                                                            5011
                  11
                   
(c) Each of the    2   = 55 song pairs comes from the same album with probability 1/50. The expected number of
matching pairs is 55/50 = 1.1.


Exercise 85
(a) Let X be the number of correctly guessed numbers. Then X ∼ Hypergeom(35, 5, 5) and
                                                                                 5
                                                                                  30
                                                                                 3    2
                                             P(X = 3 | X ≥ 1) =             35
                                                                                          .
                                                                                     − 30
                                                                                
                                                                            5           5

                       35
                         
(b) There are M =       5    equally likely lottery outcomes. The expected time to see every outcome is the coupon-
                                   (35
                                      5)
                                 35 X
collector mean M HM =                    1/j days.
                                  5 j=1

(c) For a fixed number, the chance it is absent from one draw is 30/35 = 6/7. Thus the expected number of missing
numbers after 50 days is 35(6/7)50 ≈ 0.01573. A Poisson approximation for the number missing gives
                                                                                       50
                                      P(all 35 have appeared) ≈ e−35(6/7)                    ≈ 0.9844.
                                                P35             k 35  35−k
                                                                           / 35
                                                                                
                                                                                 50
                                                                                            
An exact inclusion–exclusion expression is           k=0 (−1)     k {   5     5 } .


Exercise 86
(a) The joint distribution is multivariate Hypergeometric:
                                                                 nA
                                                                       nB  nC 
                                                                  x       y      z
                               P(X = x, Y = y, Z = z) =                   n
                                                                                      ,        x + y + z = m.
                                                                          m

(b) Writing X as the sum of indicators for the nA members of party A, each with inclusion probability m/n, gives
 EX = mnA /n.
(c) The Hypergeometric variance is

                                                             nA     nA  n − m
                                             Var(X) = m           1−            .
                                                              n       n   n−1

For m = 1 this is the Bernoulli variance for one sampled adult. For m = n, the sample contains the whole
population and the variance is zero, as the formula shows.


                                                                 17


Introduction to Probability                                                                              Chapter 4: Expectation


Exercise 87
(a) Each senator has inclusion probability c/100, so the expected number of Democrats is cd/100 .
(b) For a given state, the probability neither senator is selected is 98
                                                                         100
                                                                       c / c . Thus the expected number of
                                 !
                                 98
                                  c
represented states is 50 1 −    100
                                       .
                                  c

                                                                                                                c(c − 1)
(c) A given state’s two senators are both selected with probability c(c − 1)/(100 · 99). Hence 50                        .
                                                                                                                100 · 99
(d) The number of junior senators in a size-20 committee is Hypergeom(100, 50, 20), so
                                                         50       50
                                                                      
                                                          j     20−j
                                        P(J = j) =            100
                                                                          ,         EJ = 10.
                                                               20


                                     20 · 19    190
(e) Substitute c = 20 into (c): 50            =     ≈ 1.9192.
                                     100 · 99   99

Exercise 88
The order of the g good and b bad courses is a uniformly random ordering. The expected number of bad courses
before the first good course is the negative Hypergeometric mean b/(g + 1). It is strictly less than b/g, the mean
number of failures before a success in independent sampling with replacement. Without replacement, each bad
course encountered reduces the number of bad courses left, so the chance of encountering another bad course
decreases.


Exercise 89
(a) The number of Cs in 115 independent positions is Bin(115, pC ), so Var = 115pC (1 − pC ).
(b) There are 115 − 6 + 1 = 110 possible starting positions for CATCAT. Each occurrence has probability p2C p2A p2T ,
giving E(# CATCAT) = 110p2C p2A p2T .
(c) There are four possible starting positions for CAT in a string of length six. Each has probability pA pC pT .
Occurrences at starts separated by one or two positions are incompatible; starts 1 and 4 can occur together and
have probability (pA pC pT )2 . Inclusion–exclusion therefore gives P(at least one CAT) = 4pA pC pT − (pA pC pT )2 .


Exercise 90
(a) Let Ii indicate that person i is in both independent samples.                           Then EIi = (100/1000)(20/1000), so
 E|A ∩ B| = 2.

(b) Since |A ∪ B| = |A| + |B| − |A ∩ B|, E|A ∪ B| = 100 + 20 − 2 = 118.
(c) For a fixed married couple, the probability both are in Bob’s sample is 20 · 19/(1000 · 999). Summing over 500
                    20 · 19     190
couples gives 500            =      .
                  1000 · 999    999

Exercise 91
For a group-1 observation Xj , its rank is
                                                X                              n
                                                                               X
                                     Rj = 1 +          I(Xi < Xj ) +                 I(Yℓ < Xj ).
                                                i̸=j                           ℓ=1

For the first sum, each probability is 1/2 by exchangeability of the i.i.d. X’s and the no-ties assumption. For the
second, each probability is p = P(X > Y ). Hence ERj = 1 + (m − 1)/2 + np, and summing over j = 1, . . . , m gives

                                                         m(m + 1)
                                                ER =              + mnp.
                                                            2

                                                               18


Introduction to Probability                                                                    Chapter 4: Expectation


When F = G, p = 1/2 and this reduces to m(m + n + 1)/2.


Exercise 92
Let X be the best (largest rank) dish among the k exploratory dishes. (a) Every exploratory dish has expected
rank (n + 1)/2, so the expected total rank from the exploration phase is k(n + 1)/2. During the exploitation phase,
the best exploration dish is ordered m − k times. Thus total expected reward is

                                                        k(n + 1)
                                               S(k) =            + (m − k)EX.
                                                           2

(b) For X = x, one of the selected dishes must have rank x and the remaining k − 1 selected ranks must be among
1, . . . , x − 1. Hence
                                                     x−1
                                                        
                                                             k−1
                                           P(X = x) =         n
                                                                      ,   x = k, . . . , n.
                                                              k

(c) Use the hockey-stick identity:
                                               x−1
                                     n                     n  
                                                                   k n+1
                                                                        
                                     X         k−1      k X x        k+1    k(n + 1)
                              EX =         x    n
                                                     = n       =   n
                                                                         =          .
                                                k       k
                                                              k       k
                                                                             k+1
                                     x=k                     x=k

(d) Substituting this into S(k) and simplifying,
                                                                     
                                                               k m+1
                                       S(k) = (n + 1) (m + 1) − −       .
                                                               2  k+1

Treat k as continuous. Differentiating the bracket gives −1/2 + (m + 1)/(k + 1)2 , which vanishes at
                                                             p
                                                      k∗ =       2(m + 1) − 1.

Since k must be an integer between 1 and m, compare the nearest feasible integers below and above this value
(and choose the one giving the larger S(k)). This is the stated rounded-up-or-down rule.




                                                                  19
```
