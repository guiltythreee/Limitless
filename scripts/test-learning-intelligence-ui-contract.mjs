import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const cpHtml = read("../competition/index.html");
const cpJs = read("../competition/competition.js");
const cpPractice = read("../competition/practice-recommendations.mjs");
const homeHtml = read("../index.html");
const homeModule = read("../home-learning-intelligence.mjs");
const mathHtml = read("../tools/math/index.html");
const mathJs = read("../tools/math/game.js");
const overview = read("../shared/studies/overview.mjs");
const mathWorkflow = read("../.github/workflows/test-math-trainer.yml");

for (const id of [
  "revision-summary", "revision-upcoming", "revision-queue",
  "problem-search", "problem-filter-subject", "problem-filter-outcome",
  "problem-filter-band", "problem-catalogue-count", "problem-history",
]) assert.ok(cpHtml.includes('id="' + id + '"'), "CP HTML must expose #" + id);

assert.ok(cpJs.includes("state.revisionAttempts.push("), "CP revision actions must record separate attempts");
assert.ok(cpJs.includes("codeforcesSyncPromise"), "Competition intelligence must load the archive-aware Codeforces reader");
assert.ok(cpJs.includes("readCodeforcesSyncState(localStorage)"), "Competition revision insights must consume the complete decoded attempt history");
assert.ok(homeModule.includes("readCodeforcesSyncState(window.localStorage)"), "homepage intelligence must include archived Codeforces attempts");

assert.ok(cpJs.includes("if (button.disabled) return;"), "CP revision actions must prevent double submissions");
assert.ok(cpJs.includes("practiceRecommendationsPromise"), "CP catalogue must load targeted practice links");
assert.ok(cpJs.includes("data-revision-result"), "CP revision queue must expose result actions");
assert.ok(cpJs.includes("var openTopicStudies = {};"), "roadmap must capture expanded topic accordions before re-rendering");
assert.ok(cpJs.includes("data-topic-study"), "topic accordions must have stable keys for open-state restoration");
assert.ok(cpJs.includes("var openDailyDays = {};"), "roadmap must capture expanded daily-plan days before re-rendering");
assert.ok(cpJs.includes("data-daily-detail"), "daily-plan days must have stable keys for open-state restoration");
assert.ok(cpJs.includes("openCompartments[compartmentKey] = details.open;"), "all week compartments, including Topic mastery, must preserve their open state");
assert.ok(!cpJs.includes("if (!/-mastery$/.test(compartmentKey))"), "Topic mastery must not be excluded from accordion state restoration");

assert.ok(cpJs.includes("Invalid backup"), "CP import must reject malformed revision history");
assert.ok(cpPractice.includes("https://codeforces.com/problemset?tags="));
assert.ok(cpPractice.includes("https://cses.fi/problemset/task/"));

assert.ok(homeHtml.includes('id="learning-intelligence-content"'));
assert.ok(homeModule.includes('tools/math/index.html'), "homepage focus must use the current Math Trainer route");

assert.ok(mathHtml.includes('id="math-learning-insights"'));
assert.ok(mathJs.includes("import('./learning-intelligence.mjs')"));
assert.ok(mathJs.includes("independent: !showHint"));
assert.ok(mathJs.includes("mistakeCategory: a.mistakeCategory || undefined"));
assert.ok(mathJs.includes("persistMistakeClassification"));

assert.ok(overview.includes("../../tools/math/learning-intelligence.mjs"));
assert.ok(!overview.includes("math-refactored"), "shared overview must not import the retired Math Trainer path");
assert.ok(mathWorkflow.includes("tools/math/tests/learning-intelligence.test.mjs"));
assert.ok(mathWorkflow.includes("node --check tools/math/game.js"));

console.log("Learning-intelligence UI contracts: all assertions passed.");
