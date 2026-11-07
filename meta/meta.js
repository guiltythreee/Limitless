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
  "bespoke-project": "Personal learning goal",
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
    error.textContent = "Your learning goals could not be loaded from browser storage.";
    host.append(error);
    return;
  }
  if (!projects.length) {
    const empty = document.createElement("p");
    empty.className = "meta-muted";
    empty.textContent = "No learning goals yet. Add one when you have something you want to work towards.";
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
    meta.textContent = `Added ${new Date(project.registeredAt).toLocaleDateString()}`;
    card.append(heading, meta);

    const actions = document.createElement("div");
    actions.className = "meta-project-actions";
    const status = document.createElement("span");
    status.className = project.completed ? "meta-muted" : "meta-exp";
    status.textContent = project.completed
      ? `Completed · +${number(project.award?.totalExp ?? 0)} EXP earned`
      : "In progress";
    actions.append(status);
    if (!project.completed) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "meta-button";
      button.textContent = "Mark as complete";
      button.addEventListener("click", () => {
        const accepted = window.confirm(
          `Mark “${project.title}” as complete? You can claim its reward only once.`
        );
        if (!accepted) return;
        const result = completeProject(window.localStorage, project.projectId, { confirmed: true });
        status.textContent = result.ok
          ? result.duplicate ? "This goal has already been completed." : `Completed · +${number(result.record?.totalExp ?? 0)} EXP earned`
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

const GOAL_TEMPLATES = {
  reading: {
    scope: (title) => `Finish the selected reading: ${title}.`,
    criteria: () => "Finish the book or selected reading and confirm that you have completed it.",
    baseExp: 50,
    difficulty: "intermediate",
    note: "Finish the book or the portion of reading you set out to complete. You confirm completion when you are done.",
  },
  course: {
    scope: (title) => `Complete the course or learning pathway: ${title}.`,
    criteria: () => "Complete the course or pathway content and reach its final completion point.",
    baseExp: 100,
    difficulty: "advanced",
    note: "Work through the course or pathway and mark it complete when you reach its final milestone.",
  },
  topic: {
    scope: (title) => `Study and understand the topic: ${title}.`,
    criteria: () => "Complete the selected study material and demonstrate the main ideas in a short self-check.",
    baseExp: 50,
    difficulty: "intermediate",
    note: "Study the topic using your chosen material, then complete a short self-check to confirm understanding.",
  },
  practice: {
    scope: (title) => `Complete a focused practice target for: ${title}.`,
    criteria: () => "Complete the practice target you set and review the results.",
    baseExp: 35,
    difficulty: "foundational",
    note: "Choose a manageable practice target, complete it, and review how you did.",
  },
  build: {
    scope: (title) => `Create and finish: ${title}.`,
    criteria: () => "Produce a finished, usable result that matches the stated goal.",
    baseExp: 75,
    difficulty: "advanced",
    note: "Build the thing you described and mark the goal complete when there is a finished result.",
  },
  research: {
    scope: (title) => `Investigate and summarise: ${title}.`,
    criteria: () => "Complete the investigation and produce a concise summary of the findings.",
    baseExp: 75,
    difficulty: "advanced",
    note: "Explore the question, check your sources, and write or save a concise summary of what you found.",
  },
};

function installProjectForm() {
  const form = byId("project-form");
  if (!form) return;
  let selectedTemplate = "reading";
  const note = byId("goal-template-note");
  const templateInput = byId("goal-template");
  const presetButtons = [...document.querySelectorAll("[data-template]")];

  function chooseTemplate(key) {
    if (!GOAL_TEMPLATES[key]) return;
    selectedTemplate = key;
    templateInput.value = key;
    note.textContent = GOAL_TEMPLATES[key].note;
    for (const button of presetButtons) {
      button.setAttribute("aria-pressed", String(button.dataset.template === key));
    }
  }
  for (const button of presetButtons) {
    button.addEventListener("click", () => chooseTemplate(button.dataset.template));
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = byId("project-form-status");
    const title = byId("project-title").value.trim();
    const template = GOAL_TEMPLATES[selectedTemplate];
    if (title.length < 5 || title.length > 120 || !template) {
      status.textContent = title.length < 5
        ? "Enter a goal using at least 5 characters."
        : title.length > 120
          ? "Keep the goal title to 120 characters or fewer."
          : "Choose a goal type before adding your goal.";
      status.className = "meta-error";
      byId("project-title").focus();
      return;
    }
    const slug = title.toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 42) || "learning-goal";
    const input = {
      projectId: `${slug}-${Date.now().toString(36)}`,
      moduleId: "personal-projects",
      title,
      scope: template.scope(title),
      criteria: template.criteria(title),
      baseExp: template.baseExp,
      difficulty: template.difficulty,
    };
    const result = registerProject(window.localStorage, input);
    if (!result.ok) {
      status.textContent = result.error === "duplicate-project-definition"
        ? "This learning goal is already on your list."
        : "Could not add this goal. Please try again.";
      status.className = "meta-error";
      return;
    }
    status.textContent = "Learning goal added.";
    status.className = "meta-muted";
    form.reset();
    chooseTemplate("reading");
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
    empty.textContent = "No registered module progress is saved yet. Complete an eligible Probability, Math Trainer, Bookkeys, or Metallurgy activity to begin.";
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
    empty.textContent = "No EXP awards yet. Submit a Probability answer, finish an eligible Math Trainer session, type a verified Bookkeys page, or practise in Metallurgy MT201–MT203.";
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
      } else if (award.moduleId === "metallurgy-mt201") {
        title = "Metallurgy · MT201";
      } else if (award.moduleId === "metallurgy-mt202") {
        title = "Metallurgy · MT202";
      } else if (award.moduleId === "metallurgy-mt203") {
        title = "Metallurgy · MT203";
      } else if (award.moduleId === "bookkeys") {
        title = award.itemId.startsWith("bookkeys:page:")
          ? "Bookkeys · typed page"
          : award.itemId.startsWith("bookkeys:chapter:")
            ? "Bookkeys · chapter complete"
            : "Bookkeys · book complete";
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
