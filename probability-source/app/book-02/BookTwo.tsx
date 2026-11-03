"use client";

import { useEffect, useState } from "react";

const chapters = [
  ["Probability and Counting", 1],
  ["Conditional Probability", 45],
  ["Random Variables and Their Distributions", 103],
  ["Expectation", 149],
  ["Continuous Random Variables", 213],
  ["Moments", 267],
  ["Joint Distributions", 303],
  ["Transformations", 367],
  ["Conditional Expectation", 411],
  ["Inequalities and Limit Theorems", 453],
  ["Markov Chains", 499],
  ["Markov Chain Monte Carlo", 533],
  ["Poisson Processes", 559],
] as const;

const base = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/probability-books/book-02`;
const progressKey = "limitless.probability.book-02.reader.v1";

export default function BookTwo() {
  const [chapter, setChapter] = useState(1);
  const [completed, setCompleted] = useState<number[]>([]);
  const [solutions, setSolutions] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(progressKey) || "{}");
      if (Number.isInteger(saved.chapter) && saved.chapter >= 1 && saved.chapter <= 13) setChapter(saved.chapter);
      if (Array.isArray(saved.completed)) setCompleted(saved.completed.filter((n: unknown) => Number.isInteger(n) && Number(n) >= 1 && Number(n) <= 13));
      if (typeof saved.solutions === "boolean") setSolutions(saved.solutions);
    } catch { /* local progress is optional */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(progressKey, JSON.stringify({ chapter, completed, solutions })); }
    catch { /* reader remains usable without storage */ }
  }, [chapter, completed, solutions]);

  useEffect(() => {
    let cancelled = false;
    const file = solutions
      ? `solutions/chapter-${String(chapter).padStart(2, "0")}-solutions.md`
      : `chapters/chapter-${String(chapter).padStart(2, "0")}.md`;
    setLoading(true);
    setError("");
    fetch(`${base}/${file}`)
      .then((r) => { if (!r.ok) throw new Error(`Chapter content not found (HTTP ${r.status}).`); return r.text(); })
      .then((text) => { if (!cancelled) setContent(text.replace(/^---[\\s\\S]*?---\\s*/m, "").replace(/^# .*\\n+/, "")); })
      .catch((e: unknown) => { if (!cancelled) setError(e instanceof Error ? e.message : "Unable to load chapter."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [chapter, solutions]);

  const [title, page] = chapters[chapter - 1];
  const percent = Math.round(completed.length / chapters.length * 100);

  return <div className="mx-auto max-w-6xl">
    <div className="mb-8">
      <div className="eyebrow mb-3">Probability · Reference library · Book 02</div>
      <h1 className="serif text-4xl text-parchment md:text-5xl">Introduction to Probability</h1>
      <p className="mt-3 text-sm leading-7 text-dim">Joseph K. Blitzstein and Jessica Hwang · Second Edition</p>
    </div>
    <section className="panel mb-6 p-4">
      <div className="flex justify-between text-xs"><span className="uppercase tracking-widest text-gold">Reading progress</span><span className="text-dim">{completed.length}/13 · {percent}%</span></div>
      <div className="mt-3 h-1.5 bg-gold/10"><div className="h-full bg-gold" style={{width: `${percent}%`}} /></div>
    </section>
    <nav className="mb-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Chapters">
      {chapters.map(([name], i) => <button key={i} onClick={() => {setChapter(i + 1); setSolutions(false);}} className={`border p-4 text-left ${chapter === i + 1 ? "border-gold bg-gold/10" : "border-gold/20 hover:border-gold/50"}`}>
        <span className="block text-[10px] uppercase tracking-widest text-gold">Chapter {i + 1}{completed.includes(i + 1) ? " · Complete" : ""}</span>
        <span className="serif mt-1 block text-lg text-parchment">{name}</span>
      </button>)}
    </nav>
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gold/20 pb-4">
      <div><div className="eyebrow">Chapter {chapter} · {title}</div><p className="mt-1 text-xs text-dim">Printed page {page}</p></div>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSolutions(false)} className={`border px-4 py-2 text-xs uppercase tracking-widest ${!solutions ? "border-gold text-gold" : "border-gold/20 text-dim"}`}>Textbook</button>
        <button onClick={() => setSolutions(true)} className={`border px-4 py-2 text-xs uppercase tracking-widest ${solutions ? "border-gold text-gold" : "border-gold/20 text-dim"}`}>Solutions</button>
        <button onClick={() => setCompleted(old => old.includes(chapter) ? old.filter(n => n !== chapter) : [...old, chapter].sort((a,b) => a-b))} className="border border-gold/30 px-4 py-2 text-xs text-gold">{completed.includes(chapter) ? "✓ Completed" : "Mark complete"}</button>
      </div>
    </div>
    <article className="panel min-h-[60vh] overflow-hidden">
      <header className="border-b border-gold/15 p-4 text-sm text-parchment">{solutions ? `Chapter ${chapter} — Detailed Solutions` : `Chapter ${chapter} — ${title}`}</header>
      <div className="p-5 md:p-8">
        {loading ? <p className="py-16 text-center text-sm text-dim">Loading…</p> : error ? <p role="alert" className="py-16 text-center text-sm text-red-300">{error}</p> : <pre className="whitespace-pre-wrap break-words font-serif text-[15px] leading-8 text-parchment">{content}</pre>}
      </div>
    </article>
    <div className="mt-4 flex justify-between">
      <button disabled={chapter === 1} onClick={() => {setChapter(n => n - 1); setSolutions(false);}} className="border border-gold/20 px-4 py-2 text-xs text-dim disabled:opacity-30">← Previous</button>
      <button disabled={chapter === 13} onClick={() => {setChapter(n => n + 1); setSolutions(false);}} className="border border-gold/30 px-4 py-2 text-xs text-gold disabled:opacity-30">Next chapter →</button>
    </div>
    <p className="mt-6 text-xs leading-6 text-dim">Book 02 progress is stored separately and does not modify Book 01 or Probability course progress.</p>
  </div>;
}
