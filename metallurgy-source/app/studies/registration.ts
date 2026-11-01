import { MT201_MANIFEST } from "../courses/manifests/mt201";
import { MT202_MANIFEST } from "../courses/manifests/mt202";
import { MT203_MANIFEST } from "../courses/manifests/mt203";
import type { CourseCapabilities } from "../courses/types";
import { ALL_QUESTION_IDS, TOPIC_OF } from "../data/qbank/meta";
import {
  activitySnapshot,
  readStoredProgress,
} from "../../../shared/studies/progress";
import type {
  StudyCapability,
  StudyContentRef,
  StudyDisciplineRegistration,
} from "../../../shared/studies/contracts";

const manifests = [MT201_MANIFEST, MT202_MANIFEST, MT203_MANIFEST];

function capabilitiesFor(source: CourseCapabilities): StudyCapability[] {
  const result: StudyCapability[] = [];
  if (source.theory) result.push("theory");
  if (source.formulas) result.push("formulas");
  if (source.examples) result.push("examples");
  if (source.practice) result.push("practice");
  if (source.exam) result.push("assessment");
  if (source.review) result.push("answer-review");
  if (source.weakArea || source.spacedRevision) result.push("revision");
  if (source.bookmarks) result.push("bookmarks");
  if (source.drafts) result.push("drafts");
  if (source.timers) result.push("timers");
  if (source.attemptHistory) result.push("attempt-history");
  if (source.analyticsCharts) result.push("analytics");
  if (source.goals) result.push("goals");
  if (source.mastery) result.push("mastery");
  if (source.tools) result.push("subject-tools");
  return result;
}

/** Capabilities available in every currently registered Metallurgy course. */
const sharedCapabilities: StudyCapability[] = [
  "practice",
  "assessment",
  "answer-review",
  "bookmarks",
  "timers",
  "attempt-history",
  "analytics",
  "goals",
];

const content: StudyContentRef[] = [];
for (const manifest of manifests) {
  content.push({
    id: manifest.id,
    disciplineId: "metallurgy",
    kind: "course",
    title: manifest.title,
    description: manifest.description,
    route: `/metallurgy/${manifest.route}`,
    capabilities: capabilitiesFor(manifest.capabilities),
  });

  for (const topic of manifest.topics) {
    const topicContentId = `${manifest.id}:${topic.id}`;
    content.push({
      id: topicContentId,
      disciplineId: "metallurgy",
      kind: "topic",
      title: topic.title,
      parentId: manifest.id,
      capabilities: capabilitiesFor(manifest.capabilities),
    });
    if (topic.hasLesson) {
      content.push({
        id: `${topicContentId}:lesson`,
        disciplineId: "metallurgy",
        kind: "lesson",
        title: topic.title,
        parentId: topicContentId,
        capabilities: ["theory"],
      });
    }
  }
}

/**
 * Metallurgy is one discipline with three separately described courses.
 * Course-level capability sets are retained because MT201, MT202 and MT203
 * do not offer identical learning features.
 */
export const METALLURGY_STUDIES_REGISTRATION = {
  descriptor: {
    id: "metallurgy",
    title: "Metallurgy",
    description: "Metallurgical Thermodynamics, Physical Metallurgy, and Polymer Science and Technology.",
    route: "/metallurgy",
    status: "active",
    capabilities: sharedCapabilities,
  },
  content,
  pathways: [],
  /**
   * Read each course's existing browser-local record directly. These reads
   * deliberately bypass loadProgress() so discovery cannot normalise, migrate,
   * or write course data. A malformed course record remains unknown.
   */
  readProgress: () => {
    if (typeof window === "undefined") return [];

    const snapshots = [];
    for (const manifest of manifests) {
      const stored = readStoredProgress(
        (key) => window.localStorage.getItem(key),
        manifest.storageKey,
      );
      if (stored.status !== "available") continue;

      const contentForCourse = content.filter((item) => item.id === manifest.id || item.parentId === manifest.id);
      const topicActivity = new Map<string, { count: number; lastAt?: number }>();
      let totalActivity = 0;
      let lastActivityAt = 0;

      if (manifest.id === "mt203") {
        const attempts = Array.isArray(stored.value.attempts) ? stored.value.attempts : [];
        const validIds = new Set(ALL_QUESTION_IDS);
        for (const raw of attempts) {
          if (!raw || typeof raw !== "object") continue;
          const attempt = raw as { q?: unknown; ts?: unknown };
          if (typeof attempt.q !== "string" || !validIds.has(attempt.q)) continue;
          const topicId = TOPIC_OF[attempt.q];
          if (!topicId) continue;
          const current = topicActivity.get(topicId) ?? { count: 0 };
          current.count++;
          if (typeof attempt.ts === "number" && Number.isFinite(attempt.ts) && attempt.ts > 0) {
            current.lastAt = Math.max(current.lastAt ?? 0, attempt.ts);
            lastActivityAt = Math.max(lastActivityAt, attempt.ts);
          }
          topicActivity.set(topicId, current);
          totalActivity++;
        }
      } else {
        const answered = stored.value.answered;
        if (!answered || typeof answered !== "object" || Array.isArray(answered)) continue;
        for (const topic of manifest.topics) {
          const prefix = `${topic.id}-q`;
          let count = 0;
          let lastAt = 0;
          for (const [questionId, raw] of Object.entries(answered as Record<string, unknown>)) {
            if (!questionId.startsWith(prefix) || !raw || typeof raw !== "object") continue;
            count++;
            const at = (raw as { at?: unknown }).at;
            if (typeof at === "number" && Number.isFinite(at) && at > 0) {
              lastAt = Math.max(lastAt, at);
              lastActivityAt = Math.max(lastActivityAt, at);
            }
          }
          if (count) topicActivity.set(topic.id, { count, lastAt: lastAt || undefined });
          totalActivity += count;
        }
      }

      for (const topic of manifest.topics) {
        const id = `${manifest.id}:${topic.id}`;
        const activity = topicActivity.get(topic.id);
        snapshots.push(activitySnapshot(id, activity?.count ?? 0, activity?.lastAt));
        // Lesson content is a separate catalogue node. Only expose its status
        // when the course has a persisted lesson-read signal; question attempts
        // alone do not prove that the theory lesson was completed.
      }

      snapshots.push(activitySnapshot(manifest.id, totalActivity, lastActivityAt));
    }
    return snapshots;
  },
} satisfies StudyDisciplineRegistration;
