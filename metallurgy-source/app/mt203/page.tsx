"use client";

// MT203 — Polymer Science and Technology archive.
//
// One shell hosts the whole course:
//   • dashboard  — progress, XP/rank/streak, weak topics, module mastery
//   • study      — per-topic lesson reader + learning quiz
//   • practice   — mixed / weak-area / spaced-revision runs
//   • exam       — timed, closed-book simulator with full review
//
// PHASE 4b: the structure (modules, topics, titles, counts), the theory and all
// question content now come from the shared course registry entry
// (app/courses/entries/mt203). Questions are still code-split per topic
// (app/data/qbank/t*.ts) and fetched on demand through the registry adapter,
// so the 11 topic chunks stay separate. Progress is local (mm-mt203-v1) and
// tolerant of missing or malformed saved data.

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ALL_QUESTION_IDS, TOPIC_OF } from "../data/qbank/meta";
import { mdInline, mdToHtml } from "../lib/md";
import {
  loadProgress,
  loadTheme,
  markTheoryRead,
  Progress,
  resetProgress,
  saveTheme,
  toggleBookmark,
  topicAggregate,
} from "../lib/mt203-progress";
import Tex from "../lib/tex";
import { MT203_ENTRY, MT203_LESSONS } from "../courses/entries/mt203";
import type { TopicContent } from "../courses/types";
import Dashboard, { DashNav } from "./dashboard";
import Exam from "./exam";
import Player from "./player";
import Practice, { PracticeMode } from "./practice";
import { settleModuleBonuses } from "./rewards";
import BookmarksPanel from "../courses/BookmarksPanel";

type View =
  | { kind: "dashboard" }
  | { kind: "study"; topic: string; tab: "lesson" | "quiz"; questionId?: string }
  | { kind: "bookmarks" }
  | { kind: "practice"; mode: PracticeMode; scope: string; count: number }
  | { kind: "exam" };

const PRACTICE_COUNT = 20;

const MANIFEST = MT203_ENTRY.manifest;
const UNITS = MANIFEST.units;
const TOPICS = MANIFEST.topics;
const TOPIC_BY_ID: Record<string, (typeof TOPICS)[number]> = Object.fromEntries(
  TOPICS.map((t) => [t.id, t])
);
const countOf = (id: string) => TOPIC_BY_ID[id]?.count ?? 0;

export default function Mt203() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [progress, setProgress] = useState<Progress | null>(null);
  const [view, setView] = useState<View>({ kind: "dashboard" });
  const [topic, setTopic] = useState<TopicContent | null>(null);
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

  // load the topic's questions on demand through the registry adapter (the
  // dynamic imports and their caches live in app/mt203/types.ts, unchanged)
  useEffect(() => {
    if (view.kind !== "study") return;
    let live = true;
    setTopic(null);
    setError("");
    MT203_ENTRY.adapter
      .loadTopic(view.topic)
      .then((t) => live && setTopic(t))
      .catch(() => live && setError("This topic's question chunk could not be loaded."));
    return () => {
      live = false;
    };
  }, [view]);

  // mark theory as read when a lesson is opened
  useEffect(() => {
    if (view.kind !== "study" || view.tab !== "lesson" || !progress) return;
    if (!progress.theoryRead.includes(view.topic)) {
      setProgress(markTheoryRead(progress, view.topic));
    }
  }, [view, progress]);

  const onAnswer = useCallback((p: Progress) => setProgress(p), []);

  /** Settle module clear/mastery bonuses after a run; returns the latest state. */
  const settle = useCallback(
    (p: Progress) => {
      const r = settleModuleBonuses(p);
      if (r.xp > 0) setProgress(r.progress);
      return r.progress;
    },
    [],
  );

  const byTopic = useMemo(
    () => (progress ? topicAggregate(progress, TOPIC_OF, ALL_QUESTION_IDS) : {}),
    [progress],
  );

  // most recently attempted topic — drives "continue studying"
  const lastTopic = useMemo(() => {
    if (!progress) return null;
    for (let i = progress.attempts.length - 1; i >= 0; i--) {
      const t = TOPIC_OF[progress.attempts[i].q];
      if (t) return t;
    }
    return null;
  }, [progress]);

  const nav: DashNav = {
    study: (id) => setView({ kind: "study", topic: id, tab: "lesson" }),
    practice: (mode, scope) => setView({ kind: "practice", mode, scope, count: PRACTICE_COUNT }),
    exam: () => setView({ kind: "exam" }),
  };

  const activeTopic = view.kind === "study" ? view.topic : null;
  const lesson = activeTopic ? MT203_LESSONS[activeTopic] : null;

  const title = (() => {
    if (view.kind === "dashboard") return "Dashboard";
    if (view.kind === "exam") return "Exam Simulator";
    if (view.kind === "bookmarks") return "Bookmarked questions";
    if (view.kind === "practice")
      return view.mode === "mixed" ? "Mixed Practice" : view.mode === "weak" ? "Weak-area Training" : "Spaced Revision";
    return lesson?.title ?? view.topic;
  })();

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

      <div className="archive">
        {/* ---------------- sidebar ---------------- */}
        <aside className="panel side">
          <div className="side-head">
            <div className="t1">MT203 · Polymers</div>
            <div className="t2">{topics()}</div>
          </div>

          <button
            className={`ch-item ${view.kind === "dashboard" ? "active" : ""}`}
            onClick={() => setView({ kind: "dashboard" })}
          >
            <span className="ch-num">◧</span>
            <span className="ch-title">Dashboard · progress &amp; mastery</span>
          </button>

          <button
            className={`ch-item ${view.kind === "bookmarks" ? "active" : ""}`}
            onClick={() => setView({ kind: "bookmarks" })}
          >
            <span className="ch-num">★</span>
            <span>
              <span className="ch-title">Bookmarked questions</span>
              <span className="ch-meta"><span className="ch-pct">{progress?.bookmarks.length ?? 0} saved</span></span>
            </span>
          </button>

          <div className="ch-list" style={{ marginTop: "0.5rem" }}>
            {UNITS.map((u) => (
              <div key={u.id}>
                <div className="side-group">
                  Module {u.num} · {u.title}
                </div>
                {u.topicIds.map((tid) => {
                  const t = TOPIC_BY_ID[tid];
                  if (!t) return null;
                  const a = byTopic[t.id];
                  const pct = a?.pct ?? 0;
                  return (
                    <button
                      key={t.id}
                      className={`ch-item ${activeTopic === t.id ? "active" : ""}`}
                      onClick={() =>
                        setView({
                          kind: "study",
                          topic: t.id,
                          tab: view.kind === "study" ? view.tab : "lesson",
                        })
                      }
                    >
                      <span className="ch-num">{t.id.replace("t", "T")}</span>
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
              </div>
            ))}
          </div>

          <div className="ch-list" style={{ marginTop: "0.7rem", borderTop: "1px solid var(--panel-line)", paddingTop: "0.7rem" }}>
            <button
              className={`ch-item ${view.kind === "practice" && view.mode === "mixed" ? "active" : ""}`}
              onClick={() => setView({ kind: "practice", mode: "mixed", scope: "all", count: PRACTICE_COUNT })}
            >
              <span className="ch-num">🎲</span>
              <span className="ch-title">Mixed practice</span>
            </button>
            <button
              className={`ch-item ${view.kind === "practice" && view.mode === "weak" ? "active" : ""}`}
              onClick={() => setView({ kind: "practice", mode: "weak", scope: "all", count: PRACTICE_COUNT })}
            >
              <span className="ch-num">🎯</span>
              <span className="ch-title">Weak-area training</span>
            </button>
            <button
              className={`ch-item ${view.kind === "practice" && view.mode === "revision" ? "active" : ""}`}
              onClick={() => setView({ kind: "practice", mode: "revision", scope: "all", count: PRACTICE_COUNT })}
            >
              <span className="ch-num">🗓</span>
              <span className="ch-title">Spaced revision</span>
            </button>
            <button
              className={`ch-item exam ${view.kind === "exam" ? "active" : ""}`}
              onClick={() => setView({ kind: "exam" })}
            >
              <span className="ch-num">OX</span>
              <span>
                <span className="ch-title">Exam Simulator</span>
                <span className="ch-meta"><span className="ch-pct">timed · no peeking</span></span>
              </span>
            </button>
          </div>

          {progress && (
            <div style={{ padding: "0.9rem 0.5rem 0", borderTop: "1px solid var(--panel-line)", marginTop: "0.8rem" }}>
              <button
                className="btn"
                style={{ width: "100%", fontSize: "0.78rem" }}
                onClick={() => {
                  if (confirm("Erase all saved MT203 progress (XP, attempts, exams)?")) {
                    resetProgress();
                    setProgress(loadProgress());
                    setView({ kind: "dashboard" });
                  }
                }}
              >
                Reset progress
              </button>
            </div>
          )}
        </aside>

        {/* ---------------- main ---------------- */}
        <main className="main mt203">
          {progress && view.kind === "bookmarks" && (
            <BookmarksPanel
              bookmarks={progress.bookmarks}
              topics={TOPICS}
              resolveTopic={(questionId) => TOPIC_OF[questionId]}
              onOpen={(questionId, topicId) => setView({ kind: "study", topic: topicId, tab: "quiz", questionId })}
              onRemove={(questionId) => setProgress(toggleBookmark(progress, questionId))}
            />
          )}

          {progress && view.kind === "dashboard" && (
            <Dashboard progress={progress} onProgress={setProgress} nav={nav} lastTopic={lastTopic} />
          )}

          {progress && view.kind === "practice" && (
            <>
              <div className="panel topbar">
                <div>
                  <h2>{title}</h2>
                  <div className="sub">
                    {view.mode === "mixed"
                      ? view.scope === "all" ? "Random draw from the whole course" : `Random draw · M${view.scope.replace("m", "")}`
                      : view.mode === "weak" ? "Targeted at the topics you are getting wrong"
                      : "Spaced repetition — overdue and just-missed questions first"}
                  </div>
                </div>
              </div>
              <Practice
                mode={view.mode}
                scope={view.scope}
                count={view.count}
                progress={progress}
                onProgress={onAnswer}
                onFinished={settle}
                onExit={() => setView({ kind: "dashboard" })}
              />
            </>
          )}

          {progress && view.kind === "exam" && (
            <>
              <div className="panel topbar">
                <div>
                  <h2>Exam Simulator</h2>
                  <div className="sub">Closed-book · timed · full solutions on submission</div>
                </div>
                <div className="stats">
                  <span className="chip chip-gold">no peeking</span>
                </div>
              </div>
              <Exam progress={progress} onProgress={onAnswer} />
            </>
          )}

          {progress && view.kind === "study" && (
            <>
              <div className="panel topbar">
                <div style={{ minWidth: 0 }}>
                  <h2>{lesson?.title ?? view.topic}</h2>
                  <div className="sub">
                    {(lesson?.subtitle ?? "")}
                    {lesson ? ` · ${topic?.questions.length ?? (countOf(view.topic) || "…") } questions` : ""}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.7rem", alignItems: "center", flexWrap: "wrap" }}>
                  {progress.theoryRead.includes(view.topic) && <span className="chip">theory ✓</span>}
                  <div className="tabs">
                    <button
                      className={`tab ${view.tab === "lesson" ? "active" : ""}`}
                      onClick={() => setView({ ...view, tab: "lesson" })}
                    >
                      Lesson
                    </button>
                    <button
                      className={`tab ${view.tab === "quiz" ? "active" : ""}`}
                      onClick={() => setView({ ...view, tab: "quiz" })}
                    >
                      Quiz
                    </button>
                  </div>
                </div>
              </div>

              {view.tab === "lesson" && lesson && (
                <article className="panel prose">
                  <p className="aim">{lesson.aim}</p>
                  {lesson.sections.map((s) => (
                    <section key={s.heading}>
                      <h3>{s.heading}</h3>
                      <div dangerouslySetInnerHTML={{ __html: mdToHtml(s.body) }} />
                    </section>
                  ))}

                  {lesson.formulas.length > 0 && (
                    <>
                      <h3>Formula cards</h3>
                      <div className="formula-sheet">
                        {lesson.formulas.map((f) => (
                          <div className="fcard" key={f.name}>
                            <div className="fname">{f.name}</div>
                            <div className="fexpr"><Tex t={f.expr} display /></div>
                            {f.vars && f.vars.length > 0 && (
                              <dl className="fvars">
                                {f.vars.map((v) => {
                                  const [sym, def] = v.split("—").map((s) => s.trim());
                                  return (
                                    <div key={v}>
                                      <dt><Tex t={sym} /></dt>
                                      <dd dangerouslySetInnerHTML={{ __html: mdInline(def) }} />
                                    </div>
                                  );
                                })}
                              </dl>
                            )}
                            {f.note && <div className="fnote" dangerouslySetInnerHTML={{ __html: mdInline(f.note) }} />}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {lesson.memorise.length > 0 && (
                    <div className="memorise">
                      <h4>Memorise cold</h4>
                      <ul>
                        {lesson.memorise.map((m, i) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              )}

              {view.tab === "quiz" && topic && (
                <Player
                  questions={topic.questions}
                  mode="learn"
                  label={TOPIC_BY_ID[view.topic]?.title ?? view.topic}
                  progress={progress}
                  onProgress={onAnswer}
                  initialQuestionId={view.questionId}
                  onFinished={settle}
                  onExit={() => setView({ kind: "dashboard" })}
                />
              )}

              {view.tab === "quiz" && !topic && !error && (
                <div className="panel prose"><p>Opening the topic…</p></div>
              )}

              {error && (
                <div className="panel prose">
                  <p style={{ color: "var(--bad)" }}>{error}</p>
                </div>
              )}
            </>
          )}

          {!progress && <div className="panel prose"><p>Loading MT203…</p></div>}
        </main>
      </div>

      <footer className="site-footer">✧ &nbsp; MT203 · POLYMER SCIENCE &amp; TECHNOLOGY &nbsp;✧</footer>
    </>
  );
}

function topics(): string {
  const n = TOPICS.reduce((k, t) => k + t.count, 0);
  return `${n} questions · ${TOPICS.length} topics`;
}
