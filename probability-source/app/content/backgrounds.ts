import type { CSSProperties } from "react";

// Background art. Files live in public/backgrounds/ and are named <lesson-id>.webp (and optionally <lesson-id>-phone.webp).
// To give a lesson a background, drop the two files in that folder and add its id to this list.
export const BG_EXT = "webp";
// The site is served from /probability/ when published, so picture addresses need that prefix.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const lessonsWithBackground = new Set<string>([
  "sample-space",
  "events-operations",
  "set-theory",
  "mutually-exclusive",
  "exhaustive-partitions",
  "axioms",
  "properties",
  "equally-likely",
  "probability-counting",
  "de-morgan",
  "continuity",
]);

// The experiment tab has no lesson of its own, so it borrows this one (the dice picture).
export const EXPERIMENT_BACKGROUND = "sample-space";

// Topics that also have a phone-sized picture (<id>-phone.webp). The others use the normal picture on phones too.
const hasPhone = new Set<string>([
  "sample-space", "events-operations", "set-theory", "mutually-exclusive", "exhaustive-partitions",
  "axioms", "equally-likely", "probability-counting", "de-morgan",
]);

// Topics that have separate <id>-light.webp and <id>-dark.webp pictures. Add an id here once you have made both.
const hasThemed = new Set<string>([]);

// Returns the CSS variables the .bg-layer class reads, or undefined when there is no picture.
export function backgroundStyle(id: string): CSSProperties | undefined {
  if (!lessonsWithBackground.has(id)) return undefined;
  const dark = hasThemed.has(id) ? `${id}-dark` : id;
  const light = hasThemed.has(id) ? `${id}-light` : id;
  return {
    "--bg-dark": `url(${BASE}/backgrounds/${dark}.${BG_EXT})`,
    "--bg-light": `url(${BASE}/backgrounds/${light}.${BG_EXT})`,
    "--bg-phone": `url(${BASE}/backgrounds/${hasPhone.has(id) ? `${id}-phone` : id}.${BG_EXT})`,
  } as CSSProperties;
}
