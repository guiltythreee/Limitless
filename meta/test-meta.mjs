#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  completeProject,
  listRegisteredProjects,
  registerProject,
} from "../shared/projects.mjs";
import { REWARD_SOURCE_REGISTRY } from "../shared/rewards.mjs";
import { equipReward, readEquippedRewards, unequipReward, PROFILE_EQUIPMENT_STORAGE_KEY } from "../shared/profile.mjs";
import { acknowledgeLevelNotification, syncLevelNotifications, LEVEL_NOTIFICATION_STORAGE_KEY } from "../shared/level-notifications.mjs";

const metaSource = readFileSync(new URL("./meta.js", import.meta.url), "utf8");
const pageSource = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const projectSource = readFileSync(new URL("../shared/projects.mjs", import.meta.url), "utf8");

assert.equal(
  (metaSource.match(/"unit-milestone": "Unit milestone"/g) ?? []).length,
  1,
  "Meta activity labels do not contain duplicate keys",
);
for (const moduleId of ["metallurgy-mt201", "metallurgy-mt202", "metallurgy-mt203"]) {
  assert.ok(metaSource.includes('award.moduleId === "' + moduleId + '"'),
    moduleId + " recent awards have a dedicated renderer label");
}
assert.ok(metaSource.includes("Metallurgy MT201–MT203"),
  "Meta empty state describes the Metallurgy integrations");
assert.ok(pageSource.includes('<a href="../metallurgy/">Metallurgy</a>'),
  "Meta navigation links to the Metallurgy application");
const projectModuleSelect = pageSource.match(/<select id="project-module"[\s\S]*?<\/select>/)?.[0] ?? "";
assert.ok(projectModuleSelect.includes('value="personal-projects"'),
  "bespoke projects use the dedicated personal-project ledger");
assert.equal((projectModuleSelect.match(/<option\b/g) ?? []).length, 1,
  "the UI does not offer discipline ledgers for bespoke projects");
assert.ok(projectSource.includes('moduleId !== "personal-projects"'),
  "project registration rejects discipline-owned ledgers");
assert.ok(projectSource.includes('project.moduleId === "personal-projects"'),
  "project listing only accepts the dedicated project ledger");

const values = new Map();
const storage = {
  getItem(key) { return values.has(key) ? values.get(key) : null; },
  setItem(key, value) { values.set(key, value); },
};
const project = {
  projectId: "meta-ledger-isolation-test",
  moduleId: "personal-projects",
  title: "Meta ledger isolation test",
  scope: "A bounded test project used to verify isolated personal-project rewards.",
  criteria: "The project must register once and complete with one immutable reward record.",
  baseExp: 50,
  difficulty: "intermediate",
};
assert.equal(registerProject(storage, project).ok, true, "personal project registration succeeds");
assert.equal(registerProject(storage, { ...project, projectId: "wrong-ledger-test", moduleId: "probability" }).error,
  "unregistered-module", "discipline-owned ledgers cannot receive bespoke projects");
assert.equal(listRegisteredProjects(storage).length, 1, "only the valid project is listed");
const completed = completeProject(storage, project.projectId, { confirmed: true, now: 1_800_000_000_000 });
assert.equal(completed.ok, true, "registered project completes");
assert.equal(completed.record.moduleId, "personal-projects", "project reward remains in its dedicated ledger");
assert.equal(values.has("limitless-lsr1-personal-projects-v1"), true, "dedicated ledger is written");
for (const source of REWARD_SOURCE_REGISTRY.filter((item) => item.moduleId !== "personal-projects")) {
  assert.equal(values.has(source.storageKey), false, source.moduleId + " ledger remains untouched");
}
assert.equal(completeProject(storage, project.projectId, { confirmed: true }).duplicate, true,
  "project completion is idempotent");

console.log("Meta dashboard and project-ledger isolation: all checks passed.");
