// scripts/quality/dimensions.mjs
//
// The review dimensions of the semantic layer. Each function takes one question
// and returns findings. Errors are definite defects (a reader cannot defend the
// item as written); warnings are a review queue for a human.
//
// Scientific accuracy cannot be proven by a script. What can be done is (a) catch
// every internal contradiction between the key, the explanation and the
// distractors, (b) independently recompute every number, and (c) gate on a
// review ledger that records who actually checked the science (see ledger.mjs).

import {
  finding, jaccard, median, normText, parseNumbers, decimalsOf, relDiff, tokens, words,
} from "./lib.mjs";
import { NUMERIC_VERIFIERS, NUMERIC_TOLERANCE } from "./numeric-verifiers.mjs";

const keyOf = (q) => q.options.find((o) => o.label === q.answer);
const others = (q) => q.options.filter((o) => o.label !== q.answer);

// ---- 1. answer uniqueness ---------------------------------------------------

export function checkUniqueness(q) {
  const f = [];
  const D = "uniqueness";
  const opts = q.options;
  for (let i = 0; i < opts.length; i++)
    for (let j = i + 1; j < opts.length; j++) {
      if (normText(opts[i].text) === normText(opts[j].text))
        f.push(finding(q, D, "option-duplicate", "error", `options ${opts[i].label} and ${opts[j].label} have identical text`));
      else if (q.type !== "match" && q.type !== "sequence" && q.type !== "statement" && q.type !== "numerical" &&
        q.type !== "assertreason" && tokens(opts[i].text).length >= 3 && tokens(opts[j].text).length >= 3 &&
        jaccard(opts[i].text, opts[j].text) >= 0.85)
        f.push(finding(q, D, "option-near-duplicate", "warn", `options ${opts[i].label} and ${opts[j].label} differ by almost nothing`));
    }
  for (const o of opts)
    if (/\b(all|none|neither|both)\b[^.]{0,20}\b(of the above|a and b|a and c|b and c)\b/i.test(o.text))
      f.push(finding(q, D, "meta-option", "warn", `option ${o.label} is a combined/“of the above” option, which makes the key depend on the other options`));

  // A distractor explanation that concedes the option is also right undermines the key.
  if (q.type !== "statement") {
    for (const [k, v] of Object.entries(q.distractors ?? {}))
      if (/\b(also (?:correct|true|valid|right|acceptable)|equally (?:valid|correct|true)|is (?:in fact |actually )?correct|would also be (?:correct|right|true|acceptable))\b/i.test(String(v)) &&
        !/\b(not|n't|never) (?:also )?(?:correct|true|valid|right)\b/i.test(String(v)))
        f.push(finding(q, D, "distractor-concedes-correct", "error", `explanation for option ${k} says it is also correct — the item has more than one defensible answer`));
  }
  return f;
}

// ---- 2. distractor quality --------------------------------------------------

const ABSOLUTE = /\b(always|never|none|completely|entirely|necessarily|cannot|impossible|solely|proves?|invariably|exclusively)\b/i;

export function checkDistractors(q) {
  const f = [];
  const D = "distractors";
  const key = keyOf(q);
  const rest = others(q);
  if (!key || rest.length < 2) return f;

  if (!["match", "sequence", "statement", "assertreason", "numerical"].includes(q.type)) {
    const lens = rest.map((o) => words(o.text).length);
    const kl = words(key.text).length;
    if (kl >= 8 && kl >= 2 * median(lens) && kl - median(lens) >= 6 && kl > Math.max(...lens))
      f.push(finding(q, D, "key-longest-clue", "warn", `keyed option is the longest by a wide margin (${kl} words vs median ${median(lens)}) — a test-wise clue`));
    const absRest = rest.filter((o) => ABSOLUTE.test(o.text)).length;
    if (absRest >= 2 && !ABSOLUTE.test(key.text))
      f.push(finding(q, D, "absolute-word-clue", "warn", `${absRest} distractors use absolute wording ("always/never/only…") and the key does not — a giveaway`));
    for (let i = 0; i < rest.length; i++)
      for (let j = i + 1; j < rest.length; j++)
        if (tokens(rest[i].text).length >= 3 && tokens(rest[j].text).length >= 3 && jaccard(rest[i].text, rest[j].text) >= 0.8)
          f.push(finding(q, D, "distractors-overlap", "warn", `distractors ${rest[i].label} and ${rest[j].label} overlap almost completely`));
  }

  if (q.type === "numerical" && !NUMERIC_VERIFIERS[q.id]?.waive) {
    const dp = decimalsOf(key.text);
    if (rest.every((o) => decimalsOf(o.text) !== dp))
      f.push(finding(q, D, "key-precision-clue", "warn", `only the keyed option is reported to ${dp} decimal places`));
    const units = (t) => String(t).replace(/\$/g, "").replace(/[\d.,{}\s×x^⁰¹²³⁴⁵⁶⁷⁸⁹⁻\-\\]|times|[=;]/g, "");
    const ku = units(key.text);
    const allQuantities = q.options.every((o) => parseNumbers(o.text).length > 0);
    if (allQuantities && rest.some((o) => units(o.text) !== ku))
      f.push(finding(q, D, "unit-mismatch", "warn", `options do not all use the same unit ("${ku}" vs others) — a unit clue or an error`));
  }

  for (const [k, v] of Object.entries(q.distractors ?? {})) {
    if (/\bthis (?:option |choice )?is (?:actually |in fact )?(?:correct|right|the correct answer)\b/i.test(String(v)))
      f.push(finding(q, D, "distractor-says-correct", "error", `distractor note for ${k} describes it as correct`));
  }
  return f;
}

// ---- 3. explanation quality -------------------------------------------------

export function checkExplanation(q) {
  const f = [];
  const D = "explanation";
  const key = keyOf(q);
  const nWords = words(q.why).length;
  const showsWorking = q.type === "numerical" && /=/.test(q.why) && parseNumbers(q.why).length >= 2;
  if (nWords < 12 && !showsWorking) f.push(finding(q, D, "explanation-thin", "warn", `explanation is only ${nWords} words`));

  // The explanation must not crown a different option.
  for (const m of q.why.matchAll(/\b(?:option|answer|choice)\s*\(?([a-e])\)?\s*(?:is|=)\s*(?:the\s*)?(?:correct|right|key)\b|\bcorrect (?:answer|option|choice) is\s*\(?([a-e])\)?[\s.,;]/gi)) {
    const label = (m[1] ?? m[2]).toLowerCase();
    if (label !== q.answer)
      f.push(finding(q, D, "why-names-other-option", "error", `explanation says option ${label} is correct but the key is ${q.answer}`));
  }

  // A distractor note about the keyed option itself is a contradiction.
  if (q.distractors?.[q.answer] !== undefined)
    f.push(finding(q, D, "distractor-on-key", "error", "a distractor note is attached to the keyed option"));

  // Unsupported answer: for prose answers the explanation should speak to the key.
  if (["recall", "concept", "compare", "apply", "higher", "graph"].includes(q.type) && key) {
    const kt = new Set(tokens(key.text));
    const wt = new Set(tokens(q.why + " " + (q.concept ?? "")));
    const shared = [...kt].filter((t) => wt.has(t)).length;
    if (kt.size >= 4 && shared / kt.size < 0.15)
      f.push(finding(q, D, "explanation-unsupported", "warn", "explanation shares almost no content words with the keyed option — it may not actually support the key"));
  }

  // Numeric key must appear in the explanation's working.
  if (q.type === "numerical" && key && !NUMERIC_VERIFIERS[q.id]?.waive) {
    const whyNums = parseNumbers(q.why);
    const missing = parseNumbers(key.text).filter((n) => !whyNums.some((w) => relDiff(w, n) < 0.02));
    if (missing.length)
      f.push(finding(q, D, "key-value-not-in-why", "warn", `keyed value(s) ${missing.join(", ")} never appear in the explanation's working`));
  }
  return f;
}

// ---- 4. difficulty ----------------------------------------------------------

export function checkDifficulty(q) {
  const f = [];
  const D = "difficulty";
  const nWhy = words(q.why).length;
  if (q.diff === 4 && nWhy < 20)
    f.push(finding(q, D, "diff4-thin-reasoning", "warn", `assigned "exam challenge" but the worked reasoning is ${nWhy} words`));
  if (q.diff === 1 && q.type === "higher")
    f.push(finding(q, D, "diff1-higher", "warn", "multi-step exam-challenge item assigned the basic level"));
  const v = NUMERIC_VERIFIERS[q.id];
  if (q.type === "numerical" && v?.steps !== undefined) {
    if (v.steps >= 3 && q.diff <= 1)
      f.push(finding(q, D, "numeric-steps-vs-diff", "warn", `${v.steps}-step calculation assigned the basic level`));
    if (v.steps === 1 && q.diff >= 4)
      f.push(finding(q, D, "numeric-steps-vs-diff", "warn", "single-step substitution assigned “exam challenge” — the reasoning does not match the level"));
  }
  return f;
}

// ---- 5. syllabus relevance --------------------------------------------------

/** TF-IDF vocabulary per topic from the topic's own lesson text; a question should
 *  be closer to its own topic than to another. */
export function buildSyllabusModel(topics, lessons) {
  const docs = {};
  for (const t of topics) {
    const L = lessons[t.id];
    const text = [t.title, t.subtitle, ...(t.subs ?? []).map((s) => s.title),
      L?.title, L?.aim, ...(L?.sections ?? []).flatMap((s) => [s.h, s.p]),
      ...(L?.formulas ?? []).flatMap((x) => [x.name, x.note ?? ""]), ...(L?.memorise ?? [])].join(" ");
    docs[t.id] = tokens(text);
  }
  const df = new Map();
  for (const toks of Object.values(docs)) for (const w of new Set(toks)) df.set(w, (df.get(w) ?? 0) + 1);
  const N = Object.keys(docs).length;
  const idf = (w) => Math.log((N + 1) / ((df.get(w) ?? 0) + 1)) + 1;
  const vec = (toks) => {
    const m = new Map();
    for (const w of toks) m.set(w, (m.get(w) ?? 0) + 1);
    for (const [w, c] of m) m.set(w, (1 + Math.log(c)) * idf(w));
    return m;
  };
  const norm = (v) => Math.sqrt([...v.values()].reduce((a, b) => a + b * b, 0)) || 1;
  const topicVecs = Object.fromEntries(Object.entries(docs).map(([id, toks]) => [id, vec(toks)]));
  const cos = (a, b) => {
    let dot = 0;
    for (const [w, x] of a) dot += x * (b.get(w) ?? 0);
    return dot / (norm(a) * norm(b));
  };
  return { topicVecs, vec, cos };
}

export function checkSyllabus(q, model) {
  const D = "syllabus";
  const stem = [q.text, q.assertion, q.reason, ...(q.statements ?? []).map((s) => s.text),
    ...q.options.map((o) => o.text), q.why, q.concept].join(" ");
  const qv = model.vec(tokens(stem));
  const scores = Object.entries(model.topicVecs).map(([id, v]) => [id, model.cos(qv, v)]).sort((a, b) => b[1] - a[1]);
  const own = scores.find(([id]) => id === q.topic)?.[1] ?? 0;
  const [bestId, best] = scores[0];
  if (bestId !== q.topic && best >= 1.6 * own && best - own >= 0.06)
    return [finding(q, D, "topic-mismatch", "warn", `reads closer to ${bestId} (${best.toFixed(2)}) than to its own topic ${q.topic} (${own.toFixed(2)}) — check it belongs here`)];
  return [];
}

// ---- 6. numerical verification ---------------------------------------------

export function checkNumeric(q) {
  if (q.type !== "numerical") return [];
  const D = "numeric";
  const v = NUMERIC_VERIFIERS[q.id];
  if (!v)
    return [finding(q, D, "numeric-unverified", "error", "numerical question has no independent recalculation registered in numeric-verifiers.mjs")];
  if (v.waive) return [finding(q, D, "numeric-waived", "info", `recalculation waived: ${v.waive}`)];

  const f = [];
  const expect = v.expect();
  // distance of an option from the recalculation: worst relative error across the quantities it states
  const dist = (opt) => {
    const got = parseNumbers(opt.text);
    if (got.length !== expect.length) return Infinity;
    return Math.max(...got.map((g, i) => relDiff(g, expect[i])));
  };
  const key = keyOf(q);
  const dk = dist(key);
  const rest = others(q);
  const closest = [...q.options].sort((a, b) => dist(a) - dist(b))[0];
  const shown = expect.map((x) => +x.toPrecision(5)).join("; ");
  if (dk > NUMERIC_TOLERANCE) {
    const near = dist(closest) <= 0.05 ? ` — nearest option is ${closest.label} ("${closest.text}", ${(dist(closest) * 100).toFixed(1)}% off)` : " — no option is close";
    f.push(finding(q, D, "numeric-key-wrong", "error", `independent recalculation gives ${shown} but the keyed option reads "${key.text}" (${Number.isFinite(dk) ? (dk * 100).toFixed(1) + "% off" : "different quantities"})${near}`));
  } else {
    for (const o of rest)
      if (dist(o) <= dk)
        f.push(finding(q, D, "numeric-two-correct", "error", `distractor ${o.label} ("${o.text}") is at least as close to the recalculation (${shown}) as the key — two defensible answers`));
  }
  return f;
}

/** Every dimension for one question (format rules live in format-profiles.mjs). */
export function checkDimensions(q, model) {
  return [
    ...checkUniqueness(q),
    ...checkDistractors(q),
    ...checkExplanation(q),
    ...checkDifficulty(q),
    ...checkSyllabus(q, model),
    ...checkNumeric(q),
  ];
}
