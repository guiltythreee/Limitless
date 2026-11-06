# Chapter 2: Conditional Probability — Detailed Solutions

**Book:** Introduction to Probability, Second Edition  
**Authors:** Joseph K. Blitzstein and Jessica Hwang

> Source transcription from the supplied chapter-solution PDF. The solution numbering and worked reasoning are retained. Mathematical notation should be checked against the original source if a character appears ambiguous.

```text
INTRODUCTION TO PROBABILITY


                           Detailed Solutions
                   Chapter 2 – Conditional Probability


                     Complete worked solutions to Exercises 1–74




Scope. Solutions follow the exercises in the uploaded Chapter 2 PDF and use conditional
probability, Bayes’ rule, the law of total probability, independence, first-step analysis, and the
chapter’s stated conventions. Parameters are retained symbolically where the problem asks for a
general result.


Introduction to Probability                  Chapter 2: Conditional Probability


Contents
Conditioning on evidence                                                     2

Independence and conditional independence                                    8

Monty Hall                                                                  10

First-step analysis and gambler’s ruin                                      13

Simpson’s paradox                                                           15

Mixed practice                                                              16




                                         1


Introduction to Probability                                             Chapter 2: Conditional Probability


Conditioning on evidence

Exercise 1

Let S denote spam and F the event that the phrase appears. Bayes’ rule gives
                              P(F | S)P(S)                      0.10(0.80)          40
        P(S | F ) =                                     =                         =    ≈ 0.9756 .
                      P(F | S)P(S) + P(F | S c )P(S c )   0.10(0.80) + 0.01(0.20)   41
Although only 10% of spam contains the phrase, the phrase is ten times as common in spam as in
legitimate mail, and spam is common to begin with.

Exercise 2

Let I mean identical twins and B mean both are boys. Then
                                         1 1 1                          2 1 1
                            P(I ∩ B) =    · = ,          P(I c ∩ B) =    · = .
                                         3 2 6                          3 4 6
Thus P(B) = 1/3 and
                                                         1/6  1
                                            P(I | B) =       = .
                                                         1/3  2
The evidence of two boys is equally likely under the identical and fraternal possibilities after their prior
weights are included.

Exercise 3

Let S denote smoking and L lung cancer. Write the non-smoker cancer risk as c; the smoker risk is 23c.
Then
                                          23c(0.216)           4.968
                         P(S | L) =                        =         ≈ 0.8637 .
                                    23c(0.216) + c(0.784)      5.752
The baseline risk c cancels. The requested probability is not simply 23 times the smoking prevalence; it
must be normalized across smokers and non-smokers.

Exercise 4

Here P(R | K) = 1 and P(R | K c ) = 1/n. Therefore
                                                  p              np
                               P(K | R) =                 =              .
                                            p + (1 − p)/n   1 + (n − 1)p
Subtracting p gives
                                                  (n − 1)p(1 − p)
                                   P(K | R) − p =                 ≥ 0.
                                                   1 + (n − 1)p
A correct answer is evidence of knowledge because a knowledgeable student is certain to be right,
whereas a guesser is right only 1/n of the time. Equality holds in the degenerate cases p = 0, p = 1, or
n = 1.

Exercise 5

The first two cards are known, and they include only one ace. There are 50 cards left, of which 3 are
aces. By conditional probability, or simply by the symmetry of the remaining positions,
                                                                              3
                             P(third card is an ace | first two revealed) =      .
                                                                              50
The two methods agree: every one of the 50 remaining cards is equally likely to occupy position three.

                                                     2


Introduction to Probability                                             Chapter 2: Conditional Probability


Exercise 6

Let D mean the selected coin is double-headed and H7 mean seven heads. The prior chance of D is
1/100; the likelihoods are 1 and 2−7 . Hence
                                               1/100           128
                         P(D | H7 ) =                     −7
                                                             =     ≈ 0.5639 .
                                        1/100 + (99/100)2      227
Seven heads make the unusual coin more likely than not, despite its small prior probability.

Exercise 7

Let D indicate that the hat contains one double-headed coin, and let H7 denote seven heads from the
selected coin. Conditional on D,
                                    1   99 1      227                               1
                     P(H7 | D) =      +        =       ,           P(H7 | Dc ) =       .
                                   100 100 128   12800                             128
Since P(D) = 1/2,
                                                       227      227
                                     P(D | H7 ) =             =     .
                                                    227 + 100   327
For part (b), within D the selected coin is double-headed with posterior probability
                                                                        1       128
                    P(selected coin is double-headed | D, H7 ) =              =     .
                                                                   1 + 99/128   227
If Dc holds, the selected coin cannot be double-headed. Therefore
                                                                   227 128   128
                       P(selected coin is double-headed | H7 ) =           =     .
                                                                   327 227   327

Exercise 8

Let D denote a defective screen. The joint probabilities that a screen is defective and came from A, B,
C are respectively 0.5(0.01) = 0.005, 0.3(0.02) = 0.006, and 0.2(0.03) = 0.006. Thus
                                                     0.005           5
                                P(A | D) =                         = .
                                             0.005 + 0.006 + 0.006  17

Exercise 9

If A1 ⊆ B and A2 ⊆ B, then Ai ∩ B = Ai . Consequently
                                                  P(Ai ∩ B)   P(Ai )
                                    P(Ai | B) =             =        .
                                                    P(B)      P(B)
Equal priors therefore give equal posteriors. For example, two equally likely mutually exclusive causes
that both necessarily produce symptom B remain equally likely after observing B.

Exercise 10

The milestone assumption means that, conditional on the second milestone status, the first milestone
gives no additional information about the third. Thus
                                P(A3 | A1 ) = 0.8(0.8) + 0.2(0.3) = 0.70,
                                P(A3 | Ac1 ) = 0.3(0.8) + 0.7(0.3) = 0.45.
If P(A1 ) = 0.75, the law of total probability yields
                              P(A3 ) = 0.75(0.70) + 0.25(0.45) = 0.6375 .

                                                     3


Introduction to Probability                                            Chapter 2: Conditional Probability


Exercise 11

Let x = P(A). The reported 60% is P(A | W ), so
                                                       0.7x
                                        0.60 =                     .
                                                 0.7x + 0.3(1 − x)
Solving, 0.24x + 0.18 = 0.70x, whence

                                                       9
                                        P(A) = x =       ≈ 0.3913.
                                                      23

The poll over-represents A voters because they are more willing to participate.


Exercise 12

(a) With equal prior probabilities, the two joint likelihoods of receiving 1 are 12 (0.90) if 1 was sent and
 1
 2 (0.05) if 0 was sent. Hence

                                                              0.90      18
                                P(sent 1 | received 1) =               = .
                                                           0.90 + 0.05  19

(b) For the received string 110, the likelihood given that 1 was sent is (0.9)(0.9)(0.1) = 0.081. Given
that 0 was sent it is (0.05)(0.05)(0.95) = 0.002375. Thus

                                                         0.081        648
                               P(sent 1 | 110) =                    =     .
                                                   0.081 + 0.002375   667

The bit errors are independent, so the likelihood of the entire three-bit string is the product of the
three bitwise likelihoods.


Exercise 13

(a) Test A is correct with probability 0.01(0.95) + 0.99(0.95) = 0.95. Test B always says “no disease”,
so it is correct with probability 0.99. Therefore B has the higher overall accuracy. (b) Test A is still
useful because it detects 95% of the people who actually have the disease; test B misses every diseased
person. Overall accuracy alone does not capture the costs of false negatives. (c) If sensitivity and
specificity both equal s, accuracy is 0.01s + 0.99s = s, so beating B requires s > 0.99 . If sensitivity is
1, accuracy is 0.01 + 0.99s and one needs s > 98/99 . If specificity is 1, accuracy is 0.99 + 0.01s, so
any s > 0 beats 0.99.


Exercise 14

Let A mean Peter installs an alarm and B mean his home is burglarized. The intuitive story in (a)
suggests P(A | B) > P(A | B c ): a burglary may prompt installation. The security-effect intuition in
(b) suggests P(B | A) < P(B | Ac ). These cannot both be true. For the algebra, the first inequality is
equivalent, after multiplying by positive denominators, to

                                         P(A ∩ B) > P(A)P(B).

The inequality P(B | A) > P(B | Ac ) is equivalent to exactly the same condition. Therefore

                            P(A | B) > P(A | B c ) ⇐⇒ P(B | A) > P(B | Ac ).

The common mistake is to interpret the two conditional probabilities as causal effects in opposite
directions. They describe one association and must have the same sign.

                                                     4


Introduction to Probability                                            Chapter 2: Conditional Probability


Exercise 15

The conditional probability of both events having occurred is

                                         P(A ∩ B)                          P(A ∩ B)
                        P(A ∩ B | A) =            ,       P(A ∩ B | B) =            ,
                                           P(A)                              P(B)

while conditioning on A∪B gives denominator P(A∪B). The given ordering is P(A) < P(B) < P(A∪B),
so the largest posterior probability is obtained by learning A. Thus the best information is A occurred .


Exercise 16

The assumption says P(A ∩ B) ≤ P(A)P(B). Since

                            P(A ∩ B c ) = P(A) − P(A ∩ B) ≥ P(A)(1 − P(B)),

dividing by P(B c ) gives
                                            P(A | B c ) ≥ P(A).
If observing B makes A less likely, the complementary information B c must make A at least as likely
as its prior level.


Exercise 17

(a) P(B | A) = 1 implies P(A ∩ B c ) = 0. Hence

                               P(Ac ∩ B c ) = P(B c ) − P(A ∩ B c ) = P(B c ),

so, provided P(B c ) > 0, P(Ac | B c ) = 1 . (b) Approximate equality does not preserve the conclusion.
Take independent events with P(A) = P(B) = 0.999. Then P(B | A) = 0.999 is close to 1, but
P(Ac | B c ) = P(Ac ) = 0.001 is close to 0.


Exercise 18

If P(A) = 1, then P(Ac ) = 0, and thus

                                       0 ≤ P(B ∩ Ac ) ≤ P(Ac ) = 0.

So P(B ∩ A) = P(B) and, when P(B) > 0,

                                               P(A | B) = 1.

A probability-one belief cannot be changed by conditioning on an event of positive probability.


Exercise 19

The saying is a statement about posterior reasoning. Evidence should eliminate hypotheses that are
logically incompatible with what is observed; the remaining possibilities are then renormalized. A
hypothesis that was merely unlikely is not impossible and should not be assigned probability zero.
Only after all alternatives have genuinely been ruled out can the remaining hypothesis have posterior
probability one. The prior probability and posterior probability must not be confused.




                                                      5


Introduction to Probability                                         Chapter 2: Conditional Probability


Exercise 20

There are two queens and two jacks among the four cards. (a) Given that the first card is a queen, one
queen remains among the three remaining cards, so the second is a queen with probability 1/3 . (b)
There are 42 = 6 equally likely unordered pairs. Five contain at least one queen, and one contains
            

both queens. Hence 1/5 . (c) Given that the Queen of Hearts is one of the two dealt cards, the other
is equally likely to be any of the other three cards. Only the Queen of Spades makes both queens, so
 1/3 .


Exercise 21

(a) Given at least two heads, the equally likely toss sequences are HHH, HHT, HT H, T HH. Only
one is all heads, so the answer is 1/4 . (b) If all three tosses were heads, the probability of drawing
two H slips is 1. If exactly two were heads, the probability is 1/3. Therefore

                                                        (1/8)(1)
                       P(HHH | two H slips) =                           = 1/2 .
                                                  (1/8)(1) + (3/8)(1/3)

The physical sampling of slips is different evidence from merely learning that at least two heads
occurred.


Exercise 22

Let G mean the original marble was green. The prior is 1/2. If G holds, drawing green is certain; if
not, there is one green and one blue, so the chance of drawing green is 1/2. Thus

                                                      (1/2)(1)
                         P(G | drawn green) =                         = 2/3 .
                                                (1/2)(1) + (1/2)(1/2)

The remaining marble is green exactly when the original marble was green.


Exercise 23

Yes. Let G be guilt and let E1 , E2 be two pieces of evidence. Define conditional distributions as
follows. Given G, let P(E1 E2 ) = 0, P(E1 E2c ) = 0.4, P(E1c E2 ) = 0.4, and P(E1c E2c ) = 0.2. Given Gc ,
let P(E1 E2 ) = 0.1, P(E1c E2c ) = 0.9, with the other two cells zero. Take P(G) = 1/2. Each item alone
has likelihood 0.4 under guilt and 0.1 under innocence, so each raises the guilt probability. But the
pair has likelihood 0 under guilt and 0.1 under innocence, so observing both makes the posterior guilt
probability 0. This is a possible interaction between pieces of evidence; separate positive likelihood
ratios do not imply a positive joint likelihood ratio.


Exercise 24

Yes. Take P(B) = P(C) = 1/2. Within the B group, let both A1 and A2 be the same event with
probability 0.6. Within the C group, let A1 and A2 be disjoint, each with probability 0.5. Then

                              P(Ai | B) = 0.6 > 0.5 = P(Ai | C),   i = 1, 2,

but P(A1 ∪ A2 | B) = 0.6 < 1 = P(A1 ∪ A2 | C). For a story, B and C can be two groups of people; two
favorable outcomes overlap heavily in one group but affect different people in the other.




                                                    6


Introduction to Probability                                            Chapter 2: Conditional Probability


Exercise 25

Let A and B now denote the two suspects being guilty, with equal priors. Let E be the blood-type
evidence. If A is guilty, the crime-scene type necessarily matches A; if B is guilty, B has that type with
probability 0.1. Therefore
                                                         1
                                   P(A guilty | E) =         = 10/11 .
                                                     1 + 0.1
For B’s blood type to match, either A is guilty and B independently has the type (probability 1/10),
or B is guilty (then the evidence says B has it). Hence

                                                           10 1   1  2
                                  P(B matches | E) =            +   = .
                                                           11 10 11  11

Exercise 26

Let L mean legitimate. The prior is 0.1, and each program has true-positive-for-legitimate probability
0.9 and false-accept probability 0.1. (a)

                                                     0.1(0.9)
                                 P(L | M1 ) =                       = 1/2 .
                                                0.1(0.9) + 0.9(0.1)

(b) Conditional independence given status gives likelihoods 0.92 and 0.12 :

                                                        0.1(0.81)
                              P(L | M1 , M2 ) =                         = 0.9 .
                                                  0.1(0.81) + 0.9(0.01)

                                                              e | M2 ) = P(L | M1 ∩ M2 ), provided the
(c) Updating in stages is equivalent to conditioning at once: P(L
updated probability function is defined by conditioning on M1 .


Exercise 27

If the suspect is guilty, the other criminal must have type 2, with probability p2 . If the suspect is
innocent, two randomly chosen criminals have one type 1 and one type 2 with probability 2p1 p2 . Thus

                                               pp2                  p
                           P(G | E) =                       =                .
                                        pp2 + (1 − p)2p1 p2   p + 2(1 − p)p1

For 0 < p < 1, the evidence raises the prior p precisely when the denominator is less than 1, i.e. when
 p1 < 1/2 . The value of p2 cancels.


Exercise 28

(a) Write sensitivity s = P(T + | D) and specificity c = P(T − | Dc ). The positive likelihood ratio is
s/(1 − c), so
                                                                       s
                           posterior odds(D | T + ) = prior odds(D)      .
                                                                     1−c
(b) With 10,000 people and prevalence 1%, there are 100 diseased people and 9,900 healthy people.
At sensitivity 95%, there are 95 true positives. At specificity 95%, there are 0.05(9900) = 495 false
positives; the positive predictive value is only 95/(95 + 495) ≈ 0.161. Raising specificity to 99% reduces
false positives to 99 and raises the predictive value to 95/(95 + 99) ≈ 0.490. For a rare disease, the
much larger healthy group makes even a small false-positive rate important.




                                                       7


Introduction to Probability                                           Chapter 2: Conditional Probability


Exercise 29

For each child, the event “girl and has characteristic C” has probability p/2. The conditioning event E
is that at least one child is a girl with C:

                                   P(E) = 1 − (1 − p/2)2 = p − p2 /4.

If both children are girls, the probability that at least one has C is 1 − (1 − p)2 = 2p − p2 . Thus

                                                    (1/4)(2p − p2 )   2−p
                              P(both girls | E) =           2
                                                                    =     .
                                                       p − p /4       4−p


Independence and conditional independence

Exercise 30

(a) The events are dependent: if A is older than B and A is older than C, then A is the oldest of
the three, which has probability 1/3, not the product 1/4. (b) By symmetry, P(A > B) = 1/2 and
P(A > B, A > C) = 1/3. Therefore

                                                             1/3
                                    P(A > B | A > C) =           = 2/3.
                                                             1/2


Exercise 31

An event is independent of itself exactly when P(A) = P(A ∩ A) = P(A)2 . Thus p = p2 , so

                                             P(A) ∈ {0, 1}.


Exercise 32

Each die has six equally likely faces. (a)

                          P(A > B) = 4/6 = 2/3,           P(B > C) = 4/6 = 2/3,
                                     2 43     2                 3 32       2
                        P(C > D) =    +    = , P(D > A) = +             = .
                                     6 66     3                 6 66       3
For D > A, a 5 always beats A, while a 1 beats A only when A shows 0. (b) A > B depends only on
die A because B is always 3, while B > C depends only on C, so those events are independent. For the
next pair, both comparisons depend on C. Their intersection occurs exactly when C=2 and D=1, so
                                                            43  1  4
                                   P(B > C, C > D) =           = ̸= .
                                                            66  3  9
Hence B > C and C > D are dependent.


Exercise 33

For each of the 100 people, Alice’s and Bob’s friendship indicators are independent fair Bernoulli
variables. (a) To have exactly the set D as Alice’s friends, each of the 100 friendship statuses must
match one specified pattern, so P(A = D) = 2−100 . (b) For each person, the forbidden pattern for
A ⊆ B is “Alice is a friend, Bob is not”, with probability 1/4. Thus P(A ⊆ B) = (3/4)100 . (c) For
each person, the only forbidden pattern for A ∪ B = C is that neither is a friend, again probability 1/4.
Hence (3/4)100 .

                                                      8


Introduction to Probability                                              Chapter 2: Conditional Probability


Exercise 34

(a) In general A and B are positively associated, because learning that an accident occurred makes the
latent “good driver” status less likely, and bad drivers have higher accident probabilities in both years.
They are independent only in special cases such as g ∈ {0, 1} or p1 = p2 . (b) By Bayes’ rule,

                                                          g(1 − p1 )
                                 P(G | Ac ) =                                 .
                                                g(1 − p1 ) + (1 − g)(1 − p2 )

(c) Conditional independence given G gives

                                              g(1 − p1 )p1 + (1 − g)(1 − p2 )p2
                               P(B | Ac ) =                                     .
                                                g(1 − p1 ) + (1 − g)(1 − p2 )

This is the mixture of the two one-year accident risks using the posterior type probabilities after
observing no first-year accident.


Exercise 35

(a) The average chance of winning one game is

                                              0.9 + 0.5 + 0.3  17
                                                              = .
                                                     3         30

(b) Given a win in the first game, Bayes’ rule weights each opponent type by that type’s win probability.
Conditional independence across games given skill gives

                                         (0.9)2 + (0.5)2 + (0.3)2   23
                        P(W2 | W1 ) =                             =    ≈ 0.6765 .
                                             0.9 + 0.5 + 0.3        34

(c) Unconditional independence would say the first result gives no information about the second. That
is implausible because the same opponent plays both games. Conditional independence given skill
is more reasonable: once the opponent’s fixed skill level is known, game outcomes can be modeled
independently.


Exercise 36

(a) Admission is the event “baseball skill OR good math”. Among admitted applicants, a strong math
score can itself be sufficient for admission, so admitted applicants with strong math need not also be
good at baseball. Applicants without the math credential must rely on baseball. Conditioning on
admission creates a negative association. (b) Let a = P(A) and b = P(B). Independence gives
                                          a
                        P(A | C) =               ,      P(A | B, C) = P(A | B) = a,
                                      a + b − ab
where C = A ∪ B. Since a + b − ab < 1 under the stated assumptions, a < a/(a + b − ab). Thus

                                          P(A | B, C) < P(A | C).


Exercise 37

Let qj = 1 − pj . A person with at least one disease always has the symptom; with neither disease the
symptom occurs with probability w0 . (a)

                              P(W ) = 1 − q1 q2 + w0 q1 q2 = 1 − (1 − w0 )q1 q2 .

                                                        9


Introduction to Probability                                                    Chapter 2: Conditional Probability


(b) Since D1 , D2 each imply W ,

                                 p1                            p2                              p1 p2
                P(D1 | W ) =          ,   P(D2 | W ) =              ,     P(D1 , D2 | W ) =          .
                               P (W )                        P (W )                           P (W )

(c) Conditional independence would require p1 p2 /P (W ) = p1 p2 /P (W )2 , hence P (W ) = 1 (since
p1 p2 > 0). Thus they are conditionally dependent unless w0 = 1. (d) If w0 = 0, observing W means at
least one disease is present. If one disease is absent, the other must be present; if one is present, the
other may or may not be. This dependence is immediate from the “at least one” information.


Exercise 38

Let E denote the full observed pattern: W23 , W64 , W65 occur and all other listed words do not.
Conditional independence gives
                                                 Y
                               Ls = p23 p64 p65         (1 − pj ),
                                                        j ∈{23,64,65}
                                                          /

for the likelihood under spam, and
                                                              Y
                                     Ln = r23 r64 r65                   (1 − rj )
                                                        j ∈{23,64,65}
                                                          /

under non-spam. Therefore the naive Bayes posterior is

                                                              pLs
                                     P(spam | E) =                      .
                                                        pLs + (1 − p)Ln

The 97 absences are evidence too; they must be included in both likelihood products.


Monty Hall

Exercise 39

(a) Initially your door has probability 1/7 of holding the car. The car is among the other six with
probability 6/7. After three goats are opened, three other closed doors remain, and by symmetry a
randomly selected one of them contains the car with probability 1/3. Thus switching to a uniformly
chosen remaining door wins with probability

                                                 6 1 2
                                                  · = ,
                                                 7 3 7

which is better than staying (1/7). (b) With n doors and m goat doors opened, there are n − m − 1
remaining alternatives to your initial choice. If the car was not initially selected (probability (n − 1)/n),
symmetry makes each of these alternatives equally likely to contain it. Random switching therefore
wins with probability
                                                   n−1
                                                              .
                                               n(n − m − 1)


Exercise 40

Initially the car is equally likely behind each door. If Monty opens door 2, the possible car locations are
1 (likelihood p) and 3 (likelihood 1); if he opens door 3, they are 1 (likelihood 1 − p) and 2 (likelihood



                                                        10


Introduction to Probability                                         Chapter 2: Conditional Probability


1). (a) Switching succeeds unconditionally exactly when the car was behind door 2 or 3 initially, so
 2/3 . (b) Given door 2 opened, the posterior probability car is behind door 3 is

                                                  1
                                                     .
                                                 1+p
(c) Given door 3 opened, the posterior probability car is behind door 2 is
                                                  1
                                                     .
                                                 2−p
These are the success probabilities of switching to the other unopened door.

Exercise 41

Condition on the car location. With car behind door 1, the probability Monty opens door 2 is 1/2 in
either coin mode. With car behind door 2, opening door 2 is impossible. With car behind door 3, door
2 is a goat: Monty opens it with probability p + (1 − p)/2 = (1 + p)/2. Since the three car locations
have equal priors,
                                                           (1 + p)/2      1+p
                       P(car at 3 | Monty opens 2) =                    =     .
                                                        1/2 + (1 + p)/2   2+p
That is the chance of winning by switching to door 3.

Exercise 42

(a) If door 1 initially has the car (probability 1/3), Monty opens a goat door and offers the switch;
switching loses. If door 1 has a goat (probability 2/3), Monty opens a goat door and offers the switch
with probability p, in which case switching wins. With probability 1 − p he does not open a door, and
the contestant must stay with the goat. Thus
                                                         2p
                                             P(win) =       .
                                                          3
At p = 0, Monty never offers a switch after an initial goat, and the strategy never wins; at p = 1,
he always opens after an initial goat, so switching wins whenever the initial choice was wrong, with
probability 2/3. (b) Given that Monty opens door 2 and reveals a goat, this can happen if the car is
at door 1 (prior 1/3, and Monty picks door 2 with probability 1/2), or if the car is at door 3 (prior 1/3,
and Monty opens the goat door 2 with probability p). It cannot happen if door 2 has the car. Therefore
                                                                    p/3        2p
                   P(win by switching to 3 | door 2 opened) =              =        .
                                                                 1/6 + p/3   1 + 2p
For p = 0 this conditioning event has positive probability only in the car-at-door-1 case, so the
conditional success probability is 0.

Exercise 43

(a) If a goat is revealed under the “reveal the less-preferred prize” rule, door 1 cannot initially have
been the goat: in that case Monty would reveal the computer. The two remaining possibilities are
equally likely: door 1 has car (switch loses) or computer (switch wins). Thus switching wins with
probability 1/2 and is tied with staying. (b) Let p be the chance of revealing the less-preferred item
and q = 1 − p the chance of revealing the more-preferred item. Observing a computer can arise from (i)
car initially chosen and Monty reveals computer as the more-preferred alternative (likelihood q), or
(ii) goat initially chosen and Monty reveals computer as the less-preferred alternative (likelihood p).
These two initial prizes have equal priors. Thus the posterior chance the initial door is goat is p, and
switching wins with probability p . Staying wins with probability 1 − p, so switch when p > 1/2.

                                                   11


Introduction to Probability                                            Chapter 2: Conditional Probability


Exercise 44

The contestant first chooses door 3 in (a),(b), and door 1 in (c),(d). (a) Monty knows the car location
and always opens a goat. After choosing door 3 and observing door 2 opened, the likelihoods for car at
doors 1 and 3 are 1 and 1/2 respectively. Hence
                                                     p3 /2        p3
                                  P(C3 | O2 ) =              =          .
                                                  p1 + p3 /2   2p1 + p3

Switch to door 1 iff p1 > p3 /2. (b) If Monty opens a uniformly random other door, the likelihood of
opening door 2 and revealing a goat is 1/2 whether the car is at door 1 or 3, and zero if it is at door 2.
Thus
                                                          p3
                                         P(C3 | O2 ) =         .
                                                       p1 + p3
Since p3 ≥ p1 , staying is at least as good as switching. (c) Choose door 1 and observe door 2 opened
under the informed-Monty rule. The likelihoods for car at doors 1 and 3 are 1/2 and 1. Thus
                                                             p1
                                         P(C1 | O2 ) =             ,
                                                          p1 + 2p3

so switching to door 3 is at least as good (strictly better if p3 > p1 ). (d) Under random opening, the
likelihoods are 1/2 for car at doors 1 and 3. Therefore
                                                              p1
                                         P(C1 | O2 ) =             ,
                                                           p1 + p3
and switching to door 3 is at least as good because p3 ≥ p1 .

Exercise 45

Let q = 1 − p. After the initial choice of door 1, switching wins if exactly one of doors 2 and 3 contains
a car (Monty must reveal the goat) or if both contain cars (Monty reveals one of them at random). It
loses if both contain goats. Hence

                                      P(win) = 2pq + p2 = 2p − p2 .

For part (b), observing that door 2 is opened and is a goat is possible when door 2 is a goat and door 3
is a car (probability qp), or when both are goats and Monty chooses door 2 (probability q 2 /2). The
switch succeeds in the first case only, so
                                                             qp          2p
                                P(win | O2 is goat) =                 =     .
                                                          qp + q 2 /2   1+p


Exercise 46

Fix door 1 as the initial choice. The car is equally likely to be behind any door. (a) If the car is behind
door 1, switching cannot win. If it is behind one of the other three doors, Monty never reveals the car
(it is the most-preferred of those three), so the car is one of the two remaining choices and a random
switch selects it with probability 1/2. Thus
                                                       3 1 3
                                           P(win) =     · = .
                                                       4 2 8
(b) Condition on door 1’s prize. If it is car, Monty reveals apple with probability 1 − p; if apple, with
probability 0; if book, with probability 1 − p; if goat, with probability p. Averaging the four equally
likely cases,
                                                 (1 − p) + 0 + (1 − p) + p   2−p
                     P(Monty reveals apple) =                              =       .
                                                             4                 4

                                                     12


Introduction to Probability                                                    Chapter 2: Conditional Probability


(c) Given that apple is revealed, door 1 was the car with posterior probability (1 − p)/(2 − p). If door
1 was not the car, the car is among the two unopened alternatives and the randomized switch wins
with probability 1/2. Therefore
                                                               
                                                   1      1−p            1
                         P(win | apple revealed) =    1−          =           .
                                                   2      2−p        2(2 − p)


Exercise 47

The four initial car locations are equally likely. If the car is behind door 1, only stay–stay wins. If the
car is elsewhere, the first opened goat leaves two switch alternatives: one car and one goat. A first
stay leaves door 1 (a goat); at the second offer Monty must open the other goat, leaving the car, so
stay–switch wins. If the first action is switch, the first random switch chooses the car with probability
1/2; at the next offer a stay wins in that case, while a switch wins when the first switch selected the
goat. Hence
                               P (stay,stay) = 1/4, P (stay,switch) = 3/4,

                            P (switch,stay) = 3/8,       P (switch,switch) = 3/8.
The best strategy is stay at the first offer, then switch at the second .


First-step analysis and gambler’s ruin

Exercise 48

(a) To hit total n, the previous total must be one of n − 1, . . . , n − 6, and the next die roll must supply
the difference. Thus
                                       6
                                    1X
                              pn =       pn−k , p0 = 1, pk = 0 (k < 0).
                                    6
                                       k=1

(b) Repeated use of the recurrence gives
                        1      7        49                               70993
                    p1 = , p2 = , p3 =     , ...,                 p7 =          ≈ 0.25360.
                        6      36      216                               279936
(c) At large totals, the renewal process has approximately constant probability of visiting any given
integer. Its long-run visit frequency is the reciprocal of the mean increment, so pn → 1/E[X] = 1/3.5 =
 2/7 .


Exercise 49

Let En be the event of an even number of successes. For two trials, even means both succeed or both
fail:
                                                       1
                              P (E2 ) = p1 p2 + q1 q2 = + 2(q1 − 1/2)(q2 − 1/2).
                                                       2
For the induction, adding trial n + 1 preserves even parity if the previous parity is even and the new
trial fails, or if it was odd and the new trial succeeds. Writing en = P (En ),
                                                          1
                         en+1 = en qn+1 + (1 − en )pn+1 = + (en − 12 )(qn+1 − pn+1 ).
                                                          2
Since qn+1 − pn+1 = 2bn+1 , the induction hypothesis yields
                                                   1
                                       P (En ) =     + 2n−1 b1 b2 · · · bn .
                                                   2
If some pi = 1/2, one factor is zero and the answer is 1/2. If all pi = 0, there are no successes and the
probability is 1. If all pi = 1, there are n successes, so the answer is 1 for even n and 0 for odd n.

                                                       13


Introduction to Probability                                            Chapter 2: Conditional Probability


Exercise 50

The score difference is a random walk starting at 0, with steps +1 (probability p) and -1 (probability
q = 1 − p), absorbed at +2 or -2. Shift the states to gambler’s ruin on {0, 1, 2, 3, 4}, starting at 2. For
p ̸= q,
                                                 1 − (q/p)2       p2
                               P (hit 4 first) =            =           .
                                                 1 − (q/p)4    p2 + q 2
For p = q = 1/2 symmetry gives 1/2, which is also the limiting value of the expression. Conditioning
on the first two games gives the same result: after an initial win and loss the score returns to 0, while
two consecutive wins or losses terminate the match.


Exercise 51

Measure the gambler’s fortune in dollars. The probability of reaching N = 1, 000, 002 before 0, starting
from i = 1, 000, 000, with win probability p = 1/3 and loss probability q = 2/3, is

                                     (q/p)i − 1   21,000,000 − 1  1
                                                =                < .
                                    (q/p)N − 1    21,000,002 − 1  4

The strict inequality follows because 21,000,002 − 1 > 4(21,000,000 − 1). Thus the chance of ever getting
two dollars ahead before ruin is below 1/4 .


Exercise 52

In units of 1/k dollars, the total capital is kN and A starts with ki. The biased gambler’s-ruin
probability is
                                          (q/p)ki − 1
                            P (A wins) =              ,   q = 1 − p > p.
                                         (q/p)kN − 1
Since i < N , the numerator grows more slowly than the denominator as k → ∞, and therefore

                                            P (A wins) −→ 0.

Smaller stakes make the number of steps to bankruptcy much larger, but with a negative drift A’s
eventual winning probability still tends to zero.


Exercise 53

Delete the target point (the sheep opposite the wolf). The remaining 99 points form a line, with
the wolf initially at its midpoint and the two endpoints adjacent to the target. The wolf must visit
both endpoints before stepping onto the target. By symmetry, first consider the moment it reaches
one endpoint. Starting at that endpoint, let hi be the probability of reaching the opposite endpoint
before stepping onto the target, where the 99 non-target points are indexed i = 0, 1, . . . , 98 from the
first endpoint to the other. At an interior point the walk is harmonic, hi = (hi−1 + hi+1 )/2. At the
first endpoint it steps to the target (failure) with probability 1/2 and inward with probability 1/2,
so h0 = h1 /2; at the opposite endpoint h98 = 1. The harmonic solution is linear, hi = A + Bi. The
boundary equations give A = B and A + 98B = 1, hence B = 1/99 and h0 = 1/99. Therefore

                                                                     1
                                     P (opposite sheep is last) =      .
                                                                    99




                                                    14


Introduction to Probability                                            Chapter 2: Conditional Probability


Exercise 54

(a) Let pk be the probability of ever hitting k from 0, and set p0 = 1. By conditioning on the first step
and translating the walk,
                                     pk = p pk−1 + q pk+1 , k ≥ 1.

(b) The recurrence has characteristic equation qr2 − r + p = 0, with roots 1 and p/q. Thus pk =
A + B(p/q)k . Use p0 = 1 and boundedness as k → ∞:
                                             (
                                              (p/q)k ,    p < 1/2,
                                        pk =
                                              1,          p ≥ 1/2.

For a fair walk, every nonnegative level is eventually hit with probability 1; for positive drift to the
right, it is also hit with probability 1.


Simpson’s paradox

Exercise 55

(a) Impossible. By the law of total probability,

                               P (A) = P (A | C)P (C) + P (A | C c )P (C c ),

and the analogous formula holds for B. If both conditional probabilities for A are smaller than the
corresponding ones for B, using the same nonnegative weights P (C) and P (C c ) forces P (A) < P (B).
(b) It is not Simpson’s paradox. In Simpson’s paradox, the aggregate weights over the strata can differ
between the groups being compared (for example, P (C | B) and P (C | B c )); here the mixture weights
are identical.


Exercise 56

Let H be the event that Blackheart harms Stampy, and let E be the evidence that Blackheart possesses
a large amount of ivory (boots, hat, and check). Lisa’s implied claim is that the evidence raises the
chance of harm, e.g. P (H | E) > P (H) (or P (H | E) > P (H | E c )). Homer’s claim is the opposite
association, P (H | E) < P (H). The premise that a person with abundant ivory has less desire to
acquire more is a statement about motivation conditional on supply; it does not by itself establish
the relevant likelihoods P (E | H) and P (E | H c ). One must specify a causal/statistical model for how
harming elephants and already possessing ivory relate. Inferring a posterior from an isolated intuition
about desire reverses or omits the conditioning information.


Exercise 57

(a) One numerical example is:

        C1 : 90/100 = 90%,    M1 : 80/100 = 80%;          C2 : 60/200 = 30%,    M2 : 2/10 = 20%.

Crimson has the higher green percentage in each pair. But after mixing,
                               90 + 60                    80 + 2
                                        = 50%       <             ≈ 74.5%.
                              100 + 200                  100 + 10
(b) Let A mean green, B mean crimson jar, and C denote the first (large-container) versus second
(small-container) stratum. The within-stratum comparisons favor crimson, but the crimson and mauve
mixtures weight the strata differently. This is Simpson’s paradox.


                                                    15


Introduction to Probability                                                Chapter 2: Conditional Probability


Exercise 58

(a) No. If A and B are independent, then P (A | B) = P (A | B c ), contradicting the strict aggregate
reversal. (b) No. If A and C are independent, then P (A | C) = P (A | C c ) = P (A). Within either
stratum, the assumed inequality implies P (A | B, C) < P (A | C) and P (A | B, C c ) < P (A | C c ). Aver-
aging over C conditional on B gives P (A | B) < P (A); similarly P (A | B c ) > P (A), so the proposed
reversal is impossible. (c) No. If B and C are independent, then P (C | B) = P (C | B c ) = P (C). The
aggregate conditional probabilities are then averages of the two stratum-specific probabilities with the
same weights. If A is less likely for B within each stratum, it remains less likely after averaging.


Exercise 59

(a) Here is one possible set of counts (each state has 100 people):

                                             Red state Blue state
                                             D      R D        R
                                        Rich 1       9 63      27
                                        Poor 18     72 8        2

Within Red, the Republican fraction is 9/10 = 90% among rich and 72/90 = 80% among poor. Within
Blue it is 27/90 = 30% among rich and 2/10 = 20% among poor. Blue is wealthier (90% rich versus
10% in Red) and has a larger Democratic fraction (71% versus 19%). (b) Yes. In the example, move
10 Blue-state voters comprising 5 Democrats and 5 Republicans. Blue’s Democratic fraction rises from
71/100 = 0.71 to 66/90 ≈ 0.733; Red’s rises from 19/100 = 0.19 to 24/110 ≈ 0.218. The total number
of Democrats does not change. The law of total probability is not contradicted because the group
weights change from 1/2, 1/2 to 0.45, 0.55.


Mixed practice

Exercise 60

The positive-test probability averaged over the equally likely labs is
                                   1
                         P (T + ) = {p(a1 + b1 ) + (1 − p)[(1 − a2 ) + (1 − b2 )]}.
                                   2
(a) Therefore
                                                           p(a1 + b1 )
                              P (D | T + ) =                                       .
                                               p(a1 + b1 ) + (1 − p)(2 − a2 − b2 )

(b) The joint probability of Lab A and a positive result is 12 {pa1 + (1 − p)(1 − a2 )}. Dividing by the
total positive probability gives

                                                      pa1 + (1 − p)(1 − a2 )
                          P (A lab | T + ) =                                        .
                                                p(a1 + b1 ) + (1 − p)(2 − a2 − b2 )


Exercise 61

(a) Conditional independence gives likelihood an for all positives if diseased and bn if not diseased.
Thus
                                                            pan
                              P (D | T1 , . . . , Tn ) = n             .
                                                        pa + (1 − p)bn




                                                        16


Introduction to Probability                                                    Chapter 2: Conditional Probability


(b) With probability 1/2 Fred has the gene, in which case all tests are positive regardless of disease
status. Without the gene, the likelihoods are an0 and bn0 . Since gene status and disease are independent,

                                                                   p(1 + an0 )
                            P (D | T1 , . . . , Tn ) =                                   .
                                                         p(1 + an0 ) + (1 − p)(1 + bn0 )

The common factors 1/2 cancel.


Exercise 62

(a) If the mother is unaffected (probability 2/3), both children are unaffected. If she is affected
(probability 1/3), each child independently avoids the disease with probability 1/2. Hence

                                                                     2 11  3
                                    P (neither affected) =            +   = .
                                                                     3 34  4

(b) Each child is affected with marginal probability (1/3)(1/2) = 1/6, while both are affected with
probability (1/3)(1/4) = 1/12. Since 1/12 ̸= (1/6)2 , the two children’s statuses are dependent. They
share the mother’s unknown disease status. (c) Given neither child is affected, the likelihood is 1 if the
mother is unaffected and 1/4 if she is affected. Thus

                                                                          (1/3)(1/4)      1
                    P (mother affected | both unaffected) =                              = .
                                                                      (1/3)(1/4) + (2/3)  9


Exercise 63

The pair of matching coins is chosen after seeing the outcomes; it is not a pair fixed in advance. This
makes the conditional statement about the third coin invalid. Directly, the eight equally likely outcomes
are HHH, HHT, HT H, HT T, T HH, T HT, T T H, T T T . Only HHH and T T T have all three coins the
same, so
                                  P (all three match) = 2/8 = 1/4,
not 1/2.


Exercise 64

(a) Ignore red draws. At the first draw that is either green or blue, green occurs with conditional
probability g/(g + b). Thus the probability green appears before blue is g/(g + b) . (b) Without
replacement, imagine the green and blue balls in a uniformly random relative order after red balls are
deleted. The first of these g + b balls is green with probability g/(g + b), the same answer. (c) The
first trial whose type is either i or j is type i with probability
                                                            pi
                                                                 .
                                                         pi + pj


Exercise 65

(a) With uniformly random draws, the marked slip is equally likely to occupy any of the 200 positions.
Your own turn is equally likely to be any fixed position, so the probability you are safe is 199/200
regardless of whether you draw first, last, or in between. (b) With one special slip of weight v and n
ordinary slips of weight w, your probability of being the person who draws the special slip on the first
turn is v/(v + nw). On the second turn, it is
                                                nw         v
                                                                  .
                                              v + nw v + (n − 1)w

                                                            17


Introduction to Probability                                           Chapter 2: Conditional Probability


The second turn is safer exactly when the probability of drawing the special slip on turn 2 is smaller
than on turn 1. Comparing these gives
                        nwv                v
                                      <        ⇐⇒ nw < v + (n − 1)w ⇐⇒ w < v.
               (v + nw)(v + (n − 1)w)   v + nw

Thus draw second if v > w , draw first if v < w, and the two positions are equivalent if v = w.


Exercise 66

Let um be the probability that the running total ever equals m, with u0 = 1 and um = 16 6j=1 um−j .
                                                                                              P
The final total is 100 + r if the penultimate total is 100 + r − j for a die result j and the penultimate
total is below 100. Summing these possibilities gives
                                                 6
                                               1 X
                       P (final = 100 + r) =       u100+r−j ,        r = 0, 1, . . . , 5.
                                               6
                                                 j=r+1

Evaluating the recurrence for um up to m = 99 gives, to the displayed precision, probabilities approxi-
mately 0.2857143, 0.2380952, 0.1904762, 0.1428571, 0.0952381, 0.0476190 for final totals 100, 101, 102, 103, 104, 105.
The first is strictly the largest. Therefore the most likely final total is

                                               100,   P = 2/7.


Exercise 67

(a) All individual donuts are equally likely to be last, so the probability the last donut is chocolate is

                                                    c
                                                        .
                                                  c+g+j

(b) For glazed to run out first and jelly second, the last donut overall must be chocolate, and the last
donut among the glazed and jelly donuts must be jelly. By symmetry these probabilities are c/(c + g + j)
and j/(g + j), respectively, and the relative order of the non-chocolate donuts is independent of which
chocolate donut is last. Thus
                                                 c       j
                                                            .
                                             c+g+jg+j


Exercise 68

(a) If disease is rare in both exposure groups, then P (D | C) ≈ odds(D | C) and likewise for C c . Taking
their ratio gives RR ≈ OR. (b) From the table,

                                   P (D | C)/P (Dc | C)   p11 /p10   p11 p00
                           OR =            c     c    c
                                                        =          =         .
                                  P (D | C )/P (D | C )   p01 /p00   p10 p01

(c) Swapping exposure and disease gives

                                     odds(C | D)     p11 /p01
                                                   =          = OR .
                                     odds(C | Dc )   p10 /p00

Exercise 69

(a) A user says yes if the slip says “used”; a non-user says yes if it says “not used”. Hence

                               y = dp + (1 − d)(1 − p) = 1 − p − d + 2dp.

                                                      18


Introduction to Probability                                              Chapter 2: Conditional Probability


(b) At p = 1/2, y = 1/2 regardless of d, so the response contains no information about prevalence.
This is the worst choice. (c) In the modified method, a “used” slip generates yes with probability d,
while a “born in winter” slip generates yes with probability 1/4. Thus

                                                                 y − (1 − p)/4
                              y = pd + (1 − p)/4,         d=                   .
                                                                       p


Exercise 70

(a) The friend’s argument is correct that every fixed length-92 string has probability 2−92 under
fair coins, but it misses the selection effect: the data were noticed because the observed string was
exceptionally patterned. Evidence must be evaluated by comparing the likelihood under competing
models, not by asking whether the exact observed sequence was unlikely under one model. A long run
of heads is vastly more likely under a double-headed-coin model than under a fair-coin model. (b) Let
F mean fair coins. The likelihoods are 2−92 under F and 1 under the double-headed model. With prior
P (F ) = p,
                                                        p2−92
                                     P (F | H 92 ) = −92           .
                                                    p2   + (1 − p)

(c) This posterior exceeds 1/2 exactly when p2−92 > 1 − p, or

                                                      292
                                             p>             .
                                                    1 + 292

It is less than 0.05 when p2−92 < (1/19)(1 − p), equivalently

                                                       292
                                             p<              .
                                                    292 + 19


Exercise 71

(a) To have j distinct types after purchase i, either there were already j types and the new toy repeats
one of them (probability j/n), or there were j − 1 types and the new toy is a new type (probability
(n − j + 1)/n). Hence
                                         j          n−j+1
                                   pij = pi−1,j +             pi−1,j−1 .
                                         n               n
(b) Initialize p1,1 = 1/n and all other p1,j = 0 (with pi,0 = 0 for i ≥ 1). Apply the recursion row by
row for i = 2, 3, . . . to fill a dynamic-programming table.


Exercise 72

(a) Treatment A is assigned with probability an . Thus

                                 pn = aan + b(1 − an ) = (a − b)an + b.

The next user receives A either if the current user got A and succeeded, or if the current user got B
and failed:
                       an+1 = aan + (1 − b)(1 − an ) = (a + b − 1)an + 1 − b.
(b) Substitute an = (pn − b)/(a − b) into the recurrence for an+1 and use pn+1 = (a − b)an+1 + b. This
yields
                                 pn+1 = (a + b − 1)pn + a + b − 2ab.



                                                     19


Introduction to Probability                                                     Chapter 2: Conditional Probability


(c) If the limit exists, p∗ = (a + b − 1)p∗ + a + b − 2ab, so

                                                          a + b − 2ab
                                            lim pn =
                                           n→∞             2−a−b

when a + b ̸= 2. If a = b = 1, every trial succeeds and the limit is 1; if a = b = 0, every trial fails and
the limit is 0. For the usual nondegenerate case the recursion converges when |a + b − 1| < 1.


Exercise 73

(a) A randomly selected parent passes allele A with probability p2 + (1/2)2p(1 − p) = p. The parents’
transmissions are independent, so the child has

                        P (AA) = p2 ,     P (Aa) = 2p(1 − p),         P (aa) = (1 − p)2 .

The Hardy–Weinberg genotype proportions are therefore stable across generations. (b) If both parents
are homozygous, then each contributes a fixed allele; the child’s genotype is homozygous, so the
probability is 1 . If both are heterozygous, the child’s two allele transmissions are independent fair
choices, giving homozygous probability 1/2 and heterozygous probability 1/2 . (c) Put q = 1 − p. The
unconditional genotype probabilities are P (AA) = p2 , P (Aa) = 2pq, and P (aa) = q 2 . Both parents are
not aa, and the child is not aa. The joint weight for a heterozygous child and two parents not aa is
                                                1        1
                                     2(p2 )(2pq) + (2pq)2 = 2p2 q.
                                                2        2
The corresponding weight for a child not aa is
                                                         3
                          p4 + 2(p2 )(2pq) + (2pq)2        = p2 (p + 3q) = p2 (3 − 2p).
                                                         4
Dividing the first quantity by the second gives

                                                                                 2q     2(1 − p)
                   P (Aa | both parents not aa, extchildnotaa) =                      =          .
                                                                               p + 3q    3 − 2p


Exercise 74

(a) A plausible first intuition is that the next card should be more ace-rich because the cards before
the first ace are known to be non-aces. But the first-ace position is itself random: an early first ace
leaves many cards in the suffix, while a late first ace makes the next card much more likely to be an
ace. The averaging exactly balances these effects, and the answer is in fact the same as the deck-wide
proportion, 1/13. (b) Given that the first ace is at position j, there are 4 − 1 = 3 aces among the
52 − j cards after it. By symmetry,
                                                           3
                                           P (B | Cj ) =        .
                                                         52 − j
(c) The probability the first ace is at position j is the probability the first j − 1 cards are non-aces and
the jth is an ace:
                                         j−2
                                                     !
                                         Y 48 − k         4
                             P (Cj ) =                        , j = 1, . . . , 49.
                                             52 − k 53 − j
                                          k=0

Therefore
                                          49               j−2
                                                                          !
                                          X       3        Y     48 − k         4
                                P (B) =                                              .
                                                52 − j           52 − k       53 − j
                                          j=1              k=0




                                                         20


Introduction to Probability                                              Chapter 2: Conditional Probability


(d) The event in question is that the first two aces in the deck are adjacent. Treat the four ace positions
as a uniformly chosen 4-subset of {1, . . . , 52}. If the first ace is at position j and the second at j + 1,
the remaining two ace positions can be chosen from the 51 − j positions after j + 1. Thus the number
of favorable position sets is
                                           49            
                                          X      51 − j         51
                                                           =        .
                                                    2           3
                                            j=1
            52
              
There are   4     possible sets of ace positions, so
                                                   51
                                                       
                                                   3    4
                                        P (B) =    52 = 52 =
                                                               1/13 .
                                                   4

This matches the chance that the last card is an ace, which is also 4/52; the positional symmetry
explains why neither bet is preferable.




                                                           21
```
