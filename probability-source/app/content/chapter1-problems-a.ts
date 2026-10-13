import type { Example } from "./types";

// Chapter 1 problem set, part A (Problems 1.1 to 1.18), with worked solutions.
// Keys are lesson ids; every problem appears under exactly one lesson.
export const problemsA: Record<string, Example[]> = {
  "sample-space": [
    {
      title: "Problem 1.6 · Modelling three coin tosses ⋆",
      problem: "A fair coin is tossed three times. (a) Write the sample space Ω of ordered outcomes. Let A = “at least two heads” and B = “first toss is heads”. Find P(A), P(B), P(A ∩ B), P(A ∪ B). (b) A student uses Ω′ = {0, 1, 2, 3} (the number of heads) and gives each outcome probability 1/4. Show this is wrong and find the correct probabilities on Ω′.",
      steps: [
        "(a) Ω = {HHH, HHT, HTH, HTT, THH, THT, TTH, TTT}: eight equally likely outcomes.",
        "A = {HHH, HHT, HTH, THH}, so P(A) = 4/8 = 1/2. B = {HHH, HHT, HTH, HTT}, so P(B) = 1/2. A ∩ B = {HHH, HHT, HTH}, so P(A ∩ B) = 3/8.",
        "Two-event inclusion–exclusion: P(A ∪ B) = 1/2 + 1/2 − 3/8 = 5/8. Listing confirms |A ∪ B| = 5.",
        "(b) Each value of “number of heads” is an event on the fine space: {0} = {TTT}, {1} = {HTT, THT, TTH}, {2} = {HHT, HTH, THH}, {3} = {HHH}. Their probabilities are 1/8, 3/8, 3/8, 1/8. They are not equally likely because they contain different numbers of equally likely outcomes.",
        "The student’s model gives P(exactly one head) = 1/4, but the truth is 3/8. It happens to give the right answer 1/2 for “at least two heads”, a coincidence of symmetry, which is exactly why the error is dangerous.",
        "Key idea: a coarse description (the count) is an event on the fine space. Probabilities live on the fine space.",
      ],
    },
  ],

  "events-operations": [
    {
      title: "Problem 1.1 · Symmetric difference algebra ⋆",
      problem: "Let A, B, C be events. (a) Show A △ B = (A ∪ B) \\ (A ∩ B). (b) Show 1_(A△B) ≡ 1_A + 1_B (mod 2), and deduce that (A △ B) △ C = A △ (B △ C). (c) Show A △ B = ∅ if and only if A = B.",
      steps: [
        "(a) Element chase: ω ∈ (A ∪ B) \\ (A ∩ B) iff (ω ∈ A or ω ∈ B) and not both, iff ω lies in exactly one of A, B, iff ω ∈ (A \\ B) ∪ (B \\ A) = A △ B.",
        "(b) Fix ω and look at 1_A(ω) + 1_B(ω) ∈ {0, 1, 2}. If ω is in exactly one set the sum is 1 (odd) and 1_(A△B)(ω) = 1. If ω is in neither or both, the sum is 0 or 2 (even) and 1_(A△B)(ω) = 0. So 1_(A△B) ≡ 1_A + 1_B (mod 2).",
        "Apply this twice: 1_((A△B)△C) ≡ 1_A + 1_B + 1_C and 1_(A△(B△C)) ≡ 1_A + 1_B + 1_C (mod 2). Both indicators take values in {0, 1} and are congruent mod 2, hence equal at every ω, so the sets coincide. Interpretation: ω ∈ (A △ B) △ C iff ω lies in an odd number of A, B, C.",
        "(c) A △ B = ∅ iff A \\ B = ∅ and B \\ A = ∅, iff A ⊆ B and B ⊆ A, iff A = B.",
        "Key idea: converting a set identity into a parity statement about indicators makes associativity obvious.",
      ],
    },
    {
      title: "Problem 1.7 · Translating words into events ⋆",
      problem: "For events A, B, C write, using only ∪, ∩ and complements, the events (a) exactly two of A, B, C occur; (b) at least two occur; (c) at most one occurs; (d) either none or all three occur. Then, using the data of Problem 1.2 (P(A) = 0.6, P(B) = 0.5, P(C) = 0.4, P(A ∩ B) = 0.3, P(A ∩ C) = 0.2, P(B ∩ C) = 0.2, P(A ∩ B ∩ C) = 0.1), find the probability of each.",
      steps: [
        "(a) E₂ = (A ∩ B ∩ Cᶜ) ∪ (A ∩ Bᶜ ∩ C) ∪ (Aᶜ ∩ B ∩ C). The three pieces are disjoint, so probabilities add.",
        "(b) (A ∩ B) ∪ (A ∩ C) ∪ (B ∩ C), equivalently E₂ ⊔ (A ∩ B ∩ C).",
        "(c) “At most one” is the complement of “at least two”. By De Morgan it equals (Aᶜ ∩ Bᶜ) ∪ (Aᶜ ∩ Cᶜ) ∪ (Bᶜ ∩ Cᶜ), meaning “at least two fail”.",
        "(d) (A ∩ B ∩ C) ⊔ (Aᶜ ∩ Bᶜ ∩ Cᶜ).",
        "Probabilities. In Problem 1.2 the number of events occurring partitions Ω as: none 0.1, exactly one 0.4, exactly two 0.4, all three 0.1. Hence (a) 0.4; (b) 0.4 + 0.1 = 0.5; (c) 0.1 + 0.4 = 0.5 (= 1 − 0.5 ✓); (d) 0.1 + 0.1 = 0.2.",
        "Key idea: “at most one” is the complement of “at least two”.",
      ],
    },
  ],

  "set-theory": [
    {
      title: "Problem 1.36 · The countable–cocountable σ-algebra ⋆⋆⋆",
      problem: "Let F = {A ⊆ ℝ : A is countable or Aᶜ is countable} and set P(A) = 0 if A is countable, P(A) = 1 if Aᶜ is countable. (a) Show F is a σ-algebra. (b) Show P is a well-defined probability measure on (ℝ, F). (c) Is [0, 1] an event?",
      steps: [
        "(a) ℝᶜ = ∅ is countable, so ℝ ∈ F. The definition is symmetric in A and Aᶜ, so F is closed under complements.",
        "Let A₁, A₂, … ∈ F. If all are countable, ⋃Aᵢ is countable (a countable union of countable sets). If some Aⱼ has countable complement, then (⋃Aᵢ)ᶜ ⊆ Aⱼᶜ is countable. Either way ⋃Aᵢ ∈ F.",
        "(b) Well defined: ℝ is uncountable, so no set is both countable and cocountable. P(ℝ) = 1 and P ≥ 0.",
        "Countable additivity: let Aᵢ ∈ F be disjoint. Two cocountable sets cannot be disjoint (their complements would cover ℝ), so at most one Aⱼ is cocountable. If none is, all are countable, so the union is countable and P(⋃Aᵢ) = 0 = Σ 0. If exactly one is, the union is cocountable and P(⋃Aᵢ) = 1 = 1 + 0.",
        "(c) No. [0, 1] is uncountable and so is its complement, so [0, 1] ∉ F. Every single point {x} is an event of probability 0, yet intervals are not events at all.",
        "Lesson: the σ-algebra is the “wrong” one for describing a random real number, which is why we use the Borel σ-algebra. The choice of F decides which questions can be asked.",
      ],
    },
  ],

  "mutually-exclusive": [
    {
      title: "Problem 1.34 · Fréchet bounds ⋆⋆",
      problem: "Suppose P(A) = 0.7 and P(B) = 0.6. (a) Find the exact range of possible values of P(A ∩ B), of P(A ∪ B) and of P(A △ B). (b) Show that every extreme value is attained (take Ω = [0, 1] with the uniform law). (c) Can three events of probability 1/2 each be pairwise disjoint?",
      steps: [
        "(a) Monotonicity gives P(A ∩ B) ≤ min(0.7, 0.6) = 0.6. Inclusion–exclusion with P(A ∪ B) ≤ 1 gives P(A ∩ B) ≥ 0.7 + 0.6 − 1 = 0.3. So P(A ∩ B) ∈ [0.3, 0.6].",
        "Then P(A ∪ B) = 1.3 − P(A ∩ B) ∈ [0.7, 1], and P(A △ B) = 1.3 − 2P(A ∩ B) ∈ [0.1, 0.7].",
        "(b) Take A = [0, 0.7). With B = [0, 0.6) ⊆ A we get P(A ∩ B) = 0.6 (max), P(A ∪ B) = 0.7, P(A △ B) = 0.1.",
        "With B = [0.4, 1): A ∩ B = [0.4, 0.7) has probability 0.3 (min), A ∪ B = [0, 1) has probability 1, and P(A △ B) = 0.7. Sliding B continuously between the two attains every intermediate value.",
        "(c) No. Pairwise disjoint events would give P(⋃) = ΣP = 1.5 > 1, contradicting P ≤ 1.",
        "Quant meaning: Fréchet bounds are the worst and best case over all dependence structures for joint events, for example the joint default probability of two names with known marginals.",
      ],
    },
  ],

  "exhaustive-partitions": [
    {
      title: "Problem 1.8 · Three people pick a number ⋆",
      problem: "Three people each independently pick an integer from 1 to 10 (all 10³ ordered triples equally likely). Find the probability that (a) all three numbers are different; (b) exactly two are equal; (c) all three are equal; (d) at least two are equal. Check that (a)–(c) form a partition.",
      steps: [
        "|Ω| = 10³ = 1000.",
        "(a) 10 · 9 · 8 = 720, so 0.72. (c) 10 outcomes, so 0.01.",
        "(b) Choose which two people agree (3 ways), their common value (10), and the third person’s different value (9): 3 · 10 · 9 = 270, so 0.27.",
        "Check: 0.72 + 0.27 + 0.01 = 1 ✓, because “how many distinct values” (3, 2, 1) partitions Ω.",
        "(d) Complement trick: 1 − 0.72 = 0.28, which also equals 0.27 + 0.01 ✓.",
        "Preview: this is the birthday problem with 10 days and 3 people.",
      ],
    },
    {
      title: "Problem 1.53 · Quadratic with dice coefficients ⋆⋆",
      problem: "Three fair dice give a, b, c and we form ax² + bx + c = 0. Find the probability that (a) the roots are real; (b) the roots are real and equal.",
      steps: [
        "Real roots iff b² ≥ 4ac. |Ω| = 216. Partition by the value of b and count pairs (a, c) with ac ≤ ⌊b²/4⌋.",
        "For b = 1, 2, 3, 4, 5, 6 the bound is ac ≤ 0, 1, 2, 4, 6, 9, and the numbers of pairs are 0, 1, 3, 8, 14, 17.",
        "Total = 1 + 3 + 8 + 14 + 17 = 43, so (a) P(real) = 43/216 ≈ 0.199.",
        "(b) Equality b² = 4ac: b = 2 needs ac = 1 (1 pair); b = 4 needs ac = 4: (1, 4), (2, 2), (4, 1) (3 pairs); b = 6 needs ac = 9: (3, 3) (1 pair). Total 5, so 5/216 ≈ 0.023.",
        "Key idea: condition on the variable that makes the count simplest and add over the partition.",
      ],
    },
    {
      title: "Problem 1.54 · Chuck-a-luck ⋆",
      problem: "You bet on the number 1 and three dice are rolled. Find the probability that 1 shows (a) at least once; (b) exactly 0, 1, 2, 3 times, and check these four probabilities form a partition. (c) The casino pays k units for each unit staked if k ≥ 1 ones show, and keeps the stake if none shows. Find the average profit per unit staked as a sum over the partition.",
      steps: [
        "|Ω| = 216.",
        "(a) Complement trick: no 1 in three rolls has 5³ = 125 outcomes, so P(at least one) = 91/216 ≈ 0.421.",
        "(b) Exactly k ones: C(3, k) · 5^(3−k) outcomes: 125, 75, 15, 1 for k = 0, 1, 2, 3. They sum to 216 ✓. Probabilities: 125/216, 75/216, 15/216, 1/216.",
        "(c) Profit is −1 if k = 0 and +k if k ≥ 1. Weighting by the partition probabilities: (−125 + 75 · 1 + 15 · 2 + 1 · 3)/216 = −17/216 ≈ −0.079.",
        "The game loses about 7.9 cents per dollar, a house edge hidden by the superficially generous payoff. Preview: (c) is an expected value computed by partitioning.",
      ],
    },
  ],

  "counting": [
    {
      title: "Problem 1.15 · Two people seated together ⋆",
      problem: "n ≥ 3 people (including A and B) are seated uniformly at random. Find the probability that A and B sit (a) next to each other in a row of n seats; (b) next to each other at a round table with n seats; (c) at the two ends of the row. Evaluate for n = 6.",
      steps: [
        "Only the seats of A and B matter: the ordered pair of their seats is uniform over the n(n − 1) pairs of distinct seats.",
        "(a) Adjacent ordered seat pairs in a row: (i, i + 1) and (i + 1, i) for i = 1, …, n − 1, which is 2(n − 1). Probability 2(n − 1)/(n(n − 1)) = 2/n (= 1/3 for n = 6).",
        "(b) Fix A’s seat by rotational symmetry. B is uniform among the other n − 1 seats, of which 2 are neighbours: 2/(n − 1) (= 2/5 for n = 6).",
        "(c) The ordered pairs (1, n) and (n, 1): 2/(n(n − 1)) (= 1/15 for n = 6).",
        "Key idea: reduce the problem to the relevant part of the random object (two seats), not the whole permutation.",
      ],
    },
    {
      title: "Problem 1.16 · Random subsets ⋆⋆",
      problem: "A subset S of {1, …, n} is chosen uniformly from all 2ⁿ subsets. Find (a) P(1 ∈ S); (b) P(|S| = k), and its value for n = 10, k = 5; (c) P(|S| is even) for n ≥ 1. (d) Two subsets S, T are chosen independently and uniformly (all 4ⁿ ordered pairs equally likely). Find P(S ⊆ T).",
      steps: [
        "(a) The subsets containing 1 correspond to subsets of {2, …, n}: 2^(n−1) of them, so the probability is 1/2. The same holds for every element.",
        "(b) C(n, k)/2ⁿ. For n = 10, k = 5: 252/1024 = 63/256 ≈ 0.246.",
        "(c) Toggling the membership of element 1 is a bijection between subsets of even and odd size, so exactly half are even: 1/2. (Check n = 4: 1 + 6 + 1 = 8 of 16.)",
        "(d) Build (S, T) element by element: each element i has 4 possibilities (in neither, only S, only T, both). S ⊆ T forbids “only S”, leaving 3 allowed states per element. So |{S ⊆ T}| = 3ⁿ and P = 3ⁿ/4ⁿ = (3/4)ⁿ.",
        "Key idea: count element by element instead of set by set.",
      ],
    },
    {
      title: "Problem 1.48 · Monotone sequences of dice ⋆⋆",
      problem: "Three fair dice are rolled in order, giving (X₁, X₂, X₃). Find the probability that (a) X₁ < X₂ < X₃; (b) the sequence is strictly monotone (increasing or decreasing); (c) X₁ ≤ X₂ ≤ X₃.",
      steps: [
        "|Ω| = 216.",
        "(a) Choose three distinct values: C(6, 3) = 20, and there is exactly one increasing order. 20/216 = 5/54. Equivalently, the 120 ordered triples of distinct values are split equally among the 3! = 6 relative orders.",
        "(b) Strictly decreasing also has 20 outcomes (reverse each increasing triple) and the two cases are disjoint: 40/216 = 5/27.",
        "(c) Count by pattern: all distinct (increasing): 20; exactly two equal values, patterns aab or abb with a < b: 2 · C(6, 2) = 30; all equal: 6. Total 56, so 56/216 = 7/27.",
        "Preview: 56 = C(8, 3), the count of combinations with repetition.",
      ],
    },
    {
      title: "Problem 1.49 · Random four-digit numbers ⋆",
      problem: "A four-digit number 1000 ≤ N ≤ 9999 is chosen uniformly at random (9000 equally likely values). Find the probability that (a) N is divisible by 7; (b) N is divisible by 4 or by 6; (c) all four digits are different; (d) N is a palindrome (e.g. 4774).",
      steps: [
        "(a) Multiples of 7 in [1000, 9999]: ⌊9999/7⌋ − ⌊999/7⌋ = 1428 − 142 = 1286. Probability 1286/9000 = 643/4500 ≈ 0.143.",
        "(b) Let E₄, E₆ be divisibility by 4 and 6. |E₄| = 2499 − 249 = 2250, |E₆| = 1666 − 166 = 1500, and E₄ ∩ E₆ is divisibility by lcm = 12: 833 − 83 = 750. By inclusion–exclusion, (2250 + 1500 − 750)/9000 = 3000/9000 = 1/3.",
        "Note that 4 and 6 are not coprime, so 1/4 · 1/6 would be the wrong intersection. It is 1/12.",
        "(c) 9 · 9 · 8 · 7 = 4536 (first digit non-zero, then any unused digit); 4536/9000 = 0.504.",
        "(d) Digits abba with a ∈ {1, …, 9}, b ∈ {0, …, 9}: 90 numbers, so 90/9000 = 1/100.",
        "Key idea: the intersection of “divisible by m” and “divisible by n” is “divisible by lcm(m, n)”.",
      ],
    },
  ],

  "probability-counting": [
    {
      title: "Problem 1.9 · Four tosses: heads counts and adjacent heads ⋆",
      problem: "A fair coin is tossed four times. Find the probability that (a) exactly two heads occur; (b) at least one head occurs; (c) two consecutive heads (HH) appear somewhere; (d) the number of heads is even.",
      steps: [
        "|Ω| = 2⁴ = 16.",
        "(a) C(4, 2) = 6, so 6/16 = 3/8.",
        "(b) Complement: only TTTT has no head, so 1 − 1/16 = 15/16.",
        "(c) Complement trick: list the sequences with no HH: TTTT, HTTT, THTT, TTHT, TTTH, HTHT, HTTH, THTH, which is 8. So P(HH appears) = 1 − 8/16 = 1/2.",
        "(d) Even number of heads: C(4, 0) + C(4, 2) + C(4, 4) = 1 + 6 + 1 = 8, so 1/2. Slicker: toggling the first toss is a bijection between sequences with an even and an odd number of heads.",
        "Key idea: counting the complement of a pattern event is often easier.",
      ],
    },
  ],

  "combinations": [
    {
      title: "Problem 1.4 · Poker hands and a counting trap ⋆⋆",
      problem: "A 5-card hand is dealt from a standard 52-card deck. (a) Find P(full house) (three of one rank, two of another). (b) Find P(at least one ace). (c) A student computes (b) as C(4, 1) · C(51, 4) / C(52, 5) (“choose an ace, then any 4 other cards”). Show this is wrong and explain why.",
      steps: [
        "|Ω| = C(52, 5) = 2,598,960 (unordered hands, all equally likely).",
        "(a) Choose the rank of the triple (13), its suits (C(4, 3) = 4), the rank of the pair among the remaining 12 ranks (12), its suits (C(4, 2) = 6). P(full house) = (13 · 4 · 12 · 6)/2,598,960 = 3744/2,598,960 = 6/4165 ≈ 0.00144.",
        "(b) Complement trick: “no ace” means all 5 cards come from the 48 non-aces. P(at least one ace) = 1 − C(48, 5)/C(52, 5) = 1 − 1,712,304/2,598,960 = 18472/54145 ≈ 0.3412.",
        "(c) The expression counts pairs (hand, designated ace), so a hand with j aces is counted j times. Numerically 4 · C(51, 4) = 999,600, whereas the true number of favourable hands is 2,598,960 − 1,712,304 = 886,656.",
        "The error is the classic overcounting from “choose one, then the rest”: it counts the same unordered set several ways. Remedy: use the complement, or count by the exact number of aces j = 1, …, 4 (C(4, j) · C(48, 5 − j)) and add, since these cases are disjoint.",
      ],
    },
    {
      title: "Problem 1.5 · Committee ⋆",
      problem: "A committee of 5 is chosen uniformly at random from 10 men and 6 women. Find the probability that it contains at least 2 women.",
      steps: [
        "|Ω| = C(16, 5) = 4368. “At least 2 women” is the complement of “0 or 1 women”, which are disjoint cases.",
        "P(≤ 1 woman) = [C(10, 5) + C(6, 1) · C(10, 4)]/4368 = (252 + 6 · 210)/4368 = 1512/4368 = 9/26.",
        "Hence P(≥ 2 women) = 1 − 9/26 = 17/26 ≈ 0.654.",
      ],
    },
    {
      title: "Problem 1.10 · Red and green balls, with and without replacement ⋆",
      problem: "An urn holds 7 red and 5 green balls; 4 are drawn. (a) Without replacement, find the probability that all are red, (b) that exactly two are red, (c) that at least one is green. (d) Repeat (a) with replacement and explain why the answer is larger.",
      steps: [
        "|Ω| = C(12, 4) = 495 (unordered samples without replacement, all equally likely).",
        "(a) C(7, 4)/495 = 35/495 = 7/99 ≈ 0.0707.",
        "(b) C(7, 2) · C(5, 2)/495 = 21 · 10/495 = 14/33 ≈ 0.424.",
        "(c) The complement of “at least one green” is “all red”: 1 − 7/99 = 92/99.",
        "(d) With replacement the ordered outcomes are 12⁴, all equally likely, and all-red has 7⁴ of them: (7/12)⁴ = 2401/20736 ≈ 0.1158.",
        "It is larger because without replacement each red draw lowers the fraction of reds left (7/12 · 6/11 · 5/10 · 4/9), while with replacement the fraction stays 7/12.",
        "Preview: hypergeometric versus binomial.",
      ],
    },
    {
      title: "Problem 1.11 · Lottery matches ⋆",
      problem: "In a lottery 6 numbers are drawn at random (without replacement) from {1, …, 49}; you hold a ticket with 6 distinct numbers. Find the probability of (a) matching all 6; (b) exactly 3 matches; (c) exactly 4 matches; (d) no match at all.",
      steps: [
        "The drawn set is a uniformly random 6-subset: C(49, 6) = 13,983,816 equally likely outcomes.",
        "For exactly j matches choose which j of your 6 numbers are drawn and which 6 − j of the other 43 numbers fill the rest: P(j matches) = C(6, j) · C(43, 6 − j)/C(49, 6).",
        "(a) j = 6: 1/13,983,816.",
        "(b) j = 3: (20 · 12,341)/13,983,816 = 246,820/13,983,816 ≈ 0.01765.",
        "(c) j = 4: (15 · 903)/13,983,816 = 13,545/13,983,816 ≈ 0.000969.",
        "(d) j = 0: C(43, 6)/C(49, 6) = 6,096,454/13,983,816 ≈ 0.4360.",
        "The seven events {j = 0, …, 6} partition Ω, so these probabilities sum to 1 (Vandermonde’s identity).",
        "Key idea: split the population into “good” (your 6) and “bad” (the other 43) and choose from each group.",
      ],
    },
    {
      title: "Problem 1.14 · More poker hands ⋆⋆",
      problem: "For a uniformly random 5-card hand find the probability of (a) two pair (two ranks each appearing twice, plus a card of a third rank); (b) exactly one pair (one rank twice, three other cards of three different ranks); (c) a flush that is not a straight flush (five cards of one suit; there are 40 straight flushes including royal).",
      steps: [
        "|Ω| = C(52, 5) = 2,598,960.",
        "(a) Choose the two ranks: C(13, 2) = 78. Suits for each pair: C(4, 2)² = 36. The fifth card comes from the remaining 52 − 8 = 44 cards (it cannot be of either paired rank): 78 · 36 · 44 = 123,552. Probability 123,552/2,598,960 = 198/4165 ≈ 0.0475.",
        "(b) Choose the paired rank (13), its suits C(4, 2) = 6, three different other ranks C(12, 3) = 220, and a suit for each (4³ = 64): 13 · 6 · 220 · 64 = 1,098,240. Probability ≈ 0.4226 (exactly 352/833).",
        "(c) Choose the suit (4) and five ranks C(13, 5) = 1287: 5148 flushes in total, minus 40 straight flushes: 5108. Probability 5108/2,598,960 = 1277/649,740 ≈ 0.00197.",
        "Key idea: count by structure (rank pattern, then suits), making sure the categories do not overlap. In (a) the fifth card must avoid both paired ranks.",
      ],
    },
    {
      title: "Problem 1.43 · Texas hold’em starting hands ⋆⋆",
      problem: "Two hole cards are dealt from a standard deck. Find the probability of (a) a pocket pair; (b) two cards of the same suit; (c) pocket aces; (d) at least one ace; (e) a pocket pair or suited cards; (f) exactly an ace and a king.",
      steps: [
        "|Ω| = C(52, 2) = 1326 unordered hands, equally likely.",
        "(a) 13 ranks × C(4, 2) = 6 suit pairs = 78, so 78/1326 = 1/17.",
        "(b) 4 suits × C(13, 2) = 78 rank pairs = 312, so 312/1326 = 4/17.",
        "(c) C(4, 2) = 6, so 6/1326 = 1/221.",
        "(d) Complement: no ace, C(48, 2) = 1128. 1 − 1128/1326 = 198/1326 = 33/221 ≈ 0.149.",
        "(e) A pair has two different suits, so “pair” and “suited” are disjoint: 1/17 + 4/17 = 5/17.",
        "(f) 4 × 4 = 16 combinations, so 16/1326 = 8/663 ≈ 0.0121.",
        "Key idea: check disjointness explicitly before adding.",
      ],
    },
    {
      title: "Problem 1.44 · Positions in a shuffled deck ⋆⋆",
      problem: "A deck is shuffled uniformly. Find the probability that (a) the top card is an ace; (b) the top two cards have the same rank; (c) the first ace is at position k (give a formula, check it for k = 1 and that the probabilities sum to 1); (d) the top and bottom cards are both aces.",
      steps: [
        "(a) By symmetry, 4/52 = 1/13.",
        "(b) Given the top card, 3 of the remaining 51 cards match its rank: 3/51 = 1/17.",
        "(c) The set of positions occupied by the four aces is a uniformly random 4-subset of {1, …, 52} (C(52, 4) = 270,725 equally likely). The first ace is at position k iff k is in the subset and the other three positions come from {k + 1, …, 52}: P(first ace at k) = C(52 − k, 3)/C(52, 4), for k = 1, …, 49.",
        "For k = 1: C(51, 3)/C(52, 4) = 20,825/270,725 = 1/13 ✓. The events “first ace at k” partition Ω, and Σ over k of C(52 − k, 3) = C(52, 4) (hockey-stick identity), so the probabilities sum to 1.",
        "(d) 4/52 · 3/51 = 1/221.",
        "Key idea: the positions of a set of special cards form a uniformly random subset.",
      ],
    },
    {
      title: "Problem 1.45 · Ten coin flips ⋆",
      problem: "A fair coin is tossed 10 times. Find the probability that (a) heads and tails occur equally often; (b) at least 8 heads occur; (c) the first and last tosses are both heads and there are exactly 5 heads in total.",
      steps: [
        "|Ω| = 2¹⁰ = 1024.",
        "(a) C(10, 5) = 252, so 252/1024 = 63/256 ≈ 0.246.",
        "(b) The cases 8, 9, 10 heads are disjoint: C(10, 8) + C(10, 9) + C(10, 10) = 45 + 10 + 1 = 56, so 56/1024 = 7/128 ≈ 0.0547.",
        "(c) Fix the first and last toss as heads. The remaining 8 tosses must contain exactly 3 heads: C(8, 3) = 56, so 56/1024 = 7/128. This equals (b) by coincidence of the number 56.",
        "Preview: the binomial distribution.",
      ],
    },
  ],

  "multinomials": [
    {
      title: "Problem 1.12 · Galileo’s three-dice problem ⋆",
      problem: "Three fair dice are rolled. (a) Show that P(sum = 9) = 25/216 but P(sum = 10) = 27/216, even though each sum can be written as a sum of three faces in exactly six ways ({1, 2, 6}, … for 9). (b) Find P(all faces different).",
      steps: [
        "Here |Ω| = 6³ = 216 ordered triples. The unordered decompositions are:",
        "Sum 9: {1, 2, 6}, {1, 3, 5}, {1, 4, 4}, {2, 2, 5}, {2, 3, 4}, {3, 3, 3}. Sum 10: {1, 3, 6}, {1, 4, 5}, {2, 2, 6}, {2, 3, 5}, {2, 4, 4}, {3, 3, 4}.",
        "Each unordered triple corresponds to 3! = 6 ordered outcomes if the faces are all different, 3 if exactly two agree, and 1 if all agree. So sum 9: 6 + 6 + 3 + 3 + 6 + 1 = 25, and sum 10: 6 + 6 + 3 + 6 + 3 + 3 = 27.",
        "(b) 6 · 5 · 4 = 120, so 120/216 = 5/9.",
        "Key idea: the equally likely objects are the ordered outcomes. Weight each unordered pattern by its number of orderings (a multinomial count).",
      ],
    },
    {
      title: "Problem 1.13 · Arranging MISSISSIPPI ⋆⋆",
      problem: "The letters of MISSISSIPPI (one M, four I, four S, two P) are arranged in a uniformly random order (all distinct arrangements equally likely). Find the probability that (a) the four S’s are consecutive; (b) the first letter is M; (c) no two S’s are adjacent.",
      steps: [
        "The number of distinct arrangements is 11!/(4! 4! 2!) = 34,650. Equivalently: label all 11 letters as distinct, take a uniform permutation of the labelled letters, and ignore labels. Every distinct arrangement then corresponds to exactly 4! 4! 2! labelled ones, so uniformity is preserved.",
        "(a) Glue the four S’s into one block. Arrange the block, M, four I, two P: 8!/(4! 2!) = 840. So 840/34,650 = 4/165.",
        "(b) Label the 11 letters. The first position is equally likely to hold any one of the 11 labelled letters, and exactly one of them is the M: 1/11. Check: (10!/(4! 4! 2!))/34,650 = 3150/34,650 = 1/11.",
        "(c) First arrange the seven non-S letters (M, 4 I, 2 P): 7!/(4! 2!) = 105 ways. They create 8 gaps (including the ends); choose 4 gaps for the S’s: C(8, 4) = 70. So (105 · 70)/34,650 = 7350/34,650 = 7/33 ≈ 0.212.",
        "Key idea: the “gap method” for non-adjacency, and the labelling trick to restore symmetry.",
      ],
    },
    {
      title: "Problem 1.51 · Poker dice: a complete partition ⋆⋆",
      problem: "Five fair dice are rolled. Classify the outcome by its face-multiplicity pattern: five different faces; one pair; two pairs; three of a kind; full house (3 + 2); four of a kind; five of a kind. Find the probability of each and verify that they add up to 1.",
      steps: [
        "|Ω| = 6⁵ = 7776. Count ordered outcomes: choose the face values for each group, then which dice carry which group (positions).",
        "Five different: 6 · 5 · 4 · 3 · 2 = 720, probability 5/54.",
        "One pair (2, 1, 1, 1): 6 · C(5, 2) · (5 · 4 · 3) = 3600, probability 25/54.",
        "Two pairs (2, 2, 1): C(6, 2) · 4 · 5!/(2! 2! 1!) = 15 · 4 · 30 = 1800, probability 25/108.",
        "Three of a kind (3, 1, 1): 6 · C(5, 3) · (5 · 4) = 1200, probability 25/162.",
        "Full house (3, 2): 6 · 5 · C(5, 3) = 300, probability 25/648.",
        "Four of a kind (4, 1): 6 · 5 · 5 = 150, probability 25/1296. Five of a kind: 6, probability 1/1296.",
        "Check: 720 + 3600 + 1800 + 1200 + 300 + 150 + 6 = 7776 ✓, so the seven patterns form a partition of Ω.",
        "Key idea: the total = 6⁵ check validates the whole counting scheme.",
      ],
    },
  ],

  "axioms": [],

  "properties": [
    {
      title: "Problem 1.2 · Inclusion–exclusion for three events ⋆",
      problem: "(a) Prove from the axioms that P(A ∪ B ∪ C) = P(A) + P(B) + P(C) − P(A ∩ B) − P(A ∩ C) − P(B ∩ C) + P(A ∩ B ∩ C). (b) Suppose P(A) = 0.6, P(B) = 0.5, P(C) = 0.4, P(A ∩ B) = 0.3, P(A ∩ C) = 0.2, P(B ∩ C) = 0.2, P(A ∩ B ∩ C) = 0.1. Find P(A ∪ B ∪ C) and the probability that exactly one of A, B, C occurs.",
      steps: [
        "(a) Put D = A ∪ B. By two-event inclusion–exclusion, P(D ∪ C) = P(D) + P(C) − P(D ∩ C) and P(D) = P(A) + P(B) − P(A ∩ B).",
        "By distributivity, D ∩ C = (A ∩ C) ∪ (B ∩ C), and (A ∩ C) ∩ (B ∩ C) = A ∩ B ∩ C. Applying inclusion–exclusion again, P(D ∩ C) = P(A ∩ C) + P(B ∩ C) − P(A ∩ B ∩ C). Substituting gives the three-event formula.",
        "(b) Sum of singles = 1.5; sum of pairs = 0.7; triple = 0.1. So P(A ∪ B ∪ C) = 1.5 − 0.7 + 0.1 = 0.9.",
        "For “exactly one”, split into the disjoint events “only A”, “only B”, “only C”. P(only A) = 0.6 − 0.3 − 0.2 + 0.1 = 0.2; P(only B) = 0.5 − 0.3 − 0.2 + 0.1 = 0.1; P(only C) = 0.4 − 0.2 − 0.2 + 0.1 = 0.1. Total: 0.4.",
        "Check by partitioning Ω by the number of events that occur: none = 1 − 0.9 = 0.1; exactly one = 0.4; exactly two = (0.3 − 0.1) + (0.2 − 0.1) + (0.2 − 0.1) = 0.4; all three = 0.1. Total = 1.0 ✓.",
      ],
    },
    {
      title: "Problem 1.17 · A survey of three subjects ⋆",
      problem: "Among 100 students, 60 take Maths, 50 Physics, 40 Chemistry; 30 take Maths and Physics, 20 Maths and Chemistry, 15 Physics and Chemistry; 10 take all three. A student is chosen at random. Find the probability that the student takes (a) at least one subject; (b) none; (c) exactly one; (d) exactly two; (e) Maths only.",
      steps: [
        "(a) By inclusion–exclusion: (60 + 50 + 40 − 30 − 20 − 15 + 10)/100 = 95/100 = 0.95. (b) So none = 0.05.",
        "Fill in the Venn regions from the inside out: only Maths 60 − 30 − 20 + 10 = 20; only Physics 50 − 30 − 15 + 10 = 15; only Chemistry 40 − 20 − 15 + 10 = 15; Maths & Physics only 30 − 10 = 20; Maths & Chemistry only 20 − 10 = 10; Physics & Chemistry only 15 − 10 = 5; all three 10; none 5.",
        "(c) 20 + 15 + 15 = 50, so 0.50. (d) 20 + 10 + 5 = 35, so 0.35. (e) 0.20.",
        "Check: 5 + 50 + 35 + 10 = 100 ✓.",
        "Key idea: always fill in the Venn regions from the inside out (triple overlap first).",
      ],
    },
    {
      title: "Problem 1.18 · Symmetric difference is a metric on events ⋆⋆",
      problem: "Define d(A, B) = P(A △ B). Prove: (a) d(A, B) = P(A) + P(B) − 2P(A ∩ B); (b) |P(A) − P(B)| ≤ d(A, B); (c) the triangle inequality d(A, C) ≤ d(A, B) + d(B, C); (d) if d(A, B) = 0 then P(A) = P(B).",
      steps: [
        "(a) A △ B = (A ∪ B) \\ (A ∩ B) with A ∩ B ⊆ A ∪ B. By monotonicity and two-event inclusion–exclusion, P(A △ B) = P(A ∪ B) − P(A ∩ B) = P(A) + P(B) − 2P(A ∩ B).",
        "(b) Since A = (A ∩ B) ⊔ (A \\ B), P(A) = P(A ∩ B) + P(A \\ B), and likewise for B. Subtracting, P(A) − P(B) = P(A \\ B) − P(B \\ A). Its absolute value is at most max{P(A \\ B), P(B \\ A)} ≤ P(A △ B).",
        "(c) Claim: A △ C ⊆ (A △ B) ∪ (B △ C). Take ω ∈ A \\ C. If ω ∈ B then ω ∈ B \\ C ⊆ B △ C; if ω ∉ B then ω ∈ A \\ B ⊆ A △ B. Take ω ∈ C \\ A. If ω ∈ B then ω ∈ B \\ A ⊆ A △ B; if not, ω ∈ C \\ B ⊆ B △ C. Monotonicity and the union bound give d(A, C) ≤ d(A, B) + d(B, C).",
        "(d) Immediate from (b).",
        "Why it matters: if d(A, Bₙ) → 0 then P(Bₙ) → P(A). This is the standard way to show a complicated event can be approximated by simple ones.",
      ],
    },
  ],
};
