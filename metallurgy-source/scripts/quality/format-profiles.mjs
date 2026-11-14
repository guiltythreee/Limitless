// scripts/quality/format-profiles.mjs
//
// One profile per MT203 question format. Every MT203 format is *delivered* as a
// single-choice (one option label is stored), but the content inside the options
// has a different shape per format: a match option is a pairing, a sequence option
// is a permutation, an assertion-reason option is one of a fixed verdict set, and
// so on. Each profile validates that shape. A format with no profile is an error,
// so a new QType cannot be added to the bank without validation rules.

import { finding, parseNumbers, words } from "./lib.mjs";

const D = "format";
const roman = "(?:[ivxlc]+|[a-h])";

const keyOption = (q) => q.options.find((o) => o.label === q.answer);
const numSet = (s) => new Set((String(s).match(/\d+/g) ?? []).map(Number));
const sameSet = (a, b) => a.size === b.size && [...a].every((x) => b.has(x));

/** Expand "1–3", "1, 2 and 4" into numbers. */
function expandNumberList(s) {
  const out = new Set();
  for (const m of String(s).matchAll(/(\d+)\s*[–-]\s*(\d+)|(\d+)/g)) {
    if (m[1] !== undefined) for (let n = Number(m[1]); n <= Number(m[2]); n++) out.add(n);
    else out.add(Number(m[3]));
  }
  return out;
}

// ---- format rules -----------------------------------------------------------

function statementRules(q) {
  const f = [];
  const stmts = q.statements ?? [];
  const nums = stmts.map((s) => s.num);
  if (nums.join() !== stmts.map((_, i) => i + 1).join())
    f.push(finding(q, D, "statement-numbering", "error", `statement numbers must run 1..n, got [${nums}]`));
  const valid = new Set(nums);
  const sets = q.options.map((o) => numSet(o.text));
  q.options.forEach((o, i) => {
    if (sets[i].size === 0)
      f.push(finding(q, D, "statement-option-shape", "warn", `option ${o.label} names no statement numbers: "${o.text}"`));
    for (const n of sets[i])
      if (!valid.has(n)) f.push(finding(q, D, "statement-option-range", "error", `option ${o.label} cites statement ${n}, which does not exist`));
  });
  for (let i = 0; i < sets.length; i++)
    for (let j = i + 1; j < sets.length; j++)
      if (sameSet(sets[i], sets[j]) && sets[i].size)
        f.push(finding(q, D, "statement-option-duplicate", "error", `options ${q.options[i].label} and ${q.options[j].label} select the same statements`));

  // The explanation's verdicts must agree with the keyed combination.
  const key = numSet(keyOption(q)?.text ?? "");
  const trueClaims = new Set();
  const falseClaims = new Set();
  const re = /statements?\s+((?:\d+\s*(?:[–-]\s*\d+)?\s*(?:,|and|&|\s)\s*)+?)(?:is|are)\s+(?:both\s+|all\s+)?(correct|true|false|incorrect|wrong)/gi;
  for (const m of q.why.matchAll(re)) {
    const target = /correct|true/i.test(m[2]) ? trueClaims : falseClaims;
    for (const n of expandNumberList(m[1])) target.add(n);
  }
  for (const n of trueClaims)
    if (!key.has(n)) f.push(finding(q, D, "statement-key-vs-why", "error", `explanation calls statement ${n} correct but the keyed option omits it`));
  for (const n of falseClaims)
    if (key.has(n)) f.push(finding(q, D, "statement-key-vs-why", "error", `explanation calls statement ${n} false but the keyed option includes it`));
  return f;
}

export const AR_VERDICTS = [
  [/^a is true,? (?:but )?r is false/i, "A✓ R✗"],
  [/both a and r are true,? (?:and|but) r is (?:the correct explanation|a correct explanation)/i, "A✓ R✓ explains"],
  [/both a and r are true,? (?:and|but) r is not (?:the|a) correct explanation/i, "A✓ R✓ not-explain"],
  [/^a is false,? (?:but )?r is true/i, "A✗ R✓"],
  [/both a and r are false/i, "A✗ R✗"],
];
export const arVerdict = (text) => AR_VERDICTS.find(([re]) => re.test(text.trim()))?.[1] ?? null;

function assertReasonRules(q) {
  const f = [];
  const seen = new Map();
  for (const o of q.options) {
    const v = arVerdict(o.text);
    if (!v) f.push(finding(q, D, "ar-option-shape", "error", `option ${o.label} is not a standard assertion–reason verdict: "${o.text}"`));
    else if (seen.has(v))
      f.push(finding(q, D, "ar-option-duplicate", "error", `options ${seen.get(v)} and ${o.label} are the same verdict (${v})`));
    else seen.set(v, o.label);
  }
  if (q.options.length < 4) f.push(finding(q, D, "ar-option-count", "warn", "assertion–reason items normally carry the 4 standard verdicts"));
  if (words(q.assertion).length < 4 || words(q.reason).length < 4)
    f.push(finding(q, D, "ar-stem-short", "warn", "assertion or reason is too short to judge independently"));
  return f;
}

function matchRules(q) {
  const f = [];
  const rows = q.tableRows ?? [];
  const leftIds = new Set();
  const rightIds = new Set();
  for (const r of rows) {
    if (r.length < 3) { f.push(finding(q, D, "match-row-shape", "error", `row [${r}] has <3 columns`)); continue; }
    leftIds.add(String(r[0]).trim());
    const rm = new RegExp(`^\\(?(${roman})\\)?[.)]?\\s`, "i").exec(String(r[r.length - 1]).trim());
    if (rm) rightIds.add(rm[1].toLowerCase());
    else f.push(finding(q, D, "match-right-label", "error", `row "${r[1]}" has no (i)/(a)-style right-hand label`));
  }
  if (leftIds.size !== rows.length) f.push(finding(q, D, "match-left-ids", "error", "left-hand ids are not unique"));
  if (rightIds.size !== rows.length) f.push(finding(q, D, "match-right-ids", "error", "right-hand labels are not unique"));
  const pairRe = new RegExp(`(\\d+)\\s*[-–→:]\\s*\\(?(${roman})\\)?(?![a-z])`, "gi");
  const maps = [];
  for (const o of q.options) {
    const pairs = [...o.text.matchAll(pairRe)].map((m) => [m[1], m[2].toLowerCase()]);
    if (pairs.length !== rows.length) {
      f.push(finding(q, D, "match-option-shape", "error", `option ${o.label} has ${pairs.length} pairings for ${rows.length} rows`));
      maps.push(null);
      continue;
    }
    const L = new Set(pairs.map((p) => p[0]));
    const R = new Set(pairs.map((p) => p[1]));
    if (L.size !== pairs.length || R.size !== pairs.length)
      f.push(finding(q, D, "match-option-bijection", "error", `option ${o.label} reuses a left or right item (not a one-to-one pairing)`));
    for (const [l, r] of pairs) {
      if (!leftIds.has(l)) f.push(finding(q, D, "match-option-range", "error", `option ${o.label} cites row ${l}, which is not in the table`));
      if (!rightIds.has(r)) f.push(finding(q, D, "match-option-range", "error", `option ${o.label} cites "${r}", which is not in the table`));
    }
    maps.push(pairs.map((p) => p.join("-")).sort().join(","));
  }
  maps.forEach((m, i) => maps.forEach((n, j) => {
    if (j > i && m && m === n) f.push(finding(q, D, "match-option-duplicate", "error", `options ${q.options[i].label} and ${q.options[j].label} are the same pairing`));
  }));
  return f;
}

function sequenceRules(q) {
  const f = [];
  const items = [...(q.text ?? "").matchAll(/\((\d+)\)/g)].map((m) => Number(m[1]));
  if (items.length < 3) {
    f.push(finding(q, D, "sequence-items", "error", "stem must list the items to order as (1) (2) (3) …"));
    return f;
  }
  const want = [...items].sort((a, b) => a - b).join();
  const seen = new Set();
  for (const o of q.options) {
    const order = (o.text.match(/\d+/g) ?? []).map(Number);
    if ([...order].sort((a, b) => a - b).join() !== want)
      f.push(finding(q, D, "sequence-permutation", "error", `option ${o.label} is not a permutation of items ${items.join(",")}: "${o.text}"`));
    const key = order.join(">");
    if (seen.has(key)) f.push(finding(q, D, "sequence-duplicate", "error", `option ${o.label} repeats an earlier ordering`));
    seen.add(key);
  }
  return f;
}

function graphRules(q) {
  const f = [];
  const rows = q.tableRows ?? [];
  const text = q.text ?? "";
  const hasTable = rows.length >= 2 && rows.every((r) => r.length >= 3);
  const hasPoints = parseNumbers(text).length >= 3;
  const describesTrace = /\b(rises?|falls?|plateaus?|peaks?|steps?|exotherm|endotherm|steep|flat|decreas|increas|slope|curve|trace|bimodal|narrow|broad|shoulder|hysteresis)/i.test(text);
  if (!hasTable && !hasPoints && !describesTrace)
    f.push(finding(q, D, "graph-data-missing", "error", "graph item gives neither a data table, data points nor a described trace, so there is nothing to read"));
  else if (!hasTable && !hasPoints)
    f.push(finding(q, D, "graph-qualitative-only", "info", "graph item is described in words only (no numbers) — fine if the question is about shape"));
  if (/\b(figure|fig\.|diagram|shown below|plot below|graph below|curve shown|see (?:the )?(?:plot|graph|figure))\b/i.test(text) && !hasTable && !hasPoints)
    f.push(finding(q, D, "graph-refers-to-absent-figure", "error", "stem refers to a figure that is not part of the question"));
  return f;
}

function numericalRules(q) {
  const f = [];
  const key = keyOption(q);
  if (parseNumbers(key?.text ?? "").length === 0)
    f.push(finding(q, D, "numerical-no-quantity", "warn", "keyed option contains no number — this looks interpretive, not numerical; consider re-typing it"));
  const given = parseNumbers(q.text ?? "");
  if (given.length === 0) f.push(finding(q, D, "numerical-no-givens", "info", "stem gives no numbers to compute from"));
  return f;
}

function higherRules(q) {
  const f = [];
  if (q.diff < 3) f.push(finding(q, D, "higher-difficulty", "warn", `exam-challenge item is assigned difficulty ${q.diff}; the format contract is multi-step / cross-topic`));
  if (words(q.why).length < 25) f.push(finding(q, D, "higher-thin-explanation", "warn", "multi-step item has an explanation under 25 words"));
  return f;
}

function recallRules(q) {
  return q.diff >= 4
    ? [finding(q, D, "recall-difficulty", "warn", "pure recall assigned the top difficulty — recall rarely needs exam-challenge reasoning")]
    : [];
}

const none = () => [];

export const FORMAT_PROFILES = {
  recall: { label: "recall", answerKind: "single-choice", minOptions: 4, requires: ["text"], rules: [recallRules] },
  concept: { label: "conceptual", answerKind: "single-choice", minOptions: 4, requires: ["text"], rules: [none] },
  compare: { label: "comparison", answerKind: "single-choice", minOptions: 4, requires: ["text"], rules: [none] },
  apply: { label: "application", answerKind: "single-choice", minOptions: 4, requires: ["text"], rules: [none] },
  numerical: { label: "numerical", answerKind: "single-choice", minOptions: 4, requires: ["text"], rules: [numericalRules] },
  assertreason: { label: "assertion–reason", answerKind: "single-choice", minOptions: 4, requires: ["assertion", "reason"], rules: [assertReasonRules] },
  statement: { label: "statements", answerKind: "single-choice", minOptions: 4, requires: ["text", "statements"], rules: [statementRules] },
  match: { label: "match", answerKind: "single-choice", minOptions: 4, requires: ["text", "tableRows"], rules: [matchRules] },
  sequence: { label: "sequence", answerKind: "single-choice", minOptions: 4, requires: ["text"], rules: [sequenceRules] },
  graph: { label: "data & graphs", answerKind: "single-choice", minOptions: 4, requires: ["text"], rules: [graphRules] },
  higher: { label: "exam challenge", answerKind: "single-choice", minOptions: 4, requires: ["text"], rules: [higherRules] },
};

/** Run the profile for one question. Unknown formats are an error, never skipped. */
export function checkFormat(q) {
  const profile = FORMAT_PROFILES[q.type];
  if (!profile) return [finding(q, D, "format-unregistered", "error", `no quality profile is registered for format "${q.type}"`)];
  const f = [];
  if (q.options.length < profile.minOptions)
    f.push(finding(q, D, "format-option-count", "warn", `${profile.label} items normally carry ≥${profile.minOptions} options (has ${q.options.length})`));
  for (const rule of profile.rules) f.push(...rule(q));
  return f;
}
