
import type { CSSProperties } from "react";

// Background art lives in public/backgrounds/.
//
// Dark desktop:       <lesson-id>.webp
// Dark phone:         <lesson-id>-phone.webp
// Light desktop:      <lesson-id>-light.webp
// Light phone:        <lesson-id>-light-phone.webp
//
// Light images are optional. Until they are added, the dark image is used
// as the fallback in light mode. Phone images are also optional.

export const BG_EXT = "webp";

export const lessonsWithBackground = new Set<string>([
  "sample-space",
  "events-operations",
  "set-theory",
  "mutually-exclusive",
  "exhaustive-partitions",
  "counting",
  "combinations",
  "multinomials",
  "axioms",
  "properties",
  "equally-likely",
  "probability-counting",
  "geometric-probability",
  "de-morgan",
  "continuity",
  "borel-cantelli",
]);

// Lessons with a dedicated dark-mode phone image.
// Lessons not listed here use their desktop image on phones.
export const lessonsWithPhoneBackground = new Set<string>([
  "sample-space",
  "events-operations",
  "set-theory",
  "mutually-exclusive",
  "exhaustive-partitions",
  "counting",
  "combinations",
  "multinomials",
  "axioms",
  "equally-likely",
  "probability-counting",
  "de-morgan",
]);

// Add a lesson ID here when its light-mode desktop image is available.
export const lessonsWithLightBackground = new Set<string>([]);

// Add a lesson ID here when its light-mode phone image is available.
export const lessonsWithLightPhoneBackground = new Set<string>([]);

// The experiment tab has no lesson of its own, so it borrows the sample-space background.
export const EXPERIMENT_BACKGROUND = "sample-space";

export function backgroundStyle(
  id: string,
): CSSProperties | undefined {
  if (!lessonsWithBackground.has(id)) return undefined;

  const darkDesktop = `url(/backgrounds/${id}.${BG_EXT})`;
  const darkPhone = lessonsWithPhoneBackground.has(id)
    ? `url(/backgrounds/${id}-phone.${BG_EXT})`
    : darkDesktop;

  // Until light artwork exists, light mode falls back to dark artwork.
  const lightDesktop = lessonsWithLightBackground.has(id)
    ? `url(/backgrounds/${id}-light.${BG_EXT})`
    : darkDesktop;

  const lightPhone = lessonsWithLightPhoneBackground.has(id)
    ? `url(/backgrounds/${id}-light-phone.${BG_EXT})`
    : lightDesktop;

  const style: Record<string, string> = {
    "--bg-dark": darkDesktop,
    "--bg-light": lightDesktop,
    "--bg-phone": darkPhone,
    "--bg-phone-light": lightPhone,
  };

  return style as CSSProperties;
}
