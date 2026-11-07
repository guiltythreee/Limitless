import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("./cloud-sync.js", import.meta.url), "utf8");
const USER_ID = "user-1";
const PROGRESS_KEY = "hc3-progress-v3";
const OUTBOX_KEY = "__limitless.cloud-sync.pending.user-1";

function makeStorage(seed = {}) {
  class StorageMock {
    constructor(values) { this.values = new Map(Object.entries(values)); }
    get length() { return this.values.size; }
    key(index) { return [...this.values.keys()][index] ?? null; }
    getItem(key) { return this.values.has(String(key)) ? this.values.get(String(key)) : null; }
    setItem(key, value) { this.values.set(String(key), String(value)); }
    removeItem(key) { this.values.delete(String(key)); }
    clear() { this.values.clear(); }
    dump() { return Object.fromEntries(this.values); }
  }
  return { StorageMock, storage: new StorageMock(seed) };
}

async function boot(seed, remoteRows, options = {}) {
  const { StorageMock, storage } = makeStorage(seed);
  const events = [];
  const upserts = [];
  let failures = options.failures ?? 0;
  let authListener = null;
  let resolveUpsertStarted;
  const upsertStarted = new Promise((resolve) => { resolveUpsertStarted = resolve; });
  const client = {
    auth: {
      onAuthStateChange(callback) { authListener = callback; },
      async getSession() { return { data: { session: { user: { id: options.userId ?? USER_ID } } }, error: null }; },
    },
    from(table) {
      assert.equal(table, "user_progress");
      return {
        select() {
          return {
            async eq(column, value) {
              assert.equal(column, "user_id");
              return { data: options.remoteRowsByUser?.[value] ?? remoteRows, error: null };
            },
          };
        },
        async upsert(rows, options) {
          assert.equal(options.onConflict, "user_id,storage_key");
          upserts.push(rows.map((row) => ({ ...row })));
          resolveUpsertStarted(rows);
          if (options.deferFirstUpsert && upserts.length === 1) await options.deferFirstUpsert;
          if (failures > 0) {
            failures--;
            return { error: { message: "simulated offline state" } };
          }
          for (const row of rows) {
            const targetRows = options.remoteRowsByUser?.[row.user_id] ?? remoteRows;
            const index = targetRows.findIndex((existing) => existing.storage_key === row.storage_key);
            const saved = { storage_key: row.storage_key, value_text: row.value_text, is_deleted: row.is_deleted };
            if (index >= 0) targetRows[index] = saved;
            else targetRows.push(saved);
          }
          return { error: null };
        },
      };
    },
  };
  const window = {
    localStorage: storage,
    limitlessSupabase: client,
    addEventListener() {},
    dispatchEvent(event) { events.push(event.type); return true; },
  };
  const document = { visibilityState: "visible", addEventListener() {} };
  let timerId = 0;
  const context = {
    window,
    document,
    localStorage: storage,
    Storage: StorageMock,
    CustomEvent: class CustomEvent {
      constructor(type, init = {}) { this.type = type; this.detail = init.detail; }
    },
    setTimeout() { return ++timerId; },
    clearTimeout() {},
    console: { warn() {}, error() {} },
    Promise,
    Map,
    JSON,
  };
  vm.runInNewContext(source, context, { filename: "cloud-sync.js" });
  for (let attempt = 0; attempt < 20 && !window.LimitlessCloudSync?.isReady(); attempt++) {
    await new Promise((resolve) => globalThis.setTimeout(resolve, 0));
  }
  assert.ok(window.LimitlessCloudSync, "cloud-sync API is installed");
  assert.equal(window.LimitlessCloudSync.isReady(), true, "account hydration completes");
  return {
    storage, window, remoteRows, upserts, events, upsertStarted,
    authEvent(event, session) { authListener?.(event, session); },
  };
}

const initialCloudValue = JSON.stringify({ completed: ["old-cloud-progress"] });
const offlineLocalValue = JSON.stringify({ completed: ["new-offline-progress"] });
const remoteRows = [{
  storage_key: PROGRESS_KEY,
  value_text: initialCloudValue,
  is_deleted: false,
}];

// First session: a local write is persisted immediately, but its cloud upsert fails.
const first = await boot({}, remoteRows, { failures: 1 });
first.storage.setItem(PROGRESS_KEY, offlineLocalValue);
assert.ok(first.storage.getItem(OUTBOX_KEY), "pending local progress is written to a per-account outbox");
await first.window.LimitlessCloudSync.flush();
assert.ok(first.storage.getItem(OUTBOX_KEY), "failed cloud writes remain durable after a failed flush");
assert.equal(remoteRows[0].value_text, initialCloudValue, "the simulated failed upsert does not change cloud data");

// Simulate closing the browser and reopening it. The local outbox survives the reload.
const second = await boot(first.storage.dump(), remoteRows);
await second.window.LimitlessCloudSync.flush();
assert.equal(second.storage.getItem(PROGRESS_KEY), offlineLocalValue, "pending offline progress is replayed over the older cloud snapshot");
assert.equal(remoteRows[0].value_text, offlineLocalValue, "the recovered write reaches Supabase");
assert.equal(second.storage.getItem(OUTBOX_KEY), null, "the outbox is cleared only after a successful upsert");
assert.ok(second.events.includes("limitless:cloud-sync-hydrated"), "modules are notified after account hydration");

// An in-flight upload from one account must never write another account's
// pending queue into the first account's outbox after an account switch.
let releaseFirstUpload;
const firstUploadGate = new Promise((resolve) => { releaseFirstUpload = resolve; });
const userOneRows = [];
const userTwoRows = [];
const switching = await boot({}, userOneRows, {
  deferFirstUpsert: firstUploadGate,
  remoteRowsByUser: { "user-1": userOneRows, "user-2": userTwoRows },
});
switching.storage.setItem(PROGRESS_KEY, JSON.stringify({ owner: "user-one" }));
const inFlightUpload = switching.window.LimitlessCloudSync.flush();
await switching.upsertStarted;
switching.authEvent("SIGNED_OUT", null);
switching.authEvent("SIGNED_IN", { user: { id: "user-2" } });
for (let attempt = 0; attempt < 20 && !switching.window.LimitlessCloudSync.isReady(); attempt++) {
  await new Promise((resolve) => globalThis.setTimeout(resolve, 0));
}
assert.equal(switching.window.LimitlessCloudSync.isReady(), true, "second account hydrates independently");
const userTwoValue = JSON.stringify({ owner: "user-two" });
switching.storage.setItem("meta-progress", userTwoValue);
releaseFirstUpload();
await inFlightUpload;
const userOneOutbox = JSON.parse(switching.storage.getItem("__limitless.cloud-sync.pending.user-1"));
const userTwoOutbox = JSON.parse(switching.storage.getItem("__limitless.cloud-sync.pending.user-2"));
assert.equal(userOneOutbox[0].storage_key, PROGRESS_KEY, "the first account keeps only its own pending record");
assert.equal(userOneOutbox[0].value_text, JSON.stringify({ owner: "user-one" }), "the first account's pending value is not replaced");
assert.equal(userTwoOutbox[0].storage_key, "meta-progress", "the second account keeps its own pending record");
assert.equal(userTwoOutbox[0].value_text, userTwoValue, "the second account's value is never copied into the first account's outbox");

console.log("Supabase cloud-sync outbox: offline recovery and account isolation passed.");
