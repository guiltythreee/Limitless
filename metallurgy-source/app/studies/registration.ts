import { MT201_MANIFEST } from "../courses/manifests/mt201";
import { MT202_MANIFEST } from "../courses/manifests/mt202";
import { MT203_MANIFEST } from "../courses/manifests/mt203";
import type { CourseCapabilities } from "../courses/types";
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
} satisfies StudyDisciplineRegistration;
