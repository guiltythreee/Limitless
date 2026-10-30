import assert from "node:assert/strict";
import { readMetaStatus } from "./status.mjs";
import { LEVEL_NOTIFICATION_STORAGE_KEY } from "../level-notifications.mjs";
import { PROFILE_EQUIPMENT_STORAGE_KEY } from "../profile.mjs";

const values = new Map();
let writes = 0;
const storage = {
  getItem(key) { return values.get(key) ?? null; },
  setItem(key, value) { writes++; values.set(key, value); },
};
values.set(LEVEL_NOTIFICATION_STORAGE_KEY, JSON.stringify({
  lastObservedLevel: 1,
  notifications: [
    { level: 2, acknowledgedAt: null },
    { level: 3, acknowledgedAt: 123 },
    { level: 4, acknowledgedAt: null },
  ],
}));
values.set(PROFILE_EQUIPMENT_STORAGE_KEY, JSON.stringify({
  slots: { title: "first-light", emblem: "not-unlocked", effect: null },
}));

const status = readMetaStatus(storage);
assert.equal(status.totalExp, 0);
assert.equal(status.level, 1);
assert.equal(status.progressPct, 0);
assert.equal(status.pendingNotifications, 2);
assert.deepEqual(status.equipped, []);
assert.equal(status.nextReward?.name, "First Light");
assert.equal(writes, 0, "Meta status reads must never write or initialise storage");

console.log("Meta status: 7 assertions passed.");
