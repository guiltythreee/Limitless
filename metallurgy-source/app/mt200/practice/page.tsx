"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const STORAGE_KEY = "mm-mt200-practice-v1";

const papers = [
  { id: "I", title: "Rigorous Practice Paper", questions: "papers/paper-i.txt", solutions: "solutions/paper-i.txt", duration: "3 hours", marks: "100 + 8 bonus" },
  { id: "II", title: "Rigorous Practice Paper II", questions: "papers/paper-ii.txt", solutions: "solutions/paper-ii.txt", duration: "3 hours", marks: "100 + 8 bonus" },
  { id: "III", title: "Rigorous Practice Paper III", questions: "papers/paper-iii.txt", solutions: "solutions/paper-iii.txt", duration: "3 hours", marks: "100 + 8 bonus" },
  { id: "IV", title: "Exam-Format Practice Paper IV", questions: "papers/paper-iv.txt", solutions: "solutions/paper-iv.txt", duration: "2.5 hours", marks: "100" },
];

type Question = { id: string; text: string };
type SavedAnswers = Record<string, string>;

function splitQuestions(source: string): Question[] {
  const matches = [...source.matchAll(/^\s*([A-D]\d{1,2})\.\s*/gm)];
  return matches.map((match, index) => {
    const start = match.index ?? 0;
    const end = index + 1 < matches.length ? (matches[index + 1].index ?? source.length) : source.length;
    return { id: match[1], text: source.slice(start, end).trim() };
  }).filter((q) => q.text.length > 12);
}

function solutionFor(source: string, id: string): string {
  const escaped = id.replace(/[.*+?^{}()|[\]\\]/g, "\\$&");
  const heading = new RegExp("^\\s*" + escaped + "(?:\\s|[.)])", "m");
  const match = heading.exec(source);
  if (!match || match.index === undefined) return "";
  const start = match.index;
  const tail = source.slice(start);
  const next = /^\s*[A-D]\d{1,2}(?:\s|[.)])/gm;
  next.lastIndex = 1;
  const following = next.exec(tail);
  return tail.slice(0, following?.index ?? tail.length).trim();
}

export default function Mt200Practice() {
  const [paperId, setPaperId] = useState("I");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [solutionText, setSolutionText] = useState("");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<SavedAnswers>({});
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const paper = papers.find((item) => item.id === paperId) ?? papers[0];
  const current = questions[index];
  const answerKey = current ? `${paperId}:${current.id}` : "";
  const currentSolution = useMemo(
    () => current ? solutionFor(solutionText, current.id) : "",
    [current, solutionText],
  );

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setAnswers(JSON.parse(raw) as SavedAnswers);
    } catch {
      // A malformed local record is ignored; the course never touches other keys.
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    setQuestions([]);
    setIndex(0);
    setRevealed(false);
    Promise.all([
      fetch(`${basePath}/data/mt200/${paper.questions}`).then((r) => {
        if (!r.ok) throw new Error("Could not load the question paper.");
        return r.text();
      }),
      fetch(`${basePath}/data/mt200/${paper.solutions}`).then((r) => {
        if (!r.ok) throw new Error("Could not load the model solutions.");
        return r.text();
      }),
    ]).then(([questionSource, solutionSource]) => {
      if (cancelled) return;
      const parsed = splitQuestions(questionSource);
      if (!parsed.length) throw new Error("No question headings were found in this paper.");
      setQuestions(parsed);
      setSolutionText(solutionSource);
      setLoading(false);
    }).catch((reason: unknown) => {
      if (cancelled) return;
      setError(reason instanceof Error ? reason.message : "Unable to load this paper.");
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [paperId, paper.questions, paper.solutions]);

  const saveAnswer = useCallback((value: string) => {
    setAnswers((previous) => {
      const next = { ...previous, [answerKey]: value };
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* storage may be unavailable */ }
      return next;
    });
  }, [answerKey]);

  const completed = questions.filter((q) => (answers[`${paperId}:${q.id}`] ?? "").trim().length > 0).length;

  return (
    <>
      <header className="navbar">
        <Link className="brand" href="/mt200">MT200 · Testing of Materials</Link>
        <nav className="nav-links"><Link href="/mt200">Course overview</Link></nav>
      </header>
      <main className="mt200-page">
        <div className="mt200-practice-head">
          <div className="eyebrow">MT200 · Practice workspace</div>
          <h1>Work through the papers</h1>
          <p>Answer one question at a time. Your written work is saved in this browser under a separate MT200 practice key. Reveal the matching model solution only when you are ready.</p>
          <div className="mt200-paper-select">
            {papers.map((item) => <button key={item.id} className={paperId === item.id ? "btn btn-gold" : "btn"} onClick={() => setPaperId(item.id)}>Paper {item.id}</button>)}
          </div>
        </div>

        {loading ? <section className="panel mt200-practice-panel">Loading the selected paper…</section> : null}
        {error ? <section className="panel mt200-practice-panel" role="alert">{error}</section> : null}

        {!loading && !error && current ? (
          <>
            <div className="mt200-practice-status">
              <span>Paper {paper.id} · {paper.duration} · {paper.marks}</span>
              <span>{completed} / {questions.length} questions attempted</span>
            </div>
            <div className="mt200-progress-track"><span style={{ width: `${questions.length ? completed / questions.length * 100 : 0}%` }} /></div>
            <section className="panel mt200-practice-panel">
              <div className="mt200-question-head">
                <span className="chip chip-gold">Question {index + 1} of {questions.length}</span>
                <span className="mt200-question-id">{current.id}</span>
              </div>
              <pre className="mt200-question-text">{current.text}</pre>
              <label className="mt200-answer-label" htmlFor="mt200-answer">Your working / answer</label>
              <textarea id="mt200-answer" className="mt200-answer" value={answers[answerKey] ?? ""} onChange={(event) => saveAnswer(event.target.value)} placeholder="Write your derivation, assumptions, calculations and final answer here…" rows={9} />
              <div className="mt200-practice-actions">
                <button className="btn" disabled={index === 0} onClick={() => { setIndex((n) => n - 1); setRevealed(false); }}>Previous</button>
                <button className="btn btn-gold" onClick={() => setRevealed((value) => !value)}>{revealed ? "Hide model solution" : "Reveal model solution"}</button>
                <button className="btn" disabled={index >= questions.length - 1} onClick={() => { setIndex((n) => n + 1); setRevealed(false); }}>Next question</button>
              </div>
              {revealed ? (
                <div className="mt200-solution">
                  <h2>Model solution · {current.id}</h2>
                  {currentSolution ? <pre>{currentSolution}</pre> : <p>The solution file does not use a separate heading for this item. Open the complete companion solution to locate it.</p>}
                  <a className="btn" href={`${basePath}/data/mt200/${paper.solutions}`} target="_blank" rel="noreferrer">Open complete marking scheme</a>
                </div>
              ) : null}
            </section>
            <div className="mt200-question-jump" aria-label="Jump to question">
              {questions.map((q, i) => <button key={q.id} className={i === index ? "active" : (answers[`${paperId}:${q.id}`] ?? "").trim() ? "answered" : ""} onClick={() => { setIndex(i); setRevealed(false); }} aria-label={`Go to question ${q.id}`}>{q.id}</button>)}
            </div>
            <p className="mt200-note">Progress is stored locally in this browser only. It is separate from MT201, MT202 and MT203 progress. Paper IV includes curve-reading questions; use the original supplied paper figures when attempting those questions.</p>
          </>
        ) : null}
      </main>
    </>
  );
}
