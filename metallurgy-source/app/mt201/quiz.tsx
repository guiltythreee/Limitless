"use client";

// Chapter quiz player — answer, reveal the worked solution, navigate.
// Progress is recorded per question in localStorage (mm-mt201-v1).
//
// PHASE 3: consumes canonical questions from the course registry adapter and
// renders them through the shared qview wrapper. Progress keys are unchanged
// (`ch01-q12`), so existing saved progress keeps working exactly as before.

import { useEffect, useMemo, useRef, useState } from "react";
import { Progress, qid, recordAnswer, toggleBookmark } from "./progress";
import type { Question } from "../courses/types";
import { OptionList, QuestionBody, QuestionMeta, SolutionPanel } from "./qview";

const fmtElapsed = (ms: number) => {
  const seconds = Math.floor(Math.max(0, ms) / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};

export default function Quiz({
  topicId,
  questions,
  progress,
  onProgress,
  initialQuestionId,
}: {
  topicId: string;
  questions: Question[];
  progress: Progress;
  onProgress: (p: Progress) => void;
  initialQuestionId?: string;
}) {
  const [idx, setIdx] = useState(0);
  const [peeked, setPeeked] = useState<Record<number, boolean>>({});
  const [done, setDone] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const timerStartedAt = useRef<number | null>(null);

  const qs = questions;
  useEffect(() => {
    if (!initialQuestionId) return;
    const target = qs.findIndex((item) => qid(topicId, item.n) === initialQuestionId);
    if (target >= 0) { setIdx(target); setDone(false); }
  }, [initialQuestionId, qs, topicId]);
  const q = qs[Math.min(idx, qs.length - 1)];

  const stateFor = (n: number) => progress.answered[qid(topicId, n)];

  useEffect(() => {
    if (!q || stateFor(q.n)) {
      timerStartedAt.current = null;
      setElapsedMs(0);
      return;
    }
    const started = Date.now();
    timerStartedAt.current = started;
    setElapsedMs(0);
    const timer = window.setInterval(() => setElapsedMs(Date.now() - started), 250);
    return () => window.clearInterval(timer);
    // The selected question and current answer map define one stopwatch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q?.n, progress.answered]);

  const attempted = qs.filter((x) => stateFor(x.n)).length;
  const correct = qs.filter((x) => stateFor(x.n)?.correct).length;

  const pick = (label: string) => {
    const rec = stateFor(q.n);
    if (rec) return; // already recorded — locked
    const started = timerStartedAt.current;
    const ms = Math.max(0, Date.now() - (started ?? Date.now()));
    timerStartedAt.current = null;
    onProgress(recordAnswer(progress, qid(topicId, q.n), label, label === q.answer, ms));
  };

  const dots = useMemo(
    () =>
      qs.map((x) => {
        const rec = stateFor(x.n);
        const cls = ["dot"];
        if (rec) cls.push("done", rec.correct ? "right" : "wrong");
        if (x.n === q.n && !done) cls.push("cur");
        return { n: x.n, cls: cls.join(" ") };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [qs, progress, idx, done]
  );

  if (done) {
    return (
      <div className="panel quiz-summary">
        <div className="eyebrow">Chamber complete</div>
        <div className="big-score">
          {correct}/{attempted || qs.length}
        </div>
        <p style={{ color: "var(--dim)" }}>
          {attempted
            ? `${Math.round((correct / attempted) * 100)}% of your recorded answers in ${topicId.toUpperCase()} are correct.`
            : "No answers were recorded in this chamber."}
        </p>
        <button className="btn" onClick={() => { setDone(false); setIdx(0); }}>
          Return to questions
        </button>
      </div>
    );
  }

  const rec = stateFor(q.n);
  const questionKey = qid(topicId, q.n);
  const latestTimedActivity = rec
    ? [...(progress.activities ?? [])].reverse().find((a) => a.q === questionKey && a.ms > 0)
    : undefined;
  const timeLabel = rec
    ? latestTimedActivity ? fmtElapsed(latestTimedActivity.ms) : "—"
    : fmtElapsed(elapsedMs);
  const revealed = Boolean(rec) || peeked[q.n];

  return (
    <div className="panel">
      <div className="dots">
        {dots.map((d) => (
          <button
            key={d.n}
            type="button"
            className={d.cls}
            title={`Question ${d.n}`}
            onClick={() => setIdx(d.n - 1)}
          />
        ))}
      </div>

      <div className="qwrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
          <span className="chip" aria-label="Time on question">⏱ {timeLabel}</span>
          <button
            className="btn"
            aria-pressed={(progress.bookmarks ?? []).includes(qid(topicId, q.n))}
            onClick={() => onProgress(toggleBookmark(progress, qid(topicId, q.n)))}
          >
            {(progress.bookmarks ?? []).includes(qid(topicId, q.n)) ? "★ Bookmarked" : "☆ Bookmark"}
          </button>
        </div>
        <QuestionMeta q={q} />
        <QuestionBody q={q} />
        <OptionList q={q} picked={rec?.choice} onPick={pick} locked={Boolean(rec)} />

        {rec && (
          <div className={`verdict ${rec.correct ? "right" : "wrong"}`} style={{ marginTop: "0.8rem" }}>
            {rec.correct
              ? "✓ Correct"
              : `✗ Incorrect — the answer is (${q.answer.toUpperCase()})`}
          </div>
        )}

        {revealed && <SolutionPanel q={q} />}

        <div className="qnav">
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button className="btn" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>
              ← Prev
            </button>
            <button
              className="btn"
              disabled={idx >= qs.length - 1}
              onClick={() => setIdx(idx + 1)}
            >
              Next →
            </button>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {!rec && !peeked[q.n] && (
              <button className="btn" onClick={() => setPeeked({ ...peeked, [q.n]: true })}>
                Peek (not recorded)
              </button>
            )}
            <button className="btn" onClick={() => setDone(true)}>
              Chamber score
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
