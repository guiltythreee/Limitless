import Link from "next/link";
import BookTwo from "./BookTwo";

export const metadata = {
  title: "Book Number 2 — Probability | Limitless",
  description: "Chapter-based reader for Introduction to Probability with detailed solutions and independent progress.",
};

export default function ProbabilityBookTwoPage() {
  return <main className="min-h-screen px-4 py-8 md:px-8">
    <header className="mx-auto mb-8 flex max-w-6xl items-center justify-between gap-4 border-b border-gold/20 pb-4">
      <Link href="/studies/" className="serif text-lg text-parchment">Probability Archive</Link>
      <Link href="/studies/" className="text-xs uppercase tracking-widest text-gold hover:text-parchment">← All books</Link>
    </header>
    <BookTwo />
  </main>;
}
