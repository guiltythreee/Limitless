# Chapter 3: Random Variables and Their Distributions

**Book:** Introduction to Probability, Second Edition  
**Authors:** Joseph K. Blitzstein and Jessica Hwang  
**Printed pages:** 103–148

> Source transcription from the supplied textbook PDF. Text extraction preserves the original order and page content as far as the PDF text layer allows. Check mathematical notation and figure references against the source where extraction is ambiguous.

```text
Random variables and their distributions                                       117

The next two examples show seemingly dissimilar scenarios that are nonetheless
isomorphic to the urn story.
Example 3.4.3 (Elk capture-recapture). A forest has N elk. Today, m of the elk are
captured, tagged, and released into the wild. At a later date, n elk are recaptured
at random. Assume that the recaptured elk are equally likely to be any set of n
of the elk, e.g., an elk that has been captured does not learn how to avoid being
captured again.
By the story of the Hypergeometric, the number of tagged elk in the recaptured
sample is HGeom(m, N − m, n). The m tagged elk in this story correspond to the
white balls and the N − m untagged elk correspond to the black balls. Instead of
sampling n balls from the urn, we recapture n elk from the forest.            
Example 3.4.4 (Aces in a poker hand). In a five-card hand drawn at random from a
well-shuffled standard deck, the number of aces in the hand has the HGeom(4, 48, 5)
distribution, which can be seen by thinking of the aces as white balls and the non-
aces as black balls. Using the Hypergeometric PMF, the probability that the hand
has exactly three aces is
                                     
                                   4 48
                                    3
                                         2
                                        52    ≈ 0.0017.                          
                                        5


The following table summarizes how the above examples can be thought of in terms
of two sets of tags. In each example, the r.v. of interest is the number of items
falling into both the second and the fourth columns: white and sampled, tagged
and recaptured, ace and in one’s hand.

              Story First set of tags             Second set of tags
               urn      white     black         sampled    not sampled
               elk     tagged   untagged       recaptured not recaptured
              cards      ace     not ace         in hand   not in hand

The next theorem describes a symmetry between two Hypergeometric distributions
with different parameters; the proof follows from swapping the two sets of tags in
the Hypergeometric story.
Theorem 3.4.5. The HGeom(w, b, n) and HGeom(n, w + b − n, w) distributions
are identical. That is, if X ∼ HGeom(w, b, n) and Y ∼ HGeom(n, w + b − n, w),
then X and Y have the same distribution.

Proof. Using the story of the Hypergeometric, imagine an urn with w white
balls, b black balls, and a sample of size n made without replacement. Let X ∼
HGeom(w, b, n) be the number of white balls in the sample, thinking of white/black
as the first set of tags and sampled/not sampled as the second set of tags. Let
Y ∼ HGeom(n, w + b − n, w) be the number of sampled balls among the white
balls, thinking of sampled/not sampled as the first set of tags and white/black as


118                                                                   Introduction to Probability

the second set of tags. Both X and Y count the number of white sampled balls, so
they have the same distribution.
Alternatively, we can check algebraically that X and Y have the same PMF:
                       w
                             b
                                   
                       k    n−k                      w!b!n!(w + b − n)!
        P (X = k) =        w+b
                                      =                                          ,
                                           k!(w + b)!(w − k)!(n − k)!(b − n + k)!
                            n
                       n
                          w+b−n
                       k        w−k                      w!b!n!(w + b − n)!
        P (Y = k) =            w+b
                                          =                                          .
                                               k!(w + b)!(w − k)!(n − k)!(b − n + k)!
                                w

We prefer the story proof because it is less tedious and more memorable.                      
h 3.4.6 (Binomial vs. Hypergeometric). The Binomial and Hypergeometric distri-
butions are often confused. Both are discrete distributions taking on integer values
between 0 and n for some n, and both can be interpreted as the number of successes
in n Bernoulli trials (for the Hypergeometric, each tagged elk in the recaptured sam-
ple can be considered a success and each untagged elk a failure). However, a crucial
part of the Binomial story is that the Bernoulli trials involved are independent. The
Bernoulli trials in the Hypergeometric story are dependent, since the sampling is
done without replacement: knowing that one elk in our sample is tagged decreases
the probability that the second elk will also be tagged.




3.5   Discrete Uniform

A very simple story, closely connected to the naive definition of probability, describes
picking a random number from some finite set of possibilities.
Story 3.5.1 (Discrete Uniform distribution). Let C be a finite, nonempty set of
numbers. Choose one of these numbers uniformly at random (i.e., all values in C
are equally likely). Call the chosen number X. Then X is said to have the Discrete
Uniform distribution with parameter C; we denote this by X ∼ DUnif(C).          
The PMF of X ∼ DUnif(C) is

                                                          1
                                       P (X = x) =
                                                         |C|

for x ∈ C (and 0 otherwise), since a PMF must sum to 1. As with questions
based on the naive definition of probability, questions based on a Discrete Uniform
distribution reduce to counting problems. Specifically, for X ∼ DUnif(C) and any
A ⊆ C, we have
                                                |A|
                                 P (X ∈ A) =        .
                                                |C|


Random variables and their distributions                                            119

Example 3.5.2 (Random slips of paper). There are 100 slips of paper in a hat,
each of which has one of the numbers 1, 2, . . . , 100 written on it, with no number
appearing more than once. Five of the slips are drawn, one at a time.

First consider random sampling with replacement (with equal probabilities).

(a) What is the distribution of how many of the drawn slips have a value of at least
80 written on them?
(b) What is the distribution of the value of the jth draw (for 1 ≤ j ≤ 5)?
(c) What is the probability that the number 100 is drawn at least once?
Now consider random sampling without replacement (with all sets of five slips
equally likely to be chosen).
(d) What is the distribution of how many of the drawn slips have a value of at least
80 written on them?
(e) What is the distribution of the value of the jth draw (for 1 ≤ j ≤ 5)?
(f) What is the probability that the number 100 is drawn in the sample?

Solution:
(a) By the story of the Binomial, the distribution is Bin(5, 0.21).
(b) Let Xj be the value of the jth draw. By symmetry, Xj ∼ DUnif(1, 2, . . . , 100).
There aren’t certain slips that love being chosen on the jth draw and others that
avoid being chosen then; all are equally likely.
(c) Taking complements,

         P (Xj = 100 for at least one j) = 1 − P (X1 6= 100, . . . , X5 6= 100).

By the naive definition of probability, this is

                                 1 − (99/100)5 ≈ 0.049.

This solution just uses new notation for concepts from Chapter 1. It is useful to
have this new notation since it is compact and flexible. In the above calculation, it
is important to see why

            P (X1 6= 100, . . . , X5 6= 100) = P (X1 6= 100) . . . P (X5 6= 100).

This follows from the naive definition in this case, but a more general way to think
about such statements is through independence of r.v.s, a concept discussed in detail
in Section 3.8.
(d) By the story of the Hypergeometric, the distribution is HGeom(21, 79, 5).
(e) Let Yj be the value of the jth draw. By symmetry, Yj ∼ DUnif(1, 2, . . . , 100).


120                                                              Introduction to Probability

Learning any Yi gives information about the other values (so Y1 , . . . , Y5 are not inde-
pendent, as defined in Section 3.8), but symmetry still holds since, unconditionally,
the jth slip drawn is equally likely to be any of the slips. This is the unconditional
distribution of Yj : we are working from a vantage point before drawing any of the
slips.
For further insight into why each of Y1 , . . . , Y5 is Discrete Uniform and how to think
about Yj unconditionally, imagine that instead of one person drawing five slips,
one at a time, there are five people who draw one slip each, all reaching into the
hat simultaneously, with all possibilities equally likely for who gets which slip. This
formulation does not change the problem in any important way, and it helps avoid
getting distracted by irrelevant chronological details. Label the five people 1, 2, . . . , 5
in some way, e.g., from youngest to oldest, and let Zj be the value drawn by person
j. By symmetry, Zj ∼ DUnif(1, 2, . . . , 100) for each j; the Zj ’s are dependent but,
looked at individually, each person is drawing a uniformly random slip.
(f) The events Y1 = 100, . . . , Y5 = 100 are disjoint since we are now sampling
without replacement, so

        P (Yj = 100 for some j) = P (Y1 = 100) + · · · + P (Y5 = 100) = 0.05.

Sanity check : This answer makes sense intuitively since we can just as well think of
first choosing five random slips out of 100 blank slips and then randomly writing
the numbers from 1 to 100 on the slips, which gives a 5/100 chance that the number
100 is on one of the five chosen slips.
It would be bizarre if the answer to (c) were greater than or equal to the answer
to (f), since sampling without replacement makes it easier to find the number 100.
(For the same reason, when searching for a lost possession it makes more sense to
sample locations without replacement than with replacement.) But it makes sense
that the answer to (c) is only slightly less than the answer to (f), since it is unlikely
in (c) that the same slip will be sampled more than once (though by the birthday
problem it’s less unlikely than many people would guess).
More generally, if k slips are drawn without replacement, where 0 ≤ k ≤ 100, then
the same reasoning gives that the probability of drawing the number 100 is k/100.
Note that this makes sense in the extreme case k = 100, since in that case we draw
all of the slips.                                                                




3.6    Cumulative distribution functions

Another function that describes the distribution of an r.v. is the cumulative distri-
bution function (CDF). Unlike the PMF, which only discrete r.v.s possess, the CDF
is defined for all r.v.s.


Random variables and their distributions                                              121

Definition 3.6.1. The cumulative distribution function (CDF) of an r.v. X is the
function FX given by FX (x) = P (X ≤ x). When there is no risk of ambiguity, we
sometimes drop the subscript and just write F (or some other letter) for a CDF.
The next example demonstrates that for discrete r.v.s, we can freely convert between
CDF and PMF.
Example 3.6.2. Let X ∼ Bin(4, 1/2). Figure 3.8 shows the PMF and CDF of X.
           1.0




                                                     1.0
                                                                                  ●
                                                                           ●      ●
           0.8




                                                     0.8
                                                                   ●       ●
           0.6




                                                     0.6
                                                                       P(X = 2)
     PMF




                                P(X = 2)       CDF
                                                     0.4
           0.4




                            ●
                                                               ●   ●

                      ●             ●
                                                     0.2
           0.2




                                                           ●   ●
                 ●                         ●
                                                     0.0



                                                           ●
           0.0




                 0    1     2       3      4               0   1   2       3      4
                            x                                      x


FIGURE 3.8
Bin(4, 1/2) PMF and CDF. The height of the vertical bar P (X = 2) in the PMF is
also the height of the jump in the CDF at 2.

• From PMF to CDF : To find P (X ≤ 1.5), which is the CDF evaluated at 1.5, we
  sum the PMF over all values of the support that are less than or equal to 1.5:
                                                        4     4
                                                        1       1     5
                 P (X ≤ 1.5) = P (X = 0) + P (X = 1) =      +4      = .
                                                        2       2    16

  Similarly, the value of the CDF at an arbitrary point x is the sum of the heights
  of the vertical bars of the PMF at values less than or equal to x.
• From CDF to PMF : The CDF of a discrete r.v. consists of jumps and flat regions.
  The height of a jump in the CDF at x is equal to the value of the PMF at x. For
  example, in Figure 3.8, the height of the jump in the CDF at 2 is the same as the
  height of the corresponding vertical bar in the PMF; this is indicated in the figure
  with curly braces. The flat regions of the CDF correspond to values outside the
  support of X, so the PMF is equal to 0 in those regions.                          
Valid CDFs satisfy the following criteria.
Theorem 3.6.3 (Valid CDFs). Any CDF F has the following properties.
• Increasing: If x1 ≤ x2 , then F (x1 ) ≤ F (x2 ).


122                                                            Introduction to Probability

• Right-continuous: As in Figure 3.8, the CDF is continuous except possibly for
  having some jumps. Wherever there is a jump, the CDF is continuous from the
  right. That is, for any a, we have

                                   F (a) = lim+ F (x).
                                           x→a


• Convergence to 0 and 1 in the limits:

                           lim F (x) = 0 and lim F (x) = 1.
                          x→−∞                   x→∞

Proof. The above criteria are true for all CDFs, but for simplicity we will only prove
it for the case where F is the CDF of a discrete r.v. X whose possible values are
0, 1, 2, . . . . As an example of how to visualize the criteria, consider Figure 3.8: the
CDF shown there is increasing (with some flat regions), continuous from the right
(it is continuous except at jumps, and each jump has an open dot at the bottom
and a closed dot at the top), and it converges to 0 as x → −∞ and to 1 as x → ∞
(in this example, it reaches 0 and 1; in some examples, one or both of these values
may be approached but never reached).
The first criterion is true since the event {X ≤ x1 } is a subset of the event {X ≤ x2 },
so P (X ≤ x1 ) ≤ P (X ≤ x2 ).
For the second criterion, note that

                              P (X ≤ x) = P (X ≤ bxc),

where bxc is the greatest integer less than or equal to x. For example, P (X ≤ 4.9) =
P (X ≤ 4) since X is integer-valued. So F (a + b) = F (a) for any b > 0 that is small
enough so that a + b < bac + 1, e.g., for a = 4.9, this holds for 0 < b < 0.1. This
implies F (a) = limx→a+ F (x) (in fact, it’s much stronger since it says F (x) equals
F (a) when x is close enough to a and on the right).
For the third criterion, we have F (x) = 0 for x < 0, and
                                              bxc                 ∞
                                              X                   X
      lim F (x) = lim P (X ≤ bxc) = lim             P (X = n) =         P (X = n) = 1.   
      x→∞         x→∞                   x→∞
                                              n=0                 n=0


The converse is true too: we will show in Chapter 5 that given any function F
meeting these criteria, we can construct a random variable whose CDF is F .
To recap, we have now seen three equivalent ways of expressing the distribution of
a random variable. Two of these are the PMF and the CDF: we know these two
functions contain the same information, since we can always figure out the CDF
from the PMF and vice versa. Generally the PMF is easier to work with for discrete
r.v.s, since evaluating the CDF requires a summation.


Random variables and their distributions                                            123

A third way to describe a distribution is with a story that explains (in a precise
way) how the distribution can arise. We used the stories of the Binomial and Hyper-
geometric distributions to derive the corresponding PMFs. Thus the story and the
PMF also contain the same information, though we can often achieve more intuitive
proofs with the story than with PMF calculations.




3.7   Functions of random variables

In this section we will discuss what it means to take a function of a random variable,
and we will build understanding for why a function of a random variable is a random
variable. That is, if X is a random variable, then X 2 , eX , and sin(X) are also random
variables, as is g(X) for any function g : R → R.
For example, imagine that two basketball teams (A and B) are playing a seven-
game match, and let X be the number of wins for team A (so X ∼ Bin(7, 1/2) if
the teams are evenly matched and the games are independent). Let g(x) = 7 − x,
and let h(x) = 1 if x ≥ 4 and h(x) = 0 if x < 4. Then g(X) = 7 − X is the number
of wins for team B, and h(X) is the indicator of team A winning the majority of
the games. Since X is an r.v., both g(X) and h(X) are also r.v.s.
To see how to define functions of an r.v. formally, let’s rewind a bit. At the beginning
of this chapter, we considered a random variable X defined on a sample space with
6 elements. Figure 3.1 used arrows to illustrate how X maps each pebble in the
sample space to a real number, and the left half of Figure 3.2 showed how we can
equivalently imagine X writing a real number inside each pebble.
Now we can, if we want, apply the same function g to all the numbers inside the
pebbles. Instead of the numbers X(s1 ) through X(s6 ), we now have the numbers
g(X(s1 )) through g(X(s6 )), which gives a new mapping from sample outcomes to
real numbers—we’ve created a new random variable, g(X).
Definition 3.7.1 (Function of an r.v.). For an experiment with sample space S,
an r.v. X, and a function g : R → R, g(X) is the r.v. that maps s to g(X(s)) for all
s ∈ S.
               √
Taking g(x) = x for concreteness, Figure 3.9 shows that g(X) is the composition of
the functions X and g, saying “first apply X, then apply g”. Figure 3.10 represents
g(X) more succinctly by directly labeling the sample outcomes. Both figures show
us that g(X) is an r.v.; if X crystallizes to 4, then g(X) crystallizes to 2.
Given a discrete r.v. X with a known PMF, how can we find the PMF of Y = g(X)?
In the case where g is a one-to-one function, the answer is straightforward: the
support of Y is the set of all g(x) with x in the support of X, and

                    P (Y = g(x)) = P (g(X) = g(x)) = P (X = x).


124                                                                                         Introduction to Probability




      s1        s2        s3
                                       X                                               g
           s4        s5        s6                       0    1                 4                 0    1     2




FIGURE 3.9
The r.v. X is defined on a sample space with 6 elements, and has possible values 0,
1, and 4. The function g is
                         √ the square root function. Composing X and g gives the
random variable g(X) = X, which has possible values 0, 1, and 2.




                                                1                0                 1
                                      s1                    s2            s3

                                                    0                 2                 1
                                           s4                    s5                s6


FIGURE 3.10√
Since g(X) =                   X labels each pebble with a number, it is an r.v.


Random variables and their distributions                                                      125

The case where Y = g(X) with g one-to-one is illustrated in the following tables;
the idea is that if the distinct possible values of X are x1 , x2 , . . . with probabilities
p1 , p2 , . . . (respectively), then the distinct possible values of Y are g(x1 ), g(x2 ), . . . ,
with the same list p1 , p2 , . . . of probabilities.

               x         P (X = x)                          y         P (Y = y)
               x1             p1                          g(x1 )            p1
               x2             p2                          g(x2 )            p2
               x3             p3                          g(x3 )            p3
                ..             ..                           ..               ..
                 .              .                            .                .

            PMF of X, in table form                    PMF of Y , in table form
This suggests a strategy for finding the PMF of an r.v. with an unfamiliar distri-
bution: try to express the r.v. as a one-to-one function of an r.v. with a known
distribution. The next example illustrates this method.
Example 3.7.2 (Random walk). A particle moves n steps on a number line. The
particle starts at 0, and at each step it moves 1 unit to the right or to the left,
with equal probabilities. Assume all steps are independent. Let Y be the particle’s
position after n steps. Find the PMF of Y .
Solution:
Consider each step to be a Bernoulli trial, where right is considered a success and
left is considered a failure. Then the number of steps the particle takes to the
right is a Bin(n, 1/2) random variable, which we can name X. If X = j, then the
particle has taken j steps to the right and n − j steps to the left, giving a final
position of j − (n − j) = 2j − n. So we can express Y as a one-to-one function of
X, namely, Y = 2X − n. Since X takes values in {0, 1, 2, . . . , n}, Y takes values in
{−n, 2 − n, 4 − n, . . . , n}.
The PMF of Y can then be found from the PMF of X:
                                                                                n
                                                                           n      1
         P (Y = k) = P (2X − n = k) = P (X = (n + k)/2) =                  n+k        ,
                                                                            2     2

if k is an integer between −n and n (inclusive) such that n+k is an even number.               
If g is not one-to-one, then for a given y, there may be multiple values of x such
that g(x) = y. To compute P (g(X) = y), we need to sum up the probabilities of X
taking on any of these candidate values of x.
Theorem 3.7.3 (PMF of g(X)). Let X be a discrete r.v. and g : R → R. Then
the support of g(X) is the set of all y such that g(x) = y for at least one x in the
support of X, and the PMF of g(X) is
                                           X
                        P (g(X) = y) =          P (X = x),
                                               x:g(x)=y


126                                                           Introduction to Probability

for all y in the support of g(X).

Example 3.7.4. Continuing as in the previous example, let D be the particle’s
distance from the origin after n steps. Assume that n is even. Find the PMF of D.

Solution:

We can write D = |Y |; this is a function of Y , but it isn’t one-to-one. The event
D = 0 is the same as the event Y = 0. For k = 2, 4, . . . , n, the event D = k is the
same as the event {Y = k} ∪ {Y = −k}. So the PMF of D is
                               n
                             n   1
              P (D = 0) =    n       ,
                             2   2
                                                          n
                                                      n     1
              P (D = k) = P (Y = k) + P (Y = −k) = 2 n+k        ,
                                                      2     2

for k = 2, 4, . . . , n. In the final step we used symmetry (imagine a new random walk
that moves left each time our random walk moves right, and vice versa) to see that
P (Y = k) = P (Y = −k).                                                             
The same reasoning we have used to handle functions of one random variable can
be extended to deal with functions of multiple random variables. We have already
seen an example of this with the addition function (which maps two numbers x, y
to their sum x + y): in Example 3.2.5, we saw how to view T = X + Y as an r.v. in
its own right, where X and Y are obtained by rolling dice.

Definition 3.7.5 (Function of two r.v.s). Given an experiment with sample space
S, if X and Y are r.v.s that map s ∈ S to X(s) and Y (s) respectively, then g(X, Y )
is the r.v. that maps s to g(X(s), Y (s)).

Note that we are assuming that X and Y are defined on the same sample space S.
Usually we assume that S is chosen to be rich enough to encompass whatever r.v.s
we wish to work with. For example, if X is based on a coin flip and Y is based on
a die roll, and we initially were using the sample space S1 = {H, T } for X and the
sample space S2 = {1, 2, 3, 4, 5, 6} for Y , we can easily redefine X and Y so that both
are defined on the richer space S = S1 × S2 = {(s1 , s2 ) : s1 ∈ S1 , s2 ∈ S2 }.

One way to understand the mapping from S to R represented by the r.v. g(X, Y )
is with a table displaying the values of X, Y , and g(X, Y ) under various possible
outcomes. Interpreting X + Y as an r.v. is intuitive: if we observe X = x and Y = y,
then X +Y crystallizes to x+y. For a less familiar example like max(X, Y ), students
often are unsure how to interpret it as an r.v. But the idea is the same: if we observe
X = x and Y = y, then max(X, Y ) crystallizes to max(x, y).

Example 3.7.6 (Maximum of two die rolls). We roll two fair 6-sided dice. Let X
be the number on the first die and Y the number on the second die. The following
table gives the values of X, Y , and max(X, Y ) under 7 of the 36 outcomes in the
sample space, analogously to the table in Example 3.2.5.


Random variables and their distributions                                            127

                               s      X    Y   max(X, Y )
                             (1, 2)   1    2        2
                             (1, 6)   1    6        6
                             (2, 5)   2    5        5
                             (3, 1)   3    1        3
                             (4, 3)   4    3        4
                             (5, 4)   5    4        5
                             (6, 6)   6    6        6

So max(X, Y ) assigns a numerical value to each sample outcome. The PMF is

                             P (max(X, Y ) = 1) = 1/36,
                             P (max(X, Y ) = 2) = 3/36,
                             P (max(X, Y ) = 3) = 5/36,
                             P (max(X, Y ) = 4) = 7/36,
                             P (max(X, Y ) = 5) = 9/36,
                             P (max(X, Y ) = 6) = 11/36.

These probabilities can be obtained by tabulating the values of max(x, y) in a
6 × 6 grid and counting how many times each value appears in the grid, or with
calculations such as

  P (max(X, Y ) = 5) = P (X = 5, Y ≤ 4) + P (X ≤ 4, Y = 5) + P (X = 5, Y = 5)
                       = 2P (X = 5, Y ≤ 4) + 1/36
                       = 2(4/36) + 1/36 = 9/36.                                       

h 3.7.7 (Category errors and sympathetic magic). Many common mistakes in
probability can be traced to confusing two of the following fundamental objects with
each other: distributions, random variables, events, and numbers. Such mistakes are
examples of category errors. In general, a category error is a mistake that doesn’t just
happen to be wrong, but in fact is necessarily wrong since it is based on the wrong
category of object. For example, answering the question “How many people live in
Boston?” with “−42” or “π” or “pink elephants” would be a category error—we
may not know the population size of a city, but we do know that it is a nonnegative
integer at any point in time. To help avoid being categorically wrong, always think
about what category an answer should have.

An especially common category error is to confuse a random variable with its dis-
tribution. We call this error sympathetic magic; this term comes from anthropology,
where it is used for the belief that one can influence an object by manipulating a
representation of that object. The following saying sheds light on the distinction
between a random variable and its distribution:

     The word is not the thing; the map is not the territory. – Alfred Korzybski


128                                                              Introduction to Probability

We can think of the distribution of a random variable as a map or blueprint de-
scribing the r.v. Just as different houses can share the same blueprint, different r.v.s
can have the same distribution, even if the experiments they summarize, and the
sample spaces they map from, are not the same.
Here are two examples of sympathetic magic:
• Given an r.v. X, trying to get the PMF of 2X by multiplying the PMF of X by
  2. It does not make sense to multiply a PMF by 2, since the probabilities would
  no longer sum to 1. As we saw above, if X takes on values xj with probabilities
  pj , then 2X takes on values 2xj with probabilities pj . Therefore the PMF of 2X
  is a horizontal stretch of the PMF of X; it is not a vertical stretch, as would
  result from multiplying the PMF by 2. Figure 3.11 shows the PMF of a discrete
  r.v. X with support {0, 1, 2, 3, 4}, along with the PMF of 2X, which has support
  {0, 2, 4, 6, 8}. Note that X can take on odd values, but 2X is necessarily even.
                   1.0
                   0.8
                   0.6
           PMF of X
                   0.4
                   0.2
                   0.0




                         0   1   2   3   4   5    6    7     8       9   10
                                             x
                   1.0
                   0.8
           PMF of 2X
                   0.6
                   0.4
                   0.2
                   0.0




                         0   1   2   3   4   5    6    7     8       9   10
                                             x


FIGURE 3.11
PMF of X (above) and PMF of 2X (below).


Random variables and their distributions                                               129

• Claiming that because X and Y have the same distribution, X must always equal
  Y , i.e., P (X = Y ) = 1. Just because two r.v.s have the same distribution does
  not mean they are always equal, or ever equal. We saw this in Example 3.2.5.
  As another example, consider flipping a fair coin once. Let X be the indicator of
  Heads and Y = 1 − X be the indicator of Tails. Both X and Y have the Bern(1/2)
  distribution, but the event X = Y is impossible. The PMFs of X and Y are the
  same function, but X and Y are different mappings from the sample space to the
  real numbers.
  If Z is the indicator of Heads in a second flip (independent of the first flip), then
  Z is also Bern(1/2), but Z is not the same r.v. as X. Here

                           P (Z = X) = P (HH or T T ) = 1/2.




3.8    Independence of r.v.s

Just as we had the notion of independence of events, we can define independence of
random variables. Intuitively, if two r.v.s X and Y are independent, then knowing
the value of X gives no information about the value of Y , and vice versa. The
definition formalizes this idea.
Definition 3.8.1 (Independence of two r.v.s). Random variables X and Y are said
to be independent if

                       P (X ≤ x, Y ≤ y) = P (X ≤ x)P (Y ≤ y),

for all x, y ∈ R.
In the discrete case, this is equivalent to the condition

                       P (X = x, Y = y) = P (X = x)P (Y = y),

for all x, y with x in the support of X and y in the support of Y .
The definition for more than two r.v.s is analogous.
Definition 3.8.2 (Independence of many r.v.s). Random variables X1 , . . . , Xn are
independent if

              P (X1 ≤ x1 , . . . , Xn ≤ xn ) = P (X1 ≤ x1 ) . . . P (Xn ≤ xn ),

for all x1 , . . . , xn ∈ R. For infinitely many r.v.s, we say that they are independent if
every finite subset of the r.v.s is independent.
Comparing this to the criteria for independence of n events, it may seem strange that
the independence of X1 , . . . , Xn requires just one equality, whereas for events we


130                                                             Introduction to Probability
                                                   n
                                                    
needed to verify pairwise independence for all 2 pairs, three-way independence for
     n
all 3 triplets, and so on. However, upon closer examination of the definition, we see
that independence of r.v.s requires the equality to hold for all possible x1 , . . . , xn —
infinitely many conditions! If we can find even a single list of values x1 , . . . , xn for
which the above equality fails to hold, then X1 , . . . , Xn are not independent.
h 3.8.3. If X1 , . . . , Xn are independent, then they are pairwise independent, i.e.,
Xi is independent of Xj for i 6= j. The idea behind proving that Xi and Xj are
independent is to let all the xk other than xi , xj go to ∞ in the definition of inde-
pendence, since we already know Xk < ∞ is true (though it takes some work to give
a complete justification for the limit). But pairwise independence does not imply
independence in general, as we saw in Chapter 2 for events.
Example 3.8.4. In a roll of two fair dice, if X is the number on the first die and
Y is the number on the second die, then X + Y is not independent of X − Y since

                                                                              1 5
      0 = P (X + Y = 12, X − Y = 1) 6= P (X + Y = 12)P (X − Y = 1) =            · .
                                                                              36 36
Knowing the total is 12 tells us the difference must be 0, so the r.v.s provide infor-
mation about each other.                                                            
If X and Y are independent then it is also true, e.g., that X 2 is independent of Y 4 ,
since if X 2 provided information about Y 4 , then X would give information about Y
(using X 2 and Y 4 as intermediaries: X determines X 2 , which would give information
about Y 4 , which in turn would give information about Y ). More generally, we have
the following result (for which we omit a formal proof).
Theorem 3.8.5 (Functions of independent r.v.s). If X and Y are independent
r.v.s, then any function of X is independent of any function of Y .
Definition 3.8.6 (i.i.d.). We will often work with random variables that are inde-
pendent and have the same distribution. We call such r.v.s independent and identi-
cally distributed, or i.i.d. for short.
h 3.8.7 (i. vs. i.d.). “Independent” and “identically distributed” are two often-
confused but completely different concepts. Random variables are independent if
they provide no information about each other; they are identically distributed if
they have the same PMF (or equivalently, the same CDF). Whether two r.v.s are
independent has nothing to do with whether they have the same distribution. We
can have r.v.s that are:
• independent and identically distributed. Let X be the result of a die roll, and let
  Y be the result of a second, independent die roll. Then X and Y are i.i.d.
• independent and not identically distributed. Let X be the result of a die roll, and
  let Y be the closing price of the Dow Jones (a stock market index) a month from
  now. Then X and Y provide no information about each other (one would fervently
  hope), and X and Y do not have the same distribution.


Random variables and their distributions                                           131

• dependent and identically distributed. Let X be the number of Heads in n inde-
  pendent fair coin tosses, and let Y be the number of Tails in those same n tosses.
  Then X and Y are both distributed Bin(n, 1/2), but they are highly dependent:
  if we know X, then we know Y perfectly.
• dependent and not identically distributed. Let X be the indicator of whether the
  majority party retains control of the House of Representatives in the U.S. after the
  next election, and let Y be the average favorability rating of the majority party
  in polls taken within a month of the election. Then X and Y are dependent, and
  X and Y do not have the same distribution.
By taking a sum of i.i.d. Bernoulli r.v.s, we can write down the story of the Binomial
distribution in an algebraic form.
Theorem 3.8.8. If X ∼ Bin(n, p), viewed as the number of successes in n indepen-
dent Bernoulli trials with success probability p, then we can write X = X1 +· · ·+Xn
where the Xi are i.i.d. Bern(p).

Proof. Let Xi = 1 if the ith trial was a success, and 0 if the ith trial was a failure.
It’s as though we have a person assigned to each trial, and we ask each person to
raise their hand if their trial was a success. If we count the number of raised hands
(which is the same as adding up the Xi ), we get the total number of successes. 

An important fact about the Binomial distribution is that the sum of independent
Binomial r.v.s with the same success probability is also Binomial.
Theorem 3.8.9. If X ∼ Bin(n, p), Y ∼ Bin(m, p), and X is independent of Y ,
then X + Y ∼ Bin(n + m, p).

Proof. We present three proofs, since each illustrates a useful technique.
1. LOTP: We can directly find the PMF of X + Y by conditioning on X (or Y ,
whichever we prefer) and using the law of total probability:
                                    k
                                    X
                P (X + Y = k) =           P (X + Y = k|X = j)P (X = j)
                                    j=0
                                    k
                                    X
                                =         P (Y = k − j)P (X = j)
                                    j=0
                                    k 
                                    X                          
                                        m          k−j m−k+j    n j n−j
                                =                 p    q           p q
                                           k−j                  j
                                    j=0
                                                 k 
                                                 X      
                                     k n+m−k         m   n
                                =p q
                                                       k−j     j
                                                 j=0
                                            
                                        n + m k n+m−k
                                =             p q     .
                                          k


132                                                              Introduction to Probability

In the second line, we used the independence of X and Y to justify dropping the
conditioning in

          P (X + Y = k|X = j) = P (Y = k − j|X = j) = P (Y = k − j),

and in the last line, we used the fact that

                            k 
                            X                            
                                m   n                  n+m
                                               =
                                  k−j      j            k
                            j=0


by Vandermonde’s identity. The resulting expression is the Bin(n + m, p) PMF, so
X + Y ∼ Bin(n + m, p).
2. Representation: A much simpler proof is to represent both X and Y as the sum
of i.i.d. Bern(p) r.v.s: X = X1 + · · · + Xn and Y = Y1 + · · · + Ym , where the Xi and
Yj are all i.i.d. Bern(p). Then X + Y is the sum of n + m i.i.d. Bern(p) r.v.s, so its
distribution, by the previous theorem, is Bin(n + m, p).
3. Story: By the Binomial story, X is the number of successes in n independent
trials and Y is the number of successes in m additional independent trials, all with
the same success probability, so X + Y is the total number of successes in the n + m
trials, which is the story of the Bin(n + m, p) distribution.                      

Of course, if we have a definition for independence of r.v.s, we should have an
analogous definition for conditional independence of r.v.s.
Definition 3.8.10 (Conditional independence of r.v.s). Random variables X and
Y are conditionally independent given an r.v. Z if for all x, y ∈ R and all z in the
support of Z,

            P (X ≤ x, Y ≤ y|Z = z) = P (X ≤ x|Z = z)P (Y ≤ y|Z = z).

For discrete r.v.s, an equivalent definition is to require

            P (X = x, Y = y|Z = z) = P (X = x|Z = z)P (Y = y|Z = z).


As we might expect from the name, this is the definition of independence, except
that we condition on Z = z everywhere, and require the equality to hold for all z
in the support of Z.
Definition 3.8.11 (Conditional PMF). For any discrete r.v.s X and Z, the function
P (X = x|Z = z), when considered as a function of x for fixed z, is called the
conditional PMF of X given Z = z.
Independence of r.v.s does not imply conditional independence, nor vice versa. First
let us show why independence does not imply conditional independence.


Random variables and their distributions                                         133

Example 3.8.12 (Matching pennies). Consider the simple game called matching
pennies. Each of two players, A and B, has a fair penny. They flip their pennies
independently. If the pennies match, A wins; otherwise, B wins. Let X be 1 if A’s
penny lands Heads and −1 otherwise, and define Y similarly for B (the r.v.s X and
Y are called random signs).
Let Z = XY , which is 1 if A wins and −1 if B wins. Then X and Y are uncondi-
tionally independent, but given Z = 1, we know that X = Y (the pennies match).
So X and Y are conditionally dependent given Z.                             
Example 3.8.13 (Two friends). Consider again the “I have only two friends who
ever call me” scenario from Example 2.5.11, except now with r.v. notation. Let X be
the indicator of Alice calling me next Friday, Y be the indicator of Bob calling me
next Friday, and Z be the indicator of exactly one of them calling me next Friday.
Then X and Y are independent (by assumption). But given Z = 1, we have that
X and Y are completely dependent: given that Z = 1, we have Y = 1 − X.            
Next let’s see why conditional independence does not imply independence.
Example 3.8.14 (Mystery opponent). Suppose that you are going to play two
games of tennis against one of two identical twins. Against one of the twins, you are
evenly matched, and against the other you have a 3/4 chance of winning. Suppose
that you can’t tell which twin you are playing against until after the two games. Let
Z be the indicator of playing against the twin with whom you’re evenly matched, and
let X and Y be the indicators of victory in the first and second games, respectively.
Conditional on Z = 1, X and Y are i.i.d. Bern(1/2), and conditional on Z = 0,
X and Y are i.i.d. Bern(3/4). So X and Y are conditionally independent given Z.
Unconditionally, X and Y are dependent because observing X = 1 makes it more
likely that we are playing the twin who is worse. That is,

                            P (Y = 1|X = 1) > P (Y = 1).

Past games give us information which helps us infer who our opponent is, which
in turn helps us predict future games! Note that this example is isomorphic to the
“random coin” scenario from Example 2.3.7.                                      




3.9   Connections between Binomial and Hypergeometric

The Binomial and Hypergeometric distributions are connected in two important
ways. As we will see in this section, we can get from the Binomial to the Hyperge-
ometric by conditioning, and we can get from the Hypergeometric to the Binomial
by taking a limit. We’ll start with a motivating example.
Example 3.9.1 (Fisher exact test). A scientist wishes to study whether women or


134                                                          Introduction to Probability

men are more likely to have a certain disease, or whether they are equally likely.
A random sample of n women and m men is gathered, and each person is tested
for the disease (assume for this problem that the test is completely accurate). The
numbers of women and men in the sample who have the disease are X and Y
respectively, with X ∼ Bin(n, p1 ) and Y ∼ Bin(m, p2 ), independently. Here p1 and
p2 are unknown, and we are interested in testing whether p1 = p2 (this is known as
a null hypothesis in statistics).
Consider a 2 × 2 table with rows corresponding to disease status and columns
corresponding to gender. Each entry is the count of how many people have that
disease status and gender, so n + m is the sum of all 4 entries. Suppose that it is
observed that X + Y = r.
The Fisher exact test is based on conditioning on both the row and column sums,
so n, m, r are all treated as fixed, and then seeing if the observed value of X is
“extreme” compared to this conditional distribution. Assuming the null hypothesis,
find the conditional PMF of X given X + Y = r.
Solution:
First we’ll build the 2 × 2 table, treating n, m, and r as fixed.

                                 Women              Men    Total
                  Disease            x           r−x    r
                  No disease        n−x         m−r+x n+m−r
                  Total              n              m      n+m

Next, let’s compute the conditional PMF P (X = x|X + Y = r). By Bayes’ rule,

                                      P (X + Y = r|X = x)P (X = x)
             P (X = x|X + Y = r) =
                                               P (X + Y = r)
                                      P (Y = r − x)P (X = x)
                                    =                        .
                                           P (X + Y = r)

The step P (X +Y = r|X = x) = P (Y = r −x) is justified by the independence of X
and Y . Assuming the null hypothesis and letting p = p1 = p2 , we have X ∼ Bin(n, p)
and Y ∼ Bin(m, p), independently, so X + Y ∼ Bin(n + m, p). Thus,
                                    m
                                        r−x                 
                                   r−x p     (1 − p)m−r+x nx px (1 − p)n−x
          P (X = x|X + Y = r) =                  
                                             n+m r
                                               r   p (1 − p)n+m−r
                                   n
                                      m
                                    x     r−x
                                =       n+m
                                               .
                                         r

So the conditional distribution of X is Hypergeometric with parameters n, m, r.
To understand why the Hypergeometric appeared, seemingly out of nowhere, let’s
connect this problem to the elk story for the Hypergeometric. In the elk story, we are


Random variables and their distributions                                            135

interested in the distribution of the number of tagged elk in the recaptured sample.
By analogy, think of women as tagged elk and men as untagged elk. Instead of
recapturing r elk at random from the forest, we infect X + Y = r people with the
disease; under the null hypothesis, the set of diseased people is equally likely to be
any set of r people. Thus, conditional on X + Y = r, X represents the number of
women among the r diseased individuals. This is exactly analogous to the number
of tagged elk in the recaptured sample, which is distributed HGeom(n, m, r).
An interesting fact, which turns out to be useful in statistics, is that the conditional
distribution of X does not depend on p: unconditionally, X ∼ Bin(n, p), but p
disappears from the parameters of the conditional distribution! This makes sense
upon reflection, since once we know X + Y = r, we can work directly with the fact
that we have a population with r diseased and n + m − r healthy people, without
worrying about the value of p that originally generated the population.               
This motivating example serves as a proof of the following theorem.
Theorem 3.9.2. If X ∼ Bin(n, p), Y ∼ Bin(m, p), and X is independent of Y ,
then the conditional distribution of X given X + Y = r is HGeom(n, m, r).
In the other direction, the Binomial is a limiting case of the Hypergeometric.
Theorem 3.9.3. If X ∼ HGeom(w, b, n) and N = w + b → ∞ such that p =
w/(w + b) remains fixed, then the PMF of X converges to the Bin(n, p) PMF.

Proof. We take the stated limit of the HGeom(w, b, n) PMF:
                     w
                        b 
                       k n−k
       P (X = k) =      w+b
                           
                         n
                       w+b−n
                      n     w−k
                   =        w+b
                                     by Theorem 3.4.5
                      k
                             w
                      
                      n    w!           b!     (w + b − n)!
                   =
                      k (w − k)! (b − n + k)! (w + b)!
                      
                      n w(w − 1) . . . (w − k + 1)b(b − 1) . . . (b − n + k + 1)
                   =
                      k       (w + b)(w + b − 1) . . . (w + b − n + 1)
                                                                         
                      n p p − N1 . . . p − k−1    q  q − 1
                                                             . . .  q − n−k−1
                   =                        N          N               N
                                                                                .
                      k            1 − N1 1 − N2 . . . 1 − n−1   N

As N → ∞, the denominator goes to 1, and the numerator goes to pk q n−k . Thus
                                       
                                        n k n−k
                        P (X = k) →        p q  ,
                                        k

which is the Bin(n, p) PMF.                                                           

The stories of the Binomial and Hypergeometric provide intuition for this result:
given an urn with w white balls and b black balls, the Binomial distribution arises


136                                                           Introduction to Probability

from sampling n balls from the urn with replacement, while the Hypergeometric
arises from sampling without replacement. As the number of balls in the urn grows
very large relative to the number of balls that are drawn, sampling with replacement
and sampling without replacement become essentially equivalent. In practical terms,
this theorem tells us that if N = w + b is large relative to n, we can approximate
the HGeom(w, b, n) PMF by the Bin(n, w/(w + b)) PMF.

The birthday problem implies that it is surprisingly likely that some ball will be
sampled more than once if sampling with replacement; for example, if 1,200 out of
1,000,000 balls are drawn randomly with replacement, then there is about a 51%
chance that some ball will be drawn more than once! But this becomes less and less
likely as N grows, and even if it is likely that there will be a few coincidences, the
approximation can still be reasonable if it is very likely that the vast majority of
balls in the sample are sampled only once each.




3.10    Recap

A random variable (r.v.) is a function assigning a real number to every possible
outcome of an experiment. The distribution of an r.v. X is a full specification of the
probabilities for the events associated with X, such as {X = 3} and {1 ≤ X ≤ 5}.
The distribution of a discrete r.v. can be defined using a PMF, a CDF, or a story.
The PMF of X is the function P (X = x) for x ∈ R. The CDF of X is the function
P (X ≤ x) for x ∈ R. A story for X describes an experiment that could give rise to
a random variable with the same distribution as X.

For a PMF to be valid, it must be nonnegative and sum to 1. For a CDF to be valid,
it must be increasing, right-continuous, converge to 0 as x → −∞, and converge to
1 as x → ∞.

It is important to distinguish between a random variable and its distribution: the
distribution is a blueprint for building the r.v., but different r.v.s can have the same
distribution, just as different houses can be built from the same blueprint.

Four named discrete distributions are the Bernoulli, Binomial, Hypergeometric, and
Discrete Uniform. Each of these is actually a family of distributions, indexed by
parameters; to fully specify one of these distributions, we need to give both the
name and the parameter values.

• A Bern(p) r.v. is the indicator of success in a Bernoulli trial with probability of
  success p.

• A Bin(n, p) r.v. is the number of successes in n independent Bernoulli trials, all
  with the same probability p of success.


Random variables and their distributions                                             137

• A HGeom(w, b, n) r.v. is the number of white balls obtained in a sample of size n
  drawn without replacement from an urn of w white and b black balls.
• A DUnif(C) r.v. is obtained by randomly choosing an element of the finite set C,
  with equal probabilities for each element.
A function of a random variable is still a random variable. If we know the PMF of
X, we can find P (g(X) = k), the PMF of g(X), by translating the event {g(X) = k}
into an equivalent event involving X, then using the PMF of X.
Two random variables are independent if knowing the value of one r.v. gives no
information about the value of the other. This is unrelated to whether the two r.v.s
are identically distributed. In Chapter 7, we will learn how to deal with dependent
random variables by considering them jointly rather than separately.
We have now seen four fundamental types of objects in probability: distributions,
random variables, events, and numbers. Figure 3.12 shows connections between
these four fundamental objects. A CDF can be used as a blueprint for generating
an r.v., and then there are various events describing the behavior of the r.v., such
as the events X ≤ x for all x. Knowing the probabilities of these events determines
the CDF, taking us full circle. For a discrete r.v. we can also use the PMF as a
blueprint, and go from distribution to r.v. to events and back again.



                                                        What can
                                                        happen?

    distributions                random variables         events          numbers

                      generate                            X≤x      P   P(X ≤ x) = F(x)
                                                X
       CDF F                                              X=x             P(X = x)
        PMF
        story
                                     function of r.v.




   name, parameters




                                            g(X)




FIGURE 3.12
Four fundamental objects in probability: distributions (blueprints), random vari-
ables, events, and numbers. From a CDF F we can generate an r.v. X. From X, we
can generate many other r.v.s by taking functions of X. There are various events
describing the behavior of X. Most notably, for any constant x the events X ≤ x
and X = x are of interest. Knowing the probabilities of these events for all x gives
us the CDF and (in the discrete case) the PMF, taking us full circle.


138                                                          Introduction to Probability




3.11    R

Distributions in R

All of the named distributions that we’ll encounter in this book have been im-
plemented in R. In this section we’ll explain how to work with the Binomial
and Hypergeometric distributions in R. We will also explain in general how
to generate r.v.s from any discrete distribution with a finite support. Typing
help(distributions) gives a handy list of built-in distributions; many others are
available through R packages that can be loaded.
In general, for many named discrete distributions, three functions starting with d,
p, and r will give the PMF, CDF, and random generation, respectively. Note that
the function starting with p is not the PMF, but rather is the CDF.


Binomial distribution

The Binomial distribution is associated with the following three R functions:
dbinom, pbinom, and rbinom. For the Bernoulli distribution we can just use the
Binomial functions with n = 1.
• dbinom is the Binomial PMF. It takes three inputs: the first is the value of x
  at which to evaluate the PMF, and the second and third are the parameters n
  and p. For example, dbinom(3,5,0.2) returns the probability P (X = 3) where
  X ∼ Bin(5, 0.2). In other words,
                                      
                                      5
                   dbinom(3,5,0.2) =     (0.2)3 (0.8)2 = 0.0512.
                                      3

• pbinom is the Binomial CDF. It takes three inputs: the first is the value of x
  at which to evaluate the CDF, and the second and third are the parameters.
  pbinom(3,5,0.2) is the probability P (X ≤ 3) where X ∼ Bin(5, 0.2). So
                                     3  
                                     X  5
               pbinom(3,5,0.2) =               (0.2)k (0.8)5−k = 0.9933.
                                           k
                                     k=0


• rbinom is a function for generating Binomial random variables. For rbinom, the
  first input is how many r.v.s we want to generate, and the second and third
  inputs are still the parameters. Thus the command rbinom(7,5,0.2) produces
  realizations of seven i.i.d. Bin(5, 0.2) r.v.s. When we ran this command, we got
  2 1 0 0 1 0 0
  but you’ll probably get something different when you try it!


Random variables and their distributions                                                   139

We can also evaluate PMFs and CDFs at an entire vector of values. For exam-
ple, recall that 0:n is a quick way to list the integers from 0 to n. The command
dbinom(0:5,5,0.2) returns 6 numbers, P (X = 0), P (X = 1), . . . , P (X = 5), where
X ∼ Bin(5, 0.2).


Hypergeometric distribution

The Hypergeometric distribution also has three functions: dhyper, phyper, and
rhyper. As one might expect, dhyper is the Hypergeometric PMF, phyper is the
Hypergeometric CDF, and rhyper generates Hypergeometric r.v.s. Since the Hy-
pergeometric distribution has three parameters, each of these functions takes four
inputs. For dhyper and phyper, the first input is the value at which we wish to
evaluate the PMF or CDF, and the remaining inputs are the parameters of the
distribution.
Thus dhyper(k,w,b,n) returns P (X = k) where X ∼ HGeom(w, b, n), and
phyper(k,w,b,n) returns P (X ≤ k). For rhyper, the first input is the num-
ber of r.v.s we want to generate, and the remaining inputs are the parameters;
rhyper(100,w,b,n) generates 100 i.i.d. HGeom(w, b, n) r.v.s.


Discrete distributions with finite support

We can generate r.v.s from any discrete distribution with finite support using the
sample command. When we first introduced the sample command, we said that it
can be used in the form sample(n,k) or sample(n,k,replace=TRUE) to sample k
times from the integers 1 through n, either without or with replacement. For exam-
ple, to generate 5 independent DUnif(1, 2, . . . , 100) r.v.s, we can use the command
sample(100,5,replace=TRUE).
It turns out that sample is far more versatile. If we want to sample from the values
x1 , . . . , xn with probabilities p1 , . . . , pn , we simply create a vector x containing all
the xi and a vector p containing all the pi , then feed them into sample. Suppose we
want realizations of i.i.d. r.v.s X1 , . . . , X100 whose PMF is

                                     P (Xj = 0) = 0.25,
                                     P (Xj = 1) = 0.5,
                                     P (Xj = 5) = 0.1,
                                    P (Xj = 10) = 0.15,

and P (Xj = x) = 0 for all other values of x. First, we use the c function to
create vectors with the support of the distribution and the corresponding probabil-
ities.
x <- c(0,1,5,10)
p <- c(0.25,0.5,0.1,0.15)


140                                                                     Introduction to Probability

Next, we use sample. Here’s how to get 100 draws from the PMF above:
sample(x,100,prob=p,replace=TRUE)
The inputs are the vector x to sample from, the sample size (100 in this case), the
probabilities p to use when sampling from x (if this is omitted, the probabilities are
assumed equal), and whether to sample with replacement.




3.12     Exercises

Exercises marked with s have detailed solutions at http://stat110.net.

        PMFs and CDFs
   1.   People are arriving at a party one at a time. While waiting for more people to arrive
        they entertain themselves by comparing their birthdays. Let X be the number of people
        needed to obtain a birthday match, i.e., before person X arrives no two people have the
        same birthday, but when person X arrives there is a match. Find the PMF of X.
   2.   (a) Independent Bernoulli trials are performed, with probability 1/2 of success, until
        there has been at least one success. Find the PMF of the number of trials performed.
        (b) Independent Bernoulli trials are performed, with probability 1/2 of success, until
        there has been at least one success and at least one failure. Find the PMF of the number
        of trials performed.
   3.   Let X be an r.v. with CDF F , and Y = µ + σX, where µ and σ are real numbers with
        σ > 0. (Then Y is called a location-scale transformation of X; we will encounter this
        concept many times in Chapter 5 and beyond.) Find the CDF of Y , in terms of F .
   4.   Let n be a positive integer and
                                                          bxc
                                               F (x) =
                                                           n
        for 0 ≤ x ≤ n, F (x) = 0 for x < 0, and F (x) = 1 for x > n, where bxc is the greatest
        integer less than or equal to x. Show that F is a CDF, and find the PMF that it
        corresponds to.
                                n+1
   5.   (a) Show that p(n) = 12       for n = 0, 1, 2, . . . is a valid PMF for a discrete r.v.
        (b) Find the CDF of a random variable with the PMF from (a).
   6.    s Benford’s law states that in a very large variety of real-life data sets, the first digit
        approximately follows a particular distribution with about a 30% chance of a 1, an 18%
        chance of a 2, and in general
                                                   
                                              j+1
                          P (D = j) = log10           , for j ∈ {1, 2, 3, . . . , 9},
                                                 j
        where D is the first digit of a randomly chosen element. Check that this is a valid PMF
        (using properties of logs, not with a calculator).
   7.   Bob is playing a video game that has 7 levels. He starts at level 1, and has probability
        p1 of reaching level 2. In general, given that he reaches level j, he has probability pj of
        reaching level j + 1, for 1 ≤ j ≤ 6. Let X be the highest level that he reaches. Find the
        PMF of X (in terms of p1 , . . . , p6 ).


Random variables and their distributions                                                             141

   8.   There are 100 prizes, with one worth $1, one worth $2, . . . , and one worth $100. There
        are 100 boxes, each of which contains one of the prizes. You get 5 prizes by picking
        random boxes one at a time, without replacement. Find the PMF of how much your
        most valuable prize is worth (as a simple expression in terms of binomial coefficients).
   9.   Let F1 and F2 be CDFs, 0 < p < 1, and F (x) = pF1 (x) + (1 − p)F2 (x) for all x.

        (a) Show directly that F has the properties of a valid CDF (see Theorem 3.6.3). The
        distribution defined by F is called a mixture of the distributions defined by F1 and F2 .

        (b) Consider creating an r.v. in the following way. Flip a coin with probability p of
        Heads. If the coin lands Heads, generate an r.v. according to F1 ; if the coin lands Tails,
        generate an r.v. according to F2 . Show that the r.v. obtained in this way has CDF F .
  10.   (a) Is there a discrete distribution with support 1, 2, 3, . . . , such that the value of the
        PMF at n is proportional to 1/n?
        Hint: See the math appendix for a review of some facts about series.

        (b) Is there a discrete distribution with support 1, 2, 3, . . . , such that the value of the
        PMF at n is proportional to 1/n2 ?
  11.    s Let X be an r.v. whose possible values are 0, 1, 2, . . . , with CDF F . In some countries,
        rather than using a CDF, the convention is to use the function G defined by G(x) =
        P (X < x) to specify a distribution. Find a way to convert from F to G, i.e., if F is a
        known function, show how to obtain G(x) for all real x.
  12.   (a) Give an example of r.v.s X and Y such that FX (x) ≤ FY (x) for all x, where the
        inequality is strict for some x. Here FX is the CDF of X and FY is the CDF of Y . For
        the example you gave, sketch the CDFs of both X and Y on the same axes. Then sketch
        their PMFs on a second set of axes.

        (b) In Part (a), you found an example of two different CDFs where the first is less than
        or equal to the second everywhere. Is it possible to find two different PMFs where the
        first is less than or equal to the second everywhere? In other words, find discrete r.v.s
        X and Y such that P (X = x) ≤ P (Y = x) for all x, where the inequality is strict for
        some x, or show that it is impossible to find such r.v.s.
  13.   Let X, Y, Z be discrete r.v.s such that X and Y have the same conditional distribution
        given Z, i.e., for all a and z we have

                                   P (X = a|Z = z) = P (Y = a|Z = z).

        Show that X and Y have the same distribution (unconditionally, not just when given
        Z).
  14.   Let X be the number of purchases that Fred will make on the online site for a certain
        company (in some specified time period). Suppose that the PMF of X is P (X = k) =
        e−λ λk /k! for k = 0, 1, 2, . . . . This distribution is called the Poisson distribution with
        parameter λ, and it will be studied extensively in later chapters.

        (a) Find P (X ≥ 1) and P (X ≥ 2) without summing infinite series.

        (b) Suppose that the company only knows about people who have made at least one
        purchase on their site (a user sets up an account to make a purchase, but someone
        who has never made a purchase there doesn’t appear in the customer database). If the
        company computes the number of purchases for everyone in their database, then these
        data are draws from the conditional distribution of the number of purchases, given that
        at least one purchase is made. Find the conditional PMF of X given X ≥ 1. (This
        conditional distribution is called a truncated Poisson distribution.)


142                                                                     Introduction to Probability

        Named distributions
  15.   Find the CDF of an r.v. X ∼ DUnif(1, 2, . . . , n).
  16.   Let X ∼ DUnif(C), and B be a nonempty subset of C. Find the conditional distribution
        of X, given that X is in B.
  17.   An airline overbooks a flight, selling more tickets for the flight than there are seats on
        the plane (figuring that it’s likely that some people won’t show up). The plane has 100
        seats, and 110 people have booked the flight. Each person will show up for the flight
        with probability 0.9, independently. Find the probability that there will be enough seats
        for everyone who shows up for the flight.
  18.    s (a) In the World Series of baseball, two teams (call them A and B) play a sequence
        of games against each other, and the first team to win four games wins the series. Let
        p be the probability that A wins an individual game, and assume that the games are
        independent. What is the probability that team A wins the series?
        (b) Give a clear intuitive explanation of whether the answer to (a) depends on whether
        the teams always play 7 games (and whoever wins the majority wins the series), or the
        teams stop playing more games as soon as one team has won 4 games (as is actually
        the case in practice: once the match is decided, the two teams do not keep playing more
        games).
  19.   In a chess tournament, n games are being played, independently. Each game ends in a
        win for one player with probability 0.4 and ends in a draw (tie) with probability 0.6.
        Find the PMFs of the number of games ending in a draw, and of the number of players
        whose games end in draws.
  20.   Suppose that a lottery ticket has probability p of being a winning ticket, independently
        of other tickets. A gambler buys 3 tickets, hoping this will triple the chance of having
        at least one winning ticket.
        (a) What is the distribution of how many of the 3 tickets are winning tickets?
        (b) Show that the probability that at least 1 of the 3 tickets is winning is 3p − 3p2 + p3 ,
        in two different ways: by using inclusion-exclusion, and by taking the complement of
        the desired event and then using the PMF of a certain named distribution.
        (c) Show that the gambler’s chances of having at least one winning ticket do not quite
        triple (compared with buying only one ticket), but that they do approximately triple if
        p is small.
  21.   s Let X ∼ Bin(n, p) and Y ∼ Bin(m, p), independent of X. Show that X − Y is not
        Binomial.
  22.   There are two coins, one with probability p1 of Heads and the other with probability
        p2 of Heads. One of the coins is randomly chosen (with equal probabilities for the two
        coins). It is then flipped n ≥ 2 times. Let X be the number of times it lands Heads.
        (a) Find the PMF of X.
        (b) What is the distribution of X if p1 = p2 ?
        (c) Give an intuitive explanation of why X is not Binomial for p1 6= p2 (its distribution is
        called a mixture of two Binomials). You can assume that n is large for your explanation,
        so that the frequentist interpretation of probability can be applied.
  23.   There are n people eligible to vote in a certain election. Voting requires registration.
        Decisions are made independently. Each of the n people will register with probability
        p1 . Given that a person registers, they will vote with probability p2 . Given that a person
        votes, they will vote for Kodos (who is one of the candidates) with probability p3 . What
        is the distribution of the number of votes for Kodos (give the PMF, fully simplified, or
        the name of the distribution, including its parameters)?


Random variables and their distributions                                                          143

  24.   Let X be the number of Heads in 10 fair coin tosses.

        (a) Find the conditional PMF of X, given that the first two tosses both land Heads.

        (b) Find the conditional PMF of X, given that at least two tosses land Heads.
  25.    s Alice flips a fair coin n times and Bob flips another fair coin n + 1 times, resulting
        in independent X ∼ Bin(n, 12 ) and Y ∼ Bin(n + 1, 12 ).

        (a) Show that P (X < Y ) = P (n − X < n + 1 − Y ).

        (b) Compute P (X < Y ).
        Hint: Use (a) and the fact that X and Y are integer-valued.
  26.   If X ∼ HGeom(w, b, n), what is the distribution of n − X? Give a short proof.
  27.   Recall de Montmort’s matching problem from Chapter 1: in a deck of n cards labeled 1
        through n, a match occurs when the number on the card matches the card’s position in
        the deck. Let X be the number of matching cards. Is X Binomial? Is X Hypergeometric?
  28.    s There are n eggs, each of which hatches a chick with probability p (independently).
        Each of these chicks survives with probability r, independently. What is the distribution
        of the number of chicks that hatch? What is the distribution of the number of chicks that
        survive? (Give the PMFs; also give the names of the distributions and their parameters,
        if applicable.)
  29.    s A sequence of n independent experiments is performed. Each experiment is a success
        with probability p and a failure with probability q = 1 − p. Show that conditional on
        the number of successes, all valid possibilities for the list of outcomes of the experiment
        are equally likely.
  30.   A certain company has n + m employees, consisting of n women and m men. The
        company is deciding which employees to promote.

        (a) Suppose for this part that the company decides to promote t employees, where
        1 ≤ t ≤ n + m, by choosing t random employees (with equal probabilities for each set
        of t employees). What is the distribution of the number of women who get promoted?

        (b) Now suppose that instead of having a predetermined number of promotions to
        give, the company decides independently for each employee, promoting the employee
        with probability p. Find the distributions of the number of women who are promoted,
        the number of women who are not promoted, and the number of employees who are
        promoted.

        (c) In the set-up from (b), find the conditional distribution of the number of women
        who are promoted, given that exactly t employees are promoted.
  31.   Once upon a time, a famous statistician offered tea to a lady. The lady claimed that
        she could tell whether milk had been added to the cup before or after the tea. The
        statistician decided to run some experiments to test her claim.

        (a) The lady is given 6 cups of tea, where it is known in advance that 3 will be milk-
        first and 3 will be tea-first, in a completely random order. The lady gets to taste each
        and then guess which 3 were milk-first. Assume for this part that she has no ability
        whatsoever to distinguish milk-first from tea-first cups of tea. Find the probability that
        at least 2 of her 3 guesses are correct.

        (b) Now the lady is given one cup of tea, with probability 1/2 of it being milk-first.
        She needs to say whether she thinks it was milk-first. Let p1 be the lady’s probability
        of being correct given that it was milk-first, and p2 be her probability of being correct
        given that it was tea-first. She claims that the cup was milk-first. Find the posterior
        odds that the cup is milk-first, given this information.


144                                                                     Introduction to Probability

  32.   In Evan’s history class, 10 out of 100 key terms will be randomly selected to appear
        on the final exam; Evan must then choose 7 of those 10 to define. Since he knows the
        format of the exam in advance, Evan is trying to decide how many key terms he should
        study.

        (a) Suppose that Evan decides to study s key terms, where s is an integer between 0
        and 100. Let X be the number of key terms appearing on the exam that he has studied.
        What is the distribution of X? Give the name and parameters, in terms of s.

        (b) Using R or other software, calculate the probability that Evan knows at least 7 of
        the 10 key terms that appear on the exam, assuming that he studies s = 75 key terms.
  33.   A book has n typos. Two proofreaders, Prue and Frida, independently read the book.
        Prue catches each typo with probability p1 and misses it with probability q1 = 1 − p1 ,
        independently, and likewise for Frida, who has probabilities p2 of catching and q2 = 1−p2
        of missing each typo. Let X1 be the number of typos caught by Prue, X2 be the number
        caught by Frida, and X be the number caught by at least one of the two proofreaders.

        (a) Find the distribution of X.

        (b) For this part only, assume that p1 = p2 . Find the conditional distribution of X1
        given that X1 + X2 = t.
  34.   There are n students at a certain school, of whom X ∼ Bin(n, p) are Statistics majors.
        A simple random sample of size m is drawn (“simple random sample” means sampling
        without replacement, with all subsets of the given size equally likely).

        (a) Find the PMF of the number of Statistics majors in the sample, using the law of total
        probability (don’t forget to say what the support is). You can leave your answer as a
        sum (though with some algebra it can be simplified, by writing the binomial coefficients
        in terms of factorials and using the binomial theorem).

        (b) Give a story proof derivation of the distribution of the number of Statistics majors
        in the sample; simplify fully.
        Hint: Does it matter whether the students declare their majors before or after the
        random sample is drawn?
  35.    s Players A and B take turns in answering trivia questions, starting with player A
        answering the first question. Each time A answers a question, she has probability p1 of
        getting it right. Each time B plays, he has probability p2 of getting it right.

        (a) If A answers m questions, what is the PMF of the number of questions she gets
        right?

        (b) If A answers m times and B answers n times, what is the PMF of the total number
        of questions they get right (you can leave your answer as a sum)? Describe exactly
        when/whether this is a Binomial distribution.

        (c) Suppose that the first player to answer correctly wins the game (with no predeter-
        mined maximum number of questions that can be asked). Find the probability that A
        wins the game.
  36.   There are n voters in an upcoming election in a certain country, where n is a large, even
        number. There are two candidates: Candidate A (from the Unite Party) and Candidate
        B (from the Untie Party). Let X be the number of people who vote for Candidate A.
        Suppose that each voter chooses randomly whom to vote for, independently and with
        equal probabilities.

        (a) Find an exact expression for the probability of a tie in the election (so the candidates
        end up with the same number of votes).


Random variables and their distributions                                                               145

        (b) Use Stirling’s approximation, which approximates the factorial function as
                                               √      n n
                                          n! ≈ 2πn          ,
                                                       e
        to find a simple approximation to the probability of a tie. Your answer should be of the
                √
        form 1/ cn, with c a constant (which you should specify).
  37.    s A message is sent over a noisy channel. The message is a sequence x1 , x2 , . . . , xn of
        n bits (xi ∈ {0, 1}). Since the channel is noisy, there is a chance that any bit might be
        corrupted, resulting in an error (a 0 becomes a 1 or vice versa). Assume that the error
        events are independent. Let p be the probability that an individual bit has an error
        (0 < p < 1/2). Let y1 , y2 , . . . , yn be the received message (so yi = xi if there is no error
        in that bit, but yi = 1 − xi if there is an error there).

        To help detect errors, the nth bit is reserved for a parity check: xn is defined to be 0 if
        x1 + x2 + · · · + xn−1 is even, and 1 if x1 + x2 + · · · + xn−1 is odd. When the message is
        received, the recipient checks whether yn has the same parity as y1 + y2 + · · · + yn−1 . If
        the parity is wrong, the recipient knows that at least one error occurred; otherwise, the
        recipient assumes that there were no errors.

        (a) For n = 5, p = 0.1, what is the probability that the received message has errors
        which go undetected?

        (b) For general n and p, write down an expression (as a sum) for the probability that
        the received message has errors which go undetected.

        (c) Give a simplified expression, not involving a sum of a large number of terms, for the
        probability that the received message has errors which go undetected.
        Hint for (c): Letting
                                      !                                       !
                         X          n k                           X         n k
                 a=                    p (1 − p)n−k and b =                    p (1 − p)n−k ,
                                    k                                       k
                      k even, k≥0                              k odd, k≥1

        the binomial theorem makes it possible to find simple expressions for a + b and a − b,
        which then makes it possible to obtain a and b.


        Independence of r.v.s
  38.   (a) Give an example of dependent r.v.s X and Y such that P (X < Y ) = 1.

        (b) Give an example of independent r.v.s X and Y such that P (X < Y ) = 1.
  39.   Give an example of two discrete random variables X and Y on the same sample space
        such that X and Y have the same distribution, with support {1, 2, . . . , 10}, but the
        event X = Y never occurs. If X and Y are independent, is it still possible to construct
        such an example?
  40.   Suppose X and Y are discrete r.v.s such that P (X = Y ) = 1. This means that X and
        Y always take on the same value.

        (a) Do X and Y have the same PMF?

        (b) Is it possible for X and Y to be independent?
  41.   If X, Y, Z are r.v.s such that X and Y are independent and Y and Z are independent,
        does it follow that X and Z are independent?
        Hint: Think about simple and extreme examples.


146                                                                         Introduction to Probability

  42.    s Let X be a random day of the week, coded so that Monday is 1, Tuesday is 2, etc. (so
        X takes values 1, 2, . . . , 7, with equal probabilities). Let Y be the next day after X (again
        represented as an integer between 1 and 7). Do X and Y have the same distribution?
        What is P (X < Y )?
  43.   (a) Is it possible to have two r.v.s X and Y such that X and Y have the same distribution
        but P (X < Y ) ≥ p, where:
            • p = 0.9?
            • p = 0.99?
            • p = 0.9999999999999?
            • p = 1?
        For each, give an example showing it is possible, or prove it is impossible.
        Hint: Do the previous question first.
        (b) Consider the same question as in Part (a), but now assume that X and Y are
        independent. Do your answers change?
  44.   For x and y binary digits (0 or 1), let x ⊕ y be 0 if x = y and 1 if x 6= y (this operation
        is called exclusive or (often abbreviated to XOR), or addition mod 2 ).
        (a) Let X ∼ Bern(p) and Y ∼ Bern(1/2), independently. What is the distribution of
        X ⊕Y?
        (b) With notation as in (a), is X ⊕ Y independent of X? Is X ⊕ Y independent of Y ?
        Be sure to consider both the case p = 1/2 and the case p 6= 1/2.
        (c) Let X1 , . . . , Xn be i.i.d. Bern(1/2). For each nonempty subset J of {1, 2, . . . , n}, let
                                                        M
                                                  YJ =      Xj ,
                                                       j∈J

        where the notation means to “add” in the ⊕ sense all the elements of J; the order in
        which this is done doesn’t matter since x ⊕ y = y ⊕ x and (x ⊕ y) ⊕ z = x ⊕ (y ⊕ z).
        Show that YJ ∼ Bern(1/2) and that these 2n − 1 r.v.s are pairwise independent, but
        not independent. For example, we can use this to simulate 1023 pairwise independent
        fair coin tosses using only 10 independent fair coin tosses.
        Hint: Apply the previous parts with p = 1/2. Show that if J and K are two different
        nonempty subsets of {1, 2, . . . , n}, then we can write YJ = A ⊕ B, YK = A ⊕ C, where A
        consists of the Xi with i ∈ J ∩ K, B consists of the Xi with i ∈ J ∩ K c , and C consists of
        the Xi with i ∈ J c ∩ K. Then A, B, C are independent since they are based on disjoint
        sets of Xi . Also, at most one of these sets of Xi can be empty. If J ∩ K = ∅, then
        YJ = B, YK = C. Otherwise, compute P (YJ = y, YK = z) by conditioning on whether
        A = 1.


        Mixed practice
  45.    s A new treatment for a disease is being tested, to see whether it is better than the
        standard treatment. The existing treatment is effective on 50% of patients. It is believed
        initially that there is a 2/3 chance that the new treatment is effective on 60% of patients,
        and a 1/3 chance that the new treatment is effective on 50% of patients. In a pilot study,
        the new treatment is given to 20 random patients, and is effective for 15 of them.
        (a) Given this information, what is the probability that the new treatment is better
        than the standard treatment?
        (b) A second study is done later, giving the new treatment to 20 new random patients.
        Given the results of the first study, what is the PMF for how many of the new patients
        the new treatment is effective on? (Letting p be the answer to (a), your answer can be
        left in terms of p.)


Random variables and their distributions                                                          147

  46.   Independent Bernoulli trials are performed, with success probability 1/2 for each trial.
        An important question that often comes up in such settings is how many trials to
        perform. Many controversies have arisen in statistics over the issue of how to analyze
        data coming from an experiment where the number of trials can depend on the data
        collected so far.

        For example, if we can follow the rule “keep performing trials until there are more than
        twice as many failures as successes, and then stop”, then naively looking at the ratio
        of failures to successes (if and when the process stops) will give more than 2:1 rather
        than the true theoretical 1:1 ratio; this could be a very misleading result! However, it
        might never happen that there are more than twice as many failures as successes; in
        this problem, you will find the probability of that happening.

        (a) Two gamblers, A and B, make a series of bets, where each has probability 1/2 of
        winning a bet, but A gets $2 for each win and loses $1 for each loss (a very favorable
        game for A!). Assume that the gamblers are allowed to borrow money, so they can and
        do gamble forever. Let pk be the probability that A, starting with $k, will ever reach
        $0, for each k ≥ 0. Explain how this story relates to the original problem, and how the
        original problem can be solved if we can find pk .

        (b) Find pk .
        Hint: As in the gambler’s ruin, set up and solve a difference equation for pk . We have
        pk → 0 as k → ∞ (you don’t need to prove this, but it should make sense since the
        game is so favorable to A, which will result in A’s fortune going to ∞; a formal proof,
        not required here, could be done using the law of large numbers, an important theorem
        from Chapter 10). The solution can be written neatly in terms of the golden ratio.

        (c) Find the probability of ever having more than twice as many failures as successes
        with independent Bern(1/2) trials, as originally desired.
  47.   A copy machine is used to make n pages of copies per day. The machine has two trays
        in which paper gets loaded, and each page used is taken randomly and independently
        from one of the trays. At the beginning of the day, the trays are refilled so that they
        each have m pages.

        (a) Let pbinom(x, n, p) be the CDF of the Bin(n, p) distribution, evaluated at x. In
        terms of pbinom, find a simple expression for the probability that both trays have
        enough paper on any particular day, when this probability is strictly between 0 and 1
        (also specify the values of m for which the probability is 0 and the values for which it
        is 1).
        Hint: Be careful about whether inequalities are strict, since the Binomial is discrete.

        (b) Using a computer, find the smallest value of m for which there is at least a 95% chance
        that both trays have enough paper on a particular day, for n = 10, n = 100, n = 1000,
        and n = 10000.
        Hint: If you use R, you may find the following commands useful:
        g <- function(m,n) [your answer from (a)] defines a function g such that g(m, n)
        is your answer from (a), g(1:100,100) gives the vector (g(1, 100), . . . , g(100, 100)),
        which(v>0.95) gives the indices of the components of vector v that exceed 0.95, and
        min(w) gives the minimum of a vector w.


Taylor & Francis
Taylor & Francis Group
http://taylorandfrancis.com


4
Expectation




4.1   Definition of expectation

In the previous chapter, we introduced the distribution of a random variable, which
gives us full information about the probability that the r.v. will fall into any partic-
ular set. For example, we can say how likely it is that the r.v. will exceed 1000, that
it will equal 5, or that it will be in the interval [0, 7]. It can be unwieldy to manage
so many probabilities though, so often we want just one number summarizing the
“average” value of the r.v.
There are several senses in which the word “average” is used, but by far the most
commonly used is the mean of an r.v., also known as its expected value. In addition,
much of statistics is about understanding variability in the world, so it is often
important to know how “spread out” the distribution is; we will formalize this with
the concepts of variance and standard deviation. As we’ll see, variance and standard
deviation are defined in terms of expected values, so the uses of expected values go
far beyond just computing averages.
Given a list of numbers x1 , x2 , . . . , xn , the familiar way to average them is to add
them up and divide by n. This is called the arithmetic mean, and is defined by
                                              n
                                            1X
                                     x̄ =      xj .
                                            n
                                             j=1


More generally, we can define a weighted mean of x1 , . . . , xn as
                                                   n
                                                   X
                            weighted-mean(x) =           xj pj ,
                                                   j=1


where the weights p1 , . . . , pn are pre-specified nonnegative numbers that add up to
1 (so the unweighted mean x̄ is obtained when pj = 1/n for all j).
The definition of expectation for a discrete r.v. is inspired by the weighted mean of
a list of numbers, with weights given by probabilities.
Definition 4.1.1 (Expectation of a discrete r.v.). The expected value (also called
the expectation or mean) of a discrete r.v. X whose distinct possible values are

                                                                                     149


150                                                                Introduction to Probability

x1 , x2 , . . . is defined by
                                          ∞
                                          X
                                 E(X) =         xj P (X = xj ).
                                          j=1

If the support is finite, then this is replaced by a finite sum. We can also write
                                        X
                              E(X) =         x P (X = x),
                                            |{z} | {z }
                                           x
                                               value   PMF at x

where the sum is over the support of X (in any P case, xP (X = x) is 0 for any x not
in the support). The expectation is undefined if ∞ j=1 |xj |P (X = xj ) diverges, since
then the series for E(X) diverges or its value depends on the order in which the xj
are listed.
In words, the expected value of X is a weighted average of the possible values that
X can take on, weighted by their probabilities. Let’s check that the definition makes
sense in a few simple examples:

   1. Let X be the result of rolling a fair 6-sided die, so X takes on the values
      1, 2, 3, 4, 5, 6, with equal probabilities. Intuitively, we should be able to
      get the average by adding up these values and dividing by 6. Using the
      definition, the expected value is
                                      1
                                E(X) = (1 + 2 + · · · + 6) = 3.5,
                                      6
        as we expected. Note that X never equals its mean in this example. This
        is similar to the fact that the average number of children per household in
        some country could be 1.8, but that doesn’t mean that a typical household
        has 1.8 children!
   2. Let X ∼ Bern(p) and q = 1 − p. Then

                                      E(X) = 1p + 0q = p,

        which makes sense intuitively since it is between the two possible values
        of X, compromising between 0 and 1 based on how likely each is. This is
        illustrated in Figure 4.1 for a case with p < 1/2: two pebbles are being
        balanced on a seesaw. For the seesaw to balance, the fulcrum (shown as a
        triangle) must be at p, which in physics terms is the center of mass.
        The frequentist interpretation would be to consider a large number of
        independent Bernoulli trials, each with probability p of success. Writing 1
        for “success” and 0 for “failure”, in the long run we would expect to have
        data consisting of a list of numbers where the proportion of 1’s is very
        close to p. The average of a list of 0’s and 1’s is the proportion of 1’s.
   3. Let X have 3 distinct possible values, a1 , a2 , a3 , with probabilities p1 , p2 , p3 ,
      respectively. Imagine running a simulation where n independent draws


Expectation                                                                           151



                     q
                                                                   p
                      0                     0.5                    1

                                     p

FIGURE 4.1
Center of mass of two pebbles, depicting that E(X) = p for X ∼ Bern(p). Here q
and p denote the masses of the two pebbles.


       from the distribution of X are generated. For n large, we would expect to
       have about p1 n a1 ’s, p2 n a2 ’s, and p3 n a3 ’s. (We will look at a more math-
       ematical version of this example when we study the law of large numbers
       in Chapter 10.) If the simulation results are close to these expected results,
       then the arithmetic mean of the simulation results is approximately
              p1 n · a1 + p2 n · a2 + p3 n · a3
                                                = p1 a1 + p2 a2 + p3 a3 = E(X).
                              n

Note that E(X) depends only on the distribution of X. This follows directly from
the definition, but is worth recording since it is fundamental.
Proposition 4.1.2. If X and Y are discrete r.v.s with the same distribution, then
E(X) = E(Y ) (if either side exists).

Proof. In the definition of E(X), we only need to know the PMF of X.                      

The converse of the above proposition is false since the expected value is just a one-
number summary, not nearly enough to specify the entire distribution; it’s a measure
of where the “center” is but does not determine, for example, how spread out the
distribution is or how likely the r.v. is to be positive. Figure 4.2 shows an example
of two different PMFs with the same expected value (balancing point).
h 4.1.3 (Replacing an r.v. by its expectation). For any discrete r.v. X, the expected
value E(X) is a number (if it exists). A common mistake is to replace an r.v. by
its expectation without justification, which is wrong both mathematically (X is
a function, E(X) is a constant) and statistically (it ignores the variability of X),
except in the degenerate case where X is a constant.
Notation 4.1.4. We often abbreviate E(X) to EX. Similarly, we often abbreviate
E(X 2 ) to EX 2 , and E(X n ) to EX n .
h 4.1.5. Paying attention to the order of operations is crucial when working with
expectation. As stated above, EX 2 is the expectation of the random variable X 2 , not
the square of the number EX. Unless the parentheses explicitly indicate otherwise,


152                                                             Introduction to Probability




            1.0




                                                1.0
            0.8




                                                0.8
            0.6




                                                0.6
                                                          ●           ●

            0.4




                                                0.4
                            ●


                      ●            ●
            0.2




                                                0.2
                  ●                     ●
            0.0




                                                0.0
                  0   1     2      3    4             0   1     2     3     4




FIGURE 4.2
The expected value does not determine the distribution: different PMFs can have
the same balancing point.

for the expectation of an r.v. raised to a power, first we take the
                                                                  power and then we
take the expectation. For example, E(X − 1)4 is E (X − 1)4 , not (E(X − 1))4 .




4.2    Linearity of expectation

The most important property of expectation is linearity: the expected value of a
sum of r.v.s is the sum of the individual expected values.
Theorem 4.2.1 (Linearity of expectation). For any r.v.s X, Y and any constant c,
                                E(X + Y ) = E(X) + E(Y ),
                                   E(cX) = cE(X).

The second equation says that we can take out constant factors from an expectation;
this is both intuitively reasonable and easily verified from the definition. The first
equation, E(X + Y ) = E(X) + E(Y ), also seems reasonable when X and Y are
independent. What may be surprising is that it holds even if X and Y are dependent!
To build intuition for this, consider the extreme case where X always equals Y . Then
X + Y = 2X, and both sides of E(X + Y ) = E(X) + E(Y ) are equal to 2E(X), so
linearity still holds even in the most extreme case of dependence.
Linearity is true for all r.v.s, not just discrete r.v.s, but in this chapter we will prove
it only for discrete r.v.s. Before proving linearity, it is worthwhile to recall some
basic facts about averages. If we have a list of numbers, say (1, 1, 1, 1, 1, 3, 3, 5), we
can calculate their mean by adding all the values and dividing by the length of the
list, so that each element of the list gets a weight of 18 :
                          1
                            (1 + 1 + 1 + 1 + 1 + 3 + 3 + 5) = 2.
                          8


Expectation                                                                        153

But another way to calculate the mean is to group together all the 1’s, all the 3’s,
and all the 5’s, and then take a weighted average, giving appropriate weights to 1’s,
3’s, and 5’s:
                               5      2      1
                                 · 1 + · 3 + · 5 = 2.
                               8      8      8

This insight—that averages can be calculated in two ways, ungrouped or grouped —
is all that is needed to prove linearity! Recall that X is a function which assigns
a real number to every outcome s in the sample space. The r.v. X may assign
the same value to multiple sample outcomes. When this happens, our definition of
expectation groups all these outcomes together into a super-pebble whose weight,
P (X = x), is the total weight of the constituent pebbles. This grouping process
is illustrated in Figure 4.3 for a hypothetical r.v. taking values in {0, 1, 2}. So our
definition of expectation corresponds to the grouped way of taking averages.


                  0       1                         0      1
                                 2                                 2
                          1                                1
                  0                                 0
                          1      2                         1       2
                  0                                 0
                          1                                1



FIGURE 4.3
Left: X assigns a number to each pebble in the sample space. Right: Grouping the
pebbles by the value that X assigns to them, the 9 pebbles become 3 super-pebbles.
The weight of a super-pebble is the sum of the weights of the constituent pebbles.

The advantage of this definition is that it allows us to work with the distribution of
X directly, without returning to the sample space. The disadvantage comes when we
have to prove theorems like this one, for if we have another r.v. Y on the same sample
space, the super-pebbles created by Y are different from those created
                                                                   P      from X, with
different
P          weights P (Y = y); this makes it difficult to combine x xP (X = x) and
   y yP (Y  = y).
Fortunately, we know there’s another equally valid way to calculate an average: we
can take a weighted average of the values of individual pebbles. In other words, if
X(s) is the value that X assigns to pebble s, we can take the weighted average
                                       X
                              E(X) =        X(s)P ({s}),
                                        s

where P ({s}) is the weight of pebble s. This corresponds to the ungrouped way of
taking averages. The advantage of this definition is that it breaks down the sample
space into the smallest possible units, so we are now using the same weights P ({s})
for every random variable defined on this sample space. If Y is another random


154                                                        Introduction to Probability

variable, then                         X
                             E(Y ) =       Y (s)P ({s}).
                                       s
              P                  P
We can combine s X(s)P ({s}) and s Y (s)P ({s}), which gives
             X               X                 X
E(X)+E(Y ) =   X(s)P ({s})+     Y (s)P ({s}) =   (X+Y )(s)P ({s}) = E(X+Y ).
                 s                 s                   s


Another intuition for linearity of expectation is via the concept of simulation. If
we simulate many, many times from the distribution of X, the histogram of the
simulated values will look very much like the true PMF of X. In particular, the
arithmetic mean of the simulated values will be very close to the true value of E(X)
(the precise nature of this convergence is described by the law of large numbers, an
important theorem that we will discuss in detail in Chapter 10).
Let X and Y be r.v.s summarizing a certain experiment. Suppose we perform the
experiment n times, where n is a very large number, and we write down the values
realized by X and Y each time. For each repetition of the experiment, we obtain
an X value, a Y value, and (by adding them) an X + Y value. In Figure 4.4, each
row represents a repetition of the experiment. The left column contains the draws
of X, the middle column contains the draws of Y , and the right column contains
the draws of X + Y .
There are two ways to calculate the sum of all the numbers in the last column. The
straightforward way is just to add all the numbers in that column. But an equally
valid way is to add all the numbers in the first column, add all the numbers in the
second column, and then add the two column sums.
Dividing by n everywhere, what we’ve argued is that the following procedures are
equivalent:
• Taking the arithmetic mean of all the numbers in the last column. By the law of
  large numbers, this is very close to E(X + Y ).
• Taking the arithmetic mean of the first column and the arithmetic mean of the
  second column, then adding the two column means. By the law of large numbers,
  this is very close to E(X) + E(Y ).
Linearity of expectation thus emerges as a simple fact about arithmetic (we’re just
adding numbers in two different orders)! Notice that nowhere in our argument did
we rely on whether X and Y were independent. In fact, in Figure 4.4, X and Y
appear to be dependent: Y tends to be large when X is large, and Y tends to be
small when X is small (in the language of Chapter 7, we say that X and Y are
positively correlated ). But this dependence is irrelevant: shuffling the draws of Y
could completely alter the pattern of dependence between X and Y , but would
have no effect on the column sums.


Expectation                                                                     155




                       X              Y             X +Y
                        3             4                   7
                        2             2                   4
                        6             8                 14
                       10           23                  33
                        1           −3                  −2
                        1             0                   1
                        5             9                 14
                        4             1                   5
                        ..           ..                  ..
                         .            .                   .

                        n             n             n
                     1X            1X            1X
                        xi +          yi =         (xi + yi )
                     n             n             n
                       i=1           i=1           i=1


                       E(X) +        E(Y ) =        E(X + Y )

FIGURE 4.4
Intuitive view of linearity of expectation. Each row represents a repetition of the
experiment; the three columns are the realized values of X, Y , and X + Y , respec-
tively. Adding all the numbers in the last column is equivalent to summing the first
column and the second column separately, then adding the two column sums. So
the mean of the last column is the sum of the first and second column means; this
is linearity of expectation.


156                                                             Introduction to Probability

Linearity is an extremely handy tool for calculating expected values, often allowing
us to bypass the definition of expected value altogether. Let’s use linearity to find
the expectations of the Binomial and Hypergeometric distributions.
Example 4.2.2 (Binomial expectation). For X ∼ Bin(n, p), let’s find E(X) in two
ways. By definition of expectation,
                             n
                             X                  n
                                                X    
                                                     n k n−k
                    E(X) =         kP (X = k) =   k     p q  .
                                                     k
                             k=0                    k=0
                                       
From Example 1.5.2, we know k nk = n n−1
                                     k−1 , so

                    Xn              X n       
                           n k n−k          n − 1 k n−k
                        k     p q  =n              p q
                           k                k−1
                    k=0               k=0
                                        Xn       
                                             n − 1 k−1 n−k
                                   = np             p q
                                             k−1
                                        k=1
                                        X n − 1
                                        n−1
                                   = np             pj q n−1−j
                                               j
                                              j=0

                                       = np.

The sum in the penultimate line equals 1 because it is the sum of the Bin(n − 1, p)
PMF (or by the binomial theorem). Therefore, E(X) = np.
This proof required us to remember combinatorial identities and manipulate bino-
mial coefficients. Using linearity of expectation, we obtain a much shorter path to
the same result. Let’s write X as the sum of n independent Bern(p) r.v.s:

                                   X = I1 + · · · + In ,

where each Ij has expectation E(Ij ) = 1p + 0q = p. By linearity,

                         E(X) = E(I1 ) + · · · + E(In ) = np.                           

Example 4.2.3 (Hypergeometric expectation). Let X ∼ HGeom(w, b, n), inter-
preted as the number of white balls in a sample of size n drawn without replacement
from an urn with w white and b black balls. As in the Binomial case, we can write
X as a sum of Bernoulli random variables,

                                   X = I1 + · · · + In ,

where Ij equals 1 if the jth ball in the sample is white and 0 otherwise. By symmetry,
Ij ∼ Bern(p) with p = w/(w +b), since unconditionally the jth ball drawn is equally
likely to be any of the balls.
Unlike in the Binomial case, the Ij are not independent, since the sampling is
without replacement: given that a ball in the sample is white, there is a lower


Expectation                                                                           157

chance that another ball in the sample is white. However, linearity still holds for
dependent random variables! Thus,

                                    E(X) = nw/(w + b).                                  

As another example of the power of linearity, we can give a quick proof of the
intuitive idea that “bigger r.v.s have bigger expectations”.
Proposition 4.2.4 (Monotonicity of expectation). Let X and Y be r.v.s such that
X ≥ Y with probability 1. Then E(X) ≥ E(Y ), with equality holding if and only
if X = Y with probability 1.

Proof. This result holds for all r.v.s, but we will prove it only for discrete r.v.s since
this chapter focuses on discrete r.v.s. The r.v. Z = X − Y is nonnegative (with
probability 1), so E(Z) ≥ 0 since E(Z) is defined as a sum of nonnegative terms.
By linearity,
                          E(X) − E(Y ) = E(X − Y ) ≥ 0,
as desired. If E(X) = E(Y ), then by linearity we also have E(Z) = 0, which implies
that P (X = Y ) = P (Z = 0) = 1 since if even one term in the sum defining E(Z) is
positive, then the whole sum is positive.                                        




4.3    Geometric and Negative Binomial

We now introduce two more famous discrete distributions, the Geometric and Neg-
ative Binomial, and calculate their expected values.
Story 4.3.1 (Geometric distribution). Consider a sequence of independent
Bernoulli trials, each with the same success probability p ∈ (0, 1), with trials per-
formed until a success occurs. Let X be the number of failures before the first
successful trial. Then X has the Geometric distribution with parameter p; we de-
note this by X ∼ Geom(p).                                                          
For example, if we flip a fair coin until it lands Heads for the first time, then the num-
ber of Tails before the first occurrence of Heads is distributed as Geom(1/2).
To get the Geometric PMF from the story, imagine the Bernoulli trials as a string
of 0’s (failures) ending in a single 1 (success). Each 0 has probability q = 1 − p and
the final 1 has probability p, so a string of k failures followed by one success has
probability q k p.
Theorem 4.3.2 (Geometric PMF). If X ∼ Geom(p), then the PMF of X is

                                      P (X = k) = q k p

for k = 0, 1, 2, . . . , where q = 1 − p.


158                                                                      Introduction to Probability

This is a valid PMF because, summing a geometric series (see the math appendix
for a review of geometric series), we have
                            ∞
                            X                ∞
                                             X                 1
                                  qk p = p         qk = p ·       = 1.
                                                              1−q
                            k=0              k=0

Just as the binomial theorem shows that the Binomial PMF is valid, a geometric
series shows that the Geometric PMF is valid! A geometric series can also be used
to obtain the Geometric CDF.
Theorem 4.3.3 (Geometric CDF). If X ∼ Geom(p), then the CDF of X is
                            (
                             1 − q bxc+1 , if x ≥ 0;
                    F (x) =
                             0, if x < 0,

where q = 1 − p and bxc is the greatest integer less than or equal to x.

Proof. Let F be the CDF of X. We will find F (x) first for the case x < 0, then
for the case that x is a nonnegative integer, and lastly for the case that x is a
nonnegative real number. For x < 0, F (x) = 0 since X can’t be negative. For n a
nonnegative integer,
                      n
                      X                       n
                                              X                 1 − q n+1
            F (n) =         P (X = k) = p            qk = p ·             = 1 − q n+1 .
                                                                  1−q
                      k=0                     k=0

We can also get the same result from the fact that the event X ≥ n + 1 means that
the first n + 1 trials were failures:

              F (n) = 1 − P (X > n) = 1 − P (X ≥ n + 1) = 1 − q n+1 .

For real x ≥ 0,
                            F (x) = P (X ≤ x) = P (X ≤ bxc),
since X always takes on integer values. For example,

             P (X ≤ 3.7) = P (X ≤ 3) + P (3 < X ≤ 3.7) = P (X ≤ 3).

Therefore, F is as claimed.                                                                      

Figure 4.3 displays the Geom(0.5) PMF and CDF from 0 to 6. All Geometric PMFs
have a similar shape; the greater the success probability p, the more quickly the
PMF decays to 0.
h 4.3.4 (Conventions for the Geometric). There are differing conventions for the
definition of the Geometric distribution; some sources define the Geometric as the
total number of trials, including the success. In this book, the Geometric distribution
excludes the success, and the First Success distribution includes the success.


Expectation                                                                            159




      1.0




                                                  1.0
                                                                               ●   ●
                                                                           ●   ●
                                                                       ●   ●
                                                                   ●   ●

      0.8




                                                  0.8
                                                               ●   ●
      0.6




                                                  0.6
   PMF




                                               CDF
            ●                                            ●     ●




                                                  0.4
      0.4




                ●




                                                  0.2
      0.2




                    ●
                         ●




                                                  0.0
                               ●                         ●
      0.0




                                     ●     ●

            0   1   2    3     4     5     6             0     1   2   3   4   5   6
                         x                                             x


FIGURE 4.5
Geom(0.5) PMF and CDF.


Definition 4.3.5 (First Success distribution). In a sequence of independent
Bernoulli trials with success probability p, let Y be the number of trials until the
first successful trial, including the success. Then Y has the First Success distribution
with parameter p; we denote this by Y ∼ FS(p).
It is easy to convert back and forth between the two but important to be careful
about which convention is being used. If Y ∼ FS(p) then Y − 1 ∼ Geom(p), and we
can convert between the PMFs of Y and Y − 1 by writing

                             P (Y = k) = P (Y − 1 = k − 1).

Conversely, if X ∼ Geom(p), then X + 1 ∼ FS(p).
Example 4.3.6 (Geometric expectation). Let X ∼ Geom(p). By definition,
                                               ∞
                                               X
                                    E(X) =           kq k p,
                                               k=0

where q = 1 − p. This sum looks unpleasant; it’s not a geometric series because of
the extra k multiplying each term. But we notice that each term looks similar to
kq k−1 , the derivative of q k (with respect to q), so let’s start there:
                                     ∞
                                     X             1
                                           qk =       .
                                                  1−q
                                     k=0

This geometric series converges since 0 < q < 1. Differentiating both sides with
respect to q, we get
                              ∞
                              X               1
                                  kq k−1 =          .
                                           (1 − q)2
                                   k=0


160                                                            Introduction to Probability

Finally, if we multiply both sides by pq, we recover the original sum we wanted to
find:
                         X∞            X∞
                               k                          1       q
                E(X) =       kq p = pq     kq k−1 = pq         2
                                                                 = .
                                                       (1 − q)    p
                            k=0            k=0

In Example 9.1.8, we will give a story proof of the same result, based on first-step
analysis: condition on the result of the first trial in the story interpretation of X. If
the first trial is a success, we know X = 0 and if it’s a failure, we have one wasted
trial and then are back where we started.                                              
Example 4.3.7 (First Success expectation). Since we can write Y ∼ FS(p) as
Y = X + 1 where X ∼ Geom(p), we have

                                                  q    1
                             E(Y ) = E(X + 1) =     +1= .                              
                                                  p    p

The Negative Binomial distribution generalizes the Geometric distribution: instead
of waiting for just one success, we can wait for any predetermined number r of
successes.
Story 4.3.8 (Negative Binomial distribution). In a sequence of independent
Bernoulli trials with success probability p, if X is the number of failures before
the rth success, then X is said to have the Negative Binomial distribution with
parameters r and p, denoted X ∼ NBin(r, p).                                     
Both the Binomial and the Negative Binomial distributions are based on indepen-
dent Bernoulli trials; they differ in the stopping rule and in what they are counting.
The Binomial counts the number of successes in a fixed number of trials; the Nega-
tive Binomial counts the number of failures until a fixed number of successes.
In light of these similarities, it comes as no surprise that the derivation of the
Negative Binomial PMF bears a resemblance to the corresponding derivation for
the Binomial.
Theorem 4.3.9 (Negative Binomial PMF). If X ∼ NBin(r, p), then the PMF of
X is                                      
                                    n+r−1 r n
                      P (X = n) =            p q
                                     r−1
for n = 0, 1, 2 . . . , where q = 1 − p.

Proof. Imagine a string of 0’s and 1’s, with 1’s representing successes. The proba-
bility of any specific string of n 0’s and r 1’s is pr q n . How many such strings are
there? Because we stop as soon as we hit the rth success, the string must terminate
in a 1. Among the other n + r − 1 positions, we choose r − 1 places for the remaining
1’s to go. So the overall probability of exactly n failures before the rth success is
                                          
                                   n+r−1 r n
                  P (X = n) =                p q , n = 0, 1, 2, . . . .               
                                    r−1


Expectation                                                                        161

Just as a Binomial r.v. can be represented as a sum of i.i.d. Bernoullis, a Negative
Binomial r.v. can be represented as a sum of i.i.d. Geometrics.
Theorem 4.3.10. Let X ∼ NBin(r, p), viewed as the number of failures before the
rth success in a sequence of independent Bernoulli trials with success probability p.
Then we can write X = X1 + · · · + Xr where the Xi are i.i.d. Geom(p).

Proof. Let X1 be the number of failures until the first success, X2 be the number
of failures between the first success and the second success, and in general, Xi be
the number of failures between the (i − 1)st success and the ith success.
Then X1 ∼ Geom(p) by the story of the Geometric distribution. After the first
success, the number of additional failures until the next success is still Geometric!
So X2 ∼ Geom(p), and similarly for all the Xi . Furthermore, the Xi are independent
because the trials are all independent of each other. Adding the Xi , we get the total
number of failures before the rth success, which is X.                              

Using linearity, the expectation of the Negative Binomial now follows without any
additional calculations.
Example 4.3.11 (Negative Binomial expectation). Let X ∼ NBin(r, p). By the
previous theorem, we can write X = X1 + · · · + Xr , where the Xi are i.i.d. Geom(p).
By linearity,
                                                            q
                      E(X) = E(X1 ) + · · · + E(Xr ) = r · .                       
                                                            p

The next example is a famous problem in probability and an instructive appli-
cation of the Geometric and First Success distributions. It is usually stated as a
problem about collecting coupons, hence its name, but we’ll use toys instead of
coupons.
Example 4.3.12 (Coupon collector). Suppose there are n types of toys, which you
are collecting one by one, with the goal of getting a complete set. When collecting
toys, the toy types are random (as is sometimes the case, for example, with toys
included in cereal boxes or included with kids’ meals from a fast food restaurant).
Assume that each time you collect a toy, it is equally likely to be any of the n types.
What is the expected number of toys needed until you have a complete set?
Solution:
Let N be the number of toys needed; we want to find E(N ). Our strategy will be
to break up N into a sum of simpler r.v.s so that we can apply linearity. So write

                              N = N1 + N2 + · · · + Nn ,

where N1 is the number of toys until the first toy type you haven’t seen before
(which is always 1, as the first toy is always a new type), N2 is the additional
number of toys until the second toy type you haven’t seen before, and so forth.
Figure 4.6 illustrates these definitions with n = 3 toy types.


162                                                         Introduction to Probability




                     N1        N2                      N3

FIGURE 4.6
Coupon collector, n = 3. Here N1 is the time (number of toys collected) until the
first new toy type, N2 is the additional time until the second new type, and N3 is the
additional time until the third new type. The total number of toys for a complete
set is N1 + N2 + N3 .


By the story of the FS distribution, N2 ∼ FS((n−1)/n): after collecting the first toy
type, there’s a 1/n chance of getting the same toy you already had (failure) and an
(n − 1)/n chance you’ll get something new (success). Similarly, N3 , the additional
number of toys until the third new toy type, is distributed FS((n−2)/n). In general,

                              Nj ∼ FS((n − j + 1)/n).

By linearity,

                  E(N ) = E(N1 ) + E(N2 ) + E(N3 ) + · · · + E(Nn )
                                n       n
                        =1+         +       + ··· + n
                              n−1 n−2
                           Xn
                               1
                        =n       .
                               j
                             j=1

For large n, this is very close to n(log n + 0.577).
Before we leave this example, let’s take a moment to connect it to our proof of
Theorem 4.3.10, the representation of the Negative Binomial as a sum of i.i.d. Ge-
ometrics. In both problems, we are waiting for a specified number of successes, and
we approach the problem by considering the intervals between successes. There are
two major differences:
• In Theorem 4.3.10, we exclude the successes themselves, so the number of failures
  between two successes is Geometric. In the coupon collector problem, we include
  the successes because we want to count the total number of toys, so we have First
  Success r.v.s instead.
• In Theorem 4.3.10, the probability of success in each trial never changes, so the
  total number of failures is a sum of i.i.d. Geometrics. In the coupon collector
  problem, the probability of success decreases after each success, since it becomes
  harder and harder to find a new toy type you haven’t seen before; so the Nj are
  not identically distributed, though they are independent.                       
h 4.3.13 (Expectation of a nonlinear function of an r.v.). Expectation is linear,
```
