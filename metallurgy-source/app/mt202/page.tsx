"use client";

// MT202 — Physical Metallurgy archive: lessons, chapter quizzes, exam
// simulator and calculators. Chapter question data is fetched on demand
// from /data/mt202/*.json; theory lives in app/data/lessons.ts.

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { LESSONS } from "../data/lessons";
import { mdInline, mdToHtml } from "../lib/md";
import Tex from "../lib/tex";
import { loadProgress, loadTheme, Progress, resetProgress, saveTheme } from "../lib/progress";
import Calculators from "./calculators";
import Exam from "./exam";
import Quiz from "./quiz";
import { CHAPTER_IDS, Chapter, LESSON_IDS, loadChapter } from "./types";

type View =
  | { kind: "study"; ch: string; tab: "lesson" | "quiz" }
  | { kind: "exam" }
  | { kind: "calc" };

export default function Mt202() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [progress, setProgress] = useState<Progress | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);
  const [view, setView] = useState<View>({ kind: "study", ch: "ch01", tab: "lesson" });
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setTheme(loadTheme());
    setProgress(loadProgress());
    const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
    fetch(`${base}/data/mt202/index.json`)
      .then((r) => r.json())
      .then((idx: { total: number; chapters: { id: string; count: number }[] }) => {
        const map: Record<string, number> = {};
        for (const c of idx.chapters) map[c.id] = c.count;
        setCounts(map);
        setTotal(idx.total);
      })
      .catch(() => setCounts({}));
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    saveTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  // load chapter data on demand
  useEffect(() => {
    if (view.kind !== "study") return;
    let live = true;
    setChapter(null);
    setError("");
    loadChapter(view.ch)
      .then((c) => live && setChapter(c))
      .catch(() => live && setError("The chamber could not be opened — the data files are missing."));
    return () => {
      live = false;
    };
  }, [view]);

  const onAnswer = useCallback((p: Progress) => setProgress(p), []);

  const chStats = (id: string) => {
    if (!progress) return { done: 0, right: 0, total: counts[id] ?? 0 };
    const prefix = `${id}-q`;
    let done = 0,
      right = 0;
    for (const [k, v] of Object.entries(progress.answered)) {
      if (k.startsWith(prefix)) {
        done++;
        if (v.correct) right++;
      }
    }
    return { done, right, total: counts[id] ?? 0 };
  };

  const activeCh = view.kind === "study" ? view.ch : null;
  const lesson = activeCh && activeCh !== "ch09" ? LESSONS[activeCh] : null;
  const st = activeCh ? chStats(activeCh) : null;

  return (
    <>
      <header className="navbar">
        <Link className="brand" href="/">M&amp;M Archive</Link>
        <nav className="nav-links" aria-label="Main navigation">
          <Link href="/">Disciplines</Link>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Switch theme">
            {theme === "dark" ? "◐" : "◑"}
          </button>
        </nav>
      </header>

      <div className="archive">
        {/* ---------------- sidebar ---------------- */}
        <aside className="panel side">
          <div className="side-head">
            <div className="t1">MT202 · Physical Metallurgy</div>
            <div className="t2">{total || "…"} questions · {CHAPTER_IDS.length} chambers</div>
          </div>

          <div className="ch-list">
            {LESSON_IDS.map((id) => {
              const s = chStats(id);
              const pct = s.total ? Math.round((s.done / s.total) * 100) : 0;
              return (
                <button
                  key={id}
                  className={`ch-item ${activeCh === id ? "active" : ""}`}
                  onClick={() => setView({ kind: "study", ch: id, tab: view.kind === "study" ? view.tab : "lesson" })}
                >
                  <span className="ch-num">{id.replace("ch", "")}</span>
                  <span>
                    <span className="ch-title">{LESSONS[id].title}</span>
                    <span className="ch-meta">
                      <span className="ch-bar"><i style={{ width: `${pct}%` }} /></span>
                      <span className="ch-pct">{pct}%</span>
                    </span>
                  </span>
                </button>
              );
            })}

            <button
              className={`ch-item exam ${view.kind === "exam" ? "active" : ""}`}
              onClick={() => setView({ kind: "exam" })}
            >
              <span className="ch-num">OX</span>
              <span>
                <span className="ch-title">Exam Simulator — Revision Mix</span>
                <span className="ch-meta">
                  <span className="ch-pct">timed · no peeking</span>
                </span>
              </span>
            </button>

            <button
              className={`ch-item ${view.kind === "calc" ? "active" : ""}`}
              onClick={() => setView({ kind: "calc" })}
            >
              <span className="ch-num">ƒx</span>
              <span>
                <span className="ch-title">Instruments — lever · Schmid · Hall–Petch · √(Dt)</span>
              </span>
            </button>
          </div>

          {progress && (
            <div style={{ padding: "0.9rem 0.5rem 0", borderTop: "1px solid var(--panel-line)", marginTop: "0.8rem" }}>
              <button
                className="btn"
                style={{ width: "100%", fontSize: "0.78rem" }}
                onClick={() => {
                  if (confirm("Erase all saved progress for MT202?")) {
                    resetProgress();
                    setProgress({ answered: {}, examBest: null });
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
          {view.kind === "exam" && progress && (
            <>
              <div className="panel topbar">
                <div>
                  <h2>Exam Simulator</h2>
                  <div className="sub">Ch09 revision mix or a random pull from every chapter</div>
                </div>
                <div className="stats">
                  <span className="chip chip-gold">closed-book · timed</span>
                </div>
              </div>
              <Exam progress={progress} onProgress={onAnswer} />
            </>
          )}

          {view.kind === "calc" && (
            <>
              <div className="panel topbar">
                <div>
                  <h2>Instruments</h2>
                  <div className="sub">Solvers for the numericals in the question bank</div>
                </div>
              </div>
              <Calculators />
            </>
          )}

          {view.kind === "study" && (
            <>
              <div className="panel topbar">
                <div style={{ minWidth: 0 }}>
                  <h2>{lesson ? lesson.title : "Revision Mix (HARD)"}</h2>
                  <div className="sub">
                    {lesson
                      ? `${counts[view.ch] ?? chapter?.questions.length ?? "…"} questions · lesson + quiz`
                      : `${counts.ch09 ?? "…"} questions · final exam training`}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.7rem", alignItems: "center", flexWrap: "wrap" }}>
                  {st && st.total > 0 && (
                    <div className="stats">
                      <span className="chip">{st.done}/{st.total} attempted</span>
                      <span className="chip chip-gold">{st.right} correct</span>
                    </div>
                  )}
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

              {view.tab === "lesson" && view.ch === "ch09" && (
                <div className="panel prose">
                  <p className="aim">
                    No theory here — this chamber is the final examination: fifty hard questions
                    drawn from the whole course, mixed without warning.
                  </p>
                  <p>
                    Open the <b>Quiz</b> tab to work through them chapter-style at your own pace,
                    or use the <b>Exam Simulator</b> in the sidebar for a timed, closed-book run
                    with no solutions until you submit.
                  </p>
                </div>
              )}

              {view.tab === "lesson" && lesson && (
                <article className="panel prose">
                  <p className="aim">{lesson.aim}</p>
                  {lesson.sections.map((s) => (
                    <section key={s.h}>
                      <h3>{s.h}</h3>
                      <div dangerouslySetInnerHTML={{ __html: mdToHtml(s.p) }} />
                    </section>
                  ))}

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
                        {f.note && (
                          <div className="fnote" dangerouslySetInnerHTML={{ __html: mdInline(f.note) }} />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="memorise">
                    <h4>Memorise cold</h4>
                    <ul>
                      {lesson.memorise.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              )}

              {view.tab === "quiz" && chapter && progress && (
                <Quiz ch={chapter} progress={progress} onProgress={setProgress} />
              )}

              {view.tab === "quiz" && !chapter && !error && (
                <div className="panel prose"><p>Opening the chamber…</p></div>
              )}

              {error && (
                <div className="panel prose">
                  <p style={{ color: "var(--bad)" }}>{error}</p>
                  <p>Run <code>npm run sync</code> in metallurgy-source, then rebuild.</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <footer className="site-footer">✧ &nbsp; MT202 · PHYSICAL METALLURGY &nbsp;✧</footer>
    </>
  );
}
