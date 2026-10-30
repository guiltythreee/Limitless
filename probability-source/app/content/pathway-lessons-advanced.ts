import type { Lesson } from "./types";

export const advancedPathwayLessons: Lesson[] = [
  {
    id: "random-permutations", rank: 8, title: "Random Permutations, Fixed Points & Derangements", minutes: 22,
    description: "Analyse random arrangements without treating position events as independent.",
    objective: "Count derangements and use indicators to find permutation statistics.",
    body: [
      "A uniform permutation of n distinct objects has n! equally likely arrangements. A fixed point is an object in its original position; a derangement has no fixed points.",
      "Inclusion–exclusion gives Dₙ=n!Σⱼ₌₀ⁿ(−1)ʲ/j!, so P(no fixed points)=Σⱼ₌₀ⁿ(−1)ʲ/j!, which approaches e⁻¹.",
      "Let Iᵢ indicate whether object i is fixed. Each has expectation 1/n, so if X=ΣIᵢ is the number of fixed points, E[X]=1 by linearity. Independence is not needed for this expectation."
    ],
    formulas: [{ label: "Derangements", text: "Dₙ=n!Σⱼ₌₀ⁿ(−1)ʲ/j!" }, { label: "Expected fixed points", text: "E[X]=ΣᵢE[Iᵢ]=1" }],
    examples: [
      { title: "Four letters", problem: "Four letters are placed uniformly at random into four addressed envelopes. Find the probability that no letter reaches its addressed envelope.", steps: ["There are 4!=24 equally likely permutations.", "Inclusion–exclusion gives D₄=24−24+12−4+1=9.", "Therefore P(no fixed points)=9/24=3/8."] },
      { title: "Expected fixed points", problem: "Find the expected number of fixed points in a uniform permutation of n objects.", steps: ["For each object i, let Iᵢ=1 if it is fixed.", "Each object is equally likely to occupy any of n positions, so E[Iᵢ]=1/n.", "Linearity gives E[X]=ΣE[Iᵢ]=n/n=1."] }
    ],
    quiz: [
      { question: "What is the probability a uniform permutation of four objects has no fixed points?", options: ["1/4", "3/8", "1/2", "5/8"], answer: 1, difficulty: "easy", explanation: "There are 9 derangements among 24 permutations, so the probability is 9/24=3/8." },
      { question: "The expected number of fixed points in a uniform permutation of n objects is", options: ["1/n", "1", "n/2", "n"], answer: 1, difficulty: "medium", explanation: "Every object is fixed with probability 1/n, giving an expected total n·(1/n)=1." },
      { question: "What is the probability a uniform permutation of five objects has at least one fixed point?", options: ["11/30", "19/30", "1/5", "4/5"], answer: 1, difficulty: "hard", explanation: "D₅=44, so the probability is 1−44/120=19/30." }
    ]
  },
  {
    id: "negative-binomial", rank: 4, title: "Negative Binomial & Repeated Successes", minutes: 22,
    description: "Model the number of trials needed to collect a fixed number of successes.",
    objective: "Use the negative-binomial PMF and moments, while stating the waiting-time convention.",
    body: [
      "Let T count IID Bernoulli(p) trials through the r-th success. For T=k, trial k is a success and exactly r−1 of the first k−1 trials are successes.",
      "There are C(k−1,r−1) ways to place those earlier successes, hence P(T=k)=C(k−1,r−1)pʳ(1−p)ᵏ⁻ʳ for k≥r.",
      "T is a sum of r independent geometric(p) waiting times, so E[T]=r/p and Var(T)=r(1−p)/p². A different convention counts failures before the r-th success; that variable is T−r."
    ],
    formulas: [{ label: "PMF", text: "P(T=k)=C(k−1,r−1)pʳ(1−p)ᵏ⁻ʳ, k≥r" }, { label: "Mean and variance", text: "E[T]=r/p, Var(T)=r(1−p)/p²" }],
    examples: [
      { title: "Third success on trial five", problem: "Independent trials have success probability 0.4. Find the probability that the third success occurs on trial 5.", steps: ["Trial 5 must be a success; among the first four trials there must be exactly two successes.", "There are C(4,2)=6 arrangements of the first two successes.", "P(T=5)=6(0.4)³(0.6)²=0.13824."] },
      { title: "Expected waiting time", problem: "A trial succeeds with probability 0.25. Find the expected number of trials through the third success.", steps: ["Each geometric waiting time has mean 1/p=4 trials.", "The total waiting time is the sum of three such waiting times.", "Thus E[T]=r/p=3/0.25=12 trials."] }
    ],
    quiz: [
      { question: "For a waiting time counting trials through the r-th success, the smallest possible value is", options: ["0", "1", "r", "r+1"], answer: 2, difficulty: "easy", explanation: "At least r trials are required to observe r successes." },
      { question: "If p=0.5, how many trials are expected to obtain four successes?", options: ["2", "4", "8", "16"], answer: 2, difficulty: "medium", explanation: "E[T]=r/p=4/0.5=8 trials." },
      { question: "With p=0.4, what is the probability the second success occurs on trial 4?", options: ["0.0384", "0.1728", "0.13824", "0.2304"], answer: 1, difficulty: "hard", explanation: "P(T=4)=C(3,1)(0.4)²(0.6)²=0.1728." }
    ]
  },
  {
    id: "normal-distribution", rank: 4, title: "Normal Distribution & Standardization", minutes: 24,
    description: "Standardize normal variables and combine independent normal measurements.",
    objective: "Calculate normal tail probabilities and linear-combination distributions.",
    body: [
      "For X~N(μ,σ²), Z=(X−μ)/σ follows N(0,1). The standard normal CDF Φ then gives interval and tail probabilities.",
      "If X is normal, aX+b has mean aμ+b and variance a²σ². Variance scales by the square of the multiplier.",
      "Independent normal variables remain normal under linear combinations. With dependence, covariance terms must be included; standardization alone does not make a non-normal variable normal."
    ],
    formulas: [{ label: "Standardization", text: "Z=(X−μ)/σ ∼ N(0,1)" }, { label: "Affine transform", text: "aX+b ∼ N(aμ+b,a²σ²)" }],
    examples: [
      { title: "A quality threshold", problem: "Measurements follow N(100,15²). Estimate the probability a measurement exceeds 130.", steps: ["Standardize: z=(130−100)/15=2.", "P(X>130)=1−Φ(2).", "Since Φ(2)≈0.97725, the upper tail is approximately 0.02275."] },
      { title: "Difference of measurements", problem: "Independent variables have distributions N(10,4) and N(3,9), where the second parameter is variance. Find the distribution of X−Y.", steps: ["The mean difference is 10−3=7.", "Independence gives Var(X−Y)=4+9=13.", "Thus X−Y~N(7,13)."] }
    ],
    quiz: [
      { question: "If X~N(50,10²), the standardized value at X=70 is", options: ["1", "2", "7", "20"], answer: 1, difficulty: "easy", explanation: "z=(70−50)/10=2." },
      { question: "Independent variables with variances 4 and 9 have difference variance", options: ["5", "13", "25", "−5"], answer: 1, difficulty: "medium", explanation: "Var(X−Y)=Var(X)+Var(Y) under independence, so the result is 13." },
      { question: "If X~N(100,15²), approximately what is P(X>130)?", options: ["0.50", "0.1587", "0.0228", "0.9772"], answer: 2, difficulty: "hard", explanation: "The standardized value is 2, so P(X>130)=1−Φ(2)≈0.0228." }
    ]
  },
  {
    id: "gamma-beta-distributions", rank: 4, title: "Gamma, Exponential & Beta Distributions", minutes: 25,
    description: "Connect waiting-time distributions and models on a bounded interval.",
    objective: "Use the parameters, moments, survival functions, and units of common continuous distributions.",
    body: [
      "An exponential variable with rate λ has mean 1/λ, variance 1/λ², survival e^(−λt), and a constant hazard. Its memoryless property can be inappropriate for aging components.",
      "A Gamma variable with shape α and rate λ has mean α/λ and variance α/λ². Exponential is Gamma(1,λ); sums of independent exponentials with the same rate are gamma distributed.",
      "A Beta(α,β) variable lies on (0,1), has mean α/(α+β), and is useful for modelling uncertain probabilities. Gamma rate λ and scale θ=1/λ are different parameterizations."
    ],
    formulas: [{ label: "Exponential survival and mean", text: "P(X>t)=e^(−λt), E[X]=1/λ" }, { label: "Gamma mean and variance", text: "E[X]=α/λ, Var(X)=α/λ²" }, { label: "Beta mean", text: "E[X]=α/(α+β)" }],
    examples: [
      { title: "Exponential survival", problem: "A component lifetime is exponential with rate 2 per hour. Find the probability it lasts longer than 30 minutes.", steps: ["Convert 30 minutes to 0.5 hours.", "P(X>t)=e^(−λt)=e^(−2·0.5).", "The probability is e⁻¹≈0.3679."] },
      { title: "A beta mean", problem: "Let P~Beta(2,3). Find E[P].", steps: ["Use E[P]=α/(α+β).", "Substitute α=2 and β=3.", "E[P]=2/5=0.4."] }
    ],
    quiz: [
      { question: "An exponential variable has rate 4 per hour. Its mean waiting time is", options: ["4 hours", "1/4 hour", "1/16 hour", "2 hours"], answer: 1, difficulty: "easy", explanation: "The mean is 1/λ=1/4 hour, or 15 minutes." },
      { question: "A Gamma variable with shape 6 and rate 2 has mean", options: ["3", "12", "1/3", "8"], answer: 0, difficulty: "medium", explanation: "Under rate parameterization, E[X]=α/λ=6/2=3." },
      { question: "If P~Beta(3,5), what is E[P]?", options: ["5/8", "3/5", "3/8", "1/8"], answer: 2, difficulty: "hard", explanation: "E[P]=3/(3+5)=3/8." }
    ]
  },
  {
    id: "sums-convolution", rank: 3, title: "Sums of Random Variables & Convolution", minutes: 24,
    description: "Find distributions of sums by combining the ways variables can add to a target.",
    objective: "Use discrete and continuous convolution and recognize closed-form sum laws.",
    body: [
      "For independent discrete variables, P(X+Y=s)=ΣₓP(X=x)P(Y=s−x). Each valid split contributes a product of marginal probabilities.",
      "For independent continuous variables, the density of S=X+Y is f_S(s)=∫f_X(x)f_Y(s−x)dx over the valid support.",
      "Support determines the integration bounds. Independent Poisson parameters add; independent normal means and variances add; gamma shapes add when rates match."
    ],
    formulas: [{ label: "Discrete convolution", text: "P(X+Y=s)=ΣₓP(X=x)P(Y=s−x)" }, { label: "Continuous convolution", text: "fS(s)=∫fX(x)fY(s−x)dx" }],
    examples: [
      { title: "The sum of two dice", problem: "Two independent fair dice are rolled. Find the probability their sum is 7.", steps: ["Six ordered pairs sum to 7.", "Each pair has probability 1/36.", "Thus the probability is 6/36=1/6."] },
      { title: "Two exponential waits", problem: "X and Y are independent exponential variables with rate 1. Find the density of S=X+Y for s>0.", steps: ["Convolution gives ∫₀ˢe^(−x)e^(−(s−x))dx.", "The integrand is e^(−s), so the integral is s e^(−s).", "This is the Gamma(shape 2, rate 1) density."] }
    ],
    quiz: [
      { question: "For independent discrete X and Y, the probability P(X+Y=s) is found by", options: ["Adding the means", "Summing P(X=x)P(Y=s−x) over valid x", "Multiplying the means", "Taking P(X=s)P(Y=s)"], answer: 1, difficulty: "easy", explanation: "Each valid split contributes a joint probability that factors by independence." },
      { question: "Independent Poisson variables with rates 2 and 5 sum to", options: ["Poisson(3)", "Poisson(7)", "Poisson(10)", "Binomial(7,1/2)"], answer: 1, difficulty: "medium", explanation: "The sum is Poisson with parameter 2+5=7." },
      { question: "For IID exponential(rate 1) variables X,Y, the density of X+Y is", options: ["e^(−s)", "2e^(−2s)", "s e^(−s)", "s²e^(−s)"], answer: 2, difficulty: "hard", explanation: "Convolution gives ∫₀ˢe^(−s)dx=s e^(−s)." }
    ]
  },
  {
    id: "order-statistics", rank: 3, title: "Order Statistics, Minima & Maxima", minutes: 23,
    description: "Find the distributions of the smallest and largest sample observations.",
    objective: "Derive extrema CDFs and use uniform order-statistic expectations.",
    body: [
      "For IID observations with CDF F, the maximum M satisfies P(M≤x)=F(x)ⁿ. The minimum m satisfies F_m(x)=1−[1−F(x)]ⁿ.",
      "Where a density exists, f_M(x)=nF(x)^(n−1)f(x) and f_m(x)=n[1−F(x)]^(n−1)f(x).",
      "For IID Uniform(0,1), E[X_(k)]=k/(n+1), so the expected minimum is 1/(n+1) and maximum n/(n+1)."
    ],
    formulas: [{ label: "Maximum CDF", text: "F_M(x)=F(x)ⁿ" }, { label: "Minimum CDF", text: "F_m(x)=1−(1−F(x))ⁿ" }],
    examples: [
      { title: "Maximum of three uniforms", problem: "Three IID Uniform(0,1) observations are taken. Find the probability their maximum is at most 1/2.", steps: ["Each observation is at most 1/2 with probability 1/2.", "All three must be at most 1/2.", "The probability is (1/2)³=1/8."] },
      { title: "Expected extrema", problem: "For five IID Uniform(0,1) variables, find the expected minimum and maximum.", steps: ["The k-th order statistic has expectation k/(n+1).", "For the minimum k=1 and for the maximum k=5.", "The means are 1/6 and 5/6, respectively."] }
    ],
    quiz: [
      { question: "For n IID observations with CDF F, the CDF of their maximum is", options: ["F(x)/n", "F(x)ⁿ", "1−F(x)ⁿ", "nF(x)"], answer: 1, difficulty: "easy", explanation: "The maximum is at most x only if every observation is at most x, giving F(x)ⁿ." },
      { question: "For three IID Uniform(0,1) observations, P(max≤1/2) is", options: ["1/2", "1/4", "1/8", "3/8"], answer: 2, difficulty: "medium", explanation: "Independence gives (1/2)³=1/8." },
      { question: "For n IID Uniform(0,1) variables, the expected second-smallest observation is", options: ["1/(n+1)", "2/(n+1)", "n/(n+1)", "1/2"], answer: 1, difficulty: "hard", explanation: "The k-th uniform order statistic has mean k/(n+1); set k=2." }
    ]
  },
  {
    id: "bayesian-inference", rank: 3, title: "Bayesian Updating & Posterior Prediction", minutes: 24,
    description: "Update an uncertain probability and predict future observations.",
    objective: "Apply Beta–Binomial updating and distinguish posterior predictions from plug-in estimates.",
    body: [
      "Bayesian inference combines a prior distribution for a parameter with the likelihood of observed data to obtain a posterior distribution.",
      "For Bernoulli probability p, a Beta(α,β) prior and s successes, f failures give posterior Beta(α+s,β+f).",
      "The posterior mean is (α+s)/(α+β+s+f). The predictive success probability for the next Bernoulli trial equals this posterior mean, averaging over parameter uncertainty."
    ],
    formulas: [{ label: "Posterior", text: "p|data ∼ Beta(α+s,β+f)" }, { label: "Posterior mean", text: "E[p|data]=(α+s)/(α+β+s+f)" }],
    examples: [
      { title: "Update a success rate", problem: "A Beta(2,2) prior observes 7 successes and 3 failures. Find the posterior and mean.", steps: ["Add successes and failures to the respective parameters.", "The posterior is Beta(9,5).", "The posterior mean is 9/14≈0.6429."] },
      { title: "Predict the next trial", problem: "With a Beta(1,1) prior, data contain 3 successes and 1 failure. Find the next-trial predictive probability.", steps: ["The posterior is Beta(4,2).", "Its mean is 4/(4+2).", "The predictive success probability is 2/3."] }
    ],
    quiz: [
      { question: "A Beta(2,3) prior observes 4 successes and 2 failures. The posterior is", options: ["Beta(4,2)", "Beta(6,5)", "Beta(2,3)", "Beta(8,7)"], answer: 1, difficulty: "easy", explanation: "Update the parameters to α=2+4=6 and β=3+2=5." },
      { question: "With a Beta(1,1) prior and 3 successes, 1 failure, the next-trial predictive success probability is", options: ["1/2", "3/4", "2/3", "4/5"], answer: 2, difficulty: "medium", explanation: "The posterior is Beta(4,2), with mean 4/6=2/3." },
      { question: "Why can the posterior predictive probability differ from the observed fraction s/n?", options: ["Bayes' rule cannot use binomial data", "The posterior incorporates prior information and parameter uncertainty", "It must always equal 1/2", "The prior always dominates the data"], answer: 1, difficulty: "hard", explanation: "The posterior mean incorporates prior parameters and the observations, rather than only the observed fraction." }
    ]
  },
  {
    id: "joint-transformations", rank: 3, title: "Joint Transformations & the Jacobian", minutes: 25,
    description: "Transform two random variables without losing probability mass.",
    objective: "Use inverse mappings and Jacobians to derive joint densities.",
    body: [
      "For a differentiable one-to-one transformation (U,V)=g(X,Y), the transformed joint density is the original joint density at the inverse mapping multiplied by the absolute inverse Jacobian determinant.",
      "The Jacobian adjusts for local area expansion or contraction. The support must also be transformed correctly.",
      "For independent Exp(1) variables set U=X+Y and V=X/(X+Y). The inverse is x=uv, y=u(1−v), and the absolute Jacobian is u. Thus f_U,V(u,v)=u e^(−u) for u>0, 0<v<1, factoring into Gamma(2,1) and Uniform(0,1) densities."
    ],
    formulas: [{ label: "Change of variables", text: "fU,V(u,v)=fX,Y(x(u,v),y(u,v))|∂(x,y)/∂(u,v)|" }, { label: "Inverse Jacobian", text: "|J|=u" }],
    examples: [
      { title: "Sum-ratio transformation", problem: "For independent Exp(1) variables X,Y, let U=X+Y and V=X/(X+Y). Derive the joint density.", steps: ["The inverse is x=uv and y=u(1−v), with u>0 and 0<v<1.", "The original joint density is e^(−u), and the inverse Jacobian magnitude is u.", "Therefore f_U,V(u,v)=u e^(−u) on the transformed support."] },
      { title: "Marginals and independence", problem: "Use the preceding joint density to identify U and V.", steps: ["Integrating over v gives f_U(u)=u e^(−u), a Gamma(2,1) density.", "Integrating over u gives f_V(v)=1 for 0<v<1.", "The joint density factors into the marginals, so U and V are independent."] }
    ],
    quiz: [
      { question: "The Jacobian determinant in a density transformation adjusts for", options: ["Sample size", "Change in area under the coordinate map", "Independence automatically", "The mean"], answer: 1, difficulty: "easy", explanation: "Its absolute value accounts for local area expansion or contraction, preserving probability mass." },
      { question: "For U=X+Y and V=X/(X+Y), the inverse mapping is", options: ["x=u+v, y=u−v", "x=uv, y=u(1−v)", "x=u/v, y=v/u", "x=u², y=v²"], answer: 1, difficulty: "medium", explanation: "Since V=X/U, X=UV and Y=U−X." },
      { question: "If the original joint density is e^(−u) and the inverse Jacobian magnitude is u, the transformed density is", options: ["e^(−u)", "u e^(−u)", "u²e^(−u)", "e^(−2u)"], answer: 1, difficulty: "hard", explanation: "Multiply the original density by the absolute inverse Jacobian: u e^(−u)." }
    ]
  },
  {
    id: "chernoff-hoeffding", rank: 2, title: "Chernoff & Hoeffding Tail Bounds", minutes: 25,
    description: "Use exponential moments to bound rare deviations of sums.",
    objective: "Apply the Chernoff step and Hoeffding's inequality under their assumptions.",
    body: [
      "Chernoff's method applies Markov's inequality to e^(tS): for t>0, P(S≥a)≤e^(−ta)E[e^(tS)]. Optimizing t may yield an exponential tail bound.",
      "For IID variables in [a,b], Hoeffding gives P(|X̄−E[X]|≥ε)≤2exp(−2nε²/(b−a)²). Independence and boundedness are important assumptions.",
      "An upper bound is not an exact probability and may be conservative. A finite mean alone does not justify Hoeffding's bound."
    ],
    formulas: [{ label: "Chernoff step", text: "P(S≥a)≤infₜ>₀ e^(−ta)E[e^(tS)]" }, { label: "Hoeffding", text: "P(|X̄−E[X]|≥ε)≤2exp(−2nε²/(b−a)²)" }],
    examples: [
      { title: "A bounded sample mean", problem: "IID observations lie in [0,1]. For n=100, bound the probability their mean differs from its expectation by at least 0.1.", steps: ["Substitute n=100, ε=0.1 and b−a=1.", "Hoeffding gives 2exp(−2·100·0.1²)=2e^(−2).", "The numerical bound is about 0.2707, not an estimate of the actual probability."] },
      { title: "Derive the Chernoff step", problem: "For t>0, derive a bound on P(S≥a) using an exponential moment.", steps: ["If S≥a then e^(tS)≥e^(ta).", "Apply Markov: P(e^(tS)≥e^(ta))≤E[e^(tS)]/e^(ta).", "Thus P(S≥a)≤e^(−ta)E[e^(tS)]; optimize t when possible."] }
    ],
    quiz: [
      { question: "Chernoff's method applies Markov's inequality to", options: ["S−E[S]", "e^(tS)", "S²−E[S²]", "Only an event indicator"], answer: 1, difficulty: "easy", explanation: "For t>0, e^(tS) is nonnegative and S≥a implies e^(tS)≥e^(ta)." },
      { question: "For IID variables in [0,1], n=100 and ε=0.1, Hoeffding's two-sided bound is", options: ["2e^(−2)", "e^(−100)", "0.1", "1/100"], answer: 0, difficulty: "medium", explanation: "Substitution gives 2 exp(−2·100·0.01)=2e^(−2)." },
      { question: "The standard Hoeffding inequality for independent bounded variables", options: ["Gives an exact probability", "Needs only a finite mean", "Assumes independence and bounded ranges", "Means the true probability equals the bound"], answer: 2, difficulty: "hard", explanation: "Independence and bounded ranges are assumptions, and the result is an upper bound rather than an equality." }
    ]
  },
  {
    id: "random-walks", rank: 1, title: "Random Walks & Gambler's Ruin", minutes: 26,
    description: "Analyse hitting probabilities and absorption times in discrete random walks.",
    objective: "Solve fair-walk first-step equations and recognize the limits of their formulas.",
    body: [
      "A simple random walk adds independent increments: +1 with probability p and −1 with probability q=1−p.",
      "For a fair walk absorbed at 0 or N, the probability of reaching N first from i solves hᵢ=(hᵢ₋₁+hᵢ₊₁)/2, with h₀=0 and h_N=1; the solution is i/N.",
      "The expected absorption time solves mᵢ=1+(mᵢ₋₁+mᵢ₊₁)/2 with zero boundary values, giving mᵢ=i(N−i). The formula changes for biased walks."
    ],
    formulas: [{ label: "Fair hitting probability", text: "Pᵢ(hit N before 0)=i/N" }, { label: "Fair expected absorption time", text: "Eᵢ[T]=i(N−i)" }],
    examples: [
      { title: "Reach the upper boundary", problem: "A fair gambler starts with 3 units and stops at 0 or 10 units. Find the probability of reaching 10 first.", steps: ["The walk starts at i=3 and the upper boundary is N=10.", "For a fair walk the hitting probability is i/N.", "The answer is 3/10."] },
      { title: "Expected duration", problem: "A fair walk starts at 3 with absorbing boundaries 0 and 10. Find its expected absorption time.", steps: ["Use mᵢ=i(N−i).", "Substitute i=3, N=10.", "The expected number of steps is 3·7=21."] }
    ],
    quiz: [
      { question: "For a fair gambler's ruin walk starting at i, the probability of hitting N before 0 is", options: ["1/2", "i/N", "i²/N²", "(N−i)/N"], answer: 1, difficulty: "easy", explanation: "The first-step equation has the linear solution hᵢ=i/N." },
      { question: "A fair walk starts at i=2 with boundaries 0 and 8. Its expected absorption time is", options: ["6", "8", "12", "16"], answer: 2, difficulty: "medium", explanation: "mᵢ=i(N−i)=2(8−2)=12 steps." },
      { question: "Why does the fair-walk hitting formula not apply unchanged when p≠1/2?", options: ["The state space becomes continuous", "The first-step equation changes", "Absorption becomes impossible", "Independence fails"], answer: 1, difficulty: "hard", explanation: "For a biased walk the first-step equation is hᵢ=phᵢ₊₁+qhᵢ₋₁, not the fair averaging equation." }
    ]
  },
  {
    id: "branching-processes", rank: 1, title: "Branching Processes & Extinction", minutes: 25,
    description: "Model populations that reproduce independently each generation.",
    objective: "Find extinction probabilities from offspring generating functions.",
    body: [
      "In a Galton–Watson process, each individual independently produces a random number of offspring with a common law.",
      "If the offspring PGF is G(s)=E[s^X], extinction probability q is the smallest solution to q=G(q) in [0,1].",
      "Under usual non-degenerate assumptions, extinction is certain when the mean offspring count is at most one. Above one, extinction can still occur with positive probability; the full offspring distribution determines q."
    ],
    formulas: [{ label: "Offspring PGF", text: "G(s)=E[s^X]" }, { label: "Extinction fixed point", text: "q=G(q), smallest solution in [0,1]" }],
    examples: [
      { title: "Critical binary model", problem: "Each individual has 0 or 2 offspring with equal probability. Find the extinction probability.", steps: ["The PGF is G(s)=1/2+s²/2 and mean offspring count is 1.", "Solve q=1/2+q²/2, giving (q−1)²=0.", "Therefore q=1, so extinction occurs with probability one."] },
      { title: "A supercritical model", problem: "An individual has 0 offspring with probability 1/4 and 2 with probability 3/4. Find extinction probability.", steps: ["The PGF is G(s)=1/4+3s²/4.", "Solving q=G(q) gives roots 1 and 1/3.", "Extinction probability is the smallest fixed point, q=1/3."] }
    ],
    quiz: [
      { question: "In a Galton–Watson process, extinction probability q satisfies", options: ["q=E[X]", "q=G(q)", "q=1−G(0)", "q=μ²"], answer: 1, difficulty: "easy", explanation: "Conditioning on the number of offspring leads to the fixed point q=G(q)." },
      { question: "For G(s)=1/4+3s²/4, the extinction probability is", options: ["1", "1/2", "1/3", "3/4"], answer: 2, difficulty: "medium", explanation: "The fixed-point roots are 1 and 1/3; choose the smallest root." },
      { question: "In a supercritical branching process", options: ["Extinction is impossible", "Every population survives", "Extinction may still have positive probability", "The mean offspring count is below one"], answer: 2, difficulty: "hard", explanation: "A mean above one permits positive survival probability but does not rule out extinction." }
    ]
  },
  {
    id: "renewal-queueing", rank: 0, title: "Renewal Processes & the M/M/1 Queue", minutes: 27,
    description: "Connect renewal rates with a basic queueing model.",
    objective: "Use renewal-rate intuition, queue stability and Little's law.",
    body: [
      "A renewal process has IID positive interarrival times with finite mean m; its long-run renewal frequency approaches 1/m.",
      "An M/M/1 queue has Poisson arrival rate λ and exponential service rate μ. Stability requires λ<μ, and traffic intensity is ρ=λ/μ.",
      "In stationarity, P(N=n)=(1−ρ)ρⁿ, E[N]=ρ/(1−ρ), and mean time in the system W=1/(μ−λ). Little's law gives L=λW. If λ≥μ, the ordinary queue has no stationary distribution."
    ],
    formulas: [{ label: "Traffic intensity", text: "ρ=λ/μ<1" }, { label: "Stationary count", text: "P(N=n)=(1−ρ)ρⁿ" }, { label: "Little's law", text: "L=λW" }],
    examples: [
      { title: "A stable service desk", problem: "Customers arrive at 2 per hour and are served at 3 per hour. Find the probability the system is empty and its mean customer count.", steps: ["Traffic intensity is ρ=2/3, below one.", "P(N=0)=1−ρ=1/3.", "E[N]=ρ/(1−ρ)=2 customers."] },
      { title: "Mean time in system", problem: "An M/M/1 queue has λ=2 per hour and μ=3 per hour. Find mean time in the system.", steps: ["Use W=1/(μ−λ) under the stability condition.", "W=1/(3−2)=1 hour.", "Little's law gives L=λW=2 customers, agreeing with E[N]."] }
    ],
    quiz: [
      { question: "For an M/M/1 queue to have the usual stationary distribution, which condition is required?", options: ["λ>μ", "λ=μ", "λ<μ", "λ=0 only"], answer: 2, difficulty: "easy", explanation: "Traffic intensity must be below one, so arrivals occur more slowly than service on average." },
      { question: "An M/M/1 system has λ=2 and μ=3 per hour. Its empty-system probability is", options: ["1/3", "2/3", "1/2", "1/6"], answer: 0, difficulty: "medium", explanation: "ρ=2/3, hence P(N=0)=1−ρ=1/3." },
      { question: "For λ=2/hour and μ=3/hour, mean count L=2 and mean time W=1 hour satisfy", options: ["L=λ/W", "L=λW", "W=μ−λ", "L=ρ²"], answer: 1, difficulty: "hard", explanation: "Little's law is L=λW, giving 2=(2 per hour)(1 hour)." }
    ]
  },
  {
    id: "reliability-hazards", rank: 1, title: "Reliability, Survival & Hazard Rates", minutes: 23,
    description: "Model component lifetimes and combine component reliability.",
    objective: "Calculate survival and hazard quantities and analyse independent series and parallel systems.",
    body: [
      "For lifetime T, survival is S(t)=P(T>t)=1−F(t). Where a density exists, hazard h(t)=f(t)/S(t) is the instantaneous failure rate conditional on survival to t.",
      "Exponential lifetimes have constant hazard and a memoryless residual lifetime, which may be unrealistic for aging components.",
      "For independent components, series reliability is the product of component reliabilities. Parallel reliability is one minus the probability every component fails. Shared failure causes can invalidate independence."
    ],
    formulas: [{ label: "Survival", text: "S(t)=P(T>t)=1−F(t)" }, { label: "Hazard", text: "h(t)=f(t)/S(t)" }, { label: "Parallel reliability", text: "Rparallel=1−Πᵢ(1−Rᵢ)" }],
    examples: [
      { title: "Two components in series", problem: "Independent components have reliabilities 0.9 and 0.8. Find series reliability.", steps: ["The system works only if both components work.", "Under independence, multiply the reliabilities: 0.9·0.8.", "The series reliability is 0.72."] },
      { title: "Redundant components", problem: "Those components are placed in parallel. Find parallel reliability.", steps: ["The system fails only if both components fail.", "Failure probabilities are 0.1 and 0.2.", "Reliability is 1−0.1·0.2=0.98."] }
    ],
    quiz: [
      { question: "The survival function S(t) equals", options: ["P(T≤t)", "P(T>t)", "f(t)/F(t)", "E[T]−t"], answer: 1, difficulty: "easy", explanation: "Survival is the probability the lifetime exceeds t." },
      { question: "Two independent components have reliabilities 0.9 and 0.8. Their series reliability is", options: ["0.98", "0.85", "0.72", "0.20"], answer: 2, difficulty: "medium", explanation: "Both components must work, so 0.9·0.8=0.72." },
      { question: "Constant hazard in an exponential lifetime", options: ["Means every lifetime equals the mean", "Implies memorylessness and may not fit aging components", "Means the component never fails", "Makes survival constant"], answer: 1, difficulty: "hard", explanation: "The exponential law has constant hazard and the memoryless property, which many aging mechanisms do not satisfy." }
    ]
  }

  ,
  {
    id: "likelihood-estimation", rank: 2, title: "Likelihood, Estimation & Maximum Likelihood", minutes: 27,
    description: "Turn a probability model into an estimator and assess its sampling behaviour.",
    objective: "Construct likelihoods, derive maximum-likelihood estimates, and distinguish bias, variance, and consistency.",
    body: [
      "An estimator is a statistic computed from data to learn an unknown parameter. Before observing data, it is a random variable; after observing data, its realised value is an estimate.",
      "For observed data x under parameter θ, the likelihood L(θ;x)=f(x;θ) is viewed as a function of θ with the data held fixed. It is not a probability distribution over θ unless a Bayesian prior and normalisation are added.",
      "A maximum-likelihood estimator maximises L(θ;x), or equivalently the log-likelihood. For n Bernoulli observations with x successes, L(p) is proportional to pˣ(1−p)ⁿ⁻ˣ and the MLE is p̂=x/n.",
      "Estimator quality has several dimensions. Bias is E[θ̂]−θ; variance measures sampling spread; mean squared error is variance plus squared bias. Consistency means the estimator converges in probability to the true parameter as sample size grows.",
      "An MLE need not be unbiased in finite samples. Under regularity conditions it often has useful large-sample properties, but boundary parameters, non-identifiability, and model misspecification require care."
    ],
    formulas: [
      { label: "Likelihood", text: "L(θ;x)=f(x;θ), with x fixed" },
      { label: "Bias and MSE", text: "Bias(θ̂)=E[θ̂]−θ; MSE(θ̂)=Var(θ̂)+Bias(θ̂)²" },
      { label: "Bernoulli MLE", text: "p̂=x/n" }
    ],
    examples: [
      { title: "Estimating a coin's head probability", problem: "A coin is tossed 10 times and produces 7 heads. Find the maximum-likelihood estimate of its head probability p.", steps: [
        "For x=7 successes in n=10 Bernoulli trials, the likelihood is proportional to p⁷(1−p)³.",
        "The log-likelihood is 7 log p + 3 log(1−p) plus a constant. Differentiating and setting the derivative to zero gives 7/p−3/(1−p)=0.",
        "Solving gives p̂=7/10=0.7. This is the MLE, not a claim that the unknown parameter is certainly 0.7."
      ] },
      { title: "Estimating an exponential rate", problem: "An IID exponential sample has observed mean 4 hours. Under f(t;λ)=λe⁻ˡᵃᵐᵇᵈᵃᵗ, find the MLE of λ.", steps: [
        "The log-likelihood is n log λ − λΣtᵢ.",
        "Differentiating gives n/λ − Σtᵢ=0, so λ̂=n/Σtᵢ=1/t̄.",
        "With t̄=4 hours, λ̂=0.25 per hour. The reciprocal has rate units, not hours."
      ] }
    ],
    quiz: [
      { question: "When constructing a likelihood L(θ;x), which quantity is held fixed?", options: ["The parameter θ", "The observed data x", "The sample size must be random", "The likelihood must integrate to one over θ"], answer: 1, difficulty: "easy", explanation: "The observed data are fixed and the likelihood is examined as a function of the unknown parameter. It is not automatically a probability distribution over parameters." },
      { question: "A Bernoulli sample contains 18 successes in 30 trials. Its maximum-likelihood estimate of p is", options: ["0.30", "0.50", "0.60", "0.80"], answer: 2, difficulty: "medium", explanation: "The Bernoulli MLE is the observed success proportion: p̂=18/30=0.60." },
      { question: "An estimator has variance 4 and bias 3. Its mean squared error is", options: ["4", "7", "9", "13"], answer: 3, difficulty: "hard", explanation: "MSE equals variance plus squared bias: 4+3²=13. Bias must be squared, not simply added." }
    ]
  }
];