import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const js = await readFile(new URL("./competition.js", import.meta.url), "utf8");
const html = await readFile(new URL("./index.html", import.meta.url), "utf8");
const css = await readFile(new URL("./competition.css", import.meta.url), "utf8");

assert.match(html, /id="daily-plan"/, "the 120-task planner must be a separate section");
assert.match(html, /id="daily-plan-panel"/, "the planner needs its own render host");
assert.doesNotMatch(html, /id="today-panel"/, "the old automatic Today panel must be removed");
assert.match(html, /href="#daily-plan"/, "the planner must have a direct sidebar link");
assert.match(js, /selectedDay: 1/, "the selected task day must be persisted");
assert.match(js, /function dailyPlanCoordinates\(dayNumber\)/);
assert.match(js, /offset % 7/, "task selection must not depend on the current date");
assert.match(js, /Array\.from\(\{length:120\}/, "the selector must expose all 120 task-days");
assert.match(js, /data-day-next/, "the user must be able to advance manually");
assert.match(js, /data-day-prev/, "the user must be able to move backwards");
assert.match(js, /function renderDailyPlan\(\)/);
assert.match(js, /state\.dayChecks\[input\.dataset\.dayTask\] = input\.checked/);
assert.match(js, /renderDailyPlan\(\);\s*renderWeeks\(\);/,
  "changing a shared task must refresh the planner and weekly roadmap");
assert.doesNotMatch(js, /function renderToday\(\)/, "the automatic Today renderer must be removed");
assert.doesNotMatch(js, /compartment\('schedule'/, "daily execution must be removed from weekly roadmap");
assert.match(js, /Storage verification failed/, "writes must be read back and verified");
assert.match(js, /Saved and verified in this browser/, "successful saves must report verification");
assert.match(css, /\.daily-plan-panel/);
assert.match(css, /\.daily-plan-navigation/);
assert.match(js, /g\.readingKeys\.every/, "resource completion must reflect the exact reading checkboxes");

console.log("120-task daily planner and shared progress contract: all assertions passed.");
