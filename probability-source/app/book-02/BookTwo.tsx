"use client";

import { Fragment, useEffect, useState } from "react";
import { Rich } from "../lib/rich";

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

function isBookChapter(value: unknown): value is BookChapter {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return Number.isInteger(item.id)
    && typeof item.title === "string"
    && typeof item.file === "string"
    && typeof item.solutions === "string"
    && Number.isInteger(item.printedStartPage);
}

function extractSourceText(markdown: string) {
  // The PDF extraction deliberately places the page-preserving transcription
  // in a fenced text block. Render its contents, not the Markdown fence itself.
  const fence = String.fromCharCode(96).repeat(3);
  const pattern = new RegExp("^" + fence + "text\\s*\\r?\\n([\\s\\S]*?)\\r?\\n" + fence + "[ \\t]*$", "m");
  const match = markdown.match(pattern);
  if (match) return match[1];
  return markdown.replace(/^# .*\r?\n+/, "").trim();
}

function SourceTranscription({ text }: { text: string }) {
  const lines = text.split(/\r?\n/);
  return (
    <pre className="m-0 min-w-0 whitespace-pre-wrap break-words font-serif text-[15px] leading-8 text-parchment [overflow-wrap:anywhere]">
      {lines.map((line, index) => (
        <Fragment key={index}>
          {line ? <Rich text={line} /> : ""}
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
  const [solutions, setSolutions] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hydrated, setHydrated] = useState(false);

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
    try {
      const saved = JSON.parse(localStorage.getItem(progressKey) || "{}");
      if (Number.isInteger(saved.chapter) && saved.chapter >= 1 && saved.chapter <= 13) setChapter(saved.chapter);
      if (Array.isArray(saved.completed)) {
        setCompleted(saved.completed.filter((n: unknown) => Number.isInteger(n) && Number(n) >= 1 && Number(n) <= 13));
      }
      if (typeof saved.solutions === "boolean") setSolutions(saved.solutions);
    } catch {
      // Local progress is optional; a malformed value must not block reading.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(progressKey, JSON.stringify({ chapter, completed, solutions }));
    } catch {
      // The reader remains usable when storage is unavailable.
    }
  }, [chapter, completed, solutions, hydrated]);

  const selected = catalogue.find((item) => item.id === chapter) ?? fallbackChapters[chapter - 1];

  useEffect(() => {
    let cancelled = false;
    const file = solutions ? selected.solutions : selected.file;

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
  }, [selected, solutions]);

  const percent = Math.round((completed.length / catalogue.length) * 100);

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
              setSolutions(false);
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
          <button
            onClick={() => setSolutions(false)}
            aria-pressed={!solutions}
            className={"border px-4 py-2 text-xs uppercase tracking-widest " + (!solutions ? "border-gold text-gold" : "border-gold/20 text-dim")}
          >
            Textbook
          </button>
          <button
            onClick={() => setSolutions(true)}
            aria-pressed={solutions}
            className={"border px-4 py-2 text-xs uppercase tracking-widest " + (solutions ? "border-gold text-gold" : "border-gold/20 text-dim")}
          >
            Solutions
          </button>
          <button
            onClick={() => setCompleted((old) => old.includes(chapter) ? old.filter((n) => n !== chapter) : [...old, chapter].sort((a, b) => a - b))}
            className="border border-gold/30 px-4 py-2 text-xs text-gold"
          >
            {completed.includes(chapter) ? "✓ Completed" : "Mark complete"}
          </button>
        </div>
      </div>

      <article className="panel min-h-[60vh] overflow-hidden">
        <header className="border-b border-gold/15 p-4 text-sm text-parchment">
          {solutions ? "Chapter " + chapter + " — Detailed Solutions" : "Chapter " + chapter + " — " + selected.title}
        </header>
        <div className="min-w-0 overflow-x-hidden p-5 md:p-8">
          {loading ? (
            <p className="py-16 text-center text-sm text-dim">Loading…</p>
          ) : error ? (
            <p role="alert" className="py-16 text-center text-sm text-red-300">{error}</p>
          ) : (
            <SourceTranscription text={content} />
          )}
        </div>
      </article>

      <div className="mt-4 flex justify-between">
        <button
          disabled={chapter === 1}
          onClick={() => {
            setChapter((value) => value - 1);
            setSolutions(false);
          }}
          className="border border-gold/20 px-4 py-2 text-xs text-dim disabled:opacity-30"
        >
          ← Previous
        </button>
        <button
          disabled={chapter === catalogue.length}
          onClick={() => {
            setChapter((value) => value + 1);
            setSolutions(false);
          }}
          className="border border-gold/30 px-4 py-2 text-xs text-gold disabled:opacity-30"
        >
          Next chapter →
        </button>
      </div>

      <p className="mt-6 text-xs leading-6 text-dim">
        Book 02 progress is stored separately and does not modify Book 01 or Probability course progress.
        Mathematical notation follows the extracted source transcription; ambiguous PDF glyphs may need manual verification.
      </p>
    </div>
  );
}
