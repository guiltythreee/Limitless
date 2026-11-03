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
    pathwayHref: (pathwayId) => `/probability/?pathway=${encodeURIComponent(pathwayId)}#study`,
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
      <section className="mx-auto mb-16 mt-8 max-w-[1440px] px-5 md:px-10" aria-labelledby="probability-books-title">
        <div className="mb-5">
          <div className="eyebrow">Reference library</div>
          <h2 id="probability-books-title" className="serif mt-2 text-3xl text-parchment">Books</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-dim">Work through source-based problem books with saved question progress and detailed solutions.</p>
        </div>
        <Link href="/book-01/" className="panel group block max-w-xl p-6 transition hover:border-gold/50">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[.18em] text-gold">Book 01</span>
            <span className="text-gold transition group-hover:translate-x-1">→</span>
          </div>
          <h3 className="serif mt-4 text-2xl text-parchment">A First Course in Probability</h3>
          <p className="mt-2 text-sm leading-6 text-dim">Interactive problem book · Chapters 4 and 5 starter set · Worked solutions</p>
        </Link>
      </section>
    </>
  );
}
