import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("./workspace-layout.css", import.meta.url), "utf8");
assert.ok(css.includes(".archive > .side {"), "shared workspace sidebar selector exists");
assert.ok(css.includes("max-height: calc(100dvh - 82px);"), "desktop sidebar is bounded to the visible workspace");
assert.ok(css.includes("overflow-y: auto;"), "long desktop navigation can scroll independently");
assert.ok(css.includes("@media (max-width: 880px) {\n  .archive > .side {"), "stacked layout has a dedicated responsive override");
assert.ok(css.includes("position: static;"), "stacked sidebar returns to normal document flow");
assert.ok(css.includes("max-height: none;"), "stacked sidebar expands to its content");
assert.ok(css.includes("overflow: visible;"), "stacked sidebar does not create a nested scroll trap");
assert.ok(css.includes("overscroll-behavior: contain;"), "desktop sidebar contains scroll chaining");
console.log("Shared workspace responsive layout: 8 assertions passed");
