#!/usr/bin/env node
// scripts/validate-mcq-qs.mjs
//
// Audits the MT203 question bank against the Limitless MCQ Quality Standard
// (MCQ-QS v1.0). Read-only. Rules live in scripts/lib/mcq-qs-rules.mjs.
//
// Default            report only, exit 0. Shows where the bank stands today.
// --topic t1         limit the report to one topic (repeatable: --topic t1 --topic t2)
// --rule S4          list every question failing that rule (S1-S10) or warning (H1-H5)
// --verbose          list every error/warning per question
// --strict           exit 1 if any ERROR exists in the in-scope topics
// --enforced         scope --strict to the topics named in scripts/mcq-qs-enforced.json
//                    (a ratchet: add a topic id there once it has been reworked, and CI
//                    keeps it compliant without failing on topics still waiting their turn)
//
// Run: node --import ./scripts/ts-resolve-hook.mjs scripts/validate-mcq-qs.mjs [flags]

import { readFileSync, existsSync } from "node:fs";
import { TOPIC_IDS } from "../app/mt203/types.ts";
import { checkQuestion, decisionFor, levelCounts, TARGET_DISTRIBUTION } from "./lib/mcq-qs-rules.mjs";

// ── args ────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const values = (name) => argv.flatMap((a, i) => (a === name && argv[i + 1] ? [argv[i + 1]] : []));
const strict = flag("--strict");
const verbose = flag("--verbose");
const wantTopics = values("--topic");
const wantRules = values("--rule);

let enforcedTopics = null;
if (flag("--enforced")) {
  const path = new URL("./mcq-qs-enforced.json", import.meta.url);
  enforcedTopics = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")).enforcedTopics ?? [] : [];
}

const inScope = (id) =>
  (wantTopics.length ? wantTopics.includes(id) : true) &&
  (enforcedTopics ? enforcedTopics.includes(id) : true);

// ── run ─────────────────────────────────────────────────────────────────────
const RULES = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10"];
const WARNS = ["H1", "H2", "H3", "H4", "H5"];
const rows = [];
const failures = {}; // rule -> [ids]
const everyQuestion = [];

for (const id of TOPIC_IDS) {
  if (wantTopics.length && !wantTopics.includes(id)) continue;
  const src = (await import(`../app/data/qbank/${id}.ts`)).default;
  const subIds = new Set((src.subs || []).map((s) => s.id));
  const row = { id, n: src.questions.length, clean: 0, accepted: 0, errors: 0, warns: 0, enforced: inScope(id) };
  for (const q of src.questions) {
    const { errors, warnings } = checkQuestion(q, { subIds });
    everyQuestion.push(q);
    if (!errors.length) row.clean++;
    if (Number.isInteger(q.qsScore) && q.qsScore >= 80 && !errors.length) row.accepted++;
    row.errors += errors.length;
    row.warns += warnings.length;
    for (const item of [...errors, ...warnings]) {
      (failures[item.rule] ||= []).push(q.id);
    }
    if (verbose && (errors.length || warnings.length)) {
      console.log(`${q.id} [${decisionFor(q.qsScore)}]`);
      for (const e of errors) console.log(`   ERROR ${e.rule}: ${e.msg}`);
      for (const w of warnings) console.log(`   warn  ${w.rule}: ${w.msg}`);
    }
  }
  rows.push(row);
}

// ── report ──────────────────────────────────────────────────────────────────
const total = rows.reduce((a, r) => a + r.n, 0);
console.log("MCQ-QS v1.0 audit\n");
console.log("topic  questions  pass-all-errors  accepted(>=80)  errors  warnings");
for (const r of rows) {
  console.log(
    `${r.id.padEnd(6)} ${String(r.n).padStart(9)}  ${String(r.clean).padStart(15)}  ${String(r.accepted).padStart(14)}  ${String(r.errors).padStart(6)}  ${String(r.warns).padStart(8)}${r.enforced && enforcedTopics ? "   [enforced]" : ""}`,
  );
}
const sum = (k) => rows.reduce((a, r) => a + r[k], 0);
console.log(`${"TOTAL".padEnd(6)} ${String(total).padStart(9)}  ${String(sum("clean")).padStart(15)}  ${String(sum("accepted")).padStart(14)}  ${String(sum("errors")).padStart(6)}  ${String(sum("warns")).padStart(8)}`);

console.log("\nQuestions failing each rule");
for (const rule of RULES) console.log(`  ${rule.padEnd(4)} ${String((failures[rule] || []).length).padStart(4)}`);
console.log("Heuristic warnings (human review)");
for (const rule of WARNS) console.log(`  ${rule.padEnd(4)} ${String((failures[rule] || []).length).padStart(4)}`);

const lc = levelCounts(everyQuestion);
const withLevel = lc.reduce((a, b) => a + b, 0);
if (withLevel) {
  console.log(`\nqsLevel distribution (${withLevel} questions have one) vs standard ${TARGET_DISTRIBUTION.join("/")}%`);
  console.log("  " + lc.map((c, i) => `L${i + 1}: ${c} (${((100 * c) / withLevel).toFixed(0)}%)`).join("   "));
} else {
  console.log("\nqsLevel distribution: no question has a qsLevel yet.");
}

for (const rule of wantRules) {
  console.log(`\n${rule}: ${(failures[rule] || []).length} question(s)`);
  console.log("  " + ((failures[rule] || []).join(", ") || "(none)"));
}

if (strict) {
  const failing = rows.filter((r) => r.enforced && r.errors > 0);
  if (failing.length) {
    console.error(`\nFAIL: ${failing.map((r) => r.id).join(", ")} have MCQ-QS errors (run with --verbose --topic <id>).`);
    process.exit(1);
  }
  console.log("\nOK: no MCQ-QS errors in scope.");
}
