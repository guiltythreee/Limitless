import assert from "node:assert/strict";
import { buildRewardRecords, REWARD_POLICY_VERSION } from "./rewards.mjs";

const DAY = 86_400_000;
const monday = new Date(2026, 9, 26, 12, 0, 0).getTime();
let records = [];

function activity(input) {
  const built = buildRewardRecords(input, records);
  records.push(...built);
  return built;
}
function expFor(moduleId) {
  return records
    .filter((record) => record.moduleId === moduleId && record.eligible && record.totalExp > 0)
    .reduce((sum, record) => sum + record.totalExp, 0);
}

// A transparent synthetic "regular study week", excluding unusual full-book
// and full-pathway milestones so routine effort across modules is comparable.
for (let page = 0; page < 10; page++) {
  activity({
    eventId: `bookkeys:calibration:page:${page}`,
    moduleId: "bookkeys",
    itemId: `bookkeys:page:passage-${String(page).padStart(4, "0")}`,
    ts: monday + page * DAY,
    activityClass: "standard-task",
    difficulty: "foundational",
    completionEvidence: "finished-substantial-typed-page",
    completed: true,
    quality: 1,
  });
}

for (let session = 0; session < 3; session++) {
  activity({
    eventId: `math-trainer:calibration:session:${session}`,
    moduleId: "math-trainer",
    itemId: "math-run:drill:adept:general",
    ts: monday + session * 2 * DAY,
    activityClass: "focused-practice",
    difficulty: "intermediate",
    completionEvidence: "completed-substantive-session",
    completed: true,
    quality: 0.9,
  });
}
activity({
  eventId: "math-trainer:calibration:assessment",
  moduleId: "math-trainer",
  itemId: "math-run:test80:adept",
  ts: monday + 5 * DAY,
  activityClass: "assessment",
  difficulty: "intermediate",
  completionEvidence: "completed-qualified-assessment",
  completed: true,
  quality: 0.9,
  passed: true,
  checkpointId: "math-tier-clear:adept",
});

for (let question = 0; question < 10; question++) {
  activity({
    eventId: `probability:calibration:attempt:${question}`,
    moduleId: "probability",
    itemId: `question:lesson-a:${question}`,
    ts: monday + Math.floor(question / 2) * DAY,
    activityClass: "micro-practice",
    difficulty: "intermediate",
    completionEvidence: "submitted-answer",
    completed: true,
    quality: 0.9,
  });
}
activity({
  eventId: "probability:calibration:assessment",
  moduleId: "probability",
  itemId: "assessment:calibration-five-question-set",
  ts: monday + 5 * DAY,
  activityClass: "assessment",
  difficulty: "intermediate",
  completionEvidence: "fully-answered-meaningful-assessment",
  completed: true,
  quality: 0.9,
  passed: true,
  checkpointId: "probability:calibration-checkpoint",
});

const expByModule = {
  bookkeys: expFor("bookkeys"),
  "math-trainer": expFor("math-trainer"),
  probability: expFor("probability"),
};
const values = Object.values(expByModule);
const min = Math.min(...values);
const max = Math.max(...values);
const ratio = max / min;
assert.equal(REWARD_POLICY_VERSION, "LSR-1");
assert.ok(values.every((value) => value > 0));
assert.ok(ratio <= 1.25, "Routine-work EXP should remain within 25% in this scenario; observed ratio " + ratio.toFixed(3));
assert.ok(records.some((record) =>
  record.eventId === "lsr1:pass-bonus:math-trainer:math-tier-clear:adept" && record.totalExp === 15
), "the separate first-pass bonus is included once in routine totals");

const result = {
  policy: REWARD_POLICY_VERSION,
  scenario: "Synthetic regular five-day learning week, without rare course/pathway milestones",
  assumptions: {
    bookkeys: "10 substantial newly completed pages (standard-task; one distinct passage per item)",
    mathTrainer: "3 completed focused sessions on separate days and 1 qualified assessment",
    probability: "10 standalone submitted answers and 1 fully answered meaningful assessment",
    excluded: "One-off book, chapter, topic, tier-mastery and pathway-completion milestones; those are audited separately.",
  },
  expByModule,
  totalExp: values.reduce((sum, value) => sum + value, 0),
  minToMaxRatio: Number(ratio.toFixed(3)),
  acceptableMaximumRatio: 1.25,
  result: "PASS",
};
process.stdout.write(JSON.stringify(result, null, 2) + "\n");
