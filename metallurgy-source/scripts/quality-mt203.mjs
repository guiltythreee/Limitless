#!/usr/bin/env node
// scripts/quality-mt203.mjs
//
// Semantic quality gate for the MT203 question bank. Runs AFTER the structural
// validator (scripts/validate-mt203.mjs) and adds:
//   - a validation profile for every question format (not only single-choice)
//   - seven review dimensions: scientific accuracy (via the review ledger),
//     answer uniqueness, distractor quality, explanation quality, difficulty,
//     syllabus relevance, numerical verification (independent recalculation)
//
// Run:  node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --import ./scripts/ts-resolve-hook.mjs scripts/quality-mt203.mjs
//   --verbose            list every warning (default: counts + top of each dimension)
//   --require-review     also fail unless every question has a current "verified" review
//   --report <file.md>   write a Markdown report
//   --worksheet <file>   write a JSON review worksheet for unreviewed / stale questions
//
// Exit 1 on any NEW error. Known open errors live in the baseline and are listed
// every run until fixed (a baseline entry that stops firing must be deleted).

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadBank } from "./quality/lib.mjs";
import { runQuality, tally } from "./quality/engine.mjs";
import { loadLedger } from "./quality/ledger.mjs";
import { fingerprint } from "./quality/lib.mjs";
import { LESSONS } from "../app/data/lessons-mt203.ts";

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n) => (args.includes(n) ? args[args.indexOf(n) + 1] : null);

const topics = await loadBank();
const ledger = loadLedger(join(here, "quality", "review-ledger-mt203.json"));
const baselinePath = join(here, "quality", "baseline-mt203.json");
const baseline = existsSync(baselinePath) ? JSON.parse(readFileSync(baselinePath, "utf8")).entries ?? [] : [];

const r = runQuality({ topics, lessons: LESSONS, ledger, baseline });
const c = r.coverage;
const line = (f) => `  ${f.id.padEnd(7)} [${f.rule}] ${f.msg}`;

console.log(`MT203 semantic quality — ${r.questions.length} questions, ${topics.length} topics\n`);

const t = tally(r.all);
const dims = ["format", "uniqueness", "distractors", "explanation", "difficulty", "syllabus", "numeric", "review"];
console.log("Findings by dimension".padEnd(24) + "error".padStart(7) + "warn".padStart(7) + "info".padStart(7));
for (const d of dims) {
  const x = t[d] ?? { error: 0, warn: 0, info: 0 };
  console.log(`  ${d.padEnd(22)}${String(x.error).padStart(7)}${String(x.warn).padStart(7)}${String(x.info).padStart(7)}`);
}

console.log(`\nScientific-accuracy review ledger: ${c.verified}/${c.total} verified ` +
  `(expert ${c.expert}, assisted ${c.assisted}); stale ${c.stale}; open defects ${c.open}; unreviewed ${c.unreviewed}`);

if (r.knownErrors.length) {
  console.log(`\nKNOWN OPEN ERRORS (baseline — fix the question, then delete the baseline entry): ${r.knownErrors.length}`);
  for (const f of r.knownErrors) console.log(line(f));
}
if (r.newErrors.length) {
  console.log(`\nNEW ERRORS: ${r.newErrors.length}`);
  for (const f of r.newErrors) console.log(line(f));
}
if (r.staleBaseline.length) {
  console.log(`\nSTALE BASELINE ENTRIES (no longer firing — delete them): ${r.staleBaseline.length}`);
  for (const b of r.staleBaseline) console.log(`  ${b.id} [${b.rule}]`);
}

const warnShown = flag("--verbose") ? r.warnings : r.warnings.slice(0, 12);
if (r.warnings.length) {
  console.log(`\nWARNINGS (review queue, never fail the build): ${r.warnings.length}${flag("--verbose") ? "" : "  (first 12; --verbose for all)"}`);
  for (const f of warnShown) console.log(line(f));
}

console.log(`\nVerdict: ${r.certified ? "CERTIFIED" : "NOT CERTIFIED"} — ` +
  (r.certified
    ? "every question has a current verified review and there are no open errors."
    : "structural and semantic checks only. Scientific accuracy is certified only where the review ledger has a current verified entry."));

const reportPath = opt("--report");
if (reportPath) {
  const md = [];
  md.push(`# MT203 semantic quality report`, ``, `Verdict: **${r.certified ? "CERTIFIED" : "NOT CERTIFIED"}** · ${r.questions.length} questions`, ``);
  md.push(`| Dimension | Errors | Warnings | Info |`, `|---|---:|---:|---:|`);
  for (const d of dims) { const x = t[d] ?? { error: 0, warn: 0, info: 0 }; md.push(`| ${d} | ${x.error} | ${x.warn} | ${x.info} |`); }
  md.push(``, `Review ledger: ${c.verified}/${c.total} verified (expert ${c.expert}, assisted ${c.assisted}), stale ${c.stale}, open ${c.open}, unreviewed ${c.unreviewed}.`, ``);
  const section = (title, list) => {
    if (!list.length) return;
    md.push(`## ${title} (${list.length})`, ``);
    for (const f of list) md.push(`- \`${f.id}\` **${f.rule}** — ${f.msg}`);
    md.push(``);
  };
  section("Known open errors", r.knownErrors);
  section("New errors", r.newErrors);
  section("Warnings", r.warnings);
  writeFileSync(reportPath, md.join("\n"));
  console.log(`\nReport written to ${reportPath}`);
}

const wsPath = opt("--worksheet");
if (wsPath) {
  const need = r.questions.filter((q) => {
    const e = ledger.entries[q.id];
    return !e || e.fingerprint !== fingerprint(q);
  });
  const warnBy = new Map();
  for (const f of r.warnings) warnBy.set(f.id, (warnBy.get(f.id) ?? 0) + 1);
  const rows = need
    .map((q) => ({
      id: q.id, type: q.type, diff: q.diff, fingerprint: fingerprint(q),
      risk: (q.type === "numerical" ? 3 : 0) + (warnBy.get(q.id) ?? 0) + (q.diff >= 3 ? 1 : 0),
      status: "", level: "", reviewer: "", date: "", note: "",
    }))
    .sort((a, b) => b.risk - a.risk);
  writeFileSync(wsPath, JSON.stringify({ instructions: "Fill status (verified|needs-edit|rejected), level (expert|assisted), reviewer, date; then merge rows into review-ledger-mt203.json entries keyed by id (keep fingerprint).", rows }, null, 2));
  console.log(`Review worksheet (${rows.length} questions, riskiest first) written to ${wsPath}`);
}

let failed = r.newErrors.length > 0 || r.staleBaseline.length > 0;
if (flag("--require-review") && c.verified !== c.total) {
  console.error(`\n--require-review: only ${c.verified}/${c.total} questions have a current verified review.`);
  failed = true;
}
process.exit(failed ? 1 : 0);
