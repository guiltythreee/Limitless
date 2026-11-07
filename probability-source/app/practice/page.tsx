"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Practice from "../components/Practice";
import { lessons, type Difficulty } from "../content";

type PracticeView = "overview" | "all" | "topics" | "saved" | "mistakes" | "history";

const VALID_VIEWS: PracticeView[] = ["overview", "all", "topics", "saved", "mistakes", "history"];
const VALID_DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];
const FIRST_QUIZ_LESSON = lessons.find((lesson) => lesson.quiz.length > 0) ?? lessons[0];

export default function StandalonePracticePage() {
  const [ready, setReady] = useState(false);
  const [lessonId, setLessonId] = useState(FIRST_QUIZ_LESSON.id);
  const [view, setView] = useState<PracticeView>("all");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedView = params.get("view");
    const requestedDifficulty = params.get("difficulty");

    setView(VALID_VIEWS.includes(requestedView as PracticeView)
      ? requestedView as PracticeView
      : "all");
    setDifficulty(VALID_DIFFICULTIES.includes(requestedDifficulty as Difficulty)
      ? requestedDifficulty as Difficulty
      : "all");
    setReady(true);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-gold/15 bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-4 lg:px-10">
          <Link href="/studies/" className="serif text-lg tracking-wide text-parchment">Probability Archive</Link>
          <Link href="/" className="border border-gold/30 px-3 py-2 text-[10px] uppercase tracking-[.14em] text-gold transition hover:bg-gold/10">↖ Course</Link>
        </div>
      </header>

      <main className="mx-auto min-h-screen max-w-[1440px] px-5 pb-16 pt-7 md:px-10">
        <nav className="mb-5 flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[.16em] text-dim" aria-label="Breadcrumb">
          <Link href="/studies/" className="hover:text-gold">Probability</Link>
          <span>/</span>
          <span>Question Bank</span>
        </nav>

        <section className="mb-7 border border-gold/20 bg-panel/70 p-6 md:p-8">
          <div className="eyebrow">Question Bank</div>
          <h1 className="serif mt-2 text-4xl text-parchment md:text-5xl">Practice</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-dim">
            Work through the complete Probability question bank, filter by topic and difficulty,
            and review your saved questions, mistakes and test history.
          </p>
        </section>

        {ready ? (
          <Practice
            lessonId={lessonId}
            onSelectLesson={(id) => setLessonId(id)}
            initialView={view}
            initialDifficulty={difficulty}
            initialScope="all"
            standalone
          />
        ) : (
          <div className="study-utility-panel p-8 text-sm text-dim" aria-live="polite">Loading question bank…</div>
        )}
      </main>
    </>
  );
}
