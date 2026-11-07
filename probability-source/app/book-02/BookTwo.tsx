"use client";

import { Fragment, useEffect, useState } from "react";
import { Rich } from "../lib/rich";
import { chapterContent, type Step } from "./chapter-content";

type BookChapter = {
  id: number;
  title: string;
  file: string;
  solutions: string;
  printedStartPage: number;
};

const fallbackChapters: BookChapter[] = [
  { id: 1, title: "Probability and Counting", file: "chapters/chapter-01.md", solutions: "solutions/chapter-01-solutions.md", printedStartPage: 1 },
  { id: 2, title: "Conditional Probability", file: "chapters/chapter-02.md", solutions: "solutions/chapter-02-solutions.md", printedStartPage: 45 },
  { id: 3, title: "Random Variables and Their Distributions", file: "chapters/chapter-03.md", solutions: "solutions/chapter-03-solutions.md", printedStartPage: 103 },
  { id: 4, title: "Expectation", file: "chapters/chapter-04.md", solutions: "solutions/chapter-04-solutions.md", printedStartPage: 149 },
  { id: 5, title: "Continuous Random Variables", file: "chapters/chapter-05.md", solutions: "solutions/chapter-05-solutions.md", printedStartPage: 213 },
  { id: 6, title: "Moments", file: "chapters/chapter-06.md", solutions: "solutions/chapter-06-solutions.md", printedStartPage: 267 },
  { id: 7, title: "Joint Distributions", file: "chapters/chapter-07.md", solutions: "solutions/chapter-07-solutions.md", printedStartPage: 303 },
  { id: 8, title: "Transformations", file: "chapters/chapter-08.md", solutions: "solutions/chapter-08-solutions.md", printedStartPage: 367 },
  { id: 9, title: "Conditional Expectation", file: "chapters/chapter-09.md", solutions: "solutions/chapter-09-solutions.md", printedStartPage: 411 },
  { id: 10, title: "Inequalities and Limit Theorems", file: "chapters/chapter-10.md", solutions: "solutions/chapter-10-solutions.md", printedStartPage: 453 },
  { id: 11, title: "Markov Chains", file: "chapters/chapter-11.md", solutions: "solutions/chapter-11-solutions.md", printedStartPage: 499 },
  { id: 12, title: "Markov Chain Monte Carlo", file: "chapters/chapter-12.md", solutions: "solutions/chapter-12-solutions.md", printedStartPage: 533 },
  { id: 13, title: "Poisson Processes", file: "chapters/chapter-13.md", solutions: "solutions/chapter-13-solutions.md", printedStartPage: 559 },
];

const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? "") + "/probability-books/book-02";
const progressKey = "limitless.probability.book-02.reader.v1";
type Section = "textbook" | "solutions" | "illustrations" | "problems";

function Steps({ steps }: { steps: Step[] }) {
  return (
    <ol className="mt-3 space-y-3">
      {steps.map((step, index) => (
        <li key={index} className="flex gap-3">
          <span className="mt-1 text-xs text-gold">{index + 1}.</span>
          <div className="min-w-0">
            <p className="text-[15px] leading-7 text-parchment"><Rich text={step.note} /></p>
            {step.work ? (
              <p className="mt-1 border-l-2 border-gold/40 pl-3 font-serif text-[15px] leading-8 text-parchment"><Rich text={step.work} /></p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

function isBookChapter(value: unknown): value is BookChapter {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return Number.isInteger(item.id)
    && typeof item.title === "string"
    && typeof item.file === "string"
    && typeof item.solutions === "string"
    && Number.isInteger(item.printedStartPage);
}

function normalizeExtractedGlyphs(text: string) {
  // Repair only glyphs whose meaning is unambiguous in this PDF text layer.
  // Unknown control characters become visible replacement marks instead of
  // silently disappearing inside mathematical expressions.
  return text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, (glyph) => {
    if (glyph === "\u000F") return "ε";
    if (glyph === "\u0003" || glyph === "\u0004") return "∎";
    return "�";
  });
}

function repairKnownChapterOneFormulas(text: string) {
  // These two displayed equations were split into stacked glyph rows by the
  // supplied PDF text layer. Rebuild only the exact, uniquely anchored formulas
  // after checking them against the printed textbook pages 15–16.
  return text
    .replace(
      /(For k ≤ n, we have)\n[\s\S]*?(?=\n\n\n16\s+Introduction to Probability)/,
      "$1\nC(n, k) = n(n − 1) ··· (n − k + 1)/k! = n!/((n − k)!k!).",
    )
    .replace(
      /(The binomial theorem states that)\n[\s\S]*?(?=\n\n\nProbability and counting\s+17)/,
      "$1\n(x + y)^n = Σ_{k=0}^{n} C(n, k)x^k y^{n−k}.",
    )
    // Counting examples below were checked against printed textbook pages 16–18.
    .replace(
      /(Example 1\.4\.17 \(Club officers\)\.[\s\S]*?and there are)\n[\s\S]*?(?=ways to choose 3 officers without predetermined titles\.)/,
      "$1\nC(n, 3) = n(n − 1)(n − 2)/3!\n",
    )
    .replace(
      /(Example 1\.4\.18 \(Permutations of a word\)\.[\s\S]*?So there\nare)[\s\S]*?(?= permutations\.)/,
      "$1 C(8, 5) = C(8, 3) = 8·7·6/3! = 56",
    )
    .replace(
      /(How many ways are there to permute the letters in the word STATISTICS\?[\s\S]*?This\ngives)[\s\S]*?(?= possibilities\.)/,
      "$1 C(10, 3)C(7, 3)C(4, 2)C(2, 1) = 10!/(3!3!2!) = 50400",
    )
    .replace(
      /(Example 1\.4\.20 \(Full house in poker\)\.[\s\S]*?Thus,)[\s\S]*?(?=\n\nThe decimal approximation)/,
      "$1 P(full house) = [13 C(4, 3) 12 C(4, 2)]/C(52, 5) = 3744/2598960 ≈ 0.00144.",
    )
    // Bose–Einstein and story-proof identities checked against printed pages 19–21.
    .replace(
      /(Thus, the answer to the original question\s+is also)[\s\S]*?(?=Another isomorphic problem)/,
      "$1 C(n + k − 1, k). ",
    )
    .replace(
      /(By Bose-Einstein, the number of lists is)[\s\S]*?(?=But the\s+ordered birthday lists)/,
      "$1 C(n + k − 1, k) ",
    )
    .replace(
      /(Example 1\.5\.1 \(Choosing the complement\)\.[\s\S]*?we have)\s*[\s\S]*?(?=This is easy to check algebraically)/,
      "$1 C(n, k) = C(n, n − k).\n",
    )
    .replace(
      /(Example 1\.5\.2 \(The team captain\)\.[\s\S]*?k ≤ n,)\s*[\s\S]*?(?=This is again easy to check algebraically)/,
      "$1\nn C(n − 1, k − 1) = k C(n, k).\n",
    )
    .replace(
      /(Vandermonde’s identity,2 says that)\s*[\s\S]*?(?=This identity will come up)/,
      "$1\nC(m + n, k) = Σ_{j=0}^{k} C(m, j)C(n, k − j).\n",
    )
    .replace(
      /(Example 1\.5\.4 \(Partnerships\)\.[\s\S]*?show that)\s*[\s\S]*?(?=Story proof)/,
      "$1\n(2n)!/(2^n n!) = (2n − 1)(2n − 3) ··· 3 · 1.\n\n",
    )
    // Chapter 2: conditional Bayes and total-probability identities.
    .replace(
      /(Theorem 2\.4\.2 \(Bayes’ rule with extra conditioning\)\.[\s\S]*?and P \(B ∩ E\) > 0, we have)\s*[\s\S]*?(?=Theorem 2\.4\.3)/,
      "$1\nP(A|B, E) = P(B|A, E)P(A|E)/P(B|E).\n\n",
    )
    .replace(
      /(Theorem 2\.4\.3 \(LOTP with extra conditioning\)[\s\S]*?P \(Ai ∩ E\) > 0 for all i, we have)\s*[\s\S]*?(?=The extra conditioning forms)/,
      "$1\nP(B|E) = Σ_{i=1}^{n} P(B|Ai, E)P(Ai|E).\n\n",
    )
    // Chapters 3–5: rebuild selected PMF, expectation, and continuous-distribution formulas.
    .replace(
      /(Example 3\.4\.4 \(Aces in a poker hand\)\.[\s\S]*?has exactly three aces is)\s*[\s\S]*?(?=Theorem 3\.4\.5|The following table)/,
      "$1\nP(X = 3) = C(4, 3)C(48, 2)/C(52, 5) ≈ 0.0017.\n",
    )
    .replace(
      /(Theorem 3\.7\.3 \(PMF of g\(X\)\)\.[\s\S]*?and the PMF of g\(X\) is)\s*[\s\S]*?(?=Theorem 3\.8\.5|Definition 3\.8\.6)/,
      "$1\nP(g(X) = y) = Σ_{x:g(x)=y} P(X = x).\n",
    )
    .replace(
      /(Theorem 4\.5\.1 \(LOTUS\)\.[\s\S]*?then)\s*[\s\S]*?(?=where the sum is taken)/,
      "$1\nE(g(X)) = Σ_x g(x)P(X = x),\n",
    )
    .replace(
      /(Theorem 4\.6\.2\. For any r\.v\. X,)\s*[\s\S]*?(?=Proof\.)/,
      "$1\nVar(X) = E(X²) − (E(X))².\n",
    )
    .replace(
      /(Example 5\.3\.5 \(Universality with Rayleigh\)\. The Rayleigh CDF is)\s*[\s\S]*?(?=The quantile function)/,
      "$1\nF(x) = 1 − e^(−x²/2),  x > 0.\n",
    )
    .replace(
      /(Theorem 5\.4\.4 \(Normal CDF and PDF\)\.[\s\S]*?Then the CDF of X is)\s*[\s\S]*?(?=Proof\.)/,
      "$1\nF(x) = Φ((x − μ)/σ),\nf(x) = (1/σ)φ((x − μ)/σ).\n",
    )
    .replace(
      /(Theorem 5\.4\.5 \(68-95-99\.7% rule\)\.[\s\S]*?then)\s*[\s\S]*?(?=We can use this rule)/,
      "$1\nP(|X − μ| < σ) ≈ 0.68,\nP(|X − μ| < 2σ) ≈ 0.95,\nP(|X − μ| < 3σ) ≈ 0.997.\n",
    )
    // Chapters 6–10: core MGF, joint-distribution, conditioning, and limit identities.
    .replace(
      /(Theorem 6\.4\.7 \(MGF of a sum of independent r\.v\.s\)\.[\s\S]*?individual MGFs:)\s*[\s\S]*?(?=This is true because)/,
      "$1\nM_{X+Y}(t) = M_X(t)M_Y(t).\n",
    )
    .replace(
      /(Example 6\.4\.12 \(Normal MGF\)\.[\s\S]*?Thus, the MGF of X = μ \+ σZ ∼ N \(μ, σ²\) is)\s*[\s\S]*?(?=Example 6\.4\.13)/,
      "$1\nM_X(t) = exp(μt + σ²t²/2).\n",
    )
    .replace(
      /(Example 6\.6\.3 \(Sum of independent Normals\)\.[\s\S]*?then)\s*[\s\S]*?(?=Thus the sum of independent Normals)/,
      "$1\nX₁ + X₂ ∼ N(μ₁ + μ₂, σ₁² + σ₂²).\n",
    )
    .replace(
      /(Theorem 7\.3\.5 \(Correlation bounds\)\.[\s\S]*?For any r\.v\.s X and Y,)\s*[\s\S]*?(?=Proof\.)/,
      "$1\n−1 ≤ Corr(X, Y) ≤ 1.\n",
    )
    .replace(
      /(Theorem 7\.4\.2 \(Multinomial joint PMF\)\.[\s\S]*?then the joint PMF of X is)\s*[\s\S]*?(?=Proof\.)/,
      "$1\nP(X₁=n₁,…,Xₖ=nₖ) = [n!/(n₁!···nₖ!)]p₁ⁿ¹···pₖⁿᵏ,  Σnᵢ=n.\n",
    )
    .replace(
      /(Theorem 8\.4\.3\. Let X₁,?\s*\.\.\.,?\s*Xₙ be i\.i\.d\. Expo\(λ\)\. Then)\s*[\s\S]*?(?=Proof\.)/,
      "$1\nX₁ + ··· + Xₙ ∼ Gamma(n, λ).\n",
    )
    .replace(
      /(Example 8\.5\.3 \(Beta-Binomial PMF\)\.[\s\S]*?Find the marginal\s+distribution of X\.)[\s\S]*?(?=8\.6\s+Order statistics)/,
      "$1\nP(X = k) = C(n, k) B(a + k, b + n − k)/B(a, b),  k = 0,…,n.\n\n",
    )
    .replace(
      /(Theorem 8\.6\.3 \(CDF of order statistic\)\.[\s\S]*?Then the CDF of the jth order statistic X\(j\) is)\s*[\s\S]*?(?=To get the PDF)/,
      "$1\nP(X_(j) ≤ x) = Σ_{k=j}^{n} C(n, k)F(x)^k[1 − F(x)]^(n−k).\n",
    )
    .replace(
      /(Theorem 9\.3\.7 \(Adam’s law\)\.[\s\S]*?For any r\.v\.s X and Y,)\s*[\s\S]*?(?=Proof\.)/,
      "$1\nE(E(Y|X)) = E(Y).\n",
    )
    .replace(
      /(Theorem 9\.5\.5 \(Eve’s law\)\.[\s\S]*?For any r\.v\.s X and Y,)\s*[\s\S]*?(?=The ordering of E’s)/,
      "$1\nVar(Y) = E(Var(Y|X)) + Var(E(Y|X)).\n",
    )
    .replace(
      /(Theorem 10\.2\.2 \(Weak law of large numbers\)\.[\s\S]*?For all ε > 0,)\s*[\s\S]*?(?=Proof\.)/,
      "$1\nP(|X̄ₙ − μ| > ε) → 0 as n → ∞.\n",
    )
    .replace(
      /(Theorem 10\.3\.1 \(Central limit theorem\)\.[\s\S]*?As n → ∞,)\s*[\s\S]*?(?=In words,)/,
      "$1\n√n(X̄ₙ − μ)/σ → N(0, 1) in distribution.\n",
    )
    .replace(
      /(Theorem 10\.4\.2\. The χ²ₙ distribution is)\s*[\s\S]*?(?=Proof\.)/,
      "$1 Gamma(n/2, 1/2).\n",
    )
    // Tighten patterns where PDF extraction split a theorem statement across lines.
    .replace(
      /(Theorem 5\.4\.4 \(Normal CDF and PDF\)\.[\s\S]*?Then the CDF of X\s+is)[\s\S]*?(?=Proof\.)/,
      "$1\nF(x) = Φ((x − μ)/σ),\nf(x) = (1/σ)φ((x − μ)/σ).\n",
    )
    .replace(
      /(Thus, the MGF of X = µ \+ σZ ∼ N \(µ, σ 2 \)\s+is)[\s\S]*?(?=Example 6\.4\.13)/,
      "$1\nM_X(t) = exp(µt + σ²t²/2).\n",
    )
    .replace(
      /(Example 6\.6\.3 \(Sum of independent Normals\)\.[\s\S]*?then the MGF of X1 \+ X2 is)[\s\S]*?(?=Thus the sum of independent Normals)/,
      "$1\nM_{X₁+X₂}(t) = exp((µ₁+µ₂)t + (σ₁²+σ₂²)t²/2),\nX₁ + X₂ ∼ N(µ₁+µ₂, σ₁²+σ₂²).\n",
    )
    .replace(
      /(Theorem 7\.3\.5 \(Correlation bounds\)\. For any r\.v\.s X and Y ,)[\s\S]*?(?=Proof\.)/,
      "$1\n−1 ≤ Corr(X, Y) ≤ 1.\n",
    )
    .replace(
      /(Theorem 7\.4\.2 \(Multinomial joint PMF\)\.[\s\S]*?then the joint PMF\s+of X is)[\s\S]*?(?=Proof\.)/,
      "$1\nP(X₁=n₁,…,Xₖ=nₖ) = [n!/(n₁!···nₖ!)]p₁ⁿ¹···pₖⁿᵏ,  Σnᵢ=n.\n",
    )
    .replace(
      /(Example 8\.5\.3 \(Beta-Binomial PMF\)\.[\s\S]*?Find the marginal distribution of X\.)[\s\S]*?(?=8\.6\s+Order statistics)/,
      "$1\nP(X = k) = C(n, k) B(a + k, b + n − k)/B(a, b),  k = 0,…,n.\n\n",
    )
    .replace(
      /(Theorem 9\.3\.7 \(Adam’s law\)\. For any r\.v\.s X and Y ,)[\s\S]*?(?=Proof\.)/,
      "$1\nE(E(Y|X)) = E(Y).\n",
    )
    .replace(
      /(Theorem 9\.5\.5 \(Eve’s law\)\. For any r\.v\.s X and Y ,)[\s\S]*?(?=The ordering of E’s)/,
      "$1\nVar(Y) = E(Var(Y|X)) + Var(E(Y|X)).\n",
    )
    .replace(
      /(Theorem 10\.4\.2\. The χ2n distribution is)[\s\S]*?(?=Proof\.)/,
      "$1 Gamma(n/2, 1/2).\n",
    )
    .replace(
      /(Example 6\.6\.3 \(Sum of independent Normals\)\.[\s\S]*?then the MGF of X1 \+ X2 is)[\s\S]*?(?=Example 6\.6\.4)/,
      "$1\nM_{X₁+X₂}(t) = exp((µ₁+µ₂)t + (σ₁²+σ₂²)t²/2),\nX₁ + X₂ ∼ N(µ₁+µ₂, σ₁²+σ₂²).\n",
    )
    .replace(
      /(Example 8\.5\.3 \(Beta-Binomial PMF\)\.[\s\S]*?Find the marginal distribution of X\.)[\s\S]*?(?=8\.6\s+Order statistics)/,
      "$1\nP(X = k) = C(n, k) B(a + k, b + n − k)/B(a, b),  k = 0,…,n.\n\n",
    )
    // Newton–Pepys expressions checked against printed textbook pages 17–18.
    .replace(
      /(A: Instead of counting[\s\S]*?Thus)\s*[\s\S]*?(?=\n\nB:)/,
      "$1\nP(A) = 1 − 5^6/6^6 ≈ 0.67.",
    )
    .replace(
      /(B: Again we count the outcomes[\s\S]*?Then)[\s\S]*?(?=\n\nC:)/,
      "$1\nP(B) = 1 − [5^12 + C(12, 1)·5^11]/6^12 ≈ 0.62.",
    )
    .replace(
      /(C: We count the outcomes in C[\s\S]*?)(?=\nTherefore A has the highest probability)/,
      "C: The complement consists of zero, one, or two sixes.\nP(C) = 1 − [5^18 + C(18, 1)·5^17 + C(18, 2)·5^16]/6^18 ≈ 0.60.",
    );
}

function extractSourceText(markdown: string) {
  // The PDF extraction deliberately places the page-preserving transcription
  // in a fenced text block. Render its contents, not the Markdown fence itself.
  const fence = String.fromCharCode(96).repeat(3);
  const pattern = new RegExp("^" + fence + "text\\s*\\r?\\n([\\s\\S]*?)\\r?\\n" + fence + "[ \\t]*$", "m");
  const match = markdown.match(pattern);
  const source = match ? match[1] : markdown.replace(/^# .*\\r?\\n+/, "").trim();
  return repairKnownChapterOneFormulas(normalizeExtractedGlyphs(source));
}

function SourceTranscription({ text }: { text: string }) {
  const lines = text.split(/\r?\n/);
  return (
    <pre className="m-0 min-w-0 whitespace-pre-wrap break-words font-serif text-[15px] leading-8 text-parchment [overflow-wrap:anywhere]">
      {lines.map((line, index) => (
        <Fragment key={index}>
          {line ? line.split("�").map((part, partIndex, parts) => (
            <Fragment key={partIndex}>
              {part ? <Rich text={part} /> : ""}
              {partIndex < parts.length - 1 ? (
                <span
                  className="mx-0.5 rounded bg-red-500/15 px-1 font-sans text-sm font-semibold text-red-300 ring-1 ring-red-400/40"
                  title="Unresolved character from the PDF text extraction; verify this formula against the source."
                  aria-label="Unresolved PDF extraction character"
                >�</span>
              ) : ""}
            </Fragment>
          )) : ""}
          {index < lines.length - 1 ? "\n" : ""}
        </Fragment>
      ))}
    </pre>
  );
}

export default function BookTwo() {
  const [catalogue, setCatalogue] = useState<BookChapter[]>(fallbackChapters);
  const [chapter, setChapter] = useState(1);
  const [completed, setCompleted] = useState<number[]>([]);
  const [section, setSection] = useState<Section>("textbook");
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const persistProgress = (nextChapter: number, nextCompleted: number[], nextSection: Section) => {
    try {
      localStorage.setItem(progressKey, JSON.stringify({
        chapter: nextChapter,
        completed: nextCompleted,
        section: nextSection,
        solutions: nextSection === "solutions",
      }));
    } catch {
      // Keep the reader usable when browser storage is unavailable.
    }
  };

  useEffect(() => {
    let cancelled = false;
    fetch(base + "/book.json")
      .then((response) => {
        if (!response.ok) throw new Error("Book catalogue unavailable.");
        return response.json();
      })
      .then((data: unknown) => {
        const entries = data && typeof data === "object"
          ? (data as { chapters?: unknown }).chapters
          : null;
        if (!Array.isArray(entries)) return;
        const valid = entries.filter(isBookChapter).sort((a, b) => a.id - b.id);
        if (!cancelled && valid.length === 13) setCatalogue(valid);
      })
      .catch(() => {
        // Keep the local fallback catalogue if the index cannot be loaded.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const loadProgress = () => {
      try {
        const saved = JSON.parse(localStorage.getItem(progressKey) || "{}");
        if (Number.isInteger(saved.chapter) && saved.chapter >= 1 && saved.chapter <= 13) setChapter(saved.chapter);
        if (Array.isArray(saved.completed)) {
          setCompleted(saved.completed.filter((n: unknown) => Number.isInteger(n) && Number(n) >= 1 && Number(n) <= 13));
        }
        if (typeof saved.solutions === "boolean") setSection(saved.solutions ? "solutions" : "textbook");
        if (saved.section === "textbook" || saved.section === "solutions" || saved.section === "illustrations" || saved.section === "problems") setSection(saved.section);
      } catch {
        // Local progress is optional; a malformed value must not block reading.
      } finally {
        setHydrated(true);
      }
    };
    loadProgress();
    window.addEventListener("limitless:cloud-sync-hydrated", loadProgress);
    return () => window.removeEventListener("limitless:cloud-sync-hydrated", loadProgress);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const sync = (window as Window & { LimitlessCloudSync?: { isReady?: () => boolean } }).LimitlessCloudSync;
    if (sync?.isReady?.() === false) return;
    persistProgress(chapter, completed, section);
  }, [chapter, completed, section, hydrated]);

  const selected = catalogue.find((item) => item.id === chapter) ?? fallbackChapters[chapter - 1];

  useEffect(() => {
    let cancelled = false;
    if (section === "illustrations" || section === "problems") {
      setLoading(false);
      setError("");
      return () => { cancelled = true; };
    }
    const file = section === "solutions" ? selected.solutions : selected.file;

    setLoading(true);
    setError("");
    fetch(base + "/" + file)
      .then((response) => {
        if (!response.ok) throw new Error("Chapter content is not present on this branch yet (HTTP " + response.status + ").");
        return response.text();
      })
      .then((markdown) => {
        if (!cancelled) setContent(extractSourceText(markdown));
      })
      .catch((reason: unknown) => {
        if (!cancelled) setError(reason instanceof Error ? reason.message : "Unable to load chapter.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selected, section]);

  const percent = Math.round((completed.length / catalogue.length) * 100);
  const practice = chapterContent[chapter];
  const toggle = (key: string) => setOpen((old) => ({ ...old, [key]: !old[key] }));
  const tabClass = (active: boolean) => "border px-4 py-2 text-xs uppercase tracking-widest " + (active ? "border-gold text-gold" : "border-gold/20 text-dim");

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <div className="eyebrow mb-3">Probability · Reference library · Book 02</div>
        <h1 className="serif text-4xl text-parchment md:text-5xl">Introduction to Probability</h1>
        <p className="mt-3 text-sm leading-7 text-dim">Joseph K. Blitzstein and Jessica Hwang · Second Edition</p>
      </div>

      <section className="panel mb-6 p-4">
        <div className="flex justify-between text-xs">
          <span className="uppercase tracking-widest text-gold">Reading progress</span>
          <span className="text-dim">{completed.length}/{catalogue.length} · {percent}%</span>
        </div>
        <div className="mt-3 h-1.5 bg-gold/10">
          <div className="h-full bg-gold" style={{ width: percent + "%" }} />
        </div>
      </section>

      <nav className="mb-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Chapters">
        {catalogue.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setChapter(item.id);
              setSection("textbook");
              persistProgress(item.id, completed, "textbook");
            }}
            aria-current={chapter === item.id ? "page" : undefined}
            className={"border p-4 text-left " + (chapter === item.id ? "border-gold bg-gold/10" : "border-gold/20 hover:border-gold/50")}
          >
            <span className="block text-[10px] uppercase tracking-widest text-gold">
              Chapter {item.id}{completed.includes(item.id) ? " · Complete" : ""}
            </span>
            <span className="serif mt-1 block text-lg text-parchment">{item.title}</span>
          </button>
        ))}
      </nav>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gold/20 pb-4">
        <div>
          <div className="eyebrow">Chapter {chapter} · {selected.title}</div>
          <p className="mt-1 text-xs text-dim">Printed page {selected.printedStartPage}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {([
            ["textbook", "Textbook"],
            ["solutions", "Solutions"],
            ["illustrations", "Illustrations"],
            ["problems", "Problems"],
          ] as const).map(([value, label]) => (
            <button key={value} onClick={() => setSection(value)} aria-pressed={section === value} className={tabClass(section === value)}>
              {label}
            </button>
          ))}
          <button
            onClick={() => {
              const next = completed.includes(chapter) ? completed.filter((n) => n !== chapter) : [...completed, chapter].sort((a, b) => a - b);
              setCompleted(next);
              persistProgress(chapter, next, section);
            }}
            className="border border-gold/30 px-4 py-2 text-xs text-gold"
          >
            {completed.includes(chapter) ? "✓ Completed" : "Mark complete"}
          </button>
        </div>
      </div>

      <article className="panel min-h-[60vh] overflow-hidden">
        <header className="border-b border-gold/15 p-4 text-sm text-parchment">
          {section === "textbook" ? "Chapter " + chapter + " — " + selected.title
            : section === "solutions" ? "Chapter " + chapter + " — Detailed Solutions"
            : section === "illustrations" ? "Chapter " + chapter + " — Worked Illustrations"
            : "Chapter " + chapter + " — Practice Problems"}
        </header>
        {section === "textbook" || section === "solutions" ? (
          <div className="min-w-0 overflow-x-hidden p-5 md:p-8">
            {loading ? (
              <p className="py-16 text-center text-sm text-dim">Loading…</p>
            ) : error ? (
              <p role="alert" className="py-16 text-center text-sm text-red-300">{error}</p>
            ) : (
              <SourceTranscription text={content} />
            )}
          </div>
        ) : (
          <div className="min-w-0 space-y-8 p-5 md:p-8">
            {!practice ? (
              <p className="py-16 text-center text-sm text-dim">Illustrations and problems for this chapter are coming soon.</p>
            ) : section === "illustrations" ? (
              practice.illustrations.map((item, index) => (
                <section key={index} className="border-b border-gold/10 pb-8 last:border-0 last:pb-0">
                  <div className="eyebrow">Example {chapter}.{index + 1}</div>
                  <h2 className="serif mt-1 text-2xl text-parchment">{item.title}</h2>
                  <p className="mt-3 text-[15px] leading-7 text-parchment"><Rich text={item.setup} /></p>
                  <Steps steps={item.steps} />
                  <p className="mt-4 border border-gold/20 bg-gold/5 p-3 text-sm leading-7 text-dim">
                    <span className="text-gold">Takeaway. </span><Rich text={item.takeaway} />
                  </p>
                </section>
              ))
            ) : (
              practice.problems.map((item, index) => {
                const hintKey = chapter + ":h:" + index;
                const solKey = chapter + ":s:" + index;
                return (
                  <section key={index} className="border-b border-gold/10 pb-8 last:border-0 last:pb-0">
                    <div className="eyebrow">Problem {chapter}.{index + 1} · {item.level}</div>
                    <p className="mt-2 text-[15px] leading-7 text-parchment"><Rich text={item.statement} /></p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button onClick={() => toggle(hintKey)} aria-expanded={!!open[hintKey]} className="border border-gold/20 px-3 py-1.5 text-xs text-dim">
                        {open[hintKey] ? "Hide hint" : "Show hint"}
                      </button>
                      <button onClick={() => toggle(solKey)} aria-expanded={!!open[solKey]} className="border border-gold/30 px-3 py-1.5 text-xs text-gold">
                        {open[solKey] ? "Hide solution" : "Show solution"}
                      </button>
                    </div>
                    {open[hintKey] ? <p className="mt-3 text-sm leading-7 text-dim"><span className="text-gold">Hint. </span><Rich text={item.hint} /></p> : null}
                    {open[solKey] ? (
                      <div className="mt-3">
                        <Steps steps={item.solution} />
                        <p className="mt-3 text-sm text-parchment"><span className="text-gold">Answer. </span><Rich text={item.answer} /></p>
                      </div>
                    ) : null}
                  </section>
                );
              })
            )}
          </div>
        )}
      </article>

      <div className="mt-4 flex justify-between">
        <button
          disabled={chapter === 1}
          onClick={() => {
            const nextChapter = chapter - 1;
            setChapter(nextChapter);
            setSection("textbook");
            persistProgress(nextChapter, completed, "textbook");
          }}
          className="border border-gold/20 px-4 py-2 text-xs text-dim disabled:opacity-30"
        >
          ← Previous
        </button>
        <button
          disabled={chapter === catalogue.length}
          onClick={() => {
            const nextChapter = chapter + 1;
            setChapter(nextChapter);
            setSolutions(false);
            persistProgress(nextChapter, completed, false);
          }}
          className="border border-gold/30 px-4 py-2 text-xs text-gold disabled:opacity-30"
        >
          Next chapter →
        </button>
      </div>

      <p className="mt-6 text-xs leading-6 text-dim">
        Book 02 progress is stored separately and does not modify Book 01 or Probability course progress.
        Mathematical notation follows the extracted source transcription. Known epsilon and proof-end glyphs are repaired; unresolved extraction glyphs are shown as � and must be checked against the source.
      </p>
    </div>
  );
}
