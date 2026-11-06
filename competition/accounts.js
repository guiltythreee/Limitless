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
    message(target, "Fetching public Codeforces data…");
    try {
      const base = "https://codeforces.com/api/";
      const urls = [
        base + "user.info?handles=" + encodeURIComponent(handle),
        base + "user.status?handle=" + encodeURIComponent(handle) + "&from=1&count=10000",
        base + "user.rating?handle=" + encodeURIComponent(handle)
      ];
      const responses = await Promise.all(urls.map(url => fetch(url)));
      if (responses.some(r => !r.ok)) throw new Error("Codeforces API request failed.");
      const [info, submissions, contests] = await Promise.all(responses.map(r => r.json()));
      if (info.status !== "OK") throw new Error(info.comment || "Handle not found.");
      if (submissions.status !== "OK" || contests.status !== "OK") throw new Error("Codeforces returned incomplete profile data.");
      const user = info.result[0], solved = new Set();
      for (const sub of submissions.result) {
        if (sub.verdict === "OK" && sub.problem) {
          solved.add((sub.problem.contestId || "gym") + "-" + (sub.problem.index || sub.problem.name));
        }
      }
      const latest = contests.result.length ? contests.result[contests.result.length - 1] : null;
      const stats = document.createDocumentFragment();
      stats.append(
        stat("Current rating", user.rating == null ? "Unrated" : String(user.rating)),
        stat("Maximum rating", user.maxRating == null ? "—" : String(user.maxRating)),
        stat("Rank", user.rank || "Unrated"),
        stat("Unique solved", String(solved.size)),
        stat("Contests", String(contests.result.length)),
        stat("Latest contest change", latest ? (latest.newRating >= latest.oldRating ? "+" : "") + (latest.newRating - latest.oldRating) : "—")
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