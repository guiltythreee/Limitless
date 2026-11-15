(function () {
  "use strict";
  const STORAGE_KEY = "limitless.competition.linked-accounts.v1";
  const $ = id => document.getElementById(id);
  const defaults = { codeforcesHandle: "Unwonted_contriver", csesUserId: "386335" };

  function readSaved() {
    try { return Object.assign({}, defaults, JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")); }
    catch (_) { return defaults; }
  }
  function save() {
    const data = {
      codeforcesHandle: $("cf-handle").value.trim(),
      csesUserId: $("cses-user-id").value.trim()
    };
    if (!data.codeforcesHandle || !/^[0-9]+$/.test(data.csesUserId)) {
      $("accounts-sync-note").textContent = "Enter a Codeforces handle and numeric CSES profile ID.";
      return null;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    $("cf-profile-link").href = "https://codeforces.com/profile/" + encodeURIComponent(data.codeforcesHandle);
    $("cses-profile-link").href = "https://cses.fi/user/" + encodeURIComponent(data.csesUserId);
    $("accounts-sync-note").textContent = "Saved. Limitless cloud sync will mirror this setting when you are signed in.";
    return data;
  }
  function stat(label, value) {
    const item = document.createElement("div");
    item.className = "account-stat";
    const strong = document.createElement("strong");
    strong.textContent = value;
    const small = document.createElement("span");
    small.textContent = label;
    item.append(strong, small);
    return item;
  }
  function message(target, text) {
    target.replaceChildren();
    const p = document.createElement("p");
    p.textContent = text;
    target.append(p);
  }
  async function loadCodeforces(handle) {
    const state = $("cf-link-state"), target = $("cf-account-stats");
    state.textContent = "Loading…";
    message(target, "Fetching rating and contest statistics…");
    try {
      const base = "https://codeforces.com/api/";
      const urls = [
        base + "user.info?handles=" + encodeURIComponent(handle),
        base + "user.rating?handle=" + encodeURIComponent(handle)
      ];
      const api = await import("./codeforces-api.mjs");
      // Keep each Codeforces request at least 2.1 seconds apart. The API
      // applies a per-IP request limit, so parallel fetches can be rejected.
      const info = await api.requestCodeforcesApi(urls[0]);
      const contests = await api.requestCodeforcesApi(urls[1]);
      const user = info.result[0], history = contests.result;
      let syncResult = null;
      let syncError = "";
      try {
        const sync = await import("./codeforces-sync.mjs");
        const plan = sync.getCodeforcesSyncFetchPlan(localStorage, handle);
        if (plan.mode === "invalid") {
          throw new TypeError("A valid Codeforces handle is required before syncing submissions.");
        }
        // Anchor the cursor to fetch start, not completion. A long paginated
        // request must not move the next 24-hour overlap past records that
        // could have been skipped while the API's offset window was shifting.
        const fetchStartedAt = Date.now();
        const submissions = plan.mode === "since"
          ? await api.fetchCodeforcesSubmissionsSince(handle, plan.sinceSeconds)
          : await api.fetchAllCodeforcesSubmissions(handle);
        syncResult = sync.syncCodeforcesSubmissions(localStorage, handle, submissions, fetchStartedAt);
      } catch (error) {
        // Keep public rating data available, but retain the actual sync failure
        // so the user can distinguish a pagination cap from a transient API error.
        syncError = error instanceof Error ? error.message : String(error);
      }
      const latest = history.length ? history[history.length - 1] : null;
      const bestPlace = history.length ? Math.min(...history.map(item => item.rank).filter(Number.isFinite)) : null;
      const stats = document.createDocumentFragment();
      stats.append(
        stat("Current rating", user.rating == null ? "Unrated" : String(user.rating)),
        stat("Maximum rating", user.maxRating == null ? "—" : String(user.maxRating)),
        stat("Current rank", user.rank || "Unrated"),
        stat("Contests entered", String(history.length)),
        stat("Best contest place", bestPlace == null ? "—" : String(bestPlace)),
        stat("Latest rating change", latest ? (latest.newRating >= latest.oldRating ? "+" : "") + (latest.newRating - latest.oldRating) : "—")
      );
      target.replaceChildren(stats);
      state.textContent = "Connected";
      state.classList.add("is-connected");
      $("accounts-sync-note").textContent = !syncResult || !syncResult.ok
        ? "Codeforces statistics loaded, but the learning ledger sync did not complete. Retry the sync." +
          (syncError ? " Reason: " + syncError : syncResult?.error ? " Reason: " + syncResult.error : "")
        : syncResult.baseline
          ? "Codeforces connected. First sync established a historical baseline; older submissions do not award EXP."
          : "Codeforces connected. " + syncResult.added + " new submission attempt(s) added to learning analysis; " +
            syncResult.awardedExp + " EXP awarded from " + syncResult.rewardAwards + " new accepted submission(s).";
      if (syncResult && syncResult.ok) window.dispatchEvent(new Event("limitless:codeforces-learning-updated"));
    } catch (error) {
      state.textContent = "Could not load";
      state.classList.remove("is-connected");
      message(target, error.message + " The profile link remains available; retry later if the API is temporarily unavailable.");
    }
  }
  async function loadCses(userId) {
    const state = $("cses-link-state"), target = $("cses-account-stats");
    state.textContent = "Checking…";
    try {
      const response = await fetch("/api/cses-profile/" + encodeURIComponent(userId), { credentials: "same-origin", headers: { "Accept": "text/html" } });
      if (!response.ok) {
        let detail = "HTTP " + response.status;
        try { const problem = await response.clone().json(); if (problem.error) detail = problem.error; } catch (_) {}
        throw new Error(detail);
      }
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const title = (doc.querySelector("h1") || {}).textContent || "";
      if (!/user/i.test(title) && !doc.querySelector("table")) throw new Error("Could not verify this public CSES profile.");
      const rows = [...doc.querySelectorAll("tr")];
      const fields = {};
      for (const row of rows) {
        const cells = [...row.querySelectorAll("th,td")].map(cell => cell.textContent.trim());
        if (cells.length >= 2) fields[cells[0].replace(/:$/, "").toLowerCase()] = cells.slice(1).join(" ");
      }
      const count = fields["submission count"] || fields["submissions"];
      const last = fields["last submission"];
      const stats = document.createDocumentFragment();
      stats.append(stat("Profile ID", userId), stat("Submissions", count || "Profile verified"), stat("Last submission", last || "—"));
      target.replaceChildren(stats);
      state.textContent = "Profile verified";
      state.classList.add("is-connected");
    } catch (error) {
      state.textContent = "Profile saved · fetch unavailable";
      state.classList.remove("is-connected");
      message(target, "CSES profile ID " + userId + " is saved, but the server could not read the public profile (" + error.message + "). The public profile link still works; retry later.");
    }
  }
  async function refresh(data) {
    $("cf-profile-link").href = "https://codeforces.com/profile/" + encodeURIComponent(data.codeforcesHandle);
    $("cses-profile-link").href = "https://cses.fi/user/" + encodeURIComponent(data.csesUserId);
    await Promise.all([loadCodeforces(data.codeforcesHandle), loadCses(data.csesUserId)]);
  }
  document.addEventListener("DOMContentLoaded", () => {
    const saved = readSaved();
    $("cf-handle").value = saved.codeforcesHandle;
    $("cses-user-id").value = saved.csesUserId;
    $("save-linked-accounts").addEventListener("click", () => {
      const data = save();
      if (data) refresh(data);
    });
    refresh(saved);
  });
})();