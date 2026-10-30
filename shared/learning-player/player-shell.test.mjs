import assert from "node:assert/strict";
import { createLearningPlayerShell } from "./PlayerShell.ts";

const calls = [];
const createElement = (type, props, ...children) => {
  const element = { type, props: props ?? {}, children };
  calls.push(element);
  return element;
};

const palette = { kind: "course-owned-palette" };
const content = { kind: "course-owned-question-view" };
const shell = createLearningPlayerShell(createElement, {
  className: "panel",
  paletteClassName: "dots",
  contentClassName: "qwrap",
  palette,
  children: content,
});

assert.equal(shell.type, "section");
assert.equal(shell.props.className, "panel");
assert.equal(shell.props["data-learning-player"], "true");
assert.equal(shell.children.length, 2);
assert.equal(shell.children[0].type, "nav");
assert.equal(shell.children[0].props.className, "dots");
assert.equal(shell.children[0].props["aria-label"], "Question navigation");
assert.equal(shell.children[0].props["data-learning-player-palette"], "true");
assert.equal(shell.children[0].children[0], palette);
assert.equal(shell.children[1].type, "div");
assert.equal(shell.children[1].props.className, "qwrap");
assert.equal(shell.children[1].props["data-learning-player-content"], "true");
assert.equal(shell.children[1].children[0], content);

const withoutPalette = createLearningPlayerShell(createElement, {
  children: content,
});
assert.equal(withoutPalette.children[0], null);
assert.equal(withoutPalette.children[1].children[0], content);

// Both applications load the same semantic design layer after their own theme.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
for (const app of ["metallurgy-source", "probability-source"]) {
  const layout = readFileSync(resolve(root, app, "app/layout.tsx"), "utf8");
  assert.match(layout, /shared\/learning-player\/player\.css/);
}
const sharedCss = readFileSync(new URL("./player.css", import.meta.url), "utf8");
for (const token of [
  "--lp-color-canvas", "--lp-color-surface", "--lp-color-text",
  "--lp-color-accent", "--lp-color-success", "--lp-space-4",
  "--lp-radius-md", "--lp-font-reading",
]) assert.ok(sharedCss.includes(token), `missing shared design token: ${token}`);

console.log("P6 shared player shell and design tokens: 25 assertions passed");
