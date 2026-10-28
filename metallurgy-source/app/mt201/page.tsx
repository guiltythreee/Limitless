"use client";

// MT201 — Metallurgical Thermodynamics archive: fourteen chapters of
// chapter-wise MCQs with worked solutions, plus an exam simulator.
//
// PHASE 3: the outline (titles, counts, total) and all question content now
// come from the shared course registry entry (app/courses/entries/mt201)
// instead of fetching index.json directly. Chapter JSON is still fetched on
// demand from /data/mt201/*.json through the registry adapter, ids are
// unchanged (`ch01-q12`), and the storage key mm-mt201-v1 is untouched — so
// saved progress loads exactly as before.

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { activityLog, loadProgress, loadTheme, Progress, resetProgress, saveTheme, toggleBookmark } from "./progress";
import BookmarksPanel from "../courses/BookmarksPanel";
import ActivityHistoryPanel from "../courses/ActivityHistoryPanel";
import Exam from "./exam";
import Quiz from "./quiz";
import { MT201_ENTRY } from "../courses/entries/mt201";
import type { TopicContent } from "../courses/types";

const MANIFEST = MT201_ENTRY.manifest;
const TOPICS = MANIFEST.topics;
const TOTAL = TOPICS.reduce((sum, t) => sum + t.count, 0);
const titleOf = (id: string) => TOPICS.find((t) => t.id === id)?.title ?? id;
const topicOfBookmark = (id: string) => /^(ch\d+)-q\d+$/.exec(id)?.[1];

type View = { kind: "study"; ch: string; questionId?: string } | { kind: "exam" } | { kind: "bookmarks" } | { kind: "history" } | { kind: "mistakes" };

export default function Mt201() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [progress, setProgress] = useState<Progress | null>(null);
  const [view, setView] = useState<View>({ kind: "study", ch: TOPICS[0].id });
  const [chapter, setChapter] = useState<TopicContent | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setTheme(loadTheme());
    setProgress(loadProgress());
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
        <aside className="panel side">
          <div className="side-head">
            <div className="t1">{MANIFEST.code} · {MANIFEST.title}</div>
            <div className="t2">{TOTAL} questions · {TOPICS.length} chambers</div>
          </div>

          <div className="ch-list">
            {TOPICS.map((t) => {
              const s = chStats(t.id);
              const pct = s.total ? Math.round((s.done / s.total) * 100) : 0;
              return (
                <button
                  key={t.id}
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

            <button
              className={`ch-item ${view.kind === "bookmarks" ? "active" : ""}`}
              onClick={() => setView({ kind: "bookmarks" })}
            >
              <span className="ch-num">★</span>
              <span>
                <span className="ch-title">Bookmarked questions</span>
                <span className="ch-meta"><span className="ch-pct">{progress?.bookmarks?.length ?? 0} saved</span></span>
              </span>
            </button>

            <button
              className={`ch-item ${view.kind === "history" ? "active" : ""}`}
              onClick={() => setView({ kind: "history" })}
            >
              <span className="ch-num">↺</span>
              <span className="ch-title">Attempt history</span>
            </button>
            <button
              className={`ch-item ${view.kind === "mistakes" ? "active" : ""}`}
              onClick={() => setView({ kind: "mistakes" })}
            >
              <span className="ch-num">!</span>
              <span className="ch-title">Latest mistakes</span>
            </button>

            <button
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
                  if (confirm("Erase all saved progress for MT201?")) {
                    resetProgress();
                    setProgress({ answered: {}, examBest: null, bookmarks: [] });
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
          {view.kind === "bookmarks" && progress && (
            <BookmarksPanel
              bookmarks={progress.bookmarks ?? []}
              topics={TOPICS}
              resolveTopic={topicOfBookmark}
              onOpen={(questionId, topicId) => setView({ kind: "study", ch: topicId, questionId })}
              onRemove={(questionId) => setProgress(toggleBookmark(progress, questionId))}
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
