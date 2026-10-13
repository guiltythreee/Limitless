import type { Lesson } from "./types";

// Rank 09 — Initiate: events, sample spaces, counting principles and the axioms.
export const rank09: Lesson[] = [
  {
    id: "sample-space", rank: 9, title: "Sample Spaces & Events", minutes: 10,
    description: "List what can happen before asking how likely it is.",
    objective: "Describe a random experiment with a sample space, and write an event as a subset of it.",
    body: [
      "Probability starts before any numbers appear. First you need a clear picture of what could happen. A random experiment is any process whose result you cannot predict for certain, even though you can list the possible results: tossing a coin, rolling a die, drawing a card, waiting for a bus.",
      "The sample space, written Ω, is the set of every possible outcome. Think of it as the full menu. An outcome is one single item on that menu, and exactly one outcome happens each time the experiment is run.",
      "An event is a yes-or-no question about the result, and we represent it by the set of outcomes that answer yes. “The die shows an even number” becomes {2, 4, 6}. So an event is just a subset of Ω, and we say the event happens when the actual outcome lies inside that subset.",
      "Two events are special. The whole space Ω is the sure event, because something in it must happen. The empty set ∅ is the impossible event. Two events are mutually exclusive when they share no outcomes, so they can never both happen on the same run.",
      "Choose outcomes at the finest level of detail you need. For two coin tosses, Ω = {HH, HT, TH, TT} has four outcomes, not three: “exactly one head” is an event made of two outcomes, HT and TH. Listing outcomes finely avoids many classic mistakes.",
    ],
    formulas: [
      { label: "An event is a subset", text: "A ⊆ Ω" },
      { label: "Mutually exclusive events", text: "A ∩ B = ∅" },
    ],
    examples: [
      {
        title: "Two dice",
        problem: "Roll one red die and one blue die. Describe Ω, then write the event “the sum is 5”.",
        steps: [
          "Record each outcome as a pair (red, blue). Each die has 6 faces, so Ω contains 6 × 6 = 36 pairs, from (1, 1) up to (6, 6).",
          "The sum is 5 for (1, 4), (2, 3), (3, 2) and (4, 1).",
          "So the event is {(1, 4), (2, 3), (3, 2), (4, 1)}, which has 4 outcomes. The pairs (1, 4) and (4, 1) are different outcomes because the dice are different colours.",
        ],
      },
      {
        title: "Waiting for a bus",
        problem: "A bus will arrive at some moment in the next 30 minutes. What is Ω, and what is the event “the wait is under 5 minutes”?",
        steps: [
          "Any real time between 0 and 30 is possible, so Ω is the whole interval [0, 30]. A sample space can be infinite.",
          "The event “under 5 minutes” is the sub-interval [0, 5).",
        ],
      },
    ],
    quiz: [
      {
        question: "A coin is tossed three times. How many outcomes are in the sample space?",
        options: ["3", "6", "8", "9"], answer: 2,
        explanation: "Each toss has 2 results and the tosses combine: 2 × 2 × 2 = 8, from HHH to TTT.",
      },
      {
        question: "One die is rolled. Which set is the event “the result is a prime number”?",
        options: ["{1, 2, 3, 5}", "{2, 3, 5}", "{3, 5, 7}", "{2, 4, 6}"], answer: 1,
        explanation: "1 is not prime, and 7 is not on the die. The primes among 1 to 6 are 2, 3 and 5.",
      },
      {
        question: "Two coins are tossed. The event “exactly one head” is…",
        options: ["a single outcome", "the set {HT, TH}", "the whole sample space", "an impossible event"], answer: 1,
        explanation: "One head can happen two ways: head first, or head second. So the event contains two outcomes.",
      },
    ],
  },

  {
    id: "counting", rank: 9, title: "The Multiplication Rule & Permutations", minutes: 12,
    description: "Count outcomes by building them one stage at a time.",
    objective: "Use the multiplication rule, factorials and ordered selections to count outcomes.",
    body: [
      "Many probability problems come down to one question: how many outcomes are there? The master tool is the multiplication rule. If a task happens in stages, stage 1 can go m ways, and for each of those stage 2 can go n ways, then the whole task can go m × n ways.",
      "Why does it work? Picture a table with m rows (the stage-1 choices) and n columns (the stage-2 choices). Every cell is one complete outcome, and a table with m rows of n cells has m × n cells. With more stages, just keep multiplying the number of options at each stage.",
      "One detail matters: the options at a later stage may depend on earlier choices, but their number must not. If you pick a president and then a different person as secretary, the second stage always has one fewer option, whoever was picked first.",
      "A permutation is an ordered arrangement. To line up n different objects there are n choices for the first spot, n − 1 for the second, and so on, giving n! = n × (n − 1) × … × 2 × 1 arrangements. By convention 0! = 1.",
      "If you fill only k spots out of n objects, in order, you get n × (n − 1) × … × (n − k + 1) = n! / (n − k)! ways. Choosing with replacement is different: if every one of the k picks can be any of the n things, you get nᵏ.",
    ],
    formulas: [
      { label: "Multiplication rule", text: "n₁ × n₂ × ··· × nᵣ" },
      { label: "Lining up n objects", text: "n! = n(n − 1)···2·1" },
      { label: "Ordered picks of k from n", text: "P(n, k) = n! / (n − k)!" },
      { label: "Picks with repetition allowed", text: "nᵏ" },
    ],
    examples: [
      {
        title: "Passcodes",
        problem: "A phone passcode has 4 digits, each from 0 to 9. How many passcodes are possible if digits may repeat? If no digit may repeat?",
        steps: [
          "Repeats allowed: 10 choices for each of the 4 places, so 10 × 10 × 10 × 10 = 10,000.",
          "No repeats: 10 choices, then 9, then 8, then 7, so 10 × 9 × 8 × 7 = 5,040.",
        ],
      },
      {
        title: "A race podium",
        problem: "Eight athletes run a race with no ties. How many different gold–silver–bronze outcomes are there?",
        steps: [
          "Gold can go to any of 8, then silver to any of the remaining 7, then bronze to any of the remaining 6.",
          "8 × 7 × 6 = 336. The same number is 8! / 5! = 40,320 / 120 = 336.",
        ],
      },
      {
        title: "Friends who must sit together",
        problem: "Five friends sit in a row. Asha and Ben insist on sitting next to each other. How many arrangements are there?",
        steps: [
          "Glue Asha and Ben into one block. Now there are 4 things to arrange: the block and the 3 other friends. That gives 4! = 24 orders.",
          "Inside the block, Asha and Ben can swap places: 2 ways.",
          "By the multiplication rule, 24 × 2 = 48 arrangements.",
        ],
      },
    ],
    quiz: [
      {
        question: "A restaurant offers 4 starters, 5 mains and 3 desserts. How many three-course meals (one of each) are possible?",
        options: ["12", "60", "47", "20"], answer: 1,
        explanation: "Three stages, so multiply: 4 × 5 × 3 = 60. Adding (4 + 5 + 3 = 12) would count single dishes, not whole meals.",
      },
      {
        question: "In how many ways can 6 different people stand in a queue?",
        options: ["36", "120", "720", "5,040"], answer: 2,
        explanation: "6! = 6 × 5 × 4 × 3 × 2 × 1 = 720.",
      },
      {
        question: "A 3-letter code uses letters A to Z with no letter repeated. How many codes are there?",
        options: ["17,576", "15,600", "2,600", "78"], answer: 1,
        explanation: "26 × 25 × 24 = 15,600. If repeats were allowed it would be 26³ = 17,576.",
      },
    ],
  },

  {
    id: "combinations", rank: 9, title: "Combinations & Binomial Coefficients", minutes: 14,
    description: "Count selections when the order does not matter.",
    objective: "Count unordered selections with “n choose k”, and use symmetry and Pascal’s rule.",
    body: [
      "Sometimes order does not matter. Choosing a cricket team of 11 from a squad of 15 cares about who is picked, not the order in which you called out the names. Such an unordered selection is called a combination.",
      "Here is the formula, built from the bottom up. First count the ordered picks of k from n: n! / (n − k)!. But every unordered group of k people has been counted once for each way to order it, which is k! times. So divide by k!.",
      "The result is called a binomial coefficient and is read “n choose k”. It counts the subsets of size k in a set of n elements.",
      "Two facts are worth remembering. Symmetry: choosing who is in the group is the same as choosing who is left out, so C(n, k) = C(n, n − k). Pascal’s rule: look at one particular person; the groups either contain them, C(n − 1, k − 1), or do not, C(n − 1, k), so C(n, k) is the sum of those two.",
      "The name “binomial” comes from the binomial theorem. When you expand (x + y)ⁿ, each term picks x from k of the n brackets and y from the rest, and there are C(n, k) ways to decide which k brackets give x. Putting x = y = 1 shows that a set of n elements has 2ⁿ subsets altogether.",
    ],
    formulas: [
      { label: "Combinations", text: "C(n, k) = n! / (k!(n − k)!)" },
      { label: "Symmetry", text: "C(n, k) = C(n, n − k)" },
      { label: "Pascal’s rule", text: "C(n, k) = C(n − 1, k − 1) + C(n − 1, k)" },
      { label: "Binomial theorem", text: "(x + y)ⁿ = Σ C(n, k) xᵏ yⁿ⁻ᵏ" },
    ],
    examples: [
      {
        title: "Choosing a squad",
        problem: "How many different teams of 11 can be chosen from a squad of 15, ignoring playing roles?",
        steps: [
          "The answer is C(15, 11). Using symmetry, that equals C(15, 4), which is easier.",
          "C(15, 4) = (15 × 14 × 13 × 12) / (4 × 3 × 2 × 1) = 32,760 / 24 = 1,365.",
        ],
      },
      {
        title: "A mixed committee",
        problem: "A club has 6 women and 5 men. A committee needs 2 women and 3 men. How many committees are possible? How many if two particular men refuse to serve together?",
        steps: [
          "Choose the women and the men separately, then multiply: C(6, 2) × C(5, 3) = 15 × 10 = 150.",
          "Now remove the bad groups of men. Groups of 3 men that contain both feuding men: pick the third man from the other 3, so 3 groups. That leaves 10 − 3 = 7 allowed groups of men.",
          "So there are 15 × 7 = 105 committees.",
        ],
      },
      {
        title: "A first taste of probability",
        problem: "Five cards are dealt from a well-shuffled 52-card deck. How many hands are possible, and what is the chance that all five are hearts?",
        steps: [
          "The order of cards in a hand does not matter, so there are C(52, 5) = 2,598,960 hands, all equally likely.",
          "The favourable hands pick 5 of the 13 hearts: C(13, 5) = 1,287.",
          "When outcomes are equally likely, probability = favourable ÷ total, so the chance is 1,287 / 2,598,960 ≈ 0.0005, about 1 in 2,000.",
        ],
      },
    ],
    quiz: [
      {
        question: "In how many ways can a group of 3 be chosen from 8 people?",
        options: ["24", "56", "336", "512"], answer: 1,
        explanation: "C(8, 3) = (8 × 7 × 6) / (3 × 2 × 1) = 56. The number 336 = 8 × 7 × 6 counts ordered picks, so each group is counted 6 times.",
      },
      {
        question: "C(10, 7) is equal to…",
        options: ["C(10, 3)", "C(10, 4)", "C(7, 3)", "10 × 7"], answer: 0,
        explanation: "By symmetry, C(10, 7) = C(10, 10 − 7) = C(10, 3). Choosing 7 to include is the same as choosing 3 to leave out.",
      },
      {
        question: "A set has 6 elements. How many subsets does it have in total, counting the empty set and the whole set?",
        options: ["12", "36", "64", "720"], answer: 2,
        explanation: "Each element is either in a subset or out of it: 2 choices for each of 6 elements, so 2⁶ = 64.",
      },
    ],
  },

  {
    id: "multinomials", rank: 9, title: "Repeated Items & Multinomials", minutes: 14,
    description: "Count arrangements when some objects look identical, and splits into groups.",
    objective: "Count distinct arrangements with repeated items, and divisions into labelled groups.",
    body: [
      "What if some objects look the same? The word LEVEL has 5 letters, but swapping its two L’s, or its two E’s, gives the same word. If we treated every letter as different we would overcount.",
      "The method: first count as if every object were different (5! = 120 here). Each real arrangement was then counted once for every way of shuffling identical letters among themselves: 2! for the L’s and 2! for the E’s. Divide those out: 5! / (2! × 2! × 1!) = 30.",
      "In general, suppose n objects contain n₁ of one kind, n₂ of another, up to nᵣ of the last kind, with n₁ + … + nᵣ = n. The number of distinct arrangements is the multinomial coefficient n! / (n₁! n₂! ··· nᵣ!).",
      "The same number answers a different-looking question: in how many ways can n different people be split into labelled groups of sizes n₁, …, nᵣ? Hand the people labels one by one, using n₁ copies of label 1, n₂ copies of label 2, and so on. Each arrangement of the labels is exactly one split.",
      "Be careful when the groups are not labelled. Splitting 8 people into two unlabelled teams of 4 counts every split twice (team A and team B can swap), so the answer is C(8, 4) / 2 = 35, not 70.",
    ],
    formulas: [
      { label: "Distinct arrangements", text: "n! / (n₁! n₂! ··· nᵣ!)" },
      { label: "Multinomial theorem", text: "(x₁ + ··· + xᵣ)ⁿ = Σ [n! / (n₁!···nᵣ!)] x₁^(n₁) ··· xᵣ^(nᵣ)" },
    ],
    examples: [
      {
        title: "The word BANANA",
        problem: "How many different letter arrangements can be made from BANANA?",
        steps: [
          "BANANA has 6 letters: B once, A three times, N twice.",
          "Arrangements = 6! / (1! × 3! × 2!) = 720 / 12 = 60.",
        ],
      },
      {
        title: "Binary strings",
        problem: "How many 10-bit strings contain exactly four 1s?",
        steps: [
          "Arrange four 1s and six 0s in a line: 10! / (4! × 6!) = 210.",
          "This equals C(10, 4). With only two kinds of item, the multinomial coefficient is just a binomial coefficient: choose which 4 positions hold the 1s.",
        ],
      },
      {
        title: "Assigning volunteers",
        problem: "Twelve volunteers are split into three labelled jobs: 5 on registration, 4 on refreshments, 3 on cleanup. How many ways?",
        steps: [
          "This is a division into labelled groups of sizes 5, 4 and 3.",
          "12! / (5! × 4! × 3!) = 479,001,600 / 17,280 = 27,720.",
        ],
      },
    ],
    quiz: [
      {
        question: "How many distinct arrangements are there of the letters in ALLOY?",
        options: ["120", "60", "30", "20"], answer: 1,
        explanation: "5 letters with the L repeated twice: 5! / 2! = 120 / 2 = 60.",
      },
      {
        question: "Eight people are split into two unlabelled teams of 4. How many splits are there?",
        options: ["70", "35", "24", "8"], answer: 1,
        explanation: "C(8, 4) = 70 counts each split twice, once for each way of naming the teams, so divide by 2 to get 35.",
      },
      {
        question: "A signal is 7 flags in a row: 3 red, 2 green, 2 yellow, with same-coloured flags identical. How many different signals?",
        options: ["5,040", "420", "210", "35"], answer: 2,
        explanation: "7! / (3! × 2! × 2!) = 5,040 / 24 = 210.",
      },
    ],
  },

  {
    id: "axioms", rank: 9, title: "The Axioms of Probability", minutes: 12,
    description: "Build probability from three simple rules.",
    objective: "State the three axioms and derive the complement rule from them.",
    body: [
      "So far we have described what can happen. Probability attaches a number to each event to measure how likely it is. Rather than guess those numbers, mathematicians demand three simple rules, called the axioms, that any sensible assignment must obey. The rest of the subject is built on them.",
      "Axiom 1 (non-negativity): P(A) ≥ 0 for every event A. Axiom 2 (normalisation): P(Ω) = 1, because something in the sample space must happen. Axiom 3 (additivity): if A and B are mutually exclusive, then P(A ∪ B) = P(A) + P(B). The same holds for any list of events, finite or endless, that pairwise cannot happen together.",
      "Why only for mutually exclusive events? Think of probability as area on a map where Ω has area 1. Adding the areas of two regions gives the area of their union only if the regions do not overlap. Otherwise the overlap is counted twice.",
      "Even three rules prove useful facts. The complement: A and Aᶜ are mutually exclusive and together make up Ω, so P(A) + P(Aᶜ) = 1, which gives P(Aᶜ) = 1 − P(A). The impossible event has P(∅) = 0. If A ⊆ B then P(A) ≤ P(B). And every probability is at most 1.",
      "The axioms do not tell you how to find P(A) in a particular situation. They only fence in the allowed answers. When Ω is finite and all outcomes are equally likely, we can set P(A) = |A| / |Ω|, and it can be checked that this satisfies all three axioms.",
    ],
    formulas: [
      { label: "Axiom 1", text: "P(A) ≥ 0" },
      { label: "Axiom 2", text: "P(Ω) = 1" },
      { label: "Axiom 3", text: "A ∩ B = ∅  ⟹  P(A ∪ B) = P(A) + P(B)" },
      { label: "Complement rule", text: "P(Aᶜ) = 1 − P(A)" },
    ],
    examples: [
      {
        title: "Checking an assignment",
        problem: "A spinner lands on red, green or blue. Someone claims P(red) = 0.5, P(green) = 0.3 and P(blue) = 0.4. Is this possible?",
        steps: [
          "The three outcomes are mutually exclusive and together make up Ω, so Axioms 2 and 3 force the three numbers to add up to 1.",
          "But 0.5 + 0.3 + 0.4 = 1.2, so the claim breaks Axiom 2. A valid fix would be P(blue) = 0.2.",
        ],
      },
      {
        title: "The complement shortcut",
        problem: "A fair coin is tossed 3 times. What is the probability of at least one head?",
        steps: [
          "Counting outcomes with “at least one head” is awkward. Its complement is easy: “no heads” is the single outcome TTT.",
          "The 8 outcomes are equally likely, so P(no heads) = 1/8.",
          "By the complement rule, P(at least one head) = 1 − 1/8 = 7/8.",
        ],
      },
      {
        title: "A tempting mistake",
        problem: "P(rain tomorrow) = 0.4 and P(strong wind tomorrow) = 0.3. Can we say P(rain or wind) = 0.7?",
        steps: [
          "Not in general. Axiom 3 only applies to events that cannot happen together, and a day can be both rainy and windy.",
          "Adding 0.4 + 0.3 would count the rainy-and-windy days twice. Rank 08 shows how to correct for this overlap.",
        ],
      },
    ],
    quiz: [
      {
        question: "If P(A) = 0.35, what is P(Aᶜ)?",
        options: ["0.35", "0.55", "0.65", "1.35"], answer: 2,
        explanation: "P(Aᶜ) = 1 − P(A) = 1 − 0.35 = 0.65.",
      },
      {
        question: "The outcomes a, b, c are mutually exclusive and make up Ω. Which assignment is valid?",
        options: [
          "P(a) = 0.5, P(b) = 0.4, P(c) = 0.2",
          "P(a) = 0.6, P(b) = 0.5, P(c) = −0.1",
          "P(a) = 0.25, P(b) = 0.25, P(c) = 0.5",
          "P(a) = 0.3, P(b) = 0.3, P(c) = 0.3",
        ], answer: 2,
        explanation: "Only the third assignment has non-negative values that sum to 1. The first sums to 1.1, the second has a negative value, and the fourth sums to 0.9.",
      },
      {
        question: "Events A and B are mutually exclusive, with P(A) = 0.2 and P(B) = 0.5. What is P(A ∪ B)?",
        options: ["0.1", "0.3", "0.7", "0.8"], answer: 2,
        explanation: "By Axiom 3, mutually exclusive events add: 0.2 + 0.5 = 0.7.",
      },
    ],
  },
];
