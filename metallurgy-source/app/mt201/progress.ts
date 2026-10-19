// Browser-local progress for the MT201 archive. Same shape as the shared
// MT202 store, but its own key so the two courses never tangle.
// Progress: mm-mt201-v1. Theme stays shared: mm-theme-v1.

export type QState = { choice: string; correct: boolean; at: number };

export type Progress = {
  answered: Record<string, QState>; // key: "ch01-q12"
  examBest: { score: number; total: number; at: number } | null;
};

const KEY = "mm-mt201-v1";
const THEME_KEY = "mm-theme-v1";

export function qid(chapterId: string, n: number) {
  return `${chapterId}-q${n}`;
}

export function loadProgress(): Progress {
  if (typeof window === "undefined") return { answered: {}, examBest: null };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { answered: {}, examBest: null };
    const p = JSON.parse(raw) as Progress;
    return { answered: p.answered ?? {}, examBest: p.examBest ?? null };
  } catch {
    return { answered: {}, examBest: null };
  }
}

export function saveProgress(p: Progress) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* storage unavailable — progress just won't persist */
  }
}

export function recordAnswer(p: Progress, key: string, choice: string, correct: boolean): Progress {
  const next: Progress = {
    ...p,
    answered: { ...p.answered, [key]: { choice, correct, at: Date.now() } },
  };
  saveProgress(next);
  return next;
}

export function resetProgress() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function loadTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  try {
    return window.localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function saveTheme(t: "dark" | "light") {
  try {
    window.localStorage.setItem(THEME_KEY, t);
  } catch {
    /* ignore */
  }
}
