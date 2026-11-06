/* Limitless account-scoped localStorage cloud sync.
 * The existing modules keep their storage formats and local-first APIs.
 * This adapter mirrors their first-party localStorage records to Supabase.
 */
(function () {
  "use strict";

  const client = window.limitlessSupabase;
  if (!client || !window.localStorage) return;

  const TABLE = "user_progress";
  const OWNER_KEY = "limitless.cloud-sync.owner";
  const DEBOUNCE_MS = 450;
  const original = {
    setItem: Storage.prototype.setItem,
    removeItem: Storage.prototype.removeItem,
    clear: Storage.prototype.clear
  };

  let activeUserId = null;
  let syncingUserId = null;
  let ready = false;
  let suppress = false;
  let timer = null;
  let inFlight = Promise.resolve();
  let pending = new Map();
  let state = "signed-out";

  function isSyncable(key) {
    return typeof key === "string" &&
      key.length > 0 &&
      key.length <= 512 &&
      key !== OWNER_KEY &&
      !key.startsWith("sb-") &&
      !key.startsWith("__") &&
      key !== "limitless.site.theme";
  }

  function setState(next, detail) {
    state = next;
    window.dispatchEvent(new CustomEvent("limitless:cloud-sync-status", {
      detail: { state: next, message: detail || "" }
    }));
  }

  function snapshotLocal() {
    const result = new Map();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (isSyncable(key)) result.set(key, localStorage.getItem(key));
    }
    return result;
  }

  function queueWrite(key, value, deleted) {
    if (suppress || !ready || !activeUserId || !isSyncable(key)) return;
    pending.set(key, { storage_key: key, value_text: deleted ? null : value, is_deleted: !!deleted });
    if (timer) clearTimeout(timer);
    timer = setTimeout(flush, DEBOUNCE_MS);
  }

  async function flush() {
    if (timer) { clearTimeout(timer); timer = null; }
    if (!ready || !activeUserId || !pending.size) return inFlight;
    const userId = activeUserId;
    const batch = [...pending.values()].map(row => ({ ...row, user_id: userId }));
    for (const row of batch) pending.delete(row.storage_key);
    inFlight = inFlight.then(async () => {
      if (activeUserId !== userId) return;
      const { error } = await client.from(TABLE).upsert(batch, { onConflict: "user_id,storage_key" });
      if (error) {
        for (const row of batch) if (!pending.has(row.storage_key)) pending.set(row.storage_key, row);
        setState("error", error.message);
        if (!timer) timer = setTimeout(flush, 3000);
        throw error;
      }
      setState("synced");
    }).catch(error => {
      console.warn("Limitless cloud sync:", error.message || error);
    });
    return inFlight;
  }

  async function syncUser(userId) {
    if (!userId || (activeUserId === userId && (ready || syncingUserId === userId))) return;
    activeUserId = userId;
    syncingUserId = userId;
    ready = false;
    pending.clear();
    setState("syncing");

    try {
      const previousOwner = localStorage.getItem(OWNER_KEY);
      suppress = true;
      if (previousOwner && previousOwner !== userId) {
        for (const key of snapshotLocal().keys()) original.removeItem.call(localStorage, key);
      }

      const { data: rows, error } = await client
        .from(TABLE)
        .select("storage_key,value_text,is_deleted")
        .eq("user_id", userId);
      if (error) throw error;
      if (activeUserId !== userId) { suppress = false; return; }

      const remote = new Map((rows || []).map(row => [row.storage_key, row]));
      for (const [key, row] of remote) {
        if (!isSyncable(key)) continue;
        if (row.is_deleted) original.removeItem.call(localStorage, key);
        else if (typeof row.value_text === "string") original.setItem.call(localStorage, key, row.value_text);
      }

      // Upload local-only keys. Existing cloud rows always win during initial
      // hydration; keys changed after readiness are queued by the write hook.
      const local = snapshotLocal();
      for (const [key, value] of local) {
        if (!remote.has(key)) pending.set(key, {
          storage_key: key, value_text: value, is_deleted: false, user_id: userId
        });
      }

      original.setItem.call(localStorage, OWNER_KEY, userId);
      suppress = false;
      ready = true;
      setState("synced");
      if (pending.size) await flush();
    } catch (error) {
      suppress = false;
      ready = false;
      setState("error", error.message || "Cloud sync failed");
      console.error("Limitless cloud sync failed:", error);
    } finally {
      if (syncingUserId === userId) syncingUserId = null;
    }
  }

  Storage.prototype.setItem = function (key, value) {
    original.setItem.call(this, key, value);
    if (this === localStorage) queueWrite(String(key), String(value), false);
  };
  Storage.prototype.removeItem = function (key) {
    original.removeItem.call(this, key);
    if (this === localStorage) queueWrite(String(key), null, true);
  };
  Storage.prototype.clear = function () {
    const keys = this === localStorage ? [...snapshotLocal().keys()] : [];
    original.clear.call(this);
    if (this === localStorage) for (const key of keys) queueWrite(key, null, true);
  };

  window.addEventListener("storage", event => {
    if (event.storageArea !== localStorage || !event.key) return;
    queueWrite(event.key, event.newValue, event.newValue === null);
  });

  client.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      if (event === "SIGNED_IN" || event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED") {
        syncUser(session.user.id);
      }
    } else {
      activeUserId = null;
      ready = false;
      pending.clear();
      setState("signed-out");
    }
  });

  client.auth.getSession().then(({ data, error }) => {
    if (error) setState("error", error.message);
    else if (data.session?.user) syncUser(data.session.user.id);
  });

  window.LimitlessCloudSync = Object.freeze({
    flush,
    getStatus: () => state,
    isReady: () => ready
  });
})();
