export type CoverageStatus = "expanded" | "starter" | "planned";
export type CoverageArea = {
  area: string;
  blitzsteinHwang: string;
  ross: string;
  pathways: string[];
  status: CoverageStatus;
  acceptance: string;
};

/**
 * Coverage ledger for original Limitless material. Textbooks are scope references;
 * Limitless does not reproduce their prose or problem statements. "Expanded" means
 * substantial authored lessons exist, not that either textbook has been exhausted.
 */
export const coverageAreas: CoverageArea[] = [
  { area: "Sample spaces, events, axioms, set algebra", blitzsteinHwang: "Probability foundations and event algebra", ross: "Probability axioms and event operations", pathways: ["Foundations", "Statistics"], status: "expanded", acceptance: "Definitions, examples, set identities, event-modeling questions." },
  { area: "Counting, permutations, combinations, inclusion–exclusion", blitzsteinHwang: "Counting, combinatorial probability, inclusion–exclusion", ross: "Combinatorics and probability calculations", pathways: ["Foundations", "Statistics", "Quant Finance"], status: "expanded", acceptance: "Ordered/unordered outcomes, complements, overlaps, case splits." },
  { area: "Occupancy, birthday/matching and coupon collection", blitzsteinHwang: "Occupancy, matching, coupon-collector methods", ross: "Combinatorial probability and waiting problems", pathways: ["Foundations", "Statistics"], status: "expanded", acceptance: "Exact counting, inclusion–exclusion, waiting-time expectation and edge cases." },
  { area: "Conditional probability, independence, Bayes", blitzsteinHwang: "Conditioning, independence, total probability, Bayes", ross: "Conditional probability and Bayes' formula", pathways: ["Foundations", "Statistics", "Quant Finance", "Stochastic"], status: "expanded", acceptance: "Base-rate reasoning, partitions, conditional independence, diagnostic traps." },
  { area: "Discrete random variables and standard distributions", blitzsteinHwang: "Discrete distributions and expectation", ross: "Bernoulli, binomial, geometric, hypergeometric, Poisson models", pathways: ["Statistics", "Quant Finance", "Stochastic"], status: "expanded", acceptance: "Model assumptions, PMFs, tails, expectation, model choice." },
  { area: "Continuous random variables and transformations", blitzsteinHwang: "Continuous distributions, density transformations", ross: "Continuous distributions, CDF/PDF, expectation", pathways: ["Statistics", "Quant Finance", "Stochastic"], status: "expanded", acceptance: "Normalization, areas, transformations, moments, density-versus-probability." },
  { area: "Joint laws, covariance, conditional expectation", blitzsteinHwang: "Joint distributions, covariance, conditional expectation", ross: "Multivariate distributions and conditional expectation", pathways: ["Statistics", "Quant Finance", "Stochastic"], status: "expanded", acceptance: "Marginals, independence, covariance, tower property and total variance." },
  { area: "Generating functions", blitzsteinHwang: "Generating functions and sum distributions", ross: "Moment-generating functions and distributional methods", pathways: ["Statistics", "Quant Finance", "Stochastic"], status: "expanded", acceptance: "PGF/MGF definitions, derivatives, independent sums, domain caveats." },
  { area: "Inequalities, LLN, CLT and convergence", blitzsteinHwang: "Limit theorems and concentration techniques", ross: "Chebyshev, LLN, CLT and approximations", pathways: ["Statistics", "Quant Finance", "Stochastic", "Computation"], status: "expanded", acceptance: "Hypotheses, standardization, error scaling, bounds versus estimates." },
  { area: "Geometric probability and Borel–Cantelli", blitzsteinHwang: "Geometric probability and infinite sequences", ross: "Geometric probability and limit-related probability", pathways: ["Foundations", "Statistics"], status: "starter", acceptance: "More geometric models, convergence questions, and proof exercises." },
  { area: "Markov chains and random walks", blitzsteinHwang: "Markov chains and random walks", ross: "Markov chains, stationary behaviour and absorption", pathways: ["Stochastic", "Quant Finance", "Computation"], status: "expanded", acceptance: "Transitions, stationary equations, convergence assumptions, hitting and absorption." },
  { area: "Poisson processes and waiting times", blitzsteinHwang: "Poisson process and continuous-time models", ross: "Poisson processes, exponential interarrival times", pathways: ["Stochastic", "Quant Finance"], status: "expanded", acceptance: "Counts, increments, waiting times, thinning, superposition, assumptions." },
  { area: "Martingales and stopping times", blitzsteinHwang: "Martingales and stopping-time methods", ross: "Selected stochastic-process extensions", pathways: ["Stochastic", "Quant Finance"], status: "starter", acceptance: "More proof-based work and optional-stopping hypotheses." },
  { area: "Monte Carlo and MCMC", blitzsteinHwang: "Simulation and computational probability extensions", ross: "Simulation methods and stochastic-process applications", pathways: ["Computation", "Quant Finance", "Stochastic"], status: "expanded", acceptance: "Estimator, simulation error, variance reduction, MH acceptance and dependence." },
  { area: "Advanced measure-theoretic probability", blitzsteinHwang: "Measure and rigorous probability foundations where relevant", ross: "Advanced theoretical extensions beyond a first course", pathways: ["Stochastic", "Quant Finance"], status: "planned", acceptance: "Sigma-algebras, measures, convergence modes, rigorous conditional expectation and limit results." },
  { area: "Branching processes, renewal/reliability and queueing", blitzsteinHwang: "Selected stochastic-process applications", ross: "Renewal, branching, queueing and reliability topics", pathways: ["Stochastic", "Quant Finance"], status: "planned", acceptance: "Separate lessons with derivations, assumption checks and cumulative problems." },
  { area: "Inference, Bayesian computation and advanced tail bounds", blitzsteinHwang: "Bayesian reasoning and stronger concentration tools", ross: "Applications and extensions of distributional methods", pathways: ["Statistics", "Computation", "Quant Finance"], status: "planned", acceptance: "Conjugate models, Chernoff/Hoeffding proofs, uncertainty quantification and calibration." }
];