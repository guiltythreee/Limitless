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


assert.equal(registerProject(null, project).error, "storage-unavailable",
  "project registration reports unavailable storage");
assert.equal(completeProject(null, project.projectId, { confirmed: true }).error, "storage-unavailable",
  "project completion reports unavailable storage");
assert.equal(completeProject(storage, "missing-project", { confirmed: true }).error, "project-not-registered",
  "unregistered projects cannot be completed");
const failedProjectStorage = {
  getItem(key) { return values.get(key) ?? null; },
  setItem() { throw new Error("quota exceeded"); },
};
assert.equal(registerProject(failedProjectStorage, { ...project, projectId: "failed-register-test" }).error,
  "storage-unavailable", "project registration handles storage write failure");
assert.equal(completeProject(failedProjectStorage, project.projectId, { confirmed: true }).error,
  "storage-unavailable", "project completion handles reward-ledger write failure");

// Profile equipment behaviour.
const profileValues = new Map();
let profileWrites = 0;
const profileStorage = {
  getItem(key) { return profileValues.has(key) ? profileValues.get(key) : null; },
  setItem(key, value) { profileWrites++; profileValues.set(key, value); },
};
const equipped = equipReward(profileStorage, "first-light", 2);
assert.equal(equipped.ok, true, "an unlocked title can be equipped");
assert.equal(equipped.reward.slot, "title", "First Light occupies the title slot");
assert.equal(readEquippedRewards(profileStorage, 2).title.id, "first-light",
  "equipped title is returned by the profile reader");
assert.equal(equipReward(profileStorage, "polymath", 2).error, "reward-not-unlocked",
  "a locked reward cannot be equipped");
const writesBeforeDuplicate = profileWrites;
assert.equal(equipReward(profileStorage, "first-light", 2).duplicate, true,
  "equipping an already-equipped reward is idempotent");
assert.equal(profileWrites, writesBeforeDuplicate, "duplicate equipment does not write storage");
assert.equal(unequipReward(profileStorage, "invalid-slot").error, "invalid-equipment-slot",
  "unknown equipment slots are rejected");
assert.equal(unequipReward(profileStorage, "title").ok, true, "an equipped reward can be removed");
assert.equal(readEquippedRewards(profileStorage, 2).title, null, "unequipped title is no longer active");
assert.equal(unequipReward(profileStorage, "title").duplicate, true,
  "unequipping an empty slot is idempotent");
assert.equal(equipReward(null, "first-light", 2).error, "storage-unavailable",
  "equipment rejects unavailable storage");
assert.equal(unequipReward(null, "title").error, "storage-unavailable",
  "unequip rejects unavailable storage");
const failingProfileStorage = {
  getItem() { return JSON.stringify({ schemaVersion: 1, slots: { title: "first-light" } }); },
  setItem() { throw new Error("quota exceeded"); },
};
assert.equal(equipReward(failingProfileStorage, "first-light", 2).duplicate, true,
  "duplicate equipment remains a no-write success even when writes are unavailable");
assert.equal(equipReward(failingProfileStorage, "scholars-mark", 5).error, "storage-unavailable",
  "equipment reports storage write failures");
assert.equal(unequipReward(failingProfileStorage, "title").error, "storage-unavailable",
  "unequip reports storage write failures");
profileValues.set(PROFILE_EQUIPMENT_STORAGE_KEY, "{malformed");
assert.deepEqual(readEquippedRewards(profileStorage, 2), { title: null, emblem: null, effect: null },
  "malformed equipment storage safely produces an empty profile");

// Durable level-up notification behaviour.
const noticeValues = new Map();
let noticeWrites = 0;
const noticeStorage = {
  getItem(key) { return noticeValues.has(key) ? noticeValues.get(key) : null; },
  setItem(key, value) { noticeWrites++; noticeValues.set(key, value); },
};
const baseline = syncLevelNotifications(noticeStorage, 5, () => 1000);
assert.equal(baseline.ok, true, "first notification sync establishes a baseline");
assert.equal(baseline.initialized, true, "first notification sync is marked initialized");
assert.equal(baseline.notifications.length, 0, "initial baseline creates no retroactive notices");
const crossed = syncLevelNotifications(noticeStorage, 8, () => 2000);
assert.deepEqual(crossed.notifications.map((item) => item.level), [6, 7, 8],
  "crossing multiple levels creates one notice per level");
const writesAfterCrossing = noticeWrites;
const repeated = syncLevelNotifications(noticeStorage, 8, () => 3000);
assert.equal(repeated.notifications.length, 3, "repeated sync does not duplicate notifications");
assert.equal(noticeWrites, writesAfterCrossing, "unchanged level sync does not write storage");
assert.equal(acknowledgeLevelNotification(noticeStorage, 7, () => 4000), true,
  "a pending level notification can be acknowledged");
assert.equal(acknowledgeLevelNotification(noticeStorage, 7, () => 5000), false,
  "a notification cannot be acknowledged twice");
const savedNotices = JSON.parse(noticeValues.get(LEVEL_NOTIFICATION_STORAGE_KEY)).notifications;
assert.equal(savedNotices.find((item) => item.level === 7).acknowledgedAt, 4000,
  "acknowledgement timestamp is persisted");
assert.equal(acknowledgeLevelNotification(noticeStorage, 99), false,
  "unknown levels cannot be acknowledged");
assert.deepEqual(syncLevelNotifications(null, 3), { ok: false, notifications: [] },
  "notification sync handles unavailable storage");
assert.equal(acknowledgeLevelNotification(null, 3), false,
  "notification acknowledgement handles unavailable storage");
const failingNoticeStorage = {
  getItem(key) {
    return key === LEVEL_NOTIFICATION_STORAGE_KEY
      ? JSON.stringify({ schemaVersion: 1, lastObservedLevel: 2, notifications: [
          { id: "global-level-up:3", level: 3, createdAt: 1, acknowledgedAt: null },
        ] })
      : null;
  },
  setItem() { throw new Error("quota exceeded"); },
};
assert.equal(syncLevelNotifications(failingNoticeStorage, 4, () => 6000).ok, false,
  "notification sync reports storage write failure");
assert.equal(acknowledgeLevelNotification(failingNoticeStorage, 3), false,
  "notification acknowledgement reports storage write failure");
const malformedNoticeStorage = {
  getItem() { return "{malformed"; },
  setItem(key, value) { noticeValues.set(key, value); },
};
const recovered = syncLevelNotifications(malformedNoticeStorage, 4, () => 7000);
assert.equal(recovered.ok, true, "malformed notification storage recovers safely");
assert.equal(recovered.initialized, true, "malformed notification storage is re-baselined");
assert.equal(recovered.notifications.length, 0, "malformed storage does not invent historical notices");

console.log("Meta dashboard, project ledger, profile equipment and level notifications: all checks passed.");
