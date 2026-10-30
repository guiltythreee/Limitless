#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const metaSource = readFileSync(new URL("./meta.js", import.meta.url), "utf8");
const pageSource = readFileSync(new URL("./index.html", import.meta.url), "utf8");

assert.equal(
  (metaSource.match(/else document\\.body\\.removeAttribute\\("data-lsr1-effect"\\);/g) ?? []).length,
  1,
  "equipped profile effect has exactly one fallback branch",
);
for (const moduleId of ["metallurgy-mt201", "metallurgy-mt202", "metallurgy-mt203"]) {
  assert.ok(metaSource.includes('award.moduleId === "' + moduleId + '"'),
    moduleId + " recent awards have a dedicated renderer label");
}
assert.ok(pageSource.includes('<a href="../metallurgy/">Metallurgy</a>'),
  "Meta navigation links to the Metallurgy application");
assert.ok(pageSource.includes('id="recent-awards"'),
  "recent-award renderer has a page host");

console.log("Meta dashboard: all checks passed.");
