import assert from "node:assert/strict";
import {
  summarizeStudyProgress,
  uniquePathwayContentRefs,
  validateStudyRegistry,
} from "./registry.ts";
import { PROBABILITY_STUDIES_REGISTRATION } from "../../probability-source/app/studies/registration.ts";
import { METALLURGY_STUDIES_REGISTRATION } from "../../metallurgy-source/app/studies/registration.ts";

const registrations = [
  PROBABILITY_STUDIES_REGISTRATION,
  METALLURGY_STUDIES_REGISTRATION,
];

assert.deepEqual(validateStudyRegistry(registrations), []);

const probability = PROBABILITY_STUDIES_REGISTRATION;
assert.equal(probability.pathways.length, 5);
assert.ok(probability.content.some((item) => item.id === "sample-space" && item.kind === "lesson"));
const probabilityAppearances = probability.pathways.reduce((sum, pathway) => sum + pathway.contentIds.length, 0);
const probabilityUnique = uniquePathwayContentRefs([probability])
  .filter((item) => item.disciplineId === "probability").length;
assert.ok(probabilityUnique < probabilityAppearances, "overlapping pathways must reuse canonical Probability lessons");

const metallurgy = METALLURGY_STUDIES_REGISTRATION;
const courses = metallurgy.content.filter((item) => item.kind === "course");
assert.deepEqual(courses.map((item) => item.id), ["mt201", "mt202", "mt203"]);
const mt201 = courses.find((item) => item.id === "mt201");
const mt202 = courses.find((item) => item.id === "mt202");
const mt203 = courses.find((item) => item.id === "mt203");
assert.ok(!mt201.capabilities.includes("theory"), "MT201 must not advertise a theory reader");
assert.ok(mt202.capabilities.includes("theory"), "MT202 theory capability must be retained");
assert.ok(mt203.capabilities.includes("revision") && mt203.capabilities.includes("mastery"), "MT203 specialist capabilities must be retained");
assert.ok(!metallurgy.descriptor.capabilities.includes("theory"), "discipline-level capabilities must not overstate every course");

const summary = summarizeStudyProgress(probability);
assert.equal(summary.totalContent, probability.content.length);
assert.equal(summary.unknown, probability.content.length, "registration must not read or invent progress on load");

// Progress adapters must read canonical payloads without invoking any writer.
const records = new Map([
  ["hc3-progress-v3", JSON.stringify({
    completed: ["sample-space"],
    attempts: [{ q: "known-question", ts: 100 }],
  })],
  ["mm-mt201-v1", JSON.stringify({
    answered: { "ch01-q1": { choice: "A", correct: true, at: 123 } },
  })],
]);
let writes = 0;
globalThis.window = {
  localStorage: {
    getItem(key) { return records.has(key) ? records.get(key) : null; },
    setItem() { writes++; throw new Error("progress projection must never write"); },
  },
};

const probabilitySnapshots = probability.readProgress();
const probabilityLesson = probabilitySnapshots.find((item) => item.contentId === "sample-space");
assert.equal(probabilityLesson?.status, "completed");
assert.ok(probabilitySnapshots.some((item) => item.contentId === "probability-course" && item.status === "in-progress"));

const metallurgySnapshots = metallurgy.readProgress();
assert.ok(metallurgySnapshots.some((item) => item.contentId === "mt201:ch01" && item.status === "in-progress"));
assert.ok(metallurgySnapshots.some((item) => item.contentId === "mt201" && item.status === "in-progress"));
assert.ok(metallurgySnapshots.some((item) => item.contentId === "mt202" && item.status === "not-started"));

records.set("hc3-progress-v3", "{malformed");
assert.deepEqual(probability.readProgress(), [], "malformed Probability data must remain unknown");
records.set("mm-mt201-v1", "[]");
assert.ok(!metallurgy.readProgress().some((item) => item.contentId === "mt201"), "malformed course data must remain unknown");
assert.equal(writes, 0, "read-only projections must never persist, migrate, or initialise data");

console.log("Reference Studies registrations and read-only progress: checks passed");
