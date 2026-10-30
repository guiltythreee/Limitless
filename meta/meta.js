import { readGlobalRewardSummary } from "../shared/rewards.mjs";
import { completeProject, listRegisteredProjects, registerProject } from "../shared/projects.mjs";
import { equipReward, readEquippedRewards, unequipReward } from "../shared/profile.mjs";
import { acknowledgeLevelNotification, syncLevelNotifications } from "../shared/level-notifications.mjs";

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

function renderLevelNotifications(level) {
  const host = byId("level-up-notices");
  host.replaceChildren();
  const result = syncLevelNotifications(window.localStorage, level);
  if (!result.ok) {
    const error = document.createElement("p");
    error.className = "meta-error";
    error.textContent = "Level-up notices could not be saved in browser storage.";
    host.append(error);
    return;
  }
  const pending = result.notifications
    .filter((notice) => notice && notice.acknowledgedAt == null)
    .sort((a, b) => a.level - b.level);
  if (!pending.length) {
    const empty = document.createElement("p");
    empty.className = "meta-muted";
    empty.textContent = "No unacknowledged level-ups.";
    host.append(empty);
    return;
  }
  for (const notice of pending) {
    const row = document.createElement("div");
    row.className = "meta-level-notice";
    const label = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = `Global Level ${notice.level} reached`;
    const detail = document.createElement("p");
    detail.className = "meta-muted";
    detail.textContent = "Verified global EXP crossed the level threshold.";
    label.append(title, detail);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "meta-button";
    button.textContent = "Acknowledge";
    button.addEventListener("click", () => {
      if (acknowledgeLevelNotification(window.localStorage, notice.level)) render();
    });
    row.append(label, button);
    host.append(row);
  }
}

function renderEquippedProfile(level) {
  const host = byId("equipped-profile");
  host.replaceChildren();
  const equipped = readEquippedRewards(window.localStorage, level);
  const slots = [
    ["title", "Title"],
    ["emblem", "Emblem"],
    ["effect", "Profile effect"],
  ];
  let active = 0;
  for (const [slot, label] of slots) {
    const reward = equipped[slot];
    if (!reward) continue;
    active++;
    host.append(makeRow(label, reward.name, ""));
  }
  if (!active) {
    const empty = document.createElement("p");
    empty.className = "meta-muted";
    empty.textContent = "Nothing equipped yet. Choose any unlocked title, emblem, or effect below.";
    host.append(empty);
  }
  if (equipped.effect) document.body.setAttribute("data-lsr1-effect", equipped.effect.id);
  else document.body.removeAttribute("data-lsr1-effect");
  return equipped;
}

function renderUnlocks(summary) {
  const host = byId("unlocked-rewards");
  const nextCopy = byId("next-reward-copy");
  host.replaceChildren();
  const next = summary.nextReward;
  nextCopy.textContent = next
    ? `Next unlock: ${next.name} (${next.slot}) at Level ${next.level}. ${next.level - summary.level.level} level milestone(s) to go.`
    : "The current universal reward catalogue is fully unlocked. New rewards can be added in a later policy catalogue version.";

  const equipped = renderEquippedProfile(summary.level.level);
  if (!summary.unlockedRewards.length) {
    const empty = document.createElement("p");
    empty.className = "meta-muted";
    empty.textContent = "No universal rewards unlocked yet. Reach Level 2 for First Light.";
    host.append(empty);
    return;
  }
  for (const reward of summary.unlockedRewards) {
    const card = document.createElement("article");
    card.className = "meta-unlock";
    const name = document.createElement("strong");
    name.textContent = reward.name;
    const meta = document.createElement("p");
    meta.className = "meta-muted";
    meta.textContent = `Level ${reward.level} · ${reward.slot}`;
    const description = document.createElement("p");
    description.className = "meta-muted";
    description.textContent = reward.description;
    card.append(name, meta, description);
    const equippedItem = equipped[reward.slot];
    const action = document.createElement("button");
    action.type = "button";
    action.className = "meta-button";
    action.style.marginTop = ".7rem";
    action.textContent = equippedItem?.id === reward.id ? "Unequip" : `Equip as ${reward.slot}`;
    action.addEventListener("click", () => {
      const result = equippedItem?.id === reward.id
        ? unequipReward(window.localStorage, reward.slot)
        : equipReward(window.localStorage, reward.id, summary.level.level);
      if (!result.ok) {
        action.textContent = "Could not save equipment";
        action.disabled = true;
        return;
      }
      render();
    });
    card.append(action);
    host.append(card);
  }
}

function renderProjects() {
  const host = byId("registered-projects");
  host.replaceChildren();
  let projects;
  try {
    projects = listRegisteredProjects(window.localStorage);
  } catch {
    const error = document.createElement("p");
    error.className = "meta-error";
    error.textContent = "Registered projects could not be read from browser storage.";
    host.append(error);
    return;
  }
  if (!projects.length) {
    const empty = document.createElement("p");
    empty.className = "meta-muted";
    empty.textContent = "No bespoke projects registered yet.";
    host.append(empty);
    return;
  }
  for (const project of projects) {
    const card = document.createElement("article");
    card.className = "meta-panel";
    card.style.marginTop = ".8rem";
    const heading = document.createElement("h3");
    heading.textContent = project.title;
    const meta = document.createElement("p");
    meta.className = "meta-muted";
    meta.textContent = `${project.moduleId} · ${project.baseExp} base EXP · ${project.difficulty} · registered ${new Date(project.registeredAt).toLocaleDateString()}`;
    const scope = document.createElement("p");
    scope.className = "meta-muted";
    scope.style.marginTop = ".7rem";
    scope.textContent = "Scope: " + project.scope;
    const criteria = document.createElement("p");
    criteria.className = "meta-muted";
    criteria.style.marginTop = ".5rem";
    criteria.textContent = "Acceptance criteria: " + project.criteria;
    card.append(heading, meta, scope, criteria);

    const actions = document.createElement("div");
    actions.className = "meta-project-actions";
    const status = document.createElement("span");
    status.className = project.completed ? "meta-muted" : "meta-exp";
    status.textContent = project.completed
      ? `Completed · +${number(project.award?.totalExp ?? 0)} EXP recorded`
      : "Not completed";
    actions.append(status);
    if (!project.completed) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "meta-button";
      button.textContent = "Confirm acceptance criteria and complete";
      button.addEventListener("click", () => {
        const accepted = window.confirm(
          `Confirm this project meets every acceptance criterion?\n\n${project.title}\n\n${project.criteria}\n\nThis action grants one immutable reward and cannot be repeated.`
        );
        if (!accepted) return;
        const result = completeProject(window.localStorage, project.projectId, { confirmed: true });
        status.textContent = result.ok
          ? result.duplicate ? "This project was already rewarded." : `Completed · +${number(result.record?.totalExp ?? 0)} EXP recorded`
          : "Completion failed: " + result.error;
        status.className = result.ok ? "meta-muted" : "meta-error";
        renderProjects();
        render();
      });
      actions.append(button);
    }
    card.append(actions);
    host.append(card);
  }
}

function installProjectForm() {
  const form = byId("project-form");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = byId("project-form-status");
    const input = {
      projectId: byId("project-id").value,
      moduleId: byId("project-module").value,
      title: byId("project-title").value,
      scope: byId("project-scope").value,
      criteria: byId("project-criteria").value,
      baseExp: Number(byId("project-base-exp").value),
      difficulty: byId("project-difficulty").value,
    };
    const result = registerProject(window.localStorage, input);
    if (!result.ok) {
      status.textContent = "Could not register project: " + result.error;
      status.className = "meta-error";
      return;
    }
    status.textContent = "Project registered. Its criteria, difficulty, and EXP value are now immutable.";
    status.className = "meta-muted";
    form.reset();
    byId("project-base-exp").value = "50";
    byId("project-module").value = "personal-projects";
    byId("project-difficulty").value = "intermediate";
    renderProjects();
  });
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

  renderLevelNotifications(summary.level.level);
  renderUnlocks(summary);
  renderProjects();

  const modules = byId("module-breakdown");
  modules.replaceChildren();
  if (!summary.sources.length) {
    const empty = document.createElement("p");
    empty.className = "meta-muted";
    empty.textContent = "No registered module progress is saved yet. Submit a Probability answer, complete a Math Trainer session, type a verified Bookkeys page, or practise in Metallurgy MT201–MT203 to begin.";
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
    empty.textContent = "No EXP awards yet. Submit a Probability answer, complete a qualifying Math Trainer session, type a verified Bookkeys page, practise in Metallurgy MT201–MT203, or complete a registered personal project.";
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
      } else if (award.moduleId === "bookkeys") {
        title = award.itemId.startsWith("bookkeys:page:")
          ? "Bookkeys · typed page"
          : award.itemId.startsWith("bookkeys:chapter:")
            ? "Bookkeys · chapter complete"
            : "Bookkeys · book complete";
      } else if (award.moduleId === "metallurgy-mt201") {
        title = "Metallurgy · MT201";
      } else if (award.moduleId === "metallurgy-mt202") {
        title = "Metallurgy · MT202";
      } else if (award.moduleId === "metallurgy-mt203") {
        title = "Metallurgy · MT203";
      }
      recent.append(makeRow(title, detail, "+" + number(award.totalExp) + " EXP"));
    }
  }
}

installProjectForm();
render();
window.addEventListener("storage", render);
window.addEventListener("limitless:rewards-updated", render);
document.addEventListener("visibilitychange", () => { if (!document.hidden) render(); });
