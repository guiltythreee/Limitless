import assert from "node:assert/strict";
import {
  summarizeStudyProgress,
  uniquePathwayContentRefs,
  validateStudyRegistration,
  validateStudyRegistry,
} from "./registry.ts";

const probability = {
  descriptor: {
    id: "probability",
    title: "Probability",
    description: "Probability curriculum",
    route: "/probability",
    status: "active",
    capabilities: ["theory", "examples", "practice", "assessment", "revision", "bookmarks", "drafts", "timers", "attempt-history", "analytics", "goals", "mastery"],
  },
  content: [
    { id: "sample-space", disciplineId: "probability", kind: "lesson" },
    { id: "conditional", disciplineId: "probability", kind: "lesson" },
    { id: "bayes", disciplineId: "probability", kind: "lesson" },
  ],
  pathways: [
    { id: "statistics", disciplineId: "probability", title: "Statistics", contentIds: ["sample-space", "conditional", "bayes"] },
    { id: "quant-finance", disciplineId: "probability", title: "Quant Finance", contentIds: ["sample-space", "conditional"] },
  ],
  readProgress: () => [
    { contentId: "sample-space", status: "completed" },
    { contentId: "conditional", status: "in-progress" },
  ],
};

const mt201 = {
  descriptor: {
    id: "mt201",
    title: "MT201",
    description: "Question-led course",
    route: "/metallurgy/mt201",
    status: "active",
    capabilities: ["practice", "assessment", "revision", "bookmarks", "timers", "attempt-history", "analytics", "goals"],
  },
  content: [{ id: "ch01", disciplineId: "mt201", kind: "topic" }],
  pathways: [],
};

assert.deepEqual(validateStudyRegistration(probability), []);
assert.deepEqual(validateStudyRegistration(mt201), []);
assert.deepEqual(validateStudyRegistry([probability, mt201]), []);
assert.deepEqual(uniquePathwayContentRefs([probability]), [
  { disciplineId: "probability", contentId: "sample-space" },
  { disciplineId: "probability", contentId: "conditional" },
  { disciplineId: "probability", contentId: "bayes" },
]);
const otherDiscipline = {
  descriptor: { id: "statistics", title: "Statistics", description: "Statistics", route: "/statistics", status: "active", capabilities: [] },
  content: [{ id: "sample-space", disciplineId: "statistics", kind: "lesson" }],
  pathways: [{ id: "intro", disciplineId: "statistics", title: "Intro", contentIds: ["sample-space"] }],
};
assert.equal(uniquePathwayContentRefs([probability, otherDiscipline]).length, 4);
assert.deepEqual(summarizeStudyProgress(probability), {
  totalContent: 3,
  completed: 1,
  inProgress: 1,
  notStarted: 0,
  unknown: 1,
  snapshots: [
    { contentId: "sample-space", status: "completed" },
    { contentId: "conditional", status: "in-progress" },
  ],
});

const broken = {
  ...probability,
  pathways: [
    ...probability.pathways,
    { id: "bad", disciplineId: "probability", title: "Bad route", contentIds: ["missing"] },
  ],
};
assert.ok(validateStudyRegistration(broken).some((error) => error.includes("unknown content")));
assert.ok(validateStudyRegistry([probability, probability]).some((error) => error.includes("duplicate discipline id")));

console.log("Studies registry contract: 8 checks passed");
