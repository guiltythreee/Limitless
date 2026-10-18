// Shared types + chapter loader for the MT202 archive.

export type Option = { label: string; text: string };

export type Question = {
  n: number;
  stars: number;
  type: string; // A..G
  traps: string[]; // P1..P3
  text: string;
  statements: { num: number; text: string }[];
  tableRows: string[][];
  assertion: string;
  reason: string;
  options: Option[];
  answer: string;
  keyExplanation: string;
  concise: string;
  detailed: string;
};

export type Chapter = {
  id: string;
  num: number;
  title: string;
  topics: { id: string; title: string }[];
  questions: Question[];
};

export const TYPE_NAMES: Record<string, string> = {
  A: "single-correct",
  B: "multiple-correct",
  C: "assertion–reason",
  D: "match",
  E: "numerical",
  F: "true / false",
  G: "data reading",
};

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
const cache = new Map<string, Promise<Chapter>>();

export function loadChapter(id: string): Promise<Chapter> {
  let p = cache.get(id);
  if (!p) {
    p = fetch(`${BASE}/data/mt202/${id}.json`).then((r) => {
      if (!r.ok) throw new Error(`failed to load ${id}: ${r.status}`);
      return r.json() as Promise<Chapter>;
    });
    cache.set(id, p);
  }
  return p;
}

export const CHAPTER_IDS = ["ch01", "ch02", "ch03", "ch04", "ch05", "ch06", "ch07", "ch08", "ch09"];
export const LESSON_IDS = CHAPTER_IDS.filter((c) => c !== "ch09");
