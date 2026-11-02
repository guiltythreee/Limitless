export type PathwayId = "foundations" | "statistics" | "quant-finance" | "stochastic" | "computation";

export type Pathway = {
  id: PathwayId;
  label: string;
  shortLabel: string;
  description: string;
  outcome: string;
  /** Ordered lesson IDs. A lesson may occur in several pathways; it is never duplicated. */
  lessonIds: string[];
};

/**
 * Intersecting learning routes over a single shared lesson catalogue.
 * Existing lesson IDs are deliberately retained so saved completion records and attempts continue to resolve.
 */
export const pathways: Pathway[] = [
  {
    id: "foundations",
    label: "Foundations & Problem Solving",
    shortLabel: "Foundations",
    description: "Build fluency with sample spaces, counting, event algebra, conditional probability, and Bayes' theorem.",
    outcome: "Model ordinary probability experiments correctly and choose a counting or conditioning strategy.",
    lessonIds: [
      "sample-space", "events-operations", "set-theory", "mutually-exclusive", "exhaustive-partitions",
      "counting", "combinations", "multinomials", "axioms", "properties", "equally-likely",
      "probability-counting", "de-morgan", "continuity", "advanced-counting", "random-permutations", "occupancy-coupon",
      "conditional", "conditional-independence", "total-probability", "bayes", "geometric-probability"
    ]
  },
  {
    id: "statistics",
    label: "Statistics & Data Science",
    shortLabel: "Statistics",
    description: "Move from probability models to moments, joint distributions, asymptotics, and uncertainty estimates.",
    outcome: "Understand the probabilistic basis of estimation, sampling variation, and common statistical models.",
    lessonIds: [
      "sample-space", "counting", "combinations", "random-permutations", "advanced-counting", "occupancy-coupon", "axioms", "properties", "conditional",
      "conditional-independence", "total-probability", "bayes", "bayesian-inference", "likelihood-estimation", "confidence-hypothesis-tests", "random-variables",
      "expectation-variance", "distributions", "discrete-distributions", "negative-binomial", "continuous-rv", "normal-distribution", "gamma-beta-distributions",
      "joint-distributions", "joint-transformations", "sums-convolution", "order-statistics", "conditional-expectation", "generating-functions",
      "limit-theorems", "limit-theorems-deep", "concentration-inequalities", "chernoff-hoeffding", "bayesian-computation",
      "geometric-probability", "continuity", "borel-cantelli"
    ]
  },
  {
    id: "quant-finance",
    label: "Probability for Quantitative Finance",
    shortLabel: "Quant Finance",
    description: "Emphasize distributions, dependence, conditional expectations, tail bounds, stochastic models, and simulation.",
    outcome: "Build the probability toolkit needed before deeper work in stochastic calculus, derivatives pricing, risk, and quantitative research.",
    lessonIds: [
      "sample-space", "counting", "combinations", "random-permutations", "advanced-counting", "occupancy-coupon", "axioms", "properties", "conditional",
      "conditional-independence", "total-probability", "bayes", "bayesian-inference", "likelihood-estimation", "confidence-hypothesis-tests", "random-variables",
      "expectation-variance", "distributions", "discrete-distributions", "negative-binomial", "continuous-rv", "normal-distribution", "gamma-beta-distributions",
      "joint-distributions", "joint-transformations", "sums-convolution", "order-statistics", "conditional-expectation", "generating-functions",
      "limit-theorems", "limit-theorems-deep", "concentration-inequalities", "chernoff-hoeffding",
      "continuity", "markov", "markov-chain-analysis", "random-walks", "branching-processes", "poisson-processes", "renewal-queueing", "reliability-hazards", "monte-carlo", "martingales", "mcmc", "bayesian-computation"
    ]
  },
  {
    id: "stochastic",
    label: "Stochastic Processes",
    shortLabel: "Stochastic",
    description: "Follow random variables into evolving systems, Markov chains, Poisson arrivals, martingales, and MCMC.",
    outcome: "Read and reason about models whose random state changes over time.",
    lessonIds: [
      "sample-space", "conditional", "conditional-independence", "total-probability", "bayesian-inference",
      "random-variables", "expectation-variance", "distributions", "discrete-distributions", "negative-binomial",
      "continuous-rv", "normal-distribution", "gamma-beta-distributions", "joint-distributions", "joint-transformations", "sums-convolution", "order-statistics", "conditional-expectation", "generating-functions",
      "limit-theorems", "limit-theorems-deep", "concentration-inequalities", "chernoff-hoeffding", "markov", "markov-chain-analysis", "random-walks", "branching-processes",
      "poisson-processes", "renewal-queueing", "reliability-hazards", "martingales", "mcmc"
    ]
  },
  {
    id: "computation",
    label: "Computational Probability & Simulation",
    shortLabel: "Computation",
    description: "Connect theoretical distributions to simulation, Monte Carlo error, dependence, and computational sampling.",
    outcome: "Design and interpret simulations with a clear target quantity and defensible error analysis.",
    lessonIds: [
      "sample-space", "counting", "random-permutations", "conditional", "bayes", "bayesian-inference", "random-variables",
      "expectation-variance", "distributions", "discrete-distributions", "negative-binomial", "continuous-rv", "normal-distribution", "gamma-beta-distributions",
      "joint-distributions", "joint-transformations", "sums-convolution", "order-statistics", "limit-theorems", "limit-theorems-deep", "concentration-inequalities", "chernoff-hoeffding",
      "monte-carlo", "markov", "markov-chain-analysis", "random-walks", "branching-processes", "mcmc", "bayesian-computation"
    ]
  }
];