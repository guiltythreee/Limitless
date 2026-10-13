import type { Lesson } from "./types";

// Lessons written for the first release, kept word for word. Each is placed
// under the rank that the specification assigns to its topic, and will be
// rewritten and expanded when its rank is built.
type LegacyLesson = {
  id: string; unit: string; title: string; level: string; minutes: number;
  description: string; objective: string; body: string[]; formula: string;
  question: string; options: string[]; answer: number; explanation: string;
};

const legacy: LegacyLesson[] = [
  {
    id: "conditional", unit: "04", title: "Conditional Probability", level: "Apprentice", minutes: 16,
    description: "Update probabilities when new information arrives.",
    objective: "Compute conditional probability and distinguish it from joint probability.",
    body: [
      "Conditional probability asks how likely A is when we already know that B occurred. The information changes the reference set from Ω to B.",
      "The definition requires P(B) > 0. The numerator counts outcomes in both A and B; the denominator restricts attention to B.",
      "Independence is a different idea: A and B are independent when learning that B occurred does not change the probability of A."
    ],
    formula: "P(A | B) = P(A ∩ B) / P(B)",
    question: "Suppose P(A ∩ B) = 0.12 and P(B) = 0.30. What is P(A | B)?",
    options: ["0.036", "0.18", "0.40", "2.50"],
    answer: 2,
    explanation: "Divide the intersection probability by P(B): 0.12 / 0.30 = 0.40."
  },
  {
    id: "bayes", unit: "05", title: "Bayes' Theorem", level: "Apprentice", minutes: 18,
    description: "Reverse a conditional probability carefully.",
    objective: "Use base rates and likelihoods to reason from evidence back to a cause.",
    body: [
      "P(A | B) and P(B | A) are generally not equal. Bayes' theorem connects them using the probability of the evidence.",
      "The denominator P(B) accounts for every way the evidence could have appeared, not only the explanation we are interested in.",
      "A useful habit is to imagine 10,000 people, count the expected cases in each group, and then calculate the fraction among people who test positive."
    ],
    formula: "P(A | B) = P(B | A)P(A) / P(B)",
    question: "A fair coin is chosen from a box containing one fair coin and one double-headed coin. It is tossed and lands heads. What is the probability the chosen coin was double-headed?",
    options: ["1/4", "1/2", "2/3", "1"],
    answer: 2,
    explanation: "The double-headed coin always gives heads; the fair coin gives heads with probability 1/2. With equal prior chances, Bayes gives (1 × 1/2) / (1 × 1/2 + 1/2 × 1/2) = 2/3."
  },
  {
    id: "random-variables", unit: "06", title: "Random Variables & Expectation", level: "Adept", minutes: 20,
    description: "Turn outcomes into numbers and summarize them.",
    objective: "Compute expectation for a discrete random variable.",
    body: [
      "A random variable maps each outcome to a numerical value. It lets us study quantities such as the number of heads, waiting time, or financial return.",
      "For a discrete random variable, expectation is the probability-weighted average of its possible values. It is a long-run average, not a promise about one trial.",
      "Linearity of expectation is powerful: E[X + Y] = E[X] + E[Y], even when X and Y are dependent, provided the expectations exist."
    ],
    formula: "E[X] = Σₓ x P(X = x)",
    question: "A fair six-sided die is rolled. What is the expected result?",
    options: ["3", "3.5", "4", "4.5"],
    answer: 1,
    explanation: "E[X] = (1 + 2 + 3 + 4 + 5 + 6) / 6 = 21/6 = 3.5."
  },
  {
    id: "distributions", unit: "07", title: "Core Distributions", level: "Adept", minutes: 22,
    description: "Recognize common models and when to use them.",
    objective: "Identify Bernoulli, binomial and geometric models.",
    body: [
      "A Bernoulli random variable records one success/failure trial with success probability p.",
      "A binomial random variable counts successes in n independent Bernoulli trials with the same success probability p.",
      "A geometric random variable models the number of trials needed to get the first success. Always check whether a convention counts the successful trial itself."
    ],
    formula: "P(X = k) = C(n,k) pᵏ(1 − p)ⁿ⁻ᵏ",
    question: "For X ~ Binomial(n = 3, p = 1/2), what is P(X = 0)?",
    options: ["1/8", "1/4", "1/2", "7/8"],
    answer: 0,
    explanation: "P(X = 0) = C(3,0)(1/2)⁰(1/2)³ = 1/8."
  },
  {
    id: "limit-theorems", unit: "08", title: "Law of Large Numbers", level: "Scholar", minutes: 22,
    description: "Understand why empirical averages stabilize.",
    objective: "Explain the difference between a long-run average and a single outcome.",
    body: [
      "The law of large numbers says, under suitable assumptions, sample averages converge toward the population expectation as the number of observations grows.",
      "It does not say outcomes become less random, nor that short sequences must balance out. A fair coin can produce long runs of heads.",
      "The central limit theorem is related but distinct: after suitable centering and scaling, sums or averages often have an approximately normal distribution."
    ],
    formula: "X̄ₙ = (X₁ + ··· + Xₙ) / n",
    question: "A fair coin has been tossed 8 times and landed heads every time. On the next toss, assuming a fair independent coin, what is P(heads)?",
    options: ["0", "1/9", "1/2", "8/9"],
    answer: 2,
    explanation: "Independent tosses do not remember previous results. The next toss still has probability 1/2 of heads."
  },
  {
    id: "markov", unit: "09", title: "Markov Chains", level: "Sage", minutes: 25,
    description: "Model systems that move between states.",
    objective: "Read a transition matrix and interpret one-step probabilities.",
    body: [
      "A Markov chain is a stochastic process whose next state depends on the current state, not the full history, once the current state is known.",
      "A transition matrix records the probability of moving from each state to every possible next state. Each row sums to one under the row-stochastic convention.",
      "Markov chains appear in queues, reliability, genetics, web ranking, finance and many other systems."
    ],
    formula: "P(Xₙ₊₁ = j | Xₙ = i, history) = Pᵢⱼ",
    question: "In a two-state Markov chain, a row of the transition matrix is [0.7, 0.3]. What does the 0.3 mean?",
    options: ["The probability of the current state is 0.3", "The probability of moving to the second state next is 0.3", "The chain has 0.3 states", "The long-run probability is necessarily 0.3"],
    answer: 1,
    explanation: "In a row-stochastic transition matrix, each entry is the one-step probability of moving from the row's current state to the column's destination state."
  }
];

const legacyRank: Record<string, number> = {
  conditional: 7,
  bayes: 6,
  "random-variables": 5,
  distributions: 4,
  "limit-theorems": 2,
  markov: 1,
};

export const legacyLessons: Lesson[] = legacy.map((l) => ({
  id: l.id,
  rank: legacyRank[l.id],
  title: l.title,
  minutes: l.minutes,
  description: l.description,
  objective: l.objective,
  body: l.body,
  formulas: [{ label: "The governing relation", text: l.formula }],
  examples: [],
  quiz: [{ question: l.question, options: l.options, answer: l.answer, explanation: l.explanation }],
}));
