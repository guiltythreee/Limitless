# Chapter 12: Markov Chain Monte Carlo — Detailed Solutions

**Book:** Introduction to Probability, Second Edition  
**Authors:** Joseph K. Blitzstein and Jessica Hwang

> Source transcription from the supplied chapter-solution PDF. The solution numbering and worked reasoning are retained. Mathematical notation should be checked against the original source if a character appears ambiguous.

```text
INTRODUCTION TO PROBABILITY | CHAPTER 12                                                          DETAILED SOLUTIONS




 CHAPTER 12


 Markov Chain Monte Carlo
 Detailed, step-by-step exercise solutions



                3                         Separate chapter volume
                numbered exercises        based on the uploaded chapter PDF



 Scope
 Exercises 1–3 from Section 12.5 of the uploaded Markov chain Monte Carlo chapter. The solutions retain the
 chapter's emphasis on conditional distributions, stationary distributions, acceptance ratios, and
 unnormalized target probabilities.

 Notation and conventions
   • For Metropolis-Hastings, the normalizing constant of the target distribution cancels in the acceptance ratio.
   • For Gibbs sampling, each coordinate is sampled from its conditional distribution given the current values of
     all other coordinates.
   • A transition rule is specified completely by its proposal mechanism, acceptance rule, and treatment of
     rejected moves.

 How to use this volume
 Each solution follows the original exercise numbering. Intermediate reasoning is shown where it clarifies the
 method; final distributions, probabilities, and expectations are stated explicitly. Diagrams from the source
 are translated into transition rules or equations when needed.




Markov Chain Monte Carlo                                                                                      Page 1


INTRODUCTION TO PROBABILITY | CHAPTER 12                                                           DETAILED SOLUTIONS




 SOLUTIONS


 Chapter 12: Markov Chain Monte
 Carlo
 Exercise 1. Recovering a joint PMF from conditionals
 (a) Expressing p(y)
 Start from p(x)p(y|x)=p(y)p(x|y). For points in the common support, rearrange:

   p(x)/p(y) = p(x|y)/p(y|x).

 Sum both sides over x. The left side becomes 1/p(y), because ∑xp(x)=1.

   1/p(y) = ∑ p(x|y)/p(y|x), hence p(y) = [∑ p(x|y)/p(y|x)]−1.
               x                              x

 The stated support condition ensures that the relevant conditional probabilities are defined on the same
 y-support; the sum is over x for which the conditional terms are positive.

 (b) Why the conditionals determine the joint
 Part (a) reconstructs the marginal p(y) from the two conditional PMFs. Then the joint PMF follows from either
 factorization, for example p(x,y)=p(y)p(x|y). Therefore the two conditional distributions determine the full
 joint distribution.

 This is the key Gibbs-sampling idea: if the two conditional distributions are available, we can alternate draws
 from X|Y and Y|X. The joint PMF is the stationary distribution of the resulting systematic-scan Gibbs chain,
 even when we do not have a convenient direct sampler for the joint.



 Exercise 2. Uniform sampling over feasible particle configurations
 The feasible configurations are exactly the independent sets of the graph: no vertex is occupied more than
 once, and no two adjacent vertices are both occupied.

 Define a lazy single-site toggle chain. At each step, with probability 1/2 do nothing. Otherwise choose a
 vertex v uniformly from the n vertices. If v is occupied, remove its particle. If v is vacant and all its neighbors
 are vacant, add a particle at v. If v is vacant but has an occupied neighbor, leave the configuration
 unchanged.

 Two distinct feasible configurations x and y communicate in one move only when they differ at one vertex v.
 In that case the probability x→y is 1/(2n), and the reverse move y→x is also 1/(2n): adding a particle is
 allowed in y exactly when removing that same particle reverses the move. Thus qxy=qyx. The transition
 matrix is symmetric, so the uniform distribution over all feasible configurations satisfies detailed balance.

 The chain is irreducible: remove occupied vertices one at a time to reach the empty configuration, then add
 the vertices of any desired feasible configuration. The explicit 1/2 laziness gives a self-loop in every state, so
 it is also aperiodic.

   π(x)=1/|Ω| for every feasible configuration x, where Ω is the set of feasible configurations.




Markov Chain Monte Carlo                                                                                       Page 2


INTRODUCTION TO PROBABILITY | CHAPTER 12                                                         DETAILED SOLUTIONS




 Exercise 3. MCMC for a black-and-white image model
 (a) Systematic-scan Gibbs sampler
 Let N1(i) be the number of neighbors of pixel i that are white, and N0(i) the number that are black.
 Conditional on all other pixels, changing Y affects only edges incident to i. If Y =1, the agreement score on
                                               i                                   i
 these edges is N1(i); if Yi=0, it is N0(i). Hence

   P(Yi=1 | Y−i) = exp(βN1(i)) / [exp(βN1(i))+exp(βN0(i))] = 1/[1+exp(β(N0(i)−N1(i)))].

 Initialize any L×L black-and-white image. Visit pixels in a fixed order 1,…,L². At pixel i, calculate its current
 white and black neighbor counts and draw a new Y from the Bernoulli conditional above, holding all other
                                                     i
 pixels fixed. Repeat full sweeps. Each coordinate update is a Gibbs update for the target joint PMF; therefore
 the joint model is stationary for the systematic-scan chain.

 (b) Metropolis-Hastings by toggling one pixel
 From the current image y, choose a site i uniformly among L² sites and propose to toggle yi from 0 to 1 or 1
 to 0. This proposal is symmetric: the reverse toggle has the same probability 1/L².

 Let msame be the number of neighbors currently matching yi, and mdiff the number that differ. After toggling,
 these roles are reversed. Therefore the change in the exponent of the unnormalized target PMF is
 Δ=β(mdiff−msame). The acceptance probability is

   α(y,y′)=min{1, exp[β(m     −m      )]}.
                           diff   same

 Accept the toggle with this probability; otherwise retain the original image. The unknown normalizing
 constant cancels in the Metropolis-Hastings ratio. This chain has the required image-model PMF as its
 stationary distribution.




Markov Chain Monte Carlo                                                                                      Page 3
```
