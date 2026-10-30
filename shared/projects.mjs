import {
  calculateReward,
  DIFFICULTY_MULTIPLIER,
  readGlobalRewardSummary,
  REWARD_SOURCE_REGISTRY,
  sanitiseRewardRecords,
} from "./rewards.mjs";

export const PROJECT_REGISTRY_STORAGE_KEY = "limitless-lsr1-project-registry-v1";
export const PROJECT_SCHEMA_VERSION = 1;

const isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
const isString = (value) => typeof value === "string" && value.trim().length > 0;
const isFiniteNumber = (value) => typeof value === "number" && Number.isFinite(value);
const clean = (value) => typeof value === "string" ? value.trim() : "";
const PROJECT_ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function readJson(storage, key, fallback) {
  try {
    const raw = storage?.getItem(key);
    if (!raw) return fallback;
    const value = JSON.parse(raw);
    return isRecord(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function validateProject(input) {
  const projectId = clean(input?.projectId);
  const moduleId = clean(input?.moduleId);
  const title = clean(input?.title);
  const scope = clean(input?.scope);
  const criteria = clean(input?.criteria);
  const baseExp = Number(input?.baseExp);
  const difficulty = clean(input?.difficulty);

  if (!PROJECT_ID_RE.test(projectId) || projectId.length > 64) return { ok: false, error: "invalid-project-id" };
  if (moduleId !== "personal-projects" || !REWARD_SOURCE_REGISTRY.some((source) => source.moduleId === moduleId)) return { ok: false, error: "unregistered-module" };
  if (title.length < 5 || title.length > 120) return { ok: false, error: "invalid-title" };
  if (scope.length < 20 || scope.length > 2000) return { ok: false, error: "invalid-scope" };
  if (criteria.length < 20 || criteria.length > 2000) return { ok: false, error: "invalid-criteria" };
  if (!Number.isInteger(baseExp) || baseExp < 20 || baseExp > 100) return { ok: false, error: "invalid-base-exp" };
  if (!Object.prototype.hasOwnProperty.call(DIFFICULTY_MULTIPLIER, difficulty)) return { ok: false, error: "invalid-difficulty" };
  return {
    ok: true,
    project: { projectId, moduleId, title, scope, criteria, baseExp, difficulty },
  };
}

export function listRegisteredProjects(storage) {
  const payload = readJson(storage, PROJECT_REGISTRY_STORAGE_KEY, { projects: [] });
  const rawProjects = Array.isArray(payload.projects) ? payload.projects : [];
  const projects = rawProjects.filter((project) =>
    isRecord(project) &&
    typeof project.projectId === "string" &&
    project.moduleId === "personal-projects" &&
    typeof project.title === "string" &&
    typeof project.scope === "string" &&
    typeof project.criteria === "string" &&
    Number.isInteger(project.baseExp) &&
    project.baseExp >= 20 &&
    project.baseExp <= 100 &&
    typeof project.difficulty === "string" &&
    Object.prototype.hasOwnProperty.call(DIFFICULTY_MULTIPLIER, project.difficulty) &&
    isFiniteNumber(project.registeredAt) &&
    project.policyVersion === "LSR-1"
  );
  return projects.map((project) => {
    const source = REWARD_SOURCE_REGISTRY.find((item) => item.moduleId === project.moduleId);
    const root = source ? readJson(storage, source.storageKey, {}) : {};
    const records = sanitiseRewardRecords(root.rewardLedger);
    const completionId = "lsr1:project:" + project.projectId + ":complete";
    const award = records.find((record) =>
      record.eventId === completionId ||
      (record.moduleId === project.moduleId && record.itemId === "bespoke-project:" + project.projectId &&
        record.activityClass === "bespoke-project" && record.totalExp > 0)
    ) ?? null;
    return { ...project, completed: !!award, award };
  });
}

export function registerProject(storage, input, now = Date.now) {
  if (!storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function") {
    return { ok: false, error: "storage-unavailable" };
  }
  const validated = validateProject(input);
  if (!validated.ok) return validated;
  const payload = readJson(storage, PROJECT_REGISTRY_STORAGE_KEY, {});
  const projects = Array.isArray(payload.projects) ? payload.projects.filter(isRecord) : [];
  if (projects.some((project) => project.projectId === validated.project.projectId)) {
    return { ok: false, error: "project-id-already-registered" };
  }
  const normalizedSignature = (project) => [
    project.moduleId,
    project.title.toLowerCase().replace(/\s+/g, " "),
    project.scope.toLowerCase().replace(/\s+/g, " "),
    project.criteria.toLowerCase().replace(/\s+/g, " "),
  ].join("|");
  const signature = normalizedSignature(validated.project);
  if (projects.some((project) => normalizedSignature(project) === signature)) {
    return { ok: false, error: "duplicate-project-definition" };
  }

  const clockValue = now();
  const ts = Math.max(1, Math.round(isFiniteNumber(clockValue) ? clockValue : Date.now()));
  const project = {
    ...validated.project,
    registeredAt: ts,
    policyVersion: "LSR-1",
    schemaVersion: PROJECT_SCHEMA_VERSION,
  };
  try {
    storage.setItem(PROJECT_REGISTRY_STORAGE_KEY, JSON.stringify({
      ...payload,
      schemaVersion: PROJECT_SCHEMA_VERSION,
      projects: [...projects, project],
    }));
  } catch {
    return { ok: false, error: "storage-unavailable" };
  }
  return { ok: true, project };
}

/**
 * Complete a pre-registered project once. Effort, difficulty, scope and
 * acceptance criteria come from the immutable registration, not this call.
 */
export function completeProject(storage, projectId, options = {}) {
  if (!storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function") {
    return { ok: false, error: "storage-unavailable" };
  }
  if (options.confirmed !== true) return { ok: false, error: "acceptance-criteria-not-confirmed" };
  const project = listRegisteredProjects(storage).find((item) => item.projectId === projectId);
  if (!project) return { ok: false, error: "project-not-registered" };
  if (project.completed) return { ok: true, duplicate: true, record: project.award };

  const source = REWARD_SOURCE_REGISTRY.find((item) => item.moduleId === project.moduleId);
  if (!source) return { ok: false, error: "unregistered-module" };

  const payload = readJson(storage, source.storageKey, {});
  const prior = sanitiseRewardRecords(payload.rewardLedger);
  const eventId = "lsr1:project:" + project.projectId + ":complete";
  const duplicate = prior.find((record) => record.eventId === eventId ||
    (record.moduleId === project.moduleId && record.itemId === "bespoke-project:" + project.projectId &&
      record.activityClass === "bespoke-project"));
  if (duplicate) return { ok: true, duplicate: true, record: duplicate };

  const timestamp = isFiniteNumber(options.now) && options.now > 0 ? Math.round(options.now) : Date.now();
  const record = calculateReward({
    eventId,
    moduleId: project.moduleId,
    itemId: "bespoke-project:" + project.projectId,
    ts: timestamp,
    activityClass: "bespoke-project",
    difficulty: project.difficulty,
    completionEvidence: "registered-project-acceptance-criteria-confirmed",
    completed: true,
    // Project quality is self-attested in v1, so no subjective quality bonus.
    quality: 0,
    assignedBaseExp: project.baseExp,
  }, prior);

  try {
    storage.setItem(source.storageKey, JSON.stringify({
      ...payload,
      rewardLedger: [...prior, record],
    }));
  } catch {
    return { ok: false, error: "storage-unavailable" };
  }
  return { ok: true, duplicate: false, record, totalExp: readGlobalRewardSummary(storage).totalExp };
}
