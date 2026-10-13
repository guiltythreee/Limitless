import type { Lesson } from "./types";

// Rank 09 — Initiate: topics added with the background-art update.
// Each lesson here has a short, correct introduction and its key formula.
// Worked examples and quiz questions are still to be written, so those lists are empty for now.
export const rank09Extra: Lesson[] = [
  {
    id: "events-operations", rank: 9, title: "Events & Event Operations", minutes: 8,
    description: "Combine events with “or”, “and” and “not”.",
    objective: "Describe the union, intersection and complement of events, and say when each one happens.",
    body: [
      "Events can be combined to ask richer questions. The union A ∪ B happens when A happens, or B happens, or both. The intersection A ∩ B happens only when both A and B happen. The complement Aᶜ happens exactly when A does not.",
      "A Venn diagram makes these concrete: draw Ω as a box and each event as a region inside it. Union is everything covered by either region, intersection is the overlap, and the complement is everything outside the region.",
    ],
    formulas: [
      { label: "Union (A or B)", text: "A ∪ B" },
      { label: "Intersection (A and B)", text: "A ∩ B" },
      { label: "Complement (not A)", text: "Aᶜ = Ω \\ A" },
    ],
    examples: [],
    quiz: [],
  },
  {
    id: "set-theory", rank: 9, title: "Set Theory & Event Algebra", minutes: 8,
    description: "The rules that let events be combined like algebra.",
    objective: "Use the commutative, associative and distributive laws to rewrite combinations of events.",
    body: [
      "Because events are sets, they obey the laws of set algebra. Order does not matter for a union or an intersection (commutative laws), and brackets can be regrouped when only one of the two operations is used (associative laws).",
      "The distributive laws connect the two operations: intersection spreads over union, and union spreads over intersection. These laws let you rewrite a complicated event in a simpler form before you compute its probability.",
    ],
    formulas: [
      { label: "Commutative", text: "A ∪ B = B ∪ A,  A ∩ B = B ∩ A" },
      { label: "Distributive (∩ over ∪)", text: "A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)" },
      { label: "Distributive (∪ over ∩)", text: "A ∪ (B ∩ C) = (A ∪ B) ∩ (A ∪ C)" },
    ],
    examples: [],
    quiz: [],
  },
  {
    id: "mutually-exclusive", rank: 9, title: "Mutually Exclusive Events", minutes: 7,
    description: "Events that can never happen together.",
    objective: "Recognise mutually exclusive events and add their probabilities correctly.",
    body: [
      "Two events are mutually exclusive (also called disjoint) when they share no outcomes, so they cannot both happen on the same run. “The die shows 2” and “the die shows 5” are mutually exclusive.",
      "For such events the probability of “A or B” is simply the sum of the two probabilities. Be careful not to confuse this with independence: mutually exclusive events with positive probabilities are never independent, because learning that one happened tells you the other did not.",
    ],
    formulas: [
      { label: "Mutually exclusive", text: "A ∩ B = ∅" },
      { label: "Addition rule", text: "P(A ∪ B) = P(A) + P(B)" },
    ],
    examples: [],
    quiz: [],
  },
  {
    id: "exhaustive-partitions", rank: 9, title: "Exhaustive Events & Partitions", minutes: 8,
    description: "Events that together cover every possibility.",
    objective: "Define exhaustive events and partitions, and use the fact that a partition’s probabilities sum to 1.",
    body: [
      "Events are exhaustive when at least one of them must happen, which means their union is the whole sample space Ω. A partition is a stronger idea: the events are exhaustive and also mutually exclusive, so every outcome lies in exactly one of them.",
      "Partitions are powerful because their probabilities must add to 1. Splitting a hard problem into the pieces of a partition, solving each piece, and adding the results is the idea behind the law of total probability, which appears in a later rank.",
    ],
    formulas: [
      { label: "Exhaustive", text: "B₁ ∪ B₂ ∪ ··· ∪ Bₙ = Ω" },
      { label: "Partition (also exclusive)", text: "P(B₁) + P(B₂) + ··· + P(Bₙ) = 1" },
    ],
    examples: [],
    quiz: [],
  },
  {
    id: "properties", rank: 9, title: "Properties of Probability", minutes: 9,
    description: "Useful facts that follow from the three axioms.",
    objective: "Use the complement rule, monotonicity and the inclusion–exclusion rule for two events.",
    body: [
      "Everything below is derived from the three axioms. The impossible event has probability 0, every probability lies between 0 and 1, and if A is contained in B then P(A) ≤ P(B).",
      "When events overlap, simply adding probabilities counts the overlap twice. The inclusion–exclusion rule fixes this by subtracting the overlap once: P(A ∪ B) = P(A) + P(B) − P(A ∩ B).",
    ],
    formulas: [
      { label: "Complement", text: "P(Aᶜ) = 1 − P(A)" },
      { label: "Monotonicity", text: "A ⊆ B  ⟹  P(A) ≤ P(B)" },
      { label: "Inclusion–exclusion", text: "P(A ∪ B) = P(A) + P(B) − P(A ∩ B)" },
    ],
    examples: [],
    quiz: [],
  },
  {
    id: "equally-likely", rank: 9, title: "Equally Likely Outcomes", minutes: 7,
    description: "When every outcome has the same chance.",
    objective: "Compute probabilities by dividing favourable outcomes by total outcomes, and know when this is valid.",
    body: [
      "If a sample space is finite and every outcome is equally likely, the probability of an event is the number of outcomes in it divided by the number of outcomes in Ω. A fair die, a fair coin and a well-shuffled deck all work this way.",
      "The rule is only valid when the outcomes really are equally likely, so choose them at a fine enough level. For two coins the four outcomes HH, HT, TH, TT are equally likely, but “0, 1 or 2 heads” are not.",
    ],
    formulas: [
      { label: "Equally likely outcomes", text: "P(A) = |A| / |Ω|" },
    ],
    examples: [],
    quiz: [],
  },
  {
    id: "probability-counting", rank: 9, title: "Probability Using Counting", minutes: 9,
    description: "Combine counting rules with equally likely outcomes.",
    objective: "Find a probability by counting favourable and total outcomes with permutations and combinations.",
    body: [
      "When outcomes are equally likely, a probability question becomes two counting questions: how many outcomes are favourable, and how many are possible in total. The multiplication rule, permutations and combinations from the earlier lessons supply both counts.",
      "A useful habit is to decide first whether order matters, and to use the same choice for the top and the bottom of the fraction. Mixing an ordered count with an unordered one is the most common mistake.",
    ],
    formulas: [
      { label: "Counting probability", text: "P(A) = (number of favourable outcomes) / (number of outcomes in Ω)" },
    ],
    examples: [],
    quiz: [],
  },
  {
    id: "de-morgan", rank: 9, title: "De Morgan’s Laws", minutes: 6,
    description: "How complements turn “or” into “and”.",
    objective: "State De Morgan’s laws and use them to rewrite the complement of a union or intersection.",
    body: [
      "The complement of a union is the intersection of the complements: “not (A or B)” means “not A and not B”. The complement of an intersection is the union of the complements: “not (A and B)” means “not A or not B”.",
      "These laws often turn an awkward event into an easy one. For example, the chance that at least one of several events happens is 1 minus the chance that none of them happens.",
    ],
    formulas: [
      { label: "First law", text: "(A ∪ B)ᶜ = Aᶜ ∩ Bᶜ" },
      { label: "Second law", text: "(A ∩ B)ᶜ = Aᶜ ∪ Bᶜ" },
    ],
    examples: [],
    quiz: [],
  },
  {
    id: "continuity", rank: 9, title: "Continuity of Probability", minutes: 8,
    description: "Probabilities of growing or shrinking sequences of events.",
    objective: "Explain how the probability of a limit of events equals the limit of the probabilities.",
    body: [
      "Suppose events grow step by step, A₁ ⊆ A₂ ⊆ A₃ ⊆ …, and their union is A. Continuity says P(Aₙ) rises towards P(A) as n grows. Likewise, if events shrink, B₁ ⊇ B₂ ⊇ …, with intersection B, then P(Bₙ) falls towards P(B).",
      "This property follows from the axioms, in particular from additivity for endless lists of events. It is what lets us handle infinite processes, such as “keep tossing a coin until the first head”.",
    ],
    formulas: [
      { label: "Increasing events", text: "A₁ ⊆ A₂ ⊆ ···  ⟹  P(Aₙ) → P(∪ Aₙ)" },
      { label: "Decreasing events", text: "B₁ ⊇ B₂ ⊇ ···  ⟹  P(Bₙ) → P(∩ Bₙ)" },
    ],
    examples: [],
    quiz: [],
  },
];
