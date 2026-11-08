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
  const PENDING_PREFIX = "__limitless.cloud-sync.pending.";
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
  let lastRefreshAt = 0;

  function pendingStorageKey(userId) {
    return PENDING_PREFIX + userId;
  }

  // Keep a per-account outbox in localStorage. If the network is unavailable
  // or the browser closes before an upsert finishes, the next session can
  // replay these exact local writes after hydrating that same account.
  function persistPending(userId = activeUserId) {
    if (!userId) return;
    const key = pendingStorageKey(userId);
    try {
      if (pending.size) {
        original.setItem.call(localStorage, key, JSON.stringify([...pending.values()]));
      } else {
        original.removeItem.call(localStorage, key);
      }
    } catch (error) {
      console.warn("Limitless cloud sync outbox could not be saved:", error.message || error);
    }
  }

  function restorePending(userId) {
    pending.clear();
    try {
      const raw = localStorage.getItem(pendingStorageKey(userId));
      const rows = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(rows)) return;
      for (const row of rows) {
        if (!row || !isSyncable(row.storage_key) || typeof row.is_deleted !== "boolean") continue;
        if (!row.is_deleted && typeof row.value_text !== "string") continue;
        pending.set(row.storage_key, {
          storage_key: row.storage_key,
          value_text: row.is_deleted ? null : row.value_text,
          is_deleted: row.is_deleted
        });
      }
    } catch (error) {
      console.warn("Limitless cloud sync outbox could not be restored:", error.message || error);
    }
  }

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
    if (suppress || !activeUserId || !isSyncable(key)) return;
    pending.set(key, { storage_key: key, value_text: deleted ? null : value, is_deleted: !!deleted });
    persistPending();
    if (timer) clearTimeout(timer);
    timer = setTimeout(flush, DEBOUNCE_MS);
  }

  async function flush() {
    if (timer) { clearTimeout(timer); timer = null; }
    if (!ready || !activeUserId || !pending.size) return inFlight;
    const userId = activeUserId;
    const batch = [...pending.entries()];
    inFlight = inFlight.then(async () => {
      if (activeUserId !== userId) return;
      const currentBatch = batch.filter(([key, row]) => pending.get(key) === row);
      if (!currentBatch.length) return;
      const payload = currentBatch.map(([, row]) => ({ ...row, user_id: userId }));
      const { error } = await client.from(TABLE).upsert(payload, { onConflict: "user_id,storage_key" });
      // The user may have signed out or switched accounts while the request
      // was in flight. Never write the new account's queue into the old
      // account's outbox or change the new account's sync status.
      if (activeUserId !== userId) return;
      if (error) {
        setState("error", error.message);
        if (!timer) timer = setTimeout(flush, 3000);
        throw error;
      }
      // Remove only the exact versions sent. A newer write to the same key
      // made during the request must remain queued for the next batch.
      for (const [key, row] of currentBatch) if (pending.get(key) === row) pending.delete(key);
      persistPending(userId);
      setState("synced");
    }).catch(error => {
      console.warn("Limitless cloud sync:", error.message || error);
    });
    return inFlight;
  }

  async function syncUser(userId, force = false) {
    if (!userId || syncingUserId === userId || (activeUserId === userId && ready && !force)) return;
    if (force && activeUserId === userId) await inFlight;
    activeUserId = userId;
    syncingUserId = userId;
    ready = false;
    restorePending(userId);
    setState("syncing");

    try {
      const previousOwner = localStorage.getItem(OWNER_KEY);
      suppress = true;
      if (previousOwner && previousOwner !== userId) {
        for (const key of snapshotLocal().keys()) original.removeItem.call(localStorage, key);
      }
      suppress = false;

      const { data: rows, error } = await client
        .from(TABLE)
        .select("storage_key,value_text,is_deleted")
        .eq("user_id", userId);
      if (error) throw error;
      if (activeUserId !== userId) { suppress = false; return; }

      const remote = new Map((rows || []).map(row => [row.storage_key, row]));
      suppress = true;
      for (const [key, row] of remote) {
        if (!isSyncable(key)) continue;
        if (row.is_deleted) original.removeItem.call(localStorage, key);
        else if (typeof row.value_text === "string") original.setItem.call(localStorage, key, row.value_text);
      }

      // A local edit made while the cloud read was in flight wins over the
      // snapshot being hydrated and is then uploaded as the newest change.
      for (const [key, row] of pending) {
        if (row.is_deleted) original.removeItem.call(localStorage, key);
        else original.setItem.call(localStorage, key, row.value_text);
      }

      // Upload local-only keys. Cloud values win unless a concurrent local
      // write was captured above.
      const local = snapshotLocal();
      for (const [key, value] of local) {
        if (!remote.has(key) && !pending.has(key)) pending.set(key, {
          storage_key: key, value_text: value, is_deleted: false, user_id: userId
        });
      }

      original.setItem.call(localStorage, OWNER_KEY, userId);
      suppress = false;
      ready = true;
      setState("synced");
      // Notify local-first module stores that cloud values have replaced or
      // merged their persisted records. Storage.prototype writes are bypassed
      // intentionally during hydration, so the browser will not emit a
      // same-tab "storage" event for these changes.
      window.dispatchEvent(new CustomEvent("limitless:cloud-sync-hydrated", {
        detail: { userId }
      }));
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

  // Refresh cloud state when an already-open page returns to the foreground.
  // This lets another device's contest results appear without requiring sign-out.
  async function refresh() {
    if (!activeUserId || !client.auth) return;
    const now = Date.now();
    if (now - lastRefreshAt < 15000) return;
    lastRefreshAt = now;
    try {
      const { data, error } = await client.auth.getSession();
      if (error) throw error;
      const userId = data.session?.user?.id;
      if (userId && userId === activeUserId) await syncUser(userId, true);
    } catch (error) {
      setState("error", error.message || "Cloud refresh failed");
    }
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") void refresh();
  });
  window.addEventListener("focus", () => { void refresh(); });

  // Flush debounced progress when the page is backgrounded or closed. The
  // localStorage write remains durable even if the browser cancels the request;
  // this is a best-effort attempt to finish the cloud mirror before teardown.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") void flush();
  });
  window.addEventListener("pagehide", () => { void flush(); });

  client.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      if (event === "SIGNED_IN" || event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED") {
        syncUser(session.user.id);
      }
    } else {
      persistPending(activeUserId);
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
    isReady: () => ready,
    refresh
  });
})();
