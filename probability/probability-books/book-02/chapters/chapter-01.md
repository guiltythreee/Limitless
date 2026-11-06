# Chapter 1: Probability and Counting

**Book:** Introduction to Probability, Second Edition  
**Authors:** Joseph K. Blitzstein and Jessica Hwang  
**Printed pages:** 1–44

> Source transcription from the supplied textbook PDF. Text extraction preserves the original order and page content as far as the PDF text layer allows. Check mathematical notation and figure references against the source where extraction is ambiguous.

```text
Probability and counting                                                             15

for some c, then we can adjust by dividing by c. For example, if we have exactly
double-counted each possibility, we can divide by 2 to get the correct count. We call
this adjusting for overcounting.
Example 1.4.13 (Committees and teams). Consider a group of four people.
(a) How many ways are there to choose a two-person committee?
(b) How many ways are there to break the people into two teams of two?
Solution:
(a) One way to count the possibilities is by listing them out: labeling the people as
1, 2, 3, 4, the possibilities are 12 , 13 , 14 , 23 , 24 , 34 .
Another approach is to use the multiplication rule with an adjustment for over-
counting. By the multiplication rule, there are 4 ways to choose the first person on
the committee and 3 ways to choose the second person on the committee, but this
counts each possibility twice, since picking 1 and 2 to be on the committee is the
same as picking 2 and 1 to be on the committee. Since we have overcounted by a
factor of 2, the number of possibilities is (4 · 3)/2 = 6.
(b) Here are 3 ways to see that there are 3 ways to form the teams. Labeling the
people as 1, 2, 3, 4, we can directly list out the possibilities: 12 34 , 13 24 , and
 14 23 . Listing out all possibilities would quickly become tedious or infeasible with
more people though. Another approach is to note that it suffices to specify person
1’s teammate (and then the other team is determined). A third way is to use (a)
to see that there are 6 ways to choose one team. This overcounts by a factor of 2,
since picking 1 and 2 to be a team is equivalent to picking 3 and 4 to be a team. So
again the answer is 6/2 = 3.                                                        
A binomial coefficient counts the number of subsets of a certain size for a set, such
as the number of ways to choose a committee of size k from a set of n people. Sets
and subsets are by definition unordered, e.g., {3, 1, 4} = {4, 1, 3}, so we are counting
the number of ways to choose k objects out of n, without replacement and without
distinguishing between the different orders in which they could be chosen.
Definition 1.4.14 (Binomial
                              coefficient). For any nonnegative integers k and n,
                         n
the binomial coefficient k , read as “n choose k”, is the number of subsets of size
k for a set of size n.
                                                                                 
For example, 42 = 6, as shown in Example 1.4.13. The binomial coefficient nk
is sometimes called a combination, but we do not use that terminology here since
“combination” is such a useful general-purpose word. Algebraically, binomial coef-
ficients can be computed as follows.
Theorem 1.4.15 (Binomial coefficient formula). For k ≤ n, we have
                     
                     n    n(n − 1) · · · (n − k + 1)       n!
                        =                            =            .
                     k                k!               (n − k)!k!


16                                                               Introduction to Probability
                      n
                       
For k > n, we have    k    = 0.
                                                                                  
Proof. Let A be a set with |A| = n. Any subset of A has size at most n, so nk = 0
for k > n. Now let k ≤ n. By Theorem 1.4.8, there are n(n − 1) · · · (n − k + 1)
ways to make an ordered choice of k elements without replacement. This overcounts
each subset of interest by a factor of k! (since we don’t care how these elements are
ordered), so we can get the correct count by dividing by k!.                          
                                         
h 1.4.16. The binomial    coefficient nk is often defined in terms of factorials, but
                    n
keep in mind that k is 0 if k > n, even though the factorial of a negative number
is undefined. Also, the middle expression in Theorem 1.4.15 is often better for
computation than the expression with factorials, since factorials grow extremely
fast. For example,             
                                100      100 · 99
                                      =           = 4950
                                  2          2
                                                    
can even be done by hand, whereas computing 100   2   = 100!/(98!·2!) by first calculat-
ing 100! and 98! would be wasteful and possibly dangerous because of the extremely
large numbers involved (100! ≈ 9.33 × 10157 ).
Example 1.4.17 (Club officers). In a club with n people, there are n(n − 1)(n − 2)
ways to choose a president, vice president, and treasurer, and there are
                              
                               n      n(n − 1)(n − 2)
                                   =
                               3             3!
ways to choose 3 officers without predetermined titles.                                  
Example 1.4.18 (Permutations of a word). How many ways are there to permute
the letters in the word LALALAAA? To determine a permutation, we just need to
choose where the 5 A’s go (or, equivalently, just decide where the 3 L’s go). So there
are                     
                       8      8     8·7·6
                         =       =           = 56 permutations.
                       5      3        3!

How many ways are there to permute the letters in the word STATISTICS? Here
are two approaches. We could choose where to put the S’s, then where to put the
T’s (from the remaining positions), then where to put the I’s, then where to put
the A (and then the C is determined). Alternatively, we can start with 10! and then
adjust for overcounting, dividing by 3!3!2! to account for the fact that the S’s can
be permuted among themselves in any way, and likewise for the T’s and I’s. This
gives                
                  10 7 4 2               10!
                                    =         = 50400 possibilities.               
                   3    3 2 1          3!3!2!
Example 1.4.19 (Binomial theorem). The binomial theorem states that
                                          n  
                                          X
                                    n        n
                              (x + y) =             xk y n−k ,
                                                k
                                          k=0


Probability and counting                                                           17

for any nonnegative integer n. To prove the binomial theorem, expand out the
product
                           (x + y)(x + y) . . . (x + y) .
                           |          {z              }
                                      n factors

Just as (a + b)(c + d) = ac + ad + bc + bd is the sum of terms where we pick the a or
the b from the first factor (but not both) and the c or the d from the second factor
(but not both), the terms of (x + y)n are obtained
                                                     by picking either the x or the y
(but not both) from each factor. There are nk ways to choose exactly k of the x’s,
and each such choice yields the term xk y n−k . The binomial theorem follows.       
We can use binomial coefficients to calculate probabilities in many problems for
which the naive definition applies.
Example 1.4.20 (Full house in poker). A 5-card hand is dealt from a standard,
well-shuffled 52-card deck. The hand is called a full house in poker if it consists of
three cards of some rank and two cards of another rank, e.g., three 7’s and two 10’s
(in any order). What is the probability of a full house?
Solution:
             
All of the 52
            5 possible hands are equally likely by symmetry, so the naive definition
is applicable. To find the number of full house hands, use the multiplication rule
(and imagine the tree). There are 13 choices for what rank we have three of; for
concreteness,
              assume we have three 7’s and focus on that branch of the tree. There
are 43 ways to choose which 7’s we have. Then there are 12 choices for what rank
                                                 
we have two of, say 10’s for concreteness, and 42 ways to choose two 10’s. Thus,
                                            
                                  13 43 12 42        3744
                 P (full house) =      52
                                              =           ≈ 0.00144.
                                       5
                                                   2598960

The decimal approximation is more useful when playing poker, but the   answer in
terms of binomial coefficients is exact and self-annotating (seeing 52
                                                                    5 is a much
bigger hint about its origin than seeing 2598960).                             
Example 1.4.21 (Newton-Pepys problem). Isaac Newton was consulted about
the following problem by Samuel Pepys, who wanted the information for gambling
purposes. Which of the following events has the highest probability?
A: At least one 6 appears when 6 fair dice are rolled.

B: At least two 6’s appear when 12 fair dice are rolled.

C: At least three 6’s appear when 18 fair dice are rolled.

Solution:
The three experiments have 66 , 612 , and 618 possible outcomes, respectively, and by
symmetry the naive definition applies in all three experiments.


18                                                           Introduction to Probability

A: Instead of counting the number of ways to obtain at least one 6, it is easier to
count the number of ways to get no 6’s. Getting no 6’s is equivalent to sampling the
numbers 1 through 5 with replacement 6 times, so 56 outcomes are favorable to Ac
(and 66 − 56 are favorable to A). Thus

                                             56
                               P (A) = 1 −      ≈ 0.67.
                                             66

B: Again we count the outcomes
                                  in B c first. There are 512 ways to get no 6’s in
                        12 11
12 die rolls. There are 1 5 ways to get exactly one 6: we first choose which die
lands 6, then sample the numbers 1 through 5 with replacement for the other 11
dice. Adding these, we get the number of ways to fail to obtain at least two 6’s.
Then                                             11
                                      512 + 12 1 5
                         P (B) = 1 −                 ≈ 0.62.
                                            612

C: We count the outcomes in C c , i.e., the number of ways
                                                          17 to get zero, one, or two
6’s in 18 die rolls. There are 518 ways to get no 6’s, 18
                                                        1 5   ways to get exactly one
           
         18 16
6, and 2 5 ways to get exactly two 6’s (choose which two dice will land 6, then
decide how the other 16 dice will land).
                                            17       
                                   518 + 18
                                          1 5 + 2 5
                                                   18 16
                      P (C) = 1 −                         ≈ 0.60.
                                            618
Therefore A has the highest probability.
Newton arrived at the correct answer using similar calculations. Newton also pro-
vided Pepys with an intuitive argument for why A was the most likely of the three;
however, his intuition was invalid. As explained in Stigler [24], using loaded dice
could result in a different ordering of A, B, C, but Newton’s intuitive argument did
not depend on the dice being fair.                                                
In this book, we care about counting not for its own sake, but because it sometimes
helps us to find probabilities. Here is an example of a neat but treacherous counting
problem; the solution is elegant, but it is rare that the result can be used with the
naive definition of probability.
Example 1.4.22 (Bose-Einstein). How many ways are there to choose k times from
a set of n objects with replacement, if order doesn’t matter (we only care about
how many times each object was chosen, not the order in which they were chosen)?
Solution:
When order does matter, the answer is nk by the multiplication rule, but this
problem is much harder. We will solve it by solving an isomorphic problem (the
same problem in a different guise).
Let us find the number of ways to put k indistinguishable particles into n distinguish-
able boxes. That is, swapping the particles in any way is not considered a separate


Probability and counting                                                             19

possibility: all that matters are the counts for how many particles are in each box.
This scenario is known as a Bose-Einstein problem, since the physicists Satyendra
Nath Bose and Albert Einstein studied related problems about indistinguishable
particles in the 1920s, using their ideas to successfully predict the existence of a
strange state of matter known as a Bose-Einstein condensate.
Any configuration can be encoded as a sequence of |’s and l’s in a natural way, as
illustrated in Figure 1.6.




FIGURE 1.6
Bose-Einstein encoding: putting k = 7 indistinguishable particles into n = 4 distin-
guishable boxes can be expressed as a sequence of |’s and l’s, where | denotes a
wall and l denotes a particle.

To be valid, a sequence must start and end with a |, and have exactly n − 1 |’s and
exactly k l’s in between the starting and ending |’s; conversely, any such sequence
is a valid encoding for some configuration of particles in boxes. Imagine that we
have written down the starting and ending |’s, which represent the outer walls, and
in between there are n + k − 1 fill-in-the-blank slots in between the outer walls. We
need only choose where to put the k l’s (since then where the n + k − 1 interior
                                                                              
|’s go is completely determined). So the number of possibilities is n+k−1  k    . This
counting method is sometimes called the stars and bars argument, where here we
have dots in place of stars.
To relate this result back to the original question, we can let each box correspond to
one of the n objects and use the particles as “check marks” to tally how many times
each object is selected. For example, if a certain box contains exactly 3 particles,
that means the object corresponding to that box was chosen exactly 3 times. The
particles being indistinguishable corresponds to the fact that we don’t care about
the order in which
                   the objects are chosen. Thus, the answer to the original question
is also n+k−1
           k     .
Another isomorphic problem is to count the number of solutions (x1 , . . . , xn ) to the
equation x1 + x2 + · · · + xn = k, where the xi are nonnegative integers. This is
equivalent since we can think of xi as the number of particles in the ith box.
h 1.4.23. The Bose-Einstein result should not be used in the naive definition of
probability except in very special circumstances. For example, consider a survey
where a sample of size k is collected by choosing people from a population of size n


20                                                            Introduction to Probability

one at a time, with replacement and with equal probabilities. Then the nk ordered
samples are equally likely, making the naive definition applicable, but the n+k−1
                                                                              k
unordered samples (where all that matters is how many times each person was
sampled) are not equally likely.
As another example, with n = 365 days in a year and k people, how many possible
unordered birthday lists are there? For example, for k = 3, we want to count lists
like (May 1, March 31, April 11), where all permutations are considered equivalent.
We can’t do a simple adjustment for overcounting such as nk /3! since, e.g., there are
6 permutations of (May 1, March 31, April 11) but only 3 permutations of (March
31, March 31, April 11). By Bose-Einstein, the number of lists is n+k−1    k   . But the
ordered birthday lists are equally likely, not the unordered lists, so the Bose-Einstein
value should not be used in calculating birthday probabilities.                       




1.5   Story proofs

A story proof is a proof by interpretation. For counting problems, this often means
counting the same thing in two different ways, rather than doing tedious algebra. A
story proof often avoids messy calculations and goes further than an algebraic proof
toward explaining why the result is true. The word “story” has several meanings,
some more mathematical than others, but a story proof (in the sense in which we’re
using the term) is a fully valid mathematical proof. Here are some examples of story
proofs, which also serve as further examples of counting.
Example 1.5.1 (Choosing the complement). For any nonnegative integers n and
k with k ≤ n, we have                  
                              n       n
                                 =          .
                              k     n−k
This is easy to check algebraically (by writing the binomial coefficients in terms of
factorials), but a story proof makes the result easier to understand intuitively.
Story proof : Consider choosing
                               a committee of size k in a group of n people. We
know that there are nk possibilities. But another way to choose the committee is
to specify which n − k people are not on the committee; specifying who is on the
committee determines who is not on the committee, and vice versa. So the two sides
are equal, as they are two ways of counting the same thing.                     
Example 1.5.2 (The team captain). For any positive integers n and k with k ≤ n,
                                        
                               n−1         n
                           n          =k      .
                               k−1         k

This is again easy to check algebraically (using the fact that m! = m(m − 1)! for
any positive integer m), but a story proof is more insightful.


Probability and counting                                                                  21

Story proof : Consider a group of n people, from which a team of k will be chosen,
one of whom will be the team captain. To specify a possibility, we could first choose
the team captain and then choose the remaining k − 1 team members; this gives
the left-hand side. Equivalently, we could first choose the k team members and then
choose one of them to be captain; this gives the right-hand side.                  
Example 1.5.3 (Vandermonde’s identity). A famous relationship between binomial
coefficients, called Vandermonde’s identity,2 says that
                                           k  
                                             X          
                                 m+n            m    n
                                           =              .
                                  k             j   k−j
                                            j=0

This identity will come up several times in this book. Trying to prove it with a
brute force expansion of all the binomial coefficients would be a nightmare. But a
story proves the result elegantly and makes it clear why the identity holds.
Story proof : Consider a student organization consisting of m juniors and n seniors,
from which a committee of size k will be chosen. There are m+n     k    possibilities.
If there are j juniors in the committee, then there must be k − j seniors in the
committee. The right-hand side of the identity sums up the cases for j.             
Example 1.5.4 (Partnerships). Let’s use a story proof to show that

                           (2n)!
                                   = (2n − 1)(2n − 3) · · · 3 · 1.
                           2n · n!

Story proof : We will show that both sides count the number of ways to break 2n
people into n partnerships. Take 2n people, and give them ID numbers from 1 to
2n. We can form partnerships by lining up the people in some order and then saying
the first two are a pair, the next two are a pair, etc. This overcounts by a factor
of n! · 2n since the order of pairs doesn’t matter, nor does the order within each
pair. Alternatively, count the number of possibilities by noting that there are 2n − 1
choices for the partner of person 1, then 2n − 3 choices for person 2 (or person 3, if
person 2 was already paired to person 1), and so on.                                




1.6    Non-naive definition of probability

We have now seen several methods for counting outcomes in a sample space, allowing
us to calculate probabilities if the naive definition applies. But the naive definition
can only take us so far, since it requires equally likely outcomes and can’t handle
  2
    Vandermonde’s identity is named after the 18th century French mathematician Alexandre-
Théophile Vandermonde, but it was discovered much earlier, and stated in 1303 by the Chinese
mathematician Zhu Shijie.


22                                                                 Introduction to Probability

an infinite sample space. To generalize the notion of probability, we’ll write down
a short wish list of how we want probability to behave (in math, the items on the
wish list are called axioms), and then define a probability function to be something
that satisfies the properties we want!
Here is the general definition of probability that we’ll use for the rest of this book.
It requires just two axioms, but from these axioms it is possible to prove a vast
array of results about probability.
Definition 1.6.1 (General definition of probability). A probability space consists
of a sample space S and a probability function P which takes an event A ⊆ S as
input and returns P (A), a real number between 0 and 1, as output. The function
P must satisfy the following axioms:

        1. P (∅) = 0, P (S) = 1.
        2. If A1 , A2 , . . . are disjoint events, then
                                               
                                          [∞         X∞
                                     P      Aj  =     P (Aj ).
                                       j=1          j=1


       (Saying that these events are disjoint means that they are mutually exclu-
       sive: Ai ∩ Aj = ∅ for i 6= j.)

In Pebble World, the definition says that probability behaves like mass: the mass
of an empty pile of pebbles is 0, the total mass of all the pebbles is 1, and if we
have non-overlapping piles of pebbles, we can get their combined mass by adding
the masses of the individual piles. Unlike in the naive case, we can now have pebbles
of differing masses, and we can also have a countably infinite number of pebbles as
long as their total mass is 1.
We can even have uncountable sample spaces, such as having S be an area in the
plane. In this case, instead of pebbles, we can visualize mud spread out over a region,
where the total mass of the mud is 1.
Any function P (mapping events to numbers in the interval [0, 1]) that satisfies the
two axioms is considered a valid probability function. However, the axioms don’t tell
us how probability should be interpreted ; different schools of thought exist.
The frequentist view of probability is that it represents a long-run frequency over a
large number of repetitions of an experiment: if we say a coin has probability 1/2 of
Heads, that means the coin would land Heads 50% of the time if we tossed it over
and over and over.
The Bayesian view of probability is that it represents a degree of belief about the
event in question, so we can assign probabilities to hypotheses like “candidate A
will win the election” or “the defendant is guilty” even if it isn’t possible to repeat
the same election or the same crime over and over again.


Probability and counting                                                          23

The Bayesian and frequentist perspectives are complementary, and both will be
helpful for developing intuition in later chapters. Regardless of how we choose to
interpret probability, we can use the two axioms to derive other properties of prob-
ability, and these results will hold for any valid probability function.
Theorem 1.6.2 (Properties of probability). Probability has the following proper-
ties, for any events A and B.

         1. P (Ac ) = 1 − P (A).
         2. If A ⊆ B, then P (A) ≤ P (B).
         3. P (A ∪ B) = P (A) + P (B) − P (A ∩ B).

Proof.
1. Since A and Ac are disjoint and their union is S, the second axiom gives

                           P (S) = P (A ∪ Ac ) = P (A) + P (Ac ),

But P (S) = 1 by the first axiom. So P (A) + P (Ac ) = 1.

2. If A ⊆ B, then we can write B as the union of A and B ∩ Ac , where B ∩ Ac is
the part of B not also in A. This is illustrated in the Venn diagram below.

                               S
                                                   B ∩ Ac

                                               A
                                           B



Since A and B ∩ Ac are disjoint, we can apply the second axiom:

                   P (B) = P (A ∪ (B ∩ Ac )) = P (A) + P (B ∩ Ac ).

Probability is nonnegative, so P (B ∩ Ac ) ≥ 0, proving that P (B) ≥ P (A).

3. The intuition for this result can be seen using a Venn diagram like the one below.

                               S


                                           A∩B

                                   A                    B


24                                                           Introduction to Probability

The shaded region represents A∪B, but the probability of this region is not the sum
P (A) + P (B), because that would count the football-shaped region A ∩ B twice. To
correct for this, we subtract P (A ∩ B). This is a useful intuition, but not a proof.
For a proof using the axioms of probability, we can write A ∪ B as the union of the
disjoint events A and B ∩ Ac . Then by the second axiom,

                P (A ∪ B) = P (A ∪ (B ∩ Ac )) = P (A) + P (B ∩ Ac ).

So it suffices to show that P (B ∩ Ac ) = P (B) − P (A ∩ B). Since A ∩ B and B ∩ Ac
are disjoint and their union is B, another application of the second axiom gives us

                          P (A ∩ B) + P (B ∩ Ac ) = P (B).

So P (B ∩ Ac ) = P (B) − P (A ∩ B), as desired.                                      

The third property is a special case of inclusion-exclusion, a formula for finding the
probability of a union of events when the events are not necessarily disjoint. We
showed above that for two events A and B,

                      P (A ∪ B) = P (A) + P (B) − P (A ∩ B).

For three events, inclusion-exclusion says

               P (A ∪ B ∪ C) = P (A) + P (B) + P (C)
                                − P (A ∩ B) − P (A ∩ C) − P (B ∩ C)
                                + P (A ∩ B ∩ C).

For intuition, consider a triple Venn diagram like the one below.

                               A                     B




                                   C


To get the total area of the shaded region A ∪ B ∪ C, we start by adding the areas
of the three circles, P (A) + P (B) + P (C). The three football-shaped regions have
each been counted twice, so we then subtract P (A ∩ B) + P (A ∩ C) + P (B ∩ C).
Finally, the region in the center has been added three times and subtracted three
times, so in order to count it exactly once, we must add it back again. This ensures
that each region of the diagram has been counted once and exactly once.
Now we can write inclusion-exclusion for n events.


Probability and counting                                                                                25

Theorem 1.6.3 (Inclusion-exclusion). For any events A1 , . . . , An ,

      n
                 !
      [                  X               X                        X
  P         Ai       =       P (Ai ) −         P (Ai ∩ Aj ) +             P (Ai ∩ Aj ∩ Ak ) − . . .
      i=1                i               i<j                      i<j<k

                                                                          + (−1)n+1 P (A1 ∩ · · · ∩ An ).


This formula can be proven by induction using just the axioms, but instead we’ll
present a shorter proof in Chapter 4 after introducing some additional tools. The
rationale behind the alternating addition and subtraction in the general formula is
analogous to the special cases we’ve already considered.
The next example, de Montmort’s matching problem, is a famous application of
inclusion-exclusion. Pierre Rémond de Montmort was a French mathematician who
studied probability in the context of gambling and wrote a treatise [19] devoted to
the analysis of various card games. He posed the following problem in 1708, based
on a card game called Treize.
Example 1.6.4 (de Montmort’s matching problem). Consider a well-shuffled deck
of n cards, labeled 1 through n. You flip over the cards one by one, saying the
numbers 1 through n as you do so. You win the game if, at some point, the number
you say aloud is the same as the number on the card being flipped over (for example,
if the 7th card in the deck has the label 7). What is the probability of winning?
Solution:
Let Ai be the event that the ith card in the deck has the number i written on it.
We are interested in the probability of the union A1 ∪ · · · ∪ An : as long as at least
one of the cards has a number matching its position in the deck, you will win the
game. (An ordering for which you lose is called a derangement, though hopefully no
one has ever become deranged due to losing at this game.)
To find the probability of the union, we’ll use inclusion-exclusion. First,

                                                              1
                                                  P (Ai ) =
                                                              n
for all i. One way to see this is with the naive definition of probability, using the
full sample space: there are n! possible orderings of the deck, all equally likely, and
(n−1)! of these are favorable to Ai (fix the card numbered i to be in the ith position
in the deck, and then the remaining n − 1 cards can be in any order). Another way
to see this is by symmetry: the card numbered i is equally likely to be in any of the
n positions in the deck, so it has probability 1/n of being in the ith spot. Second,

                                                    (n − 2)!      1
                                P (Ai ∩ Aj ) =               =          ,
                                                       n!      n(n − 1)

since we require the cards numbered i and j to be in the ith and jth spots in the


26                                                            Introduction to Probability

deck and allow the remaining n − 2 cards to be in any order, so (n − 2)! out of n!
possibilities are favorable to Ai ∩ Aj . Similarly,

                                                     1
                        P (Ai ∩ Aj ∩ Ak ) =                   ,
                                              n(n − 1)(n − 2)

and the pattern continues for intersections of 4 events, etc.
                                                                                
In the inclusion-exclusion formula, there are n terms involving one event, n2 terms
involving two events, n3 terms involving three events, and so forth. By the sym-
metry of the problem, all n terms of the form P (Ai ) are equal, all n2 terms of the
form P (Ai ∩ Aj ) are equal, and the whole expression simplifies considerably:
             n
                  !                              
            [          n
                                n               n
                                                                             1
        P       Ai = −          2
                                      +         3
                                                         − · · · + (−1)n+1 ·
                       n n(n − 1) n(n − 1)(n − 2)                            n!
            i=1
                           1  1                   1
                    =1−      + − · · · + (−1)n+1 · .
                           2! 3!                  n!
Comparing this to the Taylor series for 1/e (see Section A.8 of the math appendix),
                                        1  1  1
                            e−1 = 1 −     + − + ...,
                                        1! 2! 3!
we see that for large n, the probability of winning the game is extremely close
to 1 − 1/e, or about 0.63. Interestingly, as n grows, the probability of winning
approaches 1 − 1/e instead of going to 0 or 1. With a lot of cards in the deck, the
number of possible locations for matching cards increases while the probability of
any particular match decreases, and these two forces offset each other and balance
to give a probability of about 1 − 1/e.                                          
Inclusion-exclusion is a very general formula for the probability of a union of events,
but it helps us the most when there is symmetry among the events Aj ; otherwise
the sum can be extremely tedious. In general, when symmetry is lacking, we should
try to use other tools before turning to inclusion-exclusion as a last resort.




1.7   Recap

Probability allows us to quantify uncertainty and randomness in a principled way.
Probabilities arise when we perform an experiment: the set of all possible outcomes
of the experiment is called the sample space, and a subset of the sample space
is called an event. It is useful to be able to go back and forth between describing
events in English and writing them down mathematically as sets (often using unions,
intersections, and complements).


Probability and counting                                                                               27

Pebble World can help us visualize sample spaces and events when the sample space
is finite. In Pebble World, each outcome is a pebble, and an event is a set of pebbles.
If all the pebbles have the same mass (i.e., are equally likely), we can apply the naive
definition of probability, which lets us calculate probabilities by counting.
To this end, we discussed several tools for counting. When counting the number of
possibilities, we often use the multiplication rule. For example, there are n! permu-
tations of the numbers 1, 2, . . . , n and there are 2n subsets of a set with n elements.
If we can’t directly use the multiplication rule, we can sometimes count each pos-
sibility exactly c times for some c, and then divide by c to get the actual number
of possibilities. For example, this strategy is useful for finding an expression for
binomial coefficients in terms of factorials.
An important pitfall to avoid is misapplying the naive definition of probability,
implicitly or explicitly assuming equally likely outcomes without justification. One
technique to help avoid this is to give objects labels, for precision and so that we are
not tempted to treat them as indistinguishable.
Moving beyond the naive definition, we define probability to be a function that
takes an event and assigns to it a real number between 0 and 1. We require a valid
probability function to satisfy two axioms:
1. P (∅) = 0, P (S) = 1.
2. If A1 , A2 , . . . are disjoint events, then
                                             
                                       [∞       ∞
                                                X
                                   P         
                                           Aj =   P (Aj ).
                                                j=1         j=1


Many useful properties can be derived from these axioms. For example,

                                                P (Ac ) = 1 − P (A)

for any event A, and we have the inclusion-exclusion formula

      n
                 !
      [                  X                X                       X
  P         Ai       =        P (Ai ) −         P (Ai ∩ Aj ) +           P (Ai ∩ Aj ∩ Ak ) − . . .
      i=1                i                i<j                    i<j<k

                                                                          + (−1)n+1 P (A1 ∩ · · · ∩ An )

for any events A1 , . . . , An . For n = 2, this is the much nicer-looking result

                             P (A1 ∪ A2 ) = P (A1 ) + P (A2 ) − P (A1 ∩ A2 ).

Figure 1.7 illustrates how a probability function maps events to numbers between
0 and 1. We’ll add many new concepts to this diagram as we continue our journey
through the field of probability.


28                                                           Introduction to Probability




             What can
             happen?

                 events                                  numbers
                    A                                        P(A)
                 not A                              P(A ) = 1 – P(A)
                                                         c
                                     P
               A and B                                  P(A⋂B)
                A or B                       P(A⋃B) = P(A) + P(B) – P(A⋂B)
          something happened                           P(S) = 1

FIGURE 1.7
It is important to distinguish between events and probabilities. The former are sets,
while the latter are numbers. Before the experiment is done, we generally don’t know
whether or not a particular event will occur (happen). So we assign it a probability
of happening, using a probability function P . We can use set operations to define
new events in terms of old events, and the properties of probabilities to relate the
probabilities of the new events to those of the old events.


Probability and counting                                                             29




1.8   R

R is a very powerful, popular environment for statistical computing and graphics,
freely available for Mac OS X, Windows, and UNIX systems. Knowing how to use R
is an extremely useful skill. R and various supporting information can be obtained
at https://www.r-project.org. RStudio is an excellent alternative interface for
R, freely available at https://www.rstudio.com.
In the R section at the end of each chapter, we provide R code to let you try out
some of the examples from the chapter, especially via simulation. These sections
are not intended to be a full introduction to R; many R tutorials are available
for free online, and many books on R are available. But the R sections show how
to implement various simulations, computations, and visualizations that naturally
accompany the material from each chapter. The R code at the end of each chapter
is also available at http://stat110.net.


Vectors

R is built around vectors, and getting familiar with “vectorized thinking” is very
important for using R effectively. To create a vector, we can use the c command
(which stands for combine or concatenate). For example,
v <- c(3,1,4,1,5,9)
defines v to be the vector (3, 1, 4, 1, 5, 9). (The left arrow <- is typed as < followed
by -. The symbol = can be used instead, but the arrow is more suggestive of the fact
that the variable on the left is being set equal to the value on the right.) Similarly,
n <- 110 sets n equal to 110; R views n as a vector of length 1.
sum(v)
adds up the entries of v, max(v) gives the largest value, min(v) gives the smallest
value, and length(v) gives the length.
A shortcut for getting the vector (1, 2, . . . , n) is to type 1:n; more generally, if m
and n are integers then m:n gives the sequence of integers from m to n (in increasing
order if m ≤ n and in decreasing order otherwise).
To access the ith entry of a vector v, use v[i]. We can also get subvectors eas-
ily:
v[c(1,3,5)]
gives the vector consisting of the 1st, 3rd, and 5th entries of v. It’s also possible to
get a subvector by specifying what to exclude, using a minus sign:
v[-(2:4)]


30                                                                    Introduction to Probability

gives the vector obtained by removing the 2nd through 4th entries of v (the paren-
theses are needed since -2:4 would be (−2, −1, . . . , 4)).

Many operations in R are interpreted componentwise. For example, in math the
cube of a vector doesn’t have a standard definition, but in R typing v^3 simply
cubes each entry individually. Similarly,

1/(1:100)^2

is a very compact way to get the vector (1, 212 , 312 , . . . , 100
                                                                 1
                                                                   2 ).



In math, v + w is undefined if v and w are vectors of different lengths, but in R the
shorter vector gets “recycled”! For example, v+3 adds 3 to each entry of v.


Factorials and binomial coefficients
                                                  
We can compute n! using factorial(n) and nk using choose(n,k). As we have
seen, factorials grow extremely quickly. What is the largest n for which R returns a
number for factorial(n)? Beyond that point, R will return Inf (infinity), with a
warning message. But it may still be possible to use lfactorial(n) for larger
                                                                             values
of n, which computes log(n!). Similarly, lchoose(n,k) computes log nk .


Sampling and simulation

The sample command is a useful way of drawing random samples in R. (Techni-
cally, they are pseudo-random since there is an underlying deterministic algorithm,
but they “look like” random samples for almost all practical purposes.) For exam-
ple,

n <- 10; k <- 5
sample(n,k)

generates an ordered random sample of 5 of the numbers from 1 to 10, without
replacement, and with equal probabilities given to each number. To sample with
replacement instead, just add in replace = TRUE:

n <- 10; k <- 5
sample(n,k,replace=TRUE)

To generate a random permutation of 1, 2, . . . , n we can use sample(n,n), which
because of R’s default settings can be abbreviated to sample(n).

We can also use sample to draw from a non-numeric vector. For example, letters is
built into R as the vector consisting of the 26 lowercase letters of the English alpha-
bet, and sample(letters,7) will generate a random 7-letter “word” by sampling
from the alphabet, without replacement.


Probability and counting                                                          31

The sample command also allows us to specify general probabilities for sampling
each number. For example,

sample(4, 3, replace=TRUE, prob=c(0.1,0.2,0.3,0.4))

samples three numbers between 1 and 4, with replacement, and with probabilities
given by (0.1, 0.2, 0.3, 0.4). If the sampling is without replacement, then at each
stage the probability of any not-yet-chosen number is proportional to its original
probability.

Generating many random samples allows us to perform a simulation for a proba-
bility problem. The replicate command, which is explained below, is a convenient
way to do this.


Matching problem simulation

Let’s show by simulation that the probability of a matching card in Example 1.6.4 is
approximately 1 − 1/e when the deck is sufficiently large. Using R, we can perform
the experiment a bunch of times and see how many times we encounter at least one
matching card:

n <- 100
r <- replicate(10^4,sum(sample(n)==(1:n)))
sum(r>=1)/10^4

In the first line, we choose how many cards are in the deck (here, 100 cards). In the
second line, let’s work from the inside out:

• sample(n)==(1:n) is a vector of length n, the ith element of which equals 1 if the
  ith card matches its position in the deck and 0 otherwise. That’s because for two
  numbers a and b, the expression a==b is TRUE if a = b and FALSE otherwise,
  and TRUE is encoded as 1 and FALSE is encoded as 0.

• sum adds up the elements of the vector, giving us the number of matching cards
  in this run of the experiment.

• replicate does this 104 times. We store the results in r, a vector of length 104
  containing the numbers of matched cards from each run of the experiment.

In the last line, we add up the number of times where there was at least one matching
card, and we divide by the number of simulations.

To explain what the code is doing within the code rather than in separate documen-
tation, we can add comments using the # symbol to mark the start of a comment.
Comments are ignored by R but can make the code much easier to understand for
the reader (who could be you—even if you will be the only one using your code, it
is often hard to remember what everything means and how the code is supposed to
work when looking at it a month after writing it). Short comments can be on the


32                                                         Introduction to Probability

same line as the corresponding code; longer comments should be on separate lines.
For example, a commented version of the above simulation is:

n <- 100                                             # number of cards
r <- replicate(10^4,sum(sample(n)==(1:n)))           # shuffle; count matches
sum(r>=1)/10^4                                       # proportion with a match

What did you get when you ran the code? We got 0.63, which is quite close to
1 − 1/e.


Birthday problem calculation and simulation

The following code uses prod (which gives the product of a vector) to calculate the
probability of at least one birthday match in a group of 23 people:

k <- 23
1-prod((365-k+1):365)/365^k

Better yet, R has built-in functions, pbirthday and qbirthday, for the birthday
problem! pbirthday(k) returns the probability of at least one match if the room
has k people. qbirthday(p) returns the number of people needed in order to have
probability p of at least one match. For example, pbirthday(23) is 0.507 and
qbirthday(0.5) is 23.

We can also find the probability of having at least one triple birthday match, i.e.,
three people with the same birthday; all we have to do is add coincident=3 to
say we’re looking for triple matches. For example, pbirthday(23,coincident=3)
returns 0.014, so 23 people give us only a 1.4% chance of a triple birthday match.
qbirthday(0.5,coincident=3) returns 88, so we’d need 88 people to have at least
a 50% chance of at least one triple birthday match.

To simulate the birthday problem, we can use

b <- sample(1:365,23,replace=TRUE)
tabulate(b)

to generate random birthdays for 23 people and then tabulate the counts of how
many people were born on each day (the command table(b) creates a prettier
table, but is slower). We can run 104 repetitions as follows:

r <- replicate(10^4, max(tabulate(sample(1:365,23,replace=TRUE))))
sum(r>=2)/10^4

If the probabilities of various days are not all equal, the calculation becomes much
more difficult, but the simulation can easily be extended since sample allows us to
specify the probability of each day (by default sample assigns equal probabilities,
so in the above the probability is 1/365 for each day).


Probability and counting                                                                            33




1.9     Exercises

Exercises marked with s have detailed solutions at http://stat110.net.


        Counting
   1.   How many ways are there to permute the letters in the word MISSISSIPPI?
   2.   (a) How many 7-digit phone numbers are possible, assuming that the first digit can’t
        be a 0 or a 1?

        (b) Re-solve (a), except now assume also that the phone number is not allowed to start
        with 911 (since this is reserved for emergency use, and it would not be desirable for the
        system to wait to see whether more digits were going to be dialed after someone has
        dialed 911).
   3.   Fred is planning to go out to dinner each night of a certain week, Monday through
        Friday, with each dinner being at one of his ten favorite restaurants.

        (a) How many possibilities are there for Fred’s schedule of dinners for that Monday
        through Friday, if Fred is not willing to eat at the same restaurant more than once?

        (b) How many possibilities are there for Fred’s schedule of dinners for that Monday
        through Friday, if Fred is willing to eat at the same restaurant more than once, but is
        not willing to eat at the same place twice in a row (or more)?
   4.   A round-robin tournament is being held with n tennis players; this means that every
        player will play against every other player exactly once.

        (a) How many possible outcomes are there for the tournament (the outcome lists out
        who won and who lost for each game)?

        (b) How many games are played in total?
   5.   A knock-out tournament is being held with 2n tennis players. This means that for each
        round, the winners move on to the next round and the losers are eliminated, until only
        one person remains. For example, if initially there are 24 = 16 players, then there are
        8 games in the first round, then the 8 winners move on to round 2, then the 4 winners
        move on to round 3, then the 2 winners move on to round 4, the winner of which is
        declared the winner of the tournament. (There are various systems for determining who
        plays whom within a round, but these do not matter for this problem.)

        (a) How many rounds are there?

        (b) Count how many games in total are played, by adding up the numbers of games
        played in each round.

        (c) Count how many games in total are played, this time by directly thinking about it
        without doing almost any calculation.
        Hint: How many players need to be eliminated?
   6.   There are 20 people at a chess club on a certain day. They each find opponents and
        start playing. How many possibilities are there for how they are matched up, assuming
        that in each game it does matter who has the white pieces (in a chess game, one player
        has the white pieces and the other player has the black pieces)?


34                                                                       Introduction to Probability

      7.   Two chess players, A and B, are going to play 7 games. Each game has three possible
           outcomes: a win for A (which is a loss for B), a draw (tie), and a loss for A (which is
           a win for B). A win is worth 1 point, a draw is worth 0.5 points, and a loss is worth 0
           points.
           (a) How many possible outcomes for the individual games are there, such that overall
           player A ends up with 3 wins, 2 draws, and 2 losses?
           (b) How many possible outcomes for the individual games are there, such that A ends
           up with 4 points and B ends up with 3 points?
           (c) Now assume that they are playing a best-of-7 match, where the match will end
           when either player has 4 points or when 7 games have been played, whichever is first.
           For example, if after 6 games the score is 4 to 2 in favor of A, then A wins the match
           and they don’t play a 7th game. How many possible outcomes for the individual games
           are there, such that the match lasts for 7 games and A wins by a score of 4 to 3?
      8.    s (a) How many ways are there to split a dozen people into 3 teams, where one team
           has 2 people, and the other two teams have 5 people each?
           (b) How many ways are there to split a dozen people into 3 teams, where each team has
           4 people?
      9.    s (a) How many paths are there from the point (0, 0) to the point (110, 111) in the
           plane such that each step either consists of going one unit up or one unit to the right?
           (b) How many paths are there from (0, 0) to (210, 211), where each step consists of going
           one unit up or one unit to the right, and the path has to go through (110, 111)?
     10.   To fulfill the requirements for a certain degree, a student can choose to take any 7 out
           of a list of 20 courses, with the constraint that at least 1 of the 7 courses must be a
           statistics course. Suppose that 5 of the 20 courses are statistics courses.
           (a) How many choices are there for which 7 courses to take?
           (b) Explain intuitively why the answer to (a) is not 51 · 19
                                                                      
                                                                     6
                                                                        .
     11.   Let A and B be sets with |A| = n, |B| = m.
           (a) How many functions are there from A to B (i.e., functions with domain A, assigning
           an element of B to each element of A)?
           (b) How many one-to-one functions are there from A to B? (See Section A.2.1 of the
           math appendix for information about one-to-one functions.)
     12.   Four players, named A, B, C, and D, are playing a card game. A standard, well-shuffled
           deck of cards is dealt to the players (so each player receives a 13-card hand).
           (a) How many possibilities are there for the hand that player A will get? (Within a
           hand, the order in which cards were received doesn’t matter.)
           (b) How many possibilities are there overall for what hands everyone will get, assuming
           that it matters which player gets which hand, but not the order of cards within a hand?
           (c) Explain intuitively why the answer to Part (b) is not the fourth power of the answer
           to Part (a).
     13.   A certain casino uses 10 standard decks of cards mixed together into one big deck, which
           we will call a superdeck. Thus, the superdeck has 52 · 10 = 520 cards, with 10 copies
           of each card. How many different 10-card hands can be dealt from the superdeck? The
           order of the cards does not matter, nor does it matter which of the original 10 decks
           the cards came from. Express your answer as a binomial coefficient.
           Hint: Bose-Einstein.
     14.   You are ordering two pizzas. A pizza can be small, medium, large, or extra large, with
           any combination of 8 possible toppings (getting no toppings is allowed, as is getting all
           8). How many possibilities are there for your two pizzas?


Probability and counting                                                                             35

        Story proofs
                                       Pn          n
                                                           = 2n .
                                                       
  15.   s Give a story proof that        k=0       k

  16.   s Show that for all positive integers n and k with n ≥ k,
                                         !         !           !
                                       n        n         n+1
                                           +          =         ,
                                       k       k−1          k

        doing this in two ways: (a) algebraically and (b) with a story, giving an interpretation
        for why both sides count the same thing.
        Hint for the story proof: Imagine an organization consisting of n + 1 people, with one
        of them pre-designated as the president of the organization.
  17.   Give a story proof that
                                               n
                                                   !2                     !
                                               X n                      2n
                                                      =                    ,
                                                 k                      n
                                               k=0

        for all positive integers n.
  18.   Give a story proof that
                                             n
                                                       !2           !
                                             X       n       2n − 1
                                                   k      =n         ,
                                                     k        n−1
                                             k=1

        for all positive integers n.

        Hint: Consider choosing a committee of size n from two groups of size n each, where
        only one of the two groups has people eligible to become the chair of the committee.
  19.   Give a story proof that
                                       n
                                               !                    !           !
                                       X k                 n−k+2            n+3
                                                                        =         ,
                                         2                   2               5
                                       k=2

        for all integers n ≥ 2.
        Hint: Consider the middle number in a subset of {1, 2, . . . , n + 3} of size 5.
  20.   s (a) Show using a story proof that
                          !          !          !                                !         !
                        k       k+1         k+2                                n       n+1
                            +           +         + ··· +                          =        ,
                        k         k          k                                 k       k+1

        where n and k are positive integers with n ≥ k. This is called the hockey stick identity.
        Hint: Imagine arranging a group of people by age, and then think about the oldest
        person in a chosen subgroup.

        (b) Suppose that a large pack of Haribo gummi bears can have anywhere between 30
        and 50 gummi bears. There are 5 delicious flavors: pineapple (clear), raspberry (red),
        orange (orange), strawberry (green, mysteriously), and lemon (yellow). There are 0 non-
        delicious flavors. How many possibilities are there for the composition of such a pack of
        gummi bears? You can leave your answer in terms of a couple binomial coefficients, but
        not a sum of lots of binomial coefficients.
        Define nk as the number of ways to partition {1, 2, . . . , n} into k nonempty subsets, or
                
  21.
        the number of ways to have n students    split up into k groups such that each group has
        at least one student. For example, 42 = 7 because we have the following possibilities.
                                            


36                                                                              Introduction to Probability

                 • {1}, {2, 3, 4}                                 • {1, 2}, {3, 4}
                 • {2}, {1, 3, 4}
                                                                  • {1, 3}, {2, 4}
                 • {3}, {1, 2, 4}
                 • {4}, {1, 2, 3}                                 • {1, 4}, {2, 3}

           Prove the following identities:
           (a)                           (    ) (    )    ( )
                                          n+1     n        n
                                               =       +k     .
                                           k     k−1       k
           Hint: I’m either in a group by myself or I’m not.

           (b)                                   !( ) (     )
                                             n
                                             X n   j   n+1
                                                     =        .
                                               j   k    k+1
                                             j=k

           Hint: First decide how many people are not going to be in my group.
     22.   The Dutch mathematician R.J. Stroeker remarked:
           Every beginning student of number theory surely must have marveled at the miraculous
           fact that for each natural number n the sum of the first n positive consecutive cubes is
           a perfect square. [26]
           Furthermore, it is the square of the sum of the first n positive integers! That is,

                                     13 + 23 + · · · + n3 = (1 + 2 + · · · + n)2 .

           Usually this identity is proven by induction, but that does not give much insight into
           why the result is true, nor does it help much if we wanted to compute the left-hand side
           but didn’t already know this result. In this problem, you will give a story proof of the
           identity.

           (a) Give a story proof of the identity
                                                                      !
                                                                  n+1
                                           1 + 2 + ··· + n =            .
                                                                   2

           Hint: Consider a round-robin tournament (see Exercise 4).

           (b) Give a story proof of the identity
                                                             !              !            !
                                                       n+1            n+1            n+1
                            13 + 23 + · · · + n3 = 6             +6             +         .
                                                        4              3              2

           It is then just basic algebra (not required for this problem) to check that the square of
           the right-hand side in (a) is the right-hand side in (b).
           Hint: Imagine choosing a number between 1 and n and then choosing 3 numbers between
           0 and n smaller than the original number, with replacement. Then consider cases based
           on how many distinct numbers were chosen.


           Naive definition of probability
     23.   Three people get into an empty elevator at the first floor of a building that has 10
           floors. Each presses the button for their desired floor (unless one of the others has
           already pressed that button). Assume that they are equally likely to want to go to
           floors 2 through 10 (independently of each other). What is the probability that the
           buttons for 3 consecutive floors are pressed?


Probability and counting                                                                               37

  24.    s A certain family has 6 children, consisting of 3 boys and 3 girls. Assuming that all
        birth orders are equally likely, what is the probability that the 3 eldest children are the
        3 girls?
  25.    s A city with 6 districts has 6 robberies in a particular week. Assume the robberies are
        located randomly, with all possibilities for which robbery occurred where equally likely.
        What is the probability that some district had more than 1 robbery?
  26.   A survey is being conducted in a city with 1 million residents. It would be far too
        expensive to survey all of the residents, so a random sample of size 1000 is chosen
        (in practice, there are many challenges with sampling, such as obtaining a complete
        list of everyone in the city, and dealing with people who refuse to participate). The
        survey is conducted by choosing people one at a time, with replacement and with equal
        probabilities.
        (a) Explain how sampling with vs. without replacement here relates to the birthday
        problem.
        (b) Find the probability that at least one person will get chosen more than once.
  27.   A hash table is a commonly used data structure in computer science, allowing for fast
        information retrieval. For example, suppose we want to store some people’s phone num-
        bers. Assume that no two of the people have the same name. For each name x, a hash
        function h is used, letting h(x) be the location that will be used to store x’s phone
        number. After such a table has been computed, to look up x’s phone number one just
        recomputes h(x) and then looks up what is stored in that location.
        The hash function h is deterministic, since we don’t want to get different results every
        time we compute h(x). But h is often chosen to be pseudorandom. For this problem,
        assume that true randomness is used. Let there be k people, with each person’s phone
        number stored in a random location (with equal probabilities for each location, inde-
        pendently of where the other people’s numbers are stored), represented by an integer
        between 1 and n. Find the probability that at least one location has more than one
        phone number stored there.
  28.    s A college has 10 time slots for its courses, and blithely assigns courses to completely
        random time slots, independently. The college offers exactly 3 statistics courses. What
        is the probability that 2 or more of the statistics courses are in the same time slot?
  29.    s For each part, decide whether the blank should be filled in with =, <, or >, and give
        a clear explanation.

        (a) (probability that the total after rolling 4 fair dice is 21)      (probability that the
        total after rolling 4 fair dice is 22)

        (b) (probability that a random 2-letter word is a palindrome3 )          (probability that a
        random 3-letter word is a palindrome)
  30.   With definitions as in the previous problem, find the probability that a random n-letter
        word is a palindrome for n = 7 and for n = 8.
  31.    s Elk dwell in a certain forest. There are N elk, of which a simple randomsample of
        size n are captured and tagged (“simple random sample” means that all N      n
                                                                                        sets of n
        elk are equally likely). The captured elk are returned to the population, and then a new
        sample is drawn, this time with size m. This is an important method that is widely used
        in ecology, known as capture-recapture. What is the probability that exactly k of the m
   3
    A palindrome is an expression such as “A man, a plan, a canal: Panama” that reads the same
backwards as forwards (ignoring spaces, capitalization, and punctuation). Assume for this problem
that all words of the specified length are equally likely, that there are no spaces or punctuation,
and that the alphabet consists of the lowercase letters a, b, . . . , z. A word is any string of letters
from the alphabet; it does not need to be a word that has a meaning in the English language.


38                                                                         Introduction to Probability

           elk in the new sample were previously tagged? (Assume that an elk that was captured
           before doesn’t become more or less likely to be captured again.)
     32.   Four cards are face down on a table. You are told that two are red and two are black, and
           you need to guess which two are red and which two are black. You do this by pointing
           to the two cards you’re guessing are red (and then implicitly you’re guessing that the
           other two are black). Assume that all configurations are equally likely, and that you do
           not have psychic powers. Find the probability that exactly j of your guesses are correct,
           for j = 0, 1, 2, 3, 4.
     33.    s A jar contains r red balls and g green balls, where r and g are fixed positive integers.
           A ball is drawn from the jar randomly (with all possibilities equally likely), and then a
           second ball is drawn randomly.
           (a) Explain intuitively why the probability of the second ball being green is the same
           as the probability of the first ball being green.
           (b) Define notation for the sample space of the problem, and use this to compute the
           probabilities from (a) and show that they are the same.
           (c) Suppose that there are 16 balls in total, and that the probability that the two balls
           are the same color is the same as the probability that they are different colors. What
           are r and g (list all possibilities)?
     34.    s A random 5-card poker hand is dealt from a standard deck of cards. Find the prob-
           ability of each of the following possibilities (in terms of binomial coefficients).
           (a) A flush (all 5 cards being of the same suit; do not count a royal flush, which is a
           flush with an ace, king, queen, jack, and 10).
           (b) Two pair (e.g., two 3’s, two 7’s, and an ace).
     35.   A random 13-card hand is dealt from a standard deck of cards. What is the probability
           that the hand contains at least 3 cards of every suit?
     36.   A group of 30 dice are thrown. What is the probability that 5 of each of the values
           1, 2, 3, 4, 5, 6 appear?
     37.   A deck of cards is shuffled well. The cards are dealt one by one, until the first time an
           ace appears.
           (a) Find the probability that no kings, queens, or jacks appear before the first ace.
           (b) Find the probability that exactly one king, exactly one queen, and exactly one jack
           appear (in any order) before the first ace.
     38.   Tyrion, Cersei, and ten other people are sitting at a round table, with their seating
           arrangement having been randomly assigned. What is the probability that Tyrion and
           Cersei are sitting next to each other? Find this in two ways:
           (a) using a sample space of size 12!, where an outcome is fully detailed about the seating;
           (b) using a much smaller sample space, which focuses on Tyrion and Cersei.
     39.   An organization with 2n people consists of n married couples. A committee of size k is
           selected, with all possibilities equally likely. Find the probability that there are exactly
           j married couples within the committee.
     40.   There are n balls in a jar, labeled with the numbers 1, 2, . . . , n. A total of k balls are
           drawn, one by one with replacement, to obtain a sequence of numbers.
           (a) What is the probability that the sequence obtained is strictly increasing?
           (b) What is the probability that the sequence obtained is increasing (but not necessarily
           strictly increasing, i.e., there can be repetitions)?


Probability and counting                                                                               39

  41.   Each of n balls is independently placed into one of n boxes, with all boxes equally likely.
        What is the probability that exactly one box is empty?
  42.    s A norepeatword is a sequence of at least one (and possibly all) of the usual 26 letters
        a,b,c,. . . ,z, with repetitions not allowed. For example, “course” is a norepeatword, but
        “statistics” is not. Order matters, e.g., “course” is not the same as “source”.
        A norepeatword is chosen randomly, with all norepeatwords equally likely. Show that
        the probability that it uses all 26 letters is very close to 1/e.


        Axioms of probability
  43.   Show that for any events A and B,

                      P (A) + P (B) − 1 ≤ P (A ∩ B) ≤ P (A ∪ B) ≤ P (A) + P (B).

        For each of these three inequalities, give a simple criterion for when the inequality is
        actually an equality (e.g., give a simple condition such that P (A ∩ B) = P (A ∪ B) if
        and only if the condition holds).
  44.   Let A and B be events. The difference B − A is defined to be the set of all elements of
        B that are not in A. Show that if A ⊆ B, then

                                       P (B − A) = P (B) − P (A),

        directly using the axioms of probability.
  45.   Let A and B be events. The symmetric difference A4B is defined to be the set of all
        elements that are in A or B but not both. In logic and engineering, this event is also
        called the XOR (exclusive or ) of A and B. Show that

                                P (A4B) = P (A) + P (B) − 2P (A ∩ B),

        directly using the axioms of probability.
  46.   Let A1 , A2 , . . . , An be events. Let Bk be the event exactly k of the Ai occur, and Ck be
        the event that at least k of the Ai occur, for 0 ≤ k ≤ n. Find a simple expression for
        P (Bk ) in terms of P (Ck ) and P (Ck+1 ).
  47.   Events A and B are independent if P (A ∩ B) = P (A)P (B) (independence is explored
        in detail in the next chapter).

        (a) Give an example of independent events A and B in a finite sample space S (with
        neither equal to ∅ or S), and illustrate it with a Pebble World diagram.

        (b) Consider the experiment of picking a random point in the rectangle

                                   R = {(x, y) : 0 < x < 1, 0 < y < 1},

        where the probability of the point being in any particular region contained within R is
        the area of that region. Let A1 and B1 be rectangles contained within R, with areas not
        equal to 0 or 1. Let A be the event that the random point is in A1 , and B be the event
        that the random point is in B1 . Give a geometric description of when it is true that A
        and B are independent. Also, give an example where they are independent and another
        example where they are not independent.

        (c) Show that if A and B are independent, then

                      P (A ∪ B) = P (A) + P (B) − P (A)P (B) = 1 − P (Ac )P (B c ).


40                                                                           Introduction to Probability

     48.    s Arby has a belief system assigning a number PArby (A) between 0 and 1 to every event
           A (for some sample space). This represents Arby’s degree of belief about how likely A
           is to occur. For any event A, Arby is willing to pay a price of 1000 · PArby (A) dollars to
           buy a certificate such as the one shown below:



                  Certificate

                  The owner of this certificate can redeem it for $1000 if A occurs. No
                  value if A does not occur, except as required by federal, state, or local
                  law. No expiration date.



           Likewise, Arby is willing to sell such a certificate at the same price. Indeed, Arby is
           willing to buy or sell any number of certificates at this price, as Arby considers it the
           “fair” price.
           Arby stubbornly refuses to accept the axioms of probability. In particular, suppose that
           there are two disjoint events A and B with

                                     PArby (A ∪ B) 6= PArby (A) + PArby (B).

           Show how to make Arby go bankrupt, by giving a list of transactions Arby is willing
           to make that will guarantee that Arby will lose money (you can assume it will be
           known whether A occurred and whether B occurred the day after any certificates are
           bought/sold).


           Inclusion-exclusion
     49.   A fair die is rolled n times. What is the probability that at least 1 of the 6 values never
           appears?
     50.    s A card player is dealt a 13-card hand from a well-shuffled, standard deck of cards.
           What is the probability that the hand is void in at least one suit (“void in a suit” means
           having no cards of that suit)?
     51.    s For a group of 7 people, find the probability that all 4 seasons (winter, spring,
           summer, fall) occur at least once each among their birthdays, assuming that all seasons
           are equally likely.
     52.   A certain class has 20 students, and meets on Mondays and Wednesdays in a classroom
           with exactly 20 seats. In a certain week, everyone in the class attends both days. On
           both days, the students choose their seats completely randomly (with one student per
           seat). Find the probability that no one sits in the same seat on both days of that week.
     53.   Fred needs to choose a password for a certain website. Assume that he will choose an
           8-character password, and that the legal characters are the lowercase letters a, b, c, . . . ,
           z, the uppercase letters A, B, C, . . . , Z, and the numbers 0, 1, . . . , 9.

           (a) How many possibilities are there if he is required to have at least one lowercase letter
           in his password?

           (b) How many possibilities are there if he is required to have at least one lowercase
           letter and at least one uppercase letter in his password?

           (c) How many possibilities are there if he is required to have at least one lowercase
           letter, at least one uppercase letter, and at least one number in his password?


Probability and counting                                                                              41

  54.    s Alice attends a small college in which each class meets only once a week. She is
        deciding between 30 non-overlapping classes. There are 6 classes to choose from for each
        day of the week, Monday through Friday. Trusting in the benevolence of randomness,
        Alice decides to register for 7 randomly selected classes out of the 30, with all choices
        equally likely. What is the probability that she will have classes every day, Monday
        through Friday? (This problem can be done either directly using the naive definition of
        probability, or using inclusion-exclusion.)
  55.   A club consists of 10 seniors, 12 juniors, and 15 sophomores. An organizing committee
        of size 5 is chosen randomly (with all subsets of size 5 equally likely).

        (a) Find the probability that there are exactly 3 sophomores in the committee.

        (b) Find the probability that the committee has at least one representative from each
        of the senior, junior, and sophomore classes.


        Mixed practice
  56.   For each part, decide whether the blank should be filled in with =, <, or >, and give a
        clear explanation. In (a) and (b), order doesn’t matter.

        (a) (number of ways to choose 5 people out of 10)           (number of ways to choose 6
        people out of 10)

        (b) (number of ways to break 10 people into 2 teams of 5)             (number of ways to
        break 10 people into a team of 6 and a team of 4)

        (c) (probability that all 3 people in a group of 3 were born on January 1)     (proba-
        bility that in a group of 3 people, 1 was born on each of January 1, 2, and 3)

        Martin and Gale play an exciting game of “toss the coin”, where they toss a fair coin
        until the pattern HH occurs (two consecutive Heads) or the pattern T H occurs (Tails
        followed immediately by Heads). Martin wins the game if and only if HH occurs before
        T H occurs.

        (d) (probability that Martin wins)        1/2
  57.   Take a deep breath before attempting this problem. In the book Innumeracy [20], John
        Allen Paulos writes:
              Now for better news of a kind of immortal persistence. First, take a deep
              breath. Assume Shakespeare’s account is accurate and Julius Caesar gasped
              [“Et tu, Brute!”] before breathing his last. What are the chances you just
              inhaled a molecule which Caesar exhaled in his dying breath?

        Assume that one breath of air contains 1022 molecules, and that there are 1044 molecules
        in the atmosphere. (These are slightly simpler numbers than the estimates that Paulos
        gives; for the purposes of this problem, assume that these are exact. Of course, in reality
        there are many complications such as different types of molecules in the atmosphere,
        chemical reactions, variation in lung capacities, etc.)

        Suppose that the molecules in the atmosphere now are the same as those in the at-
        mosphere when Caesar was alive, and that in the 2000 years or so since Caesar, these
        molecules have been scattered completely randomly through the atmosphere. Also as-
        sume that Caesar’s last breath was sampled without replacement but that your breathing
        is sampled with replacement (without replacement makes more sense but with replace-
        ment is easier to work with, and is a good approximation since the number of molecules
        in the atmosphere is so much larger than the number of molecules in one breath).


42                                                                          Introduction to Probability

           Find the probability that at least one molecule in the breath you just took was shared
           with Caesar’s last breath, and give a simple approximation in terms of e.
           Hint: As discussed in the math appendix, (1 + nx )n ≈ ex for n large.
     58.   A widget inspector inspects 12 widgets and finds that exactly 3 are defective. Unfortu-
           nately, the widgets then get all mixed up and the inspector has to find the 3 defective
           widgets again by testing widgets one by one.

           (a) Find the probability that the inspector will now have to test at least 9 widgets.

           (b) Find the probability that the inspector will now have to test at least 10 widgets.
     59.   There are 15 chocolate bars and 10 children. In how many ways can the chocolate bars
           be distributed to the children, in each of the following scenarios?

           (a) The chocolate bars are fungible (interchangeable).

           (b) The chocolate bars are fungible, and each child must receive at least one.
           Hint: First give each child a chocolate bar, and then decide what to do with the rest.

           (c) The chocolate bars are not fungible (it matters which particular bar goes where).

           (d) The chocolate bars are not fungible, and each child must receive at least one.
           Hint: The strategy suggested in (b) does not apply. Instead, consider randomly giving
           the chocolate bars to the children, and apply inclusion-exclusion.
     60.   Given n ≥ 2 numbers (a1 , a2 , . . . , an ) with no repetitions, a bootstrap sample is a se-
           quence (x1 , x2 , . . . , xn ) formed from the aj ’s by sampling with replacement with equal
           probabilities. Bootstrap samples arise in a widely used statistical method known as
           the bootstrap. For example, if n = 2 and (a1 , a2 ) = (3, 1), then the possible bootstrap
           samples are (3, 3), (3, 1), (1, 3), and (1, 1).
           (a) How many possible bootstrap samples are there for (a1 , . . . , an )?
           (b) How many possible bootstrap samples are there for (a1 , . . . , an ), if order does not
           matter (in the sense that it only matters how many times each aj was chosen, not the
           order in which they were chosen)?
           (c) One random bootstrap sample is chosen (by sampling from a1 , . . . , an with replace-
           ment, as described above). Show that not all unordered bootstrap samples (in the sense
           of (b)) are equally likely. Find an unordered bootstrap sample b1 that is as likely as
           possible, and an unordered bootstrap sample b2 that is as unlikely as possible. Let p1 be
           the probability of getting b1 and p2 be the probability of getting b2 (so pi is the prob-
           ability of getting the specific unordered bootstrap sample bi ). What is p1 /p2 ? What is
           the ratio of the probability of getting an unordered bootstrap sample whose probability
           is p1 to the probability of getting an unordered sample whose probability is p2 ?
     61.    s There are 100 passengers lined up to board an airplane with 100 seats (with each seat
           assigned to one of the passengers). The first passenger in line crazily decides to sit in
           a randomly chosen seat (with all seats equally likely). Each subsequent passenger takes
           their assigned seat if available, and otherwise sits in a random available seat. What is
           the probability that the last passenger in line gets to sit in their assigned seat? (This is
           a common interview problem, and a beautiful example of the power of symmetry.)
           Hint: Call the seat assigned to the jth passenger in line “seat j” (regardless of whether
           the airline calls it seat 23A or whatever). What are the possibilities for which seats
           are available to the last passenger in line, and what is the probability of each of these
           possibilities?


Probability and counting                                                                                                      43

  62.   In the birthday problem, we assumed that all 365 days of the year are equally likely
        (and excluded February 29). In reality, some days are slightly more likely as birthdays
        than others. For example, scientists have long struggled to understand why more babies
        are born 9 months after a holiday. Let p = (p1 , p2 , . . . , p365 ) be the vector of birthday
        probabilities, with pj the probability of being born on the jth day of the year (February
        29 is still excluded, with no offense intended to Leap Dayers).

        The kth elementary symmetric polynomial in the variables x1 , . . . , xn is defined by
                                                    X
                            ek (x1 , . . . , xn ) =         xj1 . . . xjk .
                                                           1≤j1 <j2 <···<jk ≤n


        This just says to add up all of the nk terms we can get by choosing and multiplying
                                                          

        k of the variables. For example, e1 (x1 , x2 , x3 ) = x1 + x2 + x3 , e2 (x1 , x2 , x3 ) = x1 x2 +
        x1 x3 + x2 x3 , and e3 (x1 , x2 , x3 ) = x1 x2 x3 .
        Now let k ≥ 2 be the number of people.
        (a) Find a simple expression for the probability that there is at least one birthday match,
        in terms of p and an elementary symmetric polynomial.
        (b) Explain intuitively why it makes sense that P (at least one birthday match) is min-
                            1
        imized when pj = 365   for all j, by considering simple and extreme cases.
        (c) The famous arithmetic mean-geometric mean inequality says that for x, y ≥ 0,
                                                        x+y  √
                                                            ≥ xy.
                                                         2
        This inequality follows from adding 4xy to both sides of x2 − 2xy + y 2 = (x − y)2 ≥ 0.
        Define r = (r1 , . . . , r365 ) by r1 = r2 = (p1 + p2 )/2, rj = pj for 3 ≤ j ≤ 365. Using the
        arithmetic mean-geometric mean bound and the fact, which you should verify, that

         ek (x1 , . . . , xn ) = x1 x2 ek−2 (x3 , . . . , xn ) + (x1 + x2 )ek−1 (x3 , . . . , xn ) + ek (x3 , . . . , xn ),

        show that

                  P (at least one birthday match|p) ≥ P (at least one birthday match|r),

        with strict inequality if p 6= r, where the “given r” notation means that the birthday
        probabilities are given by r. Using this, show that the value of p that minimizes the
                                                                      1
        probability of at least one birthday match is given by pj = 365 for all j.


Taylor & Francis
Taylor & Francis Group
http://taylorandfrancis.com


2
Conditional probability



We have introduced probability as a language for expressing our degrees of belief or
uncertainties about events. Whenever we observe new evidence (i.e., obtain data),
we acquire information that may affect our uncertainties. A new observation that
is consistent with an existing belief could make us more sure of that belief, while a
surprising observation could throw that belief into question. Conditional probability
is the concept that addresses this fundamental question: how should we update our
beliefs in light of the evidence we observe?




2.1   The importance of thinking conditionally

Conditional probability is essential for scientific, medical, and legal reasoning, since
it shows how to incorporate evidence into our understanding of the world in a logical,
coherent manner. In fact, a useful perspective is that all probabilities are conditional ;
whether or not it’s written explicitly, there is always background knowledge (or
assumptions) built into every probability.
Suppose, for example, that one morning we are interested in the event R that it will
rain that day. Let P (R) be our assessment of the probability of rain before looking
outside. If we then look outside and see ominous clouds in the sky, then presumably
our probability of rain should increase; we denote this new probability by P (R|C)
(read as “probability of R given C”), where C is the event of there being ominous
clouds. When we go from P (R) to P (R|C), we say that we are “conditioning on
C”. As the day progresses, we may obtain more and more information about the
weather conditions, and we can continually update our probabilities. If we observe
that events B1 , . . . , Bn occurred, then we write our new conditional probability of
rain given this evidence as P (R|B1 , . . . , Bn ). If eventually we observe that it does
start raining, our conditional probability becomes 1.
Furthermore, we will see that conditioning is a very powerful problem-solving strat-
egy, often making it possible to solve a complicated problem by decomposing it into
manageable pieces with case-by-case reasoning. Just as in computer science a com-
mon strategy is to break a large problem up into bite-size pieces (or even byte-size
pieces), in probability a common strategy is to reduce a complicated probability
problem to a bunch of simpler conditional probability problems. In particular, we

                                                                                       45


46                                                           Introduction to Probability

will discuss a strategy known as first-step analysis, which often allows us to obtain
recursive solutions to problems where the experiment has multiple stages.
Due to the central importance of conditioning, both as the means by which we up-
date beliefs to reflect evidence and as a problem-solving strategy, we say that
                       Conditioning is the soul of statistics.




2.2   Definition and intuition

Definition 2.2.1 (Conditional probability). If A and B are events with P (B) > 0,
then the conditional probability of A given B, denoted by P (A|B), is defined as
                                           P (A ∩ B)
                               P (A|B) =             .
                                             P (B)

Here A is the event whose uncertainty we want to update, and B is the evidence
we observe (or want to treat as given). We call P (A) the prior probability of A and
P (A|B) the posterior probability of A (“prior” means before updating based on the
evidence, and “posterior” means after updating based on the evidence).
It is important to interpret the event appearing after the vertical conditioning bar
as the evidence that we have observed or that is being conditioned on: P (A|B) is
the probability of A given the evidence B, not the probability of some entity called
A|B. As discussed in h 2.4.1, there is no such event as A|B.
For any event A, P (A|A) = P (A ∩ A)/P (A) = 1. Upon observing that A has
occurred, our updated probability for A is 1. If this weren’t the case, we would
demand a new definition of conditional probability!
Example 2.2.2 (Two cards). A standard deck of cards is shuffled well. Two cards
are drawn randomly, one at a time without replacement. Let A be the event that the
first card is a heart, and B be the event that the second card is red. Find P (A|B)
and P (B|A).

Solution:
By the naive definition of probability and the multiplication rule,
                                           13 · 25   25
                            P (A ∩ B) =            =     ,
                                           52 · 51   204
since a favorable outcome is determined by choosing any of the 13 hearts and then
any of the remaining 25 red cards. Also, P (A) = 1/4 since the 4 suits are equally
likely, and
                                       26 · 51   1
                               P (B) =         =
                                       52 · 51   2


Conditional probability                                                             47

since there are 26 favorable possibilities for the second card, and for each of those,
the first card can be any other card (recall from Chapter 1 that chronological order
is not needed in the multiplication rule).
A neater way to see that P (B) = 1/2 is by symmetry: from a vantage point before
having done the experiment, the second card is equally likely to be any card in the
deck.
We now have all the pieces needed to apply the definition of conditional probability:

                                    P (A ∩ B)   25/204   25
                          P (A|B) =           =        =     ,
                                      P (B)       1/2    102
                                    P (B ∩ A)   25/204   25
                          P (B|A) =           =        = .
                                      P (A)       1/4    51


This is a simple example, but already there are several things worth noting.
1. It’s extremely important to be careful about which events to put on which side of
the conditioning bar. In particular, P (A|B) 6= P (B|A). The next section explores
how P (A|B) and P (B|A) are related in general. Confusing these two quantities is
called the prosecutor’s fallacy and is discussed in Section 2.8. If instead we had
defined B to be the event that the second card is a heart, then the two conditional
probabilities would have been equal.

2. Both P (A|B) and P (B|A) make sense (intuitively and mathematically); the
chronological order in which cards were chosen does not dictate which conditional
probabilities we can look at. When we calculate conditional probabilities, we are
considering what information observing one event provides about another event,
not whether one event causes another. For further intuition, imagine that someone
spreads out the cards and draws one card with their left hand and another card
with their right hand, at the same time. Defining A and B based on the left hand’s
card and the right hand’s card rather than the first card and second card would not
change the structure of the problem in any important way.

3. We can also see that P (B|A) = 25/51 by a direct interpretation of what condi-
tional probability means: if the first card drawn is a heart, then the remaining cards
consist of 25 red cards and 26 black cards (all of which are equally likely to be drawn
next), so the conditional probability of getting a red card is 25/(25 + 26) = 25/51.
It is harder to find P (A|B) in this way: if we learn that the second card is red, we
might think “that’s nice to know, but what we really want to know is whether it’s
a heart!” The conditional probability results from later sections in this chapter give
us methods for getting around this issue.                                             
To shed more light on what conditional probability means, here are two intuitive
interpretations.


48                                                          Introduction to Probability

Intuition 2.2.3 (Pebble World). Consider a finite sample space, with the outcomes
visualized as pebbles with total mass 1. Since A is an event, it is a set of pebbles,
and likewise for B. Figure 2.1(a) shows an example.


                 A                     A
                                                                A

                       B                     B                          B

FIGURE 2.1
Pebble World intuition for P (A|B). From left to right: (a) Events A and B are sub-
sets of the sample space. (b) Because we know B occurred, get rid of the outcomes
in B c . (c) In the restricted sample space, renormalize so the total mass is still 1.

Now suppose that we learn that B occurred. In Figure 2.1(b), upon obtaining this
information, we get rid of all the pebbles in B c because they are incompatible
with the knowledge that B has occurred. Then P (A ∩ B) is the total mass of the
pebbles remaining in A. Finally, in Figure 2.1(c), we renormalize, that is, divide
all the masses by a constant so that the new total mass of the remaining pebbles
is 1. This is achieved by dividing by P (B), the total mass of the pebbles in B.
The updated mass of the outcomes corresponding to event A is the conditional
probability P (A|B) = P (A ∩ B)/P (B).

In this way, our probabilities have been updated in accordance with the observed
evidence. Outcomes that contradict the evidence are discarded, and their mass is
redistributed among the remaining outcomes, preserving the relative masses of the
remaining outcomes. For example, if pebble 2 weighs twice as much as pebble 1
initially, and both are contained in B, then after conditioning on B it is still true
that pebble 2 weighs twice as much as pebble 1. But if pebble 2 is not contained in
B, then after conditioning on B its mass is updated to 0.                          

Intuition 2.2.4 (Frequentist interpretation). Recall that the frequentist interpre-
tation of probability is based on relative frequency over a large number of repeated
trials. Imagine repeating our experiment many times, generating a long list of ob-
served outcomes. The conditional probability of A given B can then be thought of
in a natural way: it is the fraction of times that A occurs, restricting attention to
the trials where B occurs.

In Figure 2.2, our experiment has outcomes which can be written as a string of 0’s
and 1’s; B is the event that the first digit is 1 and A is the event that the second
digit is 1. Conditioning on B, we circle all the repetitions where B occurred, and
then we look at the fraction of circled repetitions in which event A also occurred.

In symbols, let nA , nB , nAB be the number of occurrences of A, B, A∩B respectively
in a large number n of repetitions of the experiment. The frequentist interpretation


Conditional probability                                                              49

is that
                               nA           nB               nAB
                     P (A) ≈      , P (B) ≈    , P (A ∩ B) ≈     .
                                n            n                n
Then P (A|B) is interpreted as nAB /nB , which equals (nAB /n)/(nB /n). This inter-
pretation again translates to P (A|B) = P (A ∩ B)/P (B).                         

                                10101010101001000010010

                                01010101001010000111110

                                11110010101010000000111

                                11001101101010101010110

                                01100001110101011110011

                                10100110111001001001110
                                           •
                                           •
                                           •




FIGURE 2.2
Frequentist intuition for P (A|B). The repetitions where B occurred are circled;
among these, the repetitions where A occurred are highlighted in bold. P (A|B) is
the long-run relative frequency of the repetitions where A occurs, within the subset
of repetitions where B occurs.

For practice with applying the definition of conditional probability, let’s do some
more examples. The next three examples all start with the same basic scenario of a
family with two children, but subtleties arise depending on the exact assumptions
and the exact information we condition on.
Example 2.2.5 (Two children). Martin Gardner posed the following puzzle in the
1950s, in his column in Scientific American.
 Mr. Jones has two children. The older child is a girl. What is the probability that
 both children are girls?

 Mr. Smith has two children. At least one of them is a boy. What is the prob-
 ability that both children are boys?
At first glance this problem seems like it should be a simple application of conditional
probability, but for decades there have been controversies about whether or why the
two parts of the problem should have different answers, and the extent to which
the problem is ambiguous. Gardner gave the answers 1/2 and 1/3 to the two parts,
respectively, which may seem paradoxical: why should it matter whether we learn
the older child’s gender, as opposed to just learning one child’s gender?
It is important to clarify the assumptions of the problem. Several implicit assump-
tions are being made to obtain the answers that Gardner gave.


50                                                                Introduction to Probability

• It assumes that gender is binary, so that each child can be definitively categorized
  as a boy or a girl. In fact, many people don’t neatly fit into either of the categories
  “male” or “female”, and identify themselves as having a non-binary gender.
• It assumes that P (boy) = P (girl), both for the elder child and for the younger
  child. In fact, in most countries slightly more boys are born than girls. For example,
  in the United States it is commonly estimated that 105 boys are born for every
  100 girls who are born.
• It assumes that the genders of the two children are independent, i.e., knowing the
  elder child’s gender gives no information about the younger child’s gender, and
  vice versa. This would be unrealistic if, e.g., the children were identical twins.
Under these (admittedly problematic) simplifying assumptions, we can solve the
problem as follows.
Solution:
With the assumptions listed above, the definition of conditional probability gives

                                          P (both girls, elder is a girl)   1/4
       P (both girls|elder is a girl) =                                   =     = 1/2,
                                               P (elder is a girl)          1/2

                                          P (both girls, at least one girl)   1/4
     P (both girls|at least one girl) =                                     =     = 1/3.
                                               P (at least one girl)          3/4
(We solved the second part of the problem in terms of girls rather than boys to make
it a bit easier to compare the two parts of the problem.) It may seem counterintuitive
that the two results are different, since there is no reason for us to care whether the
elder child is a girl as opposed to the younger child. Indeed, by symmetry,

          P (both girls|younger is a girl) = P (both girls|elder is a girl) = 1/2.

However, there is no such symmetry between the conditional probabilities
P (both girls|elder is a girl) and P (both girls|at least one girl). Saying that the el-
der child is a girl designates a specific child, and then the other child (the younger
child) has a 50% chance of being a girl. “At least one” does not refer to a specific
child. Conditioning on a specific child being a girl knocks away 2 of the 4 “pebbles”
in the sample space {GG, GB, BG, BB}, where, for example, GB means the elder
child is a girl and the younger child is a boy. In contrast, conditioning on at least
one child being a girl knocks away only BB.                                           
Example 2.2.6 (Random child is a girl). A family has two children. You randomly
run into one of the two, and learn that she is a girl. With assumptions as in the
previous example, what is the conditional probability that both are girls? Also
assume that you are equally likely to run into either child, and that which one you
run into has nothing to do with gender.


Conditional probability                                                                    51

Solution:
Intuitively, the answer should be 1/2: imagine that the child we encountered is
in front of us and the other is at home. Both being girls just says that the child
who is at home is a girl, which seems to have nothing to do with the fact that
the child in front of us is a girl. But let us check this more carefully, using the
definition of conditional probability. This is also good practice with writing events
in set notation.
Let G1 , G2 , and G3 be the events that the elder, younger, and random child is a
girl, respectively. By assumption, P (G1 ) = P (G2 ) = P (G3 ) = 1/2 . By the naive
definition, or by independence as explained in Section 2.5, P (G1 ∩ G2 ) = 1/4. Thus,

            P (G1 ∩ G2 |G3 ) = P (G1 ∩ G2 ∩ G3 )/P (G3 ) = (1/4)/(1/2) = 1/2,

since G1 ∩ G2 ∩ G3 = G1 ∩ G2 (if both children are girls, it guarantees that the
random child is a girl).
Keep in mind though that in order to arrive at 1/2, an assumption was needed about
how the random child was selected. In statistical language, we say that we collected
a random sample; here the sample consists of one of the two children. One of the
most important principles in statistics is that it is essential to think carefully about
how the sample was collected, not just stare at the raw data without understanding
where they came from. To take a simple extreme case, suppose that a repressive law
forbids a boy from leaving the house if he has a sister. Then “the random child is a
girl” is equivalent to “at least one of the children is a girl”, so the problem reduces
to the first part of Example 2.2.5.                                                   
Example 2.2.7 (A girl born in winter). A family has two children. Find the prob-
ability that both children are girls, given that at least one of the two is a girl who
was born in winter. In addition to the assumptions from Example 2.2.5, assume
that the four seasons are equally likely and that gender is independent of season.
(This means that knowing the gender gives no information about the probabilities
of the seasons, and vice versa; see Section 2.5 for much more about independence.)
Solution:
By definition of conditional probability,

                                              P (both girls, at least one winter girl)
  P (both girls|at least one winter girl) =                                            .
                                                   P (at least one winter girl)

Since the probability that a specific child is a winter-born girl is 1/8, the denomi-
nator equals
                     P (at least one winter girl) = 1 − (7/8)2 .

To compute the numerator, use the fact that “both girls, at least one winter girl” is
the same event as “both girls, at least one winter child”; then use the assumption


52                                                              Introduction to Probability

that gender and season are independent:

 P (both girls, at least one winter girl) = P (both girls, at least one winter child)
                                           = (1/4)P (at least one winter child)
                                           = (1/4)(1 − P (both are non-winter))
                                           = (1/4)(1 − (3/4)2 ).

Thus,
                                                  (1/4)(1 − (3/4)2 )    7/64
      P (both girls|at least one winter girl) =               2
                                                                     =       = 7/15.
                                                     1 − (7/8)         15/64

At first this result seems absurd! In Example 2.2.5, the result was that the condi-
tional probability of both children being girls, given that at least one is a girl, is
1/3; why should it be any different when we learn that at least one is a winter-born
girl? The point is that information about the birth season brings “at least one is
a girl” closer to “a specific one is a girl”. Conditioning on more and more specific
information brings the probability closer and closer to 1/2.
For example, conditioning on “at least one is a girl who was born on a March 31
at 8:20 pm” comes very close to specifying a child, and learning information about
a specific child does not give us information about the other child. The seemingly
irrelevant information such as season of birth interpolates between the two parts of
Example 2.2.5. Exercise 29 generalizes this example to an arbitrary characteristic
that is independent of gender.                                                    




2.3     Bayes’ rule and the law of total probability

The definition of conditional probability is simple—just a ratio of two probabilities—
but it has far-reaching consequences. The first consequence is obtained easily by
moving the denominator in the definition to the other side of the equation.
Theorem 2.3.1 (Probability of the intersection of two events). For any events A
and B with positive probabilities,

                      P (A ∩ B) = P (B)P (A|B) = P (A)P (B|A).

This follows from taking the definition of P (A|B) and multiplying both sides by
P (B), and then taking the definition of P (B|A) and multiplying both sides by
P (A). At first sight this theorem may not seem very useful: it is the definition of
conditional probability, just written slightly differently, and anyway it seems circular
to use P (A|B) to help find P (A∩B) when P (A|B) was defined in terms of P (A∩B).
But we will see that the theorem is in fact very useful, since it often turns out to be


Conditional probability                                                                                53

possible to find conditional probabilities without going back to the definition, and
in such cases Theorem 2.3.1 can help us more easily find P (A ∩ B).
Applying Theorem 2.3.1 repeatedly, we can generalize to the intersection of n
events.
Theorem 2.3.2 (Probability of the intersection of n events). For any events
A1 , . . . , An with P (A1 , A2 , . . . , An−1 ) > 0,

    P (A1 , A2 , . . . , An ) = P (A1 )P (A2 |A1 )P (A3 |A1 , A2 ) · · · P (An |A1 , . . . , An−1 ),

The commas denote intersections, e.g., P (A3 |A1 , A2 ) is P (A3 |A1 ∩ A2 ).
In fact, this is n! theorems in one, since we can permute A1 , . . . , An however we
want without affecting the left-hand side. Often the right-hand side will be much
easier to compute for some orderings than for others. For example,

  P (A1 , A2 , A3 ) = P (A1 )P (A2 |A1 )P (A3 |A1 , A2 ) = P (A2 )P (A3 |A2 )P (A1 |A2 , A3 ),

and there are 4 other expansions of this form too. It often takes practice and thought
to be able to know which ordering to use.
We are now ready to introduce the two main theorems of this chapter—Bayes’ rule
and the law of total probability—which will allow us to compute conditional prob-
abilities in a wide range of problems. Bayes’ rule is an extremely famous, extremely
useful result that relates P (A|B) to P (B|A).
Theorem 2.3.3 (Bayes’ rule).

                                                  P (B|A)P (A)
                                   P (A|B) =                   .
                                                      P (B)

This follows immediately from Theorem 2.3.1, which in turn followed immediately
from the definition of conditional probability. Yet Bayes’ rule has important impli-
cations and applications in probability and statistics, since it is so often necessary
to find conditional probabilities, and often P (B|A) is much easier to find directly
than P (A|B) (or vice versa).
Another way to write Bayes’ rule is in terms of odds rather than probability.
Definition 2.3.4 (Odds). The odds of an event A are

                                    odds(A) = P (A)/P (Ac ).

For example, if P (A) = 2/3, we say the odds in favor of A are 2 to 1. (This is
sometimes written as 2 : 1, and is sometimes stated as 1 to 2 odds against A; care
is needed since some sources do not explicitly state whether they are referring to
odds in favor or odds against an event.) Of course we can also convert from odds
back to probability:
                         P (A) = odds(A)/(1 + odds(A)).


54                                                             Introduction to Probability

By taking the Bayes’ rule expression for P (A|B) and dividing it by the Bayes’ rule
expression for P (Ac |B), we arrive at the odds form of Bayes’ rule.
Theorem 2.3.5 (Odds form of Bayes’ rule). For any events A and B with positive
probabilities, the odds of A after conditioning on B are
                             P (A|B)    P (B|A) P (A)
                                 c
                                      =                   .
                             P (A |B)   P (B|Ac ) P (Ac )

In words, this says that the posterior odds P (A|B)/P (Ac |B) are equal to the prior
odds P (A)/P (Ac ) times the factor P (B|A)/P (B|Ac ), which is known in statistics
as the likelihood ratio. Sometimes it is convenient to work with this form of Bayes’
rule to get the posterior odds, and then if desired we can convert from odds back
to probability.
The law of total probability (LOTP) relates conditional probability to unconditional
probability. It is essential for fulfilling the promise that conditional probability can
be used to decompose complicated probability problems into simpler pieces, and it
is often used in tandem with Bayes’ rule.
Theorem 2.3.6 (Law of total probability). Let A1 , . . . , An be a partition of the
sample space S (i.e., the Ai are disjoint events and their union is S), with P (Ai ) > 0
for all i. Then
                                       Xn
                             P (B) =       P (B|Ai )P (Ai ).
                                       i=1

Proof. Since the Ai form a partition of S, we can decompose B as
                     B = (B ∩ A1 ) ∪ (B ∩ A2 ) ∪ · · · ∪ (B ∩ An ).
This is illustrated in Figure 2.3, where we have chopped B into the smaller pieces
B ∩ A1 through B ∩ An . By the second axiom of probability, because these pieces
are disjoint, we can add their probabilities to get P (B):
                P (B) = P (B ∩ A1 ) + P (B ∩ A2 ) + · · · + P (B ∩ An ).
Now we can apply Theorem 2.3.1 to each of the P (B ∩ Ai ):
                  P (B) = P (B|A1 )P (A1 ) + · · · + P (B|An )P (An ).                 

The law of total probability tells us that to get the unconditional probability of B, we
can divide the sample space into disjoint slices Ai , find the conditional probability of
B within each of the slices, then take a weighted sum of the conditional probabilities,
where the weights are the probabilities P (Ai ). The choice of how to divide up the
sample space is crucial: a well-chosen partition will reduce a complicated problem
into simpler pieces, whereas a poorly chosen partition will only exacerbate our
problems, requiring us to calculate n difficult probabilities instead of just one!
The next few examples show how we can use Bayes’ rule together with the law of
total probability to update our beliefs based on observed evidence.


Conditional probability                                                            55



                                                                 B

                                                           B∩A5
                                    B∩A3
                                                                     B∩A6
                                                B∩A4
                  B∩A1
                          B∩A2


                  A1      A2         A3          A4         A5           A6

FIGURE 2.3
                                                           P
The Ai partition the sample space; P (B) is equal to          i P (B ∩ Ai ).


Example 2.3.7 (Random coin). You have one fair coin, and one biased coin which
lands Heads with probability 3/4. You pick one of the coins at random and flip
it three times. It lands Heads all three times. Given this information, what is the
probability that the coin you picked is the fair one?
Solution:
Let A be the event that the chosen coin lands Heads three times and let F be the
event that we picked the fair coin. We are interested in P (F |A), but it is easier to
find P (A|F ) and P (A|F c ) since it helps to know which coin we have; this suggests
using Bayes’ rule and the law of total probability. Doing so, we have

                                   P (A|F )P (F )
                       P (F |A) =
                                       P (A)
                                             P (A|F )P (F )
                                 =
                                   P (A|F )P (F ) + P (A|F c )P (F c )
                                           (1/2)3 · 1/2
                                 =
                                   (1/2) · 1/2 + (3/4)3 · 1/2
                                         3

                                 ≈ 0.23.

Before flipping the coin, we thought we were equally likely to have picked the fair
coin as the biased coin: P (F ) = P (F c ) = 1/2. Upon observing three Heads, however,
it becomes more likely that we’ve chosen the biased coin than the fair coin, so
P (F |A) is only about 0.23.                                                        
h 2.3.8 (Prior vs. posterior). It would not be correct in the calculation in the above
example to say after the first step, “P (A) = 1 because we know A happened.” It
is true that P (A|A) = 1, but P (A) is the prior probability of A and P (F ) is the
prior probability of F —both are the probabilities before we observe any data in the


56                                                           Introduction to Probability

experiment. These must not be confused with posterior probabilities conditional on
the evidence A.
Example 2.3.9 (Testing for a rare disease). A patient named Fred is tested for a
disease called conditionitis, a medical condition that afflicts 1% of the population.
The test result is positive, i.e., the test claims that Fred has the disease. Let D be
the event that Fred has the disease and T be the event that he tests positive.
Suppose that the test is “95% accurate”; there are different measures of the accuracy
of a test, but in this problem it is assumed to mean that P (T |D) = 0.95 and
P (T c |Dc ) = 0.95. The quantity P (T |D) is known as the sensitivity or true positive
rate of the test, and P (T c |Dc ) is known as the specificity or true negative rate.
Find the conditional probability that Fred has conditionitis, given the evidence
provided by the test result.
Solution:
Applying Bayes’ rule and the law of total probability, we have
                                  P (T |D)P (D)
                     P (D|T ) =
                                      P (T )
                                          P (T |D)P (D)
                             =
                               P (T |D)P (D) + P (T |Dc )P (Dc )
                                       0.95 · 0.01
                             =
                               0.95 · 0.01 + 0.05 · 0.99
                             ≈ 0.16.

So there is only a 16% chance that Fred has conditionitis, given that he tested
positive, even though the test seems to be quite reliable!
Most people find it surprising to learn that the conditional probability of having the
disease given a positive test result is only 16%, even though the test is 95% accurate
(see Gigerenzer and Hoffrage [13]). The key to understanding this surprisingly low
posterior probability of having the disease is to realize that there are two factors at
play: the evidence from the test, and our prior information about the prevalence of
the disease.
Although the test provides evidence in favor of disease, conditionitis is also a rare
condition! The conditional probability P (D|T ) reflects a balance between these
two factors, appropriately weighing the rarity of the disease against the rarity of a
mistaken test result.
For further intuition, consider a population of 10000 people as illustrated in Figure
2.4, where 100 have conditionitis and 9900 don’t; this corresponds to a 1% disease
rate. If we tested everybody in the population, we’d expect that out of the 100
diseased individuals, 95 would test positive and 5 would test negative. Out of the
9900 healthy individuals, we’d expect (0.95)(9900) ≈ 9405 to test negative and 495
to test positive.


Conditional probability                                                                       57




                                   10000 people

                                                   he
                                                      alt
                                                          hy
                              ed
                            as
                          se
                     di




                  100                                          9900 people
                 people
          +




                           test
         test




                                                                             tes
                                                      t+




                                                                                t–
                            –




                                                   tes




         95                   5

    true positives    false negatives
                                                  495
                                                                                 9405

                                            false positives

                                                                             true negatives


FIGURE 2.4
Testing for a rare disease in a population of 10000 people, where the prevalence of
the disease is 1% and the true positive and true negative rates are both equal to
95%. Bubbles are not to scale.


58                                                                 Introduction to Probability

Now let’s focus in on those individuals who test positive; that is, let’s condition on a
positive test result. The 95 true positives (i.e., the individuals who test positive and
have the disease) are far outnumbered by the 495 false positives (i.e., the individuals
who test positive despite not having the disease). So most people who test positive
for the disease don’t actually have the disease!                                       

Example 2.3.10 (Six-fingered man). A crime has been committed in a certain
country. The perpetrator is one (and only one) of the n men who live in the coun-
try. Initially, these n men are all deemed equally likely to be the perpetrator. An
eyewitness then reports that the crime was committed by a man with six fingers on
his right hand.

Let p0 be the probability that an innocent man has six fingers on his right hand,
and p1 be the probability that the perpetrator has six fingers on his right hand,
with p0 < p1 . (We may have p1 < 1, since eyewitnesses are not 100% reliable.) Let
a = p0 /p1 and b = (1 − p1 )/(1 − p0 ).

Rugen lives in the country. He is found to have six fingers on his right hand.

(a) Given this information, what is the probability that Rugen is the perpetrator?

(b) Now suppose that all n men who live in the country have their hands checked,
and Rugen is the only one with six fingers on his right hand. Given this information,
what is the probability that Rugen is the perpetrator?

Solution:

(a) Let R be the event that Rugen is guilty and M be the event that he has six
fingers on his right hand. By Bayes’ rule and LOTP,

                      P (M |R)P (R)                       p1 · n1             1
P (R|M ) =                                      =                     =              .
              P (M |R)P (R) + P (M |Rc )P (Rc )   p1 · n1 + p0 1 − n1    1 + a(n − 1)


(b) Let N be the event that none of the men in the country other than Rugen have
six fingers on their right hands. With notation as above,

                                      P (M, N |R)P (R)
            P (R|M, N ) =
                            P (M, N |R)P (R) + P (M, N |Rc )P (Rc )

                                                p1 (1 − p0 )n−1 · n1
                       =                                                           
                            p1 (1 − p0 )n−1 · n1 + p0 (1 − p1 )(1 − p0 )n−2 1 − n1

                                  1
                       =                  .                                                
                            1 + ab(n − 1)
```
