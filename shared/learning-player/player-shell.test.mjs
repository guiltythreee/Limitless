import assert from "node:assert/strict";
import { createLearningPlayerShell } from "./PlayerShell.ts";

const calls = [];
const createElement = (type, props, ...children) => {
  const element = { type, props: props ?? {}, children };
  calls.push(element);
  return element;
};

const header = { kind: "course-owned-header" };
const palette = { kind: "course-owned-palette" };
const content = { kind: "course-owned-question-view" };
const footer = { kind: "course-owned-footer" };
const shell = createLearningPlayerShell(createElement, {
  className: "panel",
  paletteClassName: "dots",
  contentClassName: "qwrap",
  header,
  palette,
  footer,
  children: content,
});

assert.equal(shell.type, "section");
assert.equal(shell.props.className, "panel");
assert.equal(shell.props["data-learning-player"], "true");
assert.equal(shell.children.length, 4);
assert.equal(shell.children[0].type, "header");
assert.equal(shell.children[0].props["data-learning-player-header"], "true");
assert.equal(shell.children[0].children[0], header);
assert.equal(shell.children[1].type, "nav");
assert.equal(shell.children[1].props.className, "dots");
assert.equal(shell.children[1].props["aria-label"], "Question navigation");
assert.equal(shell.children[1].props["data-learning-player-palette"], "true");
assert.equal(shell.children[1].children[0], palette);
assert.equal(shell.children[2].type, "div");
assert.equal(shell.children[2].props.className, "qwrap");
assert.equal(shell.children[2].props["data-learning-player-content"], "true");
assert.equal(shell.children[2].children[0], content);
assert.equal(shell.children[3].type, "footer");
assert.equal(shell.children[3].props["data-learning-player-footer"], "true");
assert.equal(shell.children[3].children[0], footer);

const withoutPalette = createLearningPlayerShell(createElement, {
  children: content,
});
assert.equal(withoutPalette.children.length, 1);
assert.equal(withoutPalette.children[0].children[0], content);

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

console.log("P6 shared player shell and design tokens: 31 assertions passed");
