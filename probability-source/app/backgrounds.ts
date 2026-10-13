import type { CSSProperties } from "react";

// Background art lives in public/backgrounds/.
//   <lesson-id>.webp        wide picture, used on desktop and tablet (both themes)
//   <lesson-id>-phone.webp  tall picture, used on phones (optional)
// To give a lesson a background, drop the file(s) in that folder and add its id below.
export const BG_EXT = "webp";

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

// Lessons that also have a tall phone picture. The others reuse the wide picture on phones.
export const lessonsWithPhoneBackground = new Set<string>([
  "sample-space",
  "events-operations",
  "set-theory",
  "mutually-exclusive",
  "exhaustive-partitions",
  "axioms",
  "equally-likely",
  "probability-counting",
  "de-morgan",
]);

// The experiment tab has no lesson of its own, so it borrows this one (the dice picture).
export const EXPERIMENT_BACKGROUND = "sample-space";

// Returns the CSS variables the .bg-layer class reads, or undefined when there is no picture.
export function backgroundStyle(id: string): CSSProperties | undefined {
  if (!lessonsWithBackground.has(id)) return undefined;
  const style: Record<string, string> = {
    "--bg": `url(/backgrounds/${id}.${BG_EXT})`,
  };
  if (lessonsWithPhoneBackground.has(id)) {
    style["--bg-phone"] = `url(/backgrounds/${id}-phone.${BG_EXT})`;
  }
  return style as CSSProperties;
}
