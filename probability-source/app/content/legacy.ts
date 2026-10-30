import type { Example, Lesson, QuizItem } from "./types";

// Lessons written for the first release, kept word for word. Each is placed
// under the rank that the specification assigns to its topic, and will be
// rewritten and expanded when its rank is built.
type LegacyLesson = {
  id: string; unit: string; title: string; level: string; minutes: number;
  description: string; objective: string; body: string[]; formula: string;
  question: string; options: string[]; answer: number; explanation: string;
  examples?: Example[]; additionalQuestions?: QuizItem[];
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
    explanation: "Divide the intersection probability by P(B): 0.12 / 0.30 = 0.40.",
    examples: [
      { title: "A card conditional on its suit", problem: "A card is drawn uniformly from a standard deck. Given that it is a heart, what is the probability it is a queen?", steps: [
        "The condition restricts the sample space to the 13 hearts.",
        "Exactly one of those 13 cards is the queen of hearts.",
        "Therefore P(queen | heart)=1/13. The denominator is 13 because the heart condition is already known."
      ] },
      { title: "Conditional probability from a table", problem: "In a group of 100 people, 30 exercise regularly and 18 both exercise regularly and cycle to work. Find P(cycles | exercises).", steps: [
        "Let E be exercising and C be cycling. The known group is E, which contains 30 people.",
        "Of those 30, 18 cycle to work.",
        "Thus P(C | E)=18/30=0.6. The reverse conditional P(E | C) would use the number of cyclists as its denominator."
      ] }
    ],
    additionalQuestions: [
      { question: "If P(A∩B)=0.18 and P(B)=0.6, then P(A|B) is", options: ["0.108", "0.30", "0.42", "3.33"], answer: 1, difficulty: "medium", explanation: "Conditional probability divides the joint probability by the probability of the condition: 0.18/0.6=0.30." },
      { question: "A class has 20 students who study mathematics, 12 of whom also study physics. Given that a student studies mathematics, what is the probability they study physics?", options: ["12/20", "12/32", "20/12", "8/20"], answer: 0, difficulty: "hard", explanation: "The condition selects the 20 mathematics students. Twelve of these also study physics, so the conditional probability is 12/20=0.6." }
    ]
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
    explanation: "The double-headed coin always gives heads; the fair coin gives heads with probability 1/2. With equal prior chances, Bayes gives (1 × 1/2) / (1 × 1/2 + 1/2 × 1/2) = 2/3.",
    examples: [
      { title: "A rare-disease update", problem: "A disease has prevalence 2%. A test has 95% sensitivity and a 4% false-positive rate. Find the probability of disease after a positive result.", steps: [
        "Among 10,000 people, about 200 have the disease and 95% of them (190) test positive.",
        "Of 9,800 healthy people, 4% (392) test positive. There are 582 positive results in total.",
        "The posterior is 190/582≈0.3265, or 32.65%. High sensitivity alone does not determine the posterior; prevalence and false positives matter."
      ] },
      { title: "A biased coin source", problem: "A coin is chosen from source A with probability 0.7 or source B with probability 0.3. Their head probabilities are 0.4 and 0.8. Given a head, find the probability the coin came from B.", steps: [
        "The total probability of a head is 0.7(0.4)+0.3(0.8)=0.52.",
        "The joint probability of source B and a head is 0.3(0.8)=0.24.",
        "Bayes gives P(B|H)=0.24/0.52=6/13≈0.4615."
      ] }
    ],
    additionalQuestions: [
      { question: "A condition has prior probability 0.1. A test has sensitivity 0.8 and false-positive rate 0.1. What is P(condition | positive)?", options: ["0.08/0.17", "0.8", "0.1", "0.9"], answer: 0, difficulty: "medium", explanation: "Bayes gives 0.8(0.1)/[0.8(0.1)+0.1(0.9)]=0.08/0.17≈0.4706." },
      { question: "Bayes' theorem requires the evidence event E to have", options: ["probability zero", "positive probability", "probability one-half", "independence from the hypothesis"], answer: 1, difficulty: "hard", explanation: "The posterior P(H|E) divides by P(E), so the conditioning event must have positive probability." }
    ]
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
    explanation: "E[X] = (1 + 2 + 3 + 4 + 5 + 6) / 6 = 21/6 = 3.5.",
    examples: [
      { title: "A two-coin random variable", problem: "Two fair coins are tossed and X is the number of heads. Give the PMF and find P(X≤1).", steps: [
        "The equally likely outcomes are HH, HT, TH and TT. Their head counts are 2,1,1,0.",
        "Thus P(X=0)=1/4, P(X=1)=1/2 and P(X=2)=1/4.",
        "The CDF value P(X≤1)=P(X=0)+P(X=1)=3/4."
      ] },
      { title: "An indicator variable", problem: "Ten independent components each fail with probability 0.03. Let X be the number that fail. Find E[X].", steps: [
        "Write X as the sum of ten indicators Iᵢ, each equal to 1 when component i fails.",
        "Each indicator has expectation 0.03.",
        "By linearity, E[X]=ΣE[Iᵢ]=10(0.03)=0.3 expected failures. Independence is not needed for this expectation."
      ] }
    ],
    additionalQuestions: [
      { question: "A random variable is", options: ["a numerical function on outcomes", "a probability itself", "always continuous", "a random event with no values"], answer: 0, difficulty: "medium", explanation: "A random variable assigns a numerical value to each outcome in the sample space." },
      { question: "If X takes values 0,1,2 with probabilities 0.2,0.5,0.3, then P(X≤1) is", options: ["0.2", "0.3", "0.5", "0.7"], answer: 3, difficulty: "hard", explanation: "Add the probabilities at values 0 and 1: 0.2+0.5=0.7." }
    ]
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
    explanation: "P(X = 0) = C(3,0)(1/2)⁰(1/2)³ = 1/8.",
    examples: [
      { title: "Bernoulli trial", problem: "A component works with probability 0.98. Let X=1 if it works and 0 otherwise. Find E[X] and Var(X).", steps: [
        "X is Bernoulli(p=0.98), with P(X=1)=0.98 and P(X=0)=0.02.",
        "The mean is E[X]=p=0.98.",
        "The variance is p(1−p)=0.98(0.02)=0.0196."
      ] },
      { title: "A binomial count", problem: "A player makes each free throw independently with probability 0.7. Find the probability of exactly three successes in five attempts.", steps: [
        "The number of successes is Binomial(n=5,p=0.7): fixed number of independent trials with constant success probability.",
        "Use P(X=3)=C(5,3)(0.7)³(0.3)².",
        "The result is 10(0.343)(0.09)=0.3087."
      ] }
    ],
    additionalQuestions: [
      { question: "A Bernoulli(p) variable has variance", options: ["p", "1−p", "p(1−p)", "p²"], answer: 2, difficulty: "medium", explanation: "Since X²=X for a Bernoulli variable, Var(X)=E[X]−E[X]²=p−p²=p(1−p)." },
      { question: "Which assumption is essential for a Binomial(n,p) model?", options: ["Sampling without replacement", "A fixed number of independent trials with common success probability", "A random number of trials", "Every outcome has a different success probability"], answer: 1, difficulty: "hard", explanation: "The binomial model counts successes in a fixed number of independent Bernoulli trials sharing the same p." }
    ]
  },
  {
    id: "limit-theorems", unit: "08", title: "Law of Large Numbers", level: "Scholar", minutes: 22,
    description: "Understand why empirical averages stabilize.",
    objective: "Explain the difference between a long-run average and a single outcome.",
    body: [
      "The law of large numbers says, under suitable assumptions, sample averages converge toward the population expectation as the number of observations grows.",
      "It does not say outcomes become less random, nor that short sequences must balance out. A fair coin can produce long runs of heads.",
      "The central limit theorem is related but distinct: after suitable centering and scaling, sums or averages often have an approximately normal distribution.",
      "For IID observations with finite mean μ, the weak law says X̄ₙ converges in probability to μ. With finite variance σ², Var(X̄ₙ)=σ²/n, so the average becomes more concentrated even though individual observations retain their original distribution.",
      "The IID central limit theorem adds a distributional approximation: (X̄ₙ−μ)/(σ/√n) approaches a standard normal law when 0<σ²<∞. It is a statement about the shape of the standardized sampling distribution, not a claim that the raw data are normal."
    ],
    formula: "X̄ₙ = (X₁ + ··· + Xₙ) / n",
    question: "A fair coin has been tossed 8 times and landed heads every time. On the next toss, assuming a fair independent coin, what is P(heads)?",
    options: ["0", "1/9", "1/2", "8/9"],
    answer: 2,
    explanation: "Independent tosses do not remember previous results. The next toss still has probability 1/2 of heads.",
    examples: [
      { title: "A stabilizing sample proportion", problem: "A fair coin is tossed 400 times. What are the mean and standard deviation of the sample proportion of heads?", steps: [
        "The number of heads is Binomial(400,0.5), so the sample proportion has mean 0.5.",
        "Its variance is p(1−p)/n=0.25/400=0.000625.",
        "The standard deviation is 0.025. The law of large numbers explains concentration near 0.5, not an exact count of 200."
      ] },
      { title: "LLN versus CLT", problem: "A sample mean is based on IID observations with mean 10 and standard deviation 6. For n=36, state its mean and standard error.", steps: [
        "The sample mean remains centered at the population mean, 10.",
        "Its standard error is σ/√n=6/6=1.",
        "The LLN says the sample mean concentrates near 10 as n grows; the CLT describes its standardized distribution for large n."
      ] }
    ],
    additionalQuestions: [
      { question: "The weak law of large numbers states that the sample mean", options: ["becomes exactly equal to μ after a fixed number of trials", "converges in probability to μ under its assumptions", "makes individual observations less variable", "must be normally distributed for every n"], answer: 1, difficulty: "medium", explanation: "The weak law concerns convergence in probability of averages, not exact equality or a change in the individual observation distribution." },
      { question: "If σ=8 and n=64, the standard error of the sample mean is", options: ["8", "4", "1", "1/8"], answer: 2, difficulty: "hard", explanation: "SE=σ/√n=8/8=1. The standard error falls with the square root of sample size." }
    ]
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
    explanation: "In a row-stochastic transition matrix, each entry is the one-step probability of moving from the row's current state to the column's destination state.",
    examples: [
      { title: "A two-step transition", problem: "A two-state chain has P=[[0.7,0.3],[0.4,0.6]] and starts in state 1. Find the probability it is in state 1 after two steps.", steps: [
        "After one step, the chain is in state 1 with probability 0.7 and state 2 with probability 0.3.",
        "To be in state 1 after two steps, it can follow 1→1→1 or 1→2→1.",
        "The probability is 0.7(0.7)+0.3(0.4)=0.61."
      ] },
      { title: "Checking a transition matrix", problem: "A proposed transition matrix is [[0.6,0.4],[0.2,0.7]]. Is it a valid row-stochastic transition matrix?", steps: [
        "Each entry is nonnegative, which is necessary for probabilities.",
        "The first row sums to 1, but the second row sums to 0.9.",
        "It is not a valid row-stochastic transition matrix because each row must sum to exactly one."
      ] }
    ],
    additionalQuestions: [
      { question: "If the current state is i, the Markov property says the distribution of the next state depends on", options: ["the entire past only", "the current state, not the earlier history", "the initial state only", "the number of states"], answer: 1, difficulty: "medium", explanation: "Conditional on the present state, the next state is independent of the earlier history." },
      { question: "A valid row-stochastic transition matrix must have", options: ["columns summing to zero", "nonnegative entries and each row summing to one", "equal rows", "only diagonal entries"], answer: 1, difficulty: "hard", explanation: "Each row represents a probability distribution over next states, so entries are nonnegative and sum to one." }
    ]
  }
];

const legacyRank: Record<string, number> = {
  conditional: 7,
  bayes: 6,
  "random-variables": 5,
  distributions: 5,
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
  examples: l.examples ?? [],
  quiz: [{ question: l.question, options: l.options, answer: l.answer, explanation: l.explanation }, ...(l.additionalQuestions ?? [])],
}));
