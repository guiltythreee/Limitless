import assert from "node:assert/strict";
import { createStudyUtilityNav } from "./StudyUtilityNav.ts";

const calls = [];
const h = (type, props, ...children) => {
  const node = { type, props: props ?? {}, children };
  calls.push(node);
  return node;
};
const selected = [];
const nav = createStudyUtilityNav(h, {
  label: "Course utilities",
  className: "course-sidebar",
  items: [
    { id: "bookmarks", label: "Bookmarks", count: 4, active: true },
    { id: "history", label: "Attempt history", description: "Recorded answers" },
    { id: "revision", label: "Revision", tone: "accent" },
  ],
  onSelect: (id) => selected.push(id),
});

assert.equal(nav.type, "nav");
assert.equal(nav.props["aria-label"], "Course utilities");
assert.equal(nav.props["data-study-utility-nav"], "true");
assert.match(nav.props.className, /course-sidebar/);
assert.equal(nav.children.length, 3);
assert.equal(nav.children[0].type, "button");
assert.equal(nav.children[0].props.type, "button");
assert.equal(nav.children[1].props.type, "button");
assert.equal(nav.children[0].props["aria-current"], "page");
assert.equal(nav.children[1].props["aria-current"], undefined);
assert.equal("aria-pressed" in nav.children[0].props, false);
assert.equal(nav.children[0].children[1].children[0], "4");
assert.equal("aria-label" in nav.children[0].children[1].props, false);
assert.equal(nav.children[1].children[0].children[1].children[0], "Recorded answers");
assert.match(nav.children[2].props.className, /is-accent/);
nav.children[1].props.onClick();
assert.deepEqual(selected, ["history"]);

const empty = createStudyUtilityNav(h, { items: [], onSelect: () => {} });
assert.equal(empty.children.length, 0);
console.log("Shared study utility navigation: 23 assertions passed");

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
for (const app of ["probability-source", "metallurgy-source"]) {
  const layout = readFileSync(resolve(root, app, "app/layout.tsx"), "utf8");
  assert.ok(layout.includes("shared/studies/study-utility-nav.css"), `${app} must load shared utility navigation styles`);
}
for (const appPath of [
  "probability-source/app/components/Practice.tsx",
  "metallurgy-source/app/mt201/page.tsx",
  "metallurgy-source/app/mt202/page.tsx",
  "metallurgy-source/app/mt203/page.tsx",
]) {
  const source = readFileSync(resolve(root, appPath), "utf8");
  assert.ok(source.includes("createStudyUtilityNav"), `${appPath} must use shared utility navigation`);
}

for (const [appPath, marker] of [
  ["probability-source/app/components/TopicTree.tsx", 'aria-current={activeId === lesson.id ? "location" : undefined}'],
  ["metallurgy-source/app/mt201/page.tsx", 'aria-current={activeCh === t.id ? "location" : undefined}'],
  ["metallurgy-source/app/mt202/page.tsx", 'aria-current={activeCh === t.id ? "location" : undefined}'],
  ["metallurgy-source/app/mt203/page.tsx", 'aria-current={activeTopic === t.id ? "location" : undefined}'],
]) {
  const source = readFileSync(resolve(root, appPath), "utf8");
  assert.ok(source.includes(marker), `${appPath} must expose its active topic as the current location`);
}

for (const [appPath, label] of [
  ["metallurgy-source/app/mt201/page.tsx", "MT201 course navigation"],
  ["metallurgy-source/app/mt202/page.tsx", "MT202 course navigation"],
  ["metallurgy-source/app/mt203/page.tsx", "MT203 course navigation"],
]) {
  const source = readFileSync(resolve(root, appPath), "utf8");
  assert.ok(source.includes(`aria-label="${label}"`), `${appPath} must label its course navigation landmark`);
}
const probabilityTree = readFileSync(resolve(root, "probability-source/app/components/TopicTree.tsx"), "utf8");
assert.ok(probabilityTree.includes('<nav aria-label="Probability course navigation"'), "Probability topic tree must expose a labelled navigation landmark");

assert.ok(probabilityTree.includes("aria-controls={topicsId}"), "Probability sequence disclosure identifies its topic panel");
assert.ok(probabilityTree.includes('<div id={topicsId}'), "Probability sequence topic panel exposes the controlled id");
assert.ok(probabilityTree.includes("aria-expanded={isOpen}"), "Probability sequence disclosure exposes expanded state");
assert.ok(probabilityTree.includes('type="button"'), "Probability topic navigation buttons cannot submit an enclosing form");
assert.ok(probabilityTree.includes("hidden={!isOpen}"), "Probability disclosure target remains mounted and hidden when collapsed");
