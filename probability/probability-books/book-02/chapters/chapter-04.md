# Chapter 4: Expectation

**Book:** Introduction to Probability, Second Edition  
**Authors:** Joseph K. Blitzstein and Jessica Hwang  
**Printed pages:** 149–212

> Source transcription from the supplied textbook PDF. Text extraction preserves the original order and page content as far as the PDF text layer allows. Check mathematical notation and figure references against the source where extraction is ambiguous.

```text
Expectation                                                                           163

but in general we do not have E(g(X)) = g(E(X)) for arbitrary functions g. We
must be careful not to move the E around when g is not linear. The next example
shows a situation in which E(g(X)) is very different from g(E(X)).
Example 4.3.14 (St. Petersburg paradox). Suppose a wealthy stranger offers to
play the following game with you. You will flip a fair coin until it lands Heads for
the first time, and you will receive $2 if the game lasts for 1 round, $4 if the game
lasts for 2 rounds, $8 if the game lasts for 3 rounds, and in general, $2n if the game
lasts for n rounds. What is the fair value of this game (the expected payoff)? How
much would you be willing to pay to play this game once?
Solution:
Let X be your winnings from playing the game. By definition, X = 2N where N
is the number of rounds that the game lasts. Then X is 2 with probability 1/2, 4
with probability 1/4, 8 with probability 1/8, and so on, so
                                1       1    1
                       E(X) =     · 2 + · 4 + · 8 + · · · = ∞.
                                2       4    8
The expected winnings are infinite! On the other hand, the number of rounds N
that the game lasts is the number of tosses until the first Heads, so N ∼ FS(1/2)
and E(N ) = 2. Thus E(2N ) = ∞ while 2E(N ) = 4. Infinity certainly does not equal
4, illustrating the danger of confusing E(g(X)) with g(E(X)) when g is not linear.
This problem is often considered a paradox because although the game’s expected
payoff is infinite, most people would not be willing to pay very much to play the
game (even if they could afford to lose the money). One explanation is to note that
the amount of money in the real world is finite. Suppose that if the game lasts longer
than 40 rounds, the wealthy stranger flees the country and you get nothing. Since
240 ≈ 1.1 × 1012 , this still gives you the potential to earn over a trillion dollars, and
anyway it’s incredibly unlikely that the game will last longer than 40 rounds. But
in this setting, your expected value is
                                  40
                                  X                 ∞
                                                    X
                                     1                 1
                        E(X) =             · 2n +        · 0 = 40.
                                        2n            2n
                                  n=1               n=41

Is this drastic reduction because the wealthy stranger may flee the country? Let’s
suppose instead that the wealthy stranger caps your winnings at 240 , so if the
game lasts more than 40 rounds you will get this amount rather than walking away
empty-handed. Now your expected value is
                           40
                           X              ∞
                                          X
                              1         n    1
                  E(X) =           n
                                     ·2 +      · 240 = 40 + 1 = 41,
                                 2          2n
                           n=1              n=41

an increase of only $1 from the previous scenario. The ∞ in the St. Petersburg
paradox is driven by an infinite “tail” of extremely rare events where you get ex-
tremely large payoffs. Cutting off this tail at some point, which makes sense in the
real world, dramatically reduces the expected value of the game.                  


164                                                           Introduction to Probability




4.4     Indicator r.v.s and the fundamental bridge

This section is devoted to indicator random variables, which we already encountered
in the previous chapter but will treat in much greater detail here. In particular, we
will show that indicator r.v.s are an extremely useful tool for calculating expected
values.
Recall from the previous chapter that the indicator r.v. IA (or I(A)) for an event A
is defined to be 1 if A occurs and 0 otherwise. So IA is a Bernoulli random variable,
where success is defined as “A occurs” and failure is defined as “A does not occur”.
Some useful properties of indicator r.v.s are summarized below.
Theorem 4.4.1 (Indicator r.v. properties). Let A and B be events. Then the
following properties hold.

         1. (IA )k = IA for any positive integer k.
         2. IAc = 1 − IA .
         3. IA∩B = IA IB .
         4. IA∪B = IA + IB − IA IB .

Proof. Property 1 holds since 0k = 0 and 1k = 1 for any positive integer k. Property
2 holds since 1 − IA is 1 if A does not occur and 0 if A occurs. Property 3 holds
since IA IB is 1 if both IA and IB are 1, and 0 otherwise. Property 4 holds since
      IA∪B = 1 − IAc ∩B c = 1 − IAc IB c = 1 − (1 − IA )(1 − IB ) = IA + IB − IA IB . 

Indicator r.v.s provide a link between probability and expectation; we call this fact
the fundamental bridge.
Theorem 4.4.2 (Fundamental bridge between probability and expectation). There
is a one-to-one correspondence between events and indicator r.v.s, and the proba-
bility of an event A is the expected value of its indicator r.v. IA :
                                    P (A) = E(IA ).

Proof. For any event A, we have an indicator r.v. IA . This is a one-to-one corre-
spondence since A uniquely determines IA and vice versa (to get from IA back to
A, we can use the fact that A = {s ∈ S : IA (s) = 1}). Since IA ∼ Bern(p) with
p = P (A), we have E(IA ) = P (A).                                              

The fundamental bridge connects events to their indicator r.v.s, and allows us to
express any probability as an expectation. As an example, we give a short proof of
inclusion-exclusion and a related inequality known as Boole’s inequality or Bonfer-
roni’s inequality using indicator r.v.s.


Expectation                                                                                   165

Example 4.4.3 (Boole, Bonferroni, and inclusion-exclusion). Let A1 , A2 , . . . , An
be events. Note that

                         I(A1 ∪ · · · ∪ An ) ≤ I(A1 ) + · · · + I(An ),

since if the left-hand side is 0 this is immediate, and if the left-hand side is 1 then
at least one term on the right-hand side must be 1. Taking the expectation of both
sides and using linearity and the fundamental bridge, we have

                        P (A1 ∪ · · · ∪ An ) ≤ P (A1 ) + · · · + P (An ),

which is called Boole’s inequality or Bonferroni’s inequality. To prove inclusion-
exclusion for n = 2, we can take the expectation of both sides in Property 4 of
Theorem 4.4.1. For general n, we can use properties of indicator r.v.s as follows:

1 − I(A1 ∪ · · · ∪ An ) = I(Ac1 ∩ · · · ∩ Acn )
                        = (1 − I(A1 )) · · · (1 − I(An ))
                              X               X
                        =1−      I(Ai ) +         I(Ai )I(Aj ) − · · · + (−1)n I(A1 ) · · · I(An ).
                                 i            i<j

Taking the expectation of both sides, by the fundamental bridge we have proven
the inclusion-exclusion theorem.                                            
Conversely, the fundamental bridge is also extremely useful in many expected value
problems. We can often express a complicated discrete r.v. whose distribution we
don’t know as a sum of indicator r.v.s, which are extremely simple. The fundamental
bridge lets us find the expectation of the indicators; then, using linearity, we obtain
the expectation of our original r.v. This strategy is extremely useful and versatile—
in fact, we already used it when deriving the expectations of the Binomial and
Hypergeometric distributions earlier in this chapter!
Recognizing problems that are amenable to this strategy and then defining the
indicator r.v.s takes practice, so it is important to study a lot of examples and solve
a lot of problems. In applying the strategy to a random variable that counts the
number of [noun]s, we should have an indicator for each potential [noun]. This [noun]
could be a person, place, or thing; we will see examples of all three types.
We’ll start by revisiting two problems from Chapter 1, de Montmort’s matching
problem and the birthday problem.
Example 4.4.4 (Matching continued). We have a well-shuffled deck of n cards,
labeled 1 through n. A card is a match if the card’s position in the deck matches
the card’s label. Let X be the number of matches; find E(X).
Solution:
First let’s check whether X could have any of the named distributions we have
studied. The Binomial and Hypergeometric are the only two candidates since the
value of X must be an integer between 0 and n. But neither of these distributions


166                                                                   Introduction to Probability

has the right support because X can’t take on the value n − 1: if n − 1 cards are
matches, then the nth card must be a match as well. So X does not follow a named
distribution we have studied, but we can readily find its mean using indicator r.v.s:
let’s write X = I1 + I2 + · · · + In , where
                      
                        1 if the jth card in the deck is a match,
                Ij =
                        0 otherwise.
In other words, Ij is the indicator for Aj , the event that the jth card in the deck is
a match. We can imagine that each Ij “raises its hand” to be counted if its card is
a match; adding up the raised hands, we get the total number of matches, X.
By the fundamental bridge,
                                                       1
                                  E(Ij ) = P (Aj ) =
                                                       n
for all j. So by linearity,
                                                                  1
                       E(X) = E(I1 ) + · · · + E(In ) = n ·         = 1.
                                                                  n
The expected number of matched cards is 1, regardless of n. Even though the Ij are
dependent in a complicated way that makes the distribution of X neither Binomial
nor Hypergeometric, linearity still holds.                                      
Example 4.4.5 (Distinct birthdays, birthday matches). In a group of n people, un-
der the usual assumptions about birthdays, what is the expected number of distinct
birthdays among the n people, i.e., the expected number of days on which at least
one of the people was born? What is the expected number of birthday matches, i.e.,
pairs of people with the same birthday?
Solution:
Let X be the number of distinct birthdays, and write X = I1 + · · · + I365 , where
                        
                           1 if the jth day is represented,
                  Ij =
                           0 otherwise.
We create an indicator for each day of the year because X counts the number of
days of the year that are represented. By the fundamental bridge,
                                                                               
                                                                            364 n
 E(Ij ) = P (jth day is represented) = 1 − P (no one born on day j) = 1 −
                                                                            365
for all j. Then by linearity,
                                                         n 
                                                     364
                              E(X) = 365 1 −                      .
                                                     365
Now let Y be the number of birthday matches. Label the people as 1, 2, . . . , n, and
order the n2 pairs of people in some definite way. Then we can write
                                  Y = J1 + · · · + J(n) ,
                                                       2


Expectation                                                                           167

where Ji is the indicator of the ith pair of people having the same birthday. We
create an indicator for each pair of people since Y counts the number of pairs of
people with the same birthday. The probability of any two people having the same
birthday is 1/365, so again by the fundamental bridge and linearity,
                                                n
                                                    
                                                2
                                     E(Y ) =            .                               
                                               365

In addition to the fundamental bridge and linearity, the last two examples used
a basic form of symmetry to simplify the calculations greatly: within each sum of
indicator r.v.s, each indicator had the same expected value. For example, in the
matching problem the probability of the jth card being a match does not depend
on j, so we can just take n times the expected value of the first indicator r.v.
Other forms of symmetry can also be extremely helpful when available. The next
two examples showcase a form of symmetry that stems from having equally likely
permutations. Note how symmetry, linearity, and the fundamental bridge are used
in tandem to make seemingly very hard problems manageable.
Example 4.4.6 (Putnam problem). A permutation a1 , a2 , . . . , an of 1, 2, . . . , n has
a local maximum at j if aj > aj−1 and aj > aj+1 (for 2 ≤ j ≤ n − 1; for j = 1,
a local maximum at j means a1 > a2 while for j = n, it means an > an−1 ). For
example, 4, 2, 5, 3, 6, 1 has 3 local maxima, at positions 1, 3, and 5. The Putnam
exam (a famous, hard math competition, on which the median score is often a 0)
from 2006 posed the following question: for n ≥ 2, what is the average number
of local maxima of a random permutation of 1, 2, . . . , n, with all n! permutations
equally likely?
Solution:
This problem can be solved quickly using indicator r.v.s, symmetry, and the fun-
damental bridge. Let I1 , . . . , In be indicator r.v.s, where Ij is 1 if there is a local
maximum
Pn          at position j, and 0 otherwise. We are interested in the expected value of
  j=1 Ij . For 1 < j < n, EIj = 1/3 since having a local maximum at j is equivalent
to aj being the largest of aj−1 , aj , aj+1 , which has probability 1/3 since all orders
are equally likely. For j = 1 or j = n, we have EIj = 1/2 since then there is only
one neighbor. Thus, by linearity,
                                  
                           Xn
                                           1             1   n+1
                      E        Ij  = 2 · + (n − 2) · =           .                    
                                           2             3     3
                          j=1



The next example introduces the Negative Hypergeometric distribution, which com-
pletes the following table. The table shows the distributions for four sampling
schemes: the sampling can be done with or without replacement, and the stopping
rule can require a fixed number of draws or a fixed number of successes.


168                                                                 Introduction to Probability

                                      With replacement          Without replacement
 Fixed number of trials                     Binomial                Hypergeometric
 Fixed number of successes              Negative Binomial       Negative Hypergeometric

Example 4.4.7 (Negative Hypergeometric). An urn contains w white balls and b
black balls, which are randomly drawn one by one without replacement, until r white
balls have been obtained. The number of black balls drawn before drawing the rth
white ball has a Negative Hypergeometric distribution with parameters w, b, r. We
denote this distribution by NHGeom(w, b, r). Of course, we assume that r ≤ w. For
example, if we shuffle a deck of cards and deal them one at a time, the number of
cards dealt before uncovering the first ace is NHGeom(4, 48, 1).
As another example, suppose a college offers g good courses and b bad courses (for
some definition of “good” and “bad”), and a student wants to find 4 good courses
to take. Not having any idea which of the courses are good, the student randomly
tries out courses one at a time, stopping when they have obtained 4 good courses.
Then the number of bad courses the student tries out is NHGeom(g, b, 4).
We can obtain the PMF of X ∼ NHGeom(w, b, r) by noting that, in the urn context,
X = k means that the (r + k)th ball chosen is white and exactly r − 1 of the first
r + k − 1 balls chosen are white. This gives
                                    w
                                        b
                                   r−1 k       w−r+1
                     P (X = k) = w+b  ·
                                             w+b−r−k+1
                                         r+k−1

for k = 0, 1, . . . , b (and 0 otherwise).
Alternatively, we can imagine that we continue drawing balls until the urn has
been emptied out; this is valid since whether or not we continue to draw balls after
obtaining the rth white ball has no effect on X. Think of the w + b balls as lined
up in a random order, the order in which they will be drawn.
Then X = k means that among the first r + k − 1 balls there are exactly r − 1 white
balls, then there is a white ball, and then among the last w + b − r − k balls there
are exactly w − r white balls. All w+b  w    possibilities for the locations of the white
balls in the line are equally likely. So by the naive definition of probability, we have
the following slightly simpler expression for the PMF:
                                                 
                                            r+k−1 w+b−r−k
                                                             
                                                 r−1
                             P (X = k) =                 w−r
                                                       w+b
                                                                ,
                                                        w

for k = 0, 1, . . . , b (and 0 otherwise).
Finding the expected value of a Negative Hypergeometric r.v. directly from the
definition of expectation results in complicated sums. But the answer is very simple:
for X ∼ NHGeom(w, b, r), we have E(X) = rb/(w + 1).
Let’s prove this using indicator r.v.s. As explained above, we can assume that we


Expectation                                                                            169

continue drawing balls until the urn is empty. First consider the case r = 1. Label
the black balls as 1, 2, . . . , b, and let Ij be the indicator of black ball j being drawn
before any white balls have been drawn. Then P (Ij = 1) = 1/(w + 1) since, listing
out the order in which black ball j and the white balls are drawn (ignoring the other
balls), all orders are equally likely by symmetry, and Ij = 1 is equivalent to black
ball j being first in this list. So by linearity,
                                       
                                  Xb         X b
                          E            
                                      Ij =       E(Ij ) = b/(w + 1).
                             j=1         j=1


Sanity check : This answer makes sense since it is increasing in b, decreasing in w,
and correct in the extreme cases b = 0 (when no black balls will be drawn) and
w = 0 (when all the black balls will be exhausted before drawing a nonexistent
white ball). Moreover, note that b/(w + 1) looks similar to, but is strictly smaller
than, b/w, which is the expected value of a Geom(w/(w + b)) r.v. It makes sense
that sampling without replacement should give a smaller expected waiting time
than sampling with replacement. Similarly, if you are searching for something you
lost, it makes more sense to choose locations to check without replacement, rather
than wasting time looking over and over again in locations you already ruled out.
For general r, write X = X1 + X2 + · · · + Xr , where X1 is the number of black balls
before the first white ball, X2 is the number of black balls after the first white ball
but before the second white ball, etc. By essentially the same argument we used to
handle the r = 1 case, we have E(Xj ) = b/(w + 1) for each j. So by linearity,

                                   E(X) = rb/(w + 1).                                    

Closely related to indicator r.v.s is an alternative expression for the expectation of
a nonnegative integer-valued r.v. X. Rather than summing up values of X times
values of the PMF of X, we can sum up probabilities of the form P (X > n) (known
as tail probabilities), over nonnegative integers n.
Theorem 4.4.8 (Expectation via survival function). Let X be a nonnegative
integer-valued r.v. Let F be the CDF of X, and G(x) = 1 − F (x) = P (X > x). The
function G is called the survival function of X. Then
                                               ∞
                                               X
                                   E(X) =            G(n).
                                               n=0

That is, we can obtain the expectation of X by summing up the survival function
(or, stated otherwise, summing up tail probabilities of the distribution).

Proof. For simplicity, we will prove the result only for the case that X is bounded,
i.e., there is a nonnegative integer b such that X is always at most b. We can represent
X as a sum of indicator r.v.s: X = I1 + I2 + · · · + Ib , where In = I(X ≥ n). For


170                                                                Introduction to Probability

example, if X = 7 occurs, then I1 through I7 equal 1 while the other indicators
equal 0.
By linearity and the fundamental bridge, and the fact that {X ≥ k} is the same
event as {X > k − 1},
                  b
                  X                b
                                   X                   b−1
                                                       X                   ∞
                                                                           X
         E(X) =         E(Ik ) =         P (X ≥ k) =         P (X > n) =         G(n).     
                  k=1              k=1                 n=0                 n=0


As a quick example, we use the above result to give another derivation of the mean
of a Geometric r.v.
Example 4.4.9 (Geometric expectation redux). Let X ∼ Geom(p), and q = 1 − p.
Using the Geometric story, {X > n} is the event that the first n + 1 trials are all
failures. So by Theorem 4.4.8,
                            ∞
                            X                    ∞
                                                 X                q   q
                  E(X) =           P (X > n) =         q n+1 =       = ,
                                                                 1−q  p
                            n=0                  n=0

confirming what we already knew about the mean of a Geometric.                             




4.5   Law of the unconscious statistician (LOTUS)

As we saw in the St. Petersburg paradox, E(g(X)) does not equal g(E(X)) in
general if g is not linear. So how do we correctly calculate E(g(X))? Since g(X) is
an r.v., one way is to first find the distribution of g(X) and then use the definition
of expectation. Perhaps surprisingly, it turns out that it is possible to find E(g(X))
directly using the distribution of X, without first having to find the distribution of
g(X). This is done using the law of the unconscious statistician (LOTUS).
Theorem 4.5.1 (LOTUS). If X is a discrete r.v. and g is a function from R to R,
then                             X
                    E(g(X)) =        g(x)P (X = x),
                                             x

where the sum is taken over all possible values of X.
This means that we can get the expected value of g(X) knowing only P (X = x),
the PMF of X; we don’t need to know the PMF of g(X). The name comes from
the fact that in going from E(X) to E(g(X)) it is tempting just to change x to
g(x) in the definition, which can be done very easily and mechanically, perhaps in
a state of unconsciousness. On second thought, it may sound too good to be true
that finding the distribution of g(X) is not needed for this calculation, but LOTUS
says it is true.


Expectation                                                                                171

Before proving LOTUS in general, let’s see why it is true in some special cases. Let X
have support 0, 1, 2, . . . with probabilities p0 , p1 , p2 , . . . , so the PMF is P (X = n) =
pn . Then X 3 has support 03 , 13 , 23 , . . . with probabilities p0 , p1 , p2 , . . . , so
                                                 ∞
                                                 X
                                     E(X) =            npn ,
                                                 n=0
                                                 X∞
                                    E(X 3 ) =          n3 p n .
                                                 n=0

As claimed by LOTUS, to edit the expression for E(X) into an expression for E(X 3 ),
we can just change the n in front of the pn to an n3 . This was an easy example since
the function g(x) = x3 is one-to-one. But LOTUS holds much more generally. The
key insight needed for the proof of LOTUS for general g is the same as the one we
used for the proof of linearity: the expectation of g(X) can be written in ungrouped
form as                                 X
                            E(g(X)) =       g(X(s))P ({s}),
                                             s
where the sum is over all the pebbles in the sample space, but we can also group the
pebbles into super-pebbles according to the value that X assigns to them. Within
the super-pebble X = x, g(X) always takes on the value g(x). Therefore,
                                  X
                      E(g(X)) =        g(X(s))P ({s})
                                        s
                                        X        X
                                    =                  g(X(s))P ({s})
                                        x s:X(s)=x
                                        X            X
                                    =       g(x)               P ({s})
                                        x          s:X(s)=x
                                        X
                                    =       g(x)P (X = x).
                                        x
                                            P
In the last step, we used the fact that          s:X(s)=x P ({s}) is the weight of the super-
pebble X = x.




4.6    Variance

One important application of LOTUS is for finding the variance of a random vari-
able. Like expected value, variance is a single-number summary of the distribution
of a random variable. While the expected value tells us the center of mass of a
distribution, the variance tells us how spread out the distribution is.
Definition 4.6.1 (Variance and standard deviation). The variance of an r.v. X is
                                 Var(X) = E(X − EX)2 .


172                                                          Introduction to Probability

The square root of the variance is called the standard deviation (SD):
                                          p
                               SD(X) = Var(X).
Recall that when we write E(X − EX)2 , we mean the expectation of the random
variable (X − EX)2 , not (E(X − EX))2 (which is 0 by linearity).
The variance of X measures how far X is from its mean on average, but instead
of simply taking the average difference between X and its mean EX, we take the
average squared difference. To see why, note that the average deviation from the
mean, E(X − EX), always equals 0 by linearity; positive and negative deviations
cancel each other out. By squaring the deviations, we ensure that both positive and
negative deviations contribute to the overall variability. However, because variance
is an average squared distance, it has the wrong units: if X is in dollars, Var(X) is
in squared dollars. To get back to our original units, we take the square root; this
gives us the standard deviation.
One might wonder why variance isn’t defined as E|X−EX|, which would achieve the
goal of counting both positive and negative deviations while maintaining the same
units as X. This measure of variability isn’t nearly as popular as E(X − EX)2 , for
a variety of reasons. Most notably, the absolute value function isn’t differentiable
at 0, whereas the squaring function is differentiable everywhere and is central in
various fundamental mathematical results such as the Pythagorean theorem.
An equivalent expression for variance is Var(X) = E(X 2 ) − (EX)2 . This formula is
often easier to work with when doing actual calculations. Since this is the variance
formula we will use over and over again, we state it as its own theorem.
Theorem 4.6.2. For any r.v. X,
                             Var(X) = E(X 2 ) − (EX)2 .

Proof. Let µ = EX. Expanding (X − µ)2 and using linearity, the variance of X is
      E(X − µ)2 = E(X 2 − 2µX + µ2 ) = E(X 2 ) − 2µEX + µ2 = E(X 2 ) − µ2 .          

Variance has the following properties. The first two are easily verified from the
definition, the third will be addressed in a later chapter, and the last one is proven
just after stating it.
• Var(X + c) = Var(X) for any constant c. Intuitively, if we shift a distribution to
  the left or right, that should affect the center of mass of the distribution but not
  its spread.
• Var(cX) = c2 Var(X) for any constant c.
• If X and Y are independent, then Var(X + Y ) = Var(X) + Var(Y ). We prove
  this and discuss it more in Chapter 7. This is not true in general if X and Y are
  dependent. For example, in the extreme case where X always equals Y , we have
         Var(X + Y ) = Var(2X) = 4Var(X) > 2Var(X) = Var(X) + Var(Y )


Expectation                                                                                   173

  if Var(X) > 0 (which will be true unless X is a constant, as the next property
  shows).
• Var(X) ≥ 0, with equality if and only if P (X = a) = 1 for some constant a.
  In other words, the only random variables that have zero variance are constants
  (which can be thought of as degenerate r.v.s); all other r.v.s have positive variance.
To prove the last property, note that Var(X) is the expectation of the nonnegative
r.v. (X − EX)2 , so Var(X) ≥ 0. If P (X = a) = 1 for some constant a, then
E(X) = a and E(X 2 ) = a2 , so Var(X) = 0. Conversely, suppose that Var(X) = 0.
Then E(X − EX)2 = 0, which shows that (X − EX)2 = 0 has probability 1, which
in turn shows that X equals its mean with probability 1.
h 4.6.3 (Variance is not linear). Unlike expectation, variance is not linear. The
constant comes out squared in Var(cX) = c2 Var(X), and the variance of the sum
of r.v.s may not be the sum of their variances if they are dependent.
Example 4.6.4 (Geometric and Negative Binomial variance). In this example we’ll
use LOTUS to compute the variance of the Geometric distribution.
Let X ∼ Geom(p). We already know E(X) = q/p. By LOTUS,
                             ∞
                             X                          ∞
                                                        X                  ∞
                                                                           X
                 E(X 2 ) =         k 2 P (X = k) =            k 2 pq k =         k 2 pq k .
                             k=0                        k=0                k=1

We’ll find this using a tactic similar to how we found the expectation, starting from
the geometric series
                                     X∞
                                               1
                                         qk =
                                              1−q
                                          k=0
and taking derivatives. After differentiating once with respect to q, we have
                                    ∞
                                    X                     1
                                          kq k−1 =              .
                                                       (1 − q)2
                                    k=1

We start the sum from k = 1 since the k = 0 term is 0 anyway. If we differentiate
again, we’ll get k(k − 1) instead of k 2 as we want, so let’s replenish our supply of
q’s by multiplying both sides by q. This gives
                                     ∞
                                     X                 q
                                           kq k =            .
                                                    (1 − q)2
                                     k=1

Now we are ready to take another derivative:
                                   ∞
                                   X                    1+q
                                         k 2 q k−1 =            ,
                                                       (1 − q)3
                                   k=1
so
                                ∞
                                X                       1+q        q(1 + q)
                    E(X 2 ) =         k 2 pq k = pq            3
                                                                 =          .
                                                       (1 − q)        p2
                                k=1


174                                                            Introduction to Probability

Finally,
                                                             2
                                 2          2   q(1 + q)       q       q
                Var(X) = E(X ) − (EX) =                   −         = 2.
                                                    p2         p       p
This is also the variance of the First Success distribution, since shifting by a constant
does not affect the variance.
Since an NBin(r, p) r.v. can be represented as a sum of r i.i.d. Geom(p) r.v.s by
Theorem 4.3.10, and since variance is additive for independent random variables, it
follows that the variance of the NBin(r, p) distribution is r · pq2 .            
LOTUS is an all-purpose tool for computing E(g(X)) for any g, but as it usually
leads to complicated sums, it should be used as a last resort. For variance calcu-
lations, our trusty indicator r.v.s can sometimes be used in place of LOTUS, as in
the next example.
Example 4.6.5 (Binomial variance). Let’s find the variance of X ∼ Bin(n, p) using
indicator r.v.s to avoid tedious sums. Represent X = I1 + I2 + · · · + In , where Ij is
the indicator of the jth trial being a success. Each Ij has variance
                   Var(Ij ) = E(Ij2 ) − (E(Ij ))2 = p − p2 = p(1 − p).
(Recall that Ij2 = Ij , so E(Ij2 ) = E(Ij ) = p.)
Since the Ij are independent, we can add their variances to get the variance of their
sum:
                   Var(X) = Var(I1 ) + · · · + Var(In ) = np(1 − p).
                                                            
Alternatively, we can find E(X 2 ) by first finding E X2 . The latter sounds more
                                                 
complicated, but actually it is simpler since X2 is the number of pairs of successful
trials. Creating an indicator r.v. for each pair of trials, we have
                                        
                                      X        n 2
                                  E        =       p .
                                       2       2
Thus,
            n(n − 1)p2 = E(X(X − 1)) = E(X 2 ) − E(X) = E(X 2 ) − np,
which again gives
        Var(X) = E(X 2 ) − (EX)2 = (n(n − 1)p2 + np) − (np)2 = np(1 − p).
Exercise 48 uses this strategy to find the variance of the Hypergeometric.             




4.7     Poisson

The last discrete distribution that we’ll introduce in this chapter is the Poisson,
which is an extremely popular distribution for modeling discrete data. We’ll intro-
duce its PMF, mean, and variance, and then discuss its story in more detail.


Expectation                                                                             175

Definition 4.7.1 (Poisson distribution). An r.v. X has the Poisson distribution
with parameter λ, where λ > 0, if the PMF of X is
                                             e−λ λk
                      P (X = k) =                   ,      k = 0, 1, 2, . . . .
                                               k!
We write this as X ∼ Pois(λ).
                                                                P∞     λk    λ
This is a valid PMF because of the Taylor series                   k=0 k! = e .

Example 4.7.2 (Poisson expectation and variance). Let X ∼ Pois(λ). We will
show that the mean and variance are both equal to λ. For the mean, we have
                                                    ∞
                                                    X
                                               −λ       λk
                              E(X) = e                k
                                                        k!
                                                     k=0
                                              ∞
                                              X
                                           −λ     λk
                                         =e     k
                                                  k!
                                                  k=1
                                                    ∞
                                                    X
                                                 −λ          λk−1
                                         = λe
                                                            (k − 1)!
                                                   k=1
                                                 −λ λ
                                         = λe        e = λ.
First we dropped the k = 0 term because it was 0. Then we took a λ out of the sum
so that what was left inside was just the Taylor series for eλ .
To get the variance, we first find E(X 2 ). By LOTUS,
                                  ∞
                                  X                                   ∞
                                                                      X
                         2               2                       −λ              λk
                    E(X ) =             k P (X = k) = e                     k2      .
                                                                                 k!
                                  k=0                                 k=0

From here, the derivation is very similar to that of the variance of the Geometric.
Differentiate the familiar series
                                    ∞
                                    X   λk
                                           = eλ
                                        k!
                                          k=0

with respect to λ and replenish:
                                       ∞
                                       X   λk−1
                                         k      = eλ ,
                                            k!
                                       k=1
                                         X∞
                                                    λk
                                                k      = λeλ .
                                                    k!
                                         k=1

Rinse and repeat:
                       ∞
                       X          λk−1
                             k2        = eλ + λeλ = eλ (1 + λ),
                                   k!
                       k=1
                         X∞
                                       λk
                                  k2      = eλ λ(1 + λ).
                                       k!
                         k=1


176                                                                                   Introduction to Probability

Finally,
                                           ∞
                                           X           λk
                      E(X 2 ) = e−λ              k2       = e−λ eλ λ(1 + λ) = λ(1 + λ),
                                                       k!
                                           k=0
so
                          Var(X) = E(X 2 ) − (EX)2 = λ(1 + λ) − λ2 = λ.
Thus, the mean and variance of a Pois(λ) r.v. are both equal to λ.                                                 
Figure 4.7 shows the PMF and CDF of the Pois(2) and Pois(5) distributions from
k = 0 to k = 10. It appears that the mean of the Pois(2) is around 2 and the
mean of the Pois(5) is around 5, consistent with our findings above. The PMF of
the Pois(2) is highly skewed, but as λ grows larger, the skewness is reduced and the
PMF becomes more bell-shaped.
        1.0




                                                                1.0
        0.8




                                                                0.8
        0.6




                                                                0.6
      PMF




                                                              CDF
                                                                0.4
        0.4




                                                                0.2
        0.2




                                                                0.0
        0.0




              0   1        2       3       4       5     6            0   1       2       3       4       5   6
                                   x                                                      x
        1.0




                                                                1.0
        0.8




                                                                0.8
        0.6




                                                                0.6
      PMF




                                                              CDF
                                                                0.4
        0.4




                                                                0.2
        0.2




                                                                0.0
        0.0




              0       2        4       6       8         10           0       2       4       6       8       10
                                   x                                                      x


FIGURE 4.7
Top: Pois(2) PMF and CDF. Bottom: Pois(5) PMF and CDF.

The Poisson distribution is often used in situations where we are counting the


Expectation                                                                       177

number of successes in a particular region or interval of time, and there are a large
number of trials, each with a small probability of success. For example, the following
random variables could follow a distribution that is approximately Poisson.
• The number of emails you receive in an hour. There are a lot of people who could
  potentially email you in that hour, but it is unlikely that any specific person will
  actually email you in that hour. Alternatively, imagine subdividing the hour into
  milliseconds. There are 3.6×106 seconds in an hour, but in any specific millisecond
  it is unlikely that you will get an email.
• The number of chips in a chocolate chip cookie. Imagine subdividing the cookie
  into small cubes; the probability of getting a chocolate chip in a single cube is
  small, but the number of cubes is large.
• The number of earthquakes in a year in some region of the world. At any given
  time and location, the probability of an earthquake is small, but there are a large
  number of possible times and locations for earthquakes to occur over the course
  of the year.
The parameter λ is interpreted as the rate of occurrence of these rare events; in
the examples above, λ could be 20 (emails per hour), 10 (chips per cookie), and 2
(earthquakes per year). The Poisson paradigm says that in applications similar to
the ones above, we can approximate the distribution of the number of events that
occur by a Poisson distribution.
Approximation 4.7.3 (Poisson paradigm). Let A1 , . . . , An be events with pj =
P (Aj ), where n is large, the pj are small, and the Aj are independent or weakly
dependent. Let
                                        Xn
                                   X=       I(Aj )
                                         j=1

count howPmany of the Aj occur. Then X is approximately distributed as Pois(λ),
with λ = nj=1 pj .
Proving that the above approximation is good is difficult, and would require first
giving precise definitions of weak dependence (there are various ways to measure
dependence of r.v.s) and of good approximations (there are various ways to mea-
sure how good an approximation is). A remarkable theorem is that if the Aj are
independent, N ∼ Pois(λ), and B is any set of nonnegative integers, then
                                                         X
                                                           n
                                                    1
                   |P (X ∈ B) − P (N ∈ B)| ≤ min 1,               p2j .
                                                    λ
                                                            j=1


This gives an upper bound on how much error is incurred from using a Poisson
approximation.
Pn              It also makes more precise how small the pj should be: we want
       2
  j=1 pj to be very small, or at least very small compared to λ. The result can be
shown using an advanced technique known as the Stein-Chen method.


178                                                           Introduction to Probability

The Poisson paradigm is also called the law of rare events. The interpretation of
“rare” is that the pj are small, not that λ is small. For example, in the email example,
the low probability of getting an email from a specific person in a particular hour is
offset by the large number of people who could send you an email in that hour.
In the examples we gave above, the number of events that occur isn’t exactly Pois-
son because a Poisson random variable has no upper bound, whereas how many of
A1 , . . . , An occur is at most n, and there is a limit to how many chocolate chips
can be crammed into a cookie. But the Poisson distribution often gives good ap-
proximations. Note that the conditions for the Poisson paradigm to hold are fairly
flexible: the n trials can have different success probabilities, and the trials don’t
have to be independent, though they should not be very dependent. So there are a
wide variety of situations that can be cast in terms of the Poisson paradigm. This
makes the Poisson a popular model, or at least a starting point, for data whose
values are nonnegative integers (called count data in statistics).
Example 4.7.4 (Balls in boxes). There are k distinguishable balls and n distin-
guishable boxes. The balls are randomly placed in the boxes, with all nk possibilities
equally likely. Problems in this setting are called occupancy problems, and are at
the core of many widely used algorithms in computer science.

(a) Find the expected number of empty boxes (fully simplified, not as a sum).
(b) Find the probability that at least one box is empty. Express your answer as a
sum of at most n terms.
(c) Now let n = 1000, k = 5806. The expected number of empty boxes is then
approximately 3. Find a good approximation as a decimal for the probability that
at least one box is empty. The handy fact e3 ≈ 20 may help.
Solution:
(a) Let Ij be the indicator r.v. for the jth box being empty. Then
                                                       
                                                      1 k
                          E(Ij ) = P (Ij = 1) = 1 −       .
                                                      n
By linearity,                
                        Xn        n
                                  X                 k
                                                   1
                      E   Ij  =   E(Ij ) = n 1 −      .
                                                   n
                           j=1         j=1

(b) The probability is 1 for k < n. In general, let Aj be the event that box j is
empty. By inclusion-exclusion,
                                     n
                                     X         
                                           j+1 n
         P (A1 ∪ A2 ∪ · · · ∪ An ) =   (−1)        P (A1 ∩ A2 ∩ · · · ∩ Aj )
                                               j
                                      j=1
                                      n−1
                                      X                    
                                               j+1    n     j k
                                  =         (−1)         1−     .
                                                      j     n
                                      j=1


Expectation                                                                       179

(c) The number X of empty boxes is approximately Pois(3), since there are a lot of
boxes but each is very unlikely to be empty; the probability that a specific box is
empty is (1 − n1 )k = n1 · E(X) ≈ 0.003. So
                                                            1
              P (X ≥ 1) = 1 − P (X = 0) ≈ 1 − e−3 ≈ 1 −        = 0.95.              
                                                            20

Poisson approximation greatly simplifies obtaining a good approximate solution to
the birthday problem discussed in Chapter 1, and makes it possible to obtain good
approximations to various variations which would be hard to solve exactly.
Example 4.7.5 (Birthday problem continued). If we have m people and make
the usual assumptions about birthdays, then each pair ofpeople has probability
p = 1/365 of having the same birthday, and there are m     2 pairs. By the Poisson
paradigm the distribution
                      1   of the number  X of  birthday  matches  is approximately
Pois(λ), where λ = m2 365 . Then  the probability of at least one match is
                       P (X ≥ 1) = 1 − P (X = 0) ≈ 1 − e−λ .
For m = 23, λ = 253/365 and 1−e−λ ≈ 0.500002, which agrees with our finding from
Chapter 1 that we need 23 people to have a 50-50 chance of a matching birthday.
Note that even
              though m = 23 is fairly small, the relevant quantity in this problem
            m
is actually 2 , which is the total number of “trials” for a successful birthday match,
so the Poisson approximation still performs well.                                   
Example 4.7.6 (Near-birthday problem). What if we want to find the number of
people required in order to have a 50-50 chance that two people would have birthdays
within one day of each other (i.e., on the same day or one day apart)? Unlike the
original birthday problem, this is difficult to obtain an exact answer for, but the
Poisson paradigm still applies. The probability that any two people have birthdays
within one day of each other is 3/365 (choose a birthday for the first person, and
then the second person needs
                               to be born on that day, the day before, or the day
after). Again there are m2   possible pairs,
                                           3so the number of within-one-day matches
is approximately Pois(λ) where λ = m    2 365 . Then a calculation similar to the one
above tells us that we need m = 14 or more. This was a quick approximation, but
it turns out that m = 14 is the exact answer!                                      
Example 4.7.7 (Birth-minute and birth-hour). There are 1600 sophomores at a
certain college. Throughout this example, make the usual assumptions as in the
birthday problem.
(a) Find a Poisson approximation for the probability that there are two sophomores
who were born not only on the same day of the year, but also at the same hour and
the same minute (e.g., both sophomores were born at 8:20 pm on March 31, not
necessarily in the same year).
(b) With assumptions as in (a), what is the probability that there are four sopho-
mores who were born not only on the same day, but also at the same hour (e.g., all
were born between 2 pm and 3 pm on March 31, not necessarily in the same year)?


180                                                                   Introduction to Probability

Give two different Poisson approximations for this value, one based on creating an
indicator r.v. for each quadruplet of sophomores, and the other based on creating
an indicator r.v. for each possible day-hour. Which do you think is more accurate?
Solution:
(a) This is the birthday problem, with c = 365 · 24 · 60 = 525600 categories rather
than 365 categories.1 Let n = 1600. Creating an indicator r.v. for each pair of
sophomores, by linearity the expected number of pairs born on the same day-hour-
minute is                                
                                          n 1
                                   λ1 =       .
                                          2 c
By Poisson approximation, the probability of at least one match is approximately

                                    1 − exp(−λ1 ) ≈ 0.9122.

This approximation is very accurate: typing pbirthday(1600, classes=365*24*60)
in R yields 0.9125.
(b) Now there are b = 365·24 = 8760 categories. Let’s explore two different methods
of Poisson approximation.
Method 1 : Create an indicator for each set of 4 sophomores. By linearity, the ex-
pected number of sets of 4 sophomores born on the same day-hour is
                                        
                                         n 1
                                  λ2 =         .
                                         4 b3
Poisson approximation gives that the desired probability is approximately

                                     1 − exp(−λ2 ) ≈ 0.333.

Method 2 : Create an indicator for each possible day-hour. Let Ij be the indicator
for at least 4 people having been born on the jth day-hour of the year (ordered
chronologically), for 1 ≤ j ≤ b. Let p = 1/b and q = 1 − p. Then

               E(Ij ) = P (Ij = 1)
                       = 1 − P (at most 3 people born on the jth day-hour)
                                                         
                              n      n−1     n 2 n−2       n 3 n−3
                       = 1 − q − npq      −     p q    −      p q    .
                                             2             3
The expected number of day-hours on which at least 4 sophomores were born is

                                          λ3 = b · E(I1 ),

with E(I1 ) as above. We then have the Poisson approximation

                                     1 − exp(−λ3 ) ≈ 0.295.
  1
      The song “Seasons of Love” from Rent gives a musical interpretation of this fact.


Expectation                                                                       181

The command pbirthday(1600, classes = 8760, coincident=4) in R gives
that the correct answer is 0.296. So Method 2 is more accurate than Method 1.
An intuitive explanation for why Method 1 is less accurate is that there is a more
substantial dependence in the indicators in that method. For example, being given
that sophomores 1, 2, 3, 4 share the same birth day-hour greatly increases the chance
that sophomores 1, 2, 3, 5 share the same birth day-hour. In contrast, knowing that at
least 4 sophomores were born on a specific day-hour provides very little information
about whether at least 4 were born on a different specific day-hour.                




4.8   Connections between Poisson and Binomial

The Poisson and Binomial distributions are closely connected, and their relationship
is exactly parallel to the relationship between the Binomial and Hypergeometric
distributions that we examined in the previous chapter: we can get from the Poisson
to the Binomial by conditioning, and we can get from the Binomial to the Poisson
by taking a limit.
Our results will rely on the fact that the sum of independent Poissons is Poisson,
just as the sum of independent Binomials is Binomial. We’ll prove this result using
the law of total probability for now; in Chapter 6 we’ll learn a faster method that
uses a tool called the moment generating function. Chapter 13 gives further insight
into these results.
Theorem 4.8.1 (Sum of independent Poissons). If X ∼ Pois(λ1 ), Y ∼ Pois(λ2 ),
and X is independent of Y , then X + Y ∼ Pois(λ1 + λ2 ).

Proof. To get the PMF of X +Y , condition on X and use the law of total probability:

                                   k
                                   X
               P (X + Y = k) =           P (X + Y = k|X = j)P (X = j)
                                   j=0
                                   k
                                   X
                               =         P (Y = k − j)P (X = j)
                                   j=0
                                   k
                                   X e−λ2 λk−j e−λ1 λj
                                              2           1
                               =
                                         (k − j)!    j!
                                   j=0
                                             k  
                                 e−(λ1 +λ2 ) X k j k−j
                               =                   λ λ
                                    k!          j 1 2
                                              j=0

                                   e−(λ1 +λ2 ) (λ1 + λ2 )k
                               =                             .
                                             k!


182                                                         Introduction to Probability

The last step used the binomial theorem. Since we’ve arrived at the Pois(λ1 + λ2 )
PMF, we have X + Y ∼ Pois(λ1 + λ2 ).
The story of the Poisson distribution provides intuition for this result. If there are
two different types of events occurring at rates λ1 and λ2 , independently, then the
overall event rate is λ1 + λ2 .                                                     
Theorem 4.8.2 (Poisson given a sum of Poissons). If X ∼ Pois(λ1 ), Y ∼ Pois(λ2 ),
and X is independent of Y , then the conditional distribution of X given X + Y = n
is Bin (n, λ1 /(λ1 + λ2 )).

Proof. Exactly as in the corresponding proof for the Binomial and Hypergeometric,
we use Bayes’ rule to compute the conditional PMF P (X = k|X + Y = n):

                                      P (X + Y = n|X = k)P (X = k)
             P (X = k|X + Y = n) =
                                              P (X + Y = n)
                                      P (Y = n − k)P (X = k)
                                    =                        .
                                          P (X + Y = n)

Now we plug in the PMFs of X, Y , and X + Y ; the last of these is distributed
Pois(λ1 + λ2 ) by the previous theorem. This gives
                                                   !           
                                       e−λ2 λn−k
                                             2         e−λ1 λk1
                                        (n − k)!         k!
            P (X = k|X + Y = n) =
                                       e−(λ1 +λ2 ) (λ1 + λ2 )n
                                                  n!
                                       k n−k
                                      n    λ1 λ2
                                   =
                                      k (λ1 + λ2 )n
                                                   k          n−k
                                      n        λ1              λ2
                                   =                                    ,
                                      k     λ1 + λ2        λ1 + λ2

which is the Bin(n, λ1 /(λ1 + λ2 )) PMF, as desired.                                

Conversely, if we take the limit of the Bin(n, p) distribution as n → ∞ and p → 0
with np fixed, we arrive at a Poisson distribution. This provides the basis for the
Poisson approximation to the Binomial distribution.
Theorem 4.8.3 (Poisson approximation to Binomial). If X ∼ Bin(n, p) and we let
n → ∞ and p → 0 such that λ = np remains fixed, then the PMF of X converges to
the Pois(λ) PMF. More generally, the same conclusion holds if n → ∞ and p → 0
in such a way that np converges to a constant λ.
This is a special case of the Poisson
                               P      paradigm, where the Aj are independent with the
same probabilities, so that nj=1 I(Aj ) has a Binomial distribution. In this special
case, we can prove that the Poisson approximation makes sense just by taking a
limit of the Binomial PMF.


Expectation                                                                          183

Proof. We will prove this for the case that λ = np is fixed while n → ∞ and p → 0,
by showing that the Bin(n, p) PMF converges to the Pois(λ) PMF. For 0 ≤ k ≤ n,
                      
                       n k
        P (X = k) =       p (1 − p)n−k
                       k
                                                                   
                     n(n − 1) . . . (n − k + 1) λ k         λ n       λ −k
                  =                                     1−        1−
                                 k!              n          n         n
                       k
                                                         n        −k
                     λ n(n − 1) . . . (n − k + 1)       λ          λ
                  =                    k
                                                    1−         1−        .
                      k!             n                  n          n
Letting n → ∞ with k fixed,
                           n(n − 1) . . . (n − k + 1)
                                                      → 1,
                                       nk
                                                  n
                                                 λ
                                             1−       → e−λ ,
                                                 n
                                                
                                               λ −k
                                           1−         → 1,
                                               n
where the e−λ comes from the compound interest formula from Section A.2.5 of the
math appendix. So
                                          e−λ λk
                              P (X = k) →        ,
                                            k!
which is the Pois(λ) PMF.                                                     

This theorem implies that if n is large, p is small, and np is moderate, we can
approximate the Bin(n, p) PMF by the Pois(np) PMF. The main thing that matters
here is that p should be small; in fact, the result mentioned after the statement of
the Poisson paradigm says in this case that the error in approximating P (X ∈ B) ≈
P (N ∈ B) for X ∼ Bin(n, p), N ∼ Pois(np) is at most min(p, np2 ).
Example 4.8.4 (Visitors to a website). The owner of a certain website is studying
the distribution of the number of visitors to the site. Every day, a million people
independently decide whether to visit the site, with probability p = 2 × 10−6 of
visiting. Give a good approximation for the probability of getting at least three
visitors on a particular day.
Solution:
Let X ∼ Bin(n, p) be the number of visitors, where n = 106 . It is easy to run
into computational difficulties or numerical errors in exact calculations with this
distribution since n is so large and p is so small. But since n is large, p is small, and
np = 2 is moderate, Pois(2) is a good approximation. This gives
                                                            22
  P (X ≥ 3) = 1 − P (X < 3) ≈ 1 − e−2 − e−2 · 2 − e−2 ·        = 1 − 5e−2 ≈ 0.3233,
                                                            2!
which turns out to be extremely accurate.                                              


184                                                            Introduction to Probability




4.9   *Using probability and expectation to prove existence

An amazing and beautiful fact is that we can use probability and expectation to
prove the existence of objects with properties we care about. This technique is called
the probabilistic method, and it is based on two simple but surprisingly powerful
ideas. Suppose I want to show that there exists an object in a collection with a
certain property. This desire seems at first to have nothing to do with probability;
I could simply examine each object in the collection one by one until finding an
object with the desired property.
The probabilistic method rejects such painstaking inspection in favor of random
selection: our strategy is to pick an object at random from the collection and show
that there is a positive probability of the random object having the desired property.
Note that we are not required to compute the exact probability, but merely to show
it is greater than 0. If we can show that the probability of the property holding is
positive, then we know that there must exist an object with the property—even if
we don’t know how to explicitly construct such an object.
Similarly, suppose each object has a score, and I want to show that there exists an
object with a “good” score—that is, a score exceeding a particular threshold. Again,
we proceed by choosing a random object and considering its score, X. We know there
is an object in the collection whose score is at least E(X)—it’s impossible for every
object to be below average! If E(X) is already a good score, then there must also be
an object in the collection with a good score. Thus we can show the existence of an
object with a good score by showing that the average score is already good.
Let’s state the two key ideas formally.
• The possibility principle: Let A be the event that a randomly chosen object in a
  collection has a certain property. If P (A) > 0, then there exists an object with
  the property.
• The good score principle: Let X be the score of a randomly chosen object. If
  E(X) ≥ c, then there is an object with a score of at least c.
To see why the possibility principle is true, consider its contrapositive: if there is no
object with the desired property, then the probability of a randomly chosen object
having the property is 0. Similarly, the contrapositive of the good score principle is
“if all objects have a score below c, then the average score is below c”, which is true
since a weighted average of numbers less than c is a number less than c.
The probabilistic method doesn’t tell us how to find an object with the desired
property; it only assures us that one exists.
Example 4.9.1. A group of 100 people are assigned to 15 committees of size 20,
such that each person serves on 3 committees. Show that there exist 2 committees
that have at least 3 people in common.


Expectation                                                                       185

Solution:
A direct approach is inadvisable here: one would have to list all possible committee
assignments and compute, for each one, the number of people in common in every
pair of committees. The probabilistic method lets us bypass brute-force calculations.
To prove the existence of two committees with an overlap of at least three people,
we’ll calculate the average overlap of two randomly chosen committees in an arbi-
trary committee assignment. So choose two committees at random, and let X be
the number of people on both committees. We can represent X = I1 +I2 +· · ·+I100 ,
where Ij = 1 if the jth person is on both committees and 0 otherwise. By symmetry,
all of the indicators have the same expected value, so E(X) = 100E(I1 ), and we
just need to find E(I1 ).
By the fundamental bridge, E(I1 ) is the probability that person 1 (whom we’ll
name Bob) is on both committees (which we’ll call A and B). There are a variety
of ways to calculate this probability; one way is to think of Bob’s committees as
3 tagged elk in a population of 15. Then A and B are a sample of 2 elk, made
without replacement. Using the HGeom(3, 12, 2) PMF, the probability that both
of these
         elk are tagged (i.e., the probability that both committees contain Bob) is
 3 12      15
 2    0  / 2 = 1/35. Therefore,

                              E(X) = 100/35 = 20/7,

which is just shy of the desired “good score” of 3. But hope is not lost! The good
score principle says there exist two committees with an overlap of at least 20/7, but
since the overlap between two committees must be an integer, an overlap of at least
20/7 implies an overlap of at least 3. Thus, there exist two committees with at least
3 people in common.                                                                


4.9.1   *Communicating over a noisy channel

Another major application of the probabilistic method is in information theory, the
subject which studies (among other things) how to achieve reliable communication
across a noisy channel. Consider the problem of trying to send a message when there
is noise. This problem is encountered by millions of people every day, such as when
talking on the phone (you may be misheard). Suppose that the message you want
to send is represented as a binary vector x ∈ {0, 1}k , and that you want to use a
code to improve the chance that your message will get through successfully.
Definition 4.9.2 (Codes and rates). Given positive integers k and n, a code is a
function c that assigns to each input message x ∈ {0, 1}k a codeword c(x) ∈ {0, 1}n .
The rate of this code is k/n (the number of input bits per output bit). After c(x)
is sent, a decoder takes the received message, which may be a corrupted version of
c(x), and attempts to recover the correct x.
For example, an obvious code would be to repeat yourself a bunch of times, sending
x a bunch of times in a row, say m (with m odd); this is called a repetition code. The


186                                                           Introduction to Probability

receiver could then decode by going with the majority, e.g., decoding the first bit of
x as a 1 if that bit was received more times as a 1 than as a 0. But this code may be
very inefficient; to get the probability of failure very small, you may need to repeat
yourself many times, resulting in a very low rate 1/m of communication.
Claude Shannon, the founder of information theory, showed something amazing:
even in a very noisy channel, there is a code allowing for very reliable communication
at a rate that does not go to 0 as we require the probability of failure to be lower and
lower. His proof was even more amazing: he studied the performance of a completely
random code. Richard Hamming, who worked with Shannon at Bell Labs, described
Shannon’s approach as follows.
     Courage is another attribute of those who do great things. Shannon is a good
 example. For some time he would come to work at about 10:00 am, play chess
 until about 2:00 pm and go home.
     The important point is how he played chess. When attacked he seldom, if
 ever, defended his position, rather he attacked back. Such a method of playing
 soon produces a very interrelated board. He would then pause a bit, think and
 advance his queen saying, “I ain’t [scared] of nothin’.” It took me a while to
 realize that of course that is why he was able to prove the existence of good
 coding methods. Who but Shannon would think to average over all random
 codes and expect to find that the average was close to ideal? I learned from
 him to say the same to myself when stuck, and on some occasions his approach
 enabled me to get significant results. [15]
We will prove a version of Shannon’s result, for the case of a channel where each
transmitted bit gets flipped (from 0 to 1 or from 1 to 0) with probability p, inde-
pendently. First we need two definitions. A natural measure of distance between
binary vectors, named after Hamming, is as follows.
Definition 4.9.3 (Hamming distance). For two binary vectors v and w of the same
length, the Hamming distance d(v, w) is the number of positions in which they differ.
We can write this as                    X
                             d(v, w) =      |vi − wi |.
                                            i


The following function arises very frequently in information theory.
Definition 4.9.4 (Binary entropy function). For 0 < p < 1, the binary entropy
function H is given by

                       H(p) = −p log2 p − (1 − p) log2 (1 − p).

We also define H(0) = H(1) = 0.
The interpretation of H(p) in information theory is that it is a measure of how
much information we get from observing a Bern(p) r.v.; H(1/2) = 1 says that a fair
coin flip provides 1 bit of information, while H(1) = 0 says that with a coin that


Expectation                                                                        187

always lands Heads, there’s no information gained from being told the result of the
flip, since we already know the result.
Now consider a channel where each transmitted bit gets flipped with probability
p, independently. Intuitively, it may seem that smaller p is always better, but note
that p = 1/2 is actually the worst-case scenario. In that case, technically known as
a useless channel, it is impossible to send information over the channel: the output
will be independent of the input! Analogously, in deciding whether to watch a movie,
would you rather hear a review from someone you always disagree with or someone
you agree with half the time? We now prove that for 0 < p < 1/2, it is possible to
communicate very reliably with rate very close to 1 − H(p).
Theorem 4.9.5 (Shannon). Consider a channel where each transmitted bit gets
flipped with probability p, independently. Let 0 < p < 1/2 and  > 0. There exists
a code with rate at least 1 − H(p) −  that can be decoded with probability of error
less than .

Proof. We can assume that 1 − H(p) −  > 0, since otherwise there is no constraint
on the rate. Let n be a large positive integer (chosen according to conditions given
below), and
                            k = dn(1 − H(p) − )e + 1.
The ceiling function is there since k must be an integer. Choose p0 ∈ (p, 1/2) such
that |H(p0 ) − H(p)| < /2 (this can be done since H is continuous). We will now
study the performance of a random code C. To generate a random code C, we need
to generate a random encoded message C(x) for all possible input messages x.
For each x ∈ {0, 1}k , choose C(x) to be a uniformly random vector in {0, 1}n
(making these choices independently). So we can think of C(x) as a vector consisting
of n i.i.d. Bern(1/2) r.v.s. The rate k/n exceeds 1 − H(p) −  by definition, but let’s
see how well we can decode the received message!
Let x ∈ {0, 1}k be the input message, C(x) be the encoded message, and Y ∈ {0, 1}n
be the received message. For now, treat x as deterministic. But C(x) is random since
the codewords are chosen randomly, and Y is random since C(x) is random and due
to the random noise in the channel. Intuitively, we hope that C(x) will be close to
Y (in Hamming distance) and C(z) will be far from Y for all z 6= x, in which case it
will be clear how to decode Y and the decoding will succeed. To make this precise,
decode Y as follows:
If there exists a unique z ∈ {0, 1}k such that d(C(z), Y ) ≤ np0 , decode Y to that z;
otherwise, declare decoder failure.
We will show that for n large enough, the probability of the decoder failing to
recover the correct x is less than . There are two things that could go wrong:

      (a) d(C(x), Y ) > np0 , or
      (b) There could be some impostor z 6= x with d(C(z), Y ) ≤ np0 .


188                                                              Introduction to Probability

Note that d(C(x), Y ) is an r.v., so d(C(x), Y ) > np0 is an event. To handle (a),
represent
                     d(C(x), Y ) = B1 + · · · + Bn ∼ Bin(n, p),
where Bi is the indicator of the ith bit being flipped. The law of large numbers (see
Chapter 10) says that as n grows, the r.v. d(C(x), Y )/n will get very close to p (its
expected value), and so will be very unlikely to exceed p0 :
                                                          
                             0        B1 + · · · + Bn    0
         P (d(C(x), Y ) > np ) = P                    > p → 0 as n → ∞.
                                             n

So by choosing n large enough, we can make

                                 P (d(C(x), Y ) > np0 ) < /4.

To handle (b), note that d(C(z), Y ) ∼ Bin(n, 1/2) for z 6= x, since the n bits in
C(z) are i.i.d. Bern(1/2), independent of Y (to show this in more detail, condition
on Y using LOTP). Let B ∼ Bin(n, 1/2). By Boole’s inequality,

             P (d(C(z), Y ) ≤ np0 for some z 6= x) ≤ (2k − 1)P (B ≤ np0 ).

To simplify notation, suppose that np0 is an integer. A crude way to upper bound a
sum of m terms is to use m times the largest term, and a crude way to upper bound
a binomial coefficient nj is to use r−j (1 − r)−(n−j) for any r ∈ (0, 1). Combining
these two crudities,
                         np0  
                         X                 
                  0    1      n    np0 + 1 n                    0
         P (B ≤ np ) = n         ≤     n      0
                                                ≤ (np0 + 1)2nH(p )−n ,
                      2       j      2     np
                                 j=0

                             0          0         0
using the fact that (p0 )−np (q 0 )−nq = 2nH(p ) for q 0 = 1 − p0 . Thus,

  2k P (B ≤ np0 ) ≤ (np0 + 1)2n(1−H(p)−)+2+n(H(p)+/2)−n = 4(np0 + 1)2−n/2 → 0,

so we can choose n to make P (d(C(z), Y ) ≤ np0 for some z 6= x) < /4.
Assume that k and n have been chosen in accordance with the above, and let F (c, x)
be the event of failure when code c is used with input message x. Putting together
the above results, we have shown that for a random C and any fixed x,

                                       P (F (C, x)) < /2.

It follows that for each x, there is a code c with P (F (c, x)) < /2, but this is not
good enough: we want one code that works well for all x! Let X be a uniformly
random input message in {0, 1}k , independent of C. By LOTP, we have
                                       X
                   P (F (C, X)) =           P (F (C, x))P (X = x) < /2.
                                        x


Expectation                                                                          189

Again using LOTP, but this time conditioning on C, we have
                X
                   P (F (c, X))P (C = c) = P (F (C, X)) < /2.
                     c

Therefore, there exists a code c such that P (F (c, X)) < /2, i.e., a code c such that
the probability of failure for a random input message X is less than /2. Lastly, we
will improve c, obtaining a code that works well for all x, not just a random x. We do
this by expurgating the worst 50% of the x’s. That is, remove as legal input messages
the 2k−1 values of x with the highest failure probabilities for code c. For all remaining
x, we have P (F (c, x)) < , since otherwise more than half of the x ∈ {0, 1}k would
have more than double the average failure probability (see Markov’s inequality in
Chapter 10 for more about this kind of argument). By relabeling the remaining
x using vectors in {0, 1}k−1 , we obtain a code c0 : {0, 1}k−1 → {0, 1}n with rate
(k − 1)/n ≥ 1 − H(p) −  and probability less than  of failure for all input messages
in {0, 1}k−1 .                                                                         

There is also a converse to the above theorem, showing that if we require the rate
to be at least 1 − H(p) + , it is impossible to find codes that make the probability
of error arbitrarily small. This is why 1 − H(p) is called the capacity of the channel.
Shannon also obtained analogous results for much more general channels. These
results give theoretical bounds on what can be achieved, without saying explicitly
which codes to use. Decades of subsequent work have been devoted to developing
specific codes that work well in practice, by coming close to the Shannon bound
and allowing for efficient encoding and decoding.




4.10    Recap

The expectation of a discrete r.v. X is
                                      X
                             E(X) =     xP (X = x).
                                          x

An equivalent “ungrouped” way of calculating expectation is
                                   X
                          E(X) =       X(s)P ({s}),
                                         s

where the sum is taken over pebbles in the sample space. Expectation is a single
number summarizing the center of mass of a distribution. A single-number summary
of the spread of a distribution is the variance, defined by

                     Var(X) = E(X − EX)2 = E(X 2 ) − (EX)2 .

The square root of the variance is called the standard deviation.


190                                                         Introduction to Probability

Expectation is linear:

                 E(cX) = cE(X) and E(X + Y ) = E(X) + E(Y ),

regardless of whether X and Y are independent or not. Variance is not linear:

                               Var(cX) = c2 Var(X),

and
                          Var(X + Y ) 6= Var(X) + Var(Y )
in general (an important exception is when X and Y are independent).
A very important strategy for calculating the expectation of a discrete r.v. X is to
express it as a sum of indicator r.v.s, and then apply linearity and the fundamen-
tal bridge. This technique is especially powerful because the indicator r.v.s need
not be independent; linearity holds even for dependent r.v.s. The strategy can be
summarized in the following three steps.

   1. Represent the r.v. X as a sum of indicator r.v.s. To decide how to define
      the indicators, think about what X is counting. For example, if X is the
      number of local maxima, as in the Putnam problem, then we should create
      an indicator for each local maximum that could occur.
   2. Use the fundamental bridge to calculate the expected value of each indi-
      cator. When applicable, symmetry may be very helpful at this stage.
   3. By linearity of expectation, E(X) can be obtained by adding up the ex-
      pectations of the indicators.

Another tool for computing expectations is LOTUS, which says we can calculate
the expectation of g(X) using only the PMF of X, via
                                     X
                         E(g(X)) =      g(x)P (X = x).
                                        x

If g is non-linear, it is a grave mistake to attempt to calculate E(g(X)) by swapping
the E and the g.
Four new discrete distributions to add to our list are the Geometric, Negative Bi-
nomial, Negative Hypergeometric, and Poisson distributions. A Geom(p) r.v. is the
number of failures before the first success in a sequence of independent Bernoulli
trials with probability p of success, and an NBin(r, p) r.v. is the number of failures
before r successes. The Negative Hypergeometric is similar to the Negative Bino-
mial except, in terms of drawing balls from an urn, the Negative Hypergeometric
samples without replacement and the Negative Binomial samples with replacement.
(We also introduced the First Success distribution, which is just a Geometric shifted
so that the success is included.)
A Poisson r.v. is often used as an approximation for the number of successes that


Expectation                                                                          191

occur when there are many independent or weakly dependent trials, where each
trial has a small probability of success. In the Binomial story, all the trials have the
same probability p of success, but in the Poisson approximation, different trials can
have different (but small) probabilities pj of success.
The Poisson, Binomial, and Hypergeometric distributions are mutually connected
via the operations of conditioning and taking limits, as illustrated in Figure 4.8. In
the rest of this book, we’ll continue to introduce new named distributions and add
them to this family tree, until everything is connected!


                                                                             HGeom


                                                      Limit

                                                              Conditioning



                                             Bin

                      Limit


                              Conditioning



       Pois


FIGURE 4.8
Relationships between the Poisson, Binomial, and Hypergeometric.

Figure 4.9 expands upon the corresponding figure from the previous chapter, further
exploring the connections between the four fundamental objects we have considered:
distributions, random variables, events, and numbers.


192                                                                   Introduction to Probability



                                                           What can
                                                           happen?

       distributions                random variables         events                  numbers

                         generate                            X≤x           P       P(X ≤ x) = F(x)
                                                    X
          CDF F                                              X=x                      P(X = x)
           PMF
           story




                                        function of r.v.
      name, parameters
                                                                                 E(X), Var(X), SD(X)




                                       X, X2, X3, …        LOTUS                E(X), E(X2), E(X3), …
                                           g(X)                                        E(g(X))




FIGURE 4.9
Four fundamental objects in probability: distributions, random variables, events,
and numbers. From an r.v. X, we can generate many other r.v.s by taking functions
of X, and we can use LOTUS to find their expected values. The mean, variance,
and standard deviation of X express the average and spread of the distribution of
X (in particular, they only depend on F , not directly on X itself).




4.11         R

Geometric, Negative Binomial, and Poisson

The three functions for the Geometric distribution in R are dgeom, pgeom, and
rgeom, corresponding to the PMF, CDF, and random generation. For dgeom and
pgeom, we need to supply the following as inputs: (1) the value at which to evaluate
the PMF or CDF, and (2) the parameter p. For rgeom, we need to input (1) the
number of random variables to generate and (2) the parameter p.

For example, to calculate P (X = 3) and P (X ≤ 3) where X ∼ Geom(0.5), we use
dgeom(3,0.5) and pgeom(3,0.5), respectively. To generate 100 i.i.d. Geom(0.8)
r.v.s, we use rgeom(100,0.8). If instead we want 100 i.i.d. FS(0.8) r.v.s, we just
need to add 1 to include the success: rgeom(100,0.8)+1.

For the Negative Binomial distribution, we have dnbinom, pnbinom, and rnbinom.


Expectation                                                                       193

These take three inputs. For example, to calculate the NBin(5, 0.5) PMF at 3, we
type dnbinom(3,5,0.5).
Finally, for the Poisson distribution, the three functions are dpois, ppois, and
rpois. These take two inputs. For example, to find the Pois(10) CDF at 2, we type
ppois(2,10).


Matching simulation

Continuing with Example 4.4.4, let’s use simulation to calculate the expected num-
ber of matches in a deck of cards. As in Chapter 1, we let n be the number of cards
in the deck and perform the experiment 104 times using replicate.
n <- 100
r <- replicate(10^4,sum(sample(n)==(1:n)))
Now r contains the number of matches from each of the 104 simulations. But instead
of looking at the probability of at least one match, as in Chapter 1, we now want
to find the expected number of matches. We can approximate this by the average
of all the simulation results, that is, the arithmetic mean of the elements of r. This
is accomplished with the mean function:
mean(r)
The command mean(r) is equivalent to sum(r)/length(r). The result we get is
very close to 1, confirming the calculation we did in Example 4.4.4 using indicator
r.v.s. You can verify that no matter what value of n you choose, mean(r) will be
very close to 1.


Distinct birthdays simulation

Let’s calculate the expected number of distinct birthdays in a group of k people by
simulation. We’ll let k = 20, but you can choose whatever value of k you like.
k <- 20
r <- replicate(10^4,{bdays <- sample(365,k,replace=TRUE);
                     length(unique(bdays))})
In the second line, replicate repeats the expression in the curly braces 104 times, so
we just need to understand what is inside the curly braces. First, we sample k times
with replacement from the numbers 1 through 365 and call these the birthdays of
the k people, bdays. Then, unique(bdays) removes duplicates in the vector bdays,
and length(unique(bdays)) calculates the length of the vector after duplicates
have been removed. The two commands need to be separated by a semicolon.
Now r contains the number of distinct birthdays that we observed in each of the 104
simulations. The average number of distinct birthdays across the 104 simulations


194                                                                     Introduction to Probability

is mean(r). We can compare the simulated value to the theoretical value that we
found in Example 4.4.5 using indicator r.v.s:
mean(r)
365*(1-(364/365)^k)
When we ran the code, both the simulated and theoretical values gave us approxi-
mately 19.5.




4.12    Exercises

Exercises marked with s have detailed solutions at http://stat110.net.

       Expectations and variances
  1.   Bobo, the amoeba from Chapter 2, currently lives alone in a pond. After one minute
       Bobo will either die, split into two amoebas, or stay the same, with equal probability.
       Find the expectation and variance for the number of amoebas in the pond after one
       minute.
  2.   In the Gregorian calendar, each year has either 365 days (a normal year) or 366 days
       (a leap year). A year is randomly chosen, with probability 3/4 of being a normal year
       and 1/4 of being a leap year. Find the mean and variance of the number of days in the
       chosen year.
  3.   (a) A fair die is rolled. Find the expected value of the roll.

       (b) Four fair dice are rolled. Find the expected total of the rolls.
  4.   A fair die is rolled some number of times. You can choose whether to stop after 1, 2, or
       3 rolls, and your decision can be based on the values that have appeared so far. You
       receive the value shown on the last roll of the die, in dollars. What is your optimal
       strategy (to maximize your expected winnings)? Find the expected winnings for this
       strategy.
       Hint: Start by considering a simpler version of this problem, where there are at most 2
       rolls. For what values of the first roll should you continue for a second roll?
  5.   Find the mean and variance of a Discrete Uniform r.v. on 1, 2, . . . , n.
       Hint: See the math appendix for some useful facts about sums.
  6.   Two teams are going to play a best-of-7 match (the match will end as soon as either
       team has won 4 games). Each game ends in a win for one team and a loss for the other
       team. Assume that each team is equally likely to win each game, and that the games
       played are independent. Find the mean and variance of the number of games played.
  7.   A certain small town, whose population consists of 100 families, has 30 families with 1
       child, 50 families with 2 children, and 20 families with 3 children. The birth rank of one
       of these children is 1 if the child is the firstborn, 2 if the child is the secondborn, and 3
       if the child is the thirdborn.

       (a) A random family is chosen (with equal probabilities), and then a random child within
       that family is chosen (with equal probabilities). Find the PMF, mean, and variance of
       the child’s birth rank.


Expectation                                                                                       195

        (b) A random child is chosen in the town (with equal probabilities). Find the PMF,
        mean, and variance of the child’s birth rank.
   8.   A certain country has four regions: North, East, South, and West. The populations of
        these regions are 3 million, 4 million, 5 million, and 8 million, respectively. There are 4
        cities in the North, 3 in the East, 2 in the South, and there is only 1 city in the West.
        Each person in the country lives in exactly one of these cities.
        (a) What is the average size of a city in the country? (This is the arithmetic mean of
        the populations of the cities, and is also the expected value of the population of a city
        chosen uniformly at random.)
        Hint: Give the cities names (labels).
        (b) Show that without further information it is impossible to find the variance of the
        population of a city chosen uniformly at random. That is, the variance depends on how
        the people within each region are allocated between the cities in that region.
        (c) A region of the country is chosen uniformly at random, and then a city within that
        region is chosen uniformly at random. What is the expected population size of this
        randomly chosen city?
        Hint: First find the selection probability for each city.
        (d) Explain intuitively why the answer to (c) is larger than the answer to (a).
   9.   Consider the following simplified scenario based on Who Wants to Be a Millionaire?,
        a game show in which the contestant answers multiple-choice questions that have 4
        choices per question. The contestant (Fred) has answered 9 questions correctly already,
        and is now being shown the 10th question. He has no idea what the right answers are
        to the 10th or 11th questions are. He has one “lifeline” available, which he can apply
        on any question, and which narrows the number of choices from 4 down to 2. Fred has
        the following options available.
        (a) Walk away with $16,000.
        (b) Apply his lifeline to the 10th question, and then answer it. If he gets it wrong, he
             will leave with $1,000. If he gets it right, he moves on to the 11th question. He then
             leaves with $32,000 if he gets the 11th question wrong, and $64,000 if he gets the
             11th question right.
        (c) Same as the previous option, except not using his lifeline on the 10th question, and
             instead applying it to the 11th question (if he gets the 10th question right).
        Find the expected value of each of these options. Which option has the highest expected
        value? Which option has the lowest variance?
  10.   Consider the St. Petersburg paradox (Example 4.3.14), except that you receive $n rather
        than $2n if the game lasts for n rounds. What is the fair value of this game? What if
        the payoff is $n2 ?
  11.   Martin has just heard about the following exciting gambling strategy: bet $1 that a
        fair coin will land Heads. If it does, stop. If it lands Tails, double the bet for the next
        toss, now betting $2 on Heads. If it does, stop. Otherwise, double the bet for the next
        toss to $4. Continue in this way, doubling the bet each time and then stopping right
        after winning a bet. Assume that each individual bet is fair, i.e., has an expected net
        winnings of 0. The idea is that
                                 1 + 2 + 22 + 23 + · · · + 2n = 2n+1 − 1,
        so the gambler will be $1 ahead after winning a bet, and then can walk away with a
        profit.
        Martin decides to try out this strategy. However, he only has $31, so he may end up
        walking away bankrupt rather than continuing to double his bet. On average, how much
        money will Martin win?


196                                                                            Introduction to Probability

  12.   Let X be a discrete r.v. with support −n, −n + 1, . . . , 0, . . . , n − 1, n for some positive
        integer n. Suppose that the PMF of X satisfies the symmetry property P (X = −k) =
        P (X = k) for all integers k. Find E(X).
  13.    s Are there discrete random variables X and Y such that E(X) > 100E(Y ) but Y is
        greater than X with probability at least 0.99?
  14.   Let X have PMF
                                    P (X = k) = cpk /k for k = 1, 2, . . . ,
        where p is a parameter with 0 < p < 1 and c is a normalizing constant. We have
        c = −1/ log(1 − p), as seen from the Taylor series

                                                          p2   p3
                                     − log(1 − p) = p +      +    + ....
                                                          2    3
        This distribution is called the Logarithmic distribution (because of the log in the above
        Taylor series), and has often been used in ecology. Find the mean and variance of X.
  15.   Player A chooses a random integer between 1 and 100, with probability pj of choosing
        j (for j = 1, 2, . . . , 100). Player B guesses the number that player A picked, and receives
        from player A that amount in dollars if the guess is correct (and 0 otherwise).

        (a) Suppose for this part that player B knows the values of pj . What is player B’s
        optimal strategy (to maximize expected earnings)?

        (b) Show that if both players choose their numbers so that the probability of picking j is
        proportional to 1/j, then neither player has an incentive to change strategies, assuming
        the opponent’s strategy is fixed. (In game theory terminology, this says that we have
        found a Nash equilibrium.)

        (c) Find the expected earnings of player B when following the strategy from (b). Express
        your answer both as a sum of simple terms and as a numerical approximation. Does the
        value depend on what strategy player A uses?
  16.   The dean of Blotchville University boasts that the average class size there is 20. But
        the reality experienced by the majority of students there is quite different: they find
        themselves in huge courses, held in huge lecture halls, with hardly enough seats or
        Haribo gummi bears for everyone. The purpose of this problem is to shed light on the
        situation. For simplicity, suppose that every student at Blotchville University takes only
        one course per semester.

        (a) Suppose that there are 16 seminar courses, which have 10 students each, and 2 large
        lecture courses, which have 100 students each. Find the dean’s-eye-view average class
        size (the simple average of the class sizes) and the student’s-eye-view average class size
        (the average class size experienced by students, as it would be reflected by surveying
        students and asking them how big their classes are). Explain the discrepancy intuitively.

        (b) Give a short proof that for any set of class sizes (not just those given above), the
        dean’s-eye-view average class size will be strictly less than the student’s-eye-view average
        class size, unless all classes have exactly the same size.
        Hint: Relate this to the fact that variances are nonnegative.
  17.   The sociologist Elizabeth Wrigley-Field posed the following puzzle [29]:
            American fertility fluctuated dramatically in the decades surrounding the Second
            World War. Parents created the smallest families during the Great Depression,
            and the largest families during the postwar Baby Boom. Yet children born during
            the Great Depression came from larger families than those born during the Baby
            Boom. How can this be?


Expectation                                                                                        197

        (a) For a particular era, let nk be the number of American families with exactly k
        children, for each k ≥ 0. (Assume for simplicity that American history has cleanly been
        separated into eras, where each era has a well-defined set of families, and each family
        has a well-defined set of children; we are ignoring the fact that a particular family’s size
        may change over time, that children grow up, etc.) For each j ≥ 0, let
                                                    ∞
                                                    X
                                             mj =         kj nk .
                                                    k=0

        For a family selected randomly in that era (with all families equally likely), find the
        expected number of children in the family. Express your answer only in terms of the
        mj ’s.

        (b) For a child selected randomly in that era (with all children equally likely), find the
        expected number of children in the child’s family, only in terms of the mj ’s.

        (c) Give an intuitive explanation in words for which of the answers to (a) and (b) is
        larger, or whether they are equal. Explain how this relates to the Wrigley-Field puzzle.


        Named distributions
  18.   s A fair coin is tossed repeatedly, until it has landed Heads at least once and has landed
        Tails at least once. Find the expected number of tosses.
  19.    s A coin is tossed repeatedly until it lands Heads for the first time. Let X be the
        number of tosses that are required (including the toss that landed Heads), and let p
        be the probability of Heads, so that X ∼ FS(p). Find the CDF of X, and for p = 1/2
        sketch its graph.
  20.   Let X ∼ Bin(100, 0.9). For each of the following parts, construct an example showing
        that it is possible, or explain clearly why it is impossible. In this problem, Y is a random
        variable on the same probability space as X; note that X and Y are not necessarily
        independent.

        (a) Is it possible to have Y ∼ Pois(0.01) with P (X ≥ Y ) = 1?

        (b) Is it possible to have Y ∼ Bin(100, 0.5) with P (X ≥ Y ) = 1?

        (c) Is it possible to have Y ∼ Bin(100, 0.5) with P (X ≤ Y ) = 1?
  21.   s Let X ∼ Bin(n, 12 ) and Y ∼ Bin(n + 1, 12 ), independently.

        (a) Let V = min(X, Y ) be the smaller of X and Y , and let W = max(X, Y ) be the
        larger of X and Y . So if X crystallizes to x and Y crystallizes to y, then V crystallizes
        to min(x, y) and W crystallizes to max(x, y). Find E(V ) + E(W ).

        (b) Show that E|X − Y | = E(W ) − E(V ), with notation as in (a).

        (c) Compute Var(n − X) in two different ways.
  22.    s Raindrops are falling at an average rate of 20 drops per square inch per minute. What
        would be a reasonable distribution to use for the number of raindrops hitting a particular
        region measuring 5 inches2 in t minutes? Why? Using your chosen distribution, compute
        the probability that the region has no rain drops in a given 3-second time interval.
  23.    s Alice and Bob have just met, and wonder whether they have a mutual friend. Each
        has 50 friends, out of 1000 other people who live in their town. They think that it’s
        unlikely that they have a friend in common, saying “each of us is only friends with 5%
        of the people here, so it would be very unlikely that our two 5%’s overlap.”

        Assume that Alice’s 50 friends are a random sample of the 1000 people (equally likely


198                                                                     Introduction to Probability

        to be any 50 of the 1000), and similarly for Bob. Also assume that knowing who Alice’s
        friends are gives no information about who Bob’s friends are.
        (a) Compute the expected number of mutual friends Alice and Bob have.

        (b) Let X be the number of mutual friends they have. Find the PMF of X.

        (c) Is the distribution of X one of the important distributions we have looked at? If so,
        which?
  24.   Let X ∼ Bin(n, p) and Y ∼ NBin(r, p). Using a story about a sequence of Bernoulli
        trials, prove that P (X < r) = P (Y > n − r).
  25.    s Calvin and Hobbes play a match consisting of a series of games, where Calvin has
        probability p of winning each game (independently). They play with a “win by two”
        rule: the first player to win two games more than his opponent wins the match. Find
        the expected number of games played.
        Hint: Consider the first two games as a pair, then the next two as a pair, etc.
  26.   Nick and Penny are independently performing independent Bernoulli trials. For con-
        creteness, assume that Nick is flipping a nickel with probability p1 of Heads and Penny
        is flipping a penny with probability p2 of Heads. Let X1 , X2 , . . . be Nick’s results and
        Y1 , Y2 , . . . be Penny’s results, with Xi ∼ Bern(p1 ) and Yj ∼ Bern(p2 ).

        (a) Find the distribution and expected value of the first time at which they are simul-
        taneously successful, i.e., the smallest n such that Xn = Yn = 1.
        Hint: Define a new sequence of Bernoulli trials and use the story of the Geometric.

        (b) Find the expected time until at least one has a success (including the success).
        Hint: Define a new sequence of Bernoulli trials and use the story of the Geometric.

        (c) For p1 = p2 , find the probability that their first successes are simultaneous, and use
        this to find the probability that Nick’s first success precedes Penny’s.
  27.    s Let X and Y be Pois(λ) r.v.s, and T = X + Y . Suppose that X and Y are not
        independent, and in fact X = Y . Prove or disprove the claim that T ∼ Pois(2λ) in this
        scenario.
  28.   William is on a treasure hunt. There are t pieces of treasure, each of which is hidden in
        one of n locations. William searches these locations one by one, without replacement,
        until he has found all the treasure. (Assume that no location contains more than one
        piece of treasure, and that William will find the treasure piece when he searches a loca-
        tion that does have treasure.) Let X be the number of locations that William searches
        during his treasure hunt. Find the distribution of X, and find E(X).
  29.   Let X ∼ Geom(p), and define the function f by f (x) = P (X = x), for all real x. Find
        E(f (X)). (The notation f (X) means first evaluate f (x) in terms of p and x, and then
        plug in X for x; it is not correct to say “f (X) = P (X = X) = 1”.)
  30.   (a) Use LOTUS to show that for X ∼ Pois(λ) and any function g,

                                      E(Xg(X)) = λE(g(X + 1)),

        assuming that both sides exist. This is called the Stein-Chen identity for the Poisson.

        (b) Find the third moment E(X 3 ) for X ∼ Pois(λ) by using the identity from (a) and a
        bit of algebra to reduce the calculation to the fact that X has mean λ and variance λ.
  31.   In many problems about modeling count data, it is found that values of zero in the data
        are far more common than can be explained well using a Poisson model (we can make
        P (X = 0) large for X ∼ Pois(λ) by making λ small, but that also constrains the mean
        and variance of X to be small since both are λ). The Zero-Inflated Poisson distribution


Expectation                                                                                         199

        is a modification of the Poisson to address this issue, making it easier to handle frequent
        zero values gracefully.
        A Zero-Inflated Poisson r.v. X with parameters p and λ can be generated as follows.
        First flip a coin with probability of p of Heads. Given that the coin lands Heads, X = 0.
        Given that the coin lands Tails, X is distributed Pois(λ). Note that if X = 0 occurs,
        there are two possible explanations: the coin could have landed Heads (in which case
        the zero is called a structural zero), or the coin could have landed Tails but the Poisson
        r.v. turned out to be zero anyway.
        For example, if X is the number of chicken sandwiches consumed by a random person
        in a week, then X = 0 for vegetarians (this is a structural zero), but a chicken-eater
        could still have X = 0 occur by chance (since they might happen not to eat any chicken
        sandwiches that week).

        (a) Find the PMF of a Zero-Inflated Poisson r.v. X.
        (b) Explain why X has the same distribution as (1 − I)Y , where I ∼ Bern(p) is inde-
        pendent of Y ∼ Pois(λ).
        (c) Find the mean of X in two different ways: directly using the PMF of X, and using
        the representation from (b). For the latter, you can use the fact (which we prove in
        Chapter 7) that if r.v.s Z and W are independent, then E(ZW ) = E(Z)E(W ).
        (d) Find the variance of X.
  32.    s A discrete distribution has the memoryless property if for X a random variable with
        that distribution, P (X ≥ j + k|X ≥ j) = P (X ≥ k) for all nonnegative integers j, k.

        (a) If X has a memoryless distribution with CDF F and PMF pi = P (X = i), find an
        expression for P (X ≥ j + k) in terms of F (j), F (k), pj , pk .

        (b) Name a discrete distribution which has the memoryless property. Justify your answer
        with a clear interpretation in words or with a computation.
  33.   Find values of w, b, r such that the Negative Hypergeometric distribution with param-
        eters w, b, r reduces to a Discrete Uniform on {0, 1, . . . , n}. Justify your answer both in
        terms of the story of the Negative Hypergeometric and in terms of its PMF.


        Indicator r.v.s
  34.    s Randomly, k distinguishable balls are placed into n distinguishable boxes, with all
        possibilities equally likely. Find the expected number of empty boxes.
  35.    s A group of 50 people are comparing their birthdays (as usual, assume their birthdays
        are independent, are not February 29, etc.). Find the expected number of pairs of people
        with the same birthday, and the expected number of days in the year on which at least
        two of these people were born.
  36.    s A group of n ≥ 4 people are comparing their birthdays (as usual, assume their
        birthdays are independent, are not February 29, etc.). Let Iij be the indicator r.v. of i
        and j having the same birthday (for i < j). Is I12 independent of I34 ? Is I12 independent
        of I13 ? Are the Iij independent?
  37.    s A total of 20 bags of Haribo gummi bears are randomly distributed to 20 students.
        Each bag is obtained by a random student, and the outcomes of who gets which bag
        are independent. Find the average number of bags of gummi bears that the first three
        students get in total, and find the average number of students who get at least one bag.
  38.   Each of n ≥ 2 people puts their name on a slip of paper (no two have the same name).
        The slips of paper are shuffled in a hat, and then each person draws one (uniformly at
        random at each stage, without replacement). Find the average number of people who
        draw their own names.


200                                                                            Introduction to Probability

  39.   Two researchers independently select simple random samples from a population of size
        N , with sample sizes m and n (for each researcher, the sampling is done without re-
        placement, with all samples of the prescribed size equally likely). Find the expected size
        of the overlap of the two samples.
  40.   In a sequence of n independent fair coin tosses, what is the expected number of occur-
        rences of the pattern HT H (consecutively)? Note that overlap is allowed, e.g., HT HT H
        contains two overlapping occurrences of the pattern.
  41.   You have a well-shuffled 52-card deck. On average, how many pairs of adjacent cards
        are there such that both cards are red?
  42.   Suppose there are n types of toys, which you are collecting one by one. Each time you
        collect a toy, it is equally likely to be any of the n types. What is the expected number
        of distinct toy types that you have after you have collected t toys? (Assume that you
        will definitely collect t toys, whether or not you obtain a complete set before then.)
  43.   A building has n floors, labeled 1, 2, . . . , n. At the first floor, k people enter the elevator,
        which is going up and is empty before they enter. Independently, each decides which of
        floors 2, 3, . . . , n to go to and presses that button (unless someone has already pressed
        it).

        (a) Assume for this part only that the probabilities for floors 2, 3, . . . , n are equal. Find
        the expected number of stops the elevator makes on floors 2, 3, . . . , n.

        (b) Generalize (a) to the case that floors 2, 3, . . . , n have probabilities p2 , . . . , pn (re-
        spectively); you can leave your answer as a finite sum.
  44.    s There are 100 shoelaces in a box. At each stage, you pick two random ends and
        tie them together. Either this results in a longer shoelace (if the two ends came from
        different pieces), or it results in a loop (if the two ends came from the same piece).
        What are the expected number of steps until everything is in loops, and the expected
        number of loops after everything is in loops? (This is a famous interview problem; leave
        the latter answer as a sum.)
        Hint: For each step, create an indicator r.v. for whether a loop was created then, and
        note that the number of free ends goes down by 2 after each step.
  45.   Show that for any events A1 , . . . , An ,
                                                             n
                                                             X
                                 P (A1 ∩ A2 · · · ∩ An ) ≥         P (Aj ) − n + 1.
                                                             j=1


        Hint: First prove a similar-looking statement about indicator r.v.s, by interpreting what
        the events I(A1 ∩ A2 · · · ∩ An ) = 1 and I(A1 ∩ A2 · · · ∩ An ) = 0 mean.
  46.   You have a well-shuffled 52-card deck. You turn the cards face up one by one, without
        replacement. What is the expected number of non-aces that appear before the first ace?
        What is the expected number between the first ace and the second ace?
  47.   You are being tested for psychic powers. Suppose that you do not have psychic powers.
        A standard deck of cards is shuffled, and the cards are dealt face down one by one. Just
        after each card is dealt, you name any card (as your prediction). Let X be the number
        of cards you predict correctly. (See Diaconis [5] for much more about the statistics of
        testing for psychic powers.)

        (a) Suppose that you get no feedback about your predictions. Show that no matter what
        strategy you follow, the expected value of X stays the same; find this value. (On the
        other hand, the variance may be very different for different strategies. For example,
        saying “Ace of Spades” every time gives variance 0.)
        Hint: Indicator r.v.s.


Expectation                                                                                         201

        (b) Now suppose that you get partial feedback: after each prediction, you are told
        immediately whether or not it is right (but without the card being revealed). Suppose
        you use the following strategy: keep saying a specific card’s name (e.g., “Ace of Spades”)
        until you hear that you are correct. Then keep saying a different card’s name (e.g., “Two
        of Spades”) until you hear that you are correct (if ever). Continue in this way, naming
        the same card over and over again until you are correct and then switching to a new
        card, until the deck runs out. Find the expected value of X, and show that it is very
        close to e − 1.
        Hint: Indicator r.v.s.

        (c) Now suppose that you get complete feedback: just after each prediction, the card is
        revealed. Call a strategy “stupid” if it allows, e.g., saying “Ace of Spades” as a guess
        after the Ace of Spades has already been revealed. Show that any non-stupid strategy
        gives the same expected value for X; find this value.
        Hint: Indicator r.v.s.
  48.   s Let X be Hypergeometric with parameters w, b, n.

        (a) Find E X
                     
                   2
                       by thinking, without any complicated calculations.

        (b) Use (a) to find the variance of X. You should get

                                                      N −n
                                          Var(X) =         npq,
                                                      N −1
        where N = w + b, p = w/N, q = 1 − p.
  49.   There are n prizes, with values $1, $2, . . . , $n. You get to choose k random prizes,
        without replacement. What is the expected total value of the prizes you get?
        Hint: Express the total value in the form a1 I1 +· · ·+an In , where the aj are constants and
        the Ij are indicator r.v.s. Or find the expected value of the jth prize received directly.
  50.   Ten random chords of a circle are chosen, independently. To generate each of these
        chords, two independent uniformly random points are chosen on the circle (intuitively,
        “uniformly” means that the choice is completely random, with no favoritism toward
        certain angles; formally, it means that the probability of any arc is proportional to the
        length of that arc). On average, how many pairs of chords intersect?
        Hint: Consider two random chords. An equivalent way to generate them is to pick four
        independent uniformly random points on the circle, and then pair them up randomly.
  51.    s A hash table is being used to store the phone numbers of k people, storing each
        person’s phone number in a uniformly random location, represented by an integer be-
        tween 1 and n (see Exercise 27 from Chapter 1 for a description of hash tables). Find
        the expected number of locations with no phone numbers stored, the expected number
        with exactly one phone number, and the expected number with more than one phone
        number (should these quantities add up to n?).
  52.   A coin with probability p of Heads is flipped n times. The sequence of outcomes can
        be divided into runs (blocks of H’s or blocks of T ’s), e.g., HHHT T HT T T H becomes
         HHH T T H T T T H , which has 5 runs. Find the expected number of runs.
        Hint: Start by finding the expected number of tosses (other than the first) where the
        outcome is different from the previous one.
  53.   A coin with probability p of Heads is flipped 4 times. Let X be the number of occurrences
        of HH (for example, T HHT has 1 occurrence and HHHH has 3 occurrences). Find
        E(X) and Var(X).


202                                                                     Introduction to Probability

  54.   A population has N people, with ID numbers from 1 to N . Let yj be the value of some
        numerical variable for person j, and
                                                          N
                                                      1 X
                                               ȳ =         yj
                                                      N j=1

        be the population average of the quantity. For example, if yj is the height of person j
        then ȳ is the average height in the population, and if yj is 1 if person j holds a certain
        belief and 0 otherwise, then ȳ is the proportion of people in the population who hold that
        belief. In this problem, y1 , y2 , . . . , yn are thought of as constants rather than random
        variables.
        A researcher is interested in learning about ȳ, but it is not feasible to measure yj for
        all j. Instead, the researcher gathers a random sample of size n, by choosing people
        one at a time, with equal probabilities at each stage and without replacement. Let Wj
        be the value of the numerical variable (e.g., height) for the jth person in the sample.
        Even though y1 , . . . , yn are constants, Wj is a random variable because of the random
        sampling. A natural way to estimate the unknown quantity ȳ is using
                                                          n
                                                      1X
                                             W̄ =           Wj .
                                                      n j=1

        Show that E(W̄ ) = ȳ in two different ways:
        (a) by directly evaluating E(Wj ) using symmetry;
        (b) by showing that W̄ can be expressed as a sum over the population by writing
                                                         N
                                                      1X
                                             W̄ =           Ij yj ,
                                                      n j=1

        where Ij is the indicator of person j being included in the sample, and then using
        linearity and the fundamental bridge.
  55.    s Consider the following algorithm, known as bubble sort, for sorting a list of n distinct
        numbers into increasing order. Initially they are in a random order, with all orders
        equally likely. The algorithm compares the numbers in positions 1 and 2, and swaps
        them if needed, then it compares the new numbers in positions 2 and 3, and swaps
        them if needed, etc., until it has gone through the whole list. Call this one “sweep”
        through the list. After the first sweep, the largest number is at the end, so the second
        sweep (if needed) only needs to work with the first n − 1 positions. Similarly, the third
        sweep (if needed) only needs to work with the first n − 2 positions, etc. Sweeps are
        performed until n − 1 sweeps have been completed or there is a swapless sweep.
        For example, if the initial list is 53241 (omitting commas), then the following 4 sweeps
        are performed to sort the list, with a total of 10 comparisons:
                              53241 → 35241 → 32541 → 32451 → 32415.
                                   32415 → 23415 → 23415 → 23145.
                                        23145 → 23145 → 21345.
                                             21345 → 12345.

        (a) An inversion is a pair of numbers that are out of order (e.g., 12345 has no inversions,
        while 53241 has 8 inversions). Find the expected number of inversions in the original
        list.
        (b) Show that the expected number of comparisons is between 12 n2 and n2 .
                                                                                      

        Hint: For one bound, think about how many comparisons are made if n − 1 sweeps are
        done; for the other bound, use Part (a).


Expectation                                                                                         203

  56.   A certain basketball player practices shooting free throws over and over again. The shots
        are independent, with probability p of success.

        (a) In n shots, what is the expected number of streaks of 7 consecutive successful shots?
        (Note that, for example, 9 in a row counts as 3 streaks.)

        (b) Now suppose that the player keeps shooting until making 7 shots in a row for the
        first time. Let X be the number of shots taken. Show that E(X) ≤ 7/p7 .
        Hint: Consider the first 7 trials as a block, then the next 7 as a block, etc.
  57.    s An urn contains red, green, and blue balls. Balls are chosen randomly with replace-
        ment (each time, the color is noted and then the ball is put back). Let r, g, b be the
        probabilities of drawing a red, green, blue ball, respectively (r + g + b = 1).

        (a) Find the expected number of balls chosen before obtaining the first red ball, not
        including the red ball itself.

        (b) Find the expected number of different colors of balls obtained before getting the
        first red ball.

        (c) Find the probability that at least 2 of n balls drawn are red, given that at least 1 is
        red.
  58.    s Job candidates C1 , C2 , . . . are interviewed one by one, and the interviewer compares
        them and keeps an updated list of rankings (if n candidates have been interviewed so
        far, this is a list of the n candidates, from best to worst). Assume that there is no limit
        on the number of candidates available, that for any n the candidates C1 , C2 , . . . , Cn are
        equally likely to arrive in any order, and that there are no ties in the rankings given by
        the interview.

        Let X be the index of the first candidate to come along who ranks as better than the
        very first candidate C1 (so CX is better than C1 , but the candidates after 1 but prior
        to X (if any) are worse than C1 . For example, if C2 and C3 are worse than C1 but C4
        is better than C1 , then X = 4. All 4! orderings of the first 4 candidates are equally
        likely, so it could have happened that the first candidate was the best out of the first 4
        candidates, in which case X > 4.

        What is E(X) (which is a measure of how long, on average, the interviewer needs to
        wait to find someone better than the very first candidate)?
        Hint: Find P (X > n) by interpreting what X > n says about how C1 compares with
        other candidates, and then apply the result of Theorem 4.4.8.
  59.   People are arriving at a party one at a time. While waiting for more people to arrive
        they entertain themselves by comparing their birthdays. Let X be the number of people
        needed to obtain a birthday match, i.e., before person X arrives there are no two people
        with the same birthday, but when person X arrives there is a match.

        Assume for this problem that there are 365 days in a year, all equally likely. By the
        result of the birthday problem from Chapter 1, for 23 people there is a 50.7% chance of
        a birthday match (and for 22 people there is a less than 50% chance). But this has to
        do with the median of X (defined below); we also want to know the mean of X, and in
        this problem we will find it, and see how it compares with 23.

        (a) A median of a random variable Y is a value m for which P (Y ≤ m) ≥ 1/2 and
        P (Y ≥ m) ≥ 1/2 (this is also called a median of the distribution of Y ; note that the
        notion is completely determined by the CDF of Y ). Every distribution has a median,
        but for some distributions it is not unique. Show that 23 is the unique median of X.


204                                                                              Introduction to Probability

        (b) Show that X = I1 + I2 + · · · + I366 , where Ij is the indicator r.v. for the event X ≥ j.
        Then find E(X) in terms of pj ’s defined by p1 = p2 = 1 and for 3 ≤ j ≤ 366,
                                                                         
                                           1             2              j−2
                           pj = 1 −                 1−        ... 1 −           .
                                          365          365               365

        (c) Compute E(X) numerically. In R, the pithy command cumprod(1-(0:364)/365)
        produces the vector (p2 , . . . , p366 ).

        (d) Find the variance of X, both in terms of the pj ’s and numerically.
        Hint: What is Ii2 , and what is Ii Ij for i < j? Use this to simplify the expansion
                                                                     j−1
                                                                 366 X
                                                                 X
                                   X 2 = I12 + · · · + I366
                                                        2
                                                            +2             Ii Ij .
                                                                 j=2 i=1


        Note: In addition to being an entertaining game for parties, the birthday problem has
        many applications in computer science, such as in a method called the birthday attack
        in cryptography. It can be shown that if there are n days in a year and n is large, then
                                                   r
                                                     πn    2
                                         E(X) ≈          + .
                                                      2    3

  60.   Elk dwell in a certain forest. There are N elk, of which a simple random sample of size
        n is captured and tagged (so all N n
                                                sets of n elk are equally likely). The captured elk
        are returned to the population, and then a new sample is drawn. This is an important
        method that is widely used in ecology, known as capture-recapture. If the new sample
        is also a simple random sample, with some fixed size, then the number of tagged elk in
        the new sample is Hypergeometric.

        For this problem, assume that instead of having a fixed sample size, elk are sampled
        one by one without replacement until m tagged elk have been recaptured, where m is
        specified in advance (of course, assume that 1 ≤ m ≤ n ≤ N ). An advantage of this
        sampling method is that it can be used to avoid ending up with a very small number
        of tagged elk (maybe even zero), which would be problematic in many applications of
        capture-recapture. A disadvantage is not knowing how large the sample will be.

        (a) Find the PMFs of the number of untagged elk in the new sample (call this X) and
        of the total number of elk in the new sample (call this Y ).

        (b) Find the expected sample size EY using symmetry, linearity, and indicator r.v.s.

        (c) Suppose that m, n, N are such that EY is an integer. If the sampling is done with
        a fixed sample size equal to EY rather than sampling until exactly m tagged elk are
        obtained, find the expected number of tagged elk in the sample. Is it less than m, equal
        to m, or greater than m (for n < N )?


        LOTUS
  61.   s For X ∼ Pois(λ), find E(X!) (the average factorial of X), if it is finite.
  62.   For X ∼ Pois(λ), find E(2X ), if it is finite.
  63.   For X ∼ Geom(p), find E(2X ) (if it is finite) and E(2−X ) (if it is finite). For each, make
        sure to clearly state what the values of p are for which it is finite.
  64.    s Let X ∼ Geom(p) and let t be a constant. Find E(etX ), as a function of t (this is
        known as the moment generating function; we will see in Chapter 6 how this function
        is useful).


Expectation                                                                                      205

  65.    s The number of fish in a certain lake is a Pois(λ) random variable. Worried that there
        might be no fish at all, a statistician adds one fish to the lake. Let Y be the resulting
        number of fish (so Y is 1 plus a Pois(λ) random variable).

        (a) Find E(Y 2 ).

        (b) Find E(1/Y ).
  66.    s Let X be a Pois(λ) random variable, where λ is fixed but unknown. Let θ = e−3λ ,
        and suppose that we are interested in estimating θ based on the data. Since X is what
        we observe, our estimator is a function of X, call it g(X). The bias of the estimator g(X)
        is defined to be E(g(X)) − θ, i.e., how far off the estimate is on average; the estimator
        is unbiased if its bias is 0.
        (a) For estimating λ, the r.v. X itself is an unbiased estimator. Compute the bias of the
        estimator T = e−3X . Is it unbiased for estimating θ?

        (b) Show that g(X) = (−2)X is an unbiased estimator for θ. (In fact, it turns out to be
        the only unbiased estimator for θ.)

        (c) Explain intuitively why g(X) is a silly choice for estimating θ, despite (b), and show
        how to improve it by finding an estimator h(X) for θ that is always at least as good as
        g(X) and sometimes strictly better than g(X). That is,

                                        |h(X) − θ| ≤ |g(X) − θ|,

        with the inequality sometimes strict.


        Poisson approximation
  67.    s Law school courses often have assigned seating to facilitate the Socratic method.
        Suppose that there are 100 first-year law students, and each takes the same two courses:
        Torts and Contracts. Both are held in the same lecture hall (which has 100 seats), and
        the seating is uniformly random and independent for the two courses.

        (a) Find the probability that no one has the same seat for both courses (exactly; you
        should leave your answer as a sum).

        (b) Find a simple but accurate approximation to the probability that no one has the
        same seat for both courses.

        (c) Find a simple but accurate approximation to the probability that at least two stu-
        dents have the same seat for both courses.
  68.    s A group of n people play “Secret Santa” as follows: each puts their name on a slip of
        paper in a hat, picks a name randomly from the hat (without replacement), and then
        buys a gift for that person. Unfortunately, they overlook the possibility of drawing one’s
        own name, so some may have to buy gifts for themselves (on the bright side, some may
        like self-selected gifts better). Assume n ≥ 2.

        (a) Find the expected value of the number X of people who pick their own names.

        (b) Find the expected number of pairs of people, A and B, such that A picks B’s name
        and B picks A’s name (where A 6= B and order doesn’t matter).

        (c) What is the approximate distribution of X if n is large (specify the parameter value
        or values)? What does P (X = 0) converge to as n → ∞?


206                                                                    Introduction to Probability

  69.   A survey is being conducted in a city with a million (106 ) people. A sample of size
        1000 is collected by choosing people in the city at random, with replacement and with
        equal probabilities for everyone in the city. Find a simple, accurate approximation to
        the probability that at least one person will get chosen more than once (in contrast,
        Exercise 26 from Chapter 1 asks for an exact answer).
        Hint: Indicator r.v.s are useful here, but creating 1 indicator for each of the million
        people is not recommended since it leads to a messy calculation. Feel free to use the
        fact that 999 ≈ 1000.
  70.    s Ten million people enter a certain lottery. For each person, the chance of winning is
        one in ten million, independently.
        (a) Find a simple, good approximation for the PMF of the number of people who win
        the lottery.
        (b) Congratulations! You won the lottery. However, there may be other winners. Assume
        now that the number of winners other than you is W ∼ Pois(1), and that if there is
        more than one winner, then the prize is awarded to one randomly chosen winner. Given
        this information, find the probability that you win the prize (simplify).
  71.   In a group of 90 people, find a simple, good approximation for the probability that
        there is at least one pair of people such that they share a birthday and their biological
        mothers share a birthday. Assume that no one among the 90 people is the biological
        mother of another one of the 90 people, nor do two of the 90 people have the same
        biological mother. Express your answer as a fully simplified fraction in the form a/b,
        where a and b are positive integers and b ≤ 100.
        Make the usual assumptions as in the birthday problem. To simplify the calculation,
        you can use the approximations 365 ≈ 360 and 89 ≈ 90, and the fact that ex ≈ 1 + x
        for x ≈ 0.
  72.   Use Poisson approximations to investigate the following types of coincidences. The usual
        assumptions of the birthday problem apply.
        (a) How many people are needed to have a 50% chance that at least one of them has
        the same birthday as you?
        (b) How many people are needed to have a 50% chance that there is at least one pair of
        people who not only were born on the same day of the year, but also were born at the
        same hour (e.g., two people born between 2 pm and 3 pm are considered to have been
        born at the same hour)?
        (c) Considering that only 1/24 of pairs of people born on the same day were born at
        the same hour, why isn’t the answer to (b) approximately 24 · 23?
        (d) With 100 people, there is a 64% chance that there is at least one set of 3 people with
        the same birthday (according to R, using pbirthday(100,classes=365,coincident=3)
        to compute it). Provide two different Poisson approximations for this value, one based
        on creating an indicator r.v. for each triplet of people, and the other based on creating
        an indicator r.v. for each day of the year. Which is more accurate?
  73.   A chess tournament has 100 players. In the first round, they are randomly paired to
        determine who plays whom (so 50 games are played). In the second round, they are
        again randomly paired, independently of the first round. In both rounds, all possible
        pairings are equally likely. Let X be the number of people who play against the same
        opponent twice.
        (a) Find the expected value of X.
        (b) Explain why X is not approximately Poisson.
        (c) Find good approximations to P (X = 0) and P (X = 2), by thinking about games in
        the second round such that the same pair played each other in the first round.


Expectation                                                                                                   207

        *Existence
  74.   s Each of 111 people names their 5 favorite movies out of a list of 11 movies.

        (a) Alice and Bob are 2 of the 111 people. Assume for this part only that Alice’s 5
        favorite movies out of the 11 are random, with all sets of 5 equally likely, and likewise
        for Bob, independently. Find the expected number of movies in common to Alice’s and
        Bob’s lists of favorite movies.

        (b) Show that there are 2 movies such that at least 21 of the people name both of these
        movies as favorites.
  75.    s The circumference of a circle is colored with red and blue ink such that 2/3 of the
        circumference is red and 1/3 is blue. Prove that no matter how complicated the coloring
        scheme is, there is a way to inscribe a square in the circle such that at least three of the
        four corners of the square touch red ink.
  76.    s A hundred students have taken an exam consisting of 8 problems, and for each
        problem at least 65 of the students got the right answer. Show that there exist two
        students who collectively got everything right, in the sense that for each problem, at
        least one of the two got it right.
  77.    s Ten points in the plane are designated. You have ten circular coins (of the same
        radius). Show that you can position the coins in the plane (without stacking them) so
        that all ten points are covered.
        Hint: Consider a honeycomb tiling of the plane (this is a way to divide the plane into
        hexagons). You can use the fact from geometry that if a circle is inscribed in a hexagon
                                                                                π
        then the ratio of the area of the circle to the area of the hexagon is 2√ 3
                                                                                    > 0.9.
  78.    s Let S be a set of binary strings a1 . . . an of length n (where juxtaposition means
        concatenation). We call S k-complete if for any indices 1 ≤ i1 < · · · < ik ≤ n and any
        binary string b1 . . . bk of length k, there is a string s1 . . . sn in S such that si1 si2 . . . sik =
        b1 b2 . . . bk . For example, for n = 3, the set S = {001, 010, 011, 100, 101, 110} is 2-complete
        since all 4 patterns of 0’s and 1’s of length 2 can be found in any 2 positions. Show that
        if nk 2k (1 − 2−k )m < 1, then there exists a k-complete set of size at most m.


        Mixed practice
  79.   A hacker is trying to break into a password-protected website by randomly trying to
        guess the password. Let m be the number of possible passwords.

        (a) Suppose for this part that the hacker makes random guesses (with equal probability),
        with replacement. Find the average number of guesses it will take until the hacker guesses
        the correct password (including the successful guess).

        (b) Now suppose that the hacker guesses randomly, without replacement. Find the aver-
        age number of guesses it will take until the hacker guesses the correct password (including
        the successful guess).
        Hint: Use symmetry.

        (c) Show that the answer to (a) is greater than the answer to (b) (except in the degen-
        erate case m = 1), and explain why this makes sense intuitively.

        (d) Now suppose that the website locks out any user after n incorrect password attempts,
        so the hacker can guess at most n times. Find the PMF of the number of guesses that
        the hacker makes, both for the case of sampling with replacement and for the case of
        sampling without replacement.


208                                                                      Introduction to Probability

  80.   A fair 20-sided die is rolled repeatedly, until a gambler decides to stop. The gambler
        receives the amount shown on the die when the gambler stops. The gambler decides in
        advance to roll the die until a value of m or greater is obtained, and then stop (where
        m is a fixed integer with 1 ≤ m ≤ 20).

        (a) What is the expected number of rolls (simplify)?

        (b) What is the expected square root of the number of rolls (as a sum)?
  81.    s A group of 360 people is going to be split into 120 teams of 3 (where the order of
        teams and the order within a team don’t matter).
        (a) How many ways are there to do this?

        (b) The group consists of 180 married couples. A random split into teams of 3 is chosen,
        with all possible splits equally likely. Find the expected number of teams containing
        married couples.
  82.    s The gambler de Méré asked Pascal whether it is more likely to get at least one six in
        4 rolls of a die, or to get at least one double-six in 24 rolls of a pair of dice. Continuing
        this pattern, suppose that a group of n fair dice is rolled 4 · 6n−1 times.

        (a) Find the expected number of times that “all sixes” is achieved (i.e., how often among
        the 4 · 6n−1 rolls it happens that all n dice land 6 simultaneously).

        (b) Give a simple but accurate approximation of the probability of having at least one
        occurrence of “all sixes”, for n large (in terms of e but not n).

        (c) de Méré finds it tedious to re-roll so many dice. So after one normal roll of the n
        dice, in going from one roll to the next, with probability 6/7 he leaves the dice in the
        same configuration and with probability 1/7 he re-rolls. For example, if n = 3 and the
        7th roll is (3, 1, 4), then 6/7 of the time the 8th roll remains (3, 1, 4) and 1/7 of the
        time the 8th roll is a new random outcome. Does the expected number of times that
        “all sixes” is achieved stay the same, increase, or decrease (compared with (a))? Give a
        short but clear explanation.
  83.    s Five people have just won a $100 prize, and are deciding how to divide the $100 up
        between them. Assume that whole dollars are used, not cents. Also, for example, giving
        $50 to the first person and $10 to the second is different from vice versa.
        (a) How many ways are there to divide up the $100, such that each gets at least $10?

        (b) Assume that the $100 is randomly divided up, with all of the possible allocations
        counted in (a) equally likely. Find the expected amount of money that the first person
        receives.

        (c) Let Aj be the event that the jth person receives more than the first person (for
        2 ≤ j ≤ 5), when the $100 is randomly allocated as in (b). Are A2 and A3 independent?
  84.    s Joe’s iPod has 500 different songs, consisting of 50 albums of 10 songs each. He listens
        to 11 random songs on his iPod, with all songs equally likely and chosen independently
        (so repetitions may occur).

        (a) What is the PMF of how many of the 11 songs are from his favorite album?

        (b) What is the probability that there are 2 (or more) songs from the same album among
        the 11 songs he listens to?

        (c) A pair of songs is a match if they are from the same album. If, say, the 1st, 3rd, and
        7th songs are all from the same album, this counts as 3 matches. Among the 11 songs
        he listens to, how many matches are there on average?


Expectation                                                                                      209

  85.    s Each day that the Mass Cash lottery is run in Massachusetts, 5 of the integers from
        1 to 35 are chosen (randomly and without replacement).
        (a) When playing this lottery, find the probability of guessing exactly 3 numbers right,
        given that you guess at least 1 of the numbers right.

        (b)Find an exact expression for the expected number of days needed so that all of the
         35
          5
             possible lottery outcomes will have occurred.

        (c) Approximate the probability that after 50 days of the lottery, every number from 1
        to 35 has been picked at least once.
  86.   A certain country has three political parties, denoted by A, B, and C. Each adult in
        the country is a member of exactly one of the three parties. There are n adults in the
        country, consisting of nA members of party A, nB members of party B, and nC members
        of party C, where nA , nB , nC are positive integers with nA + nB + nC = n.
        A simple random sample of size m is chosen from the adults in the country (the sampling
        is done without replacement, and all possible samples of size m are equally likely). Let
        X be the number of members of party A in the sample, Y be the number of members
        of party B in the sample, and Z be the number of members of party C in the sample.

        (a) Find P (X = x, Y = y, Z = z), for x, y, z nonnegative integers with x + y + z = m.

        (b) Find E(X).

        (c) Find Var(X), and briefly explain why your answer makes sense in the extreme cases
        m = 1 and m = n.
  87.   The U.S. Senate consists of 100 senators, with 2 from each of the 50 states. There are d
        Democrats in the Senate. A committee of size c is formed, by picking a random set of
        senators such that all sets of size c are equally likely.

        (a) Find the expected number of Democrats on the committee.

        (b) Find the expected number of states represented on the committee (by at least one
        senator).

        (c) Find the expected number of states such that both of the state’s senators are on the
        committee.

        (d) Each state has a junior senator and a senior senator (based on which of them has
        served longer). A committee of size 20 is formed randomly, with all sets of 20 senators
        equally likely. Find the distribution of the number of junior senators on the committee,
        and the expected number of junior senators on the committee.

        (e) For the committee from (d), find the expected number of states such that both
        senators from that state are on the committee.
  88.   A certain college has g good courses and b bad courses, where g and b are positive
        integers. Alice, who is hoping to find a good course, randomly shops courses one at a
        time (without replacement) until she finds a good course.

        (a) Find the expected number of bad courses that Alice shops before finding a good
        course (as a simple expression in terms of g and b).

        (b) Should the answer to (a) be less than, equal to, or greater than b/g? Explain this
        using properties of the Geometric distribution.


210                                                                       Introduction to Probability

  89.   A DNA sequence can be represented as a sequence of letters, where the alphabet has 4
        letters: A,C,T,G. Suppose such a sequence is generated randomly, where the letters are
        independent and the probabilities of A,C,T,G are pA , pC , pT , pG , respectively.

        (a) In a DNA sequence of length 115, what is the variance of the number of occurrences
        of the letter C?

        (b) In a DNA sequence of length 115, what is the expected number of occurrences of
        the expression CATCAT? Note that, for example, the expression CATCATCAT counts
        as 2 occurrences.

        (c) In a DNA sequence of length 6, what is the probability that the expression CAT
        occurs at least once?
  90.   Alice is conducting a survey in a town with population size 1000. She selects a simple
        random sample of size 100 (i.e., sampling without replacement, such that all samples of
        size 100 are equally likely). Bob is also conducting a survey in this town. Bob selects
        a simple random sample of size 20, independent of Alice’s sample. Let A be the set of
        people in Alice’s sample and B be the set of people in Bob’s sample.

        (a) Find the expected number of people in A ∩ B.

        (b) Find the expected number of people in A ∪ B.

        (c) The 1000 people consist of 500 married couples. Find the expected number of couples
        such that both members of the couple are in Bob’s sample.
  91.   The Wilcoxon rank sum test is a widely used procedure for assessing whether two groups
        of observations come from the same distribution. Let group 1 consist of i.i.d. X1 , . . . , Xm
        with CDF F and group 2 consist of i.i.d. Y1 , . . . , Yn with CDF G, with all of these r.v.s
        independent. Assume that the probability of 2 of the observations being equal is 0 (this
        will be true if the distributions are continuous).
        After the m + n observations are obtained, they are listed in increasing order, and each
        is assigned a rank between 1 and m + n: the smallest has rank 1, the second smallest
                      P Let Rj be the rank of Xj among all the observations for 1 ≤ j ≤ m,
        has rank 2, etc.
        and let R = m    j=1 Rj be the sum of the ranks for group 1.
        Intuitively, the Wilcoxon rank sum test is based on the idea that a very large value of
        R is evidence that observations from group 1 are usually larger than observations from
        group 2 (and vice versa if R is very small). But how large is “very large” and how small
        is “very small”? Answering this precisely requires studying the distribution of the test
        statistic R.

        (a) The null hypothesis in this setting is that F = G. Show that if the null hypothesis
        is true, then E(R) = m(m + n + 1)/2.

        (b) The power of a test is an important measure of how good the test is about saying
        to reject the null hypothesis if the null hypothesis is false. To study the power of the
        Wilcoxon rank sum test, we need to study the distribution of R in general. So for this
        part, we do not assume F = G. Let p = P (X1 > Y1 ). Find E(R) in terms of m, n, p.
        Hint: Write Rj in terms of indicator r.v.s for Xj being greater than various other r.v.s.
  92.   The legendary Caltech physicist Richard Feynman and two editors of The Feynman
        Lectures on Physics (Michael Gottlieb and Ralph Leighton) posed the following problem
        about how to decide what to order at a restaurant. You plan to eat m meals at a certain
        restaurant, where you have never eaten before. Each time, you will order one dish.
        The restaurant has n dishes on the menu, with n ≥ m. Assume that if you had tried
        all the dishes, you would have a definite ranking of them from 1 (your least favorite) to
        n (your favorite). If you knew which your favorite was, you would be happy to order it
        always (you never get tired of it).


Expectation                                                                                     211

       Before you’ve eaten at the restaurant, this ranking is completely unknown to you. After
       you’ve tried some dishes, you can rank those dishes amongst themselves, but don’t know
       how they compare with the dishes you haven’t yet tried. There is thus an exploration-
       exploitation tradeoff : should you try new dishes, or should you order your favorite among
       the dishes you have tried before?
       A natural strategy is to have two phases in your series of visits to the restaurant: an
       exploration phase, where you try different dishes each time, and an exploitation phase,
       where you always order the best dish you obtained in the exploration phase. Let k be
       the length of the exploration phase (so m − k is the length of the exploitation phase).
       Your goal is to maximize the expected sum of the ranks of the dishes you eat there (the
       rank of a dish is the “true” rank from 1 to n that you would give that dish if you could
       try all the dishes). Show that the optimal choice is
                                               p
                                           k = 2(m + 1) − 1,

       or this rounded up or down to an integer if needed. Do this in the following steps:

       (a) Let X be the rank of the best dish that you find in the exploration phase. Find the
       expected sum of the ranks of all the dishes you eat (including both phases), in terms of
       k, n, and E(X).

       (b) Find the PMF of X, as a simple expression in terms of binomial coefficients.

       (c) Show that
                                                   k(n + 1)
                                          E(X) =            .
                                                    k+1
       Hint: Use Example 1.5.2 (about the team captain) and Exercise 20 from Chapter 1
       (about the hockey stick identity).

       (d) Use calculus to find the optimal value of k.


Taylor & Francis
Taylor & Francis Group
http://taylorandfrancis.com


5
Continuous random variables



So far we have been working with discrete random variables, whose possible values
can be written down as a list. In this chapter we will discuss continuous r.v.s, which
can take on any real value in an interval (possibly of infinite length, such as (0, ∞)
or the entire real line). First we’ll look at properties of continuous r.v.s in general.
Then we’ll introduce three famous continuous distributions—the Uniform, Normal,
and Exponential—which, in addition to having important stories in their own right,
serve as building blocks for many other useful continuous distributions.




5.1       Probability density functions
                                              1.0
      1.0




                                        ●
                                ●       ●
                                              0.8
      0.8




                         ●      ●
                                              0.6
      0.6
    CDF




                                            CDF
      0.4




                                              0.4




                  ●      ●
      0.2




                                              0.2




             ●    ●
      0.0




             ●
                                              0.0




             0    1      2      3       4           −3   −2   −1   0   1   2    3
                         x                                         x


FIGURE 5.1
Discrete vs. continuous r.v.s. Left: The CDF of a discrete r.v. has jumps at each
point in the support. Right: The CDF of a continuous r.v. increases smoothly.

Recall that for a discrete r.v., the CDF jumps at every point in the support, and is
flat everywhere else. In contrast, for a continuous r.v. the CDF increases smoothly;
see Figure 5.1 for a comparison of discrete vs. continuous CDFs.
Definition 5.1.1 (Continuous r.v.). An r.v. has a continuous distribution if its

                                                                                    213


214                                                           Introduction to Probability

CDF is differentiable. We also allow there to be endpoints (or finitely many points)
where the CDF is continuous but not differentiable, as long as the CDF is differen-
tiable everywhere else. A continuous random variable is a random variable with a
continuous distribution.
For discrete r.v.s, the CDF is awkward to work with because of its jumpiness, and
its derivative is almost useless since it’s undefined at the jumps and 0 everywhere
else. But for continuous r.v.s, the CDF is often convenient to work with, and its
derivative is a very useful function, called the probability density function.
Definition 5.1.2 (Probability density function). For a continuous r.v. X with CDF
F , the probability density function (PDF) of X is the derivative f of the CDF, given
by f (x) = F 0 (x). The support of X, and of its distribution, is the set of all x where
f (x) > 0.
An important way in which continuous r.v.s differ from discrete r.v.s is that for a
continuous r.v. X, P (X = x) = 0 for all x. This is because P (X = x) is the height
of a jump in the CDF at x, but the CDF of X has no jumps! Since the PMF of a
continuous r.v. would just be 0 everywhere, we work with a PDF instead.
The PDF is analogous to the PMF in many ways, but there is a key difference: for
a PDF f , the quantity f (x) is not a probability, and in fact it is possible to have
f (x) > 1 for some values of x. To obtain a probability, we need to integrate the
PDF. The fundamental theorem of calculus tells us how to get from the PDF back
to the CDF.
Proposition 5.1.3 (PDF to CDF). Let X be a continuous r.v. with PDF f . Then
the CDF of X is given by          Z         x
                                 F (x) =        f (t)dt.
                                           −∞

Proof. By definition of PDF, F is an antiderivative of f . So by the fundamental
theorem of calculus,
                      Z x
                          f (t)dt = F (x) − F (−∞) = F (x).                   
                         −∞

The above result is analogous to how we obtained the value of a discrete CDF at
x by summing the PMF over all values less than or equal to x; here we integrate
the PDF over all values up to x, so the CDF is the accumulated area under the
PDF. Since we can freely convert between the PDF and the CDF using the inverse
operations of integration and differentiation, both the PDF and CDF carry complete
information about the distribution of a continuous r.v.
Since the PDF determines the distribution, we should be able to use it to find
the probability of X falling into an interval (a, b). A handy fact is that we can
include or exclude the endpoints as we wish without altering the probability, since
the endpoints have probability 0:
         P (a < X < b) = P (a < X ≤ b) = P (a ≤ X < b) = P (a ≤ X ≤ b).


Continuous random variables                                                           215

h 5.1.4 (Including or excluding endpoints). We can be carefree about including
or excluding endpoints as above for continuous r.v.s, but we must not be careless
about this for discrete r.v.s.
By definition of CDF and the fundamental theorem of calculus,
                                                   Z b
                   P (a < X ≤ b) = F (b) − F (a) =     f (x)dx.
                                                         a


Therefore, to find the probability of X falling in the interval (a, b] (or (a, b), [a, b),
or [a, b]) using the PDF, we simply integrate the PDF from a to b. In general, for
an arbitrary region A ⊆ R,
                                            Z
                              P (X ∈ A) =      f (x)dx.
                                                A

In summary:
    To get a desired probability, integrate the PDF over the appropriate range.
Just as a valid PMF must be nonnegative and sum to 1, a valid PDF must be
nonnegative and integrate to 1.
Theorem 5.1.5 (Valid PDFs). The PDF f of a continuous r.v. must satisfy the
following two criteria:
• Nonnegative: f (x) ≥ 0;
                  R∞
• Integrates to 1: −∞ f (x)dx = 1.

Proof. The first criterion is true because probability is nonnegative; if f (x0 ) were
negative, then we could integrate over a tiny region around x0 and get a negative
probability. Alternatively, note that the PDF at x0 is the slope of the CDF at x0 , so
f (x0 ) < 0 would imply that the
                               R ∞CDF is decreasing at x0 , which is not allowed. The
second criterion is true since −∞ f (x)dx is the probability of X falling somewhere
on the real line, which is 1.                                                       

Conversely, any such function f is the PDF of some r.v. This is because if f satisfies
these properties, we can integrate it as in Proposition 5.1.3 to get a function F
satisfying the properties of a CDF. Then a version of Universality of the Uniform,
the main concept in Section 5.3, can be used to create an r.v. with CDF F .
Now let’s look at some specific examples of PDFs. The two distributions in the
following examples are named the Logistic and Rayleigh distributions, but we won’t
discuss their stories here; their appearance is intended mainly as a way of getting
comfortable with PDFs.
Example 5.1.6 (Logistic). The Logistic distribution has CDF
                                           ex
                               F (x) =          ,   x ∈ R.
                                         1 + ex


216                                                                           Introduction to Probability

To get the PDF, we differentiate the CDF, which gives
                                              ex
                                 f (x) =              ,        x ∈ R.
                                           (1 + ex )2

Let X ∼ Logistic. To find P (−2 < X < 2), integrate the PDF from −2 to 2:
                              Z 2
                                     ex
          P (−2 < X < 2) =              x 2
                                            dx = F (2) − F (−2) ≈ 0.76.
                               −2 (1 + e )

The integral was easy to evaluate since we already knew that F was an antiderivative
for f , and we had a nice expression for F . Otherwise, we could have made the
substitution u = 1 + ex , so du = ex dx, giving
              Z 2                 Z 1+e2             
                      ex                  1          1 1+e2
                         x 2
                             dx =          2
                                             du = −            ≈ 0.76.
               −2 (1 + e )         1+e−2 u           u 1+e−2

Figure 5.2 shows the Logistic PDF (left) and CDF (right). On the PDF, the prob-
ability P (−2 < X < 2) is represented by the shaded area; on the CDF, it is
represented by the height of the curly brace. You can check that the properties of
a valid PDF and CDF are satisfied.                                              
            0.30




                                                         1.0
                                                         0.8
            0.20




                                                         0.6
                                                  CDF
      PDF




                                                         0.4
            0.10




                                                         0.2
            0.00




                                                         0.0




                   −4   −2   0     2       4                     −4      −2      0     2     4
                             x                                                   x


FIGURE 5.2
Logistic PDF and CDF. The probability P (−2 < X < 2) is indicated by the shaded
area under the PDF and the height of the curly brace on the CDF.

Example 5.1.7 (Rayleigh). The Rayleigh distribution has CDF
                                                     2
                                 F (x) = 1 − e−x /2 ,           x > 0.

To get the PDF, we differentiate the CDF, which gives
                                                 2
                                  f (x) = xe−x /2 ,            x > 0.


Continuous random variables                                                                   217

For x ≤ 0, both the CDF and the PDF are equal to 0.
Let X ∼ Rayleigh. To find P (X > 2), we need to integrate the PDF from 2 to ∞.
We can do that by making the substitution u = −x2 /2, but since we already have
the CDF in a nice form we know the integral is F (∞) − F (2) = 1 − F (2):
                             Z ∞
                                      2
                 P (X > 2) =     xe−x /2 dx = 1 − F (2) ≈ 0.14.
                                      2

The Rayleigh PDF and CDF are plotted in Figure 5.3. Again, probability is repre-
sented by a shaded area on the PDF and a vertical height on the CDF.          
          0.8




                                                    1.0
                                                    0.8
          0.6




                                                    0.6
                                              CDF
    PDF
          0.4




                                                    0.4
          0.2




                                                    0.2
          0.0




                                                    0.0




                0   1     2       3   4   5                0       1     2       3    4   5
                              x                                              x


FIGURE 5.3
Rayleigh PDF and CDF. The probability P (X > 2) is indicated by the shaded area
under the PDF and the height of the curly brace on the CDF.

Although the height of a PDF at x does not represent a probability, it is closely
related to the probability of falling into a tiny interval around x, as the following
intuition explains.
Intuition 5.1.8 (Units). Let F be the CDF and f be the PDF of a continuous
r.v. X. As mentioned earlier, f (x) is not a probability; for example, we could have
f (3) > 1, and we know P (X = 3) = 0. But thinking about the probability of X
being very close to 3 gives us a way to interpret f (3). Specifically, the probability of
X being in a tiny interval of length , centered at 3, will essentially be f (3). This
is because                                    Z           3+/2
                    P (3 − /2 < X < 3 + /2) =                   f (x)dx ≈ f (3),
                                                     3−/2

if the interval is so tiny that f is approximately the constant f (3) on that interval.
In general, we can think of f (x)dx as the probability of X being in an infinitesimally
small interval containing x, of length dx.
In practice, X often has units in some system of measurement, such as units of


218                                                               Introduction to Probability

distance, time, area, or mass. Thinking about the units is not only important in
applied problems, but also it often helps in checking that answers make sense.
Suppose for concreteness that X is a length, measured in centimeters (cm). Then
f (x) = dF (x)/dx is the probability per cm at x, which explains why f (x) is a prob-
ability density. Probability is a dimensionless quantity (a number without physical
units), so the units of f (x) are cm−1 . Therefore, to be able to get a probability
                                                                              R 5 again,
we need to multiply f (x) by a length. When we do an integral such as 0 f (x)dx,
this is achieved by the often-forgotten dx.                                           
Intuition 5.1.9 (Simulation). For another intuitive way to think about PDFs,
consider the following graphical way to simulate a draw X from a continuous dis-
tribution, based on looking at the graph of the PDF. To generate X, choose a
uniformly random point under the PDF curve; this means that the probability of
any region under the curve is the area of that region. Then let X be the x-coordinate
of the random point. This is illustrated in Figure 5.4.
        PDF




                                              (x,y)




              0   1     2      3      4   x           5   6   7     8      9      10

                                              Label


FIGURE 5.4
A complicated PDF (no numbers are shown on the vertical axis since the scale is
whatever it needs to be to make the area under the curve 1). To generate an r.v. X
with this PDF, choose a uniformly random point (x, y) under the curve and let
X = x. This method works since, for example, X will be in the interval [3, 6] if and
only if the randomly chosen point (x, y) is in the shaded region.

Then X has the desired distribution since, by construction, P (a ≤ X ≤ b) is the
area under the PDF curve between the lines x = a and x = b. Thinking about
this method helps build intuition for PDFs, by giving us a feel for random variables
sampled according to a particular PDF curve.                                      


Continuous random variables                                                           219

The definition of expectation for continuous r.v.s is analogous to the definition for
discrete r.v.s: replace the sum with an integral and the PMF with the PDF.
Definition 5.1.10 (Expectation of a continuous r.v.). The expected value (also
called the expectation or mean) of a continuous r.v. X with PDF f is
                                           Z ∞
                                  E(X) =         xf (x)dx.
                                           −∞

As in the discrete case, the expectation of a continuous r.v. may or may not exist.
When discussing expectations, it would be very tedious to have to add “(if it exists)”
after every mention of an expectation not yet shown to exist, so we will often leave
this implicit.
The integral is taken over the entire real line, but if the support of X is not the
entire real line we can just integrate over the support. The units in this definition
make sense: if X is measured in centimeters, then so is E(X), since xf (x)dx has
units of cm · cm−1 · cm = cm.
With this definition, the expected value retains its interpretation as a center of
mass. As shown in Figure 5.5, using the Rayleigh PDF for illustrative purposes, the
expected value is the balancing point of the PDF, just as it was the balancing point
of the PMF in the discrete case.
                        0.8
                        0.6
                        0.4
                        0.2
                        0.0




                              0     1      2       3     4     5




FIGURE 5.5
The expected value of a continuous r.v. is the balancing point of the PDF.

Linearity of expectation holds for continuous r.v.s, as it did for discrete r.v.s (we will
show this later in Example 7.2.4). LOTUS also holds for continuous r.v.s, replacing
the sum with an integral and the PMF with the PDF:


220                                                            Introduction to Probability

Theorem 5.1.11 (LOTUS, continuous). If X is a continuous r.v. with PDF f and
g is a function from R to R, then
                                     Z ∞
                           E(g(X)) =     g(x)f (x)dx.
                                             −∞


We now have all the tools we need to tackle the named distributions of this chapter,
starting with the Uniform distribution.




5.2   Uniform

Intuitively, a Uniform r.v. on the interval (a, b) is a completely random number
between a and b. We formalize the notion of “completely random” on an interval
by specifying that the PDF should be constant over the interval.
Definition 5.2.1 (Uniform distribution). A continuous r.v. U is said to have the
Uniform distribution on the interval (a, b) if its PDF is
                                         1
                                         b−a   if a < x < b,
                           f (x) =
                                         0     otherwise.

We denote this by U ∼ Unif(a, b).
This is a valid PDF because the area under the curve is just the area of a rectangle
with width b − a and height 1/(b − a). The CDF is the accumulated area under the
PDF:                              
                                  
                                   0      if x ≤ a,
                                     x−a
                         F (x) =
                                    b−a if a < x < b,
                                   1      if x ≥ b.
The Uniform distribution that we will most frequently use is the Unif(0, 1) distribu-
tion, also called the standard Uniform. The Unif(0, 1) PDF and CDF are particularly
simple: f (x) = 1 and F (x) = x for 0 < x < 1. Figure 5.6 shows the Unif(0, 1) PDF
and CDF side by side.
For a general Unif(a, b) distribution, the PDF is constant on (a, b), and the CDF is
ramp-shaped, increasing linearly from 0 to 1 as x ranges from a to b.
For Uniform distributions, probability is proportional to length.
Proposition 5.2.2. Let U ∼ Unif(a, b), and let (c, d) be a subinterval of (a, b), of
length l (so l = d − c). Then the probability of U being in (c, d) is proportional
to l. For example, a subinterval that is twice as long has twice the probability of
containing U , and a subinterval of the same length has the same probability.


Continuous random variables                                                              221




      1.5




                                                 1.0
                                                 0.8
      1.0




                                                 0.6
                                               CDF
   PDF




                                                 0.4
      0.5




                                                 0.2
      0.0




                                                 0.0
            −0.5   0.0   0.5     1.0     1.5           −0.5   0.0   0.5    1.0     1.5
                          x                                         x


FIGURE 5.6
Unif(0, 1) PDF and CDF.

                                               1
Proof. Since the PDF of U is the constant b−a     on (a, b), the area under the PDF
                l
from c to d is b−a , which is a constant times l.                                 

The above proposition is a very special property of the Uniform; for any other
distribution, there are intervals of the same length that have different probabilities.
Even after conditioning on a Uniform r.v. being in a certain subinterval, we still
have a Uniform distribution and thus still have probability proportional to length
(within that subinterval); we show this below.
Proposition 5.2.3. Let U ∼ Unif(a, b), and let (c, d) be a subinterval of (a, b).
Then the conditional distribution of U given U ∈ (c, d) is Unif(c, d).

Proof. For u in (c, d), the conditional CDF at u is
                                P (U ≤ u, c < U < d)   P (U ∈ (c, u])   u−c
      P (U ≤ u|U ∈ (c, d)) =                         =                =     .
                                    P (U ∈ (c, d))     P (U ∈ (c, d))   d−c
The conditional CDF is 0 for u ≤ c and 1 for u ≥ d. So the conditional distribution
of U is as claimed.                                                               
Example 5.2.4. Let’s illustrate the above propositions for U ∼ Unif(0, 1). In this
special case, the support has length 1, so probability is length: the probability of U
falling into the interval (0, 0.3) is 0.3, as is the probability of falling into (0.3, 0.6),
(0.4, 0.7), or any other interval of length 0.3 within (0, 1).
Now suppose that we learn that U ∈ (0.4, 0.7). Given this information, the con-
ditional distribution of U is Unif(0.4, 0.7). Then the conditional probability of
U ∈ (0.4, 0.6) is 2/3, since (0.4, 0.6) provides 2/3 of the length of (0.4, 0.7). The
conditional probability of U ∈ (0, 0.6) is also 2/3, since we discard the points to the
left of 0.4 when conditioning on U ∈ (0.4, 0.7).                                     


222                                                              Introduction to Probability

Next, let’s derive the mean and variance of U ∼ Unif(a, b). The expectation is
extremely intuitive: the PDF is constant, so its balancing point should be the mid-
point of (a, b). This is exactly what we find by using the definition of expectation
for continuous r.v.s:
                          Z b                    2       
                                  1         1     b    a2      a+b
                 E(U ) =      x·     dx =            −      =       .
                           a     b−a       b−a 2        2        2

For the variance, we first find E(U 2 ) using the continuous version of LOTUS:
                                    Z b
                            2                   1      1 b3 − a3
                       E(U ) =            x2       dx = ·        .
                                     a         b−a     3 b−a

Then                                                                      2
                                2       1 b3 − a3
                                                2                    a+b
               Var(U ) = E(U ) − (EU ) = ·        −                             ,
                                        3 b−a                         2
which reduces, after factoring b3 −a3 = (b−a)(a2 +ab+b2 ) and simplifying, to

                                                    (b − a)2
                                    Var(U ) =                .
                                                       12
The above derivation isn’t terribly painful, but there is an easier path, using a
technique that is often useful for continuous distributions. The technique is called
location-scale transformation, and it relies on the observation that shifting and scal-
ing a Uniform r.v. produces another Uniform r.v. Shifting is considered a change of
location and scaling is a change of scale, hence the term location-scale. For example,
if X is Uniform on the interval (1, 2), then X + 5 is Uniform on the interval (6, 7),
2X is Uniform on the interval (2, 4), and 2X + 5 is Uniform on (7, 9).
Definition 5.2.5 (Location-scale transformation). Let X be a random variable and
Y = σX + µ, where σ and µ are constants with σ > 0. Then we say that Y has been
obtained as a location-scale transformation of X. Here µ controls how the location
is changed and σ controls how the scale is changed.
h 5.2.6. In a location-scale transformation, starting with X ∼ Unif(a, b) and trans-
forming it to Y = cX + d where c and d are constants with c > 0, Y is a linear
function of X and Uniformity is preserved: Y ∼ Unif(ca + d, cb + d). But if Y is
defined as a nonlinear transformation of X, then Y will not be Uniform in general.
For example, for X ∼ Unif(a, b) with 0 ≤ a < b, the transformed r.v. Y = X 2 has
support (a2 , b2 ) but is not Uniform on that interval. Chapter 8 explores transfor-
mations of r.v.s in detail.
In studying Uniform distributions, a useful strategy is to start with an r.v. that has
the simplest Uniform distribution, figure things out in the friendly simple case, and
then use a location-scale transformation to handle the general case.
Let’s see how this works for finding the expectation and variance of the Unif(a, b)


Continuous random variables                                                            223

distribution. The location-scale strategy says to start with U ∼ Unif(0, 1). Since the
PDF of U is just 1 on the interval (0, 1), it is easy to see that
                                         Z 1
                                                     1
                                E(U ) =      xdx = ,
                                           0         2
                                         Z 1
                                                       1
                               E(U 2 ) =     x2 dx = ,
                                           0           3
                                         1 1        1
                              Var(U ) = − = .
                                         3 4        12

Now that we know the answers for U , transforming U into a general Unif(a, b)
r.v. takes just two steps. First we change the support from an interval of length 1
to an interval of length b − a, so we multiply U by the scaling factor b − a to obtain
a Unif(0, b − a) r.v. Then we shift everything until the left endpoint of the support
is at a. Thus, if U ∼ Unif(0, 1), the random variable

                                 Ũ = a + (b − a)U

is distributed Unif(a, b). Now the mean and variance of Ũ follow directly from
properties of expectation and variance. By linearity of expectation,
                                                              b−a   a+b
        E(Ũ ) = E(a + (b − a)U ) = a + (b − a)E(U ) = a +        =     .
                                                               2     2
By the fact that additive constants don’t affect the variance while multiplicative
constants come out squared,

                                                                          (b − a)2
    Var(Ũ ) = Var(a + (b − a)U ) = Var((b − a)U ) = (b − a)2 Var(U ) =            .
                                                                             12
These agree with our previous answers.
The technique of location-scale transformation will work for any family of distribu-
tions such that shifting and scaling an r.v. whose distribution in the family produces
another r.v. whose distribution is in the family. This technique does not apply to
families of discrete distributions (with a fixed support) since, for example, shifting
or scaling X ∼ Bin(n, p) changes the support and produces an r.v. that is no longer
Binomial. A Binomial r.v. must be able to take on all integer values between 0 and
some upper bound, but X + 4 can’t take on any value in {0, 1, 2, 3} and 2X can
only take even values, so neither of these r.v.s has a Binomial distribution.
h 5.2.7 (Beware of sympathetic magic). When using location-scale transforma-
tions, the shifting and scaling should be applied to the random variables them-
selves, not to their PDFs. To confuse these two would be an instance of sympa-
thetic magic (see h 3.7.7), and would result in invalid PDFs. For example, let
U ∼ Unif(0, 1), so the PDF f has f (x) = 1 on (0, 1) (and f (x) = 0 elsewhere).
Then 3U + 1 ∼ Unif(1, 4), but 3f + 1 is the function that equals 4 on (0, 1) and 1
elsewhere, which is not a valid PDF since it does not integrate to 1.


224                                                            Introduction to Probability




5.3   Universality of the Uniform

In this section, we will discuss a remarkable property of the Uniform distribution:
given a Unif(0, 1) r.v., we can construct an r.v. with any continuous distribution we
want. Conversely, given an r.v. with an arbitrary continuous distribution, we can
create a Unif(0, 1) r.v. We call this the universality of the Uniform, because it tells us
the Uniform is a universal starting point for building r.v.s with other distributions.
Universality of the Uniform also goes by many other names, such as the probability
integral transform, inverse transform sampling, the quantile transformation, and
even the fundamental theorem of simulation.

To keep the proofs simple, we will state universality of the Uniform for a case where
we know the inverse of the desired CDF exists. Similar ideas can be used to simulate
a random draw from any desired CDF as a function of a Unif(0, 1) r.v.

Theorem 5.3.1 (Universality of the Uniform). Let F be a CDF which is a continu-
ous function and strictly increasing on the support of the distribution. This ensures
that the inverse function F −1 exists, as a function from (0, 1) to R. We then have
the following results.

        1. Let U ∼ Unif(0, 1) and X = F −1 (U ). Then X is an r.v. with CDF F .

        2. Let X be an r.v. with CDF F . Then F (X) ∼ Unif(0, 1).

Let’s make sure we understand what each part of the theorem is saying. The first
part says that if we start with U ∼ Unif(0, 1) and a CDF F , then we can create
an r.v. whose CDF is F by plugging U into the inverse CDF F −1 . Since F −1 is a
function (known as the quantile function), U is an r.v., and a function of an r.v. is
an r.v., F −1 (U ) is an r.v.; universality of the Uniform says its CDF is F .

The second part of the theorem goes in the reverse direction, starting from an r.v. X
whose CDF is F and then creating a Unif(0, 1) r.v. Again, F is a function, X is
an r.v., and a function of an r.v. is an r.v., so F (X) is an r.v. Since any CDF is
between 0 and 1 everywhere, F (X) must take values between 0 and 1. Universality
of the Uniform says that the distribution of F (X) is Uniform on (0, 1).

h 5.3.2. The second part of universality of the Uniform involves plugging a random
variable X into its own CDF F . This may seem strangely self-referential, but it
makes sense because F is just a function (that satisfies the properties of a valid
CDF), and a function of an r.v. is an r.v. There is a potential notational confusion,
however: F (x) = P (X ≤ x) by definition, but it would be incorrect to say “F (X) =
P (X ≤ X) = 1”. Rather, we should first find an expression for the CDF as a
function of x, then replace x with X to obtain an r.v. For example, if the CDF of
X is F (x) = 1 − e−x for x > 0, then F (X) = 1 − e−X .


Continuous random variables                                                          225

Understanding the statement of the theorem is the difficult part; the proof is just a
couple of lines for each direction.

Proof.
1. Let U ∼ Unif(0, 1) and X = F −1 (U ). For all real x,

               P (X ≤ x) = P (F −1 (U ) ≤ x) = P (U ≤ F (x)) = F (x),

so the CDF of X is F , as claimed. For the last equality, we used the fact that
P (U ≤ u) = u for u ∈ (0, 1).

2. Let X have CDF F , and find the CDF of Y = F (X). Since Y takes values in
(0, 1), P (Y ≤ y) equals 0 for y ≤ 0 and equals 1 for y ≥ 1. For y ∈ (0, 1),

          P (Y ≤ y) = P (F (X) ≤ y) = P (X ≤ F −1 (y)) = F (F −1 (y)) = y.

Thus Y has the Unif(0, 1) CDF.                                                         

To gain more insight into what the quantile function F −1 and universality of the
Uniform mean, let’s consider an example that is familiar to millions of students:
percentiles on an exam.
Example 5.3.3 (Percentiles). A large number of students take a certain exam,
graded on a scale from 0 to 100. Let X be the score of a random student. Con-
tinuous distributions are easier to deal with here, so let’s approximate the discrete
distribution of scores using a continuous distribution. Suppose that X is continuous,
with a CDF F that is strictly increasing on (0, 100). In reality, there are only finitely
many students and only finitely many possible scores, but a continuous distribution
may be a good approximation.
Suppose that the median score on the exam is 60, i.e., half of the students score
above 60 and the other half score below 60 (a convenient aspect of assuming a
continuous distribution is that we don’t need to worry about how many students
had scores equal to 60). That is, F (60) = 1/2, or, equivalently, F −1 (1/2) = 60.
If Fred scores a 72 on the exam, then his percentile is the fraction of students who
score below a 72. This is F (72), which is some number in (1/2, 1) since 72 is above
the median. In general, a student with score x has percentile F (x). Going the other
way, if we start with a percentile, say 0.95, then F −1 (0.95) is the score that has
that percentile. A percentile is also called a quantile, which is why F −1 is called
the quantile function. The function F converts scores to quantiles, and the function
F −1 converts quantiles to scores.
The strange operation of plugging X into its own CDF now has a natural interpre-
tation: F (X) is the percentile attained by a random student. It often happens that
the distribution of scores on an exam looks very non-Uniform. For example, there
is no reason to think that 10% of the scores are between 70 and 80, even though
(70, 80) covers 10% of the range of possible scores.


226                                                                    Introduction to Probability

On the other hand, the distribution of percentiles of the students is Uniform: the
universality property says that F (X) ∼ Unif(0, 1). For example, 50% of the students
have a percentile of at least 0.5. Universality of the Uniform is expressing the fact
that 10% of the students have a percentile between 0 and 0.1, 10% have a percentile
between 0.1 and 0.2, 10% have a percentile between 0.2 and 0.3, and so on—a fact
that is clear from the definition of percentile.                                   
To illustrate universality of the Uniform, we will apply it to the two distributions
we encountered in the previous section, the Logistic and Rayleigh.
Example 5.3.4 (Universality with Logistic). The Logistic CDF is

                                             ex
                              F (x) =             ,       x ∈ R.
                                           1 + ex
Suppose we have U ∼ Unif(0, 1) and wish to generate a Logistic r.v. Part 1 of the
universality property says that F −1 (U ) ∼ Logistic, so we first invert the CDF to
get F −1 :                                        
                               −1              u
                             F (u) = log              .
                                              1−u
Then we plug in U for u:
                                                             
                                  −1                     U
                              F        (U ) = log                  .
                                                        1−U
                         
                     U
Therefore log        ∼ Logistic.
                    1−U
                                    
                                  U
We can verify directly that log 1−U    has the required CDF: start from the defini-
tion of CDF, do some algebra to isolate U on one side of the inequality, and then use
the CDF of the Uniform distribution. Let’s work through these calculations once
for practice:
                                                          
                               U                    U        x
                   P log             ≤x =P               ≤e
                             1−U                  1−U
                                                = P (U ≤ ex (1 − U ))
                                                                
                                                             ex
                                                =P U ≤
                                                          1 + ex
                                                          ex
                                                =              ,
                                                        1 + ex
which is indeed the Logistic CDF.
We can also use simulation to visualize how universality of the Uniform works. To
this end, we generated 1 million
                                Unif(0,
                                    1) random variables. We then transformed
                                 u
each of these values u into log 1−u ; if the universality of the Uniform is correct,
the transformed numbers should follow a Logistic distribution.
```
