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
assert.equal(shell.children.length, 2);
assert.equal(shell.children[0].type, "nav");
assert.equal(shell.children[0].props.className, "dots");
assert.equal(shell.children[0].props["aria-label"], "Question navigation");
assert.equal(shell.children[0].children[0], palette);
assert.equal(shell.children[1].type, "div");
assert.equal(shell.children[1].props.className, "qwrap");
assert.equal(shell.children[1].children[0], content);

const withoutPalette = createLearningPlayerShell(createElement, {
  children: content,
});
assert.equal(withoutPalette.children[0], null);
assert.equal(withoutPalette.children[1].children[0], content);

console.log("P6 shared player shell: 12 assertions passed");
