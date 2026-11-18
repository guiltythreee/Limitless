import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("./", import.meta.url);
const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const redCss = readFileSync(new URL("./codeforces-red.css", import.meta.url), "utf8");
const problemCss = readFileSync(new URL("./codeforces-problems.css", import.meta.url), "utf8");

function extractElement(id) {
  const match = html.match(new RegExp("<div\\b(?=[^>]*\\bid=\"" + id + "\")[^>]*>"));
  assert.ok(match, "missing #" + id + " element");
  return match[0];
}

const milestones = extractElement("milestone-list");
assert.match(milestones, /role="region"/, "milestones must be an accessible region");
assert.match(milestones, /aria-label="Codeforces rating milestones"/);
assert.match(milestones, /tabindex="0"/, "milestones must be keyboard focusable");

const results = extractElement("cf-problem-list");
assert.match(results, /role="region"/, "problem results must be an accessible region");
assert.match(results, /aria-label="Codeforces problem search results"/);
assert.match(results, /tabindex="0"/, "problem results must be keyboard focusable");

assert.equal((html.match(/class="cr-book-reference"/g) || []).length, 3,
  "all three reference cards must be present");
assert.equal((html.match(/class="cr-book-detail"/g) || []).length, 3,
  "each reference card must include its expandable reading map");
assert.ok(html.includes("Open exact sections and page numbers"));
assert.ok(html.includes("Ch. 30 — Sweep line algorithms"));

assert.match(redCss, /#cf-home-view #milestone-list\.cr-milestones\{[^}]*overflow-y:auto/s,
  "milestones need their own vertical scroll container");
assert.match(redCss, /#cf-home-view #milestone-list\.cr-milestones\{[^}]*overscroll-behavior-y:contain/s,
  "milestone scrolling must not chain into the page");
assert.ok(redCss.includes("#cf-home-view #milestone-list.cr-milestones:focus-visible"));
assert.ok(redCss.includes("html[data-theme=\"light\"] #cf-home-view #milestone-list.cr-milestones"));
assert.ok(redCss.includes("@media(prefers-reduced-motion:reduce)"));

assert.ok(problemCss.includes("#cf-problem-list[role=\"region\"]"));
assert.ok(problemCss.includes("#cf-problem-list[role=\"region\"]:focus-visible"));
assert.match(problemCss, /#cf-problem-list\s*\{[^}]*overscroll-behavior:\s*auto/s,
  "reaching either end of the problem list must allow scrolling to chain to the main page");
assert.match(problemCss, /#cf-problem-list\[role="region"\]\s*\{[^}]*overscroll-behavior-y:\s*auto/s,
  "the accessible results region must not trap wheel or touch scrolling at its boundaries");
assert.doesNotMatch(problemCss, /#cf-problem-list[^}]*overscroll-behavior(?:-y)?:\s*contain/s,
  "the problem list must not contain scroll chaining");
assert.ok(problemCss.includes("scrollbar-color:rgba(106,157,212,.62)"));
assert.ok(problemCss.includes("html[data-theme=\"light\"] #cf-problem-list[role=\"region\"]"));
assert.ok(problemCss.includes("@media(prefers-reduced-motion:reduce)"));

for (const css of [redCss, problemCss]) {
  let depth = 0;
  for (const char of css) {
    if (char === "{") depth++;
    else if (char === "}") depth--;
    assert.ok(depth >= 0, "CSS braces must not close before they open");
  }
  assert.equal(depth, 0, "CSS braces must balance");
}

console.log("Codeforces scrolling/accessibility contract: all assertions passed.");
