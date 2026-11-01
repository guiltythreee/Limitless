import type {
  StudyDisciplineRegistration,
  StudyProgressSnapshot,
} from "./contracts";
import { summarizeStudyProgress } from "./registry";

const CAPABILITY_LABELS: Record<string, string> = {
  theory: "Theory",
  formulas: "Formulas",
  examples: "Examples",
  practice: "Practice",
  assessment: "Assessments",
  "answer-review": "Answer review",
  revision: "Revision",
  "subject-tools": "Subject tools",
  bookmarks: "Bookmarks",
  drafts: "Drafts",
  timers: "Timers",
  "attempt-history": "Attempt history",
  analytics: "Analytics",
  goals: "Goals",
  mastery: "Mastery",
};

type ElementFactory = (...args: any[]) => any;

/**
 * Shared markup factory: React and Next Link are injected by each app so this
 * framework-neutral shared folder does not resolve app-local packages.
 */
export function createStudiesLanding(
  createElement: ElementFactory,
  LinkComponent: any,
  {
    registration,
    snapshots,
    ready,
    homeHref = "/",
  }: {
    registration: StudyDisciplineRegistration;
    snapshots: readonly StudyProgressSnapshot[];
    ready: boolean;
    homeHref?: string;
  },
) {
  const h = createElement;
  const summary = summarizeStudyProgress(registration, snapshots);
  const courses = registration.content.filter((item) => item.kind === "course");
  const capabilities = registration.descriptor.capabilities;
  const pathways = registration.pathways;
  const tags = (items: readonly string[]) => h(
    "div",
    { className: "studies-landing__tags" },
    ...items.map((capability) => h(
      "span",
      { key: capability },
      CAPABILITY_LABELS[capability] ?? capability,
    )),
  );

  return h(
    "main",
    { className: "studies-landing" },
    h(
      "section",
      { className: "studies-landing__hero" },
      h("div", { className: "studies-landing__eyebrow" }, "Studies & Disciplines"),
      h("h1", null, registration.descriptor.title),
      h("p", null, registration.descriptor.description),
      h("a", { className: "studies-landing__back", href: homeHref }, "← Limitless home"),
    ),
    h(
      "section",
      { className: "studies-landing__section", "aria-labelledby": "studies-progress-title" },
      h(
        "div",
        { className: "studies-landing__section-head" },
        h(
          "div",
          null,
          h("div", { className: "studies-landing__eyebrow" }, "Your record"),
          h("h2", { id: "studies-progress-title" }, "Study progress"),
        ),
        h("span", { className: "studies-landing__meta" },
          ready ? "Read-only · saved on this browser" : "Reading local progress…"),
      ),
      ready && summary.unknown === summary.totalContent
        ? h("p", { className: "studies-landing__notice" },
            "Progress is unavailable or the saved record could not be read. Your existing study data has not been changed.")
        : h(
            "div",
            { className: "studies-landing__stats" },
            ...[
              ["Completed", summary.completed],
              ["In progress", summary.inProgress],
              ["Not started", summary.notStarted],
              ["Unknown", summary.unknown],
            ].map(([label, value]) => h(
              "div",
              { key: label },
              h("strong", null, value),
              h("span", null, label),
            )),
          ),
    ),
    courses.length > 0 && h(
      "section",
      { className: "studies-landing__section", "aria-labelledby": "studies-courses-title" },
      h(
        "div",
        { className: "studies-landing__section-head" },
        h(
          "div",
          null,
          h("div", { className: "studies-landing__eyebrow" }, "Learning routes"),
          h("h2", { id: "studies-courses-title" }, courses.length === 1 ? "Course" : "Courses"),
        ),
        h("span", { className: "studies-landing__meta" }, courses.length + " registered"),
      ),
      h(
        "div",
        { className: "studies-landing__grid" },
        ...courses.map((course) => h(
          "article",
          { className: "studies-landing__card", key: course.id },
          h("div", { className: "studies-landing__symbol", "aria-hidden": "true" }, course.symbol ?? "◇"),
          h("h3", null, course.title ?? course.id),
          course.description && h("p", null, course.description),
          course.capabilities?.length ? tags(course.capabilities) : null,
          course.route && h(LinkComponent, {
            className: "studies-landing__open",
            href: course.route,
          }, "Open course →"),
        )),
      ),
    ),
    pathways.length > 0 && h(
      "section",
      { className: "studies-landing__section", "aria-labelledby": "studies-pathways-title" },
      h(
        "div",
        { className: "studies-landing__section-head" },
        h(
          "div",
          null,
          h("div", { className: "studies-landing__eyebrow" }, "Curated curriculum"),
          h("h2", { id: "studies-pathways-title" }, "Learning pathways"),
        ),
        h("span", { className: "studies-landing__meta" }, pathways.length + " pathways"),
      ),
      h(
        "div",
        { className: "studies-landing__grid" },
        ...pathways.map((pathway) => h(
          "article",
          { className: "studies-landing__card studies-landing__pathway", key: pathway.id },
          h("h3", null, pathway.title),
          pathway.description && h("p", null, pathway.description),
          h("span", { className: "studies-landing__meta" }, pathway.contentIds.length + " canonical lessons"),
          h(LinkComponent, {
            className: "studies-landing__open",
            href: "/#path",
          }, "Choose this pathway in the archive →"),
        )),
      ),
    ),
    h(
      "section",
      { className: "studies-landing__section", "aria-labelledby": "studies-capabilities-title" },
      h("div", { className: "studies-landing__eyebrow" }, "Available study facilities"),
      h("h2", { id: "studies-capabilities-title" }, "Discipline capabilities"),
      tags(capabilities),
      h("p", { className: "studies-landing__footnote" },
        "Facilities are shown only when declared by this discipline. Individual courses may provide a narrower set."),
    ),
  );
}
