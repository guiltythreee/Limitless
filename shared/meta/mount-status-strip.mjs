import { readMetaStatus } from "./status.mjs";

const mount = document.getElementById("limitless-meta-mount");
if (mount) {
  const strip = document.createElement("aside");
  strip.className = "limitless-meta-strip";
  strip.setAttribute("aria-label", "Global Limitless progression");

  const summaryLink = document.createElement("a");
  summaryLink.className = "limitless-meta-summary";
  summaryLink.href = "/meta/";
  const level = document.createElement("strong");
  level.className = "limitless-meta-level";
  const exp = document.createElement("span");
  exp.className = "limitless-meta-exp";
  const track = document.createElement("span");
  track.className = "limitless-meta-track";
  track.setAttribute("aria-hidden", "true");
  const fill = document.createElement("span");
  track.append(fill);
  const next = document.createElement("span");
  next.className = "limitless-meta-next";
  summaryLink.append(level, exp, track, next);

  const details = document.createElement("span");
  details.className = "limitless-meta-details";
  const open = document.createElement("a");
  open.className = "limitless-meta-open";
  open.href = "/meta/";
  open.textContent = "Meta ↗";
  strip.append(summaryLink, details, open);
  mount.replaceChildren(strip);

  function refresh() {
    try {
      const status = readMetaStatus(window.localStorage);
      level.textContent = "LV " + status.level;
      exp.textContent = status.totalExp.toLocaleString() + " EXP";
      fill.style.width = Math.max(0, Math.min(100, status.progressPct)) + "%";
      next.textContent = status.nextReward
        ? "Next level in " + status.xpToNextLevel.toLocaleString() + " EXP · " + status.nextReward.name + " at Lv " + status.nextReward.level
        : "All current rewards unlocked";
      details.textContent = status.equipped.length ? status.equipped.join(" · ") : "Profile rewards not equipped";
      if (status.pendingNotifications) {
        const notice = document.createElement("span");
        notice.className = "limitless-meta-notice";
        notice.textContent = status.pendingNotifications + " level-up notice" + (status.pendingNotifications === 1 ? "" : "s");
        details.append(" ", notice);
      }
      summaryLink.setAttribute("aria-label", "Global Level " + status.level + ", " + status.totalExp.toLocaleString() + " EXP. Open Meta progression.");
      if (status.equippedEffect) document.body.setAttribute("data-lsr1-effect", status.equippedEffect);
      else document.body.removeAttribute("data-lsr1-effect");
    } catch {
      level.textContent = "LV 1";
      exp.textContent = "0 EXP";
      next.textContent = "Meta progression unavailable";
      details.textContent = "";
      document.body.removeAttribute("data-lsr1-effect");
    }
  }
  refresh();
  window.addEventListener("storage", refresh);
  window.addEventListener("limitless:rewards-updated", refresh);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) refresh(); });
}
