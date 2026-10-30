import type { Example, Formula, Lesson } from "./types";

// Chapter 1 theory (sections 1.1 to 1.12 of the textbook), written as additions to the rank 09 lessons.
// `body` paragraphs are appended after the existing introduction; formulas and examples are appended too.
export type Addition = { body: string[]; formulas?: Formula[]; examples?: Example[] };

export const theoryAdditions: Record<string, Addition> = {
  "sample-space": {
    body: [
      "Definition (§1.1). A random experiment is a procedure whose result is not determined in advance but whose set of possible results is well defined. Each possible result is an outcome ω, and the set of all outcomes is the sample space Ω. The one rule: exactly one outcome occurs every time the experiment is run. So the outcomes must be mutually exclusive (two different outcomes cannot both happen) and collectively exhaustive (at least one of them must happen).",
      "A gallery of sample spaces. One coin toss: {H, T}, finite with |Ω| = 2. Two dice, ordered: {1, …, 6}², finite with |Ω| = 36. Toss until the first head: {1, 2, 3, …} ∪ {∞}, where ∞ means “never”, countably infinite. An infinite sequence of tosses: {0, 1}^ℕ, uncountable. A spinner angle: [0, 2π), uncountable. Tomorrow’s closing price: (0, ∞), or a tick grid {0.01, 0.02, …}, a modelling choice. A whole price path on [0, T]: the continuous functions C[0, T], a function space.",
      "Countable versus uncountable. A set is countable if it is finite or can be listed as a sequence x₁, x₂, x₃, … (so ℕ, ℤ and ℚ are countable). It is uncountable otherwise: Cantor’s diagonal argument shows that [0, 1] and {0, 1}^ℕ are uncountable, because the binary expansion 0.b₁b₂b₃… identifies an infinite coin-toss sequence with a point of [0, 1]. This distinction decides whether probabilities can be assigned by adding up point masses (countable Ω) or need integration (uncountable Ω).",
      "Choosing Ω is modelling, not truth. A sample space must be fine enough to express every question you will ask. For two dice, Ω = {same, different} is a legitimate sample space, but it cannot answer “is the sum 7?”. Rule of thumb: record the most detailed description you might need. You can always coarsen later by grouping outcomes into events, but you can never refine.",
      "Quant lens. Whether a price is modelled on a tick grid (discrete Ω) or on (0, ∞) (continuous Ω) changes the mathematics. On a grid, “the price is exactly 100.00” has positive probability. On (0, ∞) it has probability 0, and one asks about intervals, hitting times and densities instead. Both are standard, and knowing which you are in is the first step of any model.",
    ],
    formulas: [
      { label: "The one rule", text: "exactly one outcome ω ∈ Ω occurs: outcomes are mutually exclusive and exhaustive" },
    ],
  },

  "events-operations": {
    body: [
      "Definition (§1.2). An event is a subset A ⊆ Ω (subject to the technical condition in the set-theory lesson). We say A occurs if the realised outcome ω lies in A. A singleton {ω} is an elementary event, Ω is the sure event, and ∅ is the impossible event. Because events are sets, the algebra of sets is the algebra of “and / or / not”.",
      "Dictionary of words, sets and indicators. The indicator of A is 1_A(ω) = 1 if ω ∈ A and 0 otherwise. “A or B (or both)” is A ∪ B, with indicator max(1_A, 1_B). “A and B both” is A ∩ B, with indicator 1_A · 1_B. “Not A” is Aᶜ, with indicator 1 − 1_A. “A but not B” is A \\ B = A ∩ Bᶜ, with indicator 1_A(1 − 1_B). “Exactly one of A, B” is the symmetric difference A △ B = (A \\ B) ∪ (B \\ A), with indicator |1_A − 1_B|.",
      "More of the dictionary. “A implies B” is A ⊆ B, i.e. 1_A ≤ 1_B. “A and B cannot both occur” is A ∩ B = ∅, i.e. 1_A · 1_B = 0. “At least one of A₁, …, Aₙ” is ⋃Aᵢ, with indicator 1 − ∏(1 − 1_(Aᵢ)). “All of A₁, …, Aₙ” is ⋂Aᵢ, with indicator ∏ 1_(Aᵢ).",
      "Indicator calculus (Proposition 1.2.2). For events A, B, A₁, …, Aₙ: 1_(Aᶜ) = 1 − 1_A, 1_(A∩B) = 1_A 1_B, 1_(A∪B) = 1_A + 1_B − 1_A 1_B, and 1_(⋃Aᵢ) = 1 − ∏(1 − 1_(Aᵢ)). Also 1_(A△B) = |1_A − 1_B| ≡ 1_A + 1_B (mod 2). Proof: check pointwise at a fixed ω, since each side is 0 or 1. For the union formula, ω ∉ ⋃Aᵢ iff ω ∉ Aᵢ for all i iff ∏(1 − 1_(Aᵢ)(ω)) = 1.",
      "Quant lens. Indicators turn set identities into algebra and, later, probability into expectation: P(A) = E[1_A]. Expanding 1 − ∏(1 − 1_(Aᵢ)) and taking expectations gives inclusion–exclusion in one line. Whenever a counting or probability argument looks messy, ask: “can I write the quantity as a sum of indicators?”",
    ],
    formulas: [
      { label: "Exactly one of A, B (symmetric difference)", text: "A △ B = (A \\ B) ∪ (B \\ A),  1_(A△B) = |1_A − 1_B|" },
      { label: "Indicator of a union", text: "1_(A∪B) = 1_A + 1_B − 1_A 1_B" },
      { label: "At least one of n events", text: "1_(⋃Aᵢ) = 1 − ∏ᵢ (1 − 1_(Aᵢ))" },
      { label: "Probability as expectation", text: "P(A) = E[1_A]" },
    ],
  },

  "set-theory": {
    body: [
      "The laws (§1.3.1). For any events A, B, C. Commutative: A ∪ B = B ∪ A and A ∩ B = B ∩ A. Associative: (A ∪ B) ∪ C = A ∪ (B ∪ C), and the same for ∩. Distributive: A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C) and A ∪ (B ∩ C) = (A ∪ B) ∩ (A ∪ C). Idempotent: A ∪ A = A and A ∩ A = A. Identity and domination: A ∪ ∅ = A, A ∩ Ω = A, A ∪ Ω = Ω, A ∩ ∅ = ∅.",
      "More laws. Complement: A ∪ Aᶜ = Ω, A ∩ Aᶜ = ∅, (Aᶜ)ᶜ = A. Absorption: A ∪ (A ∩ B) = A and A ∩ (A ∪ B) = A. Splitting: A = (A ∩ B) ⊔ (A \\ B), where ⊔ means a disjoint union. De Morgan: (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ and (A ∩ B)ᶜ = Aᶜ ∪ Bᶜ, which has its own lesson.",
      "How to prove a set identity (element chasing). To show X = Y, show ω ∈ X ⇔ ω ∈ Y using logic. Example: ω ∈ A ∩ (B ∪ C) ⇔ ω ∈ A and (ω ∈ B or ω ∈ C) ⇔ (ω ∈ A and ω ∈ B) or (ω ∈ A and ω ∈ C) ⇔ ω ∈ (A ∩ B) ∪ (A ∩ C). The second distributive law follows the same way, swapping “and” with “or”. Alternatively, compare indicator functions.",
      "Countable operations. For a sequence A₁, A₂, …: ⋃ᵢ Aᵢ = {ω : ω ∈ Aᵢ for some i} and ⋂ᵢ Aᵢ = {ω : ω ∈ Aᵢ for every i}.",
      "Which subsets are events? σ-algebras (§1.3.2). If Ω is finite or countable, every subset is an event and nothing subtle happens. If Ω is uncountable (for example [0, 1]) it is a theorem (Vitali, 1905) that there is no way to assign a probability to every subset so that probabilities are countably additive, translation-invariant and normalised. So we declare which sets are “measurable”.",
      "Definition (σ-algebra, or event space). A collection F of subsets of Ω is a σ-algebra if (i) Ω ∈ F; (ii) A ∈ F implies Aᶜ ∈ F (closed under complements); (iii) A₁, A₂, … ∈ F implies ⋃Aᵢ ∈ F (closed under countable unions). The members of F are the events.",
      "Consequences (Proposition 1.3.2). If F is a σ-algebra then ∅ ∈ F, and F is closed under finite unions, finite and countable intersections, and differences A \\ B. Proof: ∅ = Ωᶜ ∈ F. Finite unions: pad A₁, …, Aₙ with ∅, ∅, … in (iii). Countable intersections: ⋂Aᵢ = (⋃Aᵢᶜ)ᶜ by De Morgan. Differences: A \\ B = A ∩ Bᶜ.",
      "Standard σ-algebras. Trivial: {∅, Ω} (no information). Power set 2^Ω (full information). {∅, A, Aᶜ, Ω}: the smallest σ-algebra containing A. Borel σ-algebra B(ℝ): the smallest σ-algebra containing all intervals. It contains open sets, closed sets, countable sets and countable unions of intervals. It is far smaller than 2^ℝ but contains every set you will ever meet in practice.",
      "A σ-algebra is a state of knowledge. Take Ω = {1, 2, 3, 4} and F = {∅, {1, 2}, {3, 4}, Ω}. This is the σ-algebra of someone who is told only whether the outcome is ≤ 2. They can speak about {1, 2} but not about {1}. Conditional expectation and stochastic calculus use exactly this idea: a filtration F_t is the information available by time t.",
      "Working rule. Every set we write down is assumed to be an event. For countable Ω this is automatic. For uncountable Ω it is true of every set built from intervals by countable operations.",
    ],
    formulas: [
      { label: "Splitting an event", text: "A = (A ∩ B) ⊔ (A \\ B)" },
      { label: "σ-algebra axioms", text: "Ω ∈ F;  A ∈ F ⟹ Aᶜ ∈ F;  A₁, A₂, … ∈ F ⟹ ⋃ Aᵢ ∈ F" },
      { label: "Smallest σ-algebra containing A", text: "{∅, A, Aᶜ, Ω}" },
    ],
  },

  "mutually-exclusive": {
    body: [
      "Definition (§1.4). Events A and B are mutually exclusive (disjoint) if A ∩ B = ∅, meaning they cannot both occur. A family {Aᵢ} is pairwise disjoint if Aᵢ ∩ Aⱼ = ∅ for all i ≠ j.",
      "Pairwise disjoint is not “jointly empty”. Let Ω = {1, 2, 3}, A = {1, 2}, B = {2, 3}, C = {1, 3}. Then A ∩ B ∩ C = ∅ (no outcome lies in all three), yet no two of them are disjoint. “Mutually exclusive” for several events always means pairwise disjoint. The same trap reappears later for independence.",
      "Disjoint events are the ones whose probabilities simply add. The key technique for reducing any union to a disjoint union is disjointification (Proposition 1.4.2). Given any events A₁, A₂, …, define B₁ = A₁ and Bₙ = Aₙ ∩ A₁ᶜ ∩ ⋯ ∩ Aₙ₋₁ᶜ for n ≥ 2. Then (a) the Bₙ are pairwise disjoint; (b) Bₙ ⊆ Aₙ; (c) ⋃ over k ≤ n of Bₖ = ⋃ over k ≤ n of Aₖ for every n, and ⋃ over k ≥ 1 of Bₖ = ⋃ over k ≥ 1 of Aₖ.",
      "Proof. (b) is clear. (a) For m < n: Bₘ ⊆ Aₘ while Bₙ ⊆ Aₘᶜ, so Bₘ ∩ Bₙ = ∅. (c) “⊆” follows from (b). For “⊇”, take ω in the union of the Aₖ with k ≤ n and let j ≤ n be the smallest index with ω ∈ Aⱼ. Then ω ∈ Aⱼ and ω ∉ A₁, …, Aⱼ₋₁, i.e. ω ∈ Bⱼ. The infinite case is identical.",
      "Intuition. Bₙ is the event “Aₙ is the first of the events to occur”. Every outcome in the union has exactly one “first” event, which is why the Bₙ tile the union without overlap. This “first time something happens” decomposition reappears constantly (first passage, stopping times, ruin).",
    ],
    formulas: [
      { label: "Pairwise disjoint family", text: "Aᵢ ∩ Aⱼ = ∅ for all i ≠ j" },
      { label: "Disjointification", text: "B₁ = A₁,  Bₙ = Aₙ ∩ A₁ᶜ ∩ ··· ∩ Aₙ₋₁ᶜ,  ⋃ Bₖ = ⋃ Aₖ" },
    ],
  },

  "exhaustive-partitions": {
    body: [
      "Definition (§1.5). Events A₁, A₂, … are exhaustive if ⋃Aᵢ = Ω (at least one occurs). They form a partition of Ω if they are exhaustive and pairwise disjoint, so exactly one occurs.",
      "The four possibilities, illustrated with one die roll. Disjoint and exhaustive (a partition): {1, 2}, {3, 4}, {5, 6}. Exhaustive but not disjoint: {1, 2, 3, 4}, {3, 4, 5, 6}. Disjoint but not exhaustive: {1}, {2}. Neither: {1, 2}, {2, 3}.",
      "Decomposition along a partition (Proposition 1.5.2). If {Aᵢ} is a partition and B is any event, then B = ⋃ᵢ (B ∩ Aᵢ), a disjoint union. Proof: B = B ∩ Ω = B ∩ ⋃Aᵢ = ⋃(B ∩ Aᵢ) by distributivity. The pieces are disjoint because (B ∩ Aᵢ) ∩ (B ∩ Aⱼ) ⊆ Aᵢ ∩ Aⱼ = ∅.",
      "This proposition is the engine behind the law of total probability: to compute P(B), split Ω into cases Aᵢ and add P(B ∩ Aᵢ). Typical partitions: {A, Aᶜ}; {X = k} for a discrete variable X; “first die shows 1, …, 6”; “the number of rolls needed is 1, 2, 3, …”.",
      "Quant lens. Scenario analysis is a partition: {market up, flat, down}, {default, no default}, {regime 1, regime 2}. If your scenarios overlap (not disjoint) or leave a gap (not exhaustive), probabilities will not sum to 1 and every downstream expectation is wrong.",
    ],
    formulas: [
      { label: "Decomposition along a partition", text: "B = (B ∩ A₁) ⊔ (B ∩ A₂) ⊔ ··· ⊔ (B ∩ Aₙ)" },
    ],
  },

  "axioms": {
    body: [
      "Where the axioms come from (§1.6.1). Three viewpoints agree on the rules even though they disagree on the meaning. Classical: probability is a ratio of favourable to possible cases. Frequentist: probability is the long-run relative frequency. Subjective: probability is a coherent degree of belief (betting odds). The relative frequency of A in n trials, fₙ(A) = Nₙ(A)/n, already obeys fₙ(A) ≥ 0, fₙ(Ω) = 1, and fₙ(A ∪ B) = fₙ(A) + fₙ(B) if A ∩ B = ∅. Kolmogorov (1933) turned these into the definition, strengthening the last rule to countably many events so that limits can be handled.",
      "Definition (probability space). A probability space is a triple (Ω, F, P): a sample space Ω, a σ-algebra F of events, and a function P : F → ℝ such that (A1) non-negativity: P(A) ≥ 0 for every A ∈ F; (A2) normalisation: P(Ω) = 1; (A3) countable additivity: if A₁, A₂, … ∈ F are pairwise disjoint, then P(⋃Aᵢ) = Σ P(Aᵢ).",
      "Why countable additivity? Finite additivity alone is too weak to talk about limits. It cannot rule out strange “probabilities” like a uniform distribution on ℕ, and it does not make P(lim Aₙ) = lim P(Aₙ). Countable additivity is exactly what is needed to make this work, and it is what makes the infinite sums that dominate later chapters (geometric, Poisson, first-passage times) legitimate.",
      "Two ways to build probability spaces (§1.6.2). Discrete case: let Ω = {ω₁, ω₂, …} be countable and choose a mass function p(ω) ≥ 0 with Σ p(ω) = 1. Define P(A) = Σ over ω ∈ A of p(ω) for all A ⊆ Ω. Proposition 1.6.2: this P satisfies (A1)–(A3) on F = 2^Ω. Proof: (A1) and (A2) are immediate. For (A3), the series has non-negative terms, so it may be summed in any order. If A₁, A₂, … are disjoint, summing p(ω) over ω ∈ ⋃Aᵢ equals summing first over each Aᵢ and then over i.",
      "Continuous case (geometric probability). If Ω ⊆ ℝᵈ has finite positive volume, “a point chosen uniformly at random” means P(A) = vol(A)/vol(Ω). For Ω = [0, 1]: P([a, b]) = b − a. That this extends to all Borel sets is Carathéodory’s extension theorem, which we use without proof.",
      "Probability 0 is not impossible, and probability 1 is not certain. For the uniform law on [0, 1], P({x}) = 0 for every single x, yet some x occurs. The uncountable union ⋃ₓ {x} = [0, 1] has probability 1, while each term has probability 0. There is no contradiction because (A3) concerns only countable unions. An event with P(A) = 1 is said to occur almost surely (a.s.), and one with P(A) = 0 is null.",
    ],
    formulas: [
      { label: "(A1) Non-negativity", text: "P(A) ≥ 0" },
      { label: "(A2) Normalisation", text: "P(Ω) = 1" },
      { label: "(A3) Countable additivity", text: "A₁, A₂, … pairwise disjoint ⟹ P(⋃ Aᵢ) = Σ P(Aᵢ)" },
      { label: "Discrete probability from a mass function", text: "P(A) = Σ_(ω ∈ A) p(ω),  Σ_ω p(ω) = 1" },
    ],
  },

  "properties": {
    body: [
      "Theorem 1.7.1 (elementary properties). Everything below is derived only from (A1)–(A3), so learn the proof patterns: they are used all the time. For events A, B, A₁, A₂, … in a probability space: (a) P(∅) = 0. (b) Finite additivity: if A₁, …, Aₙ are pairwise disjoint, P(⋃Aᵢ) = ΣP(Aᵢ). (c) Complement rule: P(Aᶜ) = 1 − P(A); in particular P(A) ≤ 1. (d) Monotonicity: if A ⊆ B then P(B \\ A) = P(B) − P(A), and hence P(A) ≤ P(B). (e) Two-event inclusion–exclusion: P(A ∪ B) = P(A) + P(B) − P(A ∩ B). (f) Boole’s inequality (the union bound): P(⋃Aᵢ) ≤ ΣP(Aᵢ), with no disjointness needed; the same holds for finite unions.",
      "Proofs. (a) Apply (A3) with Aᵢ = ∅ for all i (these are pairwise disjoint): P(∅) = Σ P(∅). A real number c ≥ 0 with c = ∞ · c must be 0. (b) Take Aᵢ = ∅ for i > n in (A3) and use (a). (c) Ω = A ⊔ Aᶜ, so 1 = P(A) + P(Aᶜ) by (b) and (A2). Then P(A) = 1 − P(Aᶜ) ≤ 1 by (A1). (d) B = A ⊔ (B \\ A), so P(B) = P(A) + P(B \\ A), and P(B \\ A) ≥ 0.",
      "More proofs. (e) A ∪ B = A ⊔ (B \\ A) and B = (B \\ A) ⊔ (A ∩ B). Hence P(A ∪ B) = P(A) + P(B \\ A) and P(B \\ A) = P(B) − P(A ∩ B). Substitute. (f) Disjointify: P(⋃Aᵢ) = P(⋃Bᵢ) = ΣP(Bᵢ) ≤ ΣP(Aᵢ), because Bᵢ ⊆ Aᵢ and (d).",
      "Theorem 1.7.2 (inclusion–exclusion and Bonferroni). For any events A₁, …, Aₙ: P(⋃Aᵢ) = Σ from k = 1 to n of (−1)^(k+1) Σ over i₁ < ⋯ < iₖ of P(Aᵢ₁ ∩ ⋯ ∩ Aᵢₖ). Truncating after an odd number of terms gives an upper bound, and after an even number a lower bound (the Bonferroni inequalities). For n = 3: P(A ∪ B ∪ C) = P(A) + P(B) + P(C) − P(A ∩ B) − P(A ∩ C) − P(B ∩ C) + P(A ∩ B ∩ C).",
      "Proposition 1.7.3 (Bonferroni lower bound, and almost-sure closure). (a) P(⋂Aᵢ) ≥ 1 − ΣP(Aᵢᶜ). In particular P(A ∩ B) ≥ P(A) + P(B) − 1. (b) A countable union of null events is null. A countable intersection of probability-one events has probability one. Proof: (a) P(⋂Aᵢ) = 1 − P((⋂Aᵢ)ᶜ) = 1 − P(⋃Aᵢᶜ) ≥ 1 − ΣP(Aᵢᶜ) by De Morgan, the complement rule and the union bound. (b) If P(Nᵢ) = 0 for all i, then 0 ≤ P(⋃Nᵢ) ≤ Σ 0 = 0. Apply this to complements for the second statement.",
      "Quant lens. The union bound is the Bonferroni correction. If you test m strategies each at false-positive rate α, then P(at least one false positive) ≤ mα, whatever the dependence between tests. That is why a backtest that “wins” after trying 200 variants proves little. Likewise P(any of N counterparties defaults) ≤ Σ P(default of i) is the cheapest credit-risk bound, valid with no correlation assumptions at all.",
    ],
    formulas: [
      { label: "Impossible event", text: "P(∅) = 0" },
      { label: "Finite additivity", text: "A₁, …, Aₙ pairwise disjoint ⟹ P(⋃ Aᵢ) = Σ P(Aᵢ)" },
      { label: "Difference", text: "A ⊆ B ⟹ P(B \\ A) = P(B) − P(A)" },
      { label: "Union bound (Boole)", text: "P(⋃ Aᵢ) ≤ Σ P(Aᵢ)" },
      { label: "Three-event inclusion–exclusion", text: "P(A ∪ B ∪ C) = ΣP(single) − ΣP(pairs) + P(A ∩ B ∩ C)" },
      { label: "Bonferroni lower bounds", text: "P(⋂ Aᵢ) ≥ 1 − Σ P(Aᵢᶜ),  P(A ∩ B) ≥ P(A) + P(B) − 1" },
      { label: "Symmetric difference", text: "P(A △ B) = P(A) + P(B) − 2P(A ∩ B)" },
    ],
  },

  "equally-likely": {
    body: [
      "Theorem 1.8.1 (classical probability). Let Ω be finite and suppose all outcomes are equally likely. Then P({ω}) = 1/|Ω| and, for every event A, P(A) = |A|/|Ω| = (number of favourable outcomes)/(number of possible outcomes). Proof: if p = P({ω}) is the same for every ω, then 1 = P(Ω) = Σ p = |Ω| p by finite additivity, so p = 1/|Ω|. Then P(A) = Σ over ω ∈ A of p = |A|/|Ω|.",
      "When is “equally likely” justified? By symmetry: a fair coin, a well-shuffled deck, a fair die, a uniformly chosen committee. The theorem says nothing about whether a model is equally likely. That is an assumption about the physical or logical situation.",
      "The fine print: choose Ω so that outcomes really are symmetric. Two dice, sum ∈ {2, …, 12}: these 11 sums are not equally likely. The 36 ordered pairs are, and P(sum = 7) = 6/36 while P(sum = 12) = 1/36 (Leibniz’s error). Two fair coins: P(two heads) = 1/4, not 1/3 for “0, 1 or 2 heads”. Treat the coins as labelled: {HH, HT, TH, TT} (d’Alembert’s error).",
      "Trick: even when objects are physically identical, label them to restore symmetry, count, and ignore the labels at the end.",
      "On an infinite Ω there is no uniform distribution over countably many points. On an uncountable Ω, “uniformly at random” is ambiguous unless the parametrisation is stated (Bertrand’s paradox, in the geometric probability lesson).",
    ],
    formulas: [
      { label: "Probability of one outcome", text: "P({ω}) = 1 / |Ω|" },
    ],
  },

  "probability-counting": {
    body: [
      "Theorem 1.9.1 (basic counting principles). (a) Rule of product: a procedure with k successive stages offering n₁, …, nₖ choices (the number of options at each stage not depending on earlier choices) has n₁ n₂ ⋯ nₖ outcomes. (b) Ordered selection of k from n: nᵏ with replacement; n(n − 1)⋯(n − k + 1) = n!/(n − k)! without replacement. In particular n! arrangements of n objects. (c) Unordered selection (combinations): C(n, k) = n!/(k!(n − k)!) subsets of size k from n.",
      "Recipe for a counting probability. Step 1: choose Ω so that outcomes are equally likely (label everything if in doubt). Step 2: count |Ω|. Step 3: count |A| using the same labelling (if Ω is ordered, A must be counted as ordered; if unordered, unordered). Step 4: divide. Sanity-check: 0 ≤ P ≤ 1, and symmetric cases agree.",
    ],
    formulas: [
      { label: "Rule of product", text: "n₁ n₂ ··· nₖ" },
      { label: "Ordered, without replacement", text: "n! / (n − k)!" },
      { label: "Unordered selection", text: "C(n, k) = n! / (k!(n − k)!)" },
    ],
    examples: [
      {
        title: "Four-digit PIN with distinct digits",
        problem: "A PIN has 4 digits, each from 0 to 9, chosen uniformly. What is the probability that all four digits are different?",
        steps: [
          "Ω = {0, …, 9}⁴, so |Ω| = 10⁴.",
          "Favourable: 10 · 9 · 8 · 7 = 5040.",
          "P = 5040/10000 = 0.504.",
        ],
      },
      {
        title: "Cards",
        problem: "Draw 5 cards from a standard 52-card deck (unordered). Find P(four of a kind) and P(all hearts).",
        steps: [
          "|Ω| = C(52, 5) = 2,598,960.",
          "Four of a kind: choose the rank (13) and the fifth card (48): 13 · 48 = 624, so P = 624/2,598,960 = 1/4165.",
          "All hearts: C(13, 5)/C(52, 5) = 1287/2,598,960 ≈ 0.000495.",
        ],
      },
      {
        title: "Urn without replacement",
        problem: "An urn has 5 red and 4 blue balls; draw 3. Find P(2 red, 1 blue).",
        steps: [
          "Unordered samples: |Ω| = C(9, 3) = 84.",
          "Favourable: C(5, 2) · C(4, 1) = 10 · 4 = 40.",
          "P = 40/84 = 10/21.",
        ],
      },
      {
        title: "Labelling restores symmetry",
        problem: "Roll 6 fair dice. Find P(all faces different).",
        steps: [
          "Count ordered outcomes: |Ω| = 6⁶ = 46,656, since the dice are distinguishable by position.",
          "Favourable: 6! = 720.",
          "P = 720/46,656 = 5/324 ≈ 0.0154.",
        ],
      },
      {
        title: "Committee membership",
        problem: "A committee of size k is chosen uniformly from n people. For two fixed people, find P(both are on the committee).",
        steps: [
          "|Ω| = C(n, k). Favourable: choose the other k − 2 members from the remaining n − 2 people: C(n − 2, k − 2).",
          "P = C(n − 2, k − 2)/C(n, k) = k(k − 1)/(n(n − 1)).",
        ],
      },
    ],
  },

  "de-morgan": {
    body: [
      "Theorem 1.10.1 (De Morgan’s laws). For any family of events {Aᵢ} (finite, countable or arbitrary): (⋃Aᵢ)ᶜ = ⋂Aᵢᶜ and (⋂Aᵢ)ᶜ = ⋃Aᵢᶜ. In words: not (at least one) = none; not (all) = at least one fails.",
      "Proof. ω ∈ (⋃Aᵢ)ᶜ ⇔ ω ∉ Aᵢ for every i ⇔ ω ∈ Aᵢᶜ for every i ⇔ ω ∈ ⋂Aᵢᶜ. For the second law apply the first to the events Aᵢᶜ and take complements: (⋃Aᵢᶜ)ᶜ = ⋂Aᵢ, hence ⋃Aᵢᶜ = (⋂Aᵢ)ᶜ.",
      "Probabilistic corollaries. P(none of A₁, …, Aₙ) = 1 − P(⋃Aᵢ), and P(not all of A₁, …, Aₙ) = 1 − P(⋂Aᵢ).",
      "The complement trick. “At least one” is a union and is usually messy (overlaps!). Its complement “none” is an intersection and is usually clean. Whenever you see “at least one”, compute “none” and subtract from 1.",
    ],
    formulas: [
      { label: "Infinite or finite families", text: "(⋃ Aᵢ)ᶜ = ⋂ Aᵢᶜ,  (⋂ Aᵢ)ᶜ = ⋃ Aᵢᶜ" },
      { label: "The complement trick", text: "P(at least one) = 1 − P(none)" },
    ],
    examples: [
      {
        title: "The Chevalier de Méré",
        problem: "(i) Four rolls of one die: find P(at least one six). (ii) 24 rolls of a pair of dice: find P(at least one double six).",
        steps: [
          "(i) The complement “no six in 4 rolls” has 5⁴ of 6⁴ equally likely outcomes, so P = 1 − (5/6)⁴ = 671/1296 ≈ 0.5177.",
          "(ii) P = 1 − (35/36)²⁴ ≈ 0.4914.",
          "The first is a favourable bet, the second a slightly unfavourable one, a distinction that famously could not be made by intuition alone.",
        ],
      },
    ],
  },

  "continuity": {
    body: [
      "Definition (§1.11, monotone sequences of events). Aₙ ↑ A means A₁ ⊆ A₂ ⊆ ⋯ and A = ⋃Aₙ. Aₙ ↓ A means A₁ ⊇ A₂ ⊇ ⋯ and A = ⋂Aₙ.",
      "Theorem 1.11.2 (continuity of probability). (i) If Aₙ ↑ A, then P(Aₙ) ↑ P(A), i.e. P(⋃Aₙ) = lim P(Aₙ). (ii) If Aₙ ↓ A, then P(Aₙ) ↓ P(A), i.e. P(⋂Aₙ) = lim P(Aₙ).",
      "Proof. (i) Set B₁ = A₁ and Bₙ = Aₙ \\ Aₙ₋₁. These are disjoint, Aₙ = ⋃ over k ≤ n of Bₖ, and A = ⋃ over k ≥ 1 of Bₖ. By (A3), P(A) = Σ P(Bₖ) = lim over n of Σ over k ≤ n of P(Bₖ) = lim P(Aₙ). (ii) If Aₙ ↓ A then Aₙᶜ ↑ Aᶜ (De Morgan). By (i), P(Aₙᶜ) → P(Aᶜ), i.e. 1 − P(Aₙ) → 1 − P(A).",
      "Picture: increasing events fill up their union, and their probabilities increase to the probability of the union.",
      "Theorem 1.11.3 (continuity ⇔ countable additivity). Let P be finitely additive with P(Ω) = 1. Then P is countably additive if and only if Aₙ ↓ ∅ implies P(Aₙ) → 0. Proof. (⇒) is Theorem 1.11.2(ii) with A = ∅. (⇐) Let E₁, E₂, … be disjoint and Aₙ = ⋃ over i > n of Eᵢ ↓ ∅. By finite additivity, P(⋃Eᵢ) = Σ over i ≤ n of P(Eᵢ) + P(Aₙ). Let n → ∞: P(Aₙ) → 0, giving P(⋃Eᵢ) = Σ P(Eᵢ).",
      "So countable additivity is equivalent to “probabilities of shrinking-to-nothing events shrink to 0”: a statement you can verify in practice.",
      "Quant lens. Continuity from above and below is what lets you pass from “for each finite horizon” to “over the whole infinite horizon”. Ruin probabilities, hitting probabilities and the almost-sure statements in laws of large numbers are all limits of finite-horizon probabilities.",
    ],
    formulas: [
      { label: "Continuity from below", text: "Aₙ ↑ A ⟹ P(Aₙ) ↑ P(A) = P(⋃ Aₙ)" },
      { label: "Continuity from above", text: "Aₙ ↓ A ⟹ P(Aₙ) ↓ P(A) = P(⋂ Aₙ)" },
      { label: "Countable additivity ⇔ continuity at ∅", text: "Aₙ ↓ ∅ ⟹ P(Aₙ) → 0" },
    ],
  },
};

// Two lessons that the chapter needs but the earlier rank 09 files did not contain.
export const geometricProbability: Lesson = {
  id: "geometric-probability", rank: 9, title: "Geometric Probability", minutes: 12,
  description: "Choose a point at random and measure length, area or volume.",
  objective: "Compute probabilities as ratios of lengths or areas, and see why “at random” must be specified.",
  body: [
    "When the sample space is a region of the line, plane or space with finite positive size, “a point chosen uniformly at random” means that the probability of an event is the size of its region divided by the size of the whole: P(A) = vol(A)/vol(Ω). On Ω = [0, 1] this gives P([a, b]) = b − a. That this definition extends to every Borel set is Carathéodory’s extension theorem, which we use without proof.",
    "The method is always the same. Sketch Ω and the region that makes the event happen, then compare areas (or lengths). Choose the integration variable that makes the boundary of the region a function, and use the complement when it is simpler.",
    "A single point has size 0, so P({x}) = 0 for every x, yet some point does occur. Probability 0 is not impossibility. Countable additivity does not extend to arbitrary uncountable unions: [0, 1] is the uncountable union of its singleton sets, each of probability 0, but the interval has probability 1.",
    "Bertrand’s paradox. On an uncountable sample space, “uniformly at random” is ambiguous unless you specify the random experiment. For a circle of radius R, a chord is longer than the inscribed equilateral-triangle side exactly when its midpoint is within distance R/2 of the centre. Choosing two independent uniform endpoints on the circumference gives probability 1/3; choosing the chord's distance from the centre uniformly on [0,R] gives 1/2; choosing its midpoint uniformly by area in the disk gives 1/4. These are different probability measures on chords, not contradictory answers.",
    "Buffon’s needle. Drop a needle of length ℓ onto parallel lines separated by distance d, with 0 < ℓ ≤ d. If its angle θ is uniform on [0,π/2] and its centre is uniform relative to the nearest line, then it crosses a line with probability 2ℓ/(πd). Conditional on θ, the centre must lie within (ℓ/2)sin θ of a line; averaging that conditional probability over θ gives the formula. This is a geometric probability model whose answer depends on the stated random-drop mechanism.",
    "A geometric probability calculation can also be an integral rather than a simple area ratio. If (X,Y) is uniform on a region and the event boundary is curved, integrate the cross-sectional length or area. Check the support and Jacobian if you change coordinates; a uniform point in one coordinate system need not remain uniform after a nonlinear transformation.",
    "Quant lens. “A random portfolio”, “a random correlation matrix” and “a random direction” are all ambiguous until the probability measure is specified. Writing down which coordinates are uniform is part of the model.",
  ],
  formulas: [
    { label: "Uniform law on a region", text: "P(A) = vol(A) / vol(Ω)" },
    { label: "Uniform law on [0, 1]", text: "P([a, b]) = b − a,  P({x}) = 0" },
    { label: "Buffon needle (ℓ ≤ d)", text: "P(needle crosses a line) = 2ℓ / (πd)" },
    { label: "Two independent uniform points", text: "P(|X − Y| ≤ a) = 2a − a²,  0 ≤ a ≤ 1" },
  ],
  examples: [
    {
      title: "A first geometric probability",
      problem: "A point (X, Y) is chosen uniformly in the unit square. Find P(X + Y < 1/2).",
      steps: [
        "The region X + Y < 1/2 inside the square is a right triangle with legs 1/2.",
        "Its area is (1/2)(1/2)(1/2) = 1/8.",
        "The square has area 1, so the probability is 1/8.",
      ],
    },
    {
      title: "Distance between two random points",
      problem: "Let X and Y be independent Uniform(0,1) points. Find P(|X − Y| ≤ 1/2).",
      steps: [
        "The sample space is the unit square in the (x,y)-plane, with total area 1.",
        "The event |x−y|≤1/2 is the central band between y=x−1/2 and y=x+1/2. Its complement consists of two right triangles, each with legs 1/2.",
        "The excluded area is 2 × (1/2)(1/2)(1/2)=1/4. Hence the required probability is 1−1/4=3/4.",
      ],
    },
    {
      title: "Buffon’s needle and π",
      problem: "A needle of length 2 cm is dropped onto parallel lines 5 cm apart, under the standard uniform-angle and uniform-position model. Find the probability it crosses a line.",
      steps: [
        "Here ℓ=2 cm and d=5 cm, so the condition ℓ≤d is satisfied.",
        "Use P(crossing)=2ℓ/(πd)=4/(5π).",
        "Numerically, the probability is approximately 0.2546. The result depends on the stated random-drop model.",
      ],
    },
  ],
  quiz: [
    { question: "A point is chosen uniformly in the unit square. What is the probability it lies in the triangle x≥0, y≥0, x+y≤1/2?", options: ["1/4", "1/8", "1/2", "1/16"], answer: 1, difficulty: "easy", explanation: "The triangle has legs 1/2, so its area is (1/2)(1/2)(1/2)=1/8 of the unit-square area." },
    { question: "For a Buffon needle of length ℓ≤d under the standard uniform-drop model, the crossing probability is", options: ["ℓ/d", "2ℓ/(πd)", "πℓ/(2d)", "ℓ²/d²"], answer: 1, difficulty: "medium", explanation: "Averaging the conditional crossing probability (ℓ/d)sin θ over θ uniform on [0,π/2] gives 2ℓ/(πd)." },
    { question: "Why can Bertrand’s chord problem produce different probabilities for the same geometric property?", options: ["Circle area is not well-defined", "The chord length is random only in discrete models", "Different procedures induce different probability measures on chords", "All uniform distributions on a circle are identical"], answer: 2, difficulty: "hard", explanation: "Uniform endpoints, uniform radial distance and uniform midpoint-by-area are different random experiments and therefore induce different distributions on chords." },
  ],
};

export const borelCantelli: Lesson = {
  id: "borel-cantelli", rank: 2, title: "Limsup, Liminf & Borel–Cantelli", minutes: 14,
  description: "Events that happen infinitely often, and when that has probability 0.",
  objective: "Interpret lim sup and lim inf, prove and apply both Borel–Cantelli lemmas, and identify exactly where independence is required.",
  body: [
    "For arbitrary events A₁, A₂, … define lim sup Aₙ = ⋂ over n of ⋃ over k ≥ n of Aₖ, and lim inf Aₙ = ⋃ over n of ⋂ over k ≥ n of Aₖ.",
    "Reading them. ω ∈ lim sup Aₙ iff for every n there is a k ≥ n with ω ∈ Aₖ, i.e. ω ∈ Aₖ for infinitely many k. We write {Aₙ i.o.} (“infinitely often”). ω ∈ lim inf Aₙ iff ω ∈ Aₖ for all large k, i.e. for all but finitely many k (“eventually”). By De Morgan, (lim sup Aₙ)ᶜ = lim inf Aₙᶜ, and always lim inf Aₙ ⊆ lim sup Aₙ.",
    "Theorem 1.11.4 (Fatou’s lemma for events). P(lim inf Aₙ) ≤ lim inf P(Aₙ) ≤ lim sup P(Aₙ) ≤ P(lim sup Aₙ). Proof. Let Cₙ = ⋂ over k ≥ n of Aₖ, so Cₙ ↑ lim inf Aₙ and Cₙ ⊆ Aₙ, giving P(Cₙ) ≤ P(Aₙ). By continuity, P(lim inf Aₙ) = lim P(Cₙ) ≤ lim inf P(Aₙ). Similarly Dₙ = ⋃ over k ≥ n of Aₖ ↓ lim sup Aₙ and Dₙ ⊇ Aₙ, so P(lim sup Aₙ) = lim P(Dₙ) ≥ lim sup P(Aₙ). The middle inequality holds for any real sequence.",
    "Theorem 1.11.5 (first Borel–Cantelli lemma). If Σ P(Aₙ) < ∞, then P(Aₙ i.o.) = 0: almost surely only finitely many of the Aₙ occur. Proof. For every n, lim sup Aₖ ⊆ ⋃ over k ≥ n of Aₖ, so by the union bound P(Aₖ i.o.) ≤ Σ over k ≥ n of P(Aₖ). The right side is the tail of a convergent series, so it tends to 0 as n → ∞.",
    "Theorem 1.11.6 (second Borel–Cantelli lemma). If the events Aₙ are mutually independent and ΣP(Aₙ) = ∞, then P(Aₙ i.o.) = 1. For fixed N≤M, independence gives P(no Aₙ occurs for N≤n≤M)=∏(1−P(Aₙ))≤exp(−ΣP(Aₙ)). As M→∞ the right side tends to 0, so the probability that no Aₙ occurs after N is 0. Taking the countable union over N shows that the probability of only finitely many occurrences is 0.",
    "Independence is essential for this converse. If Aₙ=A₁ for every n and P(A₁)=1/2, then ΣP(Aₙ)=∞ but P(Aₙ i.o.)=1/2, not 1. The first lemma needs no independence; the second lemma as stated does.",
    "Together, the two lemmas give a useful test: for independent events, convergence of ΣP(Aₙ) implies only finitely many occurrences almost surely, while divergence implies infinitely many occurrences almost surely.",
    "Quant lens. Borel–Cantelli is the standard way to prove “eventually this never happens again”. Passing from finite horizons to the whole infinite horizon, as in ruin probabilities and laws of large numbers, rests on continuity and these lemmas.",
    "Chapter 1 toolkit. Probability space (Ω, F, P): P ≥ 0, P(Ω) = 1, countably additive. P(Aᶜ) = 1 − P(A); A ⊆ B implies P(A) ≤ P(B); P(B \\ A) = P(B) − P(A ∩ B). P(A ∪ B) = P(A) + P(B) − P(A ∩ B); P(A △ B) = P(A) + P(B) − 2P(A ∩ B). Union bound P(⋃Aᵢ) ≤ ΣP(Aᵢ); Bonferroni P(⋂Aᵢ) ≥ 1 − ΣP(Aᵢᶜ). Equally likely: P(A) = |A|/|Ω| (label objects, count consistently). De Morgan, and “at least one” = 1 − (none). Continuity: Aₙ ↑ A ⇒ P(Aₙ) ↑ P(A); Aₙ ↓ A ⇒ P(Aₙ) ↓ P(A). BC1: ΣP(Aₙ) < ∞ ⇒ P(Aₙ i.o.) = 0; independent BC2: ΣP(Aₙ) = ∞ ⇒ P(Aₙ i.o.) = 1.",
    "Problem-solving checklist. (1) What is Ω? Is it fine enough? Are outcomes equally likely, or must I use a mass function or density? (2) Translate the question into events using “and / or / not”. Is it a union (use the complement or inclusion–exclusion), a disjoint decomposition (partition), or a limit (continuity)? (3) Can I write the quantity as a sum of indicators? (4) Check the answer against bounds: 0 ≤ P ≤ 1, monotonicity, symmetric special cases.",
  ],
  formulas: [
    { label: "Infinitely often (limsup)", text: "lim sup Aₙ = ⋂ₙ ⋃_(k ≥ n) Aₖ = {Aₙ i.o.}" },
    { label: "Eventually always (liminf)", text: "lim inf Aₙ = ⋃ₙ ⋂_(k ≥ n) Aₖ" },
    { label: "Fatou for events", text: "P(lim inf Aₙ) ≤ lim inf P(Aₙ) ≤ lim sup P(Aₙ) ≤ P(lim sup Aₙ)" },
    { label: "First Borel–Cantelli lemma", text: "Σ P(Aₙ) < ∞ ⟹ P(Aₙ i.o.) = 0" },
    { label: "Second Borel–Cantelli lemma", text: "Independent Aₙ and Σ P(Aₙ) = ∞ ⟹ P(Aₙ i.o.) = 1" },
  ],
  examples: [
    {
      title: "Where the sum converges",
      problem: "Events Aₙ satisfy P(Aₙ) = 1/n². Can infinitely many of them occur with positive probability?",
      steps: [
        "Σ 1/n² < ∞, so the first Borel–Cantelli lemma applies. No independence is needed.",
        "Therefore P(Aₙ i.o.) = 0: almost surely only finitely many of the Aₙ occur.",
      ],
    },
    {
      title: "Independent events with a divergent sum",
      problem: "Let Aₙ be independent and P(Aₙ)=1/n for n≥1. What is the probability that infinitely many Aₙ occur?",
      steps: [
        "The harmonic series Σ1/n diverges.",
        "The events are independent, so the second Borel–Cantelli lemma applies.",
        "Thus P(Aₙ i.o.)=1: infinitely many occur almost surely."
      ],
    },
    {
      title: "Why independence matters",
      problem: "Let Aₙ=A₁ for every n, with P(A₁)=1/2. Although ΣP(Aₙ) diverges, find P(Aₙ i.o.).",
      steps: [
        "All events are identical, so either every Aₙ occurs or none occurs.",
        "The event Aₙ i.o. is exactly A₁.",
        "Therefore P(Aₙ i.o.)=1/2. Divergence alone is insufficient for the second lemma without independence."
      ],
    },
  ],
  quiz: [
    { question: "The first Borel–Cantelli lemma says that if ΣP(Aₙ) is finite, then", options: ["Aₙ are independent", "Aₙ occur infinitely often almost surely", "Aₙ occur only finitely often almost surely", "P(Aₙ)=0 for every n"], answer: 2, difficulty: "easy", explanation: "A finite sum of event probabilities forces the probability of infinitely many occurrences to be zero; no independence is needed." },
    { question: "Which additional condition is sufficient for the divergent-sum conclusion P(Aₙ i.o.)=1?", options: ["Pairwise disjointness", "Mutual independence", "Equal event probabilities", "Identical events"], answer: 1, difficulty: "medium", explanation: "The standard second Borel–Cantelli lemma assumes mutual independence and a divergent sum of probabilities." },
    { question: "If Aₙ=A₁ for every n and P(A₁)=1/2, then ΣP(Aₙ) diverges but P(Aₙ i.o.) equals", options: ["0", "1/2", "1", "It is undefined"], answer: 1, difficulty: "hard", explanation: "The events are perfectly dependent and Aₙ i.o. is just A₁. This shows why independence is needed for the divergent-sum converse." }
  ],
};
