import assert from "node:assert/strict";
import {
  analyzeMetallurgyLearning,
  metallurgyActivityKey,
  toMetallurgyLearningAttempts,
} from "./intelligence.ts";

const topics = [{ id: "ch01", title: "Crystal Structures" }];
const activities = Array.from({ length: 8 }, (_, index) => ({
  courseId: "mt202",
  q: "ch01-q" + (index + 1),
  topicId: "ch01",
  picked: "A",
  correct: index !== 7,
  mode: "practice",
  ms: 1000 + index,
  ts: 1_800_000_000_000 + index * 1000,
  source: "recorded",
}));
activities.push({ ...activities[0], q: "legacy-q", ts: 0, correct: false });
const failed = activities[7];
const classifications = {
  [metallurgyActivityKey(failed)]: { category: "conceptual", reviewedAt: 1_800_000_100_000 },
};

const adapted = toMetallurgyLearningAttempts(activities, topics, classifications);
assert.equal(adapted.length, 8);
assert.equal(adapted[0].disciplineId, "metallurgy");
assert.equal(adapted[0].conceptIds[0], "Crystal Structures");
assert.equal(adapted[0].independent, true);
assert.equal(adapted[0].hintCount, 0);
assert.equal(adapted[7].mistakeCategory, "conceptual");
assert.equal(adapted[7].reviewedAt, 1_800_000_100_000);

const report = analyzeMetallurgyLearning(activities, topics, classifications);
assert.equal(report.mastery.length, 1);
assert.equal(report.mastery[0].status, "secure");
assert.equal(report.recurringMistakes.length, 1);
assert.equal(report.recurringMistakes[0].occurrences, 1);
assert.equal(activities.length, 9, "adapter must not mutate course activity history");

console.log("Metallurgy learning adapter: all assertions passed.");
