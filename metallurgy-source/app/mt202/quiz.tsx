"use client";

// Chapter quiz player — answer, reveal concise + detailed solution, navigate.
// Progress is recorded per question in localStorage (mm-mt202-v1).
//
// PHASE 4a: consumes canonical questions from the course registry adapter and
// renders them through the shared qview wrapper. Progress keys are unchanged
// (`ch01-q12`), so existing saved progress keeps working exactly as before.

import { createElement, useEffect, useMemo, useRef, useState } from "react";
import { Progress, qid, recordAnswer, toggleBookmark } from "../lib/progress";
import type { Question } from "../courses/types";
import { OptionList, QuestionBody, QuestionMeta, SolutionPanel } from "./qview";
import {
  createLearningPlayerSession,
  navigatePlayer,
  selectPlayerQuestion,
  setPlayerAnswer,
  submitPlayerAnswer,
  tickPlayer,
} from "../../../shared/learning-player/runtime";
import { createMetallurgyPlayerAdapter, type MetallurgyPlayerAnswer } from "../learning-player/adapter";
import { createLearningPlayerShell } from "../../../shared/learning-player/PlayerShell";
import { handleNextQuestionKey, handleQuestionShortcut } from "../../../shared/learning-player/keyboard";

const LearningPlayerShell = (props: Parameters<typeof createLearningPlayerShell>[1]) =>
  createLearningPlayerShell(createElement, props);

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
  const adapter = useMemo(() => createMetallurgyPlayerAdapter("mt202"), []);
  const queueKey = questions.map((question) => question.id).join("|");
  const [session, setSession] = useState(() =>
    createLearningPlayerSession<Question, MetallurgyPlayerAnswer>(questions)
  );
  const idx = session.state.index;
  const [peeked, setPeeked] = useState<Record<number, boolean>>({});
  const [done, setDone] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const timerStartedAt = useRef<number | null>(null);
  const elapsedBase = useRef(0);

  const elapsedNow = () =>
    elapsedBase.current + (timerStartedAt.current === null ? 0 : Date.now() - timerStartedAt.current);

  const qs = questions;
  useEffect(() => {
    setSession(createLearningPlayerSession<Question, MetallurgyPlayerAnswer>(questions));
    setPeeked({});
    setDone(false);
  }, [topicId, queueKey]);
  useEffect(() => {
    if (!initialQuestionId) return;
    const target = qs.findIndex((item) => qid(topicId, item.n) === initialQuestionId);
    if (target >= 0) {
      setSession((current) => selectPlayerQuestion(current, target));
      setDone(false);
    }
  }, [initialQuestionId, queueKey, topicId]);
  const q = qs[idx]!;

  // Right Arrow advances to the next question (except while editing text).
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => handleNextQuestionKey(event, () => {
      if (!done) {
        setSession((current) =>
          current.state.index < current.questions.length - 1
            ? navigatePlayer(current, "next")
            : current
        );
      }
    }, () => {
      if (!done) setSession((current) =>
        current.state.index > 0 ? navigatePlayer(current, "previous") : current
      );
    });
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [done]);


  const stateFor = (n: number) => progress.answered[qid(topicId, n)];

  useEffect(() => {
    if (!q || stateFor(q.n)) {
      timerStartedAt.current = null;
      elapsedBase.current = 0;
      setElapsedMs(0);
      return;
    }

    elapsedBase.current = 0;
    timerStartedAt.current = document.hidden ? null : Date.now();
    setElapsedMs(0);

    const onVisibilityChange = () => {
      if (document.hidden) {
        if (timerStartedAt.current !== null) {
          elapsedBase.current += Date.now() - timerStartedAt.current;
          timerStartedAt.current = null;
        }
      } else if (timerStartedAt.current === null) {
        timerStartedAt.current = Date.now();
      }
      setElapsedMs(Math.round(elapsedNow()));
    };

    const timer = window.setInterval(() => setElapsedMs(Math.round(elapsedNow())), 250);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (timerStartedAt.current !== null) {
        elapsedBase.current += Date.now() - timerStartedAt.current;
        timerStartedAt.current = null;
      }
    };
    // The selected question and current answer map define one stopwatch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q?.n, progress.answered]);

  const attempted = qs.filter((x) => stateFor(x.n)).length;
  const correct = qs.filter((x) => stateFor(x.n)?.correct).length;

  const selectedChoice = q ? session.answers[q.id]?.optionId ?? "" : "";
  const selectOption = (label: string) => {
    if (!q || stateFor(q.n)) return;
    setSession((current) => setPlayerAnswer(current, adapter, {
      kind: "single-choice",
      optionId: label,
    }));
  };
  const submitAnswer = () => {
    if (!q || stateFor(q.n) || !selectedChoice) return;
    const ms = Math.max(0, Math.round(elapsedNow()));
    const timed = tickPlayer(session, ms);
    const result = submitPlayerAnswer(timed, adapter, {
      submittedAt: Date.now(),
      mode: "practice",
    });
    if (!result.submission) return;
    timerStartedAt.current = null;
    setSession(result.session);
    onProgress(recordAnswer(
      progress,
      qid(topicId, q.n),
      selectedChoice,
      result.submission.grade.correct,
      ms,
      q.difficulty,
    ));
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => handleQuestionShortcut(event, {
      optionCount: q?.options.length ?? 0,
      hasSelection: Boolean(selectedChoice) && !stateFor(q.n),
      onSelectOption: (index) => {
        const option = q.options[index];
        if (option) selectOption(option.label);
      },
      onSubmit: submitAnswer,
    });
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [q?.id, selectedChoice, progress.answered, session]);

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
            ? `${Math.round((correct / attempted) * 100)}% of your recorded answers in ${topicId.toUpperCase()} are correct.`
            : "No answers were recorded in this chapter."}
        </p>
        <button className="btn" onClick={() => { setDone(false); setSession((current) => selectPlayerQuestion(current, 0)); }}>
          Return to questions
        </button>
      </div>
    );
  }

  if (!q) return null;
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
      <LearningPlayerShell className="learning-player-frame" paletteClassName="learning-player-palette" contentClassName="learning-player-content" palette={dots.map((d) => (
          <button
            key={d.n}
            type="button"
            className={d.cls}
            title={`Question ${d.n}`}
            aria-label={`Question ${d.n}`}
            aria-current={d.n === q.n ? "step" : undefined}
            onClick={() => setSession((current) => selectPlayerQuestion(current, d.n - 1))}
          />
        ))}>

        <div className="learning-player-meta learning-player-meta--compact">
          <div className="learning-player-meta__group">
            <span className="chip" aria-label="Time on question">⏱ {timeLabel}</span>
            {!rec && (
              <button
                className="btn"
                onClick={() => {
                  elapsedBase.current = 0;
                  timerStartedAt.current = document.hidden ? null : Date.now();
                  setElapsedMs(0);
                }}
              >
                Reset timer
              </button>
            )}
          </div>
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
        <OptionList q={q} picked={rec?.choice ?? selectedChoice} onPick={selectOption} locked={Boolean(rec)} />
        {!rec && <button className="btn btn-gold" disabled={!selectedChoice} onClick={submitAnswer}>Submit Answer ↵</button>}

        {rec && (
          <div className={`verdict learning-player-feedback ${rec.correct ? "right" : "wrong"}`} style={{ marginTop: "0.8rem" }}>
            {rec.correct
              ? "✓ Correct"
              : `✗ Incorrect — the answer is (${q.answer.toUpperCase()})`}
          </div>
        )}

        {revealed && <SolutionPanel q={q} />}

        <div className="learning-player-actions">
          <div>
            <button className="btn" disabled={idx === 0} onClick={() => setSession((current) => navigatePlayer(current, "previous"))}>
              ← Prev
            </button>
            <button
              className="btn"
              disabled={idx >= qs.length - 1}
              onClick={() => setSession((current) => navigatePlayer(current, "next"))}
            >
              Next →
            </button>
          </div>
          <div>
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
      </LearningPlayerShell>
  );
}
