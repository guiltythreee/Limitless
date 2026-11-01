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
const keyboardSelections = [];
const keyboardTabs = createStudyModeTabs(h, {
  items: [
    { id: "one", label: "One" },
    { id: "two", label: "Two" },
    { id: "three", label: "Three" },
    { id: "four", label: "Four" },
  ],
  activeId: "one",
  onSelect: (id) => keyboardSelections.push(id),
});
function pressTab(index, key) {
  let focused = -1;
  let defaultPrevented = false;
  keyboardTabs.children[index].props.onKeyDown({
    key,
    preventDefault: () => { defaultPrevented = true; },
    currentTarget: {
      parentElement: {
        querySelectorAll: () => keyboardTabs.children.map((_, i) => ({ focus: () => { focused = i; } })),
      },
    },
  });
  return { focused, defaultPrevented };
}
assert.deepEqual(pressTab(0, "ArrowLeft"), { focused: 3, defaultPrevented: true }, "ArrowLeft wraps from first to last");
assert.deepEqual(pressTab(3, "ArrowRight"), { focused: 0, defaultPrevented: true }, "ArrowRight wraps from last to first");
assert.deepEqual(pressTab(2, "Home"), { focused: 0, defaultPrevented: true }, "Home focuses first tab");
assert.deepEqual(pressTab(0, "End"), { focused: 3, defaultPrevented: true }, "End focuses last tab");
assert.deepEqual(pressTab(1, "Escape"), { focused: -1, defaultPrevented: false }, "unrelated keys are not intercepted");
assert.deepEqual(keyboardSelections, ["four", "one", "one", "four"], "keyboard navigation selects each focused tab");

console.log("Shared study mode tabs: 30 assertions passed");

const probabilityPage = readFileSync(resolve(root, "probability-source/app/page.tsx"), "utf8");
assert.ok(probabilityPage.includes('aria-label="Probability page navigation"'), "Probability header navigation has a descriptive landmark label");
for (const section of ["archive", "analysis", "experiment", "coverage"]) {
  assert.ok(probabilityPage.includes(`aria-pressed={tab === "${section}"}`), `Probability header ${section} control exposes its selected state`);
}
