import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const css = readFileSync(resolve(root, "shared/studies/study-navigation.css"), "utf8");
assert.ok(css.includes(".ch-item:focus-visible"), "Metallurgy chapter controls receive visible keyboard focus");
assert.ok(css.includes("[data-study-topic-tree] button:focus-visible"), "Probability topic tree controls receive visible keyboard focus");
assert.ok(css.includes("[data-study-topic-picker]:focus-visible"), "mobile Probability topic picker receives visible keyboard focus");
assert.ok(css.includes('[data-study-mode-tabs] [role="tab"]:focus-visible'), "shared study tabs receive visible keyboard focus");
assert.ok(css.includes("outline: 2px solid var(--gold, currentColor);"), "focus uses the discipline accent token");
assert.ok(css.includes("@media (forced-colors: active)"), "focus remains visible in forced-colour modes");
assert.ok(css.includes("outline-color: Highlight;"), "forced-colour mode uses the system highlight colour");

for (const app of ["metallurgy-source", "probability-source"]) {
  const layout = readFileSync(resolve(root, app, "app/layout.tsx"), "utf8");
  assert.ok(layout.includes("shared/studies/study-navigation.css"), `${app} loads shared navigation focus styles`);
}

const tree = readFileSync(resolve(root, "probability-source/app/components/TopicTree.tsx"), "utf8");
assert.ok(tree.includes('data-study-topic-tree="true"'), "Probability topic tree exposes a stable styling boundary");
const page = readFileSync(resolve(root, "probability-source/app/page.tsx"), "utf8");
assert.ok(page.includes('data-study-topic-picker="true"'), "mobile Probability topic disclosure exposes the shared focus styling boundary");

console.log("Shared study navigation focus: 11 assertions passed");
