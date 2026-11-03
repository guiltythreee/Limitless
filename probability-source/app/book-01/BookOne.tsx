"use client";

import { useEffect, useState } from "react";

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
      <p className="mt-2 text-sm leading-7 text-dim">The complete chapter material is provided in separate Questions and Detailed solutions views, including problem sets, theoretical exercises, and self-test exercises.</p>
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

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <div className="eyebrow mb-3">Probability · Complete Question Book</div>
        <h1 className="serif text-4xl text-parchment md:text-5xl">Book Number 1</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-dim">
          Complete question sets and detailed solutions for Chapters 1–5. Each chapter includes its original problems,
          theoretical exercises, and self-test material where supplied. Choose a chapter, then switch between Questions
          and Detailed solutions.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {CHAPTERS.map((item) => (
          <button key={item.id} onClick={() => setChapter(item.id)} className={`border px-4 py-3 text-left transition ${chapter === item.id ? "border-gold bg-gold/10" : "border-gold/20 hover:border-gold/50"}`}>
            <span className="block text-[10px] uppercase tracking-widest text-gold">Chapter {item.id}</span>
            <span className="serif mt-1 block text-lg text-parchment">{item.title}</span>
            <span className="mt-1 block text-xs text-dim">{item.subtitle}</span>
          </button>
        ))}
      </div>

      <SourceChapterPanel chapter={chapter} />
      <p className="mt-6 text-xs leading-6 text-faint">
        Source notes are retained where an exercise depends on a missing textbook example or equation. Chapter 5 includes
        the separately supplied Problems 5.1–5.6, followed by the original textbook problem set 5.7–5.41.
      </p>
    </div>
  );
}
