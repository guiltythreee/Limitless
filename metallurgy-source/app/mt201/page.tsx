"use client";

// MT201 — Metallurgical Thermodynamics archive: seventeen chapters of
// chapter-wise MCQs with worked solutions, plus an exam simulator.
//
// PHASE 3: the outline (titles, counts, total) and all question content now
// come from the shared course registry entry (app/courses/entries/mt201)
// instead of fetching index.json directly. Chapter JSON is still fetched on
// demand from /data/mt201/*.json through the registry adapter, ids are
// unchanged (`ch01-q12`), and the storage key mm-mt201-v1 is untouched — so
// saved progress loads exactly as before.

import Link from "next/link";
import { createElement, useCallback, useEffect, useState } from "react";
import { createStudyUtilityNav } from "../../../shared/studies/StudyUtilityNav";
import { activityLog, loadProgress, loadTheme, Progress, resetProgress, saveTheme, setDailyGoal, toggleBookmark } from "./progress";
import BookmarksPanel from "../courses/BookmarksPanel";
import ActivityHistoryPanel from "../courses/ActivityHistoryPanel";
import DailyGoalsPanel from "../courses/DailyGoalsPanel";
import Exam from "./exam";
import Quiz from "./quiz";
import { MT201_ENTRY } from "../courses/entries/mt201";
import CourseChapterBrowser from "../courses/CourseChapterBrowser";
import type { TopicContent } from "../courses/types";

const MANIFEST = MT201_ENTRY.manifest;
const TOPICS = MANIFEST.topics;
const TOTAL = TOPICS.reduce((sum, t) => sum + t.count, 0);
const titleOf = (id: string) => TOPICS.find((t) => t.id === id)?.title ?? id;
const topicOfBookmark = (id: string) => /^(ch\d+)-q\d+$/.exec(id)?.[1];

type View = { kind: "overview" } | { kind: "study"; ch: string; questionId?: string } | { kind: "exam" } | { kind: "bookmarks" } | { kind: "history" } | { kind: "mistakes" } | { kind: "goals" };

export default function Mt201() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [progress, setProgress] = useState<Progress | null>(null);
  const [view, setView] = useState<View>({ kind: "overview" });
  const [chapter, setChapter] = useState<TopicContent | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setTheme(loadTheme());
    setProgress(loadProgress());
    const requestedChapter = new URLSearchParams(window.location.search).get("chapter");
    if (requestedChapter && TOPICS.some((topic) => topic.id === requestedChapter)) {
      setView({ kind: "study", ch: requestedChapter });
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    saveTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  // load the active chapter through the registry adapter (fetch + cache live
  // in app/mt201/types.ts, unchanged)
  useEffect(() => {
    if (view.kind !== "study") return;
    let live = true;
    setChapter(null);
    setError("");
    MT201_ENTRY.adapter
      .loadTopic(view.ch)
      .then((c) => live && setChapter(c))
      .catch(() => live && setError("The chamber could not be opened — the data files are missing."));
    return () => {
      live = false;
    };
  }, [view]);

  const onAnswer = useCallback((p: Progress) => setProgress(p), []);

  const chStats = (id: string) => {
    const total = TOPICS.find((t) => t.id === id)?.count ?? 0;
    if (!progress) return { done: 0, right: 0, total };
    const prefix = `${id}-q`;
    let done = 0,
      right = 0;
    for (const [k, v] of Object.entries(progress.answered)) {
      if (k.startsWith(prefix)) {
        done++;
        if (v.correct) right++;
      }
    }
    return { done, right, total };
  };

  const activeCh = view.kind === "study" ? view.ch : null;
  const st = activeCh ? chStats(activeCh) : null;

  return (
    <>
      <header className="navbar">
        <Link className="brand" href="/">M&amp;M Archive</Link>
        <nav className="nav-links" aria-label="Main navigation">
          <Link href="/">Disciplines</Link>
          <Link href="/mt202/">MT202</Link>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Switch theme">
            {theme === "dark" ? "◐" : "◑"}
          </button>
        </nav>
      </header>

      <div className="archive mt201">
        {/* ---------------- sidebar ---------------- */}
        <aside className="panel side" aria-label="MT201 course navigation">
          <div className="side-head">
            <div className="t1">{MANIFEST.code} · {MANIFEST.title}</div>
            <div className="t2">{TOTAL} questions · {TOPICS.length} chambers</div>
          </div>

          <button className={`ch-item ${view.kind === "overview" ? "active" : ""}`} aria-current={view.kind === "overview" ? "page" : undefined} onClick={() => setView({ kind: "overview" })}><span className="ch-num">⌂</span><span className="ch-title">Course overview</span></button>
          <div className="ch-list">
            {view.kind !== "overview" && TOPICS.map((t) => {
              const s = chStats(t.id);
              const pct = s.total ? Math.round((s.done / s.total) * 100) : 0;
              return (
                <button
                  key={t.id}
                  aria-current={activeCh === t.id ? "location" : undefined}
                  className={`ch-item ${activeCh === t.id ? "active" : ""}`}
                  onClick={() => setView({ kind: "study", ch: t.id })}
                >
                  <span className="ch-num">{t.id.replace("ch", "")}</span>
                  <span>
                    <span className="ch-title">{t.title}</span>
                    <span className="ch-meta">
                      <span className="ch-bar"><i style={{ width: `${pct}%` }} /></span>
                      <span className="ch-pct">{pct}%</span>
                    </span>
                  </span>
                </button>
              );
            })}

            {createStudyUtilityNav(createElement, {
              className: "course-utility-nav",
              items: [
                { id: "bookmarks", label: "Bookmarked questions", count: progress?.bookmarks?.length ?? 0, active: view.kind === "bookmarks" },
                { id: "history", label: "Attempt history", active: view.kind === "history" },
                { id: "mistakes", label: "Latest mistakes", active: view.kind === "mistakes" },
                { id: "goals", label: "Daily goal & streak", active: view.kind === "goals" },
              ],
              onSelect: (id) => setView({ kind: id as "bookmarks" | "history" | "mistakes" | "goals" }),
            })}

            <button
              aria-current={view.kind === "exam" ? "location" : undefined}
              className={`ch-item exam ${view.kind === "exam" ? "active" : ""}`}
              onClick={() => setView({ kind: "exam" })}
            >
              <span className="ch-num">OX</span>
              <span>
                <span className="ch-title">Exam Simulator — full-course random pull</span>
                <span className="ch-meta">
                  <span className="ch-pct">timed · no peeking</span>
                </span>
              </span>
            </button>
          </div>

          {progress && (
            <div style={{ padding: "0.9rem 0.5rem 0", borderTop: "1px solid var(--panel-line)", marginTop: "0.8rem" }}>
              <button
                className="btn"
                style={{ width: "100%", fontSize: "0.78rem" }}
                onClick={() => {
                  if (confirm("Erase saved MT201 answers and exam best? Lifetime Meta EXP is kept.")) {
                    resetProgress();
                    setProgress(loadProgress());
                  }
                }}
              >
                Reset progress
              </button>
            </div>
          )}
        </aside>

        {/* ---------------- main ---------------- */}
        <main className="main">
          {view.kind === "overview" && <CourseChapterBrowser code={MANIFEST.code} title={MANIFEST.title} description={MANIFEST.description} topics={TOPICS} totalQuestions={TOTAL} statsFor={chStats} onSelect={(id) => setView({ kind: "study", ch: id })} />}
          {view.kind === "bookmarks" && progress && (
            <BookmarksPanel
              bookmarks={progress.bookmarks ?? []}
              topics={TOPICS}
              resolveTopic={topicOfBookmark}
              onOpen={(questionId, topicId) => setView({ kind: "study", ch: topicId, questionId })}
              onRemove={(questionId) => setProgress(toggleBookmark(progress, questionId))}
            />
          )}
          {view.kind === "goals" && progress && (
            <DailyGoalsPanel
              activities={activityLog.load()}
              goal={progress.goal}
              goalByDay={progress.goalByDay}
              onSetGoal={(goal) => setProgress(setDailyGoal(progress, goal))}
            />
          )}
          {view.kind === "history" && progress && (
            <ActivityHistoryPanel
              activities={activityLog.load()}
              topics={TOPICS}
              resolveTopic={topicOfBookmark}
              onOpen={(questionId, topicId) => setView({ kind: "study", ch: topicId, questionId })}
            />
          )}
          {view.kind === "mistakes" && progress && (
            <ActivityHistoryPanel
              activities={activityLog.load()}
              topics={TOPICS}
              resolveTopic={topicOfBookmark}
              onOpen={(questionId, topicId) => setView({ kind: "study", ch: topicId, questionId })}
              view="mistakes"
            />
          )}

          {view.kind === "exam" && progress && (
            <>
              <div className="panel topbar">
                <div>
                  <h2>Exam Simulator</h2>
                  <div className="sub">a random pull from every chamber of the course</div>
                </div>
                <div className="stats">
                  <span className="chip chip-gold">closed-book · timed</span>
                </div>
              </div>
              <Exam
                progress={progress}
                onProgress={onAnswer}
                topics={TOPICS.map((t) => ({ id: t.id, title: t.title }))}
              />
            </>
          )}

          {view.kind === "study" && (
            <>
              <div className="panel topbar">
                <div style={{ minWidth: 0 }}>
                  <h2>{titleOf(view.ch)}</h2>
                  <div className="sub">
                    {`${TOPICS.find((t) => t.id === view.ch)?.count ?? chapter?.questions.length ?? "…"} questions · worked solutions on reveal`}
                  </div>
                </div>
                {st && st.total > 0 && (
                  <div className="stats">
                    <span className="chip">{st.done}/{st.total} attempted</span>
                    <span className="chip chip-gold">{st.right} correct</span>
                  </div>
                )}
              </div>

              {chapter && progress && (
                <Quiz
                  topicId={view.ch}
                  questions={chapter.questions}
                  progress={progress}
                  onProgress={setProgress}
                  initialQuestionId={view.questionId}
                />
              )}

              {!chapter && !error && (
                <div className="panel prose"><p>Opening the chamber…</p></div>
              )}

              {error && (
                <div className="panel prose">
                  <p style={{ color: "var(--bad)" }}>{error}</p>
                  <p>Run <code>npm run sync201</code> in metallurgy-source, then rebuild.</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <footer className="site-footer">✧ &nbsp; MT201 · METALLURGICAL THERMODYNAMICS &nbsp;✧</footer>
    </>
  );
}
