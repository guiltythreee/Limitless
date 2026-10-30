#!/usr/bin/env node
// scripts/test-mt201.mjs
//
// PHASE 3 migration harness for MT201.
//
// Proves the MT201 migration onto the shared course architecture changed no
// behaviour:
//   - the registry adapter's outline matches the manifest and the source
//     index.json (14 topics, 289 questions, same order)
//   - every question keeps its source id (`ch01-q12`), order, taxonomy, answer
//     and star rating — compared field-by-field against the raw chapter JSON
//   - a SEEDED mm-mt201-v1 payload loads unchanged, records and resets without
//     touching the shared theme key (no destructive migration)
//   - the migrated Quiz and Exam render through the shared renderer — including
//     a question restored from saved progress — with no console errors
//
// Read-only: writes nothing to disk.
// Run: node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON \
//        --import ./scripts/ts-resolve-hook.mjs scripts/test-mt201.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// ---------------------------------------------------------------- assertions
let pass = 0;
const failures = [];
const check = (cond, msg) => {
  if (cond) pass++;
  else failures.push(msg);
};
const contains = (html, s, msg) =>
  check(html.includes(s), `${msg} — expected to find ${JSON.stringify(s)}`);

const consoleIssues = [];
const origError = console.error;
const origWarn = console.warn;
console.error = (...a) => consoleIssues.push("error: " + a.map(String).join(" "));
console.warn = (...a) => consoleIssues.push("warn: " + a.map(String).join(" "));

const render = (Comp, props) => renderToStaticMarkup(createElement(Comp, props));

// -------------------------------------------- seeded browser storage fixture
// The exact shape the live app has written since before Phase 3.
const FIXTURE = {
  answered: {
    "ch01-q1": { choice: "B", correct: true, at: 1700000000000 },
    "ch01-q2": { choice: "A", correct: false, at: 1700000001000 },
    "ch07-q5": { choice: "C", correct: true, at: 1700000002000 },
  },
  examBest: { score: 41, total: 50, at: 1700000003000 },
};

class MemoryStorage {
  constructor(init) {
    this.m = new Map(Object.entries(init));
  }
  getItem(k) {
    return this.m.has(k) ? this.m.get(k) : null;
  }
  setItem(k, v) {
    this.m.set(k, String(v));
  }
  removeItem(k) {
    this.m.delete(k);
  }
}
const store = new MemoryStorage({
  "mm-mt201-v1": JSON.stringify(FIXTURE),
  "mm-theme-v1": "light",
});
globalThis.window = { localStorage: store };

// serve the chapter JSON the loader fetches
globalThis.fetch = async (url) => {
  const m = String(url).match(/\/data\/mt201\/(ch\d+\.json)$/);
  if (!m) throw new Error(`unexpected fetch: ${url}`);
  const txt = fs.readFileSync(path.join(root, "public", "data", "mt201", m[1]), "utf8");
  return { ok: true, status: 200, json: async () => JSON.parse(txt) };
};

// ---------------------------------------------------------------- real modules
const { MT201_ENTRY } = await import("../app/courses/entries/mt201.ts");
const { loadProgress, recordAnswer, resetProgress, qid } = await import(
  "../app/mt201/progress.ts"
);
const Quiz = (await import("../app/mt201/quiz.tsx")).default;
const Exam = (await import("../app/mt201/exam.tsx")).default;

const manifest = MT201_ENTRY.manifest;
const adapter = MT201_ENTRY.adapter;

// ------------------------------------------------------------- saved progress
{
  const before = store.getItem("mm-mt201-v1");
  const p = loadProgress();
  check(p.answered["ch01-q1"]?.correct === true, "loads saved correct answer (ch01-q1)");
  check(p.answered["ch01-q2"]?.correct === false, "loads saved wrong answer (ch01-q2)");
  check(p.answered["ch07-q5"]?.choice === "C", "loads saved choice (ch07-q5)");
  check(p.examBest?.score === 41 && p.examBest?.total === 50, "loads saved exam best");
  check(store.getItem("mm-mt201-v1") === before, "loading progress does NOT rewrite storage");

  // the page's chamber stat: ch01 has 2 attempted, 1 correct
  const prefix = "ch01-q";
  const done = Object.keys(p.answered).filter((k) => k.startsWith(prefix)).length;
  const right = Object.keys(p.answered).filter((k) => k.startsWith(prefix) && p.answered[k].correct).length;
  check(done === 2 && right === 1, "chamber progress derives from saved answers (ch01: 2/1)");

  // recording is additive and persisted
  const next = recordAnswer(p, qid("ch01", 3), "B", true);
  check(next.answered["ch01-q3"]?.correct === true, "recordAnswer returns updated progress");
  const after = JSON.parse(store.getItem("mm-mt201-v1"));
  check(after.answered["ch01-q3"]?.choice === "B", "recordAnswer persists to mm-mt201-v1");
  check(after.answered["ch01-q1"] !== undefined, "recordAnswer keeps existing answers");
  check(after.examBest?.score === 41, "recordAnswer keeps exam best");
}

// ----------------------------------------------------- registry outline + ids
{
  const idx = JSON.parse(
    fs.readFileSync(path.join(root, "public", "data", "mt201", "index.json"), "utf8")
  );

  const outline = adapter.outline();
  check(outline.courseId === "mt201", "adapter.courseId is mt201");
  check(outline.units.length === 0, "MT201 has no unit grouping");
  check(outline.topics.length === 14, "outline has 14 topics");
  check(outline.totalQuestions === 289, "outline total is 289 questions");
  check(
    outline.topics.map((t) => t.id).join(",") === idx.chapters.map((c) => c.id).join(","),
    "outline topic order matches source index.json"
  );
  check(
    outline.topics.every((t, i) => t.title === idx.chapters[i].title),
    "outline topic titles match source index.json"
  );

  let raw = 0;
  for (const t of idx.chapters) raw += t.count;
  check(raw === 289, "source index.json totals 289 questions");

  // field-by-field against the raw chapter JSON
  const contents = await Promise.all(outline.topics.map((t) => adapter.loadTopic(t.id)));
  let mismatches = 0;
  let total = 0;
  for (let ti = 0; ti < contents.length; ti++) {
    const c = contents[ti];
    const tid = outline.topics[ti].id;
    const rawCh = JSON.parse(
      fs.readFileSync(path.join(root, "public", "data", "mt201", tid + ".json"), "utf8")
    );
    check(c.topicId === tid, `loadTopic(${tid}) topicId`);
    check(c.lesson === null, `loadTopic(${tid}) has no lesson`);
    check(c.questions.length === rawCh.questions.length, `loadTopic(${tid}) question count`);
    check(c.questions.length === outline.topics[ti].count, `loadTopic(${tid}) count matches manifest`);
    for (let i = 0; i < c.questions.length; i++) {
      const q = c.questions[i];
      const r = rawCh.questions[i];
      total++;
      if (q.n !== i + 1) mismatches++;
      if (q.id !== qid(tid, q.n)) mismatches++;
      if (q.answer !== r.answer) mismatches++;
      if (q.type !== (r.type ?? "")) mismatches++;
      if (q.rawDifficulty !== r.stars) mismatches++;
      if (q.options.map((o) => o.label).join("") !== r.options.map((o) => o.label).join(""))
        mismatches++;
      if (!q.options.some((o) => o.label === q.answer)) mismatches++;
    }
  }
  check(total === 289, `adapter returned all 289 questions (got ${total})`);
  check(mismatches === 0, `canonical questions match source exactly (${mismatches} mismatches)`);
}

// ------------------------------------------------- rendered player (Quiz/Exam)
{
  const loaded = loadProgress();
  const ch01 = await adapter.loadTopic("ch01");

  const quizHtml = render(Quiz, {
    topicId: "ch01",
    questions: ch01.questions,
    progress: loaded,
    onProgress: () => {},
  });
  contains(quizHtml, ">Q1<", "Quiz renders question 1 meta");
  contains(quizHtml, "✓ Correct", "Quiz restores a saved correct answer");
  contains(quizHtml, 'class="reveal"', "Quiz reveals the solution for an answered question");
  contains(quizHtml, "disabled", "Quiz locks answered options");
  contains(quizHtml, "Chamber score", "Quiz keeps its chamber-score control");
  contains(quizHtml, "Next →", "Quiz keeps its navigation");

  const freshHtml = render(Quiz, {
    topicId: "ch01",
    questions: ch01.questions,
    progress: { answered: {}, examBest: null },
    onProgress: () => {},
  });
  contains(freshHtml, "Peek (not recorded)", "Quiz offers peek on a fresh question");
  contains(freshHtml, ">Q1<", "Quiz opens on question 1 with no saved progress");

  const examHtml = render(Exam, {
    progress: loaded,
    onProgress: () => {},
    topics: manifest.topics.map((t) => ({ id: t.id, title: t.title })),
  });
  contains(examHtml, "Exam Simulator", "Exam renders the setup screen");
  contains(examHtml, "Begin exam", "Exam keeps its begin button");
  contains(examHtml, "Best result so far: 41/50", "Exam shows the saved exam best");
}

// ------------------------------------------------------- source-level checks
{
  const entrySrc = fs.readFileSync(
    path.join(root, "app", "courses", "entries", "mt201.ts"),
    "utf8"
  );
  check(!/data\/lessons/.test(entrySrc), "MT201 entry pulls no other course's lessons");

  const pageSrc = fs.readFileSync(path.join(root, "app", "mt201", "page.tsx"), "utf8");
  check(pageSrc.includes("../courses/entries/mt201"), "MT201 page imports the registry entry");
  check(pageSrc.includes("adapter") && pageSrc.includes("loadTopic"), "MT201 page loads via the adapter");
  check(!pageSrc.includes("CHAPTER_IDS"), "MT201 page no longer hardcodes chapter ids");
}

// ------------------------------------------------------------- reset last
{
  const lifetimeExpRecords = loadProgress().rewardLedger.length;
  resetProgress();
  const reset = JSON.parse(store.getItem("mm-mt201-v1") || "null");
  check(!!reset && Object.keys(reset.answered || {}).length === 0, "resetProgress clears saved MT201 answers");
  check((reset?.rewardLedger || []).length === lifetimeExpRecords, "resetProgress preserves MT201 lifetime Meta EXP");
  check(store.getItem("mm-theme-v1") === "light", "resetProgress leaves the shared theme key");
}

// ---------------------------------------------------------------- report
console.error = origError;
console.warn = origWarn;

check(consoleIssues.length === 0, `no console errors/warnings during render (${consoleIssues.slice(0, 3).join(" | ")})`);

console.log("test-mt201 — Phase 3 migration regression\n");
console.log("course: mt201   topics: 14   questions: 289   storage: mm-mt201-v1");
console.log(`assertions: ${pass} passed, ${failures.length} failed\n`);

if (failures.length) {
  for (const f of failures) console.log("  ✗ " + f);
  console.log("\nFAILED");
  process.exit(1);
}
console.log("All MT201 migration checks passed.");
