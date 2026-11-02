import type { Lesson } from "./types";

/** New Sequence 07 lessons from the validated supplemental content pack. */
export const probabilityPackLessons: Lesson[] = [
  {
    id: "gamblers-ruin", rank: 7, title: "First-Step Analysis & Gambler's Ruin", minutes: 14,
    description: "Use first-step analysis to solve a classic random-walk problem.",
    objective: "Condition on the first move, derive a recurrence, and calculate the probability of reaching a target before ruin.",
    body: [
      "First-step analysis solves a problem by conditioning on what happens first. After that first outcome, the remaining problem often has the same structure but a different starting state. Total probability combines the cases.",
      "In the gambler's ruin model, a player starts with i units and bets one unit per round. Each round is a win with probability p and a loss with probability q = 1 − p. Play stops on reaching N units (success) or 0 units (ruin). Let rᵢ be the probability of reaching N before 0 from starting fortune i.",
      "Condition on the first bet. A win moves the fortune to i + 1; a loss moves it to i − 1. Therefore rᵢ = p rᵢ₊₁ + q rᵢ₋₁, with boundary conditions r₀ = 0 and rₙ = 1.",
      "For a fair game, p = q = 1/2. The recurrence says each value is the average of its neighbours, so the solution is linear: rᵢ = i/N. The chance of reaching the target is proportional to the starting fortune.",
      "For an unfair game with p ≠ 1/2, put ρ = q/p. The probability is rᵢ = (1 − ρⁱ)/(1 − ρᴺ). If the game is unfavourable (ρ > 1), the chance of reaching a distant target can become very small. The formula assumes independent rounds, fixed win probability, and unit-size bets."
    ],
    formulas: [
      { label: "First-step recurrence", text: "rᵢ = p rᵢ₊₁ + q rᵢ₋₁;  r₀ = 0, rₙ = 1" },
      { label: "Fair game", text: "p = 1/2:  rᵢ = i/N" },
      { label: "Unfair game", text: "p ≠ 1/2:  rᵢ = (1 − (q/p)ⁱ)/(1 − (q/p)ᴺ)" }
    ],
    examples: [
      { title: "A fair target", problem: "You start with 3 units and play a fair game until you reach 10 units or 0. Find the probability of reaching 10.", steps: [
        "For a fair game, rᵢ = i/N.",
        "Here i = 3 and N = 10.",
        "Thus r₃ = 3/10 = 0.3. The probability of ruin is 1 − 0.3 = 0.7."
      ] }
    ],
    quiz: [
      { question: "In a fair gambler's ruin game, you start with 2 units and the target is 8 units. What is the probability of reaching the target before ruin?", options: ["1/4", "1/2", "3/4", "1/8"], answer: 0, difficulty: "easy", explanation: "Answer (A). For a fair game rᵢ = i/N. Here r₂ = 2/8 = 1/4." },
      { question: "A player starts with 1 unit, the target is 3 units, and p = 0.6. What is the probability of reaching the target before ruin?", options: ["9/19", "1/3", "0.6", "10/19"], answer: 0, difficulty: "medium", explanation: "Answer (A). Here q = 0.4 and ρ = q/p = 2/3. Thus r₁ = (1 − 2/3)/(1 − (2/3)³) = (1/3)/(19/27) = 9/19 ≈ 0.474." },
      { question: "In first-step analysis for gambler's ruin, what do we condition on?", options: ["The final fortune", "The outcome of the first bet", "The total number of bets", "The target fortune"], answer: 1, difficulty: "easy", explanation: "Answer (B). The first bet moves the fortune to i + 1 or i − 1. The remaining game has the same structure from that new state." }
    ]
  },
  {
    id: "simpson-prosecutor", rank: 7, title: "Simpson's Paradox & the Prosecutor's Fallacy", minutes: 12,
    description: "Two classic traps involving conditional probabilities and base rates.",
    objective: "Explain how subgroup weights can reverse an aggregate comparison and distinguish a likelihood from its reverse conditional.",
    body: [
      "Simpson's paradox occurs when one treatment performs better within every subgroup but worse in the combined data. This is not an arithmetic error. The overall rate is a weighted average of subgroup rates, and the weights can differ between treatments.",
      "For a treatment T and outcome S, the overall success probability is the sum over groups c of P(S | T,c) P(c | T). If one treatment is used more often on harder cases, its overall rate can be lower even when its success rate is higher in every comparable subgroup. The group variable is a potential confounder. Compare like with like and inspect the weights before interpreting an aggregate rate.",
      "The prosecutor's fallacy reverses a conditional probability. A small value of P(evidence | innocent) does not mean P(innocent | evidence) is equally small. Bayes' theorem also requires the prior probability of guilt and the probability of the evidence under each possible state.",
      "When evidence is rare, the size of the population matters. Even a low false-match rate can produce many innocent matches when there are very many innocent people. Count expected cases in each group, then calculate the fraction among all matches."
    ],
    formulas: [
      { label: "Weighted subgroup rate", text: "P(S | T) = Σc P(S | T,c) P(c | T)" },
      { label: "The reversed conditional", text: "P(guilty | match) is not generally equal to P(match | innocent)" }
    ],
    examples: [
      { title: "Kidney stones", problem: "Treatment A succeeds for 81 of 87 patients with small stones and 192 of 263 with large stones. Treatment B succeeds for 234 of 270 with small stones and 55 of 80 with large stones. Compare the treatments.", steps: [
        "For small stones, A succeeds at 81/87 ≈ 93.1%, while B succeeds at 234/270 ≈ 86.7%.",
        "For large stones, A succeeds at 192/263 ≈ 73.0%, while B succeeds at 55/80 ≈ 68.8%. A is better in both groups.",
        "Overall, A succeeds at 273/350 = 78.0%, while B succeeds at 289/350 ≈ 82.6%. The aggregate comparison reverses.",
        "A treated mostly large, harder cases (263 of 350); B treated mostly small cases (270 of 350). The different subgroup weights explain the reversal."
      ] },
      { title: "A DNA match", problem: "A town has 1,000,000 people, exactly one of whom is guilty. A test always matches the guilty person and falsely matches an innocent person with probability 1/10,000. A randomly selected suspect matches. Find the approximate probability the suspect is guilty.", steps: [
        "The prior probability of guilt is 1/1,000,000 = 0.000001.",
        "There is one expected guilty match and about 999,999/10,000 ≈ 100 innocent matches.",
        "Among roughly 101 matches, one is guilty. The posterior probability is about 1/101 ≈ 0.0099, or 1%.",
        "The false-match probability P(match | innocent) is not the posterior P(innocent | match). The prior population base rate changes the answer."
      ] }
    ],
    quiz: [
      { question: "In the kidney-stone data, what is Treatment A's overall success rate?", options: ["73%", "78%", "83%", "93%"], answer: 1, difficulty: "easy", explanation: "Answer (B). Treatment A has 81 + 192 = 273 successes among 87 + 263 = 350 patients. Its overall rate is 273/350 = 78%." },
      { question: "Simpson's paradox can occur because", options: ["the data must be incorrect", "subgroup sizes and weights differ between treatments", "conditional probabilities are undefined", "averages cannot be compared"], answer: 1, difficulty: "medium", explanation: "Answer (B). The overall rate is a weighted average. If the treatments have different subgroup weights, the aggregate comparison can reverse even when one treatment wins in every subgroup." },
      { question: "The prosecutor's fallacy is", options: ["using Bayes' theorem without a prior", "treating P(evidence | innocent) as P(innocent | evidence)", "assuming events are independent", "using the complement rule"], answer: 1, difficulty: "medium", explanation: "Answer (B). These are reverse conditional probabilities. Bayes' theorem connects them through the prior probability and the total probability of the evidence." }
    ]
  }
];