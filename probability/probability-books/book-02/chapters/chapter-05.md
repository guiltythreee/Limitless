# Chapter 5: Continuous Random Variables

**Book:** Introduction to Probability, Second Edition  
**Authors:** Joseph K. Blitzstein and Jessica Hwang  
**Printed pages:** 213–266

> Source transcription from the supplied textbook PDF. Text extraction preserves the original order and page content as far as the PDF text layer allows. Check mathematical notation and figure references against the source where extraction is ambiguous.

```text
Continuous random variables                                                                                                227

                             Histogram of u                                           Unif(0,1) PDF




               0.0     0.2        0.4        0.6       0.8     1.0       0.0    0.2        0.4       0.6       0.8   1.0


                       Histogram of log(u/(1−u))                                      Logistic PDF




              −15    −10     −5         0          5    10     15        −15   −10    −5         0         5    10   15




FIGURE 5.7
Top: Histogram of 106 draws of U ∼ Unif(0,
                                      1),  with Unif(0, 1) PDF for comparison.
                        6                U
Bottom: Histogram of 10 draws of log 1−U , with Logistic PDF for comparison.


Figure 5.7 displays a histogram of the realizations of U alongside
                                                                    the
                                                                       Unif(0, 1)
                                                                   U
PDF; below that, we have a histogram of the realizations of log 1−U next to the
Logistic PDF. As we can see, the second histogram looks very much like the Logistic
PDF. Thus, by applying F −1 , we were able to transform our Uniform draws into
Logistic draws, exactly as claimed by the universality of the Uniform.
Conversely, Part 2 of the universality property states that if X ∼ Logistic, then

                                                               eX
                                        F (X) =                     ∼ Unif(0, 1).                                           
                                                             1 + eX
Example 5.3.5 (Universality with Rayleigh). The Rayleigh CDF is
                                                                     2
                                            F (x) = 1 − e−x /2 ,               x > 0.

The quantile function (the inverse of the CDF) is
                                       p
                             F −1 (u) = −2 log(1 − u),
                                      p
so if U ∼ Unif(0, 1), then F −1 (U ) = −2 log(1 − U ) ∼ Rayleigh.
We again generated 1 million realizations of U ∼ Unif(0, 1) and transformed them


228                                                                                         Introduction to Probability

                                Histogram of u                                       Unif(0,1) PDF




                 0.0      0.2        0.4       0.6       0.8       1.0   0.0   0.2    0.4    0.6     0.8   1.0


                       Histogram of sqrt(−2*log(1−u))                                Rayleigh PDF




                 0       1       2         3         4         5     6   0     1       2      3      4     5




FIGURE 5.8
Top: Histogram of 1 million draws from U ∼ Unif(0, 1),
                                                   p with Unif(0, 1) PDF for com-
parison. Bottom: Histogram of 1 million draws from −2 log(1 − U ), with Rayleigh
PDF for comparison.

                                    p
           1 million realizations of −2 log(1 − U ). As Figure 5.8 shows, the real-
to produce p
izations of −2 log(1 − U ) look very similar to the Rayleigh PDF, as predicted by
the universality of the Uniform.
                                                                                 2
Conversely, if X ∼ Rayleigh, then F (X) = 1 − e−X /2 ∼ Unif(0, 1).                                                  

Next, let us consider the extent to which universality of the Uniform holds for
discrete random variables. The CDF F of a discrete r.v. has jumps and flat regions,
so F −1 does not exist (in the usual sense). But Part 1 still holds in the sense
that given a Uniform random variable, we can construct an r.v. with any discrete
distribution we want. The difference is that instead of working with the CDF, which
is not invertible, it is more straightforward to work with the PMF.

Suppose we want to use U ∼ Unif(0, 1) to construct a discrete r.v. X with PMF
pj = P (X = j) for j = 0, 1, 2, . . . , n. As illustrated in Figure 5.9, we can chop up
the interval (0, 1) into pieces of lengths p0 , p1 , . . . , pn . By the properties of a valid
PMF, the sum of the pj ’s is 1, so this perfectly divides up the interval, without
overshooting or undershooting.

Now define X to be the r.v. which equals 0 if U falls into the p0 interval, 1 if U falls
into the p1 interval, 2 if U falls into the p2 interval, and so on. Then X is a discrete


Continuous random variables                                                                 229

                    0        1          2                        n–1       n


                                                        ...
                   p0       p1         p2                         pn – 1   pn

FIGURE 5.9
Given a PMF, chop up the interval (0, 1) into pieces, with lengths given by the PMF
values.

r.v. taking on values 0 through n. The probability that X = j is the probability
that U falls into the interval of length pj . But for a Unif(0, 1) r.v., probability is
length, so P (X = j) is precisely pj , as desired!
The same trick will work for a discrete r.v. that can take on infinitely many values,
such as a Poisson; we’ll need to chop (0, 1) into infinitely many pieces, but the total
length of the pieces is still 1.
We now know how to take an arbitrary PMF and create an r.v. with that PMF.
This fulfills our promise from Chapter 3 that any function with the properties given
in Theorem 3.2.7 is the PMF of some r.v.
h 5.3.6. Part 2 of universality of the Uniform, on the other hand, fails for discrete
r.v.s. A function of a discrete r.v. is still discrete, so if X is discrete, then F (X) is still
discrete. So F (X) doesn’t have a Uniform distribution. For example, if X ∼ Bern(p),
then F (X) has only two possible values: F (0) = 1 − p and F (1) = 1.
The upshot of universality is that we can use a Uniform r.v. U to generate r.v.s
from both continuous and discrete distributions: in the continuous case, we can
plug U into the inverse CDF, and in the discrete case, we can chop up the unit
interval according to the desired PMF. Part 1 of universality of the Uniform is
often useful in practice when running simulations (since the software being used
may know how to generate Uniform r.v.s but not know how to generate r.v.s with
the distribution of interest), though the extent to which it is useful depends on how
tractable it is to compute the inverse CDF. Part 2 is important for certain widely
used techniques in statistical inference, by providing a transformation that converts
an r.v. with an unknown distribution to an r.v. with a known, simple distribution:
the Uniform.
Using our analogy of distributions as blueprints and r.v.s as houses, the beauty of
the universality property is that the Uniform distribution is a very simple blueprint,
and it’s easy to create a house from that blueprint; universality of the Uniform then
gives us a simple rule for remodeling the Uniform house into a house with any other
blueprint, no matter how complicated!
To conclude this section, we give an elegant identity that is often useful for finding
the expectation of a nonnegative r.v. The identity also has a neat visual interpreta-


230                                                            Introduction to Probability

tion related to universality of the Uniform, LOTUS, and the relationship between
CDFs and quantile functions.
Definition 5.3.7. The survival function of an r.v. X with CDF F is the function
G given by G(x) = 1 − F (x) = P (X > x).
Theorem 5.3.8 (Expectation by integrating the survival function). Let X be a
nonnegative r.v. Its expectation can be found by integrating its survival function:
                                     Z ∞
                            E(X) =        P (X > x)dx.
                                           0


This result is the continuous analog of Theorem 4.4.8 (note though that it holds for
any nonnegative r.v., not just for continuous nonnegative r.v.s). Actuaries some-
times call it the Darth Vader rule, for obscure reasons; statisticians are more likely
to refer to it as finding the expectation by integrating the survival function.

Proof. For any number x ≥ 0, we can write
                             Z x      Z ∞
                         x=      dt =     I(x > t)dt,
                                   0               0

where I(x > t) is 1 if x ≥ t and 0 otherwise. So
                                     Z ∞
                             X(s) =      I(X(s) > t)dt,
                                       0

for each s in the sample space. We can write this more compactly as
                                   Z ∞
                               X=      I(X > t)dt.
                                       0

Taking the expectation of both sides and swapping the E with the integral (which
can be justified using results from real analysis), we have
                 Z ∞               Z ∞                    Z ∞
     E(X) = E           I(X > t)dt =        E(I(X > t))dt =     P (X > t)dt.  
                    0                          0                  0


For a visual explanation of this identity, we can graph a CDF and interpret a certain
area in two different ways: as the integral of the survival function, and as the integral
of the quantile function.
A prototypical CDF of a nonnegative, continuous r.v. with CDF F is shown in
Figure 5.10, with the area between the CDF curve and the horizontal line p = 1
shaded. This area can be found by integrating 1 − F (x), the difference between the
line and the curve, from 0 to ∞.
But another way to find this area is to turn your head sideways and integrate with


Continuous random variables                                                                 231
                 1


                                              P(X>x) = 1 - F(x)
                0.9




                0.8
                               F-1(p)
                                             (x,F(x))=(x,p)
                0.7



                0.6



                0.5
            p




                0.4




                0.3



                0.2



                0.1



                 0
                      0   10       20   30      40        50      60   70   80   90   100


                                                          x


FIGURE 5.10
The area above a certain CDF and below the line p = 1 is shaded. This area can be
interpreted in two ways: as the integral of the survival function, or as the integral
of the quantile function.

respect to the vertical axis variable p rather than the horizontal axis variable x. This
gives the integral of the quantile function, which, letting U ∼ Unif(0, 1), is
                         Z 1
                             F −1 (p)dp = E(F −1 (U )) = E(X),
                               0

by LOTUS and universality of the Uniform. So again we have
                Z ∞                   Z 1
                     (1 − F (x))dx =      F −1 (p)dp = E(X).
                          0                           0




5.4   Normal

The Normal distribution is a famous continuous distribution with a bell-shaped
PDF. It is extremely widely used in statistics because of a theorem, the central limit
theorem, which says that under very weak assumptions, the sum of a large number of
i.i.d. random variables has an approximately Normal distribution, regardless of the
distribution of the individual r.v.s. This means we can start with independent r.v.s
from almost any distribution, discrete or continuous, but once we add up a bunch of
them, the distribution of the resulting r.v. looks like a Normal distribution.


232                                                         Introduction to Probability

The central limit theorem is a topic for Chapter 10, but in the meantime, we’ll
introduce the properties of the Normal PDF and CDF and derive the expectation
and variance of the Normal distribution. To do this, we will again use the strategy
of location-scale transformation by starting with the simplest Normal distribution,
the standard Normal, which is centered at 0 and has variance 1. After deriving the
properties of the standard Normal, we’ll be able to get to any Normal distribution
we want by shifting and scaling.
Definition 5.4.1 (Standard Normal distribution). A continuous r.v. Z is said to
have the standard Normal distribution if its PDF ϕ is given by

                                1   2
                        ϕ(z) = √ e−z /2 ,     −∞ < z < ∞.
                                2π

We write this as Z ∼ N (0, 1) since, as we will show, Z has mean 0 and variance 1.
The constant √12π in front of the PDF may look surprising (why is something with
π needed in front of something with e, when there are no circles in sight?), but it’s
exactly what is needed to make the PDF integrate to 1. Such constants are called
normalizing constants because they normalize the total area under the PDF to 1.
We’ll verify soon that this is a valid PDF.
The standard Normal CDF Φ is the accumulated area under the PDF:
                         Z z           Z z
                                             1     2
                  Φ(z) =      ϕ(t)dt =     √ e−t /2 dt.
                          −∞            −∞   2π

Some people, upon seeing the function Φ for the first time, express dismay that it
is left in terms of an integral. Unfortunately, we have little choice in the matter:
it turns out to be mathematically impossible to find a closed-form expression for
the antiderivative of ϕ, meaning that we cannot express Φ as a finite sum of more
familiar functions like polynomials or exponentials. But closed-form or no, it’s still
a well-defined function: if we give Φ an input z, it returns the accumulated area
under the PDF from −∞ up to z.
Notation 5.4.2. We can tell the Normal distribution must be special because the
standard Normal PDF and CDF get their own Greek letters. By convention, we use
ϕ for the standard Normal PDF and Φ for the CDF. We will often use Z to denote
a standard Normal random variable.
The standard Normal PDF and CDF are plotted in Figure 5.11. The PDF is bell-
shaped and symmetric about 0, and the CDF is S-shaped. These have the same
general shape as the Logistic PDF and CDF that we saw Example 5.1.6, but the
Normal PDF decays to 0 much more quickly.
There are several important symmetry properties that can be deduced from the
standard Normal PDF and CDF.

   1. Symmetry of PDF : ϕ satisfies ϕ(z) = ϕ(−z), i.e., ϕ is an even function.


Continuous random variables                                                            233




      0.5




                                                  1.0
      0.4




                                                  0.8
      0.3




                                                  0.6
                                                CDF
   PDF
      0.2




                                                  0.4
      0.1




                                                  0.2
      0.0




                                                  0.0
            −3   −2   −1    0   1   2       3           −3   −2   −1   0   1   2   3
                            x                                          x


FIGURE 5.11
Standard Normal PDF ϕ (left) and CDF Φ (right).

   2. Symmetry of tail areas: The area under the PDF curve to the left of −2,
      which is P (Z ≤ −2) = Φ(−2) by definition, equals the area to the right
      of 2, which is P (Z ≥ 2) = 1 − Φ(2). In general, we have

                                        Φ(z) = 1 − Φ(−z)

         for all z. This can be seen visually by looking at the PDF curve, and
         mathematically by substituting u = −t below and using the fact that
         PDFs integrate to 1:
                      Z −z          Z ∞               Z z
             Φ(−z) =       ϕ(t)dt =     ϕ(u)du = 1 −      ϕ(u)du = 1 − Φ(z).
                           −∞           z                     −∞


   3. Symmetry of Z and −Z: If Z ∼ N (0, 1), then −Z ∼ N (0, 1) as well. To
      see this, note that the CDF of −Z is

                            P (−Z ≤ z) = P (Z ≥ −z) = 1 − Φ(−z),

         but that is Φ(z), according to what we just argued. So −Z has CDF Φ.

We need to prove three key facts about the standard Normal, and then we’ll be
ready to handle general Normal distributions: we need to show that ϕ is a valid
PDF, that E(Z) = 0, and that Var(Z) = 1.
                                                                          2      √
To verify the validity of ϕ, we’ll show that the total area under e−z /2 is 2π.
                                                 2
However, we can’t find the antiderivative of e−z /2 directly, again because of the an-
noying fact that the antiderivative isn’t expressible in closed form. But this doesn’t
mean we can’t do definite integrals, with some ingenuity.
An amazing trick saves the day here: write down the integral twice. Usually, writing


234                                                                                   Introduction to Probability

down the same problem repeatedly is more a sign of frustration than a problem-
solving strategy. But in this case, it allows a neat conversion to polar coordi-
nates:
       Z ∞                Z ∞             Z ∞               Z ∞              
               −z 2 /2            −z 2 /2             −x2 /2             −y 2 /2
             e         dz        e        dz =      e        dx        e         dy
         −∞                   −∞                 −∞                 −∞
                                               Z ∞Z ∞
                                                            x2 +y 2
                                             =          e− 2 dxdy
                                                             −∞        −∞
                                                            Z 2π Z ∞
                                                                                 2
                                                        =                   e−r /2 rdrdθ.
                                                             0      0

In the first step, we used the fact that z is just a dummy variable in each integral,
so we are allowed to give it a different name (or two different names, one for each
integral). The extra r that appears in the final step comes from the Jacobian of
the transformation to polar coordinates, as explained in Section A.7.2 of the math
appendix. That r is also what saves us from the impossibility of the original integral,
since we can now use the substitution u = r2 /2, du = rdr. This gives
                     Z 2π Z ∞                               Z 2π Z ∞                  
                                       −r2 /2                                 −u
                                   e            rdrdθ =                      e       du dθ
                       0       0                             0          0
                                                            Z 2π
                                                        =          1dθ = 2π.
                                                             0

Therefore,
                                         Z ∞                       √
                                                    2
                                                 e−z /2 dz =           2π,
                                          −∞

as we wanted to show.

The expectation of the standard Normal has to be 0, by the symmetry of the PDF;
no other balancing point would make sense. We can also see this symmetry by
looking at the definition of E(Z):
                                                        Z ∞
                                           1                            2
                                   E(Z) = √                      ze−z /2 dz,
                                           2π           −∞

                           2
and since g(z) = ze−z /2 is an odd function (see Section A.2.3 of the math appendix
for more on even and odd functions), the area under g from −∞ to 0 cancels the
area under g from 0 to ∞. Therefore E(Z) = 0. In fact, the same argument shows
that E(Z n ) = 0 for any odd positive integer n.1

Getting the mean was easy (one might even say it was EZ), but the variance
   1
    A subtlety is that ∞ − ∞ is undefined, so we also want to check that the area under the curve
 n −z 2 /2                                                2
z e      from 0 to ∞ is finite. But this is true since e−z /2 goes to 0 extremely quickly (faster
than exponential decay), more than offsetting the growth of the polynomial z n .


Continuous random variables                                                        235

calculation is a bit more involved. By LOTUS,
                         Var(Z) = E(Z 2 ) − (EZ)2 = E(Z 2 )
                                       Z ∞
                                   1                 2
                                =√           z 2 e−z /2 dz
                                   2π −∞
                                       Z ∞
                                   2                2
                                =√           z 2 e−z /2 dz
                                   2π 0
                                      2
The last step uses the fact that z 2 e−z /2 is an even function. Now we use integration
                                      2                                   2
by parts with u = z and dv = ze−z /2 dz, so du = dz and v = −e−z /2 :
                                                  ∞   Z ∞              
                                2          −z 2 /2           −z 2 /2
                   Var(Z) =   √        −ze           +     e         dz
                                2π                 0    0
                                          √ 
                                2             2π
                           =√          0+
                                2π            2
                           = 1.
                                                                     2
The first term of the integration by parts√equals 0 because e−z /2 decays much
faster than z grows, and the second term is √
                                            2π/2 because it’s half of the total area
          2
under e−z /2 , which we’ve already proved is 2π. So indeed, the standard Normal
distribution has mean 0 and variance 1.
The general Normal distribution has two parameters, denoted µ and σ 2 , which
correspond to the mean and variance (so the standard Normal is the special case
where µ = 0 and σ 2 = 1). Starting with a standard Normal r.v. Z ∼ N (0, 1), we can
get a Normal r.v. with any mean and variance by a location-scale transformation
(shifting and scaling).
Definition 5.4.3 (Normal distribution). If Z ∼ N (0, 1), then
                                    X = µ + σZ
is said to have the Normal distribution with mean µ and variance σ 2 , for any real
µ and σ 2 with σ > 0. We denote this by X ∼ N (µ, σ 2 ).
It’s clear by properties of expectation and variance that X does in fact have mean
µ and variance σ 2 :
                      E(µ + σZ) = E(µ) + σE(Z) = µ,
                     Var(µ + σZ) = Var(σZ) = σ 2 Var(Z) = σ 2 .
Note that we multiply Z by the standard deviation σ, not σ 2 ; else the units would
be wrong and X would have variance σ 4 .
Of course, if we can get from Z to X, then we can get from X back to Z. The process
of getting a standard Normal from a non-standard Normal is called, appropriately
enough, standardization. For X ∼ N (µ, σ 2 ), the standardized version of X is
                                  X −µ
                                       ∼ N (0, 1).
                                    σ


236                                                                   Introduction to Probability

We can use standardization to find the CDF and PDF of X in terms of the standard
Normal CDF and PDF.
Theorem 5.4.4 (Normal CDF and PDF). Let X ∼ N (µ, σ 2 ). Then the CDF of X
is                                       
                                      x−µ
                          F (x) = Φ         ,
                                       σ
and the PDF of X is                     
                                     x−µ 1
                         f (x) = ϕ            .
                                      σ    σ

Proof. For the CDF, we start from the definition F (x) = P (X ≤ x), standardize,
and use the CDF of the standard Normal:
                                                             
                                    X −µ      x−µ           x−µ
            F (x) = P (X ≤ x) = P          ≤          =Φ           .
                                      σ         σ            σ
Then we differentiate to get the PDF, remembering to apply the chain rule:
                                                 
                                        d     x−µ
                               f (x) =    Φ
                                       dx      σ
                                              
                                           x−µ 1
                                     =ϕ            .
                                            σ    σ
We can also write out the PDF as
                                                          
                                        1         (x − µ)2
                              f (x) = √     exp −            .                                   
                                        2πσ         2σ 2

Finally, three important benchmarks for the Normal distribution are the probabil-
ities of falling within one, two, and three standard deviations of the mean. The
68-95-99.7% rule tells us that these probabilities are what the name suggests.
Theorem 5.4.5 (68-95-99.7% rule). If X ∼ N (µ, σ 2 ), then
                                   P (|X − µ| < σ) ≈ 0.68,
                                  P (|X − µ| < 2σ) ≈ 0.95,
                                  P (|X − µ| < 3σ) ≈ 0.997.

We can use this rule to get quick approximations of Normal probabilities.2 Often it
is easier to apply the rule after standardizing, in which case we have
                                      P (|Z| < 1) ≈ 0.68,
                                      P (|Z| < 2) ≈ 0.95,
                                      P (|Z| < 3) ≈ 0.997.
   2
    The 68-95-99.7% rule says that 95% of the time, a Normal random variable will fall within ±2
standard deviations of its mean. An even more accurate approximation says that 95% of the time,
a Normal r.v. is within ±1.96 SDs of its mean. This explains why the number 1.96 comes up very
often in statistics in the context of 95% confidence intervals, which are often created by taking an
estimate and putting a buffer zone of 1.96 SDs on either side.


Continuous random variables                                                       237

Example 5.4.6 (Practice with the standard Normal CDF). Let X ∼ N (−1, 4).
What is P (|X| < 3), exactly (in terms of Φ) and approximately?
Solution:
The event |X| < 3 is the same as the event −3 < X < 3. We use standardization
to express this event in terms of the standard Normal r.v. Z = (X − (−1))/2, then
apply the 68-95-99.7% rule to get an approximation. The exact answer is
                                                           
                          −3 − (−1)     X − (−1)   3 − (−1)
  P (−3 < X < 3) = P                 <           <            = P (−1 < Z < 2),
                              2            2           2
which is Φ(2) − Φ(−1). The 68-95-99.7% rule tells us that P (−1 < Z < 1) ≈ 0.68
and P (−2 < Z < 2) ≈ 0.95. In other words, going from ±1 standard deviation to
±2 standard deviations adds approximately 0.95 − 0.68 = 0.27 to the area under
the curve. By symmetry, this is evenly divided between the areas P (−2 < Z < −1)
and P (1 < Z < 2). Therefore,
                                                                  0.27
    P (−1 < Z < 2) = P (−1 < Z < 1) + P (1 < Z < 2) ≈ 0.68 +           = 0.815.
                                                                   2
This is close to the correct value, Φ(2) − Φ(−1) ≈ 0.8186.                         
As we will see later in the book, several important distributions can be obtained
through transforming Normal r.v.s in natural ways, e.g., squaring or exponentiating.
Chapter 8 delves into transformations in depth, but meanwhile there is a lot that
we can do just using LOTUS and properties of CDFs.
Example 5.4.7 (Folded Normal). Let Y = |Z| with Z ∼ N (0, 1). The distribution
of Y is called a Folded Normal with parameters µ = 0 and σ 2 = 1. In this example,
we will derive the mean, variance, and distribution of Y . At first sight, Y may seem
tricky to deal with since the absolute value function is not differentiable at 0 (due
to its sharp corner), but Y has a perfectly valid continuous distribution.

(a) Find E(Y ).

(b) Find Var(Y ).

(c) Find the CDF and PDF of Y .
Solution:

(a) We will derive the PDF of Y later in this example, but to find E(Y ), LOTUS
says we can work directly with the PDF of Z:
                       Z ∞                        Z ∞                  r
                                 1 −z 2 /2              1 −z 2 /2        2
       E(Y ) = E|Z| =       |z| √ e        dz = 2     z√ e        dz =     .
                        −∞       2π                0    2π               π

(b) Note that Y 2 = Z 2 , so we do not need to do another integral! We have

                          E(Y 2 ) = E(Z 2 ) = Var(Z) = 1,


238                                                          Introduction to Probability

so
                                                            2
                       Var(Y ) = E(Y 2 ) − (E(Y ))2 = 1 −     .
                                                            π

(c) For y ≤ 0, the CDF of Y is FY (y) = P (Y ≤ y) = 0. For y > 0, the CDF is

FY (y) = P (Y ≤ y) = P (|Z| ≤ y) = P (−y ≤ Z ≤ y) = Φ(y) − Φ(−y) = 2Φ(y) − 1.

So the PDF of Y is 2ϕ(y) for y ≥ 0, and 0 otherwise, where ϕ is the N (0, 1) PDF.

Sanity check : Note that 2Φ(y) − 1 → 2 − 1 = 1 as y → ∞, as it must, and that
the CDF of Y is a continuous function since Φ is continuous and at 0 there is not
a jump: 2Φ(0) − 1 = 0. Also, the PDF of Y makes sense since taking the absolute
value of Z “folds” the probability mass of a negative range of values of Z over to
the positive side, e.g., the probability for Z values between −2 and −1 contributes
to the probability for Y values between 1 and 2. This results in zero density for
negative values and double the density for positive values.                      




5.5   Exponential

The Exponential distribution is the continuous counterpart to the Geometric dis-
tribution. Recall that a Geometric random variable counts the number of failures
before the first success in a sequence of Bernoulli trials. The story of the Exponen-
tial distribution is analogous, but we are now waiting for a success in continuous
time, where successes arrive at a rate of λ successes per unit of time. The average
number of successes in a time interval of length t is λt, though the actual number of
successes varies randomly. An Exponential random variable represents the waiting
time until the first arrival of a success.
Definition 5.5.1 (Exponential distribution). A continuous r.v. X is said to have
the Exponential distribution with parameter λ, where λ > 0, if its PDF is

                              f (x) = λe−λx ,     x > 0.

We denote this by X ∼ Expo(λ).
The corresponding CDF is

                             F (x) = 1 − e−λx ,    x > 0.

The Expo(1) PDF and CDF are plotted in Figure 5.12. Note the resemblance to
the Geometric PMF and CDF pictured in Chapter 4. Exercise 43 explores the
sense in which the Geometric converges to the Exponential, in the limit where the
Bernoulli trials are performed faster and faster but with smaller and smaller success
probabilities.


Continuous random variables                                                                                        239




        1.2




                                                                   1.0
        1.0




                                                                   0.8
        0.8




                                                                   0.6
                                                                CDF
   PDF
        0.6




                                                                   0.4
        0.4




                                                                   0.2
        0.2
        0.0




                                                                   0.0
              0.0   0.5   1.0   1.5       2.0       2.5   3.0            0.0   0.5   1.0   1.5   2.0   2.5   3.0
                                x                                                          x


FIGURE 5.12
Expo(1) PDF and CDF.


We’ve seen how all Uniform and Normal distributions are related to one another
via location-scale transformations, and we might wonder whether the Exponential
distribution allows this too. Exponential r.v.s are defined to have support (0, ∞),
and shifting would change the left endpoint. But scale transformations work nicely,
and we can use scaling to get from the simple Expo(1) to the general Expo(λ): if
X ∼ Expo(1), then
                                     X
                                Y =     ∼ Expo(λ),
                                      λ
since                                                
                                          X
                P (Y ≤ y) = P               ≤y            = P (X ≤ λy) = 1 − e−λy ,              y > 0.
                                          λ

Conversely, if Y ∼ Expo(λ), then λY ∼ Expo(1).

This means that just as we did for the Uniform and the Normal, we can get the mean
and variance of the Exponential distribution by starting with X ∼ Expo(1). Both
E(X) and Var(X) are obtained using standard integration by parts calculations.
This gives
                                                          Z ∞
                                      E(X) =                    xe−x dx = 1,
                                                          0
                                                          Z ∞
                                      E(X ) =   2
                                                                x2 e−x dx = 2,
                                                          0
                                    Var(X) = E(X 2 ) − (EX)2 = 1.

In the next chapter we’ll introduce a new tool called the moment generating func-
tion, which will let us get these results without integration.


240                                                             Introduction to Probability

For Y = X/λ ∼ Expo(λ) we then have
                                     1         1
                                E(Y ) =E(X) = ,
                                     λ         λ
                                      1          1
                            Var(Y ) = 2 Var(X) = 2 ,
                                     λ           λ
so the mean and variance of the Expo(λ) distribution are 1/λ and 1/λ2 , respectively.
As we’d expect intuitively, the faster the rate of arrivals λ, the shorter the average
waiting time.
The Exponential distribution has a very special property called the memoryless
property, which says that even if you’ve waited for hours or days without success,
the success isn’t any more likely to arrive soon. In fact, you might as well have just
started waiting 10 seconds ago. The definition formalizes this idea.
Definition 5.5.2 (Memoryless property). A continuous distribution is said to have
the memoryless property if a random variable X from that distribution satisfies

                         P (X ≥ s + t|X ≥ s) = P (X ≥ t)

for all s, t ≥ 0.
Here s represents the time you’ve already spent waiting; the definition says that
after you’ve waited s minutes, the probability you’ll have to wait another t minutes
is exactly the same as the probability of having to wait t minutes with no previous
waiting time under your belt. Another way to state the memoryless property is that
conditional on X ≥ s, the additional waiting time X − s is still distributed Expo(λ).
In particular, this implies
                                                          1
                         E(X|X ≥ s) = s + E(X) = s +        .
                                                          λ
(Conditional expectation is explained in detail in Chapter 9, but the meaning should
already be clear: for any r.v. X and event A, E(X|A) is the expected value of X
given A; this can be defined by replacing the unconditional PMF or PDF of X in
the definition of E(X) by the conditional PMF or PDF of X given A.)
Using the definition of conditional probability, we can directly verify that the Ex-
ponential distribution has the memoryless property. Let X ∼ Expo(λ). Then

                                P (X ≥ s + t)   e−λ(s+t)
        P (X ≥ s + t|X ≥ s) =                 =          = e−λt = P (X ≥ t).
                                  P (X ≥ s)      e−λs

What are the implications of the memoryless property? If you’re waiting at a bus
stop and the time until the bus arrives has an Exponential distribution, then con-
ditional on your having waited 30 minutes, the bus isn’t due to arrive soon. The
distribution simply forgets that you’ve been waiting for half an hour, and your re-
maining wait time is the same as if you had just shown up to the bus stop. If the


Continuous random variables                                                         241

lifetime of a machine has an Exponential distribution, then no matter how long the
machine has been functional, conditional on having lived that long, the machine
is as good as new: there is no wear-and-tear effect that makes the machine more
likely to break down soon. If human lifetimes were Exponential, then conditional
on having survived to the age of 80, your remaining lifetime would have the same
distribution as that of a newborn baby!
Clearly, the memoryless property is not an appropriate description for human or
machine lifetimes. Why then do we care about the Exponential distribution?

     1. Some physical phenomena, such as radioactive decay, truly do exhibit the
        memoryless property, so the Exponential is an important model in its own
        right.
     2. The Exponential distribution is well-connected to other named distribu-
        tions. In the next section, we’ll see how the Exponential and Poisson dis-
        tributions can be united by a shared story, and we’ll discover many more
        connections in later chapters.
     3. The Exponential serves as a building block for more flexible distributions,
        such as the Weibull distribution (introduced in Chapter 6), that allow
        for a wear-and-tear effect (where older units are due to break down) or
        a survival-of-the-fittest effect (where the longer you’ve lived, the stronger
        you get). To understand these distributions, we first have to understand
        the Exponential.

The memoryless property is a very special property of the Exponential distribution:
no other continuous distribution on (0, ∞) is memoryless! Let’s prove this.
Theorem 5.5.3. If X is a positive continuous random variable with the memoryless
property, then X has an Exponential distribution.

Proof. Suppose X is a positive continuous r.v. with the memoryless property. Let
F be the CDF of X and G be the survival function of X, given by G(x) = 1 − F (x).
We will show that G(x) = e−λx for some λ, by first showing that G(xt) = G(t)x for
all real x > 0. The memoryless property says that

                                  G(s + t) = G(s)G(t)

for all s, t ≥ 0. Putting s = t, we have

                                     G(2t) = G(t)2 ,

so
              G(3t) = G(2t + t) = G(2t)G(t) = G(t)3 , G(4t) = G(t)4 , . . . .
We now have
                                     G(mt) = G(t)m


242                                                           Introduction to Probability

for m a positive integer. Let’s extend this in stages. Replacing t by t/2 in G(2t) =
G(t)2 , we have G(t/2) = G(t)1/2 . Similarly,
                                     
                                      t
                                  G       = G(t)1/n
                                     n

for any positive integer n. It follows that
                            m    t m
                         G      t = G         = G(t)m/n
                              n             n

for any positive integers m, n, so

                                     G(xt) = G(t)x

for all positive rational numbers x. Any positive real number can be written as a
limit of positive rational numbers so, using the fact that G is a continuous function,
the above equation holds for all positive real numbers x. Taking t = 1, we have

                                G(x) = G(1)x = e−λx ,

where λ = − log(G(1)) > 0. This is exactly the form we wanted for G, so X has an
Exponential distribution.                                                      

The memoryless property is defined analogously for discrete distributions: a discrete
distribution is memoryless if for X an r.v. with that distribution,

                          P (X ≥ j + k|X ≥ j) = P (X ≥ k)

for all nonnegative integers j, k. In view of the analogy between the Geometric and
Exponential stories (or if you have solved Exercise 32 from Chapter 4), you might
guess that the Geometric distribution is memoryless. If so, you would be correct! If
we’re waiting for the first Heads in a sequence of fair coin tosses, and in a streak
of bad luck we happen to get ten Tails in a row, this has no impact on how many
additional tosses we’ll need: the coin isn’t due for a Heads, nor conspiring against
us to perpetually land Tails. The coin is memoryless. The Geometric is the only
memoryless discrete distribution taking values in {0, 1, 2, . . . }, and the Exponential
is the only memoryless continuous distribution taking values in (0, ∞).
As practice with the memoryless property, the following example chronicles the ad-
ventures of Fred, who experiences firsthand the frustrations of the memoryless prop-
erty after moving to a town with a memoryless public transportation system.
Example 5.5.4 (Blissville and Blotchville). Fred lives in Blissville, where buses
always arrive exactly on time, with the time between successive buses fixed at 10
minutes. Having lost his watch, he arrives at the bus stop at a uniformly random
time on a certain day (assume that buses run 24 hours a day, every day, and that
the time that Fred arrives is independent of the bus arrival process).


Continuous random variables                                                      243

(a) What is the distribution of how long Fred has to wait for the next bus? What
is the average time that Fred has to wait?
(b) Given that the bus has not yet arrived after 6 minutes, what is the probability
that Fred will have to wait at least 3 more minutes?
(c) Fred moves to Blotchville, a city with inferior urban planning and where buses
are much more erratic. Now, when any bus arrives, the time until the next bus
arrives is an Exponential random variable with mean 10 minutes. Fred arrives at
the bus stop at a random time (assume that Blotchville has followed and will follow
this system for all of eternity, and that the time that Fred arrives is independent
of the bus arrival process). What is the distribution of Fred’s waiting time for the
next bus? What is the average time that Fred has to wait?
(d) When Fred complains to a friend how much worse transportation is in
Blotchville, the friend says: “Stop whining so much! You arrive at a uniform in-
stant between the previous bus arrival and the next bus arrival. The average length
of that interval between buses is 10 minutes, but since you are equally likely to
arrive at any time in that interval, your average waiting time is only 5 minutes.”
Fred disagrees, both from experience and from solving Part (c) while waiting for
the bus. Explain what is wrong with the friend’s reasoning.
Solution:
(a) The distribution is Uniform on (0, 10), so the mean is 5 minutes.
(b) Let T be the waiting time. Then

                                P (T ≥ 9, T > 6)   P (T ≥ 9)   1/10  1
        P (T ≥ 6 + 3|T > 6) =                    =           =      = .
                                    P (T > 6)      P (T > 6)   4/10  4

In particular, Fred’s waiting time in Blissville is not memoryless; conditional on
having waited 6 minutes already, there’s only a 1/4 chance that he’ll have to wait
at least another 3 minutes, whereas if he had just showed up, there would be a
P (T ≥ 3) = 7/10 chance of having to wait at least 3 minutes.
(c) By the memoryless property, the distribution is Exponential with parameter
1/10 (and mean 10 minutes) regardless of when Fred arrives; how much longer the
next bus will take to arrive is independent of how long ago the previous bus arrived.
The average time that Fred has to wait is 10 minutes.
(d) Fred’s friend is making the mistake, explained in h 4.1.3, of replacing a random
variable (the time between buses) by its expectation (10 minutes), thereby ignoring
the variability in interarrival times. The average length of a time interval between
two buses is 10 minutes, but Fred is not equally likely to arrive at any of these
intervals: Fred is more likely to arrive during a long interval between buses than to
arrive during a short interval between buses. For example, if one interval between
buses is 50 minutes and another interval is 5 minutes, then Fred is 10 times more
likely to arrive during the 50-minute interval.


244                                                           Introduction to Probability

This phenomenon is known as length-biased sampling, and it comes up in many real-
life situations. For example, asking randomly chosen mothers how many children
they have yields a different distribution from asking randomly chosen people how
many siblings they have, including themselves. Asking students the sizes of their
classes and averaging those results may give a much higher value than taking a
list of classes and averaging the sizes of each; this is called the class size paradox.
See exercises 16 and 17 from Chapter 4 for more about the class size paradox and
length-biased sampling.
Fred’s adventures in Blissville and Blotchville continue in the exercises (see also
MacKay [17] for more of Fred’s adventures). The bus arrivals in Blotchville follow
a Poisson process, which is the topic of the next section.                       




5.6   Poisson processes

The Exponential distribution is closely connected to the Poisson distribution, as
suggested by our use of λ for the parameters of both distributions. In this section
we will see that the Exponential and Poisson are linked by a common story, which
is the story of the Poisson process. A Poisson process is a sequence of arrivals
occurring at different points on a timeline, such that the number of arrivals in a
particular interval of time has a Poisson distribution. Poisson processes are discussed
in much greater detail in Chapter 13, but we already have the tools to understand
the definition and basic properties.
Definition 5.6.1 (Poisson process). A process of arrivals in continuous time is
called a Poisson process with rate λ if the following two conditions hold:

        1. The number of arrivals that occur in an interval of length t is a Pois(λt)
       random variable.
        2. The numbers of arrivals that occur in disjoint intervals are indepen-
       dent of each other. For example, the numbers of arrivals in the intervals
       (0, 10), [10, 12), and [15, ∞) are independent.

In this section, we will focus on Poisson processes on (0, ∞), but we can also define
Poisson processes on (−∞, ∞) or other intervals, and in Chapter 13 we will introduce
Poisson processes in more than one dimension. A sketch of a Poisson process on
(0, ∞) is pictured in Figure 5.13. Each X marks the spot of an arrival.
For concreteness, suppose that the arrivals are emails landing in an inbox according
to a Poisson process with rate λ. There are several things we might want to know
about this process. One question we could ask is: in one hour, how many emails
will arrive? The answer comes directly from the definition, which tells us that the


Continuous random variables                                                         245




              +

                              +
                              +


                                                         +
                                                         +
    0              T1             T2      T3                 T4       T5
FIGURE 5.13
A Poisson process on (0, ∞). Each X corresponds to an arrival.


number of emails in an hour follows a Pois(λ) distribution. Notice that the number
of emails is a nonnegative integer, so a discrete distribution is appropriate.
But we could also flip the question around and ask: how long does it take until the
first email arrives (measured relative to some fixed starting point)? The waiting time
for the first email is a positive real number, so a continuous distribution on (0, ∞) is
appropriate. Let T1 be the time until the first email arrives. To find the distribution
of T1 , we just need to understand one crucial fact: saying that the waiting time for
the first email is greater than t is the same as saying that no emails have arrived
between 0 and t. In other words, if Nt is the number of emails that arrive at or
before time t, then
                           T1 > t is the same event as Nt = 0.
We call this the count-time duality because it connects a discrete r.v., Nt , which
counts the number of arrivals, with a continuous r.v., T1 , which marks the time of
the first arrival. More generally, the count-time duality says that

                         Tn > t is the same event as Nt < n.

Saying that the nth arrival has not happened yet as of time t is equivalent to saying
that, up until time t, there have been fewer than n arrivals.
If two events are the same, they have the same probability. Since Nt ∼ Pois(λt) by
the definition of Poisson process,

                                                e−λt (λt)0
                    P (T1 > t) = P (Nt = 0) =              = e−λt .
                                                   0!
Therefore P (T1 ≤ t) = 1 − e−λt , so T1 ∼ Expo(λ)! The time until the first arrival in
a Poisson process of rate λ has an Exponential distribution with parameter λ.
What about T2 − T1 , the time between the first and second arrivals? Since disjoint
intervals in a Poisson process are independent by definition, the past is irrelevant
once the first arrival occurs. Thus T2 − T1 is independent of the time until the
first arrival, and by the same argument as before, T2 − T1 also has an Exponential
distribution with rate λ.
Similarly, T3 −T2 ∼ Expo(λ) independently of T1 and T2 −T1 . Continuing in this way,
we deduce that all the interarrival times are i.i.d. Expo(λ) random variables. Thus,
Poisson processes tie together two important distributions, one discrete and one


246                                                                 Introduction to Probability

continuous, and the use of a common symbol λ for both the Poisson and Exponential
parameters is felicitous notation, for λ is the arrival rate in the process that unites
the two distributions.
h 5.6.2. The total time until the second arrival, T2 , is the sum of two independent
Expo(λ) r.v.s, T1 and T2 − T1 . This does not have an Exponential distribution, but
rather a Gamma distribution, which is introduced in Chapter 8.
The story of the Poisson process provides intuition for the fact, shown below, that
the minimum of independent Exponential r.v.s is another Exponential r.v.
Example 5.6.3 (Minimum of independent Expos). Let X1 , . . . , Xn be independent,
with Xj ∼ Expo(λj ). Let L = min(X1 , . . . , Xn ). Show that L ∼ Expo(λ1 +· · ·+λn ),
and interpret this intuitively.
Solution:
We can find the distribution of L by considering its survival function P (L > t),
since the survival function is 1 minus the CDF.
      P (L > t) = P (min(X1 , . . . , Xn ) > t) = P (X1 > t, . . . , Xn > t)
                 = P (X1 > t) · · · P (Xn > t) = e−λ1 t · · · e−λn t = e−(λ1 +···+λn )t .
The second equality holds since saying that the minimum of the Xj is greater than
t is the same as saying that all of the Xj are greater than t. The third equality holds
by independence of the Xj . Thus, L has the survival function (and the CDF) of an
Exponential distribution with parameter λ1 + · · · + λn .
Intuitively, we can interpret the λj as the rates of n independent Poisson processes.
We can imagine, for example, X1 as the waiting time for a green car to pass by, X2
as the waiting time for a blue car to pass by, and so on, assigning a color to each
Xj . Then L is the waiting time for a car with any of these colors to pass by, so it
makes sense that L has a combined rate of λ1 + · · · + λn .                        
h 5.6.4. The minimum of independent Exponentials is Exponential, but the max-
imum of independent Exponentials is not Exponential. However, the result about
such a minimum turns out to be useful in studying such a maximum, as illustrated
in the next two examples.
Example 5.6.5 (Maximum of 3 independent Exponentials). Three students are
working independently on their probability homework. All 3 start at 1 pm on a
certain day, and each takes an Exponential time with mean 6 hours to complete the
homework. What is the earliest time at which all 3 students will have completed
the homework, on average?
Solution: Label the students as 1, 2, 3, and let Xj be how long it takes student j to
finish the homework. Let λ = 1/6, and let T be the time when all 3 students will
have completed the homework, so T = max(X1 , X2 , X3 ) with Xi ∼ Expo(λ). The
CDF of T is
               P (T ≤ t) = P (X1 ≤ t, X2 ≤ t, X3 ≤ t) = (1 − e−λt )3 .


Continuous random variables                                                         247

So the PDF of T is
                              fT (t) = 3λe−λt (1 − e−λt )2 .
In particular, T is not Exponential.
Finding E(T ) by integrating tfT (t) is possible but not especially pleasant. A neater
approach is to use the memoryless property and the fact that the minimum of
independent Exponentials is Exponential. We can decompose

                                  T = T1 + T2 + T3 ,

where T1 = min(X1 , X2 , X3 ) is how long it takes for one student to complete the
homework, T2 is the additional time it takes for a second student to complete the
homework, and T3 is the additional time until all 3 have completed the homework.
Then T1 ∼ Expo(3λ), by the result of Example 5.6.3.
By the memoryless property, at the first time when a student completes the home-
work the other two students are starting from fresh, so T2 ∼ Expo(2λ). Again by
the memoryless property, T3 ∼ Expo(λ). The memoryless property also implies that
T1 , T2 , T3 are independent (which would be very useful if we were finding Var(T )).
By linearity,
                                 1    1    1
                        E(T ) =    +    + = 2 + 3 + 6 = 11,
                                3λ 2λ λ
which shows that on average, the 3 students will have all completed the homework
at midnight, 11 hours after they started.                                          
Example 5.6.6 (Machine repair). A certain machine often breaks down and needs
to be fixed. At time 0, the machine is working. It works for an Expo(λ) period of
time (measured in days), and then breaks down. It then takes an Expo(λ) amount
of time to get it fixed, after which it will work for an Expo(λ) time until it breaks
down again, after which it will take an Expo(λ) time to get it fixed, etc. Assume
that these Expo(λ) r.v.s are i.i.d.
(a) A transition occurs when the machine switches from working to being broken,
or switches from being broken to working. Find the distribution of the number of
transitions that occur in the time interval (0, t).
(b) Hoping to reduce the frequency of breakdowns, the machine is redesigned so
that it can continue to function even if one component has failed. The redesigned
machine has 5 components, each of which works for an Expo(λ) amount of time and
then fails, independently. The machine works properly if and only if at most one
component has failed. Currently, all 5 components are working (none have failed).
Find the expected time until the machine breaks down.
Solution:
(a) The times between transitions are i.i.d. Expo(λ), so the times at which transi-
tions occur follow a Poisson process of rate λ. So the desired distribution is Pois(λt).
(b) The time until a component fails is Expo(5λ). Then by the memoryless property,


248                                                                  Introduction to Probability

the additional time until another component fails is Expo(4λ). So the expected time
until the machine breaks down is
                                   1   1      9
                                     +    =       .                               
                                  5λ 4λ      20λ




5.7     Symmetry of i.i.d. continuous r.v.s

Continuous r.v.s that are independent and identically distributed have an impor-
tant symmetry property: all possible orderings are equally likely. Intuitively, this is
because if all we are told is that X1 , . . . , Xn are i.i.d., then they are interchangeable,
in the sense that we have been given no information that distinguishes one Xi from
another Xj . This is reminiscent of the fact that it is common for someone to say “Do
you want the good news first or the bad news first?” but rare for someone to say “I
have two pieces of news. Which do you want to hear first?”, since in the latter case
no distinguishing information has been provided for the two pieces of news.
Proposition 5.7.1. Let X1 , . . . , Xn be i.i.d. from a continuous distribution. Then
                                                                1
                               P (Xa1 < Xa2 < · · · < Xan ) =
                                                                n!
for any permutation a1 , a2 , . . . , an of 1, 2, . . . , n.

Proof. Let F be the CDF of Xj . By symmetry, all orderings of X1 , . . . , Xn are
equally likely. For example, P (X3 < X2 < X1 ) = P (X1 < X2 < X3 ) since both
sides have exactly the same structure: they are both of the form P (A < B < C)
where A, B, C are i.i.d. draws from F . For any i and j with i 6= j, the probability
of the tie Xi = Xj is 0 since Xi and Xj are independent continuous r.v.s. So the
probability of there being at least one tie among X1 , . . . , Xn is also 0, since
                                      
                         [                  X
                     P  {Xi = Xj } ≤         P (Xi = Xj ) = 0.
                              i6=j                   i6=j

Thus, X1 , . . . , Xn are distinct with probability 1, and the probability of any partic-
ular ordering is 1/n!.                                                                 
h 5.7.2. This proposition may fail if the r.v.s are dependent. Let n = 2, and
consider the extreme case where X1 and X2 are so dependent that they are always
equal, i.e., X1 = X2 with probability 1. Then P (X1 < X2 ) = P (X2 < X1 ) = 0. For
dependent X1 , X2 we can also make P (X1 < X2 ) 6= P (X2 < X1 ). For an example,
see Exercise 42 from Chapter 3.
h 5.7.3. If X and Y are i.i.d. continuous r.v.s, then
                                                             1
                                     P (X < Y ) = P (Y < X) = ,
                                                             2


Continuous random variables                                                            249

by symmetry and since the probability of a tie is 0. In contrast, if X and Y are
i.i.d. discrete r.v.s, it is still true that P (X < Y ) = P (Y < X) by symmetry, but
this number is less than 1/2 because of the possibility of a tie. For example, if X
and Y are i.i.d. nonnegative integer-valued r.v.s with P (X = j) = cj , then

      1 = P (X < Y ) + P (X = Y ) + P (Y < X) = 2P (X < Y ) + P (X = Y ),

so                                                        
                                                     ∞
                                                     X
                         1                    1              1
             P (X < Y ) = · (1 − P (X = Y )) = · 1 −   c2j  < .
                         2                    2               2
                                                               j=0


The ranks of a list of distinct numbers are defined by giving the smallest number
a rank of 1, the second smallest a rank of 2, and so on. For example, the ranks for
3.14, 2.72, 1.41, 1.62 are 4, 3, 1, 2. Proposition 5.7.1 says that the ranks of i.i.d. con-
tinuous X1 , . . . , Xn are a uniformly random permutation of the numbers 1, . . . , n.
The next example shows how we can use this symmetry property in conjunction
with indicator r.v.s in problems involving records, such as the record level of rainfall
or the record performance on a high jump.
Example 5.7.4 (Records). Athletes compete one at a time at the high jump. Let
Xj be how high the jth jumper jumped, with X1 , X2 , . . . i.i.d. with a continuous
distribution. We say that the jth jumper sets a record if Xj is greater than all of
Xj−1 , . . . , X1 .

(a) Is the event “the 110th jumper sets a record” independent of the event “the
111th jumper sets a record”?

(b) Find the mean number of records among the first n jumpers. What happens to
the mean as n → ∞?

(c) A double record occurs at time j if both the jth and (j −1)st jumpers set records.
Find the mean number of double records among the first n jumpers. What happens
to the mean as n → ∞?
Solution:
(a) Let Ij be the indicator r.v. for the jth jumper setting a record. By symmetry,
P (Ij = 1) = 1/j (as any of the first j jumps is equally likely to be the highest of
those jumps). Also,

                                                  109!      1
                       P (I110 = 1, I111 = 1) =        =           ,
                                                  111!   110 · 111
since in order for both the 110th and 111th jumps to be records, we need the highest
of the first 111 jumps to be in position 111 and the second highest to be in position
110, and the remaining 109 can be in any order. So

                   P (I110 = 1, I111 = 1) = P (I110 = 1)P (I111 = 1),


250                                                            Introduction to Probability

which shows that the 110th jumper setting a record is independent of the 111th
jumper setting a record. Intuitively, this makes sense since learning that the 111th
jumper sets a record gives us no information about the “internal” matter of how
the first 110 jumps are arranged amongst themselves.

(b)
Pn By1 linearity, the expected number of records among the first n jumpers is
  j=1 j , which goes to ∞ as n → ∞ since the harmonic series diverges.

(c) Let Jj be the indicator r.v. for a double record occurring at time j, for 2 ≤ j ≤ n.
                       1
Then P (Jj = 1) = j(j−1)   , following the logic of Part (a). So the expected number
of double records is
                      Xn               Xn             
                              1                1     1          1
                                     =             −     =1− ,
                          j(j − 1)          j−1 j               n
                     j=2                j=2

since all the other terms cancel out. Thus, the expected number of records goes to
∞ as n → ∞, but the expected number of double records goes to 1.                




5.8    Recap

A continuous r.v. can take on any value in an interval, although the probability that
it equals any particular value is 0. The CDF of a continuous r.v. is differentiable, and
the derivative is called the probability density function (PDF). Probability is given
by area under the PDF curve, not by the value of the PDF at a point. We must
integrate the PDF to get a probability. The table below summarizes and compares
some important concepts in the discrete case and the continuous case.

                             Discrete r.v.                     Continuous r.v.

 CDF                       F (x) = P (X ≤ x)                   F (x) = P (X ≤ x)

 PMF/PDF                       P (X = x)                          f (x) = F 0 (x)
                   • PMF is height of jump of F at x. • PDF is derivative of F .
                   • PMF is nonnegative.               • PDF is nonnegative.
                   • PMF sums to 1.                    • PDF integrates to 1.
                                 P                                   R
                   • P (X ∈ A) =    P (X = x).         • P (X ∈ A) = f (x)dx.
                                  x∈A                                  A
                                  X                                    Z ∞
 Expectation            E(X) =        xP (X = x)             E(X) =             xf (x)dx
                                  x                                        −∞


                                  X                                    Z ∞
 LOTUS                E(g(X)) =       g(x)P (X = x)        E(g(X)) =            g(x)f (x)dx
                                  x                                        −∞


Continuous random variables                                                          251

Three important continuous distributions are the Uniform, Normal, and Exponen-
tial. A Unif(a, b) r.v. is a “completely random” number in the interval (a, b), and it
has the property that probability is proportional to length. The universality of the
Uniform tells us how we can use a Unif(0, 1) r.v. to construct r.v.s from other dis-
tributions we may be interested in; it also says that if we plug a continuous r.v. into
its own CDF, the resulting r.v. has a Unif(0, 1) distribution.
A N (µ, σ 2 ) r.v. has a symmetric bell-shaped PDF centered at µ, with σ controlling
how spread out the curve is. The mean is µ and standard deviation is σ. The 68-95-
99.7% rule gives important benchmarks for the probability of a Normal r.v. falling
within 1, 2, and 3 standard deviations of its mean.
An Expo(λ) r.v. represents the waiting time for the first success in continuous time,
analogous to how a Geometric r.v. represents the number of failures before the first
success in discrete time; the parameter λ can be interpreted as the rate at which
successes arrive. The Exponential distribution has the memoryless property, which
says that conditional on our having waited a certain amount of time without success,
the distribution of the remaining wait time is exactly the same as if we hadn’t waited
at all. In fact, the Exponential is the only positive continuous distribution with the
memoryless property.
A Poisson process is a sequence of arrivals in continuous time such that the number
of arrivals in an interval is Poisson (with mean proportional to the length of the in-
terval) and disjoint intervals have independent numbers of arrivals. The interarrival
times in a Poisson process of rate λ are i.i.d. Expo(λ) r.v.s.
A useful symmetry property of i.i.d. r.v.s X1 , X2 , . . . , Xn is that all orderings are
equally likely. For example, P (X1 < X2 < X3 ) = P (X3 < X2 < X1 ). If the Xj
are continuous in addition to being i.i.d., then we can also conclude, e.g., that
P (X1 < X2 < X3 ) = 1/6, whereas in the discrete case we also have to account for
the possibility of ties.
A new strategy that we learned for continuous distributions is location-scale trans-
formation, which says that if shifting and scaling will not take us outside the family
of distributions we’re studying, then we can start with the simplest member of the
family, find the answer for the simple case, then use shifting and scaling to arrive
at the general case. For the three main distributions of this chapter, this approach
works as follows.
• Uniform: If U ∼ Unif(0, 1), then Ũ = a + (b − a)U ∼ Unif(a, b).
• Normal: If Z ∼ N (0, 1), then X = µ + σZ ∼ N (µ, σ 2 ).
• Exponential: If X ∼ Expo(1), then Y = X/λ ∼ Expo(λ). We do not consider
  shifts here since a nonzero shift would prevent the support from being (0, ∞).
We can now add the Exponential and Geometric distributions to our diagram of con-
nections between distributions: the Exponential is a continuous limit of the Geomet-
ric, and the Poisson and Exponential are connected by the Poisson process.


252                                                                                                              Introduction to Probability


                                                                                                                           HGeom


                                                                                                    Limit

                                                                                                            Conditioning



                                                                                           Bin
                                                                                           (Bern)

                                                               Limit


                                                                            Conditioning



                                                   Pois



                                 Poisson process




                                               Expo                                        Geom
                                                                   Limit




And in our map of the four fundamental objects in probability, we add the PDF as
another blueprint for continuous random variables.
       1.0
       0.8




                                                                                                    What can
       0.6
F(x)

       0.4




                                                                                                    happen?
       0.2
       0.0




             -6    -4   -2   0     2   4   6

                             x




                   distributions                               random variables                         events                       numbers

                                                    generate                                            X≤x                P       P(X ≤ x) = F(x)
                      CDF F                                                        X
                                                                                                        X=x                           P(X = x)
                   PMF (discrete)
                  PDF (continuous)
                                                                       function of r.v.




                       story
                  name, parameters
                                                                                                                                E(X), Var(X), SD(X)




                                                                   X, X2, X3, …                     LOTUS                      E(X), E(X2), E(X3), …
                                                                       g(X)                                                           E(g(X))




FIGURE 5.14
Four fundamental objects in probability: distributions, random variables, events,
and numbers. For a continuous r.v. X, we have P (X = x) = 0, so we use the PDF
as a blueprint in place of the PMF.


Continuous random variables                                                       253




5.9   R

In this section we will introduce continuous distributions in R, learn how to make
basic plots, demonstrate the universality of the Uniform by simulation, and simulate
arrival times in a Poisson process.


Uniform, Normal, and Exponential distributions

For continuous distributions, the function that starts with d is the PDF instead of
the PMF. Thus, we have the following functions:
• dunif, punif, runif. To evaluate the Unif(a, b) PDF at x, we use dunif(x,a,b).
  For the CDF, we use punif(x,a,b). To generate n realizations from the Unif(a, b)
  distribution, we use runif(n,a,b).
• dnorm, pnorm, rnorm. To evaluate the N (µ, σ 2 ) PDF at x, we use
  dnorm(x,mu,sigma), where mu is the mean µ and sigma is the standard devi-
  ation (not variance) σ. For the CDF, we use pnorm(x,mu,sigma). To generate n
  realizations from the N (µ, σ 2 ) distribution, we use rnorm(n,mu,sigma).
  h 5.9.1 (Normal parameters in R). Note that we have to input the standard
  deviation, not the variance! For example, to get the N (10, 3) CDF at 12, we use
  pnorm(12,10,sqrt(3)). Ignoring this is a common, disastrous coding error.
• dexp, pexp, rexp. To evaluate the Expo(λ) PDF at x, we use dexp(x,lambda). For
  the CDF, we use pexp(x,lambda). To generate n realizations from the Expo(λ)
  distribution, we use rexp(n,lambda).
Due to the importance of location-scale transformations for continuous distribu-
tions, R has default parameter settings for each of these three families. The default
for the Uniform is Unif(0, 1), the default for the Normal is N (0, 1), and the default
for the Exponential is Expo(1). For example, dunif(0.5), with no additional in-
puts, evaluates the Unif(0, 1) PDF at 0.5, and rnorm(10), with no additional inputs,
generates 10 realizations from the N (0, 1) distribution. This means there are two
ways to generate a N (µ, σ 2 ) random variable in R. After choosing our values of µ
and σ, such as
mu <- 1
sigma <- 2
we can do either of the following:
rnorm(1,mu,sigma)
mu + sigma*rnorm(1)
Either way, we end up generating a draw from the N (µ, σ 2 ) distribution.


254                                                         Introduction to Probability

Plots in R

A simple way to plot a function in R is with the curve command. For example,

curve(dnorm, from=-3, to=3, n=1000)

creates a plot of the standard Normal PDF from −3 to 3. What is actually happening
is that R evaluates the function at a finite number of closely spaced points and
connects the points with very short lines to create the illusion of a curve. The input
n=1000 tells R to evaluate at 1000 points so that the curve looks very smooth; if we
were to choose n=20, the piecewise linearity would become very apparent.

Another command that creates plots is called, fittingly, plot. This command has
many, many possible inputs to customize what the plot looks like; for the sake of
demonstration, we’ll plot the standard Normal PDF once again, using plot instead
of curve.

The most important inputs to plot are a vector of x values and a vector of y values
to plot. A useful command for this purpose is seq. As introduced in Chapter 1,
seq(a,b,d) creates the vector of values ranging from a to b, with successive entries
spaced apart by d.

x <- seq(-3,3,0.01)
y <- dnorm(x)

So x consists of all numbers from −3 to 3, spaced 0.01 apart, and y contains
the values of the Normal PDF at each of the points in x. Now we simply plot
the two with plot(x,y). The default is a scatterplot. For a line plot, we use
plot(x,y,type="l"). We can also set the axis labels and plot title with xlab,
ylab, and main.

plot(x,y,type="l",xlab="x",ylab="dnorm(x)",main="N(0,1) PDF")

The axis limits can be set manually with xlim and ylim. If, for example, you wanted
the vertical axis to range from 0 to 1, you would add ylim=c(0,1) inside the plot
command.

Finally, to change the color of the plot, add col="orange" or col="green", or
whatever your favorite color is!


Universality with Logistic

We proved in Example 5.3.4 that for U ∼ Unif(0, 1), the r.v. log(U/(1 − U )) follows
a Logistic distribution. In R, we can simply generate a large number of Unif(0, 1)
realizations and transform them.

u <- runif(10^4)
x <- log(u/(1-u))


Continuous random variables                                                                      255

Now x contains 104 realizations from the distribution of log(U/(1−U )). We can visu-
alize them with a histogram, using the command hist(x). The histogram resembles
a Logistic PDF, which is reassuring. To control how fine-grained the histogram is,
we can set the number of breaks in the histogram: hist(x,breaks=100) produces
a finer histogram, while hist(x,breaks=10) produces a coarser histogram.


Poisson process simulation

To simulate n arrivals in a Poisson process with rate λ, we first generate the inter-
arrival times as i.i.d. Exponentials and store them in a vector:
n <- 50
lambda <- 10
x <- rexp(n,lambda)
Then we convert the interarrival times into arrival times using the cumsum function,
which stands for “cumulative sum”.
t <- cumsum(x)
The vector t now contains all the simulated arrival times.




5.10     Exercises

Exercises marked with s have detailed solutions at http://stat110.net.

        PDFs and CDFs
   1.   The Rayleigh distribution from Example 5.1.7 has PDF
                                                     2
                                        f (x) = xe−x /2 ,   x > 0.

        Let X have the Rayleigh distribution.

        (a) Find P (1 < X < 3).

        (b) Find the first quartile, median, and third quartile of X; these are defined to be the
        values q1 , q2 , q3 (respectively) such that P (X ≤ qj ) = j/4 for j = 1, 2, 3.
   2.   (a) Make up a PDF f , with an application for which that PDF would be plausible,
        where f (x) > 1 for all x in a certain interval.

        (b) Show that if a PDF f has f (x) > 1 for all x in a certain interval, then that interval
        must have length less than 1.
   3.   Let F be the CDF of a continuous r.v., and f = F 0 be the PDF.
        (a) Show that g defined by g(x) = 2F (x)f (x) is also a valid PDF.

        (b) Show that h defined by h(x) = 12 f (−x) + 12 f (x) is also a valid PDF.


256                                                                     Introduction to Probability

  4.   Let X be a continuous r.v. with CDF F and PDF f .

       (a) Find the conditional CDF of X given X > c, for c a constant with P (X > c) 6= 0.
       That is, find P (X ≤ x|X > a) for all c, in terms of F .

       (b) Find the conditional PDF of X given X > c (this is the derivative of the conditional
       CDF).

       (c) Check that the conditional PDF from (b) is a valid PDF, by showing directly that
       it is nonnegative and integrates to 1.
  5.   A circle with a random radius R ∼ Unif(0, 1) is generated. Let A be its area.

       (a) Find the mean and variance of A, without first finding the CDF or PDF of A.

       (b) Find the CDF and PDF of A.
  6.   The 68-95-99.7% rule gives approximate probabilities of a Normal r.v. being within
       1, 2, and 3 standard deviations of its mean. Derive analogous rules for the following
       distributions.

       (a) Unif(0, 1).

       (b) Expo(1).

       (c) Expo(1/2). Discuss whether there is one such rule that applies to all Exponential
       distributions, just as the 68-95-99.7% rule applies to all Normal distributions, not just
       to the standard Normal.
  7.   Let
                                         2       √ 
                                F (x) =    sin−1   x , for 0 < x < 1,
                                        π
       F (x) = 0 for x ≤ 0, and F (x) = 1 for x ≥ 1.

       (a) Check that F is a valid CDF, and find the corresponding PDF f . This distribution
       is called the Arcsine distribution, though it also goes by the name Beta(1/2, 1/2) (we
       will explore the Beta in depth in Chapter 8).

       (b) Explain how it is possible for f to be a valid PDF even though f (x) goes to ∞ as
       x approaches 0 from the right and as x approaches 1 from the left.
  8.   The Beta distribution with parameters a = 3, b = 2 has PDF

                                 f (x) = 12x2 (1 − x), for 0 < x < 1.

       (We will discuss the Beta in detail in Chapter 8.) Let X have this distribution.

       (a) Find the CDF of X.

       (b) Find P (0 < X < 1/2).

       (c) Find the mean and variance of X (without quoting results about the Beta distribu-
       tion).
  9.   The Cauchy distribution has PDF
                                                        1
                                          f (x) =              ,
                                                    π(1 + x2 )

       for all real x. (We will introduce the Cauchy from another point of view in Chapter 7.)
       Find the CDF of a random variable with the Cauchy PDF.
                                                                                       1
       Hint: Recall that the derivative of the inverse tangent function arctan(x) is 1+x 2.


Continuous random variables                                                                          257

        Uniform and universality of the Uniform
  10.   Let U ∼ Unif(0, 8).

        (a) Find P (U ∈ (0, 2) ∪ (3, 7)) without using calculus.

        (b) Find the conditional distribution of U given U ∈ (3, 7).
  11.   s Let U be a Uniform r.v. on the interval (−1, 1) (be careful about minus signs).

        (a) Compute E(U ), Var(U ), and E(U 4 ).

        (b) Find the CDF and PDF of U 2 . Is the distribution of U 2 Uniform on (0, 1)?
  12.    s A stick is broken into two pieces, at a uniformly random breakpoint. Find the CDF
        and average of the length of the longer piece.
  13.   A stick of length 1 is broken at a uniformly random point, yielding two pieces. Let X
        and Y be the lengths of the shorter and longer pieces, respectively, and let R = X/Y
        be the ratio of the lengths X and Y .

        (a) Find the CDF and PDF of R.

        (b) Find the expected value of R (if it exists).

        (c) Find the expected value of 1/R (if it exists).
  14.   Let U1 , . . . , Un be i.i.d. Unif(0, 1), and X = max(U1 , . . . , Un ). What is the PDF of X?
        What is EX?
        Hint: Find the CDF of X first, by translating the event X ≤ x into an event involving
        U1 , . . . , Un .
  15.   Let U ∼ Unif(0, 1). Using U , construct X ∼ Expo(λ).
  16.   s Let U ∼ Unif(0, 1), and                              
                                                           U
                                            X = log                 .
                                                          1−U
        Then X has the Logistic distribution, as defined in Example 5.1.6.
        (a) Write down (but do not compute) an integral giving E(X 2 ).

        (b) Find E(X) without using calculus.
        Hint: A useful symmetry property here is that 1 − U has the same distribution as U .
                                                                                                 3
  17.   Let U ∼ Unif(0, 1). As a function of U , create an r.v. X with CDF F (x) = 1 − e−x for
        x > 0.
  18.   The Pareto distribution with parameter a > 0 has PDF f (x) = a/xa+1 for x ≥ 1 (and
        0 otherwise). This distribution is often used in statistical modeling.

        (a) Find the CDF of a Pareto r.v. with parameter a; check that it is a valid CDF.

        (b) Suppose that for a simulation you want to run, you need to generate i.i.d. Pareto(a)
        r.v.s. You have a computer that knows how to generate i.i.d. Unif(0, 1) r.v.s but does
        not know how to generate Pareto r.v.s. Show how to do this.


        Normal
  19.   Let Z ∼ N (0, 1). Create an r.v. Y ∼ N (1, 4), as a simple-looking function of Z. Make
        sure to check that your Y has the correct mean and variance.


258                                                                      Introduction to Probability

  20.   Engineers sometimes work with the “error function”
                                                  Z z
                                               2         2
                                     erf(z) = √       e−x dx,
                                                π 0
        instead of the standard Normal CDF Φ.

        (a) Show that the following conversion between Φ and erf holds for all z:
                                                           
                                              1    1     z
                                      Φ(z) = + erf √          .
                                              2    2      2

        (b) Show that erf is an odd function, i.e., erf(−z) = −erf(z).
  21.   (a) Find the points of inflection of the N (0, 1) PDF ϕ, i.e., the points where the curve
        switches from convex (second derivative positive) to concave (second derivative negative)
        or vice versa.

        (b) Use the result of (a) and a location-scale transformation to find the points of inflec-
        tion of the N (µ, σ 2 ) PDF.
  22.   The distance between two points needs to be measured, in meters. The true distance
        between the points is 10 meters, but due to measurement error we can’t measure the
        distance exactly. Instead, we will observe a value of 10+, where the error  is distributed
        N (0, 0.04). Find the probability that the observed distance is within 0.4 meters of the
        true distance (10 meters). Give both an exact answer in terms of Φ and an approximate
        numerical answer.
  23.   Alice is trying to transmit to Bob the answer to a yes-no question, using a noisy channel.
        She encodes “yes” as 1 and “no” as 0, and sends the appropriate value. However, the
        channel adds noise; specifically, Bob receives what Alice sends plus a N (0, σ 2 ) noise
        term (the noise is independent of what Alice sends). If Bob receives a value greater than
        1/2 he interprets it as “yes”; otherwise, he interprets it as “no”.

        (a) Find the probability that Bob understands Alice correctly.

        (b) What happens to the result from (a) if σ is very small? What about if σ is very
        large? Explain intuitively why the results in these extreme cases make sense.
  24.   A woman is pregnant, with a due date of January 10, 2020. Of course, the actual date on
        which she will give birth is not necessarily the due date. On a timeline, define time 0 to
        be the instant when January 10, 2020 begins. Suppose that the time T when the woman
        gives birth has a Normal distribution, centered at 0 and with standard deviation 8 days.
        What is the probability that she gives birth on her due date? (Your answer should be
        in terms of Φ, and simplified.)
  25.   We will show in the next chapter that if X1 and X2 are independent with Xi ∼
        N (µi , σi2 ), then X1 + X2 ∼ N (µ1 + µ2 , σ12 + σ22 ). Use this result to find P (X < Y )
        for X ∼ N (a, b), Y ∼ N (c, d) with X and Y independent.
        Hint: Write P (X < Y ) = P (X − Y < 0) and then standardize X − Y . Check that your
        answer makes sense in the special case where X and Y are i.i.d.
  26.   Walter and Carl both often need to travel from Location A to Location B. Walter walks,
        and his travel time is Normal with mean w minutes and standard deviation σ minutes
        (travel time can’t be negative without using a tachyon beam, but assume that w is so
        much larger than σ that the chance of a negative travel time is negligible).
        Carl drives his car, and his travel time is Normal with mean c minutes and standard
        deviation 2σ minutes (the standard deviation is larger for Carl due to variability in traffic
        conditions). Walter’s travel time is independent of Carl’s. On a certain day, Walter and
        Carl leave from Location A to Location B at the same time.


Continuous random variables                                                                        259

        (a) Find the probability that Carl arrives first (in terms of Φ and the parameters). For
        this you can use the important fact, proven in the next chapter, that if X1 and X2 are
        independent with Xi ∼ N (µi , σi2 ), then X1 + X2 ∼ N (µ1 + µ2 , σ12 + σ22 ).

        (b) Give a fully simplified criterion (not in terms of Φ), such that Carl has more than
        a 50% chance of arriving first if and only if the criterion is satisfied.

        (c) Walter and Carl want to make it to a meeting at Location B that is scheduled to
        begin w + 10 minutes after they depart from Location A. Give a fully simplified criterion
        (not in terms of Φ) such that Carl is more likely than Walter to make it on time for the
        meeting if and only if the criterion is satisfied.
  27.   Let Z ∼ N (0, 1). We know from the 68-95-99.7% rule that there is a 68% chance of Z
        being in the interval (−1, 1). Give a visual explanation of whether or not there is an
        interval (a, b) that is shorter than the interval (−1, 1), yet which has at least as large a
        chance as (−1, 1) of containing Z.
  28.   Let Y ∼ N (µ, σ 2 ). Use the fact that P (|Y − µ| < 1.96σ) ≈ 0.95 to construct a random
        interval (a(Y ), b(Y )) (that is, an interval whose endpoints are r.v.s), such that the
        probability that µ is in the interval is approximately 0.95. This interval is called a
        confidence interval for µ; such intervals are often desired in statistics when estimating
        unknown parameters based on data.
  29.   Let Y = |X|, with X ∼ N (µ, σ 2 ). This is a well-defined continuous r.v., even though
        the absolute value function is not differentiable at 0 (due to the sharp corner).

        (a) Find the CDF of Y in terms of Φ. Be sure to specify the CDF everywhere.

        (b) Find the PDF of Y .

        (c) Is the PDF of Y continuous at 0? If not, is this a problem as far as using the PDF
        to find probabilities?
  30.    s Let Z ∼ N (0, 1) and let S be a random sign independent of Z, i.e., S is 1 with
        probability 1/2 and −1 with probability 1/2. Show that SZ ∼ N (0, 1).
  31.   s Let Z ∼ N (0, 1). Find E (Φ(Z)) without using LOTUS, where Φ is the CDF of Z.
  32.    s Let Z ∼ N (0, 1) and X = Z 2 . Then the distribution of X is called Chi-Square with
        1 degree of freedom. This distribution appears in many statistical methods.
        (a) Find a good numerical approximation to P (1 ≤ X ≤ 4) using facts about the Normal
        distribution, without querying a calculator/computer/table about values of the Normal
        CDF.
        (b) Let Φ and ϕ be the CDF and PDF of Z, respectively. Show that for any t > 0,
        I(Z > t) ≤ (Z/t)I(Z > t). Using this and LOTUS, derive Mills’ inequality, which is the
        following lower bound on Φ:
                                         Φ(t) ≥ 1 − ϕ(t)/t.

  33.   Let Z ∼ N (0, 1), with CDF Φ. We will show in Chapter 8 that the PDF of Z 2 is the
        function g given by
                                                 1
                                      g(w) = √      e−w/2
                                                2πw
        for w > 0, and g(w) = 0 for w ≤ 0.
        (a) Find expressions for E(Z 4 ) as integrals in two different ways, one based on the PDF
        of Z and the other based on the PDF of Z 2 .
        (b) Find E(Z 2 + Z + Φ(Z)).


260                                                                     Introduction to Probability

  34.    s Let Z ∼ N (0, 1). A measuring device is used to observe Z, but the device can only
        handle positive values, and gives a reading of 0 if Z ≤ 0; this is an example of censored
        data. So assume that X = ZIZ>0 is observed rather than Z, where IZ>0 is the indicator
        of Z > 0. Find E(X) and Var(X).
  35.   Let Z ∼ N (0, 1), and c be a nonnegative constant. Find E(max(Z − c, 0)), in terms of
        the standard Normal CDF Φ and PDF ϕ. (This kind of calculation often comes up in
        quantitative finance.)
        Hint: Use LOTUS, and handle the max symbol by adjusting the limits √ of integration
        appropriately. As a check, make sure that your answer reduces to 1/ 2π
                                                                             p when c = 0;
        this must be the case since we showed in Example 5.4.7 that E|Z| = 2/π, and we
        have |Z| = max(Z, 0) + max(−Z, 0) so by symmetry

                       E|Z| = E(max(Z, 0)) + E(max(−Z, 0)) = 2E(max(Z, 0)).


        Exponential
  36.    s A post office has 2 clerks. Alice enters the post office while 2 other customers, Bob
        and Claire, are being served by the 2 clerks. She is next in line. Assume that the time
        a clerk spends serving a customer has an Expo(λ) distribution.

        (a) What is the probability that Alice is the last of the 3 customers to be done being
        served?
        Hint: No integrals are needed.

        (b) What is the expected total time that Alice needs to spend at the post office?
  37.   Let T be the time until a radioactive particle decays, and suppose (as is often done in
        physics and chemistry) that T ∼ Expo(λ).

        (a) The half-life of the particle is the time at which there is a 50% chance that the
        particle has decayed (in statistical terminology, this is the median of the distribution of
        T ). Find the half-life of the particle.

        (b) Show that for  a small, positive constant, the probability that the particle decays
        in the time interval [t, t + ], given that it has survived until time t, does not depend on
        t and is approximately proportional to .
        Hint: ex ≈ 1 + x if x ≈ 0.

        (c) Now consider n radioactive particles, with i.i.d. times until decay T1 , . . . , Tn ∼
        Expo(λ). Let L be the first time at which one of the particles decays. Find the CDF of
        L. Also, find E(L) and Var(L).

        (d) Continuing (c), find the mean and variance of M = max(T1 , . . . , Tn ), the last time
        at which one of the particles decays, without using calculus.
        Hint: Draw a timeline, apply (c), and remember the memoryless property.
  38.    s Fred wants to sell his car, after moving back to Blissville (where he is happy with
        the bus system). He decides to sell it to the first person to offer at least $18,000 for
        it. Assume that the offers are independent Exponential random variables with mean
        $12,000, and that Fred is able to keep getting offers until he obtains one that meets his
        criterion.

        (a) Find the expected number of offers Fred will have.

        (b) Find the expected amount of money that Fred will get for the car.


Continuous random variables                                                                         261

  39.   As in the previous problem, Fred wants to sell his car, and the offers for his car are
        i.i.d. Exponential r.v.s with mean $12,000. Assume now though that he will wait until
        he has 3 offers (no matter how large or small they are), and then accept the largest of
        the 3 offers. Find the expected amount of money that Fred will get for his car.
  40.   (a) Fred visits Blotchville again. He finds that the city has installed an electronic display
        at the bus stop, showing the time when the previous bus arrived. The times between
        arrivals of buses are still independent Exponentials with mean 10 minutes. Fred waits
        for the next bus, and then records the time between that bus and the previous bus. On
        average, what length of time between buses does he see?

        (b) Fred then visits Blunderville, where the times between buses are also 10 minutes on
        average, and independent. Yet to his dismay, he finds that on average he has to wait more
        than 1 hour for the next bus when he arrives at the bus stop! How is it possible that the
        average Fred-to-bus time is greater than the average bus-to-bus time even though Fred
        arrives at some time between two bus arrivals? Explain this intuitively, and construct a
        specific discrete distribution for the times between buses showing that this is possible.
  41.   Fred and Gretchen are waiting at a bus stop in Blotchville. Two bus routes, Route 1
        and Route 2, have buses that stop at this bus stop. For Route i, buses arrive according
        to a Poisson process with rate λi buses/minute. The Route 1 process is independent of
        the Route 2 process. Fred is waiting for a Route 1 bus, and Gretchen is waiting for a
        Route 2 bus.

        (a) Given that Fred has already waited for 20 minutes, on average how much longer will
        he have to wait for his bus?

        (b) Find the probability that at least n Route 1 buses will pass by before the first Route
        2 bus arrives. The following result from Chapter 7 may be useful here: for independent
        random variables X1 ∼ Expo(λ1 ), X2 ∼ Expo(λ2 ), we have P (X1 < X2 ) = λ1 /(λ1 +λ2 ).

        (c) For this part only, assume that λ1 = λ2 = λ. Find the expected time it will take
        until both Fred and Gretchen have caught their buses.
  42.    s Joe is waiting in continuous time for a book called The Winds of Winter to be
        released. Suppose that the waiting time T until news of the book’s release is posted,
        measured in years relative to some starting point, has an Exponential distribution with
        λ = 1/5.
        Joe is not so obsessive as to check multiple times a day; instead, he checks the website
        once at the end of each day. Therefore, he observes the day on which the news was
        posted, rather than the exact time T . Let X be this measurement, where X = 0 means
        that the news was posted within the first day (after the starting point), X = 1 means
        it was posted on the second day, etc. (assume that there are 365 days in a year). Find
        the PMF of X. Is this a named distribution that we have studied?
  43.   The Exponential is the analog of the Geometric in continuous time. This problem ex-
        plores the connection between Exponential and Geometric in more detail, asking what
        happens to a Geometric in a limit where the Bernoulli trials are performed faster and
        faster but with smaller and smaller success probabilities.
        Suppose that Bernoulli trials are being performed in continuous time; rather than only
        thinking about first trial, second trial, etc., imagine that the trials take place at points
        on a timeline. Assume that the trials are at regularly spaced times 0, ∆t, 2∆t, . . . , where
        ∆t is a small positive number. Let the probability of success of each trial be λ∆t, where
        λ is a positive constant. Let G be the number of failures before the first success (in
        discrete time), and T be the time of the first success (in continuous time).

        (a) Find a simple equation relating G to T .
        Hint: Draw a timeline and try out a simple example.


262                                                                     Introduction to Probability

        (b) Find the CDF of T .
        Hint: First find P (T > t).

        (c) Show that as ∆t → 0, the CDF of T converges to the Expo(λ) CDF, evaluating all
        the CDFs at a fixed t ≥ 0.
        Hint: Use the compound interest limit (see Section A.2.5 of the math appendix).
  44.   The Laplace distribution has PDF
                                                        1 −|x|
                                              f (x) =     e
                                                        2
        for all real x. The Laplace distribution is also called a symmetrized Exponential distri-
        bution. Explain this in the following two ways.

        (a) Plot the PDFs and explain how they relate.

        (b) Let X ∼ Expo(1) and S be a random sign (1 or −1, with equal probabilities), with
        S and X independent. Find the PDF of SX (by first finding the CDF), and compare
        the PDF of SX and the Laplace PDF.
  45.   Emails arrive in an inbox according to a Poisson process with rate 20 emails per hour.
        Let T be the time at which the 3rd email arrives, measured in hours after a certain fixed
        starting time. Find P (T > 0.1) without using calculus.
        Hint: Apply the count-time duality.
  46.   Let T be the lifetime of a certain person (how long that person lives), and let T have
        CDF F and PDF f . The hazard function of T is defined by
                                                       f (t)
                                            h(t) =             .
                                                     1 − F (t)

        (a) Explain why h is called the hazard function and in particular, why h(t) is the
        probability density for death at time t, given that the person survived up until then.

        (b) Show that an Exponential r.v. has constant hazard function and conversely, if the
        hazard function of T is a constant then T must be Expo(λ) for some λ.
  47.   Let T be the lifetime of a person (or animal or gadget), with CDF F and PDF f . Let
        h be the hazard function, defined as in the previous problem. If we know F then we
        can calculate f , and then in turn we can calculate h. In this problem, we consider the
        reverse problem: how to recover F and f from knowing h.

        (a) Show that the CDF and hazard function are related by
                                                 Z t         
                                 F (t) = 1 − exp −     h(s)ds ,
                                                           0

        for all t > 0.
        Hint: Let G(t) = 1−F (t) be the survival function, and consider the derivative of log G(t).

        (b) Show that the PDF and hazard function are related by
                                                  Z t        
                                 f (t) = h(t) exp −    h(s)ds ,
                                                           0

        for all t > 0.
        Hint: Apply the result of (a).


Continuous random variables                                                                        263

  48.    s Find E(X 3 ) for X ∼ Expo(λ), using LOTUS and the fact that E(X) = 1/λ and
        Var(X) = 1/λ2 , and integration by parts at most once. In the next chapter, we’ll learn
        how to find E(X n ) for all n.
  49.   s The Gumbel distribution is the distribution of − log X with X ∼ Expo(1).

        (a) Find the CDF of the Gumbel distribution.

        (b) Let X1 , X2 , . . . be i.i.d. Expo(1) and let Mn = max(X1 , . . . , Xn ). Show that Mn −
        log n converges in distribution to the Gumbel distribution, i.e., as n → ∞ the CDF of
        Mn − log n converges to the Gumbel CDF.


        Mixed practice
  50.   Explain intuitively why P (X < Y ) = P (Y < X) if X and Y are i.i.d., but equality may
        not hold if X and Y are not independent or not identically distributed.
  51.   Let X be an r.v. (discrete or continuous) such that 0 ≤ X ≤ 1 always holds. Let
        µ = E(X).

        (a) Show that
                                                               1
                                          Var(X) ≤ µ − µ2 ≤      .
                                                               4
        Hint: With probability 1, we have X 2 ≤ X.

        (b) Show that there is only one possible distribution for X for which Var(X) = 1/4.
        What is the name of this distribution?
  52.   The Rayleigh distribution from Example 5.1.7 has PDF
                                                     2
                                        f (x) = xe−x /2 ,   x > 0.
        Let X have the Rayleigh distribution.

        (a) Find E(X) without using much calculus, by interpreting the integral in terms of
        known results about the Normal distribution.

        (b) Find E(X 2 ).
        Hint: A nice approach is to use LOTUS and the substitution u = x2 /2, and then interpret
        the resulting integral in terms of known results about the Exponential distribution.
  53.    s Consider an experiment where we observe the value of a random variable X, and
        estimate the value of an unknown constant θ using some random variable T = g(X) that
        is a function of X. The r.v. T is called an estimator. Think of X as the data observed
        in the experiment, and θ as an unknown parameter related to the distribution of X.

        For example, consider the experiment of flipping a coin n times, where the coin has an
        unknown probability θ of Heads. After the experiment is performed, we have observed
        the value of X ∼ Bin(n, θ). The most natural estimator for θ is then X/n.

        The bias of an estimator T for θ is defined as b(T ) = E(T ) − θ. The mean squared error
        is the average squared error when using T (X) to estimate θ:
                                          MSE(T ) = E(T − θ)2 .
        Show that
                                      MSE(T ) = Var(T ) + (b(T ))2 .
        This implies that for fixed MSE, lower bias can only be attained at the cost of higher
        variance and vice versa; this is a form of the bias-variance tradeoff, a phenomenon which
        arises throughout statistics.


264                                                                        Introduction to Probability

  54.   s (a) Suppose that we have a list of the populations of every country in the world.

        Guess, without looking at data yet, what percentage of the populations have the digit
        1 as their first digit (e.g., a country with a population of 1,234,567 has first digit 1 and
        a country with population 89,012,345 does not).

        (b) After having done (a), look through a list of populations and count how many start
        with a 1. What percentage of countries is this? Benford’s law states that in a very large
        variety of real-life data sets, the first digit approximately follows a particular distribution
        with about a 30% chance of a 1, an 18% chance of a 2, and in general
                                                         
                                                    j+1
                             P (D = j) = log10              , for j ∈ {1, 2, 3, . . . , 9},
                                                      j

        where D is the first digit of a randomly chosen element. (Exercise 6 from Chapter 3
        asks for a proof that this is a valid PMF.) How closely does the percentage found in the
        data agree with that predicted by Benford’s law?

        (c) Suppose that we write the random value in some problem (e.g., the population of
        a random country) in scientific notation as X × 10N , where N is a nonnegative integer
        and 1 ≤ X < 10. Assume that X is a continuous r.v. with PDF

                                        f (x) = c/x, for 1 ≤ x ≤ 10,

        and 0 otherwise, with c a constant. What is the value of c (be careful with the bases
        of logs)? Intuitively, we might hope that the distribution of X does not depend on the
        choice of units in which X is measured. To see whether this holds, let Y = aX with
        a > 0. What is the PDF of Y (specifying where it is nonzero)?

        (d) Show that if we have a random number X × 10N (written in scientific notation) and
        X has the PDF f from (c), then the first digit (which is also the first digit of X) has
        Benford’s law as its PMF.
        Hint: What does D = j correspond to in terms of the values of X?
  55.    s (a) Let X1 , X2 , . . . be independent N (0, 4) r.v.s., and let J be the smallest value of j
        such that Xj > 4 (i.e., the index of the first Xj exceeding 4). In terms of Φ, find E(J).

        (b) Let f and g be PDFs with f (x) > 0 and g(x) > 0 for all x. Let X be a random
        variable with PDF f . Find the expected value of the ratio

                                                      g(X)
                                                 R=         .
                                                      f (X)

        Such ratios come up very often in statistics, when working with a quantity known
        as a likelihood ratio and when using a computational technique known as importance
        sampling.

        (c) Define
                                                           −x
                                               F (x) = e−e      .
        This is a CDF and is a continuous, strictly increasing function. Let X have CDF F , and
        define W = F (X). What are the mean and variance of W ?
  56.   Let X, Y, Z ∼ N (0, 1) be i.i.d.

        (a) Find an expression for E Z 2 Φ(Z) as an integral.
                                             

        (b) Find P (Φ(Z) < 2/3).

        (c) Find P (X < Y < Z).


Continuous random variables                                                                       265

  57.   Let X, Y, Z ∼ N (0, 1) be i.i.d., and W = (Φ(Z))2 .
        (a) Find the CDF and PDF of W .
        (b) Let fW be the PDF of W and ϕ be the PDF of Z. Find unsimplified expressions for
        E(W 3 ) as integrals in two different ways, one based on fW and one based on ϕ.
        (c) Find P (X + 2Y < 2Z + 3), in terms of Φ.
        Hint: Move all of the r.v.s to one side of the inequality.
  58.   Let Z ∼ N (0, 1) and Y = max(Z, 0). So Y is Z if Z > 0, and Y is 0 if Z ≤ 0.
        (a) Find an expression for E(Y ) as an integral (which can be unsimplified).
        (b) Let Y1 , Y2 , . . . be independent r.v.s, each with the same distribution as Y . Let
        N = min{n : Yn = 0}, i.e., N is the smallest value such that YN = 0. Find E(N ).
        (c) Find the CDF of Y in terms of Φ. (Be sure to specify it for all real numbers.)
  59.   The unit circle {(x, y) : x2 + y 2 = 1} is divided into three arcs by choosing three random
        points A, B, C on the circle (independently and uniformly), forming arcs between A and
        B, between A and C, and between B and C. Let L be the length of the arc containing
        the point (1, 0). What is E(L)? Study this by working through the following steps.
        (a) Explain what is wrong with the following argument: “The total length of the arcs is
        2π, the circumference of the circle. So by symmetry and linearity, each arc has length
        2π/3 on average. Referring to the arc containing (1, 0) is just a way to specify one of
        the arcs (it wouldn’t matter if (1, 0) were replaced by (0, −1) or any other specific point
        on the circle in the statement of the problem). So the expected value of L is 2π/3.”
        (b) Let the arc containing (1, 0) be divided into two pieces: the piece extending counter-
        clockwise from (1, 0) and the piece extending clockwise from (1, 0). Write L = L1 + L2 ,
        where L1 and L2 are the lengths of the counterclockwise and clockwise pieces, respec-
        tively. Find the CDF, PDF, and expected value of L1 .
        (c) Use (b) to find E(L).
  60.    s As in Example 5.7.4, athletes compete one at a time at the high jump. Let Xj be
        how high the jth jumper jumped, with X1 , X2 , . . . i.i.d. with a continuous distribution.
        We say that the jth jumper is “best in recent memory” if they jump higher than the
        previous 2 jumpers (for j ≥ 3; the first 2 jumpers don’t qualify).
        (a) Find the expected number of best in recent memory jumpers among the 3rd through
        nth jumpers.
        (b) Let Aj be the event that the jth jumper is the best in recent memory. Find
        P (A3 ), P (A4 ), and P (A3 ∩ A4 ). Are A3 and A4 independent?
  61.   Tyrion, Cersei, and n other guests arrive at a party at i.i.d. times drawn from a con-
        tinuous distribution with support [0, 1], and stay until the end (time 0 is the party’s
        start time and time 1 is the end time). The party will be boring at times when neither
        Tyrion nor Cersei is there, fun when exactly one of them is there, and awkward when
        both Tyrion and Cersei are there.
        (a) On average, how many of the n other guests will arrive at times when the party is
        fun?
        (b) Jaime and Robert are two of the other guests. By computing both sides in the
        definition of independence, determine whether the event “Jaime arrives at a fun time”
        is independent of the event “Robert arrives at a fun time”.
        (c) Give a clear intuitive explanation of whether the two events from (b) are independent,
        and whether they are conditionally independent given the arrival times of everyone else,
        i.e., everyone except Jaime and Robert.


266                                                                      Introduction to Probability

  62.   Let X1 , X2 , . . . be the annual rainfalls in Boston (measured in inches) in the years 2101,
        2102, . . . , respectively. Assume that annual rainfalls are i.i.d. draws from a continuous
        distribution. A rainfall value is a record high if it is greater than those in all previous
        years (starting with 2101), and a record low if it is lower than those in all previous years.

        (a) In the 22nd century (the years 2101 through 2200, inclusive), find the expected
        number of years that have either a record low or a record high rainfall.

        (b) On average, in how many years in the 22nd century is there a record low followed
        in the next year by a record high? (Only the record low is required to be in the 22nd
        century, not the record high.)

        (c) By definition, the year 2101 is a record high (and record low). Let N be the number
        of years required to get a new record high. Find P (N > n) for all positive integers n,
        and use this to find the PMF of N .
        Hint: Note that P (N = n) + P (N > n) = P (N > n − 1).

        (d) With notation as above, show that E(N ) is infinite.


6
Moments



The nth moment of an r.v. X is E(X n ). In this chapter, we explore how the moments
of an r.v. shed light on its distribution. We have already seen that the first two
moments are useful since they provide the mean E(X) and variance E(X 2 )−(EX)2 ,
which are important summaries of the average value of X and how spread out its
distribution is. But there is much more to a distribution than its mean and variance.
We’ll see that the third and fourth moments tell us about the asymmetry of a
distribution and the behavior of the tails or extreme values, two properties that are
not captured by the mean and variance. After introducing moments, we’ll discuss
the moment generating function (MGF), which not only helps us compute moments
but also provides a useful alternative way to specify a distribution.




6.1   Summaries of a distribution

The mean is called a measure of central tendency because it tells us something
about the center of a distribution, specifically its center of mass. Other measures
of central tendency that are commonly used in statistics are the median and the
mode, which we now define.
Definition 6.1.1 (Median). We say that c is a median of a random variable X if
P (X ≤ c) ≥ 1/2 and P (X ≥ c) ≥ 1/2. (The simplest way this can happen is if the
CDF of X hits 1/2 exactly at c, but we know that some CDFs have jumps.)
Definition 6.1.2 (Mode). For a discrete r.v. X, we say that c is a mode of X if it
maximizes the PMF: P (X = c) ≥ P (X = x) for all x. For a continuous r.v. X with
PDF f , we say that c is a mode if it maximizes the PDF: f (c) ≥ f (x) for all x.
As with the mean, the median and mode of an r.v. depend only on its distribution,
so we can talk about the mean, median, or mode of a distribution without referring
to any particular r.v. that has that distribution. For example, if Z ∼ N (0, 1) then
the median of Z is 0 (since Φ(0) = 1/2 by symmetry), and we also say that the
standard Normal distribution has median 0.
Intuitively, the median is a value c such that half the mass of the distribution falls
on either side of c (or as close to half as possible, for discrete r.v.s), and the mode
is a value that has the greatest mass or density out of all values in the support of

                                                                                   267


268                                                              Introduction to Probability

X. If the CDF F is a continuous, strictly increasing function, then F −1 (1/2) is the
median (and is unique).

Note that a distribution can have multiple medians and multiple modes. Medians
have to occur side by side; modes can occur all over the distribution. In Figure
6.1, we show a distribution supported on [−5, −1] ∪ [1, 5] that has two modes and
infinitely many medians. The PDF is 0 between −1 and 1, so all values between −1
and 1 are medians of the distribution because half of the mass falls on either side.
The two modes are at −3 and 3.
               0.4
               0.3
            PDF
               0.2
               0.1
               0.0




                          −4         −2         0          2          4
                                                x


FIGURE 6.1
A distribution with two modes (−3 and 3) and infinitely many medians (all x in
the interval [−1, 1]).

Example 6.1.3 (Mean, median, and mode for salaries). A certain company has
100 employees. Let s1 , s2 , . . . , s100 be their salaries, sorted in increasing order (we
can still do this even if some salaries appear more than once). Let X be the salary
of a randomly selected employee (chosen uniformly). The mean, median, and mode
for the data set s1 , s2 , . . . , s100 are defined to be the corresponding quantities for X.

What is a typical salary? What is the most useful one-number summary of the salary
data? The answer, as is often the case, is it depends on the goal. Different summaries
reveal different characteristics of the data, so it may be hard to choose just one
number—and it is often unnecessary to do so, since usually we can provide several
summaries (and plot the data too). Here we briefly compare the mean, median, and
mode, though often it makes sense to report all three (and other summaries too).

If the salaries are all different, the mode doesn’t give a useful one-number summary
since there are 100 modes. If there are only a few possible salaries in the company,
the mode becomes more useful. But even then it could happen that, for example,
34 people receive salary a, 33 receive salary b, and 33 receive salary c. Then a is


Moments                                                                               269

the unique mode, but if we only report a we are ignoring b and c, which just barely
missed being modes and which together account for almost 2/3 of the data.
Next, let’s consider the median. There are two numbers “in the middle”, s50 and
s51 . In fact, any number m with s50 ≤ m ≤ s51 is a median, since there is at least a
50% chance that the random employee’s salary is in {s1 , . . . , s50 } (in which case it
is at most m) and at least a 50% chance that it is in {s51 , . . . , s100 } (in which case
it is at least m). The usual convention is to choose m = (s50 + s51 )/2, the mean
of the two numbers in the middle. If the number of employees had been odd, this
issue would not have come up; in that case, there is a unique median, the number
in the middle when all the salaries are listed in increasing order.
Compared with the mean, the median is much less sensitive to extreme values. For
example, if the CEO’s salary is changed from being slightly more than anyone else’s
to vastly more than anyone else’s, that could have a large impact on the mean but
it has no impact on the median. This robustness is a reason that the median could
be a more sensible summary than the mean of what the typical salary is. On the
other hand, suppose that we want to know the total cost the company is paying for
its employees’ salaries. If we only know a mode or a median, we can’t extract this
information, but if we know the mean we can just multiply it by 100.             
Suppose that we are trying to guess what a not-yet-observed r.v. X will be, by
making a prediction c. The mean and the median both seem like natural guesses
for c, but which is better? That depends on how “better” is defined. Two natural
ways to judge how good c is are the mean squared error E(X − c)2 and the mean
absolute error E|X − c|. The following result says what the best guesses are in both
cases.
Theorem 6.1.4. Let X be an r.v. with mean µ, and let m be a median of X.
• The value of c that minimizes the mean squared error E(X − c)2 is c = µ.
• A value of c that minimizes the mean absolute error E|X − c| is c = m.

Proof. We will first prove a useful identity:
                           E(X − c)2 = Var(X) + (µ − c)2 .
This can be checked by expanding everything out, but a faster way is to use the
fact that adding a constant doesn’t affect the variance:
    Var(X) = Var(X − c) = E(X − c)2 − (E(X − c))2 = E(X − c)2 − (µ − c)2 .
It follows that c = µ is the unique choice that minimizes E(X − c)2 , since that
choice makes (µ − c)2 = 0 and any other choice makes (µ − c)2 > 0.
Next, let’s consider the mean absolute error. Let a 6= m. We need to show that
E|X − m| ≤ E|X − a|, which is equivalent to E(|X − a| − |X − m|) ≥ 0. Assume
that m < a (the case m > a can be handled similarly). If X ≤ m then
                  |X − a| − |X − m| = a − X − (m − X) = a − m,


270                                                          Introduction to Probability

and if X > m then

                    |X − a| − |X − m| ≥ X − a − (X − m) = m − a.

Let
                                Y = |X − a| − |X − m|.
We can split the definition of E(Y ) into 2 parts based on whether X ≤ m occurs,
using indicator r.v.s. Let I be the indicator r.v. for X ≤ m, so 1 − I is the indicator
r.v. for X > m. Then

                 E(Y ) = E(Y I) + E(Y (1 − I))
                       ≥ (a − m)E(I) + (m − a)E(1 − I)
                       = (a − m)P (X ≤ m) + (m − a)P (X > m)
                       = (a − m)P (X ≤ m) − (a − m)(1 − P (X ≤ m))
                       = (a − m)(2P (X ≤ m) − 1).

By definition of median, we have 2P (X ≤ m) − 1 ≥ 0. Thus, E(Y ) ≥ 0, which
implies E(|X − m|) ≤ E(|X − a|).                                         
              0.6
              0.4
           PDF
              0.2
              0.0




                           −5           0           5            10
                                             x


FIGURE 6.2
Two PDFs with mean 2 and variance 12. The light curve is Normal and symmetric;
the dark curve is Log-Normal and right-skewed.

Regardless of which measure of central tendency we use in a particular application,
it is usually important also to know about the spread of the distribution as measured
by, for example, the variance. However, there are also major features of a distribution
that are not captured by the mean and variance. For example, the two PDFs in
Figure 6.2 both have mean 2 and variance 12. The light curve is the N (2, 12) PDF
and the dark curve belongs to the Log-Normal family of distributions (the Log-
Normal is defined later in this chapter). The Normal curve is symmetric about 2, so


Moments                                                                                                           271

its mean, median, and mode are all 2. In contrast, the Log-Normal is heavily skewed
to the right; this means its right tail is very long compared to its left tail. It has
mean 2, but median 1 and mode 0.25. From the mean and variance alone, we would
not be able to capture the difference between the asymmetry of the Log-Normal
and the symmetry of the Normal.

Now consider Figure 6.3, which shows the PMF of a Bin(10, 0.9) r.v. on the left
and the PMF of 8 plus a Bin(10, 0.1) r.v. on the right. Both of these distributions
have mean, median, and mode equal to 9 and variance equal to 0.9, but they look
drastically different. We say that the PMF on the left is left-skewed and the PMF
on the right is right-skewed. In this chapter we’ll learn that a standard measure of
the asymmetry of a distribution is based on the third moment.
      0.4




                                                           0.4
                                                ●                    ●

                                                    ●            ●
      0.3




                                                           0.3
   PMF




                                                         PMF
      0.2




                                                           0.2




                                            ●                            ●
      0.1




                                                           0.1




                                        ●                                     ●

                                    ●                                             ●
      0.0




                                                           0.0




            ●   ●   ●   ●   ●   ●                                                      ●   ●    ●   ●    ●   ●


            0       2       4       6       8       10           8       10       12       14       16       18
                                x                                                      x


FIGURE 6.3
Left: Bin(10, 0.9) is left-skewed. Right: Bin(10, 0.1), shifted to the right by 8, is
right-skewed but has the same mean, median, mode, and variance as Bin(10, 0.9).


The previous two examples considered asymmetric distributions, but symmetric
distributions with the same mean and variance can also look very different. The left
plot in Figure 6.4 shows two symmetric PDFs with mean 0 and variance 1. The
light curve is the N (0, 1) PDF and the dark curve is the t3 PDF, scaling it to have
variance 1 (we’ll define the t3 distribution in Chapter 10). The dark curve has a
sharper peak and heavier tails than the light curve. The tail behavior is magnified
in the right plot, where it is easy to see that the dark curve decays to 0 much more
gradually, making outcomes far out in the tail much more likely than for the light
curve. As we’ll learn in this chapter, a standard measure of the heaviness of the
tails of a distribution is based on the fourth moment.

In the next section, we will go into further detail of how to interpret moments,
especially the first four moments.


272                                                                      Introduction to Probability




        0.6




                                                     0.015
        0.4




                                                     0.010
      PDF




                                                  PDF
                                                     0.005
        0.2




                                                     0.000
        0.0




              −6   −4   −2   0     2   4     6               2.5   3.0   3.5       4.0       4.5   5.0
                             x                                                 x


FIGURE 6.4
Left: N (0, 1) PDF (light) and a scaled t3 PDF (dark). Both have mean 0 and
variance 1, but the latter has a sharper peak and heavier tails. Right: magnified
version of right tail behavior.




6.2         Interpreting moments

Definition 6.2.1 (Kinds of moments). Let X be an r.v. with mean µ and variance
σ 2 . For any positive integer n, the nth moment of X is E(X n), thenth central mo-
                                                                                         n
                                                                               X−µ
ment is E((X −µ)n ), and the nth standardized moment is E(                      σ            ). Throughout
the previous sentence, “if it exists” is left implicit.
In particular, the mean is the first moment and the variance is the second central
moment. The term moment is borrowed from physics. Let X be a discrete r.v. with
distinct possible values x1 , . . . , xn , and imagine a pebble with mass mj = P (X = xj )
positioned at xj on a number line, for each j (as illustrated in Figure 6.5). In
physics,
                                                 Xn
                                        E(X) =       mj xj
                                                   j=1
is called the center of mass of the system, and
                                            n
                                            X
                                 Var(X) =         mj (xj − E(X))2
                                            j=1

is called the moment of inertia about the center of mass.
We’ll now define skewness, a single-number summary of asymmetry which, as al-
luded to earlier, is based on the third moment. In fact, skewness is defined to be
the third standardized moment.


Moments                                                                         273


                                m2
                         m1                 m3   m4    m5

                         x1     x2          x3    x4    x5
                                     E(X)


FIGURE 6.5
Physics interpretation of moments. The mean (first moment) of an r.v. corresponds
to the center of mass of a collection of pebbles, and the variance (second central
moment) corresponds to the moment of inertia about the center of mass.

Definition 6.2.2 (Skewness). The skewness of an r.v. X with mean µ and variance
σ 2 is the third standardized moment of X:
                                               
                                           X −µ 3
                             Skew(X) = E            .
                                             σ

By standardizing first, we make the definition of Skew(X) not depend on the loca-
tion or the scale of X, which is reasonable since we already have µ and σ to provide
information about location and scale. Also, standardizing first gives the nice prop-
erty that the units in which X is measured (e.g., inches vs. meters) will not affect
the skewness.
To understand how skewness measures asymmetry, we first need to discuss what it
means for an r.v. to be symmetric.
Definition 6.2.3 (Symmetry of an r.v.). We say that an r.v. X has a symmetric
distribution about µ if X − µ has the same distribution as µ − X. We also say that
X is symmetric or that the distribution of X is symmetric; these all have the same
meaning.
The number µ in the above definition must be E(X) if the mean exists, since
                 E(X) − µ = E(X − µ) = E(µ − X) = µ − E(X)
simplifies to E(X) = µ. Because of this, it is common to say “X is symmetric” as
shorthand for “X is symmetric about its mean” (if the mean exists). The number
µ is also a median of the distribution, since if X − µ has the same distribution as
µ − X, then
                         P (X − µ ≤ 0) = P (µ − X ≤ 0),
so
                              P (X ≤ µ) = P (X ≥ µ),
which implies that
          P (X ≤ µ) = 1 − P (X > µ) ≥ 1 − P (X ≥ µ) = 1 − P (X ≤ µ),
showing that P (X ≤ µ) ≥ 1/2 and P (X ≥ µ) ≥ 1/2.


274                                                            Introduction to Probability

h 6.2.4. Sometimes people say “X is symmetric” to mean “X is symmetric about
0”. Note that if X is symmetric about µ, then X −µ is symmetric about 0. Symmetry
about 0 is especially convenient since then −X and X have the same distribution,
and the PDF of X (if X is continuous) is an even function, as shown below.
Intuitively, symmetry means that the PDF of X to the left of µ is the mirror image
of the PDF of X to the right of µ (for X continuous, and the same holds for the
PMF if X is discrete). For example, we have seen before that X ∼ N (µ, σ 2 ) is
symmetric; in terms of the definition, this is because X − µ and µ − X are both
N (0, σ 2 ). We have also seen from Corollary 3.3.8 that X ∼ Bin(n, p) is symmetric
when p = 1/2.
We can also give an algebraic description of what the PDF of a symmetric continuous
r.v. looks like.
Proposition 6.2.5 (Symmetry in terms of the PDF). Let X be a continuous
r.v. with PDF f . Then X is symmetric about µ if and only if f (x) = f (2µ − x) for
all x.

Proof. Let F be the CDF of X. If symmetry holds, we have

F (x) = P (X − µ ≤ x − µ) = P (µ − X ≤ x − µ) = P (X ≥ 2µ − x) = 1 − F (2µ − x).

Taking the derivative of both sides yields f (x) = f (2µ − x). Conversely, suppose
that f (x) = f (2µ − x) holds for all x. Integrating both sides, we have
                                          Z µ+t               Z µ+t
       P (X − µ ≤ t) = P (X ≤ µ + t) =            f (x)dx =           f (2µ − x)dx,
                                           −∞                  −∞

which, after the substitution w = 2µ − x, becomes
                  Z ∞
                         f (w)dw = P (X ≥ µ − t) = P (µ − X ≤ t).                      
                   µ−t



Odd central moments give some] information about symmetry.
Proposition 6.2.6 (Odd central moments of a symmetric distribution). Let X be
symmetric about its mean µ. Then for any odd number m, the mth central moment
E(X − µ)m is 0 if it exists.

Proof. Since X − µ has the same distribution as µ − X, they have the same mth
moment (if it exists):
                          E(X − µ)m = E(µ − X)m .

Let Y = (X − µ)m . Then (µ − X)m = (−(X − µ))m = (−1)m Y = −Y , so the above
equation just says E(Y ) = −E(Y ). So E(Y ) = 0.                          


Moments                                                                               275

This leads us to consider using an odd standardized moment as a measure of the
skew of a distribution. The first standardized moment is always 0, so the third
standardized moment is taken as the definition of skewness. Positive skewness is
indicative of having a long right tail relative to the left tail, and negative skewness
is indicative of the reverse. (The converse of the above proposition is false, though:
there exist asymmetric distributions whose odd central moments are all 0.)

Why not use, say, the fifth standardized moment instead of the third? One reason
is that the third standardized moment is usually easier to calculate. Another reason
is that we may want to estimate skewness from a data set. It is usually easier to
estimate lower moments than higher moments in a stable way since, for example, a
large, noisy observation will have a very large, very noisy fifth power. Nevertheless,
just as the mean isn’t the only useful notion of average and the variance isn’t the
only useful notion of spread, the third standardized moment isn’t the only useful
notion of skew.

Another important descriptive feature of a distribution is how heavy its tails are.
For a given variance, is the variability explained more by a few rare (extreme)
events or by a moderate number of moderate deviations from the mean? This is an
important consideration for risk management in finance: for many financial assets,
the distribution of returns has a heavy left tail caused by rare but severe crisis events,
and failure to account for these rare events can have disastrous consequences, as
demonstrated by the 2008 financial crisis.

As with measuring skew, no single measure can perfectly capture the tail behavior,
but there is a widely used summary based on the fourth standardized moment.

Definition 6.2.7 (Kurtosis). The kurtosis of an r.v. X with mean µ and variance
σ 2 is a shifted version of the fourth standardized moment of X:

                                                      4
                                                X −µ
                            Kurt(X) = E                     − 3.
                                                  σ


h 6.2.8. The reason for subtracting 3 is that this makes any Normal distribution
have kurtosis 0 (as shown in Section 6.5). This provides a convenient basis for
comparison. However, some sources define the kurtosis without the 3, in which case
they call our version “excess kurtosis”.

Figure 6.6 shows three named distributions and lists the skewness and kurtosis of
each. The Expo(1) and Pois(4) distributions (left and middle) both have positive
skewness and positive kurtosis, indicating that they are right-skewed and their tails
are heavier than those of a Normal distribution. The Unif(0, 1) distribution (right)
has zero skewness and negative kurtosis: zero skewness because the distribution is
symmetric about its mean, and negative kurtosis because it has no tails!


276                                                                                 Introduction to Probability



      1.2




                                                                                1.5
                                          0.2
      0.8




                                                                                1.0
                                          PMF
 PDF




                                                                              PDF
                                        0.1




                                                                                0.5
      0.4




                                                                                0.0
      0.0




                                          0.0
            0.0   1.0       2.0   3.0           0   2   4   6     8   10 12           −0.5   0.0   0.5   1.0   1.5
                        x                                   x                                       x


FIGURE 6.6
Skewness and kurtosis of some named distributions. Left: Expo(1) PDF, skewness =
2, kurtosis = 6. Middle: Pois(4) PMF, skewness = 0.5, kurtosis = 0.25. Right:
Unif(0, 1) PDF, skewness = 0, kurtosis = −1.2.




6.3         Sample moments

In statistical inference, a central problem is how to use data to estimate unknown
parameters of a distribution, or functions of unknown parameters. It is especially
common to want to estimate the mean and variance of a distribution. If the data
are i.i.d. random variables X1 , . . . , Xn where the mean E(Xj ) is unknown, then the
most obvious way to estimate the mean is simply to average the Xj , taking the
arithmetic mean.
For example, if the observed data are 3, 1, 1, 5, then a simple, natural way to estimate
the mean of the distribution that generated the data is to use (3+1+1+5)/4 = 2.5.
This is called the sample mean. Similarly, if we want to estimate the second moment
of the distribution that generated the data 3, 1, 1, 5, then a simple, natural way is to
use (32 + 12 + 12 + 52 )/4 = 9. This is called the sample second moment. In general,
sample moments are defined as follows.
Definition 6.3.1 (Sample moments). Let X1 , . . . , Xn be i.i.d. random variables.
The kth sample moment is the r.v.
                                                            n
                                                        1X k
                                                Mk =      Xj .
                                                        n
                                                            j=1

The sample mean X̄n is the first sample moment:
                                                             n
                                                        1X
                                                X̄n =      Xj .
                                                        n
                                                            j=1

In contrast, the population mean or true mean is E(Xj ), the mean of the distribution
from which the Xj were drawn.


Moments                                                                                277

The law of large numbers, which we prove in Chapter 10, shows that the kth sample
moment of i.i.d. random variables X1 , . . . , Xn converges to the kth moment E(X1k )
as n → ∞. Also, the expected value of the kth sample moment is the kth moment.
In statistical terms, we say that the kth sample moment is unbiased for estimating
the kth moment. It is easy to check this by linearity:
                            
                                  1                          
                      Xn
                    1
               E        Xjk  =     E(X1k ) + · · · + E(Xnk ) = E(X1k ).
                    n             n
                      j=1


The mean and variance of the sample mean are often needed, and have nice expres-
sions that are often needed in statistics.
Theorem 6.3.2 (Mean and variance of sample mean). Let X1 , . . . , Xn be i.i.d. r.v.s
with mean µ and variance σ 2 . Then the sample mean X̄n is unbiased for estimating
µ. That is,
                                   E(X̄n ) = µ.
The variance of X̄n is given by

                                                     σ2
                                       Var(X̄n ) =      .
                                                     n

Proof. We have E(X̄n ) = µ since we showed above that the kth sample moment
is unbiased for estimating the kth moment. For the variance, we will use the fact
(shown in the next chapter) that the variance of the sum of independent r.v.s is the
sum of the variances:
                             1                          n             σ2
               Var(X̄n ) =      Var(X1 + · · · + Xn ) =    Var(X1 ) =    .               
                             n2                         n2            n

For estimating the variance of the distribution of i.i.d. r.v.s X1 , . . . , Xn , a natural
approach building on the above concepts is to mimic the formula Var(X) = E(X 2 )−
(EX)2 by taking the second sample moment and subtracting the square of the
sample mean. There are advantages to this method, but a more common method is
as follows.
Definition 6.3.3 (Sample variance and sample standard deviation). Let
X1 , . . . , Xn be i.i.d. random variables. The sample variance is the r.v.
                                             n
                                        1 X
                               Sn2 =       (Xj − X̄n )2 .
                                       n−1
                                            j=1

The sample standard deviation is the square root of the sample variance.
The idea of the above definition is to mimic the formula Var(X) = E(X −E(X))2 by
averaging the squared distances of the Xj from the sample mean, except with n − 1
rather than n in the denominator. The motivation for the n − 1 is that this makes


278                                                                  Introduction to Probability

the sample variance Sn2 unbiased for estimating σ 2 , i.e., it is correct on average.
However, the sample standard deviation Sn is not unbiased for estimating σ; we
will see in Chapter 10 which way the inequality goes. In any case, unbiasedness is
only one of several criteria by which to judge an estimation procedure. For example,
in some problems we can get a lower mean squared error in return for allowing a
little bit of bias, and this tradeoff may be worthwhile.
Theorem 6.3.4 (Unbiasedness of sample variance). Let X1 , . . . , Xn be i.i.d. r.v.s
with mean µ and variance σ 2 . Then the sample variance Sn2 is unbiased for estimating
σ 2 , i.e.,
                                    E(Sn2 ) = σ 2 .

Proof. The key to the proof is the handy identity
                     n
                     X             n
                                   X
                       (Xj − c)2 =   (Xj − X̄n )2 + n(X̄n − c)2 ,
                     j=1               j=1

which holds for all c. To verify the identity, add and subtract X̄n in the left-hand
sum:
      n
      X             n
                    X                         2
        (Xj − c)2 =   (Xj − X̄n ) + (X̄n − c)
      j=1             j=1
                      Xn                       n
                                               X                              n
                                                                              X
                  =         (Xj − X̄n )2 + 2         (Xj − X̄n )(X̄n − c) +         (X̄n − c)2
                      j=1                      j=1                            j=1
                      n
                      X
                  =         (Xj − X̄n )2 + n(X̄n − c)2 .
                      j=1

For the last line, we used the fact that X̄n − c does not depend on j and the fact
that
                Xn               Xn       Xn
                   (Xj − X̄n ) =     Xj −     X̄n = nX̄n − nX̄n = 0.
               j=1                  j=1         j=1


Now let us apply the identity, choosing c = µ. Taking the expectation of both sides,
                                                 
                                   X n
              nE(X1 − µ)2 = E  (Xj − X̄n )2  + nE(X̄n − µ)2 .
                                       j=1


By definition of variance, E(X1 −µ)2 = Var(X1 ) = σ 2 , and E(X̄n −µ)2 = Var(X̄n ) =
σ 2 /n. Plugging these results in above and simplifying, we have E(Sn2 ) = σ 2 .   

Similarly, we can define the sample skewness to be
                                1 Pn                3
                                n   j=1 (Xj − X̄n )
                                                             ,
                                               Sn3


Moments                                                                            279

and the sample kurtosis to be
                               1 Pn               4
                               n  j=1 (Xj − X̄n )
                                                    − 3.
                                       Sn4

Beyond the fourth moment, it rapidly gets harder to interpret moments graphically
and harder to estimate them well from data if they are unknown. However, in the
rest of this chapter we will see that it can still be useful to know all the moments of
a distribution. We will also study a way of computing moments that is often easier
than LOTUS. Both the usefulness and the computation of moments are closely
connected to a blueprint called the moment generating function, to which we devote
most of the rest of this chapter.




6.4   Moment generating functions
    A generating function is a clothesline on which we hang up a sequence of
 numbers for display. – Herbert Wilf [28]
Generating functions are a powerful tool in combinatorics and probability, bridging
between sequences of numbers and the world of calculus. In probability, they are
useful for studying both discrete and continuous distributions. The general idea
behind a generating function is as follows: starting with a sequence of numbers,
create a continuous function—the generating function—that encodes the sequence.
We then have all the tools of calculus at our disposal for manipulating the generating
function.
A moment generating function, as its name suggests, is a generating function that
encodes the moments of a distribution. Here is the definition, followed by a few
examples.
Definition 6.4.1 (Moment generating function). The moment generating function
(MGF) of an r.v. X is M (t) = E(etX ), as a function of t, if this is finite on some
open interval (−a, a) containing 0. Otherwise we say the MGF of X does not exist.
A natural question at this point is “What is the interpretation of t?” The answer
is that t has no interpretation in particular; it’s just a bookkeeping device that we
introduce in order to be able to use calculus instead of working with a discrete
sequence of moments.
Note that M (0) = 1 for any valid MGF M ; whenever you compute an MGF, plug
in 0 and see if you get 1, as a quick check!
Example 6.4.2 (Bernoulli MGF). For X ∼ Bern(p), etX takes on the value et with
probability p and the value 1 with probability q, so M (t) = E(etX ) = pet + q. Since
this is finite for all values of t, the MGF is defined on the entire real line.    


280                                                                              Introduction to Probability

Example 6.4.3 (Geometric MGF). For X ∼ Geom(p),
                                    ∞
                                    X                     ∞
                                                          X                          p
                M (t) = E(etX ) =         etk q k p = p     (qet )k =
                                                                                  1 − qet
                                    k=0                   k=0

for qet < 1, i.e., for t in (−∞, log(1/q)), which is an open interval containing 0. 
Example 6.4.4 (Uniform MGF). Let U ∼ Unif(a, b). Then the MGF of U is
                                     Z b
                                   1              etb − eta
                M (t) = E(etU ) =        etu du =
                                  b−a a           t(b − a)
for t 6= 0, and M (0) = 1.                                                                               
The next three theorems give three reasons why the MGF is important. First, the
MGF encodes the moments of an r.v. Second, the MGF of an r.v. determines its
distribution, like the CDF and PMF/PDF. Third, MGFs make it easy to find the
distribution of a sum of independent r.v.s. Let’s take these one by one.
Theorem 6.4.5 (Moments via derivatives of the MGF). Given the MGF of X, we
can get the nth moment of X by evaluating the nth derivative of the MGF at 0:
E(X n ) = M (n) (0).

Proof. This can be seen by noting that the Taylor expansion of M (t) about 0 is
                                           ∞
                                           X                 tn
                               M (t) =           M (n) (0)      ,
                                                             n!
                                           n=0

while on the other hand, we also have
                                                      ∞
                                                                         !
                                                      X            n
                                      tX                         nt
                         M (t) = E(e       )=E               X               .
                                                                    n!
                                                      n=0

We are allowed to interchange the expectation and the infinite sum because certain
technical conditions are satisfied (this is where we invoke the condition that E(etX )
is finite in an interval around 0), so
                                           ∞
                                           X               tn
                               M (t) =           E(X n )      .
                                                           n!
                                           n=0

Matching the coefficients of the two expansions, we get E(X n ) = M (n) (0).                             

The above theorem is surprising in that for a continuous r.v. X, to compute mo-
ments would seemingly require doing integrals with LOTUS, but with the MGF it
is possible to find moments by taking derivatives rather than doing integrals!
Theorem 6.4.6 (MGF determines the distribution). The MGF of a random vari-
able determines its distribution: if two r.v.s have the same MGF, they must have
the same distribution. In fact, if there is even a tiny interval (−a, a) containing 0
on which the MGFs are equal, then the r.v.s must have the same distribution.
```
