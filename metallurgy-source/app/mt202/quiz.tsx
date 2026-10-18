"use client";

// Chapter quiz player — answer, reveal concise + detailed solution, navigate.
// Progress is recorded per question in localStorage (mm-mt202-v1).

import { useMemo, useState } from "react";
import { Progress, qid, recordAnswer } from "../lib/progress";
import { Chapter } from "./types";
import { OptionList, QuestionBody, QuestionMeta, SolutionPanel } from "./qview";

export default function Quiz({
  ch,
  progress,
  onProgress,
}: {
  ch: Chapter;
  progress: Progress;
  onProgress: (p: Progress) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [peeked, setPeeked] = useState<Record<number, boolean>>({});
  const [done, setDone] = useState(false);

  const qs = ch.questions;
  const q = qs[Math.min(idx, qs.length - 1)];

  const stateFor = (n: number) => progress.answered[qid(ch.id, n)];

  const attempted = qs.filter((x) => stateFor(x.n)).length;
  const correct = qs.filter((x) => stateFor(x.n)?.correct).length;

  const pick = (label: string) => {
    const rec = stateFor(q.n);
    if (rec) return; // already recorded — locked
    onProgress(recordAnswer(progress, qid(ch.id, q.n), label, label === q.answer));
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
        <div className="eyebrow">Chapter complete</div>
        <div className="big-score">
          {correct}/{attempted || qs.length}
        </div>
        <p style={{ color: "var(--dim)" }}>
          {attempted
            ? `${Math.round((correct / attempted) * 100)}% of your recorded answers in ${ch.id.toUpperCase()} are correct.`
            : "No answers were recorded in this chapter."}
        </p>
        <button className="btn" onClick={() => { setDone(false); setIdx(0); }}>
          Return to questions
        </button>
      </div>
    );
  }

  const rec = stateFor(q.n);
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
              Chapter score
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
