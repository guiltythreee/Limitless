"use client";

import { useEffect, useMemo, useState } from "react";

type SectionKey = "problems" | "theory" | "self-test";
type SourceItem = {
  id: string;
  title: string;
  question: string;
  solution: string;
  hasSolution: boolean;
};
type Chapter = 1 | 2 | 3 | 4 | 5;

const CHAPTERS: { id: Chapter; title: string; subtitle: string }[] = [
  { id: 1, title: "Combinatorial Analysis", subtitle: "33 problems · 23 theory · 19 self-test" },
  { id: 2, title: "Axioms of Probability", subtitle: "56 problems · 21 theory · 20 self-test" },
  { id: 3, title: "Conditional Probability and Independence", subtitle: "90 problems · 31 theory · 30 self-test" },
  { id: 4, title: "Random Variables", subtitle: "85 problems · 36 theory · 26 self-test" },
  { id: 5, title: "Continuous Random Variables", subtitle: "41 problems · 33 theory · 20 self-test" },
];

const SECTIONS: { id: SectionKey; label: string }[] = [
  { id: "problems", label: "Problems" },
  { id: "theory", label: "Theoretical exercises" },
  { id: "self-test", label: "Self-test" },
];

const PROGRESS_KEY = "limitless.probability.book-01.interactive.v2";
const PUBLIC_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function stripSourceNoise(value: string) {
  return value
    .replace(/<PARSED TEXT FOR PAGE:\s*\d+\s*\/\s*\d+>/g, "")
    .replace(/^--- Source page ---\s*$/gm, "")
    .replace(/^\s*\d+\s+Chapter\s+\d+.*$/gm, "")
    .replace(/^\s*Probability.*Page\s+\d+\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function sectionSlice(text: string, start: RegExp, end: RegExp) {
  const startMatch = start.exec(text);
  if (!startMatch) return "";
  const startAt = startMatch.index + startMatch[0].length;
  const remainder = text.slice(startAt);
  const endMatch = end.exec(remainder);
  return (endMatch ? remainder.slice(0, endMatch.index) : remainder).trim();
}

function questionSections(text: string, chapter: Chapter): Record<SectionKey, string> {
  const theory = /^\s*THEORETICAL EXERCISES\s*$/im;
  const self = /^\s*SELF-TEST PROBLEMS AND EXERCISES\s*$/im;
  if (chapter <= 3) {
    const problems = /^\s*PROBLEMS\s*$/im;
    return {
      problems: sectionSlice(text, problems, theory),
      theory: sectionSlice(text, theory, self),
      "self-test": sectionSlice(text, self, /$^/),
    };
  }
  return {
    problems: sectionSlice(text, /^\s*(?:CHAPTER [45].*\n)?/im, theory) || text.slice(0, theory.exec(text)?.index ?? text.length),
    theory: sectionSlice(text, theory, self),
    "self-test": sectionSlice(text, self, /$^/),
  };
}

function solutionSections(text: string, chapter: Chapter): Record<SectionKey, string> {
  if (chapter === 5) {
    const supplement = /^\s*Chapter 5\s*[—-]\s*Missing Problems:\s*Supplement\s*$/im;
    const partOne = /^\s*Part I:\s*Problems 5\.7\s*[–-]\s*5\.22\s*$/im;
    const laterProblems = /^\s*Problems 5\.23\s*[–-]\s*5\.41\s*$/im;
    const theory = /^\s*Theoretical Exercises 5\.1\s*[–-]\s*5\.33\s*$/im;
    const self = /^\s*Self-Test Problems and Exercises 5\.1\s*[–-]\s*5\.20\s*$/im;
    const corrections = /^\s*Chapter 5\s*[—-]\s*Numerical corrections\s*$/im;
    const first = supplement.exec(text);
    const firstAt = first?.index ?? 0;
    const p1 = partOne.exec(text);
    const p2 = laterProblems.exec(text);
    const t = theory.exec(text);
    const st = self.exec(text);
    const fix = corrections.exec(text);
    const correctionText = fix ? text.slice(fix.index) : "";
    const selfFixAt = correctionText.search(/^\s*Self-Test 5\.17\./im);
    const problemFixes = selfFixAt >= 0 ? correctionText.slice(0, selfFixAt) : correctionText;
    const selfFixes = selfFixAt >= 0 ? correctionText.slice(selfFixAt) : "";
    return {
      problems: [text.slice(firstAt, p1?.index ?? firstAt), p1 ? text.slice(p1.index, p2?.index ?? p1.index) : "", p2 ? text.slice(p2.index, t?.index ?? p2.index) : "", problemFixes].join("\n\n"),
      theory: t ? text.slice(t.index + t[0].length, st?.index ?? fix?.index ?? text.length) : "",
      "self-test": [st ? text.slice(st.index + st[0].length, fix?.index ?? text.length) : "", selfFixes].join("\n\n"),
    };
  }

  const a = /^\s*A\.\s*Problems\s*$/im;
  const b = /^\s*B\.\s*Theoretical Exercises\s*$/im;
  const c = /^\s*C\.\s*Self-Test Problems and Exercises\s*$/im;
  const problems = sectionSlice(text, a, b);
  const theory = sectionSlice(text, b, c);
  let selfTest = sectionSlice(text, c, /$^/);
  if (chapter === 4) {
    const supplement = /^\s*Chapter 4\s*[—-]\s*Missing Problems:\s*Supplement\s*$/im.exec(text);
    if (supplement) {
      selfTest = text.slice(c.exec(text)?.index ?? 0, supplement.index);
      return {
        problems: problems + "\n\n" + text.slice(supplement.index),
        theory,
        "self-test": selfTest,
      };
    }
  }
  return { problems, theory, "self-test": selfTest };
}

function questionStarts(text: string, chapter: Chapter) {
  const matches: { id: string; index: number }[] = [];
  const simple = chapter <= 2;
  const pattern = simple
    ? /(?:^|\n)[ \t]*(\d{1,2})\.\s+|[ \t]{3,}(\d{1,2})\.\s+|∗\s*(\d{1,2})\.\s+/gm
    : new RegExp("(?:^|\\n)[ \\t]*(" + chapter + ")\\.(\\d{1,2})\\.\\s+|[ \\t]{3,}(" + chapter + ")\\.(\\d{1,2})\\.\\s+|∗\\s*(" + chapter + ")\\.(\\d{1,2})\\.\\s+", "gm");
  for (const match of text.matchAll(pattern)) {
    const id = simple ? (match[1] || match[2] || match[3]) : (match[2] || match[4] || match[6]);
    if (!id) continue;
    const raw = simple ? id + "." : chapter + "." + id + ".";
    matches.push({ id: simple ? id : chapter + "." + id, index: match.index! + match[0].lastIndexOf(raw) });
  }
  return matches;
}

function solutionStarts(text: string, chapter: Chapter) {
  const matches: { id: string; title: string; index: number }[] = [];
  let pattern: RegExp;
  if (chapter <= 2) {
    pattern = /^[ \t]*(\d{1,2})\.[ \t]+([^\n]{3,140})$/gm;
  } else if (chapter === 5) {
    pattern = /^\s*(?:(?:Problem|Self-Test)\s+)?5\.(\d{1,2})(?:\.\s*|\s*[—–:-]\s*|\s+|\s*$)([^\n]{0,140})$/gm;
  } else {
    pattern = new RegExp("^[ \\t]*" + chapter + "\\.(\\d{1,2})\\.[ \\t]+([^\\n]{3,140})$", "gm");
  }
  for (const match of text.matchAll(pattern)) {
    const id = chapter <= 2 ? match[1] : chapter + "." + match[1];
    const title = (match[2] || "").trim();
    matches.push({ id, title, index: match.index! });
  }
  if (chapter === 5) {
    const additionalSelfTest = /^\s*Additional correction\s*[—-]\s*Self-Test\s+5\.(\d{1,2})\s*$/gm;
    for (const match of text.matchAll(additionalSelfTest)) {
      matches.push({ id: "5." + match[1], title: "", index: match.index! });
    }
  }
  if (chapter === 4) {
    const supplementPattern = /^\s*Problem\s+4\.(\d{1,2})\s*$/gm;
    for (const match of text.matchAll(supplementPattern)) {
      matches.push({ id: "4." + match[1], title: "", index: match.index! });
    }
  }
  return matches.sort((a, b) => a.index - b.index);
}

function makeQuestionItems(text: string, chapter: Chapter) {
  const clean = stripSourceNoise(text);
  const starts = questionStarts(clean, chapter);
  return starts.map((start, index) => {
    const end = starts[index + 1]?.index ?? clean.length;
    const question = clean.slice(start.index, end).trim();
    return { id: start.id, question, title: "" };
  }).filter((item) => item.question.length > 5).sort((a, b) => {
    const left = Number(a.id.split(".").at(-1));
    const right = Number(b.id.split(".").at(-1));
    return left - right;
  });
}

function makeSolutionMap(text: string, chapter: Chapter) {
  const clean = stripSourceNoise(text);
  const starts = solutionStarts(clean, chapter);
  const map = new Map<string, { title: string; solution: string }>();
  starts.forEach((start, index) => {
    const end = starts[index + 1]?.index ?? clean.length;
    const solution = clean.slice(start.index, end).trim();
    const existing = map.get(start.id);
    if (!existing) {
      map.set(start.id, { title: start.title, solution });
    } else {
      map.set(start.id, {
        title: existing.title || start.title,
        solution: existing.solution + "\n\nAdditional source note or correction:\n" + solution,
      });
    }
  });
  return map;
}

function buildItems(questionText: string, solutionText: string, chapter: Chapter): SourceItem[] {
  const questions = makeQuestionItems(questionText, chapter);
  const solutions = makeSolutionMap(solutionText, chapter);
  return questions.map((item) => {
    const worked = solutions.get(item.id);
    const firstLine = item.question.split("\n").map((line) => line.trim()).find((line) => line.length > 5) ?? "";
    const questionTitle = firstLine.replace(new RegExp("^" + (chapter <= 2 ? item.id : item.id.replace(".", "\\.")) + "\\.\\s*"), "");
    const title = worked?.title || questionTitle.slice(0, 105).replace(/\s+/g, " ").trim() || "Exercise " + item.id;
    return {
      id: item.id,
      title,
      question: item.question,
      solution: worked?.solution ?? "",
      hasSolution: Boolean(worked?.solution),
    };
  });
}

export default function BookOne() {
  const [chapter, setChapter] = useState<Chapter>(1);
  const [section, setSection] = useState<SectionKey>("problems");
  const [questionText, setQuestionText] = useState("");
  const [solutionText, setSolutionText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeId, setActiveId] = useState("");
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [completed, setCompleted] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState("");
  const [sourceView, setSourceView] = useState<"closed" | "questions" | "solutions">("closed");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
      setCompleted(Array.isArray(saved.completed) ? saved.completed : []);
      setRevealed(saved.revealed && typeof saved.revealed === "object" ? saved.revealed : {});
    } catch { /* Ignore malformed local progress and keep the book usable. */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify({ completed, revealed }));
    } catch { /* Progress remains available for this session. */ }
  }, [completed, revealed, ready]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    setQuestionText("");
    setSolutionText("");
    Promise.all([
      fetch(`${PUBLIC_BASE_PATH}/probability-books/chapter-${chapter}-questions.txt`).then((response) => {
        if (!response.ok) throw new Error("The chapter question source could not be loaded.");
        return response.text();
      }),
      fetch(`${PUBLIC_BASE_PATH}/probability-books/chapter-${chapter}-solutions.txt`).then((response) => {
        if (!response.ok) throw new Error("The chapter solution source could not be loaded.");
        return response.text();
      }),
    ]).then(([questions, solutions]) => {
      if (cancelled) return;
      setQuestionText(questions);
      setSolutionText(solutions);
    }).catch((reason: unknown) => {
      if (!cancelled) setError(reason instanceof Error ? reason.message : "The chapter sources could not be loaded.");
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [chapter]);

  const questionBySection = useMemo(() => questionSections(questionText, chapter), [questionText, chapter]);
  const solutionBySection = useMemo(() => solutionSections(solutionText, chapter), [solutionText, chapter]);
  const items = useMemo(
    () => buildItems(questionBySection[section], solutionBySection[section], chapter),
    [questionBySection, solutionBySection, chapter, section],
  );
  const filteredItems = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) => item.id.toLowerCase().includes(needle) || item.title.toLowerCase().includes(needle));
  }, [items, search]);
  const active = filteredItems.find((item) => item.id === activeId) ?? filteredItems[0];
  const completionPrefix = `${chapter}:${section}:`;
  const sectionCompleted = items.filter((item) => completed.includes(completionPrefix + item.id)).length;
  const activeKey = active ? completionPrefix + active.id : "";
  const activeIndex = active ? filteredItems.findIndex((item) => item.id === active.id) : -1;
  const activeKind = section === "problems" ? "Problem" : section === "theory" ? "Theoretical exercise" : "Self-test item";

  const changeChapter = (next: Chapter) => {
    setChapter(next);
    setSection("problems");
    setActiveId("");
    setSearch("");
    setSourceView("closed");
  };
  const changeSection = (next: SectionKey) => {
    setSection(next);
    setActiveId("");
    setSearch("");
    setSourceView("closed");
  };
  const toggleComplete = (key: string) => setCompleted((old) => old.includes(key) ? old.filter((value) => value !== key) : [...old, key]);
  const toggleReveal = (key: string) => setRevealed((old) => ({ ...old, [key]: !old[key] }));

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <div className="eyebrow mb-3">Probability · Complete interactive question book</div>
        <h1 className="serif text-4xl text-parchment md:text-5xl">Book Number 1</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-dim">
          Work through every problem, theoretical exercise, and self-test item chapter by chapter. Select an item to read its question,
          reveal its worked solution, and track your progress.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {CHAPTERS.map((item) => (
          <button key={item.id} onClick={() => changeChapter(item.id)} className={`border px-4 py-3 text-left transition ${chapter === item.id ? "border-gold bg-gold/10" : "border-gold/20 hover:border-gold/50"}`}>
            <span className="block text-[10px] uppercase tracking-widest text-gold">Chapter {item.id}</span>
            <span className="serif mt-1 block text-lg text-parchment">{item.title}</span>
            <span className="mt-1 block text-xs text-dim">{item.subtitle}</span>
          </button>
        ))}
      </div>

      <div className="mb-5 flex flex-wrap gap-2 border-b border-gold/20 pb-4">
        {SECTIONS.map((item) => (
          <button key={item.id} onClick={() => changeSection(item.id)} className={`border px-4 py-2 text-xs uppercase tracking-widest transition ${section === item.id ? "border-gold bg-gold/10 text-gold" : "border-gold/20 text-dim hover:border-gold/50"}`}>
            {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="panel p-8 text-sm text-dim">Loading the complete chapter question and solution sets…</div>
      ) : error ? (
        <div className="panel p-8 text-sm text-red-400" role="alert">{error}</div>
      ) : items.length === 0 ? (
        <div className="panel p-8">
          <p className="text-sm text-dim">No individual items could be extracted from this source section. Open the complete source documents below to review the original material.</p>
        </div>
      ) : (
        <>
          <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="eyebrow">Chapter {chapter} · {SECTIONS.find((item) => item.id === section)?.label}</div>
              <p className="mt-1 text-xs text-dim">{items.length} items · {sectionCompleted}/{items.length} completed</p>
            </div>
            <div className="h-2 w-full overflow-hidden rounded bg-track md:w-52">
              <div className="h-full bg-gold transition-all" style={{ width: `${items.length ? sectionCompleted / items.length * 100 : 0}%` }} />
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[290px_minmax(0,1fr)]">
            <aside className="panel min-w-0 p-3">
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a problem…" className="mb-3 w-full border border-gold/20 bg-black/10 px-3 py-2 text-sm text-body outline-none focus:border-gold/60" />
              <div className="max-h-[70vh] space-y-1 overflow-y-auto pr-1">
                {filteredItems.map((item) => {
                  const key = completionPrefix + item.id;
                  return (
                    <button key={item.id} onClick={() => setActiveId(item.id)} className={`flex w-full items-start gap-3 border px-3 py-3 text-left transition ${active?.id === item.id ? "border-gold/60 bg-gold/10 text-parchment" : "border-transparent text-dim hover:border-gold/20 hover:bg-gold/5"}`}>
                      <span className="serif shrink-0 text-gold">{item.id}</span>
                      <span className="min-w-0 flex-1 text-sm leading-5">{item.title}</span>
                      {completed.includes(key) && <span className="text-ok" aria-label="Completed">✓</span>}
                    </button>
                  );
                })}
                {filteredItems.length === 0 && <p className="p-3 text-xs text-dim">No matching items.</p>}
              </div>
            </aside>

            {active ? (
              <article className="panel min-w-0 p-5 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="eyebrow">{activeKind} {active.id}</div>
                  <button onClick={() => toggleComplete(activeKey)} className={`border px-3 py-2 text-[10px] uppercase tracking-widest ${completed.includes(activeKey) ? "border-ok/50 text-ok" : "border-gold/30 text-gold hover:bg-gold/10"}`}>
                    {completed.includes(activeKey) ? "✓ Completed" : "Mark complete"}
                  </button>
                </div>
                <h2 className="serif mt-3 text-2xl leading-snug text-parchment md:text-3xl">{active.title}</h2>
                <div className="mt-6 border-l-2 border-gold/50 pl-4 text-sm leading-8 text-body">
                  <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-8">{active.question}</pre>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-gold/15 pt-5">
                  <div>
                    <div className="serif text-lg text-parchment">Worked solution</div>
                    <p className="mt-1 text-xs text-dim">Attempt the question before revealing the solution.</p>
                  </div>
                  <button onClick={() => toggleReveal(activeKey)} className="btn-gold" disabled={!active.hasSolution}>
                    {revealed[activeKey] ? "Hide solution" : "Reveal solution"}
                  </button>
                </div>
                {revealed[activeKey] && active.hasSolution && (
                  <div className="mt-5 rounded border border-gold/20 bg-gold/5 p-4 md:p-5">
                    <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-8 text-body">{active.solution}</pre>
                  </div>
                )}
                {!active.hasSolution && (
                  <p className="mt-4 text-xs leading-6 text-dim">
                    A separate worked solution for this item was not found in the supplied solution source. The complete solution document remains available below; no answer has been invented.
                  </p>
                )}

                <div className="mt-8 flex items-center justify-between border-t border-gold/15 pt-5">
                  <button disabled={activeIndex <= 0} onClick={() => setActiveId(filteredItems[activeIndex - 1].id)} className="btn-ghost disabled:opacity-30">← Previous</button>
                  <span className="text-xs text-faint">{activeIndex + 1} of {filteredItems.length}</span>
                  <button disabled={activeIndex < 0 || activeIndex >= filteredItems.length - 1} onClick={() => setActiveId(filteredItems[activeIndex + 1].id)} className="btn-ghost disabled:opacity-30">Next →</button>
                </div>
              </article>
            ) : (
              <div className="panel p-8 text-sm text-dim">Choose an item from the list.</div>
            )}
          </div>
        </>
      )}

      <div className="mt-7 border-t border-gold/20 pt-5">
        <button onClick={() => setSourceView(sourceView === "closed" ? "questions" : "closed")} className="text-xs uppercase tracking-widest text-gold hover:underline">
          {sourceView === "closed" ? "Open complete source documents" : "Hide source documents"}
        </button>
        {sourceView !== "closed" && (
          <div className="mt-4 panel p-4 md:p-6">
            <div className="mb-4 flex flex-wrap gap-2">
              <button onClick={() => setSourceView("questions")} className={`border px-3 py-2 text-xs uppercase tracking-widest ${sourceView === "questions" ? "border-gold bg-gold/10 text-gold" : "border-gold/20 text-dim"}`}>Questions</button>
              <button onClick={() => setSourceView("solutions")} className={`border px-3 py-2 text-xs uppercase tracking-widest ${sourceView === "solutions" ? "border-gold bg-gold/10 text-gold" : "border-gold/20 text-dim"}`}>Detailed solutions</button>
            </div>
            <div className="max-h-[70vh] overflow-auto">
              <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-6 text-body">{sourceView === "questions" ? questionText : solutionText}</pre>
            </div>
          </div>
        )}
      </div>

      <p className="mt-6 text-xs leading-6 text-faint">
        Progress is saved in this browser and remains separate from lesson mastery and LSR-1 rewards. Source-derived text preserves the original exercise numbering; page layout may differ from the PDF extraction.
      </p>
    </div>
  );
}
