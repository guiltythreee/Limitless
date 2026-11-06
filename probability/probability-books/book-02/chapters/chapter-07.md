# Chapter 7: Joint Distributions

**Book:** Introduction to Probability, Second Edition  
**Authors:** Joseph K. Blitzstein and Jessica Hwang  
**Printed pages:** 303–366

> Source transcription from the supplied textbook PDF. Text extraction preserves the original order and page content as far as the PDF text layer allows. Check mathematical notation and figure references against the source where extraction is ambiguous.

```text
Joint distributions                                                              317

Proposition 7.1.21. Suppose that the joint PDF fX,Y of X and Y factors as

                                   fX,Y (x, y) = g(x)h(y)

for all x and y, where g and h are nonnegative functions. Then X and Y are
independent. Also, if either g or h is a valid PDF, then the other one is a valid PDF
too and g and h are the marginal PDFs of X and Y , respectively. (The analogous
result in the discrete case also holds.)
                 R∞
Proof. Let c =    −∞ h(y)dy. Multiplying and dividing by c, we can write

                                                         h(y)
                                 fX,Y (x, y) = cg(x) ·        .
                                                          c
(The point of this is that h(y)/c is a valid PDF.) Then the marginal PDF of X is

                          Z ∞                            Z ∞
                                                           h(y)
               fX (x) =         fX,Y (x, y)dy = cg(x)           dy = cg(x).
                          −∞                             −∞ c
                 R∞
It follows that −∞ cg(x)dx = 1 since a marginal PDF is a valid PDF (knowing the
integral of h gave us the integral of g for free!). Then the marginal PDF of Y is
                        Z ∞                         Z
                                              h(y) ∞              h(y)
               fY (y) =     fX,Y (x, y)dx =             cg(x)dx =      .
                         −∞                     c    −∞             c
Thus, X and Y are independent with PDFs cg(x) and h(y)/c, respectively. If g or
h is already a valid PDF, then c = 1, so the other one is also a valid PDF.  
h 7.1.22. In the above proposition, we need the joint PDF to factor as a function
of x times a function of y for all (x, y) in the plane R2 , not just for (x, y) with
fX,Y (x, y) > 0. The reason for this is illustrated in the next example.
A simple case of a continuous joint distribution is when the joint PDF is constant
over some region in the plane. In the following example, we’ll compare a joint PDF
that is constant on a square to a joint PDF that is constant on a disk.
Example 7.1.23 (Uniform on a region in the plane). Let (X, Y ) be a completely
random point in the square {(x, y) : x, y ∈ [0, 1]}, in the sense that the joint PDF
of X and Y is constant over the square and 0 outside of it:
                                     
                                         1 if x, y ∈ [0, 1],
                       fX,Y (x, y) =
                                         0 otherwise.

The constant 1 is chosen so that the joint PDF will integrate to 1. This distribution
is called the Uniform distribution on the square.
Intuitively, it makes sense that X and Y should be Unif(0, 1) marginally. We can
check this by computing
                               Z 1                 Z 1
                      fX (x) =     fX,Y (x, y)dy =     1dy = 1,
                                    0                      0


318                                                               Introduction to Probability

and similarly for fY . Furthermore, X and Y are independent, since the joint PDF
factors into the product of the marginal PDFs (this just reduces to 1 = 1 · 1, but
it’s important to note that the value of X does not constrain the possible values of
Y ). So the conditional distribution of Y given X = x is Unif(0, 1), regardless of x.
Now let (X, Y ) be a completely random point in the unit disk {(x, y) : x2 + y 2 ≤ 1},
with joint PDF                         1     2    2
                                        π if x + y ≤ 1,
                        fX,Y (x, y) =
                                        0 otherwise.
Again, the constant 1/π is chosen to make the joint PDF integrate to 1; the value
follows from the fact that the integral of 1 over some region in the plane is the area
of that region.
Note that X and Y are not independent, since in general, knowing the value of X
constrains the possible values of Y : larger values of |X| restrict Y to be in a smaller
range. It would fall into h 7.1.22 disastrously to conclude independence from the
fact that fX,Y (x, y) = g(x)h(y) for all (x, y) in the disk, where g(x) = 1/π and
h(y) = 1 are constant functions. To see from the definition that X and Y are not
independent, note that, for example, fX,Y (0.9, 0.9) = 0 since (0.9, 0.9) is not in the
unit disk, but fX (0.9)fY (0.9) 6= 0 since 0.9 is in the supports of both X and Y .
The marginal distribution of X is now
                        Z √1−x2
                                 1      2p
               fX (x) = √          dy =     1 − x2 , −1 ≤ x ≤ 1.
                         − 1−x 2 π      π
                         p
By symmetry, fY (y) = π2 1 − y 2 . Note that the marginal distributions of X and
Y are not Uniform on [−1, 1]; rather, X and Y are more likely to fall near 0 than
near ±1.



                                                 ( x,√1 – x )
                                                          2




                                                 ( x, –√1 – x )
                                                              2




FIGURE 7.6
Bird’s-eye view of the Uniform joint
                                  √ PDF√on the unit disk. Conditional on X = x,
Y is restricted to the interval [− 1 − x2 , 1 − x2 ].

Suppose we observe X = x. As illustrated in Figure 7.6, this constrains Y to lie


Joint distributions                                                                 319
                  √        √
in the interval [− 1 − x2 , 1 − x2 ]. Specifically, the conditional distribution of Y
given X = x is
                                                       1
                                      fX,Y (x, y)               1
                      fY |X (y|x) =               = 2√ π    = √
                                        fX (x)      π 1−x
                                                          2  2 1 − x2
      √               √
for − 1 − x2 ≤ y ≤ 1 − x2 , and 0 otherwise. This conditional PDF is constant
as a function of y,√which tells
                            √ us that the conditional distribution of Y is Uniform
on the interval [− 1 − x2 , 1 − x2 ]. The fact that the conditional PDF is not free
of x confirms the fact that X and Y are not independent.
In general, for a region R in the plane, the Uniform distribution on R is defined
to have joint PDF that is constant inside R and 0 outside R. The constant is the
reciprocal of the area of R. If R is the rectangle {(x, y) : a ≤ x ≤ b, c ≤ y ≤ d}, then
X and Y will be independent; unlike for a disk, the vertical slices of a rectangle
all look the same. But for any region where the value of X constrains the possible
values of Y or vice versa, X and Y will not be independent.                           
As another example of working with joint PDFs, let’s consider a question that comes
up often when dealing with Exponentials of different rates.
Example 7.1.24 (Comparing Exponentials of different rates). Let T1 ∼ Expo(λ1 )
and T2 ∼ Expo(λ2 ) be independent. Find P (T1 < T2 ). For example, T1 could be
the lifetime of a refrigerator and T2 could be the lifetime of a stove (if we are
willing to assume Exponential distributions for these), and then P (T1 < T2 ) is the
probability that the refrigerator fails before the stove. We know from Chapter 5 that
min(T1 , T2 ) ∼ Expo(λ1 + λ2 ), which tells us about when the first appliance failure
will occur, but we may also want to know about which appliance will fail first.
Solution:
We just need to integrate the joint PDF of T1 and T2 over the appropriate region,
which is all (t1 , t2 ) with t1 > 0, t2 > 0, and t1 < t2 . This yields
                                    Z ∞ Z t2
                    P (T1 < T2 ) =             λ1 e−λ1 t1 λ2 e−λ2 t2 dt1 dt2
                                      0    0
                                    Z ∞ Z t2                   
                                                     −λ1 t1
                                 =               λ1 e       dt1 λ2 e−λ2 t2 dt2
                                    Z0 ∞     0

                                 =       (1 − e−λ1 t2 )λ2 e−λ2 t2 dt2
                                      0
                                         Z ∞
                                 =1−           λ2 e−(λ1 +λ2 )t2 dt2
                                            0
                                              λ2
                                  =1−
                                           λ1 + λ2
                                          λ1
                                  =            .
                                       λ1 + λ2
This result makes sense intuitively if we interpret λ1 and λ2 as rates. For example,


320                                                           Introduction to Probability

if refrigerators have twice the failure rate of stoves, then it says that the odds are 2
to 1 in favor of the refrigerator failing first. As a simple check, note that the answer
reduces to 1/2 when λ1 = λ2 , which must be true by symmetry.
An alternative method of getting the same result is to use LOTP to condition on
T1 (or condition on T2 ). A third approach, using a story about Poisson processes,
is in Chapter 13.                                                               
Our last example in this section demonstrates how we can use the joint distribution
of X and Y to derive the distribution of a function of X and Y .
Example 7.1.25 (Cauchy PDF). Let X and Y be i.i.d. N (0, 1), and let T = X/Y .
(We can define T arbitrarily in the case Y = 0; the choice of how to define T in that
case has no effect on the distribution of T , since P (Y = 0) = 0.) The distribution
of T is a famous named distribution called the Cauchy distribution, and we will
encounter it again in later chapters. Meanwhile, find the PDF of T .
Solution:
We’ll find an expression for the CDF of T first, and then differentiate to get the
PDF. We can write
                                                            
                                         X              X
                FT (t) = P (T ≤ t) = P     ≤t =P            ≤t ,
                                         Y             |Y |
since the r.v.s X      X
                Y and |Y | are identically distributed by the symmetry of the standard
Normal distribution. Now |Y | is nonnegative, so we can multiply by it on both sides
without reversing the direction of the inequality. Thus, we are interested in finding
                                FT (t) = P (X ≤ t|Y |).
We calculate this probability by integrating the joint PDF of X and Y over the
region where X ≤ t|Y | holds. The joint PDF of X and Y is just the product of the
marginal PDFs, by independence. So
                   FT (t) = P (X ≤ t|Y |)
                            Z ∞ Z t|y|
                                        1   2    1   2
                          =            √ e−x /2 √ e−y /2 dxdy.
                             −∞ −∞       2π      2π
Note that the inner limits of integration (the limits for x) depend on y, whereas
the outer limits of integration (the limits for y) can’t depend on x (see the math
appendix for more about limits of integration with multiple integrals). With some
manipulations, we can get the double integral down to a single integral:
                          Z ∞               Z t|y|             !
                                1 −y2 /2            1 −x2 /2
                 FT (t) =      √ e                 √ e       dx dy
                           −∞    2π           −∞    2π
                          Z ∞
                                1        2
                        =      √ e−y /2 Φ(t|y|)dy
                           −∞    2π
                          r Z ∞
                            2          2
                        =          e−y /2 Φ(ty)dy.
                            π 0


Joint distributions                                                                   321

Alternatively, we can get the same result without doing a double integral by using
one of the versions of LOTP. Letting I be the indicator r.v. for the event X ≤ t|Y |,
we again have
                                  Z ∞
                      P (I = 1) =     P (I = 1|Y = y)fY (y)dy
                                  Z−∞
                                    ∞
                                        1     2
                                =     √ e−y /2 Φ(t|y|)dy.
                                   −∞   2π
At this point we seem to be stuck with an integral we don’t know how to do.
Fortunately, we were asked to find the PDF, not the CDF, so instead of evaluating
the integral, we can just differentiate it with respect to t (not with respect to y, which
is a dummy variable). We are permitted to interchange the order of integration and
differentiation under mild technical conditions, which are met here. (This technique
is known as differentiation under the integral sign, or DUThIS for short.) Then
                                       r Z ∞
                               0           2      ∂  −y2 /2      
                    fT (t) = FT (t) =                e       Φ(ty) dy
                                           π 0 ∂t
                             r Z ∞
                                 2            2
                           =            ye−y /2 ϕ(ty)dy
                                 π
                                Z 0
                              1 ∞ − (1+t2 )y2
                           =         ye      2  dy
                              π 0
                                   1
                           =             ,
                              π(1 + t2 )
using the substitution u = (1 + t2 )y 2 /2, du = (1 + t2 )ydy for the final step. So the
PDF of T is
                                           1
                             fT (t) =            , t ∈ R.
                                      π(1 + t2 )
Since             Z ∞
                         1
                            2
                              dt = arctan(∞) − arctan(−∞) = π,
                    −∞ 1 + t
we have obtained a valid PDF. If we want to obtain the CDF too, we can integrate
the PDF over the appropriate interval:
                           Z t
                                   1          1            1
                  FT (t) =             2
                                         du = arctan(t) + .
                            −∞ π(1 + u )      π            2

As we mentioned, the distribution of T is called the Cauchy distribution. The
Cauchy PDF is similar in shape to the Normal bell curve, but with tails that decay
less quickly to 0. Figure 7.7 superimposes the Cauchy and standard Normal PDFs;
the heavier tails of the Cauchy PDF are evident.
An interesting fact about the Cauchy distribution is that althoughR the PDF is
                                                                         ∞      t
symmetric about 0, its expected value does not exist, since the integral −∞ π(1+t 2 ) dt

                                  t     1
                                               R ∞ 1
diverges: note that for large t, 1+t2 ≈ t , and 1 t dt = ∞. It would be a blunder
to write “E( X              1           1                  1
             Y ) = E(X)E( Y ) = 0 · E( Y ) = 0”, since E( Y ) also does not exist. 


322                                                             Introduction to Probability




              0.4
              0.3
            PDF
              0.2
              0.1
              0.0




                       −3     −2     −1      0      1       2         3
                                             x


FIGURE 7.7
Cauchy PDF (dark) and N (0, 1) PDF (light). The Cauchy distribution has much
heavier tails than the Normal distribution.

7.1.3   Hybrid

It is also possible that we could be interested in the joint distribution of a discrete
r.v. and a continuous r.v. This case was mentioned when discussing the four forms of
Bayes’ rule and LOTP. Conceptually it is analogous to the other cases, but since the
notation can be tricky, we’ll work through an example that sheds light on it.
Example 7.1.26 (Which company made the lightbulb?). A lightbulb was man-
ufactured by one of two companies. Bulbs that are made by Company 0 last an
Expo(λ0 ) amount of time, and bulbs made by Company 1 last an Expo(λ1 ) amount
of time, with λ0 < λ1 . The bulb of interest here was made by Company 0 with
probability p0 and by Company 1 with probability p1 = 1 − p0 , but from inspecting
the bulb we don’t know which company made it.
Let T be how long the bulb lasts, and I be the indicator of it having been made by
Company 1.
(a) Find the CDF and PDF of T .
(b) Does T have the memoryless property?
(c) Find the conditional distribution of I given T = t. What happens to this as
t → ∞?
Solution:
Since T is a continuous r.v. and I is discrete, the joint distribution of T and I is a
hybrid, as illustrated in Figure 7.8. In a joint PDF of two continuous r.v.s, there are
infinitely many vertical slices of the joint PDF that we can take, each corresponding
to a different conditional PDF. Here there are only two conditional PDFs of T , one


Joint distributions                                                               323

for I = 0 and one for I = 1. As stated in the problem, the conditional distribution of
T given I = 0 is Expo(λ0 ) and given I = 1 is Expo(λ1 ). The marginal distribution
of I is Bern(p1 ).




                        I=0                                  t
                                 I=1

FIGURE 7.8
Hybrid joint distribution of T and I.

Thus, we are given the joint distribution of T and I in terms of (1) the marginal
distribution of I and (2) the conditional distribution of T given I. The problem
then asks us to flip it around and find (1) the marginal distribution of T and (2)
the conditional distribution of I given T . Phrased in this way, it becomes clear that
LOTP and Bayes’ rule will be our friends.

(a) In this part we are asked to derive the marginal distribution of T . For the CDF,
we use the law of total probability, conditioning on I:

              FT (t) = P (T ≤ t) = P (T ≤ t|I = 0)p0 + P (T ≤ t|I = 1)p1
                                 = (1 − e−λ0 t )p0 + (1 − e−λ1 t )p1
                                 = 1 − p0 e−λ0 t − p1 e−λ1 t

for t > 0. The marginal PDF is the derivative of the CDF:

                      fT (t) = p0 λ0 e−λ0 t + p1 λ1 e−λ1 t , for t > 0.

We could also have gotten this directly from the “X continuous, Y discrete” version
of LOTP, but we did not write out a proof of that version of LOTP, and working
through this example helps show why that version of LOTP works.
(b) Since λ0 6= λ1 , the above expression for the PDF does not reduce to the form
λe−λt . So the distribution of T is not Exponential, which implies that it does not
have the memoryless property. (The distribution of T is called a mixture of two
Exponentials.)


324                                                                Introduction to Probability

(c) Using a hybrid form of Bayes’ rule, which is the “X continuous, Y discrete”
version in the table of versions of Bayes’ rule, we have

                                              fT (t|I = 1)P (I = 1)
                      P (I = 1|T = t) =                             ,
                                                      fT (t)

where fT (t|I = 1) is the conditional PDF of T given I = 1, evaluated at t. Using
the fact that T |I = 1 ∼ Expo(λ1 ) and the marginal PDF derived in (a),

                                     p1 λ1 e−λ1 t                        p1 λ1
         P (I = 1|T = t) =           −λ   t          −λ   t
                                                            =                        .
                             p0 λ0 e    0   + p1 λ1 e   1
                                                              p0 λ0 e −λ0 )t + p1 λ1
                                                                     (λ 1



Thus the conditional distribution of I given T = t is Bernoulli with this probability
of success. This probability goes to 0 as t → ∞, which makes sense intuitively: the
longer the bulb lasts, the more confident we will be that it was made by Company
0, as their bulbs have a lower failure rate λ and a higher life expectancy λ1 .    




7.2   2D LOTUS

The two-dimensional version of LOTUS lets us calculate the expectation of a ran-
dom variable that is a function of two random variables X and Y , using the joint
distribution of X and Y .
Theorem 7.2.1 (2D LOTUS). Let g be a function from R2 to R. If X and Y are
discrete, then               XX
               E(g(X, Y )) =     g(x, y)P (X = x, Y = y).
                                    x     y

If X and Y are continuous with joint PDF fX,Y , then
                               Z ∞Z ∞
                 E(g(X, Y )) =          g(x, y)fX,Y (x, y)dxdy.
                                     −∞       −∞


Like its 1D counterpart, 2D LOTUS saves us from having to find the distribution
of g(X, Y ) in order to calculate its expectation. Instead, having the joint PMF or
joint PDF of X and Y is enough.
One use of 2D LOTUS is to find the expected distance between two r.v.s.
Example 7.2.2 (Expected distance between two Uniforms). Let X and Y be
i.i.d. Unif(0, 1) r.v.s. Find E(|X − Y |).


Joint distributions                                                                         325

Solution:
Since the joint PDF is 1 on the unit square {(x, y) : x, y ∈ [0, 1]}, 2D LOTUS gives
                               Z 1Z 1
               E(|X − Y |) =                |x − y|dxdy
                                0       0
                               Z 1Z 1                       Z 1Z y
                          =                 (x − y)dxdy +            (y − x)dxdy
                                0       y                    0   0
                                Z 1Z 1
                          =2                    (x − y)dxdy = 1/3.
                                    0       y

First we broke up the integral into two parts so we could eliminate the absolute
value; then we used symmetry.
Incidentally, by solving this problem, we have also figured out the expected value
of M = max(X, Y ) and L = min(X, Y ). Since M + L is the same r.v. as X + Y and
M − L is the same r.v. as |X − Y |,

                         E(M + L) = E(X + Y ) = 1,
                         E(M − L) = E(|X − Y |) = 1/3.

This is a system of two equations and two unknowns, which we can solve to get
E(M ) = 2/3 and E(L) = 1/3. As a check, E(M ) exceeds E(L), as it should, and
E(M ) and E(L) are equidistant from 1/2, as should be the case by symmetry. 
                                                                                   i.i.d.
Example 7.2.3 (Expected distance between two Normals). For X, Y ∼ N (0, 1),
find E(|X − Y |).
Solution:
We could again use 2D LOTUS, giving
                         Z ∞Z ∞
                                          1   2    1   2
           E(|X − Y |) =         |x − y| √ e−x /2 √ e−y /2 dxdy,
                          −∞ −∞           2π       2π

but an easier solution uses the fact that the sum or difference of independent Nor-
mals is Normal, as we proved
                        √     using MGFs in Chapter 6. Then X − Y√∼ N (0, 2), so
we can write X − Y = 2Z where Z ∼ N (0, 1), and E(|X − Y |) = 2E|Z|. Thus,
we have reduced a 2D LOTUS to a 1D LOTUS! It was shown in Example 5.4.7 that
                                            r
                                               2
                                    E|Z| =       ,
                                               π
so
                                                   2
                                    E(|X − Y |) = √ .                                        
                                                    π

We can also use 2D LOTUS to give another proof of linearity of expectation.


326                                                           Introduction to Probability

Example 7.2.4 (Linearity via 2D LOTUS). Let X and Y be continuous r.v.s (the
analogous method also works in the discrete case). By 2D LOTUS,
                   Z ∞Z ∞
       E(X + Y ) =          (x + y)fX,Y (x, y)dxdy
                    −∞ −∞
                   Z ∞Z ∞                       Z ∞Z ∞
                 =           xfX,Y (x, y)dxdy +           yfX,Y (x, y)dxdy
                       −∞   −∞                        −∞   −∞
                   = E(X) + E(Y ).

This is a short proof of linearity of expectation. For the last step, we used 2D LOTUS
and the fact that X is a function of X and Y (that happens to be degenerate in the
sense that it doesn’t involve Y ), and similarly for Y . Another way to get the last
step is to write
 Z ∞Z ∞                          Z ∞ Z ∞                         Z ∞
            yfX,Y (x, y)dxdy =         y     fX,Y (x, y)dxdy =        yfY (y)dy = E(Y ),
  −∞   −∞                        −∞    −∞                       −∞

where we took y out from the inner integral (since y is held constant when integrat-
ing with respect to x) and then recognized the marginal PDF of Y . For the E(X)
term we can first swap the order of integration, from dxdy to dydx, and then the
same argument that we used for the E(Y ) term can be applied.                     




7.3    Covariance and correlation

Just as the mean and variance provided single-number summaries of the distribution
of a single r.v., covariance is a single-number summary of the joint distribution of
two r.v.s. Roughly speaking, covariance measures a tendency of two r.v.s to go up or
down together, relative to their means: positive covariance between X and Y indi-
cates that when X goes up, Y also tends to go up, and negative covariance indicates
that when X goes up, Y tends to go down. Here is the precise definition.
Definition 7.3.1 (Covariance). The covariance between r.v.s X and Y is

                       Cov(X, Y ) = E((X − EX)(Y − EY )).

Multiplying this out and using linearity, we have an equivalent expression:

                         Cov(X, Y ) = E(XY ) − E(X)E(Y ).

Let’s think about the definition intuitively. If X and Y tend to move in the same
direction, then X − EX and Y − EY will tend to be either both positive or both
negative, so (X − EX)(Y − EY ) will be positive on average, giving a positive
covariance. If X and Y tend to move in opposite directions, then X − EX and
Y − EY will tend to have opposite signs, giving a negative covariance.


Joint distributions                                                                 327

If X and Y are independent, then their covariance is zero. We say that r.v.s with
zero covariance are uncorrelated.
Theorem 7.3.2. If X and Y are independent, then they are uncorrelated.

Proof. We’ll show this in the case where X and Y are continuous, with PDFs fX
and fY . Since X and Y are independent, their joint PDF is the product of the
marginal PDFs. By 2D LOTUS,
                              Z ∞Z ∞
                   E(XY ) =             xyfX (x)fY (y)dxdy
                               −∞ −∞
                              Z ∞          Z ∞           
                            =      yfY (y)      xfX (x)dx dy
                              Z−∞
                                ∞
                                             −∞
                                             Z ∞
                            =      xfX (x)dx      yfY (y)dy
                                  −∞            −∞
                               = E(X)E(Y ).
The proof in the discrete case is the same, with PMFs instead of PDFs.               

The converse of this theorem is false: just because X and Y are uncorrelated does
not mean they are independent. For example, let X ∼ N (0, 1), and let Y = X 2 .
Then E(XY ) = E(X 3 ) = 0 because the odd moments of the standard Normal
distribution are equal to 0 by symmetry. Thus X and Y are uncorrelated,
                      Cov(X, Y ) = E(XY ) − E(X)E(Y ) = 0 − 0 = 0,
but they are certainly not independent: Y is a function of X, so knowing X gives us
perfect information about Y . Covariance is a measure of linear association, so r.v.s
can be dependent in nonlinear ways and still have zero covariance, as this example
demonstrates. The bottom right plot of Figure 7.9 shows draws from the joint
distribution of X and Y in this example. The other three plots illustrate positive
correlation, negative correlation, and independence.
Covariance has the following key properties.

   1. Cov(X, X) = Var(X).
   2. Cov(X, Y ) = Cov(Y, X).
   3. Cov(X, c) = 0 for any constant c.
   4. Cov(aX, Y ) = aCov(X, Y ) for any constant a.
   5. Cov(X + Y, Z) = Cov(X, Z) + Cov(Y, Z).
   6. Cov(X + Y, Z + W ) = Cov(X, Z) + Cov(X, W ) + Cov(Y, Z) + Cov(Y, W ).
   7. Var(X + Y ) = Var(X) + Var(Y ) + 2Cov(X, Y ). For n r.v.s X1 , . . . , Xn ,
                                                                X
        Var(X1 + · · · + Xn ) = Var(X1 ) + · · · + Var(Xn ) + 2   Cov(Xi , Xj ).
                                                               i<j


328                                                                        Introduction to Probability




                     Positive correlation                          Negative correlation
      3




                                                    3
      2




                                                    2
      1




                                                    1
      0




                                                    0
      y




                                                    y
      −1




                                                    −1
      −2




                                                    −2
      −3




                                                    −3


           −3   −2     −1     0     1       2   3        −3   −2      −1      0    1      2   3
                              x                                               x

                        Independent                           Dependent but uncorrelated
      3
      2




                                                    6
      1




                                                    4
      0
      y




                                                    y
      −1




                                                    2
      −2
      −3




                                                    0




           −3   −2     −1     0     1       2   3        −3   −2      −1      0    1      2   3
                              x                                               x


FIGURE 7.9
Draws from the joint distribution of (X, Y ) under various dependence structures.
Top left: X and Y are positively correlated. Top right: X and Y are negatively
correlated. Bottom left: X and Y are independent, hence uncorrelated. Bottom
right: Y is a deterministic function of X, but X and Y are uncorrelated.


Joint distributions                                                               329

The first five properties follow readily from the definition and basic properties of
expectation. Property 6 follows from Property 2 and Property 5, by expanding
    Cov(X + Y, Z + W ) = Cov(X, Z + W ) + Cov(Y, Z + W )
                             = Cov(Z + W, X) + Cov(Z + W, Y )
                             = Cov(Z, X) + Cov(W, X) + Cov(Z, Y ) + Cov(W, Y )
                             = Cov(X, Z) + Cov(X, W ) + Cov(Y, Z) + Cov(Y, W ).
Property 7 follows from writing the variance of an r.v. as its covariance with itself
(by Property 1) and then using Property 6 repeatedly.
We have now fulfilled our promise from Chapter 4 that for independent r.v.s, the
variance of the sum is the sum of the variances:
                       
                 Xn          n
                             X
           Var     Xj =       Var(Xj ) if X1 , . . . , Xn are independent.
                      j=1       j=1

By Theorem 7.3.2, independent r.v.s are uncorrelated, so in that case all the covari-
ance terms drop out of the expression in Property 7.
h 7.3.3. If X and Y are independent, then the properties of covariance give
               Var(X − Y ) = Var(X) + Var(−Y ) = Var(X) + Var(Y ).
It is a common mistake to claim “Var(X −Y ) = Var(X)−Var(Y )”; this is a category
error since Var(X) − Var(Y ) could be negative. For general X and Y , we have
                      Var(X − Y ) = Var(X) + Var(Y ) − 2Cov(X, Y ).

Since covariance depends on the units in which X and Y are measured—if we decide
to measure X in centimeters rather than meters, the covariance is multiplied by
100—it is easier to interpret a unitless version of covariance called correlation.
Definition 7.3.4 (Correlation). The correlation between r.v.s X and Y is
                                               Cov(X, Y )
                             Corr(X, Y ) = p                 .
                                             Var(X)Var(Y )
(This is undefined in the degenerate cases Var(X) = 0 or Var(Y ) = 0.)
Notice that shifting and scaling X and Y has no effect on their correlation. Shifting
does not affect Cov(X, Y ), Var(X), or Var(Y ), so the correlation is unchanged. As
for scaling, the fact that we divide by the standard deviations of X and Y ensures
that the scale factor cancels out:
                            Cov(cX, Y )       cCov(X, Y )
      Corr(cX, Y ) = p                     =p                = Corr(X, Y ).
                            Var(cX)Var(Y )    2
                                             c Var(X)Var(Y )

Correlation is convenient to interpret because it does not depend on the units of
measurement and is always between −1 and 1.


330                                                              Introduction to Probability

Theorem 7.3.5 (Correlation bounds). For any r.v.s X and Y ,

                               −1 ≤ Corr(X, Y ) ≤ 1.

Proof. Without loss of generality we can assume X and Y have variance 1, since
scaling does not change the correlation. Let ρ = Corr(X, Y ) = Cov(X, Y ). Using
the fact that variance is nonnegative, along with Property 7 of covariance, we have

            Var(X + Y ) = Var(X) + Var(Y ) + 2Cov(X, Y ) = 2 + 2ρ ≥ 0,

            Var(X − Y ) = Var(X) + Var(Y ) − 2Cov(X, Y ) = 2 − 2ρ ≥ 0.

Thus, −1 ≤ ρ ≤ 1.                                                                        

Here is an example of how to calculate covariance and correlation.

Example 7.3.6 (Exponential max and min). Let X and Y be i.i.d. Expo(1) r.v.s.
Find the correlation between max(X, Y ) and min(X, Y ).

Solution:

Let M = max(X, Y ) and L = min(X, Y ). By the memoryless property and results
from Chapter 5, we know that L ∼ Expo(2), M − L ∼ Expo(1), and M − L is
independent of L (see Example 5.6.5). Therefore,

                                                                        1
Cov(M, L) = Cov(M − L + L, L) = Cov(M − L, L) + Cov(L, L) = 0 + Var(L) = ,
                                                                        4

                                                                           1  5
        Var(M ) = Var(M − L + L) = Var(M − L) + Var(L) = 1 +                 = ,
                                                                           4  4
and
                                                         1
                                    Cov(M, L)                  1
                 Corr(M, L) = p                    = q4      =√ .                        
                                   Var(M )Var(L)         5 1
                                                          ·     5
                                                         4   4

h 7.3.7. In the above example, it makes sense that the correlation is positive
because M is constrained to be at least as large as L. The following argument would
be a blunder: “Either M = X, L = Y or M = Y, L = X, so either Cov(M, L) =
Cov(X, Y ) or Cov(M, L) = Cov(Y, X). But Cov(Y, X) = Cov(X, Y ) so we always
have Cov(M, L) = Cov(X, Y ) = 0.” It is true that either M = X, L = Y will occur
or M = Y, L = X will occur, but these are events, not deterministic cases. The
argument would fall apart if if were written carefully using conditional probability.

Covariance properties can also be a helpful tool for finding variances, especially when
the r.v. of interest is a sum of dependent random variables. The next example uses
properties of covariance to derive the variance of the Hypergeometric distribution.
If you did Exercise 48 from Chapter 4, you can compare the two derivations.


Joint distributions                                                                 331

Example 7.3.8 (Hypergeometric variance). Find Var(X) for X ∼ HGeom(w, b, n).
Solution:
Interpret X as the number of white balls in a sample of size n from an urn with w
white and b black balls. We can represent X as a sum of indicator random variables,
X = I1 + · · · + In , where Ij is the indicator of the jth ball in the sample being
white. Each Ij has mean p = w/(w + b) and variance p(1 − p), but because the Ij
are dependent, we cannot simply add their variances. Instead, we apply properties
of covariance:
                                       
                                 Xn
                Var(X) = Var        Ij 
                                    j=1
                                                              X
                          = Var(I1 ) + · · · + Var(In ) + 2         Cov(Ii , Ij )
                                                              i<j
                                             
                                             n
                          = np(1 − p) + 2       Cov(I1 , I2 ),
                                             2
            
since all n2 pairs of indicators have the same covariance by symmetry. Now we just
need to find Cov(I1 , I2 ). By the fundamental bridge,

Cov(I1 , I2 ) = E(I1 I2 ) − E(I1 )E(I2 )
            = P (1st and 2nd balls both white) − P (1st ball white)P (2nd ball white)
                w       w−1
            =        ·          − p2 .
              w+b w+b−1

Plugging this into the above formula and simplifying, we eventually obtain

                                           N −n
                               Var(X) =         np(1 − p),
                                           N −1

where N = w + b. This differs from the Binomial variance of np(1 − p) by a factor
     −n
of N
   N −1 , which is known as the finite population correction. The discrepancy arises
from the fact that in the Binomial story, we sample with replacement, so the same
ball can be drawn multiple times; in the Hypergeometric story, we sample without
replacement, so each ball appears in the sample at most once.
If we consider N to be the “population size” of the urn, then as N grows very large
relative to the sample size n, it becomes extremely unlikely that in sampling with
replacement, we would draw the same ball more than once. Thus sampling with
replacement and sampling without replacement become equivalent in the limit as
N → ∞ with n fixed, and the finite population correction approaches 1.
The other case where sampling with and without replacement are equivalent is
the simple case where we only draw one ball from the urn, and indeed, the finite
population correction also equals 1 when n = 1.                               


332                                                                 Introduction to Probability

The last two sections in this chapter introduce the Multinomial and Multivariate
Normal distributions. The Multinomial is the most famous discrete multivariate dis-
tribution, and the Multivariate Normal is the most famous continuous multivariate
distribution.




7.4    Multinomial

The Multinomial distribution is a generalization of the Binomial. Whereas the Bi-
nomial distribution counts the successes in a fixed number of trials that can only be
categorized as success or failure, the Multinomial distribution keeps track of trials
whose outcomes can fall into multiple categories, such as excellent, adequate, poor;
or red, yellow, green, blue.
Story 7.4.1 (Multinomial distribution). Each of n objects is independently placed
into one of k categories. An object is placed into category j with probability pj ,
                                        P
where the pj are nonnegative and kj=1 pj = 1. Let X1 be the number of objects in
category 1, X2 the number of objects in category 2, etc., so that X1 + · · · + Xk = n.
Then X = (X1 , . . . , Xk ) is said to have the Multinomial distribution with parameters
n and p = (p1 , . . . , pk ). We write this as X ∼ Multk (n, p).                      
We call X a random vector because it is a vector of random variables. The joint
PMF of X can be derived from the story.
Theorem 7.4.2 (Multinomial joint PMF). If X ∼ Multk (n, p), then the joint PMF
of X is
                                                          n!
                   P (X1 = n1 , . . . , Xk = nk ) =                    · pn1 pn2 . . . pnk k ,
                                                    n1 !n2 ! . . . nk ! 1 2
for n1 , . . . , nk satisfying n1 + · · · + nk = n.

Proof. If n1 , . . . , nk don’t add up to n, then the event {X1 = n1 , . . . , Xk = nk } is
impossible: every object has to go somewhere, and new objects can’t appear out of
nowhere. If n1 , . . . , nk do add up to n, then any particular way of putting n1 objects
into category 1, n2 objects into category 2, etc., has probability pn1 1 pn2 2 . . . pnk k , and
there are
                                               n!
                                         n1 !n2 ! . . . nk !
ways to do this, as discussed in Example 1.4.18 in the context of rearranging the
letters in STATISTICS. So the joint PMF is as claimed.                                         

Since we’ve specified the joint distribution of X, we have enough information to
determine the marginal and conditional distributions, as well as the covariance
between any two components of X.
Let’s take these one by one, starting with the marginal distribution of Xj , which is


Joint distributions                                                                       333

the jth component of X. Were we to blindly apply the definition, we would have
to sum the joint PMF over all components of X other than Xj . The prospect of
k − 1 summations is an unpleasant one, to say the least. Fortunately, we can avoid
tedious calculations if we instead use the story of the Multinomial distribution: Xj
is the number of objects in category j, where each of the n objects independently
belongs to category j with probability pj . Define success as landing in category j.
Then we just have n independent Bernoulli trials, so the marginal distribution of
Xj is Bin(n, pj ).
Theorem 7.4.3 (Multinomial marginals). The marginals of a Multinomial are
Binomial. Specifically, if X ∼ Multk (n, p), then Xj ∼ Bin(n, pj ).
More generally, whenever we merge multiple categories together in a Multinomial
random vector, we get another Multinomial random vector. For example, suppose
we randomly sample n people in a country with 5 political parties. (If the sampling
is done without replacement, the n trials are not independent, but independence is
a good approximation as long as the population is large relative to the sample, as
we discussed in Theorem 3.9.3 and Example 7.3.8.) Let

                       X = (X1 , . . . , X5 ) ∼ Mult5 (n, (p1 , . . . , p5 ))

represent the political party affiliations of the sample, i.e., Xj is the number of
people in the sample who support party j.
Suppose that parties 1 and 2 are the dominant parties, while parties 3 through 5 are
minor third parties. If we decide that instead of keeping track of all 5 parties, we
only want to count the number of people in party 1, party 2, or “other”, then we can
define a new random vector that lumps all the third parties into one category:

                               Y = (X1 , X2 , X3 + X4 + X5 ).

By the story of the Multinomial,

                           Y ∼ Mult3 (n, (p1 , p2 , p3 + p4 + p5 )).


Of course, this idea applies to merging categories in any Multinomial, not just in
the context of political parties.
Theorem 7.4.4 (Multinomial lumping). If X ∼ Multk (n, p), then for any distinct
i and j, Xi + Xj ∼ Bin(n, pi + pj ). The random vector of counts obtained from
merging categories i and j is still Multinomial. For example, merging categories 1
and 2 gives

              (X1 + X2 , X3 , . . . , Xk ) ∼ Multk−1 (n, (p1 + p2 , p3 , . . . , pk )).


Now for the conditional distributions. Suppose we get to observe X1 , the number of


334                                                                      Introduction to Probability

objects in category 1, and we wish to update our distribution for the other categories
(X2 , . . . , Xk ). One way to do this is with the definition of conditional PMF:
                                                    P (X1 = n1 , X2 = n2 , . . . , Xk = nk )
       P (X2 = n2 , . . . , Xk = nk |X1 = n1 ) =                                             .
                                                                P (X1 = n1 )
The numerator is the joint PMF of the Multinomial, and the denominator is the
marginal PMF of X1 , both of which we have already derived. However, we prefer
to use the Multinomial story to deduce the conditional distribution of (X2 , . . . , Xk )
without algebra. Given that there are n1 objects in category 1, the remaining n − n1
objects fall into categories 2 through k, independently of one another. By Bayes’
rule, the conditional probability of falling into category j is
                                                     P (in category j)           pj
      P (in category j|not in category 1) =                              =                 ,
                                                   P (not in category 1)   p2 + · · · + pk
for j = 2, . . . , k. This makes intuitive sense: the updated probabilities are pro-
portional to the original probabilities (p2 , . . . , pk ), but these must be renormalized
to yield a valid probability vector. Putting it all together, we have the following
result.
Theorem 7.4.5 (Multinomial conditioning). If X ∼ Multk (n, p), then
                 (X2 , . . . , Xk ) X1 = n1 ∼ Multk−1 (n − n1 , (p02 , . . . , p0k )),
where p0j = pj /(p2 + · · · + pk ).
Finally, we know that components within a Multinomial random vector are de-
pendent since they are constrained by X1 + · · · + Xk = n. To find the covariance
between Xi and Xj , we can use the marginal and lumping properties we have just
discussed.
Theorem 7.4.6 (Covariance in a Multinomial). Let (X1 , . . . , Xk ) ∼ Multk (n, p),
where p = (p1 , . . . , pk ). For i 6= j, Cov(Xi , Xj ) = −npi pj .

Proof. For concreteness, let i = 1 and j = 2. Using the lumping property and
the marginal distributions of a Multinomial, we know X1 + X2 ∼ Bin(n, p1 + p2 ),
X1 ∼ Bin(n, p1 ), and X2 ∼ Bin(n, p2 ). Therefore
                  Var(X1 + X2 ) = Var(X1 ) + Var(X2 ) + 2Cov(X1 , X2 )
becomes
        n(p1 + p2 )(1 − (p1 + p2 )) = np1 (1 − p1 ) + np2 (1 − p2 ) + 2Cov(X1 , X2 ).
Solving for Cov(X1 , X2 ) gives Cov(X1 , X2 ) = −np1 p2 . By the same logic, for i 6= j,
we have Cov(Xi , Xj ) = −npi pj .
The components are negatively correlated, as we would expect: if we know there
are a lot of objects in category i, then there aren’t as many objects left over that
could possibly be in category j. Exercise 65 asks for a different proof of this result,
using indicators.                                                                    


Joint distributions                                                                  335

h 7.4.7 (Independent trials but dependent components). The k components of
a Multinomial are dependent, but the n objects in the story of the Multinomial
are independently categorized. In the extreme case k = 2, a Multk (n, p) ran-
dom vector looks like (X, n − X) with X ∼ Bin(n, p1 ), which we can think of as
(number of successes, number of failures), where “success” is defined as getting cat-
egory 1. The number of successes is perfectly negatively correlated with the number
of failures, even though the trials are independent.
We conclude this section with a heroic example that ties together many of the most
important concepts for the Multinomial.
Example 7.4.8 (Statwoman). The superhero Statwoman uses probability and
statistics to fight crime. She has battled with countless foes, sometimes even fight-
ing several at the same time. For simplicity though, assume that each of her battles
is with exactly one of the following adversaries: the Confounder, the Extrapolator,
and the Overfitter.
Suppose that Statwoman will have n battles next year (with n a positive integer),
and that each battle is with the Confounder with probability p1 , the Extrapolator
with probability p2 , and the Overfitter with probability p3 , independently. Here
p1 , p2 , p3 are nonnegative and sum to 1. Let X1 , X2 , X3 be the numbers of battles
Statwoman will have with the Confounder, the Extrapolator, and the Overfitter
next year, respectively.
(a) Find the joint distribution of X1 , X2 , X3 .
(b) Find the correlation between X1 and X2 .
(c) Suppose for this part only that it turns out that the Extrapolator and the
Overfitter have been devising evil plots together, so it is of interest to study their
combined number of skirmishes with Statwoman. Let X23 = X2 +X3 . Find the joint
distribution of X1 , X23 .
(d) Suppose for this part only that the parameters p1 , p2 , p3 are unknown, n = 360,
and it is observed that exactly 36 of Statwoman’s battles are with the Overfitter. A
natural way to estimate p3 would be to use 36/360 = 0.1. The maximum likelihood
estimate (MLE) of p3 is the value of p3 that makes the observed data, X3 = 36, as
likely as possible. That is, the MLE is the value of p3 that maximizes P (X3 = 36).
Show that the MLE is the natural estimate, 0.1.
(e) Assume for this part only that the Overfitter has been captured, through heroic
efforts! So assume that all of Statwoman’s battles next year will be with one of her
other two adversaries. Find the joint PMF of X1 , X2 , given that X3 = 0.
(f) Now suppose that, instead of the number of battles being a constant n, the
number of battles is N ∼ Pois(λ). Find the joint distribution of X1 , X2 , X3 .
Solution:
(a) By the story of the Multinomial, (X1 , X2 , X3 ) ∼ Mult3 (n, (p1 , p2 , p3 )).


336                                                              Introduction to Probability

(b) We have X1 ∼ Bin(n, p1 ), X2 ∼ Bin(n, p2 ), and Cov(X1 , X2 ) = −np1 p2 , so
                                                                 r
                  Cov(X1 , X2 )            −np1 p2                       p1 p2
Corr(X1 , X2 ) =                = p                            =−                      .
                 SD(X1 )SD(X2 )     np1 (1 − p1 )np2 (1 − p2 )     (1 − p 1 )(1 − p2 )



(c) By the lumping property of the Multinomial,

                         (X1 , X23 ) ∼ Mult2 (n, (p1 , p2 + p3 )).


(d) In general for X ∼ Bin(n, p), if X = x is observed then the MLE of p is the
value of p that maximizes the function
                                     
                                     n x
                            L(p) =      p (1 − p)n−x .
                                     x

(The function L is called the likelihood function in statistics. It is the probability of
the data, regarded as a function of the parameter with the data treated as fixed.)
As if often the case when dealing with a product of positive numbers, it is helpful
to take the log. It is equivalent to find the value p̂ that maximizes
                                  
                                   n
                  log L(p) = log        + x log p + (n − x) log(1 − p),
                                   x

since log is a continuous, strictly increasing function. Setting the derivative of
log L(p) (with respect to p, holding x constant) equal to 0, we have

                                     x n−x
                                        −        = 0,
                                     p̂   1 − p̂

which rearranges to p̂ = x/n. We have found a maximum since the second derivative
of log L(p) is
                                  x     n−x
                               − 2−             < 0.
                                 p     (1 − p)2
So the MLE of p3 is p̂3 = 36/360 = 0.1.
(e) By the result on Multinomial conditioning,
                                                                       
                                                          p1      p2
               (X1 , X2 )|(X3 = 0) ∼ Mult2 n,                 ,               .
                                                       p1 + p2 p1 + p2


(f) Reasoning as in the chicken-egg story,
                                     ∞
                                     X
P (X1 = x1 , X2 = x2 , X3 = x3 ) =         P (X1 = x1 , X2 = x2 , X3 = x3 |N = n)P (N = n),
                                     n=0


Joint distributions                                                                               337

where all terms of the sum are 0 except the term with n = x1 + x2 + x3 . For this
value of n,

 P (X1 = x1 , X2 = x2 , X3 = x3 ) = P (X1 = x1 , X2 = x2 , X3 = x3 |N = n)P (N = n)
                                         n!                               λn
                                   =              px1 1 px2 2 px3 3 · e−λ
                                     x1 !x2 !x3 !                         n!
                                     e −λp 1
                                             (λp1 ) x 1
                                                            e −λp   2
                                                                      (λp2 )x2 e−λp3 (λp3 )x3
                                   =                     ·                    ·               ,
                                            x1 !                     x2 !           x3 !
for all nonnegative integers x1 , x2 , x3 . Therefore, X1 , X2 , X3 are independent, with
Xj ∼ Pois(λpj ). This result is a Multinomial extension of the chicken-egg story. 




7.5    Multivariate Normal

The Multivariate Normal is a continuous multivariate distribution that generalizes
the Normal distribution into higher dimensions. We will not work with the rather
unwieldy joint PDF of the Multivariate Normal. Instead we define the Multivariate
Normal by its relationship to the ordinary Normal.
Definition 7.5.1 (Multivariate Normal distribution). A k-dimensional random vec-
tor X = (X1 , . . . , Xk ) is said to have a Multivariate Normal (MVN) distribution if
every linear combination of the Xj has a Normal distribution. That is, we require

                                    t1 X1 + · · · + tk Xk

to have a Normal distribution for any constants t1 , . . . , tk . If t1 X1 + · · · + tk Xk is
a constant (such as when all ti = 0), we consider it to have a Normal distribution,
albeit a degenerate Normal with variance 0. An important special case is k = 2;
this distribution is called the Bivariate Normal (BVN).
If (X1 , . . . , Xk ) is MVN, then the marginal distribution of X1 is Normal, since we can
take t1 to be 1 and all other tj to be 0. Similarly, the marginal distribution of each Xj
is Normal. However, the converse is false: it is possible to have Normally distributed
r.v.s X1 , . . . , Xk such that (X1 , . . . , Xk ) is not Multivariate Normal.
Example 7.5.2 (Non-example of MVN). Here is an example of two r.v.s whose
marginal distributions are Normal but whose joint distribution is not Bivariate
Normal. Let X ∼ N (0, 1), and let
                            
                               1  with probability 1/2
                        S=
                               −1 with probability 1/2

be a random sign independent of X. Then Y = SX is a standard Normal r.v., due to
the symmetry of the Normal distribution (see Exercise 30 from Chapter 5). However,


338                                                               Introduction to Probability

(X, Y ) is not Bivariate Normal because P (X + Y = 0) = P (S = −1) = 1/2, which
implies that X + Y can’t be Normal (or, for that matter, have any continuous
distribution). Since X + Y is a linear combination of X and Y that is not Normally
distributed, (X, Y ) is not Bivariate Normal.                                   
                                                i.i.d.
Example 7.5.3 (Actual MVN). For Z, W ∼ N (0, 1), (Z, W ) is Bivariate Normal
because the sum of independent Normals is Normal. Also, (Z + 2W, 3Z + 5W ) is
Bivariate Normal, since an arbitrary linear combination

                               t1 (Z + 2W ) + t2 (3Z + 5W )

can also be written as a linear combination of Z and W ,

                               (t1 + 3t2 )Z + (2t1 + 5t2 )W,

which is Normal.                                                                           
The above example showed that if we start with a Multivariate Normal and take
linear combinations of the components, we form a new Multivariate Normal. The
next two theorems state that we can also produce new MVNs from old MVNs with
the operations of subsetting and concatenation.
Theorem 7.5.4. If (X1 , X2 , X3 ) is Multivariate Normal, then so is the subvector
(X1 , X2 ).

Proof. Any linear combination t1 X1 +t2 X2 can be thought of as a linear combination
of X1 , X2 , X3 where the coefficient of X3 is 0. So t1 X1 + t2 X2 is Normal for all t1 , t2 ,
which shows that (X1 , X2 ) is MVN.                                                        
Theorem 7.5.5. If X = (X1 , . . . , Xn ) and Y = (Y1 , . . . , Ym ) are Multivariate
Normal random vectors with X independent of Y, then the concatenated random
vector W = (X1 , . . . , Xn , Y1 , . . . , Ym ) is Multivariate Normal.

Proof. Any linear combination s1 X1 +· · ·+sn Xn +t1 Y1 +· · ·+tm Ym is Normal since
s1 X1 + · · · + sn Xn and t1 Y1 + · · · + tm Ym are Normal (by definition of MVN) and
are independent, so their sum is Normal (as shown in Chapter 6 using MGFs). 

A Multivariate Normal distribution is fully specified by knowing the mean of each
component, the variance of each component, and the covariance or correlation be-
tween any two components. Another way to say this is that the parameters of an
MVN random vector (X1 , . . . , Xk ) are as follows:
• the mean vector (µ1 , . . . , µk ), where E(Xj ) = µj ;
• the covariance matrix, which is the k × k matrix of covariances between compo-
  nents, arranged so that the row i, column j entry is Cov(Xi , Xj ).
For example, in order to fully specify a Bivariate Normal distribution for (X, Y ),
we need to know five parameters:


Joint distributions                                                                       339

• the means E(X), E(Y );
• the variances Var(X), Var(Y );
• the correlation Corr(X, Y ).
We will show in Example 8.1.10 that the joint PDF of a Bivariate Normal (X, Y )
with N (0, 1) marginal distributions and correlation ρ ∈ (−1, 1) is
                                                                
                                   1          1    2    2
                    fX,Y (x, y) =     exp − 2 (x + y − 2ρxy) ,
                                  2πτ        2τ
            p
with τ = 1 − ρ2 . Figure 7.10 plots the joint PDFs for two different Bivariate
Normal distributions with N (0, 1) marginals, along with the corresponding contour
plots. On the left, X and Y are uncorrelated, so the level curves of the joint PDF
are circles. On the right, X and Y have a correlation of 0.75, so the level curves are
ellipsoidal, reflecting the fact that Y tends to be large when X is large.
Just as the distribution of an r.v. is determined by its CDF, PMF/PDF, or MGF,
the joint distribution of a random vector is determined by its joint CDF, joint
PMF/PDF, or joint MGF, which we now define.
Definition 7.5.6 (Joint MGF). The joint moment generating function (joint MGF)
of a random vector X = (X1 , . . . , Xk ) is the function M defined by
                                      0                      
                      M (t) = E(et X ) = E et1 X1 +···+tk Xk ,

for t = (t1 , . . . , tk ) ∈ Rk . We require this expectation to be finite in a box containing
the origin in Rk ; otherwise we say the joint MGF does not exist.
For a Multivariate Normal random vector, the joint MGF is particularly nice because
the term in the exponent, t1 X1 + · · · + tk Xk , is a Normal r.v. by definition. This
means we can use what we know about the univariate Normal MGF to find the
Multivariate Normal joint MGF! Recall that for any Normal r.v. W ,
                                                    1
                                E(eW ) = eE(W )+ 2 Var(W ) .

Therefore the joint MGF of a Multivariate Normal (X1 , . . . , Xk ) is
                                                                                        
     t1 X1 +···+tk Xk                                        1
 E(e                  ) = exp t1 E(X1 ) + · · · + tk E(Xk ) + Var(t1 X1 + · · · + tk Xk ) .
                                                             2

The variance term can be expanded using properties of covariance.
We know that in general, independence is a stronger condition than zero correlation;
r.v.s can be uncorrelated but not independent. A special property of the Multivariate
Normal distribution is that for r.v.s whose joint distribution is MVN, independence
and zero correlation are equivalent conditions.
Theorem 7.5.7. Within an MVN random vector, uncorrelated implies indepen-
dent. That is, if X ∼ MVN can be written as X = (X1 , X2 ), where X1 and X2 are


340                                                                                                                            Introduction to Probability




      0.15
                                                                                          0.20
      0.10                                                                                0.15
                                                                                          0.10
      0.05
                                                                                          0.05
                                                                                              0.00
         3                                                                                       3
                 2                                                                                   2
                     1                                                                                   1
                         0                                                                                   0
                                                                                      3                                                                                   3
                     y




                                                                                                         y
                             −1                                                   2                              −1                                                   2
                                                                          1                                                                                   1
                                  −2                              0                                                   −2                              0
                                                             −1       x                                                                          −1       x
                                                    −2                                                                                  −2
                                       −3 −3                                                                               −3 −3




             2                                                                                   2


             1                                                                                   1


             0                                                                                   0
 y




                                                                                          y




        −1                                                                                     −1


        −2                                                                                     −2



                                  −2           −1        0        1           2                                       −2           −1        0        1           2
                                                         x                                                                                   x


FIGURE 7.10
Joint PDFs of two Bivariate Normal distributions, and the corresponding contour
plots. On the left, X and Y are marginally N (0, 1) and have zero correlation. On
the right, X and Y are marginally N (0, 1) and have correlation 0.75.


Joint distributions                                                                                       341

subvectors, and every component of X1 is uncorrelated with every component of
X2 , then X1 and X2 are independent.1
In particular, if (X, Y ) is Bivariate Normal and Corr(X, Y ) = 0, then X and Y are
independent.

Proof. We will prove this theorem in the case of a Bivariate Normal; the proof in
higher dimensions is analogous. Let (X, Y ) be Bivariate Normal with E(X) = µ1 ,
E(Y ) = µ2 , Var(X) = σ12 , Var(Y ) = σ22 , and Corr(X, Y ) = ρ. The joint MGF is
                                                                  
                      sX+tY                         1
    MX,Y (s, t) = E(e        ) = exp sµ1 + tµ2 + Var(sX + tY )
                                                    2
                                                                            
                                                    1 2 2      2 2
                               = exp sµ1 + tµ2 + (s σ1 + t σ2 + 2stσ1 σ2 ρ) .
                                                    2

If ρ = 0, the joint MGF reduces to
                                                             
                                               1 2 2     2 2
                  MX,Y (s, t) = exp sµ1 + tµ2 + (s σ1 + t σ2 ) .
                                               2

But this is also the joint MGF of (Z, W ) where Z ∼ N (µ1 , σ12 ) and W ∼ N (µ2 , σ22 )
and Z is independent of W . Since the joint MGF determines the joint distribution,
it must be that (X, Y ) has the same joint distribution as (Z, W ). Therefore X and
Y are independent.                                                                  

This theorem does not apply to Example 7.5.2. In that example, as you can verify,
X and Y are uncorrelated and not independent, but this does not contradict the
theorem because (X, Y ) is not BVN. The next two examples show situations where
the theorem does apply.
                                                                                       i.i.d.
Example 7.5.8 (Independence of sum and difference). Let X, Y ∼ N (0, 1). Find
the joint distribution of (X + Y, X − Y ).
Solution:
Since (X + Y, X − Y ) is Bivariate Normal and

       Cov(X + Y, X − Y ) = Var(X) − Cov(X, Y ) + Cov(Y, X) − Var(Y ) = 0,

X + Y is independent of X − Y . Furthermore, they are i.i.d. N (0, 2). By the same
method, we have that if X ∼ N (µ1 , σ 2 ) and Y ∼ N (µ2 , σ 2 ) are independent (with
the same variance), then X + Y is independent of X − Y .
It can be shown that the independence of the sum and difference is a unique char-
acteristic of the Normal! That is, if X and Y are i.i.d. and X + Y is independent of
X − Y , then X and Y must have Normal distributions.
   1
    Independence of random vectors is defined analogously to independence of random variables.
In particular, if Xi has joint PDF fXi , then it says that fX (x1 , x2 ) = fX1 (x1 )fX2 (x2 ) for all x1 , x2 .


342                                                                Introduction to Probability

In Exercise 72, you’ll extend this example to the case where X and Y are Bivariate
Normal with general correlation ρ.                                              
Example 7.5.9 (Independence of sample mean and sample variance). Let
X1 , . . . , Xn be i.i.d. N (µ, σ 2 ), with n ≥ 2. Define

                                      1
                               X̄n =    (X1 + · · · + Xn ),
                                      n
                                             n
                                         1 X
                                Sn2 =           (Xj − X̄n )2 .
                                      n−1
                                               j=1


As shown in Chapter 6, the sample mean X̄n has expectation µ (the true mean)
and the sample variance Sn2 has expectation σ 2 (the true variance). Show that X̄n
and Sn2 are independent by applying MVN ideas to (X̄n , X1 − X̄n , . . . , Xn − X̄n ).
Solution:
The vector (X̄n , X1 − X̄n , . . . , Xn − X̄n ) is MVN since any linear combination of
its components can be written as a linear combination of X1 , . . . , Xn . Furthermore,
E(Xj − X̄n ) = 0 by linearity. Now we compute the covariance of X̄n with Xj − X̄n :

                   Cov(X̄n , Xj − X̄n ) = Cov(X̄n , Xj ) − Cov(X̄n , X̄n ).

For Cov(X̄n , Xj ), we can expand out X̄n , and most of the terms cancel due to
independence:
                                                            
                       1             1                1          1           σ2
Cov(X̄n , Xj ) = Cov     X1 + · · · + Xn , Xj = Cov     Xj , Xj = Var(Xj ) =    .
                       n             n                n          n            n

For Cov(X̄n , X̄n ), we use properties of variance:

                                            1                                  σ2
            Cov(X̄n , X̄n ) = Var(X̄n ) =      (Var(X1 ) + · · · + Var(Xn )) =    .
                                            n2                                 n

Therefore Cov(X̄n , Xj − X̄n ) = 0, which means X̄n is uncorrelated with every com-
ponent of (X1 − X̄n , . . . , Xn − X̄n ). Since uncorrelated implies independent within an
MVN vector, we have that X̄n is independent of the vector (X1 − X̄n , . . . , Xn − X̄n ).
But Sn2 is a function of (X1 − X̄n , . . . , Xn − X̄n ), so X̄n is also independent of Sn2 .
It can be shown that the independence of the sample mean and variance is another
unique characteristic of the Normal! If the Xj followed any other distribution, then
X̄n and Sn2 would be dependent.                                                   
Example 7.5.10 (Bivariate Normal generation). Suppose that we have access to
i.i.d. random variables X, Y ∼ N (0, 1), but want to generate a Bivariate Normal
random vector (Z, W ) with Corr(Z, W ) = ρ and Z, W marginally N (0, 1), for the
purpose of running a simulation. How can we construct Z and W from linear com-
binations of X and Y ?


Joint distributions                                                                  343

Solution:
By definition of Multivariate Normal, any (Z, W ) of the form

                                     Z = aX + bY
                                    W = cX + dY

will be Bivariate Normal. So let’s try to find suitable a, b, c, d. The means are already
0. Setting the variances equal to 1 gives

                               a2 + b2 = 1, c2 + d2 = 1.

Setting the covariance of Z and W equal to ρ gives

                                      ac + bd = ρ.

There are more unknowns than equations here, and we just need one solution. To
simplify, let’s look for a solution with b = 0. Then a2 = 1, so let’s take a = 1. Now
ac + bd = ρ reduces to c = ρ, and then we can use c2 + d2 = 1 to find a suitable d.
Putting everything together, we can generate (Z, W ) as

                                 Z=X
                                             p
                                W = ρX +         1 − ρ2 Y.

Note that in the extreme case ρ = 1 (known as perfect positive correlation) this says
to let W = Z ∼ N (0, 1), in the extreme case ρ = −1 (known as perfect negative
correlation) it says to let W = −Z with Z ∼ N (0, 1), and in the simple case ρ = 0
it says to just let (Z, W ) = (X, Y ).                                             




7.6    Recap

Joint distributions allow us to describe the behavior of multiple random variables
that arise from the same experiment. Important functions associated with a joint
distribution are the joint CDF, joint PMF/PDF, marginal PMF/PDF, and condi-
tional PMF/PDF. The table on the next page summarizes these definitions for two
discrete r.v.s and two continuous r.v.s. Joint distributions can also be a hybrid of
discrete and continuous, in which case we mix and match PMFs and PDFs.


344                                                                                Introduction to Probability




                           Two discrete r.v.s                                 Two continuous r.v.s

Joint CDF             FX,Y (x, y) = P (X ≤ x, Y ≤ y)                       FX,Y (x, y) = P (X ≤ x, Y ≤ y)


                                                                                                2
                                                                                          ∂
Joint                          P (X = x, Y = y)                            fX,Y (x, y) = ∂x∂y FX,Y (x, y)
PMF/PDF
               • Joint PMF is nonnegative.                         • Joint PDF is nonnegative.
               • Joint PMF sums to 1.                              • Joint PDF integrates to 1.
                                                                                       ZZ
                                   PP
               • P ((X, Y ) ∈ A) =    P (X = x, Y = y).            • P ((X, Y ) ∈ A) =    fX,Y (x, y)dxdy.
                                      (x,y)∈A
                                                                                           A


                               X                                                     Z ∞
                P (X = x) =         P (X = x, Y = y)                      fX (x) =         fX,Y (x, y)dy
Marginal                        y                                                    −∞
                               X                                                     Z ∞
PMF/PDF                   =         P (X = x|Y = y)P (Y = y)                    =          fX|Y (x|y)fY (y)dy
                                y                                                    −∞




                                      P (X = x, Y = y)                                   fX,Y (x, y)
               P (Y = y|X = x) =                                           fY |X (y|x) =
Conditional                              P (X = x)                                         fX (x)
PMF/PDF                               P (X = x|Y = y)P (Y = y)                           fX|Y (x|y)fY (y)
                                    =                                                  =
                                             P (X = x)                                        fX (x)


Independence      P (X ≤ x, Y ≤ y) = P (X ≤ x)P (Y ≤ y)               P (X ≤ x, Y ≤ y) = P (X ≤ x)P (Y ≤ y)
                  P (X = x, Y = y) = P (X = x)P (Y = y)                      fX,Y (x, y) = fX (x)fY (y)
                              for all x and y.                                    for all x and y.


                               XX                                                  Z ∞ Z ∞
LOTUS          E(g(X, Y )) =             g(x, y)P (X = x, Y = y)   E(g(X, Y )) =                g(x, y)fX,Y (x, y)dxdy
                                y    x                                               −∞    −∞


Joint distributions                                                                                                                                                                                                                   345

Covariance is a single-number summary of the tendency of two r.v.s to move in the
same direction. If two r.v.s are independent, then they are uncorrelated, but the
converse does not hold. Correlation is a unitless, standardized version of covariance
that is always between −1 and 1.
Two important named multivariate distributions are the Multinomial and Multi-
variate Normal. The Multinomial distribution is a generalization of the Binomial;
a Multk (n, p) random vector counts the number of objects, out of n, that fall into
each of k categories, where p is the vector of probabilities for the k categories.
The Multivariate Normal distribution is a generalization of the Normal; a random
vector is defined to be MVN if any linear combination of its components has a
Normal distribution. A key property of the MVN distribution is that within an
MVN random vector, uncorrelated implies independent.


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




                         −1                                                             2
                                                                                    1
                                                                0
                              −2
                                                        −1          x
                                                 −2
                                   −3
                                        −3




    joint distributions                                                                                                                  random vectors                          events                        numbers

      joint CDF F(x,y)                                                                                     generate                                                            X ≤ x, Y ≤ y      P     P(X ≤ x, Y ≤ y) = F(x,y)
                                                                                                                                              (X,Y)
 joint PMF P(X = x,Y = y)                                                                                                                                                       X+Y<3                       P(X + Y < 3)
       joint PDF f(x,y)
     joint MGF M(s,t)
                                                                                                                                                                                                        E(X), Var(X), P(X ≤ x)
                                                                                                                                                                                                        E(Y), Var(Y), P(Y ≤ y)
                                                                                                                                                function of random vector




                                                                                                                                                                                                         (marginal quantities)


                                                             sum joint PMF or                                                                                                                             Cov(X,Y), Corr(X,Y)
                                                        integrate joint PDF                                                                                                                                (joint quantities)
                                                              over all y to get
                                                        marginal dist. of X
                                                                                                                                                                                              P(Y = y | X = x) = P(X = x, Y = y) / P(X = x)
                                                                                                                                                                                                               E(Y | X = x)
                                                                                                What can
                                                                                                                                                                                                  (quantities based on the conditional
                                                                                                                                                                                                        distribution of Y | X = x)
                                                                                                happen?

        distributions                                        random variables                     events              numbers

                                             generate                                             X≤x        P      P(X ≤ x) = F(x)
                                                                             X
            CDF F                                                                                 X=x                  P(X = x)


                                                                                                                                                                                                        E(X + Y) = E(X) + E(Y)
                PMF

                                                                                                                                             X+Y                            2D LOTUS
                story
                                                                 function of r.v.




  name, parameters


                                                                                                                                                                                                     E(XY) = Cov(X,Y) + E(X)E(Y)
                                                                                                                  E(X), Var(X), SD(X)

                                                                                                                                               XY
                                                                                                                                             g(X,Y)                                                           E(g(X,Y))
                                                                X, X2, X3, …                    LOTUS            E(X), E(X2), E(X3), …
                                                                         g(X)                                          E(g(X))




FIGURE 7.11
Fundamental objects of probability for multivariate distributions. A joint distribu-
tion is determined by a joint CDF, joint PMF/PDF, or joint MGF. A random vector
(X, Y ) gives rise to many useful joint, marginal, and conditional quantities. Using
2D LOTUS, we can find the expected value of a function of X and Y . Summing the
joint PMF or integrating the joint PDF over all y gives the marginal distribution
of X, bringing us back to the case of a one-dimensional distribution.

Figure 7.11 extends our diagram of the fundamental objects of probability to the


346                                                           Introduction to Probability

multivariate setting (taken as bivariate to simplify notation). A joint distribution
can be used to generate random vectors (X, Y ). Various joint, marginal, and con-
ditional quantities can then be studied. Summing the joint PMF or integrating the
joint PDF over all y gives the marginal distribution of X, bringing us back to the
one-dimensional realm.




7.7   R

Multinomial

The functions for the Multinomial distribution are dmultinom (which is the joint
PMF of the Multinomial distribution) and rmultinom (which generates realizations
of Multinomial random vectors). The joint CDF of the Multinomial is a pain to
work with, so it is not built into R.
To use dmultinom, we have to input the value at which to evaluate the joint PMF,
as well as the parameters of the distribution. For example,
x <- c(2,0,3)
n <- 5
p <- c(1/3,1/3,1/3)
dmultinom(x,n,p)
returns the probability P (X1 = 2, X2 = 0, X3 = 3), where
                   X = (X1 , X2 , X3 ) ∼ Mult3 (5, (1/3, 1/3, 1/3)).
Of course, n has to equal sum(x); if we attempted to do dmultinom(x,7,p), R
would report an error.
For rmultinom, the first input is the number of Multinomial random vectors to
generate, and the other inputs are the same. When we typed rmultinom(10,n,p)
with n and p as above, R gave us the following matrix:
0     2     1     3     2      3     1      2     3      4
2     2     2     2     3      0     1      2     0      0
3     1     2     0     0      2     3      1     2      1
Each column of the matrix corresponds to a draw from the Mult3 (5, (1/3, 1/3, 1/3))
distribution. In particular, the sum of each column is 5.


Multivariate Normal

Functions for the Multivariate Normal distribution are located in the package
mvtnorm. Online resources can teach you how to install packages in R for your sys-


Joint distributions                                                             347

tem, but for many systems an easy way is to use the install.packages command,
e.g., by typing install.packages("mvtnorm") to install the mvtnorm package. Af-
ter installing it, load the package with library(mvtnorm). Then dmvnorm can be
used for calculating the joint PDF, and rmvnorm can be used for generating random
vectors. For example, suppose that we want to generate 1000 independent Bivariate
Normal pairs (Z, W ), with correlation ρ = 0.7 and N (0, 1) marginals. To do this,
we can enter the following:

meanvector <- c(0,0)
rho <- 0.7
covmatrix <- matrix(c(1,rho,rho,1), nrow = 2, ncol = 2)
r <- rmvnorm(n = 10^3, mean = meanvector, sigma = covmatrix)

The covariance matrix here is                
                                        1 ρ
                                        ρ 1

because

• Cov(Z, Z) = Var(Z) = 1 (this is the upper left entry),

• Cov(W, W ) = Var(W ) = 1 (this is the lower right entry),

• Cov(Z, W ) = Corr(Z, W )SD(Z)SD(W ) = ρ (this is the other two entries).

Now r is a 1000 × 2 matrix, with each row a BVN random vector. To see these
as points in the plane, we can use plot(r) to make a scatter plot, from which the
strong positive correlation should be clear. To estimate the covariance of Z and W ,
we can use cov(r), which the true covariance matrix.

Example 7.5.10 gives another approach to the BVN generation problem:

rho <- 0.7
tau <- sqrt(1-rho^2)
x <- rnorm(10^3)
y <- rnorm(10^3)
z <- x
w <- rho*x + tau*y

This gives the Z-coordinates in a vector z and the W -coordinates in a vector w.
If we want to put them into one 1000 × 2 matrix as we had above, we can type
cbind(z,w) to bind the vectors together as columns.


Cauchy

We can work with the Cauchy distribution introduced in Example 7.1.25 using
the three functions dcauchy, pcauchy, and rcauchy. Only one input is needed; for
example, dcauchy(0) is the Cauchy PDF evaluated at 0.


348                                                                   Introduction to Probability

For an amusing demonstration of the very heavy tails of the Cauchy distribution,
try creating a histogram of 1000 simulated values of the Cauchy distribution:
hist(rcauchy(1000))
Due to extreme values in the tails of the distribution, this histogram looks nothing
like the PDF of the distribution from which it was generated.




7.8     Exercises

Exercises marked with s have detailed solutions at http://stat110.net.


        Joint, marginal, and conditional distributions
   1.   Alice and Bob arrange to meet for lunch on a certain day at noon. However, neither is
        known for punctuality. They both arrive independently at uniformly distributed times
        between noon and 1 pm on that day. Each is willing to wait up to 15 minutes for the
        other to show up. What is the probability they will meet for lunch that day?
   2.   Alice, Bob, and Carl arrange to meet for lunch on a certain day. They arrive indepen-
        dently at uniformly distributed times between 1 pm and 1:30 pm on that day.

        (a) What is the probability that Carl arrives first?

        For the rest of this problem, assume that Carl arrives first at 1:10 pm, and condition on
        this fact.

        (b) What is the probability that Carl will be waiting alone for more than 10 minutes?

        (c) What is the probability that Carl will have to wait more than 10 minutes until his
        party is complete?

        (d) What is the probability that the person who arrives second will have to wait more
        than 5 minutes for the third person to show up?
   3.   One of two doctors, Dr. Hibbert and Dr. Nick, is called upon to perform a series of
        n surgeries. Let H be the indicator r.v. for Dr. Hibbert performing the surgeries, and
        suppose that E(H) = p. Given that Dr. Hibbert is performing the surgeries, each surgery
        is successful with probability a, independently. Given that Dr. Nick is performing the
        surgeries, each surgery is successful with probability b, independently. Let X be the
        number of successful surgeries.

        (a) Find the joint PMF of H and X.

        (b) Find the marginal PMF of X.

        (c) Find the conditional PMF of H given X = k.
   4.   A fair coin is flipped twice. Let X be the number of Heads in the two tosses, and Y be
        the indicator r.v for the tosses landing the same way.

        (a) Find the joint PMF of X and Y .

        (b) Find the marginal PMFs of X and Y .


Joint distributions                                                                                349

        (c) Are X and Y independent?

        (d) Find the conditional PMFs of Y given X = x and of X given Y = y.
   5.   A fair die is rolled, and then a coin with probability p of Heads is flipped as many times
        as the die roll says, e.g., if the result of the die roll is a 3, then the coin is flipped 3
        times. Let X be the result of the die roll and Y be the number of times the coin lands
        Heads.

        (a) Find the joint PMF of X and Y . Are they independent?

        (b) Find the marginal PMFs of X and Y .

        (c) Find the conditional PMFs of Y given X = x and of Y given X = x.
   6.   A committee of size k is chosen from a group of n women and m men. All possible
        committees of size k are equally likely. Let X and Y be the numbers of women and men
        on the committee, respectively.

        (a) Find the joint PMF of X and Y . Be sure to specify the support.

        (b) Find the marginal PMF of X in two different ways: by doing a computation using
        the joint PMF, and using a story.

        (c) Find the conditional PMF of Y given that X = x.
   7.   A stick of length L (a positive constant) is broken at a uniformly random point X.
        Given that X = x, another breakpoint Y is chosen uniformly on the interval [0, x].

        (a) Find the joint PDF of X and Y . Be sure to specify the support.

        (b) We already know that the marginal distribution of X is Unif(0, L). Check that
        marginalizing out Y from the joint PDF agrees that this is the marginal distribution of
        X.

        (c) We already know that the conditional distribution of Y given X = x is Unif(0, x).
        Check that using the definition of conditional PDFs (in terms of joint and marginal
        PDFs) agrees that this is the conditional distribution of Y given X = x.

        (d) Find the marginal PDF of Y .

        (e) Find the conditional PDF of X given Y = y.
   8.   (a) Five cards are randomly chosen from a standard deck, one at a time with replacement.
        Let X, Y, Z be the numbers of chosen queens, kings, and other cards. Find the joint PMF
        of X, Y, Z.

        (b) Find the joint PMF of X and Y .
        Hint: In summing the joint PMF of X, Y, Z over the possible values of Z, note that most
        terms are 0 because of the constraint that the number of chosen cards is five.

        (c) Now assume instead that the sampling is without replacement (all 5-card hands are
        equally likely). Find the joint PMF of X, Y, Z.
        Hint: Use the naive definition of probability.
   9.   Let X and Y be i.i.d. Geom(p), and N = X + Y .

        (a) Find the joint PMF of X, Y, N .

        (b) Find the joint PMF of X and N .

        (c) Find the conditional PMF of X given N = n, and give a simple description in words
        of what the result says.


350                                                                               Introduction to Probability

  10.   Let X and Y be i.i.d. Expo(λ), and T = X + Y .
        (a) Find the conditional CDF of T given X = x. Be sure to specify where it is zero.
        (b) Find the conditional PDF fT |X (t|x), and verify that it is a valid PDF.
        (c) Find the conditional PDF fX|T (x|t), and verify that it is a valid PDF.
        Hint: This can be done using Bayes’ rule without having to know the marginal PDF of
        T , by recognizing what the conditional PDF is up to a normalizing constant—then the
        normalizing constant must be whatever is needed to make the conditional PDF valid.
        (d) In Example 8.2.4, we will show that the marginal PDF of T is fT (t) = λ2 te−λt , for
        t > 0. Give a short alternative proof of this fact, based on the previous parts and Bayes’
        rule.
  11.   Let X, Y, Z be r.v.s such that X ∼ N (0, 1) and conditional on X = x, Y and Z are
        i.i.d. N (x, 1).
        (a) Find the joint PDF of X, Y, Z.
        (b) By definition, Y and Z are conditionally independent given X. Discuss intuitively
        whether or not Y and Z are also unconditionally independent.
        (c) Find the joint PDF of Y and Z. You can leave your answer as an integral, though
        the integral can be done with some algebra (such as completing the square) and facts
        about the Normal distribution.
  12.   Let X ∼ Expo(λ), and let c be a positive constant.
        (a) If you remember the memoryless property, you already know that the conditional
        distribution of X given X > c is the same as the distribution of c + X (think of waiting
        c minutes for a “success” and then having a fresh Expo(λ) additional waiting time).
        Derive this in another way, by finding the conditional CDF of X given X > c and the
        conditional PDF of X given X > c.
        (b) Find the conditional CDF of X given X < c and the conditional PDF of X given
        X < c.
  13.   Let X and Y be i.i.d. Expo(λ). Find the conditional distribution of X given X < Y in
        two different ways:
        (a) by using calculus to find the conditional PDF.
        (b) without using calculus, by arguing that the conditional distribution of X given
        X < Y is the same distribution as the unconditional distribution of min(X, Y ), and
        then applying an earlier result about the minimum of independent Exponentials.
  14.    s (a) A stick is broken into three pieces by picking two points independently and
        uniformly along the stick, and breaking the stick at those two points. What is the
        probability that the three pieces can be assembled into a triangle?
        Hint: A triangle can be formed from 3 line segments of lengths a, b, c if and only if
        a, b, c ∈ (0, 1/2). The probability can be interpreted geometrically as proportional to
        an area in the plane, avoiding all calculus, but make sure for that approach that the
        distribution of the random point in the plane is Uniform over some region.
        (b) Three legs are positioned uniformly and independently on the perimeter of a round
        table. What is the probability that the table will stand?
  15.   Let X and Y be continuous r.v.s., with joint CDF F (x, y). Show that the probability
        that (X, Y ) falls into the rectangle [a1 , a2 ] × [b1 , b2 ] is
                              F (a2 , b2 ) − F (a1 , b2 ) + F (a1 , b1 ) − F (a2 , b1 ).


Joint distributions                                                                                    351

  16.   Let X and Y have joint PDF

                            fX,Y (x, y) = x + y, for 0 < x < 1 and 0 < y < 1.

        (a) Check that this is a valid joint PDF.

        (b) Are X and Y independent?

        (c) Find the marginal PDFs of X and Y .

        (d) Find the conditional PDF of Y given X = x.
  17.   Let X and Y have joint PDF

                                   fX,Y (x, y) = cxy, for 0 < x < y < 1.


        (a) Find c to make this a valid joint PDF.

        (b) Are X and Y independent?

        (c) Find the marginal PDFs of X and Y .

        (d) Find the conditional PDF of Y given X = x.
  18.    s Let (X, Y ) be a uniformly random point in the triangle in the plane with vertices
        (0, 0), (0, 1), (1, 0). Find the joint PDF of X and Y , the marginal PDF of X, and the
        conditional PDF of X given Y .
  19.   s A random point (X, Y, Z) is chosen uniformly in the ball

                                    B = {(x, y, z) : x2 + y 2 + z 2 ≤ 1}.


        (a) Find the joint PDF of X, Y, Z.

        (b) Find the joint PDF of X, Y .

        (c) Find an expression for the marginal PDF of X, as an integral.
  20.   s Let U1 , U2 , U3 be i.i.d. Unif(0, 1), and let L = min(U1 , U2 , U3 ), M = max(U1 , U2 , U3 ).

        (a) Find the marginal CDF and marginal PDF of M, and the joint CDF and joint PDF
        of L, M .
        Hint: For the latter, start by considering P (L ≥ l, M ≤ m).

        (b) Find the conditional PDF of M given L.
  21.   Find the probability that the quadratic polynomial Ax2 + Bx + 1, where the coefficients
        A and B are determined by drawing i.i.d. Unif(0, 1) random variables, has at least one
        real root.
        Hint: By the quadratic formula, the polynomial ax2 + bx + c has a real root if and only
        if b2 − 4ac ≥ 0.
  22.   Let X and Y each have support (0, ∞) marginally, and suppose that the joint PDF
        fX,Y of X and Y is positive for 0 < x < y and 0 otherwise.

        (a) What is the support of the conditional PDF of Y given X = x?

        (b) Show that X and Y can’t be independent.


352                                                                           Introduction to Probability

  23.   The volume of a region in n-dimensional Euclidean space Rn is the integral of 1 over
        that region. The unit ball in Rn is {(x1 , . . . , xn ) : x21 + · · · + x2n ≤ 1}, the ball of radius
        1 centered at 0. As mentioned in Section A.7 of the math appendix, the volume of the
        unit ball in n dimensions is
                                                         π n/2
                                            vn =                    ,
                                                   Γ(n/2 + 1)
        where Γ is the gamma function, a very famous function which is defined by
                                                   Z ∞
                                                                    dx
                                         Γ(a) =            xa e−x
                                                     0               x
        for all a > 0, and which will play an important role in the next chapter. A few useful
        facts about the gamma function (which you can assume) are that Γ(a + 1) = aΓ(a)
                                                         √
        for any a > 0, and that Γ(1) = 1 and Γ( 12 ) = π. Using these facts, it follows that
        Γ(n) = (n − 1)! for n a positive integer, and we can also find Γ(n + 12 ) when n is a
        nonnegative integer. For practice, verify that v2 = π (the area of the unit disk in 2
        dimensions) and v3 = 43 π (the volume of the unit ball in 3 dimensions).

        Let U1 , U2 , . . . , Un ∼ Unif(−1, 1) be i.i.d.

        (a) Find the probability that (U1 , U2 , . . . , Un ) is in the unit ball in Rn .

        (b) Evaluate the result from (a) numerically for n = 1, 2, . . . , 10, and plot the results
        (using a computer unless you are extremely good at making hand-drawn graphs). The
        facts above about the gamma function are sufficient so that you can do this without
        doing any integrals, but you can also use the command gamma in R to compute the
        gamma function.

        (c) Let c be a constant with 0 < c < 1, and let Xn count how many of the Uj satisfy
        |Uj | > c. What is the distribution of Xn ?
                       √
        (d) For c = 1/ 2, use the result of Part (c) to give a simple, short derivation of what
        happens to the probability from (a) as n → ∞.
  24.    s Two students, A and B, are working independently on homework assignments.
        Student A takes Y1 ∼ Expo(λ1 ) hours to finish their homework, while B takes
        Y2 ∼ Expo(λ2 ) hours.

        (a) Find the CDF and PDF of Y1 /Y2 , the ratio of their problem-solving times.

        (b) Find the probability that A finishes their homework before B does.
  25.   Two companies, Company 1 and Company 2, have just been founded. Stock market
        crashes occur according to a Poisson process with rate λ0 . Such a crash would put both
        companies out of business. For j ∈ {1, 2}, there may be an adverse event of type j, which
        puts Company j out of business (if it is not already out of business) but does not affect
        the other company; such events occur according to a Poisson process with rate λj . If
        there has not been a stock market crash or an adverse event of type j, then Company
        j remains in business. The three Poisson processes are independent of each other. Let
        X1 and X2 be how long Company 1 and Company 2 stay in business, respectively.

        (a) Find the marginal distributions of X1 and X2 .

        (b) Find P (X1 > x1 , X2 > x2 ), and use this to find the joint CDF of X1 and X2 .
  26.    s The bus company from Blissville decides to start service in Blotchville, sensing a
        promising business opportunity. Meanwhile, Fred has moved back to Blotchville. Now
        when Fred arrives at the bus stop, either of two independent bus lines may come by
        (both of which take him home). The Blissville company’s bus arrival times are exactly
        10 minutes apart, whereas the time from one Blotchville company bus to the next is
              1
        Expo( 10 ). Fred arrives at a uniformly random time on a certain day.


Joint distributions                                                                               353

        (a) What is the probability that the Blotchville company bus arrives first?
        Hint: One good way is to use the continuous law of total probability.

        (b) What is the CDF of Fred’s waiting time for a bus?
  27.   A longevity study is being conducted on n married hobbit couples. Let p be the prob-
        ability that an individual hobbit lives at least until their eleventy-first birthday, and
        assume that the lifespans of different hobbits are independent. Let N0 , N1 , N2 be the
        number of couples in which neither hobbit reaches age eleventy-one, one hobbit does
        but not the other, and both hobbits reach eleventy-one, respectively.

        (a) Find the joint PMF of N0 , N1 , N2 .
        For the rest of this problem, suppose that it is observed that exactly h of the cohort of
        hobbits reach their eleventy-first birthdays.
        (b) Using (a) and the definition of conditional probability, find the conditional PMF of
        N2 given this information, up to a normalizing constant (that is, you do not need to
        find the normalizing constant in this part, but just to give a simplified expression that
        is proportional to the conditional PMF). For simplicity, you can and should ignore mul-
        tiplicative constants in this part; this includes multiplicative factors that are functions
        of h, since h is now being treated as a known constant.

        (c) Now obtain the conditional PMF of N2 using a direct counting argument, now
        including any normalizing constants needed in order to have a valid conditional PMF.

        (d) Discuss intuitively whether or not p should appear in the answer to (c).

        (e) What is the conditional expectation of N2 , given the above information (simplify
        fully)? This can be done without doing any messy sums.
  28.   There are n stores in a shopping center, labeled from 1 to n. Let Xi be the number
        of customers who visit store i in a particular month, and suppose that X1 , X2 , . . . , Xn
        are i.i.d. with PMF p(x) = P (Xi = x). Let I ∼ DUnif(1, 2, . . . , n) be the label of a
        randomly chosen store, so XI is the number of customers at a randomly chosen store.

        (a) For i 6= j, find P (Xi = Xj ) in terms of a sum involving the PMF p(x).

        (b) Find the joint PMF of I and XI . Are they independent?

        (c) Does XI , the number of customers for a random store, have the same marginal
        distribution as X1 , the number of customers for store 1?

        (d) Let J ∼ DUnif(1, 2, . . . , n) also be the label of a randomly chosen store, with I and
        J independent. Find P (XI = XJ ) in terms of a sum involving the PMF p(x). How does
        P (XI = XJ ) compare to P (Xi = Xj ) for fixed i, j with i 6= j?
  29.   Let X and Y be i.i.d. Geom(p), L = min(X, Y ), and M = max(X, Y ).

        (a) Find the joint PMF of L and M . Are they independent?

        (b) Find the marginal distribution of L in two ways: using the joint PMF, and using a
        story.

        (c) Find EM .
        Hint: A quick way is to use (b) and the fact that L + M = X + Y .

        (d) Find the joint PMF of L and M − L. Are they independent?


354                                                                    Introduction to Probability

  30.   Let X, Y have the joint CDF

                                F (x, y) = 1 − e−x − e−y + e−(x+y+θxy) ,

        for x > 0, y > 0 (and F (x, y) = 0 otherwise), where the parameter θ is in [0, 1].

        (a) Find the joint PDF of X, Y . For which values of θ (if any) are they independent?

        (b) Explain why we require θ to be in [0, 1].

        (c) Find the marginal PDFs of X and Y by working directly from the joint PDF from
        (a). When integrating, do not use integration by parts or computer assistance; rather,
        pattern-match to facts we know about moments of famous distributions.

        (d) Find the marginal CDFs of X and Y by working directly from the joint CDF.


        2D LOTUS
  31.   s Let X and Y be i.i.d. Unif(0, 1). Find the standard deviation of the distance between
        X and Y .
  32.    s Let X, Y be i.i.d. Expo(λ). Find E|X −Y | in two different ways: (a) using 2D LOTUS
        and (b) using the memoryless property without any calculus.
  33.   Alice walks into a post office with 2 clerks. Both clerks are in the midst of serving
        customers, but Alice is next in line. The clerk on the left takes an Expo(λ1 ) time to
        serve a customer, and the clerk on the right takes an Expo(λ2 ) time to serve a customer.
        Let T be the amount of time Alice has to wait until it is her turn.

        (a) Write down expressions for the mean and variance of T , in terms of double integrals
        (which you do not need to evaluate).

        (b) Find the distribution, mean, and variance of T , without using calculus.
  34.   Let (X, Y ) be a uniformly random point in the triangle in the plane with vertices
        (0, 0), (0, 1), (1, 0). Find Cov(X, Y ). (Exercise 18 is about joint, marginal, and condi-
        tional PDFs in this setting.)
  35.   A random point is chosen uniformly in the unit disk {(x, y) : x2 + y 2 ≤ 1}. Let R be its
        distance from the origin.

        (a) Find E(R) using 2D LOTUS.
        Hint: To do the integral, convert to polar coordinates (see the math appendix).

        (b) Find the CDFs of R2 and of R without using calculus, using the fact that for a
        Uniform distribution on a region, probability within that region is proportional to area.
        Then get the PDFs of R2 and of R, and find E(R) in two more ways: using the definition
        of expectation, and using a 1D LOTUS by thinking of R as a function of R2 .
  36.   Let X and Y be discrete r.v.s.

        (a) Use 2D LOTUS (without assuming linearity) to show that E(X +Y ) = E(X)+E(Y ).

        (b) Now suppose that X and Y are independent. Use 2D LOTUS to show that they are
        uncorrelated, i.e., E(XY ) = E(X)E(Y ).
  37.   Let X and Y be i.i.d. continuous random variables with PDF f , mean µ, and variance
        σ 2 . We know that the expected squared distance of X from its mean is σ 2 , and likewise
        for Y ; this problem is about the expected squared distance of X from Y .

        (a) Use 2D LOTUS to express E(X − Y )2 as a double integral.


Joint distributions                                                                             355

        (b) By expanding (x − y)2 = x2 − 2xy + y 2 and evaluating the double integral from (a),
        show that
                                         E(X − Y )2 = 2σ 2 .

        (c) Give an alternative proof of the result from (b), based on the trick of adding and
        subtracting µ:

              (X − Y )2 = (X − µ + µ − Y )2 = (X − µ)2 − 2(X − µ)(Y − µ) + (Y − µ)2 .


        Covariance
  38.    s Let X and Y be r.v.s. Is it correct to say “max(X, Y ) + min(X, Y ) = X + Y ”? Is it
        correct to say “Cov(max(X, Y ), min(X, Y )) = Cov(X, Y ) since either the max is X and
        the min is Y or vice versa, and covariance is symmetric”? Explain.
  39.    s Two fair, six-sided dice are rolled (one green and one orange), with outcomes X and
        Y for the green die and the orange die, respectively.

        (a) Compute the covariance of X + Y and X − Y .

        (b) Are X + Y and X − Y independent?
  40.   Let X and Y be i.i.d. Unif(0, 1).

        (a) Compute the covariance of X + Y and X − Y .

        (b) Are X + Y and X − Y independent?
  41.    s Let X and Y be standardized r.v.s (i.e., marginally they each have mean 0 and
        variance 1) with correlation ρ ∈ (−1, 1). Find a, b, c, d (in terms of ρ) such that Z =
        aX + bY and W = cX + dY are uncorrelated but still standardized.
  42.    s Let X be the number of distinct birthdays in a group of 110 people (i.e., the number
        of days in a year such that at least one person in the group has that birthday). Under
        the usual assumptions (no February 29, all the other 365 days of the year are equally
        likely, and the day when one person is born is independent of the days when the other
        people are born), find the mean and variance of X.
  43.   (a) Let X and Y be Bernoulli r.v.s, possibly with different parameters. Show that if X
        and Y are uncorrelated, then they are independent.

        (b) Give an example of three Bernoulli r.v.s such that each pair of them is uncorrelated,
        yet the three r.v.s are dependent.
  44.   Find the variance of the number of toys needed until you have a complete set in Exam-
        ple 4.3.12 (the coupon collector problem), as a sum.
  45.   A random triangle is formed in some way, such that all pairs of angles have the same
        joint distribution. What is the correlation between two of the angles (assuming that the
        variance of the angles is nonzero)?
  46.   Each of n ≥ 2 people puts their name on a slip of paper (no two have the same name).
        The slips of paper are shuffled in a hat, and then each person draws one (uniformly at
        random at each stage, without replacement). Find the standard deviation of the number
        of people who draw their own names.
  47.   As in Example 4.4.7, an urn contains w white balls and b black balls. The balls are
        randomly drawn one by one without replacement until r white balls have been drawn.
        Let X ∼ NHGeom(w, b, r) be the number of black balls drawn before drawing the rth
        white ball. In this exercise, you will derive Var(X).
        As explained in Example 4.4.7, we can assume that we continue drawing balls until the


356                                                                        Introduction to Probability

        urn has been emptied out. Label the black balls as 1, 2, . . . , b, and write X = bj=1 Ij ,
                                                                                         P
        where Ij is the indicator of black ball j being drawn before the rth white ball is drawn.
        (a) Show that
                                                              r
                                                  E(Ij ) =       .
                                                             w+1
        (b) Give an intuitive explanation of whether Ii and Ij are positively correlated, uncor-
        related, or negatively correlated, for i 6= j.
        (c) Show that for i 6= j,
                                                   r+1
                                                      
                                                    2       (r + 1)r
                                    E(Ii Ij ) =    w+2 =
                                                                       .
                                                    2
                                                         (w + 2)(w + 1)

        Hint: Imagine w + 2 slots, into which black balls i and j and the w white balls will be
        placed. All orderings for these w + 2 balls are equally likely.
        (d) Find an expression for Var(X). With some algebra (which you don’t have to do),
        your expression should simplify to
                                                  rb(w + b + 1)(w − r + 1)
                                    Var(X) =                               .
                                                      (w + 1)2 (w + 2)

  48.    s Athletes compete one at a time at the high jump. Let Xj be how high the jth
        jumper jumped, with X1 , X2 , . . . i.i.d. with a continuous distribution. We say that the
        jth jumper sets a record if Xj is greater than all of Xj−1 , . . . , X1 .

        Find the variance of the number of records among the first n jumpers (as a sum). What
        happens to the variance as n → ∞?
  49.    s A chicken lays a Pois(λ) number N of eggs. Each egg hatches a chick with probability
        p, independently. Let X be the number which hatch, so X|N = n ∼ Bin(n, p).
        Find the correlation between N (the number of eggs) and X (the number of eggs which
        hatch). Simplify; your final answer should work out to a simple function of p (the λ
        should cancel out).
  50.   Let X1 , . . . , Xn be random variables such that Corr(Xi , Xj ) = ρ for all i 6= j. Show that
                1
        ρ ≥ − n−1    . This is a bound on how negatively correlated a collection of r.v.s can all be
        with each other.
        Hint: Assume Var(Xi ) = 1 for all i; this can be done without loss of generality, since
        rescaling two r.v.s does not affect the correlation between them. Then use the fact that
        Var(X1 + · · · + Xn ) ≥ 0.
  51.   Let X and Y be independent r.v.s. Show that

                      Var(XY ) = Var(X)Var(Y ) + (EX)2 Var(Y ) + (EY )2 Var(X).

        Hint: It is often useful when working with a second moment E(T 2 ) to express it as
        Var(T ) + (ET )2 .
  52.   Stat 110 shirts come in 3 sizes: small, medium, and large. There are n shirts of each
        size (where n ≥ 2). There are 3n students. For each size, n of the students have that
        size as the best fit. This seems ideal. But suppose that instead of giving each student
        the right size shirt, each student is given a shirt completely randomly (all allocations of
        the shirts to the students, with one shirt per student, are equally likely). Let X be the
        number of students who get their right size shirt.

        (a) Find E(X).

        (b) Give each student an ID number from 1 to 3n, such that the right size shirt is small
        for students 1 through n, medium for students n + 1 through 2n, and large for students


Joint distributions                                                                                    357

        2n + 1 through 3n. Let Aj be the event that student j gets their right size shirt. Find
        P (A1 , A2 ) and P (A1 , An+1 ).

        (c) Find Var(X).
  53.    s A drunken man wanders around randomly in a large space. At each step, he moves
        one unit of distance North, South, East, or West, with equal probabilities. Choose
        coordinates such that his initial position is (0, 0) and if he is at (x, y) at some time, then
        one step later he is at (x, y + 1), (x, y − 1), (x + 1, y), or (x − 1, y). Let (Xn , Yn ) and Rn
        be his position and distance from the origin after n steps, respectively.
        General hint: Note that Xn is a sum of r.v.s with possible values −1, 0, 1, and likewise
        for Yn , but be careful throughout the problem about independence.

        (a) Determine whether or not Xn is independent of Yn .
        (b) Find Cov(Xn , Yn ).
                    2
        (c) Find E(Rn ).
  54.    s A scientist makes two measurements, considered to be independent standard Normal
        r.v.s. Find the correlation between the larger and smaller of the values.
        Hint: Note that max(x, y) + min(x, y) = x + y and max(x, y) − min(x, y) = |x − y|.
  55.   Let U ∼ Unif(−1, 1) and V = 2|U | − 1.

        (a) Find the distribution of V (give the PDF and, if it is a named distribution we have
        studied, its name and parameters).
        Hint: Find the support of V , and then find the CDF of V by reducing P (V ≤ v) to
        probability calculations about U .

        (b) Show that U and V are uncorrelated, but not independent. This is also another
        example illustrating the fact that knowing the marginal distributions of two r.v.s does
        not determine the joint distribution.
  56.    s Consider the following method for creating a bivariate Poisson (a joint distribution
        for two r.v.s such that both marginals are Poissons). Let X = V + W, Y = V + Z where
        V, W, Z are i.i.d. Pois(λ) (the idea is to have something borrowed and something new
        but not something old or something blue).

        (a) Find Cov(X, Y ).

        (b) Are X and Y independent? Are they conditionally independent given V ?

        (c) Find the joint PMF of X, Y (as a sum).
  57.   You are playing an exciting game of Battleship. Your opponent secretly positions ships
        on a 10 by 10 grid and you try to guess where the ships are. Each of your guesses is a
        hit if there is a ship there and a miss otherwise.

        The game has just started and your opponent has 3 ships: a battleship (length 4), a
        submarine (length 3), and a destroyer (length 2). (Usually there are 5 ships to start, but
        to simplify the calculations we are considering 3 here.) You are playing a variation in
        which you unleash a salvo, making 5 simultaneous guesses. Assume that your 5 guesses
        are a simple random sample drawn from the 100 grid positions, i.e., all sets of 5 grid
        positions are equally likely.

        Find the mean and variance of the number of distinct ships you will hit in your salvo.
        (Give exact answers in terms of binomial coefficients or factorials, and also numerical
        values computed using a computer.)
        Hint: First work in terms of the number of ships missed, expressing this as a sum of
        indicator r.v.s. Then use the fundamental bridge and naive definition of probability.


358                                                                         Introduction to Probability

  58.   This problem explores a visual interpretation of covariance. Data are collected for n indi-
        viduals, where for each individual two variables are measured (e.g., height and weight).
        Assume independence across individuals (e.g., person 1’s variables gives no information
        about the other people), but not within individuals (e.g., a person’s height and weight
        may be correlated).
        Let (x1 , y1 ), . . . , (xn , yn ) be the n data points, with n ≥ 2. The data are considered here
        as fixed, known numbers—they are the observed values after performing an experiment.
        Imagine plotting all the points (xi , yi ) in the plane, and drawing the rectangle deter-
        mined by each pair of points. For example, the points (1, 3) and (4, 6) determine the
        rectangle with vertices (1, 3), (1, 6), (4, 6), (4, 3).
        The signed area contributed by (xi , yi ) and (xj , yj ) is the area of the rectangle they
        determine if the slope of the line between them is positive, and is the negative of the
        area of the rectangle they determine if the slope of the line between them is negative.
        (Define the signed area to be 0 if xi = xj or yi = yj , since then the rectangle is
        degenerate.) So the signed area is positive if a higher x value goes with a higher y value
        for the pair of points, and negative otherwise. Assume that the xi are all distinct and
        the yi are all distinct.

        (a) The sample covariance of the data is defined to be
                                                   n
                                               1X
                                         r=          (xi − x̄)(yi − ȳ),
                                               n i=1

        where
                                                 n                 n
                                              1X                1X
                                       x̄ =         xi and ȳ =       yi
                                              n i=1             n i=1
        are the sample means. (There are differing conventions about whether to divide by n − 1
        or n in the definition of sample covariance, but that need not concern us here.)
        Let (X, Y ) be one of the (xi , yi ) pairs, chosen uniformly at random. Determine precisely
        how Cov(X, Y ) is related to the sample covariance.

        (b) Let (X, Y ) be as in (a), and (X̃, Ỹ ) be an independent draw from the same distribu-
        tion. That is, (X, Y ) and (X̃, Ỹ ) are randomly chosen from the n points, independently
        (so it is possible for the same point to be chosen twice).
        Express the total signed area of the rectangles as a constant times E((X − X̃)(Y − Ỹ )).
        Then show that the sample covariance of the data is a constant times the total signed
        area of the rectangles.
        Hint: Consider E((X − X̃)(Y − Ỹ )) in two ways: as the average signed area of the random
        rectangle formed by (X, Y ) and (X̃, Ỹ ), and using properties of expectation to relate
        it to Cov(X, Y ). For the former, consider the n2 possibilities for which point (X, Y ) is
        and which point (X̃, Ỹ ); note that n such choices result in degenerate rectangles.

        (c) Based on the interpretation from (b), give intuitive explanations of why for any r.v.s
        W1 , W2 , W3 and constants a1 , a2 , covariance has the following properties:
              (i)   Cov(W1 , W2 ) = Cov(W2 , W1 );
             (ii)   Cov(a1 W1 , a2 W2 ) = a1 a2 Cov(W1 , W2 );
            (iii)   Cov(W1 + a1 , W2 + a2 ) = Cov(W1 , W2 );
            (iv)    Cov(W1 , W2 + W3 ) = Cov(W1 , W2 ) + Cov(W1 , W3 ).
  59.   A statistician is trying to estimate an unknown parameter θ based on some data. She
        has available two independent estimators θ̂1 and θ̂2 (an estimator is a function of the
        data, used to estimate a parameter). For example, θ̂1 could be the sample mean of a
        subset of the data and θ̂2 could be the sample mean of another subset of the data,
        disjoint from the subset used to calculate θ̂1 . Assume that both of these estimators are
        unbiased, i.e., E(θ̂j ) = θ.


Joint distributions                                                                                               359

        Rather than having a bunch of separate estimators, the statistician wants one combined
        estimator. It may not make sense to give equal weights to θ̂1 and θ̂2 since one could be
        much more reliable than the other, so she decides to consider combined estimators of
        the form
                                          θ̂ = w1 θ̂1 + w2 θ̂2 ,
        a weighted combination of the two estimators. The weights w1 and w2 are nonnegative
        and satisfy w1 + w2 = 1.

        (a) Check that θ̂ is also unbiased, i.e., E(θ̂) = θ.

        (b) Determine the optimal weights w1 , w2 , in the sense of minimizing the mean squared
        error E(θ̂ − θ)2 . Express your answer in terms of the variances of θ̂1 and θ̂2 . The optimal
        weights are known as Fisher weights.
        Hint: As discussed in Exercise 53 from Chapter 5, mean squared error is variance plus
        squared bias, so in this case the mean squared error of θ̂ is Var(θ̂). Note that there is
        no need for multivariable calculus here, since w2 = 1 − w1 .

        (c) Give a simple description of what the estimator found in (b) amounts to if the data
        are i.i.d. random variables X1 , . . . , Xn , Y1 , . . . , Ym , θ̂1 is the sample mean of X1 , . . . , Xn ,
        and θ̂2 is the sample mean of Y1 , . . . , Ym .


        Chicken-egg
  60.    s A Pois(λ) number of people vote in a certain election. Each voter votes for candidate
        A with probability p and for candidate B with probability q = 1 − p, independently of
        all the other voters. Let V be the difference in votes, defined as the number of votes for
        A minus the number for B.

        (a) Find E(V ).

        (b) Find Var(V ).
  61.   A traveler gets lost N ∼ Pois(λ) times on a long journey. When lost, the traveler asks
        someone for directions with probability p. Let X be the number of times that the traveler
        is lost and asks for directions, and Y be the number of times that the traveler is lost
        and does not ask for directions.

        (a) Find the joint PMF of N, X, Y . Are they independent?
        (b) Find the joint PMF of N, X. Are they independent?
        (c) Find the joint PMF of X, Y . Are they independent?
  62.   The number of people who visit the Leftorium store in a day is Pois(100). Suppose that
        10% of customers are sinister (left-handed), and 90% are dexterous (right-handed). Half
        of the sinister customers make purchases, but only a third of the dexterous customers
        make purchases. The characteristics and behavior of people are independent, with prob-
        abilities as described in the previous two sentences. On a certain day, there are 42 people
        who arrive at the store but leave without making a purchase. Given this information,
        what is the conditional PMF of the number of customers on that day who make a
        purchase?
  63.   A chicken lays n eggs. Each egg independently does or doesn’t hatch, with probability p
        of hatching. For each egg that hatches, the chick does or doesn’t survive (independently
        of the other eggs), with probability s of survival. Let N ∼ Bin(n, p) be the number of
        eggs which hatch, X be the number of chicks which survive, and Y be the number of
        chicks which hatch but don’t survive (so X + Y = N ). Find the marginal PMF of X,
        and the joint PMF of X and Y . Are X and Y independent?


360                                                                        Introduction to Probability

  64.   There will be X ∼ Pois(λ) courses offered at a certain school next year.

        (a) Find the expected number of choices of 4 courses (in terms of λ, fully simplified),
        assuming that simultaneous enrollment is allowed if there are time conflicts.

        (b) Now suppose that simultaneous enrollment is not allowed. Suppose that most faculty
        only want to teach on Tuesdays and Thursdays, and most students only want to take
        courses that start at 10 am or later, and as a result there are only four possible time
        slots: 10 am, 11:30 am, 1 pm, 2:30 pm (each course meets Tuesday-Thursday for an hour
        and a half, starting at one of these times). Rather than trying to avoid major conflicts,
        the school schedules the courses completely randomly: after the list of courses for next
        year is determined, they randomly get assigned to time slots, independently and with
        probability 1/4 for each time slot.

        Let Xam and Xpm be the number of morning and afternoon courses for next year,
        respectively (where “morning” means starting before noon). Find the joint PMF of
        Xam and Xpm , i.e., find P (Xam = a, Xpm = b) for all a, b.

        (c) Continuing as in (b), let X1 , X2 , X3 , X4 be the number of 10 am, 11:30 am, 1 pm, 2:30
        pm courses for next year, respectively. What is the joint distribution of X1 , X2 , X3 , X4 ?
        (The result is completely analogous to that of Xam , Xpm ; you can derive it by thinking
        conditionally, but for this part you are also allowed to just use the fact that the result
        is analogous to that of (b).) Use this to find the expected number of choices of 4 non-
        conflicting courses (in terms of λ, fully simplified). What is the ratio of the expected
        value from (a) to this expected value?


        Multinomial
  65.    s Let (X1 , . . . , Xk ) be Multinomial with parameters n and (p1 , . . . , pk ). Use indicator
        r.v.s to show that Cov(Xi , Xj ) = −npi pj for i 6= j.
  66.    s Consider the birthdays of 100 people. Assume people’s birthdays are independent,
        and the 365 days of the year (exclude the possibility of February 29) are equally likely.
        Find the covariance and correlation between how many of the people were born on
        January 1 and how many were born on January 2.
  67.   A certain course has a freshmen, b sophomores, c juniors, and d seniors. Let X be the
        number of freshmen and sophomores (total), Y be the number of juniors, and Z be the
        number of seniors in a random sample of size n, where for Part (a) the sampling is with
        replacement and for Part (b) the sampling is without replacement (for both parts, at
        each stage the allowed choices have equal probabilities).

        (a) Find the joint PMF of X, Y, Z, for sampling with replacement.

        (b) Find the joint PMF of X, Y, Z, for sampling without replacement.
  68.    s A group of n ≥ 2 people decide to play an exciting game of Rock-Paper-Scissors.
        As you may recall, Rock smashes Scissors, Scissors cuts Paper, and Paper covers Rock
        (despite Bart Simpson once saying “Good old rock, nothing beats that!”).
        Usually this game is played with 2 players, but it can be extended to more players as
        follows. If exactly 2 of the 3 choices appear when everyone reveals their choice, say
        a, b ∈ {Rock, Paper, Scissors} where a beats b, the game is decisive: the players who
        chose a win, and the players who chose b lose. Otherwise, the game is indecisive and the
        players play again.
        For example, with 5 players, if one player picks Rock, two pick Scissors, and two pick
        Paper, the round is indecisive and they play again. But if 3 pick Rock and 2 pick Scissors,
        then the Rock players win and the Scissors players lose the game.
        Assume that the n players independently and randomly choose between Rock, Scissors,


Joint distributions                                                                              361

        and Paper, with equal probabilities. Let X, Y, Z be the number of players who pick
        Rock, Scissors, Paper, respectively in one game.

        (a) Find the joint PMF of X, Y, Z.

        (b) Find the probability that the game is decisive. Simplify your answer.

        (c) What is the probability that the game is decisive for n = 5? What is the limiting
        probability that a game is decisive as n → ∞? Explain briefly why your answer makes
        sense.
  69.    s Emails arrive in an inbox according to a Poisson process with rate λ (so the number
        of emails in a time interval of length t is distributed as Pois(λt), and the numbers of
        emails arriving in disjoint time intervals are independent). Let X, Y, Z be the numbers of
        emails that arrive from 9 am to noon, noon to 6 pm, and 6 pm to midnight (respectively)
        on a certain day.

        (a) Find the joint PMF of X, Y, Z.

        (b) Find the conditional joint PMF of X, Y, Z given that X + Y + Z = 36.

        (c) Find the conditional PMF of X + Y given that X + Y + Z = 36.

        (d) Find E(X + Y |X + Y + Z = 36) and Var(X + Y |X + Y + Z = 36). (Conditional
        expectation and conditional variance given an event are defined in the same way as
        expectation and variance, using the conditional distribution given the event in place of
        the unconditional distribution; these concepts are explored more in Chapter 9.)
  70.   Let X be the number of statistics majors in a certain college in the Class of 2030,
        viewed as an r.v. Each statistics major chooses between two tracks: a general track in
        statistical principles and methods, and a track in quantitative finance. Suppose that each
        statistics major chooses randomly which of these two tracks to follow, independently,
        with probability p of choosing the general track. Let Y be the number of statistics
        majors who choose the general track, and Z be the number of statistics majors who
        choose the quantitative finance track.
        (a) Suppose that X ∼ Pois(λ). (This isn’t the exact distribution in reality since a
        Poisson is unbounded, but it may be a very good approximation.) Find the correlation
        between X and Y .
        (b) Let n be the size of the Class of 2030, where n is a known constant. For this
        part and the next, instead of assuming that X is Poisson, assume that each of the n
        students chooses to be a statistics major with probability r, independently. Find the
        joint distribution of Y , Z, and the number of non-statistics majors, and their marginal
        distributions.
        (c) Continuing as in (b), find the correlation between X and Y .
  71.   In humans (and many other organisms), genes come in pairs. Consider a gene of interest,
        which comes in two types (alleles): type a and type A. The genotype of a person for that
        gene is the types of the two genes in the pair: AA, Aa, or aa (aA is equivalent to Aa).
        According to the Hardy-Weinberg law, for a population in equilibrium, the frequencies
        of AA, Aa, aa will be p2 , 2p(1 − p), (1 − p)2 , respectively, for some p with 0 < p < 1.
        Suppose that the Hardy-Weinberg law holds, and that n people are drawn randomly
        from the population, independently. Let X1 , X2 , X3 be the number of people in the
        sample with genotypes AA, Aa, aa, respectively.
        (a) What is the joint PMF of X1 , X2 , X3 ?
        (b) What is the distribution of the number of people in the sample who have an A?
        (c) What is the distribution of how many of the 2n genes among the people are A’s?


362                                                                         Introduction to Probability

        (d) Now suppose that p is unknown, and must be estimated using the observed data
        X1 , X2 , X3 . The maximum likelihood estimator (MLE) of p is the value of p for which
        the observed data are as likely as possible. Find the MLE of p.
        (e) Now suppose that p is unknown, and that our observations can’t distinguish between
        AA and Aa. So for each person in the sample, we just know whether or not that person
        is an aa (in genetics terms, AA and Aa have the same phenotype, and we only get to
        observe the phenotypes, not the genotypes). Find the MLE of p.


        Multivariate Normal
  72.    s Let (X, Y ) be Bivariate Normal, with X and Y marginally N (0, 1) and with corre-
        lation ρ between X and Y .
        (a) Show that (X + Y, X − Y ) is also Bivariate Normal.
        (b) Find the joint PDF of X + Y and X − Y (without using calculus), assuming that
        −1 < ρ < 1.
  73.   Let the joint PDF of X and Y be
                                                   x2   y2
                                                          
                             fX,Y (x, y) = c exp −    −      for all x and y,
                                                   2    2
        where c is a constant.
        (a) Find c to make this a valid joint PDF.
        (b) What are the marginal distributions of X and Y ? Are X and Y independent?
        (c) Is (X, Y ) Bivariate Normal?
  74.   Let the joint PDF of X and Y be
                                                     x2   y2
                                                            
                               fX,Y (x, y) = c exp −    −      for xy > 0,
                                                     2    2
        where c is a constant (the joint PDF is 0 for xy ≤ 0).
        (a) Find c to make this a valid joint PDF.
        (b) What are the marginal distributions of X and Y ? Are X and Y independent?
        (c) Is (X, Y ) Bivariate Normal?
  75.   Let X, Y, Z be i.i.d. N (0, 1). Find the joint MGF of (X + 2Y, 3X + 4Z, 5Y + 6Z).
  76.   Let X and Y be i.i.d. N (0, 1), and let S be a random sign (1 or −1, with equal proba-
        bilities) independent of (X, Y ).
        (a) Determine whether or not (X, Y, X + Y ) is Multivariate Normal.
        (b) Determine whether or not (X, Y, SX + SY ) is Multivariate Normal.
        (c) Determine whether or not (SX, SY ) is Multivariate Normal.
  77.   Let (X, Y ) be Bivariate Normal with X ∼ N (0, σ12 ) and Y ∼ N (0, σ22 ) marginally and
        with Corr(X, Y ) = ρ. Find a constant c such that Y − cX is independent of X.
        Hint: First find c (in terms of ρ, σ1 , σ2 ) such that Y − cX and X are uncorrelated.
  78.   A mother and a father have 6 children. The 8 heights in the family (in inches) are
        N (µ, σ 2 ) r.v.s (with the same distribution, but not necessarily independent).
        (a) Assume for this part that the heights are all independent. On average, how many of
        the children are taller than both parents?
        (b) Let X1 be the height of the mother, X2 be the height of the father, and Y1 , . . . , Y6
        be the heights of the children. Suppose that (X1 , X2 , Y1 , . . . , Y6 ) is Multivariate Normal,
        with N (µ, σ 2 ) marginals and Corr(X1 , Yj ) = ρ for 1 ≤ j ≤ 6, with ρ < 1. On average,
        how many of the children are more than 1 inch taller than their mother?


Joint distributions                                                                               363

        Mixed practice
  79.   Cars pass by a certain point on a road according to a Poisson process with rate λ
        cars/minute. Let Nt ∼ Pois(λt) be the number of cars that pass by that point in the
        time interval [0, t], with t measured in minutes.

        (a) A certain device is able to count cars as they pass by, but it does not record the
        arrival times. At time 0, the counter on the device is reset to 0. At time 3 minutes,
        the device is observed and it is found that exactly 1 car had passed by. Given this
        information, find the conditional CDF of when that car arrived. Also describe in words
        what the result says.

        (b) In the late afternoon, you are counting blue cars. Each car that passes by is blue
        with probability b, independently of all other cars. Find the joint PMF and marginal
        PMFs of the number of blue cars and number of non-blue cars that pass by the point
        in 10 minutes.
  80.   In a U.S. election, there will be V ∼ Pois(λ) registered voters. Suppose each registered
        voter is a registered Democrat with probability p and a registered Republican with
        probability 1 − p, independent of other voters. Also, each registered voter shows up to
        the polls with probability s and stays home with probability 1 − s, independent of other
        voters and independent of their own party affiliation. In this problem, we are interested
        in X, the number of registered Democrats who actually vote.

        (a) What is the distribution of X, before we know anything about the number of regis-
        tered voters?

        (b) Suppose we learn that V = v; that is, v people registered to vote. What is the
        conditional distribution of X given this information?

        (c) Suppose we learn there were d registered Democrats and r registered Republicans
        (where d + r = v). What is the conditional distribution of X given this information?

        (d) Finally, we learn in addition to all of the above information that n people showed
        up at the polls on election day. What is the conditional distribution of X given this
        information?
  81.   A certain college has m freshmen, m sophomores, m juniors, and m seniors. A certain
        class at the college consists of a simple random sample of size n students, i.e., all sets
        of n of the 4m students are equally likely. Let X1 , . . . , X4 be the numbers of freshmen,
        . . . , seniors in the class.

        (a) Find the joint PMF of X1 , X2 , X3 , X4 .

        (b) Give both an intuitive explanation and a mathematical justification for whether or
        not the distribution from (a) is Multinomial.

        (c) Find Cov(X1 , X3 ), fully simplified.
        Hint: Take the variance of both sides of X1 + X2 + X3 + X4 = n.
  82.   Let X ∼ Expo(λ) and let Y be a nonnegative random variable, discrete or continuous,
        whose MGF M is finite everywhere. Show that P (Y < X) = M (c) for a certain value
        of c (which you should specify).
  83.   A publishing company employs two proofreaders, Prue and Frida. When Prue is proof-
        reading a book, for each typo she has probability p of catching it and q = 1−p of missing
        it, independently. When Frida is proofreading a book, for each typo she has probability
        f of catching it and g = 1 − f of missing it, independently.

        (a) A certain book draft has n typos. The company randomly assigns it to one of the


364                                                                     Introduction to Probability

        two proofreaders, with equal probabilities. Find the distribution of the number of typos
        that get detected.

        (b) Another book is being written. When a draft of the book is complete, it will have a
        Pois(λ) number of typos, and will be assigned to Prue to proofread. Find the probability
        that Prue catches exactly k typos, given that she misses exactly m typos.
  84.   Two authors, Bob and Martha, are about to begin writing an epic co-authored book, The
        Adventures of Aaron the Aardwolf. It will take them A years to write. When they finish
        this book, they will immediately begin work on new, individually authored books. Bob
        will spend X years writing The Bilinear Bonanza of Bonnie the Butterfly, and Martha
        will spend Y years writing Memoirs of Maude the Magnificent Mangabey, independently.
        Suppose that A, X, Y are i.i.d. Expo(λ). On a timeline where time 0 is defined as the
        time when they begin their collaboration, consider the following quantities.

            A: time at which The Adventures of Aaron the Aardwolf is completed;
            B: time at which The Bilinear Bonanza of Bonnie the Butterfly is completed;
            M : time at which Memoirs of Maude the Magnificent Mangabey is completed;
            T : time at which the last to be completed of these three books is completed.
        (a) Find the distribution of B (which is also the distribution of M ).

        (b) Find Cov(A, B).

        (c) Find E(T ).
  85.   A DNA sequence can be represented as a sequence of letters, where the alphabet has 4
        letters: A,C,G,T. Suppose that a random DNA sequence of length n ≥ 4 is formed by
        independently generating letters one at a time, with pA , pC , pG , pT the probabilities of
        A,C,G,T, respectively, where pA + pC + pG + pT = 1.

        (a) Find the covariance between the number of A’s and the number of C’s in the se-
        quence.

        (b) It is observed that the sequence contains exactly a A’s, c C’s, g G’s, and t T’s, where
        a + c + g + t = n and a ≥ 2. Given this information, find the probability that the first
        A in the sequence is followed immediately by another A.
        Hint: How does this part relate to Exercise 74 in Chapter 2?

        (c) Given the information from (b) about how many times each letter occurs, find the
        expected number of occurrences of the expression CAT in the sequence.
  86.   To test for a certain disease, the level of a certain substance in the blood is measured.
        Let T be this measurement, considered as a continuous r.v. The patient tests positive
        (i.e., is declared to have the disease) if T > t0 and tests negative if T ≤ t0 , where t0
        is a threshold decided upon in advance. Let D be the indicator of having the disease.
        As discussed in Example 2.3.9, the sensitivity of the test is the probability of testing
        positive given that the patient has the disease, and the specificity of the test is the
        probability of testing negative given that the patient does not have the disease.

        (a) The ROC (receiver operator characteristic) curve of the test is the plot of sensitivity
        vs. 1 minus specificity, where sensitivity (the vertical axis) and 1 minus specificity (the
        horizontal axis) are viewed as functions of the threshold t0 . ROC curves are widely
        used in medicine and engineering as a way to study the performance of procedures for
        classifying individuals into two groups (in this case, the two groups are “diseased people”
        and “non-diseased people”).

        Given that D = 1, T has CDF G and PDF g; given that D = 0, T has CDF H and
        PDF h. Here g and h are positive on an interval [a, b] and 0 outside this interval. Show


Joint distributions                                                                                          365

        that the area under the ROC curve is the probability that a randomly selected diseased
        person has a higher T value than a randomly selected non-diseased person.

        (b) Explain why the result of (a) makes sense in two extreme cases: when g = h, and
        when there is a threshold t0 such that P (T > t0 |D = 1) and P (T ≤ t0 |D = 0) are very
        close to 1.
  87.   Let J be Discrete Uniform on {1, 2, . . . , n}.

        (a) Find E(J) and Var(J), fully simplified, using results from Section A.8 of the math
        appendix.

        (b) Discuss intuitively whether the results in (a) should be approximately the same as
        the mean and variance (respectively) of a Uniform distribution on a certain interval.

        (c) Let X1 , . . . , Xn be i.i.d. N (0, 1) r.v.s, and let R1 , . . . , Rn be their ranks (the smallest
        Xi has rank 1, the next has rank 2, . . . , and the largest has rank n). Explain why
                                                              n−1
                                                              X
                                                   Rn = 1 +         Ij ,
                                                              j=1

        where Ij = I(Xn > Xj ). Then use this to find E(Rn ) and Var(Rn ) directly using
        symmetry, linearity, the fundamental bridge, and properties of covariance.

        (d) Explain how the results of (a) and (c) relate. Then prove the identities
                              n                        n
                              X          n(n + 1)     X        n(n + 1)(2n + 1)
                                    j=            and     j2 =                  ,
                              j=1
                                            2         j=1
                                                                      6

        by giving them probabilistic interpretations.
  88.    s A network consists of n nodes, each pair of which may or may not have an edge
        joining them. For example, a social network can be modeled as a group of n nodes
        (representing people), where an edge between i and j means they know each other.
        Assume the network is undirected and does not have edges from a node to itself (for a
        social network, this says that if i knows j, then j knows i and that, contrary to Socrates’
        advice, a person does not know himself or herself). A clique of size k is a set of k nodes
        where every node has an edge to every other node (i.e., within the clique, everyone
        knows everyone). An anticlique of size k is a set of k nodes where there are no edges
        between them (i.e., within the anticlique, no one knows anyone else). For example, the
        picture below shows a network with nodes labeled 1, 2, . . . , 7, where {1, 2, 3, 4} is a clique
        of size 4, and {3, 5, 7} is an anticlique of size 3.



                                               3       4
                              1
                                         2                      5          6    7




        (a) Form a random network with n nodes by independently flipping fair coins to decide
        for each pair {x, y} whether there is an edge joining them. Find the expected number
        of cliques of size k (in terms of n and k).

        (b) A triangle is a clique of size 3. For a random network as in (a), find the variance of
        the number of triangles (in terms of n).
        Hint: Find the
                     covariances of the indicator random variables for each possible clique.
        There are n3 such indicator r.v.s, some pairs of which are dependent.


366                                                                         Introduction to Probability
                                     k
        *(c) Suppose that nk < 2(2)−1 . Show that there is a network with n nodes containing
                              

        no cliques of size k or anticliques of size k.
        Hint: Explain why it is enough to show that for a random network with n nodes, the
        probability of the desired property is positive; then consider the complement.
  89.    s Shakespeare wrote a total of 884647 words in his known works. Of course, many
        words are used more than once, and the number of distinct words in Shakespeare’s
        known writings is 31534 (according to one computation). This puts a lower bound on
        the size of Shakespeare’s vocabulary, but it is likely that Shakespeare knew words which
        he did not use in these known writings.
        More specifically, suppose that a new poem of Shakespeare were uncovered, and consider
        the following (seemingly impossible) problem: give a good prediction of the number of
        words in the new poem that do not appear anywhere in Shakespeare’s previously known
        works.
        Ronald Thisted and Bradley Efron studied this problem in the papers [8] and [9], devel-
        oping theory and methods and then applying the methods to try to determine whether
        Shakespeare was the author of a poem discovered by a Shakespearean scholar in 1985.
        A simplified version of their method is developed in the problem below. The method
        was originally invented by Alan Turing (the founder of computer science) and I.J. Good
        as part of the effort to break the German Enigma code during World War II.
        Let N be the number of distinct words that Shakespeare knew, and assume these words
        are numbered from 1 to N . Suppose for simplicity that Shakespeare wrote only two
        plays, A and B. The plays are reasonably long and they are of the same length. Let Xj
        be the number of times that word j appears in play A, and Yj be the number of times
        it appears in play B, for 1 ≤ j ≤ N .
        (a) Explain why it is reasonable to model Xj as being Poisson, and Yj as being Poisson
        with the same parameter as Xj .
        (b) Let the numbers of occurrences of the word “eyeball” (which was coined by Shake-
        speare) in the two plays be independent Pois(λ) r.v.s. Show that the probability that
        “eyeball” is used in play B but not in play A is
                                 e−λ (λ − λ2 /2! + λ3 /3! − λ4 /4! + . . . ).

        (c) Now assume that λ from (b) is unknown and is itself taken to be a random variable
        to reflect this uncertainty. So let λ have a PDF f0 . Let X be the number of times the
        word “eyeball” appears in play A and Y be the corresponding value for play B. Assume
        that the conditional distribution of X, Y given λ is that they are independent Pois(λ)
        r.v.s. Show that the probability that “eyeball” is used in play B but not in play A is
        the alternating series
                        P (X = 1) − P (X = 2) + P (X = 3) − P (X = 4) + . . . .
        Hint: Condition on λ and use Part (b).
        (d) Assume that every word’s numbers of occurrences in A and B are distributed as in
        Part (c), where λ may be different for different words but f0 is fixed. Let Wj be the
        number of words that appear exactly j times in play A. Show that the expected number
        of distinct words appearing in play B but not in play A is
                              E(W1 ) − E(W2 ) + E(W3 ) − E(W4 ) + . . . .

        (This shows that W1 − W2 + W3 − W4 + . . . is an unbiased predictor of the number of
        distinct words appearing in play B but not in play A: on average it is correct. Moreover,
        it can be computed just from having seen play A, without needing to know f0 or any of
        the λj . This method can be extended in various ways to give predictions for unobserved
        plays based on observed plays.)


8
Transformations



The topic for this chapter is transformations of random variables and random vec-
tors. After applying a function to a random variable X or random vector X, the goal
is to find the distribution of the transformed random variable or joint distribution
of the transformed random vector.
Transformations of random variables appear all over the place in statistics. Here are
a few examples, to preview the kinds of transformations we’ll be looking at in this
chapter.
• Unit conversion: In one dimension, we’ve already seen how standardization and
  location-scale transformations can be useful tools for learning about an entire
  family of distributions. A location-scale change is linear, converting an r.v. X to
  the r.v. Y = aX + b where a and b are constants (with a > 0).
  There are also many situations in which we may be interested in nonlinear trans-
  formations, e.g., converting from the dollar-yen exchange rate to the yen-dollar
  exchange rate, or converting information like “Janet’s waking hours yesterday
  consisted of 8 hours of work, 4 hours visiting friends, and 4 hours surfing the web”
  to the format “Janet was awake for 16 hours yesterday; she spent 12 of that time
  working, 14 of that time visiting friends, and 14 of that time surfing the web”. The
  change of variables formula, which is the first result in this chapter, shows what
  happens to the distribution when a random vector is transformed.
• Sums and averages as summaries: It is common in statistics to summarize n
  observations by their sum or sample average. Turning X1 , . . . , Xn into the sum
  T = X1 + · · · + Xn or sample mean X̄n = T /n is a transformation from Rn to R.
  The term for a sum of independent random variables is convolution. We have
  already encountered stories and MGFs as two techniques for dealing with convo-
  lutions. In this chapter, convolution sums and integrals, which are based on the
  law of total probability, will give us another way of obtaining the distribution of
  a sum of r.v.s.
• Extreme values: In many contexts, we may be interested in the distribution of
  the most extreme observations. For disaster preparedness, government agencies
  may be concerned about the most extreme flood or earthquake in a 100-year
  period; in finance, a portfolio manager with an eye toward risk management will
  want to know the worst 1% or 5% of portfolio returns. In these applications,
  we are concerned with the maximum or minimum of a set of observations. The

                                                                                  367


368                                                                 Introduction to Probability

  transformation that sorts observations, turning X1 , . . . , Xn into the order statistics
  min(X1 , . . . , Xn ), . . . , max(X1 , . . . , Xn ), is a transformation from Rn to Rn that is
  not invertible. Order statistics are addressed in the last section in this chapter.
Furthermore, it is especially important to us to understand transformations because
of the approach we’ve taken to learning about the named distributions. Starting
from a few basic distributions, we have defined other distributions as transforma-
tions of these elementary building blocks, in order to understand how the named
distributions are related to one another. We’ll continue in that spirit here as we in-
troduce two new distributions, the Beta and Gamma, which generalize the Uniform
and Exponential.
We already have quite a few tools in our toolbox for dealing with transformations,
so let’s review those briefly. First, if we are only looking for the expectation of
g(X), LOTUS shows us the way: it tells us that the PMF or PDF of X is enough
for calculating E(g(X)). LOTUS also applies to functions of several r.v.s, as we
learned in the previous chapter.
If we need the full distribution of g(X), not just its expectation, our approach
depends on whether X is discrete or continuous.
• In the discrete case, we get the PMF of g(X) by translating the event g(X) = y
  into an equivalent event involving X. To do so, we look for all values x such that
  g(x) = y; as long as X equals any of these x’s, the event g(X) = y will occur. This
  gives the formula                         X
                          P (g(X) = y) =           P (X = x).
                                                x:g(x)=y

  For a one-to-one g, the situation is particularly simple, because there is only one
  value of x such that g(x) = y, namely g −1 (y). Then we can use

                               P (g(X) = y) = P (X = g −1 (y))

  to convert between the PMFs of X and g(X), as also discussed in Section 3.7. For
  example, it is extremely easy to convert between the Geometric and First Success
  distributions.
• In the continuous case, a universal approach is to start from the CDF of g(X), and
  translate the event g(X) ≤ y into an equivalent event involving X. For general g,
  we may have to think carefully about how to express g(X) ≤ y in terms of X, and
  there is no easy formula we can plug into. But when g is continuous and strictly
  increasing, the translation is easy: g(X) ≤ y is the same as X ≤ g −1 (y), so

               Fg(X) (y) = P (g(X) ≤ y) = P (X ≤ g −1 (y)) = FX (g −1 (y)).

  We can then differentiate with respect to y to get the PDF of g(X). This gives a
  one-dimensional version of the change of variables formula, which generalizes to
  invertible transformations in multiple dimensions.


Transformations                                                                      369




8.1    Change of variables

Theorem 8.1.1 (Change of variables in one dimension). Let X be a continuous
r.v. with PDF fX , and let Y = g(X), where g is differentiable and strictly increasing
(or strictly decreasing). Then the PDF of Y is given by

                                                    dx
                                 fY (y) = fX (x)       ,
                                                    dy

where x = g −1 (y). The support of Y is all g(x) with x in the support of X.

Proof. Let g be strictly increasing. The CDF of Y is

   FY (y) = P (Y ≤ y) = P (g(X) ≤ y) = P (X ≤ g −1 (y)) = FX (g −1 (y)) = FX (x),

so by the chain rule, the PDF of Y is
                                                    dx
                                  fY (y) = fX (x)      .
                                                    dy
The proof for g strictly decreasing is analogous. In that case the PDF ends up as
−fX (x) dx                              dx                                          dx
        dy , which is nonnegative since dy < 0 if g is strictly decreasing. Using | dy |,
as in the statement of the theorem, covers both cases.                                

When applying the change of variables formula, we can choose whether to compute
dx               dy
dy , or compute dx and take the reciprocal. By the chain rule, these give the same
result, so we can do whichever is easier.
h 8.1.2. When finding the distribution of Y , be sure to:
• Check the assumptions of the change of variables theorem carefully if you wish to
  apply it (if it doesn’t apply, a good strategy is to start with the CDF of Y ).
• Express your final answer for the PDF of Y as a function of y.
• Specify the support of Y .
The change of variables formula (in the strictly increasing g case) is easy to remem-
ber when written in the form

                                 fY (y)dy = fX (x)dx,

which has an aesthetically pleasing symmetry to it. This formula also makes sense if
we think about units. For example, let X be a measurement in inches and Y = 2.54X
be the conversion into centimeters (cm). Then the units of fX (x) are inches−1
and the units of fY (y) are cm−1 , so it would be absurd to say something like
“fY (y) = fX (x)”. But dx is measured in inches and dy is measured in cm, so fY (y)dy
and fX (x)dx are unitless quantities, and it makes sense to equate them. Better yet,


370                                                           Introduction to Probability

fX (x)dx and fY (y)dy have probability interpretations (recall from Chapter 5 that
fX (x)dx is essentially the probability that X is in a tiny interval of length dx,
centered at x), which makes it easier to think intuitively about what the change of
variables formula is saying.
The next two examples derive the PDFs of two r.v.s that are defined as transforma-
tions of a standard Normal r.v. In the first example the change of variables formula
applies; in the second example it does not.
Example 8.1.3 (Log-Normal PDF). Let X ∼ N (0, 1), Y = eX . In Chapter 6
we named the distribution of Y the Log-Normal, and we found all of its moments
using the MGF of the Normal distribution. Now we can use the change of variables
formula to find the PDF of Y , since g(x) = ex is strictly increasing. Let y = ex , so
x = log y and dy/dx = ex . Then

                                  dx        1           1
                fY (y) = fX (x)      = ϕ(x) x = ϕ(log y) ,      y > 0.
                                  dy       e            y

Note that after applying the change of variables formula, we write everything on
the right-hand side in terms of y, and we specify the support of the distribution. To
determine the support, we just observe that as x ranges from −∞ to ∞, ex ranges
from 0 to ∞.
We can get the same result by working from the definition of the CDF, translating
the event Y ≤ y into an equivalent event involving X. For y > 0,

           FY (y) = P (Y ≤ y) = P (eX ≤ y) = P (X ≤ log y) = Φ(log y),

so the PDF is again

                                  d                    1
                      fY (y) =      Φ(log y) = ϕ(log y) ,   y > 0.                    
                                 dy                    y

Example 8.1.4 (Chi-Square PDF). Let X ∼ N (0, 1), Y = X 2 . The distribution
of Y is an example of a Chi-Square distribution, which is formally introduced in
Chapter 10. To find the PDF of Y , we can no longer apply the change of variables
formula because g(x) = x2 is not one-to-one; instead we start from the CDF.
By drawing the graph of y = x2 , we can see that the event X 2 ≤ y is equivalent to
           √         √
the event − y ≤ X ≤ y. Then
                             √       √       √        √        √
  FY (y) = P (X 2 ≤ y) = P (− y ≤ X ≤ y) = Φ( y) − Φ(− y) = 2Φ( y) − 1,

so
                             √    1           √
                 fY (y) = 2ϕ( y) · y −1/2 = ϕ( y)y −1/2 ,      y > 0.                 
                                  2

The following example sheds light on an unexpected appearance of a decidedly
non-Normal distribution.


Transformations                                                                      371

Example 8.1.5 (Lighthouse). A lighthouse on a shore is shining light toward the
ocean at a random angle U (measured in radians), where
                                             
                                        −π π
                            U ∼ Unif       ,     .
                                         2 2

Consider a line which is parallel to the shore and 1 mile away from the shore, as
illustrated in Figure 8.1. An angle of 0 would mean the ray of light is perpendicular
to the shore, while an angle of π/2 would mean the ray is along the shore, shining
to the right from the perspective of the figure.
Let X be the point that the light hits on the line, where the line’s origin is the point
on the line that is closest to the lighthouse. Find the distribution of X.

                                       lighthouse
                  beach
                  ocean

                                     1 mile       U


                                              0           X




FIGURE 8.1
A lighthouse shining light at a random angle U , viewed from above.

Solution: Looking at the right triangle in Figure 8.1, the length of the opposite side
of U divided by the length of the adjacent side of U is X/1 = X, so

                                     X = tan(U ).

(The figure illustrates a case where U > 0 and, correspondingly, X > 0, but the
same relationship holds when U ≤ 0.) Let x be a possible value of X and u be the
corresponding possible value of U , so

                            x = tan(u) and u = arctan(x).

By the change of variables formula, which applies since tan is a differentiable, strictly
increasing function on (−π/2, π/2),

                                              du  1    1
                           fX (x) = fU (u)       = ·       ,
                                              dx  π 1 + x2

which shows that X is Cauchy. In particular, this implies that E|X| is infinite (since
the expected value of a Cauchy does not exist), so on average X is infinitely far
from the origin of the line!


372                                                                  Introduction to Probability

The fact that X is Cauchy also makes sense in light of universality of the Uniform.
As shown in Example 7.1.25, the Cauchy CDF is
                                           1
                                 F (x) =     arctan(x) + 0.5.
                                           π
The inverse is F −1 (v) = tan (π (v − 0.5)) , so for V ∼ Unif(0, 1) we have

                          F −1 (V ) = tan (π (V − 0.5)) ∼ Cauchy.

This agrees with our earlier result since π (V − 0.5) ∼ Unif(−π/2, π/2).                       
We can also use the change of variables formula to find the PDF of a location-scale
transformation.
Example 8.1.6 (PDF of a location-scale transformation). Let X have PDF fX ,
and let Y = a + bX, with b 6= 0. Let y = a + bx, to mirror the relationship between
                dy
Y and X. Then dx   = b, so the PDF of Y is
                                                      
                                      dx          y−a 1
                     fY (y) = fX (x)      = fX                .                  
                                      dy            b     |b|

The change of variables formula generalizes to n dimensions, where it tells us how to
use the joint PDF of a random vector X to get the joint PDF of the transformed ran-
dom vector Y = g(X). The formula is analogous to the one-dimensional version, but
it involves a multivariate generalization of the derivative called a Jacobian matrix ;
see sections A.6 and A.7 of the math appendix for more about Jacobians.
Theorem 8.1.7 (Change of variables). Let X = (X1 , . . . , Xn ) be a continuous
random vector with joint PDF fX . Let g : A0 → B0 be an invertible function,
where A0 and B0 are open1 subsets of Rn , A0 contains the support of X, and B0 is
the range of g.
Let Y = g(X), and mirror this by letting y = g(x). Since g is invertible, we also
have X = g −1 (Y) and x = g −1 (y).
Suppose that all the partial derivatives ∂x
                                         ∂yj exist and are continuous, so we can form
                                            i


the Jacobian matrix              ∂x1 ∂x1             ∂x1 
                                    ∂y1   ∂y2   . . . ∂y  n
                          ∂x  .                       ..  .
                              =  ..                    .   
                          ∂y        ∂xn   ∂xn         ∂xn
                                    ∂y1   ∂y2   . . . ∂yn
Also assume that the determinant of this Jacobian matrix is never 0. Then the joint
PDF of Y is
                                         ∂x
                   fY (y) = fX g−1 (y) · |      | for y ∈ B0 ,
                                            ∂y
   1
     A set C ⊂ Rn is open if for each x ∈ C, there exists  > 0 such that all points with distance
less than  from x are contained in C. Sometimes we take A0 = B0 = Rn , but often we would like
more flexibility for the domain and range of g. For example, if n = 2, and X1 and X2 have support
(0, ∞), we may want to work with the open set A0 = (0, ∞) × (0, ∞) rather than all of R2 .


Transformations                                                                   373

and 0 otherwise. (The inner bars around the Jacobian say to take the determinant
and the outer bars say to take the absolute value.)
That is, to convert fX (x) to fY (y) we express the x in fX (x) in terms of y and then
multiply by the absolute value of the determinant of the Jacobian ∂x/∂y.
As in the 1D case,
                                   ∂x   ∂y −1
                                      =       ,
                                   ∂y   ∂x
so we can compute whichever of the two Jacobians is easier, and then at the end
express the joint PDF of Y as a function of y.
We will not prove the change of variables formula here, but the idea is to apply the
change of variables formula from multivariable calculus and the fact that if A is a
region in A0 and B = {g(x) : x ∈ A} is the corresponding region in B0 , then X ∈ A
is equivalent to Y ∈ B—they are the same event. So P (X ∈ A) = P (Y ∈ B), which
shows that                  Z              Z
                               fX (x)dx = fY (y)dy.
                             A                B

The change of variables formula from multivariable calculus (which is reviewed in
the math appendix) can then be applied to the integral on the left-hand side, with
the substitution x = g −1 (y).
h 8.1.8. A crucial conceptual difference between transformations of discrete r.v.s
and transformations of continuous r.v.s is that with discrete r.v.s we don’t need a
Jacobian, while with continuous r.v.s we do need a Jacobian. For example, let X be
a positive r.v. and Y = X 3 . If X is discrete, then

                             P (Y = y) = P (X = y 1/3 )

converts between the PMFs. But if X is continuous, we need a Jacobian (which in
one dimension is just a derivative) to convert between the PDFs:

                                          dx                1
                        fY (y) = fX (x)      = fX (y 1/3 ) 2/3 .
                                          dy              3y

Exercise 23 is a cautionary tale about someone who failed to use a Jacobian when
it was needed.
The next two examples apply the 2D change of variables formula.
Example 8.1.9 (Box-Muller). Let U ∼ Unif(0, 2π), and let T ∼ Expo(1) be inde-
pendent of U . Define
                         √                  √
                      X = 2T cos U and Y = 2T sin U.

Find the joint PDF of (X, Y ). Are they independent? What are their marginal
distributions?


374                                                                 Introduction to Probability

Solution:
The joint PDF of U and T is
                                                   1 −t
                                  fU,T (u, t) =      e ,
                                                  2π
for u ∈ (0, 2π) and t > 0. Viewing (X, Y ) as a point in the plane,

                        X 2 + Y 2 = 2T (cos2 U + sin2 U ) = 2T
                                                                      √
is the squared distance from the origin and U is the angle; that is, ( 2T , U ) expresses
(X, Y ) in polar coordinates.
Since we can recover (U, T ) from (X, Y ), the transformation is invertible. The
Jacobian matrix
                                   √                    !
                     ∂(x, y)      − 2t sin u √12t cos u
                             =    √
                     ∂(u, t)        2t cos u   √1 sin u
                                                2t

exists, has continuous entries, and has absolute determinant

                               | − sin2 u − cos2 u| = 1
                                      √              √
(which is never 0). Then letting x = 2t cos u, y = 2t sin u to mirror the transfor-
mation from (U, T ) to (X, Y ), we have

                                                        ∂(u, t)
                        fX,Y (x, y) = fU,T (u, t) · |           |
                                                        ∂(x, y)
                                       1 −t
                                    =    e ·1
                                      2π
                                       1 − 1 (x2 +y2 )
                                    =    e 2
                                      2π
                                        1      2       1  2
                                    = √ e−x /2 · √ e−y /2 ,
                                        2π             2π
for all real x and y.
The joint PDF fX,Y factors into a function of x times a function of y, so X and Y
are independent. Furthermore, we recognize the joint PDF as the product of two
standard Normal PDFs, so X and Y are i.i.d. N (0, 1) r.v.s! This result is called the
Box-Muller method for generating Normal r.v.s.                                     
Example 8.1.10 (Bivariate Normal joint PDF). In Chapter 7, we saw some prop-
erties of the Bivariate Normal distribution and found its joint MGF. Now let’s find
its joint PDF.
Let (Z, W ) be BVN with N (0, 1) marginals and Corr(Z, W ) = ρ. (If we want the
joint PDF when the marginals are not standard Normal, we can standardize both
components separately and use the result below.) Assume that −1 < ρ < 1 since
otherwise the distribution is degenerate (with Z and W perfectly correlated).


Transformations                                                                  375

As shown in Example 7.5.10, we can construct (Z, W ) as

                                   Z=X
                                  W = ρX + τ Y,
          p
with τ = 1 − ρ2 and X, Y i.i.d. N (0, 1). We also need the inverse transformation.
Solving Z = X for X, we have X = Z. Plugging this into W = ρX +τ Y and solving
for Y , we have

                                 X=Z
                                      ρ   1
                                 Y = − Z + W.
                                      τ   τ
The Jacobian is
                                                  
                                          1      0
                             ∂(x, y)   
                             ∂(z, w)
                                     =     ρ     1 ,
                                         −
                                           τ     τ
which has absolute determinant 1/τ . So by the change of variables formula,

                                        ∂(x, y)
        fZ,W (z, w) = fX,Y (x, y) · |           |
                                        ∂(z, w)
                                                 
                       1              1
                    =      exp − (x2 + y 2 )
                      2πτ             2
                                                        
                       1              1 2        ρ   1 2
                    =      exp − (z + (− z + w) )
                      2πτ             2          τ   τ
                                                        
                       1               1 2         2
                    =      exp − 2 (z + w − 2ρzw) , for all real z, w.
                      2πτ             2τ

In the last step we multiplied things out and used the fact that ρ2 + τ 2 = 1.    




8.2   Convolutions

A convolution is a sum of independent random variables. As we mentioned earlier, we
often add independent r.v.s because the sum is a useful summary of an experiment
(in n Bernoulli trials, we may only care about the total number of successes), and
because sums lead to averages, which are also useful (in n Bernoulli trials, the
proportion of successes).
The main task in this section is to determine the distribution of T = X + Y ,
where X and Y are independent r.v.s whose distributions are known. In previous
chapters, we’ve already seen how stories and MGFs can help us accomplish this


376                                                              Introduction to Probability

task. For example, we used stories to show that the sum of independent Binomials
with the same success probability is Binomial, and that the sum of i.i.d. Geometrics
is Negative Binomial. We used MGFs to show that a sum of independent Normals
is Normal.

A third method for obtaining the distribution of T is by using a convolution sum or
integral. The formulas are given in the following theorem. As we’ll see, a convolution
sum is nothing more than the law of total probability, conditioning on the value of
either X or Y ; a convolution integral is analogous.

Theorem 8.2.1 (Convolution sums and integrals). Let X and Y be independent
r.v.s and T = X + Y be their sum. If X and Y are discrete, then the PMF of T is
                                     X
                      P (T = t) =         P (Y = t − x)P (X = x)
                                      x
                                     X
                                =         P (X = t − y)P (Y = y).
                                      y


If X and Y are continuous, then the PDF of T is
                                     Z ∞
                          fT (t) =         fY (t − x)fX (x)dx
                                     Z−∞
                                       ∞
                                =          fX (t − y)fY (y)dy.
                                      −∞



Proof. For the discrete case, we use LOTP, conditioning on X:
                                X
                  P (T = t) =        P (X + Y = t|X = x)P (X = x)
                                x
                                X
                            =        P (Y = t − x|X = x)P (X = x)
                                x
                                X
                            =        P (Y = t − x)P (X = x).
                                x


Conditioning on Y instead, we obtain the second formula for the PMF of T .

h 8.2.2. We use the assumption that X and Y are independent in order to get
from P (Y = t − x|X = x) to P (Y = t − x) in the last step. We are only justified
in dropping the condition X = x if the conditional distribution of Y given X = x
is the same as the marginal distribution of Y , i.e., X and Y are independent. A
common mistake is to assume that after plugging in x for X, we’ve “already used
the information” that X = x, when in fact we need an independence assumption to
drop the condition. Otherwise we destroy information without justification.

In the continuous case, since the value of a PDF at a point is not a probability, we


Transformations                                                                  377

first find the CDF, and then differentiate to get the PDF. By LOTP,
                                      Z ∞
             FT (t) = P (X + Y ≤ t) =      P (X + Y ≤ t|X = x)fX (x)dx
                                       −∞
                                      Z ∞
                                    =      P (Y ≤ t − x)fX (x)dx
                                       −∞
                                      Z ∞
                                    =      FY (t − x)fX (x)dx.
                                         −∞

Again, we need independence to drop the condition X = x. To get the PDF, we
then differentiate with respect to t, interchanging the order of integration and dif-
ferentiation. This gives
                                    Z ∞
                           fT (t) =      fY (t − x)fX (x)dx.
                                    −∞

Conditioning on Y instead, we get the second formula for fT .
An alternative derivation uses the change of variables formula in two dimensions.
The only snag is that the change of variables formula requires an invertible trans-
formation from R2 to R2 , but (X, Y ) 7→ X + Y maps R2 to R and is not invertible.
We can get around this by adding a redundant component to the transformation, in
order to make it invertible. Accordingly, we consider the invertible transformation
(X, Y ) 7→ (X + Y, X) (using (X, Y ) 7→ (X + Y, Y ) would be equally valid). Once we
have the joint PDF of X + Y and X, we integrate out X to get the marginal PDF
of X + Y .
Let T = X + Y , W = X, and let t = x + y, w = x. It may seem redundant to
give X the new name “W ”, but doing this makes it easier to distinguish between
pre-transformation variables and post-transformation variables: we are transforming
(X, Y ) 7→ (T, W ). Then                        
                               ∂(t, w)       1 1
                                       =
                               ∂(x, y)       1 0
                                          ∂(x,y)
has absolute determinant equal to 1, so | ∂(t,w) | is also 1. Thus, the joint PDF of
T and W is

            fT,W (t, w) = fX,Y (x, y) = fX (x)fY (y) = fX (w)fY (t − w),

and the marginal PDF of T is
                       Z ∞                 Z ∞
              fT (t) =     fT,W (t, w)dw =     fX (x)fY (t − x)dx,
                         −∞                   −∞

in agreement with our result above.                                                
h 8.2.3. It is not hard to remember the convolution integral formula by reasoning
by analogy from                   X
                      P (T = t) =   P (Y = t − x)P (X = x)
                                    x


378                                                                    Introduction to Probability

to                                   Z ∞
                          fT (t) =         fY (t − x)fX (x)dx.
                                     −∞
But care is still needed. For example, Exercise 23 shows that an analogous-looking
formula for the PDF of the product of two independent continuous r.v.s is wrong:
a Jacobian is needed (for convolutions, the absolute Jacobian determinant is 1 so it
isn’t noticeable in the convolution integral formula).
Since convolution sums are just the law of total probability, we have already used
them in previous chapters without mentioning the word convolution; see, for ex-
ample, the first and most tedious proof of Theorem 3.8.9 (sum of independent
Binomials), as well as the proof of Theorem 4.8.1 (sum of independent Poissons).
In the following examples, we find the distribution of a sum of Exponentials and a
sum of Uniforms using a convolution integral.
                                                                  i.i.d.
Example 8.2.4 (Exponential convolution). Let X, Y ∼ Expo(λ). Find the dis-
tribution of T = X + Y .
Solution:
For t > 0, the convolution formula gives
                       Z ∞                      Z t
              fT (t) =     fY (t − x)fX (x)dx =     λe−λ(t−x) λe−λx dx,
                       −∞                            0

where we restricted the integral to be from 0 to t since we need t − x > 0 and x > 0
for the PDFs inside the integral to be nonzero. Simplifying, we have
                                 Z t
                    fT (t) = λ 2
                                     e−λt dx = λ2 te−λt , for t > 0.
                                 0

This is known as the Gamma(2, λ) distribution. We will introduce the Gamma
distribution in detail in Section 8.4.                                   
                                                         i.i.d.
Example 8.2.5 (Uniform convolution). Let X, Y ∼ Unif(0, 1). Find the distri-
bution of T = X + Y .
Solution:
The PDF of X (and of Y ) is
                                       
                                           1, x ∈ (0, 1),
                              g(x) =
                                           0, otherwise.

The convolution formula gives
                      Z ∞                      Z ∞
             fT (t) =     fY (t − x)fX (x)dx =     g(t − x)g(x)dx.
                        −∞                            −∞

The integrand is 1 if and only if 0 < t−x < 1 and 0 < x < 1; this is a parallelogram-
shaped constraint. Equivalently, the constraint is max(0, t − 1) < x < min(t, 1).


Transformations                                                                    379




              1.0
              0.8
              0.6
           x
              0.4
              0.2
              0.0




                    0.0        0.5          1.0          1.5         2.0
                                             t


FIGURE 8.2
Region in the (t, x)-plane where g(t − x)g(x) is 1.


From Figure 8.2, we see that for 0 < t ≤ 1, x is constrained to be in (0, t), and for
1 < t < 2, x is constrained to be in (t − 1, 1). Therefore, the PDF of T is a piecewise
linear function:
                               Z t
                              
                              
                              
                                   dx = t          for 0 < t ≤ 1,
                                 0
                     fT (t) =   Z 1
                              
                              
                              
                                    dx = 2 − t for 1 < t < 2.
                                 t−1

Figure 8.3 plots the PDF of T . It is shaped like a triangle with vertices at 0, 1, and
2, so it is called the Triangle(0, 1, 2) distribution.
Heuristically, it makes sense that T is more likely to take on values near the mid-
dle than near the extremes: a value near 1 can be obtained if both X and Y are
moderate, if X is large but Y is small, or if Y is large but X is small. In contrast, a
value near 2 is only possible if both X and Y are large. Thinking back to Example
3.2.5, the PMF of the sum of two die rolls was also shaped like a triangle. A single
die roll has a Discrete Uniform distribution on the integers 1 through 6, so in that
problem we were looking at a convolution of two Discrete Uniforms. It makes sense
that the PDF we obtained here is similar in shape.                                   




8.3   Beta

In this section and the next, we will introduce two continuous distributions, the
Beta and Gamma, which are related to several named distributions we have already


380                                                                Introduction to Probability




              1.0
              0.8
              0.6
           PDF
              0.4
              0.2
              0.0




                    0.0           0.5          1.0           1.5            2.0
                                                t


FIGURE 8.3
PDF of T = X + Y , where X and Y are i.i.d. Unif(0, 1).

studied and are also related to each other via a shared story. This is an interlude
from the subject of transformations, but we’ll eventually need to use a change of
variables to tie the Beta and Gamma distributions together.
The Beta distribution is a continuous distribution on the interval (0, 1). It is a
generalization of the Unif(0, 1) distribution, allowing the PDF to be non-constant
on (0, 1).
Definition 8.3.1 (Beta distribution). An r.v. X is said to have the Beta distribution
with parameters a and b, where a > 0 and b > 0, if its PDF is
                                 1
                     f (x) =           xa−1 (1 − x)b−1 ,   0 < x < 1,
                               β(a, b)
where the constant β(a, b) is chosen to make the PDF integrate to 1. We write this
as X ∼ Beta(a, b).
Taking a = b = 1, the Beta(1, 1) PDF is constant on (0, 1), so the Beta(1, 1) and
Unif(0, 1) distributions are the same. By varying the values of a and b, we get PDFs
with a variety of shapes; Figure 8.4 shows four examples. Here are a couple of general
patterns:
• If a < 1 and b < 1, the PDF is U-shaped and opens upward. If a > 1 and b > 1,
  the PDF opens down.
• If a = b, the PDF is symmetric about 1/2. If a > b, the PDF favors values larger
  than 1/2; if a < b, the PDF favors values smaller than 1/2.
By definition, the constant β(a, b) satisfies
                                     Z 1
                          β(a, b) =      xa−1 (1 − x)b−1 dx.
                                         0
```
