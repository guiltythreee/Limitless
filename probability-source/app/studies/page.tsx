"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { lessons, pathways } from "../content";
import { allQuestions } from "../lib/questions";
import type { StudyProgressSnapshot } from "../../../shared/studies/contracts";
import { summarizeStudyProgress } from "../../../shared/studies/registry";
import { PROBABILITY_STUDIES_REGISTRATION } from "./registration";

const practiceHref = (view: string, difficulty?: string) => {
  const params = new URLSearchParams({ mode: "practice", view });
  if (difficulty) params.set("difficulty", difficulty);
  return `/?${params.toString()}#study`;
};

export default function ProbabilityStudiesLanding() {
  const [snapshots, setSnapshots] = useState<readonly StudyProgressSnapshot[]>([]);
  const [progressReady, setProgressReady] = useState(false);

  useEffect(() => {
    try {
      setSnapshots(PROBABILITY_STUDIES_REGISTRATION.readProgress?.() ?? []);
    } catch {
      setSnapshots([]);
    }
    setProgressReady(true);
  }, []);

  const summary = useMemo(
    () => summarizeStudyProgress(PROBABILITY_STUDIES_REGISTRATION, snapshots),
    [snapshots],
  );
  const byId = useMemo(() => new Map(snapshots.map((snapshot) => [snapshot.contentId, snapshot])), [snapshots]);
  const completed = lessons.filter((lesson) => byId.get(lesson.id)?.status === "completed").length;
  const inProgress = lessons.filter((lesson) => byId.get(lesson.id)?.status === "in-progress").length;
  const notStarted = lessons.filter((lesson) => byId.get(lesson.id)?.status === "not-started").length;
  const progressPercent = lessons.length ? Math.round((completed / lessons.length) * 100) : 0;
  const nextLesson = lessons.find((lesson) => byId.get(lesson.id)?.status === "in-progress")
    ?? lessons.find((lesson) => byId.get(lesson.id)?.status !== "completed")
    ?? lessons[0];
  const difficultyCounts = {
    easy: allQuestions.filter((question) => question.difficulty === "easy").length,
    medium: allQuestions.filter((question) => question.difficulty === "medium").length,
    hard: allQuestions.filter((question) => question.difficulty === "hard").length,
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-gold/15 bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-4 lg:px-10">
          <Link href="/studies/" className="serif text-lg tracking-wide text-parchment">Probability Archive</Link>
          <a href="/" className="border border-gold/30 px-3 py-2 text-[10px] uppercase tracking-[.14em] text-gold transition hover:bg-gold/10">↖ Limitless</a>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 pb-16 pt-7 md:px-10">
        <nav className="mb-5 flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[.16em] text-dim" aria-label="Breadcrumb">
          <a href="/" className="hover:text-gold">← Limitless</a><span>/</span><span>Studies &amp; Disciplines</span><span>/</span><span className="text-gold">Probability</span>
        </nav>

        <section id="overview" className="study-dark-surface relative isolate overflow-hidden border border-gold/25 bg-[linear-gradient(120deg,rgba(39,31,43,.96),rgba(20,16,25,.94))] px-7 py-9 md:px-12 md:py-12">
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-28 h-[430px] w-[430px] rounded-full border border-gold/15 shadow-[0_0_0_28px_rgba(223,194,123,.025),0_0_0_62px_rgba(223,194,123,.02)]" />
          <div aria-hidden="true" className="pointer-events-none absolute right-10 top-1/2 hidden h-56 w-56 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-gold/20 bg-gold/[.025] lg:flex">
            <span className="serif text-7xl leading-none text-gold">◇</span><span className="mt-3 text-[9px] tracking-[.35em] text-gold">LIMITLESS</span>
          </div>
          <div className="relative max-w-3xl">
            <div className="eyebrow">Studies &amp; Disciplines</div>
            <h1 className="serif mt-3 text-5xl leading-none tracking-tight text-parchment md:text-7xl">Probability</h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-dim md:text-base">A structured probability curriculum from foundations and counting through distributions, inference, stochastic processes and simulation.</p>
            <div className="mt-7 flex flex-wrap gap-2">
              <Link href={`/?lesson=${encodeURIComponent(nextLesson.id)}#study`} className="inline-flex items-center gap-2 border border-gold bg-gold px-5 py-3 text-xs font-semibold text-ongold transition hover:bg-goldhi">▶ Continue learning</Link>
              <Link href="/" className="border border-gold/35 px-4 py-3 text-xs text-parchment transition hover:bg-gold/10">Course overview</Link>
              <a href="#pathways" className="border border-gold/35 px-4 py-3 text-xs text-parchment transition hover:bg-gold/10">Learning routes</a>
              <a href="#practice" className="border border-gold/35 px-4 py-3 text-xs text-parchment transition hover:bg-gold/10">Practice questions</a>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-[9px] uppercase tracking-[.13em] text-dim">
              <span className="border border-gold/20 px-3 py-2">Active discipline</span><span className="border border-gold/20 px-3 py-2">1 learning route</span><span className="border border-gold/20 px-3 py-2">5 pathways</span>
            </div>
          </div>
        </section>

        <section className="mt-5 border border-gold/20 bg-panel/70 p-6 md:p-8" aria-labelledby="probability-progress-title">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><div className="eyebrow">Your record</div><h2 id="probability-progress-title" className="serif mt-2 text-3xl text-parchment">Study progress</h2></div>
            <span className="text-[10px] text-dim">{progressReady ? "Read from your existing browser progress" : "Reading saved progress…"}</span>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(180px,.8fr)_2fr] lg:items-center">
            <div>
              <div className="flex items-center justify-between text-sm"><span className="text-dim">Chapter completion</span><strong className="serif text-xl text-gold">{progressPercent}%</strong></div>
              <div className="mt-3 h-2 overflow-hidden rounded-full border border-gold/20 bg-track"><div className="h-full rounded-full bg-gold transition-all" style={{ width: `${progressPercent}%` }} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {[
                ["Total Qs", allQuestions.length],
                ["Completed", completed],
                ["In progress", inProgress],
                ["Not started", notStarted],
                ["Topics", lessons.length],
              ].map(([label, value]) => <div key={label} className="border-l border-gold/15 px-3"><div className="serif text-2xl text-parchment md:text-3xl">{value}</div><div className="mt-1 text-[10px] text-dim">{label}</div></div>)}
            </div>
          </div>
          <p className="mt-5 text-[10px] leading-5 text-faint">Chapter status is read from the existing Probability progress record. Question attempts and bookmarks remain in the Probability practice workspace.</p>
          {progressReady && summary.unknown === summary.totalContent && <p className="mt-2 text-xs text-dim">No recognised progress record was found. Your saved data has not been changed.</p>}
        </section>

        <section className="mt-7 grid gap-4 xl:grid-cols-[1.05fr_1fr_1fr_1fr]">
          <article className="study-dark-surface border border-gold/35 bg-[linear-gradient(135deg,rgba(65,48,47,.72),rgba(28,22,31,.95))] p-5">
            <div className="eyebrow">Pick up where you left off</div>
            <h2 className="serif mt-3 text-2xl text-parchment">Continue learning</h2>
            <Link href={`/?lesson=${encodeURIComponent(nextLesson.id)}#study`} className="mt-5 flex items-center justify-between gap-3 border border-gold/30 p-4 transition hover:border-gold/70 hover:bg-gold/5">
              <span><span className="block text-[10px] text-dim">Next chapter</span><strong className="serif mt-1 block text-lg text-parchment">{nextLesson.title}</strong><span className="mt-2 block text-[10px] text-dim">Sequence {String(nextLesson.rank).padStart(2, "0")} · {nextLesson.minutes} min</span></span><span className="text-xl text-gold">→</span>
            </Link>
          </article>

          <article id="pathways" className="border border-gold/20 bg-panel/70 p-5">
            <div className="eyebrow">Curriculum</div><h2 className="serif mt-3 text-2xl text-parchment">Learning pathways</h2>
            <div className="mt-4 space-y-1">
              {pathways.map((pathway, index) => <Link key={pathway.id} href={`/?pathway=${encodeURIComponent(pathway.id)}#study`} className="flex items-center gap-3 border-t border-gold/10 py-3 text-sm text-body transition hover:bg-gold/5"><span className="serif text-gold">{String(index + 1).padStart(2, "0")}</span><span className="min-w-0 flex-1">{pathway.label}</span><span className="text-xs text-dim">{pathway.lessonIds.length}</span><span className="text-gold">→</span></Link>)}
            </div>
          </article>

          <article id="practice" className="border border-gold/20 bg-panel/70 p-5">
            <div className="eyebrow">Question bank</div><h2 className="serif mt-3 text-2xl text-parchment">Practice</h2>
            <div className="mt-4 space-y-1">
              {[
                ["All questions", "all", "↗"],
                ["Topic-wise questions", "topics", "☷"],
                ["Bookmarked questions", "saved", "☆"],
                ["My mistakes", "mistakes", "⚠"],
                ["Test history", "history", "◷"],
              ].map(([label, view, symbol]) => <Link key={view} href={practiceHref(view)} className="flex items-center gap-3 border-t border-gold/10 py-3 text-sm text-body transition hover:bg-gold/5"><span className="w-5 text-gold">{symbol}</span><span className="flex-1">{label}</span><span className="text-gold">→</span></Link>)}
            </div>
            <div className="mt-4 border-t border-gold/15 pt-4">
              <div className="mb-3 text-[10px] uppercase tracking-[.15em] text-dim">Difficulty bands</div>
              {[
                ["Beginner", "easy", difficultyCounts.easy],
                ["Rank booster", "medium", difficultyCounts.medium],
                ["Advanced", "hard", difficultyCounts.hard],
              ].map(([label, difficulty, count]) => <Link key={difficulty} href={practiceHref("all", String(difficulty))} className="flex justify-between py-2 text-xs text-body hover:text-gold"><span>{label}</span><span className="text-dim">{count} Qs →</span></Link>)}
            </div>
          </article>

          <article id="resources" className="border border-gold/20 bg-panel/70 p-5">
            <div className="eyebrow">Reference library</div><h2 className="serif mt-3 text-2xl text-parchment">Resources</h2>
            <div className="mt-4 space-y-1">
              <Link href="/book-01/" className="flex items-center justify-between border-t border-gold/10 py-3 text-sm text-body hover:text-gold"><span>Book 01 · A First Course in Probability</span><span className="text-gold">→</span></Link>
              <Link href="/book-02/" className="flex items-center justify-between border-t border-gold/10 py-3 text-sm text-body hover:text-gold"><span>Book 02 · Introduction to Probability</span><span className="text-gold">→</span></Link>
              <Link href="/" className="flex items-center justify-between border-t border-gold/10 py-3 text-sm text-body hover:text-gold"><span>Course notes &amp; theory</span><span className="text-gold">→</span></Link>
              <Link href="/#study" className="flex items-center justify-between border-t border-gold/10 py-3 text-sm text-body hover:text-gold"><span>Worked examples &amp; tests</span><span className="text-gold">→</span></Link>
            </div>
          </article>
        </section>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gold/15 pt-5 text-[10px] text-faint">
          <span>Progress remains in the existing Probability store. This dashboard is a read-only view.</span>
          <Link href="/" className="uppercase tracking-[.15em] text-gold hover:underline">Open full Probability archive →</Link>
        </div>
      </main>
    </>
  );
}
