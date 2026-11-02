 "use client";

import Link from "next/link";
import { createElement, useEffect, useState } from "react";
import type { StudyProgressSnapshot } from "../../../shared/studies/contracts";
import { PROBABILITY_STUDIES_REGISTRATION } from "./registration";
import { createStudiesLanding } from "../../../shared/studies/StudiesLanding";

export default function ProbabilityStudiesLanding() {
  const [snapshots, setSnapshots] = useState<readonly StudyProgressSnapshot[]>([]);
  const [progressReady, setProgressReady] = useState(false);

  useEffect(() => {
    try {
      setSnapshots(PROBABILITY_STUDIES_REGISTRATION.readProgress?.() ?? []);
    } catch {
      setSnapshots([]);
    }
    setProgressReady(true);
  }, []);

  const landing = createStudiesLanding(createElement, Link, {
    registration: PROBABILITY_STUDIES_REGISTRATION,
    snapshots,
    ready: progressReady,
    showPathways: true,
    // Next.js applies the configured production basePath (/probability) to Link hrefs.
    // Keep this route base-path-relative or it becomes /probability/probability/.
    pathwayHref: (pathwayId) => `/?pathway=${encodeURIComponent(pathwayId)}#study`,
  });

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-gold/15 bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-4 lg:px-10">
          <Link href="/" className="serif text-lg tracking-wide text-parchment">Probability Archive</Link>
          <a href="/" className="border border-gold/30 px-3 py-2 text-[10px] uppercase tracking-[.14em] text-gold transition hover:bg-gold/10">↖ Limitless</a>
        </div>
      </header>
      {landing}
    </>
  );
}
