// scripts/lib/mcq-qs-rules.mjs
//
// Machine-checkable rules from the Limitless MCQ Quality Standard (MCQ-QS v1.0).
// Pure functions, no I/O: validate-mcq-qs.mjs feeds them the real bank and
// test-mcq-qs.mjs feeds them synthetic questions.
//
// Two tiers:
//   ERROR   deterministic. Fails --strict for any topic in scope.
//   WARN    heuristic (giveaway cues, stem wording). Never fails the build, but
//           is listed so a human reviewer looks at it. Judgement rules from the
//           standard (plausibility, reasoning requirement, ambiguity) can't be
//           machine-checked and stay with the reviewer's 0-100 score.
//
// Rule ids
//   S1  exactly four options                      (§5 Options)
//   S2  exactly one correct key, unique labels    (§1E, §5)
//   S3  no "all/none of the above"                (§5 Additional rules)
//   S4  every wrong option has a real explanation (§1F, §5 Explanation)
//   S5  every wrong option has a misconception tag(§2, §6)
//   S6  qsLevel is an integer 1-5                 (§3)
//   S7  source link: `sub` exists in topic subs   (§5 Source traceability)
//   S8  reviewer score recorded, integer 0-100    (§7)
//   S9  explanation of the correct answer present (§1F)
//   S10 an accepted score (>=80) can't coexist with other failing rules (§7)
//   H1  correct option uniquely longest and >=1.3x the wrong-option mean  (§1C)
//   H2  absolute-word tell: >=2 wrong options use always/never/alone/...  (§1C)
//   H3  numerical stem states no rounding / exactness / tolerance         (§5)
//   H4  negative stem (NOT/EXCEPT) without unmistakable emphasis          (§5)
//   H5  thin wrong-option explanation (6-9 words)                         (§1F)

export const KINDS = new Set(["conceptual", "observation", "mathematical"]);

/** Question types whose options are codes/combinations, not prose sentences. */
export const NON_PROSE_TYPES = new Set([
  "numerical", "match", "statement", "sequence", "assertreason",
]);

/** Standard's starting distribution (§4), percent per level 1..5. */
export const TARGET_DISTRIBUTION = [15, 25, 30, 20, 10];

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const ABSOLUTE =
  /\b(always|never|only|all|every|none|alone|guarantees?|required|essential|solely|any|must|cannot|impossible)\b/i;

const words = (s) => (typeof s === "string" ? s.trim().split(/\s+/).filter(Boolean).length : 0);
const stemOf = (q) => q.text || `${q.assertion || ""} ${q.reason || ""}`;

/**
 * @param {object} q       a question as stored in app/data/qbank/t*.ts
 * @param {{subIds: Set<string>}} ctx
 * @returns {{errors: {rule:string,msg:string}[], warnings: {rule:string,msg:string}[]}}
 */
export function checkQuestion(q, ctx) {
  const errors = [];
  const warnings = [];
  const E = (rule, msg) => errors.push({ rule, msg });
  const W = (rule, msg) => warnings.push({ rule, msg });

  const opts = Array.isArray(q.options) ? q.options : [];
  const labels = opts.map((o) => o.label);
  const wrong = labels.filter((l) => l !== q.answer);
  const dis = q.distractors || {};
  const mis = q.misconceptions || {};

  // ── errors ──────────────────────────────────────────────────────────────
  if (opts.length !== 4) E("S1", `has ${opts.length} options; the standard requires 4`);

  if (new Set(labels).size !== labels.length || !labels.includes(q.answer)) {
    E("S2", "answer key is missing from the options, or option labels are not unique");
  }

  if (opts.some((o) => /\b(all|none) of the (above|these)\b|\b(both|neither) of the above\b/i.test(o.text || ""))) {
    E("S3", 'uses an "all/none of the above" option');
  }

  const unexplained = wrong.filter((l) => words(dis[l]) < 6);
  if (unexplained.length) E("S4", `wrong option(s) without a real explanation: ${unexplained.join(", ")}`);

  const untagged = wrong.filter(
    (l) => !(mis[l] && KEBAB.test(mis[l].tag || "") && KINDS.has(mis[l].kind)),
  );
  if (untagged.length) E("S5", `wrong option(s) without a valid misconception tag: ${untagged.join(", ")}`);
  if (Object.keys(mis).some((l) => !wrong.includes(l))) {
    E("S5", "misconception tag attached to the correct option or to a label that does not exist");
  }

  if (!Number.isInteger(q.qsLevel) || q.qsLevel < 1 || q.qsLevel > 5) E("S6", "qsLevel must be an integer 1-5");

  if (!q.sub || !ctx.subIds.has(q.sub)) E("S7", "`sub` is missing or is not one of this topic's subtopic ids");

  if (!Number.isInteger(q.qsScore) || q.qsScore < 0 || q.qsScore > 100) E("S8", "qsScore must be an integer 0-100");

  if (words(q.why) < 15) E("S9", "explanation of the correct answer is under 15 words");

  if (Number.isInteger(q.qsScore) && q.qsScore >= 80 && errors.some((e) => e.rule !== "S8")) {
    E("S10", "scored as accepted (>=80) but still fails other rules; fix the question or lower the score");
  }

  // ── warnings (heuristics) ───────────────────────────────────────────────
  const prose = !NON_PROSE_TYPES.has(q.type) && opts.length > 0 && opts.every((o) => (o.text || "").length > 15);
  const correct = opts.find((o) => o.label === q.answer);
  if (prose && correct && wrong.length) {
    const wrongTexts = opts.filter((o) => o.label !== q.answer).map((o) => o.text);
    const c = correct.text.length;
    const w = wrongTexts.map((t) => t.length);
    const mean = w.reduce((a, b) => a + b, 0) / w.length;
    if (c > Math.max(...w) && c >= 1.3 * mean) {
      W("H1", "correct option is the uniquely longest and >=1.3x the average wrong option");
    }
    if (!ABSOLUTE.test(correct.text) && wrongTexts.filter((t) => ABSOLUTE.test(t)).length >= 2) {
      W("H2", "two or more wrong options use absolute words (always/never/alone/...); the correct one does not");
    }
  }

  const stem = stemOf(q);
  if (q.type === "numerical" && !/(round|decimal|significant|sig\.? ?fig|nearest|exact|tolerance|approx)/i.test(stem)) {
    W("H3", "numerical stem does not state rounding, exactness or tolerance");
  }

  if (
    /\bexcept\b|\b(is|are|does|do)\s+(not|incorrect|false)\b|\bleast likely\b/i.test(stem) &&
    !/\b(NOT|EXCEPT|INCORRECT|FALSE)\b|\*\*/.test(stem)
  ) {
    W("H4", "negative stem without an unmistakable NOT/EXCEPT (capitalise or bold it)");
  }

  const thin = wrong.filter((l) => words(dis[l]) >= 6 && words(dis[l]) < 10);
  if (thin.length) W("H5", `thin explanation (under 10 words) for: ${thin.join(", ")}`);

  return { errors, warnings };
}

/** Decision band from the standard's §7 table. */
export function decisionFor(score) {
  if (!Number.isInteger(score)) return "unscored";
  if (score >= 90) return "excellent";
  if (score >= 80) return "good";
  if (score >= 70) return "revise";
  return "reject";
}

/** Counts per qsLevel (index 0 = level 1) for questions that have one. */
export function levelCounts(questions) {
  const counts = [0, 0, 0, 0, 0];
  for (const q of questions) if (Number.isInteger(q.qsLevel) && q.qsLevel >= 1 && q.qsLevel <= 5) counts[q.qsLevel - 1]++;
  return counts;
}
