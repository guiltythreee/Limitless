# Chapter 3: Random Variables and Their Distributions — Detailed Solutions

**Book:** Introduction to Probability, Second Edition  
**Authors:** Joseph K. Blitzstein and Jessica Hwang

> Source transcription from the supplied chapter-solution PDF. The solution numbering and worked reasoning are retained. Mathematical notation should be checked against the original source if a character appears ambiguous.

```text
INTRODUCTION TO PROBABILITY


                        Detailed Solutions
   Chapter 3 – Random Variables and Their Distributions


                   Complete worked solutions to Exercises 1–47




Scope. Solutions follow the exercise section in the uploaded Chapter 3 PDF. They use the
chapter’s PMF, CDF, named-distribution, and independence notation. Numerical computations
are identified as approximations.


Introduction to Probability            Chapter 3: Random Variables


Contents
PMFs and CDFs                                                   2

Named distributions                                             5

Independence of random variables                               10

Mixed practice                                                 11




                                   1


Introduction to Probability                                                             Chapter 3: Random Variables


PMFs and CDFs

Exercise 1

Assume birthdays are independent and uniformly distributed over 365 days (leap days ignored). The
event X = k means the first k − 1 people have distinct birthdays and person k matches one of them.
For 2 ≤ k ≤ 366,
                                                          
                                              k−2
                                               Y 365 − j k − 1
                                P (X = k) =                     .
                                                     365     365
                                                          j=0

For k = 366 the final factor is 365/365 = 1: by the pigeonhole principle a match is then certain. The
support is {2, 3, . . . , 366}.


Exercise 2

(a) The number of fair Bernoulli trials up to and including the first success is geometric with parameter
1/2:
                                                 k
                                                  1
                                  P (X = k) =          , k = 1, 2, . . . .
                                                  2

The first k − 1 trials must fail and trial k must succeed. (b) To stop at trial k ≥ 2, the first k − 1
results must all be the same and trial k must be the opposite result. There are two disjoint patterns,
all heads then tails or all tails then heads, each of probability 2−k . Thus

                                         P (X = k) = 21−k ,         k = 2, 3, . . . .


Exercise 3

Because σ > 0,                                                        
                                                                   y−µ
                       FY (y) = P (Y ≤ y) = P (µ + σX ≤ y) = P X ≤       .
                                                                    σ
Therefore                                                                
                                                                    y−µ
                                              FY (y) = FX                     .
                                                                     σ


Exercise 4

The proposed function is nondecreasing, right-continuous, has limits 0 and 1 at −∞ and +∞, and
takes values in [0, 1]; hence it is a CDF. Its jumps occur at the integers 1, 2, . . . , n, each of size 1/n.
Therefore
                                                 1
                                     P (X = k) = , k = 1, 2, . . . , n,
                                                 n
and zero elsewhere. This is the discrete uniform distribution on {1, . . . , n}.


Exercise 5

(a) The PMF is p(k) = 2−(k+1) for k = 0, 1, . . .. It is nonnegative and
                               ∞                      ∞
                               X
                                         −(k+1)     1X          1    1
                                     2            =    (1/2)k =           = 1.
                                                    2           2 1 − 1/2
                               k=0                   k=0




                                                           2


Introduction to Probability                                                         Chapter 3: Random Variables


(b) For x ≥ 0, put m = ⌊x⌋. Then
                                             m
                                             X
                                   F (x) =         2−(k+1) = 1 − 2−(m+1) .
                                             k=0

Thus                                        (
                                             0,            x < 0,
                                    F (x) =     −(⌊x⌋+1)
                                             1−2         , x ≥ 0.


Exercise 6

The probabilities are nonnegative. Their sum telescopes after using logarithm rules:
                                                          
                        9                        9
                       X          j+1              Y j + 1
                          log10          = log10             = log10 (10) = 1.
                                   j                   j
                       j=1                                 j=1

Hence Benford’s formula is a valid PMF.


Exercise 7

For 1 ≤ k ≤ 6, the event X = k requires reaching level k and then failing to reach k + 1. Therefore
                                                     
                                              k−1
                                              Y
                              P (X = k) =          pj  (1 − pk ),    k = 1, . . . , 6.
                                              j=1


To reach level 7, Bob must pass all six transitions:

                                      P (X = 7) = p1 p2 p3 p4 p5 p6 .

The empty product for k = 1 is 1.


Exercise 8

Let M be the maximum value among five prizes drawn without replacement. For M = m, one          must
                                                                                            100
select prize m and four of the m − 1 smaller prizes. The total number of 5-prize subsets is 5 . Thus

                                                   m−1
                                                       
                                                    4
                                P (M = m) =        100 ,
                                                             m = 5, 6, . . . , 100.
                                                    5



Exercise 9

(a) Since F1 , F2 are nondecreasing and right-continuous, so is F = pF1 + (1 − p)F2 . Also 0 ≤ F ≤ 1,
and its limits at −∞ and +∞ are 0 and p + (1 − p) = 1. Thus F is a valid CDF. (b) Let I be the coin
outcome. By conditioning,

    P (X ≤ x) = P (X ≤ x | I = H)p + P (X ≤ x | I = T )(1 − p) = pF1 (x) + (1 − p)F2 (x) = F (x).

So the random selection mechanism has exactly the mixture CDF.




                                                          3


Introduction to Probability                                                  Chapter 3: Random Variables


Exercise 10

(a)
P No. A PMF proportional to 1/n would have the form c/n for c > 0, butP         the harmonic series
                                                                                        2
  n≥1 1/n diverges, so it cannot be normalized to sum to 1. (b) Yes. The series  n≥1 1/n converges,
                              2
so choosing c = 1/ζ(2) = 6/π gives a valid PMF:

                                                     6
                                     P (X = n) =          ,     n ≥ 1.
                                                   π 2 n2

Exercise 11

By definition, G(x) = P (X < x). Since X takes only nonnegative integer values,
                                                           
                                     G(x) = P X ≤ ⌈x⌉ − 1 .

Consequently
                                          G(x) = F (⌈x⌉ − 1).
For example, at an integer x = k, this is F (k − 1), whereas between k and k + 1 it is F (k).


Exercise 12

(a) Take X ≡ 2 and Y ≡ 1. Then FX (x) ≤ FY (x) for every x, with strict inequality for 1 ≤ x < 2.
The CDF of X jumps at 2 and the CDF of Y jumps at 1; their PMFs are unit masses at 2 and 1
respectively. More generally, this is the CDF ordering associated with X being larger than Y . (b) It is
                   P ≤ pY (x) for
impossible. If pX (x)            P every x and strict inequality holds at one point, summing over the
support gives 1 = x pX (x) < x pY (x) = 1, a contradiction.


Exercise 13

For every value a, use the law of total probability over the values z of Z:
                  X                                  X
     P (X = a) =      P (X = a | Z = z)P (Z = z) =       P (Y = a | Z = z)P (Z = z) = P (Y = a).
                   z                                   z

Thus X and Y have the same unconditional PMF and hence the same distribution.


Exercise 14

For X ∼ Pois(λ), (a) using the first two PMF values,

                        P (X ≥ 1) = 1 − e−λ ,      P (X ≥ 2) = 1 − e−λ (1 + λ).

(b) For k ≥ 1, conditional probability gives

                                                              e−λ λk /k!
                                   P (X = k | X ≥ 1) =                   .
                                                               1 − e−λ

The probability is zero for k = 0; the denominator is the probability that the customer appears in the
company’s database.




                                                   4


Introduction to Probability                                                    Chapter 3: Random Variables


Named distributions

Exercise 15

For the discrete uniform variable on {1, . . . , n},
                                              
                                              0,
                                                                x < 1,
                                      FX (x) = ⌊x⌋/n,            1 ≤ x < n,
                                              
                                               1,                x ≥ n.
                                              

The CDF increases by 1/n at each integer from 1 through n.

Exercise 16

If X is uniform on finite set C and B ⊆ C is nonempty, then for x ∈ B
                                                              1/|C|     1
                                   P (X = x | X ∈ B) =               =     .
                                                             |B|/|C|   |B|

It is zero for x ∈
                 / B. The conditional distribution is DUnif(B) .


Exercise 17

Let X be the number of booked passengers who show up. Independence gives X ∼ Bin(110, 0.9).
Enough seats are available exactly when X ≤ 100, so
                                      100     
                                      X    110
                   P (enough seats) =           (0.9)k (0.1)110−k = FBin(110,0.9) (100).
                                            k
                                        k=0



Exercise 18

(a) Team A wins in exactly 4 + k games if its fourth win is the last game, the first 3 + k games contain
three A wins and k B wins, and the final game is an A win. Here k = 0, 1, 2, 3. Therefore
                                                     3      
                                                     X
                                                       4 3+k
                               P (A wins series) = p          (1 − p)k .
                                                          3
                                                           k=0

(b) Playing all seven games or stopping when the series is decided does not change which team obtains
four wins first. Extra games after that stopping time cannot change the winner, so the probability is
the same.

Exercise 19

Let D be the number of drawn games. Each game is a draw with probability 0.6, independently, so
                                                     
                                                      n
                       D ∼ Bin(n, 0.6), P (D = k) =     (0.6)k (0.4)n−k .
                                                      k

Each drawn game involves two players. Thus the number L of players whose games end in draws is
L = 2D, with
                                      
                                       n
                        P (L = 2k) =     (0.6)k (0.4)n−k , k = 0, . . . , n,
                                       k
and zero for odd values.

                                                       5


Introduction to Probability                                                        Chapter 3: Random Variables


Exercise 20

(a) The number of winning tickets among three independent tickets is W ∼ Bin(3, p), with
                                       
                                        3 k
                         P (W = k) =       p (1 − p)3−k , k = 0, 1, 2, 3.
                                        k

(b) Inclusion–exclusion gives 3p − 3p2 + p3 for the union of the three winning-ticket events. Equivalently,

                     P (W ≥ 1) = 1 − P (W = 0) = 1 − (1 − p)3 = 3p − 3p2 + p3 .

(c) The chance for one ticket is p; for three it is 3p − 3p2 + p3 < 3p for 0 < p ≤ 1. When p is small, the
terms p2 , p3 are negligible, so the probability is approximately 3p.


Exercise 21

For 0 < p < 1 and positive m, the event X = 0, Y = 1 has positive probability, so X − Y = −1 has
positive probability. A Binomial random variable cannot take negative values. Thus X − Y is not
Binomial (apart from degenerate endpoint cases such as p = 0).


Exercise 22

(a) First condition on which coin was selected:
                                                 
                           1 n k           n−k   1 n k
               P (X = k) =     p (1 − p1 )     +     p (1 − p2 )n−k ,                   k = 0, . . . , n.
                           2 k 1                 2 k 2

(b) If p1 = p2 = p, the two terms are identical and X ∼ Bin(n, p). (c) For large n, the observed
fraction of heads is close to p1 or p2 , depending on which coin was chosen. The distribution therefore
has two potential centers rather than the single center of one Binomial model with a fixed success
probability. The random coin choice creates persistent heterogeneity.


Exercise 23

For one eligible voter, the probability of voting for Kodos is the product of the three conditional stages:

                                               r = p1 p2 p3 .

The people act independently, so the number of votes for Kodos has distribution

                                             Bin(n, p1 p2 p3 ).


Exercise 24

(a) If the first two tosses are heads, they contribute two heads with certainty and the remaining eight
tosses are independent fair tosses. Hence

                                                      d
                                  X | (first two H) = 2 + Bin(8, 1/2),

                              8
                                 −8
so P (X = k | first two H) = k−2 2 for k = 2, . . . , 10. (b) Unconditionally X ∼ Bin(10, 1/2). The
conditioning event is X ≥ 2, whose probability is 1 − (1 + 10)/210 = 1013/1024. Thus

                                                          10
                                                           
                                                          k
                              P (X = k | X ≥ 2) =              ,   k = 2, . . . , 10.
                                                     1013

                                                     6


Introduction to Probability                                                Chapter 3: Random Variables


Exercise 25

(a) The variables n − X and X have the same distribution, and n + 1 − Y and Y have the same
distribution; the transformed variables remain independent. Also,

                         n − X < n + 1 − Y ⇐⇒ Y < X + 1 ⇐⇒ Y ≤ X,

since X, Y are integer-valued. (b) Therefore P (X < Y ) = P (Y ≤ X). These two events are
complements, so
                                      P (X < Y ) = 1/2.


Exercise 26

If X ∼ HGeom(w, b, n) counts white balls in a sample of size n, then n − X counts black balls in the
same sample. Interchanging the names of white and black gives

                                       n − X ∼ HGeom(b, w, n).


Exercise 27

The number of matches is not Binomial. If Ij indicates that position j contains card j, then P (Ij =
1) = 1/n, but for i ̸= j,
                                                       1        1
                              P (Ii = 1, Ij = 1) =           ̸= 2 ,
                                                   n(n − 1)    n
so the indicators are dependent. It is not Hypergeometric either: the “success” labels are not a fixed
subset of a population sampled without replacement; a match depends jointly on the card and its
position. The variable counts fixed points of a random permutation.


Exercise 28

Each egg hatches independently with probability p, so the number that hatch is

                                            H ∼ Bin(n, p).

For each egg to yield a surviving chick, it must hatch and then survive; this has probability pr. These
events are independent across eggs, so

                                           S ∼ Bin(n, pr).


Exercise 29

For any particular sequence with exactly k successes and n − k failures, independence gives probability
pk q n−k . This value is the
                           same for every sequence with k successes. Conditional on the number of
successes being k, all nk such sequences therefore have equal probability, namely 1/ nk .


Exercise 30

(a) Promoting a uniformly selected subset of t employees is sampling without replacement from n
women and m men. The number of women promoted is

                                                                      n   m
                                                                              
                                                                      k t−k
                              X ∼ HGeom(n, m, t),       P (X = k) =    n+m
                                                                                  .
                                                                        t



                                                    7


Introduction to Probability                                                                Chapter 3: Random Variables


(b) Independent promotion decisions give

                   W ∼ Bin(n, p),    n − W ∼ Bin(n, 1 − p),                T ∼ Bin(n + m, p),

where W is women promoted and T is all employees promoted. (c) Conditional on exactly t total
promotions, all t-subsets of employees are equally likely because each has probability pt (1 − p)n+m−t .
Thus W | T = t is HGeom(n, m, t) .


Exercise 31

(a) With three milk-first cups among six, the number of correct identifications among the lady’s three
guesses is X ∼ HGeom(3, 3, 3). Hence
                                           3 3     3 3
                                                   
                                           2 1 + 3 0       9+1
                            P (X ≥ 2) =         6
                                                       =         = 1/2 .
                                                3
                                                            20

(b) The prior odds of milk-first are 1. The likelihood of her saying “milk-first” is p1 if the cup is
milk-first, and 1 − p2 if it is tea-first. Bayes’ rule in odds form gives

                                                              p1
                                       posterior odds =            .
                                                            1 − p2


Exercise 32

(a) Studied terms form a set of s successes among 100; the 10 exam terms are a sample without
replacement. Thus

                                                                                   s
                                                                                        100−s
                                                                                   k        10−k
                       X ∼ HGeom(s, 100 − s, 10),         P (X = k) =                      100
                                                                                                  .
                                                                                           10

(b) For s = 75,
                                              10    75      25
                                                                
                                              X     k     10−k
                                P (X ≥ 7) =              100
                                                                    ≈ 0.7854 .
                                              k=7        10


Exercise 33

(a) For each typo, the probability it is caught by at least one reader is 1 − q1 q2 = p1 + p2 − p1 p2 .
Independent typos therefore give
                                        X ∼ Bin(n, 1 − q1 q2 ).
(b) When p1 = p2 = p, the counts X1 , X2 are independent Bin(n, p) variables. For X1 + X2 = t,
                                                         
                                                   n     n
                      P (X1 = k | X1 + X2 = t) ∝              pt (1 − p)2n−t .
                                                   k    t−k

Using Vandermonde’s identity to normalize gives

                                                                       n      n
                                                                                  
                                                                       k     t−k
                                P (X1 = k | X1 + X2 = t) =                 2n
                                                                                      ,
                                                                            t

for max(0, t − n) ≤ k ≤ min(n, t). This is HGeom(n, n, t).




                                                    8


Introduction to Probability                                                                 Chapter 3: Random Variables


Exercise 34

(a) Let X be the total number of Statistics majors and K the number in the sample. Given X = x,
the sample is Hypergeometric:
                                                       x n−x
                                                             
                                                                        k   m−k
                                      P (K = k | X = x) =                   n
                                                                                    .
                                                                            m

The law of total probability gives, for k = 0, . . . , m,

                                                            n x         n−x x
                                              n−m+k
                                                                                     n−x 
                                                            x p (1 − p)
                                               X
                              P (K = k) =                              n
                                                                          k             m−k
                                                                                               .
                                               x=k                    m


(b) A story proof is to choose the sample first and then let each of its m selected students independently
declare a Statistics major with probability p. The declarations are independent of which students were
sampled. Thus the sample’s major indicators are i.i.d. Bernoulli(p), giving
                                                               
                                                               m k
                            K ∼ Bin(m, p),        P (K = k) =     p (1 − p)m−k .
                                                               k

This is the simplification of the sum in (a).


Exercise 35

(a) A answers m questions independently with success probability p1 , so

                                              XA ∼ Bin(m, p1 ).

(b) Let XA and XB be the numbers correct by A and B. They are independent with distributions
Bin(m, p1 ) and Bin(n, p2 ). For r = 0, . . . , m + n,

                                       X m                                
                                                                                 n
                                                                                   
                P (XA + XB = r) =                  pk1 (1 − p1 )m−k                  pr−k (1 − p2 )n−r+k ,
                                              k                                 r−k 2
                                        k

where the sum is over max(0, r − n) ≤ k ≤ min(m, r). This is Binomial(m + n, p) exactly when the
success probabilities of all trials are the same, i.e. p1 = p2 = p (for positive m, n). (c) A wins if she
answers the first question correctly, or both players fail once and then A answers correctly, and so on:
                                                                          p1                    p1
        P (A wins) = p1 + (1 − p1 )(1 − p2 )p1 + · · · =                                =                 .
                                                                 1 − (1 − p1 )(1 − p2 )   p1 + p2 − p1 p2


Exercise 36

(a) X ∼ Bin(n, 1/2), so a tie occurs when X = n/2:
                                                                  n
                                                                    
                                                                 n/2
                                                  P (tie) =             .
                                                                 2n

(b) Stirling’s approximation gives
                                                               2n
                                                       
                                                   n
                                                            ≈p     .
                                                  n/2         πn/2
Therefore                                     r
                                                   2     1
                                  P (tie) ≈          =p       ,                  c = π/2.
                                                  πn   (π/2)n

                                                             9


Introduction to Probability                                                Chapter 3: Random Variables


Exercise 37

Let E be the number of bit errors. Then E ∼ Bin(n, p). A parity check fails to detect errors exactly
when the number of flipped bits is even. Since the event of no errors is not an error, the undetected-error
event is E ∈ {2, 4, 6, . . .}. (a) For n = 5 and p = 0.1,
                                                             
                                              5      2     3   5
               P (E = 2) + P (E = 4) =          (0.1) (0.9) +     (0.1)4 (0.9) = 0.07335 .
                                              2                4

(b)
                                                    n  
                                                    X  n k
                            P (undetected errors) =      p (1 − p)n−k .
                                                       k
                                                      k=2
                                                     k even

(c) Let a = P (E even) and b = P (E odd). The binomial theorem gives a + b = 1 and a − b = (1 − 2p)n .
Hence
                                             1 + (1 − 2p)n
                                        a=                 .
                                                   2
Subtract P (E = 0) = (1 − p)n to exclude the no-error case:

                                                     1 + (1 − 2p)n
                           P (undetected errors) =                 − (1 − p)n .
                                                           2


Independence of random variables

Exercise 38

(a) Let X = U and Y = U + 1, where U is any nonconstant discrete random variable. Then X, Y are
dependent and P (X < Y ) = 1. (b) Let X be uniform on {0, 1} and let Y ≡ 2. A constant random
variable is independent of every random variable, and P (X < Y ) = 1.


Exercise 39

Let X be uniform on {1, . . . , 10} and set Y = X + 1 for X < 10, with Y = 1 when X = 10. Then Y is
also uniform on that set, but X =  ̸ Y always. If X, Y were independent with this common distribution
p1 , . . . , p10 , then
                                                      X10
                                         P (X = Y ) =     p2j > 0,
                                                         j=1

so it is impossible for equality never to occur when the common support contains positive masses.


Exercise 40

(a) If P (X = Y ) = 1, then for every x, P (X = x) = P (Y = x); the PMFs are identical. (b) They can
be independent if they are constant at the same value. Conversely, if they are independent and equal
almost surely, then P (X = x) = P (X = x, Y = x) = P (X = x)2 , so every point mass is 0 or 1; the
common distribution must be degenerate.


Exercise 41

No. Let X and Z be the same fair Bernoulli random variable, and let Y be an independent fair
Bernoulli variable. Then X is independent of Y , and Y is independent of Z, but X = Z so X and Z
are dependent.


                                                    10


Introduction to Probability                                                  Chapter 3: Random Variables


Exercise 42

X is uniform on {1, . . . , 7}. The next day Y is obtained by the cyclic shift 1 7→ 2, . . . , 6 7→ 7, 7 7→ 1,
which is a permutation, so Y has the same uniform distribution. The inequality X < Y holds for six of
the seven equally likely days:
                                           P (X < Y ) = 6/7.


Exercise 43

(a) For any integer N ≥ 2, let X be uniform on {1, . . . , N } and let Y be its cyclic successor (with N
followed by 1). The distributions are identical and
                                                  N −1          1
                                      P (X < Y ) =       =1− .
                                                    N          N
                                                          13
Choose N = 10 for 0.9, N = 100 for 0.99, and N = 10 for 0.9999999999999. It is impossible to
attain 1: if X < Y almost surely, then for some rational r one has P (X ≤ r < Y ) > 0, which would
imply FX (r) > FY (r), contradicting equal distributions. (b) If X, Y are independent and identically
distributed, exchangeability gives P (X < Y ) = P (Y < X). Thus
                                                 1 − P (X = Y )   1
                                    P (X < Y ) =                ≤ .
                                                        2         2
None of the listed thresholds (all greater than 1/2) can be attained.

Exercise 44

(a) Since Y is fair and independent,
                                                                             1−p p 1
               P (X ⊕ Y = 1) = P (X = 0, Y = 1) + P (X = 1, Y = 0) =            + = .
                                                                              2  2 2
Thus X ⊕ Y ∼ Bern(1/2) . (b) Conditional on either value of X, XOR with an independent fair bit
is fair, so X ⊕ Y is independent of X. Conditional on Y = 0, X ⊕ Y = X; conditional on Y = 1,
X ⊕ Y = 1 − X. These have the same distribution only if p = 1/2. Hence it is independent of Y exactly
when p = 1/2. (c) Any nonempty XOR of independent fair bits is fair, so every YJ is Bernoulli(1/2).
For distinct nonempty J, K, split the bits into the disjoint groups A from J ∩ K, B from J \ K, and C
from K \ J. These group XORs are independent; applying part (b), or conditioning on the common
XOR A, shows that A ⊕ B and A ⊕ C are independent fair bits. Thus the variables are pairwise
independent. They are not mutually independent: for example, Y{1,2} = Y{1} ⊕ Y{2} is determined by
the first two, so the three are not independent.


Mixed practice

Exercise 45

Let H be the hypothesis that the new treatment works for 60% of patients. Its prior is 2/3; the
alternative 50% hypothesis has prior 1/3. The common binomial coefficient cancels from the likelihoods.
With 15 successes in 20 patients,
                                                   (2/3)(0.6)15 (0.4)5
                   P (H | 15 successes) =                                      ≈ 0.9099.
                                            (2/3)(0.6)15 (0.4)5 + (1/3)(0.5)20
For a second independent study, the predictive distribution is a mixture:
                                                                         
                                             20      k     20−k            20
                P (K = k | first study) = p     (0.6) (0.4)     + (1 − p)     (0.5)20 ,
                                             k                             k
where p is the posterior probability from part (a), and k = 0, . . . , 20.

                                                     11


Introduction to Probability                                                Chapter 3: Random Variables


Exercise 46

(a) The fortune starts at k. A win changes it by +2, and a loss by −1. For k ≥ 1, conditioning on the
first bet gives
                                1         1
                           pk = pk+2 + pk−1 , p0 = 1, pk → 0 as k → ∞.
                                2         2
For the original Bernoulli sequence, start the fortune at 1 and add 2 for each success, subtract 1 for each
failure. It reaches 0 exactly when failures first exceed twice the successes. Thus the desired probability
is p1 . (b) Try pk = rk . The recurrence
                               √           gives r3 − 2r + 1 = 0 = (r − 1)(r2 + r − 1). The roots are 1,
1/φ, and −φ, where φ = (1 + 5)/2 is the golden ratio. Boundedness and pk → 0 remove the first and
third roots; p0 = 1 fixes the coefficient. Hence

                                                pk = φ−k .

(c) The process starts at fortune 1, so the probability of ever having more than twice as many failures
as successes is                                  √
                                            −1     5−1
                                     p1 = φ =              ≈ 0.6180.
                                                     2

Exercise 47

Let X be the number of pages taken from tray 1. Then X ∼ Bin(n, 1/2) and tray 2 supplies n − X
pages. Both trays have enough paper iff X ≤ m and n − X ≤ m, or n − m ≤ X ≤ m. (a) For integer
m in the nontrivial range,

                    P (both trays suffice) = FBin(n,1/2) (m) − FBin(n,1/2) (n − m − 1).

It is 0 when 2m < n, and 1 when m ≥ n. For ⌈n/2⌉ ≤ m < n it lies strictly between 0 and 1. (b) The
smallest m giving probability at least 0.95 is:

                                    n     m P (both trays suffice)
                                    10     8      0.978516
                                   100    60      0.964800
                                   1000  531      0.953709
                                  10000 5098      0.951167

For each row, reducing m by one gives a probability below 0.95, so these are the smallest acceptable
capacities.




                                                    12
```
