#!/usr/bin/env node
// scripts/test-mt203-migration.mjs
//
// PHASE 4b migration harness for MT203.
//
// Proves the MT203 migration onto the shared course architecture changed no
// behaviour:
//   - the registry adapter's outline matches the manifest and app/data/qbank
//     meta (11 topics, 4 units, 286 questions, same order)
//   - every question keeps its source id (`t4-014`), n, topic, type, difficulty,
//     answer, options, why/distractors/concept and tags — compared field-by-field
//     against the raw app/data/qbank/t*.ts source
//   - the canonical lesson (shared mapLesson) matches the raw lessons-mt203
//     source exactly, and the entry's bundled MT203_LESSONS equals what the
//     adapter serves, so the theory renderer is unchanged
//   - a SEEDED mm-mt203-v1 payload loads unchanged and is NOT rewritten on load;
//     answers, the awarded-reward ledger, exam history, best score, theory-read
//     flags, day counters and goal all survive additive writes
//   - awardAnswer / awardOnce are idempotent: no duplicate reward after a retry
//     or across a reload
//   - a module bonus pays exactly once (settleModuleBonuses is idempotent)
//   - mastery, spaced revision and exam-completion flows still compute from the
//     preserved history
//   - the migrated Player / Exam / Practice render through the shared renderer
//     with no console errors
//
// Read-only: writes nothing outside its in-memory localStorage stub.
// Run: node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON \
//        --import ./scripts/ts-resolve-hook.mjs scripts/test-mt203-migration.mjs

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
const eq = (a, b, msg) =>
  check(a === b, `${msg} — got ${JSON.stringify(a)}, expected ${JSON.stringify(b)}`);

const consoleIssues = [];
const origError = console.error;
const origWarn = console.warn;
console.error = (...a) => consoleIssues.push("error: " + a.map(String).join(" "));
console.warn = (...a) => consoleIssues.push("warn: " + a.map(String).join(" "));

const render = (Comp, props) => renderToStaticMarkup(createElement(Comp, props));

// -------------------------------------------- seeded browser storage fixture
// The exact mm-mt203-v1 shape the live app has written since before Phase 4b.
const NOW = 1_700_000_000_000;
const FIXTURE = {
  attempts: [
    { q: "t1-01", picked: "a", correct: true, mode: "learn", ms: 0, ts: NOW - 90_000_000_000 },
    { q: "t1-02", picked: "b", correct: false, mode: "learn", ms: 0, ts: NOW - 80_000_000_000 },
    { q: "t1-03", picked: "c", correct: true, mode: "practice", ms: 0, ts: NOW - 70_000_000_000 },
    { q: "t2-01", picked: "a", correct: true, mode: "exam", ms: 0, ts: NOW - 60_000_000_000 },
  ],
  theoryRead: ["m1:t1.1", "m1:t1.2"],
  exams: [
    {
      id: "x1",
      ts: NOW - 60_000_000_000,
      label: "Module 1",
      total: 10,
      correct: 7,
      ms: 600000,
      breakdown: { m1: { done: 10, right: 7 } },
    },
  ],
  best: { score: 7, total: 10, at: NOW - 60_000_000_000 },
  awarded: { "q:t1-01": 4, "clear:m1": 60 },
  days: { "2023-11-14": 3 },
  goal: 12,
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
  "mm-mt203-v1": JSON.stringify(FIXTURE),
  "mm-theme-v1": "light",
});
globalThis.window = { localStorage: store };

// ---------------------------------------------------------------- real modules
const { MT203_ENTRY, MT203_LESSONS } = await import("../app/courses/entries/mt203.ts");
const { LESSONS } = await import("../app/data/lessons-mt203.ts");
const META = await import("../app/data/qbank/meta.ts");
const P = await import("../app/lib/mt203-progress.ts");
const { settleModuleBonuses } = await import("../app/mt203/rewards.ts");
const Player = (await import("../app/mt203/player.tsx")).default;
const Exam = (await import("../app/mt203/exam.tsx")).default;
const Practice = (await import("../app/mt203/practice.tsx")).default;
const M203 = await import("../app/mt203/qview.tsx");

const manifest = MT203_ENTRY.manifest;
const adapter = MT203_ENTRY.adapter;

// ------------------------------------------------------------- saved progress
{
  const before = store.getItem("mm-mt203-v1");
  const p = P.loadProgress();
  eq(p.attempts.length, 4, "loads 4 saved attempts");
  eq(p.attempts[0].q, "t1-01", "attempt order preserved");
  eq(p.attempts[2].mode, "practice", "attempt mode preserved");
  eq(p.theoryRead.length, 2, "loads theory-read flags");
  eq(p.exams.length, 1, "loads exam history");
  eq(p.exams[0].id, "x1", "exam record preserved");
  eq(p.best.score, 7, "loads exam best score");
  eq(p.best.total, 10, "loads exam best total");
  eq(p.awarded["clear:m1"], 60, "loads awarded-reward ledger (clear:m1=60)");
  eq(p.awarded["q:t1-01"], 4, "loads awarded-reward ledger (q:t1-01=4)");
  eq(p.days["2023-11-14"], 3, "loads streak day counters");
  eq(p.goal, 12, "loads daily goal");
  check(store.getItem("mm-mt203-v1") === before, "loading progress does NOT rewrite storage");
  eq(P.totalXp(p), 64, "total XP equals the ledger sum (64)");
  eq(P.rankFor(P.totalXp(p)).name, "Novice", "rank derives from the preserved ledger");
}

// -------------------------------------------- correct / retry / reload flows
{
  let p = P.loadProgress();
  const beforeXp = P.totalXp(p);

  p = P.recordAnswer(p, "t1-05", "b", true, "learn", 0);
  const first = P.awardAnswer(p, "t1-05", 2, true);
  p = first.progress;
  check(first.xp > 0, "first correct answer awards XP");
  const stored = JSON.parse(store.getItem("mm-mt203-v1"));
  eq(stored.awarded["q:t1-05"], first.xp, "award persists to mm-mt203-v1");
  eq(stored.awarded["clear:m1"], 60, "award keeps the pre-existing ledger");
  eq(stored.best.score, 7, "award keeps the exam best");

  // retry: the same question answered again must not pay twice
  p = P.recordAnswer(p, "t1-05", "b", true, "practice", 0);
  const retry = P.awardAnswer(p, "t1-05", 2, true);
  eq(retry.xp, 0, "re-answering the same question pays no XP again");
  eq(P.totalXp(retry.progress), beforeXp + first.xp, "total XP unchanged by the retry");

  // reload: idempotent across a fresh load
  const reloaded = P.loadProgress();
  eq(reloaded.awarded["q:t1-05"], first.xp, "awarded id survives a reload");
  const afterReload = P.awardAnswer(reloaded, "t1-05", 2, true);
  eq(afterReload.xp, 0, "awardAnswer is idempotent across reloads");
  const stored2 = JSON.parse(store.getItem("mm-mt203-v1"));
  eq(stored2.attempts.filter((a) => a.q === "t1-05").length, 2, "retry history is preserved (2 attempts)");
}

// ------------------------------------------------------------ wrong-answer flow
{
  let p = P.loadProgress();
  p = P.recordAnswer(p, "t1-06", "a", false, "learn", 0);
  const r = P.awardAnswer(p, "t1-06", 3, false);
  eq(r.xp, 0, "a wrong answer never awards XP");
  const stats = P.questionStats(r.progress, META.ALL_QUESTION_IDS);
  eq(stats["t1-06"].seen, true, "wrong answer marks the question seen");
  eq(stats["t1-06"].correct, 0, "wrong answer leaves the streak at 0");
  eq(P.dueInDays(stats["t1-06"]), 0, "a just-missed question is due immediately");
}

// ------------------------------------------------------- mastery + revision
{
  let p = P.loadProgress();
  // t1-01 has one correct attempt in the fixture; one more masters it.
  const before = P.questionStats(p, META.ALL_QUESTION_IDS)["t1-01"].mastered;
  eq(before, false, "one correct attempt does not yet master");
  p = P.recordAnswer(p, "t1-02", "a", true, "practice", 0); // unrelated
  p = P.recordAnswer(p, "t1-01", "a", true, "practice", 0);
  const after = P.questionStats(p, META.ALL_QUESTION_IDS)["t1-01"].mastered;
  eq(after, true, "two consecutive correct attempts master a question");

  const ids = P.selectRevision(p, META.ALL_QUESTION_IDS, 10);
  check(ids.length > 0, "spaced revision selects from seen questions");
  const seen = new Set(p.attempts.map((a) => a.q));
  check(ids.every((id) => seen.has(id)), "revision only re-serves questions with history");
  check(new Set(ids).size === ids.length, "revision never repeats a question in one set");

  const agg = P.topicAggregate(p, META.TOPIC_OF, META.ALL_QUESTION_IDS);
  check(agg.t1.done >= 3, "topic aggregate reflects preserved history");
  check(agg.t1.total === 32, "topic aggregate uses the full topic count");
}

// --------------------------------------------------------- exam-completion flow
{
  let p = P.loadProgress();
  const before = p.exams.length;
  p = P.recordExam(p, {
    id: "x2",
    ts: NOW,
    label: "Whole course",
    total: 20,
    correct: 15,
    ms: 1200000,
    breakdown: { m1: { done: 10, right: 8 }, m2: { done: 10, right: 7 } },
  });
  eq(p.exams.length, before + 1, "exam record appended");
  eq(p.exams[0].id, "x2", "newest exam is first");
  eq(p.best.score, 15, "best updated to the better score");
  const stored = JSON.parse(store.getItem("mm-mt203-v1"));
  eq(stored.exams[0].id, "x2", "exam history persists");
  // a worse exam must not lower the best
  const p2 = P.recordExam(p, { id: "x3", ts: NOW + 1000, label: "M2", total: 20, correct: 3, ms: 1000, breakdown: {} });
  eq(p2.best.score, 15, "a worse exam does not lower the best");
  eq(p2.exams[0].id, "x3", "the worse exam is still recorded");
}

// -------------------------------------------- idempotent module bonus ledger
{
  const p0 = P.loadProgress();
  const r1 = P.awardOnce(p0, "clear:m2", 120);
  eq(r1.xp, 120, "awardOnce pays a new key once");
  eq(r1.progress.awarded["clear:m2"], 120, "module-clear award keyed by module id");
  const r2 = P.awardOnce(r1.progress, "clear:m2", 120);
  eq(r2.xp, 0, "awardOnce never pays the same key twice");
  const r3 = P.awardOnce(P.loadProgress(), "clear:m2", 120);
  eq(r3.xp, 0, "awardOnce is idempotent across reloads");

  const s1 = settleModuleBonuses(r1.progress);
  const s2 = settleModuleBonuses(s1.progress);
  eq(s2.xp, 0, "settleModuleBonuses pays nothing on a second run");
  const stored = JSON.parse(store.getItem("mm-mt203-v1"));
  eq(stored.awarded["clear:m2"], 120, "settled award persists to mm-mt203-v1");
}

// ------------------------------------------------------- theory-read + goal
{
  let p = P.loadProgress();
  const before = p.theoryRead.length;
  p = P.markTheoryRead(p, "m1:t1.3");
  eq(p.theoryRead.length, before + 1, "markTheoryRead adds a new section key");
  const again = P.markTheoryRead(p, "m1:t1.3");
  eq(again.theoryRead.length, before + 1, "markTheoryRead is idempotent");
  const goal = P.setGoal(P.loadProgress(), 20);
  eq(goal.goal, 20, "setGoal updates the daily goal");
}

// ------------------------------------------------------ registry outline + ids
{
  const outline = adapter.outline();
  eq(outline.courseId, "mt203", "adapter.courseId is mt203");
  eq(outline.units.length, 4, "outline has 4 units");
  eq(outline.topics.length, 11, "outline has 11 topics");
  eq(outline.totalQuestions, 286, "outline total is 286 questions");
  eq(outline.totalQuestions, META.TOTAL_QUESTIONS, "outline total matches the qbank meta");
  eq(
    outline.topics.map((t) => t.id).join(","),
    META.TOPIC_META.map((t) => t.id).join(","),
    "outline topic order matches the qbank meta"
  );
  eq(
    outline.units.map((u) => u.id).join(","),
    META.MODULE_META.map((m) => m.id).join(","),
    "manifest unit order matches MODULE_META"
  );
  for (const u of manifest.units) {
    const mu = META.MODULE_META.find((m) => m.id === u.id);
    eq(u.num, mu.num, `${u.id}: module number matches MODULE_META`);
    eq(
      u.topicIds.join(","),
      mu.topics.map((t) => t.id).join(","),
      `${u.id}: topic grouping matches MODULE_META`
    );
  }
}

// -------------------------------------------- question parity (field by field)
{
  let total = 0;
  for (const t of manifest.topics) {
    const content = await adapter.loadTopic(t.id);
    const raw = (await import(`../app/data/qbank/${t.id}.ts`)).default;
    eq(content.questions.length, raw.questions.length, `${t.id}: question count matches source`);
    eq(content.questions.length, t.count, `${t.id}: count matches manifest`);
    total += raw.questions.length;
    let bad = 0;
    raw.questions.forEach((rq, i) => {
      const cq = content.questions[i];
      const same =
        cq.id === rq.id &&
        cq.n === i + 1 &&
        cq.topicId === t.id &&
        cq.type === rq.type &&
        cq.difficulty === rq.diff &&
        cq.rawDifficulty === rq.diff &&
        cq.answer === rq.answer &&
        JSON.stringify(cq.options) === JSON.stringify(rq.options) &&
        cq.solution.keyExplanation === rq.why &&
        JSON.stringify(cq.solution.distractors) === JSON.stringify(rq.distractors) &&
        cq.solution.concept === rq.concept &&
        JSON.stringify(cq.tags) === JSON.stringify(rq.tags) &&
        cq.timedOk === rq.timedOk &&
        cq.text === rq.text &&
        JSON.stringify(cq.statements) === JSON.stringify(rq.statements) &&
        JSON.stringify(cq.tableRows) === JSON.stringify(rq.tableRows) &&
        cq.assertion === rq.assertion &&
        cq.reason === rq.reason;
      if (!same) bad++;
    });
    eq(bad, 0, `${t.id}: all ${raw.questions.length} questions map losslessly`);
  }
  eq(total, 286, "all 286 questions compared");
}

// ------------------------------------------------------------------- lessons
{
  const ids = Object.keys(LESSONS);
  eq(ids.length, 11, "11 lessons in the source");
  let bad = 0;
  for (const id of ids) {
    const raw = LESSONS[id];
    const can = MT203_LESSONS[id];
    const viaAdapter = await adapter.loadTopic(id);
    if (!can || !viaAdapter.lesson) {
      bad++;
      continue;
    }
    if (
      can.title !== raw.title ||
      can.subtitle !== raw.subtitle ||
      can.aim !== raw.aim ||
      can.formulas.length !== raw.formulas.length ||
      JSON.stringify(can.memorise) !== JSON.stringify(raw.memorise) ||
      can.sections.length !== raw.sections.length
    ) {
      bad++;
      continue;
    }
    raw.formulas.forEach((f, i) => {
      const cf = can.formulas[i];
      if (
        cf.name !== f.name ||
        cf.expr !== f.expr ||
        cf.note !== f.note ||
        JSON.stringify(cf.vars) !== JSON.stringify(f.vars)
      )
        bad++;
    });
    raw.sections.forEach((s, i) => {
      if (can.sections[i].heading !== s.h || can.sections[i].body !== s.p) bad++;
    });
    // the entry's bundled lessons must equal what the adapter serves
    if (JSON.stringify(viaAdapter.lesson) !== JSON.stringify(can)) bad++;
  }
  eq(bad, 0, "all 11 lessons map losslessly (entry == adapter == source)");
}

// --------------------------------------------------------------- render flows
{
  const t1 = await adapter.loadTopic("t1");

  // study player over canonical questions
  const playerHtml = render(Player, {
    questions: t1.questions.slice(0, 3),
    mode: "learn",
    label: "Fundamentals",
    progress: P.loadProgress(),
    onProgress: () => {},
    onExit: () => {},
  });
  contains(playerHtml, "Question navigator", "Player: navigator renders");
  contains(playerHtml, "1 / 3", "Player: progress chip renders");
  contains(playerHtml, `chip chip-diff${t1.questions[0].difficulty}`, "Player: difficulty chip renders");
  contains(playerHtml, `◆`.repeat(t1.questions[0].difficulty), "Player: difficulty diamonds render");
  contains(playerHtml, t1.questions[0].options[0].text, "Player: first option renders");

  // a question restored from saved progress, with its saved (wrong) pick
  const restored = t1.questions.find((q) => q.id === "t1-02");
  const wrongPick = restored.options.find((o) => o.label !== restored.answer).label;
  const solutionHtml = render(M203.SolutionPanel, { q: restored, picked: wrongPick });
  contains(solutionHtml, "verdict", "restored question: verdict banner renders");
  contains(solutionHtml, "distractor-list", "restored question: distractor feedback renders");

  // exam setup
  const examHtml = render(Exam, { progress: P.loadProgress(), onProgress: () => {} });
  contains(examHtml, "Exam Simulator", "Exam: setup screen renders");
  contains(examHtml, "Whole course", "Exam: whole-course scope renders");
  contains(examHtml, ">M1<", "Exam: unit tab from the manifest renders");

  // practice (async loads on mount; the initial frame must render cleanly)
  const practiceHtml = render(Practice, {
    mode: "mixed",
    scope: "all",
    count: 20,
    progress: P.loadProgress(),
    onProgress: () => {},
    onFinished: () => {},
    onExit: () => {},
  });
  check(practiceHtml.length > 0, "Practice: initial frame renders");
}

// ------------------------------------------------------------- source wiring
{
  const strip = (s) =>
    s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
  const read = (...p) => fs.readFileSync(path.join(root, ...p), "utf8");

  const entry = strip(read("app", "courses", "entries", "mt203.ts"));
  check(/MT203_ENTRY/.test(entry), "entries/mt203.ts exports MT203_ENTRY");
  check(/createMt203Adapter/.test(entry), "entries/mt203.ts binds the canonical adapter");
  check(/MT203_LESSONS/.test(entry), "entries/mt203.ts exports MT203_LESSONS");
  check(!/qbank\/t\d/.test(entry), "entries/mt203.ts does not statically import a question chunk");

  const reg = strip(read("app", "courses", "registry.ts"));
  check(/entries\/mt203/.test(reg), "registry composes the MT203 entry");

  const qv = strip(read("app", "mt203", "qview.tsx"));
  check(qv.includes("../platform/qview"), "mt203/qview.tsx uses the shared renderer");
  check(qv.includes("../courses/types"), "mt203/qview.tsx consumes canonical questions");

  const page = strip(read("app", "mt203", "page.tsx"));
  check(page.includes("../courses/entries/mt203"), "mt203/page.tsx consumes its entry");
  check(!/qbank\/t\d/.test(page), "mt203/page.tsx does not statically import a question chunk");

  const types = read("app", "mt203", "types.ts");
  const dyn = (types.match(/import\(/g) || []).length;
  check(dyn >= 12, `mt203/types.ts keeps per-topic dynamic imports (found ${dyn}, expected >= 12)`);
}

// ------------------------------------------------------------------- console
console.error = origError;
console.warn = origWarn;
check(consoleIssues.length === 0, `no console errors/warnings during render (${consoleIssues.slice(0, 3).join(" | ")})`);

// -------------------------------------------------------------------- summary
console.log(`\nassertions: ${pass} passed, ${failures.length} failed`);
for (const f of failures) console.error(`  ✗ ${f}`);
if (failures.length) {
  console.error("FAILED");
  process.exit(1);
}
console.log("PASS");
