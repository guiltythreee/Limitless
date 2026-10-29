import { useSyncExternalStore } from "react";
import { allQuestions, grade, questionByKey, type Status } from "./questions";
import { pathways } from "../content";
import { buildRewardRecords, dispatchRewardUpdate, sanitiseRewardRecords, CHECKPOINT_PASS_THRESHOLD, type DifficultyTier, type RewardRecord } from "../../../shared/rewards.mjs";

/*
  All saved data lives in one localStorage entry ("hc3-progress-v3"):
    completed  - lessons marked complete
    attempts   - every submitted answer, each with its own time (a retry is a new attempt)
    bookmarks  - saved questions
    drafts     - the running stopwatch and unsent choice of a question that was left half-way
    goal       - daily goal (questions per day), goalByDay - the goal that applied on each day
  The older keys (hc3-progress-v2 and v1) are read once to carry old answers over and are never deleted.
*/
export const STORAGE_KEY = "hc3-progress-v3";

export type Attempt = {
  id: string;
  q: string; // question key
  picked: number[];
  score: number; // 0..1
  status: Exclude<Status, "unattempted">;
  ms: number; // time spent on this attempt
  ts: number; // when it was submitted (0 = carried over from an older version, date unknown)
};
export type Draft = { ms: number; picked: number[] };
export type TestRecord = {
  id: string;
  ts: number;
  label: string; // what the test covered
  total: number; // questions in the test
  answered: number;
  correct: number;
  score: number; // points earned (partial credit counts)
  ms: number; // total time
  results: { q: string; status: Status | "unattempted"; ms: number }[];
};
export type State = {
  completed: string[];
  tests: TestRecord[];
  attempts: Attempt[];
  rewardLedger: RewardRecord[];
  bookmarks: string[];
  drafts: Record<string, Draft>;
  goal: number;
  goalByDay: Record<string, number>;
};

export const DEFAULT_GOAL = 10;
const EMPTY: State = { completed: [], tests: [], attempts: [], rewardLedger: [], bookmarks: [], drafts: {}, goal: DEFAULT_GOAL, goalByDay: {} };

export const dayKey = (ts: number) => {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const UNCHANGED_V1 = ["conditional", "bayes", "random-variables", "distributions", "limit-theorems", "markov"];

function legacyAttempt(q: string, pick: number, n: number): Attempt | null {
  const item = questionByKey[q]?.item;
  if (!item || typeof pick !== "number") return null;
  const g = grade(item, [pick]);
  return { id: `legacy-${n}`, q, picked: [pick], score: g.score, status: g.status, ms: 0, ts: 0 };
}

function migrate(): State {
  const s: State = { ...EMPTY, drafts: {}, goalByDay: {} };
  try {
    const v2 = localStorage.getItem("hc3-progress-v2");
    const v1 = localStorage.getItem("hc3-progress-v1");
    let answered: Record<string, number> = {};
    if (v2) {
      const p = JSON.parse(v2);
      if (Array.isArray(p.completed)) s.completed = p.completed;
      if (p.answered && typeof p.answered === "object") answered = p.answered;
    } else if (v1) {
      const p = JSON.parse(v1);
      if (Array.isArray(p.completed)) s.completed = p.completed;
      if (p.answered && typeof p.answered === "object") {
        for (const id of UNCHANGED_V1) if (p.answered[id] !== undefined) answered[`${id}:0`] = p.answered[id];
      }
    }
    let n = 0;
    for (const [q, pick] of Object.entries(answered)) {
      const a = legacyAttempt(q, pick, n++);
      if (a) s.attempts.push(a);
    }
  } catch { /* old data unreadable: start fresh */ }
  return s;
}

function read(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        completed: Array.isArray(p.completed) ? p.completed : [],
        tests: Array.isArray(p.tests) ? p.tests : [],
        attempts: Array.isArray(p.attempts) ? p.attempts : [],
        rewardLedger: sanitiseRewardRecords(p.rewardLedger),
        bookmarks: Array.isArray(p.bookmarks) ? p.bookmarks : [],
        drafts: p.drafts && typeof p.drafts === "object" ? p.drafts : {},
        goal: typeof p.goal === "number" && p.goal > 0 ? p.goal : DEFAULT_GOAL,
        goalByDay: p.goalByDay && typeof p.goalByDay === "object" ? p.goalByDay : {},
      };
    }
  } catch { /* fall through to migration */ }
  return migrate();
}

let state: State = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* storage full or blocked */ }
}
function commit(next: State) {
  state = next;
  persist();
  listeners.forEach((l) => l());
}
function ensureLoaded() {
  if (!loaded && typeof window !== "undefined") {
    loaded = true;
    state = read();
    persist();
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEY) { state = read(); listeners.forEach((l) => l()); }
    });
  }
}

export function useStore(): State {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => { ensureLoaded(); return state; },
    () => EMPTY,
  );
}
/** False while the server-rendered page is shown, true once the saved data has been read. */
export function useHydrated(): boolean {
  return useSyncExternalStore(() => () => {}, () => true, () => false);
}

// ---------- actions ----------
function rewardTier(difficulty: string | undefined): DifficultyTier {
  if (difficulty === "hard") return "advanced";
  if (difficulty === "medium") return "intermediate";
  return "foundational";
}

export function recordAttempt(q: string, picked: number[], ms: number, rewardActivity = true): Attempt | null {
  const item = questionByKey[q]?.item;
  if (!item) return null;
  const g = grade(item, picked);
  const ts = Date.now();
  const attempt: Attempt = { id: `${ts}-${Math.random().toString(36).slice(2, 7)}`, q, picked, score: g.score, status: g.status, ms: Math.max(0, Math.round(ms)), ts };
  const today = dayKey(ts);
  const drafts = { ...state.drafts };
  delete drafts[q];
  const rewards = rewardActivity ? buildRewardRecords({
    eventId: `probability:attempt:${attempt.id}`,
    moduleId: "probability",
    itemId: `question:${q}`,
    ts,
    activityClass: "micro-practice",
    difficulty: rewardTier(questionByKey[q]?.difficulty),
    completionEvidence: "submitted-answer",
    completed: picked.length > 0,
    quality: g.score,
  }, state.rewardLedger) : [];
  commit({
    ...state,
    attempts: [...state.attempts, attempt],
    rewardLedger: rewards.length ? [...state.rewardLedger, ...rewards] : state.rewardLedger,
    drafts,
    goalByDay: state.goalByDay[today] === undefined ? { ...state.goalByDay, [today]: state.goal } : state.goalByDay,
  });
  if (rewards.length) dispatchRewardUpdate();
  return attempt;
}
/** Saves a half-finished question. Does not re-render anything; it only protects against refreshes. */
export function saveDraft(q: string, draft: Draft) {
  state = { ...state, drafts: { ...state.drafts, [q]: draft } };
  persist();
}
export function clearDraft(q: string) {
  if (!state.drafts[q]) return;
  const drafts = { ...state.drafts };
  delete drafts[q];
  commit({ ...state, drafts });
}
export function recordTest(t: TestRecord) {
  const questionKeys = [...new Set(t.results.map((result) => result.q))].sort();
  const itemId = `assessment:${questionKeys.join("|") || "empty"}`;
  const numericDifficulties = questionKeys
    .map((key) => questionByKey[key]?.difficulty ?? "easy")
    .map((difficulty) => difficulty === "hard" ? 3 : difficulty === "medium" ? 2 : 1);
  const averageDifficulty = numericDifficulties.length
    ? numericDifficulties.reduce((sum, value) => sum + value, 0) / numericDifficulties.length
    : 1;
  const difficulty: DifficultyTier = averageDifficulty >= 2.5 ? "advanced" : averageDifficulty >= 1.5 ? "intermediate" : "foundational";
  const completed = t.total > 0 && t.answered === t.total;
  const quality = t.total > 0 ? Math.max(0, Math.min(1, t.score / t.total)) : 0;
  const fullArchiveCheckpoint = t.label === "All of probability" && t.total === allQuestions.length;
  const fullPathway = pathways.find((pathway) => `All of ${pathway.shortLabel}` === t.label);
  const fullPathwayQuestionCount = fullPathway
    ? allQuestions.filter((question) => fullPathway.lessonIds.includes(question.lessonId)).length
    : 0;
  const fullPathwayCheckpoint = !!fullPathway && t.total === fullPathwayQuestionCount;
  const checkpointId = fullArchiveCheckpoint
    ? "probability:full-archive"
    : fullPathwayCheckpoint && fullPathway
      ? `probability:pathway:${fullPathway.id}`
      : null;
  const rewards = buildRewardRecords({
    eventId: `probability:assessment:${t.id}`,
    moduleId: "probability",
    itemId,
    ts: t.ts,
    activityClass: "assessment",
    difficulty,
    completionEvidence: completed ? "fully-answered-assessment" : "incomplete-assessment",
    completed,
    quality,
    passed: !!checkpointId && completed && quality >= CHECKPOINT_PASS_THRESHOLD,
    checkpointId,
  }, state.rewardLedger);
  commit({
    ...state,
    tests: [...state.tests, t],
    rewardLedger: [...state.rewardLedger, ...rewards],
  });
  dispatchRewardUpdate();
}
export function toggleBookmark(q: string) {
  commit({ ...state, bookmarks: state.bookmarks.includes(q) ? state.bookmarks.filter((k) => k !== q) : [...state.bookmarks, q] });
}
export function markComplete(id: string) {
  if (!state.completed.includes(id)) commit({ ...state, completed: [...state.completed, id] });
}
export function setGoal(n: number) {
  const goal = Math.max(1, Math.min(500, Math.round(n) || DEFAULT_GOAL));
  commit({ ...state, goal, goalByDay: { ...state.goalByDay, [dayKey(Date.now())]: goal } });
}
export function resetAll() {
  // Lifetime LSR-1 awards are progression history, not ordinary study data; keep them on reset.
  commit({ ...EMPTY, rewardLedger: state.rewardLedger, drafts: {}, goalByDay: {} });
}

// ---------- derived data ----------
/** The most recent attempt of each question. */
export function latestByQuestion(attempts: Attempt[]): Record<string, Attempt> {
  const out: Record<string, Attempt> = {};
  for (const a of attempts) {
    const prev = out[a.q];
    if (!prev || a.ts >= prev.ts) out[a.q] = a;
  }
  return out;
}
export const totalQuestions = allQuestions.length;
