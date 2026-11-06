# Chapter 2: Conditional Probability

**Book:** Introduction to Probability, Second Edition  
**Authors:** Joseph K. Blitzstein and Jessica Hwang  
**Printed pages:** 45–102

> Source transcription from the supplied textbook PDF. Text extraction preserves the original order and page content as far as the PDF text layer allows. Check mathematical notation and figure references against the source where extraction is ambiguous.

```text
Conditional probability                                                                          59




2.4     Conditional probabilities are probabilities

When we condition on an event E, we update our beliefs to be consistent with
this knowledge, effectively putting ourselves in a universe where we know that E
occurred. Within our new universe, however, the laws of probability operate just as
before. Conditional probability satisfies all the properties of probability! Therefore,
any of the results we have derived about probability are still valid if we replace all
unconditional probabilities with probabilities conditional on E. In particular:
• Conditional probabilities are between 0 and 1.
• P (S|E) = 1, P (∅|E) = 0.
                                                           P∞
• If A1 , A2 , . . . are disjoint, then P (∪∞
                                            j=1 Aj |E) =     j=1 P (Aj |E).

• P (Ac |E) = 1 − P (A|E).
• Inclusion-exclusion: P (A ∪ B|E) = P (A|E) + P (B|E) − P (A ∩ B|E).
h 2.4.1. When we write P (A|E), it does not mean that A|E is an event and
we’re taking its probability; A|E is not an event. Rather, P (·|E) is a probability
function which assigns probabilities in accordance with the knowledge that E has
occurred, and P (·) is a different probability function which assigns probabilities
without regard for whether E has occurred or not. When we take an event A and
plug it into the P (·) function, we’ll get a number, P (A); when we plug it into
the P (·|E) function, we’ll get another number, P (A|E), which incorporates the
information (if any) provided by knowing that E occurred.
To prove mathematically that conditional probabilities are probabilities, fix an event
E with P (E) > 0, and for any event A, define P̃ (A) = P (A|E). This notation helps
emphasize the fact that we are fixing E and treating P (·|E) as our new probability
function. We just need to check the two axioms of probability. First,

                               P (∅ ∩ E)                         P (S ∩ E)
          P̃ (∅) = P (∅|E) =             = 0, P̃ (S) = P (S|E) =           = 1.
                                 P (E)                             P (E)

Second, if A1 , A2 , . . . are disjoint events, then
                                                             P∞                      ∞
                        P ((A1 ∩ E) ∪ (A2 ∩ E) ∪ · · · )        j=1 P (Aj ∩ E)
                                                                                     X
P̃ (A1 ∪ A2 ∪ · · · ) =                                  =                       =         P̃ (Aj ).
                                    P (E)                          P (E)
                                                                                     j=1


So P̃ satisfies the axioms of probability.
Conversely, all probabilities can be thought of as conditional probabilities: whenever
we make a probability statement, there is always some background information that
we are conditioning on, even if we don’t state it explicitly. Consider the rain example
from the beginning of this chapter. It would be natural to base the initial probability


60                                                                 Introduction to Probability

of rain today, P (R), on the fraction of days in the past on which it rained. But which
days in the past should we look at? If it’s November 1, should we only count past
rainy days in autumn, thus conditioning on the season? What about conditioning
on the exact month, or the exact day? We could ask the same about location: should
we look at days when it rained in our exact location, or is it enough for it to have
rained somewhere nearby?
In order to determine the seemingly unconditional probability P (R), we actually
have to make decisions about what background information to condition on! These
choices require careful thought and different people may come up with different
prior probabilities P (R) (though everyone can agree on how to update based on
new evidence).
Since all probabilities are conditional on background information, we can imagine
that there is always a vertical conditioning bar, with background knowledge K to the
right of the vertical bar. Then the unconditional probability P (A) is just shorthand
for P (A|K); the background knowledge is absorbed into the letter P instead of
being written explicitly.
To summarize our discussion in a nutshell:
     Conditional probabilities are probabilities, and all probabilities are conditional.
We now state conditional forms of Bayes’ rule and the law of total probability. These
are obtained by taking the ordinary forms of Bayes’ rule and LOTP and adding E
to the right of the vertical bar everywhere.
Theorem 2.4.2 (Bayes’ rule with extra conditioning). Provided that P (A∩E) > 0
and P (B ∩ E) > 0, we have

                                             P (B|A, E)P (A|E)
                            P (A|B, E) =                       .
                                                  P (B|E)

Theorem 2.4.3 (LOTP with extra conditioning). Let A1 , . . . , An be a partition of
S. Provided that P (Ai ∩ E) > 0 for all i, we have
                                       n
                                       X
                           P (B|E) =         P (B|Ai , E)P (Ai |E).
                                       i=1


The extra conditioning forms of Bayes’ rule and LOTP can be proved similarly to
how we verified that P̃ satisfies the axioms of probability, but they also follow di-
rectly from the “metatheorem” that conditional probabilities are probabilities.
Example 2.4.4 (Random coin, continued). Continuing with the scenario from
Example 2.3.7, suppose that we have now seen our chosen coin land Heads three
times. If we toss the coin a fourth time, what is the probability that it will land
Heads once more?


Conditional probability                                                             61

Solution:
As before, let A be the event that the chosen coin lands Heads three times, and
define a new event H for the chosen coin landing Heads on the fourth toss. We
are interested in P (H|A). It would be very helpful to know whether we have the
fair coin. LOTP with extra conditioning gives us P (H|A) as a weighted average of
P (H|F, A) and P (H|F c , A), and within these two conditional probabilities we do
know whether we have the fair coin:
                P (H|A) = P (H|F, A)P (F |A) + P (H|F c , A)P (F c |A)
                          1         3
                        ≈ · 0.23 + · (1 − 0.23)
                          2         4
                        ≈ 0.69.
The posterior probabilities P (F |A) and P (F c |A) are from our answer to Example
2.3.7.
An equivalent way to solve this problem is to define a new probability function P̃
such that for any event B, P̃ (B) = P (B|A). This new function assigns probabilities
that are updated with the knowledge that A occurred. Then by the ordinary law of
total probability,
                          P̃ (H) = P̃ (H|F )P̃ (F ) + P̃ (H|F c )P̃ (F c ),
which is exactly the same as our use of LOTP with extra conditioning. This once
again illustrates the principle that conditional probabilities are probabilities. 
Example 2.4.5 (Unanimous agreement). The article “Why too much evidence can
be a bad thing” by Lisa Zyga [30] says:
 Under ancient Jewish law, if a suspect on trial was unanimously found guilty
 by all judges, then the suspect was acquitted. This reasoning sounds counterintu-
 itive, but the legislators of the time had noticed that unanimous agreement often
 indicates the presence of systemic error in the judicial process.
There are n judges deciding a case. The suspect has prior probability p of being
guilty. Each judge votes whether to convict or acquit the suspect. With probability s,
a systemic error occurs (e.g., the defense is incompetent). If a systemic error occurs,
then the judges unanimously vote to convict (i.e., all n judges vote to convict).
Whether a systemic error occurs is independent of whether the suspect is guilty.
Given that a systemic error doesn’t occur and that the suspect is guilty, each judge
has probability c of voting to convict, independently. Given that a systemic error
doesn’t occur and that the suspect is not guilty, each judge has probability w of
voting to convict, independently. Suppose that
                                                                 1
                    0 < p < 1, 0 < s < 1, and 0 < w <              < c < 1.
                                                                 2
(a) For this part only, suppose that exactly k out of n judges vote to convict, where
k < n. Given this information, find the probability that the suspect is guilty.


62                                                                Introduction to Probability

(b) Now suppose that all n judges vote to convict. Given this information, find the
probability that the suspect is guilty.
(c) Is the answer to (b), viewed as a function of n, an increasing function? Give a
short, intuitive explanation in words.
Solution:
(a) Since k < n, a systemic error didn’t occur. We will implicitly condition on this
in this part. Let G be the event that the suspect is guilty and X be the number of
judges who vote to convict. Using Bayes’ rule, LOTP, and the Binomial PMF,
                      P (X = k|G)P (G)              pck (1 − c)n−k
     P (G|X = k) =                     = k                                   .
                          P (X = k)     pc (1 − c)n−k + (1 − p)wk (1 − w)n−k

(b) Let U be the event X = n and B be the event that a systemic error occurs.
Then
                       P (U |G)P (G)            pP (U |G)
            P (G|U ) =               =                               .
                           P (U )      pP (U |G) + (1 − p)P (U |Gc )
By LOTP with extra conditioning,

      P (U |G) = P (U |G, B)P (B|G) + P (U |G, B c )P (B c |G) = s + (1 − s)cn ,
     P (U |Gc ) = P (U |Gc , B)P (B|Gc ) + P (U |Gc , B c )P (B c |Gc ) = s + (1 − s)wn .

Thus,                                      p(s + (1 − s)cn )
                 P (G|U ) =                                               .
                              p(s + (1 − s)cn ) + (1 − p)(s + (1 − s)wn )

(c) No, since a large value of n yields a high chance of systemic error, and if a
systemic error occurs then the judges’ votes are uninformative about whether the
suspect is guilty. The answer to (b) reverts to the prior probability p as n → ∞. 
We often want to condition on more than one piece of information, and we now
have several ways of doing that. For example, here are some approaches for finding
P (A|B, C):
1. We can think of B, C as the single event B∩C and use the definition of conditional
probability to get
                                            P (A, B, C)
                             P (A|B, C) =               .
                                             P (B, C)
This is a natural approach if it’s easiest to think about B and C in tandem. We
can then try to evaluate the numerator and denominator. For example, we can use
LOTP in both the numerator and the denominator, or we can write the numerator
as P (B, C|A)P (A) (which would give us a version of Bayes’ rule) and use LOTP to
help with the denominator.

2. We can use Bayes’ rule with extra conditioning on C to get
                                           P (B|A, C)P (A|C)
                            P (A|B, C) =                     .
                                                P (B|C)


Conditional probability                                                            63

This is a natural approach if we want to think of everything in our problem as being
conditioned on C.

3. We can use Bayes’ rule with extra conditioning on B to get
                                         P (C|A, B)P (A|B)
                          P (A|B, C) =                     .
                                              P (C|B)
This is the same as the previous approach, except with the roles of B and C swapped.
We mention it separately just to emphasize that it’s a bad idea to plug into a formula
without thinking about which event should play which role.
It is both challenging and powerful that there are a variety of ways to approach this
kind of conditioning problem.




2.5    Independence of events

We have now seen several examples where conditioning on one event changes our
beliefs about the probability of another event. The situation where events provide
no information about each other is called independence.
Definition 2.5.1 (Independence of two events). Events A and B are independent
if
                          P (A ∩ B) = P (A)P (B).
If P (A) > 0 and P (B) > 0, then this is equivalent to
                                  P (A|B) = P (A),
and also equivalent to P (B|A) = P (B).
In words, two events are independent if we can obtain the probability of their
intersection by multiplying their individual probabilities. Alternatively, A and B
are independent if learning that B occurred gives us no information that would
change our probabilities for A occurring (and vice versa).
Note that independence is a symmetric relation: if A is independent of B, then B
is independent of A.
h 2.5.2. Independence is completely different from disjointness. If A and B are
disjoint, then P (A ∩ B) = 0, so disjoint events can be independent only if P (A) = 0
or P (B) = 0. Knowing that A occurs tells us that B definitely did not occur, so A
clearly conveys information about B, meaning the two events are not independent
(except if A or B already has zero probability).
Intuitively, it makes sense that if A provides no information about whether or not
B occurred, then it also provides no information about whether or not B c occurred.
We now prove a handy result along those lines.


64                                                          Introduction to Probability

Proposition 2.5.3. If A and B are independent, then A and B c are independent,
Ac and B are independent, and Ac and B c are independent.

Proof. Let A and B be independent. We will first show that A and B c are indepen-
dent. If P (A) = 0, then A is independent of every event, including B c . So assume
P (A) 6= 0. Then

                  P (B c |A) = 1 − P (B|A) = 1 − P (B) = P (B c ),

so A and B c are independent. Swapping the roles of A and B, we have that Ac and B
are independent. Using the fact that A, B independent implies A, B c independent,
with Ac playing the role of A, we also have that Ac and B c are independent.     

We also often need to talk about independence of three or more events.
Definition 2.5.4 (Independence of three events). Events A, B, and C are said to
be independent if all of the following equations hold:

                             P (A ∩ B) = P (A)P (B),
                             P (A ∩ C) = P (A)P (C),
                             P (B ∩ C) = P (B)P (C),
                         P (A ∩ B ∩ C) = P (A)P (B)P (C).


If the first three conditions hold, we say that A, B, and C are pairwise independent.
Pairwise independence does not imply independence: it is possible that just learning
about A or just learning about B is of no use in predicting whether C occurred,
but learning that both A and B occurred could still be highly relevant for C. Here
is a simple example of this distinction.
Example 2.5.5 (Pairwise independence doesn’t imply independence). Consider
two fair, independent coin tosses, and let A be the event that the first is Heads,
B the event that the second is Heads, and C the event that both tosses have the
same result. Then A, B, and C are pairwise independent but not independent, since
P (A ∩ B ∩ C) = 1/4 while P (A)P (B)P (C) = 1/8. The point is that just knowing
about A or just knowing about B tells us nothing about C, but knowing what
happened with both A and B gives us information about C (in fact, in this case it
gives us perfect information about C).                                          
On the other hand, P (A ∩ B ∩ C) = P (A)P (B)P (C) does not imply pairwise
independence; this can be seen quickly by looking at the extreme case P (A) = 0,
when the equation becomes 0 = 0, which tells us nothing about B and C.
We can define independence of any number of events similarly. Intuitively, the idea
is that knowing what happened with any particular subset of the events gives us no
information about what happened with the events not in that subset.


Conditional probability                                                                65

Definition 2.5.6 (Independence of many events). For n events A1 , A2 , . . . , An to
be independent, we require any pair to satisfy P (Ai ∩ Aj ) = P (Ai )P (Aj ) (for i 6= j),
any triplet to satisfy P (Ai ∩ Aj ∩ Ak ) = P (Ai )P (Aj )P (Ak ) (for i, j, k distinct),
and similarly for all quadruplets, quintuplets, and so on. This can quickly become
unwieldy, but later we will discuss other ways to think about independence. For
infinitely many events, we say that they are independent if every finite subset of the
events is independent.

Conditional independence is defined analogously to independence.

Definition 2.5.7 (Conditional independence). Events A and B are said to be
conditionally independent given E if P (A ∩ B|E) = P (A|E)P (B|E).

h 2.5.8. It is easy to make terrible blunders stemming from confusing independence
and conditional independence. Two events can be conditionally independent given
E, but not independent given E c . Two events can be conditionally independent
given E, but not independent. Two events can be independent, but not conditionally
independent given E.

In particular, P (A, B) = P (A)P (B) does not imply P (A, B|E) = P (A|E)P (B|E);
we can’t just insert “given E” everywhere, as we did in going from LOTP to LOTP
with extra conditioning. This is because LOTP always holds (it is a consequence
of the axioms of probability), whereas P (A, B) may or may not equal P (A)P (B),
depending on what A and B are.

The next few examples illustrate these distinctions. Great care is needed in working
with conditional probabilities and conditional independence!

Example 2.5.9 (Conditional independence given E vs. given E c ). Suppose there
are two types of classes: good classes and bad classes. In good classes, if you work
hard, you are very likely to get an A. In bad classes, the professor randomly assigns
grades to students regardless of their effort. Let G be the event that a class is good,
W be the event that you work hard, and A be the event that you receive an A. Then
W and A are conditionally independent given Gc , but they are not conditionally
independent given G.                                                                 

Example 2.5.10 (Conditional independence doesn’t imply independence). Return-
ing once more to the scenario from Example 2.3.7, suppose we have chosen either a
fair coin or a biased coin with probability 3/4 of Heads, but we do not know which
one we have chosen. We flip the coin a number of times. Conditional on choosing
the fair coin, the coin tosses are independent, with each toss having probability 1/2
of Heads. Similarly, conditional on choosing the biased coin, the tosses are indepen-
dent, each with probability 3/4 of Heads.

However, the coin tosses are not unconditionally independent, because if we don’t
know which coin we’ve chosen, then observing the sequence of tosses gives us infor-
mation about whether we have the fair coin or the biased coin in our hand. This in
turn helps us to predict the outcomes of future tosses from the same coin.


66                                                          Introduction to Probability

To state this formally, let F be the event that we’ve chosen the fair coin, and let A1
and A2 be the events that the first and second coin tosses land Heads. Conditional on
F , A1 and A2 are independent, but A1 and A2 are not unconditionally independent
because A1 provides information about A2 .                                           
Example 2.5.11 (Independence doesn’t imply conditional independence). My
friends Alice and Bob are the only two people who ever call me on the phone. Each
day, they decide independently whether to call me that day. Let A be the event
that Alice calls me next Friday and B be the event that Bob calls me next Friday.
Assume A and B are unconditionally independent with P (A) > 0 and P (B) > 0.
However, given that I receive exactly one call next Friday, A and B are no longer
independent: the call is from Alice if and only if it is not from Bob. In other words,
letting C be the event that I receive exactly one call next Friday, P (B|C) > 0 while
P (B|A, C) = 0, so A and B are not conditionally independent given C.               
Example 2.5.12. (Why is the baby crying?) A certain baby cries if and only if she
is hungry, tired, or both. Let C be the event that the baby is crying, H be the event
that she is hungry, and T be the event that she is tired. Let P (C) = c, P (H) = h,
and P (T ) = t, where none of c, h, t are equal to 0 or 1. Let H and T be independent.
(a) Find c, in terms of h and t.
(b) Find P (H|C), P (T |C), and P (H, T |C).
(c) Are H and T conditionally independent given C? Explain in two ways: alge-
braically using the quantities from (b), and with an intuitive explanation in words.
Solution:
(a) Since H and T are independent, we have

            P (C) = P (H ∪ T ) = P (H) + P (T ) − P (H ∩ T ) = h + t − ht.

(b) By Bayes’ rule,
                                     P (C|H)P (H)      h
                         P (H|C) =                  = ,
                                         P (C)          c
                                     P (C|T )P (T )   t
                          P (T |C) =                = ,
                                         P (C)        c
                                     P (C|H, T )P (H, T )  ht
                       P (H, T |C) =                      = .
                                            P (C)          c

(c) No, H and T are not conditionally independent given C, since
                                      ht  ht
                      P (H, T |C) =      < 2 = P (H|C)P (T |C).
                                      c   c
We can also see intuitively why they are not conditionally independent given C: if
the baby is crying but not hungry, she must be tired.                          


Conditional probability                                                            67




2.6    Coherency of Bayes’ rule

An important property of Bayes’ rule is that it is coherent: if we receive multiple
pieces of information and wish to update our probabilities to incorporate all the
information, it does not matter whether we update sequentially, taking each piece
of evidence into account one at a time, or simultaneously, using all the evidence
at once. Suppose, for example, that we’re conducting a weeklong experiment that
yields data at the end of each day. We could use Bayes’ rule every day to update
our probabilities based on the data from that day. Or we could go on vacation for
the week, come back on Friday afternoon, and update using the entire week’s worth
of data. Either method will give the same result.
Let’s look at a concrete application of this principle.
Example 2.6.1 (Testing for a rare disease, continued). Fred, who tested positive
for conditionitis in Example 2.3.9, decides to get tested a second time. The new
test is independent of the original test (given his disease status) and has the same
sensitivity and specificity. Unfortunately for Fred, he tests positive a second time.
Find the probability that Fred has the disease, given the evidence, in two ways: in
one step, conditioning on both test results simultaneously, and in two steps, first
updating the probabilities based on the first test result, and then updating again
based on the second test result.
Solution:
Let D be the event that he has the disease, T1 that the first test result is positive,
and T2 that the second test result is positive. In Example 2.3.9, we used Bayes’ rule
and the law of total probability to find P (D|T1 ). Another quick solution uses the
odds form of Bayes’ rule:
                  P (D|T1 )    P (D) P (T1 |D)     1 0.95
                      c
                             =     c          c
                                                 =   ·     ≈ 0.19.
                  P (D |T1 )   P (D ) P (T1 |D )   99 0.05
Since P (D|T1 )/(1 − P (D|T1 )) = 0.19, we have P (D|T1 ) = 0.19/(1 + 0.19) ≈ 0.16,
in agreement with our answer from before. The odds form of Bayes’ rule is faster
in this case because we don’t need to compute the unconditional probability P (T1 )
in the denominator of the ordinary Bayes’ rule. Now, again using the odds form of
Bayes’ rule, let’s find out what happens if Fred tests positive a second time.
One-step method : Updating based on both test results at once, we have
                     P (D|T1 ∩ T2 )    P (D) P (T1 ∩ T2 |D)
                         c
                                     =
                     P (D |T1 ∩ T2 )   P (Dc ) P (T1 ∩ T2 |Dc )
                                       1 0.952       361
                                     =    ·        =       ≈ 3.646,
                                       99 0.052       99
which corresponds to a probability of 0.78.


68                                                            Introduction to Probability

Two-step method : After the first test, the posterior odds of Fred having the disease
are
                            P (D|T1 )     1 0.95
                                        =   ·     ≈ 0.19,
                            P (Dc |T1 )   99 0.05

from the above. These posterior odds become the new prior odds, and then updating
based on the second test gives


                P (D|T1 ∩ T2 )     P (D|T1 ) P (T2 |D, T1 )
                                 =
                P (Dc |T1 ∩ T2 )   P (Dc |T1 ) P (T2 |Dc , T1 )
                                              
                                      1 0.95 0.95           361
                                 =     ·               =        ≈ 3.646,
                                     99 0.05 0.05           99


which is the same result as above.

Note that with a second positive test result, the probability that Fred has the disease
jumps from 0.16 to 0.78, making us much more confident that Fred is actually
afflicted with conditionitis. The moral of the story is that getting a second opinion
is a good idea!                                                                      




2.7     Conditioning as a problem-solving tool

Conditioning is a powerful tool for solving problems because it lets us engage in
wishful thinking: when we encounter a problem that would be made easier if only
we knew whether E happened or not, we can condition on E and then on E c ,
consider these possibilities separately, then combine them using LOTP.



2.7.1    Strategy: condition on what you wish you knew


Example 2.7.1 (Monty Hall). On the game show Let’s Make a Deal, hosted by
Monty Hall, a contestant chooses one of three closed doors, two of which have a goat
behind them and one of which has a car. Monty, who knows where the car is, then
opens one of the two remaining doors. The door he opens always has a goat behind
it (he never reveals the car!). If he has a choice, then he picks a door at random
with equal probabilities. Monty then offers the contestant the option of switching
to the other unopened door. If the contestant’s goal is to get the car, should she
switch doors?


Conditional probability                                                               69

                            1                 2               3




Solution:
Let’s label the doors 1 through 3. Without loss of generality, we can assume the
contestant picked door 1 (if she didn’t pick door 1, we could simply relabel the
doors, or rewrite this solution with the door numbers permuted). Monty opens
a door, revealing a goat. As the contestant decides whether or not to switch to
the remaining unopened door, what does she really wish she knew? Naturally, her
decision would be a lot easier if she knew where the car was! This suggests that
we should condition on the location of the car. Let Ci be the event that the car is
behind door i, for i = 1, 2, 3. By the law of total probability,

                                        1                    1                   1
      P (get car) = P (get car|C1 ) ·     + P (get car|C2 ) · + P (get car|C3 ) · .
                                        3                    3                   3
Suppose the contestant employs the switching strategy. If the car is behind door 1,
then switching will fail, so P (get car|C1 ) = 0. If the car is behind door 2 or 3, then
because Monty always reveals a goat, the remaining unopened door must contain
the car, so switching will succeed. Thus,

                                              1    1   1 2
                          P (get car) = 0 ·     +1· +1· = ,
                                              3    3   3 3
so the switching strategy succeeds 2/3 of the time. The contestant should switch to
the other door.
Figure 2.5 is a tree diagram of the argument we have just outlined: using the switch-
ing strategy, the contestant will win as long as the car is behind doors 2 or 3, which
has probability 2/3. We can also give an intuitive frequentist argument in favor of
switching. Imagine playing this game 1000 times. Typically, about 333 times your
initial guess for the car’s location will be correct, in which case switching will fail.
The other 667 or so times, you will win by switching.
There’s a subtlety though, which is that when the contestant chooses whether to
switch, she also knows which door Monty opened. We showed that the unconditional
probability of success is 2/3 (when following the switching strategy), but let’s also
show that the conditional probability of success for switching, given the information
that Monty provides, is also 2/3.
Let Mj be the event that Monty opens door j, for j = 2, 3. Then

             P (get car) = P (get car|M2 )P (M2 ) + P (get car|M3 )P (M3 ),


70                                                           Introduction to Probability

               You              Car is          Monty     Outcome if
              choose:          behind:          opens:    you switch:


                                         1/2    door 2                  1/6

                               door 1
                                         1/2    door 3                  1/6
                        1/3


                        1/3               1
              door 1           door 2           door 3                  1/3



                        1/3
                                          1                             1/3
                               door 3           door 2


FIGURE 2.5
Tree diagram of Monty Hall problem. Switching gets the car 2/3 of the time.


where by symmetry P (M2 ) = P (M3 ) = 1/2 and P (get car|M2 ) = P (get car|M3 ).
The symmetry here is that there is nothing in the statement of the problem that
distinguishes between door 2 and door 3; in contrast, Problem 40 considers a scenario
where Monty enjoys opening door 2 more than he enjoys opening door 3.
Let x = P (get car|M2 ) = P (get car|M3 ). Plugging in what we know,
                              2                x x
                                = P (get car) = + = x,
                              3                2 2
as claimed.
Bayes’ rule also works nicely for finding the conditional probability of success using
the switching strategy, given the evidence. Suppose that Monty opens door 2. Using
the notation and results above,

                                  P (M2 |C1 )P (C1 )   (1/2)(1/3)  1
                  P (C1 |M2 ) =                      =            = .
                                      P (M2 )             1/2      3

So given that Monty opens door 2, there is a 1/3 chance that the contestant’s
original choice of door has the car, which means that there is a 2/3 chance that the
switching strategy will succeed.
Many people, upon seeing this problem for the first time, argue that there is no
advantage to switching: “There are two doors remaining, and one of them has
the car, so the chances are 50-50.” After the last chapter, we recognize that this
argument misapplies the naive definition of probability. Yet the naive definition,
even when inappropriate, has a powerful hold on people’s intuitions. When Marilyn
vos Savant presented a correct solution to the Monty Hall problem in her column


Conditional probability                                                            71

for Parade magazine in 1990, she received thousands upon thousands of letters from
readers (even mathematicians) insisting that she was wrong.

To build correct intuition, let’s consider an extreme case. Suppose that there are
a million doors, 999,999 of which contain goats and 1 of which has a car. After
the contestant’s initial pick, Monty opens 999,998 doors with goats behind them
and offers the choice to switch. In this extreme case, it becomes clear that the
probabilities are not 50-50 for the two unopened doors; very few people would
stubbornly stick with their original choice. The same is true for the three-door case.

Just as we had to make assumptions about how we came across the random girl in
Example 2.2.6, here the 2/3 success rate of the switching strategy depends on the
assumptions we make about how Monty decides which door to open. In the exercises,
we consider several variants and generalizations of the Monty Hall problem, some
of which change the desirability of the switching strategy.                    


2.7.2   Strategy: condition on the first step

In problems with a recursive structure, it can often be useful to condition on the
first step of the experiment. The next two examples apply this strategy, which we
call first-step analysis.

Example 2.7.2 (Branching process). A single amoeba, Bobo, lives in a pond. After
one minute Bobo will either die, split into two amoebas, or stay the same, with equal
probability, and in subsequent minutes all living amoebas will behave the same way,
independently. What is the probability that the amoeba population will eventually
die out?




                           1/3                 1/3
                                       1/3




                                 ...            ...     ...

Solution:

Let D be the event that the population eventually dies out; we want to find P (D).
We proceed by conditioning on the outcome at the first step: let Bi be the event
that Bobo turns into i amoebas after the first minute, for i = 0, 1, 2. We know
P (D|B0 ) = 1 and P (D|B1 ) = P (D) (if Bobo stays the same, we’re back to where
we started). If Bobo splits into two, then we just have two independent versions


72                                                               Introduction to Probability

of our original problem! We need both of the offspring to eventually die out, so
P (D|B2 ) = P (D)2 . Now we have exhausted all the possible cases and can combine
them with the law of total probability:

                                    1              1              1
                 P (D) = P (D|B0 ) ·  + P (D|B1 ) · + P (D|B2 ) ·
                                    3              3              3
                              1         1            1
                         = 1 · + P (D) · + P (D)2 · .
                              3         3            3

Solving for P (D) gives P (D) = 1: the amoeba population will die out with proba-
bility 1.

The strategy of first-step analysis works here because the problem is self-similar in
nature: when Bobo continues as a single amoeba or splits into two, we end up with
another version or another two versions of our original problem. Conditioning on
the first step allows us to express P (D) in terms of itself.                      

Example 2.7.3 (Gambler’s ruin). Two gamblers, A and B, make a sequence of
$1 bets. In each bet, gambler A has probability p of winning, and gambler B has
probability q = 1 − p of winning. Gambler A starts with i dollars and gambler B
starts with N − i dollars; the total wealth between the two remains constant since
every time A loses a dollar, the dollar goes to B, and vice versa.

We can visualize this game as a random walk on the integers between 0 and N ,
where p is the probability of going to the right in a given step: imagine a person
who starts at position i and, at each time step, moves one step to the right with
probability p and one step to the left with probability q = 1 − p. The game ends
when either A or B is ruined, i.e., when the random walk reaches 0 or N . What is
the probability that A wins the game (walking away with all the money)?

                                                       p




             0       1        2    ...   i–1       i       i+1     ...     N


                                               q

Solution:

We recognize that this game, like Bobo’s reproductive process, has a recursive struc-
ture: after the first step, it’s exactly the same game, except that A’s wealth is now
either i + 1 or i − 1. Let pi be the probability that A wins the game, given that A
starts with i dollars. We will use first-step analysis to solve for the pi . Let W be
the event that A wins the game. By LOTP, conditioning on the outcome of the first


Conditional probability                                                              73

round, we have

 pi = P (W |A starts at i, wins round 1) · p + P (W |A starts at i, loses round 1) · q
    = P (W |A starts at i + 1) · p + P (W |A starts at i − 1) · q
    = pi+1 · p + pi−1 · q.

This must be true for all i from 1 to N −1, and we also have the boundary conditions
p0 = 0 and pN = 1. Now we can solve this equation, called a difference equation, to
obtain the pi . Section A.4 of the math appendix discusses how to solve difference
equations, so we will omit some of the steps here.
The characteristic equation of the difference equation is px2 − x + q = 0, which has
roots 1 and q/p. If p 6= 1/2, these roots are distinct, and the general solution is
                                                     i
                                               i     q
                                   pi = a · 1 + b ·      .
                                                     p

Using the boundary conditions p0 = 0 and pN = 1, we get
                                                         1
                                   a = −b =               N ,
                                                          q
                                                   1−     p

and we simply plug these back in to get the specific solution. If p = 1/2, the roots
of the characteristic polynomial are not distinct, so the general solution is

                                   pi = a · 1i + b · i · 1i .

The boundary conditions give a = 0 and b = 1/N .
In summary, the probability of A winning with a starting wealth of i is
                                    i
                                     q
                                1− pN if p 6= 1/2,
                          pi =    1− pq
                               
                                i
                                  N       if p = 1/2.

The p = 1/2 case is consistent with the p 6= 1/2 case, in the sense that

                                           1 − ( pq )i        i
                                    lim1       q    = .
                                    p→ 2 1 − ( p )N  N

To see this, let x = q/p and let x approach 1. By L’Hôpital’s rule,

                                 1 − xi         ixi−1    i
                             lim       N
                                         = lim     N −1
                                                        = .
                             x→1 1 − x     x→1 N x       N

The answer for the p = 1/2 case has a simple interpretation: A’s probability of
winning equals the proportion of the wealth that A starts out with. So if p = 1/2


74                                                          Introduction to Probability

and A starts out with much less money than B, then A’s chance of winning the
game is low. Having p < 1/2 may also make A’s chance of winning low, even if p
is only a little bit less than 1/2 and the players start out with the same amount of
money. For example, if p = 0.49 and each player starts out with $100, then A has
only about a 1.8% chance of winning the game.
We have focused on the probability of A winning the game, but what about B?
Rather than starting from scratch, we can use symmetry: aside from notation, there
is nothing in the description of the game to distinguish A from B. By symmetry, the
probability of B winning from a starting wealth of N − i is obtained by switching
the roles of q and p, and of i and N − i. This gives
                                                  N −i
                                                   p
                                               1− q N    if p 6= 1/2,
             P (B wins|B starts at N − i) =       1−   p

                                              
                                               N −i
                                                       q


                                                  N         if p = 1/2.

It can then be verified that for all i and all p, P (A wins) + P (B wins) = 1, so the
game is guaranteed to end: the probability is 0 that it will oscillate forever.    




2.8   Pitfalls and paradoxes

The next two examples are fallacies of conditional thinking that have arisen in the
legal context. The prosecutor’s fallacy is the confusion of P (A|B) with P (B|A); the
defense attorney’s fallacy is the failure to condition on all the evidence.
h 2.8.1 (Prosecutor’s fallacy). In 1998, Sally Clark was tried for murder after
two of her sons died shortly after birth. During the trial, an expert witness for
the prosecution testified that the probability of a newborn dying of sudden infant
death syndrome (SIDS) was 1/8500, so the probability of two deaths due to SIDS
in one family was (1/8500)2 , or about one in 73 million. Therefore, he continued,
the probability of Clark’s innocence was one in 73 million.
There are at least two major problems with this line of reasoning. First, the expert
witness found the probability of the intersection of “first son dies of SIDS” and
“second son dies of SIDS” by multiplying the individual event probabilities; as we
know, this is only valid if deaths due to SIDS are independent within a family. This
independence would not hold if genetic or other family-specific risk factors cause all
newborns within certain families to be at increased risk of SIDS.
Second, the so-called expert has confused two different conditional probabilities:
P (innocence|evidence) is different from P (evidence|innocence). The witness claims
that the probability of observing two newborn deaths if the defendant were innocent
is extremely low; that is, P (evidence|innocence) is small. What we are interested in,


Conditional probability                                                            75

however, is P (innocence|evidence), the probability that the defendant is innocent
given all the evidence. By Bayes’ rule,

                                      P (evidence|innocence)P (innocence)
           P (innocence|evidence) =                                       ,
                                                  P (evidence)

so to calculate the conditional probability of innocence given the evidence, we must
take into account P (innocence), the prior probability of innocence. This probability
is extremely high: although double deaths due to SIDS are rare, so are double
infanticides! Expanding the denominator as

          P (evidence|innocence)P (innocence) + P (evidence|guilt)P (guilt),

note that if P (guilt) is small enough so that the second term is negligible compared
to the first term, then the denominator of P (innocence|evidence) is approximately
equal to the numerator, making P (innocence|evidence) close to 1.
The posterior probability of innocence given the evidence depends strongly on both
P (evidence|innocence), which is very low, and P (innocence), which is very high.
The expert’s probability of (1/8500)2 , questionable in and of itself, is only part of
the equation.
Sadly, Clark was convicted of murder and sent to prison, partly based on the expert’s
wrongheaded testimony, and spent over three years in jail before her conviction was
overturned. The outcry over the misuse of conditional probability in the Sally Clark
case led to the review of hundreds of other cases where similar faulty logic was used
by the prosecution.
h 2.8.2 (Defense attorney’s fallacy). A woman has been murdered, and her husband
is put on trial for this crime. Evidence comes to light that the defendant had a
history of abusing his wife. The defense attorney argues that the evidence of abuse
should be excluded on grounds of irrelevance, since only 1 in 10,000 men with wives
they abuse subsequently murder their wives. Should the judge grant the defense
attorney’s motion to bar this evidence from trial?
Suppose that the defense attorney’s 1-in-10,000 figure is correct, and further assume
the following for a relevant population of husbands and wives: 1 in 10 husbands abuse
their wives, 1 in 5 murdered wives were murdered by their husbands, and 50% of
husbands who murder their wives previously abused them. Also, assume that if the
husband of a murdered wife is not guilty of the murder, then the probability that
he abused his wife reverts to the unconditional probability of abuse.
How to define the “relevant population” and how to estimate such probabilities
are difficult issues. For example, should we look at citywide, statewide, national, or
international statistics? How should we account for unreported abuse and unsolved
murders? What if murder rates are changing over time? For this problem, assume
that a reasonable choice of the relevant population has been agreed on, and that
the stated probabilities are known to be correct.


76                                                           Introduction to Probability

Let A be the event that the husband commits abuse against his wife, and let G be the
event that the husband is guilty. The defense’s argument is that P (G|A) = 1/10,000,
so guilt is still extremely unlikely conditional on a previous history of abuse.
However, the defense attorney fails to condition on a crucial fact: in this case, we
know that the wife was murdered. Therefore, the relevant probability is not P (G|A),
but P (G|A, M ), where M is the event that the wife was murdered.
Bayes’ rule with extra conditioning gives

                                           P (A|G, M )P (G|M )
            P (G|A, M ) =
                           P (A|G, M )P (G|M ) + P (A|Gc , M )P (Gc |M )
                                  0.5 · 0.2
                         =
                           0.5 · 0.2 + 0.1 · 0.8
                           5
                         = .
                           9
So the posterior probability of guilt, P (G|A, M ), is over 5,000 times as large as the
quantity P (G|A) that the defense attorney focused on. Conditioning on the evidence
of abuse increases the probability of guilt from P (G|M ) = 0.2 to P (G|A, M ) ≈ 0.56,
so the defendant’s history of abuse gives very important information, contrary to
the defense attorney’s argument.
In the above calculation of P (G|A, M ), we did not use the defense attorney’s P (G|A)
number anywhere; it is irrelevant to our calculation because it does not account for
the fact that the wife was murdered. We must condition on all the evidence.
We end this chapter with a paradox about conditional probability and aggregation
of data.
Example 2.8.3 (Simpson’s paradox). Two doctors, Dr. Hibbert and Dr. Nick, each
perform two types of surgeries: heart surgery and Band-Aid removal. Each surgery
can be either a success or a failure. The two doctors’ respective records are given in
the following tables, and shown graphically in Figure 2.6, where white dots represent
successful surgeries and black dots represent failed surgeries.

                Heart Band-Aid                              Heart Band-Aid
     Success      70          10                 Success       2          81
     Failure      20           0                 Failure       8           9

               Dr. Hibbert                                  Dr. Nick
Dr. Hibbert had a higher success rate than Dr. Nick in heart surgeries: 70 out of 90
versus 2 out of 10. Dr. Hibbert also had a higher success rate in Band-Aid removal:
10 out of 10 versus 81 out of 90. But if we aggregate across the two types of surgeries
to compare overall surgery success rates, Dr. Hibbert was successful in 80 out of
100 surgeries while Dr. Nick was successful in 83 out of 100 surgeries: Dr. Nick’s
overall success rate is higher!


Conditional probability                                                               77




              heart




             band-aid




                                Dr. Hibbert                        Dr. Nick


FIGURE 2.6
An example of Simpson’s paradox. White dots represent successful surgeries and
black dots represent failed surgeries. Dr. Hibbert is better in both types of surgery
but has a lower overall success rate, because he is performing the harder type of
surgery much more often than Dr. Nick is.

What’s happening is that Dr. Hibbert, presumably due to his reputation as the
superior doctor, is performing a greater number of heart surgeries, which are inher-
ently riskier than Band-Aid removals. His overall success rate is lower not because
of lesser skill on any particular type of surgery, but because a larger fraction of his
surgeries are risky.
Let’s use event notation to make this precise. For events A, B, and C, we say that
we have a Simpson’s paradox if
                                 P (A|B, C) < P (A|B c , C)
                               P (A|B, C c ) < P (A|B c , C c ),
but
                                    P (A|B) > P (A|B c ).
In this case, let A be the event of a successful surgery, B be the event that Dr. Nick
is the surgeon, and C be the event that the surgery is a heart surgery. The conditions
for Simpson’s paradox are fulfilled because the probability of a successful surgery
is lower under Dr. Nick than under Dr. Hibbert whether we condition on heart
surgery or on Band-Aid removal, but the overall probability of success is higher for
Dr. Nick.
The law of total probability tells us mathematically why this can happen:
               P (A|B) = P (A|C, B)P (C|B) + P (A|C c , B)P (C c |B)
              P (A|B c ) = P (A|C, B c )P (C|B c ) + P (A|C c , B c )P (C c |B c ).


78                                                                 Introduction to Probability

The above equations express P (A|B) as a weighted average of P (A|C, B) and
P (A|C c , B), and P (A|B c ) as a weighted average of P (A|C, B c ) and P (A|C c , B c ). If
the corresponding weights were the same in both of these weighted averages, then
Simpson’s paradox could not occur. But the weights here are different:

                    P (C|B) < P (C|B c ) and P (C c |B) > P (C c |B c ),

since Dr. Nick is much less likely than Dr. Hibbert to be performing a heart surgery.
Although we have
                                P (A|C, B) < P (A|C, B c )
and
                               P (A|C c , B) < P (A|C c , B c ),
the fact that the weights are so different results in the inequality flipping when we
do not condition on whether or not C occurred:

                                   P (A|B) > P (A|B c ).

Numerically, the two weighted averages are

                     P (A|B) = 0.83 = (2/10) · 0.1 + (81/90) · 0.9
                    P (A|B c ) = 0.80 = (70/90) · 0.9 + (10/10) · 0.1.

The first equation (corresponding to Dr. Nick) puts much more weight on the second
term (corresponding to the easier surgery) than does the second equation.
Aggregation across different types of surgeries presents a misleading picture of the
doctors’ abilities because we lose the information about which doctor tends to per-
form which type of surgery. When we think confounding variables like surgery type
could be at play, we should examine the disaggregated data to see what is really
going on.
Simpson’s paradox arises in many real-world contexts. In the following examples,
you should try to identify the events A, B, and C that create the paradox.
• Gender discrimination in college admissions: In the 1970s, men were significantly
  more likely than women to be admitted for graduate study at the University of
  California, Berkeley, leading to charges of gender discrimination. Yet within most
  individual departments, women were admitted at a higher rate than men. It was
  found that women tended to apply to the departments with more competitive
  admissions, while men tended to apply to less competitive departments.
• Baseball batting averages: It is possible for player 1 to have a higher batting average
  than player 2 in the first half of a baseball season and a higher batting average
  than player 2 in the second half of the season, yet have a lower overall batting
  average for the entire season. It depends on how many at-bats the players have
  in each half of the season. (An at-bat is when it’s a player’s turn to try to hit the
  ball; the player’s batting average is the number of hits the player gets divided by
  the player’s number of at-bats.)


Conditional probability                                                              79

• Health effects of smoking: Cochran [4] found that within any age group, cigarette
  smokers had higher mortality rates than cigar smokers, but because cigarette smok-
  ers were on average younger than cigar smokers, overall mortality rates were lower
  for cigarette smokers.                                                          




2.9    Recap

The conditional probability of A given B is

                                             P (A ∩ B)
                               P (A|B) =               .
                                               P (B)

Conditional probability has exactly the same properties as probability, but P (·|B)
updates our uncertainty about events to reflect the observed evidence B. Events
whose probabilities are unchanged after observing the evidence B are said to be
independent of B. Two events can also be conditionally independent given a third
event E. Conditional independence does not imply unconditional independence, nor
does unconditional independence imply conditional independence.
Two important results about conditional probability are Bayes’ rule, which relates
P (A|B) to P (B|A), and the law of total probability, which allows us to get uncon-
ditional probabilities by partitioning the sample space and calculating conditional
probabilities within each slice of the partition.
Bayes’ rule says that
                                            P (B|A)P (A)
                             P (A|B) =                   ,
                                                P (B)
while LOTP says that
                                      n
                                      X
                            P (B) =         P (B|Ai )P (Ai ),
                                      i=1

for any partition A1 , . . . , An of the sample space. Bayes’ rule and LOTP are often
used in tandem.
Conditioning is extremely helpful for problem-solving because it allows us to break a
problem into smaller pieces, consider all possible cases separately, and then combine
them. When using this strategy, we should try to condition on the information that,
if known, would make the problem simpler, hence the saying condition on what
you wish you knew. When a problem involves multiple stages, it can be helpful to
condition on the first step to obtain a recursive relationship.
Common mistakes in thinking conditionally include:
• confusion of the prior probability P (A) with the posterior probability P (A|B);


80                                                             Introduction to Probability

• the prosecutor’s fallacy, confusing P (A|B) with P (B|A);
• the defense attorney’s fallacy, failing to condition on all the evidence;
• unawareness of Simpson’s paradox and the importance of thinking carefully about
  whether to aggregate data.
Figure 2.7 illustrates how probabilities can be updated as new evidence comes in
sequentially. Imagine that there is some event A that we are interested in. On
Monday morning, for example, our prior probability for A is P (A). If we observe on
Monday afternoon that B occurred, then we can use Bayes’ rule (or the definition
of conditional probability) to compute the posterior probability P (A|B).
We use this posterior probability for A as the new prior on Tuesday morning, and
then we continue to collect evidence. Suppose that on Tuesday we observe that C
occurred. Then we can compute the new posterior probability P (A|B, C) in various
ways (in this context, probably the most natural way is to use Bayes’ rule with
extra conditioning on B). This in turn becomes the new prior if we are going to
continue to collect evidence.




2.10     R

Simulating the frequentist interpretation

Recall that the frequentist interpretation of conditional probability based on a large
number n of repetitions of an experiment is P (A|B) ≈ nAB /nB , where nAB is the
number of times that A ∩ B occurs and nB is the number of times that B occurs.
Let’s try this out by simulation, and verify the results of Example 2.2.5. So let’s
simulate n families, each with two children.
n <- 10^5
child1 <- sample(2,n,replace=TRUE)
child2 <- sample(2,n,replace=TRUE)
Here child1 is a vector of length n, where each element is a 1 or a 2. Letting 1 stand
for “girl” and 2 stand for “boy”, this vector represents the gender of the elder child
in each of the n families. Similarly, child2 represents the gender of the younger
child in each family.
Alternatively, we could have used
sample(c("girl","boy"),n,replace=TRUE)
but it is more convenient working with numerical values.
Let A be the event that both children are girls and B the event that the elder is a girl.


Conditional probability                                                               81




                   What can
Monday             happen?

                          events                                 numbers

                     A, B, C                        P (A)
                                                  (Monday’s prior for A)
              We learn on Monday         P
              that B occurred.                             P (A, B)    P (B|A)P (A)
                                                 P (A|B) =          =
                                                            P (B)          P (B)
                                                  (Monday’s posterior for A)




                    What can
 Tuesday            happen?


                          events                                 numbers

                     A, B, C                       P (A|B)
                We already know                  (Tuesday’s prior for A)
                that B occurred.         P
                                                              P (A, B, C)
                We learn on Tuesday               P (A|B, C) =
                                                                P (B, C)
                that C occurred.
                                                              P (C|A, B)P (A|B)
                                                            =
                                                                    P (C|B)
                                                 (Tuesday’s posterior for A)


FIGURE 2.7
Conditional probability tells us how to update probabilities as new evidence comes
in. Shown are the probabilities for an event A initially, after obtaining one piece of
evidence B, and after obtaining a second piece of evidence C. The posterior for A
after observing the first piece of evidence becomes the new prior before observing
the second piece of evidence. After both B and C are observed, a new posterior for
A can be found in various ways. This then becomes the new prior if more evidence
will be collected.


82                                                         Introduction to Probability

Following the frequentist interpretation, we count the number of repetitions where
B occurred and name it n.b, and we also count the number of repetitions where
A ∩ B occurred and name it n.ab. Finally, we divide n.ab by n.b to approximate
P (A|B).
n.b <- sum(child1==1)
n.ab <- sum(child1==1 & child2==1)
n.ab/n.b
The ampersand & is an elementwise AND, so n.ab is the number of families where
both the first child and the second child are girls. When we ran this code, we got
0.50, which agrees with P (both girls|elder is a girl) = 1/2.
Now let A be the event that both children are girls and B the event that at least
one of the children is a girl. Then A ∩ B is the same, but n.b needs to count the
number of families where at least one child is a girl. This is accomplished with the
elementwise OR operator | (this is not a conditioning bar; it is an inclusive OR,
returning TRUE if at least one element is TRUE).
n.b <- sum(child1==1 | child2==1)
n.ab <- sum(child1==1 & child2==1)
n.ab/n.b
We got 0.33, which agrees with P (both girls|at least one girl) = 1/3.


Monty Hall simulation

Many long, bitter debates about the Monty Hall problem could have been averted
by trying it out with a simulation. To study how well the never-switch strategy per-
forms, let’s generate 105 runs of the Monty Hall game. To simplify notation, assume
the contestant always chooses door 1. Then we can generate a vector specifying
which door has the car for each repetition:
n <- 10^5
cardoor <- sample(3,n,replace=TRUE)
At this point we could generate the vector specifying which doors Monty opens,
but that’s unnecessary since the never-switch strategy succeeds if and only if door
1 has the car! So the fraction of times when the never-switch strategy succeeds is
sum(cardoor==1)/n, which was 0.334 in our simulation. This is very close to the
true value, 1/3.
What if we want to play the Monty Hall game interactively? We can do this by
programming a function. Entering the following code in R defines a function called
monty, which can then be invoked by entering the command monty() any time you
feel like playing the game!


Conditional probability                                                      83

monty <- function() {
    doors <- 1:3

     # randomly pick where the car is
     cardoor <- sample(doors,1)

     # prompt player
     print("Monty Hall says ‘Pick a door, any door!’")

     # receive the player’s choice of door (should be 1,2, or 3)
     chosen <- scan(what = integer(), nlines = 1, quiet = TRUE)

     # pick Monty’s door (can’t be the player’s door or the car door)
     if (chosen != cardoor) montydoor <- doors[-c(chosen, cardoor)]
     else montydoor <- sample(doors[-chosen],1)

     # find out whether the player wants to switch doors
     print(paste("Monty opens door ", montydoor, "!", sep=""))
     print("Would you like to switch (y/n)?")
     reply <- scan(what = character(), nlines = 1, quiet = TRUE)

     # interpret what player wrote as "yes" if it starts with "y"
     if (substr(reply,1,1) == "y"){
         chosen <- doors[-c(chosen,montydoor)]
     }

     # announce the result of the game!
     if (chosen == cardoor) print("You won!")
     else print("You lost!")
}
The print command prints its argument to the screen. We combine this with the
paste command since if we used print("Monty opens door montydoor") then R
would literally print “Monty opens door montydoor”. The scan command interac-
tively requests input from the user; we use what = integer() when we want the
user to enter an integer and what = character() when we want the user to enter
text. Using substr(reply,1,1) extracts the first character of reply, in case the
user replies with “yes” or “yep” or “yeah!” rather than with “y”.




2.11    Exercises

Exercises marked with s have detailed solutions at http://stat110.net.


84                                                                        Introduction to Probability

          Conditioning on evidence
     1.    s A spam filter is designed by looking at commonly occurring phrases in spam. Suppose
          that 80% of email is spam. In 10% of the spam emails, the phrase “free money” is used,
          whereas this phrase is only used in 1% of non-spam emails. A new email has just arrived,
          which does mention “free money”. What is the probability that it is spam?
     2.    s A woman is pregnant with twin boys. Twins may be either identical or fraternal.
          Suppose that 1/3 of twins born are identical, that identical twins have a 50% chance
          of being both boys and a 50% chance of being both girls, and that for fraternal twins
          each twin independently has a 50% chance of being a boy and a 50% chance of being a
          girl. Given the above information, what is the probability that the woman’s twins are
          identical?
     3.   According to the CDC (Centers for Disease Control and Prevention), men who smoke are
          23 times more likely to develop lung cancer than men who don’t smoke. Also according
          to the CDC, 21.6% of men in the U.S. smoke. What is the probability that a man in
          the U.S. is a smoker, given that he develops lung cancer?
     4.   Fred is answering a multiple-choice problem on an exam, and has to choose one of n
          options (exactly one of which is correct). Let K be the event that he knows the answer,
          and R be the event that he gets the problem right (either through knowledge or through
          luck). Suppose that if he knows the right answer he will definitely get the problem right,
          but if he does not know then he will guess completely randomly. Let P (K) = p.
          (a) Find P (K|R) (in terms of p and n).
          (b) Show that P (K|R) ≥ p, and explain why this makes sense intuitively. When (if ever)
          does P (K|R) equal p?
     5.   Three cards are dealt from a standard, well-shuffled deck. The first two cards are flipped
          over, revealing the Ace of Spades as the first card and the 8 of Clubs as the second card.
          Given this information, find the probability that the third card is an ace in two ways:
          using the definition of conditional probability, and by symmetry.
     6.   A hat contains 100 coins, where 99 are fair but one is double-headed (always landing
          Heads). A coin is chosen uniformly at random. The chosen coin is flipped 7 times, and it
          lands Heads all 7 times. Given this information, what is the probability that the chosen
          coin is double-headed? (Of course, another approach here would be to look at both sides
          of the coin—but this is a metaphorical coin.)
     7.   A hat contains 100 coins, where at least 99 are fair, but there may be one that is double-
          headed (always landing Heads); if there is no such coin, then all 100 are fair. Let D be
          the event that there is such a coin, and suppose that P (D) = 1/2. A coin is chosen
          uniformly at random. The chosen coin is flipped 7 times, and it lands Heads all 7 times.
          (a) Given this information, what is the probability that one of the coins is double-
          headed?
          (b) Given this information, what is the probability that the chosen coin is double-
          headed?
     8.   The screens used for a certain type of cell phone are manufactured by 3 companies,
          A, B, and C. The proportions of screens supplied by A, B, and C are 0.5, 0.3, and
          0.2, respectively, and their screens are defective with probabilities 0.01, 0.02, and 0.03,
          respectively. Given that the screen on such a phone is defective, what is the probability
          that Company A manufactured it?
     9.   (a) Show that if events A1 and A2 have the same prior probability P (A1 ) = P (A2 ),
          A1 implies B, and A2 implies B, then A1 and A2 have the same posterior probability
          P (A1 |B) = P (A2 |B) if it is observed that B occurred.
          (b) Explain why (a) makes sense intuitively, and give a concrete example.


Conditional probability                                                                                85

  10.   Fred is working on a major project. In planning the project, two milestones are set up,
        with dates by which they should be accomplished. This serves as a way to track Fred’s
        progress. Let A1 be the event that Fred completes the first milestone on time, A2 be
        the event that he completes the second milestone on time, and A3 be the event that he
        completes the project on time.
        Suppose that P (Aj+1 |Aj ) = 0.8 but P (Aj+1 |Acj ) = 0.3 for j = 1, 2, since if Fred falls
        behind on his schedule it will be hard for him to get caught up. Also, assume that the
        second milestone supersedes the first, in the sense that once we know whether he is
        on time in completing the second milestone, it no longer matters what happened with
        the first milestone. We can express this by saying that A1 and A3 are conditionally
        independent given A2 and they’re also conditionally independent given Ac2 .

        (a) Find the probability that Fred will finish the project on time, given that he completes
        the first milestone on time. Also find the probability that Fred will finish the project on
        time, given that he is late for the first milestone.

        (b) Suppose that P (A1 ) = 0.75. Find the probability that Fred will finish the project
        on time.
  11.   An exit poll in an election is a survey taken of voters just after they have voted. One
        major use of exit polls has been so that news organizations can try to figure out as
        soon as possible who won the election, before the votes are officially counted. This has
        been notoriously inaccurate in various elections, sometimes because of selection bias:
        the sample of people who are invited to and agree to participate in the survey may not
        be similar enough to the overall population of voters.
        Consider an election with two candidates, Candidate A and Candidate B. Every voter
        is invited to participate in an exit poll, where they are asked whom they voted for; some
        accept and some refuse. For a randomly selected voter, let A be the event that they voted
        for A, and W be the event that they are willing to participate in the exit poll. Suppose
        that P (W |A) = 0.7 but P (W |Ac ) = 0.3. In the exit poll, 60% of the respondents say
        they voted for A (assume that they are all honest), suggesting a comfortable victory for
        A. Find P (A), the true proportion of people who voted for A.
  12.   Alice is trying to communicate with Bob, by sending a message (encoded in binary)
        across a channel.

        (a) Suppose for this part that she sends only one bit (a 0 or 1), with equal probabilities.
        If she sends a 0, there is a 5% chance of an error occurring, resulting in Bob receiving a
        1; if she sends a 1, there is a 10% chance of an error occurring, resulting in Bob receiving
        a 0. Given that Bob receives a 1, what is the probability that Alice actually sent a 1?

        (b) To reduce the chance of miscommunication, Alice and Bob decide to use a repetition
        code. Again Alice wants to convey a 0 or a 1, but this time she repeats it two more times,
        so that she sends 000 to convey 0 and 111 to convey 1. Bob will decode the message by
        going with what the majority of the bits were. Assume that the error probabilities are
        as in (a), with error events for different bits independent of each other. Given that Bob
        receives 110, what is the probability that Alice intended to convey a 1?
  13.   Company A has just developed a diagnostic test for a certain disease. The disease
        afflicts 1% of the population. As defined in Example 2.3.9, the sensitivity of the test is
        the probability of someone testing positive, given that they have the disease, and the
        specificity of the test is the probability that of someone testing negative, given that they
        don’t have the disease. Assume that, as in Example 2.3.9, the sensitivity and specificity
        are both 0.95.
        Company B, which is a rival of Company A, offers a competing test for the disease.
        Company B claims that their test is faster and less expensive to perform than Company
        A’s test, is less painful (Company A’s test requires an incision), and yet has a higher


86                                                                          Introduction to Probability

           overall success rate, where overall success rate is defined as the probability that a random
           person gets diagnosed correctly.

           (a) It turns out that Company B’s test can be described and performed very simply: no
           matter who the patient is, diagnose that they do not have the disease. Check whether
           Company B’s claim about overall success rates is true.

           (b) Explain why Company A’s test may still be useful.

           (c) Company A wants to develop a new test such that the overall success rate is higher
           than that of Company B’s test. If the sensitivity and specificity are equal, how high
           does the sensitivity have to be to achieve their goal? If (amazingly) they can get the
           sensitivity equal to 1, how high does the specificity have to be to achieve their goal? If
           (amazingly) they can get the specificity equal to 1, how high does the sensitivity have
           to be to achieve their goal?
     14.   Consider the following scenario, from Tversky and Kahneman [27]:
                Let A be the event that before the end of next year, Peter will have installed
                a burglar alarm system in his home. Let B denote the event that Peter’s
                home will be burglarized before the end of next year.

           (a) Intuitively, which do you think is bigger, P (A|B) or P (A|B c )? Explain your intuition.

           (b) Intuitively, which do you think is bigger, P (B|A) or P (B|Ac )? Explain your intuition.

           (c) Show that for any events A and B (with probabilities not equal to 0 or 1), the
           inequality P (A|B) > P (A|B c ) is equivalent to P (B|A) > P (B|Ac ).

           (d) Tversky and Kahneman report that 131 out of 162 people whom they posed (a)
           and (b) to said that P (A|B) > P (A|B c ) and P (B|A) < P (B|Ac ). What is a plausible
           explanation for why this was such a popular opinion despite (c) showing that it is
           impossible for these inequalities both to hold?
     15.   Let A and B be events with 0 < P (A ∩ B) < P (A) < P (B) < P (A ∪ B) < 1. You are
           hoping that both A and B occurred. Which of the following pieces of information would
           you be happiest to observe: that A occurred, that B occurred, or that A ∪ B occurred?
     16.   Show that P (A|B) ≤ P (A) implies P (A|B c ) ≥ P (A), and give an intuitive explanation
           of why this makes sense.
     17.   In deterministic logic, the statement “A implies B” is equivalent to its contrapositive,
           “not B implies not A”. In this problem we will consider analogous statements in prob-
           ability, the logic of uncertainty. Let A and B be events with probabilities not equal to
           0 or 1.

           (a) Show that if P (B|A) = 1, then P (Ac |B c ) = 1.
           Hint: Apply Bayes’ rule and LOTP.

           (b) Show however that the result in (a) does not hold in general if = is replaced by ≈.
           In particular, find an example where P (B|A) is very close to 1 but P (Ac |B c ) is very
           close to 0.
           Hint: What happens if A and B are independent?
     18.   Show that if P (A) = 1, then P (A|B) = 1 for any B with P (B) > 0. Intuitively, this says
           that if someone dogmatically believes something with absolute certainty, then no amount
           of evidence will change their mind. The principle of avoiding assigning probabilities of
           0 or 1 to any event (except for mathematical certainties) was named Cromwell’s rule
           by the statistician Dennis Lindley, due to Cromwell saying to the Church of Scotland,
           “Think it possible you may be mistaken.”
           Hint: Write P (B) = P (B ∩ A) + P (B ∩ Ac ), and then show that P (B ∩ Ac ) = 0.


Conditional probability                                                                                 87

  19.   Explain the following Sherlock Holmes saying in terms of conditional probability, care-
        fully distinguishing between prior and posterior probabilities: “It is an old maxim of
        mine that when you have excluded the impossible, whatever remains, however improb-
        able, must be the truth.”
  20.   The Jack of Spades (with cider), Jack of Hearts (with tarts), Queen of Spades (with a
        wink), and Queen of Hearts (without tarts) are taken from a deck of cards. These four
        cards are shuffled, and then two are dealt. Note: Literary references to cider, tarts, and
        winks do not need to be considered when solving this problem.

        (a) Find the probability that both of these two cards are queens, given that the first
        card dealt is a queen.

        (b) Find the probability that both are queens, given that at least one is a queen.

        (c) Find the probability that both are queens, given that one is the Queen of Hearts.
  21.   A fair coin is flipped 3 times. The toss results are recorded on separate slips of paper
        (writing “H” if Heads and “T” if Tails), and the 3 slips of paper are thrown into a hat.

        (a) Find the probability that all 3 tosses landed Heads, given that at least 2 were Heads.

        (b) Two of the slips of paper are randomly drawn from the hat, and both show the
        letter H. Given this information, what is the probability that all 3 tosses landed Heads?
  22.    s A bag contains one marble which is either green or blue, with equal probabilities. A
        green marble is put in the bag (so there are 2 marbles now), and then a random marble
        is taken out. The marble taken out is green. What is the probability that the remaining
        marble is also green?
  23.    s Let G be the event that a certain individual is guilty of a certain robbery. In gathering
        evidence, it is learned that an event E1 occurred, and a little later it is also learned that
        another event E2 also occurred. Is it possible that individually, these pieces of evidence
        increase the chance of guilt (so P (G|E1 ) > P (G) and P (G|E2 ) > P (G)), but together
        they decrease the chance of guilt (so P (G|E1 , E2 ) < P (G))?
  24.   Is it possible to have events A1 , A2 , B, C with P (A1 |B) > P (A1 |C) and P (A2 |B) >
        P (A2 |C), yet P (A1 ∪ A2 |B) < P (A1 ∪ A2 |C)? If so, find an example (with a “story”
        interpreting the events, as well as giving specific numbers); otherwise, show that it is
        impossible for this phenomenon to happen.
  25.    s A crime is committed by one of two suspects, A and B. Initially, there is equal
        evidence against both of them. In further investigation at the crime scene, it is found
        that the guilty party had a blood type found in 10% of the population. Suspect A does
        match this blood type, whereas the blood type of Suspect B is unknown.

        (a) Given this new information, what is the probability that A is the guilty party?

        (b) Given this new information, what is the probability that B’s blood type matches
        that found at the crime scene?
  26.    s To battle against spam, Bob installs two anti-spam programs. An email arrives,
        which is either legitimate (event L) or spam (event Lc ), and which program j marks as
        legitimate (event Mj ) or marks as spam (event Mjc ) for j ∈ {1, 2}. Assume that 10%
        of Bob’s email is legitimate and that the two programs are each “90% accurate” in the
        sense that P (Mj |L) = P (Mjc |Lc ) = 9/10. Also assume that given whether an email is
        spam, the two programs’ outputs are conditionally independent.

        (a) Find the probability that the email is legitimate, given that the 1st program marks
        it as legitimate (simplify).

        (b) Find the probability that the email is legitimate, given that both programs mark it
        as legitimate (simplify).


88                                                                             Introduction to Probability

           (c) Bob runs the 1st program and M1 occurs. He updates his probabilities and then
           runs the 2nd program. Let P̃ (A) = P (A|M1 ) be the updated probability function after
           running the 1st program. Explain briefly in words whether or not P̃ (L|M2 ) = P (L|M1 ∩
           M2 ): is conditioning on M1 ∩ M2 in one step equivalent to first conditioning on M1 , then
           updating probabilities, and then conditioning on M2 ?
     27.   Suppose that there are 5 blood types in the population, named type 1 through type 5,
           with probabilities p1 , p2 , . . . , p5 . A crime was committed by two individuals. A suspect,
           who has blood type 1, has prior probability p of being guilty. At the crime scene, blood
           evidence is collected, which shows that one of the criminals has type 1 and the other
           has type 2.

           Find the posterior probability that the suspect is guilty, given the evidence. Does the
           evidence make it more likely or less likely that the suspect is guilty, or does this depend
           on the values of the parameters p, p1 , . . . , p5 ? If it depends on these values, give a simple
           criterion for when the evidence makes it more likely that the suspect is guilty.
     28.   Fred has just tested positive for a certain disease.

           (a) Given this information, find the posterior odds that he has the disease, in terms of
           the prior odds, the sensitivity of the test, and the specificity of the test.

           (b) Not surprisingly, Fred is much more interested in P (have disease|test positive),
           known as the positive predictive value, than in the sensitivity P (test positive|have disease).
           A handy rule of thumb in biostatistics and epidemiology is as follows:

           For a rare disease and a reasonably good test, specificity matters much more than sen-
           sitivity in determining the positive predictive value.

           Explain intuitively why this rule of thumb works. For this part you can make up some
           specific numbers and interpret probabilities in a frequentist way as proportions in a
           large population, e.g., assume the disease afflicts 1% of a population of 10000 people
           and then consider various possibilities for the sensitivity and specificity.
     29.   A family has two children. Let C be a characteristic that a child can have, and assume
           that each child has characteristic C with probability p, independently of each other and
           of gender. For example, C could be the characteristic “born in winter” as in Exam-
           ple 2.2.7. Under the assumptions of Example 2.2.5, show that the probability that both
           children are girls given that at least one is a girl with characteristic C is 2−p
                                                                                         4−p
                                                                                             . Note that
           this is 1/3 if p = 1 (agreeing with the first part of Example 2.2.5) and approaches 1/2
           from below as p → 0 (agreeing with Example 2.2.7).


           Independence and conditional independence
     30.   s A family has 3 children, creatively named A, B, and C.

           (a) Discuss intuitively (but clearly) whether the event “A is older than B” is independent
           of the event “A is older than C”.

           (b) Find the probability that A is older than B, given that A is older than C.
     31.   s Is it possible that an event is independent of itself? If so, when is this the case?
     32.    s Consider four nonstandard dice (the Efron dice), whose sides are labeled as follows
           (the 6 sides on each die are equally likely).

           A: 4, 4, 4, 4, 0, 0
           B: 3, 3, 3, 3, 3, 3
           C: 6, 6, 2, 2, 2, 2


Conditional probability                                                                              89

        D: 5, 5, 5, 1, 1, 1

        These four dice are each rolled once. Let A be the result for die A, B be the result for
        die B, etc.

        (a) Find P (A > B), P (B > C), P (C > D), and P (D > A).

        (b) Is the event A > B independent of the event B > C? Is the event B > C independent
        of the event C > D? Explain.
  33.   Alice, Bob, and 100 other people live in a small town. Let C be the set consisting of the
        100 other people, let A be the set of people in C who are friends with Alice, and let B
        be the set of people in C who are friends with Bob. Suppose that for each person in C,
        Alice is friends with that person with probability 1/2, and likewise for Bob, with all of
        these friendship statuses independent.

        (a) Let D ⊆ C. Find P (A = D).

        (b) Find P (A ⊆ B).

        (c) Find P (A ∪ B = C).
  34.   Suppose that there are two types of drivers: good drivers and bad drivers. Let G be
        the event that a certain man is a good driver, A be the event that he gets into a car
        accident next year, and B be the event that he gets into a car accident the following
        year. Let P (G) = g and P (A|G) = P (B|G) = p1 , P (A|Gc ) = P (B|Gc ) = p2 , with
        p1 < p2 . Suppose that given the information of whether or not the man is a good driver,
        A and B are independent (for simplicity and to avoid being morbid, assume that the
        accidents being considered are minor and wouldn’t make the man unable to drive).

        (a) Explain intuitively whether or not A and B are independent.

        (b) Find P (G|Ac ).

        (c) Find P (B|Ac ).
  35.    s You are going to play 2 games of chess with an opponent whom you have never
        played against before (for the sake of this problem). Your opponent is equally likely to
        be a beginner, intermediate, or a master. Depending on which, your chances of winning
        an individual game are 90%, 50%, or 30%, respectively.

        (a) What is your probability of winning the first game?

        (b) Congratulations: you won the first game! Given this information, what is the prob-
        ability that you will also win the second game (assume that, given the skill level of your
        opponent, the outcomes of the games are independent)?

        (c) Explain the distinction between assuming that the outcomes of the games are in-
        dependent and assuming that they are conditionally independent given the opponent’s
        skill level. Which of these assumptions seems more reasonable, and why?
  36.   (a) Suppose that in the population of college applicants, being good at baseball is
        independent of having a good math score on a certain standardized test (with respect
        to some measure of “good”). A certain college has a simple admissions procedure: admit
        an applicant if and only if the applicant is good at baseball or has a good math score
        on the test.

        Give an intuitive explanation of why it makes sense that among students that the college
        admits, having a good math score is negatively associated with being good at baseball,
        i.e., conditioning on having a good math score decreases the chance of being good at
        baseball.


90                                                                                     Introduction to Probability

           (b) Show that if A and B are independent and C = A∪B, then A and B are conditionally
           dependent given C (as long as P (A ∩ B) > 0 and P (A ∪ B) < 1), with

                                                  P (A|B, C) < P (A|C).

           This phenomenon is known as Berkson’s paradox, especially in the context of admissions
           to a school, hospital, etc.

     37.   Two different diseases cause a certain weird symptom; anyone who has either or both
           of these diseases will experience the symptom. Let D1 be the event of having the first
           disease, D2 be the event of having the second disease, and W be the event of having the
           weird symptom. Suppose that D1 and D2 are independent with P (Dj ) = pj , and that a
           person with neither of these diseases will have the weird symptom with probability w0 .
           Let qj = 1 − pj , and assume that 0 < pj < 1.

           (a) Find P (W ).

           (b) Find P (D1 |W ), P (D2 |W ), and P (D1 , D2 |W ).

           (c) Determine algebraically whether or not D1 and D2 are conditionally independent
           given W .

           (d) Suppose for this part only that w0 = 0. Give a clear, convincing intuitive explanation
           in words of whether D1 and D2 are conditionally independent given W .

     38.   We want to design a spam filter for email. As described in Exercise 1, a major strategy
           is to find phrases that are much more likely to appear in a spam email than in a non-
           spam email. In that exercise, we only consider one such phrase: “free money”. More
           realistically, suppose that we have created a list of 100 words or phrases that are much
           more likely to be used in spam than in non-spam.
           Let Wj be the event that an email contains the jth word or phrase on the list. Let

                              p = P (spam), pj = P (Wj |spam), rj = P (Wj |not spam),

           where “spam” is shorthand for the event that the email is spam.
           Assume that W1 , . . . , W100 are conditionally independent given that the email is spam,
           and conditionally independent given that it is not spam. A method for classifying emails
           (or other objects) based on this kind of assumption is called a naive Bayes classifier.
           (Here “naive” refers to the fact that the conditional independence is a strong assumption,
           not to Bayes being naive. The assumption may or may not be realistic, but naive Bayes
           classifiers sometimes work well in practice even if the assumption is not realistic.)
           Under this assumption we know, for example, that

                  P (W1 , W2 , W3c , W4c , . . . , W100
                                                    c
                                                        |spam) = p1 p2 (1 − p3 )(1 − p4 ) . . . (1 − p100 ).

           Without the naive Bayes assumption, there would be vastly more statistical and com-
           putational difficulties since we would need to consider 2100 ≈ 1.3 × 1030 events of the
           form A1 ∩ A2 · · · ∩ A100 with each Aj equal to either Wj or Wjc . A new email has just
           arrived, and it includes the 23rd, 64th, and 65th words or phrases on the list (but not
           the other 97). So we want to compute

                     P (spam|W1c , . . . , W22
                                            c           c
                                               , W23 , W24            c
                                                           , . . . , W63                c
                                                                         , W64 , W65 , W66            c
                                                                                           , . . . , W100 ).

           Note that we need to condition on all the evidence, not just the fact that W23 ∩W64 ∩W65
           occurred. Find the conditional probability that the new email is spam (in terms of p
           and the pj and rj ).


Conditional probability                                                                                    91

        Monty Hall
  39.    s (a) Consider the following 7-door version of the Monty Hall problem. There are 7
        doors, behind one of which there is a car (which you want), and behind the rest of which
        there are goats (which you don’t want). Initially, all possibilities are equally likely for
        where the car is. You choose a door. Monty Hall then opens 3 goat doors, and offers
        you the option of switching to any of the remaining 3 doors.
        Assume that Monty Hall knows which door has the car, will always open 3 goat doors
        and offer the option of switching, and that Monty chooses with equal probabilities from
        all his choices of which goat doors to open. Should you switch? What is your probability
        of success if you switch to one of the remaining 3 doors?

        (b) Generalize the above to a Monty Hall problem where there are n ≥ 3 doors, of which
        Monty opens m goat doors, with 1 ≤ m ≤ n − 2.
  40.    s Consider the Monty Hall problem, except that Monty enjoys opening door 2 more
        than he enjoys opening door 3, and if he has a choice between opening these two doors,
        he opens door 2 with probability p, where 12 ≤ p ≤ 1.
        To recap: there are three doors, behind one of which there is a car (which you want),
        and behind the other two of which there are goats (which you don’t want). Initially,
        all possibilities are equally likely for where the car is. You choose a door, which for
        concreteness we assume is door 1. Monty Hall then opens a door to reveal a goat, and
        offers you the option of switching. Assume that Monty Hall knows which door has the
        car, will always open a goat door and offer the option of switching, and as above assume
        that if Monty Hall has a choice between opening door 2 and door 3, he chooses door 2
        with probability p (with 12 ≤ p ≤ 1).

        (a) Find the unconditional probability that the strategy of always switching succeeds
        (unconditional in the sense that we do not condition on which of doors 2 or 3 Monty
        opens).

        (b) Find the probability that the strategy of always switching succeeds, given that Monty
        opens door 2.

        (c) Find the probability that the strategy of always switching succeeds, given that Monty
        opens door 3.
  41.   The ratings of Monty Hall’s show have dropped slightly, and a panicking executive
        producer complains to Monty that the part of the show where he opens a door lacks
        suspense: Monty always opens a door with a goat. Monty replies that the reason is so
        that the game is never spoiled by him revealing the car, but he agrees to update the
        game as follows.

        Before each show, Monty secretly flips a coin with probability p of Heads. If the coin
        lands Heads, Monty resolves to open a door with a goat (with equal probabilities if there
        is a choice). Otherwise, Monty resolves to open a random door, with equal probabilities.
        Of course, Monty will not open the door that the contestant initially chooses. The
        contestant knows p but does not know the outcome of the coin flip. When the show
        starts, the contestant chooses a door. Monty (who knows where the car is) then opens a
        door. If the car is revealed, the game is over; if a goat is revealed, the contestant is offered
        the option of switching. Now suppose it turns out that the contestant chooses door 1
        and then Monty opens door 2, revealing a goat. What is the contestant’s probability of
        success if they switch to door 3?
  42.   Consider the following variation of the Monty Hall problem, where in some situations
        Monty may not open a door and give the contestant the choice of whether to switch
        doors. Specifically, there are 3 doors, with 2 containing goats and 1 containing a car. The
        car is equally likely to be anywhere, and Monty knows where the car is. Let 0 ≤ p ≤ 1.


92                                                                              Introduction to Probability

           The contestant chooses a door. If this initial choice has the car, Monty will open another
           door, revealing a goat (choosing with equal probabilities among his two choices of door),
           and then offer the contestant the choice of whether to switch to the other unopened door.
           If the contestant’s initial choice has a goat, then with probability p Monty will open
           another door, revealing a goat, and then offer the contestant the choice of whether to
           switch to the other unopened door; but with probability 1 − p, Monty will not open a
           door, and the contestant must stick with their initial choice.
           The contestant decides in advance to use the following strategy: initially choose door 1.
           Then, if Monty opens a door and offers the choice of whether to switch, do switch.
           (a) Find the unconditional probability that the contestant will get the car. Also, check
           what your answer reduces to in the extreme cases p = 0 and p = 1, and briefly explain
           why your answer makes sense in these two cases.

           (b) Monty now opens door 2, revealing a goat. So the contestant switches to door 3.
           Given this information, find the conditional probability that the contestant will get the
           car.
     43.   You are the contestant on the Monty Hall show. Monty is trying out a new version of
           his game, with rules as follows. You get to choose one of three doors. One door has a car
           behind it, another has a computer, and the other door has a goat (with all permutations
           equally likely). Monty, who knows which prize is behind each door, will open a door (but
           not the one you chose) and then let you choose whether to switch from your current
           choice to the other unopened door.

           Assume that you prefer the car to the computer, the computer to the goat, and (by
           transitivity) the car to the goat.
           (a) Suppose for this part only that Monty always opens the door that reveals your less
           preferred prize out of the two alternatives, e.g., if he is faced with the choice between
           revealing the goat or the computer, he will reveal the goat. Monty opens a door, revealing
           a goat (this is again for this part only). Given this information, should you switch? If
           you do switch, what is your probability of success in getting the car?
           (b) Now suppose that Monty reveals your less preferred prize with probability p, and
           your more preferred prize with probability q = 1 − p. Monty opens a door, revealing a
           computer. Given this information, should you switch (your answer can depend on p)?
           If you do switch, what is your probability of success in getting the car (in terms of p)?
     44.   Monty Hall has introduced a new twist in his game, by generalizing the assumption that
           the initial probabilities for where the car is are ( 13 , 13 , 13 ). Specifically, there are three
           doors, behind one of which there is a car (which the contestant wants), and behind the
           other two of which there are goats (which the contestant doesn’t want). Initially, door
           i has probability pi of having the car, where p1 , p2 , p3 are known constants such that
           0 < p1 ≤ p2 ≤ p3 < 1 and p1 + p2 + p3 = 1. The contestant chooses a door. Then Monty
           opens a door (other than the one the contestant chose) and offers the contestant the
           option of switching to the other unopened door.

           (a) Assume for this part that Monty knows in advance which door has the car. He always
           opens a door to reveal a goat, and if he has a choice of which door to open he chooses
           with equal probabilities. Suppose for this part that the contestant initially chooses door
           3, and then Monty opens door 2, revealing a goat. Given the above information, find
           the conditional probability that door 3 has the car. Should the contestant switch doors?
           (If whether to switch depends on the pi ’s, give a fully simplified criterion in terms of
           the pi ’s.)

           (b) Now assume instead that Monty does not know in advance where the car is. He
           randomly chooses which door to open (other than the one the contestant chose), with
           equal probabilities. (The game is spoiled if he reveals the car.) Suppose again that the


Conditional probability                                                                                93

        contestant initially chooses door 3, and then Monty opens door 2, revealing a goat.
        Given the above information, find the conditional probability that door 3 has the car.
        Should the contestant switch doors? (If whether to switch depends on the pi ’s, give a
        fully simplified criterion in terms of the pi ’s.)

        (c) Repeat (a), except with the contestant initially choosing door 1 rather than door 3.

        (d) Repeat (b), except with the contestant initially choosing door 1 rather than door 3.
  45.   Monty Hall is trying out a new version of his game. In this version, instead of there always
        being 1 car and 2 goats, the prizes behind the doors are generated independently, with
        each door having probability p of having a car and q = 1 − p of having a goat. In detail:
        There are three doors, behind each of which there is one prize: either a car or a goat.
        For each door, there is probability p that there is a car behind it and q = 1 − p that
        there is a goat, independent of the other doors.
        The contestant chooses a door. Monty, who knows the contents of each door, then opens
        one of the two remaining doors. In choosing which door to open, Monty will always reveal
        a goat if possible. If both of the remaining doors have the same kind of prize, Monty
        chooses randomly (with equal probabilities). After opening a door, Monty offers the
        contestant the option of switching to the other unopened door.
        The contestant decides in advance to use the following strategy: first choose door 1.
        Then, after Monty opens a door, switch to the other unopened door.

        (a) Find the unconditional probability that the contestant will get a car.

        (b) Monty now opens door 2, revealing a goat. Given this information, find the condi-
        tional probability that the contestant will get a car.
  46.   Monty Hall is trying out a new version of his game, with rules as follows. The contes-
        tant gets to choose one of four doors. One door has a car behind it, another has an
        apple, another has a book, and another has a goat. All 24 permutations for which door
        has which prize are equally likely. In order from least preferred to most preferred, the
        contestant’s preferences are: goat, apple, book, car.
        Monty, who knows which prize is behind each door, will open a door (other than the
        contestant’s initial choice) and then let the contestant choose whether to switch to
        another unopened door. Monty will reveal the least preferred prize (among the 3 doors
        other than the contestant’s initial choice) with probability p, the intermediately preferred
        prize with probability 1 − p, and the most preferred prize never.
        The contestant decides in advance to use the following strategy: Initially choose door
        1. After Monty opens a door, switch to one of the other two unopened doors, randomly
        choosing between them (with probability 1/2 each).
        (a) Find the unconditional probability that the contestant will get the car.
        Hint: Condition on where the car is.
        (b) Find the unconditional probability that Monty will reveal the apple.
        Hint: Condition on what is behind door 1.
        (c) Monty now opens a door, revealing the apple. Given this information, find the
        conditional probability that the contestant will get the car.
  47.   You are the contestant on Monty Hall’s game show. Hoping to double the excitement of
        the game, Monty will offer you two opportunities to switch to another door. Specifically,
        the new rules are as follows. There are four doors. Behind one door there is a car (which
        you want); behind the other three doors there are goats (which you don’t want). Initially,
        all possibilities are equally likely for where the car is. Monty knows where the car is,
        and when he has a choice of which door to open, he chooses with equal probabilities.
        You choose a door, which for concreteness we assume is door 1. Monty opens a door


94                                                                               Introduction to Probability

           (other than door 1), revealing a goat, and then offers you the option to switch to
           another door. Monty then opens another door (other than your currently selected door),
           revealing another goat. So now there are two open doors (with goats) and two unopened
           doors. Again Monty offers you the option to switch.
           You decide in advance to use one of the following four strategies: stay-stay, stay-switch,
           switch-stay, switch-switch, where, for example, “stay-switch” means that the first time
           Monty offers you the choice of switching, you stay with your current selection, but then
           the second time Monty offers you the choice, you do switch doors. In each part below
           the goal is to find or compare unconditional probabilities, i.e., from a vantage point of
           before the game has started.
           (a) Find the probability of winning the car if you follow the stay-stay strategy.
           (b) Find the probability of winning the car if you follow the stay-switch strategy.
           (c) Find the probability of winning the car if you follow the switch-stay strategy.
           (d) Find the probability of winning the car if you follow the switch-switch strategy.
           (e) Which of these four strategies is the best?


           First-step analysis and gambler’s ruin
     48.    s A fair die is rolled repeatedly, and a running total is kept (which is, at each time,
           the total of all the rolls up until that time). Let pn be the probability that the running
           total is ever exactly n (assume the die will always be rolled enough times so that the
           running total will eventually exceed n, but it may or may not ever equal n).

           (a) Write down a recursive equation for pn (relating pn to earlier terms pk in a simple
           way). Your equation should be true for all positive integers n, so give a definition of p0
           and pk for k < 0 so that the recursive equation is true for small values of n.

           (b) Find p7 .

           (c) Give an intuitive explanation for the fact that pn → 1/3.5 = 2/7 as n → ∞.
     49.   A sequence of n ≥ 1 independent trials is performed, where each trial ends in “success”
           or “failure” (but not both). Let pi be the probability of success in the ith trial, qi = 1−pi ,
           and bi = qi − 1/2, for i = 1, 2, . . . , n. Let An be the event that the number of successful
           trials is even.

           (a) Show that for n = 2, P (A2 ) = 1/2 + 2b1 b2 .

           (b) Show by induction that
                                         P (An ) = 1/2 + 2n−1 b1 b2 . . . bn .
           (This result is very useful in cryptography. Also, note that it implies that if n coins are
           flipped, then the probability of an even number of Heads is 1/2 if and only if at least
           one of the coins is fair.) Hint: Group some trials into a supertrial.

           (c) Check directly that the result of (b) is true in the following simple cases: pi = 1/2
           for some i; pi = 0 for all i; pi = 1 for all i.
     50.    s Calvin and Hobbes play a match consisting of a series of games, where Calvin has
           probability p of winning each game (independently). They play with a “win by two”
           rule: the first player to win two games more than his opponent wins the match. Find
           the probability that Calvin wins the match (in terms of p), in two different ways:

           (a) by conditioning, using the law of total probability.

           (b) by interpreting the problem as a gambler’s ruin problem.


Conditional probability                                                                                    95

  51.    s A gambler repeatedly plays a game where in each round, he wins a dollar with
        probability 1/3 and loses a dollar with probability 2/3. His strategy is “quit when he is
        ahead by $2”. Suppose that he starts with a million dollars. Show that the probability
        that he’ll ever be ahead by $2 is less than 1/4.
  52.   As in the gambler’s ruin problem, two gamblers, A and B, make a series of bets, until
        one of the gamblers goes bankrupt. Let A start out with i dollars and B start out with
        N − i dollars, and let p be the probability of A winning a bet, with 0 < p < 12 . Each
        bet is for k1 dollars, with k a positive integer, e.g., k = 1 is the original gambler’s ruin
        problem and k = 20 means they’re betting nickels. Find the probability that A wins the
        game, and determine what happens to this as k → ∞.
  53.   There are 100 equally spaced points around a circle. At 99 of the points, there are
        sheep, and at 1 point, there is a wolf. At each time step, the wolf randomly moves either
        clockwise or counterclockwise by 1 point. If there is a sheep at that point, he eats it.
        The sheep don’t move. What is the probability that the sheep who is initially opposite
        the wolf is the last one remaining?
  54.   An immortal drunk man wanders around randomly on the integers. He starts at the
        origin, and at each step he moves 1 unit to the right or 1 unit to the left, with probabilities
        p and q = 1−p respectively, independently of all his previous steps. Let Sn be his position
        after n steps.

        (a) Let pk be the probability that the drunk ever reaches the value k, for all k ≥ 0.
        Write down a difference equation for pk (you do not need to solve it for this part).

        (b) Find pk , fully simplified; be sure to consider all 3 cases: p < 1/2, p = 1/2, and
        p > 1/2. Feel free to assume that if A1 , A2 , . . . are events with Aj ⊆ Aj+1 for all j,
        then P (An ) → P (∪∞j=1 Aj ) as n → ∞ (because it is true; this is known as continuity of
        probability).


        Simpson’s paradox
  55.    s (a) Is it possible to have events A, B, C such that P (A|C) < P (B|C) and P (A|C c ) <
        P (B|C c ), yet P (A) > P (B)? That is, A is less likely than B given that C is true,
        and also less likely than B given that C is false, yet A is more likely than B if we’re
        given no information about C. Show this is impossible (with a short proof) or find a
        counterexample (with a story interpreting A, B, C).

        (b) If the scenario in (a) is possible, is it a special case of Simpson’s paradox, equivalent to
        Simpson’s paradox, or neither? If it is impossible, explain intuitively why it is impossible
        even though Simpson’s paradox is possible.
  56.   s Consider the following conversation from an episode of The Simpsons:
                  Lisa: Dad, I think he’s an ivory dealer! His boots are ivory, his hat is
              ivory, and I’m pretty sure that check is ivory.
                  Homer: Lisa, a guy who has lots of ivory is less likely to hurt Stampy
              than a guy whose ivory supplies are low.

        Here Homer and Lisa are debating the question of whether or not the man (named
        Blackheart) is likely to hurt Stampy the Elephant if they sell Stampy to him. They
        clearly disagree about how to use their observations about Blackheart to learn about
        the probability (conditional on the evidence) that Blackheart will hurt Stampy.

        (a) Define clear notation for the various events of interest here.

        (b) Express Lisa’s and Homer’s arguments (Lisa’s is partly implicit) as conditional
        probability statements in terms of your notation from (a).


96                                                                          Introduction to Probability

           (c) Assume it is true that someone who has a lot of a commodity will have less desire
           to acquire more of the commodity. Explain what is wrong with Homer’s reasoning that
           the evidence about Blackheart makes it less likely that he will harm Stampy.
     57.   (a) There are two crimson jars (labeled C1 and C2 ) and two mauve jars (labeled M1 and
           M2 ). Each jar contains a mixture of green gummi bears and red gummi bears. Show by
           example that it is possible that C1 has a much higher percentage of green gummi bears
           than M1 , and C2 has a much higher percentage of green gummi bears than M2 , yet if
           the contents of C1 and C2 are merged into a new jar and likewise for M1 and M2 , then
           the combination of C1 and C2 has a lower percentage of green gummi bears than the
           combination of M1 and M2 .

           (b) Explain how (a) relates to Simpson’s paradox, both intuitively and by explicitly
           defining events A, B, C as in the statement of Simpson’s paradox.
     58.   As explained in this chapter, Simpson’s paradox says that it is possible to have events
           A, B, C such that P (A|B, C) < P (A|B c , C) and P (A|B, C c ) < P (A|B c , C c ), yet
           P (A|B) > P (A|B c ).

           (a) Can Simpson’s paradox occur if A and B are independent? If so, give a concrete
           example (with both numbers and an interpretation); if not, prove that it is impossible.

           (b) Can Simpson’s paradox occur if A and C are independent? If so, give a concrete
           example (with both numbers and an interpretation); if not, prove that it is impossible.

           (c) Can Simpson’s paradox occur if B and C are independent? If so, give a concrete
           example (with both numbers and an interpretation); if not, prove that it is impossible.
     59.    s The book Red State, Blue State, Rich State, Poor State by Andrew Gelman [12]
           discusses the following election phenomenon: within any U.S. state, a wealthy voter is
           more likely to vote for a Republican than a poor voter, yet the wealthier states tend to
           favor Democratic candidates!

           (a) Assume for simplicity that there are only 2 states (called Red and Blue), each
           of which has 100 people, and that each person is either rich or poor, and either a
           Democrat or a Republican. Make up numbers consistent with the above, showing how
           this phenomenon is possible, by giving a 2 × 2 table for each state (listing how many
           people in each state are rich Democrats, etc.). So within each state, a rich voter is more
           likely to vote for a Republican than a poor voter, but the percentage of Democrats is
           higher in the state with the higher percentage of rich people than in the state with the
           lower percentage of rich people.

           (b) In the setup of (a) (not necessarily with the numbers you made up there), let
           D be the event that a randomly chosen person is a Democrat (with all 200 people
           equally likely), and B be the event that the person lives in the Blue State. Suppose
           that 10 people move from the Blue State to the Red State. Write Pold and Pnew for
           probabilities before and after they move. Assume that people do not change parties,
           so we have Pnew (D) = Pold (D). Is it possible that both Pnew (D|B) > Pold (D|B) and
           Pnew (D|B c ) > Pold (D|B c ) are true? If so, explain how it is possible and why it does not
           contradict the law of total probability P (D) = P (D|B)P (B) + P (D|B c )P (B c ); if not,
           show that it is impossible.


           Mixed practice
     60.   A patient is being given a blood test for the disease conditionitis. Let p be the prior
           probability that the patient has conditionitis. The blood sample is sent to one of two
           labs for analysis, lab A or lab B. The choice of which lab to use is made randomly,
           independent of the patient’s disease status, with probability 1/2 for each lab.


Conditional probability                                                                               97

        For lab A, the probability of someone testing positive given that they do have the disease
        is a1 , and the probability of someone testing negative given that they do not have the
        disease is a2 . The corresponding probabilities for lab B are b1 and b2 .

        (a) Find the probability that the patient has the disease, given that they tested positive.

        (b) Find the probability that the patient’s blood sample was analyzed by lab A, given
        that the patient tested positive.
  61.   Fred decides to take a series of n tests, to diagnose whether he has a certain disease
        (any individual test is not perfectly reliable, so he hopes to reduce his uncertainty by
        taking multiple tests). Let D be the event that he has the disease, p = P (D) be the
        prior probability that he has the disease, and q = 1 − p. Let Tj be the event that he
        tests positive on the jth test.

        (a) Assume for this part that the test results are conditionally independent given Fred’s
        disease status. Let a = P (Tj |D) and b = P (Tj |Dc ), where a and b don’t depend on j.
        Find the posterior probability that Fred has the disease, given that he tests positive on
        all n of the n tests.

        (b) Suppose that Fred tests positive on all n tests. However, some people have a certain
        gene that makes them always test positive. Let G be the event that Fred has the gene.
        Assume that P (G) = 1/2 and that D and G are independent. If Fred does not have the
        gene, then the test results are conditionally independent given his disease status. Let
        a0 = P (Tj |D, Gc ) and b0 = P (Tj |Dc , Gc ), where a0 and b0 don’t depend on j. Find the
        posterior probability that Fred has the disease, given that he tests positive on all n of
        the tests.
  62.   A certain hereditary disease can be passed from a mother to her children. Given that
        the mother has the disease, her children independently will have it with probability 1/2.
        Given that she doesn’t have the disease, her children won’t have it either. A certain
        mother, who has probability 1/3 of having the disease, has two children.

        (a) Find the probability that neither child has the disease.

        (b) Is whether the elder child has the disease independent of whether the younger child
        has the disease? Explain.

        (c) The elder child is found not to have the disease. A week later, the younger child is
        also found not to have the disease. Given this information, find the probability that the
        mother has the disease.
  63.   Three fair coins are tossed at the same time. Explain what is wrong with the following
        argument: “there is a 50% chance that the three coins all landed the same way, since
        obviously it is possible to find two coins that match, and then the other coin has a 50%
        chance of matching those two”.
  64.   An urn contains red, green, and blue balls. Let r, g, b be the proportions of red, green,
        blue balls, respectively (r + g + b = 1).

        (a) Balls are drawn randomly with replacement. Find the probability that the first time
        a green ball is drawn is before the first time a blue ball is drawn.
        Hint: Explain how this relates to finding the probability that a draw is green, given that
        it is either green or blue.

        (b) Balls are drawn randomly without replacement. Find the probability that the first
        time a green ball is drawn is before the first time a blue ball is drawn. Is the answer the
        same or different than the answer in (a)?
        Hint: Imagine the balls all lined up, in the order in which they will be drawn. Note that
        where the red balls are standing in this line is irrelevant.


98                                                                               Introduction to Probability

           (c) Generalize the result from (a) to the following setting. Independent trials are per-
           formed, and the outcome of each trial is classified as being exactly one of type 1, type 2,
           . . . , or type n, with probabilities p1 , p2 , . . . , pn , respectively. Find the probability that
           the first trial to result in type i comes before the first trial to result in type j, for i 6= j.
     65.   Marilyn vos Savant was asked the following question for her column in Parade:
                You’re at a party with 199 other guests when robbers break in and announce
                that they are going to rob one of you. They put 199 blank pieces of paper in
                a hat, plus one marked “you lose.” Each guest must draw, and the person
                who draws “you lose” will get robbed. The robbers offer you the option of
                drawing first, last, or at any time in between. When would you take your
                turn?
           The draws are made without replacement, and for (a) are uniformly random.

           (a) Determine whether it is optimal to draw first, last, or somewhere in between (or
           whether it does not matter), to maximize the probability of not being robbed. Give a
           clear, concise, and compelling explanation.

           (b) More generally, suppose that there is one “you lose” piece of paper, with “weight”
           v, and there are n blank pieces of paper, each with “weight” w. At each stage, draws
           are made with probability proportional to weight, i.e., the probability of drawing a
           particular piece of paper is its weight divided by the sum of the weights of all the
           remaining pieces of paper. Determine whether it is better to draw first or second (or
           whether it does not matter); here v > 0, w > 0, and n ≥ 1 are known constants.
     66.   A fair die is rolled repeatedly, until the running total is at least 100 (at which point the
           rolling stops). Find the most likely value of the final running total (i.e., the value of the
           running total at the first time when it is at least 100).
           Hint: Consider the possibilities for what the running total is just before the last roll.
     67.   Homer has a box of donuts, which currently contains exactly c chocolate, g glazed, and
           j jelly donuts. Homer eats donuts one after another, each time choosing uniformly at
           random from the remaining donuts.

           (a) Find the probability that the last donut remaining in the box is a chocolate donut.

           (b) Find the probability of the following event: glazed is the first type of donut that
           Homer runs out of, and then jelly is the second type of donut that he runs out of.
           Hint: Consider the last donut remaining, and the last donut that is either glazed or jelly.
     68.   Let D be the event that a person develops a certain disease, and C be the event that
           the person was exposed to a certain substance (e.g., D may correspond to lung cancer
           and C may correspond to smoking cigarettes). We are interested in whether exposure
           to the substance is related to developing the disease (and if so, how they are related).
           The odds ratio is a very widely used measure in epidemiology of the association between
           disease and exposure, defined as
                                                         odds(D|C)
                                                 OR =                 ,
                                                         odds(D|C c )
           where conditional odds are defined analogously to unconditional odds: odds(A|B) =
            P (A|B)
           P (Ac |B)
                     . The relative risk of the disease for someone exposed to the substance, another
           widely used measure, is
                                                          P (D|C)
                                                   RR =              .
                                                          P (D|C c )
           The relative risk is especially easy to interpret, e.g., RR = 2 says that someone exposed
           to the substance is twice as likely to develop the disease as someone who isn’t exposed
           (though this does not necessarily mean that the substance causes the increased chance
           of getting the disease, nor is there necessarily a causal interpretation for the odds ratio).


Conditional probability                                                                              99

        (a) Show that if the disease is rare, both for exposed people and for unexposed people,
        then the relative risk is approximately equal to the odds ratio.

        (b) Let pij for i = 0, 1 and j = 0, 1 be the probabilities in the following 2 × 2 table.

                                                       D     Dc

                                              C        p11   p10
                                                  c
                                              C        p01   p00

        For example, p10 = P (C, Dc ). Show that the odds ratio can be expressed as a cross-
        product ratio, in the sense that
                                                  p11 p00
                                           OR =           .
                                                  p10 p01
        (c) Show that the odds ratio has the neat symmetry property that the roles of C and
        D can be swapped without changing the value:
                                                      odds(C|D)
                                           OR =                   .
                                                      odds(C|Dc )
        This property is one of the main reasons why the odds ratio is so widely used, since it
        turns out that it allows the odds ratio to be estimated in a wide variety of problems
        where relative risk would be hard to estimate well.
  69.   A researcher wants to estimate the percentage of people in some population who have
        used illegal drugs, by conducting a survey. Concerned that a lot of people would lie
        when asked a sensitive question like “Have you ever used illegal drugs?”, the researcher
        uses a method known as randomized response. A hat is filled with slips of paper, each
        of which says either “I have used illegal drugs” or “I have not used illegal drugs”. Let p
        be the proportion of slips of paper that say “I have used illegal drugs” (p is chosen by
        the researcher in advance).
        Each participant chooses a random slip of paper from the hat and answers (truthfully)
        “yes” or “no” to whether the statement on that slip is true. The slip is then returned
        to the hat. The researcher does not know which type of slip the participant had. Let
        y be the probability that a participant will say “yes”, and d be the probability that a
        participant has used illegal drugs.

        (a) Find y, in terms of d and p.

        (b) What would be the worst possible choice of p that the researcher could make in
        designing the survey? Explain.

        (c) Now consider the following alternative system. Suppose that proportion p of the slips
        of paper say “I have used illegal drugs”, but that now the remaining 1 − p say “I was
        born in winter” rather than “I have not used illegal drugs”. Assume that 1/4 of people
        are born in winter, and that a person’s season of birth is independent of whether they
        have used illegal drugs. Find d, in terms of y and p.
  70.   At the beginning of the play Rosencrantz and Guildenstern Are Dead by Tom Stop-
        pard [25], Guildenstern is spinning coins and Rosencrantz is betting on the outcome for
        each. The coins have been landing Heads over and over again, prompting the following
        remark:
              Guildenstern: A weaker man might be moved to re-examine his faith, if in
              nothing else at least in the law of probability.
        The coin spins have resulted in Heads 92 times in a row.

        (a) Fred and his friend are watching the play. Upon seeing the events described above,
        they have the following conversation:


100                                                                       Introduction to Probability

              Fred : That outcome would be incredibly unlikely with fair coins. They must
              be using trick coins (maybe with double-headed coins), or the experiment
              must have been rigged somehow (maybe with magnets).
              Fred’s friend : It’s true that the string HH. . . H of length 92 is very unlikely;
              the chance is 1/292 ≈ 2 × 10−28 with fair coins. But any other specific
              string of H’s and T’s with length 92 has exactly the same probability! The
              reason the outcome seems extremely unlikely is that the number of possible
              outcomes grows exponentially as the number of spins grows, so any outcome
              would seem extremely unlikely. You could just as well have made the same
              argument even without looking at the results of their experiment, which
              means you really don’t have evidence against the coins being fair.
        Discuss these comments, to help Fred and his friend resolve their debate.
        (b) Suppose there are only two possibilities: either the coins are all fair (and spun fairly),
        or double-headed coins are being used (in which case the probability of Heads is 1). Let
        p be the prior probability that the coins are fair. Find the posterior probability that the
        coins are fair, given that they landed Heads in 92 out of 92 trials.
        (c) Continuing from (b), for which values of p is the posterior probability that the coins
        are fair greater than 0.5? For which values of p is it less than 0.05?
  71.   There are n types of toys, which you are collecting one by one. Each time you buy a
        toy, it is randomly determined which type it has, with equal probabilities. Let pij be the
        probability that just after you have bought your ith toy, you have exactly j toy types
        in your collection, for i ≥ 1 and 0 ≤ j ≤ n. (This problem is in the setting of the coupon
        collector problem, a famous problem which we study in Example 4.3.12.)
        (a) Find a recursive equation expressing pij in terms of pi−1,j and pi−1,j−1 , for i ≥ 2
        and 1 ≤ j ≤ n.
        (b) Describe how the recursion from (a) can be used to calculate pij .
  72.   A/B testing is a form of randomized experiment that is used by many companies to
        learn about how customers will react to different treatments. For example, a company
        may want to see how users will respond to a new feature on their website (compared
        with how users respond to the current version of the website) or compare two different
        advertisements.
        As the name suggests, two different treatments, Treatment A and Treatment B, are
        being studied. Users arrive one by one, and upon arrival are randomly assigned to one
        of the two treatments. The trial for each user is classified as “success” (e.g., the user
        made a purchase) or “failure”. The probability that the nth user receives Treatment A
        is allowed to depend on the outcomes for the previous users. This set-up is known as a
        two-armed bandit.
        Many algorithms for how to randomize the treatment assignments have been studied.
        Here is an especially simple (but fickle) algorithm, called a stay-with-a-winner procedure:
         (i) Randomly assign the first user to Treatment A or Treatment B, with equal proba-
              bilities.
        (ii) If the trial for the nth user is a success, stay with the same treatment for the
              (n + 1)st user; otherwise, switch to the other treatment for the (n + 1)st user.
        Let a be the probability of success for Treatment A, and b be the probability of success
        for Treatment B. Assume that a 6= b, but that a and b are unknown (which is why
        the test is needed). Let pn be the probability of success on the nth trial and an be the
        probability that Treatment A is assigned on the nth trial (using the above algorithm).
        (a) Show that
                                         pn = (a − b)an + b,
                                       an+1 = (a + b − 1)an + 1 − b.


Conditional probability                                                                           101

        (b) Use the results from (a) to show that pn+1 satisfies the following recursive equation:

                                  pn+1 = (a + b − 1)pn + a + b − 2ab.

        (c) Use the result from (b) to find the long-run probability of success for this algorithm,
        limn→∞ pn , assuming that this limit exists.
  73.   In humans (and many other organisms), genes come in pairs. A certain gene comes in
        two types (alleles): type a and type A. The genotype of a person for that gene is the
        types of the two genes in the pair: AA, Aa, or aa (aA is equivalent to Aa). Assume that
        the Hardy-Weinberg law applies here, which means that the frequencies of AA, Aa, aa
        in the population are p2 , 2p(1 − p), (1 − p)2 respectively, for some p with 0 < p < 1.
        When a woman and a man have a child, the child’s gene pair has one gene contributed
        by each parent. Suppose that the mother is equally likely to contribute either of the two
        genes in her gene pair, and likewise for the father, independently. Also suppose that the
        genotypes of the parents are independent of each other (with probabilities given by the
        Hardy-Weinberg law).

        (a) Find the probabilities of each possible genotype (AA, Aa, aa) for a child of two
        random parents. Explain what this says about stability of the Hardy-Weinberg law
        from one generation to the next.
        Hint: Condition on the genotypes of the parents.

        (b) A person of type AA or aa is called homozygous (for the gene under consideration),
        and a person of type Aa is called heterozygous (for that gene). Find the probability
        that a child is homozygous, given that both parents are homozygous. Also, find the
        probability that a child is heterozygous, given that both parents are heterozygous.

        (c) Suppose that having genotype aa results in a distinctive physical characteristic, so it
        is easy to tell by looking at someone whether or not they have that genotype. A mother
        and father, neither of whom are of type aa, have a child. The child is also not of type
        aa. Given this information, find the probability that the child is heterozygous.
        Hint: Use the definition of conditional probability. Then expand both the numerator
        and the denominator using LOTP, conditioning on the genotypes of the parents.
  74.   A standard deck of cards will be shuffled and then the cards will be turned over one at
        a time until the first ace is revealed. Let B be the event that the next card in the deck
        will also be an ace.

        (a) Intuitively, how do you think P (B) compares in size with 1/13 (the overall proportion
        of aces in a deck of cards)? Explain your intuition. (Give an intuitive discussion rather
        than a mathematical calculation; the goal here is to describe your intuition explicitly.)

        (b) Let Cj be the event that the first ace is at position j in the deck. Find P (B|Cj ) in
        terms of j, fully simplified.

        (c) Using the law of total probability, find an expression for P (B) as a sum. (The sum
        can be left unsimplified, but it should be something that could easily be computed in
        software such as R that can calculate sums.)

        (d) Find a fully simplified expression for P (B) using a symmetry argument.
        Hint: If you were deciding whether to bet on the next card after the first ace being an
        ace or to bet on the last card in the deck being an ace, would you have a preference?


Taylor & Francis
Taylor & Francis Group
http://taylorandfrancis.com


3
Random variables and their distributions



In this chapter, we introduce random variables, an incredibly useful concept that
simplifies notation and expands our ability to quantify uncertainty and summarize
the results of experiments. Random variables are essential throughout the rest of
this book, and throughout statistics, so it is crucial to think through what they
mean, both intuitively and mathematically.




3.1   Random variables

To see why our current notation can quickly become unwieldy, consider again the
gambler’s ruin problem from Chapter 2. In this problem, we may be very interested
in how much wealth each gambler has at any particular time. So we could make up
notation like letting Ajk be the event that gambler A has exactly j dollars after k
rounds, and similarly defining an event Bjk for gambler B, for all j and k.
This is already too complicated. Furthermore, we may also be interested in other
quantities, such as the difference in their wealths (gambler A’s minus gambler B’s)
after k rounds, or the duration of the game (the number of rounds until one player is
bankrupt). Expressing the event “the duration of the game is r rounds” in terms of
the Ajk and Bjk would involve a long, awkward string of unions and intersections.
And then what if we want to express gambler A’s wealth as the equivalent amount
in euros rather than dollars? We can multiply a number in dollars by a currency
exchange rate, but we can’t multiply an event by an exchange rate.
Instead of having convoluted notation that obscures how the quantities of interest
are related, wouldn’t it be nice if we could say something like the following?
     Let Xk be the wealth of gambler A after k rounds. Then Yk = N − Xk
 is the wealth of gambler B after k rounds (where N is the fixed total wealth);
 Xk − Yk = 2Xk − N is the difference in wealths after k rounds; ck Xk is the wealth
 of gambler A in euros after k rounds, where ck is the euros per dollar exchange
 rate after k rounds; and the duration is R = min{n : Xn = 0 or Yn = 0}.
The notion of a random variable will allow us to do exactly this! It needs to be
introduced carefully though, to make it both conceptually and technically correct.
Sometimes a definition of “random variable” is given that is a barely paraphrased

                                                                                 103


104                                                           Introduction to Probability

version of “a random variable is a variable that takes on random values”, but such
a feeble attempt at a definition fails to say where the randomness come from. Nor
does it help us to derive properties of random variables: we’re familiar with working
with algebraic equations like x2 + y 2 = 1, but what are the valid mathematical
operations if x and y are random variables? To make the notion of random variable
precise, we define it as a function mapping the sample space to the real line. (See
the math appendix for review of some concepts about functions.)




             s1        s2        s3
                                           X
                  s4        s5        s6              0   1              4




FIGURE 3.1
A random variable maps the sample space into the real line. The r.v. X depicted
here is defined on a sample space with 6 elements, and has possible values 0, 1,
and 4. The randomness comes from choosing a random pebble according to the
probability function P for the sample space.


Definition 3.1.1 (Random variable). Given an experiment with sample space S,
a random variable (r.v.) is a function from the sample space S to the real numbers
R. It is common, but not required, to denote random variables by capital letters.
Thus, a random variable X assigns a numerical value X(s) to each possible outcome
s of the experiment. The randomness comes from the fact that we have a random
experiment (with probabilities described by the probability function P ); the map-
ping itself is deterministic, as illustrated in Figure 3.1. The same r.v. is shown in a
simpler way in the left panel of Figure 3.2, in which we inscribe the values inside
the pebbles.

This definition is abstract but fundamental; one of the most important skills to
develop when studying probability and statistics is the ability to go back and forth
between abstract ideas and concrete examples. Relatedly, it is important to work
on recognizing the essential pattern or structure of a problem and how it connects


Random variables and their distributions                                              105

to problems you have studied previously. We will often discuss stories that involve
tossing coins or drawing balls from urns because they are simple, convenient sce-
narios to work with, but many other problems are isomorphic: they have the same
essential structure, but in a different guise.
To start, let’s consider a coin-tossing example. The structure of the problem is that
we have a sequence of trials where there are two possible outcomes for each trial.
Here we think of the possible outcomes as H (Heads) and T (Tails), but we could
just as well think of them as “success” and “failure” or as 1 and 0, for example.
Example 3.1.2 (Coin tosses). Consider an experiment where we toss a
fair coin twice. The sample space consists of four possible outcomes: S =
{HH, HT, T H, T T }. Here are some random variables on this space (for practice,
you can think up some of your own). Each r.v. is a numerical summary of some
aspect of the experiment.
• Let X be the number of Heads. This is a random variable with possible values 0,
  1, and 2. Viewed as a function, X assigns the value 2 to the outcome HH, 1 to
  the outcomes HT and T H, and 0 to the outcome T T . That is,

                   X(HH) = 2, X(HT ) = X(T H) = 1, X(T T ) = 0.

• Let Y be the number of Tails. In terms of X, we have Y = 2 − X. In other words,
  Y and 2 − X are the same r.v.: Y (s) = 2 − X(s) for all s.
• Let I be 1 if the first toss lands Heads and 0 otherwise. Then I assigns the value 1
  to the outcomes HH and HT and 0 to the outcomes T H and T T . This r.v. is an
  example of what is called an indicator random variable since it indicates whether
  the first toss lands Heads, using 1 to mean “yes” and 0 to mean “no”.
We can also encode the sample space as {(1, 1), (1, 0), (0, 1), (0, 0)}, where 1 is the
code for Heads and 0 is the code for Tails. Then we can give explicit formulas for
X, Y, I:

            X(s1 , s2 ) = s1 + s2 , Y (s1 , s2 ) = 2 − s1 − s2 , I(s1 , s2 ) = s1 ,

where for simplicity we write X(s1 , s2 ) to mean X((s1 , s2 )), etc.
For most r.v.s we will consider, it is tedious or infeasible to write down an explicit
formula in this way. Fortunately, it is usually unnecessary to do so, since (as we
saw in this example) there are other ways to define an r.v., and (as we will see
throughout the rest of this book) there are many ways to study the properties of
an r.v. other than by doing computations with an explicit formula for what it maps
each outcome s to.                                                                  
As in the previous chapters, for a sample space with a finite number of outcomes
we can visualize the outcomes as pebbles, with the mass of a pebble corresponding
to its probability, such that the total mass of the pebbles is 1. A random variable
simply labels each pebble with a number. Figure 3.2 shows two random variables


106                                                                Introduction to Probability

defined on the same sample space: the pebbles or outcomes are the same, but the
real numbers assigned to the outcomes are different.




                1            0             1               5.3          -2            2
      s1                s2            s3             s1            s2            s3

                    0             4             1              9             3             0
           s4                s5            s6             s4            s5            s6


FIGURE 3.2
Two random variables defined on the same sample space.

As we’ve mentioned earlier, the source of the randomness in a random variable is
the experiment itself, in which a sample outcome s ∈ S is chosen according to a
probability function P . Before we perform the experiment, the outcome s has not
yet been realized, so we don’t know the value of X, though we could calculate the
probability that X will take on a given value or range of values. After we perform the
experiment and the outcome s has been realized, the random variable crystallizes
into the numerical value X(s).
Random variables provide numerical summaries of the experiment in question. This
is very handy because the sample space of an experiment is often incredibly com-
plicated or high-dimensional, and the outcomes s ∈ S may be non-numeric. For
example, the experiment may be to collect a random sample of people in a certain
city and ask them various questions, which may have numeric (e.g., age or height)
or non-numeric (e.g., political party or favorite movie) answers. The fact that r.v.s
take on numerical values is a very convenient simplification compared to having to
work with the full complexity of S at all times.




3.2        Distributions and probability mass functions

There are two main types of random variables used in practice: discrete r.v.s and
continuous r.v.s. In this chapter and the next, our focus is on discrete r.v.s. Con-
tinuous r.v.s are introduced in Chapter 5.
Definition 3.2.1 (Discrete random variable). A random variable X is said to be
discrete if there is a finite list of values a1 , a2 , . . . , an or an infinite list of values
a1 , a2 , . . . such that P (X = aj for some j) = 1. If X is a discrete r.v., then the


Random variables and their distributions                                            107

finite or countably infinite set of values x such that P (X = x) > 0 is called the
support of X.

Most commonly in applications, the support of a discrete r.v. is a set of integers.
In contrast, a continuous r.v. can take on any real value in an interval (possibly
even the entire real line); such r.v.s are defined more precisely in Chapter 5. It
is also possible to have an r.v. that is a hybrid of discrete and continuous, such
as by flipping a coin and then generating a discrete r.v. if the coin lands Heads
and generating a continuous r.v. if the coin lands Tails. But the starting point for
understanding such r.v.s is to understand discrete and continuous r.v.s.

Given a random variable, we would like to be able to describe its behavior using the
language of probability. For example, we might want to answer questions about the
probability that the r.v. will fall into a given range: if L is the lifetime earnings of
a randomly chosen U.S. college graduate, what is the probability that L exceeds a
million dollars? If M is the number of major earthquakes in California in the next
five years, what is the probability that M equals 0?

The distribution of a random variable provides the answers to these questions; it
specifies the probabilities of all events associated with the r.v., such as the proba-
bility of it equaling 3 and the probability of it being at least 110. We will see that
there are several equivalent ways to express the distribution of an r.v. For a discrete
r.v., the most natural way to do so is with a probability mass function, which we
now define.

Definition 3.2.2 (Probability mass function). The probability mass function
(PMF) of a discrete r.v. X is the function pX given by pX (x) = P (X = x). Note
that this is positive if x is in the support of X, and 0 otherwise.

h 3.2.3. In writing P (X = x), we are using X = x to denote an event, consisting
of all outcomes s to which X assigns the number x. This event is also written as
{X = x}; formally, {X = x} is defined as {s ∈ S : X(s) = x}, but writing {X = x}
is shorter and more intuitive. Going back to Example 3.1.2, if X is the number
of Heads in two fair coin tosses, then {X = 1} consists of the sample outcomes
HT and T H, which are the two outcomes to which X assigns the number 1. Since
{HT, T H} is a subset of the sample space, it is an event. So it makes sense to talk
about P (X = 1), or more generally, P (X = x). If {X = x} were anything other
than an event, it would make no sense to calculate its probability! It does not make
sense to write “P (X)”; we can only take the probability of an event, not of an r.v.

Let’s look at a few examples of PMFs.

Example 3.2.4 (Coin tosses continued). In this example we’ll find the PMFs of
all the random variables in Example 3.1.2, the example with two fair coin tosses.
Here are the r.v.s we defined, along with their PMFs:

• X, the number of Heads. Since X equals 0 if T T occurs, 1 if HT or T H occurs,


108                                                                 Introduction to Probability

  and 2 if HH occurs, the PMF of X is the function pX given by

                                     pX (0) = P (X = 0) = 1/4,
                                     pX (1) = P (X = 1) = 1/2,
                                     pX (2) = P (X = 2) = 1/4,

  and pX (x) = 0 for all other values of x.
• Y = 2 − X, the number of Tails. Reasoning as above or using the fact that

                     P (Y = y) = P (2 − X = y) = P (X = 2 − y) = pX (2 − y),

  the PMF of Y is

                                     pY (0) = P (Y = 0) = 1/4,
                                     pY (1) = P (Y = 1) = 1/2,
                                     pY (2) = P (Y = 2) = 1/4,

  and pY (y) = 0 for all other values of y.
  Note that X and Y have the same PMF (that is, pX and pY are the same function)
  even though X and Y are not the same r.v. (that is, X and Y are two different
  functions from {HH, HT, T H, T T } to the real line).
• I, the indicator of the first toss landing Heads. Since I equals 0 if T H or T T
  occurs and 1 if HH or HT occurs, the PMF of I is

                                     pI (0) = P (I = 0) = 1/2,
                                     pI (1) = P (I = 1) = 1/2,

  and pI (i) = 0 for all other values of i.
      1.0




                                     1.0




                                                                  1.0
  PMF




                                    PMF




                                                                 PMF
   0.5




                                     0.5




                                                                  0.5
      0.0




                                     0.0




                                                                  0.0




            −1   0     1   2    3          −1   0   1   2   3           −1   0   1   2   3
                       x                            y                            i


FIGURE 3.3
Left to right: PMFs of X, Y , and I, with X the number of Heads in two fair coin
tosses, Y the number of Tails, and I the indicator of Heads on the first toss.

The PMFs of X, Y , and I are plotted in Figure 3.3. Vertical bars are drawn to
make it easier to compare the heights of different points.                  


Random variables and their distributions                                                   109

Example 3.2.5 (Sum of die rolls). We roll two fair 6-sided dice. Let T = X + Y
be the total of the two rolls, where X and Y are the individual rolls. The sample
space of this experiment has 36 equally likely outcomes:

                           S = {(1, 1), (1, 2), . . . , (6, 5), (6, 6)}.

For example, 7 of the 36 outcomes s are shown in the table below, along with the
corresponding values of X, Y, and T . After the experiment is performed, we observe
values for X and Y , and then the observed value of T is the sum of those values.

                                    s      X      Y     X +Y
                                  (1, 2)    1      2       3
                                  (1, 6)    1      6       7
                                  (2, 5)    2      5       7
                                  (3, 1)    3      1       4
                                  (4, 3)    4      3       7
                                  (5, 4)    5      4       9
                                  (6, 6)    6      6      12

Since the dice are fair, the PMF of X is

                                        P (X = j) = 1/6,

for j = 1, 2, . . . , 6 (and P (X = j) = 0 otherwise); we say that X has a Discrete Uni-
form distribution on 1, 2, . . . , 6. Similarly, Y is also Discrete Uniform on 1, 2, . . . , 6.
Note that Y has the same distribution as X but is not the same random variable
as X. In fact, we have
                          P (X = Y ) = 6/36 = 1/6.
Two more r.v.s in this experiment with the same distribution as X are 7 − X and
7 − Y . To see this, we can use the fact that for a standard die, 7 − X is the value on
the bottom if X is the value on the top. If the top value is equally likely to be any
of the numbers 1, 2, . . . , 6, then so is the bottom value. Note that even though 7 − X
has the same distribution as X, it is never equal to X in a run of the experiment!
Let’s now find the PMF of T . By the naive definition of probability,

                             P (T = 2) = P (T = 12) = 1/36,
                             P (T = 3) = P (T = 11) = 2/36,
                             P (T = 4) = P (T = 10) = 3/36,
                             P (T = 5) = P (T = 9) = 4/36,
                             P (T = 6) = P (T = 8) = 5/36,
                             P (T = 7) = 6/36.

For all other values of t, P (T = t) = 0. We can see directly that the support of T


110                                                               Introduction to Probability

is {2, 3, . . . , 12} just by looking at the possible totals for two dice, but as a check,
note that
                         P (T = 2) + P (T = 3) + · · · + P (T = 12) = 1,
which shows that all possibilities have been accounted for. The symmetry property
of T that appears above, P (T = t) = P (T = 14−t), makes sense since each outcome
{X = x, Y = y} which makes T = t has a corresponding outcome {X = 7 − x, Y =
7 − y} of the same probability which makes T = 14 − t.
              0.20




                                              ●
              0.15




                                         ●          ●


                                    ●                    ●
           PMF
              0.10




                              ●                               ●
              0.05




                         ●                                            ●


                     ●                                                     ●
              0.00




                     2   3    4     5    6    7    8     9   10      11   12
                                              t


FIGURE 3.4
PMF of the sum of two die rolls.

The PMF of T is plotted in Figure 3.4; it has a triangular shape, and the symmetry
noted above is very visible.                                                    
Example 3.2.6 (Children in a U.S. household). Suppose we choose a household
in the United States at random. Let X be the number of children in the chosen
household. Since X can only take on integer values, it is a discrete r.v. The proba-
bility that X takes on the value x is proportional to the number of households in
the United States with x children.
Using data from the 2010 General Social Survey [23], we can approximate the pro-
portion of households with 0 children, 1 child, 2 children, etc., and hence approxi-
mate the PMF of X, which is plotted in Figure 3.5.                                
We will now state the properties of a valid PMF.
Theorem 3.2.7 (Valid PMFs). Let X be a discrete r.v. with support x1 , x2 , . . .
(assume these values are distinct and, for notational simplicity, that the support is
countably infinite; the analogous results hold if the support is finite). The PMF pX
of X must satisfy the following two criteria:
• Nonnegative: pX (x) > 0 if x = xj for some j, and pX (x) = 0 otherwise;
            P
• Sums to 1: ∞ j=1 pX (xj ) = 1.


Random variables and their distributions                                                 111




                0.5
                0.4
                0.3   ●
             PMF
                0.2                    ●



                            ●                ●
                0.1




                                                     ●

                                                         ●
                                                               ●           ●
                0.0




                                                                     ●

                      0    1           2     3       4   5     6     7     8
                                                     x


FIGURE 3.5
PMF of the number of children in a randomly selected U.S. household.


Proof. The first criterion is true since probability is nonnegative. The second is true
since X must take on some value, and the events {X = xj } are disjoint, so
                                                
     ∞
     X                          ∞
                                [
           P (X = xj ) = P           {X = xj } = P (X = x1 or X = x2 or . . . ) = 1.    
     j=1                        j=1


Conversely, if distinct values x1 , x2 , . . . are specified and we have a function satisfy-
ing the two criteria above, then this function is the PMF of some r.v.; we will show
how to construct such an r.v. in Chapter 5.
We claimed earlier that the PMF is one way of expressing the distribution of a
discrete r.v. This is because once we know the PMF of X, we can calculate the
probability that X will fall into a given subset of the real numbers by summing over
the appropriate values of x, as the next example shows.
Example 3.2.8. Returning to Example 3.2.5, let T be the sum of two fair die rolls.
We have already calculated the PMF of T . Now suppose we’re interested in the
probability that T is in the interval [1, 4]. There are only three values in the interval
[1, 4] that T can take on, namely, 2, 3, and 4. We know the probability of each of
these values from the PMF of T , so

              P (1 ≤ T ≤ 4) = P (T = 2) + P (T = 3) + P (T = 4) = 6/36.                   

In general, given a discrete r.v. X and a set B of real numbers, if we know the PMF
of X we can find P (X ∈ B), the probability that X is in B, by summing up the
heights of the vertical bars at points in B in the plot of the PMF of X. Knowing
the PMF of a discrete r.v. determines its distribution.


112                                                            Introduction to Probability




3.3   Bernoulli and Binomial

Some distributions are so ubiquitous in probability and statistics that they have
their own names. We will introduce these named distributions throughout the book,
starting with a very simple but useful case: an r.v. that can take on only two possible
values, 0 and 1.
Definition 3.3.1 (Bernoulli distribution). An r.v. X is said to have the Bernoulli
distribution with parameter p if P (X = 1) = p and P (X = 0) = 1 − p, where
0 < p < 1. We write this as X ∼ Bern(p). The symbol ∼ is read “is distributed as”.
Any r.v. whose possible values are 0 and 1 has a Bern(p) distribution, with p the
probability of the r.v. equaling 1. This number p in Bern(p) is called the parame-
ter of the distribution; it determines which specific Bernoulli distribution we have.
Thus there is not just one Bernoulli distribution, but rather a family of Bernoulli
distributions, indexed by p. For example, if X ∼ Bern(1/3), it would be correct but
incomplete to say “X is Bernoulli”; to fully specify the distribution of X, we should
both say its name (Bernoulli) and its parameter value (1/3), which is the point of
the notation X ∼ Bern(1/3).
Any event has a Bernoulli r.v. that is naturally associated with it, equal to 1 if the
event happens and 0 otherwise. This is called the indicator random variable of the
event; we will see that such r.v.s are extremely useful.
Definition 3.3.2 (Indicator random variable). The indicator random variable of
an event A is the r.v. which equals 1 if A occurs and 0 otherwise. We will denote
the indicator r.v. of A by IA or I(A). Note that IA ∼ Bern(p) with p = P (A).
We often imagine Bernoulli r.v.s using coin tosses, but this is just convenient lan-
guage for discussing the following general story.
Story 3.3.3 (Bernoulli trial). An experiment that can result in either a “success”
or a “failure” (but not both) is called a Bernoulli trial. A Bernoulli random variable
can be thought of as the indicator of success in a Bernoulli trial: it equals 1 if success
occurs and 0 if failure occurs in the trial.                                            
Because of this story, the parameter p is often called the success probability of the
Bern(p) distribution. Once we start thinking about Bernoulli trials, it’s hard not to
start thinking about what happens when we have more than one trial.
Story 3.3.4 (Binomial distribution). Suppose that n independent Bernoulli trials
are performed, each with the same success probability p. Let X be the number of
successes. The distribution of X is called the Binomial distribution with parameters
n and p. We write X ∼ Bin(n, p) to mean that X has the Binomial distribution
with parameters n and p, where n is a positive integer and 0 < p < 1.             
Notice that we define the Binomial distribution not by its PMF, but by a story


Random variables and their distributions                                           113

about the type of experiment that could give rise to a random variable with a
Binomial distribution. The most famous distributions in statistics all have stories
which explain why they are so often used as models for data, or as the building
blocks for more complicated distributions.
Thinking about the named distributions first and foremost in terms of their stories
has many benefits. It facilitates pattern recognition, allowing us to see when two
problems are essentially identical in structure; it often leads to cleaner solutions
that avoid PMF calculations altogether; and it helps us understand how the named
distributions are connected to one another. Here it is clear that Bern(p) is the same
distribution as Bin(1, p): the Bernoulli is a special case of the Binomial.
Using the story definition of the Binomial, let’s find its PMF.
Theorem 3.3.5 (Binomial PMF). If X ∼ Bin(n, p), then the PMF of X is
                                   
                                   n k
                      P (X = k) =     p (1 − p)n−k
                                   k

for k = 0, 1, . . . , n (and P (X = k) = 0 otherwise).
h 3.3.6. To save writing, it is often left implicit that a PMF is zero wherever it is
not specified to be nonzero, but in any case it is important to understand what the
support of a random variable is, and good practice to check that PMFs are valid. If
two discrete r.v.s have the same PMF, then they also must have the same support.
So we sometimes refer to the support of a discrete distribution; this is the support
of any r.v. with that distribution.

Proof. An experiment consisting of n independent Bernoulli trials produces a se-
quence of successes and failures. The probability of any specific sequence of k suc-
cesses and n − k failures is pk (1 − p)n−k . There are nk such sequences, since we
just need to select where the successes are. Therefore, letting X be the number of
successes,                               
                                          n k
                          P (X = k) =         p (1 − p)n−k
                                          k
for k = 0, 1, . . . , n, and P (X = k) = 0 otherwise. This is a valid PMF because it is
nonnegative and it sums to 1 by the binomial theorem.                                

Figure 3.6 shows plots of the Binomial PMF for various values of n and p. Note
that the PMF of the Bin(10, 1/2) distribution is symmetric about 5, but when the
success probability is not 1/2, the PMF is skewed. For a fixed number of trials n, X
tends to be larger when the success probability is high and lower when the success
probability is low, as we would expect from the story of the Binomial distribution.
Also recall that in any PMF plot, the sum of the heights of the vertical bars must
be 1.
We’ve used Story 3.3.4 to find the Bin(n, p) PMF. The story also gives us a straight-
forward proof of the fact that if X is Binomial, then n − X is also Binomial.


114                                                                                  Introduction to Probability




                             Bin(10, 1/2)                                           Bin(10, 1/8)
       0.4




                                                              0.4
                                                                        ●
       0.3




                                                              0.3
                                                                    ●
                                  ●                                         ●
      PMF




                                                             PMF
       0.2




                                                              0.2
                              ●       ●




                         ●                  ●
       0.1




                                                              0.1
                                                                                ●


                     ●                          ●
                                                                                     ●
                 ●                                  ●
       0.0




                                                              0.0


             ●                                          ●                                ●   ●     ●   ●   ●   ●

             0       2        4       6         8       10          0       2        4       6         8       10
                                  x                                                      x

                         Bin(100, 0.03)                                             Bin(9, 4/5)
       0.4




                                                              0.4
       0.3




                                                              0.3




                                                                                                   ●   ●




                     ●   ●
      PMF




                                                             PMF
       0.2




                                                              0.2




                              ●                                                              ●
                 ●
                                                                                                           ●
       0.1




                                                              0.1




                                  ●

                                                                                         ●
             ●                        ●
                                            ●                                        ●
                                                ●
       0.0




                                                              0.0




                                                    ●   ●           ●   ●   ●   ●

             0       2        4       6         8       10          0       2        4       6         8       10
                                  x                                                      x


FIGURE 3.6
Some Binomial PMFs. In the lower left, we plot the Bin(100, 0.03) PMF between 0
and 10 only, as the probability of more than 10 successes is close to 0.


Random variables and their distributions                                          115

Theorem 3.3.7. Let X ∼ Bin(n, p), and q = 1 − p (we often use q to denote the
failure probability of a Bernoulli trial). Then n − X ∼ Bin(n, q).

Proof. Using the story of the Binomial, interpret X as the number of successes
in n independent Bernoulli trials. Then n − X is the number of failures in those
trials. Interchanging the roles of success and failure, we have n − X ∼ Bin(n, q).
Alternatively, we can check that n − X has the Bin(n, q) PMF. Let Y = n − X. The
PMF of Y is
                                                             
                                             n                 n k n−k
            P (Y = k) = P (X = n − k) =            pn−k q k =     q p  ,
                                            n−k                k

for k = 0, 1, . . . , n.                                                            
Corollary 3.3.8. Let X ∼ Bin(n, p) with p = 1/2 and n even. Then the distribution
of X is symmetric about n/2, in the sense that P (X = n/2 + j) = P (X = n/2 − j)
for all nonnegative integers j.

Proof. By Theorem 3.3.7, n − X is also Bin(n, 1/2), so

                           P (X = k) = P (n − X = k) = P (X = n − k)

for all nonnegative integers k. Letting k = n/2 + j, the desired result follows. This
explains why the Bin(10, 1/2) PMF is symmetric about 5 in Figure 3.6.              
Example 3.3.9 (Coin tosses continued). Going back to Example 3.1.2, we now
know that X ∼ Bin(2, 1/2), Y ∼ Bin(2, 1/2), and I ∼ Bern(1/2). Consistent with
Theorem 3.3.7, X and Y = 2 − X have the same distribution, and consistent with
Corollary 3.3.8, the distribution of X (and of Y ) is symmetric about 1.    




3.4     Hypergeometric

If we have an urn filled with w white and b black balls, then drawing n balls out
of the urn with replacement yields a Bin(n, w/(w + b)) distribution for the number
of white balls obtained in n trials, since the draws are independent Bernoulli trials,
each with probability w/(w+b) of success. If we instead sample without replacement,
as illustrated in Figure 3.7, then the number of white balls follows a Hypergeometric
distribution.
Story 3.4.1 (Hypergeometric distribution). Consider an urn with w white balls
and b black balls.We draw n balls out of the urn at random without replacement,
such that all w+b
               n   samples are equally likely. Let X be the number of white balls in
the sample. Then X is said to have the Hypergeometric distribution with parameters
w, b, and n; we denote this by X ∼ HGeom(w, b, n).                                


116                                                              Introduction to Probability




FIGURE 3.7
Hypergeometric story. An urn contains w = 6 white balls and b = 4 black balls. We
sample n = 5 without replacement. The number X of white balls in the sample is
Hypergeometric; here we observe X = 3.


As with the Binomial distribution, we can obtain the PMF of the Hypergeometric
distribution from the story.
Theorem 3.4.2 (Hypergeometric PMF). If X ∼ HGeom(w, b, n), then the PMF
of X is                                        w      b
                                                 k    n−k
                                 P (X = k) =         w+b
                                                            ,
                                                      n
for integers k satisfying 0 ≤ k ≤ w and 0 ≤ n − k ≤ b, and P (X = k) = 0 otherwise.

Proof. To get P (X = k), we first count the number of possible ways to draw exactly
k white balls and n − k black balls from the urn (without distinguishing between
                                                     b If k > w or n − k > b, then
different orderings for getting the same set of balls).
the draw is impossible. Otherwise, there are wk n−k        ways to draw k white and
                                                                   
n − k black balls by the multiplication rule, and there are w+b n    total ways to draw
n balls. Since all samples are equally likely, the naive definition of probability gives
                                                w
                                                   b 
                                                 k    n−k
                                 P (X = k) =         w+b
                                                         
                                                      n

for integers k satisfying 0 ≤ k ≤ w and 0 ≤ n−k
                                                ≤ b. This PMF is valid because the
numerator, summed over all k, equals w+b  n   by Vandermonde’s identity (Example
1.5.3), so the PMF sums to 1.                                                    

The Hypergeometric distribution comes up in many scenarios which, on the surface,
have little in common with white and black balls in an urn. The essential structure
of the Hypergeometric story is that items in a population are classified using two
sets of tags: in the urn story, each ball is either white or black (this is the first set of
tags), and each ball is either sampled or not sampled (this is the second set of tags).
Furthermore, at least one of these sets of tags is assigned completely at random
(in the urn story, the balls are sampled randomly, with all sets of the correct size
equally likely). Then X ∼ HGeom(w, b, n) represents the number of twice-tagged
items: in the urn story, balls that are both white and sampled.
```
