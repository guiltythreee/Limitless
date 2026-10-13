import type { Example } from "./types";

// Chapter 1 problem set, part B: axioms, properties, equally likely outcomes, De Morgan, continuity.
export const problemsB: Record<string, Example[]> = {
  "axioms": [
    {
      title: "Problem 1.19 · Null sets and almost-sure events ⋆⋆",
      problem: "(a) Show that a countable union of null events is null, and that a countable intersection of almost sure events is almost sure. (b) Let U be uniform on [0, 1]. Show that P(U is rational) = 0. (c) Why does this not contradict P(U ∈ [0, 1]) = 1 = P(⋃ₓ {U = x}) with each P(U = x) = 0?",
      steps: [
        "(a) If P(Nᵢ) = 0 for all i, the union bound gives 0 ≤ P(⋃Nᵢ) ≤ Σ 0 = 0. If P(Aᵢ) = 1 for all i, then P(Aᵢᶜ) = 0, so by De Morgan and the first claim P((⋂Aᵢ)ᶜ) = P(⋃Aᵢᶜ) = 0, i.e. P(⋂Aᵢ) = 1.",
        "(b) The rationals in [0, 1] are countable: ℚ ∩ [0, 1] = {q₁, q₂, …}. For each q and every δ > 0, {q} ⊆ [q, q + δ] ∩ [0, 1], which has probability at most δ. Hence P({q}) = 0. By (a), P(U ∈ ℚ) = P(⋃ᵢ {qᵢ}) = 0. So U is irrational almost surely, even though the rationals are dense.",
        "(c) Axiom (A3) applies to countable disjoint unions only. [0, 1] = ⋃ₓ {x} is an uncountable union of null events, and such a union can have any probability. Probability 0 does not mean impossible.",
        "Why quants care: “almost surely, for all rational t simultaneously, a property holds” is free, because there are only countably many rationals.",
      ],
    },
    {
      title: "Problem 1.20 · There is no uniform integer ⋆⋆",
      problem: "(a) Prove that no probability measure on (ℕ, 2^ℕ) gives every integer the same probability. (b) The natural density of A ⊆ ℕ is d(A) = lim as N → ∞ of |A ∩ {1, …, N}|/N (when it exists). Show d({n}) = 0 for every n but d(ℕ) = 1; what does this say about countable additivity? (c) A number is chosen uniformly from {1, …, 30}. Find the probability it is divisible by 2, 3 or 5, and deduce the natural density of this set.",
      steps: [
        "(a) Suppose P({n}) = c for all n. By (A3), 1 = P(ℕ) = Σ c. If c = 0 the sum is 0; if c > 0 it is +∞. Neither equals 1, so no such P exists. Countable additivity is essential: a merely finitely additive “uniform” measure on ℕ can exist.",
        "(b) |{n} ∩ {1, …, N}| ≤ 1, so d({n}) = lim 1/N = 0, and d(ℕ) = 1. If d were countably additive, 1 = d(ℕ) = Σ d({n}) = 0, a contradiction. So natural density is finitely additive where defined, but not countably additive (and is not defined on all subsets). “Pick an integer uniformly at random” makes sense only as a limit of finite models.",
        "(c) Ω = {1, …, 30}. P(E₂) = 15/30, P(E₃) = 10/30, P(E₅) = 6/30; P(E₂E₃) = 5/30, P(E₂E₅) = 3/30, P(E₃E₅) = 2/30, P(E₂E₃E₅) = 1/30.",
        "By inclusion–exclusion, P(E₂ ∪ E₃ ∪ E₅) = (15 + 10 + 6 − 5 − 3 − 2 + 1)/30 = 22/30 = 11/15. Equivalently, the proportion with none of the factors is 8/30 = 4/15 = (1 − 1/2)(1 − 1/3)(1 − 1/5).",
        "Density: divisibility by 2, 3, 5 is periodic with period 30. For N = 30m + r with 0 ≤ r < 30 the count in {1, …, N} is 22m + c_r with 0 ≤ c_r ≤ r, so the fraction differs from 22/30 by less than 30/N → 0. Hence the density is 11/15.",
        "Key idea: the product ∏(1 − 1/p) is a preview of independence and of Euler’s φ function.",
      ],
    },
    {
      title: "Problem 1.27 · Finitely additive but not countably additive ⋆⋆⋆",
      problem: "Let 𝒜 be the collection of subsets of ℕ that are finite or have finite complement (“cofinite”). Define Q(A) = 0 if A is finite and Q(A) = 1 if A is cofinite. (a) Show 𝒜 is closed under complements and finite unions and that Q is finitely additive with Q(ℕ) = 1. (b) Show Q is not countably additive. (c) Exhibit Aₙ ↓ ∅ in 𝒜 with Q(Aₙ) ↛ 0 and relate this to Theorem 1.11.3.",
      steps: [
        "(a) The complement of a finite set is cofinite and vice versa. A union of two finite sets is finite; if either set is cofinite, so is the union. So 𝒜 is an algebra. Q is well defined because ℕ is infinite (no set is both finite and cofinite).",
        "For disjoint A, B ∈ 𝒜 at most one is cofinite (two cofinite sets intersect, since their complements cover only finitely many integers). If both are finite, Q(A ∪ B) = 0 = 0 + 0. If exactly one is cofinite, Q(A ∪ B) = 1 = 1 + 0. So Q is finitely additive, and Q(ℕ) = 1.",
        "(b) ℕ = ⋃ₙ {n} with each {n} finite: Q(ℕ) = 1 but Σ Q({n}) = 0.",
        "(c) Aₙ = {n, n + 1, …} is cofinite, Aₙ ↓ ∅, yet Q(Aₙ) = 1 for all n. By Theorem 1.11.3 a finitely additive normalised set function is countably additive iff it is continuous at ∅. Q fails the criterion, consistent with (b).",
        "This Q is a mathematical “uniform distribution at infinity”, exactly the object Problem 1.20 shows cannot be a probability measure.",
      ],
    },
    {
      title: "Problem 1.35 · A probability law on the positive integers ⋆⋆",
      problem: "Let P({n}) = c/(n(n + 1)) for n = 1, 2, 3, … (a) Find c. (b) Find P(N ≥ k). (c) Find P(N is even).",
      steps: [
        "(a) Telescoping: 1/(n(n + 1)) = 1/n − 1/(n + 1), so Σ 1/(n(n + 1)) = 1. Normalisation forces c = 1.",
        "(b) P(N ≥ k) = Σ over n ≥ k of (1/n − 1/(n + 1)) = 1/k (the partial sums tend to 1/k − 0).",
        "(c) P(N even) = Σ over j ≥ 1 of 1/(2j(2j + 1)) = Σ (1/(2j) − 1/(2j + 1)) = 1/2 − 1/3 + 1/4 − 1/5 + ⋯. Since ln 2 = 1 − 1/2 + 1/3 − 1/4 + ⋯, this equals 1 − ln 2 ≈ 0.3069. Sanity check: 1/6 + 1/20 + 1/42 + 1/72 + ⋯ ≈ 0.307.",
        "Remark: the tail P(N ≥ k) = 1/k is not summable, so this N has infinite expectation. It is a heavy-tailed law.",
      ],
    },
    {
      title: "Problem 1.39 · Waiting for the first six ⋆⋆",
      problem: "A fair die is rolled repeatedly until the first six; let N be the number of rolls. (a) Find P(N = n). (b) Show P(N < ∞) = 1. (c) Find P(N is even). (d) Find P(N is divisible by 3).",
      steps: [
        "(a) Look at the first n rolls: {1, …, 6}ⁿ has 6ⁿ equally likely sequences. N = n iff the first n − 1 rolls are non-six (5^(n−1) ways) and the n-th is a six (1 way). So P(N = n) = 5^(n−1)/6ⁿ = (1/6)(5/6)^(n−1), n = 1, 2, …",
        "(b) The events {N = n} are pairwise disjoint, so by (A3) P(N < ∞) = Σ (1/6)(5/6)^(n−1) = (1/6)/(1 − 5/6) = 1. Equivalently, {N > n} (first n rolls non-six) has probability (5/6)ⁿ ↓ 0, so P(N = ∞) = 0 by continuity from above.",
        "(c) {N even} = ⋃ₖ {N = 2k}, so P(N even) = Σ over k ≥ 1 of (1/6)(5/6)^(2k−1) = (1/6)(5/6) · 1/(1 − 25/36) = (5/36)/(11/36) = 5/11 ≈ 0.4545. Odd has probability 6/11: the first roll gives the odd side a head start.",
        "(d) P(3 divides N) = Σ (1/6)(5/6)^(3k−1) = (1/6)(5/6)² · 1/(1 − (5/6)³) = (25/216)/(91/216) = 25/91 ≈ 0.2747.",
        "In general, with q = 5/6 and p = 1/6: P(m divides N) = p q^(m−1)/(1 − qᵐ). This is the geometric distribution.",
      ],
    },
    {
      title: "Problem 1.47 · Alternating dice duel ⋆⋆",
      problem: "Players A and B alternately roll a pair of fair dice, A first. A wins on a total of 6, B wins on a total of 7. The first to succeed wins. Find P(A wins) and show the game ends with probability 1.",
      steps: [
        "In one roll, P(total 6) = 5/36 =: a and P(total 7) = 1/6 =: b.",
        "A wins on round k + 1 iff all 2k earlier rolls fail, and then A succeeds: P = [(1 − a)(1 − b)]ᵏ · a, where (1 − a)(1 − b) = 31/36 · 5/6 = 155/216.",
        "These events (over k ≥ 0) are disjoint, so by countable additivity P(A wins) = a/(1 − (1 − a)(1 − b)) = (5/36)/(61/216) = 30/61 ≈ 0.4918.",
        "Similarly B wins in round k + 1 with probability [(1 − a)(1 − b)]ᵏ (1 − a) b, and (1 − a) b = 31/216, so P(B wins) = (31/216)/(61/216) = 31/61.",
        "Since 30/61 + 31/61 = 1, the game ends almost surely. Equivalently, P(no one has won after k rounds) = (155/216)ᵏ → 0 by continuity from above.",
        "Key idea: sum over the round in which the game ends.",
      ],
    },
  ],

  "properties": [
    {
      title: "Problem 1.21 · Multiple testing and the union bound ⋆⋆",
      problem: "A researcher backtests m = 20 strategies, none of which has any real edge. Each test has false-positive probability α = 0.05. (a) Show that P(at least one false positive) ≤ mα whatever the dependence between the tests. (b) If the tests are independent, find the exact value and compare. (c) Which per-test level α′ guarantees family-wise error at most 0.05 with no assumption on dependence, and what is the exact family-wise error under independence at that level?",
      steps: [
        "Let Fᵢ be “test i gives a false positive”, P(Fᵢ) = α.",
        "(a) The event “at least one false positive” is ⋃Fᵢ, so by Boole’s inequality P(⋃Fᵢ) ≤ ΣP(Fᵢ) = mα, with no assumption on how the Fᵢ depend on each other. With m = 20 and α = 0.05 the bound is 1: useless as a guarantee.",
        "(b) Under independence, the complement trick gives 1 − (1 − α)ᵐ = 1 − 0.95²⁰ ≈ 0.6415. A researcher who tries 20 null strategies has about a 64% chance of finding a “significant” one.",
        "(c) Choose α′ = 0.05/20 = 0.0025 (Bonferroni correction): then P(any false positive) ≤ 20 · 0.0025 = 0.05 for any dependence structure. Under independence the exact value is 1 − 0.9975²⁰ ≈ 0.0488, only slightly below 0.05.",
        "The price is power: each individual test must now clear a much higher bar. Quant meaning: family-wise error control, and why backtest overfitting is dangerous.",
      ],
    },
    {
      title: "Problem 1.25 · The second Bonferroni inequality ⋆⋆",
      problem: "(a) Prove, for any events A₁, …, Aₙ, P(⋃Aᵢ) ≥ ΣP(Aᵢ) − Σ over i < j of P(Aᵢ ∩ Aⱼ). (b) Four events each have probability 0.3 and every pair has intersection probability 0.05. Give the best bounds on P(⋃Aᵢ) that (a) and the union bound provide.",
      steps: [
        "(a) Induction on n. For n = 1 equality holds. Assume it for n events and let D = ⋃ over i ≤ n of Aᵢ. By two-event inclusion–exclusion, P(D ∪ Aₙ₊₁) = P(D) + P(Aₙ₊₁) − P(D ∩ Aₙ₊₁).",
        "Now D ∩ Aₙ₊₁ = ⋃ᵢ (Aᵢ ∩ Aₙ₊₁), so by the union bound P(D ∩ Aₙ₊₁) ≤ Σ over i ≤ n of P(Aᵢ ∩ Aₙ₊₁). Therefore P(D ∪ Aₙ₊₁) ≥ [ΣP(Aᵢ) − ΣP(AᵢAⱼ)] + P(Aₙ₊₁) − ΣP(AᵢAₙ₊₁), which is the claim for n + 1 events.",
        "(b) Lower bound: 4(0.3) − C(4, 2)(0.05) = 1.2 − 0.3 = 0.9. Upper bound (union bound): min(1, 1.2) = 1. So 0.9 ≤ P(⋃Aᵢ) ≤ 1.",
        "The lower bound is much better than the trivial maxᵢ P(Aᵢ) = 0.3. Key idea: apply the upper bound to the correction term to get a lower bound overall.",
      ],
    },
    {
      title: "Problem 1.28 · The one-quarter bound ⋆⋆⋆",
      problem: "Show that for any two events A, B, |P(A ∩ B) − P(A)P(B)| ≤ 1/4, and that 1/4 cannot be replaced by a smaller constant.",
      steps: [
        "Write a = P(A), b = P(B), c = P(A ∩ B), and assume without loss of generality a ≤ b. From monotonicity and P(A ∪ B) ≤ 1: max(0, a + b − 1) ≤ c ≤ min(a, b) = a.",
        "Upper bound. c − ab ≤ a − ab = a(1 − b) ≤ b(1 − b) ≤ 1/4, using a ≤ b and x(1 − x) ≤ 1/4.",
        "Lower bound. If a + b ≤ 1: c − ab ≥ −ab ≥ −a(1 − a) ≥ −1/4 (as b ≤ 1 − a). If a + b > 1: c − ab ≥ a + b − 1 − ab = −(1 − a)(1 − b), and by AM–GM (1 − a)(1 − b) ≤ ((1 − a) + (1 − b))²/4 < 1/4 because (1 − a) + (1 − b) < 1.",
        "Sharpness. A = B with P(A) = 1/2 gives c − ab = 1/2 − 1/4 = +1/4. A, B disjoint with a = b = 1/2 gives 0 − 1/4 = −1/4.",
        "Preview: P(A ∩ B) − P(A)P(B) is the covariance of the indicators 1_A and 1_B, so the result says |Cov(1_A, 1_B)| ≤ 1/4.",
      ],
    },
    {
      title: "Problem 1.40 · The matching (hat-check) problem ⋆⋆",
      problem: "n people leave their hats; the hats are returned in a uniformly random order (a uniformly random permutation). Let Aᵢ be the event that person i gets their own hat. (a) Using inclusion–exclusion, find P(⋃Aᵢ) for n = 3 and n = 4, and verify by direct counting. (b) Find P(⋃Aᵢ) for general n and its limit as n → ∞.",
      steps: [
        "Let σ be a uniform random permutation of {1, …, n} (n! equally likely outcomes) and Aᵢ = {σ(i) = i}.",
        "Intersections. For i₁ < ⋯ < iₖ, fix σ(iⱼ) = iⱼ and permute the remaining n − k positions freely: (n − k)! permutations. So P(Aᵢ₁ ∩ ⋯ ∩ Aᵢₖ) = (n − k)!/n!, and there are C(n, k) such intersections. Each level of inclusion–exclusion contributes C(n, k) · (n − k)!/n! = 1/k!.",
        "(a) By inclusion–exclusion, n = 3: P(⋃Aᵢ) = 1 − 1/2 + 1/6 = 2/3. n = 4: 1 − 1/2 + 1/6 − 1/24 = 15/24 = 5/8.",
        "Direct check. n = 3: only the two 3-cycles have no fixed point, so P(no match) = 2/6 = 1/3 ✓. n = 4: derangements of 4 objects: 3 products of two swaps plus 6 four-cycles = 9, so P(no match) = 9/24 = 3/8 = 1 − 5/8 ✓.",
        "(b) In general P(⋃Aᵢ) = Σ from k = 1 to n of (−1)^(k+1)/k!, which tends to 1 − e⁻¹ ≈ 0.632 as n → ∞. So P(no match) → e⁻¹. Convergence is extremely fast: n = 4 gives 0.625, n = 5 gives 0.633, and for a shuffled deck (n = 52) the answer agrees with 1 − 1/e to many decimals.",
        "Remark: the number of derangements is Dₙ = n! Σ (−1)ᵏ/k!, the integer nearest to n!/e. Key idea: symmetry makes all k-fold intersections equally likely, so inclusion–exclusion collapses to a single clean sum.",
      ],
    },
    {
      title: "Problem 1.42 · A pigeonhole principle for probabilities ⋆⋆",
      problem: "Let Ω be countable and A₁, …, Aₙ events with ΣP(Aᵢ) > k for an integer k ≥ 0. Show that with positive probability at least k + 1 of the events occur simultaneously. Deduce that if P(A) = 0.7, P(B) = 0.8, P(C) = 0.6, then P(A ∩ B ∩ C) > 0.",
      steps: [
        "Let Ω = {ω₁, ω₂, …} with mass function p. Define the counting function N(ω) = Σ 1_(Aᵢ)(ω) = the number of events that occur at ω.",
        "Suppose for contradiction that with probability 1 at most k events occur, i.e. p(ω) = 0 whenever N(ω) ≥ k + 1. Then p(ω)N(ω) ≤ k p(ω) for every ω (trivial where p(ω) = 0; and N(ω) ≤ k otherwise).",
        "Sum over ω, exchanging the finite sum over i with the sum over ω: ΣP(Aᵢ) = Σᵢ Σ over ω ∈ Aᵢ of p(ω) = Σ_ω p(ω)N(ω) ≤ k Σ p(ω) = k. This contradicts ΣP(Aᵢ) > k. Hence P(N ≥ k + 1) > 0.",
        "Application. 0.7 + 0.8 + 0.6 = 2.1 > 2, so with positive probability at least 3 of the 3 events occur: P(A ∩ B ∩ C) > 0. Consistency with Bonferroni: P(A ∩ B ∩ C) ≥ 1 − (0.3 + 0.2 + 0.4) = 0.1 > 0 ✓.",
        "The pigeonhole version is Bonferroni in disguise: k = n − 1 gives ΣP(Aᵢ) > n − 1 iff ΣP(Aᵢᶜ) < 1. Remark (probabilistic method): “if the average number of occurring events exceeds k then some outcome has more than k” is the first-moment method.",
      ],
    },
  ],

  "equally-likely": [
    {
      title: "Problem 1.3 · Two dice ⋆",
      problem: "Roll two fair dice. (a) Find P(sum = k) for every k. (b) Find P(max = k) for every k. (c) Find P(sum ≥ 10). (d) Leibniz argued that sums 11 and 12 are equally likely “because each can be made in only one way, 5 + 6 and 6 + 6”. Find the flaw.",
      steps: [
        "Take Ω = {1, …, 6}² (ordered pairs), |Ω| = 36, equally likely.",
        "(a) The number of ordered pairs with sum k is 6 − |k − 7| for 2 ≤ k ≤ 12, so P(sum = k) = (6 − |k − 7|)/36. For k = 2, …, 12 the counts are 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1 (total 36 ✓).",
        "(b) {max ≤ k} means both dice ≤ k: k² outcomes. The events are nested, {max ≤ k − 1} ⊆ {max ≤ k}, and {max = k} = {max ≤ k} \\ {max ≤ k − 1}, so by monotonicity P(max = k) = (k² − (k − 1)²)/36 = (2k − 1)/36. Check: Σ(2k − 1) = 36.",
        "(c) P(sum ≥ 10) = P(10) + P(11) + P(12) = (3 + 2 + 1)/36 = 1/6.",
        "(d) The sum 11 arises from the unordered pair {5, 6}, which is two equally likely ordered outcomes (5, 6) and (6, 5), whereas 12 arises only from (6, 6). So P(11) = 2/36 and P(12) = 1/36.",
        "The 21 unordered pairs are not equally likely: the 6 doubles have probability 1/36 each, the 15 non-doubles 2/36 each (6 + 30 = 36).",
        "Key idea: “max ≤ k” is a nested family. Take differences. In general P(max = k) = (kⁿ − (k − 1)ⁿ)/6ⁿ for n dice.",
      ],
    },
    {
      title: "Problem 1.50 · The sock drawer ⋆⋆",
      problem: "A drawer holds red and blue socks; two are drawn without replacement. (a) With 5 red and 5 blue, find P(match). (b) Show P(both red) = 1/2 for (r, b) = (3, 1) and for (15, 6). (c) Find all r with P(both red) = 1/2 when b = 1.",
      steps: [
        "For r red and b blue, P(both red) = r(r − 1)/((r + b)(r + b − 1)) (ordered draws: r(r − 1) favourable out of (r + b)(r + b − 1)).",
        "(a) P(match) = [C(5, 2) + C(5, 2)]/C(10, 2) = 20/45 = 4/9.",
        "(b) (3, 1): (3 · 2)/(4 · 3) = 1/2. (15, 6): (15 · 14)/(21 · 20) = 210/420 = 1/2.",
        "(c) With b = 1: r(r − 1)/((r + 1) r) = (r − 1)/(r + 1) = 1/2 iff r = 3. So (3, 1) is the only solution with a single blue sock.",
        "Key idea: ordered and unordered counts give the same probability if used consistently.",
      ],
    },
    {
      title: "Problem 1.52 · The problem of points (Pascal–Fermat) ⋆⋆",
      problem: "Two players A and B play a series of fair independent games for a prize; the first to win a fixed number of games takes everything. The game is interrupted when A still needs 2 wins and B needs 3. How should the prize be divided so that each player gets his probability of winning?",
      steps: [
        "Play would have ended after at most 2 + 3 − 1 = 4 further games. Imagine that all 4 games are played regardless. This does not change who wins the prize: A wins the prize iff A wins at least 2 of the 4.",
        "The 2⁴ = 16 outcomes are equally likely, so P(A wins) = [C(4, 2) + C(4, 3) + C(4, 4)]/16 = (6 + 4 + 1)/16 = 11/16, and P(B wins) = 5/16.",
        "The prize is split 11 : 5. Dividing in proportion to games already won would ignore the remaining state of the series.",
        "The extended-game trick is legitimate because the events “A wins at least 2 of 4” and “A reaches 2 wins before B reaches 3” are the same event on the extended sample space.",
        "Historical note: this correspondence between Pascal and Fermat (1654) is often cited as the birth of probability theory.",
      ],
    },
  ],

  "de-morgan": [
    {
      title: "Problem 1.41 · Newton–Pepys dice problem ⋆⋆⋆",
      problem: "Which is most likely: (i) at least one six when 6 fair dice are rolled; (ii) at least two sixes when 12 dice are rolled; (iii) at least three sixes when 18 dice are rolled?",
      steps: [
        "For m fair dice, P(exactly j sixes) = C(m, j) 5^(m−j)/6ᵐ. Use the complement trick.",
        "(i) 1 − 5⁶/6⁶ ≈ 0.6651.",
        "(ii) 1 − (5¹² + 12 · 5¹¹)/6¹² = 1 − 830,078,125/2,176,782,336 ≈ 0.6187.",
        "(iii) 1 − (5¹⁸ + 18 · 5¹⁷ + C(18, 2) 5¹⁶)/6¹⁸ ≈ 0.5973.",
        "So (i) is the most likely, followed by (ii) and then (iii), against the common intuition that “the expected number of sixes is the threshold in each case, so they should be about equal”. The distribution becomes more spread out, and P(count ≥ mean) shrinks towards about 1/2 as m grows. Pepys asked Newton this in 1693, and Newton answered correctly.",
      ],
    },
    {
      title: "Problem 1.46 · How many rolls are enough? ⋆⋆",
      problem: "(a) What is the smallest number n of rolls of a pair of dice for which P(at least one double six) > 1/2? (b) What is the smallest n of rolls of a single die for which P(at least one six) ≥ 0.9? (c) Show that for a per-trial success probability p the threshold for 1/2 is about ln 2/p.",
      steps: [
        "By the complement trick, P(at least one success in n) = 1 − (1 − p)ⁿ.",
        "(a) p = 1/36: need (35/36)ⁿ < 1/2, i.e. n > ln 2/(−ln(35/36)) ≈ 24.6. So n = 25: 1 − (35/36)²⁵ ≈ 0.5055 > 1/2, whereas n = 24 gives 0.4914 < 1/2. This is the Chevalier de Méré’s lesson.",
        "(b) p = 1/6: need (5/6)ⁿ ≤ 0.1, i.e. n ≥ ln 10/ln 1.2 ≈ 12.63. So n = 13: 1 − (5/6)¹³ ≈ 0.9065.",
        "(c) 1 − (1 − p)ⁿ > 1/2 iff n > ln 2/(−ln(1 − p)), and −ln(1 − p) ≈ p for small p, giving n ≈ ln 2/p = 0.693/p.",
        "Quant meaning: the “rule of 0.69/p” for the number of independent trials until a rare event has a 50% chance.",
      ],
    },
  ],

  "continuity": [
    {
      title: "Problem 1.22 · Runs in an infinite coin sequence ⋆⋆⋆",
      problem: "A fair coin is tossed forever. Assume only that any specified pattern of the first n tosses has probability 2^(−n). (a) Show P(no head ever) = 0, in two ways. (b) Fix k ≥ 1. Show that, with probability 1, a run of k consecutive heads eventually appears. (c) Deduce that with probability 1, every finite pattern of heads and tails appears somewhere in the sequence.",
      steps: [
        "(a) Via continuity. Let Tₙ = “first n tosses are all tails”, P(Tₙ) = 2^(−n). Then T₁ ⊇ T₂ ⊇ ⋯ and ⋂Tₙ = “no head ever”. By continuity from above, P(no head) = lim 2^(−n) = 0.",
        "Via a partition. Let Hₙ = “first head at toss n” (pattern Tⁿ⁻¹H), P(Hₙ) = 2^(−n). The events H₁, H₂, … and {no head} partition Ω. By (A3): 1 = Σ 2^(−n) + P(no head) = 1 + P(no head), so P(no head) = 0.",
        "(b) Let G_m = “no run of k heads inside tosses 1, …, m” and G = ⋂G_m = “no run of k heads ever”. Fix n and look at the first kn tosses, cut into n disjoint blocks of k tosses. If G_(kn) occurs, no block is all heads. Among the 2^(kn) equally likely patterns, those where every block avoids HH⋯H number (2ᵏ − 1)ⁿ.",
        "Therefore P(G) ≤ P(G_(kn)) ≤ (2ᵏ − 1)ⁿ/2^(kn) = (1 − 2^(−k))ⁿ → 0 as n → ∞. The first inequality is monotonicity (G ⊆ G_(kn)). So P(G) = 0: a run of k heads appears almost surely.",
        "(c) Let w be a finite word of length k over {H, T}. The same block argument, with “block equals w” (probability 2^(−k)) in place of “block is all heads”, shows P(w never appears) = 0. There are only countably many finite words, so the union of these countably many null events is null: with probability 1, every finite word appears. This is the “infinite monkey theorem”.",
        "Quant meaning: any given finite streak of wins or losses will occur in a long enough random sequence, so observing it is not evidence of skill or a regime change.",
      ],
    },
    {
      title: "Problem 1.26 · Continuity of probability in action ⋆⋆",
      problem: "Let U be uniform on [0, 1]. (a) Aₙ = {U ≤ 1 − 1/n}, n ≥ 2. Identify lim Aₙ and verify P(Aₙ) → P(lim Aₙ). (b) Bₙ = {U ≤ 1/n}. Identify ⋂Bₙ and verify continuity. (c) Cₙ = {|U − 1/2| < 1/n}, n ≥ 3. Identify ⋂Cₙ. (d) A fair coin is tossed repeatedly; Dₙ = “at least one head in the first n tosses”. Find P(⋃Dₙ). (e) (Typewriter sequence) For n = 2ᵏ + j with 0 ≤ j < 2ᵏ, let Iₙ = {U ∈ [j/2ᵏ, (j + 1)/2ᵏ]}. Show P(Iₙ) → 0 yet lim sup Iₙ is the sure event.",
      steps: [
        "(a) Aₙ ↑ ⋃Aₙ = {U < 1}. P(Aₙ) = 1 − 1/n ↑ 1 = P(U < 1) ✓ (continuity from below).",
        "(b) Bₙ ↓ {U = 0}. P(Bₙ) = 1/n ↓ 0 = P(U = 0) ✓ (continuity from above).",
        "(c) Cₙ ↓ {U = 1/2}, P(Cₙ) = 2/n → 0, consistent with P(U = 1/2) = 0.",
        "(d) Dₙ ↑ D = {some head ever}, P(Dₙ) = 1 − 2^(−n) → 1, so P(D) = 1.",
        "(e) At level k the 2ᵏ intervals of length 2^(−k) tile [0, 1] one after another (indices n = 2ᵏ, …, 2^(k+1) − 1), so P(Iₙ) = 2^(−k) → 0. But every point x ∈ [0, 1] lies in at least one interval at every level k, hence in Iₙ for infinitely many n: lim sup Iₙ = Ω, with probability 1.",
        "Here P(lim sup Iₙ) = 1 > 0 = lim P(Iₙ), so the right-hand inequality of Fatou’s lemma can be strict. Also ΣP(Iₙ) = Σₖ 2ᵏ · 2^(−k) = ∞, so Borel–Cantelli 1 does not apply.",
        "Key idea: P(Aₙ) → 0 does not imply Aₙ “eventually stops occurring”. That needs a summable series.",
      ],
    },
  ],
};
