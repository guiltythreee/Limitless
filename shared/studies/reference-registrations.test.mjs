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

console.log("Reference Studies registrations: 11 checks passed");
