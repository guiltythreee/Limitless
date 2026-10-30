"use client";

// Exam simulator — timed, no feedback until you submit. Defaults to the
// Ch09 Revision Mix (HARD); can also draw a random mix from all chapters.
//
// PHASE 4a: questions come from the course registry adapter (canonical model)
// and chapter ids/titles from the manifest. Answer recording still writes the
// same progress keys (`ch01-q12`) to mm-mt202-v1, so saved progress is
// untouched.
//
// PHASE 5.1: submitting also appends one `exam` activity per attempted
// question through the shared activity log (blanks are skipped). The updated
// exam best is passed into that same batch so it survives reload in one write.

import { useEffect, useRef, useState } from "react";
import { Progress, qid, recordExamAnswers, type ExamAnswer } from "../lib/progress";
import { MT202_ENTRY } from "../courses/entries/mt202";
import type { Question } from "../courses/types";
import { OptionList, QuestionBody, QuestionMeta, SolutionPanel } from "./qview";
import {
  createLearningPlayerSession,
  navigatePlayer,
  selectPlayerQuestion,
  setPlayerAnswer,
  submitPlayerAnswer,
} from "../../../shared/learning-player/runtime";
import { createMetallurgyPlayerAdapter, type MetallurgyPlayerAnswer } from "../learning-player/adapter";

type PoolQ = Question & { chId: string; chTitle: string };

const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.max(0, s % 60)).padStart(2, "0")}`;

export default function Exam({
  progress,
  onProgress,
  topics,
}: {
  progress: Progress;
  onProgress: (p: Progress) => void;
  topics: { id: string; title: string }[];
}) {
  const [source, setSource] = useState<"ch09" | "all">("ch09");
  const [count, setCount] = useState(50);
  const [minutes, setMinutes] = useState(50);

  const [running, setRunning] = useState(false);
  const [pool, setPool] = useState<PoolQ[]>([]);
  const [session, setSession] = useState(() =>
    createLearningPlayerSession<PoolQ, MetallurgyPlayerAnswer>([])
  );
  const idx = session.state.index;
  const answers: Record<number, string> = {};
  pool.forEach((question, index) => {
    const answer = session.answers[question.id];
    if (answer) answers[index] = answer.optionId;
  });
  const playerAdapter = createMetallurgyPlayerAdapter("mt202");
  const [left, setLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
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
    const ids = source === "ch09" ? ["ch09"] : topics.map((t) => t.id);
    const titleOf = (id: string) => topics.find((t) => t.id === id)?.title ?? id;
    const contents = await Promise.all(ids.map((id) => MT202_ENTRY.adapter.loadTopic(id)));
    const all: PoolQ[] = contents.flatMap((c) =>
      c.questions.map((q) => ({ ...q, chId: c.topicId, chTitle: titleOf(c.topicId) }))
    );
    const shuffled = [...all].sort(() => Math.random() - 0.5);
    const drawn = shuffled.slice(0, Math.min(count, shuffled.length));
    setPool(drawn);
    setSession(createLearningPlayerSession<PoolQ, MetallurgyPlayerAnswer>(drawn));
    setLeft(Math.max(1, minutes) * 60);
    setSubmitted(false);
    setRunning(true);
  };

  const finish = () => {
    let working = session;
    let sc = 0;
    const attempted: ExamAnswer[] = [];
    pool.forEach((qp, index) => {
      working = selectPlayerQuestion(working, index);
      const result = submitPlayerAnswer(working, playerAdapter, {
        submittedAt: Date.now(),
        mode: "exam",
      });
      if (!result.submission) return;
      working = result.session;
      const choice = result.submission.answer.optionId;
      const correct = result.submission.grade.correct;
      if (correct) sc++;
      attempted.push({
        key: qid(qp.chId, qp.n),
        topicId: qp.topicId,
        choice,
        correct,
      });
    });
    setSession(working);
    setScore(sc);
    setRunning(false);
    setSubmitted(true);
    const total = pool.length;
    const prevRatio = progress.examBest ? progress.examBest.score / progress.examBest.total : -1;
    const nextBest =
      total && sc / total >= prevRatio
        ? { score: sc, total, at: Date.now() }
        : progress.examBest;
    const p = recordExamAnswers(progress, attempted, nextBest);
    onProgress(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  finishRef.current = finish;

  const q = pool[idx];
  const answeredCount = Object.keys(answers).length;

  if (!running && !submitted) {
    return (
      <div className="panel exam-setup">
        <h3>Exam Simulator</h3>
        <p style={{ color: "var(--dim)", fontSize: "0.9rem" }}>
          Timed, closed-book, no solutions until you submit. Your answers are recorded into
          chapter progress afterwards, so weak chapters reveal themselves.
          {progress.examBest
            ? ` Best result so far: ${progress.examBest.score}/${progress.examBest.total}.`
            : " No exam yet — the archive awaits your first attempt."}
        </p>

        <div className="fields" style={{ marginTop: "1rem" }}>
          <div className="field">
            <label>Question source</label>
            <div className="calc-tabs" style={{ margin: 0 }}>
              <button className={`tab ${source === "ch09" ? "active" : ""}`} onClick={() => { setSource("ch09"); setCount(50); }}>
                Ch09 mix
              </button>
              <button className={`tab ${source === "all" ? "active" : ""}`} onClick={() => { setSource("all"); setCount(50); }}>
                All chapters
              </button>
            </div>
          </div>
          <div className="field">
            <label>Questions</label>
            <div className="calc-tabs" style={{ margin: 0 }}>
              {[10, 25, 50].map((n) => (
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

        <button className="btn btn-gold" style={{ marginTop: "1.2rem" }} onClick={start}>
          Begin exam →
        </button>
      </div>
    );
  }

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
            <b style={{ color: "var(--gold)" }}>{pct}%</b> · reviewed below with full solutions.
            {progress.examBest && ` Archive best: ${progress.examBest.score}/${progress.examBest.total}.`}
          </div>
        </div>

        {pool.map((qp, i) => {
          const given = answers[i];
          const ok = given === qp.answer;
          return (
            <div className="panel qwrap" key={`${qp.chId}-${qp.n}`} style={{ marginTop: "0.9rem" }}>
              <div className="qhead">
                <span className="chip">{qp.chId.toUpperCase()}</span>
                <span className={`chip ${ok ? "chip-gold" : ""}`}>{ok ? "✓ correct" : given ? `✗ chose ${given.toUpperCase()}` : "not answered"}</span>
              </div>
              <QuestionMeta q={qp} />
              <QuestionBody q={qp} />
              <OptionList q={qp} picked={given} locked />
              <details>
                <summary style={{ cursor: "pointer", color: "var(--gold)", fontSize: "0.85rem", marginTop: "0.7rem" }}>
                  Solution
                </summary>
                <SolutionPanel q={qp} />
              </details>
            </div>
          );
        })}
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button className="btn btn-gold" onClick={() => setSubmitted(false)}>New exam</button>
        </div>
      </div>
    );
  }

  if (!q) return null;
  const given = answers[idx];

  return (
    <div>
      <div className="panel exam-bar">
        <span className={`timer ${left < 60 ? "low" : ""}`}>
          ⏳ {fmt(left)}
        </span>
        <span className="chip">
          {answeredCount}/{pool.length} answered · question {idx + 1}
        </span>
        <button className="btn btn-gold" onClick={finish}>Submit exam</button>
      </div>

      <div className="panel">
        <div className="palette">
          {pool.map((qp, i) => (
            <button
              key={`${qp.chId}-${qp.n}`}
              className={`pbtn ${answers[i] ? "answered" : ""} ${i === idx ? "current" : ""}`}
              onClick={() => setSession((current) => selectPlayerQuestion(current, i))}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="qwrap">
          <div className="qhead">
            <span className="chip">{q.chId.toUpperCase()} · {q.chTitle}</span>
          </div>
          <QuestionMeta q={q} />
          <QuestionBody q={q} />
          <OptionList
            q={q}
            picked={given}
            onPick={(label) => setSession((current) => setPlayerAnswer(current, playerAdapter, {
              kind: "single-choice",
              optionId: label,
            }))}
            locked={false}
          />
          <div className="qnav">
            <button className="btn" disabled={idx === 0} onClick={() => setSession((current) => navigatePlayer(current, "previous"))}>← Prev</button>
            <button className="btn" disabled={idx >= pool.length - 1} onClick={() => setSession((current) => navigatePlayer(current, "next"))}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
