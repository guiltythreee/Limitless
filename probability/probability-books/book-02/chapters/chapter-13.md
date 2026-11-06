# Chapter 13: Poisson Processes

**Book:** Introduction to Probability, Second Edition  
**Authors:** Joseph K. Blitzstein and Jessica Hwang  
**Printed pages:** 559–596

> Source transcription from the supplied textbook PDF. Text extraction preserves the original order and page content as far as the PDF text layer allows. Check mathematical notation and figure references against the source where extraction is ambiguous.

```text
Poisson processes                                                                   573

To wrap up this section, here is a table describing the correspondences between
properties of the Poisson process and properties of the Poisson distribution. In the
second column, Y1 ∼ Pois(λ1 ) and Y2 ∼ Pois(λ2 ) are independent.

             Poisson process              Poisson distribution
             conditioning         Y1 |Y1 + Y2 = n ∼ Bin(n, λ1 /(λ1 + λ2 ))
             superposition                Y1 + Y2 ∼ Pois(λ1 + λ2 )
             thinning                        chicken-egg story




13.3    Poisson processes in multiple dimensions

Poisson processes in multiple dimensions are defined analogously to the 1D Poisson
process: we just replace the notion of length with the notion of area or volume. For
concreteness, we will now define 2D Poisson processes, after which it should also be
clear by analogy how to define Poisson processes in higher dimensions.
Definition 13.3.1 (2D Poisson process). Events in the plane R2 are a 2D Poisson
process with intensity λ if the following conditions hold:

        1. The number of events in a region A is distributed Pois(λ · area(A)).
        2. The numbers of events in disjoint regions are independent of each other.

As one might guess, conditioning, superposition, and thinning properties apply to
2D Poisson processes. Let N (A) be the number of events in a region A, and let
B ⊆ A. Given N (A) = n, the conditional distribution of N (B) is Binomial:
                                                        
                                                 area(B)
                     N (B)|N (A) = n ∼ Bin n,              .
                                                 area(A)
Conditional on the total number of events in the larger region A, the probability of
an event falling into a subregion is proportional to the area of the subregion; thus the
locations of the events are conditionally Uniform, and we can generate a 2D Poisson
process in A by first generating the number of events N (A) ∼ Pois(λ · area(A)) and
then placing the events uniformly at random in A. Figure 13.7 shows simulated 2D
Poisson processes in the square [0, 5] × [0, 5] for intensities λ = 1, 2, 5.
As in the 1D case, the superposition of independent 2D Poisson processes is a 2D
Poisson process, and the intensities add. We can also thin a 2D Poisson process to
get independent 2D Poisson processes.
One property of 1D Poisson processes for which we haven’t asserted a higher-
dimensional analog is the count-time duality. The next example, the last in this
chapter, will lead us to a spatial analog: a count-distance duality.


574                                                                Introduction to Probability




FIGURE 13.7
Simulated 2D Poisson process in the square [0, 5] × [0, 5], for λ = 1, 2, 5.


Example 13.3.2 (Nearest star). Stars in a certain universe are distributed accord-
ing to a 3D Poisson process with intensity λ. If you live in this universe, what is
the distribution of the distance from you to the nearest star?
Solution:
In a 3D Poisson process with intensity λ, the number of events in a region of space
V is Poisson with mean λ·volume(V ). Let R be the distance from you to the nearest
star. The key observation is that in order for the event R > r to occur, there must
be no stars within a sphere of radius r around you; in fact, these two events are
equivalent. For any r > 0, let Nr be the number of events within radius r of you,
so Nr ∼ Pois(λ · 43 πr3 ). Then we have a count-distance duality:

                         R > r is the same event as Nr = 0,

Therefore,
                                                           4   3
                         P (R > r) = P (Nr = 0) = e− 3 λπr ,
which gives that the CDF of R is
                                                   4   3
                              P (R ≤ r) = 1 − e− 3 λπr ,

for r > 0 (and 0 otherwise). This is a Weibull (see Example 6.5.5). Specifically,
                                                
                                          4πλ
                               R ∼ Wei         ,3 .                               
                                            3

Poisson processes have numerous extensions, some of which are explored in the
exercises. We can allow λ to vary as a function of time or space instead of remaining
constant; this is called an inhomogeneous Poisson process. We can allow λ to be a
random variable; this is called a Cox process. Finally, we can allow the rate to
increase by λ after each successive arrival; this is called a Yule process.


Poisson processes                                                                  575




13.4    Recap

A Poisson process in one dimension is a sequence of arrivals such that the number
of arrivals in any interval is Poisson (with mean proportional to the length of the
interval) and disjoint intervals have independent numbers of arrivals. Some opera-
tions that we can perform with Poisson processes are conditioning, superposition,
and thinning. Conditioning on the total number of arrivals in an interval allows
us to view the arrivals as independent Uniforms on the interval. Superposition and
thinning are complementary, and they allow us to split and merge Poisson processes
when convenient. All of these properties have analogs for higher dimensions.

Poisson processes tie together many of the named distributions we have studied in
this book:

• Poisson for the arrival counts,

• Exponential and Gamma for the interarrival times and arrival times,

• Binomial for the conditional counts,

• Uniform and (scaled) Beta for the conditional arrival times,

• Geometric and Negative Binomial for the discrete waiting times for special arrivals.

Poisson processes are also especially amenable to story proofs. A problem-solving
strategy we used several times in this chapter is to embed r.v.s into a Poisson process
in the hopes of discovering a story proof, even when the original problem appears
to be unrelated to Poisson processes.

Poisson processes unite two of the important themes of this book, named distribu-
tions and stories, in a natural way. We think it is fitting to end with a topic that
weaves together the story threads from throughout the book.




13.5    R

1D Poisson process

In Chapter 5, we discussed how to simulate a specified number of arrivals from a
one-dimensional Poisson process by using the fact that the interarrival times are
i.i.d. Exponentials. In this chapter, Story 13.2.4 tells us how to simulate a Poisson
process within a specified interval (0, L]. We first generate the number of arrivals
N (L), which is distributed Pois(λL). Conditional on N (L) = n, the arrival times


576                                                           Introduction to Probability

are distributed as the order statistics of n i.i.d. Unif(0, L) r.v.s. The following code
simulates arrivals from a Poisson process with rate 10 in the interval (0, 5]:

L <- 5
lambda <- 10
n <- rpois(1,lambda*L)
t <- sort(runif(n,0,L))

To visualize the Poisson process we have generated, we can plot the cumulative
number of arrivals N (t) as a function of t:

plot(t,1:n,type="s")

This produces a staircase plot as in Figure 13.8.
      50
      40
      30
  N(t)
      20
      10
      0




           0             1             2             3            4              5
                                               t


FIGURE 13.8
Number of arrivals in a Poisson process with rate 10 in the interval (0, 5].



Thinning

It is straightforward to thin a Poisson process in R. The following code starts with a
vector of arrival times t and the corresponding number of arrivals n from a Poisson
process of rate λ on some interval, generated as above. For each arrival, we flip a coin
with probability p of Heads; these coin tosses are stored in the vector y. Finally,
the arrivals for which the coin landed Heads are labeled as type-1; the rest are
labeled as type-2. The resulting vectors of arrival times, t1 and t2 , are realizations
of independent Poisson processes of rates λp and λ(1−p), by Theorem 13.2.14.


Poisson processes                                                                               577

We can carry out this procedure for p = 0.3 as follows:
p <- 0.3
y <- rbinom(n,1,p)
t1 <- t[y==1]
t2 <- t[y==0]


2D Poisson process

Simulating a 2D Poisson process of rate λ on a square is nearly as easy as simu-
lating a 1D Poisson process. In the square (0, L] × (0, L], the number of arrivals is
distributed Pois(λL2 ). Conditional on the number of arrivals, the locations of the
arrivals are i.i.d. Uniform points in the square. By Example 7.1.23, the coordinates
for each of these points are i.i.d. Unif(0, L). So for L = 5, λ = 10, we can type:
L <- 5
lambda <- 10
n <- rpois(1,lambda*L^2)
x <- runif(n,0,L)
y <- runif(n,0,L)




13.6     Exercises
   1.   Passengers arrive at a bus stop according to a Poisson process with rate λ. The arrivals
        of buses are exactly t minutes apart. Show that on average, the sum of the waiting times
        of the riders on one of the buses is 12 λt2 .
   2.   Earthquakes occur over time according to a Poisson process with rate λ. The jth earth-
        quake has intensity Zj , where the Zj are i.i.d. with mean µ and variance σ 2 . Find the
        mean and variance of the cumulative intensity of all the earthquakes up to time t.
   3.   Alice receives phone calls according to a Poisson process with rate λ. Unfortunately she
        has lost her cell phone charger. The battery’s remaining life is a random variable T with
        mean µ and variance σ 2 . Let N (T ) be the number of phone calls she receives before the
        battery dies; find E(N (T )), Var(N (T )), and Cov(T, N (T )).
   4.   Emails arrive in Bob’s inbox according to a Poisson process with rate λ, measured
        in emails per hour; each email is work-related with probability p and personal with
        probability 1 − p. The amount of time it takes to answer a work-related email is a
                                                      2
        random variable with mean µW and variance σW    , the amount of time it takes to answer
        a personal email has mean µP and variance σP2 , and the response times for different
        emails are independent.
        What is the average amount of time Bob has to spend answering all the emails that
        arrive in a t-hour interval? What about the variance?
   5.   In an endless soccer match, goals are scored according to a Poisson process with rate λ.
        Each goal is made by team A with probability p and team B with probability 1 − p. For
        j > 1, the jth goal is a turnaround if it is made by a different team than the (j − 1)st
        goal; for example, in the sequence AABBA. . . , the 3rd and 5th goals are turnarounds.


578                                                                     Introduction to Probability

       (a) In n goals, what is the expected number of turnarounds?
       (b) If an A-to-B turnaround has just occurred, what is the expected time until the next
       B-to-A turnaround?
  6.   Let Nt be the number of arrivals up until time t in a Poisson process of rate λ, and let
       Tn be the time of the nth arrival. Consider statements of the form

                                      P (Nt ≶1 n) = P (Tn ≶2 t) ,

       where ≶1 and ≶2 are replaced by symbols from the list <, ≤, ≥, >. Which of these
       statements are true?
  7.   Claims against an insurance company follow a Poisson process with rate λ > 0. A total
       of N claims were received over two disjoint time periods of combined length t = t1 + t2 ,
       with ti the length of period i.

       (a) Given this information, derive the conditional probability distribution of N1 , the
       number of claims made in the first period, given N .

       (b) The amount paid for the ith claim is Xi , with X1 , X2 , . . . i.i.d. and independent
       of the claims process. Let E(Xi ) = µ, Var(Xi ) = σ 2 , for i = 1, . . . , N . Given N , find
       the mean and variance of the total claims paid in period 1. That is, find these two
       conditional moments of the quantity
                                                     N1
                                                     X
                                              W1 =         Xi ,
                                                     i=1

       where (by convention) W1 = 0 if N1 = 0.
  8.   On a certain question-and-answer website, N ∼ Pois(λ1 ) questions will be posted to-
       morrow, with λ1 measured in questions/day. Given N , the post times are i.i.d. and
       uniformly distributed over the day (a day begins and ends at midnight). When a ques-
       tion is posted, it takes an Expo(λ2 ) amount of time (in days) for an answer to be posted,
       independent of what happens with other questions.

       (a) Find the probability that a question posted at a uniformly random time tomorrow
       will not yet have been answered by the end of that day.

       (b) Find the joint distribution of how many answered and unanswered questions posted
       tomorrow there will be at the end of that day.
  9.   An inhomogeneous Poisson process in one dimension is a Poisson process whose rate,
       instead of being constant, is a nonnegative function λ(t) of time. Formally, we require
       that
       R t2 the number of arrivals in the interval [t1 , t2 ) be Poisson-distributed with mean
        t1
           λ(t)dt and that disjoint intervals be independent. When λ(t) is constant, this reduces
       to the definition of the ordinary or homogeneous Poisson process.

       (a) Show that we can generate arrivals from an inhomogeneous Poisson process in the
       interval [t1 , t2 ) using the following procedure.
       1. Let λmax be the maximum value of λ(t) in the interval [t1 , t2 ). Create a 2D rectangle
           [t1 , t2 ) × [0, λmax ], and plot the function λ(t) in the rectangle.
       2. Generate N ∼ Pois(λmax (t2 − t1 )), and place N points uniformly at random in the
           rectangle.
       3. For each of the N points: if the point falls below the curve λ(t), accept it as an
           arrival in the process, and take its horizontal coordinate to be its arrival time. If the
           point falls above the curve λ(t), reject it.
       Hint: Verify that the two conditions in the definition are satisfied.

       (b) Suppose we have an inhomogeneous Poisson process with rate function λ(t). Let


Poisson processes                                                                                             579

        N (t) be the number of arrivals up to time t and Tj be the time of the jth arrival.
        Explain why the hybrid joint PDF of N (t) and T1 , . . . , TN (t) , which constitute all the
        data observed up to time t, is given by

                                    e−λtotal λn          λ(t1 ) . . . λ(tn )
                f (n, t1 , . . . , tn ) =     total
                                                    · n!                     = e−λtotal λ(t1 ) . . . λ(tn )
                                         n!                   λntotal
                                                                                          Rt
        for 0 < t1 < t2 < · · · < tn and nonnegative integer n, where λtotal = 0 λ(u)du.
  10.   A Cox process is a generalization of a Poisson process, where the rate λ is a random
        variable. That is, λ is generated according to some distribution on (0, ∞) and then,
        given that value of λ, a Poisson process with that rate is generated.

        (a) Explain intuitively why disjoint intervals in a 1D Cox process are not independent.

        (b) In a 1D Cox process where λ ∼ Gamma(α, β), find the covariance between the
        number of arrivals in [0, t) and the number of arrivals in [t, t + s).
        Hint: Condition on λ.
  11.   In a Yule process with rate λ, the rate of arrivals increases after each new arrival, so
        that the time of the first arrival is Expo(λ) and the time between the (j − 1)st and jth
        arrivals is Expo(jλ) for j = 2, 3, . . . . So interarrival times are independent but not i.i.d.

        (a) Show that the superposition of two independent Yule processes with the
        same rate λ is a Yule process, except shifted so that the interarrival times are
        Expo(2λ), Expo(3λ), Expo(4λ), . . . rather than Expo(λ), Expo(2λ), Expo(3λ), . . . .

        (b) Show that if we project the process from Part (a) into discrete time, the resulting
        sequence of type-1 and type-2 arrivals is equivalent to the following discrete-time process:
        1. Start with two balls in an urn, labeled 1 and 2.
        2. Draw a ball out of the urn at random, note its number, and replace it along with
           another ball with the same number.
        3. Repeat step 2 over and over.
  12.   Consider the coupon collector problem: there are n toy types, and toys are collected
        one by one, sampling with replacement from the set of toy types each time. We solved
        this problem in Chapter 4, assuming that all toy types are equally likely. Now suppose
        that at each stage, the jth toy type is collected with probability pj , where the pj are
        not necessarily equal. Let N be the number of toys needed until we have a full set; we
        wish to find E(N ). This problem outlines an embedding method for calculating E(N ).

        (a) Suppose that the toys arrive according to a Poisson process with rate 1, so that the
        interarrival times between toys are i.i.d. Xj ∼ Expo(1). For j = 1, . . . , n, let Yj be the
        waiting time until the first toy of type j. What are the distributions of the Yj ? Are the
        Yj independent?

        (b) Explain why T = max(Y1 , . . . , Yn ), the waiting time until all toy types are collected,
        can also be written as X1 + · · · + XN , where the Xj are defined as in Part (a). Use this
        to show that E(T ) = E(N ).

        (c) Show that E(T ), and hence E(N ), can be found by computing the integral
                                    Z ∞        n
                                                               !
                                              Y         −pj t
                                         1−      (1 − e       ) dt.
                                             0           j=1


                                              R∞
        Hint: Use the identity E(T ) =           0
                                                     P (T > t)dt, which was shown in Example 5.3.8.


Taylor & Francis
Taylor & Francis Group
http://taylorandfrancis.com


A
Math




A.1     Sets

 A set is a Many that allows itself to be thought of as a One.
 – Georg Cantor

A set is a collection of objects. The objects can be anything: numbers, people,
cats, courses, even other sets! The language of sets allows us to talk precisely about
events. If S is a set, then the notation x ∈ S indicates that x is an element or
member of the set S (and x ∈   / S indicates that x is not in S). We can think of the
set as a club, with precisely defined criteria for membership. For example:

   1. {1, 3, 5, 7, . . . } is the set of all odd numbers;

   2. R is the set of all real numbers;

   3. {Worf, Jack, Tobey} is the set of Joe’s cats;

   4. [3, 7] is the closed interval consisting of all real numbers between 3 and 7;

   5. {HH, HT, T H, T T } is the set of all possible outcomes if a coin is flipped
      twice (where, for example, HT means the first flip lands Heads and the
      second lands Tails).

To describe a set (when it’s tedious or impossible to list out its elements), we can
give a rule that says whether each possible object is or isn’t in the set. For example,
{(x, y) ∈ R2 : x2 + y 2 ≤ 1} is the disk of radius 1 in the plane R2 , centered at the
origin. In this expression, the “:” is read as “such that”.


A.1.1    The empty set

The smallest set, which is both subtle and important, is the empty set, which is the
set that has no elements whatsoever. It is denoted by ∅ or by {}. Make sure not to
confuse ∅ with {∅}. The former has no elements, while the latter has one element.
If we visualize the empty set as an empty paper bag, then we can visualize {∅} as
a paper bag inside of a paper bag.

                                                                                   581


582                                                               Introduction to Probability

A.1.2    Subsets

If A and B are sets, then we say A is a subset of B (and write A ⊆ B) if every
element of A is also an element of B. For example, the set of all integers is a subset
of the set of all real numbers. It is always true that ∅ and A itself are subsets of A;
these are the extreme cases for subsets. A general strategy for showing that A ⊆ B
is to let x be an arbitrary element of A, and then show that x must also be an
element of B. A general strategy for showing that A = B for two sets A and B is
to show that each is a subset of the other.


A.1.3    Unions, intersections, and complements

The union of two sets A and B, written as A ∪ B, is the set of all objects that are
in A or B (or both). The intersection of A and B, written as A ∩ B, is the set of all
objects that are in both A and B. We say that A and B are disjoint if A ∩ B = ∅.
For n sets A1 , . . . , An , the union A1 ∪ A2 ∪ · · · ∪ An is the set of all objects that are
in at least one of the Aj ’s, while the intersection A1 ∩ A2 ∩ · · · ∩ An is the set of all
objects that are in all of the Aj ’s.
In many applications, all the sets we’re working with are subsets of some set S (in
probability, this may be the set of all possible outcomes of some experiment). When
S is clear from the context, we define the complement of a set A to be the set of all
objects in S that are not in A; this is denoted by Ac .
Unions, intersections, and complements can be visualized easily using Venn dia-
grams, such as the one shown below. The union is the entire shaded region, while
the intersection is the football-shaped region of points that are in both A and B.
The complement of A is all points in the rectangle that are outside of A.

                       S


                                           A∩B

                           A                                    B

FIGURE A.1
A Venn diagram.

Note that the area of the region A ∪ B is the area of A plus the area of B, minus
the area of A ∩ B (this is a basic form of the inclusion-exclusion principle).


Math                                                                                     583

De Morgan’s laws give an elegant, useful duality between unions and intersec-
tions:
                 (A1 ∪ A2 ∪ · · · ∪ An )c = Ac1 ∩ Ac2 ∩ · · · ∩ Acn

                      (A1 ∩ A2 ∩ · · · ∩ An )c = Ac1 ∪ Ac2 ∪ · · · ∪ Acn
It is much more important to understand De Morgan’s laws than to memorize them!
The first law says that not being in at least one of the Aj is the same thing as not
being in A1 , nor being in A2 , nor being in A3 , etc.
For example, let Aj be the set of people who like the jth Star Wars prequel, for
j ∈ {1, 2, 3}. Then (A1 ∪ A2 ∪ A3 )c is the set of people for whom it is not the case
that they like at least one of the prequels, but that is the same as Ac1 ∩ Ac2 ∩ Ac3 , the
set of people who don’t like The Phantom Menace, don’t like Attack of the Clones,
and don’t like Revenge of the Sith.
The second law says that not being in all of the Aj is the same thing as being
outside at least one of the Aj . For example, let the Aj be defined as in the previous
paragraph. If it is not the case that you like all of the Star Wars prequels (making
you a member of the set (A1 ∩A2 ∩A3 )c ), then there must be at least one prequel that
you don’t like (making you a member of the set Ac1 ∪ Ac2 ∪ Ac3 ), and vice versa.
Proving the following facts about sets (not just drawing Venn diagrams, though
they are very helpful for building intuition) is good practice:

   1. A ∩ B and A ∩ B c are disjoint, with (A ∩ B) ∪ (A ∩ B c ) = A.
   2. A ∩ B = A if and only if A ⊆ B.
   3. A ⊆ B if and only if B c ⊆ Ac .


A.1.4    Partitions

A collection of subsets A1 , . . . , An of a set S is a partition of S if A1 ∪ · · · ∪ An = S
and Ai ∩ Aj = ∅ for all i 6= j. In words, a partition of a set is a collection of
disjoint subsets whose union is the entire set. For example, the set of even numbers
{0, 2, 4, . . . } and the set of odd numbers {1, 3, 5, . . . } form a partition of the set of
nonnegative integers.


A.1.5    Cardinality

A set may be finite or infinite. If A is a finite set, we write |A| for the number of
elements in A, which is called its size or cardinality. For example, |{2, 4, 6, 8, 10}| = 5
since there are 5 elements in this set. A very useful fact is that A and B are finite
sets, then
                            |A ∪ B| = |A| + |B| − |A ∩ B|.


584                                                               Introduction to Probability

This is a form of the inclusion-exclusion theorem from Chapter 1. It says that to
count how many elements are in the union of A and B, we can add the separate
counts for each, and then adjust for the fact that we have double-counted the ele-
ments (if any) that are in both A and B.
Two sets A and B are said to have the same size or same cardinality if they can be
put into one-to-one correspondence, i.e., if each element of A can be paired up with
exactly one element of B, with no unpaired elements in either set. We say that A is
smaller than B if there is not a one-to-one correspondence between A and B, but
there is a one-to-one correspondence between A and some subset of B.
For example, suppose that we want to count the number of people in a movie theater
with 100 seats. Assume that no one in the theater is standing, and no seat has more
than one person in it. The obvious thing to do is to go around counting people
one by one (though it’s surprisingly easy to miss someone or accidentally count
someone twice). But if every seat is occupied, then a much easier method is to note
that there must be 100 people, since there are 100 seats and there is a one-to-one
correspondence between people and seats. If some seats are empty, then there must
be fewer than 100 people there.
This idea of looking at one-to-one correspondences makes sense both for finite and
for infinite sets. Consider the perfect squares 12 , 22 , 32 , . . . . Galileo pointed out the
paradoxical result that on the one hand it seems like there are fewer perfect squares
than positive integers (since every perfect square is a positive integer, but lots of
positive integers aren’t perfect squares), but on the other hand it seems like these
two sets have the same size since they can be put into one-to-one correspondence:
pair 12 with 1, pair 22 with 2, pair 32 with 3, etc.
The resolution of Galileo’s paradox is to realize that intuitions about finite sets don’t
necessarily carry over to infinite sets. By definition, the set of all perfect squares and
the set of all positive integers do have the same size. Another famous example of
this is Hilbert’s hotel. For any hotel in the real world the number of rooms is finite.
If every room is occupied, there is no way to accommodate more guests, other than
by cramming more people into already occupied rooms.
Now consider an imaginary hotel with an infinite sequence of rooms, numbered
1, 2, 3, . . . . Assume that all the rooms are occupied, and that a weary traveler arrives,
looking for a room. Can the hotel give the traveler a room, without leaving any of
the current guests without a room? Yes, one way is to have the guest in room n
move to room n + 1, for all n = 1, 2, 3, . . . . This frees up room 1, so the traveler can
stay there.
What if infinitely many travelers arrive at the same time, such that their cardinality
is the same as that of the positive integers (so we can label the travelers as traveler
1, traveler 2, . . . )? The hotel could fit them in one by one by repeating the above
procedure over and over again, but it would take forever (infinitely many moves) to
accommodate everyone, and it would be bad for business to make the current guests
keep moving over and over again. Can the room assignments be updated just once


Math                                                                                  585

so that everyone has a room? Yes, one way is to have the guest in room n move to
room to 2n for all n = 1, 2, 3, . . . , and then have traveler n move into room 2n − 1.
In this way, the current guests occupy all the even-numbered rooms, and the new
guests occupy all the odd-numbered rooms.
An infinite set is called countably infinite if it has the same cardinality as the set
of all positive integers. A set is called countable if it is finite or countably infinite,
and uncountable otherwise. The mathematician Cantor showed that not all infinite
sets are the same size. In particular, the set of all real numbers is uncountable, as
is any interval in the real line of positive length.


A.1.6    Cartesian product

The Cartesian product of two sets A and B is the set
                           A × B = {(a, b) : a ∈ A, b ∈ B}.
For example, [0, 1] × [0, 1] is the square {(x, y) : x, y ∈ [0, 1]}, and R × R = R2 is
two-dimensional Euclidean space.




A.2     Functions

Let A and B be sets. A function from A to B is a deterministic rule that, given an
element of A as input, provides an element of B as an output. That is, a function
from A to B is a machine that takes an x in A and “maps” it to some y in B. Different
x’s can map to the same y, but each x only maps to one y. Here A is called the
domain and B is called the target. The notation f : A → B says that f is a function
mapping A into B. The range of f is {y ∈ B : f (x) = y for some x ∈ A}.
It is important to distinguish between f (the function) and f (x) (the value of the
function when evaluated at x). That is, f is a rule, while f (x) is a number for each
                                                2
number x. The function g given by g(x) = e−x /2 is exactly the same as the function
                     2
g given by g(t) = e−t /2 ; what matters is the rule, not the name we use for the input.
                                                           2
For this example, the rule is that x gets mapped to e−x /2 ; this rule is also denoted
            2
by x 7→ e−x /2 .
A function f from the real line to the real line is continuous if f (x) → f (a) as x → a,
for any value of a. It is called right-continuous if this is true when approaching from
the right, i.e., f (x) → f (a) as x → a while ranging over values with x > a.
The set A may not be a set of numbers. In probability, it is extremely common and
useful to consider functions whose domains are the set of all possible outcomes of
some experiment. It may be difficult to write down a formula for the function, but
the function is still valid as long as it’s defined unambiguously.


586                                                            Introduction to Probability

A.2.1    One-to-one functions

Let f be a function from A to B. Then f is a one-to-one function if f (x) 6= f (y)
whenever x 6= y. That is, any two distinct inputs in A get mapped to two distinct
outputs in B; for each y in B, there can be at most one x in A that maps to it.

Let f be a one-to-one function from A to B, and let C be the range of f , i.e.,

                       C = {b ∈ B : f (a) = b for some x ∈ A}.

Then there is an inverse function f −1 : C → A, defined by letting f −1 (y) be the
unique element x ∈ A such that f (x) = y. A function that has an inverse is called
an invertible function.

For example, let f (x) = x2 for all real x. This is not a one-to-one function since,
for example, f (3) = f (−3). But now assume instead that the domain of f is chosen
to be [0, ∞), so we are defining f as a function from [0, ∞) to [0, ∞). Then f is
                                                           √
one-to-one, and its inverse function is given by f −1 (y) = y for all y ∈ [0, ∞).

The pigeonhole principle says that if A and B are finite sets with |A| > |B|, then
there does not exist a one-to-one function from A to B. In other words, if k objects
are placed into n boxes, where k > n, then there must be at least one box that
contains more than one object.

For example, in the birthday problem from Chapter 1 (assuming there are 365 days
in a year), with 366 or more people there is guaranteed to be at least one birthday
match. There is no one-to-one function assigning a birthday to each of the people,
when there are more people than there are days in a year.


A.2.2    Increasing and decreasing functions

Let f : A → R, where A is a set of real numbers. Then f is an increasing function if
x ≤ y implies f (x) ≤ f (y) (for all x, y ∈ A). Note that this definition allows there to
be regions where f is flat, e.g., the constant function that is equal to 42 everywhere
is an increasing function, and any CDF (see Section 3.6) is an increasing function.
We say that f is strictly increasing if x < y implies f (x) < f (y). For example,
f : R → R with f (x) = x3 is a strictly increasing function.

Similarly, f is a decreasing function if x ≤ y implies f (x) ≥ f (y), and is a strictly
decreasing function if x < y implies f (x) > f (y). For example, f : (0, ∞) → (0, ∞)
with f (x) = 1/x is a strictly decreasing function.

A monotone function is a function that is either increasing or decreasing. A strictly
monotone function is a function that is either strictly increasing or strictly decreas-
ing. Note that any strictly monotone function is one-to-one.


Math                                                                                587

A.2.3      Even and odd functions


Let f be a function from R to R. We say f is an even function if f (x) = f (−x) for
all x, and we say f is an odd function if −f (x) = f (−x) for all x. If neither of these
conditions is satisfied, then f is neither even nor odd. Figure A.2 shows the graphs
of two even functions and two odd functions.
    4




                                            5
    3
    2




                                            0
    1




                                            −5
    0




          −2   −1      0       1      2            −2   −1     0       1      2
    1.0




                                            0.6
                                            0.4
    0.8




                                            0.2
    0.6




                                            0.0
                                            −0.2
    0.4




                                            −0.4
    0.2




                                            −0.6




          −2   −1      0       1      2            −2   −1     0       1      2


FIGURE A.2
Even and odd functions. The graphs on the left are even functions: f (x) = x2 on the
                    2
top and f (x) = e−x /2 on the bottom. The graphs on the right are odd functions:
                                      2
f (x) = x3 on the top and f (x) = xe−x /2 on the bottom.


Even and odd functions have nice symmetry properties. The graph of an even func-
tion remains the same if you reflect it about the vertical axis, and the graph of an
odd function remains the same if you rotate it 180 degrees around the origin.


588                                                            Introduction to Probability

Even functions have the property that for any a,
                           Z a             Z a
                               f (x)dx = 2     f (x)dx,
                               −a                0

assuming the integral exists. This is because the area under the function from −a
to 0 is equal to the area under the function from 0 to a. Odd functions have the
property that for any a,         Z    a
                                          f (x)dx = 0,
                                     −a
again assuming the integral exists. This is because the area under the function from
−a to 0 cancels the area under the function from 0 to a.


A.2.4    Convex and concave functions

A function g whose domain is an interval I is convex if

                     g(px1 + (1 − p)x2 ) ≤ pg(x1 ) + (1 − p)g(x2 )

for all x1 , x2 ∈ I and p ∈ (0, 1). Geometrically, this says that if we draw a line
segment connecting two points on the graph of g, then the line segment lies above
the graph of g. If the derivative g 0 exists, then an equivalent definition is that every
tangent line to the graph of g lies below the graph. If g 00 exists, then an equivalent
definition is that g 00 (x) ≥ 0 for all x ∈ I. An example is shown in Figure A.3. A
simple example is g(x) = x2 , whose second derivative is g 00 (x) = 2 > 0.




                         y = g(x)




FIGURE A.3
Graph of a convex function g. We have g 00 (x) ≥ 0. Any line segment connecting two
points on the curve lies above the curve. Any tangent line lies below the curve.

A function g is concave if −g is convex. If g 00 exists, then g is concave if and only
if g 00 (x) ≤ 0 for all x in the domain. For example, g(x) = log(x) defines a concave
function on (0, ∞) since g 00 (x) = −1/x2 < 0 for all x ∈ (0, ∞).


Math                                                                                589

A.2.5    Exponential and logarithmic functions

An exponential function is a function of the form f (x) = ax for some number a > 0.
If a > 1, the function is increasing, and if 0 < a < 1, the function is decreasing. The
most common exponential function we’ll work with is f (x) = ex , and a very useful
limit result to know is that
                                         x n
                                      1+       → ex
                                          n

as n → ∞, for any real number x. This has an interpretation in terms of a bank
paying compound interest on a deposit: as compounding occurs more and more
times per year, the growth rate approaches exponential growth.

Here are some properties of exponential functions:


   1. ax ay = ax+y .

   2. ax bx = (ab)x .

   3. (ax )y = axy .


The inverse of an exponential function is a logarithmic function: for positive y, loga y
is defined to be the number x such that ax = y. Throughout this book, when we
write log y without explicitly specifying the base, we are referring to the natural
logarithm (base e).

Here are some properties of logarithms:


   1. loga x + loga y = loga xy.

   2. loga xn = n loga x.

   3. loga x = log x
               log a .



A.2.6    Floor function and ceiling function

The floor function is defined by letting bxc be the greatest integer less than or
equal to x. That is, it says to round down to an integer. For example, b3.14c = 3,
b−1.3c = −2, and b5c = 5. (Some books denote the floor function by [x] but this
is bad notation since it does not suggest a corresponding notation for the ceiling
function, and since square brackets are also used for other purposes.)

The ceiling function is defined by letting dxe be the smallest integer greater than
or equal to x. For example, d3.14e = 4, d−1.3e = −1, and d5e = 5.


590                                                          Introduction to Probability

A.2.7    Factorial function and gamma function

The factorial function takes a positive integer n and returns the product of the
integers from 1 to n, denoted n! and read “n factorial”:

                             n! = n(n − 1)(n − 2) · · · 1.

Also, we define 0! = 1. This convention makes sense since if we think of n! as the
number of ways in which n people can line up, there is 1 way for n = 0 (this just
means there is no one there, so the line is empty). It is also very helpful since, for
example, we can then say that n!/(n − 1)! = n for all positive integers n without
running into trouble when n = 1.
The factorial function grows extremely quickly as n grows. A famous, useful ap-
proximation for factorials is Stirling’s formula,
                                        √     n n
                                  n! ≈ 2πn          .
                                               e
The ratio of the two sides converges to 1 as n → ∞. For example, direct calculation
gives 52! ≈ 8.066 × 1067 , while Stirling’s formula says 52! ≈ 8.053 × 1067 .
The gamma function Γ generalizes the factorial function to positive real numbers;
it is defined by               Z ∞
                                          dx
                       Γ(a) =      xa e−x , a > 0,
                                0         x
and has the property that
                                    Γ(n) = (n − 1)!
                                            √
for all positive integers n. Also, Γ(1/2) = π.
An important property of the gamma function, which generalizes the fact that
n! = n · (n − 1)!, is that
                             Γ(a + 1) = aΓ(a)
for all a > 0. See Chapter 8 for more about the gamma function.




A.3     Matrices

 Neo: What is the Matrix?
 Trinity: The answer is out there, Neo, and it’s looking for you, and it will find
 you if you want it to.
 – The Matrix (film from 1999)
                                                                          
                                                       3 1/e         1 1 0
A matrix is a rectangular array of numbers, such as             or              . We
                                                      2π 1           1 2 3


Math                                                                            591

say that the dimensions of a matrix are m by n (also written m × n) if it has m
rows and n columns (so the former example is 2 by 2, while the latter is 2 by 3).
The matrix is called square if m = n. If m = 1, we have a row vector ; if n = 1, we
have a column vector. We write A = (aij ) to indicate that the row i, column j entry
of A is aij .


A.3.1   Matrix addition and multiplication

To add two matrices A and B with the same dimensions, just add the corresponding
entries, e.g.,

                                             
                         1 1 0     1 0 0     2 1 0
                                +         =         .
                         1 1 1     1 1 0     2 2 1

When we multiply an m × n matrix A by an n × r matrix B, we obtain an m × r
matrix AB. The product AB is undefined if the number of columns of A does not
equal the number of rows of B.
                                    P
The row i, column j entry of AB is nk=1 aik bkj , where aij and bij are the row i,
column j entries of A and B, respectively. For example, here is how to multiply a
2 × 3 matrix by a 3 × 1 vector:
                            
                         7                          
                 1 2 3            1·7+2·8+3·9             50
                             8 =                       =         .
                 4 5 6              4·7+5·8+6·9             122
                             9

Note that AB may not equal BA, even if both are defined. To multiply a matrix A
by a scalar, just multiply each entry by that scalar.
The transpose of a matrix A is the matrix whose row i, column j entry is the row
j, column i entry of A. It is denoted by A0 and read as “A transpose”. The rows of
A are the columns of A0 , and the columns of A are the rows of A0 . A square matrix
A is symmetric if A0 = A. A useful property of transposes is that if A and B are
matrices such that the product AB is defined, then (AB)0 = B 0 A0 .
The determinant of a 2 × 2 matrix is defined by
                                  a b
                                      = ad − bc.
                                  c d
Determinants can also be defined for n × n matrices, in a recursive manner not
reviewed here.


A.3.2   Eigenvalues and eigenvectors

An eigenvalue of an n × n matrix A is a number λ such that
                                     Av = λv


592                                                            Introduction to Probability

for some n × 1 column vector v, where the elements of v are not all zero. The vector
v is called an eigenvector of A, or a right eigenvector. (Similarly, a left eigenvector
of A is a row vector w satisfying wA = λw for some λ.) This definition says that
when A and v are multiplied, v just gets stretched by the constant λ.
Some matrices have no real eigenvalues, but the Perron-Frobenius theorem tells us
that in a special case that is of particular interest to us in Chapter 11, eigenvalues
exist and have nice properties. Let A be a square matrix whose entries are nonnega-
tive and whose rows sum to 1. Further assume that for all i and j, there exists k ≥ 1
such that the row i, column j entry of Ak is positive. Then the Perron-Frobenius
theorem says that 1 is an eigenvalue of A, which is in fact the largest eigenvalue of
A, and there is a corresponding eigenvector whose entries are all positive.




A.4    Difference equations

A difference equation describes a sequence of numbers recursively in terms of earlier
terms in the sequence. For example, a0 , a1 , . . . is a Fibonacci sequence if

                                   ai = ai−1 + ai−2

for all i ≥ 2. There are infinitely many Fibonacci sequences, but such a sequence
is uniquely determined after a0 and a1 are specified (these are called the initial
conditions or boundary conditions). For example, a0 = 0, a1 = 1 yields the Fibonacci
sequence 0, 1, 1, 2, 3, 5, 8, 13, . . . .
Difference equations often arise in probability, especially when applying LOTP. In
this section, we will show how to solve difference equations of the form

                                pi = p · pi+1 + q · pi−1 ,

where p 6= 0 and q = 1 − p. (This equation comes up in the gambler’s ruin problem.)
The first step is to guess a solution of the form pi = xi . Plugging this into the above,
we have
                                 xi = p · xi+1 + q · xi−1 ,
which reduces to px2 − x + q = 0. This is called the characteristic equation, and the
solution to the difference equation depends on whether the characteristic equation
has one or two distinct roots. If there are two distinct roots r1 and r2 , then the
solution is of the form
                                   pi = ar1i + br2i ,
for some constants a and b. If there is only one distinct root r, then the solution is
of the form
                                  pi = ari + biri .


Math                                                                                593

In our case, the characteristic equation has roots 1 and q/p, since
                    p                   p
               1±    1 − 4p(1 − p)   1 ± (2p − 1)2   1 ± |2p − 1|
                                   =               =
                       2p                 2p              2p

is (1 + 2p − 1)/(2p) = 1 or (2 − 2p)/(2p) = q/p. The roots are distinct if p 6= q and
are both equal to 1 if p = q. So we have
                                        i
                                          q
                                   a+b       , p 6= q,
                            pi =           p
                                 
                                   a + bi,     p = q.

This is called the general solution of the difference equation, since we have not yet
specified the constants a and b. To get a specific solution, we need to know two
points in the sequence in order to solve for a and b.




A.5    Differential equations

Differential equations are the continuous version of difference equations. A differen-
tial equation uses derivatives to describe a function or collection of functions. For
example, the differential equation

                                       dy
                                          = 3y
                                       dx

describes a collection of functions that have the following property: the instanta-
neous rate of change of the function at any point (x, y) is equal to 3y. This is an
example of a separable differential equation because we can separate the x’s and
y’s, putting them on opposite sides of the equation:

                                      dy
                                         = 3dx.
                                      y

Now we can integrate both sides, giving log y = 3x + c, or equivalently,

                                      y = Ce3x ,

where C is any constant. This is called the general solution of the differential equa-
tion, and it tells us that all functions satisfying the differential equation are of the
form y = Ce3x for some C. To get a specific solution, we need to specify one point
on the graph, which allows us to solve for C.


594                                                                   Introduction to Probability




A.6    Partial derivatives

If you can do ordinary derivatives, you can do partial derivatives: just hold all the
other input variables constant except for the one you’re differentiating with respect
to. For example, let f (x, y) = y sin(x2 +y 3 ). Then the partial derivative with respect
to x is
                              ∂f (x, y)
                                        = 2xy cos(x2 + y 3 ),
                                 ∂x
and the partial derivative with respect to y is

                      ∂f (x, y)
                                = sin(x2 + y 3 ) + 3y 3 cos(x2 + y 3 ).
                         ∂y

These are first order partial derivatives. If we take a partial derivative of a first
order partial derivative, we get a second order partial derivative, such as
                                   
        ∂ 2 f (x, y)   ∂ ∂f (x, y)
                     =                = 2x(cos(x2 + y 3 ) − 3y 3 sin(x2 + y 3 )).
           ∂y∂x        ∂y     ∂x

We get the same result if we take the partial derivatives in the opposite order (with
respect to y and then with respect to x):
                                   
         ∂ 2 f (x, y)   ∂ ∂f (x, y)
                      =               = 2x(cos(x2 + y 3 ) − 3y 3 sin(x2 + y 3 )).
            ∂x∂y        ∂x   ∂y

Under mild technical assumptions, it is also true for general f that

                                 ∂ 2 f (x, y)   ∂ 2 f (x, y)
                                              =              .
                                    ∂x∂y           ∂y∂x

The Jacobian of a transformation which maps (x1 , . . . , xn ) to (y1 , . . . , yn ) is the
n × n matrix of all possible first order partial derivatives, given by
                                   ∂y1      ∂y1          ∂y1    
                                      ∂x1    ∂x2    ...   ∂xn
                           ∂y  .              ..           ..   
                              =  ..            .            .   .
                           ∂x     ∂y         ∂yn          ∂yn
                                      ∂x1
                                         n
                                             ∂x2    ...   ∂xn




A.7    Multiple integrals

If you can do single integrals, you can do multiple integrals: just do more than one
integral, holding variables other than the current variable of integration constant.


Math                                                                                  595

For example,
                 Z 1Z y                          Z 1Z y
                                2
                          (x − y) dxdy =          (x2 − 2xy + y 2 )dxdy
                  0   0                     0  0
                                           Z 1                      y
                                                   3      2        2
                                         =      (x /3 − x y + xy )      dy
                                                  0                              0
                                                 Z 1
                                         =             (y 3 /3 − y 3 + y 3 )dy
                                                  0
                                                 1
                                         =          .
                                                 12


A.7.1    Change of order of integration

We can also integrate in the other order, dydx rather than dxdy, as long as we are
careful about the limits of integration. Since we’re integrating over all (x, y) with x
and y between 0 and 1 such that x ≤ y, to integrate the other way we write
           Z 1Z 1                  Z 1Z 1
                          2
                  (x − y) dydx =           (x2 − 2xy + y 2 )dydx
            0   x                    0   x
                                   Z                           !
                                             1                               1
                                    =              (x2 y − xy 2 + y 3 /3)        dx
                                         0                                   x
                                        Z 1
                                    =            (x2 − x + 1/3 − x3 + x3 − x3 /3)dx
                                         0
                                        1
                                    =      .
                                        12


A.7.2    Change of variables

In making a change of variables with multiple integrals, a Jacobian is needed. To
simplify notation, we will discuss the two-dimensional version; the n-dimensional
version is analogous. Suppose we make an invertible transformation from (x, y) to
(u, v), where the inverse transformation is given by

                                 x = g(u, v), y = h(u, v).

Let A be a region in the (x, y)-plane and B be the corresponding region in the
(u, v)-plane. Then the change of variables formulas says that
             ZZ                 ZZ
                                                            ∂(x, y)
                 f (x, y)dxdy =    f (g(u, v), h(u, v)) · |         | dudv,
                                                            ∂(u, v)
             A                      B

        ∂(x,y)
where | ∂(u,v) | is the absolute value of the determinant of the Jacobian matrix.
A few technical assumptions are needed for this result, such as that the partial


596                                                                    Introduction to Probability

derivatives that appear in the Jacobian matrix exist and are continuous, and that
the determinant of the Jacobian matrix is never 0.
For example, let’s find the area of a circle of radius 1. To find the area of a region,
we just need to integrate 1 over that region (so the part that may be tricky is the
limits of integration; the integrand is just 1). So the area is
                ZZ                  Z 1 Z √1−y2                 Z 1p
                          1dxdy =          √      1dxdy = 2            1 − y 2 dy.
                                     −1   − 1−y 2           −1
             x2 +y 2 ≤1

Note that the limits for the inner variable (x) of the double integral can depend on
the outer variable (y), while the outer limits are constants. The last integral can be
done with a trigonometric substitution, but instead let’s simplify the problem by
transforming to polar coordinates: let

                                    x = r cos θ, y = r sin θ,

where r is the distance from (x, y) to the origin and θ ∈ [0, 2π) is the angle. The
Jacobian matrix of this transformation is
                                                      
                            ∂(x, y)     cos θ −r sin θ
                                    =
                            ∂(r, θ)     sin θ r cos θ,

so the absolute value of the determinant of the Jacobian is r(cos2 θ + sin2 θ) = r.
That is, dxdy becomes rdrdθ. So the area of the circle is
                              Z 2π Z 1              Z 2π
                                                           1
                                          rdrdθ =            dθ = π.
                               0      0              0     2

For a circle of radius r, it follows immediately that the area is πr2 since we can
convert our units of measurement to the unit for which the radius is 1.
This may seem like a lot of work just to get such a familiar result, but it served as
illustration and with similar methods we can get the volume of a ball in any number
of dimensions! It turns out that the volume of a ball of radius 1 in Rn is

                                                π n/2
                                      Vn =              ,
                                             Γ(n/2 + 1)

where Γ is the gamma function (see Section A.2.7).




A.8    Sums

There are several kinds of sums that come up frequently in probability.


Math                                                                                      597

A.8.1   Binomial theorem

The binomial theorem states that
                                                n  
                                                X  n
                             (x + y)n =                       xk y n−k ,
                                                          k
                                                k=0

                                         
for any nonnegative integer n. Here nk is a binomial coefficient, defined as the
number of ways to choose k objects out of n, with order not mattering. An explicit
formula for nk in terms of factorials for 0 ≤ k ≤ n is
                                       
                                       n        n!
                                          =            .
                                       k    (n − k)!k!

A proof of the binomial theorem is given in Example 1.4.19.

Sometimes 00 is said to be undefined, but there are several strong arguments for
defining it to be 1, and we will take 00 = 1 in this book. For one simple reason for
doing so, consider the case x = 0, y = 1 in the binomial theorem. Then the left-hand
side is 1n = 1, and we need to have 00 = 1 in order to make the right-hand side also
equal to 1.


A.8.2   Geometric series
                    P
A series of the form ∞     n
                      n=0 x is called a geometric series. For |x| < 1, the series
converges and we have
                               X∞
                                           1
                                   xn =      .
                                         1−x
                                       n=0

The series diverges if |x| ≥ 1. A series of the same form except with finitely many
terms is called a finite geometric series. For x 6= 1, the sum is

                                      n
                                      X             1 − xn+1
                                            xk =             .
                                                      1−x
                                      k=0


Note that the n + 1 in the exponent is the number of terms in the sum. If the sum
starts at k = m rather than k = 0 (where m is an integer with 0 ≤ m ≤ n), then
we can easily reduce to the case where the sum starts at 0. Making the substitution
j = k − m, we have

               n
               X           n−m
                           X                        n−m
                                                    X
                     k               j+m        m                          1 − xn−m+1
                     x =         x         =x             xj = xm ·                   .
                                                                              1−x
               k=m         j=0                      j=0


598                                                                     Introduction to Probability

A.8.3    Taylor series for ex

The Taylor series for ex is

                                ∞
                                X xn
                                               = ex , for all x.
                                       n!
                                n=0




A.8.4    Harmonic series and other sums with a fixed exponent
                              P
It is also useful to know that ∞       c
                                n=1 1/n converges for c > 1 and diverges for c ≤ 1.
For c = 1, this is called the harmonic series. The sum of the first n terms of the
harmonic series can be approximated using

                                     n
                                     X 1
                                               ≈ log(n) + γ
                                           k
                                     k=1


for n large, where γ ≈ 0.577 is the Euler-Mascheroni constant.

The sum of the first n positive integers is

                          n
                          X                                      
                                                              n+1
                                k = n(n + 1)/2 =                    .
                                                               2
                          k=1


It follows from this identity, for example, that the sum of the first n odd positive
integers is
                 Xn               Xn     Xn
                    (2k − 1) = 2      k−     1 = n(n + 1) − n = n2 .
                k=1                  k=1         k=1


For squares of integers, we have

                              n
                              X
                                    k 2 = n(n + 1)(2n + 1)/6.
                              k=1


For cubes of integers, amazingly, the sum is the square of the sum of the first n
positive integers! That is,

                                n
                                X
                                      k 3 = (n(n + 1)/2)2 .
                                k=1


Exercise 22 from Chapter 1 asks for a story proof of this result.


Math                                                                              599




A.9     Pattern recognition

Much of math and statistics is really about pattern recognition: seeing the essential
structure of a problem, recognizing when one problem is essentially the same as
another problem (just in a different guise), noticing symmetry, and so on. We will
see many examples
               P of tk  this kind of thinking in this book. For example, suppose we
have the series ∞ k=0 e  e−λ λk /k!, with λ a positive constant. The e−λ can be taken
out from the sum, and then the structure of the series exactly matches up with the
structure of the Taylor series for ex . Therefore
                  ∞ tk −λ k
                  X                   ∞
                                      X
                    e e λ               (λet )k            t       t
                              = e−λ               = e−λ eλe = eλ(e −1) ,
                        k!                  k!
                  k=0                 k=0

valid for all real t.
Similarly, suppose we want the Taylor series for 1/(1 − x3 ) about x = 0. It would be
tedious to start taking derivatives of this function. Instead, note that this function
is reminiscent of the result of summing a geometric series. Therefore
                                           X ∞
                                     1
                                         =   x3n ,
                                  1 − x3
                                            n=0

for |x3 | < 1 (which is equivalent to |x| < 1). What matters is the structure, not
what names we use for variables!




A.10     Common sense and checking answers

It is very easy to make mistakes in probability, so checking answers is especially
important. Some useful strategies for checking answers are:
• seeing whether the answer makes sense intuitively (though as we have often seen
  in this book, probability has many results that seem counterintuitive at first);
• making sure your answer isn’t a category error;
• making sure you’re avoiding biohazards;
• trying out simple cases;
• trying out extreme cases;
• looking for alternative methods to solve the problem (including methods that may
  only give a bound or approximation, such as applying one of the inequalities from
  Chapter 10 or using R to run a simulation).


Taylor & Francis
Taylor & Francis Group
http://taylorandfrancis.com


B
R




B.1   Vectors



           Command                            What it does
         c(1,1,0,2.7,3.1)             creates the vector (1, 1, 0, 2.7, 3.1)
                1:100                  creates the vector (1, 2, . . . , 100)
             (1:100)^3               creates the vector (13 , 23 , . . . , 1003 )
             rep(0,50)          creates the vector (0, 0, . . . , 0) of length 50
            seq(0,99,3)              creates the vector (0, 3, 6, 9, . . . , 99)
                v[5]              5th entry of vector v (index starts at 1)
                v[-5]                      all but the 5th entry of v
            v[c(3,1,4)]                3rd, 1st, 4th entries of vector v
               v[v>2]                      entries of v that exceed 2
            which(v>2)             indices of v such that entry exceeds 2
            which(v==7)             indices of v such that entry equals 7
               min(v)                            minimum of v
               max(v)                            maximum of v
           which.max(v)               indices where max(v) is achieved
               sum(v)                        sum of the entries in v
             cumsum(v)               cumulative sums of the entries in v
              prod(v)                     product of the entries in v
              rank(v)                       ranks of the entries in v
             length(v)                         length of vector v
              sort(v)                sorts vector v (in increasing order)
             unique(v)       lists each element of v once, without duplicates
            tabulate(v)     tallies how many times each element of v occurs
              table(v)         same as tabulate(v), except in table format
               c(v,w)                    concatenates vectors v and w
            union(v,w)                      union of v and w as sets
          intersect(v,w)                intersection of v and w as sets
                 v+w           adds v and w entrywise (recycling if needed)
                 v*w        multiplies v and w entrywise (recycling if needed)


                                                                                    601


602                                                            Introduction to Probability




B.2   Matrices

             Command                                       What it does     
                                                                         1 5
 matrix(c(1,3,5,7), nrow=2, ncol=2)                 creates the matrix
                                                                         3 7
               dim(A)                            gives the dimensions of matrix A
               diag(A)                           extracts the diagonal of matrix
                                                                                A
                                                                             1 0
            diag(c(1,7))                       creates the diagonal matrix
                                                                             0 7
            rbind(u,v,w)                   binds vectors u, v, w into a matrix, as rows
            cbind(u,v,w)                 binds vectors u, v, w into a matrix, as columns
                  t(A)                                 transpose of matrix A
                A[2,3]                          row 2, column 3 entry of matrix A
                 A[2,]                            row 2 of matrix A (as a vector)
                 A[,3]                          column 3 of matrix A (as a vector)
          A[c(1,3),c(2,4)]            submatrix of A, keeping rows 1, 3 and columns 2, 4
              rowSums(A)                               row sums of matrix A
             rowMeans(A)                             row averages of matrix A
              colSums(A)                           column averages of matrix A
             colMeans(A)                            column means of matrix A
               eigen(A)                     eigenvalues and eigenvectors of matrix A
               solve(A)                                         A−1
              solve(A,b)               solves Ax = b for x (where b is a column vector)
                A %*% B                              matrix multiplication AB
                A %^% k                      matrix power Ak (using expm package)




B.3   Math

                  Command                                   What it does
                     abs(x)                                        |x|
                     exp(x)                                         ex
                     log(x)                                      log(n)
                   log(x,b)                                     logb (n)
                                                                   √
                    sqrt(x)                                          x
                   floor(x)                                        bxc
                  ceiling(x)                                       dxe
                 factorial(n)                                       n!
                lfactorial(n)                      log(n!) (helps prevent overflow)
                   gamma(a)                                       Γ(a)
                   lgamma(a)                      log(Γ(a)) (helps prevent overflow)
                                                        binomial coefficient nk
                                                                                
                 choose(n,k)
                 pbirthday(k)                   solves birthday problem for k people
            if (x>0) x^2 else x^3                x2 if x > 0, x3 otherwise (piecewise)
          f <- function(x) exp(-x)              defines theR function f by f (x) = e−x
                                                             ∞
      integrate(f, lower=0, upper=Inf)               finds 0 f (x)dx numerically
  optimize(f,lower=0,upper=5,maximum=TRUE)        maximizes f numerically on [0, 5]
        uniroot(f, lower=0, upper=5)         searches numerically for a zero of f in [0, 5]


R                                                                                            603




B.4      Sampling and simulation



               Command                                     What it does
               sample(7)                         random permutation of 1, 2, . . . , 7
              sample(52,5)                 picks 5 times from 1, 2, . . . , 52 (don’t replace)
           sample(letters,5)          picks 5 random letters of the alphabet (don’t replace)
    sample(3,5,replace=TRUE,prob=p)   picks 5 times from 1, 2, 3 with probabilities p (replace)
       replicate(10^4,experiment)                simulates 104 runs of experiment




B.5      Plotting




         Command                                           What it does
   curve(f, from=a, to=b)                        graphs the function f from a to b
          plot(x,y)                          creates scatter plot of the points (xi , yi )
     plot(x,y,type="l")                        creates line plot of the points (xi , yi )
         points(x,y)                            adds the points (xi , yi ) to the plot
         lines(x,y)                     adds line segments through the (xi , yi ) to the plot
         abline(a,b)                    adds the line with intercept a, slope b to the plot
hist(x, breaks=b, col="blue")        blue histogram of the values in x, with b bins suggested
        par(new=TRUE)             tells R not to clear the palette when we make our next plot
      par(mfrow=c(1,2))           tells R we want 2 side-by-side plots (a 1 by 2 array of plots)




B.6      Programming




                   Command                                             What it does
                    x <- pi                                           sets x equal to π
                   x>3 && x<5                              Is x > 3 and x < 5? (TRUE/FALSE)
                   x>3 || x<5                               Is x > 3 or x < 5? (TRUE/FALSE)
               if (n>3) x <- x+1                                    adds 1 to x if n > 3
        if (n==0) x <- x+1 else x <- x+2                      adds 1 to x if n = 0, else adds 2
v<-rep(0,50); for (k in 1:50) v[k]<-pbirthday(k)         solves birthday problem up to 50 people


604                                                              Introduction to Probability




B.7    Summary statistics

           Command                            What it does
              mean(v)                     sample mean of vector v
              var(v)                    sample variance of vector v
               sd(v)               sample standard deviation of vector v
            median(v)                    sample median of vector v
           summary(v)     min, 1st quartile, median, mean, 3rd quartile, max of v
          quantile(v,p)               pth sample quantile of vector v
             cov(v,w)              sample covariance of vectors v and w
             cor(v,w)              sample correlation of vectors v and w




B.8    Distributions

             Command                             What it does
         help(distributions)         shows documentation on distributions
            dbinom(k,n,p)              PMF P (X = k) for X ∼ Bin(n, p)
            pbinom(x,n,p)              CDF P (X ≤ x) for X ∼ Bin(n, p)
            qbinom(a,n,p)      quantile min{x : P (X ≤ x) ≥ a} for X ∼ Bin(n, p)
            rbinom(r,n,p)                vector of r i.i.d. Bin(n, p) r.v.s
              dgeom(k,p)               PMF P (X = k) for X ∼ Geom(p)
           dhyper(k,w,b,n)         PMF P (X = k) for X ∼ HGeom(w, b, n)
           dnbinom(k,r,p)              PMF P (X = k) for X ∼ NBin(r, p)
              dpois(k,r)                PMF P (X = k) for X ∼ Pois(r)
            dbeta(x,a,b)                  PDF f (x) for X ∼ Beta(a, b)
              dcauchy(x)                   PDF f (x) for X ∼ Cauchy
             dchisq(x,n)                     PDF f (x) for X ∼ χ2n
              dexp(x,r)                   PDF f (x) for X ∼ Expo(r)
            dgamma(x,a,r)               PDF f (x) for X ∼ Gamma(a, r)
            dlnorm(x,m,s)                PDF f (x) for X ∼ LN (m, s2 )
            dnorm(x,m,s)                  PDF f (x) for X ∼ N (m, s2 )
               dt(x,n)                       PDF f (x) for X ∼ tn
            dunif(x,a,b)                  PDF f (x) for X ∼ Unif(a, b)
           dweibull(x,a,b)             PDF f (x) for X ∼ Weibull(b−a , a)

There are commands that are completely analogous to pbinom, qbinom, and rbinom
for the other distributions appearing in the above table. For example, pnorm, qnorm,
and rnorm can be used to get the CDF, the quantiles, and random generation for
the Normal (note that the mean and standard deviation need to be provided as the
parameters, rather than the mean and variance).
For the Multinomial, dmultinom can be used for calculating the joint PMF and
rmultinom can be used for generating random vectors. For the Multivariate Nor-
mal, after installing and loading the mvtnorm package, dmvnorm can be used for
calculating the joint PDF and rmvnorm can be used for random generation.


C
Table of distributions



 Name         Param.                    PMF or PDF                        Mean           Variance

 Bernoulli       p        P (X = 1) = p, P (X = 0) = q                      p                  pq

                            n
                                 k n−k
 Binomial      n, p         k
                                 p q    , k ∈ {0, 1, . . . , n}            np                 npq

 FS              p                 pq k−1 , k ∈ {1, 2, . . . }             1/p                q/p2

 Geom            p                 pq k , k ∈ {0, 1, 2, . . . }            q/p                q/p2

                           r+k−1
                                         r k
 NBin           r, p        r−1
                                         p q , k ∈ {0, 1, 2, . . . }      rq/p              rq/p2

                            (wk)(n−k
                                  b
                                     )                                       nw                      µ
 HGeom        w, b, n          w+b     , k ∈ {0, 1, . . . , n}           µ = w+b      ( w+b−n
                                                                                        w+b−1
                                                                                              )µ(1 − n )
                              ( n )
                        (r+k−1
                          r−1 )(
                                 w+b−r−k
                                   w−r   )                                  rb        rb(w+b+1)(w−r+1)
 NHGeom       w, b, r                      , k ∈ {0, 1, . . . , b}                       (w+1)2 (w+2)
                              (w+b
                                w )
                                                                           w+1


                                e−λ λk
 Poisson         λ                k!
                                       , k ∈ {0, 1, 2, . . . }              λ                  λ

                                          1                                a+b              (b−a)2
 Uniform       a<b                       b−a
                                             , x ∈ (a, b)                   2                 12

                                                  2    2
 Normal        µ, σ 2                   √1 e−(x−µ) /(2σ )                   µ                  σ2
                                    σ     2π

                                                   2     2                       2             2
 Log-Normal    µ, σ 2     xσ
                               1
                               √
                                   2π
                                        e−(log x−µ) /(2σ ) , x > 0     θ = eµ+σ /2       θ2 (eσ − 1)

 Expo            λ                        λe−λx , x > 0                    1/λ                1/λ2

                                              γ
 Weibull       λ, γ                γλe−λx xγ−1 , x > 0                 µ = Γ(1+1/γ)
                                                                             λ1/γ
                                                                                        Γ(1+2/γ)
                                                                                          λ2/γ
                                                                                                 − µ2

 Gamma         a, λ        Γ(a)−1 (λx)a e−λx x−1 , x > 0                   a/λ                a/λ2

                         Γ(a+b) a−1                                                        µ(1−µ)
 Beta           a, b    Γ(a)Γ(b)
                                 x  (1 − x)b−1 , 0 < x < 1                    a
                                                                         µ = a+b           a+b+1


 Chi-Square      n              1
                           2n/2 Γ(n/2)
                                       xn/2−1 e−x/2 , x > 0                 n                 2n

                           Γ((n+1)/2)
 Student-t       n         √
                             nπΓ(n/2)
                                      (1 + x2 /n)−(n+1)/2               0 if n > 1       n
                                                                                        n−2
                                                                                              if n > 2




                                                                                                         605


Taylor & Francis
Taylor & Francis Group
http://taylorandfrancis.com


References



 [1] Donald J. Albers and Gerald L. Alexanderson. More Mathematical People:
     Contemporary Conversations. Academic Press, 1990.

 [2] Steve Brooks, Andrew Gelman, Galin Jones, and Xiao-Li Meng. Handbook of
     Markov Chain Monte Carlo. CRC Press, 2011.

 [3] Jian Chen and Jeffrey S. Rosenthal. Decrypting classical cipher text using
     Markov chain Monte Carlo. Statistics and Computing, 22(2):397–413, 2012.

 [4] William G. Cochran. The effectiveness of adjustment by subclassification in
     removing bias in observational studies. Biometrics, 1968.

 [5] Persi Diaconis. Statistical problems in ESP research. Science, 201(4351):131–
     136, 1978.

 [6] Persi Diaconis. The Markov chain Monte Carlo revolution. Bulletin of the
     American Mathematical Society, 46(2):179–205, 2009.

 [7] Persi Diaconis, Susan Holmes, and Richard Montgomery. Dynamical bias in
     the coin toss. SIAM Review, 49(2):211–235, 2007.

 [8] Bradley Efron and Ronald Thisted. Estimating the number of unseen species:
     How many words did Shakespeare know? Biometrika, 63(3):435, 1976.

 [9] Bradley Efron and Ronald Thisted. Did Shakespeare write a newly-discovered
     poem? Biometrika, 74:445–455, 1987.

[10] Andrew Gelman, John B. Carlin, Hal S. Stern, David B. Dunson, Aki Vehtari,
     and Donald B. Rubin. Bayesian Data Analysis. CRC Press, 2013.

[11] Andrew Gelman and Deborah Nolan. You can load a die, but you can’t bias a
     coin. The American Statistician, 56(4):308–311, 2002.

[12] Andrew Gelman, Boris Shor, Joseph Bafumi, and David K. Park. Red State,
     Blue State, Rich State, Poor State: Why Americans Vote the Way They Do
     (Expanded Edition). Princeton University Press, 2009.

[13] Gerd Gigerenzer and Ulrich Hoffrage. How to improve Bayesian reasoning with-
     out instruction: Frequency formats. Psychological Review, 102(4):684, 1995.

[14] Prakash Gorroochurn. Classic Problems of Probability. John Wiley & Sons,
     2012.

                                                                              607


608                                                                     References

[15] Richard Hamming. You and your research. IEEE Potentials, pages 37–40,
     October 1993.
[16] David P. Harrington. The randomized clinical trial. Journal of the American
     Statistical Association, 95(449):312–315, 2000.
[17] David J.C. MacKay. Information Theory, Inference, and Learning Algorithms.
     Cambridge University Press, 2003.
[18] Richard McElreath. Statistical Rethinking: A Bayesian Course with Examples
     in R and Stan. Chapman & Hall/CRC Press, 2015.
[19] Pierre Rémond de Montmort. Essay d’Analyse sur les Jeux de Hazard. Quilau,
     Paris, 1708.
[20] John Allen Paulos. Innumeracy: Mathematical Illiteracy and Its Consequences.
     Macmillan, 1988.
[21] Horst Rinne. The Weibull Distribution: A Handbook. CRC Press, 2008.
[22] James G. Sanderson. Testing ecological patterns. American Scientist, 88:332–
     339, 2000.
[23] Tom W. Smith, Peter Marsden, Michael Hout, and Jibum Kim. General so-
     cial surveys, 1972–2012. Sponsored by National Science Foundation. NORC,
     Chicago: National Opinion Research Center, 2013.
[24] Stephen M. Stigler.    Isaac Newton as a probabilist.    Statistical Science,
     21(3):400–403, 2006.
[25] Tom Stoppard. Rosencrantz & Guildenstern Are Dead. Samuel French, Inc.,
     1967.
[26] R.J. Stroeker. On the sum of consecutive cubes being a perfect square. Com-
     positio Mathematica, 97:295–307, 1995.
[27] Amos Tversky and Daniel Kahneman. Causal schemas in judgments under un-
     certainty. In Daniel Kahneman, Paul Slovic, and Amos Tversky, editors, Judg-
     ment under Uncertainty: Heuristics and Biases. Cambridge University Press,
     1982.
[28] Herbert S. Wilf. generatingfunctionology. A K Peters/CRC Press, 3rd edition,
     2005.
[29] Elizabeth Wrigley-Field. Length-biased sampling. Online article at https:
     //www.edge.org/response-detail/27022, 2017.
[30] Lisa Zyga. Why too much evidence can be a bad thing. Online article at
     https://phys.org/news/2016-01-evidence-bad.html, 2016.


Index


2D LOTUS, 324                              and Poisson, 181
2D Poisson process, 573                    conditional distribution given a
68-95-99.7% rule, 236                            sum, 133
                                           expectation of, 156
Adam’s law, 426                            MGF of, 281
adjusting for overcounting, 15             Normal approximation to,
aggregation of data, 76                          475
aperiodic Markov chain, 505                PMF of, 113
axioms of probability, 22                  sum of r.v.s, 131
                                           symmetry property of, 115
bank–post office story, 396                variance of, 174
Bayes’ billiards, 382                  binomial theorem, 16
Bayes’ rule, 53                        birth-death chain, 518
    coherency of, 67                   birthday problem, 12, 136
    four versions of, 316                  expected number of birthday
    odds form, 54                                matches, 166
    with extra conditioning, 60            Poisson approximation for,
Bayesian view of probability, 22,                179
        383                                with general probabilities, 43
Bernoulli distribution, 112                with near-birthdays counted as
    MGF of, 279                                  matches, 179
    sum of r.v.s, 131                  Bivariate Normal distribution, 337,
Bernoulli trial, 112                             433
Beta distribution, 380                     generation of, 342
    and the Binomial, 383                  joint PDF of, 374
    and the Gamma, 396                     parameters of, 338
    as the distribution of the order       sum and difference in, 341
        statistics of Uniforms,        Blissville, 242
        402                            Blotchville, 242, 393, 438
    expectation of, 397                Bobo the amoeba, 71
    PDF of, 397                        Bonferroni’s inequality, 165
    simulation of, 539                 Boole’s inequality, 165
Beta-Binomial distribution, 398        Bose-Einstein, 18
binary entropy function, 186           bound on a probability, 457
binomial coefficient, 15               bounds on a Normal tail probability
Binomial distribution, 112                       example, 466
    and Beta, 383                      Box-Muller transformation, 373
    and Hypergeometric, 118, 133       branching process, 71

                                                                              609


610                                                                        Index

bus waiting time example, 242               given an event, 416
                                            given an r.v., 425
capture-recapture, 117, 134                 projection interpretation, 429
cardinality of a set, 583                   properties of, 426
cars on a highway example, 571              taking out what’s known, 426
category error, 127, 436                conditional independence
Cauchy distribution, 320, 371, 476          does not imply independence, 65,
Cauchy-Schwarz inequality, 458                   133
CDF, see cumulative distribution            given an event vs. given the
         function                                complement, 65
central limit theorem, 471                  is not implied by independence, 66,
central moment, 272                              133
change of variables                         of events, 65
     in multiple dimensions, 372            of random variables, 132
     in one dimension, 369              conditional PDF, 313
     location-scale transformation      conditional PMF, 306
         example, 372                   conditional probability, 46
Chebyshev’s inequality, 465                 as a tool for computing probability,
Chernoff’s bound, 466                            54, 68
Chi-Square distribution, 477                as probability, 59
     as a Gamma, 477                        Bayes’ rule, see Bayes’ rule
     expectation of, 477                    coherence of, 67
     MGF of, 477                            conditioning on more than one
     PDF of, 370                                 event, 62
     variance of, 477                       conditioning on the first step,
chicken-egg story, 310, 552, 569                 71
class size paradox, 244                     conditioning on what you wish you
CLT, see central limit theorem                   knew, 68
code for communication across a noisy   conditional variance, 432
         channel, 185                   conditionitis example, 56
code-breaking example, 541              confounding variable, 76, 310
coin-tossing: waiting for HH vs. HT ,   conjugate prior, 383, 392, 544
         421                            contingency table, 308
coloring of a Poisson process, 570      continuity correction, 475
committee-choosing example, 15          continuous random variable, 213
communicating over a noisy channel,     convex function, 461, 588
         185                            convolution, 376
competing risks example, 566                of Bernoullis, 131
complement, 582                             of Binomials, 131
compound interest formula, 589              of Discrete Uniforms, 109
concave function, 461, 588                  of Exponentials, 378, 390
conditional expectation, 415                of Gammas, 392
     Adam’s law, 427                        of Geometrics, 161
     dropping what’s independent,           of Normals, 287
         426                                of Poissons, 181, 287
```
