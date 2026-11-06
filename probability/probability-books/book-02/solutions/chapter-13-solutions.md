# Chapter 13: Poisson Processes — Detailed Solutions

**Book:** Introduction to Probability, Second Edition  
**Authors:** Joseph K. Blitzstein and Jessica Hwang

> Source transcription from the supplied chapter-solution PDF. The solution numbering and worked reasoning are retained. Mathematical notation should be checked against the original source if a character appears ambiguous.

```text
INTRODUCTION TO PROBABILITY | CHAPTER 13                                                              DETAILED SOLUTIONS




 CHAPTER 13


 Poisson Processes
 Detailed, step-by-step exercise solutions



                    12                     Separate chapter volume
                    numbered exercises     based on the uploaded chapter PDF



 Scope
 Exercises 1–12 from Section 13.6 of the uploaded Poisson Processes chapter. The solutions use the source's
 count-time duality, conditioning, superposition, thinning, compound-Poisson, Cox-process, and Yule-process
 arguments.

 Notation and conventions
   • A rate-λ Poisson process has Pois(λt) counts over an interval of length t and independent counts on disjoint
     intervals.
   • Interarrival times are i.i.d. Expo(λ); conditional on a fixed number of arrivals in an interval, arrival times
     have the corresponding order-statistic law.
   • Gamma(α,β) uses β as a rate parameter in this text, so E(λ)=α/β and Var(λ)=α/β².

 How to use this volume
 Each solution follows the original exercise numbering. Intermediate reasoning is shown where it clarifies the
 method; final distributions, probabilities, and expectations are stated explicitly. Diagrams from the source
 are translated into transition rules or equations when needed.




Poisson Processes                                                                                                     Page 1


INTRODUCTION TO PROBABILITY | CHAPTER 13                                                         DETAILED SOLUTIONS




 SOLUTIONS


 Chapter 13: Poisson Processes
 Exercise 1. Total waiting time of passengers for a bus
 Consider one interval of length t between two buses. The number of passenger arrivals N in the interval is
 Pois(λt). Conditional on N=n, the n arrival times are i.i.d. Uniform(0,t). A passenger arriving at time u waits
 t−u, whose conditional mean is t/2.

 Conditional on N=n, the expected sum of waiting times is nt/2. Averaging over N gives

   E(total waiting time) = E(N)t/2 = (λt)(t/2) = λt²/2.



 Exercise 2. Cumulative earthquake intensity
                                  N(t)
 Let N(t)~Pois(λt) and S(t)=∑j=1  Zj, where the marks Zj are i.i.d., independent of N, with mean μ and
 variance σ². For a compound Poisson sum,

   E[S(t)] = E[N(t)]μ = λtμ.

 The variance includes both the variability in the marks and the randomness in the number of earthquakes:
 Var(S)=E[N]Var(Z)+Var(N)(E Z)².

   Var(S(t)) = λtσ² + λtμ² = λt(σ²+μ²).



 Exercise 3. Phone calls before a random battery lifetime
 Assume the battery lifetime T is independent of the Poisson call process. Conditional on T, N(T)~Pois(λT).
 Thus E[N(T)|T]=λT and Var(N(T)|T)=λT.

   E[N(T)] = E[λT]=λμ.

 Use the law of total variance:

   Var(N(T)) = E[Var(N(T)|T)] + Var(E[N(T)|T]) = λμ + λ²σ².

 Finally, Cov(T,N(T))=Cov(T,E[N(T)|T]) because T is known when conditioning on T.

   Cov(T,N(T)) = Cov(T,λT)=λVar(T)=λσ².



 Exercise 4. Total time spent answering emails
 Each email has a random response time W: with probability p it is work-related and has mean μW, variance
 σW²; with probability 1−p it is personal and has mean μP, variance σP². Let m=E(W).

   m = pμW+(1−p)μP.




Poisson Processes                                                                                             Page 2


INTRODUCTION TO PROBABILITY | CHAPTER 13                                                             DETAILED SOLUTIONS




 The email count in t hours is Pois(λt), and response times are independent marks. For a compound Poisson
 sum S, E(S)=λt E(W) and Var(S)=λt E(W²).

   E(S)=λt[pμW+(1−p)μP].

   Var(S)=λt[p(σW²+μW²)+(1−p)(σP²+μP²)].



 Exercise 5. Turnarounds in an endless soccer match
 (a) Expected number of turnarounds in n goals
 For each adjacent pair of goals, a turnaround occurs if the teams differ. The probability is
 p(1−p)+(1−p)p=2p(1−p). There are n−1 adjacent pairs.

   E(number of turnarounds) = 2p(1−p)(n−1).

 (b) Time from an A-to-B turnaround to the next B-to-A turnaround
 Immediately after the A-to-B turnaround, the latest goal was by B. A B-to-A turnaround occurs at the first
 future A goal; any number of additional B goals before it do not change that fact. The number of future goals
 until the first A is Geometric on {1,2,…} with mean 1/p. The interarrival times are i.i.d. Expo(λ), independent
 of goal labels, so the expected elapsed time is the expected number of arrivals times 1/λ.

   E(wait) = (1/p)(1/λ)=1/(λp).



 Exercise 6. Count-time duality
 The event “fewer than n arrivals by time t” is exactly the event “the nth arrival occurs after t.” Likewise, “at
 least n arrivals by t” is “the nth arrival has occurred by t.” Therefore the two equalities using Tn are

   P(N <n)=P(T >t), and P(N ≥n)=P(T ≤t).
       t            n         t        n

 The other two count events use the next arrival time: P(Nt≤n)=P(Tn+1>t), and P(Nt>n)=P(Tn+1≤t). Thus,
 when the right-hand side is specifically expressed using Tn, the true pairings are (<, >) and (≥, ≤).
 Because arrival times have continuous distributions, P(Tₙ=t)=0; no endpoint correction is needed.



 Exercise 7. Insurance claims in two time periods
 (a) Conditional allocation of claims
 Let t=t1+t2. The independent counts in the periods are N1~Pois(λt1) and N2~Pois(λt2). Conditioning on their
 sum N=n gives a binomial split:

   N1 | N=n ~ Bin(n, t1/t).

 (b) Conditional moments of the total paid in period 1
 Let p1=t1/t. Given N1, W1 is a sum of N1 i.i.d. claim amounts with mean μ and variance σ². Therefore
 E(W1|N1,N)=N1μ and Var(W1|N1,N)=N1σ².

   E(W1|N=n)=np1μ.

 By total variance, E[N1|N=n]=np1 and Var(N1|N=n)=np1(1−p1).




Poisson Processes                                                                                                Page 3


INTRODUCTION TO PROBABILITY | CHAPTER 13                                                         DETAILED SOLUTIONS




   Var(W1|N=n)=np1σ² + np1(1−p1)μ².



 Exercise 8. Answered and unanswered website questions
 (a) Probability a randomly timed post remains unanswered
 Let U~Unif(0,1) be the post time (in days) and S~Expo(λ ) the time needed for an answer. A post at time U
                                                        2
 remains unanswered at the end of the day if S>1−U.

                    1 −λ₂(1−u)             −λ₂
   punanswered = ∫0 e         du = (1−e       )/λ2.

 (b) Joint distribution of the two counts
 The total number of questions is Pois(λ ). Independently marking each question as unanswered with
                                           1
 probability p            is Poisson thinning. Thus unanswered and answered counts are independent Poisson
               unanswered
 random variables.

   U ~ Pois(λ p            ), A ~ Pois(λ (1−p              )), U   A.
               1 unanswered            1         unanswered

 Equivalently, for u,a≥0, P(U=u,A=a)=e−λ₁(λ1punanswered)u/u! · (λ1(1−punanswered))a/a!.



 Exercise 9. Inhomogeneous Poisson process
 (a) Thinning under the rate curve
 Start with a homogeneous Poisson process of rate λmax on the time interval, represented as uniform points in
 the rectangle [t1,t2)×[0,λmax]. Keep a point at time u exactly when its vertical coordinate is below λ(u). For
 any subinterval I, the accepted region has area ∫Iλ(u)du. Poisson thinning therefore gives an accepted count
 Pois(∫Iλ(u)du).

 Accepted regions lying over disjoint time intervals are disjoint, so their Poisson counts are independent.
 These are exactly the two defining properties of the inhomogeneous Poisson process. This is the thinning or
 rejection-sampling construction.

 (b) Hybrid joint density of the count and ordered arrival times
 Write Λ=∫0tλ(u)du. The total count is Pois(Λ). Conditional on N(t)=n, the unordered point locations are i.i.d.
                                                                                         n       n
 with density λ(u)/Λ on (0,t); their order statistics therefore have joint density n!∏j=1 λ(tj)/Λ on
 0<t1<…<tn<t.

   P(N(t)=n) × f(t₁,…,tₙ | N(t)=n) = [e−ΛΛn/n!]·[n!∏j=1nλ(tj)/Λn] = e−Λ∏j=1nλ(tj).



 Exercise 10. Cox process with a random rate
 (a) Why disjoint intervals are dependent
 Conditional on λ, counts in disjoint intervals are independent. Unconditionally, however, both counts share
 the same random rate. Observing an unusually high count in one interval suggests that λ is high, which also
 raises the expected count in the other interval. This shared random environment creates positive
 dependence.

 (b) Covariance for Gamma-mixed rate
 Let N1 count arrivals in [0,t) and N2 arrivals in [t,t+s). Given λ, the counts are independent with conditional
 means λt and λs. By the law of total covariance,




Poisson Processes                                                                                            Page 4


INTRODUCTION TO PROBABILITY | CHAPTER 13                                                                DETAILED SOLUTIONS




   Cov(N1,N2) = E[Cov(N1,N2|λ)] + Cov(λt,λs) = ts Var(λ).

 The book's Gamma(α,β) convention uses β as a rate parameter, so Var(λ)=α/β.

   Cov(N1,N2) = αts/β.



 Exercise 11. Superposition of two Yule processes
 (a) Interarrival rates of the superposition
 A Yule process with k current individuals has total birth rate kλ. Initially each of the two independent
 processes has one individual, so the superposed process begins with two individuals and total rate 2λ. After
 one arrival, the combined population is 3 and the total rate is 3λ; after the next it is 4λ, and so on.
 Independence makes the next-event rates add.

   The superposed interarrival times are independent with laws Expo(2λ), Expo(3λ), Expo(4λ), … .

 (b) Pólya urn representation of arrival types
 If process 1 currently contains k1 individuals and process 2 contains k2, the probability that the next
 superposed arrival comes from process 1 is its rate divided by the total rate:
 k1λ/[(k1+k2)λ]=k1/(k1+k22/(k1+k2]. Each arrival increases the population of its own type by one. This is
 exactly the urn scheme: draw a ball uniformly, replace it, and add another ball of the same label.



 Exercise 12. Coupon collector with unequal type probabilities
 (a) First arrival times of each type
 Mark each point of the rate-1 Poisson process independently as type j with probability pj. By independent
 thinning, the type-j points form independent Poisson processes with rates pj. Therefore Yj, the first arrival
 time of type j, is Expo(pj), and Y1,…,Yn are independent.

 (b) Relating continuous time to the number of collected toys
 Let N be the number of toy arrivals needed to see every type. The time of the Nth point is T=X1+…+XN,
 where Xk are the rate-1 exponential interarrival times. The marks (toy types) determining N are independent
 of the interarrival times. Since E(Xk)=1,

   E(T|N)=N, hence E(T)=E(N).

 (c) Integral formula
 T=max(Y1,…,Yn). Independence gives

   P(T≤t)=∏j=1n(1−e−pⱼt), P(T>t)=1−∏j=1n(1−e−pⱼt).

 For a nonnegative random variable, E(T)=∫0∞P(T>t)dt. Combining this with E(T)=E(N) gives the required
 expression:

   E(N)=∫0∞[1−∏j=1n(1−e−pⱼt)]dt.

 This is finite when every pⱼ>0. If any type has probability zero, collecting a full set is impossible and E(N)=∞.




Poisson Processes                                                                                                    Page 5
```
