import type {
  StudyCapability,
  StudyContentId,
  StudyDisciplineRegistration,
  StudyProgressSnapshot,
} from "./contracts";

const CAPABILITIES = new Set<StudyCapability>([
  "theory", "examples", "practice", "assessment", "revision", "bookmarks",
  "drafts", "timers", "attempt-history", "analytics", "goals", "mastery",
]);

const isNonEmpty = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

/** Return validation errors; never mutates or repairs a registration. */
export function validateStudyRegistration(
  registration: StudyDisciplineRegistration,
): string[] {
  const errors: string[] = [];
  const descriptor = registration?.descriptor;
  if (!descriptor || !isNonEmpty(descriptor.id)) return ["descriptor.id is required"];
  if (!Array.isArray(registration.content)) errors.push("content must be an array");
  if (!Array.isArray(registration.pathways)) errors.push("pathways must be an array");
  if (!Array.isArray(descriptor.capabilities)) errors.push("descriptor.capabilities must be an array");
  if (!isNonEmpty(descriptor.title)) errors.push("descriptor.title is required");
  if (!isNonEmpty(descriptor.route)) errors.push("descriptor.route is required");
  if (!["active", "planned"].includes(descriptor.status)) errors.push("descriptor.status is invalid");

  const seenCapabilities = new Set<string>();
  for (const capability of descriptor.capabilities ?? []) {
    if (!CAPABILITIES.has(capability)) errors.push(`unknown capability: ${capability}`);
    if (seenCapabilities.has(capability)) errors.push(`duplicate capability: ${capability}`);
    seenCapabilities.add(capability);
  }

  const contentIds = new Set<StudyContentId>();
  for (const item of registration.content ?? []) {
    if (!isNonEmpty(item.id)) {
      errors.push("content item id is required");
      continue;
    }
    if (item.disciplineId !== descriptor.id) errors.push(`content ${item.id} belongs to another discipline`);
    if (contentIds.has(item.id)) errors.push(`duplicate content id: ${item.id}`);
    contentIds.add(item.id);
    if (item.capabilities) {
      const itemCapabilities = new Set<string>();
      for (const capability of item.capabilities) {
        if (!CAPABILITIES.has(capability)) errors.push("content " + item.id + " has unknown capability: " + capability);
        if (itemCapabilities.has(capability)) errors.push("content " + item.id + " repeats capability: " + capability);
        itemCapabilities.add(capability);
      }
    }
  }
  for (const item of registration.content ?? []) {
    if (item.parentId && !contentIds.has(item.parentId)) errors.push(`content ${item.id} has unknown parent: ${item.parentId}`);
  }

  const pathwayIds = new Set<string>();
  for (const pathway of registration.pathways ?? []) {
    if (!isNonEmpty(pathway.id)) {
      errors.push("pathway id is required");
      continue;
    }
    if (pathway.disciplineId !== descriptor.id) errors.push(`pathway ${pathway.id} belongs to another discipline`);
    if (pathwayIds.has(pathway.id)) errors.push(`duplicate pathway id: ${pathway.id}`);
    pathwayIds.add(pathway.id);

    const seenInPathway = new Set<string>();
    for (const contentId of pathway.contentIds ?? []) {
      if (!contentIds.has(contentId)) errors.push(`pathway ${pathway.id} references unknown content: ${contentId}`);
      if (seenInPathway.has(contentId)) errors.push(`pathway ${pathway.id} repeats content: ${contentId}`);
      seenInPathway.add(contentId);
    }
  }

  return errors;
}

/** Validate a complete registry, including discipline-ID uniqueness. */
export function validateStudyRegistry(
  registrations: readonly StudyDisciplineRegistration[],
): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const registration of registrations) {
    const id = registration?.descriptor?.id;
    if (isNonEmpty(id) && ids.has(id)) errors.push(`duplicate discipline id: ${id}`);
    if (isNonEmpty(id)) ids.add(id);
    errors.push(...validateStudyRegistration(registration));
  }
  return errors;
}

/**
 * Return pathway content once, preserving first-seen order.
 * A shared lesson in Statistics and Quant Finance remains one content item.
 */
export function uniquePathwayContentRefs(
  registrations: readonly StudyDisciplineRegistration[],
): Array<{ disciplineId: string; contentId: StudyContentId }> {
  const seen = new Set<string>();
  const result: Array<{ disciplineId: string; contentId: StudyContentId }> = [];
  for (const registration of registrations) {
    for (const pathway of registration.pathways) {
      for (const id of pathway.contentIds) {
        const key = `${registration.descriptor.id}::${id}`;
        if (seen.has(key)) continue;
        seen.add(key);
        result.push({ disciplineId: registration.descriptor.id, contentId: id });
      }
    }
  }
  return result;
}

/**
 * Read-only progress summary over canonical content IDs, not pathway appearances.
 * Mastery is deliberately not averaged because disciplines may use different
 * mastery definitions and scales.
 */
export function summarizeStudyProgress(
  registration: StudyDisciplineRegistration,
): {
  totalContent: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  unknown: number;
  snapshots: readonly StudyProgressSnapshot[];
} {
  const snapshots = registration.readProgress?.() ?? [];
  const byId = new Map(snapshots.map((snapshot) => [snapshot.contentId, snapshot]));
  let completed = 0;
  let inProgress = 0;
  let notStarted = 0;
  let unknown = 0;

  for (const item of registration.content) {
    const status = byId.get(item.id)?.status;
    if (status === "completed") completed++;
    else if (status === "in-progress") inProgress++;
    else if (status === "not-started") notStarted++;
    else unknown++;
  }

  return {
    totalContent: registration.content.length,
    completed,
    inProgress,
    notStarted,
    unknown,
    snapshots: [...snapshots],
  };
}
