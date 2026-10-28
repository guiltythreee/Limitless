"use client";

// Shared sequential player: answer → immediate solution → next. Backs the
// per-topic learning quiz, mixed practice, weak-area training and revision.
// The exam simulator is deliberately separate (timed, no feedback until submit).
//
// XP: the first *correct* answer to a question pays once (see awardAnswer),
// whatever the mode, so nothing here can farm points.
//
// PHASE 4b: questions are canonical (app/courses/types.ts) and come from the
// course registry adapter; progress keys (question ids) and XP rules are
// unchanged.

import { useEffect, useRef, useState } from "react";
import { awardAnswer, Mode, Progress, recordAnswer, toggleBookmark } from "../lib/mt203-progress";
import { OptionList, QuestionBody, QuestionMeta, SolutionPanel } from "./qview";
import { Question } from "../courses/types";

export default function Player({
  questions,
  mode,
  label,
  progress,
  onProgress,
  topicTitles,
  onFinished,
  onExit,
  initialQuestionId,
}: {
  questions: Question[];
  mode: Mode;
  label: string;
  progress: Progress;
  onProgress: (p: Progress) => void;
  topicTitles?: Record<string, string>;
  onFinished?: (p: Progress) => void;
  onExit?: () => void;
  initialQuestionId?: string;
}) {
  const [order, setOrder] = useState<number[]>(() => questions.map((_, i) => i));
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [done, setDone] = useState(false);
  const [gain, setGain] = useState(0);
  const [toast, setToast] = useState<number | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset whenever a different question set is supplied.
  useEffect(() => {
    const nextOrder = questions.map((_, i) => i);
    setOrder(nextOrder);
    const target = initialQuestionId
      ? questions.findIndex((question) => question.id === initialQuestionId)
      : 0;
    setIdx(target >= 0 ? target : 0);
    setPicked({});
    setRevealed({});
    setDone(false);
    setGain(0);
    setToast(null);
  }, [questions, initialQuestionId]);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const theQ = questions[order[idx]];

  const answered = order.filter((i) => revealed[questions[i].id]).length;
  const right = order.filter(
    (i) => revealed[questions[i].id] && picked[questions[i].id] === questions[i].answer,
  ).length;

  const flash = (xp: number) => {
    setToast(xp);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1400);
  };

  const pick = (lab: string) => {
    if (!theQ || revealed[theQ.id]) return;
    const ok = lab === theQ.answer;
    let p = recordAnswer(progress, theQ.id, lab, ok, mode, 0);
    const res = awardAnswer(p, theQ.id, theQ.difficulty, ok);
    p = res.progress;
    onProgress(p);
    if (res.xp > 0) {
      setGain((g) => g + res.xp);
      flash(res.xp);
    }
    setPicked((m) => ({ ...m, [theQ.id]: lab }));
    setRevealed((m) => ({ ...m, [theQ.id]: true }));
  };

  const advance = () => {
    if (idx < order.length - 1) setIdx(idx + 1);
    else {
      setDone(true);
      onFinished?.(progress);
    }
  };

  const retryWrong = () => {
    const wrong = order.filter(
      (i) => revealed[questions[i].id] && picked[questions[i].id] !== questions[i].answer,
    );
    if (wrong.length === 0) return;
    setOrder(wrong);
    setIdx(0);
    setDone(false);
    setPicked((m) => {
      const n = { ...m };
      for (const i of wrong) delete n[questions[i].id];
      return n;
    });
    setRevealed((m) => {
      const n = { ...m };
      for (const i of wrong) delete n[questions[i].id];
      return n;
    });
  };

  const restart = () => {
    setOrder(questions.map((_, i) => i));
    setIdx(0);
    setPicked({});
    setRevealed({});
    setDone(false);
    setGain(0);
  };

  if (questions.length === 0) {
    return (
      <div className="panel prose">
        <p>No questions available for this set yet.</p>
        {onExit && (
          <button className="btn" onClick={onExit}>
            ← Back
          </button>
        )}
      </div>
    );
  }

  // ------------------------------------------------------------- summary
  if (done) {
    const total = order.length;
    const pct = total ? Math.round((right / total) * 100) : 0;
    const wrong = total - right;
    return (
      <div className="panel quiz-summary">
        <div className="eyebrow">Run complete</div>
        <div className="big-score">
          {right}/{total}
        </div>
        <p style={{ color: "var(--dim)" }}>
          {pct}% on this {label.toLowerCase()} set
          {gain > 0 ? ` · +${gain} XP earned` : " · no new XP (already banked)"}
        </p>
        <div className="qnav" style={{ justifyContent: "center" }}>
          {wrong > 0 && (
            <button className="btn btn-gold" onClick={retryWrong}>
              Retry {wrong} missed
            </button>
          )}
          <button className="btn" onClick={restart}>
            Start again
          </button>
          {onExit && (
            <button className="btn" onClick={onExit}>
              Done
            </button>
          )}
        </div>
      </div>
    );
  }

  const chosen = picked[theQ.id];
  const isRevealed = !!revealed[theQ.id];

  return (
    <div className="panel">
      <div className="dots" role="tablist" aria-label="Question navigator">
        {order.map((qi, i) => {
          const qq = questions[qi];
          const st = revealed[qq.id];
          const cls = st ? (picked[qq.id] === qq.answer ? "right" : "wrong") : "";
          return (
            <button
              key={qq.id}
              className={`dot ${cls} ${i === idx ? "cur" : ""}`}
              title={`Question ${i + 1}`}
              onClick={() => setIdx(i)}
            />
          );
        })}
      </div>

      <div className="qwrap">
        <div className="qhead">
          <span className="chip">
            {idx + 1} / {order.length} · {answered} answered · {right} correct
          </span>
          {topicTitles?.[theQ.topicId] && (
            <span className="chip chip-gold">{topicTitles[theQ.topicId]}</span>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.4rem" }}>
          <button
            className="btn"
            aria-pressed={progress.bookmarks.includes(theQ.id)}
            onClick={() => onProgress(toggleBookmark(progress, theQ.id))}
          >
            {progress.bookmarks.includes(theQ.id) ? "★ Bookmarked" : "☆ Bookmark"}
          </button>
        </div>
        <QuestionMeta q={theQ} />
        <QuestionBody q={theQ} />
        <OptionList q={theQ} picked={chosen} onPick={pick} locked={isRevealed} />
        {isRevealed && <SolutionPanel q={theQ} picked={chosen} />}

        <div className="qnav">
          <button className="btn" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>
            ← Prev
          </button>
          <button className="btn btn-gold" onClick={advance}>
            {idx < order.length - 1 ? "Next →" : "Finish"}
          </button>
        </div>
      </div>

      {toast !== null && <div className="xp-toast">+{toast} XP</div>}
    </div>
  );
}
