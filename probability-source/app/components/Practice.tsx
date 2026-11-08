"use client";

import { createElement, useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { lessons, pad2, type Difficulty } from "../content";
import { Explanation, Rich } from "../lib/rich";
import { allQuestions, correctSet, grade, isMulti, questionByKey, type Q, type Status } from "../lib/questions";
import { clearDraft, latestByQuestion, recordAttempt, recordTest, saveDraft, toggleBookmark, useStore, type Attempt, type TestRecord, classifyMistake, markMistakeReviewed } from "../lib/store";
import { MISTAKE_CATEGORIES, buildRevisionList, mistakeCategoryLabel, type MistakeCategory } from "../../../shared/studies/mistakes";
import { fmtTime, summarize } from "../lib/stats";
import { StatsPanel } from "./Dashboard";
import {
  clearPlayerAnswer,
  createLearningPlayerSession,
  selectPlayerQuestion,
  setPlayerAnswer,
  submitPlayerAnswer,
  tickPlayer,
  type LearningPlayerSession,
} from "../../../shared/learning-player/runtime";
import { probabilityPlayerAdapter } from "../learning-player/adapter";
import type { ProbabilityPlayerAnswer } from "../learning-player/adapter-core";
import { createLearningPlayerShell } from "../../../shared/learning-player/PlayerShell";
import { createStudyUtilityNav } from "../../../shared/studies/StudyUtilityNav";

const LearningPlayerShell = (props: Parameters<typeof createLearningPlayerShell>[1]) =>
  createLearningPlayerShell(createElement, props);

type ScopeKind = "topic" | "rank" | "all";
type View = "overview" | "all" | "topics" | "saved" | "mistakes" | "history" | "question";
type Sort = "order" | "last-first" | "first-first";
const MARK: Record<Status, string> = { correct: "✓", incorrect: "×", partial: "◐", unattempted: "" };
const MARKCLS: Record<Status, string> = { correct: "text-emerald-500", incorrect: "text-red-500", partial: "text-amber-500", unattempted: "" };
const lessonTitle = (id: string) => lessons.find((l) => l.id === id)?.title ?? id;
const DIFF_LABEL: Record<Difficulty, string> = { easy: "Easy", medium: "Medium", hard: "Hard" };

const NAV: { id: View; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "▦" },
  { id: "all", label: "All Questions", icon: "↺" },
  { id: "topics", label: "Topic-wise", icon: "☰" },
  { id: "saved", label: "Bookmarked Qs", icon: "★" },
  { id: "mistakes", label: "My Mistakes", icon: "⚠" },
  { id: "history", label: "Test History", icon: "◷" },
];

export default function Practice({ lessonId, onSelectLesson, initialView = "overview", initialDifficulty = "all", initialScope, standalone = false }: { lessonId: string; onSelectLesson: (id: string, keepSection?: boolean) => void; initialView?: Exclude<View, "question">; initialDifficulty?: Difficulty | "all"; initialScope?: ScopeKind; standalone?: boolean }) {
  const store = useStore();
  const lesson = lessons.find((l) => l.id === lessonId)!;
  const [scopeKind, setScopeKind] = useState<ScopeKind>(initialScope ?? (initialView === "overview" ? "topic" : "all"));
  const [view, setView] = useState<View>(initialView);
  const [back, setBack] = useState<View>("all");
  const [session, setSession] = useState<LearningPlayerSession<Q, ProbabilityPlayerAnswer>>(
    () => createLearningPlayerSession<Q, ProbabilityPlayerAnswer>([]),
  );
  const queue = session.questions.map((question) => question.key);
  const qi = session.state.index;

  const latest = useMemo(() => latestByQuestion(store.attempts), [store.attempts]);
  const statusOf = (k: string): Status => latest[k]?.status ?? "unattempted";
  const pool = useMemo(
    () => allQuestions.filter((q) => (scopeKind === "topic" ? q.lessonId === lessonId : scopeKind === "rank" ? q.rank === lesson.rank : true)),
    [scopeKind, lessonId, lesson.rank],
  );
  const scopeLabel = scopeKind === "topic" ? lesson.title : scopeKind === "rank" ? `Sequence ${pad2(lesson.rank)}` : "All of probability";

  function open(keys: string[], index: number, from: View) {
    const questions = keys.map((key) => questionByKey[key]).filter((question): question is Q => Boolean(question));
    const nextSession = createLearningPlayerSession<Q, ProbabilityPlayerAnswer>(questions);
    setSession(selectPlayerQuestion(nextSession, index));
    setBack(from);
    setView("question");
  }
  function practiceAll() {
    const keys = pool.map((q) => q.key);
    const firstNew = keys.findIndex((k) => statusOf(k) === "unattempted");
    open(keys, Math.max(0, firstNew), "overview");
  }

  const nav = view === "question" ? back : view;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <select value={scopeKind} onChange={(e) => { setScopeKind(e.target.value as ScopeKind); setView("overview"); }} className="pill" aria-label="What to practise">
          <option value="topic">This topic: {lesson.title}</option>
          <option value="rank">All topics of Sequence {pad2(lesson.rank)} (all at once)</option>
          <option value="all">Every question in the archive (all at once)</option>
        </select>
        <span className="text-xs text-faint">{pool.length} questions · {pool.filter((q) => statusOf(q.key) !== "unattempted").length} attempted</span>
      </div>

      {view !== "question" && (
        <div className="subnav mt-4 border-b border-gold/10 pb-3">
          {createStudyUtilityNav(createElement, {
            className: "probability-utility-nav",
            items: NAV.map((item) => ({
              id: item.id,
              label: item.label,
              count: item.id === "saved" ? store.bookmarks.length : undefined,
              active: nav === item.id,
            })),
            onSelect: (id) => {
              const nextView = id as View;
              if (standalone && ["all", "topics", "saved", "mistakes", "history"].includes(nextView)) {
                setScopeKind("all");
              }
              setView(nextView);
            },
          })}
        </div>
      )}

      <div className="mt-5">
        {view === "overview" && (
          <div className="space-y-5">
            <div className="grid gap-4">
              <button onClick={practiceAll} disabled={pool.length === 0} className="card flex items-center justify-between text-left transition hover:border-gold/50">
                <span><span className="serif text-xl">Practice {scopeKind === "topic" ? "Topic" : "All"} →</span><span className="mt-1 block text-xs text-dim">One question at a time, jumping to your first unattempted one</span></span><span className="text-2xl text-emerald-500">☰</span>
              </button>

            </div>
            <StatsPanel scope={scopeKind === "topic" ? { kind: "lesson", id: lessonId } : scopeKind === "rank" ? { kind: "rank", rank: lesson.rank } : { kind: "all" }} poolSize={pool.length} />
          </div>
        )}

        {view === "all" && <QuestionList pool={pool} title={scopeLabel} initialDifficulty={initialDifficulty} onOpen={(k, i) => open(k, i, "all")} onAnalysis={() => setView("overview")} />}
        {view === "saved" && <QuestionList pool={pool.filter((q) => store.bookmarks.includes(q.key))} title="Bookmarked questions" empty="Nothing saved yet. Tap ☆ on a question to keep it here." onOpen={(k, i) => open(k, i, "saved")} onAnalysis={() => setView("overview")} />}
        {view === "mistakes" && <><MistakeRevisionPanel attempts={store.attempts} /><QuestionList pool={pool.filter((q) => ["incorrect", "partial"].includes(statusOf(q.key)))} title="My mistakes (latest attempt not fully correct)" empty="No mistakes right now. Keep going." onOpen={(k, i) => open(k, i, "mistakes")} onAnalysis={() => setView("overview")} /></>}

        {view === "history" && (
          <section className="study-utility-panel">
            <header className="study-utility-panel__header"><div className="study-utility-panel__heading"><h2 className="study-utility-panel__title">Test History</h2><p className="study-utility-panel__description">Previous assessments saved in this Probability workspace.</p></div><span className="study-utility-panel__count">{store.tests.length} tests</span></header>
            <div className="study-utility-panel__content">
              {store.tests.length === 0 ? <p className="py-8 text-center text-sm text-dim">No completed tests yet. Your finished assessments will appear here.</p> : [...store.tests].sort((a, b) => b.ts - a.ts).map((test) => (
                <div key={test.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-gold/10 py-4">
                  <div><strong className="block text-sm text-parchment">{test.label}</strong><span className="mt-1 block text-[11px] text-dim">{new Date(test.ts).toLocaleString()} · {test.answered}/{test.total} answered</span></div>
                  <div className="text-right"><strong className="serif text-xl text-gold">{test.score}/{test.total}</strong><span className="mt-1 block text-[10px] text-dim">{test.correct} fully correct</span></div>
                </div>
              ))}
            </div>
          </section>
        )}

        {view === "topics" && (
          <div className="grid gap-3 sm:grid-cols-2">
            {lessons.filter((l) => l.quiz.length).map((l) => {
              const qs = allQuestions.filter((q) => q.lessonId === l.id);
              const done = qs.filter((q) => statusOf(q.key) !== "unattempted");
              const s = summarize(done.map((q) => latest[q.key]));
              return (
                <button key={l.id} onClick={() => { onSelectLesson(l.id, true); setScopeKind("topic"); setView("all"); }} className="card text-left transition hover:border-gold/50">
                  <div className="flex items-start justify-between gap-3"><span className="serif text-lg leading-snug">{l.title}</span><span className="text-xs text-dim">{done.length}/{qs.length}</span></div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded bg-track"><div className="h-full bg-gold" style={{ width: `${(done.length / qs.length) * 100}%` }} /></div>
                  <div className="mt-2 text-[11px] text-faint">{done.length ? `Accuracy ${Math.round(s.accuracy * 100)}%` : "Not started"}</div>
                </button>
              );
            })}
          </div>
        )}

        {view === "question" && queue.length > 0 && (
          <QuestionView
            key={queue[qi]}
            q={session.questions[qi]}
            queue={queue}
            index={qi}
            session={session}
            onSessionChange={setSession}
            onGo={(i) => setSession((current) => selectPlayerQuestion(current, i))}
            onBack={() => setView(back)}
            showTopic={scopeKind !== "topic"}
          />
        )}
      </div>
    </div>
  );
}


function MistakeRevisionPanel({ attempts }: { attempts: Attempt[] }) {
  const queue = buildRevisionList(attempts.map((attempt) => ({
    questionId: attempt.q,
    correct: attempt.status === "correct",
    category: attempt.mistakeCategory,
    occurredAt: attempt.ts,
    reviewedAt: attempt.reviewedAt,
  })));
  const grouped = MISTAKE_CATEGORIES.map((category) => ({
    ...category,
    count: attempts.filter((attempt) => attempt.status !== "correct" && attempt.mistakeCategory === category.id).length,
  }));
  const unclassified = attempts.filter((attempt) => attempt.status !== "correct" && !attempt.mistakeCategory).length;
  return (
    <section className="study-utility-panel mb-5">
      <header className="study-utility-panel__header"><div className="study-utility-panel__heading"><h2 className="study-utility-panel__title">Mistake analysis & revision queue</h2><p className="study-utility-panel__description">Recurring classified errors are ranked first. Classify incorrect answers in the question review.</p></div><span className="study-utility-panel__count">{queue.length} revision items</span></header>
      <div className="study-utility-panel__content">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {grouped.map((item) => <div key={item.id} className="study-utility-metric"><span className="study-utility-metric__label">{item.label}</span><strong className="study-utility-metric__value">{item.count}</strong></div>)}
        </div>
        {unclassified > 0 && <p className="mt-3 text-xs text-dim">{unclassified} incorrect attempts still need classification.</p>}
        {queue.length === 0 ? <p className="py-5 text-center text-sm text-dim">No classified mistakes yet. Classify an incorrect answer to start building your revision list.</p> : (
          <div className="mt-4 space-y-2">
            {queue.slice(0, 20).map((item) => {
              const matching = attempts.filter((attempt) => attempt.q === item.questionId && attempt.mistakeCategory === item.category && attempt.status !== "correct");
              return <div key={item.questionId + item.category} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gold/15 p-3">
                <div><strong className="text-sm text-parchment">{item.questionId}</strong><div className="mt-1 text-xs text-dim">{mistakeCategoryLabel(item.category)} · {item.occurrences} occurrence{item.occurrences === 1 ? "" : "s"} · {item.reviewed ? "Reviewed" : "Needs revision"}</div></div>
                <button type="button" className="btn" disabled={item.reviewed} onClick={() => markMistakeReviewed(matching.map((attempt) => attempt.id))}>{item.reviewed ? "Reviewed ✓" : "Mark reviewed"}</button>
              </div>;
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// ---------- list with filters ----------
function QuestionList({ pool, title, empty, onOpen, onAnalysis, initialDifficulty = "all" }: { pool: Q[]; title: string; empty?: string; onOpen: (keys: string[], i: number) => void; onAnalysis: () => void; initialDifficulty?: Difficulty | "all" }) {
  const store = useStore();
  const latest = useMemo(() => latestByQuestion(store.attempts), [store.attempts]);
  const [hide, setHide] = useState(false);
  const [topic, setTopic] = useState("all");
  const [status, setStatus] = useState<Status | "all">("all");
  const [diff, setDiff] = useState<Difficulty | "all">(initialDifficulty);
  const [sort, setSort] = useState<Sort>("order");

  const topics = [...new Set(pool.map((q) => q.lessonId))];
  const filtered = pool.filter((q) => {
    const st = (latest[q.key]?.status ?? "unattempted") as Status;
    return (!hide || st === "unattempted") && (topic === "all" || q.lessonId === topic) && (status === "all" || st === status) && (diff === "all" || q.difficulty === diff);
  });
  const list = sort === "order" ? filtered : [...filtered].sort((a, b) => {
    const ta = latest[a.key]?.ts, tb = latest[b.key]?.ts;
    if (ta === undefined && tb === undefined) return 0;
    if (ta === undefined) return 1;
    if (tb === undefined) return -1;
    return sort === "last-first" ? tb - ta : ta - tb;
  });
  const isFiltered = hide || topic !== "all" || status !== "all" || diff !== "all";

  return (
    <section className="study-utility-panel">
      <header className="study-utility-panel__header">
        <div className="study-utility-panel__heading">
          <h2 className="study-utility-panel__title">{title}</h2>
          <p className="study-utility-panel__description">{title === "Bookmarked questions" ? "Your saved questions in this learning set. Open any question to continue studying." : title.startsWith("My mistakes") ? "Review questions whose latest recorded answer was incorrect or partially correct." : "Filter, sort and reopen questions from this learning set."}</p>
        </div>
        <span className="study-utility-panel__count">{list.length} questions</span>
      </header>
      <div className="study-utility-panel__content">
      <div className="study-utility-toolbar">
        <button onClick={() => setHide(!hide)} className="pill study-utility-control flex items-center gap-2" aria-pressed={hide}>Hide Attempted <span className={`switch ${hide ? "switch-on" : ""}`} /></button>
        {topics.length > 1 && (
          <select value={topic} onChange={(e) => setTopic(e.target.value)} className="pill study-utility-control max-w-[200px]" aria-label="Topic"><option value="all">All topics</option>{topics.map((t) => <option key={t} value={t}>{lessonTitle(t)}</option>)}</select>
        )}
        <select value={status} onChange={(e) => setStatus(e.target.value as Status | "all")} className="pill study-utility-control" aria-label="Attempt status">
          <option value="all">Attempt Status</option><option value="correct">Correct</option><option value="incorrect">Incorrect</option><option value="partial">Partially correct</option><option value="unattempted">Unattempted</option>
        </select>
        <select value={diff} onChange={(e) => setDiff(e.target.value as Difficulty | "all")} className="pill study-utility-control" aria-label="Difficulty">
          <option value="all">Difficulty</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
        </select>
      </div>

      <div className="study-utility-toolbar mt-4 justify-between text-sm">
        <span className="text-body">{title} · {isFiltered ? "Showing filtered Qs" : "Showing all Qs"} ({list.length}/{pool.length})</span>
        <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="pill study-utility-control" aria-label="Sort">
          <option value="order">Book order</option>
          <option value="last-first">Last attempted → first attempted</option>
          <option value="first-first">First attempted → last attempted</option>
        </select>
      </div>

      <div className="study-utility-list mt-3">
        {list.length === 0 ? (
          <div className="study-utility-empty">{pool.length === 0 ? empty ?? "No questions here yet." : "No question matches these filters."}</div>
        ) : list.map((q, i) => {
          const st: Status = latest[q.key]?.status ?? "unattempted";
          const n = store.attempts.filter((a) => a.q === q.key).length;
          return (
            <button key={q.key} className="rowq study-utility-row study-utility-row--question" onClick={() => onOpen(list.map((x) => x.key), i)}>
              <span className="rn"><span>{i + 1}</span><span className={`mt-1 text-base leading-none ${MARKCLS[st]}`} title={st}>{MARK[st] || " "}</span></span>
              <span className="min-w-0">
                <span className="clamp2 block text-[15px] leading-6 text-body"><Rich text={q.item.question} /></span>
                <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-faint">
                  <span>{lessonTitle(q.lessonId)}</span>
                  <span className={`dbadge dbadge-${q.difficulty}`}>{DIFF_LABEL[q.difficulty]}</span>
                  {n > 0 && <span>{n} attempt{n > 1 ? "s" : ""}</span>}
                  {store.bookmarks.includes(q.key) && <span className="text-gold">★ saved</span>}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="floating-analysis"><button onClick={onAnalysis}>▮▯ Analysis</button></div>
      </div>
    </section>
  );
}

// ---------- option cards (shared by practice and tests) ----------
export function Options({ item, picked, onPick, reveal, disabled, numericText, onNumericChange }: {
  item: Q["item"];
  picked: number[];
  onPick: (i: number) => void;
  reveal: boolean;
  disabled: boolean;
  numericText?: string;
  onNumericChange?: (value: string) => void;
}) {
  if (item.numericAnswer) {
    return (
      <div className="learning-player-options">
        <label htmlFor="probability-numeric-answer" className="mb-2 block text-sm text-dim">
          Numerical answer{item.numericAnswer.unit ? ` (${item.numericAnswer.unit})` : ""}
        </label>
        <input
          id="probability-numeric-answer"
          type="number"
          inputMode="decimal"
          step="any"
          value={numericText ?? ""}
          onChange={(event) => onNumericChange?.(event.target.value)}
          disabled={disabled}
          className="pill w-full max-w-sm text-base"
          aria-label="Enter a numerical answer"
        />
        {reveal && (
          <p className="mt-3 text-sm text-ok">
            Expected answer: {item.numericAnswer.value}{item.numericAnswer.unit ? ` ${item.numericAnswer.unit}` : ""}
          </p>
        )}
      </div>
    );
  }
  const right = correctSet(item);
  return (
    <div className="learning-player-options">
      {item.options.map((option, i) => {
        const sel = picked.includes(i);
        const ok = right.includes(i);
        let style = "";
        if (reveal && ok) style = "border-emerald-600/70! bg-emerald-500/15";
        else if (reveal && sel) style = "border-red-600/70! bg-red-500/10";
        else if (sel) style = "border-gold/70! bg-gold/10";
        return (
          <button key={i} onClick={() => onPick(i)} disabled={disabled} className={`optcard learning-player-option text-body disabled:cursor-default ${style}`}>
            <span className="optletter">{String.fromCharCode(65 + i)}</span>
            <span className="learning-player-option__text min-w-0 flex-1"><Rich text={option} /></span>
            {reveal && ok && <span className="text-emerald-500">✓</span>}
            {reveal && sel && !ok && <span className="text-red-500">×</span>}
          </button>
        );
      })}
    </div>
  );
}

// ---------- one question, one stopwatch ----------
function QuestionView({ q, queue, index, session, onSessionChange, onGo, onBack, showTopic }: {
  q: Q;
  queue: string[];
  index: number;
  session: LearningPlayerSession<Q, ProbabilityPlayerAnswer>;
  onSessionChange: Dispatch<SetStateAction<LearningPlayerSession<Q, ProbabilityPlayerAnswer>>>;
  onGo: (i: number) => void;
  onBack: () => void;
  showTopic: boolean;
}) {
  const store = useStore();
  const mine = store.attempts.filter((a) => a.q === q.key);
  const last: Attempt | undefined = mine[mine.length - 1];
  const draft = store.drafts[q.key];
  const multi = isMulti(q.item);
  const numeric = Boolean(q.item.numericAnswer);
  const latest = useMemo(() => latestByQuestion(store.attempts), [store.attempts]);

  const [phase, setPhase] = useState<"answering" | "review">(last && !draft ? "review" : "answering");
  const [picked, setPicked] = useState<number[]>(draft?.picked ?? []);
  const [numericText, setNumericText] = useState(draft?.picked[0] !== undefined ? String(draft.picked[0]) : "");
  const [, tick] = useState(0);

  // Stopwatch: acc = time banked so far, t0 = when it last started (null while paused).
  const acc = useRef(draft?.ms ?? 0);
  const t0 = useRef<number | null>(null);
  const phaseRef = useRef(phase);
  const pickedRef = useRef(picked);
  phaseRef.current = phase;
  pickedRef.current = picked;
  const elapsed = () => acc.current + (t0.current !== null ? Date.now() - t0.current : 0);
  const start = () => { if (t0.current === null) t0.current = Date.now(); };
  const pause = () => { if (t0.current !== null) { acc.current += Date.now() - t0.current; t0.current = null; } };
  const flush = () => { if (phaseRef.current === "answering" && (acc.current > 0 || t0.current !== null)) saveDraft(q.key, { ms: Math.round(elapsed()), picked: pickedRef.current }); };

  useEffect(() => {
    const onVis = () => { if (document.hidden) { pause(); flush(); } else if (phaseRef.current === "answering") start(); };
    const onHide = () => flush();
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", onHide);
    const iv = setInterval(() => { tick((n) => n + 1); if (phaseRef.current === "answering" && !document.hidden) flush(); }, 1000);
    if (phaseRef.current === "answering" && !document.hidden) start();
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", onHide);
      clearInterval(iv);
      pause(); // leaving the question pauses the clock and keeps the time so far
      flush();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function choose(i: number) {
    if (phase !== "answering") return;
    const next = multi ? (picked.includes(i) ? picked.filter((p) => p !== i) : [...picked, i]) : [i];
    setPicked(next);
    pickedRef.current = next;
    if (next.length > 0) {
      const answer: ProbabilityPlayerAnswer = multi
        ? { kind: "multi-choice", optionIds: next.map(String) }
        : { kind: "single-choice", optionId: String(next[0]) };
      onSessionChange((current) => setPlayerAnswer(current, probabilityPlayerAdapter, answer));
    } else {
      onSessionChange((current) => clearPlayerAnswer(current, probabilityPlayerAdapter));
    }
    flush();
  }
  function chooseNumeric(value: string) {
    if (phase !== "answering") return;
    setNumericText(value);
    const parsed = value.trim() === "" ? Number.NaN : Number(value);
    const next = Number.isFinite(parsed) ? [parsed] : [];
    setPicked(next);
    pickedRef.current = next;
    if (next.length) {
      onSessionChange((current) => setPlayerAnswer(current, probabilityPlayerAdapter, {
        kind: "numeric", value: parsed, unit: q.item.numericAnswer?.unit,
      }));
    } else {
      onSessionChange((current) => clearPlayerAnswer(current, probabilityPlayerAdapter));
    }
    flush();
  }
  function check() {
    pause();
    const answer: ProbabilityPlayerAnswer = numeric
      ? { kind: "numeric", value: picked[0], unit: q.item.numericAnswer?.unit }
      : multi
        ? { kind: "multi-choice", optionIds: picked.map(String) }
        : { kind: "single-choice", optionId: String(picked[0]) };
    const timed = tickPlayer(session, acc.current);
    const answered = setPlayerAnswer(timed, probabilityPlayerAdapter, answer);
    const result = submitPlayerAnswer(answered, probabilityPlayerAdapter, {
      submittedAt: Date.now(),
      mode: "practice",
    });
    if (!result.submission) return;
    onSessionChange(() => result.session);
    phaseRef.current = "review";
    recordAttempt(q.key, picked, acc.current);
    setPhase("review");
  }
  function resetTimer() {
    acc.current = 0;
    t0.current = document.hidden ? null : Date.now();
    saveDraft(q.key, { ms: 0, picked: pickedRef.current });
    tick((n) => n + 1);
  }
  function retry() {
    clearDraft(q.key);
    onSessionChange((current) => selectPlayerQuestion(current, index));
    acc.current = 0; t0.current = null;
    setPicked([]); pickedRef.current = []; setNumericText("");
    phaseRef.current = "answering"; setPhase("answering");
    if (!document.hidden) start();
  }

  const reviewing = phase === "review" && !!last;
  const st = last?.status;
  const bookmarked = store.bookmarks.includes(q.key);

  return (
    <LearningPlayerShell className="learning-player-frame" paletteClassName="learning-player-palette" contentClassName="learning-player-content" palette={(
                  <>
                  <button onClick={onBack} className="pill shrink-0" aria-label="Back to the list">←</button>
                  <div className="flex gap-1.5">
                    {queue.map((k, i) => {
                      const s: Status = latest[k]?.status ?? "unattempted";
                      return (
                        <button key={k} onClick={() => onGo(i)} className={`qnum qnum-${s} ${i === index ? "qnum-cur" : ""}`} title={s} aria-label={`Question ${i + 1}, ${s}`} aria-current={i === index ? "step" : undefined}>
                          <span className="text-xs">{i + 1}</span><span className="qmark">{MARK[s] || "·"}</span>
                        </button>
                      );
                    })}
                  </div>
                  </>
                )}>
      <div className="learning-player-meta">
        <div>
          <div className="text-sm text-body">Q {index + 1} <span className={`dbadge dbadge-${q.difficulty} ml-1`}>{DIFF_LABEL[q.difficulty]}</span></div>
          {showTopic && <div className="mt-1 text-xs text-dim">{lessonTitle(q.lessonId)}</div>}
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="timerpill" aria-label="Time on this attempt">⏱ {fmtTime(phase === "review" ? last?.ms ?? 0 : elapsed()).padStart(5, "0")}</div>
          {phase === "answering" && <button onClick={resetTimer} className="text-[11px] text-faint underline-offset-2 hover:text-gold hover:underline">Reset timer</button>}
        </div>
        <div className="text-right">
          <button onClick={() => toggleBookmark(q.key)} aria-pressed={bookmarked} aria-label="Bookmark this question" className={`pill text-lg leading-none ${bookmarked ? "pill-on" : ""}`}>{bookmarked ? "★" : "☆"}</button>
        </div>
      </div>

      <h4 className="qtext mt-6 text-lg leading-8 text-parchment"><Rich text={q.item.question} /></h4>
      {multi && phase === "answering" && <div className="mt-1 text-xs text-mutedgold">Select all that apply. Partial credit is given.</div>}

      <Options item={q.item} picked={phase === "review" ? last?.picked ?? [] : picked} onPick={choose} reveal={reviewing} disabled={phase === "review"} numericText={phase === "review" && last?.picked[0] !== undefined ? String(last.picked[0]) : numericText} onNumericChange={chooseNumeric} />

      {reviewing && last && (
        <div className="mt-6 space-y-4 learning-player-review">
          <div className={`learning-player-feedback flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border px-4 py-3 text-sm ${st === "correct" ? "border-emerald-700/50 bg-emerald-500/10 text-ok" : st === "partial" ? "border-amber-600/50 bg-amber-500/10 text-body" : "border-red-700/40 bg-red-500/10 text-body"}`}>
            <strong>{st === "correct" ? "Correct" : st === "partial" ? `Partly correct · ${Math.round(last.score * 100)}%` : "Incorrect"}</strong>
            <span className="text-dim">Time taken {fmtTime(last.ms)}</span>
          </div>
          <div className="learning-player-solution rounded-xl border border-gold/15 p-4"><Explanation text={q.item.explanation} /></div>
          {last.status !== "correct" && (
            <section className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4" aria-label="Classify this mistake">
              <div className="text-sm font-semibold text-parchment">What caused this mistake?</div>
              <p className="mt-1 text-xs text-dim">Choose the main reason. You can change it later.</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {MISTAKE_CATEGORIES.map((item) => (
                  <button key={item.id} type="button" onClick={() => classifyMistake(last.id, item.id)} aria-pressed={last.mistakeCategory === item.id} className={`rounded-lg border px-3 py-2 text-left text-xs transition ${last.mistakeCategory === item.id ? "border-gold bg-gold/15 text-parchment" : "border-gold/15 text-dim hover:border-gold/40"}`}>
                    <strong className="block">{item.label}</strong><span className="mt-1 block">{item.detail}</span>
                  </button>
                ))}
              </div>
              {last.mistakeCategory && <p className="mt-2 text-xs text-ok">Saved: {mistakeCategoryLabel(last.mistakeCategory)}</p>}
            </section>
          )}
        </div>
      )}

      {mine.length > 0 && (
        <div className="mt-5 text-[11px] text-faint">
          <span className="mr-2 uppercase tracking-widest">Attempts</span>
          {mine.slice(-6).map((a, i, arr) => (
            <span key={a.id} className="mr-3 inline-block">#{mine.length - arr.length + i + 1} <span className={MARKCLS[a.status]}>{MARK[a.status]}</span> {a.ms ? fmtTime(a.ms) : "–"}</span>
          ))}
        </div>
      )}

      <div className="learning-player-actions actionbar">
        <button className="btn-side" disabled={index === 0} onClick={() => onGo(index - 1)}>Previous</button>
        {phase === "answering"
          ? <button className="btn-main" disabled={picked.length === 0} onClick={check}>Check Answer</button>
          : <button className="btn-main" onClick={retry}>Retry · new attempt, timer from 0</button>}
        <button className="btn-side" disabled={index >= queue.length - 1} onClick={() => onGo(index + 1)}>Next</button>
      </div>
    </LearningPlayerShell>
  );
}
