import type { Lesson } from "./types";

// Rank 09 — Initiate. These lessons complete the event-algebra and elementary
// probability foundations before Sequence 08 introduces broader counting methods.
export const rank09Extra: Lesson[] = [
  {
    id: "events-operations", rank: 9, title: "Events & Event Operations", minutes: 12,
    description: "Combine events with “or”, “and” and “not”.",
    objective: "Translate verbal conditions into unions, intersections and complements, including compound events.",
    body: [
      "An event is a subset of the sample space. The union A ∪ B occurs when at least one of A or B occurs; “or” is inclusive, so the overlap is included. The intersection A ∩ B occurs when both occur. The complement Aᶜ occurs when A does not.",
      "For three events, the same language extends naturally: A ∪ B ∪ C means at least one occurs, while A ∩ B ∩ C means all three occur. Differences are also useful: A \\ B means A occurs but B does not, and equals A ∩ Bᶜ.",
      "A Venn diagram is a picture of set membership, not a probability model by itself. It tells you which outcomes belong to an event; probabilities are assigned separately. Always translate the words first, then calculate.",
      "The phrase “exactly one of A and B” is (A ∩ Bᶜ) ∪ (Aᶜ ∩ B). “At least one” is A ∪ B, and “neither” is (A ∪ B)ᶜ. These translations prevent ambiguity in multi-condition questions."
    ],
    formulas: [
      { label: "Union (at least one)", text: "A ∪ B" },
      { label: "Intersection (both)", text: "A ∩ B" },
      { label: "Complement (not A)", text: "Aᶜ = Ω \\ A" },
      { label: "Difference (A but not B)", text: "A \\ B = A ∩ Bᶜ" },
      { label: "Exactly one of A and B", text: "(A ∩ Bᶜ) ∪ (Aᶜ ∩ B)" }
    ],
    examples: [
      { title: "A die and two conditions", problem: "A fair die is rolled. Let A be “the result is even” and B be “the result is greater than 3”. List A ∪ B, A ∩ B and A \\ B.", steps: [
        "The sample space is Ω={1,2,3,4,5,6}; A={2,4,6} and B={4,5,6}.",
        "The union contains outcomes in either set: A ∪ B={2,4,5,6}.",
        "The intersection contains outcomes in both: A ∩ B={4,6}. The difference contains outcomes in A but not B: A \\ B={2}.",
        "The word “or” includes the overlap; it does not mean exactly one."
      ] },
      { title: "Exactly one defective component", problem: "Two components have defect events A and B. Express the event that exactly one component is defective.", steps: [
        "Exactly one means either A occurs and B does not, or B occurs and A does not.",
        "The first case is A ∩ Bᶜ; the second is Aᶜ ∩ B.",
        "The two cases are disjoint, so the event is (A ∩ Bᶜ) ∪ (Aᶜ ∩ B)."
      ] }
    ],
    quiz: [
      { question: "The event A ∪ B occurs when", options: ["both A and B occur", "at least one of A or B occurs", "neither A nor B occurs", "A occurs but B does not"], answer: 1, difficulty: "easy", explanation: "Union is inclusive “or”: A, B, or both. The intersection is the event that both occur." },
      { question: "If A={1,2,3,4} and B={3,4,5}, then A ∩ B is", options: ["{1,2,5}", "{1,2,3,4,5}", "{3,4}", "{1,2}"], answer: 2, difficulty: "medium", explanation: "The intersection contains only elements shared by both sets: 3 and 4." },
      { question: "Which expression represents exactly one of A and B?", options: ["A ∩ B", "A ∪ B", "(A ∩ Bᶜ) ∪ (Aᶜ ∩ B)", "(A ∪ B)ᶜ"], answer: 2, difficulty: "hard", explanation: "Exactly one consists of two disjoint cases: A without B, or B without A. A ∪ B also includes the case where both occur." }
    ]
  },
  {
    id: "set-theory", rank: 9, title: "Set Theory & Event Algebra", minutes: 12,
    description: "The rules that let events be combined like algebra.",
    objective: "Use identity, complement, commutative, associative and distributive laws to simplify event expressions.",
    body: [
      "Events are sets, so the ordinary laws of set algebra apply. Commutativity says order does not matter; associativity says brackets can be regrouped when the operation is unchanged. These laws let us rearrange events without changing which outcomes they contain.",
      "The identity laws are A ∪ ∅=A and A ∩ Ω=A. The domination laws are A ∪ Ω=Ω and A ∩ ∅=∅. Idempotence gives A ∪ A=A and A ∩ A=A. These are useful checks when simplifying expressions.",
      "The complement laws state A ∪ Aᶜ=Ω and A ∩ Aᶜ=∅, while double complementation gives (Aᶜ)ᶜ=A. The distributive laws connect union and intersection, just as multiplication distributes over addition.",
      "Set identities can be verified by checking membership: take an arbitrary outcome ω and ask whether membership in the left-hand expression is equivalent to membership in the right-hand expression. This is often safer than relying on a diagram."
    ],
    formulas: [
      { label: "Commutative", text: "A ∪ B = B ∪ A;  A ∩ B = B ∩ A" },
      { label: "Associative", text: "(A ∪ B) ∪ C = A ∪ (B ∪ C)" },
      { label: "Distributive", text: "A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)" },
      { label: "Identity and domination", text: "A ∪ ∅=A;  A ∩ Ω=A;  A ∪ Ω=Ω;  A ∩ ∅=∅" },
      { label: "Complement", text: "A ∪ Aᶜ=Ω;  A ∩ Aᶜ=∅;  (Aᶜ)ᶜ=A" }
    ],
    examples: [
      { title: "Simplifying a compound event", problem: "Simplify (A ∩ B) ∪ (A ∩ Bᶜ).", steps: [
        "Factor A using the distributive law: (A ∩ B) ∪ (A ∩ Bᶜ)=A ∩ (B ∪ Bᶜ).",
        "B ∪ Bᶜ=Ω by the complement law.",
        "Therefore A ∩ Ω=A. The original expression is exactly A."
      ] },
      { title: "A membership proof", problem: "Show that A ∩ (B ∪ C)=(A ∩ B) ∪ (A ∩ C).", steps: [
        "An outcome ω belongs to the left side precisely when ω∈A and (ω∈B or ω∈C).",
        "This is equivalent to (ω∈A and ω∈B) or (ω∈A and ω∈C).",
        "That is exactly membership in (A ∩ B) ∪ (A ∩ C), proving the identity."
      ] }
    ],
    quiz: [
      { question: "Which law states A ∪ B = B ∪ A?", options: ["Associative", "Commutative", "Distributive", "Complement"], answer: 1, difficulty: "easy", explanation: "Commutativity permits the order of the two sets to be exchanged." },
      { question: "A ∩ (B ∪ C) is equal to", options: ["(A ∩ B) ∪ (A ∩ C)", "(A ∪ B) ∩ C", "A ∪ (B ∩ C) only when B=C", "A ∩ B ∩ C"], answer: 0, difficulty: "medium", explanation: "Intersection distributes over union, just as multiplication distributes over addition." },
      { question: "Simplify (A ∪ B) ∩ (A ∪ Bᶜ).", options: ["Ω", "A", "B", "A ∪ B"], answer: 1, difficulty: "hard", explanation: "By distributivity this is A ∪ (B ∩ Bᶜ)=A ∪ ∅=A." }
    ]
  },
  {
    id: "mutually-exclusive", rank: 9, title: "Mutually Exclusive Events", minutes: 10,
    description: "Events that can never happen together.",
    objective: "Recognise disjoint events, apply the addition rule and distinguish disjointness from independence.",
    body: [
      "Two events are mutually exclusive, or disjoint, when they share no outcomes: A ∩ B=∅. If one occurs, the other cannot occur on that same trial. For a single die roll, “result is 1” and “result is 6” are disjoint.",
      "For disjoint events, additivity gives P(A ∪ B)=P(A)+P(B). For three pairwise disjoint events, the probability of their union is the sum of all three probabilities. The rule extends to a countable disjoint collection.",
      "Do not confuse mutually exclusive with independent. If A and B are disjoint and both have positive probability, then P(A ∩ B)=0 but P(A)P(B)>0, so they cannot be independent. Independence means learning one occurred does not change the probability of the other.",
      "A useful diagnostic: if a question says “A or B” and the events may overlap, do not simply add their probabilities. Use the general addition rule, which subtracts the intersection once."
    ],
    formulas: [
      { label: "Disjointness", text: "A ∩ B = ∅" },
      { label: "Addition for disjoint events", text: "P(A ∪ B) = P(A) + P(B)" },
      { label: "Pairwise disjoint finite family", text: "P(⋃ᵢ Aᵢ) = Σᵢ P(Aᵢ)" }
    ],
    examples: [
      { title: "Two die outcomes", problem: "A fair die is rolled. Let A={1,2} and B={5,6}. Find P(A ∪ B).", steps: [
        "The sets have no common outcomes, so they are disjoint.",
        "P(A)=2/6 and P(B)=2/6.",
        "Thus P(A ∪ B)=2/6+2/6=4/6=2/3."
      ] },
      { title: "Disjoint but not independent", problem: "Events A and B are disjoint with P(A)=0.3 and P(B)=0.2. Are they independent?", steps: [
        "Disjointness gives P(A ∩ B)=0.",
        "Independence would require P(A ∩ B)=P(A)P(B)=0.3×0.2=0.06.",
        "Since 0≠0.06, the events are not independent. Knowing A occurred rules out B."
      ] }
    ],
    quiz: [
      { question: "If A and B are disjoint, then", options: ["P(A ∩ B)=1", "P(A ∩ B)=0", "P(A)=P(B)", "A and B must be independent"], answer: 1, difficulty: "easy", explanation: "Disjoint events have an empty intersection, whose probability is zero." },
      { question: "If P(A)=0.25 and P(B)=0.15 and A,B are disjoint, P(A ∪ B) is", options: ["0.10", "0.0375", "0.40", "0.25"], answer: 2, difficulty: "medium", explanation: "For disjoint events, add the probabilities: 0.25+0.15=0.40." },
      { question: "A and B are disjoint and each has positive probability. Which statement is true?", options: ["They are independent", "They are dependent", "They are complements", "Their union is impossible"], answer: 1, difficulty: "hard", explanation: "Their intersection probability is zero, whereas independence would require the positive product P(A)P(B). Thus they are dependent." }
    ]
  },
  {
    id: "exhaustive-partitions", rank: 9, title: "Exhaustive Events & Partitions", minutes: 10,
    description: "Events that together cover every possibility.",
    objective: "Distinguish exhaustive collections from partitions and use partition probabilities as a complete case split.",
    body: [
      "A collection of events is exhaustive when their union is the entire sample space: at least one event in the collection must occur. Exhaustiveness alone does not prevent overlap; several events may occur together.",
      "A partition is a collection that is both exhaustive and pairwise disjoint. Exactly one partition event occurs on every trial. For a finite partition B₁,…,Bₙ, their probabilities sum to one.",
      "Partitions organise probability calculations into cases. If the cases are mutually exclusive and cover every possibility, an event A can be split into the disjoint pieces A∩Bᵢ. This is the foundation of the law of total probability taught in Sequence 07.",
      "Check both conditions before calling something a partition: the union must be Ω, and every pair of distinct events must have empty intersection. A set of overlapping categories may be exhaustive without being a partition."
    ],
    formulas: [
      { label: "Exhaustive", text: "⋃ᵢ Bᵢ = Ω" },
      { label: "Pairwise disjoint", text: "Bᵢ ∩ Bⱼ = ∅ for i ≠ j" },
      { label: "Partition probability total", text: "Σᵢ P(Bᵢ) = 1" }
    ],
    examples: [
      { title: "Parity partition", problem: "For one fair die roll, show that E={1,3,5} and O={2,4,6} form a partition and find their probabilities.", steps: [
        "Every die outcome is either odd or even, so E ∪ O=Ω.",
        "No integer is both odd and even, so E ∩ O=∅.",
        "Thus {E,O} is a partition. Each contains three of six outcomes, so P(E)=P(O)=1/2 and the probabilities sum to one."
      ] },
      { title: "Exhaustive but not a partition", problem: "On a die roll let A={1,2,3,4} and B={3,4,5,6}. Are A and B exhaustive? Do they form a partition?", steps: [
        "Their union is {1,2,3,4,5,6}=Ω, so they are exhaustive.",
        "Their intersection is {3,4}, which is not empty.",
        "They are not a partition because they overlap. Adding P(A)+P(B) would count outcomes 3 and 4 twice."
      ] }
    ],
    quiz: [
      { question: "A partition of Ω must be", options: ["exhaustive only", "pairwise disjoint only", "exhaustive and pairwise disjoint", "made of equally likely events"], answer: 2, difficulty: "easy", explanation: "A partition covers every outcome and assigns each outcome to exactly one block." },
      { question: "If B₁,B₂,B₃ form a partition, then", options: ["their probabilities sum to 0", "their probabilities sum to 1", "they must be equally likely", "each has probability 1/3"], answer: 1, difficulty: "medium", explanation: "The events are disjoint and their union is Ω, so finite additivity and P(Ω)=1 give a sum of one." },
      { question: "A and B have union Ω but a nonempty intersection. Which description is correct?", options: ["They form a partition", "They are disjoint", "They are exhaustive but not a partition", "They cannot both have positive probability"], answer: 2, difficulty: "hard", explanation: "Their union covers the space, so they are exhaustive. Their overlap violates the pairwise-disjoint requirement for a partition." }
    ]
  },
  {
    id: "properties", rank: 9, title: "Properties of Probability", minutes: 12,
    description: "Useful facts that follow from the three axioms.",
    objective: "Derive and apply complement, monotonicity, bounds and the two-event inclusion–exclusion identity.",
    body: [
      "The axioms imply P(∅)=0, 0≤P(A)≤1, and P(Aᶜ)=1−P(A). The complement formula follows because A and Aᶜ are disjoint and their union is Ω.",
      "Monotonicity says that if A⊆B then P(A)≤P(B). To see why, write B as the disjoint union A∪(B\\A). The extra region has nonnegative probability, so B cannot be less likely than A.",
      "For overlapping events, the general addition rule is P(A∪B)=P(A)+P(B)−P(A∩B). The intersection is subtracted once because it was included in both P(A) and P(B).",
      "A useful consequence is the union bound: P(⋃ᵢ Aᵢ)≤ΣᵢP(Aᵢ). It follows by comparing the union with a disjoint decomposition or by repeated use of the two-event inequality. The bound can be loose, but it is always valid."
    ],
    formulas: [
      { label: "Complement", text: "P(Aᶜ) = 1 − P(A)" },
      { label: "Monotonicity", text: "A ⊆ B  ⟹  P(A) ≤ P(B)" },
      { label: "Two-event inclusion–exclusion", text: "P(A ∪ B) = P(A) + P(B) − P(A ∩ B)" },
      { label: "Union bound", text: "P(⋃ᵢ Aᵢ) ≤ Σᵢ P(Aᵢ)" }
    ],
    examples: [
      { title: "Using monotonicity", problem: "If A⊆B, P(A)=0.28 and P(B)=0.61, find P(B\\A).", steps: [
        "Because A is contained in B, B is the disjoint union of A and B\\A.",
        "Therefore P(B)=P(A)+P(B\\A).",
        "So P(B\\A)=0.61−0.28=0.33."
      ] },
      { title: "Correcting double counting", problem: "Suppose P(A)=0.55, P(B)=0.40 and P(A∩B)=0.20. Find P(A∪B).", steps: [
        "Adding P(A)+P(B) counts the overlap twice.",
        "Subtract the intersection once: 0.55+0.40−0.20=0.75.",
        "The union probability is 0.75, which is at most one as required."
      ] }
    ],
    quiz: [
      { question: "If P(A)=0.37, then P(Aᶜ) is", options: ["0.37", "0.63", "1.37", "0"], answer: 1, difficulty: "easy", explanation: "The event and its complement partition Ω, so their probabilities add to one." },
      { question: "If A⊆B, which inequality must hold?", options: ["P(A)≥P(B)", "P(A)=1−P(B)", "P(A)≤P(B)", "P(A)+P(B)=1"], answer: 2, difficulty: "medium", explanation: "B contains every outcome in A and possibly more, so monotonicity gives P(A)≤P(B)." },
      { question: "If P(A)=0.6, P(B)=0.5 and P(A∩B)=0.3, what is P(A∪B)?", options: ["1.1", "0.8", "0.3", "0.2"], answer: 1, difficulty: "hard", explanation: "Inclusion–exclusion gives 0.6+0.5−0.3=0.8. Simply adding would double-count the intersection." }
    ]
  },
  {
    id: "equally-likely", rank: 9, title: "Equally Likely Outcomes", minutes: 10,
    description: "When every outcome has the same chance.",
    objective: "Compute probabilities in finite uniform sample spaces and identify when the classical ratio is invalid.",
    body: [
      "If Ω is finite and every elementary outcome has the same probability, then each outcome has probability 1/|Ω|. An event A containing |A| outcomes therefore has probability |A|/|Ω|.",
      "The condition of equal likelihood is essential. A ratio of favourable outcomes to total outcomes is not justified merely because outcomes have been listed. A biased coin, an irregular spinner or a poorly shuffled deck may not have equally likely elementary outcomes.",
      "Choose the elementary outcomes at a sufficiently fine level. For two fair coin tosses, HH, HT, TH and TT are equally likely. The coarser categories “zero heads”, “one head” and “two heads” are not equally likely because the middle category contains two elementary outcomes.",
      "For a finite uniform model, counting is a convenient way to assign probabilities. For continuous models, individual points can have probability zero and length or area—not the number of points—determines probability under a uniform distribution."
    ],
    formulas: [
      { label: "Classical probability", text: "P(A) = |A| / |Ω|, when Ω is finite and elementary outcomes are equiprobable" },
      { label: "Probability of one elementary outcome", text: "P({ω}) = 1/|Ω|" }
    ],
    examples: [
      { title: "Two fair dice", problem: "Two distinguishable fair dice are rolled. Find the probability that their sum is 8.", steps: [
        "The elementary outcomes are ordered pairs, so there are 6×6=36 equally likely outcomes.",
        "The pairs summing to 8 are (2,6),(3,5),(4,4),(5,3),(6,2): five outcomes.",
        "Thus P(sum 8)=5/36. Treating the possible sums 2 through 12 as equally likely would be incorrect."
      ] },
      { title: "Coarse outcomes are not uniform", problem: "Two fair coins are tossed. Find the probability of exactly one head.", steps: [
        "The equally likely elementary outcomes are HH, HT, TH and TT.",
        "Exactly one head corresponds to HT and TH, two of the four outcomes.",
        "The probability is 2/4=1/2. The three head-count categories are not equally likely."
      ] }
    ],
    quiz: [
      { question: "A fair die is rolled. What is P(result at most 2)?", options: ["1/6", "1/3", "1/2", "2/3"], answer: 1, difficulty: "easy", explanation: "The favourable outcomes are 1 and 2, so the probability is 2/6=1/3." },
      { question: "Two fair dice are rolled. How many equally likely elementary outcomes are there?", options: ["11", "12", "21", "36"], answer: 3, difficulty: "medium", explanation: "The dice are distinguishable, so each ordered pair is an elementary outcome: 6×6=36." },
      { question: "Two fair dice are rolled. Why is it invalid to treat each possible sum 2,…,12 as equally likely?", options: ["There are too many sums", "Different sums are produced by different numbers of ordered pairs", "Dice sums are continuous", "The dice are dependent"], answer: 1, difficulty: "hard", explanation: "For example, sum 2 has one ordered pair, while sum 7 has six. Equal likelihood applies to elementary ordered pairs, not to the coarser sum categories." }
    ]
  },
  {
    id: "probability-counting", rank: 9, title: "Probability Using Counting", minutes: 12,
    description: "Combine counting rules with equally likely outcomes.",
    objective: "Calculate probabilities using consistent ordered or unordered counts and identify the correct sample space.",
    body: [
      "In a finite uniform sample space, probability is a ratio: count favourable elementary outcomes and divide by the total number. The multiplication rule, permutations and combinations provide the counts.",
      "The numerator and denominator must use the same kind of outcome. If the sample space consists of ordered draws, count favourable ordered sequences. If it consists of unordered hands, count favourable hands. Mixing an ordered numerator with an unordered denominator gives a meaningless ratio.",
      "When selecting k objects without replacement from n distinct objects, ordered samples number n!/(n−k)!, while unordered samples number C(n,k). The correct choice depends on whether order is part of the experiment or whether the event changes when the order changes.",
      "A good solution states the sample space before counting. Check that all elementary outcomes are equally likely; if they are not, a plain favourable-count ratio is not valid and probabilities must be weighted."
    ],
    formulas: [
      { label: "Counting probability", text: "P(A) = favourable elementary outcomes / total elementary outcomes" },
      { label: "Ordered selection without replacement", text: "n!/(n−k)!" },
      { label: "Unordered selection", text: "C(n,k) = n!/[k!(n−k)!]" }
    ],
    examples: [
      { title: "A five-card flush in one suit", problem: "A five-card hand is dealt uniformly from a standard 52-card deck. Find the probability all five cards are hearts.", steps: [
        "A hand is unordered, so the total number of hands is C(52,5).",
        "Favourable hands choose five of the thirteen hearts: C(13,5).",
        "The probability is C(13,5)/C(52,5)=1287/2598960≈0.000495."
      ] },
      { title: "Two aces in two draws", problem: "Two cards are drawn without replacement from a 52-card deck. Find the probability both are aces.", steps: [
        "Using ordered draws, there are 52×51 possible sequences.",
        "There are 4×3 favourable ordered sequences because the first and second cards must both be aces.",
        "The probability is (4×3)/(52×51)=1/221. Equivalently, the unordered ratio is C(4,2)/C(52,2)."
      ] }
    ],
    quiz: [
      { question: "A five-card hand is an unordered selection. The number of possible hands is", options: ["52×51×50×49×48", "C(52,5)", "52⁵", "5!"], answer: 1, difficulty: "easy", explanation: "Order does not matter in a hand, so choose five distinct cards from 52." },
      { question: "A box has 3 red and 2 blue balls. Two are drawn without replacement. What is the probability both are red?", options: ["3/5", "3/10", "1/2", "9/25"], answer: 1, difficulty: "medium", explanation: "The probability is (3/5)(2/4)=6/20=3/10. The second draw has only two red among four remaining." },
      { question: "Which ratio correctly counts the probability of a five-card hand containing exactly two aces?", options: ["C(4,2)C(48,3)/C(52,5)", "4×3/C(52,5)", "C(52,2)/C(4,2)", "C(4,2)C(48,3)/(52×51×50×49×48)"], answer: 0, difficulty: "hard", explanation: "Choose two of the four aces and three of the 48 non-aces, then divide by all unordered five-card hands. Both numerator and denominator count hands." }
    ]
  },
  {
    id: "de-morgan", rank: 9, title: "De Morgan’s Laws", minutes: 10,
    description: "How complements turn “or” into “and”.",
    objective: "Apply De Morgan’s laws to complements of unions and intersections and to “at least one” events.",
    body: [
      "De Morgan’s laws describe how negation interacts with event operations. “Not (A or B)” means neither event occurs, so it is Aᶜ∩Bᶜ. “Not (A and B)” means at least one fails, so it is Aᶜ∪Bᶜ.",
      "The same pattern works for any finite or countable collection: the complement of a union is the intersection of all complements, and the complement of an intersection is the union of all complements.",
      "These identities are especially useful for “at least one” questions. Rather than count every way one or more events can occur, calculate the probability that none occurs and subtract from one.",
      "Translate the logical statement carefully. “Not both” is Aᶜ∪Bᶜ, while “neither” is Aᶜ∩Bᶜ; they are different events."
    ],
    formulas: [
      { label: "Complement of a union", text: "(A ∪ B)ᶜ = Aᶜ ∩ Bᶜ" },
      { label: "Complement of an intersection", text: "(A ∩ B)ᶜ = Aᶜ ∪ Bᶜ" },
      { label: "Countable union", text: "(⋃ₙ Aₙ)ᶜ = ⋂ₙ Aₙᶜ" }
    ],
    examples: [
      { title: "At least one six", problem: "A fair die is rolled four times. Find the probability of at least one six.", steps: [
        "Let Aᵢ be the event that roll i is a six. The event of at least one six is ⋃ᵢAᵢ.",
        "Its complement is ⋂ᵢAᵢᶜ: all four rolls avoid six.",
        "By independence, P(no six)=(5/6)⁴. Therefore P(at least one six)=1−(5/6)⁴=671/1296."
      ] },
      { title: "Not both", problem: "Events A and B have P(A)=0.6, P(B)=0.5 and P(A∩B)=0.3. Find the probability that they do not both occur.", steps: [
        "“Not both” is (A∩B)ᶜ, not the event that neither occurs.",
        "By the complement rule, P((A∩B)ᶜ)=1−P(A∩B).",
        "The answer is 1−0.3=0.7."
      ] }
    ],
    quiz: [
      { question: "The complement of A∪B is", options: ["Aᶜ∪Bᶜ", "Aᶜ∩Bᶜ", "A∩B", "Aᶜ∩B"], answer: 1, difficulty: "easy", explanation: "Not (A or B) means neither A nor B: both complements must occur." },
      { question: "“Not both A and B” is", options: ["Aᶜ∩Bᶜ", "A∩B", "Aᶜ∪Bᶜ", "A∪B"], answer: 2, difficulty: "medium", explanation: "The complement of an intersection is the union of the complements: at least one of A or B fails." },
      { question: "Independent events A₁,…,Aₙ each have probability p. What is the probability at least one occurs?", options: ["pⁿ", "1−pⁿ", "1−(1−p)ⁿ", "(1−p)ⁿ"], answer: 2, difficulty: "hard", explanation: "The complement is that none occurs. Independence gives probability (1−p)ⁿ for none, so the desired probability is 1−(1−p)ⁿ." }
    ]
  },
  {
    id: "continuity", rank: 9, title: "Continuity of Probability", minutes: 12,
    description: "Probabilities of growing or shrinking sequences of events.",
    objective: "Apply continuity from below and above to increasing and decreasing sequences of events.",
    body: [
      "A sequence of events A₁⊆A₂⊆… is increasing. Its union A=⋃ₙAₙ contains every outcome that enters at some finite stage. Continuity from below states P(Aₙ) increases to P(A).",
      "A sequence B₁⊇B₂⊇… is decreasing. Its intersection B=⋂ₙBₙ contains outcomes that survive every stage. Continuity from above states P(Bₙ) decreases to P(B). In a probability space the required finite-measure condition is automatic because P(B₁)≤1.",
      "These results are consequences of countable additivity. For an increasing sequence, split the union into the disjoint increments A₁, A₂\\A₁, A₃\\A₂, and so on; partial sums of their probabilities are exactly P(Aₙ).",
      "Continuity is not the same as saying P(lim Aₙ)=lim P(Aₙ) for every arbitrary sequence. Monotonicity of the events is essential in these two theorems. For non-monotone sequences, additional tools and hypotheses are needed."
    ],
    formulas: [
      { label: "Continuity from below", text: "Aₙ ↑ A=⋃ₙAₙ  ⟹  P(Aₙ) ↑ P(A)" },
      { label: "Continuity from above", text: "Bₙ ↓ B=⋂ₙBₙ  ⟹  P(Bₙ) ↓ P(B)" },
      { label: "Disjoint increments", text: "P(⋃ₙAₙ) = Σₙ P(Aₙ \\ Aₙ₋₁), with A₀=∅" }
    ],
    examples: [
      { title: "Intervals expanding to an open interval", problem: "Let Ω=[0,1] with the uniform distribution and Aₙ=[0,1−1/n] for n≥2. Find P(⋃ₙAₙ).", steps: [
        "The intervals increase and their union is [0,1).",
        "Their probabilities are P(Aₙ)=1−1/n, which increase to 1.",
        "Continuity from below gives P(⋃ₙAₙ)=limₙ(1−1/n)=1."
      ] },
      { title: "Intervals shrinking to a point", problem: "Let Ω=[0,1] be uniform and Bₙ=[0,1/n]. Find P(⋂ₙBₙ).", steps: [
        "The intervals decrease and their intersection is the single point {0}.",
        "P(Bₙ)=1/n, which decreases to zero.",
        "Continuity from above gives P({0})=limₙ1/n=0. The intersection is not empty even though it has probability zero."
      ] }
    ],
    quiz: [
      { question: "If Aₙ increases to A, then", options: ["P(Aₙ)→P(A)", "P(Aₙ)→0 always", "P(Aₙ)=P(A₁)", "P(A)=0"], answer: 0, difficulty: "easy", explanation: "Continuity from below says probabilities of an increasing sequence converge to the probability of its union." },
      { question: "If Bₙ decreases to B and P(B₁)<∞, then", options: ["P(Bₙ)→P(B)", "P(Bₙ)→1 always", "P(B)=P(B₁)", "P(Bₙ) must be constant"], answer: 0, difficulty: "medium", explanation: "Continuity from above requires finite probability of the first set; this holds automatically on a probability space." },
      { question: "Which statement is not justified by continuity from below/above alone?", options: ["Increasing events have probabilities converging to their union", "Decreasing events of finite first measure have probabilities converging to their intersection", "Every arbitrary sequence of events satisfies P(Aₙ)→P(lim Aₙ)", "Both results follow from countable additivity"], answer: 2, difficulty: "hard", explanation: "The continuity theorems require monotone event sequences. An arbitrary oscillating sequence need not have a limit event or convergent probabilities." }
    ]
  }
];
