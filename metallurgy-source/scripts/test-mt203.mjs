#!/usr/bin/env node
// scripts/test-mt203.mjs
//
// Unit tests for the MT203 progress engine. Imports the real .ts modules
// (Node's native type-stripping) and provides a tiny in-memory localStorage so
// the load/sanitise/record paths are exercised exactly as in the browser.
//
// Run: node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/test-mt203.mjs

// ---- minimal localStorage so the module's window guards pass ----------------
const store = new Map();
globalThis.window = {
  localStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  },
};

const P = await import("../app/lib/mt203-progress.ts");
const M = await import("../app/data/qbank/meta.ts");

let passed = 0;
let failed = 0;
const ok = (cond, msg) => {
  if (cond) {
    passed++;
  } else {
    failed++;
    console.error(`  ✗ ${msg}`);
  }
};
const eq = (a, b, msg) => ok(a === b, `${msg} (got ${JSON.stringify(a)}, want ${JSON.stringify(b)})`);
const section = (s) => console.log(`\n${s}`);

const KEY = "mm-mt203-v1";
/** A clean progress object, with the backing store emptied first. */
const fresh = () => {
  store.clear();
  return P.loadProgress();
};

// ---- sanitisation -----------------------------------------------------------
section("sanitise / load");
store.set(KEY, "{not valid json");
let p = P.loadProgress();
eq(p.attempts.length, 0, "malformed JSON → empty attempts");
eq(p.goal, P.DEFAULT_GOAL, "malformed JSON → default goal");

store.set(
  KEY,
  JSON.stringify({
    attempts: [
      {},
      { q: 1, picked: "a", correct: true, ts: 5 },
      { q: "t1-01", picked: "a", correct: true, ts: 111 },
      { q: "t1-02", picked: "b", correct: "yes", ts: 222 },
      { q: "t1-03", picked: "c", correct: false, ts: 333, mode: "bogus", ms: -9 },
    ],
    awarded: { "q:t1-01": 4, bad: "x", "q:t1-02": 8 },
    days: { "2026-01-01": 3, nope: 4 },
    goal: -5,
    theoryRead: ["t1", 42],
    exams: [{ id: "e1", ts: 1 }, { oops: true }],
  }),
);
p = P.loadProgress();
eq(p.attempts.length, 2, "drops invalid attempts");
eq(p.attempts[0].q, "t1-01", "keeps valid attempt");
eq(p.attempts[1].mode, "practice", "unknown mode → practice");
eq(p.attempts[1].ms, 0, "negative ms → 0");
eq(Object.keys(p.awarded).length, 2, "drops non-numeric ledger entries");
eq(p.days["2026-01-01"], 3, "keeps valid day");
eq(Object.keys(p.days).length, 1, "drops bogus day");
eq(p.goal, P.DEFAULT_GOAL, "clamps bad goal");
eq(p.theoryRead.length, 1, "filters theoryRead");
eq(p.exams.length, 1, "filters exams");

// ---- recordAnswer -----------------------------------------------------------
section("recordAnswer");
p = fresh();
p = P.recordAnswer(p, "t1-01", "a", true, "learn", 1200);
p = P.recordAnswer(p, "t1-01", "b", false, "learn", 800);
eq(p.attempts.length, 2, "history preserved");
eq(P.lastAttempt(p, "t1-01").picked, "b", "last attempt wins");
eq(P.latestByQuestion(p)["t1-01"].correct, false, "latestByQuestion reflects newest");
ok(Object.keys(p.days).length === 1, "one day bucket");

// ---- awardOnce idempotency --------------------------------------------------
section("awardOnce");
p = fresh();
let a = P.awardOnce(p, "clear:m1", 60);
eq(a.xp, 60, "first award pays");
p = a.progress;
a = P.awardOnce(p, "clear:m1", 60);
eq(a.xp, 0, "second award pays nothing");
eq(P.totalXp(a.progress), 60, "ledger holds one entry");

// ---- awardAnswer ------------------------------------------------------------
section("awardAnswer");
p = fresh();
let r = P.awardAnswer(p, "t1-01", 3, false);
eq(r.xp, 0, "wrong answer pays nothing");
p = r.progress;
r = P.awardAnswer(p, "t1-01", 3, true);
eq(r.xp, P.xpForQuestion(3), "first correct pays scaled XP");
p = r.progress;
r = P.awardAnswer(p, "t1-01", 3, true);
eq(r.xp, 0, "repeat correct pays nothing");
eq(P.totalXp(p), P.xpForQuestion(3), "no farming");

// ---- questionStats & mastery ------------------------------------------------
section("questionStats");
p = fresh();
const ids = ["t1-01", "t1-02"];
p = P.recordAnswer(p, "t1-01", "a", true);
p = P.recordAnswer(p, "t1-01", "a", true);
p = P.recordAnswer(p, "t1-02", "a", true);
p = P.recordAnswer(p, "t1-02", "b", false);
const st = P.questionStats(p, ids);
eq(st["t1-01"].attempts, 2, "attempt count");
eq(st["t1-01"].mastered, true, "two in a row masters a question");
eq(st["t1-02"].mastered, false, "a miss resets the run");

// ---- dueInDays & selectRevision --------------------------------------------
section("spaced revision");
p = fresh();
const old = Date.now() - 10 * 86_400_000;
p = { ...p, attempts: [
  { q: "t1-01", picked: "a", correct: true, mode: "learn", ms: 0, ts: old },
  { q: "t1-02", picked: "b", correct: false, mode: "learn", ms: 0, ts: old },
] };
const stats = P.questionStats(p, ["t1-01", "t1-02", "t1-03"]);
ok(P.dueInDays(stats["t1-01"]) <= 0, "long-past correct answer is due");
eq(P.dueInDays(stats["t1-03"]) < 0, false, "unseen is due now (0)");
const rev = P.selectRevision(p, ["t1-01", "t1-02", "t1-03"], 10);
ok(rev.includes("t1-01") && rev.includes("t1-02"), "revision serves seen questions");
ok(!rev.includes("t1-03"), "revision excludes never-seen questions");
eq(new Set(rev).size, rev.length, "no duplicates in a revision set");

// ---- topicAggregate & weak detection ---------------------------------------
section("topicAggregate");
p = fresh();
const manyIds = Array.from({ length: 6 }, (_, i) => `t1-0${i + 1}`);
for (const id of manyIds) p = P.recordAnswer(p, id, "a", id === "t1-01"); // 1/6 right
const tOf = Object.fromEntries(manyIds.map((id) => [id, "t1"]));
let agg = P.topicAggregate(p, tOf, manyIds);
eq(agg.t1.done, 6, "all attempted");
eq(agg.t1.weak, true, "poor accuracy flags weak");

// ---- moduleAgg --------------------------------------------------------------
section("moduleAgg");
p = fresh();
const mids = Array.from({ length: 10 }, (_, i) => `t9-${String(i + 1).padStart(2, "0")}`);
const mOf = Object.fromEntries(mids.map((id) => [id, "t9"]));
let ma = P.moduleAgg(p, "mX", mids, mOf, ["t9"]);
eq(ma.clear, false, "not cleared with no attempts");
eq(ma.mastery, false, "no mastery with no attempts");
for (const id of mids) p = P.recordAnswer(p, id, "a", true);
ma = P.moduleAgg(p, "mX", mids, mOf, ["t9"]);
eq(ma.clear, true, "cleared when every question attempted");
eq(ma.mastery, true, "mastery when 40%/70%/75% all met");

// ---- streak -----------------------------------------------------------------
section("streak");
p = fresh();
const day = 86_400_000;
const now = Date.now();
const d0 = P.dayKey(now);
const d1 = P.dayKey(now - day);
p = { ...p, goal: 2, days: { [d1]: 2, [d0]: 5 } };
const s = P.streakInfo(p, now);
eq(s.streak, 2, "consecutive qualifying days");

// ---- rank & goal ------------------------------------------------------------
section("rank & goal");
eq(P.rankFor(0).name, "Novice", "rank floor");
eq(P.rankFor(100000).next, null, "top rank has no next");
eq(P.setGoal(fresh(), 999).goal, 200, "goal clamped to 200");
eq(P.setGoal(fresh(), 0).goal, P.DEFAULT_GOAL, "goal falls back to default");

// ---- meta helpers -----------------------------------------------------------
section("meta helpers");
eq(M.topicQuestionIds("t4", 3).join(","), "t4-01,t4-02,t4-03", "id generation");
eq(M.TOPIC_OF["t10-07"], "t10", "TOPIC_OF handles two-digit topics");
eq(M.moduleQuestionIds("m1").length, 178, "m1 question count");
eq(M.ALL_QUESTION_IDS.length, M.TOTAL_QUESTIONS, "all ids match total");
eq(M.moduleOfTopic("t11"), "m4", "moduleOfTopic");

// ---- summary ----------------------------------------------------------------
console.log(`\n${failed === 0 ? "PASS" : "FAIL"} — ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
