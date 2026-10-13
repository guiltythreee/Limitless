export type Difficulty = "easy" | "medium" | "hard";

export type QuizItem = {
  question: string;
  options: string[];
  answer: number; // index of the single correct option
  explanation: string;
  difficulty?: Difficulty; // missing means "easy"
  // Multi-select questions list every correct option here; they are graded with partial credit.
  answers?: number[];
  source?: string; // id in the question bank, e.g. "E12"
};

export type Example = {
  title: string;
  problem: string;
  steps: string[];
};

export type Formula = { label: string; text: string };

export type Lesson = {
  id: string;
  rank: number; // 9 down to 0, as in the product specification
  title: string;
  minutes: number;
  description: string;
  objective: string;
  body: string[];
  formulas: Formula[];
  examples: Example[];
  quiz: QuizItem[];
};

export type Rank = { num: number; name: string; detail: string };

// The archive ranks descend from 09 to 00 (see the specification, section 4).
export const ranks: Rank[] = [
  { num: 9, name: "Initiate", detail: "Events, sample spaces, counting principles and the axioms" },
  { num: 8, name: "Observer", detail: "Set operations, complements, unions and probability models" },
  { num: 7, name: "Apprentice", detail: "Conditional probability, independence and tree diagrams" },
  { num: 6, name: "Diviner", detail: "Bayes’ theorem and updating beliefs from evidence" },
  { num: 5, name: "Adept", detail: "Random variables, mass functions and distribution functions" },
  { num: 4, name: "Arithmetician", detail: "Expectation, variance and common distributions" },
  { num: 3, name: "Scholar", detail: "Joint distributions, covariance and conditional expectation" },
  { num: 2, name: "Theoretician", detail: "Inequalities, convergence and the limit theorems" },
  { num: 1, name: "Sage", detail: "Markov chains, Poisson processes and stochastic processes" },
  { num: 0, name: "Archon", detail: "Advanced processes, Monte Carlo methods and MCMC" },
];

export const pad2 = (n: number) => String(n).padStart(2, "0");
