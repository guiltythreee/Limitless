import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const js = await readFile(new URL("./competition.js", import.meta.url), "utf8");
const html = await readFile(new URL("./index.html", import.meta.url), "utf8");
const css = await readFile(new URL("./competition.css", import.meta.url), "utf8");
const sync = await readFile(new URL("./codeforces-sync.mjs", import.meta.url), "utf8");

assert.match(html, /id="today-panel"/);
assert.match(js, /function renderToday\(\)/);
assert.match(js, /'w' \+ \(wi \+ 1\) \+ '-exec2-' \+ day\.id \+ '-'/,
  "today view must reuse the existing weekly execution checklist key namespace");
assert.match(js, /state\.dayChecks\[input\.dataset\.todayTask\] = input\.checked/);
assert.match(js, /data-week-index="' \+ wi \+ '"/);
assert.match(js, /data-week-compartment="w' \+ \(wi \+ 1\) \+ '-schedule"/);
assert.match(css, /\.today-panel/);
assert.match(js, /renderToday\(\);\s*renderWeeks\(\);/,
  "updating a daily task from the Today panel must refresh both synchronized views");

assert.match(js, /function renderTodayReviewSummary\(\)/,
  "the Today panel must include a summary of due Codeforces revisions");
assert.match(js, /renderTodayReviewSummary\(\);/,
  "the due-review summary must refresh whenever the Today panel renders");
assert.match(js, /analysis\.recurringMistakes\.slice\(0, 3\)/,
  "the CP dashboard must render recurring concept-and-cause mistake patterns");
assert.match(js, /getPracticeRecommendations\(item\.subjectId, item\.conceptLabel\)/,
  "recurring mistakes must link to curated practice for the same concept");
assert.match(js, /mistakeGuidance\[item\.category\]/,
  "each recurring mistake category must produce a targeted repair instruction");
assert.match(css, /\.mistake-repair-row/,
  "targeted mistake repairs must use the dedicated compact layout");

assert.match(js, /id="codeforces-revision"/,
  "the Today panel summary must link to the existing Codeforces revision queue");
assert.match(js, /today-review-summary/,
  "the due-review summary must be a non-checkbox workload item");
assert.match(sync, /limitless\.competition\.codeforces-learning\.v1/,
  "the summary must read the existing Codeforces learning record");


assert.match(js, /data-codeforces-revision-result="correct"/,
  "due Codeforces reviews must allow an independent-solve result");
assert.match(js, /data-codeforces-revision-result="incorrect"/,
  "due Codeforces reviews must allow a still-stuck result");
assert.match(sync, /mode: "revision"/,
  "Codeforces re-solves must enter the shared revision evidence stream");
assert.match(sync, /limitless\.competition\.codeforces-learning\.v1/,
  "Codeforces revision results must be saved with the existing sync record");
assert.match(js, /limitless:codeforces-learning-updated/,
  "saving a Codeforces revision must refresh shared mastery and scheduling");
assert.match(js, /appendCodeforcesRevisionAttempt\(/,
  "manual Codeforces revision feedback must use the archive-aware persistence helper");
assert.match(sync, /attemptsArchive: encodeCodeforcesAttemptArchive/,
  "manual revisions must preserve the compact archive when the recent window rolls forward");
assert.match(css, /\.revision-actions/,
  "Codeforces revision controls must reuse the existing revision action layout");

console.log("Competition Today panel contract: all assertions passed.");
