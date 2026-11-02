import type { Lesson } from "./types";

/**
 * Deduplicated additions drawn from the even/odd chapter companion packs.
 * Existing lesson IDs are deliberately reused so saved progress and pathway
 * assignments remain stable. Only distinct concepts and question variants
 * are appended to the existing lessons.
 */
export const chapterPackAdditions: Record<string, Partial<Lesson>> = {
  "random-variables": {
    body: [
      "An indicator variable turns an event into a number: 1 when the event occurs and 0 otherwise. This makes event-counting problems algebraic. For events A and B, 1_(A∩B)=1_A 1_B and 1_(A∪B)=1_A+1_B−1_A1_B.",
      "If N counts how many of A₁,…,Aₙ occur, write N=Σᵢ1_Aᵢ. Linearity gives E[N]=ΣᵢP(Aᵢ), without requiring independence. This is often much easier than finding the full distribution of N."
    ],
    formulas: [
      { label: "Indicator expectation", text: "E[1_A]=P(A);  Var(1_A)=P(A)(1−P(A))" },
      { label: "Indicator algebra", text: "1_(A∩B)=1_A1_B;  1_(A∪B)=1_A+1_B−1_A1_B" },
      { label: "Counting events", text: "N=Σᵢ1_Aᵢ;  E[N]=ΣᵢP(Aᵢ)" }
    ],
    examples: [
      { title: "Expected number of defaults", problem: "Three independent loans default with probabilities 0.30, 0.06 and 0.005. Let N be the number of defaults. Find E[N].", steps: [
        "Write N=1_A+1_B+1_C, where each indicator records one loan defaulting.",
        "By linearity, E[N]=0.30+0.06+0.005=0.365.",
        "Independence is not needed for the expectation. It would be needed for many variance and distribution calculations."
      ] },
      { title: "Probability exactly two events occur", problem: "For three events, let S₁=ΣP(Aᵢ)=1.5, S₂=ΣP(Aᵢ∩Aⱼ)=0.6 and P(A₁∩A₂∩A₃)=0.1. Find P(exactly two occur).", steps: [
        "Let N=1_A₁+1_A₂+1_A₃. The quantity S₂ counts each outcome with exactly two events once and the triple intersection three times.",
        "The triple intersection contributes 3P(A₁∩A₂∩A₃), so P(N=2)=S₂−3S₃.",
        "Thus P(N=2)=0.6−3(0.1)=0.3."
      ] }
    ],
    quiz: [
      { question: "If N=1_A+1_B counts how many of two events occur, what is E[N]?", options: ["P(A)+P(B)", "P(A∩B)", "P(A)P(B)", "P(A∪B)"], answer: 0, difficulty: "easy", source: "ch5-indicator-expectation", explanation: "Linearity of expectation gives E[N]=E[1_A]+E[1_B]=P(A)+P(B), whether or not A and B are independent." },
      { question: "Which identity is valid for every pair of events A and B?", options: ["1_(A∪B)=1_A+1_B−1_A1_B", "1_(A∪B)=1_A1_B", "1_(A∩B)=1_A+1_B", "1_(Aᶜ)=1_A"], answer: 0, difficulty: "medium", source: "ch5-indicator-union", explanation: "The sum counts an outcome in A∩B twice, so subtract the product indicator once." },
      { question: "A portfolio has 20 independent positions, each defaulting with probability 0.02. What is the expected number of defaults?", options: ["0.4", "0.02", "0.08", "2"], answer: 0, difficulty: "easy", source: "ch5-indicator-portfolio", explanation: "Write the count as a sum of 20 indicators. Its expectation is 20×0.02=0.4." }
    ]
  },
  "discrete-distributions": {
    body: [
      "A discrete random variable is described by its support and probability mass function (PMF). The support contains the values with positive probability, and the PMF pₓ(x)=P(X=x) must be non-negative and sum to one over the support.",
      "The cumulative distribution function (CDF) Fₓ(x)=P(X≤x) records accumulated probability. Every CDF is non-decreasing and right-continuous, with limits 0 at −∞ and 1 at +∞. For a discrete variable it is a step function; the jump at x is exactly P(X=x).",
      "Endpoint conventions matter. P(a<X≤b)=F(b)−F(a), P(X<x)=F(x⁻), and P(X>x)=1−F(x). For integer-valued X, P(X≥k)=1−F(k−1). These identities prevent off-by-one errors in discrete tails.",
      "A quantile is the smallest x for which F(x) reaches the required probability level: Q(u)=inf{x:F(x)≥u}. In risk management, Value-at-Risk at level α is commonly this α-quantile of the loss distribution.",
      "To transform Y=g(X), add the probabilities of every original value that maps to y: pᵧ(y)=Σ_{x:g(x)=y}pₓ(x). If g is one-to-one, each output inherits one input mass; if several inputs collide, their masses must be added.",
      "The survival function S(k)=P(T>k) is useful for waiting times and reliability. A discrete hazard is the conditional probability of failure at a time, given survival up to that time. Keep the conditioning event and time convention explicit."
    ],
    formulas: [
      { label: "PMF", text: "pₓ(x)=P(X=x);  Σₓ pₓ(x)=1" },
      { label: "CDF and point mass", text: "Fₓ(x)=P(X≤x);  P(X=x)=Fₓ(x)−Fₓ(x⁻)" },
      { label: "Interval and tail probabilities", text: "P(a<X≤b)=F(b)−F(a);  P(X<x)=F(x⁻);  P(X>x)=1−F(x)" },
      { label: "Quantile", text: "Q(u)=inf{x:Fₓ(x)≥u}" },
      { label: "Discrete transformation", text: "pᵧ(y)=Σ_{x:g(x)=y}pₓ(x)" },
      { label: "Discrete hazard", text: "h_k=P(T=k|T≥k)=P(T=k)/P(T≥k)" }
    ],
    examples: [
      { title: "Reading a CDF at its jumps", problem: "A discrete variable has F(1)=0.1, F(2)=0.4, F(3)=0.9 and F(4)=1. Find P(X=3), P(2<X<4) and P(X≥3).", steps: [
        "The mass at 3 is the jump: P(X=3)=F(3)−F(2)=0.9−0.4=0.5.",
        "Since X is integer-valued, P(2<X<4)=P(X=3)=0.5.",
        "P(X≥3)=1−F(2)=0.6. The event X≥3 is the complement of X≤2."
      ] },
      { title: "A nonlinear payoff transformation", problem: "A stock price S takes values 80, 100 and 120 with probabilities 0.2, 0.5 and 0.3. A call with strike 100 pays C=max(S−100,0). Find the PMF of C.", steps: [
        "At S=80 and S=100, the call payoff is 0. These two probabilities combine.",
        "At S=120, the payoff is 20 with probability 0.3.",
        "Therefore P(C=0)=0.7 and P(C=20)=0.3. The two input values mapping to zero must be combined."
      ] },
      { title: "A discrete hazard rate", problem: "A component has survival probabilities S(1)=P(T>1)=0.9 and S(2)=P(T>2)=0.72. Find P(T=2|T≥2).", steps: [
        "The probability it survives the first period but fails by the second is S(1)−S(2)=0.18.",
        "The conditioning event T≥2 has probability S(1)=0.9 under this integer-time convention.",
        "The hazard is 0.18/0.9=0.2."
      ] }
    ],
    quiz: [
      { question: "The support of a discrete random variable X is", options: ["the set of values x with P(X=x)>0", "the set of all real numbers", "the set of values with probability 1", "the largest value of X"], answer: 0, difficulty: "easy", source: "ch5-support", explanation: "The support lists the values the variable actually takes with positive probability." },
      { question: "For a discrete random variable, the sum of its PMF over the support is", options: ["1", "0", "E[X]", "dependent on the number of support points"], answer: 0, difficulty: "easy", source: "ch5-pmf-total", explanation: "The events {X=x} over support values partition the sample space, so their probabilities sum to one." },
      { question: "A CDF is right-continuous. This means", options: ["F(x)=lim(h↓0)F(x+h)", "F(x)=lim(h↓0)F(x−h)", "F has no jumps", "F is differentiable"], answer: 0, difficulty: "easy", source: "ch5-cdf-right-continuity", explanation: "At a jump point, the CDF takes the upper value, which is the limit from the right." },
      { question: "The size of the jump of a CDF at x is", options: ["P(X=x)", "P(X≤x)", "P(X<x)", "1−F(x)"], answer: 0, difficulty: "easy", source: "ch5-cdf-jump", explanation: "P(X=x)=F(x)−F(x⁻), the difference between the value and its left limit." },
      { question: "For a<b, P(a<X≤b) equals", options: ["F(b)−F(a)", "F(b)−F(a⁻)", "F(a)−F(b)", "F(a)+F(b)"], answer: 0, difficulty: "medium", source: "ch5-cdf-interval", explanation: "The event {X≤b} splits into the disjoint events {X≤a} and {a<X≤b}." },
      { question: "For any real-valued random variable X, P(X<x) is", options: ["F(x⁻)", "F(x)", "1−F(x⁻)", "1−F(x)"], answer: 0, difficulty: "medium", source: "ch5-cdf-left-limit", explanation: "The strict inequality excludes any probability mass located exactly at x, so use the left limit." },
      { question: "If X is integer-valued, P(X≥k) equals", options: ["1−F(k−1)", "1−F(k)", "F(k−1)", "F(k)−F(k−1)"], answer: 0, difficulty: "medium", source: "ch5-integer-tail", explanation: "The complement of X≥k is X≤k−1." },
      { question: "A valid CDF must be", options: ["non-decreasing, right-continuous, with limits 0 and 1 at −∞ and +∞", "continuous and strictly increasing", "symmetric about zero", "differentiable everywhere"], answer: 0, difficulty: "medium", source: "ch5-valid-cdf", explanation: "These are the defining CDF properties; jumps are allowed." },
      { question: "For a CDF F, the median Q(1/2) is the smallest x such that", options: ["F(x)≥1/2", "F(x)=0", "F(x)>1", "F(x)≤1/2"], answer: 0, difficulty: "easy", source: "ch5-quantile-median", explanation: "The lower quantile convention is Q(u)=inf{x:F(x)≥u}." },
      { question: "Inverse-transform sampling starts with U uniform on (0,1) and sets", options: ["X=inf{x:F(x)≥U}", "X=F(U)", "X=1/U", "X=U for every distribution"], answer: 0, difficulty: "medium", source: "ch5-inverse-transform", explanation: "The generalized inverse CDF maps a uniform random number into the target distribution." },
      { question: "For indicators of events A and B, the union identity is", options: ["1_(A∪B)=1_A+1_B−1_A1_B", "1_(A∪B)=1_A1_B", "1_(A∪B)=1_A+1_B", "1_(A∪B)=1_A−1_B"], answer: 0, difficulty: "medium", source: "ch5-indicator-union-identity", explanation: "Subtract the product indicator to correct the double count when both events occur." },
      { question: "For Y=g(X) with discrete X, the PMF of Y is found by", options: ["adding pₓ(x) over all x with g(x)=y", "taking only one preimage of y", "applying g to pₓ(y)", "copying pₓ(y) unchanged"], answer: 0, difficulty: "medium", source: "ch5-transform-pmf", explanation: "All input values that map to the same output value contribute to that output's probability." },
      { question: "If Y=aX+b with a>0, then Fᵧ(y) is", options: ["Fₓ((y−b)/a)", "Fₓ(ay+b)", "aFₓ(y)+b", "1−Fₓ(y)"], answer: 0, difficulty: "medium", source: "ch5-transform-affine", explanation: "Because a is positive, {aX+b≤y} is equivalent to {X≤(y−b)/a}." },
      { question: "If Y=−X, then Fᵧ(y) is", options: ["P(X≥−y)", "Fₓ(−y)", "−Fₓ(y)", "1−Fₓ(y)"], answer: 0, difficulty: "hard", source: "ch5-transform-reflection", explanation: "The inequality −X≤y reverses to X≥−y. For discrete variables, endpoint mass must be handled carefully." },
      { question: "X takes values 1,2,3 with probabilities 0.2,0.5,0.3. If Y=(X−2)², what is P(Y=1)?", options: ["0.5", "0.2", "0.3", "0.8"], answer: 0, difficulty: "medium", source: "ch5-transform-many-to-one", explanation: "Y=1 occurs for X=1 or X=3, so add their masses: 0.2+0.3=0.5." },
      { question: "A stock price is 80, 100 or 120 with probabilities 0.2, 0.5 and 0.3. A call with strike 100 pays max(S−100,0). What is the probability the payoff is 20?", options: ["0.3", "0.5", "0.7", "0.2"], answer: 0, difficulty: "easy", source: "ch5-call-payoff", explanation: "A payoff of 20 occurs only when S=120, which has probability 0.3." },
      { question: "If X is discrete uniform on {1,…,n}, then P(X=k) is", options: ["1/n for each k", "k/n", "1/k", "1/(n−1)"], answer: 0, difficulty: "easy", source: "ch5-discrete-uniform", explanation: "A discrete uniform distribution assigns equal probability to each of its n support points." },
      { question: "X is uniform on {0,1,…,9}. What is Fₓ(3.7)?", options: ["0.4", "0.3", "0.37", "0.5"], answer: 0, difficulty: "medium", source: "ch5-discrete-uniform-cdf", explanation: "The values not exceeding 3.7 are 0,1,2,3: four of the ten equally likely values." },
      { question: "A component has S(1)=P(T>1)=0.9 and S(2)=P(T>2)=0.72. Its discrete hazard at time 2, P(T=2|T≥2), is", options: ["0.2", "0.18", "0.1", "0.28"], answer: 0, difficulty: "hard", source: "ch5-discrete-hazard", explanation: "The probability of failing at time 2 after surviving time 1 is (0.9−0.72)/0.9=0.2." },
      { question: "A loss L has P(L=0)=0.90, P(L=1)=0.06 and P(L=3)=0.04. What is VaR at confidence level 0.95 using Q(α)=inf{x:F(x)≥α}?", options: ["1", "0", "3", "0.95"], answer: 0, difficulty: "hard", source: "ch5-var-quantile", explanation: "F(0)=0.90<0.95 while F(1)=0.96≥0.95, so the 95% quantile is 1." },
      { question: "X is uniform on {2,3,4} and Y is uniform on {1,2,3}. Which statement holds?", options: ["Fₓ(x)≤Fᵧ(x) for all x; X is stochastically larger", "Fₓ(x)≥Fᵧ(x) for all x", "The CDFs are identical", "The CDFs must cross"], answer: 0, difficulty: "hard", source: "ch5-stochastic-order", explanation: "The CDF of X lies no higher than the CDF of Y at each threshold, so X is first-order stochastically larger." },
      { question: "X is uniform on {0,1,2,3,4} and independent of integer-valued Y. What is P((X+Y) mod 5=0)?", options: ["1/5", "It depends on the distribution of Y", "2/5", "1/4"], answer: 0, difficulty: "hard", source: "ch5-uniform-residue", explanation: "Condition on Y. Adding a fixed residue modulo 5 to a uniform residue remains uniform, so the conditional and unconditional probability is 1/5." },
      { question: "In a uniform random permutation of four distinct values, what is the probability there are exactly two left-to-right records?", options: ["11/24", "1/2", "1/4", "3/8"], answer: 0, difficulty: "hard", source: "ch5-records", explanation: "The record-count distribution for n=4 has unsigned Stirling counts (6,11,6,1), so the probability of two records is 11/24." },
      { question: "Three fair dice are rolled. What is the probability that exactly two distinct face values appear?", options: ["5/12", "1/36", "5/9", "1/2"], answer: 0, difficulty: "hard", source: "ch5-distinct-dice", explanation: "Choose the repeated face (6 ways), the singleton face (5 ways), and the singleton's position (3 ways): 90 outcomes out of 216, giving 5/12." }
    ]
  },
  "advanced-counting": {
    body: [
      "Some counting problems are best understood as paths on a lattice. A path with n up-steps and n down-steps that never goes below zero is a Dyck path; the reflection principle gives the Catalan number Cₙ=(1/(n+1)) binom(2n,n).",
      "The ballot theorem counts sequences in which one candidate stays strictly ahead throughout the count. The same reflection argument that counts constrained paths also appears in random walks and queueing.",
      "When sampling without replacement, use the hypergeometric model rather than a binomial model. The sample has a fixed number of successes in a finite population, so draws are dependent."
    ],
    formulas: [
      { label: "Catalan number", text: "Cₙ=(1/(n+1)) binom(2n,n)" },
      { label: "Hypergeometric PMF", text: "P(X=k)=binom(K,k)binom(N−K,n−k)/binom(N,n)" }
    ],
    examples: [
      { title: "A Catalan path count", problem: "How many paths from (0,0) to (4,4), using right and up steps, never go above the diagonal y=x?", steps: [
        "There are binom(8,4)=70 unrestricted paths.",
        "The reflection principle shows the paths that cross the diagonal correspond to binom(8,3)=56 paths under the complementary boundary convention.",
        "The Catalan count is C₄=(1/5)binom(8,4)=14. This counts paths that stay on the permitted side of the diagonal."
      ] },
      { title: "Sampling without replacement", problem: "A batch contains 5 defective and 15 good items. Four are sampled without replacement. Find the probability of exactly two defectives.", steps: [
        "This is hypergeometric: N=20, K=5 and n=4.",
        "Choose two of the five defectives and two of the fifteen good items.",
        "The probability is binom(5,2)binom(15,2)/binom(20,4)=1050/4845≈0.2167."
      ] }
    ],
    quiz: [
      { question: "The number of paths with n up-steps and n down-steps that never go below zero is", options: ["Cₙ=(1/(n+1))binom(2n,n)", "2ⁿ", "binom(2n,n)", "n!"], answer: 0, difficulty: "medium", source: "ch2-catalan", explanation: "These are Dyck paths, counted by the Catalan number. The reflection principle removes paths that cross the forbidden boundary." },
      { question: "A population has N items, K of them defective. A sample of n is drawn without replacement. The number of defectives follows", options: ["a hypergeometric distribution", "a binomial distribution with independent trials", "a geometric distribution", "a Poisson process"], answer: 0, difficulty: "easy", source: "ch2-hypergeometric", explanation: "Sampling without replacement from a finite population gives a hypergeometric count; the draws are dependent." },
      { question: "How many ways can 10 people be split into labelled teams of sizes 3, 3 and 4?", options: ["10!/(3!3!4!)", "10!/3!", "10!/(3!4!)", "3¹⁰"], answer: 0, difficulty: "medium", source: "ch2-multinomial", explanation: "The multinomial coefficient assigns distinct people to labelled groups with the specified sizes: 10!/(3!3!4!)." },
      { question: "Vandermonde's identity states that", options: ["Σₖ binom(r,k)binom(s,n−k)=binom(r+s,n)", "Σₖ binom(n,k)=n!", "binom(n,k)=n/k", "Σₖ k binom(n,k)=n"], answer: 0, difficulty: "hard", source: "ch2-vandermonde", explanation: "Choose n objects from two disjoint groups of sizes r and s, and condition on how many are selected from the first group." }
    ]
  },
  "conditional-independence": {
    body: [
      "Independence is especially useful in reliability. In a series system every component must work, so independent component reliabilities multiply. In a parallel system the system works if at least one component works, so compute the complement that all components fail.",
      "For a k-out-of-n system with independent, equally reliable components of reliability p, the system works when at least k components work. Its reliability is a binomial tail, not simply p or the product of all component reliabilities.",
      "For repeated independent tests or strategies, the probability of at least one false positive is 1−(1−α)ⁿ. This multiple-testing effect can be large even when the individual false-positive rate α is small."
    ],
    formulas: [
      { label: "Series reliability", text: "R_series=∏ᵢ pᵢ" },
      { label: "Parallel reliability", text: "R_parallel=1−∏ᵢ(1−pᵢ)" },
      { label: "k-out-of-n reliability", text: "R=Σ_{j=k}^n binom(n,j)pʲ(1−p)ⁿ⁻ʲ" },
      { label: "At least one false positive", text: "P(≥1)=1−(1−α)ⁿ" }
    ],
    examples: [
      { title: "Series and parallel components", problem: "Three independent components have reliabilities 0.9, 0.95 and 0.8. Find the reliability of a series system and of a parallel system.", steps: [
        "A series system requires all three components: 0.9×0.95×0.8=0.684.",
        "A parallel system fails only if all three fail: (0.1)(0.05)(0.2)=0.001.",
        "Its reliability is 1−0.001=0.999."
      ] },
      { title: "Multiple testing", problem: "One hundred independent strategies each have false-positive probability 0.05. Find the probability at least one appears successful by chance.", steps: [
        "The probability one strategy is not a false positive is 0.95.",
        "By independence, the probability none is a false positive is 0.95¹⁰⁰.",
        "Therefore the family-wise probability is 1−0.95¹⁰⁰≈0.9941."
      ] }
    ],
    quiz: [
      { question: "Three independent components with reliabilities 0.9, 0.95 and 0.8 are connected in series. What is system reliability?", options: ["0.684", "0.883", "0.95", "0.999"], answer: 0, difficulty: "easy", source: "ch4-series-reliability", explanation: "All components must work, so multiply: 0.9×0.95×0.8=0.684." },
      { question: "Two independent components have reliabilities 0.9 and 0.8 and are connected in parallel. What is system reliability?", options: ["0.98", "0.72", "0.85", "0.90"], answer: 0, difficulty: "medium", source: "ch4-parallel-reliability", explanation: "The system fails only if both fail: 1−(0.1)(0.2)=0.98." },
      { question: "A 2-out-of-3 system has independent components, each with reliability 0.9. What is its reliability?", options: ["0.972", "0.729", "0.900", "0.990"], answer: 0, difficulty: "hard", source: "ch4-k-out-of-n", explanation: "It works with exactly two or exactly three components: 3(0.9²)(0.1)+0.9³=0.243+0.729=0.972." },
      { question: "One hundred independent tests each have false-positive probability 0.05. The probability of at least one false positive is", options: ["1−0.95¹⁰⁰", "0.05", "100×0.05 exactly", "0.95¹⁰⁰"], answer: 0, difficulty: "hard", source: "ch4-multiple-testing", explanation: "Use the complement: none false positive has probability 0.95¹⁰⁰, so at least one is 1−0.95¹⁰⁰." }
    ]
  },
  "conditional": {
    examples: [
      { title: "Monty Hall: why switching helps", problem: "There are three doors, one hiding a prize. You choose one. The host, who knows where the prize is, opens a different door showing a goat and offers a switch. What is the probability of winning by switching?", steps: [
        "Your first choice is correct with probability 1/3 and wrong with probability 2/3.",
        "If your first choice is correct, switching loses. If it is wrong, the host is forced to reveal the other goat and switching wins.",
        "Therefore switching wins with probability 2/3, provided the host always opens a goat door and always offers the switch."
      ] },
      { title: "A reinforcing Pólya urn", problem: "An urn starts with one red and one blue ball. Draw one ball, replace it, and add another ball of the same colour. What is the probability the second draw has the same colour as the first?", steps: [
        "If the first draw is red, the urn then contains two red and one blue, so the chance of red again is 2/3.",
        "If the first draw is blue, symmetry gives probability 2/3 of blue again.",
        "Averaging the two first-draw cases gives probability 2/3. The draws are dependent because the first draw changes the urn."
      ] }
    ],
    quiz: [
      { question: "In the standard Monty Hall protocol, the host knows where the prize is, always opens a goat door and always offers a switch. What is the probability switching wins?", options: ["2/3", "1/2", "1/3", "1"], answer: 0, difficulty: "medium", source: "ch3-monty-hall", explanation: "Your initial choice is wrong with probability 2/3. In that case the host's forced reveal leaves the prize behind the other unopened door." },
      { question: "An urn starts with one red and one blue ball. Draw, replace, and add another ball of the colour drawn. What is the probability the second draw matches the first?", options: ["2/3", "1/2", "1/3", "3/4"], answer: 0, difficulty: "medium", source: "ch3-polya-urn", explanation: "After either first colour, the urn contains two of that colour and one of the other, so the conditional probability of a match is 2/3." },
      { question: "Why must the host's protocol be included in a Monty Hall calculation?", options: ["The host's action is informed and changes which doors can be opened", "The doors are no longer equally likely before the first choice", "The prize moves after the first choice", "Switching creates a new independent trial"], answer: 0, difficulty: "hard", source: "ch3-host-protocol", explanation: "The host knows the prize location and follows a rule. The revealed door is not a random door opening, so the protocol determines the conditional probabilities." }
    ]
  },
  "geometric-probability": {
    body: [
      "Buffon's needle is a geometric-probability model: parallel lines are separated by distance d, and a needle of length ℓ≤d is dropped with uniform position and orientation. The probability it crosses a line is 2ℓ/(πd). The calculation depends on the specified uniform model for position and angle.",
      "Bertrand's chord paradox warns that 'choose a random chord' is incomplete unless the randomisation procedure is specified. Choosing a midpoint uniformly in the disk, choosing endpoints uniformly on the circumference, and choosing a radius then a point produce different chord-length distributions."
    ],
    formulas: [
      { label: "Buffon's needle (ℓ≤d)", text: "P(crosses a line)=2ℓ/(πd)" }
    ],
    examples: [
      { title: "Buffon's needle", problem: "A needle of length 5 cm is dropped onto floorboards separated by 10 cm. Under the standard uniform position-and-orientation model, what is the crossing probability?", steps: [
        "Here ℓ=5 cm and d=10 cm, so ℓ≤d as required.",
        "Apply Buffon's formula: P=2ℓ/(πd)=10/(10π).",
        "The probability is 1/π≈0.3183."
      ] }
    ],
    quiz: [
      { question: "For Buffon's needle with needle length ℓ≤d and parallel-line spacing d, the crossing probability is", options: ["2ℓ/(πd)", "ℓ/d", "πℓ/(2d)", "ℓ²/d²"], answer: 0, difficulty: "medium", source: "ch1-buffon", explanation: "Under uniform position and orientation, the classical Buffon needle probability is 2ℓ/(πd)." },
      { question: "What is the central lesson of Bertrand's random-chord paradox?", options: ["A random object must be defined by a sampling procedure", "All ways of choosing a chord are equivalent", "A circle has no uniform measure", "Chord lengths are always uniform"], answer: 0, difficulty: "hard", source: "ch1-bertrand", explanation: "Different plausible procedures for selecting a chord induce different probability laws. The randomisation protocol is part of the model." }
    ]
  }
};
