import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const js = await readFile(new URL("./competition.js", import.meta.url), "utf8");
const html = await readFile(new URL("./index.html", import.meta.url), "utf8");
const css = await readFile(new URL("./competition.css", import.meta.url), "utf8");
const ui = await readFile(new URL("./competition-ui.js", import.meta.url), "utf8");

assert.match(html, /id="daily-plan"/, "the 120-task planner must be a separate section");
assert.match(html, /id="daily-plan-panel"/, "the planner needs its own render host");
assert.doesNotMatch(html, /id="today-panel"/, "the old roadmap Today panel must be removed");
assert.doesNotMatch(ui, /todayPanel = document\.createElement/, "the old overview Today panel must also be removed");
assert.match(ui, /location\.hash === '#daily-plan' \? 'daily'/, "the daily planner must open from a direct URL");
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
assert.match(js, /\.recovery/, "unreadable saved progress must be preserved before fallback");
assert.match(js, /LimitlessCloudSync\.getStatus/, "the UI must expose the actual account cloud-sync state");
assert.match(js, /Cloud sync complete/, "successful account sync must be distinguishable from local saving");
assert.match(js, /Saved and verified in this browser/, "successful saves must report verification");
assert.match(css, /\.daily-plan-panel/);
assert.match(css, /\.daily-plan-navigation/);
assert.match(css, /#daily-plan-panel \.reference-task\s*\{/,
  "daily-plan assignment labels must have their own full-width grid layout");
assert.match(css, /#daily-plan-panel \.reference-task input\[type="checkbox"\][\s\\S]*?width: 15px !important/,
  "daily-plan checkboxes must not inherit the global full-width input rule");
assert.match(css, /#daily-plan-panel \.reference-task input/,
  "daily-plan checkbox styles must be scoped to the daily planner");
assert.match(css, /width: 15px !important/,
  "daily-plan checkboxes must not inherit the global full-width input rule");
assert.match(css, /#daily-plan-panel \.reference-task > span/,
  "daily-plan reading text must occupy the remaining column");
assert.match(js, /g\.readingKeys\.every/, "resource completion must reflect the exact reading checkboxes");

console.log("120-task daily planner and shared progress contract: all assertions passed.");
