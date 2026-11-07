(function () {
  "use strict";
  const STORAGE_KEY = "limitless.competition.linked-accounts.v1";
  const $ = id => document.getElementById(id);
  const defaults = { codeforcesHandle: "Unwonted_contriver", csesUserId: "386335" };

  function readSaved() {
    try { return Object.assign({}, defaults, JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")); }
    catch (_) { return defaults; }
  }
  function readRaw() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return value && typeof value === "object" && !Array.isArray(value) ? value : {};
    } catch (_) { return {}; }
  }
  // Keep the last successful Codeforces read so other pages (the Progression Map) can use it without
  // calling the API again or when offline. Additive field; the handle and CSES ID are untouched.
  function rememberCodeforces(handle, user, history) {
    try {
      const raw = readRaw();
      raw.codeforcesHandle = raw.codeforcesHandle || handle;
      raw.csesUserId = raw.csesUserId || defaults.csesUserId;
      raw.codeforcesSnapshot = {
        handle: handle,
        rating: typeof user.rating === "number" ? user.rating : null,
        maxRating: typeof user.maxRating === "number" ? user.maxRating : null,
        contests: history.length,
        fetchedAt: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
    } catch (_) { /* storage can be unavailable; the live panel still works */ }
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
    const previous = readRaw();
    const sameHandle = typeof previous.codeforcesHandle === "string" &&
      previous.codeforcesHandle.toLowerCase() === data.codeforcesHandle.toLowerCase();
    if (sameHandle && previous.codeforcesSnapshot) data.codeforcesSnapshot = previous.codeforcesSnapshot;
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
      const responses = await Promise.all(urls.map(url => fetch(url)));
      if (responses.some(r => !r.ok)) throw new Error("Codeforces API request failed.");
      const [info, contests] = await Promise.all(responses.map(r => r.json()));
      if (info.status !== "OK") throw new Error(info.comment || "Handle not found.");
      if (contests.status !== "OK") throw new Error(contests.comment || "Could not load contest history.");
      const user = info.result[0], history = contests.result;
      const latest = history.length ? history[history.length - 1] : null;
      const bestPlace = history.length ? Math.min(...history.map(item => item.rank).filter(Number.isFinite)) : null;
      rememberCodeforces(handle, user, history);
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
      const response = await fetch("https://cses.fi/user/" + encodeURIComponent(userId), { credentials: "omit" });
      if (!response.ok) throw new Error("CSES profile returned HTTP " + response.status + ".");
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
      state.textContent = "Profile saved";
      state.classList.remove("is-connected");
      message(target, "CSES profile ID " + userId + " is saved. Automatic profile reading was blocked or unavailable in this browser (" + error.message + "). The public profile link still works.");
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