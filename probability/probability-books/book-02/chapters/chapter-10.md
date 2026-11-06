# Chapter 10: Inequalities and Limit Theorems

**Book:** Introduction to Probability, Second Edition  
**Authors:** Joseph K. Blitzstein and Jessica Hwang  
**Printed pages:** 453–498

> Source transcription from the supplied textbook PDF. Text extraction preserves the original order and page content as far as the PDF text layer allows. Check mathematical notation and figure references against the source where extraction is ambiguous.

```text
Inequalities and limit theorems                                                     467

 where the minimum occurs and it means we just have to minimize a quadratic
 polynomial). Plugging in t = 3, we have

                              P (|Z| > 3) ≤ 2e−9/2 ≈ 0.022.

All of these upper bounds are correct, but Chernoff’s bound is the best by far. This
example also illustrates the distinction between a bound and an approximation, as
we explained in the introduction to this chapter. Markov’s inequality tells us that
the tail probability P (|Z| > 3) is at most 0.27, but it would be a blunder to say
that P (|Z| > 3) is approximately 0.27—we’d be off by a factor of about 100.      




10.2    Law of large numbers

We turn next to two theorems, the law of large numbers and the central limit theo-
rem, which describe the behavior of the sample mean of i.i.d. r.v.s as the sample size
grows. Throughout this section and the next, assume we have i.i.d. X1 , X2 , X3 , . . .
with finite mean µ and finite variance σ 2 . For all positive integers n, let

                                          X1 + · · · + Xn
                                  X̄n =
                                                n
be the sample mean of X1 through Xn . The sample mean is itself an r.v., with mean
µ and variance σ 2 /n:

                1                        1
       E(X̄n ) =  E(X1 + · · · + Xn ) = (E(X1 ) + · · · + E(Xn )) = µ,
                n                        n
                 1                         1                                 σ2
     Var(X̄n ) = 2 Var(X1 + · · · + Xn ) = 2 (Var(X1 ) + · · · + Var(Xn )) =    .
                n                          n                                 n

The law of large numbers (LLN) says that as n grows, the sample mean X̄n con-
verges to the true mean µ (in a sense that is explained below). The LLN comes in
two versions, “strong” (SLLN) and “weak” (WLLN), which use slightly different
definitions of what it means for a sequence of r.v.s to converge to a number. We will
state both versions, and prove the second using Chebyshev’s inequality.
Theorem 10.2.1 (Strong law of large numbers). The sample mean X̄n converges
to the true mean µ pointwise, with probability 1. Recalling that r.v.s are functions
from the sample space S to R, this form of convergence says that X̄n (s) → µ for
each point s ∈ S, except that the convergence is allowed to fail on some set B0 of
exceptions, as long as P (B0 ) = 0. In short, P (X̄n → µ) = 1.
Theorem 10.2.2 (Weak law of large numbers). For all  > 0, P (|X̄n − µ| > ) → 0
as n → ∞. (This form of convergence is called convergence in probability.)


468                                                                                         Introduction to Probability

Proof. Fix  > 0. By Chebyshev’s inequality,

                                                                                  σ2
                                                          P (|X̄n − µ| > ) ≤         .
                                                                                  n2
As n → ∞, the right-hand side goes to 0, and so must the left-hand side.                                            

The law of large numbers is essential for simulations, statistics, and science. Consider
generating “data” from a large number of independent replications of an experiment,
performed either by computer simulation or in the real world. Every time we use
the average value in the replications of some quantity to approximate its theoretical
average, we are implicitly appealing to the LLN.
Example 10.2.3 (Running proportion of Heads). Let X1 , X2 , . . . be i.i.d. Bern(1/2).
Interpreting the Xj as indicators of Heads in a string of fair coin tosses, X̄n is the
proportion of Heads after n tosses. The SLLN says that with probability 1, when
the sequence of r.v.s X̄1 , X̄2 , X̄3 , . . . crystallizes into a sequence of numbers, the se-
quence of numbers will converge to 1/2. Mathematically, there are bizarre outcomes
such as HHHHHH . . . and HHTHHTHHTHHT . . . , but collectively they have zero
probability of occurring. The WLLN says that for any  > 0, the probability of X̄n
being more than  away from 1/2 can be made as small as we like by letting n grow.
As an illustration, we simulated six sequences of fair coin tosses and, for each se-
quence, computed X̄n as a function of n. Of course, in real life we cannot simulate
infinitely many coin tosses, so we stopped after 300 tosses. Figure 10.2 plots X̄n as
a function of n for each sequence.
                                           1.0
             running proportion of Heads
                                           0.8
                                           0.6
                                           0.4
                                           0.2
                                           0.0




                                                 0   50      100         150          200   250      300
                                                                   number of tosses


FIGURE 10.2
Running proportion of Heads in 6 sequences of fair coin tosses. Dashed lines at 0.6
and 0.4 are plotted for reference. As the number of tosses increases, the proportion
of Heads approaches 1/2.

At the beginning, we can see that there is quite a bit of fluctuation in the running


Inequalities and limit theorems                                                     469

proportion of Heads. As the number of coin tosses increases, however, Var(X̄n ) gets
smaller and smaller, and X̄n approaches 1/2.                                      

h 10.2.4 (LLN does not contradict the fact that a coin is memoryless). In the above
example, the law of large numbers states that the proportion of Heads converges to
1/2, but this does not imply that after a long string of Heads, the coin is “due” for a
Tails to balance things out. Rather, the convergence takes place through swamping:
past tosses are swamped by the infinitely many tosses that are yet to come.

A sequence of i.i.d. Bernoullis is the simplest possible example of the LLN, but
this simple case forms the basis for extremely useful methods in statistics, as the
following examples illustrate.

Example 10.2.5 (Monte Carlo integration). Let f be a complicated function whose
         Rb
integral a f (x)dx we want to approximate. Assume that 0 ≤ f (x) ≤ c so that we
know
   R b the integral is finite. On the surface, this problem doesn’t involve probability,
as a f (x)dx is just a number. But where there is no randomness, we can create
our own! The technique of Monte Carlo integration uses random samples to obtain
approximations of definite integrals when exact integration methods are unavailable.

Let A be the rectangle in the (x, y)-plane given by a ≤ x ≤ b and 0 ≤ y ≤ c. Let
B be the region under the curve y = f (x) (and above the x-axis) for a ≤ x ≤ b,
so the desired integral is the area of region B. Our strategy will be to take random
samples from A, then calculate the proportion of the samples that also fall into the
area B. This is depicted in Figure 10.3: points in B are in black, and points not in
B are in white.


                       c




                                                                 f(x)




                       0
                           a                                 b

FIGURE 10.3
Monte Carlo integration. To approximate the area under f (x) from x = a to x = b,
generate random points in the rectangle [a, b] × [0, c], and approximate the area
under f (x) by the proportion of points falling underneath the curve, multiplied by
the total area of the rectangle.


470                                                                         Introduction to Probability

To see why this works, suppose we pick i.i.d. points (X1 , Y1 ), (X2 , Y2 ), . . . , (Xn , Yn )
uniformly in the rectangle A. Define indicator r.v.s I1 , . . . , In by letting Ij = 1 if
(Xj , Yj ) is in B and Ij = 0 otherwise. Then the Ij are Bernoulli r.v.s whose success
probability is precisely the ratio of the area of B to the area of A. Letting p = E(Ij ),
                                                            Rb
                                                                a f (x)dx
                          p = E(Ij ) = P (Ij = 1) =                         .
                                                                c(b − a)
                               Pn
We can estimate p using n1          j=1 Ij , and then estimate the desired integral by

                              Z b                                n
                                                           1X
                                    f (x)dx ≈ c(b − a)        Ij .
                               a                           n
                                                                j=1

Since the Ij are i.i.d. with mean p, it follows from the law of large numbers that
with probability 1, the estimate converges to the true value of the integral as the
number of points approaches infinity.                                            
Example 10.2.6 (Convergence of empirical CDF). Let X1 , . . . , Xn be i.i.d. random
variables with CDF F . For every number x, let Rn (x) count how many of X1 , . . . , Xn
are less than or equal to x; that is,
                                               n
                                               X
                                    Rn (x) =         I(Xj ≤ x).
                                               j=1

Since the indicators I(Xj ≤ x) are i.i.d. with probability of success F (x), we know
Rn (x) is Binomial with parameters n and F (x).
The empirical CDF of X1 , . . . , Xn is defined as

                                                     Rn (x)
                                       F̂n (x) =            ,
                                                       n

considered as a function of x. Before we observe X1 , . . . , Xn , F̂n (x) is a random
variable for each x. After we observe X1 , . . . , Xn , F̂n (x) crystallizes into a particular
value at each x, so F̂n crystallizes into a particular CDF, which can be used to
estimate the true CDF F if the latter is unknown.
For example, suppose n = 4 and we observe X1 = x1 , X2 = x2 , X3 = x3 , X4 = x4 .
Then the graph of R44(x) starts at 0 and then jumps by 1/4 every time one of the xj ’s
is reached. In other words, R44(x) is the CDF of a discrete random variable taking
on values x1 , . . . , x4 , each with probability 1/4. This is illustrated in Figure 10.4.
Now we can ask, what happens to F̂n as n → ∞? This is a natural question if we
are using F̂n as an estimate of the true F ; does the approximation fare well in the
limit? The law of large numbers provides the answer: for every x, Rn (x) is the sum
of n i.i.d. Bern(p) r.v.s, where p = F (x). So by the SLLN, F̂n (x) → F (x) with
probability 1 as n → ∞.


Inequalities and limit theorems                                                    471




                            1




                                  x3   x4 x2     x1

FIGURE 10.4
Empirical CDF after observing X1 = x1 , X2 = x2 , X3 = x3 , X4 = x4 . The graph
jumps by 1/4 every time one of the xj ’s is reached.

The empirical CDF is commonly used in nonparametric statistics, a branch of
statistics that tries to understand a random sample without making strong as-
sumptions about the family of distributions from which it originated. For example,
instead of assuming X1 , . . . , Xn ∼ N (µ, σ 2 ), a nonparametric method would allow
X1 , . . . , Xn ∼ F for an arbitrary CDF F , then use the empirical CDF as an approx-
imation for F . The law of large numbers is what assures us that this approximation
is valid in the limit as we collect more and more samples: at every value of x, the
empirical CDF converges to the true CDF.                                            




10.3    Central limit theorem

As in the previous section, let X1 , X2 , X3 , . . . be i.i.d. with mean µ and variance
σ 2 . The law of large numbers says that as n → ∞, X̄n converges to the constant
µ (with probability 1). But what is its distribution along the way to becoming a
constant? This is addressed by the central limit theorem (CLT), which, as its name
suggests, is a limit theorem of central importance in statistics.
The CLT states that for large n, the distribution of X̄n after standardization ap-
proaches a standard Normal distribution. By standardization, we mean that we sub-
                                           √
tract µ, the mean of X̄n , and divide by σ/ n, the standard deviation of X̄n .
Theorem 10.3.1 (Central limit theorem). As n → ∞,
                              
                 √     X̄n − µ
                   n             → N (0, 1) in distribution.
                          σ


472                                                              Introduction to Probability

In words, this means that the CDF of the left-hand side converges to Φ, the CDF
of the standard Normal distribution.

Proof. We will prove the CLT assuming that the MGF of the Xj exists, though
the theorem holds much more generally. Let M (t) = E(etXj ), and without loss of
generality let µ = 0, σ 2 = 1 (since we end up standardizing X̄n for the theorem, we
might as well standardize the Xj in the first place). Then M (0) = 1, M 0 (0) = µ = 0,
and M 00 (0) = σ 2 = 1.
                                      √                          √
We wish to show that the MGF of nX̄n = (X1 + · · · + Xn )/ n converges to the
                                                  2
MGF of the N (0, 1) distribution, which is et /2 . This is a valid strategy because
of a theorem that says that if Z1 , Z2 , . . . are r.v.s whose MGFs converge to the
MGF of a continuous r.v. Z, then the CDF of Zn converges to the CDF of Z. (We
omit the proof of this result since it requires some difficult analysis. But it should
at least seem plausible, in view of the fact that the MGF of an r.v. determines its
distribution.)
By properties of MGFs,
                                 √                √       √                √
            E(et(X1 +···+Xn )/ n ) = E(etX1 / n )E(etX2 / n ) . . . E(etXn / n )
                                              n
                                             t
                                   = M √            .
                                              n

Letting n → ∞, we get the indeterminate form 1∞ , so instead we should take the
limit of the logarithm, n log M ( √tn ), and then exponentiate at the end. This gives
                                
                            t               log M (yt)                      √
         lim n log M       √         = lim                      where y = 1/ n
         n→∞                 n         y→0      y2
                                             tM 0 (yt)
                                     = lim                    by L’Hôpital’s rule
                                       y→0 2yM (yt)
                                       t      M 0 (yt)
                                     = lim                      since M (yt) → 1
                                       2 y→0       y
                                       t2
                                     =    lim M 00 (yt)       by L’Hôpital’s rule
                                        2 y→0
                                       t2
                                     = .
                                        2
                  n           √                    2
Therefore M ( √tn ) , the MGF of nX̄n , approaches et /2 , the N (0, 1) MGF.             

The CLT is an asymptotic result, telling us about the limiting distribution of X̄n
as n → ∞, but it also suggests an approximation for the distribution of X̄n when n
is large but finite.
Approximation 10.3.2 (Central limit theorem, approximation form). For large
n, the distribution of X̄n is approximately N (µ, σ 2 /n).


Inequalities and limit theorems                                                    473
                                           ·
Proof. Change the arrow in the CLT to ∼, an approximate distribution sign:
                                       
                           √     X̄n − µ ·
                             n            ∼ N (0, 1).
                                    σ

Then by a location-scale transformation,
                                      ·
                                  X̄n ∼ N (µ, σ 2 /n).                               

Of course, we already knew from properties of expectation and variance that X̄n
has mean µ and variance σ 2 /n; the central limit theorem gives us the additional
information that X̄n is approximately Normal with said mean and variance.
Let’s take a moment to admire the generality of this result. The distribution of the
individual Xj can be anything in the world, as long as the mean and variance are fi-
nite. We could have a discrete distribution like the Binomial, a bounded distribution
like the Beta, a skewed distribution like the Log-Normal, or a distribution with mul-
tiple peaks and valleys. No matter what, the act of averaging will cause Normality
to emerge. In Figure 10.5 we show histograms of the distribution of X̄n for 4 differ-
ent starting distributions and for n = 1, 5, 30, 100. As n increases, the distribution
of X̄n starts to look Normal, regardless of the distribution of the Xj .
This does not mean that the distribution of the Xj is irrelevant, however. If the Xj
have a highly skewed or multimodal distribution, we may need n to be very large
before the Normal approximation becomes accurate; at the other extreme, if the
Xj are already i.i.d. Normals, the distribution of X̄n is exactly N (µ, σ 2 /n) for all
n. Since there are no infinite datasets in the real world, the quality of the Normal
approximation for finite n is an important consideration.
Example 10.3.3 (Running proportion of Heads, revisited). As in Example 10.2.3,
let X1 , X2 , . . . be i.i.d. Bern(1/2). Before, we used the law of large numbers to
conclude that X̄n → 1/2 as n → ∞. Now, using the central limit theorem, we can
say more: E(X̄n ) = 1/2 and Var(X̄n ) = 1/(4n), so for large n,
                                                   
                                         ·     1 1
                                     X̄n ∼ N     ,    .
                                               2 4n

This additional information allows us to quantify what kind of deviation from the
mean is typical for a given n. For example, when n = 100, SD(X̄n ) = 1/20 = 0.05,
so if the Normal approximation is valid, then by the 68-95-99.7% rule there’s a 95%
chance that X̄n will be in the interval [0.40, 0.60].                             
The CLT says that the sample mean X̄n is approximately Normal, but since the
sum Wn = X1 + · · · + Xn = nX̄n is just a scaled version of X̄n , the CLT also implies
Wn is approximately Normal. If the Xj have mean µ and variance σ 2 , Wn has mean
nµ and variance nσ 2 . The CLT then states that for large n,
                                      ·
                                  Wn ∼ N (nµ, nσ 2 ).


474                                                                                                          Introduction to Probability




                            n=1                                      n=5                         n = 30                        n = 100



 Bin(10, 0.9)

                  5     6   7       8        9    10       7.5       8.5       9.5       8.0   8.5   9.0   9.5   10.0   8.6      9.0      9.4




      Pois(2)

                  0     2       4       6         8    0         1         2   3     4   1.0   1.5   2.0   2.5   3.0    1.6      2.0      2.4




      Expo(1)

                  0     2   4       6       8     10   0         1         2   3     4   0.0   0.5   1.0   1.5   2.0    0.6      1.0      1.4




 Beta(0.8, 0.8)

                  0.0       0.4             0.8        0.0           0.4       0.8        0.3 0.4 0.5 0.6 0.7           0.40     0.50    0.60




FIGURE 10.5
Central limit theorem. Histograms of the distribution of X̄n for different starting
distributions of the Xj (indicated by the rows) and increasing values of n (indicated
by the columns). Each histogram is based on 10,000 simulated values of X̄n . Re-
gardless of the starting distribution of the Xj , the distribution of X̄n approaches a
Normal distribution as n grows.


Inequalities and limit theorems                                                    475

This is completely equivalent to the approximation for X̄n , but it can be useful to
write it in this form because many of the named distributions we have studied can
be considered as a sum of i.i.d. r.v.s. Here are three quick examples.
Example 10.3.4 (Poisson convergence to Normal). Let Y ∼ Pois(n). By Theorem
4.8.1, we can consider Y to be a sum of n i.i.d. Pois(1) r.v.s. Therefore, for large n,
                                        ·
                                     Y ∼ N (n, n).                                   
Example 10.3.5 (Gamma convergence to Normal). Let Y ∼ Gamma(n, λ). By
Theorem 8.4.3, we can consider Y to be a sum of n i.i.d. Expo(λ) r.v.s. Therefore,
for large n,                           n n 
                                  ·
                                Y ∼N      ,    .                                 
                                        λ λ2
Example 10.3.6 (Binomial convergence to Normal). Let Y ∼ Bin(n, p). By The-
orem 3.8.8, we can consider Y to be a sum of n i.i.d. Bern(p) r.v.s. Therefore, for
large n,
                                ·
                             Y ∼ N (np, np(1 − p)) .
This is probably the most widely used Normal approximation in statistics. To ac-
count for the discreteness of Y , we write the probability P (Y = k) (which would be
exactly 0 under the Normal approximation) as P (k − 1/2 < Y < k + 1/2) (so that
it becomes an interval of non-zero width) and apply the Normal approximation to
the latter. This is known as the continuity correction, and it yields the following
approximation for the PMF of Y :
                                                              !                   !
                                                k + 1/2 − np         k − 1/2 − np
P (Y = k) = P (k − 1/2 < Y < k + 1/2) ≈ Φ p                     −Φ p                .
                                                   np(1 − p)            np(1 − p)
The Normal approximation to the Binomial distribution is complementary to the
Poisson approximation discussed in Chapter 4. The Poisson approximation works
best when p is small, while the Normal approximation works best when n is large
and p is around 1/2, so that the distribution of Y is symmetric or nearly so. 
We’ll conclude with an example that uses both the LLN and the CLT.
Example 10.3.7 (Volatile stock). Each day, a very volatile stock rises 70% or drops
50% in price, with equal probabilities and with different days independent. Let Yn
be the stock price after n days, starting from an initial value of Y0 = 100.
(a) Explain why log Yn is approximately Normal for n large, and state its parameters.
(b) What happens to E(Yn ) as n → ∞?
(c) Use the law of large numbers to find out what happens to Yn as n → ∞.
Solution:
(a) We can write Yn = Y0 (0.5)n−Un (1.7)Un where Un ∼ Bin(n, 21 ) is the number of
times the stock rises in the first n days. This gives
                         log Yn = log Y0 − n log 2 + Un log 3.4,


476                                                          Introduction to Probability

which is a location-scale transformation of Un . By the CLT, Un is approximately
N ( n2 , n4 ) for large n, so log Yn is approximately Normal with mean

        E(log Yn ) = log 100 − n log 2 + (log 3.4) · E(Un ) ≈ log 100 − 0.081n

and variance
                    Var(log Yn ) = (log 3.4)2 · Var(Un ) ≈ 0.374n.

(b) We have E(Y1 ) = (170 + 50)/2 = 110. Similarly,
                                  1          1
                    E(Yn+1 |Yn ) = (1.7Yn ) + (0.5Yn ) = 1.1Yn ,
                                  2          2
so
                      E(Yn+1 ) = E(E(Yn+1 |Yn )) = 1.1E(Yn ).
Thus E(Yn ) = 1.1n E(Y0 ) = 100 · 1.1n , which goes to ∞ as n → ∞.
(c) As in (a), let Un ∼ Bin(n, 12 ) be the number of times the stock rises in the first
n days. Note that even though E(Yn ) → ∞, if the stock goes up 70% one day and
then drops 50% the next day, then overall it has dropped 15% since 1.7 · 0.5 = 0.85.
So after many days, Yn will be very small if about half the time the stock rose
70% and about half the time the stock dropped 50%—and the law of large numbers
ensures that this will be the case! Writing Yn in terms of Un /n in order to apply
the LLN, we have
                                                               n
                                  n−Un      Un       (3.4)Un /n
                    Yn = Y0 (0.5)      (1.7) = Y0                  .
                                                         2
                                                     √
Since Un /n → 0.5 with probability 1, (3.4)Un /n → 3.4 < 2 with probability 1, so
Yn → 0 with probability 1.
Paradoxically, E(Yn ) → ∞ but Yn → 0 with probability 1. To gain some intuition
for this result, consider the extreme example where a gambler starts with $100 and
each day either quadruples their money or loses their entire fortune, with equal
probabilities. Then on average the gambler’s wealth doubles each day, which sounds
good until one notices that eventually there will be a day when the gambler goes
broke. The gambler’s actual fortune goes to 0 with probability 1, whereas the ex-
pected value goes to infinity due to tiny probabilities of getting extremely large
amounts of money, as in the St. Petersburg paradox.                              
h 10.3.8 (The evil Cauchy). The central limit theorem requires that the mean
and variance of the Xj be finite, and our proof of the WLLN relied on the same
conditions. The Cauchy distribution introduced in Example 7.1.25 has no mean or
variance, so the Cauchy distribution obeys neither the law of large numbers nor
the central limit theorem. It can be shown that the sample mean of n Cauchys is
still Cauchy, no matter how large n gets. So the sample mean never approaches a
Normal distribution, contrary to the behavior seen in the CLT. There is also no
true mean for X̄n to converge to, so the LLN does not apply either.


Inequalities and limit theorems                                                      477




10.4     Chi-Square and Student-t

We’ll round out the chapter by introducing the last two continuous distributions in
this book, both of which are closely related to the Normal distribution.
Definition 10.4.1 (Chi-Square distribution). Let V = Z12 + · · · + Zn2 where
Z1 , Z2 , . . . , Zn are i.i.d. N (0, 1). Then V is said to have the Chi-Square distribu-
tion with n degrees of freedom. We write this as V ∼ χ2n .
As it turns out, the χ2n distribution is a special case of the Gamma.
Theorem 10.4.2. The χ2n distribution is the Gamma( n2 , 12 ) distribution.

Proof. First, we verify that the PDF of Z12 ∼ χ21 equals the PDF of the
Gamma( 12 , 12 ): for x > 0,
                               √        √       √        √        √
     F (x) = P (Z12 ≤ x) = P (− x ≤ Z1 ≤ x) = Φ( x) − Φ(− x) = 2Φ( x) − 1,

so
                             d            √ 1           1
                  f (x) =      F (x) = 2ϕ( x) x−1/2 = √     e−x/2 ,
                            dx               2          2πx
which is indeed the Gamma( 12 , 12 ) PDF. Then, because V = Z12 + · · · + Zn2 ∼ χ2n is
the sum of n independent Gamma( 12 , 12 ) r.v.s, we have V ∼ Gamma( n2 , 12 ).      

From our knowledge of the mean and variance of a Gamma distribution, we have
E(V ) = n and Var(V ) = 2n. We can also obtain the mean and variance using the
fact that V is the sum of i.i.d. squared Normals, along with the Normal moments
derived in Chapter 6:

              E(V ) = nE(Z12 ) = n,
                                                       
            Var(V ) = nVar(Z12 ) = n E(Z14 ) − (EZ12 )2 = n(3 − 1) = 2n.

To get the MGF of the Chi-Square distribution, just plug n/2 and 1/2 into
                                                                       the
                                                                                       a
                                                                                   λ
more general Gamma(a, λ) MGF, which we found in Theorem 8.4.3 to be               λ−t
for t < λ. This gives
                                                   n/2
                                             1
                            MV (t) =                       ,   t < 1/2.
                                           1 − 2t

The Chi-Square distribution is important in statistics because it is related to the
distribution of the sample variance, which can be used to estimate the true variance
of a distribution. When our random variables are i.i.d. Normals, the distribution of
the sample variance after appropriate scaling is Chi-Square.


478                                                                                    Introduction to Probability

Example 10.4.3 (Distribution of sample variance). For i.i.d. X1 , . . . , Xn ∼
N (µ, σ 2 ), the sample variance is the r.v.
                                                         n
                                                1 X
                                    Sn2 =          (Xj − X̄n )2 .
                                               n−1
                                                        j=1

Show that
                                           (n − 1)Sn2
                                                      ∼ χ2n−1 .
                                              σ2
Solution:
                      P
First let’s show that nj=1 (Zj − Z̄n )2 ∼ χ2n−1 for standard Normal r.v.s Z1 , . . . , Zn ;
this is consistent with the more general result we are asked to prove and also serves
as a useful stepping stone. Let’s start with the following useful identity, which is a
special case of the identity from the proof of Theorem 6.3.4:
                                   n
                                   X             n
                                                 X
                                         Zj2 =         (Zj − Z̄n )2 + nZ̄n2 .
                                   j=1           j=1

                                                    P
Now take the MGF of both sides. By Example 7.5.9, nj=1 (Zj − Z̄n )2 and nZ̄n2 are
independent, so the MGF of their sum is the product of the individual MGFs. Also,
                                    n
                                    X
                                          Zj2 ∼ χ2n and nZ̄n2 ∼ χ21 ,
                                    j=1

so                                                                        
                           n/2                       n
                                                       X                                       1/2
                     1                                                                   1
                                   = MGF of                           2
                                                             (Zj − Z̄n )       ·                       .
                   1 − 2t                                                              1 − 2t
                                                       j=1

This implies                                
                              n
                              X                                               (n−1)/2
                      MGF of               2                         1
                                (Zj − Z̄n )    =                                             ,
                                                                     1 − 2t
                                     j=1

which is the χ2n−1 MGF. Since the MGF determines the distribution, we have
                                         n
                                         X
                                               (Zj − Z̄n )2 ∼ χ2n−1 .
                                         j=1


For general X1 , . . . , Xn , use a location-scale
                                             P transformation to write Xj = µ + σZj
and X̄n = µ + σ Z̄n . When we express nj=1 (Xj − X̄n )2 in terms of the Zj , the µ
cancels and the σ comes out squared:
         n
         X                   n
                             X                                n
                                                              X
                             2                         2    2
               (Xj − X̄n ) =   (µ + σZj − (µ + σ Z̄n )) = σ     (Zj − Z̄n )2 .
         j=1                       j=1                                                 j=1


Inequalities and limit theorems                                                  479

All in all,
                             n                          n
          (n − 1)Sn2   1 X                1       X
               2
                     = 2   (Xj − X̄n )2 = 2 · σ 2   (Zj − Z̄n )2 ∼ χ2n−1 ,
             σ        σ                  σ
                            j=1                         j=1

which is what we wanted. This also implies that E(Sn2 ) = σ 2 , which agrees with
what we showed in Theorem 6.3.4: the sample variance is unbiased for estimating
the true variance.                                                             
The Student-t distribution is defined by representing it in terms of a standard
Normal r.v. and a χ2n r.v.
Definition 10.4.4 (Student-t distribution). Let
                                             Z
                                     T =p           ,
                                             V /n

where Z ∼ N (0, 1), V ∼ χ2n , and Z is independent of V . Then T is said to have
the Student-t distribution with n degrees of freedom. We write this as T ∼ tn . Often
“Student-t distribution” is abbreviated to “t distribution”.
The Student-t distribution was introduced in 1908 by William Gosset, a Master
Brewer at Guinness, while working on quality control for beer. He was required by
the company to publish his work under a pseudonym, and he chose the name Stu-
dent. The t distribution forms the basis for hypothesis testing procedures known as
t-tests, which are extremely widely used in practice (we do not introduce the details
of t-tests here since they are better left for a course on statistical inference).
The PDF of the Student-t distribution with n degrees of freedom looks similar to
that of a standard Normal, except with heavier tails (much heavier if n is small,
and not much heavier if n is large). The formula for the PDF is

                                Γ((n + 1)/2)
                       fT (t) = √            (1 + t2 /n)−(n+1)/2 ,
                                  nπΓ(n/2)
though we will not prove this since the derivation is messy and anyway many of the
most important properties of the Student-t distribution are easier to understand by
thinking about how we defined it in terms of a Normal and a χ2n r.v., rather than by
doing tedious calculations with the PDF. Here are some of these properties.
Theorem 10.4.5 (Student-t properties). The Student-t distribution tn has the
following properties.

        1. Symmetry: If T ∼ tn , then −T ∼ tn as well.
        2. Cauchy as special case: The t1 distribution is the same as the Cauchy
       distribution, introduced in Example 7.1.25.
        3. Convergence to Normal: As n → ∞, the tn distribution approaches the
       standard Normal distribution.


480                                                         Introduction to Probability

Proof. In the proof of each property, we appeal to Definition 10.4.4.

1. Express
                                            Z
                                    T =p           ,
                                            V /n
where Z ∼ N (0, 1), V ∼ χ2n , and Z is independent of V . Then
                                          −Z
                                    −T = p      ,
                                           V /n

where −Z ∼ N (0, 1), so −T ∼ tn .

2. Recall that the Cauchy distribution is defined as the distribution of X/Y where
                                                                              √
X and √        p N (0, 1). By definition, T ∼ t1 can be expressed as T = Z/ V ,
        Y are i.i.d.
where V = Z12 = |Z1 | with Z1 independent of Z. But by symmetry, Z/|Z1 |
has the same distribution as Z/Z1 , and Z/Z1 is Cauchy. Thus the t1 and Cauchy
distributions are the same.

3. This follows from the SLLN. Consider a sequence of i.i.d. standard Normal r.v.s
Z1 , Z2 , . . . , and let
                              Vn = Z12 + · · · + Zn2 .
By the SLLN, Vn /n → E(Z12 ) = 1 with probability 1. Now let Z ∼ N (0, 1) be
independent of all the Zj , and let
                                           Z
                                    Tn = p
                                          Vn /n

for all n. Then Tn ∼ tn by definition, and since the denominator converges to 1,
we have Tn → Z ∼ N (0, 1). Therefore, the distribution of the Tn approaches the
distribution of Z.                                                            

Figure 10.6 plots the Student-t PDF for various values of n, demonstrating all three
properties of the above theorem: the PDFs are all symmetric around 0, the PDF
for n = 1 looks like that of the Cauchy distribution, and as n → ∞ the heavy tails
become lighter, and the PDF approaches the standard Normal PDF.




10.5    Recap

Inequalities and limit theorems are two different ways to handle expectations and
probabilities that we don’t wish to calculate exactly. Inequalities allow us to obtain
lower and/or upper bounds on the unknown value: Cauchy-Schwarz and Jensen give
us bounds on expectations, while Markov, Chebyshev, and Chernoff give us bounds
on tail probabilities.


Inequalities and limit theorems                                                  481




               0.4
               0.3
            PDF
               0.2
               0.1
               0.0




                     −3      −2      −1       0          1   2       3
                                              x


FIGURE 10.6
PDFs of Student-t distribution with (light to dark) n = 1, 2, 3, 5, 10 degrees of
freedom, as well as the standard Normal PDF (black). As n → ∞, the Student-t
PDFs approach the standard Normal PDF.

Two limit theorems, the law of large numbers and the central limit theorem, de-
scribe the behavior of the sample mean X̄n of i.i.d. X1 , X2 , . . . with mean µ and
variance σ 2 . The SLLN says that as n → ∞, the sample mean X̄n converges to the
true mean µ with probability 1. The CLT says that the distribution of X̄n , after
standardization, converges to the standard Normal distribution:
                                         
                            √     X̄n − µ
                              n             → N (0, 1).
                                     σ

This can be translated into an approximation for the distribution of X̄n :
                                          ·
                                  X̄n ∼ N (µ, σ 2 /n).

Equivalently, we can say that the distribution of the sum Sn = X1 +· · ·+Xn = nX̄n ,
after standardization, converges to the standard Normal distribution:
                                  Sn − nµ
                                     √    → N (0, 1).
                                   σ n
Figure 10.7 illustrates the progression from a distribution to i.i.d. r.v.s with that
distribution, from which a sample mean can be formed and studied as an r.v. in
its own right. Chebyshev’s inequality, the LLN, and the CLT all give important
information about the behavior of the sample mean.
The Chi-Square and Student-t distributions are two important named distributions
in statistics. The Chi-Square is a special case of the Gamma. The Student-t has a
bell-shaped PDF with heavier tails than the Normal, and converges to the standard
Normal as the degrees of freedom increase.


482                                                                                                      Introduction to Probability


       1.0
       0.8




                                                                                         What can
       0.6
F(x)




                                                                                         happen?
       0.4
       0.2
       0.0




             -6    -4   -2   0   2   4   6

                             x




                   distributions                             random variables               events                               numbers
                                             generate
                                                                                                                                                 2
                      CDF F                                X1 , X2 , . . . , Xn i.i.d.                       P     P (|X̄n       µ| > ✏) 
                                                                                                                                             n✏2
                   PMF (discrete)
                                                                                         |X̄n   µ| > ✏
                                                        (E(Xi ) = µ, Var(Xi ) = 2 )
                                                                                                                               (Chebyshev)
                  PDF (continuous)
                                                                              n
                                                                         1X
                                                               X̄n =            Xi                               P (|X̄n       µ| > ✏) ! 0 as n ! 1
                       story                                             n i=1
                  name, parameters                                                                                          (law of large numbers)
                                                                                         a  X̄n  b     P
                       MGF

                                                                                                                      P (a  X̄n  b) ⇡
                                                                                                                 ✓p            ◆     ✓p                    ◆
                                                                                                                      n(b   µ)          n(a           µ)

                                                                                                                               for large n
                                                                                                                      (central limit theorem)


                                                                                                                               E(X̄n ) = µ
                                                                                                                                             2
                                                                                                                              Var(X̄n ) =        /n



FIGURE 10.7
The sample mean X̄n of i.i.d. random variables X1 , . . . , Xn is an important quantity
in many problems. Chebyshev’s inequality bounds the probability of the sample
mean being far from the true mean. The weak law of large numbers, which follows
from Chebyshev’s inequality, says that for n large, the probability is very high that
the sample mean will be very close to the true mean. The central limit theorem says
that for n large the distribution of the sample mean will be approximately Normal.


Inequalities and limit theorems                                                                                                 483

Here, one last time, is the diagram of relationships between the named distributions,
updated to include the Chi-Square distribution (as a special case of the Gamma)
and Student-t distribution (with the Cauchy as a special case). We have also added
arrows to show the convergence of the Poisson, Gamma, and Student-t distributions
to Normality; the first two are a consequence of the central limit theorem, and the
third is a consequence of the law of large numbers.


                                                                                                                        HGeom


                                                                                                 Limit

                                                                                                         Conditioning



                                                                                 Bin
                                                                                 (Bern)

                                                        Limit

                                                                                     Conjugacy
                                                                Conditioning


                                                                                 Beta
                                         Pois
                                                                                 (Unif)


                Limit
                           Poisson process                      Bank–Post Oﬃce
                               Conjugacy


                                       Gamma                                   NBin
    Normal
                                   (Expo, Chi-Square)     Limit                (Geom)
                   Limit




                Limit


                                      Student-t
                                       (Cauchy)




Now we see that all the named distributions are connected to one another!




10.6    R

Jensen’s inequality

R makes it easy to compare the expectations of X and g(X) for a given choice of g,
and this allows us to verify some special cases of Jensen’s inequality. For example,
suppose we simulate 104 times from the Expo(1) distribution:


484                                                            Introduction to Probability

x <- rexp(10^4)
According to Jensen’s inequality, E(log X) ≤ log EX. The former can be approxi-
mated by mean(log(x)) and the latter can be approximated by log(mean(x)), so
compute both:
mean(log(x))
log(mean(x))
For the Expo(1) distribution, we find that mean(log(x)) is approximately −0.6
(the true value is around −0.577), while log(mean(x)) is approximately 0 (the
true value is 0). This indeed suggests E(log X) ≤ log EX. We could also compare
mean(x^3) to mean(x)^3, or mean(sqrt(x)) to sqrt(mean(x))—the possibilities
are endless.


Visualization of the law of large numbers

To plot the running proportion of Heads in a sequence of independent fair coin
tosses, we first generate the coin tosses themselves:
nsim <- 300
p <- 1/2
x <- rbinom(nsim,1,p)
Then we compute X̄n for each value of n and store the results in xbar:
xbar <- cumsum(x)/(1:nsim)
The above line of code performs elementwise division of the two vectors cumsum(x)
and 1:nsim. Finally, we plot xbar against the number of coin tosses:
plot(1:nsim,xbar,type="l",ylim=c(0,1))
You should see that the values of xbar approach p, by the LLN.


Monte Carlo estimate of π

A famous example of Monte Carlo integration is the Monte Carlo estimate of π.
The unit disk {(x, y) : x2 + y 2 ≤ 1} is inscribed in the square [−1, 1] × [−1, 1], which
has area 4. If we generate a large number of points that are Uniform on the square,
the proportion of points falling inside the disk is approximately equal to the ratio
of the disk’s area to the square’s area, which is π/4. Thus, to estimate π we can
take the proportion of points inside the circle and multiply by 4.
In R, to generate Uniform points on the 2D square, we can independently gener-
ate the x-coordinate and the y-coordinate as Unif(−1, 1) r.v.s, using the results of
Example 7.1.23:
nsim <- 10^6


Inequalities and limit theorems                                                    485




                             1.0
                             0.5
                             0.0
                             −0.5
                             −1.0 −1.0   −0.5   0.0   0.5   1.0




FIGURE 10.8
Monte Carlo estimate of π: Generate points that are Uniform on the 2D square
[−1, 1] × [−1, 1], which has area 4. The proportion of points falling in the unit disk
is approximately π/4.


x <- runif(nsim,-1,1)
y <- runif(nsim,-1,1)

To count the number of points in the disk, we type sum(x^2+y^2<1). The vector
x^2+y^2<1 is an indicator vector whose ith element is 1 if the ith point falls inside
the disk and 0 otherwise, so the sum of the elements is the number of points in the
disk. To get our estimate of π, we convert the sum into a proportion and multiply
by 4:

4*sum(x^2+y^2<1)/nsim

How close was your estimate to the actual value of π?


Visualizations of the central limit theorem

One way to visualize the central limit theorem for a distribution of interest is to
plot the distribution of X̄n for various values of n, as in Figure 10.5. To do this,
we first have to generate i.i.d. X1 , . . . , Xn a bunch of times from our distribution
of interest. For example, suppose that our distribution of interest is Unif(0, 1), and
we are interested in the distribution of X̄12 , i.e., we set n = 12. In the following
code, we create a matrix of i.i.d. standard Uniforms. The matrix has 12 columns,
corresponding to X1 through X12 . Each row of the matrix is a different realization
of X1 through X12 .

nsim <- 10^4
n <- 12
x <- matrix(runif(n*nsim), nrow=nsim, ncol=n)


486                                                         Introduction to Probability

Now, to obtain realizations of X̄12 , we simply take the average of each row of the
matrix x; we can do this with the rowMeans function:

xbar <- rowMeans(x)

Finally, we create a histogram:

hist(xbar)

You should see a histogram that looks approximately Normal. Since the Unif(0, 1)
distribution is symmetric, the CLT kicks in quickly and the Normal approximation
for X̄n works well, even for n = 12. Changing runif to rexp, we see that for
Xj ∼ Expo(1), the distribution of X̄n remains skewed when n = 12, so a larger
value of n is required before the Normal approximation is decent.

Another neat visualization of the CLT can be found in the animation package.
This package has a built-in animation of a quincunx or bean machine, invented by
the statistician and geneticist Francis Galton to illustrate the Normal distribution.
After installing the package, try:

library(animation)
quincunx()

Can you use the central limit theorem to explain why the histogram produced by a
quincunx should look approximately Normal?


Chi-Square and Student-t distributions

Although the Chi-Square is just a special case of the Gamma, it still has its own
functions dchisq, pchisq, and rchisq in R: dchisq(x,n) and pchisq(x,n) return
the values of the χ2n PDF and CDF at x, and rchisq(nsim,n) generates nsim
i.i.d. χ2n r.v.s.

The Student-t distribution has functions dt, pt, and rt. To evaluate the PDF or
CDF of the tn distribution at x, we use dt(x,n) or pt(x,n). To generate nsim
i.i.d. r.v.s from the tn distribution, we use rt(nsim,n). Of course, dt(x,1) is the
same as dcauchy(x).




10.7    Exercises

Exercises marked with s have detailed solutions at http://stat110.net.


Inequalities and limit theorems                                                                           487

        Inequalities
   1.    s In a national survey, a random sample of people are chosen and asked whether they
        support a certain policy. Assume that everyone in the population is equally likely to
        be surveyed at each step, and that the sampling is with replacement (sampling without
        replacement is typically more realistic, but with replacement will be a good approxima-
        tion if the sample size is small compared to the population size). Let n be the sample
        size, and let p̂ and p be the proportion of people who support the policy in the sample
        and in the entire population, respectively. Show that for every c > 0,
                                                                     1
                                               P (|p̂ − p| > c) ≤        .
                                                                    4nc2

   2.    s For i.i.d. r.v.s X1 , . . . , Xn with mean µ and variance σ 2 , give a value of n (as a specific
        number) that will ensure that there is at least a 99% chance that the sample mean will
        be within 2 standard deviations of the true mean µ.
   3.    s Show that for any two positive r.v.s X and Y with neither a constant multiple of the
        other,
                                        E(X/Y )E(Y /X) > 1.

   4.    s The famous arithmetic mean-geometric mean inequality says that for any positive
        numbers a1 , a2 , . . . , an ,
                                       a1 + a2 + · · · + an
                                                            ≥ (a1 a2 · · · an )1/n .
                                               n
        Show that this inequality follows from Jensen’s inequality, by considering E log(X) for
        an r.v. X whose possible values are a1 , . . . , an (you should specify the PMF of X; if you
        want, you can assume that the aj are distinct (no repetitions), but be sure to say so if
        you assume this).
   5.   s Let X be a discrete r.v. whose distinct possible values are x0 , x1 , . . . , and let pk =
        P (X = xk ). The entropy of X is H(X) = ∞
                                                 P
                                                   k=0 pk log2 (1/pk ).

        (a) Find H(X) for X ∼ Geom(p).
        Hint: Use properties of logs, and interpret part of the sum as an expected value.

        (b) Let X and Y be i.i.d. discrete r.v.s. Show that P (X = Y ) ≥ 2−H(X) .
        Hint: Consider E(log2 (W )), where W is an r.v. taking value pk with probability pk .
   6.   Let X be a random variable with mean µ and variance σ 2 . Show that

                                                   E(X − µ)4 ≥ σ 4 ,

        and use this to show that the kurtosis of X is at least −2.


        Fill-in-the-blank inequalities
   7.    s Let X and Y be i.i.d. positive r.v.s, and let c > 0. For each part below, fill in the
        appropriate equality or inequality symbol: write = if the two sides are always equal,
        ≤ if the left-hand side is less than or equal to the right-hand side (but they are not
        necessarily equal), and similarly for ≥. If no relation holds in general, write ?.

        (a) E(log(X))          log(E(X))
                         p
        (b) E(X)             E(X 2 )

        (c) E(sin2 (X)) + E(cos2 (X))              1


488                                                                     Introduction to Probability
                         p
        (d) E(|X|)        E(X 2 )
                               E(X 3 )
        (e) P (X > c)            c3

        (f) P (X ≤ Y )      P (X ≥ Y )
                          p
        (g) E(XY )         E(X 2 )E(Y 2 )
        (h) P (X + Y > 10)               P (X > 5 or Y > 5)
        (i) E(min(X, Y ))          min(EX, EY )
                            EX
        (j) E(X/Y )         EY

        (k) E(X 2 (X 2 + 1))     E(X 2 (Y 2 + 1))
                  3
                                    3
        (l) E X 3X+Y 3       E( X 3Y+Y 3 )
   8.   s Write the most appropriate of ≤, ≥, =, or ? in the blank for each part (where “?”
        means that no relation holds in general).
        In (c) through (f), X and Y are i.i.d. (independent identically distributed) positive
        random variables. Assume that the various expected values exist.
        (a) (probability that a roll of 2 fair dice totals 9)     (probability that a roll of 2 fair
        dice totals 10)
        (b) (probability that at least 65% of 20 fair coin flips land Heads)      (probability that
        at least 65% of 2000 fair coin flips land Heads)
               √          p
        (c) E( X)           E(X)
        (d) E(sin X)        sin(EX)
        (e) P (X + Y > 4)           P (X > 2)P (Y > 2)
        (f) E (X + Y )2            2E(X 2 ) + 2(EX)2
                        

   9.   Let X and Y be i.i.d. continuous r.v.s. Assume that the various expressions below exist.
        Write the most appropriate of ≤, ≥, =, or ? in the blank for each part (where “?” means
        that no relation holds in general).
        (a) e−E(X)       E(e−X )
        (b) P (X > Y + 3)            P (Y > X + 3)
        (c) P (X > Y + 3)           P (X > Y − 3)
        (d) E(X 4 )      (E(XY ))2
        (e) Var(Y )      E(Var(Y |X))
        (f) P (|X + Y | > 3)             E|X|
  10.    s Let X and Y be positive random variables, not necessarily independent. Assume that
        the various expected values below exist. Write the most appropriate of ≤, ≥, =, or ? in
        the blank for each part (where “?” means that no relation holds in general).
        (a) (E(XY ))2          E(X 2 )E(Y 2 )
        (b) P (|X + Y | > 2)             1
                                         10
                                            E((X + Y )4 )
        (c) E(log(X + 3))           log(E(X + 3))
        (d) E(X 2 eX )      E(X 2 )E(eX )
        (e) P (X + Y = 2)           P (X = 1)P (Y = 1)
        (f) P (X + Y = 2)           P ({X ≥ 1} ∪ {Y ≥ 1})


Inequalities and limit theorems                                                                  489

  11.    s Let X and Y be positive random variables, not necessarily independent. Assume that
        the various expected values below exist. Write the most appropriate of ≤, ≥, =, or ? in
        the blank for each part (where “?” means that no relation holds in general).
                        p
        (a) E(X 3 )        E(X 2 )E(X 4 )

        (b) P (|X + Y | > 2)             1
                                         16
                                            E((X + Y )4 )
              √                p
        (c) E( X + 3)           E(X + 3)

        (d) E(sin2 (X)) + E(cos2 (X))              1

        (e) E(Y |X + 3)            E(Y |X)

        (f) E(E(Y 2 |X))           (EY )2
  12.    s Let X and Y be positive random variables, not necessarily independent. Assume that
        the various expressions below exist. Write the most appropriate of ≤, ≥, =, or ? in the
        blank for each part (where “?” means that no relation holds in general).
                                EX+EY
        (a) P (X + Y > 2)           2

        (b) P (X + Y > 3)            P (X > 3)

        (c) E(cos(X))          cos(EX)

        (d) E(X 1/3 )        (EX)1/3

        (e) E(X Y )        (EX)EY

        (f) E (E(X|Y ) + E(Y |X))              EX + EY
  13.    s Let X and Y be i.i.d. positive random variables. Assume that the various expressions
        below exist. Write the most appropriate of ≤, ≥, =, or ? in the blank for each part (where
        “?” means that no relation holds in general).
        (a) E(eX+Y )        e2E(X)
                            p
        (b) E(X 2 eX )        E(X 4 )E(e2X )

        (c) E(X|3X)          E(X|2X)

        (d) E(X 7 Y )        E(X 7 E(Y |X))

        (e) E( X
               Y
                  Y
                 +X )          2
                                      Var(X)
        (f) P (|X − Y | > 2)             2

  14.    s Let X and Y be i.i.d. Gamma( 12 , 12 ), and let Z ∼ N (0, 1) (note that X and Z may be
        dependent, and Y and Z may be dependent). For (a),(b),(c), write the most appropriate
        of <, >, =, or ? in each blank; for (d),(e),(f), write the most appropriate of ≤, ≥, =,
        or ? in each blank.
        (a) P (X < Y )      1/2

        (b) P (X = Z 2 )       1
                        1
        (c) P (Z ≥ X 4 +Y 4 +7 )          1
                X
        (d) E( X+Y )E((X + Y )2 )              E(X 2 ) + (E(X))2
                             p
        (e) E(X 2 Z 2 )          E(X 4 )E(X 2 )

        (f) E((X + 2Y )4 )          34


490                                                                   Introduction to Probability

  15.   Let X, Y, Z be i.i.d. N (0, 1) r.v.s. Write the most appropriate of ≤, ≥, =, or ? in each
        blank (where “?” means that no relation holds in general).
        (a) P (X 2 + Y 2 + Z 2 > 6)       1/2

        (b) P (X 2 < 1)       2/3
                           
                    X2
        (c) E X 2 +Y 2 +Z 2       1/4

        (d) Var(Φ(X) + Φ(Y ) + Φ(Z))                 1/4
                −X                X
        (e) E(e      )      E(e )
                             p
        (f) E(|X|eX )          E(e2X )
  16.   Let X, Y, Z, W be i.i.d. positive r.v.s with CDF F and E(X) = 1. Write the most
        appropriate of ≤, ≥, =, or ? in each blank (where “?” means that no relation holds in
        general).
        (a) F (3)     2/3

        (b) (F (3))3       P (X + Y + Z ≤ 9)
                       2
                                 
        (c) E X 2 +Y 2X+Z 2 +W 2      1/4

        (d) E(XY ZW )             E(X 4 )

        (e) Var(E(Y |X))              Var(Y )

        (f) Cov(X + Y, X − Y )               0
  17.   Let X, Y, Z be i.i.d. (independent, identically distributed) r.v.s with a continuous dis-
        tribution. Write the most appropriate of ≤, ≥, =, or ? in each blank (where “?” means
        that no relation holds in general).
        (a) P (X < Y < Z)         1/6

        (b) P (X > 1)         E(X)
                  2015            k        !
                  X     X2 + 1
        (c) P                          >3           P (X 2 > 1)
                         X2 + 2
                  k=0
              √                       p
        (d) E  X2 + Y 2                    E(X 2 ) + E(Y 2 )

        (e) Var(Y 2 |Z)       Var(X 2 |X)

        (f) Var(X − 2Y + 3Z)                14Var(X)
  18.   Let X, Y, Z ∼ Bin(n, p) be i.i.d. (independent and identically distributed). Write the
        most appropriate of ≤, ≥, =, or ? in each blank (where “?” means that no relation
        holds in general).
        (a) P (X < Y < Z)       1/6

        (b) P (X + Y + Z > n)               3p
                  2016
                                           !
                  X   (X 2 + 1)n
        (c) P                    > e5              P (X > 2)
                  n=0
                          n!

        (d) E eX           (pe + 1 − p)n
                    

        (e) Var(X + Y )           n/2

        (f) E(X | X + Y = n)               n/2


Inequalities and limit theorems                                                                      491

  19.   Let X, Y, Z, W ∼ N (c, c2 ) be i.i.d., where c > 0. Write the most appropriate of ≤, ≥,
        =, or ? in each blank (where “?” means that no relation holds in general).
        (a) P (X + Y ≤ Z − W )         Φ(−1)

        (b) P (X 4 − Y 8 ≤ Z 4 − W 8 )             Φ(−1)

        (c) E(X − c)2          c

        (d) E(X − c)3          c
                1
                  X2 + X            1 2
                           
        (e) E   4                   2
                                      c +c

        (f) log E(eX )             1 2
                      
                                   2
                                     c +c
  20.   Let X, Y ∼ Pois(λ) be i.i.d., where λ > 1. Write the most appropriate of ≤, ≥, =, or
        ? in each blank (where “?” means that no relation holds in general).
        (a) P (X ≤ Y )     1/2

        (b) P (X + Y ≤ 1)     3e−2λ

        (c) E eX+Y        e2λ
                    


        (d) E(X | X + Y = 4)            2

        (e) Var(X | X + Y = 4)              1

        (f) E(X 2 − Y )        λ2


        LLN and CLT
  21.    s Let X1 , X2 , . . . be i.i.d. positive random variables with mean 2. Let Y1 , Y2 , . . . be
        i.i.d. positive random variables with mean 3. Show that
                                                X1 + X2 + · · · + Xn   2
                                                                     →
                                                Y1 + Y2 + · · · + Yn   3
        with probability 1. Does it matter whether the Xi are independent of the Yj ?
  22.   s Let U1 , U2 , . . . , U60 be i.i.d. Unif(0,1) and X = U1 + U2 + · · · + U60 .

        (a) Which important distribution is the distribution of X very close to? Specify what
        the parameters are, and state which theorem justifies your choice.

        (b) Give a simple but accurate approximation for P (X > 17). Justify briefly.
  23.   s Let Vn ∼ χ2n and Tn ∼ tn for all positive integers n.

        (a) Find numbers an and bn such that an (Vn − bn ) converges in distribution to N (0, 1).

        (b) Show that Tn2 /(n + Tn2 ) has a Beta distribution (without using calculus).
  24.    s Let T1 , T2 , . . . be i.i.d. Student-t r.v.s with m ≥ 3 degrees of freedom. Find constants
        an and bn (in terms of m and n) such that an (T1 + T2 + · · · + Tn − bn ) converges to
        N (0, 1) in distribution as n → ∞.
  25.   s (a) Let Y = eX , with X ∼ Expo(3). Find the mean and variance of Y .

        (b) For Y1 , . . . , Yn i.i.d. with the same distribution
                                                             P as Y from (a), what is the approxi-
        mate distribution of the sample mean Ȳn = n1 n        j=1 Yj when n is large?


492                                                                        Introduction to Probability

  26.    s (a) Explain why the Pois(n) distribution is approximately Normal if n is a large
        positive integer (specifying what the parameters of the Normal are).

        (b) Stirling’s formula is an amazingly accurate approximation for factorials:

                                                    √          n n
                                             n! ≈       2πn            ,
                                                               e
        where in fact the ratio of the two sides goes to 1 as n → ∞. Use (a) to give a
        quick heuristic derivation of Stirling’s formula by using a Normal approximation to
        the probability that a Pois(n) r.v. is n, with the continuity correction: first write
        P (N = n) = P n − 12 < N < n + 12 , where N ∼ Pois(n).
                                                                                            t
  27.    s (a) Consider i.i.d. Pois(λ) r.v.s X1 , X2 , . . . . The MGF of Xj is M (t) = eλ(e −1) . Find
        the MGF Mn (t) of the sample mean X̄n = n1 n
                                                              P
                                                                j=1 Xj .


        (b) Find the limit of Mn (t) as n → ∞. (You can do this with almost no calculation
        using a relevant theorem; or you can use (a) and the fact that ex ≈ 1 + x if x is very
        small.)

  28.   Let Xn ∼ Pois(n) for all positive integers n. Use MGFs to show that the distribution of
        the standardized version of Xn converges to a Normal distribution as n → ∞, without
        invoking the CLT.

  29.   An important concept in frequentist statistics is that of a confidence interval (CI).
        Suppose we observe data X from a distribution with parameter θ. Unlike in Bayesian
        statistics, θ is treated as a fixed but unknown constant; it is not given a prior distribution.
        A 95% confidence interval consists of a lower bound L(X) and upper bound U (X) such
        that
                                          P (L(X) < θ < U (X)) = 0.95
        for all possible values of θ. Note that in the above statement, L(X) and U (X) are
        random variables, as they are functions of the r.v. X, whereas θ is a constant. The
        definition says that the random interval (L(X), U (X)) has a 95% chance of containing
        the true value of θ.
        Imagine an army of frequentists all over the world, independently generating 95% CIs.
        The jth frequentist observes data Xj and makes a confidence interval for the parameter
        θj . Show that if there are n of these frequentists, then the fraction of their intervals
        which contain the corresponding parameter approaches 0.95 as n → ∞.
        Hint: Consider the indicator r.v. Ij = I(L(Xj ) < θj < U (Xj )).

  30.   This problem extends Example 10.3.7 to a more general setting. Again, suppose a very
        volatile stock rises 70% or drops 50% in price each day, with equal probabilities and
        with different days independent.

        (a) Suppose a hedge fund manager always invests half of her current fortune into the
        stock each day. Let Yn be her fortune after n days, starting from an initial fortune of
        Y0 = 100. What happens to Yn as n → ∞?

        (b) More generally, suppose the hedge fund manager always invests a fraction α of her
        current fortune into the stock each day (in Part (a), we took α = 1/2). With Y0 and Yn
        defined as in Part (a), find the function g(α) such that

                                               log Yn
                                                      → g(α)
                                                 n

        with probability 1 as n → ∞, and prove that g(α) is maximized when α = 2/7.


Inequalities and limit theorems                                                                   493

        Mixed practice
  31.   As in Exercise 36 from Chapter 3, there are n voters in an upcoming election in a certain
        country, where n is a large, even number. There are two candidates, A and B. Each voter
        chooses randomly whom to vote for, independently and with equal probabilities.

        (a) Use a Normal approximation (with continuity correction) to get an approximation
        for the probability of a tie, in terms of Φ.

        (b) Use a first-order Taylor expansion (linear approximation) to the approximation
                                                                               √
        from Part (a) to show that the probability of a tie is approximately 1/ cn, where c is
        a constant (which you should specify).
  32.   Cassie enters a casino with X0 = 1 dollar and repeatedly plays the following game: with
        probability 1/3, the amount of money she has increases by a factor of 3; with probability
        2/3, the amount of money she has decreases by a factor of 3. Let Xn be the amount of
        money she has after playing this game n times. For example, X1 is 3 with probability
        1/3 and is 3−1 with probability 2/3.

        (a) Compute E(X1 ), E(X2 ) and, in general, E(Xn ).

        (b) What happens to E(Xn ) as n → ∞?

        (c) Let Yn be the number of times out of the first n games that Cassie triples her money.
        What happens to Yn /n as n → ∞?

        (d) What happens to Xn as n → ∞?
  33.   A handy rule of thumb in statistics and life is as follows:

        Conditioning often makes things better.

        This problem explores how the above rule of thumb applies to estimating unknown
        parameters. Let θ be an unknown parameter that we wish to estimate based on data
        X1 , X2 , . . . , Xn (these are r.v.s before being observed, and then after the experiment
        they “crystallize” into data). In this problem, θ is viewed as an unknown constant, and
        is not treated as an r.v. as in the Bayesian approach. Let T1 be an estimator for θ (this
        means that T1 is a function of X1 , . . . , Xn which is being used to estimate θ).

        A strategy for improving T1 (in some problems) is as follows. Suppose that we have an
        r.v. R such that T2 = E(T1 |R) is a function of X1 , . . . , Xn (in general, E(T1 |R) might
        involve unknowns such as θ but then it couldn’t be used as an estimator). Also suppose
        that P (T1 = T2 ) < 1, and that E(T12 ) is finite.

        (a) Use Jensen’s inequality to show that T2 is better than T1 in the sense that the mean
        squared error is less, i.e.,
                                        E(T2 − θ)2 < E(T1 − θ)2 .
        Hint: Use Adam’s law on the right-hand side.

        (b) The bias of an estimator T for θ is defined to be b(T ) = E(T ) − θ. An important
        identity in statistics, a form of the bias-variance tradeoff, is that mean squared error is
        variance plus squared bias:

                                     E(T − θ)2 = Var(T ) + (b(T ))2 .

        Use this identity and Eve’s law to give an alternative proof of the result from (a).

        (c) Now supposeP that X1 , X2 , . . . are i.i.d. with mean θ, and consider the special case
        T1 = X1 , R = n  j=1 Xj . Find T2 in simplified form, and check that it has lower mean
        squared error than T1 for n ≥ 2. Also, say what happens to T1 and T2 as n → ∞.


494                                                                     Introduction to Probability

  34.   Each page of an n-page book has a Pois(λ) number of typos, where λ is unknown (but
        is not treated as an r.v.). Typos on different pages are independent. Thus we have
        i.i.d. X1 , . . . , Xn ∼ Pois(λ), where Xj is the number of typos on page j. Suppose we are
        interested in estimating the probability θ that a page has no typos:

                                         θ = P (Xj = 0) = e−λ .

        (a) Let X̄n = n1 (X1 + · · · + Xn ). Show that the estimator Tn = e−X̄n is biased for θ.
        (That is, show E(Tn ) 6= θ. Estimators and bias are defined in the previous problem.)

        (b) Show that as n → ∞, Tn → θ with probability 1.

        (c) Show that W = n1 (I(X1 = 0) + · · · + I(Xn = 0)) is unbiased for θ. Using the fact
        that X1 |(X1 + · · · + Xn = s) ∼ Bin(s, 1/n), find E(W |X1 + · · · + Xn ). Is the estimator
        W̃ = E(W |X1 + · · · + Xn ) also unbiased for θ?

        (d) Using Eve’s law or otherwise, show that W̃ has lower variance than W , and relate
        this to the previous question.
  35.   A binary sequence is being generated through some process (random or deterministic).
        You need to sequentially predict each new number, i.e., you predict whether the next
        number will be 0 or 1, then observe it, then predict the next number, etc. Each of your
        predictions can be based on the entire past history of the sequence.
        (a) Suppose for this part that the binary sequence consists of i.i.d. Bern(p) r.v.s, with
        p known. What is your optimal strategy (for each prediction, your goal is to maximize
        the probability of being correct)? What is the probability that you will guess the nth
        value correctly with this strategy?
        (b) Now suppose that the binary sequence consists of i.i.d. Bern(p) r.v.s, with p unknown.
        Consider the following strategy: say 1 as your first prediction; after that, say “1” if the
        proportion of 1’s so far is at least 1/2, and say “0” otherwise. Find the limit as n → ∞
        of the probability of guessing the nth value correctly (in terms of p).
        (c) Now suppose that you follow the strategy from (b), but that the binary sequence
        is generated by a nefarious entity who knows your strategy. What can the entity do to
        make your guesses be wrong as often as possible?
  36.   s Let X and Y be independent standard Normal r.v.s and let R2 = X 2 + Y 2 (where
        R > 0 is the distance from (X, Y ) to the origin).
        (a) The distribution of R2 is an example of three of the important distributions we
        have seen. State which three of these distributions R2 is an instance of, specifying the
        parameter values.
        (b) Find the PDF of R.
        Hint: Start with the PDF fW (w) of W = R2 .
        (c) Find P (X > 2Y + 3) in terms of the standard Normal CDF Φ.
        (d) Compute Cov(R2 , X). Are R2 and X independent?
  37.    s Let Z1 , . . . , Zn ∼ N (0, 1) be i.i.d.
        (a) As a function of Z1 , create an Expo(1) r.v. X (your answer can also involve the
        standard Normal CDF Φ).
        (b) Let Y = e−R , where R = Z12 + · · · + Zn2 . Write down (but do not evaluate) an
                                            p

        integral for E(Y ).
        (c) Let X1 = 3Z1 − 2Z2 and X2 = 4Z1 + 6Z2 . Determine whether X1 and X2 are
        independent (be sure to mention which results you’re using).


Inequalities and limit theorems                                                                   495
                                                                                      X1
  38.   s Let X1 , X2 , . . . be i.i.d. positive r.v.s. with mean µ, and let Wn = X1 +···+X n
                                                                                              .
        (a) Find E(Wn ).
                           X1            X2                   Xn
        Hint: Consider X1 +···+X n
                                   + X1 +···+Xn
                                                + · · · + X1 +···+X n
                                                                      .
        (b) What random variable does nWn converge to (with probability 1) as n → ∞?
        (c) For the case that Xj ∼ Expo(λ), find the distribution of Wn , preferably without
        using calculus. (If it is one of the named distributions we have studied, state its name
        and specify the parameters; otherwise, give the PDF.)
  39.   Let X1 , X2 , . . . be i.i.d. Expo(1).
        (a) Let N = min{n : Xn ≥ 1} be the index of the first Xj to exceed 1. Find the
        distribution of N − 1 (give the name and parameters), and hence find E(N ).
        (b) Let M = min{n : X1 + X2 + · · · + Xn ≥ 10} be the number of Xj ’s we observe until
        their sum exceeds 10 for the first time. Find the distribution of M − 1 (give the name
        and parameters), and hence find E(M ).
        Hint: Consider a Poisson process.
        (c) Let X̄n = (X1 + · · · + Xn )/n. Find the exact distribution of X̄n (give the name and
        parameters), as well as the approximate distribution of X̄n for n large (give the name
        and parameters).


Taylor & Francis
Taylor & Francis Group
http://taylorandfrancis.com


11
Markov chains



Markov chains were first introduced in 1906 by Andrey Markov (of Markov’s in-
equality), with the goal of showing that the law of large numbers can apply to
random variables that are not independent. To see where the Markov model comes
from, start by considering an i.i.d. sequence of random variables X0 , X1 , . . . , Xn , . . .
where we think of n as time. This is the setting we worked in throughout Chapter
10, but for modeling real-world phenomena, independence can be an excessively re-
strictive assumption; it means that the Xn provide absolutely no information about
each other. At the other extreme, allowing arbitrary interactions between the Xn
makes it very difficult to compute even basic things. A Markov chain is a sequence
of r.v.s that exhibits one-step dependence, in a precise sense that we shall soon
define. Thus Markov chains are a happy medium between complete independence
and complete dependence.
Since their invention, Markov chains have become extremely important in a huge
number of fields such as biology, game theory, finance, machine learning, and statisti-
cal physics. They are also very widely used for simulations of complex distributions,
via algorithms known as Markov chain Monte Carlo (MCMC). In this chapter we
will introduce Markov chains and their properties, and in the next chapter we’ll
look at some examples of MCMC techniques.




11.1     Markov property and transition matrix

Markov chains “live” in both space and time: the set of possible values of the Xn is
called the state space, and the index n represents the evolution of the process over
time. The state space of a Markov chain can be either discrete or continuous, and
time can also be either discrete or continuous (in the continuous-time setting, we
would imagine a process Xt defined for all real t ≥ 0). In this chapter we will focus
exclusively on discrete-state, discrete-time Markov chains, with a finite state space.
Specifically, we will assume that the Xn take values in a finite set, which we usually
take to be {1, 2, . . . , M } or {0, 1, . . . , M }.
Definition 11.1.1 (Markov chain). A sequence of random variables X0 , X1 , X2 , . . .
taking values in the state space {1, 2, . . . , M } is called a Markov chain if for all n ≥ 0,
       P (Xn+1 = j|Xn = i, Xn−1 = in−1 , . . . , X0 = i0 ) = P (Xn+1 = j|Xn = i).

                                                                                          497


498                                                            Introduction to Probability

The quantity P (Xn+1 = j|Xn = i) is called the transition probability from state
i to state j. In this book, when referring to a Markov chain we will implicitly
assume that it is time-homogeneous, which means that the transition probability
P (Xn+1 = j|Xn = i) is the same for all times n. But care is needed, since the
literature is not consistent about whether to say “time-homogeneous Markov chain”
or just “Markov chain”.
The above condition is called the Markov property, and it says that given the en-
tire past history X0 , X1 , X2 , . . . , Xn , only the most recent term, Xn , matters for
predicting Xn+1 . If we think of time n as the present, times before n as the past,
and times after n as the future, the Markov property says that given the present,
the past and future are conditionally independent. The Markov property greatly
simplifies computations of conditional probability: instead of having to condition
on the entire past, we only need to condition on the most recent value.
To describe the dynamics of a Markov chain, we need to know the probabilities
of moving from any state to any other state, that is, the probabilities P (Xn+1 =
j|Xn = i) on the right-hand side of the Markov property. This information can be
encoded in a matrix, called the transition matrix, whose (i, j) entry is the probability
of going from state i to state j in one step of the chain.
Definition 11.1.2 (Transition matrix). Let X0 , X1 , X2 , . . . be a Markov chain
with state space {1, 2, . . . , M }, and let qij = P (Xn+1 = j|Xn = i) be the transition
probability from state i to state j. The M × M matrix Q = (qij ) is called the
transition matrix of the chain.
Note that Q is a nonnegative matrix in which each row sums to 1. This is because,
starting from any state i, the events “move to 1”, “move to 2”, . . . , “move to
M ” are disjoint, and their union has probability 1 because the chain has to go
somewhere.
Example 11.1.3 (Rainy-sunny Markov chain). Suppose that on any given day,
the weather can either be rainy or sunny. If today is rainy, then tomorrow will be
rainy with probability 1/3 and sunny with probability 2/3. If today is sunny, then
tomorrow will be rainy with probability 1/2 and sunny with probability 1/2. Letting
Xn be the weather on day n, X0 , X1 , X2 , . . . is a Markov chain on the state space
{R, S}, where R stands for rainy and S for sunny. We know that the Markov prop-
erty is satisfied because, from the description of the process, only today’s weather
matters for predicting tomorrow’s.
The transition matrix of the chain is

                                             R     S
                                                     
                                    R       1/3   2/3
                                                        .
                                    S       1/2   1/2

The first row says that starting from state R, we transition back to state R with
probability 1/3 and transition to state S with probability 2/3. The second row says


Markov chains                                                                     499

that starting from state S, we have a 1/2 chance of moving to state R and a 1/2
chance of staying in state S. We could just as well have used


                                              S       R
                                                        
                                     S       1/2     1/2
                                     R       2/3     1/3


as our transition matrix instead. In general, if there isn’t an obvious ordering of
the states of a Markov chain (as with the states R and S), we just need to fix an
ordering of the states and use it consistently.

The transition probabilities of a Markov chain can also be represented with a di-
agram. Each state is represented by a circle, and the arrows indicate the possible
one-step transitions; we can imagine a particle wandering around from state to
state, randomly choosing which arrow to follow. Next to the arrows we write the
corresponding transition probabilities.

                                              2/3


                    1/3          R                       S           1/2
                                               1/2




What if the weather tomorrow depended on the weather today and the weather
yesterday? For example, suppose that the weather behaves as above, except that
if there have been two consecutive days of rain, then tomorrow will definitely be
sunny, and if there have been two consecutive days of sun, then tomorrow will
definitely be rainy. Under these new weather dynamics, the Xn no longer form a
Markov chain, as the Markov property is violated: conditional on today’s weather,
yesterday’s weather can still provide useful information for predicting tomorrow’s
weather.

However, by enlarging the state space, we can create a new Markov chain: let
Yn = (Xn−1 , Xn ) for n ≥ 1. Then Y1 , Y2 , . . . is a Markov chain on the state space
{(R, R), (R, S), (S, R), (S, S)}. You can verify that the new transition matrix is


                              (R, R)         (R, S)    (S, R)   (S, S)
                                                                      
                     (R, R)     0              1         0        0
                     (R, S) 
                               0              0        1/2      1/2  
                     (S, R)  1/3             2/3        0        0 
                     (S, S)     0              0         1        0


and that its corresponding graphical representation is given in the following figure.


500                                                                  Introduction to Probability

                                                   1


                                  RR                          RS

                                             1/2                   1/2

                         1/3                           2/3

                                  SR                          SS
                                                   1



Similarly, we could handle third-order or fourth-order dependencies in the weather
by further enlarging the state space to make the Markov property hold.          
Once we have the transition matrix Q of a Markov chain, we can work out the
transition probabilities for longer timescales.
Definition 11.1.4 (n-step transition probability). The n-step transition probabil-
ity from i to j is the probability of being at j exactly n steps after being at i. We
                 (n)
denote this by qij :
                                 (n)
                                qij = P (Xn = j|X0 = i).

Note that                                      X
                                       (2)
                                       qij =            qik qkj
                                                   k

since to get from i to j in two steps, the chain must go from i to some intermediary
state k, and then from k to j; these transitions are independent because of the
Markov property. Since the right-hand side is the (i, j) entry of Q2 by definition of
matrix multiplication, we conclude that the matrix Q2 gives the two-step transition
probabilities. By induction, the nth power of the transition matrix gives the n-step
transition probabilities:

                                (n)
                               qij is the (i, j) entry of Qn .

Example 11.1.5 (Transition matrix of 4-state Markov chain). Consider the 4-state
Markov chain depicted in Figure 11.1. When no probabilities are written over the
arrows, as in this case, it means all arrows originating from a given state are equally
likely. For example, there are 3 arrows originating from state 1, so the transitions
1 → 3, 1 → 2, and 1 → 1 all have probability 1/3. Therefore the transition matrix
of the chain is                                          
                                    1/3 1/3 1/3 0
                                 0        0 1/2 1/2 
                            Q=  0
                                                          .
                                           1     0    0 
                                    1/2 0        0 1/2


Markov chains                                                                        501

                                            1




                                            2




                                        3        4



FIGURE 11.1
A 4-state Markov chain.

To compute the probability that the chain is in state 3 after 5 steps, starting at
state 1, we would look at the (1,3) entry of Q5 . Here, using a computer to find Q5 ,
                                                       
                      853/3888 509/1944 52/243 395/1296
                      173/864  85/432 31/108 91/288 
                Q5 = 
                      37/144
                                                        ,
                                 29/72   1/9    11/48 
                      499/2592 395/1296 71/324 245/864

    (5)
so q13 = 52/243.                                                                       
Using the language of Chapter 7, the transition matrix Q encodes the conditional
distribution of X1 given the initial state of the chain. Specifically, the ith row of Q
is the conditional PMF of X1 given X0 = i, displayed as a row vector. Similarly,
the ith row of Qn is the conditional PMF of Xn given X0 = i.
To get the marginal distributions of X0 , X1 , . . . , we need to specify not only the
transition matrix, but also the initial conditions of the chain. The initial state X0
can be specified deterministically, or randomly according to some distribution. Let
(t1 , t2 , . . . , tM ) be the PMF of X0 displayed as a vector, that is, ti = P (X0 = i).
Then the marginal distribution of the chain at any time can be computed from the
transition matrix, averaging over all the states using LOTP.
Proposition 11.1.6 (Marginal distribution of Xn ). Define t = (t1 , t2 , . . . , tM ) by
ti = P (X0 = i), and view t as a row vector. Then the marginal distribution of Xn
is given by the vector tQn . That is, the jth component of tQn is P (Xn = j).

Proof. By the law of total probability, conditioning on X0 , the probability that the
chain is in state j after n steps is

                            M
                            X                                     M
                                                                  X        (n)
             P (Xn = j) =         P (X0 = i)P (Xn = j|X0 = i) =         ti qij ,
                            i=1                                   i=1

which is the jth component of tQn by definition of matrix multiplication.              


502                                                          Introduction to Probability

Example 11.1.7 (Marginal distributions of 4-state Markov chain). Again consider
the 4-state Markov chain shown in Figure 11.1. Suppose that the initial conditions
are t = (1/4, 1/4, 1/4, 1/4), meaning that the chain has equal probability of starting
in each of the four states. Let Xn be the position of the chain at time n. Then the
marginal distribution of X1 is
                                                                    
                                                1/3 1/3 1/3 0
                                             0       0 1/2 1/2 
              tQ = 1/4 1/4 1/4 1/4           0
                                                                     
                                                       1    0     0 
                                                1/2 0       0 1/2
                                              
                 = 5/24 1/3 5/24 1/4 .
The marginal distribution of X5 is
                                                                    
                                   853/3888 509/1944 52/243 395/1296
                                  173/864  85/432 31/108 91/288 
      tQ5 =   1/4 1/4 1/4 1/4     37/144
                                                                     
                                              29/72    1/9    11/48 
                                   499/2592 395/1296 71/324 245/864
                                                     
         =    3379/15552 2267/7776 101/486 1469/5184 .
We used a computer to perform the matrix multiplication.                             




11.2     Classification of states

In this section we introduce terminology for describing the various characteristics
of a Markov chain. The states of a Markov chain can be classified as recurrent or
transient, depending on whether they are visited over and over again in the long
run or are eventually abandoned. States can also be classified according to their
period, which is a positive integer summarizing the amount of time that can elapse
between successive visits to a state. These characteristics are important because
they determine the long-run behavior of the Markov chain, which we will study in
Section 11.3.
The concepts of recurrence and transience are best illustrated with a concrete ex-
ample. In the Markov chain shown on the left of Figure 11.2 (previously featured
in Example 11.1.5), a particle moving around between states will continue to spend
time in all 4 states in the long run, since it is possible to get from any state to any
other state. In contrast, consider the chain on the right of Figure 11.2, and let the
particle start at state 1. For a while, the chain may linger in the triangle formed by
states 1, 2, and 3, but eventually it will reach state 4, and from there it can never
return to states 1, 2, or 3. It will then wander around between states 4, 5, and 6
forever. States 1, 2, and 3 are transient and states 4, 5, and 6 are recurrent.
In general, these concepts are defined as follows.


Markov chains                                                                       503


                                                               5

                    1                                               6

                                                           4

                    2

                                                     3

                3       4                   1

                                                    2


FIGURE 11.2
Left: 4-state Markov chain with all states recurrent. Right: 6-state Markov chain
with states 1, 2, and 3 transient.


Definition 11.2.1 (Recurrent and transient states). State i of a Markov chain is
recurrent if starting from i, the probability is 1 that the chain will eventually return
to i. Otherwise, the state is transient, which means that if the chain starts from i,
there is a positive probability of never returning to i.

In fact, although the definition of a transient state only requires that there be a
positive probability of never returning to the state, we can say something stronger:
as long as there is a positive probability of leaving i forever, the chain eventually
will leave i forever. Moreover, we can find the distribution of the number of returns
to the state.

Proposition 11.2.2 (Number of returns to transient state is Geometric). Let i be
a transient state of a Markov chain. Suppose the probability of never returning to
i, starting from i, is a positive number p > 0. Then, starting from i, the number of
times that the chain returns to i before leaving forever is distributed Geom(p).

The proof is by the story of the Geometric distribution: each time that the chain
is at i, we have a Bernoulli trial which results in “failure” if the chain eventually
returns to i and “success” if the chain leaves i forever; these trials are independent
by the Markov property. The number of returns to state i is the number of failures
before the first success, which matches the story of the Geometric distribution. And
since a Geometric random variable always takes finite values, this proposition tells
us that after some finite number of visits, the chain will leave state i forever.

If the number of states is not too large, one way to classify states as recurrent
or transient is to draw a diagram of the Markov chain and use the same kind of
reasoning that we used when analyzing the chains in Figure 11.2. A special case
where we can immediately conclude all states are recurrent is when the chain is
irreducible, meaning that it is possible to get from any state to any other state.


504                                                              Introduction to Probability

Definition 11.2.3 (Irreducible and reducible chain). A Markov chain with transi-
tion matrix Q is irreducible if for any two states i and j, it is possible to go from i
to j in a finite number of steps (with positive probability). That is, for any states
i, j there is some positive integer n such that the (i, j) entry of Qn is positive. A
Markov chain that is not irreducible is called reducible.
Proposition 11.2.4 (Irreducible implies all states recurrent). In an irreducible
Markov chain with a finite state space, all states are recurrent.

Proof. It is clear that at least one state must be recurrent; if all states were transient,
the chain would eventually leave all states forever and have nowhere to go! So assume
without loss of generality that state 1 is recurrent, and consider any other state i.
                 (n)
We know that q1i is positive for some n, by definition of irreducibility. Thus, every
time the chain is at state 1, there is a positive probability that after n more steps
it will be at state i.
Since the chain visits state 1 infinitely often, we know the chain will eventually
reach state i from state 1; think of each visit to state 1 as starting a trial, where
“success” is defined as reaching state i in at most n steps. From state i, the chain
will return to state 1 because state 1 is recurrent, and by the same logic, it will
eventually reach state i again. By induction, the chain will visit state i infinitely
often. Since i was arbitrary, we conclude that all states are recurrent.           

The converse of the proposition is false; it is possible to have a reducible Markov
chain whose states are all recurrent. An example is given by the Markov chain below,
which consists of two “islands” of states.


                          1             2             4              5




                                 3                           6




h 11.2.5. Note that recurrence or transience is a property of each state in a Markov
chain, while irreducibility or reducibility is a property of the chain as a whole.
Here are two familiar problems from earlier chapters, viewed through the lens of
Markov chains. For each, we’ll identify the recurrent and transient states.
Example 11.2.6 (Gambler’s ruin as a Markov chain). In the gambler’s ruin prob-
lem (Example 2.7.3), two gamblers, A and B, start with i and N − i dollars respec-
tively, making a sequence of bets for $1. In each round, player A has probability p
of winning and probability q = 1 − p of losing. Let Xn be the wealth of gambler A
at time n. Then X0 , X1 , . . . is a Markov chain on the state space {0, 1, . . . , N }. By


Markov chains                                                                              505

design, X0 = i. Once the Markov chain reaches 0 or N , signifying bankruptcy for
player A or player B, the chain stays in that state forever. A diagram of the chain
is shown below.

                                 p                p               p                p       1
           0            1                 2                ...          N–1            N
     1            q              q                 q              q

We proved in Chapter 2 that the probability that either A or B goes bankrupt is
1, so for any starting state i other than 0 or N , the Markov chain will eventually
be absorbed into state 0 or N , never returning to i. Therefore, for this Markov
chain, states 0 and N are recurrent, and all other states are transient. The chain is
reducible because from state 0 it is only possible to go to state 0, and from state N
it is only possible to go to state N .                                              
Example 11.2.7 (Coupon collector as a Markov chain). In the coupon collector
problem (Example 4.3.12), there are C types of coupons (or toys), which we collect
one by one, sampling with replacement from the C coupon types each time. Let Xn
be the number of distinct coupon types in our collection after n attempts. Then
X0 , X1 , . . . is a Markov chain on the state space {0, 1, . . . , C}. By design, X0 = 0.
This chain is depicted below.

                 1           (C – 1)/C         (C – 2)/C         2/C           1/C
           0            1                2                 ...          C–1            C


                       1/C               2/C                           (C – 1)/C       1

With the exception of state C, we can never return to a state after leaving it; the
number of coupon types in the collection can only increase with time. Thus all states
are transient except for C, which is recurrent. The chain is reducible since, e.g., it’s
impossible to go from state 2 back to state 1.                                        
Another way to classify states is according to their periods. The period of a state
summarizes how much time can elapse between successive visits to the state.
Definition 11.2.8 (Period of a state, periodic and aperiodic chain). The period of
a state i in a Markov chain is the greatest common divisor (gcd) of the possible
numbers of steps it can take to return to i when starting at i. That is, the period
of i is the greatest common divisor of numbers n such that the (i, i) entry of Qn is
positive. (The period of i is ∞ if it’s impossible ever to return to i after starting
at i.) A state is called aperiodic if its period equals 1, and periodic otherwise. The
chain itself is called aperiodic if all its states are aperiodic, and periodic otherwise.
For example, let’s consider again the two Markov chains from Figure 11.2, shown
again in Figure 11.3. We first consider the 6-state chain on the right. Starting from
state 1, it is possible to be back at state 1 after 3 steps, 6 steps, 9 steps, etc., but it


506                                                               Introduction to Probability


                                                              5

                  1                                                     6

                                                          4

                  2

                                                    3

              3        4                   1

                                                   2


FIGURE 11.3
Left: an aperiodic Markov chain. Right: a periodic Markov chain in which states 1,
2, and 3 have period 3.


is not possible to be back at state 1 after any number of steps that is not a multiple
of 3. Therefore, state 1 has period 3. Similarly, states 2 and 3 also have period 3.
On the other hand, states 4, 5, and 6 have period 1, but the chain is periodic since
at least one state does not have period 1. By contrast, in the chain on the left all
states are aperiodic, so that chain is aperiodic.
In the gambler’s ruin chain from Example 11.2.6, each state has period 2 except for
0 and N , which have period 1. In the coupon collector chain, each state has period
1 except for state 0, which has period ∞ because it’s impossible to return to state
0. So neither of these chains is aperiodic.
Checking whether an irreducible chain is aperiodic is often much easier than it might
seem: the next proposition shows that we only need to calculate the period of one
state, rather than searching state by state for a state whose period is not 1.
Proposition 11.2.9 (Periods in an irreducible chain). In an irreducible Markov
chain, all states have the same period.




11.3    Stationary distribution

The concepts of recurrence and transience are important for understanding the long-
run behavior of a Markov chain. At first, the chain may spend time in transient
states. Eventually though, the chain will spend all its time in recurrent states. But
what fraction of the time will it spend in each of the recurrent states? This question
is answered by the stationary distribution of the chain, also known as the steady-
state distribution. We will learn in this section that for irreducible and aperiodic


Markov chains                                                                         507

Markov chains, the stationary distribution describes the long-run behavior of the
chain, regardless of its initial conditions. It will tell us both the long-run probability
of being in any particular state, and the long-run proportion of time that the chain
spends in that state.
Definition 11.3.1 P(Stationary distribution). A row vector s = (s1 , . . . , sM ) such
that si ≥ 0 and     i si = 1 is a stationary distribution for a Markov chain with
transition matrix Q if
                                   X
                                       si qij = sj
                                       i

for all j. This system of linear equations can be written as one matrix equation:

                                           sQ = s.


Recall that if s is the distribution of X0 , then sQ is the marginal distribution of
X1 . Thus the equation sQ = s means that if X0 has distribution s, then X1 also
has distribution s. But then X2 also has distribution s, as does X3 , etc. That is, a
Markov chain whose initial distribution is the stationary distribution s will stay in
the stationary distribution forever.
One way to think about the stationary distribution of a Markov chain intuitively is
to imagine a large number of particles, each independently bouncing from state to
state according to the transition probabilities. After a while, the system of particles
will approach an equilibrium where, at each time period, the number of particles
leaving a state will be counterbalanced by the number of particles entering that
state, and this will be true for all states. At this equilibrium, the system as a whole
will appear to be stationary, and the proportion of particles in each state will be
given by the stationary distribution. We will explore this perspective on stationary
distributions more after Definition 11.4.1.
h 11.3.2 (Stationary distribution is marginal, not conditional). When a Markov
chain is at the stationary distribution, the unconditional PMF of Xn equals s for
all n, but the conditional PMF of Xn given Xn−1 = i is still encoded by the ith row
of the transition matrix Q.
If a Markov chain starts at the stationary distribution, then all of the Xn are iden-
tically distributed (since they have the same marginal distribution s), but they are
not necessarily independent, since the conditional distribution of Xn given Xn−1 = i
is, in general, different from the marginal distribution of Xn .
h 11.3.3 (Sympathetic magic). If a Markov chain starts at the stationary distri-
bution, then the marginal distributions of the Xn are all equal. This is not the same
as saying that the Xn themselves are all equal; confusing the random variables Xn
with their distributions is an example of sympathetic magic.
For very small Markov chains, we may solve for the stationary distribution by hand,
using the definition. The next example illustrates this for a two-state chain.


508                                                             Introduction to Probability

Example 11.3.4 (Stationary distribution for a two-state chain). Let
                                            
                                    1/3 2/3
                             Q=                .
                                    1/2 1/2

The stationary distribution is of the form s = (s, 1 − s), and we must solve for s in
                                            
                                  1/3 2/3                  
                       s 1−s                   = s 1−s ,
                                     1/2 1/2
which is equivalent to
                                 1    1
                                   s + (1 − s) = s,
                                 3    2
                                 2    1
                                   s + (1 − s) = 1 − s.
                                 3    2
The only solution to these equations is s = 3/7, so (3/7, 4/7) is the unique stationary
distribution of this Markov chain.
More generally, suppose that q12 = a and q21 = b, where 0 < a < 1 and 0 < b < 1.
Then the transition matrix is
                                               
                                     1−a     a
                              Q=                  .
                                      b    1−b

Writing s = (s1 , s2 ), the equation sQ = s becomes the linear system

                                  (1 − a)s1 + bs2 = s1 ,
                                  as1 + (1 − b)s2 = s2

Both equations in this system simplify to

                                       as1 = bs2 .

Plugging in s2 = 1 − s1 , it follows that the unique solution to this system is
                                                  
                                          b     a
                                  s=         ,       .
                                        a+b a+b
In short, s ∝ (b, a), i.e., s is a constant times (b, a). The constant is whatever it needs
to be to make the components of s sum to 1. As a check, note that for the Q given
earlier with specific numbers, this result says that the stationary distribution should
be proportional to (b, a) = (1/2, 2/3), which, multiplying by 6 to clear the denomi-
nators, is equivalent to being proportional to (3, 4). The stationary distribution we
solved for earlier was (3/7, 4/7), which is indeed proportional to (3, 4).               
In linear algebra terminology, the equation sQ = s says that s is a left eigenvector of
Q with eigenvalue 1 (see Section A.3 of the math appendix). To get the usual kind
of eigenvector (a right eigenvector), take transposes: Q0 s0 = s0 , where the 0 symbol
denotes taking the transpose.


Markov chains                                                                              509

11.3.1    Existence and uniqueness

Does a stationary distribution always exist, and is it unique? It turns out that for a
finite state space, a stationary distribution always exists. Furthermore, in irreducible
Markov chains, the stationary distribution is unique.
Theorem 11.3.5 (Existence and uniqueness of stationary distribution). For any
irreducible Markov chain, there exists a unique stationary distribution. In this dis-
tribution, every state has positive probability.
The theorem is a consequence of a result from linear algebra called the Perron-
Frobenius theorem, which is stated in Section A.3 of the math appendix.
The 4-state chain on the left of Figure 11.3 is irreducible: in terms of the picture,
it is possible to go from anywhere to anywhere following the arrows; in terms of
the transition matrix Q, all the entries of Q5 are positive. Therefore, by Theorem
11.3.5, the chain has a unique stationary distribution.
On the other hand, the gambler’s ruin chain from Example 11.2.6 is reducible, so the
theorem does not apply. It turns out that this chain has infinitely many stationary
distributions. In the long run, the chain will either wind up at state 0 (and stay there
forever) or wind up at state N (and stay there forever). This suggests, and it is easy
to check, that the degenerate distributions s = (1, 0, . . . , 0) and t = (0, 0, . . . , 1) are
both stationary distributions. It follows that any weighted combination ps+(1−p)t,
where 0 ≤ p ≤ 1, is also a stationary distribution, since it sums to 1 and

                 (ps + (1 − p)t)Q = psQ + (1 − p)tQ = ps + (1 − p)t,

where, as usual, Q is the transition matrix.


11.3.2    Convergence

We have already informally stated that the stationary distribution describes the
long-run behavior of the chain, in the sense that if we run the chain for a long time,
the marginal distribution of Xn converges to the stationary distribution s. The next
theorem states that this is true as long as the chain is both irreducible and aperiodic.
Then, regardless of the chain’s initial conditions, the PMF of Xn will converge to
the stationary distribution as n → ∞. This relates the concept of stationarity to
the long-run behavior of a Markov chain. The proof is omitted.
Theorem 11.3.6 (Convergence to stationary distribution). Let X0 , X1 , . . . be an
irreducible, aperiodic Markov chain with stationary distribution s and transition
matrix Q. Then P (Xn = i) converges to si as n → ∞. In terms of the transition
matrix, Qn converges to a matrix in which each row is s.
Therefore, after a large number of steps, the probability that the chain is in state i
is close to the stationary probability si , regardless of the chain’s initial conditions.
This makes irreducible, aperiodic chains especially nice to work with. Irreducibility


510                                                                  Introduction to Probability

means that for each (i, j) there is some power Qm where the (i, j) entry is positive,
but if we also assume aperiodicity it turns out that we can find a value of m that
works for all i, j. More precisely, a chain is irreducible and aperiodic if and only if
some power Qm is positive in all entries.
Intuitively, the extra condition of aperiodicity is needed in order to rule out chains
that just go around in circles, such as the chain in the following example, or chains
where, say, some states are accessible only after an even number of steps while other
states are accessible only after an odd number of steps.
Example 11.3.7 (Periodic chain). The figure below shows a periodic Markov chain
where each state has period 5.

                                                   1


                                       5                       2




                                           4               3



FIGURE 11.4
A periodic chain.

The transition matrix of the chain is
                                                               
                                    0          1       0   0   0
                                  0           0       1   0   0
                                                               
                             Q=  0           0       0   1   0
                                                                .
                                  0           0       0   0   1
                                    1          0       0   0   0

It can be verified without much difficulty that s = (1/5, 1/5, 1/5, 1/5, 1/5) is a
stationary distribution of this chain, and by Theorem 11.3.5, s is unique. However,
suppose the chain starts at X0 = 1. Then the PMF of Xn assigns probability 1 to
the state (n mod 5) + 1 and 0 to all other states.1 In particular, it does not converge
to s as n → ∞. Nor does Qn converge to a matrix in which each row is s: the chain’s
transitions are deterministic, so Qn always consists of 0’s and 1’s.                 
Lastly, the stationary distribution tells us the average time between visits to any
particular state.
Theorem 11.3.8 (Expected time to return). Let X0 , X1 , . . . be an irreducible
Markov chain with stationary distribution s. Let ri be the expected time it takes
the chain to return to i, given that it starts at i. Then si = 1/ri .
Here is how the theorems apply to the two-state chain from Example 11.3.4.
  1
      The notation n mod 5 denotes the remainder when n is divided by 5.


Markov chains                                                                    511

Example 11.3.9 (Long-run behavior of a two-state chain). In the long run, the
chain in Example 11.3.4 will spend 3/7 of its time in state 1 and 4/7 of its time in
state 2. Starting at state 1, it will take an average of 7/3 steps to return to state
1. The powers of the transition matrix converge to a matrix where each row is the
stationary distribution:
                               n            
                         1/3 2/3       3/7 4/7
                                   →             as n → ∞.                         
                         1/2 1/2       3/7 4/7


11.3.3   Google PageRank

We next consider a vastly larger example of a stationary distribution, for a Markov
chain on a state space with billions of interconnected nodes: the World Wide Web.
The next example explains how the founders of Google modeled web-surfing as a
Markov chain, and then used its stationary distribution to rank the relevance of
webpages. For years Google described the resulting method, known as PageRank ,
as “the heart of our software”.
Suppose you are interested in a certain topic, say chess, so you use a search engine
to look for useful webpages with information about chess. There are millions of
webpages that mention the word “chess”, so a key issue a search engine needs to
deal with is what order to show the search results in. It would be a disaster to have
to wade through thousands of garbage pages that mention “chess” before finding
informative content.
In the early days of the web, various approaches to this ranking problem were
used. For example, some search engines employed people to manually decide which
pages were most useful, like a museum curator. But aside from being subjective
and expensive, this quickly became infeasible as the web grew. Others focused on
the number of times the search term was mentioned on the site. But a page that
mentions “chess” over and over again could easily be less useful than a concise
reference page or a page about chess that doesn’t repeatedly mention the word.
Furthermore, this method is very open to abuse: a spam page could boost its ranking
just by including a long list of words repeated over and over again.
Both of the above methods ignore the structure of the web: which pages link to which
other pages? Taking the link structure into account led to dramatic improvements
in search engines. As a first attempt, one could rank a page based on how many
other pages link to it. That is, if Page A links to Page B, we consider it a vote for
B, and we rank pages based on how many votes they have.
But this is again very open to abuse: a spam page could boost its ranking by creating
thousands of other spam pages linking to it. And though it may seem democratic
for each page to have equal voting power, an incoming link from a reliable page is
more meaningful than a link from an uninformative page. Google PageRank, which
was introduced in 1998 by Sergey Brin and the aptly named Larry Page, ranks


512                                                            Introduction to Probability

the importance of a page not only by how many pages link to it, but also by the
importance of those pages.
Consider the web as a directed network—which is what it is. Each page on the
web is a node, and links between nodes represent links between pages. For example,
suppose for simplicity that the web only has 4 pages, connected as shown in the
figure below.


                                   1                2



                                   3                4

FIGURE 11.5
It’s a small web after all.

Imagine someone randomly surfing the web, starting at some page and then ran-
domly clicking links to go from one page to the next (with equal probabilities for
all links on the current page). The idea of PageRank is to measure the importance
of a page by the long-run fraction of time spent at that page.
Of course, some pages may have no outgoing links at all, such as page 4 above.
When the web surfer encounters such a page, rather than despairing they open up a
new browser window and visits a uniformly random page. Thus a page with no links
is converted to a page that links to every page, including itself. For the example
above, the resulting transition matrix is
                                                
                                  0 1/2 0 1/2
                                1/2 0 1/2 0 
                              Q=
                                 0
                                                 .
                                      0   0   1 
                                 1/4 1/4 1/4 1/4

In general, let M be the number of pages on the web, let Q be the M by M tran-
sition matrix of the chain described above, and let s be the stationary distribution
(assuming it exists and is unique). Think of sj as a measure of how important page
j is. Intuitively, the equation
                                         X
                                    sj =    si qij
                                            i

says that the score of page j should be based not only on how many other pages link
to it, but on their scores. Furthermore, the “voting power” of a page gets diluted if
it has a lot of outgoing links: it counts for more if page i’s only link is to page j (so
that qij = 1) than if page i has thousands of links, one of which happens to be to
page j.
```
