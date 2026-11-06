# Chapter 12: Markov Chain Monte Carlo

**Book:** Introduction to Probability, Second Edition  
**Authors:** Joseph K. Blitzstein and Jessica Hwang  
**Printed pages:** 533–558

> Source transcription from the supplied textbook PDF. Text extraction preserves the original order and page content as far as the PDF text layer allows. Check mathematical notation and figure references against the source where extraction is ambiguous.

```text
Markov chain Monte Carlo                                                            547

The posterior mean is closer to the observed data than to the prior mean, which
makes sense because τ 2 is larger than σ 2 , corresponding to a relatively high level of
prior uncertainty. Using the code provided in the R section of this chapter, you can
see how the posterior distribution changes for different values of y, µ, σ 2 , and τ 2 .

                    2000
                    1500
            frequency
                    1000
                    500
                    0




                           −1   0   1     2           3   4     5      6
                                              theta


FIGURE 12.2
Histogram of 104 draws from the posterior distribution of θ given Y = 3, obtained
using Metropolis-Hastings with µ = 0, σ 2 = 1, and τ 2 = 4. The sample mean is 2.4
and the sample variance is 0.8, in agreement with the theoretical values.




FIGURE 12.3
Trace plots of θn as a function of the iteration number n, for d = 100, 1, 0.01.

To help diagnose whether our Markov chain is adequately exploring the state space,
we can make a trace plot, which is a plot of the samples θn as a function of n.
Figure 12.3 shows three trace plots corresponding to three different choices for the
standard deviation d of the proposals, namely d = 100, d = 1, and d = 0.01. The
trace plot for d = 100 has numerous flat regions where the chain is staying in place.
This indicates that d is too large, so the proposals are often rejected. On the other
hand, d = 0.01 is too small; we can see from the trace plot that the chain takes tiny


548                                                         Introduction to Probability

steps and is unable to venture very far from its starting point. The trace plot for
d = 1 is just right, exhibiting neither the low acceptance rate of the d = 100 chain,
nor the restricted mobility of the d = 0.01 chain.
In this example, the posterior distribution of θ is available analytically, so we used
MCMC for illustrative purposes, to show that the results obtained by MCMC agree
with their theoretical counterparts. But the same technique also applies in problems
where the prior isn’t conjugate and the posterior isn’t a named distribution.       




12.2    Gibbs sampling

Gibbs sampling is an MCMC algorithm for obtaining approximate draws from a
joint distribution, based on sampling from conditional distributions one at a time: at
each stage, one variable is updated (keeping all the other variables fixed) by drawing
from the conditional distribution of that variable given all the other variables. This
approach is especially useful in problems where these conditional distributions are
pleasant to work with.
First we will run through how the Gibbs sampler works in the bivariate case, where
the desired stationary distribution is the joint PMF of discrete r.v.s X and Y . There
are several forms of Gibbs samplers, depending on the order in which updates are
done. We will introduce two major kinds of Gibbs sampler: systematic scan, in which
the updates sweep through the components in a deterministic order, and random
scan, in which a randomly chosen component is updated at each stage.
Algorithm 12.2.1 (Systematic scan Gibbs sampler). Let X and Y be discrete
r.v.s with joint PMF pX,Y (x, y) = P (X = x, Y = y). We wish to construct a
two-dimensional Markov chain (Xn , Yn ) whose stationary distribution is pX,Y . The
systematic scan Gibbs sampler proceeds by updating the X-component and the
Y -component in alternation. If the current state is (Xn , Yn ) = (xn , yn ), then we
update the X-component while holding the Y -component fixed, and then update
the Y -component while holding the X-component fixed:

        1. Draw xn+1 from the conditional distribution of X given Y = yn , and
       set Xn+1 = xn+1 .
        2. Draw yn+1 from the conditional distribution of Y given X = xn+1 , and
       set Yn+1 = yn+1 .

Repeating steps 1 and 2 over and over, the stationary distribution of the chain
(X0 , Y0 ), (X1 , Y1 ), (X2 , Y2 ), . . . is pX,Y .
Algorithm 12.2.2 (Random scan Gibbs sampler). As above, let X and Y be
discrete r.v.s with joint PMF pX,Y (x, y). We wish to construct a two-dimensional


Markov chain Monte Carlo                                                            549

Markov chain (Xn , Yn ) whose stationary distribution is pX,Y . Each move of the
random scan Gibbs sampler picks a uniformly random component and updates it,
according to the conditional distribution given the other component:

        1. Choose which component to update, with equal probabilities.
        2. If the X-component was chosen, draw a value xn+1 from the condi-
       tional distribution of X given Y = yn , and set Xn+1 = xn+1 , Yn+1 = yn .
       Similarly, if the Y -component was chosen, draw a value yn+1 from the con-
       ditional distribution of Y given X = xn , and set Xn+1 = xn , Yn+1 = yn+1 .

Repeating steps 1 and 2 over and over, the stationary distribution of the chain
(X0 , Y0 ), (X1 , Y1 ), (X2 , Y2 ), . . . is pX,Y .
Gibbs sampling generalizes naturally to higher dimensions. If we want to sample
from a d-dimensional joint distribution, the Markov chain we construct will be a
sequence of d-dimensional random vectors. At each stage, we choose one component
of the vector to update, and we draw from the conditional distribution of that
component given the most recent values of the other components. We can either
cycle through the components of the vector in a systematic order, or choose a
random component to update each time.
The Gibbs sampler is less flexible than the Metropolis-Hastings algorithm in the
sense that we don’t get to choose a proposal distribution; this also makes it simpler in
the sense that we don’t have to choose a proposal distribution. The flavors of Gibbs
and Metropolis-Hastings are rather different, in that Gibbs emphasizes conditional
distributions while Metropolis-Hastings emphasizes acceptance probabilities. But
the algorithms are closely connected, as we show below.
Theorem 12.2.3 (Random scan Gibbs as Metropolis-Hastings). The random scan
Gibbs sampler is a special case of the Metropolis-Hastings algorithm, in which the
proposal is always accepted. In particular, it follows that the stationary distribution
of the random scan Gibbs sampler is as desired.

Proof. We will show this in two dimensions, but the proof is similar in any di-
mension. Let X and Y be discrete r.v.s whose joint PMF is the desired stationary
distribution. Let’s work out what the Metropolis-Hastings algorithm says to do, us-
ing the following proposal distribution: from (x, y), randomly update one coordinate
by running one move of the random scan Gibbs sampler.
To simplify notation, write

P (X = x, Y = y) = p(x, y), P (Y = y|X = x) = p(y|x), P (X = x|Y = y) = p(x|y).

More formally, we should write pY |X (y|x) instead of p(y|x), to avoid issues like
wondering what p(5|3) means. But writing p(y|x) is more compact and does not
create ambiguity in this proof.
Let’s compute the Metropolis-Hastings acceptance probability for going from (x, y)


550                                                              Introduction to Probability

to (x0 , y 0 ). The states (x, y) and (x0 , y 0 ) must be equal in at least one component,
since the proposal says to update only one component. Suppose that x = x0 (the
case y = y 0 can be handled symmetrically). Then the acceptance probability is

                       p(x, y 0 )p(y|x) 12   p(x)p(y 0 |x)p(y|x)
                                           =                     = 1.
                       p(x, y)p(y 0 |x) 12   p(x)p(y|x)p(y 0 |x)

Thus, this Metropolis-Hastings algorithm always accepts the proposal! So it’s just
running the random scan Gibbs sampler without modifying it.                     

Let’s study some concrete examples of Gibbs samplers.
Example 12.2.4 (Graph coloring). Let G be a network (also called a graph):
there are n nodes, and for each pair of distinct nodes, there either is or isn’t an
edge joining them. We have a set of k colors, e.g., if k = 7, the color set may be
{red, orange, yellow, green, blue, indigo, violet}. A k-coloring of the network is an
assignment of a color to each node, such that two nodes joined by an edge can’t be
the same color. For example, a 3-coloring of a network is illustrated below. Graph
coloring is an important topic in computer science, with wide-ranging applications
such as task scheduling and the game of Sudoku.




FIGURE 12.4
A 3-coloring of a network.

Suppose that it is possible to k-color G. Form a Markov chain on the space of all
k-colorings of G, with transitions as follows: starting with a k-coloring of G, pick a
uniformly random node, figure out what the legal colors are for that node, and then
repaint that node with a uniformly random legal color (note that this random color
may be the same as the current color). Show that this Markov chain is reversible,
and find its stationary distribution.
Solution:
Let C be the set of all k-colorings of G, and let qij be the transition probability
of going from i to j for any k-colorings i and j in C. We will show that qij = qji ,
which implies that the stationary distribution is uniform on C.


Markov chain Monte Carlo                                                                            551

For any k-coloring i and node v, let L(i, v) be the number of legal colorings for node
v, keeping the colors of all other nodes the same as they are in i. If k-colorings i and
j differ at more than one node, then qij = 0 = qji . If i = j, then obviously qij = qji .
If i and j differ at exactly one node v, then L(i, v) = L(j, v), so
                                      1 1         1 1
                             qij =              =           = qji .
                                      n L(i, v)   n L(j, v)

So the transition matrix is symmetric, which shows that the stationary distribution
is uniform over the state space.
How is this an example of Gibbs sampling? Think of each node in the graph as a
discrete r.v. that can take on k possible values. These nodes have a joint distribution,
and the constraint that connected nodes cannot have the same color imposes a
complicated dependence structure between nodes.
We would like to sample a random k-coloring of the entire graph; that is, we want
to draw from the joint distribution of all the nodes. Since this is difficult, we instead
condition on all but one node. If the joint distribution is to be uniform over all legal
graphs, then the conditional distribution of one node given all the others is uniform
over its legal colors. Thus, at each stage of the algorithm, we are drawing from the
conditional distribution of one node given all the others: we’re running a random
scan Gibbs sampler!                                                                     
Example 12.2.5 (Darwin’s finches). When Charles Darwin visited the Galápagos
Islands, he kept a record of the finch species he observed on each island. Table
12.1 summarizes Darwin’s data, with each row corresponding to a species and each
column to an island. The presence of a 1 in entry (i, j) of the table indicates that
species i was observed on island j.

                                                  Island
 Species   1   2   3    4    5    6      7   8       9   10   11   12   13   14   15   16   17   Total
    1      0   0    1   1     1      1   1    1     1    1    0     1   1    1    1    1    1     14
    2      1   1    1   1     1      1   1    1     1    1    0     1   0    1    1    0    0     13
    3      1   1    1   1     1      1   1    1     1    1    1     1   0    1    1    0    0     14
    4      0   0    1   1     1      0   0    1     0    1    0     1   1    0    1    1    1     10
    5      1   1    1   0     1      1   1    1     1    1    0     1   0    1    1    0    0     12
    6      0   0    0   0     0      0   0    0     0    0    1     0   1    0    0    0    0      2
    7      0   0    1   1     1      1   1    1     1    0    0     1   0    1    1    0    0     10
    8      0   0    0   0     0      0   0    0     0    0    0     1   0    0    0    0    0      1
    9      0   0    1   1     1      1   1    1     1    1    0     1   0    0    1    0    0     10
   10      0   0    1   1     1      1   1    1     1    1    0     1   0    1    1    0    0     11
   11      0   0    1   1     1      0   1    1     0    1    0     0   0    0    0    0    0      6
   12      0   0    1   1     0      0   0    0     0    0    0     0   0    0    0    0    0      2
   13      1   1    1   1     1      1   1    1     1    1    1     1   1    1    1    1    1     17
  Total    4   4   11   10   10      8   9   10     8    9    3    10   4    7    9    3    3    122

TABLE 12.1
Presence of 13 finch species (rows) on 17 islands (columns). A value of 1 in entry
(i, j) indicates that species i was observed on island j. Data are from Sanderson [22].


552                                                            Introduction to Probability

Given these data, we might be interested in knowing whether the pattern of 0’s
and 1’s observed in the table is anomalous in some way. For example, does there
appear to be dependence between the rows and columns? Do some pairs of species
frequently occur together on the same islands, more often than one would expect
by chance? These patterns may shed light on the dynamics of inter-species coop-
eration or competition. One way to test for such patterns is by looking at a lot of
random tables with the same row and column sums as the observed table, to see
how the observed table compares to the random ones. This is a common technique
in statistics known as a goodness-of-fit test.
But how do we generate random tables with the same row and column sums as Table
12.1? The number of tables satisfying these constraints is impossible to enumerate.
MCMC comes to the rescue: we’ll create a Markov chain on the space of all tables
with these row and column sums, whose stationary distribution is uniform over all
such tables.
To construct the Markov chain, we need a way to transition from one table to
another without changing the row or column sums. Starting from the observed table,
randomly select two rows and two columns. If the four entries at their intersection
have one of the following two patterns:
                                  0 1             1 0
                                           or
                                  1 0             0 1

then switch to the opposite pattern with probability 1/2; otherwise stay in place.
For example, if we selected rows 1 and 3 and columns 1 and 17, we would switch
the four entries at their intersection from 01 10 to 10 01 with probability 1/2. This is a
symmetric transition rule (for all tables t and t0 , the transition probability from t to
t0 equals the transition probability from t0 to t), the transitions never alter the row
or column sums, and it can be shown that the Markov chain defined in this way is
irreducible. Therefore the stationary distribution is uniform over all tables with the
given row and column sums, as desired.
To interpret this procedure as a Gibbs sampler, consider conditioning on all entries
in the table besides the four entries at the intersection of rows 1 and 3 and columns
1 and 17. If the stationary distribution is to be uniform over all tables with the given
row and column sums, then the conditional distribution of these four entries must be
uniform over all configurations that don’t change the row and column sums, namely
 0 1 and 1 0 . Thus, at each stage, we are drawing from the conditional distribution
 10      01
of four entries given all the rest.                                                   
As with Metropolis-Hastings, Gibbs sampling also applies to continuous distribu-
tions, replacing conditional PMFs with conditional PDFs.
Example 12.2.6 (Chicken-egg with unknown parameters). A chicken lays N eggs,
where N ∼ Pois(λ). Each egg hatches with probability p, where p is unknown; we
let p ∼ Beta(a, b). The constants λ, a, b are known.
Here’s the catch: we don’t get to observe N . Instead, we only observe the number


Markov chain Monte Carlo                                                        553

of eggs that hatch, X. Describe how to use Gibbs sampling to find E(p|X = x), the
posterior mean of p after observing x hatched eggs.
Solution:
By the chicken-egg story, the distribution of X given p is Pois(λp). The posterior
PDF of p is proportional to

               f (p|X = x) ∝ P (X = x|p)f (p) ∝ e−λp (λp)x pa−1 q b−1 ,

where we have dropped all terms not depending on p.
This isn’t a named distribution, so it might appear as though we’re stuck, but we
can get ourselves out of this rut by thinking conditionally. What do we wish we
knew? The total number of eggs! Conditional on observing N = n and knowing the
true value of p, the distribution of X would be Bin(n, p). By conditioning on the
total number of eggs, we recover Beta-Binomial conjugacy between p and X. This
allows us to write down the posterior distribution right away using Story 8.3.3:

                     p|X = x, N = n ∼ Beta(x + a, n − x + b).

The fact that conditioning on N makes matters so much nicer inspires us to use
Gibbs sampling to tackle the problem. We alternate between sampling from p condi-
tional on N and sampling from N conditional on p, as described below. Throughout,
we must also condition on X = x, since we seek to learn about the posterior distri-
butions of the parameters conditional on the evidence.
We make an initial guess for p and N , then iterate the following steps:

       1. Conditional on N = n and X = x, draw a new guess for p from the
      Beta(x + a, n − x + b) distribution.
       2. Conditional on p and X = x, the number of unhatched eggs is
      Y ∼ Pois(λ(1 − p)) by the chicken-egg story, so we can draw Y from the
      Pois(λ(1 − p)) distribution and set the new guess for N to be N = x + Y .

After many iterations, we have draws for both p and N . If we want, we can ignore
the draws of N , since N was merely a device to help us sample p. But for fun, we’ll
plot both: Figure 12.5 shows histograms of the posterior draws of p and N when
λ = 10, a = b = 1 (corresponding to a Unif(0, 1) prior on p), and we observe X = 7
hatched eggs.
As for the posterior mean E(p|X = x) originally asked for in the problem, we
can take the sample mean of the draws of p to get a good approximation. In this
case, the sample mean is 0.68. Using the code provided in the R section of this
chapter, you can try changing the values of λ, a, b, and x to see how the histograms
and the posterior mean are affected. The key strategy for this problem was to add
the unobserved number of eggs N to the model, so that we would have pleasant
conditional distributions and could use Gibbs sampling conveniently.               


554                                                                      Introduction to Probability

                      Histogram of p                                   Histogram of N
        1000




                                                       1500
        800




                                                       1000
        600
frequency




                                               frequency
        400




                                                       500
        200
        0




                                                       0
                0.2    0.4   0.6   0.8   1.0                  5   10      15       20   25    30
                             p                                                 N

FIGURE 12.5
Histograms of 104 draws from the posterior distributions of p and N , where λ = 10,
a = 1, b = 1, and we observe X = 7.




12.3           Recap

Markov chain Monte Carlo allows us to sample from complicated distributions using
Markov chains. MCMC has been applied in a very wide variety of problems in recent
years. The main idea behind MCMC algorithms is to construct a Markov chain
whose stationary distribution is the distribution we wish to sample from. After
running the Markov chain for a long time, the values that the Markov chain takes
on can serve as draws from the desired distribution.

The two MCMC algorithms discussed in this chapter are Metropolis-Hastings and
Gibbs sampling. The Metropolis-Hastings algorithm uses any irreducible Markov
chain on the state space to generate proposals, then accepts or rejects those pro-
posals so as to produce a modified Markov chain with the desired stationary dis-
tribution. Moreover, the resulting chain is reversible. The choice of the proposal
distribution is extremely important in practice, since a bad proposal distribution
may result in very slow convergence to the stationary distribution.

Gibbs sampling is a method for drawing from a d-dimensional joint distribution by
updating the components of a d-dimensional Markov chain one at a time, condi-
tional on all other components. This can be done through a systematic scan, which
deterministically cycles through the components in a fixed order, or a random scan,
which randomly chooses which component to update at each stage.


Markov chain Monte Carlo                                                       555




12.4   R

Metropolis-Hastings

Here’s how to implement the Metropolis-Hastings algorithm for Example 12.1.8,
the Normal-Normal model. First, we choose our observed value of Y and decide on
values for the constants σ, µ, and τ :
y <- 3
sigma <- 1
mu <- 0
tau <- 2
We also need to choose the standard deviation of the proposals for step 1 of the
algorithm, as explained in Example 12.1.8; for this problem, we let d = 1. We set
the number of iterations to run, and we allocate a vector theta of length 104 which
we will fill with our simulated draws:
d <- 1
niter <- 10^4
theta <- rep(0,niter)
Now for the main loop. We initialize θ to the observed value y, then run the algo-
rithm described in Example 12.1.8:
theta[1] <- y
for (i in 2:niter){
    theta.p <- theta[i-1] + rnorm(1,0,d)
    r <- dnorm(y,theta.p,sigma) * dnorm(theta.p,mu,tau) /
           (dnorm(y,theta[i-1],sigma) * dnorm(theta[i-1],mu,tau))
    flip <- rbinom(1,1,min(r,1))
    theta[i] <- if(flip==1) theta.p else theta[i-1]
}
Let’s step through each line inside the loop. The proposed value of θ is theta.p,
which equals the previous value of θ plus a Normal random variable with mean 0
and standard deviation d (recall that rnorm takes the standard deviation and not
the variance as input). The ratio r is
                                        1            1
                      fθ|Y (x0 |y)
                                               0 2       0   2
                                    e− 2σ2 (y−x ) e− 2τ 2 (x −µ)
                                   = − 1 (y−x)2 − 1 (x−µ)2 ,
                      fθ|Y (x|y)     e 2σ2        e 2τ 2
where theta.p is playing the role of x0 and theta[i-1] is playing the role of x.
The coin flip to determine whether to accept or reject the proposal is flip, which
is a coin flip with probability min(r,1) of Heads (encoding Heads as 1 and Tails
as 0). Finally, we set theta[i] equal to the proposed value if the coin flip lands
Heads, and keep it at the previous value otherwise.


556                                                       Introduction to Probability

The vector theta now contains all of our simulation draws. We typically discard
some of the initial draws to give the chain some time to approach the stationary
distribution. The following line of code discards the first half of the draws:

theta <- theta[-(1:(niter/2))]

To see what the remaining draws look like, we can create a histogram using
hist(theta). We can also compute summary statistics such as mean(theta) and
var(theta), which give us the sample mean and sample variance.


Gibbs

Now let’s implement Gibbs sampling for Example 12.2.6, the chicken-egg story with
unknown hatching probability and invisible unhatched eggs. The first step is to
decide on our observed value of X, as well as the constants λ, a, b:

x <- 7
lambda <- 10
a <- 1
b <- 1

Next we decide how many iterations to run, and we allocate space for our results,
creating two vectors p and N of length 104 which we will fill with our simulated
draws:

niter <- 10^4
p <- rep(0,niter)
N <- rep(0,niter)

Finally, we’re ready to run the Gibbs sampler. We initialize p and N to the values
0.5 and 2x, respectively, and then we run the algorithm as explained in Example
12.2.6:

p[1] <- 0.5
N[1] <- 2*x
for (i in 2:niter){
    p[i] <- rbeta(1,x+a,N[i-1]-x+b)
    N[i] <- x + rpois(1,lambda*(1-p[i-1]))
}

Again, we discard the initial draws:

p <- p[-(1:(niter/2))]
N <- N[-1:(niter/2))]

To see what the remaining draws look like, we can make histograms using hist(p)
and hist(N), which is how we created Figure 12.5. We can also compute summary
statistics such as mean(p) or median(p).


Markov chain Monte Carlo                                                                             557




12.5    Exercises
  1.   Let p(x, y) be the joint PMF of two discrete r.v.s X and Y . Using shorthand notation as
       we used with the Gibbs sampler, let p(x) and p(y) be the marginal PMFs of X and Y ,
       and p(x|y) and p(y|x) be the conditional PMFs of X given Y and Y given X. Suppose
       the support of Y is the same as the support of the conditional distribution of Y |X.

       (a) Use the identity p(x)p(y|x) = p(y)p(x|y) to find an expression for the marginal PMF
       p(y) in terms of the conditional PMFs p(x|y) and p(y|x).
       Hint: Rewrite the identity as p(x)/p(y) = p(x|y)/p(y|x) and take a sum.

       (b) Explain why the two conditional distributions p(x|y) and p(y|x) determine the joint
       distribution p(x, y), and how this fact relates to the Gibbs sampler.
  2.   We have a network G with n nodes and some edges. Each node of G can either be
       vacant or occupied. We want to place particles on the nodes of G in such a way that
       the particles are not too crowded. Thus, define a feasible configuration as a placement
       of particles such that each node is occupied by at most one particle, and no neighbor of
       an occupied node is occupied.
       Construct a Markov chain whose stationary distribution is uniform over all feasible
       configurations. Clearly specify the transition rule of your Markov chain, and explain
       why its stationary distribution is uniform.
  3.   This problem considers an application of MCMC techniques to image analysis. Imagine
       a 2D image consisting of an L × L grid of black-or-white pixels. Let Yj be the indicator
       of the jth pixel being white, for j = 1, . . . , L2 . Viewing the pixels as nodes in a network,
       the neighbors of a pixel are the pixels immediately above, below, to the left, and to the
       right (except for boundary cases).
       Let i ∼ j stand for “i and j are neighbors”. A commonly used model for the joint PMF
       of Y = (Y1 , . . . , YL2 ) is
                                                                           
                                                            X
                                    P (Y = y) ∝ exp β           I(yi = yj ) .
                                                      (i,j):i∼j


       If β is positive, this says that neighboring pixels prefer to have the same color. The
                                                                   2
       normalizing constant of this joint PMF is a sum over all 2L possible configurations, so
       it may be very computationally difficult to obtain. This motivates the use of MCMC to
       simulate from the model.
       (a) Suppose that we wish to simulate random draws from the joint PMF of Y, for a
       particular known value of β. Explain how we can do this using Gibbs sampling, cycling
       through the pixels one by one in a fixed order.

       (b) Now provide a Metropolis-Hastings algorithm for this problem, based on a proposal
       of picking a uniformly random site and toggling its value.


Taylor & Francis
Taylor & Francis Group
http://taylorandfrancis.com


13
Poisson processes



Poisson processes serve as a simple model for events occurring in time or space: in
one dimension, cars passing by a highway checkpoint; in two dimensions, flowers in
a meadow; in three dimensions, stars in a region of the galaxy. Poisson processes are
a primary building block for more complicated processes in time and space, which
are the focus of a branch of statistics called spatial statistics.

Poisson processes are also useful in probability, as they tie together many of the
named distributions and provide us with insightful story proofs for results that
might otherwise be tedious to show. This leads to a new problem-solving strategy,
which we will demonstrate: even when a problem makes no mention of Poisson
processes, there are sometimes ways to pretend the r.v.s are coming from a Poisson
process so that we can use convenient Poisson process properties.

In this chapter, we’ll review the already familiar definition of the 1D Poisson process,
derive and discuss three important properties of the 1D Poisson process, and then
extend these properties to Poisson processes in higher dimensions.




13.1    Poisson processes in one dimension

In Section 5.6, we defined a one-dimensional Poisson process and showed that the
interarrival times are i.i.d. Exponentials. In Chapter 8 we showed that the time of
the jth arrival (relative to some fixed starting time) is Gamma. Let’s review these
results, with notation that will help us generalize to higher dimensions.

Definition 13.1.1 (1D Poisson process). A sequence of arrivals in continuous time
is a Poisson process with rate λ if the following conditions hold:

        1. The number of arrivals in an interval of length t is distributed Pois(λt).

        2. The numbers of arrivals in disjoint time intervals are independent.

Usually we will assume that the timeline starts at t = 0, in which case we have a
Poisson process on (0, ∞), but we can use the same conditions to define a Poisson
process on (−∞, ∞) if we want the timeline to be infinite in both directions.

                                                                                    559


560                                                               Introduction to Probability

Consider a Poisson process on (0, ∞). Departing slightly from our notation in pre-
vious chapters, let N (t) be the number of arrivals in (0, t]. Then the number of
arrivals in (t1 , t2 ] is N (t2 ) − N (t1 ), for 0 < t1 < t2 . Let Tj be the time of the jth
arrival. Since T1 > t is the same event as N (t) = 0 (by the count-time duality, as
discussed in Section 5.6),

                            P (T1 > t) = P (N (t) = 0) = e−λt ,

so T1 ∼ Expo(λ). Next let’s condition on the first arrival time T1 and look at the
additional time T2 − T1 until the second arrival. Then

                                 (T2 − T1 )|T1 ∼ Expo(λ)

by the same argument as above, since we have a fresh Poisson process starting at
T1 . Since the conditional distribution of (T2 −T1 )|T1 does not depend on T1 , we have
that T2 − T1 is independent of T1 , so T2 − T1 ∼ Expo(λ) unconditionally too.

Continuing in this way, the interarrival times Tj − Tj−1 are independent, with

                                   Tj − Tj−1 ∼ Expo(λ).

So a Poisson process can be described dually as a process in which arrival counts
are Poissons or a process in which interarrival times are Exponentials. Also note
that since Tj is the sum of j i.i.d. Expo(λ) r.v.s,

                                    Tj ∼ Gamma(j, λ).

The connection with the Exponential gives us a simple way to generate n arrivals
from a Poisson process.

Story 13.1.2 (Generative story for 1D Poisson process). To generate n arrivals
from a Poisson process on (0, ∞) with rate λ:

        1. Generate n i.i.d. Expo(λ) r.v.s X1 , . . . , Xn .

        2. For j = 1, . . . , n, set Tj = X1 + · · · + Xj .

Then we can take T1 , . . . , Tn to be the arrival times.                                 

Figure 13.1 depicts three realizations of Poisson processes with rates 1, 2, and 5,
respectively, plotted up to time 10. In all three cases, we can see that despite the in-
terarrival times being i.i.d., the arrivals are not evenly spaced. Rather, there is a lot
of variability in the interarrival times, which produces clumps of arrivals. This phe-
nomenon is known as Poisson clumping. It might seem like an amazing coincidence
to observe a cluster of several arrivals that are close together in time, but Poisson
clumping says that having such clusters is common with Poisson processes.


Poisson processes                                                                             561

 λ=1



 λ=2



 λ=5
          0                                                                                  10

FIGURE 13.1
Simulated Poisson process in one dimension, for λ = 1, 2, 5. The arrivals are far
from evenly spaced from each other, and in fact they sometimes clump together,




13.2     Conditioning, superposition, and thinning

The three most important properties to understand about the Poisson process are
conditioning, superposition, and thinning. These correspond to properties we’ve al-
ready seen about the Poisson distribution, so they should already be plausible.


13.2.1     Conditioning

What happens when we take a Poisson process and condition on the total number
of events in an interval? Our first result is that conditional on the total number of
events in an interval, the number of events in a fixed subinterval is Binomial. This
follows from Theorem 4.8.2, where we showed that we can get from the Poisson to
the Binomial by conditioning.
Theorem 13.2.1 (Conditional counts). Let (N (t) : t > 0) be a Poisson process
with rate λ, and t1 < t2 . The conditional distribution of N (t1 ) given N (t2 ) = n is
                                                           
                                                         t1
                          N (t1 ) | N (t2 ) = n ∼ Bin n,      .
                                                         t2


Proof. Figure 13.2 illustrates the setup. The claim is that conditional on having a
total of n arrivals in (0, t2 ], the number of arrivals in (0, t1 ] is Binomial, with n trials
and success probability proportional to t1 .
Since (0, t1 ] and (t1 , t2 ] are disjoint, N (t1 ) is independent of N (t2 ) − N (t1 ). The first
is distributed Pois(λt1 ), the second is distributed Pois(λ(t2 − t1 )), and their sum is


562                                                              Introduction to Probability



      0                         t1                                                   t2

                N(t1)                                N(t2) - N(t1)

FIGURE 13.2
Conditioning. Given that n arrivals occurred in (0, t2 ], the conditional distribution
of the number of arrivals in (0, t1 ] is Binomial with parameters n and t1 /t2 .


the number of arrivals in (0, t2 ], namely N (t2 ). By Theorem 4.8.2,
                                                                     
                                                        λt1
                   N (t1 ) | N (t2 ) = n ∼ Bin n,                         ,
                                                  λt1 + λ(t2 − t1 )

which is precisely what we wanted to show.                                                

Carrying the idea of conditioning on the number of arrivals further, we have the
following striking result: in a Poisson process, given that N (t) = n, the arrival times
are distributed as if we threw down n i.i.d. Unif(0, t) points.
First let’s look at a simple case, where there has been only one arrival.
Proposition 13.2.2. In a Poisson process of rate λ, conditional on N (t) = 1, the
first arrival time T1 has the Unif(0, t) distribution.

Proof. Let 0 < s < t. By a form of the count-time duality,

                                        P (T1 ≤ s, N (t) = 1)
                P (T1 ≤ s|N (t) = 1) =
                                            P (N (t) = 1)
                                        P (N (s) = 1, N (t) − N (s) = 0)
                                      =
                                                 P (N (t) = 1)
                                       (e−λs λs)(e−λ(t−s) )
                                      =
                                             e−λt λt
                                       s
                                      = .
                                       t
Thus, the conditional CDF of T1 given N (t) = 1 is the Unif(0, t) CDF.                    

More generally, given that N (t) = n, the arrival times Tj look like the order statistics
of n i.i.d. Unif(0, t) r.v.s. We omit the proof since in introducing order statistics in
Chapter 8, we focused on their marginal distributions.
Theorem 13.2.3 (Conditional times). In a Poisson process of rate λ, conditional
on N (t) = n, the joint distribution of the arrival times T1 , . . . , Tn is the same as the
joint distribution of the order statistics of n i.i.d. Unif(0, t) r.v.s.


Poisson processes                                                                    563

From Chapter 8, we know that the order statistics of Unif(0, 1) r.v.s are Betas, so
the conditional distributions of the Tj are scaled Betas; to get Beta distributions,
we can just divide the Tj by t so that their support is (0, 1):
                         t−1 Tj | N (t) = n ∼ Beta(j, n − j + 1).
We now have another way to generate arrivals from a Poisson process, this time for
a specific interval instead of a specific number of arrivals.
Story 13.2.4 (Generative story for Poisson process, take 2). To generate arrivals
from a Poisson process with rate λ in an interval (0, t]:

        1. Generate the total number of events in the interval, N (t) ∼ Pois(λt).
        2. Given N (t) = n, generate n i.i.d. Unif(0, t) r.v.s U1 , . . . , Un .
        3. For j = 1, . . . , n, set Tj = U(j) .                                     

This is actually the generative story we used to create Figure 13.1, since we knew
we wanted to simulate in the interval (0, 10].
Example 13.2.5 (Users on a website). Users visit a certain website according to
a Poisson process with rate λ1 users per minute, where an “arrival” at a certain
time means that at that time someone starts browsing the site. After arriving at the
site, each user browses the site for an Expo(λ2 ) amount of time (and then leaves),
independent of other users.
Suppose that at time 0, no one is using the site. Let Nt be the number of users
who arrive in the interval (0, t], and let Ct be the number of users who are currently
browsing the site at time t.
(a) Let X be the time of arrival and Y be the time of departure for a user who
arrives at a Uniform time point in [0, t]. Find the joint PDF of X and Y .
(b) Let pt be the probability that a user who arrives at a Uniform time point in
(0, t] is still browsing the site at time t. Find pt .
(c) Find the distribution of Ct in terms of λ1 , λ2 , and t.
(d) Little’s law is a very general result, which says the following:
The long-run average number of customers in a stable system is the long-term av-
erage arrival rate multiplied by the average time a customer spends in the system.
Explain what happens to E(Ct ) for t large, and how this can be interpreted in terms
of Little’s law.
Solution:
(a) We have X ∼ Unif(0, t). Given X = x, Y is an Expo(λ2 ) shifted to start at x,
i.e., (Y − x)|(X = x) ∼ Expo(λ2 ). So the joint PDF of X and Y is
                                           λ2 −λ2 (y−x)
        f (x, y) = fX (x)fY |X (y|x) =        e         , for 0 < x < t and x < y.
                                            t


564                                                                     Introduction to Probability

(b) With notation as in (a), we want to find pt = P (Y > t). This can be done by
integrating the joint PDF over all (x, y) with y > t:
                                   Z Z
                                 1 t ∞
                     P (Y > t) =             λ2 e−λ2 (y−x) dydx
                                 t 0 t
                                   Z         Z ∞               
                                 1 t λ2 x               −λ2 y
                               =       e           λ2 e       dy dx
                                 t 0            t
                                        Z
                                 e−λ2 t t λ2 x
                               =            e dx
                                   t     0
                                 1 − e−λ2 t
                               =            .
                                    λ2 t

(c) By Theorem 13.2.3, given Nt = n we have that the n arrival times in (0, t] are
i.i.d. and uniform in that interval. Therefore, Ct |Nt ∼ Bin(Nt , pt ), with pt as above,
and Nt ∼ Pois(λ1 t). So by the chicken-egg story (Story 7.1.9),

                                   Ct ∼ Pois(λ1 pt t).

That is,                                                       
                                             λ1 (1 − e−λ2 t )
                             Ct ∼ Pois                              .
                                                   λ2

(d) As t → ∞, E(Ct ) → λ1 /λ2 . This agrees with Little’s law since it says the long-
run average number of users in the system (browsing the site) is the rate at which
users arrive (λ1 ) times the average time a user browses in a session (1/λ2 ).     


13.2.2     Superposition

The next property we will examine is superposition: if we take two independent
Poisson processes and overlay them, we get another Poisson process. (The combined
process is a Poisson process in its own right, but we can imagine that the arrivals
are tagged to indicate which of the underlying processes they came from.)
Theorem 13.2.6 (Superposition). Let (N1 (t) : t > 0) and (N2 (t) : t > 0) be
independent Poisson processes with rates λ1 and λ2 , respectively. Then the combined
process N (t) = N1 (t) + N2 (t) is a Poisson process with rate λ1 + λ2 .

Proof. Let’s verify the two properties in the definition of Poisson process.
1. For all t > 0, N1 (t) ∼ Pois(λ1 t) and N2 (t) ∼ Pois(λ2 t), independently, so N (t) ∼
Pois((λ1 + λ2 )t), by Theorem 4.8.1. The same argument applies for any interval of
length t, not just intervals of the form (0, t].

2. Arrivals in disjoint intervals are independent in the combined process because
they are independent in the two individual processes, and the individual processes
are independent of each other.                                                  


Poisson processes                                                                 565

There is a very natural way to generate a superposition.

Story 13.2.7 (Generative story for superposition). To generate the superposition of
two independent Poisson processes, (N1 (t) : t > 0) with rate λ1 and (N2 (t) : t > 0)
with rate λ2 :

        1. Generate arrivals from the Poisson process (N1 (t) : t > 0).

        2. Generate arrivals from the Poisson process (N2 (t) : t > 0).

        3. Superpose the results of steps 1 and 2.                               


  λ1 = 0.5

  λ2 = 0.5



λ1 + λ2 = 1
              0                                                                   10

FIGURE 13.3
Superposition. The superposition of independent Poisson processes is a Poisson
process, and the rates add. The top two timelines are independent Poisson processes,
each with rate 0.5. The bottom timeline is the superposition of the top two Poisson
processes and is itself a Poisson process with rate 1.

Figure 13.3 depicts a superposed Poisson process consisting of ×’s and ’s. Let’s
call the ×’s “type-1 events” and the ’s “type-2 events”. A natural question to ask
is: what is the probability of observing a type-1 event before a type-2 event?

Theorem 13.2.8 (Probability of type-1 event before type-2 event). Consider two
independent Poisson processes: a Poisson process of type-1 arrivals, with rate λ1 ,
and a Poisson process of type-2 arrivals, with rate λ2 . In the superposition of these
two processes, the probability of the first arrival being type-1 is λ1 /(λ1 + λ2 ).


Proof. Let T be the time until the first type-1 event and let V be the time until
the first type-2 event. We seek P (T ≤ V ). We could do this with 2D LOTUS,
integrating the joint PDF of T and V over the region of interest in the 2D plane.
But it turns out we can avoid calculus altogether.

We have T ∼ Expo(λ1 ) and V ∼ Expo(λ2 ), independently. Rescaling, let

                                   T̃ = λ1 T, Ṽ = λ2 V.

Then T̃ , Ṽ are i.i.d. Expo(1).


566                                                             Introduction to Probability

Letting U = T̃ /(T̃ + Ṽ ), we have
                                                    !
                                          T̃   Ṽ
                       P (T ≤ V ) = P        ≤
                                          λ1   λ2
                                                                    !
                                           T̃          Ṽ      λ1
                                   =P           ≤            ·
                                        T̃ + Ṽ     T̃ + Ṽ λ2
                                                            
                                                          λ1
                                   = P U ≤ (1 − U ) ·
                                                          λ2
                                                       
                                                 λ1
                                   =P U ≤                 .
                                              λ1 + λ2

Since T̃ , Ṽ ∼ Expo(1), the bank–post office story tells us that U ∼ Beta(1, 1). In
other words, U is standard Uniform! Thus, P (T ≤ V ) = λ1 /(λ1 + λ2 ). Note that
when λ1 = λ2 this reduces to 1/2, as it should by symmetry.                       

The above result applies to the first arrival in the combined Poisson process. After
the first arrival, however, the same reasoning applies to the second arrival: by the
memoryless property, the time to the next type-1 event is Expo(λ1 ) and the time
to the next type-2 event is Expo(λ2 ), independent of the past. Therefore the second
arrival is a type-1 arrival with probability λ1 /(λ1 + λ2 ), independent of the first
arrival. Similarly, all of the arrival types can be viewed as i.i.d. coin tosses with
probability λ1 /(λ1 + λ2 ) of Heads, where Heads corresponds to type-1.
This yields an alternative generative story for the superposition of two independent
Poisson processes: we can first generate an Expo(λ1 + λ2 ) r.v. to decide when the
next arrival occurs, and then independently flip a coin with probability λ1 /(λ1 + λ2 )
of Heads to decide what kind of arrival it is.
Story 13.2.9 (Generative story for superposition, take 2). To generate the super-
position of two independent Poisson processes, with rates λ1 and λ2 :

        1. Generate i.i.d. Expo(λ1 + λ2 ) r.v.s X1 , X2 , . . . , and let the jth arrival
       be at time Tj = X1 + · · · + Xj .
       2. Generate i.i.d. r.v.s I1 , I2 , · · · ∼ Bern(λ1 /(λ1 + λ2 )), independent of
       X1 , X2 , . . . . Let the jth arrival be type-1 if Ij = 1, and type-2 otherwise.
                                                                                     

This story provides us with a quick proof of a result known as the competing risks
theorem, which seems like a surprising independence result when stated on its own
but becomes very intuitive when viewed in the context of Poisson processes.
Example 13.2.10 (Competing risks). The lifetime of Fred’s refrigerator is Y1 ∼
Expo(λ1 ), and the lifetime of his dishwasher is Y2 ∼ Expo(λ2 ), independent of
Y1 . Show that min(Y1 , Y2 ), the time of the first appliance failure, is independent of
I(Y1 < Y2 ), the indicator that the refrigerator failed first. This may seem surprising.


Poisson processes                                                                            567

For example, if the average lifetime of his refrigerator is 15 years and the average
lifetime of his dishwasher is 7 years, and then one of these appliances fails after 7
years, it would be natural to guess that it was the dishwasher that failed. But in
fact, we will show that knowing the time of the first appliance failure provides no
information about which appliance failed.
Solution: We will use an embedding strategy, using Poisson process ideas even though
this problem doesn’t mention Poisson processes anywhere! We will embed the r.v.s
Y1 and Y2 into a Poisson process that we ourselves invent, in order to take advantage
of the properties of Poisson processes. So let’s imagine there is an entire Poisson
process of refrigerator failures with rate λ1 and a Poisson process of dishwasher
failures with rate λ2 .
We can interpret Y1 as the waiting time for the first arrival in the refrigerator
process and Y2 as the waiting time for the first arrival in the dishwasher process.
This approach is valid since (min(Y1 , Y2 ), I(Y1 < Y2 )) is a function of (Y1 , Y2 ), so
what matters is the joint distribution of (Y1 , Y2 ), and the way we construct (Y1 , Y2 )
does have the correct joint distribution.
Furthermore, min(Y1 , Y2 ) is the waiting time for the first arrival in the superposition
of the two Poisson processes, and I(Y1 < Y2 ) is the indicator of this arrival being a
type-1 event. But in the above generative story, the arrival times and event types
in the superposed Poisson process are generated completely independently! Hence,
min(Y1 , Y2 ) and I(Y1 < Y2 ) are independent, with min(Y1 , Y2 ) ∼ Expo(λ1 + λ2 ) and
I(Y1 < Y2 ) ∼ Bern(λ1 /(λ1 + λ2 )).                                                     
A direct consequence of Story 13.2.9 is that if we project a superposed Poisson
process into discrete time, keeping the sequence of type-1 and type-2 arrivals but not
the arrival times themselves, we are left with i.i.d. Bern(λ1 /(λ1 +λ2 )) r.v.s I1 , I2 , . . . ,
where Ij is the indicator of the jth arrival being type-1. Figure 13.4 illustrates what
it means to remove the continuous-time information from the Poisson process, and
Theorem 13.2.11 states the result formally.




                                                            ...

FIGURE 13.4
Projection into discrete time. Stripping out the continuous-time information from a
superposed Poisson process produces a sequence of i.i.d. indicators of type-1 versus
type-2 events. Here × represents type-1 events and  represents type-2 events.

Theorem 13.2.11 (Projection of superposition into discrete time). Consider the
superposition (N (t) : t > 0) of two independent Poisson processes with rates λ1 and
λ2 . For j = 1, 2, . . . , let Ij be the indicator of the jth event being from the Poisson
process with rate λ1 . Then the Ij are i.i.d. Bern(λ1 /(λ1 + λ2 )).


568                                                           Introduction to Probability

Using this result, we can prove with a story that a Gamma mixture of Poissons
is Negative Binomial, which we first learned from Fred’s adventures in Blotchville
(Story 8.4.5). We’ll consider a special case first.
Theorem 13.2.12 (Exponential mixture of Poissons is Geometric). Suppose that
X ∼ Expo(λ) and Y |X = x ∼ Pois(x). Then Y ∼ Geom(λ/(λ + 1)).

Proof. As with the competing risks theorem, we embed X and Y into Poisson
processes. Consider two independent Poisson processes, a process of failures arriving
at rate 1 and another of successes arriving at rate λ. Let X be the time of the first
success; then X ∼ Expo(λ). Let Y be the number of failures before the time of the
first success. By the definition of a Poisson process with rate 1, Y |X = x ∼ Pois(x).
Therefore X and Y satisfy the conditions of the theorem.
To get the marginal distribution of Y , strip out the continuous-time information!
In discrete time we have i.i.d. Bernoulli trials with success probability λ/(λ + 1),
and Y is defined as the number of failures before the first success, so by the story
of the Geometric distribution, Y ∼ Geom(λ/(λ + 1)).                               

The reasoning for the general case is analogous.
Theorem 13.2.13 (Gamma mixture of Poissons is Negative Binomial). Suppose
that X ∼ Gamma(r, λ) and Y |X = x ∼ Pois(x). Then Y ∼ NBin(r, λ/(λ + 1)).

Proof. Consider two independent Poisson processes, a process of failures arriving
at rate 1 and another of successes arriving at rate λ. Let X be the time of the rth
success, so X ∼ Gamma(r, λ). Let Y be the number of failures before the time of the
rth success. Then Y |X = x ∼ Pois(x) by definition of Poisson process. We have that
Y is the number of failures before the rth success in a sequence of i.i.d. Bernoulli
trials with success probability λ/(λ + 1), so Y ∼ NBin(r, λ/(λ + 1)).            


13.2.3   Thinning

The last property of Poisson processes we will discuss is thinning: if we take a Poisson
process and, for each arrival, independently flip a coin to decide whether it is a type-
1 event or type-2 event, we end up with two independent Poisson processes.
Theorem 13.2.14 (Thinning). Let (N (t) : t > 0) be a Poisson process with rate
λ, and classify each arrival as a type-1 event with probability p and a type-2 event
with probability 1 − p, where these classifications are independent of each other and
independent of the arrival times. Then the type-1 events form a Poisson process
with rate λp, the type-2 events form a Poisson process with rate λ(1 − p), and these
two processes are independent.

Proof. Let λ1 = λp and λ2 = λ(1 − p), so λ = λ1 + λ2 and p = λ1 /(λ1 + λ2 ).
Then we find ourselves in Story 13.2.9. But Story 13.2.7 and Story 13.2.9 are two


Poisson processes                                                                  569

equivalent generative stories for superposition! The probabilistic structures of the
outputs of the two stories are identical, thinking of the arrivals in Story 13.2.7 from
(Ni (t) : t > 0) as being type-i. So we can assume instead that Story 13.2.7 was used
to generate the process. Happily, in this story we know from the beginning that the
type-1 process is independent of the type-2 process.                                  

Thus we can superpose independent Poisson processes to get a combined Poisson
process, or we can split a single Poisson process into independent Poisson processes.
Figure 13.5 is an illustration of thinning. We simply flipped Figure 13.3 upside-down,
which is appropriate because thinning is the flip side of superposition!

        λ=1



λ(1 - p) = 0.5

     λp = 0.5
                 0                                                                  10

FIGURE 13.5
Thinning. Starting with a single Poisson process, if we let each arrival be type-1
with probability p and type-2 with probability 1 − p, we obtain two independent
Poisson processes with rates λp and λ(1 − p). Here × represents type-1 events and
 represents type-2 events, and we take p = 0.5.

Thinning is the Poisson process analog of the chicken-egg story. Suppose that we thin
a Poisson process (N (t) : t > 0) of rate λ as in the statement of Theorem 13.2.14,
and let (Ni (t) : t > 0) be the process of type-i arrivals. Thinking of type-1 arrivals
as eggs that hatch, it follows immediately from the chicken-egg story that we have
N1 (t) ∼ Pois(λpt), N2 (t) ∼ Pois(λ(1 − p)t), with N1 (t) independent of N2 (t).
For practice and as an example of the elegance of thinning, let’s find the distribution
of a random sum in two different ways: using MGFs and conditional expectation,
and using thinning.
Example 13.2.15 (First Success sum of Exponentials). Let X1 , X2 , . . . be
i.i.d. Expo(λ) and N ∼ FS(p), independent of the Xj . Find the distribution of
the random sum
                                    XN
                                Y =     Xj .
                                          j=1

Solution:
We’ll solve this problem twice, first with tools from Chapter 9 and then with a
Poisson process story that uses thinning. For the first method, we recognize Y as
the sum of a random number of random variables, so we can find the MGF of


570                                                                  Introduction to Probability

Y using Adam’s law, conditioning on N . Recalling that the MGF of the Expo(λ)
distribution is λ/(λ − t) for t < λ, we have
                                 PN       
                  E etY = E E et j=1 Xj N
                                                         
                            = E E etX1 E etX2 . . . E etXN |N
                                      N 
                            = E E etX1
                                             N !
                                         λ
                            =E                       .
                                        λ−t

Now we can use LOTUS with the FS(p) PMF,

                           P (N = k) = q k−1 p for k = 1, 2, . . .

The LOTUS sum is
                                     N !     ∞ 
                                               X       k
                                 λ                  λ
                       E                     =            q k−1 p,
                                λ−t                λ−t
                                               k=1

which simplifies to λp/(λp − t) for t < λp, after doing some algebra and summing a
geometric series. This is the Expo(λp) MGF, so Y ∼ Expo(λp).
Now let’s see how Poisson processes can spare us from algebra while also providing
insight into why Y is Exponential. Using the embedding strategy, since the Xj
are i.i.d. Expo(λ) we are free to interpret the Xj as interarrival times in a Poisson
process with rate λ. So let’s imagine such a Poisson process, and let’s further imagine
that each of the arrivals is a special arrival with probability p, independently. Then
we can interpret N as the number of arrivals until the first special arrival and Y
as the waiting time for the first special arrival. But by the thinning property, the
special arrivals form a Poisson process with rate λp. The waiting time for the first
special arrival is thus distributed Expo(λp).                                        
Thinning works analogously with more than 2 types. In this setting, thinning is
sometimes called the coloring theorem.
Theorem 13.2.16 (Coloring). Let (N (t) : t > 0) be a Poisson process with rate
λ, and C be a finite set of “colors”, labeled from 1 through c. Suppose that each
arrival gets randomly assigned a color from C, with color i having probability pi .
The color assignments are independent of each other and independent of the arrival
times. Let (Ni (t) : t > 0) be the color i process, i.e., Ni (t) is the number of arrivals
with color i in (0, t]. Then (Ni (t) : t > 0) is a Poisson process with rate λpi , for
i = 1, 2, . . . , c, and these c monochromatic processes are independent.

Proof. We will induct on c. For c = 1 there is nothing to show. For c = 2 the result
is the thinning theorem that we already proved. Now assume that the result holds


Poisson processes                                                                               571

for c colors, and show it when there are c + 1 colors. Let’s call color 1 green. Use
thinning to assign each arrival to be green with probability p1 and non-green with
probability 1 − p1 . This splits the Poisson process into 2 independent processes: a
green process of rate λp1 and a non-green process of rate λ(1 − p1 ). By the inductive
hypothesis, we can then split the non-green process into c independent processes,
one for each of colors 2, 3, . . . , c + 1, where color j now gets probability
                                      pj              pj
                            p̃j =          =                        ,
                                    1 − p1   p2 + p3 + · · · + pc+1
for j = 2, 3, . . . , c + 1. We then have c + 1 independent Poisson processes, one for
each color, such that the process for color j has rate λpj for j = 1, 2, . . . , c + 1. 

The next example shows how coloring can help us decompose a complicated Poisson
process into more manageable components.
Example 13.2.17 (Cars on a highway). Suppose cars enter a one-way highway
from a common entrance, following a Poisson process with rate λ. The ith car has
velocity Vi and travels at this velocity forever; no time is lost when one car overtakes
another car. Assume the Vi are i.i.d. discrete r.v.s whose support is a finite set of
positive values. The process starts at time 0, and we’ll consider the highway entrance
to be at location 0.
For fixed locations a and b on the highway with 0 < a < b, let Zt be the number of
cars located in the interval [a, b] at time t. (For instance, on an interstate highway
running west to east through the midwestern United States, a could be Kansas
City and b could be St. Louis; then Zt would be the number of cars on the highway
that are in the state of Missouri at time t.) Figure 13.6 illustrates the setup of the
problem and the definition of Zt .
Assume that t is large enough that t > b/Vi for all possible values of Vi . Show that
Zt has a Poisson distribution with mean λ(b − a)E(Vi−1 ).
Solution:
Since the Vi are discrete with finite support, we can enumerate the set of possible
velocities v1 , . . . , vm and their probabilities p1 , . . . , pm . After doing so, we realize that
the cars entering the highway represent m types of arrivals, each corresponding to a
different velocity. This suggests breaking up our overall Poisson process into simpler
ones. Let’s color the Poisson process m ways according to the velocity of the cars,
resulting in a Poisson process with rate λp1 for cars of velocity v1 , a Poisson process
with rate λp2 for cars of velocity v2 , and so forth.
For each of these m separate Poisson processes, we can ask: within what time interval
do cars from this process have to enter the highway in order to be in [a, b] at time
t? This is a matter of physics, not statistics:

                                    distance = velocity · time,

so a car that enters the highway at time s with velocity v will be at position (t − s)v


572                                                              Introduction to Probability




                                    b


           distance along highway
                                    a




                                    0
                                        +



                                            +

                                                +

                                                    +
                                                    +


                                                           +
                                                           +




                                                               +
                                        0                            t
                                                    time

FIGURE 13.6
Cars enter a highway. Their entrance times form a Poisson process and are indicated
by ×’s on the time axis. The ith car has velocity Vi , represented by the slope of
the line emanating from the ith × symbol. We are interested in Zt , the number of
cars located in the interval [a, b] at time t. Here we observe Zt = 3, depicted by the
three stars.

at time t. Thus, in order for the car’s position to be between a and b, we require
its arrival time to be between t − b/v and t − a/v. (By our assumption that t is
sufficiently large, we don’t need to worry about t − b/v being negative.) If the car
arrives prior to time t − b/v, it will already have passed b by time t; if the car arrives
after time t − a/v, it won’t have reached a by time t.
We now have the answer for each of the separate Poisson processes. Within the
process where cars have velocity vj , the number of cars arriving between t − b/vj
and t − a/vj , which we’ll call Ztj , is distributed Pois(λpj (b − a)/vj ): the rate of the
process is λpj , and the length of the interval [t − b/vj , t − a/vj ] is (b − a)/vj .
Since the separate processes are independent, Zt1 through Ztm are independent
Poisson r.v.s. Thus,
                                                             
                                                         m
                                                         X p j
                 Zt = Zt1 + · · · + Ztm ∼ Pois λ(b − a)        ,
                                                           vj
                                                               j=1

      Pm                                  −1
and    j=1 pj /vj is the expectation of Vi   by LOTUS. This is what we wanted.           
```
