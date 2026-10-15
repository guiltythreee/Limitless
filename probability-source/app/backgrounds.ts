
import type { CSSProperties } from "react";

// Background images live in public/backgrounds/.
//
// Dark desktop:       <lesson-id>.webp
// Dark phone:         <lesson-id>-phone.webp
// Light desktop:      <lesson-id>-light.webp
// Light phone:        <lesson-id>-light-phone.webp
//
// Light-mode images are optional. Until they exist, dark artwork is reused.

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

// These lessons have dedicated dark-mode phone artwork.
// Other lessons use their desktop artwork on phones.
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

// Add IDs here when the corresponding light-mode images are uploaded.
export const lessonsWithLightBackground = new Set<string>([]);
export const lessonsWithLightPhoneBackground = new Set<string>([]);

// The experiment tab borrows the sample-space (dice) background.
export const EXPERIMENT_BACKGROUND = "sample-space";

export function backgroundStyle(
  id: string,
): CSSProperties | undefined {
  if (!lessonsWithBackground.has(id)) return undefined;

  const darkDesktop = `url(/backgrounds/${id}.${BG_EXT})`;

  const darkPhone = lessonsWithPhoneBackground.has(id)
    ? `url(/backgrounds/${id}-phone.${BG_EXT})`
    : darkDesktop;

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
