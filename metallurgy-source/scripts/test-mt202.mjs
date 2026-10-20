#!/usr/bin/env node
// scripts/test-mt202.mjs
//
// PHASE 4a migration harness for MT202.
//
// Proves the MT202 migration onto the shared course architecture changed no
// behaviour:
//   - the registry adapter's outline matches the manifest and the source
//     index.json (9 topics, 522 questions, same order)
//   - every question keeps its source id (`ch01-q12`), order, taxonomy, answer
//     and star rating — compared field-by-field against the raw chapter JSON
//   - the canonical lesson (shared mapLesson) matches the raw app/data/lessons
//     source exactly, so the theory renderer is unchanged
//   - a SEEDED mm-mt202-v1 payload loads unchanged, records and resets without
//     touching the shared theme key (no destructive migration)
//   - the migrated Quiz and Exam render through the shared renderer — including
//     a question restored from saved progress — with no console errors
//   - the four calculators are reachable through the manifest tools capability
//   - the landing page count was corrected 387 -> 522, isolated from content
//
// Read-only: writes nothing to disk.
// Run: node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON \
//        --import ./scripts/ts-resolve-hook.mjs scripts/test-mt202.mjs

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
const eq = (a, b, msg) => check(a === b, `${msg} — got ${JSON.stringify(a)}, expected ${JSON.stringify(b)}`);

const consoleIssues = [];
const origError = console.error;
const origWarn = console.warn;
console.error = (...a) => consoleIssues.push("error: " + a.map(String).join(" "));
console.warn = (...a) => consoleIssues.push("warn: " + a.map(String).join(" "));

const render = (Comp, props) => renderToStaticMarkup(createElement(Comp, props));

// -------------------------------------------- seeded browser storage fixture
// The exact shape the live app has written since before Phase 4a.
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
  "mm-mt202-v1": JSON.stringify(FIXTURE),
  "mm-theme-v1": "light",
});
globalThis.window = { localStorage: store };

// serve the chapter JSON the loader fetches
globalThis.fetch = async (url) => {
  const m = String(url).match(/\/data\/mt202\/(ch\d+\.json)$/);
  if (!m) throw new Error(`unexpected fetch: ${url}`);
  const txt = fs.readFileSync(path.join(root, "public", "data", "mt202", m[1]), "utf8");
  return { ok: true, status: 200, json: async () => JSON.parse(txt) };
};

// ---------------------------------------------------------------- real modules
const { MT202_ENTRY, MT202_LESSONS } = await import("../app/courses/entries/mt202.ts");
const { LESSONS } = await import("../app/data/lessons.ts");
const { loadProgress, recordAnswer, resetProgress, qid } = await import("../app/lib/progress.ts");
const Quiz = (await import("../app/mt202/quiz.tsx")).default;
const Exam = (await import("../app/mt202/exam.tsx")).default;

const manifest = MT202_ENTRY.manifest;
const adapter = MT202_ENTRY.adapter;

// ------------------------------------------------------------- saved progress
{
  const before = store.getItem("mm-mt202-v1");
  const p = loadProgress();
  check(p.answered["ch01-q1"]?.correct === true, "loads saved correct answer (ch01-q1)");
  check(p.answered["ch01-q2"]?.correct === false, "loads saved wrong answer (ch01-q2)");
  check(p.answered["ch07-q5"]?.choice === "C", "loads saved choice (ch07-q5)");
  check(p.examBest?.score === 41 && p.examBest?.total === 50, "loads saved exam best");
  check(store.getItem("mm-mt202-v1") === before, "loading progress does NOT rewrite storage");

  // the page's chapter stat: ch01 has 2 attempted, 1 correct
  const prefix = "ch01-q";
  const done = Object.keys(p.answered).filter((k) => k.startsWith(prefix)).length;
  const right = Object.keys(p.answered).filter((k) => k.startsWith(prefix) && p.answered[k].correct).length;
  check(done === 2 && right === 1, "chapter progress derives from saved answers (ch01: 2/1)");

  // recording is additive and persisted
  const next = recordAnswer(p, qid("ch01", 3), "B", true);
  check(next.answered["ch01-q3"]?.correct === true, "recordAnswer returns updated progress");
  const after = JSON.parse(store.getItem("mm-mt202-v1"));
  check(after.answered["ch01-q3"]?.choice === "B", "recordAnswer persists to mm-mt202-v1");
  check(after.answered["ch01-q1"] !== undefined, "recordAnswer keeps existing answers");
  check(after.examBest?.score === 41, "recordAnswer keeps exam best");
}

// ----------------------------------------------------- registry outline + ids
{
  const idx = JSON.parse(
    fs.readFileSync(path.join(root, "public", "data", "mt202", "index.json"), "utf8")
  );

  const outline = adapter.outline();
  eq(outline.courseId, "mt202", "adapter.courseId is mt202");
  eq(outline.units.length, 0, "MT202 has no unit grouping");
  eq(outline.topics.length, 9, "outline has 9 topics");
  eq(outline.totalQuestions, 522, "outline total is 522 questions");
  check(
    outline.topics.map((t) => t.id).join(",") === idx.chapters.map((c) => c.id).join(","),
    "outline topic order matches source index.json"
  );

  let raw = 0;
  for (const t of idx.chapters) raw += t.count;
  eq(raw, 522, "source index.json totals 522 questions");

  // field-by-field against the raw chapter JSON
  const contents = await Promise.all(outline.topics.map((t) => adapter.loadTopic(t.id)));
  let mismatches = 0;
  let total = 0;
  for (let ti = 0; ti < contents.length; ti++) {
    const c = contents[ti];
    const tid = outline.topics[ti].id;
    const rawCh = JSON.parse(
      fs.readFileSync(path.join(root, "public", "data", "mt202", tid + ".json"), "utf8")
    );
    eq(c.topicId, tid, `loadTopic(${tid}) topicId`);
    eq(c.questions.length, rawCh.questions.length, `loadTopic(${tid}) question count`);
    eq(c.questions.length, outline.topics[ti].count, `loadTopic(${tid}) count matches manifest`);
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
      if (q.solution.concise !== (r.concise || undefined)) mismatches++;
      if (q.solution.detailed !== (r.detailed || undefined)) mismatches++;
      if (q.solution.keyExplanation !== (r.keyExplanation || undefined)) mismatches++;
    }
  }
  eq(total, 522, `adapter returned all 522 questions (got ${total})`);
  eq(mismatches, 0, `canonical questions match source exactly (${mismatches} mismatches)`);
}

// ------------------------------------------------------- canonical lesson parity
{
  let lmis = 0;
  let lessons = 0;
  for (const t of manifest.topics) {
    const raw = LESSONS[t.id];
    const canon = MT202_LESSONS[t.id];
    if (!t.hasLesson) {
      check(raw === undefined && canon === undefined, `${t.id}: no lesson exists`);
      continue;
    }
    lessons++;
    check(!!raw && !!canon, `${t.id}: lesson present in both source and canonical map`);
    if (!raw || !canon) continue;
    if (canon.topicId !== t.id) lmis++;
    if (canon.title !== raw.title) lmis++;
    if (canon.aim !== raw.aim) lmis++;
    if (canon.sections.length !== raw.sections.length) lmis++;
    for (let i = 0; i < raw.sections.length; i++) {
      if (canon.sections[i].heading !== raw.sections[i].h) lmis++;
      if (canon.sections[i].body !== raw.sections[i].p) lmis++;
    }
    if (canon.formulas.length !== raw.formulas.length) lmis++;
    for (let i = 0; i < raw.formulas.length; i++) {
      const a = canon.formulas[i];
      const b = raw.formulas[i];
      if (a.name !== b.name || a.expr !== b.expr) lmis++;
      if ((a.note ?? undefined) !== (b.note ?? undefined)) lmis++;
      if ((a.vars ?? []).join("|") !== (b.vars ?? []).join("|")) lmis++;
    }
    if (canon.memorise.join("|") !== raw.memorise.join("|")) lmis++;
  }
  eq(lessons, 8, "MT202 has 8 lesson chapters (ch01..ch08)");
  eq(lmis, 0, `canonical lessons match the raw source exactly (${lmis} mismatches)`);

  // the adapter serves the same canonical lesson through loadTopic
  const ch03 = await adapter.loadTopic("ch03");
  check(ch03.lesson?.title === "Solidification of Metals", "adapter lesson title (ch03)");
  eq(
    JSON.stringify(ch03.lesson),
    JSON.stringify(MT202_LESSONS["ch03"]),
    "adapter lesson equals the synchronous canonical lesson"
  );
  const ch09 = await adapter.loadTopic("ch09");
  check(ch09.lesson === null, "ch09 (revision mix) has no lesson");
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
  contains(quizHtml, "Chapter score", "Quiz keeps its chapter-score control");
  contains(quizHtml, "Next →", "Quiz keeps its navigation");

  const freshHtml = render(Quiz, {
    topicId: "ch01",
    questions: ch01.questions,
    progress: { answered: {}, examBest: null },
    onProgress: () => {},
  });
  contains(freshHtml, "Peek (not recorded)", "Quiz offers peek on a fresh question");
  contains(freshHtml, ">Q1<", "Quiz opens on question 1 with no saved progress");

  const topics = manifest.topics.map((t) => ({ id: t.id, title: t.title }));
  const examHtml = render(Exam, {
    progress: loaded,
    onProgress: () => {},
    topics,
  });
  contains(examHtml, "Exam Simulator", "Exam renders the setup screen");
  contains(examHtml, "Ch09 mix", "Exam keeps its Ch09 source option");
  contains(examHtml, "All chapters", "Exam keeps its all-chapters source option");
  contains(examHtml, "Begin exam", "Exam keeps its begin button");
  contains(examHtml, "Best result so far: 41/50", "Exam shows the saved exam best");
}

// --------------------------------------------------------- tools capability
{
  check(manifest.capabilities.tools === true, "capabilities.tools is on");
  eq(manifest.tools.length, 1, "manifest declares one tool");
  const tool = manifest.tools[0];
  eq(tool.id, "calculators", "tool id is calculators");
  const mod = await tool.load();
  eq(typeof mod.default, "function", "tool loader resolves to a component");
  const calcHtml = render(mod.default, {});
  contains(calcHtml, "Lever rule", "calculators render the lever tab");
  contains(calcHtml, "Schmid factor", "calculators render the Schmid tab");
  contains(calcHtml, "Hall–Petch", "calculators render the Hall–Petch tab");
  contains(calcHtml, "Carburising", "calculators render the diffusion tab");
  contains(calcHtml, "C₀ overall (wt%)", "lever calculator keeps its inputs");
}

// ------------------------------------------------------- source-level checks
{
  const entrySrc = fs.readFileSync(
    path.join(root, "app", "courses", "entries", "mt202.ts"),
    "utf8"
  );
  check(!/lessons-mt203|mt201/.test(entrySrc), "MT202 entry pulls no other course's content");

  const regSrc = fs.readFileSync(path.join(root, "app", "courses", "registry.ts"), "utf8");
  check(regSrc.includes("./entries/mt202"), "registry composes the MT202 entry");

  const pageSrc = fs.readFileSync(path.join(root, "app", "mt202", "page.tsx"), "utf8");
  check(pageSrc.includes("../courses/entries/mt202"), "MT202 page imports the registry entry");
  check(pageSrc.includes("adapter") && pageSrc.includes("loadTopic"), "MT202 page loads questions via the adapter");
  check(pageSrc.includes("MT202_LESSONS"), "MT202 page renders canonical lessons");
  check(pageSrc.includes("capabilities.tools") && pageSrc.includes("tools.find"), "MT202 page renders tools via the capability");
  check(!pageSrc.includes("CHAPTER_IDS") && !pageSrc.includes("LESSON_IDS"), "MT202 page no longer hardcodes chapter ids");

  const qviewSrc = fs.readFileSync(path.join(root, "app", "mt202", "qview.tsx"), "utf8");
  check(qviewSrc.includes("../platform/qview"), "MT202 qview uses the shared renderer");
  check(qviewSrc.includes("../courses/types"), "MT202 qview consumes canonical questions");

  const landingSrc = fs.readFileSync(path.join(root, "app", "page.tsx"), "utf8");
  check(landingSrc.includes("522 chapter-wise MCQs"), "landing page advertises 522 MT202 questions");
  check(!landingSrc.includes("387 chapter-wise MCQs"), "landing page no longer advertises 387");
}

// ------------------------------------------------------------- reset last
{
  resetProgress();
  check(store.getItem("mm-mt202-v1") === null, "resetProgress erases mm-mt202-v1");
  check(store.getItem("mm-theme-v1") === "light", "resetProgress leaves the shared theme key");
}

// ---------------------------------------------------------------- report
console.error = origError;
console.warn = origWarn;

check(consoleIssues.length === 0, `no console errors/warnings during render (${consoleIssues.slice(0, 3).join(" | ")})`);

console.log("test-mt202 — Phase 4a migration regression\n");
console.log("course: mt202   topics: 9   questions: 522   lessons: 8   tools: 1   storage: mm-mt202-v1");
console.log(`assertions: ${pass} passed, ${failures.length} failed\n`);

if (failures.length) {
  for (const f of failures) console.log("  ✗ " + f);
  console.log("\nFAILED");
  process.exit(1);
}
console.log("All MT202 migration checks passed.");
