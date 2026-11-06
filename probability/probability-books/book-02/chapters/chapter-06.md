# Chapter 6: Moments

**Book:** Introduction to Probability, Second Edition  
**Authors:** Joseph K. Blitzstein and Jessica Hwang  
**Printed pages:** 267–302

> Source transcription from the supplied textbook PDF. Text extraction preserves the original order and page content as far as the PDF text layer allows. Check mathematical notation and figure references against the source where extraction is ambiguous.

```text
Moments                                                                              281

The above theorem is a difficult result in analysis, so we will not prove it here.
Theorem 6.4.7 (MGF of a sum of independent r.v.s). If X and Y are independent,
then the MGF of X + Y is the product of the individual MGFs:

                              MX+Y (t) = MX (t)MY (t).

This is true because if X and Y are independent, then E(et(X+Y ) ) = E(etX )E(etY )
(this follows from results discussed in Chapter 7). Using this fact, we can get the
MGFs of the Binomial and Negative Binomial, which are sums of independent
Bernoullis and Geometrics, respectively.
Example 6.4.8 (Binomial MGF). The MGF of a Bern(p) r.v. is pet + q, so the
MGF of a Bin(n, p) r.v. is
                           M (t) = (pet + q)n .
                  4
                  3
                MGF
                  2
                  1
                  0




                      −1.0       −0.5        0.0        0.5         1.0
                                              t



FIGURE 6.7                         2
Bin(2, 1/2) MGF, M (t) = 12 et + 12 . The slope of the MGF at t = 0 is 1, so the
mean of the distribution is 1. The concavity or second derivative of the MGF at
t = 0 is 3/2, so the second moment of the distribution is 3/2.

                                                                             2
Figure 6.7 plots the MGF of the Bin(2, 1/2) distribution, M (t) = 12 et + 12 , be-
tween t = −1 and t = 1. As with all MGFs, the value of the MGF is 1 at t = 0. The
first and second moments of the distribution are the first and second derivatives of
the MGF, evaluated at t = 0; these correspond to the slope and concavity of the
plotted curve at t = 0. These two derivatives are 1 and 3/2, corresponding to the
fact that the Bin(2, 1/2) distribution has mean 1 and variance 3/2 − 12 = 1/2. 
Example 6.4.9 (Negative Binomial MGF). We know the MGF of a Geom(p) r.v. is
  p         t
1−qet for qe < 1, so the MGF of X ∼ NBin(r, p) is
                                          r
                                      p
                         M (t) =              , for qet < 1.             
                                   1 − qet


282                                                           Introduction to Probability

h 6.4.10. Not all r.v.s have an MGF. Some r.v.s X don’t even have E(X) exist,
or don’t have E(X n ) exist for some n > 1, in which case the MGF clearly will not
exist. But even if all the moments of X exist, the MGF may not exist if the moments
grow too quickly. Luckily, there is a way to
                                           √ fix this: inserting an imaginary number!
The function ψ(t) = E(eitX ) with i = −1 is called the characteristic function
by statisticians and the Fourier transform by everyone else. It turns out that the
characteristic function always exists. In this book we will focus on the MGF rather
than the characteristic function, to avoid having to handle imaginary numbers.
As we saw in the previous chapter, location and scale transformations are a fun-
damental way to build a family of distributions from an initial distribution. For
example, starting with Z ∼ N (0, 1), we can scale by σ and shift by µ to obtain
X = µ + σZ ∼ N (µ, σ 2 ). In general, if we have an r.v. X with mean µ and stan-
dard deviation σ > 0, we can create the standardized version (X − µ)/σ, and vice
versa. Conveniently, it is easy to relate the MGFs of two r.v.s connected by such a
transformation.
Proposition 6.4.11 (MGF of location-scale transformation). If X has MGF M (t),
then the MGF of a + bX is

                       E(et(a+bX) ) = eat E(ebtX ) = eat M (bt).


For example, let’s use this proposition to help obtain the MGFs of the Normal and
Exponential distributions.
Example 6.4.12 (Normal MGF). The MGF of a standard Normal r.v. Z is
                                  Z ∞
                                           1   2
                             tZ
                 MZ (t) = E(e ) =     etz √ e−z /2 dz.
                                   −∞      2π

After completing the square, we have
                                   Z ∞
                             t2 /2      1       2          2
                   MZ (t) = e          √ e−(z−t) /2 dz = et /2 ,
                                    −∞  2π

since the N (t, 1) PDF integrates to 1. Thus, the MGF of X = µ + σZ ∼ N (µ, σ 2 )
is
                                                    2          1 2 2
                    MX (t) = eµt MZ (σt) = eµt e(σt) /2 = eµt+ 2 σ t .        
Example 6.4.13 (Exponential MGF). The MGF of X ∼ Expo(1) is
                      Z ∞              Z ∞
                                                          1
    M (t) = E(etX ) =     etx e−x dx =     e−x(1−t) dx =     for t < 1.
                       0                0                1−t

So the MGF of Y = X/λ ∼ Expo(λ) is
                               
                                t     λ
                  MY (t) = MX      =                   for t < λ.                     
                                λ    λ−t


Moments                                                                           283




6.5   Generating moments with MGFs

We now give some examples of using an MGF to find moments. . Theorem 6.4.5
shows that we can get moments by differentiating the MGF and evaluating at 0,
rather than doing a complicated sum or integral by LOTUS. Better yet, in some
cases we can simultaneously find all the moments of a distribution via a Taylor
expansion, rather than differentiating over and over again.
Example 6.5.1 (Exponential moments). In this example we will show how to
use the Exponential MGF to get all the moments of the Exponential distribution
simultaneously! Let X ∼ Expo(1). The MGF of X is M (t) = 1/(1 − t) for t < 1.
As shown in Theorem 6.4.5, we could obtain the moments by taking derivatives
of the MGF and evaluating at 0. In this case, though, we recognize 1/(1 − t) as a
geometric series, valid in an interval around 0. For |t| < 1,
                                               X  ∞   X tn       ∞
                                          1
                               M (t) =       =   tn =  n! .
                                         1−t             n!
                                                 n=0            n=0

On the other hand, we know that E(X n ) is the coefficient of the term involving tn
in the Taylor expansion of M (t):
                                                ∞
                                                X               tn
                                     M (t) =          E(X n )      .
                                                                n!
                                                n=0

Thus we can match coefficients to conclude that E(X n ) = n! for all n. We not only
did not have to do a LOTUS integral, but also we did not, for example, have to
take 10 derivatives to get the 10th moment—we got the moments all at once.
To find the moments of Y ∼ Expo(λ), use a scale transformation: we can express
Y = X/λ where X ∼ Expo(1). Therefore Y n = X n /λn and
                                              n!
                                          E(Y n ) =
                                                 .
                                              λn
In particular, we have found the mean and variance of Y , making good on our
promise from Chapter 5:
                                              1
                                    E(Y ) = ,
                                              λ
                                                   2    1    1
                   Var(Y ) = E(Y 2 ) − (EY )2 = 2 − 2 = 2 .                
                                                   λ   λ     λ
Example 6.5.2 (Standard Normal moments). In this example we will find all the
moments of the standard Normal distribution. Let Z ∼ N (0, 1). We can use the
same trick of matching the coefficients of the Taylor expansion.
                                   ∞
                                   X              ∞
                                                  X           ∞
                                                              X
                       t2 /2         (t2 /2)n        t2n        (2n)! t2n
           M (t) = e           =                =           =                 .
                                         n!         2n · n!     2n · n! (2n)!
                                   n=0            n=0                  n=0


284                                                                  Introduction to Probability

Therefore
                                             (2n)!
                                     E(Z 2n ) =      ,
                                             2n · n!
and the odd moments of Z are equal to 0, which must be true due to the symmetry
of the standard Normal. From the story proof about partnerships in Example 1.5.4,
we know that 2(2n)!
               n ·n! is the product of the odd numbers from 1 through 2n − 1, so



                   E(Z 2 ) = 1, E(Z 4 ) = 1 · 3, E(Z 6 ) = 1 · 3 · 5, . . . .

This result also shows that the kurtosis of a Normal r.v. is 0. For X ∼ N (µ, σ 2 ),
                                        4
                                  X −µ
              Kurt(X) = E                     − 3 = E(Z 4 ) − 3 = 3 − 3 = 0.                 
                                    σ

Example 6.5.3 (Log-Normal moments). Now let’s consider the Log-Normal dis-
tribution. We say that Y is Log-Normal with parameters µ and σ 2 , denoted by
Y ∼ LN (µ, σ 2 ), if Y = eX where X ∼ N (µ, σ 2 ).
h 6.5.4. Log-Normal does not mean “log of a Normal”, since a Normal can be
negative. Rather, Log-Normal means “log is Normal”. It is important to distinguish
between the mean and variance of the Log-Normal and the mean and variance of
the underlying Normal. Here we are defining µ and σ 2 to be the mean and variance
of the underlying Normal, which is the most common convention.
Interestingly, the Log-Normal MGF does not exist, since E(etY ) is infinite for all
t > 0. Consider the case where Y = eZ for Z ∼ N (0, 1); by LOTUS,
                             Z ∞                    Z ∞
                        Z           z 1     2              1   z   2
         E(etY ) = E(ete ) =     ete √ e−z /2 dz =        √ ete −z /2 dz.
                              −∞      2π             −∞     2π

For any t > 0, tez − z 2 /2 goes to infinity as z grows, so the above integral diverges.
Since E(etY ) is not finite on an open interval around 0, the MGF of Y does not
exist. The same reasoning holds for a general Log-Normal distribution.
However, even though the Log-Normal MGF does not exist, we can still obtain all
the moments of the Log-Normal, using the MGF of the Normal. For Y = eX with
X ∼ N (µ, σ 2 ),
                                                     1 2 2
                   E(Y n ) = E(enX ) = MX (n) = enµ+ 2 n σ .
In other words, the nth moment of the Log-Normal is the MGF of the Normal
evaluated at t = n. Letting
                                                        1   2
                                   m = E(Y ) = eµ+ 2 σ ,

we have, after some algebra,
                                                                2
                        Var(Y ) = E(Y 2 ) − m2 = m2 (eσ − 1).

All Log-Normal distributions are right-skewed. For example, Figure 6.2 shows a


Moments                                                                            285

Log-Normal PDF in dark, with mean 2 and variance 12. This is the distribution
of eX for X ∼ N (0, 2 log 2), and it is clearly right-skewed. To quantify this, let us
compute the skewness of the Log-Normal r.v. Y = eX for X ∼ N (0, σ 2 ). Letting
              1 2                          2
m = E(Y ) = e 2 σ , we have E(Y n ) = mn and Var(Y ) = m2 (m2 − 1), and the third
central moment is

                    E(Y − m)3 = E(Y 3 − 3mY 2 + 3m2 Y − m3 )
                                = E(Y 3 ) − 3mE(Y 2 ) + 2m3
                                = m9 − 3m5 + 2m3 .

Thus, the skewness is

                       E(Y − m)3   m9 − 3m5 + 2m3             p
                                                       2
          Skew(Y ) =       3     =                 = (m  + 2)   m2 − 1,
                        SD (Y )     m3 (m2 − 1)3/2

where in the last step we factored m6 − 3m2 + 2 = (m2 + 2)(m − 1)2 (m + 1)2 . The
skewness is positive since m > 1, and it increases very quickly as σ grows.    
In the next example, we introduce the Weibull distribution, which is one of the most
widely used distributions in survival analysis (the study of the duration of time until
an event occurs, e.g., modeling how long someone with a particular disease will live).


Example 6.5.5 (Weibull distribution). As you may remember from the previous
chapter, the Exponential distribution is memoryless, which makes it unrealistic for,
e.g., modeling a human lifetime. Remarkably, simply raising an Exponential r.v. to
a power dramatically improves the flexibility and applicability of the distribution.
Let T = X 1/γ , with X ∼ Expo(λ) and λ, γ > 0. The distribution of T is called
the Weibull distribution, and we denote this by T ∼ Wei(λ, γ). This generalizes the
Exponential, with the case γ = 1 reducing back to the Exponential.
Weibull distributions are widely used in biostatistics, epidemiology, and engineering;
there is even an 800-page book devoted to this distribution: The Weibull Distribu-
tion: A Handbook by Horst Rinne [21].
The PDF of T is
                                               γ
                                 f (t) = γλe−λt tγ−1
for t > 0, as can be shown by relating the CDF of T to the CDF of X, or by using
transformation results from Chapter 8. The PDF looks somewhat complicated, but
often when working with a Weibull random variable we can use the strategy of first
transforming it back to an Exponential.
For simplicity and concreteness, let’s look at a specific Weibull distribution, letting
λ = 1 and γ = 1/3.
(a) Find P (T > s + t|T > s) for s, t > 0. Does T have the memoryless property?
(b) Find the mean and variance of T , and the nth moment E(T n ) for n = 1, 2, . . . .


286                                                                 Introduction to Probability

(c) Determine whether or not the MGF of T exists.
Solution:
(a) The CDF of T is
                                                                         1/3
                 P (T ≤ t) = P (X 3 ≤ t) = P (X ≤ t1/3 ) = 1 − e−t             ,
for t > 0. So
                                                                        1/3
                                        P (T > s + t)   e−(s+t)
                  P (T > s + t|T > s) =               =         ,
                                          P (T > s)      e−s1/3
                                           1/3
which is not the same as P (T > t) = e−t . Thus, T does not have the memoryless
property. Nor could it, since it is not Exponential.
(b) Example 6.5.1 shows that the moments of X are given by E(X n ) = n!. This
allows us to find the moments of T without doing any additional work! Specifically,
                              E(T n ) = E(X 3n ) = (3n)!.
The mean and variance of T are
                       E(T ) = 3! = 6, Var(T ) = 6! − 62 = 684.

(c) By LOTUS,                                    Z ∞
                                          3              3
                          E(etT ) = E(etX ) =          etx −x dx.
                                                 0
This integral diverges for t > 0 since the tx3 term dominates over the x;pmore
precisely, we have tx3 − x > x for all x sufficiently large (specifically,R for x > 2/t),
                                                                            ∞
so this integral diverges by comparison with the divergent integral 0 ex dx. So the
MGF of T does not exist, even though all the moments of T do exist.                    
h 6.5.6. Several different parameterizations of the Weibull are commonly used,
e.g., we are including a scale in the Exponential and then raising to a power, but it
is also common to take an Expo(1) to a power and then rescale. So care is needed
when reading various references: always check which convention is being used. Our
parameterization here is widely used in medical statistics, and is convenient to work
with since we are just raising an Expo(λ) r.v. to a power.




6.6   Sums of independent r.v.s via MGFs

Since the MGF of a sum of independent r.v.s is just the product of the individ-
ual MGFs, we now have a new strategy for finding the distribution of a sum of
independent r.v.s: multiply the individual MGFs together and see if the product is
recognizable as the MGF of a named distribution. The next two examples illustrate
this strategy.


Moments                                                                                             287

Example 6.6.1 (Sum of independent Poissons). Using MGFs, we can easily show
that the sum of independent Poissons is Poisson. First let’s find the MGF of X ∼
Pois(λ):
                          ∞
                          X                              ∞
                                                   X (λet )k
                                      e−λ λk                          t      t
             E(etX ) =          etk          = e−λ           = e−λ eλe = eλ(e −1) .
                                        k!             k!
                          k=0                        k=0

Now let Y ∼ Pois(µ) be independent of X. The MGF of X + Y is
                                                 t             t             t
                       E(etX )E(etY ) = eλ(e −1) eµ(e −1) = e(λ+µ)(e −1) ,
which is the Pois(λ + µ) MGF. Since the MGF determines the distribution, we have
proven that X + Y ∼ Pois(λ + µ). Contrast this with the proof from Chapter 4
(Theorem 4.8.1), which required using the law of total probability and summing
over all possible values of X. The proof using MGFs is far less tedious.      
h 6.6.2. It is important that X and Y be independent in the above example. To see
why, consider an extreme form of dependence: X = Y . In that case, X + Y = 2X,
which can’t possibly be Poisson since its value is always an even number!
Example 6.6.3 (Sum of independent Normals). If we have X1 ∼ N (µ1 , σ12 ) and
X2 ∼ N (µ2 , σ22 ) independently, then the MGF of X1 + X2 is
                                                     1   2 2       1   2 2          1   2   2   2
      MX1 +X2 (t) = MX1 (t)MX2 (t) = eµ1 t+ 2 σ1 t · eµ2 t+ 2 σ2 t = e(µ1 +µ2 )t+ 2 (σ1 +σ2 )t ,
which is the N (µ1 + µ2 , σ12 + σ22 ) MGF. Again, because the MGF determines the
distribution, it must be the case that X1 + X2 ∼ N (µ1 + µ2 , σ12 + σ22 ). Thus the sum
of independent Normals is Normal, and the means and variances simply add.             
Example 6.6.4 (Sum is Normal). A converse to the previous example also holds: if
X1 and X2 are independent and X1 +X2 is Normal, then X1 and X2 must be Normal!
This is known as Cramér’s theorem. Proving this in full generality is difficult, but
it becomes much easier if X1 and X2 are i.i.d. with MGF M (t). Without loss of
generality, we can assume X1 + X2 ∼ N (0, 1), and then its MGF is
                      2
                    et /2 = E(et(X1 +X2 ) ) = E(etX1 )E(etX2 ) = (M (t))2 ,
                2
so M (t) = et /4 , which is the N (0, 1/2) MGF. Thus, X1 , X2 ∼ N (0, 1/2).                          
In Chapter 8 we’ll discuss a more general technique for finding the distribution of
a sum of r.v.s, which applies when the individual MGFs don’t exist, or when the
product of the individual MGFs is not recognizable and we would like to get the
PMF/PDF instead.




6.7      *Probability generating functions

In this section we discuss probability generating functions, which are similar to MGFs
but are guaranteed to exist for nonnegative integer-valued r.v.s. First we’ll use PGFs


288                                                        Introduction to Probability

to conquer a seemingly intractable counting problem. Then we’ll prove that the PGF
of a nonnegative integer-valued r.v. determines its distribution, which we omitted
in the more general MGF setting.
Definition 6.7.1 (Probability generating function). The probability generating
function (PGF) of a nonnegative integer-valued r.v. X with PMF pk = P (X = k)
is the generating function of the PMF. By LOTUS, this is
                                           ∞
                                           X
                                     X
                                 E(t ) =         pk tk .
                                           k=0
                                                                     P∞
The PGF converges to a value in [−1, 1] for all t in [−1, 1] since    k=0 pk = 1 and
|pk tk | ≤ pk for |t| ≤ 1.
The MGF is closely related to the PGF, when both exist: for t > 0,

                                 E(tX ) = E(eX log t )

is the MGF evaluated at log t.
Example 6.7.2 (Generating dice probabilities). Frederick Mosteller, the founder
of the Harvard Statistics Department, once recounted the following life-changing
moment:
     A key moment in my life occurred in one of those classes during my sophomore
 year. We had the question: When three dice are rolled what is the chance that
 the sum of the faces will be 10? The students in this course were very good, but
 we all got the answer largely by counting on our fingers. When we came to class,
 I said to the teacher, “That’s all very well—we got the answer—but if we had
 been asked about six dice and the probability of getting 18, we would still be
 home counting. How do you do problems like that?” He said, “I don’t know, but
 I know a man who probably does and I’ll ask him.”
     One day I was in the library and Professor Edwin G. Olds of the Mathematics
 Department came in. He shouted at me, “I hear you’re interested in the three
 dice problem.” He had a huge voice, and you know how libraries are. I was
 embarrassed. “Well, come and see me,” he said, “and I’ll show you about it.”
 “Sure,” I said. But I was saying to myself, “I’ll never go.” Then he said, “What
 are you doing?” I showed him. “That’s nothing important,” he said. “Let’s go
 now.”
     So we went to his office, and he showed me a generating function. It was
 the most marvelous thing I had ever seen in mathematics. It used mathematics
 that, up to that time, in my heart of hearts, I had thought was something that
 mathematicians just did to create homework problems for innocent students in
 high school and college. I don’t know where I had got ideas like that about
 various parts of mathematics. Anyway, I was stunned when I saw how Olds used
 this mathematics that I hadn’t believed in. He used it in such an unusually
 outrageous way. It was a total retranslation of the meaning of the numbers. [1]


Moments                                                                                  289

Let X be the total from rolling 6 fair dice, and let X1 , . . . , X6 be the individual
rolls. What is P (X = 18)? It turns out that there are 3431 ways to obtain a sum of
18, so the probability is 3431/66 ≈ 0.0735. Listing out all possibilities is extremely
tedious, and the tedium would be compounded with the worry of having somehow
missed a case. And what if we laboriously listed out all 3431 cases, and then were
asked to find P (X = 19)?
The PGF of X lets us count the cases in a systematic way. The PGF of X1 is
                                      1
                             E(tX1 ) = (t + t2 + · · · + t6 ).
                                      6
Since the Xj are i.i.d., the PGF of X is
                                                t6
       E tX = E tX1 · · · tX6 = E tX1 · · · E tX6 = 6 (1 + t + · · · + t5 )6 .
                                                   6
By definition, the coefficient of t18 in the PGF is P (X = 18). So the number of
ways to get a sum of 18 is the coefficient of t18 in t6 (1 + t + · · · + t5 )6 , which is the
coefficient of t12 in (1 + t + · · · + t5 )6 . Multiplying this out by hand is tedious, but
it is vastly easier than listing out 3431 cases, and it can also be done easily on a
computer without having to write a special program.
Better yet, we can use the fact that 1 + t + · · · + t5 is a geometric series to write
                                                        (1 − t6 )6
                             (1 + t + · · · + t5 )6 =              .
                                                         (1 − t)6
(Assume that |t| < 1, which we can do since, as with the MGF, we just need to
know how the PGF behaves in an open interval containing 0.) The above equation
is just algebra since we have the bookkeeping device t, but would have been hard
to fathom if everything were still in sequence notation. By the binomial theorem,
the numerator is
                                        X6  
                                 6 6        6
                           (1 − t ) =          (−1)j t6j .
                                            j
                                           j=0

For the denominator, write
                                                            X   ∞
                          1                 2           6
                                = (1 + t + t  + · · · )   =   ak tk .
                       (1 − t)6
                                                               k=0

Here ak is the number of ways to choose one term from each of the six (1+t+t2 +. . . )
factors, such that the degrees add up to k. For example, for k = 20 one possibility
is to choose the t3 , 1, t2 , t10 , 1, t5 terms, respectively, since these choices contribute
one t20 term when the product is expanded out. So ak is the number of solutions to
y1 + y2 + · · · + y6 = k, with the yj nonnegative integers. We saw how to count this
                                                                                        
number of solutions in Chapter 1: ak is the Bose-Einstein value 6+k−1        k    = k+5
                                                                                      5 . So

                                                X∞        
                                         1            k+5 k
                                              =              t .
                                    (1 − t)6            5
                                            k=0


290                                                                         Introduction to Probability

For 0 < t < 1, another way to see why this equation holds is to write it as
                               ∞ 
                               X       
                                   k+5
                                             (1 − t)6 tk = 1,
                                        5
                               k=0

which we already knew to be true since the NBin(6, 1−t) PMF must sum to 1. (The
identity for (1 − t)−6 is an example of a generalization of the binomial theorem to
allow for negative integer powers; this helps explain why the Negative Binomial is
called that despite being neither negative nor Binomial!)
Putting together the above results, we just need the coefficient of t12 in
                                        
                       X2                 X12         !
                           6                     k + 5
                               (−1)j t6j                tk ,
                            j                       5
                         j=0                       k=0


where we summed only up to j = 2 and k = 12 in the two factors since any further
terms will not contribute to the coefficient of t12 . This lets us reduce the 3431 cases
down to just three cases: (j, k) is (0, 12), (1, 6), or (2, 0). The coefficient of t12 is
                                   
                            17     11   6
                               −6     +   = 3431,
                            5      5    2

since, for example, when j = 1 and k = 6 we get the term
                                              
                           6 6      6+5 6         11 12
                       −      t ·        t = −6        t .
                           1         5             5

Thus,
                                                        3431
                                     P (X = 18) =            .                                      
                                                         66

Since the PGF is just a handy bookkeeping device for the PMF, it fully determines
the distribution (for any nonnegative integer-valued r.v.). The theorem below shows
how to pluck the PMF values down from the “clothesline” of the PGF.
Theorem 6.7.3. Let X and Y be nonnegative integer-valued r.v.s, with PGFs
gX and gY respectively. Suppose that gX (t) = gY (t) for all t in (−a, a), where
0 < a < 1. Then X and Y have the same distribution, and their PMF can be
recovered by taking derivatives of gX :
                                                                  (k)
                                                                 gX (0)
                          P (X = k) = P (Y = k) =                       .
                                                                   k!

Proof. Write
                                                 ∞
                                                 X
                                      gX (t) =         pk tk .
                                                 k=0


Moments                                                                           291

Then gX (0) = p0 , so P (X = 0) has been recovered—from knowing the function gX ,
we can extract the value of P (X = 0). The derivative is
                                           ∞
                                           X
                                0
                               gX (t) =          kpk tk−1 ,
                                       k=1
    0
so gX (0) = p1 (swapping the derivative and the infinite sum is justified by results
in real analysis). Then P (X = 1) has been recovered. Continuing in this way, we
can recover the entire PMF by taking derivatives.                              
Example 6.7.4. Let X ∼ Bin(n, p). The PGF of a Bern(p) r.v. is pt + q (with
q = 1 − p), so the PGF of X is g(t) = (pt + q)n . The above theorem says that any
r.v. with this PGF must in fact be Binomial. Furthermore, we can recover the PMF
by computing
                                                        
                       n   0          n−1    00         n 2 n−2
               g(0) = q , g (0) = npq     , g (0)/2! =     p q  ,....
                                                        2
We can avoid having to take derivatives by using the binomial theorem to write
                                         Xn  
                                     n        n k n−k k
                      g(t) = (pt + q) =          p q    t ,
                                              k
                                            k=0
from which we can directly read off the Binomial PMF.
While we’re working with the Binomial PGF, let’s see how it can be used to get the
moments of a Binomial. Letting pk = P (X = k), we have
                                                     n
                                                     X
                       g 0 (t) = np(pt + q)n−1 =            kpk tk−1 ,
                                                      k=1
so
                                           n
                                           X
                          g 0 (1) = np =         kpk = E(X).
                                           k=1
Taking the derivative again,
                                                        n
                                                        X
                00               2          n−2
               g (t) = n(n − 1)p (pt + q)           =         k(k − 1)pk tk−2 ,
                                                        k=2
so
                       E(X(X − 1)) = g 00 (1) = n(n − 1)p2 .
Rearranging these results gives another proof that Var(X) = npq. Continuing in
this way, we have computed what are called the factorial moments of the Binomial:
                                                         
                                                           n k
                      E(X(X − 1) . . . (X − k + 1)) = k!     p .
                                                           k
                                                        
Dividing by k! on both sides, this implies E X         n k
                                                  k = k p , which can also be seen
                        
with a story proof: X k is the number of ways to choose k out of the X successful
Bernoulli trials, which is the number of ways to choose k out of the n original
                                                                             trials
such that all k are successes. Creating an indicator r.v. for each of the nk subsets
of size k and using linearity, the result follows.                                


292                                                              Introduction to Probability




6.8   Recap

A useful way to study a distribution is via its moments. The first 4 moments are
widely used as a basis for quantitatively describing what the distribution looks like,
though many other descriptions are also possible. In particular, the first moment
is the mean, the second central moment is the variance, the third standardized
moment measures skew (asymmetry), and the fourth standardized moment minus
3 is a measure of how heavy the tails are.
Moments are useful for far more than studying the location and shape of a dis-
tribution, especially when the moment generating function (MGF) exists (which is
stronger than saying that all the moments exist). The MGF of an r.v. X is the
function M defined by
                                 M (t) = E(etX ),
if this is finite for all t in some open interval containing 0. If the MGF exists,
then

        M (0) = 1, M 0 (0) = E(X), M 00 (0) = E(X 2 ), M 000 (0) = E(X 3 ), . . . .

MGFs are useful for three main reasons: for computing moments (as an alternative
to LOTUS), for studying sums of independent r.v.s, and since they fully determine
the distribution and thus serve as an additional blueprint for a distribution.
We also introduced the Log-Normal and Weibull distributions in this chapter, both
of which are widely used in practice. The Log-Normal and Weibull are connected
to the Normal and Exponential, respectively, via simple transformations. The log of
a Log-Normal r.v. is Normal, and raising a Wei(λ, γ) r.v. to the power γ yields an
Expo(λ) r.v. Often the best way to study a Log-Normal is to transform it back to
Normal, and likewise for Weibull and Exponential. Chapter 8 goes into much more
detail about how to work with transformations.
Figure 6.8 augments our map of the connections between fundamental objects in
probability. If the MGF of X exists, then the sequence E(X), E(X 2 ), E(X 3 ), . . .
of moments provides enough information (at least in principle) to determine the
distribution of X.


Moments                                                                                                                        293

       1.0
       0.8




                                                                                           What can
       0.6
F(x)

       0.4




                                                                                           happen?
       0.2
       0.0




             -6    -4   -2   0   2   4   6

                             x




                   distributions                        random variables                        events            numbers

                      CDF F                  generate                                           X≤x      P      P(X ≤ x) = F(x)
                                                                        X
                   PMF (discrete)                                                               X=x                P(X = x)
                  PDF (continuous)
                       story




                                                            function of r.v.
                  name, parameters
                       MGF                                                                                    E(X), Var(X), SD(X)




                                                           X, X2, X3, …                    LOTUS             E(X), E(X2), E(X3), …
                                                               g(X)                                                 E(g(X))

                                                                                          MGF
                                                                               find the



FIGURE 6.8
For an r.v. X, we can study its moments E(X), E(X 2 ), . . . . These can be computed
using LOTUS or by the MGF (if it exists). If the MGF exists, it determines the
distribution, taking us full circle and adding to our list of blueprints.




6.9                     R

Functions

The MGF of an r.v. is a function. As an example of defining and working with
                                                                        2
functions in R, let’s use the N (0, 1) MGF, which is given by M (t) = et /2 . The
code
M <- function(t) {exp(t^2/2)}
defines M to be this function. The function(t) says that we’re defining a function
of one variable t (called the argument of the function). Then, for example, M(0)
evaluates the function at 0, M(1:10) evaluates the function at 1, 2, . . . , 10, and
curve(M,from=-3,to=3) plots the graph of M from −3 to 3. Writing
M <- function(x) {exp(x^2/2)}
would define the same function M , except that now the argument is named x.
Giving the arguments names is helpful for functions of more than one variable,
since R then saves us from having to remember the order in which to write the


294                                                       Introduction to Probability

arguments, and allows us to assign default values. For example, the N (µ, σ 2 ) MGF
is given by g(t) = exp(µt + σ 2 t2 /2), which depends on t, µ, and σ. We can define
this in R by
g <- function(t,mean=0,sd=1) {exp(mean*t + sd^2*t^2/2)}
What is g(1,2,3)? It’s the N (2, 32 ) MGF evaluated at 1, but it may be hard
to remember which argument is which, especially when working with many func-
tions with many arguments over the course of many months. So we can also write
g(t=1,mean=2,sd=3) or g(mean=2,sd=3,t=1) or any of the other 4 permutations
to mean the same thing.
Also, when defining g we specified default values of 0 for the mean and 1 for
the standard deviation, so if we want the N (0, 52 ) MGF evaluated at 3, we
can use g(t=3,sd=5) as shorthand. It would be bad here to write g(3,5), since
that is ambiguous about which argument is omitted; in fact, R interprets this as
g(t=3,mean=5).


Moments

LOTUS makes it easy to write down any moment of a continuous r.v. as an integral,
and then R can help us do the integral numerically, using the integrate command.
For example, let’s approximate the 6th moment of a N (0, 1) r.v. The code
g <- function(x) x^6*dnorm(x)
integrate(g, lower = -Inf, upper = Inf)
                  R∞
asks R to compute −∞ g(x)dx, where g(x) = x6 ϕ(x) with ϕ the N (0, 1) PDF. When
we ran this, R reported 15 (the correct answer, as we know from this chapter!) and
that the absolute error was less than 7.9 × 10−5 . Similarly, to check that the 2nd
moment (and variance) of a Unif(−1, 1) r.v. is 1/3, we can use
h <- function(x) x^2*dunif(x,-1,1)
integrate(h, lower = -1, upper = 1)
h 6.9.1. Numerical integration runs into difficulties for some functions; as usual,
checking answers in multiple ways is a good idea. Using upper = Inf is preferred to
using a large number as the upper limit when integrating up to ∞ (and likewise for
a lower limit of −∞). For example, on many systems integrate(dnorm,0,10^6)
reports 0 while integrate(dnorm,0,Inf) reports the correct answer, 0.5.
For moments of a discrete r.v., we can use LOTUS and the sum command. For
example, to find the 2nd moment of X ∼ Pois(7), we can use
g <- function(k) k^2*dpois(k,7)
sum(g(0:100))
Here we summed up to 100 since it’s clear after getting a sense of the terms that
the total contribution of all the terms after k = 100 is negligible (choosing an


Moments                                                                           295

upper limit in this way is in contrast to how to use the integrate command in
the continuous case). The result is extremely close to 56, which is comforting since
E(X 2 ) = Var(X) + (EX)2 = 7 + 49 = 56.
A sample moment can be found in one line in R. If x is a vector of data, then mean(x)
gives its sample mean and, more generally, mean(x^n) gives the nth sample mean
for any positive integer n. For example,
x <- rnorm(100)
mean(x^6)
gives the 6th sample moment of 100 i.i.d. N (0, 1) r.v.s. How close is it to the
true 6th moment? How close are other sample moments to the corresponding true
moments?
The sample variance can also be found in one line in R. If x is a vector of data, then
var(x) gives its sample variance. This returns NA (not available) if x has length 1,
since the n − 1 in the denominator is 0 in this case. It makes sense not to return a
numerical value in this case, not only because of the definition but also because it
would be insane to try to estimate the variability of a population if we only have
one observation!
For a simple demonstration of using the sample mean and sample variance to es-
timate the true mean and true variance of a distribution, we generate 1000 times
from a N (0, 1) distribution and store the values in z. We then compute the sample
mean and sample variance with mean and var.
z <- rnorm(1000)
mean(z)
var(z)
We find that mean(z) is close to 0 and var(z) is close to 1. You can try this out
for a N (µ, σ 2 ) distribution (or other distribution) of your choosing; just remember
that rnorm takes σ and not σ 2 as an input!
The sample standard deviation of x can be found using sd(x). This gives the same
result as sqrt(var(x)).
R does not come with built-in functions for sample skewness or sample kurtosis,
but we can define our own functions as follows.
skew <- function(x) {
    centralmoment <- mean((x-mean(x))^3)
    centralmoment/(sd(x)^3)
}
kurt <- function(x) {
    centralmoment <- mean((x-mean(x))^4)
    centralmoment/(sd(x)^4) - 3
}


296                                                         Introduction to Probability

Medians and modes

To find the median of a continuous r.v. with CDF F , we need to solve the equation
F (x) = 1/2 for x, which is equivalent to finding the root (zero) of the function g
given by g(x) = F (x) − 1/2. This can be done using uniroot in R. For example,
let’s find the median of the Expo(1) distribution. The code
g <- function(x) pexp(x) - 1/2
uniroot(g,lower=0,upper=1)
asks R to find a root of the desired function between 0 and 1. This returns an answer
very close to the true answer of log(2) ≈ 0.693. Of course, in this case we can solve
1 − e−x = 1/2 directly without having to use numerical methods.
h 6.9.2. The uniroot command is useful but it only attempts to find one root (as
the name suggests), and there is no guarantee that it will find a root.
An easier way to find the median of the Expo(1) in R is to use qexp(1/2). The
function qexp is the quantile function of the Expo(1) distribution, which means that
qexp(p) is the value of x such that P (X ≤ x) = p for X ∼ Expo(1).
For finding the mode of a continuous distribution, we can use the optimize function
in R. For example, let’s find the mode of the Gamma(6, 1) distribution, which is
an important distribution that we will introduce in the next chapter. Its PDF is
proportional to x5 e−x . Using calculus, we can find that the mode is at x = 5. Using
R, we can find that the mode is very close to x = 5 as follows.
h <- function(x) x^5*exp(-x)
optimize(h,lower=0,upper=20,maximum=TRUE)
If we had wanted to minimize instead of maximize, we could have put
maximum=FALSE.
Next, let’s do a discrete example of median and mode. An interesting fact about
the Bin(n, p) distribution is that if the mean np is an integer, then the median and
mode are also np (even if the distribution is very skewed). To check this fact about
the median for the Bin(50, 0.2) distribution, we can use the following code.
n <- 50; p <- 0.2
which.max(pbinom(0:n,n,p)>=0.5)
The which.max function finds the location of the maximum of a vector, giving the
index of the first occurrence of a maximum. Since TRUE is encoded as 1 and FALSE
is encoded as 0, the first maximum in pbinom(0:n,n,p)>=0.5 is at the first value
for which the CDF is at least 0.5. The output of the above code is 11, but we must be
careful to avoid an off-by-one error: the index 11 corresponds to the median being 10,
since we started evaluating the CDF at 0. Similarly, which.max(dbinom(0:n,n,p))
returns 11, showing that the mode is at 10.
The sample median of a vector x of data can be found using median(x). But


Moments                                                                            297

mode(x) does not give the sample mode of x (rather, it gives information about
what type of object x is). To find the sample mode (or sample modes, in case there
are ties), we can use the following function.

datamode <- function(x) {
    t <- table(x)
    m <- max(t)
    as.numeric(names(t[t==m]))
}


Log-Normal and Weibull distributions

Analogous to the functions dnorm, pnorm, and rnorm for the Normal distribution, the
functions dlnorm, plnorm, and rlnorm give the Log-Normal PDF, the Log-Normal
CDF, and random generation of Log-Normal r.v.s, respectively. The parameters
used for these functions for the Log-Normal are the mean and standard deviation
of the underlying Normal.

For example, dlnorm(x,1,2) gives the PDF of the LN (1, 4) distribution (not
LN (1, 2), nor a Log-Normal whose mean is 1). Because of the relation-
ship between Normal and Log-Normal, rlnorm(n,mu,sigma) is equivalent to
exp(rnorm(n,mu,sigma)).

For the Weibull, we can obtain the PDF, the CDF, and random generation with the
functions dweibull, pweibull, and rweibull, respectively. The parametrization in
R is different from the one we are using, but it is easy to convert between them: for
the Wei(λ, γ) distribution, let a = γ and b = λ−1/γ .

Then dweibull(x,a,b) gives the Wei(λ, γ) PDF, pweibull(x,a,b) gives the CDF,
and rweibull(n,a,b) generates n i.i.d. draws from the distribution. Because of the
relationship between Exponential and Weibull, another way to generate Wei(λ, γ)
r.v.s is to generate Expo(λ) r.v.s and then raise each of them to the 1/γ power.


Dice simulation

In the starred Section 6.7, we showed that in rolling 6 fair dice, the probability of a
total of 18 is 3431/66 ≈ 0.07354. But the proof was complicated. If we only need an
approximate answer, simulation is a much easier approach. And we already know
how to do it! Here is the code for a million repetitions:

r <- replicate(10^6,sum(sample(6,6,replace=TRUE)))
sum(r==18)/10^6

In our simulation this yielded 0.07346, which is very close to 0.07354.


298                                                                   Introduction to Probability




6.10    Exercises

Exercises marked with s have detailed solutions at http://stat110.net.


       Means, medians, modes, and moments
  1.   Let U ∼ Unif(a, b). Find the median and mode of U .
  2.   Let X ∼ Expo(λ). Find the median and mode of X.
  3.   Let X have the Pareto distribution with parameter a > 0; this means that X has PDF
       f (x) = a/xa+1 for x ≥ 1 (and 0 otherwise). Find the median and mode of X.
  4.   Let X ∼ Bin(n, p).

       (a) For n = 5, p = 1/3, find all medians and all modes of X. How do they compare to
       the mean?

       (b) For n = 6, p = 1/3, find all medians and all modes of X. How do they compare to
       the mean?
  5.   Let X be Discrete Uniform on 1, 2, . . . , n. Find all medians and all modes of X (your
       answer can depend on whether n is even or odd).
  6.   Suppose that we have data giving the amount of rainfall in a city each day in a certain
       year. We want useful, informative summaries of how rainy the city was that year. On
       the majority of days in that year, it did not rain at all in the city. Discuss and compare
       the following six summaries: the mean, median, and mode of the rainfall on a randomly
       chosen day from that year, and the mean, median, and mode of the rainfall on a randomly
       chosen rainy day from that year (where by “rainy day” we mean that it did rain that
       day in the city).
  7.   Let a and b be positive constants. The Beta distribution with parameters a and b,
       which we introduce in detail in Chapter 8, has PDF proportional to xa−1 (1 − x)b−1 for
       0 < x < 1 (and the PDF is 0 outside of this range). Show that for a > 1, b > 1, the
       mode of the distribution is (a − 1)/(a + b − 2).
       Hint: Take the log of the PDF first (note that this does not affect where the maximum
       is achieved).
  8.   Find the median of the Beta distribution with parameters a = 3 and b = 1 (see the
       previous problem for information about the Beta distribution).
  9.   Let Y be Log-Normal with parameters µ and σ 2 . So Y = eX with X ∼ N (µ, σ 2 ). Three
       students are discussing the median and the mode of Y . Evaluate and explain whether
       or not each of the following arguments is correct.

       (a) Student A: The median of Y is eµ because the median of X is µ and the exponential
       function is continuous and strictly increasing, so the event Y ≤ eµ is the same as the
       event X ≤ µ.

       (b) Student B: The mode of Y is eµ because the mode of X is µ, which corresponds to
       eµ for Y since Y = eX .

       (c) Student C: The mode of Y is µ because the mode of X is µ and the exponential
       function is continuous and strictly increasing, so maximizing the PDF of X is equivalent
       to maximizing the PDF of Y = eX .


Moments                                                                                               299

 10.   A distribution is called symmetric unimodal if it is symmetric (about some point) and
       has a unique mode. For example, any Normal distribution is symmetric unimodal. Let
       X have a continuous symmetric unimodal distribution for which the mean exists. Show
       that the mean, median, and mode of X are all equal.
 11.   Let X1 , . . . , Xn be i.i.d. r.v.s with mean µ, variance σ 2 , and skewness γ.

       (a) Standardize the Xj by letting
                                                      Xj − µ
                                               Zj =          .
                                                        σ
       Let X̄n and Z̄n be the sample means of the Xj and Zj , respectively. Show that Zj has
       the same skewness as Xj , and Z̄n has the same skewness as X̄n .
                                                                  √
       (b) Show that the skewness of the sample mean X̄n is γ/ n. You can use the fact,
       shown in Chapter 7, that if X and Y are independent then E(XY ) = E(X)E(Y ).
       Hint: By (a), we can assume µ = 0 and σ 2 = 1 without loss of generality; if the Xj are
       not standardized initially, then we can standardize them. If (X1 + X2 + · · · + Xn )3 is
       expanded out, there are 3 types of terms: terms such as X13 , terms such as 3X12 X2 , and
       terms such as 6X1 X2 X3 .

       (c) What does the result of (b) say about the distribution of X̄n when n is large?
 12.   Let c be the speed of light in a vacuum. Suppose that c is unknown, and scientists wish
       to estimate it. But even more so than that, they wish to estimate c2 , for use in the
       famous equation E = mc2 .

       Through careful experiments, they obtain i.i.d. measurements X1 , . . . , Xn ∼ N (c, σ 2 ).
       Using these data, there are various possible ways to estimate c2 . Two natural ways are:
       (1) estimate c using the average of the Xj ’s and then square the estimated c, and (2)
       average the Xj2 ’s. So let
                                                     n
                                                  1X
                                           X̄n =        Xj ,
                                                  n j=1
       and consider the two estimators
                                                                 n
                                                            1X 2
                                      T1 = X̄n2 and T2 =          Xj .
                                                            n j=1

       Note that T1 is the square of the first sample moment and T2 is the second sample
       moment.

       (a) Find P (T1 < T2 ).
       Hint: Start by comparing ( n1 n
                                      P         2     1
                                                        Pn     2
                                        j=1 xj ) and n    j=1 xj when x1 , . . . , xn are numbers,
       by considering a discrete r.v. whose possible values are x1 , . . . , xn .

       (b) When an r.v. T is used to estimate an unknown parameter θ, the bias of the estimator
       T is defined to be E(T ) − θ. Find the bias of T1 and the bias of T2 .
       Hint: First find the distribution of X̄n . In general, for finding E(Y 2 ) for an r.v. Y , it is
       often useful to write it as E(Y 2 ) = Var(Y ) + (EY )2 .


       Moment generating functions
 13.    s A fair die is rolled twice, with outcomes X for the first roll and Y for the second
       roll. Find the moment generating function MX+Y (t) of X + Y (your answer should be
       a function of t and can contain unsimplified finite sums).


300                                                                       Introduction to Probability

  14.    s Let U1 , U2 , . . . , U60 be i.i.d. Unif(0, 1) and X = U1 + U2 + · · · + U60 . Find the MGF
        of X.
  15.   Let W = X 2 + Y 2 , with X, Y i.i.d. N (0, 1). The MGF of X 2 turns out to be (1 − 2t)−1/2
        for t < 1/2 (you can assume this).
        (a) Find the MGF of W .
        (b) What famous distribution that we have studied so far does W follow (be sure to
        state the parameters in addition to the name)? In fact, the distribution of W is also a
        special case of two more famous distributions that we will study in later chapters!
  16.   Let X ∼ Expo(λ). Find the skewness of X, and explain why it is positive and why it
        does not depend on λ.
        Hint: Recall that λX ∼ Expo(1) and the nth moment of an Expo(1) r.v. is n! for all n.
  17.   Let X1 , . . . , Xn be i.i.d. with mean µ, variance σ 2 , and MGF M . Let
                                                   √
                                                                 
                                                         X̄n − µ
                                             Zn = n                 .
                                                            σ

        (a) Show that Zn is a standardized quantity, i.e., it has mean 0 and variance 1.
        (b) Find the MGF of Zn in terms of M , the MGF of each Xj .
  18.   Use the MGF of the Geom(p) distribution to give another proof that the mean of this
        distribution is q/p and the variance is q/p2 , with q = 1 − p.
  19.   Use MGFs to determine whether X + 2Y is Poisson if X and Y are i.i.d. Pois(λ).
  20.    s Let X ∼ Pois(λ), and let M (t) be the MGF of X. The cumulant generating function
        is defined to be g(t) = log M (t). Expanding g(t) as a Taylor series
                                                        ∞
                                                       X   cj j
                                              g(t) =          t
                                                       j=1
                                                           j!

        (the sum starts at j = 1 because g(0) = 0), the coefficient cj is called the jth cumulant
        of X. Find the jth cumulant of X, for all j ≥ 1.
  21.    s Let Xn ∼ Bin(n, pn ) for all n ≥ 1, where npn is a constant λ > 0 for all n (so
        pn = λ/n). Let X ∼ Pois(λ). Show that the MGF of Xn converges to the MGF of X
        (this gives another way to see that the Bin(n, p) distribution can be well-approximated
        by the Pois(λ) when n is large, p is small, and λ = np is moderate).
  22.   Consider a setting where a Poisson approximation should work well: let A1 , . . . , An
        be independent, rare events, with n large and pj = P (Aj ) small for all j. Let X =
        I(A1 ) + · · · + I(An ) count how many of the rare events occur, and let λ = E(X).
        (a) Find the MGF of X.
        (b) If the approximation 1 + x ≈ ex (this is a good approximation when x is very close
        to 0 but terrible when x is not close to 0) is used to write each factor in the MGF of
        X as e to a power, what happens to the MGF? Explain why the result makes sense
        intuitively.
  23.   Let U1 , U2 be i.i.d. Unif(0, 1). Example 8.2.5 in Chapter 8 shows that U1 + U2 has a
        Triangle distribution, with PDF given by
                                             
                                              t       for 0 < t ≤ 1,
                                     f (t) =
                                               2 − t for 1 < t < 2.
                                             

        The method in Example 8.2.5 is useful but it often leads to difficult integrals, so having
        alternative methods is important. Show that U1 + U2 has a Triangle distribution by
        showing that they have the same MGF.


Moments                                                                                   301

 24.   Let X and Y be i.i.d. Expo(1), and L = X − Y . The Laplace distribution has PDF
                                                       1 −|x|
                                             f (x) =     e
                                                       2
       for all real x. Use MGFs to show that the distribution of L is Laplace.
 25.   Let Z ∼ N (0, 1), and Y = |Z|. So Y has the Folded Normal distribution, discussed in
       Example 5.4.7. Find two expressions for the MGF of Y as unsimplified integrals: one
       integral based on the PDF of Y , and one based on the PDF of Z.
 26.   Let X, Y, Z, W ∼ N (0, 1) be i.i.d.
       (a) Find an expression for E Φ(Z)eZ as an unsimplified integral.
                                          

       (b) Find E(Φ(Z)) and E(eZ ) as fully simplified numbers.


Taylor & Francis
Taylor & Francis Group
http://taylorandfrancis.com


7
Joint distributions




When we first introduced random variables and their distributions in Chapter 3, we
noted that the individual distributions of two r.v.s do not tell us anything about
whether the r.v.s are independent or dependent. For example, two Bern(1/2) r.v.s
X and Y could be independent if they indicate Heads on two different coin flips,
or dependent if they indicate Heads and Tails, respectively, on the same coin flip.
Thus, although the PMF of X is a complete blueprint for X and the PMF of Y is a
complete blueprint for Y , these individual PMFs are missing important information
about how the two r.v.s are related.

Of course, in real life, we usually care about the relationship between multiple r.v.s
in the same experiment. To give just a few examples:

• Medicine: To evaluate the effectiveness of a treatment, we may take multiple mea-
  surements per patient; an ensemble of blood pressure, heart rate, and cholesterol
  readings can be more informative than any of these measurements considered sep-
  arately.

• Genetics: To study the relationships between various genetic markers and a partic-
  ular disease, if we only looked separately at distributions for each genetic marker,
  we could fail to learn about whether an interaction between markers is related to
  the disease.

• Time series: To study how something evolves over time, we can often make a
  series of measurements over time, and then study the series jointly. There are
  many applications of such series, such as global temperatures, stock prices, or
  national unemployment rates. The series of measurements considered jointly can
  help us deduce trends for the purpose of forecasting future measurements.

This chapter considers joint distributions, also called multivariate distributions,
which capture the previously missing information about how multiple r.v.s interact.
We introduce multivariate analogs of the CDF, PMF, and PDF in order to provide a
complete specification of the relationship between multiple r.v.s. After this ground-
work is in place, we’ll study a couple of famous named multivariate distributions,
generalizing the Binomial and Normal distributions to higher dimensions.

                                                                                  303


304                                                          Introduction to Probability




7.1     Joint, marginal, and conditional

The three key concepts for this section are joint, marginal, and conditional distribu-
tions. Recall that the distribution of a single r.v. X provides complete information
about the probability of X falling into any subset of the real line. Analogously, the
joint distribution of two r.v.s X and Y provides complete information about the
probability of the vector (X, Y ) falling into any subset of the plane. The marginal
distribution of X is the individual distribution of X, ignoring the value of Y , and
the conditional distribution of X given Y = y is the updated distribution for X
after observing Y = y. We’ll look at these concepts in the discrete case first, then
extend them to the continuous case.


7.1.1    Discrete

The most general description of the joint distribution of two r.v.s is the joint CDF,
which applies to discrete and continuous r.v.s alike.
Definition 7.1.1 (Joint CDF). The joint CDF of r.v.s X and Y is the function
FX,Y given by
                        FX,Y (x, y) = P (X ≤ x, Y ≤ y).
The joint CDF of n r.v.s is defined analogously.
Unfortunately, the joint CDF of discrete r.v.s is not a well-behaved function; as
in the univariate case, it consists of jumps and flat regions. For this reason, with
discrete r.v.s we usually work with the joint PMF, which also determines the joint
distribution and is much easier to visualize.
Definition 7.1.2 (Joint PMF). The joint PMF of discrete r.v.s X and Y is the
function pX,Y given by

                           pX,Y (x, y) = P (X = x, Y = y).

The joint PMF of n discrete r.v.s is defined analogously.
Just as univariate PMFs must be nonnegative and sum to 1, we require valid joint
PMFs to be nonnegative and sum to 1, where the sum is taken over all possible
values of X and Y :      XX
                                P (X = x, Y = y) = 1.
                             x   y

The joint PMF determines the distribution because we can use it to find the prob-
ability of the event (X, Y ) ∈ A for any set A of points in the support of (X, Y ). All
we have to do is sum the joint PMF over A:
                                        XX
                      P ((X, Y ) ∈ A) =        P (X = x, Y = y).
                                       (x,y)∈A


Joint distributions                                                                                                                                  305

Figure 7.1 shows a sketch of what the joint PMF of two discrete r.v.s could look like.
The height of a vertical bar at (x, y) represents the probability P (X = x, Y = y).
For the joint PMF to be valid, the total height of the vertical bars must be 1.


                                                                                 ●




                P(X = x, Y = y)
                                                                         ●                       ●

                                                                     ●                       ●
                                                                                     ●

                                                             ●
                                                                                                                 ●

                                                                             ●
                                                                 ●
                                                                             ●                       ●           ●
                                                                                             ●
                                                    ●                            ●       ●
                                                                     ●                                   ●
                                                         ●                                                           ●       ●
                                               ●●       ●                                                                        ●
                                                                                                             ●
                                   ●   ●                                                                                     ●           ●
                           ●                                     ●                                                                   ●
                                                                                         ●                                                   ●
                               ●
                                   ●                                                                                                             ●
                                           ●                                                                                                 ●
                                                                                                                                     ●
                                                                         ●                                               ●
                                                    ●


                                   y
                                                                                                     ●
                                                             ●

                                                                                                                                 x
                                                                                     ●

                                                                     ●




FIGURE 7.1
Joint PMF of discrete r.v.s X and Y .

From the joint distribution of X and Y , we can get the distribution of X alone by
summing over the possible values of Y . This gives us the familiar PMF of X that
we have seen in previous chapters. In the context of joint distributions, we will call
it the marginal or unconditional distribution of X, to make it clear that we are
referring to the distribution of X alone, without regard for the value of Y .
Definition 7.1.3 (Marginal PMF). For discrete r.v.s X and Y , the marginal PMF
of X is                           X
                      P (X = x) =    P (X = x, Y = y).
                                                                 y

The marginal PMF of X is the PMF of X, viewing X individually rather than
jointly with Y . The above equation follows from the axioms of probability (we are
summing over disjoint cases). The operation of summing over the possible values
of Y in order to convert the joint PMF into the marginal PMF of X is known as
marginalizing out Y .
The process of obtaining the marginal PMF from the joint PMF is illustrated in
Figure 7.2. Here we take a bird’s-eye view of the joint PMF for a clearer perspective;
each column of the joint PMF corresponds to a fixed x and each row corresponds
to a fixed y. For any x, the probability P (X = x) is the total height of the bars in
the corresponding column of the joint PMF: we can imagine taking all the bars in
that column and stacking them on top of each other to get the marginal probability.
Repeating this for all x, we arrive at the marginal PMF, depicted in bold.


306                                                                                                                                                     Introduction to Probability

                       P(X = x)



                                                                                                        ●


                                                                                        ●
                                                                                                                ●

                                                                        ●                       ●
                                                                                ●           ●                               ●
                                                            ●           ●                                   ●
                                                                    ●               ●                   ●

                                                                                                                        ●           ●
                                            ●

                                                    ●
                                                            ●
                                ●                                                                                                           ●
                                                                                                                ●               ●
                                                                    ●
                                                                                                ●
                        ●           ●
                                                                                                                                                    ●

                                            ●
                                                                                                                                        ●
                            ●
                                                                            ●                                                                           ●
                                                                                                                            ●
                                                        ●
                                ●                                                                           ●                                   ●


                                                                ●                                                                   ●
                                        ●                                               ●

                                                                                                                    ●
                                                ●

                            y
                                                                        ●


                                                                                                                                        x
                                                                                                    ●


                                                            ●
                                                                                ●



                                                                    ●




FIGURE 7.2
Bird’s-eye view of the joint PMF from Figure 7.1. The marginal PMF P (X = x) is
obtained by summing over the joint PMF in the y-direction.

Similarly, the marginal PMF of Y is obtained by summing over all possible values
of X. So given the joint PMF, we can marginalize out Y to get the PMF of X, or
marginalize out X to get the PMF of Y . But if we only know the marginal PMFs
of X and Y , there is no way to recover the joint PMF without further assumptions.
It is clear how to stack the bars in Figure 7.2, but very unclear how to unstack the
bars after they have been stacked!
Another way to go from joint to marginal distributions is via the joint CDF. In that
case, we take a limit rather than a sum: the marginal CDF of X is
          FX (x) = P (X ≤ x) = lim P (X ≤ x, Y ≤ y) = lim FX,Y (x, y).
                                                y→∞                                                                                                 y→∞

However, as mentioned above it is usually easier to work with joint PMFs.
Now suppose that we observe the value of X and want to update our distribution
of Y to reflect this information. Instead of using the marginal PMF P (Y = y),
which does not take into account any information about X, we should use a PMF
that conditions on the event X = x, where x is the value we observed for X. This
naturally leads us to consider conditional PMFs.
Definition 7.1.4 (Conditional PMF). For discrete r.v.s X and Y , the conditional
PMF of Y given X = x is
                                                                                            P (X = x, Y = y)
                       P (Y = y|X = x) =                                                                     .
                                                                                               P (X = x)
This is viewed as a function of y for fixed x.


Joint distributions                                                                                                                                                  307

Note that the conditional PMF (for fixed x) is a valid PMF. So we can define the
conditional expectation of Y given X = x, denoted by E(Y |X = x), in the same
way that we defined E(Y ) except that we replace the PMF of Y with the conditional
PMF of Y . Chapter 9 is devoted to conditional expectation.
Figure 7.3 illustrates the definition of conditional PMF. To condition on the event
X = x, we first take the joint PMF and focus in on the vertical bars where X takes
on the value x; in the figure, these are shown in bold. All of the other vertical bars are
irrelevant because they are inconsistent with the knowledge that X = x occurred.
Since the total height of the bold bars is the marginal probability P (X = x),
we then renormalize the conditional PMF by dividing by P (X = x); this ensures
that the conditional PMF will sum to 1. Therefore conditional PMFs are PMFs,
just as conditional probabilities are probabilities. Notice that there is a different
conditional PMF of Y for every possible value of X; Figure 7.3 highlights just one
of these conditional PMFs.


                                                              ●




                                                      ●                       ●
                                                                                                                                                     ●
                                                  ●                       ●
                                                                  ●

                                          ●
                                                                                              ●

                                                          ●                                                                                      ●       ●
                                              ●
                                                          ●                       ●           ●
                                                                          ●
                                  ●                           ●       ●
                                                  ●                                   ●
                                      ●                                                           ●       ●
                             ●●       ●                                                                       ●
                                                                                          ●
                 ●   ●                                                                                    ●           ●
         ●
                                              ●                       ●
                                                                                                                  ●
                                                                                                                          ●
             ●
                 ●                                                                                                             ●             ●               ●
                         ●                                                                                                ●
                                                                                                                  ●
                                                      ●                                               ●
                                                                                                                                    ze




                                  ●
                                                                                  ●
                                                                                                                                   ali




                                          ●
                                                                  ●                                                                      ●                       ●
                                                                                                                               m




                                                                      X=x
                                                                                                                              or




                                                  ●
                                                                                                                              ren




FIGURE 7.3
Conditional PMF of Y given X = x. The conditional PMF P (Y = y|X = x) is
obtained by renormalizing the column of the joint PMF that is compatible with the
event X = x.

We can also relate the conditional distribution of Y given X = x to that of X given
Y = y, using Bayes’ rule:

                                                                                                                          P (X = x|Y = y)P (Y = y)
                                      P (Y = y|X = x) =                                                                                            .
                                                                                                                                 P (X = x)

And using LOTP, we have another way of getting the marginal PMF: the marginal
PMF of X is a weighted average of the conditional PMFs P (X = x|Y = y), where
the weights are the probabilities P (Y = y):
                                                                                                          X
                                              P (X = x) =                                                             P (X = x|Y = y)P (Y = y).
                                                                                                              y


308                                                                Introduction to Probability

Let’s work through a numerical example to complement the graphs we’ve been
looking at.
Example 7.1.5 (2 × 2 table). The simplest example of a discrete joint distribution
is when X and Y are both Bernoulli r.v.s. In this case, the joint PMF is fully
specified by the four values P (X = 1, Y = 1), P (X = 0, Y = 1), P (X = 1, Y = 0),
and P (X = 0, Y = 0), so we can represent the joint PMF of X and Y using a 2 × 2
table.
This very simple scenario actually has an important place in statistics, as these so-
called contingency tables are often used to study whether a treatment is associated
with a particular outcome. In such scenarios, X may be the indicator of receiving
the treatment, and Y may be the indicator of the outcome of interest.
For example, suppose we randomly sample an adult male from the United States
population. Let X be the indicator of the sampled individual being a current smoker,
and let Y be the indicator of his developing lung cancer at some point in his life.
Suppose the joint PMF is as follows (these numbers are for illustrative purposes;
they are not estimated from real data).

                                       Y =1 Y =0
                                            5          20
                              X=1          100         100
                                            3          72
                              X=0          100         100


To get the marginal probability P (Y = 1), we add the probabilities in the two cells
of the table where Y = 1. We do the same for P (Y = 0), P (X = 1), and P (X = 0)
and write these probabilities in the margins of the table (making “marginal” an
appropriate name!).

                                   Y = 1 Y = 0 Total
                                      5          20          25
                          X=1        100         100         100
                                      3          72          75
                          X=0        100         100         100

                                      8          92          100
                          Total      100         100         100


This shows that the marginal distribution of X is Bern(0.25) and the marginal
distribution of Y is Bern(0.08). In words, the unconditional probability that the
individual is a current smoker is 0.25, and the unconditional probability of his
developing lung cancer is 0.08.
Now suppose we observe X = 1, i.e., the individual is a current smoker. We can
then update our beliefs about his risk for lung cancer.
                                   P (X = 1, Y = 1)   5/100
              P (Y = 1|X = 1) =                     =        = 0.2,
                                      P (X = 1)       25/100


Joint distributions                                                               309

so the conditional distribution of Y given X = 1 is Bern(0.2). By a similar calcula-
tion, the conditional distribution of Y given X = 0 is Bern(0.04). This tells us that
the probability of developing lung cancer is 0.2 for current smokers but only 0.04
for non-smokers.                                                                   
h 7.1.6. The word “marginal” has opposite meanings in economics and statistics.
In economics it refers to a derivative, e.g., marginal revenue is the derivative of
revenue with respect to quantity sold. In statistics it refers to an integral or sum,
which can be thought of intuitively by writing totals in the margins of a table, as
in the above example.
Armed with an understanding of joint, marginal, and conditional distributions, we
can revisit the definition of independence that we introduced in Chapter 3.
Definition 7.1.7 (Independence of discrete r.v.s). Random variables X and Y are
independent if for all x and y,
                              FX,Y (x, y) = FX (x)FY (y).
If X and Y are discrete, this is equivalent to the condition
                       P (X = x, Y = y) = P (X = x)P (Y = y)
for all x, y, and it is also equivalent to the condition
                            P (Y = y|X = x) = P (Y = y)
for all x, y such that P (X = x) > 0.
Using the terminology from this chapter, the definition says that for independent
r.v.s, the joint CDF factors into the product of the marginal CDFs, or that the joint
PMF factors into the product of the marginal PMFs. Remember that in general, the
marginal distributions do not determine the joint distribution: this is the reason why
we wanted to study joint distributions in the first place! But in the special case of
independence, the marginal distributions are all we need in order to specify the joint
distribution; we can get the joint PMF by multiplying the marginal PMFs.
Another way of looking at independence is that all the conditional PMFs are the
same as the marginal PMF. That is, starting with the marginal PMF of Y , no
updating is necessary when we condition on X = x, regardless of what x is.
Example 7.1.8 (Independence in the 2 × 2 table). Returning to the table from the
previous example, we can use these two views of independence to see why X and Y
are not independent.

                                    Y = 1 Y = 0 Total
                                         5     20          25
                           X=1          100    100         100
                                         3     72          75
                           X=0          100    100         100

                                         8     92          100
                            Total       100    100         100


310                                                          Introduction to Probability

First, the joint PMF is not the product of the marginal PMFs. For example,

                      P (X = 1, Y = 1) 6= P (X = 1)P (Y = 1).

Finding even one pair of values x and y such that

                      P (X = x, Y = y) 6= P (X = x)P (Y = y)

is enough to rule out independence.
Second, we found that the marginal distribution of Y is Bern(0.08), whereas the
conditional distribution of Y given X = 1 is Bern(0.2) and the conditional distri-
bution of Y given X = 0 is Bern(0.04). Since conditioning on the value of X alters
the distribution of Y , X and Y are not independent: learning whether or not the
sampled individual is a current smoker gives us information about the probability
that he will develop lung cancer.
Although we have found that X and Y are dependent, we cannot make conclusions
about whether smoking causes lung cancer based on this association alone. As we
learned from Simpson’s paradox, misleading associations can arise when we fail to
account for confounding variables.                                             
We’ll do one more example of a discrete joint distribution to round out this section.
We’ve named it the chicken-egg story; in it, we use wishful thinking to find a joint
PMF, and our efforts land us a surprising independence result.
Story 7.1.9 (Chicken-egg). Suppose a chicken lays a random number of eggs, N ,
where N ∼ Pois(λ). Each egg independently hatches with probability p and fails to
hatch with probability q = 1 − p. Let X be the number of eggs that hatch and Y
the number that do not hatch, so X + Y = N . What is the joint PMF of X and Y ?
Solution:
We seek the joint PMF P (X = i, Y = j) for nonnegative integers i and j. Con-
ditional on the total number of eggs N , the eggs are independent Bernoulli trials
with probability of success p, so by the story of the Binomial, the conditional dis-
tributions of X and Y are X|N = n ∼ Bin(n, p) and Y |N = n ∼ Bin(n, q). Since
our lives would be easier if only we knew the total number of eggs, let’s use wishful
thinking: condition on N and apply the law of total probability. This gives
                                  ∞
                                  X
             P (X = i, Y = j) =         P (X = i, Y = j|N = n)P (N = n).
                                  n=0

The sum is over all possible values of n, holding i and j fixed. But unless n = i + j,
it is impossible for X to equal i and Y to equal j. For example, the only way there
can be 5 hatched eggs and 6 unhatched eggs is if there are 11 eggs in total. So

                            P (X = i, Y = j|N = n) = 0


Joint distributions                                                              311

unless n = i + j, which means all other terms in the sum can be dropped:

            P (X = i, Y = j) = P (X = i, Y = j|N = i + j)P (N = i + j).

Conditional on N = i + j, the events X = i and Y = j are exactly the same event,
so keeping both is redundant. We’ll keep X = i; the rest is a matter of plugging
in the Binomial PMF to get P (X = i|N = i + j) and the Poisson PMF to get
P (N = i + j). Thus,

                 P (X = i, Y = j) = P (X = i|N = i + j)P (N = i + j)
                                          
                                      i + j i j e−λ λi+j
                                  =          pq ·
                                        i         (i + j)!
                                     e−λp (λp)i e−λq (λq)j
                                 =             ·           .
                                         i!         j!

The joint PMF factors into the product of the Pois(λp) PMF (as a function of i)
and the Pois(λq) PMF (as a function of j). This tells us two elegant facts: (1) X and
Y are independent, since their joint PMF is the product of their marginal PMFs,
and (2) X ∼ Pois(λp) and Y ∼ Pois(λq).

At first it may seem deeply counterintuitive that X is independent of Y . Doesn’t
knowing that a lot of eggs hatched mean that there are probably not so many that
didn’t hatch? For a fixed number of eggs, this independence would be impossible:
knowing the number of hatched eggs would perfectly determine the number of un-
hatched eggs. But in this example, the number of eggs is random, following a Poisson
distribution, and this happens to be the right kind of randomness to make X and
Y unconditionally independent. This is a very special property of the Poisson. 

The chicken-egg story supplements the following result from Chapter 4:

Theorem 7.1.10. If X ∼ Pois(λp), Y ∼ Pois(λq), and X and Y are independent,
then N = X + Y ∼ Pois(λ) and X|N = n ∼ Bin(n, p).

By the chicken-egg story, we now have the converse to this theorem.

Theorem 7.1.11. If N ∼ Pois(λ) and X|N = n ∼ Bin(n, p), then X ∼ Pois(λp),
Y = N − X ∼ Pois(λq), and X and Y are independent.

h 7.1.12. In the chicken-egg story, it is not valid to say “P (X = x|N = n) =
P (X = x|X + Y = n) = P (X = x|Y = n − x)”, since in P (X = x|N = n) we
are not conditioning on X = x. Indeed, P (X = x|N = n) is the Bin(n, p) PMF,
whereas P (X = x|Y = n − x) = P (X = x) is the Pois(λp) PMF. This blunder of
plugging in x for X on the right side of the conditioning bar illustrates how crucial
it is to carefully distinguish between X and x, and between the left side and the
right side of the conditioning bar.


312                                                               Introduction to Probability

7.1.2   Continuous

Once we have a handle on discrete joint distributions, it isn’t much harder to con-
sider continuous joint distributions. We simply make the now-familiar substitutions
of integrals for sums and PDFs for PMFs, remembering that the probability of any
individual point is now 0.
Formally, in order for X and Y to have a continuous joint distribution, we require
that the joint CDF
                          FX,Y (x, y) = P (X ≤ x, Y ≤ y)
be differentiable with respect to x and y. The partial derivative with respect to x
and y is called the joint PDF. The joint PDF determines the joint distribution, as
does the joint CDF.
Definition 7.1.13 (Joint PDF). If X and Y are continuous with joint CDF FX,Y ,
their joint PDF is the derivative of the joint CDF with respect to x and y:

                                            ∂2
                           fX,Y (x, y) =        FX,Y (x, y).
                                           ∂x∂y

We require valid joint PDFs to be nonnegative and integrate to 1:
                                     Z ∞Z ∞
                fX,Y (x, y) ≥ 0, and         fX,Y (x, y)dxdy = 1.
                                       −∞       −∞

In the univariate case, the PDF was the function we integrated to get the probability
of an interval. Similarly, the joint PDF of two r.v.s is the function we integrate to
get the probability of a two-dimensional region. For example,
                                           Z 4Z 3
                  P (X < 3, 1 < Y < 4) =            fX,Y (x, y)dxdy.
                                                1     −∞

For a general region A ⊆ R2 ,
                                           ZZ
                       P ((X, Y ) ∈ A) =            fX,Y (x, y)dxdy.
                                            A


Figure 7.4 shows a sketch of what a joint PDF of two r.v.s could look like. As
usual with continuous r.v.s, we need to keep in mind that the height of the surface
fX,Y (x, y) at a single point does not represent a probability. The probability of any
specific point in the plane is 0. Now that we’ve gone up a dimension, the proba-
bility of any line or curve in the plane is also 0. The only way we can get nonzero
probability is by integrating over a region of positive area in the xy-plane.
When we integrate the joint PDF over a region A, we are calculating the volume
under the surface of the joint PDF and above A. Thus, probability is represented by
volume under the joint PDF. The total volume under a valid joint PDF is 1.


Joint distributions                                                                  313

                                fX,Y (x,y)




                         y


                                                        x


FIGURE 7.4
Joint PDF of continuous r.v.s X and Y .

In the discrete case, we get the marginal PMF of X by summing over all possible
values of Y in the joint PMF. In the continuous case, we get the marginal PDF of
X by integrating over all possible values of Y in the joint PDF.
Definition 7.1.14 (Marginal PDF). For continuous r.v.s X and Y with joint PDF
fX,Y , the marginal PDF of X is
                                    Z ∞
                           fX (x) =     fX,Y (x, y)dy.
                                             −∞

This is the PDF of X, viewing X individually rather than jointly with Y .
To simplify notation, we have mainly been looking at the joint distribution of two
r.v.s rather than n r.v.s, but marginalization works analogously with any number
of variables. For example, if we have the joint PDF of X, Y, Z, W but want the joint
PDF of X, W , we just have to integrate over all possible values of Y and Z:
                                 Z ∞Z ∞
                   fX,W (x, w) =           fX,Y,Z,W (x, y, z, w)dydz.
                                   −∞        −∞

Conceptually this is easy—just integrate over the unwanted variables to get the joint
PDF of the wanted variables—but computing it may or may not be easy.
Returning to the case of the joint distribution of two r.v.s X and Y , let’s consider
how to update our distribution for Y after observing the value of X, using the
conditional PDF.
Definition 7.1.15 (Conditional PDF). For continuous r.v.s X and Y with joint
PDF fX,Y , the conditional PDF of Y given X = x is
                                                  fX,Y (x, y)
                               fY |X (y|x) =                  ,
                                                    fX (x)
for all x with fX (x) > 0. This is considered as a function of y for fixed x. As a
convention, in order to make fY |X (y|x) well-defined for all real x, let fY |X (y|x) = 0
for all x with fX (x) = 0.


314                                                           Introduction to Probability

Notation 7.1.16. The subscripts that we place on all the f ’s are just to remind
us that we have three different functions on our plate. We could just as well write
g(y|x) = f (x, y)/h(x), where f is the joint PDF, h is the marginal PDF of X, and
g is the conditional PDF of Y given X = x, but that makes it more difficult to
remember which letter stands for which function.
Figure 7.5 illustrates the definition of conditional PDF. We take a vertical slice of
the joint PDF corresponding to the observed value of X. Since the total area under
this slice is fX (x), we then divide by fX (x) to ensure that the conditional PDF will
have an area of 1. So the conditional PDF of Y given X = x satisfies the properties
of a valid PDF, for any x in the support of X.




                                                  ze
                                             mali
                                          or
                       X=x             ren



FIGURE 7.5
Conditional PDF of Y given X = x. The conditional PDF fY |X (y|x) is obtained by
renormalizing the slice of the joint PDF at the fixed value x.

h 7.1.17. How can we speak of conditioning on X = x for X a continuous r.v.,
considering that this event has probability 0? Rigorously speaking, we are actually
conditioning on the event that X falls within a small interval containing x, say
X ∈ (x − , x + ), and then taking a limit as  approaches 0 from the right. We will
not fuss over this technicality; fortunately, many important results such as Bayes’
rule work in the continuous case exactly as one would hope.
Note that we can recover the joint PDF fX,Y if we have the conditional PDF fY |X
and the corresponding marginal fX :

                           fX,Y (x, y) = fY |X (y|x)fX (x).

Similarly, we can recover the joint PDF if we have fX|Y and fY :

                           fX,Y (x, y) = fX|Y (x|y)fY (y).

This allows us to develop continuous versions of Bayes’ rule and LOTP. The con-
tinuous versions are analogous to the discrete versions, with probability density
functions in place of probabilities and integrals in place of sums.


Joint distributions                                                              315

Theorem 7.1.18 (Continuous form of Bayes’ rule and LOTP). For continuous r.v.s
X and Y , we have the following continuous form of Bayes’ rule:
                                       fX|Y (x|y)fY (y)
                       fY |X (y|x) =                    , for fX (x) > 0.
                                            fX (x)
And we have the following continuous form of the law of total probability:
                                 Z ∞
                        fX (x) =      fX|Y (x|y)fY (y)dy.
                                            −∞

Proof. By definition of conditional PDFs, we have

                      fY |X (y|x)fX (x) = fX,Y (x, y) = fX|Y (x|y)fY (y).

The continuous version of Bayes’ rule follows immediately from dividing by fX (x).
The continuous version of LOTP follows immediately from integrating with respect
to y:                  Z                    Z
                               ∞                      ∞
                 fX (x) =          fX,Y (x, y)dy =        fX|Y (x|y)fY (y)dy.      
                              −∞                     −∞

Out of curiosity, let’s see what would have happened if we had plugged in the other
expression for fX,Y (x, y) instead in the proof of LOTP:
           Z ∞                   Z ∞                               Z ∞
  fX (x) =      fX,Y (x, y)dy =       fY |X (y|x)fX (x)dy = fX (x)     fY |X (y|x)dy.
             −∞                        −∞                                   −∞

This just says that, for any x with fX (x) > 0,
                               Z ∞
                                    fY |X (y|x)dy = 1,
                                       −∞

confirming the fact that conditional PDFs must integrate to 1.
We now have versions of Bayes’ rule and LOTP for two discrete r.v.s and for two con-
tinuous r.v.s. Better yet, there are also versions when we have one discrete r.v. and
one continuous r.v. After understanding the discrete versions, it is easy to remem-
ber and use the other versions since they are analogous, replacing probabilities by
PDFs when appropriate. For example, for X discrete and Y continuous, we have
the following version of LOTP:
                                   Z ∞
                     P (X = x) =        P (X = x|Y = y)fY (y)dy.
                                         −∞

Taking X to be the indicator r.v. of an event A and x = 1, we have an expression
for a general probability P (A) based on conditioning on a continuous r.v. Y :
                                  Z ∞
                         P (A) =      P (A|Y = y)fY (y)dy.
                                         −∞


316                                                                        Introduction to Probability

Here are the four versions of Bayes’ rule, summarized in a table.

                                     Y discrete                             Y continuous

   X discrete      P (Y = y|X = x) = P (X=x|Y =y)P (Y =y)
                                          P (X=x)
                                                                fY (y|X = x) = P (X=x|Y =y)fY (y)
                                                                                    P (X=x)

                                                                                     fX|Y (x|y)fY (y)
   X continuous      P (Y = y|X = x) = fX (x|Yf=y)P
                                               X (x)
                                                     (Y =y)
                                                                     fY |X (y|x) =       fX (x)




And here are the four versions of LOTP, summarized in a table. The top row gives
expressions for P (X = x), while the bottom row gives expressions for fX (x).

                                      Y discrete                        Y continuous

                          P                                   R∞
        X discrete             P (X = x|Y = y)P (Y = y)        −∞
                                                                    P (X = x|Y = y)fY (y)dy
                           y
                               P                                   R∞
        X continuous               fX (x|Y = y)P (Y = y)            −∞
                                                                         fX|Y (x|y)fY (y)dy
                               y



Finally, let’s discuss the definition of independence for continuous r.v.s; then we’ll
turn to concrete examples. As in the discrete case, we can view independence of
continuous r.v.s in two ways. One is that the joint CDF factors into the product
of the marginal CDFs, or the joint PDF factors into the product of the marginal
PDFs. The other is that the conditional PDF of Y given X = x is the same as the
marginal PDF of Y , so conditioning on X provides no information about Y .
Definition 7.1.19 (Independence of continuous r.v.s). Random variables X and
Y are independent if for all x and y,

                                    FX,Y (x, y) = FX (x)FY (y).

If X and Y are continuous with joint PDF fX,Y , this is equivalent to the condition

                                     fX,Y (x, y) = fX (x)fY (y)

for all x, y, and it is also equivalent to the condition

                                        fY |X (y|x) = fY (y)

for all x, y such that fX (x) > 0.
h 7.1.20. The marginal PDF of Y , fY (y), is a function of y only; it cannot depend
on x in any way. The conditional PDF fY |X (y|x) can depend on x in general. Only
in the special case of independence is fY |X (y|x) free of x.
Sometimes we have a joint PDF for X and Y that factors as a function of x times a
function of y, without knowing in advance whether these functions are the marginal
PDFs, or even whether they are valid PDFs. The next result addresses this situa-
tion.
```
