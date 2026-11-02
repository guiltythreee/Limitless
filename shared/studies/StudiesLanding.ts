import type {
  StudyDisciplineRegistration,
  StudyProgressSnapshot,
} from "./contracts";
import { summarizeStudyProgress } from "./registry";

type ElementFactory = (...args: any[]) => any;

/** Shared composition; app-local React and Next Link are injected by the host. */
export function createStudiesLanding(
  createElement: ElementFactory,
  LinkComponent: any,
  {
    registration, snapshots, ready, homeHref = "/", showPathways = true,
  }: {
    registration: StudyDisciplineRegistration;
    snapshots: readonly StudyProgressSnapshot[];
    ready: boolean;
    homeHref?: string;
    showPathways?: boolean;
  },
) {
  const h = createElement;
  const summary = summarizeStudyProgress(registration, snapshots);
  const courses = registration.content.filter((item) => item.kind === "course");
  const pathways = registration.pathways;
  const progressPercent = summary.totalContent
    ? Math.round((summary.completed / summary.totalContent) * 100)
    : 0;
  const byId = new Map(snapshots.map((snapshot) => [snapshot.contentId, snapshot]));
  return h("main", { className: "studies-landing" },
    h("nav", { className: "studies-landing__subnav", "aria-label": "Page sections" },
      h("a", { href: homeHref }, "← Limitless"),
      h("span", { "aria-hidden": "true" }, "／"),
      h("a", { href: "#courses" }, courses.length === 1 ? "Course" : "Courses"),
      showPathways && pathways.length > 0 && h("a", { href: "#pathways" }, "Pathways"),
    ),
    h("section", { className: "studies-landing__hero" },
      h("div", { className: "studies-landing__hero-copy" },
        h("div", { className: "studies-landing__eyebrow" }, "Studies & Disciplines"),
        h("h1", null, registration.descriptor.title),
        h("p", null, registration.descriptor.description),
        h("div", { className: "studies-landing__hero-meta" },
          h("span", null, registration.descriptor.status === "active" ? "Active discipline" : "Planned discipline"),
          h("span", null, courses.length + (courses.length === 1 ? " learning route" : " learning routes")),
          showPathways && h("span", null, pathways.length + (pathways.length === 1 ? " pathway" : " pathways")),
        ),
      ),
      h("div", { className: "studies-landing__hero-mark", "aria-hidden": "true" },
        h("span", null, courses[0]?.symbol ?? "◇"),
        h("small", null, "LIMITLESS"),
      ),
    ),
    h("section", { className: "studies-landing__section studies-landing__progress", "aria-labelledby": "studies-progress-title" },
      h("div", { className: "studies-landing__section-head" },
        h("div", null,
          h("div", { className: "studies-landing__eyebrow" }, "Your record"),
          h("h2", { id: "studies-progress-title" }, "Study progress"),
        ),
        h("span", { className: "studies-landing__meta" },
          ready ? "Read-only · existing browser data" : "Reading saved progress…"),
      ),
      ready && summary.unknown === summary.totalContent
        ? h("p", { className: "studies-landing__notice" },
            "Progress is unavailable or the saved record could not be read. Your existing study data has not been changed.")
        : h("div", { className: "studies-landing__progress-body" },
            h("div", { className: "studies-landing__progress-track", role: "img",
              "aria-label": progressPercent + "% of registered content explicitly completed" },
              h("span", { style: { width: progressPercent + "%" } }),
            ),
            h("div", { className: "studies-landing__stats" },
              ...[
                ["Completed", summary.completed, "completed"],
                ["In progress", summary.inProgress, "active"],
                ["Not started", summary.notStarted, "idle"],
                ["Unknown", summary.unknown, "unknown"],
              ].map(([label, value, tone]) => h("div", {
                className: "studies-landing__stat studies-landing__stat--" + tone, key: label,
              }, h("strong", null, value), h("span", null, label))),
            ),
          ),
      h("p", { className: "studies-landing__footnote" },
        "Counts use canonical registered content, not pathway appearances. Attempts are not treated as mastery."),
    ),
    courses.length > 0 && h("section", { id: "courses", className: "studies-landing__section", "aria-labelledby": "studies-courses-title" },
      h("div", { className: "studies-landing__section-head" },
        h("div", null,
          h("div", { className: "studies-landing__eyebrow" }, "Start learning"),
          h("h2", { id: "studies-courses-title" }, courses.length === 1 ? "Course" : "Courses"),
        ),
        h("span", { className: "studies-landing__meta" }, "Choose a learning route"),
      ),
      h("div", { className: "studies-landing__grid studies-landing__grid--courses" },
        ...courses.map((course, index) => {
          const status = byId.get(course.id)?.status;
          const statusLabel = status === "completed" ? "Completed"
            : status === "in-progress" ? "In progress"
            : status === "not-started" ? "Not started" : "Progress unknown";
          return h(LinkComponent, {
            className: "studies-landing__card studies-landing__course",
            key: course.id,
            href: course.route ?? homeHref,
            "aria-label": "Open " + (course.title ?? course.id),
          },
            h("div", { className: "studies-landing__card-top" },
              h("span", { className: "studies-landing__symbol", "aria-hidden": "true" }, course.symbol ?? "◇"),
              h("span", { className: "studies-landing__index" }, String(index + 1).padStart(2, "0")),
            ),
            h("h3", null, course.title ?? course.id),
            course.description && h("p", null, course.description),
            h("div", { className: "studies-landing__card-bottom" },
              h("span", { className: "studies-landing__course-status" }, statusLabel),
            ),
          );
        }),
      ),
    ),
    showPathways && pathways.length > 0 && h("section", { id: "pathways", className: "studies-landing__section", "aria-labelledby": "studies-pathways-title" },
      h("div", { className: "studies-landing__section-head" },
        h("div", null,
          h("div", { className: "studies-landing__eyebrow" }, "Curated curriculum"),
          h("h2", { id: "studies-pathways-title" }, "Learning pathways"),
        ),
        h("span", { className: "studies-landing__meta" }, "Different routes through the same canonical lessons"),
      ),
      h("div", { className: "studies-landing__grid studies-landing__grid--pathways" },
        ...pathways.map((pathway, index) => {
          const pathwayProgress = pathway.contentIds.map((id) => byId.get(id)?.status);
          const completedInPathway = pathwayProgress.filter((status) => status === "completed").length;
          const inProgressInPathway = pathwayProgress.filter((status) => status === "in-progress").length;
          return h(LinkComponent, {
            className: "studies-landing__card studies-landing__pathway",
            key: pathway.id,
            href: `/?pathway=${encodeURIComponent(pathway.id)}#study`,
            "aria-label": "Open " + pathway.title + " learning pathway",
          },
            h("div", { className: "studies-landing__pathway-number" }, "PATHWAY " + String(index + 1).padStart(2, "0")),
            h("h3", null, pathway.title),
            pathway.description && h("p", null, pathway.description),
            h("span", { className: "studies-landing__meta" },
              pathway.sequenceLabel ?? (pathway.contentIds.length + " lessons")),
            h("div", { className: "studies-landing__meta" },
              completedInPathway + " / " + pathway.contentIds.length + " completed" +
              (inProgressInPathway ? " · " + inProgressInPathway + " in progress" : "")),
          );
        }),
      ),
    ),
  );
}
