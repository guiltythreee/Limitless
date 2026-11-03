import Link from "next/link";
import BookOne from "./BookOne";

export const metadata = {
  title: "Book Number 1 — Probability | Limitless",
  description: "Interactive problem book for probability, with worked solutions and saved reading progress.",
};

export default function ProbabilityBookOnePage() {
  return (
    <main className="min-h-screen px-4 py-8 md:px-8">
      <header className="mx-auto mb-8 flex max-w-6xl items-center justify-between gap-4 border-b border-gold/20 pb-4">
        <Link href="/studies/" className="serif text-lg text-parchment">Probability Archive</Link>
        <Link href="/studies/" className="text-xs uppercase tracking-widest text-gold hover:text-parchment">← All books</Link>
      </header>
      <BookOne />
    </main>
  );
}
