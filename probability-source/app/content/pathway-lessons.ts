import type { Lesson } from "./types";

/**
 * Original Limitless lessons. The reference textbooks guide topic selection and
 * progression; the prose, worked examples, and questions here are newly written.
 */
export const pathwayLessons: Lesson[] = [
  {
    id: "advanced-counting", rank: 8, title: "Inclusion–Exclusion & Counting by Cases", minutes: 18,
    description: "Count complicated events without double-counting outcomes.",
    objective: "Use inclusion–exclusion, complementary counting, and disjoint case splits to count outcomes and probabilities.",
    body: [
      "Counting is reliable only when every desired outcome is counted exactly once. Common failures are omission (a case is missed) and overcounting (an outcome appears in more than one case).",
      "For two finite sets, |A ∪ B| = |A| + |B| − |A ∩ B|. For three sets, add individual sizes, subtract pairwise intersections, then add the triple intersection. The alternating signs repair repeated counting.",
      "Complementary counting is often shorter: count the whole space and subtract outcomes that fail the condition. “At least one” is often easier as 1 − P(none).",
      "A case split must be exhaustive and disjoint. State the cases, verify every valid outcome belongs to a case, and verify no outcome belongs to two cases before adding the counts.",
      "For three sets, inclusion–exclusion alternates signs: add the three individual sizes, subtract all three pairwise overlaps, then add the triple overlap. The triple intersection was subtracted three times but should be counted once, so it must be restored.",
      "A useful way to count objects satisfying exactly one condition is to partition by which condition holds, rather than apply a union formula blindly. For larger collections, inclusion–exclusion has alternating terms over every nonempty subset; symmetry or complements can be more efficient."
    ],
    formulas: [
      { label: "Two-set inclusion–exclusion", text: "|A ∪ B| = |A| + |B| − |A ∩ B|" },
      { label: "Three-set inclusion–exclusion", text: "|A ∪ B ∪ C| = Σ|A| − Σ|A ∩ B| + |A ∩ B ∩ C|" },
      { label: "General inclusion–exclusion", text: "|⋃ᵢ₌₁ⁿ Aᵢ| = Σ|Aᵢ| − Σ|Aᵢ∩Aⱼ| + Σ|Aᵢ∩Aⱼ∩Aₖ| − ···" },
      { label: "Complement", text: "|A| = |Ω| − |Aᶜ|" }
    ],
    examples: [
      { title: "A shared language", problem: "In a class of 40 students, 22 study French, 18 study German, and 9 study both. How many study at least one?", steps: [
        "Adding 22 + 18 counts the 9 students studying both languages twice.",
        "Subtract the overlap once: |F ∪ G| = 22 + 18 − 9 = 31.",
        "Thus 31 study at least one language and 40 − 31 = 9 study neither."
      ] },
      { title: "At least one six", problem: "Roll four independent fair dice. Find the probability that at least one die shows 6.", steps: [
        "The complement of at least one six is that all four dice avoid 6.",
        "By independence, P(no six) = (5/6)^4.",
        "Therefore P(at least one six) = 1 − (5/6)^4 = 671/1296 ≈ 0.5177. Adding four probabilities of 1/6 double-counts outcomes with multiple sixes."
      ] },
      { title: "Three overlapping clubs", problem: "In a group of 100 students, 45 study French, 40 German and 35 Spanish. The pairwise overlaps are 15, 12 and 10, and 5 study all three. How many study at least one language?", steps: [
        "Add the individual totals: 45+40+35=120.",
        "Subtract pairwise overlaps: 120−15−12−10=83.",
        "Add the triple overlap once: 83+5=88 students study at least one language."
      ] }
    ],
    quiz: [
      { question: "If |A| = 30, |B| = 24 and |A ∩ B| = 11, what is |A ∪ B|?", options: ["65", "54", "43", "13"], answer: 2, difficulty: "easy", explanation: "Inclusion–exclusion gives 30 + 24 − 11 = 43. Adding without subtracting the overlap double-counts the 11 shared elements." },
      { question: "A fair die is rolled twice. What is the probability of at least one 6?", options: ["1/6", "11/36", "1/3", "1/36"], answer: 1, difficulty: "medium", explanation: "Use the complement: 1 − (5/6)² = 11/36. Adding 1/6 twice would incorrectly treat the events as disjoint." },
      { question: "In a 52-card deck, how many cards are hearts or kings?", options: ["16", "17", "13", "4"], answer: 0, difficulty: "hard", explanation: "There are 13 hearts and 4 kings, with the king of hearts in both sets. Inclusion–exclusion gives 13 + 4 − 1 = 16." }
    ]
  },
  {
    id: "occupancy-coupon", rank: 8, title: "Occupancy, Matching & Coupon Collection", minutes: 22,
    description: "Model repeated choices, collisions, and waiting until every type appears.",
    objective: "Count occupancy outcomes and derive probabilities and expectations for coupon-collector experiments.",
    body: [
      "Occupancy problems distribute labelled trials or objects among categories such as boxes, birthdays, servers, or product types. First decide whether outcomes are ordered, whether categories are equally likely, and whether repetitions are allowed.",
      "If n independent draws select one of m equally likely categories, there are mⁿ ordered sequences. Inclusion–exclusion counts sequences in which every category appears: Σⱼ₌₀ᵐ (−1)ʲ C(m,j)(m−j)ⁿ.",
      "The coupon collector asks how many uniform independent draws are needed to see all m types. Once k distinct types have appeared, the chance the next draw is new is (m−k)/m, so the expected wait for that new type is m/(m−k). Adding the waits gives E[T] = mHₘ.",
      "Expected collection time is an average, not a deadline. The waiting time has a long right tail, so a result above the mean is not automatically unusual.",
      "For n draws into m equally likely boxes, the expected number of empty boxes is m(1−1/m)ⁿ: use one indicator per box and add their probabilities of remaining empty. This is linearity of expectation and does not require empty-box indicators to be independent.",
      "The birthday problem is another occupancy model: people are balls and calendar dates are boxes. For n people and d equally likely birthdays, the probability of no shared birthday is d(d−1)···(d−n+1)/dⁿ, provided n≤d. The collision probability is its complement. Independence of individual birthdays is assumed; real calendars introduce small complications such as leap days and seasonal variation.",
      "The coupon-collector waiting time splits into stages with geometric success probabilities 1,(m−1)/m,…,1/m. Their means sum to mHₘ; their variances also sum because successive waiting stages are independent under fresh independent draws."
    ],
    formulas: [
      { label: "All m categories observed in n draws", text: "P(all seen) = (1/mⁿ) Σⱼ₌₀ᵐ (−1)ʲ C(m,j)(m−j)ⁿ" },
      { label: "Expected collection time", text: "E[T] = mHₘ = m(1 + 1/2 + ··· + 1/m)" },
      { label: "Expected wait for a new type", text: "m/(m − k), when k types have appeared" },
      { label: "Expected number of empty boxes", text: "E[empty boxes] = m(1 − 1/m)ⁿ" },
      { label: "Birthday collision probability", text: "P(at least one shared birthday) = 1 − d(d−1)···(d−n+1)/dⁿ" },
      { label: "Coupon-collector variance", text: "Var(T) = m²Hₘ⁽²⁾ − mHₘ,  Hₘ⁽²⁾=Σⱼ₌₁ᵐ1/j²" }
    ],
    examples: [
      { title: "Four draws, three colours", problem: "Each draw independently returns one of three equally likely colours. Find the probability all three colours appear in four draws.", steps: [
        "There are 3⁴ = 81 ordered sequences.",
        "Sequences missing at least one colour number 3·2⁴ − 3·1⁴ = 45 by inclusion–exclusion.",
        "Thus 81 − 45 = 36 sequences contain all colours and the probability is 36/81 = 4/9."
      ] },
      { title: "Collecting three coupons", problem: "A collector receives one of three equally likely coupon types per purchase. Find the expected purchases needed to collect all types.", steps: [
        "The first distinct type arrives on the first purchase.",
        "After one type is collected, each draw finds a new type with probability 2/3, so the expected extra wait is 3/2.",
        "After two types, the expected wait for the last type is 3. Therefore E[T]=1+3/2+3=11/2 purchases."
      ] },
      { title: "Expected empty boxes", problem: "Five independent balls are placed uniformly into three boxes. Find the expected number of empty boxes.", steps: [
        "For each box i, let Iᵢ=1 if it is empty. A given ball avoids that box with probability 2/3.",
        "All five balls avoid a specified box with probability (2/3)⁵, so E[Iᵢ]=(2/3)⁵.",
        "By linearity, E[empty boxes]=3(2/3)⁵=96/243=32/81."
      ] },
      { title: "The birthday threshold", problem: "Assuming 365 equally likely birthdays and independent birthdays, write the probability of at least one shared birthday among 23 people.", steps: [
        "It is easier to first calculate the probability that all birthdays are different.",
        "The first person has 365 choices, the second 364, and so on through the 23rd, which has 343 choices. Divide by 365²³.",
        "Thus P(match)=1−(365×364×···×343)/365²³≈0.5073. The probability exceeds one half even with only 23 people."
      ] }
    ],
    quiz: [
      { question: "With two equally likely categories, what is the probability that both appear in three independent draws?", options: ["1/8", "3/8", "3/4", "1/2"], answer: 2, difficulty: "easy", explanation: "The only failures are all of the first category or all of the second, each with probability 1/8. Hence the answer is 1 − 2/8 = 3/4." },
      { question: "The expected number of draws to collect all four equally likely coupon types is", options: ["4", "25/3", "8", "10"], answer: 1, difficulty: "medium", explanation: "E[T]=4H₄=4(1+1/2+1/3+1/4)=25/3. As fewer types remain unseen, finding a new one takes longer on average." },
      { question: "Three categories are equally likely and four independent draws are made. What is P(all three appear)?", options: ["4/9", "1/3", "8/27", "2/3"], answer: 0, difficulty: "hard", explanation: "There are 3⁴ = 81 ordered sequences. Inclusion–exclusion leaves 81 − 3·16 + 3 = 36 sequences containing all three categories, so 36/81 = 4/9." }
    ]
  },
  {
    id: "conditional-independence", rank: 7, title: "Conditional Probability & Independence", minutes: 20,
    description: "Separate independence, mutual exclusion, and independence after observing evidence.",
    objective: "Compute conditional probabilities and test ordinary and conditional independence from definitions.",
    body: [
      "Conditional probability changes the reference event: P(A | B)=P(A ∩ B)/P(B), provided P(B)>0. The denominator is B because we now know the outcome lies in B.",
      "A and B are independent exactly when P(A ∩ B)=P(A)P(B), equivalently P(A | B)=P(A) when P(B)>0. Independence is a statement about the probability model, not whether events sound unrelated.",
      "Mutually exclusive events with positive probabilities cannot be independent. Disjointness makes P(A ∩ B)=0, whereas independence would require P(A)P(B)>0.",
      "Conditional independence is different: A and B may be dependent overall but independent once a third event C is known. Test outcomes, for example, can be independent conditional on a patient's true disease status even when the unconditioned results are associated.",
      "For a conditioning event C with positive probability, the conditional model is itself a probability model on C. Its event probabilities are P(A|C), and the same addition and multiplication rules apply inside that model.",
      "For a finite partition {Cᵢ}, conditional independence given the partition means the factorisation holds within each relevant case Cᵢ. It does not generally imply unconditional independence: mixing over an unknown common cause can create dependence."
    ],
    formulas: [
      { label: "Conditional probability", text: "P(A | B) = P(A ∩ B)/P(B), P(B) > 0" },
      { label: "Independence", text: "P(A ∩ B) = P(A)P(B)" },
      { label: "Conditional independence", text: "P(A ∩ B | C) = P(A | C)P(B | C)" }
    ],
    examples: [
      { title: "Testing independence", problem: "Suppose P(A)=0.4, P(B)=0.5 and P(A ∩ B)=0.2. Are A and B independent?", steps: [
        "Compute P(A)P(B)=0.4·0.5=0.2.",
        "This matches the intersection probability, so A and B are independent.",
        "Equivalently, P(A | B)=0.2/0.5=0.4=P(A)."
      ] },
      { title: "A rare-event trap", problem: "A and B are disjoint, with P(A)=0.2 and P(B)=0.3. Can they be independent?", steps: [
        "Disjointness gives P(A ∩ B)=0.",
        "Independence would require P(A ∩ B)=0.2·0.3=0.06.",
        "The conditions conflict, so the events are not independent. Disjoint and independent are not synonyms."
      ] },
      { title: "Independent tests given disease status", problem: "A disease has probability 0.1. Two tests are conditionally independent given disease status. Each has sensitivity 0.9 and false-positive rate 0.2. Find P(both positive).", steps: [
        "Split into disease and no-disease cases. Given disease, both are positive with probability 0.9²=0.81.",
        "Given no disease, both are positive with probability 0.2²=0.04.",
        "Total probability gives 0.1(0.81)+0.9(0.04)=0.117. Multiplying the unconditional positive-test probability by itself would incorrectly assume unconditional independence."
      ] }
    ],
    quiz: [
      { question: "If P(A ∩ B)=0.12 and P(B)=0.30, then P(A | B) is", options: ["0.036", "0.18", "0.40", "2.50"], answer: 2, difficulty: "easy", explanation: "Divide by the probability of the conditioning event: 0.12/0.30=0.40. Multiplication by 0.30 gives the joint probability, not the conditional probability." },
      { question: "If P(A)=0.7, P(B)=0.4 and P(A ∩ B)=0.28, then A and B are", options: ["disjoint", "independent", "complements", "necessarily identical"], answer: 1, difficulty: "medium", explanation: "P(A)P(B)=0.7·0.4=0.28, matching the intersection. They are not disjoint because their intersection has positive probability." },
      { question: "Let A and B be disjoint with P(A)>0 and P(B)>0. Which statement is correct?", options: ["They are independent", "They are conditionally independent given every C", "They are not independent", "P(A | B)=P(A)"], answer: 2, difficulty: "hard", explanation: "Disjointness makes P(A ∩ B)=0, but independence would require P(A)P(B)>0. Also P(A | B)=0, not P(A); conditional independence requires separate information." }
    ]
  },
  {
    id: "total-probability", rank: 7, title: "Partitions, Total Probability & Bayes", minutes: 18,
    description: "Combine multiple possible causes and update beliefs from evidence.",
    objective: "Apply the law of total probability and Bayes' theorem without confusing likelihoods with posterior probabilities.",
    body: [
      "A partition B₁,…,Bₙ consists of disjoint events whose union is the whole sample space. Exactly one partition event occurs, so an event A can be split into the disjoint cases A ∩ Bᵢ.",
      "The law of total probability is P(A)=ΣᵢP(A | Bᵢ)P(Bᵢ). Each possible cause contributes its prior probability multiplied by the chance it produces the evidence.",
      "Bayes' theorem reverses the conditioning: P(Bⱼ | A)=P(A | Bⱼ)P(Bⱼ)/P(A). The denominator includes every route that could produce A. A large likelihood does not imply a large posterior if the prior probability is tiny.",
      "For a diagnostic test, distinguish sensitivity P(positive | disease), false-positive rate P(positive | no disease), and the desired posterior P(disease | positive). Base rates matter even when a test is accurate."
    ],
    formulas: [
      { label: "Total probability", text: "P(A) = Σᵢ P(A | Bᵢ)P(Bᵢ)" },
      { label: "Bayes' theorem", text: "P(Bⱼ | A) = P(A | Bⱼ)P(Bⱼ)/ΣᵢP(A | Bᵢ)P(Bᵢ)" }
    ],
    examples: [
      { title: "A low-prevalence test", problem: "A disease affects 1% of people. A test is positive for 90% of diseased people and 5% of healthy people. Find the probability of disease after a positive test.", steps: [
        "Take a population of 10,000. About 100 have the disease; 90 of them test positive.",
        "Of 9,900 healthy people, 5% or 495 test positive. There are 90 + 495 = 585 positive results.",
        "The posterior probability is 90/585 = 2/13 ≈ 15.38%. It is not 90%, which is sensitivity rather than the probability of disease given a positive result."
      ] },
      { title: "Two production lines", problem: "Line A makes 60% of items with 1% defective; line B makes 40% with 3% defective. Find the defect probability and the chance a defective item came from B.", steps: [
        "Total probability gives P(D)=0.6·0.01+0.4·0.03=0.018, or 1.8%.",
        "Bayes gives P(B | D)=0.4·0.03/0.018.",
        "The result is 2/3. Although B produces fewer items, it contributes two-thirds of defects because its defect rate is higher."
      ] },
      { title: "Three possible causes", problem: "A machine is selected from A, B or C with probabilities 0.5, 0.3 and 0.2. Their failure rates are 1%, 2% and 5%. Find the overall failure probability and P(C | failure).", steps: [
        "Total probability gives P(F)=0.5(0.01)+0.3(0.02)+0.2(0.05)=0.021.",
        "The joint probability of selecting C and observing failure is 0.2(0.05)=0.01.",
        "Bayes gives P(C|F)=0.01/0.021=10/21≈0.4762. The highest-risk machine contributes nearly half of failures despite only a 20% selection share."
      ] }
    ],
    quiz: [
      { question: "A population is split into disjoint cases B₁ and B₂. Which expression gives P(A)?", options: ["P(A | B₁)+P(A | B₂)", "P(A | B₁)P(B₁)+P(A | B₂)P(B₂)", "P(B₁ | A)P(B₂ | A)", "P(A | B₁)/P(B₁)"], answer: 1, difficulty: "easy", explanation: "Each conditional probability must be weighted by how often its case occurs. Without those weights, the expression ignores prior proportions." },
      { question: "A factory produces 75% of items on A (2% defective) and 25% on B (6% defective). What is P(defective)?", options: ["2%", "3%", "4%", "6%"], answer: 1, difficulty: "medium", explanation: "Total probability gives 0.75·0.02+0.25·0.06=0.015+0.015=0.03. Averaging 2% and 6% equally would ignore production shares." },
      { question: "Disease prevalence is 1%, sensitivity is 90%, and false-positive rate is 5%. Approximately what fraction of positive tests are true positives?", options: ["90%", "50%", "15.4%", "7.7%"], answer: 2, difficulty: "hard", explanation: "Posterior = 0.90·0.01/[0.90·0.01+0.05·0.99]=0.009/0.0585≈0.1538, or 15.4%. Sensitivity is P(positive | disease), not P(disease | positive)." }
    ]
  },
  {
    id: "expectation-variance", rank: 4, title: "Expectation, Indicators & Variance", minutes: 22,
    description: "Use weighted averages and indicators to simplify random quantities.",
    objective: "Compute expectations and variance, use linearity without assuming independence, and recognise covariance terms.",
    body: [
      "For a discrete random variable X, E[X]=Σx xP(X=x), when the sum is defined. It is a probability-weighted average; X need not ever equal its expectation.",
      "Linearity, E[aX+bY+c]=aE[X]+bE[Y]+c, holds whenever expectations exist, even if X and Y are dependent. Independence is not a requirement for linearity.",
      "Variance measures squared deviation from the mean: Var(X)=E[(X−E[X])²]=E[X²]−E[X]². It has squared units, while standard deviation returns to the original units.",
      "For sums, Var(X+Y)=Var(X)+Var(Y)+2Cov(X,Y). The covariance term disappears for independent variables, but dependence can make the variance larger or smaller than the sum of variances.",
      "An indicator 1_A equals 1 when A occurs and 0 otherwise. Since E[1_A]=P(A), indicators turn a count into a sum and often make expectations easy."
    ],
    formulas: [
      { label: "Expectation", text: "E[X] = Σₓ x P(X=x)" },
      { label: "Variance", text: "Var(X) = E[X²] − (E[X])²" },
      { label: "Variance of a sum", text: "Var(X+Y) = Var(X) + Var(Y) + 2 Cov(X,Y)" },
      { label: "Indicator", text: "E[1_A] = P(A)" }
    ],
    examples: [
      { title: "Expected number of successes", problem: "Ten trials each succeed with probability 0.2. Find the expected number of successes without using the binomial formula.", steps: [
        "Let Iᵢ be the indicator of success on trial i. Then S=I₁+···+I₁₀.",
        "Each indicator has E[Iᵢ]=0.2. By linearity, E[S]=ΣE[Iᵢ]=10·0.2=2.",
        "The same expectation holds if the trials are dependent, provided each indicator still has expectation 0.2."
      ] },
      { title: "A covariance correction", problem: "Let Var(X)=4, Var(Y)=9 and Cov(X,Y)=−2. Find Var(X+Y).", steps: [
        "Use Var(X+Y)=Var(X)+Var(Y)+2Cov(X,Y).",
        "Substitute 4 + 9 + 2(−2) = 9.",
        "Adding 4 and 9 alone would be correct only if covariance were zero."
      ] },
      { title: "Scaling a random variable", problem: "A random variable X has mean 5 and variance 4. Find the mean and variance of Y=3X−2.", steps: [
        "Expectation transforms linearly: E[Y]=3E[X]−2=3(5)−2=13.",
        "Adding or subtracting a constant does not change variance, while multiplying by 3 multiplies variance by 3².",
        "Thus Var(Y)=9Var(X)=36. Variance has squared units, so the factor is 9 rather than 3."
      ] }
    ],
    quiz: [
      { question: "A random variable equals 0 with probability 1/4 and 4 with probability 3/4. Its expectation is", options: ["1", "2", "3", "4"], answer: 2, difficulty: "easy", explanation: "E[X]=0·1/4+4·3/4=3. The most likely value is 4, but expectation is a weighted average, not a mode." },
      { question: "Which statement about E[X+Y] is always true when expectations exist?", options: ["E[X+Y]=E[X]E[Y]", "E[X+Y]=E[X]+E[Y]", "It holds only if X,Y are independent", "E[X+Y]=0"], answer: 1, difficulty: "medium", explanation: "Expectation is linear without an independence assumption. The product formula is not a rule for the expectation of a sum." },
      { question: "If Var(X)=4, Var(Y)=9 and Corr(X,Y)=−1/2, find Var(X+Y).", options: ["13", "7", "9", "1"], answer: 1, difficulty: "hard", explanation: "Standard deviations are 2 and 3, so Cov=Corr·σXσY=−3. Therefore Var(X+Y)=4+9+2(−3)=7." }
    ]
  },
  {
    id: "discrete-distributions", rank: 5, title: "Discrete Distributions & Model Choice", minutes: 24,
    description: "Choose a distribution from the experiment, not from a memorised list.",
    objective: "Model Bernoulli trials, sampling without replacement, waiting times, and rare-event counts.",
    body: [
      "A Bernoulli variable records one success/failure trial with success probability p. A binomial variable counts successes in n independent Bernoulli trials with the same p; the fixed number of trials is essential.",
      "A geometric variable counts trials until the first success, with P(T=k)=(1−p)^(k−1)p when the successful trial is counted. Its memoryless property follows from independent repeated trials.",
      "A hypergeometric variable counts successes in a sample drawn without replacement from a finite population. Outcomes are dependent because each draw changes the remaining composition.",
      "A Poisson variable models counts of rare, approximately independent events over a fixed exposure. Its parameter λ is the expected count. It also appears exactly as the count law in a homogeneous Poisson process.",
      "Identify the random quantity, trial structure, replacement rule, independence, and what is fixed. Write the model before substituting numbers."
    ],
    formulas: [
      { label: "Binomial PMF", text: "P(X=k) = C(n,k)pᵏ(1−p)ⁿ⁻ᵏ" },
      { label: "Geometric PMF", text: "P(T=k) = (1−p)ᵏ⁻¹p, k=1,2,…" },
      { label: "Hypergeometric PMF", text: "P(X=k) = C(K,k)C(N−K,n−k)/C(N,n)" },
      { label: "Poisson PMF", text: "P(X=k) = e⁻λ λᵏ/k!" }
    ],
    examples: [
      { title: "Without replacement", problem: "A box has 5 red and 7 blue balls. Two are drawn without replacement. Find the probability both are red.", steps: [
        "After the first red, only 4 red balls remain among 11 balls.",
        "P(two red)=(5/12)(4/11)=20/132=5/33.",
        "The binomial expression (5/12)² is wrong because the draw probabilities change without replacement."
      ] },
      { title: "A rare count", problem: "A component has an average of 0.4 failures per week under a Poisson model. Find the probability of zero failures in a week.", steps: [
        "Use X ~ Poisson(λ=0.4).",
        "P(X=0)=e^(−0.4)·0.4⁰/0! = e^(−0.4).",
        "Numerically this is about 0.6703. The mean 0.4 is not itself the probability of a failure."
      ] },
      { title: "A geometric waiting time", problem: "A trial succeeds independently with probability 0.2. If T counts trials through the first success, find P(T>4) and P(T=5).", steps: [
        "T>4 means the first four trials all fail, so P(T>4)=(0.8)⁴=0.4096.",
        "T=5 means four failures followed by a success.",
        "Therefore P(T=5)=(0.8)⁴(0.2)=0.08192. The geometric support starts at 1 under this convention."
      ] }
    ],
    quiz: [
      { question: "Which model fits the number of defective items in 20 independent checks, each with defect probability 0.03?", options: ["Binomial(20, 0.03)", "Geometric(20)", "Hypergeometric(20, 0.03)", "Normal(20, 0.03)"], answer: 0, difficulty: "easy", explanation: "The trial count is fixed, outcomes are independent, and success probability is constant: a binomial model. Hypergeometric sampling is without replacement from a finite population." },
      { question: "If T is geometric with success probability p=0.2, counting the successful trial, what is P(T=3)?", options: ["0.008", "0.032", "0.128", "0.160"], answer: 2, difficulty: "medium", explanation: "Two failures then a success gives (0.8)²(0.2)=0.128. The smaller value 0.032 incorrectly applies the success probability twice." },
      { question: "Choose 2 cards without replacement from a 10-card deck with 4 red cards. What is the probability both are red?", options: ["4/25", "2/15", "4/15", "1/5"], answer: 1, difficulty: "hard", explanation: "P(both red)=C(4,2)/C(10,2)=6/45=2/15. Squaring 4/10 would incorrectly treat the draws as independent." }
    ]
  },
  {
    id: "continuous-rv", rank: 4, title: "Continuous Random Variables & Transformations", minutes: 24,
    description: "Work with densities, distribution functions, and transformed random quantities.",
    objective: "Normalize a density, compute interval probabilities and expectations, and transform a continuous random variable.",
    body: [
      "A continuous random variable is described by a density f with f(x)≥0 and integral over the support equal to 1. Probabilities are areas: P(a≤X≤b)=∫ₐᵇf(x)dx. A single point has probability zero under a density.",
      "The CDF F(x)=P(X≤x) is the integral of the density up to x. Where differentiable, F′(x)=f(x); the CDF is defined even where a density is inconvenient.",
      "Expectation extends sums to integrals: E[g(X)]=∫g(x)f(x)dx. Do not confuse density height f(x) with P(X=x), which is zero for an absolutely continuous variable.",
      "For a monotone differentiable transformation Y=g(X), fY(y)=fX(g⁻¹(y))|d g⁻¹(y)/dy|. For non-monotone transformations, sum the contributions from every inverse branch.",
      "A transformation can change the support and can create more than one inverse branch. For Y=g(X), add the density contributions from every solution x of g(x)=y, each weighted by 1/|g′(x)| where the derivative is nonzero. Always derive the transformed support before applying the formula."
      "Uniform, exponential, normal, gamma and beta distributions are a toolkit, not interchangeable formulas. Select a distribution by assumptions and support, then check units and normalization."
    ],
    formulas: [
      { label: "CDF", text: "F(x) = ∫₋∞ˣ f(t) dt" },
      { label: "Expectation of a function", text: "E[g(X)] = ∫ g(x)f(x) dx" },
      { label: "Monotone transformation", text: "fY(y) = fX(g⁻¹(y)) |d g⁻¹(y)/dy|" },
      { label: "Exponential survival", text: "P(X > t) = e⁻λᵗ, t ≥ 0" }
    ],
    examples: [
      { title: "Normalize a density", problem: "Let f(x)=cx on 0≤x≤2 and 0 otherwise. Find c and P(X>1).", steps: [
        "Normalization requires ∫₀²cx dx=2c=1, so c=1/2.",
        "P(X>1)=∫₁²x/2 dx=[x²/4]₁²=3/4.",
        "This is an area under the density; f(1)=1/2 is a height, not P(X=1)."
      ] },
      { title: "Transform a uniform variable", problem: "If X is Uniform(0,1) and Y=X², find the CDF and density of Y.", steps: [
        "For 0≤y≤1, F_Y(y)=P(X²≤y)=P(X≤√y)=√y.",
        "Differentiate: f_Y(y)=1/(2√y) for 0<y<1.",
        "The density is large near zero but integrable: ∫₀¹1/(2√y)dy=1."
      ] },
      { title: "A non-monotone transformation", problem: "Let X be Uniform(−1,1) and Y=|X|. Find the density of Y.", steps: [
        "The support of Y is [0,1]. For 0≤y≤1, F_Y(y)=P(−y≤X≤y).",
        "The interval has length 2y inside a uniform interval of length 2, so F_Y(y)=y.",
        "Differentiating gives f_Y(y)=1 on 0<y<1. Both inverse branches x=y and x=−y contribute to the density."
      ] }
    ],
    quiz: [
      { question: "For a continuous random variable X, what is P(X=2) when X has a density?", options: ["Always 1/2", "Always equal to f(2)", "0", "It depends on the unit"], answer: 2, difficulty: "easy", explanation: "A single point has zero area under a density. Density is probability per unit, not the probability of the point." },
      { question: "If X is Uniform(0,1), what is P(X² ≤ 1/4)?", options: ["1/4", "1/2", "3/4", "1"], answer: 1, difficulty: "medium", explanation: "On [0,1], X²≤1/4 is equivalent to X≤1/2, which has probability 1/2." },
      { question: "A density is f(x)=cx on [0,2]. What is P(X>1)?", options: ["1/4", "1/2", "3/4", "1"], answer: 2, difficulty: "hard", explanation: "Normalization gives c=1/2. Integrating from 1 to 2 gives ∫x/2 dx=3/4, not the density height at the endpoint." }
    ]
  },
  {
    id: "joint-distributions", rank: 3, title: "Joint Distributions, Covariance & Dependence", minutes: 26,
    description: "Move from one random variable to vectors of random variables.",
    objective: "Derive marginals and conditional distributions, test independence, and calculate covariance.",
    body: [
      "A joint PMF or density describes two variables together. Marginals are obtained by summing or integrating over the other coordinate, and must themselves be valid distributions.",
      "For discrete variables, P(X=x)=ΣᵧP(X=x,Y=y). For continuous variables, fX(x)=∫fX,Y(x,y)dy. The principle is to remove the coordinate that is no longer needed.",
      "Independence means the joint law factors into the product of marginals at every relevant point. Matching means or zero covariance alone is not enough to prove independence in general.",
      "Covariance is Cov(X,Y)=E[XY]−E[X]E[Y]. Its sign records linear association, not all dependence. Correlation divides by the product of standard deviations and is dimensionless when both are positive.",
      "Conditional densities and conditional expectations allow a model to change with observed information. They are central to regression, Bayesian reasoning, portfolio risk and stochastic processes."
    ],
    formulas: [
      { label: "Marginal density", text: "fX(x)=∫fX,Y(x,y)dy" },
      { label: "Conditional density", text: "fX|Y(x|y)=fX,Y(x,y)/fY(y)" },
      { label: "Covariance", text: "Cov(X,Y)=E[XY]−E[X]E[Y]" },
      { label: "Correlation", text: "Corr(X,Y)=Cov(X,Y)/(σXσY)" }
    ],
    examples: [
      { title: "A triangular joint density", problem: "Suppose f(x,y)=2 on 0<x<y<1 and zero elsewhere. Find E[X], E[Y] and Cov(X,Y).", steps: [
        "The marginal density of X is ∫ₓ¹2dy=2(1−x), while that of Y is ∫₀ʸ2dx=2y.",
        "Integrating gives E[X]=1/3 and E[Y]=2/3.",
        "E[XY]=∫₀¹∫₀ʸ2xy dxdy=1/4. Thus Cov(X,Y)=1/4−(1/3)(2/3)=1/36."
      ] },
      { title: "Factorization test", problem: "A joint PMF assigns probability 1/4 to each of (0,0),(0,1),(1,0),(1,1). Are X and Y independent?", steps: [
        "Both marginals are Bernoulli(1/2): each coordinate is 0 or 1 with probability 1/2.",
        "For each pair, p(x,y)=1/4=(1/2)(1/2)=pX(x)pY(y).",
        "Factorization holds on the whole support, so X and Y are independent."
      ] },
      { title: "Zero covariance without independence", problem: "Let X be Uniform(−1,1) and Y=X². Show that X and Y have zero covariance but are dependent.", steps: [
        "Symmetry gives E[X]=0 and E[X³]=0, while E[XY]=E[X³]=0.",
        "Therefore Cov(X,Y)=E[XY]−E[X]E[Y]=0.",
        "But Y is determined by X and is not constant, so they are dependent. Zero covariance only rules out linear association."
      ] }
    ],
    quiz: [
      { question: "For discrete X and Y, how is the marginal P(X=x) obtained from the joint PMF?", options: ["Multiply all joint probabilities", "Sum P(X=x,Y=y) over all y", "Condition on X=x", "Subtract P(Y=y)"], answer: 1, difficulty: "easy", explanation: "All possible values of Y partition the event X=x, so their joint probabilities are summed." },
      { question: "If X and Y are independent with finite expectations, then Cov(X,Y) equals", options: ["1", "E[X]E[Y]", "0", "Var(X)+Var(Y)"], answer: 2, difficulty: "medium", explanation: "Independence implies E[XY]=E[X]E[Y], so covariance is zero. Zero covariance alone does not imply independence." },
      { question: "For f(x,y)=2 on 0<x<y<1, what is Cov(X,Y)?", options: ["0", "1/36", "1/12", "−1/36"], answer: 1, difficulty: "hard", explanation: "The means are 1/3 and 2/3, and E[XY]=1/4. Therefore covariance is 1/4−2/9=1/36." }
    ]
  },
  {
    id: "conditional-expectation", rank: 3, title: "Conditional Expectation & Variance Decomposition", minutes: 25,
    description: "Average within each information set, then average across information sets.",
    objective: "Calculate conditional expectations and apply the tower property and law of total variance.",
    body: [
      "E[X|Y] is itself a random variable: it assigns the expected value of X to each observed value of Y. In a finite model, compute a weighted average inside each Y-case using the conditional distribution of X.",
      "The tower property says E[E[X|Y]]=E[X]. Conditioning refines available information; averaging the conditional means restores the unconditional mean.",
      "The law of total variance separates uncertainty within groups from uncertainty between group means: Var(X)=E[Var(X|Y)]+Var(E[X|Y]). Both terms are nonnegative.",
      "Conditional expectation is not generally equal to the observed value, nor does it remove all uncertainty. Under finite second moments, it is the optimal mean-square prediction given the information being conditioned on."
    ],
    formulas: [
      { label: "Tower property", text: "E[E[X|Y]] = E[X]" },
      { label: "Total variance", text: "Var(X)=E[Var(X|Y)]+Var(E[X|Y])" },
      { label: "Conditional mean", text: "E[X|Y=y]=Σₓ x P(X=x|Y=y)" }
    ],
    examples: [
      { title: "Two possible machines", problem: "A randomly chosen machine is A with probability 1/4 and B with probability 3/4. Their mean outputs are 10 and 20. Find the overall mean.", steps: [
        "Let Y identify the machine. The conditional means are E[X|A]=10 and E[X|B]=20.",
        "Average the means using the machine probabilities: E[X]=(1/4)10+(3/4)20.",
        "The result is 17.5. This is the tower property, E[E[X|Y]]=E[X]."
      ] },
      { title: "Total variance", problem: "Suppose Var(X|Y)=4 in every group, and E[X|Y] is 10 or 14 with equal probability. Find Var(X).", steps: [
        "The expected within-group variance is E[Var(X|Y)]=4.",
        "The conditional mean is equally likely to be 10 or 14, so its mean is 12 and its variance is 4.",
        "Total variance is 4+4=8. Both within-group and between-group uncertainty matter."
      ] },
      { title: "Conditioning on parity", problem: "A fair die is rolled. Let X be its face value and Y indicate whether it is even or odd. Find E[X|Y=even], E[X|Y=odd] and verify the tower property.", steps: [
        "Given an even result, X is uniform on {2,4,6}, so E[X|even]=(2+4+6)/3=4.",
        "Given an odd result, X is uniform on {1,3,5}, so E[X|odd]=(1+3+5)/3=3.",
        "Each parity has probability 1/2, so E[E[X|Y]]=(1/2)4+(1/2)3=3.5=E[X]."
      ] }
    ],
    quiz: [
      { question: "If E[X|Y] equals 2 when Y=0 and 8 when Y=1, with P(Y=1)=1/4, what is E[X]?", options: ["3.5", "5", "6.5", "8"], answer: 0, difficulty: "easy", explanation: "By the tower property, E[X]=(3/4)·2+(1/4)·8=3.5. An unweighted average ignores group probabilities." },
      { question: "The law of total variance is", options: ["Var(X)=E[Var(X|Y)]−Var(E[X|Y])", "Var(X)=E[Var(X|Y)]+Var(E[X|Y])", "Var(X)=Var(E[X|Y]) only", "Var(X)=E[X]²"], answer: 1, difficulty: "medium", explanation: "Total variance is expected within-group variance plus the variance of group means. Subtracting the latter is incorrect." },
      { question: "Group means are 10 and 14 with equal probabilities, and each within-group variance is 4. What is Var(X)?", options: ["4", "6", "8", "12"], answer: 2, difficulty: "hard", explanation: "Between-group variance is 4 and expected within-group variance is 4. Total variance is 8, not just either component." }
    ]
  },
  {
    id: "generating-functions", rank: 3, title: "Probability Generating Functions & MGFs", minutes: 24,
    description: "Encode a distribution in a function so sums and moments become easier.",
    objective: "Use PGFs and moment-generating functions to obtain moments and distributions of independent sums.",
    body: [
      "For nonnegative integer-valued X, its probability generating function is G_X(s)=E[s^X]=ΣₖP(X=k)sᵏ. Its coefficients encode the PMF; derivatives at s=1 give factorial moments when they exist.",
      "If X and Y are independent, G_{X+Y}(s)=G_X(s)G_Y(s). This multiplication rule can be simpler than convolving PMFs term by term.",
      "The moment-generating function is M_X(t)=E[e^{tX}] where finite near zero. Its first derivative at zero gives E[X], and its second derivative gives E[X²]. An MGF that exists in a neighbourhood of zero uniquely determines the distribution.",
      "Not every distribution has an MGF in a neighbourhood of zero. Formal algebra never replaces checking independence and convergence."
    ],
    formulas: [
      { label: "PGF", text: "G_X(s)=E[s^X]=Σₖ pₖsᵏ" },
      { label: "PGF of an independent sum", text: "G_{X+Y}(s)=G_X(s)G_Y(s)" },
      { label: "MGF", text: "M_X(t)=E[eᵗˣ], M′X(0)=E[X]" },
      { label: "Binomial PGF", text: "G_X(s)=(1−p+ps)ⁿ" }
    ],
    examples: [
      { title: "Sum of independent Poisson variables", problem: "X and Y are independent Poisson variables with rates λ and μ. Find the distribution of X+Y using MGFs.", steps: [
        "A Poisson(λ) MGF is M_X(t)=exp(λ(eᵗ−1)); similarly M_Y(t)=exp(μ(eᵗ−1)).",
        "Independence gives M_{X+Y}(t)=M_X(t)M_Y(t)=exp((λ+μ)(eᵗ−1)).",
        "This is the MGF of Poisson(λ+μ), so the sum has that distribution."
      ] },
      { title: "Extract the mean", problem: "X has MGF M_X(t)=exp(λ(eᵗ−1)). Find E[X].", steps: [
        "Differentiate: M′_X(t)=exp(λ(eᵗ−1))·λeᵗ.",
        "At t=0, the exponential factor and e⁰ both equal 1.",
        "Therefore E[X]=M′_X(0)=λ."
      ] },
      { title: "A sum of two Bernoulli variables", problem: "Let X and Y be independent Bernoulli variables with success probabilities 0.2 and 0.5. Use their PGFs to find P(X+Y=0) and E[X+Y].", steps: [
        "Their PGFs are G_X(s)=0.8+0.2s and G_Y(s)=0.5+0.5s.",
        "Independence gives G_{X+Y}(s)=(0.8+0.2s)(0.5+0.5s). The constant coefficient is P(X+Y=0)=0.4.",
        "The mean is 0.2+0.5=0.7 by linearity, or by differentiating the product at s=1."
      ] }
    ],
    quiz: [
      { question: "For a nonnegative integer-valued X, what is the coefficient of s² in G_X(s)?", options: ["E[X²]", "P(X=2)", "P(X≤2)", "Var(X)"], answer: 1, difficulty: "easy", explanation: "G_X(s)=ΣₖP(X=k)sᵏ, so the coefficient of s² is P(X=2). Derivatives, rather than raw coefficients, produce moments." },
      { question: "If independent X and Y have PGFs G_X and G_Y, the PGF of X+Y is", options: ["G_X+G_Y", "G_XG_Y", "G_X/G_Y", "G_X(G_Y(1))"], answer: 1, difficulty: "medium", explanation: "E[s^(X+Y)]=E[s^X]E[s^Y] by independence, so PGFs multiply. This corresponds to convolution of the PMFs." },
      { question: "If X and Y are independent Poisson variables with rates 2 and 3, then X+Y is", options: ["Poisson(1)", "Poisson(5)", "Binomial(5,1/2)", "Poisson(6)"], answer: 1, difficulty: "hard", explanation: "Their MGFs multiply to the Poisson MGF with rate 2+3=5. Adding the rates is the correct operation." }
    ]
  },
  {
    id: "limit-theorems-deep", rank: 2, title: "Convergence, LLN & the Central Limit Theorem", minutes: 28,
    description: "Understand what becomes stable with many observations—and what remains random.",
    objective: "Distinguish modes of convergence, state core assumptions behind LLN and CLT, and standardize sums and averages.",
    body: [
      "The weak law of large numbers states that for IID variables with finite mean μ, the sample mean converges in probability to μ. Large samples usually have averages near the population mean; this does not promise every sample is close.",
      "For IID variables with finite variance σ²>0, the central limit theorem says (Sₙ−nμ)/(σ√n) converges in distribution to a standard normal. Large sums are approximately normal after centring and scaling under suitable conditions.",
      "Convergence in probability controls the chance of a fixed-size error; almost-sure convergence concerns nearly every sample path; convergence in distribution concerns limiting laws. These are distinct statements.",
      "The standard error of the sample mean is σ/√n. Multiplying sample size by four roughly halves this standard error; the individual observations do not become less variable.",
      "Normal approximations are not automatic for tiny samples, heavy tails, strong dependence, or extreme tail probabilities. Check assumptions and standardize carefully."
    ],
    formulas: [
      { label: "Sample mean", text: "X̄ₙ = (1/n)Σᵢ₌₁ⁿ Xᵢ" },
      { label: "CLT standardization", text: "(Sₙ−nμ)/(σ√n) ⇒ N(0,1)" },
      { label: "Standard error of the mean", text: "SE(X̄ₙ)=σ/√n" }
    ],
    examples: [
      { title: "A sample mean", problem: "IID measurements have mean 50 and standard deviation 12. For n=36, use the CLT to estimate P(X̄ is between 46 and 54).", steps: [
        "The sample mean has mean 50 and standard error 12/√36=2.",
        "Standardize the bounds: (46−50)/2=−2 and (54−50)/2=2.",
        "The normal approximation is P(−2≤Z≤2)≈0.9545. Treat this as an approximation whose quality depends on the distribution and sample size."
      ] },
      { title: "What a law of large numbers says", problem: "A fair coin is tossed many times. Which quantity stabilizes near 1/2 under the law of large numbers?", steps: [
        "Every toss remains random with probability 1/2 of heads.",
        "The relative frequency of heads converges in probability to 1/2.",
        "The theorem does not say the next toss becomes more balanced or that heads must occur exactly n/2 times."
      ] },
      { title: "A CLT approximation for a count", problem: "A fair coin is tossed 100 times. Use a normal approximation with continuity correction to estimate P(X≥60).", steps: [
        "X is Binomial(100,0.5), with mean 50 and standard deviation 5.",
        "Continuity correction gives P(X≥60)≈P(Y≥59.5) for Y~N(50,25), so z=(59.5−50)/5=1.9.",
        "The upper tail is approximately 1−Φ(1.9)≈0.0287. The approximation is not an exact binomial probability."
      ] }
    ],
    quiz: [
      { question: "For IID data with finite variance σ², the standard deviation of the sample mean is", options: ["σn", "σ/√n", "σ/n", "σ²/√n"], answer: 1, difficulty: "easy", explanation: "Var(X̄)=σ²/n, so its standard deviation is σ/√n. It is not σ/n." },
      { question: "The central limit theorem primarily describes the limiting distribution of", options: ["Every individual observation becoming normal", "A standardized sum or mean under suitable assumptions", "The population mean changing with n", "All sample paths becoming constant"], answer: 1, difficulty: "medium", explanation: "The CLT applies to appropriately centered and scaled sums or sample means. It does not say each observation or the population itself becomes normal." },
      { question: "If sample size rises from 25 to 100 while σ stays fixed, the standard error of the sample mean", options: ["Doubles", "Halves", "Falls to one quarter", "Does not change"], answer: 1, difficulty: "hard", explanation: "SE is proportional to 1/√n. Increasing n by a factor of four divides SE by √4=2, not by four." }
    ]
  },
  {
    id: "concentration-inequalities", rank: 2, title: "Markov, Chebyshev & Concentration Bounds", minutes: 24,
    description: "Prove conservative bounds when the full distribution is unknown.",
    objective: "Choose and apply Markov and Chebyshev inequalities, and understand how stronger assumptions enable sharper bounds.",
    body: [
      "Markov's inequality applies to a nonnegative random variable X with finite expectation: P(X≥a)≤E[X]/a for a>0. It uses only the mean and is often loose.",
      "Chebyshev's inequality applies when variance is finite: P(|X−μ|≥a)≤σ²/a². It follows by applying Markov to the nonnegative variable (X−μ)².",
      "For independent bounded variables, Hoeffding-type bounds can decay exponentially in sample size. Chernoff bounds often use exponential moments and Markov's inequality to bound tails of sums of Bernoulli variables.",
      "A bound is not an estimate of the true probability. If the bound is 0.2, the true probability could be much smaller. Verify assumptions and units before applying a theorem."
    ],
    formulas: [
      { label: "Markov", text: "P(X ≥ a) ≤ E[X]/a, X ≥ 0" },
      { label: "Chebyshev", text: "P(|X−μ| ≥ a) ≤ Var(X)/a²" },
      { label: "Sample-mean tail", text: "P(|X̄ₙ−μ| ≥ ε) ≤ σ²/(nε²)" }
    ],
    examples: [
      { title: "Markov bound", problem: "A nonnegative loss X has E[X]=12. Bound P(X≥60).", steps: [
        "The variable is nonnegative and the threshold is positive, so Markov applies.",
        "P(X≥60)≤12/60=0.2.",
        "This guarantees at most 20%; it does not say the probability equals 20%."
      ] },
      { title: "Chebyshev bound", problem: "A variable has mean 100 and variance 25. Bound the probability it differs from 100 by at least 10.", steps: [
        "Use a=10 and σ²=25 in Chebyshev's inequality.",
        "P(|X−100|≥10)≤25/100=0.25.",
        "This bound does not require a normal distribution. A normal approximation would need additional assumptions."
      ] },
      { title: "A bound for a sample mean", problem: "IID observations have variance 16. How large must n be to guarantee by Chebyshev that P(|X̄−μ|≥1)≤0.04?", steps: [
        "Chebyshev gives P(|X̄−μ|≥1)≤16/n.",
        "Require 16/n≤0.04.",
        "Thus n≥400 observations guarantee the stated bound. This is a sufficient sample size, not necessarily the smallest possible under a sharper model."
      ] }
    ],
    quiz: [
      { question: "If X≥0 and E[X]=8, Markov gives P(X≥40) ≤", options: ["0.05", "0.2", "0.32", "5"], answer: 1, difficulty: "easy", explanation: "Markov gives E[X]/40=8/40=0.2. The bound is dimensionless; 5 is not a valid probability bound." },
      { question: "A variable has variance 9. Chebyshev bounds P(|X−E[X]|≥6) by", options: ["3/2", "1/4", "1/2", "1/6"], answer: 1, difficulty: "medium", explanation: "Chebyshev gives 9/6²=9/36=1/4. Divide the variance by the square of the deviation." },
      { question: "An IID sample has variance 16. What Chebyshev bound applies to P(|X̄ₙ−μ|≥2) for n=8?", options: ["1", "1/2", "1/4", "1/8"], answer: 1, difficulty: "hard", explanation: "Var(X̄ₙ)=16/8=2, so the bound is 2/2²=1/2. Use the variance of the mean, not one observation." }
    ]
  },
  {
    id: "markov-chain-analysis", rank: 1, title: "Markov Chains: Stationarity & Hitting", minutes: 26,
    description: "Study long-run behaviour, absorbing states, and expected times to reach a target.",
    objective: "Compute stationary distributions for small chains and reason about absorption and hitting probabilities.",
    body: [
      "A discrete-time Markov chain has the memoryless property: conditional on the present state, the future is independent of earlier history. A row-stochastic transition matrix records one-step probabilities and each row sums to one.",
      "A stationary distribution π satisfies πP=π and its entries sum to one. It is unchanged by a transition. It does not automatically describe the limiting distribution from every starting state; irreducibility and aperiodicity are common sufficient conditions for finite chains.",
      "An absorbing state cannot be left once entered. Hitting probabilities and expected hitting times can often be found by conditioning on the first step, producing linear equations.",
      "The long-run fraction of time in a state and the probability of occupying it at a particular time are related but distinct. Reducible chains can have different limiting behaviour from different initial states."
    ],
    formulas: [
      { label: "Stationarity", text: "πP = π, Σᵢ πᵢ = 1" },
      { label: "Two-state stationary balance", text: "π₁p₁₂ = π₂p₂₁" },
      { label: "First-step equation", text: "hᵢ = Σⱼ pᵢⱼ hⱼ for non-target transient states" }
    ],
    examples: [
      { title: "A two-state chain", problem: "The transition matrix is [[0.8,0.2],[0.3,0.7]]. Find a stationary distribution.", steps: [
        "Let π=(a,1−a). Stationarity for the first state requires a=0.8a+0.3(1−a).",
        "Rearrange: 0.5a=0.3, so a=0.6.",
        "The stationary distribution is (0.6,0.4); it sums to one and direct multiplication verifies πP=π."
      ] },
      { title: "Expected time to absorption", problem: "From state 1, a chain moves to absorbing state 0 with probability 1/2 each step, otherwise it remains at 1. Find the expected steps to hit 0.", steps: [
        "Let T be the hitting time from state 1 and m=E[T].",
        "One step always occurs. With probability 1/2 absorption occurs; with probability 1/2 the chain returns to state 1 and expected remaining time is m.",
        "Thus m=1+(1/2)m, giving m=2 steps."
      ] },
      { title: "Two transient states", problem: "A chain starts in A. From A it moves to B with probability 1/4 and otherwise is absorbed; from B it moves to A with probability 1/2 and otherwise is absorbed. Find the expected time to absorption from A.", steps: [
        "Let m_A and m_B be expected remaining steps. First-step equations are m_A=1+(1/4)m_B and m_B=1+(1/2)m_A.",
        "Substitute the second equation into the first: m_A=1+(1/4)(1+(1/2)m_A).",
        "Solving gives (7/8)m_A=5/4, hence m_A=10/7 steps."
      ] }
    ],
    quiz: [
      { question: "A row of a row-stochastic transition matrix sums to", options: ["0", "1", "the stationary probability", "the number of states"], answer: 1, difficulty: "easy", explanation: "Each row is the conditional distribution of the next state given the current state, so its probabilities sum to one." },
      { question: "For P=[[0.8,0.2],[0.3,0.7]], a stationary distribution is", options: ["(0.5,0.5)", "(0.6,0.4)", "(0.8,0.2)", "(0.3,0.7)"], answer: 1, difficulty: "medium", explanation: "Balance flow gives 0.2π₁=0.3π₂, so π₁:π₂=3:2 and π=(0.6,0.4). A row of P is not generally the stationary distribution." },
      { question: "Which condition always holds for a stationary distribution π?", options: ["Pπ=π under every matrix convention", "πP=π under the row-vector convention", "Every state has probability 1/number of states", "The chain is necessarily absorbing"], answer: 1, difficulty: "hard", explanation: "With row vectors and a row-stochastic matrix, stationarity is πP=π. Column-vector conventions transpose the equation; stationarity does not imply uniformity or absorption." }
    ]
  },
  {
    id: "poisson-processes", rank: 1, title: "Poisson Processes & Waiting Times", minutes: 26,
    description: "Connect event counts, exponential waiting times, and independent increments.",
    objective: "Compute Poisson counts and waiting-time probabilities and use thinning and superposition.",
    body: [
      "A homogeneous Poisson process with rate λ has independent increments and a count N(t) distributed as Poisson(λt). Its expected count over an interval of length t is λt.",
      "Interarrival times are IID exponential with rate λ. The exponential distribution is memoryless, so the waiting time from now to the next event has the same law even if the process has already been running.",
      "Independent Poisson processes with rates λ and μ superpose to a process with rate λ+μ. Independently retaining each event with probability p yields a Poisson process with rate pλ.",
      "These results depend on the assumptions. Time-varying intensity, clustering, event dependence and refractory periods may require another point-process model."
    ],
    formulas: [
      { label: "Count distribution", text: "P(N(t)=k)=e⁻λᵗ(λt)ᵏ/k!" },
      { label: "Waiting time", text: "P(T>t)=e⁻λᵗ, E[T]=1/λ" },
      { label: "Superposition rate", text: "λtotal = λ₁ + ··· + λₘ" },
      { label: "Thinning rate", text: "λretained = pλ" }
    ],
    examples: [
      { title: "Calls arriving", problem: "Calls arrive at rate 3 per hour. Find the probability of no calls in the next 20 minutes.", steps: [
        "The interval is 1/3 hour, so the Poisson mean is λt=3·(1/3)=1.",
        "The count is Poisson(1), so P(N=0)=e⁻¹.",
        "The probability is about 0.3679. The rate 3 per hour is not the probability of a call."
      ] },
      { title: "Two event streams", problem: "Independent systems generate events at rates 2 and 5 per minute. What is the expected total count in 3 minutes?", steps: [
        "Superposition gives total rate 2+5=7 events per minute.",
        "Over 3 minutes, the mean count is 7·3=21.",
        "The total count is Poisson(21) under the independent homogeneous-process assumptions."
      ] },
      { title: "At least three arrivals", problem: "Events follow a Poisson process at rate 2 per minute. Find the probability of at least three arrivals in the next minute.", steps: [
        "The one-minute count N has distribution Poisson(2).",
        "Use the complement: P(N≥3)=1−P(N=0)−P(N=1)−P(N=2).",
        "This equals 1−e⁻²(1+2+2)=1−5e⁻²≈0.3233."
      ] }
    ],
    quiz: [
      { question: "A Poisson process has rate 4 per hour. Its expected number of events in 30 minutes is", options: ["1", "2", "4", "8"], answer: 1, difficulty: "easy", explanation: "The expected count is λt=4·0.5=2. Convert minutes to hours before multiplying by the rate." },
      { question: "For a rate-λ Poisson process, the probability of no events in an interval of length t is", options: ["λt", "1−e⁻λᵗ", "e⁻λᵗ", "1/(λt)"], answer: 2, difficulty: "medium", explanation: "N(t) is Poisson(λt), so P(N=0)=e⁻λᵗ. The expression 1−e⁻λᵗ is the probability of at least one event." },
      { question: "Independent Poisson processes have rates 2 and 3 per minute. Half the first process's events are retained independently; all second-process events are retained. What is the combined rate?", options: ["3", "4", "5", "6"], answer: 1, difficulty: "hard", explanation: "Thinning the first process gives rate 2·1/2=1. Superimposing the untouched second process gives 1+3=4 per minute." }
    ]
  },
  {
    id: "monte-carlo", rank: 0, title: "Monte Carlo Estimation & Variance Reduction", minutes: 24,
    description: "Turn random sampling into a numerical method with measurable error.",
    objective: "Build Monte Carlo estimators, estimate standard error, and compare variance-reduction techniques.",
    body: [
      "Monte Carlo estimates μ=E[g(X)] by drawing IID samples and averaging g(Xᵢ). Under finite variance, the estimator is unbiased and its standard error is the standard deviation of g(X) divided by √n.",
      "To estimate a probability p, use indicators Iᵢ=1{event occurs}; their sample mean is the observed frequency and approximate standard error is √(p(1−p)/n), with the estimate substituted for unknown p.",
      "Monte Carlo error decreases at rate 1/√n. To cut standard error in half, approximately quadruple independent sample size. A large simulation cannot repair a wrong model or biased sampling scheme.",
      "Variance reduction includes common random numbers, antithetic variables, stratification and control variates. These can improve precision when assumptions and implementation are correct."
    ],
    formulas: [
      { label: "Monte Carlo estimator", text: "μ̂ₙ=(1/n)Σᵢ₌₁ⁿ g(Xᵢ)" },
      { label: "Estimated standard error", text: "SE(μ̂ₙ)=s_g/√n" },
      { label: "Probability estimate", text: "p̂=K/n, SE ≈ √(p̂(1−p̂)/n)" }
    ],
    examples: [
      { title: "Simulating an event probability", problem: "In 10,000 independent simulations, an event occurs 400 times. Estimate its probability and approximate its standard error.", steps: [
        "The estimate is p̂=400/10,000=0.04.",
        "The plug-in standard error is √(0.04·0.96/10,000) ≈ 0.00196.",
        "This measures simulation noise, not model uncertainty or real-world sampling error."
      ] },
      { title: "How many simulations?", problem: "A Monte Carlo estimator has standard error about 0.02 at n=2,500. Roughly how many samples target standard error 0.005?", steps: [
        "Standard error scales as 1/√n, so reducing it by a factor of four requires multiplying n by 4².",
        "The new sample size is 2,500·16=40,000.",
        "This assumes comparable variance and independent draws; correlated MCMC output needs effective-sample-size adjustments."
      ] }
    ],
    quiz: [
      { question: "If IID Monte Carlo sample size increases from 1,000 to 4,000, its standard error approximately", options: ["Doubles", "Halves", "Falls to one quarter", "Stays the same"], answer: 1, difficulty: "easy", explanation: "Standard error scales as 1/√n. Quadrupling n halves error; it does not cut error to one quarter." },
      { question: "A simulation estimates a probability as 0.25 from 10,000 independent trials. Its approximate standard error is", options: ["0.25", "0.0043", "0.025", "0.075"], answer: 1, difficulty: "medium", explanation: "√(0.25·0.75/10,000)=√0.00001875≈0.00433. Standard error is not the probability itself." },
      { question: "Why may a very large Monte Carlo run still be misleading?", options: ["Sampling error always grows with n", "It can estimate the wrong model very precisely", "Averages cannot estimate expectations", "Standard error does not depend on variance"], answer: 1, difficulty: "hard", explanation: "More samples reduce Monte Carlo noise for the implemented model, but cannot correct model misspecification, biased sampling, or coding errors." }
    ]
  },
  {
    id: "martingales", rank: 0, title: "Martingales, Stopping Times & Fair Games", minutes: 26,
    description: "Formalize fair-game reasoning using conditional expectation.",
    objective: "Recognise martingales, verify the defining conditional-mean property, and use stopping-time language carefully.",
    body: [
      "A filtration Fₙ represents the information available by time n. A process Mₙ is adapted when Mₙ is measurable using Fₙ. If each Mₙ is integrable and E[Mₙ₊₁|Fₙ]=Mₙ, it is a martingale: conditional on all current information, the next expected value is the present value.",
      "A martingale is not constant or non-random; individual paths can fluctuate and its variance can grow. A submartingale satisfies E[Mₙ₊₁|Fₙ]≥Mₙ, while a supermartingale satisfies the reverse inequality. These are statements about conditional drift, not every realized step.",
      "A stopping time τ is a random time whose occurrence by time n can be decided from Fₙ. For example, the first time a running sum reaches a fixed threshold is a stopping time. The last time before a fixed horizon that the process is at its maximum is generally not, because deciding it requires knowing the future.",
      "A basic optional-stopping result says E[Mτ]=E[M₀] when τ is a bounded stopping time and M is an integrable martingale (with the usual discrete-time setup). Other versions allow unbounded τ but require additional conditions, such as uniform integrability or suitable bounds on increments and expected duration.",
      "The hypotheses matter. For a simple symmetric random walk started at 0, let τ be the first hitting time of +1. It is finite almost surely and Sτ=1, so E[Sτ]=1, not 0. There is no contradiction: τ is unbounded and the conditions needed to pass from the stopped martingales Sₙ∧τ to the limit are not satisfied."
    ],
    formulas: [
      { label: "Martingale condition", text: "E[Mₙ₊₁ | Fₙ] = Mₙ" },
      { label: "Optional stopping (bounded τ)", text: "If τ≤N, then E[Mτ]=E[M₀]" },
      { label: "Centered IID sum", text: "Mₙ=Σᵢ₌₁ⁿ(Xᵢ−E[Xᵢ])" }
    ],
    examples: [
      { title: "A fair random walk", problem: "Let Sₙ be the sum of independent increments taking +1 and −1 with equal probabilities. Explain why Sₙ is a martingale.", steps: [
        "The next increment has conditional mean zero given past observations.",
        "Thus E[Sₙ₊₁|Fₙ]=E[Sₙ+Δₙ₊₁|Fₙ]=Sₙ.",
        "The current position is the conditional expected next position even though the next step is random."
      ] },
      { title: "A bounded stopping rule", problem: "Let Sₙ be a fair random walk and τ=min(T, first n with Sₙ=2), where T is a fixed positive integer. Find E[Sτ].", steps: [
        "The first hitting time and the fixed time T are stopping times, so their minimum τ is a stopping time.",
        "Also τ≤T, so the bounded optional-stopping result applies.",
        "Therefore E[Sτ]=E[S₀]=0. This does not say Sτ=0 on each path; positive and negative stopped outcomes balance in expectation."
      ] },
      { title: "Why an unbounded rule needs care", problem: "For a fair simple random walk started at 0, τ is the first time Sₙ=1. Why does Sτ=1 not contradict the martingale property?", steps: [
        "The walk hits +1 almost surely, so Sτ=1 almost surely and E[Sτ]=1.",
        "The stopping time is not bounded; its expected duration is infinite.",
        "The bounded optional-stopping theorem does not apply, and the stopped martingales do not satisfy the uniform-integrability condition needed for this limit argument."
      ] }
    ],
    quiz: [
      { question: "A martingale must satisfy which condition?", options: ["Mₙ₊₁=Mₙ on every path", "E[Mₙ₊₁|Fₙ]=Mₙ", "E[Mₙ]=0 for all processes", "Its variance must be constant"], answer: 1, difficulty: "easy", explanation: "The defining condition is equality of next conditional mean and present value. Individual paths may move and variance may change." },
      { question: "Which event defines a stopping time for an adapted process?", options: ["The first time it reaches 5", "The last time it is below 5 before time 100", "The time of its global maximum over all future time", "The time immediately before its next jump"], answer: 0, difficulty: "medium", explanation: "By time n, one can determine whether the process has reached 5 at or before n. The other rules require future information." },
      { question: "A fair simple random walk is stopped when it first reaches +1. Why does E[Sτ]=1 not violate optional stopping?", options: ["The walk is not a martingale", "The stopping time is bounded", "The hypotheses for the bounded optional-stopping result fail", "The terminal value is not integrable"], answer: 2, difficulty: "hard", explanation: "The hitting time is almost surely finite but unbounded with infinite expected duration. The conditions that justify optional stopping at this limit are not met." }
    ]
  },
  {
    id: "mcmc", rank: 0, title: "MCMC & Metropolis–Hastings", minutes: 28,
    description: "Sample from distributions that are difficult to normalize or sample from directly.",
    objective: "Explain the target distribution, proposal mechanism, acceptance rule, mixing diagnostics, and limitations of MCMC.",
    body: [
      "Monte Carlo estimates expectations from samples. MCMC constructs a dependent Markov chain whose stationary distribution is the target; after adequate mixing, its states approximate target expectations.",
      "For a Metropolis–Hastings proposal q(y|x), acceptance is α(x,y)=min(1, π(y)q(x|y)/[π(x)q(y|x)]). The normalizing constant of π cancels, which makes the method useful for unnormalized targets.",
      "Accepted proposals move the chain; rejected proposals repeat the current state. Samples are dependent, so iteration count is not the same as independent sample size. Autocorrelation lowers effective sample size.",
      "Burn-in, trace plots, multiple chains, autocorrelation and effective sample size are diagnostic tools, not proofs of convergence. Poor proposal scales can make a chain move too rarely or wander inefficiently."
    ],
    formulas: [
      { label: "Metropolis–Hastings acceptance", text: "α(x,y)=min(1, π(y)q(x|y)/(π(x)q(y|x)))" },
      { label: "Target expectation estimate", text: "μ̂=(1/n)Σᵢ₌₁ⁿ g(Xᵢ)" },
      { label: "Effective sample size intuition", text: "ESS ≈ n/(1+2Σₖ≥₁ρₖ)" }
    ],
    examples: [
      { title: "A symmetric proposal", problem: "A Metropolis chain uses a symmetric proposal. The target density at the proposed state is 3 times that at the current state. What is the acceptance probability?", steps: [
        "Symmetry means q(y|x)=q(x|y), so the proposal ratio cancels.",
        "Acceptance is min(1,π(y)/π(x))=min(1,3)=1.",
        "A lower-density proposal can still be accepted with a probability below one, allowing exploration beyond uphill moves."
      ] },
      { title: "Why dependence matters", problem: "A chain produces 10,000 draws with strong positive autocorrelation. Why may its precision be worse than 10,000 IID draws?", steps: [
        "Nearby chain states often contain overlapping information about the target.",
        "Positive autocorrelation inflates the variance of sample averages relative to independent draws.",
        "Effective sample size can be far below 10,000; convergence and mixing diagnostics matter in addition to raw iteration count."
      ] }
    ],
    quiz: [
      { question: "For a symmetric Metropolis proposal, the acceptance probability is", options: ["min(1, π(y)/π(x))", "π(x)+π(y)", "always 1/2", "q(y|x)/q(x|y) only"], answer: 0, difficulty: "easy", explanation: "Proposal probabilities cancel because they are equal in both directions. The target density ratio remains, capped at one." },
      { question: "A proposed state has target density half the current state under a symmetric proposal. Its acceptance probability is", options: ["1", "1/2", "0", "2"], answer: 1, difficulty: "medium", explanation: "α=min(1,0.5)=0.5. The chain sometimes accepts lower-density moves so it can explore the full target." },
      { question: "Which statement about MCMC output is correct?", options: ["Every iteration is independent by construction", "The raw iteration count always equals effective sample size", "Autocorrelation can reduce effective sample size", "Acceptance rate alone proves convergence"], answer: 2, difficulty: "hard", explanation: "MCMC samples are generally dependent, so autocorrelation reduces effective information. Neither iteration count nor acceptance rate alone proves convergence." }
    ]
  }
];