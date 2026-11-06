# Chapter 7: Joint Distributions — Detailed Solutions

**Book:** Introduction to Probability, Second Edition  
**Authors:** Joseph K. Blitzstein and Jessica Hwang

> Source transcription from the supplied chapter-solution PDF. The solution numbering and worked reasoning are retained. Mathematical notation should be checked against the original source if a character appears ambiguous.

```text
INTRODUCTION TO PROBABILITY


                                Detailed Solutions
                            Chapter 7 – Joint Distributions


                          Complete worked solutions to Exercises 1–89




Scope. This volume follows Section 7.8 of the supplied chapter and retains its exercise numbering and notation.
Joint densities are zero outside their stated supports. Unless a question says otherwise, draws and random
variables described as independent are treated as independent. The chapter’s Geometric distribution counts
failures before the first success (support 0, 1, 2, . . .).


Introduction to Probability                          Chapter 7: Joint Distributions


Contents
Joint, marginal, and conditional distributions                                   2

2D LOTUS                                                                         8

Covariance                                                                       9

Chicken-egg and multinomial                                                     13

Multivariate Normal                                                             16

Mixed practice                                                                  17




                                                 1


Introduction to Probability                                                               Chapter 7: Joint Distributions


Joint, marginal, and conditional distributions
Exercise 1
Let the two arrival times (in minutes after noon) be independent U, V ∼ Unif(0, 60). They meet exactly when
|U − V | ≤ 15. The complement consists of two right triangles in the 60 × 60 square, each with leg 45. Thus

                                                    2(452 /2)    9                       7
                               P(|U − V | > 15) =        2
                                                              =    ,        P(meet) =      .
                                                      60        16                      16

Exercise 2
(a) By exchangeability of three independent continuous arrival times, each person is equally likely to arrive first, so
the probability is 1/3 .
For (b)–(d), condition on Carl arriving first at 1:10. Alice’s and Bob’s arrival times are then independent
Uniform(10, 30) variables (minutes after 1 pm).
(b) Carl waits alone for more than 10 minutes exactly when both other arrivals exceed 20: (10/20)2 = 1/4.

(c) The party is still incomplete after 10 minutes if at least one of Alice or Bob arrives after 20: 1 − (10/20)2 = 3/4.
(d) The second arrival must wait for the third by the gap |U − V |. For two independent Uniform(0, 20) times,

                                                                 2(152 /2)   7
                                          P(|U − V | > 5) =                =    .
                                                                   202       16

Exercise 3
Let H = 1 mean Hibbert and H = 0 mean Nick, so P(H = 1) = p. Conditional on H = 1, X ∼ Bin(n, a);
conditional on H = 0, X ∼ Bin(n, b).
                                                     (
                                                         p nk ak (1 − a)n−k ,
                                                             
                                                                                    h = 1,
                                P(H = h, X = k) =
                                                         (1 − p) nk bk (1 − b)n−k , h = 0,
                                                                    


for k = 0, . . . , n. Marginalizing over H gives
                                           
                                           n
                               P(X = k) =     {pak (1 − a)n−k + (1 − p)bk (1 − b)n−k }.
                                           k

Bayes’ rule gives
                                                                pak (1 − a)n−k
                              P(H = 1 | X = k) =                                          ;
                                                    pak (1 − a)n−k + (1 − p)bk (1 − b)n−k
the probability for H = 0 is one minus this.


Exercise 4
The four equally likely outcomes are HH, HT, TH, TT. The pairs (X, Y ) are respectively (2, 1), (1, 0), (1, 0), (0, 1).
Thus                                             
                                                 1/4, (x, y) ∈ {(0, 1), (2, 1)},
                                                 
                               P(X = x, Y = y) = 1/2, (x, y) = (1, 0),
                                                 
                                                  0,    otherwise.
                                                 

The marginals are P (X = 0, 1, 2) = (1/4, 1/2, 1/4) and Y ∼ Bern(1/2). They are not independent because
P (Y = 1 | X = 1) = 0 ̸= 1/2. Given X = 0 or 2, Y = 1 with probability one; given X = 1, Y = 0 with probability
one. Given Y = 0, X = 1 surely; given Y = 1, X is equally likely to be 0 or 2.




                                                             2


Introduction to Probability                                                                           Chapter 7: Joint Distributions


Exercise 5
Write X for the die result and Y for the number of Heads. For x = 1, . . . , 6 and y = 0, . . . , x,
                                                              
                                                            1 x y
                                            pX,Y (x, y) =       p (1 − p)x−y .
                                                            6 y

They are not independent: the conditional support of Y depends on X. The marginals are

                                                               6             
                                                      1        X             x y
                   P (X = x) = 1/6,       P (Y = y) =                           p (1 − p)x−y ,         y = 0, . . . , 6,
                                                      6                      y
                                                            x=max(1,y)


where the sum for y = 0 starts at x = 1. Conditional on X = x, Y ∼ Bin(x, p). The source repeats the phrase “of
Y given X = x” in part (c); interpreting the second requested conditional law as X given Y = y,
                                                               x y
                                                                          x−y
                                                               y p (1 − p)
                                    P (X = x | Y   = y) = P6          r y
                                                                       
                                                                                 r−y
                                                           r=max(1,y) y p (1 − p)


for x = max(1, y), . . . , 6.


Exercise 6
The committee has k people, so X + Y = k. All k-subsets of the n + m people are equally likely. The joint PMF is
                                                                  n m
                                                                       
                                                                  x   y
                                        P (X = x, Y = y) =        n+m ,
                                                                                x + y = k,
                                                                    k

with max(0, k − m) ≤   ≤ min(n,
                     xn+m       k) and y = k − x. Otherwise the probability is zero. Summing over y gives
P (X = x) = nx k−xm
                           
                     / k , the hypergeometric PMF. Equivalently, this follows by choosing the x women and
k − x men directly. Given X = x, the number of men is determined: Y = k − x with probability one.


Exercise 7
The first breakpoint X is Uniform(0, L), and conditional on X = x, Y is Uniform(0, x). Hence, for 0 < y < x < L,

                                                                       11
                                                     fX,Y (x, y) =        .
                                                                       Lx
                                    Rx
Integrating out y gives fX (x) = 0 (Lx)−1 dy = 1/L, as required. Dividing the joint density by fX (x) gives
fY |X (y | x) = 1/x on 0 < y < x. Integrating out x instead,
                                                    Z L
                                                1         dx  1   L
                                       fY (y) =              = log ,             0 < y < L.
                                                L    y     x  L   y

Consequently
                                                               1
                                         fX|Y (x | y) =              ,       y < x < L.
                                                          x log(L/y)


Exercise 8
(a) With replacement, each draw is a Queen, King, or other card with probabilities 1/13, 1/13, 11/13. Thus, for
x + y + z = 5,
                                                              x+y  z
                                                         5!     1        11
                             P (X = x, Y = y, Z = z) =                         .
                                                       x!y!z! 13         13
(b) Put z = 5 − x − y to obtain
                                                                                    x+y         5−x−y
                                                            5!                   1            11
                                P (X = x, Y = y) =
                                                     x!y!(5 − x − y)!           13            13


                                                              3


Introduction to Probability                                                                                  Chapter 7: Joint Distributions


for x, y ≥ 0, x + y ≤ 5. (c) Without replacement, the counts follow a multivariate hypergeometric law:

                                                                         4
                                                                              4 44
                                                                         x     y    z
                                   P (X = x, Y = y, Z = z) =                   52
                                                                                       ,    x + y + z = 5.
                                                                                5



Exercise 9
For independent failures-before-success Geom(p) variables, P (X = x, Y = y) = p2 q x+y for x, y ≥ 0. Since
N =X +Y,
                                 P (X = x, Y = y, N = n) = p2 q n 1{x + y = n}.

Summing over y = n − x gives P (X = x, N = n) = p2 q n for 0 ≤ x ≤ n. Since P (N = n) = (n + 1)p2 q n ,

                                                                     1
                                          P (X = x | N = n) =           ,           x = 0, 1, . . . , n.
                                                                    n+1

Conditionally on the total number of failures, the failures are split uniformly between the two waiting periods.


Exercise 10
(a) Given X = x, T = x + Y , so                                (
                                                                   0,                       t ≤ x,
                                             FT |X (t | x) =
                                                                   1 − e−λ(t−x) ,           t > x.

(b) Differentiation gives fT |X (t | x) = λe−λ(t−x) for t > x and zero otherwise; it integrates to one. (c) The
joint density is λ2 e−λt on 0 < x < t. For fixed t, it is constant in x, so normalization over (0, t) gives
 fX|T (x | t) = 1/t, 0 < x < t , a valid Uniform(0, t) density. (d) Bayes’ rule gives

                                      fT |X (t | x)fX (x)   λe−λ(t−x) λe−λx
                           fT (t) =                       =                 = λ2 te−λt ,                      t > 0.
                                          fX|T (x | t)            1/t

Exercise 11
(a) The conditional independence and conditional Normal laws give

                                            fX,Y,Z (x, y, z) = φ(x)φ(y − x)φ(z − x).

(b) Sharing the random location parameter X induces dependence. In fact, Cov(Y, Z) = Cov(E[Y | X], E[Z | X]) =
Var(X) = 1, so they are not independent. (c) Integrating out X gives the bivariate Normal density
                                                                  2
                                                                    y − yz + z 2
                                                                                 
                                                            1
                                            fY,Z (y, z) =   √ exp −                .
                                                          2π 3          3
                                   
                               2   1
Its covariance matrix is              .
                               1   2

Exercise 12
(a) For x ≥ c,
                                                               F (x) − F (c)
                                      P (X ≤ x | X > c) =                    = 1 − e−λ(x−c) .
                                                                 1 − F (c)
The conditional CDF is zero for x ≤ c, and the conditional PDF is λe−λ(x−c) for x > c. Thus X | X > c has the
distribution of c + X ′ with X ′ ∼ Expo(λ). (b) For 0 ≤ x < c,

                                                     1 − e−λx                                         λe−λx
                                   F (x | X < c) =            ,              f (x | X < c) =                  .
                                                     1 − e−λc                                        1 − e−λc

The conditional CDF is zero for x < 0 and one for x ≥ c; the PDF is zero off (0, c).


                                                                     4


Introduction to Probability                                                                       Chapter 7: Joint Distributions


Exercise 13
(a) Using P (X < Y ) = 1/2,

                                           fX (x)P (Y > x)   λe−λx e−λx
                         fX|X<Y (x) =                      =            = 2λe−2λx ,               x > 0.
                                             P (X < Y )         1/2

(b) On the event X < Y , X = min(X, Y ). The minimum of two independent Expo(λ) variables is Expo(2λ), so
this is also the conditional distribution.


Exercise 14
(a) With two independent Uniform breakpoints, the three piece lengths can form a triangle exactly when all three
are below 1/2. In the unit square of breakpoint locations, the valid region is the central triangle of area 1/4
(equivalently, each of the two possible orders gives a triangle of area 1/8). Thus P (triangle) = 1/4 . (b) Three legs
support the table iff their three points are not contained in any semicircle. For three independent uniform points
on a circle, the probability that all lie in some semicircle is 3/4; hence the probability of standing is 1/4 .


Exercise 15
The event {a1 ≤ X ≤ a2 , b1 ≤ Y ≤ b2 } is obtained by inclusion–exclusion from the four lower-left rectangles. For
continuous variables, endpoint choices do not matter:

                                    F (a2 , b2 ) − F (a1 , b2 ) + F (a1 , b1 ) − F (a2 , b1 ).


Exercise 16
    R1R1
(a) 0 0 (x + y) dy dx = 1, and the function is nonnegative, so it is a valid joint PDF. (b) It is not independent:
                                                                         R1
the joint density x + y is not the product of its marginals. (c) fX (x) = 0 (x + y)dy = x + 1/2 and fY (y) = y + 1/2,
for 0 < x, y < 1. (d)
                                                          x+y
                                         fY |X (y | x) =         , 0 < y < 1.
                                                         x + 1/2


Exercise 17
                               R1Ry
(a) Normalization gives 1 = c 0 0 xy dx dy = c/8, so c = 8 . (b) The support is triangular, not a Cartesian
product, so the variables cannot be independent. (c)
                                    Z 1                                             Z y
                         fX (x) =         8xy dy = 4x(1 − x2 ),         fY (y) =          8xy dx = 4y 3 .
                                     x                                                0


(d) fY |X (y | x) = 2y/(1 − x2 ), x < y < 1.


Exercise 18
The triangle {x > 0, y > 0, x + y < 1} has area 1/2, so its uniform density is fX,Y (x, y) = 2 on the triangle.
Marginalizing gives fX (x) = 2(1 − x) for 0 < x < 1. By symmetry the same holds for Y . For fixed y,

                                                            1
                                          fX|Y (x | y) =       ,      0 < x < 1 − y.
                                                           1−y


Exercise 19
                                                                                                                p
                                                         2      2   2
    p unit ball has volume 4π/3, so fX,Y,Z = 3/(4π) on x + y + z ≤ 1. (b) Integrate over −
(a) The                                                                                                             1 − x2 − y 2 <
         2
z < 1−x −y :   2

                                              3 p
                               fX,Y (x, y) =      1 − x2 − y 2 , x2 + y 2 < 1.
                                             2π



                                                                5


Introduction to Probability                                                                            Chapter 7: Joint Distributions


(c) One acceptable expression is

                                                   Z √1−x2 p
                                              3
                                    fX (x) =           √           1 − x2 − y 2 dy,      |x| < 1.
                                             2π       − 1−x2


(The integral simplifies to 3(1 − x2 )/4.)


Exercise 20
For 0 ≤ m ≤ 1, FM (m) = P (U1 , U2 , U3 ≤ m) = m3 , so fM (m) = 3m2 . For 0 ≤ l ≤ m ≤ 1, P (L ≥ l, M ≤ m) =
(m − l)3 , since all three uniforms must lie in [l, m]. Therefore

                             FL,M (l, m) = P (M ≤ m) − P (L > l, M ≤ m) = m3 − (m − l)3 .

Differentiating gives the joint density fL,M (l, m) = 6(m − l) for 0 < l < m < 1. Also fL (l) = 3(1 − l)2 , so

                                                                2(m − l)
                                          fM |L (m | l) =                ,   l < m < 1.
                                                                (1 − l)2


Exercise 21
Real roots occur iff B 2 − 4A ≥ 0. Since A, B are independent Uniform(0, 1),
                                                   Z 1                          Z 1
                                      2                             2                 b2       1
                                 P (B ≥ 4A) =              P (A ≤ b /4) db =             db =    .
                                                      0                          0    4       12

Exercise 22
(a) Given X = x, the conditional density of Y is supported on y > x (and y > 0). (b) If X, Y were independent
and both had full positive support, their joint density would be positive on the Cartesian product (0, ∞)2 . But the
given joint density is zero whenever 0 < y ≤ x. This contradiction proves dependence.


Exercise 23
The probability is the ratio of the unit-ball volume to the cube volume:

                                                                        vn      π n/2
                                      P ((U1 , . . . , Un ) ∈ B) =       n
                                                                           = n           .
                                                                        2   2 Γ(n/2 + 1)

For n = 1, . . . , 10, the values are approximately

     1.000000, 0.785398, 0.523599, 0.308425, 0.164493, 0.080746, 0.036912, 0.015854, 0.006442, 0.002490.
                                                                     √
For part (c), P (|Uj | > c) = 1 − c, so Xn ∼ Bin(n, 1 − c). If c = 1/ 2, a point in the unit ball can have at most one
coordinate with absolute value greater than c; two such coordinates would already contribute more than one to the
squared norm. Hence
                               P (in unit ball) ≤ P (Xn ≤ 1) = cn + n(1 − c)cn−1 −→ 0.


Exercise 24
For r > 0, conditioning on Y2 = y gives
                                                  Z ∞
                                                                                            λ1 r
                                  FY1 /Y2 (r) =           (1 − e−λ1 ry )λ2 e−λ2 y dy =             .
                                                  0                                      λ2 + λ1 r
Thus
                                                                  λ1 λ2
                                             fY1 /Y2 (r) =                  ,   r > 0.
                                                               (λ2 + λ1 r)2
                      R∞
Also P (Y1 < Y2 ) =   0
                           P (Y1 < y)fY2 (y)dy = λ1 /(λ1 + λ2 ) .


                                                                   6


Introduction to Probability                                                                     Chapter 7: Joint Distributions


Exercise 25
Let T0 , T1 , T2 be independent crash/adverse-event waiting times with rates λ0 , λ1 , λ2 . Then Xj = min(T0 , Tj ), so

                                     X1 ∼ Expo(λ0 + λ1 ),          X2 ∼ Expo(λ0 + λ2 ).

For x1 , x2 ≥ 0,
                                 P (X1 > x1 , X2 > x2 ) = e−λ0 max(x1 ,x2 )−λ1 x1 −λ2 x2 .
By inclusion–exclusion, the joint CDF is

                              1 − e−(λ0 +λ1 )x1 − e−(λ0 +λ2 )x2 + e−λ0 max(x1 ,x2 )−λ1 x1 −λ2 x2 .


Exercise 26
Let U ∼ Unif(0, 10) be the waiting time to the next Blissville bus, and let E ∼ Expo(1/10) be the waiting time to
the next Blotchville bus. (a)
                                                                           Z 10
                                                                       1
                            P (E < U ) = E[1 − e−U/10 ] = 1 −                     e−u/10 du = e−1 .
                                                                      10    0

(b) The waiting time is W = min(U, E). Therefore
                                        
                                        0,
                                                               t < 0,
                                FW (t) = 1 − (1 − t/10)e−t/10 , 0 ≤ t ≤ 10,
                                        
                                          1,                    t ≥ 10.
                                        


Exercise 27
For each couple, the probabilities of zero, one, or two long-lived hobbits are (1 − p)2 , 2p(1 − p), and p2 . Thus
(N0 , N1 , N2 ) is multinomial with these cell probabilities. Given N0 + N1 + N2 = n and N1 + 2N2 = h, put N2 = k,
N1 = h − 2k, and N0 = n − h + k. The conditional PMF is proportional to
                                                        n!
                                                                      2h−2k ,
                                              (n − h + k)!(h − 2k)!k!

for max(0, h − n) ≤ k ≤ ⌊h/2⌋. Directly, choose h of the 2n individual hobbits uniformly to be the survivors, which
gives
                                                           n
                                                              n−k  h−2k
                                                           k h−2k 2
                                        P (N2 = k | h) =         2n
                                                                         .
                                                                           h

The prior parameter p disappears because, conditional on exactly h survivors, every h-subset is equally likely.
Finally, with Ij indicating that both members of couple j survive,

                                                          h(h − 1)    h(h − 1)
                                        E(N2 | h) = n               =           .
                                                         2n(2n − 1)   2(2n − 1)


Exercise 28
                                                                                      X
Let p(x) = P (Xi = x). For i ̸= j, independence gives P (Xi = Xj ) =                       p(x)2 . Since I is independent and
                                                                                       x
uniform,
                                                          1
                                                P (I = i, XI = x) =
                                                            p(x),
                                                          n
so I and XI are independent and XI has the same marginal PMF p. For independent uniform labels I, J,
                                                              
                                                      1      1 X
                                        P (XI = XJ ) = + 1 −       p(x)2 .
                                                      n      n   x


This is at least P (Xi = Xj ) for fixed distinct stores, since the random labels can coincide.


                                                               7


Introduction to Probability                                                                         Chapter 7: Joint Distributions


Exercise 29
For 0 ≤ l < m, P (L = l, M = m) = 2p2 q l+m , while P (L = M = l) = p2 q 2l . This joint PMF shows dependence
because M ≥ L. The minimum has

                                        P (L = l) = q 2l (1 − q 2 ) = p(2 − p)q 2l ,

which is Geom(p(2 − p)). Since L + M = X + Y ,

                                                                             q(3 − p)
                                             EM = 2q/p − EL =                         .
                                                                             p(2 − p)

Let D = M − L. For d = 0, P (L = l, D = 0) = p2 q 2l ; for d ≥ 1 it is 2p2 q 2l+d . Dividing by the marginal of L gives
a conditional distribution of D that does not depend on l:

                                                   p                               2pq d
                                 P (D = 0) =          ,              P (D = d) =         , d ≥ 1.
                                                  2−p                              2−p
Thus L and M − L are independent.


Exercise 30
Differentiating the joint CDF twice gives, on x, y > 0,

                                  fX,Y (x, y) = e−(x+y+θxy) (1 + θx)(1 + θy) − θ .
                                                                               


When θ = 0 this factors into e−x e−y , so X, Y are independent. For θ > 0 the joint CDF does not factor.
Nonnegativity near the origin requires 1 − θ ≥ 0; the CDF’s tail behavior rules out θ < 0, explaining the stated
parameter range. The marginal CDFs follow by taking the other coordinate to infinity: FX (x) = 1 − e−x and
FY (y) = 1 − e−y . Thus both marginals are Expo(1). Directly integrating the joint PDF gives, for example,
                                      Z ∞
                         fX (x) = e−x     e−(1+θx)y {1 − θ + θx + θ(1 + θx)y} dy = e−x ,
                                         0
     R∞                  R∞
using 0 e−ay dy = 1/a and 0 ye−ay dy = 1/a2 . The calculation for fY is symmetric.


2D LOTUS
Exercise 31
For independent Uniform(0, 1) variables, D = |X − Y |. Direct integration over the unit square gives E(D) = 1/3
and E(D2 ) = 1/6. Hence
                                           1 1        1                   1
                                 Var(D) = − =           ,     SD(D) = √ .
                                           6 9       18                 3 2


Exercise 32
(a) By symmetry and 2D LOTUS,
                                                  Z ∞Z y
                              E|X − Y | = 2                       (y − x)λ2 e−λ(x+y) dx dy = 1/λ .
                                                  0           0

(b) The minimum of two independent Expo(λ) times is Expo(2λ), and by memorylessness the excess of the larger
over the smaller is an independent Expo(λ) variable. Thus |X − Y | ∼ Expo(λ) and its mean is 1/λ.


Exercise 33
Let T1 ∼ Expo(λ1 ) and T2 ∼ Expo(λ2 ) be the independent residual service times. Alice waits T = min(T1 , T2 ). (a)
In terms of double integrals,           Z Z       ∞       ∞
                                  E(T ) =                     min(x, y)λ1 λ2 e−λ1 x−λ2 y dx dy,
                                              0       0


                                                                      8


Introduction to Probability                                                                            Chapter 7: Joint Distributions

                                           Z ∞Z ∞
                               Var(T ) =                min(x, y)2 λ1 λ2 e−λ1 x−λ2 y dx dy − [E(T )]2 .
                                           0    0
(b) Since P (T > t) = P (T1 > t)P (T2 > t) = e−(λ1 +λ2 )t ,

                                                                         1                          1
                              T ∼ Expo(λ1 + λ2 ),           E(T ) =           ,     Var(T ) =               .
                                                                      λ1 + λ2                   (λ1 + λ2 )2


Exercise 34
The uniform density on x > 0, y > 0, x + y < 1 is 2. Symmetry and integration give EX = EY = 1/3, while
                                                   Z 1 Z 1−x
                                                                        1
                                      E(XY ) = 2             xy dy dx =    .
                                                    0   0               12
Therefore
                                                                       1  1   1
                                                Cov(X, Y ) =             − =− .
                                                                      12 9   36

Exercise 35
(a) The joint density on the unit disk is 1/π. In polar coordinates,

                                                 1 2π 1
                                                   Z    Z
                                                                         2
                                        E(R) =             r · r dr dθ =   .
                                                 π 0     0               3
(b) Area ratios show P (R2 ≤ u) = u for 0 ≤ u ≤ 1, so R2 ∼ Unif(0, 1). Consequently FR (r)√
                                                                                          = r2 and fR (r) = 2r for
                                              R1 2                                               R1√
0 < r < 1. The expectation from the density is 0 2r dr = 2/3. By 1D LOTUS, E(R) = E( R2 ) = 0 u du = 2/3
as well.


Exercise 36
(a) For discrete X, Y ,
                          XX                     X X               X X
         E(X + Y ) =        (x + y)pX,Y (x, y) =  x  pX,Y (x, y) +  y  pX,Y (x, y) = EX + EY.
                          x     y                                x    y                   y     x

This derives linearity directly from 2D LOTUS. (b) If independent, pX,Y (x, y) = pX (x)pY (y), so
                                            XX
                                   E(XY ) =      xypX (x)pY (y) = E(X)E(Y ).
                                                        x    y

Thus independent variables are uncorrelated when the relevant moments exist.


Exercise 37
(a) Independence gives                                      Z ∞Z ∞
                                                    2
                                     E[(X − Y ) ] =                       (x − y)2 f (x)f (y) dx dy.
                                                             −∞      −∞

(b) Expanding and factoring the integrals yields E(X 2 ) + E(Y 2 ) − 2E(X)E(Y ) = 2E(X 2 ) − 2µ2 = 2σ 2 . (c)
Write X − Y = (X − µ) − (Y − µ). The cross term has expectation zero by independence and centering, so the two
squared terms each contribute σ 2 .


Covariance
Exercise 38
The identity max(X, Y ) + min(X, Y ) = X + Y is always correct. The covariance claim is not. For example, take
independent Bernoulli(1/2) variables. Then Cov(X, Y ) = 0, but
                  E[max(X, Y )] = 3/4,         E[min(X, Y )] = 1/4,              E[max(X, Y ) min(X, Y )] = 1/4,
so Cov(max(X, Y ), min(X, Y )) = 1/4 − 3/16 = 1/16 ̸= 0. Covariance is symmetric in its arguments, but swapping
the random variables in a random, data-dependent way is not the same as merely interchanging the two arguments.


                                                                      9


Introduction to Probability                                                          Chapter 7: Joint Distributions


Exercise 39
For independent identically distributed dice,

                                  Cov(X + Y, X − Y ) = Var(X) − Var(Y ) = 0.

They are not independent: X + Y = 2 forces X − Y = 0, whereas conditioning on other sums permits other
differences. For example, P (X − Y = 0 | X + Y = 2) = 1 but P (X − Y = 0) = 1/6.


Exercise 40
The same covariance identity gives Cov(X + Y, X − Y ) = Var(X) − Var(Y ) = 0. They are not independent: their
joint support is constrained by |X − Y | ≤ min(X + Y, 2 − X − Y ), so the allowable values of the difference depend
on the sum.


Exercise 41
Set
                                          X +Y                     X −Y
                                        Z=√        ,            W =√        .
                                            2 + 2ρ                   2 − 2ρ

Both have mean zero and variance
                             √ one. Also Cov(X √ + Y, X − Y ) = Var(X)
                                                                √      − Var(Y ) = 0, so Z, W are uncorrelated.
Thus one choice is a = b = 1/ 2 + 2ρ and c = 1/ 2 − 2ρ, d = −1/ 2 − 2ρ.


Exercise 42
Let Id indicate that day d occurs as a birthday among the 110 people. Put q = (364/365)110 and r = (363/365)110 .
                                                                                            P365
Then P (Id = 1) = 1 − q, and for distinct days d, e, P (Id = Ie = 1) = 1 − 2q + r. Since X = d=1 Id ,

                                                 EX = 365(1 − q),

                                    Var(X) = 365q(1 − q) + 365 · 364 (r − q 2 ).


Exercise 43
(a) Let X ∼ Bern(p) and Y ∼ Bern(q). If they are uncorrelated, then E(XY ) = pq, so P (X = 1, Y = 1) = pq. The
other three cell probabilities are then p(1−q), (1−p)q, (1−p)(1−q), which factor into the marginals. Hence X, Y are
independent. (b) Let X, Y be independent fair bits and let Z = X ⊕ Y (exclusive OR). Each pair among (X, Y, Z)
is independent and hence uncorrelated, but Z is completely determined by (X, Y ), so the triple is dependent.


Exercise 44
Split the coupon collector time into independent waiting times Tk for the next new type when k types remain.
Then Tk ∼ Geom(k/n) on 1, 2, . . ., so

                                                        1 − k/n   n(n − k)
                                           Var(Tk ) =         2
                                                                =          .
                                                        (k/n)        k2

Independence of the waiting stages gives

                                                n
                                                X n(n − k)
                                    Var(T ) =                   = n2 Hn(2) − nHn .
                                                         k2
                                                k=1



Exercise 45
Let the three angles be A, B, C. They are exchangeable with equal pairwise covariance, and A + B + C = π is
constant. Therefore 0 = Var(A + B + C) = 3 Var(A) + 6 Cov(A, B), so

                                                               1
                                                 Corr(A, B) = − .
                                                               2

                                                           10


Introduction to Probability                                                                       Chapter 7: Joint Distributions


Exercise 46
Let Ij indicate that person j draws their own name. Then P (Ij = 1) = 1/n. For i ̸= j, P (Ii = Ij = 1) = 1/[n(n−1)].
Hence                                 
                                                                                 
                                X            1      1                   1         1
                          Var      Ij  = n    1−      + n(n − 1)           − 2 = 1.
                                 j
                                             n      n                n(n − 1) n

The standard deviation is 1 .


Exercise 47
            Pb
Write X =     j=1 Ij as in the question. Among black ball j and the w white balls, the relative order is uniform, so

                                                                      r
                                                     E(Ij ) =            .
                                                                     w+1
For two black balls and the w whites, both black balls must be among the first r positions in their relative ordering.
Thus
                                                     r
                                                       
                                                     2         r(r + 1)
                                       E(Ii Ij ) = w+2 =                 .
                                                     2
                                                           (w + 1)(w + 2)
The indicators are positively correlated: learning that one black ball precedes the rth white makes it more likely
that another does too. Specifically,
                                         r(w − r + 1)                                 r(w − r + 1)
                            Var(Ij ) =                ,         Cov(Ii , Ij ) =                      .
                                           (w + 1)2                                 (w + 1)2 (w + 2)
Therefore
                                                                                 rb(w + b + 1)(w − r + 1)
                     Var(X) = b Var(I1 ) + b(b − 1) Cov(I1 , I2 ) =                                       .
                                                                                     (w + 1)2 (w + 2)


Exercise 48
Let Ij indicate that jump j is a record. By exchangeability, P (Ij = 1) = 1/j. For i.i.d. continuous observations, the
record indicators are independent (the relative rank of observation j among the first j observations is independent
of the previous relative ranks). Hence
                                               
                                          n          n          
                                        X           X   1      1
                                   Var      Ij  =         1−     = Hn − Hn(2) .
                                         j=1        j=1
                                                        j      j


This diverges like log n + γ − π 2 /6 as n → ∞.


Exercise 49
Poisson thinning gives X ∼ Pois(λp), while E(X | N ) = pN . Thus

                                Cov(N, X) = Cov(N, E(X | N )) = p Var(N ) = pλ.

Since Var(N ) = λ and Var(X) = λp,
                                                                        √
                                                    Corr(N, X) =            p.


Exercise 50
Rescale so that Var(Xi ) = 1. Then
                                                     n
                                                                !
                                                     X
                                          0 ≤ Var          Xi       = n + n(n − 1)ρ.
                                                     i=1

Rearranging gives the lower bound
                                                                  1
                                                      ρ≥−            .
                                                                 n−1

                                                                11


Introduction to Probability                                                                       Chapter 7: Joint Distributions


Exercise 51
Independence gives E(X 2 Y 2 ) = E(X 2 )E(Y 2 ) and E(XY ) = EX EY . Thus

                          Var(XY ) = E(X 2 )E(Y 2 ) − (EX)2 (EY )2
                                      = [Var(X) + (EX)2 ][Var(Y ) + (EY )2 ] − (EX)2 (EY )2
                                      = Var(X) Var(Y ) + (EX)2 Var(Y ) + (EY )2 Var(X).


Exercise 52
Let Aj indicate that student j gets the right size. Each student receives a uniformly random one of 3n shirts, of
which n are correct for that student, so E(X) = 3n(1/3) = n . For two distinct students of the same size,
                                                                  1 n−1
                                                P (A1 , A2 ) =             ;
                                                                  3 3n − 1
for students of different sizes,
                                                           1 n
                                               P (A1 , An+1 ) =     .
                                                           3 3n − 1
The corresponding covariances are −2/[9(3n − 1)] and 1/[9(3n − 1)]. Summing the 3n individual variances and all
ordered pair covariances gives
                                                          2n2
                                              Var(X) =          .
                                                         3n − 1


Exercise 53
At each step the horizontal increment and vertical increment are mutually exclusive, so for n ≥ 1 the totals Xn , Yn
are not independent (at one step, for example, both cannot be nonzero). Each coordinate increment has mean zero
and variance 1/2, and the cross-product has expectation zero. Hence

                                   Cov(Xn , Yn ) = 0,      E(Rn2 ) = E(Xn2 + Yn2 ) = n.


Exercise 54
Let M = max(X, Y ) and m = min(X, Y ). Define S = X + Y and D = |X − Y |. Then M = (S + D)/2 and
m = (S − D)/2. For independent standard Normals, S is independent of D, Var(S) = 2, and X − Y ∼ N (0, 2), so
Var(D) = 2 − 4/π. Therefore
                                               1                      1
                                  Cov(M, m) = [Var(S) − Var(D)] = ,
                                               4                      π
                                                 1                         1
                            Var(M ) = Var(m) = [Var(S) + Var(D)] = 1 − .
                                                 4                         π
Thus
                                                           1
                                          Corr(M, m) =        .
                                                         π−1


Exercise 55
(a) Since |U | ∼ Unif(0, 1), V = 2|U | − 1 has density fV (v) = 1/2 for −1 < v < 1; hence V ∼ Unif(−1, 1). (b) By
symmetry, EU = 0 and E[U V ] = E[2U |U | − U ] = 0, so Cov(U, V ) = 0. They are not independent because V is a
deterministic function of U ; for instance, V ≥ 0 is equivalent to |U | ≥ 1/2.


Exercise 56
(a) With X = V + W and Y = V + Z, Cov(X, Y ) = Var(V ) = λ . (b) Since the covariance is nonzero for λ > 0,
X, Y are not independent. Conditional on V , they are independent because the remaining random parts W, Z are
independent. (c) For nonnegative integers x, y,

                                                                min(x,y)
                                                          −3λ
                                                                  X             λx+y−v
                                   P (X = x, Y = y) = e                                       .
                                                                  v=0
                                                                           v!(x − v)!(y − v)!


                                                            12


Introduction to Probability                                                                                         Chapter 7: Joint Distributions


Exercise 57
                                                                                                                         100
                                                                                                                             
Let Ij indicate whether ship j is hit, with ship sizes s1 = 4, s2 = 3, s3 = 2. Let D =                                    5 . Then

                                                                   100−sj
                                                                                                     3
                                                                                                      X
                                                                      5
                                  pj = P (Ij = 1) = 1 −                          ,      E(H) =               pj .
                                                                     D                                 j=1

For i ̸= j, disjoint ships give
                                                              100−si                 100−sj           100−si −sj
                                                                                                                   
                                                                 5                      5                 5
                              P (Ii = 1, Ij = 1) = 1 −                       −                    +                      .
                                                                   D                   D                 D
                 P                       P
Thus Var(H) =       j pj (1 − pj ) + 2    i<j [P (Ii = Ij = 1) − pi pj ]. Numerically,


                                         E(H) ≈ 0.430106,                Var(H) ≈ 0.343497.


Exercise 58
(a) If (X, Y ) is selected uniformly from the n observed pairs, then EX = x̄, EY = ȳ, and
                                                               n
                                                            1X
                                             Cov(X, Y ) =         (xi − x̄)(yi − ȳ) = r.
                                                            n i=1

(b) For independent draws from the empirical distribution,

                                         E[(X − X)(Y
                                                e    − Ye )] = 2 Cov(X, Y ) = 2r.

The expectation averages over the n2 ordered pairs of points. Each unordered pair contributes twice its signed
rectangle area; the n diagonal choices have zero area. If Asigned is the sum over unordered point-pairs, then this
expectation is 2Asigned /n2 . Thus Asigned = n2 r . (c) The four covariance properties follow from the signed-area
interpretation: reversing the two axes of a rectangle leaves its sign unchanged; scaling one axis scales signed area by
that factor; translation does not change side lengths; and the signed area for a sum of vertical coordinates is the
sum of the two corresponding signed areas.


Exercise 59
                                                                                                  b = w 2 v 1 + w 2 v2 ,
(a) For θb = w1 θb1 + w2 θb2 with w1 + w2 = 1, E θb = w1 θ + w2 θ = θ. (b) Independence makes Var(θ)   1         2
where vj = Var(θj ). Put w2 = 1 − w1 and differentiate, obtaining
                   b

                                                          v2                             v1
                                                w1 =           ,         w2 =                 .
                                                       v1 + v2                        v1 + v2

(c) If the two estimators are sample means based on n and m i.i.d. observations with common variance σ 2 , then
v1 = σ 2 /n, v2 = σ 2 /m. The weights become n/(n + m) and m/(n + m), giving the pooled sample mean.


Chicken-egg and multinomial
Exercise 60
Let each Poisson-arriving voter contribute +1 with probability p and −1 with probability q = 1 − p. For a compound
Poisson sum,
                           E(V ) = λ(p − q) = λ(2p − 1),       Var(V ) = λE[(±1)2 ] = λ.


Exercise 61
Poisson splitting gives X ∼ Pois(λp) and Y ∼ Pois(λq) independently, with N = X + Y . (a) For n = x + y,

                                                                                        λx+y x y
                                         P (N = n, X = x, Y = y) = e−λ                       p q .
                                                                                        x!y!


                                                                    13


Introduction to Probability                                                                   Chapter 7: Joint Distributions


The three variables are not jointly independent because N = X + Y , but X, Y are independent. (b) For n ≥ x,
                                                               n
                                                                  
                                                           −λ λ   n x n−x
                                      P (N = n, X = x) = e           p q  .
                                                              n! x

N and X are dependent. (c)
                                                                 (λp)x −λq (λq)y
                                      P (X = x, Y = y) = e−λp         e          ,
                                                                   x!        y!
so X, Y are independent.


Exercise 62
Poisson thinning splits the 100 expected arrivals into purchasers and non-purchasers. The probability an arriving
customer purchases is
                                            0.1(0.5) + 0.9(1/3) = 0.35.
Thus the purchaser count B ∼ Pois(35) and the non-purchaser count N ∼ Pois(65) are independent. Conditioning
on N = 42 does not change the distribution of B:

                                                                 35k
                                    P (B = k | N = 42) = e−35        ,    k = 0, 1, . . . .
                                                                  k!

Exercise 63
Each egg independently yields a surviving chick with probability ps, a hatched but non-surviving chick with
probability p(1 − s), and no hatch with probability 1 − p. Thus (X, Y, n − X − Y ) is multinomial and

                                                       n!
                          P (X = x, Y = y) =                     (ps)x [p(1 − s)]y (1 − p)n−x−y .
                                                x!y!(n − x − y)!

Marginally X ∼ Bin(n, ps). Since the two categories are mutually exclusive within each egg, X, Y are not
independent (unless a degenerate parameter case); their covariance is −np2 s(1 − s) .


Exercise 64
(a) The number of four-course selections when time conflicts are ignored is X4 . The Poisson fourth factorial
                                                                               
                
                X
moment gives E       = λ4 /4! . (b) Poisson thinning gives independent Xam , Xpm ∼ Pois(λ/2), so
                 4

                                                                         (λ/2)a+b
                                        P (Xam = a, Xpm = b) = e−λ                .
                                                                           a!b!
(c) Each time slot count is independently Pois(λ/4), and E(X1 X2 X3 X4 ) = (λ/4)4 . The ratio of the unrestricted
expected choices to nonconflicting choices is
                                                 λ4 /24    32
                                                       4
                                                         =    .
                                                 (λ/4)      3


Exercise 65
            Pn
Write Xi = r=1 Ir,i , where Ir,i indicates that trial r lands in category i. For i ̸= j, within one trial Ir,i Ir,j = 0, so
the covariance is −pi pj . Across trials the indicators are independent. Therefore

                                          Cov(Xi , Xj ) = n(−pi pj ) = −npi pj .




                                                            14


Introduction to Probability                                                                 Chapter 7: Joint Distributions


Exercise 66
The two birthday counts are multinomial category counts with n = 100 and category probabilities 1/365. Hence
                                                                   100
                                               Cov(X1 , X2 ) = −        .
                                                                   3652
Each variance is 100(1/365)(364/365), so
                                                                        1
                                               Corr(X1 , X2 ) = −          .
                                                                       364

Exercise 67
Let N = a + b + c + d. (a) With replacement, each draw is classified as freshman/sophomore, junior, or senior, with
probabilities (a + b)/N, c/N, d/N . For x + y + z = n,
                                                                    x    z
                                                         n!     a+b         c y d
                            P (X = x, Y = y, Z = z) =                                 .
                                                       x!y!z!    N         N     N
(b) Without replacement,
                                                           a+b
                                                                 c  d
                                                            x      y    z
                              P (X = x, Y = y, Z = z) =          N
                                                                           ,   x + y + z = n.
                                                                 n

The first law is multinomial; the second is multivariate hypergeometric.


Exercise 68
(a) The three counts have law Mult(n; 1/3, 1/3, 1/3):
                                                             n! −n
                              P (X = x, Y = y, Z = z) =           3 ,           x + y + z = n.
                                                           x!y!z!
(b) A decisive round has exactly one of the three counts equal to zero and the other two positive. For a specified
missing choice there are 2n − 2 sequences using both remaining choices. The three cases are disjoint, giving
                                                               3(2n − 2)
                                              P (decisive) =             .
                                                                  3n

(c) For n = 5, this is 90/243 = 10/27 . As n → ∞, it tends to zero, since with many independent choices all three
symbols are overwhelmingly likely to appear.


Exercise 69
Independent increments over intervals of lengths 3, 6, 6 give independent X ∼ Pois(3λ), Y ∼ Pois(6λ), and
Z ∼ Pois(6λ). (a) Their joint PMF is the product of these Poisson PMFs. (b) Conditional on the total 36, the
counts are multinomial:                                                    
                                                                      1 2 2
                              (X, Y, Z) | (X + Y + Z = 36) ∼ Mult 36; , ,     .
                                                                      5 5 5
(c) Therefore X + Y | total = 36 ∼ Bin(36, 3/5). (d) The conditional mean and variance are 36(3/5) = 21.6 and
 36(3/5)(2/5) = 8.64 .


Exercise 70
(a) Poisson thinning gives independent Y ∼ Pois(λp) and Z ∼ Pois(λ(1 − p)), with X = Y + Z ∼ Pois(λ). Thus
                                                  √
Cov(X, Y ) = Var(Y ) = λp and Corr(X, Y ) = p . (b) With n students, each is general track with probability
rp, quantitative finance with probability r(1 − p), and non-statistics with probability 1 − r. The three counts are
multinomial with these cell probabilities; the marginals are respectively Bin(n, rp), Bin(n, r(1−p)), and Bin(n, 1−r).
(c) Since X = Y + Z, Cov(X, Y ) = Var(Y ) + Cov(Z, Y ) = nrp(1 − rp) − nr2 p(1 − p) = nrp(1 − r). Hence
                                                              s
                                                                p(1 − r)
                                               Corr(X, Y ) =             .
                                                                 1 − rp


                                                          15


Introduction to Probability                                                                   Chapter 7: Joint Distributions


Exercise 71
(a) The genotype counts are multinomial with cell probabilities p2 , 2p(1 − p), (1 − p)2 . (b) A person has at least one
A allele with probability p2 + 2p(1 − p) = 2p − p2 , so the number is Bin(n, 2p − p2 ) . (c) Each of the 2n alleles is A
with probability p, independently, so the total number of A alleles is Bin(2n, p) . (d) The likelihood is proportional
to p2x1 +x2 (1 − p)x2 +2x3 . Maximizing gives pb = (2x1 + x2 )/(2n) . (e) If only the aa phenotype is observed, then
                                                                            p
X3 ∼ Bin(n, (1 − p)2 ). Its success-probability MLE is x3 /n, so pb = 1 − x3 /n .


Multivariate Normal
Exercise 72
A linear transformation of a bivariate Normal vector is bivariate Normal. Let U = X + Y , V = X − Y . Then
EU = EV = 0, Var(U ) = 2(1 + ρ), Var(V ) = 2(1 − ρ), and Cov(U, V ) = 0. Since −1 < ρ < 1, both variances are
positive, and joint Normality makes U, V independent. Their joint PDF is

                                                                             u2       v2
                                                                                           
                                                         1
                                fU,V (u, v) =        p            exp −           −           .
                                                4π       1 − ρ2           4(1 + ρ) 4(1 − ρ)


Exercise 73
(a) The density factors into two standard Normal kernels, so c = (2π)−1 . (b) Each marginal is N (0, 1) and the joint
density factors as φ(x)φ(y), so X, Y are independent. (c) Independent Normal coordinates form a (nondegenerate)
Bivariate Normal vector, so yes.


Exercise 74
                         2    2                                           p
(a) The integral of e−x /2−y /2 over the first and third quadrants is 2( π/2)2 = π, so c = 1/π . (b) Integrating
over y of the same sign as x gives fX (x) = φ(x); similarly Y ∼ N (0, 1). They are dependent because XY > 0 almost
surely. (c) This cannot be Bivariate Normal: a nondegenerate bivariate Normal density is positive throughout the
plane, whereas this density vanishes on both opposite-sign quadrants; a degenerate bivariate Normal is supported
on a line, which this is not.


Exercise 75
For s, t, u ∈ R, the exponent in the joint MGF is s(X + 2Y ) + t(3X + 4Z) + u(5Y + 6Z) = (s + 3t)X + (2s + 5u)Y +
(4t + 6u)Z. Independence and standard Normal MGFs give
                                                                                          
                                                      1          2           2           2
                              M (s, t, u) = exp         [(s + 3t) + (2s + 5u) + (4t + 6u) ] .
                                                      2


Exercise 76
(a) (X, Y, X + Y ) is a linear transformation of independent Normals, hence is multivariate Normal (though singular
because the third coordinate is the sum of the first two). (b) (X, Y, SX + SY ) is not multivariate Normal. Its
covariances with the third coordinate are zero, but the third coordinate is conditionally restricted to the two values
±(x + y) given X = x, Y = y, so it cannot be independent Normal as a joint Normal vector with diagonal covariance
would require. (c) (SX, SY ) has the same distribution as (X, Y ) because the independent common sign flip leaves
the centered isotropic bivariate Normal law unchanged. Thus it is bivariate Normal.


Exercise 77
For a bivariate Normal pair, zero covariance implies independence. Choose c to make

                                         0 = Cov(X, Y − cX) = ρσ1 σ2 − cσ12 .




                                                                  16


Introduction to Probability                                                                                         Chapter 7: Joint Distributions


Therefore
                                                                  σ2
                                                         c=ρ         ,
                                                                  σ1
and Y − cX is independent of X.


Exercise 78
(a) Among each child and the two parents, all three heights are i.i.d. continuous. Each is equally likely to be tallest,
so a given child is taller than both parents with probability 1/3? The event compares that child’s height with the
two parents only; hence probability 1/3. Summing across six children gives 2 children on average. (b) For each
child, Yj − X1 is Normal with mean zero and variance 2σ 2 (1 − ρ). Thus
                                                              "                                            !#
                                                                                                 1
                                 E#{j : Yj > X1 + 1} = 6 1 − Φ                       p                          .
                                                                                 σ    2(1 − ρ)


Mixed practice
Exercise 79
(a) Conditional on exactly one arrival in a Poisson process over [0, 3], its arrival time is Uniform(0, 3). Hence its
conditional CDF is 0 for t < 0, t/3 for 0 ≤ t ≤ 3, and 1 for t ≥ 3. (b) By Poisson thinning, the numbers of blue
and non-blue cars in 10 minutes are independent Poisson variables with means 10λb and 10λ(1 − b); their joint
PMF is the product of the two Poisson PMFs.


Exercise 80
(a) Each registered voter is a Democrat who turns out with probability ps, so Poisson thinning gives X ∼ Pois(λps) .
(b) Given V = v, each of the v people is a Democrat voter with probability ps, so X | V = v ∼ Bin(v, ps). (c)
Given d Democrats and r Republicans, each Democrat turns out independently with probability s, so X ∼ Bin(d, s).
(d) Given that exactly n of the v = d + r people turn out, the turnout set is a uniform n-subset. Thus
                                                                         d      r
                                                                                            
                                                                         x    n−x
                                            P (X = x | d, r, n) =            d+r
                                                                                                ,
                                                                              n

a hypergeometric distribution.


Exercise 81
(a) The count vector is multivariate hypergeometric:
                                                                   Q4     m
                                                                                     
                                                                     j=1 xj                          X
                                P (X1 = x1 , . . . , X4 = x4 ) =      4m
                                                                                        ,               xj = n.
                                                                       n                             j


(b) It is not multinomial: the sample is drawn without replacement from fixed category sizes, so category counts
are negatively dependent; a multinomial model corresponds to independent sampling with replacement. (c) For
distinct categories, the multivariate hypergeometric covariance is

                                                        m m 4m − n     n(4m − n)
                                 Cov(X1 , X3 ) = −n                 =−            .
                                                       4m 4m 4m − 1    16(4m − 1)


Exercise 82
Assuming X and Y are independent (as required for the conclusion), condition on Y :

                               P (Y < X) = E[P (X > Y | Y )] = E(e−λY ) = MY (−λ).

Thus the requested value is c = −λ . If independence is not intended, the result does not follow from the marginal
MGF alone.


                                                             17


Introduction to Probability                                                            Chapter 7: Joint Distributions


Exercise 83
(a) Conditional on assignment to Prue, the detected count is Bin(n, p); conditional on Frida, it is Bin(n, f ). The
unconditional PMF is                                           
                                               1 n k n−k 1 n k n−k
                                 P (K = k) =         p q     +        f g    .
                                               2 k             2 k
(b) Poisson thinning splits the Poisson typo count into independent caught and missed counts, C ∼ Pois(λp) and
M ∼ Pois(λq). Therefore conditioning on M = m leaves C | M = m ∼ Pois(λp) .


Exercise 84
Let A, X, Y be i.i.d. Expo(λ), and B = A + X, M = A + Y . (a) A sum of two independent exponentials has
 B ∼ Gamma(2, rate λ) . (b) Cov(A, B) = Cov(A, A + X) = Var(A) = 1/λ2 . (c) Since T = max(A, A + X, A +
Y ) = A + max(X, Y ), E(T ) = 1/λ + E max(X, Y ). For two independent exponentials, E max(X, Y ) = 3/(2λ), so
 E(T ) = 5/(2λ) .


Exercise 85
(a) The counts of A and C are multinomial category counts, so Cov(NA , NC ) = −npA pC . (b) Given the fixed
letter counts, all distinct permutations of the multiset are equally likely. The non-A letters occupy n − a positions
and create a + 1 gaps around the A’s. The gap vector is uniform over compositions of n − a into a + 1 parts.
The first A is immediately followed by another A exactly when the first internal gap is zero. The fraction of such
compositions is
                                                      n−1
                                                          
                                                      a−1      a
                                                       n
                                                          =     .
                                                       a
                                                               n
(c) There are n − 2 possible starting positions for CAT. At any specified position the probability is c/n · a/(n − 1) ·
                                                       cat
t/(n − 2). By linearity, E(# CAT occurrences) =               .
                                                     n(n − 1)


Exercise 86
Let T1 be the measurement from a diseased person and T0 from a non-diseased person, independently. Parametrize
the ROC curve by threshold t: x = 1 − H(t) and y = 1 − G(t). Since dx = −h(t)dt, its area is
                                 Z 1        Z b
                                     y dx =     [1 − G(t)]h(t)dt = P (T1 > T0 ).
                                     0          a

If g = h, the two distributions are identical and this probability is 1/2, giving area 1/2. If there is a threshold
with sensitivity and specificity both near one, then diseased measurements almost always exceed non-diseased
measurements, so the probability and area are near one.


Exercise 87
                        Pn                          P 2
(a) The familiar sums     j=1 j = n(n + 1)/2 and     j = n(n + 1)(2n + 1)/6 give

                                                n+1                   n2 − 1
                                         EJ =       ,      Var(J) =          .
                                                 2                      12

(b) These are close to a continuous Uniform law on an interval of length approximately n, withP
                                                                                              mean centered
at (n + 1)/2 and variance approximately n2 /12. (c) The largest observation has rank Rn = 1 + j<n Ij , where
P (Ij = 1) = 1/2. For distinct j, k, P (Ij = Ik = 1) = 1/3, so Cov(Ij , Ik ) = 1/12. Thus
                                                                      n+1
                                          E(Rn ) = 1 + (n − 1)/2 =        ,
                                                                       2
                                              n − 1 (n − 1)(n − 2)       n2 − 1
                                   Var(Rn ) =        +                =         .
                                                4            12            12
P Since Rn is Uniform on {1, . . .P
(d)                               , n} by symmetry, its expectation and second moment reproduce the two sums:
   j = nE(Rn ) = n(n + 1)/2 and      j 2 = nE(Rn2 ) = n(n + 1)(2n + 1)/6.


                                                          18


Introduction to Probability                                                         Chapter 7: Joint Distributions


Exercise 88
                                                                                     
                                                    −(k
                                                      2)
                                                                                     n −(k2)
(a) Each fixed k-set is a clique with probability 2    , so the expected number is       2     . (b) Let T count
                                                                                     k
triangles. Each triangle indicator has variance (1/8)(7/8) = 7/64. Two distinct triangles are independent unless
                                                                      −5
they
    share
         an edge. A pair sharing one edge has joint probability 2 = 1/32 and covariance 1/64. There are
 n n−2
 2    2   unordered pairs sharing an edge. Therefore
                                                               
                                                    7 n    1 n n−2
                                       Var(T ) =         +           .
                                                   64 3    32 2   2

                                                                       k
(c) Let Q count k-cliques plus k-anticliques. Then E(Q) = 2 nk 2−(2) . The assumed inequality makes this
                                                                    

expectation less than one, so Markov’s inequality gives P (Q ≥ 1) ≤ E(Q) < 1. Hence P (Q = 0) > 0, proving that
at least one graph has neither a k-clique nor a k-anticlique.


Exercise 89
(a) A particular word is rare relative to the large number of word positions. A Poisson approximation to its count
is therefore natural. Equal-length plays and the same word-specific usage rate motivate equal Poisson parameters;
the plays are modeled independently. (b) For independent X, Y ∼ Pois(λ),

                                                                         λ2   λ3
                                                                                      
                                                −λ      −λ     −λ
                          P (Y > 0, X = 0) = e (1 − e ) = e         λ−      +     − ··· .
                                                                         2!    3!

(c) Condition on λ, apply (b), and average over the prior density f0 . Since P (X = j) = E[e−λ λj /j!],

                          P (Y > 0, X = 0) = P (X = 1) − P (X = 2) + P (X = 3) − · · · .

(d) Sum the indicator of the event “word j appears in B but not A” over all words. Taking expectations and
applying (c) word by word gives

                    E(new distinct words in B) = E(W1 ) − E(W2 ) + E(W3 ) − E(W4 ) + · · · .




                                                           19
```
