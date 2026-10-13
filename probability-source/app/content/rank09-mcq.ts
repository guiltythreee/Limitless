import type { QuizItem } from "./types";

// 150 multiple-choice questions (100 easy, 50 medium) from the Chapter 1 practice bank,
// grouped by lesson. Each explanation says why every wrong option is wrong.
export const mcqByLesson: Record<string, QuizItem[]> = {
  "sample-space": [
    {
      "question": "A die is rolled and a coin is flipped. How many outcomes does the (ordered) sample space contain?",
      "options": [
        "8",
        "36",
        "12",
        "6"
      ],
      "answer": 2,
      "explanation": "Answer (C). The experiment has two stages with 6 and 2 possibilities, so by the rule of product |Ω| = 6·2 = 12. Why the others are wrong: (A) Adds 6 + 2; stages combine by multiplying, not adding. (B) This is 6², the size of the sample space for two dice, not a die and a coin. (D) Counts only the die and ignores the coin."
    },
    {
      "question": "A fair coin is tossed repeatedly until the first head appears. Which is a correct sample space for the number of tosses needed?",
      "options": [
        "{H, T}",
        "{1, 2, 3, . . . } ∪ {∞}, where ∞ means “no head ever”",
        "{1, 2, . . . , 10}",
        "[0, ∞)"
      ],
      "answer": 1,
      "explanation": "Answer (B). The number of tosses can be any positive integer, and in principle a head might never come, which the extra outcome ∞ records. Why the others are wrong: (A) This describes a single toss, not the number of tosses until the first head. (C) Imposes an arbitrary cap of 10 tosses; longer waits are possible, so outcomes would be missing (not exhaus- tive). (D) A continuous range of real numbers; the number of tosses is a whole number."
    },
    {
      "question": "Two fair dice are rolled. How many of the 36 ordered outcomes have sum 7?",
      "options": [
        "7",
        "5",
        "12",
        "6"
      ],
      "answer": 3,
      "explanation": "Answer (D). (1,6),(2,5),(3,4),(4,3),(5,2),(6,1): six outcomes. Why the others are wrong: (A) Confuses the value 7 with the count of outcomes. (B) Misses one pair; there are 6 ordered pairs, one for each value of the first die. (C) Double-counts: {1,6} is already counted as both (1,6) and (6,1) among the 6."
    },
    {
      "question": "A fair coin is tossed 4 times. How many equally likely outcomes are there?",
      "options": [
        "8",
        "4",
        "16",
        "10"
      ],
      "answer": 2,
      "explanation": "Answer (C). 2⁴ = 16. Why the others are wrong: (A) 2³: this is the count for three tosses. (B) Counts the number of tosses, not the number of outcomes. (D) Has no counting interpretation here (the number of heads takes 5 values, but sequences number 16)."
    },
    {
      "question": "Two numbers are chosen from {1, 2, 3} without replacement and without regard to order. How many outcomes does the sample space have?",
      "options": [
        "3",
        "6",
        "9",
        "4"
      ],
      "answer": 0,
      "explanation": "Answer (A). 3/2 = 3: {1,2},{1,3},{2,3}. Why the others are wrong: (B) Counts ordered pairs (a,b) with a ≠ b. (C) Counts ordered pairs with replacement allowed. (D) No such count arises; the numbers selected are distinct."
    },
    {
      "question": "Two numbers are chosen from {1, 2, 3} with replacement, in order. How many outcomes does the sample space have?",
      "options": [
        "3",
        "9",
        "6",
        "8"
      ],
      "answer": 1,
      "explanation": "Answer (B). 3² = 9. Why the others are wrong: (A) This counts unordered pairs without replacement. (C) This is the ordered count without replacement (3 · 2). (D) No rule of counting gives 8 here."
    },
    {
      "question": "Two fair coins are tossed, and the outcome is recorded as an unordered multiset {HH}, {HT}, {TT}. P({HT}) =",
      "options": [
        "1/2",
        "1/3",
        "1/4",
        "2/3"
      ],
      "answer": 0,
      "explanation": "Answer (A). The multiset {HT} corresponds to two of the four equally likely ordered outcomes HT and TH: 2/4 = 1/2. Why the others are wrong: (B) Treats the three unordered outcomes as equally likely; they are not. (C) This is the probability of an ordered outcome like HT alone. (D) No outcome count supports 2/3."
    },
    {
      "question": "A student claims P(sum = 2) = P(sum = 7) = 1/11 for two fair dice. The error is that",
      "options": [
        "the 11 possible sums are not equally likely (the 36 ordered pairs are)",
        "each sum has probability 1/12",
        "a sum of 2 is impossible",
        "each sum should have probability 1/6"
      ],
      "answer": 0,
      "explanation": "Answer (A). The equally likely outcomes are the 36 ordered pairs; P(2) = 1/36, P(7) = 6/36. Why the others are wrong: (B) There are 11 sums, not 12; moreover the sums are not equally likely at all. (C) Sum 2 is possible: (1,1). (D) 1/6 is correct only for the sum 7."
    },
    {
      "question": "For two dice, someone uses the sample space Ω = {same, different}. Can this Ω be used to compute P(sum = 7)?",
      "options": [
        "Yes, since 7 is the most likely sum",
        "Yes, if the dice are fair",
        "Yes, by taking P(different) = 5/6",
        "No; “sum = 7” is not an event of this coarse sample space"
      ],
      "answer": 3,
      "explanation": "Answer (D). Outcomes of Ω do not determine whether the sum is 7; the sample space must be fine enough (e.g. the 36 ordered pairs). Why the others are wrong: (A) Which sum is most likely does not make the event expressible in a coarse space. (B) Fairness does not change the fact that Ω cannot express “sum = 7”. (C) P(different) = 5/6 is true but does not tell us how many of the “different” pairs sum to 7."
    }
  ],
  "events-operations": [
    {
      "question": "For events A and B, the event “A occurs but B does not” is",
      "options": [
        "A ∩ B",
        "A ∪ Bᶜ",
        "Aᶜ ∩ B",
        "A \\ B"
      ],
      "answer": 3,
      "explanation": "Answer (D). “A but not B” is A ∩ Bᶜ = A \\ B. Why the others are wrong: (A) A ∩ B_cmeans both occur. (B) A ∪ B occurs whenever A occurs or B fails; it includes outcomes where both occur. (C) This is “B occurs but A does not”, the roles are swapped."
    },
    {
      "question": "The event “exactly one of A and B occurs” is",
      "options": [
        "(A ∪ B) \\ (A ∩ B)",
        "A ∪ B",
        "A ∩ B",
        "(A ∩ B)ᶜ"
      ],
      "answer": 0,
      "explanation": "Answer (A). Remove the outcomes where both occur from the outcomes where at least one occurs; this is the symmetric difference A △ B. Why the others are wrong: (B) A ∪ B also contains outcomes where both occur. (C) This is “both occur”, the opposite extreme. (D) (A ∩ B)ᶜ is “not both”, which also includes the outcomes where neither occurs."
    },
    {
      "question": "If A ⊆ B, which statement is always true?",
      "options": [
        "P(A) ≥ P(B)",
        "A ∩ B = A",
        "A ∪ B = A",
        "A ∩ B = ∅"
      ],
      "answer": 1,
      "explanation": "Answer (B). Every outcome of A lies in B, so the intersection is all of A. Why the others are wrong: (A) The inequality is reversed; monotonicity gives P(A) ≤ P(B). (C) Correct would be A ∪ B = B; A ∪ B = A holds only if B = A. (D) A ∩ B = ∅ would say the events are disjoint, which contradicts A ⊆ B unless A = ∅."
    },
    {
      "question": "The indicator function of A ∩ B equals",
      "options": [
        "1_A + 1_B",
        "max(1_A, 1_B)",
        "|1_A − 1_B|",
        "1_A · 1_B"
      ],
      "answer": 3,
      "explanation": "Answer (D). The product is 1 exactly when both indicators are 1, i.e. when both events occur. Why the others are wrong: (A) The sum can equal 2; it is not an indicator. (B) The maximum is the indicator of A ∪ B. (C) This is the indicator of A △ B (exactly one occurs)."
    },
    {
      "question": "The indicator function of Aᶜ is",
      "options": [
        "1_A",
        "1 + 1_A",
        "1 − 1_A",
        "−1_A"
      ],
      "answer": 2,
      "explanation": "Answer (C). Where 1_A = 1 we need 0 and where 1_A = 0 we need 1: 1 − 1_A. Why the others are wrong: (A) This is the indicator of A itself, the opposite. (B) Takes the value 2 on A, which is not an indicator. (D) Takes values 0 and −1; not an indicator."
    },
    {
      "question": "For events A, B, the event (A \\ B) ∪ (A ∩ B) equals",
      "options": [
        "B",
        "A ∪ B",
        "Aᶜ",
        "A"
      ],
      "answer": 3,
      "explanation": "Answer (D). Splitting: A = (A ∩ Bᶜ) ⊔ (A ∩ B). Why the others are wrong: (A) Only equals A in general, not B. (B) Would include outcomes of B that are not in A. (C) The complement of A shares no outcome with A."
    }
  ],
  "set-theory": [
    {
      "question": "On Ω = {1, 2, 3, 4}, which collection of subsets is a σ-algebra?",
      "options": [
        "{∅, {1}, {2}, Ω}",
        "{∅, {1, 2}, {2, 3}, Ω}",
        "{∅, {1, 2}, {3, 4}, Ω}",
        "{{1}, {2}, {3}, {4}}"
      ],
      "answer": 2,
      "explanation": "Answer (C). It contains Ω, is closed under complements ({1,2}ᶜ = {3,4}) and under unions. Why the others are wrong: (A) Not closed under complements: {1}ᶜ = {2,3,4} is missing; also {1} ∪ {2} = {1,2} is missing. (B) {1,2} = {3,4} is missing, so it is not closed under complements. (D) Contains neither Ω nor ∅, and is not closed under unions."
    },
    {
      "question": "Ω = {1, . . . , 6}. How many events does the smallest σ-algebra containing {1, 2}, {3, 4} and {5, 6} have?",
      "options": [
        "8",
        "6",
        "3",
        "64"
      ],
      "answer": 0,
      "explanation": "Answer (A). It consists of all unions of the three blocks (each block in or out): 2³ = 8 events. Why the others are wrong: (B) Has no derivation: each of the 3 blocks is in or out of an event, giving 2³ = 8 events including ∅ and Ω, not 6. (C) Counts just the generating blocks; unions and complements must be included. (D) 2⁶ is the number of all subsets of Ω; the σ-algebra cannot separate 1 from 2."
    },
    {
      "question": "Let A₁ = {1, 2}, A₂ = {2, 3}, A₃ = {3, 4} and B₃ = A₃ ∩ A₁ᶜ ∩ A₂ᶜ be the third disjointified set. Then B₃ =",
      "options": [
        "{3, 4}",
        "{4}",
        "{3}",
        "∅"
      ],
      "answer": 1,
      "explanation": "Answer (B). B₃ = outcomes in A₃ that are in neither A₁ nor A₂: 3 ∈ A₂ is removed, leaving {4}. Why the others are wrong: (A) This is A₃ itself; the overlap with A₂ is not removed. (C) 3 is in A₂, so it belongs to B₂, not B₃. (D) 4 is in none of A₁,A₂, so B₃ is non-empty."
    },
    {
      "question": "Which of the following sets is countable?",
      "options": [
        "[0, 1]",
        "R",
        "Q",
        "{0, 1}^N (infinite sequences of coin tosses)"
      ],
      "answer": 2,
      "explanation": "Answer (C). The rationals can be listed as a sequence, so Q is countable. Why the others are wrong: (A) Intervals are uncountable (Cantor’s diagonal argument). (B) R is uncountable. (D) Infinite binary sequences correspond to binary expansions of points in [0,1]; uncountable."
    }
  ],
  "mutually-exclusive": [
    {
      "question": "One die is rolled. Which pair of events is mutually exclusive?",
      "options": [
        "“less than 3” and “greater than 4”",
        "“even” and “greater than 4”",
        "“odd” and “prime”",
        "“at most 3” and “at least 3”"
      ],
      "answer": 0,
      "explanation": "Answer (A). {1,2} ∩ {5,6} = ∅. Why the others are wrong: (B) 6 is both even and greater than 4. (C) 3 and 5 are both odd and prime. (D) 3 satisfies both."
    },
    {
      "question": "Events A, B are mutually exclusive with P(A) = 0.2 and P(B) = 0.5. Then P(A ∪ B) =",
      "options": [
        "0.1",
        "0.3",
        "0.7",
        "0.5"
      ],
      "answer": 2,
      "explanation": "Answer (C). For disjoint events probabilities add: 0.2 + 0.5 = 0.7. Why the others are wrong: (A) The product 0.2 × 0.5 applies to independent intersections, not to unions of disjoint events. (B) Subtracts; the subtraction in inclusion–exclusion removes P(A ∩ B), which is 0 here. (D) Takes only the larger one; ignores A."
    },
    {
      "question": "A, B are mutually exclusive, P(A) = 0.5, P(B) = 0.4. P(neither occurs) =",
      "options": [
        "0.1",
        "0.2",
        "0.9",
        "0.6"
      ],
      "answer": 0,
      "explanation": "Answer (A). P(A ∪ B) = 0.9 (disjoint), so P(neither) = 1 − 0.9 = 0.1. Why the others are wrong: (B) 0.5 × 0.4; products are for independent events and not relevant here. (C) This is P(at least one), not “neither”. (D) This is 1 − P(B) = P(Bᶜ), forgetting about A."
    },
    {
      "question": "Events A, B are mutually exclusive with positive probabilities. Which statement is guaranteed?",
      "options": [
        "A and B are independent",
        "P(A ∩ B) = P(A)P(B)",
        "A ⊆ B",
        "P(A ∪ B) = P(A) + P(B)"
      ],
      "answer": 3,
      "explanation": "Answer (D). Disjointness gives P(A ∩ B) = 0, so inclusion–exclusion reduces to simple addition. Why the others are wrong: (A) Disjoint events with positive probabilities are dependent: knowing A occurred rules out B. (B) Here P(A ∩ B) = 0 ≠ P(A)P(B) > 0. (C) Inclusion would force A ∩ B = A ≠ ∅, contradicting disjointness."
    },
    {
      "question": "Consider three events A, B, C. (I) If they are pairwise disjoint then A∩B∩C = ∅. (II) If A∩B∩C = ∅ then they are pairwise disjoint. (III) If they are pairwise disjoint then P(A ∪ B ∪ C) = P(A) + P(B) + P(C). Which statements are true?",
      "options": [
        "II only",
        "I and II only",
        "II and III only",
        "I and III only"
      ],
      "answer": 3,
      "explanation": "Answer (D). (I) pairwise disjoint implies even A ∩ B = ∅, so the triple intersection is empty. (III) is finite additivity. (II) is false: {1,2},{2,3},{1,3} have empty triple intersection but pairwise overlap. Why the others are wrong: (A) Statement (II) is false, and (I), (III) are true. (B) (II) is false; (III) is true. (C) (II) is false; (I) is true."
    }
  ],
  "exhaustive-partitions": [
    {
      "question": "One die is rolled. Which collection of events is exhaustive but not mutually exclusive?",
      "options": [
        "{1, 2}, {3, 4}",
        "{1, 2}, {3, 4}, {5, 6}",
        "{1, 2, 3}, {3, 4, 5, 6}",
        "“odd”, “even”"
      ],
      "answer": 2,
      "explanation": "Answer (C). The union is {1,...,6} (exhaustive) but both events contain 3 (overlap). Why the others are wrong: (A) Not exhaustive: 5 and 6 are missing. (B) A partition: exhaustive and mutually exclusive. (D) Also a partition: exactly one of “odd”, “even” always occurs."
    },
    {
      "question": "A partition of a sample space Ω is a collection of events that are",
      "options": [
        "pairwise disjoint",
        "such that their union is Ω",
        "equally likely",
        "pairwise disjoint and with union Ω"
      ],
      "answer": 3,
      "explanation": "Answer (D). “Exactly one occurs” requires both conditions: at most one (disjoint) and at least one (exhaustive). Why the others are wrong: (A) Disjointness alone allows gaps; some outcomes might lie in none of the events. (B) Exhaustiveness alone allows overlaps; an outcome might lie in several. (C) A partition need not have equal probabilities."
    },
    {
      "question": "Which of the following is a partition of Ω = {1, 2, 3, 4, 5, 6}?",
      "options": [
        "{1, 2}, {2, 3, 4}, {5, 6}",
        "{1, 2}, {3, 4}, {5, 6}",
        "{1, 2}, {3, 4}",
        "{1, 2, 3}, {3, 4, 5}, {6}"
      ],
      "answer": 1,
      "explanation": "Answer (B). The three sets are disjoint and their union is Ω. Why the others are wrong: (A) 2 belongs to two of the sets, so they are not disjoint. (C) Not exhaustive; 5 and 6 are in no set. (D) 3 belongs to two sets; not disjoint."
    },
    {
      "question": "A₁, A₂, A₃ partition Ω with P(A₁) = 0.2 and P(A₂) = 0.5. Then P(A₃) =",
      "options": [
        "0.7",
        "0.1",
        "0.2",
        "0.3"
      ],
      "answer": 3,
      "explanation": "Answer (D). Probabilities of a partition add to 1: 1 − 0.2 − 0.5 = 0.3. Why the others are wrong: (A) This is P(A₁) + P(A₂), not P(A₃). (B) Comes from 0.2 × 0.5; products play no role here. (C) Assumes A₃ has the same probability as A₁ with no justification."
    },
    {
      "question": "A₁, A₂, A₃ partition Ω with probabilities 0.2, 0.5, 0.3. For an event B, P(B ∩ Aᵢ) = 0.1, 0.25, 0.15 respectively. Then P(B) =",
      "options": [
        "0.5",
        "0.3",
        "1.0",
        "0.25"
      ],
      "answer": 0,
      "explanation": "Answer (A). P(B) = Σᵢ P(B ∩ Aᵢ) = 0.1 + 0.25 + 0.15 = 0.5 (decomposition along a partition). Why the others are wrong: (B) No such combination; it is neither a sum nor a weighted average of the given numbers. (C) This is Σᵢ P(Aᵢ), the probability of Ω. (D) Uses only the middle piece; B meets all three parts of the partition."
    },
    {
      "question": "A and B are mutually exclusive and exhaustive events with P(A) = P(B) = 0.5. Then P(A ∪ B) =",
      "options": [
        "0.5",
        "0.25",
        "0",
        "1"
      ],
      "answer": 3,
      "explanation": "Answer (D). Exhaustive means A ∪ B = Ω, so the probability is 1 (consistent with 0.5 + 0.5 for disjoint events). Why the others are wrong: (A) Takes only one of the two events. (B) The product 0.5 × 0.5; not relevant to a union. (C) This would be P(A ∩ B), which is 0 by disjointness, but the question asks about the union."
    }
  ],
  "counting": [
    {
      "question": "In how many different orders can 4 distinct books be arranged on a shelf?",
      "options": [
        "4",
        "8",
        "16",
        "24"
      ],
      "answer": 3,
      "explanation": "Answer (D). 4! = 24. Why the others are wrong: (A) Counts the books, not the arrangements. (B) 4 · 2 has no meaning here. (C) 4² or 2⁴: ignores that each book is used exactly once."
    },
    {
      "question": "Four distinct books are arranged on a shelf in random order. P(two specified books are next to each other) =",
      "options": [
        "1/4",
        "1/3",
        "1/2",
        "2/3"
      ],
      "answer": 2,
      "explanation": "Answer (C). Adjacent ordered position pairs: 2 · 3 = 6 of 4 · 3 = 12; probability 2/n = 1/2. Why the others are wrong: (A) Uses 1/n; it ignores that either book can be on the left. (B) No counting argument gives 1/3. (D) 2/3 is the adjacency probability around a round table of 4 (2/(n−1)); a shelf is a row, not a circle."
    },
    {
      "question": "A 3-letter “word” is formed by choosing each letter independently from {A, B, C, D} (repetition allowed). P(all letters different) =",
      "options": [
        "3/8",
        "5/8",
        "1/16",
        "1/2"
      ],
      "answer": 0,
      "explanation": "Answer (A). |Ω| = 4³ = 64; all-different words: 4 · 3 · 2 = 24; 24/64 = 3/8. Why the others are wrong: (B) This is P(at least two letters equal) = 1 − 3/8. (C) Mixes an unordered count (4 sets) with an ordered sample space (64). (D) Treats “all different” and “not all different” as equally likely; they are not."
    },
    {
      "question": "Three people A, B, C stand in a random order. P(A is ahead of B) =",
      "options": [
        "1/3",
        "1/2",
        "1/6",
        "2/3"
      ],
      "answer": 1,
      "explanation": "Answer (B). By symmetry A ahead of B and B ahead of A are equally likely and exhaustive: 1/2. Why the others are wrong: (A) Confuses with the probability that A is first among three. (C) This is the probability of one specific full ordering. (D) No symmetry argument gives 2/3."
    },
    {
      "question": "8 people are seated at random around a round table. P(A and B sit next to each other) =",
      "options": [
        "1/4",
        "2/7",
        "1/7",
        "3/8"
      ],
      "answer": 1,
      "explanation": "Answer (B). Fix A; B is equally likely to be in any of the other 7 seats, 2 of which are adjacent: 2/7. Why the others are wrong: (A) 2/n = 2/8 is the answer for a row of 8 seats (the two end seats have only one neighbour). (C) Counts only one neighbouring seat. (D) No counting argument yields 3 favourable seats."
    },
    {
      "question": "Four hats are returned to four owners uniformly at random. P(nobody gets their own hat) =",
      "options": [
        "1/e ≈ 0.368",
        "5/8",
        "1/4",
        "3/8"
      ],
      "answer": 3,
      "explanation": "Answer (D). There are 9 derangements of 4 objects out of 24 permutations: 9/24 = 3/8. Why the others are wrong: (A) This is the limit as n → ∞, not the exact value for n = 4. (B) This is P(at least one match) = 1 − 3/8. (C) No count gives 6 derangements."
    }
  ],
  "combinations": [
    {
      "question": "How many different 5-card hands (order irrelevant) are there from a 52-card deck?",
      "options": [
        "52⁵",
        "52 · 51 · 50 · 49 · 48 (₅₂)",
        "C(52, 5)",
        "5⁵⁵²"
      ],
      "answer": 2,
      "explanation": "Answer (C). Unordered selections without replacement: C(52,5) = 2,598,960. Why the others are wrong: (A) Counts ordered selections with replacement. (B) Counts ordered selections without replacement; each hand is counted 5! = 120 times. (D) Reverses base and exponent; meaningless here."
    },
    {
      "question": "How many committees of 2 people can be chosen from 5 people?",
      "options": [
        "20",
        "10",
        "25",
        "5"
      ],
      "answer": 1,
      "explanation": "Answer (B). C(5,2) = 10. Why the others are wrong: (A) 5 · 4 = 20 counts ordered pairs (president, secretary); each committee is counted twice. (C) 5 allows the same person twice. (D) Counts only the people, not the pairs."
    },
    {
      "question": "A 5-card hand is dealt. P(all five are hearts) =",
      "options": [
        "C(13,5)/C(52,5)",
        "(1/4)⁵",
        "13/52",
        "5/13"
      ],
      "answer": 0,
      "explanation": "Answer (A). Favourable hands: C(13,5) out of C(52,5) (about 0.0005). Why the others are wrong: (B) Draws with replacement (each card independently a heart with probability 1/4); real hands are without replacement. (C) This is the probability that a single card is a heart. (D) No basis; it is far too large."
    },
    {
      "question": "Two cards are dealt from a standard deck (without replacement). P(both are aces) =",
      "options": [
        "1/169",
        "1/13",
        "1/221",
        "1/26"
      ],
      "answer": 2,
      "explanation": "Answer (C). 4/52 · 3/51 = 12/2652 = 1/221 (or C(4,2)/C(52,2)). Why the others are wrong: (A) Uses 4/52 · 4/52, i.e. draws with replacement. (B) This is the probability that the first card alone is an ace. (D) No basis; 1/26 = 2/52."
    },
    {
      "question": "An urn has 3 red and 2 blue balls. Two are drawn without replacement. P(both red) =",
      "options": [
        "3/10",
        "9/25",
        "3/5",
        "6/25"
      ],
      "answer": 0,
      "explanation": "Answer (A). C(3,2)/C(5,2) = 3/10 (or 3/5 · 2/4). Why the others are wrong: (B) (3/5)²: draws with replacement. (C) This is the probability that the first ball alone is red. (D) This is 3/5 · 2/5, a with-replacement probability of “red then blue”."
    },
    {
      "question": "An urn has 3 red and 2 blue balls. Two are drawn without replacement. P(exactly one red) =",
      "options": [
        "3/10",
        "6/25",
        "3/5",
        "12/25"
      ],
      "answer": 2,
      "explanation": "Answer (C). C(3,1)·C(2,1)/C(5,2) = 6/10 = 3/5. Why the others are wrong: (A) This is P(both red). (B) A with-replacement probability for the single ordering “red then blue”. (D) 2 · 3/5 · 2/5: the with-replacement value for exactly one red; here draws are without replacement."
    },
    {
      "question": "Two cards are dealt from a standard deck. P(both have the same suit) =",
      "options": [
        "1/4",
        "4/17",
        "13/52",
        "1/17"
      ],
      "answer": 1,
      "explanation": "Answer (B). Given the first card, 12 of the remaining 51 cards share its suit: 12/51 = 4/17. Why the others are wrong: (A) Would be correct with replacement, since then the suit would match with probability 1/4. (C) Same as 1/4; the probability for a single card to be of a given suit. (D) This is the probability of a pocket pair (same rank), not same suit."
    },
    {
      "question": "A 5-card hand is dealt from a standard deck. P(exactly two aces) ≈",
      "options": [
        "0.0452",
        "0.0465",
        "0.0040",
        "0.0399"
      ],
      "answer": 3,
      "explanation": "Answer (D). C(4,2)·C(48,3)/C(52,5) = (6·17296)/2598960 ≈ 0.0399. Why the others are wrong: (A) C(4,2)·C(50,3)/C(52,5): “choose two aces then any three cards” lets the other three be aces too, so hands with 3 or 4 aces are overcounted. (B) C(5,2)(1/13)²(12/13)³ treats the cards as drawn with replacement. (C) This is the probability of one specific arrangement (AAxxx in order) and omits the factor C(5,2) = 10 for which positions hold the aces."
    },
    {
      "question": "A 5-card hand is dealt. The probability that all five ranks are different (straights and flushes allowed) is",
      "options": [
        "0.4226",
        "0.5071",
        "0.5012",
        "0.3"
      ],
      "answer": 1,
      "explanation": "Answer (B). C(13,5) · 4⁵ / C(52,5) = (1287 · 1024)/2598960 ≈ 0.5071. Why the others are wrong: (A) This is P(exactly one pair). (C) This is the “high card” probability that excludes straights and flushes; here they are allowed. (D) Has no derivation."
    },
    {
      "question": "In a lottery 6 numbers are drawn from {1, . . . , 49} and you hold 6 distinct numbers. P(at least one match) ≈",
      "options": [
        "0.564",
        "0.122",
        "0.436",
        "1"
      ],
      "answer": 0,
      "explanation": "Answer (A). Complement: no match, C(43,6)/C(49,6) ≈ 0.436; so 1 − 0.436 = 0.564. Why the others are wrong: (B) 6/49 ≈ 0.122 is the chance that one particular number of yours is drawn, not the chance of at least one match among six. (C) This is the probability of no match. (D) A match is not certain."
    },
    {
      "question": "Three fair dice X₁, X₂, X₃ are rolled. P(X₁ < X₂ < X₃) =",
      "options": [
        "1/6",
        "5/54",
        "1/36",
        "5/9"
      ],
      "answer": 1,
      "explanation": "Answer (B). Choose three distinct values (C(6,3) = 20); exactly one ordering is increasing: 20/216 = 5/54. Why the others are wrong: (A) Given all three distinct, each of the 6 orderings is equally likely (1/6); but the event “all distinct” has probability only 5/9. (C) Has no derivation. (D) This is P(all three different)."
    }
  ],
  "multinomials": [
    {
      "question": "The letters of BOOK are arranged in a uniformly random way among the distinct arrangements. P(the first letter is O) =",
      "options": [
        "1/4",
        "1/3",
        "1/2",
        "3/4"
      ],
      "answer": 2,
      "explanation": "Answer (C). There are (4!)/(2!) = 12 distinct arrangements; those starting with O: arrangements of {B,O,K}, 3! = 6. So 6/12 = 1/2. (Labelled letters: 2 of 4 letters are O.) Why the others are wrong: (A) Counts only one of the two O’s. (B) Treats the three distinct letters B,O,K as equally likely first letters; O is twice as likely because it appears twice. (D) No count supports 9 favourable arrangements."
    }
  ],
  "axioms": [
    {
      "question": "If P(A) = 0.3, then P(Aᶜ) =",
      "options": [
        "0.7",
        "0.3",
        "1.3",
        "−0.3"
      ],
      "answer": 0,
      "explanation": "Answer (A). Complement rule: 1 − 0.3 = 0.7. Why the others are wrong: (B) Confuses A with Aᶜ; they have different probabilities unless P(A) = 1/2. (C) Adds instead of subtracting; probabilities cannot exceed 1. (D) Probabilities are never negative."
    },
    {
      "question": "Which of the following probability assignments is impossible?",
      "options": [
        "P(A) = 0.5, P(B) = 0.4, P(A ∪ B) = 0.9",
        "P(A) = 0.5, P(B) = 0.5, P(A ∩ B) = 0.6",
        "P(A) = 0.7, P(B) = 0.6, P(A ∩ B) = 0.4",
        "P(A) = 0.2, P(B) = 0.9, P(A ∪ B) = 0.9"
      ],
      "answer": 1,
      "explanation": "Answer (B). A ∩ B ⊆ A, so P(A ∩ B) ≤ P(A) = 0.5 < 0.6: monotonicity is violated. Why the others are wrong: (A) Possible: this is the disjoint case, 0.5 + 0.4 = 0.9. (C) Possible: P(A ∪ B) = 0.7 + 0.6 − 0.4 = 0.9 ≤ 1 and 0.4 ≤ min(0.7,0.6). (D) Possible with A ⊆ B: then P(A ∪ B) = P(B) = 0.9."
    },
    {
      "question": "Which of the following is not one of Kolmogorov’s axioms (it is instead a consequence of them)?",
      "options": [
        "P(Aᶜ) = 1 − P(A)",
        "P(A) ≥ 0 for every event A",
        "P(Ω) = 1",
        "Countable additivity for pairwise disjoint events"
      ],
      "answer": 0,
      "explanation": "Answer (A). The complement rule is derived: Ω = A ⊔ Aᶜ and additivity plus normalisation give 1 = P(A) + P(Aᶜ). Why the others are wrong: (B) This is axiom (A1), non-negativity. (C) This is axiom (A2), normalisation. (D) This is axiom (A3), countable additivity."
    },
    {
      "question": "If P(A) = 0, then",
      "options": [
        "A must be the empty set",
        "A must be a finite set",
        "A can be a non-empty (even infinite) set",
        "A must equal Ω"
      ],
      "answer": 2,
      "explanation": "Answer (C). For U uniform on [0,1], P(U = 1/2) = 0 and even P(U ∈ Q) = 0 although these sets are non-empty (the latter infinite). Probability 0 means null, not impossible. Why the others are wrong: (A) Only the empty set is empty; many non-empty events have probability 0 in continuous models. (B) The rationals in [0,1] form an infinite null event. (D) That would give probability 1, not 0."
    },
    {
      "question": "On Ω = {a, b, c}, which assignment of probabilities is valid?",
      "options": [
        "(0.5, 0.3, 0.3)",
        "(0.4, 0.4, −0.2)",
        "(0.3, 0.3, 0.3)",
        "(0.2, 0.3, 0.5)"
      ],
      "answer": 3,
      "explanation": "Answer (D). Entries are non-negative and sum to 1. Why the others are wrong: (A) Sums to 1.1; violates normalisation. (B) Sums to 0.6 and contains a negative value; violates both (A1) and (A2). (C) Sums to 0.9; violates normalisation."
    },
    {
      "question": "P({n}) = c · 2^(−n) for n = 1, 2, 3, … defines a probability measure. Then c =",
      "options": [
        "1/2",
        "2",
        "1",
        "1/4"
      ],
      "answer": 2,
      "explanation": "Answer (C). Σₙ≥1 2^(−n) = 1, so normalisation forces c = 1. Why the others are wrong: (A) Would make the total 1/2. (B) Would make the total 2. (D) Would make the total 1/4."
    },
    {
      "question": "A set function Q on subsets of N is finitely additive, Q({n}) = 0 for every n, and Q(N) = 1. Which axiom of probability does Q violate?",
      "options": [
        "Non-negativity",
        "Normalisation",
        "Countable additivity",
        "Finite additivity"
      ],
      "answer": 2,
      "explanation": "Answer (C). N = ⋃ₙ {n} gives Q(N) = 1 ≠ Σₙ Q({n}) = 0. Why the others are wrong: (A) Q ≥ 0 is consistent with all the given data. (B) Q(N) = 1 is given. (D) It is stated to be finitely additive."
    },
    {
      "question": "A die is rolled until the first six appears. P(the six appears on an even-numbered roll) =",
      "options": [
        "1/2",
        "5/11",
        "6/11",
        "5/12"
      ],
      "answer": 1,
      "explanation": "Answer (B). Σₖ≥1 (1/6)(5/6)^(2k−1) = (5/36)/(1 − 25/36) = 5/11. Why the others are wrong: (A) Parity is not symmetric: the first roll has a head start, so odd is more likely than even. (C) This is the probability of an odd roll number. (D) Has no derivation; it ignores the geometric series."
    },
    {
      "question": "Two players alternate tossing a fair coin; A starts and the first head wins. P(A wins) =",
      "options": [
        "1/2",
        "1/3",
        "3/4",
        "2/3"
      ],
      "answer": 3,
      "explanation": "Answer (D). Σₖ≥0 (1/2)^(2k) · 1/2 = (1/2)/(1 − 1/4) = 2/3. Why the others are wrong: (A) Ignores the advantage of tossing first. (B) This is P(B wins). (C) No derivation; the series gives 2/3."
    },
    {
      "question": "A fair coin is tossed repeatedly. P(the first head occurs on an even toss) =",
      "options": [
        "1/2",
        "1/3",
        "2/3",
        "1/4"
      ],
      "answer": 1,
      "explanation": "Answer (B). Σₖ≥1 2^(−2k) = (1/4)/(1 − 1/4) = 1/3. Why the others are wrong: (A) Parity is not symmetric: the first toss gives odd numbers a head start. (C) This is P(first head on an odd toss). (D) Only the term k = 1 of the series."
    },
    {
      "question": "A fair coin is tossed repeatedly. P(the first head occurs on a toss number divisible by 3) =",
      "options": [
        "1/3",
        "1/6",
        "1/7",
        "2/7"
      ],
      "answer": 2,
      "explanation": "Answer (C). Σₖ≥1 2^(−3k) = (1/8)/(1 − 1/8) = 1/7. Why the others are wrong: (A) Wrongly assumes every residue class mod 3 is equally likely. (B) No derivation; only the first term gives 1/8. (D) This is the probability of residue class 2 mod 3 ((1/4)/(7/8) = 2/7)."
    }
  ],
  "properties": [
    {
      "question": "P(A) = 0.6, P(B) = 0.5, P(A ∩ B) = 0.2. Then P(A ∪ B) =",
      "options": [
        "1.1",
        "0.3",
        "0.7",
        "0.9"
      ],
      "answer": 3,
      "explanation": "Answer (D). 0.6 + 0.5 − 0.2 = 0.9. Why the others are wrong: (A) Forgets to subtract the overlap, which is counted twice; the result also exceeds 1. (B) This is the product 0.6 × 0.5, which has no role in this formula. (C) Subtracts the overlap twice (0.6 + 0.5 − 0.4)."
    },
    {
      "question": "A ⊆ B and P(A) = 0.4. What can we conclude about P(B)?",
      "options": [
        "It can be anything in [0, 1]",
        "P(B) ≥ 0.4",
        "P(B) ≤ 0.4",
        "P(B) = 0.4"
      ],
      "answer": 1,
      "explanation": "Answer (B). Monotonicity: A ⊆ B ⇒ P(A) ≤ P(B), so P(B) ∈ [0.4,1]. Why the others are wrong: (A) Values below 0.4 are impossible by monotonicity. (C) The inequality is reversed. (D) P(B) = 0.4 is possible (e.g. B = A) but not forced; B could be larger."
    },
    {
      "question": "For any two events A, B, which statement is always true?",
      "options": [
        "P(A ∩ B) ≥ P(A)P(B)",
        "P(A ∩ B) ≥ max(P(A), P(B))",
        "P(A ∩ B) = P(A)P(B)",
        "P(A ∩ B) ≤ min(P(A), P(B))"
      ],
      "answer": 3,
      "explanation": "Answer (D). A ∩ B ⊆ A and A ∩ B ⊆ B, so monotonicity gives both bounds. Why the others are wrong: (A) False for disjoint events of positive probability: 0 < P(A)P(B). (B) Reversed: the intersection is at most the smaller of the two. (C) True only for independent events (Chapter 4), not in general."
    },
    {
      "question": "Three events each have probability 0.4. The union bound (together with P ≤ 1) gives the tightest guaranteed upper bound on P(A ∪ B ∪ C) of",
      "options": [
        "0.4",
        "1.2",
        "1",
        "0.784"
      ],
      "answer": 2,
      "explanation": "Answer (C). Union bound: ≤ 1.2; but any probability is at most 1, so the best guaranteed bound is 1. Why the others are wrong: (A) Only the largest single probability; the union can be larger. (B) Valid but weaker than 1, and not a possible probability. (D) 1 − 0.6 is the value under independence, which is not assumed."
    },
    {
      "question": "P(A) = 0.7, P(B) = 0.6. The smallest possible value of P(A ∩ B) is",
      "options": [
        "0",
        "0.3",
        "0.42",
        "0.6"
      ],
      "answer": 1,
      "explanation": "Answer (B). P(A ∩ B) = P(A) + P(B) − P(A ∪ B) ≥ 0.7 + 0.6 − 1 = 0.3. Why the others are wrong: (A) Disjoint events would have total probability 1.3 > 1, impossible. (C) The value under independence; it is allowed but not the minimum. (D) This is the maximum possible value (case B ⊆ A)."
    },
    {
      "question": "P(A) = 0.4, P(B) = 0.5, P(A ∪ B) = 0.7. Then P(A ∩ B) =",
      "options": [
        "0.1",
        "0.3",
        "0.2",
        "0.9"
      ],
      "answer": 2,
      "explanation": "Answer (C). Inclusion–exclusion: 0.7 = 0.4 + 0.5 − P(A ∩ B), so P(A ∩ B) = 0.2. Why the others are wrong: (A) Plugging in gives 0.4 + 0.5 − 0.1 = 0.8 ≠ 0.7. (B) Gives 0.4 + 0.5 − 0.3 = 0.6 ≠ 0.7. (D) This is 0.4 + 0.5, the sum without subtracting the union."
    },
    {
      "question": "P(A) = 0.6 and P(A ∩ B) = 0.25. Then P(A \\ B) =",
      "options": [
        "0.85",
        "0.35",
        "0.15",
        "0.25"
      ],
      "answer": 1,
      "explanation": "Answer (B). A = (A ∩ B) ⊔ (A \\ B), so P(A \\ B) = 0.6 − 0.25 = 0.35. Why the others are wrong: (A) Adds instead of subtracting. (C) Has no derivation: 0.6 − 0.25 = 0.35, not 0.15. (D) This is P(A ∩ B) itself."
    },
    {
      "question": "P(A) = 0.5, P(B) = 0.4, P(A ∩ B) = 0.2. The probability that exactly one of A, B occurs is",
      "options": [
        "0.5",
        "0.7",
        "0.9",
        "0.3"
      ],
      "answer": 0,
      "explanation": "Answer (A). P(A △ B) = P(A) + P(B) − 2P(A ∩ B) = 0.9 − 0.4 = 0.5. Why the others are wrong: (B) This is P(A ∪ B), which includes the case that both occur. (C) The sum P(A) + P(B) without removing the overlap at all. (D) This is P(A \\ B) = 0.3, only one of the two “exactly one” cases."
    },
    {
      "question": "P(A) = 0.5, P(B) = 0.3 and P(A ∪ B) = 0.7. The probability that neither A nor B occurs is",
      "options": [
        "0.2",
        "0.3",
        "0.7",
        "0.15"
      ],
      "answer": 1,
      "explanation": "Answer (B). Neither is the complement of the union: 1 − 0.7 = 0.3. Why the others are wrong: (A) Equal to 0.5 − 0.3; subtracting the two probabilities has no meaning here. (C) This is P(at least one). (D) The product 0.5 × 0.3; not the complement of the union."
    },
    {
      "question": "Four events A₁, . . . , A₄ have probabilities 0.1, 0.2, 0.15, 0.05. A valid upper bound for P(A₁ ∪ A₂ ∪ A₃ ∪ A₄) with no other information is",
      "options": [
        "0.00015",
        "0.2",
        "0.5",
        "0.65"
      ],
      "answer": 2,
      "explanation": "Answer (C). Union bound: 0.1 + 0.2 + 0.15 + 0.05 = 0.5. Why the others are wrong: (A) The product of the four probabilities (as if all occurred together); unrelated to a union. (B) The largest single probability is a lower bound for the union, not an upper bound. (D) Not the sum of the given numbers."
    },
    {
      "question": "Which inequality is true for all events A, B?",
      "options": [
        "P(A ∪ B) ≥ P(A) + P(B)",
        "P(A ∪ B) = P(A) + P(B)",
        "P(A ∪ B) ≤ P(A) + P(B)",
        "P(A ∪ B) ≤ P(A)P(B)"
      ],
      "answer": 2,
      "explanation": "Answer (C). Boole’s inequality: P(A ∪ B) = P(A) + P(B) − P(A ∩ B) ≤ P(A) + P(B). Why the others are wrong: (A) Reversed; it fails when A,B overlap. (B) Equality only if P(A ∩ B) = 0. (D) False in general: if A = B with P(A) = 1/2, then P(A ∪ B) = 1/2 > 1/4 = P(A)P(B)."
    },
    {
      "question": "If P(A) = 0.9 and P(B) = 0.8, then P(A ∩ B) is at least",
      "options": [
        "0.72",
        "0.7",
        "0.8",
        "0.1"
      ],
      "answer": 1,
      "explanation": "Answer (B). P(A ∩ B) ≥ P(A) + P(B) − 1 = 0.7 (Bonferroni). Why the others are wrong: (A) 0.72 = 0.9 × 0.8 is the value if the events are independent; it is not a guaranteed lower bound. (C) This is the maximum possible, not the minimum. (D) Much weaker than necessary and not tight."
    },
    {
      "question": "P(A) = P(B) = P(C) = 0.5, every pairwise intersection has probability 0.2, and P(A ∩ B ∩ C) = 0.1. Then P(A ∪ B ∪ C) =",
      "options": [
        "0.9",
        "1.1",
        "1.0",
        "0.7"
      ],
      "answer": 2,
      "explanation": "Answer (C). 1.5 − 3(0.2) + 0.1 = 1.0. Why the others are wrong: (A) Omits the triple-intersection term (1.5 − 0.6 = 0.9). (B) Exceeds 1; arises from subtracting too little (1.5 − 0.5 + 0.1); not a probability. (D) Over-subtracts; plugging into inclusion–exclusion gives 1.0."
    },
    {
      "question": "Same data: P(A) = P(B) = P(C) = 0.5, pairwise intersections 0.2, triple 0.1. The probability that exactly one of the three events occurs is",
      "options": [
        "0.6",
        "0.3",
        "0.9",
        "1.0"
      ],
      "answer": 0,
      "explanation": "Answer (A). ΣP(Aᵢ) − 2ΣP(AᵢAⱼ) + 3P(A₁A₂A₃) = 1.5 − 1.2 + 0.3 = 0.6. Why the others are wrong: (B) This is P(exactly two) = 0.6 − 0.3 = 0.3. (C) This is P(one or two occur) = P(union) − P(all three). (D) This is P(at least one), which also includes two or three occurring."
    },
    {
      "question": "Four events each have probability 0.95. What is the largest lower bound for P(all four occur) that is guaranteed with no assumption on dependence?",
      "options": [
        "0.8145",
        "0.8",
        "0.95",
        "0.2"
      ],
      "answer": 1,
      "explanation": "Answer (B). Bonferroni: P(⋂Aᵢ) ≥ 1 − ΣP(Aᶜᵢ) = 1 − 4(0.05) = 0.8. Why the others are wrong: (A) 0.95⁴ ≈ 0.8145 holds only if the events are independent; with dependence the probability can be as low as 0.8. (C) This is an upper bound (P(⋂) ≤ minP(Aᵢ)), not a lower bound. (D) This is the union-bound upper limit on the probability that some event fails (4 × 0.05), not a bound on all four occurring."
    },
    {
      "question": "P(A) = 0.5, P(B) = 0.6, P(A ∪ B) = 0.8. The probability that exactly one of A, B occurs is",
      "options": [
        "0.3",
        "0.8",
        "0.2",
        "0.5"
      ],
      "answer": 3,
      "explanation": "Answer (D). P(A ∩ B) = 0.5 + 0.6 − 0.8 = 0.3, and P(A △ B) = P(A ∪ B) − P(A ∩ B) = 0.5. Why the others are wrong: (A) This is P(A ∩ B). (B) This is P(A ∪ B), which includes “both”. (C) This is P(A \\ B), only one of the two “exactly one” cases."
    },
    {
      "question": "Which of the following is a sufficient and necessary condition for equality in the union bound P(⋃ᵢ Aᵢ) = Σᵢ P(Aᵢ) (for finitely many events)?",
      "options": [
        "The events are independent",
        "The events are all equal",
        "The pairwise intersections have probability 0 (the events are disjoint up to null sets)",
        "The events are exhaustive"
      ],
      "answer": 2,
      "explanation": "Answer (C). The union bound is tight iff the overlaps are null, i.e. events are pairwise disjoint almost surely. Why the others are wrong: (A) Independent events of positive probability overlap, so there is a strict inequality. (B) Equal events with positive probability give P(⋃Aᵢ) = P(A₁) < ΣP(Aᵢ). (D) Exhaustiveness says nothing about overlaps."
    },
    {
      "question": "Five events each have probability 0.2 and each of the ten pairs has intersection probability 0.02. Bonferroni’s second inequality gives the guaranteed lower bound P(⋃ Aᵢ) ≥",
      "options": [
        "0.8",
        "1.0",
        "0.2",
        "0.9"
      ],
      "answer": 0,
      "explanation": "Answer (A). Σ P(Aᵢ) − Σᵢ<ⱼ P(Aᵢ ∩ Aⱼ) = 1.0 − 10(0.02) = 0.8. Why the others are wrong: (B) This is the union-bound upper limit 5 × 0.2. (C) Only the largest single probability; much weaker than the Bonferroni bound. (D) Has no derivation from the given data."
    },
    {
      "question": "P(A) = 0.8, P(B) = 0.7. The smallest possible value of P(A ∩ B) is",
      "options": [
        "0.56",
        "0.7",
        "0.1",
        "0.5"
      ],
      "answer": 3,
      "explanation": "Answer (D). P(A ∩ B) ≥ 0.8 + 0.7 − 1 = 0.5. Why the others are wrong: (A) The value if the events were independent; it is possible but not minimal. (B) This is the largest possible value (B ⊆ A). (C) Has no basis; the correct combination is 0.8 + 0.7 − 1."
    },
    {
      "question": "Three events satisfy P(A₁) + P(A₂) + P(A₃) = 2.3. The strongest statement guaranteed for P(A₁ ∩ A₂ ∩ A₃) is",
      "options": [
        "P(A₁ ∩ A₂ ∩ A₃) ≥ 0.3",
        "P(A₁ ∩ A₂ ∩ A₃) ≥ 0.7",
        "P(A₁ ∩ A₂ ∩ A₃) ≥ 0.1",
        "P(A₁ ∩ A₂ ∩ A₃) = 0.3"
      ],
      "answer": 0,
      "explanation": "Answer (A). Bonferroni: P(⋂) ≥ 1 − ΣP(Aᶜᵢ) = 1 − (3 − 2.3) = 0.3, and this is attainable (when the complements are disjoint). Why the others are wrong: (B) Not guaranteed: if the complements are disjoint the intersection can be exactly 0.3. (C) True but weaker than 0.3; the question asks for the strongest guaranteed bound. (D) The intersection is not determined by the sum alone; it ranges up to minP(Aᵢ)."
    },
    {
      "question": "P(A) = 0.5, P(B) = 0.4, P(A ∩ B) = 0.1. The probability that neither occurs is",
      "options": [
        "0.3",
        "0.1",
        "0.2",
        "0.5"
      ],
      "answer": 2,
      "explanation": "Answer (C). P(A ∪ B) = 0.8, so P(neither) = 0.2. Why the others are wrong: (A) 0.5 × 0.6 presumes independence, but independence would give P(A ∩ B) = 0.2 ≠ 0.1. (B) This is P(A ∩ B). (D) This is P(A) and has no connection to “neither”."
    },
    {
      "question": "P(A) = 0.4 and P(B) = 0.3. Which value is impossible for P(A ∪ B)?",
      "options": [
        "0.4",
        "0.55",
        "0.7",
        "0.75"
      ],
      "answer": 3,
      "explanation": "Answer (D). P(A ∪ B) ∈ [max(0.4,0.3), 0.4 + 0.3] = [0.4,0.7], so 0.75 is impossible. Why the others are wrong: (A) Attained when B ⊆ A. (B) Attained for suitable partial overlap. (C) Attained when A,B are disjoint."
    },
    {
      "question": "Which of these statements hold for all events A, B? (I) P(A∩B) ≥ P(A)+P(B)−1. (II) P(A∪B) ≥ max(P(A), P(B)). (III) P(A △ B) ≥ |P(A) − P(B)|. (IV) P(A ∩ B) ≤ P(A)P(B).",
      "options": [
        "I only",
        "I and II only",
        "I, II and III only",
        "all four"
      ],
      "answer": 2,
      "explanation": "Answer (C). (I) is Bonferroni; (II) is monotonicity; (III) holds because P(A)−P(B) = P(A\\B)−P(B \\A). (IV) fails for A = B with P(A) = 1/2: 1/2 > 1/4. Why the others are wrong: (A) (II) and (III) are also true. (B) (III) is also true (Problem on the metric P(A △ B)). (D) (IV) is false in general; it is true only for negatively dependent events."
    }
  ],
  "equally-likely": [
    {
      "question": "A fair die is rolled. P(the number is prime) =",
      "options": [
        "1/2",
        "1/3",
        "2/3",
        "5/6"
      ],
      "answer": 0,
      "explanation": "Answer (A). Primes on a die: 2,3,5, so 3/6 = 1/2. Why the others are wrong: (B) Counts only two primes. (C) Counts 1 as prime (1,2,3,5); 1 is not prime. (D) Counts 5 of the six faces, e.g. including 4; it is not prime."
    },
    {
      "question": "Two fair coins are tossed. P(at least one head) =",
      "options": [
        "1/2",
        "2/3",
        "3/4",
        "1/4"
      ],
      "answer": 2,
      "explanation": "Answer (C). Ω = {HH,HT,TH,TT} (four equally likely); only TT has no head: 1 − 1/4 = 3/4. Why the others are wrong: (A) Looks only at one coin. (B) Uses the three “outcomes” {0,1,2 heads} as if equally likely (d’Alembert’s error). (D) This is the probability of two heads (or of no head)."
    },
    {
      "question": "Two fair dice are rolled. P(sum = 8) =",
      "options": [
        "1/11",
        "1/6",
        "1/12",
        "5/36"
      ],
      "answer": 3,
      "explanation": "Answer (D). Ordered pairs with sum 8: (2,6),(3,5),(4,4),(5,3),(6,2), so 5/36. Why the others are wrong: (A) Treats the 11 possible sums as equally likely; they are not. (B) This is P(sum = 7) = 6/36. (C) 3/36 would be this value; it is the count for sum 4 or 10."
    },
    {
      "question": "Two fair dice are rolled. P(doubles) =",
      "options": [
        "1/36",
        "1/6",
        "1/12",
        "1/3"
      ],
      "answer": 1,
      "explanation": "Answer (B). Doubles: (1,1),...,(6,6), six outcomes out of 36: 1/6. Why the others are wrong: (A) This is the probability of one specific double such as (6,6). (C) That would be only three doubles. (D) Overcounts: only 6 of 36 outcomes are doubles."
    },
    {
      "question": "A card is drawn from a standard deck. P(heart or ace) =",
      "options": [
        "4/13",
        "17/52",
        "1/52",
        "3/13"
      ],
      "answer": 0,
      "explanation": "Answer (A). 13 hearts +4 aces −1 (ace of hearts counted twice) = 16; 16/52 = 4/13. Why the others are wrong: (B) 13 + 4 = 17 double-counts the ace of hearts. (C) This is P(ace of hearts), i.e. “heart and ace”. (D) 12/52 is P(heart that is not an ace) (or P(ace or heart) − 4/52)."
    },
    {
      "question": "A number is chosen uniformly from {1, 2, . . . , 20}. P(divisible by 3) =",
      "options": [
        "1/3",
        "7/20",
        "6/19",
        "3/10"
      ],
      "answer": 3,
      "explanation": "Answer (D). Multiples of 3 up to 20: 3,6,9,12,15,18, six of them: 6/20 = 3/10. Why the others are wrong: (A) 1/3 is the long-run density; for the finite set {1,...,20} the count is exact: 6 of 20. (B) Counts 7 multiples, as if 21 were included. (C) Uses the wrong denominator 19."
    },
    {
      "question": "Two people are born on days chosen uniformly from 365 days. P(same birthday) =",
      "options": [
        "2/365",
        "1/730",
        "1/365²",
        "1/365"
      ],
      "answer": 3,
      "explanation": "Answer (D). Fix the first birthday; the second must match it: 1/365. Why the others are wrong: (A) Adds a second “chance”; there is only one way for the second person to match. (B) Halves incorrectly; no symmetry argument supports it. (C) This is the probability that both are born on one specific date."
    },
    {
      "question": "A number is chosen uniformly from {1, 2, . . . , 100}. P(perfect square) =",
      "options": [
        "1/10",
        "1/9",
        "1/100",
        "1/20"
      ],
      "answer": 0,
      "explanation": "Answer (A). Squares: 1,4,9,...,100, ten numbers; 10/100 = 1/10. Why the others are wrong: (B) Wrong denominator 9 (counts values 1..9 only). (C) Counts a single square. (D) Counts five squares only."
    },
    {
      "question": "A card is drawn from a standard deck. P(face card: J, Q or K) =",
      "options": [
        "1/13",
        "3/13",
        "4/13",
        "1/4"
      ],
      "answer": 1,
      "explanation": "Answer (B). 3 ranks ×4 suits = 12 cards: 12/52 = 3/13. Why the others are wrong: (A) Counts only one rank. (C) Counts four ranks (e.g. includes the ace or the ten). (D) This is the probability of a particular suit."
    },
    {
      "question": "A card is drawn from a standard deck. P(not a king) =",
      "options": [
        "1/13",
        "11/13",
        "3/4",
        "12/13"
      ],
      "answer": 3,
      "explanation": "Answer (D). Complement of “king” (4/52 = 1/13): 1 − 1/13 = 12/13. Why the others are wrong: (A) This is P(king). (B) Subtracts 2/13; there are 4 kings, not 8. (C) Treats the four suits as the relevant categories; unrelated to kings."
    },
    {
      "question": "Two fair dice are rolled. P(sum ≤ 4) =",
      "options": [
        "1/6",
        "1/12",
        "1/9",
        "1/4"
      ],
      "answer": 0,
      "explanation": "Answer (A). Outcomes with sum 2,3,4: 1 + 2 + 3 = 6 out of 36, so 1/6. Why the others are wrong: (B) Counts only the 3 outcomes with sum exactly 4. (C) Counts 4 outcomes; omits some pairs such as (2,1),(1,2) or (1,3),(2,2),(3,1). (D) Counts 9 outcomes, too many."
    },
    {
      "question": "Two fair dice are rolled. P(the sum is even) =",
      "options": [
        "6/11",
        "1/3",
        "1/2",
        "5/12"
      ],
      "answer": 2,
      "explanation": "Answer (C). The sum is even iff both dice have the same parity: 1/2 · 1/2 + 1/2 · 1/2 = 1/2 (or 18 of 36 pairs). Why the others are wrong: (A) Counts the even sums 2,4,...,12 as 6 of 11 equally likely values; they are not equally likely. (B) No parity argument supports 1/3. (D) Counts 15 even-sum pairs; the correct count is 18."
    },
    {
      "question": "Two fair dice are rolled. P(the product is odd) =",
      "options": [
        "1/2",
        "1/4",
        "3/4",
        "1/3"
      ],
      "answer": 1,
      "explanation": "Answer (B). The product is odd iff both numbers are odd: 3 · 3 = 9 of 36 pairs, 1/4. Why the others are wrong: (A) This is the probability that the sum is even, or that one particular die is odd. (C) This is P(product even). (D) No count gives 12 favourable pairs."
    },
    {
      "question": "Two fair dice are rolled. P(both show a number greater than 4) =",
      "options": [
        "1/3",
        "2/3",
        "1/6",
        "1/9"
      ],
      "answer": 3,
      "explanation": "Answer (D). Each die shows 5 or 6 (2 of 6 values): 2 · 2 = 4 of 36, so 1/9. Why the others are wrong: (A) This is the probability for one die. (B) This is P(one die ≤ 4). (C) Would be 6 favourable pairs, e.g. the probability of “doubles”."
    },
    {
      "question": "Two fair dice are rolled. P(at least one six) =",
      "options": [
        "11/36",
        "1/3",
        "25/36",
        "1/36"
      ],
      "answer": 0,
      "explanation": "Answer (A). Complement: no six has 25 outcomes; 1 − 25/36 = 11/36. Why the others are wrong: (B) 1/6 + 1/6 double-counts (6,6). (C) This is P(no six). (D) This is P(both sixes)."
    },
    {
      "question": "A fair coin is tossed three times. P(exactly one head) =",
      "options": [
        "1/4",
        "1/8",
        "3/8",
        "1/2"
      ],
      "answer": 2,
      "explanation": "Answer (C). HTT,THT,TTH: three of eight sequences. Why the others are wrong: (A) Treats the number of heads (0,1,2,3) as four equally likely outcomes. (B) This is the probability of one specific sequence such as HTT. (D) Confuses with P(first toss is head)."
    },
    {
      "question": "A fair coin is tossed three times. P(the sequence is exactly HHT) =",
      "options": [
        "3/8",
        "1/8",
        "1/3",
        "1/2"
      ],
      "answer": 1,
      "explanation": "Answer (B). Eight equally likely sequences, one of which is HHT. Why the others are wrong: (A) This would be “two heads and a tail in any order”. (C) Treats the three positions of the tail as the only sample space. (D) Ignores the specific order and number of tosses."
    },
    {
      "question": "Two fair dice are rolled. P(the second die shows a larger number than the first) =",
      "options": [
        "1/2",
        "1/3",
        "1/6",
        "5/12"
      ],
      "answer": 3,
      "explanation": "Answer (D). Ties have probability 1/6; by symmetry the remaining 5/6 splits evenly: 5/12 (or count 15 of 36 pairs). Why the others are wrong: (A) Ignores the possibility of ties. (B) No count gives 12 pairs. (C) This is the probability of a tie."
    },
    {
      "question": "A day of the week is chosen uniformly at random. P(weekend) =",
      "options": [
        "1/7",
        "1/4",
        "2/7",
        "5/7"
      ],
      "answer": 2,
      "explanation": "Answer (C). Two of seven days (Saturday, Sunday). Why the others are wrong: (A) One day only. (B) Treats “weekend or not” as 2 of 8; there are only 7 days. (D) This is P(weekday)."
    },
    {
      "question": "A calendar month is chosen uniformly at random. P(its name starts with J) =",
      "options": [
        "1/12",
        "1/4",
        "1/3",
        "1/6"
      ],
      "answer": 1,
      "explanation": "Answer (B). January, June, July: 3/12 = 1/4. Why the others are wrong: (A) Counts a single month. (C) Counts four months. (D) Counts two months (misses one of January/June/July)."
    },
    {
      "question": "A letter of the English alphabet is chosen uniformly at random. P(vowel a, e, i, o, u) =",
      "options": [
        "5/26",
        "6/26",
        "1/5",
        "5/21"
      ],
      "answer": 0,
      "explanation": "Answer (A). 5 vowels among 26 letters. Why the others are wrong: (B) Counts y as a vowel; the problem lists only a,e,i,o,u. (C) Divides by the number of vowels instead of letters. (D) Divides by the number of consonants (21)."
    },
    {
      "question": "A two-digit number 10 ≤ N ≤ 99 is chosen uniformly at random. P(N divisible by 5) =",
      "options": [
        "19/90",
        "1/9",
        "1/10",
        "1/5"
      ],
      "answer": 3,
      "explanation": "Answer (D). Multiples of 5 from 10 to 95: 10,15,...,95, i.e. 18; 18/90 = 1/5. Why the others are wrong: (A) Counts 100 as well; it is not a two-digit number. (B) 10 favourable numbers out of 90; undercounts. (C) Only counts multiples of 10."
    },
    {
      "question": "A two-digit number 10 ≤ N ≤ 99 is chosen uniformly at random. P(N divisible by 5 or 7) =",
      "options": [
        "31/90",
        "1/3",
        "29/90",
        "7/18"
      ],
      "answer": 2,
      "explanation": "Answer (C). Multiples of 5: 18; multiples of 7 (14,...,98): 13; both (35,70): 2. Inclusion–exclusion: 18 + 13 − 2 = 29. Why the others are wrong: (A) 18 + 13 = 31 double-counts 35 and 70. (B) 30/90 would need 30 numbers; the count is 29. (D) 35/90 has no derivation here."
    },
    {
      "question": "Two fair dice are rolled. P(sum ≤ 3) =",
      "options": [
        "1/6",
        "1/12",
        "1/36",
        "1/4"
      ],
      "answer": 1,
      "explanation": "Answer (B). Sum 2: 1 outcome; sum 3: 2 outcomes; total 3 of 36, i.e. 1/12. Why the others are wrong: (A) Counts 6 outcomes (this is P(sum ≤ 4)). (C) Counts only (1,1). (D) Counts 9 outcomes, far too many."
    },
    {
      "question": "Two fair dice are rolled. P(sum is 2 or 12) =",
      "options": [
        "1/18",
        "1/36",
        "1/6",
        "2/11"
      ],
      "answer": 0,
      "explanation": "Answer (A). (1,1) and (6,6) are disjoint, so 1/36 + 1/36 = 1/18. Why the others are wrong: (B) Counts only one of the two outcomes. (C) No count of 6 outcomes applies; these are the extreme sums. (D) Treats the 11 possible sums as equally likely."
    },
    {
      "question": "A fair coin is tossed three times. P(at most two heads) =",
      "options": [
        "3/4",
        "1/2",
        "5/8",
        "7/8"
      ],
      "answer": 3,
      "explanation": "Answer (D). Complement of “three heads”: 1 − 1/8 = 7/8. Why the others are wrong: (A) Treats the four values 0,1,2,3 of the head count as equally likely (so 3/4). (B) Looks at “at most one head” (4/8), which is a different event. (C) Has no derivation; it would correspond to 5 of the 8 outcomes, but 7 outcomes qualify."
    },
    {
      "question": "A fair coin is tossed four times. P(all heads or all tails) =",
      "options": [
        "1/16",
        "1/4",
        "1/8",
        "1/2"
      ],
      "answer": 2,
      "explanation": "Answer (C). HHHH and TTTT are disjoint, each with probability 1/16: total 1/8. Why the others are wrong: (A) Counts only one of the two sequences. (B) Would require 4 favourable sequences. (D) No such count; far too large."
    },
    {
      "question": "A card is drawn from a standard deck. P(spade or club) =",
      "options": [
        "1/2",
        "1/4",
        "3/4",
        "1/13"
      ],
      "answer": 0,
      "explanation": "Answer (A). The suits are disjoint: 1/4 + 1/4 = 1/2. Why the others are wrong: (B) Counts only one suit. (C) Counts three suits. (D) This is the probability of a particular rank."
    },
    {
      "question": "Two fair dice are rolled. P(the sum is 7 or 11) =",
      "options": [
        "3",
        "5",
        "6",
        "4"
      ],
      "answer": 1,
      "explanation": "Answer (B). Sum 7: 6 outcomes; sum 11: 2 outcomes; disjoint events: 8/36 = 2/9. Why the others are wrong: (A) n = 3 gives only 0.421. (B) n = 5 works but is not the smallest. (C) The expected number of sixes in 6 rolls is 1, but the probability of at least one is 0.665; the threshold is reached earlier. (D) Counts 15 pairs; too many. M50. Answer: (D). 1 − (5/6)³ ≈ 0.421 but 1 − (5/6)⁴ ≈ 0.518 > 1/2."
    },
    {
      "question": "Three fair dice are rolled. P(sum = 10) =",
      "options": [
        "1/36",
        "25/216",
        "1/8",
        "1/6"
      ],
      "answer": 2,
      "explanation": "Answer (C). There are 27 ordered triples with sum 10 (six unordered patterns weighted by their number of orderings): 27/216 = 1/8. Why the others are wrong: (A) This is 6/216: counts only the six unordered decompositions. (B) This is P(sum = 9). (D) Has no derivation; 36 favourable triples is too many."
    },
    {
      "question": "Three fair dice are rolled. P(the maximum is exactly 4) =",
      "options": [
        "1/6",
        "8/27",
        "37/216",
        "1/72"
      ],
      "answer": 2,
      "explanation": "Answer (C). P(max ≤ 4) − P(max ≤ 3) = (64−27)/(216) = 37/216. Why the others are wrong: (A) Assumes the maximum is uniform on {1,...,6}; it is not. (B) This is P(max ≤ 4) = 64/216, which includes smaller maxima. (D) 3/216 counts only the outcomes with exactly one 4 and two lower values in a fixed pattern; it omits most cases."
    },
    {
      "question": "Two fair dice are rolled. P(the smaller number is at least 3) =",
      "options": [
        "1/3",
        "4/9",
        "2/3",
        "5/9"
      ],
      "answer": 1,
      "explanation": "Answer (B). Both dice must show ≥ 3: 4 · 4 = 16 of 36, so 4/9. Why the others are wrong: (A) Has no derivation; “at least 3” for one die has probability 2/3. (C) This is the probability for one die to be at least 3. (D) This is the complement of 4/9."
    },
    {
      "question": "Three dice give a, b, c for ax² + bx + c = 0. P(real roots) =",
      "options": [
        "1/6",
        "1/4",
        "5/216",
        "43/216"
      ],
      "answer": 3,
      "explanation": "Answer (D). Count pairs (a,c) with ac ≤ b²/4 for b = 1,...,6: 0 + 1 + 3 + 8 + 14 + 17 = 43 of 216. Why the others are wrong: (A) Has no derivation. (B) Would be 54 favourable triples, too many. (C) This is the probability of equal roots (b² = 4ac)."
    },
    {
      "question": "Two fair dice are rolled. P(the sum is prime) =",
      "options": [
        "5/11",
        "5/12",
        "1/2",
        "7/18"
      ],
      "answer": 1,
      "explanation": "Answer (B). Prime sums 2,3,5,7,11 occur 1 + 2 + 4 + 6 + 2 = 15 times: 15/36 = 5/12. Why the others are wrong: (A) Treats the 11 sums as equally likely (5 prime out of 11). (C) Overcounts; it would need 18 favourable pairs. (D) 14/36 misses one of the 15 favourable pairs (e.g. forgets (1,1))."
    },
    {
      "question": "Two fair dice are rolled. P(the numbers differ by exactly 2) =",
      "options": [
        "2/9",
        "1/9",
        "1/6",
        "5/18"
      ],
      "answer": 0,
      "explanation": "Answer (A). Ordered pairs: (1,3),(2,4),(3,5),(4,6) and their reverses: 8 of 36: 2/9. Why the others are wrong: (B) Counts only the 4 unordered pairs and divides by 36 ordered outcomes. (C) This is the probability of a tie (difference 0). (D) This is the probability of a difference of exactly 1 (10 pairs)."
    },
    {
      "question": "Two fair dice are rolled. P(sum ≥ product) =",
      "options": [
        "1/3",
        "1/4",
        "11/36",
        "5/12"
      ],
      "answer": 0,
      "explanation": "Answer (A). a + b ≥ ab ⇔ (a − 1)(b − 1) ≤ 1: pairs with a = 1 (6), b = 1 (6, but (1,1) counted twice), and (2,2): 6 + 6 − 1 + 1 = 12; 12/36 = 1/3. Why the others are wrong: (B) Counts 9 pairs. (C) Misses (2,2), which satisfies 4 ≥ 4. (D) Counts 15 pairs; too many."
    }
  ],
  "probability-counting": [
    {
      "question": "A fair coin is tossed three times. P(exactly two heads) =",
      "options": [
        "1/4",
        "1/2",
        "3/8",
        "5/8"
      ],
      "answer": 2,
      "explanation": "Answer (C). Of 8 equally likely sequences, HHT,HTH,THH have exactly two heads: 3/8. Why the others are wrong: (A) Treats 0,1,2,3 heads as equally likely. (B) Confuses with P(at least two heads) = 4/8. (D) This is P(not exactly two)."
    },
    {
      "question": "A fair die is rolled three times. P(at least one six) =",
      "options": [
        "1/2",
        "125/216",
        "1/216",
        "91/216"
      ],
      "answer": 3,
      "explanation": "Answer (D). Complement trick: no six in three rolls has 5³ = 125 of 216 outcomes, so 1 − 125/216 = 91/216. Why the others are wrong: (A) 3 · 1/6 = 1/2 adds overlapping events (several sixes) without correcting. (B) This is P(no six). (C) This is P(three sixes)."
    },
    {
      "question": "A fair die is rolled four times. The probability of at least one six is",
      "options": [
        "4/6",
        "1 − (5/6)⁴",
        "(1/6)⁴",
        "1 − (1/6)⁴"
      ],
      "answer": 1,
      "explanation": "Answer (B). Complement: no six has probability (5/6)⁴. Why the others are wrong: (A) Adds four probabilities of 1/6; overlaps are double-counted, and the formula would exceed 1 for 7 rolls. (C) This is P(four sixes). (D) This is P(not four sixes), not “at least one six”."
    },
    {
      "question": "A fair coin is tossed 5 times. P(at least one head) =",
      "options": [
        "1/32",
        "5/32",
        "1/2",
        "31/32"
      ],
      "answer": 3,
      "explanation": "Answer (D). Only TTTTT has no head: 1 − 1/32 = 31/32. Why the others are wrong: (A) This is the probability of no head. (B) This is P(exactly one head) = (5/1)/32, not “at least one”. (C) Looks at one toss only."
    },
    {
      "question": "Three fair dice are rolled. P(at least two show the same number) =",
      "options": [
        "1/2",
        "5/9",
        "4/9",
        "1/6"
      ],
      "answer": 2,
      "explanation": "Answer (C). Complement: all different, 120/216 = 5/9; so the answer is 1 − 5/9 = 4/9. Why the others are wrong: (A) No count gives 108 favourable outcomes. (B) This is P(all different). (D) This is the probability that two specific dice agree, which is smaller than the event “some two of the three agree”."
    },
    {
      "question": "Players A and B play fair independent games; A needs 1 more win and B needs 2. P(A wins the match) =",
      "options": [
        "3/4",
        "1/2",
        "2/3",
        "1/3"
      ],
      "answer": 0,
      "explanation": "Answer (A). Imagine two more games are played. B wins the match only if B wins both: probability 1/4. So A wins with probability 3/4. Why the others are wrong: (B) Ignores that A needs fewer wins; the players are not symmetric. (C) Splits in proportion 2 : 1 (needs); the correct method counts equally likely game sequences. (D) This would be the answer if A and B were reversed."
    },
    {
      "question": "A fair die is rolled n times. What is the smallest n for which P(at least one six) > 1/2 ?",
      "options": [
        "3",
        "5",
        "6",
        "4"
      ],
      "answer": 3,
      "explanation": "Answer (D). 1 − (5/6)³ ≈ 0.421 but 1 − (5/6)⁴ ≈ 0.518 > 1/2. Why the others are wrong: (A) n = 3 gives only 0.421. (B) n = 5 works but is not the smallest. (C) The expected number of sixes in 6 rolls is 1, but the probability of at least one is 0.665; the threshold is reached earlier."
    }
  ],
  "de-morgan": [
    {
      "question": "The complement of A ∪ B is",
      "options": [
        "Aᶜ ∪ Bᶜ",
        "Aᶜ ∩ B",
        "Aᶜ ∩ Bᶜ",
        "A ∩ B"
      ],
      "answer": 2,
      "explanation": "Answer (C). De Morgan: (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ (“neither A nor B”). Why the others are wrong: (A) Aᶜ ∪ Bᶜ = (A ∩ B)ᶜ; this is the complement of the intersection, not the union. (B) Describes “B occurs and A does not”; it is not the complement of the union. (D) A ∩ B is a subset of A ∪ B, so it cannot be its complement."
    },
    {
      "question": "(A ∩ B)ᶜ equals",
      "options": [
        "Aᶜ ∩ Bᶜ",
        "Aᶜ ∪ Bᶜ",
        "A ∪ B",
        "Aᶜ ∩ B"
      ],
      "answer": 1,
      "explanation": "Answer (B). De Morgan: “not both” is “at least one fails”. Why the others are wrong: (A) Aᶜ ∩ Bᶜ = (A ∪ B)ᶜ is “neither”; it is the complement of the union. (C) A ∪ B is not related; e.g. if A = B = Ω then (A ∩ B)ᶜ = ∅ but A ∪ B = Ω. (D) Only one of the ways “not both” can happen."
    }
  ],
  "continuity": [
    {
      "question": "U is uniform on [0, 1] and Aₙ = {U ≤ 1 − 1/n } (n ≥ 2). Then limₙ P(Aₙ) =",
      "options": [
        "0",
        "1",
        "1/2",
        "does not exist"
      ],
      "answer": 1,
      "explanation": "Answer (B). P(Aₙ) = 1 − 1/n ↑ 1; also Aₙ ↑ {U < 1} whose probability is 1 (continuity). Why the others are wrong: (A) The probabilities increase from 1/2; they do not decrease to 0. (C) This is only the first value, at n = 2. (D) The sequence is increasing and bounded, so it converges."
    },
    {
      "question": "Events B₁ ⊇ B₂ ⊇ · · · satisfy ⋂ₙ Bₙ = ∅. Then P(Bₙ) →",
      "options": [
        "0",
        "1",
        "1/2",
        "cannot be determined"
      ],
      "answer": 0,
      "explanation": "Answer (A). Continuity from above: P(Bₙ) ↓ P(⋂Bₙ) = P(∅) = 0. Why the others are wrong: (B) A decreasing sequence cannot tend to 1 unless the intersection has probability 1. (C) No such general value exists. (D) It can be determined; continuity of probability applies to every decreasing sequence."
    },
    {
      "question": "Events A₁ ⊆ A₂ ⊆ ⋯ satisfy P(Aₙ) = 1 − 1/(n+1)². Then P(⋃ₙ Aₙ) =",
      "options": [
        "1/2",
        "0",
        "depends on the Aₙ",
        "1"
      ],
      "answer": 3,
      "explanation": "Answer (D). Continuity from below: P(⋃Aₙ) = limP(Aₙ) = 1. Why the others are wrong: (A) Has no basis: the probabilities already start at 3/4 and increase. (B) Probabilities increase to 1, not decrease to 0. (C) For increasing events continuity fixes the answer regardless of the details."
    },
    {
      "question": "B₁ ⊇ B₂ ⊇ ⋯ with P(Bₙ) = 1/2 + 1/n. Then P(⋂ₙ Bₙ) =",
      "options": [
        "1/2",
        "0",
        "1",
        "it cannot be determined"
      ],
      "answer": 0,
      "explanation": "Answer (A). Continuity from above: P(⋂Bₙ) = limP(Bₙ) = 1/2. Why the others are wrong: (B) The probabilities do not decrease to 0. (C) The probabilities are decreasing, not approaching 1. (D) Continuity of probability determines the answer for every decreasing sequence."
    },
    {
      "question": "U is uniform on [0, 1]. Which statement is correct?",
      "options": [
        "P(U ∈ Q) = 0, so Q ∩ [0, 1] is empty",
        "P(U ∈ Q) = 0 even though Q ∩ [0, 1] is infinite",
        "P(U = x) = 0 for every x, so by additivity P(U ∈ [0, 1]) = 0",
        "P(U ∈ Q) = 1 because Q is dense"
      ],
      "answer": 1,
      "explanation": "Answer (B). Q ∩ [0,1] is a countable union of null points, hence null by countable additivity. Why the others are wrong: (A) Probability 0 does not make a set empty. (C) Additivity is only countable; [0,1] is an uncountable union of points, so this deduction is invalid. (D) Density is a topological property; it does not give probability 1. The irrationals have probability 1."
    }
  ],
  "geometric-probability": [
    {
      "question": "U is uniform on [0, 1]. P(U = 0.3) =",
      "options": [
        "0",
        "0.3",
        "1/2",
        "undefined"
      ],
      "answer": 0,
      "explanation": "Answer (A). Single points have length 0, hence probability 0 under the uniform law. Why the others are wrong: (B) 0.3 is P(U ≤ 0.3), not the probability of the single value 0.3. (C) No reason for 1/2. (D) It is perfectly well defined and equals 0."
    },
    {
      "question": "U is uniform on [0, 1]. P(0.2 < U < 0.7) =",
      "options": [
        "0.7",
        "0.2",
        "0.9",
        "0.5"
      ],
      "answer": 3,
      "explanation": "Answer (D). The probability is the length of the interval: 0.7 − 0.2 = 0.5. Why the others are wrong: (A) This is P(U < 0.7). (B) This is P(U < 0.2). (C) Adds the endpoints instead of subtracting."
    },
    {
      "question": "U is uniform on [0, 1]. P(U is rational) =",
      "options": [
        "1",
        "0",
        "1/2",
        "cannot be determined"
      ],
      "answer": 1,
      "explanation": "Answer (B). The rationals are countable and each point has probability 0; countable additivity gives 0. Why the others are wrong: (A) Rationals are dense, but density does not give probability; irrationals have probability 1. (C) Rationals and irrationals are not “half and half”. (D) Countable additivity determines it exactly."
    },
    {
      "question": "(X, Y ) is uniform on the unit square. P(X < 1/2 and Y < 1/2 ) =",
      "options": [
        "1/2",
        "1/8",
        "1/4",
        "3/4"
      ],
      "answer": 2,
      "explanation": "Answer (C). The region is a square of side 1/2, with area 1/4. Why the others are wrong: (A) This is the probability of one condition only, e.g. X < 1/2. (B) Would need side 1/8; not matching the region. (D) This is P(X < 1/2 or Y < 1/2)."
    },
    {
      "question": "(X, Y ) is uniform on the unit square. P(X + Y < 1) =",
      "options": [
        "1/2",
        "1/4",
        "1",
        "3/4"
      ],
      "answer": 0,
      "explanation": "Answer (A). The region below the diagonal is a triangle with area 1/2. Why the others are wrong: (B) 1/4 is the area of the small square [0, 1/2]²; it is unrelated to this region. (C) Would require every point to lie below the diagonal. (D) The diagonal x + y = 1 splits the square into two equal triangles, so the region is exactly half, not three quarters."
    },
    {
      "question": "A dart lands uniformly on a disc of radius 2. P(it lands within distance 1 of the centre) =",
      "options": [
        "1/2",
        "1/8",
        "1/3",
        "1/4"
      ],
      "answer": 3,
      "explanation": "Answer (D). Probability is the ratio of areas: π·1²/(π·2²) = 1/4. Why the others are wrong: (A) Compares radii (1/2) instead of areas. (B) Cubing the ratio of radii is not meaningful in two dimensions. (C) No ratio of areas or lengths gives 1/3."
    },
    {
      "question": "A point is chosen uniformly in the unit square. P(it is within distance 1/4 of at least one side) =",
      "options": [
        "1/4",
        "3/4",
        "1/2",
        "7/16"
      ],
      "answer": 1,
      "explanation": "Answer (B). Complement: the point is farther than 1/4 from all sides, i.e. in the inner square [1/4, 3/4]² of area 1/4. So 1 − 1/4 = 3/4. Why the others are wrong: (A) This is the area of the inner square (the complement), not of the boundary strip. (C) Would correspond to a strip of width 1/2; the inner square has side 1/2, not area 1/2. (D) This is P(|X − Y| < 1/4) = 1 − (3/4)², a different event."
    },
    {
      "question": "X, Y are uniform on [0, 1]². P(X + Y > 1.5) =",
      "options": [
        "1/4",
        "1/2",
        "1/8",
        "3/8"
      ],
      "answer": 2,
      "explanation": "Answer (C). The region is a right triangle in the corner (1,1) with legs 1/2: area 1/2 · 1/2 · 1/2 = 1/8. Why the others are wrong: (A) This is the area of a square with side 1/2, not of the triangle cut off. (B) This is P(X + Y > 1). (D) No region of the square of this shape has area 3/8."
    },
    {
      "question": "A stick of length 1 is broken at a uniformly random point. P(the shorter piece is shorter than 1/4 ) =",
      "options": [
        "1/4",
        "1/3",
        "3/4",
        "1/2"
      ],
      "answer": 3,
      "explanation": "Answer (D). The break point U satisfies min(U,1 − U) < 1/4 iff U < 1/4 or U > 3/4: probability 1/4 + 1/4 = 1/2. Why the others are wrong: (A) Counts only one end of the stick. (B) No region has length 1/3 here. (C) Has no derivation; the complement (shorter piece ≥ 1/4) has probability 1/2, not 1/4."
    },
    {
      "question": "A stick is broken at two independent uniformly random points. The probability that the three pieces can form a triangle is",
      "options": [
        "1/2",
        "1/4",
        "1/3",
        "1/8"
      ],
      "answer": 1,
      "explanation": "Answer (B). A triangle forms iff every piece is shorter than 1/2. The complement is the union of three disjoint events each of probability 1/4 (some piece ≥ 1/2), so P = 1 − 3/4 = 1/4. Why the others are wrong: (A) Too large: three disjoint bad events of probability 1/4 each make the triangle fail with probability 3/4. (C) No derivation gives 1/3; the three bad events have total probability 3/4, leaving 1/4. (D) Too small; it would need the three bad events to cover 7/8."
    },
    {
      "question": "A chord of the unit circle is chosen so that its midpoint is uniform in the disc. P(chord longer than √3) =",
      "options": [
        "1/4",
        "1/3",
        "1/2",
        "1/6"
      ],
      "answer": 0,
      "explanation": "Answer (A). The chord is longer than 3 iff its midpoint is within distance 1/2 of the centre: area ratio (π/4)/π = 1/4. Why the others are wrong: (B) This is the answer for the “two random endpoints” model. (C) This is the answer for the “random distance along a radius” model. (D) No standard model gives 1/6."
    }
  ],
  "borel-cantelli": [
    {
      "question": "If Σₙ P(Aₙ) < ∞, the first Borel–Cantelli lemma says",
      "options": [
        "P(Aₙ i.o.) = 1",
        "P(Aₙ i.o.) = 0",
        "P(Aₙ) = 0 for every n",
        "P(Aₙ) → 1"
      ],
      "answer": 1,
      "explanation": "Answer (B). A summable series of probabilities forces only finitely many events to occur, almost surely. Why the others are wrong: (A) This is the opposite conclusion (requires divergence and independence). (C) P(Aₙ) → 0 is implied, but individual probabilities need not vanish. (D) Summability forces P(Aₙ) → 0, not 1."
    },
    {
      "question": "ω ∈ lim sup Aₙ means that",
      "options": [
        "ω ∈ Aₙ for every n",
        "ω ∈ Aₙ for all sufficiently large n",
        "ω ∈ Aₙ for at least one n",
        "ω ∈ Aₙ for infinitely many n"
      ],
      "answer": 3,
      "explanation": "Answer (D). lim sup Aₙ = ⋂ₙ ⋃ₖ≥ₙ Aₖ: for every n some later Aₖ contains ω, i.e. infinitely often. Why the others are wrong: (A) That describes ⋂ₙ Aₙ. (B) That describes lim inf Aₙ (“eventually always”). (C) That describes ⋃ₙ Aₙ (“at least once”)."
    },
    {
      "question": "ω ∈ lim inf Aₙ means that",
      "options": [
        "ω ∈ Aₙ for all sufficiently large n",
        "ω ∈ Aₙ for infinitely many n",
        "ω ∈ Aₙ for exactly one n",
        "ω ∈/ Aₙ for all n"
      ],
      "answer": 0,
      "explanation": "Answer (A). lim inf Aₙ = ⋃ₙ ⋂ₖ≥ₙ Aₖ: from some n on, ω stays in every Aₖ. Why the others are wrong: (B) That is limsup; infinitely often does not mean always from some point on. (C) ω in exactly one Aₙ is neither concept. (D) Describes the complement of ⋃ₙ Aₙ."
    },
    {
      "question": "Ω = [0, 1] with the uniform law and Aₙ = [0, 1/n ]. Then lim sup Aₙ =",
      "options": [
        "{0}",
        "[0, 1]",
        "∅",
        "(0, 1]"
      ],
      "answer": 0,
      "explanation": "Answer (A). A point x > 0 lies in Aₙ only for n ≤ 1/x (finitely many n); the point 0 lies in every Aₙ. So limsupAₙ = {0}. Why the others are wrong: (B) Only 0 is in infinitely many sets. (C) The point 0 is in all Aₙ, so it is in limsupAₙ. (D) Every positive x eventually leaves the sets, and 0 is in."
    },
    {
      "question": "Ω = [0, 1], Aₙ = [0, 1/2 ] for even n and [ 1/2 , 1] for odd n. Then lim inf Aₙ =",
      "options": [
        "[0, 1]",
        "∅",
        "{1/2}",
        "[0, 1/2]"
      ],
      "answer": 2,
      "explanation": "Answer (C). A point is in all large Aₙ iff it is in both [0, 1/2] and [1/2,1]: only 1/2. Why the others are wrong: (A) That is limsupAₙ (every point appears infinitely often). (B) The two sets overlap at 1/2, so the intersection is not empty. (D) Points of [0, 1/2) are missing from the odd-indexed sets infinitely often."
    },
    {
      "question": "With no independence assumption, for which of the following choices of P(Aₙ) does the first Borel–Cantelli lemma guarantee P(Aₙ i.o.) = 0?",
      "options": [
        "P(Aₙ) = 1/n",
        "P(Aₙ) = 1/n²",
        "P(Aₙ) = 1/√n",
        "P(Aₙ) = 1/(ln(n + 1))"
      ],
      "answer": 1,
      "explanation": "Answer (B). Σ 1/n² < ∞, so BC1 applies. Why the others are wrong: (A) The harmonic series diverges; BC1 gives no information (and in general the conclusion can fail or hold depending on dependence). (C) Σ n^(−1/2) = ∞; BC1 is silent. (D) 1/ln(n+1) ≥ 1/n, so the series diverges."
    },
    {
      "question": "Every Aₙ satisfies P(Aₙ) = 1/2 . Which statement must be true?",
      "options": [
        "P(lim sup Aₙ) ≥ 1/2",
        "P(lim sup Aₙ) = 1/2",
        "P(lim inf Aₙ) ≥ 1/2",
        "P(lim sup Aₙ) ≤ 1/2"
      ],
      "answer": 0,
      "explanation": "Answer (A). Fatou for events: P(limsupAₙ) ≥ limsupP(Aₙ) = 1/2. Why the others are wrong: (B) Equality can fail: for example, alternating Aₙ = [0, 1/2] and [1/2, 1] on [0,1] give P(lim sup Aₙ) = 1. (C) Reversed: P(liminf Aₙ) ≤ liminf P(Aₙ) = 1/2. (D) Reversed; limsupAₙ has probability at least 1/2."
    }
  ]
};
