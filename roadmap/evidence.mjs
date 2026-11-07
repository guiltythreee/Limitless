// Read-only evidence readers for the Progression Map.
//
// Each reader looks at ONE module's canonical browser-local payload and reports how far a
// node has got. Rules inherited from the Studies architecture:
//   - never initialise, migrate, normalise or write another module's data;
//   - a missing key is a valid empty record (progress 0);
//   - a malformed payload is "unknown" (known: false), never guessed as progress;
//   - explicit completion/mastery flags count; mere activity is labelled as coverage.

import { readManual } from "./manual.mjs";

export const EVIDENCE_KINDS = new Set([
  "manual-check",
  "manual-number",
  "codeforces-rating",
  "competition-problems",
  "probability-pathway",
  "competition-subject",
  "course-coverage",
  "course-exam",
  "math-test80",
  "global-level",
]);

export const STORAGE_KEYS = Object.freeze({
  probability: "hc3-progress-v3",
  competition: "limitless.competition.regional-qualification.v1",
  accounts: "limitless.competition.linked-accounts.v1",
  mathRuns: "limitless.math.v1.runs",
});

const isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
const clamp01 = (value) => (Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0);
const pct = (value) => `${Math.round(value * 100)}%`;
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

/** Parse one payload. status: "missing" | "ok" | "invalid". Never writes. */
function readPayload(storage, key, expect = "object") {
  let raw;
  try { raw = storage?.getItem(key); } catch { return { status: "invalid" }; }
  if (raw === null || raw === undefined || raw === "") return { status: "missing" };
  try {
    const value = JSON.parse(raw);
    const okShape = expect === "array" ? Array.isArray(value) : isRecord(value);
    return okShape ? { status: "ok", value } : { status: "invalid" };
  } catch {
    return { status: "invalid" };
  }
}

const unknown = (detail) => ({ fraction: 0, known: false, detail });

/** Progress toward a numeric target. Reaching the target is exactly 1; below it scales from `start`. */
function numberFraction(value, start, target) {
  if (value >= target) return 1;
  const span = target - start;
  return span > 0 ? clamp01((value - start) / span) : 0;
}

/**
 * @param options.storage     object with getItem(key)
 * @param options.catalog     ROADMAP_CATALOG (generated)
 * @param options.readLevel   () => number | null   global LSR-1 level
 */
export function createEvidenceReader({ storage, catalog, readLevel = () => null }) {
  const manual = readManual(storage);

  const readers = {
    "manual-check": (node) => {
      const entry = manual[node.id];
      if (entry?.state === "done") return { fraction: 1, known: true, detail: "Marked complete" };
      if (entry?.state === "doing") return { fraction: 0, known: true, doing: true, detail: "In progress" };
      return { fraction: 0, known: true, detail: "Not marked yet" };
    },

    "manual-number": (node) => {
      const { label = "Value", unit = "", start = 0, target } = node.evidence;
      const value = manual[node.id]?.value;
      const suffix = unit ? ` ${unit}` : "";
      if (value === null || value === undefined) {
        return { fraction: 0, known: true, source: "manual", detail: `No ${label.toLowerCase()} logged yet. Target ${target}${suffix}.` };
      }
      return {
        fraction: numberFraction(value, start, target),
        known: true,
        doing: true,
        source: "manual",
        detail: `${label}: ${value}${suffix}. Target ${target}${suffix}.`,
      };
    },

    // Reads the rating the Regional Qualification page cached from the Codeforces API.
    // Uses the PEAK rating: it is the number people cite, and it cannot fall after a bad contest.
    // With no usable cache (not linked yet, offline, different handle) it falls back to a typed value.
    "codeforces-rating": (node) => {
      const { label = "Codeforces rating", start = 0, target } = node.evidence;
      const accounts = readPayload(storage, STORAGE_KEYS.accounts);
      const root = accounts.status === "ok" ? accounts.value : {};
      const snap = root.codeforcesSnapshot;
      const sameHandle = isRecord(snap) && typeof snap.handle === "string" && typeof root.codeforcesHandle === "string" &&
        snap.handle.toLowerCase() === root.codeforcesHandle.toLowerCase();
      if (sameHandle) {
        if (typeof snap.maxRating !== "number") {
          return { fraction: 0, known: true, source: "linked", detail: `Your linked Codeforces account (${snap.handle}) is unrated so far. Target ${target}.` };
        }
        const when = Number.isFinite(snap.fetchedAt) ? ` Checked ${new Date(snap.fetchedAt).toLocaleDateString()}.` : "";
        const current = typeof snap.rating === "number" && snap.rating !== snap.maxRating ? ` (current ${snap.rating})` : "";
        return {
          fraction: numberFraction(snap.maxRating, start, target),
          known: true,
          doing: true,
          source: "linked",
          detail: `Peak rating ${snap.maxRating}${current} on ${snap.handle}.${when} Target ${target}.`,
        };
      }
      const value = manual[node.id]?.value;
      const hint = " Open Regional Qualification once with internet access to fill this in automatically.";
      if (value === null || value === undefined) {
        return { fraction: 0, known: true, source: "manual", detail: `No ${label.toLowerCase()} yet. Target ${target}.${hint}` };
      }
      return {
        fraction: numberFraction(value, start, target),
        known: true,
        doing: true,
        source: "manual",
        detail: `${label}: ${value} (entered by you). Target ${target}.${hint}`,
      };
    },

    // Counts problems recorded in the Regional Qualification problem review with a given first-attempt result.
    // Entries saved before that field was recorded have no result, so they are reported but never counted.
    "competition-problems": (node) => {
      const { minCount, outcomes = ["independent"] } = node.evidence;
      const payload = readPayload(storage, STORAGE_KEYS.competition);
      if (payload.status === "invalid") return unknown("Competition progress could not be read");
      const log = payload.status === "ok" ? payload.value.problemLog : [];
      if (log !== undefined && !Array.isArray(log)) return unknown("Competition problem log could not be read");
      const entries = (log ?? []).filter(isRecord);
      const counted = entries.filter((entry) => outcomes.includes(entry.outcome)).length;
      const legacy = entries.filter((entry) => entry.outcome === undefined).length;
      const note = legacy ? ` ${plural(legacy, "older entry", "older entries")} without a recorded result ${legacy === 1 ? "is" : "are"} not counted.` : "";
      return {
        fraction: clamp01(counted / minCount),
        known: true,
        doing: counted > 0,
        source: "linked",
        detail: `${counted} of ${minCount} problems logged as solved independently.${note}`,
      };
    },

    "probability-pathway": (node) => {
      const { pathway, minFraction = 1 } = node.evidence;
      const lessons = catalog.probability.pathways[pathway];
      if (!lessons?.length) return unknown(`Unknown Probability pathway: ${pathway}`);
      const payload = readPayload(storage, STORAGE_KEYS.probability);
      if (payload.status === "invalid") return unknown("Probability progress could not be read");
      const completedRaw = payload.status === "ok" ? payload.value.completed : [];
      if (completedRaw !== undefined && !Array.isArray(completedRaw)) return unknown("Probability progress could not be read");
      const completed = new Set((completedRaw ?? []).filter((id) => typeof id === "string"));
      const done = lessons.filter((id) => completed.has(id)).length;
      return {
        fraction: clamp01(done / lessons.length / minFraction),
        known: true,
        detail: `${done} of ${lessons.length} lessons completed (needs ${pct(minFraction)})`,
      };
    },

    "competition-subject": (node) => {
      const { subject, minFraction = 1, weeks } = node.evidence;
      const subjects = catalog.competition.subjects;
      let keys = subject === "all" ? Object.values(subjects).flat() : subjects[subject];
      if (!keys?.length) return unknown(`Unknown competition subject: ${subject}`);
      if (Array.isArray(weeks)) {
        keys = keys.filter((key) => {
          const week = Number(key.match(/^w(\d+)-/)?.[1]);
          return week >= weeks[0] && week <= weeks[1];
        });
        if (!keys.length) return unknown("No competition topics in that week range");
      }
      const payload = readPayload(storage, STORAGE_KEYS.competition);
      if (payload.status === "invalid") return unknown("Competition progress could not be read");
      const mastery = payload.status === "ok" && isRecord(payload.value.mastery) ? payload.value.mastery : {};
      const mastered = keys.filter((key) => mastery[key] === "mastered").length;
      return {
        fraction: clamp01(mastered / keys.length / minFraction),
        known: true,
        detail: `${mastered} of ${keys.length} topics marked mastered (needs ${pct(minFraction)})`,
      };
    },

    "course-coverage": (node) => {
      const { course, minFraction = 0.8 } = node.evidence;
      const info = catalog.courses[course];
      if (!info) return unknown(`Unknown course: ${course}`);
      const payload = readPayload(storage, info.storageKey);
      if (payload.status === "invalid") return unknown(`${info.code} progress could not be read`);
      let correct = 0;
      if (payload.status === "ok") {
        if (course === "mt203") {
          if (payload.value.attempts !== undefined && !Array.isArray(payload.value.attempts)) return unknown(`${info.code} progress could not be read`);
          const seen = new Set();
          for (const attempt of payload.value.attempts ?? []) {
            if (isRecord(attempt) && typeof attempt.q === "string" && attempt.correct === true) seen.add(attempt.q);
          }
          correct = seen.size;
        } else {
          if (payload.value.answered !== undefined && !isRecord(payload.value.answered)) return unknown(`${info.code} progress could not be read`);
          const chapters = new Set(info.topics.map((topic) => topic.id));
          for (const [id, state] of Object.entries(payload.value.answered ?? {})) {
            const chapter = id.match(/^(ch\d+)-q\d+$/)?.[1];
            if (chapter && chapters.has(chapter) && isRecord(state) && state.correct === true) correct++;
          }
        }
      }
      correct = Math.min(correct, info.bank);
      return {
        fraction: clamp01(correct / info.bank / minFraction),
        known: true,
        detail: `${correct} of ${info.bank} questions answered correctly (needs ${pct(minFraction)}). This is practice coverage, not an exam result.`,
      };
    },

    "course-exam": (node) => {
      const { course, minPct } = node.evidence;
      const info = catalog.courses[course];
      if (!info || (course !== "mt201" && course !== "mt202")) return unknown(`Exam best is not tracked for ${course}`);
      const payload = readPayload(storage, info.storageKey);
      if (payload.status === "invalid") return unknown(`${info.code} progress could not be read`);
      const best = payload.status === "ok" ? payload.value.examBest : null;
      if (!isRecord(best) || !(best.total > 0) || !Number.isFinite(best.score)) {
        return { fraction: 0, known: true, detail: `No ${info.code} exam simulator result yet. Target ${pct(minPct)}.` };
      }
      const ratio = best.score / best.total;
      return {
        fraction: clamp01(ratio / minPct),
        known: true,
        doing: true,
        detail: `Best exam simulator score ${best.score}/${best.total} (${pct(ratio)}). Target ${pct(minPct)}.`,
      };
    },

    "math-test80": (node) => {
      const { minCorrect, minAccuracy = 0.9 } = node.evidence;
      const payload = readPayload(storage, STORAGE_KEYS.mathRuns, "array");
      if (payload.status === "invalid") return unknown("Math Trainer runs could not be read");
      const runs = payload.status === "ok" ? payload.value : [];
      let best = 0;
      let attempted = 0;
      for (const run of runs) {
        if (!isRecord(run) || run.mode !== "test80") continue;
        attempted++;
        if (typeof run.correct === "number" && typeof run.accuracy === "number" && run.accuracy >= minAccuracy) {
          best = Math.max(best, run.correct);
        }
      }
      return {
        fraction: clamp01(best / minCorrect),
        known: true,
        doing: attempted > 0,
        detail: best
          ? `Best 80-in-8 at ≥${pct(minAccuracy)} accuracy: ${best} correct. Target ${minCorrect}.`
          : `No 80-in-8 run at ≥${pct(minAccuracy)} accuracy yet. Target ${minCorrect} correct.`,
      };
    },

    "global-level": (node) => {
      const { atLeast } = node.evidence;
      const level = readLevel();
      if (typeof level !== "number") return unknown("Global level could not be read");
      return {
        fraction: atLeast > 1 ? clamp01((level - 1) / (atLeast - 1)) : 1,
        known: true,
        detail: `Global level ${level}. Target level ${atLeast}.`,
      };
    },
  };

  return function evaluate(node) {
    const reader = readers[node.evidence?.kind];
    if (!reader) return unknown(`Unsupported evidence kind: ${node.evidence?.kind}`);
    return reader(node);
  };
}
