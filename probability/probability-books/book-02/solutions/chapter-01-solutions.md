# Chapter 1: Probability and Counting — Detailed Solutions

**Book:** Introduction to Probability, Second Edition  
**Authors:** Joseph K. Blitzstein and Jessica Hwang

> Source transcription from the supplied chapter-solution PDF. The solution numbering and worked reasoning are retained. Mathematical notation should be checked against the original source if a character appears ambiguous.

```text
INTRODUCTION TO PROBABILITY


                          Detailed Solutions
                Chapter 1 – Probability and Counting


                    Complete worked solutions to Exercises 1–62




Scope. This volume follows the exercise section in the uploaded Chapter 1 PDF. It retains the
original exercise numbering and uses the chapter’s counting, sample-space, inclusion–exclusion,
and probability-axiom methods. In problems with an ambiguous convention, the convention
used is stated.


Introduction to Probability           Chapter 1: Probability and Counting


Contents
Counting                                                               2

Story proofs                                                           5

Naive definition of probability                                        7

Axioms of probability                                                 11

Inclusion–exclusion                                                   12

Mixed practice                                                        13




                                  1


Introduction to Probability                                              Chapter 1: Probability and Counting


Counting

Exercise 1

There are 11 letters in MISSISSIPPI, with multiplicities M : 1, I : 4, S : 4, and P : 2. If all letters were
distinct there would be 11! arrangements, but permutations among equal letters do not create new
words. Hence
                                            11!
                                                   = 34, 650.
                                          4! 4! 2!

Exercise 2

(a) The first digit has 8 choices (2, . . . , 9); each of the remaining six digits has 10 choices. Thus

                                                    8 · 106 .

(b) Among these numbers, those beginning with 911 have the remaining four digits arbitrary, giving
104 forbidden numbers. Therefore

                                        8 · 106 − 104 = 7, 990, 000.


Exercise 3

(a) There are five ordered dinner slots and no restaurant can repeat. The choices are 10, 9, 8, 7, 6:

                                                             10!
                                      10 · 9 · 8 · 7 · 6 =       = 30, 240.
                                                              5!

(b) Monday has 10 choices. Each later night has 9 choices because only the immediately preceding
restaurant is forbidden:
                                        10 · 94 = 65, 610.


Exercise 4

(a) There are n2 distinct games. For each game either player can win, independently of the outcomes
                

assigned to the other games, so
                                                 n
                                              2( 2 ) .
(b) Every unordered pair of players plays once:
                                          
                                          n    n(n − 1)
                                             =          games.
                                          2       2


Exercise 5

There are 2n players. (a) The number of players is halved each round, so after r rounds one player
remains when 2n /2r = 1. Thus r = n . (b) The rounds contain 2n−1 , 2n−2 , . . . , 2, 1 games. Therefore

                                  2n−1 + 2n−2 + · · · + 2 + 1 = 2n − 1 .

(c) Each game eliminates exactly one player. To reduce 2n players to one requires exactly 2n − 1
eliminations, hence the same number of games.




                                                        2


Introduction to Probability                                                 Chapter 1: Probability and Counting


Exercise 6

First partition the 20 people into 10 unordered pairs. The number of pairings is
                                                          20!
                                                                    .
                                                     210 10!
For each pair, either person may receive White, giving 210 orientations. Multiplying,
                                                          20!
                                                              .
                                                          10!

Exercise 7

(a) Choose the positions of the 3 wins, 2 draws, and 2 losses:

                                                   7!
                                                        = 210.
                                                 3!2!2!
(b) Let w, d, ℓ be the numbers of wins, draws, and losses for A. The score conditions give w + d + ℓ = 7
and w + d/2 = 4, equivalently w − ℓ = 1. The possibilities are
                              (w, d, ℓ) = (1, 6, 0), (2, 4, 1), (3, 2, 2), (4, 0, 3).
For each triple, use a multinomial count. The total is
                      7!     7!     7!     7!
                          +      +      +       = 7 + 105 + 210 + 35 = 357 .
                    1!6!0! 2!4!1! 3!2!2! 4!0!3!
(c) If the match lasts seven games and A wins 4–3, A must have exactly 3 wins in the first six games
and win the seventh. The first six games can be arranged in 63 ways:
                                             
                                              6
                                                  = 20.
                                              3


Exercise 8

(a) Choose the 2-person team, then choose one of the two 5-person teams. Since the two 5-person
teams are not labeled, divide by 2:
                                            12 10
                                               
                                                      2         5
                                                                        .
                                                          2
(b) First split into three labeled groups of four, then remove the 3! possible labels:
                                             12 8
                                                
                                             4    4      12!
                                                    =           .
                                               3!      (4!)3 3!


Exercise 9

(a) A path to (110, 111) has 221 steps, of which 110 are right steps (and 111 are up steps). Choosing
the positions of the right steps gives
                                                    
                                                 221
                                                       .
                                                 110
(b) A path through (110, 111) is a path from (0, 0) to that point followed by a path with 100 right and
100 up steps. The two portions can be chosen independently:
                                                      
                                              221 200
                                                           .
                                              110 100

                                                           3


Introduction to Probability                                        Chapter 1: Probability and Counting


Exercise 10

(a) Count all 7-course selections and subtract selections containing no statistics courses:
                                               
                                             20        15
                                                  −          .
                                              7        7

(b) The expression 5 19
                       
                     6 chooses one statistics course first, then six more courses. A selection containing
two or more statistics courses is counted more than once, because any of its statistics courses could
have been designated as the first one.

Exercise 11

(a) Each of the n elements of A can be mapped independently to any of the m elements of B, so
                                                  mn .
(b) For a one-to-one function, the images must be distinct. There are m choices for the first image,
m − 1 for the second, and so on:
                                                                  m!
                                 m(m − 1) · · · (m − n + 1) =
                                                                (m − n)!
when m ≥ n; if m < n, the number is zero.

Exercise 12

(a) Player A receives an unordered 13-card subset:
                                               
                                                52
                                                   .
                                                13
(b) Deal the 52 cards into four labeled hands of 13 cards:
                                                  52!
                                                        .
                                                 (13!)4
(c) The four hands are not independent  choices. Once A’s hand is fixed, only 39 cards remain for the
other three players; multiplying 52
                                   
                                 13  four times would pretend that the same card could be dealt to
multiple players.

Exercise 13

A 10-card hand from a superdeck is a multiset of size 10 drawn from 52 card-types. The number of
nonnegative integer solutions to x1 + · · · + x52 = 10 is, by stars and bars,
                                                        
                                           52 + 10 − 1       61
                                                         =        .
                                               10            10


Exercise 14

One pizza has 4 size choices and 28 topping subsets, hence 4 · 28 = 1024 possible types. Treating the
two pizzas as an unordered pair in which the same type may be selected twice, the number is
                                                     
                                 1024 + 2 − 1      1025
                                               =          = 524, 800.
                                      2              2

If the two orders were distinguished (first pizza versus second pizza), the count would instead be 10242 .

                                                    4


Introduction to Probability                                                    Chapter 1: Probability and Counting


Story proofs

Exercise 15

A subset of an n-element set is formed by deciding, independently for each element, whether to include
it. There are two choices per element, hence 2n subsets. Partitioning subsets by their size gives

                                                  n  
                                                  X  n
                                                                  = 2n .
                                                          k
                                                  k=0



Exercise 16

(a) Algebraically, Pascal’s identity follows from factorials:
                                                                           
                    n          n            n!                n!            n+1
                        +            =            +                     =        .
                    k        k−1        k!(n − k)! (k − 1)!(n − k + 1)!      k

(b) In an organization of n + 1 people with a designated president, count committees of size k. If the
president is excluded, choose all k from the remaining n; if included, choose k − 1 others. The two
disjoint cases yield the identity.


Exercise 17

Choose a committee of size n from two disjoint groups of n people each. If exactly
                                                                                knare chosen from the
                                                                                     2
first group, exactly n − k must be chosen from the second. There are nk n−k  n
                                                                                 = k such committees.
Summing over k counts all committees:

                                                n  2           
                                                X  n             2n
                                                              =     .
                                                      k           n
                                                k=0



Exercise 18

Choose a committee of size n from two groups of n people, where only the first      group
                                                                                          is eligible for
chair. If k members of the committee come from the first group, there are nk n−k      n
                                                                                          ways to choose
                                                                                                        2
the committee and k chair choices. Thus the total number of committee-chair pairs is nk=1 k nk .
                                                                                              P
Alternatively, choose the chair first (n choices), then choose the other n − 1 members from the remaining
2n − 1 people. Hence
                                           n    2              
                                         X      n          2n − 1
                                             k        =n            .
                                                k           n−1
                                          k=1



Exercise 19

Take a 5-element subset of {1, 2, . . . , n + 3} and let its middle (third-smallest) element be k + 1. There
must be two chosen elements below it and two above it. There are k2 choices below and n−k+2
                                                                               
                                                                                                        2
choices above. Summing over k = 2, . . . , n counts every 5-subset exactly once:

                                    n                                      
                                    X  k  n−k+2                             n+3
                                                                     =           .
                                           2              2                  5
                                    k=2




                                                              5


Introduction to Probability                                           Chapter 1: Probability and Counting


Exercise 20

(a) Consider a group of n + 1 people ordered by age. A committee of size k + 1 has a unique oldest
member. If the oldest member is the person in position j +1, then the other k members must be selected
from the j younger people, giving kj choices. Summing over j = k, . . . , n counts every committee once:

                                           n                  
                                           X  j             n+1
                                                         =        .
                                                     k       k+1
                                           j=k


(b) If a pack has exactly m bears and five flavors, the flavor counts are nonnegative integers summing
to m, so there are m+4
                     4     compositions. Summing from 30 to 50 and using the hockey-stick identity,
                                     50                     
                                     X   m+4                55   34
                                                         =     −    .
                                                 4           5    5
                                    m=30

                                               
                                             55   34
Thus the number of possible compositions is     −    .
                                              5    5


Exercise 21

Write { nk } = S(n, k) for the number of partitions of an n-element set into k nonempty, unlabeled blocks.
(a) Add a new distinguished person to a partition of n people into k groups. Either the new person
forms a singleton (then partition the original people into k − 1 groups), or joins one of the existing k
groups (then partition the original people into k groups and choose one of the k groups). Hence

                                  S(n + 1, k) = S(n, k − 1) + kS(n, k).

(b) Partition {0, 1, . . . , n} into k + 1 nonempty blocks. Suppose the block containing 0 contains exactly
n − j + 1 elements, so that j of the other n people lie outside it. Choose those j people in nj ways,
then partition them into k nonempty blocks in S(j, k) ways. Summing gives
                                                      n  
                                                      X  n
                                    S(n + 1, k + 1) =      S(j, k).
                                                         j
                                                             j=k



Exercise 22

(a) In a round-robin tournament with n + 1 players, each pair plays once. Counting games by pairs
       n+1
          
gives 2 . Counting the same games by the opponent of each player gives 1 + 2 + · · · + n. Therefore
                                                             
                                                          n+1
                                       1 + 2 + ··· + n =        .
                                                           2

(b) Count triples (m, a, b, c) where 1 ≤ m ≤ n and a, b, c are chosen fromP {0, . . . , m − 1} with order
and repetition allowed. For fixed m, there are m3 triples, so the total is nm=1 m3 . Classify the triple
by the number of distinct values:

 • Three distinct values: choose 4 values from {0,. . . , n}; the smallest is m and the other three are
   below it, with 3! assignments. This gives 6 n+1
                                                4 .

 • Exactly two distinct values: choose the repeated value and the single value, then
                                                                                    choose which of
   the three positions is the single one. Summing over the larger value gives 6 n+1
                                                                                 3 .

 • One distinct value: choose two integers 0 ≤ a ≤ m ≤ n with the triple all equal, giving n+1
                                                                                              
                                                                                            2 .


                                                         6


Introduction to Probability                                              Chapter 1: Probability and Counting


Thus
                               n                           
                               X
                                     3    n+1       n+1     n+1
                                    m =6        +6       +       .
                                           4         3       2
                              m=1



Naive definition of probability

Exercise 23

The three independently selected floors are an ordered triple from 9 floors, so there are 93 equally likely
outcomes. Three consecutive buttons are pressed exactly when the three choices are the three distinct
floors in one of the 7 consecutive triples. Each such triple can be assigned to the 3 people in 3! orders.
Hence
                                                               7 · 3!    14
                              P(three consecutive buttons) = 3 =            .
                                                                9       243

Exercise 24

The positions of the 3 girls are uniformly distributed among the 63 subsets of positions. Exactly one
                                                                     

arrangement of the gender positions puts all three girls in the first three places. Thus
                                                     1    1
                                                     6 = 20 .
                                                      
                                                     3


Exercise 25

The six robberies are independently assigned to six districts. The probability that no district receives
more than one robbery is the probability that all six assignments are distinct, namely 6!/66 . Therefore
                                                                         6!    319
                             P(some district has at least 2) = 1 −         6
                                                                             =     .
                                                                         6     324

Exercise 26

(a) This is a birthday problem with 106 possible “days” (residents) and 1000 independent selections.
Sampling without replacement would prevent repeats; sampling with replacement permits a person to
be selected more than once. (b) The exact probability of no repeat is
                                         106 (106 − 1) · · · (106 − 999)
                                                                         .
                                                   (106 )1000
Consequently,
                                           999       
                                           Y        j                       6
              P(at least one repeat) = 1 −      1 − 6 ≈ 1 − e−1000·999/(2·10 ) ≈ 0.393.
                                                   10
                                               j=0



Exercise 27

There are nk equally likely assignments of k people to n locations. If k ≤ n, the assignments with no
collision number n(n − 1) · · · (n − k + 1). Thus
                                                          n!
                                P(collision) = 1 −               ,           k ≤ n.
                                                      (n − k)!nk
If k > n, a collision is certain, so the probability is 1.

                                                        7


Introduction to Probability                                              Chapter 1: Probability and Counting


Exercise 28

The probability that the three statistics courses occupy three distinct slots is
                                             10 9 8     720
                                               ·  ·   =      .
                                             10 10 10   1000
Its complement is the event that at least two share a slot:

                                                  10 · 9 · 8
                                             1−              = 0.28.
                                                    103

Exercise 29

(a) The distribution of a sum of four fair dice is symmetric about 14. Therefore P(S = 21) = P(S = 7)
and P(S = 22) = P(S = 6). For sums 7 and 6, the dice values are each at most 3 above the minimum
1. The numbers of nonnegative increment quadruples summing to 3 and 2 are 63 = 20 and 53 = 10,
                                                                                               

respectively. Thus
                                        P(S = 21) > P(S = 22).

(b) A two-letter word is a palindrome if its two letters match, giving probability 26/262 = 1/26. A
three-letter word is a palindrome if the third letter matches the first, also probability 1/26. Hence the
probabilities are equal.


Exercise 30

For a word of length n, the first ⌈n/2⌉ letters determine the remaining letters if the word is a palindrome.
Therefore there are 26⌈n/2⌉ palindromes among 26n words, and

                                         P(palindrome) = 26−⌊n/2⌋ .

For n = 7 the probability is 26−3 ; for n = 8 it is 26−4 .


Exercise 31

The first sample tags n of the N elk. In the second sample of size m, exactly k tagged elk are chosen
by selecting k of the n tagged and m − k of the N − n untagged:

                                  n
                                    N −n
                                  k    m−k
                   P(X = k) =          N
                                            ,    max(0, m − (N − n)) ≤ k ≤ min(m, n).
                                       m



Exercise 32

The true red-card set is a uniformly random 2-subset of the four positions. The number of correct
guesses is the intersection size of two 2-subsets. Thus
                                                 2
                                                   2 
                                                    j   2−j
                                      P(J = j) =        4
                                                             ,   j = 0, 1, 2,
                                                        2

which gives

              P(J = 0) = 16 ,   P(J = 1) = 23 ,    P(J = 2) = 16 ,      P(J = 3) = P(J = 4) = 0.




                                                        8


Introduction to Probability                                                    Chapter 1: Probability and Counting


Exercise 33

(a) Before the first draw, every ball is equally likely to occupy the second position in a random ordering
of the balls. Therefore the probability that the second ball is green is the original green proportion,
g/(r + g), just as for the first ball. (b) With ordered draws without replacement, the probability that
the second is green is
                                   g     g−1          r       g          g
                                                 +                  =       .
                                 r+gr+g−1 r+gr+g−1                     r+g
(c) Equality of same-color and different-color probabilities means

                                r(r − 1) + g(g − 1) = 2rg,             r + g = 16.

Rearranging gives (r − g)2 = r + g = 16, so |r − g| = 4. Hence

                                        (r, g) = (10, 6) or (6, 10).


Exercise 34

There are 52
              
             5 possible hands. (a) For each of four suits, choose any 5 of its 13 cards except the one
royal flush. Thus
                                                       4 13
                                                                 
                                                            5 −1
                                 P(non-royal flush) =        52
                                                                   .
                                                                           5

(b) Choose the two ranks that form pairs, two suits for each pair, the kicker’s rank from the remaining
11 ranks, and its suit:
                                                    13 4 2
                                                        
                                                     2   2 11 · 4
                                   P(two pair) =          52
                                                                 .
                                                                   5



Exercise 35

A 13-card hand with at least 3 cards of every suit must have suit counts 4, 3, 3, 3. Choose the suit
receiving four cards, then select the cards:
                                                               3
                                                4 13          13
                                                    
                                                  4           3
                                           P=            52
                                                                      .
                                                         13



Exercise 36

The 30 dice must show each face exactly five times. The number of ordered outcomes with these counts
is the multinomial coefficient 30!/(5!)6 , out of 630 total ordered outcomes:

                                                     30!
                                              P=             .
                                                   (5!)6 630


Exercise 37

Ignore the 36 cards that are not aces, kings, queens, or jacks: their positions do not affect which of
these 16 special cards appear first. (a) The first special card is an ace with probability 4/16, which is
exactly the event that no king, queen, or jack appears before the first ace:

                                                    1
                                                      .
                                                    4

                                                     9


Introduction to Probability                                                    Chapter 1: Probability and Counting


(b) In the relative ordering of the 16 special cards, the first three must be one king, one queen, and
one jack in any order, and the fourth must be an ace. Thus

                                             4 4 4 4       16
                                       6·     ·  ·  ·   =     .
                                            16 15 14 13   455

Exercise 38

Fix Tyrion’s seat. Cersei has 11 remaining seats, exactly two of which are adjacent to Tyrion, so the
probability is 2/11. For the fully labeled sample space, there are 12! linear arrangements and 12 · 2 · 10!
favorable arrangements (choose Tyrion’s position, an adjacent position for Cersei, then arrange the
other ten people):
                                             12 · 2 · 10!  2
                                                          = .
                                                 12!       11

Exercise 39

To have exactly j complete married couples, choose those j couples, then choose k − 2j other couples
from which exactly one spouse is selected, with two choices of spouse per couple. Divide by all
committees of size k:
                                                n
                                                   n−j  k−2j
                                                j   k−2j 2
                                   P(J = j) =         2n
                                                              ,
                                                             k

for feasible j (so 0 ≤ k − 2j ≤ n − j).


Exercise 40

There are nk equally likely ordered draw sequences. (a) A strictly increasing sequence chooses k
distinct values, and their order is forced:
                                                         n
                                                          
                                                                          k
                                      P(strictly increasing) =                 .
                                                                          nk
(b) A nondecreasing sequence is uniquely a multiset of size k from n values. Stars and bars gives
 n+k−1
   k    such sequences:
                                                        n+k−1
                                                              
                                                                      k
                                      P(nondecreasing) =                       .
                                                                   nk

Exercise 41

Choose the one empty box in n ways. The n labeled balls must occupy the remaining n − 1 labeled
boxes with all boxes nonempty. Exactly one box gets two balls and all others get one: choose the pair
of balls in n2 ways, then assign the resulting n − 1 groups to the boxes in (n − 1)! ways. Hence

                                                         n n2 (n − 1)!
                                                             
                              P(exactly one empty box) =               .
                                                               nn

Exercise 42

There are 26!/(26 − k)! norepeatwords of length k. Thus the total number is
                                          26                     25
                                          X        26!          X1
                                                          = 26!     .
                                                (26 − k)!        j!
                                          k=1                    j=0


                                                       10


Introduction to Probability                                           Chapter 1: Probability and Counting


Only 26! words use all 26 letters, so
                                                            −1
                                                       25
                                                      X   1
                               P(uses all letters) =            ≈ e−1 .
                                                          j!
                                                         j=0



Axioms of probability

Exercise 43

The union bound and P(A ∪ B) ≤ 1 give

                      P(A) + P(B) − 1 ≤ P(A ∩ B) ≤ P(A ∪ B) ≤ P(A) + P(B).

The equality conditions are:

 • Left inequality: equality iff P(A ∪ B) = 1.

 • Middle inequality: equality iff P(A△B) = 0 (the events differ only on a null set).

 • Right inequality: equality iff P(A ∩ B) = 0 (disjoint up to a null set).


Exercise 44

If A ⊆ B, then B = A ∪˙ (B − A) is a disjoint union. Finite additivity gives

                                        P(B) = P(A) + P(B − A),

so P(B − A) = P(B) − P(A) .


Exercise 45

The symmetric difference is a disjoint union:

                                        A△B = (A − B) ∪˙ (B − A).

Also P(A − B) = P(A) − P(A ∩ B) and similarly for B − A. Adding yields

                                P(A△B) = P(A) + P(B) − 2P(A ∩ B).


Exercise 46

The event that exactly k of the Ai occur is Bk = Ck \ Ck+1 , because Ck means at least k occur and
Ck+1 means at least k + 1 occur. Therefore

                                        P(Bk ) = P(Ck ) − P(Ck+1 ).


Exercise 47

(a) Let S = {HH, HT, T H, T T } with equal masses. Let A be the event that the first coin is H and
B the event that the second coin is H. Then P(A) = P(B) = 1/2 and P(A ∩ B) = 1/4 = P(A)P(B);
neither event is trivial. (b) For a uniform point in the unit square, P(A ∩ B) is the area of A1 ∩ B1 .
Independence is equivalent to

                                  area(A1 ∩ B1 ) = area(A1 ) area(B1 ).

                                                    11


Introduction to Probability                                                   Chapter 1: Probability and Counting


For an independent example, use a vertical half-strip A1 = {x < 1/2} and a horizontal half-strip
B1 = {y < 1/2}; their intersection has area 1/4. For a dependent example, take A1 = B1 = {x < 1/2};
the intersection area is 1/2, not 1/4. (c) By inclusion–exclusion and independence,
                       P(A ∪ B) = P(A) + P(B) − P(A)P(B) = 1 − P(Ac )P(B c ).

Exercise 48

Because A and B are disjoint, a certificate for A ∪ B has exactly the same payoff in every state as the
combined certificates for A and B. If pU = PArby (A ∪ B) differs from pA + pB , the quoted prices differ.
If pU > pA + pB , sell Arby one A ∪ B certificate and buy one each of A and B; the initial cash inflow is
1000(pU − pA − pB ) > 0, and the future payoffs cancel in every state. If pU < pA + pB , reverse the
trades. Either way Arby incurs a guaranteed loss equal to 1000|pU − pA − pB |.


Inclusion–exclusion

Exercise 49

For each face i, let Ai be the event that face i never appears. For any specified j faces, the probability
that all those faces are absent is ((6 − j)/6)n . Inclusion–exclusion gives
                                     6          6
                                          !
                                                                 6−j n
                                                                    
                                                       j+1 6
                                    [         X
                                P      Ai =        (−1)                   .
                                                            j       6
                                   i=1               j=1



Exercise 50

Let Ai be the event that a 13-card hand is void in suit i. If a specified set of j suits is absent, all 13
cards must be chosen from the other 4 − j suits. Thus
                                                     3                          
                                                     X
                                                              j+1       4 13(4 − j)
                                                           (−1)
                                  4                                     j    13
                                             !
                                  [                  j=1
                              P         Ai       =                      52
                                                                                    .
                                  i=1                                   13

The j = 4 term is zero because no 13-card hand can be drawn from zero cards.

Exercise 51

For each season let Ai be the event that the season is missing. Inclusion–exclusion counts assignments
in which all four seasons appear:

                                              47 − 41 37 + 42 27 − 43 17
                                                                    
                             P(all seasons) =                            .
                                                           47
Equivalently, the numerator is 4!S(7, 4).

Exercise 52

Condition on the first day’s seating. The second day’s seating is a uniformly random permutation of
the 20 seats relative to the first day. No student repeating a seat is precisely a derangement. Therefore
                                                                  20
                                                !20 X (−1)j
                                             P=     =       .
                                                20!     j!
                                                              j=0


                                                             12


Introduction to Probability                                             Chapter 1: Probability and Counting


Exercise 53

There are 62 possible characters at each of the 8 positions. (a) Subtract passwords with no lowercase
letters (36 choices per position):
                                                628 − 368 .
(b) Exclude passwords with no lowercase and no uppercase letters. Each of those two forbidden classes
has 368 strings, and their intersection (digits only) has 108 :

                                           628 − 2 · 368 + 108 .
(c) Apply inclusion–exclusion to the events “no lowercase”, “no uppercase”, and “no digit”. The
pairwise intersections have respectively 108 , 268 , and 268 strings:

                                   628 − 2 · 368 − 528 + 108 + 2 · 268 .

Exercise 54

There are 30
              
             7 equally likely 7-course selections. For any fixed set of j weekdays to be missing, all
selected classes must come from the other 30 − 6j courses. Inclusion–exclusion over the five weekdays
gives
                                                      5                  
                                                    X
                                                             j 5    30 − 6j
                                                        (−1)
                                                               j       7
                                                    j=0
                        P(classes every weekday) =              30
                                                                             ,
                                                                        7

where a binomial coefficient is zero when its upper index is less than 7.

Exercise 55
                                                  37
                                                    
The total number of 5-person committees is        5 .     (a) Choose 3 sophomores and 2 of the 22 non-
sophomores:
                                                    15
                                                         22
                                                    3
                                              P=         37
                                                             2 .
                                                          5

(b) Use inclusion–exclusion to require at least one member from each of the three classes. Subtract
committees missing seniors, juniors, or sophomores, then add back committees drawn from only one
class:
                               37     27     25     22   15    12    10
                                                                 
                                5 − 5 − 5 − 5 + 5 + 5 + 5
                         P=                         37
                                                                        .
                                                         5



Mixed practice

Exercise 56

(a) 10                10
                       
      5 = 252 and 6 = 210, so the first quantity is larger: > . This also follows from symmetry and
thefact that the binomial coefficients decrease after the midpoint. (b) Two unlabeled teams of 5 give
 10                                                           10
                                                                
  5 /2 =  126 partitions.   A  team of 6 and a team of 4 give 6   = 210 partitions (the sizes distinguish
the teams). Thus < . (c) All three birthdays on January 1 has probability 1/3653 . One birthday each
on January 1, 2, and 3 has probability 3!/3653 . Hence < . (d) The first H ends the game immediately
on the toss after it: if it is preceded by H, the pattern HH occurs; if preceded by T, TH occurs first.
Martin wins only if the first two tosses are HH. Therefore
                                                                1  1
                                       P(Martin wins) =           < .
                                                                4  2

                                                    13


Introduction to Probability                                                Chapter 1: Probability and Counting


Exercise 57

Treat Caesar’s last breath as 1022 distinct molecules among the 1044 molecules in the atmosphere. Each
molecule in your breath is sampled independently with replacement, and it misses Caesar’s set with
probability 1 − 1022 /1044 = 1 − 10−22 . Thus
                                                                                22
                   P(at least one shared molecule) = 1 − (1 − 10−22 )10              ≈ 1 − e−1 .


Exercise 58

Let T be the position at which the third defective widget is found. Then T ≤ m exactly when all three
defective widgets are among the first m tested. Hence
                                                  8
                                                   
                                                  3          56     41
                               P(T ≥ 9) = 1 − 12 = 1 −          =     ,
                                                  3
                                                            220     55
                                                   9
                                                    
                                                   3          84    34
                              P(T ≥ 10) = 1 − 12 = 1 −          =      .
                                                   3
                                                             220    55


Exercise 59

(a) For indistinguishable bars, solve x1 + · · · + x10 = 15 in nonnegative integers:
                                                        
                                         15 + 10 − 1          24
                                                         =       .
                                             10 − 1           9
(b) Give one bar to each child first; distribute the remaining five:
                                                      
                                           5 + 10 − 1      14
                                                       =       .
                                                9           9
(c) Each of 15 distinguishable bars can go to any of 10 children:

                                                          1015 .
(d) Require every child to receive at least one distinguishable bar. Inclusion–exclusion gives
                                10                 
                                X
                                         j       10
                                      (−1)           (10 − j)15 = 10!S(15, 10).
                                                  j
                                j=0



Exercise 60

(a) There are n choices independently at each of n ordered positions, so nn ordered bootstrap samples.
(b) An unordered sample is specified by counts c1 + · · · + cn = n with ci ≥ 0. Stars and bars gives
         
   2n − 1
            . (c) For a count vector (c1 , . . . , cn ), the probability of its unordered sample is
     n
                                                          n!         1
                                                                       .
                                                    c1 ! · · · cn ! nn
This is maximized when all ci = 1, giving p1 = n!/nn (only one such multiset), and minimized when
one count is n and the rest are zero, giving p2 = 1/nn (there are n such multisets). Therefore
                 p1             P(a most-likely unordered sample)    p1   (n − 1)!
                    = n! ,                                        =     =          .
                 p2                P(some least-likely sample)      np2      1
Here the first event consists of the single all-distinct multiset, while the second event is the union of
the n all-identical multisets.

                                                           14


Introduction to Probability                                                          Chapter 1: Probability and Counting


Exercise 61

The first passenger’s choice initiates a chain. The only seats that can determine the final outcome are
seat 1 (the first passenger’s assigned seat) and seat 100 (the last passenger’s assigned seat). When one
of these two seats is selected, the process ends: seat 1 means the last passenger eventually gets seat
100; seat 100 means the last passenger cannot get their assigned seat. By symmetry, these two seats
are equally likely to be the first of the pair to be chosen. Thus

                                                                            1
                                      P(last passenger gets assigned seat) = .
                                                                            2

Exercise 62

(a) The probability that all k birthdays are distinct is obtained by selecting k distinct days and
assigning the people to those days in k! orders. The total probability for a fixed set of days is its
product of day probabilities. Summing over all k-subsets gives

         P(no match) = k!ek (p1 , . . . , p365 ),          P(at least one match) = 1 − k!ek (p1 , . . . , p365 ).

(b) If birthdays are concentrated on a few days, collisions become common; in the extreme case where
everyone is born on one day, a match is certain. Spreading probability evenly over all 365 days makes
distinct birthdays as likely as possible, so it minimizes the collision probability. (c) Split the elementary
symmetric polynomial according to whether a selected k-set contains indices 1 and 2, exactly one of
them, or neither:

          ek (x1 , . . . , xn ) = x1 x2 ek−2 (x3 , . . . , xn ) + (x1 + x2 )ek−1 (x3 , . . . , xn ) + ek (x3 , . . . , xn ).

When x1 , x2 are replaced by their average r1 = r2 = (x1 + x2 )/2, their sum is unchanged while their
product increases, since
                                  (x1 + x2 )2           (x1 − x2 )2
                                              − x1 x2 =             ≥ 0.
                                       4                    4
All coefficients ek−2 are nonnegative, so ek (r) ≥ ek (p) and consequently 1 − k!ek (p) ≥ 1 − k!ek (r).
Repeatedly averaging unequal coordinates moves the probability vector toward the uniform vector and
never increases the collision probability. Therefore the minimum occurs at

                                                                                 1
                                               p1 = p2 = · · · = p365 =             .
                                                                                365




                                                                 15
```
