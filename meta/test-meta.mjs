#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const metaSource = readFileSync(new URL("./meta.js", import.meta.url), "utf8");
const pageSource = readFileSync(new URL("./index.html", import.meta.url), "utf8");

assert.equal(
  (metaSource.match(/else document\.body\.removeAttribute\("data-lsr1-effect"\);/g) ?? []).length,
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
const projectModuleSelect = pageSource.match(/<select id="project-module"[\\s\\S]*?<\\/select>/)?.[0] ?? "";
assert.ok(projectModuleSelect.includes('value="personal-projects"'),
  "bespoke projects use the dedicated personal-project ledger");
assert.equal((projectModuleSelect.match(/<option\\b/g) ?? []).length, 1,
  "the UI does not offer module ledgers that the project registry rejects");

console.log("Meta dashboard: all checks passed.");
