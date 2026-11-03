"use client";

import { useEffect, useMemo, useState } from "react";

type Problem = {
  id: string;
  chapter: 4 | 5;
  title: string;
  prompt: string;
  solution: string[];
  answer: string;
};

const problems: Problem[] = [
  {
    id: "4.1", chapter: 4, title: "Drawing two balls from an urn",
    prompt: "Two balls are chosen randomly from an urn containing 8 white, 4 black, and 2 orange balls. We win $2 for each black ball selected and lose $1 for each white ball selected. Let X denote our winnings. What are the possible values of X, and what are the probabilities associated with each value?",
    solution: [
      "There are 14 balls, and choosing 2 without regard to order gives C(14,2) = 91 equally likely pairs.",
      "If a pair contains w white balls and b black balls, its winnings are X = 2b − w. Orange balls contribute $0.",
      "Enumerate the six possible colour-pairs: WW gives X = −2 (C(8,2)=28); WO gives X = −1 (8·2=16); OO gives X = 0 (C(2,2)=1); WB gives X = 1 (8·4=32); BO gives X = 2 (4·2=8); BB gives X = 4 (C(4,2)=6).",
      "Divide each count by 91. The probabilities sum to (28+16+1+32+8+6)/91 = 1."
    ],
    answer: "P(X=−2)=28/91, P(X=−1)=16/91, P(X=0)=1/91, P(X=1)=32/91, P(X=2)=8/91, P(X=4)=6/91."
  },
  {
    id: "4.2", chapter: 4, title: "Product of two fair dice",
    prompt: "Two fair dice are rolled. Let X equal the product of the two dice. Compute P(X=i) for i=1,…,36.",
    solution: [
      "The sample space consists of 36 ordered pairs (a,b), each with probability 1/36.",
      "For a given integer i, count the ordered factor pairs (a,b) with 1≤a,b≤6 and ab=i. Each such pair contributes one outcome.",
      "The only possible products and their numbers of ordered representations are: 1:1; 2:2; 3:2; 4:3; 5:2; 6:4; 8:2; 9:1; 10:2; 12:4; 15:2; 16:1; 18:2; 20:2; 24:2; 25:1; 30:2; 36:1.",
      "Every other integer from 1 to 36 has probability zero. Divide each listed count by 36."
    ],
    answer: "Nonzero probabilities: P(X=1)=1/36; P(X=2)=P(X=3)=P(X=5)=P(X=8)=P(X=10)=P(X=15)=P(X=18)=P(X=20)=P(X=24)=P(X=30)=2/36; P(X=4)=P(X=6)=P(X=12)=4/36; P(X=9)=P(X=16)=P(X=25)=P(X=36)=1/36."
  },
  {
    id: "4.3", chapter: 4, title: "Sum of three dice",
    prompt: "Three dice are rolled. Assuming that each of the 6³ = 216 possible outcomes is equally likely, find the probabilities attached to the possible values of X, where X is the sum of the 3 dice.",
    solution: [
      "The minimum sum is 1+1+1=3 and the maximum is 6+6+6=18.",
      "There are 216 ordered triples. Count the triples for each sum by convolving the one-die counts (or by listing the possibilities systematically).",
      "The counts for sums 3 through 18 are 1, 3, 6, 10, 15, 21, 25, 27, 27, 25, 21, 15, 10, 6, 3, 1.",
      "The counts are symmetric because replacing each die result r by 7−r maps sum s to 21−s. Divide each count by 216."
    ],
    answer: "For x=3,…,18, P(X=x) = (1,3,6,10,15,21,25,27,27,25,21,15,10,6,3,1)/216, respectively."
  },
  {
    id: "4.4", chapter: 4, title: "Best-ranked woman",
    prompt: "Five men and 5 women are ranked according to their scores on an examination. Assume that no two scores are alike and all 10! possible rankings are equally likely. Let X denote the highest ranking achieved by a woman (X=1 if the top-ranked person is female). Find P(X=i), i=1,2,…,10.",
    solution: [
      "X=i means the first i−1 positions are occupied by men and position i is occupied by a woman.",
      "For i≤6, the probability is (5/10)(4/9)…((6−i)/(11−i))·(5/(11−i)) when written as the sequential probability of i−1 men followed by a woman. Equivalently, P(X=i)=[(5)_(i−1)/(10)_(i−1)]·[5/(11−i)], where (n)_k is a falling factorial.",
      "For i=1,…,6 this gives 1/2, 5/18, 5/36, 5/84, 5/252, and 1/252.",
      "A woman must appear by rank 6 because there are only five men. Therefore P(X=i)=0 for i=7,…,10."
    ],
    answer: "P(X=1,…,6)=(1/2, 5/18, 5/36, 5/84, 5/252, 1/252); P(X=7)=…=P(X=10)=0."
  },
  {
    id: "5.1", chapter: 5, title: "Normalising a density and finding its CDF",
    prompt: "Let X have density f(x)=c(1−x²) for −1<x<1 and f(x)=0 otherwise. (a) Find c. (b) Find the cumulative distribution function of X.",
    solution: [
      "A density integrates to 1: c∫₋₁¹(1−x²)dx=1.",
      "The integral is [x−x³/3]₋₁¹=4/3, so c=3/4.",
      "For −1<x<1, F(x)=∫₋₁ˣ(3/4)(1−t²)dt = 1/2+3x/4−x³/4.",
      "Outside the support, F(x)=0 for x≤−1 and F(x)=1 for x≥1."
    ],
    answer: "c=3/4; F(x)=0 (x≤−1), 1/2+3x/4−x³/4 (−1<x<1), and 1 (x≥1)."
  },
  {
    id: "5.2", chapter: 5, title: "Reliability of a unit with a spare",
    prompt: "A system consisting of one original unit plus a spare can function for a random amount of time X. Its density is f(x)=Cxe^(−x/2) for x>0 and 0 otherwise. Find the probability that the system functions for at least 5 months.",
    solution: [
      "First normalise the density: 1=C∫₀∞xe^(−x/2)dx. The integral is 4, so C=1/4.",
      "We need P(X≥5)=∫₅∞(1/4)xe^(−x/2)dx.",
      "Integration by parts gives the survival probability e^(−5/2)(1+5/2)."
    ],
    answer: "P(X≥5)=(7/2)e^(−5/2)≈0.2873."
  },
  {
    id: "5.3", chapter: 5, title: "Checking whether a function is a density",
    prompt: "For each function, determine whether a constant C can make it a probability density: (i) f(x)=C(2x−x³), 0<x<5/2; (ii) f(x)=C(2x−x²), 0<x<5/2. In both cases f(x)=0 otherwise.",
    solution: [
      "A probability density must be nonnegative throughout its support as well as integrate to 1.",
      "For (i), 2x−x³=x(2−x²) is negative when x>√2. This interval lies inside (0,5/2), so no constant C can make the function nonnegative everywhere and have positive total integral.",
      "For (ii), 2x−x²=x(2−x) is negative when x>2, also inside (0,5/2). Again no constant C can make it a density."
    ],
    answer: "Neither function can be a probability density on the stated interval."
  },
  {
    id: "5.4", chapter: 5, title: "Pareto-type lifetime distribution",
    prompt: "A device lifetime X (hours) has density f(x)=10/x² for x>10 and 0 for x≤10. (a) Find P(X>20). (b) Find F(x). (c) For six such devices, find the probability that at least three function for at least 15 hours. State your assumptions.",
    solution: [
      "(a) P(X>20)=∫₂₀∞10x⁻²dx=10/20=1/2.",
      "(b) F(x)=0 for x≤10. For x>10, F(x)=∫₁₀ˣ10t⁻²dt=1−10/x.",
      "(c) For one device, p=P(X≥15)=10/15=2/3. If the six lifetimes are independent and identically distributed, N, the number lasting at least 15 hours, is Binomial(6,2/3).",
      "Thus P(N≥3)=1−[1+12+60]/729=656/729≈0.8999."
    ],
    answer: "(a) 1/2. (b) F(x)=0 for x≤10 and 1−10/x for x>10. (c) 656/729≈0.8999, assuming independent lifetimes with the stated common distribution."
  },
  {
    id: "5.5", chapter: 5, title: "Tank capacity and a 1% exhaustion risk",
    prompt: "A filling station's weekly sales volume X, in thousands of gallons, has density f(x)=5(1−x)^4 for 0<x<1 and 0 otherwise. What tank capacity makes the probability of supply being exhausted in a given week equal to 0.01?",
    solution: [
      "If the tank capacity is c thousand gallons, exhaustion occurs when X>c.",
      "P(X>c)=∫꜀¹5(1−x)^4dx=(1−c)^5.",
      "Set (1−c)^5=0.01. Since 0<c<1, c=1−0.01^(1/5)."
    ],
    answer: "c=1−0.01^(1/5)≈0.6019 thousand gallons, or approximately 602 gallons."
  },
  {
    id: "5.6", chapter: 5, title: "Expected values from three densities",
    prompt: "Compute E[X] for: (a) f(x)=(1/4)xe^(−x/2), x>0; (b) f(x)=c(1−x²), −1<x<1; (c) f(x)=5/x², x>5. Each density is zero otherwise.",
    solution: [
      "(a) E[X]=∫₀∞x·(1/4)xe^(−x/2)dx=(1/4)∫₀∞x²e^(−x/2)dx. Using the gamma integral, the latter integral is 16, so E[X]=4.",
      "(b) The density is symmetric about zero and x is odd, so E[X]=∫₋₁¹x c(1−x²)dx=0. (Normalisation gives c=3/4.)",
      "(c) E[X]=∫₅∞x·5/x²dx=5∫₅∞(1/x)dx, which diverges. The expectation is not finite."
    ],
    answer: "(a) 4. (b) 0. (c) E[X]=+∞ (the integral diverges)."
  }
];

const CHAPTERS = [
  { id: 1 as const, title: "Combinatorial Analysis", subtitle: "Problems 1–33 · Theory · Self-test" },
  { id: 2 as const, title: "Axioms of Probability", subtitle: "Problems 1–56 · Theory · Self-test" },
  { id: 3 as const, title: "Conditional Probability and Independence", subtitle: "Problems 1–90 · Theory · Self-test" },
  { id: 4 as const, title: "Random Variables", subtitle: "Problems 4.1–4.85 · Theory · Self-test" },
  { id: 5 as const, title: "Continuous Random Variables", subtitle: "Problems 5.1–5.41 · Theory · Self-test" },
];

function SourceChapterPanel({ chapter }: { chapter: 1 | 2 | 3 | 4 | 5 }) {
  const [documentType, setDocumentType] = useState<"questions" | "solutions">("questions");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetch(`/probability-books/chapter-${chapter}-${documentType}.txt`)
      .then((response) => {
        if (!response.ok) throw new Error("The source document could not be loaded.");
        return response.text();
      })
      .then((text) => { if (!cancelled) setContent(text); })
      .catch((reason: unknown) => {
        if (!cancelled) setError(reason instanceof Error ? reason.message : "The source document could not be loaded.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [chapter, documentType]);

  return (
    <section className="panel min-w-0 p-5 md:p-8">
      <div className="eyebrow">Chapter {chapter} · Original source material</div>
      <h2 className="serif mt-3 text-2xl text-parchment md:text-3xl">{CHAPTERS[chapter - 1].title}</h2>
      <p className="mt-2 text-sm leading-7 text-dim">The original question set and its corresponding detailed solution manual are reproduced as separate documents. Exercise numbering and source order are retained.</p>
      <div className="mt-6 flex flex-wrap gap-2 border-b border-gold/15 pb-4">
        <button onClick={() => setDocumentType("questions")} className={`border px-4 py-2 text-xs uppercase tracking-widest ${documentType === "questions" ? "border-gold bg-gold/10 text-gold" : "border-gold/20 text-dim"}`}>Questions</button>
        <button onClick={() => setDocumentType("solutions")} className={`border px-4 py-2 text-xs uppercase tracking-widest ${documentType === "solutions" ? "border-gold bg-gold/10 text-gold" : "border-gold/20 text-dim"}`}>Detailed solutions</button>
      </div>
      <div className="mt-5 max-h-[72vh] min-h-[28rem] overflow-auto rounded border border-gold/15 bg-black/10 p-4 md:p-6">
        {loading ? <p className="text-sm text-dim">Loading source document…</p> :
          error ? <p role="alert" className="text-sm text-red-400">{error}</p> :
          <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-6 text-body md:text-sm">{content}</pre>}
      </div>
      <p className="mt-4 text-xs leading-6 text-faint">Source-derived text extraction. Mathematical symbols and page layout may differ slightly from the PDF, but the wording, numbering, and content are taken from the uploaded source documents.</p>
    </section>
  );
}

export default function BookOne() {
  const [chapter, setChapter] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [activeId, setActiveId] = useState("4.1");
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [completed, setCompleted] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [showPractice, setShowPractice] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("limitless.probability.book-01.v1") || "{}");
      setCompleted(Array.isArray(saved.completed) ? saved.completed : []);
      setRevealed(saved.revealed && typeof saved.revealed === "object" ? saved.revealed : {});
    } catch { /* keep the book usable if saved data is malformed */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem("limitless.probability.book-01.v1", JSON.stringify({ completed, revealed }));
    } catch { /* progress remains available for this session */ }
  }, [completed, revealed, ready]);

  const chapterProblems = useMemo(() => problems.filter((p) => p.chapter === chapter), [chapter]);
  const active = problems.find((p) => p.id === activeId) ?? chapterProblems[0] ?? problems[0];
  const setChapterAndProblem = (next: 1 | 2 | 3 | 4 | 5) => {
    setChapter(next);
    setShowPractice(false);
    if (next === 4) setActiveId("4.1");
    if (next === 5) setActiveId("5.1");
  };
  const toggleComplete = (id: string) => setCompleted((old) => old.includes(id) ? old.filter((x) => x !== id) : [...old, id]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <div className="eyebrow mb-3">Probability · Interactive Book</div>
          <h1 className="serif text-4xl text-parchment md:text-5xl">Book Number 1</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-dim">Chapters 1–5 with complete question sets, detailed solutions, theoretical exercises, and self-test material. Open a chapter and switch between its questions and worked solutions.</p>
        </div>
        <div className="panel min-w-44 p-4">
          <div className="text-[10px] uppercase tracking-widest text-faint">Your progress</div>
          <div className="serif mt-1 text-3xl text-gold">{completed.length}/{problems.length}</div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-track"><div className="h-full bg-gold transition-all" style={{ width: `${completed.length / problems.length * 100}%` }} /></div>
          <div className="mt-2 text-xs text-dim">Selected practice problems marked complete</div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {CHAPTERS.map((item) => (
          <button key={item.id} onClick={() => setChapterAndProblem(item.id)} className={`border px-4 py-3 text-left transition ${chapter === item.id ? "border-gold bg-gold/10" : "border-gold/20 hover:border-gold/50"}`}>
            <span className="block text-[10px] uppercase tracking-widest text-gold">Chapter {item.id}</span>
            <span className="serif mt-1 block text-lg text-parchment">{item.title}</span>
            <span className="mt-1 block text-xs text-dim">{item.subtitle}</span>
          </button>
        ))}
      </div>

      <SourceChapterPanel chapter={chapter} />
      {(chapter === 4 || chapter === 5) && (
        <div className="mt-6">
          <button onClick={() => setShowPractice((value) => !value)} className="border border-gold/30 px-4 py-3 text-xs uppercase tracking-widest text-gold hover:bg-gold/10">
            {showPractice ? "Hide selected interactive practice" : "Open selected interactive practice"}
          </button>
          <p className="mt-2 text-xs text-faint">This is a small interactive practice subset. The complete chapter problem sets and solution manuals are in the source tabs above.</p>
          {showPractice && (
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="panel h-fit p-4">
            <div className="eyebrow mb-3">Chapter {chapter} · Problems</div>
            <div className="space-y-1">
              {chapterProblems.map((problem) => (
                <button key={problem.id} onClick={() => setActiveId(problem.id)} className={`flex w-full items-center gap-3 border px-3 py-3 text-left text-sm transition ${activeId === problem.id ? "border-gold/60 bg-gold/10 text-parchment" : "border-transparent text-dim hover:border-gold/20 hover:bg-gold/5"}`}>
                  <span className="serif text-gold">{problem.id}</span>
                  <span className="min-w-0 flex-1">{problem.title}</span>
                  {completed.includes(problem.id) && <span className="text-ok" aria-label="Completed">✓</span>}
                </button>
              ))}
            </div>
          </aside>
  
          <article className="panel min-w-0 p-5 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="eyebrow">Problem {active.id}</div>
              <button onClick={() => toggleComplete(active.id)} className={`border px-3 py-2 text-[10px] uppercase tracking-widest ${completed.includes(active.id) ? "border-ok/50 text-ok" : "border-gold/30 text-gold hover:bg-gold/10"}`}>
                {completed.includes(active.id) ? "✓ Completed" : "Mark complete"}
              </button>
            </div>
            <h2 className="serif mt-3 text-2xl text-parchment md:text-3xl">{active.title}</h2>
            <div className="mt-6 border-l-2 border-gold/50 pl-4 text-sm leading-8 text-body">{active.prompt}</div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-gold/15 pt-5">
              <div>
                <div className="serif text-lg text-parchment">Worked solution</div>
                <p className="mt-1 text-xs text-dim">Try the problem before revealing the steps.</p>
              </div>
              <button onClick={() => setRevealed((old) => ({ ...old, [active.id]: !old[active.id] }))} className="btn-gold">
                {revealed[active.id] ? "Hide solution" : "Reveal solution"}
              </button>
            </div>
            {revealed[active.id] && (
              <div className="mt-5 space-y-4">
                <ol className="space-y-3">
                  {active.solution.map((step, index) => <li key={index} className="grid grid-cols-[2rem_1fr] gap-3 text-sm leading-7 text-body"><span className="serif text-gold">{index + 1}.</span><span>{step}</span></li>)}
                </ol>
                <div className="border border-gold/25 bg-gold/5 p-4">
                  <div className="text-[10px] uppercase tracking-widest text-gold">Final answer</div>
                  <p className="mt-2 text-sm leading-7 text-parchment">{active.answer}</p>
                </div>
              </div>
          )}
        </div>
      )}
          <div className="mt-8 flex items-center justify-between border-t border-gold/15 pt-5">
            <button disabled={chapterProblems[0].id === active.id} onClick={() => { const i = chapterProblems.findIndex((p) => p.id === active.id); setActiveId(chapterProblems[Math.max(0, i - 1)].id); }} className="btn-ghost">← Previous</button>
            <span className="text-xs text-faint">{chapterProblems.findIndex((p) => p.id === active.id) + 1} of {chapterProblems.length}</span>
            <button disabled={chapterProblems[chapterProblems.length - 1].id === active.id} onClick={() => { const i = chapterProblems.findIndex((p) => p.id === active.id); setActiveId(chapterProblems[Math.min(chapterProblems.length - 1, i + 1)].id); }} className="btn-ghost">Next →</button>
          </div>
        </article>
      </div>
      )}
      <p className="mt-6 text-xs leading-6 text-faint">Progress is saved in this browser. These problem-book completions are kept separate from lesson mastery and LSR-1 rewards until a reviewed assessment adapter is added.</p>
    </div>
  );
}
