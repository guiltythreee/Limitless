import Link from "next/link";
import { PROBABILITY_STUDIES_REGISTRATION } from "./registration";
import { StudiesLanding } from "../../../shared/studies/StudiesLanding";

export default function ProbabilityStudiesLanding() {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-gold/15 bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-4 lg:px-10">
          <Link href="/" className="serif text-lg tracking-wide text-parchment">Probability Archive</Link>
          <a href="/" className="border border-gold/30 px-3 py-2 text-[10px] uppercase tracking-[.14em] text-gold transition hover:bg-gold/10">↖ Limitless</a>
        </div>
      </header>
      <StudiesLanding registration={PROBABILITY_STUDIES_REGISTRATION} />
    </>
  );
}
