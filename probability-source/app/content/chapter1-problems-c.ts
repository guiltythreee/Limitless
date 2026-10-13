import type { Example } from "./types";

// Chapter 1 problem set, part C: geometric probability and Borel–Cantelli.
export const problemsC: Record<string, Example[]> = {
  "geometric-probability": [
    {
      title: "Problem 1.31 · Areas as probabilities ⋆⋆",
      problem: "(X, Y) is uniform on the unit square [0, 1]². Find (a) P(X² + Y² < 1); (b) P(XY < 1/4); (c) P(Y > X²).",
      steps: [
        "Under the uniform law, probability = area.",
        "(a) The region is a quarter of the unit disk: π/4 ≈ 0.785.",
        "(b) For x ≤ 1/4 every y ∈ [0, 1] works (area 1/4). For x ∈ [1/4, 1] we need y < 1/(4x) ≤ 1: the area is the integral of 1/(4x) from 1/4 to 1, which is (1/4) ln 4. Total: 1/4 + (1/4) ln 4 = (1 + ln 4)/4 ≈ 0.5966.",
        "(c) The complement {Y ≤ X²} has area equal to the integral of x² from 0 to 1, which is 1/3. So P(Y > X²) = 2/3.",
        "Key idea: sketch the region first, and choose the integration variable that makes the boundary a function.",
      ],
    },
    {
      title: "Problem 1.32 · Buffon’s needle ⋆⋆⋆",
      problem: "A floor is ruled with parallel lines a distance d apart. A needle of length L ≤ d is dropped at random. Model the drop by the distance x ∈ [0, d/2] from the needle’s centre to the nearest line and the acute angle θ ∈ [0, π/2] between needle and lines, with (x, θ) uniform on this rectangle. Show that P(needle crosses a line) = 2L/(πd).",
      steps: [
        "The sample space is the rectangle Ω = [0, d/2] × [0, π/2], of area πd/4.",
        "The needle’s half-extent perpendicular to the lines is (L/2) sin θ, so it crosses a line iff x ≤ (L/2) sin θ.",
        "This region has area equal to the integral of (L/2) sin θ from 0 to π/2, which is L/2. It lies inside Ω because (L/2) sin θ ≤ L/2 ≤ d/2.",
        "Hence P(cross) = (L/2)/(πd/4) = 2L/(πd).",
        "For L = d this is 2/π ≈ 0.6366, which is how Buffon’s experiment can be used to estimate π by Monte Carlo.",
        "Key idea: choose coordinates (distance, angle) in which “uniformly at random” is a faithful model. Compare Bertrand’s paradox.",
      ],
    },
    {
      title: "Problem 1.33 · Three points on a semicircle ⋆⋆⋆",
      problem: "Three points are chosen independently and uniformly on a circle. Show that the probability that they all lie on some semicircle is 3/4.",
      steps: [
        "Measure angles θ₁, θ₂, θ₃ ∈ [0, 2π). The triple is uniform on [0, 2π)³. For i = 1, 2, 3 let Eᵢ be the event that the other two points lie in the half-circle running counterclockwise from point i (angles in (θᵢ, θᵢ + π) mod 2π).",
        "Probability of one Eᵢ. Given θᵢ, each other point lies in that half-circle with probability π/2π = 1/2, and the two are independent (product of volumes), so P(Eᵢ) = 1/4.",
        "The Eᵢ are disjoint. If Eᵢ and Eⱼ both held, then (θⱼ − θᵢ) mod 2π ∈ (0, π) and (θᵢ − θⱼ) mod 2π ∈ (0, π). But the two residues sum to 2π, which is impossible.",
        "They cover the target event. If the three points lie in a semicircle, take the point i that comes first going counterclockwise through that semicircle. The other two then lie within π counterclockwise of it, i.e. Eᵢ holds. Conversely each Eᵢ puts all three points in a semicircle.",
        "So P(semicircle) = P(E₁ ⊔ E₂ ⊔ E₃) = 3 · 1/4 = 3/4. The same method gives n/2^(n−1) for n points.",
        "Key idea: identify a unique “leader” point so that the pieces do not overlap.",
      ],
    },
    {
      title: "Problem 1.37 · Meetings and broken sticks ⋆⋆",
      problem: "Two numbers (X, Y) are chosen uniformly from the unit square [0, 1]². (a) Two friends arrive independently at uniformly random times in a one-hour window and each waits 15 minutes. Find the probability they meet. (b) A stick of length 1 is broken at two uniformly chosen points (X, Y). Find the probability that the three pieces can form a triangle.",
      steps: [
        "Both parts are geometric probability: P(A) = area(A)/1 for A ⊆ [0, 1]².",
        "(a) Let X, Y ∈ [0, 1] be arrival times in hours. They meet iff |X − Y| < 1/4. The complement |X − Y| ≥ 1/4 consists of two right triangles with legs 3/4, each of area (1/2)(3/4)(3/4) = 9/32. Hence P(meet) = 1 − 2 · 9/32 = 1 − (3/4)² = 7/16 ≈ 0.4375. In general P(|X − Y| < δ) = 1 − (1 − δ)².",
        "(b) Let M = min(X, Y) and M′ = max(X, Y). The pieces have lengths M, M′ − M, 1 − M′. Three lengths summing to 1 form a triangle iff each is less than 1/2. Use the complement trick: the triangle fails iff some piece is ≥ 1/2.",
        "Consider three events. E₁: M ≥ 1/2 (X, Y ≥ 1/2), area 1/4. E₃: 1 − M′ ≥ 1/2 (X, Y ≤ 1/2), area 1/4. E₂: M′ − M ≥ 1/2 (|X − Y| ≥ 1/2), two triangles with legs 1/2, area 2 · 1/8 = 1/4.",
        "Two pieces cannot both be > 1/2, so these events overlap only on a null set, and finite additivity gives P(no triangle) = 1/4 + 1/4 + 1/4 = 3/4. Hence P(triangle) = 1/4.",
        "Sanity check by direct integration: on the sorted region {0 < u < v < 1} (area 1/2) we need u < 1/2 < v < u + 1/2, with area equal to the integral of u from 0 to 1/2, which is 1/8, giving (1/8)/(1/2) = 1/4 ✓.",
        "Key idea: turn “each piece < 1/2” into a union of three disjoint “bad” events of equal area.",
      ],
    },
    {
      title: "Problem 1.38 · Bertrand’s paradox ⋆⋆",
      problem: "A chord of the unit circle is chosen “at random”. Find the probability that it is longer than √3 (the side of the inscribed equilateral triangle) under three different interpretations: (i) choose two independent uniform points on the circle; (ii) choose a radius, then a point uniform along it, and take the chord perpendicular to the radius at that point; (iii) choose the chord’s midpoint uniformly in the disk. Explain what the paradox teaches.",
      steps: [
        "(i) Random endpoints. By rotation invariance fix one endpoint. The other is at angle θ uniform on [0, 2π) from it. The chord length is 2 sin(θ/2) > √3 iff θ ∈ (2π/3, 4π/3). Probability = (2π/3)/2π = 1/3.",
        "(ii) Random radial distance. Let the chord be perpendicular to a fixed radius at distance d from the centre, d uniform on [0, 1]. Chord length = 2√(1 − d²) > √3 iff d < 1/2. Probability = 1/2.",
        "(iii) Random midpoint. A chord is determined by its midpoint, at distance r from the centre, with length 2√(1 − r²). Longer than √3 iff r < 1/2. For a uniform midpoint in the disk, probability = π(1/2)²/π = 1/4.",
        "Lesson. “At random” on an uncountable sample space is meaningless until you specify the probability measure, i.e. which parametrisation is uniform. The three models place different probability measures on the same set of chords (uniform in angle, uniform in distance, uniform in area).",
        "There is no single “correct” answer. The right choice depends on the physical mechanism. Equal likelihood is a modelling assumption, never a theorem. Quant meaning: “a random portfolio, correlation matrix or direction” is ambiguous until the measure is specified.",
      ],
    },
  ],

  "borel-cantelli": [
    {
      title: "Problem 1.23 · How long can a streak be? Borel–Cantelli ⋆⋆",
      problem: "A fair coin is tossed forever. Fix ε > 0, let Lₙ = ⌈(1 + ε) log₂ n⌉ and let Aₙ be the event that tosses n, n + 1, …, n + Lₙ − 1 are all heads. (a) Show P(Aₙ i.o.) = 0. (b) Interpret this as a bound on the longest streak of heads.",
      steps: [
        "(a) For n ≥ 2, Lₙ ≥ (1 + ε) log₂ n and Aₙ requires Lₙ specified tosses to be heads, so P(Aₙ) = 2^(−Lₙ) ≤ 2^(−(1+ε) log₂ n) = n^(−(1+ε)).",
        "Since Σ n^(−(1+ε)) < ∞ (a p-series with p = 1 + ε > 1), ΣP(Aₙ) < ∞ and the first Borel–Cantelli lemma gives P(Aₙ i.o.) = 0. Note that the Aₙ overlap heavily and are far from independent: BC1 needs no independence.",
        "(b) Almost surely there is a (random) n₀ such that for every n ≥ n₀ no head-run starting at toss n has length ≥ Lₙ. A run starting before n₀ has some finite length (by Problem 1.22(a), an infinite run of heads has probability 0).",
        "Hence, almost surely, for all large N the longest streak of heads within the first N tosses has length at most (1 + ε) log₂ N + 1. Since ε > 0 is arbitrary (take ε = 1/j and use countable intersections), the longest streak is at most about log₂ N. The matching lower bound needs independence and the second Borel–Cantelli lemma.",
        "Quant meaning: in N = 1000 fair coin flips (or 50/50 trades) the longest streak is typically around log₂ 1000 ≈ 10.",
        "Key idea: choose the threshold Lₙ just large enough to make ΣP(Aₙ) converge.",
      ],
    },
    {
      title: "Problem 1.24 · Fatou for events and a strict example ⋆⋆",
      problem: "(a) Show (lim sup Aₙ)ᶜ = lim inf Aₙᶜ and 1_(lim sup Aₙ) = lim sup 1_(Aₙ). (b) Let U be uniform on [0, 1], Aₙ = [0, 1/2] for even n and Aₙ = [1/2, 1] for odd n. Compute lim sup Aₙ, lim inf Aₙ and all four quantities in Theorem 1.11.4; show two of the inequalities are strict. (c) Show that if lim sup Aₙ = lim inf Aₙ = A, then P(Aₙ) → P(A).",
      steps: [
        "(a) ω ∈ (lim sup Aₙ)ᶜ iff ω lies in only finitely many Aₙ, iff ω ∉ Aₙ for all large n, iff ω ∈ lim inf Aₙᶜ. For indicators: a {0, 1}-valued sequence has lim sup = 1 iff it equals 1 infinitely often, iff ω ∈ Aₙ infinitely often, iff 1_(lim sup Aₙ)(ω) = 1.",
        "(b) Points of [0, 1/2] are in all even-indexed sets, points of [1/2, 1] in all odd-indexed ones, so every x ∈ [0, 1] is in infinitely many Aₙ: lim sup Aₙ = [0, 1], with probability 1.",
        "A point is in Aₙ for all large n only if it lies in both [0, 1/2] and [1/2, 1]: lim inf Aₙ = {1/2}, with probability 0. Also P(Aₙ) = 1/2 for all n. So P(lim inf Aₙ) = 0 < 1/2 = lim inf P(Aₙ) = lim sup P(Aₙ) = 1/2 < 1 = P(lim sup Aₙ).",
        "The outer inequalities are strict, so Fatou’s lemma cannot be improved to equality in general.",
        "(c) If lim sup Aₙ = lim inf Aₙ = A, Theorem 1.11.4 reads P(A) ≤ lim inf P(Aₙ) ≤ lim sup P(Aₙ) ≤ P(A), so all four are equal and P(Aₙ) → P(A). This is continuity of probability for arbitrary (not necessarily monotone) convergent sequences of events.",
      ],
    },
    {
      title: "Problem 1.29 · Algebra of limsup and liminf ⋆⋆",
      problem: "For sequences of events (Aₙ), (Bₙ) prove: (a) lim sup(Aₙ ∪ Bₙ) = lim sup Aₙ ∪ lim sup Bₙ; (b) lim inf(Aₙ ∩ Bₙ) = lim inf Aₙ ∩ lim inf Bₙ; (c) lim sup(Aₙ ∩ Bₙ) ⊆ lim sup Aₙ ∩ lim sup Bₙ and lim inf Aₙ ∪ lim inf Bₙ ⊆ lim inf(Aₙ ∪ Bₙ), with strict inclusion possible in both.",
      steps: [
        "Use the readings “lim sup = infinitely often” and “lim inf = eventually always”.",
        "(a) ω ∈ Aₙ ∪ Bₙ infinitely often iff the set of indices {n : ω ∈ Aₙ ∪ Bₙ} is infinite. That set is the union of {n : ω ∈ Aₙ} and {n : ω ∈ Bₙ}, so at least one of them is infinite. Conversely, either infinity gives infinitely many indices for the union.",
        "(b) ω ∈ Aₙ ∩ Bₙ for all n ≥ N iff ω ∈ Aₙ for all n ≥ N₁ and ω ∈ Bₙ for all n ≥ N₂ (take N = max(N₁, N₂)).",
        "(c) The first inclusion is clear: infinitely many joint occurrences give infinitely many of each. The second: eventually always in Aₙ (or Bₙ) implies eventually always in Aₙ ∪ Bₙ.",
        "Strictness: let Aₙ = Ω for even n, ∅ for odd n, and Bₙ = Aₙᶜ. Then lim sup Aₙ = lim sup Bₙ = Ω, but Aₙ ∩ Bₙ = ∅ for all n, so lim sup(Aₙ ∩ Bₙ) = ∅ ≠ Ω. Also lim inf Aₙ = lim inf Bₙ = ∅ but Aₙ ∪ Bₙ = Ω for all n, so lim inf(Aₙ ∪ Bₙ) = Ω.",
        "Key idea: “infinitely often” splits over unions; “eventually always” splits over intersections.",
      ],
    },
    {
      title: "Problem 1.30 · Borel–Cantelli needs independence for its converse ⋆⋆",
      problem: "Let U be uniform on [0, 1] and Aₙ = {U < 1/n}. (a) Show Σ P(Aₙ) = ∞ but P(Aₙ i.o.) = 0. (b) With Aₙ′ = {U < 1/n²} verify the conclusion of the first Borel–Cantelli lemma directly. (c) What changes if the events Aₙ are independent with P(Aₙ) = 1/n?",
      steps: [
        "(a) P(Aₙ) = 1/n and the harmonic series diverges. If U > 0, then U < 1/n only for n < 1/U, so finitely many Aₙ occur. Hence {Aₙ i.o.} ⊆ {U = 0}, which has probability 0.",
        "(b) Σ 1/n² < ∞, and indeed {Aₙ′ i.o.} ⊆ {U = 0}, probability 0, as BC1 predicts.",
        "(c) The second Borel–Cantelli lemma: for independent events with ΣP(Aₙ) = ∞, P(Aₙ i.o.) = 1. In (a) the events are strongly dependent (nested: Aₙ₊₁ ⊆ Aₙ), which is why divergence of the series tells us nothing.",
        "So BC1 holds in complete generality, but its converse requires independence.",
        "Key idea: for nested events, “infinitely often” collapses to “in the intersection”.",
      ],
    },
  ],
};
