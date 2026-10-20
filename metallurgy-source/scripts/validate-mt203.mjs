#!/usr/bin/env node
// scripts/validate-mt203.mjs
//
// Content validator for the MT203 question bank. It imports the *real* typed
// sources (Node's native type-stripping handles the `import type`s), so it
// checks exactly what the app loads at runtime:
//   - schema: id / type / diff / options / answer / why / stems
//   - ids: unique, correctly prefixed, sequential within a topic
//   - meta: per-topic counts and module grouping match MODULE_META
//   - coverage: topic x type and topic x difficulty matrices
//
// Run: node scripts/validate-mt203.mjs   (exit 1 on any error)

import { MODULE_META, TOTAL_QUESTIONS } from "../app/data/qbank/meta.ts";
import { MODULE_IDS, TOPIC_IDS, TYPE_ORDER } from "../app/mt203/types.ts";

const QTYPES = new Set(TYPE_ORDER);
const DIFFS = new Set([1, 2, 3, 4]);
const errors = [];
const err = (m) => errors.push(m);

const LABELS = ["a", "b", "c", "d", "e", "f"];

const topics = [];
for (const id of TOPIC_IDS) {
  let mod;
  try {
    mod = await import(`../app/data/qbank/${id}.ts`);
  } catch (e) {
    err(`${id}: failed to import (${e.message})`);
    continue;
  }
  const src = mod.default;
  if (!src) {
    err(`${id}: default export missing`);
    continue;
  }
  if (src.id !== id) err(`${id}: source id is "${src.id}"`);
  if (!MODULE_IDS.includes(src.module)) err(`${id}: bad module "${src.module}"`);
  if (!src.title || !src.subtitle) err(`${id}: missing title/subtitle`);

  // subtopics: T<number>.<number>, unique, in ascending order
  if (!Array.isArray(src.subs) || src.subs.length === 0) {
    err(`${id}: subs missing`);
  } else {
    const seen = new Set();
    let last = 0;
    for (const s of src.subs) {
      const m = /^T\d+\.(\d+)$/.exec(s.id);
      if (!m) err(`${id}: bad subtopic id "${s.id}"`);
      else {
        const n = Number(m[1]);
        if (n <= last) err(`${id}: subtopic ${s.id} out of order`);
        last = n;
      }
      if (seen.has(s.id)) err(`${id}: duplicate subtopic ${s.id}`);
      seen.add(s.id);
      if (!s.title) err(`${id}: subtopic ${s.id} has no title`);
    }
  }

  if (!Array.isArray(src.questions) || src.questions.length === 0) {
    err(`${id}: no questions`);
    continue;
  }

  src.questions.forEach((q, i) => {
    const at = `${id}[${i}]${q && q.id ? ` ${q.id}` : ""}`;
    const expectId = `${id}-${String(i + 1).padStart(2, "0")}`;
    if (q.id !== expectId) err(`${at}: expected id ${expectId}`);
    if (!QTYPES.has(q.type)) err(`${at}: bad type "${q.type}"`);
    if (!DIFFS.has(q.diff)) err(`${at}: bad diff "${q.diff}"`);

    // stem: either text, or a full assertion+reason pair
    const hasText = typeof q.text === "string" && q.text.trim().length > 0;
    const hasAR =
      typeof q.assertion === "string" &&
      q.assertion.trim().length > 0 &&
      typeof q.reason === "string" &&
      q.reason.trim().length > 0;
    if (q.type === "assertreason") {
      if (!hasAR) err(`${at}: assertreason needs assertion + reason`);
    } else if (!hasText) {
      err(`${at}: missing text stem`);
    }
    if (q.type === "statement") {
      if (!Array.isArray(q.statements) || q.statements.length < 2)
        err(`${at}: statement item needs >=2 statements`);
    }
    if (q.type === "match") {
      if (!Array.isArray(q.tableRows) || q.tableRows.length < 2)
        err(`${at}: match item needs a tableRows table`);
    }

    // options
    if (!Array.isArray(q.options) || q.options.length < 2) {
      err(`${at}: needs >=2 options`);
    } else {
      const labels = q.options.map((o) => o.label);
      const uniq = new Set(labels);
      if (uniq.size !== labels.length) err(`${at}: duplicate option labels`);
      labels.forEach((l, k) => {
        if (l !== LABELS[k]) err(`${at}: option ${k} label "${l}" should be "${LABELS[k]}"`);
      });
      if (!uniq.has(q.answer)) err(`${at}: answer "${q.answer}" not among options`);
      for (const o of q.options) if (!o.text || !o.text.trim()) err(`${at}: empty option ${o.label}`);
    }

    if (typeof q.why !== "string" || !q.why.trim()) err(`${at}: missing why`);

    if (q.distractors) {
      const labels = new Set((q.options || []).map((o) => o.label));
      for (const [k, v] of Object.entries(q.distractors)) {
        if (!labels.has(k)) err(`${at}: distractor key "${k}" not an option`);
        if (k === q.answer) err(`${at}: distractor key equals answer "${k}"`);
        if (!v || !String(v).trim()) err(`${at}: empty distractor "${k}"`);
      }
    }

    if (q.tags) for (const t of q.tags) if (typeof t !== "string" || !t) err(`${at}: bad tag`);
  });

  topics.push({ id, module: src.module, title: src.title, questions: src.questions });
}

// ---- global id uniqueness --------------------------------------------------
const allIds = new Map();
for (const t of topics)
  for (const q of t.questions) {
    if (allIds.has(q.id)) err(`duplicate question id ${q.id}`);
    allIds.set(q.id, true);
  }

// ---- meta cross-check ------------------------------------------------------
const metaTopicIds = MODULE_META.flatMap((m) => m.topics.map((t) => t.id));
if (JSON.stringify(metaTopicIds) !== JSON.stringify([...TOPIC_IDS]))
  err(`MODULE_META topic order ${metaTopicIds.join(",")} != ${TOPIC_IDS.join(",")}`);

for (const m of MODULE_META) {
  if (!MODULE_IDS.includes(m.id)) err(`MODULE_META: bad module ${m.id}`);
  for (const tm of m.topics) {
    const real = topics.find((t) => t.id === tm.id);
    if (!real) {
      err(`MODULE_META: topic ${tm.id} has no source`);
      continue;
    }
    if (real.questions.length !== tm.count)
      err(`${tm.id}: meta count ${tm.count} != actual ${real.questions.length}`);
    if (real.module !== m.id) err(`${tm.id}: source module ${real.module} != meta module ${m.id}`);
  }
}
const actualTotal = topics.reduce((n, t) => n + t.questions.length, 0);
if (actualTotal !== TOTAL_QUESTIONS)
  err(`TOTAL_QUESTIONS ${TOTAL_QUESTIONS} != actual ${actualTotal}`);

// ---- coverage matrices -----------------------------------------------------
const types = TYPE_ORDER;
const diffs = [1, 2, 3, 4];
const pad = (s, n) => String(s).padEnd(n);
const num = (s, n) => String(s).padStart(n);

if (errors.length === 0) {
  console.log(`MT203 question bank: ${actualTotal} questions across ${topics.length} topics.\n`);

  console.log("Questions per topic:");
  console.log("  " + pad("topic", 6) + pad("module", 8) + pad("title", 40) + num("n", 4));
  for (const t of topics)
    console.log(
      "  " + pad(t.id, 6) + pad(t.module, 8) + pad(t.title.slice(0, 38), 40) + num(t.questions.length, 4),
    );

  console.log("\nTopic x type:");
  const hdr = "  " + pad("topic", 6) + types.map((x) => num(x.slice(0, 5), 6)).join("");
  console.log(hdr);
  for (const t of topics) {
    const cells = types.map((x) => num(t.questions.filter((q) => q.type === x).length, 6));
    console.log("  " + pad(t.id, 6) + cells.join(""));
  }
  const typeTotals = types.map(
    (x) => topics.reduce((n, t) => n + t.questions.filter((q) => q.type === x).length, 0),
  );
  console.log("  " + pad("TOTAL", 6) + typeTotals.map((n) => num(n, 6)).join(""));

  console.log("\nTopic x difficulty:");
  console.log("  " + pad("topic", 6) + diffs.map((d) => num(`D${d}`, 6)).join(""));
  for (const t of topics) {
    const cells = diffs.map((d) => num(t.questions.filter((q) => q.diff === d).length, 6));
    console.log("  " + pad(t.id, 6) + cells.join(""));
  }
  const diffTotals = diffs.map(
    (d) => topics.reduce((n, t) => n + t.questions.filter((q) => q.diff === d).length, 0),
  );
  console.log("  " + pad("TOTAL", 6) + diffTotals.map((n) => num(n, 6)).join(""));

  // every type should appear somewhere in the bank
  const missing = types.filter((x) => !topics.some((t) => t.questions.some((q) => q.type === x)));
  if (missing.length) console.log(`\nWARN: question types never used: ${missing.join(", ")}`);

  console.log("\nAll checks passed.");
} else {
  console.error(`MT203 validation FAILED with ${errors.length} problem(s):\n`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
