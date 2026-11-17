import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../shared/design-system/tokens.css", import.meta.url), "utf8");

const required = [
  "--ds-space-1", "--ds-space-12",
  "--ds-radius-sm", "--ds-radius-xl",
  "--ds-control-height-md",
  "--ds-font-sans", "--ds-font-serif", "--ds-font-mono",
  "--ds-motion-fast", "--ds-ease-standard",
  "--ds-color-canvas", "--ds-color-surface", "--ds-color-text",
  "--ds-color-heading", "--ds-color-muted", "--ds-color-accent",
  "--ds-color-border", "--ds-color-focus",
];

for (const token of required) assert.ok(css.includes(token), `Missing design token: ${token}`);

for (const section of ["probability", "metallurgy", "home", "competition", "codeforces"]) {
  assert.ok(css.includes(`[data-limitless-design="${section}"]`), `Missing ${section} adapter`);
}

assert.match(css, /NOT imported by any application yet/);
assert.doesNotMatch(css, /@import\s/i, "The contract must not pull in other stylesheets");
assert.doesNotMatch(css, /(^|[\n}])\s*:root\b/m, "The contract must not change global root styles");
assert.doesNotMatch(css, /(^|[\n}])\s*\*\s*\{/m, "The contract must not add global universal selectors");

let depth = 0;
for (const char of css) {
  if (char === "{") depth += 1;
  if (char === "}") depth -= 1;
  assert.ok(depth >= 0, "Unexpected closing CSS brace");
}
assert.equal(depth, 0, "Unclosed CSS block");

console.log("Design-system token contract: PASS");
console.log("5 section adapters; opt-in only; no stylesheet imports or global selectors.");
