import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const page = readFileSync(resolve(root, "probability-source/app/studies/page.tsx"), "utf8");
const css = readFileSync(resolve(root, "probability-source/app/studies/probability-landing.css"), "utf8");

assert.ok(page.includes('import "./probability-landing.css"'), "Probability landing loads its scoped visual layer");
assert.ok(page.includes('className="probability-studies-page'), "visual overrides are scoped to the Probability landing");
assert.ok(page.includes('className="probability-studies-hero'), "hero has a dedicated visual boundary");
assert.ok(page.includes('className="probability-studies-progress'), "progress dashboard has a dedicated visual boundary");
assert.ok(page.includes('className="probability-studies-grid'), "resource panels share a responsive grid");
assert.equal((page.match(/className="probability-studies-card/g) ?? []).length, 4, "all four dashboard cards use the refreshed card system");

for (const phrase of [
  "PROBABILITY_STUDIES_REGISTRATION.readProgress",
  "summarizeStudyProgress",
  "Read from your existing browser progress",
  "allQuestions.length",
  "pathways.map",
  "practiceHref(view)",
  'href="/book-01/"',
  'href="/book-02/"',
]) {
  assert.ok(page.includes(phrase), `existing Probability landing behavior remains present: ${phrase}`);
}
for (const token of [
  "--pa-accent: #69b5ff",
  "linear-gradient(112deg",
  ".probability-studies-card:hover",
  "@media (max-width: 600px)",
  "@media (prefers-reduced-motion: reduce)",
  ':root[data-theme="light"] .probability-studies-page',
]) {
  assert.ok(css.includes(token), `Probability visual layer includes ${token}`);
}
assert.ok(!css.includes("goldhi"), "the refreshed landing does not introduce gold hover styling");
console.log("Probability Archive landing visual contract: 17 assertions passed");
