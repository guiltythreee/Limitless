import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const js = await readFile(new URL("./competition.js", import.meta.url), "utf8");
const html = await readFile(new URL("./index.html", import.meta.url), "utf8");
const css = await readFile(new URL("./competition.css", import.meta.url), "utf8");

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

console.log("Competition Today panel contract: all assertions passed.");
