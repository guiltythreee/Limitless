# Chapter 8: Transformations

**Book:** Introduction to Probability, Second Edition  
**Authors:** Joseph K. Blitzstein and Jessica Hwang  
**Printed pages:** 367–410

> Source transcription from the supplied textbook PDF. Text extraction preserves the original order and page content as far as the PDF text layer allows. Check mathematical notation and figure references against the source where extraction is ambiguous.

```text
Transformations                                                                                         381




                      Beta(0.5, 0.5)                                        Beta(2, 1)




                                                       2.0
     5
     4




                                                       1.5
     3
   PDF




                                                   PDF
                                                   1.0
     2




                                                       0.5
     1




                                                       0.0
     0




          0.0   0.2    0.4       0.6   0.8   1.0                0.0   0.2   0.4       0.6   0.8   1.0
                             x                                                    x


                       Beta(2, 8)                                           Beta(5, 5)
                                                       2.5
     3




                                                       2.01.5
      2
   PDF




                                                      PDF
                                                   1.0
     1




                                                       0.5
                                                       0.0
     0




          0.0   0.2    0.4       0.6   0.8   1.0                0.0   0.2   0.4       0.6   0.8   1.0
                             x                                                    x



FIGURE 8.4
Beta PDFs for various values of a and b. Clockwise from top left: Beta(0.5, 0.5),
Beta(2, 1), Beta(5, 5), Beta(2, 8).


382                                                             Introduction to Probability

An integral of this form is called a beta integral, and we will need to do some calculus
to derive a general formula for β(a, b). But in the special case where a and b are
positive integers, Thomas Bayes figured out how to do the integral using a story
proof rather than calculus!
Story 8.3.2 (Bayes’ billiards). Show without using calculus that for any integers k
and n with 0 ≤ k ≤ n,
                        Z 1 
                              n k                    1
                                 x (1 − x)n−k dx =       .
                          0   k                    n+1

Solution:
By telling two stories, we will show that the left-hand and right-hand sides are both
equal to P (X = k), where X is an r.v. that we will construct.
 Story 1 : Start with n+1 balls, n white and 1 gray. Randomly throw each ball onto
 the unit interval [0, 1], such that the positions of the balls are i.i.d. Unif(0, 1). Let
 X be the number of white balls to the left of the gray ball; X is a discrete r.v. with
 possible values 0, 1, . . . , n. Figure 8.5 illustrates the setup of our experiment.
 To get the probability of the event X = k, we use LOTP, conditioning on the
 position of the gray ball, which we’ll call B. Conditional on B = p, the number
 of white balls landing to the left of p has a Bin(n, p) distribution, since we can
 consider each of the white balls to be an independent Bernoulli trial, where
 success is defined as landing to the left of p. Let f be the PDF of B; f (p) = 1
 since B ∼ Unif(0, 1). So
                     Z 1                            Z 1 
                                                          n k
        P (X = k) =      P (X = k|B = p)f (p)dp =            p (1 − p)n−k dp.
                      0                               0   k




                  0                                                      1

FIGURE 8.5
Bayes’ billiards. Here we throw n = 6 white balls and one gray ball onto the unit
interval, and we observe X = 2 balls to the left of the gray ball.

 Story 2 : Start with n + 1 balls, all white. Randomly throw each ball onto the
 unit interval; then choose one ball at random and paint it gray. Again, let X be
 the number of white balls to the left of the gray ball. By symmetry, any one of
 the n + 1 balls is equally likely to be painted gray, so
                                                  1
                                  P (X = k) =
                                                 n+1
 for k = 0, 1, . . . , n.


Transformations                                                                         383

Here’s the crux: X has the same distribution in the two stories! It does not matter
whether we paint the gray ball first and then throw, or whether we throw first and
then paint the gray ball. So P (X = k) is the same in Story 1 and Story 2, and

                            Z 1 
                                n k                   1
                                   p (1 − p)n−k dp =
                             0  k                    n+1

for k = 0, 1, . . . , n. Despite the k’s in the integrand, the value of the integral doesn’t
depend on k. Substituting a − 1 for k and b − 1 for n − k, this shows that for positive
integer values of a and b,

                                        1             (a − 1)!(b − 1)!
                   β(a, b) =                     =                    .
                               (a + b − 1) a+b−2
                                            a−1
                                                        (a + b − 1)!


Later in this chapter, we’ll learn what β(a, b) is for general a and b.                   

The Beta is a flexible family of distributions on (0, 1), and has many stories. One of
these stories is that a Beta r.v. is often used to represent an unknown probability.
That is, we can use the Beta to put probabilities on unknown probabilities!

Story 8.3.3 (Beta-Binomial conjugacy). We have a coin that lands Heads with
probability p, but we don’t know what p is. Our goal is to infer the value of p
after observing the outcomes of n tosses of the coin. The larger that n is, the more
accurately we should be able to estimate p.

There are several ways to go about doing this. One major approach is Bayesian
inference, which treats all unknown quantities as random variables. In the Bayesian
approach, we would treat the unknown probability p as a random variable and give
p a distribution. This is called a prior distribution, and it reflects our uncertainty
about the true value of p before observing the coin tosses. After the experiment is
performed and the data are gathered, the prior distribution is updated using Bayes’
rule; this yields the posterior distribution, which reflects our new beliefs about p.

Let’s see what happens if the prior distribution on p is a Beta distribution. Let
p ∼ Beta(a, b) for known constants a and b, and let X be the number of Heads in
n tosses of the coin. Conditional on knowing the true value of p, the tosses would
just be independent Bernoulli trials with probability p of success, so

                                    X|p ∼ Bin(n, p).

Note that X is not marginally Binomial; it is conditionally Binomial, given p. The
marginal distribution of X is called the Beta-Binomial distribution. To get the
posterior distribution of p, we use Bayes’ rule (in a hybrid form, since X is discrete
and p is continuous). Letting f (p) be the prior distribution and f (p|X = k) be the


384                                                           Introduction to Probability

posterior distribution after observing k Heads,

                            P (X = k|p)f (p)
              f (p|X = k) =
                                P (X = k)
                             
                              n k                  1
                                  p (1 − p)n−k ·         pa−1 (1 − p)b−1
                              k                  β(a, b)
                          =                                              .
                                            P (X = k)

The denominator, which is the marginal PMF of X, is given by
                   Z 1                      Z 1 
                                                n k
       P (X = k) =     P (X = k|p)f (p)dp =        p (1 − p)n−k f (p)dp.
                    0                        0  k

For a = b = 1 (which gives a Unif(0, 1) prior on p), we showed in the Bayes’ billiards
story that P (X = k) = 1/(n + 1), i.e., X is Discrete Uniform on {0, 1, . . . , n}. For
a and b any positive integers, we can again use Bayes’ billiards to find P (X = k);
interestingly, X then turns out to have a Negative Hypergeometric distribution (the
story and PMF of which we saw in Example 4.4.7).
But it does not seem easy to find P (X = k) in general for real a, b. Relatedly, we
still have not evaluated β(a, b) in general. Are we stuck?
Actually, the calculation is much easier than it appears at first. The conditional
PDF f (p|X = k) is a function of p, which means everything that doesn’t depend
on p is just a constant. We can drop all these constants and find the PDF up to a
multiplicative constant (and then the normalizing constant is whatever it needs to
be to make the PDF integrate to 1). This gives

                        f (p|X = k) ∝ pa+k−1 (1 − p)b+n−k−1 ,

which is the Beta(a + k, b + n − k) PDF, up to a multiplicative constant. Therefore,
the posterior distribution of p is

                         p|X = k ∼ Beta(a + k, b + n − k).

The posterior distribution of p after observing X = k is still a Beta distribution!
This is a special relationship between the Beta and Binomial distributions called
conjugacy: if we have a Beta prior distribution on p and data that are conditionally
Binomial given p, then when going from prior to posterior, we don’t leave the family
of Beta distributions. We say that the Beta is the conjugate prior of the Binomial.
Furthermore, notice the very simple formula for updating the distribution of p. We
just add the number of observed successes, k, to the first parameter of the Beta
distribution, and the number of observed failures, n − k, to the second parameter.
So a and b have a concrete interpretation in this context, at least when a and b
are positive integers: think of a − 1 as the number of prior successes and b − 1 as
the number of prior failures in earlier experiments (these prior experiments could
be real or imagined). Adding on k successes and n − k failures from the current


Transformations                                                                                                  385

experiment, we have a + k − 1 successes and b + n − k − 1 failures, and the Beta(a, b)
prior gets updated to a Beta(a + k, b + n − k) posterior.
As in Section 2.6, we can sequentially update our beliefs as we get more and more
evidence: we start with a prior distribution and update it to get a posterior distri-
bution, which becomes the new prior distribution, which we update to get a new
posterior distribution, etc. The beauty here is that all of this can be done within the
Beta family of distributions, with easy updates to the parameters based on tallying
the observed successes and failures.
For concreteness, Figure 8.6 shows the case where the prior is Beta(1, 1) (which is
equivalent to Unif(0, 1), as noted earlier), and we observe n = 5 coin tosses, all of
which happen to land Heads. Then the posterior is Beta(6, 1), which is plotted on
the right half of Figure 8.6. Notice how the posterior distribution incorporates the
evidence from the coin tosses: larger values of p have higher density, consistent with
the fact that we observed all Heads.
           1.4




                                                                     6
                                                                     5
           1.2




                                                         posterior PDF
                                                                     4
   prior PDF
           1.0




                                                                     3
                                                                     2
           0.8




                                                                     1
           0.6




                                                                     0




                 0.0   0.2   0.4       0.6   0.8   1.0                   0.0   0.2   0.4       0.6   0.8   1.0
                                   p                                                       p


FIGURE 8.6
Beta is conjugate prior of Binomial. Left: prior is Unif(0, 1). Right: after observing
5 Heads in 5 tosses, posterior is Beta(6, 1).

This model is a continuous analog of Example 2.3.7, our very first example of Bayes’
rule. In that example, we also had a coin whose probability of Heads p was unknown,
but our prior information led us to believe that p could only take on one of two
possible values, 1/2 or 3/4. For this reason, our prior distribution on p—though we
didn’t call it that at the time!—was discrete. In particular, our prior PMF was

                                             P (p = 1/2) = 1/2,
                                             P (p = 3/4) = 1/2.

After observing three Heads in a row, we updated this PMF to obtain the posterior
PMF, which assigned a probability of 0.23 to p = 1/2 and a probability of 0.77


386                                                         Introduction to Probability

to p = 3/4. The same logic applies to the example in this chapter, except that we
now give p a continuous prior distribution, which is appropriate if we believe that
p could possibly take on any value between 0 and 1.                              
To conclude the section, here are two examples that illustrate how Beta-Binomial
conjugacy and Bayes’ billiards can make some seemingly complicated problems
much easier.
Example 8.3.4 (Bayes’ serum). A new treatment, Bayes’ serum, has just been
developed for the disease conditionitis. A clinical trial is about to be conducted,
to study how effective the treatment is. Bayes’ serum will be applied to n patients
who have conditionitis. Given p, the patients’ outcomes are independent, with each
patient having probability p of being cured by the treatment. But p is unknown.
To quantify our uncertainty about p, we model p as a random variable, with prior
distribution p ∼ Unif(0, 1).
(a) Find the probability that exactly k out of the n patients will be cured by the
treatment (unconditionally, not given p).
(b) Now suppose that the treatment is extremely effective in the clinical trial: all n
patients are cured! Given this information, find the probability that p exceeds 1/2.
Your answer should be fully simplified, and expressed only in terms of n.
Solution:
(a) By LOTP followed by Bayes’ billiards or pattern-matching to a Beta PDF, the
probability is        Z 1 
                           n k                      1
                               p (1 − p)n−k dp =        .
                        0  k                      n + 1

(b) By Beta-Binomial conjugacy, the posterior distribution of p given the data is
Beta(1 + n, 1), which has PDF (n + 1)pn for 0 < p < 1. Thus,
                         Z 1
                       1                             1          1
               P p>       =      (n + 1)pn dp = pn+1     = 1 − n+1 .           
                       2     1/2                     1/2      2

Example 8.3.5. A basketball player will shoot N ∼ Pois(λ) free throws in a
game tomorrow. Let Xj be the indicator of her making their jth free throw, and
X = X1 + · · · + XN be the total number of free throws she makes in the game (so
X = 0 if N = 0). To model our uncertainty about how good a free throw shooter she
is, let p ∼ Beta(a, b). Given p, the player has probability p of making a free throw
and probability q = 1 − p of missing it. Assume that X1 , X2 , . . . are conditionally
independent given p, and that N is independent of p, X1 , X2 , . . . .
(a) Find the conditional distribution of X given N, p.
(b) Find the conditional distribution of X given p.
(c) Find the conditional distribution of X given N , for the case a = b = 1.
(d) Find the conditional distribution of p given X, N .


Transformations                                                                    387

Solution:
(a) By the story of the Binomial, X|(N, p) ∼ Bin(N, p).
(b) By the chicken-egg story, X|p ∼ Pois(λp).
(c) For k = 0, 1, . . . , n, by LOTP and Bayes’ billiards we have
                                      Z 1 
                                           n k                     1
                P (X = k|N = n) =             p (1 − p)n−k dp =        .
                                       0   k                     n + 1

So the conditional distribution of X given N is Discrete Uniform on {0, 1, . . . , N }.
(d) By Beta-Binomial conjugacy, p|(X, N ) ∼ Beta(a + X, b + N − X).                  




8.4    Gamma

The Gamma distribution is a continuous distribution on the positive real line; it is a
generalization of the Exponential distribution. While an Exponential r.v. represents
the waiting time for the first success under conditions of memorylessness, we shall
see that a Gamma r.v. represents the total waiting time for multiple successes.
Before writing down the PDF, we first introduce the gamma function, a very famous
function in mathematics that extends the factorial function beyond the realm of
nonnegative integers.
Definition 8.4.1 (Gamma function). The gamma function Γ is defined by
                                  Z ∞
                                            dx
                          Γ(a) =      xa e−x ,
                                   0        x
for real numbers a > 0.
We could also cancel an x and write the integrand as xa−1 e−x , but it turns out to be
convenient having the dx
                       x since it is common to make a transformation of the form
u = cx, and then we have the handy fact that du        dx
                                                 u = x . Here are two important
properties of the gamma function.
• Γ(a + 1) = aΓ(a) for all a > 0. This follows from integration by parts:
                  Z ∞                       ∞     Z ∞
                        a −x          a −x
       Γ(a + 1) =      x e dx = −x e          +a       xa−1 e−x dx = 0 + aΓ(a).
                     0                       0       0


• Γ(n) = (n − 1)! if n is a positive integer. This can be proved by induction, starting
  with n = 1 and using the recursive relation Γ(a + 1) = aΓ(a). Thus, if we evaluate
  the gamma function at positive integer values, we recover the factorial function
  (albeit shifted by 1).


388                                                              Introduction to Probability

Now let’s suppose that on a whim, we decide to divide both sides of the above
definition by Γ(a). We have
                               Z ∞
                                    1 a −x dx
                            1=          x e     ,
                                0  Γ(a)       x
so the function under the integral is a valid PDF supported on (0, ∞). This is the
definition of the PDF of the Gamma distribution. Specifically, we say that X has
the Gamma distribution with parameters a and 1, denoted X ∼ Gamma(a, 1), if its
PDF is
                                      1 a −x 1
                          fX (x) =       x e     , x > 0.
                                   Γ(a)        x
From the Gamma(a, 1) distribution, we obtain the general Gamma distribution
by a scale transformation: if X ∼ Gamma(a, 1) and λ > 0, then the distribution of
Y = X/λ is called the Gamma(a, λ) distribution. By the change of variables formula
with x = λy and dx/dy = λ, the PDF of Y is
                        dx    1              1    1             1
      fY (y) = fX (x)      =      (λy)a e−λy λ =      (λy)a e−λy ,            y > 0.
                        dy   Γ(a)           λy   Γ(a)           y
This is summarized in the following definition.
Definition 8.4.2 (Gamma distribution). An r.v. Y is said to have the Gamma
distribution with parameters a and λ, where a > 0 and λ > 0, if its PDF is
                                     1             1
                          f (y) =        (λy)a e−λy ,   y > 0.
                                    Γ(a)           y
We write Y ∼ Gamma(a, λ).
Taking a = 1, the Gamma(1, λ) PDF is f (y) = λe−λy for y > 0, so the Gamma(1, λ)
and Expo(λ) distributions are the same. The extra parameter a allows Gamma
PDFs to have a greater variety of shapes. Figure 8.7 shows four Gamma PDFs. For
small values of a, the PDF is skewed, but as a increases, the PDF starts to look
more symmetrical and bell-shaped; we will learn the reason for this in Chapter 10.
Increasing λ compresses the PDF toward smaller values, as we can see by comparing
the Gamma(3, 1) and Gamma(3, 0.5) PDFs.
Let’s find the mean, variance, and other moments of the Gamma distribution, start-
ing with X ∼ Gamma(a, 1). We’ll use properties of the gamma function as well as
the technique of doing integrals by pattern recognition. For the mean, we write down
the definition of E(X),
                                     Z ∞
                                           1 a+1 −x dx
                           E(X) =              x e        ,
                                      0   Γ(a)          x
but instead of attempting a gruesome integration by parts, we recognize that after
taking out 1/Γ(a), what’s left is precisely the gamma function evaluated at a + 1.
Therefore
                                   Γ(a + 1)     aΓ(a)
                         E(X) =              =        = a.
                                     Γ(a)        Γ(a)


Transformations                                                                           389




                      Gamma(3, 1)                               Gamma(3, 0.5)




                                                 0.10
     0.2
   PDF




                                               PDF
                                                 0.05
     0.1




                                                 0.00
     0.0




            0     5        10        15   20            0   5        10         15   20
                            x                                         x


                      Gamma(10, 1)                              Gamma(5, 0.5)
                                                 0.10
     0.10




                                               0.05
   PDF




                                               PDF
     0.05
     0.00




                                                 0.00




            0     5        10        15   20            0   5        10         15   20
                            x                                         x



FIGURE 8.7
Gamma PDFs for various values of a and λ. Clockwise from top left: Gamma(3, 1),
Gamma(3, 0.5), Gamma(5, 0.5), Gamma(10, 1).


390                                                           Introduction to Probability

Similarly, for the variance, LOTUS gives us an integral expression for the second
moment,                            Z ∞
                               2         1 a+2 −x dx
                           E(X ) =          x e        ,
                                    0  Γ(a)          x
and we recognize the gamma function evaluated at a + 2. Therefore

                               Γ(a + 2)   (a + 1)aΓ(a)
                   E(X 2 ) =            =              = (a + 1)a
                                 Γ(a)         Γ(a)

and
                              Var(X) = (a + 1)a − a2 = a.
So for X ∼ Gamma(a, 1), E(X) = Var(X) = a.
The cth moment is no harder than the second moment; we just use LOTUS and
recognize the definition of Γ(a + c). This gives
                                Z ∞
                          c            1 a+c −x dx   Γ(a + c)
                     E(X ) =               x e     =
                                 0    Γ(a)      x      Γ(a)

for all real c such that the integral converges, i.e., for c > −a.
We can now transform to Y = X/λ ∼ Gamma(a, λ) to get

                             1           a
                     E(Y ) =   E(X) = ,
                             λ           λ
                              1              a
                   Var(Y ) = 2 Var(X) = 2 ,
                             λ              λ
                              1            1 Γ(a + c)
                    E(Y c ) = c E(X c ) = c ·         ,      c > −a.
                             λ             λ   Γ(a)

Looking back at the Gamma PDF plots, they are consistent with our finding that
the mean and variance are increasing in a and decreasing in λ.
So far, we’ve been learning about the Gamma distribution using the PDF, which
allowed us to discern general patterns from PDF plots and to derive the mean
and variance. But the PDF doesn’t provide much insight about why we’d ever use
the Gamma distribution, and it doesn’t give us much of an interpretation for the
parameters a and λ. For this, we need to connect the Gamma to other named
distributions through stories. The rest of this section is devoted to stories for the
Gamma distribution.
In the special case where a is an integer, we can represent a Gamma(a, λ) r.v. as a
sum (convolution) of i.i.d. Expo(λ) r.v.s.
Theorem 8.4.3. Let X1 , . . . , Xn be i.i.d. Expo(λ). Then

                           X1 + · · · + Xn ∼ Gamma(n, λ).


Transformations                                                                   391
                           λ
Proof. The Expo(λ) MGF is λ−t for t < λ, so the MGF of X1 + · · · + Xn is
                                            n
                                          λ
                             Mn (t) =
                                        λ−t
for t < λ. Let Y ∼ Gamma(n, λ); we’ll show that the MGF of Y is the same as that
of X1 + · · · + Xn . By LOTUS,
                                 Z ∞
                                          1             dy
                            tY
                         E(e ) =     ety      (λy)n e−λy .
                                  0      Γ(n)           y
Again, we’ll use pattern recognition to do the integral. We just need to do algebraic
manipulations until what’s left inside the integral is a recognizable Gamma PDF:
                           Z ∞
                                    1              dy
                    tY
                 E(e ) =       ety      (λy)n e−λy
                            0      Γ(n)            y
                                    Z ∞
                              λn           1 −(λ−t)y              dy
                        =         n
                                               e       ((λ − t)y)n .
                           (λ − t) 0 Γ(n)                         y
We pulled λn out of the integral, then multiplied by (λ−t)n on the inside while divid-
ing by it on the outside. Now the expression inside the integral is the Gamma(n, λ−t)
PDF, assuming t < λ. Since PDFs integrate to 1, we have
                                                  n
                                     tY        λ
                                 E(e ) =
                                              λ−t
for t < λ; if t ≥ λ the integral fails to converge.
We have shown that X1 + · · · + Xn and Y ∼ Gamma(n, λ) have the same MGF.
Since the MGF determines the distribution, X1 + · · · + Xn ∼ Gamma(n, λ).
Alternatively, we can compute the convolution integral inductively. It suffices to
consider the case λ = 1, since after having done that case we can rescale the r.v.s to
prove the result for general λ. Let Tn = X1 + · · · + Xn . We will show by induction
that Tn ∼ Gamma(n, 1) for all n ≥ 1. For n = 1, this is true since the Gamma(1, 1)
PDF is e−x (for x > 0), which is the same as the Expo(1) PDF. Now assume
that Tn ∼ Gamma(n, 1), and show that Tn+1 ∼ Gamma(n + 1, 1). The PDF of
Tn+1 = Tn + Xn+1 is given by the convolution integral
Z ∞                               Z t                           Z t
                              1                             e−t                 tn e−t
    fTn (x)fXn+1 (t−x)dx =            xn−1 e−x e−(t−x) dx =         xn−1 dx =
 0                           Γ(n) 0                         Γ(n) 0            Γ(n + 1)
for t > 0, which completes the induction.                                           

Thus, if Y ∼ Gamma(a, λ) with a an integer, we can represent Y as a sum of
i.i.d. Expo(λ) r.v.s, X1 + · · · + Xa , and get the mean and variance right away:
                                                             a
                    E(Y ) = E(X1 + · · · + Xa ) = aE(X1 ) =    ,
                                                             λ
                                                                 a
                  Var(Y ) = Var(X1 + · · · + Xa ) = aVar(X1 ) = 2 ,
                                                                 λ


392                                                             Introduction to Probability

in agreement with the results we derived earlier for general a.

Theorem 8.4.3 also allows us to connect the Gamma distribution to the story of the
Poisson process. We showed in Chapter 5 that in a Poisson process of rate λ, the
interarrival times are i.i.d. Expo(λ) r.v.s. But the total waiting time Tn for the nth
arrival is the sum of the first n interarrival times; for instance, Figure 8.8 illustrates
how T3 is the sum of the 3 interarrival times X1 , X2 , X3 . Therefore, by the theorem,
Tn ∼ Gamma(n, λ). The interarrival times in a Poisson process are Exponential
r.v.s, while the raw arrival times are Gamma r.v.s.
                    +

                                   +
                                   +


                                                          +
                                                          +
            0           T1           T2        T3          T4    T5

                  X1          X2          X3        ...

FIGURE 8.8
Poisson process. The interarrival times Xj are i.i.d. Expo(λ), while the raw arrival
times Tj are Gamma(j, λ).

h 8.4.4. Unlike the Xj , the Tj are not independent, since they are constrained to
be increasing; nor are they identically distributed.

At last, we have an interpretation for the parameters of the Gamma(a, λ) distribu-
tion. In the Poisson process story, a is the number of successes we are waiting for,
and λ is the rate at which successes arrive; Y ∼ Gamma(a, λ) is the total waiting
time for the ath arrival in a Poisson process of rate λ.

A consequence of this story is that a convolution of Gammas with the same λ is
still Gamma. Exercise 29 explores this fact from several perspectives.

When we introduced the Exponential distribution, we viewed it as the continuous
analog of the Geometric distribution: the Geometric waits for the first success in
discrete time, and the Exponential waits for the first success in continuous time.
Likewise, we can now say that the Gamma distribution is the continuous analog of
the Negative Binomial distribution: the Negative Binomial is a sum of Geometric
waiting times, and the Gamma is a sum of Exponential waiting times. In Exercise
54 you will use MGFs to show that the Gamma distribution can be obtained as a
continuous limit of the Negative Binomial distribution.

A final story about the Gamma is that it shares the same special relationship with
the Poisson that the Beta shares with the Binomial: the Gamma is the conjugate
prior of the Poisson. Earlier we saw that the Beta distribution can represent an un-
known probability of success because its support is (0, 1). The Gamma distribution,
on the other hand, can represent an unknown rate in a Poisson process because its
support is (0, ∞).


Transformations                                                                      393

To investigate, we’ll return to Blotchville, where buses arrive in a Poisson process of
rate λ. Previously it was assumed that λ = 1/10, so that the times between buses
were i.i.d. Exponentials with mean 10 minutes, but now we’ll assume Fred doesn’t
know the rate λ at which buses arrive and needs to figure it out. Fred will follow
the Bayesian approach and treat the unknown rate as a random variable.
Story 8.4.5 (Gamma-Poisson conjugacy). In Blotchville, buses arrive at a certain
bus stop according to a Poisson process with rate λ buses per hour, where λ is
unknown. Based on his very memorable adventures in Blotchville, Fred quantifies
his uncertainty about λ using the prior λ ∼ Gamma(r0 , b0 ), where r0 and b0 are
known, positive constants with r0 an integer.
To better understand the bus system, Fred wants to learn more about λ. He is a
very patient person, and decides that he will sit at the bus stop for t hours and
count how many buses arrive in this time interval. Let Y be the number of buses in
this time interval, and suppose Fred observes that Y = y.
(a) Find Fred’s hybrid joint distribution for Y and λ.
(b) Find Fred’s marginal distribution for Y .
(c) Find Fred’s posterior distribution for λ, i.e., his conditional distribution of λ
given the data y.
(d) Find Fred’s posterior mean E(λ|Y = y) and posterior variance Var(λ|Y = y).
Solution: Notice the similarities between the structure of this problem and that of
the hybrid joint distribution from Example 7.1.26. We know that λ ∼ Gamma(r0 , b0 )
marginally, and by definition of Poisson process, conditional on knowing the true
rate λ, the number of buses in an interval of length t is distributed Pois(λt). In
other words, what we’re given is

                                    λ ∼ Gamma(r0 , b0 )
                                 Y |λ ∼ Pois(λt).

Then we are asked to flip it around: find the marginal distribution of Y and the
conditional distribution of λ given Y = y, which is the posterior distribution. This
is characteristic of Bayesian inference: we have a prior distribution for the unknown
parameters (in this case, a Gamma distribution for λ) and a model for the data
conditional on the unknown parameters (in this case, a Poisson distribution for Y
given λ), and we use Bayes’ rule to get the distribution of the unknowns conditional
on the observed data. So let’s get started.
(a) Let f0 be the prior PDF of λ. The hybrid joint distribution of Y and λ is

                                                   e−λt (λt)y (b0 λ)r0 e−b0 λ
                  f (y, λ) = P (Y = y|λ)f0 (λ) =                              ,
                                                      y!         λΓ(r0 )

for y = 0, 1, 2, . . . and λ > 0. The hybrid joint distribution is plotted in Figure 8.9;


394                                                        Introduction to Probability




                                                y
FIGURE 8.9
Hybrid joint distribution of Y and λ. (a) Conditioning on a particular value of λ,
the relative heights form a Poisson PMF. (b) In the other direction, conditioning
on Y = y gives the posterior distribution of λ.

there is a conditional PMF of Y for every value of λ and a conditional PDF of λ
for every value of Y .
(b) To get the marginal PMF of Y , we integrate out λ from the hybrid joint distri-
bution; this is also a form of LOTP. This gives
                                  Z ∞
                      P (Y = y) =     P (Y = y|λ)f0 (λ)dλ
                                   0
                                  Z ∞ −λt
                                      e (λt)y (b0 λ)r0 e−b0 λ dλ
                                =                                .
                                   0      y!       Γ(r0 )     λ
Let’s do the integral by pattern recognition, focusing in on the terms involving
λ. We spot λr0 +y and e−(b0 +t)λ lurking in the integrand, which suggests pattern-
matching to a Gamma(r0 + y, b0 + t) PDF. Pull out all the terms that don’t depend
on λ, then multiply by whatever it takes to get the desired PDF inside the integral,


Transformations                                                                            395

remembering to multiply by the reciprocal on the outside:
                        Z ∞
                ty br00                       dλ
   P (Y = y) =              e−(b0 +t)λ λr0 +y
               y!Γ(r0 ) 0                     λ
                              y  r0     Z ∞
               Γ(r0 + y)     t b0                 1        −(b0 +t)λ            r0 +y dλ
             =                    r  +y
                                                         e           ((b0 + t)λ)
                y!Γ(r0 ) (b0 + t) 0      0    Γ(r0 + y)                               λ
                                      y          r0
               (r0 + y − 1)!       t           b0
             =                                          .
                (r0 − 1)!y!     b0 + t       b0 + t

In the last step, we used the property Γ(n) = (n − 1)!, which is applicable because
r0 is an integer. This is the NBin(r0 , b0 /(b0 + t)) PMF, so the marginal distribution
of Y is Negative Binomial with parameters r0 and b0 /(b0 + t).
(c) By Bayes’ rule, the posterior PDF of λ is given by

                                           P (Y = y|λ)f0 (λ)
                              f1 (λ|y) =                     .
                                               P (Y = y)

We found P (Y = y) in the previous part, but since it does not depend on λ, we
can just treat it as part of the normalizing constant. Absorbing this and other
multiplicative factors that don’t depend on λ into the normalizing constant,
                                                    1                    1
                    f1 (λ|y) ∝ e−λt λy λr0 e−b0 λ     = e−(b0 +t)λ λr0 +y ,
                                                    λ                    λ
which shows that the posterior distribution of λ is Gamma(r0 + y, b0 + t).
When going from prior to posterior, the distribution of λ stays in the Gamma family,
so the Gamma is indeed the conjugate prior for the Poisson.
Now that we have the posterior PDF of λ, we have a more elegant approach to
solving (b). Rearranging Bayes’ rule, the marginal PMF of Y is

                                            P (Y = y|λ)f0 (λ)
                             P (Y = y) =                      ,
                                                 f1 (λ|y)
where we know the numerator from the statement of the problem and the denomi-
nator from the calculation we just did. Plugging in these ingredients and simplifying
again yields
                            Y ∼ NBin(r0 , b0 /(b0 + t)).

(d) Since conditional PDFs are PDFs, it is perfectly fine to calculate the expectation
and variance of λ with respect to the posterior distribution. The mean and variance
of the Gamma(r0 + y, b0 + t) distribution give us
                               r0 + y                                  r0 + y
              E(λ|Y = y) =                 and      Var(λ|Y = y) =              .
                               b0 + t                                 (b0 + t)2

This example gives another interpretation for the parameters in a Gamma when


396                                                                  Introduction to Probability

it is being used as a conjugate prior. Fred’s Gamma(r0 , b0 ) prior got updated to a
Gamma(r0 +y, b0 +t) posterior after observing y arrivals in t hours. We can imagine
that in the past, Fred observed r0 buses arrive in b0 hours; then after the new data,
he has observed r0 + y buses in b0 + t hours. So we can interpret r0 as the number
of prior arrivals and b0 as the total time required for those prior arrivals.      




8.5    Beta-Gamma connections

In this section, we will unite the Beta and Gamma distributions with a common
story. As an added bonus, the story will give us an expression for the normalizing
constant of the Beta(a, b) PDF in terms of gamma functions, and it will allow us to
easily find the expectation of the Beta(a, b) distribution.
Story 8.5.1 (Bank–post office). While running errands, you need to go to the
bank, then to the post office. Let X ∼ Gamma(a, λ) be your waiting time in line
at the bank, and let Y ∼ Gamma(b, λ) be your waiting time in line at the post
office (with the same λ for both). Assume X and Y are independent. What is the
joint distribution of T = X + Y (your total wait at the bank and post office) and
        X
W = X+Y     (the fraction of your waiting time spent at the bank)?
Solution:
We’ll do a change of variables in two dimensions to get the joint PDF of T and W .
                     x
Let t = x + y, w = x+y . Then x = tw, y = t(1 − w), and
                                                            
                                ∂(x, y)             w   t
                                        =                        ,
                                ∂(t, w)           1 − w −t

which has an absolute determinant of t. Therefore
                                      ∂(x, y)
      fT,W (t, w) = fX,Y (x, y) · |           |
                                      ∂(t, w)
                  = fX (x)fY (y) · t
                      1              1    1           1
                  =      (λx)a e−λx ·       (λy)b e−λy · t
                    Γ(a)             x Γ(b)           y
                      1                 1    1                            1
                  =      (λtw)a e−λtw     ·    (λt(1 − w))b e−λt(1−w)          · t.
                    Γ(a)               tw Γ(b)                        t(1 − w)
Let’s group all the terms involving w together, and all the terms involving t together:
                           1                                 1
         fT,W (t, w) =          wa−1 (1 − w)b−1 (λt)a+b e−λt
                       Γ(a)Γ(b)                              t
                                                                           
                         Γ(a + b) a−1                     1                 1
                     =            w (1 − w)b−1                 (λt)a+b e−λt     ,
                         Γ(a)Γ(b)                     Γ(a + b)              t


Transformations                                                                 397

for 0 < w < 1 and t > 0. The form of the joint PDF, together with Proposi-
tion 7.1.21, tells us several things:
1. Since the joint PDF factors into a function of t times a function of w, we have
that T and W are independent: the total waiting time is independent of the fraction
of time spent at the bank.
2. We recognize the marginal PDF of T and deduce that T ∼ Gamma(a + b, λ).
3. The PDF of W is
                             Γ(a + b) a−1
                  fW (w) =            w (1 − w)b−1 ,   0 < w < 1,
                             Γ(a)Γ(b)
by Proposition 7.1.21 or just by integrating out T from the joint PDF of T and
W . This PDF is proportional to the Beta(a, b) PDF, so it is the Beta(a, b) PDF!
Note that as a byproduct of the calculation we have just done, we have found the
normalizing constant of the Beta distribution:
                                   1       Γ(a + b)
                                         =
                                 β(a, b)   Γ(a)Γ(b)
is the constant that goes in front of the Beta(a, b) PDF.                         
To summarize, the bank–post office story tells us that when we add independent
Gamma r.v.s X and Y with the same rate λ, the total X +Y has a Gamma distribu-
tion, the fraction X/(X + Y ) has a Beta distribution, and the total is independent
of the fraction.
We can use this result to find the mean of W ∼ Beta(a, b) without the slightest
trace of calculus.
Example 8.5.2 (Beta expectation). With notation as above, note that since T and
W are independent, they are uncorrelated: E(T W ) = E(T )E(W ). Writing this in
terms of X and Y , we have
                                                         
                              X                          X
               E (X + Y ) ·           = E(X + Y )E            ,
                            X +Y                       X +Y
                                                           
                                                         X
                               E(X) = E(X + Y )E              ,
                                                       X +Y
                                                  
                             E(X)             X
                                      =E             .
                           E(X + Y )        X +Y
Ordinarily, the last equality would be a horrendous blunder: faced with an expec-
tation like E(X/(X + Y )), we are not generally permitted to move the E into the
numerator and denominator as we please. In this case, however, the bank–post office
story justifies the move, so finding the expectation of W happily reduces to finding
the expectations of X and X + Y :
                                  
                              X           E(X)          a/λ         a
              E(W ) = E              =             =           =       .
                           X +Y        E(X + Y )     a/λ + b/λ    a+b


398                                                           Introduction to Probability

Another approach is to proceed from the definition of expectation:
                              Z 1
                                  Γ(a + b) a
                     E(W ) =               w (1 − w)b−1 dw.
                               0  Γ(a)Γ(b)

By pattern recognition, the integrand is a Beta(a + 1, b) PDF, up to a normalizing
constant. After obtaining an exact match for the PDF, we apply properties of the
gamma function:
                                         Z 1
                   Γ(a + b) Γ(a + 1)         Γ(a + b + 1) a
         E(W ) =                                          w (1 − w)b−1 dw
                     Γ(a) Γ(a + b + 1) 0 Γ(a + 1)Γ(b)
                       Γ(a + b)    aΓ(a)
                     =
                         Γ(a) (a + b)Γ(a + b)
                         a
                     =      .
                       a+b
In Exercise 30, you will use this approach to find the variance and the other moments
of the Beta distribution.                                                          
Now that we know the Beta normalizing constant, we can also quickly obtain the
PMF of the Beta-Binomial distribution.
Example 8.5.3 (Beta-Binomial PMF). Let X|p ∼ Bin(n, p), with p ∼ Beta(a, b).
As mentioned in Story 8.3.3, X has a Beta-Binomial distribution. Find the marginal
distribution of X.
Solution: Let f (p) be the Beta(a, b) PDF. Then
                               Z 1
                P (X = k) =          P (X = k|p)f (p)dp
                                0
                                    Z 1 
                               1        n k
                           =               p (1 − p)n−k pa−1 (1 − p)b−1 dp
                             β(a, b) 0 k
                               n
                                 Z 1
                           =    k
                                       pa+k−1 (1 − p)b+n−k−1 dp
                             β(a, b) 0
                              
                              n β(a + k, b + n − k)
                           =                        ,
                              k        β(a, b)

for k = 0, 1, . . . , n.                                                              




8.6     Order statistics

The final transformation we will consider in this chapter is the transformation
that takes n random variables X1 , . . . , Xn and sorts them in order, producing the


Transformations                                                                                          399

transformed r.v.s min(X1 , . . . , Xn ), . . . , max(X1 , . . . , Xn ). The transformed r.v.s are
called the order statistics,2 and they are often useful when we are concerned with
the distribution of extreme values, as we alluded to earlier.

Furthermore, like the sample mean X̄n , the order statistics serve as useful summaries
of an experiment, since we can use them to determine the cutoffs for the worst 5%
of observations, the worst 25%, the best 25%, and so forth (such cutoffs are called
the quantiles of the sample).

Definition 8.6.1 (Order statistics). For r.v.s X1 , X2 , . . . , Xn , the order statistics
are the random variables X(1) , X(2) , . . . , X(n) , where


                          X(1) = min(X1 , . . . , Xn ),
                          X(2) is the second-smallest of X1 , . . . , Xn ,
                          ..
                           .
                          X(n−1) is the second-largest of X1 , . . . , Xn ,
                          X(n) = max(X1 , . . . , Xn ).

Note that X(1) ≤ X(2) ≤ . . . ≤ X(n) by definition. We call X(j) the jth order
statistic. If n is odd, X((n+1)/2) is called the sample median of X1 , . . . , Xn .

h 8.6.2. The order statistics X(1) , . . . , X(n) are r.v.s, and each X(j) is a function
of X1 , . . . , Xn . Even if the original r.v.s are independent, the order statistics are
dependent: if we know that X(1) = 100, then X(n) is forced to be at least 100.

We will focus our attention on the case where X1 , . . . , Xn are i.i.d. continuous r.v.s.
The reason is that with discrete r.v.s, there is a positive probability of tied values;
with continuous r.v.s, the probability of a tie is exactly 0, which makes matters much
easier. Thus, for the rest of this section, assume X1 , . . . , Xn are i.i.d. and continuous,
with CDF F and PDF f . We will derive the marginal CDF and PDF of each
individual order statistic X(j) , as well as the joint PDF of (X(1) , . . . , X(n) ).

A complication we run into right away is that the transformation to order statistics
is not invertible: starting with min(X, Y ) = 3 and max(X, Y ) = 5, we can’t tell
whether the original values of X and Y were 3 and 5, respectively, or 5 and 3.
Therefore the change of variables formula from Rn to Rn does not apply. Instead
we will take a direct approach, using pictures to guide us when necessary.

Let’s start with the CDF of X(n) = max(X1 , . . . Xn ). Since X(n) is less than x if

   2
    This term sometimes causes confusion. In statistics (the field of study), any function of the
data is called a statistic. If X1 , . . . , Xn are the data, then min(X1 , . . . , Xn ) is a statistic, and so
is max(X1 , . . . , Xn ). They are called order statistics because we get them by sorting the data in
order (from smallest to largest).


400                                                                     Introduction to Probability

and only if all of the Xj are less than x, the CDF of X(n) is
                           FX(n) (x) = P (max(X1 , . . . , Xn ) ≤ x)
                                         = P (X1 ≤ x, . . . , Xn ≤ x)
                                         = P (X1 ≤ x) . . . P (Xn ≤ x)
                                         = (F (x))n ,
where F is the CDF of the individual Xi . Similarly, X(1) = min(X1 , . . . , Xn ) exceeds
x if and only if all of the Xj exceed x, so the CDF of X(1) is
                         FX(1) (x) = 1 − P (min(X1 , . . . , Xn ) > x)
                                      = 1 − P (X1 > x, . . . , Xn > x)
                                      = 1 − (1 − F (x))n .
The same logic lets us find the CDF of X(j) . For the event X(j) ≤ x to occur,
we need at least j of the Xi to fall to the left of x. This is illustrated in Figure
8.10.
                       at least j to the left of x




                                                          x
                X(1)         ...          X(j) X(j + 1)        X(j + 2) ...
FIGURE 8.10
The event X(j) ≤ x is equivalent to the event “at least j Xi ’s fall to the left of x”.

Since it appears that the number of Xi to the left of x will be important to us,
let’s define a new random variable, N , to keep track of just that: define N to
be the number of Xi that land to the left of x. Each Xi lands to the left of x
with probability F (x), independently. If we define success as landing to the left
of x, we have n independent Bernoulli trials with probability F (x) of success, so
N ∼ Bin(n, F (x)). Then, by the Binomial PMF,
             P (X(j) ≤ x) = P (at least j of the Xi are to the left of x)
                               = P (N ≥ j)
                                 Xn  
                                      n
                               =         F (x)k (1 − F (x))n−k .
                                      k
                                   k=j

We thus have the following result for the CDF of X(j) .
Theorem 8.6.3 (CDF of order statistic). Let X1 , . . . , Xn be i.i.d. continuous r.v.s
with CDF F . Then the CDF of the jth order statistic X(j) is
                                n  
                                X   n
                 P (X(j) ≤ x) =         F (x)k (1 − F (x))n−k .
                                     k
                                             k=j


Transformations                                                                                      401

To get the PDF of X(j) , we can differentiate the CDF with respect to x, but the
resulting expression is ugly (though it can be simplified). Instead we will take a more
direct approach. Consider fX(j) (x)dx, the probability that the jth order statistic falls
into an infinitesimal interval of length dx around x. The only way this can happen
is illustrated in Figure 8.11. We need one of the Xi to fall into the infinitesimal
interval around x, and we need exactly j − 1 of the Xi to fall to the left of x, leaving
the remaining n − j to fall to the right of x.

                                           1 in a tiny interval around x
                  j – 1 to the left of x                                   n – j to the right of x



                                                  (            )
                                                        x
FIGURE 8.11
In order for X(j) to fall within a small interval of x, we require that one of the Xi
fall within the small interval and that exactly j − 1 fall to the left of x.


What is the probability of this extremely specific event? Let’s break up the experi-
ment into stages.
• First, we choose which one of the Xi will fall into the infinitesimal interval around
  x. There are n such choices, each of which occurs with probability f (x)dx, where
  f is the PDF of the Xi .
• Next, we choose exactly j − 1 out of the remaining n − 1j−1
                                                             to fall to the left of x.
              n−1
  There are j−1 such choices, each with probability F (x) (1 − F (x))n−j by the
  Bin(n, F (x)) PMF.
We multiply the probabilities of the two stages to get
                                           
                                        n−1
                fX(j) (x)dx = nf (x)dx        F (x)j−1 (1 − F (x))n−j .
                                        j−1

Dropping the dx’s from both sides gives us the PDF we desire.
Theorem 8.6.4 (PDF of order statistic). Let X1 , . . . , Xn be i.i.d. continuous r.v.s
with CDF F and PDF f . Then the marginal PDF of the jth order statistic X(j) is
                                     
                                     
                                 n−1
                   fX(j) (x) = n       f (x)F (x)j−1 (1 − F (x))n−j .
                                 j−1

In general, the order statistics of X1 , . . . , Xn will not follow a named distribution,
but the order statistics of the standard Uniform distribution are an exception.


402                                                            Introduction to Probability

Example 8.6.5 (Order statistics of Uniforms). Let U1 , . . . , Un be i.i.d. Unif(0, 1).
Then for 0 ≤ x ≤ 1, f (x) = 1 and F (x) = x, so the PDF of U(j) is
                                           
                                       n − 1 j−1
                         fU(j) (x) = n        x (1 − x)n−j .
                                       j−1
                                                                                  j
This is the Beta(j, n − j + 1) PDF! So U(j) ∼ Beta(j, n − j + 1), and E(U(j) ) = n+1 .
The simple case n = 2 is consistent with Example 7.2.2, where we used 2D LOTUS
to show that for i.i.d. U1 , U2 ∼ Unif(0, 1),

                    E(max(U1 , U2 )) = 2/3, E(min(U1 , U2 )) = 1/3.

Now that we know max(U1 , U2 ) and min(U1 , U2 ) follow Beta distributions, the ex-
pectation of the Beta distribution confirms our earlier findings.                




8.7    Recap

In this chapter we discussed three broad classes of transformations:
• invertible transformations Y = g(X) of continuous random vectors, which can be
  handled with the change of variables formula (under some technical assumptions,
  most notably that the partial derivatives ∂xi /∂yj exist and are continuous);
• convolutions, for which we can determine the distribution using (in decreasing
  order of preference) stories, MGFs, or convolution sums/integrals;
• the transformation of i.i.d. continuous r.v.s to their order statistics.
Figure 8.12 illustrates connections between the original random vector (X, Y ) and
the transformed random vector (Z, W ) = g(X, Y ), where g is an invertible trans-
formation satisfying certain technical assumptions. The change of variables formula
uses Jacobians to take us back and forth between the joint PDF of (X, Y ) and the
joint PDF of (Z, W ).
Let A be a region in the support of (X, Y ), and B = {g(x, y) : (x, y) ∈ A} be the
corresponding region in the support of (Z, W ). Then (X, Y ) ∈ A is the same event
as (Z, W ) ∈ B, so
                        P ((X, Y ) ∈ A) = P ((Z, W ) ∈ B).
To find this probability, we can either integrate the joint PDF of (X, Y ) over A or
integrate the joint PDF of (Z, W ) over B.


Transformations                                                                                                                                                                      403


  0.20




                                                                                                                                   What can
  0.15

  0.10

   0.05

   0.00




                                                                                                                                   happen?
         3

             2


                 1


                     0
                                                                        3
                 y




                         −1                                         2
                                                                1
                                                        0
                              −2
                                                   −1       x
                                              −2
                                   −3
                                        −3




          joint distributions                                                          random vectors                                  events                       numbers
                                                                                                                                    (X,Y) is in A,
                                                                            generate                                                                        P
                 joint PDF fX,Y(x,y)                                                             (X,Y)                         where A is a region in             P((X,Y) is in A)
                                                                                                                                the support of (X,Y)

                                                                                                            integrate over A




                                                                                          transformation
                                   Jacobian




                                                                                                                                        =                              =
                                                                                                                                    (same event)                (same probability)


                                                                                                                                   (Z,W) is in B,
             joint PDF fZ,W(z,w)                                            generate                                                                        P
                                                                                        (Z,W) = g(X,Y)                                 where                     P((Z,W) is in B)
                                                                                                                              B = {g(x,y): (x,y) is in A}


                                                                                                           integrate over B



FIGURE 8.12
Let (Z, W ) = g(X, Y ), where g is an invertible transformation satisfying certain
technical assumptions. The change of variables formula lets us go back and forth
between the joint PDFs of (X, Y ) and (Z, W ).


In this chapter, as in many others, we made extensive use of Bayes’ rule and LOTP,
especially in continuous or hybrid forms. And we often used the strategy of integra-
tion by pattern recognition. Since any valid PDF must integrate to 1, and by now
we know lots of valid PDFs, we can often use probability to help us do calculus in
addition to using calculus to help us do probability!
The two new distributions we introduced are the Beta and Gamma, which are laden
with stories and connections to other distributions. The Beta is a generalization of
the Unif(0, 1) distribution, and it has the following stories.
• Order statistics of the Uniform: The jth order statistic of n i.i.d. Unif(0, 1) r.v.s
  is distributed Beta(j, n − j + 1).
• Unknown probability, conjugate prior of the Binomial : If p ∼ Beta(a, b) and X|p ∼
  Bin(n, p), then p|X = k ∼ Beta(a + k, b + n − k). The posterior distribution of
  p stays within the Beta family of distributions after updating based on Binomial
  data, a property known as conjugacy. The parameters a and b can be interpreted
  as the prior number of successes and failures, respectively.
The Gamma is a generalization of the Exponential distribution, and it has the
following stories.
• Poisson process: In a Poisson process of rate λ, the total waiting time for n arrivals


404                                                                                  Introduction to Probability

  is distributed Gamma(n, λ). Thus the Gamma is the continuous analog of the
  Negative Binomial distribution.
• Unknown rate, conjugate prior of the Poisson: If λ ∼ Gamma(r0 , b0 ) and Y |λ ∼
  Pois(λt), then λ|Y = y ∼ Gamma(r0 + y, b0 + t). The posterior distribution of λ
  stays within the Gamma family of distributions after updating based on Poisson
  data. The parameters r0 and b0 can be interpreted as the prior number of observed
  successes and the total waiting time for those successes, respectively.
The Beta and Gamma distributions are related by the bank–post office story, which
says that if X ∼ Gamma(a, λ), Y ∼ Gamma(b, λ) are independent, then X + Y ∼
                   X                                  X
Gamma(a + b, λ), X+Y ∼ Beta(a, b), with X + Y and X+Y    independent.
The diagram of connections, which we last saw in Chapter 5, is hereby updated to
include the Beta and Gamma distributions. Distributions listed in parentheses are
special cases of the ones not in parentheses.


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


           Poisson process
                                           Bank–Post Oﬃce
               Conjugacy



                       Gamma                            NBin
                        (Expo)       Limit              (Geom)




8.8    R

Beta and Gamma distributions

The Beta and Gamma distributions are programmed into R.
• dbeta, pbeta, rbeta: To evaluate the Beta(a, b) PDF or CDF at x, we use


Transformations                                                                  405

  dbeta(x,a,b) and pbeta(x,a,b). To generate n realizations from the Beta(a, b)
  distribution, we use rbeta(n,a,b).
• dgamma, pgamma, rgamma: To evaluate the Gamma(a, λ) PDF or CDF at x, we use
  dgamma(x,a,lambda) or pgamma(x,a,lambda). To generate n realizations from
  the Gamma(a, λ) distribution, we use rgamma(n,a,lambda).
For example, we can check that the Gamma(3, 2) distribution has mean 3/2 and
variance 3/4. To do this, we generate a large number of Gamma(3, 2) random vari-
ables using rgamma, then compute their mean and var:
y <- rgamma(10^5,3,2)
mean(y)
var(y)
Did you get values that were close to 1.5 and 0.75, respectively?


Convolution of Uniforms
                                                 i.i.d.
Using R, we can quickly verify that for X, Y      ∼ Unif(0, 1), the distribution of
T = X + Y is triangular in shape:
x <- runif(10^5)
y <- runif(10^5)
hist(x+y)
The histogram looks like an ascending and then descending staircase, a discrete
approximation to a triangle.


Bayes’ billiards

In the Bayes’ billiards story, we have n white balls and 1 gray ball, throw them onto
the unit interval completely at random, and count the number of white balls to the
left of the gray ball. Letting p be the position of the gray ball and X be the number
of white balls to the left of the gray ball, we have

                                    p ∼ Unif(0, 1)
                                  X|p ∼ Bin(n, p).

By performing this experiment a large number of times, we can verify the results
we derived in this chapter about the marginal PMF of X and the posterior PDF of
p given X = x. We’ll let the number of simulations be called nsim, to avoid a name
conflict with the number of white balls, n, which we set equal to 10:
nsim <- 10^5
n <- 10


406                                                               Introduction to Probability

We simulate 105 values of p, then simulate 105 values from the conditional distri-
bution of X given p:
p <- runif(nsim)
x <- rbinom(nsim,n,p)
Notice that we feed the entire vector p into rbinom. This means that the first element
of x is generated using the first element of p, the second element of x is generated
using the second element of p, and so forth. Thus, conditional on a particular
element of p, the corresponding element of x is Binomial, but the elements of p are
themselves Uniform, exactly as the model specifies.
According to the Bayes’ billiards argument, the marginal distribution of X should
be Discrete Uniform on the integers 0 through n. Is this in fact the case? We can
make a histogram of x to check! Because the distribution of X is discrete, we tell
R to make the histogram breaks at −0.5, 0.5, 1.5, . . . so that each bar is centered at
an integer value:
hist(x,breaks=seq(-0.5,n+0.5,1))
Indeed, all the histogram bars are approximately equal in height, consistent with a
Discrete Uniform distribution.
Now for the posterior distribution of p given X = x. Conditioning is very simple
in R. To consider only the simulated values of p where the value of X was 3, we
use square brackets, like this: p[x==3]. In particular, we can create a histogram of
these values to see what the posterior distribution of p given X = 3 looks like; try
hist(p[x==3]).
According to the Beta-Binomial conjugacy result, the true posterior distribution
is p|X = 3 ∼ Beta(4, 8). We can plot the histogram of p[x==3] next to a his-
togram of simulated values from the Beta(4, 8) distribution to confirm that they
look similar:
par(mfrow=c(1,2))
hist(p[x==3])
hist(rbeta(10^4,4,8))
The first line tells R we want two side-by-side plots, and the second and third lines
create the histograms.


Simulating order statistics

Simulating order statistics in R is easy: we simply simulate i.i.d. r.v.s and use sort
to sort them in increasing order. For example,
sort(rnorm(10))
produces one realization of X(1) , . . . , X(10) , where X1 , . . . , X10 are i.i.d. N (0, 1).


Transformations                                                                                 407

If we want to plot a histogram of realizations of, say, X(9) , we’ll need to use
replicate:
order_stats <- replicate(10^4, sort(rnorm(10)))
This creates a matrix, order_stats, with 10 rows. The ith row of the matrix con-
tains 104 realizations of X(i) . Now we can create a histogram of X(9) , simply by
selecting row 9 of the matrix:
x9 <- order_stats[9,]
hist(x9)
We can also compute summaries like mean(x9) and var(x9).




8.9     Exercises

Exercises marked with s have detailed solutions at http://stat110.net.


        Change of variables
   1.   Find the PDF of e−X for X ∼ Expo(1).
   2.   Find the PDF of X 7 for X ∼ Expo(λ).
   3.   Find the PDF of Z 3 for Z ∼ N (0, 1).
   4.   s Find the PDF of Z 4 for Z ∼ N (0, 1).
   5.   Find the PDF of |Z| for Z ∼ N (0, 1).
                                                              √
   6.   s Let U ∼ Unif(0, 1). Find the PDFs of U 2 and         U.
   7.   Let U ∼ Unif(0, π2 ). Find the PDF of sin(U ).
   8.   (a) Find the distribution of X 2 for X ∼ DUnif(0, 1, . . . , n).

        (b) Find the distribution of X 2 for X ∼ DUnif(−n, −n + 1, . . . , 0, 1, . . . , n).
   9.   Let X ∼ Bern(p) and let a and b be constants with a < b. Find a simple transformation
        of X that yields an r.v. that equals a with probability 1−p and equals b with probability
        p.
  10.   Let X ∼ Pois(λ) and Y be the indicator of X being odd. Find the PMF of Y .
        Hint: Find P (Y = 0) − P (Y = 1) by writing P (Y = 0) and P (Y = 1) as series and then
        using the fact that (−1)k is 1 if k is even and −1 if k is odd.
  11.   Let T be a continuous r.v. and V = 1/T . Show that their CDFs are related as follows:
                                                             1
                                        
                                        FT (0) + 1 − FT ( v ) for v > 0,
                                        
                                FV (v) = FT (0) for v = 0,
                                        
                                         FT (0) − FT ( v1 ) for v < 0.
                                        


408                                                                     Introduction to Probability

  12.   Let T be the ratio X/Y of two i.i.d. N (0, 1) r.v.s. X, Y . This is the Cauchy distribution
        and, as shown in Example 7.1.25, it has PDF
                                                           1
                                            fT (t) =              .
                                                       π(1 + t2 )

        (a) Use the result of the previous problem to find the CDF of 1/T . Then use calculus to
        find the PDF of 1/T . (Note that the one-dimensional change of variables formula does
        not apply directly, since the function g(t) = 1/t, even though it has g 0 (t) < 0 for all
        t 6= 0, is undefined at t = 0 and is not a strictly decreasing function on its domain.)
        (b) Show that 1/T has the same distribution as T without using calculus, in 140 char-
        acters or fewer.
  13.   Let X and Y be i.i.d. Expo(λ), and T = log(X/Y ). Find the CDF and PDF of T .
  14.   Let X and Y have joint PDF fX,Y (x, y), and transform (X, Y ) 7→ (T, W ) linearly by
        letting
                                T = aX + bY and W = cX + dY,
        where a, b, c, d are constants such that ad − bc 6= 0.
        (a) Find the joint PDF fT,W (t, w) (in terms of fX,Y , though your answer should be
        written as a function of t and w).
        (b) For the case where T = X + Y, W = X − Y , show that
                                                               
                                             1       t+w t−w
                                fT,W (t, w) = fX,Y       ,        .
                                             2        2     2

  15.    s Let X, Y be continuous r.v.s with a spherically symmetric joint distribution, which
        means that the joint PDF is of the form f (x, y) = g(x2 + y 2 ) for some function g. Let
        (R, θ) be the polar coordinates of (X, Y ), so R2 = X 2 + Y 2 is the squared distance from
        the origin and θ is the angle (in [0, 2π)), with X = R cos θ, Y = R sin θ.
        (a) Explain intuitively why R and θ are independent. Then prove this by finding the
        joint PDF of (R, θ).
        (b) What is the joint PDF of (R, θ) when (X, Y ) is Uniform in the unit disk {(x, y) :
        x2 + y 2 ≤ 1}?
        (c) What is the joint PDF of (R, θ) when X and Y are i.i.d. N (0, 1)?
  16.   Let X and Y be i.i.d. N (0, 1) r.v.s, T = X + Y , and W = X − Y . We know from
        Example 7.5.8 that T and W are independent N (0, 2) r.v.s (note that (T, W ) is Multi-
        variate Normal with Cov(T, W ) = 0). Give another proof of this fact, using the change
        of variables theorem.
  17.   Let X and Y be i.i.d. N (0, 1) r.v.s, and (R, θ) be the polar coordinates for the point
        (X, Y ), so X = R cos θ and Y = R sin θ with R ≥ 0 and θ ∈ [0, 2π). Find the joint PDF
        of R2 and θ. Also find the marginal distributions of R2 and θ, giving their names (and
        parameters) if they are distributions we have studied before.
  18.   Let X and Y be independent positive r.v.s, with PDFs fX and fY , respectively. Let T
        be the ratio X/Y .
        (a) Find the joint PDF of T and X, using a Jacobian.
        (b) Find the marginal PDF of T , as a single integral.
  19.   Let X and Y be i.i.d. Expo(λ), and transform them to T = X + Y, W = X/Y .
        (a) Find the joint PDF of T and W . Are they independent?
        (b) Find the marginal PDFs of T and W .


Transformations                                                                                   409

        Convolutions
  20.   Let U ∼ Unif(0, 1) and X ∼ Expo(1), independently. Find the PDF of U + X.
  21.   Let X and Y be i.i.d. Expo(1). Use a convolution integral to show that the PDF of
        L = X − Y is f (t) = 12 e−|t| for all real t; this is known as the Laplace distribution.
  22.   Use a convolution integral to show that if X ∼ N (µ1 , σ 2 ) and Y ∼ N (µ2 , σ 2 ) are
        independent, then T = X + Y ∼ N (µ1 + µ2 , 2σ 2 ) (to simplify the calculation, we are
        assuming that the variances are equal). You can use a standardization (location-scale)
        idea to reduce to the standard Normal case before setting up the integral.
        Hint: Complete the square.
  23.    s Let X and Y be independent positive r.v.s, with PDFs fX and fY , respectively, and
        consider the product T = XY . When asked to find the PDF of T , Jacobno argues that:
        “It’s like a convolution, with a product instead of a sum. To have T = t we need X = x
        and Y = t/x for some x; that has probability
                                                   R∞       fX (x)fY (t/x), so summing up these
        possibilities we get that the PDF of T is 0 fX (x)fY (t/x)dx.”
        Evaluate Jacobno’s argument, while getting the PDF of T (as an integral) in 2 ways:

        (a) using the continuous version of the law of total probability to get the CDF, and
        then taking the derivative (you can assume that swapping the derivative and integral is
        valid);

        (b) by taking the log of both sides of T = XY and doing a convolution (and then
        converting back to get the PDF of T ).
  24.   Let X and Y be i.i.d. Discrete Uniform r.v.s on {0, 1, . . . , n}, where n is a positive
        integer. Find the PMF of T = X + Y .

        Hint: In finding P (T = k), it helps to consider the cases 0 ≤ k ≤ n and n + 1 ≤ k ≤ 2n
        separately. Be careful about the range of summation in the convolution sum.
  25.   Let X and Y be i.i.d. Unif(0, 1), and let W = X − Y .

        (a) Find the mean and variance of W , without yet deriving the PDF.

        (b) Show that the distribution of W is symmetric about 0, without yet deriving the
        PDF.

        (c) Find the PDF of W .

        (d) Use the PDF of W to verify your results from (a) and (b).

        (e) How does the distribution of W relate to the distribution of X + Y , the Triangle
        distribution derived in Example 8.2.5? Give a precise description, e.g., using the concepts
        of location and scale.
  26.   Let X and Y be i.i.d. Unif(0, 1), and T = X + Y . We derived the distribution of T
        (a Triangle distribution) in Example 8.2.5, using a convolution integral. Since (X, Y )
        is Uniform in the unit square {(x, y) : 0 < x < 1, 0 < y < 1}, we can also interpret
        P ((X, Y ) ∈ A) as the area of A, for any region A within the unit square. Use this idea
        to find the CDF of T , by interpreting the CDF (evaluated at some point) as an area.
  27.   Let X, Y, Z be i.i.d. Unif(0, 1), and W = X + Y + Z. Find the PDF of W .
        Hint: We already know the PDF of X + Y . Be careful about limits of integration in the
        convolution integral; there are 3 cases that should be considered separately.


410                                                                         Introduction to Probability

        Beta and Gamma
  28.    s Let B ∼ Beta(a, b). Find the distribution of 1 − B in two ways: (a) using a change of
        variables and (b) using a story proof. Also explain why the result makes sense in terms
        of Beta being the conjugate prior for the Binomial.
  29.    s Let X ∼ Gamma(a, λ) and Y ∼ Gamma(b, λ) be independent, with a and b integers.
        Show that X + Y ∼ Gamma(a + b, λ) in three ways: (a) with a convolution integral; (b)
        with MGFs; (c) with a story proof.
  30.   Let B ∼ Beta(a, b). Use integration by pattern recognition to find E(B k ) for positive
        integers k. In particular, show that
                                                            ab
                                        Var(B) =                        .
                                                   (a + b)2 (a + b + 1)

  31.    s Fred waits X ∼ Gamma(a, λ) minutes for the bus to work, and then waits Y ∼
        Gamma(b, λ) for the bus going home, with X and Y independent. Is the ratio X/Y
        independent of the total wait time X + Y ?
  32.    s The F -test is a very widely used statistical test based on the F (m, n) distribution,
        which is the distribution of X/m
                                     Y /n
                                          with X ∼ Gamma( m    , 1 ), Y ∼ Gamma( n2 , 12 ). Find the
                                                              2 2
        distribution of mV /(n + mV ) for V ∼ F (m, n).
  33.    s Customers arrive at the Leftorium store according to a Poisson process with rate λ
        customers per hour. The true value of λ is unknown, so we treat it as a random variable.
        Suppose that our prior beliefs about λ can be expressed as λ ∼ Expo(3). Let X be the
        number of customers who arrive at the Leftorium between 1 pm and 3 pm tomorrow.
        Given that X = 2 is observed, find the posterior PDF of λ.
  34.   s Let X and Y be independent, positive r.v.s. with finite expected values.
                                      X        E(X)
        (a) Give an example where E( X+Y ) 6= E(X+Y )
                                                      , computing both sides exactly.
        Hint: Start by thinking about the simplest examples you can think of!
                                                                        X       E(X)
        (b) If X and Y are i.i.d., then is it necessarily true that E( X+Y ) = E(X+Y )
                                                                                       ?

        (c) Now let X ∼ Gamma(a, λ) and Y ∼ Gamma(b, λ). Show without using calculus that

                                        Xc             E(X c )
                                               
                                E             c
                                                  =
                                     (X + Y )       E((X + Y )c )
        for every real c > 0.
  35.   Let T = X 1/γ , with X ∼ Expo(λ) and λ, γ > 0. So T has a Weibull distribution, as
        discussed in Example 6.5.5. Using LOTUS and the definition of the gamma function,
        we showed in this chapter that for Y ∼ Gamma(a, λ),

                                                       1 Γ(a + c)
                                           E(Y c ) =      ·       ,
                                                       λc   Γ(a)
        for all real c > −a. Use this result to show that
                                Γ (1 + 1/γ)               Γ (1 + 2/γ) − (Γ (1 + 2/γ))2
                   E(T ) =           1/γ
                                            and Var(T ) =                              .
                                    λ                                 λ2/γ

  36.   Alice walks into a post office with 2 clerks. Both clerks are in the midst of serving
        customers, but Alice is next in line. The clerk on the left takes an Expo(λ1 ) time to
        serve a customer, and the clerk on the right takes an Expo(λ2 ) time to serve a customer.
        Let T1 be the time until the clerk on the left is done serving their current customer, and
        define T2 likewise for the clerk on the right.


Transformations                                                                                       411

        (a) If λ1 = λ2 , is T1 /T2 independent of T1 + T2 ?
        Hint: Note that T1 /T2 = (T1 /(T1 + T2 ))/(T2 /(T1 + T2 )).

        (b) Find P (T1 < T2 ) (do not assume λ1 = λ2 here or in the next part, but do check
        that your answers make sense in that special case).

        (c) Find the expected total amount of time that Alice spends in the post office (assuming
        that she leaves immediately after she is done being served).
  37.   Let X ∼ Pois(λt) and Y ∼ Gamma(j, λ), where j is a positive integer. Show using a
        story about a Poisson process that

                                           P (X ≥ j) = P (Y ≤ t).

  38.   Visitors arrive at a certain scenic park according to a Poisson process with rate λ
        visitors per hour. Fred has just arrived (independent of anyone else), and will stay for
        an Expo(λ2 ) number of hours. Find the distribution of the number of other visitors who
        arrive at the park while Fred is there.
  39.   (a) Let p ∼ Beta(a, b), where a and b are positive real numbers. Find E(p2 (1 − p)2 ),
        fully simplified (Γ should not appear in your final answer).

        Two teams, A and B, have an upcoming match. They will play five games and the
        winner will be declared to be the team that wins the majority of games. Given p, the
        outcomes of games are independent, with probability p of team A winning and 1 − p
        of team B winning. But you don’t know p, so you decide to model it as an r.v., with
        p ∼ Unif(0, 1) a priori (before you have observed any data).
        To learn more about p, you look through the historical records of previous games between
        these two teams, and find that the previous outcomes were, in chronological order,
        AAABBAABAB. (Assume that the true value of p has not been changing over time
        and will be the same for the match, though your beliefs about p may change over time.)

        (b) Does your posterior distribution for p, given the historical record of games between
        A and B, depend on the specific order of outcomes or only on the fact that A won
        exactly 6 of the 10 games on record? Explain.

        (c) Find the posterior distribution for p, given the historical data.

        The posterior distribution for p from (c) becomes your new prior distribution, and the
        match is about to begin!

        (d) Conditional on p, is the indicator of A winning the first game of the match positively
        correlated with, uncorrelated with, or negatively correlated with the indicator of A
        winning the second game? What about if we only condition on the historical data?

        (e) Given the historical data, what is the expected value for the probability that the
        match is not yet decided when going into the fifth game (viewing this probability as an
        r.v. rather than a number, to reflect our uncertainty about it)?
  40.   An engineer is studying the reliability of a product by performing a sequence of n
        trials. Reliability is defined as the probability of success. In each trial, the product
        succeeds with probability p and fails with probability 1 − p. The trials are conditionally
        independent given p. Here p is unknown (else the study would be unnecessary!). The
        engineer takes a Bayesian approach, with p ∼ Unif(0, 1) as prior.
        Let r be a desired reliability level and c be the corresponding confidence level, in the
        sense that, given the data, the probability is c that the true reliability p is at least r. For
        example, if r = 0.9, c = 0.95, we can be 95% sure, given the data, that the product is
        at least 90% reliable. Suppose that it is observed that the product succeeds all n times.
        Find a simple equation for c as a function of r.


412                                                                       Introduction to Probability

        Order statistics
  41.    s Let X ∼ Bin(n, p) and B ∼ Beta(j, n − j + 1), where n is a positive integer and j is
        a positive integer with j ≤ n. Show using a story about order statistics that
                                          P (X ≥ j) = P (B ≤ p).
        This shows that the CDF of the continuous r.v. B is closely related to the CDF of the
        discrete r.v. X, and is another connection between the Beta and Binomial.
  42.   Show that for i.i.d. continuous r.v.s X, Y, Z,
                    P (X < min(Y, Z)) + P (Y < min(X, Z)) + P (Z < min(X, Y )) = 1.

  43.   Show that
                      Z x                                       n
                                                                    !
                                   n!         j−1      n−j
                                                                X n k
                                             t (1 − t)     dt =      x (1 − x)n−k ,
                        0   (j − 1)!(n − j)!                      k
                                                               k=j

        without using calculus, for all x ∈ [0, 1] and j, n positive integers with j ≤ n.
  44.   Let X1 , . . . , Xn be i.i.d. continuous r.v.s with PDF f and a strictly increasing CDF
        F . Suppose that we know that the jth order statistic of n i.i.d. Unif(0, 1) r.v.s is a
        Beta(j, n − j + 1), but we have forgotten the formula and derivation for the distribution
        of the jth order statistic of X1 , . . . , Xn . Show how we can recover the PDF of X(j)
        quickly using a change of variables.
  45.    s Let X and Y be independent Expo(λ) r.v.s and M = max(X, Y ). Show that M has
        the same distribution as X + 12 Y , in two ways: (a) using calculus and (b) by remembering
        the memoryless property and other properties of the Exponential.
  46.   s (a) If X and Y are i.i.d. continuous r.v.s with CDF F (x) and PDF f (x), then
        M = max(X, Y ) has PDF 2F (x)f (x). Now let X and Y be discrete and i.i.d., with
        CDF F (x) and PMF f (x). Explain in words why the PMF of M is not 2F (x)f (x).
        (b) Let X and Y be i.i.d. Bern(1/2) r.v.s, M = max(X, Y ) and L = min(X, Y ). Find
        the joint PMF of M and L, i.e., P (M = a, L = b), and the marginal PMFs of M and L.
  47.   Let X1 , X2 , . . . be i.i.d. r.v.s with CDF F , and let Mn = max(X1 , X2 , . . . , Xn ). Find
        the joint distribution of Mn and Mn+1 , for each n ≥ 1.
  48.    s Let X1 , X2 , . . . , Xn be i.i.d. r.v.s with CDF F and PDF f . Find the joint PDF of
        the order statistics X(i) and X(j) for 1 ≤ i < j ≤ n, by drawing and thinking about a
        picture.
  49.    s Two women are pregnant, both with the same due date. On a timeline, define time
        0 to be the instant when the due date begins. Suppose that the time when the woman
        gives birth has a Normal distribution, centered at 0 and with standard deviation 8 days.
        The two birth times are i.i.d. Let T be the time of the first of the two births (in days).
        (a) Show that
                                                        −8
                                                E(T ) = √ .
                                                         π
        Hint: For any two random variables X and Y , we have max(X, Y ) + min(X, Y ) = X + Y
        and max(X, Y ) − min(X, Y ) = |X − Y |. Example 7.2.3 derives the expected distance
        between two i.i.d. N (0, 1) r.v.s.
        (b) Find Var(T ), in terms of integrals. You can leave your answers unsimplified for this
        part, but it can be shown that the answer works out to
                                                             
                                                            1
                                         Var(T ) = 64 1 −       .
                                                            π


Transformations                                                                                         413

  50.   We are about to observe random variables Y1 , Y2 , . . . , Yn , i.i.d. from a continuous dis-
        tribution. We will need to predict an independent future observation Ynew , which will
        also have the same distribution. The distribution is unknown, so we will construct our
        prediction using Y1 , Y2 , . . . , Yn rather than the distribution of Ynew . In forming a predic-
        tion, we do not want to report only a single number; rather, we want to give a predictive
        interval with “high confidence” of containing Ynew . One approach to this is via order
        statistics.
        (a) For fixed j and k with 1 ≤ j < k ≤ n, find P (Ynew ∈ [Y(j) , Y(k) ]).
        Hint: By symmetry, all orderings of Y1 , . . . , Yn , Ynew are equally likely.
        (b) Let n = 99. Construct a predictive interval, as a function of Y1 , . . . , Yn , such that
        the probability of the interval containing Ynew is 0.95.
  51.   Let X1 , . . . , Xn be i.i.d. continuous r.v.s with n odd. Show that the median of the
        distribution of the sample median of the Xi ’s is the median of the distribution of the
        Xi ’s.
        Hint: Start by reading the problem carefully; it is crucial to distinguish between the
        median of a distribution (as defined in Chapter 6) and the sample median of a collection
        of r.v.s (as defined in this chapter). Of course they are closely related: the sample median
        of i.i.d. r.v.s is a very natural way to estimate the true median of the distribution that
        the r.v.s are drawn from. Two approaches to evaluating a sum that might come up are (i)
        use the first story proof example and first story proof exercise from Chapter 1, or (ii) use
        the fact that, by the story of the Binomial, Y ∼ Bin(n, 1/2) implies n−Y ∼ Bin(n, 1/2).


        Mixed practice
  52.   Let U1 , U2 , . . . , Un be i.i.d. Unif(0, 1), and let Xj = − log(Uj ) for all j.
        (a) Find the distribution of Xj . What is its name?
        (b) Find the distribution of the product U1 U2 . . . Un .
        Hint: First take the log.
  53.    s A DNA sequence can be represented as a sequence of letters, where the alphabet has
        4 letters: A,C,T,G. Suppose such a sequence is generated randomly, where the letters
        are independent and the probabilities of A,C,T,G are p1 , p2 , p3 , p4 , respectively.
        (a) In a DNA sequence of length 115, what is the expected number of occurrences of
        the expression “CATCAT” (in terms of the pj )? (Note that, for example, the expression
        “CATCATCAT” counts as 2 occurrences.)
        (b) What is the probability that the first A appears earlier than the first C appears, as
        letters are generated one by one (in terms of the pj )?
        (c) For this part, assume that the pj are unknown. Suppose we treat p2 as a Unif(0, 1)
        r.v. before observing any data, and that then the first 3 letters observed are “CAT”.
        Given this information, what is the probability that the next letter is C?
  54.    s Consider independent Bernoulli trials with probability p of success for each. Let X
        be the number of failures incurred before getting a total of r successes.
                                                              p
        (a) Determine what happens to the distribution of 1−p   X as p → 0, using MGFs; what
        is the PDF of the limiting distribution, and its name and parameters if it is one we have
        studied?
                                                                           p
        Hint: Start by finding the Geom(p) MGF. Then find the MGF of 1−p     X, and use the
        fact that if the MGFs of Yn converges to the MGF of Y , then the CDF of Yn converges
        to the CDF of Y .
        (b) Explain intuitively why the result of (a) makes sense.


Taylor & Francis
Taylor & Francis Group
http://taylorandfrancis.com


9
Conditional expectation



Given that you’ve read the earlier chapters, you already know what conditional
expectation is: expectation, but using conditional probabilities. This is an essential
concept, for reasons analogous to why we need conditional probability:

• Conditional expectation is a powerful tool for calculating expectations. Using
  strategies such as conditioning on what we wish we knew and first-step analysis,
  we can often decompose complicated expectation problems into simpler pieces.

• Conditional expectation is a relevant quantity in its own right, allowing us to
  predict or estimate unknowns based on whatever evidence is currently available.
  For example, in statistics we often want to predict a response variable (such as
  test scores or earnings) based on explanatory variables (such as number of practice
  problems solved or enrollment in a job training program).

There are two different but closely linked notions of conditional expectation:

• Conditional expectation E(Y |A) given an event: let Y be an r.v., and A be an
  event. If we learn that A occurred, our updated expectation for Y is denoted by
  E(Y |A) and is computed analogously to E(Y ), except using conditional probabil-
  ities given A.

• Conditional expectation E(Y |X) given a random variable: a more subtle question
  is how to define E(Y |X), where X and Y are both r.v.s. Intuitively, E(Y |X) is
  the r.v. that best predicts Y using only the information available from X.

In this chapter, we explore the definitions, properties, intuitions, and applications
of both forms of conditional expectation.




9.1    Conditional expectation given an event

Recall that the expectation E(Y ) of a discrete r.v. Y is a weighted average of its
possible values, where the weights are the PMF values P (Y = y). After learning
that an event A occurred, we want to use weights that have been updated to reflect
this new information. The definition of E(Y |A) simply replaces the probability
P (Y = y) with the conditional probability P (Y = y|A).

                                                                                  415


416                                                          Introduction to Probability

Similarly, if Y is continuous, E(Y ) is still a weighted average of the possible values
of Y , with an integral in place of a sum and the PDF value f (y) in place of a PMF
value. If we learn that A occurred, we update the expectation for Y by replacing
f (y) with the conditional PDF f (y|A).
Definition 9.1.1 (Conditional expectation given an event). Let A be an event
with positive probability. If Y is a discrete r.v., then the conditional expectation of
Y given A is                            X
                             E(Y |A) =      yP (Y = y|A),
                                         y

where the sum is over the support of Y . If Y is a continuous r.v. with PDF f , then
                                       Z ∞
                            E(Y |A) =        yf (y|A)dy,
                                             −∞

where the conditional PDF f (y|A) is defined as the derivative of the conditional
CDF F (y|A) = P (Y ≤ y|A), and can also be computed by a hybrid version of
Bayes’ rule:
                                    P (A|Y = y)f (y)
                         f (y|A) =                   .
                                          P (A)
Intuition 9.1.2. To gain intuition for E(Y |A), let’s consider approximating it
via simulation (or via the frequentist perspective, based on repeating the same
experiment many times). Imagine generating a large number n of replications of the
experiment for which Y is a numerical summary. We then have Y -values y1 , . . . , yn ,
and we can approximate
                                            n
                                         1X
                                E(Y ) ≈       yj .
                                        n
                                                  j=1


To approximate E(Y |A), we restrict to the replications where A occurred, and
average only those Y -values. This can be written as
                                         Pn
                                           j=1 yj Ij ,
                              E(Y |A) ≈ Pn             ,
                                             j=1 Ij

where Ij is the indicator of A occurring in the jth replication. This is undefined
if A never occurred in the simulation, which makes sense since then there is no
simulation data about what the “A occurred” scenario is like. We would like to
have n large enough so that there are many occurrences of A (if A is a rare event,
more sophisticated techniques for approximating E(Y |A) may be needed).
The principle is simple though: E(Y |A) is approximately the average of Y in a large
number of simulation runs in which A occurred.                                    
h 9.1.3. Confusing conditional expectation and unconditional expectation is a
dangerous mistake. More generally, not keeping careful track of what you should be
conditioning on and what you are conditioning on is a recipe for disaster.


Conditional expectation                                                             417

For a life-or-death example of the previous biohazard, consider life expectancy.
Example 9.1.4 (Life expectancy). Fred is 30 years old, and he hears that the
average life expectancy in his country is 80 years. Should he conclude that, on
average, he has 50 years of life left? No, there is a crucial piece of information that
he must condition on: the fact that he has lived to age 30 already. Letting T be
Fred’s lifespan, we have the cheerful news that

                                E(T ) < E(T |T ≥ 30).

The left-hand side is Fred’s life expectancy at birth (it implicitly conditions on the
fact that he is born), and the right-hand side is Fred’s life expectancy given that he
reaches age 30.
A harder question is how to decide on an appropriate estimate to use for E(T ). Is
it just 80, the overall average for his country? In almost every country, women have
a longer average life expectancy than men, so it makes sense to condition on Fred
being a man. But should we also condition on what city he was born in? Should we
condition on racial and financial information about his parents, or the time of day
when he was born? Intuitively, we would like estimates that are both accurate and
relevant for Fred, but there is a tradeoff since if we condition on more characteristics
of Fred, then there are fewer people who match those characteristics to use as data
for estimating the life expectancy.
Now consider some specific numbers for the United States. A Social Security Admin-
istration study estimated that between 1900 and 2000, the average life expectancy
at birth in the U.S. for men increased from 46 to 74, and for women increased from
49 to 79. Tremendous gains! But much of the gain is due to decreases in child mor-
tality. For a 30-year-old person in 1900, the average number of years remaining was
35 for a man and 36 for a woman; in 2000, the corresponding numbers were 46 for
a man and 50 for a woman.
There are some subtle statistical issues in obtaining these estimates. For example,
how were estimates for life expectancy for someone born in 2000 obtained without
waiting at least until the year 2100? Estimating survival distributions is a very
important topic in biostatistics and actuarial science.                          
The law of total probability allows us to get unconditional probabilities by slicing
up the sample space and computing conditional probabilities in each slice. The same
idea works for computing unconditional expectations.
Theorem 9.1.5 (Law of total expectation). Let A1 , . . . , An be a partition of a
sample space, with P (Ai ) > 0 for all i, and let Y be a random variable on this
sample space. Then
                                   Xn
                           E(Y ) =      E(Y |Ai )P (Ai ).
                                      i=1

In fact, since all probabilities are expectations by the fundamental bridge, the law


418                                                                   Introduction to Probability

of total probability is a special case of the law of total expectation. To see this, let
Y = IB for an event B; then the above theorem says
                                 n
                                 X                           n
                                                             X
            P (B) = E(IB ) =           E(IB |Ai )P (Ai ) =         P (B|Ai )P (Ai ),
                                 i=1                         i=1

which is exactly LOTP. The law of total expectation is, in turn, a special case of a
major result called Adam’s law (Theorem 9.3.7), so we will not prove it yet.
There are many interesting examples of using wishful thinking to break up an un-
conditional expectation into conditional expectations. We begin with two cautionary
tales about the importance of conditioning carefully and not destroying information
without justification.
Example 9.1.6 (Two-envelope paradox). A stranger presents you with two
identical-looking, sealed envelopes, each of which contains a check for some pos-
itive amount of money. You are informed that one of the envelopes contains exactly
twice as much money as the other. You can choose either envelope. Which do you
prefer: the one on the left or the one on the right? (Assume that the expected
amount of money in each envelope is finite—certainly a good assumption in the real
world!)




                             X                                Y

FIGURE 9.1
Two envelopes, where one contains twice as much money as the other. Either Y =
2X or Y = X/2, with equal probabilities. Which would you prefer?

Solution:
Let X and Y be the amounts in the left and right envelopes, respectively. By
symmetry, there is no reason to prefer one envelope over the other (we are assuming
there is no prior information that the stranger is left-handed and left-handed people
prefer putting more money on the left). Concluding by symmetry that E(X) =
E(Y ), it seems that you should not care which envelope you get.
But as you daydream about what’s inside the envelopes, another argument occurs
to you: suppose that the left envelope has $100. Then the right envelope either has
$50 or $200. The average of $50 and $200 is $125, so it seems then that the right
envelope is better. But there was nothing special about $100 here; for any value x
for the left envelope, the average of 2x and x/2 is greater than x, suggesting that
the right envelope is better. This is bizarre though, since not only does it contradict
the symmetry argument, but also the same reasoning could be applied starting with
the right envelope, leading to switching back and forth forever!


Conditional expectation                                                           419

Let us try to formalize this argument to see what’s going on. We have Y = 2X or
Y = X/2, with equal probabilities. By Theorem 9.1.5,
                                           1                1
                  E(Y ) = E(Y |Y = 2X) ·     + E Y |Y = X/2 · .
                                           2                 2
One might then think that this is
                                    1         1 5
                          E(2X) ·     + E X/2 · = E(X),
                                    2          2 4
suggesting a 25% gain from switching from the left to the right envelope. But there
is a blunder in that calculation: E(Y |Y = 2X) = E(2X|Y = 2X), but there is no
justification for dropping the Y = 2X condition after plugging in 2X for Y .
To put it another way, let I be the indicator of the event Y = 2X, so that E(Y |Y =
2X) = E(2X|I = 1). If we know that X is independent of I, then we can drop the
condition I = 1. But in fact we have just proven that X and I can’t be independent:
if they were, we’d have a paradox! Surprisingly, observing X gives information about
whether X is the bigger value or the smaller value. If we learn that X is very large,
we might guess that X is larger than Y , but what is considered very large? Is 1012
very large, even though it is tiny compared with 10100 ? The two-envelope paradox
says that no matter what the distribution of X is, there are reasonable ways to
define “very large” relative to that distribution.
In Exercise 8 you will look at a related problem, in which the amounts of money
in the two envelopes are i.i.d. random variables. You’ll show that if you are allowed
to look inside one of the envelopes and then decide whether to switch, there is a
strategy that allows you to get the better envelope more than 50% of the time! 
The next example vividly illustrates the importance of conditioning on all the in-
formation. The phenomenon revealed here arises in many real-life decisions about
what to buy and what investments to make.
Example 9.1.7 (Mystery prize). You are approached by another stranger, who
gives you an opportunity to bid on a mystery box containing a mystery prize! The
value of the prize is completely unknown, except that it is worth at least nothing,
and at most a million dollars. So the true value V of the prize is considered to be
Uniform on [0,1] (measured in millions of dollars).
You can choose to bid any amount b (in millions of dollars). You have the chance to
get the prize for considerably less than it is worth, but you could also lose money
if you bid too much. Specifically, if b < 2V /3, then the bid is rejected and nothing
is gained or lost. If b ≥ 2V /3, then the bid is accepted and your net payoff is V − b
(since you pay b to get a prize worth V ). What is your optimal bid b, to maximize
the expected payoff?

Solution:
Your bid b ≥ 0 must be a predetermined constant (not based on V , since V is


420                                                                     Introduction to Probability


                                             Bid $250,000? If it's rejected, I
                                             lose nothing. If it's accepted, I
                                             get a prize worth $500,000 on
                                                         average!




                      mystery box



FIGURE 9.2
When bidding on an unknown asset, beware the winner’s curse, and condition on
the relevant information.

unknown!). To find the expected payoff W , condition on whether the bid is accepted.
The payoff is V − b if the bid is accepted and 0 if the bid is rejected. So

        E(W ) = E(W |b ≥ 2V /3)P (b ≥ 2V /3) + E(W |b < 2V /3)P (b < 2V /3)
               = E(V − b|b ≥ 2V /3)P (b ≥ 2V /3) + 0
               = (E(V |V ≤ 3b/2) − b) P (V ≤ 3b/2).

For b ≥ 2/3, the event V ≤ 3b/2 has probability 1, so the right-hand side is 1/2 − b,
which is negative. Now assume b < 2/3. Then V ≤ 3b/2 has probability 3b/2. Given
that V ≤ 3b/2, the conditional distribution of V is Uniform on [0, 3b/2]. Therefore,

      E(W ) = (E(V |V ≤ 3b/2) − b) P (V ≤ 3b/2) = (3b/4 − b) (3b/2) = −3b2 /8.

The above expression is negative except at b = 0, so the optimal bid is 0: you
shouldn’t play this game!
Alternatively, condition on which of the following events occurs: A = {V < b/2},
B = {b/2 ≤ V ≤ 3b/2}, C = {V > 3b/2}. We have

                E(W |A) = E(V − b|A) < E(b/2 − b|A) = −b/2 ≤ 0,
                                                   
                                    b/2 + 3b/2
                     E(W |B) = E               − b|B = 0,
                                         2
                                    E(W |C) = 0,
so we should just set b = 0 and walk away.


Conditional expectation                                                             421

The moral of this story is to condition on all the information. It is crucial in the
above calculation to use E(V |V ≤ 3b/2) rather than E(V ) = 1/2; knowing that the
bid was accepted gives information about how much the mystery prize is worth, so
we shouldn’t destroy that information. This problem is related to the so-called win-
ner’s curse, which says that the winner in an auction with incomplete information
tends to profit less than they expect (unless they understand probability!). This is
because in many settings, the expected value of the item that they bid on given
that they won the bid is less than the unconditional expected value they originally
had in mind. For b ≥ 2/3, conditioning on V ≤ 3b/2 does nothing since we know
in advance that V ≤ 1, but such a bid is ludicrously high. For any b < 2/3, finding
out that your bid is accepted lowers your expectation:

                                 E(V |V ≤ 3b/2) < E(V ).                              

The remaining examples use first-step analysis to calculate unconditional expecta-
tions. First, as promised in Chapter 4, we derive the expectation of the Geometric
distribution using first-step analysis.
Example 9.1.8 (Geometric expectation redux). Let X ∼ Geom(p). Interpret X as
the number of Tails before the first Heads in a sequence of coin flips with probability
p of Heads. To get E(X), we condition on the outcome of the first toss: if it lands
Heads, then X is 0 and we’re done; if it lands Tails, then we’ve wasted one toss and
are back to where we started, by memorylessness. Therefore,

                E(X) = E(X|first toss H) · p + E(X|first toss T ) · q
                          = 0 · p + (1 + E(X)) · q,

which gives E(X) = q/p.                                                               
The next example derives expected waiting times for some more complicated pat-
terns, using two steps of conditioning.
Example 9.1.9 (Time until HH vs. HT ). You toss a fair coin repeatedly. What
is the expected number of tosses until the pattern HT appears for the first time?
What about the expected number of tosses until HH appears for the first time?

Solution:
Let WHT be the number of tosses until HT appears. As we can see from Figure
9.3, WHT is the waiting time for the first Heads, which we’ll call W1 , plus the
additional waiting time for the first Tails after the first Heads, which we’ll call W2 .
By the story of the First Success distribution, W1 and W2 are i.i.d. FS(1/2), so
E(W1 ) = E(W2 ) = 2 and E(WHT ) = 4.
Finding the expected waiting time for HH, E(WHH ), is more complicated. We can’t
apply the same logic as for E(WHT ): as shown in Figure 9.4, if the first Heads is
immediately followed by Tails, our progress is destroyed and we must start from
scratch. But this is progress for us in solving the problem, since the fact that the


422                                                           Introduction to Probability




                            TTTHHHHTHHT...
                               W1         W2
FIGURE 9.3
Waiting time for HT is the waiting time for the first Heads, W1 , plus the additional
waiting time for the next Tails, W2 . Durable partial progress is possible!


system can get reset suggests the strategy of first-step analysis. Let’s condition on
the outcome of the first toss:
                                         1                       1
           E(WHH ) = E(WHH |first toss H) + E(WHH |first toss T ) .
                                         2                       2




                              THTTTTHHHH...
                                 start over

FIGURE 9.4
When waiting for HH, partial progress can easily be destroyed.

For the second term, E(WHH |first toss T) = 1 + E(WHH ) by memorylessness. For
the first term, we compute E(WHH |1st toss H) by further conditioning on the out-
come of the second toss. If the second toss is Heads, we have obtained HH in two
tosses. If the second toss is Tails, we’ve wasted two tosses and have to start all over!
This gives
                                               1                   1
                  E(WHH |first toss H) = 2 · + (2 + E(WHH )) · .
                                               2                   2
Therefore,
                                                   
                              1                    1 1                    1
            E(WHH ) = 2 · + (2 + E(WHH )) ·             + (1 + E(WHH )) .
                              2                    2 2                    2

Solving for E(WHH ), we get E(WHH ) = 6.
It might seem surprising at first that the expected waiting time for HH is greater
than the expected waiting time for HT. How do we reconcile this with the fact that
in two tosses of the coin, HH and HT both have a 1/4 chance of appearing? Why
aren’t the average waiting times the same by symmetry?


Conditional expectation                                                              423

As we solved this problem, we in fact noticed an important asymmetry. When
waiting for HT, once we get the first Heads, we’ve achieved partial progress that
cannot be destroyed: if the Heads is followed by another Heads, we’re in the same
position as before, and if the Heads is followed by a Tails, we’re done. By contrast,
when waiting for HH, even after getting the first Heads, we could be sent back to
square one if the Heads is followed by a Tails. This suggests the average waiting
time for HH should be longer. Symmetry implies that the average waiting time for
HH is the same as that for TT, and that for HT is the same as that for TH, but it
does not imply that the average waiting times for HH and HT are the same.
More intuition into what’s going on can be obtained by considering a long string
of coin flips, as in Figure 9.5. We notice right away that appearances of HH can
overlap, while appearances of HT must be disjoint. For example, HHHHHH has 5
occurrences of HH, but HTHTHT has only 3 occurrences of HT. Since there are
the same average number of HH s and HT s, but HH s sometimes clump together,
the average waiting time for HH must be larger than that of HT to compensate.


                HHTHHTTHHHHTHTHTTHTT

                HHTHHTTHHHHTHTHTTHTT
FIGURE 9.5
Clumping. (a) Appearances of HH can overlap. (b) Appearances of HT must be
disjoint.

Related problems occur in information theory when compressing a message, and in
genetics when looking for recurring patterns (called motifs) in DNA sequences. 
Our final example in this section uses wishful thinking for both probabilities and
expectations to study a question about a random walk.
Example 9.1.10 (Random walk on the integers). An immortal drunk man wanders
around randomly on the integers. He starts at the origin, and at each step he moves
1 unit to the right or 1 unit to the left, with equal probabilities, independently of all
his previous steps. Let b be a googolplex (this is 10g , where g = 10100 is a googol).
(a) Find a simple expression for the probability that the immortal drunk visits b
before returning to the origin for the first time.
(b) Find the expected number of times that the immortal drunk visits b before
returning to the origin for the first time.
Solution:
(a) Let B be the event that the drunk man visits b before returning to the origin
for the first time and let L be the event that his first move is to the left. Then


424                                                           Introduction to Probability

P (B|L) = 0 since any path from −1 to b must pass through 0. For P (B|Lc ), we are
exactly in the setting of the gambler’s ruin problem, where player A starts with $1,
player B starts with $(b − 1), and the rounds are fair. Applying that result, we have
                                                            1 1 1
               P (B) = P (B|L)P (L) + P (B|Lc )P (Lc ) =     · = .
                                                            b 2 2b

(b) Let N be the number of visits to b before returning to the origin for the first
time, and let p = 1/(2b) be the probability found in (a). Then

      E(N ) = E(N |N = 0)P (N = 0) + E(N |N ≥ 1)P (N ≥ 1) = pE(N |N ≥ 1).

The conditional distribution of N given N ≥ 1 is FS(p): given that the man reaches
b, by symmetry there is probability p of returning to the origin before visiting b again
(call this “success”) and probability 1 − p of returning to b again before returning
to the origin (call this “failure”). Note that the trials are independent since the
situation is the same each time he is at b, independent of the past history. Thus
E(N |N ≥ 1) = 1/p, and
                                                       1
                         E(N ) = pE(N |N ≥ 1) = p ·      = 1.
                                                       p
Surprisingly, the result doesn’t depend on the value of b, and our proof didn’t require
knowing the value of p.                                                              




9.2    Conditional expectation given an r.v.

In this section we introduce conditional expectation given a random variable. That
is, we want to understand what it means to write E(Y |X) for an r.v. X. We will see
that E(Y |X) is a random variable that is, in a certain sense, our best prediction of
Y , assuming we get to know X.
The key to understanding E(Y |X) is first to understand E(Y |X = x). Since X = x
is an event, E(Y |X = x) is just the conditional expectation of Y given this event,
and it can be computed using the conditional distribution of Y given X = x.
If Y is discrete, we use the conditional PMF P (Y = y|X = x) in place of the
unconditional PMF P (Y = y):
                                     X
                      E(Y |X = x) =      yP (Y = y|X = x).
                                         y

Analogously, if Y is continuous, we use the conditional PDF fY |X (y|x) in place of
the unconditional PDF:
                                       Z ∞
                        E(Y |X = x) =       yfY |X (y|x)dy.
                                             −∞
```
