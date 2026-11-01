"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

export function StudiesLanding({
  registration,
  homeHref = "/",
}: {
  registration: StudyDisciplineRegistration;
  homeHref?: string;
}) {
  const [snapshots, setSnapshots] = useState<readonly StudyProgressSnapshot[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setSnapshots(registration.readProgress?.() ?? []);
    } catch {
      // A failed projection is unknown, never a fabricated empty record.
      setSnapshots([]);
    }
    setReady(true);
  }, [registration]);

  const summary = summarizeStudyProgress(registration, snapshots);
  const courses = registration.content.filter((item) => item.kind === "course");
  const capabilities = registration.descriptor.capabilities;
  const pathways = registration.pathways;

  return (
    <main className="studies-landing">
      <section className="studies-landing__hero">
        <div className="studies-landing__eyebrow">Studies &amp; Disciplines</div>
        <h1>{registration.descriptor.title}</h1>
        <p>{registration.descriptor.description}</p>
        <a className="studies-landing__back" href={homeHref}>← Limitless home</a>
      </section>

      <section className="studies-landing__section" aria-labelledby="studies-progress-title">
        <div className="studies-landing__section-head">
          <div>
            <div className="studies-landing__eyebrow">Your record</div>
            <h2 id="studies-progress-title">Study progress</h2>
          </div>
          <span className="studies-landing__meta">
            {ready ? "Read-only · saved on this browser" : "Reading local progress…"}
          </span>
        </div>
        {ready && summary.unknown === summary.totalContent ? (
          <p className="studies-landing__notice">Progress is unavailable or the saved record could not be read. Your existing study data has not been changed.</p>
        ) : (
          <div className="studies-landing__stats">
            <div><strong>{summary.completed}</strong><span>Completed</span></div>
            <div><strong>{summary.inProgress}</strong><span>In progress</span></div>
            <div><strong>{summary.notStarted}</strong><span>Not started</span></div>
            <div><strong>{summary.unknown}</strong><span>Unknown</span></div>
          </div>
        )}
      </section>

      {courses.length > 0 && (
        <section className="studies-landing__section" aria-labelledby="studies-courses-title">
          <div className="studies-landing__section-head">
            <div>
              <div className="studies-landing__eyebrow">Learning routes</div>
              <h2 id="studies-courses-title">{courses.length === 1 ? "Course" : "Courses"}</h2>
            </div>
            <span className="studies-landing__meta">{courses.length} registered</span>
          </div>
          <div className="studies-landing__grid">
            {courses.map((course) => (
              <article className="studies-landing__card" key={course.id}>
                <div className="studies-landing__symbol" aria-hidden="true">{course.symbol ?? "◇"}</div>
                <h3>{course.title ?? course.id}</h3>
                {course.description && <p>{course.description}</p>}
                {course.capabilities && course.capabilities.length > 0 && (
                  <div className="studies-landing__tags">
                    {course.capabilities.map((capability) => (
                      <span key={capability}>{CAPABILITY_LABELS[capability] ?? capability}</span>
                    ))}
                  </div>
                )}
                {course.route && <Link className="studies-landing__open" href={course.route}>Open course →</Link>}
              </article>
            ))}
          </div>
        </section>
      )}

      {pathways.length > 0 && (
        <section className="studies-landing__section" aria-labelledby="studies-pathways-title">
          <div className="studies-landing__section-head">
            <div>
              <div className="studies-landing__eyebrow">Curated curriculum</div>
              <h2 id="studies-pathways-title">Learning pathways</h2>
            </div>
            <span className="studies-landing__meta">{pathways.length} pathways</span>
          </div>
          <div className="studies-landing__grid">
            {pathways.map((pathway) => (
              <article className="studies-landing__card studies-landing__pathway" key={pathway.id}>
                <h3>{pathway.title}</h3>
                {pathway.description && <p>{pathway.description}</p>}
                <span className="studies-landing__meta">{pathway.contentIds.length} canonical lessons</span>
                <Link className="studies-landing__open" href="/#path">Choose this pathway in the archive →</Link>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="studies-landing__section" aria-labelledby="studies-capabilities-title">
        <div className="studies-landing__eyebrow">Available study facilities</div>
        <h2 id="studies-capabilities-title">Discipline capabilities</h2>
        <div className="studies-landing__tags">
          {capabilities.map((capability) => (
            <span key={capability}>{CAPABILITY_LABELS[capability] ?? capability}</span>
          ))}
        </div>
        <p className="studies-landing__footnote">Facilities are shown only when declared by this discipline. Individual courses may provide a narrower set.</p>
      </section>
    </main>
  );
}
