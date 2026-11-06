# Chapter 9: Conditional Expectation

**Book:** Introduction to Probability, Second Edition  
**Authors:** Joseph K. Blitzstein and Jessica Hwang  
**Printed pages:** 411–452

> Source transcription from the supplied textbook PDF. Text extraction preserves the original order and page content as far as the PDF text layer allows. Check mathematical notation and figure references against the source where extraction is ambiguous.

```text
Conditional expectation                                                          425

Notice that because we sum or integrate over y, E(Y |X = x) is a function of x
only. We can give this function a name, like g: let g(x) = E(Y |X = x). We define
E(Y |X) as the random variable obtained by finding the form of the function g(x),
then plugging in X for x.
Definition 9.2.1 (Conditional expectation given an r.v.). Let g(x) = E(Y |X = x).
Then the conditional expectation of Y given X, denoted E(Y |X), is defined to be the
random variable g(X). In other words, if after doing the experiment X crystallizes
into x, then E(Y |X) crystallizes into g(x).
h 9.2.2. The notation in this definition sometimes causes confusion. It does not
say “g(x) = E(Y |X = x), so g(X) = E(Y |X = X), which equals E(Y ) because
X = X is always true”. Rather, we should first compute the function g(x), then
plug in X for x. For example, if g(x) = x2 , then g(X) = X 2 . A similar biohazard is
h 5.3.2, about the meaning of F (X) in the universality of the Uniform.
h 9.2.3. By definition, E(Y |X) is a function of X, so it is a random variable. (This
does not mean there are no examples where E(Y |X) is a constant. A constant is
a degenerate r.v., and a constant function of X. For example, if X and Y are
independent then E(Y |X) = E(Y ), which is a constant.) Thus it makes sense
to compute quantities like E(E(Y |X)) and Var(E(Y |X)), the mean and variance
of the r.v. E(Y |X). It is easy to be ensnared by category errors when working
with conditional expectation, so it is important to keep in mind that conditional
expectations of the form E(Y |A) are numbers, while those of the form E(Y |X) are
random variables.
Here are some quick examples of how to calculate conditional expectation. In both
examples, we don’t need to do a sum or integral to get E(Y |X = x) because a more
direct approach is available.
Example 9.2.4. A stick of length 1 is broken at a point X chosen uniformly at
random. Given that X = x, we then choose another breakpoint Y uniformly on the
interval [0, x]. Find E(Y |X), and its mean and variance.
Solution:
From the description of the experiment, X ∼ Unif(0, 1) and Y |X = x ∼ Unif(0, x).
Then E(Y |X = x) = x/2, so by plugging in X for x, we have

                                   E(Y |X) = X/2.

The expected value of E(Y |X) is

                           E(E(Y |X)) = E(X/2) = 1/4.

(We will show in the next section that a general property of conditional expectation
is that E(E(Y |X)) = E(Y ), so it also follows that E(Y ) = 1/4.) The variance of
E(Y |X) is
                        Var(E(Y |X)) = Var(X/2) = 1/48.                            


426                                                          Introduction to Probability
                             i.i.d.
Example 9.2.5. For X, Y ∼ Expo(λ), find E(max(X, Y )| min(X, Y )).
Solution:
Let M = max(X, Y ) and L = min(X, Y ). By the memoryless property, M − L is
independent of L, and M − L ∼ Expo(λ) (see Example 7.3.6). Therefore
                                                                               1
      E(M |L = l) = E(L|L = l) + E(M − L|L = l) = l + E(M − L) = l +             ,
                                                                               λ
and E(M |L) = L + λ1 .                                                               




9.3    Properties of conditional expectation

Conditional expectation has some very useful properties.
• Dropping what’s independent: If X and Y are independent, then E(Y |X) = E(Y ).
• Taking out what’s known: For any function h, E(h(X)Y |X) = h(X)E(Y |X).
• Linearity: E(Y1 + Y2 |X) = E(Y1 |X) + E(Y2 |X), and E(cY |X) = cE(Y |X) for c a
  constant (the latter is a special case of taking out what’s known).
• Adam’s law: E(E(Y |X)) = E(Y ).
• Projection interpretation: The r.v. Y − E(Y |X), which is called the residual from
  using X to predict Y , is uncorrelated with h(X) for any function h.
Let’s discuss each property individually.
Theorem 9.3.1 (Dropping what’s independent). If X and Y are independent, then
E(Y |X) = E(Y ).
This is true because independence implies E(Y |X = x) = E(Y ) for all x, hence
E(Y |X) = E(Y ). Intuitively, if X provides no information about Y , then our best
guess for Y , even if we get to know X, is still the unconditional mean E(Y ). However,
the converse is false: a counterexample is given in Example 9.3.3 below.
Theorem 9.3.2 (Taking out what’s known). For any function h,

                           E(h(X)Y |X) = h(X)E(Y |X).

Intuitively, when we take expectations given X, we are treating X as if it has
crystallized into a known constant. Then any function of X, say h(X), also acts like
a known constant while we are conditioning on X. Taking out what’s known is the
conditional version of the unconditional fact that E(cY ) = cE(Y ). The difference is
that E(cY ) = cE(Y ) asserts that two numbers are equal, while taking out what’s
known asserts that two random variables are equal.


Conditional expectation                                                                 427

Example 9.3.3. Let Z ∼ N (0, 1) and Y = Z 2 . Find E(Y |Z) and E(Z|Y ).
Solution: Since Y is a function of Z, E(Y |Z) = E(Z 2 |Z) = Z 2 by taking out what’s
                                                                    √       √
known. To get E(Z|Y ), notice that conditional on Y = y, Z equals y or − y with
equal probabilities by the symmetry of the standard Normal, so E(Z|Y = y) = 0
and E(Z|Y ) = 0.
In this case, although Y provides a lot of information about Z, narrowing down the
possible values of Z to just two values, Y only tells us about the magnitude of Z
and not its sign. For this reason, E(Z|Y ) = E(Z) despite the dependence between
Z and Y . This example illustrates that the converse of Theorem 9.3.1 is false. 
Theorem 9.3.4 (Linearity). E(Y1 + Y2 |X) = E(Y1 |X) + E(Y2 |X).
This result is the conditional version of the unconditional fact that E(Y1 + Y2 ) =
E(Y1 ) + E(Y2 ), and is true since conditional probabilities are probabilities.
h 9.3.5. It is incorrect to write “E(Y |X1 + X2 ) = E(Y |X1 ) + E(Y |X2 )”; linearity
applies on the left side of the conditioning bar, not on the right side!
Example 9.3.6. Let X1 , . . . , Xn be i.i.d., and Sn = X1 + · · · + Xn . Find E(X1 |Sn ).
Solution:
By symmetry,
                      E(X1 |Sn ) = E(X2 |Sn ) = · · · = E(Xn |Sn ),
and by linearity,

                    E(X1 |Sn ) + · · · + E(Xn |Sn ) = E(Sn |Sn ) = Sn .

Therefore,
                                E(X1 |Sn ) = Sn /n = X̄n ,
the sample mean of the Xj ’s. This is an intuitive result: if we have 2 i.i.d. r.v.s X1 , X2
and learn that X1 + X2 = 10, it makes sense to guess that X1 is 5 (accounting for
half of the total). Similarly, if we have n i.i.d. r.v.s and get to know their sum, our
best guess for any one of them is the sample mean.                                         
The next theorem connects conditional expectation to unconditional expectation.
It goes by many names, including the law of total expectation, the law of iterated
expectation (which has a terrible acronym for something glowing with truth), and
the tower property. We call it Adam’s law because it is used so frequently that it
deserves a pithy name, and since it is often used in conjunction with another law
we’ll encounter soon, which has a complementary name.
Theorem 9.3.7 (Adam’s law). For any r.v.s X and Y ,

                                  E(E(Y |X)) = E(Y ).

Proof. We present the proof in the case where X and Y are both discrete (the
proofs for other cases are analogous). Let E(Y |X) = g(X). We proceed by applying


428                                                               Introduction to Probability

LOTUS, expanding the definition of g(x) to get a double sum, and then swapping
the order of summation:
                          X
                E(g(X)) =    g(x)P (X = x)
                             x
                                                              !
                            X X
                        =                  yP (Y = y|X = x) P (X = x)
                             x        y
                            XX
                        =                 yP (X = x)P (Y = y|X = x)
                             x    y
                            X X
                        =    y  P (X = x, Y = y)
                             y        x
                            X
                        =        yP (Y = y) = E(Y ).                                      
                             y


Adam’s law is a more compact, more general version of the law of total expectation
(Theorem 9.1.5). For X discrete, the statements
                                X
                       E(Y ) =      E(Y |X = x)P (X = x)
                                      x

and
                                 E(Y ) = E(E(Y |X))
mean the same thing, since if we let E(Y |X = x) = g(x), then
                              X                   X
   E(E(Y |X)) = E(g(X)) =         g(x)P (X = x) =     E(Y |X = x)P (X = x).
                                 x                        x


Armed with Adam’s law, we have a powerful strategy for finding an expectation
E(Y ), by conditioning on an r.v. X that we wish we knew. First obtain E(Y |X) by
treating X as known, and then take the expectation of E(Y |X). We will see various
examples of this later in the chapter.
Just as there are forms of Bayes’ rule and LOTP with extra conditioning, as dis-
cussed in Chapter 2, there is a version of Adam’s law with extra conditioning.


Theorem 9.3.8 (Adam’s law with extra conditioning). For any r.v.s X, Y, Z,

                            E(E(Y |X, Z)|Z) = E(Y |Z).

The above equation is Adam’s law, except with extra conditioning on Z inserted
everywhere. It is true because conditional probabilities are probabilities. So we
are free to use Adam’s law to help us find both unconditional expectations and
conditional expectations.
Using Adam’s law, we can also prove the last item on our list of properties of
conditional expectation.


Conditional expectation                                                          429

Theorem 9.3.9 (Projection interpretation). For any function h, the random vari-
able Y − E(Y |X) is uncorrelated with h(X). Equivalently,

                            E((Y − E(Y |X))h(X)) = 0.

(This is equivalent since E(Y − E(Y |X)) = 0, by linearity and Adam’s law.)

Proof. We have

             E((Y − E(Y |X))h(X)) = E(h(X)Y ) − E(h(X)E(Y |X))
                                     = E(h(X)Y ) − E(E(h(X)Y |X))

by Theorem 9.3.2 (here we’re “putting back what’s known” in the inner expecta-
tion). By Adam’s law, the second term is equal to E(h(X)Y ).                


                                         Y


                                                Y – E(Y | X)


                                  E(Y | X)

FIGURE 9.6
The conditional expectation E(Y |X) is the projection of Y onto the space of all
functions of X, shown here as a plane. The residual Y − E(Y |X) is orthogonal to
the plane: it’s perpendicular to (uncorrelated with) any function of X.

From a geometric perspective, we can visualize Theorem 9.3.9 as in Figure 9.6. In a
certain sense (described below), E(Y |X) is the function of X that is closest to Y ;
we say that E(Y |X) is the projection of Y into the space of all functions of X. The
“line” from Y to E(Y |X) in the figure is orthogonal (perpendicular) to the “plane”,
since any other route from Y to E(Y |X) would be longer. This orthogonality turns
out to be the geometric interpretation of Theorem 9.3.9.
The details of this perspective are given in the next section, which is starred since
it requires knowledge of linear algebra. But even without delving into the linear
algebra, the projection picture gives some useful intuition. As mentioned earlier, we
can think of E(Y |X) as a prediction for Y based on X. This is an extremely com-
mon problem in statistics: predict or estimate the future observations or unknown
parameters based on data. The projection interpretation of conditional expectation
implies that E(Y |X) is the best predictor of Y based on X, in the sense that it is
the function of X with the lowest mean squared error (expected squared difference
between Y and the prediction of Y ).


430                                                            Introduction to Probability

Example 9.3.10 (Linear regression). An extremely widely used method for data
analysis in statistics is linear regression. In its most basic form, the linear regression
model uses a single explanatory variable X to predict a response variable Y , and it
assumes that the conditional expectation of Y is linear in X:

                                  E(Y |X) = a + bX.

(a) Show that an equivalent way to express this is to write

                                      Y = a + bX + ,

where  is an r.v. (called the error ) with E(|X) = 0.

(b) Solve for the constants a and b in terms of E(X), E(Y ), Cov(X, Y ), and Var(X).
Solution:
(a) Let Y = a + bX + , with E(|X) = 0. Then by linearity,

                 E(Y |X) = E(a|X) + E(bX|X) + E(|X) = a + bX.

Conversely, suppose that E(Y |X) = a + bX, and define

                                    = Y − (a + bX).

Then Y = a + bX + , with

            E(|X) = E(Y |X) − E(a + bX|X) = E(Y |X) − (a + bX) = 0.


(b) First, by Adam’s law, taking the expectation of both sides gives

                                  E(Y ) = a + bE(X).

Note that  has mean 0 and X and  are uncorrelated, since

                            E() = E(E(|X)) = E(0) = 0

and
                 E(X) = E(E(X|X)) = E(XE(|X)) = E(0) = 0.
Taking the covariance with X of both sides in Y = a + bX + , we have

            Cov(X, Y ) = Cov(X, a) + b Cov(X, X) + Cov(X, ) = b Var(X).

Thus,
                       Cov(X, Y )
                  b=              ,
                        Var(X)

                                                   Cov(X, Y )
                  a = E(Y ) − b E(X) = E(Y ) −                · E(X).                   
                                                    Var(X)


Conditional expectation                                                              431




9.4    *Geometric interpretation of conditional expectation

This section explains in more detail the geometric perspective shown in Figure 9.6,
using some concepts from linear algebra. Consider the vector space consisting of all
random variables on a certain probability space, such that the random variables all
have finite variance. Each vector or point in the space is a random variable (here we
are using “vector” in the linear algebra sense, not in the sense of a random vector
from Chapter 7). Define the inner product of two r.v.s U and V to be

                                   hU, V i = E(U V ).

(For this definition to satisfy the axioms for an inner product, we need the convention
that two r.v.s are considered the same if they are equal with probability 1.)
The squared length of an r.v. X is

                                ||X||2 = hX, Xi = EX 2 ,

and the squared distance between two r.v.s U and V is

                               ||U − V ||2 = E(U − V )2 .

The interpretations become especially nice if E(U ) = E(V ) = 0, since then:
• ||U ||2 = Var(U ), and ||U || = SD(U ).
• hU, V i = Cov(U, V ), and the cosine of the “angle” between U and V is Corr(U, V ).
• U and V are orthogonal (i.e., hU, V i = 0) if and only if they are uncorrelated.
To interpret E(Y |X) geometrically, consider the space of all random variables (with
finite variance) that can be expressed as functions of X. This is a subspace of the
vector space. In Figure 9.6, the subspace of random variables of the form h(X) is
represented by a plane. To get E(Y |X), we project Y onto the plane. Then the
residual Y − E(Y |X) is orthogonal to h(X) for all functions h, and E(Y |X) is the
function of X that best predicts Y , where “best” here means that the mean squared
error E(Y − g(X))2 is minimized by choosing g(X) = E(Y |X).
The projection interpretation is a helpful way to think about many of the properties
of conditional expectation. For example, if Y = h(X) is a function of X, then Y
itself is already in the plane, so it is its own projection; this explains why

                                  E(h(X)|X) = h(X).

We can think of unconditional expectation as a projection too: E(Y ) can be thought
of as E(Y |0), the projection of Y onto the space of all constants (and indeed, E(Y )
is the constant c that minimizes E(Y − c)2 , as we proved in Theorem 6.1.4).


432                                                             Introduction to Probability

We can now also give a geometric interpretation for Adam’s law: E(Y ) says to
project Y in one step onto the space of all constants; E(E(Y |X)) says to do it in
two steps, by first projecting onto the plane and then projecting E(Y |X) onto the
space of all constants, which is a line within that plane. Adam’s law says that the
one-step and two-step methods yield the same result.
In the next section we will introduce Eve’s law, which serves the same purpose for
variance as Adam’s law does for expectation. As a preview and to further explore
the geometric interpretation of conditional expectation, let’s look at Var(Y ) from
the perspective of this section. Assume that E(Y ) = 0 (if E(Y ) 6= 0, we can center
Y by subtracting E(Y ); doing so has no effect on the variance of Y ).
We can decompose Y into two orthogonal terms, the residual Y − E(Y |X) and the
conditional expectation E(Y |X):

                            Y = (Y − E(Y |X)) + E(Y |X).

The two terms are orthogonal since Y − E(Y |X) is uncorrelated with any function
of X, and E(Y |X) is a function of X. So by the Pythagorean theorem,

                        ||Y ||2 = ||Y − E(Y |X)||2 + ||E(Y |X)||2 .

That is,
                   Var(Y ) = Var(Y − E(Y |X)) + Var(E(Y |X)).
As we will see in the next section, this identity is a form of Eve’s law. So it turns
out that Eve’s law, which may look cryptic at first glance, can be interpreted as
just being the Pythagorean theorem for a “triangle” whose sides are the vectors
Y − E(Y |X), E(Y |X), and Y .




9.5   Conditional variance

Once we’ve defined conditional expectation given an r.v., we have a natural way to
define conditional variance given a random variable: replace all instances of E(·) in
the definition of unconditional variance with E(·|X).
Definition 9.5.1 (Conditional variance). The conditional variance of Y given X
is
                     Var(Y |X) = E((Y − E(Y |X))2 |X).
This is equivalent to

                         Var(Y |X) = E(Y 2 |X) − (E(Y |X))2 .

h 9.5.2. Like E(Y |X), Var(Y |X) is a random variable, and it is a function of X.


Conditional expectation                                                         433

Since conditional variance is defined in terms of conditional expectations, we can
use results about conditional expectation to help us calculate conditional variance.
Here’s an example.
Example 9.5.3. Let Z ∼ N (0, 1) and Y = Z 2 . Find Var(Y |Z) and Var(Z|Y ).
Solution:
Without any calculations we can see that Var(Y |Z) = 0: conditional on Z, Y is
a known constant, and the variance of a constant is 0. By the same reasoning,
Var(h(Z)|Z) = 0 for any function h.
To get Var(Z|Y ), apply the definition:

                          Var(Z|Z 2 ) = E(Z 2 |Z 2 ) − (E(Z|Z 2 ))2 .

The first term equals Z 2 . The second term equals 0 by symmetry, as we found in
Example 9.3.3. Thus Var(Z|Z 2 ) = Z 2 , which we can write as Var(Z|Y ) = Y . 
In the next example, we will practice working with conditional expectation and
conditional variance in the context of the Bivariate Normal.
Example 9.5.4 (Conditional expectation and conditional variance in a BVN). Let
(Z, W ) be Bivariate Normal, with Corr(Z, W ) = ρ and Z, W marginally N (0, 1).
Find E(W |Z) and Var(W |Z).
Solution: We can assume that (Z, W ) has been constructed as in Example 7.5.10,
since E(W |Z) and Var(W |Z) depend only on the joint distribution of (Z, W ), not
on the specific method that was used to create (Z, W ). So let

                                   Z=X
                                                p
                                   W = ρX +         1 − ρ2 Y,

with X, Y i.i.d. N (0, 1). We can then solve the problem very neatly, without hav-
ing to resort to messy integrals based on the Bivariate Normal joint PDF. The
conditional expectation is
                                  p                       p
    E(W |Z) = E(W |X) = ρX + 1 − ρ2 E(Y |X) = ρX + 1 − ρ2 E(Y ) = ρZ,

since X and Y are independent. And the conditional variance is
                                 p
     Var(W |Z) = Var(W |X) = Var( 1 − ρ2 Y |X) = (1 − ρ2 )Var(Y ) = 1 − ρ2 ,

since ρX acts as a constant if we are given X, and Y is independent of X.
Interestingly, the same argument with the roles of Z and W reversed shows that

                      E(Z|W ) = ρW, and Var(Z|W ) = 1 − ρ2 .

One might have guessed that if we should multiply by ρ to go from an observed value
of Z to a predicted value of W , then we should divide by ρ to go from an observed


434                                                         Introduction to Probability

value of W to a predicted value of Z. But the above results say to multiply by the
same ρ, regardless of whether using Z to predict W or vice versa! This is closely
related to the fact that correlation is symmetric (Corr(Z, W ) = ρ = Corr(W, Z))
and to an important concept in statistics known as regression toward the mean. 
We learned in the previous section that Adam’s law relates conditional expectation
to unconditional expectation. A companion result for Adam’s law is Eve’s law, which
relates conditional variance to unconditional variance.
Theorem 9.5.5 (Eve’s law). For any r.v.s X and Y ,

                     Var(Y ) = E(Var(Y |X)) + Var(E(Y |X)).


The ordering of E’s and Var’s on the right-hand side spells EVVE, whence the
name Eve’s law. Eve’s law is also known as the law of total variance or the variance
decomposition formula.

Proof. Let g(X) = E(Y |X). By Adam’s law, E(g(X)) = E(Y ). Then

           E(Var(Y |X)) = E(E(Y 2 |X) − g(X)2 ) = E(Y 2 ) − E(g(X)2 ),

           Var(E(Y |X)) = E(g(X)2 ) − (Eg(X))2 = E(g(X)2 ) − (EY )2 .
Adding these equations, we have Eve’s law.                                          

To visualize Eve’s law, imagine a population where each person has a value of X
and a value of Y . We can divide this population into subpopulations, one for each
possible value of X. For example, if X represents age and Y represents height, we
can group people based on age. Then there are two sources contributing to the
variation in people’s heights in the overall population. First, within each age group,
people have different heights. The average amount of variation in height within each
age group is the within-group variation, E(Var(Y |X)). Second, across age groups,
the average heights are different. The variance of average heights across age groups
is the between-group variation, Var(E(Y |X)). Eve’s law says that to get the total
variance of Y , we simply add these two sources of variation.
Figure 9.7 illustrates Eve’s law in the simple case where we have three age groups.
The average amount of scatter within each of the groups X = 1, X = 2, and
X = 3 is the within-group variation, E(Var(Y |X)). The variance of the group
means E(Y |X = 1), E(Y |X = 2), and E(Y |X = 3) is the between-group variation,
Var(E(Y |X)).
Another way to think about Eve’s law is in terms of prediction. If we wanted to
predict someone’s height based on their age alone, the ideal scenario would be if ev-
eryone within an age group had exactly the same height, while different age groups
had different heights. Then, given someone’s age, we would be able to predict their
height perfectly. In other words, the ideal scenario for prediction is no within-group


Conditional expectation                                                            435




                    X=1                   X=2                X=3
FIGURE 9.7
Eve’s law says that total variance is the sum of within-group and between-group
variation.

variation in height, since the within-group variation cannot be explained by age dif-
ferences. For this reason, within-group variation is also called unexplained variation,
and between-group variation is also called explained variation. Eve’s law says that
the overall variance of Y is the sum of unexplained and explained variation.
We can also write Eve’s law in the form
                    Var(Y ) = Var(Y − E(Y |X)) + Var(E(Y |X)),
since, letting W be the residual Y − E(Y |X),
           Var(Y − E(Y |X)) = E(W 2 ) = E(E(W 2 |X)) = E(Var(Y |X)).
Again this says that we can decompose variance into within-group variation plus
between-group variation.
h 9.5.6. Let Y be an r.v. and A be an event. It is wrong to say “Var(Y ) =
Var(Y |A)P (A) + Var(Y |Ac )P (Ac )”, even though this looks analogous to the law of
total expectation. (For a simple counterexample, let Y ∼ Bern(1/2) and A be the
event Y = 0. Then Var(Y |A) and Var(Y |Ac ) are both 0, but Var(Y ) = 1/4.)
Instead, we should use Eve’s law if we want to condition on whether or not A
occurred: letting I be the indicator of A,
                          Var(Y ) = E(Var(Y |I)) + Var(E(Y |I)).
To see how this expression relates to the “wrong expression”, let
p = P (A), q = P (Ac ), a = E(Y |A), b = E(Y |Ac ), v = Var(Y |A), w = Var(Y |Ac ).
Then E(Y |I) is a with probability p and b with probability q, and Var(Y |I) is v
with probability p and w with probability q. So
           E(Var(Y |I)) = vp + wq = Var(Y |A)P (A) + Var(Y |Ac )P (Ac ),
which is exactly the “wrong expression”, and Var(Y ) consists of this plus the term
                          Var(E(Y |I)) = a2 p + b2 q − (ap + bq)2 .
It is crucial to account for both within-group and between-group variation.


436                                                          Introduction to Probability




9.6   Adam and Eve examples

We conclude this chapter with several examples showing how Adam’s law and Eve’s
law allow us to find the mean and variance of complicated r.v.s, especially in situ-
ations that involve multiple levels of randomness.
In our first example, the r.v. of interest is a random sum: the sum of a random
number of random variables. There are thus two levels of randomness: first, each
term in the sum is a random variable; second, the number of terms in the sum is
also a random variable.
Example 9.6.1 (Random sum). A store receives N customers in a day, where N
is an r.v. with finite mean and variance. Let Xj be the amount spent by the jth
customer at the store. Assume that each Xj has mean µ and variance σ 2 , and that
N and all the Xj are independent of one another. Find the mean and variance of
                       P
the random sum X = N     j=1 Xj , which is the store’s total revenue in a day, in terms
       2
of µ, σ , E(N ), and Var(N ).

Solution:
Since X is a sum, our first impulse might be to claim “E(X) = N µ by linearity”.
Alas, this would be a category error, since E(X) is a number and N µ is a random
variable. The key is that X is not merely a sum, but a random sum; the number of
terms we are adding up is itself random, whereas linearity applies to sums with a
fixed number of terms.
Yet this category error actually suggests the correct strategy: if only we were allowed
to treat N as a constant, then linearity would apply. So let’s condition on N . By
linearity of conditional expectation,
                                    
                           N
                           X              XN               XN
           E(X|N ) = E        Xj |N  =      E(Xj |N ) =     E(Xj ) = N µ.
                          j=1            j=1              j=1

We used the independence of the Xj and N to assert E(Xj |N ) = E(Xj ) for all
j. Note that the statement “E(X|N ) = N µ” is not a category error because both
sides of the equality are r.v.s that are functions of N . Finally, by Adam’s law,
                     E(X) = E(E(X|N )) = E(N µ) = µE(N ).
This is a pleasing result: the average total revenue is the average amount spent per
customer, multiplied by the average number of customers.
For Var(X), we again condition on N to get Var(X|N ):
                                
                       XN            XN                N
                                                       X
     Var(X|N ) = Var      Xj |N  =     Var(Xj |N ) =   Var(Xj ) = N σ 2 .
                          j=1            j=1               j=1


Conditional expectation                                                           437

Eve’s law then tells us how to obtain the unconditional variance of X:
                      Var(X) = E(Var(X|N )) + Var(E(X|N ))
                              = E(N σ 2 ) + Var(N µ)
                              = σ 2 E(N ) + µ2 Var(N ).                             

In the next example, two levels of randomness arise because our experiment takes
place in two stages. We sample a city from a group of cities, then sample citizens
within the city. This is an example of a multilevel model.
Example 9.6.2 (Random sample from a random city). To study the prevalence
of a disease in several cities of interest within a certain county, we pick a city at
random, then pick a random sample of n people from that city. This is a form of a
widely used survey technique known as cluster sampling.
Let Q be the proportion of diseased people in the chosen city, and let X be the
number of diseased people in the sample. As illustrated in Figure 9.8 (where white
dots represent healthy individuals and black dots represent diseased individuals),
different cities may have very different prevalences. Since each city has its own
disease prevalence, Q is a random variable. Suppose that Q ∼ Unif(0, 1). Also
assume that conditional on Q, each individual in the sample independently has
probability Q of having the disease; this is true if we sample with replacement from
the chosen city, and is approximately true if we sample without replacement but
the population size is large. Find E(X) and Var(X).




FIGURE 9.8
A certain oval-shaped county has 4 cities. Each city has healthy people (represented
as white dots) and diseased people (represented as black dots). A random city is
chosen, and then a random sample of n people is chosen from within that city.
There are two components to the variability in the number of diseased people in
the sample: variation due to different cities having different disease prevalence, and
variation due to the randomness of the sample within the chosen city.

Solution:
With our assumptions, X|Q ∼ Bin(n, Q); this notation says that conditional on


438                                                          Introduction to Probability

knowing the disease prevalence in the chosen city, we can treat Q as a constant,
and each sampled individual is an independent Bernoulli trial with probability Q of
success. Using the mean and variance of the Binomial distribution, E(X|Q) = nQ
and Var(X|Q) = nQ(1 − Q). Furthermore, using the moments of the standard
Uniform distribution, E(Q) = 1/2, E(Q2 ) = 1/3, and Var(Q) = 1/12. Now we can
apply Adam’s law and Eve’s law to get the unconditional mean and variance of X:
                                                           n
                        E(X) = E(E(X|Q)) = E(nQ) =           ,
                                                           2

                      Var(X) = E(Var(X|Q)) + Var(E(X|Q))
                              = E(nQ(1 − Q)) + Var(nQ)
                              = nE(Q) − nE(Q2 ) + n2 Var(Q)
                                  n n2
                              =     + .
                                  6  12

Note that the structure of this problem is identical to that in the story of Bayes’
billiards. Therefore, we actually know the distribution of X, not just its mean and
variance: X is Discrete Uniform on {0, 1, 2, . . . , n}. But the Adam-and-Eve approach
can be applied when Q has a more complicated distribution, or with more levels in
the multilevel model, whether or not it is feasible to work out the distribution of
X. For example, we could have people within cities within counties within states
within countries.                                                                   
Last but not least, we revisit Story 8.4.5, the Gamma-Poisson problem from the
previous chapter.
Example 9.6.3 (Gamma-Poisson revisited). Recall that Fred decided to find out
about the rate of Blotchville’s Poisson process of buses by waiting at the bus stop
for t hours and counting the number of buses Y . He then used the data to update
his prior distribution λ ∼ Gamma(r0 , b0 ). Thus, Fred was using the two-level model

                                  λ ∼ Gamma(r0 , b0 )
                               Y |λ ∼ Pois(λt).

We found that under Fred’s model, the marginal distribution of Y is Negative
Binomial with parameters r = r0 and p = b0 /(b0 + t). In particular,
                                     rq   r0 t
                              E(Y ) =   =      ,
                                      p   b0
                                     rq   r0 t(b0 + t)
                            Var(Y ) = 2 =              .
                                     p           b20

Let’s independently verify this with Adam’s law and Eve’s law. Using results
about the Poisson distribution, the conditional mean and variance of Y given λ
are E(Y |λ) = Var(Y |λ) = λt. Using results about the Gamma distribution, the


Conditional expectation                                                             439

marginal mean and variance of λ are E(λ) = r0 /b0 and Var(λ) = r0 /b20 . For Adam
and Eve, this is all that is required:
                                                         r0 t
                           E(Y ) = E(E(Y |λ)) = E(λt) =       ,
                                                          b0
                          Var(Y ) = E(Var(Y |λ)) + Var(E(Y |λ))
                                 = E(λt) + Var(λt)
                                     r0 t r0 t2 r0 t(b0 + t)
                                 =       + 2 =               ,
                                     b0    b0        b20
which is consistent with our earlier answers. The difference is that when using Adam
and Eve, we don’t need to know that Y is Negative Binomial! If we had been too
lazy to derive the marginal distribution of Y , or if we weren’t so lucky as to have a
named distribution for Y , Adam and Eve would still deliver the mean and variance
of Y (though not the PMF).
Lastly, let’s compare the mean and variance of Y under the two-level model to
the mean and variance we would get if Fred were absolutely sure of the true value
of λ. In other words, suppose we replaced λ by its mean, E(λ) = r0 /b0 , making
λ a constant instead of an r.v. Then the marginal distribution of the number of
buses (which we’ll call Ỹ under the new assumptions) would just be Poisson with
parameter r0 t/b0 . Then we would have
                                                 r0 t
                                         E(Ỹ ) =     ,
                                                 b0
                                                 r0 t
                                      Var(Ỹ ) =      .
                                                 b0

Notice that E(Ỹ ) = E(Y ), but Var(Ỹ ) < Var(Y ): the extra term r0 t2 /b20 from Eve’s
law is missing. Intuitively, when we fix λ at its mean, we are eliminating a level of
uncertainty in the model, and this causes a reduction in the unconditional variance.
Figure 9.9 overlays the plots of two PMFs, that of Y ∼ NBin(r0 , b0 /(b0 + t)) in gray
and that of Ỹ ∼ Pois(r0 t/b0 ) in black. The values of the parameters are arbitrarily
chosen to be r0 = 5, b0 = 1, t = 2. These two PMFs have the same center of mass,
but the PMF of Y is noticeably more dispersed.                                      




9.7   Recap

To calculate an unconditional expectation, we can divide up the sample space and
use the law of total expectation
                                         n
                                         X
                               E(Y ) =         E(Y |Ai )P (Ai ),
                                         i=1


440                                                                                        Introduction to Probability




              0.20
              0.15
                                                         ●   ●
                                                     ●            ●
           PMF
              0.10
                                                                      ●
                                                 ●
                                             ●   ●   ●   ●
                                                             ●            ●
                                         ●                        ●
                                             ●
              0.05



                                     ●                                ●
                                                                          ●   ●
                                 ●                                            ●
                                         ●                                        ●
                                                                                  ●
                             ●                                                         ●
                                                                                       ●    ●
                                     ●                                                          ●
                         ●                                                                  ●       ●   ●
              0.00




                     ●           ●                                                              ●   ●
                     ●   ●   ●                                                                          ●

                     0                   5                   10                   15                    20
                                                             x


FIGURE 9.9
PMF of Y ∼ NBin(r0 , b0 /(b0 + t)) in gray and Ỹ ∼ Pois(r0 t/b0 ) in black, where
r0 = 5, b0 = 1, t = 2.

but we must be careful not to destroy information in subsequent steps (such as by
forgetting in the midst of a long calculation to condition on something that needs to
be conditioned on). In problems with a recursive structure, we can also use first-step
analysis for expectations.
The conditional expectation E(Y |X) and conditional variance Var(Y |X) are ran-
dom variables that are functions of X; they are obtained by treating X as if it
were a known constant. If X and Y are independent, then E(Y |X) = E(Y ) and
Var(Y |X) = Var(Y ). Conditional expectation has the properties
                             E(h(X)Y |X) = h(X)E(Y |X)
                             E(Y1 + Y2 |X) = E(Y1 |X) + E(Y2 |X),
analogous to the properties E(cY ) = cE(Y ) and E(Y1 + Y2 ) = E(Y1 ) + E(Y2 ) for
unconditional expectation. The conditional expectation E(Y |X) is also the random
variable that makes the residual Y − E(Y |X) uncorrelated with any function of X,
which means we can interpret it geometrically as a projection.
Finally, Adam’s law and Eve’s law,
                             E(Y ) = E(E(Y |X))
                         Var(Y ) = E(Var(Y |X)) + Var(E(Y |X)),
often help us calculate E(Y ) and Var(Y ) in problems that feature multiple forms
or levels of randomness.
Figure 9.10 illustrates how the number E(Y |X = x) connects with the r.v. E(Y |X),
whose expectation is E(Y ) by Adam’s law. Additionally, it shows how the ingredi-
ents in Eve’s law are formed and come together to give a useful decomposition of
Var(Y ) in terms of quantities that condition on X.


Conditional expectation                                                                                                                                                      441


 0.20

 0.15

  0.10
                                                                                                                  What can
                                                                                                                  happen?
  0.05

  0.00
        3

            2


                1


                    0
                                                                      3
                y




                        −1                                        2
                                                              1
                                                      0
                             −2
                                                 −1       x
                                            −2
                                  −3
                                       −3




            joint distributions                                                      random variables               events                               numbers

      joint CDF F(x,y)                                                    generate                                               condition on event      E(Y | X = x)
                                                                                            X,Y                      X=x
 joint PMF P(X = x, Y = y)                                                                                                                             (function of x)
       joint PDF f(x,y)
      joint MGF M(s,t)




                                                                                              condition on r.v.
                                                                                                                                                      E(E(Y | X)) = E(Y)
                                                                                                                                                        (Adam's law)

                                                                                                                            on
                                                                                                                       ctati
                                                                                                                   expe


                                                                                           E(Y | X)                   variance                         Var(E(Y | X))
                                                                                       (function of X)                                           (between group variation)

                                                                                                                                                              +

                                                                                          Var(Y | X)                expectation                        E(Var(Y | X))
                                                                                       (function of X)                                            (within group variation)




                                                                                                                                           Var(Y) = E(Var(Y | X)) + Var(E(Y | X))
                                                                                                                                                       (Eve's law)



FIGURE 9.10
We often observe an r.v. X and want to predict another r.v. Y based on the infor-
mation about X. If we observe that X = x, then we can condition on that event
and use E(Y |X = x) as our prediction. The conditional expectation E(Y |X) is the
r.v. that takes the value E(Y |X = x) when X = x. Adam’s law lets us compute
the unconditional expectation E(Y ) by starting with the conditional expectation
E(Y |X). Similarly, Eve’s law lets us compute Var(Y ) in terms of quantities that
condition on X.




9.8                                         R

Mystery prize simulation

We can use simulation to show that in Example 9.1.7, the example of bidding on a
mystery prize with unknown value, any bid will lead to a negative payout on average.
First choose a bid b (we chose 0.6); then simulate a large number of hypothetical
mystery prizes and store them in v:

b <- 0.6


442                                                           Introduction to Probability

nsim <- 10^5
v <- runif(nsim)
The bid is accepted if b > (2/3)*v. To get the average profit conditional on an
accepted bid, we use square brackets to keep only those values of v satisfying the
condition:
mean(v[b > (2/3)*v]) - b
This value is negative regardless of b, as you can check by experimenting with
different values of b.


Time until HH vs. HT

To verify the results of Example 9.1.9, we can start by generating a long sequence
of fair coin tosses. This is done with the sample command. We use paste with the
collapse="" argument to turn these tosses into a single string of H’s and T ’s:
paste(sample(c("H","T"),100,replace=TRUE),collapse="")
A sequence of length 100 is enough to virtually guarantee that both HH and HT
will have appeared at least once.
To determine how many tosses are required on average to see HH and HT, we
need to generate many sequences of coin tosses. For this, we use our familiar friend
replicate:
r <- replicate(10^3,paste(sample(c("H","T"),100,replace=T),
                          collapse=""))


Now r contains a thousand sequences of coin tosses, each of length 100. To find
the first appearance of HH in each of these sequences, you can use the str_locate
command from the stringr package. After you’ve installed and loaded the pack-
age,
t <- str_locate(r,"HH")
creates a two-column table t, whose columns contain the starting and ending posi-
tions of the first appearance of HH in each sequence of coin tosses. (Use head(t) to
display the first few rows of the table and get an idea of what your results look like.)
What we want are the ending positions, given by the second column. In particular,
we want the average value of the second column, which is an approximation of the
average waiting time for HH :
mean(t[,2])
Is your answer around 6? Trying again with "HT" instead of "HH", is your answer
around 4?


Conditional expectation                                                                       443

Linear regression

In Example 9.3.10, we derived formulas for the slope and intercept of a linear regres-
sion model, which can be used to predict a response variable using an explanatory
variable. Let’s try to apply these formulas to a simulated dataset:

x <- rnorm(100)
y <- 3 + 5*x + rnorm(100)

The vector x contains 100 realizations of the random variable X ∼ N (0, 1), and the
vector y contains 100 realizations of the random variable Y = a + bX +  where
 ∼ N (0, 1). As we can see, the true values of a and b for this dataset are 3 and 5,
respectively. We can visualize the data as a scatterplot with plot(x,y).

Now let’s see if we can get good estimates of the true a and b, using the formulas
in Example 9.3.10:

b <- cov(x,y) / var(x)
a <- mean(y) - b*mean(x)

Here cov(x,y), var(x), and mean(x) provide the sample covariance, sample vari-
ance, and sample mean, estimating the quantities Cov(X, Y ), Var(X), and E(X),
respectively. (We have discussed sample mean and sample variance in detail in ear-
lier chapters. Sample covariance is defined analogously, and is a natural way to
estimate the true covariance.)

You should find that b is close to 5 and a is close to 3. These estimated values define
the line of best fit. The abline command lets us plot the line of best fit on top of
our scatterplot:

plot(x,y)
abline(a=a,b=b)

The first argument to abline is the intercept of the line, and the second argument
is the slope.




9.9     Exercises

Exercises marked with s have detailed solutions at http://stat110.net.


        Conditional expectation given an event
   1.   Fred wants to travel from Blotchville to Blissville, and is deciding between 3 options
        (involving different routes or different forms of transportation). The jth option would
        take an average of µj hours, with a standard deviation of σj hours. Fred randomly


444                                                                     Introduction to Probability

       chooses between the 3 options, with equal probabilities. Let T be how long it takes for
       him to get from Blotchville to Blissville.

       (a) Find E(T ). Is it simply (µ1 + µ2 + µ3 )/3, the average of the expectations?

       (b) Find Var(T ). Is it simply (σ12 + σ22 + σ32 )/3, the average of the variances?
  2.   While Fred is sleeping one night, X legitimate emails and Y spam emails are sent to
       him. Suppose that X and Y are independent, with X ∼ Pois(10) and Y ∼ Pois(40).
       When he wakes up, he observes that he has 30 new emails in his inbox. Given this
       information, what is the expected value of how many new legitimate emails he has?
  3.   A group of 21 women and 14 men are enrolled in a medical study. Each of them has a
       certain disease with probability p, independently. It is then found (through extremely
       reliable testing) that exactly 5 of the people have the disease. Given this information,
       what is the expected number of women who have the disease?
  4.   A researcher studying crime is interested in how often people have gotten arrested. Let
       X ∼ Pois(λ) be the number of times that a random person got arrested in the last 10
       years. However, data from police records are being used for the researcher’s study, and
       people who were never arrested in the last 10 years do not appear in the records. In
       other words, the police records have a selection bias: they only contain information on
       people who have been arrested in the last 10 years.
       So averaging the numbers of arrests for people in the police records does not directly es-
       timate E(X); it makes more sense to think of the police records as giving us information
       about the conditional distribution of how many times a person was arrest, given that
       the person was arrested at least once in the last 10 years. The conditional distribution
       of X, given that X ≥ 1, is called a truncated Poisson distribution (see Exercise 14 from
       Chapter 3 for another example of this distribution).

       (a) Find E(X|X ≥ 1)

       (b) Find Var(X|X ≥ 1).
  5.   A fair 20-sided die is rolled repeatedly, until a gambler decides to stop. The gambler
       pays $1 per roll, and receives the amount shown on the die when the gambler stops
       (e.g., if the die is rolled 7 times and the gambler decides to stop then, with an 18 as the
       value of the last roll, then the net payoff is $18 − $7 = $11). Suppose the gambler uses
       the following strategy: keep rolling until a value of m or greater is obtained, and then
       stop (where m is a fixed integer between 1 and 20).

       (a) What is the expected net payoff?
       Hint: The average of consecutive integers a, a + 1, . . . , a + n is the same as the average
       of the first and last of these. See the math appendix for more information about series.

       (b) Use R or other software to find the optimal value of m.
  6.   Let X ∼ Expo(λ). Find E(X|X < 1) in two different ways:

       (a) by calculus, working with the conditional PDF of X given X < 1.

       (b) without calculus, by expanding E(X) using the law of total expectation.
  7.   You are given an opportunity to bid on a mystery box containing a mystery prize! The
       value of the prize is completely unknown, except that it is worth at least nothing, and
       at most a million dollars. So the true value V of the prize is considered to be Uniform
       on [0,1] (measured in millions of dollars).

       You can choose to bid any nonnegative amount b (in millions of dollars). If b < 14 V , then
       your bid is rejected and nothing is gained or lost. If b ≥ 14 V , then your bid is accepted
       and your net payoff is V − b (since you pay b to get a prize worth V ).


Conditional expectation                                                                                445

        Find your expected payoff as a function of b (be sure to specify it for all b ≥ 0). Then
        find the optimal bid b, to maximize your expected payoff.
   8.    s You get to choose between two envelopes, each of which contains a check for some
        positive amount of money. Unlike in the two-envelope paradox, it is not given that one
        envelope contains twice as much money as the other envelope. Instead, assume that the
        two values were generated independently from some distribution on the positive real
        numbers, with no information given about what that distribution is.
        After picking an envelope, you can open it and see how much money is inside (call this
        value x), and then you have the option of switching. As no information has been given
        about the distribution, it may seem impossible to have better than a 50% chance of
        picking the better envelope. Intuitively, we may want to switch if x is “small” and not
        switch if x is “large”, but how do we define “small” and “large” in the grand scheme of
        all possible distributions? [The last sentence was a rhetorical question.]

        Consider the following strategy for deciding whether to switch. Generate a threshold
        T ∼ Expo(1), and switch envelopes if and only if the observed value x is less than the
        value of T . Show that this strategy succeeds in picking the envelope with more money
        with probability strictly greater than 1/2.

        Hint: Let t be the value of T (generated by a random draw from the Expo(1) distribu-
        tion). First explain why the strategy works very well if t happens to be in between the
        two envelope values, and does no harm in any case (i.e., there is no case in which the
        strategy succeeds with probability strictly less than 1/2).
   9.   There are two envelopes, each of which has a check for a Unif(0, 1) amount of money,
        measured in thousands of dollars. The amounts in the two envelopes are independent.
        You get to choose an envelope and open it, and then you can either keep that amount
        or switch to the other envelope and get whatever amount is in that envelope.
        Suppose that you use the following strategy: choose an envelope and open it. If you
        observe U , then stick with that envelope with probability U , and switch to the other
        envelope with probability 1 − U .

        (a) Find the probability that you get the larger of the two amounts.

        (b) Find the expected value of what you will receive.
  10.   Suppose n people are bidding on a mystery prize that is up for auction. The bids are to
        be submitted in secret, and the individual who submits the highest bid wins the prize.
        The ith bidder receives a signal Xi , with X1 , . . . , Xn i.i.d. The value of the prize, V , is
        defined to be the sum of the individual bidders’ signals:

                                             V = X1 + · · · + Xn .

        This is known in economics as the wallet game: we can imagine that the n people are
        bidding on the total amount of money in their wallets, and each person’s signal is the
        amount of money in their own wallet. Of course, the wallet is a metaphor; the game can
        also be used to model company takeovers, where each of two companies bids to take over
        the other, and a company knows its own value but not the value of the other company.
        For this problem, assume the Xi are i.i.d. Unif(0, 1).
        (a) Before receiving her signal, what is bidder 1’s unconditional expectation for V ?
        (b) Conditional on receiving the signal X1 = x1 , what is bidder 1’s expectation for V ?
        (c) Suppose each bidder submits a bid equal to their conditional expectation for V , i.e.,
        bidder i bids E(V |Xi = xi ). Conditional on receiving the signal X1 = x1 and winning
        the auction, what is bidder 1’s expectation for V ? Explain intuitively why this quantity
        is always less than the quantity calculated in (b).


446                                                                     Introduction to Probability

  11.    s A coin with probability p of Heads is flipped repeatedly. For (a) and (b), suppose
        that p is a known constant, with 0 < p < 1.

        (a) What is the expected number of flips until the pattern HT is observed?

        (b) What is the expected number of flips until the pattern HH is observed?

        (c) Now suppose that p is unknown, and that we use a Beta(a, b) prior to reflect our
        uncertainty about p (where a and b are known constants and are greater than 2). In
        terms of a and b, find the corresponding answers to (a) and (b) in this setting.
  12.   A coin with probability p of Heads is flipped repeatedly, where 0 < p < 1. The se-
        quence of outcomes can be divided into runs (blocks of H’s or blocks of T ’s), e.g.,
        HHHT T T T HT T T HH becomes HHH T T T T H T T T HH , which has 5 runs,
        with lengths 3, 4, 1, 3, 2, respectively. Assume that the coin is flipped at least until the
        start of the third run.

        (a) Find the expected length of the first run.

        (b) Find the expected length of the second run.
  13.   A fair 6-sided die is rolled once. Find the expected number of additional rolls needed to
        obtain a value at least as large as that of the first roll.
  14.   A fair 6-sided die is rolled repeatedly.

        (a) Find the expected number of rolls needed to get a 1 followed right away by a 2.
        Hint: Start by conditioning on whether or not the first roll is a 1.

        (b) Find the expected number of rolls needed to get two consecutive 1’s.

        (c) Let an be the expected number of rolls needed to get the same value n times in a
        row (i.e., to obtain a streak of n consecutive j’s for some not-specified-in-advance value
        of j). Find a recursive formula for an+1 in terms of an .
        Hint: Divide the time until there are n + 1 consecutive appearances of the same value
        into two pieces: the time until there are n consecutive appearances, and the rest.
        (d) Find a simple, explicit formula for an for all n ≥ 1. What is a7 (numerically)?


        Conditional expectation given a random variable
  15.    s Let X1 , X2 be i.i.d., and let X̄ = 12 (X1 + X2 ) be the sample mean. In many statistics
        problems, it is useful or important to obtain a conditional expectation given X̄. As an
        example of this, find E(w1 X1 + w2 X2 |X̄), where w1 , w2 are constants with w1 + w2 = 1.
  16.   Let X1 , X2 , . . . be i.i.d. r.v.s with mean 0, and let Sn = X1 + · · · + Xn . As shown in
        Example 9.3.6, the expected value of the first term given the sum of the first n terms is
                                                            Sn
                                             E(X1 |Sn ) =      .
                                                            n
        Generalize this result by finding E(Sk |Sn ) for all positive integers k and n.
  17.    s Consider a group of n roommate pairs at a college (so there are 2n students). Each
        of these 2n students independently decides randomly whether to take a certain course,
        with probability p of success (where “success” is defined as taking the course).
        Let N be the number of students among these 2n who take the course, and let X be
        the number of roommate pairs where both roommates in the pair take the course. Find
        E(X) and E(X|N ).


Conditional expectation                                                                           447

  18.    s Show that E((Y − E(Y |X))2 |X) = E(Y 2 |X) − (E(Y |X))2 , so these two expressions
        for Var(Y |X) agree.
        Hint for the variance: Adding a constant (or something acting as a constant) does not
        affect variance.
  19.   Let X be the height of a randomly chosen adult man, and Y be his father’s height, where
        X and Y have been standardized to have mean 0 and standard deviation 1. Suppose
        that (X, Y ) is Bivariate Normal, with X, Y ∼ N (0, 1) and Corr(X, Y ) = ρ.

        (a) Let y = ax + b be the equation of the best line for predicting Y from X (in the
        sense of minimizing the mean squared error), e.g., if we were to observe X = 1.3 then
        we would predict that Y is 1.3a + b. Now suppose that we want to use Y to predict
        X, rather than using X to predict Y . Give and explain an intuitive guess for what the
        slope is of the best line for predicting X from Y .

        (b) Find a constant c (in terms of ρ) and an r.v. V such that Y = cX + V , with V
        independent of X.

        Hint: Start by finding c such that Cov(X, Y − cX) = 0.

        (c) Find a constant d (in terms of ρ) and an r.v. W such that X = dY + W , with W
        independent of Y .

        (d) Find E(Y |X) and E(X|Y ).

        (e) Reconcile (a) and (d), if your intuitive guess in (a) differed from what the results of
        (d) implied. Give a clear and correct intuitive explanation of the relationship between
        the slope of the best line for predicting Y from X and the slope of the best line for
        predicting X from Y .
  20.   Let X ∼ Mult5 (n, p).

        (a) Find E(X1 |X2 ) and Var(X1 |X2 ).

        (b) Find E(X1 |X2 + X3 ).
  21.   Let Y be a discrete r.v., A be an event with 0 < P (A) < 1, and IA be the indicator
        r.v. for A.

        (a) Explain precisely how the r.v. E(Y |IA ) relates to the numbers E(Y |A) and E(Y |Ac ).

        (b) Show that E(Y |A) = E(Y IA )/P (A), directly from the definitions of expectation
        and conditional expectation.
        Hint: Let X = Y IA , and then find an expression for the PMF of X.

        (c) Use (b) to give a short proof of the fact that E(Y ) = E(Y |A)P (A) + E(Y |Ac )P (Ac ).
  22.   Show that the following version of LOTP, which we encountered in Section 7.1, is also
        a consequence of Adam’s law: for any event A and continuous r.v. X with PDF fX ,
                                             Z ∞
                                    P (A) =       P (A|X = x)fX (x)dx.
                                             −∞

        Hint: Consider E(I(A)|X = x).
  23.    s Let X and Y be random variables with finite variances, and let W = Y − E(Y |X).
        This is a residual : the difference between the true value of Y and the predicted value of
        Y based on X.

        (a) Compute E(W ) and E(W |X).

        (b) Compute Var(W ), for the case that W |X ∼ N (0, X 2 ) with X ∼ N (0, 1).


448                                                                          Introduction to Probability

  24.    s One of two identical-looking coins is picked from a hat randomly, where one coin has
        probability p1 of Heads and the other has probability p2 of Heads. Let X be the number
        of Heads after flipping the chosen coin n times. Find the mean and variance of X.
  25.   Kelly makes a series of n bets, each of which she has probability p of winning, indepen-
        dently. Initially, she has x0 dollars. Let Xj be the amount she has immediately after her
        jth bet is settled. Let f be a constant in (0, 1), called the betting fraction. On each bet,
        Kelly wagers a fraction f of her wealth, and then she either wins or loses that amount.
        For example, if her current wealth is $100 and f = 0.25, then she bets $25 and either
        gains or loses that amount. (A famous choice when p > 1/2 is f = 2p − 1, which is
        known as the Kelly criterion.) Find E(Xn ) (in terms of n, p, f, x0 ).
        Hint: First find E(Xj+1 |Xj ).
  26.   Let N ∼ Pois(λ1 ) be the number of movies that will be released next year. Suppose
        that for each movie the number of tickets sold is Pois(λ2 ), independent of other movies
        and of N . Find the mean and variance of the number of movie tickets that will be sold
        next year.
  27.   A party is being held from 8:00 pm to midnight on a certain night, and N ∼ Pois(λ)
        people are going to show up. They will all arrive at uniformly random times while the
        party is going on, independently of each other and of N .

        (a) Find the expected time at which the first person arrives, given that at least one
        person shows up. Give both an exact answer in terms of λ, measured in minutes after
        8:00 pm, and an answer rounded to the nearest minute for λ = 20, expressed in time
        notation (e.g., 8:20 pm).

        (b) Find the expected time at which the last person arrives, given that at least one
        person shows up. As in (a), give both an exact answer and an answer rounded to the
        nearest minute for λ = 20.
  28.    s We wish to estimate an unknown parameter θ, based on an r.v. X we will get to
        observe. As in the Bayesian perspective, assume that X and θ have a joint distribution.
        Let θ̂ be the estimator (which is a function of X). Then θ̂ is said to be unbiased if
        E(θ̂|θ) = θ, and θ̂ is said to be the Bayes procedure if E(θ|X) = θ̂.

        (a) Let θ̂ be unbiased. Find E(θ̂ − θ)2 (the average squared difference between the
        estimator and the true value of θ), in terms of marginal moments of θ̂ and θ.
        Hint: Condition on θ.

        (b) Repeat (a), except in this part suppose that θ̂ is the Bayes procedure rather than
        assuming that it is unbiased.
        Hint: Condition on X.

        (c) Show that it is impossible for θ̂ to be both the Bayes procedure and unbiased, except
        in silly problems where we get to know θ perfectly by observing X.
        Hint: If Y is a nonnegative r.v. with mean 0, then P (Y = 0) = 1.
  29.   Show that if E(Y |X) = c is a constant, then X and Y are uncorrelated.
        Hint: Use Adam’s law to find E(Y ) and E(XY ).
  30.   Show by example that it is possible to have uncorrelated X and Y such that E(Y |X)
        is not a constant.
        Hint: Consider a standard Normal and its square.
  31.    s Emails arrive one at a time in an inbox. Let Tn be the time at which the nth email
        arrives (measured on a continuous scale from some starting point in time). Suppose that
        the waiting times between emails are i.i.d. Expo(λ), i.e., T1 , T2 −T1 , T3 −T2 , . . . are i.i.d.
        Expo(λ).


Conditional expectation                                                                            449

        Each email is non-spam with probability p, and spam with probability q = 1 − p (in-
        dependently of the other emails and of the waiting times). Let X be the time at which
        the first non-spam email arrives (so X is a continuous r.v., with X = T1 if the 1st email
        is non-spam, X = T2 if the 1st email is spam but the 2nd one isn’t, etc.).

        (a) Find the mean and variance of X.

        (b) Find the MGF of X. What famous distribution does this imply that X has (be sure
        to state its parameter values)?
        Hint for both parts: Let N be the number of emails until the first non-spam (including
        that one), and write X as a sum of N terms; then condition on N .
  32.   Customers arrive at a store according to a Poisson process of rate λ customers per hour.
        Each makes a purchase with probability p, independently. Given that a customer makes
        a purchase, the amount spent has mean µ (in dollars) and variance σ 2 .

        (a) Find the mean and variance of how much a random customer spends (note that the
        customer may spend nothing).

        (b) Find the mean and variance of the revenue the store obtains in an 8-hour time
        interval, using (a) and results from this chapter.

        (c) Find the mean and variance of the revenue the store obtains in an 8-hour time
        interval, using the chicken-egg story and results from this chapter.
  33.   Fred’s beloved computer will last an Expo(λ) amount of time until it has a malfunction.
        When that happens, Fred will try to get it fixed. With probability p, he will be able to
        get it fixed. If he is able to get it fixed, the computer is good as new again and will last
        an additional, independent Expo(λ) amount of time until the next malfunction (when
        again he is able to get it fixed with probability p, and so on). If after any malfunction
        Fred is unable to get it fixed, he will buy a new computer. Find the expected amount
        of time until Fred buys a new computer. (Assume that the time spent on computer
        diagnosis, repair, and shopping is negligible.)
  34.   A green die is rolled until it lands 1 for the first time. An orange die is rolled until it
        lands 6 for the first time. The dice are fair, six-sided dice. Let T1 be the sum of the
        values of the rolls of the green die (including the 1 at the end) and T6 be the sum of
        the values of the rolls of the orange die (including the 6 at the end). Two students are
        debating whether E(T1 ) = E(T6 ) or E(T1 ) < E(T6 ). They kindly gave permission to
        quote their arguments here.

        Student A: We have E(T1 ) = E(T6 ). By Adam’s law, the expected sum of the rolls of
        a die is the expected number of rolls times the expected value of one roll, and each of
        these factors is the same for the two dice. In more detail, let N1 be the number of rolls
        of the green die and N6 be the number of rolls of the orange die. By Adam’s law and
        linearity,
                             E(T1 ) = E(E(T1 |N1 )) = E(3.5N1 ) = 3.5E(N1 ),
        and the same method applied to the orange die gives 3.5E(N6 ), which equals 3.5E(N1 ).

        Student B: Actually, E(T1 ) < E(T6 ). I agree that the expected number of rolls is the
        same for the two dice, but the key difference is that we know the last roll is a 1 for the
        green die and a 6 for the orange die. The expected totals are the same for the two dice
        excluding the last roll of each, and then including the last roll makes E(T1 ) < E(T6 ).

        (a) Discuss in words the extent to which Student A’s argument is convincing and correct.

        (b) Discuss in words the extent to which Student B’s argument is convincing and correct.

        (c) Give careful derivations of E(T1 ) and E(T6 ).


450                                                                        Introduction to Probability

  35.    s Judit plays in a total of N ∼ Geom(s) chess tournaments in her career. Suppose that
        in each tournament she has probability p of winning the tournament, independently.
        Let T be the number of tournaments she wins in her career.
        (a) Find the mean and variance of T .
        (b) Find the MGF of T . What is the name of this distribution (with its parameters)?
  36.   In Story 8.4.5, we showed (among other things) that if λ ∼ Gamma(r0 , b0 ) and Y |λ ∼
        Pois(λ), then the marginal distribution of Y is NBin(r0 , b0 /(b0 + 1)). Derive this result
        using Adam’s law and MGFs.
        Hint: Consider the conditional MGF of Y |λ.
  37.   Let X1 , . . . , Xn be i.i.d. r.v.s with mean µ and variance σ 2 , and n ≥ 2. A bootstrap sample
        of X1 , . . . , Xn is a sample of n r.v.s X1∗ , . . . , Xn∗ formed from the Xj by sampling with
        replacement with equal probabilities. Let X̄ ∗ denote the sample mean of the bootstrap
        sample:
                                                    1
                                              X̄ ∗ = (X1∗ + · · · + Xn∗ ) .
                                                    n
        (a) Calculate E(Xj∗ ) and Var(Xj∗ ) for each j.
        (b) Calculate E(X̄ ∗ |X1 , . . . , Xn ) and Var(X̄ ∗ |X1 , . . . , Xn ).
        Hint: Conditional on X1 , . . . , Xn , the Xj∗ are independent, with a PMF that puts proba-
        bility 1/n at each of the points X1 , . . . , Xn . As a check, your answers should be random
        variables that are functions of X1 , . . . , Xn .
        (c) Calculate E(X̄ ∗ ) and Var(X̄ ∗ ).
        (d) Explain intuitively why Var(X̄) < Var(X̄ ∗ ).
  38.   An insurance company covers disasters in two neighboring regions, R1 and R2 . Let I1
        and I2 be the indicator r.v.s for whether R1 and R2 are hit by the insured disaster,
        respectively. The indicators I1 and I2 may be dependent. Let pj = E(Ij ) for j = 1, 2,
        and p12 = E(I1 I2 ).
        The company reimburses a total cost of
                                             C = I1 · T1 + I2 · T2
        to these regions, where Tj has mean µj and variance σj2 . Assume that T1 and T2 are
        independent of each other and that (T1 , T2 ) is independent of (I1 , I2 ).
        (a) Find E(C).
        (b) Find Var(C).
  39.    s A certain stock has low volatility on some days and high volatility on other days.
        Suppose that the probability of a low volatility day is p and of a high volatility day
        is q = 1 − p, and that on low volatility days the percent change in the stock price is
        N (0, σ12 ), while on high volatility days the percent change is N (0, σ22 ), with σ1 < σ2 .
        Let X be the percent change of the stock on a certain day. The distribution is said to
        be a mixture of two Normal distributions, and a convenient way to represent X is as
        X = I1 X1 +I2 X2 where I1 is the indicator r.v. of having a low volatility day, I2 = 1−I1 ,
        Xj ∼ N (0, σj2 ), and I1 , X1 , X2 are independent.
        (a) Find Var(X) in two ways: using Eve’s law, and by using properties of covariance to
        calculate Cov(I1 X1 + I2 X2 , I1 X1 + I2 X2 ).
        (b) Recall from Chapter 6 that the kurtosis of an r.v. Y with mean µ and standard
        deviation σ is defined by
                                               E(Y − µ)4
                                    Kurt(Y ) =             − 3.
                                                    σ4


Conditional expectation                                                                                  451

        Find the kurtosis of X (in terms of p, q, σ12 , σ22 , fully simplified). The result will show that
        even though the kurtosis of any Normal distribution is 0, the kurtosis of X is positive
        and in fact can be very large depending on the parameter values.
  40.   Let X1 , X2 , and Y be random variables, such that Y has finite variance. Let
                                   A = E(Y |X1 ) and B = E(Y |X1 , X2 ).
        Show that
                                              Var(A) ≤ Var(B).
        Also, check that this make sense in the extreme cases where Y is independent of X1
        and where Y = h(X2 ) for some function h.
        Hint: Use Eve’s law on B.
  41.   Show that for any r.v.s X and Y ,
                                          E(Y |E(Y |X)) = E(Y |X).
        This has a nice intuitive interpretation if we think of E(Y |X) as the prediction we would
        make for Y based on X: given the prediction we would use for predicting Y from X,
        we no longer need to know X to predict Y —we can just use the prediction we have!
        For example, letting E(Y |X) = g(X), if we observe g(X) = 7, then we may or may
        not know what X is (since g may not be one-to-one). But even without knowing X, we
        know that the prediction for Y based on X is 7.
        Hint: Use Adam’s law with extra conditioning.
  42.   A researcher wishes to know whether a new treatment for the disease conditionitis is
        more effective than the standard treatment. It is unfortunately not feasible to do a
        randomized experiment, but the researcher does have the medical records of patients
        who received the new treatment and those who received the standard treatment. She
        is worried, though, that doctors tend to give the new treatment to younger, healthier
        patients. If this is the case, then naively comparing the outcomes of patients in the two
        groups would be like comparing apples and oranges.
        Suppose each patient has background variables X, which might be age, height and
        weight, and measurements relating to previous health status. Let Z be the indicator of
        receiving the new treatment. The researcher fears that Z is dependent on X, i.e., that
        the distribution of X given Z = 1 is different from the distribution of X given Z = 0.
        In order to compare apples to apples, the researcher wants to match every patient who
        received the new treatment to a patient with similar background variables who received
        the standard treatment. But X could be a high-dimensional random vector, which often
        makes it very difficult to find a match with a similar value of X.
        The propensity score reduces the possibly high-dimensional vector of background vari-
        ables down to a single number (then it is much easier to match someone to a person
        with a similar propensity score than to match someone to a person with a similar value
        of X). The propensity score of a person with background characteristics X is defined as
                                                 S = E(Z|X).

        By the fundamental bridge, a person’s propensity score is their probability of receiving
        the treatment, given their background characteristics. Show that conditional on S, the
        treatment indicator Z is independent of the background variables X.
        Hint: This problem relates to the previous one. Show that P (Z = 1|S, X) = P (Z = 1|S),
        which is equivalent to showing E(Z|S, X) = E(Z|S).
  43.   This exercise develops a useful identity for covariance, similar in spirit to Adam’s law for
        expectation and Eve’s law for variance. First define conditional covariance in a manner
        analogous to how we defined conditional variance:
                                                                                 
                          Cov(X, Y |Z) = E (X − E(X|Z))(Y − E(Y |Z))|Z .


452                                                                      Introduction to Probability

        (a) Show that
                              Cov(X, Y |Z) = E(XY |Z) − E(X|Z)E(Y |Z).
        This should be true since it is the conditional version of the fact that

                                   Cov(X, Y ) = E(XY ) − E(X)E(Y )

        and conditional probabilities are probabilities, but for this problem you should prove it
        directly using properties of expectation and conditional expectation.
        (b) ECCE, or the law of total covariance, says that

                        Cov(X, Y ) = E(Cov(X, Y |Z)) + Cov(E(X|Z), E(Y |Z)).

        That is, the covariance of X and Y is the expected value of their conditional covari-
        ance plus the covariance of their conditional expectations, where all these conditional
        quantities are conditional on Z. Prove this identity.
        Hint: We can assume without loss of generality that E(X) = E(Y ) = 0, since adding
        a constant to an r.v. has no effect on its covariance with any r.v. Then expand out the
        covariances on the right-hand side of the identity and apply Adam’s law.


        Mixed practice
  44.   A group of n friends often go out for dinner together. At their dinners, they play “credit
        card roulette” to decide who pays the bill. This means that at each dinner, one person
        is chosen uniformly at random to pay the entire bill (independently of what happens at
        the other dinners).

        (a) Find the probability that in k dinners, no one will have to pay the bill more than
        once (do not simplify for the case k ≤ n, but do simplify fully for the case k > n).

        (b) Find the expected number of dinners it takes in order for everyone to have paid at
        least once (you can leave your answer as a finite sum of simple-looking terms).

        (c) Alice and Bob are two of the friends. Find the covariance between how many times
        Alice pays and how many times Bob pays in k dinners.
  45.   As in the previous problem, a group of n friends play “credit card roulette” at their
        dinners. In this problem, let the number of dinners be a Pois(λ) r.v.

        (a) Alice is one of the friends. Find the correlation between how many dinners Alice
        pays for and how many free dinners Alice gets.

        (b) The costs of the dinners are i.i.d. Gamma(a, b) r.v.s, independent of the number of
        dinners. Find the mean and variance of the total cost.
  46.   Joe will read N ∼ Pois(λ) books next year. Each book has a Pois(µ) number of pages,
        with book lengths independent of each other and independent of N .

        (a) Find the expected number of book pages that Joe will read next year.

        (b) Find the variance of the number of book pages Joe will read next year.

        (c) For each of the N books, Joe likes it with probability p and dislikes it with probability
        1 − p, independently. Find the conditional distribution of how many of the N books Joe
        likes, given that he dislikes exactly d of the books.
  47.   Buses arrive at a certain bus stop according to a Poisson process of rate λ. Each bus
        has n seats and, at the instant when it arrives at the stop, has a Bin(n, p) number of
        passengers. Assume that the numbers of passengers on different buses are independent
        of each other, and independent of the arrival times of the buses.


Conditional expectation                                                                              453

        Let Nt be the number of buses that arrive in the time interval [0, t], and Xt be the total
        number of passengers on the buses that arrive in the time interval [0, t].
        (a) Find the mean and variance of Nt .
        (b) Find the mean and variance of Xt .
        (c) A bus is full if it has exactly n passengers when it arrives at the stop. Find the
        probability that exactly a + b buses arrive in [0, t], of which a are full and b are not full.
  48.   Paul and n other runners compete in a marathon. Their times are independent contin-
        uous r.v.s with CDF F .
        (a) For j = 1, 2, . . . , n, let Aj be the event that anonymous runner j completes the race
        faster than Paul. Explain whether the events Aj are independent, and whether they are
        conditionally independent given Paul’s time to finish the race.
        (b) For the rest of this problem, let N be the number of runners who finish faster than
        Paul. Find E(N ). (Your answer should depend only on n, since Paul’s time is an r.v.)
        (c) Find the conditional distribution of N , given that Paul’s time to finish the marathon
        is t.
        (d) Find Var(N ). (Your answer should depend only on n, since Paul’s time is an r.v.)
        Hint: Let T be Paul’s time, and use Eve’s law to condition on T . Alternatively, use
        indicator r.v.s.
  49.   Emails arrive in an inbox according to a Poisson process of rate λ emails per hour.
        (a) Find the name and parameters of the conditional distribution of the number of
        emails that arrive in the first 2 hours of an 8-hour time period, given that exactly n
        emails arrive in that time period.
        (b) Each email is legitimate with probability p and spam with probability q = 1 − p,
        independently. Find the name and parameters of the conditional distribution of the
        number of legitimate emails that arrive in an 8-hour time period, given that exactly s
        spams arrived in that time period.
        (c) Reading an email takes a random amount of time, with mean µ hours and standard
        deviation σ hours. These reading times are i.i.d. and independent of the email arrival
        process. Find the (unconditional) mean and variance of the total time it takes to read
        all the emails that arrive in an 8-hour time period.
  50.   An actuary wishes to estimate various quantities related to the number of insurance
        claims and the dollar amounts of those claims for someone named Fred. Suppose that
        Fred will make N claims next year, where N |λ ∼ Pois(λ). But λ is unknown, so the ac-
        tuary, taking a Bayesian approach, gives λ a prior distribution based on past experience.
        Specifically, the prior is λ ∼ Expo(1). The dollar amount of a claim is Log-Normal with
        parameters µ and σ 2 (here µ and σ 2 are the mean and variance of the underlying Nor-
        mal), with µ and σ 2 known. The dollar amounts of the claims are i.i.d. and independent
        of N .
        (a) Find E(N ) and Var(N ) using properties of conditional expectation (your answers
        should not depend on λ, since λ is unknown and being treated as an r.v.!).
        (b) Find the mean and variance of the total dollar amount of all the claims.
        (c) Find the distribution of N . If it is a named distribution we have studied, give its
        name and parameters.
        (d) Find the posterior distribution of λ, given that it is observed that Fred makes
        N = n claims next year. If it is a named distribution we have studied, give its name
        and parameters.


454                                                                    Introduction to Probability

  51.   s Let X1 , X2 , X3 be independent with Xi ∼ Expo(λi ) (so with possibly different rates).
        Recall from Chapter 7 that
                                                            λ1
                                        P (X1 < X2 ) =           .
                                                         λ1 + λ2

        (a) Find E(X1 + X2 + X3 |X1 > 1, X2 > 2, X3 > 3) in terms of λ1 , λ2 , λ3 .

        (b) Find P (X1 = min(X1 , X2 , X3 )), the probability that the first of the three Exponen-
        tials is the smallest.
        Hint: Restate this in terms of X1 and min(X2 , X3 ).

        (c) For the case λ1 = λ2 = λ3 = 1, find the PDF of max(X1 , X2 , X3 ). Is this one of the
        important distributions we have studied?
  52.    s A task is randomly assigned to one of two people (with probability 1/2 for each
        person). If assigned to the first person, the task takes an Expo(λ1 ) length of time
        to complete (measured in hours), while if assigned to the second person it takes an
        Expo(λ2 ) length of time to complete (independent of how long the first person would
        have taken). Let T be the time taken to complete the task.

        (a) Find the mean and variance of T .

        (b) Suppose instead that the task is assigned to both people, and let X be the time
        taken to complete it (by whoever completes it first, with the two people working in-
        dependently). It is observed that after 24 hours, the task has not yet been completed.
        Conditional on this information, what is the expected value of X?
  53.   Suppose for this problem that “true IQ” is a meaningful concept rather than a reified
        social construct. Suppose that in the U.S. population, the distribution of true IQs is
        Normal with mean 100 and SD 15. A person is chosen at random from this population
        to take an IQ test. The test is a noisy measure of true ability: it’s correct on average
        but has a Normal measurement error with SD 5.
        Let µ be the person’s true IQ, viewed as a random variable, and let Y be her score on
        the IQ test. Then we have

                                           Y |µ ∼ N (µ, 52 )
                                             µ ∼ N (100, 152 ).

        (a) Find the unconditional mean and variance of Y .
        (b) Find the marginal distribution of Y . One way is via the MGF.
        (c) Find Cov(µ, Y ).
  54.    s A certain genetic characteristic is of interest. It can be measured numerically. Let X1
        and X2 be the values of the genetic characteristic for two twin boys. Given that they
        are identical twins, X1 = X2 and X1 has mean 0 and variance σ 2 ; given that they are
        fraternal twins, X1 and X2 have mean 0, variance σ 2 , and correlation ρ. The probability
        that the twins are identical is 1/2. Find Cov(X1 , X2 ) in terms of ρ, σ 2 .
  55.    s The Mass Cash lottery randomly chooses 5 of the numbers from 1, 2, . . . , 35 each day
        (without repetitions within the choice of 5 numbers). Suppose that we want to know
        how long it will take until all numbers have been chosen. Let aj be the average number
        of additional days needed if we are missing j numbers (so a0 = 0 and a35 is the average
        number of days needed to collect all 35 numbers). Find a recursive formula for the aj .
  56.   Two chess players, Vishy and Magnus, play a series of games. Given p, the game results
        are i.i.d. with probability p of Vishy winning, and probability q = 1 − p of Magnus
        winning (assume that each game ends in a win for one of the two players). But p is


Conditional expectation                                                                              455

        unknown, so we will treat it as an r.v. To reflect our uncertainty about p, we use the
        prior p ∼ Beta(a, b), where a and b are known positive integers and a ≥ 2.

        (a) Find the expected number of games needed in order for Vishy to win a game (in-
        cluding the win). Simplify fully; your final answer should not use factorials or Γ.
        (b) Explain in terms of independence vs. conditional independence the direction of the
                                                                              a
        inequality between the answer to (a) and 1 + E(G) for G ∼ Geom( a+b      ).
        (c) Find the conditional distribution of p given that Vishy wins exactly 7 out of the first
        10 games.
  57.   Laplace’s law of succession says that if X1 , X2 , . . . , Xn+1 are conditionally indepen-
        dent Bern(p) r.v.s given p, but p is given a Unif(0, 1) prior to reflect ignorance about its
        value, then
                                                                      k+1
                               P (Xn+1 = 1|X1 + · · · + Xn = k) =           .
                                                                      n+2
        As an example, Laplace discussed the problem of predicting whether the sun will rise
        tomorrow, given that the sun did rise every time for all n days of recorded history; the
        above formula then gives (n + 1)/(n + 2) as the probability of the sun rising tomorrow
        (of course, assuming independent trials with p unchanging over time may be a very
        unreasonable model for the sunrise problem).

        (a) Find the posterior distribution of p given X1 = x1 , X2 = x2 , . . . , Xn = xn , and show
        that it only depends on the sum of the xj (so we only need the one-dimensional quantity
        x1 + x2 + · · · + xn to obtain the posterior distribution, rather than needing all n data
        points).

        (b) Prove Laplace’s law of succession, using a form of the law of total probability to
        find P (Xn+1 = 1|X1 + · · · + Xn = k) by conditioning on p. (The next exercise, which is
        closely related, involves an equivalent Adam’s law proof.)
  58.   Two basketball teams, A and B, play an n game match. Let Xj be the indicator of team
        A winning the jth game. Given p, the r.v.s X1 , . . . , Xn are i.i.d. with Xj |p ∼ Bern(p).
        But p is unknown, so we will treat it as an r.v. Let the prior distribution be p ∼ Unif(0, 1),
        and let X be the number of wins for team A.

        (a) Find E(X) and Var(X).

        (b) Use Adam’s law to find the probability that team A will win game j + 1, given that
        they win exactly a of the first j games. (The previous exercise, which is closely related,
        involves an equivalent LOTP proof.)
        Hint: Letting C be the event that team A wins exactly a of the first j games,

                     P (Xj+1 = 1|C) = E(Xj+1 |C) = E(E(Xj+1 |C, p)|C) = E(p|C).

        (c) Find the PMF of X. (There are various ways to do this, including a very fast way
        to see it based on results from earlier chapters.)

        (d) The Putnam exam from 2002 posed the following problem:
        Shanille O’Keal shoots free throws on a basketball court. She hits the first and misses
        the second, and thereafter the [conditional] probability that she hits the next shot is equal
        to the proportion of shots she has hit so far. What is the probability she hits exactly 50
        of her first 100 shots?
        Solve this Putnam problem by applying the result of Part (c). Be sure to explain why
        it is valid to apply that result, despite the fact that the Putnam problem does not seem
        to be using the same model, e.g., it does not mention a prior distribution, let alone
        mention a Unif(0, 1) prior.


456                                                                        Introduction to Probability

  59.   Let X|p ∼ Bin(n, p), with p ∼ Beta(a, b). So X has a Beta-Binomial distribution, as
        mentioned in Story 8.3.3 and Example 8.5.3. Find E(X) and Var(X).
  60.   An election is being held. There are two candidates, A and B, and there are n voters.
        The probability of voting for Candidate A varies by city. There are m cities, labeled
        1, 2, . . . , m. The jth city has nj voters, so n1 + n2 + · · · + nm = n. Let Xj be the number
        of people in the jth city who vote for Candidate A, with Xj |pj ∼ Bin(nj , pj ). To reflect
        our uncertainty about the probability of voting in each city, we treat p1 , . . . , pm as r.v.s,
        with prior distribution asserting that they are i.i.d. Unif(0, 1). Assume that X1 , . . . , Xm
        are independent, both unconditionally and conditional on p1 , . . . , pm . Let X be the total
        number of votes for Candidate A.

        (a) Find the marginal distribution of X1 and the posterior distribution of p1 |(X1 = k1 ).

        (b) Find E(X) and Var(X) in terms of n and s, where s = n21 + n22 + · · · + n2m .


10
Inequalities and limit theorems



“What should I do if I can’t calculate a probability or expectation exactly?” Almost
everyone who uses probability has to deal with this sometimes. Don’t panic. There
are powerful strategies available: simulate it, bound it, or approximate it.
• Simulations using Monte Carlo: We have already seen many examples of simula-
  tions in this book; the R sections give numerous examples where a few lines of
  code and a few seconds on a computer suffice to get good approximate answers.
  “Monte Carlo” just means that the simulations use random numbers (the term
  originated from the Monte Carlo Casino in Monaco).
  Monte Carlo simulation is an extremely powerful technique, and there are many
  problems where it is the only reasonable approach currently available. So why not
  always just do a simulation? Here are a few reasons:

      1. The simulation may need to run for an extremely long time, even on a
         fast computer. A major extension known as Markov chain Monte Carlo,
         introduced in Chapter 12, greatly increases the range of problems for
         which Monte Carlo simulation is feasible. But even then, the simulation
         may need to run for a vast, unknown amount of time to get decent
         answers to the problem.
      2. We may hope to get a good answer for all values of the parameters of the
         problem. For example, in the coupon collector problem (Example 4.3.12)
         we saw that with n toy types, it takes about n log n toys on average to
         get a complete set. This is a simple, memorable answer. It would be easy
         to simulate this for any specific n, e.g., we could run a coupon collector
         process for n = 20 and get an answer of around 60. But this would not
         make it easy to see the general n log n result.
      3. A simulation result is easy to criticize: how do you know you ran it long
         enough? How do you know your result is close to the truth? How close
         is “close”? We may want provable guarantees instead.

• Bounds using inequalities: A bound on a probability gives a provable guarantee
  that the probability is in a certain range. In the first part of this chapter, we’ll
  introduce several important inequalities in probability. These inequalities will often
  allow us to narrow down the range of possible values for the exact answer, that
  is, to determine an upper bound and/or lower bound. A bound may not provide a

                                                                                    457


458                                                           Introduction to Probability

  good approximation—if we have bounds of [0.2, 0.6] for a probability we’re trying
  to find, the exact answer could be anywhere within that range—but at least we
  know the exact answer is guaranteed to be inside the bounds.
• Approximations using limit theorems: Later in the chapter, we will discuss the two
  most famous theorems in probability: the law of large numbers and the central limit
  theorem. Both tell us what happens to the sample mean as we obtain more and
  more data. Limit theorems let us make approximations which are likely to work
  well when we have a large number of data points. We conclude the chapter by using
  limit theorems to study a couple of important named distributions in statistics.




10.1     Inequalities

10.1.1    Cauchy-Schwarz: a marginal bound on a joint expectation

The Cauchy-Schwarz inequality is one of the most famous inequalities in all of
mathematics. In probability, it takes the following form.
Theorem 10.1.1 (Cauchy-Schwarz). For any r.v.s X and Y with finite variances,
                                  p
                      |E(XY )| ≤ E(X 2 )E(Y 2 ).

Proof. For any t,

                 0 ≤ E(Y − tX)2 = E(Y 2 ) − 2tE(XY ) + t2 E(X 2 ).

Where did t come from? The idea is to introduce t so that we have infinitely many
inequalities, one for each value of t, and then we can use calculus to find the value of
t that gives us the best inequality. Differentiating the right-hand side with respect
to t and setting it equal to 0, we get that t = E(XY )/E(X 2 ) minimizes the right-
hand side, resulting in the tightest bound. Plugging in this value of t, we have the
Cauchy-Schwarz inequality.                                                            

If X and Y are uncorrelated, then E(XY ) = E(X)E(Y ), which depends only on the
marginal expectations E(X) and E(Y ). But in general, calculating E(XY ) exactly
requires knowing the joint distribution of X and Y (and being able to work with
it). The Cauchy-Schwarz inequality lets us bound E(XY ) in terms of the marginal
second moments E(X 2 ) and E(Y 2 ).
If X and Y have mean 0, then Cauchy-Schwarz already has a very familiar statistical
interpretation: it says that their correlation is between −1 and 1.
Example 10.1.2. Let E(X) = E(Y ) = 0. Then

            E(XY ) = Cov(X, Y ), E(X 2 ) = Var(X), E(Y 2 ) = Var(Y ),


Inequalities and limit theorems                                                                  459

so Cauchy-Schwarz reduces to the statement |Corr(X, Y )| ≤ 1. Of course, we already
knew this from Theorem 7.3.5. Now let’s see what happens if we drop the assumption
that the means are 0. Applying Cauchy-Schwarz to the centered r.v.s X − E(X)
and Y − E(Y ), we again have that |Corr(X, Y )| ≤ 1.                              
Cauchy-Schwarz can often be applied in creative ways. p For example, if we write
X = X · 1, then Cauchy-Schwarz gives |E(X · 1)| ≤ E(X 2 )E(12 ), which reduces
to E(X 2 ) ≥ (EX)2 . This gives a quick new proof that variances are nonnegative. As
another example, we will obtain an upper bound on the probability of a nonnegative
r.v. equaling 0.
Example 10.1.3 (Second moment method). Let X be a nonnegative r.v., and
suppose that we want an upper bound on P (X = 0). For example, X could be
the number of questions that Fred gets wrong on an exam (then P (X = 0) is the
probability of Fred getting a perfect score), or X could be the number of pairs of
people at a party with the same birthday (then P (X = 0) is the probability of no
birthday matches). Note that

                                     X = XI(X > 0),

where I(X > 0) is the indicator of X > 0. This is true since if X = 0 then both
sides are 0, while if X > 0 then both sides are X. By Cauchy-Schwarz,
                                            p
                  E(X) = E(XI(X > 0)) ≤ E(X 2 )E(I(X > 0)).

Rearranging this and using the fundamental bridge, we have

                                                      (EX)2
                                   P (X > 0) ≥                ,
                                                      E(X 2 )
or equivalently,
                                                      Var(X)
                                  P (X = 0) ≤                 .
                                                      E(X 2 )
Applying this bound is sometimes called the second moment method. For example,
let’s apply the bound in the case that

                                    X = I1 + · · · + In ,

where the Ij are uncorrelated indicator r.v.s. Let pj = E(Ij ). Then
                      n
                      X                  n
                                         X                     n
                                                               X            n
                                                                            X
          Var(X) =          Var(Ij ) =         (pj − p2j ) =         pj −         p2j = µ − c,
                      j=1                j=1                   j=1          j=1
                        Pn       2            2                 2   2
where µ = E(X), c =         j=1 pj . Also, E(X ) = Var(X) + (EX) = µ + µ − c. So

                                    Var(X)     µ−c    1
                     P (X = 0) ≤        2
                                           = 2     ≤     ,
                                    E(X )   µ +µ−c   µ+1
where the last inequality is easily checked by cross-multiplying. In general, it is


460                                                         Introduction to Probability

wrong to say “if X has a high mean, then it has a small chance of being 0”, since it
could be that X is usually 0 but has a small chance of being extremely large. But
in our current setting, we have a simple, quantitative way to say that X having a
high mean does mean that X is unlikely to be 0.
For example, suppose there are 14 people in a room. How likely is it that there are
two people with the same birthday or birthdays one day apart? This is much harder
to solve exactly than the birthday problem, so in Example 4.7.6 we used a Poisson
approximation. But we may want a guarantee from a bound rather than worrying
about whether the Poisson approximation is good enough. Let X be the number of
“near birthday” pairs. Using indicator r.v.s, we have E(X) = 14    3
                                                               2 365 . So
                                           1
                          P (X = 0) ≤            < 0.573.
                                        E(X) + 1
The true answer for P (X = 0) turns out to be 0.46 (to two decimal places), which
is consistent with the bound.                                                  
Cauchy-Schwarz also allows us to deduce the existence of a joint MGF from the
existence of marginal MGFs; this is another example of the benefit of being able to
bound a joint distribution quantity by marginal distribution quantities.
Example 10.1.4 (Existence of joint MGF). Let X1 and X2 be jointly distributed
r.v.s, not necessarily independent or identically distributed. Show that if X1 and X2
both have MGFs marginally, then the random vector (X1 , X2 ) has a joint MGF.
Solution:
Recall from Chapter 7 that the joint MGF is defined as M (s, t) = E(esX1 +tX2 ), and
exists if the expectation is finite in a box around the origin. The marginal MGFs are
E(esX1 ) and E(etX2 ); each is required to be finite in an interval around the origin.
Suppose the MGFs of X1 and X2 are finite on (−a, a). Fix s and t in (−a/2, a/2).
By Cauchy-Schwarz,
                                    q
                     E(esX1 +tX2 ) ≤ E(e2sX1 )E(e2tX2 ).

The right-hand side is finite by assumption, so E(esX1 +tX2 ) is finite in the box
{(s, t) : s, t ∈ (−a/2, a/2)}. Hence the joint MGF of (X1 , X2 ) exists.        


10.1.2      Jensen: an inequality for convexity

In h 4.3.13, we discussed that for nonlinear functions g, E(g(X)) may be very
different from g(E(X)). If g is either a convex function or a concave function,
Jensen’s inequality tells us exactly which of E(g(X)) and g(E(X)) is greater. See
the math appendix for information about convex and concave functions. Often we
can take the second derivative to test for convexity or concavity: assuming that g 00
exists, g being convex is equivalent to g 00 (x) ≥ 0 everywhere in the domain, and g
being concave is equivalent to g 00 (x) ≤ 0 everywhere in the domain.


Inequalities and limit theorems                                                          461

Theorem 10.1.5 (Jensen). Let X be a random variable. If g is a convex function,
then E(g(X)) ≥ g(E(X)). If g is a concave function, then E(g(X)) ≤ g(E(X)). In
both cases, the only way that equality can hold is if there are constants a and b
such that g(X) = a + bX with probability 1.

Proof. If g is convex, then all lines that are tangent to g lie below g (see Figure 10.1).
In particular, let µ = E(X), and consider the tangent line at the point (µ, g(µ)).
(If g is differentiable at µ then the tangent line is unique; otherwise, choose any
tangent line at µ.) Denoting this tangent line by a + bx, we have g(x) ≥ a + bx for
all x by convexity, so g(X) ≥ a + bX. Taking the expectation of both sides,

          E(g(X)) ≥ E(a + bX) = a + bE(X) = a + bµ = g(µ) = g(E(X)),

as desired. If g is concave, then h = −g is convex, so we can apply what we just
proved to h to see that the inequality for g is reversed from the convex case.
Lastly, assume that equality holds in the convex case. Let Y = g(X) − a − bX.
Then Y is a nonnegative r.v. with E(Y ) = 0, so P (Y = 0) = 1 (even a tiny nonzero
chance of Y > 0 occurring would make E(Y ) > 0). So equality holds if and only if
P (g(X) = a + bX) = 1. For the concave case, we can use the same argument with
Y = a + bX − g(X).                                                              




                               y = g(x)


                                                    (μ,g(μ))




                              y = a + bx



FIGURE 10.1
Since g is convex, the tangent lines lie below the curve. In particular, the tangent
line at the point (µ, g(µ)) lies below the curve.

Let’s check Jensen’s inequality in a couple of simple known cases.
• Since g(x) = x2 is convex (its second derivative is 2), Jensen’s inequality says
  E(X 2 ) ≥ (EX)2 , which we already knew to be true since variances are nonnegative
  (or by Cauchy-Schwarz).
• In the St. Petersburg paradox from Chapter 4, we found that E(2N ) > 2EN ,
  where N ∼ FS(1/2). Jensen’s inequality concurs since g(x) = 2x is convex (to find
  g 00 (x), write 2x = ex log 2 ). Moreover, it tells us that the direction of the inequality


462                                                                       Introduction to Probability

  would be the same no matter what distribution N has! The inequality will be
  strict unless N is constant (with probability 1).

If we ever forget the direction of Jensen’s inequality, these simple cases make it easy
to recover the correct direction. Here are a few more quick examples of Jensen’s
inequality:

• E|X| ≥ |EX|,

• E(1/X) ≥ 1/(EX), for positive r.v.s X,

• E(log(X)) ≤ log(EX), for positive r.v.s X.

As another example, we can use Jensen’s inequality to see the direction of the bias
if we estimate an unknown standard deviation using the sample standard deviation
of a data set.

Example 10.1.6 (Bias of sample standard deviation). Let X1 , . . . , Xn be i.i.d. ran-
dom variables with variance σ 2 . Recall from Theorem 6.3.4 that the sample variance
Sn2 is unbiased for estimating σ 2 . That is, E(Sn2 ) = σ 2 . However, we are often more
interested in estimating the standard deviation σ. A natural estimator for σ is the
sample standard deviation, Sn .

Jensen’s inequality shows us that Sn is biased for estimating σ. Moreover, it tells
us which way the inequality goes:
                                         p             p
                           E(Sn ) = E(       Sn2 ) ≤       E(Sn2 ) = σ,

so the sample standard deviation tends to underestimate the true standard devi-
ation. How biased it is depends on the distribution (so there is no universal way
to fix the bias, in contrast to the fact that defining sample variance with n − 1 in
the denominator makes it unbiased for all distributions). Fortunately, the bias is
typically minor if the sample size is reasonably large.                           

One area in which Jensen’s inequality is important is in information theory, the
study of how to quantify information. The principles of information theory have be-
come essential for communication and compression (e.g., for MP3s and cell phones).
Here are a few examples of applications of Jensen’s inequality.

Example 10.1.7 (Entropy). The surprise of learning that an event with probability
p happened is defined as log2 (1/p), measured in a unit called bits. Low-probability
events have high surprise, while an event with probability 1 has zero surprise. The
log is there so that if we observe two independent events A and B, the total surprise
is the same as the surprise from observing A∩B. The log is base 2 so that if we learn
that an event with probability 1/2 happened, the surprise is 1, which corresponds
to having received 1 bit of information.

Let X be a discrete r.v. whose distinct possible values are a1 , a2 , . . . , an , with prob-
abilities p1 , p2 . . . , pn respectively (so p1 + p2 + · · · + pn = 1). The entropy of X is


Inequalities and limit theorems                                                             463

defined to be the average surprise of learning the value of X:
                                               n
                                               X
                                  H(X) =             pj log2 (1/pj ).
                                               j=1

Note that the entropy of X depends only on the probabilities pj , not on the values aj .
So for example, H(X 3 ) = H(X), since X 3 has distinct possible values a31 , a32 , . . . , a3n ,
with probabilities p1 , p2 , . . . , pn —the same list of pj ’s as for X.
Using Jensen’s inequality, show that the maximum possible entropy for X is when
its distribution is uniform over a1 , a2 , . . . , an , i.e., pj = 1/n for all j. This makes
sense intuitively, since learning the value of X conveys the most information on
average when X is equally likely to take any of its values, and the least possible
information if X is a constant.
Solution:
Let X ∼ DUnif(a1 , . . . , an ), so that
                                         n
                                         X 1
                            H(X) =                 log2 (n) = log2 (n).
                                               n
                                         j=1

Let Y be an r.v. that takes on values 1/p1 , . . . , 1/pn with probabilities p1 , . . . , pn ,
respectively (with the natural modification if the 1/pj have some repeated values,
e.g., if 1/p1 = 1/p2 but none of the others are this value, then it gets p1 + p2 = 2p1
as its probability). Then H(Y ) = E(log2 (Y )) by LOTUS, and E(Y ) = n. So by
Jensen’s inequality,

                H(Y ) = E(log2 (Y )) ≤ log2 (E(Y )) = log2 (n) = H(X).

Since the entropy of an r.v. depends only on the probabilities pj and not on the
specific values that the r.v. takes on, the entropy of Y is unchanged if we alter
the support from 1/p1 , . . . , 1/pn to a1 , . . . , an . Therefore X, which is uniform on
a1 , . . . , an , has entropy at least as large as that of any other r.v. with support
a1 , . . . , an .                                                                        
Example 10.1.8 (Kullback-Leibler divergence). Let p = (p1 , . . . , pn ) and r =
(r1 , . . . , rn ) be probability vectors (so each is nonnegative and sums to 1). Think of
each as a possible PMF for a random variable whose support consists of n distinct
values. The Kullback-Leibler divergence between p and r is defined as
                                  n
                                  X                         n
                                                            X
                     D(p, r) =          pj log2 (1/rj ) −         pj log2 (1/pj ).
                                  j=1                       j=1

This is the difference between the average surprise we will experience when the
actual probabilities are p but we are instead working with r (for example, if p is
unknown and r is our current guess for p), and our average surprise when we work
with p. Show that the Kullback-Leibler divergence is nonnegative.


464                                                                           Introduction to Probability

Solution:
Using properties of logs, we have
                                             n
                                             X                       
                                                                 rj
                              D(p, r) = −          pj log2                .
                                                                 pj
                                             j=1

Let Y be a random variable that takes on values rj /pj with probabilities pj , so that
D(p, r) = −E(log2 (Y )) by LOTUS. Then by Jensen’s inequality,

               D(p, r) = −E(log2 (Y )) ≥ − log2 (E(Y )) = − log2 (1) = 0,

with equality if and only if p = r. This result tells us that we’re more surprised on
average when we work with the wrong probabilities than when we work with the
correct probabilities.                                                              
Example 10.1.9 (Log probability scoring). Imagine that on a multiple-choice
exam, instead of circling just one of the answer choices, you are asked to assign
a probability of correctness to each choice. Your score on a particular question is
the log of the probability that you assign to the correct answer. The maximum score
for a particular question is 0, and the minimum score is −∞, attained if you assign
zero probability to the correct answer.1
Suppose your personal probabilities of correctness for each of the n answer choices
are p1 , . . . , pn , where the pj are positive and sum to 1. Show that your expected score
on a question is maximized if you report your true probabilities pj , not any other
probabilities. In other words, under log probability scoring, you have no incentive
to lie about your beliefs and pretend to be more or less confident than you really
are (assuming that your goal is to maximize your expected score).
Solution:
This
Pn example is isomorphic to the previous one! Your expected   Pn score on a question is
   j=1 pj log pj if you report your true probabilities p, and  j=1 pj log rj if you report
false probabilities r. The difference between these two is precisely the Kullback-
Leibler divergence between p and r. This is always nonnegative, as we proved in
the previous example. Therefore your expected score is maximized when you report
your true probabilities.                                                                


10.1.3      Markov, Chebyshev, Chernoff: bounds on tail probabilities

The inequalities in this section provide bounds on the probability of an r.v. taking
on an “extreme” value in the right or left tail of a distribution.
   1
     Joe’s philosophy professor as an undergraduate at Caltech, Alan Hájek, used precisely this
system. He warned the class never to put a probability of zero, since a score of −∞ would not
only give a −∞ on that exam, but also it would spill through and result in a −∞ for the whole
semester, since a weighted average with even a tiny positive weight on a −∞ yields −∞. Despite
this warning, some students did put probability zero on the correct answers.


Inequalities and limit theorems                                                   465

Theorem 10.1.10 (Markov). For any r.v. X and constant a > 0,

                                                  E|X|
                                  P (|X| ≥ a) ≤        .
                                                   a

Proof. Let Y = |X|
                a . We need to show that P (Y ≥ 1) ≤ E(Y ). Note that

                                     I(Y ≥ 1) ≤ Y,

since if I(Y ≥ 1) = 0 then the inequality reduces to Y ≥ 0, and if I(Y ≥ 1) = 1
then Y ≥ 1 (because the indicator says so). Taking the expectation of both sides,
we have Markov’s inequality.                                                   

For an intuitive interpretation, let X be the income of a randomly selected in-
dividual from a population. Taking a = 2E(X), Markov’s inequality says that
P (X ≥ 2E(X)) ≤ 1/2, i.e., it is impossible for more than half the population
to make at least twice the average income. This is clearly true, since if over half
the population were earning at least twice the average income, the average income
would be higher! Similarly, P (X ≥ 3E(X)) ≤ 1/3: you can’t have more than 1/3 of
the population making at least three times the average income, since those people
would already drive the average above what it is.
Markov’s inequality is a very crude bound because it requires absolutely no assump-
tions about X. The right-hand side of the inequality could be greater than 1, or even
infinite; this is not very helpful when trying to bound a number that we already
know to be between 0 and 1. Surprisingly, the following two inequalities, which can
be derived from Markov’s inequality with almost no additional work, can often give
us bounds that are much better than Markov’s.
Theorem 10.1.11 (Chebyshev). Let X have mean µ and variance σ 2 . Then for
any a > 0,
                                          σ2
                         P (|X − µ| ≥ a) ≤ 2 .
                                          a
Proof. By Markov’s inequality,

                                                           E(X − µ)2   σ2
              P (|X − µ| ≥ a) = P ((X − µ)2 ≥ a2 ) ≤                 =    .         
                                                              a2       a2

Substituting cσ for a, for c > 0, we have the following equivalent form of Chebyshev’s
inequality:
                                                      1
                                P (|X − µ| ≥ cσ) ≤ 2 .
                                                     c
This gives us an upper bound on the probability of an r.v. being more than c
standard deviations away from its mean, e.g., there can’t be more than a 25%
chance of being 2 or more standard deviations from the mean.
The idea for proving Chebyshev from Markov was to square |X − µ| and then


466                                                                 Introduction to Probability

apply Markov. Similarly, it is often fruitful to perform other transformations before
applying Markov. Chernoff ’s bound, which is widely used in engineering, uses this
idea with an exponential function.
Theorem 10.1.12 (Chernoff). For any r.v. X and constants a > 0 and t > 0,

                                                 E(etX )
                                 P (X ≥ a) ≤             .
                                                  eta

Proof. The transformation g with g(x) = etx is invertible and strictly increasing.
So by Markov’s inequality, we have

                                                             E(etX )
                        P (X ≥ a) = P (etX ≥ eta ) ≤                 .                      
                                                              eta

At first it may not be clear what Chernoff’s bound has to offer that Markov’s
inequality doesn’t, but it has two very nice features:

   1. The right-hand side can be optimized over t to give the tightest upper
      bound, as in the proof of Cauchy-Schwarz.
   2. If the MGF of X exists, then the numerator in the bound is the MGF,
      and some of the useful properties of MGFs can come into play.

Let’s now compare the three bounds just discussed by applying them to a simple
example where the true probability is known.
Example 10.1.13 (Bounds on a Normal tail probability). Let Z ∼ N (0, 1). By the
68-95-99.7% rule, we know that P (|Z| > 3) is approximately 0.003; the exact value
is 2 · Φ(−3). Let’s see what upper bounds are obtained from Markov’s, Chebyshev’s,
and Chernoff’s inequalities.
                                                p
• Markov: In Chapter 5, we found that E|Z| = 2/π. Then
                                                      r
                                       E|Z|  1            2
                         P (|Z| > 3) ≤      = ·             ≈ 0.27.
                                        3    3            π

• Chebyshev:
                                                 1
                                 P (|Z| > 3) ≤     ≈ 0.11.
                                                 9

• Chernoff (after using symmetry of the Normal):
                                                                            2
                P (|Z| > 3) = 2P (Z > 3) ≤ 2e−3t E(etZ ) = 2e−3t · et /2 ,

  using the MGF of the standard Normal distribution.
  The right-hand side is minimized at t = 3, as found by setting the derivative equal
  to 0, possibly after taking the log first (which is a good idea since it doesn’t affect
```
