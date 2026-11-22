import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const js = await readFile(new URL("./competition.js", import.meta.url), "utf8");
const html = await readFile(new URL("./index.html", import.meta.url), "utf8");
const css = await readFile(new URL("./competition-dashboard.css", import.meta.url), "utf8");
const ui = await readFile(new URL("./competition-ui.js", import.meta.url), "utf8");

// Sidebar: one group, one link per subject, all opening the same screen.
assert.match(html, /id="side-subject-group"/, "the sidebar needs a Subject roadmaps group");
for (const id of ["logic", "combinatorics", "probability", "graphs", "dp", "coding"]) {
  assert.match(html, new RegExp(`data-subject-link="${id}"`), `missing sidebar link for ${id}`);
  assert.match(html, new RegExp(`href="#subject-${id}"`), `${id} link needs a real #subject-${id} URL`);
  assert.match(html, new RegExp(`data-subject-progress="${id}"`), `${id} link needs a progress badge`);
}
assert.match(html, /id="subject-roadmap"[^>]*data-screen="subject"/, "the subject roadmap must be its own screen");
assert.match(html, /id="subject-roadmap-panel"/, "the subject roadmap needs a render host");

// Routing: the chosen subject is carried by the URL and handed to competition.js.
assert.match(ui, /competition:subject-change/, "the UI must tell competition.js which subject to draw");
assert.match(ui, /#subject-/, "direct #subject-<id> URLs must open the subject roadmap");
assert.match(ui, /\[data-subject-roadmap\]/, "the overview subject cards must open the subject roadmap");
assert.doesNotMatch(ui, /querySelectorAll\('\[data-subject-roadmap\]'\)\.forEach/,
  "overview cards are redrawn on every save, so their click handler must be delegated");
assert.doesNotMatch(ui, /\bvar history\b/,
  "a local named history shadows window.history and breaks history.replaceState");

// Shared completion: every task checkbox goes through one handler and one store.
assert.match(js, /function refreshTaskViews\(\)/);
assert.match(js, /function onTaskToggle\(input\)/);
assert.match(js, /refreshTaskViews\(\)\s*\{\s*renderDailyPlan\(\);\s*renderWeeks\(\);\s*renderSubjectRoadmap\(\);/,
  "a tick must redraw the Daily plan, the Weekly roadmap and the Subject roadmap");
assert.equal((js.match(/state\.dayChecks\[input\.dataset\.dayTask\] = input\.checked/g) || []).length, 1,
  "exactly one place may write a task tick; extra per-view handlers would let views drift apart");
assert.match(js, /document\.addEventListener\('change'[\s\S]{0,160}\[data-day-task\]/,
  "task checkboxes must be handled by one page-wide listener");
assert.doesNotMatch(js, /querySelectorAll\('\[data-day-task\]'\)\.forEach/,
  "views must not bind their own task handlers");
assert.match(js, /function saveAndRender\(\)[\s\S]*?renderSubjectRoadmap\(\);/,
  "a mastery change must also refresh the subject roadmap");
assert.match(js, /persist\(\);refreshTaskViews\(\);/, "ticking a weekly 'Reading completed' box must refresh every view");

// Styles for the new pieces exist and the sidebar can scroll.
assert.match(css, /\.competition-sidebar \{ overflow-y:auto/, "the sidebar must scroll when the group makes it taller than the window");
assert.match(css, /\.competition-side-sublink/);
assert.match(css, /#subject-roadmap-panel \.reference-task input\[type="checkbox"\]/);
assert.match(css, /width:15px !important/, "subject-roadmap checkboxes must not inherit the global full-width input rule");

// Which subject a daily-plan task belongs to is decided by its opening words.
const start = js.indexOf("var DAILY_TASK_SUBJECT_LEADS");
const end = js.indexOf("var subjectTaskIndexCache");
assert.ok(start > 0 && end > start, "tagging code must stay between its markers");
const tag = new Function(`${js.slice(start, end)}; return dailyTaskSubjectIds;`)();
assert.deepEqual(tag("Probability: study the chapter (about 60 min)."), ["probability"]);
assert.deepEqual(tag("Logical reasoning: complete the named Rosen section (about 35 min)."), ["logic"]);
assert.deepEqual(tag("Combinatorics: read the named Rosen section (about 60 min)."), ["combinatorics"]);
assert.deepEqual(tag("Graph theory: study BFS (about 60 min)."), ["graphs"]);
assert.deepEqual(tag("Dynamic programming: study knapsack (about 60 min)."), ["dp"]);
assert.deepEqual(tag("C++: practise input and output (about 35 min)."), ["coding"]);
assert.deepEqual(tag("C++ / implementation: solve 2 independent problems (about 65 min)."), ["coding"]);
assert.deepEqual(tag("Solve the linked CSES graph tasks and one independent counting problem without an editorial (about 60 min)."),
  ["graphs", "combinatorics"], "a task that names two subjects belongs to both");
assert.deepEqual(tag("Mixed practice: solve one unseen problem (about 50 min)."), [], "mixed practice belongs to no single subject");
assert.deepEqual(tag("Review every failed attempt; record the cause (about 40 min)."), [], "review belongs to no single subject");

console.log("Subject roadmap sidebar, routing and shared task completion: all assertions passed.");

// Deep links: the first activation must run after the Recent activity block joins `screens`,
// otherwise that block stays visible on top of whichever screen a URL opens.
const lastActivate = ui.lastIndexOf("activate(initial, false)");
const activityJoins = ui.indexOf("screens.push(activity)");
assert.ok(lastActivate > activityJoins && activityJoins > 0,
  "run activate(initial, false) after screens.push(activity) so deep links hide the overview-only blocks");
assert.equal((ui.match(/activate\(initial, false\)/g) || []).length, 1, "activate the initial screen exactly once");
console.log("Deep-link ordering: ok.");
