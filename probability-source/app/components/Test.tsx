"use client";

import { createElement, useEffect, useMemo, useRef, useState } from "react";
import { lessons, ranks, pad2, type Difficulty } from "../content";
import { Rich } from "../lib/rich";
import { allQuestions, isMulti, questionByKey, type Q, type Status } from "../lib/questions";
import { recordAttempt, recordTest, useStore, type TestRecord } from "../lib/store";
import { fmtTime } from "../lib/stats";
import { Options } from "./Practice";
import {
  clearPlayerAnswer,
  createLearningPlayerSession,
  selectPlayerQuestion,
  setPlayerAnswer,
  submitPlayerAnswer,
  tickPlayer,
} from "../../../shared/learning-player/runtime";
import { probabilityPlayerAdapter } from "../learning-player/adapter";
import type { ProbabilityPlayerAnswer } from "../learning-player/adapter-core";
import { createLearningPlayerShell } from "../../../shared/learning-player/PlayerShell";

const LearningPlayerShell = (props: Parameters<typeof createLearningPlayerShell>[1]) =>
  createLearningPlayerShell(createElement, props);

const MARK: Record<Status, string> = { correct: "✓", incorrect: "×", partial: "◐", unattempted: "" };
const MARKCLS: Record<Status, string> = { correct: "text-emerald-500", incorrect: "text-red-500", partial: "text-amber-500", unattempted: "" };

// Chapters (sequences) that have questions, each with its topics.
const chapters = ranks
  .map((r) => ({ rank: r, topics: lessons.filter((l) => l.rank === r.num && l.quiz.length > 0) }))
  .filter((c) => c.topics.length > 0);
const countOf = (lessonId: string) => allQuestions.filter((q) => q.lessonId === lessonId).length;

function Setup({ currentLessonId, onStart }: { currentLessonId: string; onStart: (p: Q[], label: string) => void }) {
  const store = useStore();
  const [chosen, setChosen] = useState<Set<string>>(() => new Set([currentLessonId]));
  const [size, setSize] = useState(10);
  const [pick, setPick] = useState<"mixed" | "new">("mixed");
  const [diff, setDiff] = useState<Difficulty | "all">("all");
  const [folded, setFolded] = useState<Set<number>>(new Set()); // chapters whose topic list is hidden

  // Following the open topic: when you move to another topic the selection starts from it again.
  useEffect(() => { setChosen(new Set([currentLessonId])); }, [currentLessonId]);

  const pool = useMemo(() => allQuestions.filter((q) => chosen.has(q.lessonId) && (diff === "all" || q.difficulty === diff)), [chosen, diff]);
  const allIds = chapters.flatMap((c) => c.topics.map((t) => t.id));
  const toggle = (ids: string[]) => {
    const next = new Set(chosen);
    const every = ids.every((i) => next.has(i));
    ids.forEach((i) => (every ? next.delete(i) : next.add(i)));
    setChosen(next);
  };
  const sizes = [5, 10, 20, 30, 50].filter((n) => n < pool.length);
  const label = chosen.size === allIds.length ? "All of probability"
    : chosen.size === 1 ? lessons.find((l) => chosen.has(l.id))!.title
    : chapters.filter((c) => c.topics.every((t) => chosen.has(t.id))).length && chapters.every((c) => c.topics.every((t) => chosen.has(t.id)) || c.topics.every((t) => !chosen.has(t.id)))
      ? chapters.filter((c) => c.topics.every((t) => chosen.has(t.id))).map((c) => `Sequence ${pad2(c.rank.num)}`).join(" + ")
      : `${chosen.size} topics`;

  function begin() {
    const base = pick === "new" ? pool.filter((q) => !store.attempts.some((a) => a.q === q.key)) : pool;
    const shuffled = [...(base.length >= Math.min(size, pool.length) ? base : pool)].sort(() => Math.random() - 0.5);
    onStart(shuffled.slice(0, size >= pool.length ? shuffled.length : size), label);
  }

  return (
    <div className="space-y-5">
      <div className="card">
        <div className="serif text-xl">Take a test</div>
        <p className="mt-1 text-sm text-dim">Choose what the test covers: a whole chapter, single topics, several chapters, or everything. Answers are marked when you finish, and every answer also counts in your analysis.</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button className="chip" onClick={() => setChosen(new Set(allIds))}>Everything</button>
          <button className="chip" onClick={() => setChosen(new Set([currentLessonId]))}>Only the open topic</button>
          <button className="chip" onClick={() => setChosen(new Set())}>Clear</button>
          <button className="chip" onClick={() => setFolded(folded.size ? new Set() : new Set(chapters.map((c) => c.rank.num)))}>{folded.size ? "Expand all" : "Collapse all"}</button>
        </div>

        <div className="mt-4 max-h-[360px] space-y-3 overflow-y-auto rounded-2xl border border-gold/15 p-3">
          {chapters.map((c) => {
            const ids = c.topics.map((t) => t.id);
            const on = ids.filter((i) => chosen.has(i)).length;
            return (
              <div key={c.rank.num}>
                <div className="flex items-center gap-2">
                <button type="button" onClick={() => { const n = new Set(folded); if (n.has(c.rank.num)) n.delete(c.rank.num); else n.add(c.rank.num); setFolded(n); }} aria-expanded={!folded.has(c.rank.num)} aria-label="Fold or unfold this chapter" className="w-4 text-[10px] text-mutedgold">{folded.has(c.rank.num) ? "▶" : "▼"}</button>
                <label className="flex flex-1 cursor-pointer items-center gap-3 text-sm text-parchment">
                  <input type="checkbox" className="h-4 w-4 accent-[var(--gold)]" checked={on === ids.length} ref={(el) => { if (el) el.indeterminate = on > 0 && on < ids.length; }} onChange={() => toggle(ids)} />
                  <span className="font-bold">Sequence {pad2(c.rank.num)} · {c.rank.name}</span>
                  <span className="ml-auto text-xs text-faint">{ids.reduce((n, i) => n + countOf(i), 0)} Qs</span>
                </label>
                </div>
                {!folded.has(c.rank.num) && <div className="mt-1 space-y-1 pl-9">
                  {c.topics.map((t) => (
                    <label key={t.id} className="flex cursor-pointer items-center gap-3 text-sm text-body">
                      <input type="checkbox" className="h-4 w-4 accent-[var(--gold)]" checked={chosen.has(t.id)} onChange={() => toggle([t.id])} />
                      <span className="min-w-0 flex-1">{t.title}</span>
                      <span className="text-xs text-faint">{countOf(t.id)}</span>
                    </label>
                  ))}
                </div>}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <select value={size} onChange={(e) => setSize(Number(e.target.value))} className="pill" aria-label="Number of questions">
            {sizes.map((n) => <option key={n} value={n}>{n} questions</option>)}<option value={9999}>All {pool.length} questions</option>
          </select>
          <select value={diff} onChange={(e) => setDiff(e.target.value as Difficulty | "all")} className="pill" aria-label="Difficulty"><option value="all">Any difficulty</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select>
          <select value={pick} onChange={(e) => setPick(e.target.value as "mixed" | "new")} className="pill" aria-label="Which questions"><option value="mixed">Random mix</option><option value="new">Prefer unattempted</option></select>
          <button className="btn-gold" disabled={pool.length === 0} onClick={begin}>Start test</button>
        </div>
        <div className="mt-2 text-xs text-faint">{chosen.size} topic{chosen.size === 1 ? "" : "s"} selected · {pool.length} questions available</div>
      </div>
      <div className="card">
        <div className="serif text-xl">Test history</div>
        {store.tests.length === 0 ? <p className="mt-3 text-sm text-dim">No tests taken yet.</p> : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[460px] text-left text-sm">
              <thead><tr className="text-[10px] uppercase tracking-[.12em] text-mutedgold"><th className="py-2 font-normal">Date</th><th className="font-normal">Covered</th><th className="font-normal">Score</th><th className="font-normal">Answered</th><th className="font-normal">Time</th></tr></thead>
              <tbody>{[...store.tests].reverse().map((t) => <tr key={t.id} className="border-t border-gold/10 text-body"><td className="py-2 pr-3">{new Date(t.ts).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</td><td className="pr-3">{t.label}</td><td>{t.score.toFixed(t.score % 1 ? 1 : 0)}/{t.total}</td><td>{t.answered}</td><td>{fmtTime(t.ms)}</td></tr>)}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function TestRun({ pool, label, onExit }: { pool: Q[]; label: string; onExit: () => void }) {
  const [session, setSession] = useState(() =>
    createLearningPlayerSession<Q, ProbabilityPlayerAnswer>(pool)
  );
  const i = session.state.index;
  const picks = useMemo(() => {
    const out: Record<string, number[]> = {};
    for (const question of pool) {
      const answer = session.answers[question.key];
      out[question.key] = !answer ? []
        : answer.kind === "multi-choice" ? answer.optionIds.map(Number)
        : [Number(answer.optionId)];
    }
    return out;
  }, [pool, session.answers]);
  const [done, setDone] = useState<TestRecord | null>(null);
  const times = useRef<Record<string, number>>({});
  const since = useRef(Date.now());
  const startedAt = useRef(Date.now());
  const [, tick] = useState(0);
  useEffect(() => { const iv = setInterval(() => tick((n) => n + 1), 1000); return () => clearInterval(iv); }, []);

  const q = pool[i];
  const bank = () => {
    if (!q) return;
    const now = Date.now();
    times.current[q.key] = (times.current[q.key] ?? 0) + (now - since.current);
    since.current = now;
  };
  const go = (n: number) => {
    bank();
    setSession((current) => selectPlayerQuestion(current, n));
  };
  function choose(k: number) {
    if (!q) return;
    const cur = picks[q.key] ?? [];
    const next = isMulti(q.item) ? (cur.includes(k) ? cur.filter((p) => p !== k) : [...cur, k]) : [k];
    const answer: ProbabilityPlayerAnswer | null = next.length === 0 ? null
      : isMulti(q.item)
        ? { kind: "multi-choice", optionIds: next.map(String) }
        : { kind: "single-choice", optionId: String(next[0]) };
    setSession((current) => answer
      ? setPlayerAnswer(current, probabilityPlayerAdapter, answer)
      : clearPlayerAnswer(current, probabilityPlayerAdapter));
  }
  function finish() {
    bank();
    let working = session;
    let correct = 0, score = 0, answered = 0;
    const results: TestRecord["results"] = [];
    for (let index = 0; index < pool.length; index++) {
      const question = pool[index];
      const picked = picks[question.key] ?? [];
      const ms = times.current[question.key] ?? 0;
      if (picked.length) {
        working = selectPlayerQuestion(working, index);
        working = tickPlayer(working, ms);
        const result = submitPlayerAnswer(working, probabilityPlayerAdapter, {
          submittedAt: Date.now(),
          mode: "exam",
        });
        if (!result.submission) {
          results.push({ q: question.key, status: "unattempted", ms });
          continue;
        }
        working = result.session;
        recordAttempt(question.key, picked, ms);
        const grade = result.submission.grade;
        answered++;
        score += grade.score;
        if (grade.correct) correct++;
        results.push({ q: question.key, status: grade.status, ms });
      } else {
        results.push({ q: question.key, status: "unattempted", ms });
      }
    }
    const rec: TestRecord = { id: `t${Date.now()}`, ts: Date.now(), label, total: pool.length, answered, correct, score, ms: Date.now() - startedAt.current, results };
    recordTest(rec);
    setSession(working);
    setDone(rec);
  }

  if (done) {
    return (
      <div className="space-y-5">
        <div className="card text-center">
          <div className="text-xs uppercase tracking-[.14em] text-mutedgold">Test finished</div>
          <div className="serif mt-2 text-4xl text-gold">{done.score.toFixed(done.score % 1 ? 1 : 0)} / {done.total}</div>
          <div className="mt-1 text-sm text-dim">{done.correct} fully correct · {done.answered} answered · {fmtTime(done.ms)} total</div>
        </div>
        <div className="card">
          {done.results.map((r, n) => (
            <div key={r.q} className="flex items-center gap-3 border-t border-gold/10 py-2 first:border-0 text-sm">
              <span className="w-6 text-faint">{n + 1}</span>
              <span className={`w-5 text-center ${MARKCLS[r.status as Status]}`}>{MARK[r.status as Status] || "–"}</span>
              <span className="clamp2 min-w-0 flex-1 text-body"><Rich text={questionByKey[r.q].item.question} /></span>
              <span className="text-xs text-faint">{r.ms ? fmtTime(r.ms) : ""}</span>
            </div>
          ))}
        </div>
        <button className="btn-gold" onClick={onExit}>Back to tests</button>
      </div>
    );
  }

  const answeredCount = Object.values(picks).filter((picked) => picked.length > 0).length;
  if (!q) return null;
  return (
    <LearningPlayerShell paletteClassName="mb-4 flex flex-wrap items-center gap-1.5" palette={pool.map((x, n) => (
          <button key={x.key} onClick={() => go(n)} className={`qnum ${picks[x.key]?.length ? "qnum-partial" : ""} ${n === i ? "qnum-cur" : ""}`} aria-label={`Question ${n + 1}${picks[x.key]?.length ? ", answered" : ", unanswered"}`} aria-current={n === i ? "step" : undefined}><span className="text-xs">{n + 1}</span><span className="qmark">{picks[x.key]?.length ? "•" : "·"}</span></button>
        ))}>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="text-sm text-body">Test · Q {i + 1}/{pool.length}</div>
        <div className="timerpill">⏱ {fmtTime(Date.now() - startedAt.current).padStart(5, "0")}</div>
        <div className="text-right text-xs text-dim">{answeredCount} answered</div>
      </div>
      <h4 className="qtext mt-6 text-lg leading-8 text-parchment"><Rich text={q.item.question} /></h4>
      {isMulti(q.item) && <div className="mt-1 text-xs text-mutedgold">Select all that apply.</div>}
      <Options item={q.item} picked={picks[q.key] ?? []} onPick={choose} reveal={false} disabled={false} />
      <div className="actionbar">
        <button className="btn-side" disabled={i === 0} onClick={() => go(i - 1)}>Previous</button>
        <button className="btn-main" onClick={() => { if (answeredCount === pool.length || window.confirm(`${pool.length - answeredCount} question(s) unanswered. Finish the test?`)) finish(); }}>Finish test</button>
        <button className="btn-side" disabled={i >= pool.length - 1} onClick={() => go(i + 1)}>Next</button>
      </div>
      <button onClick={onExit} className="mt-3 text-xs text-faint hover:text-gold">Abandon test</button>
    </LearningPlayerShell>
  );
}

export default function Test({ currentLessonId }: { currentLessonId: string }) {
  const [run, setRun] = useState<{ pool: Q[]; label: string } | null>(null);
  if (run) return <TestRun pool={run.pool} label={run.label} onExit={() => setRun(null)} />;
  return <Setup currentLessonId={currentLessonId} onStart={(pool, label) => setRun({ pool, label })} />;
}

