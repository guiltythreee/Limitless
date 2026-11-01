import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createStudyModeTabs } from "./StudyModeTabs.ts";

const h = (type, props, ...children) => ({ type, props: props ?? {}, children });
const selected = [];
const tabs = createStudyModeTabs(h, {
  items: [{ id: "lesson", label: "Lesson" }, { id: "quiz", label: "Quiz" }],
  activeId: "lesson",
  onSelect: (id) => selected.push(id),
});
assert.equal(tabs.type, "div");
assert.equal(tabs.props.role, "tablist");
assert.equal(tabs.props["aria-label"], "Study sections");
assert.equal(tabs.children.length, 2);
assert.equal(tabs.children[0].props.role, "tab");
assert.equal(tabs.children[0].props.type, "button");
assert.equal(tabs.children[0].props["aria-selected"], true);
assert.equal(tabs.children[1].props["aria-selected"], false);
assert.equal(tabs.children[0].props.tabIndex, 0);
assert.equal(tabs.children[1].props.tabIndex, -1);
tabs.children[1].props.onClick();
assert.deepEqual(selected, ["quiz"]);
let focusedIndex = -1;
let prevented = false;
tabs.children[0].props.onKeyDown({
  key: "ArrowRight",
  preventDefault: () => { prevented = true; },
  currentTarget: { parentElement: { querySelectorAll: () => tabs.children.map((_, index) => ({ focus: () => { focusedIndex = index; } })) } },
});
assert.equal(prevented, true);
assert.equal(focusedIndex, 1);
assert.deepEqual(selected, ["quiz", "quiz"]);

const custom = createStudyModeTabs(h, {
  items: [{ id: "archive", label: "Lessons" }, { id: "analysis", label: "Analysis" }],
  activeId: "analysis",
  onSelect: () => {},
  className: "custom-tabs",
  itemClassName: "tab-item",
  activeClassName: "selected",
  inactiveClassName: "idle",
  label: "Archive sections",
});
assert.equal(custom.props.className, "custom-tabs");
assert.equal(custom.props["aria-label"], "Archive sections");
assert.equal(custom.children[0].props.className, "tab-item idle");
assert.equal(custom.children[1].props.className, "tab-item selected");

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
for (const path of [
  "probability-source/app/page.tsx",
  "metallurgy-source/app/mt202/page.tsx",
  "metallurgy-source/app/mt203/page.tsx",
]) {
  const source = readFileSync(resolve(root, path), "utf8");
  assert.ok(source.includes("createStudyModeTabs"), `${path} should use the shared tab component`);
}
const probability = readFileSync(resolve(root, "probability-source/app/page.tsx"), "utf8");
assert.ok(probability.includes('label: "Lesson sections"'), "Probability lesson sections use the shared accessible tablist");
assert.ok(probability.includes("items: SECTIONS.map((sec) => ({"), "Probability lesson sections preserve their discipline-owned labels and counts");
assert.ok(!probability.includes('className="mt-6 flex flex-wrap gap-1 border-b border-gold/15" role="tablist"'), "Probability does not retain a parallel hand-built section tablist");
console.log("Shared study mode tabs: 24 assertions passed");
