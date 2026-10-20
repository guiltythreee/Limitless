"use client";

// Timed exam simulator — closed book, no feedback until you submit. Draws from
// one module or the whole course, then reviews every question with its solution
// and records the paper into progress (so weak topics surface on the dashboard).
//
// XP: each first-correct answer pays once; clearing a module or reaching its
// mastery criteria pays a one-time bonus (settleModuleBonuses).

import { useEffect, useRef, useState } from "react";
import {
  moduleOfTopic,
  moduleQuestionIds,
  topicsOfModule,
  TOPIC_OF,
} from "../data/qbank/meta";
import {
  awardAnswer,
  moduleAgg,
  Progress,
  recordAnswer,
  recordExam,
} from "../lib/mt203-progress";
import { MT203_ENTRY } from "../courses/entries/mt203";
import { OptionList, QuestionBody, QuestionMeta, SolutionPanel } from "./qview";
import { settleModuleBonuses } from "./rewards";
import type { Question } from "../courses/types";

// PHASE 4b: the scope tabs and exam labels come from the manifest's units, and
// questions are drawn through the registry adapter — so the per-topic dynamic
// imports (and the separate production chunks) stay intact. Recording still
// writes the same question ids to mm-mt203-v1.
const UNITS = MT203_ENTRY.manifest.units;
const adapter = MT203_ENTRY.adapter;

const loadAllQuestions = async (): Promise<Question[]> => {
  const parts = await Promise.all(MT203_ENTRY.manifest.topics.map((t) => adapter.loadTopic(t.id)));
  return parts.flatMap((c) => c.questions);
};

const loadUnitQuestions = (unitId: string): Promise<Question[]> => {
  if (!adapter.loadUnit) return Promise.reject(new Error(`no unit loader for ${unitId}`));
  return adapter.loadUnit(unitId);
};

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.max(0, s % 60)).padStart(2, "0")}`;

const shuffle = <T,>(a: T[]): T[] => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};

export default function Exam({
  progress,
  onProgress,
}: {
  progress: Progress;
  onProgress: (p: Progress) => void;
}) {
  const [scope, setScope] = useState<string>("all");
  const [count, setCount] = useState(30);
  const [minutes, setMinutes] = useState(30);

  const [running, setRunning] = useState(false);
  const [pool, setPool] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [idx, setIdx] = useState(0);
  const [left, setLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [gained, setGained] = useState(0);
  const [busy, setBusy] = useState(false);
  const finishRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!running || submitted) return;
    const t = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          finishRef.current();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running, submitted]);

  const start = async () => {
    setBusy(true);
    try {
      const pool =
        scope === "all" ? await loadAllQuestions() : await loadUnitQuestions(scope);
      const drawn = shuffle(pool).slice(0, Math.min(count, pool.length));
      setPool(drawn);
      setAnswers({});
      setIdx(0);
      setLeft(Math.max(1, minutes) * 60);
      setSubmitted(false);
      setGained(0);
      setRunning(true);
    } finally {
      setBusy(false);
    }
  };

  const finish = () => {
    const sc = pool.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0);
    let p = progress;
    let xp = 0;
    pool.forEach((q, i) => {
      const a = answers[i];
      if (!a) return;
      const ok = a === q.answer;
      p = recordAnswer(p, q.id, a, ok, "exam", 0);
      const r = awardAnswer(p, q.id, q.difficulty, ok);
      p = r.progress;
      xp += r.xp;
    });
    const breakdown: Record<string, { done: number; right: number }> = {};
    pool.forEach((q, i) => {
      const m = moduleOfTopic(q.topicId) || "other";
      const b = breakdown[m] ?? (breakdown[m] = { done: 0, right: 0 });
      b.done++;
      if (answers[i] === q.answer) b.right++;
    });
    p = recordExam(p, {
      id: `exam-${Date.now()}`,
      ts: Date.now(),
      label: scope === "all" ? "Whole course" : UNITS.find((u) => u.id === scope)?.title ?? scope,
      total: pool.length,
      correct: sc,
      ms: 0,
      breakdown,
    });
    const settled = settleModuleBonuses(p);
    p = settled.progress;
    xp += settled.xp;

    setScore(sc);
    setGained(xp);
    setRunning(false);
    setSubmitted(true);
    onProgress(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  finishRef.current = finish;

  // ------------------------------------------------------------- setup
  if (!running && !submitted) {
    const best = progress.best;
    return (
      <div className="panel exam-setup">
        <h3>Exam Simulator</h3>
        <p style={{ color: "var(--dim)", fontSize: "0.9rem" }}>
          Timed, closed-book, no solutions until you submit. Answers are recorded into
          your progress afterwards, so weak topics reveal themselves.
          {best ? ` Best so far: ${best.score}/${best.total}.` : " No exam yet."}
        </p>

        <div className="field" style={{ marginTop: "1rem" }}>
          <label>Scope</label>
          <div className="calc-tabs" style={{ margin: 0 }}>
            <button className={`tab ${scope === "all" ? "active" : ""}`} onClick={() => setScope("all")}>
              Whole course
            </button>
            {UNITS.map((u) => (
              <button key={u.id} className={`tab ${scope === u.id ? "active" : ""}`} onClick={() => setScope(u.id)}>
                M{u.num}
              </button>
            ))}
          </div>
        </div>

        <div className="fields" style={{ marginTop: "1rem" }}>
          <div className="field">
            <label>Questions</label>
            <div className="calc-tabs" style={{ margin: 0 }}>
              {[10, 20, 30, 50].map((n) => (
                <button key={n} className={`tab ${count === n ? "active" : ""}`} onClick={() => setCount(n)}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <label>Minutes</label>
            <input
              type="number"
              min={1}
              value={minutes}
              onChange={(e) => setMinutes(Math.max(1, Number(e.target.value) || 1))}
            />
          </div>
        </div>

        {scope !== "all" && <MasteryNote progress={progress} moduleId={scope} />}

        <button className="btn btn-gold" style={{ marginTop: "1.2rem" }} disabled={busy} onClick={start}>
          {busy ? "Dealing…" : "Begin exam →"}
        </button>
      </div>
    );
  }

  // ------------------------------------------------------------ result
  if (submitted) {
    const pct = pool.length ? Math.round((score / pool.length) * 100) : 0;
    return (
      <div>
        <div className="panel review-score">
          <div>
            <div className="eyebrow">Result</div>
            <div className="big-score">
              {score}/{pool.length}
            </div>
          </div>
          <div style={{ color: "var(--dim)" }}>
            <b style={{ color: "var(--gold)" }}>{pct}%</b>
            {gained > 0 && <> · <b style={{ color: "var(--gold)" }}>+{gained} XP</b></>}
            {" · full solutions below."}
            {progress.best && ` Best: ${progress.best.score}/${progress.best.total}.`}
          </div>
        </div>

        <div className="panel" style={{ padding: "0.9rem 1.2rem", marginTop: "0.9rem" }}>
          <div className="eyebrow" style={{ marginBottom: "0.4rem" }}>By module</div>
          <div className="stats">
            {Object.entries(
              pool.reduce<Record<string, { done: number; right: number }>>((acc, q, i) => {
                const m = moduleOfTopic(q.topicId) || "other";
                const b = acc[m] ?? (acc[m] = { done: 0, right: 0 });
                b.done++;
                if (answers[i] === q.answer) b.right++;
                return acc;
              }, {}),
            ).map(([m, b]) => {
              const meta = UNITS.find((x) => x.id === m);
              const ok = b.done ? b.right / b.done >= 0.75 : false;
              return (
                <span key={m} className={`chip ${ok ? "chip-gold" : ""}`}>
                  {meta ? `M${meta.num}` : m} · {b.right}/{b.done}
                </span>
              );
            })}
          </div>
        </div>

        {pool.map((q, i) => {
          const given = answers[i];
          const ok = given === q.answer;
          return (
            <div className="panel qwrap" key={q.id} style={{ marginTop: "0.9rem" }}>
              <div className="qhead">
                <span className="chip">{moduleOfTopic(q.topicId).toUpperCase()}</span>
                <span className={`chip ${ok ? "chip-gold" : ""}`}>
                  {ok ? "✓ correct" : given ? `✗ chose ${given.toUpperCase()}` : "not answered"}
                </span>
              </div>
              <QuestionMeta q={q} />
              <QuestionBody q={q} />
              <OptionList q={q} picked={given} locked />
              <details>
                <summary style={{ cursor: "pointer", color: "var(--gold)", fontSize: "0.85rem", marginTop: "0.7rem" }}>
                  Solution
                </summary>
                <SolutionPanel q={q} picked={given} />
              </details>
            </div>
          );
        })}

        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button className="btn btn-gold" onClick={() => setSubmitted(false)}>
            New exam
          </button>
        </div>
      </div>
    );
  }

  const q = pool[idx];
  if (!q) return null;
  const given = answers[idx];
  const answeredCount = Object.keys(answers).length;

  return (
    <div>
      <div className="panel exam-bar">
        <span className={`timer ${left < 60 ? "low" : ""}`}>⏳ {fmt(left)}</span>
        <span className="chip">
          {answeredCount}/{pool.length} answered · Q{idx + 1}
        </span>
        <button className="btn btn-gold" onClick={finish}>
          Submit exam
        </button>
      </div>

      <div className="panel">
        <div className="palette">
          {pool.map((pq, i) => (
            <button
              key={pq.id}
              className={`pbtn ${answers[i] ? "answered" : ""} ${i === idx ? "current" : ""}`}
              onClick={() => setIdx(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="qwrap">
          <div className="qhead">
            <span className="chip">{moduleOfTopic(q.topicId).toUpperCase()}</span>
          </div>
          <QuestionMeta q={q} />
          <QuestionBody q={q} />
          <OptionList q={q} picked={given} onPick={(l) => setAnswers({ ...answers, [idx]: l })} locked={false} />
          <div className="qnav">
            <button className="btn" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>← Prev</button>
            <button className="btn" disabled={idx >= pool.length - 1} onClick={() => setIdx(idx + 1)}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MasteryNote({ progress, moduleId }: { progress: Progress; moduleId: string }) {
  const meta = UNITS.find((u) => u.id === moduleId);
  if (!meta) return null;
  const agg = moduleAgg(progress, moduleId, moduleQuestionIds(moduleId), TOPIC_OF, topicsOfModule(moduleId));
  const acc = agg.seen ? Math.round((agg.right / agg.seen) * 100) : 0;
  return (
    <div className="panel" style={{ padding: "0.7rem 0.9rem", marginTop: "0.9rem" }}>
      <div className="eyebrow" style={{ marginBottom: "0.35rem" }}>Mastery check · M{meta.num}</div>
      <div className="stats">
        <span className="chip">{agg.seen}/{agg.total} attempted</span>
        <span className="chip">{acc}% accuracy</span>
        <span className={`chip ${agg.mastery ? "chip-gold" : ""}`}>
          {agg.mastery ? "★ mastery met" : "goal: ≥40% per topic · ≥70% overall · ≥75% accuracy"}
        </span>
      </div>
    </div>
  );
}
