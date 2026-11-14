// scripts/quality/engine.mjs
//
// Pure engine for the MT203 semantic quality layer: no file or process access, so
// tests can feed it deliberately broken questions. The structural validator
// (scripts/validate-mt203.mjs) is unchanged and still runs first in CI; this layer
// adds format-specific rules, the seven review dimensions and the review gate.

import { checkFormat } from "./format-profiles.mjs";
import { checkDimensions, buildSyllabusModel } from "./dimensions.mjs";
import { checkLedger } from "./ledger.mjs";

/**
 * @param {object} input
 * @param {Array}  input.topics    TopicSource[] (as default-exported by app/data/qbank/t*.ts)
 * @param {object} input.lessons   LESSONS record
 * @param {object} input.ledger    { entries }
 * @param {Array}  input.baseline  [{ id, rule, reason }] known open errors (ratchet)
 */
export function runQuality({ topics, lessons, ledger, baseline = [] }) {
  const questions = topics.flatMap((t) => t.questions.map((q, i) => ({ ...q, topic: t.id, n: i + 1 })));
  const model = buildSyllabusModel(topics, lessons);

  const all = [];
  for (const q of questions) {
    all.push(...checkFormat(q));
    all.push(...checkDimensions(q, model));
  }
  const led = checkLedger(questions, ledger);
  all.push(...led.findings);

  // Ratchet: known errors are reported but do not fail; new errors fail; a baseline
  // entry that no longer fires must be removed, so the baseline cannot rot.
  const key = (x) => `${x.id}:${x.rule}`;
  const baselineKeys = new Set(baseline.map(key));
  const firing = new Set(all.filter((f) => f.sev === "error").map(key));
  const errors = all.filter((f) => f.sev === "error");
  const newErrors = errors.filter((f) => !baselineKeys.has(key(f)));
  const knownErrors = errors.filter((f) => baselineKeys.has(key(f)));
  const staleBaseline = baseline.filter((b) => !firing.has(key(b)));
  const warnings = all.filter((f) => f.sev === "warn");
  const infos = all.filter((f) => f.sev === "info");

  const coverage = led.stats;
  const certified =
    newErrors.length === 0 && knownErrors.length === 0 && coverage.verified === coverage.total && coverage.stale === 0;

  return { questions, all, newErrors, knownErrors, staleBaseline, warnings, infos, coverage, certified };
}

export function tally(findings) {
  const by = {};
  for (const f of findings) {
    by[f.dim] ??= { error: 0, warn: 0, info: 0 };
    by[f.dim][f.sev]++;
  }
  return by;
}
