# Chapter 11: Markov Chains

**Book:** Introduction to Probability, Second Edition  
**Authors:** Joseph K. Blitzstein and Jessica Hwang  
**Printed pages:** 499–532

> Source transcription from the supplied textbook PDF. Text extraction preserves the original order and page content as far as the PDF text layer allows. Check mathematical notation and figure references against the source where extraction is ambiguous.

```text
Markov chains                                                                        513

It is not clear that a unique stationary distribution exists for this chain, since it may
not be irreducible and aperiodic. Even if it is irreducible and aperiodic, convergence
to the stationary distribution could be very slow since the web is so immense. To
address these issues, suppose that before each move, the web surfer flips a coin
with probability α of Heads. If Heads, the web surfer clicks a random link from the
current page; if Tails, the web surfer teleports to a uniformly random page. The
resulting chain has the Google transition matrix

                                                    J
                                G = αQ + (1 − α)      ,
                                                    M

where J is the M by M matrix of all 1’s. Note that the row sums of G are 1 and
that all entries are positive, so G is a valid transition matrix for an irreducible,
aperiodic Markov chain. This means there is a unique stationary distribution s,
called PageRank, and the chain will converge to it! The choice of α is an important
consideration; choosing α close to 1 makes sense to respect the structure of the
web as much as possible, but there is a tradeoff since it turns out that smaller
values of α make the chain converge much faster. As a compromise, the original
recommendation of Brin and Page was α = 0.85.

PageRank is conceptually nice, but computing it sounds extremely difficult, consid-
ering that sG = s could be a system of 100 billion equations in 100 billion unknowns.
Instead of thinking of this as a massive algebra problem, we can use the Markov
chain interpretation: for any starting distribution t, tGn → s as n → ∞. And tG is
easier to compute than it might seem at first:

                                              1−α
                              tG = α(tQ) +        (tJ),
                                               M

where computing the first term isn’t too hard since Q is very sparse (mostly 0’s) and
computing the second term is easy since tJ is a vector of all 1’s. Then tG becomes
the new t, and we can compute tG2 = (tG)G, etc., until the sequence appears to
have converged (though it is hard to know that it has converged). This gives an
approximation to PageRank, and has an intuitive interpretation as the distribution
of where the web surfer is after a large number of steps.




11.4    Reversibility

We have seen that the stationary distribution of a Markov chain is extremely useful
for understanding its long-run behavior. Unfortunately, in general it may be compu-
tationally difficult to find the stationary distribution when the state space is large.
This section addresses an important special case where working with eigenvalue
equations for large matrices can be avoided.


514                                                                 Introduction to Probability

Definition 11.4.1 (Reversibility). Let Q = (qij ) be the transition
                                                                  P        matrix of a
Markov chain. Suppose there is s = (s1 , . . . , sM ) with si ≥ 0, i si = 1, such that

                                        si qij = sj qji

for all states i and j. This equation is called the reversibility or detailed balance
condition, and we say that the chain is reversible with respect to s if it holds.
The term “reversible” comes from the fact that a reversible chain, started according
to its stationary distribution, behaves in the same way regardless of whether time
is run forwards or backwards. If you record a video of a reversible chain, started
according to its stationary distribution, and then show the video to a friend, either
in the normal way or with time reversed, your friend will not be able to determine
from watching the video whether time is running forwards or backwards.
As discussed after Definition 11.3.1, we can think about the stationary distribution
of a Markov chain intuitively in terms of a system consisting of a large number of
particles independently bouncing around according to the transition probabilities.
In the long run, the proportion of particles in any state j is the stationary probability
of state j, and the flow of particles out of state j is counterbalanced by the flow of
particles into state j. To see this in more detail, let n be the number of particles and
s be a probability vector such that sj is the current proportion of particles at state
j. By definition, s is the stationary distribution of the chain if and only if
                                 X                     X
                           sj =      si qij = sj qjj +    si qij ,
                                  i                        i:i6=j

for all states j. This equation can be rewritten as
                                               X
                              nsj (1 − qjj ) =   nsi qij .
                                                  i:i6=j

The left-hand side is the approximate number of particles that will exit from state
j on the next step, since there are nsj particles at state j, each of which will stay
at j with probability qjj and leave with probability 1 − qjj . The right-hand side is
the approximate number of particles that will enter state j on the next step, since
for each i 6= j there are nsi particles at state i, each of which will enter state j with
probability qij . So there is a balance between particles leaving state j and particles
entering state j.
The reversibility condition imposes a much more stringent form of balance, in which
for each pair of states i, j with i 6= j, the flow of particles from state i to state j is
counterbalanced by the flow of particles from state j to state i. To see this, write
the reversibility equation for states i and j as

                                      nsi qij = nsj qji .

The left-hand side is the approximate number of particles that will go from state
i to state j on the next step, since there are nsi particles at state i, each of which


Markov chains                                                                            515

has probability qij of going to state j. Similarly, the right-hand side is the approx-
imate number of particles that will go from state i to state j on the next step. So
reversibility says that there is a balance between particles going from state i to state
j, and particles going from state j to state i.
Given a transition matrix, if we can find a probability vector s that satisfies the
reversibility condition, then s is automatically a stationary distribution. This should
not be surprising, in light of the above discussion.
Proposition 11.4.2 (Reversible implies stationary). Suppose that Q = (qij ) is
the transition matrix of a Markov chain that is reversible with respect to a nonneg-
ative vector s = (s1 , . . . , sM ) whose components sum to 1. Then s is a stationary
distribution of the chain.

Proof. We have           X                X                 X
                               si qij =       sj qji = sj       qji = sj ,
                           i              i                 i

where the last equality is because each row sum of Q is 1. So s is stationary.            

This is a powerful result because it is often easier to verify the reversibility condition
than it is to solve the entire system of equations sQ = s. However, in general we
may not know in advance whether it is possible to find s satisfying the reversibility
condition, and even when it is possible, it may take a lot of effort to find an s that
works. In the remainder of this section, we look at three types of Markov chains
where it is possible to find an s that satisfies the reversibility condition. Such Markov
chains are called reversible.
First, if Q is a symmetric matrix, then the stationary distribution is uniform over
the state space: s = (1/M, 1/M, . . . , 1/M ). It is easy to see that if qij = qji , then the
reversibility condition si qij = sj qji is satisfied when si = sj for all i and j.
This is a special case of a more general fact, stated below: if each column of Q sums
to 1, then the stationary distribution is uniform over the state space.
Proposition 11.4.3. If each column of the transition matrix Q sums to 1, then
the uniform distribution over all states, (1/M, 1/M, . . . , 1/M ), is a stationary dis-
tribution. (A nonnegative matrix such that the row sums and the column sums are
all equal to 1 is called a doubly stochastic matrix.)

Proof. Assuming each column sums to 1, the row vector v = (1, 1, . . . , 1) satisfies
vQ = v. It follows that (1/M, 1/M, . . . , 1/M ) is stationary.                    

Second, if the Markov chain is a random walk on an undirected network, then there
is a simple formula for the stationary distribution.


516                                                                 Introduction to Probability

Example 11.4.4 (Random walk on an undirected network). A network is a collec-
tion of nodes joined by edges; the network is undirected if edges can be traversed
in either direction, meaning there are no one-way streets. Suppose a wanderer ran-
domly traverses the edges of an undirected network. From a node i, the wanderer
randomly picks any of the edges at i, with equal probabilities, and then traverses the
chosen edge. For example, in the network shown below, from node 3 the wanderer
goes to node 1 or node 2, with probability 1/2 each.


                                                   5


                                      4
                                                       1


                                          2
                                                            3



The degree of a node is the number of edges attached to it, and the degree sequence
of a network with nodes 1, 2, . . . , n is the vector (d1 , . . . , dn ) listing all the degrees,
where dj is the degree of node j. An edge from a node to itself is allowed (such an
edge is called a self-loop), and counts 1 toward the degree of that node.
For example, the network above has degree sequence d = (4, 3, 2, 3, 2). Note that

                                          di qij = dj qji

for all i, j, since qij is 1/di if {i, j} is an edge and 0 otherwise, for i 6= j. Therefore,
by Proposition 11.4.2, the stationary distribution is proportional to the degree se-
quence. Intuitively, the nodes with the highest degrees are the most well-connected,
so it makes sense that the chain spends the most time in these states in the long
run. In the example above, this says that
                                                          
                                          4 3 2 3 2
                                  s=         , , , ,
                                          14 14 14 14 14

is the stationary distribution for the random walk.
Exercise 20 explores random walk on a weighted undirected network; each edge
has a weight assigned to it, and the wanderer chooses where to go from i with
probabilities proportional to the weights on the available edges. It turns out that
this is a reversible Markov chain. More surprisingly, every reversible Markov chain
can be represented as random walk on a weighted undirected network!              


Markov chains                                                                        517

Here is a concrete example of a random walk on an undirected network.
Example 11.4.5 (Knight on a chessboard). Consider a knight randomly moving
around on a 4 × 4 chessboard.


                           4




                           3




                           2




                           1


                               !   A!   !   B!   !   C!   !   D




The 16 squares are labeled in a grid, e.g., the knight is currently at the square B3,
and the upper left square is A4. Each move of the knight is an L-shaped jump:
the knight moves two squares horizontally followed by one square vertically, or vice
versa. For example, from B3 the knight can move to A1, C1, D2, or D4; from A4 it
can move to B2 or C3. Note that from a light square, the knight always moves to a
dark square and vice versa.
Suppose that at each step, the knight moves randomly, with each possibility equally
likely. This creates a Markov chain where the states are the 16 squares. Compute
the stationary distribution of the chain.
Solution:
There are only three types of squares on the board: 4 center squares, 4 corner
squares (such as A4), and 8 edge squares (such as B4; exclude corner squares from
being considered edge squares). We can consider the board to be an undirected
network where two squares are connected by an edge if they are accessible via a
single knight’s move. Then a center square has degree 4, a corner square has degree
2, and an edge square has degree 3, so their stationary probabilities are 4a, 2a, 3a
respectively for some a.
To find a, count the number of squares of each type to get 4a · 4 + 2a · 4 + 3a · 8 = 1,
giving a = 1/48. Thus, each center square has stationary probability 4/48 = 1/12,
each corner square has stationary probability 2/48 = 1/24, and each edge square
has stationary probability 3/48 = 1/16.                                               
Third and finally, if in each time period a Markov chain can only move one step to
the left, one step to the right, or stay in place, then it is called a birth-death chain.
All birth-death chains are reversible.


518                                                                     Introduction to Probability

Example 11.4.6 (Birth-death chain). A birth-death chain on states {1, 2, . . . , M }
is a Markov chain with transition matrix Q = (qij ) such that qij > 0 if |i − j| = 1
and qij = 0 if |i − j| ≥ 2. This says it’s possible to go one step to the left and
possible to go one step to the right (except at boundaries) but impossible to jump
further in one step. The name stems from applications to the growth or decline of
a population, where a step to the right is thought of as a birth and a step to the
left is thought of as a death in the population.
For example, the chain shown below is a birth-death chain if the labeled transitions
have positive probabilities, except for the loops from a state to itself, which are
allowed to have 0 probability.




         q(1,1)             q(2,2)                  q(3,3)              q(4,4)             q(5,5)

                  q(1,2)                 q(2,3)                q(3,4)             q(4,5)
           1                  2                       3                   4                  5
                  q(2,1)                 q(3,2)                q(4,3)             q(5,4)




We will now show that any birth-death chain is reversible, and construct the sta-
tionary distribution. Let s1 be a positive number, to be specified later. Since we
want s1 q12 = s2 q21 , let
                                  s2 = s1 q12 /q21 .
Then since we want s2 q23 = s3 q32 , let
                           s3 = s2 q23 /q32 = s1 q12 q23 /(q32 q21 ).
Continuing in this way, let
                                          s1 q12 q23 . . . qj−1,j
                                  sj =                             ,
                                         qj,j−1 qj−1,j−2 . . . q21
for all states j with 2 ≤ j ≤ M . Choose s1 so that the sj sum to 1. Then the chain
is reversible with respect to s, since qij = qji = 0 if |i − j| ≥ 2 and by construction
si qij = sj qji if |i − j| = 1. Thus, s is the stationary distribution.               
The Ehrenfest chain is a birth-death chain that can be used as a simple model
for the diffusion of gas molecules. The stationary distribution turns out to be a
Binomial distribution.
Example 11.4.7 (Ehrenfest). There are two containers with a total of M distin-
guishable particles. Transitions are made by choosing a random particle and moving
it from its current container into the other container. Initially, all of the particles are
in the second container. Let Xn be the number of particles in the first container at
time n, so X0 = 0 and the transition from Xn to Xn+1 is done as described above.
This is a periodic Markov chain with state space {0, 1, . . . , M }.


Markov chains                                                                          519




                                  Xn                M − Xn

As illustrated above, the first container has Xn particles and the second has M −Xn
particles. We will use the reversibility condition to show that s = (s0 , s1 , . . . , sM )
with
                                           M
                                         M     1
                                   si =
                                          i    2

is the stationary distribution. Note that this is the Bin(M, 1/2) PMF.

Let si be as claimed, and check that si qij = sj qji . If j = i + 1 (with i < M ), then

                       M                   M                M
                  M      1   M −i     M!       1   M −i     M −1    1
   si qij =                       =                     =               ,
                  i      2    M     (M − i)!i! 2    M         i     2
                       M                M             M
                  M      1   j      M!      1   j     M −1    1
   sj qji =                    =                  =               = si qij .
                  j      2   M   (M − j)!j! 2   M     j−1     2

By a similar calculation, if j = i − 1 (with i > 0), then si qij = sj qji . For all other
values of i and j, qij = qji = 0. Therefore, s is stationary.

The Binomial was a natural guess for the stationary distribution because after
running the Markov chain for a long time, each particle is about equally likely to be
in either container. However, the PMF does not converge to a Binomial since the
chain has period 2, with Xn guaranteed to be even when n is even, and odd when
n is odd.

Happily, it turns out that another interpretation of the stationary distribution re-
mains valid here: si is the long-run proportion of time that the chain spends in state
i. More precisely, letting Ik be the indicator of the chain being in state i at time k,
it can be shown that
                                        n−1
                                       1X
                                          Ik → s i
                                       n
                                        k=0

as n → ∞, with probability 1.                                                            


520                                                                Introduction to Probability




11.5    Recap

A Markov chain is a sequence of r.v.s X0 , X1 , X2 , . . . satisfying the Markov prop-
erty, which states that given the present, the past and future are conditionally
independent:

   P (Xn+1 = j|Xn = i, Xn−1 = in−1 , . . . , X0 = i0 ) = P (Xn+1 = j|Xn = i) = qij .

The transition matrix Q = (qij ) gives the probabilities of moving from any state to
any other state in one step. The ith row of the transition matrix is the conditional
PMF of Xn+1 given Xn = i. The nth power of the transition matrix gives the n-
step transition probabilities. If we specify initial conditions si = P (X0 = i) and let
s = (s1 , . . . , sM ), then the marginal PMF of Xn is sQn .
States of a Markov chain can be classified as recurrent or transient: recurrent if the
chain will return to the state over and over, and transient if it will eventually leave
forever. States can also be classified according to their periods; the period of state
i is the greatest common divisor of the numbers of steps it can take to return to i,
starting from i. A chain is irreducible if it is possible to get from any state to any
state in a finite number of steps, and aperiodic if each state has period 1.
A stationary distribution for a finite Markov chain is a PMF s such that sQ = s.
Under various conditions, the stationary distribution of a finite Markov chain exists
and is unique, and the PMF of Xn converges to s as n → ∞. If state i has stationary
probability si , then the expected time for the chain to return to i, starting from i,
is ri = 1/si .
If a PMF s satisfies the reversibility condition si qij = sj qji for all i and j, it
guarantees that s is a stationary distribution of the Markov chain with transition
matrix Q = (qij ). Markov chains for which there exists s satisfying the reversibility
condition are called reversible. We discussed three types of reversible chains:

   1. If the transition matrix is symmetric, then the stationary distribution is
      uniform over all states.
   2. If the chain is a random walk on an undirected network, then the stationary
      distribution is proportional to the degree sequence, i.e.,
                                              dj
                                        sj = P .
                                               i di


   3. If the chain is a birth-death chain, then the stationary distribution satisfies
                                        s1 q12 q23 . . . qj−1,j
                                sj =
                                       qj,j−1 qj−1,j−2 . . . q21
       for j > 1, where s1 is solved for at the end to make s1 + · · · + sM = 1.


Markov chains                                                                                                                                         521


        0.15




                                                                                                      What can
        0.10
  pmf




                                                                                                      happen?
        0.05
        0.00




               1   2   3   4   5           6   7   8   9   10

                                   state



               distributions                                               random variables                events                       numbers

 any distribution t for the                                     generate                                                      P
                                                                           X 0 , X1 , X2 , . . .         Xn = i                   P (Xn = i) = (tQn )i
       initial state
                                                                                                   (given this event, past
                                                                                                       and future are
                                                                                                       independent)




 stationary distribution s                                      generate                                                      P
                                                                           Y 0 , Y1 , Y2 , . . .         Yn = i                     P (Yn = i) = si
    for the initial state
                                                                                                   (given this event, past
                                                                                                       and future are
                                                                                                       independent)

                                                                                                                             converges to si as n ! 1



FIGURE 11.6
Given a transition matrix Q and a distribution t over the states, we can generate
a Markov chain X0 , X1 , . . . by choosing X0 according to t and then running the
chain according to the transition probabilities. An important event is Xn = i, the
event that the chain is visiting state i at time n. We can then find the PMF of Xn
in terms of Q and t, and (under conditions discussed in the chapter) the PMF will
converge to the stationary distribution s. If instead we start the chain out according
to s, then the chain will stay stationary forever.


Figure 11.6 compares two ways to run a Markov chain with transition matrix Q:
choosing the initial state according to an arbitrary distribution t over the states, or
choosing the initial state according to the stationary distribution s. In the former
case, the exact PMF after n steps can be found in terms of Q and t, and the PMF
converges to s (under some very general conditions discussed in this chapter). In
the latter case, the chain is stationary forever.




11.6                               R

Matrix calculations

Let’s do some calculations for the 4-state Markov chain in Example 11.1.5, as an
example of working with transition matrices in R. First, we need to specify the
transition matrix Q. This is done with the matrix command: we type in the entries


522                                                           Introduction to Probability

of the matrix, row by row, as a long vector, and then we tell R the number of rows
and columns in the matrix (nrow and ncol), as well as the fact that we typed in
the entries by row (byrow=TRUE):
Q <- matrix(c(1/3,1/3,1/3,0,
              0,0,1/2,1/2,
              0,1,0,0,
              1/2,0,0,1/2),nrow=4,ncol=4,byrow=TRUE)
To obtain higher order transition probabilities, we can multiply Q by itself repeat-
edly. The matrix multiplication command in R is %*% (not just *). So
Q2 <- Q %*% Q
Q3 <- Q2 %*% Q
Q4 <- Q2 %*% Q2
Q5 <- Q3 %*% Q2
produces Q2 through Q5 . If we want to know the probability of going from state 3
to state 4 in exactly 5 steps, we can extract the (3, 4) entry of Q5 :
Q5[3,4]
This gives 0.229, agreeing with the value 11/48 shown in Example 11.1.5.
To compute a power Qn without directly doing repeated matrix multiplications, we
can use the command Q %^% n after installing and loading the expm package. For
example, Q %^% 42 yields Q42 . By exploring the behavior of Qn as n grows, we can
see Theorem 11.3.6 in action (and get a sense of how long it takes for the chain to
get very close to its stationary distribution).
In particular, for n large each row of Qn is approximately (0.214, 0.286, 0.214, 0.286),
so this is approximately the stationary distribution. Another way to obtain the
stationary distribution numerically is to use
eigen(t(Q))
to compute the eigenvalues and eigenvectors of the transpose of Q; then the eigen-
vector corresponding to the eigenvalue 1 can be selected and normalized so that the
components sum to 1.


Gambler’s ruin

To simulate from the gambler’s ruin chain from Example 11.2.6, we start by deciding
the total amount of money N, the probability p of gambler A winning a given round,
and the number of time periods nsim that we wish to simulate.
N <- 10
p <- 1/2
nsim <- 80


Markov chains                                                                       523

Next, we allocate a vector of length nsim called x, which will store the values of the
Markov chain. For the initial condition, we set the first entry of x equal to 5; this
gives both gamblers $5 to start with.
x <- rep(0,nsim)
x[1] <- 5
Now we are ready to simulate the subsequent values of the Markov chain. This is
achieved with the following block of code, which we will explain step by step.
for (i in 2:nsim){
    if (x[i-1]==0 || x[i-1]==N){
        x[i] <- x[i-1]
    }
    else{
        x[i] <- x[i-1] + sample(c(1,-1), 1, prob=c(p,1-p))
    }
}
The first line and the outer set of braces constitute a for loop: for (i in 2:nsim)
means that all the code inside the for loop will be executed over and over, with the
value of i set to 2, then set to 3, then set to 4, all the way until i reaches the value
nsim. Each pass through the loop represents one step of the Markov chain.
Inside the for loop, we first check to see whether the chain is already at one of the
endpoints, 0 or N; we do this with an if statement. If the chain is already at 0 or N,
then we set its new value equal to its previous value, since the chain is not allowed
to escape 0 or N. Otherwise, if the chain is not at 0 or N, it is free to move left or
right. We use the sample command to move to the right 1 unit or to the left 1 unit,
with probabilities p and 1-p, respectively.
To see what path was taken by the Markov chain during our simulation, we can
plot the values of x as a function of time:
plot(x,type=‘l’,ylim=c(0,N))
You should see a path that starts at 5 and bounces up and down before being
absorbed into state 0 or state N.


Simulating from a finite-state Markov chain

With a few modifications, we can simulate from an arbitrary Markov chain on a
finite state space. For concreteness, we will illustrate how to simulate from the
4-state Markov chain in Example 11.1.5.
As above, we can type
Q <- matrix(c(1/3,1/3,1/3,0,
              0,0,1/2,1/2,


524                                                           Introduction to Probability

                 0,1,0,0,
                 1/2,0,0,1/2),nrow=4,ncol=4,byrow=TRUE)

to specify the transition matrix Q.

Next, we choose the number of states and the number of time periods to simulate,
we allocate space for the results of the simulation, and we choose initial conditions
for the chain. In this example, x[1] <- sample(1:M,1) says the initial distribution
of the chain is uniform over all states.

M <- nrow(Q)
nsim <- 10^4
x <- rep(0,nsim)
x[1] <- sample(1:M,1)

For the simulation itself, we again use sample to choose a number from 1 to M.
At time i, the chain was previously at state x[i-1], so we must use row x[i-1]
of the transition matrix to determine the probabilities of sampling 1, 2, . . . , M. The
notation Q[x[i-1],] denotes row x[i-1] of the matrix Q.

for (i in 2:nsim){
    x[i] <- sample(M, 1, prob=Q[x[i-1],])
}

Since we set nsim to a large number, it may be reasonable to believe that the
chain is close to stationarity during the latter portion of the simulation. To check
this, we eliminate the first half of the simulations to give the chain time to reach
stationarity:

x <- x[-(1:(nsim/2))]

We then use the table command to calculate the number of times the chain visited
each state; dividing by length(x) converts the counts into proportions. The result
is an approximation to the stationary distribution.

table(x)/length(x)

For comparison, the true stationary distribution of the chain is approximately
(0.214, 0.286, 0.214, 0.286). Is this close to what you obtained via simulation?




11.7    Exercises

Exercises marked with s have detailed solutions at http://stat110.net.


Markov chains                                                                                             525

        Markov property
   1.    s Let X0 , X1 , X2 , . . . be a Markov chain. Show that X0 , X2 , X4 , X6 , . . . is also a Markov
        chain, and explain why this makes sense intuitively.

   2.    s Let X0 , X1 , X2 , . . . be an irreducible Markov chain with state space {1, 2, . . . , M },
        M ≥ 3, transition matrix Q = (qij ), and stationary distribution s = (s1 , . . . , sM ). Let
        the initial state X0 follow the stationary distribution, i.e., P (X0 = i) = si .

        (a) On average, how many of X0 , X1 , . . . , X9 equal 3? (In terms of s; simplify.)

        (b) Let Yn = (Xn − 1)(Xn − 2). For M = 3, find an example of Q (the transition matrix
        for the original chain X0 , X1 , . . . ) where Y0 , Y1 , . . . is Markov, and another example of
        Q where Y0 , Y1 , . . . is not Markov. In your examples, make qii > 0 for at least one i and
        make sure it is possible to get from any state to any other state eventually.

   3.   A Markov chain has two states, A and B, with transitions as follows:


                                                              0.5


                              0.5              A                            B
                                                                 1



        Suppose we do not get to observe this Markov chain, which we’ll call X0 , X1 , X2 , . . . .
        Instead, whenever the chain transitions from A back to A, we observe a 0, and whenever
        it changes states, we observe a 1. Let the sequence of 0’s and 1’s be called Y0 , Y1 , Y2 , . . . .
        For example, if the X chain starts out as

                                            A, A, B, A, B, A, A, . . .

        then the Y chain starts out as
                                                0, 1, 1, 1, 1, 0, . . . .

        (a) Show that Y0 , Y1 , Y2 , . . . is not a Markov chain.

        (b) In Example 11.1.3, we dealt with a violation of the Markov property by enlarging
        the state space to incorporate second-order dependence. Show that such a trick will not
        work for Y0 , Y1 , Y2 , . . . . That is, no matter how large m is,

                           Zn = (Yn−m+1 , Yn−m+2 , . . . , Yn ), n = m − 1, m, . . .

        is still not a Markov chain.

   4.   There are three blocks, floating in a sea of lava. Label the blocks 1, 2, 3, from left to
        right. Mark the Kangaroo, a video game character, is standing on block 1. To reach
        safety, he must get to block 3. He can’t jump directly from block 1 to block 3; his only
        hope is to jump from block 1 to block 2, then jump from block 2 to block 3. Each time
        he jumps, he has probability 1/2 of success and probability 1/2 of “dying” by falling
        into the lava. If he “dies”, he starts again at block 1.
        Let J be the total number of jumps that Mark will make in order to get to block 3.
        (a) Find E(J), using the Markov property and conditional expectation.

        (b) Explain how this problem relates to a coin tossing problem from Chapter 9.


526                                                                              Introduction to Probability

       Stationary distribution
  5.    s Consider the Markov chain shown below, where 0 < p < 1 and the labels on the
       arrows indicate transition probabilities.

                                              p                         p

                                                            1-p
                                              1                         2
                                                            1-p


       (a) Write down the transition matrix Q for this chain.
       (b) Find the stationary distribution of the chain.
       (c) What is the limit of Qn as n → ∞?
  6.    s Consider the Markov chain shown below, where the state space is {1, 2, 3, 4} and the
       labels to the right of arrows indicate transition probabilities.


                                          1           0.5         3           0.25


                                        0.5 0.25                  0.75 0.75


                                    2              0.75           4           0.25



       (a) Write down the transition matrix Q for this chain.
       (b) Which states (if any) are recurrent? Which states (if any) are transient?
       (c) Find two different stationary distributions for the chain.
  7.    s Daenerys has three dragons: Drogon, Rhaegal, and Viserion. Each dragon indepen-
       dently explores the world in search of tasty morsels. Let Xn , Yn , Zn be the locations at
       time n of Drogon, Rhaegal, Viserion respectively, where time is assumed to be discrete
       and the number of possible locations is a finite number M . Their paths X0 , X1 , X2 , . . . ;
       Y0 , Y1 , Y2 , . . . ; and Z0 , Z1 , Z2 , . . . are independent Markov chains with the same station-
       ary distribution s. Each dragon starts out at a random location generated according to
       the stationary distribution.
       (a) Let state 0 be home (so s0 is the stationary probability of the home state). Find
       the expected number of times that Drogon is at home, up to time 24, i.e., the expected
       number of how many of X0 , X1 , . . . , X24 are state 0 (in terms of s0 ).
       (b) If we want to track all 3 dragons simultaneously, we need to consider the vector
       of positions, (Xn , Yn , Zn ). There are M 3 possible values for this vector; assume that
       each is assigned a number from 1 to M 3 , e.g., if M = 2 we could encode the states
       (0, 0, 0), (0, 0, 1), (0, 1, 0), . . . , (1, 1, 1) as 1, 2, 3, . . . , 8 respectively. Let Wn be the num-
       ber between 1 and M 3 representing (Xn , Yn , Zn ). Determine whether W0 , W1 , . . . is a
       Markov chain.
       (c) Given that all 3 dragons start at home at time 0, find the expected time it will take
       for all 3 to be at home again at the same time.


Markov chains                                                                                        527

   8.   Consider the following Markov chain with 52! ≈ 8 × 1067 states. The states are the
        possible orderings of a standard 52-card deck. To run one step of the chain, pick 2
        different cards from the deck, with all pairs equally likely, and swap the 2 cards. Find
        the stationary distribution of the chain.


        Reversibility
   9.    s A Markov chain X0 , X1 , . . . with state space {−3, −2, −1, 0, 1, 2, 3} proceeds as fol-
        lows. The chain starts at X0 = 0. If Xn is not an endpoint (−3 or 3), then Xn+1 is
        Xn − 1 or Xn + 1, each with probability 1/2. Otherwise, the chain gets reflected off the
        endpoint, i.e., from 3 it always goes to 2 and from −3 it always goes to −2. A diagram
        of the chain is shown below.


               -3           -2          -1             0         1            2       3


        (a) Is |X0 |, |X1 |, |X2 |, . . . also a Markov chain? Explain.
        Hint: For both (a) and (b), think about whether the past and future are conditionally
        independent given the present; don’t do calculations with a 7 by 7 transition matrix!
        (b) Let sgn be the sign function: sgn(x) = 1 if x > 0, sgn(x) = −1 if x < 0, and
        sgn(0) = 0. Is sgn(X0 ), sgn(X1 ), sgn(X2 ), . . . a Markov chain? Explain.
        (c) Find the stationary distribution of the chain X0 , X1 , X2 , . . . .
        (d) Find a simple way to modify some of the transition probabilities qij for i ∈ {−3, 3}
        to make the stationary distribution of the modified chain uniform over the states.
  10.    s Let G be an undirected network with nodes labeled 1, 2, . . . , M (edges from a node
        to itself are not allowed), where M ≥ 2 and random walk on this network is irreducible.
        Let dj be the degree of node j for each j. Create a Markov chain on the state space
        1, 2, . . . , M , with transitions as follows. From state i, generate a proposal j by choosing
        a uniformly random j such that there is an edge between i and j in G; then go to j
        with probability min(di /dj , 1), and stay at i otherwise.
        (a) Find the transition probability qij from i to j for this chain, for all states i, j.
        (b) Find the stationary distribution of this chain.
  11.    s (a) Consider a Markov chain on the state space {1, 2, . . . , 7} with the states arranged
        in a “circle” as shown below, and transitions given by moving one step clockwise or
        counterclockwise with equal probabilities. For example, from state 6, the chain moves
        to state 7 or state 5 with probability 1/2 each; from state 7, the chain moves to state 1
        or state 6 with probability 1/2 each. The chain starts at state 1.

                                                   5
                                                                  6


                                       4


                                                                          7


                                       3


                                                                  1
                                                   2


528                                                                              Introduction to Probability

        Find the stationary distribution of this chain.

        (b) Consider a new chain obtained by “unfolding the circle”. Now the states are arranged
        as shown below. From state 1 the chain always goes to state 2, and from state 7 the
        chain always goes to state 6. Find the new stationary distribution.

             1              2               3              4              5              6               7



  12.    s Let Xn be the price of a certain stock at the start of the nth day, and assume that
        X0 , X1 , X2 , . . . follows a Markov chain with transition matrix Q. (Assume for simplicity
        that the stock price can never go below 0 or above a certain upper bound, and that it
        is always rounded to the nearest dollar.)

        (a) A lazy investor only looks at the stock once a year, observing the values on days
        0, 365, 2 · 365, 3 · 365, . . . . So the investor observes Y0 , Y1 , . . . , where Yn is the price after
        n years (which is 365n days; you can ignore leap years). Is Y0 , Y1 , . . . also a Markov
        chain? Explain why or why not; if so, what is its transition matrix?

        (b) The stock price is always an integer between $0 and $28. From each day to the next,
        the stock goes up or down by $1 or $2, all with equal probabilities (except for days when
        the stock is at or near a boundary, i.e., at $0, $1, $27, or $28).
        If the stock is at $0, it goes up to $1 or $2 on the next day (after receiving government
        bailout money). If the stock is at $28, it goes down to $27 or $26 the next day. If the
        stock is at $1, it either goes up to $2 or $3, or down to $0 (with equal probabilities);
        similarly, if the stock is at $27 it either goes up to $28, or down to $26 or $25. Find the
        stationary distribution of the chain.
  13.    s In chess, the king can move one square at a time in any direction (horizontally,
        vertically, or diagonally).




        For example, in the diagram, from the current position the king can move to any of 8
        possible squares. A king is wandering around on an otherwise empty 8 × 8 chessboard,
        where for each move all possibilities are equally likely. Find the stationary distribution
        of this chain (of course, don’t list out a vector of length 64 explicitly! Classify the 64
        squares into types and say what the stationary probability is for a square of each type).
  14.   A chess piece is wandering around on an otherwise vacant 8 × 8 chessboard. At each
        move, the piece (a king, queen, rook, bishop, or knight) chooses uniformly at random
        where to go, among the legal choices (according to the rules of chess, which you should
        look up if you are unfamiliar with them).
        (a) For each of these cases, determine whether the Markov chain is irreducible, and
        whether it is aperiodic.


Markov chains                                                                                        529

        Hint for the knight: Note that a knight’s move always goes from a light square to a dark
        square or vice versa. A knight’s tour is a sequence of knight moves on a chessboard such
        that the knight visits each square exactly once. Many knight’s tours exist.
        (b) Suppose for this part that the piece is a rook, with initial position chosen uniformly
        at random. Find the distribution of where the rook is after n moves.
        (c) Now suppose that the piece is a king, with initial position chosen deterministically
        to be the upper left corner square. Determine the expected number of moves it takes
        the king to return to that square, fully simplified, preferably in at most 140 characters.
        (d) The stationary distribution for the random walk of the king from the previous part
        is not uniform over the 64 squares of the chessboard. A recipe for modifying the chain to
        obtain a uniform stationary distribution is as follows. Label the squares as 1, 2, . . . , 64,
        and let di be the number of legal moves from square i. Suppose the king is currently at
        square i. The next move of the chain is determined as follows:
        Step 1: Generate a proposal square j by picking uniformly at random among the legal
        moves from i.
        Step 2: Flip a coin with probability min(di /dj , 1) of Heads. If the coin lands Heads, go
        to j. Otherwise, stay at i.
        Show that this modified chain has a stationary distribution that is uniform over the 64
        squares.
  15.   s Find the stationary distribution of the Markov chain shown below, without using
        matrices. The number above each arrow is the corresponding transition probability.

                                                      5/12                   7/12         7/8

                         1                  1/2                      1/3            1/4
               1                   2                     3                    4           5
                        1/2                 1/4                      1/6            1/8



  16.   There are two urns with a total of 2N distinguishable balls. Initially, the first urn has
        N white balls and the second urn has N black balls. At each stage, we pick a ball at
        random from each urn and interchange them. Let Xn be the number of black balls in
        the first urn at time n. This is a Markov chain on the state space {0, 1, . . . , N }.
        (a) Give the transition probabilities of the chain.
        (b) Show that (s0 , s1 , . . . , sN ) where
                                                             N     N
                                                                        
                                                             i    N −i
                                                  si =           2N
                                                                    
                                                                 N

        is the stationary distribution, by verifying the reversibility condition.
  17.   Find the stationary distribution of a Markov chain X0 , X1 , X2 , . . . on the state space
        {0, 1, . . . , 110}, with transition probabilities given by
                              P (Xn+1 = j|Xn = 0) = p, for j = 1, 2, . . . , 110;

                              P (Xn+1 = 0|Xn = 0) = 1 − 110p;

                              P (Xn+1 = j|Xn = j) = 1 − r, for j = 1, 2, . . . , 110;

                              P (Xn+1 = 0|Xn = j) = r, for j = 1, 2, . . . , 110,
                                                  1
        where p and r are constants with 0 < p < 110 and 0 < r < 1.


530                                                                                                   Introduction to Probability

  18.   Determine whether the Markov chain shown below is reversible, and find the stationary
        distribution of the chain. The label to the left of an arrow gives the corresponding
        transition probability.


                                              0.2


                                                          1

                                 0.2                                          0.2
                                                    0.4        0.4



                                              2                           3

                      0.2       0.4                                                                           0.2
                                        0.4                         0.4                     0.4
                                                     0.2                        0.2


                            4                 5                           6                       7


                0.8               0.8                         0.8                     0.8



  19.   Nausicaa Distribution sells distribution plushies on Etsy. They have two different photos
        of the Evil Cauchy plushie but do not know which is more effective in getting a customer
        to purchase an Evil Cauchy plushie. Each visitor to their website is shown one of the
        two photos (call them Photo A and Photo B), and then the visitor either does buy an
        Evil Cauchy (“success”) or does not buy one (“failure”).
        Let a and b be the probabilities of success when Photo A is shown and when Photo B is
        shown, respectively. Even though the Evil Cauchy is irresistible, suppose that 0 < a < 1
        and 0 < b < 1. Suppose that the following strategy is followed (note that the strategy
        can be followed without knowing a and b). Show the first visitor Photo A. If that visitor
        buys an Evil Cauchy, continue with Photo A for the next visitor; otherwise, switch to
        Photo B. Similarly, if the nth visitor is a “success” then show the (n + 1)st visitor the
        same photo, and otherwise switch to the other photo.
        (a) Show how to represent the resulting process as a Markov chain, drawing a diagram
        and giving the transition matrix. The states are A1, B1, A0, B0 (use this order for the
        transition matrix and stationary distribution), where, for example, being at state A1
        means that the current visitor was shown Photo A and was a success.
        (b) Determine whether this chain is reversible.
        Hint: First think about which transition probabilities are zero and which are nonzero.
                                                                                      
                                                                         a    b
        (c) Show that the stationary distribution is proportional to 1−a   , 1−b , 1, 1 , and find
        the stationary distribution.
        (d) Show that for a 6= b, the stationary probability of success for each visitor is strictly
        better than the success probability that would be obtained by independently, randomly
        choosing (with equal probabilities) which photo to show to each visitor.
  20.   This exercise considers random walk on a weighted undirected network. Suppose that
        an undirected network is given, where each edge (i, j) has a nonnegative weight wij
        assigned to it (we allow i = j as a possibility). We assume that wij = wji since the edge
        from i to j is considered the same as the edge from j to i. To simplify notation, define
        wij = 0 whenever (i, j) is not an edge.


Markov chains                                                                                        531

        When at node i, the next step is determined by choosing an edge attached to i with
        probabilities proportional to the weights. For example, if the walk is at node 1 and there
        are 3 possible edges coming out from node 1, with weights 7, 1, 4, then the first of these 3
        edges is traversed with probability 7/12, the second is traversed with probability 1/12,
        and the third is traversed with probability 4/12. If all the weights equal 1, then the
        process reduces to the kind of random walk on a network that we studied earlier.
                      P
        (a) Let vi = j wij for all nodes i. Show that the stationary distribution of node i is
        proportional to vi .
        (b) Show that every reversible Markov chain can be represented as a random walk on
        a weighted undirected network. That is, given the transition matrix Q of a reversible
        Markov chain, show that we can choose the weights wij so that the random walk defined
        above is a Markov chain with transition matrix Q. Be sure to check that wij = wji .
        Hint: Let wij = si qij , with s the stationary distribution and qij the (i, j) entry of Q.


        Mixed practice
  21.    s A cat and a mouse move independently back and forth between two rooms. At each
        time step, the cat moves from the current room to the other room with probability 0.8.
        Starting from room 1, the mouse moves to Room 2 with probability 0.3 (and remains
        otherwise). Starting from room 2, the mouse moves to room 1 with probability 0.6 (and
        remains otherwise).
        (a) Find the stationary distributions of the cat chain and of the mouse chain.
        (b) Note that there are 4 possible (cat, mouse) states: both in room 1, cat in room
        1 and mouse in room 2, cat in room 2 and mouse in room 1, and both in room 2.
        Number these cases 1, 2, 3, 4, respectively, and let Zn be the number representing the
        (cat, mouse) state at time n. Is Z0 , Z1 , Z2 , . . . a Markov chain?
        (c) Now suppose that the cat will eat the mouse if they are in the same room. We wish
        to know the expected time (number of steps taken) until the cat eats the mouse for two
        initial configurations: when the cat starts in room 1 and the mouse starts in room 2,
        and vice versa. Set up a system of two linear equations in two unknowns whose solution
        is the desired values.
  22.   (a) Alice and Bob are wandering around randomly, independently of each other, in a
        house with M rooms, labeled 1, 2, . . . , M . Let di be the number of doors in room i
        (leading to other rooms, not leading outside). At each step, Alice moves to another
        room by choosing randomly which door to go through (with equal probabilities). Bob
        does the same, independently. The Markov chain they each follow is irreducible and
        aperiodic. Let An and Bn be Alice’s room and Bob’s room at time n, respectively, for
        n = 0, 1, 2, . . . .
        Find lim P (An = i, Bn = j).
             n→∞

        (b) With setup as in (a), let pij be the transition probability for going from room i to
        room j. Let tik be the expected first time at which Alice and Bob are in the same room,
        if Alice starts in room i and Bob starts in room k (note that tik = 0 for i = k).
        Provide a system of linear equations, the solution of which would yield tik for all rooms
        i, k.
        Hint: Condition on Alice’s first move and Bob’s first move.
  23.   Let {Xn } be a Markov chain on states {0, 1, 2} with transition matrix
                                                            
                                             0.8 0.2      0
                                     Q= 0         0.8 0.2  .
                                              0      0    1


532                                                                              Introduction to Probability

        The chain starts at X0 = 0. Let T be the time it takes to reach state 2:
                                           T = min{n : Xn = 2}.
        By drawing the Markov chain and telling a story, find E(T ) and Var(T ).
  24.   Consider the following Markov chain on the state space {1, 2, 3, 4, 5, 6}.

                                                             0.5


                                   0.5             1                       2
                                                              0.5


                                                               0.5

                                                             0.3


                                   0.5             3                       4
                                                              0.3

                                            0.2        0.2          0.7        0.7


                                                   5                       6

                                             0.8                     0.3



        (a) Suppose the chain starts at state 1. Find the distribution of the number of times
        that the chain returns to state 1.
        (b) In the long run, what fraction of the time does the chain spend in state 3? Explain
        briefly.
  25.   Let Q be the transition matrix of a Markov chain on the state space {1, 2, . . . , M }, such
        that state M is an absorbing state, i.e., from state M the chain can never leave. Suppose
        that from any other state, it is possible to reach M (in some number of steps).
        (a) Which states are recurrent, and which are transient? Explain.
        (b) What is the limit of Qn as n → ∞?
        (c) For i, j ∈ {1, 2, . . . , M − 1}, find the probability that the chain is at state j at time
        n, given that the chain is at state i at time 0 (your answer should be in terms of Q).
        (d) For i, j ∈ {1, 2, . . . , M − 1}, find the expected number of times that the chain is at
        state j up to (and including) time n, given that the chain is at state i at time 0 (in
        terms of Q).
        (e) Let R be the (M − 1) × (M − 1) matrix obtained from Q by deleting the last row and
        the last column of Q. Show that the (i, j) entry of (I − R)−1 is the expected number of
        times that the chain is at state j before absorption, given that it starts out at state i.
        Hint: We have I + R + R2 + · · · = (I − R)−1 , analogously to a geometric series. Also, if
        we partition Q as                                 
                                                   R B
                                            Q=
                                                   0 1
        where B is a (M − 1) × 1 matrix and 0 is the 1 × (M − 1) zero matrix, then
                                              k          
                                         k       R     Bk
                                       Q =
                                                  0    1
        for some (M − 1) × 1 matrix Bk .


Markov chains                                                                                     533

  26.   In the game called Chutes and Ladders, players try to be first to reach a certain desti-
        nation on a board. The board is a grid of squares, numbered from 1 to the number of
        squares. The board has some “chutes” and some “ladders”, each of which connects a
        pair of squares. Here we will consider the one player version of the game (this can be ex-
        tended to the multi-player version without too much trouble, since with more than one
        player, the players simply take turns independently until one reaches the destination).
        On each turn, the player rolls a fair die, which determines how many squares forward
        to move on the grid, e.g., if the player is at square 5 and rolls a 3, then they advance
        to square 8. If the resulting square is the base of a ladder, the player gets to climb the
        ladder, instantly arriving at a more advanced square. If the resulting square is the top
        of a chute, the player instantly slides down to the bottom of the chute.
        This game can be viewed naturally as a Markov chain: given where the player currently
        is on the board, the past history does not matter for computing, for example, the
        probability of winning within the next 3 moves.
        Consider a simplified version of Chutes and Ladders, played on the 3 × 3 board shown
        below. The player starts out at square 1, and wants to get to square 9. On each move, a
        fair coin is flipped, and the player gets to advance 1 square if the coin lands Heads and 2
        squares if the coin lands Tails. However, there are 2 ladders (shown as upward-pointing
        arrows) and 2 chutes (shown as downward-pointing arrows) on the board.



                                     7           8            9


                                     6           5            4


                                     1           2            3


        (a) Explain why, despite the fact that there are 9 squares, we can represent the game
        using the 5 × 5 transition matrix
                                                                
                                           0  0.5 0.5     0    0
                                       0      0    0.5 0.5    0
                                                                
                                   Q=   0.5  0     0   0.5   0.
                                       0.5    0     0    0   0.5
                                           0   0     0    0    1


        (b) Find the mean and variance for the number of times the player will visit square 7,
        without using matrices or any messy calculations.

        The remaining parts of this problem require matrix calculations that are best done on
        a computer. You can use whatever computing environment you want, but here is some
        information for how to do it in R. In any case, you should state what environment
        you used and include your code. To create the transition matrix in R, you can use the
        following commands:

        a <- 0.5
        Q <- matrix(c(0,0,a,a,0,a,0,0,0,0,a,a,0,0,0,0,a,a,0,0,0,0,0,a,1),nrow=5)


534                                                                Introduction to Probability

      Some useful R commands for matrices are in Appendix B.2. In particular, diag(n) gives
      the n×n identity matrix, solve(A) gives the inverse A−1 , and A %*% B gives the product
      AB (note that A*B does not do ordinary matrix multiplication). Matrix powers are not
      built into R, but you can compute Ak using A %^% k after installing and loading the
      expm package.

      (c) Find the median duration of the game (where duration is the number of coin flips).
      Hint: Relate the CDF of the duration to powers of Q.

      (d) Find the mean duration of the game (with duration defined as above).
      Hint: Relate the duration to the total amount of time spent in transient states, and
      apply Part (e) of the previous problem.


12
Markov chain Monte Carlo



We have seen throughout this book that simulation is a powerful technique in
probability. If you can’t convince your friend that it is a good idea to switch doors
in the Monty Hall problem, in one second you can simulate playing the game a
few thousand times and your friend will just see that switching succeeds about 2/3
of the time. If you’re unsure how to calculate the mean and variance of an r.v. X
but you know how to generate i.i.d. draws X1 , X2 , . . . , Xn from that distribution,
you can approximate the true mean and true variance using the sample mean and
sample variance of the simulated draws:
                                  1
                           E(X) ≈   (X1 + · · · + Xn ) = X̄n ,
                                  n
                                         n
                                     1 X
                         Var(X) ≈           (Xj − X̄n )2 .
                                  n−1
                                           j=1

The law of large numbers tells us that these approximations will be good if n
is large. We can get better and better approximations by increasing n, just by
running the computer for a longer time (rather than having to struggle with a
possibly intractable sum or integral). As discussed in Chapter 10, this simulation
approach, where we generate random values to approximate a quantity, is called a
Monte Carlo method.
A major limitation of the Monte Carlo idea above is that we need to know how
to generate X1 , X2 , . . . , Xn (hopefully efficiently, since we want to be able to make
n large). For example, suppose that we want to simulate random draws from the
continuous distribution with PDF f given by

                                 f (x) ∝ x3.1 (1 − x)4.2

for 0 < x < 1 (and 0 otherwise). Staring at a density function does not immediately
suggest how to get a random variable with that density. In this case we recognize
the PDF of the Beta(4.1, 5.2) distribution, so assuming we had access to a Unif(0, 1)
r.v., we could theoretically use universality of the Uniform. Unfortunately, finding
the CDF of a Beta distribution is difficult, let alone the inverse of the CDF. See
Example 12.1.4 for more about the Beta simulation problem.
Of course, the distributions that arise in real-world applications are often much
more complicated than the Beta. For the Beta distribution, we know an expression
for the normalizing constant in terms of the gamma function. But for many other

                                                                                     535


536                                                          Introduction to Probability

distributions that are of scientific interest, the normalizing constant in the PDF or
PMF is unknown, and beyond the reach of the fastest available computers and the
fanciest available mathematical techniques.

This chapter introduces Markov chain Monte Carlo (MCMC), a powerful collec-
tion of algorithms that enable us to simulate from complicated distributions using
Markov chains. The development of MCMC has revolutionized statistics and scien-
tific computation by vastly expanding the range of possible distributions that we
can simulate from, including joint distributions in high dimensions. The basic idea is
to build your own Markov chain so that the distribution of interest is the stationary
distribution of the chain.

In the previous chapter, we looked at Markov chains whose transition matrix Q
was specified, and we tried to find the stationary distribution s of the chain. In this
chapter we do the reverse: starting with a distribution s that we want to simulate,
we will engineer a Markov chain whose stationary distribution is s. If we then run
this engineered Markov chain for a very long time, the distribution of the chain will
approach our desired s.

But is it possible to create a transition matrix Q with the stationary distribution
we desire? Even if it is possible, is solving this problem any easier than the origi-
nal problem of how to simulate random draws from that distribution? In amazing
generality, MCMC shows that it is possible to create a Markov chain with the de-
sired stationary distribution in an easy-to-describe way, without having to know the
normalizing constant for the distribution!

MCMC is now being applied to a large number of problems in the biological, natural,
and physical sciences, and many different MCMC algorithms have been developed.
Here we will introduce two of the most important and most widely used MCMC
algorithms: the Metropolis-Hastings algorithm and Gibbs sampling. MCMC is an
enormous and growing area of statistical computing; see Brooks, Gelman, Jones,
and Meng [2] for much more about its theory, methods, and applications.




12.1    Metropolis-Hastings

The Metropolis-Hastings algorithm is a general recipe that lets us start with any
irreducible Markov chain on the state space of interest and then modify it into a
new Markov chain that has the desired stationary distribution. This modification
consists of introducing some selectiveness in the original chain: moves are proposed
according to the original chain, but the proposal may or may not be accepted. For
example, suppose the original chain is at a state called “Boston” and is about to
transition to “San Francisco”. Then for the new chain, we either accept the proposal
and go to San Francisco, or we turn down the proposal and remain in Boston as


Markov chain Monte Carlo                                                              537

the next step. With a careful choice of the probability of accepting the proposal,
this simple modification guarantees that the new chain has the desired stationary
distribution.
Algorithm 12.1.1 (Metropolis-Hastings). Let s = (s1 , . . . , sM ) be a desired sta-
tionary distribution on state space {1, . . . , M }. Assume that si > 0 for all i (if not,
just delete any states i with si = 0 from the state space). Suppose that P = (pij )
is the transition matrix for a Markov chain on state space {1, . . . , M }. Intuitively,
P is a Markov chain that we know how to run but that doesn’t have the desired
stationary distribution.
Our goal is to modify P to construct a Markov chain X0 , X1 , . . . with stationary
distribution s. We will give a Metropolis-Hastings algorithm for this. Start at any
state X0 (chosen randomly or deterministically), and suppose that the new chain is
currently at Xn . To make one move of the new chain, do the following.

        1. If Xn = i, propose a new state j using the transition probabilities in
       the ith row of the original transition matrix P .
        2. Compute the acceptance probability
                                                    
                                            sj pji
                               aij = min           ,1 .
                                            si pij

        3. Flip a coin that lands Heads with probability aij .
       4. If the coin lands Heads, accept the proposal (i.e., go to j), setting
       Xn+1 = j. Otherwise, reject the proposal (i.e., stay at i), setting Xn+1 = i.

That is, the Metropolis-Hastings chain uses the original transition probabilities pij
to propose where to go next, then accepts the proposal with probability aij , staying
in its current state in the event of a rejection. An especially nice aspect of this
algorithm is that the normalizing constant for s does not need to be known, since it
cancels out in sj /si anyway. For example, in some problems we may want the sta-
tionary distribution to be uniform over all states (i.e., s = (1/M, 1/M, . . . , 1/M )),
but the number of states M is large and unknown, and it would be a very hard
counting problem to find M . Fortunately, sj /si = 1 regardless of M , so we can sim-
ply say s ∝ (1, 1, . . . , 1), and we can calculate aij without having to know M .
The pij in the denominator in aij will never be 0 when the algorithm is run, since if
pij = 0 then the original chain will never propose going from i to j. Also, if pii > 0 it
is possible that the proposal j will equal the current state i; in that case, the chain
stays at i regardless of whether the proposal is accepted. (Rejecting the proposal of
staying at i but staying there anyway is like a child who just got grounded saying
“yes, I will stay in my room, but not because you told me to!”)
We will now show that the Metropolis-Hastings chain is reversible with stationary
distribution s.


538                                                                      Introduction to Probability

Proof. Let Q be the transition matrix of the Metropolis-Hastings chain. We just
need to check the reversibility condition si qij = sj qji for all i and j. This is clear
for i = j, so assume i 6= j. If qij > 0, then pij > 0 (the chain can’t get from i to
j if it can’t even propose going from i to j) and pji > 0 (otherwise the acceptance
probability would be 0). Conversely, if pij > 0 and pji > 0, then qji > 0. So qij and
qji are either both zero or both nonzero. We can assume they are both nonzero.
Then
                                     qij = pij aij
since, starting at i, the only way to get to j is first to propose doing so and then to
accept the proposal. First consider the case sj pji ≤ si pij . We have
                                              sj pji
                                    aij =            , aji = 1,
                                              si pij
so
                                              sj pji
               si qij = si pij aij = si pij          = sj pji = sj pji aji = sj qji .
                                              si pij
Symmetrically, if sj pji > si pij , we again have si qij = sj qji , by switching the roles
of i and j in the preceding calculation. Since the reversibility condition holds, s is
the stationary distribution of the chain with transition matrix Q.                      
h 12.1.2. The Metropolis-Hastings algorithm is an extremely general way to con-
struct a Markov chain with a desired stationary distribution. In the above formula-
tion, both s and P were very general, and nothing was stipulated about their being
related (aside from being on the same state space). In practice, however, the choice
of the proposal distribution is extremely important since it can make an enormous
difference in how quickly the chain converges to its stationary distribution.
How to choose a good proposal distribution is a complicated topic and will not
be discussed in detail here. Intuitively, a proposal distribution with a very low
acceptance rate will be slow to converge (since the chain will rarely move anywhere).
But a high acceptance rate may not be ideal either, since it may indicate that the
chain tends to make small, timid proposals. In a large state space, such a chain will
take a very long time to explore the entire space.
Here are a couple examples of how the Metropolis-Hastings algorithm can be used
to simulate from distributions.
Example 12.1.3 (Zipf distribution simulation). Let M ≥ 2 be an integer. An
r.v. X has the Zipf distribution with parameter a > 0 if its PMF is
                                              1/k a
                                P (X = k) = PM          ,
                                                     a
                                             j=1 (1/j )

for k = 1, 2, . . . , M (and 0 otherwise). This distribution is widely used in linguistics
for studying frequencies of words.
Create a Markov chain X0 , X1 , . . . whose stationary distribution is the Zipf distri-
bution, and such that |Xn+1 − Xn | ≤ 1 for all n. Your answer should provide a


Markov chain Monte Carlo                                                            539

simple, precise description of how each move of the chain is obtained, i.e., how to
transition from Xn to Xn+1 for each n.
Solution:
We can use the Metropolis-Hastings algorithm, after coming up with a proposal
distribution. There are many possible proposal distributions, but one simple choice
is the following random walk on {1, 2, . . . , M }. From state i with i 6= 1, i 6= M ,
move to state i − 1 or i + 1, with probability 1/2 each. From state 1, stay there or
move to state 2, with probability 1/2 each. From state M , stay there or move to
state M − 1, with probability 1/2 each. This chain is shown below.


            1           2          3            ...          M–1          M


FIGURE 12.1
Proposal chain for Zipf distribution simulation.

Let P be the transition matrix of this chain. The stationary distribution for P is
uniform because P is a symmetric matrix, so Proposition 11.4.3 applies. Metropolis-
Hastings lets us transmogrify P into a chain whose stationary distribution is Zipf’s
distribution.
Let X0 be any starting state, and generate a chain X0 , X1 , . . . as follows. If the
chain is currently at state i, then:

       1. Generate a proposal state j according to the proposal chain P .
        2. Accept the proposal with probability min (ia /j a , 1). If the proposal is
       accepted, go to j; otherwise, stay at i.

This chain is easy to implement
                              Pand a move       requires very little computation; note
that the normalizing constant M j=1 (1/j a ) is not needed to run the chain.        
Example 12.1.4 (Beta simulation). Let us now return to the Beta simulation prob-
lem introduced at the beginning of the chapter. Suppose that we want to generate
W ∼ Beta(a, b), but we don’t know about the rbeta command in R. Instead, what
we have available are i.i.d. Unif(0, 1) r.v.s.
(a) How can we generate W exactly if a and b are positive integers, using a story
and universality of the Uniform?
(b) How can we generate W which is approximately Beta(a, b) if a and b are any
positive real numbers, with the help of a Markov chain on the state space (0, 1)?
Solution:
(a) Applying universality of the Uniform directly for the Beta is hard, so let’s first
use the bank–post office story: if X ∼ Gamma(a, 1) and Y ∼ Gamma(b, 1) are


540                                                           Introduction to Probability

independent, then X/(X + Y ) ∼ Beta(a, b). So if we can simulate the Gamma
distribution, then we can simulate the Beta distribution!

To simulate X ∼ Gamma(a, 1), we can use X1 + X2 + · · · + Xa with the Xj
i.i.d. Expo(1); similarly, we can simulate Y ∼ Gamma(b, 1) as the sum of b
i.i.d. Expo(1) r.v.s. Lastly, by taking the inverse of the Expo(1) CDF and applying
universality of the Uniform, − log(1 − U ) ∼ Expo(1) for U ∼ Unif(0, 1), so we can
easily construct as many Expo(1) r.v.s as we want.

(b) Let’s use the Metropolis-Hastings algorithm. We have only introduced
Metropolis-Hastings for finite state spaces, but the ideas are analogous for an infi-
nite state space. A simple proposal chain we have available consists of independent
Unif(0, 1) r.v.s. That is, the proposed state on the interval (0, 1) is always a fresh
Unif(0, 1), independent of the current state. The resulting Metropolis-Hastings chain
is called an independence sampler.

Let W0 be any starting state, and generate a chain W0 , W1 , . . . as follows. If the
chain is currently at state w, then:

        1. Generate a proposal u by drawing a Unif(0, 1) r.v.
                                                      a−1      b−1
                                                                       
        2. Accept the proposal with probability min wua−1 (1−u)
                                                           (1−w)b−1 , 1  . If the pro-
       posal is accepted, go to u; otherwise, stay at w.

Again, the normalizing constant was not needed in order to run the chain. In ob-
taining the acceptance probability, the Beta(a, b) PDF plays the role of s since it’s
the desired stationary distribution, and the Unif(0, 1) PDF plays the role of pij (and
pji ) since the proposals are Unif(0, 1) r.v.s, independent of the current state.

Running the Markov chain, we have that Wn , Wn+1 , Wn+2 , . . . are approximately
Beta(a, b) for n large. Note that these are correlated r.v.s., not i.i.d. draws. 

h 12.1.5 (MCMC produces correlated samples). A major question in running a
Markov chain X0 , X1 , . . . for a Monte Carlo computation is how long to run it. In
part, this is because it is usually hard to know how close the chain’s distribution at
time n will be to the stationary distribution. Another issue is that X0 , X1 , . . . are
correlated in general. Some chains tend to get stuck in certain regions of the state
space, rather than exploring the whole space. If a chain can get stuck easily, then Xn
may be highly positively correlated with Xn+1 . The autocorrelation at lag k is the
correlation between Xn and the value k steps later, Xn+k , in the limit as n grows.
It is desirable for the autocorrelation at lag k to approach 0 rapidly as k increases.
High autocorrelation tends to mean high variances for Monte Carlo approximations.

Analysis of how long to run a chain and finding diagnostics for whether the chain
has been run long enough are active research areas. Some general advice is to run
your chains for a very large number of steps and to try chains from diverse starting
points to see how stable the results are.


Markov chain Monte Carlo                                                          541

Metropolis-Hastings is often useful even for immense state spaces. It can even be
useful for problems that may not sound at first like they have anything to do with
simulating a distribution, such as code-breaking.
Example 12.1.6 (Code-breaking). Markov chains have recently been applied to
code-breaking; this example will introduce one way in which this can be done.
(For further information about such applications, see Diaconis [6] and Chen and
Rosenthal [3].) A substitution cipher is a permutation g of the letters from a to z,
where a message is enciphered by replacing each letter α by g(α). For example, if g
is the permutation given by
 abcdefghijklmnopqrstuvwxyz
 zyxwvutsrqponmlkjihgfedcba
where the second row lists the values g(a), g(b), . . . , g(z), then we would encipher
the word “statistics” as “hgzgrhgrxh”. (We could also include capital letters, spaces,
and punctuation marks if desired.) The state space is all 26! ≈ 4 · 1026 permutations
of the letters a through z. This is an extremely large space: if we had to try de-
coding a text using each of these permutations, and could handle one permutation
per nanosecond, it would still take over 12 billion years to work through all the
permutations. So a brute-force investigation that goes through each permutation
one by one is infeasible; instead, we will look at random permutations.
(a) Consider the Markov chain that picks two different random coordinates between
1 and 26 and swaps those entries of the 2nd row, e.g., if we pick 7 and 20, then
 abcdefghijklmnopqrstuvwxyz
 zyxwvutsrqponmlkjihgfedcba
becomes
 abcdefghijklmnopqrstuvwxyz
 zyxwvugsrqponmlkjihtfedcba
Find the probability of going from a permutation g to a permutation h in one step
(for all g, h), and find the stationary distribution of this chain.
(b) Suppose we have a system that assigns a positive “score” s(g) to each permu-
tation g. Intuitively, this could be a measure of how likely it would be to get the
observed enciphered text, given that g was the cipher used. Use the Metropolis-
Hastings algorithm to construct a Markov chain whose stationary distribution is
proportional to the list of all scores s(g).
Solution:
(a) The probability of going from g to h in one step is 0 unless h can be obtained
from g by swapping 2 entries of the second row. Assuming
                                                            that h can be obtained
                                 1                   26
in this way, the probability is 26 , since there are 2 such swaps, all equally likely.
                                (2)
This Markov chain is irreducible, since by performing enough swaps we can get
from any permutation to any other permutation. (Imagine rearranging a deck of


542                                                              Introduction to Probability

cards by swapping cards two at a time; it is possible to reorder the cards in any
desired configuration by doing this enough times.) Note that p(g, h) = p(h, g), where
p(g, h) is the transition probability of going from g to h. Since the transition matrix
is symmetric, the stationary distribution is uniform over all 26! permutations of the
letters a through z.

(b) For our proposal chain, we’ll use the chain from (a). Starting from any state
g, generate a proposal h using the chain from (a). Flip a coin with probability
min(s(h)/s(g), 1) of Heads. If Heads, go to h; if Tails, stay at g.
To prove this has the desired stationary distribution, we can appeal to our general
proof of Algorithm 12.1.1 or check the reversibility condition directly. For practice,
we’ll do the latter: we need s(g)q(g, h) = s(h)q(h, g) for all g and h, where q(g, h) is
the transition probability from g to h in the modified chain. If g = h or q(g, h) = 0,
then the equation clearly holds, so assume g 6= h and q(g, h) 6= 0. Let p(g, h) be the
transition probability from (a) (which is the probability of proposing h when at g).
First consider the case that s(g) ≤ s(h). Then q(g, h) = p(g, h) and

                                      s(g)           s(g)           s(g)
                  q(h, g) = p(h, g)        = p(g, h)      = q(g, h)      ,
                                      s(h)           s(h)           s(h)

so s(g)q(g, h) = s(h)q(h, g). Now consider the case that s(h) < s(g). By a symmetric
argument (reversing the roles of g and h), we again have s(g)q(g, h) = s(h)q(h, g).
Thus, the stationary probability of g is proportional to its score s(g).
In other words, using the Metropolis-Hastings algorithm, we started with a Markov
chain that was equally likely to visit all of the ciphers in the long run and created
a Markov chain whose stationary distribution sorts the ciphers according to their
scores, visiting the most promising ciphers the most often in the long run.        
Here is another MCMC example with an immense state space and which at first
sight might not seem to have much connection with simulating a distribution. This
example points to the fact that MCMC can be used not only for sampling but also
for optimization.
Example 12.1.7 (Knapsack problem). Bilbo the Burglar finds m treasures in
Smaug’s Lair. Bilbo is deciding which treasures to steal (or justly reclaim, depend-
ing on one’s point of view); he can’t take everything all at once, since the maximum
weight he can carry is w pounds. Label the treasures from 1 to m, and suppose
that the jth treasure is worth gj gold pieces and weighs wj pounds. So Bilbo must
choose a vector x = (x1 , . . . , xm ), where xj is 1 if he steals the jth treasure and 0
otherwise, such that the total weight of the treasures j with xj = 1 is at most w. Let
C be Pthe space of all such vectors, so C consists of all binary vectors (x1 , . . . , xm )
with m  j=1 xj wj ≤ w.

Bilbo wishes to maximize the total worth of the treasure he takes. Finding an
optimal solution is an extremely difficult problem, known as the knapsack problem,
which has a long history in computer science. A brute force solution would be


Markov chain Monte Carlo                                                                543

completely infeasible in general. Bilbo decides instead to explore the space C using
MCMC—luckily, he has a laptop running R with him.
(a) Consider the following Markov chain. Start at (0, 0, . . . , 0). One move of the
chain is as follows. Suppose the current state is x = (x1 , . . . , xm ). Choose a uniformly
random J in {1, 2, . . . , m}, and obtain y from x by replacing xJ with 1 − xJ (i.e.,
toggle whether that treasure will be taken). If y is not in C, stay at x; if y is in C,
move to y. Show that the uniform distribution over C is stationary for this chain.

(b) Show that the chain from (a) is irreducible, and that it may or may not be
aperiodic (depending on w, w1 , . . . , wm ).

(c) The chain from (a) is a useful way to get approximately uniform solutions, but
Bilbo is more interested in finding solutions where the value (in gold pieces) is high.
In this part, the goal is to construct a Markov chain with a stationary distribution
that puts much higher probability on any particular high-value solution than on any
particular low-value solution. Specifically, suppose that we want to simulate from
the distribution
                                      s(x) ∝ eβV (x) ,
                P
where V (x) = m   j=1 xj gj is the value of x in gold pieces and β is a positive constant.
The idea behind this distribution is to give exponentially more probability to each
high-value solution than to each low-value solution. Create a Markov chain whose
stationary distribution is as desired.
Solution:
(a) The transition matrix is symmetric since for x 6= y, the transition probabilities
from x to y and from y to x are either both 0 or both 1/m. So the stationary
distribution is uniform over C.
(b) We can go from any x ∈ C to (0, 0, . . . , 0) by dropping treasures one at a time.
We can go from (0, 0, . . . , 0) to any y ∈ C by picking up treasures one at a time.
Combining these, we can go from anywhere to anywhere, so the chain is irreducible.
To study periodicity, let’s look at some simple cases. First consider the simple case
where w1 + · · · + wm < w, i.e., Bilbo can carry all the treasure at the same time.
Then all binary vectors of length m are allowed. So the period of (0, 0, . . . , 0) is 2
since, starting at that state, Bilbo needs to pick up and then put down a treasure
in order to get back to that state. In fact, if Bilbo starts at (0, 0, . . . , 0), after any
odd number of moves he will be carrying an odd number of treasures.
Now consider the case where w1 > w, i.e., the first treasure is too heavy for Bilbo.
From any x ∈ C, there is a 1/m chance that the chain will try to pick up the first
treasure, and if that happens, the chain will stay at x. So the period of each state
is 1.
(c) We can apply Metropolis-Hastings using the chain from (a) to make proposals.
Start at (0, 0, . . . , 0). Suppose the current state is x = (x1 , . . . , xm ). Then:


544                                                           Introduction to Probability

        1. Choose a uniformly random J in {1, 2, . . . , m}, and obtain y from x
       by replacing xJ with 1 − xJ .

        2. If y is not in C, stay at x. If y is in C, flip a coin that lands Heads
       with probability min 1, eβ(V (y)−V (x)) . If the coin lands Heads, go to y;
       otherwise, stay at x.


This chain will converge to the desired stationary distribution. But how should β
be chosen? If β is very large, then the best solutions are given very high probability,
but the chain may be very slow to converge to the stationary distribution since it
can easily get stuck in local modes: the chain may find itself in a state which, while
not globally optimal, is still better than the other states that can be reached in one
step, and then the probability of rejecting proposals to go elsewhere may be very
high. On the other hand, if β is close to 0, then it’s easy for the chain to explore the
space, but there isn’t as much incentive for the chain to uncover good solutions.

An optimization technique called simulated annealing avoids having to choose one
value of β. Instead, one specifies a sequence of β values, such that β gradually
increases over time. At first, β is small and the space C can be explored broadly.
As β gets larger and larger, the stationary distribution becomes more and more
concentrated on the best solution or solutions. The name “simulated annealing”
comes from an analogy with the annealing of metals, a process in which a metal
is heated to a high temperature and then gradually cooled until it reaches a very
strong, stable state; β corresponds to the reciprocal of temperature.           

As mentioned in Example 12.1.4, the Metropolis-Hastings algorithm can also be
applied in a continuous state space, using PDFs instead of PMFs. This is extremely
useful in Bayesian inference, where we often want to study the posterior distribution
of an unknown parameter. This posterior distribution may be very complicated to
work with analytically, and may have an unknown normalizing constant.

The MCMC approach is to obtain a large number of draws from a Markov chain
whose stationary distribution is the posterior distribution. We can then use these
draws to approximate the true posterior distribution. For example, we can estimate
the posterior mean using the sample mean of these draws, and the posterior median
using the sample median of the draws.

Gelman et al. [10] and McElreath [18] provide extensive introductions to Bayesian
thinking and Bayesian data analysis, with wide ranges of applications and emphasis
on statistical modeling and simulation. Various supplementary materials for these
two books can be found at http://www.stat.columbia.edu/~gelman/book and
https://xcelab.net/rm/statistical-rethinking respectively.

Example 12.1.8 (Normal-Normal conjugacy). Let Y |θ ∼ N (θ, σ 2 ), where σ 2 is
known but θ is unknown. Using the Bayesian framework, we treat θ as a random
variable, with prior given by θ ∼ N (µ, τ 2 ) for some known constants µ and τ 2 . That


Markov chain Monte Carlo                                                           545

is, we have the two-level model

                                         θ ∼ N (µ, τ 2 )
                                      Y |θ ∼ N (θ, σ 2 ).

Describe how to use the Metropolis-Hastings algorithm to find the posterior mean
and variance of θ after observing the value of Y .

Solution:

After observing Y = y, we can update our prior uncertainty for θ using Bayes’ rule.
Because we are interested in the posterior distribution of θ, any terms not depending
on θ can be treated as part of the normalizing constant. Thus,
                                                       1       2    1        2
                 fθ|Y (θ|y) ∝ fY |θ (y|θ)fθ (θ) ∝ e− 2σ2 (y−θ) e− 2τ 2 (θ−µ) .

Since we have a quadratic function of θ in the exponent, we recognize the posterior
PDF of θ as a Normal PDF. The posterior distribution stays in the Normal family,
which tells us that the Normal is the conjugate prior of the Normal. In fact, by
completing the square (a rather tedious calculation which we shall omit), we can
obtain an explicit formula for the posterior distribution of θ:
                                                                         !
                                        1             1
                                        σ2            τ2    1
                  θ|Y = y ∼ N        1    1 y+ 1    1 µ, 1    1              .
                                     σ2 + τ2   σ2 + τ2   σ2 + τ2



Let’s try to make sense of this formula.

• It says that the posterior mean of θ, E(θ|Y = y), is a weighted average of the
  prior mean µ and the observed data y. The weights are determined by how certain
  we are about θ before getting the data and how precisely the data are measured.
  If we are already very sure about θ even before getting the data, then τ 2 will be
  small and 1/τ 2 will be large, which will give a lot of weight to the prior mean µ.
  On the other hand, if the data are very precise, then σ 2 will be small and 1/σ 2
  will be large, which will give a lot of weight to the data y.

• For the posterior variance, if we define precision to be the reciprocal of variance,
  then the result simply says that the posterior precision of θ is the sum of the prior
  precision 1/τ 2 and the data precision 1/σ 2 .

This is all well and good, but let’s suppose we didn’t know how to complete the
square, or that we wanted to check our calculations for specific values of y, σ 2 , µ,
and τ 2 . We can do this by simulating from the posterior distribution of θ, using
the Metropolis-Hastings algorithm to construct a Markov chain whose stationary
distribution is fθ|Y (θ|y). The same method can also be applied to a wide variety of
distributions that are far more complicated than the Normal to work with analyti-
cally. A Metropolis-Hastings algorithm for generating θ0 , θ1 , . . . is as follows.


546                                                                   Introduction to Probability

       1. If θn = x, propose a new state x0 according to some transition rule. One
      way to do this in a continuous state space is to generate a Normal r.v. n
      with mean 0 and add it onto the current state to get the proposed state:
      in other words, we generate n ∼ N (0, d2 ) for some constant d, and then
      set x0 = x + n . This is the analog of a transition matrix for a continuous
      state space. The only additional detail is deciding d; in practice, we try to
      choose a moderate value that is neither too large nor too small.
       2. The acceptance probability is
                                                                  
                                   0             s(x0 )p(x0 , x)
                           a(x, x ) = min                        ,1 ,
                                                 s(x)p(x, x0 )
      where s is the desired stationary PDF (this was a PMF in the discrete
      case) and p(x, x0 ) is the probability density of proposing x0 from x (this
      was pij in the discrete case).
      In this problem, we want the stationary PDF to be fθ|Y , so we’ll use that
      for s. As for p(x, x0 ), proposing x0 from x is the same as having n = x0 −x,
      so we evaluate the PDF of n at x0 − x to get
                                                1       1    0   2
                                p(x, x0 ) = √       e− 2d2 (x −x) .
                                                2πd
      However, since p(x0 , x) = p(x, x0 ), these terms cancel from the acceptance
      probability, leaving us with
                                                             
                                   0           fθ|Y (x0 |y)
                             a(x, x ) = min                 ,1 .
                                                fθ|Y (x|y)
      Once again, the normalizing constant cancels in the numerator and de-
      nominator of the acceptance probability.
       3. Flip a coin that lands Heads with probability a(x, x0 ), independently
      of the Markov chain.
       4. If the coin lands Heads, accept the proposal and set θn+1 = x0 . Other-
      wise, stay in place and set θn+1 = x.

We ran the algorithm for 104 iterations with the settings Y = 3, µ = 0, σ 2 = 1,
τ 2 = 4, and d = 1. Figure 12.2 shows a histogram of the resulting draws from the
posterior distribution of θ. The posterior distribution indeed looks like a Normal
curve. We can estimate the posterior mean and variance using the sample mean and
sample variance. For the draws we obtained, the sample mean is 2.4 and the sample
variance is 0.8. These are in close agreement with the theoretical values:
                           1           1                       1
                           σ2          τ2          1           4
         E(θ|Y = 3) =   1    1  y + 1     1  µ =     1 · 3 +     1 · 0 = 2.8,
                        σ2 + τ2     σ2 +  τ2     1 + 4       1 + 4

                           1             1
       Var(θ|Y = 3) =   1     1    =          = 0.8.
                        σ2 + τ 2       1 + 14
```
