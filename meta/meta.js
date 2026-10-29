import { readGlobalRewardSummary } from "../shared/rewards.mjs";

const byId = (id) => document.getElementById(id);
const number = (n) => Math.max(0, Math.floor(Number(n) || 0)).toLocaleString();
const labels = {
  "micro-practice": "Micro-practice",
  "standard-task": "Standard task",
  "focused-practice": "Focused practice",
  assessment: "Assessment",
  "unit-milestone": "Unit milestone",
  "major-completion": "Major completion",
  "bespoke-project": "Bespoke project",
};

function makeRow(title, detail, exp) {
  const row = document.createElement("div");
  row.className = "meta-row";
  const left = document.createElement("div");
  const name = document.createElement("strong");
  name.textContent = title;
  const description = document.createElement("div");
  description.className = "meta-muted";
  description.textContent = detail;
  left.append(name, description);
  const value = document.createElement("strong");
  value.className = "meta-exp";
  value.textContent = exp;
  row.append(left, value);
  return row;
}

function render() {
  let summary;
  try {
    summary = readGlobalRewardSummary(window.localStorage);
  } catch {
    byId("total-exp").textContent = "Unavailable";
    byId("award-count").textContent = "Browser storage could not be read.";
    byId("award-count").classList.add("meta-error");
    return;
  }

  byId("total-exp").textContent = number(summary.totalExp);
  byId("award-count").textContent = number(summary.awardCount) + " verified award" + (summary.awardCount === 1 ? "" : "s");
  byId("global-level").textContent = "Level " + summary.level.level;
  byId("level-copy").textContent = number(summary.level.xpIntoLevel) + " EXP earned within this level.";
  byId("level-progress").textContent = summary.level.progressPct + "%";
  byId("level-fill").style.width = summary.level.progressPct + "%";
  byId("level-track").setAttribute("aria-valuenow", String(summary.level.progressPct));
  byId("next-level-copy").textContent =
    number(summary.level.xpToNextLevel) + " EXP to level " + (summary.level.level + 1) +
    " (threshold " + number(summary.level.nextLevelAt) + ").";

  const modules = byId("module-breakdown");
  modules.replaceChildren();
  if (!summary.sources.length) {
    const empty = document.createElement("p");
    empty.className = "meta-muted";
    empty.textContent = "No registered module progress is saved yet. Complete a Probability problem or an eligible Math Trainer session to begin.";
    modules.append(empty);
  } else {
    for (const source of summary.sources) {
      modules.append(makeRow(source.label, number(source.awards) + " qualifying award" + (source.awards === 1 ? "" : "s"), number(source.exp) + " EXP"));
    }
  }

  const recent = byId("recent-awards");
  recent.replaceChildren();
  if (!summary.recentAwards.length) {
    const empty = document.createElement("p");
    empty.className = "meta-muted";
    empty.textContent = "No EXP awards yet. Submit a Probability answer or finish an eligible Math Trainer session.";
    recent.append(empty);
  } else {
    for (const award of summary.recentAwards) {
      const date = new Date(award.ts).toLocaleString();
      const detail = (labels[award.activityClass] ?? award.activityClass) + " · " +
        award.difficulty + " · " + date + (award.passBonus ? " · first checkpoint pass bonus +" + award.passBonus : "");
      let title = "Learning activity";
      if (award.moduleId === "probability") {
        title = award.completionEvidence === "submitted-answer" ? "Probability problem" : "Probability assessment";
      } else if (award.moduleId === "math-trainer") {
        title = award.itemId.startsWith("math-trick:")
          ? "Math Trainer · Trick Chamber"
          : award.activityClass === "assessment"
            ? "Math Trainer assessment"
            : "Math Trainer session";
      }
      recent.append(makeRow(title, detail, "+" + number(award.totalExp) + " EXP"));
    }
  }
}

render();
window.addEventListener("storage", render);
window.addEventListener("limitless:rewards-updated", render);
document.addEventListener("visibilitychange", () => { if (!document.hidden) render(); });
